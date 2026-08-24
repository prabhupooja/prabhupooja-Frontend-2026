import React from "react";
import successimg from "../Assets/waiting.png";
import "../../styles/registrationsuccess.css";

function Registrationsuccess() {
  return (
    <>
      <div className="registrationsuccess_page">
        <div className="registration_container">
          <div className="registration_box">
            <img src={successimg} className="successimg" />
            <div className="maincontent">Registration is Successfull..!!</div>
            <div className="subcontent">Please wait for confirmation..!!</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Registrationsuccess;
