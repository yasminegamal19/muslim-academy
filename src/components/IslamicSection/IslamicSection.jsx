import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./IslamicSection.module.css";
import {
  Moon,
  SunDim,
  Sun,
  CloudSun,
  Sunset,
  CloudMoon,
  BookOpen,
  BookMarked,
  Heart,
  Compass,
  CheckSquare,
  HelpCircle,
} from "lucide-react";

const PRAYER_KEYS = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];
const PRAYER_NAMES = ["الفجر", "الشروق", "الظهر", "العصر", "المغرب", "العشاء"];
const PRAYER_ICONS = [Moon, SunDim, Sun, CloudSun, Sunset, CloudMoon];

const SERVICES = [
  {
    id: "quran",
    label: "القرآن الكريم",
    desc: "قراءة وتصفح السور",
    icon: BookMarked,
    path: "/islamic/quran",
  },
  {
    id: "tafseer",
    label: "التفسير",
    desc: "تأمل ومعاني الآيات",
    icon: BookOpen,
    path: "/islamic/quran",
  },
  {
    id: "athkar",
    label: "الأذكار",
    desc: "حصن المسلم اليومي",
    icon: Heart,
    path: "/islamic/athkar",
  },
  {
    id: "tasbeh",
    label: "التسبيح",
    desc: "العداد والسبحة الإلكترونية",
    icon: HelpCircle,
    path: "/islamic/tasbeh",
  },
  {
    id: "tracker",
    label: "متابعة الصلاة",
    desc: "سجل التزامك بالعبادات",
    icon: CheckSquare,
    path: "/islamic/prayer-tracker",
  },
];

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

export default function IslamicSection() {
  const navigate = useNavigate();

  const [timings, setTimings] = useState(null); 
  const [hijriDate, setHijriDate] = useState("");
  const [gregorianDate, setGregorianDate] = useState("");
  const [activePrayer, setActivePrayer] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrayerTimes = async () => {
      try {
        setLoading(true);
        setError(null);

        const today = getTodayFormatted();
        const res = await fetch(
          `https://api.aladhan.com/v1/timingsByCity/${today}?city=cairo&country=egypt&method=8`,
        );

        if (!res.ok) {
          throw new Error("تعذر جلب مواقيت الصلاة، حاول مرة أخرى");
        }

        const json = await res.json();
        const t = json.data.timings;

        const orderedTimings = PRAYER_KEYS.map((key) => t[key]);
        setTimings(orderedTimings);

        const hijri = json.data.date.hijri;
        setHijriDate(
          `${hijri.weekday.ar}، ${hijri.day} ${hijri.month.ar} ${hijri.year} هـ`,
        );
        setGregorianDate(json.data.date.readable);

        const now = new Date();
        const nowMinutes = now.getHours() * 60 + now.getMinutes();
        const minutesList = PRAYER_KEYS.map((key) => timeToMinutes(t[key]));

        let currentIndex = 0;
        for (let i = 0; i < minutesList.length; i++) {
          if (nowMinutes >= minutesList[i]) currentIndex = i;
        }
        setActivePrayer(currentIndex);
      } catch (err) {
        setError(err.message || "حدث خطأ غير متوقع");
      } finally {
        setLoading(false);
      }
    };

    fetchPrayerTimes();
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.sectionHeader}>
        <div className={styles.topBadge}>العلوم الشرعية والقرآن</div>
        <h2 className={styles.sectionTitle}>مناهجنا الإسلامية المعتمدة</h2>
        <p className={styles.sectionSubtitle}>
          سلسلة من الدورات والبرامج المتكاملة في حفظ القرآن الكريم وتجويده،
          ودراسة الفقه والعقيدة تحت إشراف نخبة من علماء ومشايخ الأزهر الشريف.
        </p>
      </div>
      <div className={styles.webContainer}>
        <aside className={styles.sidePanel}>
          <div className={styles.locationCard}>
            <div className={styles.geoBadge}>
              <span className={styles.dot}></span> القاهرة، مصر
            </div>
            <div className={styles.dateWrapper}>
              <h3 className={styles.hijriDate}>
                {hijriDate || "جاري تحديد التاريخ..."}
              </h3>
              <p className={styles.gregorianDate}>{gregorianDate}</p>
            </div>
          </div>

          <div className={styles.prayerList}>
            <h4 className={styles.sectionTitle}>مواقيت الصلاة اليوم</h4>

            {loading && <p>جاري تحميل المواقيت...</p>}
            {error && <p>{error}</p>}

            {!loading &&
              !error &&
              timings &&
              PRAYER_NAMES.map((name, i) => {
                const IconComponent = PRAYER_ICONS[i];
                return (
                  <button
                    key={i}
                    className={`${styles.prayerRow} ${activePrayer === i ? styles.prayerRowActive : ""}`}
                    onClick={() => setActivePrayer(i)}
                  >
                    <div className={styles.prayerRowRight}>
                      <span className={styles.prayerIcon}>
                        <IconComponent size={18} />
                      </span>
                      <span className={styles.prayerName}>{name}</span>
                    </div>
                    <span className={styles.prayerTime}>
                      {cleanTime(timings[i])}
                    </span>
                  </button>
                );
              })}
          </div>
        </aside>

        <main className={styles.mainContent}>
          <div
            className={styles.heroBanner}
            onClick={() => navigate("/islamic/prayer-times")}
          >
            {timings && (
              <div className={styles.bannerInfo}>
                <span className={styles.bannerBadge}>الصلاة الحالية</span>
                <h1 className={styles.bannerTitle}>
                  {PRAYER_NAMES[activePrayer]}
                </h1>
                <div className={styles.bannerTimeDisplay}>
                  {cleanTime(timings[activePrayer])}
                </div>
                <p className={styles.bannerNextPrayer}>
                  الصلاة التالية: {PRAYER_NAMES[(activePrayer + 1) % 6]} في
                  <strong> {cleanTime(timings[(activePrayer + 1) % 6])}</strong>
                </p>
              </div>
            )}

            <div className={styles.skylineOverlay}>
              <svg
                viewBox="0 0 500 150"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="xMaxYMax slice"
              >
                <path
                  d="M0,150 L50,150 L50,90 Q60,75 70,90 L70,150 L120,150 L120,110 Q125,100 130,110 L130,150 L180,150 L180,60 L190,60 L190,40 L185,40 L185,20 L180,0 L175,20 L170,40 L165,40 L165,60 L175,60 L175,150 L250,150 L250,80 Q270,55 290,80 L290,150 L340,150 L340,100 L350,100 L350,30 L345,30 L342,10 L338,30 L335,30 L335,100 L340,100 L340,150 L500,150 Z"
                  fill="rgba(255,255,255,0.08)"
                />
              </svg>
            </div>
          </div>

          <div className={styles.servicesGrid}>
            {SERVICES.map((s) => {
              const ServiceIcon = s.icon;
              return (
                <div
                  key={s.id}
                  className={styles.serviceCard}
                  onClick={() => navigate(s.path)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && navigate(s.path)}
                >
                  <div className={styles.iconCircle}>
                    <ServiceIcon size={24} strokeWidth={2} />
                  </div>
                  <div className={styles.serviceMeta}>
                    <span className={styles.serviceLabel}>{s.label}</span>
                    <span className={styles.serviceDesc}>{s.desc}</span>
                    <span className={styles.serviceAction}>تصفح الآن ←</span>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>

      <a
        href="https://wa.me/"
        className={styles.whatsappFab}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
      >
        <svg viewBox="0 0 24 24" fill="white" width="26" height="26">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      </a>
    </div>
  );
}
