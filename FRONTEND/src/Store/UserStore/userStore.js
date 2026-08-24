import { create } from "zustand";
import api from "../../Components/Axios/api";
import axios from "axios";

const useUserStore = create((set) => ({
  productCount: 0,
  templeCount: 0,
  prasadCount: 0,
  yogaCount: 0,
  isCancelled: false,
  yogaData: [],
  orders: [],
  userAddress: [],
  cancelReason: null,
  isLoading: false,

  setProductCount: (value) => set({ productCount: value }),

  getAuthHeaders: () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  },

  userFetchProduct: async (userId) => {
    set({ isLoading: true });
    try {
      const response = await api.get(
        `/orders/getby/${userId}`,
        useUserStore.getState().getAuthHeaders()
      );
      set({ productCount: response.data.data.orderCount });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  userfetchTempleBookings: async (userId) => {
    set({ isLoading: true });
    try {
      const response = await api.get(
        `/temple/user/${userId}`,
        useUserStore.getState().getAuthHeaders()
      );
      set({ templeCount: response.data.count });
      return response;
    } catch (error) {
      console.error("Failed to fetch temple:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  userfetchPrasadBooking: async (userId) => {
    set({ isLoading: true });
    try {
      const response = await api.get(
        `/user/prasad/getuser/${userId}`,
        useUserStore.getState().getAuthHeaders()
      );
      set({ prasadCount: response.data.prasadCount });
      return response;
    } catch (error) {
      console.error("Failed to fetch prasad:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  userfetchYogaBooking: async (userId) => {
    set({ isLoading: true });
    try {
      const response = await api.get(
        `/yoga/getuser/${userId}`,
        useUserStore.getState().getAuthHeaders()
      );
      set({ yogaCount: response.data.count, yogaData: response.data.data });
      return response;
    } catch (error) {
      console.error("Failed to fetch yoga:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  userOrdersFetchByOrderId: async (orderId) => {
    set({ isLoading: true });
    try {
      const response = await api.get(
        `/orders/getbyuser/${orderId}`,
        useUserStore.getState().getAuthHeaders()
      );
      // console.log(response?.data?.orders?.cancel_reason)
      set({ orders: response.data.products });
      set({ cancelReason: response?.data?.orders?.cancel_reason });
      set({
        isCancelled:
          response?.data?.orders?.order_status?.toLowerCase() === "cancel",
      });

      return response;
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  getUserCityByPincode: async (postalCode) => {
    set({ isLoading: true });
    try {
      const response = await axios.get(
        `https://api.zippopotam.us/IN/${postalCode}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  getOrderTracking: async (orderId) => {
    const token = localStorage.getItem("token");
    set({ isLoading: true });
    try {
      const response = await api.get(
        `/orders/getOrdersTrackingByUser/${orderId}`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // console.log(response, "response in order tracking");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch order tracking:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  orderCancel: async (orderId, payload) => {
    set({ isLoading: true });
    try {
      const response = await api.put(`/orders/cancelOrder/${orderId}`, payload);
      return response;
    } catch (error) {
      console.error("Failed to cancel order:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  getAllTiketsByUserId: async (userId) => {
    // console.log(userId, "userId in tickets");
    set({ isLoading: true });
    try {
      const response = await api.get(
        `/users/getAllTickets/${userId}`,
        useUserStore.getState().getAuthHeaders()
      );
      return response;
    } catch (error) {
      console.error("Failed to fetch tickets:", error);
      return error;
    } finally {
      set({ isLoading: false });
    }
  },

  getOneTiketsById: async (ticketId) => {
    // console.log(ticketId, "ticketId in getOneTiketsById");
    set({ isLoading: true });

    try {
      const response = await api.get(
        `/users/getOneTicket/${ticketId}`,
        useUserStore.getState().getAuthHeaders()
      );

      return response;
    } catch (error) {
      console.error("Failed to fetch ticket:", error);
      return error;
    } finally {
      set({ isLoading: false });
    }
  },

  userTicketCreate: async (payload) => {
    set({ isLoading: true });
    try {
      const response = await api.post(
        `/users/createTicket`,
        payload,
        useUserStore.getState().getAuthHeaders()
      );
      // console.log(response, "response in ticket creation");
      return response.data;
    } catch (error) {
      console.error("Failed to create ticket:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  addAddress: async (payload) => {
    set({ isLoading: true });
    try {
      const response = await api.post(
        `/users/addAddress`,
        payload,
        useUserStore.getState().getAuthHeaders()
      );
      // console.log(response, "response in Address creation");
      return response.data;
    } catch (error) {
      console.error("Failed to create Address:", error);
    } finally {
      set({ isLoading: false });
    }
  },
  getAddressById: async (userId) => {
    // console.log(userId, "lklklkllkllklklklklk");
    set({ isLoading: true });

    try {
      const response = await api.get(
        `/users/getAddress/${userId}`,
        useUserStore.getState().getAuthHeaders()
      );

      set({ userAddress: response.data.data });
      return response;
    } catch (error) {
      console.error("Failed to fetch Address:", error);
      return error;
    } finally {
      set({ isLoading: false });
    }
  },
  updateAddress:async(userId,payload)=>{
    // console.log(userId,payload);
    try {
        const response= await api.put(`/users/updateAddress/${userId}`,payload)
        // console.log(response);
        return response;
    } catch (error) {
        // console.log(error);
        throw error;
    }
  },
  deleteAddress:async(addressId)=>{
    // console.log(addressId);
    try {
        const response= await api.delete(`/users/deleteAddress/${addressId}`);
        // console.log(response);
        return response;
    
    } catch (error) {
    // console.log(error);
    throw error    
    }
  },
  addReview: async (payload) => {
    try {
        // console.log(payload,'dfdfd')
        const response = await api.post('/products/addReview', payload,{
            headers:{
                'Content-Type': 'multipart/form-data',
            }
        });
        // console.log(response,'ddfddfdfdf')
        return response;
    } catch (error) {
        // console.log(error)
        throw error;
    }
},


}));

export default useUserStore;
