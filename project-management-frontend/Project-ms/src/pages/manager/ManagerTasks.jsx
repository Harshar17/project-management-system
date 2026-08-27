import React, { useEffect, useState } from "react";
import {
  CheckSquare,
  RefreshCw,
  CalendarDays,
  User,
  Plus,
  X,
  FolderKanban,
} from "lucide-react";

import { createTask } from "../../services/api";

import "./ManagerTasks.css";

const API_BASE_URL = "https://project-management-system-production-35ad.up.railway.app/api";

function ManagerTasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const [error, setError] = useState("");
  const [showCreate, setShowCreate] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    projectId: "",
    assignedTo: "",
    priority: "MEDIUM",
    startDate: "",
    dueDate: "",
    estimatedHours: "",
    actualHours: "",
    status: "TODO",
    parentTaskId: "",
  });

  const token = localStorage.getItem("token");

  // ========================================
  // LOAD TASKS
  // ========================================

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_BASE_URL}/tasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to load tasks");
      }

      const data = await response.json();

      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Tasks error:", err);
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // LOAD PROJECTS
  // ========================================

  const loadProjects = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/projects`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to load projects");
      }

      const data = await response.json();

      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Projects error:", err);
      setError("Failed to load projects");
    }
  };

  // ========================================
  // LOAD EMPLOYEES
  // ========================================

  const loadEmployees = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/employees`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to load employees");
      }

      const data = await response.json();

      setEmployees(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Employees error:", err);
      setError("Failed to load employees");
    }
  };

  // ========================================
  // INITIAL LOAD
  // ========================================

  useEffect(() => {
    loadTasks();
    loadProjects();
    loadEmployees();
  }, []);

  // ========================================
  // FORM CHANGE
  // ========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ========================================
  // CREATE TASK
  // ========================================

  const handleCreateTask = async (e) => {
    e.preventDefault();

    try {
      setCreating(true);
      setError("");

      if (!form.projectId) {
        throw new Error("Please select a project.");
      }

      if (!form.assignedTo) {
        throw new Error("Please select an employee.");
      }

      if (!form.name.trim()) {
        throw new Error("Please enter a task name.");
      }

      const task = {
        name: form.name,
        description: form.description,

        projectId: Number(form.projectId),

        assignedTo: Number(form.assignedTo),

        parentTaskId: form.parentTaskId ? Number(form.parentTaskId) : null,

        priority: form.priority,

        startDate: form.startDate || null,

        dueDate: form.dueDate || null,

        estimatedHours: form.estimatedHours ? Number(form.estimatedHours) : 0,

        actualHours: form.actualHours ? Number(form.actualHours) : 0,

        status: form.status,
      };

      console.log("Creating task:", task);

      const createdTask = await createTask(task);

      console.log("Task created:", createdTask);

      setTasks((previous) => [...previous, createdTask]);

      // Reset form
      setForm({
        name: "",
        description: "",
        projectId: "",
        assignedTo: "",
        priority: "MEDIUM",
        startDate: "",
        dueDate: "",
        estimatedHours: "",
        actualHours: "",
        status: "TODO",
        parentTaskId: "",
      });

      setShowCreate(false);
    } catch (err) {
      console.error("Create task error:", err);

      setError(err.message || "Failed to create task");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="manager-tasks-page">
      {/* ========================================
          HEADER
      ======================================== */}

      <div className="manager-tasks-header">
        <div>
          <span className="manager-label">MANAGER WORKSPACE</span>

          <h1>Tasks</h1>

          <p>Create and manage tasks assigned to your team.</p>
        </div>

        <div
          style={{
            display: "flex",
            gap: "12px",
          }}
        >
          <button className="refresh-button" onClick={loadTasks}>
            <RefreshCw size={18} />
            Refresh
          </button>

          <button
            className="refresh-button"
            onClick={() => setShowCreate(true)}
          >
            <Plus size={18} />
            Create Task
          </button>
        </div>
      </div>

      {/* ========================================
          ERROR
      ======================================== */}

      {error && <div className="error-box">{error}</div>}

      {/* ========================================
          CREATE TASK
      ======================================== */}

      {showCreate && (
        <div className="create-task-card">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <div>
              <h2>Create Task</h2>

              <p>Assign a task to an employee for a project.</p>
            </div>

            <button
              type="button"
              onClick={() => setShowCreate(false)}
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
              }}
            >
              <X size={22} />
            </button>
          </div>
          <form className="create-task-form" onSubmit={handleCreateTask}>
            <div className="create-task-grid">
              {/* TASK NAME */}

              <div>
                <label>Task Name</label>

                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Implement login page"
                  required
                />
              </div>

              {/* PROJECT */}

              <div>
                <label>Project</label>

                <select
                  name="projectId"
                  value={form.projectId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select project</option>

                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.projectCode} - {project.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* EMPLOYEE */}

              <div>
                <label>Assign Employee</label>

                <select
                  name="assignedTo"
                  value={form.assignedTo}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select employee</option>

                  {employees.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.name} - {employee.email}
                    </option>
                  ))}
                </select>
              </div>

              {/* PRIORITY */}

              <div>
                <label>Priority</label>

                <select
                  name="priority"
                  value={form.priority}
                  onChange={handleChange}
                >
                  <option value="LOW">Low</option>

                  <option value="MEDIUM">Medium</option>

                  <option value="HIGH">High</option>

                  <option value="CRITICAL">Critical</option>
                </select>
              </div>

              {/* STATUS */}

              <div>
                <label>Status</label>

                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option value="TODO">TODO</option>

                  <option value="IN_PROGRESS">In Progress</option>

                  <option value="COMPLETED">Completed</option>
                </select>
              </div>

              {/* START DATE */}

              <div>
                <label>Start Date</label>

                <input
                  type="date"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                />
              </div>

              {/* DUE DATE */}

              <div>
                <label>Due Date</label>

                <input
                  type="date"
                  name="dueDate"
                  value={form.dueDate}
                  onChange={handleChange}
                />
              </div>

              {/* ESTIMATED HOURS */}

              <div>
                <label>Estimated Hours</label>

                <input
                  type="number"
                  min="0"
                  name="estimatedHours"
                  value={form.estimatedHours}
                  onChange={handleChange}
                  placeholder="8"
                />
              </div>
            </div>

            {/* DESCRIPTION */}

            <div
              style={{
                marginTop: "18px",
              }}
            >
              <label>Description</label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="4"
                placeholder="Describe the task..."
              />
            </div>

            {/* BUTTONS */}

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "12px",
                marginTop: "22px",
              }}
            >
              <button type="button" onClick={() => setShowCreate(false)}>
                Cancel
              </button>

              <button type="submit" disabled={creating}>
                {creating ? "Creating..." : "Create Task"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================
          TASK LIST
      ======================================== */}

      <section className="tasks-container">
        <div className="section-heading">
          <div>
            <h2>Team Tasks</h2>

            <p>Tasks currently assigned to employees</p>
          </div>

          <span className="task-count">{tasks.length}</span>
        </div>

        {loading ? (
          <div className="empty-state">Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="empty-state">
            <CheckSquare size={48} />

            <h3>No tasks found</h3>

            <p>Create your first task using the button above.</p>
          </div>
        ) : (
          <div className="task-list">
            {tasks.map((task) => (
              <div className="manager-task-row" key={task.id}>
                <div className="task-icon">
                  <CheckSquare size={22} />
                </div>

                <div className="task-main">
                  <span className="task-id">TASK #{task.id}</span>

                  <h3>{task.name || "Unnamed Task"}</h3>

                  <p>{task.description || "No description available"}</p>
                </div>

                <div className="task-meta">
                  <div>
                    <FolderKanban size={16} />
                    Project #{task.projectId ?? "-"}
                  </div>

                  <div>
                    <User size={16} />
                    Employee #{task.assignedTo ?? "-"}
                  </div>

                  <div>
                    <CalendarDays size={16} />

                    {task.dueDate || "-"}
                  </div>
                </div>

                <div className="task-status-area">
                  <span
                    className={`task-status ${String(
                      task.status || "TODO",
                    ).toLowerCase()}`}
                  >
                    {task.status || "TODO"}
                  </span>

                  <span
                    className={`priority ${String(
                      task.priority || "MEDIUM",
                    ).toLowerCase()}`}
                  >
                    {task.priority || "MEDIUM"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default ManagerTasks;
