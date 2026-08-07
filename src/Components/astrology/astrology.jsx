import { useEffect, useState } from "react";
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
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [setModalVisible] = useState(false);
  const navigate = useNavigate();
  const { user1, isMember } = useAuthStore();
  const { astrologerGet, isloading } = useAstologerStore();

  const balance = user1?.balance;
  useEffect(() => {
    fetchAstrologer();
  }, []);

  const fetchAstrologer = async () => {
    try {
      const response = await astrologerGet();
      if (response?.data?.success) {
        setServices(response.data.data);
      } else {
        setServices([]);
      }
    } catch (err) {
      console.error("Error fetching astrologers:", err);
      setServices([]);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim() === "") {
      setError("Please enter a search term.");
      return;
    }

    setLoading(true);
    setServices([]);
    try {
      const response = await api.get(`/pandit/search?query=${searchQuery}`);
      if (response.data.success) {
        setServices(response.data.data);
      } else {
        setError(response.data.message || "No results found.");
        setServices([]);
      }
    } catch (error) {
      setError("Error performing search. Please try again.");
      console.error("Error performing search:", error);
    } finally {
      setLoading(false);
    }
  };

  // function slugify(text) {
  //   return text
  //     .toString()
  //     .toLowerCase()
  //     .replace(/\s+/g, "")
  //     .replace(/\-/g, "")
  //     .replace(/\s+/g, "-")
  //     .replace(/[^\w\-]+/g, "")
  //     .replace(/\-\-+/g, "-")
  //     .replace(/^-+/, "")
  //     .replace(/-+$/, "");
  // }

  const createRequest = async (
    astrologerId,
    type,
    price,
    astrologerPhoneNumber
  ) => {
    // console.log(astrologerId, type, price, astrologerPhoneNumber);
    if (!user1) {
      Swal.fire({
        title: "Login Required",
        text: "Please login!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Login Now",
        cancelButtonText: "Cancel",
      });
      return;
    }
    try {
      setModalVisible(true);
      const response = await api.post("/request", {
        user_id: user1?.id,
        pandit_astrologer_id: astrologerId,
        request_type: type,
        status: "pending",
      });

      const requestId = response.data.requestId;
      pollRequestStatus(
        requestId,
        type,
        astrologerId,
        price,
        astrologerPhoneNumber
      );
    } catch (error) {
      console.error("Failed to create request:", error);
      setError("Failed to create request.");
      setModalVisible(false);
    }
  };

  const pollRequestStatus = (
    requestId,
    type,
    astrologerId,
    price,
    astrologerPhoneNumber
  ) => {
    // console.log("in polrequest function", requestId);
    const intervalId = setInterval(async () => {
      try {
        const response = await api.get(`/request/status/${requestId}`);
        // console.log("here is the status", response.data);

        if (response.data.status !== "pending") {
          clearInterval(intervalId);
          setModalVisible(false);
          // console.log(response.data.status);
          if (response.data.status === "accepted") {
            if (type === "chat") {
              // console.log(astrologerId, price, requestId);
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
        setModalVisible(false);
      }
    }, 10000);
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
        alert("Call initiated successfully");
        if (type === "voice") {
          navigate(`/voicecall/${response.data.call.twilioCallSid}`);
        } else if (type === "video") {
          navigate(
            `/videocall/${response.data.call.roomName}/${response.data.call.callerToken}`
          );
        }
      } else {
        alert("Error", response.data.message);
      }
    } catch (error) {
      console.error("Failed to initiate call:", error);
      alert("Failed to initiate call");
    }
  };

  const handleChat = (astrologer) => {
    // console.log(astrologer, "fkdfj");
    navigate("/astrologyform", {
      state: { astrologerID: astrologer.id, uuid: astrologer.uuid },
    });
  };
  

  const handleVoiceCall = (astrologerId, mobile, price) => {
    if (!user1) {
      Swal.fire({
        title: "Login Required",
        text: "Please login!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Login Now",
        cancelButtonText: "Cancel",
      });
      return;
    }
    const b = parseFloat(balance);
    const p = parseFloat(price);
    // console.log(b >= p, b, p);
    if (b >= p || isMember) {
      createRequest(astrologerId, "voice", price, mobile);
    } else {
      Swal.fire({
        icon: "error",
        title: "Insufficient balance!",
        text: "Please recharge to continue.",
        confirmButtonText: "Go to Recharge",
        confirmButtonColor: "#cd5702",
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
        text: "Please login!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Login Now",
        cancelButtonText: "Cancel",
      });
      return;
    }
    const b = parseFloat(balance);
    const p = parseFloat(price);
    // console.log(b >= p, b, p);
    if (b >= p || isMember) {
      createRequest(astrologerId, "video", price);
    } else {
      Swal.fire({
        icon: "error",
        title: "Insufficient balance!",
        text: "Please recharge to continue.",
        confirmButtonText: "Go to Recharge",
        confirmButtonColor: "#cd5702",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/recharge");
        }
      });
    }
  };

  const encryptId = (ID) => {
    const encrypted = CryptoJS.AES.encrypt(
      ID.toString(),
      "prabhupooja2024"
    ).toString();
    return encodeURIComponent(encrypted);
  };

  if (loading || isloading) {
    return (
      <>
        <div>
          <NewLoader />
        </div>
      </>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <div className="sub_header_astrology">
        <div className="container">
          <div className="subheader_inner_astrology">
            <div className="subheader_text_astrology">
              <h1>Astrology</h1>
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

      <section className="astrologer_section">
        <div className="container">
          <form onSubmit={handleSearch}>
            <div className="astrologer_baar">
              <div className="astrologerbaar">
                <h1 className="heading_chat_with_astrologer">
                  Talk to Astrologer
                </h1>
              </div>

              <div className="astrologerbaar">
                <div className="available_balance_1">
                  Available balance:
                  <span className="balance_avail_1">₹ {user1?.balance}</span>
                </div>
              </div>

              <div className="astrologerbaar">
                <div className="recharge_btn">
                  <Link className="medium-screen" to="/recharge">
                    Recharge
                  </Link>
                  <button className="filter_1">
                    <i className="fa-solid fa-filter"></i> Filter
                  </button>
                  <div className="form-search search-mobile">
                    <input
                      type="search"
                      placeholder="Search Name...."
                      className="form-control search-input"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>

          <div className="best-pandit">
            <div className="row">
              {services?.length === 0 ? (
                <div className="col-12 mt-12 text-center">
                  <h4>Services will be available soon</h4>
                </div>
              ) : (
                services.map((service, index) => {
                  const encryptedId = encryptId(service.id);
                  return (
                    <div className="col-sm-4 pandit-section-start" key={index}>
                      <div className="pandit-box pandit_boxes">
                        <div className="box-upper-details">
                          <div className="pandit-details">
                            <div className="pandit-img">
                              <div className="pandit_image normal-border">
                                <Link to={`/astrologyprofile/${encryptedId}`}>
                                  <img
                                    src={
                                      service.profileImage
                                        ? service.profileImage
                                        : panditImage
                                    }
                                    alt={service.name || "Astrologer"}
                                  />
                                </Link>
                              </div>
                            </div>

                            <div className="pandit-bio">
                              <Link to={`/astrologyprofile/${encryptedId}`}>
                                <div className="pandit-name">
                                  {service.name}
                                </div>
                                <div className="pandit-designation light-clr">
                                  <span>{service.skills}</span>
                                </div>
                                <div className="pandit-language light-clr">
                                  <span>{service.language}</span>
                                </div>
                                <div className="pandit-experience light-clr">
                                  Exp: {service.experience}
                                </div>
                                <div className="star-rate">
                                  <span>Rating: </span>
                                  {[...Array(5)].map((_, i) => (
                                    <i
                                      className={`fa-solid ${
                                        i < (service.rating || 5)
                                          ? "fa-star"
                                          : "fa-star-o"
                                      }`}
                                      key={i}
                                      style={{
                                        color:
                                          i < (service.rating || 5)
                                            ? "gold"
                                            : "gray",
                                      }}
                                    ></i>
                                  ))}
                                </div>
                              </Link>
                              <div className="pandit-price-chat">
                                <span className="redBold">
                                  RS.{service.price}/min
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="pandit_all_btn">
                          <div className="chat-btn-pandit">
                            <div className="chat-button">
                              <button
                                className="btn_chat btn_chat_online"
                                onClick={() =>
                                  handleVoiceCall(
                                    service.id,
                                    service.mobile,
                                    service.price
                                  )
                                }
                              >
                                Call
                              </button>
                            </div>
                          </div>
                          <div className="chat-btn-pandit">
                            <div className="chat-button">
                              <button
                                className="btn_chat btn_chat_online"
                                onClick={() => handleChat(service)}
                              >
                                Chat
                              </button>
                            </div>
                          </div>
                          <div className="chat-btn-pandit">
                            <div className="chat-button pandit_btn">
                              <button
                                className="btn_chat btn_chat_online"
                                onClick={() =>
                                  handleVideoCall(service.id, service.price)
                                }
                              >
                                Video Call
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Astrology;
