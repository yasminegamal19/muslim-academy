// src/Pages/Courses/CourseDetailPage.jsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { allCourses } from "../../components/data/CourseData";
import "./CourseDetailPage.css";

export default function CourseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const course = allCourses.find((c) => c.id === id);

  const [openSection, setOpenSection] = useState(null);

  if (!course) {
    return (
      <div className="cdp-not-found" dir="rtl">
        <p>الدورة غير موجودة</p>
        <button onClick={() => navigate(-1)}>رجوع</button>
      </div>
    );
  }

  const toggle = (key) => setOpenSection(openSection === key ? null : key);

  return (
    <div className="cdp" dir="rtl">
      <div className="cdp-hero-wrapper">
        <button className="cdp-back" onClick={() => navigate(-1)}>
          ←
        </button>
        <img src={course.image} alt={course.title} className="cdp-hero-img" />
        <div className="cdp-hero-overlay" />
        <div className="cdp-hero-content">
          <span className="cdp-category-tag">
            {course.type === "kids" ? "دورات للأطفال" : "دورات للكبار"}
            {" / "}
            {course.category}
          </span>
          <h1 className="cdp-title">{course.title}</h1>
        </div>
      </div>

      <div className="cdp-body">
        <div className="cdp-stats">
          <div className="cdp-stat">
            <span className="cdp-stat-icon">⭐</span>
            <span className="cdp-stat-val">{course.rating}</span>
            <span className="cdp-stat-label">التقييم</span>
          </div>
          <div className="cdp-stat">
            <span className="cdp-stat-icon">👥</span>
            <span className="cdp-stat-val">{course.students}+</span>
            <span className="cdp-stat-label">طالب</span>
          </div>
          <div className="cdp-stat">
            <span className="cdp-stat-icon">⏱</span>
            <span className="cdp-stat-val">{course.duration}</span>
            <span className="cdp-stat-label">المدة</span>
          </div>
          <div className="cdp-stat">
            <span className="cdp-stat-icon">📊</span>
            <span className="cdp-stat-val">{course.level}</span>
            <span className="cdp-stat-label">المستوى</span>
          </div>
        </div>

        <div className="cdp-section">
          <h2 className="cdp-section-title">نبذة عن الدورة</h2>
          <p className="cdp-description">{course.description}</p>
        </div>

        <div className="cdp-accordion">
          <div className="cdp-acc-item">
            <button className="cdp-acc-header" onClick={() => toggle("learn")}>
              <span>ماذا ستتعلم؟</span>
              <span
                className={`cdp-chevron ${openSection === "learn" ? "open" : ""}`}
              >
                ▼
              </span>
            </button>
            {openSection === "learn" && (
              <div className="cdp-acc-body">
                <ul className="cdp-learn-list">
                  {course.whatYouLearn.map((item, i) => (
                    <li key={i} className="cdp-learn-item">
                      <span className="cdp-check">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="cdp-acc-item">
            <button
              className="cdp-acc-header"
              onClick={() => toggle("features")}
            >
              <span>مميزات الدورة</span>
              <span
                className={`cdp-chevron ${openSection === "features" ? "open" : ""}`}
              >
                ▼
              </span>
            </button>
            {openSection === "features" && (
              <div className="cdp-acc-body">
                <ul className="cdp-learn-list">
                  {course.features.map((item, i) => (
                    <li key={i} className="cdp-learn-item">
                      <span className="cdp-check green">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="cdp-acc-item">
            <button
              className="cdp-acc-header"
              onClick={() => toggle("curriculum")}
            >
              <span>منهج التقدم</span>
              <span
                className={`cdp-chevron ${openSection === "curriculum" ? "open" : ""}`}
              >
                ▼
              </span>
            </button>
            {openSection === "curriculum" && (
              <div className="cdp-acc-body">
                {course.curriculum.map((item, i) => (
                  <div key={i} className="cdp-curriculum-item">
                    <span className="cdp-week-badge">{item.week}</span>
                    <div>
                      <div className="cdp-curriculum-title">{item.title}</div>
                      <div className="cdp-curriculum-desc">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="cdp-acc-item">
            <button className="cdp-acc-header" onClick={() => toggle("unique")}>
              <span>نظام دقيق</span>
              <span
                className={`cdp-chevron ${openSection === "unique" ? "open" : ""}`}
              >
                ▼
              </span>
            </button>
          </div>

          <div className="cdp-acc-item">
            <button className="cdp-acc-header" onClick={() => toggle("cert")}>
              <span>الشهادات</span>
              <span
                className={`cdp-chevron ${openSection === "cert" ? "open" : ""}`}
              >
                ▼
              </span>
            </button>
          </div>
        </div>

        <div className="cdp-section">
          <h2 className="cdp-section-title">توصيات الطالب</h2>
          <p className="cdp-tip">
            اكتشف ثروة دروس الأكاديمية الإسلامية في الاهتمام بالمحتوى الإسلامي
            وتعليم اللغة العربية وتعلم القرآن الكريم. معرفة أكثر حول الأكاديمية
            الإسلامية — كيف أن الأكاديمية الإسلامية تساعدك في مسيرتك التعليمية.
          </p>

          <div className="cdp-instructor-card">
            <img
              src={course.instructorImage}
              alt={course.instructor}
              className="cdp-instructor-img"
            />
            <div>
              <div className="cdp-instructor-name">{course.instructor}</div>
              <div className="cdp-instructor-stars">{"⭐".repeat(5)}</div>
              <div className="cdp-instructor-sub">مدرس معتمد</div>
            </div>
          </div>
        </div>

        {course.reviews && course.reviews.length > 0 && (
          <div className="cdp-section">
            <h2 className="cdp-section-title">آراء الطلاب</h2>
            {course.reviews.map((rev, i) => (
              <div key={i} className="cdp-review">
                <img
                  src={rev.image}
                  alt={rev.name}
                  className="cdp-rev-avatar"
                />
                <div className="cdp-rev-body">
                  <div className="cdp-rev-name">{rev.name}</div>
                  <div className="cdp-rev-stars">{"⭐".repeat(rev.rating)}</div>
                  <div className="cdp-rev-comment">{rev.comment}</div>
                  <div className="cdp-rev-date">{rev.date}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="cdp-cta-bar">
        <button className="cdp-cta-btn">ابدأ الدورة الآن</button>
      </div>
    </div>
  );
}
