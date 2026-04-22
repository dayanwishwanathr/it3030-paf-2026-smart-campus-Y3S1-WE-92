package com.sliit.orbit_backend.init;

import java.util.Objects;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.sliit.orbit_backend.model.User;
import com.sliit.orbit_backend.model.enums.AuthProvider;
import com.sliit.orbit_backend.model.enums.Role;
import com.sliit.orbit_backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository     userRepository;
    private final PasswordEncoder    passwordEncoder;

    @Override
    public void run(String... args) {
        seedAdmin();
        seedManager();
    }

    // ── Admin ─────────────────────────────────────────────────────────────────
    private void seedAdmin() {
        String email = "admin@sliitorbit.lk";
        if (!userRepository.existsByEmail(email)) {
            User adminUser = User.builder()
                    .name("Orbit Admin")
                    .email(email)
                    .password(passwordEncoder.encode("Admin@1234"))
                    .role(Role.ADMIN)
                    .provider(AuthProvider.LOCAL)
                    .build();
            userRepository.save(Objects.requireNonNull(adminUser, "Admin user must not be null"));
            log.info("✅ Admin seeded → {}", email);
        } else {
            log.info("ℹ️  Admin already exists, skipping.");
        }
    }

    // ── Manager ───────────────────────────────────────────────────────────────
    private void seedManager() {
        String email = "manager@sliitorbit.lk";
        if (!userRepository.existsByEmail(email)) {
            User managerUser = User.builder()
                    .name("Orbit Manager")
                    .email(email)
                    .password(passwordEncoder.encode("Manager@1234"))
                    .role(Role.MANAGER)
                    .provider(AuthProvider.LOCAL)
                    .build();
            userRepository.save(Objects.requireNonNull(managerUser, "Manager user must not be null"));
            log.info("✅ Manager seeded → {}", email);
        } else {
            log.info("ℹ️  Manager already exists, skipping.");
        }
    }
}
