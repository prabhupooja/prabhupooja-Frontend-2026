import React, { useEffect, useState, useMemo } from "react";
import "../../styles/checkout.css";
import { useNavigate, useLocation, Link } from "react-router-dom";
import api from "../Axios/api";
import Swal from "sweetalert2";
import useAuthStore from "../../Store/UserStore/userAuthStore";
import useHomeStore from "../../Store/dataStore/homeStore";
import useUserStore from "../../Store/UserStore/userStore";
import { IoCloseSharp } from "react-icons/io5";
import { GoHome } from "react-icons/go";
import Select from "react-select";
import { Country, State, City } from "country-state-city";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { 
  FaWallet, 
  FaCreditCard, 
  FaMoneyBillWave, 
  FaMapMarkerAlt, 
  FaPlus, 
  FaCheckCircle, 
  FaPhoneAlt, 
  FaEnvelope, 
  FaShieldAlt,
  FaCheck,
  FaArrowRight
} from "react-icons/fa";
import { normalizeImageUrl, DEFAULT_FALLBACK_IMAGE } from "../../utils/imageHelper";
import { calculateDeliveryFee, fetchDeliverySettings } from "../../utils/deliveryHelper";

const safeJsonParse = (val, fallback = null) => {
  if (val === null || val === undefined) return fallback;
  if (typeof val === "object") return val;
  try {
    return JSON.parse(val);
  } catch {
    return val;
  }
};

const Checkout = () => {
  const token = localStorage.getItem("token");
  const location = useLocation();
  const stateData = location.state || {};
  const queryParams = new URLSearchParams(location.search);

  // Read from queryParams -> location.state -> localStorage
  let storedCheckout = {};
  try {
    storedCheckout = JSON.parse(localStorage.getItem("checkOutProduct")) || {};
  } catch (e) {
    storedCheckout = {};
  }

  const rawProductId = queryParams.get("productId")
    ? safeJsonParse(queryParams.get("productId"))
    : (stateData.productId || storedCheckout.productId);

  const rawQuantity = queryParams.get("quantity")
    ? safeJsonParse(queryParams.get("quantity"))
    : (stateData.quantity || storedCheckout.quantity || 1);

  const rawSubtotal =
    queryParams.get("subtotal") ||
    stateData.subtotal ||
    storedCheckout.subtotal ||
    null;

  const rawDeliveryCharge =
    queryParams.get("deliveryCharge") ||
    stateData.deliveryCharge ||
    storedCheckout.deliveryCharge ||
    null;

  const rawTotalPrice =
    queryParams.get("totalPrice") ||
    stateData.totalPrice ||
    storedCheckout.totalPrice ||
    0;

  const booking =
    queryParams.get("booking") ||
    stateData.booking ||
    storedCheckout.booking ||
    "cart";

  const rawImages = queryParams.get("images")
    ? safeJsonParse(queryParams.get("images"))
    : (stateData.images || storedCheckout.images);

  const rawProductName = queryParams.get("productName")
    ? safeJsonParse(queryParams.get("productName"))
    : (stateData.productName || storedCheckout.productName || "Sacred Pooja Item");

  const rawMarchentId = queryParams.get("marchentId")
    ? safeJsonParse(queryParams.get("marchentId"))
    : (stateData.marchentId || storedCheckout.marchentId || 1);

  const [deliverySettings, setDeliverySettings] = useState(null);

  useEffect(() => {
    fetchDeliverySettings().then((s) => {
      if (s) setDeliverySettings(s);
    });
  }, []);

  const productId = rawProductId;
  const quantity = rawQuantity;
  const rawPriceNum = Number(rawTotalPrice) || 0;

  const subtotal = rawSubtotal !== null
    ? Number(rawSubtotal)
    : (rawDeliveryCharge !== null ? Math.max(0, rawPriceNum - Number(rawDeliveryCharge)) : rawPriceNum);

  const deliveryCharge = rawDeliveryCharge !== null
    ? Number(rawDeliveryCharge)
    : (subtotal > 0 ? calculateDeliveryFee([{ price: subtotal, quantity: 1 }], 1, deliverySettings).deliveryFee : 0);

  const totalPrice = (subtotal + deliveryCharge) || rawPriceNum;
  const productName = rawProductName;
  const marchentId = rawMarchentId;

  const cartSummary = {
    subtotal,
    deliveryCharge,
    grandTotal: totalPrice,
  };

  // Normalized clean array of image URLs
  const normalizedImages = useMemo(() => {
    if (!rawImages) return [DEFAULT_FALLBACK_IMAGE];
    if (Array.isArray(rawImages)) {
      const flat = rawImages.flat(Infinity).map((u) => normalizeImageUrl(u));
      const clean = flat.filter((u) => u && u.length > 4 && u !== "[" && u !== "]");
      return clean.length > 0 ? clean : [DEFAULT_FALLBACK_IMAGE];
    }
    return [normalizeImageUrl(rawImages)];
  }, [rawImages]);

  const { getValidCoupon } = useHomeStore();
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  const [formValues, setFormValues] = useState({
    name: "",
    lastname: "",
    email: "",
    mobile: "",
    address: "",
    city: null,
    state: null,
    country: null,
    postalCode: "",
  });
  
  const [editFromValues, setEditFormValues] = useState({
    id: null,
    name: "",
    lastname: "",
    email: "",
    mobile: "",
    address: "",
    city: null,
    state: null,
    country: null,
    postalCode: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { user1, setIsLoginPopup, userGet } = useAuthStore();
  const {
    getAddressById,
    userAddress = [],
    addAddress,
    updateAddress,
    deleteAddress,
  } = useUserStore();
  
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponMessage, setCouponMessage] = useState("");
  const [errorCouponMessage, setErrorCouponMessage] = useState("");
  const [coupanDiscount, setCouponDiscount] = useState(0);
  const [offeredPrice, setOfferedPrice] = useState(totalPrice);
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [showAddressPopup, setShowAddressPopup] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showEditAddressPopup, setShowEditAddressPopup] = useState(false);

  const walletBalance = Number(user1?.balance || 0);
  const isWalletSufficient = walletBalance >= offeredPrice;

  // Auto-set default payment method: Default to Wallet if user has enough balance, otherwise UPI
  useEffect(() => {
    if (user1 && walletBalance >= offeredPrice && offeredPrice > 0) {
      setPaymentMethod("WALLET");
    }
  }, [user1, walletBalance, offeredPrice]);

  const getAddress = async () => {
    if (!user1?.id) return;
    setLoading(true);
    try {
      await getAddressById(user1?.id);
    } catch (err) {
      console.error("Error fetching addresses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user1) {
      getAddress();
    }
  }, [user1]);

  // Automatically select default/first address
  useEffect(() => {
    if (userAddress && userAddress.length > 0) {
      if (!selectedAddress || !userAddress.some((a) => a.id === selectedAddress.id)) {
        setSelectedAddress(userAddress[0]);
      }
    }
  }, [userAddress, selectedAddress]);

  useEffect(() => {
    if (!productId) {
      navigate("/cart");
    }
  }, [productId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let finalVal = value;
    if (name === "mobile" || name === "number" || name === "phone") {
      finalVal = value.replace(/\D/g, "").slice(0, 10);
    } else if (name === "postalCode") {
      finalVal = value.replace(/\D/g, "").slice(0, 6);
    }
    setFormValues((prev) => ({
      ...prev,
      [name]: finalVal,
    }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    let finalVal = value;
    if (name === "mobile" || name === "number" || name === "phone") {
      finalVal = value.replace(/\D/g, "").slice(0, 10);
    } else if (name === "postalCode") {
      finalVal = value.replace(/\D/g, "").slice(0, 6);
    }
    setEditFormValues((prev) => ({
      ...prev,
      [name]: finalVal,
    }));
  };

  const getAddressField = (addr, field) => {
    if (!addr) return "";
    if (typeof addr.address === "object" && addr.address !== null) {
      return addr.address[field] || addr[field] || "";
    }
    if (field === "address") return addr.address || "";
    return addr[field] || "";
  };

  const handlePayment = async (e) => {
    if (e) e.preventDefault();

    if (!user1) {
      setIsLoginPopup(true);
      return; 
    }

    if (!selectedAddress) {
      Swal.fire({
        title: "Delivery Address Required",
        text: "Please select or add a delivery address to proceed with your sacred order.",
        icon: "warning",
        confirmButtonText: "Select Address",
        confirmButtonColor: "#ea580c",
      });
      return;
    }

    setLoading(true);

    const addrLine = getAddressField(selectedAddress, "address");
    const addrCity = getAddressField(selectedAddress, "city");
    const addrState = getAddressField(selectedAddress, "state");
    const addrCountry = getAddressField(selectedAddress, "country") || "India";
    const addrPostalCode = getAddressField(selectedAddress, "postalCode");

    // 🪙 Case 1: Paid via Sacred Wallet
    if (paymentMethod === "WALLET") {
      if (walletBalance < offeredPrice) {
        setLoading(false);
        Swal.fire({
          title: "Insufficient Wallet Balance",
          text: `Your current wallet balance is ₹${walletBalance.toLocaleString("en-IN")}, but the order total is ₹${offeredPrice.toLocaleString("en-IN")}.`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Recharge Wallet",
          cancelButtonText: "Pay Online / COD",
          confirmButtonColor: "#ea580c",
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/editprofile", { state: { activeTab: "wallet" } });
          }
        });
        return;
      }

      try {
        const response = await api.post(
          "/orders/create",
          {
            productId,
            userId: user1?.id,
            quantity,
            totalPrice: offeredPrice,
            delivery_charge: deliveryCharge,
            booking,
            images: normalizedImages,
            paymentMethod: "WALLET",
            status: "paid",
            marchentId,
            name: selectedAddress.name,
            lastname: selectedAddress.lastname,
            email: selectedAddress.email,
            number: selectedAddress.number,
            address: addrLine,
            country: addrCountry,
            state: addrState,
            city: addrCity,
            postalCode: addrPostalCode,
            paymentId: `WALLET_${Date.now()}`,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setLoading(false);
        if (response.data?.success !== false) {
          if (userGet) {
            try { await userGet(); } catch (e) { console.error(e); }
          }
          Swal.fire({
            title: "Order Placed Successfully! 🕉️",
            text: `₹${offeredPrice.toLocaleString("en-IN")} was paid from your Prabhu Pooja Wallet. Your sacred items are being prepared!`,
            icon: "success",
            confirmButtonText: "View My Orders",
            confirmButtonColor: "#D35400",
          });
          navigate("/myorders");
        } else {
          Swal.fire("Order Failed", response.data?.message || "Could not complete wallet order.", "error");
        }
      } catch (error) {
        setLoading(false);
        console.error("Wallet Order failed:", error);
        Swal.fire(
          "Payment Failed",
          error?.response?.data?.message || "Could not complete wallet payment. Please try again or use UPI.",
          "error"
        );
      }
      return;
    }

    // 📦 Case 2: Cash on Delivery
    if (paymentMethod === "COD") {
      try {
        await api.post(
          "/orders/create",
          {
            productId,
            userId: user1?.id,
            quantity,
            totalPrice: offeredPrice,
            delivery_charge: deliveryCharge,
            booking,
            images: normalizedImages,
            paymentMethod: "COD",
            status: "unpaid",
            marchentId,
            name: selectedAddress.name,
            lastname: selectedAddress.lastname,
            email: selectedAddress.email,
            number: selectedAddress.number,
            address: addrLine,
            country: addrCountry,
            state: addrState,
            city: addrCity,
            postalCode: addrPostalCode,
            paymentId: "null",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setLoading(false);
        Swal.fire({
          title: "Order Placed Successfully! 📦",
          text: "Thank you for your purchase. Your order is confirmed for Cash on Delivery!",
          icon: "success",
          confirmButtonText: "View My Orders",
          confirmButtonColor: "#D35400",
        });
        navigate("/myorders");
      } catch (error) {
        setLoading(false);
        console.error("COD Order creation failed:", error);
        Swal.fire(
          "Error",
          error?.response?.data?.message || "An error occurred during COD order creation.",
          "error"
        );
      }
    } 
    // ⚡ Case 3: Online Payment via Razorpay
    else {
      try {
        const paymentResponse = await api.post(
          "/payment/create-payment",
          {
            amount: offeredPrice,
            currency: "INR",
            user_id: user1?.id,
            puja: "order",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setLoading(false);
        const { id: orderId, amount } = paymentResponse.data.data;
        const razorpayKey =
          paymentResponse.data?.key_id ||
          paymentResponse.data?.data?.key_id ||
          process.env.REACT_APP_RAZORPAY_KEY_ID ||
          "rzp_test_J3QKwQbU1OGf1Y";

        const options = {
          key: razorpayKey,
          amount,
          currency: "INR",
          name: "Prabhu Pooja",
          description: "Sacred Pooja Items Purchase",
          order_id: orderId,
          handler: async function (razorResponse) {
            try {
              setLoading(true);
              const verifyResponse = await api.post(
                "/payment/verify-payment",
                {
                  razorpay_order_id: razorResponse.razorpay_order_id,
                  razorpay_payment_id: razorResponse.razorpay_payment_id,
                  razorpay_signature: razorResponse.razorpay_signature,
                },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              if (verifyResponse.data.success) {
                const response = await api.post(
                  "/orders/create",
                  {
                    productId,
                    userId: user1?.id,
                    quantity,
                    totalPrice: offeredPrice,
                    delivery_charge: deliveryCharge,
                    booking,
                    images: normalizedImages,
                    paymentMethod: "UPI",
                    status: "paid",
                    marchentId,
                    name: selectedAddress.name,
                    lastname: selectedAddress.lastname,
                    email: selectedAddress.email,
                    number: selectedAddress.number,
                    address: addrLine,
                    country: addrCountry,
                    state: addrState,
                    city: addrCity,
                    postalCode: addrPostalCode,
                    paymentId: razorResponse.razorpay_payment_id,
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );

                setLoading(false);
                if (response.data.success) {
                  Swal.fire({
                    title: "Order Placed Successfully! 🕉️",
                    text: "Thank you for your purchase. Your payment was verified!",
                    icon: "success",
                    confirmButtonText: "View My Orders",
                    confirmButtonColor: "#D35400",
                  });
                  navigate("/myorders");
                }
              } else {
                setLoading(false);
                Swal.fire("Error", "Payment verification failed.", "error");
              }
            } catch (error) {
              setLoading(false);
              console.error("Verification or order creation failed:", error);
              Swal.fire("Order creation failed", "Payment was processed, please contact support if order does not appear.", "error");
            }
          },
          prefill: {
            name: `${selectedAddress.name || ""} ${selectedAddress.lastname || ""}`.trim(),
            email: selectedAddress.email || user1?.email,
            contact: selectedAddress.number || user1?.mobile,
          },
          theme: {
            color: "#ea580c",
          },
        };

        const rzp1 = new window.Razorpay(options);
        rzp1.open();

        rzp1.on("payment.failed", function (response) {
          Swal.fire(`Payment Failed: ${response.error.description}`, "", "error");
        });
      } catch (error) {
        setLoading(false);
        Swal.fire("Error", "An error occurred initiating online payment.", "error");
      }
    }
  };

  const handleApply = async () => {
    if (!couponCode.trim()) {
      setErrorCouponMessage("Coupon Code is required!");
      return;
    }

    try {
      setLoading(true);
      const response = await getValidCoupon(couponCode.trim());
      if (response?.data?.success) {
        setLoading(false);
        const discountType = response?.data?.type?.toLowerCase();
        const value = Number(response?.data?.value) || 0;
        let discount = 0;

        if (discountType === "percent") {
          discount = Math.floor((totalPrice * value) / 100);
        } else if (discountType === "flat") {
          discount = value;
        } else if (discountType === "upto") {
          discount = Math.floor((totalPrice * value) / 100);
        }

        const finalDiscount = Math.min(discount, totalPrice);
        setCouponDiscount(finalDiscount);
        setCouponMessage(
          `Coupon applied successfully! You saved ₹${finalDiscount}/-`
        );
        setErrorCouponMessage("");
        setOfferedPrice(Math.max(0, totalPrice - finalDiscount));
        setCouponCode("");
        setIsCouponApplied(true);
      } else {
        setLoading(false);
        setCouponDiscount(0);
        setErrorCouponMessage("Invalid coupon code. Please try again.");
        setCouponMessage("");
        setOfferedPrice(totalPrice);
        setIsCouponApplied(false);
      }
    } catch (error) {
      setLoading(false);
      setCouponDiscount(0);
      setErrorCouponMessage(
        error.response?.data?.message ||
          "Invalid coupon code. Please try again later."
      );
      setCouponMessage("");
      setOfferedPrice(totalPrice);
      setIsCouponApplied(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode("");
    setCouponDiscount(0);
    setCouponMessage("");
    setErrorCouponMessage("");
    setOfferedPrice(totalPrice);
    setIsCouponApplied(false);
  };

  const openAddAddressModal = () => {
    if (!user1) {
      setIsLoginPopup(true);
      return;
    }
    setFormValues({
      name: user1?.name || "",
      lastname: user1?.lastname || "",
      email: user1?.email || "",
      mobile: user1?.mobile || user1?.number || "",
      address: "",
      city: null,
      state: null,
      country: null,
      postalCode: "",
    });
    setErrors({});
    setShowAddressPopup(true);
  };

  const addNewAddress = async () => {
    setLoading(true);
    const {
      name,
      lastname,
      email,
      mobile,
      address,
      city,
      state,
      country,
      postalCode,
    } = formValues;

    const newErrors = {};
    if (!name?.trim()) newErrors.name = "First name is required.";
    if (!lastname?.trim()) newErrors.lastname = "Last name is required.";
    if (!email?.trim()) newErrors.email = "Email is required.";
    
    const cleanMobile = (mobile || "").replace(/\D/g, "");
    if (!cleanMobile || !/^[6-9]\d{9}$/.test(cleanMobile)) {
      newErrors.mobile = "Enter a valid 10-digit Indian mobile number.";
    }

    if (!address?.trim()) newErrors.address = "Street address is required.";
    if (!city) newErrors.city = "City is required.";
    if (!state) newErrors.state = "State is required.";
    if (!country) newErrors.country = "Country is required.";
    if (!postalCode?.trim() || postalCode.length < 6) {
      newErrors.postalCode = "Enter a valid 6-digit postal code.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    setErrors({});

    try {
      const response = await addAddress({
        userId: user1?.id,
        name: name.trim(),
        lastname: lastname.trim(),
        email: email.trim(),
        number: mobile,
        city: city,
        state: state,
        address: address.trim(),
        country: country,
        postalCode: postalCode.trim(),
      });

      if (response?.success !== false) {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Address saved successfully!",
          showConfirmButton: false,
          timer: 2000,
        });

        await getAddress();
        setShowAddressPopup(false);
      }
    } catch (error) {
      console.error("Error adding address:", error);
      Swal.fire("Error", "Failed to add address. Please check your fields and try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const editAddressClick = (addr) => {
    const addrLine = getAddressField(addr, "address");
    const addrCity = getAddressField(addr, "city");
    const addrState = getAddressField(addr, "state");
    const addrCountry = getAddressField(addr, "country") || "India";
    const addrPostalCode = getAddressField(addr, "postalCode");

    setEditFormValues({
      id: addr.id,
      name: addr.name || "",
      lastname: addr.lastname || "",
      email: addr.email || "",
      mobile: addr.number || "",
      address: addrLine,
      city: addrCity,
      state: addrState,
      country: addrCountry,
      postalCode: addrPostalCode,
    });
    setErrors({});
    setShowEditAddressPopup(true);
  };

  const handleUpdateAddress = async () => {
    if (!editFromValues.id) return;
    try {
      setLoading(true);
      const res = await updateAddress(editFromValues.id, {
        name: editFromValues.name,
        lastname: editFromValues.lastname,
        email: editFromValues.email,
        number: editFromValues.mobile,
        address: editFromValues.address,
        city: editFromValues.city,
        state: editFromValues.state,
        country: editFromValues.country,
        postalCode: editFromValues.postalCode,
      });

      if (res?.data?.success !== false) {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Address updated successfully!",
          showConfirmButton: false,
          timer: 2000,
        });
        setShowEditAddressPopup(false);
        await getAddress();
      }
    } catch (error) {
      console.error("Update error:", error);
      Swal.fire("Error", "Something went wrong while updating the address.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (id) => {
    const result = await Swal.fire({
      title: "Delete this address?",
      text: "Are you sure you want to remove this delivery address?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        const res = await deleteAddress(id);
        if (res?.data?.success !== false) {
          Swal.fire({
            toast: true,
            position: "top-end",
            icon: "success",
            title: "Address removed successfully!",
            showConfirmButton: false,
            timer: 1800,
          });
          if (selectedAddress?.id === id) {
            setSelectedAddress(null);
          }
          await getAddress();
        }
      } catch (error) {
        Swal.fire("Error", "Could not delete address.", "error");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <section className="checkout-main-section">
      <div className="container">
        {/* Checkout Header Banner */}
        <div className="checkout-page-header">
          <div>
            <h1 className="checkout-title">Checkout & Place Order</h1>
            <p className="checkout-subtitle">Complete your sacred purchase with 100% verified authentic pooja items.</p>
          </div>
          <div className="checkout-security-badge">
            <FaShieldAlt className="shield-icon" />
            <span>256-Bit SSL Encrypted Checkout</span>
          </div>
        </div>

        <div className="checkout-layout-grid">
          {/* LEFT SIDE: Address Selection & Payment Methods */}
          <div className="checkout-left-col">
            
            {/* 1. Address Section */}
            <div className="checkout-section-card">
              <div className="card-header-flex">
                <div className="header-title-group">
                  <span className="step-number">1</span>
                  <h3>Select Delivery Address</h3>
                </div>
                <button
                  type="button"
                  className="btn-add-new-address"
                  onClick={openAddAddressModal}
                >
                  <FaPlus size={12} />
                  <span>Add New Address</span>
                </button>
              </div>

              <div className="addresses-container">
                {userAddress.length === 0 ? (
                  <div className="empty-address-box">
                    <FaMapMarkerAlt className="empty-icon" />
                    <h4>No Delivery Address Found</h4>
                    <p>Please add a delivery address where you'd like your sacred items delivered.</p>
                    <button
                      type="button"
                      className="btn-primary-add"
                      onClick={openAddAddressModal}
                    >
                      <FaPlus /> Add Address Now
                    </button>
                  </div>
                ) : (
                  <div className="address-cards-grid">
                    {userAddress.map((addr) => {
                      const isSelected = selectedAddress?.id === addr.id;
                      const addrLine = getAddressField(addr, "address");
                      const addrCity = getAddressField(addr, "city");
                      const addrState = getAddressField(addr, "state");
                      const addrPostal = getAddressField(addr, "postalCode");

                      return (
                        <div
                          key={addr.id}
                          className={`modern-address-card ${isSelected ? "card-selected" : ""}`}
                          onClick={() => setSelectedAddress(addr)}
                        >
                          <div className="address-card-top">
                            <div className="address-radio-box">
                              <span className={`radio-circle ${isSelected ? "checked" : ""}`}>
                                {isSelected && <span className="inner-dot" />}
                              </span>
                              <strong className="recipient-name">
                                {addr.name} {addr.lastname}
                              </strong>
                            </div>
                            {isSelected && (
                              <span className="selected-tag">
                                <FaCheck size={10} /> Selected
                              </span>
                            )}
                          </div>

                          <div className="address-card-body">
                            <p className="address-street">
                              <FaMapMarkerAlt className="pin-icon" />
                              <span>{addrLine}, {addrCity}, {addrState} - {addrPostal}</span>
                            </p>
                            <div className="address-contact-pills">
                              <span className="contact-pill">
                                <FaPhoneAlt size={10} /> {addr.number}
                              </span>
                              {addr.email && (
                                <span className="contact-pill">
                                  <FaEnvelope size={10} /> {addr.email}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="address-card-actions" onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              className="action-btn edit-btn"
                              onClick={() => editAddressClick(addr)}
                              title="Edit Address"
                            >
                              <FiEdit /> Edit
                            </button>
                            <button
                              type="button"
                              className="action-btn delete-btn"
                              onClick={() => handleDeleteAddress(addr.id)}
                              title="Remove Address"
                            >
                              <FiTrash2 /> Remove
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* 2. Payment Method Section */}
            <div className="checkout-section-card mt-4">
              <div className="card-header-flex">
                <div className="header-title-group">
                  <span className="step-number">2</span>
                  <h3>Select Payment Method</h3>
                </div>
              </div>

              <div className="payment-options-list">
                
                {/* Option 1: Prabhu Pooja Wallet */}
                <div
                  className={`payment-option-tile ${paymentMethod === "WALLET" ? "active" : ""}`}
                  onClick={() => setPaymentMethod("WALLET")}
                >
                  <div className="tile-radio">
                    <span className={`radio-circle ${paymentMethod === "WALLET" ? "checked" : ""}`}>
                      {paymentMethod === "WALLET" && <span className="inner-dot" />}
                    </span>
                  </div>
                  <div className="tile-icon-box wallet-theme">
                    <FaWallet />
                  </div>
                  <div className="tile-details">
                    <div className="tile-heading-row">
                      <strong>Prabhu Pooja Wallet</strong>
                      <span className={`balance-badge ${isWalletSufficient ? "sufficient" : "low"}`}>
                        Balance: ₹{walletBalance.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <p className="tile-desc">
                      {isWalletSufficient ? (
                        <span className="text-success-bold">✓ 1-Click Instant Payment from your sacred balance.</span>
                      ) : (
                        <span className="text-warning-bold">
                          ⚠️ Insufficient balance for this order (Need ₹{offeredPrice.toLocaleString("en-IN")}).
                          <Link to="/editprofile" state={{ activeTab: "wallet" }} className="recharge-link">
                            + Recharge Wallet
                          </Link>
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Option 2: Online Payment (UPI, Cards, NetBanking) */}
                <div
                  className={`payment-option-tile ${paymentMethod === "UPI" ? "active" : ""}`}
                  onClick={() => setPaymentMethod("UPI")}
                >
                  <div className="tile-radio">
                    <span className={`radio-circle ${paymentMethod === "UPI" ? "checked" : ""}`}>
                      {paymentMethod === "UPI" && <span className="inner-dot" />}
                    </span>
                  </div>
                  <div className="tile-icon-box online-theme">
                    <FaCreditCard />
                  </div>
                  <div className="tile-details">
                    <div className="tile-heading-row">
                      <strong>Online Payment (Instant & Secure)</strong>
                      <span className="fast-tag">Instant Confirmation</span>
                    </div>
                    <p className="tile-desc">
                      Pay via Google Pay, PhonePe, Paytm, BHIM UPI, Credit/Debit Cards, or NetBanking.
                    </p>
                  </div>
                </div>

                {/* Option 3: Cash on Delivery (COD) */}
                <div
                  className={`payment-option-tile ${paymentMethod === "COD" ? "active" : ""}`}
                  onClick={() => setPaymentMethod("COD")}
                >
                  <div className="tile-radio">
                    <span className={`radio-circle ${paymentMethod === "COD" ? "checked" : ""}`}>
                      {paymentMethod === "COD" && <span className="inner-dot" />}
                    </span>
                  </div>
                  <div className="tile-icon-box cod-theme">
                    <FaMoneyBillWave />
                  </div>
                  <div className="tile-details">
                    <div className="tile-heading-row">
                      <strong>Cash on Delivery (COD)</strong>
                    </div>
                    <p className="tile-desc">
                      Pay securely with cash or UPI directly when your package is delivered to your doorstep.
                    </p>
                  </div>
                </div>

              </div>

              {/* Order Now CTA Button */}
              <div className="place-order-cta-box">
                <button
                  type="button"
                  className="btn-place-order"
                  disabled={loading}
                  onClick={handlePayment}
                >
                  {loading ? (
                    "Processing Order..."
                  ) : (
                    <>
                      <span>
                        Place Order • ₹{offeredPrice.toLocaleString("en-IN")}
                      </span>
                      <FaArrowRight />
                    </>
                  )}
                </button>
                <p className="order-trust-note">
                  🔒 By placing this order, you agree to Prabhu Pooja's Terms of Service and Privacy Policy.
                </p>
              </div>

            </div>

          </div>

          {/* RIGHT SIDE: Product Details, Coupon & Price Summary */}
          <div className="checkout-right-col">
            
            {/* Products in Checkout */}
            <div className="checkout-summary-card">
              <h3 className="summary-card-title">Order Items</h3>
              
              <div className="checkout-items-list">
                {normalizedImages && normalizedImages.length > 0 ? (
                  normalizedImages.map((url, index) => {
                    const currentName = Array.isArray(productName)
                      ? productName[index] || "Sacred Pooja Item"
                      : productName || "Sacred Pooja Item";

                    const currentQty = Array.isArray(quantity)
                      ? quantity[index] || 1
                      : quantity || 1;

                    return (
                      <div className="checkout-product-row" key={index}>
                        <img
                          src={url}
                          alt={currentName}
                          className="product-thumb"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = DEFAULT_FALLBACK_IMAGE;
                          }}
                        />
                        <div className="product-info-col">
                          <h4 className="p-title">{currentName}</h4>
                          <span className="p-qty">Quantity: <strong>{currentQty}</strong></span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="checkout-product-row">
                    <img
                      src={DEFAULT_FALLBACK_IMAGE}
                      alt="Sacred Item"
                      className="product-thumb"
                    />
                    <div className="product-info-col">
                      <h4 className="p-title">{productName || "Sacred Pooja Offering"}</h4>
                      <span className="p-qty">Quantity: <strong>{Array.isArray(quantity) ? quantity[0] || 1 : quantity || 1}</strong></span>
                    </div>
                  </div>
                )}
              </div>

              {/* Coupon Code Input */}
              <div className="modern-coupon-box">
                <label className="coupon-label">Have a Promo / Devotee Coupon?</label>
                <div className="coupon-input-group">
                  <input
                    type="text"
                    placeholder="Enter Coupon Code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    disabled={isCouponApplied}
                    className="coupon-input"
                  />
                  <button
                    type="button"
                    onClick={handleApply}
                    disabled={isCouponApplied || loading}
                    className={`btn-apply-coupon ${isCouponApplied ? "applied" : ""}`}
                  >
                    {isCouponApplied ? "Applied ✓" : "Apply"}
                  </button>
                </div>

                {couponMessage && (
                  <div className="coupon-feedback success">
                    <span>{couponMessage}</span>
                    <button type="button" className="btn-remove-coupon" onClick={handleRemoveCoupon}>
                      <IoCloseSharp size={18} />
                    </button>
                  </div>
                )}
                {errorCouponMessage && (
                  <div className="coupon-feedback error">
                    <span>{errorCouponMessage}</span>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="price-breakdown-card">
                <h4 className="breakdown-title">Price Breakdown</h4>
                
                <div className="breakdown-row">
                  <span>Items Subtotal</span>
                  <strong>₹{cartSummary.subtotal.toLocaleString("en-IN")}</strong>
                </div>

                <div className="breakdown-row">
                  <span>Delivery Charges</span>
                  <span>
                    {Number(cartSummary.deliveryCharge) === 0 ? (
                      <span className="free-delivery-badge">FREE</span>
                    ) : (
                      `₹${Number(cartSummary.deliveryCharge).toFixed(2)}`
                    )}
                  </span>
                </div>

                {coupanDiscount > 0 && (
                  <div className="breakdown-row discount-row">
                    <span>Coupon Discount</span>
                    <span className="discount-val">-₹{Number(coupanDiscount).toLocaleString("en-IN")}</span>
                  </div>
                )}

                {paymentMethod === "WALLET" && (
                  <div className="breakdown-row wallet-deduct-row">
                    <span>Paid via Pooja Wallet</span>
                    <span className="wallet-deduct-val">-₹{offeredPrice.toLocaleString("en-IN")}</span>
                  </div>
                )}

                <div className="breakdown-divider" />

                <div className="breakdown-total-row">
                  <div>
                    <span className="total-lbl">Total Payable</span>
                    <p className="tax-inclusive-text">(Inclusive of all taxes & blessings)</p>
                  </div>
                  <strong className="total-val">
                    ₹{offeredPrice.toLocaleString("en-IN")}
                  </strong>
                </div>

              </div>

            </div>

          </div>
        </div>
      </div>

      {/* 🏡 ADD ADDRESS MODAL */}
      {showAddressPopup && (
        <div className="modal-backdrop-overlay" onClick={() => setShowAddressPopup(false)}>
          <div className="modern-address-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-bar">
              <h3>Add New Delivery Address</h3>
              <button
                type="button"
                className="modal-close-icon-btn"
                onClick={() => setShowAddressPopup(false)}
              >
                <IoCloseSharp size={22} />
              </button>
            </div>

            <form className="modal-address-form" onSubmit={(e) => { e.preventDefault(); addNewAddress(); }}>
              <div className="form-two-col">
                <div className="form-input-field">
                  <label>First Name *</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter first name"
                    value={formValues.name}
                    onChange={handleChange}
                    className="modal-input"
                  />
                  {errors.name && <span className="field-error-msg">{errors.name}</span>}
                </div>

                <div className="form-input-field">
                  <label>Last Name *</label>
                  <input
                    type="text"
                    name="lastname"
                    placeholder="Enter last name"
                    value={formValues.lastname}
                    onChange={handleChange}
                    className="modal-input"
                  />
                  {errors.lastname && <span className="field-error-msg">{errors.lastname}</span>}
                </div>
              </div>

              <div className="form-two-col">
                <div className="form-input-field">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="name@example.com"
                    value={formValues.email}
                    onChange={handleChange}
                    className="modal-input"
                  />
                  {errors.email && <span className="field-error-msg">{errors.email}</span>}
                </div>

                <div className="form-input-field">
                  <label>Mobile Number (10 Digits) *</label>
                  <input
                    type="tel"
                    name="mobile"
                    placeholder="9876543210"
                    maxLength={10}
                    value={formValues.mobile}
                    onChange={handleChange}
                    className="modal-input"
                  />
                  {errors.mobile && <span className="field-error-msg">{errors.mobile}</span>}
                </div>
              </div>

              <div className="form-input-field">
                <label>Complete House / Flat / Street Address *</label>
                <textarea
                  name="address"
                  rows={2}
                  placeholder="House No., Building Name, Street, Landmark"
                  value={formValues.address}
                  onChange={handleChange}
                  className="modal-input"
                />
                {errors.address && <span className="field-error-msg">{errors.address}</span>}
              </div>

              <div className="form-two-col">
                <div className="form-input-field">
                  <label>Postal PIN Code *</label>
                  <input
                    type="text"
                    name="postalCode"
                    placeholder="6-digit PIN code"
                    maxLength={6}
                    value={formValues.postalCode}
                    onChange={handleChange}
                    className="modal-input"
                  />
                  {errors.postalCode && <span className="field-error-msg">{errors.postalCode}</span>}
                </div>

                <div className="form-input-field">
                  <label>Country *</label>
                  <Select
                    options={Country.getAllCountries().map((c) => ({
                      label: c.name,
                      value: c.isoCode,
                    }))}
                    placeholder="Select Country"
                    onChange={(country) => {
                      setSelectedCountry(country);
                      setSelectedState(null);
                      setSelectedCity(null);
                      setFormValues((prev) => ({
                        ...prev,
                        country: country.label,
                      }));
                    }}
                    className="react-select-container"
                  />
                  {errors.country && <span className="field-error-msg">{errors.country}</span>}
                </div>
              </div>

              <div className="form-two-col">
                <div className="form-input-field">
                  <label>State *</label>
                  <Select
                    options={
                      selectedCountry
                        ? State.getStatesOfCountry(selectedCountry.value).map((s) => ({
                            label: s.name,
                            value: s.isoCode,
                          }))
                        : []
                    }
                    placeholder="Select State"
                    onChange={(st) => {
                      setSelectedState(st);
                      setSelectedCity(null);
                      setFormValues((prev) => ({
                        ...prev,
                        state: st.label,
                      }));
                    }}
                    isDisabled={!selectedCountry}
                    className="react-select-container"
                  />
                  {errors.state && <span className="field-error-msg">{errors.state}</span>}
                </div>

                <div className="form-input-field">
                  <label>City *</label>
                  <Select
                    options={
                      selectedState && selectedCountry
                        ? City.getCitiesOfState(selectedCountry.value, selectedState.value).map((c) => ({
                            label: c.name,
                            value: c.name,
                          }))
                        : []
                    }
                    placeholder="Select City"
                    onChange={(city) => {
                      setSelectedCity(city);
                      setFormValues((prev) => ({
                        ...prev,
                        city: city.label,
                      }));
                    }}
                    isDisabled={!selectedState}
                    className="react-select-container"
                  />
                  {errors.city && <span className="field-error-msg">{errors.city}</span>}
                </div>
              </div>

              <div className="modal-actions-footer">
                <button
                  type="button"
                  className="btn-modal-cancel"
                  onClick={() => setShowAddressPopup(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-modal-save"
                  disabled={loading}
                >
                  {loading ? "Saving Address..." : "Save Delivery Address"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ✏️ EDIT ADDRESS MODAL */}
      {showEditAddressPopup && (
        <div className="modal-backdrop-overlay" onClick={() => setShowEditAddressPopup(false)}>
          <div className="modern-address-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-bar">
              <h3>Edit Delivery Address</h3>
              <button
                type="button"
                className="modal-close-icon-btn"
                onClick={() => setShowEditAddressPopup(false)}
              >
                <IoCloseSharp size={22} />
              </button>
            </div>

            <form className="modal-address-form" onSubmit={(e) => { e.preventDefault(); handleUpdateAddress(); }}>
              <div className="form-two-col">
                <div className="form-input-field">
                  <label>First Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={editFromValues.name}
                    onChange={handleEditChange}
                    className="modal-input"
                  />
                </div>

                <div className="form-input-field">
                  <label>Last Name *</label>
                  <input
                    type="text"
                    name="lastname"
                    value={editFromValues.lastname}
                    onChange={handleEditChange}
                    className="modal-input"
                  />
                </div>
              </div>

              <div className="form-two-col">
                <div className="form-input-field">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={editFromValues.email}
                    onChange={handleEditChange}
                    className="modal-input"
                  />
                </div>

                <div className="form-input-field">
                  <label>Mobile Number *</label>
                  <input
                    type="tel"
                    name="mobile"
                    maxLength={10}
                    value={editFromValues.mobile}
                    onChange={handleEditChange}
                    className="modal-input"
                  />
                </div>
              </div>

              <div className="form-input-field">
                <label>Address *</label>
                <textarea
                  name="address"
                  rows={2}
                  value={editFromValues.address}
                  onChange={handleEditChange}
                  className="modal-input"
                />
              </div>

              <div className="form-two-col">
                <div className="form-input-field">
                  <label>Postal Code *</label>
                  <input
                    type="text"
                    name="postalCode"
                    maxLength={6}
                    value={editFromValues.postalCode}
                    onChange={handleEditChange}
                    className="modal-input"
                  />
                </div>

                <div className="form-input-field">
                  <label>City *</label>
                  <input
                    type="text"
                    name="city"
                    value={editFromValues.city || ""}
                    onChange={handleEditChange}
                    className="modal-input"
                  />
                </div>
              </div>

              <div className="form-two-col">
                <div className="form-input-field">
                  <label>State *</label>
                  <input
                    type="text"
                    name="state"
                    value={editFromValues.state || ""}
                    onChange={handleEditChange}
                    className="modal-input"
                  />
                </div>

                <div className="form-input-field">
                  <label>Country</label>
                  <input
                    type="text"
                    name="country"
                    value={editFromValues.country || "India"}
                    onChange={handleEditChange}
                    className="modal-input"
                  />
                </div>
              </div>

              <div className="modal-actions-footer">
                <button
                  type="button"
                  className="btn-modal-cancel"
                  onClick={() => setShowEditAddressPopup(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-modal-save"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </section>
  );
};

export default Checkout;
