import styles from "./Success.module.css";
import { ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
export default function SuccessPassword() {
  const { t } = useTranslation();
  
  const navigate = useNavigate();
  return (
    <div className={styles.container}>
      <div className={styles.brand}>
        <img src="/os-logo.png" alt="logo" />
        <h5>The Kinetic Oracle</h5>
      </div>

      <div className={styles.card}>
        <div className={styles.iconBox}>
          <ShieldCheck size={38} />
        </div>

        <h2 className={styles.title}>{t("successPassword.title")}</h2>

        <p className={styles.desc}>{t("successPassword.desc")}</p>

        <button className={styles.button} onClick={() => navigate("/login")}>
          {t("successPassword.button")}
        </button>
      </div>

      <div className={styles.footer}>
        <p>{t("successPassword.footerLang")}</p>
        <span>{t("successPassword.footerVersion")}</span>
      </div>
    </div>
  );
}
