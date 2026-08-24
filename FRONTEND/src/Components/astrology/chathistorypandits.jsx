import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/chathistorypandit.css";
import useAuthStore from "../../Store/UserStore/userAuthStore";
import api from "../Axios/api";
import moment from "moment";

function Chathistorypandits() {
  const navigate = useNavigate();
  const { user1 } = useAuthStore();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user1?.id) {
      const fetchRequests = async () => {
        try {
          setLoading(true);
          let type = "chat";
          const response = await api.get(
            `/request/showforuser/${user1?.id}/${type}`
          );
          setRequests(response.data.data);
        } catch (err) {
          // console.log("Failed to load requests", err);
        } finally {
          setLoading(false);
        }
      };

      fetchRequests();
    }
  }, [user1?.id]);

  const handleNavigation = (data, name, date) => {
    navigate("/chatshistoryuser", {
      state: { requestId: data, name: name, date: date },
    });
  };

  return (
    <>
      <div className="chathistory_section">
        <div className="container">
          {loading ? (
            <div className="loader-wrapper">
              <div className="spinner"></div>
              <p>Loading chat history...</p>
            </div>
          ) : requests.length === 0 ? (
            <div className="no-history-wrapper">
              <img
                src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
                alt="No chats"
                className="no-history-icon"
              />
              <p>No chat history available</p>
            </div>
          ) : (
            <>
              <h1 className="title">Users</h1>
              <div className="chatContainer">
                {requests.map((user) => (
                  <button
                    key={user.id}
                    className="userCard"
                    onClick={() =>
                      handleNavigation(
                        user.request_id,
                        user.name,
                        user.updated_at
                      )
                    }
                  >
                    <p className="userName">
                      {moment(user.updated_at).format("DD/MM/YYYY hh:mm A")}
                    </p>
                    <p className="userName">
                      {user.name} {user.lastname}
                    </p>
                    <p className="userName">{user.experience} Years</p>
                    <p className="userName">{user.price} per min</p>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Chathistorypandits;
