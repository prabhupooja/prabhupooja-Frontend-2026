import React, { useState, useEffect } from "react";
import { TailSpin } from "react-loader-spinner";


function Termsandcondition() {
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
        <section style={styles.section}>
          <h1 style={styles.title}>TERMS AND CONDITIONS OF USE</h1>
          <p style={styles.text}>
            These Terms and Conditions (referred to as "Terms of Use") govern
            your use of the content and services provided by Prabu Pooja through
            our website, <span style={styles.a}>www.prabhupooja.com</span>{" "}
            (referred to as "We," " Prabhupooja," "us," "our," or” Prabhupooja
            Application” "Website").
          </p>
        </section>


        <section style={styles.section}>
          <h2 style={styles.heading}>UPDATES</h2>
          <p style={styles.text}>
            We may update, amend, or modify these Terms of Use from time to
            time. It is your responsibility to review these Terms periodically
            to ensure compliance.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>USER CONSENT</h2>
          <p style={styles.text}>
            By accessing and using our Website, you ("Member," "You," or "Your")
            agree to these Terms of Use. If you do not agree, please do not use
            the Website. Your continued use signifies acceptance of any changes
            made.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>GENERAL DESCRIPTION</h2>
          <p style={styles.text}>
            Prabu Pooja is an online platform providing astrological content and
            spiritual pooja, reports, consultations via telephone, video, and
            email ("Content"). We offer both "Free Services" and "Paid Services"
            (collectively "Services"). While Free Services are available without
            registration, personalized astrological services and additional
            Content require membership. By registering for Paid Services, you
            agree to:
          </p>
          <p style={styles.text}>
            1. Provide accurate and up-to-date information as requested by the
            Website.
          </p>
          <p style={styles.text}>
            2. Maintain the accuracy of your information by updating it as
            necessary.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>REGISTRATION AND ELIGIBILITY</h2>
          <p style={styles.text}>
            You must be at least 18 years old and legally capable of entering
            into contracts under Indian law. The Website is not responsible for
            misuse by individuals who are not of legal age. You are permitted to
            ask questions about minors in your family according to these Terms.
          </p>
          <p style={styles.text}>
            To use our services, you must register as a Member by providing
            current, accurate, and complete information. You can create an
            account using your phone number and password or through social media
            accounts (e.g., Facebook, Gmail). Use of another user’s account is
            prohibited. If your information is found to be inaccurate, the
            Website may suspend or terminate your account.
          </p>
          <p style={styles.text}>
            Your account is for personal use only and cannot be transferred. You
            are responsible for maintaining the confidentiality of your account
            information and for all activities under your account. Notify us
            immediately if you suspect unauthorized use.
          </p>
          <p style={styles.text}>
            The Website may offer services directly or through third parties,
            over which we have limited control.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>FEATURE: "CALL WITH ASTROLOGER"</h2>
          <p style={styles.text}>
            Our Website offers telecommunication services with astrologers. By
            agreeing to these Terms, you consent to receive calls from us, even
            if your number is on the Do Not Disturb list.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>FIRST FREE CHAT/CALL</h2>
          <p style={styles.text}>
            Prabu Pooja provides a free initial chat or call lasting between 3
            to 5 minutes to new users, as defined by our criteria.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>WEBSITE CONTENT</h2>
          <p style={styles.text}>
            All interactions on our Website must adhere to these Terms. You must
            not post or transmit materials that violate others’ rights or are
            unlawful, abusive, defamatory, or otherwise objectionable. The
            Website reserves the right to suspend or terminate access for users
            who do not comply.
          </p>
          <p style={styles.text}>
            The Website may modify or discontinue any aspect of its services,
            including content and features, at its discretion. The information
            provided by third parties, including astrologers, is not guaranteed
            to be accurate or medical advice.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>USER ACCOUNT ACCESS</h2>
          <p style={styles.text}>
            The Website reserves the right to access user accounts to maintain
            service quality and address complaints. Please refer to our Privacy
            Policy for details on account access.
          </p>

        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>PRIVACY POLICY</h2>
          <p style={styles.text}>
            By using our Website, you acknowledge that you have read and agree
            to our Privacy Policy, including any updates.
          </p>

        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>BREACH AND TERMINATION</h2>
          <p style={styles.text}>
            We may modify or discontinue services, or terminate user accounts
            without notice if there is a breach of these Terms or if we believe
            the user’s actions may cause legal liability. We reserve the right
            to take action against any user violating these Terms.
          </p>
        </section>


        <section style={styles.section}>
          <h2 style={styles.heading}>DELIVERY, CANCELLATION, AND REFUND</h2>
          <p style={styles.text}>
            Refunds are not available for orders once they reach the processing
            stage. If you wish to cancel an order before processing, contact
            customer care within one hour of payment. Refunds are not provided
            for technical issues, incorrect information. Refunds, if applicable,
            will be made to your Prabu Pooja wallet.
          </p>
          <p style={styles.text}>
          Refunds will be considered in cases of significant issues with
          consultations, such as network problems or language barriers, but
          not for the accuracy of the consultation itself.
        </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>USER OBLIGATIONS</h2>
          <p style={styles.text}>
            As a user (including astrologers and Member Customers) of the
            Website, you must adhere to the privacy policy, terms and
            conditions, and any additional terms specified on the Website. You
            confirm that you are an individual and not a corporate entity. The
            rights to use the Website’s services are personal to you.
          </p>
          <p style={styles.text}>
            While using the Website and engaging in communication on forums or
            with products listed on the Website, you agree not to:
          </p>
          <p style={styles.text}>
            • Post or transmit content that is false, misleading, defamatory,
            harmful, threatening, abusive, harassing, or invasive of privacy, or
            that promotes racism, hatred, or harm against individuals or groups,
            or violates intellectual property rights or applicable laws.
          </p>
          <p style={styles.text}>
            • Upload or make available content that you do not have the right to
            share under any law or contractual obligations.
          </p>
          <p style={styles.text}>
            • Post content that infringes on patents, trademarks, trade secrets,
            copyrights, or proprietary rights. You may post excerpts of
            copyrighted material if it complies with Fair Use guidelines.
          </p>
          <p style={styles.text}>
            • Collect screen names or email addresses of other members for
            unsolicited advertising or spam.
          </p>
          <p style={styles.text}>
            • Send unsolicited emails, junk mail, spam, or chain letters, or
            promotions for products or services.
          </p>
          <p style={styles.text}>
            • Upload or distribute files containing viruses, corrupted data, or
            harmful software.
          </p>
          <p style={styles.text}>
            • Engage in activities that disrupt access to the Website.
          </p>
          <p style={styles.text}>
            • Attempt unauthorized access to any part of the Website, connected
            systems, or services through hacking or other illegitimate means.
          </p>
          <p style={styles.text}>
            • Violate applicable laws or regulations, and you agree to use the
            Website only for personal purposes.
          </p>
          <p style={styles.text}>
            • Resell or commercially use the Website’s services without written
            consent from the Website.
          </p>
          <p style={styles.text}>
            • Reverse engineer, modify, copy, distribute, or sell any
            information or software obtained from the Website.
          </p>

          <p style={styles.text}>
            By becoming a Registered member, you agree to:
          </p>
          <p style={styles.text}>
            • Receive communication through the app/website via email/SMS or
            other mediums, including WhatsApp Business Messages, regarding the
            usage of the app/website.
          </p>
          <p style={styles.text}>
            • Avoid transmitting any unlawful, harassing, abusive, threatening,
            or harmful material.
          </p>
          <p style={styles.text}>
            • Not transmit material encouraging illegal conduct or that could
            result in criminal offense or civil liability.
          </p>
          <p style={styles.text}>
            • Report any misuse or abuse of the Website. False complaints may
            result in the termination of your membership without refund.
          </p>
          <p style={styles.text}>
            • The Website reserves the right to withdraw services from
            unreasonable or abusive customers and to issue warnings or bans for
            repeated violations. Any remaining wallet balance will be refunded
            subject to applicable charges.
          </p>
        </section>


        <section style={styles.section}>
          <h2 style={styles.heading}>BANK ACCOUNT INFORMATION</h2>
          <p style={styles.text}>
            You agree to provide accurate banking information when required.
            Your obligations include:
          </p>

          <p style={styles.text}>
            • Ensuring that the debit/credit card details provided are correct
            and that you are authorized to use the card.
          </p>
          <p style={styles.text}>
            • Paying fees through debit/credit card or online banking with valid
            and accurate details.
          </p>
          <p style={styles.text}>
            • Ensuring sufficient funds are available for payments.
          </p>
          <p style={styles.text}>
            • If any part of these Terms of Usage is deemed invalid or
            unenforceable, it will be replaced with a valid provision that
            closely matches the intent of the original, while the remainder of
            the Terms will continue in effect.
          </p>
        </section>


        <section style={styles.section}>
          <h2 style={styles.heading}>DISCLAIMER / LIMITATION OF LIABILITY / WARRANTY</h2>
          <p style={styles.text}>
            To the fullest extent permitted by law, the Website does not provide
            warranties for its services. Astrological counselling is based on
            the knowledge and interpretations of astrologers, which may vary.
            The Website and its affiliates do not guarantee:
          </p>
          <p style={styles.text}>
            • That the service will meet your requirements or be uninterrupted,
            secure, or error-free.
          </p>
          <p style={styles.text}>
            • The accuracy or reliability of results obtained from the service.
          </p>
          <p style={styles.text}>
            • The quality of products or services purchased through the Website.
          </p>

          <p style={styles.text}>
            The Website provides services on an "as is" basis without any
            warranties. The Website is not liable for any inaccuracies,
            unauthorized account use, or errors in the service. You are
            responsible for ensuring the accuracy and completeness of the
            information you provide. The Website is not responsible for any
            damages resulting from the use or inability to use the Website.
          </p>

          <p style={styles.text}>
            The Website’s services are for entertainment purposes only. The
            Website and its affiliates disclaim all warranties, express or
            implied, and are not responsible for the accuracy or effectiveness
            of content or services. Advisors are not employees of the Website,
            and their advice is not endorsed or guaranteed by the Website.
          </p>
        </section>


        <section style={styles.section}>
          <h2 style={styles.heading}>INDEMNIFICATION</h2>
          <p style={styles.text}>
            You agree to indemnify and hold harmless the Website and its
            affiliates from any third-party claims, liabilities, damages, or
            costs arising from your use of the services, violation of terms, or
            infringement of third-party rights.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>PROPRIETARY RIGHTS TO CONTENT</h2>
          <p style={styles.text}>
            The Content on the Website is protected by copyrights, trademarks,
            and other proprietary rights. You are not permitted to copy, use, or
            distribute this content without express authorization. The Website
            is not liable for any copyright issues related to content sourced
            from various online portals.
          </p>

        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>RESTRICTED CONTENT</h2>
          <p style={styles.text}>
            The Website prohibits content that exploits or abuses children,
            including child sexual abuse materials. Such content will result in
            immediate account deletion. We also prohibit content that appeals to
            children but contains adult themes, and content that promotes
            negative body image.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>INAPPROPRIATE CONTENT</h2>
          <p style={styles.text}>
            The Website prohibits content that is sexual, profane, promotes
            violence, hate speech, or is insensitive to sensitive events.
            Content involving terrorism, dangerous organizations, or harmful
            products is also prohibited.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>ASTROLOGY SERVICES</h2>
          <p style={styles.text}>
            The Website provides astrological services, including content,
            reports, readings, and products, but does not guarantee their
            effectiveness or reliability. The advisors are not employees of the
            Website and their advice is not endorsed or guaranteed by the
            Website.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>ERRORS, CORRECTIONS, AND SERVICE CHANGES</h2>
          <p style={styles.text}>
            The Website does not guarantee error-free operation or the accuracy
            of information. It reserves the right to modify or discontinue
            services or sites without notice and is not liable for any related
            issues.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>GOVERNING LAW AND JURISDICTION</h2>
          <p style={styles.text}>
            Disputes arising from these Terms will be resolved through
            arbitration in Indore, India. The laws of India will govern these
            Terms. Both parties agree to submit to the exclusive jurisdiction of
            Indore courts for interim relief.
          </p>
        </section>

      </div>
    </div>

  );
}
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

export default Termsandcondition;
