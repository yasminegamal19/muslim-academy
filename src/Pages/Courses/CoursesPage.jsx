// src/Pages/Courses/CoursesPage.jsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { kidsCoursesData, adultCoursesData } from "../../components/data/CourseData";
import "./CoursesPage.css";

function CourseCard({ course }) {
  const navigate = useNavigate();
  return (
    <div
      className="cp-card"
      onClick={() => navigate(`/courses/${course.id}`)}
    >
      <div className="cp-card-img-wrapper">
        <img src={course.image} alt={course.title} className="cp-card-img" />
        {course.badge && <span className="cp-badge">{course.badge}</span>}
      </div>
      <div className="cp-card-body">
        <span className="cp-category">{course.category}</span>
        <h3 className="cp-title">{course.title}</h3>
        <p className="cp-subtitle">{course.subtitle}</p>
        <div className="cp-meta">
          <img
            src={course.instructorImage}
            alt={course.instructor}
            className="cp-avatar"
          />
          <span className="cp-instructor">{course.instructor}</span>
          <span className="cp-rating">⭐ {course.rating}</span>
        </div>
        <div className="cp-footer">
          <span className="cp-duration">⏱ {course.duration}</span>
          <span className="cp-level">{course.level}</span>
        </div>
        <button className="cp-btn">اقرأء المزيد</button>
      </div>
    </div>
  );
}

export default function CoursesPage() {
  const { type } = useParams(); // "kids" or "adults"
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(type || "kids");
  const [activeCategory, setActiveCategory] = useState("الكل");

  const courses = activeTab === "kids" ? kidsCoursesData : adultCoursesData;
  const categories = ["الكل", ...new Set(courses.map((c) => c.category))];

  const filtered =
    activeCategory === "الكل"
      ? courses
      : courses.filter((c) => c.category === activeCategory);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setActiveCategory("الكل");
    navigate(`/courses/${tab}`, { replace: true });
  };

  return (
    <div className="courses-page" dir="rtl">
      <div className="cp-hero">
        <button className="cp-back-btn" onClick={() => navigate(-1)}>
          ← رجوع
        </button>
        <h1 className="cp-hero-title">دوراتنا</h1>
        <p className="cp-hero-subtitle">
          تأسست دورات الأكاديمية الإسلامية عبر الإنترنت للأطفال والبالغين
        </p>
      </div>

      {/* Main Tabs */}
      <div className="cp-tabs-wrapper">
        <div className="cp-tabs">
          <button
            className={`cp-tab ${activeTab === "kids" ? "active kids" : ""}`}
            onClick={() => handleTabChange("kids")}
          >
            <span>🧒</span> دورات للأطفال
          </button>
          <button
            className={`cp-tab ${activeTab === "adults" ? "active adults" : ""}`}
            onClick={() => handleTabChange("adults")}
          >
            <span>🎓</span> دورات للكبار
          </button>
        </div>
      </div>

      {/* Category filter */}
      <div className="cp-categories-wrapper">
        <div className="cp-categories">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`cp-cat-btn ${activeCategory === cat ? "active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div className="cp-results-info">
        <span>
          {filtered.length} دورة متاحة
          {activeCategory !== "الكل" && ` في "${activeCategory}"`}
        </span>
      </div>

      {/* Grid */}
      <div className="cp-grid">
        {filtered.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}