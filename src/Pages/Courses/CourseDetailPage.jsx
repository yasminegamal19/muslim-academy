

import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useCourseDetail } from "../../hooks/useCourses";
import styles from "./CourseDetailPage.module.css";

function LoadingDetail() {
  return (
    <div
      className={styles.page}
      dir="rtl"
      style={{ padding: "2rem", textAlign: "center" }}
    >
      <div
        style={{
          height: 240,
          background: "#e0e0e0",
          borderRadius: 12,
          marginBottom: 24,
        }}
      />
      <div
        style={{
          height: 20,
          background: "#e0e0e0",
          borderRadius: 4,
          marginBottom: 12,
          width: "60%",
          margin: "0 auto 12px",
        }}
      />
      <div
        style={{
          height: 14,
          background: "#e0e0e0",
          borderRadius: 4,
          width: "80%",
          margin: "0 auto",
        }}
      />
    </div>
  );
}

export default function CourseDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const isLoggedIn = useSelector((state) => !!state.auth?.token);

  const { data: course, loading, error } = useCourseDetail(slug);

  const [openSection, setOpenSection] = useState(null);

  if (loading) return <LoadingDetail />;

  if (error || !course) {
    return (
      <div className={styles.notFound} dir="rtl">
        <p>حدث خطأ أثناء تحميل الدورة</p>
        <button onClick={() => navigate(-1)}>رجوع</button>
      </div>
    );
  }

  const toggle = (key) => setOpenSection(openSection === key ? null : key);

  const handleStartCourse = () => {
    if (isLoggedIn) {
      
      navigate("/subscription", {
        state: {
          course: {
            id: course.rawId || course.id, 
            name: course.title,
            title: course.title,
            slug: course.slug,
          },
        },
      });
    } else {
      navigate("/login");
    }
  };

  return (
    <div className={styles.page} dir="rtl">
      <div className={styles.heroWrapper}>
        <div className={styles.heroContainer}>
          <button className={styles.backBtn} onClick={() => navigate(-1)}>
            ← رجوع
          </button>
          <span className={styles.categoryTag}>
            {course.category}
            {course.subject ? ` / ${course.subject}` : ""}
          </span>
          <h1 className={styles.courseTitle}>{course.title}</h1>
        </div>
      </div>

      <div className={styles.layoutContainer}>
        <div className={styles.mainContent}>
          <div className={styles.statsContainer}>
            <div className={styles.statItem}>
              <span className={styles.statIcon}>⭐</span>
              <div>
                <div className={styles.statVal}>{course.rating || 0}</div>
                <div className={styles.statLabel}>التقييم</div>
              </div>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statIcon}>👥</span>
              <div>
                <div className={styles.statVal}>{course.students || 0}</div>
                <div className={styles.statLabel}>تقييم</div>
              </div>
            </div>
            {course.category && (
              <div className={styles.statItem}>
                <span className={styles.statIcon}>📚</span>
                <div>
                  <div className={styles.statVal} style={{ fontSize: 13 }}>
                    {course.category}
                  </div>
                  <div className={styles.statLabel}>الفئة</div>
                </div>
              </div>
            )}
            {course.level && (
              <div className={styles.statItem}>
                <span className={styles.statIcon}>📊</span>
                <div>
                  <div className={styles.statVal}>{course.level}</div>
                  <div className={styles.statLabel}>المستوى</div>
                </div>
              </div>
            )}
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>نبذة عن الدورة</h2>
            <p className={styles.description}>{course.description}</p>
          </div>

          <div className={styles.accordion}>
            {course.whatYouLearn?.length > 0 && (
              <div className={styles.accItem}>
                <button
                  className={styles.accHeader}
                  onClick={() => toggle("learn")}
                >
                  <span>
                    <span className={styles.accIcon}>📚</span>ماذا ستتعلم؟
                  </span>
                  <span
                    className={`${styles.chevron} ${openSection === "learn" ? styles.chevronOpen : ""}`}
                  >
                    ▼
                  </span>
                </button>
                {openSection === "learn" && (
                  <div className={styles.accBody}>
                    <ul className={styles.learnList}>
                      {course.whatYouLearn.map((item, i) => (
                        <li key={i} className={styles.learnItem}>
                          <span className={styles.checkMark}>✓</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {course.features?.length > 0 && (
              <div className={styles.accItem}>
                <button
                  className={styles.accHeader}
                  onClick={() => toggle("features")}
                >
                  <span>
                    <span className={styles.accIcon}>✨</span>مميزات الدورة
                  </span>
                  <span
                    className={`${styles.chevron} ${openSection === "features" ? styles.chevronOpen : ""}`}
                  >
                    ▼
                  </span>
                </button>
                {openSection === "features" && (
                  <div className={styles.accBody}>
                    <ul className={styles.learnList}>
                      {course.features.map((item, i) => (
                        <li key={i} className={styles.learnItem}>
                          <span className={styles.checkMark}>✓</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {course.curriculum?.length > 0 && (
              <div className={styles.accItem}>
                <button
                  className={styles.accHeader}
                  onClick={() => toggle("curriculum")}
                >
                  <span>
                    <span className={styles.accIcon}>📋</span>منهج التقدم
                  </span>
                  <span
                    className={`${styles.chevron} ${openSection === "curriculum" ? styles.chevronOpen : ""}`}
                  >
                    ▼
                  </span>
                </button>
                {openSection === "curriculum" && (
                  <div className={styles.accBody}>
                    {course.curriculum.map((item, i) => (
                      <div key={i} className={styles.currItem}>
                        <span className={styles.weekBadge}>{item.week}</span>
                        <div>
                          <div className={styles.currTitle}>{item.title}</div>
                          <div className={styles.currDesc}>{item.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className={styles.accItem}>
              <button
                className={styles.accHeader}
                onClick={() => toggle("unique")}
              >
                <span>
                  <span className={styles.accIcon}>🎯</span>نظام دقيق
                </span>
                <span
                  className={`${styles.chevron} ${openSection === "unique" ? styles.chevronOpen : ""}`}
                >
                  ▼
                </span>
              </button>
              {openSection === "unique" && (
                <div className={styles.accBody}>
                  <p className={styles.description}>
                    نعتمد على خطة متابعة دقيقة ومستمرة لضمان تقدم الطالب
                    واستيعابه التام للمادة العلمية.
                  </p>
                </div>
              )}
            </div>

            <div className={styles.accItem}>
              <button
                className={styles.accHeader}
                onClick={() => toggle("cert")}
              >
                <span>
                  <span className={styles.accIcon}>🏆</span>الشهادات
                </span>
                <span
                  className={`${styles.chevron} ${openSection === "cert" ? styles.chevronOpen : ""}`}
                >
                  ▼
                </span>
              </button>
              {openSection === "cert" && (
                <div className={styles.accBody}>
                  <p className={styles.description}>
                    يمنح الطالب شهادة اجتياز معتمدة من الأكاديمية بعد إتمام
                    المنهج بنجاح واجتياز الاختبار النهائي.
                  </p>
                </div>
              )}
            </div>
          </div>

          {course.reviews?.length > 0 && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>آراء الطلاب</h2>
              <div className={styles.reviewsGrid}>
                {course.reviews.map((rev, i) => (
                  <div key={i} className={styles.review}>
                    {rev.image && (
                      <img
                        src={rev.image}
                        alt={rev.name}
                        className={styles.revAvatar}
                      />
                    )}
                    <div>
                      <div className={styles.revName}>{rev.name}</div>
                      <div className={styles.revStars}>
                        {"⭐".repeat(rev.rating)}
                      </div>
                      <div className={styles.revComment}>{rev.comment}</div>
                      <div className={styles.revDate}>{rev.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className={styles.sidebar}>
          <div className={styles.stickyCard}>
            <div className={styles.previewImgWrapper}>
              <img
                src={course.image}
                alt={course.title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <button
              className={styles.sidebarCtaBtn}
              onClick={handleStartCourse}
            >
              {isLoggedIn ? "ابدأ الدورة الآن" : "سجّل دخولك للاشتراك"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
