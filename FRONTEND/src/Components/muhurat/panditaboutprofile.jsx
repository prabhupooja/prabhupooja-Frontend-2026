import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../Axios/api";
import { useNavigate } from "react-router-dom";
import { TailSpin } from "react-loader-spinner";
import { Oval } from "react-loader-spinner";
import "../../styles/muhurat.css";
import panditImage from "../Assets/profile-pic.png";
import Swal from "sweetalert2";
import useAuthStore from "../../Store/UserStore/userAuthStore";
import CryptoJS from "crypto-js";
import { FaStar, FaRegStar } from "react-icons/fa";
import userimg from "../Assets/user-logo.webp";

const Panditaboutprofile = () => {
  const [panditData, setPanditData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const [modalVisible, setModalVisible] = useState(false);
  const [requestStatus, setRequestStatus] = useState(null);
  const navigate = useNavigate();
  const { user1, isMember } = useAuthStore();

  const decryptId = (encryptedIdFromUrl) => {
    const decodedId = decodeURIComponent(encryptedIdFromUrl);
    const bytes = CryptoJS.AES.decrypt(decodedId, "prabhupooja2024");
    return bytes.toString(CryptoJS.enc.Utf8);
  };

  useEffect(() => {
    const fetchPanditData = async () => {
      try {
        const response = await api.get(`/pandit/mahurat/${decryptId(id)}`);
        // console.log("chal rh");
        setPanditData(response.data.data);
        setLoading(false);
      } catch (err) {
        setError("Error fetching data");
        setLoading(false);
      }
    };
    fetchPanditData();
  }, [id]);

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
    const b = parseFloat(user1?.balance);
    const p = parseFloat(price);
    // console.log(b >= p, b, p);
    // Compare and proceed with the logic
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

  if (error) return <div>{error}</div>;
  if (!panditData) return <div>No Pandit Data</div>;

  const recentChats = [
    {
      id: 1,
      name: "kiran",
      comment:
        "thank you so much aapse baat karke mujhe bahut hi achcha laga aur relax bhi feel hua thank u main",
    },
    {
      id: 2,
      name: "shruti",
      comment:
        "बहुत-बहुत धन्यवाद, आपसे बात करके मुझे बहुत अच्छा लगा और आपने जो भी कुछ बताया, मेरे बारे में बहुत-बहुत धन्यवाद, बिल्कुल सही भविष्यवाणी करके बतायें, थैंक यू सो मच",
    },
    {
      id: 3,
      name: "Rishikesh",
      comment:
        "Aap Se baat kar ke bahut Achha laga thank you so much aapko is platform par Bahut hi Achcha knowledge hai thank you so much mam",
    },
    {
      id: 4,
      name: "nikhil",
      comment:
        "thank you so much aapse baat karke mujhe bahut Achcha Laga bahut relax feel ho raha hai aapke pass Anubhav bahut hi Achcha hai thank",
    },
    {
      id: 5,
      name: "ishuu",
      comment:
        "main aapse baat karke bahut achcha Laga aapko is platform per bahut hi achcha knowledge hai thank u so Mach",
    },
  ];

  return (
    <>
      <section className="astrologer_profile_section">
        <div className="container">
          <div className="border_outline">
            <div className="row align-items-start">
              <div className="col-sm-3">
                <div className="astrologer_profile_picture1">
                  <div className="profile-picture">
                    <img
                      src={
                        panditData.profileImage &&
                        panditData.profileImage.trim() !== ""
                          ? `${panditData.profileImage}`
                          : panditImage
                      }
                      alt={panditData.name || "Pandit Image"}
                      className="profile-img"
                    />
                  </div>
                </div>
              </div>
              <div className="col-sm-9">
                <h1 className="astrologer_name">{panditData.name}</h1>
                <div className="astrologer_profession">{panditData.skills}</div>
                <div className="astrologer_language">{panditData.language}</div>
                <div className="astrologer_experience">
                  Exp: {panditData.experience}
                </div>
                <div className="price_rate">
                  <div className="astrologer_fees">
                    <div className="fees_amount">
                      <span className="bold_class">
                        {panditData.price} ₹<span> / 15 min</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="row chat_call_btns">
                  <div className="col-sm-3">
                    <button
                      className="astrologer_btn_chat status_chat"
                      onClick={() =>
                        handleChat(panditData.id, panditData.price)
                      }
                    >
                      <div className="chat_btn">
                        <div className="chat">Chat</div>
                      </div>
                    </button>
                  </div>
                  <div className="col-sm-3">
                    <button
                      className="astrologer_btn_chat status_chat"
                      onClick={() =>
                        handleVoiceCall(
                          panditData.id,
                          panditData.mobile,
                          panditData.price
                        )
                      }
                    >
                      <div className="chat_btn">
                        <div className="chat">Call</div>
                      </div>
                    </button>
                  </div>
                  <div className="col-sm-3">
                    <button
                      className="astrologer_btn_chat status_chat"
                      onClick={() =>
                        handleVideoCall(
                          panditData.id,
                          panditData.mobile,
                          panditData.price
                        )
                      }
                    >
                      <div className="chat_btn">
                        <div className="chat">Video Call</div>
                      </div>
                    </button>
                  </div>
                  <div className="col-sm-3"></div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-sm-12">
                <div className="aboutme_content">
                  <h2 className="aboutme_heading">About me</h2>
                  <p className="aboutme_para">
                    Atharv Sharma is a Vedic Astrologer in India. He will
                    consult you regarding Marriage Consultation, Career and
                    Business, Love and Relationship, Wealth and Property, Career
                    issues, and much more. The remedies he provides are very
                    easy and effective and are proven to be accurate most of the
                    time. Moreover, his customers are always satisfied with his
                    solutions and remedies. He treats all his customers on a
                    personal level and tries to build a relationship with them.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {modalVisible && (
        <div className="loader">
          <Oval color="orange" secondaryColor="orange" height={50} width={50} />
        </div>
      )}

      <div className="recent-chats-container">
        <h2 className="recent-chats-title">User Reviews</h2>
        {recentChats.map((item) => (
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
        ))}
      </div>
    </>
  );
};

export default Panditaboutprofile;
