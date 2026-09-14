import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import "../../styles/prasaddetailmaster.css";
import usePrasadStore from "../../Store/PrasadStore/PrasadStore";
import useAuthStore from "../../Store/UserStore/userAuthStore";
import Swal from "sweetalert2";
import NewLoader from "../NewLoader/NewLoader";
import Khajranaprasadimg from "../Assets/Khajarana Mandir.png";
import ujjainprasadimg from "../Assets/Ujjain temple.png";
import defaultPrasadImg from "../Assets/prasadimg.webp";
import { normalizeImageUrl } from "../../utils/imageHelper";
import {
  FaTruck,
  FaShieldAlt,
  FaOm,
  FaCheckCircle,
  FaStar,
  FaArrowRight,
  FaUserAlt,
  FaLock,
} from "react-icons/fa";
import { MdVerified } from "react-icons/md";

const PrasadDetailMasterPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user1 } = useAuthStore();
  const { getPrasadById, prasadDetails, loading } = usePrasadStore();

  const [quantity, setQuantity] = useState(1);
  const [selectedWeight, setSelectedWeight] = useState(null);
  const [sankalpaName, setSankalpaName] = useState("");
  const [sankalpaGotra, setSankalpaGotra] = useState("");

  // Clean the id parameter
  const prasadId = useMemo(() => {
    if (!id) return 1;
    const parts = id.toString().split("-");
    const lastPart = parts[parts.length - 1];
    return isNaN(Number(lastPart)) ? id : Number(lastPart);
  }, [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (prasadId) {
      getPrasadById(prasadId);
    }
  }, [prasadId, getPrasadById]);

  // Merge state passed via Link (if any) with API data
  const data = prasadDetails || location.state?.service || null;

  // Compute weight tiers
  const weightOptions = useMemo(() => {
    if (data?.weight_options && Array.isArray(data.weight_options) && data.weight_options.length > 0) {
      return data.weight_options;
    }
    const basePrice = Number(data?.price) || 499;
    return [
      { weight: "250", unit: "grams", label: "250 Grams", price: basePrice, mrp: Math.round(basePrice * 1.35) },
      { weight: "500", unit: "grams", label: "500 Grams", price: Math.round(basePrice * 1.8), mrp: Math.round(basePrice * 2.4) },
      { weight: "1", unit: "kg", label: "1 KG Box", price: Math.round(basePrice * 3.3), mrp: Math.round(basePrice * 4.5) },
    ];
  }, [data]);

  // Set default selected weight once weightOptions are ready
  useEffect(() => {
    if (weightOptions && weightOptions.length > 0) {
      setSelectedWeight((prev) => prev || weightOptions[0]);
    }
  }, [weightOptions]);

  // Compute Inclusions
  const inclusionsList = useMemo(() => {
    if (data?.inclusions && Array.isArray(data.inclusions) && data.inclusions.length > 0) {
      return data.inclusions;
    }
    const name = (data?.temple_name || data?.prasad_name || "").toLowerCase();
    if (name.includes("khajrana") || name.includes("ganesh")) {
      return [
        "Special Pure Desi Ghee Modak Laddoos",
        "Dry Fruits Mix (Almonds, Cashews & Kishmish)",
        "Energized Raksha Sutra (Mauli धागा) from Ganesh Idol",
        "Sacred Chandan & Sindoor Tilak Pack",
        "Temple Divine Photo Blessing Card",
        "Gangajal & Holy Akshat Packet",
      ];
    }
    if (name.includes("ujjain") || name.includes("mahakal")) {
      return [
        "Special Mahakaleshwar Bhasma Aarti Prasad",
        "Pure Ghee Dry Fruit Peda / Laddoos",
        "Sanctified Mahakaal Raksha Sutra",
        "Panchamrit Energized Belpatra & Rudraksha Bead",
        "Sacred Bhasma Tilak Packet",
        "Holy Kshipra & Ganga Jal Pack",
      ];
    }
    return [
      "Pure Desi Ghee Sacred Temple Laddoos / Sweets",
      "Special Dry Fruits Prasadam Box",
      "Temple Energized Raksha Sutra & Tilak",
      "Sacred Gangajal & Divine Blessing Card",
    ];
  }, [data]);

  // Fallback image helper
  const resolvedImage = useMemo(() => {
    const name = ((data?.prasad_name || "") + " " + (data?.temple_name || "")).toLowerCase();
    let fallback = defaultPrasadImg;
    if (prasadId === 1 || name.includes("khajrana") || name.includes("ganesh")) {
      fallback = Khajranaprasadimg;
    } else if (prasadId === 2 || name.includes("ujjain") || name.includes("mahakal")) {
      fallback = ujjainprasadimg;
    }
    return normalizeImageUrl(data?.image, fallback);
  }, [data, prasadId]);

  if (loading && !data) {
    return <NewLoader />;
  }

  const currentPrice = selectedWeight ? Number(selectedWeight.price) : Number(data?.price) || 499;
  const currentMrp = selectedWeight?.mrp ? Number(selectedWeight.mrp) : Math.round(currentPrice * 1.35);
  const savePercent = currentMrp > currentPrice ? Math.round(((currentMrp - currentPrice) / currentMrp) * 100) : 25;

  const subtotal = currentPrice * quantity;
  const freeThreshold = Number(data?.free_delivery_above) || 499;
  const baseDelivery = Number(data?.delivery_charge) || 40;
  const isFreeDelivery = subtotal >= freeThreshold || data?.is_free_delivery === 1 || baseDelivery === 0;
  const deliveryFee = isFreeDelivery ? 0 : baseDelivery;
  const totalPayable = subtotal + deliveryFee;

  const templeTitle = data?.temple_name || "Sacred Hindu Mandir";
  const prasadTitle = data?.prasad_name || `${templeTitle} Divine Prasad Box`;

  const handleCheckout = () => {
    if (!user1) {
      Swal.fire({
        title: "Login Required",
        text: "Please login to book sacred temple prasad delivery!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Login Now",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#ea580c",
      });
      return;
    }

    if (!sankalpaName.trim()) {
      Swal.fire({
        title: "Devotee Name Required",
        text: "Please enter the Devotee Sankalpa Name for sacred prasad offering.",
        icon: "info",
        confirmButtonColor: "#ea580c",
      });
      return;
    }

    navigate("/prasadcheckout", {
      state: {
        id: data?.id || prasadId,
        prasadName: prasadTitle,
        templeName: templeTitle,
        price: currentPrice,
        subtotal: subtotal,
        deliveryCharge: deliveryFee,
        totalPrice: totalPayable,
        sankalpaName: sankalpaName.trim(),
        sankalpaGotra: sankalpaGotra.trim() || "Kashyap",
        quantity,
        prasadWeight: selectedWeight?.weight || "250",
        weight: selectedWeight?.unit || "grams",
      },
    });
  };

  return (
    <div className="prasad-master-page">
      <div className="prasad-master-container">
        {/* Breadcrumbs */}
        <div className="prasad-breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/prasaddelivery">Prasad Delivery</Link>
          <span>/</span>
          <span>{templeTitle}</span>
        </div>

        <div className="prasad-master-grid">
          {/* LEFT COLUMN: Hero Image, Inclusions & Temple Significance */}
          <div className="prasad-left-col">
            <div className="prasad-hero-image-wrapper">
              <img
                src={resolvedImage}
                alt={prasadTitle}
                className="prasad-hero-image"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = prasadId === 2 ? ujjainprasadimg : Khajranaprasadimg;
                }}
              />
              <div className="prasad-floating-badge">
                <FaOm /> 100% Consecrated Vedic Prasad
              </div>
              <div className="prasad-rating-chip">
                <FaStar color="#f59e0b" />
                <span>4.9 (Verified)</span>
              </div>
            </div>

            {/* Inclusions Card */}
            <div className="prasad-inclusions-card">
              <h3 className="prasad-card-title">
                <span>🎁</span> Prasad Box Inclusions (प्रसाद में क्या मिलेगा)
              </h3>
              <div className="inclusions-grid">
                {inclusionsList.map((item, idx) => (
                  <div className="inclusion-item" key={idx}>
                    <FaCheckCircle className="inclusion-item-icon" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Temple Significance & History */}
            <div className="prasad-description-card">
              <h3 className="prasad-card-title">
                <span>🕉️</span> About {templeTitle} & Divine Significance
              </h3>
              <div className="prasad-description-text">
                {data?.description ||
                  `${templeTitle} is one of India's most sacred and revered pilgrimage shrines. Thousands of devotees visit to seek blessings, peace, and spiritual fulfillment. Through PrabhuPooja, sanctified prasadam is prepared with utmost Vedic purity, blessed before the deity, and dispatched with tamper-proof packaging right to your doorstep.`}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Interactive Dynamic Booking Box */}
          <div className="prasad-right-col">
            <div className="prasad-booking-box">
              <div className="prasad-temple-tag">
                <MdVerified size={18} color="#16a34a" /> {templeTitle}
              </div>

              <h1 className="prasad-main-title">{prasadTitle}</h1>

              {/* Price Banner */}
              <div className="prasad-price-row">
                <div className="prasad-selling-price">₹{currentPrice}</div>
                <div className="prasad-mrp-price">₹{currentMrp}</div>
                <div className="prasad-save-tag">SAVE {savePercent}%</div>
              </div>

              {/* Dynamic Weight Tiers Selector */}
              <div className="weight-selector-section">
                <div className="section-label">
                  <span>Select Prasad Pack Size:</span>
                  <small style={{ color: "#ea580c", fontWeight: "700" }}>
                    {selectedWeight?.label || "250g"}
                  </small>
                </div>
                <div className="weight-pills-container">
                  {weightOptions.map((opt, idx) => {
                    const isActive = (selectedWeight?.label || selectedWeight?.weight) === (opt.label || opt.weight);
                    return (
                      <div
                        key={idx}
                        className={`weight-pill-card ${isActive ? "active" : ""}`}
                        onClick={() => setSelectedWeight(opt)}
                      >
                        <div className="weight-pill-title">{opt.label || `${opt.weight} ${opt.unit || "g"}`}</div>
                        <div className="weight-pill-price">₹{opt.price}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quantity Stepper */}
              <div className="qty-stepper-row">
                <span style={{ fontSize: "14px", fontWeight: "700", color: "#334155" }}>
                  Number of Prasad Boxes:
                </span>
                <div className="qty-controls">
                  <button
                    className="qty-btn"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="qty-display">{quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Devotee Sankalpa Inputs */}
              <div className="sankalpa-box">
                <div className="sankalpa-title">
                  <FaUserAlt /> Devotee Sankalpa Details (संकल्प विवरण)
                </div>
                <input
                  type="text"
                  className="sankalpa-input"
                  placeholder="यजमान का नाम (Devotee Full Name) *"
                  value={sankalpaName}
                  onChange={(e) => setSankalpaName(e.target.value)}
                />
                <input
                  type="text"
                  className="sankalpa-input"
                  placeholder="गोत्र (Gotra) - छोड़ देने पर कश्यप लिया जाएगा"
                  value={sankalpaGotra}
                  onChange={(e) => setSankalpaGotra(e.target.value)}
                />
              </div>

              {/* Live Order Summary Box */}
              <div className="prasad-summary-card">
                <div className="summary-line">
                  <span>
                    Items Subtotal ({selectedWeight?.label || "Pack"}):
                  </span>
                  <span style={{ fontWeight: "700", color: "#1e293b" }}>
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="summary-line">
                  <span>Delivery Fee:</span>
                  <span>
                    {isFreeDelivery ? (
                      <strong style={{ color: "#15803d" }}>🚚 FREE Delivery</strong>
                    ) : (
                      <strong style={{ color: "#ea580c" }}>₹{deliveryFee.toFixed(2)}</strong>
                    )}
                  </span>
                </div>

                {isFreeDelivery ? (
                  <div className="free-delivery-eligible">
                    ✓ Free Express Delivery applied to your order!
                  </div>
                ) : (
                  <div className="free-delivery-tip">
                    <FaTruck />
                    <span>
                      Add <strong>₹{freeThreshold - subtotal}</strong> more for <strong>FREE Delivery!</strong>
                    </span>
                  </div>
                )}

                <div className="summary-line grand-total">
                  <span>Total Payable:</span>
                  <span>₹{totalPayable.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Book Now Button */}
              <button className="btn-prasad-book-master" onClick={handleCheckout}>
                <span>Book Prasad Now • ₹{totalPayable}</span>
                <FaArrowRight />
              </button>

              {/* Trust Badges */}
              <div className="prasad-trust-features">
                <div className="trust-item">
                  <FaShieldAlt color="#ea580c" /> 100% Pure & Sanctified
                </div>
                <div className="trust-item">
                  <FaTruck color="#16a34a" /> Fast Doorstep Dispatch
                </div>
                <div className="trust-item">
                  <FaLock color="#3b82f6" /> Secure Vedic Packaging
                </div>
                <div className="trust-item">
                  <FaOm color="#ea580c" /> Direct Temple Blessings
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrasadDetailMasterPage;
