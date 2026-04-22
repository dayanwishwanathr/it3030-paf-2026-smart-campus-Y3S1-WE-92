package com.sliit.orbit_backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Response DTO for a ticket attachment (metadata only, no raw bytes).
 * Module C – Maintenance & Incident Ticketing
 * Member 3 — Shiroshi Fernando
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TicketAttachmentResponse {

    private String id;
    private String ticketId;
    private String uploadedBy;
    private String originalFilename;
    private String contentType;
    private long fileSize;
    /** Relative URL the client can call to download the file. */
    private String downloadUrl;
    private LocalDateTime uploadedAt;
}
