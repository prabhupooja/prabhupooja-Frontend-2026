import React, { useEffect } from "react";
import "./cursor.css";

const CustomCursor = () => {
  useEffect(() => {
    const cursor = document.querySelector(".cursor");
    const move = (e) => {
      cursor.style.left = e.clientX + "px";
      cursor.style.top = e.clientY + "px";
    };
    document.addEventListener("mousemove", move);
    return () => document.removeEventListener("mousemove", move);
  }, []);

  return <div className="cursor"></div>;
};

export default CustomCursor;