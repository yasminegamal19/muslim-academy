import { useNavigate } from "react-router-dom";
import styles from "./ServicesSection.module.css";
import { Search } from "lucide-react";

const servicesList = [
  { id: "library", title: "مكتبة", icon: "📚", route: "/services/library" },
  {
    id: "ask",
    title: "اسأل العلماء",
    icon: "❓",
    route: "/services/ask-scholars",
    active: true,
  },
  { id: "fees", title: "مصاريف", icon: "💰", route: "/services/fees" },
  {
    id: "research",
    title: "مراجعات الباحثين",
    icon: "🔍",
    route: "/services/research",
  },
  { id: "gifts", title: "هدايا", icon: "🎁", route: "/services/gifts" },
];

export default function Services() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>الخدمات</h2>
      </div>

      <div className={styles.searchWrapper}>
        <input
          type="text"
          placeholder="بحث هنا"
          className={styles.searchInput}
        />
        <Search className={styles.searchIcon} size={18} />
      </div>

      <div className={styles.grid}>
        {servicesList.map((service) => (
          <div
            key={service.id}
            className={`${styles.card} ${service.active ? styles.activeCard : ""}`}
            onClick={() => navigate(service.route)}
          >
            <div className={styles.iconContainer}>{service.icon}</div>
            <h3>{service.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
