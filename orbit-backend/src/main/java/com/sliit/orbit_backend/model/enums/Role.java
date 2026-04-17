package com.sliit.orbit_backend.model.enums;

public enum Role {
    USER,        // Browse resources, make bookings, raise tickets
    MANAGER,     // Resource catalogue, approve/reject bookings
    TECHNICIAN,  // View + update assigned tickets, add resolution notes
    ADMIN        // User management, role assignment, system oversight
}
