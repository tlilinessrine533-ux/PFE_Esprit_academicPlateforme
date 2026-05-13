package com.esprit.academicplatform.activity;

import com.esprit.academicplatform.common.enums.ActivityStatus;
import java.util.Collection;
import java.util.List;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ActivityRepository extends JpaRepository<Activity, Long> {

    @EntityGraph(attributePaths = {"user", "user.department"})
    List<Activity> findAllByOrderByCreatedAtDesc();

    @EntityGraph(attributePaths = {"user", "user.department"})
    List<Activity> findByStatusOrderByCreatedAtDesc(ActivityStatus status);

    @EntityGraph(attributePaths = {"user", "user.department"})
    List<Activity> findByStatusInOrderByCreatedAtDesc(Collection<ActivityStatus> statuses);
}
