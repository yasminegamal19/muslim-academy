import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import styles from "./Register.module.css";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  registerUser,
  clearError,
  clearRegisterSuccess,
} from "../../../store/slices/authSlice";
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

export default function RegisterPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, registerSuccess } = useSelector((s) => s.auth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    birth_date: "",
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
    if (!registerSuccess) return;
    dispatch(clearRegisterSuccess());

    navigate("/verify-otp", {
      state: {
        phone: `+${phoneValue}`,
        email: formData.email.trim(),
      },
    });
  }, [registerSuccess, dispatch, navigate, phoneValue, formData.email]);

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

    toast.error(` ${msg}`, { position: "top-center" });
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

    data.append("governorate_id", "1");
    data.append("country_id", "1");

    if (imageFile) {
      data.append("image", imageFile);
    }

    dispatch(registerUser(data));
  };

  return (
    <div className={styles.register}>
      <div className={styles.RegisterContainer}>
        <div className={styles.RegisterCard}>
          <div className={styles.logoContainer}>
            <img
              src="/logo raw-kemya.jfif"
              alt="Raw-Kemya Logo"
              className={styles.formLogo}
            />
          </div>
          <h2>{t("register.title")}</h2>
          <p className={styles.desc}>{t("register.desc")}</p>

          <form onSubmit={handleSubmit} noValidate>
            <div className={styles.inputGroup}>
              <label htmlFor="name">{t("register.fullName")}</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={t("register.fullNamePlaceholder")}
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
                className={errors.birth_date ? styles.inputError : ""}
              />
            </div>

            <div className="row">
              <div className={`${styles.inputGroup} col-12 col-md-6`}>
                <label htmlFor="email">{t("register.email")}</label>
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
                <label htmlFor="phone">{t("register.phone")}</label>
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
              <label>الصورة الشخصية</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{ width: "50px", marginTop: "10px" }}
                />
              )}
            </div>

            <div className="row">
              <div
                className={`${styles.inputGroup} ${styles.passwordGroup} col-12 col-md-6`}
              >
                <label htmlFor="password">{t("register.password")}</label>
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
                  {t("register.confirmPassword")}
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
              {loading ? " جاري إنشاء الحساب..." : t("register.submit")}
            </button>
          </form>

          <p className={styles.signup}>
            {t("register.haveAccount")}{" "}
            <button
              type="button"
              className={styles.joinNow}
              onClick={() => navigate("/login")}
            >
              {t("register.login")}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
