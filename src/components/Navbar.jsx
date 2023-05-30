import "./../styles/navbar.scss";
import { Profile } from "./Profile";
import { Brand } from "./Brand";
export const Navbar = ({ username }) => {
  return (
    <nav className="navbar">
      <Brand />
      <Profile username={username} />
    </nav>
  );
};
