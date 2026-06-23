import styles from "./TeacherDashboard.module.css";

export default function TeacherDashboard() {
  return (
    <div className={styles.dashboard}>
      <div className={styles.container}>
        <h1>لوحة تحكم المعلم</h1>

        <div className={styles.cards}>
          <div className={styles.card}>
            <h3>إجمالي الطلاب</h3>
            <span>120</span>
          </div>

          <div className={styles.card}>
            <h3>الجلسات القادمة</h3>
            <span>8</span>
          </div>

          <div className={styles.card}>
            <h3>الدورات</h3>
            <span>15</span>
          </div>

          <div className={styles.card}>
            <h3>التقييمات</h3>
            <span>4.9 ⭐</span>
          </div>
        </div>

        <div className={styles.section}>
          <h2>آخر النشاطات</h2>

          <div className={styles.activity}>تم حجز جلسة جديدة</div>

          <div className={styles.activity}>تم إضافة طالب جديد</div>

          <div className={styles.activity}>تم رفع محتوى جديد</div>
        </div>
      </div>
    </div>
  );
}
