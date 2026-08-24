import React, { useEffect } from "react";
import "./sidenavbar.css";
import { IoHome } from "react-icons/io5";
import { FaUser, FaPrayingHands } from "react-icons/fa";
import { FaCircleUser } from "react-icons/fa6";
import useAuthStore from "../Store/AuthStore/AuthStore";
import useSokectStore from "../Store/Sokect/SokectStore";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const { connectPandit, disconnectPandit, panditOnline } = useSokectStore();
  const { pandit, panditGet } = useAuthStore();
  const token = localStorage.getItem('Pandittoken');
  const navigate = useNavigate();

  useEffect(() => {
    userFetch();
  }, []);

  const userFetch = async () => {
    if (!token) {
      navigate('/');
    } else {
      await panditGet();
    }
  };

  useEffect(() => {
    if (pandit?.id) {
      connectPandit(pandit?.id);
    }
    return () => {
      disconnectPandit();
    };
  }, [pandit, connectPandit]);

  const handlePanditOnline = async () => {
    const response = await panditOnline({
      pandit_id: pandit?.id
    });
    console.log(response);
  };

  return (
    <div className="sidebar open">
      <div className="sidebar-header">
        <span>Welcome to,</span>
        <p>Pandit Panel</p>
      </div>
      <ul className="sidebar-links">
        <li>
          <IoHome className="home_icon" />
          <a href="/home">Home</a>
        </li>
        <li>
          <FaPrayingHands className="home_icon" />
          <a href="/assignedbookings">Assigned Pujas</a>
        </li>
        <li>
          <FaUser className="home_icon" />
          <a href="/userlistrequest">User List</a>
        </li>
        <li>
          <FaCircleUser className="call_icon" />
          <a href="/panditprofile">Pandit Profile</a>
        </li>
      </ul>
      <button onClick={handlePanditOnline}>pandit online</button>
    </div>
  );
}

export default Navbar;
