import React from 'react';

const FilterModal = ({ isOpen, onClose, onApplyFilters }) => {
  const [filters, setFilters] = React.useState({
    skills: [],
    languages: [],
    gender: '',
    country: ''
  });

  const handleFilterChange = (field, value) => {
    if (Array.isArray(filters[field])) {
      setFilters(prev => ({
        ...prev,
        [field]: prev[field].includes(value)
          ? prev[field].filter(item => item !== value)
          : [...prev[field], value]
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSubmit = () => {
    onApplyFilters(filters);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="filter-modal">
      <div className="modal-content">
        <button className="close" onClick={onClose}>X</button>
        <h2>Filters</h2>
        <div>
          <h3>Skills</h3>
          {/* Replace these with actual skills */}
          {['Skill1', 'Skill2', 'Skill3'].map(skill => (
            <label key={skill}>
              <input
                type="checkbox"
                onChange={() => handleFilterChange('skills', skill)}
              />
              {skill}
            </label>
          ))}
        </div>
        <div>
          <h3>Languages</h3>
          {/* Replace these with actual languages */}
          {['English', 'Hindi', 'Spanish'].map(language => (
            <label key={language}>
              <input
                type="checkbox"
                onChange={() => handleFilterChange('languages', language)}
              />
              {language}
            </label>
          ))}
        </div>
        <div>
          <h3>Gender</h3>
          {['Male', 'Female', 'Other'].map(gender => (
            <label key={gender}>
              <input
                type="radio"
                name="gender"
                value={gender}
                onChange={() => handleFilterChange('gender', gender)}
              />
              {gender}
            </label>
          ))}
        </div>
        <div>
          <h3>Country</h3>
          {/* Replace these with actual countries */}
          {['India', 'USA', 'Canada'].map(country => (
            <label key={country}>
              <input
                type="radio"
                name="country"
                value={country}
                onChange={() => handleFilterChange('country', country)}
              />
              {country}
            </label>
          ))}
        </div>
        <button onClick={handleSubmit}>Apply Filters</button>
      </div>
    </div>
  );
};

export default FilterModal;
