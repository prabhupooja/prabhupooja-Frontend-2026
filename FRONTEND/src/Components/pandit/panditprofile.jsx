import React, { useEffect, useState } from "react";
// import panditimg from "../Assets/panditimg.jpg";
import api from "../Axios/api";
import { useParams } from "react-router-dom";
import "../../styles/panditprofile.css";
import { Link, useNavigate } from "react-router-dom";
import { TailSpin } from "react-loader-spinner";
import useAuthStore from "../../Store/UserStore/userAuthStore";
import Swal from "sweetalert2";
import CryptoJS from "crypto-js";
import panditImage from "../Assets/profile-pic.png";

const PanditProfile = () => {
  const [panditData, setPanditData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const [balance, setBalance] = useState(0);
  const [modalVisible,setModalVisible] = useState(false);
  const [requestStatus, setRequestStatus] = useState(null);
  const navigate = useNavigate();

  const { user1 } = useAuthStore();

  const decryptId = (encryptedIdFromUrl) => {
    const decodedId = decodeURIComponent(encryptedIdFromUrl);
    const bytes = CryptoJS.AES.decrypt(decodedId, "prabhupooja2024");
    return bytes.toString(CryptoJS.enc.Utf8);
  };

  useEffect(() => {
    if (user1) {
      setBalance(user1?.balance);
    }
  }, [user1]);

  useEffect(() => {
    const fetchPanditData = async () => {
      try {
        const response = await api.get(`/pandit/id/${decryptId(id)}`);
        // console.log("chal rh hu");
        setPanditData(response.data.data);
        console.log(response.data.data);
        setLoading(false);
      } catch (err) {
        setError("Error fetching data");
        setLoading(false);
      }
    };
    fetchPanditData();
  }, [id]);

  // useEffect(() => {
  //   const fetchUserBalance = async () => {
  //     if (user1 && user1.id) {
  //       try {
  //         const response = await api.get(`/users/balance/${user1.id}`);

  //         if (response.data.success) {
  //           setBalance(response.data.balance);
  //         } else {
  //           setError(response.data.message || "Failed to fetch balance.");
  //         }
  //       } catch (error) {
  //         setError("Please login first!");
  //         console.error("Error fetching balance:", error);
  //       }
  //     }
  //   };

  //   fetchUserBalance();
  // }, [user1]);

  const createRequest = async (
    astrologerId,
    type,
    price,
    astrologerPhoneNumber
  ) => {
    if (!user1) {
      // navigate("/login");
      Swal.fire({
        icon: "warning",
        title: "Not Logged In",
        text: "Please log in to book the pandit.",
        confirmButtonText: "Go to Login",
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
    // console.log("Polling request status", requestId);
    const intervalId = setInterval(async () => {
      try {
        const response = await api.get(`/request/status/${requestId}`);
        // console.log("Request status:", response.data.status);
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
        icon: "warning",
        title: "Not Logged In",
        text: "Please log in to book the pandit.",
        confirmButtonText: "Go to Login",
      });
      return;
    }
    const b = parseFloat(balance);
    const p = parseFloat(price);

    // Compare and proceed with the logic
    if (b >= p) {
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
        icon: "warning",
        title: "Not Logged In",
        text: "Please log in to book the pandit.",
        confirmButtonText: "Go to Login",
      });
      return;
    }
    const b = parseFloat(balance);
    const p = parseFloat(price);
    // console.log(b >= p, b, p);
    if (b >= p) {
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
        icon: "warning",
        title: "Not Logged In",
        text: "Please log in to book the pandit.",
        confirmButtonText: "Go to Login",
      });
      return;
    }
    const b = parseFloat(balance);
    const p = parseFloat(price);
    // console.log(b >= p, b, p);
    // Compare and proceed with the logic
    if (b >= p) {
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

  if (error) return <div className="error-message">{error}</div>;
  if (!panditData) return <div className="no-data-message">No Pandit Data</div>;

  return (
    <>
      <div className="pandit-profile">
        <div className="profile-container-pandit">
          <div className="profile-row">
            <div className="profile-image-column">
              <img
                src={
                  panditData.profileImage
                    ? panditData.profileImage
                    : panditImage
                }
                alt={panditData.name || "Astrologer"}
                width={300}
                height={300}
                className="profile-image"
              />
            </div>
            <div className="profile-details-column">
              <div className="profile-details">
                <div className="profile-header-top">
                  <div>
                    <h1 className="profile-name">{panditData.name}</h1>
                    <div className="profile-meta">
                      <span className="verified-badge">
                        {panditData.verified === 1 ? "Verified Pandit" : "Pandit"}
                      </span>
                      <span className="profile-price">
                        ₹ {panditData.price}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="profile-description">
                  {panditData.name} is a respected pandit from {panditData.city}, {panditData.state}, {panditData.country}. With {panditData.experience} years of experience and a strong background in {panditData.qualification}, he provides trusted guidance across spiritual and ritual needs.
                </p>
                <div className="profile-info-grid">
                  <div className="profile-info-item">
                    <span>Qualification</span>
                    <strong>{panditData.qualification || "NA"}</strong>
                  </div>
                  <div className="profile-info-item">
                    <span>Experience</span>
                    <strong>{panditData.experience ? `${panditData.experience} years` : "NA"}</strong>
                  </div>
                  <div className="profile-info-item">
                    <span>Languages</span>
                    <strong>{panditData.language || "NA"}</strong>
                  </div>
                  <div className="profile-info-item">
                    <span>Temple</span>
                    <strong>{panditData.temple || "NA"}</strong>
                  </div>
                  <div className="profile-info-item">
                    <span>Location</span>
                    <strong>
                      {[panditData.city, panditData.state, panditData.country]
                        .filter(Boolean)
                        .join(", ") || "NA"}
                    </strong>
                  </div>
                  <div className="profile-info-item">
                    <span>Skills</span>
                    <strong>{panditData.skills && panditData.skills !== "NA" ? panditData.skills : "Spiritual guidance"}</strong>
                  </div>
                  {panditData.mobile && (
                    <div className="profile-info-item">
                      <span>Mobile</span>
                      <strong>{panditData.mobile}</strong>
                    </div>
                  )}
                  {panditData.email && (
                    <div className="profile-info-item">
                      <span>Email</span>
                      <strong>{panditData.email}</strong>
                    </div>
                  )}
                </div>
                <Link to="/enquiryform">
                  <button className="enquire-button">Enquire Now</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PanditProfile;
