import React, { useEffect, useState } from "react";
import {
  FolderKanban,
  RefreshCw,
  ArrowLeft,
  ArrowUpRight,
} from "lucide-react";

import { getProjects } from "../../services/api";

import "./ManagementProjects.css";

function ManagementProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getProjects();

      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Management projects error:", err);
      setError(err.message || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  return (
    <div className="management-projects-page">

      {/* HEADER */}
      <div className="management-projects-header">

        <div>
          <p className="management-projects-label">
            MANAGEMENT WORKSPACE
          </p>

          <h1>All Projects</h1>

          <p>
            Organization-wide project overview.
          </p>
        </div>

        <div className="management-projects-actions">

          <button
            className="management-back-button"
            onClick={() =>
              window.location.href = "/management/dashboard"
            }
          >
            <ArrowLeft size={17} />
            Dashboard
          </button>

          <button
            className="management-refresh-button"
            onClick={loadProjects}
            disabled={loading}
          >
            <RefreshCw
              size={17}
              className={loading ? "spin" : ""}
            />
            Refresh
          </button>

        </div>

      </div>


      {/* ERROR */}
      {error && (
        <div className="management-projects-error">
          {error}
        </div>
      )}


      {/* SUMMARY */}
      <div className="management-project-summary">

        <div className="management-summary-icon">
          <FolderKanban size={25} />
        </div>

        <div>
          <span>Total Projects</span>

          <strong>
            {loading ? "..." : projects.length}
          </strong>
        </div>

      </div>


      {/* PROJECT LIST */}
      <div className="management-projects-card">

        <div className="management-projects-card-header">

          <div>
            <h2>Projects</h2>

            <p>
              All projects available in the organization
            </p>
          </div>

        </div>


        {loading ? (

          <div className="management-projects-empty">

            <RefreshCw
              size={30}
              className="spin"
            />

            <p>Loading projects...</p>

          </div>

        ) : projects.length === 0 ? (

          <div className="management-projects-empty">

            <FolderKanban size={42} />

            <h3>No projects found</h3>

            <p>
              There are currently no projects in the system.
            </p>

          </div>

        ) : (

          <div className="management-project-list">

            {projects.map((project) => (

              <div
                className="management-project-row"
                key={project.id}
              >

                <div className="management-project-icon">
                  <FolderKanban size={21} />
                </div>


                <div className="management-project-info">

                  <strong>
                    {project.name || "Unnamed Project"}
                  </strong>

                  <span>
                    {project.projectCode
                      ? `Project Code: ${project.projectCode}`
                      : `Project ID: ${project.id}`}
                  </span>

                </div>


                <div className="management-project-status">

                  <span
                    className={`project-status ${
                      String(project.status || "")
                        .toLowerCase()
                        .replace(/\s+/g, "-")
                    }`}
                  >
                    {project.status || "N/A"}
                  </span>

                </div>


                <div className="management-project-details">

                  <span>
                    Manager
                  </span>

                  <strong>
                    {project.managerId ?? "-"}
                  </strong>

                </div>


                <div className="management-project-details">

                  <span>
                    Employee
                  </span>

                  <strong>
                    {project.employeeId ?? "-"}
                  </strong>

                </div>


                <button
                  className="management-view-project"
                  onClick={() =>
                    window.location.href =
                      `/management/projects/${project.id}`
                  }
                >
                  View
                  <ArrowUpRight size={15} />
                </button>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default ManagementProjects;