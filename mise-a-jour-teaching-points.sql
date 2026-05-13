USE pfe_academic_platform;

ALTER TABLE teaching_activities
  ADD COLUMN IF NOT EXISTS new_course_hours DECIMAL(6,2) NOT NULL DEFAULT 0.00 AFTER completed_hours,
  ADD COLUMN IF NOT EXISTS course_restructuring_percentage INT NOT NULL DEFAULT 0 AFTER new_course_hours,
  ADD COLUMN IF NOT EXISTS course_restructuring_approved TINYINT(1) NULL AFTER course_restructuring_percentage,
  ADD COLUMN IF NOT EXISTS syllabus_count INT NOT NULL DEFAULT 0 AFTER course_restructuring_approved,
  ADD COLUMN IF NOT EXISTS car_file_elaborated TINYINT(1) NOT NULL DEFAULT 0 AFTER syllabus_count,
  ADD COLUMN IF NOT EXISTS exam_elaborated TINYINT(1) NOT NULL DEFAULT 0 AFTER car_file_elaborated,
  ADD COLUMN IF NOT EXISTS evening_or_saturday_hours DECIMAL(6,2) NOT NULL DEFAULT 0.00 AFTER exam_elaborated,
  ADD COLUMN IF NOT EXISTS coordination TINYINT(1) NOT NULL DEFAULT 0 AFTER evening_or_saturday_hours;
