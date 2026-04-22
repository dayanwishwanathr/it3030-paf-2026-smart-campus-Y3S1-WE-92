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
}
