
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Clock,
  Calendar,
  ChevronLeft,
  Plus,
  CheckCircle,
  AlertCircle,
  Timer,
  Wifi,
} from "lucide-react";
import { api } from "../../store/slices/authSlice";
import styles from "./MySubscriptionsPage.module.css";


function formatScheduleDays(daysObj) {
  if (!daysObj) return "";
  const dayNames = {
    Sunday: "الأحد",
    Monday: "الاثنين",
    Tuesday: "الثلاثاء",
    Wednesday: "الأربعاء",
    Thursday: "الخميس",
    Friday: "الجمعة",
    Saturday: "السبت",
  };
  return Object.values(daysObj)
    .map((d) => dayNames[d] || d)
    .join(" • ");
}

function formatTime(timeStr) {
  if (!timeStr) return "";
  const [h, m] = timeStr.split(":");
  const hour = parseInt(h, 10);
  const suffix = hour >= 12 ? "م" : "ص";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${m} ${suffix}`;
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}


const STATUS_MAP = {
  Active: { label: "نشط", color: "#166534", bg: "#dcfce7" },
  Accepted: { label: "مقبول", color: "#166534", bg: "#dcfce7" },
  Pending: { label: "قيد المراجعة", color: "#92400e", bg: "#fef3c7" },
  Expired: { label: "منتهي", color: "#6b7280", bg: "#f3f4f6" },
  Cancelled: { label: "ملغى", color: "#991b1b", bg: "#fee2e2" },
};

const PAYMENT_MAP = {
  paid: { label: "مدفوع", color: "#166534", bg: "#dcfce7" },
  Paid: { label: "مدفوع", color: "#166534", bg: "#dcfce7" },
  Pending: { label: "معلق", color: "#92400e", bg: "#fef3c7" },
  Failed: { label: "فشل", color: "#991b1b", bg: "#fee2e2" },
};

const SESSION_STATUS_MAP = {
  scheduled: { label: "قادمة", color: "#1d4ed8", bg: "#dbeafe", Icon: Timer },
  ended: {
    label: "مكتملة",
    color: "#166534",
    bg: "#dcfce7",
    Icon: CheckCircle,
  },
  cancelled: {
    label: "ملغاة",
    color: "#991b1b",
    bg: "#fee2e2",
    Icon: AlertCircle,
  },
};


export default function MySubscriptionsPage() {
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await api.get("/api/subscriptions");
        if (res.data?.code === 200) {
          setSubscriptions(res.data.data || []);
        } else {
          setError(res.data?.message || "حدث خطأ أثناء جلب الاشتراكات.");
        }
      } catch {
        setError("فشل الاتصال بالسيرفر.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className={styles.page} dir="rtl">
        <div className={styles.centerState}>
          <div className={styles.spinner} />
          <p>جاري تحميل اشتراكاتك…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page} dir="rtl">
        <div className={styles.centerState}>
          <Wifi size={40} className={styles.errorIcon} />
          <p className={styles.errorText}>{error}</p>
          <button
            className={styles.retryBtn}
            onClick={() => window.location.reload()}
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  if (subscriptions.length === 0) {
    return (
      <div className={styles.page} dir="rtl">
        <header className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>اشتراكاتي</h1>
        </header>
        <div className={styles.centerState}>
          <BookOpen size={52} strokeWidth={1.2} className={styles.emptyIcon} />
          <p className={styles.emptyText}>لا توجد اشتراكات بعد</p>
          <button
            className={styles.browseBtn}
            onClick={() => navigate("/courses")}
          >
            <Plus size={16} />
            تصفح الدورات
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page} dir="rtl">
      <header className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>اشتراكاتي</h1>
          <p className={styles.pageSubtitle}>{subscriptions.length} اشتراك</p>
        </div>
      </header>

      <div className={styles.list}>
        {subscriptions.map((sub) => {
          const statusCfg = STATUS_MAP[sub.status] || STATUS_MAP.Pending;
          const paymentCfg =
            PAYMENT_MAP[sub.payment_status] || PAYMENT_MAP.Pending;
          const days = formatScheduleDays(sub.schedule_days);
          const time = formatTime(sub.schedule_time);
          const upcoming = sub.upcoming_session;
          const upcomingCfg = upcoming
            ? SESSION_STATUS_MAP[upcoming.status] ||
              SESSION_STATUS_MAP.scheduled
            : null;

          return (
            <div
              key={sub.id}
              className={styles.card}
              onClick={() => navigate(`/my-subscriptions/${sub.id}`)}
            >
              <div className={styles.cardTop}>
                <div className={styles.courseIconWrap}>
                  <BookOpen size={22} strokeWidth={1.8} />
                </div>
                <div className={styles.cardTopInfo}>
                  <h2 className={styles.courseName}>
                    {sub.course?.name || "دورة تعليمية"}
                  </h2>
                  {sub.plan && (
                    <p className={styles.planName}>{sub.plan.title}</p>
                  )}
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                    alignItems: "flex-end",
                  }}
                >
                  <span
                    className={styles.statusBadge}
                    style={{ color: statusCfg.color, background: statusCfg.bg }}
                  >
                    {statusCfg.label}
                  </span>
                  <span
                    className={styles.statusBadge}
                    style={{
                      color: paymentCfg.color,
                      background: paymentCfg.bg,
                      fontSize: 11,
                    }}
                  >
                    {paymentCfg.label}
                  </span>
                </div>
              </div>

              <div className={styles.statsRow}>
                <div className={styles.stat}>
                  <Clock size={14} />
                  <span>{sub.session_duration} دقيقة / حصة</span>
                </div>
                {days && (
                  <div className={styles.stat}>
                    <Calendar size={14} />
                    <span>{days}</span>
                  </div>
                )}
                {time && (
                  <div className={styles.stat}>
                    <Timer size={14} />
                    <span>{time}</span>
                  </div>
                )}
              </div>

              <div className={styles.sessionsSummary}>
                <div className={styles.summaryItem}>
                  <span
                    className={styles.summaryNum}
                    style={{ color: "#166534" }}
                  >
                    {sub.completed_sessions ?? 0}
                  </span>
                  <span className={styles.summaryLabel}>مكتملة</span>
                </div>
                <div className={styles.summaryDivider} />
                <div className={styles.summaryItem}>
                  <span
                    className={styles.summaryNum}
                    style={{ color: "#1d4ed8" }}
                  >
                    {sub.pending_sessions ?? 0}
                  </span>
                  <span className={styles.summaryLabel}>قادمة</span>
                </div>
                <div className={styles.summaryDivider} />
                <div className={styles.summaryItem}>
                  <span
                    className={styles.summaryNum}
                    style={{ color: "#991b1b" }}
                  >
                    {sub.cancelled_sessions ?? 0}
                  </span>
                  <span className={styles.summaryLabel}>ملغاة</span>
                </div>
                <div className={styles.summaryDivider} />
                <div className={styles.summaryItem}>
                  <span
                    className={styles.summaryNum}
                    style={{ color: "#7c3aed" }}
                  >
                    {sub.remaining_session ?? 0}
                  </span>
                  <span className={styles.summaryLabel}>متبقية</span>
                </div>
              </div>

              {upcoming && upcomingCfg && (
                <div
                  className={styles.nextSession}
                  style={{
                    borderColor: upcomingCfg.color + "33",
                    background: upcomingCfg.bg,
                  }}
                >
                  <upcomingCfg.Icon
                    size={15}
                    style={{ color: upcomingCfg.color, flexShrink: 0 }}
                  />
                  <span
                    className={styles.nextSessionLabel}
                    style={{ color: upcomingCfg.color }}
                  >
                    الحصة القادمة:
                  </span>
                  <span className={styles.nextSessionTitle}>
                    {upcoming.title}
                  </span>
                  <span className={styles.nextSessionDate}>
                    {formatDate(upcoming.starts_at)}
                  </span>
                </div>
              )}

              {!upcoming && (
                <div className={styles.noUpcoming}>
                  <Calendar size={14} />
                  <span>لا توجد حصص قادمة</span>
                </div>
              )}

              <div className={styles.cardFooter}>
                <span className={styles.subscribedAt}>
                  اشتركت في {formatDate(sub.subscribed_at)}
                </span>
                <span className={styles.viewDetails}>
                  عرض التفاصيل
                  <ChevronLeft size={14} />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
