import { memo, useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { ChevronDown, LogOut, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { logout } from "../../../store/slices/authSlice";
import styles from "./TeacherNavbar.module.css";

const navLinks = [
  {
    to: "/teacher/dashboard",
    label: "Dashboard",
  },
  {
    to: "/teacher/sessions",
    label: "Sessions",
  },
];

function TeacherNavbar() {
  const { i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const currentLang = i18n.language?.startsWith("ar") ? "ar" : "en";

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  const handleLogout = () => {
    dispatch(logout());

    localStorage.clear();
    sessionStorage.clear();

    navigate("/");
  };

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);

    localStorage.setItem("lang", lang);

    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";

    document.documentElement.lang = lang;
  };

  return (
    <header className={styles.topbar}>
      <div className={styles.mainRow}>
        <div className={styles.brandSection}>
          <img src="/logo muslim.png" alt="Logo" className={styles.logo} />
        </div>

        <nav className={styles.links}>
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className={styles.right}>
          <div className={styles.profileDropdown} ref={profileRef}>
            <button
              className={styles.profileBtn}
              onClick={() => setProfileOpen((prev) => !prev)}
            >
              <User size={18} />
              <ChevronDown size={14} />
            </button>

            {profileOpen && (
              <div className={styles.profileMenu}>
                <button
                  onClick={() => {
                    setProfileOpen(false);
                  }}
                >
                  <User size={16} />
                  Profile
                </button>

                <button onClick={handleLogout} className={styles.logout}>
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>

          <div className={`dropdown ${styles.langDropdown}`}>
            <button className={styles.langTrigger} data-bs-toggle="dropdown">
              {currentLang === "ar" ? "العربية" : "English"}
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
  );
}

export default memo(TeacherNavbar);
