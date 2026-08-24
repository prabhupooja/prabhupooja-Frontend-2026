import { create } from "zustand";
import api from "../../Components/Axios/api";

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache
const _cacheTimestamps = {};

const isFresh = (key) => {
  const last = _cacheTimestamps[key];
  return last && Date.now() - last < CACHE_TTL;
};

const markFresh = (key) => {
  _cacheTimestamps[key] = Date.now();
};

const useHomeStore = create((set, get) => ({
  pujas: [],
  blogs: [],
  products: [],
  services: [],
  error: null,
  isLoading: false,
  OneBlog: [],
  tinybloglist: [],

  setProducts: (newProducts) =>
    set(() => ({
      products: Array.isArray(newProducts) ? newProducts : [],
    })),

  getOnlinePuja: async (force = false) => {
    if (!force && isFresh("pujas") && get().pujas?.length > 0) {
      return { data: { success: true, data: get().pujas } };
    }

    set({ isLoading: true });
    try {
      const response = await api.get("user/onlinePuja/get");
      if (response.data.success) {
        set({ pujas: response.data.data, error: null });
        markFresh("pujas");
      } else {
        set({
          error: response.data.message || "Failed to fetch Pooja services.",
        });
      }
      return response;
    } catch (err) {
      set({ error: err.message || "An error occurred." });
    } finally {
      set({ isLoading: false });
    }
  },

  getBlogs: async (force = false) => {
    if (!force && isFresh("blogs") && get().blogs?.length > 0) {
      return { data: { success: true, blogs: get().blogs } };
    }

    set({ isLoading: true });
    try {
      const response = await api.get("/blog/get");
      if (response.data.success) {
        set({ blogs: response.data.blogs, error: null });
        markFresh("blogs");
      } else {
        set({ error: response.data.message || "Failed to fetch blog." });
      }
    } catch (err) {
      set({ error: err.message || "An error occurred." });
    } finally {
      set({ isLoading: false });
    }
  },

  getProducts: async (force = false) => {
    if (!force && isFresh("products") && get().products?.length > 0) {
      return { data: { success: true, data: [get().products] } };
    }

    set({ isLoading: true });
    try {
      const response = await api.get("/products/get");
      if (response.data.success) {
        set({ products: response.data.data[0], error: null });
        markFresh("products");
      } else {
        set({ error: response.data.message || "Failed to fetch products." });
      }
    } catch (err) {
      set({ error: err.message || "An error occurred." });
    } finally {
      set({ isLoading: false });
    }
  },

  getFilterProducts: async ({
    page = 1,
    limit = 10,
    search = "",
    material = "",
  }) => {
    set({ isLoading: true });
    try {
      const response = await api.get("/products/getAllProductsByfillter", {
        params: { page, limit, search, material },
      });

      if (response?.data?.success) {
        return {
          success: true,
          productData: response?.data.productData,
          bestSellers: response?.data.bestSellerProducts || [],
        };
      } else {
        set({ error: response.data.message || "Failed to fetch products." });
        return { success: false };
      }
    } catch (err) {
      set({ error: err.message || "An error occurred." });
      return { success: false };
    } finally {
      set({ isLoading: false });
    }
  },

  getServices: async (force = false) => {
    if (!force && isFresh("services") && get().services?.length > 0) {
      return { data: { success: true, data: get().services } };
    }

    set({ isLoading: true });
    try {
      const response = await api.get("/user/services/get");
      if (response.data.success) {
        set({ services: response.data.data, error: null });
        markFresh("services");
      } else {
        set({ error: response.data.message || "Failed to fetch services." });
      }
    } catch (err) {
      set({ error: err.message || "An error occurred." });
    } finally {
      set({ isLoading: false });
    }
  },

  getOneBlogs: async (blogId) => {
    set({ isLoading: true });
    try {
      const response = await api.get(`/blog/getbyId/${blogId}`);
      if (response?.data?.success) {
        set({ OneBlog: response.data, error: null });
      } else {
        set({ error: response.data.message || "Failed to fetch blog." });
      }
      return response;
    } catch (err) {
      set({ error: err.message || "An error occurred." });
    } finally {
      set({ isLoading: false });
    }
  },

  getRecomendetionBlogs: async (keyword, blogId) => {
    set({ isLoading: true });
    try {
      const response = await api.get(`blog/getRelatedblog`, {
        params: { keyword, id: blogId },
      });

      if (response.data.success) {
        return response;
      } else {
        set({ error: response.data.message || "Failed to fetch blogs." });
        return null;
      }
    } catch (err) {
      set({ error: err.message || "An error occurred." });
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  likeBlog: async (blogId) => {
    try {
      const response = await api.post(`/blog/like/${blogId}`);
      if (response.data.success) {
        return response;
      }
      return response;
    } catch (err) {
      console.error(
        "Error liking the blog:",
        err.response ? err.response.data : err.message
      );
    }
  },

  Postcomment: async (payload, blogId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post(`/blog/comment/${blogId}`, payload);
      if (response?.data?.success) {
        set({ loading: false });
        return response;
      }
      set({ loading: false });
      return response;
    } catch (err) {
      set({
        loading: false,
        error: err?.response?.data?.message || "Something went wrong",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  getComment: async (blogId) => {
    try {
      const response = await api.get(`/blog/blogdetail/${blogId}`);
      if (response.data.success) {
        return response;
      }
      return response;
    } catch (err) {
      set({
        loading: false,
        error: err?.response?.data?.message || "Something went wrong",
      });
    }
  },

  gettinyblog: async (force = false) => {
    if (!force && isFresh("tinyblog") && get().tinybloglist?.length > 0) {
      return { data: { success: true, data: get().tinybloglist } };
    }

    try {
      const response = await api.get("/tinyblog/getall");
      set({ tinybloglist: response?.data?.data || [] });
      markFresh("tinyblog");
      return response;
    } catch (err) {
      set({
        tinybloglist: [],
        error: err?.response?.data?.message || err?.message || "Failed to fetch tiny blogs",
      });
      return null;
    }
  },

  getTinyBlogById: async (tinyId) => {
    try {
      const response = await api.get(`/tinyblog/getblogby/${tinyId}`);
      return response;
    } catch (err) {
      console.warn("Error in getTinyBlogById:", err?.message || err);
      return null;
    }
  },

  getValidCoupon: async (couponCode) => {
    try {
      const response = await api.get(`/coupon/getValidat-coupon/${couponCode}`);
      if (response?.data) {
        return response;
      }
      return null;
    } catch (err) {
      console.warn("Error in getValidCoupon:", err?.message || err);
      return null;
    }
  },

  getAllCouponBanner: async () => {
    try {
      const response = await api.get(`/users/getPublicOfferBanners?isMobile=0`);
      if (response?.data) {
        return response;
      }
      return null;
    } catch (err) {
      console.warn("Error in getAllCouponBanner:", err?.message || err);
      return null;
    }
  },
}));

export default useHomeStore;
