package com.sliit.orbit_backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Response DTO for a single ticket comment.
 * Module C – Maintenance & Incident Ticketing
 * Member 3 — Shiroshi Fernando
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TicketCommentResponse {

    private String id;
    private String ticketId;
    private String authorId;
    private String authorName;
    private String authorRole;
    private String body;
    private boolean edited;
    private LocalDateTime createdAt;
}
