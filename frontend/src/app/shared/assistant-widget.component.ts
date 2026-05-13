import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, ViewChild, computed, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AssistantChatResponse } from '../core/models/assistant.models';
import { RoleType } from '../core/models/shared.models';
import { AuthService } from '../core/services/auth.service';
import { AssistantService } from '../core/services/assistant.service';
import { UiToastService } from '../core/services/ui-toast.service';
import { extractErrorMessage } from '../core/utils/http-error.util';
import { PerfIACubeComponent } from './perfia-cube.component';

type AssistantRole = 'ENSEIGNANT' | 'CHEF_DEPARTEMENT' | 'ADMINISTRATION' | 'SUPER_ADMIN';
type PerfIACubeRole = 'ENSEIGNANT' | 'CHEF_DEPARTEMENT' | 'ADMIN' | 'SUPER_ADMIN';

interface QuickChip {
  icon: string;
  label: string;
  prompt: string;
}

interface AssistantChatMessage {
  id: number;
  sender: 'user' | 'assistant';
  question?: string;
  response?: AssistantChatResponse;
  text?: string;
}

interface ParsedSection {
  key: string;
  kind: 'summary' | 'analysis' | 'recommendation' | 'risk';
  label: string;
  lines: string[];
  list: boolean;
}

interface StatCard {
  label: string;
  value: number;
  trend: number;
}

interface ProgressMetric {
  label: string;
  value: number;
  tone: 'teaching' | 'research' | 'supervision';
}

interface ConversationHistoryEntry {
  id: string;
  title: string;
  role: AssistantRole;
  periodLabel: string;
  createdAt: number;
  updatedAt: number;
  messages: AssistantChatMessage[];
}

@Component({
  selector: 'app-assistant-widget',
  imports: [PerfIACubeComponent],
  templateUrl: './assistant-widget.component.html',
  styleUrl: './assistant-widget.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssistantWidgetComponent {
  private static readonly HISTORY_STORAGE_PREFIX = 'perfia.assistant.history.v2';
  private static readonly LEGACY_HISTORY_STORAGE_KEY = 'perfia.assistant.history.v1';
  private static readonly MAX_HISTORY_ENTRIES = 60;
  private static readonly MAX_MESSAGES_PER_CONVERSATION = 160;

  private readonly destroyRef = inject(DestroyRef);
  private readonly authService = inject(AuthService);
  private readonly assistantService = inject(AssistantService);
  private readonly toastService = inject(UiToastService);

  @ViewChild('composerEl') private composerEl?: ElementRef<HTMLTextAreaElement>;
  @ViewChild('messagesEl') private messagesEl?: ElementRef<HTMLDivElement>;

  readonly role = this.authService.role;
  readonly isOpen = signal(false);
  readonly historyOpen = signal(false);
  readonly pending = signal(false);
  readonly draftQuestion = signal('');
  readonly periodLabel = signal(this.defaultPeriodLabel());
  readonly conversationHistory = signal<ConversationHistoryEntry[]>([]);
  readonly activeConversationId = signal<string | null>(null);
  readonly accountRole = computed<AssistantRole>(() => this.resolveAllowedRole(this.role()));
  readonly accountStorageKey = computed(() => this.buildHistoryStorageKey());
  readonly cubeRole = computed<PerfIACubeRole>(() => {
    const currentRole = this.accountRole();
    if (currentRole === 'ADMINISTRATION') {
      return 'ADMIN';
    }
    return currentRole;
  });
  private readonly initializedStorageKey = signal<string | null>(null);
  readonly messages = signal<AssistantChatMessage[]>([]);
  readonly canSend = computed(() => this.draftQuestion().trim().length > 0 && !this.pending());
  readonly activeQuickChips = computed<QuickChip[]>(() => {
    const map: Record<AssistantRole, QuickChip[]> = {
      ENSEIGNANT: [
        { icon: '⚡', label: 'Détail du score', prompt: 'Explique pourquoi mon score est faible.' },
        {
          icon: '🧠',
          label: 'Simulation what-if',
          prompt: "Que se passe-t-il si j'ajoute 1 publication et 1 encadrement ?"
        },
        { icon: '📋', label: "Plan d'action", prompt: 'Donne-moi un plan de promotion sur 3 mois.' },
        { icon: '⚠️', label: 'Anomalies', prompt: "Y a-t-il des anomalies dans mes activités ?" }
      ],
      CHEF_DEPARTEMENT: [
        { icon: '📊', label: 'Comparer équipe', prompt: 'Quels enseignants sont en difficulté dans mon département ?' },
        { icon: '🧪', label: 'Simulation charge', prompt: "Quel impact si on augmente la recherche de l'équipe de 20% ?" },
        {
          icon: '🗂️',
          label: 'Actions concrètes',
          prompt: "Donne-moi des recommandations concrètes de répartition pour équilibrer l'équipe."
        },
        { icon: '⚠️', label: 'Risques', prompt: "Quels sont les risques de sous-performance de l'équipe ?" }
      ],
      ADMINISTRATION: [
        { icon: '🛡️', label: 'Vérifier anomalies', prompt: "Y a-t-il des anomalies dans les activités soumises ?" },
        { icon: '✅', label: 'Aide validation', prompt: 'Quelle décision recommandes-tu pour valider ces dossiers ?' },
        { icon: '📁', label: 'Contrôle workflow', prompt: "Quels dossiers doivent être traités en priorité aujourd'hui ?" },
        { icon: '⚠️', label: 'Cas suspects', prompt: 'Détecte les cas suspects de surcharge ou doublon.' }
      ],
      SUPER_ADMIN: [
        { icon: '🌍', label: 'État global', prompt: "Quel est l'état global de la faculté ?" },
        { icon: '🔮', label: 'Projection 20%', prompt: "Que se passe-t-il si on augmente la recherche de 20% ?" },
        { icon: '📌', label: 'Priorités', prompt: 'Donne-moi les priorités stratégiques immédiates.' },
        { icon: '⚠️', label: 'Alertes critiques', prompt: 'Quels sont les points faibles critiques au niveau faculté ?' }
      ]
    };
    return map[this.accountRole()];
  });
  readonly onCubeClick = () => this.toggle();

  constructor() {
    effect(() => {
      const storageKey = this.accountStorageKey();
      if (this.initializedStorageKey() === storageKey) {
        return;
      }

      this.initializedStorageKey.set(storageKey);
      this.initializeConversationState();
    });
  }

  toggle() {
    this.isOpen.update((value) => !value);
    if (this.isOpen()) {
      setTimeout(() => this.scrollToBottom(), 0);
    }
  }

  updatePeriodLabel(value: string) {
    this.periodLabel.set(value);
  }

  onComposerInput(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    this.draftQuestion.set(target.value);
    this.autoResize(target);
  }

  onComposerKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  applyQuickChip(chip: QuickChip) {
    this.draftQuestion.set(chip.prompt);
    const composer = this.composerEl?.nativeElement;
    if (composer) {
      composer.value = chip.prompt;
      this.autoResize(composer);
    }
    this.sendMessage();
  }

  sendMessage() {
    const question = this.draftQuestion().trim();
    if (!question || this.pending()) {
      return;
    }

    this.historyOpen.set(false);
    this.messages.update((items) => [
      ...items,
      {
        id: Date.now(),
        sender: 'user',
        question
      }
    ]);
    this.persistCurrentConversation();
    this.draftQuestion.set('');
    this.pending.set(true);
    this.resetComposer();
    this.scrollToBottomSoon();

    this.assistantService
      .chat({
        question,
        periodLabel: this.periodLabel().trim() || null
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.pending.set(false);
          this.messages.update((items) => [
            ...items,
            {
              id: Date.now() + 1,
              sender: 'assistant',
              response
            }
          ]);
          this.persistCurrentConversation();
          this.scrollToBottomSoon();
        },
        error: (error) => {
          this.pending.set(false);
          const message = extractErrorMessage(error, "L'assistant n'a pas pu répondre.");
          this.toastService.warning('Assistant indisponible', message);
          this.messages.update((items) => [
            ...items,
            {
              id: Date.now() + 2,
              sender: 'assistant',
              text: `Résumé: Appel API indisponible.\nAnalyse: ${message}\nRecommandations: Vérifiez la disponibilité du backend puis réessayez.`
            }
          ]);
          this.persistCurrentConversation();
          this.scrollToBottomSoon();
        }
      });
  }

  runTopbarAction(action: 'history' | 'export' | 'settings') {
    switch (action) {
      case 'history':
        this.historyOpen.update((value) => !value);
        break;
      case 'export':
        this.exportConversation();
        this.toastService.success('Export', 'Conversation exportée en fichier texte.');
        break;
      case 'settings':
        this.toastService.info('Paramètres', "Les paramètres avancés arrivent dans la prochaine itération.");
        break;
    }
  }

  startNewConversation() {
    const entry = this.createConversation();
    this.activeConversationId.set(entry.id);
    this.periodLabel.set(this.defaultPeriodLabel());
    this.messages.set(entry.messages);
    this.historyOpen.set(false);
    this.persistCurrentConversation();
    this.scrollToBottomSoon();
  }

  openConversationFromHistory(entryId: string) {
    const history = this.conversationHistory();
    const target = history.find((entry) => entry.id === entryId);
    if (!target) {
      return;
    }

    this.activeConversationId.set(target.id);
    this.periodLabel.set(target.periodLabel || this.defaultPeriodLabel());
    this.messages.set(this.cloneMessages(target.messages));
    this.historyOpen.set(false);
    this.scrollToBottomSoon();
  }

  historyPreview(entry: ConversationHistoryEntry) {
    const firstUser = entry.messages.find((item) => item.sender === 'user' && item.question?.trim());
    if (firstUser?.question) {
      return firstUser.question.length > 80 ? `${firstUser.question.slice(0, 80)}…` : firstUser.question;
    }

    const firstAssistant = entry.messages.find((item) => item.sender === 'assistant');
    const assistantResponse = firstAssistant?.response as Record<string, unknown> | undefined;
    const source = firstAssistant?.text ?? (assistantResponse?.['answer'] as string | undefined) ?? '';
    const compact = source.replace(/\s+/g, ' ').trim();
    if (!compact) {
      return 'Conversation PerfIA';
    }
    return compact.length > 80 ? `${compact.slice(0, 80)}…` : compact;
  }

  formatHistoryDate(timestamp: number) {
    return new Date(timestamp).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  trackByMessageId(_: number, message: AssistantChatMessage) {
    return message.id;
  }

getSections(message: AssistantChatMessage): ParsedSection[] {
  if (message.response) {
    const response = message.response as any;

    if (response.answer) {
      return [
        {
          key: `${message.id}-answer`,
          kind: 'analysis',
          label: 'Réponse',
          lines: this.splitAnswerLines(response.answer),
          list: false
        }
      ];
    }

    const sections: ParsedSection[] = [
      {
        key: `${message.id}-summary`,
        kind: 'summary',
        label: 'Résumé',
        lines: [response.summary],
        list: false
      },
      {
        key: `${message.id}-analysis`,
        kind: 'analysis',
        label: 'Analyse',
        lines: [response.analysis],
        list: false
      },
      {
        key: `${message.id}-reco`,
        kind: 'recommendation',
        label: 'Recommandation',
        lines: response.recommendations ?? [],
        list: true
      }
    ];

    if ((response.risks ?? []).length > 0) {
      sections.push({
        key: `${message.id}-risk`,
        kind: 'risk',
        label: 'Risques',
        lines: response.risks,
        list: true
      });
    }

    return sections;
  }

  const source = message.text?.trim() ?? '';
  if (!source) {
    return [];
  }

  const lines = source
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

  const sections: ParsedSection[] = [];
  let current: ParsedSection = {
    key: `${message.id}-default`,
    kind: 'analysis',
    label: 'Analyse',
    lines: [],
    list: false
  };

  const pushCurrent = () => {
    if (!current.lines.length) {
      return;
    }
    current.list = current.lines.every((line) => /^[-•]/.test(line));
    current.lines = current.lines.map((line) => line.replace(/^[-•]\s*/, ''));
    sections.push({ ...current });
  };

  for (const line of lines) {
    const detected = this.detectSection(line);
    if (detected) {
      pushCurrent();
      current = {
        key: `${message.id}-${detected.kind}-${sections.length}`,
        kind: detected.kind,
        label: detected.label,
        lines: [line.replace(/^(\d+\.)?\s*(Résumé|Resume|Analyse|Recommandations?|Risques?)\s*:?/i, '').trim()].filter(Boolean),
        list: false
      };
    } else {
      current.lines.push(line);
    }
  }

  pushCurrent();
  return sections.length ? sections : [{ ...current }];
}

  sectionClass(kind: ParsedSection['kind']) {
    switch (kind) {
      case 'summary':
        return 'tag-summary';
      case 'analysis':
        return 'tag-analysis';
      case 'recommendation':
        return 'tag-recommendation';
      case 'risk':
      default:
        return 'tag-risk';
    }
  }

  getStats(message: AssistantChatMessage): StatCard[] {
    const text = this.messageText(message);
    const matches = [...text.matchAll(/\b\d{1,3}(?:[.,]\d+)?\b/g)] as RegExpMatchArray[];

const detected = matches
  .map((match) => Number.parseFloat(match[0].replace(',', '.')))
  .filter((value) => Number.isFinite(value));

    const defaults: Record<AssistantRole, [number, number, number]> = {
      ENSEIGNANT: [74, 49, 63],
      CHEF_DEPARTEMENT: [71, 56, 59],
      ADMINISTRATION: [77, 61, 54],
      SUPER_ADMIN: [76, 58, 57]
    };
    const fallback = defaults[this.accountRole()];

    const perf = this.clampScore(detected[0] ?? fallback[0]);
    const research = this.clampScore(detected[1] ?? fallback[1]);
    const risk = this.clampScore(detected[2] ?? fallback[2]);

    return [
      { label: 'PERF SCORE', value: perf, trend: perf >= 55 ? 3.6 : -4.2 },
      { label: 'RECHERCHE', value: research, trend: research >= 50 ? 2.4 : -3.7 },
      { label: 'RISQUE', value: risk, trend: risk <= 55 ? 2.1 : -2.9 }
    ];
  }

  getProgress(stats: StatCard[]): ProgressMetric[] {
    const perf = stats[0]?.value ?? 60;
    const research = stats[1]?.value ?? 50;
    const risk = stats[2]?.value ?? 50;
    const supervision = this.clampScore(100 - Math.abs(50 - risk) * 1.45);
    return [
      { label: 'Enseignement', value: perf, tone: 'teaching' },
      { label: 'Recherche', value: research, tone: 'research' },
      { label: 'Encadrement', value: supervision, tone: 'supervision' }
    ];
  }

  progressFillClass(tone: ProgressMetric['tone']) {
    switch (tone) {
      case 'teaching':
        return 'fill-teaching';
      case 'research':
        return 'fill-research';
      case 'supervision':
      default:
        return 'fill-supervision';
    }
  }

  trendClass(value: number) {
    return value >= 0 ? 'trend-up' : 'trend-down';
  }

  trendArrow(value: number) {
    return value >= 0 ? '▲' : '▼';
  }

  formatTrend(value: number) {
    return `${Math.abs(value).toFixed(1)}%`;
  }

  formatValue(value: number) {
    return value.toFixed(1);
  }

  formatLine(value: string) {
    return this.escapeHtml(value).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  }

  private splitAnswerLines(answer: string): string[] {
    const source = (answer ?? '').trim();
    if (!source) {
      return [];
    }

    if (/\r?\n/.test(source)) {
      return source
        .split(/\r?\n+/)
        .map((line) => line.trim())
        .filter(Boolean);
    }

    const numberedParts = source
      .split(
        /(?=\d\.\s*(?:Reponse directe|Réponse directe|Direct answer|Explication|Explanation|Etape suivante|Étape suivante|Next step))/gi
      )
      .map((line) => line.trim())
      .filter(Boolean);

    return numberedParts.length > 1 ? numberedParts : [source];
  }

  private detectSection(line: string): { kind: ParsedSection['kind']; label: string } | null {
    const normalized = line.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    if (/^(1\.)?\s*resume\b/.test(normalized)) {
      return { kind: 'summary', label: 'Résumé' };
    }
    if (/^(2\.)?\s*analyse\b/.test(normalized)) {
      return { kind: 'analysis', label: 'Analyse' };
    }
    if (/^(3\.)?\s*recommand/.test(normalized)) {
      return { kind: 'recommendation', label: 'Recommandation' };
    }
    if (/^(4\.)?\s*risque/.test(normalized)) {
      return { kind: 'risk', label: 'Risques' };
    }
    return null;
  }

private messageText(message: AssistantChatMessage) {
  if (message.response) {
    const response = message.response as any;

    if (response.answer) {
      return response.answer;
    }

    const body = [
      response.summary,
      response.analysis,
      ...(response.recommendations ?? []),
      ...(response.risks ?? [])
    ];

    return body.filter(Boolean).join(' ');
  }

  return message.text ?? message.question ?? '';
}

  private autoResize(element: HTMLTextAreaElement) {
    element.style.height = 'auto';
    element.style.height = `${Math.min(element.scrollHeight, 140)}px`;
  }

  private resetComposer() {
    const composer = this.composerEl?.nativeElement;
    if (!composer) {
      return;
    }
    composer.value = '';
    composer.style.height = '40px';
  }

  private scrollToBottomSoon() {
    setTimeout(() => this.scrollToBottom(), 0);
  }

  private scrollToBottom() {
    const container = this.messagesEl?.nativeElement;
    if (!container) {
      return;
    }
    container.scrollTop = container.scrollHeight;
  }

  private exportConversation() {
    const lines = this.messages()
      .map((message) => {
        if (message.sender === 'user') {
          return `[USER] ${message.question ?? ''}`;
        }
        return `[AI] ${this.messageText(message)}`;
      })
      .join('\n\n');

    const blob = new Blob([lines], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'perfia-chat-history.txt';
    link.click();
    URL.revokeObjectURL(url);
  }

  private initializeConversationState() {
    this.removeLegacySharedHistory();
    const history = this.readHistoryFromStorage();
    if (history.length === 0) {
      const entry = this.createConversation();
      this.activeConversationId.set(entry.id);
      this.messages.set(this.cloneMessages(entry.messages));
      this.persistHistory([entry]);
      return;
    }

    this.conversationHistory.set(history);
    const active = history[0];
    this.activeConversationId.set(active.id);
    this.periodLabel.set(active.periodLabel || this.defaultPeriodLabel());
    this.messages.set(this.cloneMessages(active.messages));
  }

  private createConversation(): ConversationHistoryEntry {
    const now = Date.now();
    return {
      id: this.createConversationId(),
      title: 'Nouvelle conversation',
      role: this.accountRole(),
      periodLabel: this.defaultPeriodLabel(),
      createdAt: now,
      updatedAt: now,
      messages: [this.createInitialAssistantMessage()]
    };
  }

  private createInitialAssistantMessage(): AssistantChatMessage {
    return {
      id: Date.now(),
      sender: 'assistant',
      text:
        "Résumé: Assistant PerfIA initialisé.\nAnalyse: Je suis prêt à analyser vos performances académiques en temps réel.\nRecommandations: Posez une question précise pour obtenir une réponse actionnable."
    };
  }

  private persistCurrentConversation() {
    const activeId = this.activeConversationId() ?? this.createConversationId();
    if (!this.activeConversationId()) {
      this.activeConversationId.set(activeId);
    }

    const now = Date.now();
    const limitedMessages = this.cloneMessages(this.messages().slice(-AssistantWidgetComponent.MAX_MESSAGES_PER_CONVERSATION));
    const currentPeriodLabel = this.periodLabel().trim() || this.defaultPeriodLabel();
    const role = this.accountRole();
    const previous = this.conversationHistory();
    const existing = previous.find((entry) => entry.id === activeId);
    const title = this.deriveConversationTitle(limitedMessages);

    const nextEntry: ConversationHistoryEntry = {
      id: activeId,
      title,
      role,
      periodLabel: currentPeriodLabel,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
      messages: limitedMessages.length > 0 ? limitedMessages : [this.createInitialAssistantMessage()]
    };

    const filtered = previous.filter((entry) => entry.id !== activeId);
    const updated = [nextEntry, ...filtered]
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(0, AssistantWidgetComponent.MAX_HISTORY_ENTRIES);

    this.persistHistory(updated);
  }

  private deriveConversationTitle(messages: AssistantChatMessage[]) {
    const firstUserQuestion = messages.find((entry) => entry.sender === 'user' && entry.question?.trim())?.question?.trim();
    if (!firstUserQuestion) {
      return 'Nouvelle conversation';
    }
    return firstUserQuestion.length > 72 ? `${firstUserQuestion.slice(0, 72)}…` : firstUserQuestion;
  }

  private createConversationId() {
    return `conv-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }

  private readHistoryFromStorage(): ConversationHistoryEntry[] {
    try {
      const raw = localStorage.getItem(this.accountStorageKey());
      if (!raw) {
        return [];
      }

      const parsed = JSON.parse(raw) as ConversationHistoryEntry[];
      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed
        .map((entry) => ({
          id: entry.id,
          title: entry.title || 'Nouvelle conversation',
          role: this.resolveAllowedRole(entry.role as RoleType),
          periodLabel: entry.periodLabel || this.defaultPeriodLabel(),
          createdAt: Number(entry.createdAt) || Date.now(),
          updatedAt: Number(entry.updatedAt) || Date.now(),
          messages: this.cloneMessages(entry.messages ?? [])
        }))
        .filter((entry) => entry.id && entry.messages.length > 0)
        .sort((a, b) => b.updatedAt - a.updatedAt)
        .slice(0, AssistantWidgetComponent.MAX_HISTORY_ENTRIES);
    } catch {
      return [];
    }
  }

  private persistHistory(entries: ConversationHistoryEntry[]) {
    this.conversationHistory.set(entries);
    try {
      localStorage.setItem(this.accountStorageKey(), JSON.stringify(entries));
    } catch {
      this.toastService.warning('Historique', "Impossible d'enregistrer l'historique localement.");
    }
  }

  private buildHistoryStorageKey() {
    const currentUser = this.authService.user();
    if (!currentUser) {
      return `${AssistantWidgetComponent.HISTORY_STORAGE_PREFIX}.anonymous`;
    }

    const safeEmail = (currentUser.email ?? 'unknown')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9._@-]/g, '_');
    return `${AssistantWidgetComponent.HISTORY_STORAGE_PREFIX}.u${currentUser.id}.${safeEmail}`;
  }

  private removeLegacySharedHistory() {
    try {
      localStorage.removeItem(AssistantWidgetComponent.LEGACY_HISTORY_STORAGE_KEY);
    } catch {
      // Ignore cleanup failure. New scoped key still prevents cross-account history leaks.
    }
  }

  private cloneMessages(messages: AssistantChatMessage[]) {
    return messages.map((message) => ({
      id: message.id,
      sender: message.sender,
      question: message.question,
      text: message.text,
      response: message.response
        ? ({
            ...((message.response as unknown) as Record<string, unknown>),
            suggestedActions: message.response.suggestedActions ?? []
          } as AssistantChatResponse)
        : undefined
    }));
  }

  private resolveAllowedRole(current: RoleType | null): AssistantRole {
    if (
      current === 'ENSEIGNANT' ||
      current === 'CHEF_DEPARTEMENT' ||
      current === 'ADMINISTRATION' ||
      current === 'SUPER_ADMIN'
    ) {
      return current;
    }
    return 'ENSEIGNANT';
  }

  private defaultPeriodLabel() {
    const now = new Date();
    const year = now.getFullYear();
    if (now.getMonth() >= 7) {
      return `${year}-${year + 1}`;
    }
    return `${year - 1}-${year}`;
  }

  private clampScore(value: number) {
    return Math.max(0, Math.min(100, value));
  }

  private escapeHtml(value: string) {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}
