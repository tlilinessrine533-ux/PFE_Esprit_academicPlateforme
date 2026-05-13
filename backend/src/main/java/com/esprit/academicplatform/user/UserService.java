package com.esprit.academicplatform.user;

import com.esprit.academicplatform.department.Department;
import com.esprit.academicplatform.department.DepartmentRepository;
import com.esprit.academicplatform.common.enums.RoleType;
import com.esprit.academicplatform.common.enums.TeacherType;
import com.esprit.academicplatform.user.dto.CreateUserRequest;
import com.esprit.academicplatform.user.dto.UpdateUserRequest;
import com.esprit.academicplatform.user.dto.UserResponse;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
            .stream()
            .map(this::toResponse)
            .toList();
    }

    @Transactional(readOnly = true)
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Utilisateur introuvable"));
        return toResponse(user);
    }

    @Transactional
    public UserResponse createUser(CreateUserRequest request) {
        String normalizedEmail = normalizeRequiredText(request.email()).toLowerCase();

        userRepository.findByEmail(normalizedEmail)
            .ifPresent(existingUser -> {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Cet email existe deja");
            });

        Department department = resolveDepartment(request.departmentId(), request.departmentName(), requiresDepartment(request.role()));
        validateRoleAssignment(request.role(), department, null);

        User user = new User();
        user.setFirstName(normalizeRequiredText(request.firstName()));
        user.setLastName(normalizeRequiredText(request.lastName()));
        user.setEmail(normalizedEmail);
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setRole(request.role());
        user.setTeacherType(resolveTeacherType(request.role(), request.teacherType()));
        user.setDepartment(department);
        user.setActive(request.isActive() == null || request.isActive());

        return toResponse(userRepository.save(user));
    }

    @Transactional
    public UserResponse updateUser(Long id, UpdateUserRequest request) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Utilisateur introuvable"));

        String normalizedEmail = normalizeRequiredText(request.email()).toLowerCase();
        Department nextDepartment = resolveDepartment(request.departmentId(), null, requiresDepartment(request.role()));
        boolean nextActive = request.isActive();

        validateDepartmentHeadCoverageBeforeChange(user, request.role(), nextDepartment, nextActive);

        userRepository.findByEmail(normalizedEmail)
            .filter(existingUser -> !existingUser.getId().equals(id))
            .ifPresent(existingUser -> {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Cet email existe deja");
            });

        validateRoleAssignment(request.role(), nextDepartment, user.getId());

        user.setFirstName(normalizeRequiredText(request.firstName()));
        user.setLastName(normalizeRequiredText(request.lastName()));
        user.setEmail(normalizedEmail);
        user.setRole(request.role());
        user.setTeacherType(resolveTeacherType(request.role(), request.teacherType()));
        user.setDepartment(nextDepartment);
        user.setActive(nextActive);

        return toResponse(userRepository.save(user));
    }

    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Utilisateur introuvable"));

        validateDepartmentHeadDeletion(user);
        userRepository.delete(user);
    }

    private Department resolveDepartment(Long departmentId, String departmentName, boolean required) {
        if (departmentId != null) {
            return departmentRepository.findById(departmentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Departement introuvable"));
        }

        String normalizedDepartmentName = normalizeOptionalText(departmentName);
        if (!StringUtils.hasText(normalizedDepartmentName)) {
            if (required) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Le departement est obligatoire");
            }
            return null;
        }

        return departmentRepository.findByNameIgnoreCase(normalizedDepartmentName)
            .orElseGet(() -> createDepartment(normalizedDepartmentName));
    }

    private Department resolveDepartment(Long departmentId) {
        return resolveDepartment(departmentId, null, false);
    }

    private void validateRoleAssignment(RoleType role, Department department, Long currentUserId) {
        if (role == RoleType.ENSEIGNANT) {
            if (department == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Le departement est obligatoire pour un enseignant");
            }

            if (!hasActiveDepartmentHead(department.getId(), currentUserId)) {
                throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Chaque enseignant doit etre rattache a un departement avec un chef de departement actif."
                );
            }
        }

        if (role == RoleType.CHEF_DEPARTEMENT) {
            if (department == null) {
                throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Le departement est obligatoire pour un chef de departement"
                );
            }

            boolean anotherActiveHeadExists = userRepository
                .findByRoleAndDepartmentIdAndIsActiveTrue(RoleType.CHEF_DEPARTEMENT, department.getId())
                .stream()
                .anyMatch(head -> currentUserId == null || !head.getId().equals(currentUserId));

            if (anotherActiveHeadExists) {
                throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Ce departement a deja un chef de departement actif."
                );
            }
        }
    }

    private void validateDepartmentHeadCoverageBeforeChange(
        User existingUser,
        RoleType nextRole,
        Department nextDepartment,
        boolean nextActive
    ) {
        Department currentDepartment = existingUser.getDepartment();

        if (
            existingUser.getRole() != RoleType.CHEF_DEPARTEMENT ||
            !existingUser.isActive() ||
            currentDepartment == null
        ) {
            return;
        }

        boolean remainsActiveHeadForSameDepartment =
            nextActive &&
            nextRole == RoleType.CHEF_DEPARTEMENT &&
            nextDepartment != null &&
            currentDepartment.getId().equals(nextDepartment.getId());

        if (remainsActiveHeadForSameDepartment) {
            return;
        }

        boolean departmentHasTeachers = !userRepository
            .findByRoleAndDepartmentIdAndIsActiveTrue(RoleType.ENSEIGNANT, currentDepartment.getId())
            .isEmpty();

        if (departmentHasTeachers) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Ce departement contient encore des enseignants actifs. Affectez d'abord un autre chef de departement."
            );
        }
    }

    private void validateDepartmentHeadDeletion(User user) {
        if (user.getRole() != RoleType.CHEF_DEPARTEMENT || !user.isActive() || user.getDepartment() == null) {
            return;
        }

        boolean departmentHasTeachers = !userRepository
            .findByRoleAndDepartmentIdAndIsActiveTrue(RoleType.ENSEIGNANT, user.getDepartment().getId())
            .isEmpty();

        if (departmentHasTeachers) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Impossible de supprimer ce chef de departement tant que des enseignants actifs sont rattaches a son departement."
            );
        }
    }

    private boolean hasActiveDepartmentHead(Long departmentId, Long currentUserId) {
        return userRepository.findByRoleAndDepartmentIdAndIsActiveTrue(RoleType.CHEF_DEPARTEMENT, departmentId)
            .stream()
            .anyMatch(head -> currentUserId == null || !head.getId().equals(currentUserId));
    }

    private boolean requiresDepartment(RoleType role) {
        return role != RoleType.SUPER_ADMIN;
    }

    private TeacherType resolveTeacherType(RoleType role, TeacherType requestedType) {
        if (role != RoleType.ENSEIGNANT) {
            return null;
        }

        return requestedType != null ? requestedType : TeacherType.PERMANENT;
    }

    private Department createDepartment(String departmentName) {
        Department department = new Department();
        department.setName(departmentName);
        department.setCode(null);
        return departmentRepository.save(department);
    }

    private String normalizeOptionalText(String value) {
        return StringUtils.hasText(value) ? value.trim() : null;
    }

    private String normalizeRequiredText(String value) {
        String normalizedValue = normalizeOptionalText(value);
        if (normalizedValue == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Valeur obligatoire manquante");
        }
        return normalizedValue;
    }

    private UserResponse toResponse(User user) {
        Department department = user.getDepartment();
        return new UserResponse(
            user.getId(),
            user.getFirstName(),
            user.getLastName(),
            user.getEmail(),
            user.getRole(),
            user.effectiveTeacherType(),
            department != null ? department.getId() : null,
            department != null ? department.getName() : null,
            user.isActive(),
            user.getCreatedAt(),
            user.getUpdatedAt()
        );
    }
}
