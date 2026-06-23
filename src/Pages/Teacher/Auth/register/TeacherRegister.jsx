import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import styles from "./TeacherRegister.module.css";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  registerTeacher,
  clearError,
  clearRegisterSuccess,
} from "../../../../store/slices/authSlice";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { toast } from "react-toastify";

const EMAIL_EXISTS_KEYWORDS = [
  "already",
  "taken",
  "exists",
  "موجود",
  "مسجل",
  "duplicate",
  "registered",
];

const isEmailExistsError = (err) => {
  if (!err) return false;
  const msg =
    typeof err === "string"
      ? err
      : typeof err === "object"
        ? Object.values(err).flat().join(" ")
        : "";
  return EMAIL_EXISTS_KEYWORDS.some((kw) =>
    msg.toLowerCase().includes(kw.toLowerCase()),
  );
};

export default function TeacherRegister() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, teacherRegisterSuccess } = useSelector((s) => s.auth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    birth_date: "",
    timezone: "UTC",
  });

  const [phoneValue, setPhoneValue] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
  });

  useEffect(() => {
    if (!teacherRegisterSuccess) return;
    dispatch(clearRegisterSuccess());
    navigate("/teacher/verify-otp", {
      state: {
        email: formData.email.trim(),
        phone: `+${phoneValue}`,
      },
    });
  }, [teacherRegisterSuccess, dispatch, navigate, formData.email, phoneValue]);

  useEffect(() => {
    if (!error) return;

    if (isEmailExistsError(error)) {
      setErrors((p) => ({
        ...p,
        email: "هذا البريد الإلكتروني مسجّل بالفعل، جرب بريدًا آخر",
      }));
      dispatch(clearError());
      return;
    }

    const msg =
      typeof error === "string"
        ? error
        : typeof error === "object"
          ? Object.values(error).flat().join(" | ")
          : "حدث خطأ غير متوقع";

    toast.error(msg, { position: "top-center" });
    dispatch(clearError());
  }, [error, dispatch]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name])
      setErrors((p) => ({ ...p, [e.target.name]: "" }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const validate = () => {
    const newErrors = {
      name: "",
      email: "",
      phone: "",
      password: "",
      password_confirmation: "",
    };
    if (!formData.name.trim()) newErrors.name = "الاسم مطلوب";
    if (!formData.email.trim()) newErrors.email = "البريد الإلكتروني مطلوب";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim()))
      newErrors.email = "يرجى إدخال بريد إلكتروني صحيح";
    if (!phoneValue) newErrors.phone = "رقم الهاتف مطلوب";
    if (formData.password.length < 8)
      newErrors.password = "كلمة المرور 8 أحرف على الأقل";
    if (formData.password !== formData.password_confirmation)
      newErrors.password_confirmation = "كلمتا المرور غير متطابقتين";

    setErrors(newErrors);
    return Object.values(newErrors).every((v) => v === "");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const data = new FormData();
    data.append("name", formData.name.trim());
    data.append("email", formData.email.trim());
    data.append("password", formData.password);
    data.append("password_confirmation", formData.password_confirmation);
    data.append("birth_date", formData.birth_date);
    data.append("phone", `+${phoneValue}`);
    data.append("timezone", formData.timezone || "UTC");
    data.append("country_id", "1");
    data.append("governorate_id", "1");

    if (imageFile) {
      data.append("image", imageFile);
    }

    dispatch(registerTeacher(data));
  };

  return (
    <div className={styles.register}>
      <div className={styles.RegisterContainer}>
        <div className={styles.RegisterCard}>
          <div className={styles.logoContainer}>
            <img
              src="/logo muslim.png"
              alt="Muslim Academy Logo"
              className={styles.formLogo}
            />
          </div>

          <h2>{t("teacherRegister.title") || "إنشاء حساب معلم"}</h2>
          <p className={styles.desc}>
            {t("teacherRegister.desc") ||
              "انضم إلى منصتنا كمعلم وشارك علمك مع الآخرين"}
          </p>

          <form onSubmit={handleSubmit} noValidate>

            <div className={styles.inputGroup}>
              <label htmlFor="name">
                {t("register.fullName") || "الاسم الكامل"}
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={t("register.fullNamePlaceholder") || "اسمك الكامل"}
                className={errors.name ? styles.inputError : ""}
              />
              {errors.name && (
                <span className={styles.fieldError}>{errors.name}</span>
              )}
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="birth_date">
                {t("register.birthDate") || "تاريخ الميلاد"}
              </label>
              <input
                type="date"
                id="birth_date"
                name="birth_date"
                value={formData.birth_date}
                onChange={handleChange}
              />
            </div>

            <div className="row">
              <div className={`${styles.inputGroup} col-12 col-md-6`}>
                <label htmlFor="email">
                  {t("register.email") || "البريد الإلكتروني"}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? styles.inputError : ""}
                />
                {errors.email && (
                  <span className={styles.fieldError}>{errors.email}</span>
                )}
              </div>

              <div className={`${styles.inputGroup} col-12 col-md-6`}>
                <label>{t("register.phone") || "رقم الهاتف"}</label>
                <div className={errors.phone ? styles.phoneError : ""}>
                  <PhoneInput
                    country={"sa"}
                    value={phoneValue}
                    onChange={(phone) => {
                      setPhoneValue(phone);
                      if (errors.phone) setErrors((p) => ({ ...p, phone: "" }));
                    }}
                    enableSearch={true}
                    disableSearchIcon={true}
                    containerClass={styles.phoneContainer}
                    inputClass="form-control"
                  />
                </div>
                {errors.phone && (
                  <span className={styles.fieldError}>{errors.phone}</span>
                )}
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="timezone">
                {t("teacherRegister.timezone") || "المنطقة الزمنية"}
              </label>
              <select
                id="timezone"
                name="timezone"
                value={formData.timezone}
                onChange={handleChange}
                className={styles.select}
              >
                <option value="UTC">UTC (التوقيت العالمي)</option>
                <option value="Asia/Riyadh">Asia/Riyadh (السعودية)</option>
                <option value="Africa/Cairo">Africa/Cairo (مصر)</option>
                <option value="Asia/Dubai">Asia/Dubai (الإمارات)</option>
                <option value="Asia/Kuwait">Asia/Kuwait (الكويت)</option>
                <option value="Asia/Baghdad">Asia/Baghdad (العراق)</option>
                <option value="Africa/Casablanca">
                  Africa/Casablanca (المغرب)
                </option>
                <option value="Europe/London">Europe/London</option>
                <option value="America/New_York">America/New_York</option>
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label>{t("register.profileImage") || "الصورة الشخصية"}</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className={styles.fileInput}
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className={styles.imagePreview}
                />
              )}
            </div>

            <div className="row">
              <div
                className={`${styles.inputGroup} ${styles.passwordGroup} col-12 col-md-6`}
              >
                <label htmlFor="password">
                  {t("register.password") || "كلمة المرور"}
                </label>
                <div className={styles.passwordWrap}>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={errors.password ? styles.inputError : ""}
                  />
                  <span
                    className={styles.togglePassword}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </span>
                </div>
                {errors.password && (
                  <span className={styles.fieldError}>{errors.password}</span>
                )}
              </div>

              <div
                className={`${styles.inputGroup} ${styles.passwordGroup} col-12 col-md-6`}
              >
                <label htmlFor="confirmPassword">
                  {t("register.confirmPassword") || "تأكيد كلمة المرور"}
                </label>
                <div className={styles.passwordWrap}>
                  <input
                    type={showConfirm ? "text" : "password"}
                    id="confirmPassword"
                    name="password_confirmation"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    className={
                      errors.password_confirmation ? styles.inputError : ""
                    }
                  />
                  <span
                    className={styles.togglePassword}
                    onClick={() => setShowConfirm(!showConfirm)}
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </span>
                </div>
                {errors.password_confirmation && (
                  <span className={styles.fieldError}>
                    {errors.password_confirmation}
                  </span>
                )}
              </div>
            </div>

            <button
              type="submit"
              className={`${styles.button} ${styles.buttonRegister}`}
              disabled={loading}
            >
              {loading
                ? "جاري إنشاء الحساب..."
                : t("teacherRegister.submit") || "إنشاء حساب معلم"}
            </button>
          </form>

          <p className={styles.signup}>
            {t("register.haveAccount") || "لديك حساب بالفعل؟"}{" "}
            <button
              type="button"
              className={styles.joinNow}
              onClick={() => navigate("/teacher/login")}
            >
              {t("register.login") || "تسجيل الدخول"}
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
