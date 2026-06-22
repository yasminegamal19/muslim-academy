import styles from "./StatBadge.module.css";

export default function StatBadge({ icon, label, value, color = "green" }) {
  return (
    <div className={`${styles.badge} ${styles[color]}`}>
      <span className={styles.icon}>{icon}</span>
      <div className={styles.text}>
        <span className={styles.value}>{value}</span>
        <span className={styles.label}>{label}</span>
      </div>
    </div>
  );
}
