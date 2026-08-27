import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

import {
  ArrowLeft,
  Users,
  CalendarDays,
  Clock3,
  Circle,
  CircleCheck,
} from "lucide-react";

import "./ProjectDetails.css";

const API_BASE_URL = "https://project-management-system-production-35ad.up.railway.app/api";

function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const isManagementProject = location.pathname.startsWith(
    "/management/projects",
  );

  const isManagerProject = location.pathname.startsWith("/manager/projects");

  const backPath = isManagementProject
    ? "/management/projects"
    : isManagerProject
      ? "/manager/projects"
      : "/projects";

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // LOAD PROJECT + TASKS
  // =====================================================

  useEffect(() => {
    loadProjectDetails();
  }, [id]);

  async function loadProjectDetails() {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      // -----------------------------------------
      // GET PROJECT
      // -----------------------------------------

      const projectResponse = await fetch(`${API_BASE_URL}/projects/${id}`, {
        method: "GET",

        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!projectResponse.ok) {
        throw new Error("Failed to load project");
      }

      const projectData = await projectResponse.json();

      console.log("Project data:", projectData);

      setProject(projectData);

      // -----------------------------------------
      // GET PROJECT TASKS
      // -----------------------------------------

      const tasksResponse = await fetch(`${API_BASE_URL}/tasks/project/${id}`, {
        method: "GET",

        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!tasksResponse.ok) {
        throw new Error("Failed to load project tasks");
      }

      const tasksData = await tasksResponse.json();

      console.log("Project tasks:", tasksData);

      setTasks(tasksData);
    } catch (err) {
      console.error("Project details error:", err);

      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  // =====================================================
  // UPDATE TASK STATUS
  // =====================================================

  async function handleTaskStatusChange(taskId, currentStatus) {
    try {
      const token = localStorage.getItem("token");

      /*
       * IMPORTANT:
       *
       * Backend returns:
       * COMPLETED
       * TODO
       * IN_PROGRESS
       *
       * So always compare using uppercase.
       */

      const normalizedStatus = currentStatus?.toUpperCase();

      const newStatus = normalizedStatus === "COMPLETED" ? "TODO" : "COMPLETED";

      console.log(
        "Updating task:",
        taskId,
        "from:",
        normalizedStatus,
        "to:",
        newStatus,
      );

      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/status`, {
        method: "PUT",

        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },

        body: JSON.stringify(newStatus),
      });

      if (!response.ok) {
        throw new Error("Failed to update task status");
      }

      const updatedTask = await response.json();

      console.log("Updated task:", updatedTask);

      // -----------------------------------------
      // Update task immediately in UI
      // -----------------------------------------

      setTasks((previousTasks) =>
        previousTasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                status: newStatus,
              }
            : task,
        ),
      );
    } catch (err) {
      console.error("Task status error:", err);

      alert(err.message || "Failed to update task");
    }
  }

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="project-details-page">
        <div className="project-loading">Loading project...</div>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error || !project) {
    return (
      <div className="project-details-page">
        <button className="back-button" onClick={() => navigate(backPath)}>
          <ArrowLeft size={18} />
          Back to Projects
        </button>

        <div className="project-error">{error || "Project not found"}</div>
      </div>
    );
  }

  // =====================================================
  // TASK CALCULATIONS
  // =====================================================

  const totalTasks = tasks.length;

  /*
   * IMPORTANT FIX:
   *
   * Backend gives "COMPLETED"
   * not "completed".
   *
   * toUpperCase() makes this work
   * regardless of capitalization.
   */

  const completedTasks = tasks.filter(
    (task) => task.status?.toUpperCase() === "COMPLETED",
  );

  const completedCount = completedTasks.length;

  const progress =
    totalTasks === 0 ? 0 : Math.round((completedCount / totalTasks) * 100);

  const estimatedHours = tasks.reduce(
    (total, task) => total + Number(task.estimatedHours || 0),
    0,
  );

  const actualHours = tasks.reduce(
    (total, task) => total + Number(task.actualHours || 0),
    0,
  );

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <div className="project-details-page">
      {/* =================================================
                BACK BUTTON
            ================================================= */}

      <button className="back-button" onClick={() => navigate(backPath)}>
        <ArrowLeft size={19} />
        Back to Projects
      </button>

      {/* =================================================
                PROJECT HEADER
            ================================================= */}

      <section className="project-details-header">
        <div>
          <span className="project-code">{project.projectCode}</span>

          <h1>{project.name}</h1>

          <p>
            {project.description || "Project management and timesheet platform"}
          </p>
        </div>

        <span
          className={`project-status ${project.status
            ?.toLowerCase()
            .replace(/\s+/g, "-")}`}
        >
          {project.status}
        </span>
      </section>

      {/* =================================================
                PROJECT INFORMATION
            ================================================= */}

      <section className="project-info-grid">
        {/* CLIENT */}

        <div className="project-info-card">
          <div className="info-icon">
            <Users size={22} />
          </div>

          <div>
            <span>Client</span>

            <strong>{project.client || "N/A"}</strong>
          </div>
        </div>

        {/* START DATE */}

        <div className="project-info-card">
          <div className="info-icon">
            <CalendarDays size={22} />
          </div>

          <div>
            <span>Start Date</span>

            <strong>{project.startDate || "N/A"}</strong>
          </div>
        </div>

        {/* END DATE */}

        <div className="project-info-card">
          <div className="info-icon">
            <CalendarDays size={22} />
          </div>

          <div>
            <span>End Date</span>

            <strong>{project.endDate || "N/A"}</strong>
          </div>
        </div>

        {/* ESTIMATED HOURS */}

        <div className="project-info-card">
          <div className="info-icon">
            <Clock3 size={22} />
          </div>

          <div>
            <span>Estimated Hours</span>

            <strong>{project.estimatedHours ?? estimatedHours} hrs</strong>
          </div>
        </div>
      </section>

      {/* =================================================
                PROJECT PROGRESS
            ================================================= */}

      <section className="project-progress-card">
        <div className="section-heading">
          <div>
            <h2>Project Progress</h2>

            <p>Based on your assigned tasks</p>
          </div>

          <strong className="progress-percentage">{progress}%</strong>
        </div>

        {/* PROGRESS BAR */}

        <div className="large-progress">
          <div
            className="large-progress-value"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>

        {/* PROGRESS STATS */}

        <div className="progress-stats">
          <div className="progress-stat">
            <span>Task estimated hours</span>

            <strong>{estimatedHours} hrs</strong>
          </div>

          <div className="progress-stat">
            <span>Actual hours</span>

            <strong>{actualHours} hrs</strong>
          </div>

          <div className="progress-stat">
            <span>Tasks</span>

            <strong>
              {completedCount}/{totalTasks}
            </strong>
          </div>
        </div>
      </section>

      {/* =================================================
                MY TASKS
            ================================================= */}

      <section className="project-tasks-card">
        <div className="section-heading">
          <div>
            <h2>My Tasks</h2>

            <p>Tasks assigned to you in this project</p>
          </div>

          <strong className="task-count">{totalTasks}</strong>
        </div>

        {tasks.length === 0 ? (
          <div className="no-tasks">
            No tasks assigned to you in this project.
          </div>
        ) : (
          <div className="project-task-list">
            {tasks.map((task) => {
              /*
               * IMPORTANT FIX:
               *
               * "COMPLETED"
               * is converted to uppercase
               * before comparison.
               */

              const isCompleted = task.status?.toUpperCase() === "COMPLETED";

              return (
                <div
                  className={`project-task ${
                    isCompleted ? "project-task-completed" : ""
                  }`}
                  key={task.id}
                >
                  {/* CHECKBOX */}

                  <button
                    className="task-status-button"
                    onClick={() => handleTaskStatusChange(task.id, task.status)}
                    title={
                      isCompleted ? "Mark as pending" : "Mark as completed"
                    }
                  >
                    {isCompleted ? (
                      <CircleCheck size={27} className="completed-icon" />
                    ) : (
                      <Circle size={27} className="pending-icon" />
                    )}
                  </button>

                  {/* TASK INFORMATION */}

                  <div className="task-content">
                    <strong className={isCompleted ? "completed-task" : ""}>
                      {task.name}
                    </strong>

                    <span>{task.description || "No description"}</span>
                  </div>

                  {/* PRIORITY */}

                  <span
                    className={`task-priority ${task.priority?.toLowerCase()}`}
                  >
                    {task.priority || "NORMAL"}
                  </span>

                  {/* STATUS */}

                  <span
                    className={`task-status-text ${
                      isCompleted ? "completed-status" : "todo-status"
                    }`}
                  >
                    {task.status}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

export default ProjectDetails;
