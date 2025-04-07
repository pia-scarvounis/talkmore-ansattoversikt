import React from "react";
import { NavLink } from "react-router-dom";
import logo from "../../assets/images/tm-logo.png";
import "../../styles/global.css";
import "../../styles/nav.css";

const NavAdmin = () => {
  return (
    <div className="sidebar">
      <div className="logo-container">
        <img src={logo} alt="Talkmore logo" className="logo" />
      </div>

      <nav className="nav">
        <NavLink to="/dashboard" className="nav-link main-link">
          Dashboard
        </NavLink>
        <NavLink to="/profilecardlists" className="nav-link main-link">
          Alle Ansatte
        </NavLink>

        <div className="section">
          <NavLink to="Privat" className="nav-link main-link">
            Privat
          </NavLink>
          <NavLink to="/privat/brooklyn" className="nav-link sub-link">
            Brooklyn
          </NavLink>
          <NavLink to="/privat/havana" className="nav-link sub-link">
            Havana
          </NavLink>
          <NavLink to="/privat/casablanca" className="nav-link sub-link">
            Casablanca
          </NavLink>
          <NavLink to="/privat/springfield" className="nav-link sub-link">
            Springfield
          </NavLink>
        </div>

        <div className="section">
          <NavLink to="Bedrift" className="nav-link main-link">
            {" "}
            Bedrift
          </NavLink>
          <NavLink to="/bedrift/cayman" className="nav-link sub-link">
            Cayman Island{" "}
          </NavLink>
        </div>

        <div className="section">
          <NavLink to="2.Linje" className="nav-link main-link">
            {" "}
            2. linje
          </NavLink>
          <NavLink to="/linje/olympia" className="nav-link sub-link">
            Olympia
          </NavLink>
        </div>

        <div className="section">
          <NavLink to="Administrer Team" className="nav-link main-link">
            {" "}
            Administrer team
          </NavLink>
        </div>

        <div className="section">
          <NavLink to="/register" className="nav-link main-link">
            Registrer ansatt
          </NavLink>
        </div>
        <div className="section">
          <NavLink to="logout" className="nav-link main-link">
            Logg ut
          </NavLink>
        </div>
      </nav>
    </div>
  );
};

export default NavAdmin;
