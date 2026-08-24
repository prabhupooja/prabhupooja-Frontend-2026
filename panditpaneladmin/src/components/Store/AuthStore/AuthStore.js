import { create } from "zustand";
import api from "../../Axios/api";

const useAuthStore=create((set)=>({
    pandit:null,
    isLoggin:false,
    isLoading:false,

    setIsLoggin : (value)=>set({isLoggin:value}),
    setIsLoading :(value)=>set({isLoading:value}),

    login:async(payload)=>{
        set({error:null,isLoading:true});
        console.log(payload,'dfdddffdfd');
        try {
            const response = await api.post('/users/login', payload);
            return response;
      
          } catch (error) {
            set({
              error: error.response?.data?.message || 'Login failed',
              isLoggin: false,
            });
          } finally {
            set({ isLoading: false });
          }
    },
    userOTP: async (payload) => {
        set({ error: null, Loading: true });
        try {
          const response = await api.post('/users/verifyOtp', payload);
          if(response.status===200){
            console.log(response,'dfdgdgergrf')
            const token = response.data.auth;
            localStorage.setItem('Pandittoken', token);
            set((state) => ({ ...state, isLoggin: true }));
          }
         
          return response;
        } catch (error) {
          set({
            error: error.response?.data?.message || 'OTP verification failed',
          });
          throw error;
        } finally {
          set({ Loading: false });
        }
      },

      panditGet: async () => {
        const token = localStorage.getItem('Pandittoken');
        if (!token) {
            console.error("No token provided.");
            return;
        }
        set({ loading1: true });
        try {
            const response = await api.get('/users/getPanditByToken', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response?.data) {
                set({ pandit: response.data.data, isLoggin: true });
            } else {
                console.error("Failed to retrieve user:", response?.data?.message);
            }

            return response.data;
        } catch (error) {
            console.error("Error fetching pandit data:", error);
            return null;
        } finally {
            set({ loading1: false });
        }
    },
    updatePandit: async (panditId, payload) => {
        try {
          console.log(payload);
          const token = localStorage.getItem('Pandittoken');
          console.log(token, 'dfd');
          const response = await api.put(`/pandit/update/${panditId}`, payload, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`
            }
          });
          return response;
        }
        catch (err) {
          console.log(err);
          throw err;
        }
      },
    
      deletePandit: async (panditId) => {
        try {
          const token = localStorage.getItem('Pandittoken');
          const response = await api.delete(`/pandit/delete/${panditId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
    
          return response;
        }
        catch (err) {
          console.log(err);
          throw err;
        }
      },
      getCommnet: async (panditId) => {
        try {
          const response = await api.get(`/panditComment/get/${panditId}`);
          if (response.data.success) {
            set({ comments: response.data })
          }
        } catch (error) {
          console.log(error);
          throw error;
        }
      },
      logout: () => {
        localStorage.removeItem("Pandittoken");  
        set({ pandit: null, error: null, isLoggin: false });
      }
      
}));
export default useAuthStore;