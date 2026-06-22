import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowRight, Plus, Trash2 } from "lucide-react";
import styles from "./AddExam.module.css";

export default function AddExam() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const student = state?.student || { name: "الطالب" };

  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [questions, setQuestions] = useState([{ id: 1, text: "", answer: "" }]);

  const addQuestion = () =>
    setQuestions((p) => [...p, { id: Date.now(), text: "", answer: "" }]);

  const removeQuestion = (id) =>
    setQuestions((p) => p.filter((q) => q.id !== id));

  const updateQuestion = (id, field, val) =>
    setQuestions((p) =>
      p.map((q) => (q.id === id ? { ...q, [field]: val } : q)),
    );

  const handleSubmit = () => {
    alert("تم إضافة الاختبار بنجاح ✅");
    navigate(-1);
  };

  return (
    <div className={styles.container} dir="rtl">
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <ArrowRight size={22} />
        </button>
        <h1 className={styles.headerTitle}>إضافة اختبار</h1>
      </div>

      <div className={styles.studentBanner}>
        <span className={styles.studentIcon}>👤</span>
        <div>
          <p className={styles.bannerLabel}>الطالب</p>
          <p className={styles.bannerName}>{student.name}</p>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.field}>
          <label className={styles.label}>عنوان الاختبار</label>
          <input
            className={styles.input}
            type="text"
            placeholder="مثال: اختبار سورة البقرة"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>تاريخ التسليم</label>
          <input
            className={styles.input}
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        <div className={styles.questionsSection}>
          <div className={styles.questionHeader}>
            <span className={styles.label}>الأسئلة</span>
            <button className={styles.addQuestionBtn} onClick={addQuestion}>
              <Plus size={15} /> إضافة سؤال
            </button>
          </div>

          {questions.map((q, i) => (
            <div key={q.id} className={styles.questionBlock}>
              <div className={styles.questionTop}>
                <span className={styles.qNum}>سؤال {i + 1}</span>
                {questions.length > 1 && (
                  <button
                    className={styles.removeBtn}
                    onClick={() => removeQuestion(q.id)}
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
              <input
                className={styles.input}
                type="text"
                placeholder="نص السؤال"
                value={q.text}
                onChange={(e) => updateQuestion(q.id, "text", e.target.value)}
              />
              <input
                className={`${styles.input} ${styles.answerInput}`}
                type="text"
                placeholder="الإجابة الصحيحة (اختياري)"
                value={q.answer}
                onChange={(e) => updateQuestion(q.id, "answer", e.target.value)}
              />
            </div>
          ))}
        </div>

        <button className={styles.submitBtn} onClick={handleSubmit}>
          حفظ الاختبار
        </button>
      </div>
    </div>
  );
}
