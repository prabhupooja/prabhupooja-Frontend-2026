import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import "./ecommerceNew.css";
import Swal from "sweetalert2";
import useUserCardStore from "../../Store/userCardStore/userCardStore";
import useAuthStore from "../../Store/UserStore/userAuthStore";
import useHomeStore from "../../Store/dataStore/homeStore";
import { TailSpin } from "react-loader-spinner";
import CryptoJS from "crypto-js";

const EcommerceNew = () => {
  const [filter, setFilter] = useState("");
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedRange, setSelectedRange] = useState(null);

  const { addToCart, getCartItems } = useUserCardStore();
  const { user1, setIsLoginPopup } = useAuthStore();
  const { products, getProducts, isLoading } = useHomeStore();
  const [loading, setLoading] = useState();
  const filterRef = useRef();

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilterOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAddToCart = async (productId) => {
    setLoading(productId);

    if (!user1) {
      Swal.fire({
        title: "Please login first",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Login Now",
        cancelButtonText: "Cancel",
      }).then((result) => {
        setLoading(null);
        if (result.isConfirmed) {
          setIsLoginPopup(true);
        }
      });
    } else {
      try {
        const response = await addToCart({
          user_id: user1?.id,
          productId: productId,
          quantity: 1,
        });

        getCartItems(user1?.id);

        if (response.success) {
          Swal.fire("Success", "Product added to cart", "success");
        } else {
          Swal.fire("Failed", "Could not add to cart", "error");
        }
      } catch (error) {
        Swal.fire("Error", "Something went wrong", "error");
      } finally {
        setLoading(null);
      }
    }
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const toggleFilterOptions = () => {
    setShowFilterOptions(!showFilterOptions);
  };

  //   const handleProductClick = (product) => {
  //     setSelectedProduct(product);
  //     setShowFilterOptions(false);
  //   };

  const filteredProducts = selectedProduct
    ? [selectedProduct]
    : selectedRange
    ? products.filter(
        (product) =>
          product.price >= selectedRange.min &&
          product.price < selectedRange.max
      )
    : products.filter((product) =>
        product.productName.toLowerCase().includes(filter.toLowerCase())
      );

  const encryptId = (ID) => {
    const encrypted = CryptoJS.AES.encrypt(
      ID.toString(),
      "prabhupooja2024"
    ).toString();
    return encodeURIComponent(encrypted);
  };

  const priceRanges = [
    { label: "₹0 - ₹500", min: 0, max: 500 },
    { label: "₹500 - ₹2000", min: 500, max: 2000 },
    { label: "₹2000 - ₹5000", min: 2000, max: 5000 },
    { label: "₹5000 - ₹20000", min: 5000, max: 20000 },
  ];

  if (isLoading) {
    return (
      <div className="ecom-loader">
        <TailSpin height="50" width="50" color="orange" />
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <>
      <div className="sub_header_ecommerce">
        <div className="container">
          <div className="subheader_inner_ecommerce">
            <div className="subheader_text_ecommerce">
              <h1>E-commerce</h1>
            </div>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link className="btn-link" to="/">
                    Home
                  </Link>
                </li>
                <li className="breadcrumb-item active">E-commerce</li>
              </ol>
            </nav>
          </div>
        </div>
      </div>

      <div className="ecom-wrapper">
        <div className="ecomContainer">
          <div className="ecom-filters">
            <input
              type="text"
              placeholder="Search by name"
              value={filter}
              onChange={handleFilterChange}
              className="ecom-search-input"
            />

            <div className="filter-buttons">
              <button className="active" onClick={toggleFilterOptions}>
                {selectedRange ? `${selectedRange.label}` : "Filter by Price"}
              </button>
              {selectedRange && (
                <button
                  onClick={() => setSelectedRange(null)}
                  className="ecom-clear-filter-btn"
                >
                  Clear
                </button>
              )}
            </div>

            {showFilterOptions && (
              <div className="ecom-popup" ref={filterRef}>
                <ul>
                  {priceRanges.map((range, i) => (
                    <li
                      key={i}
                      onClick={() => {
                        setSelectedRange(range);
                        setShowFilterOptions(false);
                      }}
                    >
                      {range.label}
                    </li>
                  ))}
                </ul>
                {selectedRange && (
                  <button
                    onClick={() => setSelectedRange(null)}
                    className="ecom-clear-filter-btn"
                  >
                    Clear Price Filter
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="ecom-product-grid">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => {
                const encryptedId = encryptId(product.id);
                return (
                  <div className="ecom-card" key={product.id}>
                    <Link to={`/productdetails/${encryptedId}`}>
                      <img
                        src={product.image[0]}
                        alt={product.productName}
                        className="ecom-card-img"
                      />
                    </Link>
                    <div className="ecom-card-body">
                      <h4>
                        {product.productName.split(" ").slice(0, 8).join(" ") +
                          (product.productName.split(" ").length > 8
                            ? "..."
                            : "")}
                      </h4>
                      <p className="ecom-price">
                        <span className="ecom-original">₹{product.price}</span>{" "}
                        <span className="ecom-offer">
                          ₹{product.offerPrice}
                        </span>
                      </p>
                      <div className="ecom-buttons">
                        <Link
                          to={`/productdetails/${encryptedId}`}
                          className="ecom-btn primary"
                        >
                          Buy Now
                        </Link>
                        <button
                          onClick={() => handleAddToCart(product.id)}
                          className="ecom-btn secondary"
                          disabled={loading === product.id}
                        >
                          {loading === product.id ? "Adding..." : "Add to Cart"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="ecom-no-results">
                <p>No results found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default EcommerceNew;
