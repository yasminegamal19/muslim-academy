import { useState } from "react";
import { PlayCircle } from "lucide-react";
import { CoursesSection } from "./CourseSection";
import { CourseDetails } from "./CourseDetails";
import { SessionCountdown } from "./SessionCountdown";
import styles from "./HomePage.module.css";

const KIDS_COURSES = [
  {
    id: 1,
    title: "تعلم القرآن الكريم بالتجويد",
    category: "القرآن والتجويد",
    image:
      "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=400&h=240&fit=crop",
    students: 1240,
    rating: 4.9,
    price: "مجانية",
    tag: "الأكثر طلباً",
  },
  {
    id: 2,
    title: "اللغة العربية للأطفال",
    category: "اللغة العربية",
    image:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=240&fit=crop",
    students: 890,
    rating: 4.8,
    price: "249 ج.م / شهر",
    tag: "",
  },
  {
    id: 3,
    title: "التجويد للمبتدئين",
    category: "القرآن والتجويد",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=240&fit=crop",
    students: 650,
    rating: 4.7,
    price: "199 ج.م / شهر",
    tag: "",
  },
  {
    id: 4,
    title: "قصص الأنبياء للأطفال",
    category: "الدراسات الإسلامية",
    image:
      "https://images.unsplash.com/photo-1604579839379-62e693ad5fe4?w=400&h=240&fit=crop",
    students: 420,
    rating: 4.9,
    price: "149 ج.م / شهر",
    tag: "جديد",
  },
];

const ADULTS_COURSES = [
  {
    id: 5,
    title: "تفسير القرآن الكريم",
    category: "القرآن والتجويد",
    image:
      "https://images.unsplash.com/photo-1585036156171-384164a8c675?w=400&h=240&fit=crop",
    students: 2100,
    rating: 4.9,
    price: "349 ج.م / شهر",
    tag: "مميز",
  },
  {
    id: 6,
    title: "الدراسات الإسلامية المتقدمة",
    category: "الدراسات الإسلامية",
    image:
      "https://images.unsplash.com/photo-1567788202534-c1d6d3b53849?w=400&h=240&fit=crop",
    students: 750,
    rating: 4.7,
    price: "299 ج.م / شهر",
    tag: "",
  },
  {
    id: 7,
    title: "تعلم اللغة العربية القرآنية",
    category: "اللغة العربية",
    image:
      "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=240&fit=crop",
    students: 1100,
    rating: 4.8,
    price: "279 ج.م / شهر",
    tag: "الأكثر طلباً",
  },
  {
    id: 8,
    title: "أحكام الفقه الإسلامي",
    category: "الدراسات الإسلامية",
    image:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=240&fit=crop",
    students: 530,
    rating: 4.6,
    price: "249 ج.م / شهر",
    tag: "",
  },
];

function HeroSection() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroInner}>
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <span className={styles.heroBadgeDot} /> منصة تعليمية إسلامية معتمدة
          </div>
          <h1 className={styles.heroTitle}>
            تعلّم القرآن والعلوم{" "}
            <span className={styles.heroTitleAccent}>الإسلامية أونلاين</span>
          </h1>
          <p className={styles.heroSubtitle}>
            تناسب الأطفال والكبار — مدرّسون معتمدون، جداول منظّمة، ومتابعة دقيقة
            بدون تعقيد
          </p>
          <div className={styles.heroButtons}>
            <button className={styles.heroBtnPrimary}>تصفح الدورات</button>
            <button className={styles.heroBtnSecondary}>
              <PlayCircle size={20} /> شاهد كيف تعمل المنصة
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function HomePage() {
  const [selectedCourse, setSelectedCourse] = useState(null);

  return (
    <div className={styles.page}>
      <link
        href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap"
        rel="stylesheet"
      />

      {selectedCourse ? (
        <CourseDetails
          course={selectedCourse}
          onBack={() => setSelectedCourse(null)}
        />
      ) : (
        <>
          <HeroSection />
          <CoursesSection
            kidsCourses={KIDS_COURSES}
            adultsCourses={ADULTS_COURSES}
            onSelectCourse={(course) => setSelectedCourse(course)}
          />
          <SessionCountdown />
        </>
      )}
    </div>
  );
}

export default HomePage;
