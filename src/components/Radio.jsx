import "./../styles/input.scss";
export const Radio = ({ layoutType, labelsAndValues, name, title, error }) => {
  return (
    <div className="radio input-container ">
      {title && <p>{title}</p>}
      {labelsAndValues.map((item) => (
        <label className={layoutType}>
          <input
            type="radio"
            value={item.value}
            name={name}
            className="input"
          />
          {item.label}
        </label>
      ))}
      {error && <small className="error">{error}</small>}
    </div>
  );
};
