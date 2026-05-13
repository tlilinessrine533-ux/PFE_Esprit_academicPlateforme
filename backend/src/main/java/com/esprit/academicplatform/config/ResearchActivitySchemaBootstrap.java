package com.esprit.academicplatform.config;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ResearchActivitySchemaBootstrap implements CommandLineRunner {

    private static final String CREATE_RESEARCH_TABLE = """
        CREATE TABLE IF NOT EXISTS research_activities (
          activity_id BIGINT UNSIGNED PRIMARY KEY,
          publication_type VARCHAR(80) NOT NULL,
          title VARCHAR(255) NOT NULL,
          venue_name VARCHAR(255) NOT NULL,
          publication_year INT NOT NULL,
          indexing_name VARCHAR(100) NULL,
          doi VARCHAR(100) NULL,
          student_name VARCHAR(150) NULL,
          pfe_level VARCHAR(100) NULL,
          deliverable VARCHAR(180) NULL,
          publication_rank VARCHAR(20) NULL,
          activity_points DECIMAL(8,2) NOT NULL DEFAULT 0.00,
          CONSTRAINT fk_research_activity
            FOREIGN KEY (activity_id) REFERENCES activities(id)
            ON DELETE CASCADE
            ON UPDATE CASCADE
        ) ENGINE=InnoDB
        """;

    private final JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) {
        jdbcTemplate.execute(CREATE_RESEARCH_TABLE);
        jdbcTemplate.execute("ALTER TABLE research_activities MODIFY COLUMN publication_type VARCHAR(80) NOT NULL");
        jdbcTemplate.execute("ALTER TABLE research_activities MODIFY COLUMN publication_rank VARCHAR(20) NULL");

        ensureColumn(
            "student_name",
            "ALTER TABLE research_activities ADD COLUMN student_name VARCHAR(150) NULL"
        );
        ensureColumn(
            "pfe_level",
            "ALTER TABLE research_activities ADD COLUMN pfe_level VARCHAR(100) NULL"
        );
        ensureColumn(
            "deliverable",
            "ALTER TABLE research_activities ADD COLUMN deliverable VARCHAR(180) NULL"
        );
        ensureColumn(
            "publication_rank",
            "ALTER TABLE research_activities ADD COLUMN publication_rank VARCHAR(20) NULL"
        );
        ensureColumn(
            "activity_points",
            "ALTER TABLE research_activities ADD COLUMN activity_points DECIMAL(8,2) NOT NULL DEFAULT 0.00"
        );

        jdbcTemplate.execute(
            """
            UPDATE research_activities
            SET publication_type = CASE
              WHEN publication_type IS NULL OR TRIM(publication_type) = '' THEN 'ARTICLE'
              WHEN UPPER(TRIM(publication_type)) IN ('ARTICLE', 'PUBLICATION_ARTICLE') THEN 'PUBLICATION_ARTICLE'
              WHEN UPPER(TRIM(publication_type)) IN ('PROJET_DEVELOPPEMENT_UNITE_RECHERCHE') THEN 'PROJET_DEVELOPPEMENT_UNITE_RECHERCHE'
              WHEN UPPER(TRIM(publication_type)) IN ('PROJET_RECHERCHE_ARTICLE_CONFERENCE') THEN 'PROJET_RECHERCHE_ARTICLE_CONFERENCE'
              WHEN UPPER(TRIM(publication_type)) IN ('PROJET_RECHERCHE', 'RESEARCH_PROJECT') THEN 'PROJET_RECHERCHE'
              WHEN UPPER(TRIM(publication_type)) IN ('PRESENTATION_TRAVAIL', 'PRESENTATION') THEN 'PRESENTATION_TRAVAIL'
              WHEN UPPER(TRIM(publication_type)) IN ('CONFERENCE') THEN 'CONFERENCE'
              WHEN UPPER(TRIM(publication_type)) IN ('COMMUNICATION') THEN 'COMMUNICATION'
              WHEN UPPER(TRIM(publication_type)) IN ('CHAPITRE_OUVRAGE', 'BOOK_CHAPTER') THEN 'CHAPITRE_OUVRAGE'
              ELSE 'PUBLICATION_ARTICLE'
            END
            """
        );

        jdbcTemplate.execute(
            """
            UPDATE research_activities
            SET publication_rank = CASE
              WHEN publication_rank IS NULL OR TRIM(publication_rank) = '' THEN NULL
              WHEN UPPER(TRIM(publication_rank)) IN ('Q1', 'Q2', 'Q3', 'Q4', 'CONFERENCE') THEN UPPER(TRIM(publication_rank))
              ELSE NULL
            END
            """
        );

        jdbcTemplate.execute(
            """
            UPDATE research_activities
            SET
              title = COALESCE(NULLIF(TRIM(title), ''), 'Titre non renseigne'),
              venue_name = COALESCE(NULLIF(TRIM(venue_name), ''), 'Venue non renseignee'),
              publication_year = COALESCE(publication_year, YEAR(CURDATE()))
            """
        );

        jdbcTemplate.execute(
            """
            UPDATE research_activities
            SET activity_points = CASE
              WHEN publication_type = 'PROJET_DEVELOPPEMENT_UNITE_RECHERCHE' THEN 50.00
              WHEN publication_type = 'PROJET_RECHERCHE_ARTICLE_CONFERENCE' THEN 120.00
              WHEN publication_type = 'PROJET_RECHERCHE' THEN 120.00
              WHEN publication_type = 'PRESENTATION_TRAVAIL' THEN 10.00
              WHEN publication_type = 'COMMUNICATION' THEN 10.00
              WHEN publication_type = 'PUBLICATION_ARTICLE' THEN 50.00 * CASE
                WHEN publication_rank = 'Q1' THEN 2.00
                WHEN publication_rank = 'Q2' THEN 1.50
                WHEN publication_rank = 'Q4' THEN 0.75
                WHEN publication_rank = 'CONFERENCE' THEN 0.50
                ELSE 1.00
              END
              WHEN publication_type = 'CONFERENCE' THEN 25.00
              ELSE 50.00
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
                  AND table_name = 'research_activities'
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
