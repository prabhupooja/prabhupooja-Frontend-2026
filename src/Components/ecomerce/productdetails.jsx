import React, { useEffect, useState, useRef } from "react";
import "../../styles/productdetail.css";
import { Link, useParams, useNavigate } from "react-router-dom";
import api from "../Axios/api";
import { TailSpin } from "react-loader-spinner";
import useAuthStore from "../../Store/UserStore/userAuthStore";
import CryptoJS from "crypto-js";
import Swal from "sweetalert2";
import { FaShoppingCart } from "react-icons/fa";
import { AiFillForward } from "react-icons/ai";
import useUserCardStore from "../../Store/userCardStore/userCardStore";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";

const Productdetails = () => {
  const { productId } = useParams();
  const [productData, setProductData] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);
  const { addToCart, getCartItems } = useUserCardStore();
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState("");
  const { user1, setIsLoginPopup } = useAuthStore();
  const navigate = useNavigate();
  const mainImageRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [images, setImages] = useState([]);
  const [selectedTab, setSelectedTab] = useState("description");
  const [reviews, setReviews] = useState([]);

  const openImageViewer = (img, imgArray) => {
    setImages(imgArray);
    setPhotoIndex(imgArray.indexOf(img));
    setIsOpen(true);
  };

  useEffect(() => {
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [images]);

  const decryptId = (encryptedIdFromUrl) => {
    const decodedId = decodeURIComponent(encryptedIdFromUrl);
    const bytes = CryptoJS.AES.decrypt(decodedId, "prabhupooja2024");
    return bytes.toString(CryptoJS.enc.Utf8);
  };

  const fetchProductData = async () => {
    const res = await api.get(`/products/get/${decryptId(productId)}`);
    setProductData(res.data.data[0]);
    setMainImage(res.data.data[0].image[0]);
    setLoading(false);

    // console.log(res, "lkllklklklklk");
  };

  const fetchRelatedProducts = async () => {
    const res = await api.get(
      `/products/reletedProduct/${decryptId(productId)}`
    );
    setRelatedProducts(res.data.data);
  };

  const fetchReviews = async () => {
    const res = await api.get(`/products/getReview/${decryptId(productId)}`);
    setReviews(res.data.data);
  };

  useEffect(() => {
    if (productId) {
      fetchRelatedProducts();
      fetchProductData();
      fetchReviews();
    }
  }, [productId]);

  const totalPrice = quantity * (productData?.offerPrice || 0);

  const handleAddToCart = async (product) => {
   
      try {
        const response = await addToCart({
          user_id: user1?.id,
          product: product,
          quantity: quantity,
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
  };

  const handleBuyNow = () => {
    
      navigate("/checkout", {
        state: {
          productId: decryptId(productId),
          quantity,
          totalPrice,
          user: user1 || null,
          booking: "normal",
          images: productData.image[0],
          marchentId: productData.merchantId,
          productName: productData.productName,
        },
      });
  };

  const handleThumbnailClick = (image) => {
    setMainImage(image);
  };

  const handleMouseMove = (e) => {
    const image = mainImageRef.current;
    const rect = image.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    image.style.transformOrigin = `${x}% ${y}%`;
    image.style.transform = "scale(2)";
    image.style.transition = "transform 0.2s ease-out";
    image.style.cursor = "zoom-in";
  };

  const handleMouseLeave = () => {
    const image = mainImageRef.current;
    image.style.transform = "scale(1)";
    image.style.transformOrigin = "center center";
  };

  const encryptId = (id) => {
    const encrypted = CryptoJS.AES.encrypt(
      id.toString(),
      "prabhupooja2024"
    ).toString();
    return encodeURIComponent(encrypted);
  };

  const handleIncrement = () => {
    setQuantity((prevQuantity) => Number(prevQuantity) + 1);
  };

  const handleDecrement = () => {
    setQuantity((prevQuantity) => Math.max(Number(prevQuantity) - 1, 1));
  };

  if (loading) {
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

  const stockStatus = productData.noOfItems > 0 ? "In Stock" : "Out of Stock";
  const isStockAvailable = productData.noOfItems > 0;
  return (
    <section className="section">
      <div className="container">
        <div className="productdetails_box">
          <div className="productdetails_imagebox">
            <div
              className="product-img"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <Link>
                <img
                  src={mainImage}
                  alt="Main Product"
                  ref={mainImageRef}
                  className="zoom-image"
                />
              </Link>
            </div>

            <div className="thumbnails">
              {productData?.image &&
                productData.image.map((thumbnail, index) => (
                  <img
                    key={index}
                    src={thumbnail}
                    alt={`Thumbnail ${index + 1}`}
                    className="thumbnail-img"
                    onClick={() => handleThumbnailClick(thumbnail)}
                  />
                ))}
            </div>
          </div>

          <div className="productdetails_detailpage">
            <h1 className="product_title">{productData.productName}</h1>
            <div className="productdetails_prices">
              <p className="product_originalprice">₹{productData.price}</p>
              <p className="product_offerprice">₹{productData.offerPrice}</p>
            </div>

            <div className="productdetails_ratings">
              <div className="product-rating-stars">
                {Array.from({ length: 5 }, (_, i) => {
                  const rating = productData.average_rating;
                  if (i < Math.floor(rating)) {
                    return <FaStar key={i} className="product-star filled" />;
                  } else if (i < rating) {
                    return (
                      <FaStarHalfAlt key={i} className="product-star half" />
                    );
                  } else {
                    return <FaRegStar key={i} className="product-star" />;
                  }
                })}
              </div>
              <div className="rating-label">
                {productData.average_rating >= 4.5
                  ? " Excellent"
                  : productData.average_rating >= 3.5
                    ? " Good"
                    : productData.average_rating >= 2.5
                      ? " Average"
                      : " Poor"}{" "}
                (
                {productData.average_rating
                  ? parseFloat(productData.average_rating).toFixed(2)
                  : "0.00"}{" "}
                ratings)
              </div>
            </div>

            <p className="product-detail">Details:</p>
            <div className="product-content">
              <div className="product-pane active">
                <div className="productsingle_details">
                  <span className="product-detail-titile">Height:</span>
                  <span className="product-detail-titlename">
                    {productData?.Height}
                  </span>
                </div>
                <div className="productsingle_details">
                  <span className="product-detail-titile">
                    Base Dimension:{" "}
                  </span>
                  <span className="product-detail-titlename">
                    {productData?.Dimension}
                  </span>
                </div>
                <div className="productsingle_details">
                  <span className="product-detail-titile">Weight: </span>
                  <span className="product-detail-titlename">
                    {" "}
                    {productData?.Weight}
                  </span>
                </div>
                <div className="productsingle_details">
                  <span className="product-detail-titile">Product Code: </span>
                  <span className="product-detail-titlename">
                    {productData?.ProductCode}
                  </span>
                </div>

                <div className="productsingle_details">
                  <span className="product-detail-titile">
                    Number of Items: 
                  </span>
                   <span
                    className={`stock-status ${isStockAvailable ? " in-stock" : " out-of-stock"
                      }`}
                  >
                     {stockStatus}
                  </span>
                </div>
              </div>
            </div>
            <div className="product-detail-btnrow">
              <div className="quantity-selector">
                <button
                  onClick={handleDecrement}
                  className="quantity-btn quantity-btn-decrement"
                >
                  -
                </button>
                <input
                  type="text"
                  value={quantity}
                  readOnly
                  className="quantity-input"
                />
                <button
                  onClick={handleIncrement}
                  className="quantity-btn quantity-btn-increment"
                >
                  +
                </button>
              </div>
              <button
                className="product-addcart-btn"
                onClick={() => handleAddToCart(productData)}
              >
                <FaShoppingCart className="product_carticon" />
                Add to Cart
              </button>
              <button
                className="product-buynow-btn"
                onClick={(e) => {
                  e.preventDefault();
                  handleBuyNow();
                }}
                disabled={!isStockAvailable}
              >
                <AiFillForward className="product_buyicon" />
                Buy Now
              </button>
            </div>
          </div>
        </div>

        <div className="tabs">
          <div
            className={`tab ${selectedTab === "description" ? "active" : ""}`}
            onClick={() => setSelectedTab("description")}
          >
            Description
          </div>
          <div
            className={`tab ${selectedTab === "reviews" ? "active" : ""}`}
            onClick={() => setSelectedTab("reviews")}
          >
            Reviews ({reviews.length})
          </div>
        </div>

        <div className="content">
          {selectedTab === "description" && (
            <div className="Description_section">
              <div>
                {/* <h3 className="productdes_maintitle">Description</h3> */}
                <p className="productdes_para">{productData.description}</p>
              </div>

              <div>
                <h3 className="productdes_title">Product Highlights</h3>
                {(Array.isArray(productData?.ProductHighlights)
                  ? productData.ProductHighlights
                  : productData?.ProductHighlights?.split("\n")
                )?.map((point, index) => (
                  <li className="productdes_list" key={index}>
                    {point}
                  </li>
                ))}
              </div>

              <div>
                <h3 className="productdes_title">Benefits</h3>
                {(Array.isArray(productData?.Benefits)
                  ? productData.Benefits
                  : productData?.Benefits?.split("\n")
                )?.map((point, index) => (
                  <li className="productdes_list" key={index}>
                    {point}
                  </li>
                ))}
              </div>

              <div>
                <h3 className="productdes_title">Usage & Care Instructions</h3>
                {(Array.isArray(productData?.UsageAndCareInstructions)
                  ? productData.UsageAndCareInstructions
                  : productData?.UsageAndCareInstructions?.split("\n")
                )?.map((point, index) => (
                  <li className="productdes_list" key={index}>
                    {point}
                  </li>
                ))}
              </div>
            </div>
          )}

          {selectedTab === "reviews" && (
            <div className="productReviewView">
              <div className="productReviewViewbox">
                {reviews?.map((review) => (
                  <div key={review.id} className="reviewItem">
                    <img
                      src={
                        review.userImage || require("../Assets/profile-pic.png")
                      }
                      alt="User"
                      className="reviewUserImage"
                    />
                    <div className="reviewContent">
                      <div className="reviewHeader">
                        <span className="reviewUserName">
                          {review.name + " " + review.lastname || "unknown"}
                        </span>
                        <span className="reviewStars">
                          {"★".repeat(review.stars)}
                        </span>
                      </div>
                      <p className="reviewText">Reason: {review.reason}</p>

                      <p className="reviewText">{review.text}</p>
                      <div className="reviewImages">
                        {review?.reviewImages.map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt={idx}
                            style={{
                              width: "100px",
                              height: "100px",
                              marginRight: "8px",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              openImageViewer(img, review?.reviewImages)
                            }
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}

                {isOpen && (
                  <Lightbox
                    mainSrc={images[photoIndex]}
                    nextSrc={images[(photoIndex + 1) % images.length]}
                    prevSrc={
                      images[(photoIndex + images.length - 1) % images.length]
                    }
                    onCloseRequest={() => setIsOpen(false)}
                    onMovePrevRequest={() =>
                      setPhotoIndex(
                        (photoIndex + images.length - 1) % images.length
                      )
                    }
                    onMoveNextRequest={() =>
                      setPhotoIndex((photoIndex + 1) % images.length)
                    }
                  />
                )}
              </div>
              {reviews.length === 0 && (
                <div className="noReviews">No Reviews</div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="related-products">
        <h2 className="related-title">You may also like</h2>
        <div className="related-products-list">
          {relatedProducts?.slice(0, 4)?.map((product) => {
            const encryptedId = encryptId(product.id);
            return (
              <Link
                to={`/productdetails/${encryptedId}`}
                className="related-product-link"
                key={product.id} // move `key` here for React best practices
              >
                <div className="related-product-card">
                  <img
                    src={product.image[0]}
                    alt={product.productName}
                    className="related-product-img"
                  />
                  <p className="related-product-name">
                    {product.productName.split(" ").slice(0, 8).join(" ") +
                      (product.productName.split(" ").length > 8 ? "..." : "")}
                  </p>
                  <div className="product-price-box">
                    <p className="related-product-price">₹{product.price}</p>
                    <p className="related-product-offerPrice">
                      ₹{product.offerPrice}
                    </p>
                  </div>

                  <button className="product_relatedbtn">View Details</button>
                </div>
              </Link>
            );
          })}

        </div>
      </div>
    </section>
  );
};

export default Productdetails;
