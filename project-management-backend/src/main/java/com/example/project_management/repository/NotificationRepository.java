package com.example.project_management.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.project_management.model.Notification;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByUserId(Long userId);
}