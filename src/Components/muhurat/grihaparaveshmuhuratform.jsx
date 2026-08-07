import React, { useState } from "react";
import "../../styles/grihapraveshform.css";

function Grihaparaveshmuhuratform() {
  const [formData, setFormData] = useState({
    name: "",
    birthDate: "",
    birthTime: "",
    birthPlace: "",
    birthRashi: "",
    birthNakshatra: "",
    gotra: "",
    houseType: "",
    expectedDate: "",
    city: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log("Form Submitted", formData);
  };

  return (
    <div className="grihapravesh-form-container">
      <h2>Griha Pravesh Muhurat Form</h2>
      <form onSubmit={handleSubmit} className="grihamuhurat_form">
        <div className="form-row">
          <div className="form-group">
            <label className="grihamuhurat_label">
              Name of the person performing Pooja:
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="grihamuhurat_label">
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
            <label className="grihamuhurat_label">
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
            <label className="grihamuhurat_label">
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
            <label className="grihamuhurat_label">
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
            <label className="grihamuhurat_label">Birth Nakshatra:</label>
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
            <label className="grihamuhurat_label">Gotra:</label>
            <input
              type="text"
              name="gotra"
              value={formData.gotra}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="grihamuhurat_label">
              New House or Old House?
            </label>
            <select
              name="houseType"
              value={formData.houseType}
              onChange={handleChange}
              required
            >
              <option value="">Select</option>
              <option value="New House">New House</option>
              <option value="Renovated">After Renovation</option>
              <option value="Rental">Rental House</option>
            </select>
          </div>

          <div className="form-group">
            <label className="grihamuhurat_label">
              Expected Date for Griha Pravesh:
            </label>
            <input
              type="date"
              name="expectedDate"
              value={formData.expectedDate}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="grihamuhurat_label">
              City where Griha Pravesh will take place:
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </div>
        </div>
      </form>
      <button type="submit" className="grihapravesh_btn">
        Submit
      </button>
    </div>
  );
}

export default Grihaparaveshmuhuratform;
