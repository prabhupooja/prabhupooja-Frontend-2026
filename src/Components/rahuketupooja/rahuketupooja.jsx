import React, { useState } from "react";
import "../../styles/kalsharpdosh.css";
import Poojapage from "../poojapage/poojapage";
import Poojapanditprofile from "../onlinepuja/poojapanditprofile";

const Rahuketupooja = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const aboutPoojaSamgariText = `
  Rahu Yantra
  Ketu Yantra
  Kalash (Copper or Silver)
  Holy Water (Gangajal or plain water)
  Rice (Akshat)
  Red Cloth (for Rahu Yantra)
  Yellow Cloth (for Ketu Yantra)
  White Flowers
  Red Flowers (for Rahu)
  Yellow Flowers (for Ketu)
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
`;
  const samagriList = aboutPoojaSamgariText.trim().split("\n");
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
                    <button
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="toggle-button"
                    >
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
                    <li>Clearing obstacles from one's path.</li>
                    <li>Shielding against.</li>
                    <li>
                      Enhancing clarity and wisdom for better decision-making.
                    </li>
                    <li>Fostering physical and mental wellness.</li>
                    <li>Cultivating peace and harmony in life.</li>
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
                    <li>
                      Schedule the Pooja. Provide your name and surname/Gotra
                      for the Sankalp, which the Pandit will take.
                    </li>
                    <li>
                      Have a Dupatta, Handkerchief, or Towel ready to cover your
                      head at the beginning of the Pooja.
                    </li>
                    <li>
                      Listen attentively to the Pooja and seek blessings with
                      devotion.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="col-sm-6">
              <div className="next_section">
                <h2>About Rahu & Ketu Grah</h2>
                <div className="next_details">
                  <ul>
                    <li>
                      Rahu and Ketu denote the points of intersection of the
                      paths of the Sun and the Moon as they move on the
                      celestial sphere.
                    </li>
                    <li>
                      Therefore, Rahu and Ketu are respectively called the north
                      and the south lunar nodes.
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
                      Chant the significant mantras for Rahu and Ketu. "ॐ भ्रां
                      भ्रीं भ्रौं सः राहवे नमः॥"
                    </li>
                    <li>Do the Pooja every month to get maximum benefits.</li>
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

export default Rahuketupooja;
