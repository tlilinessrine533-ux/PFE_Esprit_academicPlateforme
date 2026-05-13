USE pfe_academic_platform;

/*
  Removes only generated teachers created by seed-dashboard-teachers-70.sql
  Patterns:
    - teacher.permanent.XXX@esprit.tn
    - teacher.vacataire.XXX@esprit.tn
    - teacher.demo.XXX@esprit.tn (legacy)
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

SELECT
  COUNT(*) AS remaining_demo_teachers
FROM users
WHERE email LIKE 'teacher.demo.%@esprit.tn'
   OR email LIKE 'teacher.permanent.%@esprit.tn'
   OR email LIKE 'teacher.vacataire.%@esprit.tn';
