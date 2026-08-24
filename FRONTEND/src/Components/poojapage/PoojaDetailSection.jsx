import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../Axios/api";
import CryptoJS from "crypto-js";
import Swal from "sweetalert2";
import useAuthStore from "../../Store/UserStore/userAuthStore";
import BookPoojaForm from "../onlinepuja/bookpoojaform";
import "../../styles/poojaDetailSection.css";

const PoojaDetailSection = ({ poojaId: propPoojaId }) => {
  const params = useParams();
  const navigate = useNavigate();
  const { user1, setIsLoginPopup } = useAuthStore();

  const [pooja, setPooja] = useState(null);
  const [panditsList, setPanditsList] = useState([]);
  const [selectedPanditId, setSelectedPanditId] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Decrypt ID if encrypted
  const decryptId = (encryptedIdFromUrl) => {
    if (!encryptedIdFromUrl) return "";
    try {
      const decodedId = decodeURIComponent(encryptedIdFromUrl);
      const bytes = CryptoJS.AES.decrypt(decodedId, "prabhupooja2024");
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      if (decrypted && decrypted.trim().length > 0) {
        return decrypted;
      }
    } catch (e) {
      // Fallback if not AES encrypted
    }
    return decodeURIComponent(encryptedIdFromUrl);
  };

  const activePoojaId = propPoojaId || decryptId(params.id) || params.id;

  // Default packages fallback if not configured in backend
  const getDefaultPackages = (basePrice = 1100) => [
    {
      id: "pkg_ind",
      name: "Individual Pooja",
      price: basePrice,
      description: "1 Devotee Sankalp with Vedic Pandit",
      members_allowed: 1,
      pandit_count: 1,
      prasad_included: true,
    },
    {
      id: "pkg_cpl",
      name: "Couple / Partner Pooja",
      price: Math.round(basePrice * 1.5),
      description: "Joint Sankalp for Husband & Wife / 2 Devotees",
      members_allowed: 2,
      pandit_count: 1,
      prasad_included: true,
    },
    {
      id: "pkg_fam",
      name: "Family Pooja",
      price: Math.round(basePrice * 2.2),
      description: "Up to 6 Family Members Sankalp with complete rituals",
      members_allowed: 6,
      pandit_count: 2,
      prasad_included: true,
    },
    {
      id: "pkg_mha",
      name: "Maha Hawan & Anushthan",
      price: Math.round(basePrice * 3.5),
      description: "Grand Anushthan with Senior Acharyas & 1008 Mantra Jaap",
      members_allowed: 8,
      pandit_count: 3,
      prasad_included: true,
    },
  ];

  // 1. Fetch Pooja Details & Assigned Pandits
  useEffect(() => {
    const fetchPoojaData = async () => {
      if (!activePoojaId) return;
      setLoading(true);

      try {
        let poojaData = null;

        // Try primary API endpoint
        try {
          const res = await api.get(`/user/onlinePuja/get/${activePoojaId}`);
          if (res.data?.success && res.data?.data) {
            poojaData = res.data.data;
          }
        } catch (e1) {
          // Fallback to direct URL if needed
          try {
            const fallbackRes = await axios.get(`http://localhost:5000/onlinePuja/get/${activePoojaId}`);
            if (fallbackRes.data?.success && fallbackRes.data?.data) {
              poojaData = fallbackRes.data.data;
            }
          } catch (e2) {
            console.error("Direct fetch failed:", e2);
          }
        }

        if (poojaData) {
          setPooja(poojaData);

          // Parse Packages
          let availablePackages = [];
          if (poojaData.packages) {
            if (Array.isArray(poojaData.packages) && poojaData.packages.length > 0) {
              availablePackages = poojaData.packages;
            } else if (typeof poojaData.packages === "string") {
              try {
                const parsed = JSON.parse(poojaData.packages);
                if (Array.isArray(parsed) && parsed.length > 0) {
                  availablePackages = parsed;
                }
              } catch (e) {
                // Ignore parse error
              }
            }
          }

          if (availablePackages.length === 0) {
            const basePrice = Number(poojaData.final_price || poojaData.price || 1100);
            availablePackages = getDefaultPackages(basePrice);
          }

          // Default package selection
          setSelectedPackage(availablePackages[0]);

          // Fetch or extract assigned Pandits
          let pandits = poojaData.pandits || [];

          // If pandits are not present in pooja object directly, fetch from pandits endpoint
          if (!pandits || pandits.length === 0) {
            try {
              const panditsRes = await api.get(`/user/onlinePuja/${activePoojaId}/pandits`);
              if (panditsRes.data?.success && Array.isArray(panditsRes.data?.data)) {
                pandits = panditsRes.data.data;
              }
            } catch (err) {
              console.warn("Could not fetch assigned pandits:", err);
            }
          }

          setPanditsList(pandits);

          // Default pandit selection
          if (pandits.length > 0) {
            setSelectedPanditId(pandits[0].id);
          }
        }
      } catch (err) {
        console.error("Error loading pooja details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPoojaData();
  }, [activePoojaId]);

  if (loading) {
    return (
      <div className="pooja-detail-container text-center p-8">
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <p style={{ fontSize: "18px", color: "#ea580c", fontWeight: "600" }}>
            Loading Pooja details & Pandits...
          </p>
        </div>
      </div>
    );
  }

  if (!pooja) {
    return (
      <div className="pooja-detail-container text-center p-8">
        <div style={{ textAlign: "center", padding: "40px 0", color: "#dc2626" }}>
          <h2>Pooja Not Found</h2>
          <p>The requested pooja details are unavailable.</p>
        </div>
      </div>
    );
  }

  // Live Price Calculation
  const currentPrice = selectedPackage
    ? Number(selectedPackage.price)
    : Number(pooja.final_price || pooja.price || 1100);

  // Available Packages List
  let packagesList = [];
  if (pooja.packages) {
    if (Array.isArray(pooja.packages) && pooja.packages.length > 0) {
      packagesList = pooja.packages;
    } else if (typeof pooja.packages === "string") {
      try {
        const parsed = JSON.parse(pooja.packages);
        if (Array.isArray(parsed) && parsed.length > 0) packagesList = parsed;
      } catch (e) {}
    }
  }
  if (packagesList.length === 0) {
    packagesList = getDefaultPackages(Number(pooja.final_price || pooja.price || 1100));
  }

  // Handle Book Now Click
  const handleBookNow = () => {
    const userStr = localStorage.getItem("user") || sessionStorage.getItem("user");
    const currentUser = user1 || (userStr ? JSON.parse(userStr) : null);

    if (!currentUser) {
      Swal.fire({
        title: "Please Login First",
        text: "You must be logged in to book this Pooja and choose your preferred Vedic Pandit.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Login Now",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed && setIsLoginPopup) {
          setIsLoginPopup(true);
        }
      });
      return;
    }

    setShowBookingModal(true);
  };

  const selectedPandit = panditsList.find((p) => p.id === selectedPanditId) || panditsList[0];

  return (
    <div className="pooja-detail-container">
      {/* 1. Header & Basic Info */}
      <div className="pooja-hero-card">
        <img
          src={pooja.image || "https://images.unsplash.com/photo-1609358905581-e5382c402129"}
          alt={pooja.name}
          className="pooja-hero-image"
        />
        <div className="pooja-hero-content">
          <h1 className="pooja-hero-title">{pooja.name}</h1>
          <div className="pooja-price-row">
            <span className="pooja-final-price">₹{currentPrice}</span>
            {pooja.price && Number(pooja.price) > currentPrice && (
              <>
                <span className="pooja-original-price">₹{pooja.price}</span>
                <span className="pooja-discount-tag">
                  {Math.round(((pooja.price - currentPrice) / pooja.price) * 100)}% OFF
                </span>
              </>
            )}
          </div>
          <p className="pooja-about-text">
            {pooja.about_pooja ||
              "Experience the divine blessings of authentic Vedic rituals performed by certified Acharyas tailored to your Sankalp."}
          </p>
        </div>
      </div>

      {/* 2. Step 1: Packages Selection */}
      <div className="section-block">
        <div className="section-header">
          <h2 className="section-title">
            <span>Step 1:</span> Choose Your Sankalp / Package
          </h2>
          <p className="section-subtitle">Select the participation level and offerings for you and your family</p>
        </div>

        <div className="packages-grid-container">
          {packagesList.map((pkg) => {
            const isPkgSelected = selectedPackage?.id === pkg.id || selectedPackage?.name === pkg.name;
            return (
              <div
                key={pkg.id || pkg.name}
                onClick={() => setSelectedPackage(pkg)}
                className={`package-item-card ${isPkgSelected ? "selected" : ""}`}
              >
                <div>
                  <div className="package-item-header">
                    <h3 className="package-item-name">{pkg.name}</h3>
                    <span className="package-item-price">₹{pkg.price}</span>
                  </div>
                  <p className="package-item-desc">{pkg.description}</p>
                </div>

                <div className="package-item-specs">
                  <div>👥 {pkg.members_allowed || 1} Devotee(s)</div>
                  <div>🕉️ {pkg.pandit_count || 1} Vedic Pandit(s)</div>
                  {pkg.prasad_included !== false && (
                    <div style={{ color: "#15803d", fontWeight: "600" }}>📦 Prasad at Home Included</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Step 2: Available Vedic Pandits List with Photo & Details */}
      <div className="section-block">
        <div className="section-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2 className="section-title">
              <span>Step 2:</span> Choose Your Preferred Vedic Pandit
            </h2>
            <p className="section-subtitle">Experienced and certified Acharyas available for this Pooja</p>
          </div>
          <span style={{ backgroundColor: "#ffedd5", color: "#9a3412", fontWeight: "700", fontSize: "12px", padding: "4px 12px", borderRadius: "9999px" }}>
            {panditsList.length} Pandits Available
          </span>
        </div>

        <div className="pandits-grid-container">
          {panditsList && panditsList.length > 0 ? (
            panditsList.map((pandit) => {
              const isSelected = selectedPanditId === pandit.id;
              return (
                <div
                  key={pandit.id}
                  onClick={() => setSelectedPanditId(pandit.id)}
                  className={`pandit-item-card ${isSelected ? "selected" : ""}`}
                >
                  <img
                    src={
                      pandit.profileImage ||
                      pandit.image ||
                      "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                    }
                    alt={pandit.name}
                    className="pandit-card-avatar"
                  />
                  <div className="pandit-card-info">
                    <div className="pandit-card-top">
                      <h4 className="pandit-card-name">
                        {pandit.name} {pandit.lastname || ""}
                      </h4>
                      <span className="pandit-verified-badge">✓ Verified</span>
                    </div>
                    <p className="pandit-card-meta">
                      {pandit.experience ? `${pandit.experience} Yrs Exp` : "10+ Yrs Exp"} • Gotra: {pandit.gotra || "Vedic"}
                    </p>
                    <p className="pandit-card-skills">
                      {pandit.skills || "Vedic Chanting, Hawan & Anushthan"}
                    </p>
                    {pandit.qualification && (
                      <p className="pandit-card-qual">🎓 {pandit.qualification}</p>
                    )}
                    {isSelected && (
                      <span className="pandit-selected-tag">● Selected Pandit</span>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{ background: "#f8fafc", padding: "20px", borderRadius: "12px", gridColumn: "span 3", border: "1px dashed #cbd5e1" }}>
              <p style={{ color: "#64748b", margin: 0, fontSize: "14px" }}>
                ✨ Experienced Vedic Pandits will be allotted directly upon booking confirmation.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 4. Total Calculation Summary Bar & Book Button */}
      <div className="booking-summary-bar">
        <div>
          <span className="summary-price-label">Total Payable Amount</span>
          <div className="summary-price-value">₹{currentPrice}</div>
          <p className="summary-details">
            Package: <span>{selectedPackage?.name}</span>{" "}
            {selectedPandit && <>| Pandit: <span>{selectedPandit.name}</span></>}
          </p>
        </div>

        <button onClick={handleBookNow} className="book-now-main-btn">
          Book Pooja Now (₹{currentPrice})
        </button>
      </div>

      {/* Booking Form Modal */}
      {showBookingModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            padding: "16px",
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "16px",
              maxWidth: "500px",
              width: "100%",
              padding: "24px",
              position: "relative",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", borderBottom: "1px solid #f1f5f9", paddingBottom: "12px" }}>
              <h3 style={{ margin: 0, fontSize: "18px", color: "#ea580c", fontWeight: "700" }}>
                Book {selectedPackage?.name}
              </h3>
              <button
                onClick={() => setShowBookingModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "24px",
                  cursor: "pointer",
                  color: "#94a3b8",
                }}
              >
                &times;
              </button>
            </div>

            <div style={{ marginBottom: "16px", fontSize: "13px", color: "#475569", background: "#fff7ed", padding: "10px 14px", borderRadius: "8px" }}>
              <div><strong>Pooja:</strong> {pooja.name}</div>
              <div><strong>Selected Pandit:</strong> {selectedPandit?.name || "Auto Allotment"} ({selectedPandit?.gotra || "Vedic"})</div>
              <div><strong>Total Amount:</strong> ₹{currentPrice}</div>
            </div>

            <BookPoojaForm
              data={{
                ...pooja,
                price: currentPrice,
                packageName: selectedPackage?.name,
                package_id: selectedPackage?.id,
                selected_pandit_id: selectedPanditId,
              }}
              onClose={() => setShowBookingModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PoojaDetailSection;
