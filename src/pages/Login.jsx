import '../styles/login.css';
import logo from '../assets/images/tm-logo.png';

// hente useState fra React for å kunne lagre og oppdatere input-verdiene.
import { useState } from 'react';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    //  denne funksjonen kjører når bruker klikker "Logg inn"-knappen
  const handleLogin = (e) => {
    e.preventDefault(); // siden reloades ikke

    // !!! vi må bytte ut api-kall med ekte API-kall.!!! 
    fetch('https://api.eksempel.com/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }, // forteller apiet at vi sender JSON
      body: JSON.stringify({ email, password }) //  sender inn e-post og passord fra skjemaet
    })
      .then((res) => res.json())
      .then((data) => {
        // når apiet svarer, vises dataen i konsollen (for testing).
        console.log('Login response:', data);
        // her legger vi til logiikk senere, som å lagre token eller sende brukeren videre osv... 
      })
      .catch((err) => {
        // hvis det skjer en feil (eks, feil passord eller ingen kontakt med api..), vises det her.
        console.error('Login error:', err);
      });
  }; // !!! vi må bytte ut api-kall med ekte API-kall.!!!

  return (
    <div
      className="login-page"
    >
        <img src={logo} alt="Talkmore Logo" className="logo" />

        <div className="login-content">
        <div className="login-box">
          <h1 className="login-headline">Ansattoversikt</h1>
          
          <h2 className="login-title">Logg inn</h2>

          {/* skjemaet bruker handleLogin når man trykker på "Logg inn" */}
          <form onSubmit={handleLogin}>
            {/* felt for e-post */}
            <label htmlFor="email">E-post</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Skriv inn e-post"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {/* felt for passord */}
            <label htmlFor="password">Passord</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Skriv inn passord"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {/* glemt passord */}
            <div className="forgot-password">
              <a href="#">Glemt passord?</a>
            </div>

            {/* login-knapp nederst */}
            <div className="login-button">
              <button type="submit" className="button button-green">Logg inn</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}


export default Login;
