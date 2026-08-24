import React, { useState, useEffect } from "react";
import { TailSpin } from "react-loader-spinner";
import "../styles/refundpolicy.css";

function Refundpolicy() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div style={styles.loaderContainer}>
        <TailSpin height="50" width="50" color="orange" />
        <p style={styles.loadingText}>Loading...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 className="title_refund">Cancellation, Returns & Replacement Policy</h1>

        {/* Return & Replacement Policy Section */}
        <section style={styles.section}>
          <h2 style={styles.heading}>10 Days Return & Replacement Policy</h2>
          <p style={styles.text}>
            PrabhuPooja (prabhupooja.com) offers a very transparent and simple
            no-questions-asked 10 Days Return & Replacement policy for
            Prabhupooja-related items.
          </p>
          <h3 style={styles.subheading}>Conditions To Be Eligible:</h3>
          <ul style={styles.ul}>
            <li>
              Prabhupooja item(s) must be in their original, unused condition.
            </li>
            <li>Replacement is subject to inspection by our team.</li>
            <li>Damages due to neglect will not be covered.</li>
            <li>Return must include original certificates and invoices.</li>
            <li>No modifications should be made to the product.</li>
          </ul>
          <p style={styles.note}>
            Note: Shipping charges, VAT, and lab certification charges are not
            refundable.
          </p>
        </section>

        {/* Cancellation Policy Section */}
        <section style={styles.section}>
          <h2 style={styles.heading}>Cancellation Policy</h2>
          <ul style={styles.ul}>
            <li>Request cancellation before the product is shipped.</li>
            <li>Making charges may be deducted for jewelry orders.</li>
            <li>
              Customized items may have deductions based on production stage.
            </li>
            <li>Refunds are processed within 4-5 working days.</li>
            <li>
              Shipping charges are deducted if items are already in transit.
            </li>
          </ul>
          <p style={styles.note}>
            Note: Refunds will be processed back to the original payment method.
          </p>
        </section>

        <section style={styles.section}>
          <h1 style={styles.heading}>
            How To Send The Return Prabhupooja Items?
          </h1>
          <p style={styles.text}>
            It is highly recommended to allow Prabhu Pooja to manage and arrange
            for the reverse courier. If you choose to send the parcel yourself
            and it gets stolen/misplaced/lost in transit, Prabhupooja will not
            be held liable.
          </p>
          <p style={styles.text}>Return charges will be borne by you.</p>

          <h2 style={styles.heading}>
            Instructions For Domestic Returns (Within India Only):
          </h2>
          <ul style={styles.ul}>
            <li>Pack items securely in a box and, if possible, add padding.</li>
            <li>Send to:</li>
            <address style={styles.address}>
              Prabhu Pooja
              <br />
              203, Mangal City Mall,
              <br />
              Near by Vijay Nagar Square,
              <br />
              Indore, Madhya Pradesh 452010
              <br />
              Telephone: +91 7225016699
            </address>
            <li>
              Use a trusted courier service (best practice is to allow reverse
              pickup).
            </li>
            <li>Declare as: "Gift item. No commercial purpose or value." </li>
          </ul>
        </section>
        {/* FAQs Section */}
        <section style={styles.section}>
          <h2 style={styles.heading}>Frequently Asked Questions</h2>
          <h3 style={styles.subheading}>
            1. When does the 10-Day Return Period Start?
          </h3>
          <p style={styles.text}>
            The 10-day period starts from the day you receive your product.
          </p>
          <h3 style={styles.subheading}>
            2. Can I return only specific items?
          </h3>
          <p style={styles.text}>
            Yes, you can request a refund for only specific items.
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
  loaderContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
  loadingText: {
    fontSize: "1.2rem",
    color: "#555",
    marginTop: "10px",
  },
};

export default Refundpolicy;
