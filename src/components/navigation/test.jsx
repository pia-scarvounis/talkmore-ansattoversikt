import React, { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/authLoginSlice/loginSlice";
import logo from "../../assets/images/tm-logo.png";
import "../../styles/nav.css";

const NavAdmin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  // 🚀 Hente dynamisk avdelinger (departments) og teams fra Redux
  const { departments, teams } = useSelector((state) => state.metaData);

  // 🚨 Hvis bruker ikke er innlogget, naviger til login
  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Logg ut funksjon
  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="sidebar">
      <div className="sidebar-content">
        <div className="logo-container">
          <img src={logo} alt="Talkmore logo" className="logo" />
        </div>

        <nav className="nav">
          {/* ---------------------- */}
          {/* 📌 SYSTEM-SIDER (fast) */}
          {/* ---------------------- */}
          <div className="section">
            <NavLink to="/admin-dashboard" className="nav-link main-link">
              Dashboard
            </NavLink>
          </div>

          <div className="section">
            <NavLink to="/nav/alleansatte" className="nav-link main-link">
              Alle Ansatte
            </NavLink>
          </div>

          {/* ----------------------------- */}
          {/* 📌 DYNAMISKE AVDELINGER + TEAMS */}
          {/* ----------------------------- */}
          {departments.map((dep) => {
            // Hente teams som tilhører denne avdelingen
            const departmentTeams = teams.filter(team => team.department_name === dep.department_name);

            return (
              <div key={dep.department_id} className="section">
                {/* Avdelingsnavn (Main link) */}
                <NavLink
                  to={`/nav/${dep.department_name.toLowerCase().replace(/\s+/g, "_")}`}
                  className="nav-link main-link"
                >
                  {dep.department_name}
                </NavLink>

                {/* Teams under avdeling (Sub-links) */}
                {departmentTeams.map((team) => (
                  <NavLink
                    key={team.team_id}
                    to={`/nav/${team.team_name.toLowerCase().replace(/\s+/g, "_")}`}
                    className="nav-link sub-link"
                  >
                    {team.team_name}
                  </NavLink>
                ))}
              </div>
            );
          })}

          {/* ------------------------- */}
          {/* 📌 ADMIN PANEL (kun Admin) */}
          {/* ------------------------- */}
          {user?.role === "Admin" && (
            <div className="section">
              <NavLink to="/admin-dashboard/admin-panel" className="nav-link main-link">
                Administrasjonspanel
              </NavLink>
            </div>
          )}

          {/* ---------------- */}
          {/* 📌 LOGG UT KNAPP */}
          {/* ---------------- */}
          <div className="section">
            <div onClick={handleLogout} className="nav-link main-link">
              Logg ut
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default NavAdmin;



