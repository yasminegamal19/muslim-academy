import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./RoleSelection.module.css";

export default function RoleSelection() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logoWrap}>
          <img
            src="/logo muslim.png"
            alt="Muslim Academy"
            className={styles.logo}
          />
        </div>

        <h1 className={styles.title}>
          {t("roleSelection.title") || "مرحباً بك في المنصة"}
        </h1>
        <p className={styles.subtitle}>
          {t("roleSelection.subtitle") || "كيف تريد الانضمام إلينا؟"}
        </p>

        <div className={styles.roles}>
          <button
            className={`${styles.roleCard} ${styles.studentCard}`}
            onClick={() => navigate("/login")}
          >
            <div className={styles.roleIcon}>🎓</div>
            <h2 className={styles.roleTitle}>
              {t("roleSelection.student") || "طالب"}
            </h2>
            <p className={styles.roleDesc}>
              {t("roleSelection.studentDesc") || "انضم كطالب وابدأ رحلة التعلم"}
            </p>
            <span className={styles.roleArrow}>←</span>
          </button>

          <button
            className={`${styles.roleCard} ${styles.teacherCard}`}
            onClick={() => navigate("/teacher/login")}
          >
            <div className={styles.roleIcon}>👨‍🏫</div>
            <h2 className={styles.roleTitle}>
              {t("roleSelection.teacher") || "معلم"}
            </h2>
            <p className={styles.roleDesc}>
              {t("roleSelection.teacherDesc") ||
                "انضم كمعلم وشارك علمك مع الآخرين"}
            </p>
            <span className={styles.roleArrow}>←</span>
          </button>
        </div>
      </div>
    </div>
  );
}
