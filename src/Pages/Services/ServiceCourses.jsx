

import { useNavigate, useParams } from "react-router-dom";
import {
  ClipboardList,
  FileCheck2,
  BarChart3,
  User,
  ChevronLeft,
} from "lucide-react";
import { courses } from "../../components/data/CoursesData";
import styles from "./ServiceCourses.module.css";

const SERVICE_CONFIG = {
  tasks: {
    label: "المهام",
    icon: ClipboardList,
    subtitle: "اختاري الدورة لمتابعة المهام والواجبات الخاصة بكل محاضرة.",
    statSuffix: "مهمة متبقية",
    statColor: "amber",
  },
  exams: {
    label: "الاختبارات",
    icon: FileCheck2,
    subtitle: "اختاري الدورة لحل اختبارات المحاضرات ومتابعة نتائجك.",
    statSuffix: "اختبار جديد",
    statColor: "amber",
  },
  reports: {
    label: "التقارير",
    icon: BarChart3,
    subtitle: "اختاري الدورة للاطلاع على تقارير أدائك في كل محاضرة.",
    statSuffix: "تقرير جديد",
    statColor: "emerald",
  },
};

function getCourseStat(course, serviceType) {
  const allItems = course.lectures.flatMap(
    (lecture) => lecture[serviceType] || [],
  );
  if (serviceType === "tasks") {
    return allItems.filter((item) => item.status === "pending").length;
  }
  if (serviceType === "exams") {
    return allItems.filter((item) => item.status === "not_started").length;
  }
  if (serviceType === "reports") {
    return allItems.length;
  }
  return 0;
}

export default function ServiceCourses() {
  const navigate = useNavigate();
  const { serviceType } = useParams();
  const config = SERVICE_CONFIG[serviceType];

  if (!config) {
    return (
      <div className={styles.pageWrapper} dir="rtl">
        <div className={styles.notFound}>
          <p>هذه الخدمة غير متاحة حالياً.</p>
          <button
            className={styles.backButton}
            onClick={() => navigate("/services")}
          >
            الرجوع للخدمات
          </button>
        </div>
      </div>
    );
  }

  const Icon = config.icon;

  return (
    <div className={styles.pageWrapper} dir="rtl">
      <button className={styles.backLink} onClick={() => navigate("/services")}>
        <ChevronLeft size={18} />
        <span>الخدمات</span>
      </button>

      <div className={styles.pageHeader}>
        <div className={styles.headerIcon}>
          <Icon size={28} strokeWidth={1.8} />
        </div>
        <div>
          <h1 className={styles.pageTitle}>{config.label}</h1>
          <p className={styles.pageSubtitle}>{config.subtitle}</p>
        </div>
      </div>

      {courses.length === 0 ? (
        <div className={styles.emptyState}>
          <p>لستِ مشتركة في أي دورة حتى الآن.</p>
        </div>
      ) : (
        <div className={styles.coursesGrid}>
          {courses.map((course) => {
            const stat = getCourseStat(course, serviceType);
            return (
              <div
                key={course.id}
                className={styles.courseCard}
                onClick={() =>
                  navigate(`/services/${serviceType}/${course.id}`)
                }
              >
                <div className={styles.cardTop}>
                  <div className={styles.avatar}>{course.title.charAt(0)}</div>
                  {stat > 0 && (
                    <span
                      className={`${styles.statBadge} ${styles[config.statColor]}`}
                    >
                      {stat} {config.statSuffix}
                    </span>
                  )}
                </div>

                <h3 className={styles.courseTitle}>{course.title}</h3>
                <p className={styles.courseDescription}>{course.description}</p>

                <div className={styles.cardFooter}>
                  <span className={styles.teacherName}>
                    <User size={14} />
                    {course.teacherName}
                  </span>
                  <span className={styles.lectureCount}>
                    {course.lectures.length} محاضرة
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
