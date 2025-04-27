import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmployees } from '../../redux/slices/employeeSlice';
import "../../styles/profilecards.css"
import profileImage from "../../assets/images/default-img.png"

const ProfileCards = ({ employees, loading, error }) => {
    if (!Array.isArray(employees)) return <p>Ingen ansatte å vise</p>;

    if (loading) return <p>Laster inn ansatte...</p>;
    if (error) return <p>Feil: {error}</p>;
  return (
    <>
    {employees.map((employee) =>(
            
    <div key ={employee.employee_id} className={`profile-card ${
        employee.workPosistion_title === "Admin" || employee.workPosistion_title === "Teamleder"
          ? "pink-border"
          : "blue-border"
      }`}
    >
      <div className={`background-color ${
  employee.workPosistion_title === "Admin" || employee.workPosistion_title === "Teamleder"
    ? "pink-bg"
    : "blue-bg"
}`}>
     <div className="label-main">
      <h3>{employee.employee_name ||employee.name}</h3>
      <p>Ansattnr (Talkmore): {employee.employeeNr_Talkmore}</p>
      <p>Ansattnr (Telenor): {employee.employeeNr_Telenor}</p>
    </div>
        </div> 
        
        {/**Profilbilde*/}
        <div className='profile-img-container'>
            <img 
                src={profileImage} 
                alt="Profilbilde Ansatt"
                className='profile-img'
            />
        </div>

        {/**Ansatt/jobb informasjon*/}
        <p><span className='label-info'> Stilling </span> {employee.workPosistion_title}</p>
        <p><span className='label-info'> Fast/Innleid </span> {employee.form_of_employeement}</p>
        <p><span className='label-info'> Stilling% </span> {employee.employee_percentages}</p>        


    </div>
    ))}
    </>
  );
}

export default ProfileCards;
