import { NavLink, Outlet } from "react-router-dom";
import { accesses } from "../helpers/options";
import { OptionsRenderer } from "../helpers/OptionsRenderer";

export const OD = () => {
  return (
    <>
      <OptionsRenderer page="od" />
      <Outlet />
    </>
  );
};
