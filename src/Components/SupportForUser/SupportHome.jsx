import React from 'react';
import './SupportHome.css';
import { FaTicketAlt, FaPlusCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const SupportHome = () => {
  const navigate = useNavigate();

  return (
    <div className="support-home-container">
      <h2 className="support-title">Welcome to Customer Support</h2>
      <p className="support-subtitle">How can we assist you today?</p>

      <div className="support-cards">
        <div className="support-card" onClick={() => navigate('/support/create')}>
          <FaPlusCircle className="support-card-icon" />
          <h3>Create Ticket</h3>
          <p>Facing an issue? Let us know by creating a new support ticket.</p>
        </div>

        <div className="support-card" onClick={() => navigate('/support/view')}>
          <FaTicketAlt className="support-card-icon" />
          <h3>View Tickets</h3>
          <p>Check the status and history of your existing support tickets.</p>
        </div>
      </div>
    </div>
  );
};

export default SupportHome;
