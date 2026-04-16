package com.sliit.orbit_backend.init;

import com.sliit.orbit_backend.model.User;
import com.sliit.orbit_backend.model.enums.AuthProvider;
import com.sliit.orbit_backend.model.enums.Role;
import com.sliit.orbit_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedAdmin();
    }

    private void seedAdmin() {
        String adminEmail = "admin@sliitorbit.lk";

        if (!userRepository.existsByEmail(adminEmail)) {
            User admin = User.builder()
                    .name("Orbit Admin")
                    .email(adminEmail)
                    .password(passwordEncoder.encode("Admin@1234"))
                    .role(Role.ADMIN)
                    .provider(AuthProvider.LOCAL)
                    .build();

            userRepository.save(admin);
            log.info("✅ Admin user seeded successfully → {}", adminEmail);
        } else {
            log.info("ℹ️  Admin user already exists, skipping seed.");
        }
    }
}
