package com.sliit.orbit_backend.model;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

/**
 * A comment added to a ticket by any user or technician.
 * Module C – Maintenance & Incident Ticketing
 * Member 3 — Shiroshi Fernando
 */
@Document(collection = "ticket_comments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TicketComment {

    @Id
    private String id;

    /** The ticket this comment belongs to. */
    @NotBlank(message = "Ticket ID is required")
    private String ticketId;

    /** ID of the user who wrote the comment. */
    private String authorId;

    /** Denormalized author name for fast display. */
    private String authorName;

    /** Role of the author (USER, TECHNICIAN, ADMIN, MANAGER). */
    private String authorRole;

    @NotBlank(message = "Comment body is required")
    private String body;

    /** Allows the owner to soft-edit their comment content. */
    private boolean edited;

    @CreatedDate
    private LocalDateTime createdAt;
}
