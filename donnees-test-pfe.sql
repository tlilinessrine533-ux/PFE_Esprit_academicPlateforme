USE pfe_academic_platform;

-- Executez ce script une seule fois si vos tables sont encore vides.

INSERT INTO departments (id, name, code)
VALUES
  (1, 'IMA', 'IMA'),
  (2, 'Management', 'MANAGEMENT'),
  (3, 'LACC', 'LACC');

INSERT INTO users (id, first_name, last_name, email, password_hash, role, department_id, is_active)
VALUES
  (1, 'Super', 'Admin', 'superadmin@esprit.tn', 'temp_hash_superadmin', 'SUPER_ADMIN', NULL, 1),
  (2, 'Admin', 'Academic', 'admin@esprit.tn', 'temp_hash_admin', 'ADMINISTRATION', NULL, 1),
  (3, 'Aymen', 'BenBrik', 'chef.info@esprit.tn', 'temp_hash_chef', 'CHEF_DEPARTEMENT', 1, 1),
  (4, 'Mohamed', 'Ali', 'enseignant@esprit.tn', 'temp_hash_enseignant', 'ENSEIGNANT', 1, 1);

INSERT INTO activities (id, user_id, activity_type, status, academic_year)
VALUES
  (1, 4, 'ENSEIGNEMENT', 'VALIDEE_DEPARTEMENT', '2025-2026'),
  (2, 4, 'ENCADREMENT', 'VALIDEE_FINALE', '2025-2026'),
  (3, 4, 'RECHERCHE', 'VALIDEE_FINALE', '2025-2026'),
  (4, 4, 'SURVEILLANCE', 'BROUILLON', '2025-2026'),
  (5, 4, 'RESPONSABILITE', 'SOUMISE', '2025-2026');

INSERT INTO teaching_activities (
  activity_id, program_name, class_name, module_name, semester,
  teaching_mode, language, planned_hours, completed_hours, new_course_hours,
  course_restructuring_percentage, course_restructuring_approved, syllabus_count,
  car_file_elaborated, exam_elaborated, evening_or_saturday_hours, coordination, syllabus_path
)
VALUES
  (1, 'Licence Business Computing', '3A', 'Architecture Logicielle', 'S1',
   'PRESENTIEL', 'Francais', 42.00, 40.00, 6.00,
   40, 1, 1, 1, 1, 4.00, 1, 'syllabus_architecture.pdf');

INSERT INTO supervision_activities (
  activity_id, supervision_type, student_name, student_program,
  subject_title, supervision_status, role_in_jury
)
VALUES
  (2, 'PFE', 'Sarra Ben Salah', 'Business Computing',
   'Plateforme intelligente de suivi des activites academiques', 'SOUTENU', 'ENCADRANT');

INSERT INTO research_activities (
  activity_id, publication_type, title, venue_name,
  publication_year, indexing_name, doi, publication_rank, activity_points
)
VALUES
  (3, 'ARTICLE', 'Automatisation des workflows academiques',
   'International Journal of Academic Systems', 2025, 'Scopus', '10.1234/pfe.2025.001', 'Q1', 100.00);

INSERT INTO exam_surveillance_activities (
  activity_id, session_name, semester, hours_count, session_day, session_points
)
VALUES
  (4, 'Session Principale Janvier', 'S1', 1.00, 'LUNDI', 1.00);

INSERT INTO responsibility_activities (
  activity_id, responsibility_type, start_date, end_date
)
VALUES
  (5, 'COORDINATEUR_MODULE', '2025-09-01', '2026-06-30');

INSERT INTO validation_history (
  id, activity_id, actor_id, validation_level, decision, comment_text, decided_at
)
VALUES
  (1, 1, 4, 'ENSEIGNANT', 'SOUMIS', 'Soumission du cours', '2026-02-10 09:00:00'),
  (2, 1, 3, 'CHEF_DEPARTEMENT', 'VALIDE', 'Cours valide par le chef de departement', '2026-02-12 11:00:00'),
  (3, 2, 4, 'ENSEIGNANT', 'SOUMIS', 'Soumission encadrement PFE', '2026-02-15 10:30:00'),
  (4, 2, 3, 'CHEF_DEPARTEMENT', 'VALIDE', 'Encadrement valide', '2026-02-16 14:00:00'),
  (5, 2, 2, 'ADMINISTRATION', 'VALIDE', 'Validation finale effectuee', '2026-02-18 08:45:00'),
  (6, 3, 4, 'ENSEIGNANT', 'SOUMIS', 'Soumission activite recherche', '2026-02-20 09:15:00'),
  (7, 3, 3, 'CHEF_DEPARTEMENT', 'VALIDE', 'Recherche validee au niveau departement', '2026-02-21 13:10:00'),
  (8, 3, 2, 'ADMINISTRATION', 'VALIDE', 'Recherche validee definitivement', '2026-02-22 16:20:00'),
  (9, 5, 4, 'ENSEIGNANT', 'SOUMIS', 'Soumission responsabilite academique', '2026-02-25 12:00:00');

INSERT INTO reports (
  id, generated_by, target_user_id, department_id, report_type,
  report_format, period_label, file_path, generated_at
)
VALUES
  (1, 4, 4, 1, 'INDIVIDUEL_ANNUEL', 'PDF', '2025-2026', 'reports/rapport_individuel_2025_2026.pdf', '2026-03-01 10:00:00'),
  (2, 2, NULL, 1, 'DEPARTEMENTAL', 'EXCEL', '2025-2026', 'reports/rapport_departement_info_2025_2026.xlsx', '2026-03-02 11:00:00');

INSERT INTO notifications (
  id, user_id, title, message_text, is_read, created_at
)
VALUES
  (1, 4, 'Activite validee', 'Votre encadrement PFE a ete valide par l administration.', 0, '2026-03-02 12:00:00'),
  (2, 4, 'Activite en attente', 'Votre responsabilite academique est en attente de validation.', 0, '2026-03-03 08:30:00');
