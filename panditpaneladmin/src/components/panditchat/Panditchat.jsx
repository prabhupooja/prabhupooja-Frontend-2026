import React, { useState, useEffect, useRef } from "react";
import "./Panditchat.css";
import userimg from "../../assets/user-logo.webp";
import { IoSend } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "../Store/AuthStore/AuthStore";
import api from "../Axios/api";
import Swal from "sweetalert2";
import { MdOutlineCallEnd, MdTimer } from "react-icons/md";
import { FaRupeeSign, FaUserCircle } from "react-icons/fa";
import moment from "moment";

function Panditchat() {
  const location = useLocation();
  const navigate = useNavigate();
  const { pandit, panditGet } = useAuthStore();
  const { requestId, uuid, user_name, userId, astroId } = location.state || {};

  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [sessionActive, setSessionActive] = useState(true);
  const [userDetails, setUserDetails] = useState(null);

  const startTimeRef = useRef(Date.now());
  const timerRef = useRef(null);
  const messagesEndRef = useRef(null);

  const ratePerMinute = Number(pandit?.chat_price || pandit?.chatPrice || pandit?.price || 15);
  const currentMinutes = Math.max(1, Math.ceil(elapsedSeconds / 60));
  const currentEarnings = currentMinutes * ratePerMinute;

  useEffect(() => {
    panditGet();
    startTimeRef.current = Date.now();

    // Start Live Talk-Time Timer
    timerRef.current = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Fetch initial chat messages & user details
  useEffect(() => {
    if (!requestId && !uuid) {
      console.warn("No active session params");
    }

    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);

    return () => clearInterval(interval);
  }, [requestId, uuid, pandit?.uuid]);

  const fetchMessages = async () => {
    try {
      if (requestId) {
        const response = await api.get(`/chats/chathistory/${requestId}`);
        if (response.data?.data) {
          setMessages(response.data.data);
        } else if (response.data?.messages) {
          setMessages(response.data.messages);
        }
      } else if (pandit?.uuid && uuid) {
        const response = await api.get(`/chats/messages/${pandit.uuid}/${uuid}`);
        if (response.data?.messages) {
          setMessages(response.data.messages);
        }
      }
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Format Elapsed Time: MM:SS
  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Quick astrological response phrases
  const quickReplies = [
    "Namaste! 🙏 Welcome to PrabhuPooja consultation.",
    "Kripya apna Janma Samay aur Sthan batayein.",
    "Aapki kundli me Grah Dasha dekh raha hu, kripya pratiksha karein.",
    "Yeh samay shubh karyon ke liye anukool hai.",
  ];

  const handleSendQuickReply = (text) => {
    setNewMessage(text);
  };

  const handleSendMessage = async () => {
    const textToSend = newMessage.trim();
    if (!textToSend) return;

    const tempMsg = {
      id: `temp-${Date.now()}`,
      sender_id: pandit?.uuid || pandit?.id,
      message: textToSend,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempMsg]);
    setNewMessage("");

    try {
      await api.post("/chats/messages/create", {
        senderId: pandit?.uuid || pandit?.id,
        receiverId: uuid || userId,
        message: textToSend,
        request_id: requestId,
      });
      fetchMessages();
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleEndChat = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setSessionActive(false);

    const totalMinutes = Math.max(1, Math.ceil(elapsedSeconds / 60));
    const totalEarned = totalMinutes * ratePerMinute;

    try {
      // 1. Call Chat End endpoint
      await api.post("/chats/chatEnd", {
        user_uuid: uuid,
        pandit_uuid: pandit?.uuid,
        request_id: requestId,
        duration_minutes: totalMinutes,
        earned_amount: totalEarned,
      });

      // 2. Show Astrotalk-like Consultation Summary Modal
      await Swal.fire({
        title: "🕉️ Consultation Completed!",
        html: `
          <div style="text-align: left; padding: 10px; font-size: 0.95rem; line-height: 1.6;">
            <p><strong>Devotee:</strong> ${user_name || "Yajman"}</p>
            <p><strong>Total Talk-Time:</strong> ${formatTimer(elapsedSeconds)} (${totalMinutes} mins)</p>
            <p><strong>Consultation Rate:</strong> ₹${ratePerMinute}/min</p>
            <hr style="border: 0.5px solid #e2e8f0; margin: 10px 0;" />
            <p style="font-size: 1.15rem; color: #16a34a; font-weight: bold;">
              <strong>Total Credited to Wallet:</strong> ₹${totalEarned.toLocaleString()}
            </p>
          </div>
        `,
        icon: "success",
        confirmButtonText: "Return to Dashboard",
        confirmButtonColor: "#ff7a00",
      });

      navigate("/home");
    } catch (error) {
      console.error("Error ending chat:", error);
      Swal.fire({
        title: "Session Ended",
        text: `Talk-Time: ${formatTimer(elapsedSeconds)} | Earned: ₹${totalEarned}`,
        icon: "info",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/home");
      });
    }
  };

  return (
    <div className="pandit_chat_page">
      <div className="pandit_chat_card">
        {/* Astrotalk-style Consultation Header */}
        <div className="astrotalk_chat_header">
          <div className="devotee_profile_meta">
            <img src={userimg} alt="User Avatar" className="devotee_avatar" />
            <div>
              <h3 className="devotee_name">{user_name || "Devotee / Yajman"}</h3>
              <span className="live_chat_tag">● Live Consultation</span>
            </div>
          </div>

          {/* Talk-Time Live Timer */}
          <div className="talktime_timer_badge">
            <MdTimer className="timer_icon" />
            <div className="timer_info">
              <span className="timer_label">Talk Time</span>
              <span className="timer_clock">{formatTimer(elapsedSeconds)}</span>
            </div>
          </div>

          {/* Earnings Counter */}
          <div className="talktime_earnings_badge">
            <FaRupeeSign className="rupee_icon" />
            <div className="earnings_info">
              <span className="earnings_label">Rate: ₹{ratePerMinute}/min</span>
              <span className="earnings_value">Earned: ₹{currentEarnings}</span>
            </div>
          </div>

          {/* End Chat Button */}
          <button className="btn_end_consultation" onClick={handleEndChat} title="End chat session">
            <MdOutlineCallEnd /> End Session
          </button>
        </div>

        {/* Chat Messages Body */}
        <div className="pandit_chat_body">
          {loading ? (
            <div className="chat_loading_box">Loading chat history...</div>
          ) : messages.length === 0 ? (
            <div className="chat_empty_welcome">
              <p>🙏 Namaste Pandit Ji!</p>
              <span>The devotee is connected. Start the consultation by asking their birth details.</span>
            </div>
          ) : (
            messages.map((msg, index) => {
              const isPandit =
                msg.sender_id === pandit?.uuid ||
                msg.sender_id === pandit?.id ||
                msg.senderId === pandit?.uuid;

              return (
                <div key={msg.id || index} className={`chat_msg_row ${isPandit ? "sent_by_pandit" : "received_by_pandit"}`}>
                  <div className="chat_bubble">
                    <span className="sender_badge">{isPandit ? "You (Pandit Ji)" : user_name || "Devotee"}</span>
                    <p className="msg_content">{msg.message}</p>
                    <span className="msg_timestamp">
                      {msg.timestamp ? moment(msg.timestamp).format("hh:mm A") : moment().format("hh:mm A")}
                    </span>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Astrological Reply Chips */}
        <div className="quick_replies_bar">
          <span className="quick_reply_label">Quick Replies:</span>
          {quickReplies.map((reply, i) => (
            <button key={i} className="chip_btn" onClick={() => handleSendQuickReply(reply)}>
              {reply.slice(0, 24)}...
            </button>
          ))}
        </div>

        {/* Message Input Footer */}
        <div className="pandit_chat_footer">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your astrological consultation message..."
            autoFocus
          />
          <button className="btn_send_msg" onClick={handleSendMessage} disabled={!newMessage.trim()}>
            <IoSend />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Panditchat;
