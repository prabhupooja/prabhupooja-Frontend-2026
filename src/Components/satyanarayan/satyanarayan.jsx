import React,{useState} from "react";
import "../../styles/kalsharpdosh.css";
import Poojapage from "../poojapage/poojapage";
import Poojapanditprofile from "../onlinepuja/poojapanditprofile";


const Satyanarayan = () => {
   const [isExpanded, setIsExpanded] = useState(false);
   const aboutPoojaSamgariText = `
   Satyanarayan Idol or Picture
 Kalash (Copper or Silver)
 Holy Water (Gangajal or plain water)
 Rice (Akshat)
 Chandan (Sandalwood)
 Incense Sticks (Agarbatti)
 Ghee Lamp (Diya)
 Coconut
 Banana
 Pomegranate
 Sweets (Ladoo, Halwa)
 Betel Leaves and Nuts
 Mango Leaves
 Puja Thali
 Jaggery (Gur)
 Panchamrit (Mixture of Milk, Curd, Honey, Sugar, and Ghee)
 Red and Yellow Flowers
 Honey
 Saffron (Kesar)
 Silver or Copper Coins
 Hawan Samagri (for fire rituals)
 New Clothes for the Idol (optional)
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
                    <li>SATYANARAYAN Pooja blesses with health, wealth, and happiness.</li>
                    <li>It removes obstacles and brings success.</li>
                    <li>It fulfills wishes and promotes inner peace.</li>
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
                <h2>About SATYANARAYAN Pooja</h2>
                <div className="next_details">
                  <ul>
                    <li>SATYANARAYAN PUJA worships Lord Vishnu for blessings.</li>
                    <li>It involves prayers, offerings, and lighting lamps.</li>
                    <li>Benefits include prosperity, harmony, and fulfillment of wishes.</li>
                    <li>It is believed to remove obstacles and bring peace.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="col-sm-6">
              <div className="next_section">
                <h2>What should you do after Pooja to get maximum benefits?</h2>
                <div className="next_details">
                  <ul>
                    <li>Distribute prasad (sacred food offering) to family and friends.</li>
                    <li>Donate to the needy or perform acts of charity.</li>
                    <li>Recite hymns and prayers regularly for continued blessings.</li>
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

export default Satyanarayan;
