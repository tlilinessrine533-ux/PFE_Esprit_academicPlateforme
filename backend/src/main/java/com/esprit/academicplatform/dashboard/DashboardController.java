package com.esprit.academicplatform.dashboard;

import com.esprit.academicplatform.dashboard.dto.DepartmentDashboardResponse;
import com.esprit.academicplatform.dashboard.dto.GlobalDashboardResponse;
import com.esprit.academicplatform.dashboard.dto.PersonalDashboardResponse;
import java.security.Principal;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/personal")
    public PersonalDashboardResponse getPersonalDashboard(
        @RequestParam(required = false) String periodLabel,
        Principal principal
    ) {
        return dashboardService.getPersonalDashboard(principal.getName(), periodLabel);
    }

    @GetMapping("/department")
    public DepartmentDashboardResponse getDepartmentDashboard(
        @RequestParam(required = false) String periodLabel,
        @RequestParam(required = false) Long departmentId,
        Principal principal
    ) {
        return dashboardService.getDepartmentDashboard(principal.getName(), periodLabel, departmentId);
    }

    @GetMapping("/global")
    public GlobalDashboardResponse getGlobalDashboard(
        @RequestParam(required = false) String periodLabel,
        Principal principal
    ) {
        return dashboardService.getGlobalDashboard(principal.getName(), periodLabel);
    }
}
