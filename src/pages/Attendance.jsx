import { NavLink, Outlet } from "react-router-dom";
import { accesses } from "../helpers/options";
import { OptionsRenderer } from "../helpers/OptionsRenderer";

export const Attendance = () => {
  return (
    <>
      <OptionsRenderer page="attendance" />
      <Outlet />
    </>
  );
};
