import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Routes, Route, Navigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import useSiteSettings from "./hooks/useSiteSettings";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";

import Login from "./components/auth/login/Login";
import Register from "./components/auth/register/Register";
import SuccessRegister from "./components/auth/SuccessRegister/SuccessRegister";
import SuccessPassword from "./components/auth/SuccessPassword/SucccessPassword";
import ForgotVerifyOtp from "./components/auth/verify-otp/VerifypasswordOtp";
import VerifyPasswordOtp from "./components/auth/verify-otp/VerifypasswordOtp";
import VerifyOtp from "./components/auth/verify-otp/VerifyOtp";
import ForgotPassword from "./components/auth/forgot-password/ForgotPassword";
import ResetPassword from "./components/auth/forgot-password/Resetpassword";

import Main from "./Pages/Layouts/Main";
import CoursesPage from "./Pages/Courses/CoursesPage";
import CourseDetailPage from "./Pages/Courses/CourseDetailPage";
import SubscriptionPage from "./Pages/Courses/SubscriptionPage";
import MySubscriptionsPage from "./Pages/MySubscriptionsPage/MySubscriptionsPage";
import SubscriptionDetailPage from "./Pages/MySubscriptionsPage/SubscriptionDetailPage";
import Services from "./components/ServisesSection/ServicesSection";
import Library from "./Pages/Services/LibraryPage";
import AskScholars from "./Pages/Services/AskScholarPage";
import Gifts from "./Pages/Services/GiftsPage";
import Expenses from "./Pages/Services/ExpensesPage";
import ServiceCourses from "./Pages/Services/ServiceCourses";
import CourseDetail from "./Pages/Services/CourseDetail";
import ExamPage from "./Pages/Services/ExamPage";
import ExamsListPage from "./Pages/Services/ExamsListPage";


import IslamicSection from "./components/IslamicSection/IslamicSection";
import AthkarPage from "./Pages/Islamic/AthkarPage";
import Tasbeh from "./Pages/Islamic/TasbehPage";
import QuranPage from "./Pages/Islamic/QuranPage"; 
import PrayerTracker from "./Pages/Islamic/PrayerTracker";
import ProfileMenu from "./Pages/Profile/ProfileMenu";
import UserProfile from "./Pages/Profile/UserProfile";
import PersonalData from "./Pages/Profile/PersonalData";
import About from "./Pages/Profile/About";
import Contact from "./Pages/Profile/Contact";
import AppSettings from "./Pages/Profile/AppSettings";
import HowItWorks from "./Pages/Profile/HowItWorks";
import PrivacyPage from "./Pages/Profile/PrivacyPage";
import TermsPage from "./Pages/Profile/TermsPage";
import FAQPage from "./Pages/Profile/FAQPage";


import TeacherLogin from "./Pages/Teacher/Auth/login/TeacherLogin";
import TeacherRegister from "./Pages/Teacher/Auth/register/TeacherRegister";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import TeacherSessions from "./Pages/Teacher/Sessions/TeacherSessions";
import TeacherVerifyOtp from "./Pages/Teacher/Auth/verify-otp/TeacherVerifyOtp";
import TeacherPendingApproval from "./Pages/Teacher/Auth/TeacherPendingApproval";
function App() {
  const location = useLocation();
  useSiteSettings();

  const authPages = [
    "/login",
    "/register",
    "/forgot-password",
    "/verify-otp",
    "/forgot-verify-otp",
    "/forgot-password/reset",
    "/reset-password",
    "/success-register",
    "/success-password",
     "/teacher/verify-otp",          
  "/teacher/pending-approval",
  ];

  const isAuthPage = authPages.includes(location.pathname);

  const { i18n } = useTranslation();
  
  useEffect(() => {
    document.documentElement.dir = i18n.language === "en" ? "ltr" : "rtl";
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <div className="App">
      {!isAuthPage && <Navbar />}

      <Routes>
        <Route path="/" element={<Main />} />

        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/kids" element={<CoursesPage />} />
        <Route path="/courses/adults" element={<CoursesPage />} />
        <Route path="/courses/:slug" element={<CourseDetailPage />} />
        <Route path="/subscription" element={<SubscriptionPage />} />
        <Route path="/my-subscriptions" element={<MySubscriptionsPage />} />
        <Route
          path="/my-subscriptions/:subscriptionId"
          element={<SubscriptionDetailPage />}
        />

        <Route path="/services" element={<Services />} />
        <Route path="/services/library" element={<Library />} />
        <Route path="/services/fees" element={<Expenses />} />
        <Route path="/services/ask-scholars" element={<AskScholars />} />
        <Route path="/services/gifts" element={<Gifts />} />
        <Route path="/services/:serviceType" element={<ServiceCourses />} />
        <Route path="/services/:serviceType/:courseId" element={<CourseDetail />} />
        <Route path="/services/exams" element={<ExamsListPage />} />
        <Route path="/services/exams/:examId" element={<ExamPage />} />

        <Route path="/islamic" element={<IslamicSection />} />
        <Route path="/islamic/athkar" element={<AthkarPage />} />
        <Route path="/islamic/tasbeh" element={<Tasbeh />} />
        <Route path="/islamic/quran" element={<QuranPage />} />
        <Route path="/islamic/prayer-tracker" element={<PrayerTracker />} />

        <Route path="/profile-menu" element={<ProfileMenu />} />
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/personal-data" element={<PersonalData />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/settings" element={<AppSettings />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/faq" element={<FAQPage />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/success-register" element={<SuccessRegister />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/forgot-verify-otp" element={<VerifyPasswordOtp />} />
        <Route path="/forgot-password/reset" element={<ResetPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/success-password" element={<SuccessPassword />} />

        {/* teacher */}
        <Route path="/teacher/login" element={<TeacherLogin />} />
        <Route path="/teacher/register" element={<TeacherRegister />} />
        <Route path="/teacher/verify-otp" element={<TeacherVerifyOtp />} />
        <Route
          path="/teacher/pending-approval"
          element={<TeacherPendingApproval />}
        />

        <Route
          path="/teacher/sessions"
          element={
            <ProtectedRoute allowedRoles={["teacher"]}>
              <TeacherSessions />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {!isAuthPage && <Footer />}
    </div>
  );
}

export default App;
