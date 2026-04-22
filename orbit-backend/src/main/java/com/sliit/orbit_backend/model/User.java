package com.sliit.orbit_backend.model;

import com.sliit.orbit_backend.model.enums.AuthProvider;
import com.sliit.orbit_backend.model.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    private String id;

    private String name;

    @Indexed(unique = true)
    private String email;

    private String password; // null for Google OAuth users

    private Role role; // USER, ADMIN, TECHNICIAN, MANAGER

    private AuthProvider provider; // LOCAL, GOOGLE

    private String profilePicture;

    // ── Campus verification ────────────────────────────────────────────────────
    @Indexed(unique = true, sparse = true) // sparse = only unique when non-null
    private String campusId;   // e.g. "IT23413474" — null until verified

    private String faculty;    // "Computing" | "Engineering" | "Business" | "Humanities & Science"

    @Builder.Default
    private boolean verified = false; // false until valid campusId saved

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
