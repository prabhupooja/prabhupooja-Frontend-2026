import React, { useState } from "react";
import Swal from "sweetalert2";
import api from "../Axios/api";

const EventForm = ({ 
  setShowPopup, 
  onClose,
  prefilledService = "", 
  eventTitle = "",
  eventId = null,
  prefilledDate = "", 
  user = null 
}) => {
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    if (setShowPopup) setShowPopup(false);
    if (onClose) onClose();
  };

  const [formData, setFormData] = useState({
    fullName: user?.name || user?.user_name || "",
    mobile: user?.mobile || user?.phone || "",
    email: user?.email || "",
    service: prefilledService || eventTitle || "गणेश चतुर्थी विशेष पूजा",
    poojaDate: prefilledDate || "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    // Mobile Validation (10 Digits)
    const cleanMobile = formData.mobile.replace(/\D/g, "");
    if (cleanMobile.length < 10) {
      Swal.fire({
        icon: "warning",
        title: "अमान्य मोबाइल नंबर",
        text: "कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें।",
        confirmButtonColor: "#d84315"
      });
      return;
    }

    setLoading(true);

    try {
      const payload = {
        fullName: formData.fullName.trim(),
        mobile: cleanMobile,
        email: formData.email.trim() || null,
        service: formData.service,
        poojaDate: formData.poojaDate || null,
        message: formData.message.trim() || null,
        event_id: eventId || null,
        event_title: eventTitle || formData.service,
        user_id: user?.id || null
      };

      const response = await api.post("/events/register", payload);

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "पंजीकरण सफल!",
          text: "आपका पंजीकरण सफलतापूर्वक दर्ज कर लिया गया है। हमारी टीम जल्द ही आपसे संपर्क करेगी।",
          confirmButtonText: "जय श्री गणेश",
          confirmButtonColor: "#d84315"
        });

        // Reset Form
        setFormData({
          fullName: "",
          mobile: "",
          email: "",
          service: "",
          poojaDate: "",
          message: "",
        });

        handleClose();
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "पंजीकरण विफल",
        text: error?.response?.data?.message || "कृपया अपनी जानकारी जांचें और पुनः प्रयास करें।",
        confirmButtonColor: "#d84315"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sawan-popup-overlay">
      <div className="sawan-popup-box">
        <button className="sawan-close-popup" onClick={handleClose}>
          ✕
        </button>

        <h2>
          {eventTitle || prefilledService 
            ? `${eventTitle || prefilledService} रजिस्ट्रेशन` 
            : "विशेष पूजा एवं अनुष्ठान रजिस्ट्रेशन"}
        </h2>

        <form className="sawan-popup-form" onSubmit={handleSubmit}>
          {/* Row 1 */}
          <div className="sawan-form-row">
            <div className="sawan-input-group">
              <label>पूरा नाम <span style={{ color: "red" }}>*</span></label>
              <input
                type="text"
                name="fullName"
                placeholder="अपना पूरा नाम दर्ज करें"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="sawan-input-group">
              <label>मोबाइल नंबर <span style={{ color: "red" }}>*</span></label>
              <input
                type="tel"
                name="mobile"
                maxLength="10"
                placeholder="10 अंकों का मोबाइल नंबर"
                value={formData.mobile}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Row 2 */}
          <div className="sawan-form-row">
            <div className="sawan-input-group">
              <label>ईमेल आईडी</label>
              <input
                type="email"
                name="email"
                placeholder="ईमेल आईडी दर्ज करें (वैकल्पिक)"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="sawan-input-group">
              <label>सेवा / पूजा का नाम <span style={{ color: "red" }}>*</span></label>
              <select
                name="service"
                value={formData.service}
                onChange={handleChange}
                required
              >
                {(eventTitle || prefilledService) && (
                  <option value={eventTitle || prefilledService}>
                    {eventTitle || prefilledService} (विशेष उत्सव)
                  </option>
                )}
                <option value="गणेश चतुर्थी विशेष पूजा">गणेश चतुर्थी विशेष पूजा</option>
                <option value="रुद्राभिषेक">रुद्राभिषेक</option>
                <option value="महामृत्युंजय जाप">महामृत्युंजय जाप</option>
                <option value="ज्योतिर्लिंग अभिषेक">ज्योतिर्लिंग अभिषेक</option>
                <option value="नवग्रह शांति पूजा">नवग्रह शांति पूजा</option>
                <option value="अन्य विशेष अनुष्ठान">अन्य विशेष अनुष्ठान</option>
              </select>
            </div>
          </div>

          {/* Row 3 */}
          <div className="sawan-form-row">
            <div className="sawan-input-group">
              <label>पूजा की तिथि</label>
              <input
                type="date"
                name="poojaDate"
                value={formData.poojaDate}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Message */}
          <div className="sawan-input-group">
            <label>मनोकामना / विशेष जानकारी</label>
            <textarea
              name="message"
              placeholder="अपनी मनोकामना, गोत्र या विशेष जानकारी लिखें"
              rows="4"
              value={formData.message}
              onChange={handleChange}
            ></textarea>
          </div>

          <p className="sawan-popup-note">
            नोट: रजिस्ट्रेशन के बाद हमारी टीम 24 घंटे के भीतर आपसे संपर्क करेगी।
          </p>

          <button
            type="submit"
            className={`sawan-submit-btn ${loading ? "sawan-btn-loading" : ""}`}
            disabled={loading}
          >
            {loading ? "कृपया प्रतीक्षा करें..." : "रजिस्टर करें"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EventForm;
