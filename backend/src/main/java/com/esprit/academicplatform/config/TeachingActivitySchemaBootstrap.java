package com.esprit.academicplatform.config;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class TeachingActivitySchemaBootstrap implements CommandLineRunner {

    private static final String CREATE_TEACHING_TABLE = """
        CREATE TABLE IF NOT EXISTS teaching_activities (
          activity_id BIGINT UNSIGNED PRIMARY KEY,
          program_name VARCHAR(150) NOT NULL,
          class_name VARCHAR(100) NOT NULL,
          module_name VARCHAR(150) NOT NULL,
          semester ENUM('S1', 'S2', 'ANNUEL') NOT NULL,
          teaching_mode ENUM('PRESENTIEL', 'EN_LIGNE', 'ALTERNANCE', 'EXECUTIF') NOT NULL,
          language VARCHAR(50) NOT NULL,
          planned_hours DECIMAL(6,2) NOT NULL,
          completed_hours DECIMAL(6,2) NOT NULL,
          new_course_hours DECIMAL(6,2) NOT NULL DEFAULT 0.00,
          course_restructuring_percentage INT NOT NULL DEFAULT 0,
          course_restructuring_approved TINYINT(1) NULL,
          syllabus_count INT NOT NULL DEFAULT 0,
          car_file_elaborated TINYINT(1) NOT NULL DEFAULT 0,
          exam_elaborated TINYINT(1) NOT NULL DEFAULT 0,
          evening_or_saturday_hours DECIMAL(6,2) NOT NULL DEFAULT 0.00,
          coordination TINYINT(1) NOT NULL DEFAULT 0,
          partnership_declaration_type ENUM('ACADEMIQUE', 'PROFESSIONNELLE') NULL,
          syllabus_path VARCHAR(255) NULL,
          CONSTRAINT fk_teaching_activity
            FOREIGN KEY (activity_id) REFERENCES activities(id)
            ON DELETE CASCADE
            ON UPDATE CASCADE
        ) ENGINE=InnoDB
        """;

    private final JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) {
        jdbcTemplate.execute(CREATE_TEACHING_TABLE);
        jdbcTemplate.execute("ALTER TABLE teaching_activities MODIFY COLUMN semester VARCHAR(10) NOT NULL");
        jdbcTemplate.execute("ALTER TABLE teaching_activities MODIFY COLUMN teaching_mode VARCHAR(30) NOT NULL");
        jdbcTemplate.execute("ALTER TABLE teaching_activities MODIFY COLUMN partnership_declaration_type VARCHAR(20) NULL");

        ensureColumn(
            "new_course_hours",
            "ALTER TABLE teaching_activities ADD COLUMN new_course_hours DECIMAL(6,2) NOT NULL DEFAULT 0.00"
        );
        ensureColumn(
            "course_restructuring_percentage",
            "ALTER TABLE teaching_activities ADD COLUMN course_restructuring_percentage INT NOT NULL DEFAULT 0"
        );
        ensureColumn(
            "course_restructuring_approved",
            "ALTER TABLE teaching_activities ADD COLUMN course_restructuring_approved TINYINT(1) NULL"
        );
        ensureColumn(
            "syllabus_count",
            "ALTER TABLE teaching_activities ADD COLUMN syllabus_count INT NOT NULL DEFAULT 0"
        );
        ensureColumn(
            "car_file_elaborated",
            "ALTER TABLE teaching_activities ADD COLUMN car_file_elaborated TINYINT(1) NOT NULL DEFAULT 0"
        );
        ensureColumn(
            "exam_elaborated",
            "ALTER TABLE teaching_activities ADD COLUMN exam_elaborated TINYINT(1) NOT NULL DEFAULT 0"
        );
        ensureColumn(
            "evening_or_saturday_hours",
            "ALTER TABLE teaching_activities ADD COLUMN evening_or_saturday_hours DECIMAL(6,2) NOT NULL DEFAULT 0.00"
        );
        ensureColumn(
            "coordination",
            "ALTER TABLE teaching_activities ADD COLUMN coordination TINYINT(1) NOT NULL DEFAULT 0"
        );
        ensureColumn(
            "partnership_declaration_type",
            "ALTER TABLE teaching_activities ADD COLUMN partnership_declaration_type VARCHAR(20) NULL"
        );
        ensureColumn(
            "syllabus_path",
            "ALTER TABLE teaching_activities ADD COLUMN syllabus_path VARCHAR(255) NULL"
        );

        jdbcTemplate.execute(
            """
            UPDATE teaching_activities
            SET
              planned_hours = COALESCE(planned_hours, 0.00),
              completed_hours = COALESCE(completed_hours, 0.00),
              new_course_hours = COALESCE(new_course_hours, 0.00),
              course_restructuring_percentage = COALESCE(course_restructuring_percentage, 0),
              syllabus_count = COALESCE(syllabus_count, 0),
              evening_or_saturday_hours = COALESCE(evening_or_saturday_hours, 0.00),
              language = CASE
                WHEN language IS NULL OR TRIM(language) = '' THEN 'FR'
                ELSE language
              END
            """
        );

        jdbcTemplate.execute(
            """
            UPDATE teaching_activities
            SET semester = CASE
              WHEN UPPER(TRIM(semester)) IN ('S1', 'SEM1', 'SEMESTRE_1', 'SEMESTRE1', '1') THEN 'S1'
              WHEN UPPER(TRIM(semester)) IN ('S2', 'SEM2', 'SEMESTRE_2', 'SEMESTRE2', '2') THEN 'S2'
              WHEN UPPER(TRIM(semester)) IN ('ANNUEL', 'ANNUELLE', 'YEARLY') THEN 'ANNUEL'
              ELSE 'ANNUEL'
            END
            """
        );

        jdbcTemplate.execute(
            """
            UPDATE teaching_activities
            SET teaching_mode = CASE
              WHEN UPPER(REPLACE(REPLACE(TRIM(teaching_mode), '-', '_'), ' ', '_')) IN (
                'EN_LIGNE', 'ONLINE', 'DISTANCIEL', 'A_DISTANCE'
              ) THEN 'EN_LIGNE'
              WHEN UPPER(REPLACE(REPLACE(TRIM(teaching_mode), '-', '_'), ' ', '_')) IN (
                'ALTERNANCE', 'HYBRIDE', 'HYBRID'
              ) THEN 'ALTERNANCE'
              WHEN UPPER(REPLACE(REPLACE(TRIM(teaching_mode), '-', '_'), ' ', '_')) IN (
                'EXECUTIF', 'EXECUTIVE'
              ) THEN 'EXECUTIF'
              WHEN teaching_mode IS NULL OR TRIM(teaching_mode) = '' THEN 'PRESENTIEL'
              ELSE 'PRESENTIEL'
            END
            """
        );

        jdbcTemplate.execute(
            """
            UPDATE teaching_activities
            SET partnership_declaration_type = CASE
              WHEN partnership_declaration_type IS NULL OR TRIM(partnership_declaration_type) = '' THEN NULL
              WHEN UPPER(TRIM(partnership_declaration_type)) IN ('ACADEMIQUE', 'ACADEMIC', 'UNIVERSITAIRE') THEN 'ACADEMIQUE'
              WHEN UPPER(TRIM(partnership_declaration_type)) IN ('PROFESSIONNELLE', 'PROFESSIONNEL', 'PROFESSIONAL') THEN 'PROFESSIONNELLE'
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
                  AND table_name = 'teaching_activities'
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
