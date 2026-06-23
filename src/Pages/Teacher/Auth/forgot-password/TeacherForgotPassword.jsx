import { useState, useEffect } from "react";
import styles from "./TeacherForgotPassword.module.css";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  teacherForgotPassword,
  clearError,
  clearForgotState,
} from "../../../../store/slices/authSlice";
import { toast } from "react-toastify";

export default function TeacherForgotPassword() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { otpLoading, teacherForgotOtpSent, error } = useSelector(
    (s) => s.auth,
  );

  const [email, setEmail] = useState("");
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    if (!teacherForgotOtpSent) return;
    dispatch(clearForgotState());
    toast.success("تم إرسال كود التحقق على بريدك الإلكتروني!", {
      autoClose: 2000,
      position: "top-center",
    });
    navigate("/teacher/forgot-verify-otp", { state: { email: email.trim() } });
  }, [teacherForgotOtpSent, dispatch, navigate, email]);

  useEffect(() => {
    if (!error) return;
    toast.error(
      typeof error === "string" ? error : "البريد الإلكتروني غير مسجل",
      { position: "top-center" },
    );
    dispatch(clearError());
  }, [error, dispatch]);

  const validate = () => {
    if (!email.trim()) {
      setLocalError("البريد الإلكتروني مطلوب");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setLocalError("يرجى إدخال بريد إلكتروني صحيح");
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError("");
    if (!validate()) return;
    dispatch(teacherForgotPassword(email.trim()));
  };

  return (
    <div className={styles.ForgotContainer}>
      <div className={styles.ForgotCard}>
        <div className={styles.logoBanner}>
          <img
            src="/logo muslim.png"
            alt="Muslim logo"
            className={styles.logo}
          />
        </div>

        <h2>{t("forgotPassword.title") || "استعادة كلمة المرور"}</h2>
        <p className={styles.desc}>
          {t("forgotPassword.desc") ||
            "أدخل بريدك الإلكتروني لإرسال كود التحقق"}
        </p>

        {localError && <div className={styles.errorBanner}>{localError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className={styles.inputGroup}>
            <label htmlFor="email">
              {t("forgotPassword.email") || "البريد الإلكتروني"}
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (localError) setLocalError("");
              }}
              placeholder="teacher@example.com"
              dir="ltr"
            />
          </div>

          <button
            type="submit"
            className={`${styles.button} ${styles.buttonForgot}`}
            disabled={otpLoading}
          >
            {otpLoading
              ? "جاري الإرسال..."
              : t("forgotPassword.sendCode") || "إرسال كود التحقق"}
          </button>
        </form>

        <button
          type="button"
          className={styles.backLink}
          onClick={() => navigate("/teacher/login")}
        >
          ← {t("forgotPassword.backToLogin") || "العودة لتسجيل الدخول"}
        </button>
      </div>
    </div>
  );
}
