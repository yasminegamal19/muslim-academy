import { Outlet } from "react-router-dom";
import TeacherNavbar from "../../../components/Teacher/TeacherNavbar/TeacherNavbar";

export default function TeacherLayout() {
  return (
    <>
      <TeacherNavbar />
      <Outlet />
    </>
  );
}
