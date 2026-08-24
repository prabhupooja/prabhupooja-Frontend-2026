import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../Axios/api";
import "../../styles/kalsharpdosh.css";
import BookPoojaForm from "../onlinepuja/bookpoojaform";
import StarRatings from "react-star-ratings";
import RatingsPopup from "./ratingpopup";
import { TailSpin } from "react-loader-spinner";
import useAuthStore from "../../Store/UserStore/userAuthStore";
import usePujaStore from "../../Store/PoojaStore/PoojaStore";
import useProblemPoojaStore from "../../Store/ProblemPoojaStore/ProblemPoojaStore";
import CryptoJS from "crypto-js";
import Swal from "sweetalert2";
import NewLoader from "../NewLoader/NewLoader";
import Poojapanditprofile from "../onlinepuja/poojapanditprofile";
import { parseContentToList } from "../../utils/poojaContentHelper";

const PoojaDetailMasterPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user1, isLoggin, setIsLoginPopup } = useAuthStore();
  const { getCurrectDate, currentDate } = useProblemPoojaStore();

  const {
    error,
    getPoojaDetails,
    pujaDetails,
    getPoojaRating,
    loading,
    bookingDate,
    getBookingDate,
  } = usePujaStore();

  const [averageRating, setAverageRating] = useState(0);
  const [showRatingsPopup, setShowRatingsPopup] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedPackageIndex, setSelectedPackageIndex] = useState(0);
  const [panditsList, setPanditsList] = useState([]);
  const [openSections, setOpenSections] = useState({
    samagri: true,
    benefits: true,
    howItHappens: true,
    aboutPooja: true,
    afterPooja: true,
    whyUs: true,
  });

  const panditSliderRef = useRef(null);

  const scrollPandits = (direction) => {
    if (panditSliderRef.current) {
      const scrollAmount = direction === "left" ? -320 : 320;
      panditSliderRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const toggleSection = (key) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [loading1, setLoading1] = useState(false);
  const [areDatesEqual, setAreDatesEqual] = useState(false);
  const [bookingDateGreater, setBookingDateGreater] = useState(false);
  const [bookingDateSmaller, setBookingDateSmaller] = useState(false);

  const decryptId = (encryptedIdFromUrl) => {
    if (!encryptedIdFromUrl) return "";
    try {
      const decodedId = decodeURIComponent(encryptedIdFromUrl);
      const bytes = CryptoJS.AES.decrypt(decodedId, "prabhupooja2024");
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      if (decrypted && decrypted.trim().length > 0) {
        return decrypted;
      }
    } catch (e) {
      // Fallback if not AES encrypted
    }
    return decodeURIComponent(encryptedIdFromUrl);
  };

  const decryptedId = decryptId(id);

  const getCountdownTargetTime = (details) => {
    if (!details) return null;

    // 1. Direct check for countdown_datetime or pooja_date + pooja_time from backend API
    if (details.countdown_datetime) {
      const parsed = new Date(details.countdown_datetime).getTime();
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }

    if (details.pooja_date) {
      const dateStr = `${details.pooja_date}T${details.pooja_time || "00:00:00"}`;
      const parsed = new Date(dateStr).getTime();
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }

    // 2. Check other target date or countdown fields from backend/admin
    const dateField =
      details.countdown_date ||
      details.target_date ||
      details.event_date ||
      details.expiry_date ||
      details.timer_end ||
      details.date;

    const timeField =
      details.countdown_time ||
      details.target_time ||
      details.time;

    if (dateField) {
      let dateString = dateField;
      if (
        timeField &&
        typeof dateField === "string" &&
        !dateField.includes("T") &&
        !dateField.includes(":")
      ) {
        dateString = `${dateField}T${timeField}`;
      }

      const parsed = new Date(dateString).getTime();
      if (!isNaN(parsed) && parsed > 0) {
        return parsed;
      }
    }

    // Check for admin duration input fields (days, hours, minutes, seconds)
    const hasDays = details.countdown_days !== undefined || details.days !== undefined;
    const hasHours = details.countdown_hours !== undefined || details.hours !== undefined;
    const hasMinutes = details.countdown_minutes !== undefined || details.minutes !== undefined;
    const hasSeconds = details.countdown_seconds !== undefined || details.seconds !== undefined;

    if (hasDays || hasHours || hasMinutes || hasSeconds) {
      const d = Number(details.countdown_days ?? details.days ?? 0);
      const h = Number(details.countdown_hours ?? details.hours ?? 0);
      const m = Number(details.countdown_minutes ?? details.minutes ?? 0);
      const s = Number(details.countdown_seconds ?? details.seconds ?? 0);

      const totalDurationMs = (d * 86400 + h * 3600 + m * 60 + s) * 1000;
      if (totalDurationMs > 0) {
        const startTime = details.updated_at || details.created_at || details.updatedAt || details.createdAt;
        if (startTime) {
          const parsedStart = new Date(startTime).getTime();
          if (!isNaN(parsedStart)) {
            return parsedStart + totalDurationMs;
          }
        }
        const cacheKey = `pooja_countdown_${details.id || "default"}`;
        const cachedTarget = localStorage.getItem(cacheKey);
        if (cachedTarget) {
          const parsedCached = Number(cachedTarget);
          if (!isNaN(parsedCached) && parsedCached > Date.now()) {
            return parsedCached;
          }
        }
        const target = Date.now() + totalDurationMs;
        localStorage.setItem(cacheKey, target.toString());
        return target;
      }
    }

    return null;
  };

  useEffect(() => {
    const targetTimestamp = getCountdownTargetTime(pujaDetails);

    const updateTimer = () => {
      const currentTime = new Date().getTime();
      let diff = 0;

      if (targetTimestamp) {
        diff = targetTimestamp - currentTime;
      } else {
        // Fallback: Countdown to next midnight
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 1);
        targetDate.setHours(0, 0, 0, 0);
        diff = targetDate.getTime() - currentTime;
      }

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [pujaDetails]);

  const fetchPujaDetails = async () => {
    if (decryptedId) {
      await getPoojaDetails(decryptedId);
    }
  };

  const fetchPujaRatings = async () => {
    if (decryptedId) {
      const res = await getPoojaRating(decryptedId, "normal");
      if (res?.data?.success) {
        setAverageRating(res.data.data.averageRating);
      }
    }
  };

  const fetchBookingDate = async () => {
    if (decryptedId && user1?.id) {
      await getBookingDate(decryptedId, user1.id);
    }
  };

  const fetchCurrentgDate = async () => {
    await getCurrectDate();
  };

  useEffect(() => {
    if (!decryptedId) return;
    fetchPujaDetails();
    fetchPujaRatings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [decryptedId]);

  useEffect(() => {
    if (user1 && isLoggin) {
      fetchBookingDate();
      fetchCurrentgDate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user1, isLoggin, decryptedId]);

  useEffect(() => {
    const loadPandits = async () => {
      if (pujaDetails?.pandits && Array.isArray(pujaDetails.pandits) && pujaDetails.pandits.length > 0) {
        setPanditsList(pujaDetails.pandits);
        return;
      }
      if (decryptedId) {
        try {
          const res = await api.get(`/user/onlinePuja/${decryptedId}/pandits`);
          if (res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
            setPanditsList(res.data.data);
          }
        } catch (e) {
          console.warn("Could not fetch assigned pandits:", e);
        }
      }
    };
    loadPandits();
  }, [pujaDetails, decryptedId]);

  useEffect(() => {
    if (user1 && bookingDate && currentDate) {
      setLoading1(true);
      const normalizeDate = (date) => new Date(new Date(date).setHours(0, 0, 0, 0));
      const currentDateObj = normalizeDate(currentDate);
      const bookingDateObj = normalizeDate(bookingDate);
      setAreDatesEqual(currentDateObj.getTime() === bookingDateObj.getTime());
      setBookingDateGreater(
        currentDateObj.getTime() < bookingDateObj.getTime()
      );
      setBookingDateSmaller(
        currentDateObj.getTime() > bookingDateObj.getTime()
      );
      setLoading1(false);
    } else {
      setAreDatesEqual(false);
      setBookingDateGreater(false);
      setBookingDateSmaller(false);
      setLoading1(false);
    }
  }, [currentDate, bookingDate, user1]);

  const handleLivePooja = async () => {
    try {
      const roomName = pujaDetails?.name?.replace(/\s+/g, "") || "PoojaRoom";
      const response = await api.post("/live_stream/token", {
        user_id: user1.id,
        room: roomName,
      });
      if (response.data.success) {
        navigate(
          ` /videoCall/${encodeURIComponent(roomName)}/${response.data.token}`
        );
      } else {
        console.error("Failed to fetch token:", response.data.message);
      }
    } catch (error) {
      console.error("Error initiating live pooja:", error);
    }
  };

  const handleOpenPopup = () => {
    if (!user1) {
      Swal.fire({
        title: "Please login first",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Login Now",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          setIsLoginPopup(true);
        }
      });
    } else {
      setShowPopup(true);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleFeedbackNavigation = () => {
    navigate("/feedbackform", {
      state: { pujaId: pujaDetails?.id, problem_name: "normal" },
    });
  };

  // Base pricing
  const basePrice = Number(pujaDetails?.final_price || pujaDetails?.price || 1100);
  const originalPrice = Number(pujaDetails?.price || basePrice);
  const discountPercent =
    originalPrice > basePrice && originalPrice > 0
      ? Math.round(((originalPrice - basePrice) / originalPrice) * 100)
      : 0;

  // Dynamic or Default Packages
  const getPackages = () => {
    if (pujaDetails?.packages) {
      if (Array.isArray(pujaDetails.packages) && pujaDetails.packages.length > 0) {
        return pujaDetails.packages;
      }
      try {
        const parsed = JSON.parse(pujaDetails.packages);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        // use defaults
      }
    }

    return [
      {
        id: "ind",
        name: "Individual Pooja",
        price: basePrice,
        description: "1 Person Sankalp with Vedic Pandit",
        features: [
          "Individual Sankalp & Gothram recitation",
          "Complete Vedic Rituals & Hawan",
          "Personalized Prasad Delivery",
          "Live Video Link Access",
        ],
      },
      {
        id: "cpl",
        name: "Couple / Partner Pooja",
        price: Math.round(basePrice * 1.5),
        description: "Husband & Wife / 2 Persons Sankalp",
        features: [
          "Joint Sankalp for 2 devotees",
          "Special Abhishek & Hawan offerings",
          "Enhanced Holy Prasad Pack",
          "HD Live Video Streaming",
        ],
      },
      {
        id: "fam",
        name: "Family Pooja",
        price: Math.round(basePrice * 2.2),
        description: "Up to 6 Family Members Sankalp",
        features: [
          "Sankalp for up to 6 family members",
          "Complete Navgrah & Kula Devata Hawan",
          "Family Prasad Hamper with Blessed Yantra",
          "Priority Live Interaction with Pandit",
        ],
      },
      {
        id: "mha",
        name: "Maha Hawan & Anushthan",
        price: Math.round(basePrice * 3.5),
        description: "Grand Anushthan with 3 Senior Pandits",
        features: [
          "3 Senior Vedic Pandits performing rituals",
          "Complete 1008 Mantra Jaap & Grand Hawan",
          "Energized Silver Yantra & Premium Prasad",
          "Dedicated 1-on-1 Live Stream Session",
        ],
      },
    ];
  };

  const packagesList = getPackages();
  const selectedPackage = packagesList[selectedPackageIndex] || packagesList[0];

  // Dynamic Content with clean fallbacks
  const defaultSamagriList = [
    "Copper Kalash & Gangajal",
    "Rice (Akshat) & Janeu",
    "Roli, Chandan & Kumkum",
    "Desi Ghee, Diya & Camphor",
    "Incense Sticks (Agarbatti) & Dhoop",
    "Fresh Flowers & Bilva / Mango Leaves",
    "Panchamrit (Milk, Curd, Ghee, Honey, Sugar)",
    "Seasonal Fruits & Sweets (Prasad)",
    "Hawan Samagri & Dry Coconut",
    "Sacred Moli (Raksha Sutra)",
  ];

  const defaultBenefitsList = [
    "Removes planetary doshas, obstacles, and negative energies from life.",
    "Brings peace, prosperity, good health, and immense spiritual fulfillment.",
    "Ensures harmony, mutual love, and happiness across the household.",
    "Bestows divine protection and opens new avenues for career and financial growth.",
  ];

  const defaultHowItHappensList = [
    "Book the Pooja by selecting your preferred package.",
    "Schedule the Pooja and provide your Name, Gotra & Sankalp details.",
    "Join the Pooja live via video link from the comfort of your home.",
    "Receive the sacred blessings and energizing divine vibrations.",
  ];

  const defaultAboutPoojaList = [
    `Performing ${pujaDetails?.name || "this sacred Pooja"} is an auspicious Vedic practice designed to invoke cosmic harmony and divine blessings.`,
    "Conducted strictly according to authentic Vedic rituals and scriptures by experienced, certified Pandits.",
  ];

  const defaultAfterPoojaList = [
    "Distribute blessed prasad to family members and near & dear ones.",
    "Keep the sanctified Raksha Sutra / Moli tied for divine protection.",
    "Engage in charitable deeds or feed cows/birds to multiply positive merits.",
  ];

  const dynamicSamagri = parseContentToList(pujaDetails?.about_samagri);
  const samagriList = dynamicSamagri.length > 0 ? dynamicSamagri : defaultSamagriList;
  const visibleSamagri = isExpanded ? samagriList : samagriList.slice(0, 5);

  const dynamicBenefits = parseContentToList(pujaDetails?.benefits);
  const benefitsList = dynamicBenefits.length > 0 ? dynamicBenefits : defaultBenefitsList;

  const dynamicHowItHappens = parseContentToList(pujaDetails?.how_it_happens);
  const howItHappensList = dynamicHowItHappens.length > 0 ? dynamicHowItHappens : defaultHowItHappensList;

  const dynamicAboutPooja = parseContentToList(pujaDetails?.about_pooja);
  const aboutPoojaList = dynamicAboutPooja.length > 0 ? dynamicAboutPooja : defaultAboutPoojaList;

  const dynamicAfterPooja = parseContentToList(pujaDetails?.after_pooja);
  const afterPoojaList = dynamicAfterPooja.length > 0 ? dynamicAfterPooja : defaultAfterPoojaList;

  if (loading || loading1) {
    return (
      <div>
        <NewLoader />
      </div>
    );
  }

  return (
    <div className="category_heading">
      <div className="container">
        {pujaDetails ? (
          <>
            {/* Hero Section */}
            <div className="row">
              <div className="col-sm-5">
                <div className="product_image">
                  <img src={pujaDetails?.image} alt={pujaDetails?.name} />
                </div>
              </div>
              <div className="col-sm-6">
                <h1 className="product_content">{pujaDetails?.name}</h1>
                <div className="product_name">
                  <p>Removes Negativity & Solves Problems</p>
                </div>

                <div className="product_price">
                  {originalPrice > 0 && originalPrice !== selectedPackage.price && (
                    <p className="product_current_price">
                      Price: <span>Rs.{originalPrice}</span>
                    </p>
                  )}
                  <p className="product_final_price">
                    <span>Rs.{selectedPackage.price}</span>
                  </p>
                  {discountPercent > 0 && (
                    <span className="discount_badge">{discountPercent}% OFF</span>
                  )}
                </div>

                {/* Countdown Timer */}
                <div className="countdown-timer">
                  <div className="timer-box">
                    <span className="time">{timeLeft.days}</span>
                    <span className="label">Days</span>
                  </div>
                  <div className="timer-box">
                    <span className="time">{timeLeft.hours}</span>
                    <span className="label">Hrs</span>
                  </div>
                  <div className="timer-box">
                    <span className="time">{timeLeft.minutes}</span>
                    <span className="label">Mins</span>
                  </div>
                  <div className="timer-box">
                    <span className="time">{timeLeft.seconds}</span>
                    <span className="label">Secs</span>
                  </div>
                </div>

                {/* Rating Section */}
                <div className="rating-section">
                  <div className="rating-header">
                    <p>1 Lakh+ Devotees</p>
                    <StarRatings
                      rating={parseFloat(averageRating) || 5}
                      starRatedColor="gold"
                      starEmptyColor="gray"
                      starDimension="20px"
                      starSpacing="2px"
                      numberOfStars={5}
                      name="averageRating"
                    />
                  </div>
                  <button
                    onClick={() => setShowRatingsPopup(true)}
                    className="view-comments-btn"
                  >
                    View Ratings & Comments
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="booknow_support_btn">
                  <div className="timeshedule_section">
                    {bookingDateSmaller && bookingDate && (
                      <div className="pooja-booking-info">
                        Your last booking:{" "}
                        {new Date(bookingDate).toLocaleDateString("en-GB")}
                      </div>
                    )}

                    {areDatesEqual && bookingDate ? (
                      <>
                        <span className="pooja-booking-info">
                          Your booking is on:{" "}
                          {new Date(bookingDate).toLocaleDateString("en-GB")}
                        </span>
                        <div className="bothbtn">
                          <button
                            className="join-now-btn"
                            onClick={handleLivePooja}
                          >
                            Join Now
                          </button>
                          <button
                            className="feedback-btn"
                            onClick={handleFeedbackNavigation}
                          >
                            Feedback
                          </button>
                        </div>
                      </>
                    ) : bookingDateGreater && bookingDate ? (
                      <div className="pooja-booking-info">
                        You have already booked:{" "}
                        {new Date(bookingDate).toLocaleDateString("en-GB")}
                      </div>
                    ) : null}

                    {!bookingDateGreater && !areDatesEqual && (
                      <div className="booknow-btn">
                        <button className="booknoww" onClick={handleOpenPopup}>
                          Book Now (Rs.{selectedPackage.price})
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Packages Section */}
            <div className="pooja_packages_section">
              <h2>Select Pooja Package</h2>
              <div className="packages_grid">
                {packagesList.map((pkg, idx) => {
                  const isSelected = idx === selectedPackageIndex;
                  return (
                    <div
                      key={pkg.id || idx}
                      className={`package_card ${isSelected ? "selected" : ""}`}
                      onClick={() => setSelectedPackageIndex(idx)}
                    >
                      <div>
                        <div className="package_header">
                          <h3 className="package_name">{pkg.name}</h3>
                          <input
                            type="radio"
                            name="pooja_package"
                            checked={isSelected}
                            onChange={() => setSelectedPackageIndex(idx)}
                            className="package_radio"
                          />
                        </div>
                        <div className="package_price">Rs.{pkg.price}</div>
                        <p className="package_desc">{pkg.description}</p>
                        {pkg.features && pkg.features.length > 0 && (
                          <ul className="package_features">
                            {pkg.features.map((feat, fIdx) => (
                              <li key={fIdx}>{feat}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ---------------- 2. FULL-WIDTH ASSIGNED PANDITS SLIDER ---------------- */}
            <div className="fullwidth_pandits_section">
              <div className="fullwidth_pandits_header">
                <div>
                  <h2>
                    <span>🕉️</span> Assigned Certified Vedic Pandits
                  </h2>
                  <p style={{ fontSize: "13px", color: "#64748b", margin: "4px 0 0 0" }}>
                    Our experienced and certified Vedic Acharyas assigned to perform this sacred ritual with authentic Vedic Vidhi
                  </p>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                  <span className="available_badge">
                    {panditsList.length} Pandits Allotted
                  </span>
                  {panditsList && panditsList.length > 3 && (
                    <div className="slider_nav_arrows">
                      <button
                        className="slider_arrow_btn"
                        onClick={() => scrollPandits("left")}
                        title="Previous Pandits"
                        aria-label="Previous Pandits"
                      >
                        &#8249;
                      </button>
                      <button
                        className="slider_arrow_btn"
                        onClick={() => scrollPandits("right")}
                        title="Next Pandits"
                        aria-label="Next Pandits"
                      >
                        &#8250;
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="pandits_slider_track" ref={panditSliderRef}>
                {panditsList && panditsList.length > 0 ? (
                  panditsList.map((pandit) => (
                    <div key={pandit.id} className="pandit_slider_card">
                      <img
                        src={
                          pandit.profileImage ||
                          pandit.image ||
                          "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                        }
                        alt={pandit.name}
                        className="pandit_grid_avatar"
                      />
                      <div className="pandit_grid_info">
                        <div className="pandit_grid_top">
                          <h4 className="pandit_grid_name">
                            {pandit.name} {pandit.lastname || ""}
                          </h4>
                          <span className="pandit_grid_badge">✓ Verified</span>
                        </div>
                        <p className="pandit_grid_meta">
                          {pandit.experience ? `${pandit.experience} Yrs Exp` : "10+ Yrs Exp"} • Gotra: {pandit.gotra || "Vedic"}
                        </p>
                        <p className="pandit_grid_skills">
                          {pandit.skills || "Vedic Chanting & Hawan"}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ width: "100%", padding: "16px", background: "#f8fafc", borderRadius: "10px", color: "#64748b", fontSize: "14px" }}>
                    ✨ Certified Vedic Acharyas are available and will be allotted to your Sankalp upon booking.
                  </div>
                )}
              </div>
            </div>

            {/* ---------------- 3. ACCORDION / DROPDOWN INFORMATION SECTIONS ---------------- */}
            <div className="pooja_accordion_container">
              {/* 1. Samagri */}
              <div className={`pooja_accordion_card ${openSections.samagri ? "is_open" : ""}`}>
                <div className="pooja_accordion_header" onClick={() => toggleSection("samagri")}>
                  <h3 className="pooja_accordion_title">
                    <span>🪔</span> About Pooja Samagri
                  </h3>
                  <span className="pooja_accordion_toggle">▼</span>
                </div>
                {openSections.samagri && (
                  <div className="pooja_accordion_body">
                    <ul>
                      {samagriList.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* 2. Benefits */}
              <div className={`pooja_accordion_card ${openSections.benefits ? "is_open" : ""}`}>
                <div className="pooja_accordion_header" onClick={() => toggleSection("benefits")}>
                  <h3 className="pooja_accordion_title">
                    <span>✨</span> What are the Benefits?
                  </h3>
                  <span className="pooja_accordion_toggle">▼</span>
                </div>
                {openSections.benefits && (
                  <div className="pooja_accordion_body">
                    <ul>
                      {benefitsList.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* 3. How It Happens */}
              <div className={`pooja_accordion_card ${openSections.howItHappens ? "is_open" : ""}`}>
                <div className="pooja_accordion_header" onClick={() => toggleSection("howItHappens")}>
                  <h3 className="pooja_accordion_title">
                    <span>📖</span> How will it Happen?
                  </h3>
                  <span className="pooja_accordion_toggle">▼</span>
                </div>
                {openSections.howItHappens && (
                  <div className="pooja_accordion_body">
                    <ul>
                      {howItHappensList.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* 4. About Pooja */}
              <div className={`pooja_accordion_card ${openSections.aboutPooja ? "is_open" : ""}`}>
                <div className="pooja_accordion_header" onClick={() => toggleSection("aboutPooja")}>
                  <h3 className="pooja_accordion_title">
                    <span>🕉️</span> About {pujaDetails?.name || "Pooja"}
                  </h3>
                  <span className="pooja_accordion_toggle">▼</span>
                </div>
                {openSections.aboutPooja && (
                  <div className="pooja_accordion_body">
                    <ul>
                      {aboutPoojaList.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* 5. Post-Pooja Guidelines */}
              <div className={`pooja_accordion_card ${openSections.afterPooja ? "is_open" : ""}`}>
                <div className="pooja_accordion_header" onClick={() => toggleSection("afterPooja")}>
                  <h3 className="pooja_accordion_title">
                    <span>🙏</span> What should you do after Pooja to get maximum benefits?
                  </h3>
                  <span className="pooja_accordion_toggle">▼</span>
                </div>
                {openSections.afterPooja && (
                  <div className="pooja_accordion_body">
                    <ul>
                      {afterPoojaList.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* 6. Why Prabhu Pooja */}
              <div className={`pooja_accordion_card ${openSections.whyUs ? "is_open" : ""}`}>
                <div className="pooja_accordion_header" onClick={() => toggleSection("whyUs")}>
                  <h3 className="pooja_accordion_title">
                    <span>🏆</span> Why Book with Prabhu Pooja?
                  </h3>
                  <span className="pooja_accordion_toggle">▼</span>
                </div>
                {openSections.whyUs && (
                  <div className="pooja_accordion_body">
                    <ul>
                      <li>
                        Prabhu Pooja is India's largest Devotion tech platform,
                        offering access to top verified astrologers and Vedic Pandits.
                      </li>
                      <li>
                        Our Pooja services feature certified Pandits on the
                        platform to ensure authentic rituals and maximum benefits.
                      </li>
                      <li>
                        This Pooja includes full family participation, Sankalp,
                        and covers Dakshina & Samagri as well.
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* ---------------- 4. STICKY / BOTTOM BOOKING BAR ---------------- */}
            <div className="sticky_bottom_booking_bar">
              <div className="bar_price_info">
                <span className="bar_label">Total Payable for Selected Package</span>
                <div className="bar_price">Rs. {selectedPackage.price}</div>
                <div className="bar_meta">
                  Selected Package: <strong style={{ color: "#ffffff" }}>{selectedPackage.name}</strong>
                </div>
              </div>

              <button className="bar_btn" onClick={handleOpenPopup}>
                Book Pooja Now (Rs.{selectedPackage.price})
              </button>
            </div>
          </>
        ) : (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "10vh",
              }}
            >
              <TailSpin height="50" width="50" color="orange" />
            </div>
            <p className="loading_text">Loading Pooja Details...</p>
          </>
        )}
        {error && <p className="error">{error}</p>}
      </div>

      {showPopup && (
        <div className="booking-modal-overlay">
          <div className="booking-modal-container">
            <div className="booking-modal-header">
              <div>
                <span className="package-tag">
                  {selectedPackage.name}
                </span>
                <h3>{pujaDetails?.name}</h3>
              </div>
              <button className="booking-modal-close-btn" onClick={handleClosePopup}>
                &times;
              </button>
            </div>
            <BookPoojaForm
              data={{
                ...pujaDetails,
                price: selectedPackage.price,
                packageName: selectedPackage.name,
                package_id: selectedPackage.id,
              }}
              onClose={handleClosePopup}
            />
          </div>
        </div>
      )}

      {showRatingsPopup && (
        <RatingsPopup id={id} onClose={() => setShowRatingsPopup(false)} />
      )}
    </div>
  );
};

export default PoojaDetailMasterPage;
