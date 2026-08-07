import { create } from 'zustand';
import api from '../../Components/Axios/api';



const useTempleStore = create((set) => ({
  temple: [],
  loading: false,
  
  templeGet: async () => {
    try {
      const response = await api.get("/temple/get");
      if (response?.data.data) {
        set({ temple: response.data.data });
      }

    } catch (error) {
      console.error("Error fetching temples:", error);
      throw error;
    }
  }

}))
export default useTempleStore;