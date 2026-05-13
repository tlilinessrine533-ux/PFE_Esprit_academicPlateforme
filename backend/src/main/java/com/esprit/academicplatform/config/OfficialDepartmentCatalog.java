package com.esprit.academicplatform.config;

import com.esprit.academicplatform.department.Department;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import org.springframework.util.StringUtils;

public final class OfficialDepartmentCatalog {

    private static final List<OfficialDepartmentDefinition> OFFICIAL_DEPARTMENTS = List.of(
        new OfficialDepartmentDefinition(
            "Management",
            "MANAGEMENT",
            List.of("Departement de Gestion", "Gestion"),
            List.of("GEST")
        ),
        new OfficialDepartmentDefinition(
            "IMA",
            "IMA",
            List.of("Informatique", "Departement des Sciences de l'Information et de la Decision"),
            List.of("INFO", "SID")
        ),
        new OfficialDepartmentDefinition(
            "LACC",
            "LACC",
            List.of("Departement des Langues et Communication", "Langues et Communication"),
            List.of("LANG-COM")
        )
    );

    private OfficialDepartmentCatalog() {
    }

    public static List<OfficialDepartmentDefinition> definitions() {
        return OFFICIAL_DEPARTMENTS;
    }

    public static boolean isOfficial(Department department) {
        return findMatchingDefinition(department.getName(), department.getCode()).isPresent();
    }

    public static Optional<OfficialDepartmentDefinition> findMatchingDefinition(String name, String code) {
        String normalizedName = normalize(name);
        String normalizedCode = normalize(code);

        return OFFICIAL_DEPARTMENTS.stream()
            .filter(definition -> definition.matches(normalizedName, normalizedCode))
            .findFirst();
    }

    private static String normalize(String value) {
        if (!StringUtils.hasText(value)) {
            return null;
        }

        return value.trim().toLowerCase(Locale.ROOT);
    }

    public record OfficialDepartmentDefinition(
        String name,
        String code,
        List<String> legacyNames,
        List<String> legacyCodes
    ) {
        boolean matches(String normalizedName, String normalizedCode) {
            if (matchesValue(normalizedName, name) || matchesValue(normalizedCode, code)) {
                return true;
            }

            return legacyNames.stream().anyMatch(alias -> matchesValue(normalizedName, alias))
                || legacyCodes.stream().anyMatch(alias -> matchesValue(normalizedCode, alias));
        }

        private boolean matchesValue(String normalizedCandidate, String referenceValue) {
            return normalizedCandidate != null && normalizedCandidate.equals(normalize(referenceValue));
        }
    }
}
