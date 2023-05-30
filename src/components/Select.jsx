import { useEffect, useState } from "react";
import "./../styles/input.scss";
export const Select = ({
  layoutType,
  label,
  options,
  onChange,
  isSmall,
  disabled,
  value,
  pattern,
}) => {
  const [error, setError] = useState("");
  useEffect(
    () => setError(!(value + "").match(pattern) ? "active active1" : ""),
    []
  );
  return (
    <div className="input-container">
      <label className={layoutType}>
        {label}
        <select
          className={`input field ${isSmall ? "small" : ""}`}
          // onClick={(ev) => {
          //   setError(!ev.target.value.match(pattern));
          // }}
          onChange={(ev) => {
            onChange(ev);
            setError(
              !(ev.target.value + "").match(pattern) ? "active active2" : ""
            );
          }}
          disabled={disabled}
          value={value}
        >
          <option value="" selected>
            --select--
          </option>
          {options.map((option) => (
            <option value={option[1]}>{option[0]}</option>
          ))}
        </select>
      </label>
      <small className={`error ${error}`}>Enter valid {label}</small>
    </div>
  );
};
