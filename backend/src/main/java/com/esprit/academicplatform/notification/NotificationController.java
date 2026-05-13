package com.esprit.academicplatform.notification;

import com.esprit.academicplatform.notification.dto.NotificationOverviewResponse;
import java.security.Principal;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public NotificationOverviewResponse getCurrentUserNotifications(Principal principal) {
        return notificationService.getCurrentUserOverview(principal.getName());
    }

    @PostMapping("/{id}/read")
    public NotificationOverviewResponse markAsRead(@PathVariable Long id, Principal principal) {
        return notificationService.markAsRead(id, principal.getName());
    }

    @PostMapping("/read-all")
    public NotificationOverviewResponse markAllAsRead(Principal principal) {
        return notificationService.markAllAsRead(principal.getName());
    }
}
