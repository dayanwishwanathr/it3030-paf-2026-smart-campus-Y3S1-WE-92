package com.sliit.orbit_backend.service;

import com.sliit.orbit_backend.dto.request.LoginRequest;
import com.sliit.orbit_backend.dto.request.RegisterRequest;
import com.sliit.orbit_backend.dto.response.AuthResponse;
import com.sliit.orbit_backend.model.User;
import com.sliit.orbit_backend.model.enums.AuthProvider;
import com.sliit.orbit_backend.model.enums.Role;
import com.sliit.orbit_backend.repository.UserRepository;
import com.sliit.orbit_backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthResponse register(RegisterRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        if (userRepository.findByEmailIgnoreCase(email).isPresent()) {
            throw new IllegalArgumentException("Email is already registered");
        }

        // Build and save new user
        User user = User.builder()
                .name(request.getName())
                .email(email)
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .provider(AuthProvider.LOCAL)
                .build();

        User saved = userRepository.save(Objects.requireNonNull(user, "User must not be null"));

        // Generate token and return response
        String token = jwtUtil.generateToken(saved.getEmail(), saved.getRole().name());

        return AuthResponse.builder()
                .token(token)
                .id(saved.getId())
                .name(saved.getName())
                .email(saved.getEmail())
                .role(saved.getRole().name())
                .profilePicture(saved.getProfilePicture())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        // Block Google OAuth users from password login
        if (user.getProvider() == AuthProvider.GOOGLE) {
            throw new BadCredentialsException("This account uses Google Sign-In. Please login with Google.");
        }

        // Verify password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid email or password");
        }

        // Generate token and return response
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());

        return buildAuthResponse(token, user);
    }

    public AuthResponse getCurrentUser(String email) {
        // Sanitize email from JWT — trim whitespace and lowercase for consistent lookup
        String normalizedEmail = email == null ? null : email.trim().toLowerCase();
        User user = userRepository.findByEmailIgnoreCase(
                Objects.requireNonNull(normalizedEmail, "Email must not be null"))
                .orElseThrow(() -> new RuntimeException("User not found: " + email));

        // Always generate a fresh token so verified/campusId are up-to-date
        String token = jwtUtil.generateToken(
                user.getEmail(), user.getRole().name(),
                user.getCampusId(), user.isVerified());

        return buildAuthResponse(token, user);
    }

    // ── Helper ────────────────────────────────────────────────────────────────
    private AuthResponse buildAuthResponse(String token, User user) {
        return AuthResponse.builder()
                .token(token)
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .profilePicture(user.getProfilePicture())
                .build();
    }
}
