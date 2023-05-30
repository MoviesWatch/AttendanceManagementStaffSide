import { Outlet } from "react-router-dom";
import { OptionsRenderer } from "../helpers/OptionsRenderer";
import { Navbar } from "./../components/Navbar";
import "./../styles/home.scss";

export const Home = () => {
  return (
    <>
      <Navbar
        username={JSON.parse(sessionStorage.getItem("faculty"))?.facultyID}
      />
      <section className="container">
        <OptionsRenderer page="home" />
        <Outlet />
      </section>
    </>
  );
};
