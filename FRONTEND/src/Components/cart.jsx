import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/cart.css";
import prasadimg from "../Components/Assets/prasadimg.webp";
import api from "./Axios/api";
import useUserCardStore from "../Store/userCardStore/userCardStore";
import useAuthStore from "../Store/UserStore/userAuthStore";
import { TailSpin } from "react-loader-spinner";
import { IoCartOutline, IoTrashOutline, IoShieldCheckmarkOutline } from "react-icons/io5";
import { BiShoppingBag } from "react-icons/bi";
import { FaTruck, FaArrowRight } from "react-icons/fa";

const Cart = () => {
  const navigate = useNavigate();
  const { loading, deleteFromCart, cartItems, getCartItems, setCartItems } = useUserCardStore();
  const { user1, error } = useAuthStore();
  const [productDataPrice, setProductDataPrice] = useState(0);
  const [deliveryCharges, setDeliveryCharges] = useState(0);

  useEffect(() => {
    if (!user1) {
      const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
      setCartItems(guestCart);
    } else {
      getCartItems(user1.id);
    }
  }, [user1, getCartItems, setCartItems]);

  // Calculate total price & delivery charges
  useEffect(() => {
    const totalPrice = (cartItems || []).reduce((total, item) => {
      const price = Number(item.offerPrice || item.product?.offerPrice || item.price || item.product?.price || 0);
      const quantity = Number(item.quantity || 1);
      return total + price * quantity;
    }, 0);

    setProductDataPrice(totalPrice);
    // Free delivery above 499
    setDeliveryCharges(totalPrice > 0 && totalPrice < 499 ? 50 : 0);
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
      const currentCart = Array.isArray(cartItems) ? cartItems : [];
      const updatedCart = currentCart.filter(
        (item) => (item.productId || item.product?.id || item.id) !== id
      );
      setCartItems(updatedCart);
      localStorage.setItem("guestCart", JSON.stringify(updatedCart));
    }
  };

  const handleIncreaseQuantity = async (id) => {
    const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
    const isInGuestCart = guestCart.some((item) => (item.productId || item.product?.id || item.id) === id);

    if (isInGuestCart || !user1) {
      const currentCart = guestCart.length > 0 ? guestCart : cartItems;
      const updatedCart = currentCart.map((item) =>
        (item.productId || item.product?.id || item.id) === id
          ? { ...item, quantity: (Number(item.quantity) || 1) + 1 }
          : item
      );
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
            action: "increment",
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.success) {
          const updatedItems = cartItems.map((item) =>
            (item.productId || item.product?.id || item.id) === id
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
    const isInGuestCart = guestCart.some((item) => (item.productId || item.product?.id || item.id) === id);

    if (isInGuestCart || !user1) {
      const currentCart = guestCart.length > 0 ? guestCart : cartItems;
      const updatedCart = currentCart
        .map((item) =>
          (item.productId || item.product?.id || item.id) === id
            ? { ...item, quantity: (Number(item.quantity) || 1) - 1 }
            : item
        )
        .filter((item) => (Number(item.quantity) || 0) > 0);

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
              (item.productId || item.product?.id || item.id) === id
                ? { ...item, quantity: response.data.quantity }
                : item
            )
            .filter((item) => (Number(item.quantity) || 0) > 0);

          setCartItems(updatedItems);
        }
      } catch (err) {
        console.error("Error decreasing quantity from API:", err);
      }
    }
  };

  const handleCheckout = () => {
    const productId = cartItems?.map((item) => item.productId || item.product?.id || item.id);
    const quantity = cartItems?.map((item) => item.quantity || 1);
    const image = cartItems?.map((item) => item.image?.[0] || item.product?.image?.[0] || prasadimg);
    const name = cartItems?.map((item) => item.productName || item.product?.productName || "Spiritual Prasad");
    const marchentId = cartItems?.map((item) => item.merchantId || item.product?.merchantId);

    const totalPrice = productDataPrice + deliveryCharges;

    const queryParams = new URLSearchParams({
      productId: JSON.stringify(productId),
      quantity: JSON.stringify(quantity),
      totalPrice: totalPrice.toString(),
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

    localStorage.setItem("checkOutProduct", JSON.stringify(checkOutProduct));
    navigate(`/checkout?${queryParams.toString()}`);
  };

  if (loading) {
    return (
      <div className="cart-loader-wrapper">
        <TailSpin height="50" width="50" color="#ff7a00" />
        <p className="loading_text">Loading your cart items...</p>
      </div>
    );
  }

  if (error) {
    return <div className="cart-error-message"><p>{error}</p></div>;
  }

  return (
    <div className="cart-page-wrapper">
      {!cartItems || cartItems.length === 0 ? (
        <div className="empty-cart-card">
          <div className="empty-icon-circle">
            <IoCartOutline className="empty-icon" />
          </div>
          <h2 className="empty-text">Your Cart is Empty</h2>
          <p className="empty-subtext">
            Explore authentic spiritual items, pure prasad, energized rudraksha, and pooja samagri.
          </p>
          <Link to="/e-commerce" className="btn-explore-shop">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="cart-main-content">
          <div className="cart-header-title">
            <BiShoppingBag className="cart-title-icon" />
            <h2>Shopping Cart ({cartItems.length} {cartItems.length === 1 ? "item" : "items"})</h2>
          </div>

          <div className="cart-split-layout">
            {/* Left: Cart Items List */}
            <div className="cart-items-container">
              {cartItems.map((item, index) => {
                const product = item.product || {};
                const currentId = item.productId || product.id || item.id || index;
                const itemImg = item.image?.[0] || product.image?.[0] || prasadimg;
                const itemName = item.productName || product.productName || item.name || "Pooja Product";
                const unitPrice = Number(item.offerPrice || product.offerPrice || product.price || item.price || 0);
                const originalPrice = Number(product.price || product.mrp || (unitPrice > 0 ? unitPrice * 1.25 : 0));
                const qty = Number(item.quantity) || 1;

                return (
                  <div key={currentId} className="cart-item-card">
                    <div className="cart-item-img-box">
                      <img src={itemImg} alt={itemName} onError={(e) => { e.target.src = prasadimg; }} />
                    </div>

                    <div className="cart-item-info">
                      <h3 className="item-title">{itemName}</h3>
                      <p className="item-subinfo">Pure & Energized Vedic Quality</p>
                      
                      <div className="item-price-row">
                        <span className="current-price">₹{unitPrice.toLocaleString()}</span>
                        {originalPrice > unitPrice && (
                          <span className="original-price">₹{Math.round(originalPrice).toLocaleString()}</span>
                        )}
                        {originalPrice > unitPrice && (
                          <span className="discount-tag">
                            {Math.round(((originalPrice - unitPrice) / originalPrice) * 100)}% OFF
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="cart-qty-wrapper">
                      <div className="qty-pill">
                        <button
                          type="button"
                          className="qty-btn minus"
                          onClick={() => handleDecreaseQuantity(currentId)}
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="qty-number">{qty}</span>
                        <button
                          type="button"
                          className="qty-btn plus"
                          onClick={() => handleIncreaseQuantity(currentId)}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Item Total & Remove */}
                    <div className="cart-item-action-col">
                      <div className="item-total-price">₹{(unitPrice * qty).toLocaleString()}</div>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(currentId)}
                        className="btn-remove-item"
                        title="Remove item"
                      >
                        <IoTrashOutline /> Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right: Order Summary Sidebar */}
            <div className="cart-summary-sidebar">
              <div className="summary-card">
                <h3 className="summary-title">Order Summary</h3>

                <div className="summary-row">
                  <span>Price ({cartItems.length} items):</span>
                  <span>₹{productDataPrice.toLocaleString()}</span>
                </div>

                <div className="summary-row">
                  <span>Delivery Charges:</span>
                  <span>
                    {deliveryCharges === 0 ? (
                      <span className="free-delivery-badge">FREE</span>
                    ) : (
                      `₹${deliveryCharges}`
                    )}
                  </span>
                </div>

                {deliveryCharges > 0 && (
                  <div className="delivery-tip-banner">
                    <FaTruck style={{ marginRight: "6px" }} />
                    Add ₹{(499 - productDataPrice).toLocaleString()} more for FREE Delivery!
                  </div>
                )}

                <div className="summary-divider" />

                <div className="summary-row total-row">
                  <span>Total Payable:</span>
                  <span className="grand-total">₹{(productDataPrice + deliveryCharges).toLocaleString()}</span>
                </div>

                <p className="tax-inclusive-text">Inclusive of all taxes & Vedic Sankalp</p>

                <button
                  type="button"
                  onClick={handleCheckout}
                  className="btn-proceed-checkout"
                  disabled={productDataPrice <= 0}
                >
                  <span>Proceed to Checkout</span>
                  <FaArrowRight />
                </button>

                <div className="trust-badge-row">
                  <IoShieldCheckmarkOutline className="trust-icon" />
                  <span>100% Secure Checkout & Temple Authentic Prasad</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
