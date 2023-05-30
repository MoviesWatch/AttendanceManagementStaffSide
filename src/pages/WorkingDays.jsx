import { Outlet } from "react-router-dom";
import { OptionsRenderer } from "../helpers/OptionsRenderer";

export const WorkingDays = () => {
  return (
    <>
      <OptionsRenderer page="workingdays" />
      <Outlet />
    </>
  );
};
