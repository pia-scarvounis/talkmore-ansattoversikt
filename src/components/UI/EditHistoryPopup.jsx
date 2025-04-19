import React from "react";
import GreenButton from "../UI/GreenButton";
import RedButton from "../UI/RedButton";
import "../../styles/popup.css";

/**
 * denne popupen vises når admin klikker på redigeringsikonet inne på en ansatt sin historikk på en ansatts sin profil. Innholdet inni popupen endrer seg automatisk basert på hva slags endring brukeren skal gjøre.
 *
 * Viktig: man legger inn riktig type der hvor du kaller på komponenten EditHistoryPopup, altså inne på ansatte sin profilside etter at redigerikonet er trykket på, der hvor du man vise popupen. Vi må sende inn en prop som heter `type`, og den MÅ være en av disse:
 * 
 * - "stilling"       → viser prosentvalg
 * - "permisjon"      → viser prosentvalg
 * - "ansattnummer"   → viser inputfelt for tall
 * - "team"           → viser team-dropdown
 * 
 * eksempel: 
 */

const EditHistoryPopup = ({ type, onClose }) => {
  const getTitle = () => {
    switch (type) {
      case "stilling":
        return "Rediger historikk for stillingsprosent";
      case "permisjon":
        return "Rediger historikk for permisjon";
      case "ansattnummer":
        return "Rediger historikk for ansattnummer (Telenor)";
      case "team":
        return "Rediger historikk for team";
      default:
        return "Rediger historikk";
    }
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-box" onClick={(e) => e.stopPropagation()}>
        <h2 className="popup-title">{getTitle()}</h2>

        {/* dato-feltene vises uansett hvilken type det er */}
        <label>Startdato</label>
        <input type="date" />

        <label>Sluttdato</label>
        <input type="date" />

        {/* hvis type er permisjon eller stilling → vis prosentvalg */}
        {type === "stilling" || type === "permisjon" ? (
          <>
            <label>Velg prosent</label>
            <select>
              <option value="">Velg prosent</option>
              {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((val) => (
                <option key={val} value={val}>{val}%</option>
              ))}
            </select>
          </>
        ) : null}

        {/* hvis type er team, vis team-liste */}
        {type === "team" && (
          <>
            <label>Velg nytt team</label>
            <select>
              {/* dette hentes fra database senere, la bare inn et par eks akkurat nå */}
              <option value="">Velg team</option>
              <option value="Brooklyn">Brooklyn</option>
              <option value="Havana">Havana</option>
              <option value="SpringField">Springfield</option>
            </select>
          </>
        )}

        {/* hvis type er ansattnummer: vise inputfelt */}
        {type === "ansattnummer" && (
          <>
            <label>Endre ansattnummer</label>
            <input type="text" placeholder="123456" />
          </>
        )}

        {/* knappene nederst */}
        <div className="popup-buttons">
          <GreenButton text="Lagre" onClick={() => console.log("Lagrer endring")} />
          <RedButton text="Avbryt" onClick={onClose} />
        </div>
      </div>
    </div>
  );
};

export default EditHistoryPopup;





