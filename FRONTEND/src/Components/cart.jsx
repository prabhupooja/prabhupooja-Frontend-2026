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
import { normalizeImageUrl } from "../utils/imageHelper";

const Cart = () => {
  const navigate = useNavigate();
  const { loading, deleteFromCart, cartItems, cartSummary, getCartItems, setCartItems } = useUserCardStore();
  const { user1, error } = useAuthStore();

  useEffect(() => {
    if (!user1) {
      const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
      setCartItems(guestCart);
    } else {
      getCartItems(user1.id);
    }
  }, [user1, getCartItems, setCartItems]);

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
    const quantity = cartItems?.map((item) => Number(item.quantity) || 1);
    const image = cartItems?.map((item) =>
      normalizeImageUrl(
        item.image ||
        item.product?.image ||
        item.product?.images ||
        item.images,
        prasadimg
      )
    );
    const name = cartItems?.map((item) => item.productName || item.product?.productName || "Spiritual Prasad");
    const marchentId = cartItems?.map((item) => item.merchantId || item.product?.merchantId || 1);

    const subtotal = cartSummary?.subtotal || 0;
    const deliveryFee = cartSummary?.deliveryCharge || 0;
    const totalPrice = cartSummary?.grandTotal || (subtotal + deliveryFee);

    const queryParams = new URLSearchParams({
      productId: JSON.stringify(productId),
      quantity: JSON.stringify(quantity),
      subtotal: subtotal.toString(),
      deliveryCharge: deliveryFee.toString(),
      totalPrice: totalPrice.toString(),
      booking: "cart",
      images: JSON.stringify(image),
      productName: JSON.stringify(name),
      marchentId: JSON.stringify(marchentId),
    });

    const checkOutProduct = {
      productId,
      quantity,
      subtotal,
      deliveryCharge: deliveryFee,
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

  const currentSummary = cartSummary || { subtotal: 0, deliveryCharge: 0, grandTotal: 0 };

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

          {/* Dynamic Free Shipping Goal Progress Bar */}
          {currentSummary.freeDeliveryThreshold && !currentSummary.isFreeDelivery && currentSummary.subtotal < currentSummary.freeDeliveryThreshold ? (
            <div className="free-shipping-banner">
              <p>
                <FaTruck className="banner-truck-icon" /> Add <strong>₹{(currentSummary.freeDeliveryThreshold - currentSummary.subtotal).toLocaleString("en-IN")}</strong> more to get <strong className="highlight-green">FREE Delivery</strong>!
              </p>
              <div className="progress-bar-bg">
                <div
                  className="progress-bar-fill"
                  style={{
                    width: `${Math.min(100, Math.max(5, (currentSummary.subtotal / currentSummary.freeDeliveryThreshold) * 100))}%`,
                  }}
                />
              </div>
            </div>
          ) : currentSummary.isFreeDelivery && currentSummary.subtotal > 0 ? (
            <div className="free-shipping-banner success">
              🎉 Congratulations! You have unlocked <strong className="highlight-green">FREE Delivery</strong> on this sacred order!
            </div>
          ) : null}

          <div className="cart-split-layout">
            {/* Left: Cart Items List */}
            <div className="cart-items-container">
              {cartItems.map((item, index) => {
                const product = item.product || {};
                const currentId = item.productId || product.id || item.id || index;
                const itemImg = normalizeImageUrl(
                  item.image || product.image || product.images || item.images,
                  prasadimg
                );
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
                        <span className="current-price">₹{unitPrice.toLocaleString("en-IN")}</span>
                        {originalPrice > unitPrice && (
                          <span className="original-price">₹{Math.round(originalPrice).toLocaleString("en-IN")}</span>
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
                      <div className="item-total-price">₹{(unitPrice * qty).toLocaleString("en-IN")}</div>
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
              {/* Order Summary on Cart / Checkout Page */}
              <div className="order-summary-box card p-3 summary-card">
                <h5>Order Summary</h5>
                <div className="d-flex justify-content-between my-1 summary-row">
                  <span>Items Subtotal:</span>
                  <span>₹{currentSummary.subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="d-flex justify-content-between my-1 summary-row">
                  <span>Delivery Fee:</span>
                  <span>
                    {Number(currentSummary.deliveryCharge) === 0 ? (
                      <strong className="text-success free-delivery-badge">FREE</strong>
                    ) : (
                      `₹${Number(currentSummary.deliveryCharge).toFixed(2)}`
                    )}
                  </span>
                </div>

                {currentSummary.freeDeliveryThreshold &&
                  currentSummary.deliveryCharge > 0 &&
                  currentSummary.subtotal < currentSummary.freeDeliveryThreshold && (
                    <div className="delivery-tip-banner">
                      <FaTruck style={{ marginRight: "6px" }} />
                      Add ₹{(currentSummary.freeDeliveryThreshold - currentSummary.subtotal).toLocaleString("en-IN")} more for FREE Delivery!
                    </div>
                  )}

                <hr className="summary-divider" />

                <div className="d-flex justify-content-between font-weight-bold h5 summary-row total-row">
                  <span>Total Amount:</span>
                  <span className="grand-total">₹{currentSummary.grandTotal.toLocaleString("en-IN")}</span>
                </div>

                <p className="tax-inclusive-text">Inclusive of all taxes & Vedic Sankalp</p>

                <button
                  type="button"
                  onClick={handleCheckout}
                  className="btn-proceed-checkout"
                  disabled={currentSummary.subtotal <= 0}
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
