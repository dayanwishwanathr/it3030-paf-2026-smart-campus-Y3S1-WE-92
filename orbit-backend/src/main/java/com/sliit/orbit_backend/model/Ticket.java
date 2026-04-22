package com.sliit.orbit_backend.model;

import com.sliit.orbit_backend.model.enums.TicketStatus;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Domain model for an incident / maintenance ticket.
 * Module C – Maintenance & Incident Ticketing
 * Member 3 — Shiroshi Fernando
 */
@Document(collection = "tickets")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Ticket {

    @Id
    private String id;

    /** Short title describing the incident. */
    @NotBlank(message = "Title is required")
    private String title;

    /** Detailed description of the issue. */
    @NotBlank(message = "Description is required")
    private String description;

    /**
     * Category of the ticket.
     * E.g. ELECTRICAL, PLUMBING, IT, FURNITURE, OTHER
     */
    @NotBlank(message = "Category is required")
    private String category;

    /**
     * Priority level: LOW, MEDIUM, HIGH, CRITICAL
     */
    @Builder.Default
    private String priority = "MEDIUM";

    /** Workflow state – starts as OPEN on creation. */
    @Builder.Default
    private TicketStatus status = TicketStatus.OPEN;

    /** ID of the user who created the ticket. Set from JWT. */
    private String createdBy;

    /** ID of the technician or staff member assigned to this ticket. */
    private String assignedTo;

    /** Optional: the resource/location this ticket relates to. */
    private String resourceId;

    /** Optional: preferred contact details supplied by the reporter. */
    private String contactDetails;

    /**
     * IDs of stored attachment documents (max 3).
     * Each entry references a TicketAttachment document.
     */
    @Builder.Default
    private List<String> attachmentIds = new ArrayList<>();

    /**
     * Resolution notes written by the technician when closing the ticket.
     */
    private String resolutionNotes;

    /**
     * Reason supplied when a ticket is REJECTED.
     */
    private String rejectionReason;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
