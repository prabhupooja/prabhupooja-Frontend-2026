import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Use useNavigate instead of useHistory
import axios from "axios";

const PanditFilterModal = ({ isOpen, onClose }) => {
  const [skills, setSkills] = useState("");
  const [language, setLanguage] = useState("");
  const [gender, setGender] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate(); // Initialize useNavigate hook

  // Static options for skills, languages, and genders
  const skillOptions = [
    "Astrology",
    "Vastu Shastra",
    "Tarot Reading",
    "Palmistry",
  ];
  const languageOptions = ["English", "Hindi", "Sanskrit", "Marathi"];
  const genderOptions = ["Male", "Female", "Other"];

  // Handle the Apply Filters button click
  const handleFilterChange = () => {
    navigate(`/pandits?skills=${skills}&language=${language}&gender=${gender}`);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>
          &times; Close
        </button>
        <h2>Filter Pandits</h2>

        {/* Skills Filter */}
        <div className="filter">
          <label htmlFor="skills">Select Skills:</label>
          <select
            id="skills"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
          >
            <option value="">Select Skill</option>
            {skillOptions.map((skill) => (
              <option key={skill} value={skill}>
                {skill}
              </option>
            ))}
          </select>
        </div>

        {/* Language Filter */}
        <div className="filter">
          <label htmlFor="language">Select Language:</label>
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="">Select Language</option>
            {languageOptions.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>

        {/* Gender Filter */}
        <div className="filter">
          <label htmlFor="gender">Select Gender:</label>
          <select
            id="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="">Select Gender</option>
            {genderOptions.map((gen) => (
              <option key={gen} value={gen}>
                {gen}
              </option>
            ))}
          </select>
        </div>

        <button onClick={handleFilterChange}>Apply Filters</button>
      </div>
    </div>
  );
};

export default PanditFilterModal;
