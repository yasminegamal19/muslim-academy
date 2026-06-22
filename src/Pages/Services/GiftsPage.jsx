import { useNavigate } from "react-router-dom";
import styles from "../../components/ServisesSection/ServicesSection.module.css";
import {
  ArrowRight,
  Gift,
  User,
  Mail,
  Phone,
  Calendar,
  ArrowLeft,
} from "lucide-react";

export default function Gifts() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <div className={styles.headerTitleSide}>
          <button
            onClick={() => navigate("/services")}
            className={styles.backBtn}
          >
            <ArrowRight size={22} />
          </button>
          <h2 className={styles.title}>إهداء قسيمة تعليمية</h2>
        </div>
      </div>

      <div className={styles.giftsLayout}>
        <div className={styles.giftsInfoSide}>
          <div className={styles.giftIntroCard}>
            <h3>تهادوا تحابوا </h3>
            <p>
              هل تريد أن تستمر في كسب الأعمال الصالحة إلى الأبد وتترك أثراً
              طيباً؟
            </p>
            <p>
              تقدم لكم الأكاديمية الإسلامية الآن قسيمة هدية مميزة لحضور دوراتنا،
              يمكنكم شراؤها لأفراد عائلتكم، أصدقائكم، أو أي شخص ترغبون في
              مساعدته على تعلم العلوم الشرعية.
            </p>
            <p className={styles.actionHint}>
              ما عليك سوى ملء النموذج، وسنقوم بإرسال كارت الإهداء نيابة عنك!
            </p>
          </div>

          <div className={styles.giftCardVisual}>
            <div className={styles.giftCardHeader}>
              <Gift size={32} className={styles.giftIconAnime} />
              <span>قسيمة تعليمية مهداة</span>
            </div>
            <div className={styles.giftCardBody}>
              <h4>Muslim Academy</h4>
              <p>رحلة إيمانية ومعرفية تفوق التوقعات</p>
            </div>
            <div className={styles.giftCardFooter}>
              <span>رقم القسيمة: #GIFT2026</span>
            </div>
          </div>
        </div>

        <div className={styles.giftsFormSide}>
          <form
            className={styles.modernGiftForm}
            onSubmit={(e) => e.preventDefault()}
          >
            <h4 className={styles.formSectionTitle}>
              بيانات المستفيد (الطالب)
            </h4>

            <div className={styles.inputGroup}>
              <label>اسم الطالب الثنائي/الثلاثي</label>
              <div className={styles.inputWithIconWrapper}>
                <input type="text" placeholder="أدخل اسم الشخص المُهدى إليه" />
                <User size={18} className={styles.fieldIcon} />
              </div>
            </div>

            <div className={styles.formRowFields}>
              <div className={styles.inputGroup}>
                <label>عمر الطالب</label>
                <div className={styles.inputWithIconWrapper}>
                  <input type="number" placeholder="مثال: 22" />
                  <Calendar size={18} className={styles.fieldIcon} />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label>جنس الطالب</label>
                <select defaultValue="">
                  <option value="" disabled>
                    اختر الجنس
                  </option>
                  <option value="male">ذكر</option>
                  <option value="female">أنثى</option>
                </select>
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>البريد الإلكتروني للمستفيد</label>
              <div className={styles.inputWithIconWrapper}>
                <input
                  type="email"
                  placeholder="student@example.com"
                  style={{ direction: "ltr", textAlign: "right" }}
                />
                <Mail size={18} className={styles.fieldIcon} />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>رقم هاتف المستفيد (الواتساب)</label>
              <div className={styles.phoneFieldWrapper}>
                <input type="tel" placeholder="01xxxxxxxxx" />
                <span className={styles.countryCode}>+20 🇪🇬</span>
              </div>
            </div>

            <button type="submit" className={styles.giftSubmitBtn}>
              <span>تأكيد وشراء الهدية</span>
              <ArrowLeft size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
