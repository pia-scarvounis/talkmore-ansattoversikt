import React, { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { logout } from "../../redux/slices/authLoginSlice/loginSlice";
import logo from "../../assets/images/tm-logo.png";
import "../../styles/nav.css";

const NavAdmin = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();


    // når user blir null (logget ut), send til login
    useEffect(() => {
      if (!user) {
        navigate("/");
      }
    }, [user, navigate]);
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
          <div className="section">
            <NavLink to="/nav/admin" className="nav-link main-link">
              Admin
            </NavLink>
            <NavLink
              to="/nav/performance_management"
              className="nav-link sub-link"
            >
              Performance Management
            </NavLink>
          </div>

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
            <NavLink to="/nav/cayman_island" className="nav-link sub-link">
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
          <div className="section">
            {user?.role === "Admin" && (
              <NavLink
                to="/admin-dashboard/admin-panel"
                className="nav-link main-link"
              >
                Administrasjonspanel
              </NavLink>
            )}{" "}
          </div>

          <div className="section">
          <div
    onClick={handleLogout}
    className="nav-link main-link"
  >
    Logg ut
  </div>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default NavAdmin;
