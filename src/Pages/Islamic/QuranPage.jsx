import { useState, useEffect, useRef } from "react";
import styles from "./QuranPage.module.css";
import {
  Search,
  Play,
  Pause,
  BookOpen,
  Bookmark,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function QuranPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [surahList, setSurahList] = useState([]);
  const [selectedSurahMeta, setSelectedSurahMeta] = useState(null); 
  const [surahDetail, setSurahDetail] = useState(null); 
  const [tafseerMap, setTafseerMap] = useState({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState("reading");

  const [loadingList, setLoadingList] = useState(true);
  const [loadingSurah, setLoadingSurah] = useState(false);
  const [loadingTafseer, setLoadingTafseer] = useState(false);
  const [error, setError] = useState(null);

  const audioRef = useRef(null);

  useEffect(() => {
    const fetchSurahList = async () => {
      try {
        setLoadingList(true);
        const res = await fetch("https://api.alquran.cloud/v1/surah");
        if (!res.ok) throw new Error("تعذر جلب قائمة السور");
        const json = await res.json();
        setSurahList(json.data);
        setSelectedSurahMeta(json.data[0]); 
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingList(false);
      }
    };
    fetchSurahList();
  }, []);

  useEffect(() => {
    if (!selectedSurahMeta) return;

    const fetchSurahDetail = async () => {
      try {
        setLoadingSurah(true);
        setError(null);
        setIsPlaying(false);
        const res = await fetch(
          `https://api.alquran.cloud/v1/surah/${selectedSurahMeta.number}/quran-uthmani`,
        );
        if (!res.ok) throw new Error("تعذر جلب نص السورة");
        const json = await res.json();
        setSurahDetail(json.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingSurah(false);
      }
    };

    fetchSurahDetail();
    setTafseerMap({}); 
  }, [selectedSurahMeta]);

  useEffect(() => {
    if (activeTab !== "tafseer" || !selectedSurahMeta) return;
    if (Object.keys(tafseerMap).length > 0) return; 

    const fetchTafseer = async () => {
      try {
        setLoadingTafseer(true);
        const res = await fetch(
          `https://quranenc.com/api/v1/translation/sura/arabic_moyassar/${selectedSurahMeta.number}`,
        );
        if (!res.ok) throw new Error("تعذر جلب التفسير");
        const json = await res.json();
        const map = {};
        json.result.forEach((item) => {
          map[Number(item.aya)] = item.translation;
        });
        setTafseerMap(map);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingTafseer(false);
      }
    };

    fetchTafseer();
  }, [activeTab, selectedSurahMeta, tafseerMap]);

  const filteredSurahs = surahList.filter(
    (surah) =>
      surah.name.includes(searchQuery) ||
      surah.englishName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const surahAudioUrl = selectedSurahMeta
    ? `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${selectedSurahMeta.number}.mp3`
    : null;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.topBar}>
          <div className={styles.rightHeader}>
            <button className={styles.backBtn}>
              <ArrowRight size={22} />
            </button>
            <h2 className={styles.mainTitle}>القرآن الكريم</h2>
          </div>
        </header>

        <div className={styles.dashboardLayout}>
          <aside className={styles.sidebar}>
            <div className={styles.lastReadCard}>
              <div className={styles.lastReadInfo}>
                <span className={styles.lastReadLabel}>
                  <BookOpen size={14} /> السورة المختارة
                </span>
                <h3>{selectedSurahMeta?.name || "..."}</h3>
                <p>
                  {selectedSurahMeta
                    ? `${selectedSurahMeta.numberOfAyahs} آية`
                    : ""}
                </p>
              </div>
              <img
                src="https://cdn-icons-png.flaticon.com/512/2904/2904843.png"
                alt="Quran"
                className={styles.lastReadImg}
              />
            </div>

            <div className={styles.searchWrapper}>
              <Search className={styles.searchIcon} size={18} />
              <input
                type="text"
                placeholder="ابحث عن سورة..."
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className={styles.indexTabs}>
              <button className={`${styles.indexTab} ${styles.indexTabActive}`}>
                سورة
              </button>
              <button className={styles.indexTab}>جزء</button>
              <button className={styles.indexTab}>صفحة</button>
              <button className={styles.indexTab}>آية</button>
            </div>

            <div className={styles.surahList}>
              {loadingList && <p>جاري تحميل قائمة السور...</p>}
              {!loadingList &&
                filteredSurahs.map((surah) => (
                  <div
                    key={surah.number}
                    className={`${styles.surahRow} ${selectedSurahMeta?.number === surah.number ? styles.surahRowActive : ""}`}
                    onClick={() => setSelectedSurahMeta(surah)}
                  >
                    <div className={styles.surahNumberWrapper}>
                      <div className={styles.surahNumberBox}>
                        <span>{surah.number}</span>
                      </div>
                      <div className={styles.surahMetaNames}>
                        <span className={styles.surahEngName}>
                          {surah.englishName}
                        </span>
                        <span className={styles.surahMetaSub}>
                          {surah.revelationType.toUpperCase()} •{" "}
                          {surah.numberOfAyahs} VERSES
                        </span>
                      </div>
                    </div>
                    <div className={styles.surahArabicNameSide}>
                      <span className={styles.surahArName}>{surah.name}</span>
                    </div>
                  </div>
                ))}
            </div>
          </aside>

          <main className={styles.displayArea}>
            <div className={styles.displayCard}>
              <div className={styles.surahViewHeader}>
                <span className={styles.surahMetaHeader}>
                  {surahDetail
                    ? `${surahDetail.revelationType === "Meccan" ? "مكية" : "مدنية"} - ${surahDetail.numberOfAyahs} آية`
                    : ""}
                </span>
                <h1 className={styles.surahMainTitle}>
                  {surahDetail?.name || "..."}
                </h1>
                {selectedSurahMeta?.number !== 9 && (
                  <div className={styles.basmalahWrapper}>
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Basmala.svg/640px-Basmala.svg.png"
                      alt="Basmalah"
                      className={styles.basmalahImg}
                    />
                  </div>
                )}
              </div>

              <div className={styles.viewToggleNav}>
                <button
                  className={`${styles.toggleNavBtn} ${activeTab === "reading" ? styles.toggleNavBtnActive : ""}`}
                  onClick={() => setActiveTab("reading")}
                >
                  نص المصحف
                </button>
                <button
                  className={`${styles.toggleNavBtn} ${activeTab === "tafseer" ? styles.toggleNavBtnActive : ""}`}
                  onClick={() => setActiveTab("tafseer")}
                >
                  تفسير السورة
                </button>
              </div>

              <div className={styles.quranContentBody}>
                {loadingSurah && <p>جاري تحميل الآيات...</p>}
                {error && <p>{error}</p>}

                {!loadingSurah && surahDetail && activeTab === "reading" && (
                  <p className={styles.mushafTextContainer}>
                    {surahDetail.ayahs.map((verse) => (
                      <span key={verse.number} className={styles.verseSpan}>
                        {verse.text}
                        <span className={styles.verseNumberBadge}>
                          {verse.numberInSurah}
                        </span>
                      </span>
                    ))}
                  </p>
                )}

                {!loadingSurah && surahDetail && activeTab === "tafseer" && (
                  <div className={styles.tafseerContainer}>
                    {loadingTafseer && <p>جاري تحميل التفسير...</p>}
                    {!loadingTafseer &&
                      surahDetail.ayahs.map((verse) => (
                        <div
                          key={verse.number}
                          className={styles.tafseerRowCard}
                        >
                          <h4 className={styles.tafseerVerseText}>
                            {verse.text}
                          </h4>
                          <div className={styles.tafseerExplanationBox}>
                            <p>
                              {tafseerMap[verse.numberInSurah] ||
                                "التفسير غير متاح لهذه الآية حالياً."}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              <div className={styles.audioPlayerSection}>
                <div className={styles.playerMetaSide}>
                  <img
                    src="https://images.unsplash.com/photo-1590075865003-e48277adc558?q=80&w=120&auto=format&fit=crop"
                    className={styles.readerAvatar}
                    alt="Reader"
                  />
                  <div className={styles.readerInfoText}>
                    <h5>القارئ الشيخ مشاري راشد العفاسي</h5>
                    <p>استماع جودة عالية HD</p>
                  </div>
                </div>

                <div className={styles.playerControlsCenter}>
                  <button className={styles.mainPlayBtn} onClick={togglePlay}>
                    {isPlaying ? (
                      <Pause size={22} fill="white" />
                    ) : (
                      <Play size={22} fill="white" />
                    )}
                  </button>
                  {surahAudioUrl && (
                    <audio
                      ref={audioRef}
                      src={surahAudioUrl}
                      onEnded={() => setIsPlaying(false)}
                    />
                  )}
                </div>

                <div className={styles.playerActionsLeft}>
                  <button className={styles.actionBtn}>
                    <Bookmark size={18} />
                    <span>إضافة علامة</span>
                  </button>
                  <button
                    className={styles.actionBtn}
                    onClick={() =>
                      setActiveTab(
                        activeTab === "reading" ? "tafseer" : "reading",
                      )
                    }
                  >
                    <Sparkles size={18} />
                    <span>
                      {activeTab === "reading" ? "تفسير السورة" : "عرض السورة"}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
