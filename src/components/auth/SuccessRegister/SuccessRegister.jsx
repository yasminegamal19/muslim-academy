import styles from "./SuccessRegister.module.css";
import { CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../../store/slices/authSlice";

export default function SuccessRegister() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleGoToLogin = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className={styles.success}>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.iconBox}>
            <CheckCircle size={60} />
          </div>

          <h2 className={styles.title}>{t("successRegister.title")}</h2>

          <p className={styles.subtitle}>{t("successRegister.subtitle")}</p>

          <button className={styles.button} onClick={handleGoToLogin}>
            {t("successRegister.button")}
          </button>

          <p className={styles.footer}>{t("successRegister.footer")}</p>
        </div>
      </div>
    </div>
  );
}
