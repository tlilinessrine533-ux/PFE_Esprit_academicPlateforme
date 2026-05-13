package com.esprit.academicplatform.signuprequest;

import com.esprit.academicplatform.common.enums.RoleType;
import com.esprit.academicplatform.common.enums.SignupRequestStatus;
import com.esprit.academicplatform.common.enums.TeacherType;
import com.esprit.academicplatform.department.Department;
import com.esprit.academicplatform.department.DepartmentRepository;
import com.esprit.academicplatform.notification.NotificationService;
import com.esprit.academicplatform.signuprequest.dto.CreateSignupRequest;
import com.esprit.academicplatform.signuprequest.dto.ReviewSignupRequest;
import com.esprit.academicplatform.signuprequest.dto.SignupRequestResponse;
import com.esprit.academicplatform.user.User;
import com.esprit.academicplatform.user.UserRepository;
import java.time.LocalDateTime;
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
public class SignupRequestService {

    private final SignupRequestRepository signupRequestRepository;
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;
    private final NotificationService notificationService;

    @Transactional
    public SignupRequestResponse createRequest(CreateSignupRequest request) {
        String normalizedEmail = normalizeEmail(request.email());
        if (userRepository.findByEmail(normalizedEmail).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Un compte existe deja pour cet email");
        }

        Department department = resolveDepartment(request.departmentId(), request.departmentName(), true);
        RoleType requestedRole = resolveRequestedRole(request.role());
        SignupRequest existingRequest = signupRequestRepository.findByEmail(normalizedEmail).orElse(null);
        boolean isResubmission = existingRequest != null;

        if (existingRequest != null && existingRequest.getStatus() == SignupRequestStatus.PENDING) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "Une demande d'inscription est deja en attente pour cet email"
            );
        }

        SignupRequest signupRequest = existingRequest != null ? existingRequest : new SignupRequest();
        signupRequest.setFirstName(request.firstName().trim());
        signupRequest.setLastName(request.lastName().trim());
        signupRequest.setEmail(normalizedEmail);
        signupRequest.setPasswordHash(passwordEncoder.encode(request.password()));
        signupRequest.setRole(requestedRole);
        signupRequest.setDepartment(department);
        signupRequest.setStatus(SignupRequestStatus.PENDING);
        signupRequest.setReviewComment(null);
        signupRequest.setReviewedBy(null);
        signupRequest.setReviewedAt(null);

        SignupRequest savedRequest = signupRequestRepository.save(signupRequest);
        notifySuperAdmins(savedRequest, isResubmission);
        return toResponse(savedRequest);
    }

    @Transactional(readOnly = true)
    public List<SignupRequestResponse> getAllRequests() {
        return signupRequestRepository.findAllByOrderByCreatedAtDesc()
            .stream()
            .map(this::toResponse)
            .toList();
    }

    @Transactional
    public SignupRequestResponse approveRequest(Long id, ReviewSignupRequest request, String currentUserEmail) {
        User reviewer = findReviewer(currentUserEmail);
        SignupRequest signupRequest = findPendingRequest(id);

        if (userRepository.findByEmail(signupRequest.getEmail()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Un compte existe deja pour cet email");
        }

        User user = new User();
        user.setFirstName(signupRequest.getFirstName());
        user.setLastName(signupRequest.getLastName());
        user.setEmail(signupRequest.getEmail());
        user.setPasswordHash(signupRequest.getPasswordHash());
        user.setRole(signupRequest.getRole());
        user.setTeacherType(signupRequest.getRole() == RoleType.ENSEIGNANT ? TeacherType.PERMANENT : null);
        user.setDepartment(signupRequest.getDepartment());
        user.setActive(true);
        User createdUser = userRepository.save(user);

        signupRequest.setStatus(SignupRequestStatus.APPROVED);
        signupRequest.setReviewComment(normalizeOptionalText(request.reviewComment()));
        signupRequest.setReviewedBy(reviewer);
        signupRequest.setReviewedAt(LocalDateTime.now());
        SignupRequest savedRequest = signupRequestRepository.save(signupRequest);

        notificationService.createForUser(
            createdUser,
            "Compte cree",
            "Votre demande d'inscription a ete approuvee. Vous pouvez maintenant vous connecter a la plateforme."
        );

        return toResponse(savedRequest);
    }

    @Transactional
    public SignupRequestResponse rejectRequest(Long id, ReviewSignupRequest request, String currentUserEmail) {
        User reviewer = findReviewer(currentUserEmail);
        SignupRequest signupRequest = findPendingRequest(id);

        signupRequest.setStatus(SignupRequestStatus.REJECTED);
        signupRequest.setReviewComment(normalizeOptionalText(request.reviewComment()));
        signupRequest.setReviewedBy(reviewer);
        signupRequest.setReviewedAt(LocalDateTime.now());

        return toResponse(signupRequestRepository.save(signupRequest));
    }

    private SignupRequest findPendingRequest(Long id) {
        SignupRequest signupRequest = signupRequestRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Demande d'inscription introuvable"));

        if (signupRequest.getStatus() != SignupRequestStatus.PENDING) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Cette demande a deja ete traitee");
        }

        return signupRequest;
    }

    private User findReviewer(String currentUserEmail) {
        User reviewer = userRepository.findByEmail(currentUserEmail)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Utilisateur non authentifie"));

        if (reviewer.getRole() != RoleType.SUPER_ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Seul le super administrateur peut traiter les demandes");
        }

        return reviewer;
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

    private Department createDepartment(String departmentName) {
        Department department = new Department();
        department.setName(departmentName);
        department.setCode(null);
        return departmentRepository.save(department);
    }

    private SignupRequestResponse toResponse(SignupRequest signupRequest) {
        Department department = signupRequest.getDepartment();
        User reviewedBy = signupRequest.getReviewedBy();

        return new SignupRequestResponse(
            signupRequest.getId(),
            signupRequest.getFirstName(),
            signupRequest.getLastName(),
            signupRequest.getEmail(),
            signupRequest.getRole(),
            department != null ? department.getId() : null,
            department != null ? department.getName() : null,
            signupRequest.getStatus(),
            signupRequest.getReviewComment(),
            reviewedBy != null ? reviewedBy.getId() : null,
            reviewedBy != null ? reviewedBy.getFirstName() + " " + reviewedBy.getLastName() : null,
            signupRequest.getCreatedAt(),
            signupRequest.getUpdatedAt(),
            signupRequest.getReviewedAt()
        );
    }

    private void notifySuperAdmins(SignupRequest signupRequest, boolean isResubmission) {
        List<User> superAdmins = userRepository.findByRoleInAndIsActiveTrue(List.of(RoleType.SUPER_ADMIN));
        String title = isResubmission ? "Demande d'inscription relancee" : "Nouvelle demande d'inscription";
        String message = "%s %s demande la creation d'un compte avec le role %s pour le departement %s (%s)."
            .formatted(
                signupRequest.getFirstName(),
                signupRequest.getLastName(),
                formatRole(signupRequest.getRole()),
                signupRequest.getDepartment().getName(),
                signupRequest.getEmail()
            );

        notificationService.createForUsers(superAdmins, title, message);
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase();
    }

    private String normalizeOptionalText(String value) {
        return StringUtils.hasText(value) ? value.trim() : null;
    }

    private RoleType resolveRequestedRole(RoleType requestedRole) {
        if (requestedRole == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Le role demande est obligatoire");
        }

        if (requestedRole == RoleType.SUPER_ADMIN) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Le role super administrateur ne peut pas etre demande depuis ce formulaire"
            );
        }

        return requestedRole;
    }

    private String formatRole(RoleType role) {
        return switch (role) {
            case ENSEIGNANT -> "Enseignant";
            case CHEF_DEPARTEMENT -> "Chef de departement";
            case ADMINISTRATION -> "Admin";
            case SUPER_ADMIN -> "Super administrateur";
        };
    }
}
