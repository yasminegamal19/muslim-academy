import { memo, useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";
import {
  Bell,
  User,
  LogOut,
  ChevronDown,
  Calendar,
  CreditCard,
  BellRing,
  XCircle,
  Trash2,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import { api } from "../../store/slices/authSlice";

const navLinks = [
  { to: "/", labelKey: "topbar.dashboard" },
  { to: "/courses", labelKey: "topbar.courses" },
  { to: "/my-subscriptions", labelKey: "topbar.subscriptions" },
  { to: "/services", labelKey: "topbar.services" },
  { to: "/contact", labelKey: "topbar.contact" },
  { to: "/islamic", labelKey: "topbar.islamic" },
];

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();

  const { isAuthenticated, user } = useSelector((s) => s.auth);

  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [userName, setUserName] = useState(user?.name || null);
  const [notifications, setNotifications] = useState([]);
  const [notifLoading, setNotifLoading] = useState(false);

  const currentLang = i18n.language?.startsWith("ar") ? "ar" : "en";
  const profileRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target))
        setProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target))
        setNotifOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchProfile = async () => {
      try {
        if (user?.name) {
          setUserName(user.name);
          return;
        }
        const res = await api.get("/profile");
        if (res.status === 200 || res.data.code === 200) {
          setUserName(res.data.data.name);
        }
      } catch (err) {
        console.error("Profile fetch error (Navbar):", err);
      }
    };
    fetchProfile();
  }, [isAuthenticated, user]);

  const handleLogout = () => {
    dispatch(logout());
    setProfileOpen(false);
    navigate("/login");
  };

  const fetchNotifications = async () => {
    if (!isAuthenticated) return;
    setNotifLoading(true);
    try {
      const res = await api.get("/notifications");
      if (res.data.code === 200) {
        setNotifications(res.data.data || []);
      }
    } catch (err) {
      console.error("Notifications fetch error:", err);
      setNotifications([
        {
          id: 1,
          title: "الجلسة بدأت الآن",
          body: "جلسة مباشرة اقترب موعدها يمكنك الدخول الآن",
          type: "session_start",
          group: "اليوم",
          read_at: null,
        },
        {
          id: 2,
          title: "مطلوب إتمام الدفع",
          body: "يرجى إتمام عملية الدفع لتأكيد طلب الكشف ومتابعة الخدمة.",
          type: "payment_required",
          group: "اليوم",
          read_at: null,
        },
        {
          id: 3,
          title: "تذكير موعد الصلاة",
          body: "حان الآن موعد صلاة المغرب، تقبل الله طاعتكم.",
          type: "prayer_reminder",
          group: "اليوم",
          read_at: "2026-06-07",
        },
        {
          id: 4,
          title: "فشل الدفع",
          body: "لم نتمكن من إتمام عملية الدفع.",
          type: "payment_failed",
          group: "أمس",
          read_at: null,
        },
        {
          id: 5,
          title: "الجلسة انتهت",
          body: "جلسة مباشرة اقترب موعدها يمكنك الدخول الآن",
          type: "session_end",
          group: "20 نوفمبر 2025",
          read_at: "2025-11-20",
        },
      ]);
    } finally {
      setNotifLoading(false);
    }
  };

  const handleNotifToggle = () => {
    if (!isAuthenticated) return navigate("/login");
    if (!notifOpen) fetchNotifications();
    setNotifOpen((prev) => !prev);
    setProfileOpen(false);
  };

  const handleProfileToggle = () => {
    if (!isAuthenticated) return navigate("/login");
    setProfileOpen((prev) => !prev);
    setNotifOpen(false);
  };

  const handleDeleteNotif = (id, e) => {
    e.stopPropagation(); 
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const unreadCount = notifications.filter((n) => !n.read_at).length;

  const handleLanguageChange = (nextLang) => {
    i18n.changeLanguage(nextLang);
    localStorage.setItem("lang", nextLang);
    document.documentElement.dir = nextLang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = nextLang;
  };

  const getNotifIcon = (type) => {
    switch (type) {
      case "session_start":
      case "session_end":
        return <Calendar className={styles.notifIconSvg} size={18} />;
      case "payment_required":
        return (
          <CreditCard
            className={styles.notifIconSvg}
            size={18}
            style={{ color: "#ffffff" }}
          />
        );
      case "payment_failed":
        return <XCircle className={styles.notifIconSvg} size={18} />;
      default:
        return <BellRing className={styles.notifIconSvg} size={18} />;
    }
  };

  const groupedNotifications = notifications.reduce((groups, notif) => {
    const group = notif.group || "أخرى";
    if (!groups[group]) groups[group] = [];
    groups[group].push(notif);
    return groups;
  }, {});

  return (
    <>
      <header className={styles.topbar}>
        <div className={styles.mainRow}>
          <button
            className={styles.menuBtn}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="menu"
          >
            ☰
          </button>

          <div className={styles.brandSection}>
            <img src="/logo muslim.png" alt="Logo" className={styles.logo} />
          </div>

          <nav className={styles.links}>
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  isActive
                    ? `${styles.navLink} ${styles.active}`
                    : styles.navLink
                }
              >
                {t(link.labelKey)}
              </NavLink>
            ))}
          </nav>

          <div className={styles.right}>
            <div className={styles.notifWrapper} ref={notifRef}>
              <button
                className={styles.iconBtn}
                onClick={handleNotifToggle}
                aria-label="Notifications"
              >
                <Bell size={18} />
                {isAuthenticated && unreadCount > 0 && (
                  <span className={styles.notifBadge}>
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className={styles.notifDropdown}>
                  <div className={styles.notifHeader}>
                    <h3>{t("topbar.notifications") || "الإشعارات"}</h3>
                  </div>

                  <div className={styles.notifBodyContainer}>
                    {notifLoading ? (
                      <div className={styles.notifFeedback}>
                        <div className={styles.spinner}></div>
                        <p>جاري تحميل الإشعارات...</p>
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className={styles.notifEmptyState}>
                        <div className={styles.emptyBellIcon}>
                          <Bell size={48} strokeWidth={1.2} />
                        </div>
                        <h4>لا توجد إشعارات حتى الآن</h4>
                        <p>سيتم إعلامك عندما يكون هناك شيء جديد.</p>
                      </div>
                    ) : (
                      <div className={styles.notifScrollArea}>
                        {Object.keys(groupedNotifications).map((groupName) => (
                          <div key={groupName} className={styles.notifGroup}>
                            <h4 className={styles.groupTimelineTitle}>
                              {groupName}
                            </h4>
                            {groupedNotifications[groupName].map((n) => (
                              <div
                                key={n.id}
                                className={`${styles.notifCard} ${!n.read_at ? styles.unreadCard : ""} ${n.type === "payment_required" ? styles.paymentRequiredBg : ""}`}
                              >
                                <button
                                  className={styles.deleteNotifBtn}
                                  onClick={(e) => handleDeleteNotif(n.id, e)}
                                  aria-label="Delete Notification"
                                >
                                  <Trash2 size={16} />
                                </button>

                                <div className={styles.notifContentWrapper}>
                                  <div className={styles.notifTextSide}>
                                    <h5>{n.title}</h5>
                                    <p>{n.body}</p>
                                  </div>

                                  <div
                                    className={`${styles.notifIconContainer} ${styles[n.type]}`}
                                  >
                                    {getNotifIcon(n.type)}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className={styles.profileDropdown} ref={profileRef}>
              <button
                className={`${styles.profileBtn} ${isAuthenticated ? styles.profileBtnAuth : ""}`}
                onClick={handleProfileToggle}
              >
                {isAuthenticated && userName ? (
                  <>
                    <span className={styles.welcomeText}>
                      {t("common.welcome") || "Welcome"}{" "}
                      <strong>{userName.split(" ")[0]}</strong>
                    </span>
                    <ChevronDown
                      size={14}
                      className={profileOpen ? styles.chevronOpen : ""}
                    />
                  </>
                ) : (
                  <User size={18} />
                )}
              </button>

              {profileOpen && isAuthenticated && (
                <div className={styles.profileMenu}>
                  <button
                    onClick={() => {
                      navigate("/profile-menu");
                      setProfileOpen(false);
                    }}
                  >
                    <User size={16} /> {t("common.profile")}
                  </button>
                  <button onClick={handleLogout} className={styles.logout}>
                    <LogOut size={16} /> {t("common.logout")}
                  </button>
                </div>
              )}
            </div>

            <div className={`dropdown ${styles.langDropdown}`}>
              <button className={styles.langTrigger} data-bs-toggle="dropdown">
                <span>{currentLang === "ar" ? "العربية" : "English"}</span>
                <ChevronDown size={14} />
              </button>
              <ul
                className={`dropdown-menu dropdown-menu-end ${styles.langMenu}`}
              >
                <li>
                  <button
                    className={styles.langItem}
                    onClick={() => handleLanguageChange("ar")}
                  >
                    العربية
                  </button>
                </li>
                <li>
                  <button
                    className={styles.langItem}
                    onClick={() => handleLanguageChange("en")}
                  >
                    English
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export default memo(Navbar);
