import React, { useState } from "react";
import "../../styles/kalsharpdosh.css";
import Poojapage from "../poojapage/poojapage";
import Poojapanditprofile from "../onlinepuja/poojapanditprofile";

const Navgrah = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const aboutPoojaSamgariText = `
  Navagraha Yantra
Kalash (Copper or Silver)
Holy Water (Gangajal or plain water)
Rice (Akshat)
Red Cloth
Yellow Cloth
Flowers (Red, White, Yellow)
Incense Sticks (Agarbatti)
Ghee Lamp (Diya)
Coconut
Fruits (Banana, Coconut, Pomegranate)
Sweets (Prasadam like Ladoo, Halwa)
Jaggery (Gur)
Black Sesame Seeds (Til)
Puja Thali
Copper Coins
Mango Leaves (for Kalash)
Betel Leaves and Nuts
Panchamrit (Mixture of Milk, Curd, Honey, Sugar, and Ghee)
Mithila (Rice Flakes)
Gulal (colored powder)
Navagraha's Gemstones or Images
Kumkum and Chandan (for applying on forehead)
`;
  const samagriList = aboutPoojaSamgariText.trim().split('\n');
  const visibleItems = isExpanded ? samagriList : samagriList.slice(0, 5);
  return (
    <>
      <Poojapage />

      <div className="about_according">
        <div className="container">
          <div className="row">
            <div className="col-sm-6">
              <Poojapanditprofile />
            </div>
            <div className="col-sm-6">
              <div className="next_section">
                <h2>About Pooja Samagri</h2>
                <div className="next_details">
                  <ul>
                    {visibleItems.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                  {samagriList.length > 5 && (
                    <button onClick={() => setIsExpanded(!isExpanded)} className="toggle-button">
                      {isExpanded ? "Show Less" : "Show More"}
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="col-sm-6">
              <div className="next_section">
                <h2>What are the benefits?</h2>
                <div className="next_details">
                  <ul>
                    <li>Remove negative effects of all planets.</li>
                    <li>Gain victory over enemies.</li>
                    <li>Attract good health and wealth.</li>
                    <li>Remove obstacles in relationships.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="col-sm-6">
              <div className="next_section">
                <h2>How will it happen?</h2>
                <div className="next_details">
                  <ul>
                    <li>Book the Pooja.</li>

                    <li>Input your Name and Surname/Gotra for Sankalp.</li>

                    <li>You can attend Pooja live on video call.</li>

                    <li>Take the blessings.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="col-sm-6">
              <div className="next_section">
                <h2>About Navgrah</h2>
                <div className="next_details">
                  <ul>
                    <li>
                      {" "}
                      Navagrahas are nine celestial bodies in Hindu astrology
                      that affect human life.
                    </li>
                    <li>
                      They consist of the Sun, Moon, Mars, Mercury, Jupiter,
                      Venus, Saturn, Rahu, and Ketu.
                    </li>
                    <li>
                      Each Navagraha has its own qualities, influences, and
                      cosmic energies.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="col-sm-6">
              <div className="next_section">
                <h2>What should you do after Pooja to get maximum benefits?</h2>
                <div className="next_details">
                  <ul>
                    <li>
                      Give grains, fruits, and symbolic items to those in need.
                    </li>
                    <li>Do the Pooja every month for the best benefits.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="col-sm-6">
              <div className="next_section">
                <h2>Why Book with Prabhu Pooja?</h2>
                <div className="next_details">
                  <ul>
                    <li>
                      Prabhu Pooja is India's largest Devotion tech platform,
                      offering access to top astrologers and Pandits.
                    </li>

                    <li>
                      Our Pooja services feature the best Pandits on the
                      platform to ensure you receive the maximum benefits.
                    </li>
                    <li>
                      This Pooja includes family participation and covers
                      Dakshina as well.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navgrah;
