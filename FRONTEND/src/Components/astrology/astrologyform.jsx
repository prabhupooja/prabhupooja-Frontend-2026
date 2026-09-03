import React, { useState, useEffect } from "react";
import "../../styles/astrologyform.css";
import useAstologerStore from "../../Store/AstrologerStore/AstrologerStore";
import useAuthStore from "../../Store/UserStore/userAuthStore";
import Swal from "sweetalert2";
import { useLocation, useNavigate } from "react-router-dom";
import { Oval } from "react-loader-spinner";
import api from "../Axios/api";

const AstrologyForm = () => {
  const { chatform, astrologerOneGet } = useAstologerStore();
  const location = useLocation();
  const [modalVisible, setModalVisible] = useState(false);
  const [panditData, setPanditData] = useState(null);
  const [error, setError] = useState("");
  const { astrologerID, uuid } = location.state || "";
  const { user1, isMember, userGet } = useAuthStore();
  const [DOB, setDOB] = useState("");
  const [TOB, setTOB] = useState("");
  const [birthPlace, setBirthPlace] = useState("");
  const [gender, setGender] = useState("");
  const navigate = useNavigate();
  const balance = user1?.balance;

  const handleSubmit = async (id, price) => {
    try {
      const response = await chatform({
        name: user1?.name,
        gender: gender || user1?.gender || "",
        DOB: DOB,
        TOB: TOB,
        birth_place: birthPlace,
        userid: user1.id,
      });
      // console.log(response.data.id, "dfd");
      Swal.fire({
        title: "Success!",
        text: "Your form has been submitted successfully.",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        HandleChat(id, price, response.data.id);
        setDOB("");
        setTOB("");
        setBirthPlace("");
      });
    } catch (error) {
      console.error("Error submitting form:", error);

      Swal.fire({
        title: "Error!",
        text: "Something went wrong. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  useEffect(() => {
    if (astrologerID) {
      fetchAstrologer();
    }
  }, [astrologerID]);

  useEffect(() => {
    if (!user1 && localStorage.getItem("token")) {
      userGet();
    }
  }, [user1, userGet]);

  useEffect(() => {
    const normalizedGender =
      user1?.gender || user1?.user_gender || user1?.gender_value || "";
    setGender(normalizedGender ? String(normalizedGender) : "");
  }, [user1]);

  const fetchAstrologer = async () => {
    const response = await astrologerOneGet(astrologerID);
    if (response.data.success) {
      setPanditData(response.data.data);
    }
  };

  const createRequest = async (astrologerId, type, price, id) => {
    // console.log(astrologerId, type, price, id);
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
        chat_form_id: id,
      });

      const requestId = response.data.requestId;
      pollRequestStatus(requestId, type, astrologerId, price);
    } catch (error) {
      console.error("Failed to create request:", error);
      setError("Failed to create request.");
      setModalVisible(false);
    }
  };

  const pollRequestStatus = (requestId, type, astrologerId, price) => {
    // console.log("in polrequest function", requestId);
    const intervalId = setInterval(async () => {
      try {
        const response = await api.get(`/request/status/${requestId}`);
        // console.log("here is the status", response.data);
        // setRequestStatus(response.data.status);

        if (response.data.status !== "pending") {
          clearInterval(intervalId);
          setModalVisible(false);
          // console.log(response.data.status);
          if (response.data.status === "accepted") {
            if (type === "chat") {
              // console.log(astrologerId, price, requestId, uuid);
              navigate(`/chat/${astrologerId}/${price}/${requestId}`, {
                state: { uuid, pandit: panditData },
              });
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch request status:", error);
        clearInterval(intervalId);
        setModalVisible(false);
      }
    }, 10000); // Poll every 5 seconds
  };

  const HandleChat = (astrologerId, price, id) => {
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
    console.log(b >= p, b, p);
    // Compare and proceed with the logic
    if (b >= p || isMember) {
      createRequest(astrologerId, "chat", price, id);
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

  return (
    <div className="chat-form">
      <h2 className="form-title">CHAT FORM</h2>
      <form className="form-container">
        <div className="form-group">
          <label htmlFor="name">Name: *</label>
          <input type="text" id="name" value={user1?.name} disabled required />
        </div>

        <div className="form-group">
          <label htmlFor="gender">Gender: *</label>
          <input
            type="text"
            id="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            placeholder="Enter your gender"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="dob">Date of Birth: *</label>
          <input
            type="date"
            id="dob"
            value={DOB}
            onChange={(e) => setDOB(e.target.value)}
            required
            max={new Date().toISOString().split("T")[0]}
          />
        </div>

        <div className="form-group">
          <label htmlFor="time">Time of Birth: *</label>
          <input
            type="time"
            id="time"
            value={TOB}
            onChange={(e) => setTOB(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="birthplace">Birth Place: *</label>
          <input
            type="text"
            id="birthplace"
            value={birthPlace}
            onChange={(e) => setBirthPlace(e.target.value)}
            placeholder="Enter your birth place"
            required
          />
        </div>
      </form>
      <button
        type="submit"
        className="chatform-button"
        onClick={() =>
          handleSubmit(
            panditData?.id,
            panditData?.chat_price ||
              panditData?.chatPrice ||
              panditData?.price ||
              location.state?.price ||
              15
          )
        }
      >
        Start Chat
      </button>
      {modalVisible && (
        <div className="loader">
          <Oval color="orange" secondaryColor="orange" height={50} width={50} />
        </div>
      )}
    </div>
  );
};

export default AstrologyForm;
