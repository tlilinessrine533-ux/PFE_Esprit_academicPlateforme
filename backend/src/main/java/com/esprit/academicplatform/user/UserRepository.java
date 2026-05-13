package com.esprit.academicplatform.user;

import com.esprit.academicplatform.common.enums.RoleType;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    List<User> findByRoleAndDepartmentIdAndIsActiveTrue(RoleType role, Long departmentId);

    List<User> findByRoleInAndIsActiveTrue(Collection<RoleType> roles);

    Optional<User> findByPhoneNumber(String phoneNumber);
}
