package com.esprit.academicplatform.activity;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExamSurveillanceActivityRepository extends JpaRepository<ExamSurveillanceActivity, Long> {

    List<ExamSurveillanceActivity> findAllByOrderByCreatedAtDesc();

    List<ExamSurveillanceActivity> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<ExamSurveillanceActivity> findByUserIdAndAcademicYearOrderByCreatedAtDesc(Long userId, String academicYear);

    List<ExamSurveillanceActivity> findByUserDepartmentIdOrderByCreatedAtDesc(Long departmentId);

    List<ExamSurveillanceActivity> findByUserDepartmentIdAndAcademicYearOrderByCreatedAtDesc(Long departmentId, String academicYear);

    List<ExamSurveillanceActivity> findByAcademicYearOrderByCreatedAtDesc(String academicYear);
}
