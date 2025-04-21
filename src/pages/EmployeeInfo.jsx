import React from "react";
import { useNavigate } from "react-router-dom";
import EmployeeDetail from "../components/Employee/EmployeeDetail";
import NavAdmin from "../components/navigation/NavAdmin";
import PageHeader from "../components/UI/PageHeader";
import WhiteButton from "../components/UI/WhiteButton";
import Notes from "../components/Employee/Notes";
import "../styles/EmployeeInfo.css";

const EmployeeInfo = () => {
  const navigate = useNavigate();
  return (
    <div className="employee-info-page">
      <NavAdmin />
      <div className="page-header-wrapper">
        <PageHeader title="Ansattinformasjon" />
      </div>
      <div className="page-wrapper">
        <EmployeeDetail />
        <div className="employee-info-button-wrapper">
          <WhiteButton text="Rediger" onClick={() => navigate("/edit")} />
        </div>

        <div className="employee-info-notes-wrapper">
          <Notes />
        </div>
      </div>
    </div>
  );
};

export default EmployeeInfo;
