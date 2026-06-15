-- ============================================================
--  DONNÉES INITIALES  —  pfe_academic_platform
--  Mot de passe de tous les comptes : 123456
--  (le backend le convertit en BCrypt au premier démarrage)
-- ============================================================

USE pfe_academic_platform;

-- ============================================================
-- 1. Départements officiels
-- ============================================================
INSERT IGNORE INTO departments (name, code) VALUES
  ('Management', 'MANAGEMENT'),
  ('IMA',        'IMA'),
  ('LACC',       'LACC');

-- ============================================================
-- 2. Variables pour récupérer les IDs des départements
-- ============================================================
SET @ima_id    = (SELECT id FROM departments WHERE code = 'IMA'        LIMIT 1);
SET @mgmt_id   = (SELECT id FROM departments WHERE code = 'MANAGEMENT' LIMIT 1);
SET @lacc_id   = (SELECT id FROM departments WHERE code = 'LACC'       LIMIT 1);

-- ============================================================
-- 3. Utilisateurs initiaux
--    password_hash = 'PLACEHOLDER'  →  le SamplePasswordBootstrap
--    le remplace par BCrypt("123456") au démarrage du backend
-- ============================================================
INSERT IGNORE INTO users (first_name, last_name, email, password_hash, role, teacher_type, department_id, is_active) VALUES

  -- Super Administrateur
  ('Super',          'Admin',       'super.admin@esprit.tn',          'PLACEHOLDER', 'SUPER_ADMIN',       NULL,        NULL,       1),

  -- Administration
  ('Administration', 'ESPRIT',      'administration@esprit.tn',       'PLACEHOLDER', 'ADMINISTRATION',    NULL,        @ima_id,    1),

  -- Chefs de département
  ('Chef',           'IMA',         'chef.info@esprit.tn',            'PLACEHOLDER', 'CHEF_DEPARTEMENT',  NULL,        @ima_id,    1),
  ('Chef',           'Management',  'chef.management@esprit.tn',      'PLACEHOLDER', 'CHEF_DEPARTEMENT',  NULL,        @mgmt_id,   1),
  ('Chef',           'LACC',        'chef.lacc@esprit.tn',            'PLACEHOLDER', 'CHEF_DEPARTEMENT',  NULL,        @lacc_id,   1),

  -- Enseignants
  ('Ahmed',          'Ben Ali',     'enseignant.ima@esprit.tn',       'PLACEHOLDER', 'ENSEIGNANT',        'PERMANENT', @ima_id,    1),
  ('Sonia',          'Trabelsi',    'enseignant2.ima@esprit.tn',      'PLACEHOLDER', 'ENSEIGNANT',        'PERMANENT', @ima_id,    1),
  ('Mohamed',        'Chaabane',    'enseignant.management@esprit.tn','PLACEHOLDER', 'ENSEIGNANT',        'PERMANENT', @mgmt_id,   1),
  ('Fatma',          'Gharbi',      'enseignant.lacc@esprit.tn',      'PLACEHOLDER', 'ENSEIGNANT',        'VACATAIRE', @lacc_id,   1);

-- ============================================================
-- 4. Entrées auth_security_states pour chaque utilisateur
--    (nécessaire pour que la connexion fonctionne)
-- ============================================================
INSERT IGNORE INTO auth_security_states (user_id)
  SELECT id FROM users
  WHERE email IN (
    'super.admin@esprit.tn',
    'administration@esprit.tn',
    'chef.info@esprit.tn',
    'chef.management@esprit.tn',
    'chef.lacc@esprit.tn',
    'enseignant.ima@esprit.tn',
    'enseignant2.ima@esprit.tn',
    'enseignant.management@esprit.tn',
    'enseignant.lacc@esprit.tn'
  );
