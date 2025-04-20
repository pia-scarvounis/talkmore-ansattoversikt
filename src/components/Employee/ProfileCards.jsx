import React, { useEffect } from 'react';
//Redux
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmployees } from '../../redux/slices/employeeSlice';

//importere css for profilkort

import "../../styles/profilecards.css"
import profileImage from "../../assets/images/default-img.png"

const ProfileCards = () => {
    //Hente inn en ansatt
    //Sette inn betingelser for farge på kortene om det blir rosa/blå bakgrunn
    const dispatch = useDispatch();
    //henter ut employees data, loading og error fra redux store -> emplouyeeSlice ->
    const {data: employees, loading, error } = useSelector((state) => state.employees);

    //leverer instruks på å gjøre en fetch i employeeSlice
    useEffect(() =>{
        dispatch(fetchEmployees());
    }, [dispatch]);
    
    if (loading) return <p>Laster inn ansatte</p>;
    if (error) return <p> Feil: {error} </p>;

  return (
    <div>
    {employees.map((employee) =>(
            
    <div key ={employee.employee_id} className='profile-card'>
        {/**Tekstene under skal ha bakgrunn i sin egen div*/}
        <div className='background-color'>
            <div className='label-main'>
                <h3> {employee.name} </h3>
                <p> Ansattnr(Talkmore){employee.employeeNr_Talkmore} ansatt.jobNr</p>
                <p> Ansattnr(Telenor) {employee.employeeNr_Telenor} ansatt.jobNr</p>
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
        <p><span className='label-info'> Stilling </span> {employee.workPos_title}</p>
        <p><span className='label-info'> Fast/Innleid </span> {employee.form_of_employeement}</p>
        <p><span className='label-info'> Stilling% </span> {employee.employee_percentages}</p>        


    </div>
    ))}
    </div>
  );
}

export default ProfileCards
