import styles from "./PendingApproval.module.css";
import { Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TeacherPendingApproval() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.iconBox}>
          <Clock size={48} />
        </div>

        <h2 className={styles.title}>تم التسجيل بنجاح!</h2>

        <p className={styles.desc}>
          تم التحقق من بريدك الإلكتروني بنجاح.
          <br />
          حسابك قيد المراجعة من قِبَل الإدارة، وسيتم تفعيله بعد الموافقة عليه.
          <br />
          ستصلك رسالة على بريدك الإلكتروني عند تفعيل الحساب.
        </p>

        <button
          className={styles.button}
          onClick={() => navigate("/teacher/login")}
        >
          الذهاب لتسجيل الدخول
        </button>
      </div>
    </div>
  );
}
