import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import api from "../Axios/api";
import useAuthStore from "../../Store/UserStore/userAuthStore";
import { IoSend } from "react-icons/io5";
import userimg from "../Assets/profile-pic.png";
import { MdOutlineCallEnd } from "react-icons/md";
import Swal from "sweetalert2";
import moment from 'moment';
import { socket } from "../../utils/socket";

const ChatScreen = () => {
  const { astrologerId, price, requestId } = useParams();
  const location = useLocation();
  const { uuid, pandit } = location.state || {};
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [balance, setBalance] = useState(0);
  const [peerProfile, setPeerProfile] = useState(pandit || null);
  const [peerUuid, setPeerUuid] = useState(uuid || null);
  const [receiverId, setReceiverId] = useState(astrologerId || null);
  const [loading, setLoading] = useState(true);
  const [chatReady, setChatReady] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [mode, setMode] = useState(null);
  const [rating, setRating] = useState(0);
  const startTimeRef = useRef(null);
  const { user1 } = useAuthStore();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    handleModeGet();
  }, [user1?.id]);

  useEffect(() => {
    if (mode === 0) {
      handleEndChat();

    }
  }, [mode]);


  const handleModeGet = async () => {
    const response = await api.get(`/chats/userMode/${user1?.id}`);
    const hello = response?.data?.data?.chat_mode
    setMode(hello);
  }

  useEffect(() => {
    const initializeChat = async () => {
      const currentUserId = user1?.uuid || user1?.id;
      const resolvedReceiverId = peerUuid || uuid || receiverId || astrologerId;

      if (!currentUserId || !resolvedReceiverId) {
        setChatReady(false);
        setLoading(false);
        return;
      }

      setChatReady(true);
      setLoading(true);

      if (!peerProfile && astrologerId) {
        try {
          const response = await api.get(`/pandit/id/${astrologerId}`);
          if (response?.data?.success) {
            const astrologerData = response.data.data;
            setPeerProfile(astrologerData);
            setPeerUuid(astrologerData?.uuid || null);
            setReceiverId(astrologerData?.uuid || astrologerData?.id || astrologerId);
          }
        } catch (error) {
          console.error("Failed to resolve astrologer profile:", error);
        }
      }

      // Fetch initial messages only once
      try {
        const response = await api.get(`/chats/messages/${currentUserId}/${resolvedReceiverId}`);
        const fetchedMessages = Array.isArray(response?.data?.messages) ? response.data.messages : [];
        setMessages(fetchedMessages);
      } catch (error) {
        console.error("Failed to fetch initial messages:", error);
      }

      await fetchBalance();
      startTimeRef.current = Date.now();

      if (!socket.connected) {
        socket.connect();
      }
      socket.emit("join_chat", {
        requestId,
        userId: currentUserId,
        astrologerId: resolvedReceiverId,
      });

      const handleIncomingMessage = (payload) => {
        if (String(payload?.requestId || payload?.request_id) !== String(requestId)) {
          return;
        }

        const incomingTimestamp = payload?.createdAt || payload?.timestamp || new Date().toISOString();
        const incomingId = payload?.id || `${payload?.senderId || payload?.sender_id}-${payload?.receiverId || payload?.receiver_id}-${incomingTimestamp}`;
        const normalizedMessage = {
          id: incomingId,
          sender_id: payload?.senderId || payload?.sender_id,
          receiver_id: payload?.receiverId || payload?.receiver_id,
          message: payload?.message,
          timestamp: incomingTimestamp,
        };

        setMessages((prev) => {
          const exists = prev.some((msg) => String(msg.id) === String(incomingId) || (msg.message === normalizedMessage.message && msg.sender_id === normalizedMessage.sender_id && Math.abs(new Date(msg.timestamp) - new Date(normalizedMessage.timestamp)) < 1000));
          return exists ? prev : [...prev, normalizedMessage].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        });
      };

      socket.on("receive_chat_message", handleIncomingMessage);
      socket.on("chat_error", (error) => {
        console.error("Socket chat error:", error);
      });

      // Fallback polling when socket is disconnected
      let pollInterval;
      const startPolling = () => {
        pollInterval = setInterval(() => {
          if (!socket.connected) {
            console.log("Polling for messages...");
            // Re-fetch all messages from history
            const response = api.get(`/chats/chathistory/${requestId}`);
            response.then((res) => {
              console.log("Polled messages:", res?.data?.data);
              let fetchedMessages = [];
              if (Array.isArray(res?.data?.data)) {
                fetchedMessages = res.data.data;
              } else if (Array.isArray(res?.data?.messages)) {
                fetchedMessages = res.data.messages;
              }
              setMessages(fetchedMessages);
            }).catch((err) => {
              console.error("Polling error:", err);
            });
          }
        }, 3000); // Poll every 3 seconds only if socket is down
      };

      if (!socket.connected) {
        startPolling();
      }

      const handleSocketConnect = () => {
        if (pollInterval) clearInterval(pollInterval);
        console.log("Socket connected, stopping polling");
      };

      const handleSocketDisconnect = () => {
        startPolling();
        console.log("Socket disconnected, starting polling fallback");
      };

      socket.on("connect", handleSocketConnect);
      socket.on("disconnect", handleSocketDisconnect);

      return () => {
        if (pollInterval) clearInterval(pollInterval);
        socket.emit("leave_chat", {
          requestId,
          userId: currentUserId,
          astrologerId: resolvedReceiverId,
        });
        socket.off("receive_chat_message", handleIncomingMessage);
        socket.off("chat_error");
        socket.off("connect", handleSocketConnect);
        socket.off("disconnect", handleSocketDisconnect);
      };
    };

    initializeChat();

    return () => {
      socket.disconnect();
    };
  }, [user1?.id, user1?.uuid, astrologerId, requestId, receiverId, peerProfile, peerUuid, uuid]);

  const fetchMessages = async (userId = user1?.uuid || user1?.id, targetReceiverId = peerUuid || uuid || receiverId || astrologerId) => {
    try {
      const resolvedUserId = userId;
      const resolvedReceiverId = targetReceiverId;
      if (!resolvedUserId || !resolvedReceiverId) {
        setLoading(false);
        return;
      }

      // Use chatHistory endpoint instead - it's designed for this
      const response = await api.get(`/chats/chathistory/${requestId}`);
      console.log("Message history response:", response?.data); // Debug log
      
      let fetchedMessages = [];
      if (Array.isArray(response?.data?.data)) {
        fetchedMessages = response.data.data;
      } else if (Array.isArray(response?.data?.messages)) {
        fetchedMessages = response.data.messages;
      } else if (Array.isArray(response?.data)) {
        fetchedMessages = response.data;
      }
      
      console.log("Fetched messages from history:", fetchedMessages); // Debug log
      setMessages(fetchedMessages);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      setLoading(false);
    }
  };

  // Load messages on initial mount
  useEffect(() => {
    const userId = user1?.uuid || user1?.id;
    const targetReceiverId = peerUuid || uuid || astrologerId;
    if (userId && targetReceiverId) {
      fetchMessages(userId, targetReceiverId);
    }
  }, [user1?.id, user1?.uuid, peerUuid, uuid, astrologerId]);

  const fetchBalance = async () => {
    try {
      const response = await api.get(`/users/balance/${user1?.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBalance(response.data.balance);
      // console.log("Fetched balance:", response.data.balance);
    } catch (error) {
      // console.error("Failed to fetch balance:", error);
    }
  };

  const handleCancle = async () => {
    setShowFeedback(false)
    navigate('/');

  }

  const handleEndChat = async () => {
    try {
      const resolvedPeerUuid = peerUuid || uuid || peerProfile?.uuid;
      await api.post("/chats/chatEnd", {
        user_uuid: user1?.uuid,
        pandit_uuid: resolvedPeerUuid,
      });
      handleModeGet();

      await Swal.fire({
        title: "Chat Ended!",
        text: "Chat Ended successfully",
        icon: "info",
        confirmButtonText: "OK",
      });

      // Step 3: Calculate Duration and Cost
      const endTime = Date.now();
      const durationInMinutes = Math.ceil(
        (endTime - startTimeRef.current) / 60000
      );
      const totalCost = durationInMinutes * parseFloat(price);

      // console.log("Total cost:", totalCost, "Duration:", durationInMinutes);

      // Step 4: Deduct Balance
      const numericBalance = parseFloat(user1?.balance);
      if (totalCost <= numericBalance) {
        const deductResponse = await api.post("/users/deductBalance", {
          userId: user1?.id,
          astrologerId,
          minutes: durationInMinutes,
        });

        if (deductResponse.data.success) {
          setBalance(deductResponse.data.newBalance);
          setShowFeedback(true);
        } else {
          await Swal.fire({
            title: "Failed!",
            text: "Failed to deduct balance: " + deductResponse.data.message,
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      } else {
        await Swal.fire({
          title: "Insufficient Balance!",
          text: "Kripya apna wallet recharge karein.",
          icon: "warning",
          confirmButtonText: "Recharge Now",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      await Swal.fire({
        title: "Error!",
        text: "Error occurred while ending chat or deducting balance.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };


  const handleSendMessage = async () => {
    const messageText = newMessage.trim();
    if (!messageText) {
      return;
    }

    const currentUserId = user1?.uuid || user1?.id;
    const resolvedReceiverId = peerUuid || uuid || receiverId || astrologerId;

    const tempMessage = {
      id: `local-${Date.now()}`,
      sender_id: currentUserId,
      receiver_id: resolvedReceiverId,
      message: messageText,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempMessage]);
    setNewMessage("");

    try {
      await api.post("/chats/messages/create", {
        senderId: currentUserId,
        receiverId: resolvedReceiverId,
        message: messageText,
        request_id: requestId,
      });
    } catch (error) {
      setMessages((prev) => prev.filter((msg) => msg.id !== tempMessage.id));
      setNewMessage(messageText);
      console.error("Failed to send message:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFeedbackSubmit = async () => {
    try {
      await api.post(`/panditComment/create/${pandit?.id}`, {
        name: user1?.name,
        email: user1?.email,
        rating: rating,
        comment: feedback,
      });

      await Swal.fire({
        title: "Feedback Submitted!",
        text: "Feedback submitted successfully",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        setShowFeedback(false);
        navigate('/')
      });
    } catch (error) {
      console.error("Error submitting feedback:", error);
      await Swal.fire({
        title: "Submission Failed!",
        text: "Something went wrong on the server.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };


  const handleStarClick = (star) => {
    setRating(star);
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`star ${i <= rating ? "filled" : ""}`}
          onClick={() => handleStarClick(i)}
        >
          &#9733;
        </span>
      );
    }
    return stars;
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
    <>
      <div className="chat-container">
        <div className="chat-header">
          <img src={peerProfile?.profileImage ? peerProfile.profileImage : userimg} alt="User" className="user-image" />
          <span className="user-name-chat">{peerProfile?.name || pandit?.name || "Astrologer"}</span>

          <button className="end_btn" onClick={handleEndChat}>
            <MdOutlineCallEnd className="end-btn-icon" /> End
          </button>
        </div>

        <div className="chat-body">
          {loading ? (
            <div className="loader">Loading...</div>
          ) : (

            <div className="user-message">
              {Object.keys(groupedMessages).map((date, index) => (
                <div key={index} className="message-container">
                  <p style={{ width: "15%", textAlign: "center", padding: "5px 2px", borderRadius: "50px", fontSize: "15px", color: "white", display: "block", background: "gray" }}>
                    {date === today ? "Today" : date === yesterday ? "Yesterday" : date}
                  </p>

                  {groupedMessages[date].map((msg) => (
                    <div
                      key={msg.id}
                      className={`message-bubble ${String(user1?.uuid || user1?.id) === String(msg.sender_id || msg.senderId) ? "sent" : "received"}`}
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
            className="text-input"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            onKeyDown={handleKeyPress}
          />
          <button className="send-button" onClick={handleSendMessage}>
            <IoSend className="send-btn-icon" />
          </button>
        </div>
      </div>
      {showFeedback && (
        <div className="feedback-popup">
          <div className="feedback-popup-content">
            <h2>Feedback</h2>

            <input
              type="text"
              placeholder="Your Name"
              value={user1?.name}

            />

            <input
              type="email"
              placeholder="Your Email"
              value={user1?.email}

            />

            <div className="star-rating">
              <label>Rating:</label>
              <div className="stars">{renderStars()}</div>
            </div>

            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Please provide your feedback"
              rows="4"
            ></textarea>

            <button
              className="submit-feedback-btn feedbackbtn"
              onClick={handleFeedbackSubmit}
            >
              Submit
            </button>
            <button
              className="cancel-feedback-btn feedbackbtn"
              onClick={() => handleCancle()}
            >
              Skip
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatScreen;
