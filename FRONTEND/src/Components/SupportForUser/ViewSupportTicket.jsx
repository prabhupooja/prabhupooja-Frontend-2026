import React, { useEffect, useState } from "react";
import "./ViewSupportTicket.css";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../Store/UserStore/userAuthStore";
import useUserStore from "../../Store/UserStore/userStore";
import CryptoJS from "crypto-js";
import { TailSpin } from "react-loader-spinner";
import {
  FaHeadset,
  FaPlusCircle,
  FaSearch,
  FaTicketAlt,
  FaCheckCircle,
  FaClock,
  FaSpinner,
  FaArrowRight,
  FaRegCalendarAlt,
} from "react-icons/fa";

const ViewSupportTicket = () => {
  const navigate = useNavigate();
  const { user1 } = useAuthStore();
  const { getAllTiketsByUserId } = useUserStore();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await getAllTiketsByUserId(user1?.id);

      if (response?.data && response?.data?.success) {
        setTickets(response.data.data || []);
      } else {
        setTickets([]);
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user1) {
      fetchTickets();
    }
  }, [user1]);

  const encryptId = (ID) => {
    const encrypted = CryptoJS.AES.encrypt(
      ID.toString(),
      "prabhupooja2024"
    ).toString();
    return encodeURIComponent(encrypted);
  };

  // Filtered tickets
  const filteredTickets = tickets.filter((t) => {
    const status = (t.status || "pending").toLowerCase().replace(/\s+/g, "");
    const matchesFilter =
      statusFilter === "all" ||
      status.includes(statusFilter.replace(/\s+/g, ""));
    const matchesSearch =
      (t.ticket_id && String(t.ticket_id).toLowerCase().includes(searchQuery.toLowerCase())) ||
      (t.issue_type && t.issue_type.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  // Stats calculation
  const totalCount = tickets.length;
  const pendingCount = tickets.filter((t) => (t.status || "").toLowerCase().includes("pending")).length;
  const inProgressCount = tickets.filter((t) => (t.status || "").toLowerCase().includes("progress")).length;
  const resolvedCount = tickets.filter((t) => (t.status || "").toLowerCase().includes("resolved")).length;

  if (loading) {
    return (
      <div className="ticket-view-loader-wrap">
        <TailSpin height="50" width="50" color="#ea580c" />
        <p className="loading_text">Loading your support tickets...</p>
      </div>
    );
  }

  return (
    <div className="ticket-view-container">
      <div className="ticket-view-inner">
        {/* Top Header Card */}
        <div className="ticket-page-header">
          <div className="tph-left">
            <h1 className="ticket-title">
              <FaHeadset className="tph-icon" /> Devotee Support Tickets
            </h1>
            <p className="tph-subtitle">
              Track resolution progress for all your submitted queries and requests
            </p>
          </div>
          <div className="tph-right">
            <Link to="/support/create" className="create-ticket-cta-btn">
              <FaPlusCircle /> Raise New Ticket
            </Link>
          </div>
        </div>

        {/* Support Stats Quick Grid */}
        <div className="support-stats-grid">
          <div className="s-stat-card total" onClick={() => setStatusFilter("all")}>
            <div className="stat-icon-circle"><FaTicketAlt /></div>
            <div className="stat-content">
              <span className="stat-val">{totalCount}</span>
              <span className="stat-label">Total Tickets</span>
            </div>
          </div>

          <div className="s-stat-card pending" onClick={() => setStatusFilter("pending")}>
            <div className="stat-icon-circle"><FaClock /></div>
            <div className="stat-content">
              <span className="stat-val">{pendingCount}</span>
              <span className="stat-label">Pending Review</span>
            </div>
          </div>

          <div className="s-stat-card progress" onClick={() => setStatusFilter("progress")}>
            <div className="stat-icon-circle"><FaSpinner /></div>
            <div className="stat-content">
              <span className="stat-val">{inProgressCount}</span>
              <span className="stat-label">In Progress</span>
            </div>
          </div>

          <div className="s-stat-card resolved" onClick={() => setStatusFilter("resolved")}>
            <div className="stat-icon-circle"><FaCheckCircle /></div>
            <div className="stat-content">
              <span className="stat-val">{resolvedCount}</span>
              <span className="stat-label">Resolved</span>
            </div>
          </div>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="ticket-toolbar">
          <div className="ticket-filter-tabs">
            <button
              className={`filter-chip ${statusFilter === "all" ? "active" : ""}`}
              onClick={() => setStatusFilter("all")}
            >
              All ({totalCount})
            </button>
            <button
              className={`filter-chip ${statusFilter === "pending" ? "active" : ""}`}
              onClick={() => setStatusFilter("pending")}
            >
              Pending ({pendingCount})
            </button>
            <button
              className={`filter-chip ${statusFilter === "progress" ? "active" : ""}`}
              onClick={() => setStatusFilter("progress")}
            >
              In Progress ({inProgressCount})
            </button>
            <button
              className={`filter-chip ${statusFilter === "resolved" ? "active" : ""}`}
              onClick={() => setStatusFilter("resolved")}
            >
              Resolved ({resolvedCount})
            </button>
          </div>

          <div className="ticket-search-box">
            <FaSearch className="search-svg" />
            <input
              type="text"
              placeholder="Search by Ticket ID or Topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Ticket List / Table */}
        {filteredTickets.length === 0 ? (
          <div className="ticket-empty-state-card">
            <div className="empty-state-icon-box">
              <FaTicketAlt size={48} color="#ea580c" />
            </div>
            <h3>No Support Tickets Found</h3>
            <p>
              {totalCount === 0
                ? "You haven't raised any support tickets yet. Need help with a pooja, prasad, or store order?"
                : "No tickets matching your current filter criteria."}
            </p>
            <Link to="/support/create" className="empty-cta-btn">
              <FaPlusCircle /> Create New Ticket 🙏
            </Link>
          </div>
        ) : (
          <div className="ticket-table-wrapper">
            <table className="ticket-table">
              <thead>
                <tr>
                  <th>Ticket ID</th>
                  <th>Issue Category</th>
                  <th>Status</th>
                  <th>Submitted Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.map((ticket, index) => {
                  const incryptedId = encryptId(ticket.id);
                  const statusClass = (ticket.status || "pending")
                    .toLowerCase()
                    .replace(/\s+/g, "-");

                  return (
                    <tr key={ticket.id || index}>
                      <td>
                        <span className="ticket-id-tag">#{ticket.ticket_id}</span>
                      </td>
                      <td>
                        <span className="issue-type-text">{ticket.issue_type}</span>
                      </td>
                      <td>
                        <span className={`status-chip-tag ${statusClass}`}>
                          {statusClass.includes("pending") && "⏳ Pending"}
                          {statusClass.includes("progress") && "⚙️ In Progress"}
                          {statusClass.includes("resolved") && "✅ Resolved"}
                          {!["pending", "in-progress", "resolved"].some((s) =>
                            statusClass.includes(s)
                          ) && ticket.status}
                        </span>
                      </td>
                      <td>
                        <span className="date-text">
                          <FaRegCalendarAlt style={{ marginRight: "6px", color: "#94a3b8" }} />
                          {ticket.submitted_date
                            ? new Date(ticket.submitted_date).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })
                            : "Recent"}
                        </span>
                      </td>
                      <td>
                        <Link to={`/support/view/${incryptedId}`} className="view-ticket-btn">
                          View Details <FaArrowRight size={11} />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewSupportTicket;

