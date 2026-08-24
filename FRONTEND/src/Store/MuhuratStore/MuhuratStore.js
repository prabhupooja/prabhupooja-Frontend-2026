import { create } from "zustand";
import api from '../../Components/Axios/api';

const useMuhuratStore =create((set)=>({
    muhurat:[],
    muhuratPandit:[],
    pandit:[],
    muhuratGet : async()=>{
        try {
            const response = await api.get("/muhurat/get"); 
          if(response.data.success){
            // console.log(response.data.data,'muhurat');
            set({muhurat:response.data.data});
          }
          
          } catch (error) {
            console.error("Error fetching services:", error);
            throw error;
          }
    },
allMuhuratPandit: async ()=>{
    try {
        const response = await api.get(`/pandit/verifiedMuhuratPandit`);
       if(response.data.success){
        set({muhuratPandit:response.data.data});
       }
      } catch (error) {
        console.error("Error fetching services:", error);
        throw error;
      }
},
MuhuratPandit: async (panditID)=>{
    try {
        const response = await api.get(`/pandit/mahurat/${panditID}`);
       if(response.data.success){
        set({pandit:response.data.data});
       }
      } catch (error) {
        console.error("Error fetching services:", error);
        throw error;
      }
}


}))
export default useMuhuratStore;