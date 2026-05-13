USE pfe_academic_platform;

/*
  Completes real teacher accounts (non demo) with missing activity types
  for 2025-2026 so comparative dashboards are not empty.

  Safe behavior:
  - targets only active ENSEIGNANT accounts excluding teacher.permanent/vacataire/demo patterns
  - inserts one activity per missing type only (no overwrite/delete)
  - re-runnable
*/

SET @seed_year := '2025-2026';

DROP TEMPORARY TABLE IF EXISTS tmp_target_teachers;
CREATE TEMPORARY TABLE tmp_target_teachers AS
SELECT
  u.id AS user_id,
  u.department_id,
  u.email
FROM users u
WHERE u.role = 'ENSEIGNANT'
  AND u.is_active = 1
  AND u.email NOT LIKE 'teacher.demo.%@esprit.tn'
  AND u.email NOT LIKE 'teacher.permanent.%@esprit.tn'
  AND u.email NOT LIKE 'teacher.vacataire.%@esprit.tn';

/*
  ENSEIGNEMENT
*/
INSERT INTO activities (
  user_id,
  activity_type,
  status,
  academic_year,
  created_at,
  updated_at
)
SELECT
  t.user_id,
  'ENSEIGNEMENT',
  'VALIDEE_FINALE',
  @seed_year,
  DATE_SUB(NOW(), INTERVAL (20 + MOD(t.user_id * 3, 120)) DAY),
  DATE_SUB(NOW(), INTERVAL MOD(t.user_id * 5, 60) DAY)
FROM tmp_target_teachers t
WHERE NOT EXISTS (
  SELECT 1
  FROM activities a
  WHERE a.user_id = t.user_id
    AND a.activity_type = 'ENSEIGNEMENT'
    AND a.academic_year = @seed_year
);

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
  CONCAT('G', 1 + MOD(a.id, 4), '-A'),
  ELT(1 + MOD(a.id, 6), 'Algorithmique', 'Bases de Donnees', 'IA', 'Cloud', 'Reseaux', 'Statistiques'),
  ELT(1 + MOD(a.id, 3), 'S1', 'S2', 'ANNUEL'),
  ELT(1 + MOD(a.id, 3), 'PRESENTIEL', 'EN_LIGNE', 'ALTERNANCE'),
  ELT(1 + MOD(a.id, 3), 'Francais', 'Anglais', 'Bilingue'),
  CAST(24 + MOD(a.id, 10) AS DECIMAL(6,2)),
  CAST(22 + MOD(a.id, 9) AS DECIMAL(6,2)),
  CAST(MOD(a.id, 3) AS DECIMAL(6,2)),
  MOD(a.id, 3) * 10,
  1,
  1 + MOD(a.id, 2),
  1,
  1,
  CAST(MOD(a.id, 3) AS DECIMAL(6,2)),
  CASE WHEN MOD(a.id, 4) = 0 THEN 1 ELSE 0 END,
  CASE WHEN MOD(a.id, 2) = 0 THEN 'ACADEMIQUE' ELSE NULL END,
  NULL
FROM activities a
JOIN tmp_target_teachers t
  ON t.user_id = a.user_id
WHERE a.activity_type = 'ENSEIGNEMENT'
  AND a.academic_year = @seed_year
  AND NOT EXISTS (
    SELECT 1
    FROM teaching_activities ta
    WHERE ta.activity_id = a.id
  );

/*
  ENCADREMENT
*/
INSERT INTO activities (
  user_id,
  activity_type,
  status,
  academic_year,
  created_at,
  updated_at
)
SELECT
  t.user_id,
  'ENCADREMENT',
  'VALIDEE_FINALE',
  @seed_year,
  DATE_SUB(NOW(), INTERVAL (18 + MOD(t.user_id * 4, 100)) DAY),
  DATE_SUB(NOW(), INTERVAL MOD(t.user_id * 7, 50) DAY)
FROM tmp_target_teachers t
WHERE NOT EXISTS (
  SELECT 1
  FROM activities a
  WHERE a.user_id = t.user_id
    AND a.activity_type = 'ENCADREMENT'
    AND a.academic_year = @seed_year
);

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
    WHEN MOD(a.id, 3) = 0 THEN 'PFE_RAPPORTEUR'
    WHEN MOD(a.id, 3) = 1 THEN 'PFE_ENCADREMENT_ACADEMIQUE'
    ELSE 'PI'
  END,
  CONCAT('Etudiant ', 100 + MOD(a.id, 900)),
  ELT(1 + MOD(a.id, 4), 'L3', 'M1', 'M2', 'Ingenieur'),
  CONCAT('Sujet ', 500 + MOD(a.id, 500)),
  CASE WHEN MOD(a.id, 2) = 0 THEN 'SOUTENU' ELSE 'EN_COURS' END,
  CASE
    WHEN MOD(a.id, 3) = 0 THEN 'RAPPORTEUR'
    WHEN MOD(a.id, 3) = 1 THEN 'ENCADRANT'
    ELSE 'MEMBRE_JURY'
  END,
  CAST(1 + MOD(a.id, 2) AS DECIMAL(8,2)),
  CAST(10 + MOD(a.id, 16) AS DECIMAL(8,2))
FROM activities a
JOIN tmp_target_teachers t
  ON t.user_id = a.user_id
WHERE a.activity_type = 'ENCADREMENT'
  AND a.academic_year = @seed_year
  AND NOT EXISTS (
    SELECT 1
    FROM supervision_activities sa
    WHERE sa.activity_id = a.id
  );

/*
  RECHERCHE
*/
INSERT INTO activities (
  user_id,
  activity_type,
  status,
  academic_year,
  created_at,
  updated_at
)
SELECT
  t.user_id,
  'RECHERCHE',
  'VALIDEE_FINALE',
  @seed_year,
  DATE_SUB(NOW(), INTERVAL (16 + MOD(t.user_id * 5, 90)) DAY),
  DATE_SUB(NOW(), INTERVAL MOD(t.user_id * 9, 45) DAY)
FROM tmp_target_teachers t
WHERE NOT EXISTS (
  SELECT 1
  FROM activities a
  WHERE a.user_id = t.user_id
    AND a.activity_type = 'RECHERCHE'
    AND a.academic_year = @seed_year
);

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
  'PUBLICATION_ARTICLE',
  CONCAT('Article scientifique ', 1000 + MOD(a.id, 8000)),
  ELT(1 + MOD(a.id, 4), 'IEEE Access', 'Springer', 'ACM DL', 'Scopus Track'),
  YEAR(CURDATE()),
  ELT(1 + MOD(a.id, 2), 'Scopus', 'Web of Science'),
  CONCAT('10.5555/', 100000 + MOD(a.id * 37, 900000)),
  NULL,
  NULL,
  NULL,
  ELT(1 + MOD(a.id, 5), 'Q1', 'Q2', 'Q3', 'Q4', 'CONFERENCE'),
  CAST(18 + MOD(a.id, 24) AS DECIMAL(8,2))
FROM activities a
JOIN tmp_target_teachers t
  ON t.user_id = a.user_id
WHERE a.activity_type = 'RECHERCHE'
  AND a.academic_year = @seed_year
  AND NOT EXISTS (
    SELECT 1
    FROM research_activities ra
    WHERE ra.activity_id = a.id
  );

/*
  EVENEMENT
*/
INSERT INTO activities (
  user_id,
  activity_type,
  status,
  academic_year,
  created_at,
  updated_at
)
SELECT
  t.user_id,
  'EVENEMENT',
  'VALIDEE_FINALE',
  @seed_year,
  DATE_SUB(NOW(), INTERVAL (14 + MOD(t.user_id * 6, 80)) DAY),
  DATE_SUB(NOW(), INTERVAL MOD(t.user_id * 11, 40) DAY)
FROM tmp_target_teachers t
WHERE NOT EXISTS (
  SELECT 1
  FROM activities a
  WHERE a.user_id = t.user_id
    AND a.activity_type = 'EVENEMENT'
    AND a.academic_year = @seed_year
);

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
  CONCAT('Evenement ', 200 + MOD(a.id, 700)),
  DATE_SUB(CURDATE(), INTERVAL MOD(a.id * 3, 180) DAY),
  ELT(1 + MOD(a.id, 4), 'Organisateur', 'Co-organisateur', 'Membre', 'Participant')
FROM activities a
JOIN tmp_target_teachers t
  ON t.user_id = a.user_id
WHERE a.activity_type = 'EVENEMENT'
  AND a.academic_year = @seed_year
  AND NOT EXISTS (
    SELECT 1
    FROM event_activities ea
    WHERE ea.activity_id = a.id
  );

/*
  SURVEILLANCE
*/
INSERT INTO activities (
  user_id,
  activity_type,
  status,
  academic_year,
  created_at,
  updated_at
)
SELECT
  t.user_id,
  'SURVEILLANCE',
  'VALIDEE_FINALE',
  @seed_year,
  DATE_SUB(NOW(), INTERVAL (12 + MOD(t.user_id * 8, 70)) DAY),
  DATE_SUB(NOW(), INTERVAL MOD(t.user_id * 13, 35) DAY)
FROM tmp_target_teachers t
WHERE NOT EXISTS (
  SELECT 1
  FROM activities a
  WHERE a.user_id = t.user_id
    AND a.activity_type = 'SURVEILLANCE'
    AND a.academic_year = @seed_year
);

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
  CONCAT('Session ', ELT(1 + MOD(a.id, 3), 'Principale', 'Rattrapage', 'Controle')),
  ELT(1 + MOD(a.id, 3), 'S1', 'S2', 'ANNUEL'),
  CAST(1 + MOD(a.id, 2) AS DECIMAL(6,2)),
  ELT(1 + MOD(a.id, 6), 'LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI'),
  CAST(1 + MOD(a.id, 2) AS DECIMAL(4,2))
FROM activities a
JOIN tmp_target_teachers t
  ON t.user_id = a.user_id
WHERE a.activity_type = 'SURVEILLANCE'
  AND a.academic_year = @seed_year
  AND NOT EXISTS (
    SELECT 1
    FROM exam_surveillance_activities esa
    WHERE esa.activity_id = a.id
  );

/*
  RESPONSABILITE
*/
INSERT INTO activities (
  user_id,
  activity_type,
  status,
  academic_year,
  created_at,
  updated_at
)
SELECT
  t.user_id,
  'RESPONSABILITE',
  'VALIDEE_FINALE',
  @seed_year,
  DATE_SUB(NOW(), INTERVAL (10 + MOD(t.user_id * 9, 60)) DAY),
  DATE_SUB(NOW(), INTERVAL MOD(t.user_id * 15, 30) DAY)
FROM tmp_target_teachers t
WHERE NOT EXISTS (
  SELECT 1
  FROM activities a
  WHERE a.user_id = t.user_id
    AND a.activity_type = 'RESPONSABILITE'
    AND a.academic_year = @seed_year
);

INSERT INTO responsibility_activities (
  activity_id,
  responsibility_type,
  start_date,
  end_date
)
SELECT
  a.id,
  ELT(1 + MOD(a.id, 3), 'RESPONSABLE_FILIERE', 'COORDINATEUR_MODULE', 'AUTRE'),
  DATE_SUB(CURDATE(), INTERVAL (90 + MOD(a.id, 120)) DAY),
  CASE WHEN MOD(a.id, 3) = 0 THEN NULL ELSE DATE_ADD(CURDATE(), INTERVAL (90 + MOD(a.id, 120)) DAY) END
FROM activities a
JOIN tmp_target_teachers t
  ON t.user_id = a.user_id
WHERE a.activity_type = 'RESPONSABILITE'
  AND a.academic_year = @seed_year
  AND NOT EXISTS (
    SELECT 1
    FROM responsibility_activities ra
    WHERE ra.activity_id = a.id
  );

/*
  Final summary for targeted non-demo teachers.
*/
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
WHERE u.id IN (SELECT user_id FROM tmp_target_teachers)
GROUP BY u.id, u.email
ORDER BY u.email;
