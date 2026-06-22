import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../components/ServisesSection/ServicesSection.module.css";
import { ArrowRight, Check, Sparkles } from "lucide-react";

export default function Expenses() {
  const navigate = useNavigate();
  const [activeDuration, setActiveDuration] = useState("30"); 

  const pricingPlans = [
    {
      id: "a",
      badge: "الباقة الأساسية",
      title: "الخطة ( أ )",
      price: "16",
      currency: "جنيه إسترليني",
      period: "شهرياً",
      features: [
        "حصة واحدة في الأسبوع",
        "4 حصص شهرياً",
        "توفير 5 جنيهات عند اشتراك 3 أشهر (43 £)",
        "توفير 10 جنيهات عند اشتراك 6 أشهر (86 £)",
      ],
      popular: false,
    },
    {
      id: "b",
      badge: "الأكثر شعبية",
      title: "الخطة ( ب )",
      price: "28", 
      currency: "جنيه إسترليني",
      period: "شهرياً",
      features: [
        "حصتان في الأسبوع",
        "8 حصص شهرياً",
        "توفير مخصص عند اشتراك 3 أشهر",
        "توفير مخصص عند اشتراك 6 أشهر",
        "متابعة دورية مع أولياء الأمور",
      ],
      popular: true, 
    },
    {
      id: "c",
      badge: "الباقة المتقدمة",
      title: "الخطة ( ج )",
      price: "40",
      currency: "جنيه إسترليني",
      period: "شهرياً",
      features: [
        "3 حصص في الأسبوع",
        "12 حصة شهرياً",
        "أولوية اختيار المواعيد المناسبة",
        "تقارير أداء شهرية مفصلة",
        "شهادة إتمام معتمدة من الأكاديمية",
      ],
      popular: false,
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <div className={styles.headerTitleSide}>
          <button
            onClick={() => navigate("/services")}
            className={styles.backBtn}
          >
            <ArrowRight size={22} />
          </button>
          <h2 className={styles.title}>خطط الأسعار والرسوم</h2>
        </div>
      </div>

      <div className={styles.pricingIntro}>
        <span className={styles.pricingSubtitle}>جودة عالية ورسوم معقولة</span>
        <p>
          يرجى اختيار خطة الدراسة التي تناسبك، يمكن للطلاب اختيار إحدى خطط
          الدراسة التالية لدورات القرآن الكريم، أو الدراسات الإسلامية، أو اللغة
          العربية. لدينا <strong>15 خطة دراسية</strong> تناسب جدول كل عائلة.
          بالإضافة إلى ذلك، تتوفر دروس نهاية الأسبوع بنفس الرسوم. مع ذلك، إذا
          كنت ترغب في خطة دراسية مخصصة، فلا تتردد في التواصل معنا.
        </p>
      </div>

      <div className={styles.durationTabsWrapper}>
        <button
          className={`${styles.durationTab} ${activeDuration === "30" ? styles.activeTab : ""}`}
          onClick={() => setActiveDuration("30")}
        >
          حصة مدتها 30 دقيقة
        </button>
        <button
          className={`${styles.durationTab} ${activeDuration === "45" ? styles.activeTab : ""}`}
          onClick={() => setActiveDuration("45")}
        >
          حصة مدتها 45 دقيقة
        </button>
        <button
          className={`${styles.durationTab} ${activeDuration === "60" ? styles.activeTab : ""}`}
          onClick={() => setActiveDuration("60")}
        >
          حصة مدتها 60 دقيقة
        </button>
      </div>

      <div className={styles.pricingGrid}>
        {pricingPlans.map((plan) => (
          <div
            key={plan.id}
            className={`${styles.pricingCard} ${plan.popular ? styles.popularCard : ""}`}
          >
            {plan.popular && (
              <div className={styles.popularBadge}>
                <Sparkles size={14} />
                <span>{plan.badge}</span>
              </div>
            )}
            {!plan.popular && (
              <span className={styles.normalBadge}>{plan.badge}</span>
            )}

            <h3 className={styles.planTitle}>{plan.title}</h3>

            <div className={styles.priceContainer}>
              <span className={styles.priceAmount}>{plan.price}</span>
              <div className={styles.priceMeta}>
                <span className={styles.priceCurrency}>{plan.currency}</span>
                <span className={styles.pricePeriod}>/ {plan.period}</span>
              </div>
            </div>

            <ul className={styles.featuresList}>
              {plan.features.map((feature, i) => (
                <li key={i}>
                  <Check size={16} className={styles.checkIcon} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button
              className={`${styles.ctaBtn} ${plan.popular ? styles.popularCtaBtn : ""}`}
              onClick={() =>
                alert(`تم اختيار ${plan.title} لمدد ${activeDuration} دقيقة`)
              }
            >
              ابدأ تجربتك المجانية
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
