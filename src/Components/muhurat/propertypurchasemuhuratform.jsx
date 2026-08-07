import React, { useState } from "react";
import "../../styles/propertypurchasemuhuratform.css";

function Propertypurchasemuhuratform() {
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
    propertytype: "",
    propertyuse: "",
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
      <div className="propertypurchase-form-container">
        <h2>Property Purchase Muhurat Form</h2>
        <form onSubmit={handleSubmit} className="propertymuhurat_form">
          <div className="form-row">
            <div className="form-group">
              <label className="propertymuhurat_label">Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="propertymuhurat_label">
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
              <label className="propertymuhurat_label">
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
              <label className="propertymuhurat_label">
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
              <label className="propertymuhurat_label">
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
              <label className="propertymuhurat_label">Birth Nakshatra:</label>
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
              <label className="propertymuhurat_label">Gotra:</label>
              <input
                type="text"
                name="gotra"
                value={formData.gotra}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="propertymuhurat_label">Marriage Status:</label>
              <input
                type="text"
                name="marriagestatus"
                value={formData.marriagestatus}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="propertymuhurat_label">Property Type</label>
              <select
                name="propertytype"
                value={formData.propertytype}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                <option value="Flat Apartment">Flat / Apartment </option>
                <option value="Independent House">Independent House</option>
                <option value="Commercial Property">Commercial Property</option>
                <option value="Land Plot">Land / Plot</option>
                <option value="Farmhouse">Farmhouse</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="propertymuhurat_label">
                Property Location :
              </label>
              <input
                type="text"
                name="propertylocation"
                value={formData.propertylocation}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="propertymuhurat_label">
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
              <label className="propertymuhurat_label">
                What will the property be used for?
              </label>
              <select
                name="propertyuse"
                value={formData.propertyuse}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                <option value="Personal Use">Personal Use</option>
                <option value="Business Commercial Use">
                  Business/Commercial Use
                </option>
                <option value="Rental Purpose">Rental Purpose</option>
              </select>
            </div>
          </div>
        </form>
        <button type="submit" className="propertypurchase_btn">
          Submit
        </button>
      </div>
    </>
  );
}

export default Propertypurchasemuhuratform;
