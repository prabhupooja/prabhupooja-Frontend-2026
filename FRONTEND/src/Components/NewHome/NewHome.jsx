import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./NewHome.css";
import { BiBadgeCheck } from "react-icons/bi";
import {
  AiOutlineShoppingCart,
} from "react-icons/ai";
import testimonialImg from "../Assets/customerreview.jpeg";
import testimonialImg1 from "../Assets/customerreview1.jpeg";
import testimonialImg2 from "../Assets/customerreview2.jpeg";
import { HiOutlineCalendarDateRange } from "react-icons/hi2";

import api from "../Axios/api";
import useHomeStore from "../../Store/dataStore/homeStore";
import useAuthStore from "../../Store/UserStore/userAuthStore";
import { getSafeImageUrl } from "../../utils/imageHelper";

import childbirthimg from "../../Components/Assets/27.png";
import marraigeimg from "../../Components/Assets/30.png";
import loanimg from "../../Components/Assets/32.png";
import jobimg from "../../Components/Assets/34.png";
import ganeshBannerHindi from "../Assets/ganesh_banner_hindi.jpg";
import ganeshBannerEnglish from "../Assets/ganesh_banner_english.png";

import {useNavigate } from "react-router-dom";

import CryptoJS from "crypto-js";
import Swal from "sweetalert2";
import useUserCardStore from "../../Store/userCardStore/userCardStore";
import noProductImg from "../Assets/no_product.png";
import Bhagwatkatha from "../UpCommingEvents/NewEvents";
import Events from "../UpCommingEvents/Events";

const defaultBanners = [
  {
    id: "hardcoded-ganesh-hindi",
    image: ganeshBannerHindi,
    title: "प्रकृति के संग गणेश मूर्ति - Eco-Friendly Ganesh Murti",
    link: "/e-commerce",
  },
  {
    id: "hardcoded-ganesh-english",
    image: ganeshBannerEnglish,
    title: "Eco-Friendly Ganesh Murti - Made with Devotion",
    link: "/e-commerce",
  },
];


const faqs = [
  {
    question: "What is Prabhu Pooja?",
    answer:
      "Prabhu Pooja is a ritual performed to offer devotion to deities, seeking blessings for health, prosperity, and peace. At Prabhu Pooja, we make it accessible online.",
  },
  {
    question: "What are various services offered by Prabhu Pooja?",
    answer:
      "Prabhu Pooja offers a wide range of services including Membership, Online Pooja, Prasad Delivery, Astrology, E-commerce, Muhurat, and personalized pooja services tailored to your needs.",
  },
  {
    question: "How can I trust Prabhu Pooja?",
    answer:
      "Prabhu Pooja is committed to delivering authentic rituals conducted by experienced priests, ensuring transparency and customer satisfaction. We have positive reviews and testimonials from our clients.",
  },
  {
    question: "How can I book a Pooja online?",
    answer:
      "You can easily book a Pooja through the Prabhu Pooja website by selecting the Pooja you wish to perform and following the checkout process.",
  },
  {
    question: "What types of Poojas are available?",
    answer:
      "Prabhu Pooja offers a variety of Poojas including Griha Pravesh, Shanti Pooja, Navagraha Pooja, and many more.",
  },
  {
    question: "How long does a Pooja take?",
    answer:
      "The duration of a Pooja varies depending on the type, but most take between 1 to 3 hours.",
  },
  {
    question: "Is there a specific time to perform Pooja?",
    answer:
      "While many Poojas can be performed at any time, certain rituals are best performed during auspicious timings as per the Hindu calendar.",
  },
  {
    question: "What if I have special requests for the Pooja?",
    answer:
      "You can mention any specific requests during the booking process, and our priests will do their best to accommodate them.",
  },
  {
    question: "How do I make payments?",
    answer:
      "We accept various payment methods including credit/debit cards, UPI, and net banking for your convenience.",
  },
];

const testimonials = [
  {
    name: "Sharvan Sharma.",
    role: "Customer",
    image: testimonialImg,
    text: "I recently used Prabhu Puja’s online puja services, and I must say, the experience was truly divine. The process was simple, and the prasad delivery was timely and beautifully packaged.",
  },
  {
    name: "Rajesh Kumar",
    role: "Customer",
    image: testimonialImg1,
    text: "The astrology services offered by Prabhu Puja are incredible. I had a consultation for my career, and the insights were spot-on. The astrologer was knowledgeable and provided me with practical advice.",
  },
  {
    name: "Deepak Singh",
    role: "Customer",
    image: testimonialImg2,
    text: "Prabhu Puja’s services are exceptional! The online puja was done with utmost care, and the pandit was very professional. I felt the positive energy from the ceremony, and it truly helped me in my personal life.",
  },
];
const NewHome = () => {
  const problempoojaData = [
    {
      id: 1,
      name: "Child Birth",
      image: childbirthimg,
      rating: 4.5,
      discount: "-16%",
      problem: "child_birth",
    },
    {
      id: 2,
      name: "Happy Marriage / Relationship",
      image: marraigeimg,
      rating: 4.8,
      discount: "-12%",
      problem: "relationship",
    },
    {
      name: "Relief from Loans",
      image: loanimg,
      rating: 4.7,
      discount: "-15%",
      problem: "loan",
    },
    {
      name: "New Job / Promotion",
      image: jobimg,
      rating: 4.6,
      discount: "-20%",
      problem: "promotion",
    },
  ];
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const [timeLeft, setTimeLeft] = useState({
    days: "000",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });
  const [activeIndex, setActiveIndex] = useState(null);

  const { isLoggin, userGet, user1, setIsLoginPopup } = useAuthStore();
  const { addToCart, getCartItems } = useUserCardStore();

  const [newsletterLoading, setNewsletterLoading] = useState(false);

  const [addCartloading, setAddCartloading] = useState(null);

  const navigate = useNavigate();

  const [quantities, setQuantities] = useState({});

  const {
    getOnlinePuja,
    pujas,
    getBlogs,
    blogs,
    getProducts,
    products,
    getServices,
    services,
    isLoading,
    gettinyblog,
    tinybloglist,
    getAllCouponBanner,
  } = useHomeStore();

  const [coupons, setCoupons] = useState(defaultBanners);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  useEffect(() => {
    if (isLoggin) {
      const fetchUser = async () => {
        try {
          await userGet();
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      };

      fetchUser();
    }
  }, [isLoggin]);

  useEffect(() => {
    if (isLoggin) {
      const fetchUser = async () => {
        try {
          await userGet();
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      };

      fetchUser();
    }
  }, [isLoggin]);

  useEffect(() => {
    const fetchCoupons = async () => {
      setLoading(true);
      try {
        const response = await getAllCouponBanner();
        if (
          response?.data?.success &&
          Array.isArray(response?.data?.data) &&
          response.data.data.length > 0
        ) {
          setCoupons(response.data.data);
        } else {
          setCoupons(defaultBanners);
        }
      } catch (err) {
        setCoupons(defaultBanners);
      } finally {
        setLoading(false);
      }
    };
    fetchCoupons();
  }, []);

  useEffect(() => {
    const targetDate = new Date("2025-12-31T23:59:59").getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance <= 0) {
        clearInterval(timer);
        setTimeLeft({
          days: "000",
          hours: "00",
          minutes: "00",
          seconds: "00",
        });
        return;
      }

      const days = String(
        Math.floor(distance / (1000 * 60 * 60 * 24))
      ).padStart(3, "0");
      const hours = String(
        Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      ).padStart(2, "0");
      const minutes = String(
        Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      ).padStart(2, "0");
      const seconds = String(
        Math.floor((distance % (1000 * 60)) / 1000)
      ).padStart(2, "0");

      setTimeLeft({ days, hours, minutes, seconds });
    };

    const timer = setInterval(updateCountdown, 1000);
    updateCountdown();

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    getOnlinePuja();
    getBlogs();
    getProducts();
    getServices();
    gettinyblog();
  }, []);

  const handleProblemPoojaClick = (problem) => {
    navigate(`/problems/${problem}`);
  };

  const encryptId = (ID) => {
    const encrypted = CryptoJS.AES.encrypt(
      ID.toString(),
      "prabhupooja2024"
    ).toString();
    return encodeURIComponent(encrypted);
  };

  function slugify(text) {
    return (
      text
        .toString()
        .toLowerCase()
        .replace(/\s+/g, "")
        // .replace(/\-/g, "")
        .replace(/\s+/g, "-")
        // .replace(/[^\w\-]+/g, "")
        // .replace(/\-\-+/g, "-")
        .replace(/^-+/, "")
        .replace(/-+$/, "")
    );
  }

  const handlenewsletter = async (email, name) => {
    setNewsletterLoading(true);
    try {
      const response = await api.post("/newsletter/create", {
        email: email,
        name: name,
      });

      if (response.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Subscribed!",
          text: `Thank you for subscribing, ${name}!`,
        });
        setEmail("");
        setName("");
        setNewsletterLoading(false);
      } else {
        Swal.fire({
          icon: "error",
          title: "Subscription Failed",
          text: response.data.message,
        });
        setNewsletterLoading(false);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred. Please try again.",
      });
      setNewsletterLoading(false);
    }
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email && name) {
      handlenewsletter(email, name);
    } else {
      Swal.fire({
        icon: "warning",
        title: "Incomplete Information",
        text: "Please enter a valid email address and name.",
      });
    }
  };

  const handleIncrement = (id) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: (prev[id] || 1) + 1,
    }));
  };

  const handleDecrement = (id) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: prev[id] > 1 ? prev[id] - 1 : 1,
    }));
  };

  const handleAddToCart = async (productId) => {
    setAddCartloading(productId);
      try {
        const quantity = quantities[productId] || 1;
        const response = await addToCart({
          user_id: user1?.id,
          product:productId,
          quantity: quantity,
        });
        getCartItems(user1?.id);
        Swal.fire(
          response.success ? "Success" : "Failed",
          response.success ? "Product added to cart" : "Could not add to cart",
          response.success ? "success" : "error"
        );
      } catch {
        Swal.fire("Error", "Something went wrong", "error");
        setAddCartloading(null);
      } finally {
        setAddCartloading(null);
      }
  };

  return (
    <>
      <div className="hero-section">
        <Swiper
          navigation={true}
          pagination={{ clickable: true }}
          autoplay={{ delay: 4500, disableOnInteraction: false }}
          loop={coupons.length > 1}
          modules={[Navigation, Autoplay, Pagination]}
          className="hero-swiper"
        >
          {coupons.map((slide, index) => {
            const rawImg =
              slide?.image || slide?.bannerImage || slide?.banner || slide?.imageUrl || slide;
            const imgUrl =
              typeof rawImg === "string" &&
              !rawImg.startsWith("http") &&
              !rawImg.startsWith("data:") &&
              !rawImg.startsWith("/")
                ? `${process.env.REACT_APP_BASE_URL || ""}/${rawImg}`
                : rawImg;

            return (
              <SwiperSlide key={slide?.id || `banner-${index}`}>
                <div
                  className="hero-slide"
                  onClick={() => {
                    if (slide?.link) {
                      if (slide.link.startsWith("http")) {
                        window.open(slide.link, "_blank", "noopener,noreferrer");
                      } else {
                        navigate(slide.link);
                      }
                    } else if (slide?.product_id) {
                      navigate(`/product/${slide.product_id}`);
                    }
                  }}
                  style={{
                    cursor:
                      slide?.link || slide?.product_id
                        ? "pointer"
                        : "default",
                  }}
                >
                  <img
                    src={imgUrl}
                    alt={slide?.title || slide?.name || `Banner ${index + 1}`}
                    className="hero-banner-img"
                  />
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
      <Bhagwatkatha/>
      <Events/>
      <div className="fp-section">
        <div className="fp-header">
          <h2>
            Featured <span>Products</span>
          </h2>
          <button
            className="fp-view-all-btn"
            onClick={() => navigate("/e-commerce")}
          >
            View All Products →
          </button>
        </div>
        <p className="fp-subtext">
          Explore our handpicked selection of devotional items crafted for your
          spiritual needs.
        </p>

        <div className="fp-grid">
          {(Array.isArray(products) ? products : []).slice(0, 8).map((product) => (
            <div key={product.id} className="fp-card">
              <span className="fp-discount">{product.discount || `15% OFF`}</span>
              <div
                className="fp-img"
                onClick={() =>
                  navigate(`/productdetails/${encryptId(product.id)}`)
                }
              >
                <img
                  src={getSafeImageUrl(product.image, noProductImg)}
                  alt={product.productName}
                />
              </div>
              <div className="fp-card-content">
                <p className="fp-category">{product.style || "Sacred Pooja Item"}</p>
                <h3 
                  className="fp-title"
                  onClick={() =>
                    navigate(`/productdetails/${encryptId(product.id)}`)
                  }
                >
                  {product.productName.length > 50
                    ? product.productName.slice(0, 50) + "..."
                    : product.productName}
                </h3>
                <div className="fp-price-row">
                  <span className="fp-price">₹{product.offerPrice || product.price}</span>
                  {product.price && product.offerPrice && product.offerPrice !== product.price && (
                    <del className="fp-old-price">₹{product.price}</del>
                  )}
                </div>
                <div className="fp-footer">
                  <div className="fp-quantity">
                    <button type="button" onClick={() => handleDecrement(product.id)}>−</button>
                    <span>{quantities[product.id] || 1}</span>
                    <button type="button" onClick={() => handleIncrement(product.id)}>+</button>
                  </div>
                  <button
                    className="fp-cart-btn"
                    onClick={() => handleAddToCart(product)}
                    disabled={addCartloading === product.id}
                  >
                    {addCartloading === product.id ? (
                      "Adding..."
                    ) : (
                      <>
                        <AiOutlineShoppingCart className="cart-btn-icon" /> Add to Cart
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <section className="fps-section">
        <div className="fps-header">
          <h2>Popular <span>Divine Poojas</span></h2>
          <p>Participate in sacred Vedic rituals conducted by certified priests for health, prosperity, and peace.</p>
        </div>
        {pujas && (
          <div className="fps-grid">
            {pujas.slice(0, 4).map((puja, index) => (
              <div
                key={puja?.id || index}
                className="fps-card"
                style={{
                  backgroundImage: `url(${puja?.image})`,
                }}
                onClick={() =>
                  navigate(
                    `/${slugify(puja?.name || "pooja")}/${encryptId(puja?.id)}`
                  )
                }
              >
                <span className="fps-card-tag">✨ Vedic Pooja</span>
                <div className="fps-overlay">
                  <h3>{puja?.name}</h3>
                  <p>{puja?.shortDescription || "Participate in auspicious rituals for divine blessings and spiritual well-being."}</p>
                  <button
                    className="fps-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(
                        `/${slugify(puja?.name || "pooja")}/${encryptId(puja?.id)}`
                      );
                    }}
                  >
                    Book Pooja Now 🙏
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="newHomePoojasection">
        <div className="pooja-header">
          <h2>
            Best <span>Problems & Pooja</span>
          </h2>
          <p>
            Popularly performed rituals and remedies by our pandits to help you
            solve problems.
          </p>
          <button
            className="view-all-btn"
            onClick={() => navigate("/onlinepooja")}
          >
            View All Poojas →
          </button>
        </div>

        <div className="pooja-layout">
          {/* Static Banner */}
          <div className="pooja-banner-card">
            <div className="banner-image">
              <span className="sale-badge">Sale upto 40% off</span>
              <h3>
                Divine Solutions <br /> for Life’s <br /> Challenges
              </h3>
              <button
                className="shop-now-btn"
                onClick={() => navigate("/onlinepooja")}
              >
                Book Now →
              </button>
            </div>
            <div className="banner-links">
              <div className="link-row" onClick={() => navigate("/onlinepooja")}>
                <span>Online Pooja</span> <span className="arrow">→</span>
              </div>
              <div className="link-row" onClick={() => navigate("/astrology")}>
                <span>Astrology Consultation</span> <span className="arrow">→</span>
              </div>
              <div className="link-row" onClick={() => navigate("/temple")}>
                <span>Temple Darshan</span> <span className="arrow">→</span>
              </div>
            </div>
          </div>

          {/* Swiper */}
          <div className="pooja-swiper-container">
            <Swiper
              spaceBetween={16}
              pagination={{ clickable: true }}
              modules={[Pagination]}
              breakpoints={{
                0: {
                  slidesPerView: 1,
                },
                640: {
                  slidesPerView: 2,
                },
                1081: {
                  slidesPerView: 3,
                },
              }}
            >
              {problempoojaData?.map((item, index) => (
                <SwiperSlide key={index}>
                  <div
                    className="pooja-card"
                    key={item.id}
                    onClick={() => handleProblemPoojaClick(item.problem)}
                  >
                    <div className="discount-badge">{item.discount}</div>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="pooja-img"
                    />
                    <h4 className="pooja-name">{item.name}</h4>
                    <div className="pooja-rating">⭐ {item.rating} Rating</div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>

      <section className="newHomeService">
        <h2 className="section-title">
          Our <span>Services</span>
        </h2>
        <img
          src="https://blesso-store-shop.myshopify.com/cdn/shop/files/product-4_4820d825-93a5-4460-b20d-32953710762b.png?v=1745913827"
          alt="Ganesha"
          className="section-icon"
        />

        <div className="service-grid">
          {services?.map((service, index) => (
            <div
              className="service-card-flip"
              key={service.id || index}
              onClick={() => navigate(`/${slugify(service.name)}`)}
            >
              <div className="service-card-inner">
                {/* Front */}
                <div className="service-card-front">
                  <div className="service-icon-wrapper">
                    <img
                      src={service.image}
                      alt={service.name}
                      className="service-icon"
                    />
                  </div>
                  <p className="service-title">{service.name}</p>
                </div>

                {/* Back (3D Flip) */}
                <div className="service-card-back">
                  <div className="service-back-badge">🕉 Vedic Service</div>
                  <h4 className="service-back-title">{service.name}</h4>
                  <p className="service-back-desc">
                    {service.description ||
                      `Experience authentic and blessed ${service.name} services with Prabhu Pooja.`}
                  </p>
                  <button className="service-back-btn">
                    Explore Service →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="customerExperience">
        <div className="experience-header">
          <h2>
            Best <span>Customer Experience</span>
          </h2>
          <p>
            We make sure our customers enjoy the best shopping experience.
            Always smooth, simple, and stress-free.
          </p>
        </div>

        <div className="experience-grid">
          {[
            {
              title: "Original & Pure",
              description:
                "100% authentic and energised spiritual items directly sourced.",
            },
            {
              title: "Free Fast Shipping",
              description:
                "Safe, tamper-proof and prompt doorstep delivery across India.",
            },
            {
              title: "100% Secure Payment",
              description:
                "Encrypted UPI, Cards and Net Banking checkout protection.",
            },
            {
              title: "Expert Pandits",
              description:
                "Rituals performed by certified Vedic pandits with devotion.",
            },
          ].map((item, index) => (
            <div className="experience-card" key={index}>
              <div className="experience-icon">
                <BiBadgeCheck size={38} color="#ea580c" />
              </div>
              <h4>{item.title}</h4>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="newHomeProduct">
        <div className="product-header">
          <h2>
            Best Seller <span>Products</span>
          </h2>
          <p>
            Discover the products our customers love most. Handpicked for their
            quality, performance, and great value, these best sellers have
            earned their place at the top.
          </p>
        </div>

        <div className="fp-grid">
          {(Array.isArray(products) ? products : []).slice(0, 8).map((product) => (
            <div className="fp-card" key={product.id}>
              <span className="fp-discount">{product.discount || "10% OFF"}</span>
              <div 
                className="fp-img"
                onClick={() =>
                  navigate(`/productdetails/${encryptId(product.id)}`)
                }
              >
                <img
                  src={getSafeImageUrl(product.image, noProductImg)}
                  alt={product.productName}
                />
              </div>
              <div className="fp-card-content">
                <span className="fp-category">{product.style || "Pooja Decor"}</span>
                <h3 
                  className="fp-title"
                  onClick={() =>
                    navigate(`/productdetails/${encryptId(product.id)}`)
                  }
                >
                  {product.productName.length > 50
                    ? product.productName.slice(0, 50) + "..."
                    : product.productName}
                </h3>
                <div className="fp-price-row">
                  <span className="fp-price">₹{product.offerPrice || product.price}</span>
                  {product.price && product.offerPrice && product.offerPrice !== product.price && (
                    <del className="fp-old-price">₹{product.price}</del>
                  )}
                </div>
                <div className="fp-footer">
                  <div className="fp-quantity">
                    <button type="button" onClick={() => handleDecrement(product.id)}>−</button>
                    <span>{quantities[product.id] || 1}</span>
                    <button type="button" onClick={() => handleIncrement(product.id)}>+</button>
                  </div>
                  <button
                    className="fp-cart-btn"
                    onClick={() => handleAddToCart(product)}
                    disabled={addCartloading === product.id}
                  >
                    {addCartloading === product.id ? (
                      "Adding..."
                    ) : (
                      <>
                        <AiOutlineShoppingCart className="cart-btn-icon" /> Add to Cart
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="viewAllButton">
          <button onClick={() => navigate("/e-commerce")}>
            View All Best Sellers →
          </button>
        </div>
      </section>

      <section className="spirituality-section">
        <div className="spirituality-overlay">
          <div className="spirituality-content">
            <p className="spirituality-subheading">
              Embrace Spirituality with{" "}
              <span className="spirituality-highlight">
                Embrace Spirituality with
              </span>
            </p>
            <h1 className="spirituality-heading">
              Explore Our Collection
              <br />
              Wear For Limited Time.
            </h1>
            <div className="spirituality-countdown">
              <div className="spirituality-timer-box">{timeLeft.days}</div>
              <div className="spirituality-timer-box">{timeLeft.hours}</div>
              <div className="spirituality-timer-box">{timeLeft.minutes}</div>
              <div className="spirituality-timer-box">{timeLeft.seconds}</div>
            </div>
            <button
              className="shop-button"
              onClick={() => navigate("/e-commerce")}
            >
              Shop Now
            </button>
          </div>
        </div>
      </section>

      <section className="about-section">
        <div className="about-container">
          <div className="about-image">
            <img src={require("../Assets/aboutusimg.png")} alt="Pooja Setup" />
          </div>
          <div className="about-content">
            <h2>
              <span>About</span> Us
            </h2>
            <p>
              Online Pooja and Astrology Services — In today's digital age, the
              ancient practices of Hindu rituals and astrology have seamlessly
              integrated with technology to offer online Pooja and astrology
              services. These services cater to devotees worldwide, allowing
              them to participate in sacred rituals and seek astrological
              guidance from the comfort of their homes.
            </p>
            <button
              className="read-more-btn"
              onClick={() => navigate("/about")}
            >
              Read More
            </button>
          </div>
        </div>
      </section>

      <section className="newfaq-section">
        <div className="newfaq-left">
          <h2>FAQ’s</h2>
          <p>
            Still unsure? Let us guide you step by step on how Prabhu Pooja
            works and how we serve your spiritual needs.
          </p>
        </div>

        <div className="newfaq-image">
          <img
            src={require("../Assets/faqNewImg.jpeg")}
            alt="Cross on mountain"
          />
        </div>

        <div className="newfaq-right">
          {faqs?.map((data, index) => (
            <div
              key={index}
              className={`newfaq-item ${activeIndex === index ? "active" : ""}`}
              onClick={() => toggleFAQ(index)}
            >
              <div className="newfaq-question">
                {data.question}
                <span className="newfaq-toggle">
                  {activeIndex === index ? "-" : "+"}
                </span>
              </div>
              {activeIndex === index && (
                <div className="newfaq-answer">{data.answer}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="testimonials-section">
        <div className="testimonial-header">
          <h2>
            Our <span className="highlight">Client Say’s</span>
          </h2>
          <p>
            Blessings shared, hearts touched — listen to how Prabhu Pooja made a
            difference in the lives of our devotees.
          </p>
        </div>

        <div className="testimonial-cards">
          {testimonials.map((item, index) => (
            <div className="testimonial-card" key={index}>
              <p className="client-label">Client</p>
              <h3>Testimonials</h3>
              <div className="stars">★★★★★</div>
              <p className="testimonial-text">{item.text}</p>
              <div className="client-info">
                <img src={item.image} alt={item.name} />
                <div>
                  <strong>{item.name}</strong>
                  <p>{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="articles-section">
        <div className="articles-header">
          <h2>
            Latest <span>Articles</span>
          </h2>
          <p>
            Stay connected to your roots with inspiring articles that guide you
            through life’s challenges with divine understanding.
          </p>
        </div>

        <div className="articles-grid">
          {tinybloglist?.slice(0, 3).map((item, index) => (
            <div className="article-card" key={index}>
              <img src={item.image} alt={item.title} />
              <div className="article-content">
                <div className="article-meta">
                  <span>
                    <HiOutlineCalendarDateRange size={20} />{" "}
                    {new Date(item.timestamp).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <span>•Post By {"Prabhu Pooja"}</span>
                </div>
                <h3>{item.title}</h3>
                <p
                  dangerouslySetInnerHTML={{
                    __html:
                      item.pera
                        .replace(/<img[^>]*>/g, "")
                        .replace(/<\/?[^>]+(>|$)/g, "")
                        .split(" ")
                        .slice(0, 15)
                        .join(" ") + " ...",
                  }}
                ></p>
                <a
                  onClick={() =>
                    navigate(
                      `/blog/${item.title.replace(/\s+/g, "-")}/${encryptId(
                        item.id
                      )}`
                    )
                  }
                  className="read-more"
                >
                  Read More →
                </a>
              </div>
            </div>
          ))}
        </div>
        <div className="viewAllButton">
          <button onClick={() => navigate("/blogs")}>View All Blogs</button>
        </div>
      </section>

      <section className="newsletter-container">
        <div className="newsletter-box">
          {/* Left Side - Form */}
          <div className="newsletter-left">
            <h2>Subscribe To Newsletter</h2>
            <p>Subscribe And Receive Exclusive Information And Offers!</p>

            <form className="newsletter-form">
              <label>Name</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  placeholder="Your name…"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <label>Email</label>
              <div className="input-wrapper">
                <input
                  type="email"
                  placeholder="Your email address…"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button onClick={handleSubscribe} disabled={newsletterLoading}>
                  {newsletterLoading ? "..." : "→"}
                </button>
              </div>
            </form>
          </div>

          {/* Right Side - Media */}
          <div className="newsletter-right">
            <div className="brand-header">
              <h3>Prabhu Pooja</h3>
              <div className="social-links">
                <span>Social Media:</span>
                <a
                  href="https://www.instagram.com/prabhupooja.official/"
                  target="_blank"
                >
                  Instagram
                </a>
                <a
                  href="https://www.facebook.com/prabhupooja.official"
                  target="_blank"
                >
                  Facebook
                </a>
                <a href="https://www.youtube.com/@PrabhuPoojaa" target="_blank">
                  Youtube
                </a>
              </div>
            </div>
            <div className="media-images">
              <img src={require("../Assets/astrology-img.jpg")} alt="img1" />
              <img src={require("../Assets/yoga-image.jpg")} alt="img2" />
              <img src={require("../Assets/poojaimg2.jpg")} alt="img3" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
export default NewHome;