import { create } from "zustand";
import { socket } from "../../Axios/soketpandit.js";
import api from "../../Axios/api.js";

const useSokectStore = create((set) => ({
  connectPandit: (pandit_id) => {
    try {
      if (!socket.connected) {
        socket.connect();
      }
      if (pandit_id) {
        socket.off(`pandit is online ${pandit_id}`);
      }
    } catch (e) {
      console.warn("Socket connect warning:", e);
    }
  },

  disconnectPandit: () => {
    try {
      if (socket.connected) {
        socket.disconnect();
      }
    } catch (e) {
      console.warn("Socket disconnect warning:", e);
    }
  },

  panditOnline: async (payload) => {
    try {
      const response = await api.post("/pandit/panditOnline", payload);
      return response;
    } catch (error) {
      console.error("panditOnline error:", error);
      throw error;
    }
  },
}));

export default useSokectStore;

