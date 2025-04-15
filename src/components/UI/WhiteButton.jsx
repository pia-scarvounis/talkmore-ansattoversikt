// WhiteButton.jsx

// Bruker til hvite knapper med grønn border, som "fortsett", "last inn flere" og "rediger"

// Styling hentes automatisk fra global.css: .button + .button-white

export default function WhiteButton({ text, onClick, className }) {
    return (
      <button className={`button button-white ${className}`} onClick={onClick}>
        {text}
      </button>
    );
  }
  