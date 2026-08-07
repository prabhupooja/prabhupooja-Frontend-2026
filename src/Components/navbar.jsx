import { useEffect, useRef, useState } from "react";
import logo from "../Components/Assets/PRABHU POOJA LOGO1.png";
import mobileLogo from "../Components/Assets/logo_Prabhupooja-removebg.png";

import { Link, useLocation, useNavigate } from "react-router-dom";
import userprofileimg from "../Components/Assets/profileimg.png";
import "../styles/navbar.css";
import useAuthStore from "../Store/UserStore/userAuthStore";
import useUserStore from "../Store/UserStore/userStore";
import useUserCardStore from "../Store/userCardStore/userCardStore";
import useOnlinePujaStore from "../Store/PoojaStore/OnlinePoojaStore";
import useProblemPoojaStore from "../Store/ProblemPoojaStore/ProblemPoojaStore";
import { FaEdit } from "react-icons/fa";
// import GoogleTranslate from "../GoogleTranslate";
import Login from "./login/NewLogin";
import Signup from "./login/Signup";
import OtpPopup from "./otp/Otp";
import useHomeStore from "../Store/dataStore/homeStore";
import CryptoJS from "crypto-js";
import { FaWallet } from "react-icons/fa";
import { IoChatbox } from "react-icons/io5";
import { FaShoppingCart } from "react-icons/fa";
import { MdOutlineSupportAgent } from "react-icons/md";
import { BsCart } from "react-icons/bs";
import { IoRestaurantOutline } from "react-icons/io5";
import { MdTempleHindu } from "react-icons/md";
import { TbYoga } from "react-icons/tb";
import { FaPrayingHands } from "react-icons/fa";
import { IoMdNotifications } from "react-icons/io";
import useNotificationStore from "../Store/notificationStore/notificationStore";
import { HiOutlineMenuAlt1 } from "react-icons/hi";

import moment from "moment";

function Navbar() {
  const menuRef = useRef(null);
  const openMenuBtnRef = useRef(null);
  const closeMenuBtnRef = useRef(null);
  const cartRef = useRef(null);
  const profileMenuRef = useRef(null);
  const location = useLocation();

  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isSecondDropdownOpen, setIsSecondDropdownOpen] = useState(false);
  // const [isThirdDropdownOpen, setIsThirdDropdownOpen] = useState(false);
  const [isFourthDropdownOpen, setIsFourthDropdownOpen] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [cartDropdownOpen, setCartDropdownOpen] = useState(false);
  // const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isNotHome, setIsNotHome] = useState(false);

  const {
    connectSocket,
    disconnectSocket,
    getUserNotifications,
    notifications,
    notificationsCount,
    markNotificationAsRead,
  } = useNotificationStore();

  const navigate = useNavigate();

  const {
    isLoggin,
    user1,
    setIsMember,
    isMember,
    isLoginPopup,
    setIsLoginPopup,
    isOtpPopup,
    setIsOtpPopup,
  } = useAuthStore();

  const {
    userFetchProduct,
    productCount,
    userfetchTempleBookings,
    templeCount,
    userfetchPrasadBooking,
    prasadCount,
    userfetchYogaBooking,
    yogaCount,
    setProductCount,
  } = useUserStore();

  const { getUserPujaBookings } = useOnlinePujaStore();
  const { getBookings } = useProblemPoojaStore();
  const { cartItems, getCartItems } = useUserCardStore();
  const [probemPoojaCount, setProbemPoojaCount] = useState(0);
  const [onlinePoojaCount, setOnlinePoojaCount] = useState(0);
  const [isSingupPopup, setIsSingupPopup] = useState(false);
  const [loginInput, setLoginInput] = useState("");
  const { getOnlinePuja, getServices, services } = useHomeStore();
  const [onlinePoojaName, setOnlinePujaName] = useState([]);
  const [notificationModel, setNotificationModel] = useState(false);

  useEffect(() => {
    if (location.pathname !== "/") {
      setIsNotHome(true);
    } else {
      setIsNotHome(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const token = query.get("token");

    if (token) {
      localStorage.setItem("token", token);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  useEffect(() => {
    if (user1 && user1.id) {
      connectSocket(user1?.id);
    }
    return () => {
      disconnectSocket();
    };
  }, [connectSocket, user1]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const openPopup = () => {
    setIsLoginPopup(true);
    setIsSingupPopup(false);
    setIsOtpPopup(false);
  };

  const closePopup = () => {
    setIsLoginPopup(false);
  };

  const openOtpPopup = () => {
    setIsOtpPopup(true);
    setIsLoginPopup(false);
    setIsSingupPopup(false);
  };

  const closeOtpPopup = () => {
    setIsOtpPopup(false);
  };

  const openSingPopup = () => {
    setIsSingupPopup(true);
    setIsLoginPopup(false);
  };

  const closeSingPopup = () => {
    setIsSingupPopup(false);
  };

  useEffect(() => {
    fetchOnlinePooja();
  }, []);

  const fetchOnlinePooja = async () => {
    const response = await getOnlinePuja();
    if (response.data.success) {
      setOnlinePujaName(response.data.data);
    }
  };

  useEffect(() => {
    if (isLoggin) {
      const handleLoginStatusChange = () => {
        setIsLoginPopup(false);
      };

      window.addEventListener("loginStatusChanged", handleLoginStatusChange);

      return () => {
        window.removeEventListener(
          "loginStatusChanged",
          handleLoginStatusChange
        );
      };
    }
  }, [isLoggin]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target) &&
        (!document.querySelector(".notificationContainer") ||
          !document
            .querySelector(".notificationContainer")
            .contains(event.target)) &&
        (!document.querySelector(".notificationIcon") ||
          !document.querySelector(".notificationIcon").contains(event.target)) // Also check if click is on the notification icon itself
      ) {
        setProfileMenuOpen(false);
        setNotificationModel(false);
      }
    };

    if (profileMenuOpen || notificationModel) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [profileMenuOpen, notificationModel]);

  const handleItemClick = (action) => {
    action();
    setProfileMenuOpen(false);
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
        isMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !openMenuBtnRef.current.contains(event.target) 
      ) {
        setMenuOpen(false);
      }

      if (
        cartDropdownOpen &&
        cartRef.current &&
        !cartRef.current.contains(event.target)
      ) {
        setCartDropdownOpen(false);
      }

      if (
        notificationModel &&
        !document
          .querySelector(".notificationContainer")
          ?.contains(event.target) &&
        !document.querySelector(".notificationIcon")?.contains(event.target)
      ) {
        setNotificationModel(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileMenuOpen, isMenuOpen, notificationModel, cartDropdownOpen]);

  // const handleViewCartClick = () => {
  //   if (!user1) {
  //     Swal.fire({
  //       title: "Login Required",
  //       text: "Please log in to continue.",
  //       icon: "info",
  //       confirmButtonColor: "#3085d6",
  //       confirmButtonText: "OK",
  //     });
  //     setIsCartModalOpen(false);
  //   } else {
  //     navigate("/cart");
  //     setIsCartModalOpen(false);
  //   }
  // };
 
  const handleViewCartClick = () => {
    navigate("/cart");
  };

  const handleProfileToggle = () => {
    setProfileMenuOpen((prev) => !prev);
    if (isMenuOpen) setMenuOpen(false);
    if (cartDropdownOpen) setCartDropdownOpen(false);
    if (notificationModel) setNotificationModel(false);
  };

  const handleDropdownToggle = (e) => {
    e.preventDefault();
    setDropdownOpen((prev) => !prev);
    if (profileMenuOpen) setProfileMenuOpen(false);
    if (cartDropdownOpen) setCartDropdownOpen(false);
    if (notificationModel) setNotificationModel(false);
  };

  const handleSecondDropdownToggle = () =>
    setIsSecondDropdownOpen(!isSecondDropdownOpen);

  // const handleThirdDropdownToggle = () =>
  //   setIsThirdDropdownOpen(!isThirdDropdownOpen);

  const handleFourthDropdownToggle = () =>
    setIsFourthDropdownOpen(!isFourthDropdownOpen);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
    if (profileMenuOpen) setProfileMenuOpen(false);
    if (cartDropdownOpen) setCartDropdownOpen(false);
  };

  const handleLinkClick = () => {
    setDropdownOpen(false);
    setIsSecondDropdownOpen(false);
    // setIsThirdDropdownOpen(false);
    setIsFourthDropdownOpen(false);
    setMenuOpen(false);
  };

  const handleEcommerceBookingClick = () => {
    navigate("/myorders");
    setMenuOpen(false);
  };

  const handlePrasadBookingClick = () => {
    navigate("/prasadbookingpage");
  };

  const handleTempleBookingClick = () => {
    navigate("/templebookingpage");
  };

  const handleYogaBookingClick = () => {
    navigate("/yogabookingpage");
  };

  const handlePoojaBookingClick = () => {
    navigate("/poojabooking");
  };

  const handleEditProfile = () => {
    navigate("/editprofile");
  };

  const handleChatUsers = () => {
    navigate("/chathistorypandits");
  };

  const handleSupport = () => {
    navigate("/support");
  };

  useEffect(() => {
    if (user1) {
      fetchProduct();
      fetchTempleBookings();
      userfetchPrasad();
      fetchYoga();
      fetchOnlinePoojaCount();
      fetchProblemPoojaCount();
      fetchSerives();
    }
  }, [user1]);

  const fetchCartItems = async () => {
    await getCartItems(user1?.id);
  };

  useEffect(() => {
    if (isLoggin && user1) {
      const timer = setTimeout(() => {
        fetchCartItems();
      }, 10);

      return () => clearTimeout(timer);
    }
  }, [isLoggin, user1]);

  const fetchProblemPoojaCount = async () => {
    const response = await getBookings(user1?.id);
    if (response.data.success) {
      setProbemPoojaCount(response.data.data.length);
    } else {
      setProbemPoojaCount(0);
    }
  };

  const fetchOnlinePoojaCount = async () => {
    if (user1) {
      const response = await getUserPujaBookings(user1?.id);
      if (response.data?.success) {
        setOnlinePoojaCount(response.data?.data?.length);
      } else {
        setOnlinePoojaCount(0);
      }
    }
  };

  const fetchProduct = async () => {
    const response = await userFetchProduct(user1?.id);
    // console.log(response, "lllllll");
    if (response.success) {
      setProductCount(response.data.orderCount);
    }
  };

  const fetchTempleBookings = async () => {
    await userfetchTempleBookings(user1?.id);
  };

  const userfetchPrasad = async () => {
    await userfetchPrasadBooking(user1?.id);
  };

  const fetchYoga = async () => {
    await userfetchYogaBooking(user1?.id);
  };

  const handleBalanceClick = () => {
    navigate("/recharge");
  };

  useEffect(() => {
    if (user1) {
      if (user1.member === 1) {
        setIsMember(true);
      } else {
        setIsMember(false);
      }
    }
  }, [user1]);

  useEffect(() => {
    if (user1 && user1.id) {
      const fetchNotification = async () => {
        await getUserNotifications(user1?.id);
      };
      fetchNotification();
    }
  }, [user1]);

  const formatURL = (str) => str.toLowerCase().replace(/\s+/g, "");
  const encryptId = (blogId) => {
    const encrypted = CryptoJS.AES.encrypt(
      blogId.toString(),
      "prabhupooja2024"
    ).toString();
    return encodeURIComponent(encrypted);
  };

  const fetchSerives = async () => {
    await getServices();
  };

  const toggleNotificaton = () => {
    setNotificationModel(!notificationModel);
  };

  const handleIsReadNotification = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
      await getUserNotifications(user1?.id);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  return (
    <div
       className={`header_section 
        ${isMenuOpen ? "menu-open" : ""} 
        ${scrolled ? "scrolled" : ""} 
        ${isNotHome ? "not-home" : ""}`}
    >
      <div className="container">
        <div className="logo">
          <Link to="/">
            <img src={mobileLogo} alt="Logo" />
            <span className="logoName">
              <strong>Prabhu Pooja</strong>
            </span>
          </Link>
        </div>

        <div className="mobileLogo">
          <Link to="/">
            <img src={mobileLogo} alt="Logo" />
          </Link>
        </div>
        <div className={`menu ${isMenuOpen ? "open" : ""}`} ref={menuRef}>
          <div className="head">
            <div className="logo">
              <Link to="/">
                <img src={logo} alt="Logo" />
              </Link>
            </div>
            <button
              type="button"
              className="close-menu-btn"
              ref={closeMenuBtnRef}
              onClick={toggleMenu}
            ></button>
          </div>
          <ul>
            {!isLoggin && (
              <li>
                <button className="login-btn-mobile" onClick={openPopup}>
                  Login
                </button>
              </li>
            )}
            <li>
              <Link to="/" onClick={handleLinkClick}>
                Home
              </Link>
            </li>

            <li className={`dropdown ${isDropdownOpen ? "active" : ""}`}>
              <Link to="/onlinepooja" onClick={handleDropdownToggle}>
                Services
              </Link>
              <i
                className="fa-solid fa-chevron-down"
                onClick={handleDropdownToggle}
              ></i>

              <ul className={`sub-menu ${isDropdownOpen ? "active" : ""}`}>
                {services.map((service, index) => {
                  const path = `/${service.name
                    .toLowerCase()
                    .replace(/\s+/g, "")}`;
                  return (
                    <li key={index}>
                      <Link to={path} onClick={handleLinkClick}>
                        <span>{service.name}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>

            <li className={`dropdown ${isSecondDropdownOpen ? "active" : ""}`}>
              <Link to="/onlinepooja" onClick={handleSecondDropdownToggle}>
                Online Pooja
              </Link>
              <i
                className="fa-solid fa-chevron-down"
                onClick={handleSecondDropdownToggle}
              ></i>
              <ul
                className={`sub-menu ${isSecondDropdownOpen ? "active" : ""}`}
              >
                {onlinePoojaName &&
                  onlinePoojaName?.map((pooja) => {
                    const encryptedId = encryptId(pooja.id);
                    return (
                      <li key={pooja.id}>
                        <Link
                          to={`/${formatURL(pooja.name)}/${encryptedId}`}
                          onClick={handleLinkClick}
                        >
                          <span>{pooja.name}</span>
                        </Link>
                      </li>
                    );
                  })}
              </ul>
            </li>

            <li>
              <Link to="/blogs" onClick={handleLinkClick}>
                Blog
              </Link>
            </li>

            <li className={`dropdown ${isFourthDropdownOpen ? "active" : ""}`}>
              <Link to="/ourteam" onClick={handleFourthDropdownToggle}>
                Brand Info
              </Link>
              <i
                className="fa-solid fa-chevron-down"
                onClick={handleFourthDropdownToggle}
              ></i>
              <ul
                className={`sub-menu ${isFourthDropdownOpen ? "active" : ""}`}
              >
                <li>
                  <Link to="/ourteam" onClick={handleLinkClick}>
                    <span>Our Team</span>
                  </Link>
                </li>
                <li>
                  <Link to="/about" onClick={handleLinkClick}>
                    <span>About Us</span>
                  </Link>
                </li>
                <li>
                  <Link to="/enquiryform" onClick={handleLinkClick}>
                    <span>Contact Us</span>
                  </Link>
                </li>
                <li>
                  <Link to="/testimonial" onClick={handleLinkClick}>
                    <span>Testimonial</span>
                  </Link>
                </li>
                <li>
                  <Link to="/faq" onClick={handleLinkClick}>
                    <span>FAQ</span>
                  </Link>
                </li>
                <li>
                  <Link to="/disclaimer" onClick={handleLinkClick}>
                    <span>Disclaimer</span>
                  </Link>
                </li>
                <li>
                  <Link to="/" onClick={handleLinkClick}>
                    <span>Events</span>
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>

        <div className="header-right">
          <button
            type="button"
            className="icon-btn"
            onClick={()=>handleViewCartClick()}
          >
            <i className="fa-solid fa-cart-plus"></i>
            {cartItems?.length > 0 && (
              <span className="cart-item-count">{cartItems.length}</span>
            )}
          </button>

          {isLoggin && (
            <span className="notificationIcon" onClick={toggleNotificaton}>
              <span className="notificationUnreadCount">
                {notificationsCount}
              </span>
              <IoMdNotifications size={26} />
            </span>
          )}
          {notificationModel && (
            <div className="notificationContainer">
              <h4>Notifications</h4>
              <div className="notificationMessages">
                {notifications?.length === 0 ? (
                  <div className="notificationItem">
                    You're all caught up! No new notifications.
                  </div>
                ) : (
                  notifications.map((item, index) => (
                    <div
                      key={index}
                      className="notificationItem"
                      onClick={() => handleIsReadNotification(item.id)}
                    >
                      <div className="notificationItem1">
                        <p>
                          <strong>{item.title}:</strong> {item.message}
                        </p>
                        <span>{moment(item.time).fromNow()}</span>
                      </div>
                      {item.isUnread === 1 && (
                        <span className="newNotify">new</span>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {isLoggin ? (
            <div className="profile-menu" ref={profileMenuRef}>
              <img
                src={user1?.image || userprofileimg}
                alt="User"
                className="userimg"
                onClick={handleProfileToggle}
              />
              {profileMenuOpen && (
                <div className="profile-dropdown">
                  <img
                    src={user1?.image || userprofileimg}
                    alt="User"
                    className="userimg1"
                    onClick={handleProfileToggle}
                  />
                  <p className="user-name">
                    {user1.name}{" "}
                    {isMember && (
                      <span style={{ fontSize: "14px", marginTop: "2px" }}>
                        💎
                      </span>
                    )}
                    <FaEdit
                      className="edit_icon"
                      onClick={() => handleItemClick(handleEditProfile)}
                    />
                  </p>
                  <p className="user-mobile">{user1?.mobile}</p>

                  <div className="separator"></div>
                  <p
                    className="user-balance"
                    onClick={() => handleItemClick(handleBalanceClick)}
                  >
                    <FaWallet className="HomeAllIcon" />
                    Wallet balance: ₹ {user1?.balance}
                  </p>
                  <p className="ChatHistory" onClick={() => handleChatUsers()}>
                    <IoChatbox className="HomeAllIcon" /> Chat History
                  </p>
                  <div className="myorderssubmenus">
                    <div className="my-orders-wrapper">
                      <p className="my-orders-title">
                        <FaShoppingCart className="HomeAllIcon" />
                        My Orders
                      </p>

                      <div className="orders-dropdown">
                        <p
                          className="user-booking"
                          onClick={() =>
                            handleItemClick(handleEcommerceBookingClick)
                          }
                        >
                          <BsCart className="HomeAllIcon" />
                          Orders: <span>{productCount}</span>
                        </p>
                        <p
                          className="user-booking"
                          onClick={() =>
                            handleItemClick(handlePrasadBookingClick)
                          }
                        >
                          <IoRestaurantOutline className="HomeAllIcon" /> Prasad
                          Booking: <span>{prasadCount}</span>
                        </p>
                        <p
                          className="user-booking"
                          onClick={() =>
                            handleItemClick(handleTempleBookingClick)
                          }
                        >
                          <MdTempleHindu className="HomeAllIcon" /> Temple
                          Booking: <span>{templeCount}</span>
                        </p>
                        <p
                          className="user-booking"
                          onClick={() =>
                            handleItemClick(handleYogaBookingClick)
                          }
                        >
                          <TbYoga className="HomeAllIcon" /> Yoga Booking:{" "}
                          <span>{yogaCount}</span>
                        </p>
                        <p
                          className="user-booking"
                          onClick={() =>
                            handleItemClick(handlePoojaBookingClick)
                          }
                        >
                          <FaPrayingHands className="HomeAllIcon" /> Pooja
                          Booking:
                          <span>
                            {probemPoojaCount + onlinePoojaCount || 0}
                          </span>
                        </p>
                      </div>
                    </div>
                    <p className="supportbtn" onClick={handleSupport}>
                      <MdOutlineSupportAgent className="HomeAllsupportIcon" />
                      Support
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <button className="login-btn" onClick={openPopup}>
                Login
              </button>
            </>
          )}

          {!isLoggin && (
            <Link
              to="https://play.google.com/store/apps/details?id=com.prabhupooja"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="download-btn">Get App</button>
            </Link>
          )}

          {/* <GoogleTranslate /> */}

          <button
            type="button"
            className="open-menu-btn"
            ref={openMenuBtnRef}
            onClick={toggleMenu}
          >
            <HiOutlineMenuAlt1 size={25} />
          </button>
        </div>
      </div>

      {isLoginPopup && (
        <Login
          onCloseLogin={closePopup}
          onOpenOtp={openOtpPopup}
          setLoginInput={setLoginInput}
          onOpenSignup={openSingPopup}
        />
      )}
      {isOtpPopup && (
        <OtpPopup closeOtpPopup={closeOtpPopup} inputOTP={loginInput} />
      )}

      {isSingupPopup && (
        <Signup closeSingClose={closeSingPopup} onOpenLogin={openPopup} />
      )}
    </div>
  );
}

export default Navbar;