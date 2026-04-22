package com.sliit.orbit_backend.service;

import java.util.List;
import java.util.Objects;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.sliit.orbit_backend.dto.request.UpdateProfileRequest;
import com.sliit.orbit_backend.dto.response.UserResponse;
import com.sliit.orbit_backend.model.User;
import com.sliit.orbit_backend.model.enums.Role;
import com.sliit.orbit_backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // ── Campus ID validation ───────────────────────────────────────────────────
    private static final Pattern CAMPUS_ID_PATTERN =
            Pattern.compile("^(IT|EN|BM|HS)\\d{8}$", Pattern.CASE_INSENSITIVE);

    private String deriveFaculty(String campusId) {
        return switch (campusId.substring(0, 2).toUpperCase()) {
            case "IT" -> "Computing";
            case "EN" -> "Engineering";
            case "BM" -> "Business";
            case "HS" -> "Humanities & Science";
            default   -> "Unknown";
        };
    }

    // ── Admin endpoints ────────────────────────────────────────────────────────

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
            throw new IllegalArgumentException("Invalid role: " + newRole + ". Valid roles: USER, ADMIN, MANAGER, TECHNICIAN");
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

    // ── Self-service profile endpoints ─────────────────────────────────────────

    // Get own profile by email
    public UserResponse getMyProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return mapToUserResponse(user);
    }

    // Update own profile — name, campusId, password, profilePicture
    public UserResponse updateProfile(String email, UpdateProfileRequest req) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Name update
        if (req.getName() != null && !req.getName().isBlank()) {
            user.setName(req.getName().trim());
        }

        // Password update (allows Google users to set a password too)
        if (req.getPassword() != null && !req.getPassword().isBlank()) {
            if (req.getPassword().length() < 6) {
                throw new IllegalArgumentException("Password must be at least 6 characters");
            }
            user.setPassword(passwordEncoder.encode(req.getPassword()));
        }

        // Profile picture URL (uploaded directly to Cloudinary by frontend)
        if (req.getProfilePicture() != null && !req.getProfilePicture().isBlank()) {
            user.setProfilePicture(req.getProfilePicture());
        }

        // Campus ID — triggers verification
        if (req.getCampusId() != null && !req.getCampusId().isBlank()) {
            String cid = req.getCampusId().toUpperCase().trim();

            if (!CAMPUS_ID_PATTERN.matcher(cid).matches()) {
                throw new IllegalArgumentException(
                    "Invalid Student ID format. Expected format: IT23413474, EN23413474, BM23413474, or HS23413474");
            }

            // Uniqueness check — another user shouldn't have the same campusId
            userRepository.findByCampusId(cid).ifPresent(existing -> {
                if (!existing.getEmail().equals(email)) {
                    throw new IllegalArgumentException("This Student ID is already registered to another account");
                }
            });

            user.setCampusId(cid);
            user.setFaculty(deriveFaculty(cid));
            user.setVerified(true);
        }

        return mapToUserResponse(userRepository.save(user));
    }

    // ── Helper ────────────────────────────────────────────────────────────────

    public UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .provider(user.getProvider().name())
                .profilePicture(user.getProfilePicture())
                .createdAt(user.getCreatedAt())
                .campusId(user.getCampusId())
                .faculty(user.getFaculty())
                .verified(user.isVerified())
                .build();
    }
}
