// import { useNavigate } from "react-router-dom";
// import styles from "./LibraryPage.module.css";
// import { useTranslation } from "react-i18next";
// import { ChevronLeft, ChevronRight } from "lucide-react";

// // ============================================================
// // DATA — استبدليها ببيانات من الـ API
// // ============================================================
// const CATEGORIES = [
//   {
//     id: 1,
//     name: "الاكاديميه الاسلامية",
//     path: "/services/library/islamic-academy",
//   },
//   { id: 2, name: "الاعتقاد", path: "/services/library/aqeeda" },
//   {
//     id: 3,
//     name: "شرح القران الكريم",
//     path: "/services/library/quran-explanation",
//   },
//   { id: 4, name: "القران الكريم", path: "/services/library/quran" },
//   {
//     id: 5,
//     name: "القران الكريم (عشر قراءات)",
//     path: "/services/library/quran-readings",
//   },
//   { id: 6, name: "سيرة النبي محمد", path: "/services/library/seerah" },
//   { id: 7, name: "الفقه الاسلامي", path: "/services/library/fiqh" },
//   { id: 8, name: "كتب اسلامية اخري", path: "/services/library/other" },
//   {
//     id: 9,
//     name: "القران الكريم بصيغة MP3",
//     path: "/services/library/quran-mp3",
//   },
//   { id: 10, name: "فتوي قصيرة", path: "/services/library/fatwa" },
//   { id: 11, name: "مدونه", path: "/services/library/blog" },
// ];

// export default function LibraryPage() {
//   const navigate = useNavigate();
//   const { t, i18n } = useTranslation();
//   const isRtl = i18n.language?.startsWith("ar");
//   const ChevronIcon = isRtl ? ChevronLeft : ChevronRight;

//   return (
//     <div className={styles.page}>
//       <div className={styles.container}>
//         {/* ── Header ── */}
//         <div className={styles.header}>
//           <button
//             className={styles.backBtn}
//             onClick={() => navigate(-1)}
//             aria-label="back"
//           >
//             {isRtl ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
//           </button>
//           <h1 className={styles.title}>{t("services.library", "المكتبة")}</h1>
//         </div>

//         {/* ── Categories List ── */}
//         <div className={styles.list}>
//           {CATEGORIES.map((cat) => (
//             <div
//               key={cat.id}
//               className={styles.item}
//               onClick={() => navigate(cat.path)}
//               role="button"
//               tabIndex={0}
//               onKeyDown={(e) => e.key === "Enter" && navigate(cat.path)}
//             >
//               <span className={styles.itemName}>{cat.name}</span>
//               <ChevronIcon size={18} className={styles.itemArrow} />
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }








import { useNavigate } from "react-router-dom";
import styles from "../../components/ServisesSection/ServicesSection.module.css";
import { ArrowRight, ChevronLeft } from "lucide-react";

const libraryCategories = [
  { title: "الاكاديميه الاسلامية", route: "/services/library/academy" },
  { title: "الاعتقاد" },
  { title: "شرح القرآن الكريم" },
  { title: "القرآن الكريم" },
  { title: "القرآن الكريم (عشر قراءات)" },
  { title: "سيرة النبي محمد" },
  { title: "الفقه الاسلامي" },
  { title: "كتب اسلامية اخرى" },
  { title: "القرآن الكريم بصيغة MP3" },
  { title: "فتوى قصيرة" },
  { title: "مدونه" },
];

export default function Library() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <button onClick={() => navigate("/services")} className={styles.backBtn}>
          <ArrowRight size={20} />
        </button>
        <h2>المكتبة</h2>
      </div>

      <div className={styles.listContainer}>
        {libraryCategories.map((item, index) => (
          <div
            key={index}
            className={styles.listItem}
            onClick={() => item.route && navigate(item.route)}
          >
            <ChevronLeft size={18} className={styles.listChevron} />
            <span>{item.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}