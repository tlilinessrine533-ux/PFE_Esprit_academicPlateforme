package com.esprit.academicplatform.config;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AvailabilityRequestSchemaBootstrap implements CommandLineRunner {

    private static final String CREATE_AVAILABILITY_REQUEST_TABLE = """
        CREATE TABLE IF NOT EXISTS availability_request_activities (
          activity_id BIGINT UNSIGNED PRIMARY KEY,
          request_type VARCHAR(20) NOT NULL,
          leave_type VARCHAR(30) NULL,
          mission_kind VARCHAR(30) NULL,
          title VARCHAR(180) NULL,
          start_date DATE NOT NULL,
          end_date DATE NOT NULL,
          reason TEXT NOT NULL,
          department_id BIGINT UNSIGNED NULL,
          pedagogical_unit VARCHAR(180) NULL,
          department_name VARCHAR(100) NULL,
          medical_certificate_image_data_url LONGTEXT NULL,
          CONSTRAINT fk_availability_request_activity
            FOREIGN KEY (activity_id) REFERENCES activities(id)
            ON DELETE CASCADE
            ON UPDATE CASCADE
        ) ENGINE=InnoDB
        """;

    private final JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) {
        ensureActivityTypeEnum();
        jdbcTemplate.execute(CREATE_AVAILABILITY_REQUEST_TABLE);
        ensureColumn(
            "request_type",
            "ALTER TABLE availability_request_activities ADD COLUMN request_type VARCHAR(20) NOT NULL"
        );
        ensureColumn(
            "leave_type",
            "ALTER TABLE availability_request_activities ADD COLUMN leave_type VARCHAR(30) NULL"
        );
        ensureColumn(
            "mission_kind",
            "ALTER TABLE availability_request_activities ADD COLUMN mission_kind VARCHAR(30) NULL"
        );
        ensureColumn(
            "title",
            "ALTER TABLE availability_request_activities ADD COLUMN title VARCHAR(180) NULL"
        );
        ensureColumn(
            "start_date",
            "ALTER TABLE availability_request_activities ADD COLUMN start_date DATE NOT NULL"
        );
        ensureColumn(
            "end_date",
            "ALTER TABLE availability_request_activities ADD COLUMN end_date DATE NOT NULL"
        );
        ensureColumn(
            "reason",
            "ALTER TABLE availability_request_activities ADD COLUMN reason TEXT NOT NULL"
        );
        ensureColumn(
            "department_id",
            "ALTER TABLE availability_request_activities ADD COLUMN department_id BIGINT UNSIGNED NULL"
        );
        ensureColumn(
            "pedagogical_unit",
            "ALTER TABLE availability_request_activities ADD COLUMN pedagogical_unit VARCHAR(180) NULL"
        );
        ensureColumn(
            "department_name",
            "ALTER TABLE availability_request_activities ADD COLUMN department_name VARCHAR(100) NULL"
        );
        ensureColumn(
            "medical_certificate_image_data_url",
            "ALTER TABLE availability_request_activities ADD COLUMN medical_certificate_image_data_url LONGTEXT NULL"
        );
    }

    private void ensureActivityTypeEnum() {
        String columnType = jdbcTemplate.queryForObject(
            """
                SELECT COLUMN_TYPE
                FROM information_schema.columns
                WHERE table_schema = DATABASE()
                  AND table_name = 'activities'
                  AND column_name = 'activity_type'
                """,
            String.class
        );

        if (columnType != null && !columnType.contains("'DISPONIBILITE'")) {
            jdbcTemplate.execute(
                """
                    ALTER TABLE activities
                    MODIFY COLUMN activity_type ENUM(
                      'ENSEIGNEMENT',
                      'ENCADREMENT',
                      'RECHERCHE',
                      'EVENEMENT',
                      'SURVEILLANCE',
                      'RESPONSABILITE',
                      'DISPONIBILITE'
                    ) NOT NULL
                    """
            );
        }
    }

    private void ensureColumn(String columnName, String ddl) {
        Integer columnCount = jdbcTemplate.queryForObject(
            """
                SELECT COUNT(*)
                FROM information_schema.columns
                WHERE table_schema = DATABASE()
                  AND table_name = 'availability_request_activities'
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
