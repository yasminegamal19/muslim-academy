import { useNavigate } from "react-router-dom";
import styles from "./ServicesPage.module.css";
import { useTranslation } from "react-i18next";

const icons = {
  library: (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect
        x="8"
        y="12"
        width="12"
        height="40"
        rx="2"
        fill="#c8e6c9"
        stroke="#2e7d32"
        strokeWidth="2"
      />
      <rect
        x="22"
        y="18"
        width="12"
        height="34"
        rx="2"
        fill="#a5d6a7"
        stroke="#2e7d32"
        strokeWidth="2"
      />
      <rect
        x="36"
        y="8"
        width="12"
        height="44"
        rx="2"
        fill="#81c784"
        stroke="#2e7d32"
        strokeWidth="2"
      />
      <line
        x1="8"
        y1="52"
        x2="56"
        y2="52"
        stroke="#2e7d32"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle
        cx="49"
        cy="20"
        r="5"
        fill="#fff9c4"
        stroke="#f9a825"
        strokeWidth="2"
      />
      <line
        x1="49"
        y1="14"
        x2="49"
        y2="11"
        stroke="#f9a825"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="54"
        y1="16"
        x2="56"
        y2="14"
        stroke="#f9a825"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),
  askScholar: (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect
        x="6"
        y="10"
        width="36"
        height="28"
        rx="4"
        fill="#e8f5e9"
        stroke="#2e7d32"
        strokeWidth="2"
      />
      <path d="M12 38 L6 46 L18 42 Z" fill="#2e7d32" />
      <rect
        x="22"
        y="26"
        width="36"
        height="26"
        rx="4"
        fill="#f3e5f5"
        stroke="#7b1fa2"
        strokeWidth="2"
      />
      <path d="M52 52 L58 58 L46 56 Z" fill="#7b1fa2" />
      <text
        x="35"
        y="44"
        fontSize="14"
        fontWeight="bold"
        fill="#7b1fa2"
        textAnchor="middle"
      >
        ?
      </text>
    </svg>
  ),
  expenses: (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle
        cx="28"
        cy="36"
        r="20"
        fill="#fff9c4"
        stroke="#f9a825"
        strokeWidth="2"
      />
      <text
        x="28"
        y="42"
        fontSize="18"
        fontWeight="bold"
        fill="#f9a825"
        textAnchor="middle"
      >
        $
      </text>
      <path
        d="M40 12 C50 8 56 16 52 24"
        stroke="#4caf50"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="52" cy="12" r="4" fill="#4caf50" />
    </svg>
  ),
  research: (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect
        x="10"
        y="8"
        width="34"
        height="44"
        rx="3"
        fill="#e3f2fd"
        stroke="#1565c0"
        strokeWidth="2"
      />
      <line
        x1="17"
        y1="20"
        x2="37"
        y2="20"
        stroke="#1565c0"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="17"
        y1="28"
        x2="37"
        y2="28"
        stroke="#1565c0"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="17"
        y1="36"
        x2="28"
        y2="36"
        stroke="#1565c0"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle
        cx="46"
        cy="46"
        r="10"
        fill="#fff"
        stroke="#1565c0"
        strokeWidth="2"
      />
      <line
        x1="53"
        y1="53"
        x2="59"
        y2="59"
        stroke="#1565c0"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="46" cy="46" r="5" fill="#e3f2fd" />
      <path
        d="M42 46 L48 46 M46 42 L46 50"
        stroke="#1565c0"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),
  gifts: (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect
        x="10"
        y="28"
        width="44"
        height="28"
        rx="3"
        fill="#fce4ec"
        stroke="#e91e63"
        strokeWidth="2"
      />
      <rect
        x="8"
        y="20"
        width="48"
        height="12"
        rx="3"
        fill="#f8bbd0"
        stroke="#e91e63"
        strokeWidth="2"
      />
      <line
        x1="32"
        y1="20"
        x2="32"
        y2="56"
        stroke="#e91e63"
        strokeWidth="2.5"
      />
      <path
        d="M32 20 C32 20 22 14 18 18 C14 22 22 24 32 20Z"
        fill="#f06292"
        stroke="#e91e63"
        strokeWidth="1.5"
      />
      <path
        d="M32 20 C32 20 42 14 46 18 C50 22 42 24 32 20Z"
        fill="#f06292"
        stroke="#e91e63"
        strokeWidth="1.5"
      />
      <circle
        cx="46"
        cy="16"
        r="4"
        fill="#ffeb3b"
        stroke="#fbc02d"
        strokeWidth="1.5"
      />
      <circle
        cx="52"
        cy="10"
        r="3"
        fill="#ff8a65"
        stroke="#e64a19"
        strokeWidth="1.5"
      />
      <circle
        cx="56"
        cy="18"
        r="2"
        fill="#ce93d8"
        stroke="#8e24aa"
        strokeWidth="1.5"
      />
    </svg>
  ),
};

const SERVICES = [
  {
    id: "library",
    icon: icons.library,
    labelKey: "services.library",
    path: "/services/library",
    color: "#e8f5e9",
    accent: "#2e7d32",
  },
  {
    id: "ask",
    icon: icons.askScholar,
    labelKey: "services.askScholar",
    path: "/services/ask-scholar",
    color: "#f3e5f5",
    accent: "#7b1fa2",
  },
  {
    id: "expenses",
    icon: icons.expenses,
    labelKey: "services.expenses",
    path: "/services/expenses",
    color: "#fff9c4",
    accent: "#f9a825",
  },
  {
    id: "research",
    icon: icons.research,
    labelKey: "services.research",
    path: "/services/research",
    color: "#e3f2fd",
    accent: "#1565c0",
  },
  {
    id: "gifts",
    icon: icons.gifts,
    labelKey: "services.gifts",
    path: "/services/gifts",
    color: "#fce4ec",
    accent: "#e91e63",
  },
];

export default function ServicesPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>{t("services.title", "الخدمات")}</h1>
          <div className={styles.searchBox}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input type="text" placeholder={t("services.search", "ابحث هنا")} />
          </div>
        </div>

        <div className={styles.grid}>
          {SERVICES.map((service, idx) => (
            <div
              key={service.id}
              className={`${styles.card} ${idx === 1 ? styles.cardActive : ""}`}
              style={{
                "--card-bg": service.color,
                "--card-accent": service.accent,
              }}
              onClick={() => navigate(service.path)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && navigate(service.path)}
            >
              <div className={styles.cardIcon}>{service.icon}</div>
              <p className={styles.cardLabel}>
                {t(service.labelKey, service.id)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
