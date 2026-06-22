
import HeroSection from "../../components/Hero/HeroSection";
import CoursesSection from "../../components/CoursesSection/CoursesSection";
import IslamicSection from "../../components/IslamicSection/IslamicSection";
import ContactSection from "../../components/ContactSection/ContactSection";
import Services from "../../components/ServisesSection/ServicesSection";
import SessionCard from "../../components/Teacher/SessionCard";
import StudentCard from "../../components/Teacher/StudentCard";
import StatBadge from "../../components/Teacher/StatBadge";

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
