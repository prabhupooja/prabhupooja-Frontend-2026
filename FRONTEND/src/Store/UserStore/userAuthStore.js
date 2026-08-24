import { create } from 'zustand';
import api from "../../Components/Axios/api";

const useAuthStore = create((set) => ({
  user1: null,
  error: null,
  isLoggin: false,
  isLoading: false,
  Loading: false,
  isMember: false,
  expiryDate: null,
  paymentDate: null,
  isLoginPopup: false,
  isOtpPopup: false,
  notificationsCount: 0,

  setIsLoginPopup: (value) => set({ isLoginPopup: value }),

  setIsOtpPopup: (value) => set({ isOtpPopup: value }),

  setIsLoggin: (value) => set({ isLoggin: value }),

  setIsLoading: (value) => set({ isLoading: value }),

  setIsMember: (value) => set({ isMember: value }),

  login: async (payload) => {
    set({ error: null, isLoading: true });
    try {
      const response = await api.post("/users/login", payload);
      return response;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Login failed",
        isLoggin: false,
      });
      return error;
    } finally {
      set({ isLoading: false });
    }
  },

  userOTP: async (payload) => {
    set({ error: null, Loading: true });
    try {
      const response = await api.post("/users/verifyOtp", payload);
      const token = response.data.auth;
      localStorage.setItem("token", token);
      set({ user1: response.data, isLoggin: true });
      return response;
    } catch (error) {
      set({
        error: error.response?.data?.message || "OTP verification failed",
      });
      throw error;
    } finally {
      set({ Loading: false });
    }
  },

  register: async (payload) => {
    set({ error: null, isLoading: true });
    try {
      const response = await api.post("/users/register", payload);
      return response;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Registration failed",
      });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  userGet: async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token provided.");
      return;
    }
    set({ isLoading: true });
    try {
      const response = await api.get("/users/getUserByToken", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response?.data) {
        set({ user1: response.data.data, isLoggin: true });
      } else {
        console.error("Failed to retrieve user:", response?.data?.message);
        localStorage.removeItem("token");
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching user data:", error);
      localStorage.removeItem("token");
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  getPrimeMember: async (userId) => {
    const token = localStorage.getItem("token");
    try {
      if (!token) {
        console.error("User or token is missing");
        return;
      }

      const response = await api.get(`/muhurat/member/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log(response.data, "jhhhhkppppppppppppppp");
      if (response.data.success) {
        set({
          expiryDate: response.data.data.expiry_date,
          paymentDate: response.data.data.payment_date,
        });
      }
    } catch (error) {
      console.error("Error fetching member data:", error);
    }
  },

  updateUserData: async (userId, payload) => {
    try {
      // console.log(userId, payload);
      set({ isLoading: true });
      const token = localStorage.getItem("token");
      const response = await api.put(`/users/update/${userId}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      console.error("Error updating user:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  userUploadProfile: async (userId, payload) => {
    try {
      if (!userId) throw new Error("User ID is missing");

      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");
      const response = await api.put(`users/updateimage/${userId}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // console.log(response.data, "User Image updated successfully")

      return response;
    } catch (error) {
      console.error(
        "Error updating user profile:",
        error.response?.data || error.message
      );
      return { success: false, error: error.response?.data || error.message };
    }
  },
  deleteUser: async (userId) => {
    try {
      // console.log(userId);
      if (!userId) throw new Error("User ID is missing");

      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");
      const response = await api.delete(`/users/deleteProfile/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // console.log(response.data, "User deleted successfully");
      set({ user1: null, error: null, isLoggin: false });
      localStorage.removeItem("token");
      return response;
    } catch (error) {
      console.error(
        "Error deleting user profile:",
        error.response?.data || error.message
      );
      return { success: false, error: error.response?.data || error.message };
    }
  },
  
  logout: () => set({ user1: null, error: null, isLoggin: false }),
}));

export default useAuthStore;
