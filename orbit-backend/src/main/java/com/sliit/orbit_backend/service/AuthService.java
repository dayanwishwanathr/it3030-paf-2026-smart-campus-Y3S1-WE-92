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
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already registered");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .provider(AuthProvider.LOCAL)
                .verified(false)
                .build();

        User saved = userRepository.save(Objects.requireNonNull(user, "User must not be null"));

        String token = jwtUtil.generateToken(
                saved.getEmail(), saved.getRole().name(),
                saved.getCampusId(), saved.isVerified());

        return buildAuthResponse(token, saved);
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        // Allow Google OAuth users who have set a password via profile page
        if (user.getProvider() == AuthProvider.GOOGLE && user.getPassword() == null) {
            throw new BadCredentialsException("This account uses Google Sign-In. Please login with Google.");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(
                user.getEmail(), user.getRole().name(),
                user.getCampusId(), user.isVerified());

        return buildAuthResponse(token, user);
    }

    public AuthResponse getCurrentUser(String email) {
        User user = userRepository.findByEmail(Objects.requireNonNull(email, "Email must not be null"))
                .orElseThrow(() -> new RuntimeException("User not found"));

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
                .campusId(user.getCampusId())
                .faculty(user.getFaculty())
                .verified(user.isVerified())
                .build();
    }
}
