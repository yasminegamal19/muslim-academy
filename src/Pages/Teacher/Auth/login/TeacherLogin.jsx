import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import styles from "./TeacherLogin.module.css";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  loginTeacher,
  resendTeacherOtp,
  clearError,
  clearOtpState,
} from "../../../../store/slices/authSlice";
import { MdOutlineLanguage } from "react-icons/md";
import { toast } from "react-toastify";

const UNVERIFIED_KEYWORDS = [
  "not verified",
  "unverified",
  "غير مفعل",
  "غير محقق",
  "لم يتم التحقق",
  "account is not verified",
  "email not verified",
];

const isUnverifiedError = (err) => {
  if (!err) return false;
  const msg = typeof err === "string" ? err.toLowerCase() : "";
  return UNVERIFIED_KEYWORDS.some((kw) => msg.includes(kw.toLowerCase()));
};

export default function TeacherLogin() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    loading,
    error,
    isAuthenticated,
    otpLoading,
    teacherApprovalStatus,
    role,
  } = useSelector((s) => s.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [showResendBlock, setShowResendBlock] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || role !== "teacher") return;
    toast.success(t("common.welcome") || "أهلاً بك!", {
      autoClose: 1500,
      position: "top-center",
    });
    navigate(location.state?.from?.pathname || "/teacher/dashboard");
  }, [isAuthenticated, role, navigate, location.state, t]);

  


  useEffect(() => {
    if (!teacherApprovalStatus || teacherApprovalStatus === "approved") return;
    navigate("/teacher/pending-approval", {
      state: { status: teacherApprovalStatus },
    });
  }, [teacherApprovalStatus, navigate]);

  useEffect(() => {
    console.log({
      isAuthenticated,
      teacherApprovalStatus,
      role,
    });
  }, [isAuthenticated, teacherApprovalStatus, role]);


  useEffect(() => {
    if (!error) return;

    if (isUnverifiedError(error)) {
      setShowResendBlock(true);
      dispatch(clearError());
      return;
    }

    setErrors((p) => ({
      ...p,
      password: typeof error === "string" ? error : "بيانات الدخول غير صحيحة",
    }));
    dispatch(clearError());
  }, [error, dispatch]);

  const validate = () => {
    const newErrors = { email: "", password: "" };
    if (!email.trim()) newErrors.email = "البريد الإلكتروني مطلوب";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      newErrors.email = "يرجى إدخال بريد إلكتروني صحيح";
    if (!password.trim()) newErrors.password = "كلمة المرور مطلوبة";
    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowResendBlock(false);
    if (!validate()) return;
    dispatch(loginTeacher({ email: email.trim(), password }));
  };

  const handleResendOtp = async () => {
    if (!email.trim()) {
      setErrors((p) => ({
        ...p,
        email: "أدخل البريد الإلكتروني أولاً لإرسال الكود",
      }));
      return;
    }

    try {
      await dispatch(resendTeacherOtp(email.trim())).unwrap();
      dispatch(clearOtpState());
      toast.success("تم إرسال كود التحقق بنجاح", {
        autoClose: 2000,
        position: "top-center",
      });
      navigate("/teacher/verify-otp", { state: { email: email.trim() } });
    } catch (err) {
      toast.error(
        typeof err === "string" ? err : "فشل إرسال الكود، حاول مرة أخرى",
        { position: "top-center" },
      );
    }
  };

  return (
    <div className={styles.login}>
      <div className={styles.loginContainer}>
        <div className={styles.topBar}>
          <div className="desktop-language-dropdown">
            <button
              className={`btn custom-toggle ${styles.langBtn}`}
              data-bs-toggle="dropdown"
            >
              <MdOutlineLanguage />
              {i18n.language === "ar" ? "اللغة" : "Language"}
            </button>
            <ul className="dropdown-menu">
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => {
                    i18n.changeLanguage("ar");
                    localStorage.setItem("lang", "ar");
                  }}
                >
                  العربية
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => {
                    i18n.changeLanguage("en");
                    localStorage.setItem("lang", "en");
                  }}
                >
                  English
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.loginCard}>
          <div className={styles.logoWrap}>
            <img
              src="/logo muslim.png"
              alt="Muslim Academy"
              className={styles.logo}
            />
          </div>

          <h2>{t("teacherLogin.title") || "تسجيل دخول المعلم"}</h2>
          <p className={styles.desc}>
            {t("teacherLogin.desc") || "أهلاً بك، سجّل دخولك للمتابعة"}
          </p>

          {showResendBlock && (
            <div className={styles.unverifiedBanner}>
              <div className={styles.unverifiedText}>
                <p className={styles.unverifiedTitle}>حسابك غير مفعّل</p>
                <p className={styles.unverifiedSub}>
                  هل تريد إرسال كود تحقق جديد لبريدك الإلكتروني؟
                </p>
              </div>
              <button
                className={styles.resendOtpBtn}
                onClick={handleResendOtp}
                disabled={otpLoading}
                type="button"
              >
                {otpLoading ? "جاري الإرسال..." : "إرسال كود جديد"}
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className={styles.inputGroup}>
              <label htmlFor="email">
                {t("login.email") || "البريد الإلكتروني"}
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setShowResendBlock(false);
                  if (errors.email) setErrors((p) => ({ ...p, email: "" }));
                }}
                placeholder="teacher@example.com"
                className={errors.email ? styles.inputError : ""}
                dir="ltr"
              />
              {errors.email && (
                <span className={styles.fieldError}>{errors.email}</span>
              )}
            </div>

            <div className={`${styles.inputGroup} ${styles.passwordGroup}`}>
              <div className={styles.passwordHeader}>
                <label htmlFor="password">
                  {t("login.password") || "كلمة المرور"}
                </label>
                <button
                  type="button"
                  className={styles.forgotLink}
                  onClick={() => navigate("/teacher/forgot-password")}
                >
                  {t("login.forgot") || "نسيت كلمة المرور؟"}
                </button>
              </div>
              <div className={styles.passwordWrap}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password)
                      setErrors((p) => ({ ...p, password: "" }));
                  }}
                  placeholder="كلمة المرور"
                  className={errors.password ? styles.inputError : ""}
                />
                <span
                  className={styles.togglePassword}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </span>
              </div>
              {errors.password && (
                <span className={styles.fieldError}>{errors.password}</span>
              )}
            </div>

            <button
              type="submit"
              className={`${styles.button} ${styles.buttonLogin}`}
              disabled={loading}
            >
              {loading ? "جاري الدخول..." : t("login.submit") || "تسجيل الدخول"}
            </button>
          </form>

          <p className={styles.signup}>
            {t("login.noAccount") || "ليس لديك حساب؟"}{" "}
            <button
              type="button"
              className={styles.joinNow}
              onClick={() => navigate("/teacher/register")}
            >
              {t("login.signup") || "سجّل الآن"}
            </button>
          </p>

          <p className={styles.switchRole}>
            <button
              type="button"
              className={styles.switchBtn}
              onClick={() => navigate("/select-role")}
            >
              ← {t("roleSelection.back") || "العودة لاختيار الدور"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
