import { Star, Users } from "lucide-react";
import styles from "./CourseCard.module.css";

export function CourseCard({ course, index, onSelect }) {
  return (
    <div
      className={styles.card}
      style={{ animationDelay: `${(index || 0) * 80}ms` }}
    >
      <div className={styles.imgWrap}>
        <img src={course.image} alt={course.title} className={styles.img} />
        <div className={styles.imgOverlay} />
        {course.tag && <span className={styles.tag}>{course.tag}</span>}
        <span className={styles.category}>{course.category}</span>
      </div>

      <div className={styles.body}>
        <h3 className={styles.title}>{course.title}</h3>

        <div className={styles.meta}>
          <span className={styles.metaItem}>
            <Star size={12} fill="#f5c518" stroke="#f5c518" />
            {course.rating}
          </span>
          <span className={styles.metaItem}>
            <Users size={12} />
            {course.students.toLocaleString("ar-EG")} طالب
          </span>
        </div>

        <div className={styles.footer}>
          <span className={styles.price}>{course.price}</span>
          <button className={styles.btn} onClick={onSelect}>
            اقرأ المزيد
          </button>
        </div>
      </div>
    </div>
  );
}
