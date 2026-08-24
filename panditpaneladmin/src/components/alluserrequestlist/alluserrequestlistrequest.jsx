import React, { useEffect } from "react";
import "./userlistrequest.css";
import { IoChatbox } from "react-icons/io5";
import { IoMdCall } from "react-icons/io";
import { MdVideoCall } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import userimg from "../../assets/user-logo.webp";
import { FaStar } from "react-icons/fa";
import useAuthStore from "../Store/AuthStore/AuthStore";
function Userlistrequest() {
  const { pandit, getCommnet, comments, panditGet } = useAuthStore();
  const navigate = useNavigate();
  const token = localStorage.getItem("Pandittoken");

  const userFetch = async () => {
    if (!token) {
      navigate("/");
    } else {
      await panditGet();
    }
  };

  useEffect(() => {
    userFetch();
  }, []);

  useEffect(() => {
    if (pandit) {
      handlecomments();
    }
  }, [pandit]);

  const handlecomments = async () => {
    await getCommnet(pandit.id);
  };

  const handlechatrequest = () => {
    navigate("/chatrequest", { state: { type: "chat" } });
  };

  const handlecallrequest = () => {
    navigate("/callrequest", { state: { type: "voice" } });
  };

  const handlevideocallrequest = () => {
    navigate("/videocallrequest", { state: { type: "video" } });
  };

  const handlechathistoryrequest = () => {
    navigate("/chathistoryusers", { state: { type: "chat" } });
  };

  return (
    <>
      <div className="request_container">
        <h1>All Request Type</h1>
        <div className="dashboard-container">
          <div className="category-cards">
            <div className="category-card" onClick={handlechatrequest}>
              <IoChatbox className="request_icon" />
              <p>Chat Request</p>
            </div>
          </div>

          <div className="category-cards">
            <div className="category-card" onClick={handlecallrequest}>
              <IoMdCall className="request_icon" />
              <p>Call Request</p>
            </div>
          </div>

          <div className="category-cards">
            <div className="category-card" onClick={handlevideocallrequest}>
              <MdVideoCall className="request_icon" />
              <p>VideoCall request</p>
            </div>
          </div>

          <div className="category-cards">
            <div className="category-card" onClick={handlechathistoryrequest}>
              <IoChatbox className="request_icon" />
              <p>Chat History</p>
            </div>
          </div>
        </div>
      </div>

      <div className="recent-chats-container">
        <h2 className="recent-chats-title">User Comments</h2>
        {comments?.comments?.length > 0 ? (
          comments.comments.map((item) => (
            <div key={item.id} className="chat-item">
              <img src={userimg} alt="User" className="user-image" />
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
          <p>No comments available</p>
        )}
      </div>
    </>
  );
}

export default Userlistrequest;
