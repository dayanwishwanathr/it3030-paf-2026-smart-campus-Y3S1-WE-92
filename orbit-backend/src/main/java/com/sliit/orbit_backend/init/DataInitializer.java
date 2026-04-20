package com.sliit.orbit_backend.init;

import com.sliit.orbit_backend.model.Resource;
import com.sliit.orbit_backend.model.User;
import com.sliit.orbit_backend.model.enums.AuthProvider;
import com.sliit.orbit_backend.model.enums.Role;
import com.sliit.orbit_backend.repository.ResourceRepository;
import com.sliit.orbit_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository     userRepository;
    private final PasswordEncoder    passwordEncoder;
    private final ResourceRepository resourceRepository;

    @Override
    public void run(String... args) {
        seedAdmin();
        seedManager();
        seedResources();
    }

    // ── Admin ─────────────────────────────────────────────────────────────────
    private void seedAdmin() {
        String email = "admin@sliitorbit.lk";
        if (!userRepository.existsByEmail(email)) {
            userRepository.save(User.builder()
                    .name("Orbit Admin")
                    .email(email)
                    .password(passwordEncoder.encode("Admin@1234"))
                    .role(Role.ADMIN)
                    .provider(AuthProvider.LOCAL)
                    .build());
            log.info("✅ Admin seeded → {}", email);
        } else {
            log.info("ℹ️  Admin already exists, skipping.");
        }
    }

    // ── Manager ───────────────────────────────────────────────────────────────
    private void seedManager() {
        String email = "manager@sliitorbit.lk";
        if (!userRepository.existsByEmail(email)) {
            userRepository.save(User.builder()
                    .name("Orbit Manager")
                    .email(email)
                    .password(passwordEncoder.encode("Manager@1234"))
                    .role(Role.MANAGER)
                    .provider(AuthProvider.LOCAL)
                    .build());
            log.info("✅ Manager seeded → {}", email);
        } else {
            log.info("ℹ️  Manager already exists, skipping.");
        }
    }

    // ── Resources ─────────────────────────────────────────────────────────────
    private void seedResources() {
        if (resourceRepository.count() > 0) {
            log.info("ℹ️  Resources already seeded, skipping.");
            return;
        }

        List<Resource> resources = List.of(
            Resource.builder().name("Auditorium A").type("LECTURE_HALL").location("Block A, Level 1").capacity(300)
                .description("Main auditorium with full AV setup, tiered seating, and climate control. Ideal for lectures, seminars and large-scale presentations.")
                .availabilityStatus("ACTIVE").availableFrom("08:00").availableTo("20:00").build(),

            Resource.builder().name("Lecture Hall B2").type("LECTURE_HALL").location("Block B, Level 2").capacity(120)
                .description("Standard lecture hall with projector, whiteboard, and 120 ergonomic seats. Air-conditioned and well-lit.")
                .availabilityStatus("ACTIVE").availableFrom("07:30").availableTo("21:00").build(),

            Resource.builder().name("Computer Lab 01").type("LAB").location("Block C, Level 1").capacity(40)
                .description("Fully-equipped computer lab with 40 workstations running Windows 11. Includes high-speed internet and printing facilities.")
                .availabilityStatus("ACTIVE").availableFrom("08:00").availableTo("18:00").build(),

            Resource.builder().name("Electronics Lab 03").type("LAB").location("Block D, Level 3").capacity(25)
                .description("Hardware lab with oscilloscopes, soldering stations, and component kits. Suitable for electronics and embedded systems projects.")
                .availabilityStatus("ACTIVE").availableFrom("09:00").availableTo("17:00").build(),

            Resource.builder().name("Boardroom Suite").type("MEETING_ROOM").location("Admin Block, Level 4").capacity(16)
                .description("Executive boardroom with a large oval table, video-conferencing system and whiteboard walls. Ideal for faculty meetings.")
                .availabilityStatus("ACTIVE").availableFrom("08:00").availableTo("18:00").build(),

            Resource.builder().name("Collaboration Hub 1").type("MEETING_ROOM").location("Library Block, Level 2").capacity(8)
                .description("Open-plan meeting pod with smart TV, writable glass walls, and modular furniture. Perfect for group study and project sprints.")
                .availabilityStatus("ACTIVE").availableFrom("07:00").availableTo("22:00").build(),

            Resource.builder().name("4K Projector Unit").type("EQUIPMENT").location("AV Store, Block A").capacity(1)
                .description("Portable 4K laser projector with HDMI and wireless casting. Can be booked alongside a room or for outdoor events.")
                .availabilityStatus("ACTIVE").availableFrom("08:00").availableTo("20:00").build(),

            Resource.builder().name("Sony FX3 Camera Kit").type("EQUIPMENT").location("Media Centre, Block E").capacity(1)
                .description("Professional cinema camera kit including lenses, tripod, and audio recorder. Available for academic media productions.")
                .availabilityStatus("ACTIVE").availableFrom("09:00").availableTo("17:00").build(),

            Resource.builder().name("Physics Research Lab").type("LAB").location("Science Block, Level 2").capacity(20)
                .description("Advanced physics lab with precision measurement tools, vacuum chambers, and optical benches. Requires supervisor approval.")
                .availabilityStatus("OUT_OF_SERVICE").availableFrom("09:00").availableTo("16:00").build(),

            Resource.builder().name("Seminar Room S3").type("MEETING_ROOM").location("Block S, Level 3").capacity(30)
                .description("Mid-size seminar room with projector and flip charts. Well-suited for workshops, tutorials and department seminars.")
                .availabilityStatus("ACTIVE").availableFrom("08:00").availableTo("20:00").build()
        );

        resourceRepository.saveAll(resources);
        log.info("✅ {} sample resources seeded.", resources.size());
    }
}
