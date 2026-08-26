package com.example.project_management.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.project_management.model.Project;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    List<Project> findByManagerId(Long managerId);

    List<Project> findByEmployeeId(Long employeeId);

    List<Project> findByIdIn(List<Long> ids);
}