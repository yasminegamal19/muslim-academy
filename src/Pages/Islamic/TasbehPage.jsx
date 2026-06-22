import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Tasbeh.module.css";
import {
  ArrowRight,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  History,
  Trophy,
} from "lucide-react";
import { TASBEH_DATA } from "../../components/data/TasbehData";

const buildInitialList = () =>
  TASBEH_DATA.map((item) => ({
    id: item.id,
    title: item.ar,
    subtitle: item.en,
    description: item.description,
    count: item.count,
    current: 0,
    completed: false,
  }));

export default function Tasbeh() {
  const navigate = useNavigate();
  const [tasbehList, setTasbehList] = useState(buildInitialList);
  const [activeIndex, setActiveIndex] = useState(0);

  const currentDhikr = tasbehList[activeIndex];

  const handleIncrement = () => {
    if (currentDhikr.completed) return;

    const newList = [...tasbehList];
    newList[activeIndex] = { ...newList[activeIndex] };
    newList[activeIndex].current += 1;

    if (newList[activeIndex].current >= newList[activeIndex].count) {
      newList[activeIndex].completed = true;
      playVibration();
    }
    setTasbehList(newList);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % tasbehList.length);
  };

  const handlePrev = () => {
    setActiveIndex(
      (prev) => (prev - 1 + tasbehList.length) % tasbehList.length,
    );
  };

  const playVibration = () => {
    if ("vibrate" in navigator) {
      navigator.vibrate(100);
    }
  };

  const resetCurrent = () => {
    const newList = [...tasbehList];
    newList[activeIndex] = {
      ...newList[activeIndex],
      current: 0,
      completed: false,
    };
    setTasbehList(newList);
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
            <h2 className={styles.title}>التسبيح والذكر</h2>
          </div>
          <button className={styles.historyBtn}>
            <History size={20} />
            <span>السجل</span>
          </button>
        </div>

        <div className={styles.mainLayout}>
          <aside className={styles.tasksSide}>
            <div className={styles.tasksHeader}>
              <Trophy size={18} className={styles.trophyIcon} />
              <h4>الورد الحالي</h4>
            </div>

            <div className={styles.tasksList}>
              {tasbehList.map((item, index) => (
                <div
                  key={item.id}
                  className={`
                    ${styles.taskItem}
                    ${activeIndex === index ? styles.activeItem : ""}
                    ${item.completed ? styles.completedItem : ""}
                  `}
                  onClick={() => setActiveIndex(index)}
                >
                  <div className={styles.taskInfo}>
                    <div className={styles.statusIcon}>
                      {item.completed ? (
                        <CheckCircle2 size={18} />
                      ) : (
                        <div className={styles.dot} />
                      )}
                    </div>
                    <div className={styles.taskTexts}>
                      <span className={styles.taskTitle}>{item.title}</span>
                      <span className={styles.taskProgress}>
                        {item.current} مرة من أصل {item.count}
                      </span>
                    </div>
                  </div>

                  <div className={styles.miniProgressBar}>
                    <div
                      className={styles.miniFill}
                      style={{
                        width: `${(item.current / item.count) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </aside>

          <main className={styles.counterSide}>
            <div className={styles.counterCard}>
              <div className={styles.displayHeader}>
                <h1 className={styles.activeDhikrText}>{currentDhikr.title}</h1>
                <p>{currentDhikr.description}</p>
                {currentDhikr.completed && (
                  <span className={styles.doneBadge}>تم بنجاح!</span>
                )}
              </div>

              <div className={styles.digitalScreenWrapper}>
                <div className={styles.digitalScreen}>
                  {String(currentDhikr.current).padStart(2, "0")}
                </div>
              </div>

              <div className={styles.controlsRow}>
                <button
                  className={styles.navBtn}
                  onClick={handlePrev}
                  title="السابق"
                >
                  <ChevronRight size={32} />
                </button>

                <div className={styles.mainTapWrapper}>
                  <button
                    className={`${styles.tapButton} ${currentDhikr.completed ? styles.tapDisabled : ""}`}
                    onClick={handleIncrement}
                    disabled={currentDhikr.completed}
                  >
                    <div className={styles.tapInner}>
                      <span>اضغط</span>
                    </div>
                  </button>
                </div>

                <button
                  className={styles.navBtn}
                  onClick={handleNext}
                  title="التالي"
                >
                  <ChevronLeft size={32} />
                </button>
              </div>

              <button className={styles.resetAction} onClick={resetCurrent}>
                <RotateCcw size={16} />
                <span>إعادة تصفير العداد</span>
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
