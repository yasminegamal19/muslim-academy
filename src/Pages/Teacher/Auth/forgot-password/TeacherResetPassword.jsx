import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import styles from "./TeacherForgotPassword.module.css";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  teacherResetPassword,
  clearError,
  clearForgotState,
} from "../../../../store/slices/authSlice";
import { toast } from "react-toastify";

export default function TeacherResetPassword() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  const { loading, teacherPasswordReset, error } = useSelector((s) => s.auth);

  const [password, setPassword] = useState("");
  const [password_confirmation, setPasswordConfirmation] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    if (!email) {
      toast.error("حدث خطأ، يرجى إعادة محاولة استعادة الحساب");
      navigate("/teacher/forgot-password");
    }
  }, [email, navigate]);

  useEffect(() => {
    if (!teacherPasswordReset) return;
    dispatch(clearForgotState());
    toast.success("تم تغيير كلمة المرور بنجاح!", {
      autoClose: 2000,
      position: "top-center",
    });
    navigate("/success-password");
  }, [teacherPasswordReset, dispatch, navigate]);

  useEffect(() => {
    if (!error) return;
    toast.error(typeof error === "string" ? error : "فشل تغيير كلمة المرور", {
      position: "top-center",
    });
    dispatch(clearError());
  }, [error, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError("");

    if (password.length < 8)
      return setLocalError("كلمة المرور 8 أحرف على الأقل");
    if (password !== password_confirmation)
      return setLocalError("كلمتا المرور غير متطابقتين");

    dispatch(teacherResetPassword({ email, password, password_confirmation }));
  };

  return (
    <div className={styles.ForgotContainer}>
      <div className={styles.ForgotCard}>
        <div className={styles.logoBanner}>
          <img src="/logo muslim.png" alt="logo" className={styles.logo} />
        </div>

        <h2>{t("forgotPassword.resetTitle") || "تعيين كلمة مرور جديدة"}</h2>
        <p className={styles.desc}>
          {t("forgotPassword.resetDesc") || "أدخل كلمة المرور الجديدة لحسابك"}
        </p>

        {localError && <div className={styles.errorBanner}>{localError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className={styles.inputGroup} style={{ position: "relative" }}>
            <label>
              {t("forgotPassword.newPassword") || "كلمة المرور الجديدة"}
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showNew ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setLocalError("");
                }}
                placeholder="••••••••"
                required
                style={{ paddingLeft: "40px" }}
              />
              <span
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  color: "#9ca3af",
                  display: "flex",
                  alignItems: "center",
                }}
                onClick={() => setShowNew(!showNew)}
              >
                {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>
          </div>

          <div className={styles.inputGroup} style={{ position: "relative" }}>
            <label>
              {t("forgotPassword.confirmPassword") || "تأكيد كلمة المرور"}
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showConfirm ? "text" : "password"}
                value={password_confirmation}
                onChange={(e) => {
                  setPasswordConfirmation(e.target.value);
                  setLocalError("");
                }}
                placeholder="••••••••"
                required
                style={{ paddingLeft: "40px" }}
              />
              <span
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  color: "#9ca3af",
                  display: "flex",
                  alignItems: "center",
                }}
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
              ? "جاري الحفظ..."
              : t("forgotPassword.submit") || "حفظ كلمة المرور"}
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
