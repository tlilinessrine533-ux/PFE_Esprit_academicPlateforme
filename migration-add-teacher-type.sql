USE pfe_academic_platform;

/*
  Adds explicit teacher_type business field on users:
    - PERMANENT
    - VACATAIRE

  Safe to execute multiple times.
*/

SET @teacher_type_column_exists := (
  SELECT COUNT(*)
  FROM information_schema.columns
  WHERE table_schema = DATABASE()
    AND table_name = 'users'
    AND column_name = 'teacher_type'
);

SET @add_teacher_type_sql := IF(
  @teacher_type_column_exists = 0,
  'ALTER TABLE users ADD COLUMN teacher_type VARCHAR(20) NULL AFTER role',
  'SELECT 1'
);

PREPARE stmt_add_teacher_type FROM @add_teacher_type_sql;
EXECUTE stmt_add_teacher_type;
DEALLOCATE PREPARE stmt_add_teacher_type;

UPDATE users
SET teacher_type = CASE
  WHEN role = 'ENSEIGNANT' THEN CASE
    WHEN teacher_type IS NULL OR TRIM(teacher_type) = '' THEN 'PERMANENT'
    WHEN UPPER(TRIM(teacher_type)) = 'VACATAIRE' THEN 'VACATAIRE'
    WHEN UPPER(TRIM(teacher_type)) = 'PERMANENT' THEN 'PERMANENT'
    ELSE 'PERMANENT'
  END
  ELSE NULL
END;

SELECT
  role,
  teacher_type,
  COUNT(*) AS total
FROM users
GROUP BY role, teacher_type
ORDER BY role, teacher_type;
