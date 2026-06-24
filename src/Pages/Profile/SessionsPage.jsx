import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../store/slices/authSlice";
import styles from "./SessionsPage.module.css";
import {
  ArrowRight,
  Calendar,
  Clock,
  User,
  Video,
  X,
  AlertCircle,
  BookOpen,
  FileText,
  ClipboardList,
} from "lucide-react";

const TABS = [
  {
    key: "upcoming",
    label: "القادمة",
    endpoint: "/api/sessions/upcoming",
    single: true,
  },
  {
    key: "scheduled",
    label: "المجدولة",
    endpoint: "/api/sessions/scheduled",
    single: false,
  },
  {
    key: "pending",
    label: "معلقة",
    endpoint: "/api/sessions/pending",
    single: false,
  },
  {
    key: "ended",
    label: "المنتهية",
    endpoint: "/api/sessions/ended",
    single: false,
  },
  {
    key: "cancelled",
    label: "الملغية",
    endpoint: "/api/sessions/cancelled",
    single: false,
  },
];

function formatDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatTime(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" });
}

function StatusBadge({ status }) {
  const map = {
    live: { label: "مباشر الآن", cls: styles.badgeLive },
    scheduled: { label: "مجدولة", cls: styles.badgeScheduled },
    pending: { label: "معلقة", cls: styles.badgePending },
    ended: { label: "منتهية", cls: styles.badgeEnded },
    cancelled: { label: "ملغية", cls: styles.badgeCancelled },
    Ended: { label: "منتهية", cls: styles.badgeEnded },
    Cancelled: { label: "ملغية", cls: styles.badgeCancelled },
  };
  const info = map[status] ?? { label: status, cls: styles.badgeDefault };
  return <span className={`${styles.badge} ${info.cls}`}>{info.label}</span>;
}

function CancelModal({ session, onClose, onSuccess }) {
  const [reason, setReason] = useState("");
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!reason.trim()) {
      setError("من فضلك اكتب سبب الإلغاء");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const body = new FormData();
      body.append("reason", reason);
      if (rescheduleDate) body.append("reschedule_date", rescheduleDate);
      if (rescheduleTime) body.append("reschedule_time", rescheduleTime);

      await api.post(`/api/sessions/${session.slug}/cancel`, body);
      onSuccess();
    } catch (e) {
      setError(e?.response?.data?.message || "حدث خطأ، حاول مرة أخرى");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modal}
        dir="rtl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>إلغاء الحصة</h2>
          <button className={styles.modalClose} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.sessionSummary}>
            <p className={styles.sessionSummaryTitle}>
              {session.title || "الحصة"}
            </p>
            <p className={styles.sessionSummaryDate}>
              {formatDate(session.starts_at)} — {formatTime(session.starts_at)}
            </p>
          </div>

          <label className={styles.fieldLabel}>
            سبب الإلغاء <span className={styles.required}>*</span>
          </label>
          <textarea
            className={styles.textarea}
            placeholder="اكتب سبب الإلغاء هنا..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
          />

          <p className={styles.rescheduleNote}>
            هل تريد طلب معاد بديل؟ (اختياري)
          </p>

          <div className={styles.row}>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>التاريخ</label>
              <input
                type="date"
                className={styles.input}
                value={rescheduleDate}
                onChange={(e) => setRescheduleDate(e.target.value)}
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>الوقت</label>
              <input
                type="time"
                className={styles.input}
                value={rescheduleTime}
                onChange={(e) => setRescheduleTime(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className={styles.errorMsg}>
              <AlertCircle size={16} /> {error}
            </div>
          )}
        </div>

        <div className={styles.modalFooter}>
          <button
            className={styles.btnCancel}
            onClick={onClose}
            disabled={loading}
          >
            تراجع
          </button>
          <button
            className={styles.btnConfirm}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "جارى الإلغاء..." : "تأكيد الإلغاء"}
          </button>
        </div>
      </div>
    </div>
  );
}

function SessionCard({ session, tabKey, onCancelClick, onJoinClick }) {
  const canCancel = tabKey === "upcoming" || tabKey === "scheduled";
  const canJoin = tabKey === "upcoming" && session.status === "live";

  return (
    <div className={styles.card}>
      <div className={styles.cardTop}>
        <div className={styles.teacherInfo}>
          {session.teacher?.image ? (
            <img
              src={session.teacher.image}
              alt={session.teacher.name}
              className={styles.teacherAvatar}
            />
          ) : (
            <div className={styles.avatarFallback}>
              <User size={18} />
            </div>
          )}
          <span className={styles.teacherName}>{session.teacher?.name}</span>
        </div>
        <StatusBadge status={session.status} />
      </div>

      {session.title && <p className={styles.sessionTitle}>{session.title}</p>}

      <div className={styles.metaRow}>
        <Calendar size={15} className={styles.metaIcon} />
        <span>{formatDate(session.starts_at)}</span>
      </div>
      <div className={styles.metaRow}>
        <Clock size={15} className={styles.metaIcon} />
        <span>
          {formatTime(session.starts_at)} — {formatTime(session.ends_at)}
        </span>
        <span className={styles.duration}>({session.duration} دقيقة)</span>
      </div>

      {(session.has_quiz || session.has_assignment || session.has_report) && (
        <div className={styles.extrasRow}>
          {session.has_quiz && (
            <span className={styles.extraTag}>
              <ClipboardList size={13} /> اختبار
            </span>
          )}
          {session.has_assignment && (
            <span className={styles.extraTag}>
              <FileText size={13} /> واجب
            </span>
          )}
          {session.has_report && (
            <span className={styles.extraTag}>
              <BookOpen size={13} /> تقرير
            </span>
          )}
        </div>
      )}

      {(canJoin || canCancel) && (
        <div className={styles.cardActions}>
          {canJoin && (
            <button
              className={styles.btnJoin}
              onClick={() => onJoinClick(session)}
            >
              <Video size={16} /> انضم الآن
            </button>
          )}
          {canCancel && (
            <button
              className={styles.btnCancelCard}
              onClick={() => onCancelClick(session)}
            >
              إلغاء الحصة
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function SessionsPage() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("upcoming");
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cancelTarget, setCancelTarget] = useState(null);

  const currentTab = TABS.find((t) => t.key === activeTab);

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    setError("");
    setSessions([]);
    try {
      const res = await api.get(currentTab.endpoint);
      const raw = res.data?.data;
      if (currentTab.single) {
        setSessions(raw ? [raw] : []);
      } else {
        setSessions(Array.isArray(raw) ? raw : []);
      }
    } catch (e) {
      setError(e?.response?.data?.message || "تعذّر تحميل الحصص");
    } finally {
      setLoading(false);
    }
  }, [activeTab]); 

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const handleJoin = async (session) => {
    try {
      const res = await api.post(`/api/sessions/${session.slug}/join`);
      const link = res.data?.data?.join_link;
      if (link) window.open(link, "_blank");
    } catch (e) {
      alert(e?.response?.data?.message || "تعذّر الانضمام للحصة");
    }
  };

  const handleCancelSuccess = () => {
    setCancelTarget(null);
    fetchSessions();
  };

  return (
    <div className={styles.page} dir="rtl">
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <ArrowRight size={22} />
        </button>
        <h1 className={styles.headerTitle}>حصصي</h1>
      </div>

      <div className={styles.tabsWrapper}>
        <div className={styles.tabs}>
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`${styles.tab} ${activeTab === tab.key ? styles.tabActive : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.content}>
        {loading && (
          <div className={styles.center}>
            <div className={styles.spinner} />
            <p className={styles.loadingText}>جارى التحميل...</p>
          </div>
        )}

        {!loading && error && (
          <div className={styles.center}>
            <AlertCircle size={40} className={styles.errorIcon} />
            <p className={styles.errorText}>{error}</p>
            <button className={styles.retryBtn} onClick={fetchSessions}>
              إعادة المحاولة
            </button>
          </div>
        )}

        {!loading && !error && sessions.length === 0 && (
          <div className={styles.center}>
            <Calendar size={48} className={styles.emptyIcon} />
            <p className={styles.emptyText}>لا توجد حصص في هذا القسم</p>
          </div>
        )}

        {!loading &&
          !error &&
          sessions.map((s, i) => (
            <SessionCard
              key={s.slug || s.id || i}
              session={s}
              tabKey={activeTab}
              onCancelClick={setCancelTarget}
              onJoinClick={handleJoin}
            />
          ))}
      </div>

      {cancelTarget && (
        <CancelModal
          session={cancelTarget}
          onClose={() => setCancelTarget(null)}
          onSuccess={handleCancelSuccess}
        />
      )}
    </div>
  );
}
