package com.sliit.orbit_backend.controller;

import com.sliit.orbit_backend.dto.request.LoginRequest;
import com.sliit.orbit_backend.dto.request.RegisterRequest;
import com.sliit.orbit_backend.dto.response.AuthResponse;
import com.sliit.orbit_backend.security.JwtUtil;
import com.sliit.orbit_backend.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtUtil jwtUtil;

    // POST /api/auth/register
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            log.info("📝 Register endpoint called for: {}", request.getEmail());
            AuthResponse response = authService.register(request);
            log.info("✅ Registration successful for: {}", request.getEmail());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            log.warn("⚠️ Registration failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            log.error("💥 Registration error: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Registration failed: " + e.getMessage()));
        }
    }

    // POST /api/auth/login
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            log.info("🔐 Login endpoint called for: {}", request.getEmail());
            AuthResponse response = authService.login(request);
            log.info("✅ Login successful for: {}", request.getEmail());
            return ResponseEntity.ok(response);
        } catch (BadCredentialsException e) {
            log.warn("❌ Login failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            log.error("💥 Login error: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Login failed: " + e.getMessage()));
        }
    }

    // GET /api/auth/me  — returns currently logged-in user info
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication,
                                            HttpServletRequest request) {
        try {
            if (authentication == null) {
                log.warn("⚠️ /auth/me called but Authentication is null");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Not authenticated"));
            }

            // ── Resolve email from whichever auth mechanism is active ───────────
            String email = null;

            // 1. JWT path: extract email directly from Bearer token (most reliable)
            String authHeader = request.getHeader("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                if (jwtUtil.isTokenValid(token)) {
                    email = jwtUtil.extractEmail(token);
                }
            }

            // 2. OAuth2 session path: principal is an OAuth2User — get email attribute
            if (email == null && authentication.getPrincipal() instanceof OAuth2User oAuth2User) {
                email = oAuth2User.getAttribute("email");
            }

            // 3. Last resort: use getName() (works when principal is UserDetails with email as username)
            if (email == null) {
                email = authentication.getName();
            }

            log.info("👤 /auth/me → resolved email = [{}]", email);
            AuthResponse response = authService.getCurrentUser(email);
            log.info("✅ Current user fetched: {}", email);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            log.warn("⚠️ User not found in DB: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            log.error("💥 Get user error: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to get user: " + e.getMessage()));
        }
    }
}
