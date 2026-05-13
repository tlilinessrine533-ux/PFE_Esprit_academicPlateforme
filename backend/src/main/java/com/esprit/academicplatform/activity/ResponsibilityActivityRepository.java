package com.esprit.academicplatform.activity;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResponsibilityActivityRepository extends JpaRepository<ResponsibilityActivity, Long> {

    List<ResponsibilityActivity> findAllByOrderByCreatedAtDesc();

    List<ResponsibilityActivity> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<ResponsibilityActivity> findByUserIdAndAcademicYearOrderByCreatedAtDesc(Long userId, String academicYear);

    List<ResponsibilityActivity> findByUserDepartmentIdOrderByCreatedAtDesc(Long departmentId);

    List<ResponsibilityActivity> findByUserDepartmentIdAndAcademicYearOrderByCreatedAtDesc(Long departmentId, String academicYear);

    List<ResponsibilityActivity> findByAcademicYearOrderByCreatedAtDesc(String academicYear);
}
