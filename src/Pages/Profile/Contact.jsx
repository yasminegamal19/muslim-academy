import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PhoneCall, ArrowRight, ChevronDown } from "lucide-react";
import styles from "./Contact.module.css";

const REASONS = [
  "عدم دخول المعلم المحاضرة",
  "مشكلة في الدفع",
  "مشكلة تقنية",
  "استفسار عن الدورات",
  "أخرى",
];

export default function Contact() {
  const navigate = useNavigate();
  const [reason, setReason] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = () => {
    if (!reason || !msg.trim()) return;
    alert("تم إرسال رسالتك بنجاح ✅");
  };

  return (
    <div className={styles.container} dir="rtl">
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <ArrowRight size={22} />
        </button>
        <h1 className={styles.headerTitle}>تواصل معنا</h1>
      </div>

      <div className={styles.banner}>
        <div className={styles.bannerIcon}>
          <PhoneCall size={22} />
        </div>
        <div>
          <h2 className={styles.bannerTitle}>مرحباً بك</h2>
          <p className={styles.bannerText}>
            يسعد بتواصلك معنا، يرجى ملء النموذج أدناه وسنعاود الاتصال بك في أقرب
            وقت ممكن.
          </p>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.field}>
          <label className={styles.label}>سبب المشكلة</label>
          <div className={styles.selectWrapper}>
            <select
              className={styles.select}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            >
              <option value="" disabled>
                اختر سبب المشكلة
              </option>
              {REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <ChevronDown size={16} className={styles.selectIcon} />
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>الرسالة</label>
          <textarea
            className={styles.textarea}
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder="اكتب رسالتك هنا..."
            rows={5}
          />
        </div>

        <button className={styles.submitBtn} onClick={handleSubmit}>
          إرسال
        </button>
      </div>
    </div>
  );
}
