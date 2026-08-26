package com.example.project_management.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.project_management.model.AuditLog;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    List<AuditLog> findByUserId(Long userId);
}