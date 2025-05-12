import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchMetaData } from "./redux/slices/metaDataCrudsSlice";

import Login from "./pages/Login";
import DashBoardAdmin from "./pages/DashboardAdmin";
import ProfileCards from "./components/Employee/ProfileCards";
import EditEmployee from "./pages/EditEmployee";
import EmployeeInfo from "./pages/EmployeeInfo";
import NavPages from "./pages/NavPages";
import DashboardPages from "./pages/DashboardPages";
import AdminPanel from "./pages/AdminPanel"; 
import ManageSystems from "./pages/ManageSystems";
import ManageTeams from "./pages/ManageTeams";
import RegisterEmployee from "./pages/RegisterEmployee";

import ErrorBoundry from "./ErrorBoundry";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";


import "./styles/global.css";
import "./styles/buttons.css";
import "./styles/alert.css";


function App() {
  const dispatch = useDispatch();

  // hENT METADATA NÅR APPEN STARTER
  useEffect(() => {
    dispatch(fetchMetaData());
  }, [dispatch]);
  return (
    <ErrorBoundry>
      <Router>
        <Routes>
          {/* Login-side */}
          <Route path="/" element={<Login />} />
          {/* Dashboard for både Admin og Teamleder */}
          <Route path="/admin-dashboard" element={<ProtectedRoute allowedRoles={['Admin', 'ReadOnly']}><DashBoardAdmin /></ProtectedRoute>} />

          <Route path="/register" element={<RegisterEmployee />} />
          <Route path="/admin/edit/:id" element={<EditEmployee />} />
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
          <Route path="/admin-dashboard/admin-panel" element={<AdminPanel />} />
          <Route path="/admin-dashboard/manage-systems" element={<ManageSystems />} />

        </Routes>
      </Router>
    </ErrorBoundry>
  );
}

export default App;
