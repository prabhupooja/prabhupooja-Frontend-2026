import React, { useRef, useState } from "react";
import rose from "./Assets/rose-petaimg.png";
import { MdCelebration } from "react-icons/md";
import "../styles/petals.css";

function Petals() {
  const intervalRef = useRef(null);
  const petalsRef = useRef([]);
  const [vibrate, setVibrate] = useState(false);

  const createPetal = () => {
    const petal = document.createElement("img");
    petal.src = rose;
    petal.className = "petal";
    petal.style.left = Math.random() * 100 + "vw";
    petal.style.animationDuration = `${Math.random() * 3 + 3}s`;
    petal.style.transform = `rotate(${Math.random() * 360}deg)`;

    document.body.appendChild(petal);
    petalsRef.current.push(petal);

    petal.addEventListener("animationend", () => {
      petal.remove();
      petalsRef.current = petalsRef.current.filter((p) => p !== petal);
    });
  };

  const startEffect = () => {
    if (intervalRef.current) return;

    setVibrate(true);
    setTimeout(() => setVibrate(false), 300);

    intervalRef.current = setInterval(createPetal, 5);
    setTimeout(() => {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }, 1000);
  };

  return (
    <div className="petals_icon">
      <div className="petal_btn">
        <MdCelebration
          onClick={startEffect}
          className={`celebrationicon ${vibrate ? "vibrate" : ""}`}
          size={50}
          color="white"
        />
      </div>
    </div>
  );
}

export default Petals;
