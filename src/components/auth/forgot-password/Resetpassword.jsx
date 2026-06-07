import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import styles from "./ForgotPassword.module.css";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  resetPassword,
  clearError,
  clearForgotState,
} from "../../../store/slices/authSlice";
import { toast } from "react-toastify";

export default function ResetPassword() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // تعديل: استقبال الـ email القادم من صفحة التحقق السابقة بدل الـ phone
  const email = location.state?.email || "";

  const { loading, passwordReset, error } = useSelector((s) => s.auth);

  const [password, setPassword] = useState("");
  const [password_confirmation, setPasswordConfirmation] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    if (!email) {
      console.warn(
        "[ResetPassword] email not found in location.state — redirecting",
      );
      toast.error("حدث خطأ، يرجى إعادة محاولة استعادة الحساب");
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  useEffect(() => {
    if (!passwordReset) return;
    dispatch(clearForgotState());
    toast.success("تم تغيير كلمة المرور بنجاح!", {
      autoClose: 2000,
      position: "top-center",
    });
    navigate("/success-password");
  }, [passwordReset, dispatch, navigate]);

  useEffect(() => {
    if (!error) return;
    toast.error(
      ` ${typeof error === "string" ? error : "فشل تغيير كلمة المرور"}`,
      { position: "top-center" },
    );
    dispatch(clearError());
  }, [error, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError("");

    if (password.length < 8)
      return setLocalError("كلمة المرور 8 أحرف على الأقل");
    if (password !== password_confirmation)
      return setLocalError("كلمتا المرور غير متطابقتين");

    // تعديل: إرسال الـ email مع كلمة المرور الجديدة وتأكيدها للـ API
    dispatch(resetPassword({ email, password, password_confirmation }));
  };

  return (
    <div className={styles.ForgotContainer}>
      <div className={styles.ForgotCard}>
        {/* تحديث مسار اللوجو الجديد للمشروع */}
        <img src="/logo raw-kemya.jfif" alt="logo" className={styles.logo} />

        <h2>{t("forgotPassword.resetTitle") || "تعيين كلمة مرور جديدة"}</h2>
        <p className={styles.desc}>
          {t("forgotPassword.resetDesc") || "أدخل كلمة المرور الجديدة لحسابك"}
        </p>

        {localError && <div className={styles.errorBanner}> {localError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className={`${styles.inputGroup} ${styles.passwordGroup}`}>
            <label>
              {t("forgotPassword.newPassword") || "كلمة المرور الجديدة"}
            </label>
            <div className={styles.passwordWrap}>
              <input
                type={showNew ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setLocalError("");
                }}
                placeholder={
                  t("forgotPassword.newPasswordPlaceholder") || "••••••••"
                }
                required
              />
              <span
                className={styles.togglePassword}
                onClick={() => setShowNew(!showNew)}
              >
                {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>
          </div>

          <div className={`${styles.inputGroup} ${styles.passwordGroup}`}>
            <label>
              {t("forgotPassword.confirmPassword") || "تأكيد كلمة المرور"}
            </label>
            <div className={styles.passwordWrap}>
              <input
                type={showConfirm ? "text" : "password"}
                value={password_confirmation}
                onChange={(e) => {
                  setPasswordConfirmation(e.target.value);
                  setLocalError("");
                }}
                placeholder={
                  t("forgotPassword.confirmPasswordPlaceholder") || "••••••••"
                }
                required
              />
              <span
                className={styles.togglePassword}
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>
          </div>

          <button
            type="submit"
            className={`${styles.button} ${styles.buttonForgot}`}
            disabled={loading}
          >
            {loading
              ? " جاري الحفظ..."
              : t("forgotPassword.submit") || "حفظ كلمة المرور"}
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
