import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  FolderKanban,
  Users,
  Search,
} from "lucide-react";

import { getEmployeeProjects } from "../services/api";

import "./Projects.css";

function Projects() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await getEmployeeProjects();

        console.log("Employee projects:", data);

        setProjects(data);
      } catch (error) {
        console.error("Projects error:", error);

        setError(error.message || "Failed to load projects");
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  // Search
  const filteredProjects = projects.filter((project) => {
    const searchText = search.toLowerCase();

    return (
      project.name?.toLowerCase().includes(searchText) ||
      project.projectCode?.toLowerCase().includes(searchText) ||
      project.client?.toLowerCase().includes(searchText)
    );
  });

  // Calculate progress
  const getProgress = (project) => {
    if (!project.estimatedHours || project.estimatedHours === 0) {
      return 0;
    }

    // We don't currently have
    // actual project hours.
    return 0;
  };

  return (
    <div className="projects-page">
      {/* HEADER */}

      <div className="projects-header">
        <div>
          <button
            className="back-button"
            onClick={() => navigate("/employee/dashboard")}
          >
            <ArrowLeft size={17} />
            Dashboard
          </button>

          <h1>My Projects</h1>

          <p>Projects you're currently working on</p>
        </div>
      </div>

      {/* SEARCH */}

      <div className="projects-toolbar">
        <div className="projects-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="project-count">
          {projects.length} {projects.length === 1 ? "Project" : "Projects"}
        </div>
      </div>

      {/* LOADING */}

      {loading && <div className="projects-message">Loading projects...</div>}

      {/* ERROR */}

      {!loading && error && (
        <div className="projects-message error">{error}</div>
      )}

      {/* EMPTY */}

      {!loading && !error && filteredProjects.length === 0 && (
        <div className="projects-message">
          {search ? "No projects found." : "No projects assigned yet."}
        </div>
      )}

      {/* PROJECTS */}

      {!loading && !error && filteredProjects.length > 0 && (
        <div className="projects-grid">
          {filteredProjects.map((project) => {
            const progress = getProgress(project);

            return (
              <div
                className="project-card"
                onClick={() => navigate(`/projects/${project.id}`)}
              >
                {/* CARD TOP */}

                <div className="project-card-top">
                  <div className="project-card-icon">
                    <FolderKanban size={22} />
                  </div>

                  <span
                    className={`project-status ${project.status?.toLowerCase()}`}
                  >
                    {project.status || "ACTIVE"}
                  </span>
                </div>

                {/* PROJECT NAME */}

                <div className="project-card-content">
                  <span className="project-code">{project.projectCode}</span>

                  <h2>{project.name}</h2>

                  <p>{project.description || "No description available."}</p>
                </div>

                {/* CLIENT */}

                {project.client && (
                  <div className="project-info">
                    <Users size={16} />

                    <span>{project.client}</span>
                  </div>
                )}

                {/* DATES */}

                <div className="project-info">
                  <CalendarDays size={16} />

                  <span>
                    {project.startDate || "No start date"}

                    {" → "}

                    {project.endDate || "No end date"}
                  </span>
                </div>

                {/* HOURS */}

                <div className="project-info">
                  <Clock3 size={16} />

                  <span>
                    {project.estimatedHours || 0}

                    {" estimated hours"}
                  </span>
                </div>

                {/* PROGRESS */}

                <div className="project-progress">
                  <div className="progress-header">
                    <span>Progress</span>

                    <strong>{progress}%</strong>
                  </div>

                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${progress}%`,
                      }}
                    />
                  </div>
                </div>

                {/* PRIORITY */}

                <div className="project-card-footer">
                  <span>Priority</span>

                  <strong
                    className={`priority ${project.priority?.toLowerCase()}`}
                  >
                    {project.priority || "NORMAL"}
                  </strong>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Projects;
