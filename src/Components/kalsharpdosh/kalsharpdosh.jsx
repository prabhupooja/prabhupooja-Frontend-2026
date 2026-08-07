import React, { useState } from "react";
import "../../styles/kalsharpdosh.css";
import Poojapage from "../poojapage/poojapage";
import Poojapanditprofile from "../onlinepuja/poojapanditprofile";

const Kalsharpdosh = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const aboutPoojaSamgariText = `
  Nag-Nagin Pair: Made of silver
 Black Sesame Seeds
 Urad Dal (Black Lentils)
 Black Cloth
 White Cloth
 Coconut
 Supari (Betel Nut)
 Betel Leaves
 Rice (Akshat)
 Turmeric and Kumkum
 Vermilion (Sindoor)
 Gangajal (Holy Water)
 Milk
 Honey
 Curd
 Ghee
 Panchamrit: A mixture of milk, curd, ghee, honey, and sugar
 Flowers: Especially white and red
 Incense Sticks and Lamp (Diya): With oil or ghee
 Tree Root: If specifically requested
 Copper Pot and Vessel
 Chandan (Sandalwood Paste)
 Fruits: Banana, Pomegranate, Apple, etc.
 Jaggery and Sugar
 Wheat Flour and Kheer (Sometimes required)
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
                    <li>
                      The primary aim of performing this Puja is to mitigate and
                      transform the adverse effects of Kaal Sarp Yog into
                      positive outcomes.
                    </li>
                    <li>
                      It eliminates potential barriers and obstacles to one's
                      success.
                    </li>
                    <li>It addresses issues causing delays in marriage.</li>
                    <li>
                      The Puja also ensures stability in both personal and
                      professional life.
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
                    <li> Book the Pooja. </li>
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
                <h2>About Kaal Sarp Dosh</h2>
                <div className="next_details">
                  <ul>
                    <li>
                      Kaal Sarp Dosh arises as a curse from the bad deeds done
                      in a previous life, bringing various troubles to the
                      person's current life.
                    </li>
                    <li>
                      The presence of this dosha causes continuous issues
                      related to children, health, home, family, and finances,
                      making the person very distressed.
                    </li>
                    <li>
                      This dosha leads to mental troubles and causes bad dreams.
                    </li>
                    <li>
                      Kaal Sarp Dosh is a result of the inauspicious effects of
                      Rahu and Ketu.
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
                      {" "}
                      Recite the important Shiva Mantra: “Om Namah Shivaya”
                    </li>
                    <li> Do the Pooja every month to get maximum benefits. </li>
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

export default Kalsharpdosh;
