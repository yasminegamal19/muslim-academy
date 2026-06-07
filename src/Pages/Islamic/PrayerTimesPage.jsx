import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./PrayerTimesPage.module.css";
import { ChevronRight } from "lucide-react";

const PRAYERS = [
  { name: "الفجر", time: "04:55", icon: "🌙" },
  { name: "الشروق", time: "06:22", icon: "🌅" },
  { name: "الظهر", time: "11:38", isCurrent: true, icon: "☀️" },
  { name: "العصر", time: "15:10", icon: "🌤️" },
  { name: "المغرب", time: "17:44", icon: "🌇" },
  { name: "العشاء", time: "19:08", icon: "🌃" },
];

function AnalogClock({ timeStr }) {
  const [date, setDate] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const h = date.getHours() % 12;
  const m = date.getMinutes();
  const s = date.getSeconds();
  const hourDeg = h * 30 + m * 0.5;
  const minuteDeg = m * 6 + s * 0.1;
  const secondDeg = s * 6;

  return (
    <div className={styles.clockWrap}>
      <svg viewBox="0 0 160 160" className={styles.clockSvg}>
        <circle
          cx="80"
          cy="80"
          r="76"
          fill="#fff"
          stroke="#8bc34a"
          strokeWidth="4"
        />
        {[...Array(12)].map((_, i) => {
          const angle = (i * 30 - 90) * (Math.PI / 180);
          const r1 = 64,
            r2 = 70;
          return (
            <line
              key={i}
              x1={80 + r1 * Math.cos(angle)}
              y1={80 + r1 * Math.sin(angle)}
              x2={80 + r2 * Math.cos(angle)}
              y2={80 + r2 * Math.sin(angle)}
              stroke="#8bc34a"
              strokeWidth="2"
              strokeLinecap="round"
            />
          );
        })}
        {/* Hour hand */}
        <line
          x1="80"
          y1="80"
          x2={80 + 38 * Math.sin((hourDeg * Math.PI) / 180)}
          y2={80 - 38 * Math.cos((hourDeg * Math.PI) / 180)}
          stroke="#1a1f1c"
          strokeWidth="4"
          strokeLinecap="round"
        />
        {/* Minute hand */}
        <line
          x1="80"
          y1="80"
          x2={80 + 52 * Math.sin((minuteDeg * Math.PI) / 180)}
          y2={80 - 52 * Math.cos((minuteDeg * Math.PI) / 180)}
          stroke="#1a1f1c"
          strokeWidth="3"
          strokeLinecap="round"
        />
        {/* Second hand */}
        <line
          x1="80"
          y1="80"
          x2={80 + 56 * Math.sin((secondDeg * Math.PI) / 180)}
          y2={80 - 56 * Math.cos((secondDeg * Math.PI) / 180)}
          stroke="#8bc34a"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="80" cy="80" r="4" fill="#8bc34a" />
      </svg>
    </div>
  );
}

export default function PrayerTimesPage() {
  const navigate = useNavigate();
  const [muteState, setMuteState] = useState({});
  const today = new Date().toLocaleDateString("ar-EG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const toggleMute = (idx) => setMuteState((p) => ({ ...p, [idx]: !p[idx] }));

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* ── Header ── */}
        <div className={styles.header}>
          <button className={styles.backBtn} onClick={() => navigate(-1)}>
            <ChevronRight size={20} />
          </button>
          <h1 className={styles.title}>
            <span className={styles.titleIcon}>🕐</span> مواقيت الصلاة
          </h1>
        </div>

        {/* ── Date & Location ── */}
        <div className={styles.meta}>
          <div>
            <span className={styles.metaLabel}>المكان</span>
            <span className={styles.metaValue}>القاهرة، مصر</span>
          </div>
          <div>
            <span className={styles.metaLabel}>التاريخ</span>
            <span className={styles.metaValue}>{today}</span>
          </div>
        </div>

        {/* ── Clock ── */}
        <AnalogClock />

        {/* ── Next prayer ── */}
        <p className={styles.nextLabel}>
          الوقت المتبقي لصلاة{" "}
          <span className={styles.nextHighlight}>الظهر</span>
        </p>

        {/* ── Prayers list ── */}
        <div className={styles.list}>
          {PRAYERS.map((p, i) => (
            <div
              key={i}
              className={`${styles.listItem} ${p.isCurrent ? styles.listItemActive : ""}`}
            >
              <button
                className={styles.muteBtn}
                onClick={() => toggleMute(i)}
                aria-label="toggle sound"
              >
                {muteState[i] ? "🔇" : "🔊"}
              </button>
              <span
                className={`${styles.prayerTime} ${p.isCurrent ? styles.prayerTimeCurrent : ""}`}
              >
                {p.time}
              </span>
              <div className={styles.prayerMeta}>
                <span className={styles.prayerIcon}>{p.icon}</span>
                <span className={styles.prayerName}>{p.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
