import { useState } from "react";
import { useNavigate } from "react-redux";
import { useNavigate as useNav } from "react-router-dom";
import { useSelector } from "react-redux";
import { Bell, Search } from "lucide-react";
import StudentCard from "../../../components/teacher/StudentCard/StudentCard";
import styles from "./TeacherFollowUp.module.css";

const MOCK_STUDENTS = [
  {
    id: "st1",
    name: "أحمد محمد",
    avatar: "",
    lastHomework: "مكتمل",
    lastExam: "85%",
    lastReport: "ممتاز",
  },
  {
    id: "st2",
    name: "محمود أحمد",
    avatar: "",
    lastHomework: "معلق",
    lastExam: "70%",
    lastReport: "جيد",
  },
  {
    id: "st3",
    name: "عبدالرحمن حمدي",
    avatar: "",
    lastHomework: "مكتمل",
    lastExam: "92%",
    lastReport: "ممتاز",
  },
  {
    id: "st4",
    name: "يوسف عبدالله",
    avatar: "",
    lastHomework: "معلق",
    lastExam: "—",
    lastReport: "—",
  },
];

export default function TeacherFollowUp() {
  const navigate = useNav();
  const { user } = useSelector((s) => s.auth);
  const [query, setQuery] = useState("");

  const filtered = MOCK_STUDENTS.filter((s) => s.name.includes(query));

  return (
    <div className={styles.container} dir="rtl">
      <div className={styles.topBar}>
        <div className={styles.greetBlock}>
          <span className={styles.greetText}>مرحباً بك</span>
          <span className={styles.teacherName}>
            {user?.name || "الشيخ أحمد محمد"}
          </span>
        </div>
        <div className={styles.topBarLeft}>
          <button className={styles.iconBtn}>
            <Bell size={20} />
          </button>
          <div className={styles.topAvatar}>
            {user?.avatar ? (
              <img src={user.avatar} alt="avatar" />
            ) : (
              <span>👤</span>
            )}
          </div>
        </div>
      </div>

      <h2 className={styles.pageTitle}>المتابعة</h2>
      <p className={styles.pageSubtitle}>تابع واجبات واختبارات وتقارير طلابك</p>

      <div className={styles.searchWrapper}>
        <Search size={16} className={styles.searchIcon} />
        <input
          className={styles.searchInput}
          placeholder="ابحث عن طالب..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className={styles.list}>
        {filtered.length === 0 ? (
          <p className={styles.empty}>لا يوجد طلاب مطابقون</p>
        ) : (
          filtered.map((student) => (
            <StudentCard key={student.id} student={student} mode="followup" />
          ))
        )}
      </div>

      <div className={styles.bottomNav}>
        <button className={styles.navItem} onClick={() => navigate("/teacher")}>
          <span className={styles.navIcon}>🏠</span>
          <span>الرئيسية</span>
        </button>
        <button
          className={styles.navItem}
          onClick={() => navigate("/teacher/performance")}
        >
          <span className={styles.navIcon}>📊</span>
          <span>الأداء</span>
        </button>
        <button
          className={`${styles.navItem} ${styles.navActive}`}
          onClick={() => navigate("/teacher/followup")}
        >
          <span className={styles.navIcon}>👁️</span>
          <span>المتابعة</span>
        </button>
        <button
          className={styles.navItem}
          onClick={() => navigate("/teacher/profile")}
        >
          <span className={styles.navIcon}>👤</span>
          <span>حسابي</span>
        </button>
      </div>
    </div>
  );
}
