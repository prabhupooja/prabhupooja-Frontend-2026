import { create } from "zustand";
import api from "../../Components/Axios/api";

const useOnlinePoojaStore = create((set) => ({
  averageRating: 0,
  totalRatings: 0,
  feedbacks: [],
  bookingDate:null,

  fetchPujaRatings: async (id, problemName) => {
    try {
      const response = await api.get(`/feedback/Problemrating/${id}/${problemName}`);
      if (response.data.success) {
        const { averageRating, totalRatings, feedbacks } = response.data.data;
        set({ averageRating, totalRatings, feedbacks }); 
        return response;
      }
    } catch (error) {
      console.error("Error fetching ratings:", error);
    }
  },

  fetchBookings: async (userId, id) => {
    // console.log("Fetching bookings for:", userId, id);
  
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in localStorage");
      return null;
    }
  
    try {
      const response = await api.get(`/problem/getbookingdate/${id}/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // console.log(response.data.data[0].bookingdate, "hhhhhhhhhh")

      set({bookingDate: response.data.data[0].bookingdate }); 
      
      return response.data; 
    } catch (err) {
      console.error("Error fetching booking date:", err);
      return null;
    }
  }
  
}));

export default useOnlinePoojaStore;
