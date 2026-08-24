import React, { useState, useEffect } from "react";
import "./assignedBookings.css";
import api from "../Axios/api";
import useAuthStore from "../Store/AuthStore/AuthStore";
import { FaPrayingHands, FaCalendarAlt, FaPhoneAlt, FaWhatsapp, FaSyncAlt } from "react-icons/fa";
import Swal from "sweetalert2";

export default function AssignedBookings() {
  const { pandit } = useAuthStore();
  const [bookings, setBookings] = useState([]);
  const [summary, setSummary] = useState({ total: 0, pending: 0, in_progress: 0, completed: 0 });
  const [loading, setLoading] = useState(true);

  const panditId = pandit?.id || localStorage.getItem("pandit_id") || 1;

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/pandit/assignedBookings/${panditId}`);
      if (res?.data?.success) {
        setBookings(res.data.data || []);
        setSummary(res.data.summary || { total: 0, pending: 0, in_progress: 0, completed: 0 });
      } else {
        setBookings(res?.data?.data || []);
        setSummary(res?.data?.summary || { total: 0, pending: 0, in_progress: 0, completed: 0 });
      }
    } catch (err) {
      console.warn("Could not load assigned bookings:", err?.message || err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (panditId) {
      loadData();
    }
  }, [panditId]);

  const updateStatus = async (bookingId, newStatus, serviceType) => {
    try {
      const res = await api.put(`/pandit/updateBookingStatus/${bookingId}`, {
        status: newStatus,
        service_type: serviceType,
      });

      if (res?.status === 200 || res?.data?.success) {
        Swal.fire({
          icon: "success",
          title: "Status Updated",
          text: `Booking marked as ${newStatus}`,
          timer: 1500,
          showConfirmButton: false,
        });
        loadData();
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: err?.response?.data?.message || "Failed to update booking status",
      });
    }
  };

  return (
    <div className="assigned-bookings-container">
      {/* Header */}
      <div className="assigned-header">
        <h2>
          <FaPrayingHands style={{ color: "#ff7a00" }} /> My Assigned Pujas & Services
        </h2>
        <button className="refresh-btn" onClick={loadData} disabled={loading}>
          <FaSyncAlt className={loading ? "spin" : ""} /> Refresh
        </button>
      </div>

      {/* KPI Counters */}
      <div className="summary-grid">
        <div className="kpi-card total">
          <div className="kpi-title">Total Bookings</div>
          <div className="kpi-value">{summary.total || bookings.length || 0}</div>
        </div>
        <div className="kpi-card pending">
          <div className="kpi-title">Pending / Assigned</div>
          <div className="kpi-value">{summary.pending || 0}</div>
        </div>
        <div className="kpi-card inprogress">
          <div className="kpi-title">In-Progress</div>
          <div className="kpi-value">{summary.in_progress || 0}</div>
        </div>
        <div className="kpi-card completed">
          <div className="kpi-title">Completed</div>
          <div className="kpi-value">{summary.completed || 0}</div>
        </div>
      </div>

      {/* Booking List */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "50px", color: "#64748b" }}>
          Loading assigned pujas...
        </div>
      ) : bookings.length === 0 ? (
        <div className="empty-state-box">
          <h3>No Pujas Assigned Yet</h3>
          <p>When the Admin assigns a Pooja, Rudra Abhishek, or Service to you, it will appear here.</p>
        </div>
      ) : (
        <div className="booking-cards-list">
          {bookings.map((item) => {
            const rawStatus = item.status || item.booking_status || "Pending";
            const statusClass = rawStatus.toLowerCase().replace(/\s+/g, "-");
            const whatsappNum = item.whatsapp_number || item.user_mobile || item.mobile;

            return (
              <div key={item.booking_id || item.id} className="assigned-card">
                <div className="card-main-info">
                  <div className="service-title-row">
                    <h4 className="service-name">
                      {item.service_name || item.puja_name || "Vedic Pooja Service"}
                    </h4>
                    <span className="package-badge">
                      {item.package_name || "Standard Sankalp"}
                    </span>
                  </div>

                  <div className="meta-details-grid">
                    <div className="meta-item">
                      <strong>Devotee:</strong> {item.devotee_name || item.user_name || "Yajman"}
                    </div>
                    {item.gotra && (
                      <div className="meta-item">
                        <strong>Gotra:</strong> {item.gotra}
                      </div>
                    )}
                    <div className="meta-item">
                      <FaCalendarAlt style={{ color: "#94a3b8" }} />
                      <strong>Date/Slot:</strong>{" "}
                      {item.booking_date?.split("T")[0] || item.bookingdate?.split("T")[0] || "Date TBD"}{" "}
                      • {item.time_slot || "Morning"}
                    </div>
                    {whatsappNum && (
                      <div className="meta-item">
                        <FaWhatsapp style={{ color: "#16a34a" }} />
                        <a
                          href={`https://wa.me/91${whatsappNum.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noreferrer noopener"
                          style={{ color: "#16a34a", fontWeight: "600", textDecoration: "none" }}
                        >
                          {whatsappNum}
                        </a>
                      </div>
                    )}
                  </div>

                  {item.sankalp_wish && (
                    <div className="sankalp-box">
                      <strong>Sankalp Wish (मनोकामना):</strong> "{item.sankalp_wish}"
                    </div>
                  )}

                  {item.shipping_address && (
                    <div style={{ marginTop: "6px", fontSize: "0.82rem", color: "#64748b" }}>
                      <strong>Prasad Delivery:</strong> {item.shipping_address}, {item.city} {item.pincode}
                    </div>
                  )}
                </div>

                {/* Actions & Status */}
                <div className="card-actions-col">
                  <span className={`status-pill ${statusClass}`}>{rawStatus}</span>

                  <div className="action-buttons-group">
                    {rawStatus !== "Completed" && (
                      <>
                        {rawStatus !== "In-Progress" && (
                          <button
                            className="btn-start-puja"
                            onClick={() =>
                              updateStatus(
                                item.booking_id || item.id,
                                "In-Progress",
                                item.service_type || "pooja"
                              )
                            }
                          >
                            Start Puja
                          </button>
                        )}
                        <button
                          className="btn-complete-puja"
                          onClick={() =>
                            updateStatus(
                              item.booking_id || item.id,
                              "Completed",
                              item.service_type || "pooja"
                            )
                          }
                        >
                          Mark Complete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
