package com.esprit.academicplatform.signuprequest;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SignupRequestRepository extends JpaRepository<SignupRequest, Long> {

    Optional<SignupRequest> findByEmail(String email);

    List<SignupRequest> findAllByOrderByCreatedAtDesc();
}
