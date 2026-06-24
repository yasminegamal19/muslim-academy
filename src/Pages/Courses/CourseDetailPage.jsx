import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useCourseDetail } from "../../hooks/useCourses";
import styles from "./CourseDetailPage.module.css";

import {
  ArrowLeft,
  Star,
  Users,
  BookOpen,
  BarChart,
  Target,
  Sparkles,
  Compass,
  ShieldCheck,
  Award,
  Check,
  ChevronDown,
} from "lucide-react";

function LoadingDetail() {
  return (
    <div className={styles.page} dir="rtl">
      <div className={styles.heroWrapper} style={{ minHeight: "180px" }}>
        <div className={styles.heroContainer}>
          <div className={`${styles.skeletonField} ${styles.skBack}`} />
          <div className={`${styles.skeletonField} ${styles.skTag}`} />
          <div className={`${styles.skeletonField} ${styles.skMainTitle}`} />
        </div>
      </div>
      <div className={styles.layoutContainer}>
        <div className={styles.mainContent}>
          <div className={styles.statsContainer}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className={`${styles.skeletonField} ${styles.skStat}`}
              />
            ))}
          </div>
          <div className={styles.section}>
            <div className={`${styles.skeletonField} ${styles.skTitle}`} />
            <div className={`${styles.skeletonField} ${styles.skDesc}`} />
          </div>
        </div>
        <div className={styles.sidebar}>
          <div className={styles.stickyCard}>
            <div className={`${styles.skeletonField} ${styles.skPreviewImg}`} />
            <div className={`${styles.skeletonField} ${styles.skBtn}`} />
          </div>
        </div>
      </div>
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
        <div className={styles.errorIconBox}>⚠</div>
        <p>حدث خطأ أثناء تحميل تفاصيل الدورة، أو أنها لم تعد متاحة.</p>
        <button className={styles.errorBtn} onClick={() => navigate(-1)}>
          العودة للخلف
        </button>
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
            <ArrowLeft size={16} className={styles.backIcon} />
            <span>العودة للرئيسية</span>
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
              <div className={`${styles.statIcon} ${styles.iconStarColor}`}>
                <Star size={20} fill="currentColor" />
              </div>
              <div>
                <div className={styles.statVal}>{course.rating || 0}</div>
                <div className={styles.statLabel}>التقييم العام</div>
              </div>
            </div>

            <div className={styles.statItem}>
              <div className={`${styles.statIcon} ${styles.iconUsersColor}`}>
                <Users size={20} />
              </div>
              <div>
                <div className={styles.statVal}>{course.students || 0}</div>
                <div className={styles.statLabel}>طالب ملتحق</div>
              </div>
            </div>

            {course.category && (
              <div className={styles.statItem}>
                <div className={`${styles.statIcon} ${styles.iconBookColor}`}>
                  <BookOpen size={20} />
                </div>
                <div>
                  <div className={styles.statVal} style={{ fontSize: 13 }}>
                    {course.category}
                  </div>
                  <div className={styles.statLabel}>التصنيف الرئيسي</div>
                </div>
              </div>
            )}

            {course.level && (
              <div className={styles.statItem}>
                <div className={`${styles.statIcon} ${styles.iconLevelColor}`}>
                  <BarChart size={20} />
                </div>
                <div>
                  <div className={styles.statVal}>{course.level}</div>
                  <div className={styles.statLabel}>المستوى الدراسي</div>
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
                  <span className={styles.accHeaderTitle}>
                    <span
                      className={`${styles.inlineIcon} ${styles.iconTargetColor}`}
                    >
                      <Target size={18} />
                    </span>
                    ماذا ستتعلم في هذه الدورة؟
                  </span>
                  <ChevronDown
                    size={18}
                    className={`${styles.chevron} ${openSection === "learn" ? styles.chevronOpen : ""}`}
                  />
                </button>
                {openSection === "learn" && (
                  <div className={styles.accBody}>
                    <ul className={styles.learnList}>
                      {course.whatYouLearn.map((item, i) => (
                        <li key={i} className={styles.learnItem}>
                          <span className={styles.checkMark}>
                            <Check size={12} strokeWidth={3} />
                          </span>
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
                  <span className={styles.accHeaderTitle}>
                    <span
                      className={`${styles.inlineIcon} ${styles.iconSparkleColor}`}
                    >
                      <Sparkles size={18} fill="currentColor" />
                    </span>
                    المميزات المرفقة بالمنهج
                  </span>
                  <ChevronDown
                    size={18}
                    className={`${styles.chevron} ${openSection === "features" ? styles.chevronOpen : ""}`}
                  />
                </button>
                {openSection === "features" && (
                  <div className={styles.accBody}>
                    <ul className={styles.learnList}>
                      {course.features.map((item, i) => (
                        <li key={i} className={styles.learnItem}>
                          <span className={styles.checkMark}>
                            <Check size={12} strokeWidth={3} />
                          </span>
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
                  <span className={styles.accHeaderTitle}>
                    <span
                      className={`${styles.inlineIcon} ${styles.iconCurriculumColor}`}
                    >
                      <Compass size={18} />
                    </span>
                    تفاصيل الخطة الدراسية والمنهج
                  </span>
                  <ChevronDown
                    size={18}
                    className={`${styles.chevron} ${openSection === "curriculum" ? styles.chevronOpen : ""}`}
                  />
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
                <span className={styles.accHeaderTitle}>
                  <span
                    className={`${styles.inlineIcon} ${styles.iconShieldColor}`}
                  >
                    <ShieldCheck size={18} />
                  </span>
                  نظام المتابعة الدقيقة والتقييم
                </span>
                <ChevronDown
                  size={18}
                  className={`${styles.chevron} ${openSection === "unique" ? styles.chevronOpen : ""}`}
                />
              </button>
              {openSection === "unique" && (
                <div className={styles.accBody}>
                  <p className={styles.description}>
                    نعتمد على خطة متابعة دقيقة ومستمرة لضمان تقدم الطالب
                    واستيعابه التام للمادة العلمية من خلال حلقات مراجعة دورية.
                  </p>
                </div>
              )}
            </div>

            <div className={styles.accItem}>
              <button
                className={styles.accHeader}
                onClick={() => toggle("cert")}
              >
                <span className={styles.accHeaderTitle}>
                  <span
                    className={`${styles.inlineIcon} ${styles.iconAwardColor}`}
                  >
                    <Award size={18} />
                  </span>
                  شهادة الاجتياز والاعتماد
                </span>
                <ChevronDown
                  size={18}
                  className={`${styles.chevron} ${openSection === "cert" ? styles.chevronOpen : ""}`}
                />
              </button>
              {openSection === "cert" && (
                <div className={styles.accBody}>
                  <p className={styles.description}>
                    يمنح الطالب شهادة اجتياز معتمدة من الأكاديمية بعد إتمام
                    المنهج بنجاح واجتياز الاختبارات التقييمية النهائية.
                  </p>
                </div>
              )}
            </div>
          </div>

          {course.reviews?.length > 0 && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>آراء وتقييمات الطلاب</h2>
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
                    <div className={styles.reviewContent}>
                      <div className={styles.revName}>{rev.name}</div>
                      <div className={styles.revStars}>
                        {Array.from({ length: 5 }).map((_, starIndex) => (
                          <Star
                            key={starIndex}
                            size={14}
                            fill={
                              starIndex < rev.rating ? "#f59e0b" : "transparent"
                            }
                            stroke={
                              starIndex < rev.rating ? "#f59e0b" : "#cbd5e1"
                            }
                            style={{ marginLeft: "2px" }}
                          />
                        ))}
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
                className={styles.sidebarImage}
              />
            </div>
            <button
              className={styles.sidebarCtaBtn}
              onClick={handleStartCourse}
            >
              {isLoggedIn ? "ابدأ رحلة التعلم الآن" : "تسجيل الدخول للاشتراك"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
