import { create } from "zustand";
import api from '../../Components/Axios/api';
import axios from "axios";

const useProblemPoojaStore = create((set) => ({
    ProblemPoojas: [],
    problem: null,
    loading: false,
    bookingDate: null,
    currentDate: null,
    bookings: [],

    getProblemPoojas: async (problemName) => {
        try {
            set({ loading: true });

            const token = localStorage.getItem("token"); 
            const headers = token ? { Authorization: `Bearer ${token}` } : {}; 

            const response = await api.get(`/problem/get/${problemName}`, { headers });

            if (response.data.success) {
                set({ ProblemPoojas: response.data.data });
            }
        } catch (error) {
            console.error("Error fetching problem:", error);
            throw error;
        } finally {
            set({ loading: false });
        }
    },

    getSingleProblem: async (problemID) => {
        try {
            set({ loading: true });

            const token = localStorage.getItem("token");
            const headers = token ? { Authorization: `Bearer ${token}` } : {}; 

            const response = await api.get(`/problem/getid/${problemID}`, { headers });

            if (response.data.success) {
                set({ problem: response.data.data });
            }
        } catch (error) {
            console.error("Error fetching problem:", error);
            throw error;
        } finally {
            set({ loading: false });
        }
    },

    getBookingDate: async (poojaId, userId) => {
        try {
            set({ loading: true });

            const token = localStorage.getItem("token"); 
            const headers = token ? { Authorization: `Bearer ${token}` } : {}; 

            const response = await api.get(`/problem/getbookingdate/${poojaId}/${userId}`, { headers });

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

    getBookings: async (userId) => {
        try {
            set({ loading: true });

            const token = localStorage.getItem("token"); 
            const headers = token ? { Authorization: `Bearer ${token}` } : {}; 

            const response = await api.get(`/problem/getbooking/${userId}`, { headers });

            if (response.data.success) {
                set({ bookings: response.data });
                return response;
            }

            if(response.data.message==="No bookings found"){
                 set({ bookings: [] });
            }
            
            else {
                console.error('Booking fetch failed', response.data.message);
                return null;
            }

        } catch (error) {
            console.error("Error fetching bookingDate:", error);
            throw error;
        } finally {
            set({ loading: false });
        }
    },

    getCurrectDate: async () => {
        try {
            set({ loading: true });

            const response = await axios('https://www.timeapi.io/api/Time/current/zone?timeZone=Asia/Kolkata');
            set({ currentDate: response.data.date });
            return response;
        } catch (error) {
            console.error("Error fetching bookingDate:", error);
            throw error;
        } finally {
            set({ loading: false });
        }
    }
}));

export default useProblemPoojaStore;
