import { NavLink, Outlet } from "react-router-dom";
import { OptionsRenderer } from "../helpers/OptionsRenderer";

export const StudentsAndSubjects = () => {
  return (
    <>
      <OptionsRenderer page="studentsAndSubjects" />
      <Outlet />
    </>
  );
};
