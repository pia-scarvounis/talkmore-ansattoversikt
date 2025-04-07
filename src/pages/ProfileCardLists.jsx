import React from 'react'
import ProfileCards from '../components/Employee/ProfileCards'
import NavAdmin from "../components/navigation/NavAdmin"
import FilterOption from '../components/Employee/FilterOption'
import "../styles/global.css"

const ProfileCardLists = () => {
  return (
    <div>
         <FilterOption/>
    <div className='pageContent-text'>
            <h1>Alle ansatte (eksempel) </h1>
        </div>
    <div className='profilePages-container'>
         
        <NavAdmin/>

       
        <div className='profileList-container'>
        {/**Lager en liste med 10 profilekort fra komponentet */}
        {Array(10).fill(null).map((_, index) => (
            <ProfileCards></ProfileCards>
        ))}
        </div>
    </div>
    </div>
  )
}

export default ProfileCardLists;
