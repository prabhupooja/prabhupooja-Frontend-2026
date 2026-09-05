import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../../styles/ecommerce.css";
import Swal from "sweetalert2";
import useUserCardStore from "../../Store/userCardStore/userCardStore";
import useAuthStore from "../../Store/UserStore/userAuthStore";
import useHomeStore from "../../Store/dataStore/homeStore";
import { TailSpin } from "react-loader-spinner";
import CryptoJS from "crypto-js";
import { IoMdClose } from "react-icons/io";
import { getSafeImageUrl } from "../../utils/imageHelper";

const Ecommerce = () => {
  const [filter, setFilter] = useState("");
  // const [loading1, setLoading1] = useState(true);
  const [filterBy, setFilterBy] = useState("name");
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { addToCart, getCartItems } = useUserCardStore();
  const { user1, setIsLoginPopup } = useAuthStore();
  const { products, getProducts, isLoading } = useHomeStore();

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  const handleAddToCart = async (productId) => {
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
    } else {
      try {
        const response = await addToCart({
          user_id: user1?.id,
          productId: productId,
          quantity: 1,
        });

        // console.log(response.success, "Product add status");
        getCartItems(user1?.id);

        if (response.success) {
          Swal.fire({
            icon: "success",
            title: "Product added to cart",
            text: "The product has been successfully added to your cart!",
            confirmButtonText: "Ok",
          });
        }
        if (!response.success) {
          Swal.fire({
            icon: "error",
            title: "Failed to add product",
            text: "There was an issue adding the product to your cart.",
            confirmButtonText: "Try Again",
          });
        }
      } catch (error) {
        console.error("Error adding product to cart: ", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "An error occurred while adding the product to the cart.",
          confirmButtonText: "Ok",
        });
      }
    }
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const toggleFilterType = (type) => {
    setFilterBy(type);
    setFilter("");
    setShowFilterOptions(false);
  };

  const toggleFilterOptions = () => {
    setShowFilterOptions(!showFilterOptions);
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setShowFilterOptions(false);
  };

  const filteredProductNames = products?.map((product) => product?.productName);
  const filteredPrices = products?.map((product) => product.price);

  const filteredProducts = selectedProduct
    ? [selectedProduct]
    : products.filter((product) =>
        filterBy === "name"
          ? product.productName.toLowerCase().includes(filter.toLowerCase())
          : product.price.toString().includes(filter)
      );

  const encryptId = (ID) => {
    const encrypted = CryptoJS.AES.encrypt(
      ID.toString(),
      "prabhupooja2024"
    ).toString();
    return encodeURIComponent(encrypted);
  };

  if (isLoading) {
    return (
      <>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "5vh",
            marginTop: "50px",
          }}
        >
          <TailSpin height="50" width="50" color="orange" />
        </div>
        <p className="loading_text">Loading...</p>
      </>
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

      <section className="section" style={{ paddingTop: ".5rem" }}>
        <div className="container">
          <h1 className="section-title" style={{ marginBottom: "1rem" }}>
            Products
          </h1>

          <div className="card">
            <div className="card-header">
              <div className="filter-container">
                <button
                  className={`filter-btn ${
                    filterBy === "name" ? "active-filter" : ""
                  }`}
                  onClick={() => {
                    toggleFilterType("name");
                    toggleFilterOptions();
                  }}
                >
                  Filter by Name
                </button>
                <button
                  className={`filter-btn ${
                    filterBy === "price" ? "active-filter" : ""
                  }`}
                  onClick={() => {
                    toggleFilterType("price");
                    toggleFilterOptions();
                  }}
                >
                  Filter by Price
                </button>
                <input
                  className="filter-input"
                  type="text"
                  value={filter}
                  onChange={handleFilterChange}
                  placeholder={
                    filterBy === "name"
                      ? "Search by name..."
                      : "Search by price..."
                  }
                />
              </div>
            </div>
          </div>

          {showFilterOptions && (
            <div className="filter-options-popup">
              <IoMdClose
                className="ecom-close-icon"
                onClick={() => setShowFilterOptions(false)}
              />
              <h5>Select {filterBy === "name" ? "Product" : "Price"}</h5>
              <ul>
                {filterBy === "name"
                  ? filteredProductNames.map((name, index) => (
                      <li
                        key={index}
                        onClick={() =>
                          handleProductClick(
                            products.find(
                              (product) => product.productName === name
                            )
                          )
                        }
                      >
                        {name}
                      </li>
                    ))
                  : filteredPrices.map((price, index) => (
                      <li
                        key={index}
                        onClick={() =>
                          handleProductClick(
                            products.find((product) => product.price === price)
                          )
                        }
                      >
                       ₹{price}
                      </li>
                    ))}
              </ul>
            </div>
          )}

          <div className="product-container">
            {filteredProducts.map((product) => {
              const incryptedId = encryptId(product.id);
              return (
                <div className="pd-box1" key={product.id}>
                  <div className="pd-img">
                    <Link to={`/productdetails/${incryptedId}`}>
                      <img src={getSafeImageUrl(product.image)} alt={product.productName} />
                    </Link>
                  </div>
                  <div className="pd-box-content">
                    <Link to={`/productdetails/${product.id}`}>
                      <h6>{product.productName}</h6>
                    </Link>
                    <div className="price-booknow">
                      <div className="price-group">
                        <p className="original-price">₹{product.price}</p>
                        <p className="current-price">
                          <strong>
                            <span>₹{product.offerPrice}</span>
                          </strong>
                        </p>
                      </div>
                      <Link
                        className="booknow-btn"
                        to={`/productdetails/${incryptedId}`}
                      >
                        Buy Now
                      </Link>
                      <button
                        className="booknow-btn add-to-cart-btn"
                        onClick={() => handleAddToCart(product.id)}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default Ecommerce;
