import React, { useEffect, useState } from "react";
import {
  FaHandPointUp,
  FaVideo,
  FaCreditCard,
  FaBoxOpen,
  FaPen,
} from "react-icons/fa";
import StarRatings from "react-star-ratings";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import api from "../Axios/api";
import Swal from "sweetalert2";
import "./problemdetails.css";
import poojaimg1 from "../Assets/poojaimg1.jpg";
import poojaimg2 from "../Assets/poojaimg2.jpg";
import poojaimg3 from "../Assets/poojaimg3.jpg";
import poojaimg4 from "../Assets/poojaimg4.jpg";
import BookProblemPooja from "./bookproblempooja";
import { TailSpin } from "react-loader-spinner";
import RatingsPopup from "../poojapage/ratingpopup";
import useProblemPoojaStore from "../../Store/ProblemPoojaStore/ProblemPoojaStore";
import useAuthStore from "../../Store/UserStore/userAuthStore";
import usePujaStore from "../../Store/PoojaStore/PoojaStore";
import CryptoJS from "crypto-js";

function ProblemDetail() {
  const { id } = useParams();
  // const [problem, setProblem] = useState(null);
  const location = useLocation();
  const { problem_name } = location.state || "";
  const [error] = useState(null);
  // const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const [activeIndex, setActiveIndex] = useState(null);
  const [showFullContent, setShowFullContent] = useState(false);
  const [showRatingsPopup, setShowRatingsPopup] = useState(false);
  const [showFullSamagri, setShowFullSamagri] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedBox, setSelectedBox] = useState(null);
  const navigate = useNavigate();

  const [loading1, setLoading1] = useState(false);
  const [areDatesEqual, setAreDatesEqual] = useState(false);
  const [bookingDateGreater, setBookingDateGreater] = useState(false);
  const [bookingDateSmaller, setBookingDateSmaller] = useState(false);

  const handleShowMore = () => {
    setShowFullContent((prevState) => !prevState);
  };

  const { getPoojaRating } = usePujaStore();

  const {
    getSingleProblem,
    loading,
    problem,
    getBookingDate,
    bookingDate,
    getCurrectDate,
    currentDate,
    getBookings,
  } = useProblemPoojaStore();

  const { user1, isLoggin, setIsLoginPopup } = useAuthStore();
  const toggleAnswer = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const decryptId = (encryptedIdFromUrl) => {
    const decodedId = decodeURIComponent(encryptedIdFromUrl);
    const bytes = CryptoJS.AES.decrypt(decodedId, "prabhupooja2024");
    return bytes.toString(CryptoJS.enc.Utf8);
  };

  const fetchProblem = async () => {
    try {
      await getSingleProblem(decryptId(id));
    } catch (error) {
      console.error("Error fetching problem:", error);
    }
  };

  const fetchBookingDate = async () => {
    if (user1) {
      await getBookingDate(decryptId(id), user1?.id);
    }
  };

  const fetchBookings = async () => {
    if (user1) {
      await getBookings(user1?.id);
    }
  };

  const fetchRating = async () => {
    const res = await getPoojaRating(decryptId(id), problem_name);
    setAverageRating(res.data.data.averageRating);
  };

  useEffect(() => {
    if (isLoggin && user1) {
      fetchBookingDate();
      fetchBookings();
      getCurrectDate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggin, user1, id]);

  useEffect(() => {
    fetchProblem();
    fetchRating();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleFeedbackNavigation = () => {
    navigate("/feedbackform", {
      state: { pujaId: id, problem_name: problem_name },
    });
  };

  const handleLivePooja = async () => {
    try {
      const roomName = id.name.replace(/\s+/g, "");
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

  if (error) return <div>Error: {error}</div>;

  const handleOpenPopup = (box) => {
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
      setSelectedBox(box);
      setShowPopup(true);
    }
  };

  const handleClosePopup = () => {
    setSelectedBox(null);
    setShowPopup(false);
  };

  const boxData = [
    { id: "1", image: poojaimg1, title: "For 1 Devotee", price: "₹ 999.00" },
    { id: "2", image: poojaimg2, title: "Upto 2 Devotees", price: "₹ 1599.00" },
    { id: "3", image: poojaimg3, title: "Upto 3 Devotees", price: "₹ 2899.00" },
    { id: "4", image: poojaimg4, title: "Upto 4 Devotees", price: "₹ 3499.00" },
  ];

  const faqData = [
    {
      question: "What are the spiritual benefits of this pooja?",
      answer:
        "This pooja is believed to enhance peace, harmony, and prosperity in one's life.",
    },
    {
      question: "How does this pooja influence family relationships?",
      answer:
        "It fosters understanding and reduces conflicts, leading to healthier family dynamics.",
    },
    {
      question: "Is this pooja recommended for personal growth?",
      answer:
        "Yes, it encourages positive energy and clarity of thought, aiding personal development.",
    },
    {
      question: "When is the ideal time to perform this pooja?",
      answer:
        "It is recommended to perform this pooja during auspicious days or family celebrations.",
    },
    {
      question: "What benefits does this pooja offer for childbirth?",
      answer:
        "This pooja invokes divine blessings for safe and smooth childbirth, fostering health and prosperity.",
    },
  ];

  return (
    <>
      <div className="problemDetails container">
        <div className="row">
          {problem?.image && (
            <div className="col-sm-5">
              <img
                src={problem?.image}
                alt={problem?.name}
                className="problemImage"
              />
            </div>
          )}
          <div className="col-sm-5">
            <h1 className="problem_name"> {problem?.name}</h1>
            <h5 className="problem_desc">
              Removes Negativity & Solves Problems
            </h5>

            <p className="problem_temple_name">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 100 100"
                id="Temple"
                className="temple-icon"
              >
                <path
                  fill="#f8863d"
                  d="M73.1 58c1.1 0 1.9-.9 1.9-1.9v-2.8c0-1.1-.9-1.9-1.9-1.9H62.9l-2.5-15.9v-.1c-.4-2.4-1.6-4.7-3.5-6.3-1.7-1.4-3.7-2.3-5.9-2.5v-1.5l5-2.5c.3-.2.5-.5.5-.9s-.2-.7-.5-.9l-5.4-2.7c-.2 0-.4-.1-.6-.1-.6 0-1 .4-1 1v7.6c-4.7.4-8.6 4-9.4 8.8v.1l-2.5 15.9H26.9c-1.1 0-1.9.9-1.9 1.9v2.8c0 1.1.9 1.9 1.9 1.9h1.7v17.3h-1.7c-1.1 0-1.9.9-1.9 1.9V80c0 1.1.9 1.9 1.9 1.9h46.3c1.1 0 1.9-.9 1.9-1.9v-2.8c0-1.1-.9-1.9-1.9-1.9h-1.7V58h1.6zM54.9 75.3V64c0-1.1-.9-2-2-2H47c-1.1 0-2 .9-2 2v11.3h-4.5V58h18.9v17.3h-4.5zm-19.6-7.6h3.3v3.1h-3.3v-3.1zm3.2-2h-3.3v-3.1h3.3v3.1zm-3.2 7.1h3.3v2.6h-3.3v-2.6zm3.2-14.7v2.6h-3.3v-2.6h3.3zm-5.2 3.5v13.7h-2.7V58.1h2.7v3.5zm28.2 6.1h3.3v3.1h-3.3v-3.1zm0 5.1h3.3v2.6h-3.3v-2.6zm3.2-7.1h-3.3v-3.1h3.3v3.1zm2 6.1V58h2.7v17.2h-2.7v-3.4zm-2-11.2h-3.3V58h3.3v2.6zm-3.8-9.2h-6.4L53 39.7h6l1.9 11.7zM50 28.5c2 0 4 .7 5.6 2.1 1.5 1.3 2.5 3 2.8 4.9H41.6c.8-4 4.2-7 8.4-7zm-9 11.2h6l-1.4 11.7h-6.4L41 39.7z"
                  className="color060606 svgShape"
                ></path>
              </svg>
              <span> {problem?.temple_name} </span>
            </p>

            <div className="rating-section">
              <div className="rating-header">
                <p>254+ Devotees</p>
                <StarRatings
                  rating={parseFloat(averageRating)}
                  starRatedColor="gold"
                  starEmptyColor="gray"
                  starDimension="20px"
                  starSpacing="2px"
                  numberOfStars={5}
                  name="averageRating"
                  className="rating_stars"
                />
              </div>
              <button
                onClick={() => setShowRatingsPopup(true)}
                className="view-comments-btn"
              >
                View Ratings & Comments
              </button>
            </div>
            <div className="problem_samagri">
              <h5 className="samagri_title">Pooja Samagri:</h5>
              <ul>
                {showFullSamagri
                  ? problem?.samagri
                      .split("\n")
                      .map((item, index) => <li key={index}>{item}</li>)
                  : problem?.samagri
                      .split("\n")
                      .slice(0, 5)
                      .map((item, index) => <li key={index}>{item}</li>)}
              </ul>
              {problem?.samagri.split("\n").length > 5 && (
                <span
                  className="showMoreText"
                  onClick={() => setShowFullSamagri(!showFullSamagri)}
                >
                  {showFullSamagri ? "Show Less" : "Show More"}
                </span>
              )}
            </div>

            {areDatesEqual && (
              <div className="problem_content">
                <button
                  onClick={handleLivePooja}
                  className="problem-pooja-join-now"
                >
                  Join Now
                </button>
                <button
                  onClick={handleFeedbackNavigation}
                  className="problem-pooja-feedback-now"
                >
                  Feedback
                </button>
              </div>
            )}

            {bookingDateGreater && (
              <div className="problem_content">
                <p className="booking_text">
                  You have already booked, and your booking date is:{" "}
                  {new Date(bookingDate).toLocaleDateString("en-GB")}.
                </p>
              </div>
            )}

            {bookingDateSmaller && (
              <div className="problem_content">
                <p>
                  {bookingDate
                    ? `Your last Booking: ${new Date(
                        bookingDate
                      ).toLocaleDateString("en-GB")}`
                    : ""}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <hr />

      <div className="container">
        <div>
          {!areDatesEqual && !bookingDateGreater && (
            <div className="problem_content">
              {boxData.map((box) => (
                <div
                  key={box.id}
                  className="problem_box"
                  onClick={() => handleOpenPopup(box)}
                >
                  <img src={box.image} alt={box.title} className="box-img" />
                  <h3 className="box-title">{box.title}</h3>
                  <p className="box-price">{box.price}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="puja-participation">
          <h2>
            How to <span className="highlight">Participate in Puja?</span>
          </h2>
          <p className="subtext">3 easy steps to offer puja with Utsav</p>
          <div className="separatorLine"></div>

          <div className="steps-container">
            <div className="step">
              <FaHandPointUp className="step-icon" />
              <div>
                <h3>Select Puja</h3>
                <p>
                  Select a puja and bhet daan options such as vastra daan, gau
                  seva, brahman bhojan etc.
                </p>
              </div>
            </div>

            <div className="step">
              <FaCreditCard className="step-icon" />
              <div>
                <h3>Pay dakshina</h3>
                <p>
                  Securely pay your dakshina using UPI, Card or Net Banking.
                </p>
              </div>
            </div>

            <div className="step">
              <FaVideo className="step-icon" />
              <div>
                <h3>On puja date - Watch puja video</h3>
                <p>
                  Short darshan video will be shared on Puja tithi. Full video
                  with name-gotra will be sent on WhatsApp within 3-5 days.
                </p>
              </div>
            </div>

            <div className="step">
              <FaBoxOpen className="step-icon" />
              <div>
                <h3>Prasad delivered at Home</h3>
                <p>
                  Authentic prasad from the temple will be delivered within 7 -
                  10 days.
                </p>
              </div>
            </div>

            <div className="step">
              <FaPen className="step-icon" />
              <div>
                <h3>Fill sankalp form</h3>
                <p>
                  Enter offering name(s), gotra, prasad delivery address & puja
                  wish.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="poojaDetailsContainer">
          {/* <h2 className="sectionTitle">Pooja Details</h2> */}
          <h3 className="sectionTitle1">Benefits of Pooja</h3>
          <div className="separatorLine"></div>
          {faqData.map((faq, index) => (
            <div key={index} className="questionAnswerContainer">
              <div
                className="questionContainer"
                onClick={() => toggleAnswer(index)}
              >
                <p className="question">{faq.question}</p>
                <span className="arrow">
                  {activeIndex === index ? "▼" : "▲"}
                </span>
              </div>
              {activeIndex === index && (
                <div className="answerContainer">
                  <p className="answer">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="aboutPoojaContainer">
          <div className="aboutPoojaBox">
            <h3 className="sectionTitle1">About Pooja</h3>
            <div className="separatorLine"></div>
            <div className="aboutPoojaText">
              <p>
                The Childbirth Blessing Pooja is performed to seek divine
                blessings for a safe and smooth childbirth. This sacred ritual
                aims to provide spiritual support to expecting families,
                ensuring health and happiness for both mother and child. By
                conducting this pooja, devotees aim to alleviate any potential
                challenges during childbirth and invoke positive energies to
                create a nurturing environment.
              </p>
              {showFullContent && (
                <>
                  <p>
                    In addition to ensuring the well-being of the mother and
                    child, this pooja also strengthens the connection between
                    the family and divine blessings, invoking peace, prosperity,
                    and spiritual harmony. It is believed that performing the
                    pooja brings peace of mind to expecting parents and helps
                    them overcome any obstacles that may arise during the
                    pregnancy or childbirth process.
                  </p>
                  <p>
                    The pooja also includes specific rituals and mantras that
                    are said to invoke divine blessings for a smooth and safe
                    delivery, making it an essential spiritual practice for
                    families who wish to receive the best blessings for their
                    newborn.
                  </p>
                  <p>
                    Whether performed at home or in a temple, this pooja
                    provides a sense of spiritual security and relief, knowing
                    that the divine powers are watching over the expecting
                    family.
                  </p>
                </>
              )}
            </div>
            <span onClick={handleShowMore} className="showMoreText">
              {showFullContent ? "Show Less" : "Show More"}
            </span>
          </div>
        </div>
        {/* <button
          className="bookNowButton"
          onClick={() => alert("Booking Confirmed!")}
        >
          Book Now
        </button> */}

        {showPopup && selectedBox && (
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
              <BookProblemPooja
                problem={problem}
                selectedBox={selectedBox}
                onClose={handleClosePopup}
              />
            </div>
          </div>
        )}

        {showRatingsPopup && (
          <RatingsPopup id={id} onClose={() => setShowRatingsPopup(false)} />
        )}
      </div>
    </>
  );
}

export default ProblemDetail;
