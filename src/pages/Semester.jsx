import { NavLink, Outlet } from "react-router-dom";
import { OptionsRenderer } from "../helpers/OptionsRenderer";

export const Semester = () => {
  return (
    <>
      <OptionsRenderer page="semesters" />
      <Outlet />
    </>
  );
};
