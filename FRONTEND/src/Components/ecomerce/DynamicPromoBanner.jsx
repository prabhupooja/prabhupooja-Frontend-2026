import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaLeaf,
  FaHandsHelping,
  FaTruck,
  FaShieldAlt,
  FaStar,
  FaSeedling,
  FaArrowRight,
  FaHeart,
  FaAward,
  FaRecycle,
  FaCheck,
} from "react-icons/fa";
import "./dynamicPromoBanner.css";

// Dynamic Feature Icon Resolver
const getFeatureIcon = (iconName) => {
  switch (iconName?.toLowerCase()) {
    case "leaf":
    case "natural":
    case "prakritik":
      return <FaLeaf />;
    case "hand":
    case "handmade":
    case "handcrafted":
    case "hands":
      return <FaHandsHelping />;
    case "truck":
    case "delivery":
    case "shipping":
      return <FaTruck />;
    case "shield":
    case "safe":
    case "secure":
      return <FaShieldAlt />;
    case "award":
    case "star":
    case "quality":
      return <FaStar />;
    case "heart":
      return <FaHeart />;
    case "eco":
    case "recycle":
      return <FaRecycle />;
    default:
      return <FaCheck />;
  }
};

const DynamicPromoBanner = ({ banner, onBannerClick }) => {
  const navigate = useNavigate();

  if (!banner) return null;

  // Extract structured dynamic promotional banner data from API/Store
  const title = banner.title || "";
  const eyebrow =
    banner.eyebrow ||
    banner.shloka ||
    banner.smallHeading ||
    banner.small_heading ||
    "";
  const subtitle = banner.subtitle || "";
  const image =
    banner.image ||
    banner.imageUrl ||
    banner.bannerImage ||
    banner.deity_image ||
    "https://prabhupooja1.s3.ap-south-1.amazonaws.com/products/1788864543885-test_banner.png";

  const offer = banner.offer || null;
  const isOfferValid = Boolean(
    offer &&
    offer.enabled !== false &&
    (offer.discount || offer.value || offer.label || offer.title)
  );

  const features = Array.isArray(banner.features)
    ? banner.features.filter((f) => f && (f.title || f.name))
    : [];

  const ctaText =
    banner.cta?.text ||
    banner.button_text ||
    banner.buttonText ||
    "अभी खरीदें";
  const ctaLink =
    banner.cta?.link ||
    banner.button_link ||
    banner.buttonLink ||
    banner.redirect_url ||
    banner.redirectUrl ||
    "/ecommerce?category=Idols";

  const theme = banner.theme || {
    primaryColor: "#781005",
    accentColor: "#d97706",
    textColor: "#451a03",
    backgroundStyle: "golden-spiritual",
  };

  const handleCtaClick = (e) => {
    e.stopPropagation();
    if (onBannerClick) {
      onBannerClick(banner);
    }
    if (!ctaLink) return;
    if (ctaLink.startsWith("http")) {
      window.open(ctaLink, "_blank", "noopener,noreferrer");
    } else {
      navigate(ctaLink.startsWith("/") ? ctaLink : `/${ctaLink}`);
    }
  };

  // Type 1: Full-Width Graphic Banner (when explicitly marked as graphic or when no dynamic content exists)
  const isExplicitGraphic = Boolean(
    banner.banner_type === "graphic" ||
    banner.bannerType === "graphic" ||
    banner.is_graphic === true ||
    (banner.isDynamic === false && !eyebrow && !subtitle && features.length === 0)
  );

  if (isExplicitGraphic && image) {
    return (
      <div className="dynamic-promo-banner-raw" onClick={handleCtaClick}>
        <picture>
          {banner.mobileImage && (
            <source media="(max-width: 768px)" srcSet={banner.mobileImage} />
          )}
          <img
            src={image}
            alt={title || "Prabhu Pooja Offer Banner"}
            className="dynamic-promo-raw-img"
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://prabhupooja1.s3.ap-south-1.amazonaws.com/products/1788864543885-test_banner.png";
            }}
          />
        </picture>
      </div>
    );
  }

  // Type 2: Dynamic Curved-Split Promotional Banner (Default)
  return (
    <div
      className="dynamic-promo-banner-card"
      onClick={handleCtaClick}
      style={{
        "--banner-primary": theme.primaryColor || "#781005",
        "--banner-accent": theme.accentColor || "#d97706",
        "--banner-text": theme.textColor || "#451a03",
      }}
    >
      {/* Hidden SVG Definitions for Arc ClipPath */}
      <svg width="0" height="0" className="banner-svg-defs" aria-hidden="true">
        <defs>
          <clipPath id="bannerArcClip" clipPathUnits="objectBoundingBox">
            <path d="M 0,0 L 0.82,0 C 1.0,0.28 1.0,0.72 0.80,1 L 0,1 Z" />
          </clipPath>
        </defs>
      </svg>

      {/* Background Spiritual Glow & Delicate Mandala Accent (Pure CSS) */}
      <div className="banner-spiritual-ambient-light" aria-hidden="true" />
      <div className="banner-mandala-watermark" aria-hidden="true" />

      {/* ============================================================
          LEFT SECTION: DEDICATED IMAGE AREA WITH LARGE CURVED ARC
          ============================================================ */}
      <div className="banner-image-wrapper">
        {/* Clipped frame: Bounds image and halo lighting to the curved arc */}
        <div className="banner-image-clipped-frame">
          <div className="deity-ambient-halo" aria-hidden="true" />
          <div className="deity-warm-glow" aria-hidden="true" />

          {/* Uploaded Deity / Product Image (Never cropped, never stretched) */}
          {image && (
            <img
              src={image}
              alt={title || "Spiritual Idol"}
              className="banner-product-image"
              loading="lazy"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://prabhupooja1.s3.ap-south-1.amazonaws.com/products/1788864543885-test_banner.png";
              }}
            />
          )}
        </div>

        {/* Smooth Golden Arc Curved Divider Line along the boundary */}
        <svg
          className="banner-curve-divider-svg"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M 82,0 C 100,28 100,72 80,100"
            className="curve-gold-stroke"
          />
          <path
            d="M 82,0 C 100,28 100,72 80,100"
            className="curve-gold-glow"
          />
        </svg>
      </div>

      {/* ============================================================
          RIGHT SECTION: DYNAMIC CONTENT AREA
          ============================================================ */}
      <div
        className="banner-content"
        style={{ color: theme.textColor || "#451a03" }}
      >
        {/* Floating Royal Scalloped Seal Offer Badge (Top-Right) */}
        {isOfferValid && (
          <div
            className="banner-offer-seal-badge"
            style={{ backgroundColor: theme.primaryColor || "#781005" }}
          >
            <div className="seal-inner-border">
              {(offer.label || offer.title) && (
                <span className="seal-offer-title">
                  {offer.label || offer.title}
                </span>
              )}
              {offer.prefix && (
                <span className="seal-offer-prefix">{offer.prefix}</span>
              )}
              {(offer.discount || offer.value) && (
                <span className="seal-offer-value">
                  {offer.discount || offer.value}
                </span>
              )}
              {offer.suffix && (
                <span className="seal-offer-suffix">{offer.suffix}</span>
              )}
            </div>
          </div>
        )}

        {/* 1. Small Shloka / Eyebrow with Balanced Horizontal Gold Lines */}
        {eyebrow && (
          <div className="banner-shloka-heading">
            <span className="shloka-side-line left-line" />
            <span className="shloka-text">{eyebrow}</span>
            <span className="shloka-side-line right-line" />
          </div>
        )}

        {/* 2. Main Dynamic Title with Diamond Ornaments */}
        {title && (
          <h2 className="banner-main-title">
            <span className="title-ornament-left">❖</span>
            <span className="title-main-text">{title}</span>
            <span className="title-ornament-right">❖</span>
          </h2>
        )}

        {/* 3. Dynamic Subtitle Description with Side Flank Ornaments */}
        {subtitle && (
          <p className="banner-subtitle">
            <span className="subtitle-flank">✤</span>
            <span>{subtitle}</span>
            <span className="subtitle-flank">✤</span>
          </p>
        )}

        {/* 4. Dynamic Features Strip with Circular Badges & Divider Pipes */}
        {features.length > 0 && (
          <div className="banner-features-grid">
            {features.map((feat, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <div className="feature-divider-pipe" />}
                <div className="banner-feature-chip">
                  <div
                    className="feature-icon-circle"
                    style={{
                      backgroundColor: theme.primaryColor || "#781005",
                    }}
                  >
                    {getFeatureIcon(feat.icon)}
                  </div>
                  <div className="feature-text-group">
                    <span className="feature-title">
                      {feat.title || feat.name}
                    </span>
                    {feat.subtitle && (
                      <span className="feature-subtitle">{feat.subtitle}</span>
                    )}
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
        )}

        {/* 5. Dynamic CTA Action Button */}
        {ctaText && (
          <div className="banner-cta-wrapper">
            <button
              type="button"
              className="banner-cta-button"
              onClick={handleCtaClick}
              style={{
                background: `linear-gradient(135deg, ${
                  theme.primaryColor || "#781005"
                } 0%, #4a0902 100%)`,
                borderColor: theme.accentColor || "#d97706",
              }}
            >
              <span>{ctaText}</span>
              <FaArrowRight className="cta-arrow-symbol" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DynamicPromoBanner;
