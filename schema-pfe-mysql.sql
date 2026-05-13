CREATE DATABASE IF NOT EXISTS pfe_academic_platform
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE pfe_academic_platform;

CREATE TABLE departments (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(20) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_departments_name (name),
  UNIQUE KEY uq_departments_code (code)
) ENGINE=InnoDB;

CREATE TABLE users (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('ENSEIGNANT', 'CHEF_DEPARTEMENT', 'ADMINISTRATION', 'SUPER_ADMIN') NOT NULL,
  teacher_type VARCHAR(20) NULL,
  department_id BIGINT UNSIGNED NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_users_email (email),
  KEY idx_users_role (role),
  KEY idx_users_department (department_id),
  CONSTRAINT fk_users_department
    FOREIGN KEY (department_id) REFERENCES departments(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE auth_security_states (
  user_id BIGINT UNSIGNED PRIMARY KEY,
  failed_login_attempts INT NOT NULL DEFAULT 0,
  login_locked_until DATETIME NULL,
  password_reset_code_hash VARCHAR(255) NULL,
  password_reset_expires_at DATETIME NULL,
  password_reset_requested_at DATETIME NULL,
  two_factor_enabled TINYINT(1) NOT NULL DEFAULT 0,
  two_factor_secret VARCHAR(128) NULL,
  two_factor_pending_secret VARCHAR(128) NULL,
  two_factor_pending_secret_expires_at DATETIME NULL,
  two_factor_login_challenge_hash VARCHAR(255) NULL,
  two_factor_login_challenge_expires_at DATETIME NULL,
  two_factor_backup_code_hashes TEXT NULL,
  trusted_device_token_hash VARCHAR(255) NULL,
  trusted_device_expires_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_auth_security_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE signup_requests (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('ENSEIGNANT', 'CHEF_DEPARTEMENT', 'ADMINISTRATION', 'SUPER_ADMIN') NOT NULL DEFAULT 'ENSEIGNANT',
  department_id BIGINT UNSIGNED NOT NULL,
  status ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
  review_comment TEXT NULL,
  reviewed_by BIGINT UNSIGNED NULL,
  reviewed_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_signup_requests_email (email),
  KEY idx_signup_requests_status (status),
  KEY idx_signup_requests_department (department_id),
  KEY idx_signup_requests_reviewed_by (reviewed_by),
  CONSTRAINT fk_signup_requests_department
    FOREIGN KEY (department_id) REFERENCES departments(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT fk_signup_requests_reviewed_by
    FOREIGN KEY (reviewed_by) REFERENCES users(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE activities (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  activity_type ENUM(
    'ENSEIGNEMENT',
    'ENCADREMENT',
    'RECHERCHE',
    'EVENEMENT',
    'SURVEILLANCE',
    'RESPONSABILITE',
    'DISPONIBILITE'
  ) NOT NULL,
  status ENUM(
    'BROUILLON',
    'SOUMISE',
    'VALIDEE_DEPARTEMENT',
    'VALIDEE_FINALE',
    'REJETEE',
    'A_CORRIGER'
  ) NOT NULL DEFAULT 'BROUILLON',
  academic_year VARCHAR(20) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_activities_user (user_id),
  KEY idx_activities_type (activity_type),
  KEY idx_activities_status (status),
  CONSTRAINT fk_activities_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE teaching_activities (
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
) ENGINE=InnoDB;

CREATE TABLE supervision_activities (
  activity_id BIGINT UNSIGNED PRIMARY KEY,
  supervision_type VARCHAR(80) NOT NULL,
  student_name VARCHAR(150) NOT NULL,
  student_program VARCHAR(150) NOT NULL,
  subject_title VARCHAR(255) NOT NULL,
  supervision_status ENUM('EN_COURS', 'SOUTENU') NOT NULL,
  role_in_jury VARCHAR(30) NOT NULL,
  quantity_value DECIMAL(8,2) NOT NULL DEFAULT 1.00,
  activity_points DECIMAL(8,2) NOT NULL DEFAULT 0.00,
  CONSTRAINT fk_supervision_activity
    FOREIGN KEY (activity_id) REFERENCES activities(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE research_activities (
  activity_id BIGINT UNSIGNED PRIMARY KEY,
  publication_type VARCHAR(80) NOT NULL,
  title VARCHAR(255) NOT NULL,
  venue_name VARCHAR(255) NOT NULL,
  publication_year YEAR NOT NULL,
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
) ENGINE=InnoDB;

CREATE TABLE event_activities (
  activity_id BIGINT UNSIGNED PRIMARY KEY,
  event_type ENUM('SEMINAIRE', 'COLLOQUE', 'WORKSHOP', 'JOURNEE_SCIENTIFIQUE', 'AUTRE') NOT NULL,
  title VARCHAR(255) NOT NULL,
  event_date DATE NOT NULL,
  organization_role VARCHAR(100) NOT NULL,
  CONSTRAINT fk_event_activity
    FOREIGN KEY (activity_id) REFERENCES activities(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE exam_surveillance_activities (
  activity_id BIGINT UNSIGNED PRIMARY KEY,
  session_name VARCHAR(100) NOT NULL,
  semester ENUM('S1', 'S2', 'ANNUEL') NOT NULL,
  hours_count DECIMAL(6,2) NOT NULL DEFAULT 1.00,
  session_day ENUM('LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI') NOT NULL DEFAULT 'LUNDI',
  session_points DECIMAL(4,2) NOT NULL DEFAULT 1.00,
  CONSTRAINT fk_exam_surveillance_activity
    FOREIGN KEY (activity_id) REFERENCES activities(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE responsibility_activities (
  activity_id BIGINT UNSIGNED PRIMARY KEY,
  responsibility_type ENUM(
    'MAITRE_STAGE',
    'COORDINATEUR_MODULE',
    'RESPONSABLE_FILIERE',
    'CHEF_DEPARTEMENT',
    'AUTRE'
  ) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NULL,
  CONSTRAINT fk_responsibility_activity
    FOREIGN KEY (activity_id) REFERENCES activities(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE availability_request_activities (
  activity_id BIGINT UNSIGNED PRIMARY KEY,
  request_type ENUM('CONGE', 'MISSION') NOT NULL,
  leave_type ENUM('ANNUEL', 'MALADIE', 'EXCEPTIONNEL', 'SANS_SOLDE', 'AUTRE') NULL,
  mission_kind ENUM('MISSION', 'CONFERENCE') NULL,
  title VARCHAR(180) NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT NOT NULL,
  department_id BIGINT UNSIGNED NULL,
  pedagogical_unit VARCHAR(180) NULL,
  department_name VARCHAR(100) NULL,
  medical_certificate_image_data_url LONGTEXT NULL,
  KEY idx_availability_request_department (department_id),
  CONSTRAINT fk_availability_request_activity
    FOREIGN KEY (activity_id) REFERENCES activities(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_availability_request_department
    FOREIGN KEY (department_id) REFERENCES departments(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE validation_history (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  activity_id BIGINT UNSIGNED NOT NULL,
  actor_id BIGINT UNSIGNED NOT NULL,
  validation_level ENUM('ENSEIGNANT', 'CHEF_DEPARTEMENT', 'ADMINISTRATION') NOT NULL,
  decision ENUM('SOUMIS', 'VALIDE', 'REJETE', 'A_CORRIGER') NOT NULL,
  comment_text TEXT NULL,
  decided_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_validation_activity (activity_id),
  KEY idx_validation_actor (actor_id),
  KEY idx_validation_decision (decision),
  CONSTRAINT fk_validation_activity
    FOREIGN KEY (activity_id) REFERENCES activities(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_validation_actor
    FOREIGN KEY (actor_id) REFERENCES users(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE reports (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  generated_by BIGINT UNSIGNED NOT NULL,
  target_user_id BIGINT UNSIGNED NULL,
  department_id BIGINT UNSIGNED NULL,
  report_type ENUM(
    'INDIVIDUEL_ANNUEL',
    'SEMESTRIEL',
    'PROMOTION_ACADEMIQUE',
    'PRIME_PERFORMANCE',
    'DEPARTEMENTAL',
    'INSTITUTIONNEL'
  ) NOT NULL,
  report_format ENUM('PDF', 'EXCEL') NOT NULL,
  period_label VARCHAR(50) NOT NULL,
  file_path VARCHAR(255) NULL,
  generated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_reports_generated_by (generated_by),
  KEY idx_reports_target_user (target_user_id),
  KEY idx_reports_department (department_id),
  CONSTRAINT fk_reports_generated_by
    FOREIGN KEY (generated_by) REFERENCES users(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT fk_reports_target_user
    FOREIGN KEY (target_user_id) REFERENCES users(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT fk_reports_department
    FOREIGN KEY (department_id) REFERENCES departments(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE notifications (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  title VARCHAR(150) NOT NULL,
  message_text TEXT NOT NULL,
  is_read TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_notifications_user (user_id),
  KEY idx_notifications_is_read (is_read),
  CONSTRAINT fk_notifications_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE VIEW v_teacher_kpis AS
SELECT
  u.id AS user_id,
  u.first_name,
  u.last_name,
  u.email,
  d.name AS department_name,
  COUNT(DISTINCT CASE
    WHEN a.activity_type = 'ENSEIGNEMENT' THEN a.id
  END) AS teaching_count,
  COALESCE(SUM(CASE
    WHEN a.activity_type = 'ENSEIGNEMENT' THEN ta.completed_hours
    ELSE 0
  END), 0) AS total_completed_hours,
  COALESCE(SUM(CASE
    WHEN a.activity_type = 'ENSEIGNEMENT'
      AND a.status IN ('VALIDEE_DEPARTEMENT', 'VALIDEE_FINALE')
    THEN ta.completed_hours
      + (ta.new_course_hours * 1.5)
      + CASE
          WHEN ta.course_restructuring_approved = 1 THEN (ta.course_restructuring_percentage * 0.05)
          ELSE 0
        END
      + ta.syllabus_count
      + CASE WHEN ta.car_file_elaborated = 1 THEN 10 ELSE 0 END
      + CASE WHEN ta.exam_elaborated = 1 THEN 5 ELSE 0 END
      + (ta.evening_or_saturday_hours * 1.5)
      + CASE WHEN ta.coordination = 1 THEN 5 ELSE 0 END
      + CASE
          WHEN ta.partnership_declaration_type = 'PROFESSIONNELLE' THEN 15
          WHEN ta.partnership_declaration_type = 'ACADEMIQUE' THEN 12
          ELSE 0
        END
    ELSE 0
  END), 0) AS total_teaching_points,
  COUNT(DISTINCT CASE
    WHEN a.activity_type = 'ENCADREMENT' THEN a.id
  END) AS supervision_count,
  COUNT(DISTINCT CASE
    WHEN a.activity_type = 'RECHERCHE' THEN a.id
  END) AS research_count,
  COUNT(DISTINCT a.id) AS total_activities
FROM users u
LEFT JOIN departments d
  ON d.id = u.department_id
LEFT JOIN activities a
  ON a.user_id = u.id
LEFT JOIN teaching_activities ta
  ON ta.activity_id = a.id
GROUP BY u.id, u.first_name, u.last_name, u.email, d.name;

CREATE VIEW v_department_kpis AS
SELECT
  d.id AS department_id,
  d.name AS department_name,
  COUNT(DISTINCT u.id) AS total_users,
  COUNT(DISTINCT a.id) AS total_activities,
  COALESCE(SUM(CASE
    WHEN a.activity_type = 'ENSEIGNEMENT' THEN ta.completed_hours
    ELSE 0
  END), 0) AS total_completed_hours,
  COALESCE(SUM(CASE
    WHEN a.activity_type = 'ENSEIGNEMENT'
      AND a.status IN ('VALIDEE_DEPARTEMENT', 'VALIDEE_FINALE')
    THEN ta.completed_hours
      + (ta.new_course_hours * 1.5)
      + CASE
          WHEN ta.course_restructuring_approved = 1 THEN (ta.course_restructuring_percentage * 0.05)
          ELSE 0
        END
      + ta.syllabus_count
      + CASE WHEN ta.car_file_elaborated = 1 THEN 10 ELSE 0 END
      + CASE WHEN ta.exam_elaborated = 1 THEN 5 ELSE 0 END
      + (ta.evening_or_saturday_hours * 1.5)
      + CASE WHEN ta.coordination = 1 THEN 5 ELSE 0 END
      + CASE
          WHEN ta.partnership_declaration_type = 'PROFESSIONNELLE' THEN 15
          WHEN ta.partnership_declaration_type = 'ACADEMIQUE' THEN 12
          ELSE 0
        END
    ELSE 0
  END), 0) AS total_teaching_points,
  COUNT(DISTINCT CASE
    WHEN a.activity_type = 'ENCADREMENT' THEN a.id
  END) AS total_supervisions,
  COUNT(DISTINCT CASE
    WHEN a.activity_type = 'RECHERCHE' THEN a.id
  END) AS total_researches
FROM departments d
LEFT JOIN users u
  ON u.department_id = d.id
LEFT JOIN activities a
  ON a.user_id = u.id
LEFT JOIN teaching_activities ta
  ON ta.activity_id = a.id
GROUP BY d.id, d.name;
