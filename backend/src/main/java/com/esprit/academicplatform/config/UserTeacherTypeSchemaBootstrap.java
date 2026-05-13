package com.esprit.academicplatform.config;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Order(0)
public class UserTeacherTypeSchemaBootstrap implements CommandLineRunner {

    private final JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) {
        ensureColumn(
            "teacher_type",
            "ALTER TABLE users ADD COLUMN teacher_type VARCHAR(20) NULL AFTER role"
        );

        jdbcTemplate.execute(
            """
            UPDATE users
            SET teacher_type = CASE
              WHEN role = 'ENSEIGNANT' THEN CASE
                WHEN teacher_type IS NULL OR TRIM(teacher_type) = '' THEN 'PERMANENT'
                WHEN UPPER(TRIM(teacher_type)) = 'VACATAIRE' THEN 'VACATAIRE'
                WHEN UPPER(TRIM(teacher_type)) = 'PERMANENT' THEN 'PERMANENT'
                ELSE 'PERMANENT'
              END
              ELSE NULL
            END
            """
        );
    }

    private void ensureColumn(String columnName, String ddl) {
        Integer columnCount = jdbcTemplate.queryForObject(
            """
                SELECT COUNT(*)
                FROM information_schema.columns
                WHERE table_schema = DATABASE()
                  AND table_name = 'users'
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
