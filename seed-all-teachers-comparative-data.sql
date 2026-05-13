USE pfe_academic_platform;

/*
  Global comparative seed for ALL active teacher accounts.
  Goals for academic year 2025-2026:
  - guarantee minimum declarations per teacher for each activity type
  - guarantee at least one partnership declaration per teacher
  - idempotent behavior (re-runnable without uncontrolled duplicates)
*/

SET @seed_year := '2025-2026';
SET @now_seed := NOW();

SET @target_teaching := 4;
SET @target_supervision := 3;
SET @target_research := 2;
SET @target_event := 2;
SET @target_surveillance := 3;
SET @target_responsibility := 2;

SET @stamp_teaching := DATE_ADD(@now_seed, INTERVAL 1 SECOND);
SET @stamp_partnership := DATE_ADD(@now_seed, INTERVAL 2 SECOND);
SET @stamp_supervision := DATE_ADD(@now_seed, INTERVAL 3 SECOND);
SET @stamp_research := DATE_ADD(@now_seed, INTERVAL 4 SECOND);
SET @stamp_event := DATE_ADD(@now_seed, INTERVAL 5 SECOND);
SET @stamp_surveillance := DATE_ADD(@now_seed, INTERVAL 6 SECOND);
SET @stamp_responsibility := DATE_ADD(@now_seed, INTERVAL 7 SECOND);

DROP TEMPORARY TABLE IF EXISTS tmp_all_teachers;
CREATE TEMPORARY TABLE tmp_all_teachers AS
SELECT
  u.id AS user_id,
  COALESCE(NULLIF(UPPER(TRIM(u.teacher_type)), ''), 'PERMANENT') AS teacher_type,
  u.email
FROM users u
WHERE u.role = 'ENSEIGNANT'
  AND u.is_active = 1;

DROP TEMPORARY TABLE IF EXISTS tmp_seq;
CREATE TEMPORARY TABLE tmp_seq (
  n INT PRIMARY KEY
);
INSERT INTO tmp_seq (n)
VALUES (1), (2), (3), (4), (5), (6), (7), (8), (9), (10);

/*
  1) ENSEIGNEMENT minimum
*/
DROP TEMPORARY TABLE IF EXISTS tmp_missing_teaching;
CREATE TEMPORARY TABLE tmp_missing_teaching AS
SELECT
  t.user_id,
  GREATEST(0, @target_teaching - COALESCE(c.cnt, 0)) AS missing_count
FROM tmp_all_teachers t
LEFT JOIN (
  SELECT a.user_id, COUNT(*) AS cnt
  FROM activities a
  WHERE a.activity_type = 'ENSEIGNEMENT'
    AND a.academic_year = @seed_year
  GROUP BY a.user_id
) c
  ON c.user_id = t.user_id;

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
  @seed_year,
  DATE_SUB(@now_seed, INTERVAL (15 + MOD(m.user_id * 5 + s.n * 7, 180)) DAY),
  @stamp_teaching
FROM tmp_missing_teaching m
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
  CONCAT('G', 1 + MOD(a.id, 5), '-', CHAR(65 + MOD(a.id, 4))),
  CONCAT('AUTO_COURS_', REPLACE(@seed_year, '-', '_'), '_', a.id),
  ELT(1 + MOD(a.id, 3), 'S1', 'S2', 'ANNUEL'),
  ELT(1 + MOD(a.id, 4), 'PRESENTIEL', 'EN_LIGNE', 'ALTERNANCE', 'EXECUTIF'),
  ELT(1 + MOD(a.id, 3), 'Francais', 'Anglais', 'Bilingue'),
  CASE
    WHEN t.teacher_type = 'VACATAIRE' THEN CAST(0.00 AS DECIMAL(6,2))
    ELSE CAST(24 + MOD(a.id, 20) AS DECIMAL(6,2))
  END,
  CASE
    WHEN t.teacher_type = 'VACATAIRE' THEN CAST(0.00 AS DECIMAL(6,2))
    ELSE CAST(22 + MOD(a.id, 18) AS DECIMAL(6,2))
  END,
  CASE
    WHEN t.teacher_type = 'VACATAIRE' THEN CAST(0.00 AS DECIMAL(6,2))
    ELSE CAST(MOD(a.id, 4) AS DECIMAL(6,2))
  END,
  CASE
    WHEN t.teacher_type = 'VACATAIRE' THEN 0
    ELSE MOD(a.id, 4) * 10
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
    ELSE CAST(MOD(a.id, 3) AS DECIMAL(6,2))
  END,
  CASE
    WHEN t.teacher_type = 'VACATAIRE' THEN 0
    ELSE CASE WHEN MOD(a.id, 5) = 0 THEN 1 ELSE 0 END
  END,
  NULL,
  NULL
FROM activities a
JOIN tmp_all_teachers t
  ON t.user_id = a.user_id
LEFT JOIN teaching_activities ta
  ON ta.activity_id = a.id
WHERE a.activity_type = 'ENSEIGNEMENT'
  AND a.academic_year = @seed_year
  AND a.updated_at = @stamp_teaching
  AND ta.activity_id IS NULL;

/*
  Partnership minimum: at least one partnership declaration per teacher.
*/
DROP TEMPORARY TABLE IF EXISTS tmp_missing_partnership;
CREATE TEMPORARY TABLE tmp_missing_partnership AS
SELECT t.user_id
FROM tmp_all_teachers t
LEFT JOIN (
  SELECT a.user_id, COUNT(*) AS cnt
  FROM activities a
  JOIN teaching_activities ta
    ON ta.activity_id = a.id
  WHERE a.activity_type = 'ENSEIGNEMENT'
    AND a.academic_year = @seed_year
    AND ta.partnership_declaration_type IS NOT NULL
  GROUP BY a.user_id
) p
  ON p.user_id = t.user_id
WHERE COALESCE(p.cnt, 0) = 0;

INSERT INTO activities (
  user_id,
  activity_type,
  status,
  academic_year,
  created_at,
  updated_at
)
SELECT
  mp.user_id,
  'ENSEIGNEMENT',
  'VALIDEE_FINALE',
  @seed_year,
  DATE_SUB(@now_seed, INTERVAL (10 + MOD(mp.user_id * 9, 140)) DAY),
  @stamp_partnership
FROM tmp_missing_partnership mp;

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
  CONCAT('AUTO_PARTENARIAT_', REPLACE(@seed_year, '-', '_'), '_', a.id),
  ELT(1 + MOD(a.id, 3), 'S1', 'S2', 'ANNUEL'),
  ELT(1 + MOD(a.id, 3), 'PRESENTIEL', 'EN_LIGNE', 'ALTERNANCE'),
  ELT(1 + MOD(a.id, 3), 'Francais', 'Anglais', 'Bilingue'),
  CASE
    WHEN t.teacher_type = 'VACATAIRE' THEN CAST(0.00 AS DECIMAL(6,2))
    ELSE CAST(18 + MOD(a.id, 12) AS DECIMAL(6,2))
  END,
  CASE
    WHEN t.teacher_type = 'VACATAIRE' THEN CAST(0.00 AS DECIMAL(6,2))
    ELSE CAST(16 + MOD(a.id, 10) AS DECIMAL(6,2))
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
  AND a.academic_year = @seed_year
  AND a.updated_at = @stamp_partnership
  AND ta.activity_id IS NULL;

/*
  2) ENCADREMENT minimum
*/
DROP TEMPORARY TABLE IF EXISTS tmp_missing_supervision;
CREATE TEMPORARY TABLE tmp_missing_supervision AS
SELECT
  t.user_id,
  GREATEST(0, @target_supervision - COALESCE(c.cnt, 0)) AS missing_count
FROM tmp_all_teachers t
LEFT JOIN (
  SELECT a.user_id, COUNT(*) AS cnt
  FROM activities a
  WHERE a.activity_type = 'ENCADREMENT'
    AND a.academic_year = @seed_year
  GROUP BY a.user_id
) c
  ON c.user_id = t.user_id;

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
  @seed_year,
  DATE_SUB(@now_seed, INTERVAL (20 + MOD(m.user_id * 7 + s.n * 5, 200)) DAY),
  @stamp_supervision
FROM tmp_missing_supervision m
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
  CONCAT('AUTO_ENCADREMENT_', REPLACE(@seed_year, '-', '_'), '_', a.id),
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
  AND a.academic_year = @seed_year
  AND a.updated_at = @stamp_supervision
  AND sa.activity_id IS NULL;

/*
  3) RECHERCHE minimum
*/
DROP TEMPORARY TABLE IF EXISTS tmp_missing_research;
CREATE TEMPORARY TABLE tmp_missing_research AS
SELECT
  t.user_id,
  GREATEST(0, @target_research - COALESCE(c.cnt, 0)) AS missing_count
FROM tmp_all_teachers t
LEFT JOIN (
  SELECT a.user_id, COUNT(*) AS cnt
  FROM activities a
  WHERE a.activity_type = 'RECHERCHE'
    AND a.academic_year = @seed_year
  GROUP BY a.user_id
) c
  ON c.user_id = t.user_id;

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
  @seed_year,
  DATE_SUB(@now_seed, INTERVAL (18 + MOD(m.user_id * 11 + s.n * 3, 170)) DAY),
  @stamp_research
FROM tmp_missing_research m
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
  CONCAT('AUTO_RECHERCHE_', REPLACE(@seed_year, '-', '_'), '_', a.id),
  ELT(1 + MOD(a.id, 4), 'IEEE Access', 'Springer', 'ACM DL', 'Scopus Track'),
  YEAR(CURDATE()),
  ELT(1 + MOD(a.id, 2), 'Scopus', 'Web of Science'),
  CONCAT('10.6666/', 100000 + MOD(a.id * 23, 900000)),
  NULL,
  NULL,
  NULL,
  ELT(1 + MOD(a.id, 4), 'Q1', 'Q2', 'Q3', 'Q4'),
  CASE
    WHEN t.teacher_type = 'VACATAIRE' THEN CAST(0.00 AS DECIMAL(8,2))
    ELSE CAST(20 + MOD(a.id, 20) AS DECIMAL(8,2))
  END
FROM activities a
JOIN tmp_all_teachers t
  ON t.user_id = a.user_id
LEFT JOIN research_activities ra
  ON ra.activity_id = a.id
WHERE a.activity_type = 'RECHERCHE'
  AND a.academic_year = @seed_year
  AND a.updated_at = @stamp_research
  AND ra.activity_id IS NULL;

/*
  4) EVENEMENT minimum
*/
DROP TEMPORARY TABLE IF EXISTS tmp_missing_event;
CREATE TEMPORARY TABLE tmp_missing_event AS
SELECT
  t.user_id,
  GREATEST(0, @target_event - COALESCE(c.cnt, 0)) AS missing_count
FROM tmp_all_teachers t
LEFT JOIN (
  SELECT a.user_id, COUNT(*) AS cnt
  FROM activities a
  WHERE a.activity_type = 'EVENEMENT'
    AND a.academic_year = @seed_year
  GROUP BY a.user_id
) c
  ON c.user_id = t.user_id;

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
  @seed_year,
  DATE_SUB(@now_seed, INTERVAL (12 + MOD(m.user_id * 13 + s.n * 9, 160)) DAY),
  @stamp_event
FROM tmp_missing_event m
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
  CONCAT('AUTO_EVENEMENT_', REPLACE(@seed_year, '-', '_'), '_', a.id),
  DATE_SUB(CURDATE(), INTERVAL MOD(a.id * 5, 240) DAY),
  ELT(1 + MOD(a.id, 4), 'Organisateur', 'Co-organisateur', 'Membre', 'Participant')
FROM activities a
LEFT JOIN event_activities ea
  ON ea.activity_id = a.id
WHERE a.activity_type = 'EVENEMENT'
  AND a.academic_year = @seed_year
  AND a.updated_at = @stamp_event
  AND ea.activity_id IS NULL;

/*
  5) SURVEILLANCE minimum
*/
DROP TEMPORARY TABLE IF EXISTS tmp_missing_surveillance;
CREATE TEMPORARY TABLE tmp_missing_surveillance AS
SELECT
  t.user_id,
  GREATEST(0, @target_surveillance - COALESCE(c.cnt, 0)) AS missing_count
FROM tmp_all_teachers t
LEFT JOIN (
  SELECT a.user_id, COUNT(*) AS cnt
  FROM activities a
  WHERE a.activity_type = 'SURVEILLANCE'
    AND a.academic_year = @seed_year
  GROUP BY a.user_id
) c
  ON c.user_id = t.user_id;

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
  @seed_year,
  DATE_SUB(@now_seed, INTERVAL (8 + MOD(m.user_id * 3 + s.n * 11, 150)) DAY),
  @stamp_surveillance
FROM tmp_missing_surveillance m
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
  CONCAT('AUTO_SURVEILLANCE_', REPLACE(@seed_year, '-', '_'), '_', a.id),
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
  AND a.academic_year = @seed_year
  AND a.updated_at = @stamp_surveillance
  AND esa.activity_id IS NULL;

/*
  6) RESPONSABILITE minimum
*/
DROP TEMPORARY TABLE IF EXISTS tmp_missing_responsibility;
CREATE TEMPORARY TABLE tmp_missing_responsibility AS
SELECT
  t.user_id,
  GREATEST(0, @target_responsibility - COALESCE(c.cnt, 0)) AS missing_count
FROM tmp_all_teachers t
LEFT JOIN (
  SELECT a.user_id, COUNT(*) AS cnt
  FROM activities a
  WHERE a.activity_type = 'RESPONSABILITE'
    AND a.academic_year = @seed_year
  GROUP BY a.user_id
) c
  ON c.user_id = t.user_id;

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
  @seed_year,
  DATE_SUB(@now_seed, INTERVAL (6 + MOD(m.user_id * 17 + s.n * 13, 130)) DAY),
  @stamp_responsibility
FROM tmp_missing_responsibility m
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
  DATE_SUB(CURDATE(), INTERVAL (60 + MOD(a.id, 180)) DAY),
  CASE
    WHEN MOD(a.id, 3) = 0 THEN NULL
    ELSE DATE_ADD(CURDATE(), INTERVAL (30 + MOD(a.id, 180)) DAY)
  END
FROM activities a
LEFT JOIN responsibility_activities ra
  ON ra.activity_id = a.id
WHERE a.activity_type = 'RESPONSABILITE'
  AND a.academic_year = @seed_year
  AND a.updated_at = @stamp_responsibility
  AND ra.activity_id IS NULL;

/*
  Final diagnostics after seed.
*/
SELECT COUNT(*) AS active_teachers
FROM users
WHERE role = 'ENSEIGNANT'
  AND is_active = 1;

SELECT
  'ENSEIGNEMENT' AS activity_type,
  SUM(CASE WHEN cnt = 0 THEN 1 ELSE 0 END) AS teachers_with_zero,
  MIN(cnt) AS min_cnt,
  ROUND(AVG(cnt), 2) AS avg_cnt,
  MAX(cnt) AS max_cnt
FROM (
  SELECT u.id, COUNT(a.id) AS cnt
  FROM users u
  LEFT JOIN activities a
    ON a.user_id = u.id
   AND a.activity_type = 'ENSEIGNEMENT'
   AND a.academic_year = @seed_year
  WHERE u.role = 'ENSEIGNANT'
    AND u.is_active = 1
  GROUP BY u.id
) x
UNION ALL
SELECT
  'ENCADREMENT',
  SUM(CASE WHEN cnt = 0 THEN 1 ELSE 0 END),
  MIN(cnt),
  ROUND(AVG(cnt), 2),
  MAX(cnt)
FROM (
  SELECT u.id, COUNT(a.id) AS cnt
  FROM users u
  LEFT JOIN activities a
    ON a.user_id = u.id
   AND a.activity_type = 'ENCADREMENT'
   AND a.academic_year = @seed_year
  WHERE u.role = 'ENSEIGNANT'
    AND u.is_active = 1
  GROUP BY u.id
) x
UNION ALL
SELECT
  'RECHERCHE',
  SUM(CASE WHEN cnt = 0 THEN 1 ELSE 0 END),
  MIN(cnt),
  ROUND(AVG(cnt), 2),
  MAX(cnt)
FROM (
  SELECT u.id, COUNT(a.id) AS cnt
  FROM users u
  LEFT JOIN activities a
    ON a.user_id = u.id
   AND a.activity_type = 'RECHERCHE'
   AND a.academic_year = @seed_year
  WHERE u.role = 'ENSEIGNANT'
    AND u.is_active = 1
  GROUP BY u.id
) x
UNION ALL
SELECT
  'EVENEMENT',
  SUM(CASE WHEN cnt = 0 THEN 1 ELSE 0 END),
  MIN(cnt),
  ROUND(AVG(cnt), 2),
  MAX(cnt)
FROM (
  SELECT u.id, COUNT(a.id) AS cnt
  FROM users u
  LEFT JOIN activities a
    ON a.user_id = u.id
   AND a.activity_type = 'EVENEMENT'
   AND a.academic_year = @seed_year
  WHERE u.role = 'ENSEIGNANT'
    AND u.is_active = 1
  GROUP BY u.id
) x
UNION ALL
SELECT
  'SURVEILLANCE',
  SUM(CASE WHEN cnt = 0 THEN 1 ELSE 0 END),
  MIN(cnt),
  ROUND(AVG(cnt), 2),
  MAX(cnt)
FROM (
  SELECT u.id, COUNT(a.id) AS cnt
  FROM users u
  LEFT JOIN activities a
    ON a.user_id = u.id
   AND a.activity_type = 'SURVEILLANCE'
   AND a.academic_year = @seed_year
  WHERE u.role = 'ENSEIGNANT'
    AND u.is_active = 1
  GROUP BY u.id
) x
UNION ALL
SELECT
  'RESPONSABILITE',
  SUM(CASE WHEN cnt = 0 THEN 1 ELSE 0 END),
  MIN(cnt),
  ROUND(AVG(cnt), 2),
  MAX(cnt)
FROM (
  SELECT u.id, COUNT(a.id) AS cnt
  FROM users u
  LEFT JOIN activities a
    ON a.user_id = u.id
   AND a.activity_type = 'RESPONSABILITE'
   AND a.academic_year = @seed_year
  WHERE u.role = 'ENSEIGNANT'
    AND u.is_active = 1
  GROUP BY u.id
) x;

SELECT
  SUM(CASE WHEN partnership_count = 0 THEN 1 ELSE 0 END) AS teachers_with_zero_partnership,
  MIN(partnership_count) AS min_partnership,
  ROUND(AVG(partnership_count), 2) AS avg_partnership,
  MAX(partnership_count) AS max_partnership
FROM (
  SELECT
    u.id,
    COUNT(ta.activity_id) AS partnership_count
  FROM users u
  LEFT JOIN activities a
    ON a.user_id = u.id
   AND a.activity_type = 'ENSEIGNEMENT'
   AND a.academic_year = @seed_year
  LEFT JOIN teaching_activities ta
    ON ta.activity_id = a.id
   AND ta.partnership_declaration_type IS NOT NULL
  WHERE u.role = 'ENSEIGNANT'
    AND u.is_active = 1
  GROUP BY u.id
) p;

SELECT
  u.email,
  SUM(a.activity_type = 'ENSEIGNEMENT' AND a.academic_year = @seed_year) AS teaching_count,
  SUM(a.activity_type = 'ENCADREMENT' AND a.academic_year = @seed_year) AS supervision_count,
  SUM(a.activity_type = 'RECHERCHE' AND a.academic_year = @seed_year) AS research_count,
  SUM(a.activity_type = 'EVENEMENT' AND a.academic_year = @seed_year) AS event_count,
  SUM(a.activity_type = 'SURVEILLANCE' AND a.academic_year = @seed_year) AS surveillance_count,
  SUM(a.activity_type = 'RESPONSABILITE' AND a.academic_year = @seed_year) AS responsibility_count
FROM users u
LEFT JOIN activities a
  ON a.user_id = u.id
WHERE u.email = 'enseignant@esprit.tn'
GROUP BY u.id, u.email;
