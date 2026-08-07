import React, { useState } from "react";
import "../../styles/kalsharpdosh.css";
import Poojapage from "../poojapage/poojapage";
import Poojapanditprofile from "../onlinepuja/poojapanditprofile";

const Pitradoshpooja = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const aboutPoojaSamgariText = `
  Kalash (Copper or Silver)
Water (Gangajal or plain water)
Rice (Akshat)
Coconut
Betel Leaves and Nuts
Flowers (White and Red)
Incense Sticks (Agarbatti)
Lamp (Diya) with Ghee or Oil
Puja Thali
Black Sesame Seeds (Til)
Barley (Jau)
Sugar
Jaggery (Gur)
Fruits (Banana, Apple, Pomegranate)
Panchamrit (Milk, Curd, Honey, Sugar, Ghee)
Red and Yellow Cloth
Copper or Silver Coins
Panchgavyam (Mixture of Cow Milk, Curd, Ghee, Urine, and Dung)
Ghee
Wheat Flour
Chandan (Sandalwood Paste)
`;

  const samagriList = aboutPoojaSamgariText.trim().split("\n");

  // Limit the number of items to show initially
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
                    <li>
                      Seek blessings from ancestors to receive their guidance
                      and support.
                    </li>
                    <li>
                      Remove all obstacles that may hinder progress in life.
                    </li>
                    <li>
                      Alleviate financial troubles and foster stability in
                      monetary matters.
                    </li>
                    <li>
                      Enhance the likelihood of finding a suitable marriage
                      partner.
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
                  </ul>
                </div>
              </div>
            </div>

            <div className="col-sm-6">
              <div className="next_section">
                <h2>About Pitra Dosh</h2>
                <div className="next_details">
                  <ul>
                    <li>
                      Pitra Dosh signifies the negative karma accumulated by
                      ancestors due to their past wrongdoings.
                    </li>
                    <li>
                      If ancestors have committed crimes, mistakes, or sins,
                      their descendants may inherit Pitra Dosh in their
                      horoscope.
                    </li>
                    <li>
                      Pitra Dosh can also arise when family members neglect
                      annual rituals for their ancestors or fail to provide
                      proper care for elderly relatives, leaving them to fend
                      for themselves.
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
                      Offer food to Brahmins on every Amavasya (new moon day).
                    </li>
                    <li>
                      Perform the Pooja regularly each month to ensure continued
                      benefits and blessings.
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

export default Pitradoshpooja;
