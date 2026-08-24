import { create } from "zustand";
import api from "../../Components/Axios/api";

const useAstologerStore = create((set) => ({
    astrologer: [],
    isloading: false,
    astrologerGet: async () => {
        set({ isloading: true });
        try {
            const response = await api.get("/pandit/verifiedAstrologer");
            // console.log(response.data.data, 'astrologer');
            if (response.data.success) {
                set({ astrologer: response.data.data });
            }
            return response
        } catch (error) {
            console.error("Error fetching astrologers:", error);
            throw error;
        } finally {
            set({ isloading: false });
        }
    },

    astrologerOneGet: async (panditId) => {
        set({ isloading: true });
        try {
            const response = await api.get(`/pandit/id/${panditId}`);
            // console.log(response.data.data, 'astrologerData');
            if (response.data.success) {
                set({ astrologer: response.data.data });
            }
            return response
        } catch (error) {
            console.error("Error fetching astrologers:", error);
            throw error;
        } finally {
            set({ isloading: false });
        }
    },

    chatform:async(payload)=>{
        const token=localStorage.getItem('token');
        try{
           const response= await api.post('/chats/chatform',payload,{
            headers:{
                Authorization:`Bearer ${token}`,
            },
           })
           return response;
        }
        catch(err){
            // console.log(err);
            throw err;
        }
    }
}));

export default useAstologerStore;
