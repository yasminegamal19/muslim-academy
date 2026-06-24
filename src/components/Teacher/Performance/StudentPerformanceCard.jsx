import styles from "./StudentPerformanceCard.module.css";

const COLORS = ["purple", "teal", "coral", "pink"];

const BG_MAP = {
  purple: "#EEEDFE",
  teal: "#E1F5EE",
  coral: "#FAECE7",
  pink: "#FBEAF0",
};
const TEXT_MAP = {
  purple: "#534AB7",
  teal: "#0F6E56",
  coral: "#993C1D",
  pink: "#993556",
};

function getInitials(name = "") {
  return name
    .trim()
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function StudentPerformanceCard({
  student,
  index,
  onQuiz,
  onHomework,
  onReport,
}) {
  const color = COLORS[index % COLORS.length];
  const bg = BG_MAP[color];
  const tc = TEXT_MAP[color];
  const initials = getInitials(student.name);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.avatar} style={{ background: bg, color: tc }}>
          {student.image ? (
            <img
              src={student.image}
              alt={student.name}
              className={styles.avatarImg}
            />
          ) : (
            initials
          )}
        </div>
        <div className={styles.info}>
          <p className={styles.name}>{student.name}</p>
          <p className={styles.email}>{student.email}</p>
        </div>
      </div>

      <div className={styles.actions}>
        <button
          className={`${styles.btn} ${styles.quizBtn}`}
          onClick={() => onQuiz(student)}
        >
          <i className="bi bi-question-circle" aria-hidden="true" />
          الاختبار
        </button>
        <button
          className={`${styles.btn} ${styles.hwBtn}`}
          onClick={() => onHomework(student)}
        >
          <i className="bi bi-clipboard-check" aria-hidden="true" />
          الواجب
        </button>
        <button
          className={`${styles.btn} ${styles.reportBtn}`}
          onClick={() => onReport(student)}
        >
          <i className="bi bi-file-earmark-text" aria-hidden="true" />
          التقرير
        </button>
      </div>
    </div>
  );
}
