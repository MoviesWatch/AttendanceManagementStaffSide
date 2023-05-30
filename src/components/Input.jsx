import { useEffect, useState } from "react";
import "./../styles/input.scss";
export const Input = ({
  type,
  layoutType,
  isField,
  label,
  onChange,
  value,
  name,
  disabled,
  checked,
  pattern,
  readOnly,
  className,
}) => {
  const [error, setError] = useState("");
  useEffect(
    () => setError(!(value + "").match(pattern) ? "active active1" : ""),
    []
  );
  return (
    <div className="input-container">
      <label className={`${layoutType}  ${className}`}>
        {label}
        <input
          type={type}
          className={`input ${isField && "field"}`}
          onChange={(ev) => {
            onChange(ev);
            setError(
              !(ev.target.value + "").match(pattern) ? "active active2" : ""
            );
          }}
          value={value}
          name={name}
          readOnly={readOnly}
          disabled={disabled}
          checked={checked}
        />
      </label>
      <small className={`error ${error}`}>Enter valid {label}</small>
    </div>
  );
};
