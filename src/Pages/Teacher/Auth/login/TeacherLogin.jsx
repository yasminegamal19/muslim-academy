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
    toast.success(
      t("common.welcome") ||
        (i18n.language === "ar" ? "أهلاً بك!" : "Welcome!"),
      {
        autoClose: 1500,
        position: "top-center",
      },
    );
    navigate(location.state?.from?.pathname || "/teacher/dashboard");
  }, [isAuthenticated, role, navigate, location.state, t, i18n.language]);

  useEffect(() => {
    if (!teacherApprovalStatus || teacherApprovalStatus === "approved") return;
    navigate("/teacher/pending-approval", {
      state: { status: teacherApprovalStatus },
    });
  }, [teacherApprovalStatus, navigate]);

  useEffect(() => {
    if (!error) return;

    if (isUnverifiedError(error)) {
      setShowResendBlock(true);
      dispatch(clearError());
      return;
    }

    setErrors((p) => ({
      ...p,
      password:
        typeof error === "string"
          ? error
          : i18n.language === "ar"
            ? "بيانات الدخول غير صحيحة"
            : "Invalid login credentials",
    }));
    dispatch(clearError());
  }, [error, dispatch, i18n.language]);

  const validate = () => {
    const newErrors = { email: "", password: "" };
    if (!email.trim()) {
      newErrors.email =
        t("teacherLogin.errors.emailRequired") ||
        (i18n.language === "ar"
          ? "البريد الإلكتروني مطلوب"
          : "Email is required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email =
        t("teacherLogin.errors.emailInvalid") ||
        (i18n.language === "ar"
          ? "يرجى إدخال بريد إلكتروني صحيح"
          : "Please enter a valid email");
    }

    if (!password.trim()) {
      newErrors.password =
        t("teacherLogin.errors.passwordRequired") ||
        (i18n.language === "ar"
          ? "كلمة المرور مطلوبة"
          : "Password is required");
    }

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
        email:
          i18n.language === "ar"
            ? "أدخل البريد الإلكتروني أولاً لإرسال الكود"
            : "Enter email first to send the code",
      }));
      return;
    }

    try {
      await dispatch(resendTeacherOtp(email.trim())).unwrap();
      dispatch(clearOtpState());
      toast.success(
        i18n.language === "ar"
          ? "تم إرسال كود التحقق بنجاح"
          : "Verification code sent successfully",
        {
          autoClose: 2000,
          position: "top-center",
        },
      );
      navigate("/teacher/verify-otp", { state: { email: email.trim() } });
    } catch (err) {
      toast.error(
        typeof err === "string"
          ? err
          : i18n.language === "ar"
            ? "فشل إرسال الكود، حاول مرة أخرى"
            : "Failed to send code, try again",
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

          <h2>
            {t("teacherLogin.title") ||
              (i18n.language === "ar" ? "تسجيل دخول المعلم" : "Teacher Login")}
          </h2>
          <p className={styles.desc}>
            {t("teacherLogin.desc") ||
              (i18n.language === "ar"
                ? "أهلاً بك، سجّل دخولك للمتابعة"
                : "Welcome back, please login to continue")}
          </p>

          {showResendBlock && (
            <div className={styles.unverifiedBanner}>
              <div className={styles.unverifiedText}>
                <p className={styles.unverifiedTitle}>
                  {i18n.language === "ar"
                    ? "حسابك غير مفعّل"
                    : "Your account is not verified"}
                </p>
                <p className={styles.unverifiedSub}>
                  {i18n.language === "ar"
                    ? "هل تريد إرسال كود تحقق جديد لبريدك الإلكتروني؟"
                    : "Do you want to send a new verification code to your email?"}
                </p>
              </div>
              <button
                className={styles.resendOtpBtn}
                onClick={handleResendOtp}
                disabled={otpLoading}
                type="button"
              >
                {otpLoading
                  ? i18n.language === "ar"
                    ? "جاري الإرسال..."
                    : "Sending..."
                  : i18n.language === "ar"
                    ? "إرسال كود جديد"
                    : "Resend Code"}
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className={styles.inputGroup}>
              <label htmlFor="email">
                {t("login.email") ||
                  (i18n.language === "ar"
                    ? "البريد الإلكتروني"
                    : "Email Address")}
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
                  {t("login.password") ||
                    (i18n.language === "ar" ? "كلمة المرور" : "Password")}
                </label>
                <button
                  type="button"
                  className={styles.forgotLink}
                  onClick={() => navigate("/teacher/forgot-password")}
                >
                  {t("login.forgot") ||
                    (i18n.language === "ar"
                      ? "نسيت كلمة المرور؟"
                      : "Forgot Password?")}
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
                  placeholder={
                    i18n.language === "ar" ? "كلمة المرور" : "Password"
                  }
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
              {loading
                ? i18n.language === "ar"
                  ? "جاري الدخول..."
                  : "Logging in..."
                : t("login.submit") ||
                  (i18n.language === "ar" ? "تسجيل الدخول" : "Login")}
            </button>
          </form>

          <p className={styles.signup}>
            {t("login.noAccount") ||
              (i18n.language === "ar"
                ? "ليس لديك حساب؟"
                : "Don't have an account?")}{" "}
            <button
              type="button"
              className={styles.joinNow}
              onClick={() => navigate("/teacher/register")}
            >
              {t("login.signup") ||
                (i18n.language === "ar" ? "سجّل الآن" : "Join Now")}
            </button>
          </p>

          <p className={styles.switchRole}>
            <button
              type="button"
              className={styles.switchBtn}
              onClick={() => navigate("/select-role")}
            >
              {i18n.language === "ar"
                ? `← ${t("roleSelection.back") || "العودة لاختيار الدور"}`
                : `${t("roleSelection.back") || "Back to role selection"} →`}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
