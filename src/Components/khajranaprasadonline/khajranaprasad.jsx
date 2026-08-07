import React, { useState } from "react";
import "../../styles/khajranaprasad.css";
import Khajranaprasadimg from "../Assets/Khajarana Mandir.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "../../Store/UserStore/userAuthStore";
import Swal from "sweetalert2";

const Khajranaprasad = () => {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const location = useLocation();
  const [prasadWeight, setPrasadWeight] = useState("250");
  const [quantityType, setQuantityType] = useState("grams");
  const { price, id } = location.state || {};
  const [sankalpaName, setSankalpaName] = useState("");
  const [sankalpaGotra, setSankalpaGotra] = useState("");
  const { user1 } = useAuthStore();
  const totalPrice = price * quantity;

  const handleCheckout = () => {
    if (!user1) {
      Swal.fire({
        title: "Login Required",
        text: "Please login to buy a membership!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Login Now",
        cancelButtonText: "Cancel",
      });
    } else {
      navigate("/prasadcheckout", {
        state: {
          sankalpaName,
          sankalpaGotra,
          quantity,
          price: totalPrice,
          id,
          prasadWeight,
          weight: quantityType,
        },
      });
    }
  };

  return (
    <>
      <section className="prasad_section">
        <div className="container">
          <div className="prasad_content">
            <h1>KHAJRANA - TEMPLE GIFT BOX</h1>

            <div className="row">
              <div className="col-sm-8">
                <div className="package_transport">
                  <img src={Khajranaprasadimg} alt="" />
                  <p>
                    <b>KHAJRANA TEMPLE</b>
                  </p>

                  <p>
                    Khajrana Ganesh Temple is a Hindu temple complex, situated
                    in Khajrana area of Indore in the Indian state of Madhya
                    Pradesh, India. The main temple in the complex is dedicated
                    to Lord Ganesha. It was built by Maharani Ahilyabai Holkar
                    of the Holkar Dynasty.This temple was built in 1735 by
                    Maharani Ahilyabai Holkar of the Holkar dynasty, who
                    retrieved the idol of god Ganesha from a well where it had
                    been hidden to keep it safe from the Mughal ruler
                    Aurangzeb.The devotees circle around the temple and tie a
                    thread to pray to Lord Ganesha for the successful completion
                    of their work. It is said that the ancient idol in the
                    temple was seen in a dream of a local priest, Pandit Mangal
                    Bhatt. The temple is still managed by the Bhatt family.
                  </p>

                  <p>
                    <b>PRASAD BOX INCLUDES</b>
                  </p>

                  <ul>
                    <li>Dry Fruits</li>
                    <li>Elaichi</li>
                    <li>Chana</li>
                    <li>Raksha Dhaga</li>
                    <li>Sindoor</li>
                    <li>Mata Ki Photo</li>
                    <li>Kajal</li>
                  </ul>

                  <p>
                    <b>TERMS & CONDITIONS</b>
                  </p>

                  <ul>
                    <li>
                      <span>
                        Graphical representation of Prasad on the website may
                        sometimes vary from the actual presentation. However,
                        all the inclusions mentioned on the website shall be
                        present.
                      </span>
                    </li>
                    <li>
                      <span>
                        The delivery timeline may vary between 7 to 10 working
                        days.
                      </span>
                    </li>
                    <li>
                      <span>
                        The delivery will be done by a third-party courier.
                      </span>
                    </li>
                    <li>
                      <span>
                        Prasad are non-refundable as they are sent after being
                        offered in the Name and Gotra of the client.
                      </span>
                    </li>
                  </ul>

                  <p>
                    <b>PRABHU POOJA: We are here to Serve.</b>
                  </p>
                  <Link
                    className="primary_btn yellow"
                    to="https://wa.me/7225016699?text=Namaste"
                  >
                    <i
                      className="fa-brands fa-whatsapp"
                      style={{ marginRight: "5px" }}
                    ></i>
                    Whatsapp
                  </Link>
                </div>
              </div>

              <div className="col-sm-4">
                <form action="" className="package_form">
                  <div
                    className="pbox"
                    style={{
                      background: "#e9a259",
                      padding: "5px 8px",
                      marginBottom: "5px",
                    }}
                  >
                    <h6 className="original-price">
                      <strong>{totalPrice}</strong>
                    </h6>
                  </div>

                  <div className="form-group">
                    <input
                      type="hidden"
                      required="required"
                      className="input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="">
                      Temple <span>*</span>
                    </label>

                    <p className="form-control inputbox-line">
                      Khajrana Ganesh Mandir
                    </p>
                  </div>

                  <div className="form-group">
                    <label htmlFor="">Sankalpa Name. *</label>
                    <input
                      type="text"
                      placeholder="Name"
                      required
                      value={sankalpaName}
                      onChange={(e) => setSankalpaName(e.target.value)}
                      className="form-control inputbox-line"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="">Sankalpa Gotra. *</label>
                    <input
                      type="text"
                      placeholder="Gotra"
                      required
                      value={sankalpaGotra}
                      onChange={(e) => setSankalpaGotra(e.target.value)}
                      className="form-control inputbox-line"
                    />
                  </div>

                  <div className="form-group-box">
                    <label htmlFor="quantity">
                      Quantity: <span>*</span>
                    </label>
                    <input
                      type="number"
                      id="quantity"
                      className="input-product"
                      required
                      min="1"
                      max="10"
                      value={quantity}
                      onChange={(e) => {
                        const newQuantity = Math.max(
                          1,
                          Math.min(10, e.target.value)
                        );
                        setQuantity(newQuantity);
                      }}
                    />
                  </div>

                  <div className="text-input-container">
                    <input
                      type="number"
                      className="quantity-input"
                      placeholder="Prasad in weight"
                      value={prasadWeight}
                      required
                      onChange={(e) => setPrasadWeight(e.target.value)}
                    />
                    <select
                      className="quantity-picker"
                      value={quantityType}
                      onChange={(e) => setQuantityType(e.target.value)}
                    >
                      <option value="grams">grams</option>
                      <option value="kg">kg</option>
                    </select>
                  </div>

                  <button
                    className="primary_btn yellow"
                    onClick={(e) => {
                      e.preventDefault();
                      handleCheckout();
                    }}
                  >
                    Book Now
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Khajranaprasad;
