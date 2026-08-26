import React, { useState } from "react";
import {
  Bell,
  Check,
  Clock3,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import "./Notifications.css";

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

function getStoredNotifications() {
  try {
    const stored = localStorage.getItem("notifications");

    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Failed to load notifications:", error);
  }

  return DEFAULT_NOTIFICATIONS;
}

function Notifications() {
  const [notifications, setNotifications] = useState(
    getStoredNotifications()
  );

  // =========================================
  // SAVE NOTIFICATIONS
  // =========================================

  const saveNotifications = (updatedNotifications) => {
    setNotifications(updatedNotifications);

    localStorage.setItem(
      "notifications",
      JSON.stringify(updatedNotifications)
    );

    // Tell EmployeeDashboard that notification count changed
    window.dispatchEvent(new Event("notificationsUpdated"));
  };

  // =========================================
  // UNREAD COUNT
  // =========================================

  const unreadCount = notifications.filter(
    (notification) => notification.unread
  ).length;

  // =========================================
  // MARK ALL AS READ
  // =========================================

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map((notification) => ({
      ...notification,
      unread: false,
    }));

    saveNotifications(updatedNotifications);
  };

  // =========================================
  // MARK ONE AS READ
  // =========================================

  const markAsRead = (id) => {
    const updatedNotifications = notifications.map((notification) =>
      notification.id === id
        ? {
            ...notification,
            unread: false,
          }
        : notification
    );

    saveNotifications(updatedNotifications);
  };

  // =========================================
  // ICON
  // =========================================

  const getIcon = (type) => {
    switch (type) {
      case "task":
        return <Bell size={22} />;

      case "timesheet":
        return <Clock3 size={22} />;

      case "approved":
        return <CheckCircle2 size={22} />;

      case "deadline":
        return <AlertCircle size={22} />;

      default:
        return <Bell size={22} />;
    }
  };

  return (
    <div className="notifications-page">

      {/* HEADER */}
      <div className="notifications-header">

        <div>
          <p className="notifications-label">
            WORKSPACE
          </p>

          <h1>Notifications</h1>

          <p className="notifications-subtitle">
            Stay updated with your projects and tasks.
          </p>
        </div>

        <button
          className="mark-all-button"
          onClick={markAllAsRead}
          disabled={unreadCount === 0}
        >
          <Check size={17} />

          {unreadCount === 0
            ? "All read"
            : "Mark all as read"}
        </button>

      </div>

      {/* SUMMARY */}
      <div className="notification-summary">

        <div className="notification-summary-icon">
          <Bell size={25} />
        </div>

        <div className="notification-summary-content">

          <span>
            Notifications
          </span>

          <strong>
            {unreadCount} unread
          </strong>

        </div>

      </div>

      {/* NOTIFICATIONS CARD */}
      <div className="notifications-card">

        <div className="notifications-card-header">

          <div>
            <h2>
              Recent Notifications
            </h2>

            <p>
              Your latest activity and updates
            </p>
          </div>

        </div>

        {/* NOTIFICATION LIST */}
        <div className="notification-list">

          {notifications.length === 0 ? (

            <div className="notifications-empty">

              <CheckCircle2 size={42} />

              <h3>
                You're all caught up
              </h3>

              <p>
                There are no notifications at the moment.
              </p>

            </div>

          ) : (

            notifications.map((notification) => (

              <div
                key={notification.id}
                className={`notification-item ${
                  notification.unread
                    ? "notification-unread"
                    : ""
                }`}
                onClick={() => markAsRead(notification.id)}
              >

                {/* ICON */}
                <div className="notification-icon">
                  {getIcon(notification.type)}
                </div>

                {/* CONTENT */}
                <div className="notification-content">

                  <div className="notification-title-row">

                    <h3>
                      {notification.title}
                    </h3>

                    {notification.unread && (
                      <span className="unread-dot"></span>
                    )}

                  </div>

                  <p>
                    {notification.message}
                  </p>

                  <span className="notification-time">
                    {notification.time}
                  </span>

                </div>

                {/* READ BUTTON */}
                {notification.unread && (

                  <button
                    className="notification-read-button"
                    title="Mark as read"
                    onClick={(event) => {
                      event.stopPropagation();
                      markAsRead(notification.id);
                    }}
                  >
                    <Check size={16} />
                  </button>

                )}

              </div>

            ))

          )}

        </div>

      </div>

    </div>
  );
}

export default Notifications;