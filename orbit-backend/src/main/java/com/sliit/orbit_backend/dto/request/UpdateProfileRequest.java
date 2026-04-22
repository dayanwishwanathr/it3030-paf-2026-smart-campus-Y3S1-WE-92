package com.sliit.orbit_backend.dto.request;

import lombok.Data;

@Data
public class UpdateProfileRequest {
    private String name;           // optional — update display name
    private String campusId;       // e.g. "IT23413474" — triggers verification
    private String password;       // optional — set/change password (Google users can set one)
    private String profilePicture; // Cloudinary URL — set by frontend after direct upload
}
