import React, { useState } from 'react';
//import axios from 'axios';

const TranslatePage = () => {
  const [language, setLanguage] = useState('en'); // Default language Spanish
  const [translatedContent] = useState('');

//   const handleTranslate = async () => {
//     const contentToTranslate = document.documentElement.innerHTML; // Get the entire HTML content
//     try {
//       const response = await axios.post('http://localhost:3002/api/v1/translate', {
//         text: contentToTranslate,
//         targetLanguage: language
//       });
//       setTranslatedContent(response.data.translation);
//     } catch (error) {
//       console.error('Error translating text', error);
//     }


  return (
    <div>
      <select value={language} onChange={(e) => setLanguage(e.target.value)}>
        <option value="en">english</option>
        <option value="hi">hindi</option>
        <option value="ru">russian</option>
        {/* Add more languages as needed */}
      </select>
      {/* <button onClick={handleTranslate}>Translate Page</button> */}
      <div dangerouslySetInnerHTML={{ __html: translatedContent }} />
    </div>
  );
}

export default TranslatePage;