import React from 'react'
import "../styles/global.css"
//importere css for profilkort
import profileImage from "../assets/images/default-img.png"

const ProfileCards = () => {
    //Hente inn en ansatt
    //Sette inn betingelser for farge på kortene om det blir rosa/blå bakgrunn
  return (
    <div>
      <h1> HEI DETTE ER TEST Test</h1>

        <p>Fornavn Etternavn</p>
        <p>Ansattnr(Talkmore) </p>
        <p>Ansattnr(Telenor)</p>
        
        //Profilbilde
        <div>
            <img src={profileImage} alt="Profilbilde Ansatt"></img>
        </div>
        //Ansatt info
        <p><span>Stilling :</span>ansatt.stilling</p>
        <p><span>Fast/Innleid :</span>ansatt.Fast/Innleid</p>
        <p><span>Stilling% :</span>ansatt.stilling%</p>        


    </div>
  );
}

export default ProfileCards
