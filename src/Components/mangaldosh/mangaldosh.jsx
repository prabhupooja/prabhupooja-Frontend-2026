import React, { useState } from "react";
import "../../styles/kalsharpdosh.css";
import Poojapage from "../poojapage/poojapage";
import Poojapanditprofile from "../onlinepuja/poojapanditprofile";

const Mangaldosh = () => { 
   const [isExpanded, setIsExpanded] = useState(false);

  const aboutPoojaSamgariText = `
  Mangal Yantra
 Kalash (Copper or Silver)
 Holy Water (Gangajal or plain water)
 Rice (Akshat)
 Red Cloth
 Red Flowers
 Incense Sticks (Agarbatti)
 Ghee Lamp (Diya)
 Coconut
 Pomegranate
 Banana
 Sweets (Ladoo or Halwa)
 Red Sandalwood Powder (Chandan)
 Copper Coins
 Mango Leaves
 Betel Leaves and Nuts
 Puja Thali
 Jaggery (Gur)
 Panchamrit (Mixture of Milk, Curd, Honey, Sugar, and Ghee)
 Hawan Samagri (for fire rituals)
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
                    <li>This Pooja stops injuries and accidents.</li>
                    <li>It helps fix marriage delays.</li>
                    <li>It gets rid of health problems</li>
                    <li>It brings happiness and wealth.</li>
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
                <h2>About Mangal Dosh Nivaran Pooja</h2>
                <div className="next_details">
                  <ul>
                    <li>Mangal Dosha Nivaran Pooja will fix marriage delays
                      completely.</li>
                    <li>It will ensure a happy and successful married life.</li>
                    <li>It removes all obstacles to financial growth.</li>
                    <li>This Pooja brings blessings from the Mangal planet
                      for health and prosperity.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="col-sm-6">
              <div className="next_section">
                <h2>What should you do after Pooja to get maximum benefits?</h2>
                <div className="next_details">
                  <ul>
                    <li>Hold rice or flowers in your hands during the puja, and
                      afterward, place them on a tree, plant, or at your place of
                      worship.</li>
                    <li>Donate masoor lentils (मसूर की दाल) or wheat (गेहूँ) to the poor.</li>
                    <li>Perform the Pooja every month to maximize the benefits.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="col-sm-6">
              <div className="next_section">
                <h2>Why Book with Prabhu Pooja?</h2>
                <div className="next_details">
                  <ul>
                    <li>Prabhu Pooja is India's largest Devotion tech platform,
                      offering access to top astrologers and Pandits.</li>
                    <li>Our Pooja services feature the best Pandits on the
                      platform to ensure you receive the maximum benefits.</li>
                    <li>This Pooja includes family participation and covers
                      Dakshina as well.</li>
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

export default Mangaldosh;
