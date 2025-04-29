import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import EmployeeDetail from "../components/Employee/EmployeeDetail";
import NavAdmin from "../components/navigation/NavAdmin";
import PageHeader from "../components/UI/PageHeader";
import WhiteButton from "../components/UI/WhiteButton";
import Notes from "../components/Employee/Notes";
import "../styles/EmployeeInfo.css";

const EmployeeInfo = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const employeeId = parseInt(id, 10);
  return (
    <div className="employee-info-page">
      <NavAdmin />
      <div className="page-header-wrapper">
        <PageHeader title="Ansattinformasjon" />
      </div>
      <div className="page-wrapper">
        <EmployeeDetail employeeId={employeeId}/>
        <div className="employee-info-button-wrapper">
          <WhiteButton text="Rediger" onClick={() => navigate(`/edit/${employeeId}`)} />
        </div>

        <div className="employee-info-notes-wrapper">
          <Notes employeeId={employeeId} />
        </div>
      </div>
    </div>
  );
};

export default EmployeeInfo;
