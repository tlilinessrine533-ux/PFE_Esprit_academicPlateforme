USE pfe_academic_platform;

/*
  Seed demo dataset for realistic dashboards:
  - 70 teacher accounts:
      50 permanents  -> teacher.permanent.001@esprit.tn ... teacher.permanent.050@esprit.tn
      20 vacataires  -> teacher.vacataire.001@esprit.tn ... teacher.vacataire.020@esprit.tn
  - teaching / supervision / research / event / surveillance / responsibility activities
  - workflow validation history
  - vacataires generated with no points system (teaching point drivers = 0, research/supervision points = 0)

  Safe behavior:
  - Keeps existing non-demo users untouched.
  - Re-runnable: demo users + demo activities are regenerated from scratch each time.
*/

SET @target_teacher_count := 70;

INSERT INTO departments (name, code)
SELECT 'Departement General', 'GEN'
WHERE NOT EXISTS (SELECT 1 FROM departments);

SET @default_password_hash := COALESCE(
  (SELECT password_hash FROM users WHERE email = 'enseignant@esprit.tn' LIMIT 1),
  (SELECT password_hash FROM users WHERE role = 'ENSEIGNANT' LIMIT 1),
  (SELECT password_hash FROM users WHERE role = 'CHEF_DEPARTEMENT' LIMIT 1),
  (SELECT password_hash FROM users WHERE role = 'ADMINISTRATION' LIMIT 1),
  (SELECT password_hash FROM users WHERE role = 'SUPER_ADMIN' LIMIT 1)
);

DROP TEMPORARY TABLE IF EXISTS tmp_seed_seq;
CREATE TEMPORARY TABLE tmp_seed_seq (n INT PRIMARY KEY);

INSERT INTO tmp_seed_seq (n)
WITH RECURSIVE seq AS (
  SELECT 1 AS n
  UNION ALL
  SELECT n + 1
  FROM seq
  WHERE n < 70
)
SELECT n
FROM seq;

DROP TEMPORARY TABLE IF EXISTS tmp_teacher_seed;
CREATE TEMPORARY TABLE tmp_teacher_seed AS
SELECT
  s.n AS idx,
  CASE
    WHEN s.n <= 50 THEN CONCAT('teacher.permanent.', LPAD(s.n, 3, '0'), '@esprit.tn')
    ELSE CONCAT('teacher.vacataire.', LPAD(s.n - 50, 3, '0'), '@esprit.tn')
  END AS email,
  CASE
    WHEN s.n <= 50 THEN 'PERMANENT'
    ELSE 'VACATAIRE'
  END AS teacher_category,
  ELT(
    1 + MOD(s.n - 1, 20),
    'Amine', 'Ines', 'Youssef', 'Mariem', 'Hatem',
    'Sarra', 'Wassim', 'Lina', 'Omar', 'Nour',
    'Alaa', 'Nesrine', 'Karim', 'Rania', 'Walid',
    'Maya', 'Hichem', 'Aya', 'Tarek', 'Leila'
  ) AS first_name,
  ELT(
    1 + MOD(s.n - 1, 20),
    'Ben Salah', 'Trabelsi', 'Gharbi', 'Kallel', 'Baccar',
    'Jlassi', 'Brahim', 'Mrad', 'Chouchene', 'Aouadi',
    'Hamdi', 'Tlili', 'Bouzid', 'Masmoudi', 'Ayadi',
    'Mekki', 'Kchouk', 'Saidi', 'Chebbi', 'Belaid'
  ) AS last_name
FROM tmp_seed_seq s;

DROP TEMPORARY TABLE IF EXISTS tmp_department_pool;
SET @department_rownum := 0;
CREATE TEMPORARY TABLE tmp_department_pool AS
SELECT
  d.id AS department_id,
  (@department_rownum := @department_rownum + 1) AS rn
FROM departments d
ORDER BY d.id;

SET @department_count := (SELECT COUNT(*) FROM tmp_department_pool);

DROP TEMPORARY TABLE IF EXISTS tmp_teachers;
CREATE TEMPORARY TABLE tmp_teachers AS
SELECT
  s.idx,
  s.email,
  s.teacher_category,
  s.first_name,
  s.last_name,
  p.department_id
FROM tmp_teacher_seed s
JOIN tmp_department_pool p
  ON p.rn = 1 + MOD(s.idx - 1, @department_count);

/*
  Full cleanup of previous generated demo users (old pattern + new patterns),
  before regenerating a fresh dataset.
*/
DELETE a
FROM activities a
JOIN users u
  ON u.id = a.user_id
WHERE u.email LIKE 'teacher.demo.%@esprit.tn'
   OR u.email LIKE 'teacher.permanent.%@esprit.tn'
   OR u.email LIKE 'teacher.vacataire.%@esprit.tn';

DELETE s
FROM auth_security_states s
JOIN users u
  ON u.id = s.user_id
WHERE u.email LIKE 'teacher.demo.%@esprit.tn'
   OR u.email LIKE 'teacher.permanent.%@esprit.tn'
   OR u.email LIKE 'teacher.vacataire.%@esprit.tn';

DELETE u
FROM users u
WHERE u.email LIKE 'teacher.demo.%@esprit.tn'
   OR u.email LIKE 'teacher.permanent.%@esprit.tn'
   OR u.email LIKE 'teacher.vacataire.%@esprit.tn';

INSERT INTO users (
  first_name,
  last_name,
  email,
  password_hash,
  role,
  teacher_type,
  department_id,
  is_active,
  created_at,
  updated_at
)
SELECT
  t.first_name,
  t.last_name,
  t.email,
  @default_password_hash,
  'ENSEIGNANT',
  CASE WHEN t.teacher_category = 'VACATAIRE' THEN 'VACATAIRE' ELSE 'PERMANENT' END,
  t.department_id,
  1,
  NOW(),
  NOW()
FROM tmp_teachers t
ON DUPLICATE KEY UPDATE
  first_name = VALUES(first_name),
  last_name = VALUES(last_name),
  password_hash = VALUES(password_hash),
  role = 'ENSEIGNANT',
  teacher_type = VALUES(teacher_type),
  department_id = VALUES(department_id),
  is_active = 1,
  updated_at = NOW();

INSERT INTO auth_security_states (
  user_id,
  failed_login_attempts,
  two_factor_enabled,
  created_at,
  updated_at
)
SELECT
  u.id,
  0,
  0,
  NOW(),
  NOW()
FROM users u
JOIN tmp_teachers t
  ON BINARY t.email = BINARY u.email
LEFT JOIN auth_security_states s
  ON s.user_id = u.id
WHERE s.user_id IS NULL;

/*
  Re-runnable cleanup: remove previous demo activities only.
  Child tables (teaching/research/supervision/...) and validation history
  are removed by FK cascade from activities.
*/
DELETE a
FROM activities a
JOIN users u
  ON u.id = a.user_id
JOIN tmp_teachers t
  ON BINARY t.email = BINARY u.email;

DROP TEMPORARY TABLE IF EXISTS tmp_generated_users;
CREATE TEMPORARY TABLE tmp_generated_users AS
SELECT
  u.id AS user_id,
  u.department_id,
  t.idx,
  t.teacher_category,
  t.email
FROM users u
JOIN tmp_teachers t
  ON BINARY t.email = BINARY u.email;

/*
  Teaching: 4 records per teacher (280 rows).
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
  g.user_id,
  'ENSEIGNEMENT',
  CASE
    WHEN MOD(g.idx * 13 + s.n * 7, 100) < 8 THEN 'REJETEE'
    WHEN MOD(g.idx * 13 + s.n * 7, 100) < 18 THEN 'A_CORRIGER'
    WHEN MOD(g.idx * 13 + s.n * 7, 100) < 40 THEN 'SOUMISE'
    WHEN MOD(g.idx * 13 + s.n * 7, 100) < 70 THEN 'VALIDEE_DEPARTEMENT'
    ELSE 'VALIDEE_FINALE'
  END,
  CASE
    WHEN MOD(g.idx + s.n, 5) = 0 THEN '2024-2025'
    ELSE '2025-2026'
  END,
  DATE_SUB(NOW(), INTERVAL (30 + MOD(g.idx * 11 + s.n * 17, 420)) DAY),
  DATE_SUB(NOW(), INTERVAL MOD(g.idx * 7 + s.n * 13, 240) DAY)
FROM tmp_generated_users g
JOIN tmp_seed_seq s
  ON s.n <= 4;

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
  ELT(1 + MOD(a.id, 5), 'Cycle Ingenieur', 'Licence Data', 'Master IA', 'Master BI', 'Classes Preparatoires') AS program_name,
  CONCAT('G', 1 + MOD(a.id, 5), '-', CHAR(65 + MOD(a.id, 4))) AS class_name,
  ELT(
    1 + MOD(a.id, 10),
    'Algorithmique Avancee',
    'Bases de Donnees',
    'Genie Logiciel',
    'Intelligence Artificielle',
    'Cloud Computing',
    'Reseaux',
    'Statistiques',
    'Data Mining',
    'Programmation Web',
    'Systemes Distribues'
  ) AS module_name,
  ELT(1 + MOD(a.id, 3), 'S1', 'S2', 'ANNUEL') AS semester,
  ELT(1 + MOD(a.id, 4), 'PRESENTIEL', 'EN_LIGNE', 'ALTERNANCE', 'EXECUTIF') AS teaching_mode,
  ELT(1 + MOD(a.id, 3), 'Francais', 'Anglais', 'Bilingue') AS language,
  CASE
    WHEN g.teacher_category = 'VACATAIRE' THEN CAST(0.00 AS DECIMAL(6,2))
    ELSE CAST(20 + MOD(a.id * 7, 45) + (MOD(a.id, 4) * 0.50) AS DECIMAL(6,2))
  END AS planned_hours,
  CASE
    WHEN g.teacher_category = 'VACATAIRE' THEN CAST(0.00 AS DECIMAL(6,2))
    ELSE CAST(18 + MOD(a.id * 5, 44) + (MOD(a.id, 3) * 0.50) AS DECIMAL(6,2))
  END AS completed_hours,
  CASE
    WHEN g.teacher_category = 'VACATAIRE' THEN CAST(0.00 AS DECIMAL(6,2))
    ELSE CAST(MOD(a.id, 5) * 1.50 AS DECIMAL(6,2))
  END AS new_course_hours,
  CASE
    WHEN g.teacher_category = 'VACATAIRE' THEN 0
    ELSE MOD(a.id, 5) * 10
  END AS course_restructuring_percentage,
  CASE
    WHEN g.teacher_category = 'VACATAIRE' THEN 0
    ELSE CASE WHEN MOD(a.id, 2) = 0 THEN 1 ELSE 0 END
  END AS course_restructuring_approved,
  CASE
    WHEN g.teacher_category = 'VACATAIRE' THEN 0
    ELSE 1 + MOD(a.id, 4)
  END AS syllabus_count,
  CASE
    WHEN g.teacher_category = 'VACATAIRE' THEN 0
    ELSE CASE WHEN MOD(a.id, 3) <> 0 THEN 1 ELSE 0 END
  END AS car_file_elaborated,
  CASE
    WHEN g.teacher_category = 'VACATAIRE' THEN 0
    ELSE CASE WHEN MOD(a.id, 4) <> 0 THEN 1 ELSE 0 END
  END AS exam_elaborated,
  CASE
    WHEN g.teacher_category = 'VACATAIRE' THEN CAST(0.00 AS DECIMAL(6,2))
    ELSE CAST(MOD(a.id, 6) * 1.25 AS DECIMAL(6,2))
  END AS evening_or_saturday_hours,
  CASE
    WHEN g.teacher_category = 'VACATAIRE' THEN 0
    ELSE CASE WHEN MOD(a.id, 7) = 0 THEN 1 ELSE 0 END
  END AS coordination,
  CASE
    WHEN g.teacher_category = 'VACATAIRE' THEN NULL
    WHEN MOD(a.id, 3) = 0 THEN 'ACADEMIQUE'
    WHEN MOD(a.id, 3) = 1 THEN 'PROFESSIONNELLE'
    ELSE NULL
  END AS partnership_declaration_type,
  NULL AS syllabus_path
FROM activities a
JOIN tmp_generated_users g
  ON g.user_id = a.user_id
WHERE a.activity_type = 'ENSEIGNEMENT'
  AND NOT EXISTS (
    SELECT 1
    FROM teaching_activities ta
    WHERE ta.activity_id = a.id
  );

/*
  Supervision: 3 records per teacher (210 rows).
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
  g.user_id,
  'ENCADREMENT',
  CASE
    WHEN MOD(g.idx * 9 + s.n * 11, 100) < 10 THEN 'REJETEE'
    WHEN MOD(g.idx * 9 + s.n * 11, 100) < 20 THEN 'A_CORRIGER'
    WHEN MOD(g.idx * 9 + s.n * 11, 100) < 45 THEN 'SOUMISE'
    WHEN MOD(g.idx * 9 + s.n * 11, 100) < 72 THEN 'VALIDEE_DEPARTEMENT'
    ELSE 'VALIDEE_FINALE'
  END,
  CASE
    WHEN MOD(g.idx + s.n * 2, 6) = 0 THEN '2024-2025'
    ELSE '2025-2026'
  END,
  DATE_SUB(NOW(), INTERVAL (20 + MOD(g.idx * 5 + s.n * 23, 390)) DAY),
  DATE_SUB(NOW(), INTERVAL MOD(g.idx * 3 + s.n * 19, 220) DAY)
FROM tmp_generated_users g
JOIN tmp_seed_seq s
  ON s.n <= 3;

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
  CASE MOD(a.id, 11)
    WHEN 0 THEN 'PFE_ENCADREMENT_ACADEMIQUE'
    WHEN 1 THEN 'PFE_RAPPORTEUR'
    WHEN 2 THEN 'PFE_PRESIDENT_JURY'
    WHEN 3 THEN 'SEMINAIRE'
    WHEN 4 THEN 'PI'
    WHEN 5 THEN 'APP0'
    WHEN 6 THEN 'COURS_SOUTIEN'
    WHEN 7 THEN 'MEMOIRE'
    WHEN 8 THEN 'STAGE'
    WHEN 9 THEN 'PFE'
    ELSE 'THESE'
  END AS supervision_type,
  CONCAT(
    ELT(1 + MOD(a.id, 10), 'Ala', 'Meriem', 'Sami', 'Nadine', 'Riadh', 'Yasmine', 'Hamza', 'Rim', 'Anis', 'Farah'),
    ' ',
    ELT(1 + MOD(a.id + 3, 10), 'Cherif', 'Mansouri', 'Kefi', 'Miled', 'Bouslama', 'Jaziri', 'Haddad', 'Karray', 'Ben Amor', 'Sghaier')
  ) AS student_name,
  ELT(1 + MOD(a.id, 6), 'GL', 'Data Science', 'Finance', 'Marketing', 'BI', 'Telecom') AS student_program,
  CONCAT('Sujet ', 1000 + MOD(a.id * 17, 9000), ' - ', ELT(1 + MOD(a.id, 5), 'IA', 'Cloud', 'IoT', 'Cyber', 'DataViz')) AS subject_title,
  CASE WHEN MOD(a.id, 3) = 0 THEN 'SOUTENU' ELSE 'EN_COURS' END AS supervision_status,
  CASE MOD(a.id, 11)
    WHEN 1 THEN 'RAPPORTEUR'
    WHEN 2 THEN 'PRESIDENT_JURY'
    WHEN 3 THEN 'MEMBRE_JURY'
    WHEN 4 THEN 'MEMBRE_JURY'
    WHEN 5 THEN 'MEMBRE_JURY'
    WHEN 6 THEN 'MEMBRE_JURY'
    ELSE 'ENCADRANT'
  END AS role_in_jury,
  CAST(1 + MOD(a.id, 4) AS DECIMAL(8,2)) AS quantity_value,
  CASE
    WHEN g.teacher_category = 'VACATAIRE' THEN CAST(0.00 AS DECIMAL(8,2))
    ELSE CAST(
      CASE MOD(a.id, 11)
        WHEN 0 THEN 25
        WHEN 1 THEN 10
        WHEN 2 THEN 5
        WHEN 3 THEN 10 * (1 + MOD(a.id, 4))
        WHEN 4 THEN 10 * (1 + MOD(a.id, 4))
        WHEN 5 THEN 5
        WHEN 6 THEN 0.5 * (1 + MOD(a.id, 4))
        WHEN 7 THEN 10
        WHEN 8 THEN 10
        WHEN 9 THEN 25
        ELSE 25
      END
      AS DECIMAL(8,2)
    )
  END AS activity_points
FROM activities a
JOIN tmp_generated_users g
  ON g.user_id = a.user_id
WHERE a.activity_type = 'ENCADREMENT'
  AND NOT EXISTS (
    SELECT 1
    FROM supervision_activities sa
    WHERE sa.activity_id = a.id
  );

/*
  Research: 2 records per teacher (140 rows).
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
  g.user_id,
  'RECHERCHE',
  CASE
    WHEN MOD(g.idx * 7 + s.n * 19, 100) < 9 THEN 'REJETEE'
    WHEN MOD(g.idx * 7 + s.n * 19, 100) < 16 THEN 'A_CORRIGER'
    WHEN MOD(g.idx * 7 + s.n * 19, 100) < 38 THEN 'SOUMISE'
    WHEN MOD(g.idx * 7 + s.n * 19, 100) < 66 THEN 'VALIDEE_DEPARTEMENT'
    ELSE 'VALIDEE_FINALE'
  END,
  CASE
    WHEN MOD(g.idx + s.n * 3, 7) = 0 THEN '2024-2025'
    ELSE '2025-2026'
  END,
  DATE_SUB(NOW(), INTERVAL (15 + MOD(g.idx * 13 + s.n * 29, 360)) DAY),
  DATE_SUB(NOW(), INTERVAL MOD(g.idx * 11 + s.n * 7, 200) DAY)
FROM tmp_generated_users g
JOIN tmp_seed_seq s
  ON s.n <= 2;

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
  CASE MOD(a.id, 9)
    WHEN 0 THEN 'PUBLICATION_ARTICLE'
    WHEN 1 THEN 'ARTICLE'
    WHEN 2 THEN 'CONFERENCE'
    WHEN 3 THEN 'COMMUNICATION'
    WHEN 4 THEN 'PROJET_RECHERCHE'
    WHEN 5 THEN 'CHAPITRE_OUVRAGE'
    WHEN 6 THEN 'PROJET_DEVELOPPEMENT_UNITE_RECHERCHE'
    WHEN 7 THEN 'PROJET_RECHERCHE_ARTICLE_CONFERENCE'
    ELSE 'PRESENTATION_TRAVAIL'
  END AS publication_type,
  CONCAT('Contribution scientifique ', 10000 + MOD(a.id * 23, 90000)) AS title,
  ELT(
    1 + MOD(a.id, 8),
    'IEEE Access',
    'Springer LNCS',
    'ACM Digital Library',
    'Elsevier Procedia',
    'Journal IA Maghreb',
    'Scopus Conference Track',
    'Web of Science Forum',
    'Actes nationaux'
  ) AS venue_name,
  2024 + MOD(a.id, 3) AS publication_year,
  CASE
    WHEN MOD(a.id, 4) = 0 THEN 'Scopus'
    WHEN MOD(a.id, 4) = 1 THEN 'Web of Science'
    ELSE NULL
  END AS indexing_name,
  CASE
    WHEN MOD(a.id, 3) = 0 THEN CONCAT('10.5555/', 100000 + MOD(a.id * 97, 900000))
    ELSE NULL
  END AS doi,
  CASE
    WHEN MOD(a.id, 2) = 0 THEN CONCAT('Etudiant ', 500 + MOD(a.id, 400))
    ELSE NULL
  END AS student_name,
  CASE
    WHEN MOD(a.id, 2) = 0 THEN ELT(1 + MOD(a.id, 3), 'Licence', 'Master', 'Ingenieur')
    ELSE NULL
  END AS pfe_level,
  CASE
    WHEN MOD(a.id, 2) = 0 THEN ELT(1 + MOD(a.id, 4), 'Rapport', 'Prototype', 'Poster', 'Dataset')
    ELSE NULL
  END AS deliverable,
  ELT(1 + MOD(a.id, 5), 'Q1', 'Q2', 'Q3', 'Q4', 'CONFERENCE') AS publication_rank,
  CASE
    WHEN g.teacher_category = 'VACATAIRE' THEN CAST(0.00 AS DECIMAL(8,2))
    ELSE CAST(
      (CASE MOD(a.id, 5)
        WHEN 0 THEN 40
        WHEN 1 THEN 30
        WHEN 2 THEN 24
        WHEN 3 THEN 18
        ELSE 12
      END)
      + (CASE MOD(a.id, 9)
        WHEN 4 THEN 4
        WHEN 6 THEN 6
        WHEN 7 THEN 5
        ELSE 0
      END)
      AS DECIMAL(8,2)
    )
  END AS activity_points
FROM activities a
JOIN tmp_generated_users g
  ON g.user_id = a.user_id
WHERE a.activity_type = 'RECHERCHE'
  AND NOT EXISTS (
    SELECT 1
    FROM research_activities ra
    WHERE ra.activity_id = a.id
  );

/*
  Events: 2 records per teacher (140 rows).
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
  g.user_id,
  'EVENEMENT',
  CASE
    WHEN MOD(g.idx * 5 + s.n * 17, 100) < 8 THEN 'REJETEE'
    WHEN MOD(g.idx * 5 + s.n * 17, 100) < 18 THEN 'A_CORRIGER'
    WHEN MOD(g.idx * 5 + s.n * 17, 100) < 40 THEN 'SOUMISE'
    WHEN MOD(g.idx * 5 + s.n * 17, 100) < 70 THEN 'VALIDEE_DEPARTEMENT'
    ELSE 'VALIDEE_FINALE'
  END,
  CASE
    WHEN MOD(g.idx + s.n * 4, 7) = 0 THEN '2024-2025'
    ELSE '2025-2026'
  END,
  DATE_SUB(NOW(), INTERVAL (12 + MOD(g.idx * 19 + s.n * 13, 330)) DAY),
  DATE_SUB(NOW(), INTERVAL MOD(g.idx * 11 + s.n * 9, 190) DAY)
FROM tmp_generated_users g
JOIN tmp_seed_seq s
  ON s.n <= 2;

INSERT INTO event_activities (
  activity_id,
  event_type,
  title,
  event_date,
  organization_role
)
SELECT
  a.id,
  ELT(1 + MOD(a.id, 5), 'SEMINAIRE', 'COLLOQUE', 'WORKSHOP', 'JOURNEE_SCIENTIFIQUE', 'AUTRE') AS event_type,
  CONCAT(
    ELT(1 + MOD(a.id, 6), 'Forum', 'Journee', 'Atelier', 'Colloque', 'Seminaire', 'Rencontre'),
    ' ',
    ELT(1 + MOD(a.id + 2, 6), 'Pedagogique', 'Scientifique', 'IA', 'Cloud', 'Cyber', 'Data'),
    ' ',
    100 + MOD(a.id, 900)
  ) AS title,
  DATE_SUB(CURDATE(), INTERVAL MOD(a.id * 7, 540) DAY) AS event_date,
  ELT(1 + MOD(a.id, 5), 'Organisateur', 'Co-organisateur', 'Chair', 'Rapporteur', 'Participant') AS organization_role
FROM activities a
JOIN tmp_generated_users g
  ON g.user_id = a.user_id
WHERE a.activity_type = 'EVENEMENT'
  AND NOT EXISTS (
    SELECT 1
    FROM event_activities ea
    WHERE ea.activity_id = a.id
  );

/*
  Exam surveillance: 3 records per teacher (210 rows).
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
  g.user_id,
  'SURVEILLANCE',
  CASE
    WHEN MOD(g.idx * 8 + s.n * 9, 100) < 7 THEN 'REJETEE'
    WHEN MOD(g.idx * 8 + s.n * 9, 100) < 15 THEN 'A_CORRIGER'
    WHEN MOD(g.idx * 8 + s.n * 9, 100) < 37 THEN 'SOUMISE'
    WHEN MOD(g.idx * 8 + s.n * 9, 100) < 68 THEN 'VALIDEE_DEPARTEMENT'
    ELSE 'VALIDEE_FINALE'
  END,
  CASE
    WHEN MOD(g.idx + s.n * 5, 8) = 0 THEN '2024-2025'
    ELSE '2025-2026'
  END,
  DATE_SUB(NOW(), INTERVAL (8 + MOD(g.idx * 17 + s.n * 21, 300)) DAY),
  DATE_SUB(NOW(), INTERVAL MOD(g.idx * 9 + s.n * 15, 170) DAY)
FROM tmp_generated_users g
JOIN tmp_seed_seq s
  ON s.n <= 3;

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
  CONCAT(
    ELT(1 + MOD(a.id, 3), 'Controle', 'Examen final', 'Rattrapage'),
    ' ',
    ELT(1 + MOD(a.id + 1, 4), 'Maths', 'Algo', 'Data', 'Reseaux')
  ) AS session_name,
  CASE
    WHEN MOD(a.id, 5) = 0 THEN 'ANNUEL'
    WHEN MOD(a.id, 2) = 0 THEN 'S1'
    ELSE 'S2'
  END AS semester,
  CAST(1 + MOD(a.id, 3) AS DECIMAL(6,2)) AS hours_count,
  ELT(1 + MOD(a.id, 6), 'LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI') AS session_day,
  CASE
    WHEN g.teacher_category = 'VACATAIRE' THEN CAST(0.00 AS DECIMAL(4,2))
    ELSE CAST(1 + MOD(a.id, 3) AS DECIMAL(4,2))
  END AS session_points
FROM activities a
JOIN tmp_generated_users g
  ON g.user_id = a.user_id
WHERE a.activity_type = 'SURVEILLANCE'
  AND NOT EXISTS (
    SELECT 1
    FROM exam_surveillance_activities esa
    WHERE esa.activity_id = a.id
  );

/*
  Responsibility: 1 record for half of teachers (35 rows).
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
  g.user_id,
  'RESPONSABILITE',
  CASE
    WHEN MOD(g.idx, 6) = 0 THEN 'SOUMISE'
    WHEN MOD(g.idx, 6) = 1 THEN 'A_CORRIGER'
    WHEN MOD(g.idx, 6) = 2 THEN 'VALIDEE_DEPARTEMENT'
    ELSE 'VALIDEE_FINALE'
  END,
  '2025-2026',
  DATE_SUB(NOW(), INTERVAL (10 + MOD(g.idx * 7, 300)) DAY),
  DATE_SUB(NOW(), INTERVAL MOD(g.idx * 5, 160) DAY)
FROM tmp_generated_users g
WHERE MOD(g.idx, 2) = 0;

INSERT INTO responsibility_activities (
  activity_id,
  responsibility_type,
  start_date,
  end_date
)
SELECT
  a.id,
  ELT(1 + MOD(a.id, 5), 'MAITRE_STAGE', 'COORDINATEUR_MODULE', 'RESPONSABLE_FILIERE', 'CHEF_DEPARTEMENT', 'AUTRE'),
  DATE_SUB(CURDATE(), INTERVAL (120 + MOD(a.id, 220)) DAY),
  CASE
    WHEN MOD(a.id, 3) = 0 THEN NULL
    ELSE DATE_ADD(DATE_SUB(CURDATE(), INTERVAL (120 + MOD(a.id, 220)) DAY), INTERVAL (90 + MOD(a.id, 140)) DAY)
  END
FROM activities a
JOIN tmp_generated_users g
  ON g.user_id = a.user_id
WHERE a.activity_type = 'RESPONSABILITE'
  AND NOT EXISTS (
    SELECT 1
    FROM responsibility_activities ra
    WHERE ra.activity_id = a.id
  );

/*
  Workflow history entries for generated activities.
*/
SET @admin_actor_id := COALESCE(
  (SELECT id FROM users WHERE role = 'ADMINISTRATION' AND is_active = 1 ORDER BY id LIMIT 1),
  (SELECT id FROM users WHERE role = 'SUPER_ADMIN' AND is_active = 1 ORDER BY id LIMIT 1),
  (SELECT id FROM users ORDER BY id LIMIT 1)
);

SET @fallback_chef_id := COALESCE(
  (SELECT id FROM users WHERE role = 'CHEF_DEPARTEMENT' AND is_active = 1 ORDER BY id LIMIT 1),
  @admin_actor_id
);

DROP TEMPORARY TABLE IF EXISTS tmp_department_heads;
CREATE TEMPORARY TABLE tmp_department_heads AS
SELECT
  d.id AS department_id,
  COALESCE(
    (
      SELECT MIN(u.id)
      FROM users u
      WHERE u.department_id = d.id
        AND u.role = 'CHEF_DEPARTEMENT'
        AND u.is_active = 1
    ),
    @fallback_chef_id
  ) AS actor_id
FROM departments d;

INSERT INTO validation_history (
  activity_id,
  actor_id,
  validation_level,
  decision,
  comment_text,
  decided_at
)
SELECT
  a.id,
  a.user_id,
  'ENSEIGNANT',
  'SOUMIS',
  'Soumission automatique (jeu de donnees dashboard).',
  DATE_ADD(a.created_at, INTERVAL 1 HOUR)
FROM activities a
JOIN tmp_generated_users g
  ON g.user_id = a.user_id
WHERE a.status IN ('SOUMISE', 'VALIDEE_DEPARTEMENT', 'VALIDEE_FINALE', 'REJETEE', 'A_CORRIGER');

INSERT INTO validation_history (
  activity_id,
  actor_id,
  validation_level,
  decision,
  comment_text,
  decided_at
)
SELECT
  a.id,
  COALESCE(h.actor_id, @fallback_chef_id),
  'CHEF_DEPARTEMENT',
  CASE
    WHEN a.status IN ('VALIDEE_DEPARTEMENT', 'VALIDEE_FINALE') THEN 'VALIDE'
    WHEN a.status = 'REJETEE' THEN 'REJETE'
    ELSE 'A_CORRIGER'
  END,
  CASE
    WHEN a.status IN ('VALIDEE_DEPARTEMENT', 'VALIDEE_FINALE') THEN 'Validation departementale automatique.'
    WHEN a.status = 'REJETEE' THEN 'Rejet departemental automatique.'
    ELSE 'Correction demandee automatiquement.'
  END,
  DATE_ADD(a.created_at, INTERVAL 2 HOUR)
FROM activities a
JOIN tmp_generated_users g
  ON g.user_id = a.user_id
LEFT JOIN tmp_department_heads h
  ON h.department_id = g.department_id
WHERE a.status IN ('VALIDEE_DEPARTEMENT', 'VALIDEE_FINALE', 'REJETEE', 'A_CORRIGER');

INSERT INTO validation_history (
  activity_id,
  actor_id,
  validation_level,
  decision,
  comment_text,
  decided_at
)
SELECT
  a.id,
  @admin_actor_id,
  'ADMINISTRATION',
  'VALIDE',
  'Validation finale automatique.',
  DATE_ADD(a.created_at, INTERVAL 3 HOUR)
FROM activities a
JOIN tmp_generated_users g
  ON g.user_id = a.user_id
WHERE a.status = 'VALIDEE_FINALE';

/*
  Final summary (visible in phpMyAdmin SQL output).
*/
SELECT
  SUM(CASE WHEN email LIKE 'teacher.permanent.%@esprit.tn' THEN 1 ELSE 0 END) AS permanent_accounts,
  SUM(CASE WHEN email LIKE 'teacher.vacataire.%@esprit.tn' THEN 1 ELSE 0 END) AS vacataire_accounts,
  SUM(
    CASE
      WHEN email LIKE 'teacher.permanent.%@esprit.tn'
        OR email LIKE 'teacher.vacataire.%@esprit.tn'
      THEN 1
      ELSE 0
    END
  ) AS total_generated_accounts
FROM users;

SELECT
  a.activity_type,
  a.status,
  COUNT(*) AS total
FROM activities a
JOIN users u
  ON u.id = a.user_id
WHERE u.email LIKE 'teacher.demo.%@esprit.tn'
   OR u.email LIKE 'teacher.permanent.%@esprit.tn'
   OR u.email LIKE 'teacher.vacataire.%@esprit.tn'
GROUP BY a.activity_type, a.status
ORDER BY a.activity_type, a.status;

SELECT
  COUNT(*) AS demo_validation_history_entries
FROM validation_history vh
JOIN activities a
  ON a.id = vh.activity_id
JOIN users u
  ON u.id = a.user_id
WHERE u.email LIKE 'teacher.demo.%@esprit.tn'
   OR u.email LIKE 'teacher.permanent.%@esprit.tn'
   OR u.email LIKE 'teacher.vacataire.%@esprit.tn';

SELECT
  COUNT(*) AS vacataire_non_zero_teaching_point_drivers
FROM teaching_activities ta
JOIN activities a
  ON a.id = ta.activity_id
JOIN users u
  ON u.id = a.user_id
WHERE u.email LIKE 'teacher.vacataire.%@esprit.tn'
  AND (
    COALESCE(ta.completed_hours, 0) <> 0
    OR COALESCE(ta.new_course_hours, 0) <> 0
    OR COALESCE(ta.course_restructuring_percentage, 0) <> 0
    OR COALESCE(ta.syllabus_count, 0) <> 0
    OR COALESCE(ta.car_file_elaborated, 0) <> 0
    OR COALESCE(ta.exam_elaborated, 0) <> 0
    OR COALESCE(ta.evening_or_saturday_hours, 0) <> 0
    OR COALESCE(ta.coordination, 0) <> 0
    OR ta.partnership_declaration_type IS NOT NULL
  );
