

import { useNavigate } from "react-router-dom";
import styles from "../../components/ServisesSection/ServicesSection.module.css";
import { ArrowRight, Send } from "lucide-react";

export default function AskScholars() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <div className={styles.headerTitleSide}>
          <button
            onClick={() => navigate("/services")}
            className={styles.backBtn}
          >
            <ArrowRight size={22} />
          </button>
          <h2 className={styles.title}>اسأل العلماء</h2>
        </div>
      </div>

      <div className={styles.infoBox}>
        <p className={styles.formHintText}>
          مرحباً بك في قسم الفتاوى والاستشارات الشرعية. يمكنك طرح سؤالك هنا
          وسيقوم علماؤنا الأفاضل بالإجابة عليك في أقرب وقت ممكن. يتم التعامل مع
          كافة الأسئلة بسرية تامة.
        </p>
      </div>

      <form
        className={styles.formStructure}
        onSubmit={(e) => e.preventDefault()}
      >
        <div className={styles.formGrid}>
          <div className={styles.inputGroup}>
            <label>الاسم بالكامل</label>
            <input type="text" placeholder="أدخل اسمك الثلاثي" />
          </div>

          <div className={styles.inputGroup}>
            <label>البريد الإلكتروني</label>
            <input
              type="email"
              placeholder="example@mail.com"
              style={{ direction: "ltr", textAlign: "right" }}
            />
          </div>

          <div className={styles.inputGroup}>
            <label>رقم الهاتف (الواتساب)</label>
            <div className={styles.phoneFieldWrapper}>
              <input type="tel" placeholder="01xxxxxxxxx" />
              <span className={styles.countryCode}>+20 🇪🇬</span>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label>الدولة</label>
            <select defaultValue="">
              <option value="" disabled>
                اختر الدولة
              </option>
              <option value="EG">مصر</option>
              <option value="SA">المملكة العربية السعودية</option>
              <option value="AE">الإمارات العربية المتحدة</option>
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label>المدينة</label>
            <input type="text" placeholder="أدخل اسم المدينة" />
          </div>
        </div>

        <div className={`${styles.inputGroup} ${styles.fullWidthRow}`}>
          <label>الرجاء كتابة السؤال بالتفصيل</label>
          <textarea placeholder="اكتب سؤالك هنا بوضوح..." rows={6}></textarea>
        </div>

        <div className={styles.actionRow}>
          <button type="submit" className={styles.enhancedSubmitBtn}>
            <span>إرسال السؤال</span>
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
}