import { useState, useEffect, useCallback } from "react";
import { CalendarClock, CalendarCheck, CalendarX, Radio, RefreshCw } from "lucide-react";
import SessionCard from "./SessionCard";
import {
  fetchUpcomingSessions,
  fetchScheduledSessions,
  fetchEndedSessions,
  fetchCancelledSessions,
  startSession,
  endSession,
} from "../../../Services/sessionsApi";
import styles from "./SessionsPage.module.css";

const TABS = [
  { id: "upcoming",  label: "القادمة",   icon: <Radio       size={16} />, fetchFn: fetchUpcomingSessions  },
  { id: "scheduled", label: "المجدولة",  icon: <CalendarClock size={16} />, fetchFn: fetchScheduledSessions },
  { id: "ended",     label: "المنتهية",  icon: <CalendarCheck size={16} />, fetchFn: fetchEndedSessions     },
  { id: "cancelled", label: "الملغية",   icon: <CalendarX   size={16} />, fetchFn: fetchCancelledSessions  },
];

function EmptyState({ tabLabel }) {
  return (
    <div className={styles.emptyState}>
      <div className={styles.emptyIcon}>📭</div>
      <p className={styles.emptyText}>لا توجد حصص {tabLabel} حالياً</p>
    </div>
  );
}

function SkeletonCard() {
  return <div className={styles.skeleton} />;
}

function Pagination({ pagination, onPageChange }) {
  if (!pagination || pagination.last_page <= 1) return null;
  const { current_page, last_page } = pagination;

  return (
    <div className={styles.pagination}>
      <button
        className={styles.pageBtn}
        disabled={current_page === 1}
        onClick={() => onPageChange(current_page - 1)}
      >
        السابق
      </button>

      <span className={styles.pageInfo}>
        {current_page} / {last_page}
      </span>

      <button
        className={styles.pageBtn}
        disabled={current_page === last_page}
        onClick={() => onPageChange(current_page + 1)}
      >
        التالي
      </button>
    </div>
  );
}

export default function SessionsPage() {
  const [activeTab, setActiveTab]   = useState("upcoming");
  const [sessions,  setSessions]    = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page,      setPage]        = useState(1);
  const [loading,   setLoading]     = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error,     setError]       = useState(null);

  const [counts, setCounts] = useState({});

  const loadSessions = useCallback(async (tab, p = 1) => {
    const tabConfig = TABS.find((t) => t.id === tab);
    if (!tabConfig) return;

    setLoading(true);
    setError(null);

    try {
      const res = await tabConfig.fetchFn(p);
      setSessions(res.data || []);
      setPagination(res.pagination || null);
    } catch (err) {
      setError(err.message || "حدث خطأ أثناء تحميل الحصص");
      setSessions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const results = await Promise.allSettled(
          TABS.map((t) => t.fetchFn(1))
        );
        const newCounts = {};
        results.forEach((r, i) => {
          if (r.status === "fulfilled") {
            newCounts[TABS[i].id] = r.value.pagination?.total ?? 0;
          }
        });
        setCounts(newCounts);
      } catch (_) {}
    };
    fetchCounts();
  }, []);

  useEffect(() => {
    loadSessions(activeTab, page);
  }, [activeTab, page, loadSessions]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setPage(1);
    setSessions([]);
  };

  const handleStart = async (slug) => {
    setActionLoading(true);
    try {
      const res = await startSession(slug);
      const joinLink = res.data?.join_link;
      if (joinLink) window.open(joinLink, "_blank", "noopener,noreferrer");
      await loadSessions(activeTab, page);
    } catch (err) {
      alert(err.message || "تعذّر بدء الجلسة");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEnd = async (slug) => {
    if (!window.confirm("هل أنت متأكد من إنهاء الجلسة؟")) return;
    setActionLoading(true);
    try {
      await endSession(slug);
      await loadSessions(activeTab, page);
    } catch (err) {
      alert(err.message || "تعذّر إنهاء الجلسة");
    } finally {
      setActionLoading(false);
    }
  };

  const handleJoin = (link) => {
    if (link && link !== "#") window.open(link, "_blank", "noopener,noreferrer");
  };

  return (
    <div className={styles.page} dir="rtl">

      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>حصصي</h1>
        <button
          className={styles.refreshBtn}
          onClick={() => loadSessions(activeTab, page)}
          disabled={loading}
          title="تحديث"
        >
          <RefreshCw size={16} className={loading ? styles.spinning : ""} />
        </button>
      </div>

      <div className={styles.tabsWrapper}>
        <div className={styles.tabs}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ""}`}
              onClick={() => handleTabChange(tab.id)}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {counts[tab.id] != null && (
                <span className={styles.tabCount}>{counts[tab.id]}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.content}>

        {error && (
          <div className={styles.errorBox}>
            ⚠️ {error}
            <button onClick={() => loadSessions(activeTab, page)} className={styles.retryBtn}>
              إعادة المحاولة
            </button>
          </div>
        )}

        {loading && !error && (
          <div className={styles.grid}>
            {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {!loading && !error && sessions.length > 0 && (
          <div className={styles.grid}>
            {sessions.map((session, idx) => (
              <SessionCard
                key={session.slug || session.id || idx}
                session={session}
                onJoin={handleJoin}
                onStart={handleStart}
                onEnd={handleEnd}
                loading={actionLoading}
              />
            ))}
          </div>
        )}

        {!loading && !error && sessions.length === 0 && (
          <EmptyState tabLabel={TABS.find((t) => t.id === activeTab)?.label} />
        )}

        {!loading && (
          <Pagination pagination={pagination} onPageChange={setPage} />
        )}
      </div>
    </div>
  );
}