import React, { useEffect, useState, useRef } from "react";
import "../../styles/productdetail.css";
import { Link, useParams, useNavigate } from "react-router-dom";
import api from "../Axios/api";
import { TailSpin } from "react-loader-spinner";
import useAuthStore from "../../Store/UserStore/userAuthStore";
import CryptoJS from "crypto-js";
import Swal from "sweetalert2";
import {
  FaShoppingCart,
  FaStar,
  FaRegStar,
  FaStarHalfAlt,
  FaTruck,
  FaShieldAlt,
  FaUndo,
  FaCheck,
  FaBolt,
  FaExpand,
  FaChevronLeft,
  FaChevronRight,
  FaTag,
} from "react-icons/fa";
import { MdVerified, MdOutlineSecurity } from "react-icons/md";
import useUserCardStore from "../../Store/userCardStore/userCardStore";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";

// 🛡️ Helper: Parse array of images safely from any format
export const parseAllImages = (imgData) => {
  const fallback = [
    "https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?auto=format&fit=crop&w=600&q=80",
  ];
  if (!imgData) return fallback;

  const normalizeUrl = (img) => {
    if (!img || typeof img !== "string") return "";
    const clean = img.trim().replace(/^["'[\]]+|["'[\]]+$/g, "");
    if (!clean) return "";
    if (clean.startsWith("http://") || clean.startsWith("https://") || clean.startsWith("data:")) {
      return clean;
    }
    const backendBase = process.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_BASE_URL || "";
    if (clean.startsWith("/")) return `${backendBase}${clean}`;
    return `${backendBase}/uploads/${clean}`;
  };

  if (Array.isArray(imgData)) {
    const cleaned = imgData.map(normalizeUrl).filter(Boolean);
    return cleaned.length > 0 ? cleaned : fallback;
  }

  if (typeof imgData === "string") {
    const trimmed = imgData.trim();
    if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          const cleaned = parsed.map(normalizeUrl).filter(Boolean);
          if (cleaned.length > 0) return cleaned;
        }
      } catch (e) {
        // continue
      }
    }
    if (trimmed.includes(",")) {
      const parts = trimmed
        .split(",")
        .map(normalizeUrl)
        .filter(Boolean);
      if (parts.length > 0) return parts;
    }
    const clean = normalizeUrl(trimmed);
    return clean ? [clean] : fallback;
  }

  return fallback;
};

const Productdetails = () => {
  const { productId } = useParams();
  const [productData, setProductData] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);
  const { addToCart, getCartItems } = useUserCardStore();
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState("");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [allImages, setAllImages] = useState([]);
  const [isHovered, setIsHovered] = useState(false);

  const { user1 } = useAuthStore();
  const navigate = useNavigate();

  const mainImageRef = useRef(null);
  const autoRotateTimerRef = useRef(null);

  // Lightbox State
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxImages, setLightboxImages] = useState([]);

  // Tabs State
  const [selectedTab, setSelectedTab] = useState("description");
  const [reviews, setReviews] = useState([]);

  // Decrypt ID helper
  const decryptId = (encryptedIdFromUrl) => {
    try {
      const decodedId = decodeURIComponent(encryptedIdFromUrl);
      const bytes = CryptoJS.AES.decrypt(decodedId, "prabhupooja2024");
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch {
      return encryptedIdFromUrl;
    }
  };

  const encryptId = (id) => {
    const encrypted = CryptoJS.AES.encrypt(
      id.toString(),
      "prabhupooja2024"
    ).toString();
    return encodeURIComponent(encrypted);
  };

  // Fetch product data
  const fetchProductData = async () => {
    setLoading(true);
    try {
      const resolvedId = decryptId(productId);
      const res = await api.get(`/products/get/${resolvedId}`);
      const raw = res.data?.data ?? res.data;
      const item = Array.isArray(raw) ? raw[0] : raw;
      if (item && (item.id || item.productName)) {
        const parsedImgs = parseAllImages(item.image);
        setProductData({ ...item, image: parsedImgs });
        setAllImages(parsedImgs);
        setMainImage(parsedImgs[0] || "");
        setActiveImageIndex(0);
      } else {
        setProductData(null);
      }
    } catch (err) {
      console.error("Error fetching product data:", err);
      setProductData(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async () => {
    try {
      const resolvedId = decryptId(productId);
      const res = await api.get(`/products/reletedProduct/${resolvedId}`);
      if (res.data?.data) {
        setRelatedProducts(res.data.data);
      }
    } catch (err) {
      console.warn("Could not fetch related products:", err);
    }
  };

  const fetchReviews = async () => {
    try {
      const resolvedId = decryptId(productId);
      const res = await api.get(`/products/getReview/${resolvedId}`);
      if (res.data?.data) {
        setReviews(res.data.data);
      }
    } catch (err) {
      console.warn("Could not fetch reviews:", err);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchProductData();
      fetchRelatedProducts();
      fetchReviews();
      window.scrollTo(0, 0);
    }
  }, [productId]);

  // 🔄 Auto Rotate Main Image Every 4 Seconds (Pauses when user hovers or interacts)
  useEffect(() => {
    if (allImages.length > 1 && !isHovered) {
      autoRotateTimerRef.current = setInterval(() => {
        setActiveImageIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % allImages.length;
          setMainImage(allImages[nextIndex]);
          return nextIndex;
        });
      }, 4000);
    }

    return () => {
      if (autoRotateTimerRef.current) {
        clearInterval(autoRotateTimerRef.current);
      }
    };
  }, [allImages, isHovered]);

  const handleSelectThumbnail = (img, index) => {
    setMainImage(img);
    setActiveImageIndex(index);
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    if (allImages.length <= 1) return;
    const nextIndex = (activeImageIndex + 1) % allImages.length;
    setActiveImageIndex(nextIndex);
    setMainImage(allImages[nextIndex]);
  };

  const handlePrevImage = (e) => {
    e.stopPropagation();
    if (allImages.length <= 1) return;
    const prevIndex =
      (activeImageIndex - 1 + allImages.length) % allImages.length;
    setActiveImageIndex(prevIndex);
    setMainImage(allImages[prevIndex]);
  };

  // 🔍 Smooth Cursor Zoom Lens
  const handleMouseMove = (e) => {
    const image = mainImageRef.current;
    if (!image) return;
    const rect = image.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    image.style.transformOrigin = `${x}% ${y}%`;
    image.style.transform = "scale(2)";
    image.style.transition = "transform 0.15s ease-out";
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    const image = mainImageRef.current;
    if (image) {
      image.style.transform = "scale(1)";
      image.style.transformOrigin = "center center";
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  // Open Fullscreen Lightbox
  const openLightbox = (imgArray, index = 0) => {
    setLightboxImages(imgArray);
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  // Quantity Stepper
  const handleIncrement = () => {
    setQuantity((prev) => Math.min(prev + 1, productData.noOfItems || 10));
  };

  const handleDecrement = () => {
    setQuantity((prev) => Math.max(prev - 1, 1));
  };

  // Calculations
  const originalPrice = Number(productData?.price) || 0;
  const offerPrice = Number(productData?.offerPrice) || originalPrice;
  const hasDiscount = originalPrice > offerPrice && offerPrice > 0;
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - offerPrice) / originalPrice) * 100)
    : 0;
  const totalSubtotal = quantity * offerPrice;
  const isStockAvailable = (productData?.noOfItems ?? 1) > 0;

  // Add To Cart
  const handleAddToCart = async () => {
    if (!productData?.id) return;
    setAddingToCart(true);
    try {
      const response = await addToCart({
        user_id: user1?.id,
        product: productData,
        quantity: quantity,
      });
      getCartItems(user1?.id);
      Swal.fire({
        icon: response.success ? "success" : "error",
        title: response.success ? "Sacred Item Added!" : "Could Not Add",
        text: response.success
          ? `${quantity}x "${productData.productName}" added to your cart.`
          : "Please try again.",
        confirmButtonColor: "#ea580c",
      });
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong while adding to cart.",
        confirmButtonColor: "#ea580c",
      });
    } finally {
      setAddingToCart(false);
    }
  };

  // Buy Now
  const handleBuyNow = () => {
    if (!productData?.id) return;
    navigate("/checkout", {
      state: {
        productId: decryptId(productId),
        quantity,
        totalPrice: totalSubtotal,
        user: user1 || null,
        booking: "normal",
        images: allImages[0],
        marchentId: productData?.merchantId,
        productName: productData?.productName,
      },
    });
  };

  if (loading) {
    return (
      <div className="product-detail-loader-wrap">
        <TailSpin height="60" width="60" color="#ea580c" />
        <p>Invoking Sacred Product Details...</p>
      </div>
    );
  }

  if (!productData || !productData.productName) {
    return (
      <div className="pdetail-page-wrapper" style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <h2 style={{ fontSize: "2rem", color: "#1f2937", marginBottom: "12px" }}>Product Not Found</h2>
          <p style={{ color: "#6b7280", marginBottom: "24px" }}>The spiritual item you are looking for is currently unavailable or has been removed.</p>
          <button 
            onClick={() => navigate("/e-commerce")}
            style={{
              padding: "12px 28px",
              background: "linear-gradient(135deg, #ea580c, #c2410c)",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontWeight: 600,
              cursor: "pointer"
            }}
          >
            ← Explore Spiritual Store
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pdetail-page-wrapper">
      {/* 🧭 Breadcrumbs */}
      <div className="pdetail-breadcrumb-bar">
        <div className="pdetail-container">
          <div className="pdetail-crumbs">
            <Link to="/">Home</Link>
            <span className="crumb-sep">/</span>
            <Link to="/e-commerce">Spiritual Store</Link>
            <span className="crumb-sep">/</span>
            <span className="crumb-active">{productData.productName}</span>
          </div>
        </div>
      </div>

      <div className="pdetail-container">
        {/* 🛍️ MAIN PRODUCT HERO GRID */}
        <div className="pdetail-hero-grid">
          {/* 🖼️ LEFT: IMAGE GALLERY WITH AUTO-ROTATE & HOVER ZOOM */}
          <div className="pdetail-gallery-col">
            <div
              className="pdetail-main-img-box"
              onMouseEnter={handleMouseEnter}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onClick={() => openLightbox(allImages, activeImageIndex)}
            >
              <img
                src={mainImage}
                alt={productData.productName}
                ref={mainImageRef}
                className="pdetail-main-img"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?auto=format&fit=crop&w=600&q=80";
                }}
              />

              {/* Badges Overlay */}
              <div className="gallery-badges-overlay">
                {hasDiscount && (
                  <span className="gallery-discount-badge">
                    {discountPercent}% OFF
                  </span>
                )}
                <span className="gallery-sanctified-badge">
                  <MdVerified /> Consecrated
                </span>
              </div>

              {/* Fullscreen Expand Icon */}
              <button
                className="gallery-expand-btn"
                title="View Fullscreen"
                onClick={(e) => {
                  e.stopPropagation();
                  openLightbox(allImages, activeImageIndex);
                }}
              >
                <FaExpand />
              </button>

              {/* Previous / Next Arrow Controls */}
              {allImages.length > 1 && (
                <>
                  <button
                    className="gallery-arrow-btn left-arrow"
                    onClick={handlePrevImage}
                    aria-label="Previous Image"
                  >
                    <FaChevronLeft />
                  </button>
                  <button
                    className="gallery-arrow-btn right-arrow"
                    onClick={handleNextImage}
                    aria-label="Next Image"
                  >
                    <FaChevronRight />
                  </button>
                </>
              )}
            </div>

            {/* 📸 Thumbnails Strip (No ugly scrollbars) */}
            {allImages.length > 1 && (
              <div className="pdetail-thumbnails-row">
                {allImages.map((thumb, idx) => (
                  <div
                    key={idx}
                    className={`pdetail-thumb-item ${
                      idx === activeImageIndex ? "active" : ""
                    }`}
                    onClick={() => handleSelectThumbnail(thumb, idx)}
                  >
                    <img src={thumb} alt={`View ${idx + 1}`} />
                  </div>
                ))}
              </div>
            )}

            {/* Trust Assurance Bar */}
            <div className="gallery-assurance-bar">
              <div className="assurance-item">
                <FaShieldAlt className="assurance-icon" />
                <span>100% Authentic</span>
              </div>
              <div className="assurance-item">
                <FaTruck className="assurance-icon" />
                <span>Express Shipping</span>
              </div>
              <div className="assurance-item">
                <FaUndo className="assurance-icon" />
                <span>Easy Returns</span>
              </div>
            </div>
          </div>

          {/* 📋 RIGHT: PRODUCT INFO, SPECS & PURCHASE ACTIONS */}
          <div className="pdetail-info-col">
            {/* Category / Collection Tag */}
            <span className="pdetail-category-tag">
              <FaTag /> {productData.style || productData.theme || productData.category || "Sacred Idols & Divine Artifacts"}
            </span>

            {/* Title */}
            <h1 className="pdetail-product-title">{productData.productName}</h1>

            {/* Ratings & Stock Status Row */}
            <div className="pdetail-rating-stock-row">
              <div className="pdetail-rating-stars">
                {Array.from({ length: 5 }, (_, i) => {
                  const rating = productData.average_rating || 4.8;
                  if (i < Math.floor(rating)) {
                    return <FaStar key={i} className="star-icon filled" />;
                  } else if (i < rating) {
                    return (
                      <FaStarHalfAlt key={i} className="star-icon half" />
                    );
                  } else {
                    return <FaRegStar key={i} className="star-icon" />;
                  }
                })}
                <span className="rating-score">
                  {productData.average_rating
                    ? parseFloat(productData.average_rating).toFixed(1)
                    : "4.8"}
                </span>
                <span className="rating-count">
                  ({reviews.length > 0 ? reviews.length : 14} Reviews)
                </span>
              </div>

              <div
                className={`stock-pill ${
                  isStockAvailable ? "in-stock" : "out-of-stock"
                }`}
              >
                <span className="stock-dot" />
                {isStockAvailable ? "In Stock • Ready to Dispatch" : "Out of Stock"}
              </div>
            </div>

            {/* Price Box */}
            <div className="pdetail-price-card">
              <div className="price-main-line">
                <span className="price-offer">
                  ₹{offerPrice.toLocaleString("en-IN")}
                </span>
                {hasDiscount && (
                  <span className="price-original">
                    ₹{originalPrice.toLocaleString("en-IN")}
                  </span>
                )}
                {hasDiscount && (
                  <span className="price-savings-pill">
                    Save ₹{(originalPrice - offerPrice).toLocaleString("en-IN")} ({discountPercent}% OFF)
                  </span>
                )}
              </div>
              <p className="price-tax-note">Inclusive of all Vedic rituals and taxes</p>
            </div>

            {/* Key Specifications Grid */}
            <div className="pdetail-specs-card">
              <h3 className="specs-card-title">Sacred Specifications</h3>
              <div className="specs-grid">
                {productData.material && (
                  <div className="spec-item">
                    <span className="spec-label">Material:</span>
                    <span className="spec-val">{productData.material}</span>
                  </div>
                )}
                {productData.colour && (
                  <div className="spec-item">
                    <span className="spec-label">Colour:</span>
                    <span className="spec-val">{productData.colour}</span>
                  </div>
                )}
                {productData.theme && (
                  <div className="spec-item">
                    <span className="spec-label">Theme:</span>
                    <span className="spec-val">{productData.theme}</span>
                  </div>
                )}
                {productData.style && (
                  <div className="spec-item">
                    <span className="spec-label">Style:</span>
                    <span className="spec-val">{productData.style}</span>
                  </div>
                )}
                {productData.specialFeature && (
                  <div className="spec-item">
                    <span className="spec-label">Special Feature:</span>
                    <span className="spec-val">{productData.specialFeature}</span>
                  </div>
                )}
                {productData.brand && (
                  <div className="spec-item">
                    <span className="spec-label">Brand:</span>
                    <span className="spec-val">{productData.brand}</span>
                  </div>
                )}
                {productData.Height && (
                  <div className="spec-item">
                    <span className="spec-label">Height:</span>
                    <span className="spec-val">{productData.Height}</span>
                  </div>
                )}
                {productData.Dimension && (
                  <div className="spec-item">
                    <span className="spec-label">Base Dimension:</span>
                    <span className="spec-val">{productData.Dimension}</span>
                  </div>
                )}
                {productData.Weight && (
                  <div className="spec-item">
                    <span className="spec-label">Weight:</span>
                    <span className="spec-val">{productData.Weight}</span>
                  </div>
                )}
                {productData.ProductCode && (
                  <div className="spec-item">
                    <span className="spec-label">Product Code:</span>
                    <span className="spec-val code-val">
                      {productData.ProductCode}
                    </span>
                  </div>
                )}
                <div className="spec-item">
                  <span className="spec-label">Energization:</span>
                  <span className="spec-val highlight-val">
                    Prana Pratishtha Blessed
                  </span>
                </div>
              </div>
            </div>

            {/* Quantity Selector & CTAs */}
            <div className="pdetail-purchase-section">
              <div className="quantity-and-total-row">
                <div className="pdetail-qty-stepper">
                  <button
                    onClick={handleDecrement}
                    disabled={quantity <= 1}
                    className="qty-btn"
                  >
                    -
                  </button>
                  <span className="qty-value">{quantity}</span>
                  <button
                    onClick={handleIncrement}
                    disabled={!isStockAvailable}
                    className="qty-btn"
                  >
                    +
                  </button>
                </div>

                <div className="subtotal-display">
                  <span className="subtotal-label">Subtotal:</span>
                  <span className="subtotal-amount">
                    ₹{totalSubtotal.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pdetail-action-btns-row">
                <button
                  className="pdetail-addcart-btn"
                  onClick={handleAddToCart}
                  disabled={addingToCart || !isStockAvailable}
                >
                  {addingToCart ? (
                    <>
                      <TailSpin height="18" width="18" color="#ea580c" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <FaShoppingCart /> Add to Cart
                    </>
                  )}
                </button>

                <button
                  className="pdetail-buynow-btn"
                  onClick={handleBuyNow}
                  disabled={!isStockAvailable}
                >
                  <FaBolt /> Buy Now
                </button>
              </div>
            </div>

            {/* Sacred Guarantee Box */}
            <div className="pdetail-guarantee-box">
              <MdOutlineSecurity className="guarantee-icon" />
              <div>
                <h4>PrabhuPooja Devotional Promise</h4>
                <p>
                  Every idol and sacred item is cleansed with sacred Gangajal and
                  sanctified with authentic Vedic mantras prior to dispatch.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 📑 TABS: DESCRIPTION, HIGHLIGHTS, BENEFITS, REVIEWS */}
        <div className="pdetail-tabs-section">
          <div className="pdetail-tabs-header">
            <button
              className={`pdetail-tab-btn ${
                selectedTab === "description" ? "active" : ""
              }`}
              onClick={() => setSelectedTab("description")}
            >
              Description & Highlights
            </button>
            <button
              className={`pdetail-tab-btn ${
                selectedTab === "reviews" ? "active" : ""
              }`}
              onClick={() => setSelectedTab("reviews")}
            >
              Customer Reviews ({reviews.length})
            </button>
          </div>

          <div className="pdetail-tab-content">
            {/* Description Tab */}
            {selectedTab === "description" && (
              <div className="tab-description-pane">
                {/* Main description paragraph */}
                {productData.description && (
                  <div className="desc-section-block">
                    <h3 className="section-block-title">About This Sacred Creation</h3>
                    <p className="desc-text">{productData.description}</p>
                  </div>
                )}

                {/* Highlights Card */}
                {productData.ProductHighlights && (
                  <div className="desc-section-block">
                    <h3 className="section-block-title">Key Highlights</h3>
                    <div className="bullet-points-grid">
                      {(Array.isArray(productData.ProductHighlights)
                        ? productData.ProductHighlights
                        : productData.ProductHighlights.split("\n")
                      )
                        .filter(Boolean)
                        .map((point, i) => (
                          <div className="bullet-item" key={i}>
                            <FaCheck className="bullet-icon" />
                            <span>{point}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Sacred Benefits */}
                {productData.Benefits && (
                  <div className="desc-section-block">
                    <h3 className="section-block-title">Spiritual & Vastu Benefits</h3>
                    <div className="bullet-points-grid">
                      {(Array.isArray(productData.Benefits)
                        ? productData.Benefits
                        : productData.Benefits.split("\n")
                      )
                        .filter(Boolean)
                        .map((point, i) => (
                          <div className="bullet-item benefit" key={i}>
                            <FaCheck className="bullet-icon gold" />
                            <span>{point}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Usage & Care */}
                {productData.UsageAndCareInstructions && (
                  <div className="desc-section-block care-block">
                    <h3 className="section-block-title">Usage & Sacred Care</h3>
                    <ul className="care-list">
                      {(Array.isArray(productData.UsageAndCareInstructions)
                        ? productData.UsageAndCareInstructions
                        : productData.UsageAndCareInstructions.split("\n")
                      )
                        .filter(Boolean)
                        .map((point, i) => (
                          <li key={i}>{point}</li>
                        ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Reviews Tab */}
            {selectedTab === "reviews" && (
              <div className="tab-reviews-pane">
                <div className="reviews-summary-card">
                  <div className="summary-left">
                    <span className="big-rating">
                      {productData.average_rating
                        ? parseFloat(productData.average_rating).toFixed(1)
                        : "4.8"}
                    </span>
                    <div className="stars-row">
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStar />
                    </div>
                    <span className="total-rev-text">
                      Based on {reviews.length > 0 ? reviews.length : 14} verified reviews
                    </span>
                  </div>
                  <div className="summary-right">
                    <p>
                      All reviews are submitted by authenticated devotees who have
                      purchased this sacred offering.
                    </p>
                  </div>
                </div>

                {reviews && reviews.length > 0 ? (
                  <div className="reviews-cards-list">
                    {reviews.map((rev) => (
                      <div className="review-card" key={rev.id}>
                        <div className="review-card-top">
                          <img
                            src={
                              rev.userImage ||
                              require("../Assets/profile-pic.png")
                            }
                            alt="User"
                            className="review-avatar"
                          />
                          <div className="review-user-info">
                            <h4 className="review-user-name">
                              {rev.name} {rev.lastname || ""}
                            </h4>
                            <span className="review-verified-badge">
                              <MdVerified /> Verified Devotee
                            </span>
                          </div>
                          <div className="review-stars-box">
                            {"★".repeat(rev.stars || 5)}
                          </div>
                        </div>

                        {rev.reason && (
                          <h5 className="review-title-line">
                            "{rev.reason}"
                          </h5>
                        )}

                        <p className="review-comment-text">{rev.text}</p>

                        {/* Customer Uploaded Review Images */}
                        {rev.reviewImages && rev.reviewImages.length > 0 && (
                          <div className="review-photos-strip">
                            {rev.reviewImages.map((photo, pIdx) => (
                              <img
                                key={pIdx}
                                src={photo}
                                alt={`Customer upload ${pIdx + 1}`}
                                onClick={() =>
                                  openLightbox(rev.reviewImages, pIdx)
                                }
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-reviews-box">
                    <p>🌟 Be the first devotee to share your spiritual experience with this sacred item!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 💫 "YOU MAY ALSO LIKE" RELATED PRODUCTS */}
        {relatedProducts && relatedProducts.length > 0 && (
          <section className="related-products-section">
            <div className="related-header">
              <h2 className="related-section-title">You May Also Like</h2>
              <p className="related-subtitle">
                Sacred companions often worshipped alongside this divine item
              </p>
            </div>

            <div className="related-products-grid">
              {relatedProducts.slice(0, 4).map((item) => {
                const encryptedId = encryptId(item.id);
                const itemImg = parseAllImages(item.image)[0];
                const itemOrigPrice = Number(item.price) || 0;
                const itemOfferPrice = Number(item.offerPrice) || itemOrigPrice;
                const itemHasDiscount = itemOrigPrice > itemOfferPrice;

                return (
                  <Link
                    to={`/productdetails/${encryptedId}`}
                    className="related-item-card"
                    key={item.id}
                  >
                    <div className="related-item-img-box">
                      <img
                        src={itemImg}
                        alt={item.productName}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?auto=format&fit=crop&w=600&q=80";
                        }}
                      />
                      {itemHasDiscount && (
                        <span className="related-discount-pill">
                          {Math.round(
                            ((itemOrigPrice - itemOfferPrice) / itemOrigPrice) *
                              100
                          )}
                          % OFF
                        </span>
                      )}
                    </div>

                    <div className="related-item-info">
                      <h4 className="related-item-name">{item.productName}</h4>
                      <div className="related-item-price-row">
                        <span className="related-offer">
                          ₹{itemOfferPrice.toLocaleString("en-IN")}
                        </span>
                        {itemHasDiscount && (
                          <span className="related-original">
                            ₹{itemOrigPrice.toLocaleString("en-IN")}
                          </span>
                        )}
                      </div>
                      <button className="related-view-btn">View Details</button>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>

      {/* 🖼️ Fullscreen Image Lightbox */}
      {isLightboxOpen && (
        <Lightbox
          mainSrc={lightboxImages[lightboxIndex]}
          nextSrc={
            lightboxImages[(lightboxIndex + 1) % lightboxImages.length]
          }
          prevSrc={
            lightboxImages[
              (lightboxIndex + lightboxImages.length - 1) %
                lightboxImages.length
            ]
          }
          onCloseRequest={() => setIsLightboxOpen(false)}
          onMovePrevRequest={() =>
            setLightboxIndex(
              (lightboxIndex + lightboxImages.length - 1) %
                lightboxImages.length
            )
          }
          onMoveNextRequest={() =>
            setLightboxIndex((lightboxIndex + 1) % lightboxImages.length)
          }
        />
      )}
    </div>
  );
};

export default Productdetails;
