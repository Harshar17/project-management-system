package com.example.project_management.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.project_management.model.Project;
import com.example.project_management.repository.ProjectRepository;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    // Create project
    public Project createProject(Project project) {
        return projectRepository.save(project);
    }

    // Get all projects
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    // Get project by ID
    public Project getProjectById(Long id) {

        return projectRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Project not found with id: " + id
                        )
                );
    }

    // Get projects created by manager
    public List<Project> getProjectsByManager(Long managerId) {
        return projectRepository.findByManagerId(managerId);
    }

    // Get projects assigned to employee
    public List<Project> getProjectsByEmployee(Long employeeId) {
        return projectRepository.findByEmployeeId(employeeId);
    }

    // Get projects by IDs
    public List<Project> getProjectsByIds(List<Long> ids) {

        if (ids == null || ids.isEmpty()) {
            return List.of();
        }

        return projectRepository.findByIdIn(ids);
    }

    // Update project
    public Project updateProject(
            Long id,
            Project updatedProject) {

        Project existingProject = getProjectById(id);

        existingProject.setProjectCode(
                updatedProject.getProjectCode()
        );

        existingProject.setName(
                updatedProject.getName()
        );

        existingProject.setDescription(
                updatedProject.getDescription()
        );

        existingProject.setClient(
                updatedProject.getClient()
        );

        existingProject.setManagerId(
                updatedProject.getManagerId()
        );

        existingProject.setEmployeeId(
                updatedProject.getEmployeeId()
        );

        existingProject.setStartDate(
                updatedProject.getStartDate()
        );

        existingProject.setEndDate(
                updatedProject.getEndDate()
        );

        existingProject.setPriority(
                updatedProject.getPriority()
        );

        existingProject.setStatus(
                updatedProject.getStatus()
        );

        existingProject.setBudget(
                updatedProject.getBudget()
        );

        existingProject.setEstimatedHours(
                updatedProject.getEstimatedHours()
        );

        return projectRepository.save(existingProject);
    }

    // Delete project
    public void deleteProject(Long id) {

        Project project = getProjectById(id);

        projectRepository.delete(project);
    }
}