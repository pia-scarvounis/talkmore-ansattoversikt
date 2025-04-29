import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import DashBoardAdmin from "./pages/DashboardAdmin";
import DashboardReadOnly from "./pages/DashboardReadOnly";
import ProfileCards from "./components/Employee/ProfileCards";
import ProfileCardLists from "./pages/ProfileCardLists";
import RegisterEmployee from "./pages/RegisterEmployee";
import EditEmployee from "./pages/EditEmployee";
import ManageTeams from "./pages/ManageTeams";
import EmployeeInfo from "./pages/EmployeeInfo";
import NavPages from "./pages/NavPages";
import DashboardPages from "./pages/DashboardPages";

import ErrorBoundry from "./ErrorBoundry";

import "./styles/global.css";
import "./styles/buttons.css";
import "./styles/alert.css";

function App() {
  return (
    <ErrorBoundry>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/admin-dashboard" element={<DashBoardAdmin />} />
          <Route path="/readonly-dashboard" element={<DashboardReadOnly />} />
          <Route path="/profilecards" element={<ProfileCards />} />
          <Route path="/profilecardlists" element={<ProfileCardLists />} />
          <Route path="/register" element={<RegisterEmployee />} />
          <Route path="/edit/:id" element={<EditEmployee />} />
          <Route
            path="/admin-dashboard/manage-team"
            element={<ManageTeams />}
          />
          <Route path="/employee-info/:id" element={<EmployeeInfo />} />{" "}
          <Route path="/nav/:team" element={<NavPages />} />
          <Route
            path="/dashboardlist/:filterKey"
            element={<DashboardPages />}
          />
        </Routes>
      </Router>
    </ErrorBoundry>
  );
}

export default App;
