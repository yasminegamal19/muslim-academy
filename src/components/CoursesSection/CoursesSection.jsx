import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { kidsCoursesData, adultCoursesData } from "../../components/data/CourseData";
import "./CoursesSection.css";

const PREVIEW_COUNT = 6;

function CourseCard({ course }) {
  const navigate = useNavigate();

  return (
    <div
      className="course-card"
      onClick={() => navigate(`/courses/${course.id}`)}
    >
      <div className="course-card-img-wrapper">
        <img
          src={course.image}
          alt={course.title}
          className="course-card-img"
        />
        {course.badge && <span className="course-badge">{course.badge}</span>}
      </div>
      <div className="course-card-body">
        <span className="course-category">{course.category}</span>
        <h3 className="course-title">{course.title}</h3>
        <p className="course-subtitle">{course.subtitle}</p>
        <div className="course-meta">
          <img
            src={course.instructorImage}
            alt={course.instructor}
            className="course-instructor-avatar"
          />
          <span className="course-instructor-name">{course.instructor}</span>
          <span className="course-rating">
            ⭐ {course.rating}
            <span className="course-students"> ({course.students})</span>
          </span>
        </div>
        <div className="course-footer">
          <span className="course-duration">⏱ {course.duration}</span>
          <span className="course-level">{course.level}</span>
        </div>
      </div>
    </div>
  );
}

export default function CoursesSection() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const isRTL = i18n.language !== "en";

  return (
    <section className="courses-section" dir={isRTL ? "rtl" : "ltr"}>
      <div className="courses-section-header">
        <h2 className="courses-section-title">دوراتنا</h2>
        <p className="courses-section-subtitle">
          تأسست دورات الأكاديمية الإسلامية عبر الإنترنت للأطفال والبالغين
        </p>
      </div>
      <div className="courses-group">
        <div className="courses-group-header">
          <div className="courses-group-label kids">
            <span className="label-icon"></span>
            <span>KIDS COURSES</span>
          </div>
          <div className="courses-group-info">
            <h3>دورات للأطفال</h3>
            <p>
              اللغة العربية - القرآن - التجويد
              <br />
              الدراسات الإسلامية ودورة خاصة
            </p>
          </div>
        </div>

        <div className="courses-grid">
          {kidsCoursesData.slice(0, PREVIEW_COUNT).map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

        <div className="courses-show-more">
          <button
            className="btn-show-more kids"
            onClick={() => navigate("/courses/kids")}
          >
            اقرأء المزيد
          </button>
        </div>
      </div>

      <div className="courses-group">
        <div className="courses-group-header">
          <div className="courses-group-label adults">
            <span className="label-icon"></span>
            <span>ADULTS COURSES</span>
          </div>
          <div className="courses-group-info">
            <h3>دورات للكبار</h3>
            <p>
              القرآن والتجويد - اللغة العربية
              <br />
              الدراسات الإسلامية - دورة للنساء
            </p>
          </div>
        </div>

        <div className="courses-grid">
          {adultCoursesData.slice(0, PREVIEW_COUNT).map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

        <div className="courses-show-more">
          <button
            className="btn-show-more adults"
            onClick={() => navigate("/courses/adults")}
          >
            اقرأء المزيد
          </button>
        </div>
      </div>
    </section>
  );
}
