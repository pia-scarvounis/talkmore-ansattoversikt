import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployees } from "../redux/slices/employeeSlice";
import NavAdmin from "../components/navigation/NavAdmin";
import PageHeader from "../components/UI/PageHeader";
import GreenButton from "../components/UI/GreenButton";
import RedButton from "../components/UI/RedButton";
import WhiteButton from "../components/UI/WhiteButton";
import AlertBox from "../components/UI/AlertBox";
import "../styles/form.css";
import "../styles/manageSystems.css";

const ManageSystems = () => {
  const dispatch = useDispatch();
  const { data: employees, loading } = useSelector((state) => state.employees);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [newSystemName, setNewSystemName] = useState("");
  const [systems, setSystems] = useState([
    "CRM System",
    "Ticket System",
    "Email System",
  ]);
  const [showSaveAlert, setShowSaveAlert] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [saveType, setSaveType] = useState("");

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredEmployees([]);
    } else {
      const results = employees.filter((emp) =>
        emp.employee_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredEmployees(results);
    }
  }, [searchTerm, employees]);

  const handleSave = (type) => {
    setSaveType(type);
    setShowSaveAlert(true);
  };

  const handleDelete = () => setShowDeleteAlert(true);

  const handleSelectEmployee = (name) => {
    setSelectedEmployee(name);
    setSearchTerm("");
    setFilteredEmployees([]);
  };

  return (
    <div className="form-page">
      <NavAdmin />
      <div className="form-content page-header-wrapper">
        <PageHeader title="Administrer systemer" />

        <div className="form-section access-box">
          <h2 className="section-heading">Legg til ny tilgang</h2>
          <div className="form-rows">
            <div className="row">
              <div className="column">
                <label>Velg Ansatt</label>
                <input
                  type="text"
                  placeholder="Skriv inn ansattnavn"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />

                {/* Viser søkeresultater hvis det er søk */}
                {searchTerm && (
                  <div className="employee-search-results">
                    {filteredEmployees.map((emp) => (
                      <div
                        key={emp.employee_id}
                        className="search-result-item"
                        onClick={() => handleSelectEmployee(emp.employee_name)}
                      >
                        {emp.employee_name}
                      </div>
                    ))}
                  </div>
                )}

                {/* Viser valgt ansatt */}
                {selectedEmployee && (
                  <p className="selected-employee">
                    Valgt ansatt: {selectedEmployee}
                  </p>
                )}
              </div>
              <div className="column">
                <label>Skriv inn systemnavn</label>
                <input
                  type="text"
                  placeholder="F.eks. CRM System"
                  value={newSystemName}
                  onChange={(e) => setNewSystemName(e.target.value)}
                />
              </div>
            </div>

            <div className="button-row">
              <GreenButton
                text="Legg til"
                onClick={() => handleSave("leggtil")}
              />
            </div>
          </div>
        </div>

        {/* Eksisterende Tilganger */}
        <div className="form-section access-box">
          <h2 className="section-heading">Eksisterende Tilganger</h2>
          <div className="access-list">
            {systems.map((system, index) => (
              <div key={index} className="access-item">
                <span>{system}</span>
                <RedButton text="Slett" onClick={handleDelete} />
              </div>
            ))}
          </div>
        </div>

        {/* ALERTS */}
        {showSaveAlert && (
          <AlertBox
            type="confirmation"
            title="Bekreft opprettelse"
            message="Er du sikker på at du ønsker å legge til denne tilgangen?"
          >
            <WhiteButton
              text="Fortsett"
              onClick={() => setShowSaveAlert(false)}
            />
            <RedButton text="Avbryt" onClick={() => setShowSaveAlert(false)} />
          </AlertBox>
        )}

        {showDeleteAlert && (
          <AlertBox
            type="confirmation"
            title="Bekreft sletting"
            message="Er du sikker på at du ønsker å slette denne tilgangen?"
          >
            <WhiteButton
              text="Fortsett"
              onClick={() => setShowDeleteAlert(false)}
            />
            <RedButton
              text="Avbryt"
              onClick={() => setShowDeleteAlert(false)}
            />
          </AlertBox>
        )}
      </div>
    </div>
  );
};

export default ManageSystems;
