package com.example.project_management.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.project_management.model.Timesheet;
import com.example.project_management.service.TimesheetService;

@RestController
@RequestMapping("/api/timesheets")
@CrossOrigin
public class TimesheetController {

    private final TimesheetService timesheetService;

    public TimesheetController(TimesheetService timesheetService) {
        this.timesheetService = timesheetService;
    }

    // Create timesheet
    @PostMapping
    public Timesheet createTimesheet(
            @RequestBody Timesheet timesheet) {

        return timesheetService.createTimesheet(timesheet);
    }

    // Get all timesheets
    @GetMapping
    public List<Timesheet> getAllTimesheets() {
        return timesheetService.getAllTimesheets();
    }

    // Get timesheet by ID
    @GetMapping("/{id}")
    public Timesheet getTimesheetById(
            @PathVariable Long id) {

        return timesheetService.getTimesheetById(id);
    }

    // Get employee's timesheets
    @GetMapping("/user/{userId}")
    public List<Timesheet> getTimesheetsByUser(
            @PathVariable Long userId) {

        return timesheetService.getTimesheetsByUser(userId);
    }

    // Get project timesheets
    @GetMapping("/project/{projectId}")
    public List<Timesheet> getTimesheetsByProject(
            @PathVariable Long projectId) {

        return timesheetService.getTimesheetsByProject(projectId);
    }

    // Get timesheets by status
    @GetMapping("/status/{status}")
    public List<Timesheet> getTimesheetsByStatus(
            @PathVariable String status) {

        return timesheetService.getTimesheetsByStatus(status);
    }

    // Update timesheet
    @PutMapping("/{id}")
    public Timesheet updateTimesheet(
            @PathVariable Long id,
            @RequestBody Timesheet timesheet) {

        return timesheetService.updateTimesheet(id, timesheet);
    }

    // Submit timesheet
    @PutMapping("/{id}/submit")
    public Timesheet submitTimesheet(
            @PathVariable Long id) {

        return timesheetService.submitTimesheet(id);
    }

    // Approve timesheet
    @PutMapping("/{id}/approve")
    public Timesheet approveTimesheet(
            @PathVariable Long id,
            @RequestParam(required = false) String comment) {

        return timesheetService.approveTimesheet(id, comment);
    }

    // Reject timesheet
    @PutMapping("/{id}/reject")
    public Timesheet rejectTimesheet(
            @PathVariable Long id,
            @RequestParam(required = false) String comment) {

        return timesheetService.rejectTimesheet(id, comment);
    }

    // Delete timesheet
    @DeleteMapping("/{id}")
    public String deleteTimesheet(
            @PathVariable Long id) {

        timesheetService.deleteTimesheet(id);

        return "Timesheet deleted successfully";
    }
}