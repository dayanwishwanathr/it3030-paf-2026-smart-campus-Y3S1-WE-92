package com.sliit.orbit_backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateRoleRequest {

    @NotBlank(message = "Role is required")
    private String role; // USER, ADMIN, TECHNICIAN
}
