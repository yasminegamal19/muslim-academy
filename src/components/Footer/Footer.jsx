
import { useState, useEffect } from "react";
import styles from "./Footer.module.css";
import { Link } from "react-router-dom";

import {
  FaLinkedin,
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaPhoneAlt,
  FaWhatsapp,
  FaTiktok,
  FaMapMarkerAlt,
} from "react-icons/fa";

import { FaXTwitter } from "react-icons/fa6";
import { IoMdMail } from "react-icons/io";

import { api } from "../../store/slices/authSlice";

export default function Footer() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get("/settings");

        if (
          res.data.code === 200 &&
          res.data.data &&
          res.data.data.length > 0
        ) {
          setSettings(res.data.data[0]);
        }
      } catch (err) {
        console.error("Error fetching settings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return (
    <footer className={styles.footer} dir="rtl">
      <div className="container">
        <div className={styles.topSection}>
          <div className={styles.brandCol}>
            {loading ? (
              <div className={styles.skeletonLogo} />
            ) : (
              <img
                src={settings?.logo || "/logo.png"}
                alt={settings?.name || "Website Logo"}
                className={styles.logo}
              />
            )}

            <p className={styles.description}>{settings?.desc}</p>

           
            <div className={styles.socials}>
              {settings?.facebook && (
                <a
                  href={settings.facebook}
                  target="_blank"
                  rel="noreferrer"
                  title="Facebook"
                >
                  <FaFacebook size={20} />
                </a>
              )}

              {settings?.instagram && (
                <a
                  href={settings.instagram}
                  target="_blank"
                  rel="noreferrer"
                  title="Instagram"
                >
                  <FaInstagram size={20} />
                </a>
              )}

              {settings?.youtube && (
                <a
                  href={settings.youtube}
                  target="_blank"
                  rel="noreferrer"
                  title="Youtube"
                >
                  <FaYoutube size={20} />
                </a>
              )}

              {settings?.xUrl && (
                <a
                  href={settings.xUrl}
                  target="_blank"
                  rel="noreferrer"
                  title="X"
                >
                  <FaXTwitter size={20} />
                </a>
              )}

              {settings?.linkedin && (
                <a
                  href={settings.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  title="LinkedIn"
                >
                  <FaLinkedin size={20} />
                </a>
              )}

              {settings?.tiktok && (
                <a
                  href={settings.tiktok}
                  target="_blank"
                  rel="noreferrer"
                  title="TikTok"
                >
                  <FaTiktok size={20} />
                </a>
              )}

              {settings?.whatsapp && (
                <a
                  href={`https://wa.me/${settings.whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  title="WhatsApp"
                >
                  <FaWhatsapp size={20} />
                </a>
              )}
            </div>
          </div>

          <div className={styles.linkCol}>
            <h4 className={styles.colTitle}>روابط سريعة</h4>

            <ul className={styles.linkList}>
              <li>
                <Link to="/">الرئيسية</Link>
              </li>

              <li>
                <Link to="/products">المنتجات</Link>
              </li>

              <li>
                <Link to="/contact">تواصل معنا</Link>
              </li>
            </ul>
          </div>

          <div className={styles.contactCol}>
            <h4 className={styles.colTitle}>تواصل معنا</h4>

            <div className={styles.contactInfo}>
              {settings?.phone && (
                <div className={styles.infoItem}>
                  <FaPhoneAlt size={15} />

                  <span className={styles.infoText} dir="ltr">
                    {settings.phone}
                  </span>
                </div>
              )}

              {settings?.email && (
                <div className={styles.infoItem}>
                  <IoMdMail size={16} />

                  <span className={styles.infoText}>{settings.email}</span>
                </div>
              )}

              {settings?.address && (
                <div className={styles.infoItem}>
                  <FaMapMarkerAlt size={15} />

                  <span className={styles.infoText}>{settings.address}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={styles.bottomSection}>
          <p className={styles.copyRight}>
            {settings?.copyright ||
              `© ${new Date().getFullYear()} ${settings?.name || ""}`}
          </p>
        </div>
      </div>
    </footer>
  );
}
