import React, { useState } from "react";
import "../../styles/kalsharpdosh.css";
import Poojapage from "../poojapage/poojapage";
import Poojapanditprofile from "../onlinepuja/poojapanditprofile";

const Vastushanti = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const aboutPoojaSamgariText = `
  Kalash (Copper or Silver)
Holy Water (Gangajal)
Coconut
Mango Leaves
Red and White Cloth
Rice (Akshat)
Turmeric Powder (Haldi)
Vermilion (Sindoor)
Sandalwood Powder (Chandan)
Betel Leaves and Nuts
Flowers (Assorted)
Garlands
Incense Sticks (Agarbatti)
Camphor (Kapoor)
Ghee Lamp (Diya)
Panchamrit (Milk, Curd, Honey, Sugar, and Ghee)
Fruits (Banana, Coconut, Pomegranate, etc.)
Sweets (Prasad)
Hawan Samagri
Wood Logs (Mango or Neem)
Navagraha Idols or Pictures
Navadhanya (Nine Grains)
Dhoop
Akshat (Rice mixed with turmeric)
Thread (Moli)
Kumkum
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
                    <li>
                      Compliance with Vastu Principles: Aligns the home with
                      Vastu principles, ensuring long-term benefits and
                      stability.
                    </li>
                    <li>
                      Prosperity and Success: Attracts prosperity, wealth, and
                      success in all endeavors.
                    </li>
                    <li>
                      Removal of Negative Energies: Purifies the space, removing
                      negative energies and influences.
                    </li>
                    <li>
                      Harmonious Living Environment: Ensures peace, harmony, and
                      balance within the home.
                    </li>
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
                    <li>You can attend Pooja live on video call.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="col-sm-6">
              <div className="next_section">
                <h2>About Vastu Shanti Pooja</h2>
                <div className="next_details">
                  <ul>
                    <li>
                      Purpose: Conducted to purify the home and ensure peace,
                      harmony, and prosperity.
                    </li>
                    <li>
                      Deities: Worship includes Vastu Purusha, Lord Ganesha, and
                      Goddess Lakshmi, among others.
                    </li>
                    <li>
                      Rituals: Involves rituals like Havan (fire ceremony),
                      chanting of mantras, and offering of flowers, fruits, and
                      sweets.
                    </li>
                    <li>
                      Timing: Typically performed during auspicious occasions
                      such as moving into a new home or significant life events.
                    </li>
                    <li>
                      Benefits: Aims to remove negative energies, attract
                      positive vibrations, and bless the household with health,
                      wealth, and well-being.
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
                      Regular Worship: Continue daily or regular worship
                      practices in your home to sustain the divine presence and
                      positivity.
                    </li>
                    <li>
                      Follow Vastu Principles: Adhere to Vastu principles in
                      your home's layout and decor to maintain harmony and
                      balance.
                    </li>
                    <li>
                      Charity: Engage in acts of charity and help the needy, as
                      giving back enhances the blessings received.
                    </li>
                    <li>
                      Light Lamps and Incense: Light lamps or incense sticks
                      regularly to keep the atmosphere pure and sacred.
                    </li>
                    <li>
                      Consult Vastu Experts: Periodically consult Vastu experts
                      to ensure that your home continues to align with Vastu
                      principles.
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

export default Vastushanti;
