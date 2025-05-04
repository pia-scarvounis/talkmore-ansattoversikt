import { loginUser } from "../redux/slices/authLoginSlice/loginSlice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import "../styles/login.css";
import logo from "../assets/images/tm-logo.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //  denne funksjonen kjører når bruker klikker "Logg inn"-knappen
  const handleLogin = (e) => {
    e.preventDefault(); // siden reloades ikke

    dispatch(loginUser({ username: email, password }))
      .unwrap()
      .then(() => {
        // login ok - gå til dashboard
        navigate("/admin-dashboard");
      })
      .catch((err) => {
        console.error("Login error:", err);
        setErrorMessage("E-post eller passord er feil");
      });
  };

  return (
    <div className="login-page">
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

            <p className="error-message">
              {errorMessage ? errorMessage : "\u00A0"}{" "}
              {/*"\u00A0" =  en non-breaking space - gjør sånn at boksen ikke "hopper" hvis noen har fylt inn feil brukernavn el passord */}
            </p>

            {/* login-knapp nederst */}
            <div className="login-button">
              <button type="submit" className="button button-green">
                Logg inn
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
