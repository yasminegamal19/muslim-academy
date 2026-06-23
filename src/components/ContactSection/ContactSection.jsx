import { useState, useEffect, useRef, useCallback } from "react";
import styles from "./ContactSection.module.css";
import { api } from "../../store/slices/authSlice";

const DAY_NAMES = {
  saturday: "السبت",
  sunday: "الأحد",
  monday: "الاثنين",
  tuesday: "الثلاثاء",
  wednesday: "الأربعاء",
  thursday: "الخميس",
  friday: "الجمعة",
};

function formatTime(isoStr) {
  if (!isoStr) return "";
  const d = new Date(isoStr);
  if (isNaN(d)) return isoStr;
  return d.toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" });
}

function TeacherDrawer({ teacher, onClose }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetch_ = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get(`/teachers/${teacher.id}`);
        setDetails(res.data?.data);
      } catch (e) {
        const code = e?.response?.data?.code;
        if (code === 403) setError("ليس لديك صلاحية عرض بيانات هذا المعلم");
        else if (code === 404) setError("المعلم غير موجود");
        else
          setError(e?.response?.data?.message || "تعذّر تحميل بيانات المعلم");
      } finally {
        setLoading(false);
      }
    };
    fetch_();
  }, [teacher.id]);

  return (
    <div className={styles.drawerOverlay} onClick={onClose}>
      <div
        className={styles.drawer}
        dir="rtl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.drawerHeader}>
          <h3 className={styles.drawerTitle}>بيانات المعلم</h3>
          <button className={styles.drawerClose} onClick={onClose}>
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {loading && (
          <div className={styles.drawerLoading}>
            <div className={styles.spinner} />
          </div>
        )}

        {!loading && error && <p className={styles.drawerError}>{error}</p>}

        {!loading && !error && details && (
          <div className={styles.drawerBody}>
            <div className={styles.drawerProfile}>
              {details.image ? (
                <img
                  src={details.image}
                  alt={details.name}
                  className={styles.drawerAvatar}
                />
              ) : (
                <div className={styles.drawerAvatarFallback}>
                  <svg
                    viewBox="0 0 24 24"
                    width="32"
                    height="32"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
              )}
              <div>
                <h4 className={styles.drawerName}>{details.name}</h4>
                <p className={styles.drawerEmail}>{details.email}</p>
                <p className={styles.drawerTimezone}>{details.timezone}</p>
              </div>
            </div>

            {details.availability &&
              Object.keys(details.availability).length > 0 && (
                <div className={styles.availabilitySection}>
                  <h5 className={styles.availabilityTitle}>أوقات التوفر</h5>
                  <div className={styles.availabilityList}>
                    {Object.entries(details.availability).map(
                      ([day, slots]) => (
                        <div key={day} className={styles.dayRow}>
                          <span className={styles.dayName}>
                            {DAY_NAMES[day] ?? day}
                          </span>
                          <div className={styles.slots}>
                            {slots.map((slot, i) => (
                              <span key={i} className={styles.slot}>
                                {slot.start} — {slot.end}
                              </span>
                            ))}
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}
          </div>
        )}
      </div>
    </div>
  );
}

function ContactSkeleton() {
  return (
    <div className={styles.skeletonCard}>
      <div className={`${styles.skeletonCircle} ${styles.shimmer}`} />
      <div className={styles.skeletonLines}>
        <div
          className={`${styles.skeletonLine} ${styles.shimmer}`}
          style={{ width: "60%" }}
        />
        <div
          className={`${styles.skeletonLine} ${styles.shimmer}`}
          style={{ width: "40%" }}
        />
      </div>
    </div>
  );
}

export default function ContactSection() {
  const [teachers, setTeachers] = useState([]);
  const [teachersLoading, setTeachersLoading] = useState(true);
  const [teachersError, setTeachersError] = useState("");

  const [activeTeacher, setActiveTeacher] = useState(null);
  const [showDrawer, setShowDrawer] = useState(false);

  const [messages, setMessages] = useState([]);
  const [msgsLoading, setMsgsLoading] = useState(false);
  const [msgsError, setMsgsError] = useState("");

  const [inputMessage, setInputMessage] = useState("");
  const [sending, setSending] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [showWarning, setShowWarning] = useState(true);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchTeachers = async () => {
      setTeachersLoading(true);
      setTeachersError("");
      try {
        const res = await api.get("/teachers");
        const list = Array.isArray(res.data?.data) ? res.data.data : [];
        setTeachers(list);
        if (list.length > 0) setActiveTeacher(list[0]);
      } catch (e) {
        setTeachersError(e?.response?.data?.message || "تعذّر تحميل المعلمين");
      } finally {
        setTeachersLoading(false);
      }
    };
    fetchTeachers();
  }, []);

  const fetchMessages = useCallback(async (teacherId) => {
    if (!teacherId) return;
    setMsgsLoading(true);
    setMsgsError("");
    try {
      const res = await api.get(`/chats/${teacherId}`);
      const data = res.data?.data;
      setMessages(Array.isArray(data) ? data : []);
    } catch (e) {
      const code = e?.response?.data?.code;
      if (code === 403) setMsgsError("ليس لديك صلاحية التواصل مع هذا المعلم");
      else if (code === 404) setMsgsError("المعلم غير موجود");
      else setMsgsError(e?.response?.data?.message || "تعذّر تحميل الرسائل");
    } finally {
      setMsgsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!activeTeacher) return;
    setMessages([]);
    setShowWarning(true);
    fetchMessages(activeTeacher.id);
  }, [activeTeacher, fetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !activeTeacher || sending) return;

    const text = inputMessage.trim();
    const optimisticMsg = {
      id: `opt-${Date.now()}`,
      message: text,
      sender_type: "user", 
      created_at: new Date().toISOString(),
      _optimistic: true,
    };

    setMessages((prev) => [...prev, optimisticMsg]);
    setInputMessage("");
    setSending(true);

    try {
      const body = new FormData();
      body.append("message", text);
      await api.post(`/chats/${activeTeacher.id}`, body, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      fetchMessages(activeTeacher.id);
    } catch (err) {
      setMessages((prev) => prev.filter((m) => m.id !== optimisticMsg.id));
      alert(err?.response?.data?.message || "تعذّر إرسال الرسالة");
    } finally {
      setSending(false);
    }
  };

  const filteredTeachers = teachers.filter((t) =>
    t.name?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className={styles.chatPage}>
      <div className={styles.chatContainer}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h2 className={styles.pageTitle}>تواصل</h2>
            <div className={styles.searchWrapper}>
              <input
                type="text"
                placeholder="ابحث باسم المعلم..."
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
            {teachersLoading &&
              [1, 2, 3].map((i) => <ContactSkeleton key={i} />)}

            {!teachersLoading && teachersError && (
              <p className={styles.sidebarError}>{teachersError}</p>
            )}

            {!teachersLoading &&
              !teachersError &&
              filteredTeachers.length === 0 && (
                <p className={styles.sidebarEmpty}>
                  لا يوجد معلمون مرتبطون بحسابك
                </p>
              )}

            {!teachersLoading &&
              filteredTeachers.map((teacher) => (
                <div
                  key={teacher.id}
                  className={`${styles.contactCard} ${activeTeacher?.id === teacher.id ? styles.contactCardActive : ""}`}
                  onClick={() => setActiveTeacher(teacher)}
                >
                  <div className={styles.avatarWrapper}>
                    {teacher.image ? (
                      <img
                        src={teacher.image}
                        alt={teacher.name}
                        className={styles.avatar}
                      />
                    ) : (
                      <div className={styles.avatarFallback}>
                        <svg
                          viewBox="0 0 24 24"
                          width="22"
                          height="22"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className={styles.contactInfo}>
                    <h4 className={styles.contactName}>{teacher.name}</h4>
                    <p className={styles.contactRole}>{teacher.email}</p>
                  </div>
                  <span className={styles.actionBadge}>تواصل</span>
                </div>
              ))}
          </div>
        </aside>

        <main className={styles.chatArea}>
          {!activeTeacher ? (
            <div className={styles.noSelection}>
              <svg
                viewBox="0 0 24 24"
                width="56"
                height="56"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <p>اختر معلماً لبدء المحادثة</p>
            </div>
          ) : (
            <>
              <div className={styles.chatHeader}>
                <button
                  className={styles.activeUserMeta}
                  onClick={() => setShowDrawer(true)}
                  title="عرض بيانات المعلم"
                >
                  <div className={styles.avatarWrapper}>
                    {activeTeacher.image ? (
                      <img
                        src={activeTeacher.image}
                        alt={activeTeacher.name}
                        className={styles.avatarSmall}
                      />
                    ) : (
                      <div className={styles.avatarFallbackSmall}>
                        <svg
                          viewBox="0 0 24 24"
                          width="18"
                          height="18"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className={styles.activeUserName}>
                      {activeTeacher.name}
                    </h3>
                    <span className={styles.activeUserStatus}>
                      اضغط لعرض البيانات والمواعيد
                    </span>
                  </div>
                </button>

                <div className={styles.headerActions}>
                  <button
                    className={styles.iconCallBtn}
                    aria-label="اتصال صوتي"
                  >
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
                  <button
                    className={styles.iconCallBtn}
                    aria-label="اتصال فيديو"
                  >
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
                        نود إعلامكم أن هذه المحادثة تخضع لإشراف إدارة
                        الأكاديمية، لضمان جودة التواصل وحل أي مشكلة قد تطرأ.
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

                {msgsLoading && (
                  <div className={styles.msgsLoading}>
                    <div className={styles.spinner} />
                  </div>
                )}

                {!msgsLoading && msgsError && (
                  <div className={styles.msgsError}>{msgsError}</div>
                )}

                {!msgsLoading && !msgsError && messages.length === 0 && (
                  <div className={styles.emptyState}>
                    <svg
                      viewBox="0 0 24 24"
                      width="48"
                      height="48"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    <p>ابدأ المحادثة مع معلمك</p>
                  </div>
                )}

                {!msgsLoading &&
                  !msgsError &&
                  messages.map((msg) => {
                    const isMe = msg.sender_type === "user" || msg._optimistic;

                    return (
                      <div
                        key={msg.id}
                        className={`${styles.messageRow} ${isMe ? styles.msgMe : styles.msgThem}`}
                      >
                        <div className={styles.messageBubble}>
                          <p className={styles.msgText}>{msg.message}</p>
                          <span className={styles.msgTime}>
                            {formatTime(msg.created_at)}
                          </span>
                        </div>
                      </div>
                    );
                  })}

                <div ref={messagesEndRef} />
              </div>

              <form className={styles.inputArea} onSubmit={handleSendMessage}>
                <input
                  type="text"
                  placeholder="اكتب هنا..."
                  className={styles.chatInput}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  disabled={sending}
                />

                <button
                  type="submit"
                  className={`${styles.sendBtn} ${sending ? styles.sendBtnDisabled : ""}`}
                  disabled={sending}
                  aria-label="إرسال"
                >
                  {sending ? (
                    <div className={styles.spinnerSmall} />
                  ) : (
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
                  )}
                </button>
              </form>
            </>
          )}
        </main>
      </div>

      {showDrawer && activeTeacher && (
        <TeacherDrawer
          teacher={activeTeacher}
          onClose={() => setShowDrawer(false)}
        />
      )}
    </div>
  );
}
