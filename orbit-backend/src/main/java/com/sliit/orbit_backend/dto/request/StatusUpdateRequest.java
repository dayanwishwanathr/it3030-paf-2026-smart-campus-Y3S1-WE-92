package com.sliit.orbit_backend.dto.request;

import com.sliit.orbit_backend.model.enums.BookingStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * Payload used by ADMIN/MANAGER to update a booking's status
 * (approve, reject) or by the owner to cancel.
 * Module B – Booking Management
 * Member 2 — Sachila Weerasinghe
 */
@Data
public class StatusUpdateRequest {

    @NotNull(message = "Status is required")
    private BookingStatus status;

    /** Optional reason for rejection or comment on approval. */
    private String notes;
}
