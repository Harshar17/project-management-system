package com.example.project_management.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.project_management.model.Project;
import com.example.project_management.service.ProjectService;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    // Create project
    @PostMapping
    public Project createProject(
            @RequestBody Project project) {

        return projectService.createProject(project);
    }

    // Get all projects
    @GetMapping
    public List<Project> getAllProjects() {

        return projectService.getAllProjects();
    }

    // Get projects by manager
    @GetMapping("/manager/{managerId}")
    public List<Project> getProjectsByManager(
            @PathVariable Long managerId) {

        return projectService.getProjectsByManager(managerId);
    }

    // Get projects assigned to employee
    @GetMapping("/employee/{employeeId}")
    public List<Project> getProjectsByEmployee(
            @PathVariable Long employeeId) {

        return projectService.getProjectsByEmployee(employeeId);
    }

    // Get projects by IDs
    @PostMapping("/by-ids")
    public List<Project> getProjectsByIds(
            @RequestBody List<Long> ids) {

        return projectService.getProjectsByIds(ids);
    }

    // Get project by ID
    @GetMapping("/{id}")
    public Project getProjectById(
            @PathVariable Long id) {

        return projectService.getProjectById(id);
    }

    // Update project
    @PutMapping("/{id}")
    public Project updateProject(
            @PathVariable Long id,
            @RequestBody Project project) {

        return projectService.updateProject(
                id,
                project
        );
    }

    // Delete project
    @DeleteMapping("/{id}")
    public String deleteProject(
            @PathVariable Long id) {

        projectService.deleteProject(id);

        return "Project deleted successfully";
    }
}