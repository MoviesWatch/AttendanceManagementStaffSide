import { NavLink, Outlet } from "react-router-dom";
import { accesses } from "../helpers/options";
import { OptionsRenderer } from "../helpers/OptionsRenderer";
import "./../styles/timetable.scss";
export const Timetable = () => {
  return (
    <>
      <OptionsRenderer page="timetable" />
      <Outlet />
    </>
  );
};
