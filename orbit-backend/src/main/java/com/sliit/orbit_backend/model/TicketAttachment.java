package com.sliit.orbit_backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

/**
 * Metadata for a file attachment uploaded with a ticket.
 * Actual file bytes are stored on disk under /uploads/tickets/{ticketId}/
 * Module C – Maintenance & Incident Ticketing
 * Member 3 — Shiroshi Fernando
 */
@Document(collection = "ticket_attachments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TicketAttachment {

    @Id
    private String id;

    /** The ticket this attachment belongs to. */
    private String ticketId;

    /** Uploader's user ID. */
    private String uploadedBy;

    /** Original file name as supplied by the client. */
    private String originalFilename;

    /** MIME content-type (e.g. image/jpeg, image/png). */
    private String contentType;

    /** Size in bytes. */
    private long fileSize;

    /**
     * Relative path on server where the file is persisted.
     * E.g. uploads/tickets/abc123/photo1.jpg
     */
    private String storagePath;

    @CreatedDate
    private LocalDateTime uploadedAt;
}
