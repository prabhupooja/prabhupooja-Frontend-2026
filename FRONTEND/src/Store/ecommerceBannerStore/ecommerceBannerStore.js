import { create } from "zustand";
import api from "../../Components/Axios/api";
import axios from "axios";

// Default Demo Banner with Deity Asset & Dynamic Promotional Data
const defaultEcommerceBanners = [
  {
    id: "default-ecom-1",
    title: "श्री गणेश मूर्ति",
    smallHeading: "॥ ॐ गं गणपतये नमः ॥",
    subtitle: "भक्ति से सजाएं अपना घर, गणेश जी के आशीर्वाद से भरें जीवन",
    image: "https://prabhupooja1.s3.ap-south-1.amazonaws.com/products/1788864543885-test_banner.png",
    offer: {
      enabled: true,
      label: "विशेष गणेश उत्सव ऑफर",
      title: "विशेष गणेश उत्सव ऑफर",
      prefix: "UPTO",
      discount: "50%",
      value: "50%",
      suffix: "OFF",
    },
    features: [
      { icon: "leaf", title: "100% प्राकृतिक", subtitle: "मिट्टी से निर्मित" },
      { icon: "hand", title: "हस्तनिर्मित", subtitle: "Handcrafted" },
      { icon: "eco", title: "पर्यावरण के", subtitle: "अनुकूल" },
      { icon: "delivery", title: "सुरक्षित पैकिंग", subtitle: "और तेज डिलीवरी" },
    ],
    cta: {
      text: "अभी खरीदें",
      link: "/ecommerce?category=Idols",
    },
    theme: {
      primaryColor: "#781005",
      accentColor: "#d97706",
      textColor: "#451a03",
      backgroundStyle: "golden-spiritual",
    },
    redirect_url: "/ecommerce?category=Idols",
  },
];

const normalizeBanner = (item, idx) => {
  if (!item) return null;

  // Resolve Image Asset safely
  const rawImg =
    item.image ||
    item.imageUrl ||
    item.bannerImage ||
    item.banner ||
    item.deity_image ||
    item.deityImage ||
    "https://prabhupooja1.s3.ap-south-1.amazonaws.com/products/1788864543885-test_banner.png";

  const imgUrl =
    typeof rawImg === "string"
      ? rawImg.startsWith("http://") || rawImg.startsWith("https://") || rawImg.startsWith("data:") || rawImg.startsWith("blob:")
        ? rawImg
        : rawImg.startsWith("/")
        ? `${process.env.REACT_APP_BASE_URL || ""}${rawImg}`
        : `${process.env.REACT_APP_BASE_URL || ""}/${rawImg}`
      : rawImg;

  // Extract / Parse Features safely
  let parsedFeatures = [];
  if (Array.isArray(item.features)) {
    parsedFeatures = item.features;
  } else if (typeof item.features === "string") {
    try {
      parsedFeatures = JSON.parse(item.features);
    } catch (_) {
      parsedFeatures = [];
    }
  }

  // Extract / Parse Theme safely
  let parsedTheme = {
    primaryColor: "#781005",
    accentColor: "#d97706",
    textColor: "#451a03",
    backgroundStyle: "golden-spiritual",
  };
  if (item.theme && typeof item.theme === "object") {
    parsedTheme = { ...parsedTheme, ...item.theme };
  } else if (typeof item.theme === "string") {
    try {
      parsedTheme = { ...parsedTheme, ...JSON.parse(item.theme) };
    } catch (_) {}
  }

  // Extract / Parse Offer safely
  let offerObj = null;
  if (item.offer && typeof item.offer === "object") {
    offerObj = item.offer;
  } else if (typeof item.offer === "string") {
    try {
      offerObj = JSON.parse(item.offer);
    } catch (_) {}
  }

  const offerLabel =
    offerObj?.label ||
    offerObj?.title ||
    item.offer_title ||
    item.offerTitle ||
    item.offer_label ||
    item.offerLabel ||
    "विशेष गणेश उत्सव ऑफर";

  const offerDiscount =
    offerObj?.discount ||
    offerObj?.value ||
    item.offer_value ||
    item.offerValue ||
    item.offer_discount ||
    item.offerDiscount ||
    "50%";

  const offerPrefix =
    offerObj?.prefix ||
    item.offer_prefix ||
    item.offerPrefix ||
    "UPTO";

  const offerSuffix =
    offerObj?.suffix ||
    item.offer_suffix ||
    item.offerSuffix ||
    "OFF";

  const offerEnabled =
    offerObj?.enabled !== undefined
      ? Boolean(offerObj.enabled)
      : item.badge_enabled !== undefined
      ? Boolean(item.badge_enabled)
      : Boolean(offerDiscount);

  return {
    id: item.id || item._id || `ecom-banner-${idx}`,
    title: item.title || "श्री गणेश मूर्ति",
    smallHeading:
      item.smallHeading ||
      item.small_heading ||
      item.shloka ||
      item.eyebrow ||
      "॥ ॐ गं गणपतये नमः ॥",
    subtitle:
      item.subtitle ||
      "भक्ति से सजाएं अपना घर, गणेश जी के आशीर्वाद से भरें जीवन",
    image: imgUrl,
    offer: {
      enabled: offerEnabled,
      label: offerLabel,
      title: offerLabel,
      prefix: offerPrefix,
      discount: offerDiscount,
      value: offerDiscount,
      suffix: offerSuffix,
    },
    features:
      parsedFeatures.length > 0
        ? parsedFeatures
        : [
            { icon: "leaf", title: "100% प्राकृतिक", subtitle: "मिट्टी से निर्मित" },
            { icon: "hand", title: "हस्तनिर्मित", subtitle: "Handcrafted" },
            { icon: "eco", title: "पर्यावरण के", subtitle: "अनुकूल" },
            { icon: "delivery", title: "सुरक्षित पैकिंग", subtitle: "और तेज डिलीवरी" },
          ],
    cta: {
      text:
        item.cta?.text ||
        item.button_text ||
        item.buttonText ||
        "अभी खरीदें",
      link:
        item.cta?.link ||
        item.button_link ||
        item.buttonLink ||
        item.redirect_url ||
        item.redirectUrl ||
        "/ecommerce?category=Idols",
    },
    theme: parsedTheme,
    redirect_url:
      item.redirect_url ||
      item.redirectUrl ||
      item.cta?.link ||
      item.button_link ||
      "/ecommerce?category=Idols",
  };
};


const useEcommerceBannerStore = create((set) => ({
  banners: defaultEcommerceBanners.map(normalizeBanner),
  loading: false,

  fetchEcommerceBanners: async () => {
    try {
      set({ loading: true });
      let data = [];
      try {
        const response = await api.get("/ecommerce-banner/get");
        data = response?.data?.data || [];
      } catch (err) {
        try {
          const directRes = await axios.get("http://localhost:3002/api/v1/ecommerce-banner/get");
          data = directRes?.data?.data || [];
        } catch (_) {}
      }

      if (Array.isArray(data) && data.length > 0) {
        const normalized = data.map(normalizeBanner).filter(Boolean);
        set({ banners: normalized.length > 0 ? normalized : defaultEcommerceBanners.map(normalizeBanner), loading: false });
      } else {
        set({ banners: defaultEcommerceBanners.map(normalizeBanner), loading: false });
      }
      return { success: true, data };
    } catch (err) {
      set({ banners: defaultEcommerceBanners.map(normalizeBanner), loading: false });
      return { success: false, data: defaultEcommerceBanners };
    }
  }
}));

export default useEcommerceBannerStore;

