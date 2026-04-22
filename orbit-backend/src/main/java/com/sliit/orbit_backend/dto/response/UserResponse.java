package com.sliit.orbit_backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {

    private String id;
    private String name;
    private String email;
    private String role;
    private String provider;
    private String profilePicture;
    private LocalDateTime createdAt;

    // ── Campus verification ────────────────────────────────────────────────────
    private String  campusId;
    private String  faculty;
    private boolean verified;
}
