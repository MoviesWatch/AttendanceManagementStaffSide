import { NavLink, Outlet } from "react-router-dom";
import { accesses } from "../helpers/options";
import { OptionsRenderer } from "../helpers/OptionsRenderer";

export const Staffs = () => {
  return (
    <>
      <OptionsRenderer page="faculties" />
      <Outlet />
    </>
  );
};
