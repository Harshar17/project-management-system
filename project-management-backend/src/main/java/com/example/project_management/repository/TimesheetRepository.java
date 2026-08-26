package com.example.project_management.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.project_management.model.Timesheet;

public interface TimesheetRepository extends JpaRepository<Timesheet, Long> {

    List<Timesheet> findByUserId(Long userId);

    List<Timesheet> findByProjectId(Long projectId);

    List<Timesheet> findByStatus(String status);
}