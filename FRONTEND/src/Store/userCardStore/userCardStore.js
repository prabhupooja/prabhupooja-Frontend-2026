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

const calculateCartSummary = (items, backendSummary = null) => {
  if (backendSummary && backendSummary.subtotal !== undefined) {
    return {
      subtotal: Number(backendSummary.subtotal || 0),
      deliveryCharge: Number(backendSummary.deliveryCharge || 0),
      grandTotal: Number(backendSummary.grandTotal || (Number(backendSummary.subtotal || 0) + Number(backendSummary.deliveryCharge || 0))),
    };
  }

  const subtotal = (items || []).reduce((total, item) => {
    const price = Number(item.offerPrice || item.product?.offerPrice || item.price || item.product?.price || 0);
    const qty = Number(item.quantity || 1);
    return total + price * qty;
  }, 0);

  let deliveryCharge = 0;
  if (subtotal > 0) {
    const maxItemDelivery = (items || []).reduce((max, item) => {
      const dCharge = item.delivery_charge ?? item.product?.delivery_charge;
      return dCharge !== undefined && dCharge !== null ? Math.max(max, Number(dCharge)) : max;
    }, -1);

    if (maxItemDelivery >= 0) {
      deliveryCharge = maxItemDelivery;
    } else {
      deliveryCharge = subtotal >= 499 ? 0 : 40;
    }
  }

  const grandTotal = subtotal + deliveryCharge;
  return { subtotal, deliveryCharge, grandTotal };
};

const initialGuestCart = JSON.parse(localStorage.getItem("guestCart")) || [];

const useUserCartStore = create((set, get) => ({
  cartItems: initialGuestCart,
  cartSummary: calculateCartSummary(initialGuestCart),
  loading: false,
  error: null,

  setCartItems: (value) => {
    const items = Array.isArray(value) ? value : [];
    set({ cartItems: items, cartSummary: calculateCartSummary(items) });
  },

  setCartSummary: (summary) => set({ cartSummary: summary }),

  getCartItems: async (userId) => {
    set({ loading: true, error: null });
    const token = localStorage.getItem("token");

    try {
      if (token) {
        const response = await api.get(`/cart/getcart/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const serverCart = response.data.data || [];
        const backendSummary = response.data.summary || response.data.cartSummary || null;
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

        const summary = calculateCartSummary(mergedCart, backendSummary);

        set({ cartItems: mergedCart, cartSummary: summary });

        return { data: { data: mergedCart, summary } };
      } else {
        const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
        const summary = calculateCartSummary(guestCart);
        set({ cartItems: guestCart, cartSummary: summary });
        return { data: { data: guestCart, summary } };
      }
    } catch (err) {
      set({ error: "No cart item" });
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  deleteFromCart: async (productId) => {
    set({ loading: true, error: null });
    const token = localStorage.getItem("token");

    try {
      let updatedCart = [];
      const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
      const isInGuestCart = guestCart.some(
        (item) => (item.product?.id || item.productId || item.id) === productId
      );

      if (token) {
        if (isInGuestCart) {
          updatedCart = guestCart.filter(
            (item) => (item.product?.id || item.productId || item.id) !== productId
          );
          localStorage.setItem("guestCart", JSON.stringify(updatedCart));

          set({
            cartItems: updatedCart,
            cartSummary: calculateCartSummary(updatedCart),
            loading: false,
          });
          return { data: { data: updatedCart } };
        } else {
          const response = await api.delete(`/cart/delete/${productId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const newItems = response.data.data || [];
          const backendSummary = response.data.summary || response.data.cartSummary || null;
          set({
            cartItems: newItems,
            cartSummary: calculateCartSummary(newItems, backendSummary),
            loading: false,
          });
          return response;
        }
      } else {
        updatedCart = guestCart.filter(
          (item) => (item.product?.id || item.productId || item.id) !== productId
        );
        localStorage.setItem("guestCart", JSON.stringify(updatedCart));

        set({
          cartItems: updatedCart,
          cartSummary: calculateCartSummary(updatedCart),
          loading: false,
        });
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
            productId: product.product?.id || product.productId || product.id,
            quantity: product.quantity || 1,
            user_id: product.user_id,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const newItems = response.data.data || [];
        const backendSummary = response.data.summary || response.data.cartSummary || null;
        set({
          cartItems: newItems,
          cartSummary: calculateCartSummary(newItems, backendSummary),
        });
        return response.data;
      } else {
        // Guest user: localStorage
        let updatedCart = [...state.cartItems];

        // Check if product already exists in cart (by product.id)
        const targetId = product.product?.id || product.productId || product.id;
        const existingIndex = updatedCart.findIndex(
          (item) =>
            (item.product?.id || item.productId || item.id) === targetId
        );

        if (existingIndex > -1) {
          // If exists, increment quantity
          updatedCart[existingIndex].quantity += product.quantity || 1;
        } else {
          // Add new product, ensure structure is same as API
          updatedCart.push({
            ...product,
            product: product.product || {},
            quantity: product.quantity || 1,
          });
        }

        localStorage.setItem("guestCart", JSON.stringify(updatedCart));
        set({
          cartItems: updatedCart,
          cartSummary: calculateCartSummary(updatedCart),
        });

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
    set({
      cartItems: [],
      cartSummary: { subtotal: 0, deliveryCharge: 0, grandTotal: 0 },
    });
  },
}));

export default useUserCartStore;
