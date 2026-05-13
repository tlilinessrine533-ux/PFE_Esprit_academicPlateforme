package com.esprit.academicplatform.department;

import com.esprit.academicplatform.config.OfficialDepartmentCatalog;
import com.esprit.academicplatform.department.dto.DepartmentResponse;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/departments")
@RequiredArgsConstructor
public class DepartmentController {

    private final DepartmentRepository departmentRepository;

    @GetMapping
    public List<DepartmentResponse> getAllDepartments() {
        return departmentRepository.findAllByOrderByNameAsc()
            .stream()
            .filter(OfficialDepartmentCatalog::isOfficial)
            .map(department -> new DepartmentResponse(
                department.getId(),
                department.getName(),
                department.getCode()
            ))
            .toList();
    }
}
