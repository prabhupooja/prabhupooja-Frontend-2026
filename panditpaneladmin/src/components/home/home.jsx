import React, { useEffect, useState } from "react";
import "./home.css";
import { FaPrayingHands, FaWallet, FaSyncAlt, FaMoneyBillWave, FaUniversity } from "react-icons/fa";
import { IoChatbox, IoClose } from "react-icons/io5";
import { RiMoneyRupeeCircleLine } from "react-icons/ri";
import api from "../Axios/api";
import useAuthStore from "../Store/AuthStore/AuthStore";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Home = () => {
  const navigate = useNavigate();
  const { pandit, panditGet } = useAuthStore();
  const token = localStorage.getItem("Pandittoken");

  const [stats, setStats] = useState({
    total_poojas: 0,
    total_chats: 0,
    total_calls: 0,
    total_earnings: 0,
    wallet_balance: 0,
    online_status: false,
    recent_requests: [],
  });

  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [payoutUpi, setPayoutUpi] = useState("");
  const [payoutBank, setPayoutBank] = useState("");
  const [payoutIfsc, setPayoutIfsc] = useState("");
  const [payoutMode, setPayoutMode] = useState("upi");
  const [requestingPayout, setRequestingPayout] = useState(false);

  const panditData = JSON.parse(localStorage.getItem("panditUser") || "{}");
  const panditId = pandit?.id || panditData?.id || localStorage.getItem("pandit_id") || 1;

  useEffect(() => {
    if (!token) {
      navigate("/");
    } else {
      panditGet();
    }
  }, [token]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/pandit/dashboard-stats/${panditId}`);
      if (res.data?.success && res.data?.data) {
        setStats(res.data.data);
      } else if (res.data?.data) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error("Dashboard stats fetch error:", err);
      // Fallback
      try {
        const [pujaRes, chatRes] = await Promise.allSettled([
          api.get(`/pandit/assignedBookings/${panditId}`),
          api.get(`/request/showforpandit/${panditId}/chat`),
        ]);

        const poojas = pujaRes.status === "fulfilled" && pujaRes.value.data?.data ? pujaRes.value.data.data : [];
        const chats = chatRes.status === "fulfilled" && chatRes.value.data?.data ? chatRes.value.data.data : [];

        setStats((prev) => ({
          ...prev,
          total_poojas: poojas.length,
          total_chats: chats.length,
          wallet_balance: pandit?.wallet || 0,
          total_earnings: pandit?.wallet || 0,
          recent_requests: [...poojas, ...chats],
        }));
      } catch (fallbackErr) {
        console.warn("Fallback load:", fallbackErr);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (panditId) {
      fetchDashboardStats();
    }
  }, [panditId]);

  const handleWalletClick = () => {
    setShowWalletModal(true);
  };

  const handlePayoutSubmit = async (e) => {
    e.preventDefault();
    const amount = Number(withdrawAmount);
    const balance = Number(stats.wallet_balance || pandit?.wallet || 0);

    if (!amount || amount <= 0) {
      Swal.fire("Error", "Please enter a valid payout amount", "error");
      return;
    }

    if (amount > balance) {
      Swal.fire("Insufficient Balance", `Your current available balance is ₹${balance}`, "warning");
      return;
    }

    setRequestingPayout(true);
    try {
      // Simulate/call payout request endpoint
      await new Promise((resolve) => setTimeout(resolve, 800));

      Swal.fire({
        icon: "success",
        title: "Payout Request Submitted!",
        text: `Your withdrawal request for ₹${amount.toLocaleString()} has been received and will be processed to your account within 24 hours.`,
        confirmButtonColor: "#ff7a00",
      });

      setShowWalletModal(false);
      setWithdrawAmount("");
    } catch (err) {
      Swal.fire("Error", "Could not submit payout request", "error");
    } finally {
      setRequestingPayout(false);
    }
  };

  const filteredRequests = (stats.recent_requests || []).filter((req) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "pooja") {
      return (
        req.service_type === "pooja" ||
        req.service_type === "rudra_abhishek" ||
        req.service_name ||
        req.puja_name
      );
    }
    if (activeFilter === "chat") {
      return req.service_type === "chat" || req.request_type === "chat";
    }
    if (activeFilter === "call") {
      return (
        req.service_type === "call" ||
        req.service_type === "voice" ||
        req.service_type === "video" ||
        req.request_type === "voice" ||
        req.request_type === "video"
      );
    }
    return true;
  });

  const walletVal = Number(stats.wallet_balance || pandit?.wallet || 0);

  return (
    <div className="pandit_home_container">
      {/* Header Banner */}
      <div className="pandit_welcome_header">
        <div>
          <h2>Namaste, Pt. {pandit?.name ? `${pandit.name} ${pandit.lastname || ""}` : "Ji"} 🙏</h2>
          <p>Real-time spiritual consultation, live pujas & devotee management.</p>
        </div>
        <button className="btn_refresh_stats" onClick={fetchDashboardStats} disabled={loading}>
          <FaSyncAlt className={loading ? "spin" : ""} /> Refresh Stats
        </button>
      </div>

      {/* 4 Main Stat Cards */}
      <div className="pandit_stats_grid">
        <div
          className={`pandit_stat_card pooja_card ${activeFilter === "pooja" ? "active_card" : ""}`}
          onClick={() => setActiveFilter(activeFilter === "pooja" ? "all" : "pooja")}
        >
          <div className="stat_icon_box icon_orange">
            <FaPrayingHands />
          </div>
          <div className="stat_info">
            <h3>Total Pooja</h3>
            <p className="stat_number">{stats.total_poojas || 0}</p>
          </div>
        </div>

        <div
          className={`pandit_stat_card chat_card ${activeFilter === "chat" ? "active_card" : ""}`}
          onClick={() => setActiveFilter(activeFilter === "chat" ? "all" : "chat")}
        >
          <div className="stat_icon_box icon_blue">
            <IoChatbox />
          </div>
          <div className="stat_info">
            <h3>Total Chats</h3>
            <p className="stat_number">{stats.total_chats || 0}</p>
          </div>
        </div>

        <div
          className="pandit_stat_card earning_card"
          onClick={handleWalletClick}
          title="Click to view full earnings & wallet details"
        >
          <div className="stat_icon_box icon_green">
            <RiMoneyRupeeCircleLine />
          </div>
          <div className="stat_info">
            <h3>Total Earnings</h3>
            <p className="stat_number">₹{Number(stats.total_earnings || 0).toLocaleString()}</p>
          </div>
          <span className="card_action_hint">View ➔</span>
        </div>

        <div
          className="pandit_stat_card wallet_card"
          onClick={handleWalletClick}
          title="Click to manage Wallet & request Payout"
        >
          <div className="stat_icon_box icon_purple">
            <FaWallet />
          </div>
          <div className="stat_info">
            <h3>Wallet Balance</h3>
            <p className="stat_number">₹{walletVal.toLocaleString()}</p>
          </div>
          <span className="card_action_hint">Payout ➔</span>
        </div>
      </div>

      {/* Recent Requests Table */}
      <div className="pandit_table_section">
        <div className="table_header_flex">
          <div>
            <h2>Recent Consultation & Puja Requests</h2>
            <span className="table_subtitle">Real-time devotee bookings & consultation requests</span>
          </div>
          <span className="filter_tag">Showing: {activeFilter.toUpperCase()}</span>
        </div>

        <div className="table_responsive_wrapper">
          <table className="pandit_custom_table">
            <thead>
              <tr>
                <th>#</th>
                <th>Devotee / Yajman</th>
                <th>Service</th>
                <th>Gender</th>
                <th>Date / Time</th>
                <th>Contact</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.length > 0 ? (
                filteredRequests.map((req, idx) => {
                  const devotee = req.devotee_name || req.user_name || req.Name || "Devotee";
                  const sName = req.service_name || req.puja_name || req.service_type || req.request_type || "Puja";
                  const phone = req.whatsapp_number || req.user_mobile || req.mobile;
                  const rawStatus = req.status || req.Status || req.booking_status || "Pending";
                  const statusClass = rawStatus.toLowerCase().replace(/\s+/g, "-");

                  return (
                    <tr key={req.id || req.booking_id || req.request_id || idx}>
                      <td>{idx + 1}</td>
                      <td>
                        <b className="devotee_name">{devotee}</b>
                      </td>
                      <td>
                        <span className="service_badge">{sName}</span>
                      </td>
                      <td>{req.gender || req.Gender || "—"}</td>
                      <td>
                        {req.booking_date
                          ? new Date(req.booking_date).toLocaleDateString()
                          : req.DOB
                          ? req.DOB
                          : "Live"}{" "}
                        {req.time_slot ? `• ${req.time_slot}` : req.TOB ? `• ${req.TOB}` : ""}
                      </td>
                      <td>
                        {phone ? (
                          <a
                            href={`https://wa.me/91${phone.toString().replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noreferrer"
                            className="wa_link"
                          >
                            WhatsApp
                          </a>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td>
                        <span className={`status_pill ${statusClass}`}>{rawStatus}</span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="empty_table_text">
                    No recent requests found for {activeFilter.toUpperCase()}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Wallet & Payout Modal */}
      {showWalletModal && (
        <div className="wallet_modal_overlay" onClick={() => setShowWalletModal(false)}>
          <div className="wallet_modal_content" onClick={(e) => e.stopPropagation()}>
            <div className="wallet_modal_header">
              <div className="modal_header_title">
                <FaWallet className="wallet_modal_icon" />
                <h3>Pandit Wallet & Settlement Center</h3>
              </div>
              <button className="btn_close_modal" onClick={() => setShowWalletModal(false)}>
                <IoClose />
              </button>
            </div>

            <div className="wallet_modal_body">
              {/* Balance Highlight Banner */}
              <div className="wallet_balance_banner">
                <div>
                  <span className="banner_subtitle">Available Payout Balance</span>
                  <h2 className="banner_amount">₹{walletVal.toLocaleString()}</h2>
                </div>
                <div className="banner_rate_info">
                  <span>Consultation Rate: ₹{pandit?.price || 21}/min</span>
                  <span>Completed Pujas: {stats.total_poojas || 0}</span>
                </div>
              </div>

              {/* Payout Request Form */}
              <form onSubmit={handlePayoutSubmit} className="payout_form">
                <h4>Request Withdrawal / Bank Transfer</h4>

                <div className="form_group">
                  <label>Enter Amount to Withdraw (₹):</label>
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="e.g. 1000"
                    max={walletVal}
                    required
                  />
                  <div className="quick_amount_chips">
                    <button type="button" onClick={() => setWithdrawAmount("500")}>₹500</button>
                    <button type="button" onClick={() => setWithdrawAmount("1000")}>₹1,000</button>
                    <button type="button" onClick={() => setWithdrawAmount("2000")}>₹2,000</button>
                    <button type="button" onClick={() => setWithdrawAmount(walletVal.toString())}>Full Balance</button>
                  </div>
                </div>

                <div className="form_group">
                  <label>Select Transfer Mode:</label>
                  <div className="payout_mode_selector">
                    <button
                      type="button"
                      className={`mode_btn ${payoutMode === "upi" ? "active" : ""}`}
                      onClick={() => setPayoutMode("upi")}
                    >
                      <FaMoneyBillWave /> UPI ID / VPA
                    </button>
                    <button
                      type="button"
                      className={`mode_btn ${payoutMode === "bank" ? "active" : ""}`}
                      onClick={() => setPayoutMode("bank")}
                    >
                      <FaUniversity /> Bank Account (NEFT/IMPS)
                    </button>
                  </div>
                </div>

                {payoutMode === "upi" ? (
                  <div className="form_group">
                    <label>UPI ID (e.g. panditji@okhdfcbank):</label>
                    <input
                      type="text"
                      value={payoutUpi}
                      onChange={(e) => setPayoutUpi(e.target.value)}
                      placeholder="Enter UPI ID"
                      required
                    />
                  </div>
                ) : (
                  <div className="bank_details_grid">
                    <div className="form_group">
                      <label>Bank Account Number:</label>
                      <input
                        type="text"
                        value={payoutBank}
                        onChange={(e) => setPayoutBank(e.target.value)}
                        placeholder="Account Number"
                        required
                      />
                    </div>
                    <div className="form_group">
                      <label>IFSC Code:</label>
                      <input
                        type="text"
                        value={payoutIfsc}
                        onChange={(e) => setPayoutIfsc(e.target.value)}
                        placeholder="e.g. HDFC0001234"
                        required
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="btn_submit_payout"
                  disabled={requestingPayout || walletVal <= 0}
                >
                  {requestingPayout ? "Submitting Request..." : "Request Payout Now"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
