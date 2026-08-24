import React, { useState, useEffect } from "react";
import { TailSpin } from "react-loader-spinner";
import NewLoader from "./NewLoader/NewLoader";

function Faq() {
  const [openIndex, setOpenIndex] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <>
        <div>
          <NewLoader />
        </div>
      </>
    );
  }

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  const faqs = [
    {
      question: "What is Prabhu Pooja?",
      answer:
        "Prabhu Pooja is a ritual performed to offer devotion to deities, seeking blessings for health, prosperity, and peace. At Prabhu Pooja, we make it accessible online.",
    },
    {
      question: "What are various services offered by Prabhu Pooja?",
      answer:
        "Prabhu Pooja offers a wide range of services including Membership, Online Pooja, Prasad Delivery, Astrology, E-commerce, Muhurat, and personalized pooja services tailored to your needs.",
    },
    {
      question: "How can I trust Prabhu Pooja?",
      answer:
        "Prabhu Pooja is committed to delivering authentic rituals conducted by experienced priests, ensuring transparency and customer satisfaction. We have positive reviews and testimonials from our clients.",
    },
    {
      question: "How can I book a Pooja online?",
      answer:
        "You can easily book a Pooja through the Prabhu Pooja website by selecting the Pooja you wish to perform and following the checkout process.",
    },
    {
      question: "What types of Poojas are available?",
      answer:
        "Prabhu Pooja offers a variety of Poojas including Griha Pravesh, Shanti Pooja, Navagraha Pooja, and many more.",
    },
    {
      question: "How long does a Pooja take?",
      answer:
        "The duration of a Pooja varies depending on the type, but most take between 1 to 3 hours.",
    },
    {
      question: "Is there a specific time to perform Pooja?",
      answer:
        "While many Poojas can be performed at any time, certain rituals are best performed during auspicious timings as per the Hindu calendar.",
    },
    {
      question: "What if I have special requests for the Pooja?",
      answer:
        "You can mention any specific requests during the booking process, and our priests will do their best to accommodate them.",
    },
    {
      question: "How do I make payments?",
      answer:
        "We accept various payment methods including credit/debit cards, UPI, and net banking for your convenience.",
    },
    {
      question: "What is the significance of performing a Pooja?",
      answer:
        "Performing a Pooja is believed to bring divine blessings, help in overcoming obstacles, and purify the mind and environment. It is also a way to show gratitude and devotion to the deities.",
    },
    {
      question: "Do I need to be present for the Pooja?",
      answer:
        "No, you do not need to be physically present for the Pooja. Prabhu Pooja offers online services where priests can perform the rituals on your behalf, and you can participate virtually.",
    },
    {
      question: "Can I request a customized Pooja for a specific occasion?",
      answer:
        "Yes, you can request a customized Pooja for special occasions like birthdays, anniversaries, or any personal milestones, and we will tailor the ritual to suit your needs.",
    },
    {
      question: "What is the process for Prasad Delivery?",
      answer:
        "After your Pooja is completed, the Prasad (holy offering) will be packed securely and delivered to your address, ensuring that it reaches you in a timely and safe manner.",
    },
    {
      question: "Is the online Pooja experience interactive?",
      answer:
        "Yes, our online Pooja services are designed to be interactive. You can watch the live-streamed ritual and engage with the priest through our platform if you have any questions or requests.",
    },
    {
      question: "Are there any discounts or special offers available?",
      answer:
        "Yes, we occasionally offer discounts and promotions. You can subscribe to our newsletter or follow us on social media for updates on any special offers.",
    },
    {
      question: "How do I know if the Pooja was performed correctly?",
      answer:
        "We ensure that each Pooja is performed according to traditional rituals by qualified and experienced priests. You will receive a detailed report and video of the ceremony as proof of its completion.",
    },
    {
      question: "Can I book a Pooja for someone else?",
      answer:
        "Yes, you can book a Pooja on behalf of someone else. During the booking process, you can provide their details, and the Pooja will be conducted in their name.",
    },
    {
      question: "What if I miss the scheduled time for my online Pooja?",
      answer:
        "If you miss the scheduled time, please contact our support team, and we will do our best to reschedule the Pooja at a convenient time for you.",
    },
    {
      question: "Can I get astrology services along with a Pooja?",
      answer:
        "Yes, we offer astrology services as part of our offerings. You can consult an astrologer and get a personalized reading along with the Pooja of your choice.",
    },
  ];

  return (
    <>
      <div className="faq-section">
        <div className="container">
          <h1>FAQs</h1>
          <p>Clear your doubts here regarding how things work</p>
          {faqs.map((faq, index) => (
            <div className="faq-item" key={index}>
              <div className="faq-question" onClick={() => toggleFAQ(index)}>
                <h5>{faq.question}</h5>
                <span
                  className={`arrow ${openIndex === index ? "up" : "down"}`}
                >
                  &#9660;
                </span>
              </div>
              {openIndex === index && (
                <div className="faq-answer">{faq.answer}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Faq;
