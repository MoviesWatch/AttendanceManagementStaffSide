import { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { faculty, session } from "./getSession";
import { options } from "./options";

export const OptionsRenderer = ({ page }) => {
  const accessID = session("faculty")?.accessID || 0;
  const navigate = useNavigate();
  useEffect(() => {
    if (!options[accessID][page]) {
      navigate("/");
    }
  }, []);
  return (
    <ul className="links">
      {Object.entries(options[accessID][page] || {}).map(([link, label]) => (
        <li>
          <NavLink to={link}>{label}</NavLink>
        </li>
      ))}
    </ul>
  );
};
