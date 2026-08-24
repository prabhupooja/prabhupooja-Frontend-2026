import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/muhurat.css";
import CryptoJS from "crypto-js";

import { TailSpin } from "react-loader-spinner";
import useMuhuratStore from "../../Store/MuhuratStore/MuhuratStore";
import NewLoader from "../NewLoader/NewLoader";

const Muhurat = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { muhuratGet, muhurat } = useMuhuratStore();

  useEffect(() => {
    const fetchMuhurats = async () => {
      try {
        await muhuratGet();
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch muhurat data");
        setLoading(false);
      }
    };
    fetchMuhurats();
  }, []);

  if (loading) {
    return (
      <>
        <div>
          <NewLoader />
        </div>
        <p className="loading_text">Loading...</p>
      </>
    );
  }

  if (error) {
    return <p>{error}</p>;
  }

  const encryptId = (ID) => {
    const encrypted = CryptoJS.AES.encrypt(
      ID.toString(),
      "prabhupooja2024"
    ).toString();
    return encodeURIComponent(encrypted);
  };

  return (
    <>
      <div className="sub_header_muhurat">
        <div className="container">
          <div className="subheader_inner_muhurat">
            <div className="subheader_text_muhurat">
              <h1>Muhurat</h1>
            </div>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link className="btn-link" to="/">
                    Home
                  </Link>
                </li>
                <li className="breadcrumb-item active">Muhurat</li>
              </ol>
            </nav>
          </div>
        </div>
      </div>

      <div className="muhurat-list">
        <div className="container">
          <div className="row">
            {muhurat.map((muhur, index) => {
              const encryptedId = encryptId(muhur.id);
              return (
                <div key={index} className="col-md-4 col-lg-3">
                  <div className="muhurat-img-box">
                    <Link to={`/panditmuhuratprofile/${encryptedId}`}>
                      <img src={muhur.image} alt={muhur.name} />
                      <p>{muhur.name}</p>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Muhurat;
