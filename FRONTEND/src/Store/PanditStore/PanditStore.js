import { create } from "zustand";
import api from '../../Components/Axios/api';


const usePanditStore = create ((set)=>({
    Pandit:[],
    PanditId:[],
    comments:[],

    PanditGet: async()=>{
        try {
            const response = await api.get("/pandit/verifiedPandit");
           
            if (response.data.success) {
             set({Pandit:response.data.data})
            }
          } catch (error) {
            console.error("Error fetching services:", error);
            throw error;
          }
    },
    PanditGetById: async(panditid)=>{
        try {
            const response = await api.get(`/pandit/id/${panditid}`);
           
            if (response.data.success) {
             set({PanditId:response.data.data})
            }
          } catch (error) {
            console.error("Error fetching services:", error);
            throw error;
          }
    },
    getCommnet: async (panditId) => {
      try {
        const response = await api.get(`/panditComment/get/${panditId}`);
        if (response.data.success) {
          set({ comments: response.data })
        }
      } catch (error) {
        // console.log(error);
        throw error;
      }
    }
}))
export default usePanditStore;