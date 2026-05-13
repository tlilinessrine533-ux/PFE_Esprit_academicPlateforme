package com.esprit.academicplatform.activity;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventActivityRepository extends JpaRepository<EventActivity, Long> {

    List<EventActivity> findAllByOrderByCreatedAtDesc();

    List<EventActivity> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<EventActivity> findByUserIdAndAcademicYearOrderByCreatedAtDesc(Long userId, String academicYear);

    List<EventActivity> findByUserDepartmentIdOrderByCreatedAtDesc(Long departmentId);

    List<EventActivity> findByUserDepartmentIdAndAcademicYearOrderByCreatedAtDesc(Long departmentId, String academicYear);

    List<EventActivity> findByAcademicYearOrderByCreatedAtDesc(String academicYear);
}
