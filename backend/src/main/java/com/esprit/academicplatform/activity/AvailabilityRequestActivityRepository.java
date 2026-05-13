package com.esprit.academicplatform.activity;

import com.esprit.academicplatform.common.enums.AvailabilityRequestType;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AvailabilityRequestActivityRepository extends JpaRepository<AvailabilityRequestActivity, Long> {

    List<AvailabilityRequestActivity> findAllByOrderByCreatedAtDesc();

    List<AvailabilityRequestActivity> findByUserIdAndRequestTypeOrderByCreatedAtDesc(
        Long userId,
        AvailabilityRequestType requestType
    );

    List<AvailabilityRequestActivity> findByDepartmentIdAndRequestTypeOrderByCreatedAtDesc(
        Long departmentId,
        AvailabilityRequestType requestType
    );
}
