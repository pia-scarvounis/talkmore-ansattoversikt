import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import DashBoardAdmin from "./pages/DashBoardAdmin";
import DashboardReadOnly from "./pages/DashboardReadOnly";
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
        <Route path="/admin-dashboard" element={<DashBoardAdmin />} />
        <Route path="/readonly-dashboard" element={<DashboardReadOnly />} />
        <Route path="/profilecards" element={<ProfileCards />} />
        <Route path="/profilecardlists" element={<ProfileCardLists />} />
        <Route path="/register" element={<RegisterEmployee />} />
        <Route path="/edit" element={<EditEmployee />} />

      </Routes>
    </Router>
  );
}

export default App;
