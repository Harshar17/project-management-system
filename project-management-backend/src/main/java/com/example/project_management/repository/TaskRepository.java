package com.example.project_management.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.project_management.model.Task;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByProjectId(Long projectId);

    List<Task> findByAssignedTo(Long userId);
}