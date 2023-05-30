import { NavLink, Outlet } from "react-router-dom";
import { accesses } from "../helpers/options";
import { OptionsRenderer } from "../helpers/OptionsRenderer";

export const ClassesAndSubjects = () => {
  const links = [
    ["view", "View"],
    ["add", "Add"],
  ];
  return (
    <>
      <OptionsRenderer page="classesAndSubjects" />
      <Outlet />
    </>
  );
};
