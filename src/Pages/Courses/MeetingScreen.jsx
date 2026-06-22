import { useState, useEffect, useRef } from "react";
import styles from "./MeetingScreen.module.css";

export default function MeetingScreen({ course, onEnd }) {
  const [elapsed, setElapsed] = useState(0);
  const [muted, setMuted] = useState(false);
  const [camOff, setCamOff] = useState(false); 
  const [chatOpen, setChatOpen] = useState(true); 
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: course?.instructor || "الشيخ",
      text: "السلام عليكم ورحمة الله وبركاته، هل يمكنك إرسال الرابط الخاص بك؟",
      isMe: false,
    },
  ]);
  const [newMsg, setNewMsg] = useState("");
  const chatRef = useRef(null);

  useEffect(() => {
    const t = setInterval(() => setElapsed((p) => p + 1), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (chatRef.current)
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages, chatOpen]);

  const formatTime = (s) =>
    `${Math.floor(s / 60)
      .toString()
      .padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  const sendMsg = () => {
    if (!newMsg.trim()) return;
    setMessages((p) => [
      ...p,
      { id: Date.now(), sender: "أنت", text: newMsg, isMe: true },
    ]);
    setNewMsg("");
  };

  return (
    <div className={styles.meeting} dir="rtl">
      <div className={styles.header}>
        <div className={styles.headerRight}>
          <span className={styles.liveBadge}>مباشر</span>
          <span className={styles.instructorName}>
            {course?.instructor} - الحصة التجريبية
          </span>
        </div>
        <span className={styles.timer}>{formatTime(elapsed)}</span>
      </div>

      <div className={styles.mainWorkspace}>
        <div className={styles.videoArea}>
          <img
            src={course?.instructorImage}
            alt={course?.instructor}
            className={styles.instructorBg}
          />
          <div className={styles.videoOverlayLabel}>شاشة المعلم</div>

          <div
            className={`${styles.selfCam} ${camOff ? styles.selfCamOff : ""}`}
          >
            {camOff ? (
              <div className={styles.camOffPlaceholder}>الكاميرا مغلقة</div>
            ) : (
              <>
                <div className={styles.selfAvatar}>
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    width="24"
                    height="24"
                  >
                    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                  </svg>
                </div>
                <span className={styles.selfLabel}>أنت (كاميرا الطالب)</span>
              </>
            )}
          </div>
        </div>

        {chatOpen && (
          <div className={styles.chatPanel}>
            <div className={styles.chatHeader}>
              <span>المحادثة المباشرة</span>
              <button
                className={styles.chatCloseBtn}
                onClick={() => setChatOpen(false)}
                title="إغلاق الشات"
              >
                ✕
              </button>
            </div>

            <div className={styles.chatMsgs} ref={chatRef}>
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`${styles.msg} ${m.isMe ? styles.msgMe : ""}`}
                >
                  {!m.isMe && (
                    <img
                      src={course?.instructorImage}
                      alt={m.sender}
                      className={styles.msgAvatar}
                    />
                  )}
                  <div className={styles.msgBubble}>
                    {!m.isMe && (
                      <span className={styles.msgSender}>{m.sender}</span>
                    )}
                    <p>{m.text}</p>
                    {m.link && (
                      <a
                        href={m.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {m.link}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.chatInputRow}>
              <input
                className={styles.chatInput}
                type="text"
                placeholder="اكتب رسالة للمعلم..."
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMsg()}
              />
              <button
                className={styles.sendBtn}
                onClick={sendMsg}
                aria-label="إرسال"
              >
                ➤
              </button>
            </div>
          </div>
        )}
      </div>

      <div className={styles.controls}>
        <div className={styles.controlsGroup}>
          <button
            className={`${styles.ctrlBtn} ${muted ? styles.ctrlBtnMuted : ""}`}
            onClick={() => setMuted(!muted)}
            title={muted ? "تشغيل الميكروفون" : "كتم الصوت"}
          >
            {muted ? (
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                width="22"
                height="22"
              >
                <path d="M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zM12 19.55c-3.58 0-6.5-2.92-6.5-6.5H4c0 4.25 3.28 7.79 7.5 8.44V23h1v-1.01c.39-.05.77-.12 1.15-.2l-1.32-1.32c-.11.01-.22.08-.33.08zM4.27 3L3 4.27l6.01 6.01V11c0 1.66 1.33 3 2.99 3 .22 0 .44-.03.65-.08l1.66 1.66c-.71.33-1.5.52-2.31.52-2.76 0-5.3-2.1-5.3-5.1H5c0 3.41 2.72 6.23 6 6.72V19h-2v2h6v-2h-2v-1.28c.95-.13 1.82-.46 2.58-.9l4.15 4.15 1.27-1.27L4.27 3zM12 5c1.66 0 3 1.34 3 3v.18L11.12 4.3c.27-.19.57-.3.88-.3z" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                width="22"
                height="22"
              >
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5zm6 6c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.41 2.72 6.23 6 6.92V20H9v2h6v-2h-2v-2.08c3.39-.49 6-3.39 6-6.92h-2z" />
              </svg>
            )}
          </button>

          <button
            className={`${styles.ctrlBtn} ${camOff ? styles.ctrlBtnMuted : ""}`}
            onClick={() => setCamOff(!camOff)}
            title={camOff ? "تشغيل الكاميرا" : "إيقاف الكاميرا"}
          >
            {camOff ? (
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                width="22"
                height="22"
              >
                <path d="M18 10.48V6c0-1.1-.9-2-2-2H6.83l2 2H16v7.17l2 2v-4.69zM2.81 2.81L1.39 4.22l4.46 4.46L4 10v7c0 1.1.9 2 2 2h12c.34 0 .65-.09.93-.24l2.85 2.85 1.41-1.41L2.81 2.81zM6 17v-5.17l5.17 5.17H6z" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                width="22"
                height="22"
              >
                <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
              </svg>
            )}
          </button>

          <button
            className={`${styles.ctrlBtn} ${chatOpen ? styles.ctrlBtnActive : ""}`}
            onClick={() => setChatOpen(!chatOpen)}
            title="غرفة الدردشة"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
            </svg>
          </button>

          <button className={styles.ctrlBtn} title="مشاركة الشاشة">
            <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
              <path d="M20 18c1.1 0 1.99-.9 1.99-2L22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zm-8-10l4 4-1.4 1.4L13 11.8V17h-2v-5.2l-1.6 1.6L8 12l4-4z" />
            </svg>
          </button>
        </div>

        <button
          className={`${styles.ctrlBtn} ${styles.ctrlBtnEnd}`}
          onClick={onEnd}
          title="مغادرة الحصة"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
          </svg>
          <span className={styles.endCallText}>إنهاء الحصة</span>
        </button>
      </div>
    </div>
  );
}
