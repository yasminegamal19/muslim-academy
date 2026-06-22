import { useNavigate } from "react-router-dom";
import { ArrowRight, Shield } from "lucide-react";
import { useStaticPage } from "../../hooks/useStaticPage";
import styles from "./StaticPage.module.css";

export default function PrivacyPage() {
  const navigate = useNavigate();
  const { data, loading, error } = useStaticPage("privacy");

  return (
    <div className={styles.container} dir="rtl">
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <ArrowRight size={22} />
        </button>
        <h1 className={styles.headerTitle}>سياسة الخصوصية</h1>
      </div>

      {!loading && data?.banner && (
        <div className={styles.bannerWrapper}>
          <img
            src={data.banner}
            alt="Privacy Banner"
            className={styles.bannerImg}
          />
        </div>
      )}

      {!loading && !data?.banner && !error && (
        <div className={styles.iconBanner}>
          <div className={styles.iconCircle}>
            <Shield size={36} color="#2e7d32" />
          </div>
        </div>
      )}

      {loading && (
        <div className={styles.skeleton}>
          <div className={styles.skeletonBanner} />
          <div className={styles.skeletonTitle} />
          <div className={styles.skeletonLine} />
          <div className={styles.skeletonLine} style={{ width: "85%" }} />
          <div className={styles.skeletonLine} style={{ width: "70%" }} />
        </div>
      )}

      {error && (
        <div className={styles.errorBox}>
          حدث خطأ في تحميل البيانات. يرجى المحاولة مرة أخرى.
        </div>
      )}

      {!loading && data && (
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>{data.title}</h2>
          {data.updated_at && (
            <p className={styles.updatedAt}>
              آخر تحديث: {new Date(data.updated_at).toLocaleDateString("ar-EG")}
            </p>
          )}
          <p className={styles.cardText}>{data.description}</p>

          {data.content && (
            <div
              className={styles.richContent}
              dangerouslySetInnerHTML={{ __html: data.content }}
            />
          )}
        </div>
      )}
    </div>
  );
}
