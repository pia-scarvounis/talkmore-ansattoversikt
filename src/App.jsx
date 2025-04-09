import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import DashBoardAdmin from "./pages/DashBoardAdmin";
import ProfileCards from "./components/Employee/ProfileCards";
import ProfileCardLists from "./pages/ProfileCardLists";
import RegisterEmployee from "./pages/RegisterEmployee";
import EditEmployee from "./pages/EditEmployee";

import "./styles/global.css";

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<DashBoardAdmin />} />
        <Route path="/profilecards" element={<ProfileCards />} />
        <Route path="/profilecardlists" element={<ProfileCardLists />} />
        <Route path="/register" element={<RegisterEmployee />} />
        <Route path="/edit" element={<EditEmployee />} />

      </Routes>
    </Router>
  );
}

export default App;
