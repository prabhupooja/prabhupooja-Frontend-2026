import React, { useState, useEffect } from "react";
import "./videocallrequest.css";
import { IoCloseSharp } from "react-icons/io5";
import { FaVideo } from "react-icons/fa6";
import { useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "../Store/AuthStore/AuthStore";
import api from "../Axios/api";
import { TailSpin } from "react-loader-spinner";
import Swal from "sweetalert2";

function Videocallrequest() {
  const { pandit, panditGet } = useAuthStore();
  const location = useLocation();
  const { type } = location.state || { type: "video" };
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let interval;
    const initAndFetch = async () => {
      try {
        let pId = pandit?.id;
        if (!pId) {
          const res = await panditGet();
          pId = res?.data?.id || res?.id || localStorage.getItem("pandit_id") || 1;
        }

        const fetchRequests = async (targetId) => {
          try {
            const response = await api.get(`/request/showforpandit/${targetId || pId}/${type || "video"}`);
            setRequests(response?.data?.data || []);
          } catch (err) {
            console.warn("Failed to load video requests:", err?.message || err);
          } finally {
            setLoading(false);
          }
        };

        await fetchRequests(pId);
        interval = setInterval(() => fetchRequests(pId), 8000);
      } catch (err) {
        console.error("Error in Videocallrequest init:", err);
        setLoading(false);
      }
    };

    initAndFetch();

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [pandit?.id, type]);

  const handleUpdateStatus = async (
    requestId,
    status,
    requestType,
    userId,
    userName,
    userMobile,
    astroId
  ) => {
    try {
      const response = await api.put(`/request/${requestId}`, { status });
      if (response.status === 200 || response.data?.success) {
        setRequests((prevRequests) => {
          const updatedRequests = Array.isArray(prevRequests) ? prevRequests : [];
          return updatedRequests.map((request) =>
            request.request_id === requestId || request.id === requestId ? { ...request, status } : request
          );
        });

        if (status === "accepted") {
          Swal.fire({
            icon: "success",
            title: "Video Call Accepted!",
            text: "Connecting to secure video consultation room...",
            timer: 1500,
            showConfirmButton: false,
          });

          navigate("/panditvideocall", {
            state: {
              requestId,
              userId,
              user_name: userName,
              user_mobile: userMobile,
              astroId: astroId || pandit?.id,
            },
          });
        } else {
          Swal.fire("Declined", "Request marked as declined", "info");
        }
      } else {
        Swal.fire("Error", response.data?.message || "Failed to update status", "error");
      }
    } catch (err) {
      Swal.fire("Error", "Failed to update request status", "error");
      console.error("Failed to update request status:", err);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minHeight: "50vh", marginLeft: "270px" }}>
        <TailSpin height="50" width="50" color="#ff7a00" />
        <p className="loading_text" style={{ marginTop: "15px", color: "#64748b", fontWeight: "600" }}>Loading video call requests...</p>
      </div>
    );
  }

  return (
    <div className="userlist-container" style={{ marginLeft: "270px", padding: "25px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: "800", color: "#0f172a", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
          <FaVideo style={{ color: "#ff7a00" }} /> Devotee Video Call Requests
        </h1>
        <span style={{ background: "#fff7ed", color: "#c2410c", padding: "6px 14px", borderRadius: "20px", fontSize: "0.82rem", fontWeight: "700" }}>
          Total Requests: {requests.length}
        </span>
      </div>

      <div className="table-container" style={{ background: "white", borderRadius: "12px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)", overflowX: "auto" }}>
        <table className="user-table" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8fafc", textAlign: "left" }}>
              <th style={{ padding: "14px 16px", color: "#475569" }}>Name</th>
              <th style={{ padding: "14px 16px", color: "#475569" }}>Status</th>
              <th style={{ padding: "14px 16px", color: "#475569" }}>Gender</th>
              <th style={{ padding: "14px 16px", color: "#475569" }}>Date of Birth</th>
              <th style={{ padding: "14px 16px", color: "#475569" }}>Time & Place</th>
              <th style={{ padding: "14px 16px", color: "#475569" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.length > 0 ? (
              requests.map((user, index) => (
                <tr key={user.request_id || user.id || index} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "14px 16px", fontWeight: "700", color: "#0f172a" }}>{user.user_name || user.name || "Yajman"}</td>
                  <td style={{ padding: "14px 16px" }}>
                    <span className={`status-pill status-${(user.status || "pending").toLowerCase()}`}>
                      {user.status || "pending"}
                    </span>
                  </td>
                  <td style={{ padding: "14px 16px" }}>{user.gender || "—"}</td>
                  <td style={{ padding: "14px 16px" }}>{user.DOB || "Live Request"}</td>
                  <td style={{ padding: "14px 16px" }}>{user.TOB || ""} {user.birth_place ? `• ${user.birth_place}` : ""}</td>
                  <td style={{ padding: "14px 16px" }} className="action-buttons">
                    <button
                      className="accept-btn"
                      style={{
                        background: "#10b981",
                        color: "white",
                        border: "none",
                        padding: "8px 14px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        marginRight: "8px",
                        fontWeight: "700",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                      onClick={() =>
                        handleUpdateStatus(
                          user.request_id || user.id,
                          "accepted",
                          "video",
                          user.user_id,
                          user.user_name || user.name,
                          user.user_mobile || user.mobile,
                          user.pandit_astrologer_id
                        )
                      }
                      disabled={user.status !== "pending"}
                    >
                      <FaVideo /> Accept Video Call
                    </button>
                    <button
                      className="decline-btn"
                      style={{
                        background: "#ef4444",
                        color: "white",
                        border: "none",
                        padding: "8px 12px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: "600",
                      }}
                      onClick={() => handleUpdateStatus(user.request_id || user.id, "declined")}
                      disabled={user.status !== "pending"}
                    >
                      <IoCloseSharp />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "40px", color: "#94a3b8", fontSize: "0.95rem" }}>
                  No pending video call requests at the moment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Videocallrequest;
