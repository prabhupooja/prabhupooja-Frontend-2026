import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/cart.css";
import prasadimg from "../Components/Assets/prasadimg.webp";
import api from "./Axios/api";
import useUserCardStore from "../Store/userCardStore/userCardStore";
import useAuthStore from "../Store/UserStore/userAuthStore";
import { TailSpin } from "react-loader-spinner";
import { IoCartOutline } from "react-icons/io5";
import { BiShoppingBag } from "react-icons/bi";

const Cart = () => {
  const navigate = useNavigate();
  const { loading, deleteFromCart, cartItems, getCartItems, setCartItems } =
    useUserCardStore();
  const { user1, error } = useAuthStore();
  const [productDataPrice, setProductDataPrice] = useState(0);
  const [deleveryCharges, setDeleveryCharges] = useState(0);

  useEffect(() => {
    if (!user1) {
      const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
      setCartItems(guestCart);
    } else {
      getCartItems(user1.id); // fetch cart from API for logged-in user
    }
  }, [user1, getCartItems, setCartItems]);

  // Calculate total price
  useEffect(() => {
    const totalPrice = cartItems?.reduce((total, item) => {
      const price = item.offerPrice || item.product?.offerPrice || 0;
      const quantity = item.quantity || 1;
      return total + price * quantity;
    }, 0);
    setProductDataPrice(totalPrice);
  }, [cartItems]);

  const handleRemoveItem = async (id) => {
    if (user1) {
      try {
        await deleteFromCart(id);
        await getCartItems(user1.id);
      } catch (err) {
        console.error("Error removing item from cart:", err);
      }
    } else {
      const updatedCart = cartItems.filter(
        (item) => (item.productId || item.product?.id) !== id
      );
      setCartItems(updatedCart);
      localStorage.setItem("guestCart", JSON.stringify(updatedCart));
    }
  };

const handleIncreaseQuantity = async (id) => {
  const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];

  // 🔍 Check if product exists in local guestCart
  const isInGuestCart = guestCart.some((item) => item.product?.id === id);

  if (isInGuestCart) {
    // ✅ Update only in localStorage
    const updatedCart = guestCart.map((item) =>
      item.product?.id === id
        ? { ...item, quantity: (item.quantity || 1) + 1 }
        : item
    );
    localStorage.setItem("guestCart", JSON.stringify(updatedCart));
    setCartItems(updatedCart);
  } else if (user1) {
    // ✅ Not in local, check DB
    const token = localStorage.getItem("token");
    try {
      const response = await api.post(
        "/cart/update-quantity",
        {
          user_id: user1.id,
          productId: id,
          action: "increment",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        const updatedItems = cartItems.map((item) =>
          (item.productId || item.product?.id) === id
            ? { ...item, quantity: response.data.quantity }
            : item
        );
        setCartItems(updatedItems);
      }
    } catch (err) {
      console.error("Error increasing quantity from API:", err);
    }
  }
};

const handleDecreaseQuantity = async (id) => {
  const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
  const isInGuestCart = guestCart.some((item) => item.product?.id === id);

  if (isInGuestCart) {
    const updatedCart = guestCart
      .map((item) =>
        item.product?.id === id
          ? { ...item, quantity: (item.quantity || 1) - 1 }
          : item
      )
      .filter((item) => (item.quantity || 0) > 0);
    localStorage.setItem("guestCart", JSON.stringify(updatedCart));
    setCartItems(updatedCart);
  } else if (user1) {
    const token = localStorage.getItem("token");
    try {
      const response = await api.post(
        "/cart/update-quantity",
        {
          user_id: user1.id,
          productId: id,
          action: "decrement",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        const updatedItems = cartItems
          .map((item) =>
            (item.productId || item.product?.id) === id
              ? { ...item, quantity: response.data.quantity }
              : item
          )
          .filter((item) => (item.quantity || 0) > 0);
        setCartItems(updatedItems);
      }
    } catch (err) {
      console.error("Error decreasing quantity from API:", err);
    }
  }
};

const handleCheckout = () => {
  const productId = cartItems?.map(
    (item) => item.productId || item.product?.id
  );
  const quantity = cartItems?.map((item) => item.quantity || 1);
  const image = cartItems?.map(
    (item) => item.image?.[0] || item.product?.image?.[0]
  );
  const name = cartItems?.map(
    (item) => item.productName || item.product?.productName
  );
  const marchentId = cartItems?.map(
    (item) => item.merchantId || item.product?.merchantId
  );

  const totalPrice = cartItems?.reduce(
    (total, item) =>
      total +
      (item.offerPrice || item.product?.offerPrice || 0) *
        (item.quantity || 1),
    0
  );

  // Query Params banaye
  const queryParams = new URLSearchParams({
    productId: JSON.stringify(productId),
    quantity: JSON.stringify(quantity),
    totalPrice,
    booking: "cart",
    images: JSON.stringify(image),
    productName: JSON.stringify(name),
    marchentId: JSON.stringify(marchentId),
  });

  const checkOutProduct = {
  productId,
  quantity,
  totalPrice,
  booking: "cart",
  images: image,
  productName: name,
  marchentId,
};


  localStorage.setItem("checkOutProduct", JSON.stringify(checkOutProduct))

  // Navigate with query params
  navigate(`/checkout?${queryParams.toString()}`);
};


  if (loading) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}
      >
        <TailSpin height="50" width="50" color="orange" />
        <p className="loading_text">Loading...</p>
      </div>
    );
  }

  if (error) return <p>{error}</p>;

  return (
    <div className="cart-page">
      {cartItems?.length === 0 ? (
        <div className="empty-container">
          <IoCartOutline className="empty-icon" />
          <h2 className="empty-text">Your cart is empty!</h2>
          <p className="empty-subtext">
            Looks like you haven’t added anything to your cart yet.
          </p>
          <Link to="/e-commerce" className="continue-shopping">
            Continue
          </Link>
        </div>
      ) : (
        <div>
          <h2 className="CartTitle">
            <BiShoppingBag className="product_cartIcon" />
            My Cart
          </h2>
          <div className="main-cart-container">
            <div className="cart-items1">
              {cartItems?.map((item, index) => {
                const product = item.product || {};
                return (
                  <div key={index} className="cart-item1">
                    <img
                      src={item.image?.[0] || product.image?.[0] || prasadimg}
                      alt={item.productName || product.productName || "Product"}
                    />
                    <div className="cart-item-details1">
                      <h2>{item.productName || product.productName}</h2>
                      <p>Color: {product.colour || "Sliver"}</p>
                      <p>Theme: {product.theme || "Handcrafted Elegance"}</p>
                      <div className="product_price_box">
                        <p className="product-pricetitle">Price:</p>
                        <p className="product-pricecart">
                          ₹
                          {item.offerPrice ||
                            product.offerPrice ||
                            product.price ||
                            0}
                        </p>
                      </div>
                    </div>
                    <div className="quantity-control">
                      <p>Quantity</p>
                      <div className="quantity_productbox">
                        <button
                          onClick={() =>
                            handleDecreaseQuantity(item.productId || product.id)
                          }
                        >
                          -
                        </button>
                        <span>{item.quantity || 1}</span>
                        <button
                          onClick={() =>
                            handleIncreaseQuantity(item.productId || product.id)
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        handleRemoveItem(item.productId || product.id)
                      }
                      className="remove-button"
                    >
                      Remove
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="order-summary">
              <h2>Order Summary</h2>
              <div className="summary-itemm">
                <span>Total Products:</span>
                <span>{cartItems?.length}</span>
              </div>
              <div className="summary-item1">
                <span>Subtotal:</span>
                <span>
                  ₹
                  {cartItems?.reduce((total, item) => {
                    const price =
                      item.offerPrice || item.product?.offerPrice || 0;
                    const quantity = item.quantity || 1;
                    return total + price * quantity;
                  }, 0)}
                </span>
              </div>
              <div className="summary-item">
                <span>Delivery Charges:</span>
                <span>₹{deleveryCharges}</span>
              </div>
              <div className="summary-item total">
                <span>TOTAL (including GST):</span>
                <span>₹{productDataPrice + deleveryCharges}</span>
              </div>
              <button onClick={handleCheckout} className="checkout-button">
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
