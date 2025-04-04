import React from 'react'
import "../../styles/global.css"
//importere css for profilkort

import "../../styles/profilecards.css"

import profileImage from "../../assets/images/default-img.png"

const ProfileCards = () => {
    //Hente inn en ansatt
    //Sette inn betingelser for farge på kortene om det blir rosa/blå bakgrunn
  return (
    <div className='profile-card'>
        {/**Tekstene under skal ha bakgrunn i sin egen div*/}
        <div className='background-color'>
            <div className='label-main'>
                <h3> Fornavn Etternavn</h3>
                <p> Ansattnr(Talkmore) ansatt.jobNr</p>
                <p> Ansattnr(Telenor)  ansatt.jobNr</p>
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
        <p><span className='label-info'> Stilling </span> ansatt.stilling</p>
        <p><span className='label-info'> Fast/Innleid </span> ansatt.Fast/Innleid</p>
        <p><span className='label-info'> Stilling% </span> ansatt.stilling%</p>        


    </div>
  );
}

export default ProfileCards
