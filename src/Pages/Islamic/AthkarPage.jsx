import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./AthkarPage.module.css";
import { ChevronRight, ChevronLeft } from "lucide-react";

// ── Data ──
const CATEGORIES = [
  { id: "salah", label: "أذكار الصلاة", icon: "🌙", color: "#e8f5e9" },
  { id: "sabah", label: "أذكار الصباح", icon: "☀️", color: "#fffde7" },
  { id: "masaa", label: "أذكار المساء", icon: "🌙", color: "#e8eaf6" },
  { id: "nawm", label: "أذكار النوم", icon: "💤", color: "#fce4ec" },
];

const ATHKAR = {
  sabah: [
    {
      id: 1,
      arabic: "اَضْبَحْنَا وَاَضْبَحَ الْمُلْكُ لِلَّهِ الصَّبَاحُ",
      pronunciation: "As-bah-na wa as-ba-hal mulku lillah",
      meaning:
        "We have reached the morning and at this very time the dominion belongs to Allah.",
      repeat: 1,
    },
    {
      id: 2,
      arabic: "اللَّهُمَّ بِكَ أَصْبَحْنَا",
      pronunciation: "Allahumma bika asbahna",
      meaning: "O Allah, by Your leave we have reached the morning.",
      repeat: 1,
    },
    {
      id: 3,
      arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
      pronunciation: "Subhanallahi wa bihamdihi",
      meaning: "Glory is to Allah and praise is to Him.",
      repeat: 100,
    },
    {
      id: 4,
      arabic: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ",
      pronunciation: "La ilaha illallah wahdahu la sharika lah",
      meaning:
        "None has the right to be worshipped except Allah alone, with no partner.",
      repeat: 1,
    },
    {
      id: 5,
      arabic: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ",
      pronunciation: "Bismillahil-lathee la yadhurru ma'as-mihi shay",
      meaning: "In the name of Allah, with whose name nothing can cause harm.",
      repeat: 3,
    },
  ],
  masaa: [
    {
      id: 1,
      arabic: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ",
      pronunciation: "Amsayna wa amsal mulku lillah",
      meaning:
        "We have reached the evening and at this very time the dominion belongs to Allah.",
      repeat: 1,
    },
    {
      id: 2,
      arabic: "اللَّهُمَّ بِكَ أَمْسَيْنَا",
      pronunciation: "Allahumma bika amsayna",
      meaning: "O Allah, by Your leave we have reached the evening.",
      repeat: 1,
    },
    {
      id: 3,
      arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
      pronunciation: "Subhanallahi wa bihamdihi",
      meaning: "Glory is to Allah and praise is to Him.",
      repeat: 100,
    },
  ],
  salah: [
    {
      id: 1,
      arabic: "سُبْحَانَ اللَّهِ",
      pronunciation: "Subhanallah",
      meaning: "Glory is to Allah.",
      repeat: 33,
    },
    {
      id: 2,
      arabic: "الْحَمْدُ لِلَّهِ",
      pronunciation: "Alhamdulillah",
      meaning: "All praise is due to Allah.",
      repeat: 33,
    },
    {
      id: 3,
      arabic: "اللَّهُ أَكْبَرُ",
      pronunciation: "Allahu Akbar",
      meaning: "Allah is the Greatest.",
      repeat: 33,
    },
  ],
  nawm: [
    {
      id: 1,
      arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
      pronunciation: "Bismika Allahumma amutu wa ahya",
      meaning: "In Your name O Allah, I die and I live.",
      repeat: 1,
    },
    {
      id: 2,
      arabic: "اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ",
      pronunciation: "Allahumma qini adhabaka yawma tab'athu ibadak",
      meaning:
        "O Allah, protect me from Your punishment on the day You resurrect Your servants.",
      repeat: 3,
    },
  ],
};

// ── Categories list page ──
export function AthkarCategoriesPage() {
  const navigate = useNavigate();
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <button className={styles.backBtn} onClick={() => navigate(-1)}>
            <ChevronRight size={20} />
          </button>
          <h1 className={styles.title}>
            <span>🌙</span> الأذكار
          </h1>
        </div>
        <div className={styles.catList}>
          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              className={styles.catCard}
              style={{ "--cat-bg": cat.color }}
              onClick={() => navigate(`/islamic/athkar/${cat.id}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) =>
                e.key === "Enter" && navigate(`/islamic/athkar/${cat.id}`)
              }
            >
              <span className={styles.catIcon}>{cat.icon}</span>
              <span className={styles.catLabel}>{cat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Athkar list page ──
export function AthkarListPage() {
  const { category } = useParams();
  const navigate = useNavigate();
  const items = ATHKAR[category] || [];
  const catInfo = CATEGORIES.find((c) => c.id === category) || {};

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <button className={styles.backBtn} onClick={() => navigate(-1)}>
            <ChevronRight size={20} />
          </button>
          <h1 className={styles.title}>
            <span>{catInfo.icon}</span> {catInfo.label}
          </h1>
        </div>
        <div className={styles.athkarList}>
          {items.map((item, i) => (
            <div
              key={item.id}
              className={styles.athkarItem}
              onClick={() => navigate(`/islamic/athkar/${category}/${i}`)}
              role="button"
              tabIndex={0}
            >
              <span className={styles.athkarArrow}>
                <ChevronLeft size={16} />
              </span>
              <span className={styles.athkarText}>{item.arabic}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Single dhikr detail page with counter ──
export function AthkarDetailPage() {
  const { category, index } = useParams();
  const navigate = useNavigate();
  const items = ATHKAR[category] || [];
  const item = items[parseInt(index)] || items[0];
  const [count, setCount] = useState(item?.repeat || 1);
  const [activeTab, setActiveTab] = useState("arabic");

  if (!item) return null;

  const handleTap = () => {
    if (count > 0) setCount((c) => c - 1);
  };

  const handleNext = () => {
    const nextIdx = (parseInt(index) + 1) % items.length;
    setCount(items[nextIdx]?.repeat || 1);
    navigate(`/islamic/athkar/${category}/${nextIdx}`);
  };

  const handlePrev = () => {
    const prevIdx = (parseInt(index) - 1 + items.length) % items.length;
    setCount(items[prevIdx]?.repeat || 1);
    navigate(`/islamic/athkar/${category}/${prevIdx}`);
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <button className={styles.backBtn} onClick={() => navigate(-1)}>
            <ChevronRight size={20} />
          </button>
          <h1 className={styles.title}>
            <span>☀️</span> {CATEGORIES.find((c) => c.id === category)?.label}
          </h1>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          {[
            { key: "arabic", label: "اللغة العربية" },
            { key: "pronunciation", label: "English Pronunciation" },
            { key: "meaning", label: "Meaning" },
          ].map((tab) => (
            <button
              key={tab.key}
              className={`${styles.tab} ${activeTab === tab.key ? styles.tabActive : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
              {activeTab === tab.key && (
                <span className={styles.tabDot}>✳</span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className={styles.dhikrContent}>
          {activeTab === "arabic" && (
            <p className={styles.dhikrArabic}>{item.arabic}</p>
          )}
          {activeTab === "pronunciation" && (
            <p className={styles.dhikrPronunciation}>{item.pronunciation}</p>
          )}
          {activeTab === "meaning" && (
            <p className={styles.dhikrMeaning}>{item.meaning}</p>
          )}
        </div>

        {/* Counter */}
        <p className={styles.repeatLabel}>تكرار {item.repeat} مرات</p>
        <div className={styles.counterDisplay}>
          <span className={styles.counterNum}>
            {String(count).padStart(2, "0")}
          </span>
        </div>

        {/* Navigation */}
        <div className={styles.navRow}>
          <button className={styles.navBtn} onClick={handlePrev}>
            <ChevronRight size={20} />
          </button>
          <button
            className={styles.tapBtn}
            onClick={handleTap}
            aria-label="tap to count"
          />
          <button className={styles.navBtn} onClick={handleNext}>
            <ChevronLeft size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default AthkarCategoriesPage;
