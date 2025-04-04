import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import DashBoardAdmin from "./pages/DashBoardAdmin";
import ProfileCards from "./components/Employee/ProfileCards";
import ProfileCardLists from "./pages/ProfileCardLists";
import "./styles/global.css";

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<DashBoardAdmin />} />
        <Route path="/profilecards" element={<ProfileCards />} />
        <Route path="/profilecardlists" element={<ProfileCardLists />} />
      </Routes>
    </Router>
    
  );
}

export default App;
