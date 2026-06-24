import { useEffect, useState, useCallback } from "react";
import {
  Calendar,
  Video,
  Clock,
  CheckCircle,
  XCircle,
  BookOpen,
  FileText,
  ClipboardList,
  StopCircle,
} from "lucide-react";
import styles from "./SessionCard.module.css";

function useCountdown(targetTime) {
  const getLeft = useCallback(() => {
    const diff = new Date(targetTime) - Date.now();
    if (diff <= 0) return { h: 0, m: 0, s: 0 };
    return {
      h: Math.floor(diff / 3_600_000),
      m: Math.floor((diff % 3_600_000) / 60_000),
      s: Math.floor((diff % 60_000) / 1_000),
    };
  }, [targetTime]);

  const [left, setLeft] = useState(getLeft);

  useEffect(() => {
    const id = setInterval(() => setLeft(getLeft()), 1_000);
    return () => clearInterval(id);
  }, [getLeft]);

  return left;
}

const pad = (n) => String(n).padStart(2, "0");

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("ar-EG", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const STATUS_CONFIG = {
  upcoming: { label: "قادمة", className: styles.badgeUpcoming },
  scheduled: { label: "مجدولة", className: styles.badgeScheduled },
  live: { label: "مباشر", className: styles.badgeLive },
  ended: { label: "منتهية", className: styles.badgeEnded },
  cancelled: { label: "ملغية", className: styles.badgeCancelled },
};

function ExtrasRow({ hasQuiz, hasAssignment, hasReport }) {
  const items = [
    { flag: hasQuiz, icon: <ClipboardList size={13} />, label: "اختبار" },
    { flag: hasAssignment, icon: <BookOpen size={13} />, label: "واجب" },
    { flag: hasReport, icon: <FileText size={13} />, label: "تقرير" },
  ].filter((i) => i.flag);

  if (!items.length) return null;

  return (
    <div className={styles.extrasRow}>
      {items.map((item) => (
        <span key={item.label} className={styles.extraChip}>
          {item.icon}
          {item.label}
        </span>
      ))}
    </div>
  );
}

/**
 * Props:
 *  session  – object from any endpoint (upcoming / scheduled / ended / cancelled / live)
 *  onJoin   – (link) => void        called when teacher clicks "join"
 *  onStart  – (slug) => Promise     called when teacher clicks "start"
 *  onEnd    – (slug) => Promise     called when teacher clicks "end"
 *  loading  – bool                  shows spinner on action buttons
 */
export default function SessionCard({
  session = {},
  onJoin = () => {},
  onStart = () => {},
  onEnd = () => {},
  loading = false,
}) {
  const slug = session.slug || "";
  const title = session.title || session.courseTitle || "جلسة";
  const studentName = session.user?.name || session.student_name || "";
  const studentImage = session.user?.image || session.student_image || "";
  const startTime = session.starts_at || session.start_time || "";
  const endTime = session.ends_at || session.end_time || "";
  const rawStatus = (session.status || "upcoming").toLowerCase();
  const meetingLink = session.zoom_link || session.join_link || "#";
  const duration = session.duration || "";
  const hasQuiz = session.has_quiz || false;
  const hasAssign = session.has_assignment || false;
  const hasReport = session.has_report || false;

  const isLive =
    rawStatus === "live" ||
    (rawStatus === "upcoming" && new Date(startTime) <= Date.now());

  const status = isLive ? "live" : rawStatus;
  const { label: statusLabel, className: badgeCls } =
    STATUS_CONFIG[status] || STATUS_CONFIG.upcoming;

  const { h, m, s } = useCountdown(startTime);
  const showCountdown =
    !isLive && (status === "upcoming" || status === "scheduled");

  return (
    <div className={`${styles.card} ${styles[`card_${status}`] || ""}`}>
      <span className={`${styles.statusBadge} ${badgeCls}`}>
        {status === "live" && <span className={styles.liveDot} />}
        {statusLabel}
      </span>

      <div className={styles.headerRow}>
        <div className={styles.mainInfo}>
          <h3 className={styles.courseTitle}>{title}</h3>
          {studentName && (
            <p className={styles.studentName}>مع الطالب: {studentName}</p>
          )}
        </div>

        {studentImage && (
          <img
            src={studentImage}
            alt={studentName}
            className={styles.avatar}
            onError={(e) => {
              e.target.src = "/default-avatar.png";
            }}
          />
        )}
      </div>

      <div className={styles.metaGrid}>
        <div className={styles.metaItem}>
          <Calendar size={14} className={styles.metaIcon} />
          <span className={styles.metaText}>{formatDate(startTime)}</span>
        </div>

        {duration ? (
          <div className={styles.metaItem}>
            <Clock size={14} className={styles.metaIcon} />
            <span className={styles.metaText}>{duration} دقيقة</span>
          </div>
        ) : null}
      </div>

      {showCountdown && (
        <div className={styles.countdownBox}>
          <Clock size={14} className={styles.countdownIcon} />
          <span className={styles.countdownLabel}>يبدأ خلال</span>
          <span className={styles.countdown} dir="ltr">
            {pad(h)}:{pad(m)}:{pad(s)}
          </span>
        </div>
      )}

      <ExtrasRow
        hasQuiz={hasQuiz}
        hasAssignment={hasAssign}
        hasReport={hasReport}
      />

      <div className={styles.footerRow}>
        {status === "live" && (
          <>
            <button
              className={`${styles.actionBtn} ${styles.btnJoin}`}
              onClick={() => onJoin(meetingLink)}
              disabled={loading}
            >
              <Video size={15} />
              انضم للجلسة الآن
            </button>

            <button
              className={`${styles.actionBtn} ${styles.btnEnd}`}
              onClick={() => onEnd(slug)}
              disabled={loading}
            >
              <StopCircle size={15} />
              إنهاء الجلسة
            </button>
          </>
        )}

        {(status === "scheduled" || status === "upcoming") && !isLive && (
          <button
            className={`${styles.actionBtn} ${styles.btnStart}`}
            onClick={() => onStart(slug)}
            disabled={loading}
          >
            {loading ? (
              <span className={styles.spinner} />
            ) : (
              <Video size={15} />
            )}
            بدء الجلسة
          </button>
        )}

        {status === "ended" && (
          <div className={styles.endedTag}>
            <CheckCircle size={14} />
            انتهت الجلسة
          </div>
        )}

        {status === "cancelled" && (
          <div className={styles.cancelledTag}>
            <XCircle size={14} />
            تم الإلغاء
          </div>
        )}
      </div>
    </div>
  );
}
