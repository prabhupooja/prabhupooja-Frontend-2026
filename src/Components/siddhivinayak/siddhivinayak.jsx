import React, { useState } from "react";
import "../../styles/kalsharpdosh.css";
import Poojapage from "../poojapage/poojapage";
import Poojapanditprofile from "../onlinepuja/poojapanditprofile";

const Siddhivinayak = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const aboutPoojaSamgariText = `
    Ganesh Idol or Photo
    Red Cloth
    Yellow Cloth
    Kalash (Copper or Silver)
    Holy Water (Gangajal)
    Rice (Akshat)
    Red Flowers (Hibiscus preferred)
    Durva Grass (Doob Grass)
    Incense Sticks (Agarbatti)
    Ghee Lamp (Diya)
    Camphor (Kapoor)
    Modak or Ladoo (as Prasad)
    Bananas
    Coconut
    Jaggery (Gur)
    Honey
    Betel Leaves and Nuts
    Sandalwood Powder (Chandan)
    Turmeric Powder (Haldi)
    Kumkum (Vermillion)
    Panchamrit (Milk, Curd, Honey, Sugar, Ghee mixture)
    Havan Samagri (if fire ritual is included)
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
                <h2>About SATYANARAYAN Pooja</h2>
                <div className="next_details">
                  <ul>
                    <li>
                      Worship of Lord Ganesha: Performed to honor Lord Ganesha,
                      the remover of obstacles.
                    </li>
                    <li>
                      Blessings for Success: Aimed at seeking blessings for
                      success, prosperity, and wisdom.
                    </li>
                    <li>
                      Offerings: Devotees offer flowers, sweets, and prayers to
                      Lord Ganesha.
                    </li>
                    <li>
                      New Beginnings: Often conducted at the start of new
                      ventures or important events.
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
                    <li>Charity: Donate to those in need.</li>
                    <li>
                      Continue reciting Ganesha mantras like "Om Gan Ganapataye
                      Namah".
                    </li>
                    <li>
                      Regular worship of Lord Ganesha into your daily routine.
                      This can be a simple prayer, offering flowers, or lighting
                      a lamp.
                    </li>
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

export default Siddhivinayak;
