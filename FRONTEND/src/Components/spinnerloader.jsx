import React, { useEffect, useState } from "react";
import loader from "../Components/Assets/loader.svg";

function SpinnerLoader() {
  const [text, setText] = useState("");
  const [showImg, setShowImg] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setShowImg(false)
      setText("please wait for some time");
    }, 3000);
  }, []);

  return(
    <>
    <div>
        {
            showImg ? (
                <img src={loader} alt="image" />
            ) : (
                <h3>{text}</h3>
            )
        }
    </div>
    </>
  );
}

export default SpinnerLoader;
