package com.sliit.orbit_backend.service;

import com.sliit.orbit_backend.dto.response.NotificationResponse;
import com.sliit.orbit_backend.model.Notification;
import com.sliit.orbit_backend.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    // ─────────────────────────────────────────────────────────────────────────
    // Called by BookingService and TicketService (other team members)
    // Usage example:
    //   notificationService.createNotification(userId, "BOOKING_APPROVED", "Your booking was approved", bookingId);
    // ─────────────────────────────────────────────────────────────────────────
    public void createNotification(String userId, String type,
                                   String message, String referenceId) {
        Notification notification = Notification.builder()
                .userId(userId)
                .type(type)
                .message(message)
                .referenceId(referenceId)
                .isRead(false)
                .build();

        notificationRepository.save(notification);
    }

    // Get all notifications for current user (newest first)
    public List<NotificationResponse> getUserNotifications(String userId) {
        return notificationRepository
                .findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Get unread notification count (for bell badge)
    public long getUnreadCount(String userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    // Mark a single notification as read
    public NotificationResponse markAsRead(String notificationId, String userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        if (!notification.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized: cannot mark another user's notification");
        }

        notification.setRead(true);
        Notification updated = notificationRepository.save(notification);
        return mapToResponse(updated);
    }

    // Mark all notifications as read
    public void markAllAsRead(String userId) {
        List<Notification> unread = notificationRepository
                .findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);

        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
    }

    // Delete a notification
    public void deleteNotification(String notificationId, String userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        if (!notification.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized: cannot delete another user's notification");
        }

        notificationRepository.delete(notification);
    }

    // Helper: map Notification model → NotificationResponse DTO
    private NotificationResponse mapToResponse(Notification notification) {
        return NotificationResponse.builder()
                .id(notification.getId())
                .userId(notification.getUserId())
                .type(notification.getType())
                .message(notification.getMessage())
                .referenceId(notification.getReferenceId())
                .isRead(notification.isRead())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}
