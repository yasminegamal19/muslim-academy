import { useNavigate } from "react-router-dom";
import styles from "../../components/ServisesSection/ServicesSection.module.css";
import {
  ArrowRight,
  GraduationCap,
  ShieldCheck,
  BookOpen,
  BookMarked,
  Layers,
  Heart,
  Scale,
  Library as LibraryIcon,
  Music,
  HelpCircle,
  FileText,
} from "lucide-react";

const libraryCategories = [
  {
    title: "الأكاديمية الإسلامية",
    desc: "دورات ومناهج تعليمية شرعية متكاملة",
    icon: GraduationCap,
    route: "/services/library/academy",
    color: "#4caf50",
  },
  {
    title: "الاعتقاد",
    desc: "كتب ورسائل في التوحيد والعقيدة الصحيحة",
    icon: ShieldCheck,
    color: "#2196f3",
  },
  {
    title: "شرح القرآن الكريم",
    desc: "تفاسير وتأملات في كتاب الله العزيز",
    icon: BookOpen,
    color: "#9c27b0",
  },
  {
    title: "القرآن الكريم",
    desc: "المصحف الشريف للقراءة والتصفح",
    icon: BookMarked,
    color: "#e91e63",
  },
  {
    title: "القرآن الكريم (عشر قراءات)",
    desc: "روايات وقراءات المصحف المتواترة",
    icon: Layers,
    color: "#ff9800",
  },
  {
    title: "سيرة النبي محمد",
    desc: "عطرة من حياة الرسول صلى الله عليه وسلم",
    icon: Heart,
    color: "#ff5722",
  },
  {
    title: "الفقه الإسلامي",
    desc: "أحكام العبادات والمعاملات الحياتية",
    icon: Scale,
    color: "#009688",
  },
  {
    title: "كتب إسلامية أخرى",
    desc: "مجموعة متنوعة من المراجع الثقافية",
    icon: LibraryIcon,
    color: "#607d8b",
  },
  {
    title: "القرآن الكريم بصيغة MP3",
    desc: "تلاوات صوتية خاشعة لأشهر القراء",
    icon: Music,
    color: "#3f51b5",
  },
  {
    title: "فتوى قصيرة",
    desc: "إجابات مختصرة وموثوقة على أسئلتكم",
    icon: HelpCircle,
    color: "#00bcd4",
  },
  {
    title: "مدونة",
    desc: "مقالات وإضاءات معرفية متجددة",
    icon: FileText,
    color: "#795548",
  },
];

export default function Library() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <div className={styles.headerTitleSide}>
          <button
            onClick={() => navigate("/services")}
            className={styles.backBtn}
          >
            <ArrowRight size={22} />
          </button>
          <h2 className={styles.title}>المكتبة</h2>
        </div>
      </div>

      <div className={styles.libraryGrid}>
        {libraryCategories.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <div
              key={index}
              className={styles.libraryCard}
              onClick={() => item.route && navigate(item.route)}
            >
              <div
                className={styles.libraryIconWrapper}
                style={{
                  backgroundColor: `${item.color}15`,
                  color: item.color,
                }}
              >
                <IconComponent size={28} />
              </div>

              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
