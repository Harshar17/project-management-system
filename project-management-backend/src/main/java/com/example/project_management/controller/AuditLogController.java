package com.example.project_management.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.project_management.model.AuditLog;
import com.example.project_management.service.AuditLogService;

@RestController
@RequestMapping("/api/audit-logs")
@CrossOrigin
public class AuditLogController {

    private final AuditLogService auditLogService;

    public AuditLogController(AuditLogService auditLogService) {
        this.auditLogService = auditLogService;
    }

    // Create audit log
    @PostMapping
    public AuditLog createAuditLog(
            @RequestBody AuditLog auditLog) {

        return auditLogService.createAuditLog(auditLog);
    }

    // Get all audit logs
    @GetMapping
    public List<AuditLog> getAllAuditLogs() {
        return auditLogService.getAllAuditLogs();
    }

    // Get audit log by ID
    @GetMapping("/{id}")
    public AuditLog getAuditLogById(
            @PathVariable Long id) {

        return auditLogService.getAuditLogById(id);
    }

    // Get audit logs for a user
    @GetMapping("/user/{userId}")
    public List<AuditLog> getUserAuditLogs(
            @PathVariable Long userId) {

        return auditLogService.getUserAuditLogs(userId);
    }
}