import React, { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { fetchMetaData } from "../../redux/slices/metaDataCrudsSlice";
import { logout } from "../../redux/slices/authLoginSlice/loginSlice";
import logo from "../../assets/images/tm-logo.png";
import "../../styles/nav.css";

const NavAdmin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // hente avdelinger og teams fra Redux
  const metaData = useSelector((state) => state.metaData);
const departments = metaData?.departments || [];
const teams = metaData?.teams || [];
console.log("Teams i navigasjonen:", teams);


  useEffect(() => {
    if (teams.length === 0 || departments.length === 0) {
      dispatch(fetchMetaData());
    }
  }, [dispatch, teams.length, departments.length]);
  
  
  const { user } = useSelector((state) => state.auth);
 

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
          {departments.map((dep) => {
            // hente teams som tilhører denne avdelingen
            const departmentTeams = teams.filter(team => team.department_name === dep.department_name);

            return (
              <div key={dep.department_id} className="section">
                {/* avdelingsnavn (Main link) */}
                <NavLink
                  to={`/nav/${dep.department_name.toLowerCase().replace(/\s+/g, "_")}`}
                  className="nav-link main-link"
                >
                  {dep.department_name}
                </NavLink>

                {/* teams under avdeling (Sub-links) */}
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

          {/* kun admin skal se dette */}
          
          {user?.role === "Admin" && (
            <div className="section">
              <NavLink to="/admin-dashboard/admin-panel" className="nav-link main-link">
                Administrasjonspanel
              </NavLink>
            </div>
          )}

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
