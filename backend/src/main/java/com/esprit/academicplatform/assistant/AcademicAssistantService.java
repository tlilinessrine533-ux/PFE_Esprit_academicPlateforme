package com.esprit.academicplatform.assistant;

import com.esprit.academicplatform.activity.Activity;
import com.esprit.academicplatform.activity.ActivityRepository;
import com.esprit.academicplatform.activity.ResearchActivity;
import com.esprit.academicplatform.activity.ResearchActivityRepository;
import com.esprit.academicplatform.activity.SupervisionActivity;
import com.esprit.academicplatform.activity.SupervisionActivityRepository;
import com.esprit.academicplatform.activity.TeachingActivity;
import com.esprit.academicplatform.activity.TeachingActivityRepository;
import com.esprit.academicplatform.activity.TeachingPerformanceCalculator;
import com.esprit.academicplatform.assistant.dto.AssistantChatRequest;
import com.esprit.academicplatform.assistant.dto.AssistantChatResponse;
import com.esprit.academicplatform.assistant.dto.AssistantSuggestedAction;
import com.esprit.academicplatform.common.enums.ActivityStatus;
import com.esprit.academicplatform.common.enums.RoleType;
import com.esprit.academicplatform.dashboard.DashboardService;
import com.esprit.academicplatform.dashboard.dto.DepartmentDashboardResponse;
import com.esprit.academicplatform.dashboard.dto.GlobalDashboardResponse;
import com.esprit.academicplatform.dashboard.dto.PersonalDashboardResponse;
import com.esprit.academicplatform.department.DepartmentRepository;
import com.esprit.academicplatform.user.User;
import com.esprit.academicplatform.user.UserRepository;
import java.math.BigDecimal;
import java.text.Normalizer;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.WeekFields;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;


@Service
@RequiredArgsConstructor
public class AcademicAssistantService {
    private final WebsiteKnowledgeService websiteKnowledgeService;
    private static final Pattern SUPERVISION_DECLARATION_PATTERN = Pattern.compile(
        "(encadre|encadrer|encadre\\s+|supervised)\\s+(\\d+)\\s+(pfe|these|theses|memoire|memoires)"
    );
    private static final Pattern RESEARCH_BOOST_PATTERN = Pattern.compile("(\\d{1,3})\\s*%");
    private static final Pattern PLUS_PUBLICATION_PATTERN = Pattern.compile("\\+(\\d+)\\s*(publication|article|paper)");
    private static final Pattern PLUS_SUPERVISION_PATTERN = Pattern.compile("\\+(\\d+)\\s*(encadrement|supervision|pfe)");
    private static final int MIN_KNOWLEDGE_SCORE = 2;
    private static final int MAX_TOKEN_DISTANCE = 2;
    private static final Map<String, String> SHORTCUT_NORMALIZATION = Map.ofEntries(
        Map.entry("slt", "salut"),
        Map.entry("slm", "salut"),
        Map.entry("bjr", "bonjour"),
        Map.entry("bsr", "bonsoir"),
        Map.entry("cc", "coucou"),
        Map.entry("cmt", "comment"),
        Map.entry("cmnt", "comment"),
        Map.entry("pk", "pourquoi"),
        Map.entry("pq", "pourquoi"),
        Map.entry("jvx", "je veux"),
        Map.entry("jv", "je veux"),
        Map.entry("svp", "s il vous plait"),
        Map.entry("stp", "s il te plait"),
        Map.entry("mdp", "mot de passe"),
        Map.entry("prblm", "probleme"),
        Map.entry("pb", "probleme"),
        Map.entry("auth", "authentification"),
        Map.entry("dash", "dashboard"),
        Map.entry("dashbord", "dashboard"),
        Map.entry("notif", "notification"),
        Map.entry("rapor", "rapport"),
        Map.entry("activitee", "activite"),
        Map.entry("enseignent", "enseignant"),
        Map.entry("dept", "departement"),
        Map.entry("admin", "administration"),
        Map.entry("cfg", "configuration"),
        Map.entry("config", "configuration")
    );
    private static final Set<String> PLATFORM_KEYWORDS = Set.of(
        "app",
        "application",
        "plateforme",
        "module",
        "dashboard",
        "kpi",
        "workflow",
        "rapport",
        "report",
        "rapports",
        "reports",
        "profil",
        "profile",
        "user",
        "users",
        "utilisateur",
        "utilisateurs",
        "role",
        "roles",
        "permission",
        "permissions",
        "departement",
        "departements",
        "compte",
        "securite",
        "authentification",
        "connexion",
        "enseignement",
        "cours",
        "recherche",
        "encadrement",
        "surveillance",
        "evenement",
        "responsabilite",
        "conge",
        "mission",
        "absence"
    );
    private static final Set<String> GREETING_BASE_TOKENS = Set.of(
        "salut",
        "bonjour",
        "bonsoir",
        "hello",
        "hi",
        "hey",
        "coucou",
        "cc",
        "yo",
        "hola"
    );
    private static final Set<String> GREETING_COURTESY_TOKENS = Set.of(
        "stp",
        "svp",
        "please",
        "plz",
        "assistant",
        "ai",
        "ia"
    );
    private static final Set<String> QUESTION_HINT_TOKENS = Set.of(
        "comment",
        "how",
        "pourquoi",
        "why",
        "quoi",
        "what",
        "ou",
        "where",
        "quand",
        "when",
        "peux",
        "pouvez",
        "can"
    );

    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final ActivityRepository activityRepository;
    private final TeachingActivityRepository teachingActivityRepository;
    private final SupervisionActivityRepository supervisionActivityRepository;
    private final ResearchActivityRepository researchActivityRepository;
    private final TeachingPerformanceCalculator teachingPerformanceCalculator;
    private final DashboardService dashboardService;
    private final AcademicAssistantProperties assistantProperties;



          @Transactional(readOnly = true)
    public AssistantChatResponse chat(String currentUserEmail, AssistantChatRequest request) {
        User currentUser = findCurrentUser(currentUserEmail);
        List<WebsiteKnowledgeEntry> knowledgeEntries = websiteKnowledgeService.getAll();

        String question = request.question();
        AssistantLanguage language = detectLanguage(question);
        String currentRoute = request.currentRoute();
        String userRole = currentUser.getRole().name();

        if (isGreetingOnly(question)) {
            String answer = buildWelcomeMessage(userRole, language);
            return new AssistantChatResponse(answer, buildWelcomeActions(currentUser.getRole(), language));
        }

        String preparedQuestion = prepareQuestionForMatching(question, knowledgeEntries);

        Optional<AssistantChatResponse> dataAnswer = answerFromRealData(currentUser, request, language, preparedQuestion);
        if (dataAnswer.isPresent()) {
            return dataAnswer.get();
        }

        Optional<AssistantChatResponse> roleInsightAnswer = answerFromRoleInsights(currentUser, request, language, preparedQuestion);
        if (roleInsightAnswer.isPresent()) {
            return roleInsightAnswer.get();
        }

        List<Map.Entry<WebsiteKnowledgeEntry, Integer>> rankedEntries = knowledgeEntries.stream()
            .map(entry -> Map.entry(entry, computeRelevanceScore(entry, preparedQuestion, currentRoute, userRole)))
            .filter(entry -> entry.getValue() > 0)
            .sorted((a, b) -> Integer.compare(b.getValue(), a.getValue()))
            .limit(3)
            .toList();

        if (rankedEntries.isEmpty() || rankedEntries.getFirst().getValue() < MIN_KNOWLEDGE_SCORE) {
            if (looksLikePlatformQuestion(preparedQuestion)) {
                String answer = toThreeStepAnswer(
                    language,
                    message(
                        language,
                        "Je peux vous guider sur tous les modules de l'application selon votre role.",
                        "I can guide you across all application modules based on your role."
                    ),
                    message(
                        language,
                        "Votre question est bien liee a la plateforme, mais j'ai besoin du module exact pour donner une reponse precise.",
                        "Your question is related to the platform, but I need the exact module to provide a precise answer."
                    ),
                    message(
                        language,
                        "Precisez un module (dashboard, KPI, activites, validation, rapports, utilisateurs, departements, roles, workflow).",
                        "Specify one module (dashboard, KPI, activities, validation, reports, users, departments, roles, workflow)."
                    )
                );
                return new AssistantChatResponse(answer, buildRoleNavigationActions(userRole, knowledgeEntries, language));
            }

            String answer = toThreeStepAnswer(
                language,
                message(
                    language,
                    "Je reponds uniquement aux questions sur cette application universitaire.",
                    "I answer only questions about this university application."
                ),
                message(
                    language,
                    "Je n'ai pas detecte de demande exploitable sur les fonctionnalites de la plateforme.",
                    "I could not detect an actionable request about platform features."
                ),
                message(
                    language,
                    "Reposez votre question en citant le module concerne (ex: dashboard, activite, rapport, workflow, utilisateurs).",
                    "Ask again and mention the target module (e.g., dashboard, activity, report, workflow, users)."
                )
            );
            return new AssistantChatResponse(answer, buildRoleNavigationActions(userRole, knowledgeEntries, language));
        }

        WebsiteKnowledgeEntry bestEntry = rankedEntries.getFirst().getKey();
        boolean roleAllowed = isRoleAllowedForEntry(bestEntry, userRole);

        String direct = roleAllowed
            ? message(
                language,
                "Le module le plus pertinent est " + bestEntry.title() + " (" + bestEntry.route() + ").",
                "The most relevant module is " + bestEntry.title() + " (" + bestEntry.route() + ")."
            )
            : message(
                language,
                "Le module trouve est " + bestEntry.title() + ", mais l'acces est restreint pour votre role.",
                "The matched module is " + bestEntry.title() + ", but access is restricted for your role."
            );

        StringBuilder explanation = new StringBuilder(bestEntry.description());
        String roleScope = buildRoleScopeExplanation(bestEntry.route(), userRole, language);
        if (!roleScope.isBlank()) {
            explanation.append(" ").append(roleScope);
        }
        if (bestEntry.mainActions() != null && !bestEntry.mainActions().isEmpty()) {
            explanation.append(" ");
            explanation.append(message(language, "Actions disponibles: ", "Available actions: "));
            explanation.append(String.join(", ", bestEntry.mainActions())).append(".");
        }
        if (!roleAllowed) {
            explanation.append(" ");
            explanation.append(message(language, "Roles autorises: ", "Allowed roles: "));
            explanation.append(formatAllowedRoles(bestEntry.allowedRoles(), language)).append(".");
        }
        if (bestEntry.notes() != null && !bestEntry.notes().isBlank()) {
            explanation.append(" ");
            explanation.append(message(language, "Note: ", "Note: ")).append(bestEntry.notes());
        }

        String nextStep = roleAllowed
            ? message(
                language,
                "Ouvrez le module puis lancez l'action principale adaptee a votre besoin.",
                "Open the module and run the main action matching your need."
            )
            : message(
                language,
                "Utilisez un module autorise pour votre role ou contactez un role habilite.",
                "Use a role-authorized module or contact a permitted role."
            );

        String answer = toThreeStepAnswer(language, direct, explanation.toString(), nextStep);
        List<AssistantSuggestedAction> suggestedActions = buildSuggestedActions(bestEntry, roleAllowed, language);
        return new AssistantChatResponse(answer, suggestedActions);
    }

private String prepareQuestionForMatching(String question, List<WebsiteKnowledgeEntry> knowledgeEntries) {
    String normalized = normalizeLooseText(question);
    if (normalized.isBlank()) {
        return normalized;
    }

    Set<String> vocabulary = buildKnowledgeVocabulary(knowledgeEntries);
    List<String> preparedTokens = new ArrayList<>();

    for (String rawToken : normalized.split("\\s+")) {
        if (rawToken.isBlank()) {
            continue;
        }

        String expanded = SHORTCUT_NORMALIZATION.getOrDefault(rawToken, rawToken);
        for (String token : extractTokens(expanded)) {
            if (token.length() <= 2 || isNumeric(token) || vocabulary.contains(token)) {
                preparedTokens.add(token);
                continue;
            }

            String corrected = findClosestVocabularyToken(token, vocabulary);
            preparedTokens.add(corrected != null ? corrected : token);
        }
    }

    if (preparedTokens.isEmpty()) {
        return normalized;
    }

    return String.join(" ", preparedTokens).replaceAll("\\s+", " ").trim();
}

private Set<String> buildKnowledgeVocabulary(List<WebsiteKnowledgeEntry> knowledgeEntries) {
    Set<String> vocabulary = new HashSet<>(PLATFORM_KEYWORDS);

    for (String shortcut : SHORTCUT_NORMALIZATION.keySet()) {
        vocabulary.addAll(extractTokens(shortcut));
    }
    for (String normalizedShortcut : SHORTCUT_NORMALIZATION.values()) {
        vocabulary.addAll(extractTokens(normalizedShortcut));
    }

    if (knowledgeEntries == null) {
        return vocabulary;
    }

    for (WebsiteKnowledgeEntry entry : knowledgeEntries) {
        vocabulary.addAll(extractTokens(entry.route()));
        vocabulary.addAll(extractTokens(entry.title()));
        vocabulary.addAll(extractTokens(entry.description()));
        vocabulary.addAll(extractTokens(entry.notes()));

        if (entry.aliases() != null) {
            for (String alias : entry.aliases()) {
                vocabulary.addAll(extractTokens(alias));
            }
        }
        if (entry.keywords() != null) {
            for (String keyword : entry.keywords()) {
                vocabulary.addAll(extractTokens(keyword));
            }
        }
        if (entry.faqHints() != null) {
            for (String faqHint : entry.faqHints()) {
                vocabulary.addAll(extractTokens(faqHint));
            }
        }
        if (entry.mainActions() != null) {
            for (String action : entry.mainActions()) {
                vocabulary.addAll(extractTokens(action));
            }
        }
    }

    return vocabulary;
}

private List<String> extractTokens(String value) {
    String normalized = normalizeText(value);
    if (normalized.isBlank()) {
        return List.of();
    }

    return Arrays.stream(normalized.split("[\\s/_-]+"))
        .map(String::trim)
        .filter(token -> token.length() > 1)
        .toList();
}

private String findClosestVocabularyToken(String token, Set<String> vocabulary) {
    String bestCandidate = null;
    int bestDistance = MAX_TOKEN_DISTANCE + 1;

    for (String candidate : vocabulary) {
        if (candidate.length() < 3) {
            continue;
        }
        if (Math.abs(candidate.length() - token.length()) > MAX_TOKEN_DISTANCE) {
            continue;
        }

        int distance = levenshteinDistance(token, candidate, MAX_TOKEN_DISTANCE);
        if (distance < bestDistance) {
            bestDistance = distance;
            bestCandidate = candidate;
            if (distance == 1) {
                break;
            }
        }
    }

    return bestDistance <= MAX_TOKEN_DISTANCE ? bestCandidate : null;
}

private int levenshteinDistance(String left, String right, int maxDistance) {
    if (left.equals(right)) {
        return 0;
    }
    if (left.isBlank() || right.isBlank()) {
        return Math.max(left.length(), right.length());
    }
    if (Math.abs(left.length() - right.length()) > maxDistance) {
        return maxDistance + 1;
    }

    int[] previous = new int[right.length() + 1];
    int[] current = new int[right.length() + 1];

    for (int j = 0; j <= right.length(); j++) {
        previous[j] = j;
    }

    for (int i = 1; i <= left.length(); i++) {
        current[0] = i;
        int minInRow = current[0];

        for (int j = 1; j <= right.length(); j++) {
            int substitutionCost = left.charAt(i - 1) == right.charAt(j - 1) ? 0 : 1;
            current[j] = Math.min(
                Math.min(current[j - 1] + 1, previous[j] + 1),
                previous[j - 1] + substitutionCost
            );
            minInRow = Math.min(minInRow, current[j]);
        }

        if (minInRow > maxDistance) {
            return maxDistance + 1;
        }

        int[] temp = previous;
        previous = current;
        current = temp;
    }

    return previous[right.length()];
}

private boolean looksLikePlatformQuestion(String question) {
    String normalized = normalizeText(question);
    if (normalized.isBlank()) {
        return false;
    }
    if (normalized.contains("/")) {
        return true;
    }

    for (String token : normalized.split("\\s+")) {
        if (PLATFORM_KEYWORDS.contains(token)) {
            return true;
        }
    }

    return false;
}

private boolean isRoleAllowedForEntry(WebsiteKnowledgeEntry entry, String userRole) {
    if (entry == null || entry.allowedRoles() == null || entry.allowedRoles().isEmpty()) {
        return true;
    }
    if (!StringUtils.hasText(userRole)) {
        return false;
    }

    return entry.allowedRoles().stream()
        .anyMatch(role -> role != null && role.equalsIgnoreCase(userRole));
}

private String formatAllowedRoles(List<String> roles, AssistantLanguage language) {
    if (roles == null || roles.isEmpty()) {
        return language == AssistantLanguage.FR ? "tous les roles" : "all roles";
    }

    return roles.stream()
        .filter(StringUtils::hasText)
        .map(role -> formatRoleForDisplay(role, language))
        .distinct()
        .sorted()
        .reduce((left, right) -> left + ", " + right)
        .orElse(language == AssistantLanguage.FR ? "tous les roles" : "all roles");
}

private String formatRoleForDisplay(String role, AssistantLanguage language) {
    if (!StringUtils.hasText(role)) {
        return language == AssistantLanguage.FR ? "role inconnu" : "unknown role";
    }

    return switch (role.trim().toUpperCase(Locale.ROOT)) {
        case "ENSEIGNANT" -> language == AssistantLanguage.FR ? "enseignant" : "teacher";
        case "CHEF_DEPARTEMENT" -> language == AssistantLanguage.FR ? "chef departement" : "department head";
        case "ADMIN", "ADMINISTRATION" -> language == AssistantLanguage.FR ? "administration" : "administration";
        case "SUPER_ADMIN" -> language == AssistantLanguage.FR ? "super admin" : "super admin";
        case "UNAUTHENTICATED" -> language == AssistantLanguage.FR ? "non authentifie" : "unauthenticated";
        default -> role.toLowerCase(Locale.ROOT);
    };
}

private List<AssistantSuggestedAction> buildRoleNavigationActions(
    String userRole,
    List<WebsiteKnowledgeEntry> knowledgeEntries,
    AssistantLanguage language
) {
    if (knowledgeEntries == null || knowledgeEntries.isEmpty()) {
        return List.of();
    }

    List<AssistantSuggestedAction> actions = new ArrayList<>();
    Set<String> seenRoutes = new LinkedHashSet<>();

    knowledgeEntries.stream()
        .filter(entry -> isRoleAllowedForEntry(entry, userRole))
        .filter(entry -> StringUtils.hasText(entry.route()))
        .sorted(Comparator
            .comparingInt((WebsiteKnowledgeEntry entry) -> routePriority(entry.route(), userRole))
            .thenComparing(entry -> normalizeText(entry.title())))
        .forEach(entry -> {
            if (actions.size() >= 6) {
                return;
            }
            if (!seenRoutes.add(entry.route())) {
                return;
            }
            actions.add(new AssistantSuggestedAction(
                entry.title(),
                entry.route(),
                message(language, "Acces recommande pour votre role.", "Recommended access for your role."),
                Map.of()
            ));
        });

    return actions;
}

private int routePriority(String route, String userRole) {
    String normalizedRoute = normalizeText(route);
    if ("/dashboard".equals(normalizedRoute)) {
        return 0;
    }
    if ("SUPER_ADMIN".equalsIgnoreCase(userRole) && "/users".equals(normalizedRoute)) {
        return 1;
    }
    if ("/workflow".equals(normalizedRoute)) {
        return 2;
    }
    if ("/teaching".equals(normalizedRoute)) {
        return 3;
    }
    if ("/supervision".equals(normalizedRoute)) {
        return 4;
    }
    if ("/research".equals(normalizedRoute)) {
        return 5;
    }
    if ("/reports".equals(normalizedRoute)) {
        return 6;
    }
    if ("/profile".equals(normalizedRoute)) {
        return 7;
    }
    return 10;
}

private List<AssistantSuggestedAction> buildSuggestedActions(
    WebsiteKnowledgeEntry entry,
    boolean roleAllowed,
    AssistantLanguage language
) {
    if (entry == null) {
        return List.of();
    }

    List<AssistantSuggestedAction> actions = new ArrayList<>();
    Set<String> seenRoutes = new LinkedHashSet<>();

    if (roleAllowed && StringUtils.hasText(entry.route()) && seenRoutes.add(entry.route())) {
        actions.add(new AssistantSuggestedAction(
            message(language, "Ouvrir ", "Open ") + entry.title(),
            entry.route(),
            message(language, "Module directement lie a votre question.", "Module directly related to your question."),
            Map.of()
        ));
    }

    if (roleAllowed && entry.aliases() != null) {
        for (String alias : entry.aliases()) {
            if (!StringUtils.hasText(alias) || !seenRoutes.add(alias)) {
                continue;
            }
            if (actions.size() >= 3) {
                break;
            }

            String label;
            if (alias.endsWith("/new")) {
                label = message(language, "Creer depuis ", "Create from ") + entry.title();
            } else {
                label = message(language, "Aller vers ", "Go to ") + alias;
            }
            actions.add(new AssistantSuggestedAction(
                label,
                alias,
                message(language, "Navigation rapide suggeree.", "Suggested quick navigation."),
                Map.of()
            ));
        }
    }

    if (!roleAllowed) {
        actions.add(new AssistantSuggestedAction(
            message(language, "Ouvrir le dashboard", "Open dashboard"),
            "/dashboard",
            message(language, "Consultez les modules disponibles pour votre compte.", "Check modules available for your account."),
            Map.of()
        ));
    }

    if (seenRoutes.add("/profile")) {
        actions.add(new AssistantSuggestedAction(
            message(language, "Ouvrir le profil", "Open profile"),
            "/profile",
            message(language, "Verifiez vos informations et options de securite.", "Review your information and security settings."),
            Map.of()
        ));
    }

    if (actions.size() > 4) {
        return actions.subList(0, 4);
    }
    return actions;
}

private boolean isNumeric(String token) {
    for (int i = 0; i < token.length(); i++) {
        if (!Character.isDigit(token.charAt(i))) {
            return false;
        }
    }
    return !token.isBlank();
}

private Optional<AssistantChatResponse> answerFromRealData(
    User currentUser,
    AssistantChatRequest request,
    AssistantLanguage language,
    String preparedQuestion
) {
    String normalized = normalizeLooseText(preparedQuestion);
    String periodLabel = resolvePeriodLabel(request.periodLabel());
    if (containsAny(normalized, "combien", "how many", "nombre")
        && containsAny(normalized, "encadrement", "encadrements", "pfe", "supervision")) {

        List<SupervisionActivity> supervisions =
            supervisionActivityRepository.findByUserIdAndAcademicYearOrderByCreatedAtDesc(
                currentUser.getId(),
                periodLabel
            );

        String answer = language == AssistantLanguage.FR
            ? toThreeStepAnswer(
                AssistantLanguage.FR,
                "Vous avez " + supervisions.size() + " encadrement(s) enregistres pour l'annee " + periodLabel + ".",
                "Ce total est calcule a partir de vos declarations dans le module Encadrements.",
                "Ouvrez /supervision pour verifier, modifier ou soumettre les elements concernes."
            )
            : toThreeStepAnswer(
                AssistantLanguage.EN,
                "You have " + supervisions.size() + " supervision record(s) for academic year " + periodLabel + ".",
                "This total is computed from your declarations in the Supervision module.",
                "Open /supervision to review, edit, or submit the relevant entries."
            );

        return Optional.of(new AssistantChatResponse(answer, List.of()));
    }

    if (containsAny(normalized, "combien", "how many", "nombre")
        && containsAny(normalized, "cours", "enseignement", "teachings", "teaching")) {

        List<TeachingActivity> teachings =
            teachingActivityRepository.findByUserIdAndAcademicYearOrderByCreatedAtDesc(
                currentUser.getId(),
                periodLabel
            );

        String answer = language == AssistantLanguage.FR
            ? toThreeStepAnswer(
                AssistantLanguage.FR,
                "Vous avez " + teachings.size() + " activite(s) d'enseignement enregistree(s) pour l'annee " + periodLabel + ".",
                "Ce resultat vient de vos declarations dans le module Enseignement.",
                "Ouvrez /teaching pour verifier, completer ou soumettre vos activites."
            )
            : toThreeStepAnswer(
                AssistantLanguage.EN,
                "You have " + teachings.size() + " teaching activity record(s) for academic year " + periodLabel + ".",
                "This result comes from your declarations in the Teaching module.",
                "Open /teaching to review, complete, or submit your activities."
            );

        return Optional.of(new AssistantChatResponse(answer, List.of()));
    }

    return Optional.empty();
}

private Optional<AssistantChatResponse> answerFromRoleInsights(
    User currentUser,
    AssistantChatRequest request,
    AssistantLanguage language,
    String preparedQuestion
) {
    if (!isRoleInsightQuestion(preparedQuestion)) {
        return Optional.empty();
    }

    String periodLabel = resolvePeriodLabel(request.periodLabel());
    AssistantDraft draft;

    switch (currentUser.getRole()) {
        case ENSEIGNANT -> draft = buildTeacherAnswer(currentUser, preparedQuestion, periodLabel, language);
        case CHEF_DEPARTEMENT -> draft = buildDepartmentHeadAnswer(currentUser, preparedQuestion, periodLabel, language);
        case ADMINISTRATION -> draft = buildAdministrationAnswer(currentUser, preparedQuestion, periodLabel, null, language);
        case SUPER_ADMIN -> draft = buildSuperAdminAnswer(currentUser, preparedQuestion, periodLabel, language);
        default -> {
            return Optional.empty();
        }
    }

    String answer = toThreeStepAnswer(
        language,
        draft.summary(),
        draft.analysis(),
        draft.recommendations().isEmpty()
            ? message(language, "Ouvrez le dashboard pour approfondir.", "Open the dashboard for deeper details.")
            : draft.recommendations().getFirst()
    );

    List<AssistantSuggestedAction> suggestedActions = new ArrayList<>();
    if (draft.suggestedActions() != null && !draft.suggestedActions().isEmpty()) {
        suggestedActions.addAll(draft.suggestedActions());
    }
    if (suggestedActions.isEmpty()) {
        suggestedActions.addAll(defaultRoleActions(currentUser.getRole(), language));
    }

    return Optional.of(new AssistantChatResponse(answer, suggestedActions));
}

private boolean isRoleInsightQuestion(String question) {
    String normalized = normalizeText(question);
    if (normalized.isBlank()) {
        return false;
    }

    return containsAny(
        normalized,
        "dashboard",
        "kpi",
        "score",
        "performance",
        "analyse",
        "analysis",
        "recommendation",
        "recommandation",
        "anomal",
        "workflow",
        "validation",
        "rapport",
        "report",
        "utilisateur",
        "users",
        "departement",
        "roles",
        "permissions",
        "promotion"
    );
}

private List<AssistantSuggestedAction> defaultRoleActions(RoleType role, AssistantLanguage language) {
    return switch (role) {
        case ENSEIGNANT -> List.of(
            new AssistantSuggestedAction(
                message(language, "Ouvrir le dashboard", "Open dashboard"),
                "/dashboard",
                message(language, "Suivre vos KPI personnels.", "Track your personal KPIs."),
                Map.of()
            ),
            new AssistantSuggestedAction(
                message(language, "Voir mes rapports", "View my reports"),
                "/reports",
                message(language, "Acceder a vos rapports individuels.", "Access your personal reports."),
                Map.of()
            )
        );
        case CHEF_DEPARTEMENT -> List.of(
            new AssistantSuggestedAction(
                message(language, "Suivre le workflow", "Review workflow"),
                "/workflow",
                message(language, "Traiter les validations departementales.", "Process department-level validations."),
                Map.of()
            ),
            new AssistantSuggestedAction(
                message(language, "Analyser le dashboard", "Analyze dashboard"),
                "/dashboard",
                message(language, "Comparer les KPI du departement.", "Compare department KPI trends."),
                Map.of()
            )
        );
        case ADMINISTRATION -> List.of(
            new AssistantSuggestedAction(
                message(language, "Ouvrir administration", "Open administration"),
                "/administration",
                message(language, "Controler anomalies et bonus.", "Control anomalies and bonuses."),
                Map.of()
            ),
            new AssistantSuggestedAction(
                message(language, "Validation finale", "Final validation"),
                "/workflow",
                message(language, "Traiter les dossiers en attente finale.", "Process final pending records."),
                Map.of()
            )
        );
        case SUPER_ADMIN -> List.of(
            new AssistantSuggestedAction(
                message(language, "Gerer les utilisateurs", "Manage users"),
                "/users",
                message(language, "Gerer comptes, departements et roles.", "Manage accounts, departments, and roles."),
                Map.of()
            ),
            new AssistantSuggestedAction(
                message(language, "Vue globale dashboard", "Global dashboard view"),
                "/dashboard",
                message(language, "Suivre la performance institutionnelle.", "Track institutional performance."),
                Map.of()
            )
        );
    };
}

private String buildWelcomeMessage(String userRole, AssistantLanguage language) {
    String roleLabel = formatRoleForDisplay(userRole, language);
    String roleContext = switch (userRole) {
        case "ENSEIGNANT" -> message(
            language,
            "Je peux vous aider sur votre performance, votre dashboard, vos activites et vos rapports personnels.",
            "I can help with your performance, dashboard, activities, and personal reports."
        );
        case "CHEF_DEPARTEMENT" -> message(
            language,
            "Je peux vous aider a piloter les KPI du departement, le workflow et les validations.",
            "I can help you drive department KPIs, workflow, and validations."
        );
        case "ADMINISTRATION" -> message(
            language,
            "Je peux vous aider a controler les anomalies, la validation finale et la consolidation.",
            "I can help with anomaly control, final validation, and consolidation."
        );
        case "SUPER_ADMIN" -> message(
            language,
            "Je peux vous aider sur la vision globale, la gouvernance des roles, utilisateurs et departements.",
            "I can help with global oversight, role governance, users, and departments."
        );
        default -> message(
            language,
            "Je peux vous guider sur les fonctionnalites de la plateforme.",
            "I can guide you through platform features."
        );
    };

    return language == AssistantLanguage.FR
        ? "Bonjour !\n"
            + "Je suis votre assistant academique intelligent.\n"
            + "Contexte role: " + roleLabel + ". " + roleContext + "\n"
            + "Actions utiles immediates:\n"
            + "- Analyser votre performance\n"
            + "- Expliquer votre dashboard et vos KPI\n"
            + "- Generer ou consulter vos rapports\n"
            + "- Proposer des recommandations personnalisees\n"
            + "Que souhaitez-vous faire ?"
        : "Hello!\n"
            + "I am your intelligent academic assistant.\n"
            + "Role context: " + roleLabel + ". " + roleContext + "\n"
            + "Immediate useful actions:\n"
            + "- Analyze your performance\n"
            + "- Explain your dashboard and KPIs\n"
            + "- Generate or review your reports\n"
            + "- Suggest personalized recommendations\n"
            + "How can I help you today?";
}

private List<AssistantSuggestedAction> buildWelcomeActions(RoleType role, AssistantLanguage language) {
    return switch (role) {
        case ENSEIGNANT -> List.of(
            new AssistantSuggestedAction(
                message(language, "Analyser mon score", "Analyze my score"),
                "/dashboard",
                message(language, "Voir vos KPI personnels et votre performance.", "See your personal KPIs and performance."),
                Map.of()
            ),
            new AssistantSuggestedAction(
                message(language, "Expliquer mon dashboard", "Explain my dashboard"),
                "/dashboard",
                message(language, "Comprendre les indicateurs affiches.", "Understand your displayed indicators."),
                Map.of()
            ),
            new AssistantSuggestedAction(
                message(language, "Generer mon rapport", "Generate my report"),
                "/reports",
                message(language, "Acceder a vos rapports individuels.", "Access your individual reports."),
                Map.of()
            ),
            new AssistantSuggestedAction(
                message(language, "Declarer une activite", "Declare an activity"),
                "/teaching",
                message(language, "Saisir ou mettre a jour vos activites.", "Create or update your activities."),
                Map.of()
            )
        );
        case CHEF_DEPARTEMENT -> List.of(
            new AssistantSuggestedAction(
                message(language, "Analyser KPI departement", "Analyze department KPIs"),
                "/dashboard",
                message(language, "Suivre la performance globale du departement.", "Track department-wide performance."),
                Map.of()
            ),
            new AssistantSuggestedAction(
                message(language, "Traiter le workflow", "Process workflow"),
                "/workflow",
                message(language, "Valider les dossiers en attente.", "Validate pending records."),
                Map.of()
            ),
            new AssistantSuggestedAction(
                message(language, "Consulter rapports departement", "View department reports"),
                "/reports",
                message(language, "Analyser les rapports de votre perimetre.", "Review reports in your scope."),
                Map.of()
            ),
            new AssistantSuggestedAction(
                message(language, "Suivre les absences", "Track absences"),
                "/absences",
                message(language, "Voir tendances et dossiers d'absence.", "Review absence trends and records."),
                Map.of()
            )
        );
        case ADMINISTRATION -> List.of(
            new AssistantSuggestedAction(
                message(language, "Controle des anomalies", "Anomaly control"),
                "/administration",
                message(language, "Identifier les incoherences prioritaires.", "Identify high-priority inconsistencies."),
                Map.of()
            ),
            new AssistantSuggestedAction(
                message(language, "Validation finale", "Final validation"),
                "/workflow",
                message(language, "Traiter les dossiers en attente finale.", "Process final pending records."),
                Map.of()
            ),
            new AssistantSuggestedAction(
                message(language, "Dashboard global", "Global dashboard"),
                "/dashboard",
                message(language, "Suivre les KPI institutionnels.", "Track institutional KPIs."),
                Map.of()
            ),
            new AssistantSuggestedAction(
                message(language, "Rapports consolides", "Consolidated reports"),
                "/reports",
                message(language, "Generer et verifier les rapports globaux.", "Generate and verify global reports."),
                Map.of()
            )
        );
        case SUPER_ADMIN -> List.of(
            new AssistantSuggestedAction(
                message(language, "Vue globale performance", "Global performance view"),
                "/dashboard",
                message(language, "Observer les KPI institutionnels.", "Observe institution-wide KPIs."),
                Map.of()
            ),
            new AssistantSuggestedAction(
                message(language, "Gerer utilisateurs", "Manage users"),
                "/users",
                message(language, "Administrer comptes, departements et roles.", "Administer accounts, departments, and roles."),
                Map.of()
            ),
            new AssistantSuggestedAction(
                message(language, "Consulter rapports globaux", "View global reports"),
                "/reports",
                message(language, "Analyser les rapports consolides institutionnels.", "Review consolidated institutional reports."),
                Map.of()
            ),
            new AssistantSuggestedAction(
                message(language, "Auditer workflow", "Audit workflow"),
                "/workflow",
                message(language, "Verifier l'etat des validations.", "Check validation pipeline state."),
                Map.of()
            )
        );
    };
}

private String buildRoleScopeExplanation(String route, String userRole, AssistantLanguage language) {
    String normalizedRoute = normalizeText(route);
    String roleLabel = formatRoleForDisplay(userRole, language);

    return switch (normalizedRoute) {
        case "/reports" -> message(
            language,
            switch (userRole) {
                case "ENSEIGNANT" -> "Pour votre role (" + roleLabel + "), l'acces est centre sur vos rapports individuels.";
                case "CHEF_DEPARTEMENT" -> "Pour votre role (" + roleLabel + "), vous pouvez suivre les rapports de departement.";
                case "ADMINISTRATION" -> "Pour votre role (" + roleLabel + "), vous gerez les rapports consolides et la validation.";
                case "SUPER_ADMIN" -> "Pour votre role (" + roleLabel + "), vous avez une vision institutionnelle globale.";
                default -> "Le perimetre de rapport depend du role connecte.";
            },
            switch (userRole) {
                case "ENSEIGNANT" -> "For your role (" + roleLabel + "), access is focused on personal reports.";
                case "CHEF_DEPARTEMENT" -> "For your role (" + roleLabel + "), you can monitor department reports.";
                case "ADMINISTRATION" -> "For your role (" + roleLabel + "), you manage consolidated reports and validation.";
                case "SUPER_ADMIN" -> "For your role (" + roleLabel + "), you have an institution-wide reporting view.";
                default -> "Report scope depends on the connected role.";
            }
        );
        case "/dashboard" -> message(
            language,
            "Le dashboard est automatiquement adapte a votre role (" + roleLabel + ").",
            "The dashboard is automatically adapted to your role (" + roleLabel + ")."
        );
        case "/workflow" -> message(
            language,
            switch (userRole) {
                case "ENSEIGNANT" -> "Dans votre role, vous suivez surtout l'etat de vos dossiers soumis.";
                case "CHEF_DEPARTEMENT" -> "Dans votre role, vous traitez la validation departementale.";
                case "ADMINISTRATION" -> "Dans votre role, vous traitez la validation finale et les cas sensibles.";
                default -> "Le workflow suit des permissions strictes par role.";
            },
            switch (userRole) {
                case "ENSEIGNANT" -> "In your role, you mainly track the state of your submitted records.";
                case "CHEF_DEPARTEMENT" -> "In your role, you handle department-level validation.";
                case "ADMINISTRATION" -> "In your role, you handle final validation and sensitive cases.";
                default -> "Workflow follows strict role permissions.";
            }
        );
        case "/users" -> message(
            language,
            "Ce module couvre la gestion des utilisateurs, departements, roles et permissions.",
            "This module covers users, departments, roles, and permissions management."
        );
        case "/administration" -> message(
            language,
            "Ce module est dedie au controle administratif, anomalies et decisions de consolidation.",
            "This module is dedicated to administrative control, anomalies, and consolidation decisions."
        );
        default -> "";
    };
}

private String toThreeStepAnswer(AssistantLanguage language, String direct, String explanation, String nextStep) {
    String directTitle = language == AssistantLanguage.FR ? "Reponse directe" : "Direct answer";
    String explainTitle = language == AssistantLanguage.FR ? "Explication" : "Explanation";
    String nextTitle = language == AssistantLanguage.FR ? "Etape suivante" : "Next step";

    return "1. " + directTitle + "\n"
        + (StringUtils.hasText(direct) ? direct.trim() : "-")
        + "\n\n2. " + explainTitle + "\n"
        + (StringUtils.hasText(explanation) ? explanation.trim() : "-")
        + "\n\n3. " + nextTitle + "\n"
        + (StringUtils.hasText(nextStep) ? nextStep.trim() : "-");
}




private boolean matchesQuestion(
    WebsiteKnowledgeEntry entry,
    String question,
    String currentRoute,
    String userRole
) {
    String normalizedQuestion = normalizeText(question);
    String normalizedRoute = normalizeText(currentRoute);

    boolean roleMatches = entry.allowedRoles() == null
        || entry.allowedRoles().isEmpty()
        || entry.allowedRoles().contains(userRole);

    if (!roleMatches) {
        return false;
    }

    if (containsText(entry.title(), normalizedQuestion)) return true;
    if (containsText(entry.description(), normalizedQuestion)) return true;
    if (containsAny(entry.keywords(), normalizedQuestion)) return true;
    if (containsAny(entry.faqHints(), normalizedQuestion)) return true;
    if (containsAny(entry.mainActions(), normalizedQuestion)) return true;

    if (currentRoute != null && !currentRoute.isBlank()) {
        if (containsText(entry.route(), normalizedRoute)) return true;
        if (containsAny(entry.aliases(), normalizedRoute)) return true;
    }

    return false;
}

private boolean containsText(String source, String query) {
    if (source == null || query == null || query.isBlank()) {
        return false;
    }

    String normalizedSource = normalizeText(source);

    for (String token : query.split("\\s+")) {
        if (!token.isBlank() && normalizedSource.contains(token)) {
            return true;
        }
    }

    return false;
}

private boolean containsAny(List<String> values, String query) {
    if (values == null || values.isEmpty() || query == null || query.isBlank()) {
        return false;
    }

    for (String value : values) {
        if (containsText(value, query)) {
            return true;
        }
    }

    return false;
}


private String normalizeLooseText(String value) {
    String normalized = normalizeText(value).trim();
    return normalized.replaceAll("(.)\\1{2,}", "$1$1");
}

private boolean isGreeting(String question) {
    List<String> tokens = normalizeGreetingTokens(question);
    if (tokens.isEmpty()) {
        return false;
    }

    return isGreetingToken(tokens.getFirst());
}

private boolean isGreetingOnly(String question) {
    List<String> tokens = normalizeGreetingTokens(question);
    if (tokens.isEmpty()) {
        return false;
    }
    if (!isGreetingToken(tokens.getFirst())) {
        return false;
    }
    if (tokens.size() == 1) {
        return true;
    }

    for (String token : tokens) {
        if (QUESTION_HINT_TOKENS.contains(token) || PLATFORM_KEYWORDS.contains(token)) {
            return false;
        }
        if (isGreetingToken(token) || GREETING_COURTESY_TOKENS.contains(token)) {
            continue;
        }
        return false;
    }

    return true;
}

private List<String> normalizeGreetingTokens(String question) {
    String normalized = normalizeLooseText(question);
    if (normalized.isBlank()) {
        return List.of();
    }

    List<String> result = new ArrayList<>();
    for (String token : extractTokens(normalized)) {
        String expanded = SHORTCUT_NORMALIZATION.getOrDefault(token, token);
        result.addAll(extractTokens(expanded));
    }
    return result;
}

private boolean isGreetingToken(String token) {
    if (!StringUtils.hasText(token)) {
        return false;
    }
    if (GREETING_BASE_TOKENS.contains(token)) {
        return true;
    }
    if (token.startsWith("salu") || token.startsWith("bonjou") || token.startsWith("bonso")) {
        return true;
    }
    if (token.startsWith("helo") || token.startsWith("hell")) {
        return true;
    }
    if (token.startsWith("coucou")) {
        return true;
    }
    if (token.equals("hi") || token.equals("hey") || token.equals("cc")) {
        return true;
    }
    return false;
}

private int computeRelevanceScore(
    WebsiteKnowledgeEntry entry,
    String question,
    String currentRoute,
    String userRole
) {
    String normalizedQuestion = normalizeText(question);
    String normalizedRoute = normalizeText(currentRoute);
    boolean roleMatches = isRoleAllowedForEntry(entry, userRole);

    int score = 0;

    score += matchStrength(entry.title(), normalizedQuestion) * 5;
    score += matchStrength(entry.description(), normalizedQuestion) * 3;
    score += matchStrength(entry.notes(), normalizedQuestion) * 1;
    score += matchStrength(entry.route(), normalizedQuestion) * 3;
    score += matchStrengthList(entry.aliases(), normalizedQuestion) * 3;
    score += matchStrengthList(entry.keywords(), normalizedQuestion) * 4;
    score += matchStrengthList(entry.faqHints(), normalizedQuestion) * 4;
    score += matchStrengthList(entry.mainActions(), normalizedQuestion) * 2;

    if (question != null && question.trim().length() > 5 && currentRoute != null && !currentRoute.isBlank()) {
        score += matchStrength(entry.route(), normalizedRoute);
        score += matchStrengthList(entry.aliases(), normalizedRoute);
    }

    if (score == 0) {
        return 0;
    }

    if (roleMatches) {
        score += 2;
    } else {
        score = Math.max(1, score - 2);
    }

    return score;
}


private int matchStrength(String source, String query) {
    if (source == null || query == null || query.isBlank()) {
        return 0;
    }

    String normalizedSource = normalizeText(source);
    int matches = 0;

    for (String token : query.split("\\s+")) {
        if (!token.isBlank() && token.length() > 2 && normalizedSource.contains(token)) {
            matches++;
        }
    }

    return matches;
}

private int matchStrengthList(List<String> values, String query) {
    if (values == null || values.isEmpty() || query == null || query.isBlank()) {
        return 0;
    }

    int total = 0;
    for (String value : values) {
        total += matchStrength(value, query);
    }

    return total;
}


    private AssistantDraft buildTeacherAnswer(
        User currentUser,
        String question,
        String periodLabel,
        AssistantLanguage language
    ) {
        PersonalDashboardResponse personal = dashboardService.getPersonalDashboard(currentUser.getEmail(), periodLabel);
        List<TeachingActivity> teachings = teachingActivityRepository.findByUserIdAndAcademicYearOrderByCreatedAtDesc(
            currentUser.getId(),
            periodLabel
        );
        List<ResearchActivity> researches = researchActivityRepository.findByUserIdAndAcademicYearOrderByCreatedAtDesc(
            currentUser.getId(),
            periodLabel
        );
        List<SupervisionActivity> supervisions = supervisionActivityRepository.findByUserIdAndAcademicYearOrderByCreatedAtDesc(
            currentUser.getId(),
            periodLabel
        );

        double compositeScore = computeCompositeScore(
            personal.totalTeachingPerformancePoints().doubleValue(),
            researches.size(),
            supervisions.size()
        );
        double facultyAveragePoints = personal.facultyTeachingPointsAverage().doubleValue();
        double teachingPoints = personal.totalTeachingPerformancePoints().doubleValue();
        double teachingGap = teachingPoints - facultyAveragePoints;

        SimulationRequest simulationRequest = detectSimulationRequest(question);
        boolean explanationAsked = isScoreExplanationQuestion(question);
        boolean comparisonAsked = isComparisonQuestion(question);
        boolean planAsked = isPlanQuestion(question);

        List<String> recommendations = new ArrayList<>();
        List<String> risks = new ArrayList<>();
        List<String> evidence = new ArrayList<>();
        List<AssistantSuggestedAction> actions = new ArrayList<>();

        String summary = message(
            language,
            "Indice composite estime a " + formatDecimal(compositeScore, language)
                + "/100 pour la periode " + periodLabel
                + ". Enseignement fort a " + formatDecimal(teachingPoints, language)
                + " pts, recherche a " + researches.size() + " activite(s), encadrement a " + supervisions.size() + ".",
            "Estimated composite index is " + formatDecimal(compositeScore, language)
                + "/100 for period " + periodLabel
                + ". Teaching is strong at " + formatDecimal(teachingPoints, language)
                + " points, research at " + researches.size() + " activities, supervision at " + supervisions.size() + "."
        );

        StringBuilder analysis = new StringBuilder();
        analysis.append(message(
            language,
            "Le moteur de regles applique les poids: enseignement "
                + formatDecimal(normalizedTeachingWeight(), language) + "%, recherche "
                + formatDecimal(normalizedResearchWeight(), language) + "%, encadrement "
                + formatDecimal(normalizedSupervisionWeight(), language) + "%. ",
            "Rule engine weights are: teaching " + formatDecimal(normalizedTeachingWeight(), language)
                + "%, research " + formatDecimal(normalizedResearchWeight(), language)
                + "%, supervision " + formatDecimal(normalizedSupervisionWeight(), language) + "%. "
        ));

        analysis.append(message(
            language,
            "Vos points d'enseignement sont " + formatSigned(teachingGap, language)
                + " par rapport a la moyenne faculte (" + formatDecimal(facultyAveragePoints, language) + "). ",
            "Your teaching points are " + formatSigned(teachingGap, language)
                + " versus faculty average (" + formatDecimal(facultyAveragePoints, language) + "). "
        ));

        if (researches.size() < assistantProperties.getTargets().getResearchActivities()) {
            analysis.append(message(
                language,
                "Le principal frein est la composante recherche, en dessous de la cible de "
                    + formatDecimal(assistantProperties.getTargets().getResearchActivities(), language) + ".",
                "The main limiting factor is research, currently below target "
                    + formatDecimal(assistantProperties.getTargets().getResearchActivities(), language) + "."
            ));
        } else {
            analysis.append(message(
                language,
                "La composante recherche est correctement alimentee pour la cible de reference.",
                "Research contribution is currently aligned with the reference target."
            ));
        }

        if (explanationAsked) {
            analysis.append(" ");
            analysis.append(message(
                language,
                "Explication score: normalisation par domaine puis aggregation ponderee. "
                    + "La formule est transparente et basee uniquement sur vos donnees dashboard/activites.",
                "Score explanation: per-domain normalization followed by weighted aggregation. "
                    + "The formula is transparent and uses only your dashboard/activity data."
            ));
        }

        if (comparisonAsked) {
            analysis.append(" ");
            if (teachingGap >= 0) {
                analysis.append(message(
                    language,
                    "Positionnement: au-dessus de la moyenne faculte sur l'enseignement.",
                    "Positioning: above faculty average on teaching."
                ));
            } else {
                analysis.append(message(
                    language,
                    "Positionnement: en dessous de la moyenne faculte sur l'enseignement.",
                    "Positioning: below faculty average on teaching."
                ));
            }
        }

        if (simulationRequest.requested()) {
            double simulatedScore = computeCompositeScore(
                teachingPoints,
                researches.size() + simulationRequest.publicationDelta(),
                supervisions.size() + simulationRequest.supervisionDelta()
            );
            double delta = simulatedScore - compositeScore;

            analysis.append(" ");
            analysis.append(message(
                language,
                "Simulation: +"
                    + simulationRequest.publicationDelta() + " publication(s) et +"
                    + simulationRequest.supervisionDelta() + " encadrement(s) -> score estime "
                    + formatDecimal(simulatedScore, language) + "/100 (gain "
                    + formatSigned(delta, language) + ").",
                "Simulation: +" + simulationRequest.publicationDelta() + " publication(s) and +"
                    + simulationRequest.supervisionDelta() + " supervision(s) -> estimated score "
                    + formatDecimal(simulatedScore, language) + "/100 (gain "
                    + formatSigned(delta, language) + ")."
            ));
        }

        recommendations.add(message(
            language,
            "Court terme (ce mois): ajouter au moins 1 activite de recherche prioritaire.",
            "Short term (this month): add at least 1 high-impact research activity."
        ));
        recommendations.add(message(
            language,
            "Moyen terme (semestre): equilibrer la charge avec des encadrements PFE et une participation conference.",
            "Mid term (semester): balance workload with PFE supervision and conference participation."
        ));
        recommendations.add(message(
            language,
            "Long terme (promotion): maintenir un flux regulier de publications indexees et un historique de validation propre.",
            "Long term (promotion): maintain steady indexed publications and clean validation history."
        ));

        if (planAsked) {
            recommendations.add(message(
                language,
                "Plan 3 mois: M1 publication, M2 conference/communication, M3 depot d'un dossier complet valide.",
                "3-month plan: M1 publication, M2 conference/communication, M3 submission of a complete validated record."
            ));
        }

        if (researches.size() == 0) {
            risks.add(message(
                language,
                "Risque de stagnation: aucune activite de recherche enregistree sur la periode.",
                "Stagnation risk: no research activity recorded in the selected period."
            ));
        }

        if (personal.totalRejectedActivities() > 0) {
            risks.add(message(
                language,
                "Risque workflow: " + personal.totalRejectedActivities() + " activite(s) rejetee(s) a corriger.",
                "Workflow risk: " + personal.totalRejectedActivities() + " rejected activity(ies) to correct."
            ));
        }

        evidence.add(message(
            language,
            "Dashboard personnel: enseignement " + personal.totalTeachingActivities()
                + ", recherche " + personal.totalResearchActivities()
                + ", encadrement " + personal.totalSupervisions() + ".",
            "Personal dashboard: teaching " + personal.totalTeachingActivities()
                + ", research " + personal.totalResearchActivities()
                + ", supervision " + personal.totalSupervisions() + "."
        ));
        evidence.add(message(
            language,
            "Comparatif faculte: moyenne enseignement "
                + formatDecimal(personal.facultyTeachingPointsAverage().doubleValue(), language) + " pts.",
            "Faculty benchmark: teaching average "
                + formatDecimal(personal.facultyTeachingPointsAverage().doubleValue(), language) + " points."
        ));

        extractDeclarationSuggestion(question, language).ifPresent((action) -> {
            actions.add(action);
            recommendations.add(message(
                language,
                "Assistant declaration: pre-remplissage propose pour accelerer la saisie et verifier la coherence.",
                "Smart declaration assistant: prefill proposed to speed up entry and run coherence checks."
            ));
        });

        attachRelevantRegulations(question, language, evidence);

        return new AssistantDraft(summary, analysis.toString().trim(), recommendations, risks, evidence, actions);
    }

    private AssistantDraft buildDepartmentHeadAnswer(
        User currentUser,
        String question,
        String periodLabel,
        AssistantLanguage language
    ) {
        DepartmentDashboardResponse dashboard = dashboardService.getDepartmentDashboard(currentUser.getEmail(), periodLabel, null);
        List<TeacherScoreRow> teacherScores = buildDepartmentTeacherScores(dashboard.departmentId(), periodLabel);

        if (teacherScores.isEmpty()) {
            String summary = message(
                language,
                "Aucun enseignant actif trouve pour le departement sur la periode " + periodLabel + ".",
                "No active teacher found in the department for period " + periodLabel + "."
            );
            return new AssistantDraft(
                summary,
                message(
                    language,
                    "Impossible de produire une comparaison d'equipe sans donnees enseignants.",
                    "Team comparison cannot be produced without teacher-level data."
                ),
                List.of(message(language, "Verifier les affectations departementales et les comptes actifs.", "Verify department assignments and active accounts.")),
                List.of(),
                List.of(),
                List.of()
            );
        }

        double teamAverage = teacherScores.stream().mapToDouble(TeacherScoreRow::compositeScore).average().orElse(0.0);
        List<TeacherScoreRow> ranked = teacherScores.stream()
            .sorted(Comparator.comparingDouble(TeacherScoreRow::compositeScore).reversed())
            .toList();
        List<TeacherScoreRow> lowPerformers = ranked.stream()
            .filter(row -> row.compositeScore() < teamAverage * 0.85)
            .toList();

        TeacherScoreRow top = ranked.getFirst();
        TeacherScoreRow bottom = ranked.get(ranked.size() - 1);
        double bottomGapPct = teamAverage <= 0 ? 0 : ((teamAverage - bottom.compositeScore()) / teamAverage) * 100.0;

        String summary = message(
            language,
            "Equipe analysee: " + ranked.size() + " enseignant(s), score moyen "
                + formatDecimal(teamAverage, language) + "/100. "
                + "Top profil: " + top.teacherName() + ".",
            "Team analyzed: " + ranked.size() + " teacher(s), average score "
                + formatDecimal(teamAverage, language) + "/100. "
                + "Top profile: " + top.teacherName() + "."
        );

        StringBuilder analysis = new StringBuilder();
        analysis.append(message(
            language,
            "L'enseignant en plus forte difficulte est " + bottom.teacherName() + " avec "
                + formatDecimal(bottom.compositeScore(), language) + "/100, soit "
                + formatDecimal(bottomGapPct, language) + "% sous la moyenne equipe. ",
            "Most critical profile is " + bottom.teacherName() + " with "
                + formatDecimal(bottom.compositeScore(), language) + "/100, i.e. "
                + formatDecimal(bottomGapPct, language) + "% below team average. "
        ));

        analysis.append(message(
            language,
            "Les ecarts proviennent principalement de la composante recherche quand les activites publiees sont insuffisantes.",
            "Observed gaps are mainly driven by research contribution when publication volume is low."
        ));

        if (isComparisonQuestion(question)) {
            String weakestList = lowPerformers.stream()
                .limit(5)
                .map(row -> row.teacherName() + " (" + formatDecimal(row.compositeScore(), language) + "/100)")
                .reduce((left, right) -> left + ", " + right)
                .orElse(message(language, "Aucun profil sous-seuil detecte", "No below-threshold profile detected"));
            analysis.append(" ");
            analysis.append(message(
                language,
                "Profils sous la moyenne departementale: " + weakestList + ".",
                "Profiles below department average: " + weakestList + "."
            ));
        }

        List<String> recommendations = new ArrayList<>();
        recommendations.add(message(
            language,
            "Repartir des activites de recherche ciblees vers les profils en dessous de la moyenne.",
            "Re-allocate targeted research opportunities to below-average profiles."
        ));
        recommendations.add(message(
            language,
            "Mettre en place un suivi mensuel compare (teaching/research/supervision) avec objectifs nominatifs.",
            "Run a monthly comparative follow-up (teaching/research/supervision) with named targets."
        ));
        recommendations.add(message(
            language,
            "Associer chaque enseignant en difficulte a un plan d'action: publication, conference, encadrement.",
            "Attach each low-performing teacher to an action plan: publication, conference, supervision."
        ));

        List<String> risks = new ArrayList<>();
        if (!lowPerformers.isEmpty()) {
            risks.add(message(
                language,
                lowPerformers.size() + " enseignant(s) presentent un risque de sous-performance persistante.",
                lowPerformers.size() + " teacher(s) show persistent underperformance risk."
            ));
        }

        List<String> evidence = new ArrayList<>();
        evidence.add(message(
            language,
            "Dashboard departemental: " + dashboard.totalTeachers()
                + " enseignant(s), " + dashboard.totalResearchActivities() + " activites recherche.",
            "Department dashboard: " + dashboard.totalTeachers()
                + " teacher(s), " + dashboard.totalResearchActivities() + " research activities."
        ));
        evidence.add(message(
            language,
            "Ecart max interne: " + top.teacherName() + " vs " + bottom.teacherName() + ".",
            "Max internal spread: " + top.teacherName() + " vs " + bottom.teacherName() + "."
        ));
        attachRelevantRegulations(question, language, evidence);

        return new AssistantDraft(summary, analysis.toString().trim(), recommendations, risks, evidence, List.of());
    }

    private AssistantDraft buildAdministrationAnswer(
        User currentUser,
        String question,
        String periodLabel,
        Long activityId,
        AssistantLanguage language
    ) {
        GlobalDashboardResponse dashboard = dashboardService.getGlobalDashboard(currentUser.getEmail(), periodLabel);
        List<TeachingActivity> teachings = teachingActivityRepository.findByAcademicYearOrderByCreatedAtDesc(periodLabel);
        List<ResearchActivity> researches = researchActivityRepository.findByAcademicYearOrderByCreatedAtDesc(periodLabel);
        List<SupervisionActivity> supervisions = supervisionActivityRepository.findByAcademicYearOrderByCreatedAtDesc(periodLabel);

        List<DetectedAnomaly> anomalies = detectAdministrationAnomalies(teachings, researches, supervisions, language);
        boolean anomalyQuestion = isAnomalyQuestion(question);

        String summary = message(
            language,
            "Controle administration: " + anomalies.size() + " anomalie(s) detectee(s) sur la periode " + periodLabel + ".",
            "Administration control: " + anomalies.size() + " anomaly(ies) detected for period " + periodLabel + "."
        );

        StringBuilder analysis = new StringBuilder();
        if (anomalies.isEmpty()) {
            analysis.append(message(
                language,
                "Aucune incoherence critique detectee dans les declarations analysees.",
                "No critical inconsistency detected in analyzed declarations."
            ));
        } else {
            String topAnomalies = anomalies.stream().limit(3).map(DetectedAnomaly::message).reduce((a, b) -> a + " | " + b).orElse("");
            analysis.append(topAnomalies);
        }

        List<String> recommendations = new ArrayList<>();
        recommendations.add(message(
            language,
            "Prioriser la verification des dossiers a surcharge horaire et des doublons detectes.",
            "Prioritize verification of overload cases and detected duplicates."
        ));
        recommendations.add(message(
            language,
            "Exiger une justification documentaire pour toute activite hors norme.",
            "Require documentary justification for any outlier declaration."
        ));

        List<String> risks = new ArrayList<>();
        long severeCount = anomalies.stream().filter(item -> item.severity() == AnomalySeverity.HIGH).count();
        if (severeCount > 0) {
            risks.add(message(
                language,
                severeCount + " anomalie(s) severe(s) peuvent fausser la validation finale.",
                severeCount + " severe anomaly(ies) may distort final validation decisions."
            ));
        }

        List<String> evidence = new ArrayList<>();
        evidence.add(message(
            language,
            "Volumes globaux: enseignement " + dashboard.totalTeachingActivities()
                + ", recherche " + dashboard.totalResearchActivities()
                + ", encadrement " + dashboard.totalSupervisions() + ".",
            "Global volumes: teaching " + dashboard.totalTeachingActivities()
                + ", research " + dashboard.totalResearchActivities()
                + ", supervision " + dashboard.totalSupervisions() + "."
        ));

        if (activityId != null) {
            ValidationAdvice advice = recommendValidationDecision(activityId, language);
            recommendations.add(advice.recommendation());
            analysis.append(" ");
            analysis.append(advice.justification());
            if (advice.risk() != null) {
                risks.add(advice.risk());
            }
        } else if (anomalyQuestion && !anomalies.isEmpty()) {
            recommendations.add(message(
                language,
                "Decision suggeree: VALIDER seulement les dossiers sans surcharge, REJETER les doublons manifestes, sinon A_VERIFIER.",
                "Suggested policy: APPROVE only non-overloaded records, REJECT obvious duplicates, otherwise MARK FOR REVIEW."
            ));
        }

        attachRelevantRegulations(question, language, evidence);

        return new AssistantDraft(summary, analysis.toString().trim(), recommendations, risks, evidence, List.of());
    }

    private AssistantDraft buildSuperAdminAnswer(
        User currentUser,
        String question,
        String periodLabel,
        AssistantLanguage language
    ) {
        List<TeachingActivity> teachings = teachingActivityRepository.findByAcademicYearOrderByCreatedAtDesc(periodLabel);
        List<ResearchActivity> researches = researchActivityRepository.findByAcademicYearOrderByCreatedAtDesc(periodLabel);
        List<SupervisionActivity> supervisions = supervisionActivityRepository.findByAcademicYearOrderByCreatedAtDesc(periodLabel);
        List<User> activeTeachers = userRepository.findByRoleInAndIsActiveTrue(List.of(RoleType.ENSEIGNANT));

        double totalTeachingPoints = teachings.stream()
            .map(activity -> teachingPerformanceCalculator.calculateDeclaredTotalPoints(activity))
            .mapToDouble(BigDecimal::doubleValue)
            .sum();

        double teacherCount = Math.max(activeTeachers.size(), 1);
        double teachingPerTeacher = totalTeachingPoints / teacherCount;
        double researchPerTeacher = researches.size() / teacherCount;
        double supervisionPerTeacher = supervisions.size() / teacherCount;
        double globalComposite = computeCompositeScore(teachingPerTeacher, researchPerTeacher, supervisionPerTeacher);

        double teachingIndex = normalizeComponent(teachingPerTeacher, assistantProperties.getTargets().getTeachingPoints());
        double researchIndex = normalizeComponent(researchPerTeacher, assistantProperties.getTargets().getResearchActivities());
        double supervisionIndex = normalizeComponent(supervisionPerTeacher, assistantProperties.getTargets().getSupervisionActivities());
        String weakestDimension = weakestDimensionLabel(teachingIndex, researchIndex, supervisionIndex, language);

        String summary = message(
            language,
            "Etat global faculte: indice strategique estime a "
                + formatDecimal(globalComposite, language) + "/100 sur " + activeTeachers.size() + " enseignant(s).",
            "Faculty global state: estimated strategic index "
                + formatDecimal(globalComposite, language) + "/100 across " + activeTeachers.size() + " teacher(s)."
        );

        StringBuilder analysis = new StringBuilder();
        analysis.append(message(
            language,
            "Dimension la plus faible: " + weakestDimension + ". "
                + "Scores normalises -> enseignement " + formatDecimal(teachingIndex, language)
                + ", recherche " + formatDecimal(researchIndex, language)
                + ", encadrement " + formatDecimal(supervisionIndex, language) + ".",
            "Weakest dimension: " + weakestDimension + ". "
                + "Normalized scores -> teaching " + formatDecimal(teachingIndex, language)
                + ", research " + formatDecimal(researchIndex, language)
                + ", supervision " + formatDecimal(supervisionIndex, language) + "."
        ));

        extractResearchBoost(question).ifPresent(percent -> {
            double projectedResearchPerTeacher = researchPerTeacher * (1.0 + (percent / 100.0));
            double projectedScore = computeCompositeScore(teachingPerTeacher, projectedResearchPerTeacher, supervisionPerTeacher);
            double gain = projectedScore - globalComposite;

            analysis.append(" ");
            analysis.append(message(
                language,
                "Simulation scenario recherche +" + formatDecimal(percent, language)
                    + "% -> indice projete " + formatDecimal(projectedScore, language)
                    + "/100 (gain " + formatSigned(gain, language) + ").",
                "Simulation with research +" + formatDecimal(percent, language)
                    + "% -> projected index " + formatDecimal(projectedScore, language)
                    + "/100 (gain " + formatSigned(gain, language) + ")."
            ));
        });

        List<String> recommendations = new ArrayList<>();
        recommendations.add(message(
            language,
            "Prioriser les politiques de stimulation recherche sur les departements en dessous du seuil cible.",
            "Prioritize research stimulation policies for departments below target threshold."
        ));
        recommendations.add(message(
            language,
            "Conditionner une part des objectifs annuels a un minimum de publications valides.",
            "Tie part of yearly objectives to a minimum number of validated publications."
        ));
        recommendations.add(message(
            language,
            "Piloter un tableau comparatif trimestriel pour suivre l'effet des mesures correctives.",
            "Run a quarterly comparative board to track the effect of corrective measures."
        ));

        List<String> risks = new ArrayList<>();
        if (researchIndex < 55.0) {
            risks.add(message(
                language,
                "Risque strategique: composante recherche insuffisante pour soutenir la progression institutionnelle.",
                "Strategic risk: research contribution is too low to sustain institutional progression."
            ));
        }

        List<String> evidence = new ArrayList<>();
        evidence.add(message(
            language,
            "Perimetre: " + departmentRepository.findAll().size() + " departement(s), "
                + activeTeachers.size() + " enseignant(s) actifs.",
            "Scope: " + departmentRepository.findAll().size() + " department(s), "
                + activeTeachers.size() + " active teacher(s)."
        ));
        evidence.add(message(
            language,
            "Volumes periode: " + teachings.size() + " enseignements, "
                + researches.size() + " recherches, " + supervisions.size() + " encadrements.",
            "Period volumes: " + teachings.size() + " teaching records, "
                + researches.size() + " research records, " + supervisions.size() + " supervision records."
        ));
        attachRelevantRegulations(question, language, evidence);

        return new AssistantDraft(summary, analysis.toString().trim(), recommendations, risks, evidence, List.of());
    }

    private List<TeacherScoreRow> buildDepartmentTeacherScores(Long departmentId, String periodLabel) {
        List<User> teachers = userRepository.findByRoleAndDepartmentIdAndIsActiveTrue(RoleType.ENSEIGNANT, departmentId);
        if (teachers.isEmpty()) {
            return List.of();
        }

        Map<Long, TeacherAccumulator> byTeacher = new LinkedHashMap<>();
        for (User teacher : teachers) {
            byTeacher.put(
                teacher.getId(),
                new TeacherAccumulator(teacher.getFirstName() + " " + teacher.getLastName())
            );
        }

        List<TeachingActivity> teachings = teachingActivityRepository.findByUserDepartmentIdAndAcademicYearOrderByCreatedAtDesc(
            departmentId,
            periodLabel
        );
        for (TeachingActivity teaching : teachings) {
            TeacherAccumulator accumulator = byTeacher.get(teaching.getUser().getId());
            if (accumulator == null) {
                continue;
            }
            accumulator.teachingPoints += teachingPerformanceCalculator.calculateDeclaredTotalPoints(teaching).doubleValue();
        }

        List<ResearchActivity> researches = researchActivityRepository.findByUserDepartmentIdAndAcademicYearOrderByCreatedAtDesc(
            departmentId,
            periodLabel
        );
        for (ResearchActivity research : researches) {
            TeacherAccumulator accumulator = byTeacher.get(research.getUser().getId());
            if (accumulator == null) {
                continue;
            }
            accumulator.researchCount++;
        }

        List<SupervisionActivity> supervisions = supervisionActivityRepository.findByUserDepartmentIdAndAcademicYearOrderByCreatedAtDesc(
            departmentId,
            periodLabel
        );
        for (SupervisionActivity supervision : supervisions) {
            TeacherAccumulator accumulator = byTeacher.get(supervision.getUser().getId());
            if (accumulator == null) {
                continue;
            }
            accumulator.supervisionCount++;
        }

        List<TeacherScoreRow> rows = new ArrayList<>();
        for (Map.Entry<Long, TeacherAccumulator> entry : byTeacher.entrySet()) {
            TeacherAccumulator value = entry.getValue();
            rows.add(new TeacherScoreRow(
                entry.getKey(),
                value.teacherName,
                computeCompositeScore(value.teachingPoints, value.researchCount, value.supervisionCount),
                value.teachingPoints,
                value.researchCount,
                value.supervisionCount
            ));
        }
        return rows;
    }

    private List<DetectedAnomaly> detectAdministrationAnomalies(
        List<TeachingActivity> teachings,
        List<ResearchActivity> researches,
        List<SupervisionActivity> supervisions,
        AssistantLanguage language
    ) {
        List<DetectedAnomaly> anomalies = new ArrayList<>();

        Map<TeacherWeekKey, Double> weeklyHours = new HashMap<>();
        for (TeachingActivity teaching : teachings) {
            if (teaching.getCreatedAt() == null || teaching.getCompletedHours() == null) {
                continue;
            }

            LocalDateTime createdAt = teaching.getCreatedAt();
            WeekFields fields = WeekFields.ISO;
            TeacherWeekKey key = new TeacherWeekKey(
                teaching.getUser().getId(),
                createdAt.getYear(),
                createdAt.get(fields.weekOfWeekBasedYear())
            );
            weeklyHours.merge(key, teaching.getCompletedHours().doubleValue(), Double::sum);

            if (teaching.getCompletedHours().doubleValue() >= assistantProperties.getThresholds().getSingleTeachingHoursAlert()) {
                anomalies.add(new DetectedAnomaly(
                    message(
                        language,
                        "Charge elevee sur une declaration: " + teaching.getUser().getFirstName() + " "
                            + teaching.getUser().getLastName() + " a saisi "
                            + formatDecimal(teaching.getCompletedHours().doubleValue(), language) + "h pour " + teaching.getModuleName() + ".",
                        "High load on single declaration: " + teaching.getUser().getFirstName() + " "
                            + teaching.getUser().getLastName() + " declared "
                            + formatDecimal(teaching.getCompletedHours().doubleValue(), language) + "h on " + teaching.getModuleName() + "."
                    ),
                    AnomalySeverity.MEDIUM
                ));
            }
        }

        for (Map.Entry<TeacherWeekKey, Double> entry : weeklyHours.entrySet()) {
            if (entry.getValue() <= assistantProperties.getThresholds().getWeeklyTeachingHoursAlert()) {
                continue;
            }
            anomalies.add(new DetectedAnomaly(
                message(
                    language,
                    "Surcharge hebdomadaire suspecte detectee a " + formatDecimal(entry.getValue(), language)
                        + "h sur une meme semaine.",
                    "Suspicious weekly overload detected at " + formatDecimal(entry.getValue(), language)
                        + "h within the same week."
                ),
                AnomalySeverity.HIGH
            ));
        }

        detectDuplicates(
            teachings,
            activity -> activity.getUser().getId()
                + "|" + activity.getAcademicYear()
                + "|" + normalizeText(activity.getModuleName())
                + "|" + normalizeText(activity.getClassName())
                + "|" + normalizeText(activity.getProgramName()),
            anomalies,
            message(language, "Doublon probable dans les declarations d'enseignement.", "Potential duplicate in teaching declarations.")
        );

        detectDuplicates(
            researches,
            activity -> activity.getUser().getId()
                + "|" + activity.getAcademicYear()
                + "|" + normalizeText(activity.getTitle())
                + "|" + normalizeText(activity.getVenueName()),
            anomalies,
            message(language, "Doublon probable dans les declarations de recherche.", "Potential duplicate in research declarations.")
        );

        detectDuplicates(
            supervisions,
            activity -> activity.getUser().getId()
                + "|" + activity.getAcademicYear()
                + "|" + normalizeText(activity.getStudentName())
                + "|" + normalizeText(activity.getSubjectTitle())
                + "|" + activity.getSupervisionType(),
            anomalies,
            message(language, "Doublon probable dans les declarations d'encadrement.", "Potential duplicate in supervision declarations.")
        );

        return anomalies.stream().limit(12).toList();
    }

    private ValidationAdvice recommendValidationDecision(Long activityId, AssistantLanguage language) {
        Activity activity = activityRepository.findById(activityId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Activite introuvable"));

        if (activity.getStatus() == ActivityStatus.REJETEE) {
            return new ValidationAdvice(
                message(language, "Decision suggeree: A_VERIFIER", "Suggested decision: REVIEW"),
                message(
                    language,
                    "Le dossier est deja rejete. Verification manuelle necessaire avant toute nouvelle action.",
                    "The record is already rejected. Manual verification is required before any further action."
                ),
                message(language, "Statut deja rejete: risque de decision incoherente.", "Already rejected status: inconsistent decision risk.")
            );
        }

        if (activity instanceof TeachingActivity teaching) {
            double completedHours = teaching.getCompletedHours() != null ? teaching.getCompletedHours().doubleValue() : 0.0;
            double plannedHours = teaching.getPlannedHours() != null ? teaching.getPlannedHours().doubleValue() : 0.0;
            if (plannedHours > 0
                && completedHours >= plannedHours * assistantProperties.getThresholds().getSevereOverloadMultiplier()) {
                return new ValidationAdvice(
                    message(language, "Decision suggeree: A_VERIFIER", "Suggested decision: REVIEW"),
                    message(
                        language,
                        "Ecarts heures realisees/plannifiees anormaux sur cette activite (" + formatDecimal(completedHours, language)
                            + "h vs " + formatDecimal(plannedHours, language) + "h).",
                        "Abnormal completed/planned hours gap for this activity (" + formatDecimal(completedHours, language)
                            + "h vs " + formatDecimal(plannedHours, language) + "h)."
                    ),
                    message(language, "Risque de declaration surestimee.", "Risk of overdeclared workload.")
                );
            }
        }

        if (activity.getStatus() == ActivityStatus.A_CORRIGER) {
            return new ValidationAdvice(
                message(language, "Decision suggeree: A_VERIFIER", "Suggested decision: REVIEW"),
                message(
                    language,
                    "Cette activite est en statut A_CORRIGER; verifier que les corrections demandees sont appliquees.",
                    "This activity is in NEEDS_CORRECTION status; verify requested corrections were applied."
                ),
                null
            );
        }

        return new ValidationAdvice(
            message(language, "Decision suggeree: VALIDER", "Suggested decision: APPROVE"),
            message(
                language,
                "Aucune anomalie bloquante detectee sur les metriques principales de cette activite.",
                "No blocking anomaly detected on key metrics for this activity."
            ),
            null
        );
    }

    private <T> void detectDuplicates(
        List<T> items,
        java.util.function.Function<T, String> keyFactory,
        List<DetectedAnomaly> target,
        String message
    ) {
        Map<String, Integer> counts = new HashMap<>();
        for (T item : items) {
            String key = keyFactory.apply(item);
            counts.merge(key, 1, Integer::sum);
        }

        boolean duplicateFound = counts.values().stream().anyMatch(count -> count > 1);
        if (duplicateFound) {
            target.add(new DetectedAnomaly(message, AnomalySeverity.HIGH));
        }
    }

    private Optional<AssistantSuggestedAction> extractDeclarationSuggestion(String question, AssistantLanguage language) {
        Matcher matcher = SUPERVISION_DECLARATION_PATTERN.matcher(normalizeText(question));
        if (!matcher.find()) {
            return Optional.empty();
        }

        int quantity = parseIntegerSafely(matcher.group(2), 1);
        Map<String, Object> prefill = Map.of(
            "supervisionType", "PFE_ENCADREMENT_ACADEMIQUE",
            "quantityValue", quantity,
            "studentName", message(language, "A completer", "To be completed"),
            "subjectTitle", message(language, "Sujet PFE a preciser", "PFE subject to be specified")
        );

        return Optional.of(new AssistantSuggestedAction(
            message(language, "Pre-remplir declaration PFE", "Prefill PFE declaration"),
            "/supervision/new",
            message(
                language,
                "Le message utilisateur decrit un encadrement; pre-remplissage propose pour verification.",
                "User message indicates supervision; prefill is proposed for validation."
            ),
            prefill
        ));
    }

    private void attachRelevantRegulations(String question, AssistantLanguage language, List<String> evidence) {
        List<String> regulations = language == AssistantLanguage.FR
            ? assistantProperties.getRegulationsFr()
            : assistantProperties.getRegulationsEn();
        if (regulations == null || regulations.isEmpty()) {
            return;
        }

        String normalizedQuestion = normalizeText(question);
        List<String> selected = regulations.stream()
            .filter(rule -> normalizedQuestion.contains("recherche") && normalizeText(rule).contains("recherche")
                || normalizedQuestion.contains("validation") && normalizeText(rule).contains("validation")
                || normalizedQuestion.contains("promotion") && normalizeText(rule).contains("promotion")
                || normalizedQuestion.contains("workflow") && normalizeText(rule).contains("workflow"))
            .limit(2)
            .toList();

        if (selected.isEmpty()) {
            selected = regulations.stream().limit(1).toList();
        }

        evidence.addAll(selected);
    }

    private String weakestDimensionLabel(double teachingIndex, double researchIndex, double supervisionIndex, AssistantLanguage language) {
        double min = Math.min(teachingIndex, Math.min(researchIndex, supervisionIndex));
        if (min == researchIndex) {
            return message(language, "recherche", "research");
        }
        if (min == supervisionIndex) {
            return message(language, "encadrement", "supervision");
        }
        return message(language, "enseignement", "teaching");
    }

    private SimulationRequest detectSimulationRequest(String question) {
        String normalized = normalizeText(question);
        boolean requested = normalized.contains("simulation")
            || normalized.contains("what if")
            || normalized.contains("si j")
            || normalized.contains("si on")
            || normalized.contains("impact");

        int publicationDelta = 0;
        int supervisionDelta = 0;

        Matcher publicationMatcher = PLUS_PUBLICATION_PATTERN.matcher(normalized);
        if (publicationMatcher.find()) {
            publicationDelta = parseIntegerSafely(publicationMatcher.group(1), 0);
        } else if (requested && (normalized.contains("publication") || normalized.contains("article"))) {
            publicationDelta = 1;
        }

        Matcher supervisionMatcher = PLUS_SUPERVISION_PATTERN.matcher(normalized);
        if (supervisionMatcher.find()) {
            supervisionDelta = parseIntegerSafely(supervisionMatcher.group(1), 0);
        } else if (requested && (normalized.contains("encadrement") || normalized.contains("pfe"))) {
            supervisionDelta = 1;
        }

        if (!requested && publicationDelta == 0 && supervisionDelta == 0) {
            return new SimulationRequest(false, 0, 0);
        }

        return new SimulationRequest(
            true,
            Math.max(0, publicationDelta),
            Math.max(0, supervisionDelta)
        );
    }

    private Optional<Double> extractResearchBoost(String question) {
        String normalized = normalizeText(question);
        if (!(normalized.contains("recherche") || normalized.contains("research"))) {
            return Optional.empty();
        }

        Matcher matcher = RESEARCH_BOOST_PATTERN.matcher(normalized);
        if (!matcher.find()) {
            return Optional.empty();
        }

        double value = parseDoubleSafely(matcher.group(1), -1.0);
        if (value <= 0) {
            return Optional.empty();
        }

        return Optional.of(Math.min(200.0, value));
    }

    private boolean isScoreExplanationQuestion(String question) {
        String normalized = normalizeText(question);
        return normalized.contains("pourquoi mon score")
            || normalized.contains("expliquer")
            || normalized.contains("explanation")
            || normalized.contains("how is my score");
    }

    private boolean isComparisonQuestion(String question) {
        String normalized = normalizeText(question);
        return normalized.contains("compare")
            || normalized.contains("moyenne")
            || normalized.contains("below")
            || normalized.contains("dessous")
            || normalized.contains("faible");
    }

    private boolean isPlanQuestion(String question) {
        String normalized = normalizeText(question);
        return normalized.contains("plan")
            || normalized.contains("promotion")
            || normalized.contains("promu")
            || normalized.contains("roadmap");
    }

    private boolean isAnomalyQuestion(String question) {
        String normalized = normalizeText(question);
        return normalized.contains("anomal")
            || normalized.contains("suspect")
            || normalized.contains("incoherence")
            || normalized.contains("doublon");
    }

    private String resolvePeriodLabel(String requestedPeriodLabel) {
        if (StringUtils.hasText(requestedPeriodLabel)) {
            return requestedPeriodLabel.trim();
        }

        LocalDate now = LocalDate.now();
        int year = now.getYear();
        if (now.getMonthValue() >= 8) {
            return year + "-" + (year + 1);
        }
        return (year - 1) + "-" + year;
    }

    private User findCurrentUser(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Utilisateur non authentifie"));
    }

private AssistantLanguage detectLanguage(String question) {
    String raw = question == null ? "" : question.toLowerCase(Locale.ROOT);
    String normalized = normalizeLooseText(question);
    List<String> tokens = extractTokens(normalized);

    Set<String> frenchMarkers = Set.of(
        "bonjour",
        "salut",
        "bonsoir",
        "comment",
        "pourquoi",
        "moyenne",
        "encadrement",
        "recherche",
        "faculte",
        "rapport",
        "activite",
        "comparez",
        "comparer",
        "entre",
        "annee",
        "derniere",
        "precedente",
        "cette",
        "mes",
        "mon",
        "ma",
        "score",
        "workflow",
        "utilisateurs"
    );
    Set<String> englishMarkers = Set.of(
        "hello",
        "hi",
        "hey",
        "how",
        "why",
        "average",
        "research",
        "report",
        "activity",
        "between",
        "last",
        "previous",
        "year",
        "my",
        "dashboard",
        "users",
        "performance",
        "improve",
        "recommendation"
    );

    int frenchScore = 0;
    int englishScore = 0;

    if (raw.matches(".*[àâçéèêëîïôûùüÿœ].*")) {
        frenchScore += 2;
    }
    if (raw.contains(" l'") || raw.contains(" d'") || raw.contains(" qu'")) {
        frenchScore++;
    }

    for (String token : tokens) {
        if (frenchMarkers.contains(token)) {
            frenchScore += 2;
        }
        if (englishMarkers.contains(token)) {
            englishScore += 2;
        }
    }

    if (normalized.contains("the ") || normalized.contains(" and ") || normalized.contains("please")) {
        englishScore++;
    }

    if (normalized.contains(" le ")
        || normalized.contains(" la ")
        || normalized.contains(" les ")
        || normalized.contains(" de ")
        || normalized.contains(" des ")
        || normalized.contains(" et ")) {
        frenchScore++;
    }

    if (tokens.contains("cmt") || tokens.contains("pk")) {
        frenchScore += 2;
    }

    return englishScore > frenchScore ? AssistantLanguage.EN : AssistantLanguage.FR;
}

    private double computeCompositeScore(double teachingPoints, double researchCount, double supervisionCount) {
        double teachingIndex = normalizeComponent(teachingPoints, assistantProperties.getTargets().getTeachingPoints());
        double researchIndex = normalizeComponent(researchCount, assistantProperties.getTargets().getResearchActivities());
        double supervisionIndex = normalizeComponent(supervisionCount, assistantProperties.getTargets().getSupervisionActivities());

        return (teachingIndex * normalizedTeachingWeight()
            + researchIndex * normalizedResearchWeight()
            + supervisionIndex * normalizedSupervisionWeight()) / 100.0;
    }

    private double normalizeComponent(double value, double target) {
        if (target <= 0) {
            return 0.0;
        }
        return Math.max(0.0, Math.min(100.0, (value / target) * 100.0));
    }

    private double normalizedTeachingWeight() {
        return normalizeWeight(assistantProperties.getWeights().getTeaching());
    }

    private double normalizedResearchWeight() {
        return normalizeWeight(assistantProperties.getWeights().getResearch());
    }

    private double normalizedSupervisionWeight() {
        return normalizeWeight(assistantProperties.getWeights().getSupervision());
    }

    private double normalizeWeight(double weightValue) {
        double sum = assistantProperties.getWeights().getTeaching()
            + assistantProperties.getWeights().getResearch()
            + assistantProperties.getWeights().getSupervision();
        if (sum <= 0) {
            return 0.0;
        }
        return (weightValue / sum) * 100.0;
    }

    private String message(AssistantLanguage language, String french, String english) {
        return language == AssistantLanguage.FR ? french : english;
    }

    private String formatStructuredAnswer(
        AssistantLanguage language,
        String summary,
        String analysis,
        List<String> recommendations,
        List<String> risks
    ) {
        StringBuilder builder = new StringBuilder();
        builder.append("1. ").append(language == AssistantLanguage.FR ? "Resume" : "Summary").append("\n");
        builder.append(summary).append("\n\n");
        builder.append("2. ").append(language == AssistantLanguage.FR ? "Analyse" : "Analysis").append("\n");
        builder.append(analysis).append("\n\n");
        builder.append("3. ").append(language == AssistantLanguage.FR ? "Recommandations" : "Recommendations").append("\n");
        for (String recommendation : recommendations) {
            builder.append("- ").append(recommendation).append("\n");
        }

        if (risks != null && !risks.isEmpty()) {
            builder.append("\n");
            builder.append("4. ").append(language == AssistantLanguage.FR ? "Risques ou anomalies" : "Risks or anomalies").append("\n");
            for (String risk : risks) {
                builder.append("- ").append(risk).append("\n");
            }
        }

        return builder.toString().trim();
    }

    private List<String> ensureNonEmpty(List<String> values, String fallback) {
        if (values == null || values.isEmpty()) {
            return List.of(fallback);
        }

        Set<String> uniqueValues = new LinkedHashSet<>();
        for (String value : values) {
            if (StringUtils.hasText(value)) {
                uniqueValues.add(value.trim());
            }
        }

        if (uniqueValues.isEmpty()) {
            return List.of(fallback);
        }

        return new ArrayList<>(uniqueValues);
    }

    private boolean containsAny(String source, String... candidates) {
        for (String candidate : candidates) {
            if (source.contains(candidate)) {
                return true;
            }
        }
        return false;
    }

    private String normalizeText(String value) {
        if (!StringUtils.hasText(value)) {
            return "";
        }

        String lower = value
            .toLowerCase(Locale.ROOT)
            .replace('\u2019', '\'');

        String normalized = Normalizer.normalize(lower, Normalizer.Form.NFD)
            .replaceAll("\\p{M}+", "");

        return normalized
            .replace('\'', ' ')
            .replaceAll("[^a-z0-9/_\\-\\s]", " ")
            .replaceAll("\\s+", " ")
            .trim();
    }

    private int parseIntegerSafely(String value, int fallback) {
        try {
            return Integer.parseInt(value);
        } catch (NumberFormatException exception) {
            return fallback;
        }
    }

    private double parseDoubleSafely(String value, double fallback) {
        try {
            return Double.parseDouble(value);
        } catch (NumberFormatException exception) {
            return fallback;
        }
    }

    private String formatDecimal(double value, AssistantLanguage language) {
        Locale locale = language == AssistantLanguage.FR ? Locale.FRANCE : Locale.US;
        return String.format(locale, "%.2f", value);
    }

    private String formatSigned(double value, AssistantLanguage language) {
        Locale locale = language == AssistantLanguage.FR ? Locale.FRANCE : Locale.US;
        return String.format(locale, "%+.2f", value);
    }

    private enum AssistantLanguage {
        FR("fr"),
        EN("en");

        private final String code;

        AssistantLanguage(String code) {
            this.code = code;
        }

        public String code() {
            return code;
        }
    }

    private record AssistantDraft(
        String summary,
        String analysis,
        List<String> recommendations,
        List<String> risks,
        List<String> evidence,
        List<AssistantSuggestedAction> suggestedActions
    ) {
    }

    private record SimulationRequest(boolean requested, int publicationDelta, int supervisionDelta) {
    }

    private record TeacherScoreRow(
        Long teacherId,
        String teacherName,
        double compositeScore,
        double teachingPoints,
        int researchCount,
        int supervisionCount
    ) {
    }

    private record TeacherWeekKey(Long teacherId, int year, int week) {
    }

    private record ValidationAdvice(String recommendation, String justification, String risk) {
    }

    private enum AnomalySeverity {
        MEDIUM,
        HIGH
    }

    private record DetectedAnomaly(String message, AnomalySeverity severity) {
    }

    private static class TeacherAccumulator {
        private final String teacherName;
        private double teachingPoints;
        private int researchCount;
        private int supervisionCount;

        private TeacherAccumulator(String teacherName) {
            this.teacherName = teacherName;
        }
    }
}

