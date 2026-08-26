package com.example.project_management.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.project_management.model.Task;
import com.example.project_management.repository.TaskRepository;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {

        this.taskRepository = taskRepository;
    }


    // Create task
    public Task createTask(Task task) {

        return taskRepository.save(task);
    }


    // Get all tasks
    public List<Task> getAllTasks() {

        return taskRepository.findAll();
    }


    // Get task by ID
    public Task getTaskById(Long id) {

        return taskRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Task not found with id: " + id
                        )
                );
    }


    // Get tasks by project
    public List<Task> getTasksByProject(Long projectId) {

        return taskRepository.findByProjectId(projectId);
    }


    // Get tasks assigned to employee
    public List<Task> getTasksByEmployee(Long userId) {

        return taskRepository.findByAssignedTo(userId);
    }


    // Update task
    public Task updateTask(
            Long id,
            Task updatedTask) {

        Task existingTask =
                getTaskById(id);

        existingTask.setName(
                updatedTask.getName()
        );

        existingTask.setDescription(
                updatedTask.getDescription()
        );

        existingTask.setProjectId(
                updatedTask.getProjectId()
        );

        existingTask.setAssignedTo(
                updatedTask.getAssignedTo()
        );

        existingTask.setParentTaskId(
                updatedTask.getParentTaskId()
        );

        existingTask.setPriority(
                updatedTask.getPriority()
        );

        existingTask.setStartDate(
                updatedTask.getStartDate()
        );

        existingTask.setDueDate(
                updatedTask.getDueDate()
        );

        existingTask.setEstimatedHours(
                updatedTask.getEstimatedHours()
        );

        existingTask.setActualHours(
                updatedTask.getActualHours()
        );

        existingTask.setStatus(
                updatedTask.getStatus()
        );

        return taskRepository.save(existingTask);
    }


    // Delete task
    public void deleteTask(Long id) {

        Task task =
                getTaskById(id);

        taskRepository.delete(task);
    }
    
    public Task updateTaskStatus(Long id, String status) {

        Task task = getTaskById(id);

        if (status != null) {
            status = status.replace("\"", "");
        }

        task.setStatus(status);

        return taskRepository.save(task);
    }
}