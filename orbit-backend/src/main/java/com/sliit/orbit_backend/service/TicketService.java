package com.sliit.orbit_backend.service;

import com.sliit.orbit_backend.config.SlaConfig;
import com.sliit.orbit_backend.dto.request.TicketCommentRequest;
import com.sliit.orbit_backend.dto.request.TicketRequest;
import com.sliit.orbit_backend.dto.request.TicketStatusRequest;
import com.sliit.orbit_backend.dto.response.TicketAttachmentResponse;
import com.sliit.orbit_backend.dto.response.TicketCommentResponse;
import com.sliit.orbit_backend.dto.response.TicketResponse;
import com.sliit.orbit_backend.model.Ticket;
import com.sliit.orbit_backend.model.TicketAttachment;
import com.sliit.orbit_backend.model.TicketComment;
import com.sliit.orbit_backend.model.enums.TicketStatus;
import com.sliit.orbit_backend.repository.TicketAttachmentRepository;
import com.sliit.orbit_backend.repository.TicketCommentRepository;
import com.sliit.orbit_backend.repository.TicketRepository;
import com.sliit.orbit_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.OptionalDouble;
import java.util.stream.Collectors;

/**
 * Business logic for the Ticket module (Module C).
 * Member 3 — Shiroshi Fernando
 */
@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepository           ticketRepository;
    private final TicketCommentRepository    commentRepository;
    private final TicketAttachmentRepository attachmentRepository;
    private final UserRepository             userRepository;
    private final NotificationService        notificationService;

    private static final String UPLOAD_DIR = "uploads/tickets/";
    private static final int    MAX_ATTACHMENTS = 3;

    // ── Read ──────────────────────────────────────────────────────────────────

    /**
     * Returns tickets visible to the caller based on their role:
     * - USER       → their own tickets
     * - TECHNICIAN → tickets assigned to them only
     * - ADMIN/MANAGER → all tickets, with optional status filter
     */
    public List<TicketResponse> getTickets(String callerId, String callerRole,
                                            String statusFilter) {
        TicketStatus status = null;
        if (statusFilter != null && !statusFilter.isBlank()) {
            status = TicketStatus.valueOf(statusFilter.toUpperCase());
        }

        List<Ticket> tickets;

        switch (callerRole) {
            case "TECHNICIAN" -> tickets = (status != null)
                    ? ticketRepository.findByAssignedToAndStatusOrderByCreatedAtDesc(callerId, status)
                    : ticketRepository.findByAssignedToOrderByCreatedAtDesc(callerId);

            case "ADMIN", "MANAGER" -> tickets = (status != null)
                    ? ticketRepository.findByStatusOrderByCreatedAtDesc(status)
                    : ticketRepository.findAll().stream()
                        .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                        .collect(Collectors.toList());

            default -> // USER
                tickets = (status != null)
                    ? ticketRepository.findByCreatedByAndStatusOrderByCreatedAtDesc(callerId, status)
                    : ticketRepository.findByCreatedByOrderByCreatedAtDesc(callerId);
        }

        return tickets.stream().map(t -> toResponse(t, false)).collect(Collectors.toList());
    }

    /** Returns full ticket detail (including comments and attachments). */
    public TicketResponse getTicketById(String ticketId, String callerId, String callerRole) {
        Ticket ticket = findById(ticketId);
        boolean isOwner      = ticket.getCreatedBy().equals(callerId);
        boolean isPrivileged = "ADMIN".equals(callerRole) || "MANAGER".equals(callerRole);
        boolean isAssignee   = callerId.equals(ticket.getAssignedTo());
        boolean isTech       = "TECHNICIAN".equals(callerRole) && isAssignee;

        if (!isOwner && !isPrivileged && !isTech) {
            throw new RuntimeException("Access denied");
        }
        return toResponse(ticket, true);
    }

    /**
     * TECHNICIAN self-assigns: claims an OPEN ticket.
     * Sets assignedTo = callerId and advances status to IN_PROGRESS.
     */
    public TicketResponse claimTicket(String ticketId, String technicianId) {
        Ticket ticket = findById(ticketId);

        if (ticket.getStatus() != TicketStatus.OPEN) {
            throw new IllegalStateException("Only OPEN tickets can be claimed");
        }
        if (ticket.getAssignedTo() != null) {
            throw new IllegalStateException("Ticket is already assigned to another technician");
        }

        ticket.setAssignedTo(technicianId);
        ticket.setStatus(TicketStatus.IN_PROGRESS);
        // ── SLA: first response timestamp ──
        if (ticket.getFirstRespondedAt() == null) {
            ticket.setFirstRespondedAt(LocalDateTime.now());
        }
        Ticket saved = ticketRepository.save(ticket);

        // Notify creator
        notificationService.createNotification(
                ticket.getCreatedBy(),
                "TICKET_STATUS_CHANGED",
                "Your ticket \"" + ticket.getTitle() + "\" has been picked up by a technician.",
                ticket.getId()
        );

        return toResponse(saved, false);
    }

    // ── Create ────────────────────────────────────────────────────────────────

    public TicketResponse createTicket(TicketRequest request, String creatorId) {
        Ticket ticket = Ticket.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .category(request.getCategory())
                .priority(request.getPriority() != null ? request.getPriority().toUpperCase() : "MEDIUM")
                .status(TicketStatus.OPEN)
                .createdBy(creatorId)
                .resourceId(request.getResourceId())
                .contactDetails(request.getContactDetails())
                .build();

        Ticket saved = ticketRepository.save(ticket);

        // Notify all admins and managers
        userRepository.findAll().stream()
                .filter(u -> u.getRole() != null &&
                        (u.getRole().name().equals("ADMIN") || u.getRole().name().equals("MANAGER")))
                .forEach(u -> notificationService.createNotification(
                        u.getId(),
                        "TICKET_CREATED",
                        "New ticket: \"" + saved.getTitle() + "\" reported by a user.",
                        saved.getId()
                ));

        return toResponse(saved, false);
    }

    // ── Status Transitions ────────────────────────────────────────────────────

    public TicketResponse updateStatus(String ticketId, TicketStatusRequest request,
                                        String callerId, String callerRole) {
        Ticket ticket = findById(ticketId);
        TicketStatus targetStatus = TicketStatus.valueOf(request.getStatus().toUpperCase());

        validateTransition(ticket.getStatus(), targetStatus, callerRole, ticket, callerId);

        ticket.setStatus(targetStatus);

        if (targetStatus == TicketStatus.RESOLVED && request.getResolutionNotes() != null) {
            ticket.setResolutionNotes(request.getResolutionNotes());
        }
        if (targetStatus == TicketStatus.REJECTED && request.getRejectionReason() != null) {
            ticket.setRejectionReason(request.getRejectionReason());
        }
        // ── SLA: capture resolvedAt when transitioning to RESOLVED ──
        if (targetStatus == TicketStatus.RESOLVED && ticket.getResolvedAt() == null) {
            ticket.setResolvedAt(LocalDateTime.now());
        }

        Ticket saved = ticketRepository.save(ticket);

        // Notify ticket creator
        notificationService.createNotification(
                ticket.getCreatedBy(),
                "TICKET_STATUS_CHANGED",
                "Your ticket \"" + ticket.getTitle() + "\" status changed to " + targetStatus + ".",
                ticket.getId()
        );

        return toResponse(saved, false);
    }

    public TicketResponse assignTechnician(String ticketId, String technicianId,
                                            String callerId, String callerRole) {
        if (!"ADMIN".equals(callerRole) && !"MANAGER".equals(callerRole)) {
            throw new RuntimeException("Only ADMIN or MANAGER can assign tickets");
        }
        Ticket ticket = findById(ticketId);
        ticket.setAssignedTo(technicianId);

        // Auto-advance status to IN_PROGRESS when assigned
        if (ticket.getStatus() == TicketStatus.OPEN) {
            ticket.setStatus(TicketStatus.IN_PROGRESS);
        }
        // ── SLA: first response timestamp ──
        if (ticket.getFirstRespondedAt() == null) {
            ticket.setFirstRespondedAt(LocalDateTime.now());
        }

        Ticket saved = ticketRepository.save(ticket);

        // Notify assigned technician
        notificationService.createNotification(
                technicianId,
                "TICKET_ASSIGNED",
                "You have been assigned ticket: \"" + ticket.getTitle() + "\".",
                ticket.getId()
        );
        // Notify creator
        notificationService.createNotification(
                ticket.getCreatedBy(),
                "TICKET_STATUS_CHANGED",
                "Your ticket \"" + ticket.getTitle() + "\" has been assigned to a technician.",
                ticket.getId()
        );

        return toResponse(saved, false);
    }

    // ── Comments ──────────────────────────────────────────────────────────────

    public TicketCommentResponse addComment(String ticketId, TicketCommentRequest request,
                                             String authorId, String authorRole) {
        Ticket ticket = findById(ticketId); // ensures ticket exists

        String authorName = userRepository.findById(authorId)
                .map(u -> u.getName()).orElse("Unknown");

        TicketComment comment = TicketComment.builder()
                .ticketId(ticketId)
                .authorId(authorId)
                .authorName(authorName)
                .authorRole(authorRole)
                .body(request.getBody())
                .edited(false)
                .build();

        TicketComment saved = commentRepository.save(comment);

        // ── SLA: if TECHNICIAN is first to comment, mark first response time ──
        if ("TECHNICIAN".equals(authorRole) && ticket.getFirstRespondedAt() == null) {
            ticket.setFirstRespondedAt(LocalDateTime.now());
            ticketRepository.save(ticket);
        }

        // Notify ticket creator (if different from commenter)
        if (!ticket.getCreatedBy().equals(authorId)) {
            notificationService.createNotification(
                    ticket.getCreatedBy(),
                    "NEW_COMMENT",
                    authorName + " commented on your ticket \"" + ticket.getTitle() + "\".",
                    ticketId
            );
        }
        // Notify assignee (if different from commenter)
        if (ticket.getAssignedTo() != null && !ticket.getAssignedTo().equals(authorId)) {
            notificationService.createNotification(
                    ticket.getAssignedTo(),
                    "NEW_COMMENT",
                    authorName + " commented on ticket \"" + ticket.getTitle() + "\".",
                    ticketId
            );
        }

        return toCommentResponse(saved);
    }

    public TicketCommentResponse editComment(String commentId, TicketCommentRequest request,
                                              String callerId) {
        TicketComment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        if (!comment.getAuthorId().equals(callerId)) {
            throw new RuntimeException("You can only edit your own comments");
        }
        comment.setBody(request.getBody());
        comment.setEdited(true);
        return toCommentResponse(commentRepository.save(comment));
    }

    public void deleteComment(String commentId, String callerId, String callerRole) {
        TicketComment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        boolean isOwner = comment.getAuthorId().equals(callerId);
        boolean isAdmin = "ADMIN".equals(callerRole);
        if (!isOwner && !isAdmin) {
            throw new RuntimeException("You can only delete your own comments");
        }
        commentRepository.delete(comment);
    }

    // ── Attachments ───────────────────────────────────────────────────────────

    public TicketAttachmentResponse uploadAttachment(String ticketId, MultipartFile file,
                                                      String uploaderId) throws IOException {
        findById(ticketId); // validate ticket exists

        long existingCount = attachmentRepository.countByTicketId(ticketId);
        if (existingCount >= MAX_ATTACHMENTS) {
            throw new IllegalStateException("Maximum of " + MAX_ATTACHMENTS + " attachments allowed per ticket");
        }

        // Validate content type
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("Only image files are allowed");
        }

        // Save file to disk
        String originalName = StringUtils.cleanPath(file.getOriginalFilename());
        String storagePath  = UPLOAD_DIR + ticketId + "/" + System.currentTimeMillis() + "_" + originalName;
        Path   target       = Paths.get(storagePath);
        Files.createDirectories(target.getParent());
        Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

        TicketAttachment attachment = TicketAttachment.builder()
                .ticketId(ticketId)
                .uploadedBy(uploaderId)
                .originalFilename(originalName)
                .contentType(contentType)
                .fileSize(file.getSize())
                .storagePath(storagePath)
                .build();

        TicketAttachment saved = attachmentRepository.save(attachment);

        // Keep ticket's attachmentIds list in sync
        Ticket ticket = findById(ticketId);
        ticket.getAttachmentIds().add(saved.getId());
        ticketRepository.save(ticket);

        return toAttachmentResponse(saved);
    }

    // ── Delete ────────────────────────────────────────────────────────────────

    /**
     * Delete a ticket:
     * - ADMIN/MANAGER: can only delete CLOSED tickets
     * - Owner (USER): can delete their own ticket at any status
     */
    public void deleteTicket(String ticketId, String callerId, String callerRole) {
        Ticket ticket = findById(ticketId);
        boolean isOwner      = ticket.getCreatedBy().equals(callerId);
        boolean isPrivileged = "ADMIN".equals(callerRole) || "MANAGER".equals(callerRole);

        if (isPrivileged) {
            if (ticket.getStatus() != TicketStatus.CLOSED) {
                throw new IllegalStateException("ADMIN and MANAGER can only delete CLOSED tickets");
            }
        } else if (!isOwner) {
            throw new RuntimeException("Access denied: cannot delete this ticket");
        }

        commentRepository.deleteByTicketId(ticketId);
        attachmentRepository.deleteByTicketId(ticketId);
        ticketRepository.delete(ticket);
    }

    // ── Stats ─────────────────────────────────────────────────────────────────

    /**
     * Returns aggregated SLA statistics for the dashboard.
     * TECHNICIAN sees only their assigned tickets; ADMIN/MANAGER see all.
     */
    public Map<String, Object> getStats(String callerRole, String callerId) {
        List<Ticket> all;
        if ("TECHNICIAN".equals(callerRole)) {
            all = ticketRepository.findByAssignedToOrderByCreatedAtDesc(callerId);
        } else {
            all = ticketRepository.findAll();
        }

        LocalDateTime now = LocalDateTime.now();

        long openCount       = all.stream().filter(t -> t.getStatus() == TicketStatus.OPEN).count();
        long inProgressCount = all.stream().filter(t -> t.getStatus() == TicketStatus.IN_PROGRESS).count();
        long resolvedCount   = all.stream().filter(t ->
                t.getStatus() == TicketStatus.RESOLVED || t.getStatus() == TicketStatus.CLOSED).count();

        OptionalDouble avgResponse = all.stream()
                .filter(t -> t.getFirstRespondedAt() != null && t.getCreatedAt() != null)
                .mapToLong(t -> ChronoUnit.MINUTES.between(t.getCreatedAt(), t.getFirstRespondedAt()))
                .average();

        OptionalDouble avgResolution = all.stream()
                .filter(t -> t.getResolvedAt() != null && t.getCreatedAt() != null)
                .mapToLong(t -> ChronoUnit.MINUTES.between(t.getCreatedAt(), t.getResolvedAt()))
                .average();

        long breached = all.stream()
                .filter(t -> t.getStatus() != TicketStatus.RESOLVED
                          && t.getStatus() != TicketStatus.CLOSED
                          && t.getStatus() != TicketStatus.REJECTED
                          && t.getCreatedAt() != null)
                .filter(t -> now.isAfter(t.getCreatedAt().plus(SlaConfig.resolveBy(t.getPriority()))))
                .count();

        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("totalTickets",                 all.size());
        stats.put("openCount",                    openCount);
        stats.put("inProgressCount",              inProgressCount);
        stats.put("resolvedCount",                resolvedCount);
        stats.put("breachedCount",                breached);
        stats.put("avgTimeToFirstResponseMinutes",
                avgResponse.isPresent()   ? (long) avgResponse.getAsDouble()   : null);
        stats.put("avgTimeToResolutionMinutes",
                avgResolution.isPresent() ? (long) avgResolution.getAsDouble() : null);
        return stats;
    }

    // ── Validation ────────────────────────────────────────────────────────────

    private void validateTransition(TicketStatus current, TicketStatus target,
                                     String callerRole, Ticket ticket, String callerId) {
        boolean isAdmin      = "ADMIN".equals(callerRole) || "MANAGER".equals(callerRole);
        boolean isAssignee   = callerId.equals(ticket.getAssignedTo());
        boolean isTechnician = "TECHNICIAN".equals(callerRole) && isAssignee;

        switch (target) {
            case IN_PROGRESS -> {
                if (!isAdmin && !isTechnician)
                    throw new RuntimeException("Only ADMIN, MANAGER, or assigned TECHNICIAN can set IN_PROGRESS");
            }
            case RESOLVED -> {
                if (!isAdmin && !isTechnician)
                    throw new RuntimeException("Only ADMIN, MANAGER, or assigned TECHNICIAN can resolve a ticket");
            }
            case CLOSED -> {
                if (!isAdmin)
                    throw new RuntimeException("Only ADMIN or MANAGER can close a ticket");
                if (current != TicketStatus.RESOLVED)
                    throw new RuntimeException("Only RESOLVED tickets can be closed");
            }
            case REJECTED -> {
                if (!isAdmin)
                    throw new RuntimeException("Only ADMIN or MANAGER can reject a ticket");
            }
            default -> throw new RuntimeException("Invalid target status: " + target);
        }
    }

    // ── Mappers ───────────────────────────────────────────────────────────────

    Ticket findById(String id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found: " + id));
    }

    TicketResponse toResponse(Ticket t, boolean includeDetails) {
        String creatorName  = userRepository.findById(t.getCreatedBy())
                .map(u -> u.getName()).orElse("Unknown");
        String assigneeName = (t.getAssignedTo() != null)
                ? userRepository.findById(t.getAssignedTo()).map(u -> u.getName()).orElse("Unknown")
                : null;

        // ── SLA computation ──
        LocalDateTime now       = LocalDateTime.now();
        LocalDateTime respondBy = (t.getCreatedAt() != null)
                ? t.getCreatedAt().plus(SlaConfig.respondBy(t.getPriority())) : null;
        LocalDateTime resolveBy = (t.getCreatedAt() != null)
                ? t.getCreatedAt().plus(SlaConfig.resolveBy(t.getPriority())) : null;

        Long timeToFirstResponse = (t.getFirstRespondedAt() != null && t.getCreatedAt() != null)
                ? ChronoUnit.MINUTES.between(t.getCreatedAt(), t.getFirstRespondedAt()) : null;
        Long timeToResolution = (t.getResolvedAt() != null && t.getCreatedAt() != null)
                ? ChronoUnit.MINUTES.between(t.getCreatedAt(), t.getResolvedAt()) : null;

        String slaStatus;
        TicketStatus s = t.getStatus();
        if (s == TicketStatus.RESOLVED || s == TicketStatus.CLOSED) {
            slaStatus = (t.getResolvedAt() != null && resolveBy != null
                         && t.getResolvedAt().isBefore(resolveBy))
                    ? "RESOLVED_ON_TIME" : "RESOLVED_LATE";
        } else if (s == TicketStatus.REJECTED) {
            slaStatus = "RESOLVED_LATE"; // rejected = did not resolve
        } else {
            // Active ticket
            if (resolveBy == null || now.isAfter(resolveBy)) {
                slaStatus = "BREACHED";
            } else {
                long totalWindow   = ChronoUnit.MINUTES.between(t.getCreatedAt(), resolveBy);
                long remaining     = ChronoUnit.MINUTES.between(now, resolveBy);
                slaStatus = (remaining < totalWindow * 0.25) ? "AT_RISK" : "ON_TRACK";
            }
        }

        TicketResponse.TicketResponseBuilder builder = TicketResponse.builder()
                .id(t.getId())
                .title(t.getTitle())
                .description(t.getDescription())
                .category(t.getCategory())
                .priority(t.getPriority())
                .status(t.getStatus())
                .createdBy(t.getCreatedBy())
                .createdByName(creatorName)
                .assignedTo(t.getAssignedTo())
                .assignedToName(assigneeName)
                .resourceId(t.getResourceId())
                .contactDetails(t.getContactDetails())
                .resolutionNotes(t.getResolutionNotes())
                .rejectionReason(t.getRejectionReason())
                .createdAt(t.getCreatedAt())
                .updatedAt(t.getUpdatedAt())
                // SLA fields
                .firstRespondedAt(t.getFirstRespondedAt())
                .resolvedAt(t.getResolvedAt())
                .timeToFirstResponseMinutes(timeToFirstResponse)
                .timeToResolutionMinutes(timeToResolution)
                .slaDeadlineRespondBy(respondBy)
                .slaDeadlineResolveBy(resolveBy)
                .slaStatus(slaStatus);

        if (includeDetails) {
            List<TicketCommentResponse> comments = commentRepository
                    .findByTicketIdOrderByCreatedAtAsc(t.getId())
                    .stream().map(this::toCommentResponse).collect(Collectors.toList());

            List<TicketAttachmentResponse> attachments = attachmentRepository
                    .findByTicketId(t.getId())
                    .stream().map(this::toAttachmentResponse).collect(Collectors.toList());

            builder.comments(comments).attachments(attachments);
        }

        return builder.build();
    }

    private TicketCommentResponse toCommentResponse(TicketComment c) {
        return TicketCommentResponse.builder()
                .id(c.getId())
                .ticketId(c.getTicketId())
                .authorId(c.getAuthorId())
                .authorName(c.getAuthorName())
                .authorRole(c.getAuthorRole())
                .body(c.getBody())
                .edited(c.isEdited())
                .createdAt(c.getCreatedAt())
                .build();
    }

    private TicketAttachmentResponse toAttachmentResponse(TicketAttachment a) {
        return TicketAttachmentResponse.builder()
                .id(a.getId())
                .ticketId(a.getTicketId())
                .uploadedBy(a.getUploadedBy())
                .originalFilename(a.getOriginalFilename())
                .contentType(a.getContentType())
                .fileSize(a.getFileSize())
                .downloadUrl("/api/tickets/attachments/" + a.getId())
                .uploadedAt(a.getUploadedAt())
                .build();
    }
}
