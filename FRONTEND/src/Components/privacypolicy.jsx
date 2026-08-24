import React, { useState, useEffect } from "react";
import { TailSpin } from "react-loader-spinner";


function Privacypolicy() {
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
    <>
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.title}>
            <h1>Privacy Policy</h1>
            <div style={styles.section}>
              <p style={styles.text}>
                At Prabhupooja.com, we prioritize the privacy of users accessing
                our platform through{" "}
                <span style={styles.a}>
                  <a style={styles.a}
                    href="https://www.prabhupooja.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    www.prabhupooja.com
                  </a>
                </span>{" "}
                ("Prabhu Pooja" for web and app). Whether you are a registered
                user, a buyer, or an astrologer, your privacy is important to us.
                Please review our Privacy Policy carefully to understand how we
                collect, use, store, and protect the information you provide.

              </p>
              <p style={styles.text}>
                This Privacy Policy complies with the Information Technology
                (Intermediaries Guidelines) Rules, 2011, and the Information
                Technology (Reasonable Security Practices and Procedures and
                Sensitive Personal Data or Information) Rules, 2011. It governs
                the collection, usage, storage, and transfer of sensitive personal
                data or information.
              </p>
            </div>

            <section style={styles.section}>
              <h2 style={styles.heading}>User Consent</h2>

              <p style={styles.text}>
                By using our website, you agree to the terms outlined in this
                Privacy Policy, which may be updated periodically. If you do not
                agree with any of these terms, please refrain from using the
                website. Continued use of the site signifies your unconditional
                consent to the collection, maintenance, and use of your personal
                and other information as described here in
              </p>

              <p style={styles.text}>
                Please review this policy alongside the Terms of Use and other
                terms and conditions provided on the website.
              </p>
            </section>

            <section style={styles.section}>
              <h2 style={styles.heading}>Collection of Personal Information</h2>
              <p style={styles.text}>
                When creating a user profile on Prabhu Pooja, specific information
                is required, such as your phone number for OTP verification. This
                ensures the security and validity of your registration.
                Additionally, you may be asked to provide your first and last name
                and email id; however, these details are optional. If you choose
                not to share your email id, it won’t affect your ability to access
                Prabhu Pooja services.
              </p>
            </section>

            <section style={styles.section}>
              <h2 style={styles.heading}>Purpose and Use of Collected Information</h2>
              <p style={styles.text}>
                The information collected helps us create a personalized user
                experience tailored to your needs. For instance, while email id is
                optional, it can help provide more accurate astrological readings.
                Nevertheless, registration can be completed and services accessed
                with only a verified phone number.
              </p>
            </section>

            <section style={styles.section}>
              <h2 style={styles.heading}>Data Deletion</h2>
              <p style={styles.text}>
                If you decide to delete your Prabhu Pooja profile, including all
                personal information associated with it, you can do so through the
                contact us on our “What’s app”. Follow the on-screen instructions
                to complete the account deletion process.
              </p>

            </section>



            <section style={styles.section}>
              <h2 style={styles.heading}>
                Voice Recording and Microphone Permission and Video Permission
              </h2>
              <p style={styles.text}>
                Prabhu Pooja offers an audio and video interaction feature,
                allowing users to ask questions by recording their voice. This
                feature requires microphone and camera access, which users must
                grant. By doing so, the app can capture and process voice queries,
                offering a more natural and intuitive way to communicate.
              </p>
            </section>

            <section style={styles.section}>
              <h2 style={styles.heading}>Our Commitment to Privacy</h2>
              <p style={styles.text}>
                We strive to protect the privacy of all users, whether registered
                or visitors. Any personal data provided by users will only be used
                for generating astrological predictions and will not be shared for
                any other purposes, except when communicating predictions directly
                to the user. Prabhu Pooja does not sell or rent user information
                to third parties.
              </p>
            </section>

            <section style={styles.section}>
              <h2 style={styles.heading}>Mental Health Disclaimer</h2>
              <p style={styles.text}>
                Prabhu Pooja does not offer support or advice for users
                experiencing mental health crises, including thoughts of self-harm
                or suicide. If you are facing such challenges, we advise
                discontinuing the use of the website immediately and seeking help.
                If necessary, we may share information with law enforcement. This
                type of information is not protected by confidentiality or
                non-disclosure agreements.
              </p>
            </section>

            <section style={styles.section}>
              <h2 style={styles.heading}>Accuracy of Predictions</h2>
              <p style={styles.text}>
                Prabhu Pooja does not guarantee the accuracy or reliability of the
                predictions made by astrologers or the quality of gems or other
                products sold on the website. No warranties are offered on these
                services.
              </p>

            </section>
            <section style={styles.section}>
              <h2 style={styles.heading}>Information Collected by the Website</h2>
              <p style={styles.text}>
                <span style={styles.text}>
                  Personal Identifiable Information (PII):
                </span>{" "}
                During account creation or registration, Prabhu Pooja may collect
                personal information such as your full name, address, telephone
                number, email address, DOB, gender, location, and photograph. This
                information is used to secure user profiles and facilitate
                personalized services such as email and SMS notifications.
              </p>
              <p style={styles.text}>
                <span style={styles.text}>
                  Non-Personal Identifiable Information (NPII):{" "}
                </span>{" "}
                This may include browser type, IP address, geographic location,
                and other technical data collected when you visit the website.
                This information is used to analysed trends, troubleshoot issues,
                and improve user experience.
              </p>
            </section>

            <section style={styles.section}>
              <h2 style={styles.heading}>Security Measures</h2>
              <p style={styles.text}>
                Prabhu Pooja employs robust security measures to protect user
                information, including encrypted SSL communication for payment
                details. However, no data transmission over the internet is
                completely secure, so users are encouraged to protect their
                account details. Prabhu Pooja cannot be held responsible for
                unauthorized access to user information.
              </p>
            </section>

            <section style={styles.section}>
              <h2 style={styles.heading}>Usage of Information</h2>
              <p style={styles.text}>
                Collected information may be used to enhance the user experience,
                facilitate personalized content, monitor traffic trends, and
                improve services. We also use third-party analytics tools for
                non-personalized data analysis.
              </p>
            </section>

            <section style={styles.section}>
              <h2 style={styles.heading}>Confidentiality and Disclosure</h2>
              <p style={styles.text}>
                Prabhu Pooja strives to maintain confidentiality. However, we may
                disclose user information under specific circumstances, such as
                legal requirements, threats to user safety, or to protect our
                rights and property.
              </p>
            </section>

            <section style={styles.section}>
              <h2 style={styles.heading}>Children's Privacy</h2>
              <p style={styles.text}>
                Prabhu Pooja is not intended for use by children under 13, and we
                do not knowingly collect personal information from them. If we
                discover such information has been provided, we will delete it.
              </p>
            </section>

            <section style={styles.section}>
              <h2 style={styles.heading}>Safety and Security</h2>
              <p style={styles.text}>
                We are committed to safeguarding user privacy and securing
                sensitive data such as birth details and financial information.
                All transactions on Astrotalk.com are protected with encryption to
                ensure safe and secure use.
              </p>
            </section>

            <section style={styles.section}>
              <h2 style={styles.heading}>Disclaimer</h2>
              <p style={styles.text}>
                Prabhu Pooja is not responsible for interactions between users and
                third-party websites, even if a link to the third-party site was
                provided by Prabhu Pooja. Users are advised to review third-party
                privacy policies independently.
              </p>
            </section>

            <section style={styles.section}>
              <h2 style={styles.heading}>Grievance Officer</h2>
              <p style={styles.text}>
                If you have concerns or grievances, please contact:
              </p>

              <h2 style={styles.subheading}>
                • Contact No:
                <span style={styles.text}>
                  <a style={styles.a} href="tel:+917225016699">+91 7225016699</a>
                </span>
              </h2>
              <h2 style={styles.subheading}>
                • Email:
                <a  href="mailto:enquiry@prabhupooja.com">
                  <span style={styles.a}> enquiry@prabhupooja.com</span>
                </a>
              </h2>

              <p style={styles.text}>
                This officer is appointed in accordance with the Information
                Technology Act 2000 and can address complaints or breaches of our
                Privacy Policy, Terms of Use, or other policies.
              </p>
            </section>

          </div>
        </div>
      </div>
    </>
  );
}
const styles = {
  a: {
    color: "blue",
    textDecoration: "underline",
    marginLeft:'10px'
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


export default Privacypolicy;
