import React, { useState, useEffect, useRef } from "react";
import "./Panditchat.css";
import userimg from "../../assets/user-logo.webp";
import { IoSend } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "../Store/AuthStore/AuthStore";
import api from "../Axios/api";
import Swal from "sweetalert2";
import { MdOutlineCallEnd } from "react-icons/md";
import moment from 'moment'

function Panditchat() {
  const location = useLocation();
  const { pandit } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const { requestId, uuid, user_name } = location.state || {};
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const startTimeRef = useRef(null);
  const [mode, setMode] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    startTimeRef.current = Date.now();
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    handleModeGet();
  }, [mode, messages]);

  useEffect(() => {
    if (mode === 0) {
      handleEndChat();
    }
  }, [mode]);

  const fetchMessages = async () => {
    try {
      const response = await api.get(`/chats/messages/${pandit.uuid}/${uuid}`);
      setMessages(response.data.messages);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      setLoading(false);
    }
  };
  const handleModeGet = async () => {
    const response = await api.get(`/chats/panditMode/${pandit?.id}`);
    const hello = response.data.data.chat_mode
    setMode(hello);
  }

  const handleEndChat = async () => {
    try {
      await api.post("/chats/chatEnd", {
        user_uuid: uuid,
        pandit_uuid: pandit?.uuid,
      });

      handleModeGet();

      await Swal.fire({
        title: "Chat Ended!",
        text: "Chat Ended successfully",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/home");
      });
    } catch (error) {
      console.error("Error ending chat:", error);
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      try {
        await api.post('/chats/messages/create', {
          senderId: pandit.uuid,
          receiverId: uuid,
          message: newMessage,
          request_id: requestId
        });
        setNewMessage('');
        fetchMessages();
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    }
  };

   const groupedMessages = messages.reduce((acc, msg) => {
     const date = moment(msg.timestamp).format('DD MMM YYYY'); 
     if (!acc[date]) {
       acc[date] = [];
     }
     acc[date].push(msg);
     return acc;
   }, {});
   
   const today = moment().format('DD MMM YYYY'); 
   const yesterday = moment().subtract(1, 'days').format('DD MMM YYYY'); 

  return (
    <div className="chat-container">
      <div className="chat-header">
        <img src={userimg} alt="userimg" />
        <p>{user_name}</p>
        <button className="end_btn" onClick={handleEndChat}>
          <MdOutlineCallEnd className="end-btn-icon" /> End
        </button>
      </div>
      <div className="chat-body">
        {loading ? (
          <div className="loader">Loading...</div>
        ) : (
          <div className="message">
         {Object.keys(groupedMessages).map((date, index) => (
              
            <div key={index} className="my-message">
              <p style={{textAlign:"center", padding:"8px 5px", fontSize:"15px"}}>
              {date === today ? "Today" : date === yesterday ? "Yesterday" : date}
            </p>
                
          {groupedMessages[date].map((msg) => (
          <div
            key={msg.id}
            className={`my-message ${pandit?.uuid === msg.sender_id ? "sent" : "received"}`}
          >
            <p className="message-text">{msg.message}</p>
            <span className="message-time">
              {new Date(msg.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        ))}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message"
        />
        <button onClick={handleSendMessage}>
          <IoSend className="send-icon" />
        </button>
      </div>
    </div>
  );
}

export default Panditchat;
