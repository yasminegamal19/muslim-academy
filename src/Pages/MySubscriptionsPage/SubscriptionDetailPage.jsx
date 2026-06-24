

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ChevronLeft,
  BookOpen,
  Clock,
  Calendar,
  CheckCircle,
  AlertCircle,
  Timer,
  ClipboardList,
  FileCheck2,
  BarChart3,
  Wifi,
  Info,
} from "lucide-react";
import { api } from "../../store/slices/authSlice";
import styles from "./SubscriptionDetailPage.module.css";


function formatScheduleDays(daysObj) {
  if (!daysObj) return "—";
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
  if (!timeStr) return "—";
  const [h, m] = timeStr.split(":");
  const hour = parseInt(h, 10);
  const suffix = hour >= 12 ? "م" : "ص";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${m} ${suffix}`;
}

function formatDateTime(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return (
    d.toLocaleDateString("ar-EG", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }) +
    " — " +
    d.toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" })
  );
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

const SESSION_MAP = {
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


export default function SubscriptionDetailPage() {
  const navigate = useNavigate();
  const { subscriptionId } = useParams();

  const [sub, setSub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!subscriptionId) return;
    (async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/subscriptions/${subscriptionId}`);
        if (res.data?.code === 200 && res.data?.data) {
          setSub(res.data.data);
        } else {
          setError(res.data?.message || "حدث خطأ أثناء جلب التفاصيل.");
        }
      } catch {
        setError("فشل الاتصال بالسيرفر.");
      } finally {
        setLoading(false);
      }
    })();
  }, [subscriptionId]);

  if (loading) {
    return (
      <div className={styles.page} dir="rtl">
        <div className={styles.centerState}>
          <div className={styles.spinner} />
          <p>جاري تحميل التفاصيل…</p>
        </div>
      </div>
    );
  }

  if (error || !sub) {
    return (
      <div className={styles.page} dir="rtl">
        <button
          className={styles.backLink}
          onClick={() => navigate("/my-subscriptions")}
        >
          <ChevronLeft size={18} /> <span>اشتراكاتي</span>
        </button>
        <div className={styles.centerState}>
          <Wifi size={40} className={styles.errorIcon} />
          <p className={styles.errorText}>
            {error || "لم يتم العثور على الاشتراك."}
          </p>
        </div>
      </div>
    );
  }

  const statusCfg = STATUS_MAP[sub.status] || STATUS_MAP.Pending;
  const paymentCfg = PAYMENT_MAP[sub.payment_status] || PAYMENT_MAP.Pending;
  const days = formatScheduleDays(sub.schedule_days);
  const time = formatTime(sub.schedule_time);
  const sessions = sub.sessions || [];

  const scheduledSessions = sessions.filter((s) => s.status === "scheduled");
  const endedSessions = sessions.filter((s) => s.status === "ended");
  const cancelledSessions = sessions.filter((s) => s.status === "cancelled");

  return (
    <div className={styles.page} dir="rtl">
      <button
        className={styles.backLink}
        onClick={() => navigate("/my-subscriptions")}
      >
        <ChevronLeft size={18} /> <span>اشتراكاتي</span>
      </button>

      <div className={styles.courseHeader}>
        {sub.course?.image ? (
          <img
            src={sub.course.image}
            alt={sub.course.name}
            className={styles.courseImg}
          />
        ) : (
          <div className={styles.courseImgPlaceholder}>
            <BookOpen size={28} strokeWidth={1.5} />
          </div>
        )}
        <div className={styles.courseHeaderInfo}>
          <h1 className={styles.courseName}>
            {sub.course?.name || "دورة تعليمية"}
          </h1>
          {sub.plan && <p className={styles.planName}>{sub.plan.title}</p>}
          <div className={styles.badgesRow}>
            <span
              className={styles.badge}
              style={{ color: statusCfg.color, background: statusCfg.bg }}
            >
              {statusCfg.label}
            </span>
            <span
              className={styles.badge}
              style={{ color: paymentCfg.color, background: paymentCfg.bg }}
            >
              الدفع: {paymentCfg.label}
            </span>
            {sub.is_trial && (
              <span
                className={styles.badge}
                style={{ color: "#6d28d9", background: "#ede9fe" }}
              >
                تجريبي
              </span>
            )}
          </div>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <StatCard
          icon={<Timer size={18} />}
          value={`${sub.session_duration} دق`}
          label="مدة الحصة"
          color="#1d4ed8"
          bg="#dbeafe"
        />
        <StatCard
          icon={<Calendar size={18} />}
          value={days}
          label="أيام الأسبوع"
          color="#166534"
          bg="#dcfce7"
        />
        <StatCard
          icon={<Clock size={18} />}
          value={time}
          label="وقت الحصة"
          color="#7c3aed"
          bg="#ede9fe"
        />
        <StatCard
          icon={<BookOpen size={18} />}
          value={sub.remaining_session ?? 0}
          label="حصص متبقية"
          color="#92400e"
          bg="#fef3c7"
        />
      </div>

      <div className={styles.statsGrid} style={{ marginTop: 8 }}>
        <StatCard
          icon={<CheckCircle size={18} />}
          value={sub.completed_sessions ?? 0}
          label="مكتملة"
          color="#166534"
          bg="#dcfce7"
        />
        <StatCard
          icon={<Timer size={18} />}
          value={sub.pending_sessions ?? 0}
          label="قادمة"
          color="#1d4ed8"
          bg="#dbeafe"
        />
        <StatCard
          icon={<AlertCircle size={18} />}
          value={sub.cancelled_sessions ?? 0}
          label="ملغاة"
          color="#991b1b"
          bg="#fee2e2"
        />
        <StatCard
          icon={<Info size={18} />}
          value={sub.no_sessions ?? 0}
          label="إجمالي الحصص"
          color="#6b7280"
          bg="#f3f4f6"
        />
      </div>

      {sub.plan && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>تفاصيل الخطة</h2>
          <div className={styles.planCard}>
            <div className={styles.planRow}>
              <span className={styles.planLabel}>اسم الخطة</span>
              <span className={styles.planValue}>{sub.plan.title}</span>
            </div>
            <div className={styles.planRow}>
              <span className={styles.planLabel}>حصص / أسبوع</span>
              <span className={styles.planValue}>
                {sub.plan.sessions_per_week}
              </span>
            </div>
            <div className={styles.planRow}>
              <span className={styles.planLabel}>حصص / شهر</span>
              <span className={styles.planValue}>
                {sub.plan.sessions_per_month}
              </span>
            </div>
            <div className={styles.planRow}>
              <span className={styles.planLabel}>تاريخ الاشتراك</span>
              <span className={styles.planValue}>
                {formatDate(sub.subscribed_at)}
              </span>
            </div>
            {sub.accepted_at && (
              <div className={styles.planRow}>
                <span className={styles.planLabel}>تاريخ القبول</span>
                <span className={styles.planValue}>
                  {formatDate(sub.accepted_at)}
                </span>
              </div>
            )}
            {sub.timezone && (
              <div className={styles.planRow}>
                <span className={styles.planLabel}>المنطقة الزمنية</span>
                <span className={styles.planValue}>{sub.timezone}</span>
              </div>
            )}
            {sub.plan.description && (
              <p className={styles.planDesc}>{sub.plan.description}</p>
            )}
          </div>
        </div>
      )}

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>
          الحصص
          <span className={styles.sessionCount}>{sessions.length} حصة</span>
        </h2>

        {sessions.length === 0 ? (
          <div className={styles.emptySession}>
            <Info size={20} />
            <span>لم يتم تحديد حصص بعد، سيتواصل معك المعلم قريباً</span>
          </div>
        ) : (
          <div className={styles.sessionsList}>
            {scheduledSessions.length > 0 && (
              <SectionGroup
                title="الحصص القادمة"
                sessions={scheduledSessions}
                cfg={SESSION_MAP.scheduled}
              />
            )}
            {endedSessions.length > 0 && (
              <SectionGroup
                title="الحصص المكتملة"
                sessions={endedSessions}
                cfg={SESSION_MAP.ended}
              />
            )}
            {cancelledSessions.length > 0 && (
              <SectionGroup
                title="الحصص الملغاة"
                sessions={cancelledSessions}
                cfg={SESSION_MAP.cancelled}
              />
            )}
          </div>
        )}
      </div>

      {sub.course?.description && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>عن الدورة</h2>
          <p className={styles.courseDesc}>{sub.course.description}</p>
        </div>
      )}
    </div>
  );
}


function StatCard({ icon, value, label, color, bg }) {
  return (
    <div className={styles.statCard} style={{ borderColor: color + "22" }}>
      <div className={styles.statCardIcon} style={{ color, background: bg }}>
        {icon}
      </div>
      <span className={styles.statCardValue} style={{ color }}>
        {value}
      </span>
      <span className={styles.statCardLabel}>{label}</span>
    </div>
  );
}

function SectionGroup({ title, sessions, cfg }) {
  const { Icon } = cfg;

  return (
    <div className={styles.sessionGroup}>
      <h3 className={styles.groupTitle} style={{ color: cfg.color }}>
        <Icon size={15} />
        {title}
        <span className={styles.groupCount}>{sessions.length}</span>
      </h3>

      {sessions.map((session) => (
        <div key={session.slug} className={styles.sessionItem}>
          <div
            className={styles.sessionDot}
            style={{ background: cfg.color }}
          />
          <div className={styles.sessionInfo}>
            <div className={styles.sessionTopRow}>
              <span className={styles.sessionTitle}>{session.title}</span>
              <span
                className={styles.sessionBadge}
                style={{ color: cfg.color, background: cfg.bg }}
              >
                {cfg.label}
              </span>
            </div>
            <span className={styles.sessionDate}>
              {formatDateTime(session.starts_at)}
            </span>
            <span className={styles.sessionDuration}>
              المدة: {session.duration} دقيقة
            </span>

            <div className={styles.sessionTags}>
              {session.has_quiz && (
                <span className={styles.tag}>
                  <FileCheck2 size={12} /> اختبار
                </span>
              )}
              {session.has_assignment && (
                <span className={styles.tag}>
                  <ClipboardList size={12} /> واجب
                </span>
              )}
              {session.has_report && (
                <span className={styles.tag}>
                  <BarChart3 size={12} /> تقرير
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
