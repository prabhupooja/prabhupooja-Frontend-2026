import React from "react";
import "../../styles/vivahmuhuratform.css";

function Vivahmuhuratform() {
  return (
    <>
      <div className="vivah-form-container">
        <div className="form-section">
          <div className="form-box">
            <h2>Groom's Details</h2>
            <input type="text" placeholder="Full Name" />
            <input type="date" placeholder="Date of Birth" />
            <input type="time" placeholder="Time of Birth" />
            <input type="text" placeholder="Place of Birth" />
            <input type="text" placeholder="Rashi & Nakshatra" />
          </div>
          <div className="form-box">
            <h2>Bride's Details</h2>
            <input type="text" placeholder="Full Name" />
            <input type="date" placeholder="Date of Birth" />
            <input type="time" placeholder="Time of Birth" />
            <input type="text" placeholder="Place of Birth" />
            <input type="text" placeholder="Rashi & Nakshatra" />
          </div>
        </div>

        <div className="vivah-info">
          <h2>Vivah Details</h2>
          <input type="month" placeholder="Expected Month of Marriage" />
          <input type="text" placeholder="Marriage Venue/City" />
          <select>
            <option value="">Kundali?</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
          <input
            type="text"
            placeholder="Vivah Vidhi (Traditional, Court, etc.)"
          />
        </div>
        <button type="submit" className="vivahsubmit_btn">
          Submit
        </button>
      </div>
    </>
  );
}

export default Vivahmuhuratform;
