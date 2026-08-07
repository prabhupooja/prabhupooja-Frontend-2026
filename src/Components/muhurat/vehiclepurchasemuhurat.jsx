import React, { useState } from "react";
import "../../styles/vehiclepurchasemuhurat.css";

function Vehiclepurchasemuhurat() {
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
    city: "",
    modalname: "",
    vehicleuse: "",
    vehicletype: "",
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
      <div className="vehiclepurchase-form-container">
        <h2>Vehicle Purchase Muhurat Form</h2>
        <form onSubmit={handleSubmit} className="vehiclemuhurat_form">
          <div className="form-row">
            <div className="form-group">
              <label className="vehiclemuhurat_label">Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="vehiclemuhurat_label">
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
              <label className="vehiclemuhurat_label">
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
              <label className="vehiclemuhurat_label">
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
              <label className="vehiclemuhurat_label">
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
              <label className="vehiclemuhurat_label">Birth Nakshatra:</label>
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
              <label className="vehiclemuhurat_label">Gotra:</label>
              <input
                type="text"
                name="gotra"
                value={formData.gotra}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="vehiclemuhurat_label">Marriage Status:</label>
              <input
                type="text"
                name="marriagestatus"
                value={formData.marriagestatus}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="vehiclemuhurat_label">Vehicle Type</label>
              <select
                name="vehicletype"
                value={formData.vehicletype}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                <option value="Car">Car </option>
                <option value="Bike Scooter">Bike/Scooter</option>
                <option value="Commercial Vehicle">Commercial Vehicle </option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="vehiclemuhurat_label">Brand:</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="vehiclemuhurat_label">Model Name:</label>
              <input
                type="text"
                name="modalname"
                value={formData.modalname}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="vehiclemuhurat_label">
                What will the vehicle be used for?
              </label>
              <select
                name="vehicleuse"
                value={formData.vehicleuse}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                <option value="Personal Use">Personal Use</option>
                <option value="Business Commercial Use">Business/Commercial Use</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="vehiclemuhurat_label">
              Preferred Muhurat Date Range:
            </label>
            <input
              type="text"
              name="muhuratdate"
              value={formData.muhuratdate}
              onChange={handleChange}
              required
            />
          </div>
        </form>
        <button type="submit" className="vehiclepurchase_btn">
          Submit
        </button>
      </div>
    </>
  );
}

export default Vehiclepurchasemuhurat;
