import { create } from "zustand";
import api from "../../Axios/api";

const getSavedPandit = () => {
  try {
    const data = localStorage.getItem("panditUser");
    if (data && data !== "undefined" && data !== "null") {
      return JSON.parse(data);
    }
  } catch (e) {
    console.warn("Failed to parse saved panditUser", e);
  }
  return null;
};

const getSavedToken = () => {
  const token = localStorage.getItem("Pandittoken");
  if (!token || token === "undefined" || token === "null") {
    return null;
  }
  return token;
};

let inFlightPanditGet = null;

const useAuthStore = create((set, get) => ({
  pandit: getSavedPandit(),
  isLoggin: !!getSavedToken(),
  isLoading: false,
  loading1: false,
  error: null,
  comments: null,

  setIsLoggin: (value) => set({ isLoggin: value }),
  setIsLoading: (value) => set({ isLoading: value }),

  login: async (payload) => {
    set({ error: null, isLoading: true });
    try {
      const response = await api.post("/users/login", payload);
      return response;
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Login failed";
      set({
        error: errorMsg,
        isLoggin: false,
      });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  userOTP: async (payload) => {
    set({ error: null, Loading: true });
    try {
      const response = await api.post("/users/verifyOtp", payload);
      if (response.status === 200 || response.data?.success) {
        const token =
          response.data.auth ||
          response.data.token ||
          response.data.jwt ||
          (response.data.data && response.data.data.token);

        if (token && token !== "undefined" && token !== "null") {
          localStorage.setItem("Pandittoken", token);
        }

        const panditInfo =
          response.data.data ||
          response.data.pandit ||
          response.data.user ||
          null;

        if (panditInfo) {
          localStorage.setItem("panditUser", JSON.stringify(panditInfo));
          if (panditInfo.id) {
            localStorage.setItem("pandit_id", panditInfo.id.toString());
          }
          set({ pandit: panditInfo, isLoggin: true });
        } else {
          set({ isLoggin: true });
        }
      }

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

  panditGet: async () => {
    const token = getSavedToken();
    if (!token) {
      set({ loading1: false, pandit: null, isLoggin: false });
      return null;
    }

    // Reuse existing in-flight request to prevent infinite network loops
    if (inFlightPanditGet) {
      return inFlightPanditGet;
    }

    if (!get().pandit) {
      set({ loading1: true });
    }

    inFlightPanditGet = (async () => {
      try {
        const response = await api.get("/users/getPanditByToken", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const pData =
          response?.data?.data ||
          response?.data?.pandit ||
          response?.data?.user ||
          (response?.data && response.data.id ? response.data : null);

        if (pData) {
          set({ pandit: pData, isLoggin: true });
          try {
            localStorage.setItem("panditUser", JSON.stringify(pData));
            if (pData.id) {
              localStorage.setItem("pandit_id", pData.id.toString());
            }
          } catch (e) {}
        }

        return response?.data;
      } catch (error) {
        console.error("Error fetching pandit data:", error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem("Pandittoken");
          localStorage.removeItem("panditUser");
          localStorage.removeItem("pandit_id");
          set({ pandit: null, isLoggin: false });
        }
        return null;
      } finally {
        set({ loading1: false });
        inFlightPanditGet = null;
      }
    })();

    return inFlightPanditGet;
  },

  updatePandit: async (panditId, payload) => {
    try {
      const token = getSavedToken();
      const response = await api.put(`/pandit/update/${panditId}`, payload, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  deletePandit: async (panditId) => {
    try {
      const token = getSavedToken();
      const response = await api.delete(`/pandit/delete/${panditId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  getCommnet: async (panditId) => {
    try {
      const response = await api.get(`/panditComment/get/${panditId}`);
      if (response.data?.success || response.data) {
        set({ comments: response.data });
      }
    } catch (error) {
      console.error(error);
    }
  },

  logout: () => {
    localStorage.removeItem("Pandittoken");
    localStorage.removeItem("panditUser");
    localStorage.removeItem("pandit_id");
    set({ pandit: null, error: null, isLoggin: false });
  },
}));

export default useAuthStore;