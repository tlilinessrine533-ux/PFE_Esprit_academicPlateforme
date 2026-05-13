package com.esprit.academicplatform.administration;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdministrativeDecisionRepository extends JpaRepository<AdministrativeDecision, Long> {

    Optional<AdministrativeDecision> findFirstByTeacherIdAndPeriodLabelOrderByCreatedAtDesc(Long teacherId, String periodLabel);
}
