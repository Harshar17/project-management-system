package com.example.project_management.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.project_management.model.AuditLog;
import com.example.project_management.repository.AuditLogRepository;

@Service
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public AuditLogService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    // Create audit log
    public AuditLog createAuditLog(AuditLog auditLog) {
        return auditLogRepository.save(auditLog);
    }

    // Get all audit logs
    public List<AuditLog> getAllAuditLogs() {
        return auditLogRepository.findAll();
    }

    // Get audit logs for a user
    public List<AuditLog> getUserAuditLogs(Long userId) {
        return auditLogRepository.findByUserId(userId);
    }

    // Get audit log by ID
    public AuditLog getAuditLogById(Long id) {

        return auditLogRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Audit log not found with id: " + id
                        )
                );
    }
}