// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import styles from "./AskScholarPage.module.css";
// import { useTranslation } from "react-i18next";
// import { ChevronLeft, ChevronRight, Send, CheckCircle } from "lucide-react";

// const INITIAL = {
//   name: "",
//   email: "",
//   phone: "",
//   country: "",
//   city: "",
//   question: "",
// };

// export default function AskScholarPage() {
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
//     if (!form.name.trim()) errs.name = "مطلوب";
//     if (!form.email.trim()) errs.email = "مطلوب";
//     if (!form.phone.trim()) errs.phone = "مطلوب";
//     if (!form.country.trim()) errs.country = "مطلوب";
//     if (!form.city.trim()) errs.city = "مطلوب";
//     if (!form.question.trim()) errs.question = "مطلوب";
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
//       // await api.post("/ask-scholar", form);
//       await new Promise((r) => setTimeout(r, 800)); // simulate
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
//             <h2>تم إرسال سؤالك بنجاح!</h2>
//             <p>سيقوم أحد العلماء بالرد عليك في أقرب وقت ممكن.</p>
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
//           <h1 className={styles.title}>اسأل العلماء</h1>
//         </div>

//         {/* ── Desc from dashboard ── */}
//         <p className={styles.desc}>نص يمكن تعديله من الداشبورد</p>

//         {/* ── Form ── */}
//         <div className={styles.form}>
//           <div className={styles.field}>
//             <label>اسم</label>
//             <input
//               type="text"
//               placeholder="نص مؤقت يمكن استبداله"
//               value={form.name}
//               onChange={set("name")}
//               className={errors.name ? styles.hasError : ""}
//             />
//             {errors.name && <span className={styles.error}>{errors.name}</span>}
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

//           <div className={styles.row2}>
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
//             <div className={styles.field}>
//               <label>المدينه</label>
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
//           </div>

//           <div className={styles.field}>
//             <label>الرجاء كتابة السؤال</label>
//             <textarea
//               placeholder="نص مؤقت يمكن استبداله"
//               value={form.question}
//               onChange={set("question")}
//               className={errors.question ? styles.hasError : ""}
//               rows={5}
//             />
//             {errors.question && (
//               <span className={styles.error}>{errors.question}</span>
//             )}
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

export default function AskScholars() {
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
        <h2 className={styles.greenTitle}>اسأل العلماء</h2>
      </div>

      <p className={styles.formHint}>
        نص يمكن تعديله من الداشبورد
        ............................................................
      </p>

      <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
        <div className={styles.inputGroup}>
          <label>اسم</label>
          <input type="text" placeholder="نص مؤقت يمكن استبداله" />
        </div>

        <div className={styles.inputGroup}>
          <label>البريد الإلكتروني</label>
          <input type="email" placeholder="add61542@gmail.com" />
        </div>

        <div className={styles.inputGroup}>
          <label>رقم الهاتف</label>
          <div className={styles.phoneWrapper}>
            <input type="tel" placeholder="يدخل رقم الواتساب" />
            <span className={styles.flagIcon}>🇪🇬</span>
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label>الدولة</label>
          <input type="text" placeholder="نص مؤقت" />
        </div>

        <div className={styles.inputGroup}>
          <label>المدينة</label>
          <input type="text" placeholder="نص مؤقت" />
        </div>

        <div className={styles.inputGroup}>
          <label>الرجاء كتابه السؤال</label>
          <textarea placeholder="نص مؤقت يمكن استبداله" rows={4}></textarea>
        </div>

        <button type="submit" className={styles.submitBtn}>
          إرسال
        </button>
      </form>
    </div>
  );
}