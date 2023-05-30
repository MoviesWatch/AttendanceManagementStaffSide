import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { session } from "./getSession";

export const ProtectedRoute = ({ route, login }) => {
  const navigate = useNavigate();
  const faculty = session("faculty").facultyID;
  useEffect(() => {
    if (!faculty) navigate("/login", { replace: true });
    if (faculty && login) navigate("/", { replace: true });
  }, []);
  return route;
};
