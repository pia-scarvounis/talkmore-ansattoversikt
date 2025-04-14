// RedButton.jsx


// Brukes til knapper med rød border som "Avbryt", "Slett".

// Legg inn knappens tekst som prop: <RedButton text="Slett" />

// Styling hentes automatisk fra global.css: .button + .button-red

export default function RedButton({ text, onClick, className }) {
    return (
      <button className={`button button-red ${className}`} onClick={onClick}>
        {text}
      </button>
    );
  }
  
  