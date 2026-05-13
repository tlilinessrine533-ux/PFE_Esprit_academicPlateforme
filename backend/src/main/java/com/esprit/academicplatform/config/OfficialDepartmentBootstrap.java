package com.esprit.academicplatform.config;

import com.esprit.academicplatform.department.Department;
import com.esprit.academicplatform.department.DepartmentRepository;
import java.util.Objects;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Slf4j
@Component
@RequiredArgsConstructor
public class OfficialDepartmentBootstrap implements CommandLineRunner {

    private final DepartmentRepository departmentRepository;

    @Override
    @Transactional
    public void run(String... args) {
        int createdCount = 0;
        int updatedCount = 0;

        for (OfficialDepartmentCatalog.OfficialDepartmentDefinition seed : OfficialDepartmentCatalog.definitions()) {
            Department department = findExistingDepartment(seed).orElseGet(Department::new);

            boolean isNewDepartment = department.getId() == null;
            boolean hasChanged = false;

            if (!Objects.equals(department.getName(), seed.name())) {
                department.setName(seed.name());
                hasChanged = true;
            }

            if (!Objects.equals(department.getCode(), seed.code())) {
                department.setCode(seed.code());
                hasChanged = true;
            }

            if (!hasChanged) {
                continue;
            }

            departmentRepository.save(department);
            if (isNewDepartment) {
                createdCount++;
            } else {
                updatedCount++;
            }
        }

        if (createdCount > 0 || updatedCount > 0) {
            log.info(
                "Official department catalog synchronized (created={}, updated={}).",
                createdCount,
                updatedCount
            );
        }
    }

    private Optional<Department> findExistingDepartment(OfficialDepartmentCatalog.OfficialDepartmentDefinition seed) {
        if (StringUtils.hasText(seed.code())) {
            Optional<Department> byCode = departmentRepository.findByCodeIgnoreCase(seed.code());
            if (byCode.isPresent()) {
                return byCode;
            }
        }

        Optional<Department> byName = departmentRepository.findByNameIgnoreCase(seed.name());
        if (byName.isPresent()) {
            return byName;
        }

        for (String legacyCode : seed.legacyCodes()) {
            Optional<Department> legacyDepartment = departmentRepository.findByCodeIgnoreCase(legacyCode);
            if (legacyDepartment.isPresent()) {
                return legacyDepartment;
            }
        }

        for (String legacyName : seed.legacyNames()) {
            Optional<Department> legacyDepartment = departmentRepository.findByNameIgnoreCase(legacyName);
            if (legacyDepartment.isPresent()) {
                return legacyDepartment;
            }
        }

        return Optional.empty();
    }
}
