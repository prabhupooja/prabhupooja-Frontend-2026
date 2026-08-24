import React, { useState } from "react";
import Swal from "sweetalert2";
import useRudraAbhishekStore from "../../Store/RudraAbhishek/rudraAbhishekStore";

const EventForm = ({ setShowPopup, prefilledService = "", prefilledDate = "", user = null }) => {
  const [loading, setLoading] = useState(false);
  const { addRudraAbhishek } = useRudraAbhishekStore();

  const [formData, setFormData] = useState({
    fullName: user?.name || user?.user_name || "",
    mobile: user?.mobile || user?.phone || "",
    email: user?.email || "",
    service: prefilledService || "",
    poojaDate: prefilledDate || "",
    message: "",
  });

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle Submit
const handleSubmit = async (e) => {
  e.preventDefault();

  if (loading) return;

  setLoading(true);

  try {
    const payload = {
      fullName: formData.fullName,
      mobile: formData.mobile,
      email: formData.email,
      service: formData.service,
      poojaDate: formData.poojaDate,
      message: formData.message,
    };

    console.log("Payload:", payload);

    const response = await addRudraAbhishek(payload);

    console.log("API Response:", response);

    Swal.fire({
      icon: "success",
      title: "रजिस्ट्रेशन सफल!",
      text: "हमारी टीम जल्द ही आपसे संपर्क करेगी।",
      confirmButtonText: "ठीक है",
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

    setShowPopup(false);

  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "कुछ गलत हो गया!",
      text:
        error?.response?.data?.message ||
        "कृपया दोबारा प्रयास करें।",
    });
    
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="sawan-popup-overlay">
      <div className="sawan-popup-box">
        <button
          className="sawan-close-popup"
          onClick={() => setShowPopup(false)}
        >
          ✕
        </button>

        <h2>सावन पूजा रजिस्ट्रेशन</h2>

        <form className="sawan-popup-form" onSubmit={handleSubmit}>
          {/* Row 1 */}
          <div className="sawan-form-row">
            <div className="sawan-input-group">
              <label>पूरा नाम</label>
              <input
                type="text"
                name="fullName"
                placeholder="अपना पूरा नाम दर्ज करें"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>

            <div className="sawan-input-group">
              <label>मोबाइल नंबर</label>
              <input
                type="tel"
                name="mobile"
                placeholder="मोबाइल नंबर दर्ज करें"
                value={formData.mobile}
                onChange={handleChange}
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
                placeholder="ईमेल आईडी दर्ज करें"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="sawan-input-group">
              <label>सेवा चुनें</label>
              <select
                name="service"
                value={formData.service}
                onChange={handleChange}
              >
                <option value="">सेवा चुनें</option>
                <option value="रुद्राभिषेक">रुद्राभिषेक</option>
                {/* <option value="महामृत्युंजय जाप">महामृत्युंजय जाप</option> */}
                <option value="ज्योतिर्लिंग अभिषेक">ज्योतिर्लिंग अभिषेक</option>
                <option value="ज्योतिर्लिंग दर्शन">ज्योतिर्लिंग दर्शन</option>
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
              placeholder="अपनी मनोकामना या विशेष जानकारी लिखें"
              rows="4"
              value={formData.message}
              onChange={handleChange}
            ></textarea>
          </div>

          <p className="sawan-popup-note">
            नोट: रजिस्ट्रेशन के बाद हमारी टीम 24 घंटे के भीतर आपसे संपर्क करेगी।
            कृपया सभी जानकारी सही एवं पूर्ण रूप से भरें।
          </p>

          <button
            type="submit"
            className={`sawan-submit-btn ${loading ? "sawan-btn-loading" : ""}`}
            disabled={loading}
          >
            {loading ? (
              <span className="sawan-loader-wrap">
                <span className="sawan-loader"></span>
                कृपया प्रतीक्षा करें...
              </span>
            ) : (
              "रजिस्टर करें"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EventForm;
