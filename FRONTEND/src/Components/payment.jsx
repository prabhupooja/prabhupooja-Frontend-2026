import React,{useState,useEffect} from "react";
import { TailSpin } from "react-loader-spinner";

const PaymentPolicy = () => {
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
        <h1 style={styles.title}>Payment Policy</h1>

        <div style={styles.section}>
          <h2 style={styles.heading}>All Transactions Are Secure</h2>
          <p style={styles.text}>
            All our transactions are safe, secure, and fraud-proof. We do not save your card details anywhere on the website. These details are entered on the interface of our payment gateway after checkout, which is 100% safe and secure and follows international regulations for transactions.
          </p>
        </div>

        <div style={styles.section}>
          <h2 style={styles.heading}>Accepted Payment Methods</h2>
          <ul style={styles.ul}>
            <li style={styles.text}>Credit Cards: Visa, MasterCard, and American Express</li>
            <li style={styles.text}>Debit Cards (India): Visa and Maestro</li>
            <li style={styles.text}>Net Banking</li>
            <li style={styles.text}>Bank Transfer</li>
            <li style={styles.text}>UPI</li>
          </ul>
        </div>

        <div style={styles.section}>
          <h2 style={styles.heading}>Credit/Debit Cards</h2>
          <p style={styles.text}>
            We accept credit & debit card payments via our trusted and secure payment gateway, Razorpay.
          </p>
          <p style={styles.text}>
            You can also send the payment to our official email ID: <strong>prabhupooja@prabhupooja.com</strong>. After making the payment, share a screenshot of the receipt and the links/screenshots of the items you require at <strong>enquiry@prabhupooja.com</strong>.
          </p>
        </div>
        <div style={styles.section}>
          <h3 style={styles.subheading}>Credit/Debit Cards:</h3>
          <p style={styles.text}>For Credit & Debit Cards, one can pay via any one of our trusted and secure payment gateways:</p>
          <h3 style={styles.subheading}>Razorpay</h3>
          <p style={styles.text}>You can send the payment to our official email ID: prabhupooja@prabhupooja.com. After making the payment, share a screenshot of the receipt and the links/screenshots of the items you require at enquiry@prabhupooja.com.</p>
          <h3 style={styles.subheading}>Net Banking</h3>
          <p style={styles.text}>We support Net Banking through our payment gateways like Razorpay.</p>
          <h3 style={styles.subheading}>UPI</h3>
          <p style={styles.text}>We support UPI payments through our payment gateways like Razorpay for Indian Cards.</p>
        </div>

        <div style={styles.section}>
          <h2 style={styles.heading}>Bank Transfer/Wire Transfer</h2>
          <div className="bank">
 <h3 style={styles.subheading}>Bank Details</h3>
 <p style={styles.text}>Bank Name: HDFC Bank</p>
            <p style={styles.text}>Account Name: Prabhu Pooja</p>
            <p style={styles.text}>Account Number: 50200095195819</p>
            <p style={styles.text}>IFSC Code: HDFC0003812</p>
            <p style={styles.text}>Branch: Indore, Madhya Pradesh, India</p>
            {/* <p style={styles.text}>UPI ID: prabhupooja@hdfc</p> */}
          </div>
         
          <p style={styles.text}>See our <a style={styles.a} href="/refund&cancle">Return & Refund Policy</a> for more details.

          </p>
        </div>
      </div>
    </div>
  );
};
const styles = {
  a: {
    color: "blue",
    textDecoration: "underline",
  },
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

export default PaymentPolicy;
