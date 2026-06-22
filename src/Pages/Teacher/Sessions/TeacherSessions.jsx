import React, { useState, useEffect } from "react";
import axios from "axios";

const TeacherSessions = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [sessionsData, setSessionsData] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const tabs = [
    { id: "upcoming", name: "الحصص القادمة", endpoint: "/api/teacher/sessions/upcoming" },
    { id: "pending", name: "قيد الانتظار", endpoint: "/api/teacher/sessions/pending" },
    { id: "ended", name: "الحصص المنتهية", endpoint: "/api/teacher/sessions/ended" },
    { id: "cancelled", name: "الحصص الملغاة", endpoint: "/api/teacher/sessions/cancelled" },
  ];

  const fetchSessions = async (tabId, page = 1) => {
    setLoading(true);
    setError("");
    
    const baseUrl = "https://muslim-academy.betamoneta.com";
    const currentTab = tabs.find((t) => t.id === tabId);

    try {
      const response = await axios.get(`${baseUrl}${currentTab.endpoint}`, {
        params: { page: page },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, 
        },
      });

      if (response.data.code === 200) {
        if (tabId === "upcoming") {
          setSessionsData(response.data.data ? [response.data.data] : []);
          setPagination(null); 
        } else {
          setSessionsData(response.data.data || []);
          setPagination(response.data.pagination || null);
        }
      } else {
        setError("حدث خطأ في تحميل البيانات");
      }
    } catch (err) {
      setError("فشل الاتصال بالسيرفر، تأكد من تسجيل الدخول");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions(activeTab, 1);
  }, [activeTab]);

  return (
    <div className="container my-5" dir="rtl">
      <h3 className="mb-4 text-primary">
        <i className="bi bi-calendar3 me-2"></i> إدارة حصص المعلم
      </h3>

      <ul className="nav nav-tabs mb-4">
        {tabs.map((tab) => (
          <li className="nav-item" key={tab.id}>
            <button
              className={`nav-link fw-bold ${activeTab === tab.id ? "active bg-primary text-white" : "text-secondary"}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.name}
            </button>
          </li>
        ))}
      </ul>

      {loading && (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2">جاري تحميل الحصص...</p>
        </div>
      )}

      {error && <div className="alert alert-danger text-center">{error}</div>}

      {!loading && !error && (
        <div>
          {sessionsData.length === 0 ? (
            <div className="text-center my-5 border p-5 bg-light rounded">
              <i className="bi bi-folder-x text-muted display-1"></i>
              <p className="mt-3 text-secondary fs-5">لا توجد حصص في هذا القسم حالياً.</p>
            </div>
          ) : (
            <div className="row g-3">
              {sessionsData.map((session) => (
                <div className="col-md-6 col-lg-4" key={session.slug}>
                  <div className="card h-100 shadow-sm border-0 position-relative">
                    <span className="position-absolute top-0 end-0 bg-success text-white px-2 py-1 m-2 rounded-pill small">
                      {session.type === "paid" ? "مدفوعة" : "تجريبية"}
                    </span>

                    <div className="card-body pt-4">
                      <div className="d-flex align-items-center mb-3">
                        <img
                          src={session.user?.image}
                          alt={session.user?.name}
                          className="rounded-circle me-3 border"
                          style={{ width: "50px", height: "50px", objectFit: "cover" }}
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/50"; // صورة بديلة لو الصورة باظت
                          }}
                        />
                        <div>
                          <h6 className="mb-0 fw-bold">{session.user?.name}</h6>
                          <small className="text-muted">طالب</small>
                        </div>
                      </div>

                      <h5 className="card-title fw-bold text-dark mb-3">{session.title}</h5>

                      <p className="card-text text-secondary mb-2 small">
                        <i className="bi bi-clock text-primary me-1"></i>
                        <b>البداية:</b> {session.starts_at}
                      </p>
                      <p className="card-text text-secondary mb-2 small">
                        <i className="bi bi-hourglass-split text-warning me-1"></i>
                        <b>المدة:</b> {session.duration} دقيقة
                      </p>

                      <hr />

                      <div className="d-flex gap-2 justify-content-end mt-3">
                        {activeTab === "pending" && (
                          <>
                            <button className="btn btn-sm btn-outline-success">
                              <i className="bi bi-check-lg me-1"></i> قبول
                            </button>
                            <button className="btn btn-sm btn-outline-danger">
                              <i className="bi bi-x-lg me-1"></i> رفض أو تعديل
                            </button>
                          </>
                        )}

                        {activeTab === "upcoming" && (
                          <button className="btn btn-sm btn-primary w-100">
                            <i className="bi bi-camera-video me-1"></i> دخول الغرفة الصفية
                          </button>
                        )}

                        {activeTab === "ended" && (
                          <div className="d-flex flex-wrap gap-1 w-100">
                            <button className={`btn btn-sm flex-fill ${session.has_assignment ? "btn-success" : "btn-outline-primary"}`}>
                              <i className={`bi ${session.has_assignment ? "bi-check-circle" : "bi-plus-circle"} me-1`}></i>
                              {session.has_assignment ? "عرض الواجب" : "إضافة واجب"}
                            </button>
                            
                            <button className={`btn btn-sm flex-fill ${session.has_quiz ? "btn-success" : "btn-outline-primary"}`}>
                              <i className={`bi ${session.has_quiz ? "bi-check-circle" : "bi-plus-circle"} me-1`}></i>
                              {session.has_quiz ? "عرض الاختبار" : "إضافة اختبار"}
                            </button>

                            <button className={`btn btn-sm flex-fill ${session.has_report ? "btn-success" : "btn-outline-primary"}`}>
                              <i className={`bi ${session.has_report ? "bi-check-circle" : "bi-plus-circle"} me-1`}></i>
                              {session.has_report ? "عرض التقرير" : "كتابة تقرير"}
                            </button>
                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {pagination && pagination.last_page > 1 && (
            <nav className="d-flex justify-content-center mt-5">
              <ul className="pagination">
                <button
                  className="page-link"
                  disabled={pagination.current_page === 1}
                  onClick={() => fetchSessions(activeTab, pagination.current_page - 1)}
                >
                  السابق
                </button>
                
                {[...Array(pagination.last_page).keys()].map((num) => (
                  <li className={`page-item ${pagination.current_page === num + 1 ? "active" : ""}`} key={num}>
                    <button className="page-link" onClick={() => fetchSessions(activeTab, num + 1)}>
                      {num + 1}
                    </button>
                  </li>
                ))}

                <button
                  className="page-link"
                  disabled={pagination.current_page === pagination.last_page}
                  onClick={() => fetchSessions(activeTab, pagination.current_page + 1)}
                >
                  التالي
                </button>
              </ul>
            </nav>
          )}
        </div>
      )}
    </div>
  );
};

export default TeacherSessions;