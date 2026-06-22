import { useState } from "react";
import styles from "./RegistrationForm.module.css";

const COUNTRY_CODES = [
  { code: "EG", flag: "🇪🇬", dial: "+20" },
  { code: "SA", flag: "🇸🇦", dial: "+966" },
  { code: "AE", flag: "🇦🇪", dial: "+971" },
  { code: "KW", flag: "🇰🇼", dial: "+965" },
  { code: "QA", flag: "🇶🇦", dial: "+974" },
  { code: "US", flag: "🇺🇸", dial: "+1" },
];

const SOURCES = [
  "سوشيال ميديا",
  "صديق أو معارف",
  "محرك البحث",
  "إعلان",
  "أخرى",
];

export default function RegistrationForm({ course, onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    country: "EG",
    source: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "الاسم مطلوب";
    if (!form.email.includes("@")) e.email = "بريد إلكتروني غير صالح";
    if (!form.phone.trim()) e.phone = "رقم الهاتف مطلوب";
    if (!form.source) e.source = "اختر كيف عرفتنا";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    onSuccess();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        dir="rtl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="إغلاق"
        >
          ✕
        </button>

        <div className={styles.formHeader}>
          <span className={styles.badge}>تجربة مجانية</span>
          <h2>ابدأ رحلتك التعليمية</h2>
          <p>
            احجز درساً تجريبياً مجانياً في{" "}
            <strong>{course?.category || "دوراتنا"}</strong>
          </p>
        </div>

        <div className={styles.formBody}>
          <div className={styles.field}>
            <label>اسم الطالب</label>
            <input
              className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
              type="text"
              placeholder="أدخل اسمك الكامل"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
            />
            {errors.name && (
              <span className={styles.errorMsg}>{errors.name}</span>
            )}
          </div>

          <div className={styles.field}>
            <label>البريد الإلكتروني</label>
            <input
              className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
              type="email"
              placeholder="example@gmail.com"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
            />
            {errors.email && (
              <span className={styles.errorMsg}>{errors.email}</span>
            )}
          </div>

          <div className={styles.field}>
            <label>رقم الهاتف</label>
            <div className={styles.phoneRow}>
              <select
                className={`${styles.select} ${styles.countrySelect}`}
                value={form.country}
                onChange={(e) => set("country", e.target.value)}
              >
                {COUNTRY_CODES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.dial}
                  </option>
                ))}
              </select>
              <input
                className={`${styles.input} ${errors.phone ? styles.inputError : ""}`}
                type="tel"
                placeholder="أدخل رقم الهاتف"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
              />
            </div>
            {errors.phone && (
              <span className={styles.errorMsg}>{errors.phone}</span>
            )}
          </div>

          <div className={styles.field}>
            <label>من أين عرفت مسلم أكاديمي؟</label>
            <select
              className={`${styles.select} ${errors.source ? styles.inputError : ""}`}
              value={form.source}
              onChange={(e) => set("source", e.target.value)}
            >
              <option value="">اختر...</option>
              {SOURCES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            {errors.source && (
              <span className={styles.errorMsg}>{errors.source}</span>
            )}
          </div>
        </div>

        <div className={styles.formFooter}>
          <button
            className={styles.submitBtn}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <span className={styles.spinner} />
            ) : (
              "تأكيد التسجيل والمتابعة"
            )}
          </button>
          <p className={styles.termsNote}>
            بالتسجيل توافق على{" "}
            <a href="/terms" target="_blank" rel="noopener noreferrer">
              الشروط والأحكام
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
