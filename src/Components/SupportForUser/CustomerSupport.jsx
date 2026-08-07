import React, { useState } from 'react';
import './CustomerSupport.css';
import { FaHeadset, FaEnvelope, FaPhoneAlt, FaClipboardList } from 'react-icons/fa';
import useAuthStore from '../../Store/UserStore/userAuthStore';
import useUserStore from '../../Store/UserStore/userStore';
import Swal from 'sweetalert2';

const CustomerSupport = () => {
  const { user1 } = useAuthStore();
  const [issueType, setIssueType] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState(user1?.email || '');
  const [phone, setPhone] = useState(user1?.mobile || '');
  const [successMessage, setSuccessMessage] = useState('');
  const { userTicketCreate } = useUserStore();
  const [loading, setLoading] = useState(false)


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await userTicketCreate({
        issue_type: issueType,
        description: description,
        user_id: user1?.id
      });

      // console.log(response, "ticket response");
      if (response?.success) {
        setLoading(false);
        Swal.fire({
          icon: 'success',
          title: 'Ticket Submitted!',
          text: ' Your support ticket has been created! We’ll reach out shortly.',
          confirmButtonColor: '#3085d6'
        });
        setSuccessMessage('Your support ticket has been created! We’ll reach out shortly.');
        setIssueType('');
        setDescription('');

      }
    } catch (err) {
      setLoading(false);
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong while submitting your ticket. Please try again!',
        confirmButtonColor: '#d33'
      });
    }
  };


  return (
    <div className="support-wrapper">
      <div className="support-card">
        <div className="support-header">
          <FaHeadset className="support-icon" />
          <h2>Need Help? Contact Support</h2>
          <p>We’re here to assist you. Fill out the form below to raise a support ticket.</p>
        </div>

        <form className="support-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              placeholder="Your Email Address"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <FaPhoneAlt className="input-icon" />
            <input
              type="tel"
              placeholder="Your Mobile Number"
              value={phone}
              required
              onChange={(e) => setPhone(e.target.value)}
              maxLength={15}
            />
          </div>

          <div className="input-group">
            <FaClipboardList className="input-icon" />
            <select
              value={issueType}
              required
              onChange={(e) => setIssueType(e.target.value)}
            >
              <option value="">Select Issue Type</option>
              <option value="Order Issue"> Order Issue</option>
              <option value="Payment Problem">Payment Problem</option>
              <option value="Booking Issue">Booking Issue</option>
              <option value="Technical Error"> Technical Error</option>
              <option value="Account/Login"> Account/Login</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <textarea
            rows="5"
            placeholder="Describe your issue in detail..."
            value={description}
            required
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>

          <button type="submit" disabled={loading} className="submit-button">
            {loading ? 'Submitting...' : 'Submit Ticket'}
          </button>
          {successMessage && <p className="success">{successMessage}</p>}
        </form>
      </div>
    </div>
  );
};

export default CustomerSupport;
