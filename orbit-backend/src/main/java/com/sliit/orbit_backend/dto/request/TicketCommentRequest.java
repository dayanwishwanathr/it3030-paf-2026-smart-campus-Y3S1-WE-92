package com.sliit.orbit_backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * Payload for adding a comment to a ticket.
 * Module C – Maintenance & Incident Ticketing
 * Member 3 — Shiroshi Fernando
 */
@Data
public class TicketCommentRequest {

    @NotBlank(message = "Comment body is required")
    private String body;
}
