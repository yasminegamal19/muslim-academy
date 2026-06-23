import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../../store/slices/authSlice";
import { Clock, XCircle, CheckCircle } from "lucide-react";
import styles from "./TeacherPendingApproval.module.css";

export default function TeacherPendingApproval() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const status = location.state?.status || "pending";
  const isRejected = status === "rejected";

  const handleLogout = () => {
    dispatch(logout());
    navigate("/teacher/login");
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div
          className={`${styles.iconBox} ${
            isRejected ? styles.iconRejected : styles.iconPending
          }`}
        >
          {isRejected ? <XCircle size={48} /> : <Clock size={48} />}
        </div>

        <h1 className={styles.title}>
          {isRejected ? "تم رفض طلبك" : "حسابك قيد المراجعة"}
        </h1>

        <p className={styles.desc}>
          {isRejected
            ? "نأسف لإبلاغك بأن طلب انضمامك كمعلم قد تم رفضه. يمكنك التواصل مع فريق الدعم لمعرفة التفاصيل."
            : "تم إنشاء حسابك بنجاح! حسابك الآن قيد المراجعة من قِبل فريق الإدارة. ستتلقى إشعاراً بالبريد الإلكتروني عند تفعيل حسابك."}
        </p>

        {!isRejected && (
          <div className={styles.steps}>
            <div className={styles.step}>
              <div className={`${styles.stepIcon} ${styles.stepDone}`}>
                <CheckCircle size={18} />
              </div>
              <span>تسجيل الحساب</span>
            </div>
            <div className={styles.stepLine} />
            <div className={styles.step}>
              <div className={`${styles.stepIcon} ${styles.stepDone}`}>
                <CheckCircle size={18} />
              </div>
              <span>التحقق من البريد</span>
            </div>
            <div className={styles.stepLine} />
            <div className={styles.step}>
              <div className={`${styles.stepIcon} ${styles.stepWaiting}`}>
                <Clock size={18} />
              </div>
              <span>موافقة الإدارة</span>
            </div>
          </div>
        )}

        <div className={styles.actions}>
          {isRejected && (
            <a
              href="mailto:support@muslim-academy.com"
              className={`${styles.btn} ${styles.btnContact}`}
            >
              تواصل مع الدعم
            </a>
          )}
          <button
            className={`${styles.btn} ${styles.btnBack}`}
            onClick={handleLogout}
          >
            العودة لتسجيل الدخول
          </button>
        </div>

        <div className={styles.logoWrap}>
          <img
            src="/logo muslim.png"
            alt="Muslim Academy"
            className={styles.logo}
          />
        </div>
      </div>
    </div>
  );
}
