const API_BASE_URL = "http://localhost:8081/api";

// ========================================
// LOGIN
// ========================================

export async function loginUser(email, password) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data;
}

// ========================================
// DASHBOARD
// ========================================

export async function getDashboard() {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/dashboard`, {
    method: "GET",

    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error("Session expired. Please login again.");
    }

    throw new Error("Failed to load dashboard");
  }

  return await response.json();
}

// ========================================
// EMPLOYEE TASKS
// ========================================

export async function getEmployeeTasks() {
  const token = localStorage.getItem("token");

  const userId = localStorage.getItem("userId");

  if (!userId) {
    throw new Error("User ID not found. Please login again.");
  }

  const response = await fetch(`${API_BASE_URL}/tasks/employee/${userId}`, {
    method: "GET",

    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error("Session expired. Please login again.");
    }

    throw new Error("Failed to load tasks");
  }

  return await response.json();
}

// ========================================
// EMPLOYEE PROJECTS
// ========================================

export async function getEmployeeProjects() {
  const token = localStorage.getItem("token");
  const employeeId = localStorage.getItem("userId");

  if (!employeeId) {
    throw new Error("Employee ID not found. Please login again.");
  }

  const response = await fetch(
    `${API_BASE_URL}/projects/employee/${employeeId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error("Session expired. Please login again.");
    }

    throw new Error("Failed to load employee projects");
  }

  return await response.json();
}

// ========================================
// GET ALL PROJECTS
// ========================================

export async function getProjects() {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/projects`, {
    method: "GET",

    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error("Session expired. Please login again.");
    }

    throw new Error("Failed to load projects");
  }

  return await response.json();
}

// ========================================
// CREATE TASK
// ========================================

export async function createTask(task) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/tasks`, {
    method: "POST",

    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },

    body: JSON.stringify(task),
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error("Session expired. Please login again.");
    }

    const text = await response.text();

    throw new Error(text || "Failed to create task");
  }

  return await response.json();
}

// ========================================
// UPDATE TASK STATUS
// ========================================

export async function updateTaskStatus(taskId, status) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/status`, {
    method: "PUT",

    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },

    body: JSON.stringify(status),
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error("Session expired. Please login again.");
    }

    throw new Error("Failed to update task status");
  }

  return await response.json();
}

// ========================================
// TIMESHEETS
// ========================================

export async function getEmployeeTimesheets() {
  const token = localStorage.getItem("token");

  const userId = localStorage.getItem("userId");

  if (!userId) {
    throw new Error("User ID not found. Please login again.");
  }

  const response = await fetch(`${API_BASE_URL}/timesheets/user/${userId}`, {
    method: "GET",

    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error("Session expired. Please login again.");
    }

    throw new Error("Failed to load timesheets");
  }

  return await response.json();
}

// ========================================
// CREATE TIMESHEET
// ========================================

export async function createTimesheet(timesheet) {
  const token = localStorage.getItem("token");

  const userId = localStorage.getItem("userId");

  if (!userId) {
    throw new Error("User ID not found. Please login again.");
  }

  const response = await fetch(`${API_BASE_URL}/timesheets`, {
    method: "POST",

    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      ...timesheet,
      userId: Number(userId),
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create timesheet");
  }

  return await response.json();
}

// ========================================
// SUBMIT TIMESHEET
// ========================================

export async function submitTimesheet(id) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/timesheets/${id}/submit`, {
    method: "PUT",

    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to submit timesheet");
  }

  return await response.json();
}

// ========================================
// UPDATE TIMESHEET
// ========================================

export async function updateTimesheet(id, timesheet) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/timesheets/${id}`, {
    method: "PUT",

    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },

    body: JSON.stringify(timesheet),
  });

  if (!response.ok) {
    throw new Error("Failed to update timesheet");
  }

  return await response.json();
}

// ========================================
// DELETE TIMESHEET
// ========================================

export async function deleteTimesheet(id) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/timesheets/${id}`, {
    method: "DELETE",

    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete timesheet");
  }

  return await response.text();
}

// ========================================
// GET SUBMITTED TIMESHEETS
// ========================================

export async function getSubmittedTimesheets() {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/timesheets/status/SUBMITTED`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to load submitted timesheets");
  }

  return await response.json();
}

// ========================================
// GET ALL TIMESHEETS
// ========================================

export async function getAllTimesheets() {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_BASE_URL}/timesheets`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error("Session expired. Please login again.");
    }

    throw new Error("Failed to load all timesheets");
  }

  return await response.json();
}

// ========================================
// APPROVE TIMESHEET
// ========================================

export async function approveTimesheet(id, comment = "") {
  const token = localStorage.getItem("token");

  const url =
    `${API_BASE_URL}/timesheets/${id}/approve` +
    `?comment=${encodeURIComponent(comment)}`;

  const response = await fetch(url, {
    method: "PUT",

    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const text = await response.text();

    console.error("Approve failed:", response.status, text);

    throw new Error(text || "Failed to approve timesheet");
  }

  return await response.json();
}

// ========================================
// REJECT TIMESHEET
// ========================================

export async function rejectTimesheet(id, comment = "") {
  const token = localStorage.getItem("token");

  const url =
    `${API_BASE_URL}/timesheets/${id}/reject` +
    `?comment=${encodeURIComponent(comment)}`;

  const response = await fetch(url, {
    method: "PUT",

    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const text = await response.text();

    console.error("Reject failed:", response.status, text);

    throw new Error(text || "Failed to reject timesheet");
  }

  return await response.json();
}

export async function register(data) {
  const response = await fetch("http://localhost:8081/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || result.error || "Registration failed");
  }

  return result;
}
