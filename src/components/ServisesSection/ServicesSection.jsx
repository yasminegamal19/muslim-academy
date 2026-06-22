import { useNavigate } from "react-router-dom";
import styles from "./ServicesSection.module.css";
import {
  Search,
  BookOpen,
  MessageSquare,
  ClipboardList,
  FileCheck2,
  FileText,
  BarChart3,
} from "lucide-react";

const servicesList = [
  {
    id: "library",
    title: "المكتبة الرقمية",
    description:
      "تصفح وتحميل المصاحف، الكتب الإسلامية، والمراجع العلمية المعتمدة.",
    icon: BookOpen,
    route: "/services/library",
  },
  {
    id: "ask",
    title: "اسأل معلماً أو شيخاً",
    description: "طرح الأسئلة الفقهية والتعليمية واستقبال الإجابات من مشايخنا.",
    icon: MessageSquare,
    route: "/services/ask-scholars",
    active: true,
  },
  {
    id: "research",
    title: "الأبحاث والمقالات",
    description: "مجموعة من البحوث والمقالات الإسلامية والتربوية الموثقة.",
    icon: FileText,
    route: "/services/research",
  },
  {
    id: "tasks",
    title: "المهام",
    description: "تابع مهامك وواجباتك في كل محاضرة من دوراتك بسهولة.",
    icon: ClipboardList,
    route: "/services/tasks",
  },
  {
    id: "exams",
    title: "الاختبارات",
    description: "حل اختبارات المحاضرات وتابع نتائجك خطوة بخطوة.",
    icon: FileCheck2,
    route: "/services/exams",
  },
  {
    id: "reports",
    title: "التقارير",
    description: "اطلع على تقارير أدائك التفصيلية بعد كل محاضرة.",
    icon: BarChart3,
    route: "/services/reports",
  },
];

export default function Services() {
  const navigate = useNavigate();

  return (
    <div className={styles.sectionContainer} dir="rtl">
      <div className={styles.topBar}>
        <div className={styles.titleSide}>
          <div className={styles.topBadge}>الخدمات الإلكترونية</div>
          <h2 className={styles.title}>خدمات الأكاديمية</h2>
        </div>

        <div className={styles.searchWrapper}>
          <input
            type="text"
            placeholder="ابحث عن الخدمة..."
            className={styles.searchInput}
          />
          <Search className={styles.searchIcon} size={18} />
        </div>
      </div>

      <div className={styles.servicesGrid}>
        {servicesList.map((service) => {
          const IconComponent = service.icon;
          return (
            <div
              key={service.id}
              className={`${styles.serviceCard} ${service.active ? styles.activeCard : ""}`}
              onClick={() => navigate(service.route)}
            >
              <div className={styles.cardHeader}>
                <div className={styles.iconContainer}>
                  <IconComponent size={26} strokeWidth={1.8} />
                </div>
                {service.active && (
                  <span className={styles.activeBadge}>موصى به</span>
                )}
              </div>

              <div className={styles.cardContent}>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>

              <div className={styles.cardArrow}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
