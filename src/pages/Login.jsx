import '../styles/global.css';
import '../styles/login.css';
import logo from '../assets/images/tm-logo.png';
import background from '../assets/images/login-background.png';

function Login() {
  return (
    <div
      className="login-page"
      style={{ backgroundImage: `url(${background})` }}
    >
        <img src={logo} alt="Talkmore Logo" className="logo" />

        <div className="login-content">
          <h1 className="login-headline">EmployeeMore</h1>
          <button className="login-button">Logg inn</button>
        </div>
      </div>
  );
}

export default Login;
