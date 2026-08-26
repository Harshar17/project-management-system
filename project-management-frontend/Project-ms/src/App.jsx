import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import Tasks from "./pages/Tasks";
import Timesheets from "./pages/Timesheets";
import ManagerTimesheets from "./pages/manager/ManagerTimesheets";
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import ManagerProjects from "./pages/manager/ManagerProjects";
import ManagerTasks from "./pages/manager/ManagerTasks";
import Notifications from "./pages/Notifications";
import ManagementDashboard from "./pages/management/ManagementDashboard";
import Register from "./pages/Register";
import ManagementProjects from "./pages/management/ManagementProjects";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Login */}
        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        {/* Employee Dashboard */}
        <Route path="/employee/dashboard" element={<EmployeeDashboard />} />

        {/* Employee Projects */}
        <Route path="/projects" element={<Projects />} />

        <Route path="/projects/:id" element={<ProjectDetails />} />

        {/* Employee Tasks */}
        <Route path="/tasks" element={<Tasks />} />

        {/* Employee Timesheets */}
        <Route path="/timesheets" element={<Timesheets />} />

        {/* Manager Dashboard */}
        <Route path="/manager/dashboard" element={<ManagerDashboard />} />

        {/* Manager Timesheets */}
        <Route path="/manager/timesheets" element={<ManagerTimesheets />} />

        {/* Manager Projects */}
        <Route path="/manager/projects" element={<ManagerProjects />} />

        {/* Manager Project Details */}
        <Route path="/manager/projects/:id" element={<ProjectDetails />} />

        {/* Manager Tasks */}
        <Route path="/manager/tasks" element={<ManagerTasks />} />

        {/* Notifications */}
        <Route path="/notifications" element={<Notifications />} />

        {/* Management Dashboard */}
        <Route path="/management/dashboard" element={<ManagementDashboard />} />

        {/* Management Projects */}
        <Route path="/management/projects" element={<ManagementProjects />} />

        {/* Management Project Details */}
        <Route path="/management/projects/:id" element={<ProjectDetails />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
