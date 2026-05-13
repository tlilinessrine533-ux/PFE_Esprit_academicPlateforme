package com.esprit.academicplatform.config;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AdministrationSchemaBootstrap implements CommandLineRunner {

    private static final String CREATE_ADMINISTRATION_SETTINGS_TABLE = """
        CREATE TABLE IF NOT EXISTS administration_settings (
          setting_key VARCHAR(120) PRIMARY KEY,
          setting_value VARCHAR(300) NOT NULL,
          updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB
        """;

    private static final String CREATE_ADMINISTRATIVE_DECISIONS_TABLE = """
        CREATE TABLE IF NOT EXISTS administrative_decisions (
          id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
          teacher_id BIGINT UNSIGNED NOT NULL,
          period_label VARCHAR(20) NOT NULL,
          validated_activities BIGINT NOT NULL DEFAULT 0,
          validated_teaching_points DECIMAL(10,2) NOT NULL DEFAULT 0.00,
          absence_days INT NOT NULL DEFAULT 0,
          activity_type_points DECIMAL(10,2) NOT NULL DEFAULT 0.00,
          calculated_bonus DECIMAL(12,2) NOT NULL DEFAULT 0.00,
          calculated_promotion_points DECIMAL(12,2) NOT NULL DEFAULT 0.00,
          decision_status VARCHAR(20) NOT NULL,
          decision_comment VARCHAR(1000) NULL,
          decided_by_id BIGINT UNSIGNED NULL,
          decided_at DATETIME NULL,
          created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_admin_decisions_teacher_period (teacher_id, period_label),
          INDEX idx_admin_decisions_period (period_label),
          CONSTRAINT fk_admin_decisions_teacher
            FOREIGN KEY (teacher_id) REFERENCES users(id)
            ON DELETE CASCADE
            ON UPDATE CASCADE,
          CONSTRAINT fk_admin_decisions_actor
            FOREIGN KEY (decided_by_id) REFERENCES users(id)
            ON DELETE SET NULL
            ON UPDATE CASCADE
        ) ENGINE=InnoDB
        """;

    private static final String INSERT_DEFAULT_BONUS_BASE = """
        INSERT IGNORE INTO administration_settings (setting_key, setting_value)
        VALUES ('bonus.base.amount', '500.00')
        """;

    private static final String INSERT_DEFAULT_BONUS_AMOUNT_PER_POINT = """
        INSERT IGNORE INTO administration_settings (setting_key, setting_value)
        VALUES ('bonus.amount.per.point', '10.00')
        """;

    private static final String INSERT_DEFAULT_BONUS_ABSENCE_PENALTY = """
        INSERT IGNORE INTO administration_settings (setting_key, setting_value)
        VALUES ('bonus.absence.penalty.per.day', '5.00')
        """;

    private static final String INSERT_DEFAULT_PROMOTION_FACTOR = """
        INSERT IGNORE INTO administration_settings (setting_key, setting_value)
        VALUES ('promotion.teaching.point.factor', '0.10')
        """;

    private static final String INSERT_DEFAULT_POINTS_TEACHING = """
        INSERT IGNORE INTO administration_settings (setting_key, setting_value)
        VALUES ('points.teaching', '5.00')
        """;

    private static final String INSERT_DEFAULT_POINTS_SUPERVISION = """
        INSERT IGNORE INTO administration_settings (setting_key, setting_value)
        VALUES ('points.supervision', '3.00')
        """;

    private static final String INSERT_DEFAULT_POINTS_RESEARCH = """
        INSERT IGNORE INTO administration_settings (setting_key, setting_value)
        VALUES ('points.research', '4.00')
        """;

    private static final String INSERT_DEFAULT_POINTS_EVENT = """
        INSERT IGNORE INTO administration_settings (setting_key, setting_value)
        VALUES ('points.event', '2.00')
        """;

    private static final String INSERT_DEFAULT_POINTS_EXAM = """
        INSERT IGNORE INTO administration_settings (setting_key, setting_value)
        VALUES ('points.exam.surveillance', '1.00')
        """;

    private static final String INSERT_DEFAULT_POINTS_RESPONSIBILITY = """
        INSERT IGNORE INTO administration_settings (setting_key, setting_value)
        VALUES ('points.responsibility', '3.00')
        """;

    private static final String INSERT_DEFAULT_POINTS_AVAILABILITY = """
        INSERT IGNORE INTO administration_settings (setting_key, setting_value)
        VALUES ('points.availability', '1.00')
        """;

    private final JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) {
        jdbcTemplate.execute(CREATE_ADMINISTRATION_SETTINGS_TABLE);
        jdbcTemplate.execute(CREATE_ADMINISTRATIVE_DECISIONS_TABLE);
        jdbcTemplate.execute(INSERT_DEFAULT_BONUS_BASE);
        jdbcTemplate.execute(INSERT_DEFAULT_BONUS_AMOUNT_PER_POINT);
        jdbcTemplate.execute(INSERT_DEFAULT_BONUS_ABSENCE_PENALTY);
        jdbcTemplate.execute(INSERT_DEFAULT_PROMOTION_FACTOR);
        jdbcTemplate.execute(INSERT_DEFAULT_POINTS_TEACHING);
        jdbcTemplate.execute(INSERT_DEFAULT_POINTS_SUPERVISION);
        jdbcTemplate.execute(INSERT_DEFAULT_POINTS_RESEARCH);
        jdbcTemplate.execute(INSERT_DEFAULT_POINTS_EVENT);
        jdbcTemplate.execute(INSERT_DEFAULT_POINTS_EXAM);
        jdbcTemplate.execute(INSERT_DEFAULT_POINTS_RESPONSIBILITY);
        jdbcTemplate.execute(INSERT_DEFAULT_POINTS_AVAILABILITY);
    }
}

