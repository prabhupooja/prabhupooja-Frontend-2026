import { create } from "zustand";
import api from "../../Components/Axios/api";

const useOnlinePujaStore = create((set) => ({
    bookings: [],
    error: null,
    loading: false,

    getUserPujaBookings: async (userId) => {

        const token = localStorage.getItem("token");

        set({ loading: true, error: null });

        try {
            const response = await api.get(`/pooja/getbookingid/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (response.data.success) {
                set({ bookings: response.data.data });
            } else {
                set({ error: "No bookings found" });
            }
            return response;
        } catch (err) {
            set({ error: "Error fetching booking details" });
        } finally {
            set({ loading: false });
        }
    },
}));

export default useOnlinePujaStore;
