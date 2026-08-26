package com.example.project_management.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    private String action;

    private LocalDateTime timestamp;

    @Column(length = 2000)
    private String previousValue;

    @Column(length = 2000)
    private String newValue;

    public AuditLog() {
    }

    public AuditLog(Long id, Long userId, String action,
                    LocalDateTime timestamp,
                    String previousValue,
                    String newValue) {

        this.id = id;
        this.userId = userId;
        this.action = action;
        this.timestamp = timestamp;
        this.previousValue = previousValue;
        this.newValue = newValue;
    }

    @PrePersist
    public void onCreate() {
        timestamp = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public String getPreviousValue() {
        return previousValue;
    }

    public void setPreviousValue(String previousValue) {
        this.previousValue = previousValue;
    }

    public String getNewValue() {
        return newValue;
    }

    public void setNewValue(String newValue) {
        this.newValue = newValue;
    }
}