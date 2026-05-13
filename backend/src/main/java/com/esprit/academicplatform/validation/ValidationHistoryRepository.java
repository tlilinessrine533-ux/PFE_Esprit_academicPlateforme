package com.esprit.academicplatform.validation;

import com.esprit.academicplatform.common.enums.ValidationLevel;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ValidationHistoryRepository extends JpaRepository<ValidationHistory, Long> {

    List<ValidationHistory> findByActivityIdOrderByDecidedAtAsc(Long activityId);

    boolean existsByActivityIdAndValidationLevel(Long activityId, ValidationLevel validationLevel);

    @Query("""
        select distinct history.activity.id
        from ValidationHistory history
        where history.validationLevel = :validationLevel
          and history.activity.id in :activityIds
        """)
    List<Long> findDistinctActivityIdsByValidationLevelAndActivityIdIn(
        @Param("validationLevel") ValidationLevel validationLevel,
        @Param("activityIds") List<Long> activityIds
    );
}
