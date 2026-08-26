import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Clock3,
  Bell,
  LogOut,
  Search,
  ChevronDown,
  CalendarDays,
  ArrowUpRight,
  MoreHorizontal,
  CircleCheck,
  Circle,
  AlertCircle,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";


import {
  getDashboard,
  getEmployeeProjects,
  getEmployeeTasks,
  getEmployeeTimesheets,
} from "../../services/api";

import "./EmployeeDashboard.css";

/* =========================================================
   DEFAULT NOTIFICATIONS
   ========================================================= */

const DEFAULT_NOTIFICATIONS = [
  {
    id: 1,
    type: "task",
    title: "Task assigned",
    message: "You have been assigned a new task.",
    time: "10 minutes ago",
    unread: true,
  },
  {
    id: 2,
    type: "timesheet",
    title: "Timesheet submitted",
    message: "Your timesheet has been submitted successfully.",
    time: "2 hours ago",
    unread: true,
  },
  {
    id: 3,
    type: "approved",
    title: "Timesheet approved",
    message: "Your submitted timesheet was approved by the manager.",
    time: "Yesterday",
    unread: false,
  },
  {
    id: 4,
    type: "deadline",
    title: "Upcoming deadline",
    message: "Dashboard completion is due soon.",
    time: "Tomorrow",
    unread: false,
  },
];

/* =========================================================
   GREETING
   ========================================================= */

function getGreeting() {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    return "Good morning";
  }

  if (hour >= 12 && hour < 17) {
    return "Good afternoon";
  }

  if (hour >= 17 && hour < 21) {
    return "Good evening";
  }

  return "Good night";
}

/* =========================================================
   CURRENT DATE
   ========================================================= */

function getCurrentDate() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/* =========================================================
   USER NAME
   ========================================================= */

function getUserName() {
  return localStorage.getItem("name") || "Employee";
}

/* =========================================================
   USER INITIAL
   ========================================================= */

function getUserInitial() {
  const name = getUserName();

  return (
    name.trim().charAt(0).toUpperCase() || "E"
  );
}

/* =========================================================
   NOTIFICATIONS
   ========================================================= */

function getNotifications() {
  try {
    const stored = localStorage.getItem("notifications");

    if (!stored) {
      localStorage.setItem(
        "notifications",
        JSON.stringify(DEFAULT_NOTIFICATIONS)
      );

      return DEFAULT_NOTIFICATIONS;
    }

    const parsed = JSON.parse(stored);

    if (Array.isArray(parsed)) {
      return parsed;
    }

    return DEFAULT_NOTIFICATIONS;
  } catch (error) {
    console.error("Notification loading error:", error);

    return DEFAULT_NOTIFICATIONS;
  }
}

/* =========================================================
   SAFE ARRAY
   ========================================================= */

function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

/* =========================================================
   PROJECT HELPERS
   ========================================================= */

function getProjectName(project) {
  return (
    project.name ||
    project.projectName ||
    project.title ||
    "Untitled Project"
  );
}

function getProjectDescription(project) {
  return (
    project.description ||
    project.projectDescription ||
    "Project management and development"
  );
}

function getProjectStatus(project) {
  return (
    project.status ||
    project.projectStatus ||
    "ACTIVE"
  );
}

function getProjectProgress(project) {
  const value =
    project.progress ??
    project.completionPercentage ??
    project.progressPercentage ??
    0;

  const number = Number(value);

  if (Number.isNaN(number)) {
    return 0;
  }

  return Math.min(Math.max(number, 0), 100);
}

function getProjectInitials(project) {
  const name = getProjectName(project);

  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();

  return initials || "P";
}

/* =========================================================
   TASK HELPERS
   ========================================================= */

function getTaskTitle(task) {
  return (
    task.title ||
    task.name ||
    task.taskName ||
    "Untitled Task"
  );
}

function getTaskDescription(task) {
  return (
    task.description ||
    task.taskDescription ||
    ""
  );
}

function getTaskStatus(task) {
  return (
    task.status ||
    task.taskStatus ||
    "TODO"
  );
}

function getTaskPriority(task) {
  return (
    task.priority ||
    "MEDIUM"
  );
}

function getTaskProjectName(task, projects) {
  if (task.projectName) {
    return task.projectName;
  }

  if (task.project?.name) {
    return task.project.name;
  }

  const project = projects.find(
    (item) =>
      Number(item.id) === Number(task.projectId)
  );

  return project
    ? getProjectName(project)
    : "Project";
}

/* =========================================================
   TIMESHEET HELPERS
   ========================================================= */

function getTimesheetHours(timesheet) {
  return Number(
    timesheet.hours ??
      timesheet.totalHours ??
      timesheet.loggedHours ??
      0
  );
}

/* =========================================================
   EMPLOYEE DASHBOARD
   ========================================================= */

function EmployeeDashboard() {
  const navigate = useNavigate();

  /* =======================================================
     DASHBOARD
     ======================================================= */

  const [dashboard, setDashboard] = useState(null);

  const [dashboardLoading, setDashboardLoading] =
    useState(true);

  const [dashboardError, setDashboardError] =
    useState("");

  /* =======================================================
     EMPLOYEE PROJECTS
     ======================================================= */

  const [projects, setProjects] = useState([]);

  /* =======================================================
     EMPLOYEE TASKS
     ======================================================= */

  const [tasks, setTasks] = useState([]);

  /* =======================================================
     EMPLOYEE TIMESHEETS
     ======================================================= */

  const [timesheets, setTimesheets] = useState([]);

  /* =======================================================
     NOTIFICATIONS
     ======================================================= */

  const [unreadCount, setUnreadCount] = useState(0);

  /* =======================================================
     USER
     ======================================================= */

  const userName = getUserName();

  const userInitial = getUserInitial();

  /* =======================================================
     GREETING
     ======================================================= */

  const [greeting, setGreeting] =
    useState(getGreeting());

  /* =======================================================
     CURRENT DATE
     ======================================================= */

  const [currentDate, setCurrentDate] =
    useState(getCurrentDate());

  /* =======================================================
     LOAD ALL EMPLOYEE DATA
     ======================================================= */

  useEffect(() => {
    const loadData = async () => {
      try {
        setDashboardLoading(true);
        setDashboardError("");

        const [
          dashboardData,
          projectData,
          taskData,
          timesheetData,
        ] = await Promise.all([
          getDashboard(),
          getEmployeeProjects(),
          getEmployeeTasks(),
          getEmployeeTimesheets(),
        ]);

        console.log(
          "Employee dashboard:",
          dashboardData
        );

        console.log(
          "Employee projects:",
          projectData
        );

        console.log(
          "Employee tasks:",
          taskData
        );

        console.log(
          "Employee timesheets:",
          timesheetData
        );

        setDashboard(dashboardData);

        setProjects(
          safeArray(projectData)
        );

        setTasks(
          safeArray(taskData)
        );

        setTimesheets(
          safeArray(timesheetData)
        );
      } catch (error) {
        console.error(
          "Employee dashboard error:",
          error
        );

        setDashboardError(
          error.message ||
            "Failed to load employee dashboard"
        );
      } finally {
        setDashboardLoading(false);
      }
    };

    loadData();
  }, []);

  /* =======================================================
     NOTIFICATION COUNT
     ======================================================= */

  useEffect(() => {
    const updateNotificationCount = () => {
      try {
        const notifications =
          getNotifications();

        const count =
          notifications.filter(
            (notification) =>
              notification.unread
          ).length;

        setUnreadCount(count);
      } catch (error) {
        console.error(
          "Notification count error:",
          error
        );

        setUnreadCount(0);
      }
    };

    updateNotificationCount();

    window.addEventListener(
      "notificationsUpdated",
      updateNotificationCount
    );

    window.addEventListener(
      "storage",
      updateNotificationCount
    );

    return () => {
      window.removeEventListener(
        "notificationsUpdated",
        updateNotificationCount
      );

      window.removeEventListener(
        "storage",
        updateNotificationCount
      );
    };
  }, []);

  /* =======================================================
     UPDATE GREETING EVERY MINUTE
     ======================================================= */

  useEffect(() => {
    const updateTime = () => {
      setGreeting(getGreeting());
      setCurrentDate(getCurrentDate());
    };

    updateTime();

    const interval = setInterval(
      updateTime,
      60 * 1000
    );

    return () => {
      clearInterval(interval);
    };
  }, []);

  /* =======================================================
     LOGOUT
     ======================================================= */

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("email");
    localStorage.removeItem("name");

    navigate("/login");
  };

  /* =======================================================
     NOTIFICATIONS
     ======================================================= */

  const openNotifications = () => {
    navigate("/notifications");
  };

  /* =======================================================
     CALCULATE TASKS
     ======================================================= */

  const pendingTasks = tasks.filter(
    (task) => {
      const status =
        getTaskStatus(task).toUpperCase();

      return (
        status !== "COMPLETED" &&
        status !== "DONE"
      );
    }
  );

  const completedTasks = tasks.filter(
    (task) => {
      const status =
        getTaskStatus(task).toUpperCase();

      return (
        status === "COMPLETED" ||
        status === "DONE"
      );
    }
  );

  /* =======================================================
     CALCULATE HOURS
     ======================================================= */

  const loggedHours = timesheets.reduce(
    (total, timesheet) =>
      total +
      getTimesheetHours(timesheet),
    0
  );

  const weeklyTarget = 40;

  const remainingHours = Math.max(
    weeklyTarget - loggedHours,
    0
  );

  const weeklyPercentage =
    weeklyTarget > 0
      ? Math.min(
          Math.round(
            (loggedHours /
              weeklyTarget) *
              100
          ),
          100
        )
      : 0;

  /* =======================================================
     TODAY TASKS
     ======================================================= */

  const todayTasks = tasks.slice(0, 4);

  /* =======================================================
     UPCOMING DEADLINES
     ======================================================= */

  const upcomingDeadlines = tasks
    .filter(
      (task) =>
        task.dueDate ||
        task.deadline ||
        task.endDate
    )
    .slice(0, 3);

  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <div className="employee-layout">

      {/* =================================================
          SIDEBAR
          ================================================= */}

      <aside className="employee-sidebar">

        {/* BRAND */}

        <div className="sidebar-brand">

          <div className="sidebar-logo">
            P
          </div>

          <span>
            ProjectFlow
          </span>

        </div>


        {/* SECTION TITLE */}

        <div className="sidebar-section-title">
          WORKSPACE
        </div>


        {/* NAVIGATION */}

        <nav className="sidebar-nav">

          {/* DASHBOARD */}

          <button
            className="sidebar-item active"
            onClick={() =>
              navigate(
                "/employee/dashboard"
              )
            }
          >
            <LayoutDashboard size={18} />

            <span>
              Dashboard
            </span>
          </button>


          {/* PROJECTS */}

          <button
            className="sidebar-item"
            onClick={() =>
              navigate("/projects")
            }
          >
            <FolderKanban size={18} />

            <span>
              My Projects
            </span>
          </button>


          {/* TASKS */}

          <button
            className="sidebar-item"
            onClick={() =>
              navigate("/tasks")
            }
          >
            <CheckSquare size={18} />

            <span>
              My Tasks
            </span>
          </button>


          {/* TIMESHEETS */}

          <button
            className="sidebar-item"
            onClick={() =>
              navigate("/timesheets")
            }
          >
            <Clock3 size={18} />

            <span>
              Timesheets
            </span>
          </button>


          {/* NOTIFICATIONS */}

          <button
            className="sidebar-item"
            onClick={openNotifications}
          >
            <Bell size={18} />

            <span>
              Notifications
            </span>

            {unreadCount > 0 && (
              <span className="notification-count">
                {unreadCount}
              </span>
            )}
          </button>

        </nav>


        {/* SIDEBAR BOTTOM */}

        <div className="sidebar-bottom">

          <button
            className="sidebar-item logout-item"
            onClick={handleLogout}
          >
            <LogOut size={18} />

            <span>
              Logout
            </span>
          </button>

        </div>

      </aside>


      {/* =================================================
          MAIN CONTENT
          ================================================= */}

      <main className="employee-main">

        {/* =================================================
            TOPBAR
            ================================================= */}

        <header className="employee-topbar">

          {/* SEARCH */}

          <div className="topbar-search">

            <Search size={18} />

            <input
              type="text"
              placeholder="Search anything..."
            />

            <span className="search-shortcut">
              ⌘ K
            </span>

          </div>


          {/* RIGHT */}

          <div className="topbar-right">

            {/* NOTIFICATIONS */}

            <button
              className="topbar-icon"
              onClick={
                openNotifications
              }
              title="Notifications"
            >
              <Bell size={19} />

              {unreadCount > 0 && (
                <span className="notification-dot" />
              )}
            </button>


            {/* PROFILE */}

            <div className="profile">

              <div className="profile-avatar">
                {userInitial}
              </div>

              <div className="profile-info">

                <strong>
                  {userName}
                </strong>

                <span>
                  Employee
                </span>

              </div>

              <ChevronDown size={16} />

            </div>

          </div>

        </header>


        {/* =================================================
            CONTENT
            ================================================= */}

        <div className="employee-content">

          {/* =================================================
              WELCOME
              ================================================= */}

          <section className="welcome-section">

            <div>

              <p className="welcome-label">
                {currentDate.toUpperCase()}
              </p>

              <h1>
                {greeting}, {userName} 👋
              </h1>

              <p>
                Here's what's happening with
                your work today.
              </p>

            </div>


            <button className="date-button">

              <CalendarDays size={17} />

              Today

              <ChevronDown size={16} />

            </button>

          </section>


          {/* ERROR */}

          {dashboardError && (
            <div className="dashboard-error">
              {dashboardError}
            </div>
          )}


          {/* =================================================
              STAT CARDS
              ================================================= */}

          <section className="employee-stats">

            {/* ACTIVE PROJECTS */}

            <div className="employee-stat-card">

              <div className="stat-top">

                <div className="stat-icon purple">
                  <FolderKanban size={20} />
                </div>

                <span className="stat-change positive">
                  {projects.length}
                </span>

              </div>

              <p>
                Active Projects
              </p>

              <h2>
                {dashboardLoading
                  ? "..."
                  : projects.length}
              </h2>

              <span className="stat-description">
                Projects you're working on
              </span>

            </div>


            {/* PENDING TASKS */}

            <div className="employee-stat-card">

              <div className="stat-top">

                <div className="stat-icon blue">
                  <CheckSquare size={20} />
                </div>

                <span className="stat-change positive">
                  {pendingTasks.length}
                </span>

              </div>

              <p>
                Pending Tasks
              </p>

              <h2>
                {dashboardLoading
                  ? "..."
                  : pendingTasks.length}
              </h2>

              <span className="stat-description">
                Tasks waiting for completion
              </span>

            </div>


            {/* HOURS THIS WEEK */}

            <div className="employee-stat-card">

              <div className="stat-top">

                <div className="stat-icon orange">
                  <Clock3 size={20} />
                </div>

                <span className="stat-change">
                  {weeklyPercentage}%
                </span>

              </div>

              <p>
                Hours This Week
              </p>

              <h2>
                {dashboardLoading
                  ? "..."
                  : `${loggedHours}h`}
              </h2>

              <span className="stat-description">
                of 40 hours logged
              </span>

            </div>


            {/* COMPLETED TASKS */}

            <div className="employee-stat-card">

              <div className="stat-top">

                <div className="stat-icon green">
                  <CircleCheck size={20} />
                </div>

                <span className="stat-change positive">
                  {completedTasks.length}
                </span>

              </div>

              <p>
                Completed Tasks
              </p>

              <h2>
                {dashboardLoading
                  ? "..."
                  : completedTasks.length}
              </h2>

              <span className="stat-description">
                Completed tasks
              </span>

            </div>

          </section>


          {/* =================================================
              MAIN GRID
              ================================================= */}

          <section className="employee-dashboard-grid">

            {/* =================================================
                MY PROJECTS
                ================================================= */}

            <div className="dashboard-card projects-card">

              <div className="card-header">

                <div>

                  <h3>
                    My Projects
                  </h3>

                  <p>
                    Projects you're currently
                    working on
                  </p>

                </div>

                <button
                  className="view-all"
                  onClick={() =>
                    navigate("/projects")
                  }
                >
                  View all

                  <ArrowUpRight size={15} />
                </button>

              </div>


              <div className="project-list">

                {dashboardLoading ? (

                  <div className="dashboard-empty">
                    Loading projects...
                  </div>

                ) : projects.length === 0 ? (

                  <div className="dashboard-empty">
                    No projects assigned yet.
                  </div>

                ) : (

                  projects
                    .slice(0, 5)
                    .map((project) => {

                      const projectName =
                        getProjectName(
                          project
                        );

                      const description =
                        getProjectDescription(
                          project
                        );

                      const status =
                        getProjectStatus(
                          project
                        );

                      const progress =
                        getProjectProgress(
                          project
                        );

                      const initials =
                        getProjectInitials(
                          project
                        );

                      const isDelayed =
                        status
                          .toString()
                          .toUpperCase() ===
                        "DELAYED";

                      return (
                        <div
                          className="project-row"
                          key={project.id}
                        >

                          <div className="project-icon purple-bg">
                            {initials}
                          </div>


                          <div className="project-details">

                            <strong>
                              {projectName}
                            </strong>

                            <span>
                              {description}
                            </span>


                            <div className="progress-wrapper">

                              <div className="progress-bar">

                                <div
                                  className={`progress-value ${
                                    isDelayed
                                      ? "orange-progress"
                                      : "purple-progress"
                                  }`}
                                  style={{
                                    width: `${progress}%`,
                                  }}
                                />

                              </div>

                              <span>
                                {progress}%
                              </span>

                            </div>

                          </div>


                          <span
                            className={`status-badge ${
                              isDelayed
                                ? "delayed-status"
                                : "active-status"
                            }`}
                          >
                            {status}
                          </span>

                        </div>
                      );
                    })

                )}

              </div>

            </div>


            {/* =================================================
                TODAY'S TASKS
                ================================================= */}

            <div className="dashboard-card tasks-card">

              <div className="card-header">

                <div>

                  <h3>
                    Today's Tasks
                  </h3>

                  <p>
                    Your assigned tasks
                  </p>

                </div>

                <button
                  className="more-button"
                  onClick={() =>
                    navigate("/tasks")
                  }
                >
                  <MoreHorizontal size={20} />
                </button>

              </div>


              <div className="task-list">

                {dashboardLoading ? (

                  <div className="dashboard-empty">
                    Loading tasks...
                  </div>

                ) : todayTasks.length === 0 ? (

                  <div className="dashboard-empty">
                    No tasks assigned yet.
                  </div>

                ) : (

                  todayTasks.map((task) => {

                    const status =
                      getTaskStatus(task)
                        .toUpperCase();

                    const completed =
                      status ===
                        "COMPLETED" ||
                      status === "DONE";

                    const priority =
                      getTaskPriority(task);

                    return (
                      <div
                        className="task-item"
                        key={task.id}
                      >

                        {completed ? (
                          <CircleCheck
                            size={19}
                            className="task-completed"
                          />
                        ) : (
                          <Circle
                            size={19}
                            className="task-pending"
                          />
                        )}


                        <div>

                          <strong
                            className={
                              completed
                                ? "completed-task"
                                : ""
                            }
                          >
                            {getTaskTitle(task)}
                          </strong>

                          <span>
                            {getTaskProjectName(
                              task,
                              projects
                            )}
                          </span>

                        </div>


                        {!completed && (
                          <span
                            className={`task-priority ${priority
                              .toString()
                              .toLowerCase()}`}
                          >
                            {priority}
                          </span>
                        )}

                      </div>
                    );
                  })

                )}

              </div>

            </div>


            {/* =================================================
                TIMESHEET
                ================================================= */}

            <div className="dashboard-card timesheet-card">

              <div className="card-header">

                <div>

                  <h3>
                    This Week
                  </h3>

                  <p>
                    Timesheet summary
                  </p>

                </div>

                <button
                  className="view-all"
                  onClick={() =>
                    navigate("/timesheets")
                  }
                >
                  View timesheet

                  <ArrowUpRight size={15} />
                </button>

              </div>


              <div className="hours-summary">

                <div>

                  <span>
                    Logged
                  </span>

                  <strong>
                    {loggedHours}h
                  </strong>

                </div>


                <div>

                  <span>
                    Remaining
                  </span>

                  <strong>
                    {remainingHours}h
                  </strong>

                </div>

              </div>


              <div className="week-progress">

                <div className="week-progress-bar">

                  <div
                    style={{
                      width: `${weeklyPercentage}%`,
                    }}
                  />

                </div>

                <span>
                  {weeklyPercentage}% of
                  weekly target
                </span>

              </div>


              {/* WEEK DAYS */}

              <div className="week-days">

                {[
                  "Mon",
                  "Tue",
                  "Wed",
                  "Thu",
                  "Fri",
                ].map((day) => {

                  const dayTimesheets =
                    timesheets.filter(
                      (timesheet) => {

                        if (!timesheet.date) {
                          return false;
                        }

                        const date =
                          new Date(
                            timesheet.date
                          );

                        if (
                          Number.isNaN(
                            date.getTime()
                          )
                        ) {
                          return false;
                        }

                        return (
                          date.toLocaleDateString(
                            "en-US",
                            {
                              weekday:
                                "short",
                            }
                          ) === day
                        );
                      }
                    );

                  const hours =
                    dayTimesheets.reduce(
                      (
                        total,
                        item
                      ) =>
                        total +
                        getTimesheetHours(
                          item
                        ),
                      0
                    );

                  return (
                    <div key={day}>

                      <span>
                        {day}
                      </span>

                      <strong>
                        {hours > 0
                          ? hours
                          : "—"}
                      </strong>

                    </div>
                  );
                })}

              </div>

            </div>


            {/* =================================================
                UPCOMING DEADLINES
                ================================================= */}

            <div className="dashboard-card deadline-card">

              <div className="card-header">

                <div>

                  <h3>
                    Upcoming Deadlines
                  </h3>

                  <p>
                    Keep an eye on what's next
                  </p>

                </div>

              </div>


              <div className="deadline-list">

                {dashboardLoading ? (

                  <div className="dashboard-empty">
                    Loading deadlines...
                  </div>

                ) : upcomingDeadlines.length === 0 ? (

                  <div className="dashboard-empty">
                    No upcoming deadlines.
                  </div>

                ) : (

                  upcomingDeadlines.map(
                    (task) => {

                      const rawDate =
                        task.dueDate ||
                        task.deadline ||
                        task.endDate;

                      const date =
                        new Date(rawDate);

                      const validDate =
                        !Number.isNaN(
                          date.getTime()
                        );

                      return (
                        <div
                          className="deadline-item"
                          key={task.id}
                        >

                          <div className="deadline-date">

                            <strong>
                              {validDate
                                ? date
                                    .getDate()
                                    .toString()
                                    .padStart(
                                      2,
                                      "0"
                                    )
                                : "--"}
                            </strong>

                            <span>
                              {validDate
                                ? date
                                    .toLocaleDateString(
                                      "en-US",
                                      {
                                        month:
                                          "short",
                                      }
                                    )
                                    .toUpperCase()
                                : "---"}
                            </span>

                          </div>


                          <div>

                            <strong>
                              {getTaskTitle(
                                task
                              )}
                            </strong>

                            <span>
                              {getTaskProjectName(
                                task,
                                projects
                              )}
                            </span>

                          </div>


                          <AlertCircle
                            size={18}
                            className="deadline-warning"
                          />

                        </div>
                      );
                    }
                  )

                )}

              </div>

            </div>

          </section>

        </div>

      </main>

    </div>
  );
}

export default EmployeeDashboard;