import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Bell, Menu } from "lucide-react";
import SessionCard from "../../../components/teacher/SessionCard/SessionCard";
import StatBadge from "../../../components/teacher/StatBadge/StatBadge";
import styles from "./TeacherHome.module.css";

const MOCK_SESSIONS = [
  {
    id: "s1",
    courseTitle: "دورة تعلم القرآن الكريم",
    studentName: "أحمد محمد",
    studentAvatar: "",
    dateLabel: "الاثنين 25 يناير — الساعة 08:00 مساءاً",
    startTime: new Date(
      Date.now() + 2 * 60 * 60 * 1000 + 59 * 60 * 1000 + 59000,
    ).toISOString(),
    meetingLink: "https://meet.google.com/example-link-1",
  },
  {
    id: "s2",
    courseTitle: "دورة تعلم القرآن الكريم",
    studentName: "محمود أحمد",
    studentAvatar: "",
    dateLabel: "الاثنين 25 يناير — الساعة 09:00 مساءاً",
    startTime: new Date(
      Date.now() + 2 * 60 * 60 * 1000 + 50 * 60 * 1000 + 59000,
    ).toISOString(),
    meetingLink: "https://meet.google.com/example-link-2",
  },
  {
    id: "s3",
    courseTitle: "دورة تعلم القرآن الكريم",
    studentName: "عبدالرحمن حمدي",
    studentAvatar: "",
    dateLabel: "الاثنين 25 يناير — الساعة 10:00 مساءاً",
    startTime: new Date(
      Date.now() + 3 * 60 * 60 * 1000 + 20 * 60 * 1000,
    ).toISOString(),
    meetingLink: "https://meet.google.com/example-link-3",
  },
];

export default function TeacherHome() {
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);

  const handleJoin = (link) => {
    window.open(link, "_blank", "noopener,noreferrer");
  };

  return (
    <div className={styles.container} dir="rtl">
      <div className={styles.topBar}>
        <button className={styles.iconBtn}>
          <Menu size={22} />
        </button>
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

      <div className={styles.statsRow}>
        <StatBadge
          icon="📅"
          label="جلسات اليوم"
          value={MOCK_SESSIONS.length}
          color="green"
        />
        <StatBadge icon="👥" label="طلابي" value={12} color="blue" />
        <StatBadge icon="⭐" label="تقييمي" value="4.9" color="orange" />
      </div>

      <div className={styles.sessionsList}>
        {MOCK_SESSIONS.map((session) => (
          <div key={session.id}>
            <h2 className={styles.sectionTitle}>الجلسة القادمة</h2>
            <SessionCard session={session} onJoin={handleJoin} />
          </div>
        ))}
      </div>

      <div className={styles.bottomNav}>
        <button
          className={`${styles.navItem} ${styles.navActive}`}
          onClick={() => navigate("/teacher")}
        >
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
