// GreenButton.jsx


// Brukes til grønne knapper som "Lagre", "Legg til"
// Legg inn knappens tekst som prop: <GreenButton text="Lagre" />

// Styling hentes automatisk fra global.css: .button + .button-green


export default function GreenButton({ text, onClick, className }) {
    return (
      <button className={`button button-green ${className}`} onClick={onClick}>
        {text}
      </button>
    );
  }
  
  