import React from "react";
import "../../styles/productreviewdetails.css";
import { FaStar } from "react-icons/fa";

import profileimg from "../Assets/profile-img.png";
import kanhaimg from "../Assets/kanha-img.jpeg";

function Productreviewdetails() {
  const reviews = [
    {
      id: 1,
      reviewer: "Kiran malviya",
      date: "April 10, 2025",
      product: "Shri Krishna Murti - Brass Idol 12 inch",
      review:
        "Bahut hi sundar murti hai. Kanha ji ka mukh dekh kar mann prasann ho gaya.",
      rating: 5,
    },
    {
      id: 2,
      reviewer: "Amisha Sharma",
      date: "April 8, 2025",
      product: "Kanha Murti - Marble Look",
      review: "Design aur detailing lajawab hai. Har din darshan karti hoon.",
      rating: 4,
    },
    {
      id: 3,
      reviewer: "rishikesh kalme",
      date: "April 6, 2025",
      product: "Krishna Idol with Flute",
      review: "Murti ka size perfect hai ghar ke mandir ke liye.",
      rating: 5,
    },
    {
      id: 4,
      reviewer: "Nikhil Bopche",
      date: "April 6, 2025",
      product: "Krishna Idol with Flute",
      review: "Murti ka size perfect hai ghar ke mandir ke liye.",
      rating: 5,
    },
  ];

  return (
    <>
      <div className="ReviewDetails_Section">
        <h2 className="reviewTitle">All Reviews</h2>
        <div className="reviews">
          {reviews.map((item) => (
            <div key={item.id} className="Reviewdetails_card">
              <div className="header">
                <img src={profileimg} alt="avatar" className="avatar" />
                <div className="userInfo">
                  <p className="userName">{item.reviewer}</p>
                  <p className="date">{item.date}</p>
                </div>
              </div>

              <div className="body">
                <img
                  src={kanhaimg}
                  alt="product"
                  className="productThumbnail"
                />
                <div className="textContent">
                  <p className="productName">{item.product}</p>

                  <div className="rating">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <FaStar
                        key={i}
                        className={`star ${i <= item.rating ? "filled" : ""}`}
                        size={14}
                      />
                    ))}
                  </div>

                  <p className="reviewText">{item.review}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Productreviewdetails;
