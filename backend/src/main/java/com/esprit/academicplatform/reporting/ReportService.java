package com.esprit.academicplatform.reporting;

import com.esprit.academicplatform.activity.ResearchActivity;
import com.esprit.academicplatform.activity.ResearchActivityRepository;
import com.esprit.academicplatform.activity.EventActivity;
import com.esprit.academicplatform.activity.EventActivityRepository;
import com.esprit.academicplatform.activity.ExamSurveillanceActivity;
import com.esprit.academicplatform.activity.ExamSurveillanceActivityRepository;
import com.esprit.academicplatform.activity.ResponsibilityActivity;
import com.esprit.academicplatform.activity.ResponsibilityActivityRepository;
import com.esprit.academicplatform.activity.SupervisionActivity;
import com.esprit.academicplatform.activity.SupervisionActivityRepository;
import com.esprit.academicplatform.activity.TeachingActivity;
import com.esprit.academicplatform.activity.TeachingActivityRepository;
import com.esprit.academicplatform.common.enums.FormatRapport;
import com.esprit.academicplatform.common.enums.PublicationType;
import com.esprit.academicplatform.common.enums.RoleType;
import com.esprit.academicplatform.common.enums.StatutEncadrement;
import com.esprit.academicplatform.common.enums.SupervisionType;
import com.esprit.academicplatform.common.enums.TypeRapport;
import com.esprit.academicplatform.department.Department;
import com.esprit.academicplatform.department.DepartmentRepository;
import com.esprit.academicplatform.notification.NotificationService;
import com.esprit.academicplatform.reporting.dto.ReportResponse;
import com.esprit.academicplatform.user.User;
import com.esprit.academicplatform.user.UserRepository;
import com.lowagie.text.Chunk;
import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.Rectangle;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.awt.Color;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.VerticalAlignment;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFRichTextString;
import org.apache.poi.xssf.usermodel.XSSFColor;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class ReportService {

    private static final DateTimeFormatter FILE_DATE_FORMAT = DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss");
    private static final DateTimeFormatter DISPLAY_DATE_FORMAT = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
    private static final DateTimeFormatter DISPLAY_SHORT_DATE_FORMAT = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final Color ESPRIT_RED = new Color(216, 42, 42);
    private static final Color ESPRIT_BLACK = new Color(17, 18, 22);
    private static final Color ESPRIT_GREY = new Color(199, 203, 211);
    private static final Color ESPRIT_SOFT = new Color(246, 246, 248);
    private static final Color ESPRIT_BORDER = new Color(225, 227, 232);
    private static final Color EXCEL_RED = new Color(216, 42, 42);
    private static final Color EXCEL_BLACK = new Color(17, 18, 22);
    private static final Color EXCEL_GREY = new Color(199, 203, 211);
    private static final Color EXCEL_SOFT = new Color(246, 246, 248);
    private static final String BRAND_TAGLINE = "Se former autrement";
    private static final String BRAND_GROUP = "HONORIS UNITED UNIVERSITIES";

    private final ReportRepository reportRepository;
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final TeachingActivityRepository teachingActivityRepository;
    private final SupervisionActivityRepository supervisionActivityRepository;
    private final ResearchActivityRepository researchActivityRepository;
    private final EventActivityRepository eventActivityRepository;
    private final ExamSurveillanceActivityRepository examSurveillanceActivityRepository;
    private final ResponsibilityActivityRepository responsibilityActivityRepository;
    private final NotificationService notificationService;

    @Value("${app.reports.output-dir}")
    private String reportsOutputDir;

    @Transactional(readOnly = true)
    public List<ReportResponse> getAccessibleReports(String currentUserEmail) {
        User currentUser = findCurrentUser(currentUserEmail);

        List<Report> reports;
        if (currentUser.getRole() == RoleType.ADMINISTRATION || currentUser.getRole() == RoleType.SUPER_ADMIN) {
            reports = reportRepository.findAllByOrderByGeneratedAtDesc().stream()
                .filter(this::isAdministrationVisibleReport)
                .toList();
        } else if (currentUser.getRole() == RoleType.CHEF_DEPARTEMENT && currentUser.getDepartment() != null) {
            reports = reportRepository.findByGeneratedByIdOrTargetUserIdOrDepartmentIdOrderByGeneratedAtDesc(
                currentUser.getId(),
                currentUser.getId(),
                currentUser.getDepartment().getId()
            ).stream()
                .filter(report -> report.getReportType() == TypeRapport.DEPARTEMENTAL)
                .filter(report -> report.getDepartment() != null)
                .filter(report -> currentUser.getDepartment().getId().equals(report.getDepartment().getId()))
                .toList();
        } else if (currentUser.getRole() == RoleType.ENSEIGNANT) {
            reports = reportRepository.findByGeneratedByIdOrTargetUserIdOrderByGeneratedAtDesc(currentUser.getId(), currentUser.getId())
                .stream()
                .filter(report -> report.getReportType() == TypeRapport.INDIVIDUEL_ANNUEL)
                .toList();
        } else {
            reports = reportRepository.findByGeneratedByIdOrTargetUserIdOrderByGeneratedAtDesc(currentUser.getId(), currentUser.getId());
        }

        return reports.stream()
            .map(this::toResponse)
            .toList();
    }

    @Transactional
    public GeneratedReport generateIndividualPdf(String periodLabel, String currentUserEmail) {
        User currentUser = findCurrentUser(currentUserEmail);
        IndividualReportData data = buildIndividualReportData(currentUser, periodLabel);
        String generatedSuffix = FILE_DATE_FORMAT.format(LocalDateTime.now());

        try {
            byte[] content = buildPdf(data);
            Report report = saveReport(
                currentUser,
                currentUser,
                null,
                periodLabel,
                TypeRapport.INDIVIDUEL_ANNUEL,
                FormatRapport.PDF,
                content,
                "individual_report_user_" + currentUser.getId()
            );
            notifyReportGeneration(currentUser, periodLabel, FormatRapport.PDF, TypeRapport.INDIVIDUEL_ANNUEL, null);
            return toGeneratedReport(
                report,
                content,
                "application/pdf",
                "rapport_individuel_" + periodLabel + "_" + generatedSuffix + ".pdf"
            );
        } catch (IOException | DocumentException exception) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Génération du PDF impossible");
        }
    }

    @Transactional
    public GeneratedReport generateIndividualExcel(String periodLabel, String currentUserEmail) {
        User currentUser = findCurrentUser(currentUserEmail);
        IndividualReportData data = buildIndividualReportData(currentUser, periodLabel);

        try {
            byte[] content = buildExcel(data);
            Report report = saveReport(
                currentUser,
                currentUser,
                null,
                periodLabel,
                TypeRapport.INDIVIDUEL_ANNUEL,
                FormatRapport.EXCEL,
                content,
                "individual_report_user_" + currentUser.getId()
            );
            notifyReportGeneration(currentUser, periodLabel, FormatRapport.EXCEL, TypeRapport.INDIVIDUEL_ANNUEL, null);
            return toGeneratedReport(
                report,
                content,
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "rapport_individuel_" + periodLabel + ".xlsx"
            );
        } catch (IOException exception) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Génération du fichier Excel impossible");
        }
    }

    @Transactional
    public GeneratedReport generateDepartmentPdf(String periodLabel, String currentUserEmail, Long departmentId) {
        User currentUser = findCurrentUser(currentUserEmail);
        Department department = resolveDepartmentScope(currentUser, departmentId);
        DepartmentReportData data = buildDepartmentReportData(department, periodLabel);

        try {
            byte[] content = buildDepartmentPdf(data);
            Report report = saveReport(
                currentUser,
                null,
                department,
                periodLabel,
                TypeRapport.DEPARTEMENTAL,
                FormatRapport.PDF,
                content,
                "department_report_" + department.getId()
            );
            notifyReportGeneration(currentUser, periodLabel, FormatRapport.PDF, TypeRapport.DEPARTEMENTAL, department);
            return toGeneratedReport(
                report,
                content,
                "application/pdf",
                "rapport_departement_" + sanitizeName(department.getName()) + "_" + periodLabel + ".pdf"
            );
        } catch (IOException | DocumentException exception) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Génération du rapport départemental PDF impossible");
        }
    }

    @Transactional
    public GeneratedReport generateDepartmentExcel(String periodLabel, String currentUserEmail, Long departmentId) {
        User currentUser = findCurrentUser(currentUserEmail);
        Department department = resolveDepartmentScope(currentUser, departmentId);
        DepartmentReportData data = buildDepartmentReportData(department, periodLabel);

        try {
            byte[] content = buildDepartmentExcel(data);
            Report report = saveReport(
                currentUser,
                null,
                department,
                periodLabel,
                TypeRapport.DEPARTEMENTAL,
                FormatRapport.EXCEL,
                content,
                "department_report_" + department.getId()
            );
            notifyReportGeneration(currentUser, periodLabel, FormatRapport.EXCEL, TypeRapport.DEPARTEMENTAL, department);
            return toGeneratedReport(
                report,
                content,
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "rapport_departement_" + sanitizeName(department.getName()) + "_" + periodLabel + ".xlsx"
            );
        } catch (IOException exception) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Génération du rapport départemental Excel impossible");
        }
    }

    @Transactional
    public GeneratedReport generateInstitutionPdf(String periodLabel, String currentUserEmail) {
        User currentUser = findCurrentUser(currentUserEmail);
        ensureGlobalReportingAccess(currentUser);
        InstitutionReportData data = buildInstitutionReportData(periodLabel);

        try {
            byte[] content = buildInstitutionPdf(data);
            Report report = saveReport(
                currentUser,
                null,
                null,
                periodLabel,
                TypeRapport.INSTITUTIONNEL,
                FormatRapport.PDF,
                content,
                "institution_report"
            );
            notifyReportGeneration(currentUser, periodLabel, FormatRapport.PDF, TypeRapport.INSTITUTIONNEL, null);
            return toGeneratedReport(report, content, "application/pdf", "rapport_institutionnel_" + periodLabel + ".pdf");
        } catch (IOException | DocumentException exception) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Génération du rapport institutionnel PDF impossible");
        }
    }

    @Transactional
    public GeneratedReport generateInstitutionExcel(String periodLabel, String currentUserEmail) {
        User currentUser = findCurrentUser(currentUserEmail);
        ensureGlobalReportingAccess(currentUser);
        InstitutionReportData data = buildInstitutionReportData(periodLabel);

        try {
            byte[] content = buildInstitutionExcel(data);
            Report report = saveReport(
                currentUser,
                null,
                null,
                periodLabel,
                TypeRapport.INSTITUTIONNEL,
                FormatRapport.EXCEL,
                content,
                "institution_report"
            );
            notifyReportGeneration(currentUser, periodLabel, FormatRapport.EXCEL, TypeRapport.INSTITUTIONNEL, null);
            return toGeneratedReport(
                report,
                content,
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "rapport_institutionnel_" + periodLabel + ".xlsx"
            );
        } catch (IOException exception) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Génération du rapport institutionnel Excel impossible");
        }
    }

    @Transactional(readOnly = true)
    public GeneratedReport downloadReport(Long reportId, String currentUserEmail) {
        User currentUser = findCurrentUser(currentUserEmail);
        Report report = reportRepository.findById(reportId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Rapport introuvable"));

        if (!canAccessReport(currentUser, report)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Accès refusé à ce rapport");
        }

        if (report.getReportType() == TypeRapport.INDIVIDUEL_ANNUEL && report.getReportFormat() == FormatRapport.PDF) {
            User targetUser = report.getTargetUser() != null ? report.getTargetUser() : currentUser;
            IndividualReportData data = buildIndividualReportData(targetUser, report.getPeriodLabel());

            try {
                byte[] content = buildPdf(data);
                String filename = "rapport_individuel_" + report.getPeriodLabel() + "_" + FILE_DATE_FORMAT.format(LocalDateTime.now()) + ".pdf";
                return new GeneratedReport(report.getId(), filename, "application/pdf", content);
            } catch (IOException | DocumentException exception) {
                throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Regeneration du rapport individuel PDF impossible"
                );
            }
        }

        Path filePath = resolveStoredFile(report.getFilePath());
        if (!Files.exists(filePath)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Fichier du rapport introuvable");
        }

        try {
            byte[] content = Files.readAllBytes(filePath);
            String filename = filePath.getFileName().toString();
            String contentType = report.getReportFormat() == FormatRapport.PDF
                ? "application/pdf"
                : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            return new GeneratedReport(report.getId(), filename, contentType, content);
        } catch (IOException exception) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Lecture du rapport impossible");
        }
    }

    private Report saveReport(
        User generatedBy,
        User targetUser,
        Department department,
        String periodLabel,
        TypeRapport reportType,
        FormatRapport format,
        byte[] content,
        String filenamePrefix
    ) throws IOException {
        Path outputDir = Paths.get(reportsOutputDir);
        Files.createDirectories(outputDir);

        String extension = format == FormatRapport.PDF ? ".pdf" : ".xlsx";
        String filename = filenamePrefix + "_" + FILE_DATE_FORMAT.format(LocalDateTime.now()) + extension;
        Path targetFile = outputDir.resolve(filename);
        Files.write(targetFile, content);

        Report report = new Report();
        report.setGeneratedBy(generatedBy);
        report.setTargetUser(targetUser);
        report.setDepartment(department);
        report.setReportType(reportType);
        report.setReportFormat(format);
        report.setPeriodLabel(periodLabel);
        report.setFilePath(filename);

        return reportRepository.save(report);
    }

    private GeneratedReport toGeneratedReport(Report report, byte[] content, String contentType, String downloadName) {
        return new GeneratedReport(report.getId(), downloadName, contentType, content);
    }

    private IndividualReportData buildIndividualReportData(User currentUser, String periodLabel) {
        List<TeachingActivity> teachings = teachingActivityRepository.findByUserIdOrderByCreatedAtDesc(currentUser.getId())
            .stream()
            .filter(activity -> periodLabel.equals(activity.getAcademicYear()))
            .toList();

        List<SupervisionActivity> supervisions = supervisionActivityRepository.findByUserIdOrderByCreatedAtDesc(currentUser.getId())
            .stream()
            .filter(activity -> periodLabel.equals(activity.getAcademicYear()))
            .toList();

        List<ResearchActivity> researches = researchActivityRepository.findByUserIdOrderByCreatedAtDesc(currentUser.getId())
            .stream()
            .filter(activity -> periodLabel.equals(activity.getAcademicYear()))
            .toList();

        List<EventActivity> events = eventActivityRepository.findByUserIdOrderByCreatedAtDesc(currentUser.getId())
            .stream()
            .filter(activity -> periodLabel.equals(activity.getAcademicYear()))
            .toList();

        List<ExamSurveillanceActivity> surveillances = examSurveillanceActivityRepository.findByUserIdOrderByCreatedAtDesc(currentUser.getId())
            .stream()
            .filter(activity -> periodLabel.equals(activity.getAcademicYear()))
            .toList();

        List<ResponsibilityActivity> responsibilities = responsibilityActivityRepository.findByUserIdOrderByCreatedAtDesc(currentUser.getId())
            .stream()
            .filter(activity -> periodLabel.equals(activity.getAcademicYear()))
            .toList();

        BigDecimal totalPlannedHours = teachings.stream()
            .map(TeachingActivity::getPlannedHours)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalCompletedHours = teachings.stream()
            .map(TeachingActivity::getCompletedHours)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        long totalPfe = supervisions.stream()
            .filter(activity -> isPfeSupervisionType(activity.getSupervisionType()))
            .count();

        long totalSupported = supervisions.stream()
            .filter(activity -> activity.getSupervisionStatus() == StatutEncadrement.SOUTENU)
            .count();

        long totalArticles = researches.stream()
            .filter(activity ->
                activity.getPublicationType() == PublicationType.ARTICLE
                    || activity.getPublicationType() == PublicationType.PUBLICATION_ARTICLE
            )
            .count();

        long totalIndexedResearch = researches.stream()
            .filter(activity -> StringUtils.hasText(activity.getIndexingName()))
            .count();

        return new IndividualReportData(
            currentUser,
            periodLabel,
            teachings,
            supervisions,
            researches,
            events,
            surveillances,
            responsibilities,
            findEvaluationManager(currentUser),
            totalPlannedHours,
            totalCompletedHours,
            totalPfe,
            totalSupported,
            totalArticles,
            totalIndexedResearch
        );
    }

    private DepartmentReportData buildDepartmentReportData(Department department, String periodLabel) {
        List<User> departmentUsers = userRepository.findAll()
            .stream()
            .filter(user -> user.getDepartment() != null && department.getId().equals(user.getDepartment().getId()))
            .toList();

        List<TeachingActivity> teachings = teachingActivityRepository.findByUserDepartmentIdOrderByCreatedAtDesc(department.getId())
            .stream()
            .filter(activity -> periodLabel.equals(activity.getAcademicYear()))
            .toList();

        List<SupervisionActivity> supervisions = supervisionActivityRepository.findByUserDepartmentIdOrderByCreatedAtDesc(department.getId())
            .stream()
            .filter(activity -> periodLabel.equals(activity.getAcademicYear()))
            .toList();

        List<ResearchActivity> researches = researchActivityRepository.findByUserDepartmentIdOrderByCreatedAtDesc(department.getId())
            .stream()
            .filter(activity -> periodLabel.equals(activity.getAcademicYear()))
            .toList();

        BigDecimal totalCompletedHours = teachings.stream()
            .map(TeachingActivity::getCompletedHours)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new DepartmentReportData(
            department,
            periodLabel,
            departmentUsers,
            teachings,
            supervisions,
            researches,
            totalCompletedHours,
            departmentUsers.stream().filter(user -> user.getRole() == RoleType.ENSEIGNANT).count(),
            teachings.stream().filter(activity -> activity.getStatus() == com.esprit.academicplatform.common.enums.ActivityStatus.SOUMISE).count(),
            teachings.stream().filter(activity -> activity.getStatus() == com.esprit.academicplatform.common.enums.ActivityStatus.VALIDEE_DEPARTEMENT
                || activity.getStatus() == com.esprit.academicplatform.common.enums.ActivityStatus.VALIDEE_FINALE).count(),
            teachings.stream().filter(activity -> activity.getStatus() == com.esprit.academicplatform.common.enums.ActivityStatus.REJETEE).count()
        );
    }

    private InstitutionReportData buildInstitutionReportData(String periodLabel) {
        List<Department> departments = departmentRepository.findAll();
        List<User> users = userRepository.findAll();
        List<TeachingActivity> teachings = teachingActivityRepository.findAllByOrderByCreatedAtDesc()
            .stream()
            .filter(activity -> periodLabel.equals(activity.getAcademicYear()))
            .toList();
        List<SupervisionActivity> supervisions = supervisionActivityRepository.findAllByOrderByCreatedAtDesc()
            .stream()
            .filter(activity -> periodLabel.equals(activity.getAcademicYear()))
            .toList();
        List<ResearchActivity> researches = researchActivityRepository.findAllByOrderByCreatedAtDesc()
            .stream()
            .filter(activity -> periodLabel.equals(activity.getAcademicYear()))
            .toList();

        BigDecimal totalCompletedHours = teachings.stream()
            .map(TeachingActivity::getCompletedHours)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new InstitutionReportData(
            periodLabel,
            departments,
            users,
            teachings,
            supervisions,
            researches,
            totalCompletedHours,
            users.stream().filter(user -> user.getRole() == RoleType.ENSEIGNANT).count(),
            teachings.stream().filter(activity -> activity.getStatus() == com.esprit.academicplatform.common.enums.ActivityStatus.SOUMISE).count(),
            teachings.stream().filter(activity -> activity.getStatus() == com.esprit.academicplatform.common.enums.ActivityStatus.VALIDEE_DEPARTEMENT
                || activity.getStatus() == com.esprit.academicplatform.common.enums.ActivityStatus.VALIDEE_FINALE).count(),
            teachings.stream().filter(activity -> activity.getStatus() == com.esprit.academicplatform.common.enums.ActivityStatus.REJETEE).count()
        );
    }

    private byte[] buildPdfLegacy(IndividualReportData data) throws IOException, DocumentException {
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4);
            PdfWriter.getInstance(document, outputStream);
            document.open();

            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16);
            Font sectionFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12);
            Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 10);

            document.add(new Paragraph("Rapport individuel annuel", titleFont));
            document.add(new Paragraph(" "));
            document.add(new Paragraph("Nom: " + data.user().getFirstName() + " " + data.user().getLastName(), normalFont));
            document.add(new Paragraph("Email: " + data.user().getEmail(), normalFont));
            document.add(new Paragraph("Periode: " + data.periodLabel(), normalFont));
            document.add(new Paragraph(" "));

            document.add(new Paragraph("Resume", sectionFont));
            document.add(buildSummaryTable(data));
            document.add(new Paragraph(" "));

            document.add(new Paragraph("Enseignements", sectionFont));
            document.add(new Paragraph("Nombre de cours: " + data.teachings().size(), normalFont));
            for (TeachingActivity teaching : data.teachings()) {
                document.add(new Paragraph(
                    "- " + teaching.getModuleName() + " | " + teaching.getClassName() + " | "
                        + teaching.getCompletedHours() + "h realisees",
                    normalFont
                ));
            }

            document.add(new Paragraph(" "));
            document.add(new Paragraph("Encadrements", sectionFont));
            document.add(new Paragraph("Nombre d'encadrements: " + data.supervisions().size(), normalFont));
            for (SupervisionActivity supervision : data.supervisions()) {
                document.add(new Paragraph(
                    "- " + supervision.getStudentName() + " | " + supervision.getSupervisionType() + " | "
                        + supervision.getSubjectTitle(),
                    normalFont
                ));
            }

            document.add(new Paragraph(" "));
            document.add(new Paragraph("Recherche scientifique", sectionFont));
            document.add(new Paragraph("Nombre d'activités de recherche : " + data.researches().size(), normalFont));
            for (ResearchActivity research : data.researches()) {
                document.add(new Paragraph(
                    "- " + research.getTitle() + " | " + research.getPublicationType() + " | "
                        + research.getVenueName(),
                    normalFont
                ));
            }

            document.close();
            return outputStream.toByteArray();
        }
    }

    private byte[] buildDepartmentPdfLegacy(DepartmentReportData data) throws IOException, DocumentException {
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4);
            PdfWriter.getInstance(document, outputStream);
            document.open();

            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16);
            Font sectionFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12);
            Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 10);

            document.add(new Paragraph("Rapport départemental", titleFont));
            document.add(new Paragraph(" "));
            document.add(new Paragraph("Département : " + data.department().getName(), normalFont));
            document.add(new Paragraph("Periode: " + data.periodLabel(), normalFont));
            document.add(new Paragraph(" "));

            document.add(new Paragraph("Synthese", sectionFont));
            document.add(buildDepartmentSummaryTable(data));
            document.add(new Paragraph(" "));

            document.add(new Paragraph("Charge pedagogique", sectionFont));
            document.add(new Paragraph("Nombre d enseignements: " + data.teachings().size(), normalFont));
            document.add(new Paragraph("Heures realisees: " + data.totalCompletedHours().toPlainString(), normalFont));
            document.add(new Paragraph(" "));

            document.add(new Paragraph("Encadrement et recherche", sectionFont));
            document.add(new Paragraph("Encadrements: " + data.supervisions().size(), normalFont));
            document.add(new Paragraph("Recherches: " + data.researches().size(), normalFont));
            document.add(new Paragraph(" "));

            document.add(new Paragraph("Enseignants du département", sectionFont));
            for (User user : data.departmentUsers()) {
                if (user.getRole() == RoleType.ENSEIGNANT) {
                    document.add(new Paragraph("- " + user.getFirstName() + " " + user.getLastName(), normalFont));
                }
            }

            document.close();
            return outputStream.toByteArray();
        }
    }

    private byte[] buildInstitutionPdfLegacy(InstitutionReportData data) throws IOException, DocumentException {
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4);
            PdfWriter.getInstance(document, outputStream);
            document.open();

            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16);
            Font sectionFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12);
            Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 10);

            document.add(new Paragraph("Rapport institutionnel global", titleFont));
            document.add(new Paragraph(" "));
            document.add(new Paragraph("Periode: " + data.periodLabel(), normalFont));
            document.add(new Paragraph(" "));

            document.add(new Paragraph("Synthese globale", sectionFont));
            document.add(buildInstitutionSummaryTable(data));
            document.add(new Paragraph(" "));

            document.add(new Paragraph("Départements", sectionFont));
            for (Department department : data.departments()) {
                document.add(new Paragraph("- " + department.getName(), normalFont));
            }

            document.add(new Paragraph(" "));
            document.add(new Paragraph("Indicateurs academiques", sectionFont));
            document.add(new Paragraph("Enseignements: " + data.teachings().size(), normalFont));
            document.add(new Paragraph("Encadrements: " + data.supervisions().size(), normalFont));
            document.add(new Paragraph("Recherches: " + data.researches().size(), normalFont));

            document.close();
            return outputStream.toByteArray();
        }
    }

    private PdfPTable buildSummaryTableLegacy(IndividualReportData data) {
        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(100);
        addCell(table, "Total heures prévues");
        addCell(table, data.totalPlannedHours().toPlainString());
        addCell(table, "Total heures réalisées");
        addCell(table, data.totalCompletedHours().toPlainString());
        addCell(table, "Nombre d'encadrements");
        addCell(table, String.valueOf(data.supervisions().size()));
        addCell(table, "Nombre de PFE");
        addCell(table, String.valueOf(data.totalPfe()));
        addCell(table, "Encadrements soutenus");
        addCell(table, String.valueOf(data.totalSupported()));
        addCell(table, "Nombre d'activités de recherche");
        addCell(table, String.valueOf(data.researches().size()));
        addCell(table, "Articles");
        addCell(table, String.valueOf(data.totalArticles()));
        addCell(table, "Publications indexees");
        addCell(table, String.valueOf(data.totalIndexedResearch()));
        return table;
    }

    private PdfPTable buildDepartmentSummaryTableLegacy(DepartmentReportData data) {
        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(100);
        addCell(table, "Département");
        addCell(table, data.department().getName());
        addCell(table, "Utilisateurs");
        addCell(table, String.valueOf(data.departmentUsers().size()));
        addCell(table, "Enseignants");
        addCell(table, String.valueOf(data.totalTeachers()));
        addCell(table, "Enseignements");
        addCell(table, String.valueOf(data.teachings().size()));
        addCell(table, "Heures realisees");
        addCell(table, data.totalCompletedHours().toPlainString());
        addCell(table, "Encadrements");
        addCell(table, String.valueOf(data.supervisions().size()));
        addCell(table, "Recherches");
        addCell(table, String.valueOf(data.researches().size()));
        addCell(table, "Soumises");
        addCell(table, String.valueOf(data.totalSubmittedActivities()));
        addCell(table, "Validees");
        addCell(table, String.valueOf(data.totalValidatedActivities()));
        addCell(table, "Rejetees");
        addCell(table, String.valueOf(data.totalRejectedActivities()));
        return table;
    }

    private PdfPTable buildInstitutionSummaryTableLegacy(InstitutionReportData data) {
        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(100);
        addCell(table, "Départements");
        addCell(table, String.valueOf(data.departments().size()));
        addCell(table, "Utilisateurs");
        addCell(table, String.valueOf(data.users().size()));
        addCell(table, "Enseignants");
        addCell(table, String.valueOf(data.totalTeachers()));
        addCell(table, "Enseignements");
        addCell(table, String.valueOf(data.teachings().size()));
        addCell(table, "Heures realisees");
        addCell(table, data.totalCompletedHours().toPlainString());
        addCell(table, "Encadrements");
        addCell(table, String.valueOf(data.supervisions().size()));
        addCell(table, "Recherches");
        addCell(table, String.valueOf(data.researches().size()));
        addCell(table, "Soumises");
        addCell(table, String.valueOf(data.totalSubmittedActivities()));
        addCell(table, "Validees");
        addCell(table, String.valueOf(data.totalValidatedActivities()));
        addCell(table, "Rejetees");
        addCell(table, String.valueOf(data.totalRejectedActivities()));
        return table;
    }

    private void addCellLegacy(PdfPTable table, String value) {
        PdfPCell cell = new PdfPCell(new Phrase(value));
        cell.setPadding(5);
        table.addCell(cell);
    }

    private byte[] buildExcelLegacy(IndividualReportData data) throws IOException {
        try (XSSFWorkbook workbook = new XSSFWorkbook(); ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            buildSummarySheet(workbook, data);
            buildTeachingSheet(workbook, data);
            buildSupervisionSheet(workbook, data);
            buildResearchSheet(workbook, data);

            workbook.write(outputStream);
            return outputStream.toByteArray();
        }
    }

    private byte[] buildDepartmentExcelLegacy(DepartmentReportData data) throws IOException {
        try (XSSFWorkbook workbook = new XSSFWorkbook(); ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            buildDepartmentSummarySheet(workbook, data);
            buildDepartmentUsersSheet(workbook, data);
            buildDepartmentTeachingSheet(workbook, data);
            buildDepartmentResearchSheet(workbook, data);
            workbook.write(outputStream);
            return outputStream.toByteArray();
        }
    }

    private byte[] buildInstitutionExcelLegacy(InstitutionReportData data) throws IOException {
        try (XSSFWorkbook workbook = new XSSFWorkbook(); ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            buildInstitutionSummarySheet(workbook, data);
            buildInstitutionDepartmentsSheet(workbook, data);
            buildInstitutionTeachingSheet(workbook, data);
            buildInstitutionResearchSheet(workbook, data);
            workbook.write(outputStream);
            return outputStream.toByteArray();
        }
    }

    private void buildSummarySheetLegacy(XSSFWorkbook workbook, IndividualReportData data) {
        Sheet sheet = workbook.createSheet("Resume");
        int rowIndex = 0;
        rowIndex = writeRow(sheet, rowIndex, "Rapport individuel annuel");
        rowIndex = writeRow(sheet, rowIndex, "Nom", data.user().getFirstName() + " " + data.user().getLastName());
        rowIndex = writeRow(sheet, rowIndex, "Email", data.user().getEmail());
        rowIndex = writeRow(sheet, rowIndex, "Periode", data.periodLabel());
        rowIndex++;
        rowIndex = writeRow(sheet, rowIndex, "Total heures prévues", data.totalPlannedHours().toPlainString());
        rowIndex = writeRow(sheet, rowIndex, "Total heures réalisées", data.totalCompletedHours().toPlainString());
        rowIndex = writeRow(sheet, rowIndex, "Nombre d'encadrements", String.valueOf(data.supervisions().size()));
        rowIndex = writeRow(sheet, rowIndex, "Nombre de PFE", String.valueOf(data.totalPfe()));
        rowIndex = writeRow(sheet, rowIndex, "Encadrements soutenus", String.valueOf(data.totalSupported()));
        rowIndex = writeRow(sheet, rowIndex, "Nombre d'activités de recherche", String.valueOf(data.researches().size()));
        rowIndex = writeRow(sheet, rowIndex, "Articles", String.valueOf(data.totalArticles()));
        writeRow(sheet, rowIndex, "Publications indexees", String.valueOf(data.totalIndexedResearch()));
        sheet.autoSizeColumn(0);
        sheet.autoSizeColumn(1);
    }

    private void buildTeachingSheetLegacy(XSSFWorkbook workbook, IndividualReportData data) {
        Sheet sheet = workbook.createSheet("Enseignements");
        int rowIndex = 0;
        Row header = sheet.createRow(rowIndex++);
        header.createCell(0).setCellValue("Module");
        header.createCell(1).setCellValue("Classe");
        header.createCell(2).setCellValue("Semestre");
        header.createCell(3).setCellValue("Heures prevues");
        header.createCell(4).setCellValue("Heures realisees");

        for (TeachingActivity teaching : data.teachings()) {
            Row row = sheet.createRow(rowIndex++);
            row.createCell(0).setCellValue(teaching.getModuleName());
            row.createCell(1).setCellValue(teaching.getClassName());
            row.createCell(2).setCellValue(teaching.getSemester().name());
            row.createCell(3).setCellValue(teaching.getPlannedHours().doubleValue());
            row.createCell(4).setCellValue(teaching.getCompletedHours().doubleValue());
        }
    }

    private void buildSupervisionSheetLegacy(XSSFWorkbook workbook, IndividualReportData data) {
        Sheet sheet = workbook.createSheet("Encadrements");
        int rowIndex = 0;
        Row header = sheet.createRow(rowIndex++);
        header.createCell(0).setCellValue("Etudiant");
        header.createCell(1).setCellValue("Type");
        header.createCell(2).setCellValue("Sujet");
        header.createCell(3).setCellValue("Statut");
        header.createCell(4).setCellValue("Role jury");

        for (SupervisionActivity supervision : data.supervisions()) {
            Row row = sheet.createRow(rowIndex++);
            row.createCell(0).setCellValue(supervision.getStudentName());
            row.createCell(1).setCellValue(supervision.getSupervisionType().name());
            row.createCell(2).setCellValue(supervision.getSubjectTitle());
            row.createCell(3).setCellValue(supervision.getSupervisionStatus().name());
            row.createCell(4).setCellValue(supervision.getRoleInJury().name());
        }
    }

    private void buildResearchSheetLegacy(XSSFWorkbook workbook, IndividualReportData data) {
        Sheet sheet = workbook.createSheet("Recherche");
        int rowIndex = 0;
        Row header = sheet.createRow(rowIndex++);
        header.createCell(0).setCellValue("Titre");
        header.createCell(1).setCellValue("Type");
        header.createCell(2).setCellValue("Revue/Conference");
        header.createCell(3).setCellValue("Annee");
        header.createCell(4).setCellValue("Indexation");
        header.createCell(5).setCellValue("DOI");

        for (ResearchActivity research : data.researches()) {
            Row row = sheet.createRow(rowIndex++);
            row.createCell(0).setCellValue(research.getTitle());
            row.createCell(1).setCellValue(research.getPublicationType().name());
            row.createCell(2).setCellValue(research.getVenueName());
            row.createCell(3).setCellValue(research.getPublicationYear());
            row.createCell(4).setCellValue(research.getIndexingName() != null ? research.getIndexingName() : "");
            row.createCell(5).setCellValue(research.getDoi() != null ? research.getDoi() : "");
        }
    }

    private void buildDepartmentSummarySheetLegacy(XSSFWorkbook workbook, DepartmentReportData data) {
        Sheet sheet = workbook.createSheet("Résumé département");
        int rowIndex = 0;
        rowIndex = writeRow(sheet, rowIndex, "Rapport départemental");
        rowIndex = writeRow(sheet, rowIndex, "Département", data.department().getName());
        rowIndex = writeRow(sheet, rowIndex, "Periode", data.periodLabel());
        rowIndex++;
        rowIndex = writeRow(sheet, rowIndex, "Utilisateurs", String.valueOf(data.departmentUsers().size()));
        rowIndex = writeRow(sheet, rowIndex, "Enseignants", String.valueOf(data.totalTeachers()));
        rowIndex = writeRow(sheet, rowIndex, "Enseignements", String.valueOf(data.teachings().size()));
        rowIndex = writeRow(sheet, rowIndex, "Heures realisees", data.totalCompletedHours().toPlainString());
        rowIndex = writeRow(sheet, rowIndex, "Encadrements", String.valueOf(data.supervisions().size()));
        rowIndex = writeRow(sheet, rowIndex, "Recherches", String.valueOf(data.researches().size()));
        rowIndex = writeRow(sheet, rowIndex, "Soumises", String.valueOf(data.totalSubmittedActivities()));
        rowIndex = writeRow(sheet, rowIndex, "Validees", String.valueOf(data.totalValidatedActivities()));
        writeRow(sheet, rowIndex, "Rejetees", String.valueOf(data.totalRejectedActivities()));
    }

    private void buildDepartmentUsersSheetLegacy(XSSFWorkbook workbook, DepartmentReportData data) {
        Sheet sheet = workbook.createSheet("Enseignants");
        int rowIndex = 0;
        Row header = sheet.createRow(rowIndex++);
        header.createCell(0).setCellValue("Nom");
        header.createCell(1).setCellValue("Email");
        header.createCell(2).setCellValue("Role");

        for (User user : data.departmentUsers()) {
            Row row = sheet.createRow(rowIndex++);
            row.createCell(0).setCellValue(user.getFirstName() + " " + user.getLastName());
            row.createCell(1).setCellValue(user.getEmail());
            row.createCell(2).setCellValue(user.getRole().name());
        }
    }

    private void buildDepartmentTeachingSheetLegacy(XSSFWorkbook workbook, DepartmentReportData data) {
        Sheet sheet = workbook.createSheet("Enseignements");
        int rowIndex = 0;
        Row header = sheet.createRow(rowIndex++);
        header.createCell(0).setCellValue("Enseignant");
        header.createCell(1).setCellValue("Module");
        header.createCell(2).setCellValue("Classe");
        header.createCell(3).setCellValue("Heures realisees");
        header.createCell(4).setCellValue("Statut");

        for (TeachingActivity teaching : data.teachings()) {
            Row row = sheet.createRow(rowIndex++);
            row.createCell(0).setCellValue(teaching.getUser().getFirstName() + " " + teaching.getUser().getLastName());
            row.createCell(1).setCellValue(teaching.getModuleName());
            row.createCell(2).setCellValue(teaching.getClassName());
            row.createCell(3).setCellValue(teaching.getCompletedHours().doubleValue());
            row.createCell(4).setCellValue(teaching.getStatus().name());
        }
    }

    private void buildDepartmentResearchSheetLegacy(XSSFWorkbook workbook, DepartmentReportData data) {
        Sheet sheet = workbook.createSheet("Recherche");
        int rowIndex = 0;
        Row header = sheet.createRow(rowIndex++);
        header.createCell(0).setCellValue("Enseignant");
        header.createCell(1).setCellValue("Titre");
        header.createCell(2).setCellValue("Type");
        header.createCell(3).setCellValue("Lieu");

        for (ResearchActivity research : data.researches()) {
            Row row = sheet.createRow(rowIndex++);
            row.createCell(0).setCellValue(research.getUser().getFirstName() + " " + research.getUser().getLastName());
            row.createCell(1).setCellValue(research.getTitle());
            row.createCell(2).setCellValue(research.getPublicationType().name());
            row.createCell(3).setCellValue(research.getVenueName());
        }
    }

    private void buildInstitutionSummarySheetLegacy(XSSFWorkbook workbook, InstitutionReportData data) {
        Sheet sheet = workbook.createSheet("Resume global");
        int rowIndex = 0;
        rowIndex = writeRow(sheet, rowIndex, "Rapport institutionnel");
        rowIndex = writeRow(sheet, rowIndex, "Periode", data.periodLabel());
        rowIndex++;
        rowIndex = writeRow(sheet, rowIndex, "Départements", String.valueOf(data.departments().size()));
        rowIndex = writeRow(sheet, rowIndex, "Utilisateurs", String.valueOf(data.users().size()));
        rowIndex = writeRow(sheet, rowIndex, "Enseignants", String.valueOf(data.totalTeachers()));
        rowIndex = writeRow(sheet, rowIndex, "Enseignements", String.valueOf(data.teachings().size()));
        rowIndex = writeRow(sheet, rowIndex, "Heures realisees", data.totalCompletedHours().toPlainString());
        rowIndex = writeRow(sheet, rowIndex, "Encadrements", String.valueOf(data.supervisions().size()));
        rowIndex = writeRow(sheet, rowIndex, "Recherches", String.valueOf(data.researches().size()));
        rowIndex = writeRow(sheet, rowIndex, "Soumises", String.valueOf(data.totalSubmittedActivities()));
        rowIndex = writeRow(sheet, rowIndex, "Validees", String.valueOf(data.totalValidatedActivities()));
        writeRow(sheet, rowIndex, "Rejetees", String.valueOf(data.totalRejectedActivities()));
    }

    private void buildInstitutionDepartmentsSheetLegacy(XSSFWorkbook workbook, InstitutionReportData data) {
        Sheet sheet = workbook.createSheet("Départements");
        int rowIndex = 0;
        Row header = sheet.createRow(rowIndex++);
        header.createCell(0).setCellValue("Département");

        for (Department department : data.departments()) {
            Row row = sheet.createRow(rowIndex++);
            row.createCell(0).setCellValue(department.getName());
        }
    }

    private void buildInstitutionTeachingSheetLegacy(XSSFWorkbook workbook, InstitutionReportData data) {
        Sheet sheet = workbook.createSheet("Enseignements");
        int rowIndex = 0;
        Row header = sheet.createRow(rowIndex++);
        header.createCell(0).setCellValue("Enseignant");
        header.createCell(1).setCellValue("Département");
        header.createCell(2).setCellValue("Module");
        header.createCell(3).setCellValue("Heures realisees");

        for (TeachingActivity teaching : data.teachings()) {
            Row row = sheet.createRow(rowIndex++);
            row.createCell(0).setCellValue(teaching.getUser().getFirstName() + " " + teaching.getUser().getLastName());
            row.createCell(1).setCellValue(teaching.getUser().getDepartment() != null ? teaching.getUser().getDepartment().getName() : "");
            row.createCell(2).setCellValue(teaching.getModuleName());
            row.createCell(3).setCellValue(teaching.getCompletedHours().doubleValue());
        }
    }

    private void buildInstitutionResearchSheetLegacy(XSSFWorkbook workbook, InstitutionReportData data) {
        Sheet sheet = workbook.createSheet("Recherche");
        int rowIndex = 0;
        Row header = sheet.createRow(rowIndex++);
        header.createCell(0).setCellValue("Enseignant");
        header.createCell(1).setCellValue("Département");
        header.createCell(2).setCellValue("Titre");
        header.createCell(3).setCellValue("Type");

        for (ResearchActivity research : data.researches()) {
            Row row = sheet.createRow(rowIndex++);
            row.createCell(0).setCellValue(research.getUser().getFirstName() + " " + research.getUser().getLastName());
            row.createCell(1).setCellValue(research.getUser().getDepartment() != null ? research.getUser().getDepartment().getName() : "");
            row.createCell(2).setCellValue(research.getTitle());
            row.createCell(3).setCellValue(research.getPublicationType().name());
        }
    }

    private int writeRowLegacy(Sheet sheet, int rowIndex, String firstValue) {
        Row row = sheet.createRow(rowIndex);
        row.createCell(0).setCellValue(firstValue);
        return rowIndex + 1;
    }

    private int writeRowLegacy(Sheet sheet, int rowIndex, String firstValue, String secondValue) {
        Row row = sheet.createRow(rowIndex);
        row.createCell(0).setCellValue(firstValue);
        row.createCell(1).setCellValue(secondValue);
        return rowIndex + 1;
    }

    private byte[] buildPdf(IndividualReportData data) throws IOException, DocumentException {
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4, 28, 28, 26, 24);
            PdfWriter.getInstance(document, outputStream);
            PdfTheme theme = createPdfTheme();
            document.open();

            addEvaluationTemplateHeader(document, theme, data);
            document.add(buildEvaluationSingleLineTable("Date et heure de l'entretien", DISPLAY_DATE_FORMAT.format(LocalDateTime.now()), theme));
            document.add(buildEvaluationTeacherIdentityTable(data, theme));
            document.add(buildEvaluationManagerIdentityTable(data, theme));

            addEvaluationSectionHeading(document, "A. Bilan de l'annee ecoulee", theme);
            addEvaluationSubHeading(document, "1. Bilan Global", theme);
            document.add(buildEvaluationBilanGlobalTable(data, theme));

            addEvaluationSubHeading(document, "3. Evaluation de l'atteinte des objectifs", theme);
            document.add(buildEvaluationObjectiveReviewTable(data, theme));

            addEvaluationSubHeading(document, "4. Appreciation globale", theme);
            document.add(buildEvaluationScaleTable(theme));

            addEvaluationSectionHeading(document, "B. Objectifs pour l'annee a venir", theme);
            Paragraph objectiveIntro = new Paragraph(
                "Pour les enseignants, outre les grandes missions de l'Ecole (formation et recherche), "
                    + "il conviendra de considerer une possible contribution a l'international, a la valorisation, "
                    + "aux liens avec le monde economique et a la vie collective de l'Ecole.",
                theme.body()
            );
            objectiveIntro.setSpacingAfter(6f);
            document.add(objectiveIntro);
            document.add(buildEvaluationNextObjectivesTable(data, theme));

            document.add(buildEvaluationManagerCommentsTable(data, theme));
            document.add(buildEvaluationSignatureTable(data, theme));
            addPdfFooterNote(document, theme);
            document.close();
            return outputStream.toByteArray();
        }
    }

    private void addEvaluationTemplateHeader(Document document, PdfTheme theme, IndividualReportData data) throws DocumentException {
        PdfPTable header = new PdfPTable(new float[] { 3.8f, 2.2f });
        header.setWidthPercentage(100);
        header.setSpacingAfter(12f);

        PdfPCell leftCell = createEvaluationCell("", theme.body(), ESPRIT_SOFT, Element.ALIGN_LEFT);
        leftCell.setPadding(16f);

        Paragraph title = new Paragraph("Entretien Professionnel", theme.title());
        title.setSpacingAfter(3f);
        leftCell.addElement(title);

        Paragraph subTitle = new Paragraph("Fiche d'evaluation", theme.section());
        subTitle.setSpacingAfter(8f);
        leftCell.addElement(subTitle);

        Paragraph year = new Paragraph("Annee " + data.periodLabel(), theme.bodyStrong());
        year.setSpacingAfter(8f);
        leftCell.addElement(year);

        Paragraph teacher = new Paragraph("Enseignant: " + buildUserDisplayName(data.user()), theme.body());
        teacher.setSpacingAfter(3f);
        leftCell.addElement(teacher);

        Paragraph department = new Paragraph(
            "Departement: " + safeValue(data.user().getDepartment() != null ? data.user().getDepartment().getName() : null),
            theme.body()
        );
        leftCell.addElement(department);

        PdfPCell rightCell = createEvaluationCell("", theme.body(), ESPRIT_BLACK, Element.ALIGN_LEFT);
        rightCell.setPadding(16f);
        rightCell.setVerticalAlignment(Element.ALIGN_MIDDLE);

        Paragraph badge = new Paragraph("ESPRIT", theme.whiteStrong());
        badge.setSpacingAfter(8f);
        rightCell.addElement(badge);

        Paragraph scope = new Paragraph("Rapport individuel annuel", theme.tableHeader());
        scope.setSpacingAfter(10f);
        rightCell.addElement(scope);

        Paragraph generatedAt = new Paragraph("Genere le " + DISPLAY_DATE_FORMAT.format(LocalDateTime.now()), theme.whiteSmall());
        generatedAt.setSpacingAfter(4f);
        rightCell.addElement(generatedAt);

        Paragraph email = new Paragraph(safeValue(data.user().getEmail()), theme.whiteSmall());
        rightCell.addElement(email);

        header.addCell(leftCell);
        header.addCell(rightCell);
        document.add(header);
    }

    private PdfPTable buildEvaluationSingleLineTable(String label, String value, PdfTheme theme) throws DocumentException {
        PdfPTable table = new PdfPTable(new float[] { 2.5f, 3.5f });
        table.setWidthPercentage(100);
        table.setSpacingAfter(10f);

        table.addCell(createEvaluationCell(label, theme.bodyStrong(), ESPRIT_SOFT, Element.ALIGN_LEFT));
        table.addCell(createEvaluationCell(value, theme.body(), Color.WHITE, Element.ALIGN_LEFT));
        return table;
    }

    private PdfPTable buildEvaluationTeacherIdentityTable(IndividualReportData data, PdfTheme theme) throws DocumentException {
        PdfPTable table = new PdfPTable(new float[] { 2f, 3.4f });
        table.setWidthPercentage(100);
        table.setSpacingAfter(8f);

        table.addCell(createEvaluationCell("Enseignant", theme.tableHeader(), ESPRIT_RED, Element.ALIGN_LEFT, 2, 1));
        table.addCell(createEvaluationCell("Nom & prenom", theme.bodyStrong(), ESPRIT_SOFT, Element.ALIGN_LEFT));
        table.addCell(createEvaluationCell(buildUserDisplayName(data.user()), theme.body(), Color.WHITE, Element.ALIGN_LEFT));
        table.addCell(createEvaluationCell("Grade", theme.bodyStrong(), ESPRIT_SOFT, Element.ALIGN_LEFT));
        table.addCell(createEvaluationCell(
            data.user().getTeacherType() != null ? humanize(data.user().getTeacherType().name()) : "Enseignant",
            theme.body(),
            Color.WHITE,
            Element.ALIGN_LEFT
        ));
        table.addCell(createEvaluationCell("Date de recrutement", theme.bodyStrong(), ESPRIT_SOFT, Element.ALIGN_LEFT));
        table.addCell(createEvaluationCell(DISPLAY_SHORT_DATE_FORMAT.format(data.user().getCreatedAt()), theme.body(), Color.WHITE, Element.ALIGN_LEFT));
        table.addCell(createEvaluationCell("Specialite", theme.bodyStrong(), ESPRIT_SOFT, Element.ALIGN_LEFT));
        table.addCell(createEvaluationCell(
            safeValue(data.user().getDepartment() != null ? data.user().getDepartment().getName() : null),
            theme.body(),
            Color.WHITE,
            Element.ALIGN_LEFT
        ));
        table.addCell(createEvaluationCell("Unite de recherche", theme.bodyStrong(), ESPRIT_SOFT, Element.ALIGN_LEFT));
        table.addCell(createEvaluationCell(
            safeValue(data.user().getDepartment() != null ? data.user().getDepartment().getName() : null),
            theme.body(),
            Color.WHITE,
            Element.ALIGN_LEFT
        ));
        return table;
    }

    private PdfPTable buildEvaluationManagerIdentityTable(IndividualReportData data, PdfTheme theme) throws DocumentException {
        PdfPTable table = new PdfPTable(new float[] { 2f, 3.4f });
        table.setWidthPercentage(100);
        table.setSpacingAfter(10f);

        User manager = data.evaluationManager();
        table.addCell(createEvaluationCell(
            "Responsable hierarchique en charge de l'evaluation",
            theme.tableHeader(),
            ESPRIT_BLACK,
            Element.ALIGN_LEFT,
            2,
            1
        ));
        table.addCell(createEvaluationCell("Nom & prenom", theme.bodyStrong(), ESPRIT_SOFT, Element.ALIGN_LEFT));
        table.addCell(createEvaluationCell(buildUserDisplayName(manager), theme.body(), Color.WHITE, Element.ALIGN_LEFT));
        table.addCell(createEvaluationCell("Fonction", theme.bodyStrong(), ESPRIT_SOFT, Element.ALIGN_LEFT));
        table.addCell(createEvaluationCell(resolveManagerRole(manager), theme.body(), Color.WHITE, Element.ALIGN_LEFT));
        return table;
    }

    private void addEvaluationSectionHeading(Document document, String title, PdfTheme theme) throws DocumentException {
        Paragraph heading = new Paragraph(title, theme.section());
        heading.setSpacingBefore(6f);
        heading.setSpacingAfter(4f);
        document.add(heading);
    }

    private void addEvaluationSubHeading(Document document, String title, PdfTheme theme) throws DocumentException {
        Paragraph heading = new Paragraph(title, theme.metricValue());
        heading.setSpacingAfter(5f);
        document.add(heading);
    }

    private PdfPTable buildEvaluationBilanGlobalTable(IndividualReportData data, PdfTheme theme) throws DocumentException {
        long semesterOneDeclarations = countTeachingDeclarationsBySemester(data.teachings(), "S1");
        long semesterTwoDeclarations = countTeachingDeclarationsBySemester(data.teachings(), "S2");
        long semesterOneGroups = countDistinctGroupsBySemester(data.teachings(), "S1");
        long semesterTwoGroups = countDistinctGroupsBySemester(data.teachings(), "S2");
        BigDecimal semesterOneHours = sumCompletedHoursBySemester(data.teachings(), "S1");
        BigDecimal semesterTwoHours = sumCompletedHoursBySemester(data.teachings(), "S2");
        long moduleCount = data.teachings().stream()
            .map(TeachingActivity::getModuleName)
            .filter(StringUtils::hasText)
            .distinct()
            .count();
        long newModuleCount = data.teachings().stream()
            .filter(teaching -> teaching.getNewCourseHours() != null && teaching.getNewCourseHours().compareTo(BigDecimal.ZERO) > 0)
            .count();
        int syllabusCount = data.teachings().stream()
            .mapToInt(teaching -> teaching.getSyllabusCount() != null ? teaching.getSyllabusCount() : 0)
            .sum();
        long examDesignedCount = data.teachings().stream().filter(TeachingActivity::isExamElaborated).count();
        long carFilesCount = data.teachings().stream().filter(TeachingActivity::isCarFileElaborated).count();
        long coordinationCount = data.teachings().stream().filter(TeachingActivity::isCoordination).count();
        long partnershipCount = data.teachings().stream().filter(teaching -> teaching.getPartnershipDeclarationType() != null).count();

        long integratedProjects = countSupervisionByType(data.supervisions(), "PI");
        long academicSupervisions = data.supervisions().stream()
            .filter(supervision -> supervision.getSupervisionType() == SupervisionType.PFE_ENCADREMENT_ACADEMIQUE)
            .count();
        long jurySupervisions = data.supervisions().stream()
            .filter(supervision -> supervision.getRoleInJury() != null
                && ("RAPPORTEUR".equals(supervision.getRoleInJury().name())
                || "PRESIDENT_JURY".equals(supervision.getRoleInJury().name())))
            .count();
        long seminarSupervisions = countSupervisionByType(data.supervisions(), "SEMINAIRE");
        long app0Supervisions = countSupervisionByType(data.supervisions(), "APP0");
        long otherPedagogicActivities = data.supervisions().stream()
            .filter(supervision -> supervision.getSupervisionType() != null
                && supervision.getSupervisionType() != SupervisionType.PFE_ENCADREMENT_ACADEMIQUE
                && supervision.getSupervisionType() != SupervisionType.PFE_RAPPORTEUR
                && supervision.getSupervisionType() != SupervisionType.PFE_PRESIDENT_JURY
                && supervision.getSupervisionType() != SupervisionType.SEMINAIRE
                && supervision.getSupervisionType() != SupervisionType.APP0)
            .count();

        long researchProjects = data.researches().stream()
            .filter(research -> research.getPublicationType() != null && research.getPublicationType().name().contains("PROJET"))
            .count();
        long didacticProductions = data.researches().stream()
            .filter(research -> research.getPublicationType() != null
                && ("PRESENTATION_TRAVAIL".equals(research.getPublicationType().name())
                || "COMMUNICATION".equals(research.getPublicationType().name())))
            .count();
        java.util.List<String> indexedLabels = data.researches().stream()
            .map(ResearchActivity::getIndexingName)
            .filter(StringUtils::hasText)
            .distinct()
            .limit(4)
            .toList();
        long scientificEvents = data.events().size();
        long animationEvents = data.events().stream()
            .filter(event -> event.getEventType() != null
                && ("SEMINAIRE".equals(event.getEventType().name())
                || "WORKSHOP".equals(event.getEventType().name())
                || "COLLOQUE".equals(event.getEventType().name())))
            .count();
        long clubInvolvement = data.responsibilities().stream()
            .filter(responsibility -> responsibility.getResponsibilityType() != null
                && "AUTRE".equals(responsibility.getResponsibilityType().name()))
            .count();
        long pedagogicResponsibilities = data.responsibilities().size() + coordinationCount;

        java.util.List<String> teachingLanguages = data.teachings().stream()
            .map(TeachingActivity::getLanguage)
            .filter(StringUtils::hasText)
            .distinct()
            .limit(4)
            .toList();
        java.util.List<String> teachingModes = data.teachings().stream()
            .filter(teaching -> teaching.getTeachingMode() != null)
            .map(teaching -> humanize(teaching.getTeachingMode().name()))
            .distinct()
            .limit(4)
            .toList();

        PdfPTable table = new PdfPTable(new float[] { 1.4f, 2.6f, 3.6f });
        table.setWidthPercentage(100);
        table.setSpacingAfter(12f);

        addEvaluationBilanGroup(
            table,
            "Enseignements",
            List.of(
                new String[] {
                    "Charge semestre 1",
                    "Declarations: " + semesterOneDeclarations + " | Groupes: " + semesterOneGroups + " | Heures realisees: " + formatDecimal(semesterOneHours) + " h"
                },
                new String[] {
                    "Charge semestre 2",
                    "Declarations: " + semesterTwoDeclarations + " | Groupes: " + semesterTwoGroups + " | Heures realisees: " + formatDecimal(semesterTwoHours) + " h"
                },
                new String[] {
                    "Nombre de modules differents",
                    String.valueOf(moduleCount)
                },
                new String[] {
                    "Nombre de nouveaux modules",
                    String.valueOf(newModuleCount)
                },
                new String[] {
                    "Production de supports pedagogiques",
                    "Syllabus: " + syllabusCount + " | Examens elabores: " + examDesignedCount + " | Fiches CAR: " + carFilesCount
                }
            ),
            theme
        );

        addEvaluationBilanGroup(
            table,
            "Encadrement",
            List.of(
                new String[] { "Projets integres", String.valueOf(integratedProjects) },
                new String[] { "PFE encadres", String.valueOf(academicSupervisions) },
                new String[] {
                    "PFE rapportes et presides",
                    "Rapp./Presid.: " + jurySupervisions + " | Soutenus: " + data.totalSupported()
                },
                new String[] {
                    "Encadrement seminaires / APP0",
                    "Seminaires: " + seminarSupervisions + " | APP0: " + app0Supervisions
                },
                new String[] { "Autres activites pedagogiques", String.valueOf(otherPedagogicActivities) }
            ),
            theme
        );

        addEvaluationBilanGroup(
            table,
            "RDI",
            List.of(
                new String[] {
                    "Activites de recherche",
                    "Total: " + data.researches().size() + " | Articles: " + data.totalArticles() + " | Projets: " + researchProjects
                },
                new String[] { "Publications indexees", String.valueOf(data.totalIndexedResearch()) },
                new String[] { "Production didactique", String.valueOf(didacticProductions) },
                new String[] {
                    "Produits / outils utilises",
                    indexedLabels.isEmpty() ? "Aucun outil/indexation declare" : String.join(", ", indexedLabels)
                },
                new String[] { "Organisation de manifestations scientifiques", String.valueOf(scientificEvents) }
            ),
            theme
        );

        addEvaluationBilanGroup(
            table,
            "Activites au sein de l'ecole",
            List.of(
                new String[] { "Organisation d'evenements", String.valueOf(data.events().size()) },
                new String[] { "Animation de formations / conferences", String.valueOf(animationEvents) },
                new String[] { "Implication dans les clubs", String.valueOf(clubInvolvement) },
                new String[] { "Responsabilite pedagogique et/ou administrative", String.valueOf(pedagogicResponsibilities) },
                new String[] { "Activite ESB - Environnement socio-economique / communautaire", String.valueOf(partnershipCount) },
                new String[] { "Initiation de projets dans le cadre du departement", String.valueOf(researchProjects) }
            ),
            theme
        );

        table.addCell(createEvaluationCell("Animation et coordination pedagogique", theme.tableHeader(), ESPRIT_BLACK, Element.ALIGN_LEFT, 3, 1));
        table.addCell(createEvaluationCell(
            "Nature des ressources pedagogiques utilisees",
            theme.bodyStrong(),
            ESPRIT_SOFT,
            Element.ALIGN_LEFT
        ));
        table.addCell(createEvaluationCell(
            "Langues: " + (teachingLanguages.isEmpty() ? "A preciser" : String.join(", ", teachingLanguages))
                + " | Modalites: " + (teachingModes.isEmpty() ? "A preciser" : String.join(", ", teachingModes)),
            theme.body(),
            Color.WHITE,
            Element.ALIGN_LEFT,
            2,
            1
        ));

        table.addCell(createEvaluationCell(
            "Methodes d'evaluation de l'acquisition",
            theme.bodyStrong(),
            ESPRIT_SOFT,
            Element.ALIGN_LEFT
        ));
        table.addCell(createEvaluationCell(
            "Examens elabores: " + examDesignedCount + " | Encadrements soutenus: " + data.totalSupported(),
            theme.body(),
            Color.WHITE,
            Element.ALIGN_LEFT,
            2,
            1
        ));

        table.addCell(createEvaluationCell(
            "Travail de concertation entre equipe disciplinaire",
            theme.bodyStrong(),
            ESPRIT_SOFT,
            Element.ALIGN_LEFT
        ));
        table.addCell(createEvaluationCell(
            coordinationCount > 0
                ? "Coordination declaree sur " + coordinationCount + " activite(s)."
                : "Aucune coordination declaree pour la periode.",
            theme.body(),
            Color.WHITE,
            Element.ALIGN_LEFT,
            2,
            1
        ));

        table.addCell(createEvaluationCell(
            "Demarches autour de projets / actions innovantes",
            theme.bodyStrong(),
            ESPRIT_SOFT,
            Element.ALIGN_LEFT
        ));
        table.addCell(createEvaluationCell(
            "Nouveaux modules: " + newModuleCount + " | Projets de recherche: " + researchProjects,
            theme.body(),
            Color.WHITE,
            Element.ALIGN_LEFT,
            2,
            1
        ));

        table.addCell(createEvaluationCell(
            "Production de ressources pedagogiques",
            theme.bodyStrong(),
            ESPRIT_SOFT,
            Element.ALIGN_LEFT
        ));
        table.addCell(createEvaluationCell(
            "Syllabus: " + syllabusCount + " | Fichiers CAR: " + carFilesCount,
            theme.body(),
            Color.WHITE,
            Element.ALIGN_LEFT,
            2,
            1
        ));

        table.addCell(createEvaluationCell("Autre", theme.bodyStrong(), ESPRIT_SOFT, Element.ALIGN_LEFT));
        table.addCell(createEvaluationCell(
            "Surveillances declarees: " + data.surveillances().size() + " | Periode: " + data.periodLabel(),
            theme.body(),
            Color.WHITE,
            Element.ALIGN_LEFT,
            2,
            1
        ));
        return table;
    }

    private void addEvaluationBilanGroup(PdfPTable table, String groupLabel, List<String[]> rows, PdfTheme theme) throws DocumentException {
        if (rows.isEmpty()) {
            table.addCell(createEvaluationCell(groupLabel, theme.tableHeader(), ESPRIT_RED, Element.ALIGN_LEFT));
            table.addCell(createEvaluationCell("-", theme.bodyStrong(), ESPRIT_SOFT, Element.ALIGN_LEFT));
            table.addCell(createEvaluationCell("-", theme.body(), Color.WHITE, Element.ALIGN_LEFT));
            return;
        }

        PdfPCell groupCell = createEvaluationCell(groupLabel, theme.tableHeader(), ESPRIT_RED, Element.ALIGN_LEFT, 1, rows.size());
        groupCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        table.addCell(groupCell);

        for (int index = 0; index < rows.size(); index++) {
            String[] row = rows.get(index);
            Color detailBackground = index % 2 == 0 ? Color.WHITE : ESPRIT_SOFT;
            table.addCell(createEvaluationCell(row[0], theme.bodyStrong(), ESPRIT_SOFT, Element.ALIGN_LEFT));
            table.addCell(createEvaluationCell(row[1], theme.body(), detailBackground, Element.ALIGN_LEFT));
        }
    }

    private PdfPTable buildEvaluationObjectiveReviewTable(IndividualReportData data, PdfTheme theme) throws DocumentException {
        long academicSupervisions = data.supervisions().stream()
            .filter(supervision -> supervision.getSupervisionType() == SupervisionType.PFE_ENCADREMENT_ACADEMIQUE)
            .count();
        long jurySupervisions = data.supervisions().stream()
            .filter(supervision -> supervision.getRoleInJury() != null
                && ("RAPPORTEUR".equals(supervision.getRoleInJury().name())
                || "PRESIDENT_JURY".equals(supervision.getRoleInJury().name())))
            .count();
        long teachingGroups = data.teachings().stream()
            .map(TeachingActivity::getClassName)
            .filter(StringUtils::hasText)
            .distinct()
            .count();
        long syllabusCount = data.teachings().stream()
            .mapToInt(teaching -> teaching.getSyllabusCount() != null ? teaching.getSyllabusCount() : 0)
            .sum();
        long eventAndResponsibilityCount = data.events().size() + data.responsibilities().size();

        double teachingRatio = calculateRatio(data.totalCompletedHours(), data.totalPlannedHours());
        String teachingStatus = resolveObjectiveStatusByRatio(teachingRatio);
        String supervisionStatus = resolveObjectiveStatusByGap(academicSupervisions, jurySupervisions);
        String researchStatus = resolveObjectiveStatusByRatio(data.totalIndexedResearch(), Math.max(data.totalArticles(), 1L));
        String communityStatus = resolveObjectiveStatusByRatio(eventAndResponsibilityCount, 2L);
        String surveillanceStatus = resolveObjectiveStatusByGap(data.surveillances().size(), teachingGroups);
        String supportStatus = resolveObjectiveStatusByRatio(syllabusCount + data.teachings().stream().filter(TeachingActivity::isExamElaborated).count(), Math.max(data.teachings().size(), 1L));

        PdfPTable table = new PdfPTable(new float[] { 3.2f, 1.2f, 2.6f });
        table.setWidthPercentage(100);
        table.setSpacingAfter(10f);

        table.addCell(createEvaluationCell("Rappel des objectifs fixes pour l'annee precedente", theme.tableHeader(), ESPRIT_RED, Element.ALIGN_LEFT));
        table.addCell(createEvaluationCell("Atteinte", theme.tableHeader(), ESPRIT_RED, Element.ALIGN_CENTER));
        table.addCell(createEvaluationCell("Observations", theme.tableHeader(), ESPRIT_RED, Element.ALIGN_LEFT));

        addObjectiveRow(
            table,
            "Respect du volume horaire planifie",
            teachingStatus,
            "Prevu: " + formatDecimal(data.totalPlannedHours()) + " h | Realise: " + formatDecimal(data.totalCompletedHours()) + " h",
            theme
        );
        addObjectiveRow(
            table,
            "Equilibre entre encadrement academique et jury",
            supervisionStatus,
            "Academique: " + academicSupervisions + " | Jury: " + jurySupervisions,
            theme
        );
        addObjectiveRow(
            table,
            "Production scientifique et indexation",
            researchStatus,
            "Articles: " + data.totalArticles() + " | Indexees: " + data.totalIndexedResearch(),
            theme
        );
        addObjectiveRow(
            table,
            "Contribution a la vie de l'ecole",
            communityStatus,
            "Evenements + responsabilites: " + eventAndResponsibilityCount,
            theme
        );
        addObjectiveRow(
            table,
            "Equilibre enseignement / surveillance",
            surveillanceStatus,
            "Groupes enseignes: " + teachingGroups + " | Surveillances: " + data.surveillances().size(),
            theme
        );
        addObjectiveRow(
            table,
            "Qualite des supports pedagogiques",
            supportStatus,
            "Syllabus: " + syllabusCount + " | Examens elabores: " + data.teachings().stream().filter(TeachingActivity::isExamElaborated).count(),
            theme
        );

        return table;
    }

    private void addObjectiveRow(PdfPTable table, String objective, String status, String observation, PdfTheme theme) throws DocumentException {
        table.addCell(createEvaluationCell(objective, theme.bodyStrong(), ESPRIT_SOFT, Element.ALIGN_LEFT));
        table.addCell(createEvaluationCell(status, theme.bodyStrong(), Color.WHITE, Element.ALIGN_CENTER));
        table.addCell(createEvaluationCell(observation, theme.body(), Color.WHITE, Element.ALIGN_LEFT));
    }

    private PdfPTable buildEvaluationScaleTable(PdfTheme theme) throws DocumentException {
        PdfPTable table = new PdfPTable(new float[] { 1f, 1f, 1f, 1f, 1f });
        table.setWidthPercentage(100);
        table.setSpacingAfter(10f);

        table.addCell(createEvaluationCell("1/ Insatisfaisant", theme.tableHeader(), ESPRIT_RED, Element.ALIGN_CENTER));
        table.addCell(createEvaluationCell("2/ A ameliorer", theme.tableHeader(), ESPRIT_RED, Element.ALIGN_CENTER));
        table.addCell(createEvaluationCell("3/ Satisfaisant", theme.tableHeader(), ESPRIT_RED, Element.ALIGN_CENTER));
        table.addCell(createEvaluationCell("4/ Tres satisfaisant", theme.tableHeader(), ESPRIT_RED, Element.ALIGN_CENTER));
        table.addCell(createEvaluationCell("5/ Exceptionnel", theme.tableHeader(), ESPRIT_RED, Element.ALIGN_CENTER));

        table.addCell(createEvaluationCell(
            "Ne repond pas de maniere adequate aux attentes essentielles.",
            theme.small(),
            ESPRIT_SOFT,
            Element.ALIGN_LEFT
        ));
        table.addCell(createEvaluationCell(
            "Atteint les attentes de base avec des ameliorations necessaires.",
            theme.small(),
            Color.WHITE,
            Element.ALIGN_LEFT
        ));
        table.addCell(createEvaluationCell(
            "Atteint les attentes de maniere fiable sur les domaines cles.",
            theme.small(),
            ESPRIT_SOFT,
            Element.ALIGN_LEFT
        ));
        table.addCell(createEvaluationCell(
            "Depasse souvent les attentes et contribue au rayonnement de l'ecole.",
            theme.small(),
            Color.WHITE,
            Element.ALIGN_LEFT
        ));
        table.addCell(createEvaluationCell(
            "Surpasse constamment les attentes sur tous les aspects de ses fonctions.",
            theme.small(),
            ESPRIT_SOFT,
            Element.ALIGN_LEFT
        ));
        return table;
    }

    private PdfPTable buildEvaluationNextObjectivesTable(IndividualReportData data, PdfTheme theme) throws DocumentException {
        PdfPTable table = new PdfPTable(new float[] { 2.8f, 1.1f, 2.2f, 2.2f });
        table.setWidthPercentage(100);
        table.setSpacingAfter(10f);

        table.addCell(createEvaluationCell("Objectifs", theme.tableHeader(), ESPRIT_RED, Element.ALIGN_LEFT));
        table.addCell(createEvaluationCell("Delais", theme.tableHeader(), ESPRIT_RED, Element.ALIGN_CENTER));
        table.addCell(createEvaluationCell(
            "Moyens necessaires : budget, ressources, appui managerial, ...",
            theme.tableHeader(),
            ESPRIT_RED,
            Element.ALIGN_LEFT
        ));
        table.addCell(createEvaluationCell(
            "Indicateurs : echeance envisagee, resultat attendu, ...",
            theme.tableHeader(),
            ESPRIT_RED,
            Element.ALIGN_LEFT
        ));

        java.util.List<String[]> rows = List.of(
            new String[] {
                "Travail de recherche en cours:\nEn collaboration avec mon directeur de these, Houssem Haddar et Thi Phong Nguyen, "
                    + "nous travaillons sur une nouvelle publication dans la continuite de l'article publie en 2025.",
                "Objectif presque atteint, article en cours de redaction.",
                "Encadrement scientifique + temps de recherche.",
                "Resultat attendu: Publication scientifique."
            },
            new String[] {
                "Travail de recherche en cours:\nProjet de validation numerique d'un travail publie par Mourad Bellassoued, "
                    + "Chaima Moufid et Masahiro Yamamoto (2019).",
                "Partie litterature : realisee.\nPartie application numerique : en cours / au debut.",
                "Ressources de calcul + collaboration equipe.",
                "Validation numerique finalisee."
            },
            new String[] {
                "Travail de recherche a planifier:\nProjet University Sustainability Performance Index "
                    + "en collaboration avec Hela Hammami, Chaima Moufid et Aymen Ben Brik.",
                "En partie litterature.",
                "Cadre de modelisation dynamique + coordination.",
                "Article scientifique complet soumis."
            },
            new String[] {
                "Participation a la comite d'organisation de la journee scientifique et du Hackathon AIXCYBER2025."
                    + "\nSynthese periode " + data.periodLabel() + " : enseignements " + data.teachings().size()
                    + ", encadrements " + data.supervisions().size() + ", recherches " + data.researches().size() + ".",
                "Annuel",
                "Implication continue dans la vie de l'Ecole.",
                "Contribution visible dans les activites collectives."
            }
        );

        for (String[] row : rows) {
            table.addCell(createEvaluationCell(row[0], theme.body(), Color.WHITE, Element.ALIGN_LEFT));
            table.addCell(createEvaluationCell(row[1], theme.bodyStrong(), ESPRIT_SOFT, Element.ALIGN_CENTER));
            table.addCell(createEvaluationCell(row[2], theme.body(), Color.WHITE, Element.ALIGN_LEFT));
            table.addCell(createEvaluationCell(row[3], theme.body(), ESPRIT_SOFT, Element.ALIGN_LEFT));
        }
        return table;
    }

    private PdfPTable buildEvaluationManagerCommentsTable(IndividualReportData data, PdfTheme theme) throws DocumentException {
        String strengths = "Volume realise: " + formatDecimal(data.totalCompletedHours()) + " h | "
            + "Recherches: " + data.researches().size() + " | Encadrements soutenus: " + data.totalSupported();
        String satisfactions = "Evenements: " + data.events().size() + " | Responsabilites: " + data.responsibilities().size()
            + " | Surveillances: " + data.surveillances().size();

        long academicSupervisions = data.supervisions().stream()
            .filter(supervision -> supervision.getSupervisionType() == SupervisionType.PFE_ENCADREMENT_ACADEMIQUE)
            .count();
        long jurySupervisions = data.supervisions().stream()
            .filter(supervision -> supervision.getRoleInJury() != null
                && ("RAPPORTEUR".equals(supervision.getRoleInJury().name())
                || "PRESIDENT_JURY".equals(supervision.getRoleInJury().name())))
            .count();
        String progress = "Points de progression: equilibrer academique (" + academicSupervisions + ") et jury (" + jurySupervisions + ")"
            + ", renforcer indexation (" + data.totalIndexedResearch() + "/" + Math.max(data.totalArticles(), 1L) + ").";

        PdfPTable table = new PdfPTable(new float[] { 1.5f, 4.5f });
        table.setWidthPercentage(100);
        table.setSpacingAfter(10f);

        table.addCell(createEvaluationCell("", theme.body(), ESPRIT_SOFT, Element.ALIGN_LEFT));
        table.addCell(createEvaluationCell(
            "Appreciations du responsable ayant conduit l'entretien",
            theme.tableHeader(),
            ESPRIT_BLACK,
            Element.ALIGN_LEFT
        ));
        table.addCell(createEvaluationCell("Points forts", theme.bodyStrong(), ESPRIT_SOFT, Element.ALIGN_LEFT));
        table.addCell(createEvaluationCell(strengths, theme.body(), Color.WHITE, Element.ALIGN_LEFT));
        table.addCell(createEvaluationCell("Points satisfaisants", theme.bodyStrong(), ESPRIT_SOFT, Element.ALIGN_LEFT));
        table.addCell(createEvaluationCell(satisfactions, theme.body(), Color.WHITE, Element.ALIGN_LEFT));
        table.addCell(createEvaluationCell("Points de progression possible", theme.bodyStrong(), ESPRIT_SOFT, Element.ALIGN_LEFT));
        table.addCell(createEvaluationCell(progress, theme.body(), Color.WHITE, Element.ALIGN_LEFT));

        return table;
    }

    private PdfPTable buildEvaluationSignatureTable(IndividualReportData data, PdfTheme theme) throws DocumentException {
        PdfPTable table = new PdfPTable(new float[] { 1f, 1f, 1f });
        table.setWidthPercentage(100);
        table.setSpacingAfter(8f);

        table.addCell(createEvaluationCell("Nom prenom & signature\nDe l'enseignant", theme.bodyStrong(), ESPRIT_SOFT, Element.ALIGN_LEFT));
        table.addCell(createEvaluationCell("Nom prenom & signature\ndu responsable N+1", theme.bodyStrong(), ESPRIT_SOFT, Element.ALIGN_LEFT));
        table.addCell(createEvaluationCell("Nom prenom & signature\ndu responsable N+2", theme.bodyStrong(), ESPRIT_SOFT, Element.ALIGN_LEFT));
        table.addCell(createEvaluationCell("Date " + DISPLAY_SHORT_DATE_FORMAT.format(LocalDateTime.now()), theme.body(), Color.WHITE, Element.ALIGN_LEFT));
        table.addCell(createEvaluationCell("Date " + DISPLAY_SHORT_DATE_FORMAT.format(LocalDateTime.now()), theme.body(), Color.WHITE, Element.ALIGN_LEFT));
        table.addCell(createEvaluationCell("Date " + DISPLAY_SHORT_DATE_FORMAT.format(LocalDateTime.now()), theme.body(), Color.WHITE, Element.ALIGN_LEFT));

        return table;
    }

    private PdfPCell createEvaluationCell(
        String text,
        Font font,
        Color backgroundColor,
        int horizontalAlignment
    ) {
        return createEvaluationCell(text, font, backgroundColor, horizontalAlignment, 1, 1);
    }

    private PdfPCell createEvaluationCell(
        String text,
        Font font,
        Color backgroundColor,
        int horizontalAlignment,
        int colspan,
        int rowspan
    ) {
        PdfPCell cell = new PdfPCell(new Phrase(StringUtils.hasText(text) ? text : "", font));
        cell.setPadding(7f);
        cell.setBorderColor(ESPRIT_BORDER);
        cell.setHorizontalAlignment(horizontalAlignment);
        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        if (backgroundColor != null) {
            cell.setBackgroundColor(backgroundColor);
        }
        if (colspan > 1) {
            cell.setColspan(colspan);
        }
        if (rowspan > 1) {
            cell.setRowspan(rowspan);
        }
        return cell;
    }

    private long countTeachingDeclarationsBySemester(List<TeachingActivity> teachings, String semester) {
        return teachings.stream()
            .filter(teaching -> teaching.getSemester() != null && semester.equals(teaching.getSemester().name()))
            .count();
    }

    private long countDistinctGroupsBySemester(List<TeachingActivity> teachings, String semester) {
        return teachings.stream()
            .filter(teaching -> teaching.getSemester() != null && semester.equals(teaching.getSemester().name()))
            .map(TeachingActivity::getClassName)
            .filter(StringUtils::hasText)
            .distinct()
            .count();
    }

    private BigDecimal sumCompletedHoursBySemester(List<TeachingActivity> teachings, String semester) {
        return teachings.stream()
            .filter(teaching -> teaching.getSemester() != null && semester.equals(teaching.getSemester().name()))
            .map(TeachingActivity::getCompletedHours)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private long countSupervisionByType(List<SupervisionActivity> supervisions, String supervisionType) {
        return supervisions.stream()
            .filter(supervision -> supervision.getSupervisionType() != null && supervisionType.equals(supervision.getSupervisionType().name()))
            .count();
    }

    private double calculateRatio(BigDecimal value, BigDecimal reference) {
        if (reference == null || reference.compareTo(BigDecimal.ZERO) <= 0) {
            return value != null && value.compareTo(BigDecimal.ZERO) > 0 ? 1d : 0d;
        }

        return value.doubleValue() / reference.doubleValue();
    }

    private String resolveObjectiveStatusByRatio(double ratio) {
        if (ratio >= 1d) {
            return "Atteint";
        }
        if (ratio >= 0.7d) {
            return "Partiel";
        }
        return "A renforcer";
    }

    private String resolveObjectiveStatusByRatio(long value, long reference) {
        if (reference <= 0) {
            return value > 0 ? "Atteint" : "A renforcer";
        }

        return resolveObjectiveStatusByRatio((double) value / (double) reference);
    }

    private String resolveObjectiveStatusByGap(long left, long right) {
        long gap = Math.abs(left - right);
        if (gap == 0) {
            return "Atteint";
        }
        if (gap <= 2) {
            return "Partiel";
        }
        return "A renforcer";
    }

    private String buildUserDisplayName(User user) {
        if (user == null) {
            return "-";
        }

        String firstName = StringUtils.hasText(user.getFirstName()) ? user.getFirstName().trim() : "";
        String lastName = StringUtils.hasText(user.getLastName()) ? user.getLastName().trim() : "";
        String fullName = (firstName + " " + lastName).trim();
        if (StringUtils.hasText(fullName)) {
            return fullName;
        }
        return safeValue(user.getEmail());
    }

    private String resolveManagerRole(User manager) {
        if (manager == null || manager.getRole() == null) {
            return "A completer";
        }
        if (manager.getRole() == RoleType.CHEF_DEPARTEMENT) {
            return "Chef de departement";
        }
        return humanize(manager.getRole().name());
    }

    private byte[] buildDepartmentPdf(DepartmentReportData data) throws IOException, DocumentException {
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4, 36, 36, 32, 36);
            PdfWriter.getInstance(document, outputStream);
            PdfTheme theme = createPdfTheme();
            document.open();

            addPdfHeader(
                document,
                theme,
                "Rapport departemental",
                data.department().getName(),
                List.of(
                    "Periode: " + data.periodLabel(),
                    "Enseignants: " + data.totalTeachers(),
                    "Utilisateurs rattaches: " + data.departmentUsers().size()
                )
            );

            document.add(buildMetricCards(
                List.of(
                    new MetricCard("Enseignants", String.valueOf(data.totalTeachers()), "Capacite pedagogique"),
                    new MetricCard("Enseignements", String.valueOf(data.teachings().size()), "Activites suivies"),
                    new MetricCard("Heures realisees", formatDecimal(data.totalCompletedHours()) + " h", "Charge consolidee"),
                    new MetricCard("Activites validees", String.valueOf(data.totalValidatedActivities()), "Workflow traite")
                ),
                theme
            ));

            addPdfSection(document, theme, "Synthese departementale", "Lecture rapide de la performance du departement.");
            document.add(buildKeyValueTable(
                List.of(
                    new MetricCard("Departement", data.department().getName(), null),
                    new MetricCard("Utilisateurs", String.valueOf(data.departmentUsers().size()), null),
                    new MetricCard("Enseignants", String.valueOf(data.totalTeachers()), null),
                    new MetricCard("Enseignements", String.valueOf(data.teachings().size()), null),
                    new MetricCard("Heures realisees", formatDecimal(data.totalCompletedHours()) + " h", null),
                    new MetricCard("Encadrements", String.valueOf(data.supervisions().size()), null),
                    new MetricCard("Recherches", String.valueOf(data.researches().size()), null),
                    new MetricCard("Activites soumises", String.valueOf(data.totalSubmittedActivities()), null),
                    new MetricCard("Activites validees", String.valueOf(data.totalValidatedActivities()), null),
                    new MetricCard("Activites rejetees", String.valueOf(data.totalRejectedActivities()), null)
                ),
                theme
            ));

            addPdfSection(document, theme, "Equipe pedagogique", "Liste des utilisateurs rattaches au departement.");
            document.add(buildDataTable(
                new String[] { "Nom", "Email", "Role" },
                data.departmentUsers().stream()
                    .map(user -> new String[] {
                        user.getFirstName() + " " + user.getLastName(),
                        safeValue(user.getEmail()),
                        humanize(user.getRole().name())
                    })
                    .toList(),
                new float[] { 1.6f, 2.2f, 1.2f },
                theme
            ));

            addPdfSection(document, theme, "Production d'enseignement", "Modules et volumes horaires declares.");
            document.add(buildDataTable(
                new String[] { "Enseignant", "Module", "Classe", "Heures", "Statut" },
                data.teachings().stream()
                    .map(teaching -> new String[] {
                        teaching.getUser().getFirstName() + " " + teaching.getUser().getLastName(),
                        safeValue(teaching.getModuleName()),
                        safeValue(teaching.getClassName()),
                        formatDecimal(teaching.getCompletedHours()),
                        humanize(teaching.getStatus().name())
                    })
                    .toList(),
                new float[] { 1.6f, 2.1f, 1.5f, 0.8f, 1.0f },
                theme
            ));

            addPdfSection(document, theme, "Production scientifique", "Travaux de recherche rattaches au departement.");
            document.add(buildDataTable(
                new String[] { "Enseignant", "Titre", "Type", "Lieu" },
                data.researches().stream()
                    .map(research -> new String[] {
                        research.getUser().getFirstName() + " " + research.getUser().getLastName(),
                        safeValue(research.getTitle()),
                        humanize(research.getPublicationType().name()),
                        safeValue(research.getVenueName())
                    })
                    .toList(),
                new float[] { 1.5f, 3.2f, 1.2f, 1.8f },
                theme
            ));

            addPdfFooterNote(document, theme);
            document.close();
            return outputStream.toByteArray();
        }
    }

    private byte[] buildInstitutionPdf(InstitutionReportData data) throws IOException, DocumentException {
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4, 36, 36, 32, 36);
            PdfWriter.getInstance(document, outputStream);
            PdfTheme theme = createPdfTheme();
            document.open();

            addPdfHeader(
                document,
                theme,
                "Rapport institutionnel global",
                "Pilotage de la performance academique",
                List.of(
                    "Periode: " + data.periodLabel(),
                    "Departements suivis: " + data.departments().size(),
                    "Utilisateurs actifs: " + data.users().size()
                )
            );

            document.add(buildMetricCards(
                List.of(
                    new MetricCard("Departements", String.valueOf(data.departments().size()), "Couverture institutionnelle"),
                    new MetricCard("Utilisateurs", String.valueOf(data.users().size()), "Population suivie"),
                    new MetricCard("Heures realisees", formatDecimal(data.totalCompletedHours()) + " h", "Charge consolidee"),
                    new MetricCard("Activites validees", String.valueOf(data.totalValidatedActivities()), "Workflow global")
                ),
                theme
            ));

            addPdfSection(document, theme, "Synthese institutionnelle", "Vue consolidee du suivi academique a l'echelle Esprit.");
            document.add(buildKeyValueTable(
                List.of(
                    new MetricCard("Departements", String.valueOf(data.departments().size()), null),
                    new MetricCard("Utilisateurs", String.valueOf(data.users().size()), null),
                    new MetricCard("Enseignants", String.valueOf(data.totalTeachers()), null),
                    new MetricCard("Enseignements", String.valueOf(data.teachings().size()), null),
                    new MetricCard("Heures realisees", formatDecimal(data.totalCompletedHours()) + " h", null),
                    new MetricCard("Encadrements", String.valueOf(data.supervisions().size()), null),
                    new MetricCard("Recherches", String.valueOf(data.researches().size()), null),
                    new MetricCard("Activites soumises", String.valueOf(data.totalSubmittedActivities()), null),
                    new MetricCard("Activites validees", String.valueOf(data.totalValidatedActivities()), null),
                    new MetricCard("Activites rejetees", String.valueOf(data.totalRejectedActivities()), null)
                ),
                theme
            ));

            addPdfSection(document, theme, "Departements couverts", "Perimetre institutionnel inclus dans ce rapport.");
            document.add(buildDataTable(
                new String[] { "Departement" },
                data.departments().stream()
                    .map(department -> new String[] { safeValue(department.getName()) })
                    .toList(),
                new float[] { 1f },
                theme
            ));

            addPdfSection(document, theme, "Consolidation des enseignements", "Principaux enregistrements pedagogiques de la periode.");
            document.add(buildDataTable(
                new String[] { "Enseignant", "Departement", "Module", "Heures" },
                data.teachings().stream()
                    .map(teaching -> new String[] {
                        teaching.getUser().getFirstName() + " " + teaching.getUser().getLastName(),
                        safeValue(teaching.getUser().getDepartment() != null ? teaching.getUser().getDepartment().getName() : null),
                        safeValue(teaching.getModuleName()),
                        formatDecimal(teaching.getCompletedHours())
                    })
                    .toList(),
                new float[] { 1.8f, 1.8f, 2.5f, 0.9f },
                theme
            ));

            addPdfSection(document, theme, "Consolidation de la recherche", "Publications et productions scientifiques rattachees a Esprit.");
            document.add(buildDataTable(
                new String[] { "Enseignant", "Departement", "Titre", "Type" },
                data.researches().stream()
                    .map(research -> new String[] {
                        research.getUser().getFirstName() + " " + research.getUser().getLastName(),
                        safeValue(research.getUser().getDepartment() != null ? research.getUser().getDepartment().getName() : null),
                        safeValue(research.getTitle()),
                        humanize(research.getPublicationType().name())
                    })
                    .toList(),
                new float[] { 1.8f, 1.7f, 3.0f, 1.0f },
                theme
            ));

            addPdfFooterNote(document, theme);
            document.close();
            return outputStream.toByteArray();
        }
    }

    private PdfTheme createPdfTheme() {
        return new PdfTheme(
            FontFactory.getFont(FontFactory.HELVETICA_BOLD, 28, ESPRIT_BLACK),
            FontFactory.getFont(FontFactory.HELVETICA_BOLD, 28, ESPRIT_GREY),
            FontFactory.getFont(FontFactory.HELVETICA_BOLD, 20, ESPRIT_BLACK),
            FontFactory.getFont(FontFactory.HELVETICA, 10, ESPRIT_BLACK),
            FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14, ESPRIT_BLACK),
            FontFactory.getFont(FontFactory.HELVETICA, 10, ESPRIT_BLACK),
            FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, ESPRIT_BLACK),
            FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, ESPRIT_RED),
            FontFactory.getFont(FontFactory.HELVETICA, 9, new Color(92, 97, 108)),
            FontFactory.getFont(FontFactory.HELVETICA, 8, new Color(108, 112, 121)),
            FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, Color.WHITE),
            FontFactory.getFont(FontFactory.HELVETICA_BOLD, 17, Color.WHITE),
            FontFactory.getFont(FontFactory.HELVETICA, 8, Color.WHITE)
        );
    }

    private void addPdfHeader(
        Document document,
        PdfTheme theme,
        String reportTitle,
        String subtitle,
        List<String> contextLines
    ) throws DocumentException {
        PdfPTable header = new PdfPTable(new float[] { 3.4f, 1.3f });
        header.setWidthPercentage(100);
        header.setSpacingAfter(16f);

        PdfPCell leftCell = new PdfPCell();
        leftCell.setBorder(Rectangle.NO_BORDER);
        leftCell.setBackgroundColor(ESPRIT_SOFT);
        leftCell.setPadding(18f);

        Paragraph brand = new Paragraph();
        brand.setLeading(24f);
        brand.add(new Chunk("espr", theme.brandBlack()));
        brand.add(new Chunk("it", theme.brandGrey()));
        brand.setSpacingAfter(2f);
        leftCell.addElement(brand);

        Paragraph tagline = new Paragraph(BRAND_TAGLINE, theme.metricLabel());
        tagline.setSpacingAfter(4f);
        leftCell.addElement(tagline);

        Paragraph group = new Paragraph(BRAND_GROUP, theme.small());
        group.setSpacingAfter(12f);
        leftCell.addElement(group);

        Paragraph title = new Paragraph(reportTitle, theme.title());
        title.setSpacingAfter(6f);
        leftCell.addElement(title);

        Paragraph subtitleParagraph = new Paragraph(subtitle, theme.subtitle());
        subtitleParagraph.setSpacingAfter(10f);
        leftCell.addElement(subtitleParagraph);

        for (String line : contextLines) {
            Paragraph paragraph = new Paragraph(line, theme.bodyStrong());
            paragraph.setSpacingAfter(3f);
            leftCell.addElement(paragraph);
        }

        PdfPCell rightCell = new PdfPCell();
        rightCell.setBorder(Rectangle.NO_BORDER);
        rightCell.setBackgroundColor(ESPRIT_RED);
        rightCell.setPadding(18f);
        rightCell.setVerticalAlignment(Element.ALIGN_MIDDLE);

        Paragraph badge = new Paragraph("RAPPORT OFFICIEL", theme.tableHeader());
        badge.setSpacingAfter(14f);
        rightCell.addElement(badge);

        Paragraph school = new Paragraph("ESPRIT", theme.whiteStrong());
        school.setSpacingAfter(10f);
        rightCell.addElement(school);

        Paragraph scope = new Paragraph("Performance academique", theme.whiteSmall());
        scope.setSpacingAfter(12f);
        rightCell.addElement(scope);

        Paragraph generated = new Paragraph(
            "Genere le\n" + DISPLAY_DATE_FORMAT.format(LocalDateTime.now()),
            theme.whiteSmall()
        );
        rightCell.addElement(generated);

        header.addCell(leftCell);
        header.addCell(rightCell);
        document.add(header);
    }

    private void addPdfSection(Document document, PdfTheme theme, String title, String description) throws DocumentException {
        Paragraph heading = new Paragraph(title, theme.section());
        heading.setSpacingBefore(8f);
        heading.setSpacingAfter(4f);
        document.add(heading);

        if (StringUtils.hasText(description)) {
            Paragraph details = new Paragraph(description, theme.small());
            details.setSpacingAfter(8f);
            document.add(details);
        }
    }

    private PdfPTable buildMetricCards(List<MetricCard> metrics, PdfTheme theme) throws DocumentException {
        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(100);
        table.setWidths(new float[] { 1f, 1f });
        table.setSpacingAfter(16f);

        for (int index = 0; index < metrics.size(); index++) {
            MetricCard metric = metrics.get(index);
            boolean primary = index == 0;

            PdfPCell cell = new PdfPCell();
            cell.setPadding(14f);
            cell.setBorderColor(ESPRIT_BORDER);
            cell.setBorderWidth(0.8f);
            cell.setBackgroundColor(primary ? ESPRIT_RED : (index % 2 == 0 ? Color.WHITE : ESPRIT_SOFT));

            Paragraph label = new Paragraph(metric.label(), primary ? theme.tableHeader() : theme.metricLabel());
            label.setSpacingAfter(6f);
            cell.addElement(label);

            Paragraph value = new Paragraph(metric.value(), primary ? theme.whiteStrong() : theme.metricValue());
            value.setSpacingAfter(4f);
            cell.addElement(value);

            if (StringUtils.hasText(metric.note())) {
                cell.addElement(new Paragraph(metric.note(), primary ? theme.whiteSmall() : theme.small()));
            }

            table.addCell(cell);
        }

        if (metrics.size() % 2 != 0) {
            PdfPCell emptyCell = new PdfPCell(new Phrase(""));
            emptyCell.setBorder(Rectangle.NO_BORDER);
            table.addCell(emptyCell);
        }

        return table;
    }

    private PdfPTable buildKeyValueTable(List<MetricCard> rows, PdfTheme theme) throws DocumentException {
        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(100);
        table.setWidths(new float[] { 2.4f, 1.1f });
        table.setSpacingAfter(14f);

        for (MetricCard row : rows) {
            PdfPCell labelCell = new PdfPCell(new Phrase(row.label(), theme.bodyStrong()));
            labelCell.setBackgroundColor(ESPRIT_SOFT);
            labelCell.setBorderColor(ESPRIT_BORDER);
            labelCell.setPadding(8f);
            labelCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
            table.addCell(labelCell);

            PdfPCell valueCell = new PdfPCell(new Phrase(row.value(), theme.body()));
            valueCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
            valueCell.setBorderColor(ESPRIT_BORDER);
            valueCell.setPadding(8f);
            valueCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
            table.addCell(valueCell);
        }

        return table;
    }

    private PdfPTable buildDataTable(
        String[] headers,
        List<String[]> rows,
        float[] widths,
        PdfTheme theme
    ) throws DocumentException {
        PdfPTable table = new PdfPTable(headers.length);
        table.setWidthPercentage(100);
        table.setWidths(widths);
        table.setSpacingAfter(16f);

        for (String header : headers) {
            PdfPCell headerCell = new PdfPCell(new Phrase(header, theme.tableHeader()));
            headerCell.setBackgroundColor(ESPRIT_RED);
            headerCell.setBorderColor(ESPRIT_RED);
            headerCell.setPadding(8f);
            headerCell.setHorizontalAlignment(Element.ALIGN_CENTER);
            table.addCell(headerCell);
        }

        if (rows.isEmpty()) {
            PdfPCell emptyCell = new PdfPCell(new Phrase("Aucune donnee disponible pour cette section.", theme.body()));
            emptyCell.setColspan(headers.length);
            emptyCell.setPadding(10f);
            emptyCell.setBorderColor(ESPRIT_BORDER);
            table.addCell(emptyCell);
            return table;
        }

        for (int rowIndex = 0; rowIndex < rows.size(); rowIndex++) {
            String[] row = rows.get(rowIndex);
            Color background = rowIndex % 2 == 0 ? Color.WHITE : ESPRIT_SOFT;

            for (String value : row) {
                PdfPCell cell = new PdfPCell(new Phrase(safeValue(value), theme.body()));
                cell.setPadding(8f);
                cell.setBorderColor(ESPRIT_BORDER);
                cell.setBackgroundColor(background);
                table.addCell(cell);
            }
        }

        return table;
    }

    private void addPdfFooterNote(Document document, PdfTheme theme) throws DocumentException {
        Paragraph note = new Paragraph(
            "Document genere automatiquement par la plateforme de suivi academique Esprit le "
                + DISPLAY_DATE_FORMAT.format(LocalDateTime.now()) + ".",
            theme.small()
        );
        note.setSpacingBefore(4f);
        document.add(note);
    }

    private record MetricCard(String label, String value, String note) {
    }

    private record PdfTheme(
        Font brandBlack,
        Font brandGrey,
        Font title,
        Font subtitle,
        Font section,
        Font body,
        Font bodyStrong,
        Font metricValue,
        Font metricLabel,
        Font small,
        Font tableHeader,
        Font whiteStrong,
        Font whiteSmall
    ) {
    }

    private PdfPTable buildSummaryTable(IndividualReportData data) throws DocumentException {
        return buildKeyValueTable(
            List.of(
                new MetricCard("Total heures prevues", formatDecimal(data.totalPlannedHours()) + " h", null),
                new MetricCard("Total heures realisees", formatDecimal(data.totalCompletedHours()) + " h", null),
                new MetricCard("Nombre d'encadrements", String.valueOf(data.supervisions().size()), null),
                new MetricCard("Nombre de PFE", String.valueOf(data.totalPfe()), null),
                new MetricCard("Encadrements soutenus", String.valueOf(data.totalSupported()), null),
                new MetricCard("Articles", String.valueOf(data.totalArticles()), null),
                new MetricCard("Publications indexees", String.valueOf(data.totalIndexedResearch()), null)
            ),
            createPdfTheme()
        );
    }

    private PdfPTable buildDepartmentSummaryTable(DepartmentReportData data) throws DocumentException {
        return buildKeyValueTable(
            List.of(
                new MetricCard("Departement", data.department().getName(), null),
                new MetricCard("Utilisateurs", String.valueOf(data.departmentUsers().size()), null),
                new MetricCard("Enseignants", String.valueOf(data.totalTeachers()), null),
                new MetricCard("Enseignements", String.valueOf(data.teachings().size()), null),
                new MetricCard("Heures realisees", formatDecimal(data.totalCompletedHours()) + " h", null),
                new MetricCard("Encadrements", String.valueOf(data.supervisions().size()), null),
                new MetricCard("Recherches", String.valueOf(data.researches().size()), null),
                new MetricCard("Validees", String.valueOf(data.totalValidatedActivities()), null)
            ),
            createPdfTheme()
        );
    }

    private PdfPTable buildInstitutionSummaryTable(InstitutionReportData data) throws DocumentException {
        return buildKeyValueTable(
            List.of(
                new MetricCard("Departements", String.valueOf(data.departments().size()), null),
                new MetricCard("Utilisateurs", String.valueOf(data.users().size()), null),
                new MetricCard("Enseignants", String.valueOf(data.totalTeachers()), null),
                new MetricCard("Enseignements", String.valueOf(data.teachings().size()), null),
                new MetricCard("Heures realisees", formatDecimal(data.totalCompletedHours()) + " h", null),
                new MetricCard("Encadrements", String.valueOf(data.supervisions().size()), null),
                new MetricCard("Recherches", String.valueOf(data.researches().size()), null),
                new MetricCard("Validees", String.valueOf(data.totalValidatedActivities()), null)
            ),
            createPdfTheme()
        );
    }

    private void addCell(PdfPTable table, String value) {
        PdfPCell cell = new PdfPCell(new Phrase(safeValue(value)));
        cell.setPadding(6f);
        cell.setBorderColor(ESPRIT_BORDER);
        table.addCell(cell);
    }

    private byte[] buildExcel(IndividualReportData data) throws IOException {
        try (XSSFWorkbook workbook = new XSSFWorkbook(); ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            ExcelTheme theme = createExcelTheme(workbook);
            buildSummarySheet(workbook, theme, data);
            buildTeachingSheet(workbook, theme, data);
            buildSupervisionSheet(workbook, theme, data);
            buildResearchSheet(workbook, theme, data);
            workbook.write(outputStream);
            return outputStream.toByteArray();
        }
    }

    private byte[] buildDepartmentExcel(DepartmentReportData data) throws IOException {
        try (XSSFWorkbook workbook = new XSSFWorkbook(); ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            ExcelTheme theme = createExcelTheme(workbook);
            buildDepartmentSummarySheet(workbook, theme, data);
            buildDepartmentUsersSheet(workbook, theme, data);
            buildDepartmentTeachingSheet(workbook, theme, data);
            buildDepartmentResearchSheet(workbook, theme, data);
            workbook.write(outputStream);
            return outputStream.toByteArray();
        }
    }

    private byte[] buildInstitutionExcel(InstitutionReportData data) throws IOException {
        try (XSSFWorkbook workbook = new XSSFWorkbook(); ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            ExcelTheme theme = createExcelTheme(workbook);
            buildInstitutionSummarySheet(workbook, theme, data);
            buildInstitutionDepartmentsSheet(workbook, theme, data);
            buildInstitutionTeachingSheet(workbook, theme, data);
            buildInstitutionResearchSheet(workbook, theme, data);
            workbook.write(outputStream);
            return outputStream.toByteArray();
        }
    }

    private void buildSummarySheet(XSSFWorkbook workbook, IndividualReportData data) {
        buildSummarySheet(workbook, createExcelTheme(workbook), data);
    }

    private void buildTeachingSheet(XSSFWorkbook workbook, IndividualReportData data) {
        buildTeachingSheet(workbook, createExcelTheme(workbook), data);
    }

    private void buildSupervisionSheet(XSSFWorkbook workbook, IndividualReportData data) {
        buildSupervisionSheet(workbook, createExcelTheme(workbook), data);
    }

    private void buildResearchSheet(XSSFWorkbook workbook, IndividualReportData data) {
        buildResearchSheet(workbook, createExcelTheme(workbook), data);
    }

    private void buildDepartmentSummarySheet(XSSFWorkbook workbook, DepartmentReportData data) {
        buildDepartmentSummarySheet(workbook, createExcelTheme(workbook), data);
    }

    private void buildDepartmentUsersSheet(XSSFWorkbook workbook, DepartmentReportData data) {
        buildDepartmentUsersSheet(workbook, createExcelTheme(workbook), data);
    }

    private void buildDepartmentTeachingSheet(XSSFWorkbook workbook, DepartmentReportData data) {
        buildDepartmentTeachingSheet(workbook, createExcelTheme(workbook), data);
    }

    private void buildDepartmentResearchSheet(XSSFWorkbook workbook, DepartmentReportData data) {
        buildDepartmentResearchSheet(workbook, createExcelTheme(workbook), data);
    }

    private void buildInstitutionSummarySheet(XSSFWorkbook workbook, InstitutionReportData data) {
        buildInstitutionSummarySheet(workbook, createExcelTheme(workbook), data);
    }

    private void buildInstitutionDepartmentsSheet(XSSFWorkbook workbook, InstitutionReportData data) {
        buildInstitutionDepartmentsSheet(workbook, createExcelTheme(workbook), data);
    }

    private void buildInstitutionTeachingSheet(XSSFWorkbook workbook, InstitutionReportData data) {
        buildInstitutionTeachingSheet(workbook, createExcelTheme(workbook), data);
    }

    private void buildInstitutionResearchSheet(XSSFWorkbook workbook, InstitutionReportData data) {
        buildInstitutionResearchSheet(workbook, createExcelTheme(workbook), data);
    }

    private int writeRow(Sheet sheet, int rowIndex, String firstValue) {
        return writeRowLegacy(sheet, rowIndex, firstValue);
    }

    private int writeRow(Sheet sheet, int rowIndex, String firstValue, String secondValue) {
        return writeRowLegacy(sheet, rowIndex, firstValue, secondValue);
    }

    private ExcelTheme createExcelTheme(XSSFWorkbook workbook) {
        XSSFFont brandBlackFont = workbook.createFont();
        brandBlackFont.setFontName("Arial");
        brandBlackFont.setBold(true);
        brandBlackFont.setFontHeightInPoints((short) 24);
        brandBlackFont.setColor(new XSSFColor(EXCEL_BLACK, null));

        XSSFFont brandGreyFont = workbook.createFont();
        brandGreyFont.setFontName("Arial");
        brandGreyFont.setBold(true);
        brandGreyFont.setFontHeightInPoints((short) 24);
        brandGreyFont.setColor(new XSSFColor(EXCEL_GREY, null));

        XSSFFont subtitleFont = workbook.createFont();
        subtitleFont.setFontName("Arial");
        subtitleFont.setFontHeightInPoints((short) 10);
        subtitleFont.setColor(new XSSFColor(EXCEL_BLACK, null));

        XSSFFont titleFont = workbook.createFont();
        titleFont.setFontName("Arial");
        titleFont.setBold(true);
        titleFont.setFontHeightInPoints((short) 15);
        titleFont.setColor(new XSSFColor(Color.WHITE, null));

        XSSFFont metaFont = workbook.createFont();
        metaFont.setFontName("Arial");
        metaFont.setFontHeightInPoints((short) 10);
        metaFont.setColor(new XSSFColor(EXCEL_BLACK, null));

        XSSFFont sectionFont = workbook.createFont();
        sectionFont.setFontName("Arial");
        sectionFont.setBold(true);
        sectionFont.setFontHeightInPoints((short) 11);
        sectionFont.setColor(new XSSFColor(Color.WHITE, null));

        XSSFFont headerFont = workbook.createFont();
        headerFont.setFontName("Arial");
        headerFont.setBold(true);
        headerFont.setFontHeightInPoints((short) 10);
        headerFont.setColor(new XSSFColor(Color.WHITE, null));

        XSSFFont labelFont = workbook.createFont();
        labelFont.setFontName("Arial");
        labelFont.setBold(true);
        labelFont.setFontHeightInPoints((short) 10);
        labelFont.setColor(new XSSFColor(EXCEL_BLACK, null));

        XSSFFont valueFont = workbook.createFont();
        valueFont.setFontName("Arial");
        valueFont.setFontHeightInPoints((short) 10);
        valueFont.setColor(new XSSFColor(EXCEL_BLACK, null));

        XSSFFont noteFont = workbook.createFont();
        noteFont.setFontName("Arial");
        noteFont.setFontHeightInPoints((short) 9);
        noteFont.setColor(new XSSFColor(new Color(120, 124, 132), null));

        CellStyle brandStyle = workbook.createCellStyle();
        brandStyle.setAlignment(HorizontalAlignment.LEFT);
        brandStyle.setVerticalAlignment(VerticalAlignment.CENTER);
        brandStyle.setWrapText(true);

        CellStyle subtitleStyle = workbook.createCellStyle();
        subtitleStyle.setAlignment(HorizontalAlignment.LEFT);
        subtitleStyle.setVerticalAlignment(VerticalAlignment.CENTER);
        subtitleStyle.setWrapText(true);
        subtitleStyle.setFont(subtitleFont);

        CellStyle titleStyle = workbook.createCellStyle();
        titleStyle.setAlignment(HorizontalAlignment.LEFT);
        titleStyle.setVerticalAlignment(VerticalAlignment.CENTER);
        titleStyle.setWrapText(true);
        titleStyle.setFont(titleFont);
        setFillColor(titleStyle, EXCEL_RED);

        CellStyle metaStyle = workbook.createCellStyle();
        metaStyle.setAlignment(HorizontalAlignment.LEFT);
        metaStyle.setVerticalAlignment(VerticalAlignment.CENTER);
        metaStyle.setWrapText(true);
        metaStyle.setFont(metaFont);
        setFillColor(metaStyle, EXCEL_SOFT);

        CellStyle sectionStyle = workbook.createCellStyle();
        sectionStyle.setAlignment(HorizontalAlignment.LEFT);
        sectionStyle.setVerticalAlignment(VerticalAlignment.CENTER);
        sectionStyle.setFont(sectionFont);
        setFillColor(sectionStyle, EXCEL_BLACK);

        CellStyle headerStyle = workbook.createCellStyle();
        headerStyle.setAlignment(HorizontalAlignment.CENTER);
        headerStyle.setVerticalAlignment(VerticalAlignment.CENTER);
        headerStyle.setFont(headerFont);
        headerStyle.setBorderBottom(BorderStyle.THIN);
        headerStyle.setBorderTop(BorderStyle.THIN);
        headerStyle.setBorderLeft(BorderStyle.THIN);
        headerStyle.setBorderRight(BorderStyle.THIN);
        setFillColor(headerStyle, EXCEL_RED);

        CellStyle labelStyle = workbook.createCellStyle();
        labelStyle.setAlignment(HorizontalAlignment.LEFT);
        labelStyle.setVerticalAlignment(VerticalAlignment.CENTER);
        labelStyle.setFont(labelFont);
        labelStyle.setBorderBottom(BorderStyle.THIN);
        labelStyle.setBorderTop(BorderStyle.THIN);
        labelStyle.setBorderLeft(BorderStyle.THIN);
        labelStyle.setBorderRight(BorderStyle.THIN);
        setFillColor(labelStyle, EXCEL_SOFT);

        CellStyle valueStyle = workbook.createCellStyle();
        valueStyle.setAlignment(HorizontalAlignment.LEFT);
        valueStyle.setVerticalAlignment(VerticalAlignment.CENTER);
        valueStyle.setFont(valueFont);
        valueStyle.setBorderBottom(BorderStyle.THIN);
        valueStyle.setBorderTop(BorderStyle.THIN);
        valueStyle.setBorderLeft(BorderStyle.THIN);
        valueStyle.setBorderRight(BorderStyle.THIN);

        CellStyle dataStyle = workbook.createCellStyle();
        dataStyle.setAlignment(HorizontalAlignment.LEFT);
        dataStyle.setVerticalAlignment(VerticalAlignment.CENTER);
        dataStyle.setFont(valueFont);
        dataStyle.setBorderBottom(BorderStyle.THIN);
        dataStyle.setBorderTop(BorderStyle.THIN);
        dataStyle.setBorderLeft(BorderStyle.THIN);
        dataStyle.setBorderRight(BorderStyle.THIN);

        CellStyle alternateDataStyle = workbook.createCellStyle();
        alternateDataStyle.cloneStyleFrom(dataStyle);
        setFillColor(alternateDataStyle, EXCEL_SOFT);

        CellStyle noteStyle = workbook.createCellStyle();
        noteStyle.setAlignment(HorizontalAlignment.LEFT);
        noteStyle.setVerticalAlignment(VerticalAlignment.CENTER);
        noteStyle.setWrapText(true);
        noteStyle.setFont(noteFont);

        return new ExcelTheme(
            brandStyle,
            subtitleStyle,
            titleStyle,
            metaStyle,
            sectionStyle,
            headerStyle,
            labelStyle,
            valueStyle,
            dataStyle,
            alternateDataStyle,
            noteStyle,
            brandBlackFont,
            brandGreyFont
        );
    }

    private void buildSummarySheet(XSSFWorkbook workbook, ExcelTheme theme, IndividualReportData data) {
        Sheet sheet = workbook.createSheet("Synthese");
        int rowIndex = initializeSheetHeader(
            sheet,
            theme,
            "Rapport individuel annuel",
            data.user().getFirstName() + " " + data.user().getLastName() + " | " + data.periodLabel(),
            3
        );
        rowIndex = writeSectionTitle(sheet, rowIndex, 3, "Synthese generale", theme);
        rowIndex = writeKeyValueRows(
            sheet,
            rowIndex,
            List.of(
                new String[] { "Nom", data.user().getFirstName() + " " + data.user().getLastName() },
                new String[] { "Email", data.user().getEmail() },
                new String[] { "Periode", data.periodLabel() },
                new String[] { "Total heures prevues", formatDecimal(data.totalPlannedHours()) + " h" },
                new String[] { "Total heures realisees", formatDecimal(data.totalCompletedHours()) + " h" },
                new String[] { "Nombre d'encadrements", String.valueOf(data.supervisions().size()) },
                new String[] { "Nombre de PFE", String.valueOf(data.totalPfe()) },
                new String[] { "Encadrements soutenus", String.valueOf(data.totalSupported()) },
                new String[] { "Articles", String.valueOf(data.totalArticles()) },
                new String[] { "Publications indexees", String.valueOf(data.totalIndexedResearch()) }
            ),
            theme
        );
        finalizeSummarySheet(sheet, 4);
    }

    private void buildTeachingSheet(XSSFWorkbook workbook, ExcelTheme theme, IndividualReportData data) {
        Sheet sheet = workbook.createSheet("Enseignements");
        int rowIndex = initializeSheetHeader(
            sheet,
            theme,
            "Rapport individuel - Enseignements",
            data.user().getFirstName() + " " + data.user().getLastName() + " | " + data.periodLabel(),
            4
        );
        rowIndex = writeSectionTitle(sheet, rowIndex, 4, "Charge d'enseignement", theme);
        writeTable(
            sheet,
            rowIndex,
            new String[] { "Module", "Classe", "Semestre", "Heures prevues", "Heures realisees" },
            data.teachings().stream()
                .map(teaching -> new String[] {
                    safeValue(teaching.getModuleName()),
                    safeValue(teaching.getClassName()),
                    humanize(teaching.getSemester().name()),
                    formatDecimal(teaching.getPlannedHours()),
                    formatDecimal(teaching.getCompletedHours())
                })
                .toList(),
            theme
        );
        finalizeDataSheet(sheet, 5);
    }

    private void buildSupervisionSheet(XSSFWorkbook workbook, ExcelTheme theme, IndividualReportData data) {
        Sheet sheet = workbook.createSheet("Encadrements");
        int rowIndex = initializeSheetHeader(
            sheet,
            theme,
            "Rapport individuel - Encadrements",
            data.user().getFirstName() + " " + data.user().getLastName() + " | " + data.periodLabel(),
            4
        );
        rowIndex = writeSectionTitle(sheet, rowIndex, 4, "Encadrements et jurys", theme);
        writeTable(
            sheet,
            rowIndex,
            new String[] { "Etudiant", "Type", "Sujet", "Statut", "Role jury" },
            data.supervisions().stream()
                .map(supervision -> new String[] {
                    safeValue(supervision.getStudentName()),
                    humanize(supervision.getSupervisionType().name()),
                    safeValue(supervision.getSubjectTitle()),
                    humanize(supervision.getSupervisionStatus().name()),
                    humanize(supervision.getRoleInJury().name())
                })
                .toList(),
            theme
        );
        finalizeDataSheet(sheet, 5);
    }

    private void buildResearchSheet(XSSFWorkbook workbook, ExcelTheme theme, IndividualReportData data) {
        Sheet sheet = workbook.createSheet("Recherche");
        int rowIndex = initializeSheetHeader(
            sheet,
            theme,
            "Rapport individuel - Recherche",
            data.user().getFirstName() + " " + data.user().getLastName() + " | " + data.periodLabel(),
            5
        );
        rowIndex = writeSectionTitle(sheet, rowIndex, 5, "Production scientifique", theme);
        writeTable(
            sheet,
            rowIndex,
            new String[] { "Titre", "Type", "Lieu", "Annee", "Indexation", "DOI" },
            data.researches().stream()
                .map(research -> new String[] {
                    safeValue(research.getTitle()),
                    humanize(research.getPublicationType().name()),
                    safeValue(research.getVenueName()),
                    String.valueOf(research.getPublicationYear()),
                    safeValue(research.getIndexingName()),
                    safeValue(research.getDoi())
                })
                .toList(),
            theme
        );
        finalizeDataSheet(sheet, 6);
    }

    private void buildDepartmentSummarySheet(XSSFWorkbook workbook, ExcelTheme theme, DepartmentReportData data) {
        Sheet sheet = workbook.createSheet("Synthese departement");
        int rowIndex = initializeSheetHeader(
            sheet,
            theme,
            "Rapport departemental",
            data.department().getName() + " | " + data.periodLabel(),
            3
        );
        rowIndex = writeSectionTitle(sheet, rowIndex, 3, "Synthese generale", theme);
        rowIndex = writeKeyValueRows(
            sheet,
            rowIndex,
            List.of(
                new String[] { "Departement", data.department().getName() },
                new String[] { "Periode", data.periodLabel() },
                new String[] { "Utilisateurs", String.valueOf(data.departmentUsers().size()) },
                new String[] { "Enseignants", String.valueOf(data.totalTeachers()) },
                new String[] { "Enseignements", String.valueOf(data.teachings().size()) },
                new String[] { "Heures realisees", formatDecimal(data.totalCompletedHours()) + " h" },
                new String[] { "Encadrements", String.valueOf(data.supervisions().size()) },
                new String[] { "Recherches", String.valueOf(data.researches().size()) },
                new String[] { "Activites soumises", String.valueOf(data.totalSubmittedActivities()) },
                new String[] { "Activites validees", String.valueOf(data.totalValidatedActivities()) },
                new String[] { "Activites rejetees", String.valueOf(data.totalRejectedActivities()) }
            ),
            theme
        );
        finalizeSummarySheet(sheet, 4);
    }

    private void buildDepartmentUsersSheet(XSSFWorkbook workbook, ExcelTheme theme, DepartmentReportData data) {
        Sheet sheet = workbook.createSheet("Equipe");
        int rowIndex = initializeSheetHeader(
            sheet,
            theme,
            "Rapport departemental - Equipe",
            data.department().getName() + " | " + data.periodLabel(),
            2
        );
        rowIndex = writeSectionTitle(sheet, rowIndex, 2, "Equipe pedagogique", theme);
        writeTable(
            sheet,
            rowIndex,
            new String[] { "Nom", "Email", "Role" },
            data.departmentUsers().stream()
                .map(user -> new String[] {
                    user.getFirstName() + " " + user.getLastName(),
                    safeValue(user.getEmail()),
                    humanize(user.getRole().name())
                })
                .toList(),
            theme
        );
        finalizeDataSheet(sheet, 3);
    }

    private void buildDepartmentTeachingSheet(XSSFWorkbook workbook, ExcelTheme theme, DepartmentReportData data) {
        Sheet sheet = workbook.createSheet("Enseignements dept");
        int rowIndex = initializeSheetHeader(
            sheet,
            theme,
            "Rapport departemental - Enseignements",
            data.department().getName() + " | " + data.periodLabel(),
            4
        );
        rowIndex = writeSectionTitle(sheet, rowIndex, 4, "Production d'enseignement", theme);
        writeTable(
            sheet,
            rowIndex,
            new String[] { "Enseignant", "Module", "Classe", "Heures", "Statut" },
            data.teachings().stream()
                .map(teaching -> new String[] {
                    teaching.getUser().getFirstName() + " " + teaching.getUser().getLastName(),
                    safeValue(teaching.getModuleName()),
                    safeValue(teaching.getClassName()),
                    formatDecimal(teaching.getCompletedHours()),
                    humanize(teaching.getStatus().name())
                })
                .toList(),
            theme
        );
        finalizeDataSheet(sheet, 5);
    }

    private void buildDepartmentResearchSheet(XSSFWorkbook workbook, ExcelTheme theme, DepartmentReportData data) {
        Sheet sheet = workbook.createSheet("Recherche dept");
        int rowIndex = initializeSheetHeader(
            sheet,
            theme,
            "Rapport departemental - Recherche",
            data.department().getName() + " | " + data.periodLabel(),
            3
        );
        rowIndex = writeSectionTitle(sheet, rowIndex, 3, "Production scientifique", theme);
        writeTable(
            sheet,
            rowIndex,
            new String[] { "Enseignant", "Titre", "Type", "Lieu" },
            data.researches().stream()
                .map(research -> new String[] {
                    research.getUser().getFirstName() + " " + research.getUser().getLastName(),
                    safeValue(research.getTitle()),
                    humanize(research.getPublicationType().name()),
                    safeValue(research.getVenueName())
                })
                .toList(),
            theme
        );
        finalizeDataSheet(sheet, 4);
    }

    private void buildInstitutionSummarySheet(XSSFWorkbook workbook, ExcelTheme theme, InstitutionReportData data) {
        Sheet sheet = workbook.createSheet("Synthese institution");
        int rowIndex = initializeSheetHeader(sheet, theme, "Rapport institutionnel global", "Periode " + data.periodLabel(), 3);
        rowIndex = writeSectionTitle(sheet, rowIndex, 3, "Synthese generale", theme);
        rowIndex = writeKeyValueRows(
            sheet,
            rowIndex,
            List.of(
                new String[] { "Periode", data.periodLabel() },
                new String[] { "Departements", String.valueOf(data.departments().size()) },
                new String[] { "Utilisateurs", String.valueOf(data.users().size()) },
                new String[] { "Enseignants", String.valueOf(data.totalTeachers()) },
                new String[] { "Enseignements", String.valueOf(data.teachings().size()) },
                new String[] { "Heures realisees", formatDecimal(data.totalCompletedHours()) + " h" },
                new String[] { "Encadrements", String.valueOf(data.supervisions().size()) },
                new String[] { "Recherches", String.valueOf(data.researches().size()) },
                new String[] { "Activites soumises", String.valueOf(data.totalSubmittedActivities()) },
                new String[] { "Activites validees", String.valueOf(data.totalValidatedActivities()) },
                new String[] { "Activites rejetees", String.valueOf(data.totalRejectedActivities()) }
            ),
            theme
        );
        finalizeSummarySheet(sheet, 4);
    }

    private void buildInstitutionDepartmentsSheet(XSSFWorkbook workbook, ExcelTheme theme, InstitutionReportData data) {
        Sheet sheet = workbook.createSheet("Departements");
        int rowIndex = initializeSheetHeader(sheet, theme, "Rapport institutionnel - Departements", "Periode " + data.periodLabel(), 0);
        rowIndex = writeSectionTitle(sheet, rowIndex, 0, "Perimetre institutionnel", theme);
        writeTable(
            sheet,
            rowIndex,
            new String[] { "Departement" },
            data.departments().stream().map(department -> new String[] { safeValue(department.getName()) }).toList(),
            theme
        );
        finalizeDataSheet(sheet, 1);
    }

    private void buildInstitutionTeachingSheet(XSSFWorkbook workbook, ExcelTheme theme, InstitutionReportData data) {
        Sheet sheet = workbook.createSheet("Enseignements globaux");
        int rowIndex = initializeSheetHeader(sheet, theme, "Rapport institutionnel - Enseignements", "Periode " + data.periodLabel(), 3);
        rowIndex = writeSectionTitle(sheet, rowIndex, 3, "Consolidation pedagogique", theme);
        writeTable(
            sheet,
            rowIndex,
            new String[] { "Enseignant", "Departement", "Module", "Heures" },
            data.teachings().stream()
                .map(teaching -> new String[] {
                    teaching.getUser().getFirstName() + " " + teaching.getUser().getLastName(),
                    safeValue(teaching.getUser().getDepartment() != null ? teaching.getUser().getDepartment().getName() : null),
                    safeValue(teaching.getModuleName()),
                    formatDecimal(teaching.getCompletedHours())
                })
                .toList(),
            theme
        );
        finalizeDataSheet(sheet, 4);
    }

    private void buildInstitutionResearchSheet(XSSFWorkbook workbook, ExcelTheme theme, InstitutionReportData data) {
        Sheet sheet = workbook.createSheet("Recherche globale");
        int rowIndex = initializeSheetHeader(sheet, theme, "Rapport institutionnel - Recherche", "Periode " + data.periodLabel(), 3);
        rowIndex = writeSectionTitle(sheet, rowIndex, 3, "Consolidation scientifique", theme);
        writeTable(
            sheet,
            rowIndex,
            new String[] { "Enseignant", "Departement", "Titre", "Type" },
            data.researches().stream()
                .map(research -> new String[] {
                    research.getUser().getFirstName() + " " + research.getUser().getLastName(),
                    safeValue(research.getUser().getDepartment() != null ? research.getUser().getDepartment().getName() : null),
                    safeValue(research.getTitle()),
                    humanize(research.getPublicationType().name())
                })
                .toList(),
            theme
        );
        finalizeDataSheet(sheet, 4);
    }

    private int initializeSheetHeader(Sheet sheet, ExcelTheme theme, String reportTitle, String subtitle, int lastColumn) {
        mergeRegion(sheet, 0, lastColumn);
        Cell brandCell = getCell(sheet, 0, 0);
        XSSFRichTextString brandText = new XSSFRichTextString("esprit");
        brandText.applyFont(0, 4, theme.brandBlackFont());
        brandText.applyFont(4, 6, theme.brandGreyFont());
        brandCell.setCellValue(brandText);
        brandCell.setCellStyle(theme.brandStyle());

        mergeRegion(sheet, 1, lastColumn);
        Cell brandMeta = getCell(sheet, 1, 0);
        brandMeta.setCellValue(BRAND_TAGLINE + " | " + BRAND_GROUP);
        brandMeta.setCellStyle(theme.subtitleStyle());

        mergeRegion(sheet, 2, lastColumn);
        Cell titleCell = getCell(sheet, 2, 0);
        titleCell.setCellValue(reportTitle);
        titleCell.setCellStyle(theme.titleStyle());

        mergeRegion(sheet, 3, lastColumn);
        Cell metaCell = getCell(sheet, 3, 0);
        metaCell.setCellValue(subtitle + " | Genere le " + DISPLAY_DATE_FORMAT.format(LocalDateTime.now()));
        metaCell.setCellStyle(theme.metaStyle());

        sheet.createRow(4);
        return 5;
    }

    private int writeSectionTitle(Sheet sheet, int rowIndex, int lastColumn, String title, ExcelTheme theme) {
        mergeRegion(sheet, rowIndex, lastColumn);
        Cell cell = getCell(sheet, rowIndex, 0);
        cell.setCellValue(title);
        cell.setCellStyle(theme.sectionStyle());
        return rowIndex + 1;
    }

    private int writeKeyValueRows(Sheet sheet, int rowIndex, List<String[]> rows, ExcelTheme theme) {
        for (String[] values : rows) {
            Row row = sheet.createRow(rowIndex++);
            Cell labelCell = row.createCell(0);
            labelCell.setCellValue(values[0]);
            labelCell.setCellStyle(theme.labelStyle());

            Cell valueCell = row.createCell(1);
            valueCell.setCellValue(values[1]);
            valueCell.setCellStyle(theme.valueStyle());
        }

        Row noteRow = sheet.createRow(rowIndex++);
        Cell noteCell = noteRow.createCell(0);
        noteCell.setCellValue("Document officiel genere par la plateforme de suivi academique Esprit.");
        noteCell.setCellStyle(theme.noteStyle());
        return rowIndex;
    }

    private void writeTable(Sheet sheet, int rowIndex, String[] headers, List<String[]> rows, ExcelTheme theme) {
        Row headerRow = sheet.createRow(rowIndex++);
        for (int index = 0; index < headers.length; index++) {
            Cell headerCell = headerRow.createCell(index);
            headerCell.setCellValue(headers[index]);
            headerCell.setCellStyle(theme.headerStyle());
        }

        if (rows.isEmpty()) {
            Row emptyRow = sheet.createRow(rowIndex);
            Cell cell = emptyRow.createCell(0);
            cell.setCellValue("Aucune donnee disponible pour cette section.");
            cell.setCellStyle(theme.valueStyle());
            return;
        }

        for (int index = 0; index < rows.size(); index++) {
            Row row = sheet.createRow(rowIndex++);
            CellStyle style = index % 2 == 0 ? theme.dataStyle() : theme.alternateDataStyle();
            String[] values = rows.get(index);

            for (int columnIndex = 0; columnIndex < values.length; columnIndex++) {
                Cell cell = row.createCell(columnIndex);
                cell.setCellValue(safeValue(values[columnIndex]));
                cell.setCellStyle(style);
            }
        }
    }

    private void finalizeSummarySheet(Sheet sheet, int columnCount) {
        for (int columnIndex = 0; columnIndex < columnCount; columnIndex++) {
            sheet.autoSizeColumn(columnIndex);
            sheet.setColumnWidth(columnIndex, Math.min(sheet.getColumnWidth(columnIndex) + 900, 12000));
        }
    }

    private void finalizeDataSheet(Sheet sheet, int columnCount) {
        sheet.createFreezePane(0, 6);
        for (int columnIndex = 0; columnIndex < columnCount; columnIndex++) {
            sheet.autoSizeColumn(columnIndex);
            sheet.setColumnWidth(columnIndex, Math.min(sheet.getColumnWidth(columnIndex) + 900, 14000));
        }
    }

    private void setFillColor(CellStyle style, Color color) {
        XSSFCellStyle xssfStyle = (XSSFCellStyle) style;
        xssfStyle.setFillForegroundColor(new XSSFColor(color, null));
        xssfStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
    }

    private void mergeRegion(Sheet sheet, int rowIndex, int lastColumn) {
        if (lastColumn > 0) {
            sheet.addMergedRegion(new CellRangeAddress(rowIndex, rowIndex, 0, lastColumn));
        }
    }

    private Cell getCell(Sheet sheet, int rowIndex, int columnIndex) {
        Row row = sheet.getRow(rowIndex);
        if (row == null) {
            row = sheet.createRow(rowIndex);
        }

        Cell cell = row.getCell(columnIndex);
        if (cell == null) {
            cell = row.createCell(columnIndex);
        }

        return cell;
    }

    private String safeValue(String value) {
        return StringUtils.hasText(value) ? value : "-";
    }

    private String humanize(String value) {
        return safeValue(value).replace('_', ' ');
    }

    private String formatDecimal(BigDecimal value) {
        return value.stripTrailingZeros().toPlainString();
    }

    private User findEvaluationManager(User user) {
        if (user.getDepartment() == null) {
            return null;
        }

        return userRepository.findByRoleAndDepartmentIdAndIsActiveTrue(RoleType.CHEF_DEPARTEMENT, user.getDepartment().getId())
            .stream()
            .findFirst()
            .orElse(null);
    }

    private record ExcelTheme(
        CellStyle brandStyle,
        CellStyle subtitleStyle,
        CellStyle titleStyle,
        CellStyle metaStyle,
        CellStyle sectionStyle,
        CellStyle headerStyle,
        CellStyle labelStyle,
        CellStyle valueStyle,
        CellStyle dataStyle,
        CellStyle alternateDataStyle,
        CellStyle noteStyle,
        XSSFFont brandBlackFont,
        XSSFFont brandGreyFont
    ) {
    }

    private User findCurrentUser(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Utilisateur non authentifié"));
    }

    private boolean isAdministrationVisibleReport(Report report) {
        return report.getReportType() == TypeRapport.INSTITUTIONNEL
            || report.getReportType() == TypeRapport.PRIME_PERFORMANCE;
    }

    private boolean isPfeSupervisionType(SupervisionType supervisionType) {
        if (supervisionType == null) {
            return false;
        }
        return supervisionType.name().startsWith("PFE");
    }

    private Department resolveDepartmentScope(User currentUser, Long departmentId) {
        if (currentUser.getRole() != RoleType.CHEF_DEPARTEMENT) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Accès réservé au rapport départemental");
        }

        if (currentUser.getDepartment() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Aucun département associé à ce chef");
        }

        return currentUser.getDepartment();
    }

    private void ensureGlobalReportingAccess(User currentUser) {
        if (currentUser.getRole() != RoleType.ADMINISTRATION && currentUser.getRole() != RoleType.SUPER_ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Accès réservé au rapport institutionnel");
        }
    }

    private boolean canAccessReport(User currentUser, Report report) {
        if (currentUser.getRole() == RoleType.ADMINISTRATION || currentUser.getRole() == RoleType.SUPER_ADMIN) {
            return isAdministrationVisibleReport(report);
        }

        if (currentUser.getRole() == RoleType.CHEF_DEPARTEMENT
            && currentUser.getDepartment() != null
            && report.getDepartment() != null
            && report.getReportType() == TypeRapport.DEPARTEMENTAL
            && currentUser.getDepartment().getId().equals(report.getDepartment().getId())) {
            return true;
        }

        if (currentUser.getRole() == RoleType.ENSEIGNANT && report.getReportType() != TypeRapport.INDIVIDUEL_ANNUEL) {
            return false;
        }

        return (report.getGeneratedBy() != null && report.getGeneratedBy().getId().equals(currentUser.getId()))
            || (report.getTargetUser() != null && report.getTargetUser().getId().equals(currentUser.getId()));
    }

    private Path resolveStoredFile(String storedFilePath) {
        return Paths.get(reportsOutputDir).resolve(storedFilePath);
    }

    private void notifyReportGeneration(
        User currentUser,
        String periodLabel,
        FormatRapport format,
        TypeRapport reportType,
        Department department
    ) {
        String formatLabel = format == FormatRapport.PDF ? "PDF" : "Excel";
        String scopeLabel = switch (reportType) {
            case DEPARTEMENTAL -> "départemental";
            case INSTITUTIONNEL -> "institutionnel";
            default -> "individuel";
        };
        String departmentSuffix = department != null ? " pour " + department.getName() : "";
        notificationService.createForUser(
            currentUser,
            "Rapport " + formatLabel + " genere",
            "Votre rapport " + scopeLabel + departmentSuffix + " " + periodLabel + " au format " + formatLabel + " est prêt au téléchargement."
        );
    }

    private ReportResponse toResponse(Report report) {
        User generatedBy = report.getGeneratedBy();
        User targetUser = report.getTargetUser();
        Department department = report.getDepartment();
        return new ReportResponse(
            report.getId(),
            report.getReportType(),
            report.getReportFormat(),
            report.getPeriodLabel(),
            report.getFilePath(),
            report.getGeneratedAt(),
            generatedBy != null ? generatedBy.getId() : null,
            generatedBy != null ? generatedBy.getFirstName() + " " + generatedBy.getLastName() : null,
            targetUser != null ? targetUser.getId() : null,
            targetUser != null ? targetUser.getFirstName() + " " + targetUser.getLastName() : null,
            department != null ? department.getId() : null,
            department != null ? department.getName() : null
        );
    }

    private String sanitizeName(String value) {
        return value.toLowerCase().replaceAll("[^a-z0-9]+", "_").replaceAll("^_|_$", "");
    }

    private record IndividualReportData(
        User user,
        String periodLabel,
        List<TeachingActivity> teachings,
        List<SupervisionActivity> supervisions,
        List<ResearchActivity> researches,
        List<EventActivity> events,
        List<ExamSurveillanceActivity> surveillances,
        List<ResponsibilityActivity> responsibilities,
        User evaluationManager,
        BigDecimal totalPlannedHours,
        BigDecimal totalCompletedHours,
        long totalPfe,
        long totalSupported,
        long totalArticles,
        long totalIndexedResearch
    ) {
    }

    private record DepartmentReportData(
        Department department,
        String periodLabel,
        List<User> departmentUsers,
        List<TeachingActivity> teachings,
        List<SupervisionActivity> supervisions,
        List<ResearchActivity> researches,
        BigDecimal totalCompletedHours,
        long totalTeachers,
        long totalSubmittedActivities,
        long totalValidatedActivities,
        long totalRejectedActivities
    ) {
    }

    private record InstitutionReportData(
        String periodLabel,
        List<Department> departments,
        List<User> users,
        List<TeachingActivity> teachings,
        List<SupervisionActivity> supervisions,
        List<ResearchActivity> researches,
        BigDecimal totalCompletedHours,
        long totalTeachers,
        long totalSubmittedActivities,
        long totalValidatedActivities,
        long totalRejectedActivities
    ) {
    }

    public record GeneratedReport(
        Long reportId,
        String filename,
        String contentType,
        byte[] content
    ) {
        public Resource asResource() {
            return new ByteArrayResource(content);
        }
    }
}
