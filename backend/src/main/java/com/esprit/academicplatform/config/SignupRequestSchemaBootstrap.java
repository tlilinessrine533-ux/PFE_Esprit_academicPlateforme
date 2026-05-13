package com.esprit.academicplatform.config;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SignupRequestSchemaBootstrap implements CommandLineRunner {

    private static final String CREATE_SIGNUP_REQUESTS_TABLE = """
        CREATE TABLE IF NOT EXISTS signup_requests (
          id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
          first_name VARCHAR(100) NOT NULL,
          last_name VARCHAR(100) NOT NULL,
          email VARCHAR(150) NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          role ENUM('ENSEIGNANT', 'CHEF_DEPARTEMENT', 'ADMINISTRATION', 'SUPER_ADMIN') NOT NULL DEFAULT 'ENSEIGNANT',
          department_id BIGINT UNSIGNED NOT NULL,
          status ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
          review_comment TEXT NULL,
          reviewed_by BIGINT UNSIGNED NULL,
          reviewed_at DATETIME NULL,
          created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          UNIQUE KEY uq_signup_requests_email (email),
          KEY idx_signup_requests_status (status),
          KEY idx_signup_requests_department (department_id),
          KEY idx_signup_requests_reviewed_by (reviewed_by),
          CONSTRAINT fk_signup_requests_department
            FOREIGN KEY (department_id) REFERENCES departments(id)
            ON DELETE RESTRICT
            ON UPDATE CASCADE,
          CONSTRAINT fk_signup_requests_reviewed_by
            FOREIGN KEY (reviewed_by) REFERENCES users(id)
            ON DELETE SET NULL
            ON UPDATE CASCADE
        ) ENGINE=InnoDB
        """;

    private static final String HAS_ROLE_COLUMN_QUERY = """
        SELECT COUNT(*)
        FROM information_schema.columns
        WHERE table_schema = DATABASE()
          AND table_name = 'signup_requests'
          AND column_name = 'role'
        """;

    private static final String ADD_ROLE_COLUMN = """
        ALTER TABLE signup_requests
        ADD COLUMN role ENUM('ENSEIGNANT', 'CHEF_DEPARTEMENT', 'ADMINISTRATION', 'SUPER_ADMIN')
        NOT NULL DEFAULT 'ENSEIGNANT'
        AFTER password_hash
        """;

    private final JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) {
        jdbcTemplate.execute(CREATE_SIGNUP_REQUESTS_TABLE);

        Integer roleColumnCount = jdbcTemplate.queryForObject(HAS_ROLE_COLUMN_QUERY, Integer.class);
        if (roleColumnCount != null && roleColumnCount == 0) {
            jdbcTemplate.execute(ADD_ROLE_COLUMN);
        }
    }
}
