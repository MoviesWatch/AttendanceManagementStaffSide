import "./../styles/brand.scss";
import logo from "./../assets/accet_logo.svg";

export const Brand = () => {
  return (
    <div className="brand">
      <img src={logo} />
      <h2>ACGCET</h2>
    </div>
  );
};
