package com.esprit.academicplatform.config;

import com.esprit.academicplatform.user.User;
import com.esprit.academicplatform.user.UserRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Slf4j
@Component
@RequiredArgsConstructor
public class SamplePasswordBootstrap implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.bootstrap.sample-passwords}")
    private boolean bootstrapSamplePasswords;

    @Value("${app.bootstrap.default-password}")
    private String defaultPassword;

    @Override
    public void run(String... args) {
        if (!bootstrapSamplePasswords) {
            return;
        }

        if (!StringUtils.hasText(defaultPassword)) {
            throw new IllegalStateException("app.bootstrap.default-password must be configured when sample passwords are enabled.");
        }

        List<User> usersToUpdate = userRepository.findAll()
            .stream()
            .filter(user -> needsBootstrapPassword(user.getPasswordHash()))
            .toList();

        if (usersToUpdate.isEmpty()) {
            return;
        }

        usersToUpdate.forEach(user -> user.setPasswordHash(passwordEncoder.encode(defaultPassword)));
        userRepository.saveAll(usersToUpdate);

        log.info("Sample passwords updated for {} user(s).", usersToUpdate.size());
    }

    private boolean needsBootstrapPassword(String passwordHash) {
        return passwordHash != null
            && !passwordHash.startsWith("$2a$")
            && !passwordHash.startsWith("$2b$")
            && !passwordHash.startsWith("$2y$");
    }
}
