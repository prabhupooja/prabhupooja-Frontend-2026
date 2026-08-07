import React, { useState, useEffect } from "react";
import { TailSpin } from "react-loader-spinner";
import NewLoader from "./NewLoader/NewLoader";

function Disclaimer() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <>
        <div>
          <NewLoader />
        </div>
      </>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Disclaimer</h1>
        <p style={styles.text}>
          The products and services offered on this website, including but not
          limited to rudraksha, gems, yantra, parad, puja items, and puja
          services, are provided for spiritual and religious purposes. It is
          important to note that these products and services are based on faith
          and spiritual beliefs and are not medically or legally certified.
        </p>
        <p style={styles.text}>
          While these items and services have been revered in traditional
          practices and scriptures for their perceived spiritual benefits, their
          efficacy is subjective and may vary from person to person.
        </p>
        <p style={styles.text}>
          Any claims or guidance concerning health, well-being, or legal
          ramifications associated with the utilization of our products or
          services, as articulated by our team members, affiliates, or
          subsidiaries, are founded upon traditional beliefs and do not derive
          support from scientific evidence, medical studies, or legal
          certifications. It is imperative to recognize that such assertions
          should not be construed as a substitute for professional medical
          treatment.
        </p>
        <p style={styles.text}>
          Furthermore, the information provided on this website is for
          educational and informational purposes only and should not be
          considered as a substitute for professional medical advice, diagnosis,
          or treatment. We recommend consulting with a qualified healthcare
          professional before using any of our products, especially if you have
          any medical conditions or concerns.
        </p>
        <p style={styles.text}>
          Additionally, the use of our products and services does not guarantee
          any specific results or outcomes. We do not make any warranties or
          representations regarding the effectiveness, accuracy, or reliability
          of our products or services for any particular purpose.
        </p>
        <p style={styles.text}>
          By purchasing and using our products or services, you acknowledge and
          agree that you are doing so at your own risk and discretion. We shall
          not be liable for any direct, indirect, incidental, consequential, or
          punitive damages arising from the use or misuse of our products or
          services.
        </p>
        <p style={styles.text}>
          We reserve the right to make changes to the information, products, and
          services provided on this website without prior notice.
        </p>
        <p style={styles.text}>Thank you for your understanding.</p>
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
  text: {
    fontSize: "1rem",
    color: "#555",
    marginBottom: "15px",
    textAlign: "justify",
  },
};

export default Disclaimer;
