import { useNavigate } from "react-router-dom";
import "./../styles/profile.scss";
export const Profile = ({ username }) => {
  const navigate = useNavigate();
  const logoutHandler = () => {
    sessionStorage.clear();
    navigate("/login");
  };
  return (
    <div className="profile">
      <p className="username">{username}</p>
      <button className="inverted" onClick={logoutHandler}>
        Logout
      </button>
    </div>
  );
};
