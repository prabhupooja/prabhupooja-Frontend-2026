import { create } from "zustand";
import api from '../../Components/Axios/api';

const usePrasadStore = create((set) => ({
    prasad: [],
    prasadBooking: [],
    loading: false,

    prasadGet: async () => {
        try {
            const response = await api.get("/user/prasad/get");
            // console.log(response.data.data,'prasad');
            if (response.data.success) {
                set({ prasad: response.data.data });
            }
        } catch (error) {
            console.error("Error fetching services:", error);
            throw error;
        }
    },


}))
export default usePrasadStore;