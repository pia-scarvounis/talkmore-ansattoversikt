export default function AlertBox({ type, title, message, children }) {
    return (
      <div className="popup-overlay">
      <div className={`alert-box ${type}`}>
        {title && <h3 className="alert-title">{title}</h3>}
        {message && <p className="alert-message">{message}</p>}
        {children && <div className="alert-buttons">{children}</div>}
      </div></div>
    );
  }
  
  /* hvis vi trenger knapper i alertboksene legges de til sånn: */
  
  /* AlertBox
  type="confirmation"
  title=""
  message="Er du sikker på dette valget?"
>
  <WhiteButton text="Fortsett" onClick={() => console.log("Fortsetter")} />
  <RedButton text="Avbryt" onClick={() => console.log("Avbryter")} />
</Alert */