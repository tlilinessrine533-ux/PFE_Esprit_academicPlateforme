package com.esprit.academicplatform.config;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AuthSecuritySchemaBootstrap implements CommandLineRunner {

    private static final String CREATE_AUTH_SECURITY_TABLE = """
        CREATE TABLE IF NOT EXISTS auth_security_states (
          user_id BIGINT UNSIGNED PRIMARY KEY,
          failed_login_attempts INT NOT NULL DEFAULT 0,
          login_locked_until DATETIME NULL,
          password_reset_code_hash VARCHAR(255) NULL,
          password_reset_expires_at DATETIME NULL,
          password_reset_requested_at DATETIME NULL,
          two_factor_enabled TINYINT(1) NOT NULL DEFAULT 0,
          two_factor_secret VARCHAR(128) NULL,
          two_factor_pending_secret VARCHAR(128) NULL,
          two_factor_pending_secret_expires_at DATETIME NULL,
          two_factor_login_challenge_hash VARCHAR(255) NULL,
          two_factor_login_challenge_expires_at DATETIME NULL,
          two_factor_backup_code_hashes TEXT NULL,
          trusted_device_token_hash VARCHAR(255) NULL,
          trusted_device_expires_at DATETIME NULL,
          passkey_credential_id VARCHAR(255) NULL,
          passkey_public_key TEXT NULL,
          passkey_sign_count BIGINT NOT NULL DEFAULT 0,
          passkey_registered_at DATETIME NULL,
          passkey_last_used_at DATETIME NULL,
          passkey_registration_challenge VARCHAR(255) NULL,
          passkey_registration_expires_at DATETIME NULL,
          passkey_authentication_challenge VARCHAR(255) NULL,
          passkey_authentication_expires_at DATETIME NULL,
          face_recognition_descriptor TEXT NULL,
          face_recognition_enrolled_at DATETIME NULL,
          face_recognition_last_used_at DATETIME NULL,
          created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          CONSTRAINT fk_auth_security_user
            FOREIGN KEY (user_id) REFERENCES users(id)
            ON DELETE CASCADE
            ON UPDATE CASCADE
        ) ENGINE=InnoDB
        """;

    private final JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) {
        jdbcTemplate.execute(CREATE_AUTH_SECURITY_TABLE);
        ensureColumn(
            "two_factor_enabled",
            "ALTER TABLE auth_security_states ADD COLUMN two_factor_enabled TINYINT(1) NOT NULL DEFAULT 0"
        );
        ensureColumn(
            "two_factor_secret",
            "ALTER TABLE auth_security_states ADD COLUMN two_factor_secret VARCHAR(128) NULL"
        );
        ensureColumn(
            "two_factor_pending_secret",
            "ALTER TABLE auth_security_states ADD COLUMN two_factor_pending_secret VARCHAR(128) NULL"
        );
        ensureColumn(
            "two_factor_pending_secret_expires_at",
            "ALTER TABLE auth_security_states ADD COLUMN two_factor_pending_secret_expires_at DATETIME NULL"
        );
        ensureColumn(
            "two_factor_login_challenge_hash",
            "ALTER TABLE auth_security_states ADD COLUMN two_factor_login_challenge_hash VARCHAR(255) NULL"
        );
        ensureColumn(
            "two_factor_login_challenge_expires_at",
            "ALTER TABLE auth_security_states ADD COLUMN two_factor_login_challenge_expires_at DATETIME NULL"
        );
        ensureColumn(
            "two_factor_backup_code_hashes",
            "ALTER TABLE auth_security_states ADD COLUMN two_factor_backup_code_hashes TEXT NULL"
        );
        ensureColumn(
            "trusted_device_token_hash",
            "ALTER TABLE auth_security_states ADD COLUMN trusted_device_token_hash VARCHAR(255) NULL"
        );
        ensureColumn(
            "trusted_device_expires_at",
            "ALTER TABLE auth_security_states ADD COLUMN trusted_device_expires_at DATETIME NULL"
        );
        ensureColumn(
            "passkey_credential_id",
            "ALTER TABLE auth_security_states ADD COLUMN passkey_credential_id VARCHAR(255) NULL"
        );
        ensureColumn(
            "passkey_public_key",
            "ALTER TABLE auth_security_states ADD COLUMN passkey_public_key TEXT NULL"
        );
        ensureColumn(
            "passkey_sign_count",
            "ALTER TABLE auth_security_states ADD COLUMN passkey_sign_count BIGINT NOT NULL DEFAULT 0"
        );
        ensureColumn(
            "passkey_registered_at",
            "ALTER TABLE auth_security_states ADD COLUMN passkey_registered_at DATETIME NULL"
        );
        ensureColumn(
            "passkey_last_used_at",
            "ALTER TABLE auth_security_states ADD COLUMN passkey_last_used_at DATETIME NULL"
        );
        ensureColumn(
            "passkey_registration_challenge",
            "ALTER TABLE auth_security_states ADD COLUMN passkey_registration_challenge VARCHAR(255) NULL"
        );
        ensureColumn(
            "passkey_registration_expires_at",
            "ALTER TABLE auth_security_states ADD COLUMN passkey_registration_expires_at DATETIME NULL"
        );
        ensureColumn(
            "passkey_authentication_challenge",
            "ALTER TABLE auth_security_states ADD COLUMN passkey_authentication_challenge VARCHAR(255) NULL"
        );
        ensureColumn(
            "passkey_authentication_expires_at",
            "ALTER TABLE auth_security_states ADD COLUMN passkey_authentication_expires_at DATETIME NULL"
        );
        ensureColumn(
            "face_recognition_descriptor",
            "ALTER TABLE auth_security_states ADD COLUMN face_recognition_descriptor TEXT NULL"
        );
        ensureColumn(
            "face_recognition_enrolled_at",
            "ALTER TABLE auth_security_states ADD COLUMN face_recognition_enrolled_at DATETIME NULL"
        );
        ensureColumn(
            "face_recognition_last_used_at",
            "ALTER TABLE auth_security_states ADD COLUMN face_recognition_last_used_at DATETIME NULL"
        );
    }

    private void ensureColumn(String columnName, String ddl) {
        Integer columnCount = jdbcTemplate.queryForObject(
            """
                SELECT COUNT(*)
                FROM information_schema.columns
                WHERE table_schema = DATABASE()
                  AND table_name = 'auth_security_states'
                  AND column_name = ?
                """,
            Integer.class,
            columnName
        );

        if (columnCount != null && columnCount == 0) {
            jdbcTemplate.execute(ddl);
        }
    }
}
