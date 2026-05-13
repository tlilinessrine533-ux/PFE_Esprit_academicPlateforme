package com.esprit.academicplatform.reporting;

import com.esprit.academicplatform.reporting.dto.ReportResponse;
import java.security.Principal;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping
    public List<ReportResponse> getAccessibleReports(Principal principal) {
        return reportService.getAccessibleReports(principal.getName());
    }

    @PostMapping("/individual/pdf")
    public ResponseEntity<Resource> generateIndividualPdf(
        @RequestParam String periodLabel,
        Principal principal
    ) {
        ReportService.GeneratedReport report = reportService.generateIndividualPdf(periodLabel, principal.getName());
        return buildDownloadResponse(report);
    }

    @PostMapping("/individual/excel")
    public ResponseEntity<Resource> generateIndividualExcel(
        @RequestParam String periodLabel,
        Principal principal
    ) {
        ReportService.GeneratedReport report = reportService.generateIndividualExcel(periodLabel, principal.getName());
        return buildDownloadResponse(report);
    }

    @PostMapping("/department/pdf")
    public ResponseEntity<Resource> generateDepartmentPdf(
        @RequestParam String periodLabel,
        @RequestParam(required = false) Long departmentId,
        Principal principal
    ) {
        ReportService.GeneratedReport report = reportService.generateDepartmentPdf(periodLabel, principal.getName(), departmentId);
        return buildDownloadResponse(report);
    }

    @PostMapping("/department/excel")
    public ResponseEntity<Resource> generateDepartmentExcel(
        @RequestParam String periodLabel,
        @RequestParam(required = false) Long departmentId,
        Principal principal
    ) {
        ReportService.GeneratedReport report = reportService.generateDepartmentExcel(periodLabel, principal.getName(), departmentId);
        return buildDownloadResponse(report);
    }

    @PostMapping("/institution/pdf")
    public ResponseEntity<Resource> generateInstitutionPdf(
        @RequestParam String periodLabel,
        Principal principal
    ) {
        ReportService.GeneratedReport report = reportService.generateInstitutionPdf(periodLabel, principal.getName());
        return buildDownloadResponse(report);
    }

    @PostMapping("/institution/excel")
    public ResponseEntity<Resource> generateInstitutionExcel(
        @RequestParam String periodLabel,
        Principal principal
    ) {
        ReportService.GeneratedReport report = reportService.generateInstitutionExcel(periodLabel, principal.getName());
        return buildDownloadResponse(report);
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> downloadReport(@PathVariable Long id, Principal principal) {
        ReportService.GeneratedReport report = reportService.downloadReport(id, principal.getName());
        return buildDownloadResponse(report);
    }

    private ResponseEntity<Resource> buildDownloadResponse(ReportService.GeneratedReport report) {
        MediaType mediaType = MediaType.parseMediaType(report.contentType());
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, ContentDisposition.attachment().filename(report.filename()).build().toString())
            .header(HttpHeaders.CACHE_CONTROL, "no-store, no-cache, must-revalidate, max-age=0")
            .header(HttpHeaders.PRAGMA, "no-cache")
            .header(HttpHeaders.EXPIRES, "0")
            .header("X-Report-Id", String.valueOf(report.reportId()))
            .contentType(mediaType)
            .body(report.asResource());
    }
}
