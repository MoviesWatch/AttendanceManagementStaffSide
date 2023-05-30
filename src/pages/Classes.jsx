import { NavLink, Outlet } from "react-router-dom";
import { OptionsRenderer } from "../helpers/OptionsRenderer";

export const Classes = () => {
  return (
    <>
      <OptionsRenderer page="classes" />
      <Outlet />
    </>
  );
};
