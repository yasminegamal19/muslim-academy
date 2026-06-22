import { useEffect, useState } from "react";
import styles from "./Toast.module.css";
import { CheckCircle, XCircle, X } from "lucide-react";

export default function Toast({
  message,
  type = "success",
  duration = 3500,
  onClose,
}) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300); 
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className={`${styles.toast} ${styles[type]} ${!visible ? styles.hide : ""}`}
    >
      <div className={styles.icon}>
        {type === "success" ? <CheckCircle size={20} /> : <XCircle size={20} />}
      </div>
      <p className={styles.message}>{message}</p>
      <button
        className={styles.close}
        onClick={() => {
          setVisible(false);
          setTimeout(onClose, 300);
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
}
