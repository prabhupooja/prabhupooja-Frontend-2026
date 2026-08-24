import React, { useEffect, useState } from "react";
import "./chathistory.css";
import { FaRegUserCircle } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import useAuthStore from "../Store/AuthStore/AuthStore";
import api from "../Axios/api";
import moment from 'moment';

function Chathistory() {
  const { pandit } = useAuthStore();
  const location = useLocation();
  const { requestId, userName, date } = location.state || "";
  const [requests, setRequests] = useState([]);


  const fetchRequests = async () => {
    try {
      const response = await api.get(`/chats/chathistory/${requestId}`);
      setRequests(response.data.data);
    } catch (err) {
      console.log('Failed to load requests');
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [requestId]);

  return (
    <div className="chat-history-container">
      <div className="chat_header">
        <h2>
          <FaRegUserCircle className="user_icon" />
          {userName}
        </h2>
        <h2>Chat History</h2>
      </div>

      <div className="chat-history">
        <p className="userName">{moment(date).format('DD/MM/YYYY hh:mm A')}</p>
        {requests.length > 0 ? (
          requests.map((message, index) => {
            const isUserMessage = pandit?.uuid === message.sender_id;
            return (
              <div key={index} className={`message ${isUserMessage ? "user" : "bot"}`}>
                <span className={`sender ${isUserMessage ? "userNameUser" : "userNameOther"}`}>
                  {isUserMessage ? "You:" : userName || "Unknown"}
                </span>
                <p className={`messageText ${isUserMessage ? "userText" : "otherText"}`}>
                  {message.message}
                </p>
                <span className={`timestamp-text ${isUserMessage ? "timestamp-right" : "timestamp-left"}`}>
                  {moment(message.timestamp).format("hh:mm A")}
                </span>
              </div>
            );
          })
        ) : (
          <p className="no-messages">No messages yet</p>
        )}
      </div>

    </div>
  );
}

export default Chathistory;
