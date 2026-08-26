package com.example.project_management.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.project_management.model.User;
import com.example.project_management.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Get all employees
    public List<User> getEmployees() {
        return userRepository.findByRole("EMPLOYEE");
    }

    // Get all project managers
    public List<User> getProjectManagers() {
        return userRepository.findByRole("PROJECT_MANAGER");
    }

    // Get all users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}