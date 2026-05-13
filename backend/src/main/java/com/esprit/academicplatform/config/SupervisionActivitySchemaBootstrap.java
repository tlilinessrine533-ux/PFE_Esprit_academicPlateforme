package com.esprit.academicplatform.config;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SupervisionActivitySchemaBootstrap implements CommandLineRunner {

    private static final String CREATE_SUPERVISION_TABLE = """
        CREATE TABLE IF NOT EXISTS supervision_activities (
          activity_id BIGINT UNSIGNED PRIMARY KEY,
          supervision_type VARCHAR(80) NOT NULL,
          student_name VARCHAR(150) NOT NULL,
          student_program VARCHAR(150) NOT NULL,
          subject_title VARCHAR(255) NOT NULL,
          supervision_status ENUM('EN_COURS', 'SOUTENU') NOT NULL,
          role_in_jury VARCHAR(30) NOT NULL,
          quantity_value DECIMAL(8,2) NOT NULL DEFAULT 1.00,
          activity_points DECIMAL(8,2) NOT NULL DEFAULT 0.00,
          CONSTRAINT fk_supervision_activity
            FOREIGN KEY (activity_id) REFERENCES activities(id)
            ON DELETE CASCADE
            ON UPDATE CASCADE
        ) ENGINE=InnoDB
        """;

    private final JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) {
        jdbcTemplate.execute(CREATE_SUPERVISION_TABLE);
        jdbcTemplate.execute("ALTER TABLE supervision_activities MODIFY COLUMN supervision_type VARCHAR(80) NOT NULL");
        jdbcTemplate.execute("ALTER TABLE supervision_activities MODIFY COLUMN supervision_status VARCHAR(20) NOT NULL");
        jdbcTemplate.execute("ALTER TABLE supervision_activities MODIFY COLUMN role_in_jury VARCHAR(30) NOT NULL");

        ensureColumn(
            "quantity_value",
            "ALTER TABLE supervision_activities ADD COLUMN quantity_value DECIMAL(8,2) NOT NULL DEFAULT 1.00"
        );
        ensureColumn(
            "activity_points",
            "ALTER TABLE supervision_activities ADD COLUMN activity_points DECIMAL(8,2) NOT NULL DEFAULT 0.00"
        );

        jdbcTemplate.execute(
            """
            UPDATE supervision_activities
            SET quantity_value = CASE
              WHEN quantity_value IS NULL OR quantity_value <= 0 THEN 1.00
              ELSE quantity_value
            END
            """
        );

        jdbcTemplate.execute(
            """
            UPDATE supervision_activities
            SET supervision_type = CASE
              WHEN supervision_type IS NULL OR TRIM(supervision_type) = '' THEN 'PFE_ENCADREMENT_ACADEMIQUE'
              WHEN UPPER(TRIM(supervision_type)) IN ('PFE', 'PFE_ENCADREMENT_ACADEMIQUE', 'THESE') THEN UPPER(TRIM(supervision_type))
              WHEN UPPER(TRIM(supervision_type)) IN ('PFE_RAPPORTEUR', 'RAPPORTEUR') THEN 'PFE_RAPPORTEUR'
              WHEN UPPER(TRIM(supervision_type)) IN ('PFE_PRESIDENT_JURY', 'PRESIDENT_JURY') THEN 'PFE_PRESIDENT_JURY'
              WHEN UPPER(TRIM(supervision_type)) IN ('SEMINAIRE', 'SEMINAR') THEN 'SEMINAIRE'
              WHEN UPPER(TRIM(supervision_type)) IN ('PI') THEN 'PI'
              WHEN UPPER(TRIM(supervision_type)) IN ('APP0', 'APP_0') THEN 'APP0'
              WHEN UPPER(TRIM(supervision_type)) IN ('COURS_SOUTIEN', 'SOUTIEN') THEN 'COURS_SOUTIEN'
              WHEN UPPER(TRIM(supervision_type)) IN ('MEMOIRE', 'MEMOIR') THEN 'MEMOIRE'
              WHEN UPPER(TRIM(supervision_type)) IN ('STAGE', 'INTERNSHIP') THEN 'STAGE'
              ELSE 'PFE_ENCADREMENT_ACADEMIQUE'
            END
            """
        );

        jdbcTemplate.execute(
            """
            UPDATE supervision_activities
            SET supervision_status = CASE
              WHEN UPPER(TRIM(supervision_status)) IN ('SOUTENU', 'SOUTENUE', 'DONE', 'COMPLETED') THEN 'SOUTENU'
              ELSE 'EN_COURS'
            END
            """
        );

        jdbcTemplate.execute(
            """
            UPDATE supervision_activities
            SET
              student_name = COALESCE(NULLIF(TRIM(student_name), ''), 'Non renseigne'),
              student_program = COALESCE(NULLIF(TRIM(student_program), ''), 'Non renseigne'),
              subject_title = COALESCE(NULLIF(TRIM(subject_title), ''), 'Sujet non renseigne')
            """
        );

        jdbcTemplate.execute(
            """
            UPDATE supervision_activities
            SET role_in_jury = CASE
              WHEN UPPER(TRIM(role_in_jury)) IN ('ENCADRANT', 'SUPERVISOR') THEN 'ENCADRANT'
              WHEN UPPER(TRIM(role_in_jury)) IN ('RAPPORTEUR', 'REPORTER') THEN 'RAPPORTEUR'
              WHEN UPPER(TRIM(role_in_jury)) IN ('PRESIDENT_JURY', 'PRESIDENT') THEN 'PRESIDENT_JURY'
              WHEN supervision_type IN ('PFE_ENCADREMENT_ACADEMIQUE', 'PFE', 'THESE') THEN 'ENCADRANT'
              WHEN supervision_type = 'PFE_RAPPORTEUR' THEN 'RAPPORTEUR'
              WHEN supervision_type = 'PFE_PRESIDENT_JURY' THEN 'PRESIDENT_JURY'
              ELSE 'MEMBRE_JURY'
            END
            """
        );

        jdbcTemplate.execute(
            """
            UPDATE supervision_activities
            SET activity_points = CASE
              WHEN supervision_type IN ('PFE_ENCADREMENT_ACADEMIQUE', 'PFE', 'THESE') THEN 25.00
              WHEN supervision_type = 'PFE_RAPPORTEUR' THEN 10.00
              WHEN supervision_type = 'PFE_PRESIDENT_JURY' THEN 5.00
              WHEN supervision_type IN ('SEMINAIRE', 'PI') THEN 10.00 * quantity_value
              WHEN supervision_type = 'APP0' THEN 5.00
              WHEN supervision_type = 'COURS_SOUTIEN' THEN 0.50 * quantity_value
              WHEN supervision_type IN ('MEMOIRE', 'STAGE') THEN 10.00
              ELSE 25.00
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
                  AND table_name = 'supervision_activities'
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
