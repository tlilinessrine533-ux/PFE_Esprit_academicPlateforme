package com.esprit.academicplatform.activity;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResearchActivityRepository extends JpaRepository<ResearchActivity, Long> {

    List<ResearchActivity> findAllByOrderByCreatedAtDesc();

    List<ResearchActivity> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<ResearchActivity> findByUserIdAndAcademicYearOrderByCreatedAtDesc(Long userId, String academicYear);

    List<ResearchActivity> findByUserDepartmentIdOrderByCreatedAtDesc(Long departmentId);

    List<ResearchActivity> findByUserDepartmentIdAndAcademicYearOrderByCreatedAtDesc(Long departmentId, String academicYear);

    List<ResearchActivity> findByAcademicYearOrderByCreatedAtDesc(String academicYear);
}
