

import { useNavigate, useParams } from "react-router-dom";
import {
  ClipboardList,
  FileCheck2,
  BarChart3,
  User,
  Calendar,
  ChevronLeft,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { getCourseById } from "../../components/data/CoursesData";
import styles from "./CourseDetail.module.css";

const SERVICE_CONFIG = {
  tasks: { label: "المهام", icon: ClipboardList },
  exams: { label: "الاختبارات", icon: FileCheck2 },
  reports: { label: "التقارير", icon: BarChart3 },
};

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("ar-EG", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function TaskItem({ task }) {
  const isDone = task.status === "completed";
  return (
    <div className={styles.itemCard}>
      <div className={styles.itemStatusIcon}>
        {isDone ? (
          <CheckCircle2 size={20} className={styles.doneIcon} />
        ) : (
          <Circle size={20} className={styles.pendingIcon} />
        )}
      </div>
      <div className={styles.itemBody}>
        <h4 className={styles.itemTitle}>{task.title}</h4>
        <p className={styles.itemText}>{task.description}</p>
        <span className={styles.itemMeta}>
          آخر موعد للتسليم: {formatDate(task.dueDate)}
        </span>
      </div>
      <span
        className={`${styles.statusTag} ${isDone ? styles.doneTag : styles.pendingTag}`}
      >
        {isDone ? "تم التسليم" : "مطلوب"}
      </span>
    </div>
  );
}

function ExamItem({ exam }) {
  const isDone = exam.status === "completed";
  return (
    <div className={styles.itemCard}>
      <div className={styles.itemStatusIcon}>
        {isDone ? (
          <CheckCircle2 size={20} className={styles.doneIcon} />
        ) : (
          <Circle size={20} className={styles.pendingIcon} />
        )}
      </div>
      <div className={styles.itemBody}>
        <h4 className={styles.itemTitle}>{exam.title}</h4>
        <span className={styles.itemMeta}>
          {exam.questionsCount} أسئلة · {exam.durationMinutes} دقيقة
        </span>
      </div>
      {isDone ? (
        <span className={styles.scoreTag}>
          {exam.score} / {exam.totalScore}
        </span>
      ) : (
        <button className={styles.actionButton}>بدء الاختبار</button>
      )}
    </div>
  );
}

function ReportItem({ report }) {
  return (
    <div className={styles.reportCard}>
      <h4 className={styles.itemTitle}>{report.title}</h4>
      <div className={styles.reportStats}>
        <div className={styles.reportStat}>
          <span className={styles.reportStatLabel}>الحضور</span>
          <span className={styles.reportStatValue}>{report.attendance}</span>
        </div>
        <div className={styles.reportStat}>
          <span className={styles.reportStatLabel}>المشاركة</span>
          <span className={styles.reportStatValue}>
            {report.participationScore} / 10
          </span>
        </div>
        <div className={styles.reportStat}>
          <span className={styles.reportStatLabel}>الاختبار</span>
          <span className={styles.reportStatValue}>
            {report.examScore} / 10
          </span>
        </div>
      </div>
      {report.notes && <p className={styles.reportNotes}>{report.notes}</p>}
    </div>
  );
}

export default function CourseDetail() {
  const navigate = useNavigate();
  const { serviceType, courseId } = useParams();
  const config = SERVICE_CONFIG[serviceType];
  const course = getCourseById(courseId);

  if (!config || !course) {
    return (
      <div className={styles.pageWrapper} dir="rtl">
        <div className={styles.notFound}>
          <p>لم يتم العثور على هذه الصفحة.</p>
          <button
            className={styles.backButton}
            onClick={() => navigate("/services")}
          >
            الرجوع للخدمات
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper} dir="rtl">
      <button
        className={styles.backLink}
        onClick={() => navigate(`/services/${serviceType}`)}
      >
        <ChevronLeft size={18} />
        <span>{config.label}</span>
      </button>

      <div className={styles.courseHeader}>
        <div className={styles.teacherRow}>
          <div className={styles.teacherAvatar}>
            <User size={18} />
          </div>
          <div>
            <span className={styles.teacherLabel}>المعلم</span>
            <h3 className={styles.teacherName}>{course.teacherName}</h3>
          </div>
        </div>
        <h1 className={styles.courseTitle}>{course.title}</h1>
      </div>

      <div className={styles.timeline}>
        {course.lectures.map((lecture, index) => {
          const items = lecture[serviceType] || [];
          return (
            <div key={lecture.id} className={styles.timelineRow}>
              <div className={styles.timelineMarkerCol}>
                <div className={styles.timelineMarker}>{index + 1}</div>
                {index !== course.lectures.length - 1 && (
                  <div className={styles.timelineLine} />
                )}
              </div>

              <div className={styles.lectureContent}>
                <div className={styles.lectureHeader}>
                  <h3 className={styles.lectureTitle}>{lecture.title}</h3>
                  <span className={styles.lectureDate}>
                    <Calendar size={14} />
                    {formatDate(lecture.date)}
                  </span>
                </div>

                {items.length === 0 ? (
                  <p className={styles.lectureEmpty}>
                    لا توجد {config.label.toLowerCase()} لهذه المحاضرة بعد.
                  </p>
                ) : (
                  <div className={styles.itemsList}>
                    {serviceType === "tasks" &&
                      items.map((task) => (
                        <TaskItem key={task.id} task={task} />
                      ))}
                    {serviceType === "exams" &&
                      items.map((exam) => (
                        <ExamItem key={exam.id} exam={exam} />
                      ))}
                    {serviceType === "reports" &&
                      items.map((report) => (
                        <ReportItem key={report.id} report={report} />
                      ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
