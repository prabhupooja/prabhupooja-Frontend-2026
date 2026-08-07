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
  const token = localStorage.getItem("token");
  const [paymentStatus, setPaymentStatus] = useState(null);
  const { id } = useParams();
  const [averageRating, setAverageRating] = useState(0);
  const [showRatingsPopup, setShowRatingsPopup] = useState(false);
  const { user1, isLoggin,setIsLoginPopup } = useAuthStore();
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

  useEffect(() => {
    const getNextTargetDate = () => {
      const currentDate = new Date();
      const targetDate = new Date();
      targetDate.setDate(currentDate.getDate() + 1);
      targetDate.setHours(0, 0, 0, 0);
      return targetDate.getTime();
    };
    const targetDate = getNextTargetDate();

    const interval = setInterval(() => {
      const currentTime = new Date().getTime();
      const difference = targetDate - currentTime;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        const nextTargetDate = getNextTargetDate();
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(interval);

        const newInterval = setInterval(() => {
          const newCurrentTime = new Date().getTime();
          const newDifference = nextTargetDate - newCurrentTime;

          if (newDifference > 0) {
            const newDays = Math.floor(newDifference / (1000 * 60 * 60 * 24));
            const newHours = Math.floor(
              (newDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
            );
            const newMinutes = Math.floor(
              (newDifference % (1000 * 60 * 60)) / (1000 * 60)
            );
            const newSeconds = Math.floor((newDifference % (1000 * 60)) / 1000);
            setTimeLeft({
              days: newDays,
              hours: newHours,
              minutes: newMinutes,
              seconds: newSeconds,
            });
          }
        }, 1000);

        return () => clearInterval(newInterval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (id && pujaDetails) {
      checkPaymentStatus();
    }
  }, [id, pujaDetails]);

  useEffect(() => {
    if (!id) return;
    fetchPujaDetails();
    fetchPujaRatings();
  }, [id]);

  useEffect(() => {
    if (user1 && isLoggin) {
      fetchBookingDate();
      fetchCurrentgDate();
    }
  }, [user1, isLoggin]);

  const decryptId = (encryptedIdFromUrl) => {
    const decodedId = decodeURIComponent(encryptedIdFromUrl);
    const bytes = CryptoJS.AES.decrypt(decodedId, "prabhupooja2024");
    return bytes.toString(CryptoJS.enc.Utf8);
  };

  const fetchPujaRatings = async () => {
    const res = await getPoojaRating(decryptId(id), "normal");
    if (res.data.success) {
      setAverageRating(res.data.data.averageRating);
    }
  };

  const fetchBookingDate = async () => {
    await getBookingDate(decryptId(id), user1?.id);
  };
  const fetchCurrentgDate = async () => {
    await getCurrectDate();
  };

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
      setLoading1(false);
    }
  }, [currentDate, bookingDate]);

  const checkPaymentStatus = async () => {
    try {
      const response = await api.get(
        `/payment/status/${user1?.id}/${decryptId(id)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        setPaymentStatus(response.data.status);
      } else {
        setPaymentStatus(null);
      }
    } catch (error) {
      console.error("Error retrieving payment status:", error);
      setPaymentStatus(null);
    }
  };

  const fetchPujaDetails = async () => {
    await getPoojaDetails(decryptId(id));
  };

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
      

    }  else {
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
                <p className="product_current_price">
                  Price: <span>{pujaDetails?.price}</span>
                </p>
                <p className="product_final_price">
                  <span>{pujaDetails?.final_price}</span>
                </p>
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
