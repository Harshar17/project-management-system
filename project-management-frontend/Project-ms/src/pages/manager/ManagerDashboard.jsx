import React, { useEffect, useState } from "react";
import {
  FolderKanban,
  ClipboardList,
  Clock3,
  CheckCircle2,
  ArrowUpRight,
  RefreshCw,
  FileClock,
  Users,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { getSubmittedTimesheets } from "../../services/api";

import "./ManagerDashboard.css";

function ManagerDashboard() {
  const navigate = useNavigate();

  const [timesheets, setTimesheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // LOAD DASHBOARD
  // =========================

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getSubmittedTimesheets();

      setTimesheets(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Manager dashboard error:", err);

      setError(err.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  // =========================
  // CALCULATIONS
  // =========================

  const pendingHours = timesheets.reduce(
    (total, item) => total + Number(item.hours || 0),
    0,
  );

  const uniqueEmployees = new Set(
    timesheets
      .map((item) => item.userId)
      .filter((id) => id !== null && id !== undefined),
  ).size;

  const uniqueProjects = new Set(
    timesheets
      .map((item) => item.projectId)
      .filter((id) => id !== null && id !== undefined),
  ).size;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");

    navigate("/login");
  };

  // =========================
  // UI
  // =========================

  return (
    <div className="manager-dashboard">
      {/* =========================
          HEADER
      ========================= */}

      <div className="manager-header">
        <div>
          <p className="manager-date">MANAGER WORKSPACE</p>

          <h1>Manager Dashboard</h1>

          <p className="manager-subtitle">
            Overview of your team's work and timesheets.
          </p>
        </div>

        <button
          type="button"
          className="refresh-button"
          onClick={loadDashboard}
          disabled={loading}
        >
          <RefreshCw size={17} className={loading ? "spin" : ""} />
          Refresh
        </button>

        <button type="button" className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* =========================
          ERROR
      ========================= */}

      {error && <div className="manager-error">{error}</div>}

      {/* =========================
          STAT CARDS
      ========================= */}

      <div className="manager-stats">
        {/* Pending Timesheets */}

        <div className="manager-stat-card">
          <div className="manager-stat-icon purple">
            <FileClock size={23} />
          </div>

          <div className="manager-stat-content">
            <span>Pending Timesheets</span>

            <strong>{timesheets.length}</strong>

            <small>Waiting for approval</small>
          </div>
        </div>

        {/* Pending Hours */}

        <div className="manager-stat-card">
          <div className="manager-stat-icon blue">
            <Clock3 size={23} />
          </div>

          <div className="manager-stat-content">
            <span>Pending Hours</span>

            <strong>{pendingHours}h</strong>

            <small>Hours awaiting approval</small>
          </div>
        </div>

        {/* Employees */}

        <div className="manager-stat-card">
          <div className="manager-stat-icon green">
            <Users size={23} />
          </div>

          <div className="manager-stat-content">
            <span>Employees</span>

            <strong>{uniqueEmployees}</strong>

            <small>With pending timesheets</small>
          </div>
        </div>

        {/* Projects */}

        <div className="manager-stat-card">
          <div className="manager-stat-icon orange">
            <FolderKanban size={23} />
          </div>

          <div className="manager-stat-content">
            <span>Projects</span>

            <strong>{uniqueProjects}</strong>

            <small>With pending work</small>
          </div>
        </div>
      </div>

      {/* =========================
          MAIN GRID
      ========================= */}

      <div className="manager-content-grid">
        {/* =========================
            PENDING TIMESHEETS
        ========================= */}

        <div className="manager-card pending-card">
          <div className="manager-card-header">
            <div>
              <h2>Pending Timesheets</h2>

              <p>Timesheets waiting for your approval</p>
            </div>

            <button
              type="button"
              className="manager-view-all"
              onClick={() => navigate("/manager/timesheets")}
            >
              View all
              <ArrowUpRight size={16} />
            </button>
          </div>

          {/* LOADING */}

          {loading ? (
            <div className="manager-empty">
              <RefreshCw size={26} className="spin" />

              <p>Loading timesheets...</p>
            </div>
          ) : timesheets.length === 0 ? (
            /* EMPTY */

            <div className="manager-empty">
              <CheckCircle2 size={38} />

              <h3>All caught up</h3>

              <p>There are no pending timesheets.</p>
            </div>
          ) : (
            /* TIMESHEETS */

            <div className="manager-timesheet-list">
              {timesheets.slice(0, 5).map((item) => (
                <div className="manager-timesheet-row" key={item.id}>
                  {/* EMPLOYEE */}

                  <div className="employee-avatar">U{item.userId}</div>

                  {/* EMPLOYEE INFO */}

                  <div className="manager-timesheet-info">
                    <strong>Employee #{item.userId}</strong>

                    <span>Project #{item.projectId}</span>
                  </div>

                  {/* DATE */}

                  <div className="manager-timesheet-date">
                    <span>Date</span>

                    <strong>{item.date || "-"}</strong>
                  </div>

                  {/* HOURS */}

                  <div className="manager-hours">
                    <strong>{item.hours || 0}h</strong>

                    <span>Hours</span>
                  </div>

                  {/* STATUS */}

                  <span className="pending-badge">Pending</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* =========================
            QUICK ACTIONS
        ========================= */}

        <div className="manager-card actions-card">
          <div className="manager-card-header">
            <div>
              <h2>Quick Actions</h2>

              <p>Manage your team's work</p>
            </div>
          </div>

          <div className="manager-actions">
            {/* =========================
                TIMESHEET APPROVALS
            ========================= */}

            <button
              type="button"
              className="manager-action"
              onClick={() => navigate("/manager/timesheets")}
            >
              <div className="action-icon purple">
                <FileClock size={21} />
              </div>

              <div>
                <strong>Timesheet Approvals</strong>

                <span>Review submitted timesheets</span>
              </div>

              <ArrowUpRight size={17} />
            </button>

            {/* =========================
                MANAGER PROJECTS
            ========================= */}

            <button
              type="button"
              className="manager-action"
              onClick={() => navigate("/manager/projects")}
            >
              <div className="action-icon blue">
                <FolderKanban size={21} />
              </div>

              <div>
                <strong>Projects</strong>

                <span>View project information</span>
              </div>

              <ArrowUpRight size={17} />
            </button>

            {/* =========================
                MANAGER TASKS
            ========================= */}

            <button
              type="button"
              className="manager-action"
              onClick={() => navigate("/manager/tasks")}
            >
              <div className="action-icon green">
                <ClipboardList size={21} />
              </div>

              <div>
                <strong>Tasks</strong>

                <span>Manage assigned tasks</span>
              </div>

              <ArrowUpRight size={17} />
            </button>
          </div>
        </div>
      </div>

      {/* =========================
          TEAM OVERVIEW
      ========================= */}

      <div className="manager-summary-card">
        <div className="summary-icon">
          <ClipboardList size={25} />
        </div>

        <div className="summary-text">
          <h2>Team Overview</h2>

          <p>
            Keep track of submitted timesheets, project activity and team
            workload from one place.
          </p>
        </div>

        <button
          type="button"
          className="summary-button"
          onClick={() => navigate("/manager/timesheets")}
        >
          Review Timesheets
          <ArrowUpRight size={16} />
        </button>
      </div>
    </div>
  );
}

export default ManagerDashboard;
