// src/Pages/Layouts/Main.jsx  — نسخة محدثة بإضافة CoursesSection

import HeroSection from "../Hero/HeroSection";
import CoursesSection from "../../components/CoursesSection/CoursesSection";
import IslamicSection from "../../components/IslamicSection/IslamicSection";
import ContactSection from "../../components/ContactSection/ContactSection";
import Services from "../../components/ServisesSection/ServicesSection";

export default function Main() {
  return (
    <div>
      <HeroSection />
      <CoursesSection />
      <Services />
      <IslamicSection />
      <ContactSection />
    </div>
  );
}
