package com.sliit.orbit_backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * Payload for creating a new incident ticket.
 * Module C – Maintenance & Incident Ticketing
 * Member 3 — Shiroshi Fernando
 */
@Data
public class TicketRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "Category is required")
    private String category;

    /** LOW | MEDIUM | HIGH | CRITICAL — defaults to MEDIUM if omitted. */
    private String priority;

    /** Optional resource/location reference. */
    private String resourceId;

    /** Optional contact details for follow-up. */
    private String contactDetails;
}
