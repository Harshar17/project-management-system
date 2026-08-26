package com.example.project_management.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.project_management.model.Timesheet;
import com.example.project_management.repository.TimesheetRepository;

@Service
public class TimesheetService {

	private final TimesheetRepository timesheetRepository;

	public TimesheetService(TimesheetRepository timesheetRepository) {
		this.timesheetRepository = timesheetRepository;
	}

	// Create timesheet
	public Timesheet createTimesheet(Timesheet timesheet) {

		if (timesheet.getStatus() == null) {
			timesheet.setStatus("DRAFT");
		}

		return timesheetRepository.save(timesheet);
	}

	// Get all timesheets
	public List<Timesheet> getAllTimesheets() {
		return timesheetRepository.findAll();
	}

	// Get timesheet by ID
	public Timesheet getTimesheetById(Long id) {

		return timesheetRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Timesheet not found with id: " + id));
	}

	// Get timesheets of a particular employee
	public List<Timesheet> getTimesheetsByUser(Long userId) {
		return timesheetRepository.findByUserId(userId);
	}

	// Get timesheets of a project
	public List<Timesheet> getTimesheetsByProject(Long projectId) {
		return timesheetRepository.findByProjectId(projectId);
	}

	// Get timesheets by status
	public List<Timesheet> getTimesheetsByStatus(String status) {
		return timesheetRepository.findByStatus(status);
	}

	// Update timesheet
	// Update timesheet
	public Timesheet updateTimesheet(Long id, Timesheet updatedTimesheet) {

		Timesheet existingTimesheet = getTimesheetById(id);

		existingTimesheet.setProjectId(updatedTimesheet.getProjectId());

		existingTimesheet.setTaskId(updatedTimesheet.getTaskId());

		existingTimesheet.setDate(updatedTimesheet.getDate());

		existingTimesheet.setHours(updatedTimesheet.getHours());

		existingTimesheet.setDescription(updatedTimesheet.getDescription());

		existingTimesheet.setBillable(updatedTimesheet.getBillable());

		existingTimesheet.setRemarks(updatedTimesheet.getRemarks());

		// If employee edits a rejected timesheet,
		// make it a draft again.
		if ("REJECTED".equals(existingTimesheet.getStatus())) {
			existingTimesheet.setStatus("DRAFT");

			// Clear the old manager comment because
			// the employee is correcting the entry.
			existingTimesheet.setManagerComment(null);
		}

		return timesheetRepository.save(existingTimesheet);
	}

	// Submit timesheet
	public Timesheet submitTimesheet(Long id) {

		Timesheet timesheet = getTimesheetById(id);

		timesheet.setStatus("SUBMITTED");

		return timesheetRepository.save(timesheet);
	}

	// Approve timesheet
	public Timesheet approveTimesheet(Long id, String managerComment) {

		Timesheet timesheet = getTimesheetById(id);

		timesheet.setStatus("APPROVED");
		timesheet.setManagerComment(managerComment);

		return timesheetRepository.save(timesheet);
	}

	// Reject timesheet
	public Timesheet rejectTimesheet(Long id, String managerComment) {

		Timesheet timesheet = getTimesheetById(id);

		timesheet.setStatus("REJECTED");
		timesheet.setManagerComment(managerComment);

		return timesheetRepository.save(timesheet);
	}

	// Delete timesheet
	public void deleteTimesheet(Long id) {

		Timesheet timesheet = getTimesheetById(id);

		timesheetRepository.delete(timesheet);
	}
}