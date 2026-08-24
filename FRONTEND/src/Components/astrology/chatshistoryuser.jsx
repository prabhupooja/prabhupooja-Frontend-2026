import React from "react";
import "../../styles/chatshistory.css";
import { FaRegUserCircle } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import useAuthStore from "../../Store/UserStore/userAuthStore";
import { useState } from "react";
import api from "../Axios/api";
import { useEffect } from "react";
import moment from "moment";

function Chatshistoryuser() {
  const { user1 } = useAuthStore();
  const location = useLocation();
  const { requestId, name, date } = location.state || "";
  const [requests, setRequests] = useState([]);
  // console.log(requestId);
  const fetchRequests = async () => {
    try {
      const response = await api.get(`/chats/chathistory/${requestId}}`);
      setRequests(response.data.data);
    } catch (err) {
      // console.log('Failed to load requests', err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [requestId]);

  return (
    <>
      <div className="chat-history-container">
        <div className="chat_header">
          <h2>
            <FaRegUserCircle className="user_icon" />
            {name}
          </h2>
          <h2>Chat History</h2>
        </div>
        <div className="chat-history">
          <p className="userName">{moment(date).format('DD/MM/YYYY hh:mm A')}</p>
          {requests.length > 0 ? (
            requests.map((message, index) => {
              const isUserMessage = user1?.uuid === message.sender_id;
              return (
                <div key={index} className={`message ${isUserMessage ? "user" : "bot"}`}>
                  <span className={`sender ${isUserMessage ? "userNameUser" : "userNameOther"}`}>
                    {isUserMessage ? "You:" : name || "Unknown"}
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
    </>
  );
}

export default Chatshistoryuser;
