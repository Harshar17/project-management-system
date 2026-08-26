package com.example.project_management.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.example.project_management.model.Project;
import com.example.project_management.model.Task;
import com.example.project_management.model.Timesheet;
import com.example.project_management.repository.ProjectRepository;
import com.example.project_management.repository.TaskRepository;
import com.example.project_management.repository.TimesheetRepository;

@Service
public class DashboardService {

    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final TimesheetRepository timesheetRepository;

    public DashboardService(
            ProjectRepository projectRepository,
            TaskRepository taskRepository,
            TimesheetRepository timesheetRepository) {

        this.projectRepository = projectRepository;
        this.taskRepository = taskRepository;
        this.timesheetRepository = timesheetRepository;
    }

    public Map<String, Object> getDashboard() {

        List<Project> projects = projectRepository.findAll();
        List<Task> tasks = taskRepository.findAll();
        List<Timesheet> timesheets = timesheetRepository.findAll();

        // Calculate estimated and actual task hours
        double estimatedHours = 0;
        double actualHours = 0;

        for (Task task : tasks) {

            if (task.getEstimatedHours() != null) {
                estimatedHours += task.getEstimatedHours();
            }

            if (task.getActualHours() != null) {
                actualHours += task.getActualHours();
            }
        }

        // Calculate logged timesheet hours
        double loggedHours = 0;

        for (Timesheet timesheet : timesheets) {

            if (timesheet.getHours() != null) {
                loggedHours += timesheet.getHours();
            }
        }

        // Count active projects
        long activeProjects = projects.stream()
                .filter(project ->
                        project.getStatus() != null &&
                        project.getStatus()
                                .equalsIgnoreCase("ACTIVE"))
                .count();

        // Count completed projects
        long completedProjects = projects.stream()
                .filter(project ->
                        project.getStatus() != null &&
                        project.getStatus()
                                .equalsIgnoreCase("COMPLETED"))
                .count();

        // Count completed tasks
        long completedTasks = tasks.stream()
                .filter(task ->
                        task.getStatus() != null &&
                        task.getStatus()
                                .equalsIgnoreCase("COMPLETED"))
                .count();

        // Create dashboard response
        Map<String, Object> dashboard = new HashMap<>();

        dashboard.put("totalProjects", projects.size());
        dashboard.put("activeProjects", activeProjects);
        dashboard.put("completedProjects", completedProjects);

        dashboard.put("totalTasks", tasks.size());
        dashboard.put("completedTasks", completedTasks);

        dashboard.put("estimatedHours", estimatedHours);
        dashboard.put("actualHours", actualHours);
        dashboard.put("loggedHours", loggedHours);

        return dashboard;
    }
}