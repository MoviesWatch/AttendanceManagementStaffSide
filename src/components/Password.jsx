import "./../styles/input.scss";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useEffect, useState } from "react";

export const Password = ({ layoutType, label, onChange, value, pattern }) => {
  const [reveal, setReveal] = useState(false);
  const [error, setError] = useState("");
  useEffect(
    () => setError(!(value + "").match(pattern) ? "active active1" : ""),
    []
  );
  return (
    <div className="input-container">
      <label className={layoutType}>
        {label}
        <span className="icon-container">
          <input
            type={reveal ? "text" : "password"}
            className="input field"
            value={value}
            onChange={(ev) => {
              onChange(ev);
              setError(
                !(ev.target.value + "").match(pattern) ? "active active2" : ""
              );
            }}
          />
          <span className="icon" onClick={() => setReveal((reveal) => !reveal)}>
            {reveal ? <Visibility /> : <VisibilityOff />}
          </span>
        </span>
      </label>
      <small className={`error ${error}`}>Enter valid {label}</small>
    </div>
  );
};
