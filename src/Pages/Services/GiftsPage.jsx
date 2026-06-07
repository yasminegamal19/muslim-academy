// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import styles from "./GiftsPage.module.css";
// import { useTranslation } from "react-i18next";
// import { ChevronLeft, ChevronRight, Send, CheckCircle } from "lucide-react";

// const INITIAL = {
//   studentName: "",
//   studentAge: "",
//   studentGender: "",
//   email: "",
//   phone: "",
//   teacherGender: "",
//   city: "",
//   country: "",
//   timezone: "",
//   referral: "",
// };

// const TIMEZONES = [
//   "GMT+0",
//   "GMT+1",
//   "GMT+2 (مصر/القاهرة)",
//   "GMT+3 (السعودية)",
//   "GMT+4 (الإمارات)",
//   "GMT+5",
//   "GMT+5:30 (الهند)",
//   "GMT+8",
// ];

// const REFERRAL_SOURCES = ["سوشيال ميديا", "صديق", "محرك بحث", "إعلان", "أخرى"];

// export default function GiftsPage() {
//   const navigate = useNavigate();
//   const { t, i18n } = useTranslation();
//   const isRtl = i18n.language?.startsWith("ar");

//   const [form, setForm] = useState(INITIAL);
//   const [errors, setErrors] = useState({});
//   const [submitted, setSubmitted] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const set = (field) => (e) => {
//     setForm((prev) => ({ ...prev, [field]: e.target.value }));
//     setErrors((prev) => ({ ...prev, [field]: "" }));
//   };

//   const validate = () => {
//     const errs = {};
//     if (!form.studentName.trim()) errs.studentName = "مطلوب";
//     if (!form.studentAge.trim()) errs.studentAge = "مطلوب";
//     if (!form.studentGender) errs.studentGender = "مطلوب";
//     if (!form.email.trim()) errs.email = "مطلوب";
//     if (!form.phone.trim()) errs.phone = "مطلوب";
//     if (!form.teacherGender) errs.teacherGender = "مطلوب";
//     if (!form.city.trim()) errs.city = "مطلوب";
//     if (!form.country.trim()) errs.country = "مطلوب";
//     if (!form.timezone) errs.timezone = "مطلوب";
//     return errs;
//   };

//   const handleSubmit = async () => {
//     const errs = validate();
//     if (Object.keys(errs).length) {
//       setErrors(errs);
//       return;
//     }

//     setLoading(true);
//     try {
//       // TODO: استبدلي بـ API call حقيقي
//       // await api.post("/gifts", form);
//       await new Promise((r) => setTimeout(r, 800));
//       setSubmitted(true);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (submitted) {
//     return (
//       <div className={styles.page}>
//         <div className={styles.container}>
//           <div className={styles.success}>
//             <div className={styles.successIcon}>
//               <CheckCircle size={44} />
//             </div>
//             <h2>تم إرسال طلب الهدية بنجاح!</h2>
//             <p>سنقوم بالتواصل معك في أقرب وقت ممكن.</p>
//             <button
//               className={styles.backHomeBtn}
//               onClick={() => navigate("/services")}
//             >
//               العودة للخدمات
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className={styles.page}>
//       <div className={styles.container}>
//         {/* ── Header ── */}
//         <div className={styles.header}>
//           <button
//             className={styles.backBtn}
//             onClick={() => navigate(-1)}
//             aria-label="back"
//           >
//             {isRtl ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
//           </button>
//           <h1 className={styles.title}>هدايا</h1>
//         </div>

//         {/* ── Intro text ── */}
//         <div className={styles.introBox}>
//           <p>
//             هل تريد أن تستمر في كسب الأعمال الصالحة إلى الأبد؟
//             <br />
//             هل ترغب في تقديم هدية قيمة لمن تحب؟
//             <br />
//             هل ترغب في مساعدة الآخرين على تعلم كل شيء عن الإسلام؟
//             <br />
//             يمكن لك الاكاديمية الإسلامية الآن على تقديم هذه الهدية لحضور
//             دوراتنا. يمكنكم شراؤها لأفراد عائلاتكم، أو أصدقائكم، أو أي شخص
//             ترغبون في معرفة المزيد عن الإسلام أو حتى اعتناقه.
//           </p>
//           <p className={styles.introSub}>
//             ما عليك سوى ملء النموذج أدناه وإيصال هديتك إلى من تهتم لأمرهم.
//           </p>
//         </div>

//         {/* ── Form ── */}
//         <div className={styles.form}>
//           <div className={styles.field}>
//             <label>اسم الطالب</label>
//             <input
//               type="text"
//               placeholder="نص مؤقت يمكن استبداله"
//               value={form.studentName}
//               onChange={set("studentName")}
//               className={errors.studentName ? styles.hasError : ""}
//             />
//             {errors.studentName && (
//               <span className={styles.error}>{errors.studentName}</span>
//             )}
//           </div>

//           <div className={styles.row2}>
//             <div className={styles.field}>
//               <label>عمر الطالب</label>
//               <input
//                 type="number"
//                 placeholder="نص مؤقت"
//                 value={form.studentAge}
//                 onChange={set("studentAge")}
//                 className={errors.studentAge ? styles.hasError : ""}
//                 min="5"
//               />
//               {errors.studentAge && (
//                 <span className={styles.error}>{errors.studentAge}</span>
//               )}
//             </div>
//             <div className={styles.field}>
//               <label>جنس الطالب</label>
//               <select
//                 value={form.studentGender}
//                 onChange={set("studentGender")}
//                 className={errors.studentGender ? styles.hasError : ""}
//               >
//                 <option value="">اختر...</option>
//                 <option value="male">ذكر</option>
//                 <option value="female">أنثى</option>
//               </select>
//               {errors.studentGender && (
//                 <span className={styles.error}>{errors.studentGender}</span>
//               )}
//             </div>
//           </div>

//           <div className={styles.field}>
//             <label>البريد الإلكتروني</label>
//             <div className={styles.inputIcon}>
//               <input
//                 type="email"
//                 placeholder="add51542@gmail.com"
//                 value={form.email}
//                 onChange={set("email")}
//                 className={errors.email ? styles.hasError : ""}
//               />
//               <svg
//                 width="18"
//                 height="18"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="1.8"
//               >
//                 <rect x="2" y="4" width="20" height="16" rx="2" />
//                 <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
//               </svg>
//             </div>
//             {errors.email && (
//               <span className={styles.error}>{errors.email}</span>
//             )}
//           </div>

//           <div className={styles.field}>
//             <label>رقم الهاتف</label>
//             <div className={styles.phoneRow}>
//               <div className={styles.countryCode}>
//                 <img
//                   src="https://flagcdn.com/w20/eg.png"
//                   alt="Egypt"
//                   width="20"
//                 />
//                 <span>مصر</span>
//                 <svg
//                   width="14"
//                   height="14"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="2.5"
//                 >
//                   <polyline points="6 9 12 15 18 9" />
//                 </svg>
//               </div>
//               <input
//                 type="tel"
//                 placeholder="يفضل رقم الواتساب"
//                 value={form.phone}
//                 onChange={set("phone")}
//                 className={`${styles.phoneInput} ${errors.phone ? styles.hasError : ""}`}
//               />
//             </div>
//             {errors.phone && (
//               <span className={styles.error}>{errors.phone}</span>
//             )}
//           </div>

//           <div className={styles.field}>
//             <label>جنس المعلم</label>
//             <select
//               value={form.teacherGender}
//               onChange={set("teacherGender")}
//               className={errors.teacherGender ? styles.hasError : ""}
//             >
//               <option value="">اختر...</option>
//               <option value="male">معلم ذكر</option>
//               <option value="female">معلمة أنثى</option>
//             </select>
//             {errors.teacherGender && (
//               <span className={styles.error}>{errors.teacherGender}</span>
//             )}
//           </div>

//           <div className={styles.row2}>
//             <div className={styles.field}>
//               <label>المدينة</label>
//               <input
//                 type="text"
//                 placeholder="نص مؤقت"
//                 value={form.city}
//                 onChange={set("city")}
//                 className={errors.city ? styles.hasError : ""}
//               />
//               {errors.city && (
//                 <span className={styles.error}>{errors.city}</span>
//               )}
//             </div>
//             <div className={styles.field}>
//               <label>الدولة</label>
//               <input
//                 type="text"
//                 placeholder="نص مؤقت"
//                 value={form.country}
//                 onChange={set("country")}
//                 className={errors.country ? styles.hasError : ""}
//               />
//               {errors.country && (
//                 <span className={styles.error}>{errors.country}</span>
//               )}
//             </div>
//           </div>

//           <div className={styles.field}>
//             <label>المنطقة الزمنية</label>
//             <select
//               value={form.timezone}
//               onChange={set("timezone")}
//               className={errors.timezone ? styles.hasError : ""}
//             >
//               <option value="">اختر المنطقة الزمنية...</option>
//               {TIMEZONES.map((tz) => (
//                 <option key={tz} value={tz}>
//                   {tz}
//                 </option>
//               ))}
//             </select>
//             {errors.timezone && (
//               <span className={styles.error}>{errors.timezone}</span>
//             )}
//           </div>

//           <div className={styles.field}>
//             <label>من اين عرفت مسلم اكاديمي</label>
//             <select value={form.referral} onChange={set("referral")}>
//               <option value="">اختر...</option>
//               {REFERRAL_SOURCES.map((s) => (
//                 <option key={s} value={s}>
//                   {s}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <button
//             className={styles.submitBtn}
//             onClick={handleSubmit}
//             disabled={loading}
//           >
//             {loading ? (
//               <span className={styles.spinner} />
//             ) : (
//               <>
//                 <Send size={16} /> ارسال
//               </>
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useNavigate } from "react-router-dom";
import styles from "../../components/ServisesSection/ServicesSection.module.css";
import { ArrowRight } from "lucide-react";

export default function Gifts() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <button
          onClick={() => navigate("/services")}
          className={styles.backBtn}
        >
          <ArrowRight size={20} />
        </button>
        <h2 className={styles.greenTitle}>هدايا</h2>
      </div>

      <div className={styles.giftsDescription}>
        <p>هل تريد أن تستمر في كسب الأعمال الصالحة إلى الأبد؟</p>
        <p>هل ترغب في تقديم هدية قيمة لمن تحب؟</p>
        <p>هل ترغب في مساعدة الآخرين على تعلم كل شيء عن الإسلام؟</p>
        <p>
          تقدم لكم الأكاديمية الإسلامية الآن قسيمة هدية لحضور دوراتنا، يمكنكم
          شرائها لأفراد عائلتكم، أو أصدقائكم أو أي شخص ترغبون في معرفة المزيد عن
          الإسلام أو حتى اعتناقه.
        </p>
        <p>ما عليك سوى ملء النموذج أدناه وإرسال هديتك إلى من تهتم لأمرهم.</p>
      </div>

      <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
        <div className={styles.inputGroup}>
          <label>اسم الطالب</label>
          <input type="text" placeholder="نص مؤقت يمكن استبداله" />
        </div>

        <div className={styles.inputGroup}>
          <label>عمر الطالب</label>
          <input type="text" placeholder="نص مؤقت" />
        </div>

        <div className={styles.inputGroup}>
          <label>جنس الطالب</label>
          <select defaultValue="">
            <option value="" disabled>
              نص مؤقت
            </option>
            <option value="male">ذكر</option>
            <option value="female">أنثى</option>
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label>البريد الإلكتروني</label>
          <input type="email" placeholder="add61542@gmail.com" />
        </div>

        <div className={styles.inputGroup}>
          <label>رقم الهاتف</label>
          <div className={styles.phoneWrapper}>
            <input type="tel" placeholder="نص مؤقت" />
            <span className={styles.flagIcon}>🇪🇬</span>
          </div>
        </div>

        <button type="submit" className={styles.submitBtn}>
          إرسال
        </button>
      </form>
    </div>
  );
}
