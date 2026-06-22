import { useState, useEffect } from "react";
import styles from "./HeroSection.module.css";

const Slides = [
  {
    src: "/logo muslim.png",
    label: "تعلّم الإسلام بأسلوب عصري",
  },
  {
    src: "/logo muslim.png",
    label: "تعليم منظّم بدون تعقيد",
  },
  {
    src: "/logo muslim.png",
    label: "تجربة تعليمية موثوقة للجميع",
  },
];

function AppSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCurrent((prev) => (prev + 1) % Slides.length);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  const goTo = (i) => setCurrent(i);

  return (
    <div className={styles.sliderWrap}>
      <div className={styles.imageShowcase}>
        <div className={styles.slidesTrack}>
          {Slides.map((slide, i) => (
            <div
              key={i}
              className={`${styles.slide} ${i === current ? styles.slideActive : ""}`}
              aria-hidden={i !== current}
            >
              <img
                src={slide.src}
                alt={slide.label}
                className={styles.slideImg}
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>

      <div className={styles.dots} role="tablist" aria-label="شرائح المنصة">
        {Slides.map((slide, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === current}
            aria-label={slide.label}
            className={`${styles.dot} ${i === current ? styles.dotActive : ""}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>

      <p className={styles.slideLabel} key={current}>
        {Slides[current].label}
      </p>
    </div>
  );
}

export function HeroSection() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroBg}>
        <img
          src="/quran2.jfif"
          alt=""
          aria-hidden="true"
          className={styles.heroBgImg}
        />
        <div className={styles.heroBgOverlay} />
      </div>

      <div className={styles.heroInner}>
        <div className={styles.heroLeft}>
          <div className={styles.badge}>
            <span className={styles.badgeDot} />
            منصة تعليمية إسلامية معتمدة
          </div>

          <h1 className={styles.title}>
            تعلّم العلوم الشرعية
            <span className={styles.titleAccent}>بأسلوب عصري فريد</span>
          </h1>

          <p className={styles.subtitle}>
            منصة متكاملة لتعليم القرآن والعلوم الشرعية أونلاين — بمدرّسين
            معتمدين، جداول منظّمة، ومتابعة دقيقة لكل طالب بدون أي تعقيد.
          </p>

          <div className={styles.buttons}>
            <button className={styles.btnMain}>
              تصفح الدورات
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
            </button>
            <button className={styles.btnGhost}>
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
              شاهد كيف تعمل
            </button>
          </div>

          <div className={styles.pills}>
            {["بدون تعقيد", "تذكير تلقائي", "شهادات معتمدة"].map((label) => (
              <span key={label} className={styles.pill}>
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                {label}
              </span>
            ))}
          </div>
        </div>

        <div className={styles.heroRight}>
          <AppSlider />
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
