package com.sliit.orbit_backend.controller;

import com.sliit.orbit_backend.dto.request.TicketCommentRequest;
import com.sliit.orbit_backend.dto.request.TicketRequest;
import com.sliit.orbit_backend.dto.request.TicketStatusRequest;
import com.sliit.orbit_backend.dto.response.TicketAttachmentResponse;
import com.sliit.orbit_backend.dto.response.TicketCommentResponse;
import com.sliit.orbit_backend.dto.response.TicketResponse;
import com.sliit.orbit_backend.model.TicketAttachment;
import com.sliit.orbit_backend.model.User;
import com.sliit.orbit_backend.repository.TicketAttachmentRepository;
import com.sliit.orbit_backend.repository.UserRepository;
import com.sliit.orbit_backend.service.TicketService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * REST Controller for Incident Ticket Management (Module C).
 * Member 3 — Shiroshi Fernando
 *
 * Endpoints:
 *   GET    /api/tickets                  – list tickets (role-based)
 *   GET    /api/tickets/technicians      – list TECHNICIAN users (ADMIN/MANAGER)
 *   GET    /api/tickets/{id}             – get ticket detail
 *   POST   /api/tickets                  – create ticket
 *   PATCH  /api/tickets/{id}/status      – update status
 *   PATCH  /api/tickets/{id}/assign      – assign technician (ADMIN/MANAGER)
 *   PATCH  /api/tickets/{id}/claim       – technician self-assigns
 *   POST   /api/tickets/{id}/comments    – add comment
 *   PUT    /api/tickets/comments/{cid}   – edit comment
 *   DELETE /api/tickets/comments/{cid}   – delete comment
 *   POST   /api/tickets/{id}/attachments – upload image attachment
 *   GET    /api/tickets/attachments/{aid}– download attachment
 *   DELETE /api/tickets/{id}             – delete ticket (owner or ADMIN)
 */
@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService              ticketService;
    private final UserRepository             userRepository;
    private final TicketAttachmentRepository attachmentRepository;

    // ── Read ──────────────────────────────────────────────────────────────────

    @GetMapping
    public ResponseEntity<List<TicketResponse>> getTickets(
            @RequestParam(required = false) String status,
            Authentication authentication) {
        String userId = getUserId(authentication);
        String role   = getRole(authentication);
        return ResponseEntity.ok(ticketService.getTickets(userId, role, status));
    }

    /**
     * Returns a list of all TECHNICIAN-role users.
     * Used by the admin Assign Technician dropdown on the ticket detail page.
     */
    @GetMapping("/technicians")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<List<Map<String, String>>> getTechnicians() {
        List<Map<String, String>> technicians = userRepository.findAll().stream()
                .filter(u -> u.getRole() != null &&
                        u.getRole().name().equals("TECHNICIAN"))
                .map(u -> Map.of("id", u.getId(), "name", u.getName(), "email", u.getEmail()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(technicians);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TicketResponse> getTicketById(
            @PathVariable String id,
            Authentication authentication) {
        String userId = getUserId(authentication);
        String role   = getRole(authentication);
        return ResponseEntity.ok(ticketService.getTicketById(id, userId, role));
    }

    // ── Create ────────────────────────────────────────────────────────────────

    @PostMapping
    public ResponseEntity<TicketResponse> createTicket(
            @Valid @RequestBody TicketRequest request,
            Authentication authentication) {
        String userId = getUserId(authentication);
        TicketResponse created = ticketService.createTicket(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // ── Action Endpoints ──────────────────────────────────────────────────────

    @PatchMapping("/{id}/status")
    public ResponseEntity<TicketResponse> updateStatus(
            @PathVariable String id,
            @RequestBody TicketStatusRequest request,
            Authentication authentication) {
        String userId = getUserId(authentication);
        String role   = getRole(authentication);
        return ResponseEntity.ok(ticketService.updateStatus(id, request, userId, role));
    }

    @PatchMapping("/{id}/assign")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<TicketResponse> assignTechnician(
            @PathVariable String id,
            @RequestBody TicketStatusRequest request,
            Authentication authentication) {
        String userId = getUserId(authentication);
        String role   = getRole(authentication);
        return ResponseEntity.ok(ticketService.assignTechnician(id, request.getAssignedTo(), userId, role));
    }

    /**
     * TECHNICIAN claims an OPEN ticket for themselves.
     * Advances status to IN_PROGRESS automatically.
     */
    @PatchMapping("/{id}/claim")
    @PreAuthorize("hasRole('TECHNICIAN')")
    public ResponseEntity<?> claimTicket(
            @PathVariable String id,
            Authentication authentication) {
        try {
            String userId = getUserId(authentication);
            return ResponseEntity.ok(ticketService.claimTicket(id, userId));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ── Comments ──────────────────────────────────────────────────────────────

    @PostMapping("/{id}/comments")
    public ResponseEntity<TicketCommentResponse> addComment(
            @PathVariable String id,
            @Valid @RequestBody TicketCommentRequest request,
            Authentication authentication) {
        String userId = getUserId(authentication);
        String role   = getRole(authentication);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ticketService.addComment(id, request, userId, role));
    }

    @PutMapping("/comments/{commentId}")
    public ResponseEntity<TicketCommentResponse> editComment(
            @PathVariable String commentId,
            @Valid @RequestBody TicketCommentRequest request,
            Authentication authentication) {
        String userId = getUserId(authentication);
        return ResponseEntity.ok(ticketService.editComment(commentId, request, userId));
    }

    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<Map<String, String>> deleteComment(
            @PathVariable String commentId,
            Authentication authentication) {
        String userId = getUserId(authentication);
        String role   = getRole(authentication);
        ticketService.deleteComment(commentId, userId, role);
        return ResponseEntity.ok(Map.of("message", "Comment deleted"));
    }

    // ── Attachments ───────────────────────────────────────────────────────────

    @PostMapping(value = "/{id}/attachments", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadAttachment(
            @PathVariable String id,
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {
        try {
            String userId = getUserId(authentication);
            TicketAttachmentResponse response = ticketService.uploadAttachment(id, file, userId);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "File upload failed: " + e.getMessage()));
        } catch (IllegalStateException | IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/attachments/{attachmentId}")
    public ResponseEntity<Resource> downloadAttachment(@PathVariable String attachmentId) {
        TicketAttachment attachment = attachmentRepository.findById(attachmentId)
                .orElseThrow(() -> new RuntimeException("Attachment not found"));
        try {
            Path   filePath = Paths.get(attachment.getStoragePath()).toAbsolutePath();
            Resource resource = new UrlResource(filePath.toUri());
            if (!resource.exists()) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(attachment.getContentType()))
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "inline; filename=\"" + attachment.getOriginalFilename() + "\"")
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // ── Delete ────────────────────────────────────────────────────────────────

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteTicket(
            @PathVariable String id,
            Authentication authentication) {
        String userId = getUserId(authentication);
        String role   = getRole(authentication);
        ticketService.deleteTicket(id, userId, role);
        return ResponseEntity.ok(Map.of("message", "Ticket deleted"));
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private String getUserId(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getId();
    }

    private String getRole(Authentication auth) {
        return auth.getAuthorities().stream()
                .findFirst()
                .map(a -> a.getAuthority().replace("ROLE_", ""))
                .orElse("USER");
    }
}
