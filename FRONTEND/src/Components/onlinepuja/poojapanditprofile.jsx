import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../Axios/api";
import CryptoJS from "crypto-js";

function Poojapanditprofile({ selectedPanditId, onSelectPandit, initialPandits }) {
  const [pandits, setPandits] = useState(initialPandits || []);
  const [loading, setLoading] = useState(!initialPandits || initialPandits.length === 0);
  const [error, setError] = useState(null);
  const { id } = useParams();

  const decryptId = (encryptedIdFromUrl) => {
    if (!encryptedIdFromUrl) return "";
    try {
      const decodedId = decodeURIComponent(encryptedIdFromUrl);
      const bytes = CryptoJS.AES.decrypt(decodedId, "prabhupooja2024");
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      if (decrypted && decrypted.trim().length > 0) {
        return decrypted;
      }
    } catch (e) {}
    return decodeURIComponent(encryptedIdFromUrl);
  };

  useEffect(() => {
    if (initialPandits && initialPandits.length > 0) {
      setPandits(initialPandits);
      setLoading(false);
      return;
    }

    const fetchPanditDetails = async () => {
      try {
        const decrypted = decryptId(id);
        if (!decrypted) return;
        const response = await api.get(`/user/onlinePuja/${decrypted}/pandits`);
        if (response.data?.success && Array.isArray(response.data.data)) {
          setPandits(response.data.data);
          if (onSelectPandit && !selectedPanditId && response.data.data.length > 0) {
            onSelectPandit(response.data.data[0].id);
          }
        }
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch Pandits:", err);
        setError("Failed to fetch Pandit details");
        setLoading(false);
      }
    };

    fetchPanditDetails();
  }, [id, initialPandits]);

  if (loading) {
    return <p className="loading_text">Loading Pandit details...</p>;
  }

  if (error && pandits.length === 0) {
    return <p className="text-muted">{error}</p>;
  }

  if (!pandits || pandits.length === 0) {
    return (
      <div className="next_section">
        <h2>About Our Vedic Pandits</h2>
        <div className="next_details">
          <p>
            Chinta na karein! Prabhu Pooja par aapko milte hain hamare anubhavshali, certified aur
            shraddhalu Pandit, jo har pooja ko vedic vidhi, niyam aur shuddhta ke saath sampann karte hain.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="next_section">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <h2>Assigned Vedic Pandits</h2>
        <span style={{ fontSize: "12px", background: "#ffedd5", color: "#9a3412", padding: "2px 8px", borderRadius: "12px", fontWeight: "700" }}>
          {pandits.length} Available
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {pandits.map((pandit) => {
          const isSelected = selectedPanditId === pandit.id;
          return (
            <div
              key={pandit.id}
              onClick={() => onSelectPandit && onSelectPandit(pandit.id)}
              style={{
                border: isSelected ? "2px solid #ea580c" : "1px solid #e2e8f0",
                backgroundColor: isSelected ? "#fff7ed" : "#ffffff",
                borderRadius: "12px",
                padding: "12px",
                cursor: onSelectPandit ? "pointer" : "default",
                transition: "all 0.2s ease",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <img
                  src={pandit.profileImage || pandit.image || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                  alt={pandit.name}
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid #fdba74",
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: "700", fontSize: "15px", color: "#1e293b" }}>
                      {pandit.name} {pandit.lastname || ""}
                    </span>
                    <span style={{ fontSize: "10px", background: "#dcfce7", color: "#166534", fontWeight: "700", padding: "2px 6px", borderRadius: "8px" }}>
                      ✓ Verified
                    </span>
                  </div>
                  <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>
                    {pandit.experience ? `${pandit.experience} Yrs Exp` : "10+ Yrs Exp"} • Gotra: {pandit.gotra || "Vedic"}
                  </div>
                  <div style={{ fontSize: "12px", fontWeight: "600", color: "#c2410c", marginTop: "2px" }}>
                    {pandit.skills || "Vedic Chanting & Anushthan"}
                  </div>
                </div>
              </div>

              {isSelected && (
                <div style={{ marginTop: "8px", textAlign: "right" }}>
                  <span style={{ fontSize: "11px", fontWeight: "700", color: "#ea580c", background: "#ffedd5", padding: "2px 8px", borderRadius: "6px" }}>
                    ● Selected Preferred Pandit
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Poojapanditprofile;
