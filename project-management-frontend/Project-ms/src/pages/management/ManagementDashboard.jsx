import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FolderKanban,
  Users,
  Clock3,
  FileClock,
  CheckCircle2,
  AlertTriangle,
  BarChart3,
  RefreshCw,
  ArrowUpRight,
} from "lucide-react";

import { getAllTimesheets, getProjects } from "../../services/api";

import "./ManagementDashboard.css";

function ManagementDashboard() {
  const navigate = useNavigate();

  const [timesheets, setTimesheets] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

const loadDashboard = async () => {
  try {
    setLoading(true);
    setError("");

    const [timesheetData, projectData] = await Promise.all([
      getAllTimesheets(),
      getProjects(),
    ]);

    console.log("TIMESHEET DATA:", timesheetData);
    console.log("PROJECT DATA:", projectData);

    const actualTimesheetData = Array.isArray(timesheetData)
      ? timesheetData
      : timesheetData?.data || [];

    const actualProjectData = Array.isArray(projectData)
      ? projectData
      : projectData?.data || [];

    console.log("FINAL TIMESHEETS:", actualTimesheetData);
    console.log("FINAL PROJECTS:", actualProjectData);

    setTimesheets(actualTimesheetData);
    setProjects(actualProjectData);

  } catch (err) {
    console.error("Management dashboard error:", err);
    setError(err.message || "Failed to load management dashboard");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    loadDashboard();
  }, []);

  // -----------------------------
  // PROJECT KPIs
  // -----------------------------

  const totalProjects = projects.length;

  const activeProjects = projects.filter(
    (project) => String(project.status || "").toUpperCase() === "ACTIVE",
  ).length;

  const completedProjects = projects.filter(
    (project) => String(project.status || "").toUpperCase() === "COMPLETED",
  ).length;

  const delayedProjects = projects.filter((project) => {
    const status = String(project.status || "").toUpperCase();

    return status === "DELAYED" || status === "AT_RISK" || status === "AT RISK";
  }).length;

  // -----------------------------
  // TIMESHEET KPIs
  // -----------------------------

  const actualHours = useMemo(() => {
    return timesheets.reduce(
      (total, item) => total + Number(item.hours || 0),
      0,
    );
  }, [timesheets]);

  const billableHours = useMemo(() => {
    return timesheets
      .filter(
        (item) =>
          item.billable === true ||
          item.billable === 1 ||
          item.billable === "1" ||
          item.billable === "true",
      )
      .reduce((total, item) => total + Number(item.hours || 0), 0);
  }, [timesheets]);

  const nonBillableHours = actualHours - billableHours;

  const pendingTimesheets = timesheets.filter(
    (item) => String(item.status || "").toUpperCase() === "SUBMITTED",
  ).length;

  // -----------------------------
  // EMPLOYEE / RESOURCE KPIs
  // -----------------------------

  const totalEmployees = useMemo(() => {
    return new Set(
      timesheets
        .map((item) => item.userId)
        .filter((id) => id !== null && id !== undefined),
    ).size;
  }, [timesheets]);

  // -----------------------------
  // PROJECT HOURS
  // -----------------------------

  const plannedHours = useMemo(() => {
    return projects.reduce(
      (total, project) =>
        total +
        Number(
          project.plannedHours ||
            project.estimatedHours ||
            project.totalHours ||
            0,
        ),
      0,
    );
  }, [projects]);

  const progress =
    plannedHours > 0
      ? Math.min(100, Math.round((actualHours / plannedHours) * 100))
      : 0;

  // -----------------------------
  // LOGOUT
  // -----------------------------

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="management-dashboard">
      {/* HEADER */}
      <div className="management-header">
        <div>
          <p className="management-label">MANAGEMENT WORKSPACE</p>

          <h1>Management Dashboard</h1>

          <p className="management-subtitle">
            Organization-wide overview of projects, employees and workload.
          </p>
        </div>

        <div className="management-header-actions">
          <button
            className="management-refresh"
            onClick={loadDashboard}
            disabled={loading}
          >
            <RefreshCw size={17} className={loading ? "spin" : ""} />
            Refresh
          </button>

          <button className="management-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* ERROR */}
      {error && <div className="management-error">{error}</div>}

      {/* EXECUTIVE KPI CARDS */}
      <div className="management-kpi-grid">
        {/* TOTAL PROJECTS */}
        <div className="management-kpi-card">
          <div className="kpi-icon purple">
            <FolderKanban size={24} />
          </div>

          <div>
            <span>Total Projects</span>

            <strong>{loading ? "..." : totalProjects}</strong>

            <small>Projects in system</small>
          </div>
        </div>

        {/* ACTIVE PROJECTS */}
        <div className="management-kpi-card">
          <div className="kpi-icon blue">
            <BarChart3 size={24} />
          </div>

          <div>
            <span>Active Projects</span>

            <strong>{loading ? "..." : activeProjects}</strong>

            <small>Currently active</small>
          </div>
        </div>

        {/* EMPLOYEES */}
        <div className="management-kpi-card">
          <div className="kpi-icon green">
            <Users size={24} />
          </div>

          <div>
            <span>Total Employees</span>

            <strong>{loading ? "..." : totalEmployees}</strong>

            <small>With recorded work</small>
          </div>
        </div>

        {/* PENDING TIMESHEETS */}
        <div className="management-kpi-card">
          <div className="kpi-icon orange">
            <FileClock size={24} />
          </div>

          <div>
            <span>Pending Timesheets</span>

            <strong>{loading ? "..." : pendingTimesheets}</strong>

            <small>Awaiting approval</small>
          </div>
        </div>
      </div>

      {/* SECOND KPI ROW */}
      <div className="management-kpi-grid">
        {/* ACTUAL HOURS */}
        <div className="management-kpi-card">
          <div className="kpi-icon blue">
            <Clock3 size={24} />
          </div>

          <div>
            <span>Actual Hours</span>

            <strong>{loading ? "..." : `${actualHours}h`}</strong>

            <small>Recorded timesheet hours</small>
          </div>
        </div>

        {/* BILLABLE HOURS */}
        <div className="management-kpi-card">
          <div className="kpi-icon green">
            <CheckCircle2 size={24} />
          </div>

          <div>
            <span>Billable Hours</span>

            <strong>{loading ? "..." : `${billableHours}h`}</strong>

            <small>Billable work</small>
          </div>
        </div>

        {/* NON BILLABLE */}
        <div className="management-kpi-card">
          <div className="kpi-icon purple">
            <Clock3 size={24} />
          </div>

          <div>
            <span>Non-Billable Hours</span>

            <strong>{loading ? "..." : `${nonBillableHours}h`}</strong>

            <small>Non-billable work</small>
          </div>
        </div>

        {/* COMPLETED PROJECTS */}
        <div className="management-kpi-card">
          <div className="kpi-icon green">
            <CheckCircle2 size={24} />
          </div>

          <div>
            <span>Completed Projects</span>

            <strong>{loading ? "..." : completedProjects}</strong>

            <small>Successfully completed</small>
          </div>
        </div>
      </div>

      {/* ANALYTICS GRID */}
      <div className="management-content-grid">
        {/* PROJECT PERFORMANCE */}
        <div className="management-panel">
          <div className="panel-header">
            <div>
              <h2>Project Performance</h2>

              <p>Planned vs actual workload</p>
            </div>

            <BarChart3 size={23} />
          </div>

          <div className="performance-content">
            <div className="performance-row">
              <span>Planned Hours</span>

              <strong>{plannedHours}h</strong>
            </div>

            <div className="performance-row">
              <span>Actual Hours</span>

              <strong>{actualHours}h</strong>
            </div>

            <div className="progress-section">
              <div className="progress-header">
                <span>Work Progress</span>

                <strong>{progress}%</strong>
              </div>

              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* PROJECT STATUS */}
        <div className="management-panel">
          <div className="panel-header">
            <div>
              <h2>Project Status</h2>

              <p>Current project distribution</p>
            </div>

            <FolderKanban size={23} />
          </div>

          <div className="status-list">
            <div className="status-row">
              <span>
                <span className="status-dot active" />
                Active
              </span>

              <strong>{activeProjects}</strong>
            </div>

            <div className="status-row">
              <span>
                <span className="status-dot completed" />
                Completed
              </span>

              <strong>{completedProjects}</strong>
            </div>

            <div className="status-row">
              <span>
                <span className="status-dot delayed" />
                Delayed / At Risk
              </span>

              <strong>{delayedProjects}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* RESOURCE + TIMESHEET */}
      <div className="management-content-grid">
        {/* RESOURCE UTILIZATION */}
        <div className="management-panel">
          <div className="panel-header">
            <div>
              <h2>Resource Overview</h2>

              <p>Employee workload based on recorded work</p>
            </div>

            <Users size={23} />
          </div>

          <div className="resource-overview">
            <div className="resource-number">
              <strong>{totalEmployees}</strong>

              <span>Employees with recorded timesheets</span>
            </div>

            <div className="resource-number">
              <strong>{actualHours}h</strong>

              <span>Total recorded hours</span>
            </div>
          </div>
        </div>

        {/* TIMESHEET OVERVIEW */}
        <div className="management-panel">
          <div className="panel-header">
            <div>
              <h2>Timesheet Overview</h2>

              <p>Current timesheet workload</p>
            </div>

            <FileClock size={23} />
          </div>

          <div className="timesheet-overview">
            <div className="overview-item">
              <span>Pending</span>

              <strong>{pendingTimesheets}</strong>
            </div>

            <div className="overview-item">
              <span>Billable</span>

              <strong>{billableHours}h</strong>
            </div>

            <div className="overview-item">
              <span>Non-Billable</span>

              <strong>{nonBillableHours}h</strong>
            </div>
          </div>
        </div>
      </div>

      {/* WARNING / SUMMARY */}
      <div className="management-summary">
        <div className="summary-icon">
          {delayedProjects > 0 ? (
            <AlertTriangle size={25} />
          ) : (
            <CheckCircle2 size={25} />
          )}
        </div>

        <div className="summary-content">
          <h2>
            {delayedProjects > 0
              ? "Projects need attention"
              : "Organization overview"}
          </h2>

          <p>
            {delayedProjects > 0
              ? `${delayedProjects} project(s) are delayed or at risk.`
              : "Your organization currently has no projects marked as delayed or at risk."}
          </p>
        </div>

        <a href="/management/projects" className="summary-link">
          View Projects
          <ArrowUpRight size={17} />
        </a>
      </div>
    </div>
  );
}

export default ManagementDashboard;
