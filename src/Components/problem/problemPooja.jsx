import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "./problemPooja.css";
import { TailSpin } from "react-loader-spinner";
import useAuthStore from "../../Store/UserStore/userAuthStore";
import useProblemPoojaStore from "../../Store/ProblemPoojaStore/ProblemPoojaStore";
import CryptoJS from "crypto-js";
import Swal from "sweetalert2";

const ProblemPooja = () => {
  const { problem } = useParams();
  const navigate = useNavigate();
  const [error] = useState(null);
  const { user1 } = useAuthStore();
  const { getProblemPoojas, ProblemPoojas, loading } = useProblemPoojaStore();

  const encryptId = (ID) => {
    const encrypted = CryptoJS.AES.encrypt(
      ID.toString(),
      "prabhupooja2024"
    ).toString();
    return encodeURIComponent(encrypted);
  };

  useEffect(() => {
    const fetchProblemPoojas = async () => {
      await getProblemPoojas(problem);
    };
    fetchProblemPoojas();
  }, [problem]);

  // console.log(ProblemPoojas,"fsfsfs")

  const handleImageClick = (id) => {
    const encryptedId = encryptId(id);
    navigate(`/problemDetail/${encryptedId}`, {
      state: { problem_name: problem },
    });
  };

  const handleSubmit = async (id) => {
    if (!user1) {
      // navigate("/login");
      Swal.fire({
        title: "Login Required",
        text: "Please log in to continue.",
        icon: "info",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Login Now",
      });
      
    } else {
      const encryptedId = encryptId(id);
      navigate(`/problemDetail/${encryptedId}`, {
        state: { problem_name: problem },
      });
    }
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

  return (
    <>
      <div className="sub_header_problem">
        <div className="container">
          <div className="subheader_inner_problem">
            <div className="subheader_text_problem">
              <h1>Pooja</h1>
            </div>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link className="btn-link" to="/">
                    Home
                  </Link>
                </li>

                <li className="breadcrumb-item active">Pooja</li>
              </ol>
            </nav>
          </div>
        </div>
      </div>

      <div className="pooja-category-container">
        {/* <h1 className="pooja-category-title">Pooja Category</h1> */}
        <div className="pooja-category-content"  >
          {loading ? (
            <p className="loading">Loading...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : ProblemPoojas ? (
            <div className="problem-cart-container">
              {ProblemPoojas.map((item) => (
                <div className="cart-item" key={item.id} onClick={() => handleImageClick(item.id)}>
                  <div
                    className="cart-item-image"
                    onClick={() => handleImageClick(item.id)}
                  >
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="cart-item-details">
                    <h3
                      className="cart-item-title"
                      onClick={() => handleImageClick(item.id)}
                    >
                      {item.name}
                    </h3>
                    <p>
                      <strong>Temple Name:</strong> {item.temple_name}
                    </p>
                    <p className="cart-item-price">
                      <strong>Price:</strong> 999₹ upto 3499₹
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      handleSubmit(item.id);
                    }}
                    className="book-now-btn"
                  >
                    Book Now
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-details-message">
              No details found for this problem.
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default ProblemPooja;
