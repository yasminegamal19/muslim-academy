import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useStaticPage } from "../../hooks/useStaticPage";
import styles from "./About.module.css";

const SECTIONS = [
  {
    emoji: "🎯",
    title: "رؤيتنا",
    text: "أن نكون المرجع الرقمي الأول للتعليم الإسلامي الأونلاين.",
  },
  {
    emoji: "💬",
    title: "رسالتنا",
    text: "تقديم محتوى علمي موثوق ومنظم، وسهل الوصول إلى كل مسلم في أي مكان.",
  },
  {
    emoji: "✨",
    title: "قيمنا",
    text: "الأمانة العلمية، والتميز في التقديم، والحرص على نفع كل متعلم.",
  },
];

export default function About() {
  const navigate = useNavigate();
  const { data, loading, error } = useStaticPage("about-us");

  return (
    <div className={styles.container} dir="rtl">
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <ArrowRight size={22} />
        </button>
        <h1 className={styles.headerTitle}>من نحن</h1>
      </div>

      {loading && (
        <div style={{ padding: "16px" }}>
          <div
            style={{
              height: 160,
              background: "#e8e8e8",
              borderRadius: 12,
              marginBottom: 16,
              animation: "shimmer 1.5s infinite",
            }}
          />
          <div
            style={{
              height: 20,
              width: "50%",
              background: "#e8e8e8",
              borderRadius: 6,
              marginBottom: 10,
              animation: "shimmer 1.5s infinite",
            }}
          />
          <div
            style={{
              height: 14,
              background: "#e8e8e8",
              borderRadius: 6,
              marginBottom: 8,
              animation: "shimmer 1.5s infinite",
            }}
          />
          <div
            style={{
              height: 14,
              width: "80%",
              background: "#e8e8e8",
              borderRadius: 6,
              animation: "shimmer 1.5s infinite",
            }}
          />
        </div>
      )}

      {error && (
        <div
          style={{
            margin: "12px 16px",
            padding: "10px 14px",
            background: "#fff3f3",
            border: "1px solid #ffcdd2",
            borderRadius: 10,
            color: "#c62828",
            fontSize: "0.85rem",
            textAlign: "center",
          }}
        >
          تعذّر تحميل البيانات — يتم عرض المحتوى الافتراضي
        </div>
      )}

      {!loading && (
        <div className={styles.logoBanner}>
          {data?.banner ? (
            <img
              src={data.banner}
              alt="About Banner"
              style={{
                width: "100%",
                maxHeight: 180,
                objectFit: "cover",
                borderRadius: 12,
              }}
            />
          ) : (
            <div className={styles.logoCircle}>
              <svg width="38" height="38" fill="none" viewBox="0 0 50 50">
                <circle
                  cx="25"
                  cy="25"
                  r="24"
                  fill="#f1f7f1"
                  stroke="#2e7d32"
                  strokeWidth="1.5"
                />
                <path
                  d="M15 25c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10"
                  stroke="#2e7d32"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M25 15v10l6 4"
                  stroke="#2e7d32"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          )}
          <h2 className={styles.logoTitle}>{data?.title || "مسلم أكاديمي"}</h2>
          <p className={styles.logoSub}>نوصلك بالرعاية الطيبة في أسرع وقت</p>
        </div>
      )}

      {!loading && (
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>مرحباً بكم في مسلم أكاديمي</h3>
          <p className={styles.cardText}>
            {data?.description ||
              "مسلم أكاديمي منصة تعليمية إسلامية تهدف إلى نشر العلم الشرعي بطريقة عصرية ومنظمة، تجمع بين العلماء والطلاب في بيئة تعليمية موثوقة."}
          </p>

          {data?.content && (
            <div
              style={{
                marginTop: 12,
                fontSize: "0.9rem",
                color: "#555",
                lineHeight: 1.8,
              }}
              dangerouslySetInnerHTML={{ __html: data.content }}
            />
          )}

          {data?.updated_at && (
            <p style={{ fontSize: "0.75rem", color: "#aaa", marginTop: 12 }}>
              آخر تحديث: {new Date(data.updated_at).toLocaleDateString("ar-EG")}
            </p>
          )}
        </div>
      )}

      <div className={styles.sectionsGrid}>
        {SECTIONS.map((s, i) => (
          <div key={i} className={styles.sectionCard}>
            <span className={styles.sectionEmoji}>{s.emoji}</span>
            <h4 className={styles.sectionTitle}>{s.title}</h4>
            <p className={styles.sectionText}>{s.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
