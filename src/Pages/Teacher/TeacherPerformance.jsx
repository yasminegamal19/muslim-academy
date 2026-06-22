import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Bell } from "lucide-react";
import StudentCard from "../../../components/teacher/StudentCard/StudentCard";
import styles from "./TeacherPerformance.module.css";

const MOCK_STUDENTS = [
  { id: "st1", name: "أحمد محمد", fines: 500, avatar: "" },
  { id: "st2", name: "محمود أحمد", fines: 0, avatar: "" },
  { id: "st3", name: "عبدالرحمن حمدي", fines: 200, avatar: "" },
  { id: "st4", name: "يوسف عبدالله", fines: 0, avatar: "" },
];

export default function TeacherPerformance() {
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);

  const handleAction = (type, student) => {
    navigate(`/teacher/${type}/${student.id}`, { state: { student } });
  };

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

      <h2 className={styles.pageTitle}>الأداء</h2>
      <p className={styles.pageSubtitle}>
        إدارة طلابك — أضف اختبارات، واجبات وتقارير
      </p>

      <div className={styles.list}>
        {MOCK_STUDENTS.map((student) => (
          <StudentCard
            key={student.id}
            student={student}
            mode="performance"
            onAction={handleAction}
          />
        ))}
      </div>

      <div className={styles.bottomNav}>
        <button className={styles.navItem} onClick={() => navigate("/teacher")}>
          <span className={styles.navIcon}>🏠</span>
          <span>الرئيسية</span>
        </button>
        <button
          className={`${styles.navItem} ${styles.navActive}`}
          onClick={() => navigate("/teacher/performance")}
        >
          <span className={styles.navIcon}>📊</span>
          <span>الأداء</span>
        </button>
        <button
          className={styles.navItem}
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
