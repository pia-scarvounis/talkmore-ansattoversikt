import React from "react";
import { NavLink } from "react-router-dom";
import logo from "../../assets/images/tm-logo.png";
import "../../styles/nav.css";

const NavAdmin = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-content">
      <div className="logo-container">
        <img src={logo} alt="Talkmore logo" className="logo" />
      </div>

      <nav className="nav">
        <div className="section">
        <NavLink to="/admin-dashboard" className="nav-link main-link">
          Dashboard
        </NavLink></div>
        <div className="section">
        <NavLink to="/nav/alleansatte" className="nav-link main-link">
          Alle Ansatte
        </NavLink></div>
        <div className="section">
        <NavLink to="/nav/admin" className="nav-link main-link">
          Admin
        </NavLink>
        <NavLink to="/nav/performancemanagement" className="nav-link sub-link">
            Performance Management
          </NavLink></div>

        <div className="section">
          <NavLink to="/nav/privat" className="nav-link main-link">
            Privat
          </NavLink>
          <NavLink to="/nav/brooklyn" className="nav-link sub-link">
            Brooklyn
          </NavLink>
          <NavLink to="/nav/havana" className="nav-link sub-link">
            Havana
          </NavLink>
          <NavLink to="/nav/casablanca" className="nav-link sub-link">
            Casablanca
          </NavLink>
          <NavLink to="/nav/springfield" className="nav-link sub-link">
            Springfield
          </NavLink>
        </div>

        <div className="section">
          <NavLink to="/nav/bedrift" className="nav-link main-link">
            {" "}
            Bedrift
          </NavLink>
          <NavLink to="/nav/caymanisland" className="nav-link sub-link">
            Cayman Island{" "}
          </NavLink>
        </div>

        <div className="section">
          <NavLink to="/nav/2.Linje" className="nav-link main-link">
            {" "}
            2. linje
          </NavLink>
          <NavLink to="/nav/olympia" className="nav-link sub-link">
            Olympia
          </NavLink>
        </div>

        <NavLink to="/admin-dashboard/admin-panel" className="nav-link main-link">
  Administrasjonspanel
</NavLink>

        <div className="section">
          <NavLink to="logout" className="nav-link main-link">
            Logg ut
          </NavLink>
        </div>
      </nav>
      </div>
    </div>
  );
};

export default NavAdmin;
