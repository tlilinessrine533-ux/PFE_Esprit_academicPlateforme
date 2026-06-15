-- ============================================================
--  SEED COMPLET : Absences + Rapports + Décisions admin
--  Compatible avec tous les rôles : enseignant, chef, admin, super_admin
--  Données couvrant tous les KPIs de la plateforme
--  Re-exécutable sans doublons
-- ============================================================
USE pfe_academic_platform;

-- ============================================================
-- SECTION 0 : IDs des 4 acteurs principaux + départements
-- ============================================================
SET @ima_id      = (SELECT id FROM departments WHERE code = 'IMA'        LIMIT 1);
SET @mgmt_id     = (SELECT id FROM departments WHERE code = 'MANAGEMENT' LIMIT 1);
SET @lacc_id     = (SELECT id FROM departments WHERE code = 'LACC'       LIMIT 1);

SET @admin_id     = (SELECT id FROM users WHERE email = 'administration@esprit.tn'        LIMIT 1);
SET @super_id     = (SELECT id FROM users WHERE email = 'super.admin@esprit.tn'           LIMIT 1);
SET @chef_ima_id  = (SELECT id FROM users WHERE email = 'chef.info@esprit.tn'             LIMIT 1);
SET @chef_mgmt_id = (SELECT id FROM users WHERE email = 'chef.management@esprit.tn'       LIMIT 1);
SET @chef_lacc_id = (SELECT id FROM users WHERE email = 'chef.lacc@esprit.tn'             LIMIT 1);
SET @ens_ima1_id  = (SELECT id FROM users WHERE email = 'enseignant.ima@esprit.tn'        LIMIT 1);
SET @ens_ima2_id  = (SELECT id FROM users WHERE email = 'enseignant2.ima@esprit.tn'       LIMIT 1);
SET @ens_mgmt_id  = (SELECT id FROM users WHERE email = 'enseignant.management@esprit.tn' LIMIT 1);
SET @ens_lacc_id  = (SELECT id FROM users WHERE email = 'enseignant.lacc@esprit.tn'       LIMIT 1);

-- ============================================================
-- SECTION 1 : CONGE + MISSION — enseignant.ima@esprit.tn
-- ============================================================

-- 1-A Congé annuel (VALIDÉE_FINALE, 5 jours)
SET @act_id = (SELECT a.id FROM activities a JOIN availability_request_activities ar ON ar.activity_id = a.id WHERE a.user_id = @ens_ima1_id AND ar.leave_type = 'ANNUEL' AND a.academic_year = '2025-2026' LIMIT 1);
INSERT INTO activities (user_id, activity_type, status, academic_year, created_at, updated_at) SELECT @ens_ima1_id,'DISPONIBILITE','VALIDEE_FINALE','2025-2026','2025-11-01 08:30:00','2025-11-06 14:00:00' WHERE @act_id IS NULL;
SET @act_id = IF(@act_id IS NOT NULL, @act_id, LAST_INSERT_ID());
INSERT INTO availability_request_activities (activity_id, request_type, leave_type, mission_kind, title, start_date, end_date, reason, department_id, department_name, pedagogical_unit) SELECT @act_id,'CONGE','ANNUEL',NULL,'Demande de conge','2025-11-03','2025-11-07','Congé annuel réglementaire',@ima_id,'IMA','' WHERE NOT EXISTS (SELECT 1 FROM availability_request_activities WHERE activity_id = @act_id);
INSERT INTO validation_history (activity_id, actor_id, validation_level, decision, comment_text, decided_at) SELECT @act_id,@chef_ima_id,'CHEF_DEPARTEMENT','VALIDE','Approuvé','2025-11-04 10:00:00' WHERE NOT EXISTS (SELECT 1 FROM validation_history WHERE activity_id = @act_id AND validation_level = 'CHEF_DEPARTEMENT');
INSERT INTO validation_history (activity_id, actor_id, validation_level, decision, comment_text, decided_at) SELECT @act_id,@admin_id,'ADMINISTRATION','VALIDE','Validation finale','2025-11-06 14:00:00' WHERE NOT EXISTS (SELECT 1 FROM validation_history WHERE activity_id = @act_id AND validation_level = 'ADMINISTRATION');

-- 1-B Congé maladie (REJETÉE, 3 jours)
SET @act_id = (SELECT a.id FROM activities a JOIN availability_request_activities ar ON ar.activity_id = a.id WHERE a.user_id = @ens_ima1_id AND ar.leave_type = 'MALADIE' AND a.academic_year = '2025-2026' LIMIT 1);
INSERT INTO activities (user_id, activity_type, status, academic_year, created_at, updated_at) SELECT @ens_ima1_id,'DISPONIBILITE','REJETEE','2025-2026','2025-12-10 09:00:00','2025-12-11 10:00:00' WHERE @act_id IS NULL;
SET @act_id = IF(@act_id IS NOT NULL, @act_id, LAST_INSERT_ID());
INSERT INTO availability_request_activities (activity_id, request_type, leave_type, mission_kind, title, start_date, end_date, reason, department_id, department_name, pedagogical_unit) SELECT @act_id,'CONGE','MALADIE',NULL,'Demande de conge','2025-12-12','2025-12-14','Arrêt maladie',@ima_id,'IMA','' WHERE NOT EXISTS (SELECT 1 FROM availability_request_activities WHERE activity_id = @act_id);
INSERT INTO validation_history (activity_id, actor_id, validation_level, decision, comment_text, decided_at) SELECT @act_id,@chef_ima_id,'CHEF_DEPARTEMENT','REJETE','Certificat insuffisant','2025-12-11 10:00:00' WHERE NOT EXISTS (SELECT 1 FROM validation_history WHERE activity_id = @act_id AND validation_level = 'CHEF_DEPARTEMENT');

-- 1-C Congé exceptionnel (SOUMISE — en attente chef)
SET @act_id = (SELECT a.id FROM activities a JOIN availability_request_activities ar ON ar.activity_id = a.id WHERE a.user_id = @ens_ima1_id AND ar.leave_type = 'EXCEPTIONNEL' AND a.academic_year = '2025-2026' LIMIT 1);
INSERT INTO activities (user_id, activity_type, status, academic_year, created_at, updated_at) SELECT @ens_ima1_id,'DISPONIBILITE','SOUMISE','2025-2026','2026-01-05 08:00:00','2026-01-05 08:00:00' WHERE @act_id IS NULL;
SET @act_id = IF(@act_id IS NOT NULL, @act_id, LAST_INSERT_ID());
INSERT INTO availability_request_activities (activity_id, request_type, leave_type, mission_kind, title, start_date, end_date, reason, department_id, department_name, pedagogical_unit) SELECT @act_id,'CONGE','EXCEPTIONNEL',NULL,'Demande de conge','2026-01-08','2026-01-09','Événement familial',@ima_id,'IMA','' WHERE NOT EXISTS (SELECT 1 FROM availability_request_activities WHERE activity_id = @act_id);

-- 1-D Mission conférence (VALIDÉE_FINALE)
SET @act_id = (SELECT a.id FROM activities a JOIN availability_request_activities ar ON ar.activity_id = a.id WHERE a.user_id = @ens_ima1_id AND ar.mission_kind IS NOT NULL AND a.academic_year = '2025-2026' LIMIT 1);
INSERT INTO activities (user_id, activity_type, status, academic_year, created_at, updated_at) SELECT @ens_ima1_id,'DISPONIBILITE','VALIDEE_FINALE','2025-2026','2026-02-01 10:00:00','2026-02-05 10:00:00' WHERE @act_id IS NULL;
SET @act_id = IF(@act_id IS NOT NULL, @act_id, LAST_INSERT_ID());
INSERT INTO availability_request_activities (activity_id, request_type, leave_type, mission_kind, title, start_date, end_date, reason, department_id, department_name, pedagogical_unit) SELECT @act_id,'MISSION',NULL,'CONFERENCE','Conférence IEEE sur l''IA','2026-02-10','2026-02-12','Présentation travaux de recherche',@ima_id,'IMA','' WHERE NOT EXISTS (SELECT 1 FROM availability_request_activities WHERE activity_id = @act_id);
INSERT INTO validation_history (activity_id, actor_id, validation_level, decision, comment_text, decided_at) SELECT @act_id,@chef_ima_id,'CHEF_DEPARTEMENT','VALIDE','Mission scientifique approuvée','2026-02-03 09:00:00' WHERE NOT EXISTS (SELECT 1 FROM validation_history WHERE activity_id = @act_id AND validation_level = 'CHEF_DEPARTEMENT');
INSERT INTO validation_history (activity_id, actor_id, validation_level, decision, comment_text, decided_at) SELECT @act_id,@admin_id,'ADMINISTRATION','VALIDE','Validation finale','2026-02-05 10:00:00' WHERE NOT EXISTS (SELECT 1 FROM validation_history WHERE activity_id = @act_id AND validation_level = 'ADMINISTRATION');

-- 1-E Congé sans solde 2024-2025 (historique — VALIDÉE_FINALE)
SET @act_id = (SELECT a.id FROM activities a JOIN availability_request_activities ar ON ar.activity_id = a.id WHERE a.user_id = @ens_ima1_id AND ar.leave_type = 'SANS_SOLDE' AND a.academic_year = '2024-2025' LIMIT 1);
INSERT INTO activities (user_id, activity_type, status, academic_year, created_at, updated_at) SELECT @ens_ima1_id,'DISPONIBILITE','VALIDEE_FINALE','2024-2025','2025-01-10 09:00:00','2025-01-15 11:00:00' WHERE @act_id IS NULL;
SET @act_id = IF(@act_id IS NOT NULL, @act_id, LAST_INSERT_ID());
INSERT INTO availability_request_activities (activity_id, request_type, leave_type, mission_kind, title, start_date, end_date, reason, department_id, department_name, pedagogical_unit) SELECT @act_id,'CONGE','SANS_SOLDE',NULL,'Demande de conge','2025-01-13','2025-01-17','Congé personnel',@ima_id,'IMA','' WHERE NOT EXISTS (SELECT 1 FROM availability_request_activities WHERE activity_id = @act_id);
INSERT INTO validation_history (activity_id, actor_id, validation_level, decision, comment_text, decided_at) SELECT @act_id,@chef_ima_id,'CHEF_DEPARTEMENT','VALIDE','Approuvé','2025-01-13 10:00:00' WHERE NOT EXISTS (SELECT 1 FROM validation_history WHERE activity_id = @act_id AND validation_level = 'CHEF_DEPARTEMENT');
INSERT INTO validation_history (activity_id, actor_id, validation_level, decision, comment_text, decided_at) SELECT @act_id,@admin_id,'ADMINISTRATION','VALIDE','Validation finale','2025-01-15 11:00:00' WHERE NOT EXISTS (SELECT 1 FROM validation_history WHERE activity_id = @act_id AND validation_level = 'ADMINISTRATION');

-- ============================================================
-- SECTION 2 : CONGE + MISSION — enseignant2.ima@esprit.tn
-- ============================================================

-- 2-A Congé annuel (VALIDÉE_DEPARTEMENT, 5 jours)
SET @act_id = (SELECT a.id FROM activities a JOIN availability_request_activities ar ON ar.activity_id = a.id WHERE a.user_id = @ens_ima2_id AND ar.leave_type = 'ANNUEL' AND a.academic_year = '2025-2026' LIMIT 1);
INSERT INTO activities (user_id, activity_type, status, academic_year, created_at, updated_at) SELECT @ens_ima2_id,'DISPONIBILITE','VALIDEE_DEPARTEMENT','2025-2026','2025-11-10 09:00:00','2025-11-12 14:00:00' WHERE @act_id IS NULL;
SET @act_id = IF(@act_id IS NOT NULL, @act_id, LAST_INSERT_ID());
INSERT INTO availability_request_activities (activity_id, request_type, leave_type, mission_kind, title, start_date, end_date, reason, department_id, department_name, pedagogical_unit) SELECT @act_id,'CONGE','ANNUEL',NULL,'Demande de conge','2025-11-17','2025-11-21','Congé annuel',@ima_id,'IMA','' WHERE NOT EXISTS (SELECT 1 FROM availability_request_activities WHERE activity_id = @act_id);
INSERT INTO validation_history (activity_id, actor_id, validation_level, decision, comment_text, decided_at) SELECT @act_id,@chef_ima_id,'CHEF_DEPARTEMENT','VALIDE','Approuvé par le département','2025-11-12 14:00:00' WHERE NOT EXISTS (SELECT 1 FROM validation_history WHERE activity_id = @act_id AND validation_level = 'CHEF_DEPARTEMENT');

-- 2-B Congé maladie (SOUMISE)
SET @act_id = (SELECT a.id FROM activities a JOIN availability_request_activities ar ON ar.activity_id = a.id WHERE a.user_id = @ens_ima2_id AND ar.leave_type = 'MALADIE' AND a.academic_year = '2025-2026' LIMIT 1);
INSERT INTO activities (user_id, activity_type, status, academic_year, created_at, updated_at) SELECT @ens_ima2_id,'DISPONIBILITE','SOUMISE','2025-2026','2026-01-20 08:00:00','2026-01-20 08:00:00' WHERE @act_id IS NULL;
SET @act_id = IF(@act_id IS NOT NULL, @act_id, LAST_INSERT_ID());
INSERT INTO availability_request_activities (activity_id, request_type, leave_type, mission_kind, title, start_date, end_date, reason, department_id, department_name, pedagogical_unit) SELECT @act_id,'CONGE','MALADIE',NULL,'Demande de conge','2026-01-22','2026-01-24','Arrêt maladie avec certificat',@ima_id,'IMA','' WHERE NOT EXISTS (SELECT 1 FROM availability_request_activities WHERE activity_id = @act_id);

-- 2-C Mission pédagogique (VALIDÉE_FINALE)
SET @act_id = (SELECT a.id FROM activities a JOIN availability_request_activities ar ON ar.activity_id = a.id WHERE a.user_id = @ens_ima2_id AND ar.mission_kind IS NOT NULL AND a.academic_year = '2025-2026' LIMIT 1);
INSERT INTO activities (user_id, activity_type, status, academic_year, created_at, updated_at) SELECT @ens_ima2_id,'DISPONIBILITE','VALIDEE_FINALE','2025-2026','2026-03-01 09:00:00','2026-03-05 11:00:00' WHERE @act_id IS NULL;
SET @act_id = IF(@act_id IS NOT NULL, @act_id, LAST_INSERT_ID());
INSERT INTO availability_request_activities (activity_id, request_type, leave_type, mission_kind, title, start_date, end_date, reason, department_id, department_name, pedagogical_unit) SELECT @act_id,'MISSION',NULL,'MISSION','Mission pédagogique externe','2026-03-10','2026-03-12','Formation pédagogique continue',@ima_id,'IMA','' WHERE NOT EXISTS (SELECT 1 FROM availability_request_activities WHERE activity_id = @act_id);
INSERT INTO validation_history (activity_id, actor_id, validation_level, decision, comment_text, decided_at) SELECT @act_id,@chef_ima_id,'CHEF_DEPARTEMENT','VALIDE','Approuvé','2026-03-03 10:00:00' WHERE NOT EXISTS (SELECT 1 FROM validation_history WHERE activity_id = @act_id AND validation_level = 'CHEF_DEPARTEMENT');
INSERT INTO validation_history (activity_id, actor_id, validation_level, decision, comment_text, decided_at) SELECT @act_id,@admin_id,'ADMINISTRATION','VALIDE','Validation finale','2026-03-05 11:00:00' WHERE NOT EXISTS (SELECT 1 FROM validation_history WHERE activity_id = @act_id AND validation_level = 'ADMINISTRATION');

-- 2-D Congé annuel 2024-2025 (historique)
SET @act_id = (SELECT a.id FROM activities a JOIN availability_request_activities ar ON ar.activity_id = a.id WHERE a.user_id = @ens_ima2_id AND ar.leave_type = 'ANNUEL' AND a.academic_year = '2024-2025' LIMIT 1);
INSERT INTO activities (user_id, activity_type, status, academic_year, created_at, updated_at) SELECT @ens_ima2_id,'DISPONIBILITE','VALIDEE_FINALE','2024-2025','2024-11-05 09:00:00','2024-11-09 14:00:00' WHERE @act_id IS NULL;
SET @act_id = IF(@act_id IS NOT NULL, @act_id, LAST_INSERT_ID());
INSERT INTO availability_request_activities (activity_id, request_type, leave_type, mission_kind, title, start_date, end_date, reason, department_id, department_name, pedagogical_unit) SELECT @act_id,'CONGE','ANNUEL',NULL,'Demande de conge','2024-11-11','2024-11-15','Congé annuel réglementaire',@ima_id,'IMA','' WHERE NOT EXISTS (SELECT 1 FROM availability_request_activities WHERE activity_id = @act_id);
INSERT INTO validation_history (activity_id, actor_id, validation_level, decision, comment_text, decided_at) SELECT @act_id,@chef_ima_id,'CHEF_DEPARTEMENT','VALIDE','Approuvé','2024-11-07 10:00:00' WHERE NOT EXISTS (SELECT 1 FROM validation_history WHERE activity_id = @act_id AND validation_level = 'CHEF_DEPARTEMENT');
INSERT INTO validation_history (activity_id, actor_id, validation_level, decision, comment_text, decided_at) SELECT @act_id,@admin_id,'ADMINISTRATION','VALIDE','Validation finale','2024-11-09 14:00:00' WHERE NOT EXISTS (SELECT 1 FROM validation_history WHERE activity_id = @act_id AND validation_level = 'ADMINISTRATION');

-- ============================================================
-- SECTION 3 : CONGE + MISSION — enseignant.management@esprit.tn
-- ============================================================

-- 3-A Congé annuel (VALIDÉE_FINALE)
SET @act_id = (SELECT a.id FROM activities a JOIN availability_request_activities ar ON ar.activity_id = a.id WHERE a.user_id = @ens_mgmt_id AND ar.leave_type = 'ANNUEL' AND a.academic_year = '2025-2026' LIMIT 1);
INSERT INTO activities (user_id, activity_type, status, academic_year, created_at, updated_at) SELECT @ens_mgmt_id,'DISPONIBILITE','VALIDEE_FINALE','2025-2026','2025-11-05 09:00:00','2025-11-08 11:00:00' WHERE @act_id IS NULL;
SET @act_id = IF(@act_id IS NOT NULL, @act_id, LAST_INSERT_ID());
INSERT INTO availability_request_activities (activity_id, request_type, leave_type, mission_kind, title, start_date, end_date, reason, department_id, department_name, pedagogical_unit) SELECT @act_id,'CONGE','ANNUEL',NULL,'Demande de conge','2025-11-10','2025-11-14','Congé annuel réglementaire',@mgmt_id,'Management','' WHERE NOT EXISTS (SELECT 1 FROM availability_request_activities WHERE activity_id = @act_id);
INSERT INTO validation_history (activity_id, actor_id, validation_level, decision, comment_text, decided_at) SELECT @act_id,@chef_mgmt_id,'CHEF_DEPARTEMENT','VALIDE','Approuvé','2025-11-07 09:00:00' WHERE NOT EXISTS (SELECT 1 FROM validation_history WHERE activity_id = @act_id AND validation_level = 'CHEF_DEPARTEMENT');
INSERT INTO validation_history (activity_id, actor_id, validation_level, decision, comment_text, decided_at) SELECT @act_id,@admin_id,'ADMINISTRATION','VALIDE','Validation finale','2025-11-08 11:00:00' WHERE NOT EXISTS (SELECT 1 FROM validation_history WHERE activity_id = @act_id AND validation_level = 'ADMINISTRATION');

-- 3-B Congé sans solde (REJETÉE)
SET @act_id = (SELECT a.id FROM activities a JOIN availability_request_activities ar ON ar.activity_id = a.id WHERE a.user_id = @ens_mgmt_id AND ar.leave_type = 'SANS_SOLDE' AND a.academic_year = '2025-2026' LIMIT 1);
INSERT INTO activities (user_id, activity_type, status, academic_year, created_at, updated_at) SELECT @ens_mgmt_id,'DISPONIBILITE','REJETEE','2025-2026','2025-12-01 10:00:00','2025-12-03 09:00:00' WHERE @act_id IS NULL;
SET @act_id = IF(@act_id IS NOT NULL, @act_id, LAST_INSERT_ID());
INSERT INTO availability_request_activities (activity_id, request_type, leave_type, mission_kind, title, start_date, end_date, reason, department_id, department_name, pedagogical_unit) SELECT @act_id,'CONGE','SANS_SOLDE',NULL,'Demande de conge','2025-12-15','2025-12-20','Raisons personnelles',@mgmt_id,'Management','' WHERE NOT EXISTS (SELECT 1 FROM availability_request_activities WHERE activity_id = @act_id);
INSERT INTO validation_history (activity_id, actor_id, validation_level, decision, comment_text, decided_at) SELECT @act_id,@chef_mgmt_id,'CHEF_DEPARTEMENT','REJETE','Période chargée, congé non accordé','2025-12-03 09:00:00' WHERE NOT EXISTS (SELECT 1 FROM validation_history WHERE activity_id = @act_id AND validation_level = 'CHEF_DEPARTEMENT');

-- 3-C Mission conférence (VALIDÉE_FINALE)
SET @act_id = (SELECT a.id FROM activities a JOIN availability_request_activities ar ON ar.activity_id = a.id WHERE a.user_id = @ens_mgmt_id AND ar.mission_kind IS NOT NULL AND a.academic_year = '2025-2026' LIMIT 1);
INSERT INTO activities (user_id, activity_type, status, academic_year, created_at, updated_at) SELECT @ens_mgmt_id,'DISPONIBILITE','VALIDEE_FINALE','2025-2026','2026-02-10 09:00:00','2026-02-14 10:00:00' WHERE @act_id IS NULL;
SET @act_id = IF(@act_id IS NOT NULL, @act_id, LAST_INSERT_ID());
INSERT INTO availability_request_activities (activity_id, request_type, leave_type, mission_kind, title, start_date, end_date, reason, department_id, department_name, pedagogical_unit) SELECT @act_id,'MISSION',NULL,'CONFERENCE','Colloque international en management','2026-02-18','2026-02-20','Conférence internationale - Management stratégique',@mgmt_id,'Management','' WHERE NOT EXISTS (SELECT 1 FROM availability_request_activities WHERE activity_id = @act_id);
INSERT INTO validation_history (activity_id, actor_id, validation_level, decision, comment_text, decided_at) SELECT @act_id,@chef_mgmt_id,'CHEF_DEPARTEMENT','VALIDE','Approuvé','2026-02-12 09:00:00' WHERE NOT EXISTS (SELECT 1 FROM validation_history WHERE activity_id = @act_id AND validation_level = 'CHEF_DEPARTEMENT');
INSERT INTO validation_history (activity_id, actor_id, validation_level, decision, comment_text, decided_at) SELECT @act_id,@admin_id,'ADMINISTRATION','VALIDE','Validation finale','2026-02-14 10:00:00' WHERE NOT EXISTS (SELECT 1 FROM validation_history WHERE activity_id = @act_id AND validation_level = 'ADMINISTRATION');

-- 3-D Congé annuel 2024-2025 (historique)
SET @act_id = (SELECT a.id FROM activities a JOIN availability_request_activities ar ON ar.activity_id = a.id WHERE a.user_id = @ens_mgmt_id AND ar.leave_type = 'ANNUEL' AND a.academic_year = '2024-2025' LIMIT 1);
INSERT INTO activities (user_id, activity_type, status, academic_year, created_at, updated_at) SELECT @ens_mgmt_id,'DISPONIBILITE','VALIDEE_FINALE','2024-2025','2024-11-15 09:00:00','2024-11-19 14:00:00' WHERE @act_id IS NULL;
SET @act_id = IF(@act_id IS NOT NULL, @act_id, LAST_INSERT_ID());
INSERT INTO availability_request_activities (activity_id, request_type, leave_type, mission_kind, title, start_date, end_date, reason, department_id, department_name, pedagogical_unit) SELECT @act_id,'CONGE','ANNUEL',NULL,'Demande de conge','2024-11-18','2024-11-22','Congé annuel réglementaire',@mgmt_id,'Management','' WHERE NOT EXISTS (SELECT 1 FROM availability_request_activities WHERE activity_id = @act_id);
INSERT INTO validation_history (activity_id, actor_id, validation_level, decision, comment_text, decided_at) SELECT @act_id,@chef_mgmt_id,'CHEF_DEPARTEMENT','VALIDE','Approuvé','2024-11-17 10:00:00' WHERE NOT EXISTS (SELECT 1 FROM validation_history WHERE activity_id = @act_id AND validation_level = 'CHEF_DEPARTEMENT');
INSERT INTO validation_history (activity_id, actor_id, validation_level, decision, comment_text, decided_at) SELECT @act_id,@admin_id,'ADMINISTRATION','VALIDE','Validation finale','2024-11-19 14:00:00' WHERE NOT EXISTS (SELECT 1 FROM validation_history WHERE activity_id = @act_id AND validation_level = 'ADMINISTRATION');

-- ============================================================
-- SECTION 4 : CONGE + MISSION — enseignant.lacc@esprit.tn
-- ============================================================

-- 4-A Congé annuel (SOUMISE — en attente chef)
SET @act_id = (SELECT a.id FROM activities a JOIN availability_request_activities ar ON ar.activity_id = a.id WHERE a.user_id = @ens_lacc_id AND ar.leave_type = 'ANNUEL' AND a.academic_year = '2025-2026' LIMIT 1);
INSERT INTO activities (user_id, activity_type, status, academic_year, created_at, updated_at) SELECT @ens_lacc_id,'DISPONIBILITE','SOUMISE','2025-2026','2026-01-15 10:00:00','2026-01-15 10:00:00' WHERE @act_id IS NULL;
SET @act_id = IF(@act_id IS NOT NULL, @act_id, LAST_INSERT_ID());
INSERT INTO availability_request_activities (activity_id, request_type, leave_type, mission_kind, title, start_date, end_date, reason, department_id, department_name, pedagogical_unit) SELECT @act_id,'CONGE','ANNUEL',NULL,'Demande de conge','2026-01-26','2026-01-30','Congé annuel',@lacc_id,'LACC','' WHERE NOT EXISTS (SELECT 1 FROM availability_request_activities WHERE activity_id = @act_id);

-- 4-B Congé maladie (VALIDÉE_FINALE)
SET @act_id = (SELECT a.id FROM activities a JOIN availability_request_activities ar ON ar.activity_id = a.id WHERE a.user_id = @ens_lacc_id AND ar.leave_type = 'MALADIE' AND a.academic_year = '2025-2026' LIMIT 1);
INSERT INTO activities (user_id, activity_type, status, academic_year, created_at, updated_at) SELECT @ens_lacc_id,'DISPONIBILITE','VALIDEE_FINALE','2025-2026','2025-12-05 08:00:00','2025-12-08 15:00:00' WHERE @act_id IS NULL;
SET @act_id = IF(@act_id IS NOT NULL, @act_id, LAST_INSERT_ID());
INSERT INTO availability_request_activities (activity_id, request_type, leave_type, mission_kind, title, start_date, end_date, reason, department_id, department_name, pedagogical_unit) SELECT @act_id,'CONGE','MALADIE',NULL,'Demande de conge','2025-12-08','2025-12-10','Arrêt maladie, certificat médical fourni',@lacc_id,'LACC','' WHERE NOT EXISTS (SELECT 1 FROM availability_request_activities WHERE activity_id = @act_id);
INSERT INTO validation_history (activity_id, actor_id, validation_level, decision, comment_text, decided_at) SELECT @act_id,@chef_lacc_id,'CHEF_DEPARTEMENT','VALIDE','Approuvé','2025-12-07 10:00:00' WHERE NOT EXISTS (SELECT 1 FROM validation_history WHERE activity_id = @act_id AND validation_level = 'CHEF_DEPARTEMENT');
INSERT INTO validation_history (activity_id, actor_id, validation_level, decision, comment_text, decided_at) SELECT @act_id,@admin_id,'ADMINISTRATION','VALIDE','Validation finale','2025-12-08 15:00:00' WHERE NOT EXISTS (SELECT 1 FROM validation_history WHERE activity_id = @act_id AND validation_level = 'ADMINISTRATION');

-- 4-C Mission (VALIDÉE_DEPARTEMENT — en attente admin)
SET @act_id = (SELECT a.id FROM activities a JOIN availability_request_activities ar ON ar.activity_id = a.id WHERE a.user_id = @ens_lacc_id AND ar.mission_kind IS NOT NULL AND a.academic_year = '2025-2026' LIMIT 1);
INSERT INTO activities (user_id, activity_type, status, academic_year, created_at, updated_at) SELECT @ens_lacc_id,'DISPONIBILITE','VALIDEE_DEPARTEMENT','2025-2026','2026-03-08 09:00:00','2026-03-10 11:00:00' WHERE @act_id IS NULL;
SET @act_id = IF(@act_id IS NOT NULL, @act_id, LAST_INSERT_ID());
INSERT INTO availability_request_activities (activity_id, request_type, leave_type, mission_kind, title, start_date, end_date, reason, department_id, department_name, pedagogical_unit) SELECT @act_id,'MISSION',NULL,'CONFERENCE','Séminaire pédagogique LACC','2026-03-15','2026-03-16','Séminaire sur les méthodes pédagogiques',@lacc_id,'LACC','' WHERE NOT EXISTS (SELECT 1 FROM availability_request_activities WHERE activity_id = @act_id);
INSERT INTO validation_history (activity_id, actor_id, validation_level, decision, comment_text, decided_at) SELECT @act_id,@chef_lacc_id,'CHEF_DEPARTEMENT','VALIDE','Approuvé par le département','2026-03-10 11:00:00' WHERE NOT EXISTS (SELECT 1 FROM validation_history WHERE activity_id = @act_id AND validation_level = 'CHEF_DEPARTEMENT');

-- 4-D Congé annuel 2024-2025 (historique)
SET @act_id = (SELECT a.id FROM activities a JOIN availability_request_activities ar ON ar.activity_id = a.id WHERE a.user_id = @ens_lacc_id AND ar.leave_type = 'ANNUEL' AND a.academic_year = '2024-2025' LIMIT 1);
INSERT INTO activities (user_id, activity_type, status, academic_year, created_at, updated_at) SELECT @ens_lacc_id,'DISPONIBILITE','VALIDEE_FINALE','2024-2025','2024-11-20 09:00:00','2024-11-25 14:00:00' WHERE @act_id IS NULL;
SET @act_id = IF(@act_id IS NOT NULL, @act_id, LAST_INSERT_ID());
INSERT INTO availability_request_activities (activity_id, request_type, leave_type, mission_kind, title, start_date, end_date, reason, department_id, department_name, pedagogical_unit) SELECT @act_id,'CONGE','ANNUEL',NULL,'Demande de conge','2024-11-25','2024-11-29','Congé annuel réglementaire',@lacc_id,'LACC','' WHERE NOT EXISTS (SELECT 1 FROM availability_request_activities WHERE activity_id = @act_id);
INSERT INTO validation_history (activity_id, actor_id, validation_level, decision, comment_text, decided_at) SELECT @act_id,@chef_lacc_id,'CHEF_DEPARTEMENT','VALIDE','Approuvé','2024-11-22 10:00:00' WHERE NOT EXISTS (SELECT 1 FROM validation_history WHERE activity_id = @act_id AND validation_level = 'CHEF_DEPARTEMENT');
INSERT INTO validation_history (activity_id, actor_id, validation_level, decision, comment_text, decided_at) SELECT @act_id,@admin_id,'ADMINISTRATION','VALIDE','Validation finale','2024-11-25 14:00:00' WHERE NOT EXISTS (SELECT 1 FROM validation_history WHERE activity_id = @act_id AND validation_level = 'ADMINISTRATION');

-- ============================================================
-- SECTION 5 : CONGE en masse — enseignants démo (tous déps)
-- La page "Suivi absences" utilise users.department_id comme fallback
-- ============================================================
DROP TEMPORARY TABLE IF EXISTS tmp_abs;
CREATE TEMPORARY TABLE tmp_abs AS
SELECT u.id AS user_id, u.department_id,
       ROW_NUMBER() OVER (ORDER BY u.id) AS rn
FROM users u
WHERE u.role = 'ENSEIGNANT'
  AND u.is_active = 1
  AND u.email REGEXP '^teacher\\.(permanent|vacataire)\\.[0-9]+@esprit\\.tn$'
  AND NOT EXISTS (
    SELECT 1 FROM activities a
    WHERE a.user_id = u.id AND a.activity_type = 'DISPONIBILITE' AND a.academic_year = '2025-2026'
  );

-- Activités parent (avec statuts variés pour KPIs réalistes)
INSERT INTO activities (user_id, activity_type, status, academic_year, created_at, updated_at)
SELECT t.user_id, 'DISPONIBILITE',
  CASE MOD(t.rn, 6)
    WHEN 0 THEN 'REJETEE'
    WHEN 1 THEN 'SOUMISE'
    WHEN 2 THEN 'VALIDEE_DEPARTEMENT'
    ELSE 'VALIDEE_FINALE'
  END,
  '2025-2026',
  DATE_ADD('2025-11-01', INTERVAL t.rn DAY),
  DATE_ADD('2025-11-03', INTERVAL t.rn DAY)
FROM tmp_abs t;

-- Activités enfant availability_request_activities (types variés)
INSERT INTO availability_request_activities
  (activity_id, request_type, leave_type, mission_kind, title, start_date, end_date, reason, department_id, department_name, pedagogical_unit)
SELECT
  a.id, 'CONGE',
  CASE MOD(t.rn, 4) WHEN 0 THEN 'MALADIE' WHEN 1 THEN 'EXCEPTIONNEL' WHEN 2 THEN 'SANS_SOLDE' ELSE 'ANNUEL' END,
  NULL, 'Demande de conge',
  DATE_ADD('2025-11-05', INTERVAL t.rn DAY),
  DATE_ADD('2025-11-09', INTERVAL t.rn DAY),
  'Congé enseignant démo', t.department_id, d.name, ''
FROM activities a
JOIN tmp_abs t ON t.user_id = a.user_id
JOIN departments d ON d.id = t.department_id
WHERE a.activity_type = 'DISPONIBILITE' AND a.academic_year = '2025-2026'
  AND NOT EXISTS (SELECT 1 FROM availability_request_activities ar WHERE ar.activity_id = a.id);

-- Historique validation pour les activités validées (chef de chaque département)
INSERT INTO validation_history (activity_id, actor_id, validation_level, decision, comment_text, decided_at)
SELECT a.id,
  (SELECT id FROM users WHERE role = 'CHEF_DEPARTEMENT' AND department_id = u.department_id LIMIT 1),
  'CHEF_DEPARTEMENT',
  CASE a.status WHEN 'REJETEE' THEN 'REJETE' ELSE 'VALIDE' END,
  CASE a.status WHEN 'REJETEE' THEN 'Congé non accordé' ELSE 'Approuvé' END,
  DATE_ADD(a.created_at, INTERVAL 2 DAY)
FROM activities a JOIN users u ON u.id = a.user_id
WHERE a.activity_type = 'DISPONIBILITE' AND a.academic_year = '2025-2026'
  AND a.status IN ('VALIDEE_DEPARTEMENT','VALIDEE_FINALE','REJETEE')
  AND u.email REGEXP '^teacher\\.(permanent|vacataire)\\.[0-9]+@esprit\\.tn$'
  AND (SELECT id FROM users WHERE role = 'CHEF_DEPARTEMENT' AND department_id = u.department_id LIMIT 1) IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM validation_history vh WHERE vh.activity_id = a.id AND vh.validation_level = 'CHEF_DEPARTEMENT');

INSERT INTO validation_history (activity_id, actor_id, validation_level, decision, comment_text, decided_at)
SELECT a.id, @admin_id, 'ADMINISTRATION', 'VALIDE', 'Validation finale', DATE_ADD(a.created_at, INTERVAL 4 DAY)
FROM activities a JOIN users u ON u.id = a.user_id
WHERE a.activity_type = 'DISPONIBILITE' AND a.academic_year = '2025-2026'
  AND a.status = 'VALIDEE_FINALE'
  AND u.email REGEXP '^teacher\\.(permanent|vacataire)\\.[0-9]+@esprit\\.tn$'
  AND NOT EXISTS (SELECT 1 FROM validation_history vh WHERE vh.activity_id = a.id AND vh.validation_level = 'ADMINISTRATION');

DROP TEMPORARY TABLE IF EXISTS tmp_abs;

-- ============================================================
-- SECTION 6 : CONGE historique 2024-2025 — enseignants démo
-- (Pour que les graphiques historiques absences fonctionnent)
-- ============================================================
DROP TEMPORARY TABLE IF EXISTS tmp_abs_hist;
CREATE TEMPORARY TABLE tmp_abs_hist AS
SELECT u.id AS user_id, u.department_id,
       ROW_NUMBER() OVER (ORDER BY u.id) AS rn
FROM users u
WHERE u.role = 'ENSEIGNANT'
  AND u.is_active = 1
  AND u.email REGEXP '^teacher\\.(permanent|vacataire)\\.[0-9]+@esprit\\.tn$'
  AND NOT EXISTS (
    SELECT 1 FROM activities a
    WHERE a.user_id = u.id AND a.activity_type = 'DISPONIBILITE' AND a.academic_year = '2024-2025'
  );

INSERT INTO activities (user_id, activity_type, status, academic_year, created_at, updated_at)
SELECT t.user_id, 'DISPONIBILITE', 'VALIDEE_FINALE', '2024-2025',
  DATE_ADD('2024-11-01', INTERVAL t.rn DAY),
  DATE_ADD('2024-11-04', INTERVAL t.rn DAY)
FROM tmp_abs_hist t;

INSERT INTO availability_request_activities
  (activity_id, request_type, leave_type, mission_kind, title, start_date, end_date, reason, department_id, department_name, pedagogical_unit)
SELECT a.id, 'CONGE', 'ANNUEL', NULL, 'Demande de conge',
  DATE_ADD('2024-11-05', INTERVAL t.rn DAY),
  DATE_ADD('2024-11-09', INTERVAL t.rn DAY),
  'Congé annuel 2024-2025', t.department_id, d.name, ''
FROM activities a
JOIN tmp_abs_hist t ON t.user_id = a.user_id
JOIN departments d ON d.id = t.department_id
WHERE a.activity_type = 'DISPONIBILITE' AND a.academic_year = '2024-2025'
  AND NOT EXISTS (SELECT 1 FROM availability_request_activities ar WHERE ar.activity_id = a.id);

INSERT INTO validation_history (activity_id, actor_id, validation_level, decision, comment_text, decided_at)
SELECT a.id,
  (SELECT id FROM users WHERE role = 'CHEF_DEPARTEMENT' AND department_id = u.department_id LIMIT 1),
  'CHEF_DEPARTEMENT', 'VALIDE', 'Approuvé', DATE_ADD(a.created_at, INTERVAL 2 DAY)
FROM activities a JOIN users u ON u.id = a.user_id
WHERE a.activity_type = 'DISPONIBILITE' AND a.academic_year = '2024-2025'
  AND a.status = 'VALIDEE_FINALE'
  AND u.email REGEXP '^teacher\\.(permanent|vacataire)\\.[0-9]+@esprit\\.tn$'
  AND (SELECT id FROM users WHERE role = 'CHEF_DEPARTEMENT' AND department_id = u.department_id LIMIT 1) IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM validation_history vh WHERE vh.activity_id = a.id AND vh.validation_level = 'CHEF_DEPARTEMENT');

INSERT INTO validation_history (activity_id, actor_id, validation_level, decision, comment_text, decided_at)
SELECT a.id, @admin_id, 'ADMINISTRATION', 'VALIDE', 'Validation finale', DATE_ADD(a.created_at, INTERVAL 4 DAY)
FROM activities a JOIN users u ON u.id = a.user_id
WHERE a.activity_type = 'DISPONIBILITE' AND a.academic_year = '2024-2025'
  AND a.status = 'VALIDEE_FINALE'
  AND u.email REGEXP '^teacher\\.(permanent|vacataire)\\.[0-9]+@esprit\\.tn$'
  AND NOT EXISTS (SELECT 1 FROM validation_history vh WHERE vh.activity_id = a.id AND vh.validation_level = 'ADMINISTRATION');

DROP TEMPORARY TABLE IF EXISTS tmp_abs_hist;

-- ============================================================
-- SECTION 7 : Décisions administratives (page Historique admin)
-- Pour l'historique des évaluations annuelles 2024-2025
-- ============================================================

-- Décisions pour les 4 vrais enseignants — 2024-2025
INSERT INTO administrative_decisions
  (teacher_id, period_label, validated_activities, validated_teaching_points, absence_days,
   activity_type_points, calculated_bonus, calculated_promotion_points,
   decision_status, decision_comment, decided_by_id, decided_at, created_at, updated_at)
SELECT
  u.id, '2024-2025',
  COALESCE((SELECT COUNT(*) FROM activities a WHERE a.user_id = u.id AND a.academic_year = '2024-2025' AND a.status = 'VALIDEE_FINALE'), 0),
  COALESCE((SELECT SUM(COALESCE(ta.completed_hours, 0)) FROM activities a JOIN teaching_activities ta ON ta.activity_id = a.id WHERE a.user_id = u.id AND a.academic_year = '2024-2025' AND a.status = 'VALIDEE_FINALE'), 0.00),
  COALESCE((SELECT SUM(DATEDIFF(ar.end_date, ar.start_date) + 1) FROM activities a JOIN availability_request_activities ar ON ar.activity_id = a.id WHERE a.user_id = u.id AND a.academic_year = '2024-2025' AND a.status IN ('VALIDEE_DEPARTEMENT','VALIDEE_FINALE') AND ar.request_type = 'CONGE'), 0),
  COALESCE((SELECT COUNT(*) * 5.00 FROM activities a WHERE a.user_id = u.id AND a.academic_year = '2024-2025' AND a.status = 'VALIDEE_FINALE'), 0.00),
  0.00, 0.00,
  'VALIDE', 'Évaluation annuelle 2024-2025 validée', @admin_id,
  DATE_ADD('2025-06-15', INTERVAL (ROW_NUMBER() OVER (ORDER BY u.id)) MINUTE),
  DATE_ADD('2025-06-15', INTERVAL (ROW_NUMBER() OVER (ORDER BY u.id)) MINUTE),
  DATE_ADD('2025-06-15', INTERVAL (ROW_NUMBER() OVER (ORDER BY u.id)) MINUTE)
FROM users u
WHERE u.email IN (
  'enseignant.ima@esprit.tn',
  'enseignant2.ima@esprit.tn',
  'enseignant.management@esprit.tn',
  'enseignant.lacc@esprit.tn'
)
AND NOT EXISTS (
  SELECT 1 FROM administrative_decisions ad WHERE ad.teacher_id = u.id AND ad.period_label = '2024-2025'
);

-- Décisions pour une sélection d'enseignants démo — 2024-2025
INSERT INTO administrative_decisions
  (teacher_id, period_label, validated_activities, validated_teaching_points, absence_days,
   activity_type_points, calculated_bonus, calculated_promotion_points,
   decision_status, decision_comment, decided_by_id, decided_at, created_at, updated_at)
SELECT
  u.id, '2024-2025',
  COALESCE((SELECT COUNT(*) FROM activities a WHERE a.user_id = u.id AND a.academic_year = '2024-2025' AND a.status = 'VALIDEE_FINALE'), 0),
  0.00, 5, 35.00, 0.00, 0.00,
  CASE MOD(ROW_NUMBER() OVER (ORDER BY u.id), 3) WHEN 0 THEN 'REJETE' ELSE 'VALIDE' END,
  CASE MOD(ROW_NUMBER() OVER (ORDER BY u.id), 3) WHEN 0 THEN 'Dossier incomplet' ELSE 'Évaluation annuelle validée' END,
  @admin_id,
  DATE_ADD('2025-06-20', INTERVAL (ROW_NUMBER() OVER (ORDER BY u.id)) MINUTE),
  DATE_ADD('2025-06-20', INTERVAL (ROW_NUMBER() OVER (ORDER BY u.id)) MINUTE),
  DATE_ADD('2025-06-20', INTERVAL (ROW_NUMBER() OVER (ORDER BY u.id)) MINUTE)
FROM users u
WHERE u.role = 'ENSEIGNANT' AND u.is_active = 1
  AND u.email REGEXP '^teacher\\.permanent\\.(00[1-9]|0[1-2][0-9])@esprit\\.tn$'
  AND NOT EXISTS (
    SELECT 1 FROM administrative_decisions ad WHERE ad.teacher_id = u.id AND ad.period_label = '2024-2025'
  );

-- ============================================================
-- SECTION 8 : RAPPORTS — ENSEIGNANT voit INDIVIDUEL_ANNUEL
-- (visible si target_user_id = enseignant.id OU generated_by = enseignant.id)
-- ============================================================

-- Rapports pour les 4 vrais enseignants
INSERT INTO reports (generated_by, target_user_id, department_id, report_type, report_format, period_label, file_path, generated_at)
SELECT @chef_ima_id, @ens_ima1_id, @ima_id, 'INDIVIDUEL_ANNUEL', 'PDF', '2025-2026', NULL, '2026-03-15 10:00:00'
WHERE NOT EXISTS (SELECT 1 FROM reports WHERE target_user_id = @ens_ima1_id AND report_type = 'INDIVIDUEL_ANNUEL' AND period_label = '2025-2026' AND report_format = 'PDF');

INSERT INTO reports (generated_by, target_user_id, department_id, report_type, report_format, period_label, file_path, generated_at)
SELECT @chef_ima_id, @ens_ima1_id, @ima_id, 'INDIVIDUEL_ANNUEL', 'EXCEL', '2025-2026', NULL, '2026-03-15 10:30:00'
WHERE NOT EXISTS (SELECT 1 FROM reports WHERE target_user_id = @ens_ima1_id AND report_type = 'INDIVIDUEL_ANNUEL' AND period_label = '2025-2026' AND report_format = 'EXCEL');

INSERT INTO reports (generated_by, target_user_id, department_id, report_type, report_format, period_label, file_path, generated_at)
SELECT @chef_ima_id, @ens_ima1_id, @ima_id, 'INDIVIDUEL_ANNUEL', 'PDF', '2024-2025', NULL, '2025-06-20 09:00:00'
WHERE NOT EXISTS (SELECT 1 FROM reports WHERE target_user_id = @ens_ima1_id AND report_type = 'INDIVIDUEL_ANNUEL' AND period_label = '2024-2025');

INSERT INTO reports (generated_by, target_user_id, department_id, report_type, report_format, period_label, file_path, generated_at)
SELECT @chef_ima_id, @ens_ima2_id, @ima_id, 'INDIVIDUEL_ANNUEL', 'PDF', '2025-2026', NULL, '2026-03-15 11:00:00'
WHERE NOT EXISTS (SELECT 1 FROM reports WHERE target_user_id = @ens_ima2_id AND report_type = 'INDIVIDUEL_ANNUEL' AND period_label = '2025-2026' AND report_format = 'PDF');

INSERT INTO reports (generated_by, target_user_id, department_id, report_type, report_format, period_label, file_path, generated_at)
SELECT @chef_ima_id, @ens_ima2_id, @ima_id, 'INDIVIDUEL_ANNUEL', 'EXCEL', '2025-2026', NULL, '2026-03-15 11:15:00'
WHERE NOT EXISTS (SELECT 1 FROM reports WHERE target_user_id = @ens_ima2_id AND report_type = 'INDIVIDUEL_ANNUEL' AND period_label = '2025-2026' AND report_format = 'EXCEL');

INSERT INTO reports (generated_by, target_user_id, department_id, report_type, report_format, period_label, file_path, generated_at)
SELECT @chef_ima_id, @ens_ima2_id, @ima_id, 'INDIVIDUEL_ANNUEL', 'PDF', '2024-2025', NULL, '2025-06-21 09:00:00'
WHERE NOT EXISTS (SELECT 1 FROM reports WHERE target_user_id = @ens_ima2_id AND report_type = 'INDIVIDUEL_ANNUEL' AND period_label = '2024-2025');

INSERT INTO reports (generated_by, target_user_id, department_id, report_type, report_format, period_label, file_path, generated_at)
SELECT @chef_mgmt_id, @ens_mgmt_id, @mgmt_id, 'INDIVIDUEL_ANNUEL', 'PDF', '2025-2026', NULL, '2026-03-16 10:00:00'
WHERE NOT EXISTS (SELECT 1 FROM reports WHERE target_user_id = @ens_mgmt_id AND report_type = 'INDIVIDUEL_ANNUEL' AND period_label = '2025-2026' AND report_format = 'PDF');

INSERT INTO reports (generated_by, target_user_id, department_id, report_type, report_format, period_label, file_path, generated_at)
SELECT @chef_mgmt_id, @ens_mgmt_id, @mgmt_id, 'INDIVIDUEL_ANNUEL', 'EXCEL', '2025-2026', NULL, '2026-03-16 10:20:00'
WHERE NOT EXISTS (SELECT 1 FROM reports WHERE target_user_id = @ens_mgmt_id AND report_type = 'INDIVIDUEL_ANNUEL' AND period_label = '2025-2026' AND report_format = 'EXCEL');

INSERT INTO reports (generated_by, target_user_id, department_id, report_type, report_format, period_label, file_path, generated_at)
SELECT @chef_mgmt_id, @ens_mgmt_id, @mgmt_id, 'INDIVIDUEL_ANNUEL', 'PDF', '2024-2025', NULL, '2025-06-22 09:00:00'
WHERE NOT EXISTS (SELECT 1 FROM reports WHERE target_user_id = @ens_mgmt_id AND report_type = 'INDIVIDUEL_ANNUEL' AND period_label = '2024-2025');

INSERT INTO reports (generated_by, target_user_id, department_id, report_type, report_format, period_label, file_path, generated_at)
SELECT @chef_lacc_id, @ens_lacc_id, @lacc_id, 'INDIVIDUEL_ANNUEL', 'PDF', '2025-2026', NULL, '2026-03-17 10:00:00'
WHERE NOT EXISTS (SELECT 1 FROM reports WHERE target_user_id = @ens_lacc_id AND report_type = 'INDIVIDUEL_ANNUEL' AND period_label = '2025-2026' AND report_format = 'PDF');

INSERT INTO reports (generated_by, target_user_id, department_id, report_type, report_format, period_label, file_path, generated_at)
SELECT @chef_lacc_id, @ens_lacc_id, @lacc_id, 'INDIVIDUEL_ANNUEL', 'EXCEL', '2025-2026', NULL, '2026-03-17 10:20:00'
WHERE NOT EXISTS (SELECT 1 FROM reports WHERE target_user_id = @ens_lacc_id AND report_type = 'INDIVIDUEL_ANNUEL' AND period_label = '2025-2026' AND report_format = 'EXCEL');

INSERT INTO reports (generated_by, target_user_id, department_id, report_type, report_format, period_label, file_path, generated_at)
SELECT @chef_lacc_id, @ens_lacc_id, @lacc_id, 'INDIVIDUEL_ANNUEL', 'PDF', '2024-2025', NULL, '2025-06-23 09:00:00'
WHERE NOT EXISTS (SELECT 1 FROM reports WHERE target_user_id = @ens_lacc_id AND report_type = 'INDIVIDUEL_ANNUEL' AND period_label = '2024-2025');

-- Rapports individuels pour enseignants démo (15 premiers par ordre d'id)
INSERT INTO reports (generated_by, target_user_id, department_id, report_type, report_format, period_label, file_path, generated_at)
SELECT
  (SELECT id FROM users WHERE role = 'CHEF_DEPARTEMENT' AND department_id = u.department_id LIMIT 1),
  u.id, u.department_id, 'INDIVIDUEL_ANNUEL', 'PDF', '2025-2026', NULL,
  DATE_ADD('2026-03-20', INTERVAL ROW_NUMBER() OVER (ORDER BY u.id) HOUR)
FROM users u
WHERE u.role = 'ENSEIGNANT'
  AND u.email REGEXP '^teacher\\.permanent\\.0[0-1][0-9]@esprit\\.tn$'
  AND (SELECT id FROM users WHERE role = 'CHEF_DEPARTEMENT' AND department_id = u.department_id LIMIT 1) IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM reports r WHERE r.target_user_id = u.id AND r.report_type = 'INDIVIDUEL_ANNUEL' AND r.period_label = '2025-2026');

-- ============================================================
-- SECTION 9 : RAPPORTS — CHEF_DEPARTEMENT voit DEPARTEMENTAL
-- (visible si department_id = chef.department AND report_type = DEPARTEMENTAL)
-- ============================================================

-- Chef IMA
INSERT INTO reports (generated_by, target_user_id, department_id, report_type, report_format, period_label, file_path, generated_at)
SELECT @chef_ima_id, NULL, @ima_id, 'DEPARTEMENTAL', 'PDF', '2025-2026', NULL, '2026-04-01 09:00:00'
WHERE NOT EXISTS (SELECT 1 FROM reports WHERE generated_by = @chef_ima_id AND department_id = @ima_id AND report_type = 'DEPARTEMENTAL' AND period_label = '2025-2026' AND report_format = 'PDF');

INSERT INTO reports (generated_by, target_user_id, department_id, report_type, report_format, period_label, file_path, generated_at)
SELECT @chef_ima_id, NULL, @ima_id, 'DEPARTEMENTAL', 'EXCEL', '2025-2026', NULL, '2026-04-01 09:30:00'
WHERE NOT EXISTS (SELECT 1 FROM reports WHERE generated_by = @chef_ima_id AND department_id = @ima_id AND report_type = 'DEPARTEMENTAL' AND period_label = '2025-2026' AND report_format = 'EXCEL');

INSERT INTO reports (generated_by, target_user_id, department_id, report_type, report_format, period_label, file_path, generated_at)
SELECT @chef_ima_id, NULL, @ima_id, 'DEPARTEMENTAL', 'PDF', '2024-2025', NULL, '2025-07-01 09:00:00'
WHERE NOT EXISTS (SELECT 1 FROM reports WHERE generated_by = @chef_ima_id AND department_id = @ima_id AND report_type = 'DEPARTEMENTAL' AND period_label = '2024-2025');

INSERT INTO reports (generated_by, target_user_id, department_id, report_type, report_format, period_label, file_path, generated_at)
SELECT @chef_ima_id, NULL, @ima_id, 'DEPARTEMENTAL', 'PDF', '2023-2024', NULL, '2024-07-01 09:00:00'
WHERE NOT EXISTS (SELECT 1 FROM reports WHERE generated_by = @chef_ima_id AND department_id = @ima_id AND report_type = 'DEPARTEMENTAL' AND period_label = '2023-2024');

-- Chef Management
INSERT INTO reports (generated_by, target_user_id, department_id, report_type, report_format, period_label, file_path, generated_at)
SELECT @chef_mgmt_id, NULL, @mgmt_id, 'DEPARTEMENTAL', 'PDF', '2025-2026', NULL, '2026-04-02 09:00:00'
WHERE NOT EXISTS (SELECT 1 FROM reports WHERE generated_by = @chef_mgmt_id AND department_id = @mgmt_id AND report_type = 'DEPARTEMENTAL' AND period_label = '2025-2026' AND report_format = 'PDF');

INSERT INTO reports (generated_by, target_user_id, department_id, report_type, report_format, period_label, file_path, generated_at)
SELECT @chef_mgmt_id, NULL, @mgmt_id, 'DEPARTEMENTAL', 'EXCEL', '2025-2026', NULL, '2026-04-02 09:30:00'
WHERE NOT EXISTS (SELECT 1 FROM reports WHERE generated_by = @chef_mgmt_id AND department_id = @mgmt_id AND report_type = 'DEPARTEMENTAL' AND period_label = '2025-2026' AND report_format = 'EXCEL');

INSERT INTO reports (generated_by, target_user_id, department_id, report_type, report_format, period_label, file_path, generated_at)
SELECT @chef_mgmt_id, NULL, @mgmt_id, 'DEPARTEMENTAL', 'PDF', '2024-2025', NULL, '2025-07-02 09:00:00'
WHERE NOT EXISTS (SELECT 1 FROM reports WHERE generated_by = @chef_mgmt_id AND department_id = @mgmt_id AND report_type = 'DEPARTEMENTAL' AND period_label = '2024-2025');

-- Chef LACC
INSERT INTO reports (generated_by, target_user_id, department_id, report_type, report_format, period_label, file_path, generated_at)
SELECT @chef_lacc_id, NULL, @lacc_id, 'DEPARTEMENTAL', 'PDF', '2025-2026', NULL, '2026-04-03 09:00:00'
WHERE NOT EXISTS (SELECT 1 FROM reports WHERE generated_by = @chef_lacc_id AND department_id = @lacc_id AND report_type = 'DEPARTEMENTAL' AND period_label = '2025-2026' AND report_format = 'PDF');

INSERT INTO reports (generated_by, target_user_id, department_id, report_type, report_format, period_label, file_path, generated_at)
SELECT @chef_lacc_id, NULL, @lacc_id, 'DEPARTEMENTAL', 'EXCEL', '2025-2026', NULL, '2026-04-03 09:30:00'
WHERE NOT EXISTS (SELECT 1 FROM reports WHERE generated_by = @chef_lacc_id AND department_id = @lacc_id AND report_type = 'DEPARTEMENTAL' AND period_label = '2025-2026' AND report_format = 'EXCEL');

INSERT INTO reports (generated_by, target_user_id, department_id, report_type, report_format, period_label, file_path, generated_at)
SELECT @chef_lacc_id, NULL, @lacc_id, 'DEPARTEMENTAL', 'PDF', '2024-2025', NULL, '2025-07-03 09:00:00'
WHERE NOT EXISTS (SELECT 1 FROM reports WHERE generated_by = @chef_lacc_id AND department_id = @lacc_id AND report_type = 'DEPARTEMENTAL' AND period_label = '2024-2025');

-- ============================================================
-- SECTION 10 : RAPPORTS — ADMINISTRATION + SUPER_ADMIN
-- isAdministrationVisibleReport() : INSTITUTIONNEL + PRIME_PERFORMANCE uniquement
-- ============================================================

INSERT INTO reports (generated_by, target_user_id, department_id, report_type, report_format, period_label, file_path, generated_at)
SELECT @admin_id, NULL, NULL, 'INSTITUTIONNEL', 'PDF', '2025-2026', NULL, '2026-04-10 10:00:00'
WHERE NOT EXISTS (SELECT 1 FROM reports WHERE generated_by = @admin_id AND report_type = 'INSTITUTIONNEL' AND period_label = '2025-2026' AND report_format = 'PDF');

INSERT INTO reports (generated_by, target_user_id, department_id, report_type, report_format, period_label, file_path, generated_at)
SELECT @admin_id, NULL, NULL, 'INSTITUTIONNEL', 'EXCEL', '2025-2026', NULL, '2026-04-10 10:30:00'
WHERE NOT EXISTS (SELECT 1 FROM reports WHERE generated_by = @admin_id AND report_type = 'INSTITUTIONNEL' AND period_label = '2025-2026' AND report_format = 'EXCEL');

INSERT INTO reports (generated_by, target_user_id, department_id, report_type, report_format, period_label, file_path, generated_at)
SELECT @admin_id, NULL, NULL, 'PRIME_PERFORMANCE', 'PDF', '2025-2026', NULL, '2026-04-11 10:00:00'
WHERE NOT EXISTS (SELECT 1 FROM reports WHERE generated_by = @admin_id AND report_type = 'PRIME_PERFORMANCE' AND period_label = '2025-2026' AND report_format = 'PDF');

INSERT INTO reports (generated_by, target_user_id, department_id, report_type, report_format, period_label, file_path, generated_at)
SELECT @admin_id, NULL, NULL, 'PRIME_PERFORMANCE', 'EXCEL', '2025-2026', NULL, '2026-04-11 10:30:00'
WHERE NOT EXISTS (SELECT 1 FROM reports WHERE generated_by = @admin_id AND report_type = 'PRIME_PERFORMANCE' AND period_label = '2025-2026' AND report_format = 'EXCEL');

INSERT INTO reports (generated_by, target_user_id, department_id, report_type, report_format, period_label, file_path, generated_at)
SELECT @admin_id, NULL, NULL, 'INSTITUTIONNEL', 'PDF', '2024-2025', NULL, '2025-07-10 10:00:00'
WHERE NOT EXISTS (SELECT 1 FROM reports WHERE generated_by = @admin_id AND report_type = 'INSTITUTIONNEL' AND period_label = '2024-2025' AND report_format = 'PDF');

INSERT INTO reports (generated_by, target_user_id, department_id, report_type, report_format, period_label, file_path, generated_at)
SELECT @admin_id, NULL, NULL, 'PRIME_PERFORMANCE', 'PDF', '2024-2025', NULL, '2025-07-12 10:00:00'
WHERE NOT EXISTS (SELECT 1 FROM reports WHERE generated_by = @admin_id AND report_type = 'PRIME_PERFORMANCE' AND period_label = '2024-2025' AND report_format = 'PDF');

INSERT INTO reports (generated_by, target_user_id, department_id, report_type, report_format, period_label, file_path, generated_at)
SELECT @admin_id, NULL, NULL, 'PROMOTION_ACADEMIQUE', 'PDF', '2024-2025', NULL, '2025-07-15 10:00:00'
WHERE NOT EXISTS (SELECT 1 FROM reports WHERE generated_by = @admin_id AND report_type = 'PROMOTION_ACADEMIQUE' AND period_label = '2024-2025');

INSERT INTO reports (generated_by, target_user_id, department_id, report_type, report_format, period_label, file_path, generated_at)
SELECT @admin_id, NULL, NULL, 'INSTITUTIONNEL', 'PDF', '2023-2024', NULL, '2024-07-10 10:00:00'
WHERE NOT EXISTS (SELECT 1 FROM reports WHERE generated_by = @admin_id AND report_type = 'INSTITUTIONNEL' AND period_label = '2023-2024' AND report_format = 'PDF');

INSERT INTO reports (generated_by, target_user_id, department_id, report_type, report_format, period_label, file_path, generated_at)
SELECT @admin_id, NULL, NULL, 'PRIME_PERFORMANCE', 'PDF', '2023-2024', NULL, '2024-07-12 10:00:00'
WHERE NOT EXISTS (SELECT 1 FROM reports WHERE generated_by = @admin_id AND report_type = 'PRIME_PERFORMANCE' AND period_label = '2023-2024' AND report_format = 'PDF');

-- SUPER_ADMIN (voit aussi INSTITUTIONNEL + PRIME_PERFORMANCE)
INSERT INTO reports (generated_by, target_user_id, department_id, report_type, report_format, period_label, file_path, generated_at)
SELECT @super_id, NULL, NULL, 'INSTITUTIONNEL', 'PDF', '2022-2023', NULL, '2023-07-10 10:00:00'
WHERE NOT EXISTS (SELECT 1 FROM reports WHERE generated_by = @super_id AND report_type = 'INSTITUTIONNEL' AND period_label = '2022-2023');

INSERT INTO reports (generated_by, target_user_id, department_id, report_type, report_format, period_label, file_path, generated_at)
SELECT @super_id, NULL, NULL, 'PRIME_PERFORMANCE', 'EXCEL', '2022-2023', NULL, '2023-07-11 10:00:00'
WHERE NOT EXISTS (SELECT 1 FROM reports WHERE generated_by = @super_id AND report_type = 'PRIME_PERFORMANCE' AND period_label = '2022-2023');
