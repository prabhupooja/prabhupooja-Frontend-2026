import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../Axios/api";
import CryptoJS from "crypto-js";

function Poojapanditprofile() {
  const [pandit, setPandit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  const decryptId = (encryptedIdFromUrl) => {
    const decodedId = decodeURIComponent(encryptedIdFromUrl);
    const bytes = CryptoJS.AES.decrypt(decodedId, "prabhupooja2024");
    return bytes.toString(CryptoJS.enc.Utf8);
  };
  
  useEffect(() => {
    const fetchPanditDetails = async () => {
      try {
        // console.log(id, "sdjfkd");
        const response = await api.get(
          `/user/onlinePuja/${decryptId(id)}/pandits`
        );
        // console.log(response.data, "data");
        setPandit(response.data.data[0]);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch Pandit details");
        setLoading(false);
      }
    };

    fetchPanditDetails();
  }, [id]);

  if (loading) {
    return <p className="loading_text">Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!pandit) {
    return <p>Chinta na karein! Prabhu Pooja par aapko milte hain hamare anubhavshali, certified aur shraddhalu Pandit, jo har pooja ko vedic vidhi, niyam aur shuddhta ke saath sampann karte hain. Chahe grih pravesh ho, vivaah, rudrabhishek ya kisi bhi vishesh anushthan ki baat ho — hamare Pandit aapki aastha ka poora sammaan rakhte hain. Vishwas kijiye, Prabhu Pooja par har pooja ek pavitra anubhav banti hai.</p>;
  }

  return (
    <div className="details_content">
      <div className="pandit_profile">
        <div className="profile_pic">
          <img src={pandit.profileImage} alt="" />
        </div>
        <div className="profile_details">
          <span className="profile_name">{pandit.name}</span>
          <span className="profile_skill">{pandit.skills}</span>
        </div>
      </div>

      <p className="profile_bio">
        “{pandit.name}” is a vedic expert with {pandit.experience} years of
        experience who specializes in relationship problems and adivses 100%
        sucessful remedies.
      </p>
    </div>
  );
}

export default Poojapanditprofile;
