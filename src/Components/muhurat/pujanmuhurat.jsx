import React, { useState } from "react";
import "../../styles/pujanmuhurat.css";

function Pujanmuhurat() {
  const [formData, setFormData] = useState({
    name: "",
    birthDate: "",
    birthTime: "",
    birthPlace: "",
    birthRashi: "",
    birthNakshatra: "",
    gotra: "",
    marriagestatus: "",
    brand: "",
    propertylocation: "",
    pujantype: "",
    pujaplace: "",
    muhuratdate: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log("Form Submitted", formData);
  };

  return (
    <>
      <div className="pujan-form-container">
        <h2>Pujan Muhurat Form</h2>
        <form onSubmit={handleSubmit} className="pujanmuhurat_form">
          <div className="form-row">
            <div className="form-group">
              <label className="pujanmuhurat_label">Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="pujanmuhurat_label">
                Date of Birth (DD/MM/YYYY):
              </label>
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="pujanmuhurat_label">
                Time of Birth (Exact Time):
              </label>
              <input
                type="time"
                name="birthTime"
                value={formData.birthTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="pujanmuhurat_label">
                Place of Birth (City, State, Country):
              </label>
              <input
                type="text"
                name="birthPlace"
                value={formData.birthPlace}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="pujanmuhurat_label">
                Birth Rashi (Zodiac Sign):
              </label>
              <input
                type="text"
                name="birthRashi"
                value={formData.birthRashi}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="pujanmuhurat_label">Birth Nakshatra:</label>
              <input
                type="text"
                name="birthNakshatra"
                value={formData.birthNakshatra}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="pujanmuhurat_label">Gotra:</label>
              <input
                type="text"
                name="gotra"
                value={formData.gotra}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="pujanmuhurat_label">Marriage Status:</label>
              <input
                type="text"
                name="marriagestatus"
                value={formData.marriagestatus}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="pujanmuhurat_label">Type of Pujan:</label>
              <select
                name="pujantype"
                value={formData.pujantype}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                <option value="Ganesh Puja">Ganesh Puja </option>
                <option value="Satyanarayan Katha">Satyanarayan Katha</option>
                <option value="Navagraha Shanti">Navagraha Shanti</option>
                <option value="Rudrabhishek">Rudrabhishek</option>
                <option value="Graha Dosh Nivaran">Graha Dosh Nivaran</option>
                <option value="Havan">Havan </option>
                <option value="Durga Saptashati Path">
                  Durga Saptashati Path
                </option>
                <option value="Vastu Shanti Puja">Vastu Shanti Puja </option>
                <option value="Kaal Sarp Dosh Puja">Kaal Sarp Dosh Puja</option>
                <option value="Any Other">Any Other</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="pujanmuhurat_label">
                Preferred Muhurat Date Range :
              </label>
              <input
                type="text"
                name="muhuratdate"
                value={formData.muhuratdate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="pujanmuhurat_label">
                Where do you want to perform the puja?
              </label>
              <select
                name="pujaplace"
                value={formData.pujaplace}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                <option value="Home">Home</option>
                <option value="Temple">Temple</option>
                <option value="Office Business Place">
                  Office / Business Place
                </option>
                <option value="Online Puja">Online Puja</option>
                <option value="Other">Other </option>
              </select>
            </div>
          </div>
        </form>
        <button type="submit" className="pujan_btn">
          Submit
        </button>
      </div>
    </>
  );
}

export default Pujanmuhurat;
