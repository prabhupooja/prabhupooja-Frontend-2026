import { create } from "zustand";
import api from "../../Components/Axios/api";

const useEventStore = create((set) => ({
  latestEvents: [],
  pastEvents: [],
  currentEvent: null,
  loading: false,
  error: null,

  // 1. Fetch Latest Events
  fetchLatestEvents: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get("/events/latest");
      set({ latestEvents: response.data?.data || [], loading: false });
      return response.data;
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  // 2. Fetch Past Events
  fetchPastEvents: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get("/events/past");
      set({ pastEvents: response.data?.data || [], loading: false });
      return response.data;
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  // 3. Fetch Single Event Details
  fetchEventById: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/events/get/${id}`);
      set({ currentEvent: response.data?.data || null, loading: false });
      return response.data;
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  // 4. Register / Book for an Event (Ganesh Chaturthi, etc.)
  registerForEvent: async (bookingData) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post("/events/register", bookingData);
      set({ loading: false });
      return response.data;
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },
}));

export default useEventStore;
