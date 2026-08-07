import React, { useEffect, useState } from "react";
import "../../styles/pandit.css";
import { Link, useNavigate } from "react-router-dom";
import api from "../Axios/api";
import { Oval } from "react-loader-spinner";
import { TailSpin } from "react-loader-spinner";
import Swal from "sweetalert2";
import useMuhuratStore from "../../Store/MuhuratStore/MuhuratStore";
import useAuthStore from "../../Store/UserStore/userAuthStore";
import CryptoJS from "crypto-js";
import panditImage from "../Assets/profile-pic.png";

const Panditmuhuratprofile = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [requestStatus, setRequestStatus] = useState(null);
  const { user1, isMember } = useAuthStore();
  const navigate = useNavigate();
  const { allMuhuratPandit, muhuratPandit } = useMuhuratStore();

  const handlevivahform = () => {
    navigate("/pujanmuhurat");
  };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        await allMuhuratPandit();
      } catch (error) {
        setError("Error fetching services. Please try again.");
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  function slugify(text) {
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/\-/g, "")
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "");
  }

  const createRequest = async (
    astrologerId,
    type,
    price,
    astrologerPhoneNumber
  ) => {
    if (!user1) {
      // navigate("/login");
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
        user_id: user1.id,
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
        // console.log("here is the status", response.data.status);
        setRequestStatus(response.data.status);

        if (response.data.status !== "pending") {
          clearInterval(intervalId);
          setModalVisible(false);
          // console.log(response.data.status);
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
        setModalVisible(false);
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
        callerId: user1.id,
        receiverId: astrologerId,
        type,
        callerPhoneNumber: user1.mobile,
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
  const handleChat = (astrologerId, price) => {
    if (!user1) {
      // navigate("/signup");
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
    const b = parseFloat(user1?.balance);
    const p = parseFloat(price);
    // console.log(b >= p, b, p);

    if (b >= p || isMember) {
      createRequest(astrologerId, "chat", price);
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

  const handleVoiceCall = (astrologerId, mobile, price) => {
    if (!user1) {
      // navigate("/signup");
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
    const b = parseFloat(user1?.balance);
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
      // navigate("/signup");
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
    const b = parseFloat(user1?.balance);
    const p = parseFloat(price);
    // console.log(b >= p, b, p);
    // Compare and proceed with the logic
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

  if (loading) {
    return (
      <>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "5vh",
            marginTop: "50px",
          }}
        >
          <TailSpin height="50" width="50" color="orange" />
        </div>
        <p className="loading_text">Loading...</p>
      </>
    );
  }

  return (
    <>
      <section className="pandit_section muhurat_section">
        <div className="container">
          <form action="">
            <div className="pandit_baar">
              <div className="panditbaar">
                <h1 className="heading_chat_with_pandit">Talk to Pandit</h1>
              </div>
            </div>
            <div>
              <p className="availble_balance_pandit">
                Available balance:₹{user1?.balance}
              </p>
            </div>
          </form>

          <div className="best-pandit">
            <div className="row">
              {muhuratPandit.map((service, index) => {
                const encryptedId = encryptId(service.id);
                return (
                  <div className="col-sm-4 pandit-section-start" key={index}>
                    <div className="pandit-box pandit_boxes2">
                      <div className="box-upper-details1">
                        <div className="pandit-details">
                          <div className="pandit-img">
                            <div className="pandit_image normal-border">
                              <Link to={`/panditaboutprofile/${encryptedId}`}>
                                <img
                                  src={
                                    service.profileImage &&
                                    service.profileImage.trim() !== ""
                                      ? `${service.profileImage}`
                                      : panditImage
                                  }
                                  alt={service.name || "Pandit Image"}
                                />
                              </Link>
                            </div>
                          </div>

                          <div className="pandit-bio">
                            <Link to={`/panditaboutprofile/${encryptedId}`}>
                              <div className="pandit-name">{service.name}</div>
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
                                {service.price} price / 15 min
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="pandit_all_btn">
                          <div className="chat-btn-pandit">
                            <div className="chat-button">
                              <Link>
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
                              </Link>
                            </div>
                          </div>

                          <div className="chat-btn-pandit">
                            <div className="chat-button">
                              {/* <Link> */}
                              <button
                                className="btn_chat btn_chat_online"
                                // onClick={() =>
                                //   handleChat(service.id, service.price)
                                // }
                                onClick={handlevivahform}
                              >
                                Chat
                              </button>
                              {/* </Link> */}
                            </div>
                          </div>
                          <div className="chat-button">
                            <Link>
                              <button
                                className="btn_chat btn_chat_online"
                                onClick={() =>
                                  handleVideoCall(service.id, service.price)
                                }
                              >
                                Video Call
                              </button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {modalVisible && (
        <div className="loader">
          <Oval color="orange" secondaryColor="orange" height={50} width={50} />
        </div>
      )}
    </>
  );
};

export default Panditmuhuratprofile;
