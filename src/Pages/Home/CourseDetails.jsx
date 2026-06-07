import { useState } from "react";
import { ArrowRight, Star, ChevronDown, ChevronUp } from "lucide-react";
import styles from "./CourseDetails.module.css";

export function CourseDetails({ course, onBack }) {
  // تجميع الـ Accordions في State واحدة للتحكم بفتح وغلق العناصر
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  // بيانات تفصيلية ثابتة (يمكن جلبها بناءً على الـ id لاحقاً)
  const ACCORDION_DATA = [
    {
      id: "what",
      title: "ماذا ستتعلم ؟",
      content:
        "سيتعلم الطالب مخارج الحروف الصحيحة، أحكام النون الساكنة والتنوين، والميم الساكنة والتطبيق العملي على قصار السور.",
    },
    {
      id: "teachers",
      title: "مدرسون ومدربات خبراء من الناطقين الأصليين باللغة الإنجليزية",
      content:
        "طاقم تعليمي مميز حاصل على إجازات متصلة بالسند مع خبرة ممتازة في التعامل مع الأطفال والكبار.",
    },
    {
      id: "private",
      title: "دروس فردية",
      content:
        "نقدم دروساً فردية لضمان حصول الطالب على الاهتمام الفردي وتحقيق أقصى استفادة من الجلسات.",
    },
    {
      id: "curriculum",
      title: "منهج فريد",
      content:
        "منهج متسلسل ومصمم بعناية ليناسب جميع المستويات من المبتدئ وحتى الإتقان.",
    },
    {
      id: "reports",
      title: "تقارير التقدم",
      content:
        "تقارير دورية شهرية ترسل لولي الأمر لمتابعة مستوى الحفظ والتجويد أولاً بأول.",
    },
  ];

  const REVIEWS = [
    {
      id: 1,
      name: "شريف عاطف",
      text: "رسوم دراسية اتجاه رائع، دروس ممتعة، جزاكم الله خيراً، أصبح بها يقتدى.",
      date: "12-12-2025",
      rating: 5,
    },
    {
      id: 2,
      name: "أحمد علي",
      text: "الأكاديمية ممتازة جداً في المتابعة، والشيخ متمكن وطريقته ممتازة مع ابني.",
      date: "10-10-2025",
      rating: 5,
    },
  ];

  return (
    <div className={styles.detailsPage}>
      {/* شريط علوي للعودة */}
      <div className={styles.topBar}>
        <button className={styles.backBtn} onClick={onBack}>
          <ArrowRight size={20} />
          <span>العودة للدورات</span>
        </button>
      </div>

      {/* صورة الدورة الأساسية */}
      <div className={styles.mainVisual}>
        <img
          src={course.image}
          alt={course.title}
          className={styles.courseImg}
        />
      </div>

      {/* تفاصيل الكورس */}
      <div className={styles.contentContainer}>
        <h1 className={styles.title}>{course.title}</h1>

        <div className={styles.badgeRow}>
          <span className={styles.category}>{course.category}</span>
          <span className={styles.rating}>
            <Star size={14} fill="#f5c518" stroke="#f5c518" /> {course.rating}
          </span>
        </div>

        {/* نبذة عن الدورة */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>نبذة عن الدورة</h2>
          <p className={styles.description}>
            تعلم تلاوة القرآن الكريم عبر الإنترنت، لتتقن التلاوة الجميلة للقرآن
            الكريم وأنت مرتاح في منزلك. هذه الدورة مناسبة لجميع المستويات، من
            المبتدئين إلى المتقدمين، وتوفر جدولاً زمنياً مرناً يناسب نمط حياتك
            المزدحم. تعلم النطق الصحيح، وقواعد التجويد، واكتسب الثقة لتلاوة
            القرآن الكريم بجمال ورونق.
          </p>
        </section>

        {/* قوائم الأكورديون (Accordions) */}
        <section className={styles.accordionContainer}>
          {ACCORDION_DATA.map((item) => (
            <div key={item.id} className={styles.accordionItem}>
              <button
                className={styles.accordionHeader}
                onClick={() => toggleSection(item.id)}
              >
                <span>{item.title}</span>
                {openSection === item.id ? (
                  <ChevronUp size={18} />
                ) : (
                  <ChevronDown size={18} />
                )}
              </button>
              {openSection === item.id && (
                <div className={styles.accordionContent}>
                  <p>{item.content}</p>
                </div>
              )}
            </div>
          ))}
        </section>

        {/* توصيات الطلاب (Reviews) */}
        <section className={styles.reviewsSection}>
          <h2 className={styles.sectionTitleCenter}>توصيات الطلاب</h2>
          <p className={styles.reviewsSubtitle}>
            اكتشف تجربة الطلاب في "الأكاديمية الإسلامية" - استمع إلى طلابنا
            المخلصين الذين استفادوا من دوراتنا المتنوعة في الدراسات القرآنية
            واللغة العربية والتربية الإسلامية.
          </p>

          <div className={styles.reviewsGrid}>
            {REVIEWS.map((rev) => (
              <div key={rev.id} className={styles.reviewCard}>
                <div className={styles.avatar}>🧑‍💻</div>
                <h4 className={styles.revName}>{rev.name}</h4>
                <p className={styles.revText}>” {rev.text} “</p>
                <div className={styles.revMeta}>
                  <div className={styles.stars}>
                    {Array(rev.rating)
                      .fill()
                      .map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          fill="#f5c518"
                          stroke="#f5c518"
                        />
                      ))}
                  </div>
                  <span className={styles.revDate}>{rev.date}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* الزر السفلي المثبت (Sticky Action Button) المتواجد في الصورة */}
      <div className={styles.stickyFooter}>
        <button className={styles.actionBtn}>ابتداء الدورة الآن</button>
      </div>
    </div>
  );
}
