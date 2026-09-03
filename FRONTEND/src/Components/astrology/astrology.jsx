import { useEffect, useState, useMemo } from "react";
import "../../styles/astrology.css";
import { Link, useNavigate } from "react-router-dom";
import api from "../Axios/api";
import useAuthStore from "../../Store/UserStore/userAuthStore";
import useAstologerStore from "../../Store/AstrologerStore/AstrologerStore";
import CryptoJS from "crypto-js";
import Swal from "sweetalert2";
import panditImage from "../Assets/profile-pic.png";
import NewLoader from "../NewLoader/NewLoader";

const Astrology = () => {
  const [allServices, setAllServices] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter States
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState("All");
  const [selectedLanguage, setSelectedLanguage] = useState("All");
  const [selectedExp, setSelectedExp] = useState("All");
  const [sortBy, setSortBy] = useState("recommended");
  
  const navigate = useNavigate();
  const { user1, isMember } = useAuthStore();
  const { astrologerGet, isloading } = useAstologerStore();

  const balance = user1?.balance;

  useEffect(() => {
    fetchAstrologer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAstrologer = async () => {
    try {
      setLoading(true);
      const response = await astrologerGet();
      if (response?.data?.success && Array.isArray(response.data.data)) {
        setAllServices(response.data.data);
        setServices(response.data.data);
      } else {
        setAllServices([]);
        setServices([]);
      }
    } catch (err) {
      console.error("Error fetching astrologers:", err);
      setAllServices([]);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  // Dynamically extract unique skills and languages from astrologers list
  const availableSkills = useMemo(() => {
    const skillSet = new Set();
    allServices.forEach((ast) => {
      if (ast.skills) {
        ast.skills
          .split(/[,/]+/)
          .map((s) => s.trim())
          .filter(Boolean)
          .forEach((s) => skillSet.add(s));
      }
    });
    // Add common fallback categories
    ["Vedic", "Kundli", "Tarot", "Vastu", "Numerology", "Palmistry", "Love", "Career"].forEach((s) => skillSet.add(s));
    return Array.from(skillSet);
  }, [allServices]);

  const availableLanguages = useMemo(() => {
    const langSet = new Set();
    allServices.forEach((ast) => {
      if (ast.language) {
        ast.language
          .split(/[,/]+/)
          .map((l) => l.trim())
          .filter(Boolean)
          .forEach((l) => langSet.add(l));
      }
    });
    ["Hindi", "English", "Sanskrit", "Gujarati", "Marathi"].forEach((l) => langSet.add(l));
    return Array.from(langSet);
  }, [allServices]);

  // Apply filters and sorting automatically
  useEffect(() => {
    let result = [...allServices];

    // 1. Search Query Filter (Name, skills, language)
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (ast) =>
          (ast.name && ast.name.toLowerCase().includes(q)) ||
          (ast.skills && ast.skills.toLowerCase().includes(q)) ||
          (ast.language && ast.language.toLowerCase().includes(q))
      );
    }

    // 2. Skill Filter
    if (selectedSkill !== "All") {
      result = result.filter(
        (ast) => ast.skills && ast.skills.toLowerCase().includes(selectedSkill.toLowerCase())
      );
    }

    // 3. Language Filter
    if (selectedLanguage !== "All") {
      result = result.filter(
        (ast) => ast.language && ast.language.toLowerCase().includes(selectedLanguage.toLowerCase())
      );
    }

    // 4. Experience Filter
    if (selectedExp !== "All") {
      result = result.filter((ast) => {
        const exp = parseFloat(ast.experience) || 0;
        if (selectedExp === "1-3") return exp >= 1 && exp <= 3;
        if (selectedExp === "3-5") return exp > 3 && exp <= 5;
        if (selectedExp === "5+") return exp >= 5;
        if (selectedExp === "10+") return exp >= 10;
        return true;
      });
    }

    // 5. Sorting
    if (sortBy === "price-low") {
      result.sort((a, b) => (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0));
    } else if (sortBy === "price-high") {
      result.sort((a, b) => (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0));
    } else if (sortBy === "rating-high") {
      result.sort((a, b) => (parseFloat(b.rating) || 5) - (parseFloat(a.rating) || 5));
    } else if (sortBy === "exp-high") {
      result.sort((a, b) => (parseFloat(b.experience) || 0) - (parseFloat(a.experience) || 0));
    }

    setServices(result);
  }, [allServices, searchQuery, selectedSkill, selectedLanguage, selectedExp, sortBy]);

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (searchQuery.trim() === "") {
      fetchAstrologer();
      return;
    }

    try {
      const response = await api.get(`/pandit/search?query=${encodeURIComponent(searchQuery)}`);
      if (response?.data?.success && Array.isArray(response.data.data) && response.data.data.length > 0) {
        setServices(response.data.data);
      }
    } catch {
      // Retain client-filtered results
    }
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedSkill("All");
    setSelectedLanguage("All");
    setSelectedExp("All");
    setSortBy("recommended");
  };

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    selectedSkill !== "All" ||
    selectedLanguage !== "All" ||
    selectedExp !== "All" ||
    sortBy !== "recommended";

  const createRequest = async (
    astrologerId,
    type,
    price,
    astrologerPhoneNumber
  ) => {
    if (!user1) {
      Swal.fire({
        title: "Login Required",
        text: "Please login to connect with our verified Astrologers!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Login Now",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#ea580c",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
      return;
    }
    try {
      const response = await api.post("/request", {
        user_id: user1?.id,
        pandit_astrologer_id: astrologerId,
        request_type: type,
        status: "pending",
      });

      const requestId = response.data?.requestId;
      if (requestId) {
        pollRequestStatus(
          requestId,
          type,
          astrologerId,
          price,
          astrologerPhoneNumber
        );
      }
    } catch (error) {
      console.error("Failed to create request:", error);
      Swal.fire({
        icon: "error",
        title: "Request Error",
        text: "Could not create consultation request. Please try again.",
        confirmButtonColor: "#ea580c",
      });
    }
  };

  const pollRequestStatus = (
    requestId,
    type,
    astrologerId,
    price,
    astrologerPhoneNumber
  ) => {
    const intervalId = setInterval(async () => {
      try {
        const response = await api.get(`/request/status/${requestId}`);

        if (response.data.status !== "pending") {
          clearInterval(intervalId);
          if (response.data.status === "accepted") {
            if (type === "chat") {
              navigate(`/chat/${astrologerId}/${price}/${requestId}`);
            } else if (type === "voice" || type === "video") {
              initiateCall(
                astrologerId,
                type,
                astrologerPhoneNumber,
                requestId
              );
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch request status:", error);
        clearInterval(intervalId);
      }
    }, 5000);
  };

  const initiateCall = async (
    astrologerId,
    type,
    astrologerPhoneNumber,
    requestId
  ) => {
    try {
      const response = await api.post("/call/initiate", {
        callerId: user1?.id,
        receiverId: astrologerId,
        type,
        callerPhoneNumber: user1?.mobile,
        receiverPhoneNumber: astrologerPhoneNumber,
        request_id: requestId,
      });

      if (response.data.success) {
        if (type === "voice") {
          navigate(`/voicecall/${response.data.call.twilioCallSid}`);
        } else if (type === "video") {
          navigate(
            `/videocall/${response.data.call.roomName}/${response.data.call.callerToken}`
          );
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Call Error",
          text: response.data.message || "Unable to connect call",
        });
      }
    } catch (error) {
      console.error("Failed to initiate call:", error);
      Swal.fire({
        icon: "error",
        title: "Call Error",
        text: "Failed to initiate call. Please try again.",
      });
    }
  };

  const handleChat = (astrologer) => {
    const chatRate = astrologer.chat_price || astrologer.chatPrice || astrologer.price || 15;
    navigate("/astrologyform", {
      state: {
        astrologerID: astrologer.id,
        uuid: astrologer.uuid,
        price: chatRate,
        type: "chat",
      },
    });
  };

  const handleVoiceCall = (astrologerId, mobile, price) => {
    if (!user1) {
      Swal.fire({
        title: "Login Required",
        text: "Please login to connect with Astrologers!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Login Now",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#ea580c",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
      return;
    }
    const b = parseFloat(balance) || 0;
    const p = parseFloat(price) || 0;
    if (b >= p || isMember) {
      createRequest(astrologerId, "voice", price, mobile);
    } else {
      Swal.fire({
        icon: "error",
        title: "Insufficient Balance!",
        text: `Consultation fee is ₹${price}/min. Your current balance is ₹${balance || 0}. Please recharge to continue.`,
        confirmButtonText: "Recharge Wallet",
        confirmButtonColor: "#ea580c",
        showCancelButton: true,
        cancelButtonText: "Later",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/recharge");
        }
      });
    }
  };

  const handleVideoCall = (astrologerId, price) => {
    if (!user1) {
      Swal.fire({
        title: "Login Required",
        text: "Please login to start a Video Consultation!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Login Now",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#ea580c",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
      return;
    }
    const b = parseFloat(balance) || 0;
    const p = parseFloat(price) || 0;
    if (b >= p || isMember) {
      createRequest(astrologerId, "video", price);
    } else {
      Swal.fire({
        icon: "error",
        title: "Insufficient Balance!",
        text: `Video consultation fee is ₹${price}/min. Your current balance is ₹${balance || 0}. Please recharge to continue.`,
        confirmButtonText: "Recharge Wallet",
        confirmButtonColor: "#ea580c",
        showCancelButton: true,
        cancelButtonText: "Later",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/recharge");
        }
      });
    }
  };

  const encryptId = (ID) => {
    if (!ID) return "";
    const encrypted = CryptoJS.AES.encrypt(
      ID.toString(),
      "prabhupooja2024"
    ).toString();
    return encodeURIComponent(encrypted);
  };

  if (loading || isloading) {
    return <NewLoader />;
  }

  return (
    <>
      {/* Subheader Banner */}
      <div className="sub_header_astrology">
        <div className="container">
          <div className="subheader_inner_astrology">
            <div className="subheader_text_astrology">
              <h1>Talk to Astrologer</h1>
              <p className="subheader_tagline">
                Connect with India's most verified Vedic Astrologers, Tarot Readers & Vastu Experts
              </p>
            </div>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link className="btn-link" to="/">
                    Home
                  </Link>
                </li>
                <li className="breadcrumb-item active">Astrology</li>
              </ol>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Astrologer Section */}
      <section className="astrologer_section">
        <div className="container">
          {/* Top Action & Search Bar */}
          <div className="astrologer_top_bar_container">
            <form onSubmit={handleSearchSubmit} className="astrologer_baar_form">
              <div className="astrologer_baar">
                {/* Left: Heading & Online Count */}
                <div className="astrologer_baar_left">
                  <h2 className="heading_chat_with_astrologer">
                    🕉️ Verified Astrologers
                  </h2>
                  <span className="online_astrologer_badge">
                    <span className="pulse_dot"></span> {services.length} Online Now
                  </span>
                </div>

                {/* Center: Available Balance & Recharge */}
                <div className="astrologer_balance_card">
                  <div className="wallet_icon_badge">
                    <i className="fa-solid fa-wallet"></i>
                  </div>
                  <div className="balance_details">
                    <span className="balance_title">Wallet Balance</span>
                    <span className="balance_avail_1">₹ {user1?.balance !== undefined ? user1.balance : 0}</span>
                  </div>
                  <Link className="recharge_action_btn" to="/recharge">
                    + Recharge
                  </Link>
                </div>

                {/* Right: Search & Filter Trigger */}
                <div className="astrologer_search_filter_group">
                  <div className="form-search-wrapper">
                    <i className="fa-solid fa-magnifying-glass search_icon"></i>
                    <input
                      type="text"
                      placeholder="Search by name, skill, language..."
                      className="search_input_modern"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        className="search_clear_btn"
                        onClick={() => setSearchQuery("")}
                        title="Clear search"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    className={`filter_trigger_btn ${hasActiveFilters ? "active_filter_btn" : ""}`}
                    onClick={() => setShowFilterModal(true)}
                  >
                    <i className="fa-solid fa-sliders"></i>
                    <span>Filters</span>
                    {hasActiveFilters && <span className="filter_indicator_dot"></span>}
                  </button>
                </div>
              </div>
            </form>

            {/* Active Filter Chips Bar */}
            {hasActiveFilters && (
              <div className="active_filter_chips_bar">
                <span className="filter_chips_label">
                  <i className="fa-solid fa-filter"></i> Active Filters:
                </span>
                {searchQuery && (
                  <span className="filter_chip">
                    Search: "{searchQuery}"
                    <button type="button" onClick={() => setSearchQuery("")}>✕</button>
                  </span>
                )}
                {selectedSkill !== "All" && (
                  <span className="filter_chip">
                    Skill: {selectedSkill}
                    <button type="button" onClick={() => setSelectedSkill("All")}>✕</button>
                  </span>
                )}
                {selectedLanguage !== "All" && (
                  <span className="filter_chip">
                    Lang: {selectedLanguage}
                    <button type="button" onClick={() => setSelectedLanguage("All")}>✕</button>
                  </span>
                )}
                {selectedExp !== "All" && (
                  <span className="filter_chip">
                    Exp: {selectedExp} Yrs
                    <button type="button" onClick={() => setSelectedExp("All")}>✕</button>
                  </span>
                )}
                {sortBy !== "recommended" && (
                  <span className="filter_chip">
                    Sort: {sortBy.replace("-", " ")}
                    <button type="button" onClick={() => setSortBy("recommended")}>✕</button>
                  </span>
                )}
                <button
                  type="button"
                  className="clear_all_chips_btn"
                  onClick={clearAllFilters}
                >
                  Clear All
                </button>
              </div>
            )}
          </div>

          {/* Astrologers Grid */}
          <div className="best-pandit">
            {services.length === 0 ? (
              <div className="no_astrologer_box">
                <div className="no_astrologer_icon">
                  <i className="fa-solid fa-sun"></i>
                </div>
                <h3>No Astrologers Found</h3>
                <p>We couldn't find any astrologer matching your search or filters.</p>
                <button
                  type="button"
                  className="reset_filter_btn"
                  onClick={clearAllFilters}
                >
                  <i className="fa-solid fa-rotate-left"></i> Reset All Filters
                </button>
              </div>
            ) : (
              <div className="row g-4">
                {services.map((service, index) => {
                  const encryptedId = encryptId(service.id);
                  const skillsArray = service.skills
                    ? service.skills.split(/[,/]+/).map((s) => s.trim()).filter(Boolean)
                    : [];

                  return (
                    <div className="col-lg-4 col-md-6 col-sm-12" key={service.id || index}>
                      <div className="astro_card_modern">
                        {/* Top Card Header: Profile Image & Core Details */}
                        <div className="astro_card_header">
                          <div className="astro_avatar_wrapper">
                            <Link to={`/astrologyprofile/${encryptedId}`}>
                              <img
                                src={service.profileImage || panditImage}
                                alt={service.name || "Astrologer"}
                                className="astro_avatar_img"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = panditImage;
                                }}
                              />
                            </Link>
                            <span className="astro_online_status_dot" title="Available Now"></span>
                          </div>

                          <div className="astro_info_col">
                            <div className="astro_name_rating_row">
                              <Link to={`/astrologyprofile/${encryptedId}`} className="astro_name_link">
                                <h3 className="astro_name">
                                  {service.name}
                                </h3>
                                <i className="fa-solid fa-circle-check verified_icon" title="Verified Astrologer"></i>
                              </Link>
                            </div>

                            {/* Ratings */}
                            <div className="astro_rating_bar">
                              <div className="astro_stars">
                                {[...Array(5)].map((_, i) => (
                                  <i
                                    className={`fa-solid fa-star ${
                                      i < (service.rating || 5) ? "star_gold" : "star_muted"
                                    }`}
                                    key={i}
                                  ></i>
                                ))}
                              </div>
                              <span className="astro_rating_num">
                                {service.rating ? Number(service.rating).toFixed(1) : "5.0"}
                              </span>
                            </div>

                            {/* Skills Tag Chips */}
                            <div className="astro_skills_tags">
                              {skillsArray.slice(0, 3).map((sk, skIdx) => (
                                <span className="astro_skill_chip" key={skIdx}>
                                  {sk}
                                </span>
                              ))}
                              {skillsArray.length > 3 && (
                                <span className="astro_skill_chip more">
                                  +{skillsArray.length - 3}
                                </span>
                              )}
                            </div>

                            {/* Language & Experience Meta */}
                            <div className="astro_meta_row">
                              <div className="astro_meta_item" title="Languages">
                                <i className="fa-solid fa-language meta_icon"></i>
                                <span>{service.language || "Hindi, English"}</span>
                              </div>
                              <div className="astro_meta_item" title="Experience">
                                <i className="fa-solid fa-award meta_icon"></i>
                                <span>Exp: {service.experience || "5"} Yrs</span>
                              </div>
                            </div>

                            {/* Custom Talk-Time Rates Badges */}
                            <div className="astro_price_row" style={{ display: "flex", gap: "6px", flexWrap: "wrap", margin: "8px 0" }}>
                              <span style={{ background: "#eff6ff", color: "#1d4ed8", padding: "2px 6px", borderRadius: "4px", fontSize: "0.74rem", fontWeight: "700" }}>
                                💬 ₹{service.chat_price || service.chatPrice || service.price || 15}/m
                              </span>
                              <span style={{ background: "#ecfdf5", color: "#047857", padding: "2px 6px", borderRadius: "4px", fontSize: "0.74rem", fontWeight: "700" }}>
                                📞 ₹{service.voice_price || service.voicePrice || 20}/m
                              </span>
                              <span style={{ background: "#fff7ed", color: "#c2410c", padding: "2px 6px", borderRadius: "4px", fontSize: "0.74rem", fontWeight: "700" }}>
                                📹 ₹{service.video_price || service.videoPrice || 25}/m
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Card Bottom: 3 Dynamic Consultation Buttons */}
                        <div className="astro_card_actions">
                          <button
                            type="button"
                            className="astro_action_btn btn_call"
                            onClick={() =>
                              handleVoiceCall(
                                service.id,
                                service.mobile,
                                service.voice_price || service.voicePrice || service.price || 20
                              )
                            }
                          >
                            <i className="fa-solid fa-phone"></i>
                            <span>Call</span>
                          </button>

                          <button
                            type="button"
                            className="astro_action_btn btn_chat"
                            onClick={() => handleChat(service)}
                          >
                            <i className="fa-solid fa-comment-dots"></i>
                            <span>Chat</span>
                          </button>

                          <button
                            type="button"
                            className="astro_action_btn btn_video"
                            onClick={() =>
                              handleVideoCall(
                                service.id,
                                service.video_price || service.videoPrice || service.price || 25
                              )
                            }
                          >
                            <i className="fa-solid fa-video"></i>
                            <span>Video</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Modern Filter & Sort Modal */}
      {showFilterModal && (
        <div className="astro_filter_modal_backdrop" onClick={() => setShowFilterModal(false)}>
          <div
            className="astro_filter_modal_dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="astro_filter_modal_header">
              <div className="modal_header_title">
                <i className="fa-solid fa-sliders"></i>
                <h3>Filter & Sort Astrologers</h3>
              </div>
              <button
                type="button"
                className="modal_close_btn"
                onClick={() => setShowFilterModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="astro_filter_modal_body">
              {/* Sort By Section */}
              <div className="filter_section">
                <h4 className="filter_section_title">
                  <i className="fa-solid fa-arrow-down-wide-short"></i> Sort By
                </h4>
                <div className="filter_pills_group">
                  {[
                    { id: "recommended", label: "Recommended" },
                    { id: "price-low", label: "Price: Low to High" },
                    { id: "price-high", label: "Price: High to Low" },
                    { id: "rating-high", label: "Rating: High to Low" },
                    { id: "exp-high", label: "Experience: High to Low" },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      className={`filter_pill ${sortBy === opt.id ? "active" : ""}`}
                      onClick={() => setSortBy(opt.id)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Specialization / Skills Filter */}
              <div className="filter_section">
                <h4 className="filter_section_title">
                  <i className="fa-solid fa-wand-magic-sparkles"></i> Specialization & Skills
                </h4>
                <div className="filter_pills_group">
                  <button
                    type="button"
                    className={`filter_pill ${selectedSkill === "All" ? "active" : ""}`}
                    onClick={() => setSelectedSkill("All")}
                  >
                    All Skills
                  </button>
                  {availableSkills.map((sk, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`filter_pill ${selectedSkill === sk ? "active" : ""}`}
                      onClick={() => setSelectedSkill(sk)}
                    >
                      {sk}
                    </button>
                  ))}
                </div>
              </div>

              {/* Language Filter */}
              <div className="filter_section">
                <h4 className="filter_section_title">
                  <i className="fa-solid fa-language"></i> Language
                </h4>
                <div className="filter_pills_group">
                  <button
                    type="button"
                    className={`filter_pill ${selectedLanguage === "All" ? "active" : ""}`}
                    onClick={() => setSelectedLanguage("All")}
                  >
                    All Languages
                  </button>
                  {availableLanguages.map((lang, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`filter_pill ${selectedLanguage === lang ? "active" : ""}`}
                      onClick={() => setSelectedLanguage(lang)}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              {/* Experience Filter */}
              <div className="filter_section">
                <h4 className="filter_section_title">
                  <i className="fa-solid fa-briefcase"></i> Experience
                </h4>
                <div className="filter_pills_group">
                  {[
                    { id: "All", label: "Any Experience" },
                    { id: "1-3", label: "1 - 3 Years" },
                    { id: "3-5", label: "3 - 5 Years" },
                    { id: "5+", label: "5+ Years" },
                    { id: "10+", label: "10+ Years" },
                  ].map((expOpt) => (
                    <button
                      key={expOpt.id}
                      type="button"
                      className={`filter_pill ${selectedExp === expOpt.id ? "active" : ""}`}
                      onClick={() => setSelectedExp(expOpt.id)}
                    >
                      {expOpt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="astro_filter_modal_footer">
              <button
                type="button"
                className="filter_reset_action"
                onClick={clearAllFilters}
              >
                Reset All
              </button>
              <button
                type="button"
                className="filter_apply_action"
                onClick={() => setShowFilterModal(false)}
              >
                Show Results ({services.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Astrology;
