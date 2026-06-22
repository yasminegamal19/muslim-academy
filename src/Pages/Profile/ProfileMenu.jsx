import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import { useTranslation } from "react-i18next";
import styles from "./ProfileMenu.module.css";
import {
  User,
  Wallet,
  Globe,
  HelpCircle,
  Info,
  Sliders,
  PhoneCall,
  LogOut,
  ChevronLeft,
  ArrowRight,
} from "lucide-react";

export default function ProfileMenu() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
 
  const { user } = useSelector((s) => s.auth);
  const [isArabic, setIsArabic] = useState(i18n.language?.startsWith("ar"));

  const handleLangToggle = () => {  
    const nextLang = isArabic ? "en" : "ar"; 
    i18n.changeLanguage(nextLang);
    localStorage.setItem("lang", nextLang);
    document.documentElement.dir = nextLang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = nextLang;
    setIsArabic(!isArabic);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const menuItems = [
    {
      id: "personal-data",
      icon: <User size={20} />,
      label: "البيانات الشخصية",
      path: "/user-profile",
    },
    {
      id: "wallet",
      icon: <Wallet size={20} />,
      label: "محفظتي",
      path: "/wallet",
    },
    {
      id: "lang",
      icon: <Globe size={20} />,
      label: "اللغه العربيه",
      isToggle: true,
    },
    {
      id: "faq",
      icon: <HelpCircle size={20} />,
      label: "أسئله و أجوبه",
      path: "/faq",
    },
    {
      id: "about",
      icon: <Info size={20} />,
      label: "من نحن",
      path: "/about",
    },
    {   
      id: "how-it-works",
      icon: <Sliders size={20} />,
      label: "كيف نعمل",
      path: "/how-it-works",
    },
    {
      id: "contact",
      icon: <PhoneCall size={20} />,
      label: "تواصل معنا",
      path: "/contact",
    },
    {
      id: "settings",
      icon: <Sliders size={20} />,
      label: "إعدادات التطبيق",
      path: "/settings",
    },
  ];

  return (
    <div className={styles.profileContainer} dir="rtl">
      <div className={styles.profileHeader}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <ArrowRight size={22} />
        </button>
        <h1 className={styles.headerTitle}>الملف الشخصي</h1>
      </div>

      <div className={styles.userCard}>
        <div className={styles.avatarWrapper}>
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user?.name}
              className={styles.avatarImg}
            />
          ) : (
            <div className={styles.avatarPlaceholder}>
              <User size={36} />
            </div>
          )}
        </div>
        <div className={styles.userInfo}>
          <h3 className={styles.userName}>{user?.name || "محمد "}</h3>
          <p className={styles.userPhone}>{user?.phone || "+20 01125252006"}</p>
        </div>
      </div>

      <div className={styles.menuList}>
        {menuItems.map((item) => (
          <div key={item.id} className={styles.menuItemWrapper}>
            {item.isToggle ? (
              <div className={styles.menuItemClickable}>
                <div className={styles.rightSide}>
                  <span className={styles.iconContainer}>{item.icon}</span>
                  <span className={styles.menuLabel}>{item.label}</span>
                </div>
                <label className={styles.switch}>
                  <input
                    type="checkbox"
                    checked={isArabic}
                    onChange={handleLangToggle}
                  />
                  <span className={styles.slider}></span>
                </label>
              </div>
            ) : (
              <button
                className={styles.menuItemClickable}
                onClick={() => navigate(item.path)}
              >
                <div className={styles.rightSide}>
                  <span className={styles.iconContainer}>{item.icon}</span>
                  <span className={styles.menuLabel}>{item.label}</span>
                </div>
                <ChevronLeft size={18} className={styles.chevronIcon} />
              </button>
            )}
          </div>
        ))}

        <div className={styles.menuItemWrapper}>
          <button
            className={`${styles.menuItemClickable} ${styles.logoutBtn}`}
            onClick={handleLogout}
          >
            <div className={styles.rightSide}>
              <span className={styles.iconContainer}>
                <LogOut size={20} />
              </span>
              <span className={styles.menuLabel}>تسجيل الخروج</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
