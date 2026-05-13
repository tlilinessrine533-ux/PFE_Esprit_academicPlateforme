USE pfe_academic_platform;

/*
  Add previous-year history for ALL active teachers so historical dashboards
  have enough comparison points.

  Covered years:
  - 2024-2025
  - 2023-2024
  - 2022-2023

  Idempotent behavior:
  - For each (teacher, year, activity type), ensures a MIN target count.
  - Adds only the missing declarations.
*/

SET @now_seed := NOW();

SET @stamp_teaching_hist := DATE_ADD(@now_seed, INTERVAL 11 SECOND);
SET @stamp_partnership_hist := DATE_ADD(@now_seed, INTERVAL 12 SECOND);
SET @stamp_supervision_hist := DATE_ADD(@now_seed, INTERVAL 13 SECOND);
SET @stamp_research_hist := DATE_ADD(@now_seed, INTERVAL 14 SECOND);
SET @stamp_event_hist := DATE_ADD(@now_seed, INTERVAL 15 SECOND);
SET @stamp_surveillance_hist := DATE_ADD(@now_seed, INTERVAL 16 SECOND);
SET @stamp_responsibility_hist := DATE_ADD(@now_seed, INTERVAL 17 SECOND);

DROP TEMPORARY TABLE IF EXISTS tmp_all_teachers;
CREATE TEMPORARY TABLE tmp_all_teachers AS
SELECT
  u.id AS user_id,
  COALESCE(NULLIF(UPPER(TRIM(u.teacher_type)), ''), 'PERMANENT') AS teacher_type,
  u.email
FROM users u
WHERE u.role = 'ENSEIGNANT'
  AND u.is_active = 1;

DROP TEMPORARY TABLE IF EXISTS tmp_year_targets;
CREATE TEMPORARY TABLE tmp_year_targets (
  academic_year VARCHAR(20) PRIMARY KEY,
  teaching_target INT NOT NULL,
  partnership_target INT NOT NULL,
  supervision_target INT NOT NULL,
  research_target INT NOT NULL,
  event_target INT NOT NULL,
  surveillance_target INT NOT NULL,
  responsibility_target INT NOT NULL
);

INSERT INTO tmp_year_targets (
  academic_year,
  teaching_target,
  partnership_target,
  supervision_target,
  research_target,
  event_target,
  surveillance_target,
  responsibility_target
)
VALUES
  ('2024-2025', 5, 1, 4, 3, 3, 4, 2),
  ('2023-2024', 4, 1, 3, 2, 2, 3, 2),
  ('2022-2023', 3, 1, 2, 2, 2, 2, 1);

DROP TEMPORARY TABLE IF EXISTS tmp_seq;
CREATE TEMPORARY TABLE tmp_seq (n INT PRIMARY KEY);
INSERT INTO tmp_seq (n)
VALUES (1), (2), (3), (4), (5), (6), (7), (8), (9), (10);

/*
  ENSEIGNEMENT (history)
*/
DROP TEMPORARY TABLE IF EXISTS tmp_missing_teaching_hist;
CREATE TEMPORARY TABLE tmp_missing_teaching_hist AS
SELECT
  t.user_id,
  y.academic_year,
  GREATEST(0, y.teaching_target - COALESCE(c.cnt, 0)) AS missing_count
FROM tmp_all_teachers t
CROSS JOIN tmp_year_targets y
LEFT JOIN (
  SELECT
    a.user_id,
    a.academic_year,
    COUNT(*) AS cnt
  FROM activities a
  WHERE a.activity_type = 'ENSEIGNEMENT'
    AND a.academic_year IN (SELECT academic_year FROM tmp_year_targets)
  GROUP BY a.user_id, a.academic_year
) c
  ON c.user_id = t.user_id
 AND c.academic_year = y.academic_year;

INSERT INTO activities (
  user_id,
  activity_type,
  status,
  academic_year,
  created_at,
  updated_at
)
SELECT
  m.user_id,
  'ENSEIGNEMENT',
  'VALIDEE_FINALE',
  m.academic_year,
  DATE_SUB(@now_seed, INTERVAL (40 + MOD(m.user_id * 7 + s.n * 11 + CAST(SUBSTRING(m.academic_year, 1, 4) AS UNSIGNED), 1200)) DAY),
  @stamp_teaching_hist
FROM tmp_missing_teaching_hist m
JOIN tmp_seq s
  ON s.n <= m.missing_count;

INSERT INTO teaching_activities (
  activity_id,
  program_name,
  class_name,
  module_name,
  semester,
  teaching_mode,
  language,
  planned_hours,
  completed_hours,
  new_course_hours,
  course_restructuring_percentage,
  course_restructuring_approved,
  syllabus_count,
  car_file_elaborated,
  exam_elaborated,
  evening_or_saturday_hours,
  coordination,
  partnership_declaration_type,
  syllabus_path
)
SELECT
  a.id,
  'Cycle Ingenieur',
  CONCAT('H', 1 + MOD(a.id, 5), '-', CHAR(65 + MOD(a.id, 4))),
  CONCAT('AUTO_HIST_COURS_', REPLACE(a.academic_year, '-', '_'), '_', a.id),
  ELT(1 + MOD(a.id, 3), 'S1', 'S2', 'ANNUEL'),
  ELT(1 + MOD(a.id, 4), 'PRESENTIEL', 'EN_LIGNE', 'ALTERNANCE', 'EXECUTIF'),
  ELT(1 + MOD(a.id, 3), 'Francais', 'Anglais', 'Bilingue'),
  CASE
    WHEN t.teacher_type = 'VACATAIRE' THEN CAST(0.00 AS DECIMAL(6,2))
    ELSE CAST(20 + MOD(a.id, 16) AS DECIMAL(6,2))
  END,
  CASE
    WHEN t.teacher_type = 'VACATAIRE' THEN CAST(0.00 AS DECIMAL(6,2))
    ELSE CAST(18 + MOD(a.id, 14) AS DECIMAL(6,2))
  END,
  CASE
    WHEN t.teacher_type = 'VACATAIRE' THEN CAST(0.00 AS DECIMAL(6,2))
    ELSE CAST(MOD(a.id, 3) AS DECIMAL(6,2))
  END,
  CASE
    WHEN t.teacher_type = 'VACATAIRE' THEN 0
    ELSE MOD(a.id, 3) * 10
  END,
  CASE WHEN MOD(a.id, 2) = 0 THEN 1 ELSE 0 END,
  CASE
    WHEN t.teacher_type = 'VACATAIRE' THEN 0
    ELSE 1 + MOD(a.id, 2)
  END,
  CASE
    WHEN t.teacher_type = 'VACATAIRE' THEN 0
    ELSE 1
  END,
  CASE
    WHEN t.teacher_type = 'VACATAIRE' THEN 0
    ELSE 1
  END,
  CASE
    WHEN t.teacher_type = 'VACATAIRE' THEN CAST(0.00 AS DECIMAL(6,2))
    ELSE CAST(MOD(a.id, 2) AS DECIMAL(6,2))
  END,
  CASE
    WHEN t.teacher_type = 'VACATAIRE' THEN 0
    ELSE CASE WHEN MOD(a.id, 6) = 0 THEN 1 ELSE 0 END
  END,
  NULL,
  NULL
FROM activities a
JOIN tmp_all_teachers t
  ON t.user_id = a.user_id
LEFT JOIN teaching_activities ta
  ON ta.activity_id = a.id
WHERE a.activity_type = 'ENSEIGNEMENT'
  AND a.academic_year IN (SELECT academic_year FROM tmp_year_targets)
  AND a.updated_at = @stamp_teaching_hist
  AND ta.activity_id IS NULL;

/*
  PARTENARIAT minimum per teacher/year (stored in teaching_activities)
*/
DROP TEMPORARY TABLE IF EXISTS tmp_missing_partnership_hist;
CREATE TEMPORARY TABLE tmp_missing_partnership_hist AS
SELECT
  t.user_id,
  y.academic_year,
  GREATEST(0, y.partnership_target - COALESCE(p.cnt, 0)) AS missing_count
FROM tmp_all_teachers t
CROSS JOIN tmp_year_targets y
LEFT JOIN (
  SELECT
    a.user_id,
    a.academic_year,
    COUNT(*) AS cnt
  FROM activities a
  JOIN teaching_activities ta
    ON ta.activity_id = a.id
   AND ta.partnership_declaration_type IS NOT NULL
  WHERE a.activity_type = 'ENSEIGNEMENT'
    AND a.academic_year IN (SELECT academic_year FROM tmp_year_targets)
  GROUP BY a.user_id, a.academic_year
) p
  ON p.user_id = t.user_id
 AND p.academic_year = y.academic_year;

INSERT INTO activities (
  user_id,
  activity_type,
  status,
  academic_year,
  created_at,
  updated_at
)
SELECT
  m.user_id,
  'ENSEIGNEMENT',
  'VALIDEE_FINALE',
  m.academic_year,
  DATE_SUB(@now_seed, INTERVAL (35 + MOD(m.user_id * 9 + s.n * 7 + CAST(SUBSTRING(m.academic_year, 1, 4) AS UNSIGNED), 1000)) DAY),
  @stamp_partnership_hist
FROM tmp_missing_partnership_hist m
JOIN tmp_seq s
  ON s.n <= m.missing_count;

INSERT INTO teaching_activities (
  activity_id,
  program_name,
  class_name,
  module_name,
  semester,
  teaching_mode,
  language,
  planned_hours,
  completed_hours,
  new_course_hours,
  course_restructuring_percentage,
  course_restructuring_approved,
  syllabus_count,
  car_file_elaborated,
  exam_elaborated,
  evening_or_saturday_hours,
  coordination,
  partnership_declaration_type,
  syllabus_path
)
SELECT
  a.id,
  'Cycle Ingenieur',
  CONCAT('P', 1 + MOD(a.id, 4), '-', CHAR(65 + MOD(a.id, 3))),
  CONCAT('AUTO_HIST_PARTENARIAT_', REPLACE(a.academic_year, '-', '_'), '_', a.id),
  ELT(1 + MOD(a.id, 3), 'S1', 'S2', 'ANNUEL'),
  ELT(1 + MOD(a.id, 3), 'PRESENTIEL', 'EN_LIGNE', 'ALTERNANCE'),
  ELT(1 + MOD(a.id, 3), 'Francais', 'Anglais', 'Bilingue'),
  CASE
    WHEN t.teacher_type = 'VACATAIRE' THEN CAST(0.00 AS DECIMAL(6,2))
    ELSE CAST(16 + MOD(a.id, 10) AS DECIMAL(6,2))
  END,
  CASE
    WHEN t.teacher_type = 'VACATAIRE' THEN CAST(0.00 AS DECIMAL(6,2))
    ELSE CAST(14 + MOD(a.id, 8) AS DECIMAL(6,2))
  END,
  CAST(0.00 AS DECIMAL(6,2)),
  0,
  0,
  1,
  0,
  0,
  CAST(0.00 AS DECIMAL(6,2)),
  0,
  CASE
    WHEN MOD(a.user_id, 2) = 0 THEN 'ACADEMIQUE'
    ELSE 'PROFESSIONNELLE'
  END,
  NULL
FROM activities a
JOIN tmp_all_teachers t
  ON t.user_id = a.user_id
LEFT JOIN teaching_activities ta
  ON ta.activity_id = a.id
WHERE a.activity_type = 'ENSEIGNEMENT'
  AND a.academic_year IN (SELECT academic_year FROM tmp_year_targets)
  AND a.updated_at = @stamp_partnership_hist
  AND ta.activity_id IS NULL;

/*
  ENCADREMENT (history)
*/
DROP TEMPORARY TABLE IF EXISTS tmp_missing_supervision_hist;
CREATE TEMPORARY TABLE tmp_missing_supervision_hist AS
SELECT
  t.user_id,
  y.academic_year,
  GREATEST(0, y.supervision_target - COALESCE(c.cnt, 0)) AS missing_count
FROM tmp_all_teachers t
CROSS JOIN tmp_year_targets y
LEFT JOIN (
  SELECT
    a.user_id,
    a.academic_year,
    COUNT(*) AS cnt
  FROM activities a
  WHERE a.activity_type = 'ENCADREMENT'
    AND a.academic_year IN (SELECT academic_year FROM tmp_year_targets)
  GROUP BY a.user_id, a.academic_year
) c
  ON c.user_id = t.user_id
 AND c.academic_year = y.academic_year;

INSERT INTO activities (
  user_id,
  activity_type,
  status,
  academic_year,
  created_at,
  updated_at
)
SELECT
  m.user_id,
  'ENCADREMENT',
  'VALIDEE_FINALE',
  m.academic_year,
  DATE_SUB(@now_seed, INTERVAL (30 + MOD(m.user_id * 13 + s.n * 5 + CAST(SUBSTRING(m.academic_year, 1, 4) AS UNSIGNED), 1000)) DAY),
  @stamp_supervision_hist
FROM tmp_missing_supervision_hist m
JOIN tmp_seq s
  ON s.n <= m.missing_count;

INSERT INTO supervision_activities (
  activity_id,
  supervision_type,
  student_name,
  student_program,
  subject_title,
  supervision_status,
  role_in_jury,
  quantity_value,
  activity_points
)
SELECT
  a.id,
  CASE
    WHEN MOD(a.id, 3) = 0 THEN 'PFE_ENCADREMENT_ACADEMIQUE'
    WHEN MOD(a.id, 3) = 1 THEN 'PFE_RAPPORTEUR'
    ELSE 'PFE_PRESIDENT_JURY'
  END,
  CONCAT('Etudiant ', 100 + MOD(a.id, 900)),
  ELT(1 + MOD(a.id, 4), 'L3', 'M1', 'M2', 'Ingenieur'),
  CONCAT('AUTO_HIST_ENCADREMENT_', REPLACE(a.academic_year, '-', '_'), '_', a.id),
  CASE WHEN MOD(a.id, 2) = 0 THEN 'SOUTENU' ELSE 'EN_COURS' END,
  CASE
    WHEN MOD(a.id, 3) = 0 THEN 'ENCADRANT'
    WHEN MOD(a.id, 3) = 1 THEN 'RAPPORTEUR'
    ELSE 'PRESIDENT_JURY'
  END,
  CAST(1 + MOD(a.id, 2) AS DECIMAL(8,2)),
  CASE
    WHEN t.teacher_type = 'VACATAIRE' THEN CAST(0.00 AS DECIMAL(8,2))
    WHEN MOD(a.id, 3) = 0 THEN CAST(25.00 AS DECIMAL(8,2))
    WHEN MOD(a.id, 3) = 1 THEN CAST(10.00 AS DECIMAL(8,2))
    ELSE CAST(5.00 AS DECIMAL(8,2))
  END
FROM activities a
JOIN tmp_all_teachers t
  ON t.user_id = a.user_id
LEFT JOIN supervision_activities sa
  ON sa.activity_id = a.id
WHERE a.activity_type = 'ENCADREMENT'
  AND a.academic_year IN (SELECT academic_year FROM tmp_year_targets)
  AND a.updated_at = @stamp_supervision_hist
  AND sa.activity_id IS NULL;

/*
  RECHERCHE (history)
*/
DROP TEMPORARY TABLE IF EXISTS tmp_missing_research_hist;
CREATE TEMPORARY TABLE tmp_missing_research_hist AS
SELECT
  t.user_id,
  y.academic_year,
  GREATEST(0, y.research_target - COALESCE(c.cnt, 0)) AS missing_count
FROM tmp_all_teachers t
CROSS JOIN tmp_year_targets y
LEFT JOIN (
  SELECT
    a.user_id,
    a.academic_year,
    COUNT(*) AS cnt
  FROM activities a
  WHERE a.activity_type = 'RECHERCHE'
    AND a.academic_year IN (SELECT academic_year FROM tmp_year_targets)
  GROUP BY a.user_id, a.academic_year
) c
  ON c.user_id = t.user_id
 AND c.academic_year = y.academic_year;

INSERT INTO activities (
  user_id,
  activity_type,
  status,
  academic_year,
  created_at,
  updated_at
)
SELECT
  m.user_id,
  'RECHERCHE',
  'VALIDEE_FINALE',
  m.academic_year,
  DATE_SUB(@now_seed, INTERVAL (25 + MOD(m.user_id * 5 + s.n * 9 + CAST(SUBSTRING(m.academic_year, 1, 4) AS UNSIGNED), 900)) DAY),
  @stamp_research_hist
FROM tmp_missing_research_hist m
JOIN tmp_seq s
  ON s.n <= m.missing_count;

INSERT INTO research_activities (
  activity_id,
  publication_type,
  title,
  venue_name,
  publication_year,
  indexing_name,
  doi,
  student_name,
  pfe_level,
  deliverable,
  publication_rank,
  activity_points
)
SELECT
  a.id,
  CASE
    WHEN MOD(a.id, 2) = 0 THEN 'PUBLICATION_ARTICLE'
    ELSE 'PROJET_RECHERCHE_ARTICLE_CONFERENCE'
  END,
  CONCAT('AUTO_HIST_RECHERCHE_', REPLACE(a.academic_year, '-', '_'), '_', a.id),
  ELT(1 + MOD(a.id, 4), 'IEEE Access', 'Springer', 'ACM DL', 'Scopus Track'),
  CAST(SUBSTRING(a.academic_year, 1, 4) AS UNSIGNED),
  ELT(1 + MOD(a.id, 2), 'Scopus', 'Web of Science'),
  CONCAT('10.7777/', 100000 + MOD(a.id * 31, 900000)),
  NULL,
  NULL,
  NULL,
  ELT(1 + MOD(a.id, 4), 'Q1', 'Q2', 'Q3', 'Q4'),
  CASE
    WHEN t.teacher_type = 'VACATAIRE' THEN CAST(0.00 AS DECIMAL(8,2))
    ELSE CAST(16 + MOD(a.id, 18) AS DECIMAL(8,2))
  END
FROM activities a
JOIN tmp_all_teachers t
  ON t.user_id = a.user_id
LEFT JOIN research_activities ra
  ON ra.activity_id = a.id
WHERE a.activity_type = 'RECHERCHE'
  AND a.academic_year IN (SELECT academic_year FROM tmp_year_targets)
  AND a.updated_at = @stamp_research_hist
  AND ra.activity_id IS NULL;

/*
  EVENEMENT (history)
*/
DROP TEMPORARY TABLE IF EXISTS tmp_missing_event_hist;
CREATE TEMPORARY TABLE tmp_missing_event_hist AS
SELECT
  t.user_id,
  y.academic_year,
  GREATEST(0, y.event_target - COALESCE(c.cnt, 0)) AS missing_count
FROM tmp_all_teachers t
CROSS JOIN tmp_year_targets y
LEFT JOIN (
  SELECT
    a.user_id,
    a.academic_year,
    COUNT(*) AS cnt
  FROM activities a
  WHERE a.activity_type = 'EVENEMENT'
    AND a.academic_year IN (SELECT academic_year FROM tmp_year_targets)
  GROUP BY a.user_id, a.academic_year
) c
  ON c.user_id = t.user_id
 AND c.academic_year = y.academic_year;

INSERT INTO activities (
  user_id,
  activity_type,
  status,
  academic_year,
  created_at,
  updated_at
)
SELECT
  m.user_id,
  'EVENEMENT',
  'VALIDEE_FINALE',
  m.academic_year,
  DATE_SUB(@now_seed, INTERVAL (20 + MOD(m.user_id * 11 + s.n * 3 + CAST(SUBSTRING(m.academic_year, 1, 4) AS UNSIGNED), 800)) DAY),
  @stamp_event_hist
FROM tmp_missing_event_hist m
JOIN tmp_seq s
  ON s.n <= m.missing_count;

INSERT INTO event_activities (
  activity_id,
  event_type,
  title,
  event_date,
  organization_role
)
SELECT
  a.id,
  ELT(1 + MOD(a.id, 5), 'SEMINAIRE', 'COLLOQUE', 'WORKSHOP', 'JOURNEE_SCIENTIFIQUE', 'AUTRE'),
  CONCAT('AUTO_HIST_EVENEMENT_', REPLACE(a.academic_year, '-', '_'), '_', a.id),
  DATE_SUB(CURDATE(), INTERVAL MOD(a.id * 7, 900) DAY),
  ELT(1 + MOD(a.id, 4), 'Organisateur', 'Co-organisateur', 'Membre', 'Participant')
FROM activities a
LEFT JOIN event_activities ea
  ON ea.activity_id = a.id
WHERE a.activity_type = 'EVENEMENT'
  AND a.academic_year IN (SELECT academic_year FROM tmp_year_targets)
  AND a.updated_at = @stamp_event_hist
  AND ea.activity_id IS NULL;

/*
  SURVEILLANCE (history)
*/
DROP TEMPORARY TABLE IF EXISTS tmp_missing_surveillance_hist;
CREATE TEMPORARY TABLE tmp_missing_surveillance_hist AS
SELECT
  t.user_id,
  y.academic_year,
  GREATEST(0, y.surveillance_target - COALESCE(c.cnt, 0)) AS missing_count
FROM tmp_all_teachers t
CROSS JOIN tmp_year_targets y
LEFT JOIN (
  SELECT
    a.user_id,
    a.academic_year,
    COUNT(*) AS cnt
  FROM activities a
  WHERE a.activity_type = 'SURVEILLANCE'
    AND a.academic_year IN (SELECT academic_year FROM tmp_year_targets)
  GROUP BY a.user_id, a.academic_year
) c
  ON c.user_id = t.user_id
 AND c.academic_year = y.academic_year;

INSERT INTO activities (
  user_id,
  activity_type,
  status,
  academic_year,
  created_at,
  updated_at
)
SELECT
  m.user_id,
  'SURVEILLANCE',
  'VALIDEE_FINALE',
  m.academic_year,
  DATE_SUB(@now_seed, INTERVAL (18 + MOD(m.user_id * 3 + s.n * 15 + CAST(SUBSTRING(m.academic_year, 1, 4) AS UNSIGNED), 700)) DAY),
  @stamp_surveillance_hist
FROM tmp_missing_surveillance_hist m
JOIN tmp_seq s
  ON s.n <= m.missing_count;

INSERT INTO exam_surveillance_activities (
  activity_id,
  session_name,
  semester,
  hours_count,
  session_day,
  session_points
)
SELECT
  a.id,
  CONCAT('AUTO_HIST_SURVEILLANCE_', REPLACE(a.academic_year, '-', '_'), '_', a.id),
  ELT(1 + MOD(a.id, 3), 'S1', 'S2', 'ANNUEL'),
  CAST(1 + MOD(a.id, 2) AS DECIMAL(6,2)),
  ELT(1 + MOD(a.id, 6), 'LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI'),
  CASE
    WHEN t.teacher_type = 'VACATAIRE' THEN CAST(0.00 AS DECIMAL(4,2))
    ELSE CAST(1 + MOD(a.id, 2) AS DECIMAL(4,2))
  END
FROM activities a
JOIN tmp_all_teachers t
  ON t.user_id = a.user_id
LEFT JOIN exam_surveillance_activities esa
  ON esa.activity_id = a.id
WHERE a.activity_type = 'SURVEILLANCE'
  AND a.academic_year IN (SELECT academic_year FROM tmp_year_targets)
  AND a.updated_at = @stamp_surveillance_hist
  AND esa.activity_id IS NULL;

/*
  RESPONSABILITE (history)
*/
DROP TEMPORARY TABLE IF EXISTS tmp_missing_responsibility_hist;
CREATE TEMPORARY TABLE tmp_missing_responsibility_hist AS
SELECT
  t.user_id,
  y.academic_year,
  GREATEST(0, y.responsibility_target - COALESCE(c.cnt, 0)) AS missing_count
FROM tmp_all_teachers t
CROSS JOIN tmp_year_targets y
LEFT JOIN (
  SELECT
    a.user_id,
    a.academic_year,
    COUNT(*) AS cnt
  FROM activities a
  WHERE a.activity_type = 'RESPONSABILITE'
    AND a.academic_year IN (SELECT academic_year FROM tmp_year_targets)
  GROUP BY a.user_id, a.academic_year
) c
  ON c.user_id = t.user_id
 AND c.academic_year = y.academic_year;

INSERT INTO activities (
  user_id,
  activity_type,
  status,
  academic_year,
  created_at,
  updated_at
)
SELECT
  m.user_id,
  'RESPONSABILITE',
  'VALIDEE_FINALE',
  m.academic_year,
  DATE_SUB(@now_seed, INTERVAL (15 + MOD(m.user_id * 17 + s.n * 9 + CAST(SUBSTRING(m.academic_year, 1, 4) AS UNSIGNED), 600)) DAY),
  @stamp_responsibility_hist
FROM tmp_missing_responsibility_hist m
JOIN tmp_seq s
  ON s.n <= m.missing_count;

INSERT INTO responsibility_activities (
  activity_id,
  responsibility_type,
  start_date,
  end_date
)
SELECT
  a.id,
  ELT(1 + MOD(a.id, 5), 'MAITRE_STAGE', 'COORDINATEUR_MODULE', 'RESPONSABLE_FILIERE', 'CHEF_DEPARTEMENT', 'AUTRE'),
  DATE_SUB(CURDATE(), INTERVAL (90 + MOD(a.id, 300)) DAY),
  CASE
    WHEN MOD(a.id, 3) = 0 THEN NULL
    ELSE DATE_ADD(CURDATE(), INTERVAL (30 + MOD(a.id, 240)) DAY)
  END
FROM activities a
LEFT JOIN responsibility_activities ra
  ON ra.activity_id = a.id
WHERE a.activity_type = 'RESPONSABILITE'
  AND a.academic_year IN (SELECT academic_year FROM tmp_year_targets)
  AND a.updated_at = @stamp_responsibility_hist
  AND ra.activity_id IS NULL;

/*
  Diagnostics
*/
SET @target_user_id := (SELECT id FROM users WHERE email = 'enseignant@esprit.tn' LIMIT 1);

SELECT
  'available_years_enseignant' AS scope,
  a.academic_year,
  COUNT(*) AS total
FROM activities a
WHERE a.user_id = @target_user_id
GROUP BY a.academic_year
ORDER BY a.academic_year DESC;

SELECT
  a.academic_year,
  SUM(a.activity_type = 'ENSEIGNEMENT') AS teaching_count,
  SUM(a.activity_type = 'ENCADREMENT') AS supervision_count,
  SUM(a.activity_type = 'RECHERCHE') AS research_count,
  SUM(a.activity_type = 'EVENEMENT') AS event_count,
  SUM(a.activity_type = 'SURVEILLANCE') AS surveillance_count,
  SUM(a.activity_type = 'RESPONSABILITE') AS responsibility_count
FROM activities a
WHERE a.user_id = @target_user_id
  AND a.academic_year IN (SELECT academic_year FROM tmp_year_targets UNION SELECT '2025-2026')
GROUP BY a.academic_year
ORDER BY a.academic_year DESC;

SELECT
  a.academic_year,
  a.activity_type,
  COUNT(*) AS total_activities
FROM activities a
JOIN users u
  ON u.id = a.user_id
WHERE u.role = 'ENSEIGNANT'
  AND u.is_active = 1
  AND a.academic_year IN (SELECT academic_year FROM tmp_year_targets)
GROUP BY a.academic_year, a.activity_type
ORDER BY a.academic_year DESC, a.activity_type;
