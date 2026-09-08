import { create } from "zustand";
import api from "../../Components/Axios/api";
import axios from "axios";

const defaultEcommerceBanners = [
  {
    id: "default-ecom-1",
    title: "100% Authentic Vedic & Spiritual Store",
    image: "https://prabhupooja1.s3.ap-south-1.amazonaws.com/ecommerce-banners/1788856047252-ganesh%20ji%20banner.png",
    redirect_url: ""
  }
];

const useEcommerceBannerStore = create((set) => ({
  banners: defaultEcommerceBanners,
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
        set({ banners: data, loading: false });
      } else {
        set({ banners: defaultEcommerceBanners, loading: false });
      }
      return { success: true, data };
    } catch (err) {
      set({ banners: defaultEcommerceBanners, loading: false });
      return { success: false, data: defaultEcommerceBanners };
    }
  }
}));

export default useEcommerceBannerStore;
