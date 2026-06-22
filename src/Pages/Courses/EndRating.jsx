import styles from "./EndRating.module.css";
import { useState } from "react";

export function EndScreen({ course, onRate, onHome }) {
  return (
    <div className={styles.meeting} dir="rtl">
      <div className={styles.header}>
        <span className={styles.instructorName}>{course?.instructor}</span>
        <span className={styles.statusBadge}>جلسة منتهية</span>
      </div>

      <div className={styles.endContainer}>
        <div className={styles.endCard}>
          <div className={styles.checkCircle}>
            <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
          </div>
          <h3 className={styles.endTitle}>الحمد لله، انتهت المحاضرة</h3>
          <p className={styles.endSubtitle}>
            تم إكمال الوقت الزمني المخصص للحصة المباشرة مع{" "}
            {course?.instructor || "المعلم"}.
          </p>

          <div className={styles.endActionsRow}>
            <button
              className={`${styles.endBtn} ${styles.endBtnPrimary}`}
              onClick={onRate}
            >
              قيّم المحاضرة الآن
            </button>
            <button
              className={`${styles.endBtn} ${styles.endBtnSecondary}`}
              onClick={onHome}
            >
              العودة إلى الرئيسية
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


export function RatingModal({ course, onClose }) {
  const [rating, setRating] = useState(5); 
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(onClose, 1800);
  };

  return (
    <div className={styles.modalOverlay} dir="rtl">
      <div className={styles.centeredModalContent}>
        <button className={styles.closeBtn} onClick={onClose} title="إغلاق">
          ✕
        </button>

        {submitted ? (
          <div className={styles.successBox}>
            <div className={styles.successEmoji}>🎉</div>
            <h3 className={styles.successTitle}>شكراً لتقييمك الغالي!</h3>
            <p className={styles.successMsg}>
              رأيك يساعدنا ويساعد {course?.instructor || "المعلم"} على تقديم
              تجربة تعليمية أفضل دائماً.
            </p>
          </div>
        ) : (
          <>
            <div className={styles.modalHeaderBlock}>
              <h3 className={styles.ratingTitle}>تقييم المحاضرة المباشرة</h3>
              <p className={styles.ratingDesc}>
                يسعدنا معرفة رأيك في الحصة مع{" "}
                <strong>{course?.instructor}</strong> لتطوير وتحسين الأداء
                المستمر.
              </p>
            </div>

            <div className={styles.starsContainer}>
              <div className={styles.starsRow}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    className={`${styles.star} ${s <= rating ? styles.starFilled : ""}`}
                    onClick={() => setRating(s)}
                    type="button"
                  >
                    ★
                  </button>
                ))}
              </div>
              <span className={styles.ratingLabel}>
                {rating === 5 && "ممتاز جداً وننصح به"}
                {rating === 4 && "جيد جداً"}
                {rating === 3 && "مقبول"}
                {rating === 2 && "ضعيف"}
                {rating === 1 && "سيء جداً"}
              </span>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.ratingQuestion}>
                هل لديك أي ملاحظات إضافية تود مشاركتها؟
              </label>
              <textarea
                className={styles.ratingTextarea}
                placeholder="اكتب انطباعك عن الشرح، وضوح الصوت، أو المنهج هنا..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
              />
            </div>

            <div className={styles.ratingActions}>
              <button className={styles.submitBtn} onClick={handleSubmit}>
                إرسال التقييم
              </button>
              <button className={styles.cancelBtn} onClick={onClose}>
                إلغاء
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
