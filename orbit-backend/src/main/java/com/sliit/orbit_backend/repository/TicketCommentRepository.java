package com.sliit.orbit_backend.repository;

import com.sliit.orbit_backend.model.TicketComment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for TicketComment documents.
 * Module C – Maintenance & Incident Ticketing
 * Member 3 — Shiroshi Fernando
 */
@Repository
public interface TicketCommentRepository extends MongoRepository<TicketComment, String> {

    /** All comments for a ticket ordered oldest-first (timeline view). */
    List<TicketComment> findByTicketIdOrderByCreatedAtAsc(String ticketId);

    /** Count comments on a ticket. */
    long countByTicketId(String ticketId);

    /** Delete all comments when a ticket is deleted. */
    void deleteByTicketId(String ticketId);
}
