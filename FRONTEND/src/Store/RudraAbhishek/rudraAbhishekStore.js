import { create } from "zustand";
import api from "../../Components/Axios/api";

const useRudraAbhishekStore = create((set) => ({
  error: null,
  success: false,

  addRudraAbhishek: async (payload) => {
    try {
      set({
        error: null,
        success: false,
      });

      const response = await api.post(
        "/rudraAbhishek/create-rudra-abhishek",
        payload
      );

      set({
        success: true,
      });

      return response.data;
    } catch (error) {
      console.log(error);

      set({
        error:
          error?.response?.data?.message ||
          "Something went wrong",
      });

      throw error;
    }
  },
}));

export default useRudraAbhishekStore;