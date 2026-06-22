import { useState } from "react";
import styles from "./ContactSection.module.css";

const CONTACTS = [
  {
    id: 1,
    name: "اسم المدرس",
    role: "أصول دين",
    status: "offline",
    avatar: "https://via.placeholder.com/150",
  },
  {
    id: 2,
    name: "اسم المسؤول",
    role: "المسمى الوظيفي",
    status: "online",
    avatar: "https://via.placeholder.com/150",
  },
  {
    id: 3,
    name: "الشيخ أحمد محمد",
    role: "تجويد وقراءات",
    status: "online",
    avatar: "https://via.placeholder.com/150",
  },
];

export default function ContactSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeContact, setActiveContact] = useState(CONTACTS[0]);
  const [showWarning, setShowWarning] = useState(true);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "السلام عليكم يا أحمد، إن شاء الله تكون بخير.",
      sender: "me",
      time: "11:30 ص",
    },
    {
      id: 2,
      text: "وعليكم السلام ورحمة الله وبركاته يا شيخنا، الحمد لله تمام.",
      sender: "them",
      time: "11:32 ص",
    },
    {
      id: 3,
      text: "حايب أكد معاك ميعاد السيشن الجاية، موعدنا بإذن الله يوم الثلاثاء الساعة 6 مساءً، مناسب ليك؟",
      sender: "me",
      time: "11:35 ص",
    },
    {
      id: 4,
      text: "أيوة تمام جداً يا شيخ، الموعد مناسب إن شاء الله.",
      sender: "them",
      time: "11:40 ص",
    },
    {
      id: 5,
      text: "إن شاء الله، جزاك الله خيراً يا شيخ.",
      sender: "them",
      time: "11:41 ص",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    setMessages([
      ...messages,
      { id: Date.now(), text: inputMessage, sender: "me", time: "الآن" },
    ]);
    setInputMessage("");
  };

  return (
    <div className={styles.chatPage}>
      <div className={styles.chatContainer}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h2 className={styles.pageTitle}>تواصل</h2>
            <div className={styles.searchWrapper}>
              <input
                type="text"
                placeholder="ابحث باسم المعلم / المشرف / المادة..."
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className={styles.filterBtn} aria-label="تصفية">
                <svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
                </svg>
              </button>
            </div>
          </div>

          <div className={styles.contactList}>
            {CONTACTS.map((contact) => (
              <div
                key={contact.id}
                className={`${styles.contactCard} ${activeContact.id === contact.id ? styles.contactCardActive : ""}`}
                onClick={() => {
                  setActiveContact(contact);
                  setShowWarning(true); 
                }}
              >
                <div className={styles.avatarWrapper}>
                  <img
                    src={contact.avatar}
                    alt={contact.name}
                    className={styles.avatar}
                  />
                  <span
                    className={`${styles.statusDot} ${styles[contact.status]}`}
                  ></span>
                </div>
                <div className={styles.contactInfo}>
                  <h4 className={styles.contactName}>{contact.name}</h4>
                  <p className={styles.contactRole}>{contact.role}</p>
                </div>
                <span className={styles.actionBadge}>تواصل</span>
              </div>
            ))}
          </div>
        </aside>

        <main className={styles.chatArea}>
          <div className={styles.chatHeader}>
            <div className={styles.activeUserMeta}>
              <div className={styles.avatarWrapper}>
                <img
                  src={activeContact.avatar}
                  alt={activeContact.name}
                  className={styles.avatarSmall}
                />
                <span
                  className={`${styles.statusDot} ${styles[activeContact.status]}`}
                ></span>
              </div>
              <div>
                <h3 className={styles.activeUserName}>{activeContact.name}</h3>
                <span className={styles.activeUserStatus}>
                  {activeContact.status === "online" ? "متاح الآن" : "غير متصل"}
                </span>
              </div>
            </div>

            <div className={styles.headerActions}>
              <button className={styles.iconCallBtn} aria-label="اتصال صوتي">
                <svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </button>
              <button className={styles.iconCallBtn} aria-label="اتصال فيديو">
                <svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M23 7l-7 5 7 5V7z" />
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                </svg>
              </button>
            </div>
          </div>

          <div className={styles.messagesContainer}>
            {showWarning && (
              <div className={styles.auditWarning}>
                <div className={styles.warningInfo}>
                  <svg
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className={styles.warningIcon}
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                  <p>
                    نود إعلامكم أن هذه المحادثة تخضع لإشراف إدارة الأكاديمية،
                    لضمان جودة التواصل وحل أي مشكلة قد تطرأ.
                  </p>
                </div>
                <button
                  className={styles.closeWarningBtn}
                  onClick={() => setShowWarning(false)}
                >
                  متابعة
                </button>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`${styles.messageRow} ${msg.sender === "me" ? styles.msgMe : styles.msgThem}`}
              >
                <div className={styles.messageBubble}>
                  <p className={styles.msgText}>{msg.text}</p>
                  <span className={styles.msgTime}>{msg.time}</span>
                </div>
              </div>
            ))}
          </div>

          <form className={styles.inputArea} onSubmit={handleSendMessage}>
            <button
              type="button"
              className={styles.actionMenuBtn}
              aria-label="إرفاق ملف أو صورة"
            >
              <svg
                viewBox="0 0 24 24"
                width="22"
                height="22"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
              </svg>
            </button>
            <button
              type="button"
              className={styles.actionMenuBtn}
              aria-label="التقاط صورة"
            >
              <svg
                viewBox="0 0 24 24"
                width="22"
                height="22"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            </button>

            <input
              type="text"
              placeholder="اكتب هنا..."
              className={styles.chatInput}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
            />

            <button
              type="button"
              className={styles.voiceBtn}
              aria-label="تسجيل صوتي"
            >
              <svg
                viewBox="0 0 24 24"
                width="22"
                height="22"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </svg>
            </button>
            <button type="submit" className={styles.sendBtn} aria-label="إرسال">
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}
