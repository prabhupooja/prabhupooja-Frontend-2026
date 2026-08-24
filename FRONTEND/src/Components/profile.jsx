import React, {  useRef } from "react";
import userprofileimg from "../Components/Assets/userprofile3.png";

const Profile = ({
  userName,
  userMobile,
  balance,
  isPrimeMember,
  profileMenuOpen,
  setProfileMenuOpen,
  handleLogout,
}) => {
  // Move useRef inside the component function
  const profileMenuRef = useRef(null);

  return (
    <li
      className="profile-menu"
      onClick={() => setProfileMenuOpen(!profileMenuOpen)}
      ref={profileMenuRef}
    >
      <img src={userprofileimg} alt="" className="userimg" />
      {profileMenuOpen && (
        <div className="profile-dropdown">
          <img src={userprofileimg} alt="" className="userimg1" />
          <p>{userName}</p>
          <p>{userMobile}</p>
          <p> {isPrimeMember }</p>

          <div className="separator"></div>
          <div className="wallet">
            <p>Wallet balance: ₹ {balance}</p>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        </div>
      )}
    </li>
  );
};

export default Profile;
