import React from "react";
import defaultImg from "../../assets/images/default-img.png";
import "../../styles/EmployeeInfo.css";

const EmployeeDetail = () => {
  return (
    <div className="employee-detail-container">
      <div className="employee-detail-card">
        {/* Venstre seksjon */}
        <div className="employee-info">
          <div className="employee-info-inner">
            <div className="employee-info-text">
              <strong>Fornavn Etternavn</strong>
              <p>Ansattnr (Talkmore): xxxxxxxx</p>
              <p>Ansattnr (Innleid): xxxxxxxx</p>
            </div>

            <img src={defaultImg} alt="Profilbilde" className="employee-img" />

            <p>Fødselsdato: 01.01.2025</p>
            <p>Telefon: +47 902 22 222</p>
            <p>E-post: test@talkmore.no</p>
            <p>E-post: test@talkmore.no</p>
          </div>
        </div>

        {/* Midtseksjon */}
        <div className="employee-position-info">
          <div className="employee-position-inner">
            <h4>Stillinginformasjon</h4>
            <p>
              <strong>Startdato:</strong> 20.02.14
            </p>
            <p>
              <strong>Sluttdato:</strong> 31.12.25
            </p>
            <p>
              <strong>Fast/Inleid:</strong> Fast
            </p>
            <p>
              <strong>Stilling:</strong> Kundeagent
            </p>
            <p>
              <strong>Team:</strong> Havanna
            </p>
            <p>
              <strong>Avd.:</strong> Privat
            </p>
            <p>
              <strong>Stillingsprosent:</strong> 100 %
            </p>
            <p>
              <strong>Permisjon:</strong> 0%
            </p>
          </div>
        </div>

        {/* Høyre seksjon */}
        <div className="employee-emergency-access">
          <div className="employee-emergency-inner">
            <h4>Nærmeste pårørende</h4>
            <p>
              <strong>Navn:</strong> Fornavn Etternavn
            </p>
            <p>
              <strong>Telefon:</strong> +47 902 22 222
            </p>

            <h4>Tilganger</h4>
            <div className="access-checkboxes">
              <label>
                <input type="checkbox" />
                Eks 3
              </label>
              <label>
                <input type="checkbox" />
                Word
              </label>
              <label>
                <input type="checkbox" />
                Eks 2
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetail;
