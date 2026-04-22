package com.sliit.orbit_backend.repository;

import com.sliit.orbit_backend.model.Ticket;
import com.sliit.orbit_backend.model.enums.TicketStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for Ticket documents.
 * Module C – Maintenance & Incident Ticketing
 * Member 3 — Shiroshi Fernando
 */
@Repository
public interface TicketRepository extends MongoRepository<Ticket, String> {

    /** All tickets created by a specific user, newest first. */
    List<Ticket> findByCreatedByOrderByCreatedAtDesc(String createdBy);

    /** All tickets assigned to a specific technician, newest first. */
    List<Ticket> findByAssignedToOrderByCreatedAtDesc(String assignedTo);

    /** All tickets with a specific status, newest first. */
    List<Ticket> findByStatusOrderByCreatedAtDesc(TicketStatus status);

    /** Tickets by creator filtered by status. */
    List<Ticket> findByCreatedByAndStatusOrderByCreatedAtDesc(String createdBy, TicketStatus status);

    /** Tickets by assignee filtered by status. */
    List<Ticket> findByAssignedToAndStatusOrderByCreatedAtDesc(String assignedTo, TicketStatus status);

    /** Count open + in-progress tickets for a technician (workload). */
    long countByAssignedToAndStatusIn(String assignedTo, List<TicketStatus> statuses);

    /** Count all tickets by status (for admin metrics). */
    long countByStatus(TicketStatus status);
}
