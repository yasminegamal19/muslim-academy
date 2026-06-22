import { useEffect, useState } from "react";
import { Calendar, Video } from "lucide-react";
import styles from "./SessionCard.module.css";

function useCountdown(targetTime) {
  const getLeft = () => {
    const diff = new Date(targetTime) - Date.now();

    if (diff <= 0) {
      return { h: 0, m: 0, s: 0 };
    }

    return {
      h: Math.floor(diff / 3600000),
      m: Math.floor((diff % 3600000) / 60000),
      s: Math.floor((diff % 60000) / 1000),
    };
  };

  const [left, setLeft] = useState(getLeft);

  useEffect(() => {
    const id = setInterval(() => {
      setLeft(getLeft());
    }, 1000);

    return () => clearInterval(id);
  }, [targetTime]);

  return left;
}

const pad = (n) => String(n).padStart(2, "0");

export default function SessionCard({
  session = {
    startTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    courseTitle: "دورة React.js",
    studentName: "أحمد محمد",
    dateLabel: "اليوم - 8:00 مساءً",
    studentAvatar: "",
    meetingLink: "#",
  },
  onJoin = (link) => {
    console.log("Join:", link);
  },
}) {
  const { h, m, s } = useCountdown(session.startTime);
  const isLive = new Date(session.startTime) <= Date.now();

  return (
    <div className={styles.card}>
      {isLive && <span className={styles.liveBadge}>مباشر</span>}

      <div className={styles.topRow}>
        <div className={styles.info}>
          <h3 className={styles.courseTitle}>{session.courseTitle}</h3>

          <p className={styles.studentName}>مع الطالب {session.studentName}</p>

          <div className={styles.dateRow}>
            <Calendar size={14} />
            <span>{session.dateLabel}</span>
          </div>
        </div>

        <img
          src={session.studentAvatar || "/default-avatar.png"}
          alt={session.studentName}
          className={styles.avatar}
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
      </div>

      {!isLive && (
        <div className={styles.countdownRow}>
          <span className={styles.countdownLabel}>يبدأ بعد:</span>

          <span className={styles.countdown}>
            {pad(h)}:{pad(m)}:{pad(s)}
          </span>
        </div>
      )}

      <button
        className={styles.joinBtn}
        onClick={() => onJoin(session.meetingLink)}
      >
        <Video size={16} />
        انضم للجلسة الآن
      </button>
    </div>
  );
}
