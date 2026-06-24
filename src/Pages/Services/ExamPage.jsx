

import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ChevronLeft,
  Clock,
  CheckCircle2,
  FileCheck2,
  AlertCircle,
} from "lucide-react";
import { api } from "../../store/slices/authSlice";
import styles from "./ExamPage.module.css";

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function ExamPage() {
  const navigate = useNavigate();
  const { examId } = useParams();

  const [examInfo, setExamInfo] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const [examData, setExamData] = useState(null); 
  const [attemptLoading, setAttemptLoading] = useState(false);
  const [attemptError, setAttemptError] = useState(null);


  const [stage, setStage] = useState("intro");
  const [userAnswers, setUserAnswers] = useState({}); 
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitError, setSubmitError] = useState(null);

  const handleSubmitRef = useRef(null);

  useEffect(() => {
    if (!examId) return;
    (async () => {
      try {
        setFetchLoading(true);
        setFetchError(null);

        const res = await api.get(`/api/quizzes/${examId}`);

        if (res.data?.code === 200 && res.data?.data) {
          const data = res.data.data;

          if (data.has_attempted) {
            navigate(`/services/exams/${examId}/review`, { replace: true });
            return;
          }

          setExamInfo(data);
        } else {
          setFetchError(res.data?.message || "حدث خطأ أثناء جلب البيانات.");
        }
      } catch (err) {
        if (err.response?.status === 401) {
          setFetchError(
            "غير مصرح لكِ بدخول الاختبار، يرجى تسجيل الدخول أولاً.",
          );
        } else if (err.response?.status === 404) {
          setFetchError("هذا الاختبار غير موجود.");
        } else {
          setFetchError("فشل الاتصال بالسيرفر، يرجى التحقق من الشبكة.");
        }
      } finally {
        setFetchLoading(false);
      }
    })();
  }, [examId, navigate]);

  async function handleStartAttempt() {
    try {
      setAttemptLoading(true);
      setAttemptError(null);
      setStage("starting");

      const res = await api.post(`/api/quizzes/${examId}/attempt`);

      if (res.data?.code === 200 && res.data?.data) {
        const data = res.data.data;
        setExamData(data);
        setTimeLeft(data.duration * 60);
        setStage("active");
      } else {
        setAttemptError(res.data?.message || "حدث خطأ أثناء بدء الاختبار.");
        setStage("intro");
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "فشل الاتصال بالسيرفر، يرجى التحقق من الشبكة.";
      setAttemptError(msg);
      setStage("intro");
    } finally {
      setAttemptLoading(false);
    }
  }
  async function handleSubmit() {
    if (stage === "submitting" || stage === "result") return;
    setStage("submitting");
    setSubmitError(null);

    const formattedAnswers = Object.entries(userAnswers).map(
      ([questionId, answerId]) => ({
        question_id: Number(questionId),
        answer_id: answerId,
      }),
    );

    try {
      const res = await api.post(`/api/quizzes/${examId}/submit`, {
        answers: formattedAnswers,
      });

      if (res.data?.code === 200) {
        setStage("result");
      } else {
        setSubmitError(res.data?.message || "حدث خطأ أثناء التسليم.");
        setStage("active");
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "فشل الاتصال بالسيرفر، يرجى التحقق من الشبكة وإعادة المحاولة.";
      setSubmitError(msg);
      setStage("active");
    }
  }

  handleSubmitRef.current = handleSubmit;

  useEffect(() => {
    if (stage !== "active") return;
    if (timeLeft <= 0) {
      handleSubmitRef.current();
      return;
    }
    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [stage, timeLeft]);

  function handleSelect(questionId, answerId) {
    if (stage !== "active") return;
    setUserAnswers((prev) => ({ ...prev, [questionId]: answerId }));
  }

  const questions = examData?.questions || [];
  const answeredCount = Object.keys(userAnswers).length;
  const progressPct = questions.length
    ? (answeredCount / questions.length) * 100
    : 0;

  if (fetchLoading) {
    return (
      <div className={styles.pageWrapper} dir="rtl">
        <div className={styles.centerState}>
          <div className={styles.spinner} />
          <p>جاري تحميل الاختبار...</p>
        </div>
      </div>
    );
  }

  if (fetchError || !examInfo) {
    return (
      <div className={styles.pageWrapper} dir="rtl">
        <div className={styles.centerState}>
          <AlertCircle size={40} className={styles.errorIcon} />
          <p className={styles.errorText}>
            {fetchError || "لم يتم العثور على هذا الاختبار."}
          </p>
          <button
            className={styles.secondaryButton}
            onClick={() => navigate("/services/exams")}
          >
            الرجوع للاختبارات
          </button>
        </div>
      </div>
    );
  }

  const displayExam = examData || examInfo;

  return (
    <div className={styles.pageWrapper} dir="rtl">
      {stage !== "active" && stage !== "submitting" && (
        <button
          className={styles.backLink}
          onClick={() => navigate("/services/exams")}
        >
          <ChevronLeft size={18} />
          <span>الاختبارات</span>
        </button>
      )}

      {(stage === "intro" || stage === "starting") && (
        <div className={styles.introCard}>
          <div className={styles.introIcon}>
            <FileCheck2 size={30} strokeWidth={1.8} />
          </div>
          <h1 className={styles.examTitle}>{examInfo.title}</h1>
          {examInfo.subject && (
            <p className={styles.subjectName}>{examInfo.subject.name}</p>
          )}
          {examInfo.teacher && (
            <p className={styles.teacherName}>
              المعلم: {examInfo.teacher.name}
            </p>
          )}

          <div className={styles.introStats}>
            <div className={styles.introStat}>
              <span className={styles.introStatValue}>
                {examInfo.questions?.length ?? "—"}
              </span>
              <span className={styles.introStatLabel}>سؤال</span>
            </div>
            <div className={styles.introStat}>
              <span className={styles.introStatValue}>{examInfo.duration}</span>
              <span className={styles.introStatLabel}>دقيقة</span>
            </div>
          </div>

          {examInfo.description && (
            <p className={styles.examDescription}>{examInfo.description}</p>
          )}

          {attemptError && (
            <div className={styles.attemptErrorBanner}>
              <AlertCircle size={16} />
              <span>{attemptError}</span>
            </div>
          )}

          <p className={styles.introHint}>
            بعد الضغط على "ابدأ الاختبار" سيبدأ العد التنازلي للوقت، وفي حالة
            انتهاء الوقت سيتم تسليم إجاباتك الحالية تلقائيًا.
          </p>

          <button
            className={styles.primaryButton}
            onClick={handleStartAttempt}
            disabled={stage === "starting"}
          >
            {stage === "starting" ? (
              <span className={styles.btnLoading}>
                <span className={styles.btnSpinner} />
                جاري التحضير...
              </span>
            ) : (
              "ابدأ الاختبار"
            )}
          </button>
        </div>
      )}

      {(stage === "active" || stage === "submitting") && (
        <div className={styles.examLayout}>
          <div className={styles.examTopBar}>
            <div className={styles.progressInfo}>
              تمت الإجابة على {answeredCount} من {questions.length}
            </div>
            <div
              className={`${styles.timer} ${timeLeft <= 60 ? styles.timerWarning : ""}`}
            >
              <Clock size={16} />
              {formatTime(timeLeft)}
            </div>
          </div>

          <div className={styles.progressTrack}>
            <div
              className={styles.progressFill}
              style={{ width: `${progressPct}%` }}
            />
          </div>

          {submitError && (
            <div className={styles.submitErrorBanner}>
              <AlertCircle size={16} />
              <span>{submitError}</span>
            </div>
          )}

          <div className={styles.questionsList}>
            {questions.map((question, qIndex) => (
              <div key={question.id} className={styles.questionCard}>
                <h3 className={styles.questionText}>
                  <span className={styles.questionNumber}>{qIndex + 1}</span>
                  {question.question_text}
                </h3>
                {question.points && (
                  <span className={styles.questionPoints}>
                    {question.points} درجة
                  </span>
                )}
                <div className={styles.optionsList}>
                  {question.answers?.map((answer) => {
                    const isSelected = userAnswers[question.id] === answer.id;
                    return (
                      <label
                        key={answer.id}
                        className={`${styles.optionLabel} ${isSelected ? styles.optionSelected : ""}`}
                      >
                        <input
                          type="radio"
                          name={String(question.id)}
                          checked={isSelected}
                          onChange={() => handleSelect(question.id, answer.id)}
                          className={styles.optionRadio}
                        />
                        {answer.answer_text}
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className={styles.submitArea}>
            {answeredCount < questions.length && (
              <p className={styles.unansweredHint}>
                لم تُجب على {questions.length - answeredCount} سؤال بعد — يمكنك
                التسليم أو إكمال الإجابات.
              </p>
            )}
            <button
              className={styles.primaryButton}
              onClick={handleSubmit}
              disabled={stage === "submitting"}
            >
              {stage === "submitting" ? (
                <span className={styles.btnLoading}>
                  <span className={styles.btnSpinner} />
                  جاري التسليم...
                </span>
              ) : (
                "تسليم الاختبار"
              )}
            </button>
          </div>
        </div>
      )}

      {stage === "result" && (
        <div className={styles.resultLayout}>
          <div className={styles.resultCard}>
            <div className={styles.resultIconWrapper}>
              <CheckCircle2
                size={64}
                strokeWidth={1.5}
                className={styles.successIcon}
              />
            </div>
            <h2 className={styles.resultTitle}>تم تسليم إجاباتك بنجاح!</h2>
            <p className={styles.resultSubtitle}>
              استلمنا إجاباتك بنجاح وجاري مراجعتها وتصحيحها من قِبل المعلم.
              <br />
              ستتمكنين من رؤية نتيجتك التفصيلية فور اعتمادها وتصحيحها.
            </p>

            <div className={styles.pendingNote}>
              <Clock size={16} />
              <span>النتيجة ستظهر في قائمة الاختبارات بعد انتهاء التصحيح</span>
            </div>
          </div>

          <div className={styles.resultActions}>
            <button
              className={styles.primaryButton}
              onClick={() => navigate("/services/exams")}
            >
              العودة للاختبارات
            </button>
            <button
              className={styles.secondaryButton}
              onClick={() => navigate("/services")}
            >
              الصفحة الرئيسية
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
