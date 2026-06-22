

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, FileCheck2, Clock, User } from "lucide-react";
import { api } from "../../store/slices/authSlice";
import styles from "./ExamsListPage.module.css";

export default function ExamsListPage() {
  const navigate = useNavigate();

  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    fetchQuizzes(page);
  }, [page]);

  async function fetchQuizzes(currentPage) {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/quizzes?page=${currentPage}`);
      const result = response.data;

      if (result.code === 200) {
        setQuizzes(result.data);
        setPagination(result.pagination);
      } else {
        setError(result.message || "حدث خطأ أثناء جلب الاختبارات.");
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setError("غير مصرح لكِ بالعرض، يرجى تسجيل الدخول أولاً.");
      } else {
        setError("فشل الاتصال بالسيرفر، يرجى التحقق من الشبكة.");
      }
    } finally {
      setLoading(false);
    }
  }

  function getQuizStatus(quiz) {
    if (!quiz.has_attempted) return "not_started";
    if (
      quiz.user_score_percentage !== undefined &&
      quiz.user_score_percentage !== null
    ) {
      return "corrected";
    }
    return "pending";
  }

  function getButtonLabel(status) {
    switch (status) {
      case "corrected":
        return "عرض النتيجة";
      case "pending":
        return "قيد المراجعة";
      default:
        return "ابدأ الاختبار";
    }
  }

  function handleCardClick(quiz) {
    const status = getQuizStatus(quiz);
    if (status === "corrected") {
      navigate(`/services/exams/${quiz.id}/review`);
    } else if (status === "pending") {
      return;
    } else {
      navigate(`/services/exams/${quiz.id}`);
    }
  }

  return (
    <div className={styles.pageWrapper} dir="rtl">
      <div className={styles.pageHeader}>
        <button
          className={styles.backLink}
          onClick={() => navigate("/services")}
        >
          <ChevronLeft size={18} />
          <span>الخدمات</span>
        </button>
        <div className={styles.headerTitle}>
          <div className={styles.headerIcon}>
            <FileCheck2 size={24} strokeWidth={1.8} />
          </div>
          <div>
            <h1 className={styles.title}>الاختبارات</h1>
            <p className={styles.subtitle}>اختاري الاختبار وابدئي الحل</p>
          </div>
        </div>
      </div>

      {loading && (
        <div className={styles.centerState}>
          <div className={styles.spinner} />
          <p>جاري تحميل الاختبارات...</p>
        </div>
      )}

      {!loading && error && (
        <div className={styles.centerState}>
          <p className={styles.errorText}>{error}</p>
          <button
            className={styles.retryBtn}
            onClick={() => fetchQuizzes(page)}
          >
            إعادة المحاولة
          </button>
        </div>
      )}

      {!loading && !error && quizzes.length === 0 && (
        <div className={styles.centerState}>
          <FileCheck2
            size={48}
            strokeWidth={1.2}
            className={styles.emptyIcon}
          />
          <p className={styles.emptyText}>لا توجد اختبارات متاحة حالياً</p>
        </div>
      )}

      {!loading && !error && quizzes.length > 0 && (
        <>
          <div className={styles.quizzesGrid}>
            {quizzes.map((quiz) => {
              const status = getQuizStatus(quiz);
              const isPending = status === "pending";

              return (
                <div
                  key={quiz.id}
                  className={`${styles.quizCard} ${isPending ? styles.quizCardPending : ""}`}
                  onClick={() => handleCardClick(quiz)}
                  style={{ cursor: isPending ? "default" : "pointer" }}
                >
                  <div className={styles.quizCardHeader}>
                    <div className={styles.quizIcon}>
                      <FileCheck2 size={20} strokeWidth={1.8} />
                    </div>
                    <div className={styles.badgesRow}>
                      {quiz.subject && (
                        <span className={styles.subjectBadge}>
                          {quiz.subject.name}
                        </span>
                      )}
                      {status === "corrected" && (
                        <span
                          className={`${styles.statusBadge} ${styles.statusCorrected}`}
                        >
                          تم التصحيح
                        </span>
                      )}
                      {status === "pending" && (
                        <span
                          className={`${styles.statusBadge} ${styles.statusPending}`}
                        >
                          قيد المراجعة
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className={styles.quizTitle}>{quiz.title}</h3>

                  {status === "corrected" &&
                    quiz.user_score_percentage !== undefined && (
                      <div className={styles.scoreRow}>
                        <span className={styles.scoreLabel}>نتيجتك:</span>
                        <span className={styles.scoreValue}>
                          {quiz.user_score_percentage}%
                        </span>
                      </div>
                    )}

                  <div className={styles.quizMeta}>
                    {quiz.teacher && (
                      <div className={styles.metaItem}>
                        <User size={14} />
                        <span>{quiz.teacher.name}</span>
                      </div>
                    )}
                    <div className={styles.metaItem}>
                      <Clock size={14} />
                      <span>{quiz.duration} دقيقة</span>
                    </div>
                  </div>

                  <button
                    className={`${styles.startBtn} ${isPending ? styles.startBtnDisabled : ""}`}
                    disabled={isPending}
                  >
                    {getButtonLabel(status)}
                    {!isPending && <ChevronLeft size={16} />}
                  </button>
                </div>
              );
            })}
          </div>

          {pagination && pagination.last_page > 1 && (
            <div className={styles.pagination}>
              <button
                className={styles.pageBtn}
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                السابق
              </button>
              <span className={styles.pageInfo}>
                {pagination.current_page} / {pagination.last_page}
              </span>
              <button
                className={styles.pageBtn}
                disabled={page >= pagination.last_page}
                onClick={() => setPage((p) => p + 1)}
              >
                التالي
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
