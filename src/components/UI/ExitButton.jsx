export default function ExitButton({ onClick, className }) {
    return (
      <button className={`button ${className}`} onClick={onClick}>
        Avbryt
      </button>
    );
  }
  
  