import React,{useState} from "react";
import "../../styles/kalsharpdosh.css";
import Poojapage from "../poojapage/poojapage";
import Poojapanditprofile from "../onlinepuja/poojapanditprofile";

const Rudraabhishek = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const aboutPoojaSamgariText = `
  Shivling (for Abhishek)
  Gangajal (Holy Water)
  Milk
  Honey
  Ghee
  Sugar
  Curd
  Sandalwood Paste (Chandan)
  Bilva (Bel) Leaves
  Flowers (White and Red)
  Fruits (Banana, Coconut, etc.)
  Incense Sticks (Agarbatti)
  Camphor (Kapoor)
  Dhoop
  Ghee Lamp (Diya)
  Rice (Akshat)
  Roli or Kumkum
  Vibhuti (Sacred Ash)
  Betel Leaves and Nuts
  Clothes for Offering (Dhoti/Angavastram)
  Panchamrit (Milk, Curd, Honey, Sugar, Ghee mixture)
  Hawan Samagri (if performing havan)
  Dakshina (Coins or Money for Priest)
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
                    <li>Promotes personal and professional growth.</li>
                    <li>Removes negativity from life.</li>
                    <li>Corrects doshas (negative influences).</li>
                    <li>Enhances harmony in relationships.</li>
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
                <h2>About Rudraabhishek pooja</h2>
                <div className="next_details">
                  <ul>
                    <li>Shiva is known as the god of destruction.</li>
                    <li>
                      Married to Goddess Parvati, symbolizing divine feminine
                      energy.
                    </li>
                    <li>
                      Shiva is revered as a yogi and remover of ignorance,
                      guiding towards spiritual awakening and liberation
                      (moksha).
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
                    <li>Practice gratitude for blessings received.</li>
                    <li>Perform the Pooja monthly for continuous benefits.</li>
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

export default Rudraabhishek;
