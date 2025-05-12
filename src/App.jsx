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
import Unauthorized from "./pages/Unauthorized";

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
          {/* Dashboard - både Teamleder og Admin */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allowedRoles={["Admin", "Teamleder"]}>
                <DashBoardAdmin />
              </ProtectedRoute>
            }
          />
          {/* EditEmployee.jsx - kun Admin */}
          <Route
            path="/admin/edit/:id"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <EditEmployee />{" "}
              </ProtectedRoute>
            }
          />
          {/* EmployeeInfo.jsx - både Teamleder og Admin */}
          <Route path="/employee-info/:id" element={<EmployeeInfo />} />{" "}
          <Route
            path="/nav/:team"
            element={
              <ProtectedRoute allowedRoles={["Admin", "Teamleder"]}>
                <NavPages />
              </ProtectedRoute>
            }
          />
          {/* DashboardPages - både Teamleder og Admin */}
          <Route
            path="/dashboardlist/:filterKey"
            element={
              <ProtectedRoute allowedRoles={["Admin", "Teamleder"]}>
                <DashboardPages />
              </ProtectedRoute>
            }
          />
          {/* AdminPanel.jsx - kun Admin */}
          <Route
            path="/admin-dashboard/admin-panel"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <AdminPanel />
              </ProtectedRoute>
            }
          />
          {/* Register.jsx - kun Admin */}
          <Route
            path="/register"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <RegisterEmployee />
              </ProtectedRoute>
            }
          />
          {/* ManageTeams.jsx - kun Admin */}
          <Route
            path="/admin-dashboard/manage-team"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <ManageTeams />{" "}
              </ProtectedRoute>
            }
          />
          {/* ManageSystems.jsx - kun Admin */}
          <Route
            path="/admin-dashboard/manage-systems"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <ManageSystems />
              </ProtectedRoute>
            }
          />
            <Route path="/unauthorized" element={<Unauthorized />} />
        </Routes>
      </Router>
    </ErrorBoundry>
  );
}

export default App;
