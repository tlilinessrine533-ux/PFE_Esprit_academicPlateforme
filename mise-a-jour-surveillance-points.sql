USE pfe_academic_platform;

ALTER TABLE exam_surveillance_activities
  ADD COLUMN IF NOT EXISTS session_day ENUM('LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI')
    NOT NULL DEFAULT 'LUNDI',
  ADD COLUMN IF NOT EXISTS session_points DECIMAL(4,2)
    NOT NULL DEFAULT 1.00;

UPDATE exam_surveillance_activities
SET session_points = CASE
  WHEN session_day = 'SAMEDI' THEN 2.00
  ELSE 1.00
END;
