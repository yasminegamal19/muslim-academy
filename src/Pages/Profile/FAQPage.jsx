import React, { useState, useEffect } from "react";
import axios from "axios"; 
import "./FAQ.css";

const FAQPage = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://muslim-academy.betamoneta.com/api/faq",
        );

        if (response.data && response.data.code === 200) {
          setFaqs(response.data.data); 
        } else {
          setError("فشل في تحميل الأسئلة الشائعة");
        }
      } catch (err) {
        console.error("Error fetching FAQs:", err);
        setError("حدث خطأ أثناء الاتصال بالخادم، يرجى المحاولة لاحقاً.");
      } finally {
        setLoading(false);
      }
    };

    fetchFAQs();
  }, []);

  const toggleFAQ = (index) => {
    setActiveId(activeId === index ? null : index);
  };

  if (loading) {
    return (
      <div className="faq-loading-container d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">جاري التحميل...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger d-inline-block" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="faq-section py-5">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="faq-title fw-bold mb-3">الأسئلة الشائعة</h2>
          <p className="faq-subtitle">
            كل ما تحتاج معرفته عن خدماتنا وإجابات لأبرز استفساراتك
          </p>
        </div>

        <div className="row justify-content-center">
          <div className="col-md-8">
            {faqs.length === 0 ? (
              <p className="text-center text-muted">
                لا توجد أسئلة شائعة متاحاً حالياً.
              </p>
            ) : (
              <div className="faq-list">
                {faqs.map((item, index) => {
                  const isOpen = activeId === index;
                  return (
                    <div
                      className={`faq-item mb-3 ${isOpen ? "active" : ""}`}
                      key={index}
                    >
                      <button
                        className="faq-question d-flex justify-content-between align-items-center w-100 text-start border-0 bg-transparent p-4"
                        onClick={() => toggleFAQ(index)}
                        aria-expanded={isOpen}
                      >
                        <span className="fw-semibold">{item.question}</span>
                        <span
                          className={`faq-icon ms-3 ${isOpen ? "rotate" : ""}`}
                        >
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <polyline points="6 9 12 15 18 9"></polyline>
                          </svg>
                        </span>
                      </button>

                      <div
                        className={`faq-answer-wrapper ${isOpen ? "show" : ""}`}
                      >
                        <div className="faq-answer p-4 pt-0">
                          <p className="m-0">{item.answer}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
