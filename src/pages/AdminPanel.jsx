import React from "react";
import { useNavigate } from "react-router-dom";
import NavAdmin from "../components/navigation/NavAdmin";
import PageHeader from "../components/UI/PageHeader";
import "../styles/adminpanel.css"; 

const AdminPanel = () => {
  const navigate = useNavigate();

  return (
    <div className="form-page">
      <NavAdmin />
      <div className="form-content page-header-wrapper">
        <PageHeader title="Administrasjonspanel" />
        
        <div className="admin-panel-options">
          <div className="admin-option" onClick={() => navigate("/register")}>
            Registrer ansatt
          </div>
          <div className="admin-option" onClick={() => navigate("/admin-dashboard/manage-team")}>
            Administrer team
          </div>
          <div className="admin-option" onClick={() => navigate("/admin-dashboard/manage-systems")}>
            Administrer systemer
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
