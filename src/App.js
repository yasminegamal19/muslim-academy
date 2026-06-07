// src/App.jsx  — نسخة محدثة بإضافة مسارات الدورات

import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import HomePage from "./Pages/Home/HomePage";
import ServicesPage from "./Pages/Services/ServicesPage";
import LibraryPage from "./Pages/Services/LibraryPage";
import IslamicAcademyPage from "./Pages/Services/IslamicAcademyPage";
import AskScholarPage from "./Pages/Services/AskScholarPage";
import GiftsPage from "./Pages/Services/GiftsPage";
import IslamicPage from "./Pages/Islamic/IslamicPage";
import PrayerTimesPage from "./Pages/Islamic/PrayerTimesPage";

import Login from "./components/auth/login/Login";
import Register from "./components/auth/register/Register";
import SuccessRegister from "./components/auth/SuccessRegister/SuccessRegister";
import SuccessPassword from "./components/auth/SuccessPassword/SucccessPassword";
import ForgotVerifyOtp from "./components/auth/verify-otp/VerifypasswordOtp";
import VerifyOtp from "./components/auth/verify-otp/VerifyOtp";
import ForgotPassword from "./components/auth/forgot-password/ForgotPassword";
import ResetPassword from "./components/auth/forgot-password/Resetpassword";
import Main from "./Pages/Layouts/Main";

import CoursesPage from "./Pages/Courses/CoursesPage";
import CourseDetailPage from "./Pages/Courses/CourseDetailPage";
import Services from "./components/ServisesSection/ServicesSection";
import Library from "./Pages/Services/LibraryPage";
import IslamicAcademy from "./Pages/Services/IslamicAcademyPage";
import AskScholars from "./Pages/Services/AskScholarPage";
import Gifts from "./Pages/Services/GiftsPage";


function App() {
  const location = useLocation();

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

        <Route path="/courses/kids" element={<CoursesPage />} />
        <Route path="/courses/adults" element={<CoursesPage />} />
        <Route path="/courses/:id" element={<CourseDetailPage />} />

        <Route path="/services" element={<Services />} />
        <Route path="/services/library" element={<Library />} />
        <Route path="/services/library/academy" element={<IslamicAcademy />} />
        <Route path="/services/ask-scholars" element={<AskScholars />} />
        <Route path="/services/gifts" element={<Gifts />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/success-register" element={<SuccessRegister />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/forgot-verify-otp" element={<ForgotVerifyOtp />} />
        <Route path="/forgot-password/reset" element={<ResetPassword />} />
        <Route path="/success-password" element={<SuccessPassword />} />
      </Routes>
    </div>
  );
}

export default App;
