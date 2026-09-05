import React, { useEffect, useState } from "react";
import "../styles/home.css";
import Swal from "sweetalert2";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import aboutimg from "../Components/Assets/aboutusimg.png";
import bappaimg from "../Components/Assets/bappa-img1.png";
import { Link, useNavigate } from "react-router-dom";
import api from "./Axios/api";
import childbirthimg from "../Components/Assets/27.png";
import marraigeimg from "../Components/Assets/30.png";
import loanimg from "../Components/Assets/32.png";
import jobimg from "../Components/Assets/34.png";
import customerimg from "../Components/Assets/customerreview.jpeg";
import customerimg1 from "../Components/Assets/customerreview1.jpeg";
import customerimg2 from "../Components/Assets/customerreview2.jpeg";
import CryptoJS from "crypto-js";
import useHomeStore from "../Store/dataStore/homeStore";
import useAuthStore from "../Store/UserStore/userAuthStore";

import mobileimg from "../Components/Assets/Hero-baner-mobail.webp";
import Loader from "../Components/NewLoader/NewLoader";
import ganeshBannerHindi from "../Components/Assets/ganesh_banner_hindi.jpg";
import ganeshBannerEnglish from "../Components/Assets/ganesh_banner_english.png";

const defaultBanners = [
  {
    id: "hardcoded-ganesh-hindi",
    image: ganeshBannerHindi,
    title: "प्रकृति के संग गणेश मूर्ति - Eco-Friendly Ganesh Murti",
  },
  {
    id: "hardcoded-ganesh-english",
    image: ganeshBannerEnglish,
    title: "Eco-Friendly Ganesh Murti - Made with Devotion",
  },
];

const isMobile = window.innerWidth <= 768;

const NextArrow = ({ onClick }) => {
  return (
    <div className="arrow1 next" onClick={onClick}>
      <i className="fas fa-chevron-right"></i>
    </div>
  );
};

const PrevArrow = ({ onClick }) => {
  return (
    <div className="arrow1 prev" onClick={onClick}>
      <i className="fas fa-chevron-left"></i>
    </div>
  );
};
const Home = () => {
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isLoggin, userGet } = useAuthStore();

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
    getOnlinePuja();
    getBlogs();
    getProducts();
    getServices();
    gettinyblog();
  }, []);

  const settings = {
    // dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    // autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const settings1 = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    // autoplay: true,
    autoplaySpeed: 3000,
    // arrows: true,
  };

  const mobileSettings = {
    dots: false,
    arrows: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const problems = [
    {
      id: 1,
      title: "Child Birth",
      image: childbirthimg,
      problem: "child_birth",
    },
    {
      id: 2,
      title: "Happy Marriage / Relationship",
      image: marraigeimg,
      problem: "relationship",
    },
    { id: 3, title: "Relief from Loans", image: loanimg, problem: "loan" },
    {
      id: 4,
      title: "New Job / Promotion",
      image: jobimg,
      problem: "promotion",
    },
    // { id: 5, title: "Removal of Obstacles", image: thinkingimg },
  ];

  const handlenewsletter = async (email, name) => {
    try {
      const response = await api.post("/newsletter/create", {
        email: email,
        name: name,
      });

      // Handle the response from the API
      if (response.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Subscribed!",
          text: `Thank you for subscribing, ${name}!`,
        });
        setEmail("");
        setName("");
      } else {
        console.error("Failed to subscribe:", response.data.message);
        Swal.fire({
          icon: "error",
          title: "Subscription Failed",
          text: response.data.message,
        });
      }
    } catch (error) {
      console.error(
        "Error occurred while subscribing to the newsletter:",
        error
      );
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred. Please try again.",
      });
    }
  };

  const handleSubscribe = () => {
    if (email && name) {
      handlenewsletter(email, name);
      // console.log("Subscribed:", name, email);
    } else {
      Swal.fire({
        icon: "warning",
        title: "Incomplete Information",
        text: "Please enter a valid email address and name.",
      });
    }
  };

  function slugify(text) {
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/\-/g, "")
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "");
  }

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

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const [formData, setFormData] = useState({
    childName: "",
    className: "",
    mobileNumber: "",
    email: "",
    message: "",
  });

  function slugify(text) {
    return text.toString().toLowerCase().replace(/\s+/g, "");
  }

  const handleImageClick = (problemId) => {
    navigate(`/problems/${problemId}`);
  };

  const encryptId = (ID) => {
    const encrypted = CryptoJS.AES.encrypt(
      ID.toString(),
      "prabhupooja2024"
    ).toString();
    return encodeURIComponent(encrypted);
  };

  if(loading) {
    return <Loader/>
  }


  return (
    <>
     
      <div className="carousel-wrapper">
        {isMobile ? (
          <Slider {...mobileSettings}>
            {coupons.map((data, index) => {
              const rawImg = data?.image || data?.bannerImage || data?.banner || data?.imageUrl || data;
              const imgUrl =
                typeof rawImg === "string" &&
                !rawImg.startsWith("http") &&
                !rawImg.startsWith("data:") &&
                !rawImg.startsWith("/")
                  ? `${process.env.REACT_APP_BASE_URL || ""}/${rawImg}`
                  : rawImg;

              return (
                <div
                  key={data?.id || `mobile-banner-${index}`}
                  className="carousel-slide"
                  onClick={() => {
                    if (data?.link) {
                      if (data.link.startsWith("http")) {
                        window.open(data.link, "_blank", "noopener,noreferrer");
                      } else {
                        navigate(data.link);
                      }
                    } else if (data?.product_id) {
                      navigate(`/product/${data.product_id}`);
                    }
                  }}
                  style={{
                    cursor: data?.link || data?.product_id ? "pointer" : "default",
                  }}
                >
                  <img
                    src={imgUrl}
                    alt={data?.title || data?.name || `Slide ${index + 1}`}
                    className="carousel-image"
                  />
                </div>
              );
            })}
          </Slider>
        ) : (
          <Slider {...settings1}>
            {coupons.map((data, index) => {
              const rawImg = data?.image || data?.bannerImage || data?.banner || data?.imageUrl || data;
              const imgUrl =
                typeof rawImg === "string" &&
                !rawImg.startsWith("http") &&
                !rawImg.startsWith("data:") &&
                !rawImg.startsWith("/")
                  ? `${process.env.REACT_APP_BASE_URL || ""}/${rawImg}`
                  : rawImg;

              return (
                <div
                  key={data?.id || `desktop-banner-${index}`}
                  className="carousel-slide"
                  onClick={() => {
                    if (data?.link) {
                      if (data.link.startsWith("http")) {
                        window.open(data.link, "_blank", "noopener,noreferrer");
                      } else {
                        navigate(data.link);
                      }
                    } else if (data?.product_id) {
                      navigate(`/product/${data.product_id}`);
                    }
                  }}
                  style={{
                    cursor: data?.link || data?.product_id ? "pointer" : "default",
                  }}
                >
                  <img
                    src={imgUrl}
                    alt={data?.title || data?.name || `Slide ${index + 1}`}
                    className="carousel-image"
                  />
                </div>
              );
            })}
          </Slider>
        )}
      </div>

      {/* home section end */}

      {/* service section start */}
      <section className="solve-problems-section">
        <div className="container">
          <h1 className="solve-problems-title">Solve Your Problems</h1>
          <div className="problems-grid">
            {problems?.map((problem) => (
              <div
                className="problem-card"
                key={problem.id}
                onClick={() => handleImageClick(problem.problem)}
              >
                <div className="problem-image-container">
                  <img
                    src={problem.image}
                    alt={problem.title}
                    className="problem-image"
                  />
                </div>
                <h3 className="problem-title">{problem.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* service section end */}

      {/* product section start */}
      <section className="featured-pujas-carousel">
        <div className="container">
          <h1 className="section-title-product">Featured Pooja</h1>
          <Slider {...settings}>
            {pujas &&
              pujas.map((puja, index) => {
                const encryptedId = encryptId(puja.id);
                return (
                  <div
                    key={index}
                    className="puja-item"
                    onClick={() =>
                      navigate(`/${slugify(puja.name)}/${encryptedId}`)
                    }
                  >
                    <div className="image-container">
                      <Link to={`/${slugify(puja.name)}/${encryptedId}`}>
                        <img
                          src={puja.image}
                          alt={puja.name}
                          className="puja-image"
                        />
                      </Link>
                    </div>
                    <div className="puja-details">
                      <h3>{puja.name}</h3>
                      <p className="puja_current_price">{puja.price}</p>
                      <p className="puja_final_price">{puja.final_price}</p>
                      <Link
                        className="booknow_btn"
                        to={`/${slugify(puja.name)}/${encryptedId}`}
                      >
                        Book Now
                      </Link>
                    </div>
                  </div>
                );
              })}
          </Slider>
        </div>
      </section>
      {/* product section end */}

      {/* about section start */}
      <div className="about">
        <div className="container">
          <div className="row">
            <div className="col-sm-6">
              <img src={aboutimg} alt="" className="about-img" />
            </div>

            <div className="col-sm-6">
              <div className="homeabout-title">
                <h1>About Us</h1>
                <p>
                  Online Pooja and Astrology Services In today's digital age,
                  the ancient practices of Hindu rituals and astrology have
                  seamlessly integrated with technology to offer online Pooja
                  and astrology services. These services cater to devotees
                  worldwide, allowing them to participate in sacred rituals and
                  seek astrological guidance from the comfort of their homes.
                </p>

                <button className="about-btn">
                  <Link to="/about">Read More</Link>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* about section end */}

      {/* service section start  */}
      <div className="services">
        <div className="services-title">
          <h1>Our Services</h1>
          <div className="bappaimgsection">
            <img src={bappaimg} alt="" className="bappaimg" />
          </div>
        </div>

        {isLoading ? (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "5vh",
                marginTop: "50px",
              }}
            >
              <TailSpin height="50" width="50" color="orange" />
            </div>
            <p className="loading_text">Loading...</p>
          </>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <div className="table-box">
            {services.map((service) => (
              <div
                className="box"
                key={service.id}
                onClick={(e) => {
                  e.currentTarget.classList.toggle("move-up");
                  navigate(`/${slugify(service.name)}`);
                }}
              >
                <Link to={`/${slugify(service.name)}`}>
                  <img src={`${service.image}`} alt={service.name} />
                  <p>{service.name}</p>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* service section end */}

      {/* pooja section start */}
      <section className="featured-pujas-carousel">
        <div className="container">
          <h1 className="section-title-product">Featured Products</h1>
          <Slider {...settings}>
            {products &&
              products?.map((product, index) => {
                const encryptedId = encryptId(product.id);
                return (
                  <div
                    key={index}
                    className="puja-item"
                    onClick={() => navigate(`/productdetails/${encryptedId}`)}
                  >
                    <div className="image-container">
                      <Link to={`/productdetails/${encryptedId}`}>
                        <img
                          src={product.image[0]}
                          alt={product.productName}
                          className="puja-image"
                        />
                      </Link>
                    </div>
                    <div className="puja-details">
                      <Link to={`/productdetails/${product.id}`}>
                        <h6 className="productname">{product.productName}</h6>
                      </Link>
                      <div className="price-btns">
                        <p className="puja_original_price">₹{product.price}</p>
                        <p className="puja_offer_price">
                          ₹{product.offerPrice}
                        </p>
                      </div>

                      <Link
                        className="booknow_btn"
                        to={`/productdetails/${encryptedId}`}
                      >
                        Buy Now
                      </Link>
                    </div>
                  </div>
                );
              })}
          </Slider>
        </div>
      </section>

      {/* blog section start */}
      <div className="blog-section">
        <div className="container">
          <h1>
            Dharmik <span className="highlight">Blogs</span> by Prabhu Pooja
          </h1>
          <p className="subtitle_blog">
            Read more about Hindu stories & rituals{" "}
            <a href="/blogs" className="view-all">
              View All Blogs →
            </a>
          </p>
          <div className="blogs-container">
            {tinybloglist?.slice(0, 3).map((item, index) => (
              <div
                className="blog-card"
                key={index}
                onClick={() => navigate("/blogs")}
              >
                <div className="blog-featured-image">
                  <Link to="/blogs">
                    <img
                      src={item.image}
                      alt="Featured Blog"
                      className="featured-image"
                    />
                  </Link>
                </div>
                <div className="blog-content1">
                  <h3>{item.title}</h3>
                  <div
                    dangerouslySetInnerHTML={{
                      __html:
                        item.pera
                          .replace(/<img[^>]*>/g, "")
                          .replace(/<\/?[^>]+(>|$)/g, "")
                          .split(" ")
                          .slice(0, 8)
                          .join(" ") + " ...",
                    }}
                    className="blogcontent-para"
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* blog section end  */}

      {/* review section start */}
      <div className="customer-section">
        <div className="customer-container">
          <div className="customer-header">
            <h1>
              What Our <span className="highlight">Customer</span> Say About Us
            </h1>
            <p>
              It has survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged. It was
              popularised in the 1960s with the release
            </p>
          </div>
          <div className="customer-cards">
            <div className="customer-card">
              <div className="customer-info">
                <div className="text-info">
                  <h3>Sharvan Sharma</h3>
                  <p>Customer</p>
                </div>
                <img src={customerimg} alt="Customer" className="customer-image" />
              </div>
              <p className="rating">Rating: ⭐⭐⭐⭐⭐</p>
              <p className="review">
                I recently used Prabhu Puja’s online puja services, and I must
                say, the experience was truly divine. The process was simple,
                and the prasad delivery was timely and beautifully packaged.
              </p>
            </div>
            <div className="customer-card">
              <div className="customer-info">
                <div className="text-info">
                  <h3>Rajesh Kumar</h3>
                  <p>Devotee</p>
                </div>
                <img src={customerimg1} alt="Customer" className="customer-image" />
              </div>
              <p className="rating">Rating: ⭐⭐⭐⭐⭐</p>
              <p className="review">
                The astrology services offered by Prabhu Puja are incredible. I
                had a consultation for my career, and the insights were spot-on.
                The astrologer was knowledgeable and provided me with practical
                advice.
              </p>
            </div>
            <div className="customer-card">
              <div className="customer-info">
                <div className="text-info">
                  <h3>Deepak Singh</h3>
                  <p>Client</p>
                </div>
                <img src={customerimg2} alt="Customer" className="customer-image" />
              </div>
              <p className="rating">Rating: ⭐⭐⭐⭐⭐</p>
              <p className="review">
                Prabhu Puja’s services are exceptional! The online puja was done
                with utmost care, and the pandit was very professional. I felt
                the positive energy from the ceremony, and it truly helped me in
                my personal life.
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* review section end */}

      {/* faq section start */}
      <div className="faq-section">
        <div className="container">
          <h1>FAQs</h1>
          <p>Clear your doubts here regarding how things work</p>
          {faqs.map((faq, index) => (
            <div className="faq-item" key={index}>
              <div className="faq-question" onClick={() => toggleFAQ(index)}>
                <h5>{faq.question}</h5>
                <span
                  className={`arrow ${openIndex === index ? "up" : "down"}`}
                >
                  &#9660;
                </span>
              </div>
              {openIndex === index && (
                <div className="faq-answer">{faq.answer}</div>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* faq section end */}

      {/* newsletter start */}
      <div className="why-choose-us-container">
        <div className="why-choose-us-row">
          <div className="content-column">
            <h1 className="why-choose-us-heading">Why Choose Us?</h1>
            <p className="why-choose-us-description">
              Experience the divine with Prabhu Pooja—offering online pujas,
              prasad delivery, astrology guidance, and devotional products to
              bring spiritual harmony into your life.
            </p>
          </div>

          <div className="features-column">
            <div className="feature-item_newsletter">
              <div className="icon-background">
                <i className="fas fa-shield-alt feature-icon_newsletter"></i>
              </div>
              <p>Credibility Since 2001</p>
            </div>
            <div className="feature-item_newsletter">
              <div className="icon-background">
                <i className="fas fa-shipping-fast feature-icon_newsletter"></i>
              </div>
              <p>Fastest Delivery</p>
            </div>
            <div className="feature-item_newsletter">
              <div className="icon-background">
                <i className="fas fa-lightbulb feature-icon_newsletter"></i>
              </div>
              <p>Expert Advice & Consulting</p>
            </div>
          </div>

          <div className="features-column">
            <div className="feature-item_newsletter">
              <div className="icon-background">
                <i className="fas fa-globe feature-icon_newsletter"></i>
              </div>
              <p>Worldwide Distribution</p>
            </div>
            <div className="feature-item_newsletter">
              <div className="icon-background">
                <i className="fas fa-pray feature-icon_newsletter"></i>
              </div>
              <p>Vedik Pooja</p>
            </div>
            <div className="feature-item_newsletter">
              <div className="icon-background">
                <i className="fas fa-star feature-icon_newsletter"></i>
              </div>
              <p>Over 500+ Testimonials</p>
            </div>
          </div>
        </div>

        <div className="newsletter-container">
          <div className="newsletter-text">
            <h3>
              Join Our <br />
              Newsletter
            </h3>
          </div>
          <div className="newsletter-inputs">
            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="newsletter-input"
            />
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="newsletter-input"
            />
            <button onClick={handleSubscribe} className="newsletter-button">
              SUBSCRIBE
            </button>
          </div>
        </div>
      </div>

      {/* newsletter end */}

      <a
        href="https://wa.me/7225016699?text=Namaste"
        target="_blank"
        className="telegram-float"
      >
        <div className="telegram-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="100"
            height="100"
            viewBox="0 0 48 48"
          >
            <path
              fill="#fff"
              d="M4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98c-0.001,0,0,0,0,0h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303z"
            ></path>
            <path
              fill="#fff"
              d="M4.868,43.803c-0.132,0-0.26-0.052-0.355-0.148c-0.125-0.127-0.174-0.312-0.127-0.483l2.639-9.636c-1.636-2.906-2.499-6.206-2.497-9.556C4.532,13.238,13.273,4.5,24.014,4.5c5.21,0.002,10.105,2.031,13.784,5.713c3.679,3.683,5.704,8.577,5.702,13.781c-0.004,10.741-8.746,19.48-19.486,19.48c-3.189-0.001-6.344-0.788-9.144-2.277l-9.875,2.589C4.953,43.798,4.911,43.803,4.868,43.803z"
            ></path>
            <path
              fill="#cfd8dc"
              d="M24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5 M24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974 M24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974 M24.014,4C24.014,4,24.014,4,24.014,4C12.998,4,4.032,12.962,4.027,23.979c-0.001,3.367,0.849,6.685,2.461,9.622l-2.585,9.439c-0.094,0.345,0.002,0.713,0.254,0.967c0.19,0.192,0.447,0.297,0.711,0.297c0.085,0,0.17-0.011,0.254-0.033l9.687-2.54c2.828,1.468,5.998,2.243,9.197,2.244c11.024,0,19.99-8.963,19.995-19.98c0.002-5.339-2.075-10.359-5.848-14.135C34.378,6.083,29.357,4.002,24.014,4L24.014,4z"
            ></path>
            <path
              fill="#40c351"
              d="M35.176,12.832c-2.98-2.982-6.941-4.625-11.157-4.626c-8.704,0-15.783,7.076-15.787,15.774c-0.001,2.981,0.833,5.883,2.413,8.396l0.376,0.597l-1.595,5.821l5.973-1.566l0.577,0.342c2.422,1.438,5.2,2.198,8.032,2.199h0.006c8.698,0,15.777-7.077,15.78-15.776C39.795,19.778,38.156,15.814,35.176,12.832z"
            ></path>
            <path
              fill="#fff"
              fill-rule="evenodd"
              d="M19.268,16.045c-0.355-0.79-0.729-0.806-1.068-0.82c-0.277-0.012-0.593-0.011-0.909-0.011c-0.316,0-0.83,0.119-1.265,0.594c-0.435,0.475-1.661,1.622-1.661,3.956c0,2.334,1.7,4.59,1.937,4.906c0.237,0.316,3.282,5.259,8.104,7.161c4.007,1.58,4.823,1.266,5.693,1.187c0.87-0.079,2.807-1.147,3.202-2.255c0.395-1.108,0.395-2.057,0.277-2.255c-0.119-0.198-0.435-0.316-0.909-0.554s-2.807-1.385-3.242-1.543c-0.435-0.158-0.751-0.237-1.068,0.238c-0.316,0.474-1.225,1.543-1.502,1.859c-0.277,0.317-0.554,0.357-1.028,0.119c-0.474-0.238-2.002-0.738-3.815-2.354c-1.41-1.257-2.362-2.81-2.639-3.285c-0.277-0.474-0.03-0.731,0.208-0.968c0.213-0.213,0.474-0.554,0.712-0.831c0.237-0.277,0.316-0.475,0.474-0.791c0.158-0.317,0.079-0.594-0.04-0.831C20.612,19.329,19.69,16.983,19.268,16.045z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </div>
      </a>
    </>
  );
};

export default Home;
