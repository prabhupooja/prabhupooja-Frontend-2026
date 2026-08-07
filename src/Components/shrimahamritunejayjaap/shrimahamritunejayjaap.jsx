import React ,{useState}from "react";
import "../../styles/kalsharpdosh.css";
import Poojapage from "../poojapage/poojapage";
import Poojapanditprofile from "../onlinepuja/poojapanditprofile";

const Shrimahamritunejayjaap = () => {
   const [isExpanded, setIsExpanded] = useState(false);
   const aboutPoojaSamgariText = `
   Maha Mrityunjaya Yantra
  Shivling (Small or Large)
  Gangajal (Holy Water)
  Raw Milk (Unboiled)
  Honey
  Ghee (Clarified Butter)
  Sugar
  Bel Patra (Bilva Leaves)
  White Flowers
  Sandalwood Paste (Chandan)
  Sacred Ash (Vibhuti/Bhasma)
  Incense Sticks (Agarbatti)
  Ghee Lamp (Diya)
  Camphor (Kapoor)
  Rice (Akshat)
  Rudraksha Mala (for chanting)
  Panchamrit (Mixture of Milk, Curd, Honey, Sugar, and Ghee)
  Fruits (Banana, Coconut, etc.)
  Betel Leaves and Nuts
  Hawan Samagri (for fire offerings)
  Red Cloth (to cover the Yantra)
  Puja Thali
  Kalash (for water)
  Black Sesame Seeds (Til)
  White Thread (Janeu)
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
                      Protects against premature death and grants longevity and
                      health.
                    </li>
                    <li>
                      Helps in overcoming illnesses, Reduces stress and anxiety
                      and Fosters inner calm.
                    </li>
                    <li>Guards against negative energies and evil spirits.</li>
                    <li>Removes negative energies.</li>
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
                <h2>About Maha Mrityunjaya Mantra :</h2>
                <div className="next_details">
                  <ul>
                    <li>
                      Protection and Longevity: The Maha Mrityunjaya Mantra
                      safeguards against premature death and grants longevity
                      and robust health.
                    </li>
                    <li>
                      Healing and Calm: It helps in overcoming illnesses,
                      reduces stress and anxiety, and fosters a deep sense of
                      inner calm.
                    </li>
                    <li>
                      Purification and Shielding: The mantra guards against
                      negative energies and evil spirits, removing any lingering
                      negative influences and purifying one's environment.
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
                      Continue chanting the Maha Mrityunjaya Mantra regularly.
                      Even a few repetitions each day can help maintain the
                      protective and healing vibrations.
                    </li>
                    <li>
                      Wearing specific protective amulets, talismans, or
                      gemstones can help in sustaining the benefits of the Maha
                      Mrityunjaya Pooja.
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

export default Shrimahamritunejayjaap;
