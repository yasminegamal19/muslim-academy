import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Phone,
  ArrowRight,
  ChevronDown,
  Camera,
} from "lucide-react";
import styles from "./PersonalData.module.css";

export default function PersonalData() {
  const navigate = useNavigate();
  const fileRef = useRef();

  const [avatar, setAvatar] = useState(null);
  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    city: "",
    country: "",
    phone: "",
    email: "jd51542@gmail.com",
    password: "",
  });

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) setAvatar(URL.createObjectURL(file));
  };

  return (
    <div className={styles.container} dir="rtl">
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <ArrowRight size={22} />
        </button>
        <h1 className={styles.headerTitle}>البيانات الشخصية</h1>
      </div>

      <div className={styles.avatarSection}>
        <div className={styles.avatarWrapper}>
          {avatar ? (
            <img src={avatar} alt="avatar" className={styles.avatarImg} />
          ) : (
            <div className={styles.avatarPlaceholder}>
              <User size={38} />
            </div>
          )}
          <button
            className={styles.cameraBtn}
            onClick={() => fileRef.current.click()}
          >
            <Camera size={13} />
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleAvatarChange}
          />
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.grid}>
          <div className={styles.field}>
            <label className={styles.label}>الاسم</label>
            <input
              className={styles.input}
              type="text"
              placeholder="اكتب اسمك الكامل"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>العمر</label>
            <input
              className={styles.input}
              type="number"
              placeholder="عمرك"
              value={form.age}
              onChange={(e) => set("age", e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>الجنس</label>
            <div className={styles.selectWrapper}>
              <select
                className={styles.select}
                value={form.gender}
                onChange={(e) => set("gender", e.target.value)}
              >
                <option value="" disabled>
                  اختر
                </option>
                <option value="male">ذكر</option>
                <option value="female">أنثى</option>
              </select>
              <ChevronDown size={15} className={styles.selectIcon} />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>المدينة</label>
            <input
              className={styles.input}
              type="text"
              placeholder="مدينتك"
              value={form.city}
              onChange={(e) => set("city", e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>الدولة</label>
            <input
              className={styles.input}
              type="text"
              placeholder="دولتك"
              value={form.country}
              onChange={(e) => set("country", e.target.value)}
            />
          </div>

          <div className={`${styles.field} ${styles.fullWidth}`}>
            <label className={styles.label}>رقم الهاتف</label>
            <div className={styles.inputWrapper}>
              <Phone size={16} className={styles.inputIcon} />
              <input
                className={`${styles.input} ${styles.inputWithIcon}`}
                type="tel"
                placeholder="+20 01xxxxxxxxx"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
              />
            </div>
          </div>

          <div className={`${styles.field} ${styles.fullWidth}`}>
            <label className={styles.label}>البريد الإلكتروني</label>
            <div className={styles.inputWrapper}>
              <Mail size={16} className={styles.inputIcon} />
              <input
                className={`${styles.input} ${styles.inputWithIcon}`}
                type="email"
                placeholder="email@example.com"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
              />
            </div>
          </div>

          <div className={`${styles.field} ${styles.fullWidth}`}>
            <label className={styles.label}>كلمة المرور</label>
            <div className={styles.inputWrapper}>
              <Lock size={16} className={styles.inputIcon} />
              <input
                className={`${styles.input} ${styles.inputWithIcon}`}
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => set("password", e.target.value)}
              />
            </div>
          </div>
        </div>

        <button className={styles.saveBtn}>حفظ</button>
      </div>
    </div>
  );
}
