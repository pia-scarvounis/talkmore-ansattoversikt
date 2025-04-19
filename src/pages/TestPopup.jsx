// denne siden er bare en test for alertbox og popups! skal slettes :))))) 

import React, { useState } from "react";
import EditHistoryPopup from "../components/UI/EditHistoryPopup";
import AlertBox from "../components/UI/AlertBox";
import WhiteButton from "../components/UI/WhiteButton";
import RedButton from "../components/UI/RedButton";

const TestPopup = () => {
  const [popupType, setPopupType] = useState(null);
  const [showAlert, setShowAlert] = useState(false);

  return (
    <div style={{ padding: "100px" }}>
      <h1>Test Popup-siden</h1>

      <button onClick={() => setPopupType("stilling")}>Rediger stillingsprosent</button>
      <button onClick={() => setPopupType("permisjon")}>Rediger permisjon</button>
      <button onClick={() => setPopupType("ansattnummer")}>Rediger ansattnummer</button>
      <button onClick={() => setPopupType("team")}>Rediger team</button>

      <br /><br />
      <button onClick={() => setShowAlert(true)}>Vis AlertBox</button>

      {popupType && (
        <EditHistoryPopup
          type={popupType}
          onClose={() => setPopupType(null)}
        />
      )}

      {showAlert && (
        <AlertBox
          type="confirmation"
          title="Er du sikker?"
          message="Denne handlingen kan ikke angres."
          onClose={() => setShowAlert(false)}
        >
          <WhiteButton text="Fortsett" onClick={() => console.log("Fortsetter")} />
          <RedButton text="Avbryt" onClick={() => setShowAlert(false)} />
        </AlertBox>
      )}
    </div>
  );
};

export default TestPopup;

