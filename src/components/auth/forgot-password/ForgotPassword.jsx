import { useState, useEffect } from "react";
import styles from "./ForgotPassword.module.css";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  forgotPassword,
  clearError,
  clearForgotState,
} from "../../../store/slices/authSlice";
import { toast } from "react-toastify";

export default function ForgotPassword() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { otpLoading, forgotOtpSent, error } = useSelector((s) => s.auth);

  // تعديل: استخدام email بدل phone
  const [email, setEmail] = useState("");
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    if (!forgotOtpSent) return;

    dispatch(clearForgotState());
    toast.success("تم إرسال كود التحقق على بريدك الإلكتروني!", {
      autoClose: 2000,
      position: "top-center",
    });

    // تعديل: تمرير الـ email لصفحة التحقق
    navigate("/forgot-verify-otp", { state: { email: email.trim() } });
  }, [forgotOtpSent, dispatch, navigate, email]);

  useEffect(() => {
    if (!error) return;
    toast.error(
      `${typeof error === "string" ? error : "البريد الإلكتروني غير مسجل"}`,
      { position: "top-center" },
    );
    dispatch(clearError());
  }, [error, dispatch]);

  const validate = () => {
    if (!email.trim()) {
      setLocalError("البريد الإلكتروني مطلوب");
      return false;
    }
    // تحقق بسيط من صيغة الإيميل
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setLocalError("يرجى إدخال بريد إلكتروني صحيح");
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError("");

    if (!validate()) return;

    // إرسال الإيميل للـ API
    dispatch(forgotPassword(email.trim()));
  };

  return (
    <div className={styles.ForgotContainer}>
      <div className={styles.ForgotCard}>
        {/* تأكد من مسار اللوجو الصحيح */}
        <img src="/logo raw-kemya.jfif" alt="logo" className={styles.logo} />

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
              placeholder="example@mail.com"
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
          onClick={() => navigate("/login")}
        >
          ← {t("forgotPassword.backToLogin") || "العودة لتسجيل الدخول"}
        </button>
      </div>
    </div>
  );
}
