import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./SubscriptionPage.module.css";
import Toast from "../../components/Toast/Toast";
import { api } from "../../store/slices/authSlice";

const PLANS_URL = "https://muslim-academy.betamoneta.com/api/plans/grouped";

const ALL_DAYS = [
  { value: 0, label: "الأحد" },
  { value: 1, label: "الاثنين" },
  { value: 2, label: "الثلاثاء" },
  { value: 3, label: "الأربعاء" },
  { value: 4, label: "الخميس" },
  { value: 5, label: "الجمعة" },
  { value: 6, label: "السبت" },
];

const BILLING_CYCLES = [
  { key: 1, label: "شهر", labelShort: "شهرياً" },
  { key: 3, label: "3 شهور", labelShort: "كل 3 شهور" },
  { key: 6, label: "6 شهور", labelShort: "كل 6 شهور" },
];

export default function SubscriptionPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const course = location.state?.course || null;

  const [groupedPlans, setGroupedPlans] = useState(null); 
  const [availableDurations, setAvailableDurations] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [classDuration, setClassDuration] = useState(null);
  const [billingCycle, setBillingCycle] = useState(1);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [selectedDays, setSelectedDays] = useState([]); 
  const [scheduleTime, setScheduleTime] = useState(""); 

  const [subscribing, setSubscribing] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const res = await fetch(PLANS_URL);
        const json = await res.json();
        if (json.code !== 200)
          throw new Error(json.message || "فشل تحميل الباقات");

        const grouped = json.data;
        setGroupedPlans(grouped);

        const durations = Object.keys(grouped).sort((a, b) => {
          return parseInt(a) - parseInt(b);
        });
        setAvailableDurations(durations);
        setClassDuration(durations[0] || null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const currentPlans =
    groupedPlans && classDuration ? groupedPlans[classDuration] || [] : [];
  const activePlan = currentPlans.find((p) => p.id === selectedPlanId) || null;

  const getPriceForPlan = (plan) =>
    plan?.prices?.find((p) => p.duration_months === billingCycle) || null;

  const getMaxDiscount = (months) => {
    if (!currentPlans.length) return 0;
    return Math.max(
      ...currentPlans.map((plan) => {
        const p = plan.prices?.find((pr) => pr.duration_months === months);
        return p ? parseFloat(p.discount) : 0;
      }),
    );
  };

  const formatDurationLabel = (key) => {
    const mins = parseInt(key);
    if (!mins) return key;
    return `${mins} دقيقة`;
  };

  const toggleDay = (dayValue) => {
    setSelectedDays((prev) =>
      prev.includes(dayValue)
        ? prev.filter((d) => d !== dayValue)
        : [...prev, dayValue],
    );
  };

  const isFormValid = activePlan && selectedDays.length > 0 && scheduleTime;

  const handleSubscribe = async () => {
    console.log("selectedDays:", selectedDays);
    console.log("scheduleTime:", scheduleTime);
    if (!isFormValid) return;

    if (!course?.id) {
      
      setToast({
        message:
          " حدث خطأ: لم يتم تحديد الدورة. يرجى العودة واختيار الدورة مجدداً.",
        type: "error",
      });
      return;
    }

    const priceObj = getPriceForPlan(activePlan);
    if (!priceObj) return;

    setSubscribing(true);
    try {
      const formData = new FormData();
      formData.append("plan_price_id", priceObj.id);
      formData.append("course_id", course.id);
      formData.append("schedule_time", scheduleTime);

      selectedDays.forEach((day) => {
        formData.append("schedule_days[]", day);
      });
for (const pair of formData.entries()) {
  console.log(pair[0], pair[1]);
}
      const res = await api.post("/subscriptions", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.code === 200 || res.data?.code === 201) {
        setToast({
          message:
            " تم الاشتراك بنجاح! يمكنك متابعة باقاتك من صفحة اشتراكاتي.",
          type: "success",
        });
        setTimeout(() => navigate("/my-subscriptions"), 2000);
      } else {
        throw new Error(res.data?.message || "فشل الاشتراك");
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "حدث خطأ أثناء الاشتراك، يرجى المحاولة مرة أخرى.";
      setToast({ message: ` ${msg}`, type: "error" });
    } finally {
      setSubscribing(false);
    }
  };
  function formatTime12(timeStr) {
    if (!timeStr) return "";
    const [h, m] = timeStr.split(":");
    const hour = parseInt(h, 10);
    const suffix = hour >= 12 ? "م" : "ص";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${m} ${suffix}`;
  }

  if (loading)
    return (
      <div className={styles.page} dir="rtl">
        <div className={styles.loadingState}>
          <div className={styles.spinner} />
          <p>جاري تحميل الباقات…</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className={styles.page} dir="rtl">
        <div className={styles.errorState}>
          <p> {error}</p>
          <button onClick={() => window.location.reload()}>
            إعادة المحاولة
          </button>
        </div>
      </div>
    );

  return (
    <div className={styles.page} dir="rtl">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            width="16"
            height="16"
            style={{ marginLeft: 6 }}
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 19 12 12 5" />
          </svg>
          رجوع
        </button>
        <div className={styles.headerText}>
          <h1>اختر باقتك</h1>
          {course && (
            <p>
              دورة: <strong>{course.title || course.name}</strong>
            </p>
          )}
        </div>
      </div>

      <div className={styles.container}>
        <section className={styles.step}>
          <div className={styles.stepLabel}>
            <span className={styles.stepNum}>١</span>
            مدة الحصة
          </div>
          <div className={styles.durationTabs}>
            {availableDurations.map((key) => (
              <button
                key={key}
                className={`${styles.durationTab} ${classDuration === key ? styles.durationTabActive : ""}`}
                onClick={() => {
                  setClassDuration(key);
                  setSelectedPlanId(null);
                }}
              >
                {formatDurationLabel(key)}
              </button>
            ))}
          </div>
        </section>

        <section className={styles.step}>
          <div className={styles.stepLabel}>
            <span className={styles.stepNum}>٢</span>
            مدة الاشتراك
          </div>
          <div className={styles.billingRow}>
            {BILLING_CYCLES.map((cycle) => {
              const maxSave = getMaxDiscount(cycle.key);
              return (
                <button
                  key={cycle.key}
                  className={`${styles.billingBtn} ${billingCycle === cycle.key ? styles.billingBtnActive : ""}`}
                  onClick={() => setBillingCycle(cycle.key)}
                >
                  {cycle.label}
                  {maxSave > 0 && (
                    <span className={styles.saveBadge}>
                      وفّر حتى £{maxSave}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        <section className={styles.step}>
          <div className={styles.stepLabel}>
            <span className={styles.stepNum}>٣</span>
            عدد الحصص في الأسبوع
          </div>
          <div className={styles.plansGrid}>
            {currentPlans.map((plan) => {
              const priceObj = getPriceForPlan(plan);
              if (!priceObj) return null;
              const price = parseFloat(priceObj.price);
              const discount = parseFloat(priceObj.discount);
              const isActive = selectedPlanId === plan.id;

              const planLabel =
                plan.slug?.split("-")[1]?.toUpperCase() || plan.id;

              return (
                <button
                  key={plan.id}
                  className={`${styles.planCard} ${isActive ? styles.planCardActive : ""}`}
                  onClick={() => setSelectedPlanId(plan.id)}
                >
                  <div className={styles.planBadge}>{planLabel}</div>
                  <div className={styles.planSessions}>
                    {plan.sessions_per_week}{" "}
                    {parseInt(plan.sessions_per_week) === 1 ? "حصة" : "حصص"} /
                    أسبوع
                  </div>
                  <div className={styles.planClasses}>
                    {plan.sessions_per_month} حصة / شهر
                  </div>
                  <div className={styles.planPrice}>
                    £{price}
                    <span className={styles.planPricePer}>
                      /{" "}
                      {
                        BILLING_CYCLES.find((c) => c.key === billingCycle)
                          ?.labelShort
                      }
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className={styles.planSave}>وفّر £{discount}</div>
                  )}
                  {isActive && (
                    <div className={styles.planCheck}>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        width="14"
                        height="14"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        <section className={styles.step}>
          <div className={styles.stepLabel}>
            <span className={styles.stepNum}>٤</span>
            أيام الحصص المفضلة
            <span className={styles.stepHint}>اختر يوم أو أكثر</span>
          </div>
          <div className={styles.daysGrid}>
            {ALL_DAYS.map((day) => {
              const isSelected = selectedDays.includes(day.value);
              return (
                <button
                  key={day.value}
                  className={`${styles.dayBtn} ${isSelected ? styles.dayBtnActive : ""}`}
                  onClick={() => toggleDay(day.value)}
                >
                  {isSelected && <span className={styles.dayCheck}>✓</span>}
                  {day.label}
                </button>
              );
            })}
          </div>
          {selectedDays.length > 0 && (
            <p className={styles.selectedDaysNote}>
              ✅ اخترت {selectedDays.length}{" "}
              {selectedDays.length === 1 ? "يوم" : "أيام"}:{" "}
              {selectedDays
                .sort((a, b) => a - b)
                .map((v) => ALL_DAYS.find((d) => d.value === v)?.label)
                .join(" • ")}
            </p>
          )}
        </section>

        <section className={styles.step}>
          <div className={styles.stepLabel}>
            <span className={styles.stepNum}>٥</span>
            الوقت المفضل للحصة
          </div>
          <div className={styles.timePickerWrapper}>
            <input
              type="time"
              className={styles.timePicker}
              value={scheduleTime}
              onChange={(e) => setScheduleTime(e.target.value)}
            />
            {scheduleTime && (
              <p className={styles.timeNote}>
                🕐 الوقت المختار: <strong>{formatTime12(scheduleTime)}</strong>
                <span className={styles.timezoneNote}> (بتوقيتك المحلي)</span>
              </p>
            )}
          </div>
        </section>

        {activePlan &&
          (() => {
            const priceObj = getPriceForPlan(activePlan);
            if (!priceObj) return null;
            return (
              <div className={styles.summary}>
                <h3 className={styles.summaryTitle}>ملخص الاشتراك</h3>
                <div className={styles.summaryDetails}>
                  <div className={styles.summaryRow}>
                    <span>الدورة</span>
                    <strong>{course?.title || course?.name || "—"}</strong>
                  </div>
                  <div className={styles.summaryRow}>
                    <span>مدة الحصة</span>
                    <strong>{formatDurationLabel(classDuration)}</strong>
                  </div>
                  <div className={styles.summaryRow}>
                    <span>عدد الحصص</span>
                    <strong>
                      {activePlan.sessions_per_week} / أسبوع (
                      {activePlan.sessions_per_month} / شهر)
                    </strong>
                  </div>
                  <div className={styles.summaryRow}>
                    <span>مدة الاشتراك</span>
                    <strong>
                      {
                        BILLING_CYCLES.find((c) => c.key === billingCycle)
                          ?.label
                      }
                    </strong>
                  </div>
                  {selectedDays.length > 0 && (
                    <div className={styles.summaryRow}>
                      <span>الأيام</span>
                      <strong>
                        {selectedDays
                          .sort((a, b) => a - b)
                          .map(
                            (v) => ALL_DAYS.find((d) => d.value === v)?.label,
                          )
                          .join(" • ")}
                      </strong>
                    </div>
                  )}
                  {scheduleTime && (
                    <div className={styles.summaryRow}>
                      <span>الوقت</span>
                      <strong>{formatTime12(scheduleTime)}</strong>
                    </div>
                  )}
                  {parseFloat(priceObj.discount) > 0 && (
                    <div className={styles.summaryRow}>
                      <span>الخصم</span>
                      <strong className={styles.discountText}>
                        - £{priceObj.discount}
                      </strong>
                    </div>
                  )}
                  <div
                    className={`${styles.summaryRow} ${styles.summaryTotal}`}
                  >
                    <span>الإجمالي</span>
                    <strong>£{priceObj.price}</strong>
                  </div>
                </div>

                {!selectedDays.length && (
                  <p className={styles.validationHint}>
                    ⚠️ يرجى اختيار يوم واحد على الأقل
                  </p>
                )}
                {!scheduleTime && (
                  <p className={styles.validationHint}>
                    ⚠️ يرجى تحديد الوقت المفضل
                  </p>
                )}

                <button
                  className={styles.subscribeBtn}
                  onClick={handleSubscribe}
                  disabled={subscribing || !isFormValid}
                >
                  {subscribing ? (
                    <>
                      <span className={styles.btnSpinner} />
                      جاري تأكيد الاشتراك…
                    </>
                  ) : (
                    <>
                      اشترك الآن والمتابعة للدفع
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        width="16"
                        height="16"
                        style={{ marginRight: 8 }}
                      >
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            );
          })()}

        {!activePlan && (
          <p className={styles.selectHint}>← اختر باقة علشان تكمل</p>
        )}
      </div>
    </div>
  );
}
