import { NavLink, Outlet } from "react-router-dom";
import { accesses } from "../helpers/options";
import { OptionsRenderer } from "../helpers/OptionsRenderer";

export const Students = () => {
  return (
    <>
      <OptionsRenderer page="students" />
      <Outlet />
    </>
  );
};
