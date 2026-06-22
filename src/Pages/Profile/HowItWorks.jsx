import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import styles from "./HowItWorks.module.css";

const STEPS = [
  {
    num: 1,
    title: "إنشاء حساب",
    desc: "سجل باستخدام البريد الإلكتروني أو رقم الهاتف",
    emoji: "👤",
  },
  {
    num: 2,
    title: "تصفح المحتوى",
    desc: "اختر الدورات حسب المجال أو الشيخ",
    emoji: "📚",
  },
  {
    num: 3,
    title: "الاشتراك",
    desc: "اشترك في الدورة المناسبة لك",
    emoji: "✅",
  },
  {
    num: 4,
    title: "التعلم والمتابعة والتقييم",
    desc: "شاهد الدروس المباشرة أو المسجلة — اختبارات — تقييم — شهادة",
    emoji: "🎓",
  },
];

export default function HowItWorks() {
  const navigate = useNavigate();

  return (
    <div className={styles.container} dir="rtl">
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <ArrowRight size={22} />
        </button>
        <h1 className={styles.headerTitle}>كيف نعمل</h1>
      </div>

      <div className={styles.hero}>
        <span className={styles.heroEmoji}>🕌</span>
        <h2 className={styles.heroTitle}>كيف يعمل مسلم أكاديمي؟</h2>
        <p className={styles.heroText}>
          مسلم أكاديمي منصة تعليمية إسلامية تهدف إلى نشر العلم الشرعي بطريقة
          عصرية ومنظمة، تجمع بين العلماء والطلاب في بيئة تعليمية موثوقة.
        </p>
      </div>

      <div className={styles.timeline}>
        <div className={styles.timelineLine} />

        {STEPS.map((s, i) => (
          <div key={i} className={styles.step}>
            <div
              className={`${styles.stepNum} ${i === 0 ? styles.stepNumActive : ""}`}
            >
              {s.num}
            </div>

            <div
              className={`${styles.stepCard} ${i === 0 ? styles.stepCardActive : ""}`}
            >
              <div className={styles.stepCardHeader}>
                <span className={styles.stepEmoji}>{s.emoji}</span>
                <h3 className={styles.stepTitle}>{s.title}</h3>
              </div>
              <p className={styles.stepDesc}>{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
