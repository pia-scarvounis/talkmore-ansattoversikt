import React, { useEffect, useState } from "react";
import ProfileCards from "../components/Employee/ProfileCards";
import NavAdmin from "../components/navigation/NavAdmin";
import PageHeader from "../components/UI/PageHeader";
import FilterOption from "../components/Employee/FilterOption";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployees } from "../redux/slices/employeeSlice";

const ProfileCardLists = () => {

  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState("");

  const {data: employees, loading, error } = useSelector((state) => state.employees);
  console.log("Employees fra Redux:", employees);

  useEffect(()=>{
    dispatch(fetchEmployees());
  },[dispatch]);


  return (
    <div>
      <div className="page-header-wrapper">
        <PageHeader
          title="Alle ansatte"
          showSearch={true}
          onSearch={setSearchTerm}
        />
      </div>
      <FilterOption />
      <div className="profilePages-container">
        <NavAdmin />

        <div className="profileList-container">
        {
          Array.isArray(employees)&&
          (<ProfileCards employees={employees} loading={loading} error={error} />)
        }
      
         
        </div>
      </div>
    </div>
  );
};

export default ProfileCardLists;
