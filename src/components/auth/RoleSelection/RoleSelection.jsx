import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { GraduationCap, Users } from "lucide-react";
import styles from "./RoleSelection.module.css";

export default function RoleSelection() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const isAr = i18n.language === "ar";

  const handleLanguageChange = () => {
    const newLang = isAr ? "en" : "ar";

    i18n.changeLanguage(newLang);

    localStorage.setItem("lang", newLang);

    document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";

    document.documentElement.lang = newLang;
  };

  return (
    <div className={`${styles.container} ${isAr ? styles.rtl : styles.ltr}`}>
      <div className={styles.langSwitcher}>
        <button className={styles.langBtn} onClick={handleLanguageChange}>
          {isAr ? "English" : "العربية"}
        </button>
      </div>

      <div className={styles.card}>
        <div className={styles.logoWrap}>
          <img
            src="/logo muslim.png"
            alt="Muslim Academy"
            className={styles.logo}
          />

          <h2 className={styles.brandName}>Muslim Academy</h2>
        </div>

        <h1 className={styles.title}>
          {isAr ? "اختر نوع الحساب" : "Choose Account Type"}
        </h1>

        <p className={styles.subtitle}>
          {isAr
            ? "اختر الطريقة التي تريد الدخول بها إلى المنصة"
            : "Select how you want to access the platform"}
        </p>

        <div className={styles.roles}>
          <button
            className={`${styles.roleCard} ${styles.studentCard}`}
            onClick={() => navigate("/login")}
          >
            <div className={styles.roleIcon}>
              <GraduationCap size={30} />
            </div>

            <div className={styles.roleContent}>
              <h2 className={styles.roleTitle}>
                {t("roleSelection.student") || "طالب"}
              </h2>

              <p className={styles.roleDesc}>
                {isAr
                  ? "ابدأ رحلة التعلم وحضور الدورات"
                  : "Start learning and attend courses"}
              </p>
            </div>

            <span className={styles.roleArrow}>{isAr ? "←" : "→"}</span>
          </button>

          <button
            className={`${styles.roleCard} ${styles.teacherCard}`}
            onClick={() => navigate("/teacher/login")}
          >
            <div className={styles.roleIcon}>
              <Users size={30} />
            </div>

            <div className={styles.roleContent}>
              <h2 className={styles.roleTitle}>
                {t("roleSelection.teacher") || "معلم"}
              </h2>

              <p className={styles.roleDesc}>
                {isAr
                  ? "إدارة الجلسات والطلاب ومتابعة الدورات"
                  : "Manage sessions and students"}
              </p>
            </div>

            <span className={styles.roleArrow}>{isAr ? "←" : "→"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
