import React ,{useState}from "react";
import "../../styles/kalsharpdosh.css";
import Poojapage from "../poojapage/poojapage";
import Poojapanditprofile from "../onlinepuja/poojapanditprofile";

const Sundarkand = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const aboutPoojaSamgariText = `
    Ramcharitmanas or Sundarkand Book
   Idol or Picture of Lord Hanuman
   Idol or Picture of Lord Ram, Sita, and Lakshman
   Red Cloth
   Chandan (Sandalwood Powder)
   Kumkum (Red Vermillion)
   Akshat (Unbroken Rice)
   Flowers (Red or Yellow)
   Garland for Lord Hanuman
   Incense Sticks (Agarbatti)
   Ghee Lamp (Diya)
   Camphor (Kapoor)
   Tulsi Leaves
   Bananas or Other Fruits
   Coconut
   Jaggery (Gur)
   Honey
   Sweets (Ladoo, Halwa, etc.)
   Panchamrit (Milk, Curd, Honey, Sugar, and Ghee mixture)
   Betel Leaves and Nuts
   Gangajal (Holy Water)
   Hawan Samagri (optional for Havan)
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
                    <li>Brings peace, harmony, and positivity into life.</li>
                    <li>Helps overcome obstacles and fulfill desires.</li>
                    <li>
                      Provides spiritual strength and blessings from Lord
                      Hanuman.
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
                <h2>About SUNDARKAND PATH POOJA</h2>
                <div className="next_details">
                  <ul>
                    <li>
                      It venerates Lord Hanuman for courage, strength, and
                      success in life's challenges.
                    </li>
                    <li>
                      The puja includes chanting verses, offering prayers, and
                      seeking divine blessings.
                    </li>
                    <li>
                      Its aim is to remove obstacles and invite prosperity and
                      peace.
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
                      Distribute prasad (sacred food offering) to attendees.
                    </li>
                    <li>Read or listen to the Sundar Kand text regularly.</li>
                    <li>
                      Maintain a charitable attitude and help those in need.
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

export default Sundarkand;
