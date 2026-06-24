import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCategories, useCourses } from "../../hooks/useCourses";
import styles from "./CoursesPage.module.css";

function CourseCard({ course, isKids }) {
  const navigate = useNavigate();
  return (
    <div
      className={styles.cpCard}
      onClick={() => navigate(`/courses/${course.slug}`)}
    >
      <div className={styles.cpCardImgWrapper}>
        <img
          src={course.image}
          alt={course.title}
          className={styles.cpCardImg}
          loading="lazy"
        />
        {course.badge && (
          <span
            className={`${styles.cpBadge} ${isKids ? styles.kidsBadge : styles.adultsBadge}`}
          >
            {course.badge}
          </span>
        )}
      </div>
      <div className={styles.cpCardBody}>
        <span
          className={`${styles.cpCategory} ${isKids ? styles.kidsText : styles.adultsText}`}
        >
          {course.subject || course.category}
        </span>
        <h3 className={styles.cpTitle}>{course.title}</h3>
        <p className={styles.cpSubtitle}>{course.subtitle}</p>

        <div className={styles.cpMeta}>
          {course.instructorImage && (
            <img
              src={course.instructorImage}
              alt={course.instructor}
              className={styles.cpAvatar}
            />
          )}
          {course.instructor && (
            <span className={styles.cpInstructor}>{course.instructor}</span>
          )}
          <span className={styles.cpRating}>
            ⭐ {course.rating} ({course.students})
          </span>
        </div>

        <div className={styles.cpFooter}>
          <span className={styles.cpDuration}>
            ⏱ {course.duration || "مرن"}
          </span>
          <span
            className={`${styles.cpLevel} ${isKids ? styles.kidsLevel : styles.adultsLevel}`}
          >
            {course.level || "كل المستويات"}
          </span>
        </div>
        <button className={styles.cpBtn}>اقرأ المزيد</button>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className={`${styles.cpCard} ${styles.skeletonCard}`}>
      <div
        className={`${styles.cpCardImgWrapper} ${styles.skeletonField}`}
        style={{ height: 175 }}
      />
      <div className={styles.cpCardBody}>
        <div className={`${styles.skeletonField} ${styles.skCategory}`} />
        <div className={`${styles.skeletonField} ${styles.skTitle}`} />
        <div className={`${styles.skeletonField} ${styles.skSubtitle}`} />
        <div className={styles.cpMeta}>
          <div className={`${styles.skeletonField} ${styles.skAvatar}`} />
          <div className={`${styles.skeletonField} ${styles.skInstructor}`} />
        </div>
        <div className={styles.cpFooter} style={{ borderTop: "none" }}>
          <div className={`${styles.skeletonField} ${styles.skFooterItem}`} />
          <div
            className={`${styles.skeletonField} ${styles.skFooterItem}`}
            style={{ width: 60 }}
          />
        </div>
        <div className={`${styles.skeletonField} ${styles.skBtnField}`} />
      </div>
    </div>
  );
}

export default function CoursesPage() {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const isRTL = i18n.language !== "en";

  const {
    categories,
    loading: loadingCats,
    error: errorCats,
  } = useCategories();

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [activeSubject, setActiveSubject] = useState("الكل");

  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0]);
    }
  }, [categories, selectedCategory]);

  const {
    data: courses,
    loading: loadingCourses,
    error: errorCourses,
  } = useCourses({
    categorySlug: selectedCategory?.slug,
  });

  useEffect(() => {
    setActiveSubject("الكل");
  }, [selectedCategory]);

  const subjects = [
    "الكل",
    ...new Set(courses.map((c) => c.subject).filter(Boolean)),
  ];

  const filteredCourses =
    activeSubject === "الكل"
      ? courses
      : courses.filter((c) => c.subject === activeSubject);

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

  return (
    <div className={styles.coursesPage} dir={isRTL ? "rtl" : "ltr"}>
      <div className={styles.cpHero}>
        <button className={styles.cpBackBtn} onClick={() => navigate(-1)}>
          <span>{isRTL ? "← رجوع" : "← Back"}</span>
        </button>
        <h1 className={styles.cpHeroTitle}>دوراتنا المتاحة</h1>
        <p className={styles.cpHeroSubtitle}>
          تأسست دورات الأكاديمية الإسلامية عبر الإنترنت لمختلف الفئات والمستويات
          تحت إشراف نخبة من المتخصصين
        </p>
      </div>

      <div className={styles.cpTabsWrapper}>
        <div className={styles.cpTabs}>
          {categories.map((cat) => {
            const isKidsTheme = checkIsKids(cat.name);
            const isActive = selectedCategory?.slug === cat.slug;
            return (
              <button
                key={cat.slug}
                className={`${styles.cpTab} ${
                  isActive
                    ? `${styles.active} ${isKidsTheme ? styles.kids : styles.adults}`
                    : ""
                }`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {!isLoading && subjects.length > 1 && (
        <div className={styles.cpCategoriesWrapper}>
          <div className={styles.cpCategories}>
            {subjects.map((sub) => (
              <button
                key={sub}
                className={`${styles.cpCatBtn} ${activeSubject === sub ? styles.active : ""}`}
                onClick={() => setActiveSubject(sub)}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className={styles.cpResultsInfo}>
        {isLoading ? (
          <span className={styles.infoLoading}>
            جاري تحديث قائمة الدورات...
          </span>
        ) : hasError ? (
          <div className={styles.errorContainer}>
            <span>حدث خطأ أثناء جلب البيانات: {errorCats || errorCourses}</span>
          </div>
        ) : (
          <p className={styles.infoText}>
            يتم عرض <strong>{filteredCourses.length}</strong> دورة في قسم "
            <span>{selectedCategory?.name}</span>"
            {activeSubject !== "الكل" && (
              <span className={styles.subMark}> / {activeSubject}</span>
            )}
          </p>
        )}
      </div>

      <div className={styles.cpGrid}>
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : filteredCourses.map((course) => (
              <CourseCard
                key={course.slug}
                course={course}
                isKids={checkIsKids(selectedCategory?.name)}
              />
            ))}
      </div>

      {!isLoading && filteredCourses.length === 0 && !hasError && (
        <div className={styles.noDataBox}>
          <p>لا توجد دورات متاحة حالياً في هذا القسم الفرعي.</p>
        </div>
      )}
    </div>
  );
}
