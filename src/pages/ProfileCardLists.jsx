import React from 'react'
import ProfileCards from '../components/Employee/ProfileCards'
import NavAdmin from "../components/navigation/NavAdmin"
import PageHeader from "../components/UI/PageHeader";
import FilterOption from '../components/Employee/FilterOption'

const ProfileCardLists = () => {
  return (
    <div>     
       <div className="page-header-wrapper">
        <PageHeader title="Alle ansatte" />
      </div>
    <FilterOption/>
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
