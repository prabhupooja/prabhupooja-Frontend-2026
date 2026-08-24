import React, { useState, useEffect } from "react";
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

const Poojapage = () => {
  const { id } = useParams();
  const [averageRating, setAverageRating] = useState(0);
  const [showRatingsPopup, setShowRatingsPopup] = useState(false);
  const { user1, isLoggin, setIsLoginPopup } = useAuthStore();
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

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

  const decryptId = (encryptedIdFromUrl) => {
    const decodedId = decodeURIComponent(encryptedIdFromUrl);
    const bytes = CryptoJS.AES.decrypt(decodedId, "prabhupooja2024");
    return bytes.toString(CryptoJS.enc.Utf8);
  };

  const fetchPujaDetails = async () => {
    if (id) {
      await getPoojaDetails(decryptId(id));
    }
  };

  const fetchPujaRatings = async () => {
    if (id) {
      const res = await getPoojaRating(decryptId(id), "normal");
      if (res?.data?.success) {
        setAverageRating(res.data.data.averageRating);
      }
    }
  };

  const fetchBookingDate = async () => {
    if (id && user1?.id) {
      await getBookingDate(decryptId(id), user1.id);
    }
  };

  const fetchCurrentgDate = async () => {
    await getCurrectDate();
  };

  useEffect(() => {
    if (!id) return;
    fetchPujaDetails();
    fetchPujaRatings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (user1 && isLoggin) {
      fetchBookingDate();
      fetchCurrentgDate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user1, isLoggin, id]);

  useEffect(() => {
    if (user1) {
      setLoading1(true);
      const normalizeDate = (date) => new Date(date.setHours(0, 0, 0, 0));
      const currentDateObj = normalizeDate(new Date(currentDate));
      const bookingDateObj = normalizeDate(new Date(bookingDate));
      setAreDatesEqual(currentDateObj.getTime() === bookingDateObj.getTime());
      setBookingDateGreater(
        currentDateObj.getTime() < bookingDateObj.getTime()
      );
      setBookingDateSmaller(
        currentDateObj.getTime() > bookingDateObj.getTime()
      );
    }
    setLoading1(false);
  }, [currentDate, bookingDate, user1]);

  const handleLivePooja = async () => {
    try {
      const roomName = pujaDetails.name.replace(/\s+/g, "");
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
      state: { pujaId: pujaDetails.id, problem_name: "normal" },
    });
  };

  if (loading || loading1) {
    return (
      <>
        <div>
          <NewLoader />
        </div>
      </>
    );
  }

  return (
    <div className="category_heading">
      <div className="container">
        {pujaDetails ? (
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
                {Number(pujaDetails?.price) > 0 &&
                  Number(pujaDetails?.price) !== Number(pujaDetails?.final_price) && (
                    <p className="product_current_price">
                      Price: <span>Rs.{pujaDetails?.price}</span>
                    </p>
                  )}
                <p className="product_final_price">
                  <span>Rs.{pujaDetails?.final_price || pujaDetails?.price}</span>
                </p>
                {Number(pujaDetails?.price) > Number(pujaDetails?.final_price) &&
                  Number(pujaDetails?.price) > 0 && (
                    <span className="discount_badge">
                      {Math.round(
                        ((Number(pujaDetails.price) - Number(pujaDetails.final_price)) /
                          Number(pujaDetails.price)) *
                          100
                      )}
                      % OFF
                    </span>
                  )}
              </div>

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

              <div className="rating-section">
                <div className="rating-header">
                  <p>1 Lakh+ Devotees</p>
                  <StarRatings
                    rating={parseFloat(averageRating)}
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
                        Book Now
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "5vh",
              }}
            >
              <TailSpin height="50" width="50" color="orange" />
            </div>
            <p className="loading_text">Loading...</p>
          </>
        )}
        {error && <p className="error">{error}</p>}
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <div className="popup-header">
              <h2 style={{ color: "#cd5702", fontWeight: "600" }}>
                Book Pooja
              </h2>
              <button className="close-btn" onClick={handleClosePopup}>
                &times;
              </button>
            </div>
            <BookPoojaForm data={pujaDetails} onClose={handleClosePopup} />
          </div>
        </div>
      )}
      {showRatingsPopup && (
        <RatingsPopup id={id} onClose={() => setShowRatingsPopup(false)} />
      )}
    </div>
  );
};

export default Poojapage;
