import React, { useEffect, useState } from "react";
import "../../styles/astrologyprofile.css";
import api from "../Axios/api";
import { Oval } from "react-loader-spinner";
import { useParams, useNavigate } from "react-router-dom";
import { TailSpin } from "react-loader-spinner";
import useAuthStore from "../../Store/UserStore/userAuthStore";
import useAstologerStore from "../../Store/AstrologerStore/AstrologerStore";
import Swal from "sweetalert2";
import CryptoJS from "crypto-js";
import panditImage from "../Assets/profile-pic.png";
import { FaStar } from "react-icons/fa";
import userimg from "../Assets/user-logo.webp";
import usePanditStore from "../../Store/PanditStore/PanditStore";

const AstrologyProfile = () => {
  const [panditData, setPanditData] = useState(null);
  const [loading] = useState(false);
  const [setRequestStatus] = useState(null);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const { user1, isMember } = useAuthStore();
  const { astrologerOneGet, isloading } = useAstologerStore();
  const { getCommnet, comments } = usePanditStore();
  const balance = user1?.balance;
  const decryptId = (encryptedIdFromUrl) => {
    const decodedId = decodeURIComponent(encryptedIdFromUrl);
    const bytes = CryptoJS.AES.decrypt(decodedId, "prabhupooja2024");
    return bytes.toString(CryptoJS.enc.Utf8);
  };

  // const handlecomments = async () => {
  //   console.log(panditData, "dfdfdfdfdfdfdfd");
  //   await getCommnet(panditData?.id);
  // };

  useEffect(() => {
    fetchAstrologer();
  }, []);

  const fetchAstrologer = async () => {
    try {
      const response = await astrologerOneGet(decryptId(id));
      if (response?.data?.success) {
        const raw = response?.data?.data;
        const data = Array.isArray(raw) ? raw[0] : raw;
        setPanditData(data);
        if (data?.id) {
          await getCommnet(data.id);
        }
      }
    } catch (err) {
      console.error("Error fetching astrologer profile:", err);
    }
  };

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
    navigate("/astrologyform", {
      state: { astrologerID: astrologer.id, uuid: astrologer.uuid },
    });
  };

  const handleVoiceCall = (astrologerId, mobile, price) => {
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
    const b = parseFloat(balance);
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

  // console.log(comments, "ddf");

  if (loading || isloading) {
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

  if (error) return <div className="error">{error}</div>;
  if (!panditData) return <div className="no-data">No Pandit Data</div>;

  // console.log(comments, "ddfdffgrfg");

  return (
    <>
      <section className="astrology-profile">
        <div className="container">
          <div className="profile-card">
            <div className="profile-header">
              <div className="profile-picture">
                <img
                  src={
                    panditData.profileImage
                      ? panditData.profileImage
                      : panditImage
                  }
                  alt={panditData.name || "Astrologer"}
                  className="profile-img"
                />
              </div>
              <div className="profile-details">
                <h1 className="profile-name">{panditData.name}</h1>
                <div className="profile-profession">{panditData.skills}</div>
                <div className="profile-language">{panditData.language}</div>
                <div className="profile-experience">
                  Exp: {panditData.experience} Years
                </div>
                <div className="profile-price">
                  <span className="price-amount">
                    ₹ {panditData.price}
                    <span>/min</span>
                  </span>
                </div>

                <div className="profile-actions">
                  <button
                    className="action-btn chat-btn"
                    onClick={() => handleChat(panditData)}
                  >
                    Chat
                  </button>
                  <button
                    className="action-btn call-btn"
                    onClick={() =>
                      handleVoiceCall(
                        panditData.id,
                        panditData.mobile,
                        panditData.price
                      )
                    }
                  >
                    Call
                  </button>
                  <button
                    className="action-btn video-call-btn"
                    onClick={() =>
                      handleVideoCall(panditData.id, panditData.price)
                    }
                  >
                    Video Call
                  </button>
                </div>
              </div>
            </div>

            <div className="profile-about">
              <h2 className="about-heading">About Me</h2>
              <p className="about-text">
                {panditData.name} is a {panditData.skills} Astrologer in India.
                He will consult you regarding Marriage Consultation, Career and
                Business, Love and Relationship, Wealth and Property, Career
                issues, and much more. The remedies he provides are very easy
                and effective and are proven to be accurate most of the time.
                Moreover, his customers are always satisfied with his solutions
                and remedies. He treats all his customers on a personal level
                and tries to build a relationship with them.
              </p>
            </div>
          </div>
        </div>
        {modalVisible && (
          <div className="loader">
            <Oval
              color="orange"
              secondaryColor="orange"
              height={50}
              width={50}
            />
          </div>
        )}
      </section>

      <div className="recent-chats-container">
        <h2 className="recent-chats-title">User Reviews</h2>
        {comments?.comments?.length > 0 ? (
          comments.comments.map((item) => (
            <div key={item.id} className="chat-item">
              <img src={userimg} alt="User" className="user-image-comment" />
              <div className="comment-content">
                <h4 className="chat-name">{item.name}</h4>
                <p className="chat-message">{item.comment}</p>
                <div className="rating-container">
                  <div className="star-rate">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        style={{
                          color: i < (item.rating || 5) ? "gold" : "gray",
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="no_availble">No comments available</p>
        )}
      </div>
    </>
  );
};

export default AstrologyProfile;
