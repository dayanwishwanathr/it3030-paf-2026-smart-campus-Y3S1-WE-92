package com.sliit.orbit_backend.repository;

import com.sliit.orbit_backend.model.TicketAttachment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for TicketAttachment documents.
 * Module C – Maintenance & Incident Ticketing
 * Member 3 — Shiroshi Fernando
 */
@Repository
public interface TicketAttachmentRepository extends MongoRepository<TicketAttachment, String> {

    /** All attachments for a given ticket. */
    List<TicketAttachment> findByTicketId(String ticketId);

    /** Count attachments on a ticket (enforces max-3 rule). */
    long countByTicketId(String ticketId);

    /** Delete all attachments when a ticket is deleted. */
    void deleteByTicketId(String ticketId);
}
