import React, { useState } from "react";
import styles from "./UserProfile.module.css";

export default function UserProfile() {
  const [profileTab, setProfileTab] = useState("menu"); 
  const [formData, setFormData] = useState({
    name: "user ",
    age: "28",
    gender: "ذكر",
    city: "القاهرة",
    country: "مصر",
    phone: "+20 0112525006",
    email: "ud51542@gmail.com",
  });

  return (
    <div className={styles.profileWrapper}>
      {profileTab === "menu" && (
        <div className={styles.containerBox}>
          <div className={styles.userHeroCard}>
            <div className={styles.avatarZone}>
              <img
                src="https://via.placeholder.com/150"
                alt="Avatar"
                className={styles.userImg}
              />
            </div>
            <div className={styles.userMeta}>
              <h2>{formData.name}</h2>
              <p>{formData.phone}</p>
            </div>
          </div>

          <div className={styles.profileMenuGrid}>
            <div
              className={styles.menuBox}
              onClick={() => setProfileTab("info")}
            >
              <span className={styles.boxIcon}>👤</span>
              <div className={styles.boxTxt}>
                <h3>البيانات الشخصية</h3>
                <p>تعديل الاسم، العمر، والموقع</p>
              </div>
            </div>
            <div className={styles.menuBox}>
              <span className={styles.boxIcon}>💼</span>
              <div className={styles.boxTxt}>
                <h3>محفظتي</h3>
                <p>إدارة المدفوعات والاشتراكات</p>
              </div>
            </div>
            <div
              className={styles.menuBox}
              onClick={() => setProfileTab("settings")}
            >
              <span className={styles.boxIcon}>⚙️</span>
              <div className={styles.boxTxt}>
                <h3>إعدادات التطبيق</h3>
                <p>الاشعارات، الخصوصية، والشروط</p>
              </div>
            </div>
            <div className={styles.menuBox}>
              <span className={styles.boxIcon}>❓</span>
              <div className={styles.boxTxt}>
                <h3>أسئلة وأجوبة</h3>
                <p>الدعم الفني والأسئلة الشائعة</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {profileTab === "info" && (
        <div className={styles.containerBoxMaxWidth}>
          <div className={styles.viewHeader}>
            <button
              className={styles.backBtn}
              onClick={() => setProfileTab("menu")}
            >
              &rarr;
            </button>
            <h2>البيانات الشخصية</h2>
          </div>

          <div className={styles.avatarEditWrapper}>
            <img
              src="https://via.placeholder.com/150"
              alt="Profile"
              className={styles.editableAvatar}
            />
            <div className={styles.cameraBadge}>📸</div>
          </div>

          <form
            className={styles.webFormGrid}
            onSubmit={(e) => e.preventDefault()}
          >
            <div className={styles.formGroup}>
              <label>الاسم</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className={styles.formGroup}>
              <label>العمر</label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) =>
                  setFormData({ ...formData, age: e.target.value })
                }
              />
            </div>
            <div className={styles.formGroup}>
              <label>الجنس</label>
              <select
                value={formData.gender}
                onChange={(e) =>
                  setFormData({ ...formData, gender: e.target.value })
                }
              >
                <option>ذكر</option>
                <option>أنثى</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>المدينة</label>
              <input type="text" value={formData.city} />
            </div>
            <div className={styles.formGroup}>
              <label>رقم الهاتف</label>
              <input type="text" value={formData.phone} />
            </div>
            <div className={styles.formGroup}>
              <label>البريد الإلكتروني</label>
              <input type="email" value={formData.email} />
            </div>
            <div className={`${styles.formGroup} ${styles.fullWidthRow}`}>
              <button className={styles.saveChangesBtn}>حفظ التغييرات</button>
            </div>
          </form>
        </div>
      )}

      {profileTab === "settings" && (
        <div className={styles.containerBoxMaxWidth}>
          <div className={styles.viewHeader}>
            <button
              className={styles.backBtn}
              onClick={() => setProfileTab("menu")}
            >
              &rarr;
            </button>
            <h2>إعدادات التطبيق</h2>
          </div>
          <div className={styles.settingsRows}>
            <div className={styles.settingToggleRow}>
              <div>
                <h3>اشعارات التطبيق</h3>
                <p>تفعيل أو إغلاق التنبيهات والأذان</p>
              </div>
              <label className={styles.switch}>
                <input type="checkbox" defaultChecked />
                <span className={styles.slider}></span>
              </label>
            </div>
            <div className={styles.settingLinkRow}>
              <span>🛡️ سياسات الخصوصية</span>
              <span className={styles.arrowLeft}>&larr;</span>
            </div>
            <div className={styles.settingLinkRow}>
              <span>📜 الشروط والأحكام</span>
              <span className={styles.arrowLeft}>&larr;</span>
            </div>
            <div className={styles.settingLinkRow}>
              <span>🔗 شارك التطبيق</span>
              <span className={styles.arrowLeft}>&larr;</span>
            </div>
            <div className={styles.deleteAccountRow}>
              <span>🗑️ حذف الحساب نهائياً</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
