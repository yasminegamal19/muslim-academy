import { useState, useEffect, useRef } from "react";
import { Calendar, Clock, Users, Wifi } from "lucide-react";
import styles from "./SessionCountdown.module.css";

function pad(n) {
  return String(n).padStart(2, "0");
}

function useCountdown(targetDate) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const tick = () => {
      const diff = targetDate - Date.now();
      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        hours: Math.floor(diff / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  return timeLeft;
}

export function SessionCountdown({ session }) {
  const targetRef = useRef(
    session?.targetDate ||
      new Date(Date.now() + 2 * 3600000 + 59 * 60000 + 59000),
  );
  const { hours, minutes, seconds } = useCountdown(targetRef.current);

  return (
    <section className={styles.section}>
      {/* Header */}
      <div className={styles.head}>
        <div>
          <p className={styles.eyebrow}>لا تفوّت أي جلسة</p>
          <h2 className={styles.title}>الجلسة القادمة</h2>
        </div>
        <a href="/sessions" className={styles.viewAll}>
          عرض كل الجلسات ←
        </a>
      </div>

      {/* Card */}
      <div className={styles.card}>
        {/* Decorative dots */}
        <div className={styles.cardBg}>
          <svg width="100%" height="100%">
            <defs>
              <pattern
                id="sdots"
                x="0"
                y="0"
                width="30"
                height="30"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="15" cy="15" r="1.5" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#sdots)" />
          </svg>
        </div>

        <div className={styles.cardInner}>
          {/* Info */}
          <div className={styles.info}>
            <div className={styles.badges}>
              <span className={styles.badgeLive}>
                <span className={styles.badgeLiveDot} />
                بث مباشر قادم
              </span>
              <span className={styles.badgeFree}>مجاني</span>
            </div>

            <h3 className={styles.cardTitle}>
              {session?.title || "دورة تعلّم القرآن الكريم عبر الإنترنت"}
            </h3>

            <p className={styles.cardTeacher}>
              مع {session?.teacher || "الشيخ أحمد محمد"} — دراسات القرآن
              والتجويد
            </p>

            <div className={styles.details}>
              <span className={styles.detailItem}>
                <Calendar size={15} />
                {session?.date || "الاثنين 25 يناير"}
              </span>
              <span className={styles.detailItem}>
                <Clock size={15} />
                {session?.time || "الساعة 08:00 مساءً"}
              </span>
              <span className={styles.detailItem}>
                <Users size={15} />
                {session?.students || 240} مسجّل
              </span>
            </div>

            <button className={styles.joinBtn}>
              <Wifi size={18} />
              انضم للجلسة الآن
            </button>
          </div>

          {/* Countdown */}
          <div className={styles.countdown}>
            <p className={styles.countdownLabel}>تبدأ بعد</p>

            <div className={styles.countdownSlots}>
              <div className={styles.countdownSlot}>
                <div className={styles.countdownBox}>{pad(hours)}</div>
                <span className={styles.countdownUnit}>ساعة</span>
              </div>
              <span className={styles.countdownSep}>:</span>
              <div className={styles.countdownSlot}>
                <div className={styles.countdownBox}>{pad(minutes)}</div>
                <span className={styles.countdownUnit}>دقيقة</span>
              </div>
              <span className={styles.countdownSep}>:</span>
              <div className={styles.countdownSlot}>
                <div className={styles.countdownBox}>{pad(seconds)}</div>
                <span className={styles.countdownUnit}>ثانية</span>
              </div>
            </div>

            <div className={styles.avatarsRow}>
              <div className={styles.avatarStack}>
                {["#4e9b5c", "#f5c518", "#3a7d44", "#a5d6a7"].map((c, i) => (
                  <span
                    key={i}
                    className={styles.avatarCircle}
                    style={{ background: c }}
                  />
                ))}
              </div>
              <span className={styles.avatarsText}>
                +{session?.students || 240} سيحضر
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
