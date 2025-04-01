import React from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/images/tm-logo.png";
import "../styles/global.css";
import "../styles/nav.css";

const NavAdmin = () => {
  return (
    <div className="sidebar">
      <div className="logo-container">
        <img src={logo} alt="Talkmore logo" />
      </div>

      <nav className="nav">
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/ansatte">Alle Ansatte</NavLink>

        <div className="section">
          <h4>Privat</h4>
          <NavLink to="/privat/brooklyn">Brooklyn</NavLink>
          <NavLink to="/privat/havanna">Havanna</NavLink>
          <NavLink to="/privat/casablanca">Casablanca</NavLink>
          <NavLink to="/privat/springfield">Springfield</NavLink>
        </div>

        <div className="section">
          <h4>Bedrift</h4>
          <NavLink to="/bedrift/cayman">Cayman Island</NavLink>
        </div>

        <div className="section">
          <h4>2. linje</h4>
          <NavLink to="/linje/olympia">Olympia</NavLink>
        </div>

        <NavLink to="/registrer">Registrer ansatt</NavLink>
        <NavLink to="/logout">Logg ut</NavLink>
      </nav>
    </div>
  );
};

export default NavAdmin;
