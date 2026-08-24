import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../../styles/yoga.css";
import { useNavigate } from "react-router-dom";


// import yogaimg from "../Assets/yogaimg1.jpg";
import yoga1 from "../Assets/yoga1.jpeg";
import yoga2 from "../Assets/yoga11.jpeg";
import yoga3 from "../Assets/yoga13.jpg";
import yoga4 from "../Assets/yoga6.jpeg";
import yoga5 from "../Assets/yoga5.jpeg";
import yoga6 from "../Assets/yoga10.jpeg";
import yoga7 from "../Assets/yoga12.jpeg";
import yoga8 from "../Assets/yoga2.jpeg";
import api from "../Axios/api";
import useAuthStore from "../../Store/UserStore/userAuthStore";
import Swal from "sweetalert2";
import NewLoader from "../NewLoader/NewLoader";

const Yoga = () => {
  const { user1 } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const handlePayment = async (price) => {
    if (!user1) {
      Swal.fire({
        icon: "warning",
        title: "Not Logged In",
        text: "Please log in to book the yoga.",
        confirmButtonText: "Go to Login",
      });
      return;
    }

    try {
      const order = await api.post(
        "/payment/create-payment",
        {
          amount: price,
          currency: "INR",
          user_id: user1.id,
          puja: "Yoga",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const razorpayKey = order.data?.key_id || order.data?.data?.key_id || process.env.REACT_APP_RAZORPAY_KEY_ID || "rzp_test_J3QKwQbU1OGf1Y";

      const options = {
        key: razorpayKey,
        amount: order.data.data.amount,
        currency: "INR",
        name: user1?.name || "Devotee",
        description: "Yoga Session Booking",
        order_id: order.data.data.id,
        handler: async function (response) {
          try {
            const verifyResponse = await api.post(
              "/payment/verify-payment",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            // console.log("Verification API Response:", verifyResponse.data);

            // Show success Swal alert
            Swal.fire({
              title: "Payment Successful",
              text: verifyResponse.data.message,
              icon: "success",
              confirmButtonText: "OK",
            }).then(() => {
              navigate("/yogabookingpage");
              window.location.reload();
            });
          } catch (error) {
            console.error("Verification failed:", error);
          }
        },
        prefill: {
          email: user1.email,
          contact: user1.mobile,
        },
        theme: {
          color: "#3399cc",
        },
        method: {
          upi: true,
          qr: true,
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();

      rzp1.on("payment.failed", function (response) {
        // Show error Swal alert
        Swal.fire({
          title: "Payment Failed",
          text: `${response.error.code} | ${response.error.description}`,
          icon: "error",
          confirmButtonText: "Try Again",
        });
      });
    } catch (error) {
      console.error("Payment failed:", error);
    }
  };

  useEffect(() => {
    setLoading(false);
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
    <>
      <div className="sub_header1">
        <div className="container">
          <div className="subheader_inner">
            <div className="subheader_text1">
              <h1>Yoga</h1>
            </div>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link className="btn-link" to="/">
                    Home
                  </Link>
                </li>

                <li className="breadcrumb-item active">Yoga</li>
              </ol>
            </nav>
          </div>
        </div>
      </div>

      <section className="therapeutic-yoga-series">
        <h2>Therapeutic Yoga Series</h2>
        <p>
          Welcome to our Therapeutic Yoga Series, designed to enhance
          flexibility, strength, and overall well-being through targeted asanas
          and mindful practices.
        </p>
        <div className="yoga-series">
          <div className="yoga-item">
            <h3>Micro Level Asanas</h3>
            <img src={yoga1} alt="Micro Level Asanas" />
            <p>
              "Micro Level Asanas target specific areas such as the spine,
              knees, and shoulders, aiming to enhance flexibility, reduce pain,
              and strengthen muscles."
            </p>
            <p>
              Benefits and Example Poses: Improves flexibility and reduces pain
              (Cat-Cow Pose, Downward-Facing Dog, Cobra Pose, Child’s Pose)
            </p>
          </div>
          <div className="yoga-item">
            <h3>Spinal Cord Asanas</h3>
            <img src={yoga2} alt="Spinal Cord Asanas" />
            <p>
              "Spinal Cord Asanas are designed to improve flexibility and
              strength in the spine."
            </p>
            <p>
              Benefits and Example Poses: Enhances spinal flexibility and
              strength (Bridge Pose, Cobra Pose, Cat-Cow Pose)
            </p>
          </div>

          <div className="yoga-item">
            <h3>Core Muscles Asanas</h3>
            <img src={yoga3} alt="Core Muscles Asanas" />
            <p>
              "Asanas that target the upper and lower abdomen, aiding in
              digestion, boosting metabolism, and achieving a balanced weight
              and flat tummy."
            </p>
            <p>
              Benefits and Example Poses: Improves digestion and increases
              metabolism (Boat Pose, Plank Pose, Seated Forward Bend)
            </p>
          </div>
          <div className="yoga-item">
            <h3>Cardio Exercises</h3>
            <img src={yoga4} alt="Cardio Exercises" />
            <p>
              "High-intensity workouts that help reduce fat and balance muscle
              and bone weight."
            </p>
            <p>
              Benefits and Example Exercises: Reduces body fat and strengthens
              muscles and bones (Sun Salutations (Surya Namaskar), Jumping
              Jacks, Burpees)
            </p>
          </div>
          <div className="yoga-item">
            <h3>Asana Transition Flow</h3>
            <img src={yoga5} alt="Asana Transition Flow" />
            <p>
              "Flow sequences like Surya Namaskar and Ashtanga Vinyasa that
              enhance flexibility and strength through fluid movements."
            </p>
            <p>
              Benefits: Improves flexibility and strength, promotes fluid
              movement and coordination, enhances cardiovascular health
            </p>
          </div>
          <div className="yoga-item">
            <h3>Pranayama/Breathing Techniques</h3>
            <img src={yoga6} alt="Pranayama/Breathing Techniques" />
            <p>
              "Over 20 breathing techniques that help regulate high and low
              blood pressure, and maintain optimal sugar and thyroid levels."
            </p>
            <p>
              Benefits and Example Techniques: Regulates blood pressure and
              enhances respiratory health (Alternate Nostril Breathing (Nadi
              Shodhana), Bhramari (Bee Breath), Kapalbhati (Skull Shining
              Breath))
            </p>
          </div>

          <div className="yoga-item">
            <h3>Meditation</h3>
            <img src={yoga7} alt="Meditation" />
            <p>
              "Meditative practices including 7 Chakras healing meditation and
              mantra chanting to improve focus and stability of the mind."
            </p>
            <p>
              Benefits and Example Practices: Enhances mental focus and promotes
              emotional stability (7 Chakras Healing Meditation, Om Mantra
              Chanting, Loving-Kindness Meditation)
            </p>
          </div>
          <div className="yoga-item">
            <h3>PCOD/PCOS Asanas</h3>
            <img src={yoga8} alt="PCOD/PCOS Asanas" />
            <p>
              "Focused on the pelvic, thigh, and reproductive regions, these
              asanas help maintain hormonal balance, improve flexibility, and
              build strength."
            </p>
            <p>
              Benefits and Example Poses: Balances hormones and strengthens
              pelvic and thigh muscles (Butterfly Pose, Reclining Bound Angle
              Pose, Garland Pose)
            </p>
          </div>
        </div>
        <div className="bookbtnyoga">
          <button onClick={() => handlePayment("1000")}>Book Now</button>
        </div>
      </section>
    </>
  );
};

export default Yoga;
