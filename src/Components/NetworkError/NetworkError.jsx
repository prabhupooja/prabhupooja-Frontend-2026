import React, { useState, useEffect } from 'react';
import './NetworkError.css';

const NetworkError = () => {
  const handleReload = () => {
    window.location.reload();
  };
  return (
    <>
      <div className="network-error-container">
        <div>
          <p>No internet. Please connect to the internet.</p>
          <button className="network-error-button" onClick={handleReload}>
            Reload
          </button>
        </div>
      </div>
    </>
  );
};

export default NetworkError;
