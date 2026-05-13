package com.esprit.academicplatform.assistant;

import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "app.ai.assistant")
public class AcademicAssistantProperties {

    private WeightConfig weights = new WeightConfig();
    private TargetConfig targets = new TargetConfig();
    private ThresholdConfig thresholds = new ThresholdConfig();
    private List<String> regulationsFr = defaultRegulationsFr();
    private List<String> regulationsEn = defaultRegulationsEn();

    @Getter
    @Setter
    public static class WeightConfig {
        private double teaching = 30.0;
        private double research = 40.0;
        private double supervision = 30.0;
    }

    @Getter
    @Setter
    public static class TargetConfig {
        private double teachingPoints = 120.0;
        private double researchActivities = 6.0;
        private double supervisionActivities = 8.0;
    }

    @Getter
    @Setter
    public static class ThresholdConfig {
        private double weeklyTeachingHoursAlert = 120.0;
        private double singleTeachingHoursAlert = 60.0;
        private double severeOverloadMultiplier = 1.6;
    }

    private static List<String> defaultRegulationsFr() {
        List<String> entries = new ArrayList<>();
        entries.add("Les dossiers soumis doivent etre justifies par des traces verifiables avant validation.");
        entries.add("La performance academique est evaluee sur l'enseignement, la recherche et l'encadrement.");
        entries.add("Les activites a forte charge horaire necessitent un controle de coherence et de faisabilite.");
        entries.add("La production en recherche est un levier majeur de progression pour la promotion.");
        return entries;
    }

    private static List<String> defaultRegulationsEn() {
        List<String> entries = new ArrayList<>();
        entries.add("Submitted records must be supported by verifiable evidence before approval.");
        entries.add("Academic performance is evaluated across teaching, research, and supervision.");
        entries.add("Very high workload entries require coherence and feasibility checks.");
        entries.add("Research output is a key driver for promotion progression.");
        return entries;
    }
}

