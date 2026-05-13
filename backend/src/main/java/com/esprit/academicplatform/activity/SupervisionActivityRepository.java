package com.esprit.academicplatform.activity;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SupervisionActivityRepository extends JpaRepository<SupervisionActivity, Long> {

    List<SupervisionActivity> findAllByOrderByCreatedAtDesc();

    List<SupervisionActivity> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<SupervisionActivity> findByUserIdAndAcademicYearOrderByCreatedAtDesc(Long userId, String academicYear);

    List<SupervisionActivity> findByUserDepartmentIdOrderByCreatedAtDesc(Long departmentId);

    List<SupervisionActivity> findByUserDepartmentIdAndAcademicYearOrderByCreatedAtDesc(Long departmentId, String academicYear);

    List<SupervisionActivity> findByAcademicYearOrderByCreatedAtDesc(String academicYear);
}
