import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import "./ecommerceNew2.css";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import useUserCardStore from "../../Store/userCardStore/userCardStore";
import useAuthStore from "../../Store/UserStore/userAuthStore";
import useHomeStore from "../../Store/dataStore/homeStore";
import { TailSpin } from "react-loader-spinner";
import CryptoJS from "crypto-js";
import {
  FaFire,
  FaGem,
  FaYinYang,
  FaStar,
  FaSearch,
  FaShoppingCart,
  FaTimes,
  FaFilter,
  FaChevronLeft,
  FaChevronRight,
  FaTag,
  FaShieldAlt,
  FaTruck,
  FaCheck,
  FaChevronDown,
  FaChevronUp,
  FaSlidersH,
  FaUndoAlt,
  FaLayerGroup,
} from "react-icons/fa";
import { MdOutlineLocalOffer, MdVerified } from "react-icons/md";
import debounce from "lodash.debounce";

// 🛡️ Helper: Parse image safely from array, JSON string, comma-separated string, or URL
export const getSafeImageUrl = (imageField, index = 0) => {
  const fallback =
    "https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?auto=format&fit=crop&w=600&q=80";
  if (!imageField) return fallback;

  if (Array.isArray(imageField)) {
    const item = imageField[index] || imageField[0];
    if (typeof item === "string" && item.trim()) {
      const clean = item.trim().replace(/^["'[\]]+|["'[\]]+$/g, "");
      return clean || fallback;
    }
  }

  if (typeof imageField === "string") {
    const trimmed = imageField.trim();
    if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const item = parsed[index] || parsed[0];
          if (typeof item === "string") {
            const clean = item.trim().replace(/^["'[\]]+|["'[\]]+$/g, "");
            return clean || fallback;
          }
        }
      } catch (e) {
        // continue
      }
    }
    if (trimmed.includes(",")) {
      const parts = trimmed
        .split(",")
        .map((s) => s.trim().replace(/^["'[\]]+|["'[\]]+$/g, ""))
        .filter(Boolean);
      if (parts[index]) return parts[index];
      if (parts[0]) return parts[0];
    }
    const cleanUrl = trimmed.replace(/^["'[\]]+|["'[\]]+$/g, "");
    if (cleanUrl && cleanUrl.length > 4) return cleanUrl;
  }
  return fallback;
};

// 🛡️ Helper: Parse ALL images safely for multi-image auto-slider
export const getAllSafeImageUrls = (imageField) => {
  const fallback =
    "https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?auto=format&fit=crop&w=600&q=80";
  if (!imageField) return [fallback];

  let urls = [];
  if (Array.isArray(imageField)) {
    urls = imageField
      .map((item) =>
        typeof item === "string"
          ? item.trim().replace(/^["'[\]]+|["'[\]]+$/g, "")
          : ""
      )
      .filter((u) => u && u.length > 4);
  } else if (typeof imageField === "string") {
    const trimmed = imageField.trim();
    if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          urls = parsed
            .map((item) =>
              typeof item === "string"
                ? item.trim().replace(/^["'[\]]+|["'[\]]+$/g, "")
                : ""
            )
            .filter((u) => u && u.length > 4);
        }
      } catch (e) {}
    }
    if (urls.length === 0 && trimmed.includes(",")) {
      urls = trimmed
        .split(",")
        .map((s) => s.trim().replace(/^["'[\]]+|["'[\]]+$/g, ""))
        .filter((u) => u && u.length > 4);
    }
    if (urls.length === 0 && trimmed.length > 4) {
      urls = [trimmed.replace(/^["'[\]]+|["'[\]]+$/g, "")];
    }
  }
  return urls.length > 0 ? urls : [fallback];
};

// 🌟 Smooth Auto-Sliding Image Component for Product Cards with > 1 Image
const ProductCardImageSlider = ({
  images,
  productName,
  hasDiscount,
  discountPercent,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 2800);
    return () => clearInterval(timer);
  }, [images]);

  return (
    <div className="product-card-img-box">
      {images.map((imgUrl, idx) => (
        <img
          key={imgUrl + idx}
          src={imgUrl}
          alt={`${productName || "Product"} view ${idx + 1}`}
          className={`product-card-img ${
            idx === currentIndex ? "active-slide" : "hidden-slide"
          }`}
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?auto=format&fit=crop&w=600&q=80";
          }}
        />
      ))}

      {hasDiscount && (
        <span className="card-discount-badge">{discountPercent}% OFF</span>
      )}
      <span className="card-sanctified-pill">
        <FaCheck className="pill-check-icon" /> Sanctified
      </span>

      {images.length > 1 && (
        <div className="card-slider-dots">
          {images.map((_, dotIdx) => (
            <span
              key={dotIdx}
              className={`card-slider-dot ${
                dotIdx === currentIndex ? "active" : ""
              }`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setCurrentIndex(dotIdx);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// 🎯 Categories List
const categoryList = [
  { name: "All Products", icon: <FaFire />, value: "" },
  { name: "Trending", icon: <FaStar />, value: "trending" },
  { name: "Online Pooja", icon: <FaYinYang />, value: "online-pooja" },
  { name: "Gemstones", icon: <FaGem />, value: "gemstones" },
  { name: "Yantras", icon: <FaYinYang />, value: "yantras" },
  { name: "Pooja Samagri", icon: <FaFire />, value: "pooja-samagri" },
  { name: "Silver Idols", icon: <FaStar />, value: "silver" },
  { name: "Brass Idols", icon: <FaStar />, value: "brass" },
];

// 🎨 Material filters
const materialList = [
  "Gold",
  "Silver",
  "Brass",
  "Copper",
  "Gemstone",
  "Wood",
  "Marble",
  "Brooch & Pendant",
];

// 💰 Price range options
const priceRanges = [
  { id: "all", label: "All Prices", min: 0, max: Infinity },
  { id: "under500", label: "Under ₹500", min: 0, max: 500 },
  { id: "500-1500", label: "₹500 - ₹1,500", min: 500, max: 1500 },
  { id: "1500-3000", label: "₹1,500 - ₹3,000", min: 1500, max: 3000 },
  { id: "above3000", label: "Above ₹3,000", min: 3000, max: Infinity },
];

// 📢 Dynamic Promotional Offer Banners Data (Easily configurable / extensible)
const offerBanners = [
  {
    id: 1,
    tag: "FESTIVE SPECIAL OFFER",
    title: "Sacred & Pure Spiritual Idols",
    subtitle:
      "Handcrafted Silver, Brass & Marble idols consecrated with Vedic rituals to invite divinity and prosperity into your home.",
    discount: "UP TO 40% OFF",
    code: "CODE: PRABHU40",
    bgGradient: "linear-gradient(135deg, #4a1d00 0%, #b45309 45%, #ea580c 100%)",
    accentColor: "#fef08a",
    image: require("../Assets/productBanner.png"),
    buttonText: "Shop Divine Idols",
    filterAction: "",
  },
  {
    id: 2,
    tag: "100% CERTIFIED & ENERGIZED",
    title: "Vedic Gemstones & Sacred Yantras",
    subtitle:
      "Authentic, lab-certified natural gemstones and energized Sri Yantras crafted according to ancient astrological principles.",
    discount: "FLAT 25% OFF",
    code: "CODE: VEDIC25",
    bgGradient: "linear-gradient(135deg, #1e1b4b 0%, #3730a3 50%, #b45309 100%)",
    accentColor: "#fed7aa",
    image: require("../Assets/gemstoneimg.jpg"),
    buttonText: "Explore Gemstones",
    filterAction: "gemstones",
  },
  {
    id: 3,
    tag: "COMPLETE POOJA SAMAGRI",
    title: "Authentic Pooja & Havan Kits",
    subtitle:
      "Eco-friendly, chemical-free dhoop, Gangajal, pure cow ghee diya sets, and premium havan samagri delivered safely to your doorstep.",
    discount: "STARTING @ ₹99",
    code: "FREE PRASAD ON ₹999+",
    bgGradient: "linear-gradient(135deg, #3f1d0b 0%, #9a3412 50%, #c2410c 100%)",
    accentColor: "#fde047",
    image: require("../Assets/ecommercebanner.webp"),
    buttonText: "View Samagri Kits",
    filterAction: "pooja-samagri",
  },
];

const EcommerceNew2 = () => {
  const [filter, setFilter] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 12;
  const [loading, setLoading] = useState(null);
  const [bestSellers, setBestSellers] = useState([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [isBannerHovered, setIsBannerHovered] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState({
    categories: false,
    materials: false,
    price: false,
    bestsellers: true,
  });

  const toggleSection = (sectionKey) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (debouncedSearch) count += 1;
    if (selectedCategory) count += 1;
    if (selectedMaterial) count += 1;
    if (selectedPriceRange !== "all") count += 1;
    if (sortBy !== "default") count += 1;
    return count;
  }, [
    debouncedSearch,
    selectedCategory,
    selectedMaterial,
    selectedPriceRange,
    sortBy,
  ]);

  const lastProductRef = useRef(null);
  const bannerTimerRef = useRef(null);

  const { addToCart, getCartItems } = useUserCardStore();
  const { user1 } = useAuthStore();
  const {
    products = [],
    setProducts,
    getFilterProducts,
    isLoading,
  } = useHomeStore();

  // Dynamic Banner Auto-Play Timer
  useEffect(() => {
    if (!isBannerHovered) {
      bannerTimerRef.current = setInterval(() => {
        setCurrentBannerIndex((prev) => (prev + 1) % offerBanners.length);
      }, 5000);
    }
    return () => clearInterval(bannerTimerRef.current);
  }, [isBannerHovered]);

  const handleNextBanner = () => {
    setCurrentBannerIndex((prev) => (prev + 1) % offerBanners.length);
  };

  const handlePrevBanner = () => {
    setCurrentBannerIndex(
      (prev) => (prev - 1 + offerBanners.length) % offerBanners.length
    );
  };

  // Debounced search handler
  const debounceSearch = useCallback(
    debounce((value) => {
      setDebouncedSearch(value);
      setPage(1);
      setHasMore(true);
    }, 450),
    []
  );

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    debounceSearch(e.target.value);
  };

  const handleClearSearch = () => {
    setFilter("");
    setDebouncedSearch("");
    setPage(1);
    setHasMore(true);
  };

  const handleMaterialChange = (mat) => {
    setSelectedMaterial((prev) => (prev === mat ? "" : mat));
    setPage(1);
    setHasMore(true);
  };

  const handleCategoryChange = (val) => {
    setSelectedCategory((prev) => (prev === val ? "" : val));
    setPage(1);
    setHasMore(true);
    if (mobileFilterOpen) setMobileFilterOpen(false);
  };

  const handlePriceRangeChange = (rangeId) => {
    setSelectedPriceRange(rangeId);
  };

  const handleSortChange = (e) => setSortBy(e.target.value);

  const handleResetFilters = () => {
    setFilter("");
    setDebouncedSearch("");
    setSelectedMaterial("");
    setSelectedCategory("");
    setSelectedPriceRange("all");
    setSortBy("default");
    setPage(1);
    setHasMore(true);
  };

  const encryptId = (ID) => {
    const encrypted = CryptoJS.AES.encrypt(
      ID.toString(),
      "prabhupooja2024"
    ).toString();
    return encodeURIComponent(encrypted);
  };

  // Fetch product data
  useEffect(() => {
    const fetchData = async () => {
      const res = await getFilterProducts({
        page,
        limit,
        search: debouncedSearch,
        material: selectedMaterial,
        category: selectedCategory,
      });

      if (res?.success && Array.isArray(res.productData)) {
        setBestSellers(res.bestSellers || []);
        if (res.productData.length === 0) {
          setHasMore(false);
          if (page === 1) setProducts([]);
          return;
        }

        if (page === 1) {
          setProducts(res.productData);
        } else {
          setProducts((prev) => [...(prev || []), ...res.productData]);
        }
      }
    };
    fetchData();
  }, [page, debouncedSearch, selectedMaterial, selectedCategory]);

  // Infinite scrolling observer
  useEffect(() => {
    if (!hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.5 }
    );

    const currentRef = lastProductRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [hasMore, isLoading, products]);

  // Filter and Sort Products
  const processedProducts = useMemo(() => {
    let list = [...products];

    // Price range filtering
    const currentRange = priceRanges.find((r) => r.id === selectedPriceRange);
    if (currentRange && selectedPriceRange !== "all") {
      list = list.filter((p) => {
        const effectivePrice = p.offerPrice || p.price || 0;
        return (
          effectivePrice >= currentRange.min && effectivePrice <= currentRange.max
        );
      });
    }

    // Sorting
    switch (sortBy) {
      case "name-asc":
        list.sort((a, b) =>
          (a.productName || "").localeCompare(b.productName || "")
        );
        break;
      case "name-desc":
        list.sort((a, b) =>
          (b.productName || "").localeCompare(a.productName || "")
        );
        break;
      case "price-asc":
        list.sort(
          (a, b) =>
            (a.offerPrice || a.price || 0) - (b.offerPrice || b.price || 0)
        );
        break;
      case "price-desc":
        list.sort(
          (a, b) =>
            (b.offerPrice || b.price || 0) - (a.offerPrice || a.price || 0)
        );
        break;
      default:
        break;
    }
    return list;
  }, [products, selectedPriceRange, sortBy]);

  // Add to cart handler with feedback
  const handleAddToCart = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(product.id);
    try {
      const response = await addToCart({
        user_id: user1?.id,
        product: product,
        quantity: 1,
      });
      getCartItems(user1?.id);
      Swal.fire({
        icon: response.success ? "success" : "error",
        title: response.success ? "Added to Cart!" : "Could Not Add",
        text: response.success
          ? `"${product.productName}" added to your sacred cart.`
          : "Please try again.",
        timer: 1800,
        showConfirmButton: false,
      });
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong while adding product.",
        timer: 2000,
        showConfirmButton: false,
      });
    } finally {
      setLoading(null);
    }
  };

  const hasActiveFilters =
    debouncedSearch ||
    selectedMaterial ||
    selectedCategory ||
    selectedPriceRange !== "all" ||
    sortBy !== "default";

  return (
    <div className="ecom-page-wrapper">
      {/* 🌟 Header Breadcrumb Bar */}
      <div className="ecom-top-bar">
        <div className="ecom-container">
          <div className="ecom-breadcrumb-row">
            <div className="ecom-breadcrumbs">
              <Link to="/">Home</Link>
              <span className="crumb-separator">/</span>
              <span className="current-crumb">E-Commerce & Spiritual Store</span>
            </div>
            <div className="ecom-trust-pills">
              <span>
                <MdVerified className="pill-icon" /> 100% Vedic Energized
              </span>
              <span>
                <FaTruck className="pill-icon" /> Safe Express Delivery
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="ecom-container">
        {/* 🎨 DYNAMIC PROMOTIONAL OFFER BANNER (Auto-Slider with Controls) */}
        <div
          className="dynamic-banner-section"
          onMouseEnter={() => setIsBannerHovered(true)}
          onMouseLeave={() => setIsBannerHovered(false)}
        >
          <div
            className="dynamic-banner-card"
            style={{
              background: offerBanners[currentBannerIndex].bgGradient,
            }}
          >
            <div className="banner-content">
              <span className="banner-tag">
                <MdOutlineLocalOffer /> {offerBanners[currentBannerIndex].tag}
              </span>
              <h1 className="banner-title">
                {offerBanners[currentBannerIndex].title}
              </h1>
              <p className="banner-subtitle">
                {offerBanners[currentBannerIndex].subtitle}
              </p>
              <div className="banner-cta-row">
                <div className="banner-discount-badge">
                  <span className="discount-value">
                    {offerBanners[currentBannerIndex].discount}
                  </span>
                  <span className="coupon-code">
                    {offerBanners[currentBannerIndex].code}
                  </span>
                </div>
                <button
                  className="banner-cta-btn"
                  onClick={() => {
                    if (offerBanners[currentBannerIndex].filterAction) {
                      handleCategoryChange(
                        offerBanners[currentBannerIndex].filterAction
                      );
                    }
                  }}
                >
                  {offerBanners[currentBannerIndex].buttonText} &rarr;
                </button>
              </div>
            </div>

            <div className="banner-visual">
              <img
                src={offerBanners[currentBannerIndex].image}
                alt="Promotion"
                className="banner-hero-img"
              />
            </div>
          </div>

          {/* Banner Slider Controls */}
          <button
            className="banner-arrow-btn prev-btn"
            onClick={handlePrevBanner}
            aria-label="Previous Slide"
          >
            <FaChevronLeft />
          </button>
          <button
            className="banner-arrow-btn next-btn"
            onClick={handleNextBanner}
            aria-label="Next Slide"
          >
            <FaChevronRight />
          </button>

          {/* Indicator Dots */}
          <div className="banner-dots">
            {offerBanners.map((banner, index) => (
              <span
                key={banner.id}
                className={`banner-dot ${
                  index === currentBannerIndex ? "active" : ""
                }`}
                onClick={() => setCurrentBannerIndex(index)}
              />
            ))}
          </div>
        </div>

        {/* 📱 Mobile Filter Open Button */}
        <div className="mobile-filter-trigger">
          <button
            className="mobile-filter-btn"
            onClick={() => setMobileFilterOpen(true)}
          >
            <FaFilter /> Filters & Categories
            {hasActiveFilters && <span className="active-dot" />}
          </button>
        </div>

        {/* 🛍️ MAIN STORE LAYOUT (LEFT FILTERS + RIGHT PRODUCTS) */}
        <div className="ecom-main-layout">
          {/* 🌿 LEFT SIDEBAR FILTERS */}
          <aside
            className={`ecom-sidebar ${mobileFilterOpen ? "mobile-open" : ""}`}
          >
            <div className="sidebar-header-mobile">
              <h3>Filters & Categories</h3>
              <button
                className="close-sidebar-btn"
                onClick={() => setMobileFilterOpen(false)}
              >
                <FaTimes />
              </button>
            </div>

            {/* Unified Modern Filter Card */}
            <div className="sidebar-unified-card">
              {/* Header with Title, Active Count Badge and Clear All */}
              <div className="unified-sidebar-header">
                <div className="filter-header-title">
                  <FaSlidersH className="filter-header-icon" />
                  <span>Filters</span>
                  {activeFilterCount > 0 && (
                    <span className="active-badge">{activeFilterCount} Active</span>
                  )}
                </div>
                {hasActiveFilters && (
                  <button
                    className="sidebar-quick-reset-btn"
                    onClick={handleResetFilters}
                    type="button"
                    title="Reset all active filters"
                  >
                    <FaUndoAlt /> Clear All
                  </button>
                )}
              </div>

              {/* Accordion Section 1: Categories */}
              <div className="unified-filter-section">
                <button
                  className="section-header-btn"
                  onClick={() => toggleSection("categories")}
                  type="button"
                >
                  <div className="section-title-wrap">
                    <span className="section-bullet"></span>
                    <span className="section-title">Categories</span>
                    {selectedCategory && (
                      <span className="section-indicator-pill">
                        {categoryList.find((c) => c.value === selectedCategory)?.name || "Selected"}
                      </span>
                    )}
                  </div>
                  {collapsedSections.categories ? (
                    <FaChevronDown className="section-chevron" />
                  ) : (
                    <FaChevronUp className="section-chevron" />
                  )}
                </button>
                {!collapsedSections.categories && (
                  <div className="section-content-body">
                    <ul className="category-list">
                      {categoryList.map((cat) => (
                        <li
                          key={cat.name}
                          className={`category-item ${
                            selectedCategory === cat.value ? "active" : ""
                          }`}
                          onClick={() => handleCategoryChange(cat.value)}
                        >
                          <span className="cat-icon">{cat.icon}</span>
                          <span className="cat-name">{cat.name}</span>
                          {selectedCategory === cat.value && (
                            <FaCheck className="cat-check" />
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Accordion Section 2: Metal & Material */}
              <div className="unified-filter-section">
                <button
                  className="section-header-btn"
                  onClick={() => toggleSection("materials")}
                  type="button"
                >
                  <div className="section-title-wrap">
                    <span className="section-bullet"></span>
                    <span className="section-title">Metal & Material</span>
                    {selectedMaterial && (
                      <span className="section-indicator-pill">
                        {selectedMaterial}
                      </span>
                    )}
                  </div>
                  {collapsedSections.materials ? (
                    <FaChevronDown className="section-chevron" />
                  ) : (
                    <FaChevronUp className="section-chevron" />
                  )}
                </button>
                {!collapsedSections.materials && (
                  <div className="section-content-body">
                    <div className="material-chips-grid">
                      {materialList.map((mat) => {
                        const isChecked = selectedMaterial === mat;
                        return (
                          <button
                            key={mat}
                            type="button"
                            className={`material-chip-btn ${
                              isChecked ? "active" : ""
                            }`}
                            onClick={() => handleMaterialChange(mat)}
                          >
                            {isChecked && <FaCheck className="chip-check-icon" />}
                            <span>{mat}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Accordion Section 3: Price Range */}
              <div className="unified-filter-section">
                <button
                  className="section-header-btn"
                  onClick={() => toggleSection("price")}
                  type="button"
                >
                  <div className="section-title-wrap">
                    <span className="section-bullet"></span>
                    <span className="section-title">Price Range</span>
                    {selectedPriceRange !== "all" && (
                      <span className="section-indicator-pill">
                        {priceRanges.find((r) => r.id === selectedPriceRange)?.label}
                      </span>
                    )}
                  </div>
                  {collapsedSections.price ? (
                    <FaChevronDown className="section-chevron" />
                  ) : (
                    <FaChevronUp className="section-chevron" />
                  )}
                </button>
                {!collapsedSections.price && (
                  <div className="section-content-body">
                    <div className="price-chips-grid">
                      {priceRanges.map((range) => (
                        <button
                          key={range.id}
                          type="button"
                          className={`price-grid-btn ${
                            selectedPriceRange === range.id ? "active" : ""
                          }`}
                          onClick={() => handlePriceRangeChange(range.id)}
                        >
                          {range.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Accordion Section 4: Best Sellers Widget (Collapsible) */}
              <div className="unified-filter-section bestsellers-section">
                <button
                  className="section-header-btn"
                  onClick={() => toggleSection("bestsellers")}
                  type="button"
                >
                  <div className="section-title-wrap">
                    <span className="section-bullet"></span>
                    <span className="section-title">Popular Divine Picks</span>
                  </div>
                  {collapsedSections.bestsellers ? (
                    <FaChevronDown className="section-chevron" />
                  ) : (
                    <FaChevronUp className="section-chevron" />
                  )}
                </button>
                {!collapsedSections.bestsellers && (
                  <div className="section-content-body">
                    <div className="bestseller-list">
                      {bestSellers && bestSellers.length > 0 ? (
                        bestSellers.slice(0, 3).map((product, index) => {
                          const encryptedId = encryptId(product.id || index);
                          const prodImg = getSafeImageUrl(product.image, 0);
                          return (
                            <Link
                              to={`/productdetails/${encryptedId}`}
                              className="bestseller-item"
                              key={product.id || index}
                            >
                              <div className="bestseller-img-wrap">
                                <img src={prodImg} alt={product.productName} />
                              </div>
                              <div className="bestseller-info">
                                <h4 className="bestseller-name">
                                  {product.productName}
                                </h4>
                                <div className="bestseller-price-row">
                                  <span className="bestseller-price">
                                    ₹{product.offerPrice || product.price}
                                  </span>
                                  {product.offerPrice &&
                                    product.price > product.offerPrice && (
                                      <span className="bestseller-oldprice">
                                        ₹{product.price}
                                      </span>
                                    )}
                                </div>
                                <div className="bestseller-stars">
                                  <FaStar />
                                  <FaStar />
                                  <FaStar />
                                  <FaStar />
                                  <FaStar />
                                </div>
                              </div>
                            </Link>
                          );
                        })
                      ) : (
                        <p className="no-bestseller-text">
                          Popular picks loading...
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Spiritual Assurance Banner */}
            <div className="sidebar-assurance-box">
              <FaShieldAlt className="assurance-icon" />
              <div>
                <h4>100% Vedic Sanctified</h4>
                <p>All items energized by verified Vedic Pandits.</p>
              </div>
            </div>
          </aside>

          {/* 📦 RIGHT CONTENT: SEARCH BAR + PRODUCT GRID */}
          <main className="ecom-products-content">
            {/* Search & Sort Refinement Bar */}
            <div className="refine-search-card">
              <div className="search-bar-row">
                <div className="modern-search-input">
                  <FaSearch className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search spiritual idols, gemstones, yantras, pooja kits..."
                    value={filter}
                    onChange={handleFilterChange}
                  />
                  {filter && (
                    <button
                      className="clear-search-btn"
                      onClick={handleClearSearch}
                    >
                      <FaTimes />
                    </button>
                  )}
                </div>

                <div className="sort-dropdown-wrap">
                  <span className="sort-label">Sort By:</span>
                  <select
                    id="sortBy"
                    className="modern-select"
                    value={sortBy}
                    onChange={handleSortChange}
                  >
                    <option value="default">✨ Featured & Recommended</option>
                    <option value="price-asc">💵 Price: Low to High</option>
                    <option value="price-desc">💎 Price: High to Low</option>
                    <option value="name-asc">🔤 Name: (A to Z)</option>
                    <option value="name-desc">🔤 Name: (Z to A)</option>
                  </select>
                </div>
              </div>

              {/* ⚡ Quick Horizontal Category Pills Bar */}
              <div className="quick-category-scroll-bar">
                {categoryList.map((cat) => (
                  <button
                    key={cat.name}
                    type="button"
                    className={`quick-cat-pill ${
                      selectedCategory === cat.value ? "active" : ""
                    }`}
                    onClick={() => handleCategoryChange(cat.value)}
                  >
                    <span className="quick-cat-icon">{cat.icon}</span>
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>

              {/* Active Filter Tags */}
              <div className="active-filters-row">
                <span className="results-count">
                  Showing <strong>{processedProducts.length}</strong> Divine Items
                </span>

                <div className="filter-pill-tags">
                  {debouncedSearch && (
                    <span className="filter-tag">
                      Search: "{debouncedSearch}"{" "}
                      <FaTimes onClick={handleClearSearch} />
                    </span>
                  )}
                  {selectedCategory && (
                    <span className="filter-tag">
                      Category: {selectedCategory}{" "}
                      <FaTimes onClick={() => handleCategoryChange("")} />
                    </span>
                  )}
                  {selectedMaterial && (
                    <span className="filter-tag">
                      Material: {selectedMaterial}{" "}
                      <FaTimes onClick={() => handleMaterialChange(selectedMaterial)} />
                    </span>
                  )}
                  {selectedPriceRange !== "all" && (
                    <span className="filter-tag">
                      Price: {priceRanges.find((r) => r.id === selectedPriceRange)?.label}{" "}
                      <FaTimes onClick={() => handlePriceRangeChange("all")} />
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {isLoading && page === 1 ? (
              <div className="ecom-loading-state">
                <TailSpin height="50" width="50" color="#ea580c" />
                <p>Invoking Sacred Catalog...</p>
              </div>
            ) : processedProducts.length === 0 ? (
              <div className="ecom-empty-state">
                <div className="empty-icon-wrap">
                  <FaTag />
                </div>
                <h3>No Sacred Items Found</h3>
                <p>
                  We couldn't find any products matching your current filters.
                  Try clearing some filters or searching for something else.
                </p>
                <button
                  className="empty-reset-btn"
                  onClick={handleResetFilters}
                >
                  View All Products
                </button>
              </div>
            ) : (
              <div className="products-grid">
                {processedProducts.map((product, index) => {
                  const encryptedId = encryptId(product.id);
                  const isLast = index === processedProducts.length - 1;
                  const imageUrl = getSafeImageUrl(product.image, 0);
                  const originalPrice = Number(product.price) || 0;
                  const offerPrice = Number(product.offerPrice) || originalPrice;
                  const hasDiscount =
                    originalPrice > offerPrice && offerPrice > 0;
                  const discountPercent = hasDiscount
                    ? Math.round(
                        ((originalPrice - offerPrice) / originalPrice) * 100
                      )
                    : 0;

                  return (
                    <div
                      className="ecom-product-card"
                      key={product.id || index}
                      ref={isLast ? lastProductRef : null}
                    >
                      {/* Product Image & Auto-Sliding Badges */}
                      <Link
                        to={`/productdetails/${encryptedId}`}
                        className="product-card-img-link"
                      >
                        <ProductCardImageSlider
                          images={getAllSafeImageUrls(product.image)}
                          productName={product.productName}
                          hasDiscount={hasDiscount}
                          discountPercent={discountPercent}
                        />
                      </Link>

                      {/* Card Content */}
                      <div className="product-card-body">
                        {/* Rating */}
                        <div className="card-rating-row">
                          <div className="stars-wrap">
                            <FaStar className="star filled" />
                            <FaStar className="star filled" />
                            <FaStar className="star filled" />
                            <FaStar className="star filled" />
                            <FaStar className="star filled" />
                          </div>
                          <span className="rating-num">
                            {product.average_rating
                              ? parseFloat(product.average_rating).toFixed(1)
                              : "4.8"}
                          </span>
                        </div>

                        {/* Title */}
                        <Link
                          to={`/productdetails/${encryptedId}`}
                          className="product-card-title-link"
                        >
                          <h3 className="product-card-title" title={product.productName}>
                            {product.productName || "Spiritual Offering"}
                          </h3>
                        </Link>

                        {/* Price Row */}
                        <div className="product-card-price-row">
                          <div className="price-group">
                            <span className="current-price">
                              ₹{offerPrice.toLocaleString("en-IN")}
                            </span>
                            {hasDiscount && (
                              <span className="original-price">
                                ₹{originalPrice.toLocaleString("en-IN")}
                              </span>
                            )}
                          </div>
                          {hasDiscount && (
                            <span className="save-tag">
                              Save ₹{(originalPrice - offerPrice).toLocaleString("en-IN")}
                            </span>
                          )}
                        </div>

                        {/* Action CTA Button */}
                        <button
                          className="card-add-btn"
                          onClick={(e) => handleAddToCart(e, product)}
                          disabled={loading === product.id}
                        >
                          {loading === product.id ? (
                            <>
                              <TailSpin height="16" width="16" color="#fff" />
                              Adding...
                            </>
                          ) : (
                            <>
                              <FaShoppingCart /> Add to Cart
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Bottom loader on infinite scroll */}
            {isLoading && page > 1 && hasMore && (
              <div className="ecom-bottom-loader">
                <TailSpin height="40" width="40" color="#ea580c" />
                <p>Loading more sacred items...</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

const CheckIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ marginRight: "3px" }}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default EcommerceNew2;
