import React, { useEffect, useState } from "react";
import "../../styles/checkout.css";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../Axios/api";
import Swal from "sweetalert2";
import useAuthStore from "../../Store/UserStore/userAuthStore";
import useHomeStore from "../../Store/dataStore/homeStore";
import useUserStore from "../../Store/UserStore/userStore";
import { IoCloseSharp } from "react-icons/io5";
import { GoHome } from "react-icons/go";
import Select from "react-select";
import { Country, State, City } from "country-state-city";
import { FiEdit } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";

const Checkout = () => {
  const token = localStorage.getItem("token");
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const productId = JSON.parse(queryParams.get("productId"));
  const quantity = JSON.parse(queryParams.get("quantity"));
  const totalPrice = queryParams.get("totalPrice");
  const booking = queryParams.get("booking");
  const images = JSON.parse(queryParams.get("images"));
  const productName = JSON.parse(queryParams.get("productName"));
  const marchentId = JSON.parse(queryParams.get("marchentId"));

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
    city: selectedCity,
    state: selectedState,
    country: selectedCountry,
    postalCode: "",
  });
  const [editFromValues, setEditFormValues] = useState({
    name: "",
    lastname: "",
    email: "",
    mobile: "",
    address: "",
    city: selectedCity,
    state: selectedState,
    country: selectedCountry,
    postalCode: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { user1, setIsLoginPopup } = useAuthStore();
  const {
    getAddressById,
    userAddress,
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
  const [ppaymentId, setPpyamentId] = useState(null);
  // const hasReloaded = useRef(false);
  const handlePaymentChange = (selectedOption) => {
    setPaymentMethod(selectedOption ? selectedOption.value : "");
  };

  
  const getAddress = async () => {
    setLoading(true);
    await getAddressById(user1?.id);
    setLoading(false);
  };

  useEffect(() => {
    if (user1) {
      setFormValues(user1);
      getAddress();
    }
  }, [user1, navigate]);

  useEffect(() => {
    if (!productId) {
        navigate("/cart");
    }
  }, [productId]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePayment = async (e) => {
    if (!user1) {
      Swal.fire({
        title: "Please login first",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Login Now",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          setIsLoginPopup(true);
        }
      });
      return; 
    }

    if (!selectedAddress) {
      Swal.fire({
        title: "Address Required",
        text: "Please Select Address!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ok",
        cancelButtonText: "Cancel",
      });
      return;
    }

    setLoading(true);

    if (paymentMethod === "COD") {
      try {
        await api.post(
          "/orders/create",
          {
            productId,
            userId: user1?.id,
            quantity,
            totalPrice: offeredPrice,
            booking,
            images,
            paymentMethod: "COD",
            status: "unpaid",
            marchentId,
            name: selectedAddress.name,
            lastname: selectedAddress.lastname,
            email: selectedAddress.email,
            number: selectedAddress.number,
            address: selectedAddress.address.address,
            country: selectedAddress.address.country,
            state: selectedAddress.address.state,
            city: selectedAddress.address.city,
            postalCode: selectedAddress.address.postalCode,
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
          title: "Order Placed Successfully!",
          text: "Thank you for your purchase. Your order is being processed!",
          icon: "success",
          confirmButtonText: "Ok!",
          confirmButtonColor: "#D35400",
          background: "#f4f4f4",
          color: "#333",
        });
        navigate("/myorders");
      } catch (error) {
        setLoading(false);
        console.error("COD Order creation failed:", error);
        Swal.fire(
          "Error",
          "An error occurred during COD order creation.",
          "error"
        );
      }
    } else {
      try {
        setLoading(true);
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

        const options = {
          key: "rzp_live_wqQsW2lGC8RXmJ",

          amount,
          currency: "INR",
          name: "Prabhu Pooja",
          description: "Product Purchase",
          order_id: orderId,
          handler: async function (response) {
            try {
              const verifyResponse = await api.post(
                "/payment/verify-payment",
                {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              setPpyamentId(response.razorpay_payment_id, "lklklk");

              // console.log(response.razorpay_payment_id, ppaymentId, "lkjkjk");

              setLoading(false);
              if (verifyResponse.data.success) {
                const response = await api.post(
                  "/orders/create",
                  {
                    productId,
                    userId: user1?.id,
                    quantity,
                    totalPrice: offeredPrice,
                    booking,
                    images,
                    paymentMethod: "UPI",
                    status: "paid",
                    marchentId,
                    name: selectedAddress.name,
                    lastname: selectedAddress.lastname,
                    email: selectedAddress.email,
                    number: selectedAddress.number,
                    address: selectedAddress.address.address,
                    country: selectedAddress.address.country,
                    state: selectedAddress.address.state,
                    city: selectedAddress.address.city,
                    postalCode: selectedAddress.address.postalCode,
                    paymentId: ppaymentId,
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );

                if (response.data.success) {
                  setLoading(false);
                  Swal.fire({
                    title: "Order Placed Successfully!",
                    text: "Thank you for your purchase. Your order is being processed!",
                    icon: "success",
                    confirmButtonText: "Ok!",
                    confirmButtonColor: "#D35400",
                    background: "#f4f4f4",
                    color: "#333",
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
              Swal.fire("Payment or Order creation failed", "", "error");
            }
          },
          prefill: {
            email: user1?.email,
            contact: user1?.mobile,
          },
          theme: {
            color: "#3399cc",
          },
          method: {
            upi: true,
            qr: true,
          },
        };

        const rzp1 = new window.Razorpay(options);
        rzp1.open();

        rzp1.on("payment.failed", function (response) {
          Swal.fire(`Error: ${response.error.description}`, "", "error");
        });
      } catch (error) {
        setLoading(false);
        Swal.fire("Error", "An error occurred during payment.", "error");
      }
    }
  };

  const handleApply = async () => {
    if (!couponCode) {
      setErrorCouponMessage("Coupon Code is required!");
      return;
    }

    try {
      setLoading(true);
      const response = await getValidCoupon(couponCode);
      if (response?.data?.success) {
        setLoading(false);
        const discountType = response?.data?.type?.toLowerCase();
        const value = response?.data?.value || 0;
        let discount = 0;

        if (discountType === "percent") {
          discount = Math.floor((totalPrice * value) / 100);
        } else if (discountType === "flat") {
          discount = value;
        } else if (discountType === "upto") {
          discount = Math.floor((totalPrice * value) / 100);
        }

        setCouponDiscount(discount);
        setCouponMessage(
          `Coupon applied successfully! You saved ₹${discount}/-`
        );
        setErrorCouponMessage("");
        setOfferedPrice(totalPrice - discount);
        setCouponCode("");
        setIsCouponApplied(true);
      } else {
        setCouponDiscount(0);
        setErrorCouponMessage("Invalid coupon code. Please try again.");
        setCouponMessage("");
        setOfferedPrice(totalPrice);
        setIsCouponApplied(false);
      }
    } catch (error) {
      setLoading(false);
      console.error(
        "Error applying couponddddddddd:",
        error.response.data.message
      );
      setCouponDiscount(0);
      setErrorCouponMessage(
        error.response.data.message ||
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
    if (!user1?.id) {
      navigate("/");
      setLoading(false);

      return;
    }
    if (!name) newErrors.name = "First name is required.";
    if (!lastname) newErrors.lastname = "Last name is required.";
    if (!email) newErrors.email = "Email is required.";
    if (!mobile) newErrors.mobile = "Mobile number is required.";

    const mobileRegex = /^[0-9]{10}$/;
    if (mobile && !mobileRegex.test(mobile)) {
      newErrors.mobile = "Enter a valid 10-digit mobile number.";
    }

    if (!address) newErrors.address = "Address is required.";
    if (!city) newErrors.city = "City is required.";
    if (!state) newErrors.state = "State is required.";
    if (!country) newErrors.country = "Country is required.";
    if (!postalCode) newErrors.postalCode = "Postal code is required.";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);

      return;
    }

    setErrors({});

    try {
      const response = await addAddress({
        userId: user1?.id,
        name,
        lastname,
        email,
        number: mobile,
        city: city,
        state: state,
        address: address,
        country: country,
        postalCode: postalCode,
      });

      if (response?.success) {
        Swal.fire({
          title: "Address Added!",
          text: "Your delivery address has been saved successfully.",
          icon: "success",
          confirmButtonText: "Ok!",
          confirmButtonColor: "#D35400",
          background: "#f4f4f4",
          color: "#333",
        });

        await getAddressById(user1?.id);

        setShowAddressPopup(false);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error adding address:", error);
      setErrors("Failed to add address. Please try again.");
      setLoading(false);
    }
  };

  const handleupdateAddress = async (id) => {
    try {
      setLoading(true);
      const res = await updateAddress(id, {
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

      // console.log(res);

      if (res.data.success) {
        setLoading(false);
        Swal.fire("Success!", "Address updated successfully!", "success");
        getAddress();
      }
    } catch (error) {
      // console.log(error);
      Swal.fire(
        "Error",
        "Something went wrong while updating the address.",
        "error"
      );
    }
  };
  const handleDeleteAddress = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this address?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        const res = await deleteAddress(id);
        if (res.data.success) {
          Swal.fire(
            "Deleted!",
            "Address has been deleted successfully.",
            "success"
          );
        }
        setLoading(false);
        window.location.reload();
      } catch (error) {
        setLoading(false);
        // console.log(error);
        Swal.fire(
          "Error",
          "Something went wrong while deleting the address.",
          "error"
        );
      }
    }
  };

  const selectYourAddress = (addr) => {
    setSelectedAddress(addr);
  };

  const editEditAddress = (addr) => {
    setShowEditAddressPopup(true);
    setEditFormValues({
      name: addr.name,
      lastname: addr.lastname,
      email: addr.email,
      number: addr.number,
      address: addr.address.address,
      city: addr.address.city,
      state: addr.address.state,
      country: addr.address.country,
      postalCode: addr.address.postalCode,
    });
  };

  const paymentOptions = [
    { label: "Online Payment", value: "UPI" },
    { label: "Cash on Delivery (COD)", value: "COD" },
  ];

  const ShowAddressPopup = () => {
    if (!user1) {
      Swal.fire({
        title: "Please login first",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Login Now",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          setIsLoginPopup(true);
        }
        return;
      });
    } else {
      setShowAddressPopup(true);
    }
  };

  return (
    <section style={{ marginBottom: "1.5rem" }}>
      <div className="container">
        <h1 className="checkout-heading">Billing Details</h1>
        <div className="checkout">
          <div className="checkout-left">
            <button
              className="add-address-btn"
              onClick={() => ShowAddressPopup()}
            >
              <GoHome size={20} />
              Add New Address
            </button>

            <div className="store-addressDetails">
              <div className="address-list">
                {userAddress.length === 0 ? (
                  <p>
                    No Order Address Available, Please Add Your Addresss First.
                  </p>
                ) : (
                  userAddress.map((addr) => (
                    <div key={addr.id} className="address-card">
                      <p>
                        <strong>
                          {addr.name} {addr.lastname}
                        </strong>
                      </p>
                      <p>
                        {addr.number}, {addr.email}
                      </p>
                      <p>{addr.address.address}</p>
                      <p>
                        {addr.address.city}, {addr.address.state},{" "}
                        {addr.address.country}
                      </p>
                      <p>{addr.address.postalCode}</p>
                      <button
                        onClick={() => selectYourAddress(addr)}
                        className={`addressSelectedBtn ${
                          selectedAddress?.id === addr.id ? "selected" : ""
                        }`}
                      >
                        {selectedAddress?.id === addr.id
                          ? "Selected!"
                          : "Select"}
                      </button>
                      <div className="selectedAddressactionbtn">
                        <button
                          className="addressEditdBtn"
                          onClick={() => editEditAddress(addr)}
                        >
                          <FiEdit size={15} />
                          Edit
                        </button>
                        <button
                          className="addressRemoveBtn"
                          onClick={() => {
                            handleDeleteAddress(addr.id);
                          }}
                        >
                          <MdDeleteOutline size={18} />
                          Remove
                        </button>
                        {showEditAddressPopup && (
                          <div className="deliveryadd-overlay">
                            <div className="deliveryadd-modal">
                              <h2 className="deliveryadd-title">
                                Update Delivery Address
                              </h2>
                              <form className="deliveryadd-form">
                                <div className="deliveryadd-row">
                                  <div className="deliveryadd-field">
                                    <input
                                      type="text"
                                      name="name"
                                      placeholder="First Name"
                                      value={editFromValues.name}
                                      onChange={handleEditChange}
                                      className="deliveryadd-input"
                                    />
                                    {errors.name && (
                                      <p className="deliveryadd-error">
                                        {errors.name}
                                      </p>
                                    )}
                                  </div>
                                  <div className="deliveryadd-field">
                                    <input
                                      type="text"
                                      name="lastname"
                                      placeholder="Last Name"
                                      value={editFromValues.lastname}
                                      onChange={handleEditChange}
                                      className="deliveryadd-input"
                                    />
                                    {errors.lastname && (
                                      <p className="deliveryadd-error">
                                        {errors.lastname}
                                      </p>
                                    )}
                                  </div>
                                </div>

                                <div className="deliveryadd-row">
                                  <div className="deliveryadd-field">
                                    <input
                                      type="email"
                                      name="email"
                                      placeholder="Email"
                                      value={editFromValues.email}
                                      onChange={handleEditChange}
                                      className="deliveryadd-input"
                                    />
                                    {errors.email && (
                                      <p className="deliveryadd-error">
                                        {errors.email}
                                      </p>
                                    )}
                                  </div>
                                  <div className="deliveryadd-field">
                                    <input
                                      type="tel"
                                      name="mobile"
                                      placeholder="Mobile"
                                      value={editFromValues.number}
                                      onChange={handleEditChange}
                                      className="deliveryadd-input"
                                    />
                                    {errors.mobile && (
                                      <p className="deliveryadd-error">
                                        {errors.mobile}
                                      </p>
                                    )}
                                  </div>
                                </div>

                                <div className="deliveryadd-row">
                                  <div className="deliveryadd-field">
                                    <input
                                      type="text"
                                      name="address"
                                      placeholder="Address"
                                      value={editFromValues.address}
                                      onChange={handleEditChange}
                                      className="deliveryadd-input"
                                    />
                                    {errors.address && (
                                      <p className="deliveryadd-error">
                                        {errors.address}
                                      </p>
                                    )}
                                  </div>

                                  <div className="deliveryadd-field">
                                    <input
                                      type="text"
                                      name="postalCode"
                                      placeholder="Postal Code"
                                      value={editFromValues.postalCode}
                                      onChange={handleEditChange}
                                      className="deliveryadd-input"
                                    />
                                    {errors.postalCode && (
                                      <p className="deliveryadd-error">
                                        {errors.postalCode}
                                      </p>
                                    )}
                                  </div>
                                </div>

                                <div className="deliveryadd-row">
                                  <div className="deliveryadd-field">
                                    <Select
                                      options={Country.getAllCountries().map(
                                        (country) => ({
                                          label: country.name,
                                          value: country.isoCode,
                                        })
                                      )}
                                      placeholder="Select Country"
                                      onChange={(country) => {
                                        setSelectedCountry(country);
                                        setSelectedState(null);
                                        setSelectedCity(null);
                                        setEditFormValues((prev) => ({
                                          ...prev,
                                          country: country.label,
                                        }));
                                      }}
                                    />
                                    {errors.country && (
                                      <p className="deliveryadd-error">
                                        {errors.country}
                                      </p>
                                    )}
                                  </div>

                                  <div className="deliveryadd-field">
                                    <Select
                                      options={
                                        selectedCountry
                                          ? State.getStatesOfCountry(
                                              selectedCountry.value
                                            ).map((state) => ({
                                              label: state.name,
                                              value: state.isoCode,
                                            }))
                                          : []
                                      }
                                      placeholder="Select State"
                                      onChange={(state) => {
                                        setSelectedState(state);
                                        setSelectedCity(null);
                                        setEditFormValues((prev) => ({
                                          ...prev,
                                          state: state.label,
                                        }));
                                      }}
                                      isDisabled={!selectedCountry}
                                    />
                                    {errors.state && (
                                      <p className="deliveryadd-error">
                                        {errors.state}
                                      </p>
                                    )}
                                  </div>
                                </div>

                                <div className="deliveryadd-row">
                                  <div className="deliveryadd-field">
                                    <Select
                                      options={
                                        selectedState
                                          ? City.getCitiesOfState(
                                              selectedCountry.value,
                                              selectedState.value
                                            ).map((city) => ({
                                              label: city.name,
                                              value: city.name,
                                            }))
                                          : []
                                      }
                                      placeholder="Select City"
                                      onChange={(city) => {
                                        setSelectedCity(city);
                                        setEditFormValues((prev) => ({
                                          ...prev,
                                          city: city.label,
                                        }));
                                      }}
                                      isDisabled={!selectedState}
                                    />
                                    {errors.city && (
                                      <p className="deliveryadd-error">
                                        {errors.city}
                                      </p>
                                    )}
                                  </div>
                                  <div className="deliveryadd-field" />
                                </div>

                                <div className="deliveryadd-actions">
                                  <button
                                    type="button"
                                    className="deliveryadd-submit deliveryadd-actions-btn"
                                    onClick={() => handleupdateAddress(addr.id)}
                                    disabled={loading}
                                  >
                                    {loading ? "Please wait..." : "Submit"}
                                  </button>
                                  <button
                                    type="button"
                                    className="deliveryadd-cancel deliveryadd-actions-btn"
                                    onClick={() =>
                                      setShowEditAddressPopup(false)
                                    }
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </form>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="checkoutform-group">
              <Select
                id="paymentMethod"
                options={paymentOptions}
                value={paymentOptions.find(
                  (option) => option.value === paymentMethod
                )}
                onChange={handlePaymentChange}
                placeholder="-- Select Payment Method --"
                className="form-control"
              />

              <button
                type="button"
                className="primary_btn OrdetNowBtn"
                onClick={handlePayment}
              >
                {loading ? "Waiting..." : "Order Now"}
              </button>
            </div>
          </div>

          <div className="checkout-right">
            <h2>Product Details</h2>
            <div className="checkout-summary">
              {images &&
                (Array.isArray(images) ? (
                  images.map((url, index) => (
                    <div className="checkout-item" key={index}>
                      <img
                        src={url}
                        alt={`product-${index}`}
                        className="checkout-img"
                      />
                      <div className="checkout-details">
                        {productName && (
                          <h3 className="product-name">
                            {Array.isArray(productName)
                              ? productName[index]
                              : productName}
                          </h3>
                        )}
                        {Array.isArray(quantity) && quantity[index] && (
                          <p>Quantity: {quantity[index]}</p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="checkout-item">
                    <img src={images} alt="product" className="checkout-img" />
                    <div className="checkout-details">
                      {productName && (
                        <h3 className="product-name">{productName}</h3>
                      )}
                      <p>Quantity: {quantity}</p>
                      <p>
                        <strong>Total Price:</strong> ₹{totalPrice}
                      </p>
                    </div>
                  </div>
                ))}

              <div className="checkout-total">
                <p>
                  {Array.isArray(quantity) ? (
                    <span>
                      Total Quantity:{" "}
                      {quantity.reduce((total, num) => total + Number(num), 0)}
                    </span>
                  ) : (
                    <span>Quantity: {quantity}</span>
                  )}
                </p>
                {coupanDiscount > 0 ? (
                  <>
                    <p>
                      <strong>Total Price:</strong> <s>₹{totalPrice}</s>
                    </p>
                    <p>
                      <strong>Discount:</strong> ₹{coupanDiscount}
                    </p>
                    <p>
                      <strong>Final Price:</strong> ₹{offeredPrice}
                    </p>
                  </>
                ) : (
                  <p>
                    <strong>Total Price:</strong> ₹{totalPrice}
                  </p>
                )}
              </div>
            </div>

            <div className="customerCoupon">
              <div className="customerCoupon-box">
                <input
                  type="text"
                  placeholder="Enter your coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  required
                />

                <button
                  onClick={handleApply}
                  disabled={isCouponApplied}
                  className={`coupon-btn ${isCouponApplied ? "applied" : ""}`}
                >
                  {isCouponApplied ? "Applied!" : "Apply"}
                </button>
              </div>

              {couponMessage && (
                <div className="coupon-msg">
                  <span>{couponMessage}</span>
                  <span className="remove-button" onClick={handleRemoveCoupon}>
                    <IoCloseSharp size={20} />
                  </span>
                </div>
              )}
              {errorCouponMessage && (
                <div className="error coupon-msg">{errorCouponMessage}</div>
              )}
            </div>
          </div>
        </div>
      </div>
      {showAddressPopup && (
        <div className="deliveryadd-overlay">
          <div className="deliveryadd-modal">
            <h2 className="deliveryadd-title">Add New Delivery Address</h2>
            <form className="deliveryadd-form">
              <div className="deliveryadd-row">
                <div className="deliveryadd-field">
                  <input
                    type="text"
                    name="name"
                    placeholder="First Name"
                    value={formValues.name}
                    onChange={handleChange}
                    className="deliveryadd-input"
                  />
                  {errors.name && (
                    <p className="deliveryadd-error">{errors.name}</p>
                  )}
                </div>
                <div className="deliveryadd-field">
                  <input
                    type="text"
                    name="lastname"
                    placeholder="Last Name"
                    value={formValues.lastname}
                    onChange={handleChange}
                    className="deliveryadd-input"
                  />
                  {errors.lastname && (
                    <p className="deliveryadd-error">{errors.lastname}</p>
                  )}
                </div>
              </div>

              <div className="deliveryadd-row">
                <div className="deliveryadd-field">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formValues.email}
                    onChange={handleChange}
                    className="deliveryadd-input"
                  />
                  {errors.email && (
                    <p className="deliveryadd-error">{errors.email}</p>
                  )}
                </div>
                <div className="deliveryadd-field">
                  <input
                    type="tel"
                    name="mobile"
                    placeholder="Mobile"
                    value={formValues.mobile}
                    onChange={handleChange}
                    className="deliveryadd-input"
                  />
                  {errors.mobile && (
                    <p className="deliveryadd-error">{errors.mobile}</p>
                  )}
                </div>
              </div>

              <div className="deliveryadd-row">
                <div className="deliveryadd-field">
                  <input
                    type="text"
                    name="address"
                    placeholder="Address"
                    value={formValues.address}
                    onChange={handleChange}
                    className="deliveryadd-input"
                  />
                  {errors.address && (
                    <p className="deliveryadd-error">{errors.address}</p>
                  )}
                </div>

                <div className="deliveryadd-field">
                  <input
                    type="text"
                    name="postalCode"
                    placeholder="Postal Code"
                    value={formValues.postalCode}
                    onChange={handleChange}
                    className="deliveryadd-input"
                  />
                  {errors.postalCode && (
                    <p className="deliveryadd-error">{errors.postalCode}</p>
                  )}
                </div>
              </div>

              <div className="deliveryadd-row">
                <div className="deliveryadd-field">
                  <Select
                    options={Country.getAllCountries().map((country) => ({
                      label: country.name,
                      value: country.isoCode,
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
                  />
                  {errors.country && (
                    <p className="deliveryadd-error">{errors.country}</p>
                  )}
                </div>

                <div className="deliveryadd-field">
                  <Select
                    options={
                      selectedCountry
                        ? State.getStatesOfCountry(selectedCountry.value).map(
                            (state) => ({
                              label: state.name,
                              value: state.isoCode,
                            })
                          )
                        : []
                    }
                    placeholder="Select State"
                    onChange={(state) => {
                      setSelectedState(state);
                      setSelectedCity(null);
                      setFormValues((prev) => ({
                        ...prev,
                        state: state.label,
                      }));
                    }}
                    isDisabled={!selectedCountry}
                  />
                  {errors.state && (
                    <p className="deliveryadd-error">{errors.state}</p>
                  )}
                </div>
              </div>

              <div className="deliveryadd-row">
                <div className="deliveryadd-field">
                  <Select
                    options={
                      selectedState
                        ? City.getCitiesOfState(
                            selectedCountry.value,
                            selectedState.value
                          ).map((city) => ({
                            label: city.name,
                            value: city.name,
                          }))
                        : []
                    }
                    placeholder="Select City"
                    onChange={(city) => {
                      setSelectedCity(city);
                      setFormValues((prev) => ({ ...prev, city: city.label }));
                    }}
                    isDisabled={!selectedState}
                  />
                  {errors.city && (
                    <p className="deliveryadd-error">{errors.city}</p>
                  )}
                </div>
                <div className="deliveryadd-field" />
              </div>

              <div className="deliveryadd-actions">
                <button
                  type="button"
                  className="deliveryadd-submit deliveryadd-actions-btn"
                  onClick={addNewAddress}
                  disabled={loading}
                >
                  {loading ? "Please wait..." : "Submit"}
                </button>
                <button
                  type="button"
                  className="deliveryadd-cancel deliveryadd-actions-btn"
                  onClick={() => setShowAddressPopup(false)}
                >
                  Cancel
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
