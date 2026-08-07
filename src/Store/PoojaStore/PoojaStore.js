import { create } from "zustand";
import api from "../../Components/Axios/api";

const usePujaStore = create((set) => ({
  pujaDetails: null,
  error: null,
  loading: false,
  averageRating: 0,
  totalRatings: 0,
  feedbackData: [],
  bookingDate: null,

  getPoojaDetails: async (pujaId) => {
    set({ loading: true, error: null }); // Start loading and reset error
    try {
      const response = await api.get(`/user/onlinePuja/get/${pujaId}`);
      if (response?.data.success) {
        set({
          pujaDetails: response.data.data,
          loading: false
        });
        // console.log(response.data.data, "uhsdffsfsk")
      } else {
        set({ error: "Failed to fetch puja details", loading: false });
      }
    } catch (error) {
      console.error("Error fetching puja details:", error);
      set({ error: error.message || "An error occurred", loading: false });
    }
  },

  getPoojaRating: async (poojaId, problemName) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/feedback/rating/${poojaId}/${problemName}`);
      if (response.data.success) {
        set({
          feedbackData: response.data.data.feedbacks,
          averageRating: response.data.data.averageRating,
          totalRatings: response.data.data.totalRatings,
          loading: false
        });
      } else {
        set({ error: "Failed to fetch ratings", loading: false });
      }
      return response;
    } catch (error) {
      console.error("Error fetching ratings:", error);
      set({ error: error.message || "An error occurred", loading: false });
    }
  },

  getBookingDate: async (poojaId, userId) => {
    try {
      set({ loading: true });

      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await api.get(`/pooja/bookingDate/${poojaId}/${userId}`, { headers });

      if (response.data.success) {
        const bookingData = response.data.data;
        if (bookingData.length === 0) {
          set({ bookingDate: null });
        } else {
          set({ bookingDate: bookingData[0].bookingdate });
        }
      } else {
        set({ bookingDate: null });
      }

      return response;
    } catch (error) {
      console.error("Error fetching bookingDate:", error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));

export default usePujaStore;
