import React, { useState, useEffect } from "react";
import "./chatrequest.css";
import { IoCloseSharp } from "react-icons/io5";
import { FaCheck } from "react-icons/fa6";
import useAuthStore from "../Store/AuthStore/AuthStore";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../Axios/api";
import { TailSpin } from "react-loader-spinner";
import Swal from "sweetalert2";

function Chatrequest() {
  const { pandit } = useAuthStore();
  const location = useLocation();
  const { type } = location.state || "";
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [activeRequest, setActiveRequest] = useState(null);

  // const handleChatNavigate = () => {
  //   navigate("/panditchat");
  // };

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await api.get(
          `/request/showforpandit/${pandit.id}/${type}`
        );
        setRequests(response.data.data);
      } catch (err) {
        console.log("Failed to load requests");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
    const interval = setInterval(fetchRequests, 10000);

    return () => clearInterval(interval);
  }, [pandit?.id]);

  const handleUpdateStatus = async (
    requestId,
    status,
    requestType,
    userId,
    user_name,
    uuid
  ) => {
    setActiveRequest(requestId);
    try {
      const response = await api.put(`/request/${requestId}`, { status });
      if (response.status === 200) {
        setRequests((prevRequests) => {
          const updatedRequests = Array.isArray(prevRequests)
            ? prevRequests
            : [];
          return updatedRequests.map((request) =>
            request.id === requestId ? { ...request, status } : request
          );
        });

        Swal.fire("Success", "Request status updated successfully");

        if (status === "accepted") {
          if (requestType === "chat") {
            navigate("/panditchat", {
              state: {
                requestId: requestId,
                userId: userId,
                uuid: uuid,
                user_name: user_name,
              },
            });
          }
        }
      } else {
        Swal.fire(
          "Error",
          response.data.message || "Failed to update request status"
        );
      }
    } catch (err) {
      Swal.fire("Error", "Failed to update request status");
      console.error("Failed to update request status:", err);
    }
  };

  if (loading) {
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

  console.log(requests, "requests");
  return (
    <>
      <div className="userlist-container">
        <h1>User Chat Requests</h1>
        <div className="table-container">
          <table className="user-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Gender</th>
                <th>Date of Birth</th>
                <th>Date & Time</th>
                <th>Place of Birth</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((user, index) => (
                <tr key={index}>
                  <td>{user.user_name}</td>
                  <td>{user.status}</td>
                  <td>{user.gender}</td>
                  <td>{user.DOB}</td>
                  <td>{user.TOB}</td>
                  <td>{user.birth_place}</td>
                  <td className="action-buttons">
                    <button
                     className={`accept-btn ${activeRequest === user.request_id ? "active" : ""}`}
                      onClick={() =>
                        handleUpdateStatus(
                          user.request_id,
                          "accepted",
                          user.request_type,
                          user.user_id,
                          user.user_name,
                          user.user_uuid
                        )
                      }
                      disabled={user.status !== "pending"}
                    >
                      <FaCheck />
                    </button>
                    <button
                    className={`decline-btn ${activeRequest === user.request_id ? "active" : ""}`}
                      onClick={() =>
                        handleUpdateStatus(user.request_id, "declined")
                      }
                      disabled={user.status !== "pending"}
                    >
                      <IoCloseSharp />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Chatrequest;
