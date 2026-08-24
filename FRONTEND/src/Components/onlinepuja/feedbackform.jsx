import React, { useState } from "react";
import "../../styles/FeedbackForm.css";
import api from "../Axios/api";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useAuthStore from "../../Store/UserStore/userAuthStore";

function FeedbackForm() {
  const { user1 } = useAuthStore();
  const location = useLocation();
  const { pujaId,problem_name } = location.state || {};
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    rating: 0,
    comments: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRating = (rating) => {
    setFormData({
      ...formData,
      rating: rating,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create the payload for the API call
    const payload = {
      name: user1.name,
      email: user1.email,
      userId: user1.id,
      pujaId: pujaId,
      rating: formData.rating,
      comment: formData.comments,
      problem_name: problem_name
    };

    try {
      // Show SweetAlert loader
      Swal.fire({
        title: "Submitting Feedback",
        text: "Please wait...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      const token = localStorage.getItem('token');
      // Send POST request to the backend API
      const response = await api.post("/feedback/create", payload,
         {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

      Swal.close(); // Close the loader

      if (response.data.success) {
        // Show success alert
        Swal.fire({
          icon: "success",
          title: "Thank you!",
          text: "Feedback Submitted Successfully",
        }).then(() => {

          navigate("/");
        });

        setFormData({
          rating: 0,
          comments: "",
        });
      } else {
        // Show error alert
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: "Failed to submit feedback",
        });
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      // Show error alert
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while submitting feedback",
      });
    }
  };

  return (
    <div className="feedback-form-container">
      <h2 className="feedback-heading">Give Us Your Feedback</h2>
      <form onSubmit={handleSubmit} className="feedback-form">
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={user1?.name}
            readOnly
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={user1?.email}
            readOnly
          />
        </div>

        <div className="form-group">
          <label htmlFor="rating">Rating</label>
          <div className="rating-stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`star ${formData.rating >= star ? "filled" : ""}`}
                onClick={() => handleRating(star)}
              >
                &#9733;
              </span>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="comments">Comments</label>
          <textarea
            id="comments"
            name="comments"
            value={formData.comments}
            onChange={handleChange}
            rows="4"
            placeholder="Write your comments here"
          />
        </div>

        <button type="submit" className="submit-btn">
          Submit Feedback
        </button>
      </form>
    </div>
  );
}

export default FeedbackForm;
