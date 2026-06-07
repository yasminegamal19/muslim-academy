import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./IslamicSection.module.css";

const PRAYER_NAMES = ["الفجر", "الشروق", "الظهر", "العصر", "المغرب", "العشاء"];
const PRAYER_ICONS = ["🌙", "🌅", "☀️", "🌤️", "🌇", "🌃"];
const MOCK_TIMES = ["04:55", "06:22", "11:45", "15:10", "17:44", "19:08"];
const CURRENT_PRAYER = 2; // الظهر

const SERVICES = [
  { id: "athkar", label: "الأذكار", path: "/islamic/athkar" },
  { id: "tafseer", label: "التفسير", path: "/islamic/quran" },
  { id: "quran", label: "القرآن الكريم", path: "/islamic/quran" },
  { id: "tasbeh", label: "التسبيح", path: "/islamic/tasbeh" },
  { id: "qibla", label: "تحديد القبلة", path: "/islamic/qibla" },
  { id: "tracker", label: "متابعة الصلاة", path: "/islamic/prayer-tracker" },
];

export default function IslamicSection() {
  const navigate = useNavigate();
  const [activePrayer, setActivePrayer] = useState(CURRENT_PRAYER);

  const todayHijri = "الأحد، 12 ربيع الأول 1445 هـ";
  const todayGregorian = "12 ديسمبر 2023";

  return (
    <div className={styles.page}>
      <div className={styles.webContainer}>
        {/* ── الجانب الأيمن: لوحة المواقيت والتاريخ ── */}
        <aside className={styles.sidePanel}>
          <div className={styles.locationCard}>
            <div className={styles.geoBadge}>
              <span className={styles.dot}></span> القاهرة، مصر
            </div>
            <div className={styles.dateWrapper}>
              <h3 className={styles.hijriDate}>{todayHijri}</h3>
              <p className={styles.gregorianDate}>{todayGregorian}</p>
            </div>
          </div>

          <div className={styles.prayerList}>
            <h4 className={styles.sectionTitle}>مواقيت الصلاة اليوم</h4>
            {PRAYER_NAMES.map((name, i) => (
              <button
                key={i}
                className={`${styles.prayerRow} ${activePrayer === i ? styles.prayerRowActive : ""}`}
                onClick={() => setActivePrayer(i)}
              >
                <div className={styles.prayerRowRight}>
                  <span className={styles.prayerIcon}>{PRAYER_ICONS[i]}</span>
                  <span className={styles.prayerName}>{name}</span>
                </div>
                <span className={styles.prayerTime}>{MOCK_TIMES[i]}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* ── الجانب الأيسر: البانر الرئيسي والخدمات ── */}
        <main className={styles.mainContent}>
          {/* البانر الاحترافي العريض */}
          <div
            className={styles.heroBanner}
            onClick={() => navigate("/islamic/prayer-times")}
          >
            <div className={styles.bannerInfo}>
              <span className={styles.bannerBadge}>الصلاة الحالية</span>
              <h1 className={styles.bannerTitle}>
                {PRAYER_NAMES[activePrayer]}
              </h1>
              <div className={styles.bannerTimeDisplay}>
                {MOCK_TIMES[activePrayer]}
              </div>
              <p className={styles.bannerNextPrayer}>
                الصلاة التالية: {PRAYER_NAMES[(activePrayer + 1) % 6]} في
                <strong> {MOCK_TIMES[(activePrayer + 1) % 6]} مساءً</strong>
              </p>
            </div>

            {/* خلفية مساجد مدمجة بالـ CSS بشكل ناعم واحترافي */}
            <div className={styles.skylineOverlay}>
              <svg
                viewBox="0 0 500 150"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="xMaxYMax slice"
              >
                <path
                  d="M0,150 L50,150 L50,90 Q60,75 70,90 L70,150 L120,150 L120,110 Q125,100 130,110 L130,150 L180,150 L180,60 L190,60 L190,40 L185,40 L185,20 L180,0 L175,20 L170,40 L165,40 L165,60 L175,60 L175,150 L250,150 L250,80 Q270,55 290,80 L290,150 L340,150 L340,100 L350,100 L350,30 L345,30 L342,10 L338,30 L335,30 L335,100 L340,100 L340,150 L500,150 Z"
                  fill="rgba(255,255,255,0.07)"
                />
              </svg>
            </div>
          </div>

          {/* شبكة الخدمات بحجم وتوزيع الويب */}
          <div className={styles.servicesGrid}>
            {SERVICES.map((s) => (
              <div
                key={s.id}
                className={styles.serviceCard}
                onClick={() => navigate(s.path)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && navigate(s.path)}
              >
                <div className={styles.iconCircle}>
                  {s.id === "athkar" && <AthkarIcon />}
                  {s.id === "tafseer" && <TafseerIcon />}
                  {s.id === "quran" && <QuranIcon />}
                  {s.id === "tasbeh" && <TasbehIcon />}
                  {s.id === "qibla" && <QiblaIcon />}
                  {s.id === "tracker" && <TrackerIcon />}
                </div>
                <div className={styles.serviceMeta}>
                  <span className={styles.serviceLabel}>{s.label}</span>
                  <span className={styles.serviceAction}>تصفح الآن ←</span>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* ── WhatsApp FAB ── */}
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

// ── الـ SVGs الأصلية بتاعتك مع الحفاظ على الكلاسات الجديدة الفخمة ──
function AthkarIcon() {
  return (
    <svg viewBox="0 0 40 40" width="32" height="32">
      <circle
        cx="20"
        cy="20"
        r="14"
        stroke="#558b2f"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M20 10 C20 10 14 14 14 20 C14 26 20 30 20 30 C20 30 26 26 26 20 C26 14 20 10 20 10Z"
        fill="#f1f8e9"
        stroke="#558b2f"
        strokeWidth="1.5"
      />
      <circle cx="20" cy="20" r="3" fill="#558b2f" />
    </svg>
  );
}
function TafseerIcon() {
  return (
    <svg viewBox="0 0 40 40" width="32" height="32">
      <rect
        x="8"
        y="8"
        width="24"
        height="28"
        rx="3"
        fill="#f1f8e9"
        stroke="#558b2f"
        strokeWidth="2"
      />
      <path
        d="M12 14 L28 14 M12 19 L28 19 M12 24 L22 24"
        stroke="#558b2f"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
function QuranIcon() {
  return (
    <svg viewBox="0 0 40 40" width="32" height="32">
      <path
        d="M8 32 C8 32 12 10 20 8 C28 10 32 32 32 32"
        fill="#f1f8e9"
        stroke="#558b2f"
        strokeWidth="2"
      />
      <line x1="20" y1="8" x2="20" y2="32" stroke="#558b2f" strokeWidth="1.5" />
      <circle cx="20" cy="6" r="2" fill="#558b2f" />
    </svg>
  );
}
function TasbehIcon() {
  return (
    <svg viewBox="0 0 40 40" width="32" height="32">
      <circle
        cx="20"
        cy="22"
        r="10"
        stroke="#558b2f"
        strokeWidth="2"
        fill="none"
        strokeDasharray="4 3"
      />
      <circle cx="20" cy="22" r="4" fill="#558b2f" />
      <line x1="20" y1="12" x2="20" y2="8" stroke="#558b2f" strokeWidth="2" />
    </svg>
  );
}
function QiblaIcon() {
  return (
    <svg viewBox="0 0 40 40" width="32" height="32">
      <rect
        x="14"
        y="10"
        width="12"
        height="20"
        rx="2"
        fill="#f1f8e9"
        stroke="#558b2f"
        strokeWidth="2"
      />
      <path
        d="M17 10 L20 6 L23 10"
        fill="#f1f8e9"
        stroke="#558b2f"
        strokeWidth="1.5"
      />
      <circle cx="20" cy="20" r="3" fill="#558b2f" />
    </svg>
  );
}
function TrackerIcon() {
  return (
    <svg viewBox="0 0 40 40" width="32" height="32">
      <rect
        x="8"
        y="14"
        width="24"
        height="18"
        rx="3"
        fill="#f1f8e9"
        stroke="#558b2f"
        strokeWidth="2"
      />
      <path
        d="M13 26 L16 29 L22 24"
        stroke="#558b2f"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
