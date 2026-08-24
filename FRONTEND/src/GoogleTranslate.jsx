import { useEffect } from "react";
import './GoogleTranslate.css'

const GoogleTranslate = () => {
  useEffect(() => {
    if (!window.google || !window.google.translate) return;

    new window.google.translate.TranslateElement(
      { pageLanguage: "en" },
      "google_translate_element"
    );

    setTimeout(() => {
      const poweredBy = document
        .querySelector("#google_translate_element")
        ?.querySelectorAll("span, a");
      poweredBy?.forEach((element) => {
        element.style.display = "none";
      });
    }, 1000);
  }, []);

  return (
    <>
      <span className="uil--language" title="Change Language">
        <div id="google_translate_element"></div>
      </span>
    </>
  );
};

export default GoogleTranslate;
