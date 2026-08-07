import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../Components/Assets/NewSizelogopp.png";
import { navItems } from "./Navitems";
import Dropdown from "./Dropdown";
import { FaBars, FaTimes } from "react-icons/fa";
import api from "./Axios/api";
import prasadimg from "../Components/Assets/prasadimg.webp";
import prasadimg2 from "../Components/Assets/prasadimg2.webp";
import prasadimg3 from "../Components/Assets/prasadimg3.jpg";
import Profile from "./profile";

const Header = () => {
  const [dropdown, setDropdown] = useState(false);
  const [dropdown1, setCartDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [userMobile, setUserMobile] = useState("");
  const [balance, setBalance] = useState(0);
  const [isPrimeMember, setIsPrimeMember] = useState(false); // State to track prime membership status
  const navigate = useNavigate();
  const profileMenuRef = useRef(null);
  const menuRef = useRef(null);
  const cartRef = useRef(null);
  const serviceRef = useRef(null);

  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem("token");
      const isVerified = localStorage.getItem("isVerified");
      const user = JSON.parse(localStorage.getItem("users"));
      const member = JSON.parse(localStorage.getItem("member")); 

      // console.log("Auth Status:", { token, isVerified, user, member });

      if (token && isVerified === "true") {
        setIsLoggedIn(true);
        if (user) {
          setUserName(user.name);
          setUserMobile(user.mobile);
          setIsPrimeMember(member);
        }
      } else {
        setIsLoggedIn(false);
      }

      // Log the value of member to check if it's true/false correctly
      // console.log("Prime Member Status:", member);

      // Ensure member is correctly treated as a boolean
      // setIsPrimeMember(member === true);
    };

    checkAuthStatus();

    const handleLoginStatusChange = () => {
      checkAuthStatus();
    };

    window.addEventListener("loginStatusChanged", handleLoginStatusChange);

    return () => {
      window.removeEventListener("loginStatusChanged", handleLoginStatusChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isVerified");
    localStorage.removeItem("users");
    localStorage.removeItem("member");
    setIsLoggedIn(false);
    setUserName("");
    setUserMobile("");
    setProfileMenuOpen(false);
    navigate("/");
    window.dispatchEvent(new Event("loginStatusChanged"));
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchBalance();
    }
  }, [isLoggedIn]);

  const fetchBalance = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("users"));
      const response = await api.get(`/users/balance/${user.id}`);
      setBalance(response.data.balance);
    } catch (error) {
      console.error("Failed to fetch balance:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuOpen &&
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setProfileMenuOpen(false);
      }

      if (
        menuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }

      if (
        dropdown1 &&
        cartRef.current &&
        !cartRef.current.contains(event.target) &&
        !event.target.classList.contains("view-cart-btn")
      ) {
        setCartDropdownOpen(false);
      }

      if (
        dropdown &&
        serviceRef.current &&
        !serviceRef.current.contains(event.target)
      ) {
        setDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileMenuOpen, menuOpen, dropdown1, dropdown]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    setDropdown(false);
  };

  const toggleDropdown = () => {
    setDropdown(!dropdown);
  };

  const closeMobileMenu = () => {
    setMenuOpen(false);
    setDropdown(false);
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        <img src={logo} alt="Prabhu Pooja Logo" height={120} width={160} />
      </Link>

      <div className="menu-icon" onClick={toggleMenu}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>

      <ul className={menuOpen ? "nav-items active" : "nav-items"}>
        {navItems.map((item) =>
          item.title === "Services" ? (
            <li
              key={item.id}
              className={item.cName}
              onClick={toggleDropdown}
              ref={serviceRef}
            >
              <Link to={item.path}>{item.title}</Link>
              {dropdown && <Dropdown toggleMenu={closeMobileMenu} />}
            </li>
          ) : (
            <li key={item.id} className={item.cName} onClick={closeMobileMenu}>
              <Link to={item.path}>{item.title}</Link>
            </li>
          )
        )}

        <li
          className="cart-icon"
          onClick={() => setCartDropdownOpen(!dropdown1)}
          ref={cartRef}
        >
          <i className="fa-solid fa-cart-plus"></i>
          <span className="cart-badge">3</span>
        </li>

        {dropdown1 && (
          <div className="cart-dropdown">
            <h3>Cart Items</h3>
            <ul className="cart-items-list">
              <li className="cart-dropdown-item">
                <img src={prasadimg} alt="Item 1" />
                <div className="cart-item-details">
                  <p>Kaju Katli Bhog</p>
                  <p>₹ 800</p>
                </div>
              </li>
              <li className="cart-dropdown-item">
                <img src={prasadimg2} alt="Item 2" />
                <div className="cart-item-details">
                  <p>Besan laddu Bhog</p>
                  <p>₹ 499</p>
                </div>
              </li>
              <li className="cart-dropdown-item">
                <img src={prasadimg3} alt="Item 3" />
                <div className="cart-item-details">
                  <p>Chappan Bhog</p>
                  <p>₹ 1000</p>
                </div>
              </li>
            </ul>
            <Link to="/cart" className="view-cart-btn">
              View Cart
            </Link>
          </div>
        )}

        {isLoggedIn ? (
          <Profile
            userName={userName}
            userMobile={userMobile}
            balance={balance}
            isPrimeMember={isPrimeMember}
            profileMenuOpen={profileMenuOpen}
            setProfileMenuOpen={setProfileMenuOpen}
            handleLogout={handleLogout}
          />
        ) : (
          <li className="login-button">
            <Link className="btn" onClick={closeMobileMenu}>
              Login
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Header;
