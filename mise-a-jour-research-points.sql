USE pfe_academic_platform;

ALTER TABLE research_activities
  MODIFY COLUMN publication_type VARCHAR(80) NOT NULL,
  ADD COLUMN IF NOT EXISTS student_name VARCHAR(150) NULL,
  ADD COLUMN IF NOT EXISTS pfe_level VARCHAR(100) NULL,
  ADD COLUMN IF NOT EXISTS deliverable VARCHAR(180) NULL,
  ADD COLUMN IF NOT EXISTS publication_rank VARCHAR(20) NULL,
  ADD COLUMN IF NOT EXISTS activity_points DECIMAL(8,2) NOT NULL DEFAULT 0.00;

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
END;
