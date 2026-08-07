import React, { useEffect, useState } from "react";
import "./ViewSupportTicket.css";
import { Link } from "react-router-dom";
import useAuthStore from "../../Store/UserStore/userAuthStore";
import useUserStore from "../../Store/UserStore/userStore";
import CryptoJS from "crypto-js";
import { TailSpin } from "react-loader-spinner";
import { FaRegCalendarTimes } from "react-icons/fa";


const ViewSupportTicket = () => {
  const { user1 } = useAuthStore();
  const { getAllTiketsByUserId } = useUserStore();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTickets = async () => {
    try {
      setLoading(true)
      const response = await getAllTiketsByUserId(user1?.id);
      // console.log(response.data.data, "response in tickets");

      if (response?.data && response?.data?.success) {
        setLoading(false)
        setTickets(response.data.data);
      } else {
        setLoading(false)
        console.error("No tickets found or error fetching tickets.");
      }
    } catch (error) {
      setLoading(false)
      console.error("Error fetching tickets:", error);
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
  return (
    <div className="ticket-view-container">


      {tickets.length === 0 ? (
        <div className="booking_box">
          <FaRegCalendarTimes className="error-icon" size={40} />
          <p className="no_booking_text">No tikect found.</p>
        </div>
      ) : (

        <div className="ticket-table-wrapper">
          <h2 className="ticket-title">Your Support Tickets</h2>
          <table className="ticket-table">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Issue Type</th>
                <th>Status</th>
                <th>Submitted On</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket, index) => {
                const incryptedId = encryptId(ticket.id);
                return (
                  <tr key={index}>
                    <td>#{ticket.ticket_id}</td>
                    <td>{ticket.issue_type}</td>
                    <td>
                      <span
                        className={`status ${ticket.status
                          .toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {ticket.status}
                      </span>
                    </td>
                    <td>
                      {new Date(ticket.submitted_date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </td>
                    <td>
                      <Link to={`/support/view/${incryptedId}`}>
                        <button className="view-btn">View</button>
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
  );
};

export default ViewSupportTicket;
