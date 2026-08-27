import React, { useEffect, useState } from "react";
import {
  FolderKanban,
  RefreshCw,
  CalendarDays,
  Clock,
  Plus,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import "./ManagerProjects.css";

const API_BASE_URL = "https://project-management-system-production-35ad.up.railway.app/api";

function ManagerProjects() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const [error, setError] = useState("");

  const [showCreate, setShowCreate] = useState(false);

  const [form, setForm] = useState({
    projectCode: "",
    name: "",
    description: "",
    client: "",
    employeeId: "",
    startDate: "",
    endDate: "",
    priority: "NORMAL",
    status: "ACTIVE",
    budget: "",
    estimatedHours: "",
  });

  const managerId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  // =========================
  // LOAD MANAGER PROJECTS
  // =========================

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError("");

      if (!managerId) {
        throw new Error(
          "Manager ID not found. Please login again."
        );
      }

      const response = await fetch(
        `${API_BASE_URL}/projects/manager/${managerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to load projects");
      }

      const data = await response.json();

      setProjects(
        Array.isArray(data) ? data : []
      );

    } catch (err) {
      console.error("Projects error:", err);

      setError(
        err.message || "Failed to load projects"
      );

    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOAD EMPLOYEES
  // =========================

  const loadEmployees = async () => {
    try {

      const response = await fetch(
        `${API_BASE_URL}/users/employees`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to load employees"
        );
      }

      const data = await response.json();

      setEmployees(
        Array.isArray(data) ? data : []
      );

    } catch (err) {
      console.error(
        "Employees error:",
        err
      );

      setError(
        "Unable to load employees"
      );
    }
  };

  // =========================
  // INITIAL LOAD
  // =========================

  useEffect(() => {
    loadProjects();
    loadEmployees();
  }, []);

  // =========================
  // FORM CHANGE
  // =========================

  const handleChange = (e) => {

    const {
      name,
      value,
    } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================
  // CREATE PROJECT
  // =========================

  const createProject = async (e) => {

    e.preventDefault();

    try {

      setCreating(true);
      setError("");

      if (!managerId) {
        throw new Error(
          "Manager ID not found. Please login again."
        );
      }

      if (!form.employeeId) {
        throw new Error(
          "Please select an employee."
        );
      }

      const project = {

        projectCode:
          form.projectCode,

        name:
          form.name,

        description:
          form.description,

        client:
          form.client,

        managerId:
          Number(managerId),

        employeeId:
          Number(form.employeeId),

        startDate:
          form.startDate || null,

        endDate:
          form.endDate || null,

        priority:
          form.priority,

        status:
          form.status,

        budget:
          form.budget
            ? Number(form.budget)
            : 0,

        estimatedHours:
          form.estimatedHours
            ? Number(form.estimatedHours)
            : 0,
      };

      console.log(
        "Creating project:",
        project
      );

      const response = await fetch(
        `${API_BASE_URL}/projects`,
        {
          method: "POST",

          headers: {
            Authorization:
              `Bearer ${token}`,

            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify(project),
        }
      );

      if (!response.ok) {

        const text =
          await response.text();

        throw new Error(
          text ||
          "Failed to create project"
        );
      }

      const createdProject =
        await response.json();

      console.log(
        "Project created:",
        createdProject
      );

      // Add immediately to manager's list
      setProjects(
        (previous) => [
          ...previous,
          createdProject,
        ]
      );

      // Reset form
      setForm({
        projectCode: "",
        name: "",
        description: "",
        client: "",
        employeeId: "",
        startDate: "",
        endDate: "",
        priority: "NORMAL",
        status: "ACTIVE",
        budget: "",
        estimatedHours: "",
      });

      setShowCreate(false);

    } catch (err) {

      console.error(
        "Create project error:",
        err
      );

      setError(
        err.message ||
        "Failed to create project"
      );

    } finally {

      setCreating(false);
    }
  };

  // =========================
  // UI
  // =========================

  return (
    <div className="manager-projects-page">

      {/* HEADER */}

      <div className="manager-projects-header">

        <div>

          <span className="manager-label">
            MANAGER WORKSPACE
          </span>

          <h1>
            Projects
          </h1>

          <p>
            Create and manage your team's projects.
          </p>

        </div>

        <div
          style={{
            display: "flex",
            gap: "12px",
          }}
        >

          <button
            className="refresh-button"
            onClick={loadProjects}
          >
            <RefreshCw size={18} />
            Refresh
          </button>

          <button
            className="refresh-button"
            onClick={() =>
              setShowCreate(true)
            }
          >
            <Plus size={18} />
            Create Project
          </button>

        </div>

      </div>

      {/* ERROR */}

      {error && (
        <div className="error-box">
          {error}
        </div>
      )}

      {/* CREATE PROJECT */}

      {showCreate && (

        <div className="create-project-card">

          <div className="create-project-header">

            <div>

              <h2>
                Create Project
              </h2>

              <p>
                Create a project and assign it
                to an employee.
              </p>

            </div>

            <button
              type="button"
              onClick={() =>
                setShowCreate(false)
              }
              style={{
                border: "none",
                background:
                  "transparent",
                cursor: "pointer",
              }}
            >
              <X size={22} />
            </button>

          </div>

          <form className="create-project-form" onSubmit={createProject}>

            <div className="create-project-grid">

              {/* PROJECT CODE */}

              <div>

                <label>
                  Project Code
                </label>

                <input
                  name="projectCode"
                  value={
                    form.projectCode
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="PROJ001"
                  required
                />

              </div>

              {/* PROJECT NAME */}

              <div>

                <label>
                  Project Name
                </label>

                <input
                  name="name"
                  value={
                    form.name
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Employee Management System"
                  required
                />

              </div>

              {/* CLIENT */}

              <div>

                <label>
                  Client
                </label>

                <input
                  name="client"
                  value={
                    form.client
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Client name"
                />

              </div>

              {/* EMPLOYEE */}

              <div>

                <label>
                  Assign Employee
                </label>

                <select
                  name="employeeId"
                  value={
                    form.employeeId
                  }
                  onChange={
                    handleChange
                  }
                  required
                >

                  <option value="">
                    Select employee
                  </option>

                  {employees.map(
                    (employee) => (

                      <option
                        key={
                          employee.id
                        }
                        value={
                          employee.id
                        }
                      >
                        {employee.name}
                        {" - "}
                        {employee.email}
                      </option>

                    )
                  )}

                </select>

              </div>

              {/* PRIORITY */}

              <div>

                <label>
                  Priority
                </label>

                <select
                  name="priority"
                  value={
                    form.priority
                  }
                  onChange={
                    handleChange
                  }
                >

                  <option value="LOW">
                    Low
                  </option>

                  <option value="NORMAL">
                    Normal
                  </option>

                  <option value="HIGH">
                    High
                  </option>

                  <option value="CRITICAL">
                    Critical
                  </option>

                </select>

              </div>

              {/* STATUS */}

              <div>

                <label>
                  Status
                </label>

                <select
                  name="status"
                  value={
                    form.status
                  }
                  onChange={
                    handleChange
                  }
                >

                  <option value="ACTIVE">
                    Active
                  </option>

                  <option value="COMPLETED">
                    Completed
                  </option>

                  <option value="DELAYED">
                    Delayed
                  </option>

                </select>

              </div>

              {/* START DATE */}

              <div>

                <label>
                  Start Date
                </label>

                <input
                  type="date"
                  name="startDate"
                  value={
                    form.startDate
                  }
                  onChange={
                    handleChange
                  }
                />

              </div>

              {/* END DATE */}

              <div>

                <label>
                  End Date
                </label>

                <input
                  type="date"
                  name="endDate"
                  value={
                    form.endDate
                  }
                  onChange={
                    handleChange
                  }
                />

              </div>

              {/* BUDGET */}

              <div>

                <label>
                  Budget
                </label>

                <input
                  type="number"
                  name="budget"
                  value={
                    form.budget
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="50000"
                />

              </div>

              {/* HOURS */}

              <div>

                <label>
                  Estimated Hours
                </label>

                <input
                  type="number"
                  name="estimatedHours"
                  value={
                    form.estimatedHours
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="500"
                />

              </div>

            </div>

            {/* DESCRIPTION */}

            <div
              style={{
                marginTop: "18px",
              }}
            >

              <label>
                Description
              </label>

              <textarea
                name="description"
                value={
                  form.description
                }
                onChange={
                  handleChange
                }
                placeholder="Project description..."
                rows="4"
              />

            </div>

            {/* BUTTONS */}

            <div
              style={{
                display: "flex",
                justifyContent:
                  "flex-end",
                gap: "12px",
                marginTop: "22px",
              }}
            >

              <button
                type="button"
                onClick={() =>
                  setShowCreate(false)
                }
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={creating}
              >
                {creating
                  ? "Creating..."
                  : "Create Project"}
              </button>

            </div>

          </form>

        </div>
      )}

      {/* SUMMARY */}

      <div className="projects-summary">

        <div className="summary-card">

          <div className="summary-icon">
            <FolderKanban size={24} />
          </div>

          <div>

            <span>
              Total Projects
            </span>

            <strong>
              {projects.length}
            </strong>

          </div>

        </div>

      </div>

      {/* PROJECTS */}

      <section className="projects-container">

        <div className="section-heading">

          <div>

            <h2>
              My Projects
            </h2>

            <p>
              Projects created by you
            </p>

          </div>

        </div>

        {loading ? (

          <div className="empty-state">
            Loading projects...
          </div>

        ) : projects.length === 0 ? (

          <div className="empty-state">

            <FolderKanban size={48} />

            <h3>
              No projects found
            </h3>

            <p>
              Create your first project
              using the button above.
            </p>

          </div>

        ) : (

          <div className="manager-project-grid">

            {projects.map(
              (project) => (

                <div
                  className="manager-project-card"
                  key={project.id}
                  onClick={() =>
                    navigate(
                      `/manager/projects/${project.id}`
                    )
                  }
                >

                  <div className="project-card-top">

                    <div className="project-icon">
                      <FolderKanban
                        size={24}
                      />
                    </div>

                    <span
                      className={`status-badge ${
                        String(
                          project.status ||
                          "ACTIVE"
                        ).toLowerCase()
                      }`}
                    >
                      {project.status ||
                        "ACTIVE"}
                    </span>

                  </div>

                  <span className="project-code">
                    {project.projectCode}
                  </span>

                  <h3>
                    {project.name}
                  </h3>

                  <p className="project-description">
                    {project.description ||
                      "No description available."}
                  </p>

                  <div className="project-info">

                    <div>
                      <CalendarDays
                        size={17}
                      />

                      <span>
                        {project.startDate ||
                          "-"}
                      </span>
                    </div>

                    <div>
                      <Clock size={17} />

                      <span>
                        {project.estimatedHours ||
                          0}{" "}
                        hrs
                      </span>
                    </div>

                  </div>

                  <div className="view-project">
                    View Project →
                  </div>

                </div>

              )
            )}

          </div>
        )}

      </section>

    </div>
  );
}

export default ManagerProjects;