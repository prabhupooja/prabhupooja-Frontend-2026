import React, { useEffect, useState } from "react";
import "./ViewSingleTicket.css";
import {
  FaTicketAlt,
  FaRegCalendarAlt,
  FaClipboardList,
  FaCheckCircle,
  FaEnvelopeOpenText,
} from "react-icons/fa";
import useUserStore from "../../Store/UserStore/userStore";
import { useParams } from "react-router-dom";
import CryptoJS from "crypto-js";

const ViewSingleTicket = () => {
  const { getOneTiketsById } = useUserStore();
  const [ticket, setTicket] = useState({});
  const { ticketId } = useParams();

  const decryptId = (encryptedIdFromUrl) => {
    const decodedId = decodeURIComponent(encryptedIdFromUrl);
    const bytes = CryptoJS.AES.decrypt(decodedId, "prabhupooja2024");
    return bytes.toString(CryptoJS.enc.Utf8);
  };

  const fetchTickets = async () => {
    try {
      const response = await getOneTiketsById(decryptId(ticketId));
      // console.log(response, "response in tickets");

      if (response?.data && response?.data?.success) {
        setTicket(response.data.data);
      } else {
        console.error("No tickets found or error fetching tickets.");
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  };

  useEffect(() => {
    if (ticketId) {
      fetchTickets();
    }
  }, [ticketId]);

  return (
    <div className="single-ticket-wrapper">
      <div className="ticket-card">
        <div className="ticket-header">
          <FaTicketAlt className="ticket-icon" />
          <h2>Ticket Details</h2>
        </div>

        <div className="ticket-detail-row">
          <span>
            <FaTicketAlt /> Ticket ID:
          </span>
          <strong>{ticket.ticket_id}</strong>
        </div>

        <div className="ticket-detail-row">
          <span>
            <FaClipboardList /> Issue Type:
          </span>
          <strong>{ticket.issue_type}</strong>
        </div>

        <div className="ticket-detail-row">
          <span>
            <FaCheckCircle /> Status:
          </span>
          <strong
            className={`status ${ticket.status}`}
          >
            {ticket.status}
          </strong>
        </div>

        <div className="ticket-detail-row">
          <span>
            <FaRegCalendarAlt /> Submitted Date:
          </span>
          <strong>
            {new Date(ticket.submitted_date).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </strong>{" "}
        </div>

        <div className="ticket-detail-row">
          <span>
            <FaRegCalendarAlt /> Resolve Date:
          </span>
          <strong>
  {ticket.response_date
    ? new Date(ticket.response_date).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "NA"}
</strong>
        </div>

        <div className="ticket-section">
          <h4>
            <FaEnvelopeOpenText /> Description
          </h4>
          <p>{ticket.description}</p>
        </div>

        <div className="ticket-section">
          <h4>
            <FaCheckCircle /> Response
          </h4>
          <p>
            {ticket.response ||
              "Your ticket is being reviewed. Please wait for an update."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ViewSingleTicket;
