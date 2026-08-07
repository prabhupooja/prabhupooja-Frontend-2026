import { useEffect, useState } from "react";
import "./NewLoader.css";

const NewLoader = () => {
  const [text, setText] = useState("");
  const fullText = "Loading...";
  const [isDeleting, setIsDeleting] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          setText(fullText.substring(0, index + 1));
          setIndex((prev) => prev + 1);

          if (index + 1 === fullText.length) {
            setTimeout(() => setIsDeleting(true), 100);
          }
        } else {
          setText(fullText.substring(0, index - 1));
          setIndex((prev) => prev - 1);

          if (index === 0) {
            setIsDeleting(false);
          }
        }
      },
      isDeleting ? 60 : 100
    );

    return () => clearTimeout(timeout);
  }, [index, isDeleting]);

  return (
    <div className="loader-overlay">
      <div className="loaderContent">
        <img src={require("../Assets/logo-Prabhupooja.png")} alt="" />
        {/* <HashLoader color="#cd5702" /> */}
        <p>{text}</p>
      </div>
    </div>
  );
};

export default NewLoader;
