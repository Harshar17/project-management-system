package com.example.project_management.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.project_management.model.Notification;
import com.example.project_management.repository.NotificationRepository;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(
            NotificationRepository notificationRepository) {

        this.notificationRepository = notificationRepository;
    }

    // Create notification
    public Notification createNotification(Notification notification) {
        return notificationRepository.save(notification);
    }

    // Get notifications for a user
    public List<Notification> getUserNotifications(Long userId) {
        return notificationRepository.findByUserId(userId);
    }

    // Get notification by ID
    public Notification getNotificationById(Long id) {

        return notificationRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Notification not found with id: " + id
                        )
                );
    }

    // Mark notification as read
    public Notification markAsRead(Long id) {

        Notification notification = getNotificationById(id);

        notification.setIsRead(true);

        return notificationRepository.save(notification);
    }

    // Delete notification
    public void deleteNotification(Long id) {

        Notification notification = getNotificationById(id);

        notificationRepository.delete(notification);
    }
}