import { User } from "lucide-react";
import styles from "./StudentCard.module.css";

export default function StudentCard({
  student = {
    name: "أحمد محمد",
    avatar: "",
    fines: 120,
    lastHomework: "مكتمل",
    lastExam: "85%",
    lastReport: "ممتاز",
  },
  mode = "performance",
  onAction = (type, student) => {
    console.log(type, student);
  },
}) {
  return (
    <div className={styles.card}>
      <div className={styles.topRow}>
        <div className={styles.avatarWrapper}>
          {student.avatar ? (
            <img
              src={student.avatar}
              alt={student.name}
              className={styles.avatar}
            />
          ) : (
            <div className={styles.avatarPlaceholder}>
              <User size={20} />
            </div>
          )}
        </div>

        <div className={styles.nameBlock}>
          <span className={styles.label}>الاسم بالكامل</span>
          <span className={styles.name}>{student.name}</span>
        </div>

        {mode === "performance" && student.fines != null && (
          <div className={styles.fineBox}>
            <span className={styles.fineLabel}>الغرامات</span>
            <span className={styles.fineValue}>{student.fines}</span>
          </div>
        )}
      </div>

      <p className={styles.sectionLabel}>متابعة الأداء</p>

      {mode === "performance" ? (
        <div className={styles.actions}>
          <button
            className={`${styles.btn} ${styles.btnExam}`}
            onClick={() => onAction("exam", student)}
          >
            التقييم
          </button>

          <button
            className={`${styles.btn} ${styles.btnHomework}`}
            onClick={() => onAction("homework", student)}
          >
            الواجب
          </button>

          <button
            className={`${styles.btn} ${styles.btnReport}`}
            onClick={() => onAction("report", student)}
          >
            التقرير
          </button>
        </div>
      ) : (
        <div className={styles.followGrid}>
          <div className={styles.followItem}>
            <span className={styles.followKey}>آخر واجب</span>
            <span
              className={`${styles.followVal} ${
                student.lastHomework === "مكتمل" ? styles.green : styles.orange
              }`}
            >
              {student.lastHomework || "—"}
            </span>
          </div>

          <div className={styles.followItem}>
            <span className={styles.followKey}>آخر اختبار</span>
            <span className={styles.followVal}>{student.lastExam || "—"}</span>
          </div>

          <div className={styles.followItem}>
            <span className={styles.followKey}>آخر تقرير</span>
            <span className={styles.followVal}>
              {student.lastReport || "—"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
