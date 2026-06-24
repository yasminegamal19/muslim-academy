import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCategories, useCourses } from "../../hooks/useCourses";
import styles from "./CoursesSection.module.css";

function HomeCourseCard({ course, isKids }) {
  const navigate = useNavigate();

  const displayName = course.name || course.title || "";

  const subjectLabel =
    typeof course.subject === "object" ? course.subject?.name : course.subject;

  const categoryLabel =
    typeof course.category === "object"
      ? course.category?.name
      : course.category;

  const displayCategory = subjectLabel || categoryLabel || "";

  return (
    <div
      className={styles.ccCard}
      onClick={() => navigate(`/courses/${course.slug}`)}
    >
      <div className={styles.ccCardImgWrapper}>
        <img
          src={course.image}
          alt={displayName}
          className={styles.ccCardImg}
          loading="lazy"
        />
      </div>
      <div className={styles.ccCardBody}>
        <span
          className={`${styles.ccCategory} ${isKids ? styles.kidsText : styles.adultsText}`}
        >
          {displayCategory}
        </span>
        <h3 className={styles.ccTitle}>{displayName}</h3>
        <p className={styles.ccSubtitle}>
          {course.description || course.subtitle}
        </p>

        <div className={styles.ccMeta}>
          <span className={styles.ccRating}>
            ⭐ {course.average_rating || course.rating || 0}
            {course.total_reviews > 0 && ` (${course.total_reviews})`}
          </span>
        </div>

        <div className={styles.ccFooter}>
          <span
            className={`${styles.ccLevel} ${isKids ? styles.kidsLevel : styles.adultsLevel}`}
          >
            {isKids ? "للأطفال" : "للكبار"}
          </span>
          <button className={styles.ccReadMoreBtn}>التفاصيل</button>
        </div>
      </div>
    </div>
  );
}

// السكيتون المطور بتأثير النبض السلس (Shimmer) مع الحفاظ على هيكل كارتك المكتمل
function HomeSkeletonCard() {
  return (
    <div className={`${styles.ccCard} ${styles.skeletonCard}`}>
      <div
        className={`${styles.ccCardImgWrapper} ${styles.skeletonField}`}
        style={{ height: 180 }}
      />
      <div className={styles.ccCardBody}>
        <div className={`${styles.skeletonField} ${styles.skBadge}`} />
        <div className={`${styles.skeletonField} ${styles.skTitle}`} />
        <div className={`${styles.skeletonField} ${styles.skDesc}`} />
        <div className={styles.ccMeta} style={{ borderBottom: "none" }}>
          <div className={`${styles.skeletonField} ${styles.skRating}`} />
        </div>
        <div className={styles.ccFooter}>
          <div className={`${styles.skeletonField} ${styles.skLevelBtn}`} />
          <div className={`${styles.skeletonField} ${styles.skMoreBtn}`} />
        </div>
      </div>
    </div>
  );
}

export default function CoursesSection() {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const isRTL = i18n.language !== "en";

  const {
    categories,
    loading: loadingCats,
    error: errorCats,
  } = useCategories();
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0]);
    }
  }, [categories, activeCategory]);

  const {
    data: courses,
    loading: loadingCourses,
    error: errorCourses,
  } = useCourses({
    categorySlug: activeCategory?.slug,
  });

  const checkIsKids = (name = "") => {
    const lower = name.toLowerCase();
    return (
      lower.includes("child") ||
      lower.includes("kid") ||
      lower.includes("أطفال")
    );
  };

  const isLoading = loadingCats || loadingCourses;
  const hasError = errorCats || errorCourses;
  const displayedCourses = courses.slice(0, 4);
  const isKidsCategory = checkIsKids(activeCategory?.name);

  return (
    <section className={styles.coursesSection} dir={isRTL ? "rtl" : "ltr"}>
      <div className={styles.csContainer}>
        <div className={styles.csHeader}>
          <div className={styles.csHeaderTexts}>
            <h2 className={styles.csSectionTitle}>اكتشف دوراتنا المتميزة</h2>
            <p className={styles.csSectionSubtitle}>
              اختر القسم المناسب وابدأ رحلة التعلم الفريدة معنا اليوم
            </p>
          </div>
          <button
            className={styles.csViewAllBtn}
            onClick={() =>
              navigate(`/courses/${isKidsCategory ? "kids" : "adults"}`)
            }
          >
            <span>{isRTL ? "عرض الكل" : "View All"}</span>
            <span className={styles.arrowIcon}>{isRTL ? "←" : "→"}</span>
          </button>
        </div>

        <div className={styles.csTabsWrapper}>
          <div className={styles.csTabs}>
            {categories.map((cat) => {
              const isKidsTheme = checkIsKids(cat.name);
              const isActive = activeCategory?.slug === cat.slug;
              return (
                <button
                  key={cat.slug}
                  className={`${styles.csTab} ${
                    isActive
                      ? `${styles.tabActive} ${isKidsTheme ? styles.kidsTab : styles.adultsTab}`
                      : ""
                  }`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {hasError && (
          <div className={styles.errorContainer}>
            <p className={styles.csErrorText}>
              حدث خطأ أثناء تحميل البيانات: {errorCats || errorCourses}
            </p>
          </div>
        )}

        <div className={styles.csGrid}>
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <HomeSkeletonCard key={i} />
              ))
            : displayedCourses.map((course) => (
                <HomeCourseCard
                  key={course.slug}
                  course={course}
                  isKids={isKidsCategory}
                />
              ))}
        </div>

        {!isLoading && displayedCourses.length === 0 && !hasError && (
          <div className={styles.noDataContainer}>
            <p className={styles.csNoDataText}>
              لا توجد دورات متاحة في هذا القسم حالياً.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
