import React ,{useState}from "react";
import "../../styles/kalsharpdosh.css";
import Poojapage from "../poojapage/poojapage";
import Poojapanditprofile from "../onlinepuja/poojapanditprofile";

const Rinmukti = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const aboutPoojaSamgariText = `
  Rin Mukti Yantra
 Kalash (Copper or Silver)
 Holy Water (Gangajal or plain water)
 Rice (Akshat)
 White Cloth
 White Flowers
 Incense Sticks (Agarbatti)
 Ghee Lamp (Diya)
 Coconut
 Fruits (Banana, Pomegranate, Apple)
 Sweets (Ladoo or Halwa)
 Jaggery (Gur)
 Black Sesame Seeds (Til)
 Betel Leaves and Nuts
 Mango Leaves
 Panchamrit (Milk, Curd, Honey, Sugar, and Ghee)
 Hawan Samagri
 Camphor (Kapoor)
 Cloves (Laung)
 Red Sandalwood Powder (Chandan)
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
                      Debt Relief: Helps in reducing and eventually eliminating
                      financial debts.
                    </li>

                    <li>
                      Financial Stability: Promotes better financial stability
                      and management.
                    </li>

                    <li>
                      Prosperity and Abundance: Attracts prosperity and
                      abundance in one's life.
                    </li>

                    <li>
                      Stress Reduction: Reduces financial stress and anxiety.
                    </li>
                    <li>
                      Positive Energy: Invokes positive energy and blessings for
                      a secure financial future.
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
                <h2>About RIN MUKTI POOJA</h2>
                <div className="next_details">
                  <ul>
                    <li>
                      Purpose: Performed to seek relief from debts and financial
                      burdens.
                    </li>
                    <li>
                      Deities Worshiped: Typically involves worship of Lord
                      Shiva, Goddess Lakshmi, and Lord Kubera for financial
                      well-being.
                    </li>
                    <li>
                      Offerings: Includes offerings like fruits, flowers,
                      incense, and special prayers or mantras.
                    </li>
                    <li>
                      Rituals: Involves specific rituals and recitations
                      designed to invoke divine blessings for financial
                      liberation.
                    </li>
                    <li>
                      Timing: Often performed during auspicious days or
                      festivals to enhance the effectiveness of the Pooja.
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
                      Charity and Help: Donate to the needy or engage in acts of
                      charity to enhance the positive effects of the Pooja.
                    </li>
                    <li>
                      Recite Mantras: Continue chanting relevant mantras, such
                      as "Om Namah Shivaya" or other prayers specific to the
                      deity worshiped in the Pooja.
                    </li>
                    <li>
                      Recite Mantras: Continue chanting relevant mantras, such
                      as "Om Namah Shivaya" or other prayers specific to the
                      deity worshiped in the Pooja.
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

export default Rinmukti;
