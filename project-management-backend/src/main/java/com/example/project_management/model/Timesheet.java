package com.example.project_management.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "timesheets")
public class Timesheet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    private Long projectId;

    private Long taskId;

    private LocalDate date;

    private Double hours;

    @Column(length = 2000)
    private String description;

    private Boolean billable;

    private String remarks;

    private String status;

    private String managerComment;

    public Timesheet() {
    }

    public Timesheet(Long id, Long userId, Long projectId,
                     Long taskId, LocalDate date, Double hours,
                     String description, Boolean billable,
                     String remarks, String status,
                     String managerComment) {

        this.id = id;
        this.userId = userId;
        this.projectId = projectId;
        this.taskId = taskId;
        this.date = date;
        this.hours = hours;
        this.description = description;
        this.billable = billable;
        this.remarks = remarks;
        this.status = status;
        this.managerComment = managerComment;
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

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public Long getTaskId() {
        return taskId;
    }

    public void setTaskId(Long taskId) {
        this.taskId = taskId;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Double getHours() {
        return hours;
    }

    public void setHours(Double hours) {
        this.hours = hours;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Boolean getBillable() {
        return billable;
    }

    public void setBillable(Boolean billable) {
        this.billable = billable;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getManagerComment() {
        return managerComment;
    }

    public void setManagerComment(String managerComment) {
        this.managerComment = managerComment;
    }
}