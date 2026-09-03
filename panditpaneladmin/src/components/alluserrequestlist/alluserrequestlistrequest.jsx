import React, { useEffect } from "react";
import "./userlistrequest.css";
import { IoChatbox } from "react-icons/io5";
import { IoMdCall } from "react-icons/io";
import { MdVideoCall, MdHistory } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import userimg from "../../assets/user-logo.webp";
import { FaStar } from "react-icons/fa";
import useAuthStore from "../Store/AuthStore/AuthStore";

function Userlistrequest() {
  const { pandit, getCommnet, comments, panditGet } = useAuthStore();
  const navigate = useNavigate();
  const token = localStorage.getItem("Pandittoken");

  useEffect(() => {
    if (!token) {
      navigate("/");
    } else {
      panditGet();
    }
  }, [token]);

  useEffect(() => {
    if (pandit?.id) {
      getCommnet(pandit.id);
    }
  }, [pandit?.id]);

  return (
    <div className="all-request-page">
      <h1 className="request-page-title">Consultation & Request Channels</h1>

      <div className="request-cards-grid">
        <div className="req-card" onClick={() => navigate("/chatrequest", { state: { type: "chat" } })}>
          <div className="req-card-icon chat">
            <IoChatbox />
          </div>
          <p>Live Chat Requests</p>
        </div>

        <div className="req-card" onClick={() => navigate("/callrequest", { state: { type: "voice" } })}>
          <div className="req-card-icon call">
            <IoMdCall />
          </div>
          <p>Voice Call Requests</p>
        </div>

        <div className="req-card" onClick={() => navigate("/videocallrequest", { state: { type: "video" } })}>
          <div className="req-card-icon video">
            <MdVideoCall />
          </div>
          <p>Video Call Requests</p>
        </div>

        <div className="req-card" onClick={() => navigate("/chathistoryusers", { state: { type: "chat" } })}>
          <div className="req-card-icon history">
            <MdHistory />
          </div>
          <p>Chat & Call History</p>
        </div>
      </div>

      <div className="user-reviews-box">
        <h2>Devotee Reviews & Feedback</h2>
        <div className="reviews-list">
          {comments?.comments?.length > 0 ? (
            comments.comments.map((item) => (
              <div key={item.id || item._id} className="review-item">
                <img src={userimg} alt="User" className="review-avatar" />
                <div className="review-content">
                  <h4 className="review-name">{item.name || "Devotee"}</h4>
                  <p className="review-text">{item.comment || "Very peaceful and accurate consultation."}</p>
                  <div className="review-stars">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        style={{ color: i < (item.rating || 5) ? "#ff7a00" : "#cbd5e1" }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ color: "#94a3b8", textAlign: "center", padding: "30px" }}>
              No comments or reviews available yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Userlistrequest;
