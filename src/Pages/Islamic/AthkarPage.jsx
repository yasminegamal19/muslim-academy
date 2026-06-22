import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AthkarPage.module.css";
import { ArrowRight, Check, RotateCcw, ChevronLeft } from "lucide-react";
import { ATHKAR_DATA } from "../../components/data/AthkarData";

export default function AthkarPage() {
  const navigate = useNavigate();

  const [activeCategoryId, setActiveCategoryId] = useState(ATHKAR_DATA[0].id);
  const activeCategory = ATHKAR_DATA.find((c) => c.id === activeCategoryId);

  const [selectedDhikr, setSelectedDhikr] = useState(activeCategory.array[0]);
  const [currentCount, setCurrentCount] = useState(0);

  const handleCategoryChange = (categoryId) => {
    setActiveCategoryId(categoryId);
    const category = ATHKAR_DATA.find((c) => c.id === categoryId);
    const firstDhikr = category?.array?.[0] || null;
    setSelectedDhikr(firstDhikr);
    setCurrentCount(0);
  };

  const handleDhikrSelect = (dhikr) => {
    setSelectedDhikr(dhikr);
    setCurrentCount(0);
  };

  const handleCounterClick = () => {
    if (!selectedDhikr) return;
    if (currentCount < selectedDhikr.count) {
      setCurrentCount((prev) => prev + 1);
    }
  };

  const resetCounter = (e) => {
    e.stopPropagation();
    setCurrentCount(0);
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.topBar}>
          <div className={styles.headerTitleSide}>
            <button
              onClick={() => navigate("/islamic")}
              className={styles.backBtn}
            >
              <ArrowRight size={22} />
            </button>
            <h2 className={styles.title}>الأذكار والأوراد اليومية</h2>
          </div>
        </div>

        <div className={styles.dashboardLayout}>
          <aside className={styles.sidebar}>
            <div className={styles.categoryTabs}>
              {ATHKAR_DATA.map((cat) => (
                <button
                  key={cat.id}
                  className={`${styles.catTab} ${activeCategoryId === cat.id ? styles.catTabActive : ""}`}
                  onClick={() => handleCategoryChange(cat.id)}
                >
                  <span>{cat.category}</span>
                </button>
              ))}
            </div>

            <div className={styles.dhikrListContainer}>
              <h4 className={styles.listTitle}>قائمة الأذكار الحالية</h4>
              <div className={styles.dhikrList}>
                {activeCategory?.array.map((dhikr, index) => (
                  <div
                    key={dhikr.id}
                    className={`${styles.dhikrRow} ${selectedDhikr?.id === dhikr.id ? styles.dhikrRowActive : ""}`}
                    onClick={() => handleDhikrSelect(dhikr)}
                  >
                    <span className={styles.dhikrNumber}>{index + 1}</span>
                    <p className={styles.dhikrRowText}>{dhikr.text}</p>
                    <ChevronLeft size={16} className={styles.rowArrow} />
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <main className={styles.displayArea}>
            {selectedDhikr ? (
              <div className={styles.detailsCard}>
                <div className={styles.sectionSection}>
                  <span className={styles.sectionLabel}>
                    {activeCategory.category}
                  </span>
                  <p className={styles.arabicText}>{selectedDhikr.text}</p>
                </div>

                <div className={styles.counterSection}>
                  <div className={styles.counterMeta}>
                    <span className={styles.repeatLabel}>
                      التكرار المطلوب: {selectedDhikr.count} مرات
                    </span>
                    <button
                      className={styles.resetBtn}
                      onClick={resetCounter}
                      title="إعادة تعيين العداد"
                    >
                      <RotateCcw size={16} />
                    </button>
                  </div>

                  <div className={styles.digitalDisplayWrapper}>
                    <div className={styles.digitalBox}>
                      {String(currentCount).padStart(2, "0")}
                    </div>
                  </div>

                  <div className={styles.tapAreaContainer}>
                    <button
                      className={`${styles.tapCircle} ${currentCount === selectedDhikr.count ? styles.tapCircleComplete : ""}`}
                      onClick={handleCounterClick}
                      disabled={currentCount === selectedDhikr.count}
                    >
                      {currentCount === selectedDhikr.count ? (
                        <Check size={36} strokeWidth={3} />
                      ) : (
                        <span className={styles.tapText}>اضغط للتسبيح</span>
                      )}
                    </button>
                  </div>

                  {selectedDhikr.audio && (
                    <audio
                      controls
                      src={selectedDhikr.audio}
                      style={{ width: "100%", marginTop: 12 }}
                    />
                  )}
                </div>
              </div>
            ) : (
              <div className={styles.emptyState}>
                يرجى تحديد ذكر لعرض التفاصيل.
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
