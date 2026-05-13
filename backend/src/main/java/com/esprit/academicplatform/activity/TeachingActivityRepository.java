package com.esprit.academicplatform.activity;

import com.esprit.academicplatform.common.enums.ActivityStatus;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TeachingActivityRepository extends JpaRepository<TeachingActivity, Long> {

    List<TeachingActivity> findAllByOrderByCreatedAtDesc();

    List<TeachingActivity> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<TeachingActivity> findByUserIdAndAcademicYearOrderByCreatedAtDesc(Long userId, String academicYear);

    List<TeachingActivity> findByUserDepartmentIdOrderByCreatedAtDesc(Long departmentId);

    List<TeachingActivity> findByUserDepartmentIdAndAcademicYearOrderByCreatedAtDesc(Long departmentId, String academicYear);

    List<TeachingActivity> findByAcademicYearOrderByCreatedAtDesc(String academicYear);

    List<TeachingActivity> findByStatusOrderByCreatedAtDesc(ActivityStatus status);

    List<TeachingActivity> findByStatusAndUserDepartmentIdOrderByCreatedAtDesc(ActivityStatus status, Long departmentId);
}
