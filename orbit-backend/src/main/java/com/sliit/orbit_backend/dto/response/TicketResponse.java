package com.sliit.orbit_backend.dto.response;

import com.sliit.orbit_backend.model.enums.TicketStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Response DTO returned to the client for ticket data.
 * Includes denormalized names for display convenience.
 * Module C – Maintenance & Incident Ticketing
 * Member 3 — Shiroshi Fernando
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TicketResponse {

    private String id;
    private String title;
    private String description;
    private String category;
    private String priority;
    private TicketStatus status;

    private String createdBy;
    private String createdByName;      // denormalized

    private String assignedTo;
    private String assignedToName;     // denormalized (null if unassigned)

    private String resourceId;
    private String contactDetails;

    private String resolutionNotes;
    private String rejectionReason;

    private List<TicketCommentResponse> comments;
    private List<TicketAttachmentResponse> attachments;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // ── SLA fields (Service-Level Timer) ───────────────────────────────────────

    /** Timestamp when a technician first responded (assigned/commented). */
    private LocalDateTime firstRespondedAt;

    /** Timestamp when the ticket was marked RESOLVED. */
    private LocalDateTime resolvedAt;

    /** Minutes from creation to first technician response. Null if not responded yet. */
    private Long timeToFirstResponseMinutes;

    /** Minutes from creation to resolution. Null if not resolved yet. */
    private Long timeToResolutionMinutes;

    /** Deadline by which a technician should have first responded. */
    private LocalDateTime slaDeadlineRespondBy;

    /** Deadline by which the ticket should be resolved. */
    private LocalDateTime slaDeadlineResolveBy;

    /**
     * Current SLA status string:
     *   ON_TRACK         – active, within deadline
     *   AT_RISK          – active, less than 25% of resolve window remaining
     *   BREACHED         – active, resolve deadline has passed
     *   RESOLVED_ON_TIME – resolved before deadline
     *   RESOLVED_LATE    – resolved after deadline
     */
    private String slaStatus;
}
