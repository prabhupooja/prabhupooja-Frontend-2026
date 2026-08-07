import { create } from "zustand";
import { socket } from "../../utils/socket";
import api from "../../Components/Axios/api";
import logo from "../../Components/Assets/logo-Prabhupooja.png";
import notificationSound from "../../Components/Assets/Sounds/Notification.wav"

const useNotificationStore = create((set) => ({
  notifications: [],
  notificationsCount: 0,

  connectSocket: (userId) => {
    // console.log("Connecting to WebSocket for user:", userId);
    if (!socket.connected) {
      socket.connect();
      // console.log("WebSocket connecting...");
    }

    socket.off(`notification_${userId}`);

    socket.on("connect", () => {
      // console.log("Connected to WebSocket");
    });

    socket.on(`notification_${userId}`, (data) => {
      // console.log(` Notification Received:`, data);
      set((state) => ({
        notifications: [data, ...state.notifications],
        notificationsCount: state.notificationsCount + 1,
      }));

      if ("Notification" in window && Notification.permission === "granted") {
        const notification = new Notification("🔔 New Notification", {
          body: data.message || "You have a new notification!",
          icon: logo,
        });

        const audio = new Audio(notificationSound);
        audio.play().catch((error) => {
          // console.log("Audio playback failed:", error);
        });

        notification.onclick = () => {
          window.focus();
          window.location.href = "/";
        };
      }
    });

    socket.on("disconnect", () => console.log("WebSocket disconnected"));
    socket.on("error", (error) => console.error("WebSocket error:", error));
  },

  getUserNotifications: async (userId, page = 1, limit = 10) => {
    try {
      const response = await api.get(
        `/notifications/userNotification/${userId}?page=${page}&limit=${limit}`
      );

      // console.log(
      //   "Response from getUserNotifications:",
      //   response?.data?.notifications
      // );

      if (response?.data?.success) {
        set({
          notifications: response?.data?.notifications,
          notificationsCount: response.data.unreadtotalCount || 0,
        });
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching user notifications:", error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  markNotificationAsRead: async (notificationId) => {
    try {
      const response = await api.post(
        `/notifications/readNotification/${notificationId}`
      );
      return response.data;
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
      throw error;
    }
  },

  disconnectSocket: () => {
    socket.disconnect();
  },
  
}));

export default useNotificationStore;
