import React, { useEffect, useState } from "react";
import "../../styles/productreviewdetails.css";
import { FaStar } from "react-icons/fa";
import api from "../../Axios/api";
import { TailSpin } from "react-loader-spinner";
import profileimg from "../Assets/profile-img.png";
import kanhaimg from "../Assets/kanha-img.jpeg";

function Productreviewdetails() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllReviews = async () => {
      try {
        const res = await api.get("/products/getAllReview");
        if (res.data?.success && Array.isArray(res.data?.data)) {
          setReviews(res.data.data);
        }
      } catch (err) {
        console.warn("Could not fetch all reviews:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllReviews();
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh", flexDirection: "column" }}>
        <TailSpin height="50" width="50" color="#ea580c" />
        <p style={{ marginTop: "12px", color: "#64748b", fontWeight: "600" }}>Loading Devotee Reviews...</p>
      </div>
    );
  }

  return (
    <>
      <div className="ReviewDetails_Section">
        <h2 className="reviewTitle">All Devotee Reviews ({reviews.length})</h2>
        <div className="reviews">
          {reviews.length > 0 ? (
            reviews.map((item) => {
              const reviewerName = item.user?.name ? (item.user.name + " " + (item.user.lastname || "")).trim() : "Devotee";
              const userAvatar = item.user?.userImage || profileimg;
              const prodTitle = item.product?.name || "Sacred Item";
              const prodImg = Array.isArray(item.product?.productImage) ? item.product.productImage[0] : (item.product?.productImage || kanhaimg);
              const formattedDate = item.created_at ? new Date(item.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "Recently";

              return (
                <div key={item.id} className="Reviewdetails_card">
                  <div className="header">
                    <img src={userAvatar} alt="avatar" className="avatar" onError={(e) => { e.target.src = profileimg; }} />
                    <div className="userInfo">
                      <p className="userName">{reviewerName}</p>
                      <p className="date">{formattedDate}</p>
                    </div>
                  </div>

                  <div className="body">
                    <img
                      src={prodImg}
                      alt="product"
                      className="productThumbnail"
                      onError={(e) => { e.target.src = kanhaimg; }}
                    />
                    <div className="textContent">
                      <p className="productName">{prodTitle}</p>

                      <div className="rating">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <FaStar
                            key={i}
                            className={"star " + (i <= (item.rating || 5) ? "filled" : "")}
                            size={14}
                          />
                        ))}
                      </div>

                      <p className="reviewText">{item.comment || item.reason || "Wonderful spiritual experience."}</p>
                      {Array.isArray(item.reviewImages) && item.reviewImages.length > 0 && (
                        <div style={{ display: "flex", gap: "8px", marginTop: "10px", flexWrap: "wrap" }}>
                          {item.reviewImages.map((imgSrc, imgIdx) => (
                            <img
                              key={imgIdx}
                              src={imgSrc}
                              alt="Review attachment"
                              style={{ width: "55px", height: "55px", objectFit: "cover", borderRadius: "6px", border: "1.5px solid #fed7aa", cursor: "pointer" }}
                              onClick={() => window.open(imgSrc, "_blank")}
                              onError={(e) => { e.target.style.display = "none"; }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
              <p>No devotee reviews yet. Be the first to share your experience!</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Productreviewdetails;
