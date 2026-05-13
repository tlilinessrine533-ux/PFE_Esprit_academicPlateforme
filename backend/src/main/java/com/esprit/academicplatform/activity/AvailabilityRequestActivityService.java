package com.esprit.academicplatform.activity;

import com.esprit.academicplatform.activity.dto.AvailabilityRequestResponse;
import com.esprit.academicplatform.activity.dto.CreateLeaveAvailabilityRequest;
import com.esprit.academicplatform.activity.dto.CreateMissionAvailabilityRequest;
import com.esprit.academicplatform.common.enums.AvailabilityRequestType;
import com.esprit.academicplatform.common.enums.LeaveType;
import com.esprit.academicplatform.common.enums.RoleType;
import com.esprit.academicplatform.department.Department;
import com.esprit.academicplatform.department.DepartmentRepository;
import com.esprit.academicplatform.user.User;
import com.esprit.academicplatform.user.UserRepository;
import com.esprit.academicplatform.workflow.WorkflowService;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.time.format.DateTimeFormatter;
import java.util.Base64;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class AvailabilityRequestActivityService {

    private static final int MAX_MEDICAL_CERTIFICATE_BYTES = 5 * 1024 * 1024;
    private static final int MAX_MEDICAL_CERTIFICATE_DATA_URL_LENGTH = 7_500_000;
    private static final DateTimeFormatter MEDICAL_CERTIFICATE_TIMESTAMP_FORMATTER = DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss");

    private final AvailabilityRequestActivityRepository availabilityRequestActivityRepository;
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final WorkflowService workflowService;

    @Value("${app.availability.medical-certificates-dir:uploaded-medical-certificates}")
    private String medicalCertificatesDir;

    @Transactional(readOnly = true)
    public List<AvailabilityRequestResponse> getAccessibleRequests(
        AvailabilityRequestType requestType,
        String currentUserEmail
    ) {
        User currentUser = findCurrentUser(currentUserEmail);

        return findAccessibleActivities(currentUser, requestType)
            .stream()
            .map(this::toResponse)
            .toList();
    }

    @Transactional
    public AvailabilityRequestResponse createLeaveRequest(
        CreateLeaveAvailabilityRequest request,
        String currentUserEmail
    ) {
        validateDateRange(request.startDate(), request.endDate());

        User currentUser = findCurrentUser(currentUserEmail);
        AvailabilityRequestActivity activity = new AvailabilityRequestActivity();
        activity.setUser(currentUser);
        activity.setRequestType(AvailabilityRequestType.CONGE);
        activity.setLeaveType(request.leaveType());
        activity.setTitle("Demande de conge");
        Department selectedDepartment = resolveDepartment(request.departmentId());
        activity.setDepartment(selectedDepartment);
        activity.setDepartmentName(selectedDepartment.getName().trim());
        activity.setStartDate(request.startDate());
        activity.setEndDate(request.endDate());
        activity.setReason(request.reason().trim());
        activity.setAcademicYear(request.academicYear().trim());
        activity.setPedagogicalUnit(request.pedagogicalUnit().trim());
        activity.setMedicalCertificateImageDataUrl(
            storeMedicalCertificateIfNeeded(request.leaveType(), request.medicalCertificateImageDataUrl(), currentUser)
        );

        AvailabilityRequestActivity saved = availabilityRequestActivityRepository.save(activity);
        workflowService.submitActivity(saved.getId(), currentUserEmail);

        return availabilityRequestActivityRepository.findById(saved.getId())
            .map(this::toResponse)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Demande de conge introuvable"));
    }

    @Transactional
    public AvailabilityRequestResponse createMissionRequest(
        CreateMissionAvailabilityRequest request,
        String currentUserEmail
    ) {
        validateDateRange(request.startDate(), request.endDate());

        User currentUser = findCurrentUser(currentUserEmail);
        AvailabilityRequestActivity activity = new AvailabilityRequestActivity();
        activity.setUser(currentUser);
        activity.setRequestType(AvailabilityRequestType.MISSION);
        activity.setMissionKind(request.missionKind());
        activity.setTitle(request.title().trim());
        activity.setStartDate(request.startDate());
        activity.setEndDate(request.endDate());
        activity.setReason(request.reason().trim());
        activity.setAcademicYear(request.academicYear().trim());

        AvailabilityRequestActivity saved = availabilityRequestActivityRepository.save(activity);
        workflowService.submitActivity(saved.getId(), currentUserEmail);

        return availabilityRequestActivityRepository.findById(saved.getId())
            .map(this::toResponse)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Demande de mission introuvable"));
    }

    private List<AvailabilityRequestActivity> findAccessibleActivities(
        User currentUser,
        AvailabilityRequestType requestType
    ) {
        if (currentUser.getRole() == RoleType.ADMINISTRATION || currentUser.getRole() == RoleType.SUPER_ADMIN) {
            return availabilityRequestActivityRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .filter(activity -> activity.getRequestType() == requestType)
                .toList();
        }

        if (currentUser.getRole() == RoleType.CHEF_DEPARTEMENT) {
            return availabilityRequestActivityRepository.findByDepartmentIdAndRequestTypeOrderByCreatedAtDesc(
                getRequiredDepartmentId(currentUser),
                requestType
            );
        }

        return availabilityRequestActivityRepository.findByUserIdAndRequestTypeOrderByCreatedAtDesc(
            currentUser.getId(),
            requestType
        );
    }

    private AvailabilityRequestResponse toResponse(AvailabilityRequestActivity activity) {
        User teacher = activity.getUser();
        return new AvailabilityRequestResponse(
            activity.getId(),
            teacher.getId(),
            teacher.getFirstName() + " " + teacher.getLastName(),
            activity.getRequestType(),
            activity.getLeaveType(),
            activity.getMissionKind(),
            activity.getTitle(),
            activity.getStartDate(),
            activity.getEndDate(),
            activity.getReason(),
            activity.getPedagogicalUnit(),
            activity.getDepartment() != null ? activity.getDepartment().getName() : activity.getDepartmentName(),
            activity.getMedicalCertificateImageDataUrl() != null && !activity.getMedicalCertificateImageDataUrl().isBlank(),
            calculateAbsenceDays(activity.getStartDate(), activity.getEndDate()),
            activity.getStatus(),
            activity.getAcademicYear(),
            activity.getCreatedAt(),
            activity.getUpdatedAt()
        );
    }

    private User findCurrentUser(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Utilisateur non authentifie"));
    }

    private Department resolveDepartment(Long departmentId) {
        return departmentRepository.findById(departmentId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Departement selectionne introuvable"));
    }

    private Long getRequiredDepartmentId(User user) {
        if (user.getDepartment() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Aucun departement n'est associe a cet utilisateur");
        }

        return user.getDepartment().getId();
    }

    private void validateDateRange(java.time.LocalDate startDate, java.time.LocalDate endDate) {
        if (endDate.isBefore(startDate)) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "La date de fin doit etre superieure ou egale a la date de debut."
            );
        }
    }

    private int calculateAbsenceDays(java.time.LocalDate startDate, java.time.LocalDate endDate) {
        if (startDate == null || endDate == null) {
            return 0;
        }

        long days = ChronoUnit.DAYS.between(startDate, endDate) + 1;
        if (days < 0) {
            return 0;
        }
        if (days > Integer.MAX_VALUE) {
            return Integer.MAX_VALUE;
        }
        return (int) days;
    }

    private String storeMedicalCertificateIfNeeded(
        LeaveType leaveType,
        String rawMedicalCertificateImageDataUrl,
        User currentUser
    ) {
        if (leaveType != LeaveType.MALADIE) {
            return null;
        }

        String normalizedDataUrl = rawMedicalCertificateImageDataUrl != null
            ? rawMedicalCertificateImageDataUrl.trim()
            : "";

        if (normalizedDataUrl.isBlank()) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Un certificat medical au format image est obligatoire pour un conge maladie."
            );
        }

        if (normalizedDataUrl.length() > MAX_MEDICAL_CERTIFICATE_DATA_URL_LENGTH) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Le certificat medical image depasse la taille maximale autorisee."
            );
        }

        if (!normalizedDataUrl.startsWith("data:image/") || !normalizedDataUrl.contains(";base64,")) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Le certificat medical doit etre transmis sous forme d'image valide."
            );
        }

        String metadata = normalizedDataUrl.substring(0, normalizedDataUrl.indexOf(";base64,"));
        String base64Content = normalizedDataUrl.substring(normalizedDataUrl.indexOf(";base64,") + 8);

        try {
            byte[] decodedImage = Base64.getDecoder().decode(base64Content);
            if (decodedImage.length == 0) {
                throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Le certificat medical image est vide."
                );
            }

            if (decodedImage.length > MAX_MEDICAL_CERTIFICATE_BYTES) {
                throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Le certificat medical image ne doit pas depasser 5 Mo."
                );
            }

            String fileExtension = resolveMedicalCertificateFileExtension(metadata);
            return writeMedicalCertificateFile(decodedImage, currentUser.getId(), fileExtension);
        } catch (IllegalArgumentException exception) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Le certificat medical doit etre transmis sous forme d'image valide."
            );
        } catch (IOException exception) {
            throw new ResponseStatusException(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Le certificat medical n'a pas pu etre enregistre."
            );
        }
    }

    private String resolveMedicalCertificateFileExtension(String metadata) {
        if (metadata.startsWith("data:image/png")) {
            return ".png";
        }

        if (metadata.startsWith("data:image/jpeg") || metadata.startsWith("data:image/jpg")) {
            return ".jpg";
        }

        if (metadata.startsWith("data:image/webp")) {
            return ".webp";
        }

        throw new ResponseStatusException(
            HttpStatus.BAD_REQUEST,
            "Le certificat medical doit etre une image PNG, JPG ou WEBP."
        );
    }

    private String writeMedicalCertificateFile(byte[] imageBytes, Long userId, String fileExtension) throws IOException {
        Path outputDirectory = Paths.get(medicalCertificatesDir);
        Files.createDirectories(outputDirectory);

        String fileName = "medical_certificate_user_" + userId
            + "_" + LocalDateTime.now().format(MEDICAL_CERTIFICATE_TIMESTAMP_FORMATTER)
            + "_" + UUID.randomUUID().toString().replace("-", "")
            + fileExtension;
        Path outputPath = outputDirectory.resolve(fileName);
        Files.write(outputPath, imageBytes);
        return outputPath.toString();
    }

}
