package com.sliit.orbit_backend.controller;

import com.sliit.orbit_backend.dto.response.NotificationResponse;
import com.sliit.orbit_backend.model.User;
import com.sliit.orbit_backend.repository.UserRepository;
import com.sliit.orbit_backend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final UserRepository userRepository;

    // GET /api/notifications  — get all notifications for current user
    @GetMapping
    public ResponseEntity<List<NotificationResponse>> getMyNotifications(Authentication authentication) {
        String userId = getUserId(authentication);
        return ResponseEntity.ok(notificationService.getUserNotifications(userId));
    }

    // GET /api/notifications/unread-count  — get unread badge count
    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(Authentication authentication) {
        String userId = getUserId(authentication);
        long count = notificationService.getUnreadCount(userId);
        return ResponseEntity.ok(Map.of("count", count));
    }

    // PATCH /api/notifications/{id}/read  — mark one notification as read
    @PatchMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable String id,
                                        Authentication authentication) {
        try {
            String userId = getUserId(authentication);
            NotificationResponse updated = notificationService.markAsRead(id, userId);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }

    // PATCH /api/notifications/read-all  — mark all notifications as read
    @PatchMapping("/read-all")
    public ResponseEntity<?> markAllAsRead(Authentication authentication) {
        String userId = getUserId(authentication);
        notificationService.markAllAsRead(userId);
        return ResponseEntity.ok(Map.of("message", "All notifications marked as read"));
    }

    // DELETE /api/notifications/{id}  — delete a notification
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNotification(@PathVariable String id,
                                                Authentication authentication) {
        try {
            String userId = getUserId(authentication);
            notificationService.deleteNotification(id, userId);
            return ResponseEntity.ok(Map.of("message", "Notification deleted"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }

    // Helper: get MongoDB userId from authenticated email
    private String getUserId(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getId();
    }
}
