import React, { useState, useEffect } from "react";
import { TailSpin } from "react-loader-spinner";

function ShippingPolicy() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

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
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Shipping Policy</h1>

        <section style={styles.section}>
          <h2 style={styles.subTitle}>Domestic Shipping</h2>
          <p style={styles.text}>
            We use <strong>Blue Dart</strong> and <strong>Speed Post</strong> for
            deliveries in India.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subTitle}>International Shipping</h2>
          <p style={styles.text}>
            We rely on <strong>FEDEX</strong>, <strong>DHL</strong>, and{" "}
            <strong>Speed Post</strong> for international deliveries.
          </p>
          <p style={styles.text}>
            Our courier partners provide live tracking, dedicated support,
            door-to-door delivery, and proof of delivery. We guarantee fast and
            secure shipping. In case of lost parcels, we offer replacements or
            refunds.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subTitle}>Packaging & Transit Damage</h2>
          <p style={styles.text}>
            Our secure packaging minimizes transit damage. If you receive a
            damaged parcel, report it immediately with photos at{" "}
            <a href="mailto:enquiry@prabhupooja.com" style={styles.link}>
              enquiry@prabhupooja.com
            </a>{" "}
            for a replacement.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subTitle}>Additional Information</h2>
          <ul style={styles.list}>
            <li style={styles.listItem}>COD is available for domestic orders.</li>
            <li style={styles.listItem}>
              Free shipping on orders above <strong>INR 500</strong>.
            </li>
            <li style={styles.listItem}>
              Shipping charges depend on weight and dimensions.
            </li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subTitle}>Shipping Time</h2>
          <h3 style={styles.smallTitle}>Domestic Orders</h3>
          <p style={styles.text}>
            Blue Dart delivers in <strong>1-2 days</strong>, while Speed Post
            takes up to <strong>5 days</strong>.
          </p>

          <h3 style={styles.smallTitle}>International Orders</h3>
          <p style={styles.text}>
            FEDEX and DHL deliver in <strong>2-4 days</strong>. Speed Post may
            take <strong>7-14 days</strong>. Customs delays may occur.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subTitle}>Custom Duties</h2>
          <p style={styles.text}>
            Custom duties, if applicable, are borne by the recipient. Contact us
            at{" "}
            <a href="mailto:enquiry@prabhupooja.com" style={styles.link}>
              enquiry@prabhupooja.com
            </a>{" "}
            for assistance.
          </p>
        </section>
      </div>

    </div>
  );
}

const styles = {

  container: {
    backgroundColor: "#f4f4f9",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },
  card: {
    backgroundColor: "#fff",
    maxWidth: "800px",
    padding: "30px",
    borderRadius: "8px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    lineHeight: "1.8",
    fontFamily: "Arial, sans-serif",
    marginBottom: "40px",
  },
  title: {
    fontSize: "2rem",
    color: "#333",
    marginBottom: "20px",
    textAlign: "center",
  },
  section: {
    marginBottom: "30px",
    paddingBottom: "20px",
    borderBottom: "1px solid #ddd",
  },
  heading: {
    fontSize: "1.5rem",
    color: "#000",
    fontWeight: "bold",
  },
  subheading: {
    fontSize: "1.2rem",
    color: "#000",
    margin: "10px 0",
  },
  text: {
    fontSize: "1rem",
    color: "#555",
    textAlign: "justify",
  },
  note: {
    fontWeight: "bold",
    color: "#d9534f",
    marginTop: "10px",
  },
  ul: {
    marginLeft: "20px",
    listStyleType: "disc",
  },
};

export default ShippingPolicy;
