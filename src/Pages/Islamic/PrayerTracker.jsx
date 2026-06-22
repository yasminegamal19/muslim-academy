import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./PrayerTracker.module.css";
import {
  CheckCircle,
  Circle,
  MapPin,
  Calendar,
  Award,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const PRAYER_KEYS = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];
const PRAYER_ICONS = ["🌙", "🌅", "☀️", "🌤️", "🌥️", "🌌"];

const TRACKED_PRAYER_IDS = ["fajr", "dhuhr", "asr", "maghrib", "isha"];
const TRACKED_PRAYER_KEYS = {
  fajr: "Fajr",
  dhuhr: "Dhuhr",
  asr: "Asr",
  maghrib: "Maghrib",
  isha: "Isha",
};
const TRACKED_PRAYER_NAMES = {
  fajr: "الفجر",
  dhuhr: "الظهر",
  asr: "العصر",
  maghrib: "المغرب",
  isha: "العشاء",
};
const TRACKED_PRAYER_IMAGES = {
  fajr: "https://cdn-icons-png.flaticon.com/512/3114/3114793.png",
  dhuhr: "https://cdn-icons-png.flaticon.com/512/3114/3114824.png",
  asr: "https://cdn-icons-png.flaticon.com/512/3114/3114800.png",
  maghrib: "https://cdn-icons-png.flaticon.com/512/3114/3114812.png",
  isha: "https://cdn-icons-png.flaticon.com/512/3114/3114817.png",
};

function getTodayFormatted() {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

function cleanTime(raw) {
  return raw ? raw.split(" ")[0] : "--:--";
}

function timeToMinutes(raw) {
  const clean = cleanTime(raw);
  const [h, m] = clean.split(":").map(Number);
  return h * 60 + m;
}

function formatArabic12h(raw) {
  const clean = cleanTime(raw);
  const [h, m] = clean.split(":").map(Number);
  const suffix = h >= 12 ? "م" : "ص";
  let h12 = h % 12;
  if (h12 === 0) h12 = 12;
  return `${String(h12).padStart(2, "0")}:${String(m).padStart(2, "0")} ${suffix}`;
}

export default function PrayerTracker() {
  const navigate = useNavigate();

  const [rawTimings, setRawTimings] = useState(null); 
  const [hijriLabel, setHijriLabel] = useState("");
  const [gregorianLabel, setGregorianLabel] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [prayerStatus, setPrayerStatus] = useState(
    Object.fromEntries(TRACKED_PRAYER_IDS.map((id) => [id, "pending"])),
  );

  useEffect(() => {
    const fetchPrayerTimes = async () => {
      try {
        setLoading(true);
        setError(null);

        const today = getTodayFormatted();
        const res = await fetch(
          `https://api.aladhan.com/v1/timingsByCity/${today}?city=cairo&country=egypt&method=8`,
        );
        if (!res.ok) throw new Error("تعذر جلب مواقيت الصلاة");

        const json = await res.json();
        const t = json.data.timings;
        setRawTimings(t);

        const hijri = json.data.date.hijri;
        setHijriLabel(
          `${hijri.weekday.ar} ${hijri.day} ${hijri.month.ar} ${hijri.year} هـ`,
        );
        setGregorianLabel(json.data.date.readable);

        const now = new Date();
        const nowMinutes = now.getHours() * 60 + now.getMinutes();
        const minutesList = PRAYER_KEYS.map((key) => timeToMinutes(t[key]));
        let currentIndex = 0;
        for (let i = 0; i < minutesList.length; i++) {
          if (nowMinutes >= minutesList[i]) currentIndex = i;
        }
        setActiveIndex(currentIndex);
      } catch (err) {
        setError(err.message || "حدث خطأ غير متوقع");
      } finally {
        setLoading(false);
      }
    };

    fetchPrayerTimes();
  }, []);

  const completedCount = TRACKED_PRAYER_IDS.filter(
    (id) => prayerStatus[id] === "prayed",
  ).length;

  const togglePrayerStatus = (id) => {
    setPrayerStatus((prev) => ({
      ...prev,
      [id]: prev[id] === "prayed" ? "pending" : "prayed",
    }));
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>جاري تحميل مواقيت الصلاة...</div>
      </div>
    );
  }

  if (error || !rawTimings) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>{error || "تعذر تحميل البيانات"}</div>
      </div>
    );
  }

  const nextIndex = (activeIndex + 1) % PRAYER_KEYS.length;
  const ALL_PRAYER_NAMES = [
    "الفجر",
    "الشروق",
    "الظهر",
    "العصر",
    "المغرب",
    "العشاء",
  ];

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.topBar}>
          <div className={styles.rightHeader}>
            <button className={styles.backBtn} onClick={() => navigate(-1)}>
              <ArrowRight size={22} />
            </button>
            <h2 className={styles.mainTitle}>متابعة الصلاة</h2>
          </div>

          <div className={styles.locationDateMeta}>
            <div className={styles.metaItem}>
              <MapPin size={16} />
              <span>القاهرة، مصر</span>
            </div>
            <div className={styles.metaItem}>
              <Calendar size={16} />
              <span>
                {hijriLabel} • {gregorianLabel}
              </span>
            </div>
          </div>
        </header>

        <section className={styles.timesOverviewSection}>
          <div className={styles.timesGrid}>
            {PRAYER_KEYS.map((key, index) => (
              <div
                key={key}
                className={`${styles.timeCard} ${activeIndex === index ? styles.timeCardActive : ""}`}
              >
                <span className={styles.timeIcon}>{PRAYER_ICONS[index]}</span>
                <span className={styles.timeName}>
                  {ALL_PRAYER_NAMES[index]}
                </span>
                <span className={styles.timeValue}>
                  {formatArabic12h(rawTimings[key])}
                </span>
              </div>
            ))}
          </div>

          <div className={styles.heroBanner}>
            <div className={styles.heroInfo}>
              <span className={styles.currentTag}>
                {ALL_PRAYER_NAMES[activeIndex]}
              </span>
              <h1 className={styles.currentTime}>
                {formatArabic12h(rawTimings[PRAYER_KEYS[activeIndex]])}
              </h1>
              <p className={styles.nextPrayerText}>
                الصلاة التالية: {ALL_PRAYER_NAMES[nextIndex]} في{" "}
                <span className={styles.highlightTime}>
                  {formatArabic12h(rawTimings[PRAYER_KEYS[nextIndex]])}
                </span>
              </p>
            </div>
            <div className={styles.heroIllustration}>
              <div className={styles.mosqueSilhouette}></div>
            </div>
          </div>
        </section>

        <div className={styles.trackerContentLayout}>
          <main className={styles.prayersListWrapper}>
            <div className={styles.sectionHeaderTitle}>
              <h3>صلوات اليوم</h3>
              <p>اضغط على الزر لتأدية الفريضة وتحديث رصيدك اليومي</p>
            </div>

            <div className={styles.prayersStack}>
              {TRACKED_PRAYER_IDS.map((id) => {
                const isDone = prayerStatus[id] === "prayed";
                const apiKey = TRACKED_PRAYER_KEYS[id];
                return (
                  <div
                    key={id}
                    className={`${styles.prayerRow} ${isDone ? styles.rowDone : ""}`}
                  >
                    <div className={styles.prayerRightGroup}>
                      <img
                        src={TRACKED_PRAYER_IMAGES[id]}
                        alt={TRACKED_PRAYER_NAMES[id]}
                        className={styles.prayerImg}
                      />
                      <div className={styles.prayerNames}>
                        <h4>{TRACKED_PRAYER_NAMES[id]}</h4>
                        <span>{formatArabic12h(rawTimings[apiKey])}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => togglePrayerStatus(id)}
                      className={`${styles.statusToggleBtn} ${isDone ? styles.btnDone : styles.btnPending}`}
                    >
                      {isDone ? (
                        <>
                          <CheckCircle size={18} />
                          <span>صليتها</span>
                        </>
                      ) : (
                        <>
                          <Circle size={18} />
                          <span>لم تصلَّ بعد</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </main>

          <aside className={styles.statsSidebar}>
            <div className={styles.stickyWrapper}>
              <div className={styles.userGreetingCard}>
                <div className={styles.avatarWrapper}>
                  <img
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=120&auto=format&fit=crop"
                    alt="User profile"
                    className={styles.userAvatar}
                  />
                  <span className={styles.onlineBadge}></span>
                </div>
                <div className={styles.greetingTexts}>
                  <h4>أحسنتم!</h4>
                  <p>كم صلاة صليت اليوم؟ حافظ على النور في قلبك.</p>
                </div>
              </div>

              <div className={styles.progressAnalyticsCard}>
                <div className={styles.progressHeaderInfo}>
                  <Award size={20} className={styles.awardIcon} />
                  <h4>معدل الإنجاز اليومي</h4>
                </div>

                <h2 className={styles.bigProgressNumber}>
                  {completedCount}{" "}
                  <span className={styles.subMaxText}>
                    من أصل 5 صلوات مكتملة اليوم
                  </span>
                </h2>

                <div className={styles.progressBarTrack}>
                  <div
                    className={styles.progressBarFill}
                    style={{ width: `${(completedCount / 5) * 100}%` }}
                  />
                </div>

                <div className={styles.motivationalFooter}>
                  <Sparkles size={14} />
                  <span>
                    {completedCount === 5
                      ? "ما شاء الله! يوم كامل مليء بالنور والبركة."
                      : "بقيت خطوات بسيطة لتكملة خمس صلوات اليوم!"}
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
