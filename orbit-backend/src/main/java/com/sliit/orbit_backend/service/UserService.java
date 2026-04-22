package com.sliit.orbit_backend.service;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.sliit.orbit_backend.dto.response.UserResponse;
import com.sliit.orbit_backend.model.User;
import com.sliit.orbit_backend.model.enums.Role;
import com.sliit.orbit_backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    // Get all users — Admin only
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::mapToUserResponse)
                .collect(Collectors.toList());
    }

    // Get single user by ID — Admin only
    public UserResponse getUserById(String id) {
        User user = userRepository.findById(Objects.requireNonNull(id, "User id must not be null"))
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        return mapToUserResponse(user);
    }

    // Update a user's role — Admin only
    public UserResponse updateUserRole(String id, String newRole) {
        User user = userRepository.findById(Objects.requireNonNull(id, "User id must not be null"))
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        try {
            user.setRole(Role.valueOf(newRole.toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid role: " + newRole + ". Valid roles: USER, ADMIN, TECHNICIAN");
        }

        User updated = userRepository.save(user);
        return mapToUserResponse(updated);
    }

    // Delete a user — Admin only
    public void deleteUser(String id) {
        String userId = Objects.requireNonNull(id, "User id must not be null");
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("User not found with id: " + id);
        }
        userRepository.deleteById(userId);
    }

    // Helper: map User model → UserResponse DTO
    private UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .provider(user.getProvider().name())
                .profilePicture(user.getProfilePicture())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
