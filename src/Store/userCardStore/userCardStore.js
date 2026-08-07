// import { create } from 'zustand';
// import api from "../../Components/Axios/api";

// const useUserCardStore = create((set) => ({
//   cartItems: [],
//   loading: false,
//   error: null,

//   setCartItems: (value) => set({ cartItems: value }),

//   getCartItems: async (userId) => {
//     set({ loading: true, error: null });
//     const token = localStorage.getItem('token');
//     try {
//       const response = await api.get(`/cart/getcart/${userId}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       // console.log("Cart Response:", response.data);
//       set({ cartItems: response.data.data });
//       return response;

//     } catch (err) {
//       set({ error: "No cart item" });
//       console.error(err);
//     } finally {
//       set({ loading: false });
//     }
//   },

//   deleteFromCart: async (productId) => {
//     set({ loading: true, error: null });
//     const token = localStorage.getItem('token');
//     try {
//       const response = await api.delete(`/cart/delete/${productId}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       set({ loading: false });

//       return response;
//     } catch (err) {
//       set({ error: "Failed to remove item from cart", loading: false });
//       console.error("Error during deleteFromCart:", err);
//     }
//   },

//   addToCart: async (payload) => {
//     set({ loading: true, error: null });
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         set({ error: "No authentication token found" });
//         return;
//       }

//       const response = await api.post("/cart/create", payload, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       set({ cartItems: response.data.data });
//       return response.data;
//     } catch (err) {
//       set({ error: "Failed to add item to cart" });
//       console.error(err);
//     } finally {
//       set({ loading: false });
//     }

//   }

// }));

// export default useUserCardStore;

import { create } from "zustand";
import api from "../../Components/Axios/api";

const useUserCartStore = create((set, get) => ({
  cartItems: JSON.parse(localStorage.getItem("guestCart")) || [],
  loading: false,
  error: null,

  setCartItems: (value) => set({ cartItems: value }),

  getCartItems: async (userId) => {
    set({ loading: true, error: null });
    const token = localStorage.getItem("token");

    try {
      if (token) {
        const response = await api.get(`/cart/getcart/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const serverCart = response.data.data || [];
        const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];

        // Merge carts (avoid duplicates if same productId)
        const mergedCart = [...serverCart];

        guestCart.forEach((guestItem) => {
          const existingItem = mergedCart.find(
            (item) => item.productId === guestItem.productId
          );
          if (existingItem) {
            existingItem.quantity += guestItem.quantity;
          } else {
            mergedCart.push(guestItem);
          }
        });

        set({ cartItems: mergedCart });

        return { data: { data: mergedCart } };
      } else {
        const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
        set({ cartItems: guestCart });
        return { data: { data: guestCart } };
      }
    } catch (err) {
      set({ error: "No cart item" });
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  deleteFromCart: async (productId) => {
    // console.log(productId, "Deleting product...");
    set({ loading: true, error: null });
    const token = localStorage.getItem("token");

    try {
      let updatedCart = [];
      const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
      const isInGuestCart = guestCart.some(
        (item) => item.product?.id === productId
      );

      if (token) {
        if (isInGuestCart) {
          updatedCart = guestCart.filter(
            (item) => item.product?.id !== productId
          );
          localStorage.setItem("guestCart", JSON.stringify(updatedCart));

          set({ cartItems: updatedCart, loading: false });
          return { data: { data: updatedCart } };
        } else {
          const response = await api.delete(`/cart/delete/${productId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          set({ cartItems: response.data.data, loading: false });
          return response;
        }
      } else {
        updatedCart = guestCart.filter(
          (item) => item.product?.id !== productId
        );
        localStorage.setItem("guestCart", JSON.stringify(updatedCart));

        set({ cartItems: updatedCart, loading: false });
        return { data: { data: updatedCart } };
      }
    } catch (err) {
      set({ error: "Failed to remove item from cart", loading: false });
      console.error("Error during deleteFromCart:", err);
    }
  },

  addToCart: async (product) => {
    set({ loading: true, error: null });
    const token = localStorage.getItem("token");
    const state = get();
    try {
      if (token) {
        const response = await api.post(
          "/cart/create",
          {
            productId: product.product.id || product.productId,
            quantity: product.quantity || 1,
            user_id: product.user_id,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        set({ cartItems: response.data.data });
        return response.data;
      } else {
        // Guest user: localStorage
        let updatedCart = [...state.cartItems];

        // Check if product already exists in cart (by product.id)
        const existingIndex = updatedCart.findIndex(
          (item) =>
            (item.product?.id || item.productId) ===
            (product.product?.id || product.productId)
        );

        if (existingIndex > -1) {
          // If exists, increment quantity
          updatedCart[existingIndex].quantity += product.quantity || 1;
        } else {
          // Add new product, ensure structure is same as API
          updatedCart.push({
            product: product.product || {},
            quantity: product.quantity || 1,
          });
        }

        localStorage.setItem("guestCart", JSON.stringify(updatedCart));
        set({ cartItems: updatedCart });

        return { success: true, data: updatedCart };
      }
    } catch (err) {
      set({ error: "Failed to add item to cart" });
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },
  

  clearCart: () => {
    localStorage.removeItem("guestCart");
    set({ cartItems: [] });
  },
}));

export default useUserCartStore;
