package com.esprit.academicplatform.config;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ExamSurveillanceSchemaBootstrap implements CommandLineRunner {

    private static final String CREATE_EXAM_SURVEILLANCE_TABLE = """
        CREATE TABLE IF NOT EXISTS exam_surveillance_activities (
          activity_id BIGINT UNSIGNED PRIMARY KEY,
          session_name VARCHAR(100) NOT NULL,
          semester ENUM('S1', 'S2', 'ANNUEL') NOT NULL,
          hours_count DECIMAL(6,2) NOT NULL DEFAULT 1.00,
          session_day ENUM('LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI') NOT NULL DEFAULT 'LUNDI',
          session_points DECIMAL(4,2) NOT NULL DEFAULT 1.00,
          CONSTRAINT fk_exam_surveillance_activity
            FOREIGN KEY (activity_id) REFERENCES activities(id)
            ON DELETE CASCADE
            ON UPDATE CASCADE
        ) ENGINE=InnoDB
        """;

    private final JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) {
        jdbcTemplate.execute(CREATE_EXAM_SURVEILLANCE_TABLE);
        ensureColumn(
            "hours_count",
            "ALTER TABLE exam_surveillance_activities ADD COLUMN hours_count DECIMAL(6,2) NOT NULL DEFAULT 1.00"
        );
        ensureColumn(
            "session_day",
            """
            ALTER TABLE exam_surveillance_activities
            ADD COLUMN session_day ENUM('LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI')
            NOT NULL DEFAULT 'LUNDI'
            """
        );
        ensureColumn(
            "session_points",
            "ALTER TABLE exam_surveillance_activities ADD COLUMN session_points DECIMAL(4,2) NOT NULL DEFAULT 1.00"
        );
        jdbcTemplate.execute(
            """
            UPDATE exam_surveillance_activities
            SET session_points = CASE
              WHEN session_day = 'SAMEDI' THEN 2.00
              ELSE 1.00
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
                  AND table_name = 'exam_surveillance_activities'
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
