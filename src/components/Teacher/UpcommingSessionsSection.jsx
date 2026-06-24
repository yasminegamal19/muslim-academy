import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CalendarClock } from "lucide-react";
import SessionCard from "../../Pages/Teacher/Sessions/SessionCard";
import { fetchUpcomingSessions, startSession, endSession } from "../../Services/sessionsApi";
import styles from "./UpcomingSessionsSection.module.css";

function SkeletonCard() {
  return <div className={styles.skeleton} />;
}

export default function UpcomingSessionsSection() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetchUpcomingSessions(1);
        setSessions((res.data || []).slice(0, 4));
        setTotal(res.pagination?.total ?? 0);
      } catch (err) {
        setError(err.message || "تعذّر تحميل الجلسات");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleStart = async (slug) => {
    setActionLoading(true);
    try {
      const res = await startSession(slug);
      const joinLink = res.data?.join_link;
      if (joinLink) window.open(joinLink, "_blank", "noopener,noreferrer");
      setSessions((prev) =>
        prev.map((s) =>
          s.slug === slug ? { ...s, status: "live", join_link: joinLink } : s,
        ),
      );
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
      setSessions((prev) => prev.filter((s) => s.slug !== slug));
    } catch (err) {
      alert(err.message || "تعذّر إنهاء الجلسة");
    } finally {
      setActionLoading(false);
    }
  };

  const handleJoin = (link) => {
    if (link && link !== "#")
      window.open(link, "_blank", "noopener,noreferrer");
  };

  if (!loading && !error && sessions.length === 0) return null;

  return (
    <section className={styles.section} dir="rtl">
      <div className={styles.sectionHeader}>
        <div className={styles.titleGroup}>
          <CalendarClock size={20} className={styles.titleIcon} />
          <h2 className={styles.sectionTitle}>الجلسات القادمة</h2>
          {total > 0 && <span className={styles.totalBadge}>{total}</span>}
        </div>

        {total > 4 && (
          <button
            className={styles.viewAllBtn}
            onClick={() => navigate("/sessions")}
          >
            عرض المزيد
            <ArrowLeft size={15} />
          </button>
        )}
      </div>

      {error && <div className={styles.errorBox}>⚠️ {error}</div>}

      <div className={styles.grid}>
        {loading
          ? [...Array(4)].map((_, i) => <SkeletonCard key={i} />)
          : sessions.map((session, idx) => (
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

      {!loading && total > 4 && (
        <div className={styles.viewAllBottom}>
          <button
            className={styles.viewAllBtnFull}
            onClick={() => navigate("/sessions")}
          >
            عرض جميع الجلسات ({total})
            <ArrowLeft size={15} />
          </button>
        </div>
      )}
    </section>
  );
}
