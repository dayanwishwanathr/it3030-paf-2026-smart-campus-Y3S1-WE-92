package com.sliit.orbit_backend.dto.request;

import lombok.Data;

/**
 * Payload for updating ticket status (status change + optional notes).
 * Reused for assign, resolve, reject, close actions.
 * Module C – Maintenance & Incident Ticketing
 * Member 3 — Shiroshi Fernando
 */
@Data
public class TicketStatusRequest {

    /** Target status: IN_PROGRESS | RESOLVED | CLOSED | REJECTED */
    private String status;

    /** Resolution notes (required when resolving). */
    private String resolutionNotes;

    /** Rejection reason (required when rejecting). */
    private String rejectionReason;

    /** Technician/staff user ID to assign (used by assign endpoint). */
    private String assignedTo;
}
