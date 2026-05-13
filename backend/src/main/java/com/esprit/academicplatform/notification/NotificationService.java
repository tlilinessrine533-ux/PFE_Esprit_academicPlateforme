package com.esprit.academicplatform.notification;

import com.esprit.academicplatform.notification.dto.NotificationItemResponse;
import com.esprit.academicplatform.notification.dto.NotificationOverviewResponse;
import com.esprit.academicplatform.user.User;
import com.esprit.academicplatform.user.UserRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public NotificationOverviewResponse getCurrentUserOverview(String currentUserEmail) {
        User currentUser = findCurrentUser(currentUserEmail);
        List<NotificationItemResponse> notifications = notificationRepository.findTop12ByUserIdOrderByCreatedAtDesc(currentUser.getId())
            .stream()
            .map(this::toResponse)
            .toList();

        long unreadCount = notificationRepository.countByUserIdAndIsReadFalse(currentUser.getId());
        return new NotificationOverviewResponse(unreadCount, notifications);
    }

    @Transactional
    public NotificationOverviewResponse markAsRead(Long notificationId, String currentUserEmail) {
        User currentUser = findCurrentUser(currentUserEmail);
        Notification notification = notificationRepository.findByIdAndUserId(notificationId, currentUser.getId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Notification introuvable"));

        notification.setRead(true);
        notificationRepository.save(notification);
        return getCurrentUserOverview(currentUserEmail);
    }

    @Transactional
    public NotificationOverviewResponse markAllAsRead(String currentUserEmail) {
        User currentUser = findCurrentUser(currentUserEmail);
        List<Notification> unreadNotifications = notificationRepository.findByUserIdAndIsReadFalse(currentUser.getId());
        unreadNotifications.forEach(notification -> notification.setRead(true));
        notificationRepository.saveAll(unreadNotifications);
        return getCurrentUserOverview(currentUserEmail);
    }

    @Transactional
    public void createForUser(User user, String title, String messageText) {
        if (user == null || !user.isActive() || !StringUtils.hasText(title) || !StringUtils.hasText(messageText)) {
            return;
        }

        Notification notification = new Notification();
        notification.setUser(user);
        notification.setTitle(title.trim());
        notification.setMessageText(messageText.trim());
        notification.setRead(false);
        notificationRepository.save(notification);
    }

    @Transactional
    public void createForUsers(List<User> users, String title, String messageText) {
        users.forEach(user -> createForUser(user, title, messageText));
    }

    private NotificationItemResponse toResponse(Notification notification) {
        return new NotificationItemResponse(
            notification.getId(),
            notification.getTitle(),
            notification.getMessageText(),
            notification.isRead(),
            notification.getCreatedAt()
        );
    }

    private User findCurrentUser(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Utilisateur non authentifié"));
    }
}
