package com.esprit.academicplatform.auth;

import com.esprit.academicplatform.user.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.http.HttpStatus;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

@Slf4j
@Service
@RequiredArgsConstructor
public class PasswordResetMailService {

    private final ObjectProvider<JavaMailSender> mailSenderProvider;
    private final AuthSecurityProperties authSecurityProperties;

    public void sendPasswordResetCode(User user, String code) {
        JavaMailSender mailSender = mailSenderProvider.getIfAvailable();
        if (mailSender == null) {
            logPasswordResetCode(user, code, "mail sender unavailable");
            return;
        }

        SimpleMailMessage message = new SimpleMailMessage();
        if (StringUtils.hasText(authSecurityProperties.getPasswordResetSender())) {
            message.setFrom(authSecurityProperties.getPasswordResetSender().trim());
        }
        message.setTo(user.getEmail());
        message.setSubject(authSecurityProperties.getPasswordResetSubject());
        message.setText(buildMessageBody(user, code));

        try {
            mailSender.send(message);
        } catch (MailException exception) {
            if (authSecurityProperties.isLogPasswordResetCode()) {
                logPasswordResetCode(user, code, exception.getMessage());
                return;
            }

            throw new ResponseStatusException(
                HttpStatus.SERVICE_UNAVAILABLE,
                "L'envoi du code de verification est temporairement indisponible."
            );
        }
    }

    private String buildMessageBody(User user, String code) {
        return """
            Bonjour %s,

            Vous avez demande la recuperation de votre compte sur la plateforme academique ESPRIT.

            Votre code de verification est : %s

            Ce code expire dans %d minutes.
            Si vous n'etes pas a l'origine de cette demande, ignorez simplement cet e-mail.

            Equipe ESPRIT
            """.formatted(
            user.getFirstName(),
            code,
            authSecurityProperties.getPasswordResetCodeTtlMinutes()
        );
    }

    private void logPasswordResetCode(User user, String code, String reason) {
        if (!authSecurityProperties.isLogPasswordResetCode()) {
            return;
        }

        log.warn(
            "Password reset code for {} is {} (fallback delivery, reason: {}).",
            user.getEmail(),
            code,
            reason
        );
    }
}
