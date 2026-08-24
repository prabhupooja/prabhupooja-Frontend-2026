import React from "react";
import "./footer.css"; 

function Footer() {
  return (
    <div className="footer">
      <div className="footer-content">
        <p>&copy; 2025 prabhupooja. All rights reserved.</p>
        <div className="footer-links">
          <a href="/privacy-policy">Privacy Policy</a>
          <a href="/terms-of-service">Terms of Service</a>
          <a href="/contact">Contact Us</a>
        </div>
      </div>
    </div>
  );
}

export default Footer;
