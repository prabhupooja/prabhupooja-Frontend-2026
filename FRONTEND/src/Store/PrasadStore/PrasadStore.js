import { create } from "zustand";
import api from "../../Components/Axios/api";

const usePrasadStore = create((set) => ({
  prasad: [],
  prasadDetails: null,
  prasadBooking: [],
  loading: false,
  error: null,

  prasadGet: async () => {
    try {
      set({ loading: true, error: null });
      const response = await api.get("/user/prasad/get");
      if (response.data.success) {
        set({ prasad: response.data.data, loading: false });
        return response.data.data;
      } else {
        set({ loading: false, error: response.data.message || "Failed to fetch prasad list" });
      }
    } catch (error) {
      console.error("Error fetching prasad list:", error);
      set({ loading: false, error: error.message || "Failed to fetch prasad list" });
      throw error;
    }
  },

  getPrasadById: async (id) => {
    try {
      set({ loading: true, error: null });
      // Clean ID if alphanumeric or encrypted
      const cleanId = id ? id.toString().split("-").pop() : id;
      const response = await api.get(`/user/prasad/get/${cleanId}`);
      if (response.data.success) {
        const item = response.data.data;
        // Parse JSON fields safely if string
        if (typeof item.weight_options === "string") {
          try {
            item.weight_options = JSON.parse(item.weight_options);
          } catch {
            item.weight_options = [];
          }
        }
        if (typeof item.inclusions === "string") {
          try {
            item.inclusions = JSON.parse(item.inclusions);
          } catch {
            item.inclusions = [];
          }
        }
        if (typeof item.benefits === "string") {
          try {
            item.benefits = JSON.parse(item.benefits);
          } catch {
            item.benefits = [];
          }
        }
        set({ prasadDetails: item, loading: false });
        return item;
      } else {
        set({ loading: false, error: response.data.message || "Prasad not found" });
        return null;
      }
    } catch (error) {
      console.error("Error fetching prasad detail:", error);
      set({ loading: false, error: error.message || "Error loading prasad details" });
      return null;
    }
  },

  clearPrasadDetails: () => set({ prasadDetails: null, error: null }),
}));

export default usePrasadStore;