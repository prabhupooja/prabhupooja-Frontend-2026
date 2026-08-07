import React from "react";
import rejectimg from "../Assets/rejected.png";
import "../../styles/rejectedpage.css";

function Rejectedpage() {
  return (
    <>
      <div className="rejectedpage">
        <div className="rejected_container">
          <div className="rejected_box">
            <img
              src={rejectimg}
              className="rejected_img"
            />
            <div className="maincontent_rejected">
              Sorry Your Registration is Rejected..!!
            </div>
            <div className="subcontent_rejected">You are not verified..!!</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Rejectedpage;
