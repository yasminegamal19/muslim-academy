import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Shield, FileText, Share2, Star, Trash2, ChevronLeft, ArrowRight } from "lucide-react";
import styles from "./AppSettings.module.css";

export default function AppSettings() {
  const navigate = useNavigate();
  const [notif, setNotif] = useState(true);

  const rows = [
    { icon: <Bell size={18} />, label: "إشعارات التطبيق", isToggle: true },
    { icon: <Shield size={18} />, label: "سياسات الخصوصية", path: "/privacy" },
    { icon: <FileText size={18} />, label: "الشروط والأحكام", path: "/terms" },
    { icon: <Share2 size={18} />, label: "شارك التطبيق", path: "/share" },
    { icon: <Star size={18} />, label: "قيّم التطبيق", path: "/rate" },
  ];

  return (
    <div className={styles.container} dir="rtl">
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <ArrowRight size={22} />
        </button>
        <h1 className={styles.headerTitle}>إعدادات التطبيق</h1>
      </div>

      <div className={styles.card}>
        {rows.map((row, i) => (
          <div
            key={i}
            className={`${styles.row} ${i < rows.length - 1 ? styles.rowBorder : ""}`}
            onClick={() => row.path && navigate(row.path)}
            style={{ cursor: row.path ? "pointer" : "default" }}
          >
            <div className={styles.rowLeft}>
              <span className={styles.iconBox}>{row.icon}</span>
              <span className={styles.rowLabel}>{row.label}</span>
            </div>

            {row.isToggle ? (
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  checked={notif}
                  onChange={() => setNotif((p) => !p)}
                />
                <span className={styles.slider} />
              </label>
            ) : (
              <ChevronLeft size={18} className={styles.chevron} />
            )}
          </div>
        ))}
      </div>

      <div className={styles.deleteCard}>
        <span className={styles.deleteIcon}>
          <Trash2 size={18} />
        </span>
        <span className={styles.deleteLabel}>حذف الحساب</span>
      </div>
    </div>
  );
}