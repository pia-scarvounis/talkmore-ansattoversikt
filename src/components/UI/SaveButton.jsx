export default function SaveButton({ onClick, className }) {
    return (
      <button className={`button ${className}`} onClick={onClick}>
        Lagre
      </button>
    );
  }
  
  