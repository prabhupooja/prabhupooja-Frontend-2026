import { create } from "zustand";
import api from "../../Components/Axios/api";

const useHomeStore = create((set) => ({
  pujas: [],
  blogs: [],
  products: [],
  services: [],
  error: null,
  isLoading: false,
  OneBlog: [],
  tinybloglist: [],

  setProducts: (newProducts) =>
    set((state) => ({
      products: Array.isArray(newProducts) ? newProducts : [],
    })),

  getOnlinePuja: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get("user/onlinePuja/get");
      if (response.data.success) {
        set({ pujas: response.data.data, error: null });
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

  getBlogs: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get("/blog/get");
      if (response.data.success) {
        set({ blogs: response.data.blogs, error: null });
      } else {
        set({ error: response.data.message || "Failed to fetch blog." });
      }
    } catch (err) {
      set({ error: err.message || "An error occurred." });
    } finally {
      set({ isLoading: false });
    }
  },

  getProducts: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get("/products/get");
      if (response.data.success) {
        set({ products: response.data.data[0], error: null });
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

  getServices: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get("/user/services/get");
      if (response.data.success) {
        set({ services: response.data.data, error: null });
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

  gettinyblog: async () => {
    try {
      const response = await api.get("/tinyblog/getall");
      set({ tinybloglist: response.data.data });
      return response;
    } catch (err) {
      // console.log(err);
      throw err;
    }
  },

  getTinyBlogById: async (tinyId) => {
    try {
      const response = await api.get(`/tinyblog/getblogby/${tinyId}`);
      return response;
    } catch (err) {
      // console.log(err);
      throw err;
    }
  },

  getValidCoupon: async (couponCode) => {
    // console.log(couponCode);
    try {
      const response = await api.get(`/coupon/getValidat-coupon/${couponCode}`);

      if (response.data) {
        return response;
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  getAllCouponBanner: async () => {
    try {
      const response = await api.get(`/users/getPublicOfferBanners?isMobile=0`);
      if (response.data) {
        return response;
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
}));

export default useHomeStore;
