import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { CourseCard } from "./CourseCard";
import styles from "./CourseSection.module.css";

export function CoursesSection({ kidsCourses, adultsCourses, onSelectCourse }) {
  const [activeTab, setActiveTab] = useState("kids");
  const courses = activeTab === "kids" ? kidsCourses : adultsCourses;

  return (
    <section className={styles.courses}>
      <div className={styles.sectionHead}>
        <div>
          <p className={styles.eyebrow}>ما نقدّمه لك</p>
          <h2 className={styles.sectionTitle}>دوراتنا</h2>
          <p className={styles.sectionDesc}>
            تناسب أكاديمية Muslim Academy عبر الإنترنت الأطفال والبالغين
          </p>
        </div>
        <a href="/courses" className={styles.sectionLink}>
          عرض كل الدورات <ArrowLeft size={15} />
        </a>
      </div>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === "kids" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("kids")}
        >
          دورات للأطفال 🧒
        </button>
        <button
          className={`${styles.tab} ${activeTab === "adults" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("adults")}
        >
          دورات للكبار 👨‍🏫
        </button>
      </div>

      <div className={styles.coursesGrid}>
        {courses.map((course, i) => (
          <CourseCard
            key={course.id}
            course={course}
            index={i}
            onSelect={() => onSelectCourse(course)}
          />
        ))}
      </div>
    </section>
  );
}
