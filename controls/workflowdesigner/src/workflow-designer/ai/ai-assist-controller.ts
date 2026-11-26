import { WorkflowAIAssistSettingsModel } from '../models/workflow-ai-assist-settings-model';
import { ResolvedAIAssistConfig, WorkflowAIAssistProvider, resolveAIAssistConfig } from '../models/workflow-ai-assist-settings';
import { L10n } from '@syncfusion/ej2-base';
import { WorkflowDefinitionModel } from '../models/workflow-definition';
import { WorkflowExecutionError, WorkflowValidationResult } from '../models/workflow-validation';
import { WorkflowJsonSerializer } from '../persistence/workflow-json-serializer';
import { WorkflowValidator } from '../validation/workflow-validator';
import { AiRequestExecutionResult, AiRequestExecutor } from '../simulation/ai-request-executor';
import { AIAssistView, PromptRequestEventArgs } from '@syncfusion/ej2-interactive-chat';
import { Button, CheckBox, ChangeEventArgs as CheckBoxChangeEventArgs, Fab, FabPosition } from '@syncfusion/ej2-buttons';
import { TextBox } from '@syncfusion/ej2-inputs';
import { DropDownList, ChangeEventArgs as DropDownChangeEventArgs } from '@syncfusion/ej2-dropdowns';
import { EditorComponents } from '../rendering/editors/editor-components';
import { ServiceLocator } from '../rendering/service';
import { createWorkflowAISchema, WorkflowAISchema } from './workflow-ai-schema';
import { AI_ASSIST_FALLBACKS, aiAssistFormatTemplate } from './ai-assist-fallbacks';
import { WorkflowConnection } from '../models/workflow-connection';
import { WorkflowStep } from '../models/workflow-step';
import { PortResolver } from '../mapping/port-resolver';

// The AI Assist settings dialog now lives in its own module so this
// file's AIAssistView integration is untouched by the EJ2 migration.
// Re-exported here so existing importers keep working unchanged.
export {
    AIAssistSettingsDialog,
    AIAssistSettingsDialogResult,
    AIAssistSettingsDialogOptions,
    AIAssistSettingsDialogHandlers
} from './ai-assist-settings-dialog';
import { AIAssistSettingsDialog, AIAssistSettingsDialogResult } from './ai-assist-settings-dialog';

type ConversationQuestionKind = 'select' | 'multi-select' | 'text';
type AssistState = 'idle' | 'loadingQuestions' | 'collectingAnswers' | 'generating' | 'failed';

interface ConversationQuestion {
    id: string;
    label: string;
    kind: ConversationQuestionKind;
    options: string[];
    required: boolean;
}

interface ConversationAnswer {
    selected?: unknown;
    manual?: string;
}

interface WorkflowQuestionPlan {
    intentClear: boolean;
    interpretedIntent: string;
    questions: ConversationQuestion[];
}

interface WorkflowConversationContext {
    intent: string;
    interpretedIntent: string;
    answers: Record<string, ConversationAnswer>;
}

/**
 * @private
 */
export interface AIAssistHost {
    /** Apply the AI-generated workflow to the canvas. */
    apply: (definition: WorkflowDefinitionModel) => void;
    /** Snapshot the current workflow JSON so the AI can be invoked with the latest state. */
    currentJson: () => WorkflowDefinitionModel;
    /** Forward a named event to host listeners (e.g. `aiAssistCompleted`, `aiAssistFailed`, `aiAssistSettingsChanged`). */
    trigger: (name: string, args: Record<string, unknown>) => void;
    /** `executionSettings.credentialMode`; only used to read the deprecated flat `credential` setting. */
    credentialMode?: () => 'Reference' | 'Inline';
    /** Resolves a credential reference through the host's `credentialRequested` handler. */
    resolveCredential?: (reference: string, signal: AbortSignal) => Promise<string>;
    /**
     * Raises `beforeRequestSend` for an AI Assist request. Resolves with `handled: true` and the response
     * when the host supplied one; rejects when the host cancelled the request.
     */
    interceptRequest?: (request: Record<string, unknown>) => Promise<{ handled: boolean; response?: unknown }>;
    /** Applies settings changed in the settings dialog through the component (`setProperties`). */
    updateSettings?: (changes: Record<string, unknown>) => void;
}

/**
 * Orchestrates requirement collection and AI workflow authoring.
 *
 * @private
 */
export class AIAssistController {
    private static legacyWarned: boolean = false;
    private static l10n: L10n | undefined;
    private static locator: ServiceLocator | undefined;
    private readonly settings: WorkflowAIAssistSettingsModel;
    private readonly host: AIAssistHost;
    private l10n: L10n;
    private readonly workflowSchema: WorkflowAISchema = createWorkflowAISchema();
    private view: HTMLElement | null = null;
    private assistView: AIAssistView | null = null;
    private floatingButton: Fab | null = null;
    private questionHost: HTMLElement | null = null;
    private hostObserver: MutationObserver | null = null;
    private settingsDialog: AIAssistSettingsDialog | null = null;
    private settingsButton: HTMLButtonElement | null = null;
    private conversation: WorkflowConversationContext | null = null;
    private questions: ConversationQuestion[] = [];
    private currentQuestionIndex: number = 0;
    private state: AssistState = 'idle';
    private activeController: AbortController | null = null;
    private lastPrompt: string = '';
    // The AI assist controller always treats the active canvas as the
    // proposal source — see `requestQuestionPlan` / `generateAndApply`.
    // Hosts can't toggle the authoring mode; "CreateNew" vs "UpdateCurrent"
    // is a prompt-time distinction the AI model makes itself per the
    // user's intent.
    private mode: 'CreateNew' | 'UpdateCurrent' = 'UpdateCurrent';

    public constructor(
        settings: WorkflowAIAssistSettingsModel,
        host: AIAssistHost,
        serviceLocator: ServiceLocator
    ) {
        this.settings = settings;
        this.host = host;
        // Resolve the shared localization instance; the main component
        // registers it before any rendering begins.
        this.l10n = serviceLocator.getService<L10n>('localization');
        // Cache the locator so `setLocale()` (reached only at runtime)
        // can re-resolve the L10n without round-tripping through the host.
        AIAssistController.locator = serviceLocator;
    }

    /**
     * Mirror a fresh L10n instance (and the shared service locator) into
     * the static channel. The host calls this from `setLocale(l10n)` so
     * that subsequent `resolveCaption()` lookups return the latest
     * translation even when the controller was constructed before the
     * locale changed.
     *
     * Declared as an instance method (rather than `static`) so the host
     * can call `this.aiAssistController.setLocale(l10n, locator)` the
     * same way it calls every other `setLocale` mirror (e.g.
     * `propertyPanel.setLocale`, `simulationLog.setLocale`). The body
     * still writes through the static fields, so a single call updates
     * every live controller and any controller constructed later.
     *
     * @param {L10n} [l10n] The optional L10n instance to use.
     * @param {ServiceLocator} [locator] The optional shared service locator.
     * @returns {void} Nothing.
     * @private
     */
    public setLocale(l10n?: L10n, locator?: ServiceLocator): void {
        AIAssistController.l10n = l10n;
        if (l10n) {
            // The instance bundle is checked first when captions are resolved, so it must follow the locale.
            this.l10n = l10n;
        }
        if (locator) {
            AIAssistController.locator = locator;
        }
        const label: string = this.resolveCaption('aiAssist');
        if (this.floatingButton) {
            this.floatingButton.content = label;
            this.floatingButton.dataBind();
            this.floatingButton.element.setAttribute('title', label);
            this.floatingButton.element.setAttribute('aria-label', label);
        }
    }

    /**
     * Resolve a localised string from the active L10n bundle, with a
     * fallback to the bundled English string. Resolution order
     * (first non-null wins):
     *   1. The static L10n mirror (set by `setLocale()` at runtime).
     *   2. The shared ServiceLocator's `localization` service.
     *   3. The per-instance L10n captured at construction.
     *   4. The bundled `AI_ASSIST_FALLBACKS` table.
     *   5. The literal key (last-resort so the chrome never goes blank).
     *
     * @param {string} key The key.
     * @param {string[]} [args] The args.
     * @returns {string} The resolved string.
     * @private
     */
    private resolveCaption(key: string, args?: string[]): string {
        const fromLocator: L10n | undefined = AIAssistController.locator
            ? AIAssistController.locator.getService<L10n>('localization')
            : undefined;
        const l10n: L10n | undefined =
            this.l10n ||
            AIAssistController.l10n ||
            fromLocator ||
            this.l10n;
        let value: string = key;
        if (l10n) {
            const localised: string = l10n.getConstant(key);
            if (localised) {
                value = localised;
            }
        }
        if (value === key && AI_ASSIST_FALLBACKS[`${key}`]) {
            value = AI_ASSIST_FALLBACKS[`${key}`];
        }
        if (args && args.length) {
            return aiAssistFormatTemplate(value, args);
        }
        return value;
    }

    public isEnabled(): boolean {
        return Boolean(this.settings && this.settings.enabled);
    }

    public createFloatingButton(container: HTMLElement): HTMLElement | null {
        if (!this.isEnabled() || this.floatingButton) {
            return this.floatingButton ? this.floatingButton.element : null;
        }
        const buttonHost: HTMLButtonElement = document.createElement('button');
        buttonHost.type = 'button';
        const label: string = this.resolveCaption('aiAssist');
        buttonHost.setAttribute('title', label);
        buttonHost.setAttribute('aria-label', label);
        buttonHost.addEventListener('click', () => this.toggleView(container));
        container.appendChild(buttonHost);
        this.floatingButton = new Fab({
            content: label, iconCss: 'e-icons e-ai-chat', iconPosition: 'Left',
            position: FabPosition.BottomRight, target: container, isPrimary: true
        }, buttonHost);
        buttonHost.classList.add('e-wf-ai-assist-toggle');
        return buttonHost;
    }

    public generateWorkflow(prompt: string): Promise<WorkflowDefinitionModel> {
        return this.generateAndApply('CreateNew', prompt, false);
    }

    public updateWorkflowFromPrompt(prompt: string): Promise<WorkflowDefinitionModel> {
        return this.generateAndApply('UpdateCurrent', prompt, true);
    }

    public destroy(): void {
        this.cancelActiveRequest();
        if (this.hostObserver) {
            this.hostObserver.disconnect();
            this.hostObserver = null;
        }
        if (this.settingsDialog) {
            this.settingsDialog.dispose();
            this.settingsDialog = null;
        }
        if (this.assistView) {
            this.assistView.destroy();
            this.assistView = null;
        }
        if (this.view) {
            this.view.remove();
            this.view = null;
        }
        if (this.floatingButton) {
            this.floatingButton.destroy();
            this.floatingButton = null;
        }
        if (this.questionHost && this.questionHost.parentElement) {
            this.questionHost.parentElement.removeChild(this.questionHost);
        }
        this.questionHost = null;
        this.settingsButton = null;
        this.resetConversation(false);
    }

    private openView(container: HTMLElement): void {
        if (!this.isEnabled()) {
            return;
        }
        if (this.assistView) {
            this.assistView.getRootElement().style.display = '';
            this.assistView.getRootElement().focus();
            return;
        }
        // Mode is constant — see field declaration. Selection between
        // CreateNew vs UpdateCurrent is made per-call by the AI model
        // (the prompt includes the current workflow JSON).
        const viewHost: HTMLDivElement = document.createElement('div');
        viewHost.className = 'e-workflow-ai-assist-host';
        viewHost.classList.add(
            this.settings.position === 'Left'
                ? 'e-wf-ai-assist-position-left'
                : 'e-wf-ai-assist-position-right'
        );
        viewHost.style.position = 'absolute';
        viewHost.style.right = this.settings.position === 'Left' ? '' : '16px';
        viewHost.style.left = this.settings.position === 'Left' ? '16px' : '';
        viewHost.style.bottom = '72px';
        viewHost.style.zIndex = '1000';
        container.appendChild(viewHost);

        this.assistView = new AIAssistView({
            height: 480,
            width: 380,
            promptPlaceholder: this.l10n.getConstant('aiPromptPlaceholder') || this.resolveCaption('aiPromptPlaceholder'),
            promptSuggestionsHeader: this.resolveCaption('aiAssistSuggestionsHeader'),
            promptSuggestions: this.settings.promptSuggestions && this.settings.promptSuggestions.length
                ? this.settings.promptSuggestions.slice(0, 6)
                : this.defaultPromptSuggestions(),
            showClearButton: true,
            promptRequest: (args: PromptRequestEventArgs) => this.handlePromptRequest(args)
        });
        this.assistView.appendTo(viewHost);
        this.view = this.assistView.getRootElement();
        this.injectSettingsGear(this.view);
        // Insert the question card into the AIAssistView root. We append it
        // to the stable `.e-view-container` (created once by Syncfusion and
        // never rebuilt). The component-managed `.e-content` and
        // `.e-content-container` are torn down and rebuilt on every prompt
        // / response change, so attaching there would detach our panel the
        // moment the user sends a prompt. `.e-view-container` survives all
        // `renderOutputContent` rebuilds, keeping the question card visible
        // inside the AIAssistView box throughout the lifecycle.
        this.ensureQuestionHost();
        this.wireHostObserver();
        this.assistView.getRootElement().focus();
    }

    /**
     * Defensive reattachment helper. Returns the live, connected question
     * host inside the Syncfusion AIAssistView box.
     *
     * The component rebuilds its `.e-content` (and inner `.e-content-container`)
     * every time `addPromptResponse`, `dataBind`, or a `prompts` mutation runs.
     * Anything attached to those internal elements becomes orphaned the moment
     * the next prompt is added. `.e-view-container` is created once by the
     * Syncfusion base class and is the only stable parent we can rely on, so
     * the question host is appended there. A MutationObserver watches for the
     * Syncfusion-injected banner / footer nodes that may shift our element and
     * re-applies it as the last child of `.e-view-container` to keep it at the
     * bottom of the message stream.
     *
     * @returns {HTMLElement | null} The live, connected question host.
     */
    private ensureQuestionHost(): HTMLElement | null {
        if (!this.view) {
            return null;
        }
        const root: HTMLElement = this.view;
        // Anchor inside the AIAssistView's vertical message area (the
        // `.e-content-container` flex column that already hosts the prompts,
        // responses, and suggestion chips). Inside that column the host
        // stacks vertically below the latest response, full width, instead
        // of being laid out horizontally by `.e-views`.
        const liveContent: HTMLElement | null =
            root.querySelector('.e-content-container') ||
            root.querySelector('.e-content') ||
            root.querySelector('.e-view-container') ||
            root.querySelector('.e-views');

        // Lazily create the host once.
        if (!this.questionHost) {
            this.questionHost = document.createElement('div');
            this.questionHost.className = 'e-wf-ai-conversation-questions';
            this.questionHost.setAttribute('data-wf-ai-host', '1');
            this.questionHost.style.display = 'none';
        }

        // CRITICAL: when no Syncfusion container exists yet — typically
        // mid-rebuild when `.e-content-container` has been removed but not
        // yet recreated — do NOT move the host to the root. The
        // MutationObserver is debounced to fire after the rebuild settles,
        // so the host stays wherever it was last placed and the next pass
        // picks up the new container. Returning the existing reference
        // (even if orphaned for a tick) avoids dragging the element outside
        // the scroll area.
        if (!liveContent) {
            return this.questionHost;
        }

        const needsReattach: boolean =
            !this.questionHost.isConnected ||
            !liveContent.contains(this.questionHost) ||
            this.questionHost.parentElement === root;

        if (needsReattach) {
            liveContent.appendChild(this.questionHost);
        }

        return this.questionHost.isConnected ? this.questionHost : null;
    }

    /**
     * Shows or hides the prompt-suggestion chips under the messages so the
     * question card is the only thing the user has to focus on while
     * answering. The chips are hidden whenever the question host is
     * visible and has content; they are restored when the user starts
     * over or after a successful workflow generation.
     *
     * @param {HTMLElement | null} host - The current question host element, or null when not attached.
     * @returns {void}
     */
    private syncSuggestionsVisibility(host: HTMLElement | null): void {
        if (!this.view) {
            return;
        }
        const suggestions: HTMLElement | null = this.view.querySelector('.e-suggestions');
        if (!suggestions) {
            return;
        }
        const hostVisible: boolean = Boolean(
            host && host.style.display !== 'none' && host.childElementCount > 0
        );
        suggestions.style.display = hostVisible ? 'none' : '';
    }

    /**
     * Starts a MutationObserver on the AIAssistView root so that any time
     * Syncfusion replaces internal nodes the question host is reattached to
     * the current live container. The reattach is scheduled on the next
     * microtask so it runs **after** Syncfusion finishes its multi-step
     * render cycle. Without this debounce, the observer fires mid-rebuild
     * when `.e-content-container` has been removed but not yet recreated,
     * causing the reattach to fall back to the root and end up outside the
     * scroll area. Idempotent; safe to call multiple times.
     *
     * @returns {void}
     */
    private wireHostObserver(): void {
        if (!this.view || this.hostObserver) {
            return;
        }
        let pending: number | null = null;
        this.hostObserver = new MutationObserver(() => {
            if (pending !== null) {
                return;
            }
            pending = window.setTimeout(() => {
                pending = null;
                this.ensureQuestionHost();
            }, 0);
        });
        this.hostObserver.observe(this.view, {
            childList: true,
            subtree: true
        });
    }

    /**
     * Variant of `assistView.addPromptResponse` that ensures the question
     * host is bound to the current live DOM immediately after the
     * AIAssistView mutates. Syncfusion builds DOM synchronously inside
     * `addPromptResponse`, so re-running `ensureQuestionHost` right after
     * keeps the panel attached without waiting for a follow-up render.
     *
     * `isFinalUpdate` controls whether Syncfusion renders the per-response
     * action toolbar (Copy / Like / Dislike). We default to `false` so
     * transient status messages (analyzing, generating, validating,
     * error/failure, manual-answer confirmations, prompt-cleared notices)
     * keep the loading-only treatment dictated by Issue 1. The toolbar is
     * only rendered when the caller marks the response as a final,
     * successfully-completed assistant reply.
     *
     * As part of Issue 2 we also defensively pin the workflow-suggestion
     * chips to the visible/empty states only:
     *  - When `isFinalUpdate === false` we set `display: none` on every
     *    `.e-suggestions` element, guaranteeing that prompt chips stay
     *    hidden while an assistant reply is in progress, regardless of
     *    Syncfusion's internal `suggestionsElement.hidden` toggling.
     *  - When `isFinalUpdate === true` we clear the inline display so
     *    Syncfusion's own `suggestionsElement.hidden = false` (issued from
     *    `renderOutputToolbarItems` for terminal updates) can take effect
     *    and the suggestion chips reappear below the completed
     *    conversation. Syncfusion places `.e-suggestions` as the last
     *    child of the `content` flex column that hosts the message
     *    stream, so the chips always render below the chat history — the
     *    DOM order satisfies the "below the conversation, not above it"
     *    requirement of Issue 2.
     *
     * @param {string} response - The response text to add.
     * @param {boolean} [isFinalUpdate=false] - Whether Syncfusion should treat this response as a final assistant reply and render its action toolbar.
     * @returns {void}
     */
    private safeAddPromptResponse(response: string, isFinalUpdate: boolean = false): void {
        if (!this.assistView) {
            return;
        }
        this.assistView.addPromptResponse(response, isFinalUpdate);
        this.applySuggestionVisibility(isFinalUpdate);
        this.ensureQuestionHost();
        // Syncfusion's `scrollToBottom` scrolls all the way to the footer of
        // the AIAssistView, which would hide the question card behind the
        // prompt textarea. We rely on the question-host's own
        // `scrollIntoView` calls when needed instead of scrolling blindly
        // here — that keeps the user's eye on the conversation content.
    }

    /**
     * Issue 2 helper: pin the workflow-suggestion chips to one of two
     * visible/empty states only — either hidden during in-progress
     * activity, or fully cleared so Syncfusion's own Success-update
     * unhide logic controls visibility after a completed workflow.
     *
     * @param {boolean} isFinalUpdate - When true, clear the inline display style so Syncfusion may unhide the chips for the completed success reply.
     * @returns {void}
     */
    private applySuggestionVisibility(isFinalUpdate: boolean): void {
        if (!this.view) {
            return;
        }
        const suggestionsList: NodeListOf<Element> = this.view.querySelectorAll('.e-suggestions');
        suggestionsList.forEach((node: Element) => {
            const element: HTMLElement = node as HTMLElement;
            element.style.display = isFinalUpdate ? '' : 'none';
        });
    }

    /**
     * Adds a click-through settings gear inside the Syncfusion AIAssistView
     * header. We hook onto the view's root toolbar (`.e-toolbar` / header
     * area) when available, otherwise we append a sticky action bar at the
     * top of the view.
     *
     * @param {HTMLElement} root - The AIAssistView root element where the gear will be mounted.
     * @returns {void}
     */
    private injectSettingsGear(root: HTMLElement): void {
        if (!root) {
            return;
        }
        const headerCandidates: HTMLElement[] = [
            root.querySelector('.e-header') as HTMLElement,
            root.querySelector('.e-toolbar') as HTMLElement,
            root.querySelector('.e-assistview-header') as HTMLElement,
            root.querySelector('header') as HTMLElement
        ].filter((candidate: HTMLElement | null): candidate is HTMLElement => Boolean(candidate));
        const target: HTMLElement | null = headerCandidates.length ? headerCandidates[0] : null;
        const gear: HTMLButtonElement = document.createElement('button');
        gear.className = 'e-wf-ai-assist-settings-gear';
        gear.setAttribute('aria-label', this.resolveCaption('aiAssistSettingsOpenAria'));
        gear.setAttribute('title', this.resolveCaption('aiAssistSettingsTitle'));
        gear.addEventListener('click', (event: MouseEvent) => {
            event.preventDefault();
            event.stopPropagation();
            this.openSettingsDialog();
        });
        if (target) {
            // Pin our icon to the right edge of the toolbar so it doesn't
            // interfere with the Syncfusion default header controls.
            gear.classList.add('e-wf-ai-assist-settings-gear--inline');
            target.appendChild(gear);
        } else {
            const wrapper: HTMLDivElement = document.createElement('div');
            wrapper.className = 'e-wf-ai-assist-settings-gear-wrap';
            wrapper.appendChild(gear);
            root.insertBefore(wrapper, root.firstChild);
        }
        // Mounted after the host is in the AIAssistView header: an EJ2
        // component initialised while detached measures zero.
        new Button({
            cssClass: 'e-wf-ai-assist-settings-gear e-flat',
            iconCss: 'e-icons e-settings'
        }).appendTo(gear);
        this.settingsButton = gear;
        this.injectCloseButton(root, target);
    }

    /**
     * Adds a dedicated close (X) button next to the settings gear in the
     * AIAssistView header, so the view can be dismissed without using the
     * FAB toggle.
     *
     * @param {HTMLElement} root - The AIAssistView root element.
     * @param {HTMLElement | null} target - The header element the gear was mounted in.
     * @returns {void}
     */
    private injectCloseButton(root: HTMLElement, target: HTMLElement | null): void {
        const close: HTMLButtonElement = document.createElement('button');
        // Reuses the gear's class so the button inherits the same absolute
        // top-right header placement; .e-wf-ai-assist-close shifts it left
        // of the gear. Keeps rendering correct even if only the newer CSS
        // subset (without the close-specific block) is loaded.
        close.className = 'e-wf-ai-assist-settings-gear e-wf-ai-assist-close';
        close.setAttribute('aria-label', this.resolveCaption('aiAssistCloseAria'));
        close.setAttribute('title', this.resolveCaption('aiAssistCloseTitle'));
        close.addEventListener('click', (event: MouseEvent) => {
            event.preventDefault();
            event.stopPropagation();
            root.style.display = 'none';
            if (this.floatingButton) {
                this.floatingButton.element.focus();
            }
        });
        if (target) {
            close.classList.add('e-wf-ai-assist-close--inline');
            target.appendChild(close);
        } else {
            const wrapper: HTMLDivElement = document.createElement('div');
            wrapper.className = 'e-wf-ai-assist-settings-gear-wrap';
            wrapper.appendChild(close);
            root.insertBefore(wrapper, root.firstChild);
        }
        new Button({
            cssClass: 'e-wf-ai-assist-settings-gear e-wf-ai-assist-close e-flat',
            iconCss: 'e-icons e-close'
        }).appendTo(close);
    }

    private openSettingsDialog(): void {
        if (!this.view) {
            return;
        }
        if (this.settingsDialog) {
            this.settingsDialog.open();
            return;
        }
        const container: HTMLElement = this.view.parentElement || document.body;
        this.settingsDialog = new AIAssistSettingsDialog(
            container,
            this.settings,
            {
                onSave: (result: AIAssistSettingsDialogResult) => this.applySettingsResult(result),
                onCancel: () => this.handleSettingsCancel(),
                credentialMode: this.host.credentialMode ? this.host.credentialMode() : 'Reference'
            },
            this.l10n
        );
        this.settingsDialog.open();
        this.refreshSettingsButtonIndicator();
    }

    private applySettingsResult(result: AIAssistSettingsDialogResult): void {
        // The dialog's single credential field is a reference name in Reference mode and a raw key
        // (development only) in Inline mode.
        const inline: boolean = this.credentialModeValue() === 'Inline';
        const credential: string = result.credential || '';
        const changes: Record<string, unknown> = {
            server: { url: result.serverUrl || '' },
            direct: {
                provider: (result.provider || '') as WorkflowAIAssistProvider,
                model: result.model || '',
                credentialRef: inline ? '' : credential,
                apiKey: inline ? credential : ''
            },
            // The dialog writes the current shape; clear the deprecated flat values it replaces.
            provider: null, model: null, credential: null, serverUrl: null
        };
        if (this.host.updateSettings) {
            this.host.updateSettings(changes);
        } else {
            this.assignSettings(changes);
        }
        this.refreshSettingsButtonIndicator();
    }

    /**
     * Writes settings in place when no host is wired to apply them through `setProperties`
     * (unit tests and standalone use).
     *
     * @param {Record<string, unknown>} changes - The changes to apply.
     * @returns {void} Nothing.
     */
    private assignSettings(changes: Record<string, unknown>): void {
        const target: Record<string, unknown> = this.settings as unknown as Record<string, unknown>;
        Object.keys(changes).forEach((key: string) => {
            const value: unknown = changes[`${key}`];
            if (value && typeof value === 'object' && !Array.isArray(value)) {
                const current: Record<string, unknown> = (target[`${key}`] || {}) as Record<string, unknown>;
                Object.keys(value as Record<string, unknown>).forEach((inner: string) => {
                    current[`${inner}`] = (value as Record<string, unknown>)[`${inner}`];
                });
                target[`${key}`] = current;
            } else {
                target[`${key}`] = value;
            }
        });
    }

    private credentialModeValue(): string {
        return this.host.credentialMode ? this.host.credentialMode() : 'Reference';
    }

    /**
     * The AI Assist configuration, with the deprecated flat settings folded in.
     *
     * @returns {ResolvedAIAssistConfig} The resolved configuration.
     */
    private config(): ResolvedAIAssistConfig {
        const config: ResolvedAIAssistConfig = resolveAIAssistConfig(this.settings, this.credentialModeValue());
        if (config.usedLegacy && !AIAssistController.legacyWarned) {
            AIAssistController.legacyWarned = true;
            // eslint-disable-next-line no-console
            console.warn('WorkflowDesigner: aiAssistSettings.provider, model, credential and serverUrl are deprecated. '
                + 'Use aiAssistSettings.direct and aiAssistSettings.server.');
        }
        return config;
    }

    private handleSettingsCancel(): void {
        this.refreshSettingsButtonIndicator();
    }

    /**
     * Renders a small green/red dot on the settings gear so users can see
     * whether the AI is configured (provider + model + a usable credential
     * for direct, or a serverUrl for server).
     *
     * @returns {void}
     */
    private refreshSettingsButtonIndicator(): void {
        if (!this.settingsButton) {
            return;
        }
        this.settingsButton.classList.remove('e-wf-ai-assist-settings-gear--ready', 'e-wf-ai-assist-settings-gear--pending');
        if (this.isReadyForCall()) {
            this.settingsButton.classList.add('e-wf-ai-assist-settings-gear--ready');
            this.settingsButton.title = this.resolveCaption('aiAssistSettingsReady');
        } else {
            this.settingsButton.classList.add('e-wf-ai-assist-settings-gear--pending');
            this.settingsButton.title = this.resolveCaption('aiAssistSettingsPending');
        }
    }

    /**
     * Returns true when the current configuration carries enough to make a
     * real AI call without raising the missing-config error message.
     *
     * @returns {boolean} Whether the controller can place an AI call today.
     */
    private isReadyForCall(): boolean {
        return !this.missingAiConfig();
    }

    private handlePromptRequest(args: PromptRequestEventArgs): void {
        const prompt: string = String(args.prompt || '').trim();
        if (!prompt) {
            return;
        }
        if (this.state === 'collectingAnswers' && this.questions.length) {
            this.saveManualAnswer(prompt);
            return;
        }
        if (this.state === 'loadingQuestions' || this.state === 'generating') {
            this.showStatus(this.resolveCaption('aiAssistBusyWait'));
            return;
        }
        void this.beginConversation(prompt);
    }

    private async beginConversation(prompt: string): Promise<void> {
        this.resetConversation(false);
        this.lastPrompt = prompt;
        this.state = 'loadingQuestions';
        this.conversation = { intent: prompt, interpretedIntent: prompt, answers: {} };
        this.renderThinking(this.resolveCaption('aiAssistThinkingAnalyze'));
        try {
            const plan: WorkflowQuestionPlan = await this.requestQuestionPlan(prompt);
            if (!this.conversation) {
                return;
            }
            this.conversation.interpretedIntent = plan.interpretedIntent || prompt;
            this.questions = plan.questions.slice(0, 5);
            if (!this.questions.length) {
                await this.finishConversation();
                return;
            }
            this.currentQuestionIndex = 0;
            this.state = 'collectingAnswers';
            this.renderCurrentQuestion();
        } catch (error) {
            this.handleFailure(error, 'Unable to prepare workflow questions.');
        }
    }

    private async requestQuestionPlan(intent: string): Promise<WorkflowQuestionPlan> {
        const currentWorkflow: WorkflowDefinitionModel = this.host.currentJson();
        const raw: unknown = await this.requestAI({
            phase: 'CollectRequirements',
            mode: this.mode,
            prompt: intent,
            workflowSchema: this.workflowSchema,
            currentWorkflow: this.mode === 'UpdateCurrent' ? currentWorkflow : undefined,
            maximumQuestions: 5,
            instruction: [
                'Analyze the workflow request. Do not generate workflow JSON in this phase.',
                'Ask only for essential missing information and never repeat details already supplied.',
                'If complete, return zero questions. If mostly clear, ask one question. Otherwise ask at most five.',
                'Prefer select or multi-select questions with useful AI-provided options. Use text only when options are unsuitable.',
                'Return JSON only in this exact shape:',
                '{"intentClear":boolean,"interpretedIntent":"string","questions":[{"id":"string","label":"string","kind":"select|multi-select|text","options":["string"],"required":boolean}]}'
            ].join('\n')
        }, true);
        return this.normalizeQuestionPlan(this.parseAIValue(raw), intent);
    }

    private normalizeQuestionPlan(value: unknown, intent: string): WorkflowQuestionPlan {
        const record: Record<string, unknown> = this.asRecord(value);
        const rawQuestions: unknown[] = Array.isArray(record.questions) ? record.questions.slice(0, 5) : [];
        const seen: Record<string, boolean> = {};
        const questions: ConversationQuestion[] = [];
        rawQuestions.forEach((item: unknown, index: number) => {
            const question: Record<string, unknown> = this.asRecord(item);
            const label: string = typeof question.label === 'string' ? question.label.trim() : '';
            if (!label) {
                return;
            }
            let id: string = typeof question.id === 'string' ? question.id.trim() : '';
            id = id || 'question_' + String(index + 1);
            if (seen[`${id}`]) {
                id += '_' + String(index + 1);
            }
            seen[`${id}`] = true;
            const options: string[] = Array.isArray(question.options)
                ? question.options.filter((option: unknown): option is string => typeof option === 'string' && Boolean(option.trim())).map((option: string) => option.trim()).slice(0, 8)
                : [];
            let kind: ConversationQuestionKind = question.kind === 'multi-select' ? 'multi-select' : question.kind === 'text' ? 'text' : 'select';
            if (kind !== 'text' && !options.length) {
                kind = 'text';
            }
            questions.push({ id, label, kind, options, required: question.required !== false });
        });
        return {
            intentClear: record.intentClear === true || questions.length === 0,
            interpretedIntent: typeof record.interpretedIntent === 'string' && record.interpretedIntent.trim()
                ? record.interpretedIntent.trim() : intent,
            questions
        };
    }

    private renderCurrentQuestion(): void {
        const host: HTMLElement | null = this.ensureQuestionHost();
        if (!host || !this.conversation || !this.questions.length) {
            return;
        }
        // The previous card's EJ2 components must be disposed before its DOM
        // is discarded; clearing the host alone would orphan every instance
        // along with any popup it owns.
        EditorComponents.clear(host);
        // Reveal the question card and hide the prompt-suggestion chips so the
        // question is the only visible action in the message area.
        host.style.display = '';
        this.syncSuggestionsVisibility(host);
        const question: ConversationQuestion = this.questions[this.currentQuestionIndex];
        const wrapper: HTMLDivElement = document.createElement('div');
        wrapper.className = 'e-wf-ai-question';
        // Attached up front so every component below is instantiated on an
        // element that is already in the document.
        host.appendChild(wrapper);
        const label: HTMLDivElement = document.createElement('div');
        label.className = 'e-wf-ai-question-label';
        label.textContent = question.label;
        wrapper.appendChild(label);
        this.renderAnswerControl(wrapper, question);
        this.renderManualAnswer(wrapper, question);
        this.createQuestionNavigation(wrapper);

        const actions: HTMLDivElement = document.createElement('div');
        actions.className = 'e-wf-ai-question-actions';
        wrapper.appendChild(actions);
        this.createButton(actions, this.resolveCaption('aiAssistStartOver'), 'e-wf-ai-start-over', () => this.clearChatHistory(true));
        this.createButton(actions, this.resolveCaption('aiAssistSubmit'), 'e-wf-ai-question-submit', () => void this.finishConversation());
        // Bring the question card into view inside the AIAssistView scroll
        // area. `scrollIntoView({ block: 'nearest' })` keeps the question in
        // the visible region without scrolling the footer textarea past the
        // bottom of the viewport (which would hide the question card behind
        // the textarea).
        try {
            (host as HTMLElement & { scrollIntoView: (opts?: { block?: string }) => void }).scrollIntoView({ block: 'nearest' });
        } catch {
            // Older browsers without scrollIntoView({ block }) — fall back to
            // the Syncfusion `scrollToBottom` helper when available.
            if (this.assistView && this.assistView.scrollToBottom) {
                this.assistView.scrollToBottom();
            }
        }
    }

    private renderAnswerControl(parent: HTMLElement, question: ConversationQuestion): void {
        const answer: ConversationAnswer = this.getAnswer(question.id);
        if (question.kind === 'select') {
            const host: HTMLInputElement = document.createElement('input');
            host.type = 'text';
            parent.appendChild(host);
            // The placeholder replaces the blank first <option> the native
            // select carried, so "nothing chosen" still reads as an empty
            // answer rather than a literal empty string in the option list.
            const select: DropDownList = new DropDownList({
                cssClass: 'e-wf-ai-question-select',
                dataSource: question.options.slice(),
                placeholder: this.l10n.getConstant('selectAnswer'),
                value: typeof answer.selected === 'string' && answer.selected ? answer.selected : null,
                change: (args: DropDownChangeEventArgs) => {
                    const next: unknown = args && args.value !== undefined && args.value !== null ? args.value : '';
                    this.saveSelectedAnswer(question.id, String(next));
                }
            });
            select.appendTo(host);
            select.element.setAttribute('aria-label', question.label);
            return;
        }
        if (question.kind === 'multi-select') {
            const selected: string[] = Array.isArray(answer.selected) ? answer.selected as string[] : [];
            // One record per option, so the group is read by iteration rather
            // than by indexing parallel arrays.
            const controls: Array<{ option: string; box: CheckBox }> = [];
            const collect: () => void = (): void => {
                this.saveSelectedAnswer(
                    question.id,
                    controls
                        .filter((entry: { option: string; box: CheckBox }) => entry.box.checked)
                        .map((entry: { option: string; box: CheckBox }) => entry.option)
                );
            };
            question.options.forEach((option: string) => {
                const row: HTMLLabelElement = document.createElement('label');
                row.className = 'e-wf-ai-question-option';
                const host: HTMLInputElement = document.createElement('input');
                host.type = 'checkbox';
                row.appendChild(host);
                parent.appendChild(row);
                const box: CheckBox = new CheckBox({
                    label: option,
                    checked: selected.indexOf(option) !== -1,
                    change: (args: CheckBoxChangeEventArgs) => {
                        void args;
                        collect();
                    }
                });
                box.appendTo(host);
                controls.push({ option: option, box: box });
            });
            return;
        }
        // `text` questions: render a real textarea inside the question card so
        // the user can type their answer without scrolling down to the
        // AIAssistView footer. The previous behaviour told the user to type
        // "in the chat prompt box below" but offered no input on the card
        // itself, leaving them stuck. Keystrokes stream into the conversation
        // state immediately; the value is also committed on Submit / Next
        // so navigating between questions preserves the typed text.
        const initial: string = this.getAnswer(question.id).manual || '';
        const textHost: HTMLTextAreaElement = document.createElement('textarea');
        parent.appendChild(textHost);
        const textarea: TextBox = new TextBox({
            multiline: true,
            cssClass: 'e-wf-ai-question-text-input',
            placeholder: this.l10n.getConstant('typeAnswerHere'),
            value: initial
        });
        textarea.appendTo(textHost);
        textarea.element.name = 'aiAssistQuestionText_' + question.id;
        textarea.element.setAttribute('aria-label', question.label);
        textarea.element.setAttribute('rows', '3');
        textarea.element.spellcheck = false;
        // Listeners stay on the inner textarea so keystroke streaming and the
        // Ctrl/Cmd+Enter shortcut behave exactly as before.
        textarea.element.addEventListener('input', () => {
            this.saveManualAnswerFor(question.id, textarea.element.value);
        });
        textarea.element.addEventListener('keydown', (event: KeyboardEvent) => {
            if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
                event.preventDefault();
                void this.finishConversation();
            }
        });
        const hint: HTMLDivElement = document.createElement('div');
        hint.className = 'e-wf-ai-question-text-hint';
        hint.textContent = this.resolveCaption('aiAssistTextHint');
        parent.appendChild(hint);
    }

    /**
     * Targeted manual-answer save for the current question without
     * advancing the question index. Used by the inline textarea so the
     * conversation state mirrors what the user has typed.
     *
     * @param {string} questionId - The question id whose manual answer is being updated.
     * @param {string} value - The raw text typed by the user.
     * @returns {void}
     */
    private saveManualAnswerFor(questionId: string, value: string): void {
        if (!this.conversation) {
            return;
        }
        const answer: ConversationAnswer = this.getAnswer(questionId);
        answer.manual = value.trim();
        this.conversation.answers[`${questionId}`] = answer;
    }

    private renderManualAnswer(parent: HTMLElement, question: ConversationQuestion): void {
        const manual: string = this.getAnswer(question.id).manual || '';
        if (!manual) {
            return;
        }
        const status: HTMLDivElement = document.createElement('div');
        status.className = 'e-wf-ai-manual-answer';
        status.textContent = this.resolveCaption('aiAssistManualAnswerPrefix', [manual]);
        parent.appendChild(status);
    }

    private createQuestionNavigation(container: HTMLElement): void {
        const navigation: HTMLDivElement = document.createElement('div');
        navigation.className = 'e-wf-ai-question-navigation';
        // Attached before any component is mounted inside it.
        container.appendChild(navigation);
        const atFirst: boolean = this.currentQuestionIndex === 0;
        const atLast: boolean = this.currentQuestionIndex >= this.questions.length - 1;
        // As before, an unavailable direction is omitted rather than
        // rendered disabled.
        if (!atFirst) {
            this.createNavButton(navigation, 'previous', this.resolveCaption('aiAssistPreviousAria'),
                                 () => this.navigateTo(this.currentQuestionIndex - 1));
        }
        const progress: HTMLSpanElement = document.createElement('span');
        progress.className = 'e-wf-ai-question-progress';
        progress.textContent = this.resolveCaption(
            'aiAssistQuestionProgress',
            [String(this.currentQuestionIndex + 1), String(this.questions.length)]
        );
        navigation.appendChild(progress);
        if (!atLast) {
            this.createNavButton(navigation, 'next', this.resolveCaption('aiAssistNextAria'),
                                 () => this.navigateTo(this.currentQuestionIndex + 1));
        }
    }

    /**
     * Builds one question-card navigation button.
     *
     * @param {HTMLElement} container The attached navigation row.
     * @param {Object} direction Which side the button represents.
     * @param {string} label The accessible name.
     * @param {Function} action The click handler.
     * @returns {void} Nothing.
     * @private
     */
    private createNavButton(
        container: HTMLElement,
        direction: 'previous' | 'next',
        label: string,
        action: () => void
    ): void {
        const host: HTMLButtonElement = document.createElement('button');
        host.className = 'e-wf-ai-question-nav';
        host.setAttribute('aria-label', label);
        container.appendChild(host);
        new Button({
            cssClass: 'e-wf-ai-question-nav e-flat',
            // Syncfusion's built-in chevrons, matching the property panel's
            // expand control rather than ad-hoc Unicode arrows.
            iconCss: direction === 'previous'
                ? 'e-icons e-chevron-left'
                : 'e-icons e-chevron-right'
        }).appendTo(host);
        host.addEventListener('click', action);
    }

    private navigateTo(index: number): void {
        if (index < 0 || index >= this.questions.length) {
            return;
        }
        this.currentQuestionIndex = index;
        this.renderCurrentQuestion();
    }

    private saveSelectedAnswer(id: string, value: unknown): void {
        if (!this.conversation) {
            return;
        }
        const answer: ConversationAnswer = this.getAnswer(id);
        answer.selected = value;
        this.conversation.answers[`${id}`] = answer;
    }

    private saveManualAnswer(value: string): void {
        if (!this.conversation || !this.questions.length) {
            return;
        }
        const question: ConversationQuestion = this.questions[this.currentQuestionIndex];
        const answer: ConversationAnswer = this.getAnswer(question.id);
        answer.manual = value.trim();
        this.conversation.answers[`${question.id}`] = answer;
        this.showStatus(this.resolveCaption('aiAssistManualAnswerRecorded', [question.label]));
        const nextUnanswered: number = this.findNextUnanswered(this.currentQuestionIndex + 1);
        if (nextUnanswered !== -1) {
            this.currentQuestionIndex = nextUnanswered;
        }
        this.renderCurrentQuestion();
    }

    private getAnswer(id: string): ConversationAnswer {
        if (!this.conversation) {
            return {};
        }
        return this.conversation.answers[`${id}`] || {};
    }

    private effectiveAnswer(id: string): unknown {
        const answer: ConversationAnswer = this.getAnswer(id);
        if (answer.manual && answer.manual.trim()) {
            return answer.manual.trim();
        }
        return answer.selected;
    }

    private findNextUnanswered(start: number): number {
        for (let index: number = start; index < this.questions.length; index++) {
            // eslint-disable-next-line security/detect-object-injection
            const question: ConversationQuestion = this.questions[index];
            if (!this.hasAnswer(question)) {
                return index;
            }
        }
        return -1;
    }

    private hasAnswer(question: ConversationQuestion): boolean {
        const value: unknown = this.effectiveAnswer(question.id);
        if (Array.isArray(value)) {
            return value.length > 0;
        }
        return value !== undefined && value !== null && String(value).trim().length > 0;
    }

    private validateAnswers(): ConversationQuestion | null {
        for (let index: number = 0; index < this.questions.length; index++) {
            // eslint-disable-next-line security/detect-object-injection
            const question: ConversationQuestion = this.questions[index];
            if (question.required && !this.hasAnswer(question)) {
                return question;
            }
        }
        return null;
    }

    private async finishConversation(): Promise<void> {
        if (!this.conversation || this.state === 'generating') {
            return;
        }
        const missing: ConversationQuestion | null = this.validateAnswers();
        if (missing) {
            this.currentQuestionIndex = this.questions.indexOf(missing);
            this.state = 'collectingAnswers';
            this.renderCurrentQuestion();
            this.showStatus(this.resolveCaption('aiAssistAnswerRequired', [missing.label]));
            return;
        }
        const context: WorkflowConversationContext = this.conversation;
        const answers: Record<string, unknown> = {};
        this.questions.forEach((question: ConversationQuestion) => {
            const value: unknown = this.effectiveAnswer(question.id);
            if (value !== undefined) {
                answers[`${question.id}`] = { question: question.label, answer: value };
            }
        });
        this.state = 'generating';
        this.renderThinking(this.resolveCaption('aiAssistThinkingGenerate'));
        const prompt: string = [
            'Original request: ' + context.intent,
            'Interpreted intent: ' + context.interpretedIntent,
            'Collected answers: ' + JSON.stringify(answers)
        ].join('\n');
        try {
            if (this.mode === 'UpdateCurrent') {
                await this.updateWorkflowFromPrompt(prompt);
            } else {
                await this.generateWorkflow(prompt);
            }
            // This is the only assistant reply in the success path. Mark it
            // as final so Syncfusion renders the Copy / Like / Dislike
            // toolbar for this completed response. Earlier status messages
            // (analyzing, generating, validating, error) are intentionally
            // non-final and therefore have no action icons.
            this.showStatus(this.resolveCaption('aiAssistSuccess'), true);
            this.resetConversation(false);
        } catch (error) {
            this.handleFailure(error, 'Unable to generate or import the workflow.');
        }
    }

    private async generateAndApply(mode: 'CreateNew' | 'UpdateCurrent', prompt: string, includeCurrent: boolean): Promise<WorkflowDefinitionModel> {
        // Always send the current workflow JSON — the AI uses it to decide
        // between an in-place update of the active workflow and a fresh
        // workflow that ignores the canvas. The `mode` field on this
        // helper is internal flag-flow that shapes the prompt copy.
        const request: Record<string, unknown> = {
            phase: 'GenerateWorkflow', mode, prompt, workflowSchema: this.workflowSchema,
            currentWorkflow: this.host.currentJson(),
            instruction: [
                'Return one complete WorkflowDefinition JSON object only. Do not use markdown or add explanations.',
                'You receive the active workflow JSON under currentWorkflow. Read it first.',
                'If the user request is unrelated to any step, variable, or output in currentWorkflow, generate a brand-new workflow that ignores the canvas contents.',
                'Otherwise, update the relevant steps in place and keep the rest of currentWorkflow. Include a top-level keep field listing every id preserved verbatim from currentWorkflow.',
                'Use exact case-sensitive step types, properties, enum values, and ports from workflowSchema.',
                'Include schemaVersion as 1.1, a name, workflowSteps, workflowConnections, and stickyNotes.',
                'Every step and connection must have a unique non-empty id. Every connection targetPort must be input.',
                'CRITICAL FORM FIELD REQUIREMENT: When generating a FormInputTrigger step, the props.fields array MUST contain objects with a non-empty "name" property for EACH field. Every form field entry must have a unique, non-empty name. Do not generate form fields without names or with empty names — the validator will reject them with FORM_FIELD_NAME error. Each field name is case-sensitive and must uniquely identify that form input.',
                'CRITICAL FORM FIELD TYPE REQUIREMENT: Every FormInputTrigger props.fields entry MUST also carry a "type" chosen exactly from: TextBox, TextArea, Number, Date, Password, Email, DropDown, CheckBoxes, RadioButton. Omitting "type" is rejected with FORM_FIELD_TYPE. For DropDown, CheckBoxes, or RadioButton fields, the entry MUST also include a non-empty "options" string array (e.g. {"name":"category","type":"DropDown","options":["Hardware","Software","Services"]}) — otherwise the validator rejects with FORM_FIELD_OPTIONS.',
                'CRITICAL EXPRESSION ROOT REQUIREMENT: every {{...}} expression path must start with one of the roots $.input, $.previousStep, $.nodes, $.action, $.ai, $.loop, $.variables, or $.simulation — nothing else. Step outputs are always referenced as {{$.nodes["<stepId>"].response.<fieldName>}}. Never invent roots like $.form, $.trigger, $.steps, $.workflow, or $.context — the validator rejects them with EXPRESSION_SYNTAX (Unknown expression root). To read a FormInputTrigger field, use {{$.input.response.<fieldName>}}.',
                'CRITICAL APPROVE REQUIREMENT: every Approve step MUST have props.reviewers (non-empty array of {type, value}, where type is one of User, Role, Group, Email — use {type:"Email", value:"cfo@example.com"} for an email reviewer), a non-empty props.requestMessage, and a non-empty props.requestFields array with at least one {label, value} entry giving reviewers context (e.g. {"label":"Amount","value":"{{$.input.response.amount}}"}). Missing reviewers/requestMessage/requestFields are rejected with APPROVE_REVIEWERS / required-prop / APPROVE_REQUEST_FIELDS errors.',
                'Connection graph rules the workflow validator enforces — your JSON must already satisfy all of these, otherwise it is rejected with FANOUT / MERGE_TOPOLOGY / CYCLE errors: (a) FANOUT — each (sourceStepId, sourcePort) tuple may have at most one outgoing connection; never emit two connections that share both the same source step and the same sourcePort. To run branches in parallel from a multi-output step (Approve, Condition, Switch, Loop), route them through the step\'s distinct output ports — Approve exposes approved and declined, Condition exposes true and false, Switch exposes one port per case, Loop exposes loop and done — so each branch uses a different sourcePort. Never invent parallel branches off a single primary output port. (b) MERGE_TOPOLOGY — the validator only rejects multiple incoming connections on a trigger step (TRIGGER_INCOMING). Every non-trigger step (including Approve, Notify, Condition, Switch, Loop, Formatter, ApiRequest, SetVariable, Filter, Sort, Delay, AI, …) accepts multiple incoming branches — each branch runs independently and the step simply fires once per arriving branch. Triggers (ManualTrigger, ScheduledTrigger, WebhookTrigger, FormInputTrigger) must always have zero incoming. Join and End are special only in that they are the conventional merge targets; no rule requires them, and any non-trigger step works as a merge target. (c) TRIGGER_INCOMING — trigger steps (ManualTrigger, ScheduledTrigger, WebhookTrigger, FormInputTrigger) must have zero incoming connections. (d) CONNECTION_DUPLICATE — duplicate (sourceStepId, sourcePort, targetStepId, targetPort) signatures are not allowed. (e) CONNECTION_SELF — sourceStepId must differ from targetStepId. (f) SOURCE_PORT_INVALID — sourcePort must be one of the output ports actually exposed by the source step per workflowSchema; the default is output. (g) CYCLE — cycles are errors. A cycle is only valid as the component-managed Loop body relationship, never as a hand-drawn edge in workflowConnections. (h) TRIGGER_REQUIRED — the workflow must contain at least one trigger step; otherwise the workflow cannot start. (i) ID format — every id (step, connection, sticky note) is non-empty, matches ^[A-Za-z0-9_-]+$, and is unique across all three collections.',
                'Include all required and variant-dependent props. Never invent unsupported fields.',
                'Worked topology example. Suppose the user wants an approval that emails the requester on approval and posts to Slack on decline, then both paths reach End. Correct Approve -> Notify wiring (no FANOUT, no double incoming on iteratee): put email_notify under sourcePort="approved" and slack_notify under sourcePort="declined", and have both notify steps forward to a single End step that is allowed to receive multiple incoming branches. So workflowConnections contains: [{id:"c1", sourceStepId:"step_approve", sourcePort:"approved", targetStepId:"step_notify_email", targetPort:"input"}, {id:"c2", sourceStepId:"step_approve", sourcePort:"declined", targetStepId:"step_notify_slack", targetPort:"input"}, {id:"c3", sourceStepId:"step_notify_email", sourcePort:"output", targetStepId:"step_end", targetPort:"input"}, {id:"c4", sourceStepId:"step_notify_slack", sourcePort:"output", targetStepId:"step_end", targetPort:"input"}]. Even if the user only asked for the approval path, do not collapse both notifies under approved — that produces an invalid workflow where step_approve.approved has two outgoing connections and triggers a FANOUT validation error.',
                'Never copy the AI Assist credential into generated AI step props. Use an empty credentialRef unless explicitly supplied as workflow content.',
                'When a property references an earlier step output, always use exactly {{$.nodes["<stepId>"].response.<fieldName>}}. The <stepId> must exactly match the case-sensitive id of an existing earlier workflow step. The <fieldName> must be a real output field produced by that step. For FormInputTrigger, use a field name declared in props.fields. For AI, use a field name declared in props.responseFields. Correct examples: {{$.nodes["step_1"].response.ticket_content}}, {{$.nodes["step_2"].response.urgency}}, and {{$.nodes["step_2"].response.sentiment}}. Incorrect examples: {{step_1.ticket_content}}, {{step_2.sentiment}}, and any expression missing $.nodes, the bracketed step id, or .response. Place the complete expression inside a JSON string property. Return valid JSON with any double quotes inside string values correctly escaped. Before returning the workflow, verify every {{...}} expression follows this exact format and references an existing step id and output field.'
            ].join('\n')
        };
        void includeCurrent;
        const raw: unknown = await this.requestAI(request, true);
        const definition: WorkflowDefinitionModel = this.parseWorkflow(raw);
        this.normalizeGeneratedConnections(definition);
        if (mode === 'UpdateCurrent') {
            this.preserveUnchanged(this.host.currentJson(), definition);
        }
        const validation: WorkflowValidationResult =
            new WorkflowValidator(this.l10n, this.credentialModeValue()).validateDefinition(definition);
        if (!validation.isValid) {
            throw new Error(
                (validation.messages || [])
                    .filter((m: { type: string }) => m.type === 'Error')
                    .map((m: { code?: string; message: string }) => (m.code || 'ERROR') + ': ' + m.message)
                    .join(' ')
            );
        }
        this.host.apply(definition);
        this.host.trigger('aiAssistCompleted', { workflow: definition });
        return definition;
    }

    private async requestAI(payload: Record<string, unknown>, jsonOutput: boolean): Promise<unknown> {
        return this.sendRequest(payload, jsonOutput);
    }

    /**
     * Source-driven AI completion. Always invokes the configured provider
     * directly via `AiRequestExecutor`. If the required AI configuration is
     * incomplete, a clear `AIConfigError` is raised so the user can fix the
     * settings.
     *
     * @param {Record<string, unknown>} payload - The request payload sent to the AI provider.
     * @param {boolean} jsonOutput - Whether the AI provider should return JSON-formatted output.
     * @returns {Promise<unknown>} The AI provider's response content.
     */
    private async sendRequest(payload: Record<string, unknown>, jsonOutput: boolean): Promise<unknown> {
        const missing: string = this.missingAiConfig();
        if (missing) {
            throw new Error(this.resolveCaption('aiAssistMissingSetting', [missing]));
        }
        this.cancelActiveRequest();
        const controller: AbortController = new AbortController();
        this.activeController = controller;
        // Standard retry / timeout is owned internally; settings.timeoutMs /
        // settings.retryPolicy are no longer part of the public surface.
        // Large schema-bearing question-plan prompts on slower providers
        // routinely exceed 30s; 120s matches the AI step's unbounded run.
        const timeoutMs: number = 120000;
        const timer: ReturnType<typeof setTimeout> = setTimeout(() => controller.abort(), timeoutMs);
        try {
            const config: ResolvedAIAssistConfig = this.config();
            // The host sees the request before any secret is resolved or attached; it can add
            // headers (Server mode), rewrite it, supply the response or cancel it.
            const request: Record<string, unknown> = {
                mode: config.mode,
                provider: config.provider,
                model: config.model,
                systemPrompt: 'You are a workflow designer assistant. Follow the supplied instruction and schema exactly.',
                prompt: JSON.stringify(payload),
                outputFormat: jsonOutput ? 'JSON' : 'Text'
            };
            if (config.mode === 'Server') {
                request.serverUrl = config.serverUrl;
            }
            if (this.host.interceptRequest) {
                const intercepted: { handled: boolean; response?: unknown } = await this.host.interceptRequest(request);
                if (intercepted.handled) {
                    return intercepted.response;
                }
            }
            const executionProps: Record<string, unknown> = { ...request };
            if (String(executionProps.mode) !== 'Server') {
                // Direct mode: a credential reference is resolved by the host; a raw key is used as is.
                let secret: string = config.apiKey;
                if (config.credentialRef) {
                    if (!this.host.resolveCredential) {
                        throw new Error(this.resolveCaption('errorAIAssistCredential'));
                    }
                    secret = await this.host.resolveCredential(config.credentialRef, controller.signal);
                }
                executionProps.credentialRef = secret;
            }
            const execution: AiRequestExecutionResult = await AiRequestExecutor.execute(executionProps, controller.signal);
            return execution.content;
        } finally {
            clearTimeout(timer);
            if (this.activeController === controller) {
                this.activeController = null;
            }
        }
    }

    /**
     * Returns the name of the first missing AI setting, or empty string when
     * configuration is complete. Used to short-circuit with a clear error
     * instead of attempting an HTTP call that would fail with an opaque network
     * message.
     *
     * @returns {string} The name of the first missing setting, or an empty string.
     */
    private missingAiConfig(): string {
        const config: ResolvedAIAssistConfig = this.config();
        if (config.mode === 'Server') {
            // The server chooses the provider and model; only its URL is required.
            return config.serverUrl ? '' : 'serverUrl';
        }
        if (!config.provider) {
            return 'provider';
        }
        if (!config.model) {
            return 'model';
        }
        return config.credentialRef || config.apiKey ? '' : 'credential';
    }

    private parseWorkflow(raw: unknown): WorkflowDefinitionModel {
        const parsed: unknown = this.parseAIValue(raw);
        const record: Record<string, unknown> = this.asRecord(parsed);
        const value: unknown = record.workflow || record.definition || parsed;
        return new WorkflowJsonSerializer().deserialize(value as WorkflowDefinitionModel | string);
    }
    /**
     * Repairs fan-out in AI-generated connections before validation. The
     * validator allows at most one outgoing connection per (sourceStepId,
     * sourcePort), but models still emit several actions wired from one
     * output port despite the instructions. For every duplicated pair the
     * first connection wins; each extra connection is re-routed — to a
     * free output port of the same source step when it has multiple ports,
     * otherwise chained after the previous connection's target so the
     * follow-up actions run sequentially instead of in parallel.
     * Endpoints that do not resolve to a step are dropped. Generic over
     * any prompt that asks for approvals, parallel operations, or multiple
     * follow-up actions.
     *
     * @param {WorkflowDefinitionModel} definition - The parsed workflow definition.
     * @returns {void}
     */
    private normalizeGeneratedConnections(definition: WorkflowDefinitionModel): void {
        const connections: WorkflowConnection[] = (definition.workflowConnections || []) as WorkflowConnection[];
        const steps: WorkflowDefinitionModel['workflowSteps'] = definition.workflowSteps || [];
        if (!connections.length) {
            return;
        }
        const stepMap: Record<string, WorkflowStep> = {};
        steps.forEach((step: WorkflowStep) => {
            if (step.id) {
                stepMap[`${step.id}`] = step;
            }
        });
        const portsOf: Record<string, string[]> = {};
        const used: Record<string, Record<string, string>> = {};
        const kept: WorkflowConnection[] = [];
        connections.forEach((connection: WorkflowConnection) => {
            const source: WorkflowStep | undefined = connection.sourceStepId ? stepMap[`${connection.sourceStepId}`] : undefined;
            const target: WorkflowStep | undefined = connection.targetStepId ? stepMap[`${connection.targetStepId}`] : undefined;
            // Drop connections whose endpoints do not resolve or that loop
            // back to their own source — both are hard validation errors.
            if (!source || !target || connection.sourceStepId === connection.targetStepId) {
                return;
            }
            if (!portsOf[`${source.id}`]) {
                portsOf[`${source.id}`] = PortResolver.getOutputPorts(source);
                used[`${source.id}`] = {};
            }
            const ports: string[] = portsOf[`${source.id}`];
            // Resolve the requested port; invalid names fall back to the
            // step's first output port (SOURCE_PORT_INVALID repair).
            const requested: string = connection.sourcePort && ports.indexOf(connection.sourcePort) !== -1
                ? connection.sourcePort
                : (ports[0] || 'output');
            if (!used[`${source.id}`][`${requested}`]) {
                // Free port: keep as-is after canonicalizing the port name.
                used[`${source.id}`][`${requested}`] = connection.targetStepId;
                connection.sourcePort = requested;
                kept.push(connection);
                return;
            }
            // The (sourceStepId, sourcePort) pair is taken. Prefer another
            // free port on the same multi-output step (Approve / Condition /
            // Switch / Loop) so parallel actions still run in parallel.
            const freePort: string | undefined = ports.find(
                (candidate: string) => !used[`${source.id}`][`${candidate}`]
            );
            if (freePort) {
                used[`${source.id}`][`${freePort}`] = connection.targetStepId;
                connection.sourcePort = freePort;
                kept.push(connection);
                return;
            }
            // Single-output source: chain this action after the step that
            // already occupies the port so the follow-ups run sequentially.
            const chainedSourceId: string = used[`${source.id}`][`${requested}`];
            const chainedStep: WorkflowStep | undefined = stepMap[`${chainedSourceId}`];
            if (!chainedStep || chainedStep.id === connection.targetStepId) {
                // No safe re-route available: drop the duplicate rather
                // than import an invalid graph.
                return;
            }
            const chainedPorts: string[] = portsOf[`${chainedStep.id}`]
                || (portsOf[`${chainedStep.id}`] = PortResolver.getOutputPorts(chainedStep), used[`${chainedStep.id}`] = {}, portsOf[`${chainedStep.id}`]);
            if (!chainedPorts.length) {
                return;
            }
            const chainedPort: string = chainedPorts[0];
            connection.sourceStepId = chainedStep.id;
            connection.sourcePort = chainedPort;
            used[`${chainedStep.id}`][`${chainedPort}`] = connection.targetStepId;
            kept.push(connection);
        });
        definition.workflowConnections = kept;
    }

    private parseAIValue(raw: unknown): unknown {
        if (typeof raw === 'string') {
            const text: string = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
            try {
                return JSON.parse(text) as unknown;
            } catch (error) {
                return raw;
            }
        }
        if (raw && typeof raw === 'object') {
            const record: Record<string, unknown> = raw as Record<string, unknown>;
            if (record.response !== undefined) {
                return this.parseAIValue(record.response);
            }
            if (record.content !== undefined && Object.keys(record).length <= 7) {
                return this.parseAIValue(record.content);
            }
        }
        return raw;
    }

    private preserveUnchanged(current: WorkflowDefinitionModel, next: WorkflowDefinitionModel): void {
        const currentMap: Record<string, typeof current.workflowSteps[0]> = {};
        (current.workflowSteps || []).forEach((step: typeof current.workflowSteps[0]) => {
            if (step.id) {
                currentMap[`${step.id}`] = step;
            }
        });
        (next.workflowSteps || []).forEach((step: typeof next.workflowSteps[0]) => {
            const existing: typeof current.workflowSteps[0] | undefined = step.id ? currentMap[`${step.id}`] : undefined;
            if (existing && existing.stepType === step.stepType && JSON.stringify(existing.props) === JSON.stringify(step.props)) {
                step.position = step.position || existing.position;
                step.size = step.size || existing.size;
                step.customProps = step.customProps || existing.customProps;
            }
        });
    }

    private handleFailure(error: unknown, prefix: string): void {
        // Executor failures are plain `aiError` envelopes ({ type, code,
        // message }), not Error instances. Nested provider payloads also put
        // the human text on `.error.message` or `.details`. String()-ing any
        // of those objects renders as "[object Object]".
        const raw: string = this.describeError(error);
        const code: string = (error && typeof error === 'object' && (error as { code?: string }).code)
            ? String((error as { code?: string }).code)
            : '';
        const hint: string = this.networkHint(code, raw);
        const message: string = hint ? (prefix + ' ' + raw + ' ' + hint) : (prefix + ' ' + raw);
        const failed: WorkflowExecutionError = { type: 'AI', message };
        this.state = 'failed';
        this.host.trigger('aiAssistFailed', { error: failed });
        this.renderFallback(message, code);
    }

    /**
     * Returns a short human-readable hint tailored to the failure code so the
     * user can fix the configuration without digging through network logs.
     *
     * @param {string} code - The AI error code (for example `AI_NETWORK`).
     * @param {string} raw - The raw error message returned by the provider/executor.
     * @returns {string} A short hint sentence, or empty when no hint applies.
     */
    private networkHint(code: string, raw: string): string {
        if (code === 'AI_NETWORK' || /failed to fetch|networkerror|cors/i.test(raw)) {
            return this.resolveCaption('aiAssistHintCORS');
        }
        if (code === 'AI_RESPONSE_READ' || /body stream already read/i.test(raw)) {
            return this.resolveCaption('aiAssistHintCORSResponse');
        }
        if (code === 'AI_HTTP_401' || code === 'AI_HTTP_403') {
            return this.resolveCaption('aiAssistHintAuth');
        }
        if (code === 'AI_HTTP_429') {
            return this.resolveCaption('aiAssistHintRateLimit');
        }
        if (code === 'AI_CREDENTIAL_REQUIRED' || code === 'AI_MODEL_REQUIRED') {
            return this.resolveCaption('aiAssistHintConfig');
        }
        return '';
    }

    private renderFallback(message: string, code?: string): void {
        // Always show the error in the visible AIAssistView message stream
        // so the user sees it even when the question host is off-screen or
        // collapsed inside the Syncfusion content area. Errors are not a
        // successfully-completed assistant response, so Syncfusion must not
        // render the Copy / Like / Dislike toolbar here.
        this.safeAddPromptResponse(message, false);
        const host: HTMLElement | null = this.ensureQuestionHost();
        if (!host) {
            return;
        }
        // Dispose the previous card's components before discarding its DOM.
        EditorComponents.clear(host);
        host.style.display = '';
        this.syncSuggestionsVisibility(host);
        const text: HTMLDivElement = document.createElement('div');
        text.className = 'e-wf-ai-error';
        text.textContent = message;
        if (code) {
            text.dataset.errorCode = code;
        }
        host.appendChild(text);
        const actions: HTMLDivElement = document.createElement('div');
        actions.className = 'e-wf-ai-question-actions';
        host.appendChild(actions);
        this.createButton(actions, this.resolveCaption('aiAssistRetry'), 'e-wf-ai-question-submit', () => void this.beginConversation(this.lastPrompt));
        this.createButton(actions, this.resolveCaption('aiAssistOpenSettings'), 'e-wf-ai-open-settings', () => this.openSettingsDialog());
        this.createButton(actions, this.resolveCaption('aiAssistStartOver'), 'e-wf-ai-start-over', () => this.clearChatHistory(true));
    }

    /**
     * Issue 3 entry point: lightweight reset used during ordinary turn
     * transitions. Drops the in-memory conversation state machine
     * (conversation / questions / currentQuestionIndex / state), cancels
     * any in-flight request, hides the question host, and lets the
     * suggestion chips behave per Issue 2. **Crucially, this method does
     * NOT touch the Syncfusion `prompts` collection** — the rendered
     * message history is preserved end-to-end across question submission,
     * workflow generation, success / failure messages, and the user
     * starting follow-up requests. The only time the visible history is
     * cleared is when `clearChatHistory` runs from an explicit user
     * action (Start Over).
     *
     * @param {boolean} showMessage - When true, append a "Current workflow request cleared…" status to the visible chat. Only used by Start Over paths; ordinary transitions leave it false.
     * @returns {void}
     */
    private resetConversation(showMessage: boolean): void {
        this.cancelActiveRequest();
        this.conversation = null;
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.state = 'idle';
        const host: HTMLElement | null = this.ensureQuestionHost();
        if (host) {
            host.textContent = '';
            // Hide the question card again so the next conversation starts
            // with the empty-state layout (prompt suggestions visible).
            host.style.display = 'none';
        }
        this.syncSuggestionsVisibility(host);
        // ISSUE 3: deliberately do NOT clear the Syncfusion `prompts`
        // collection here. The visible message history (user prompts,
        // analysis thinking messages, generation status, success / error
        // replies) must remain on screen across turn transitions. The
        // single sanctioned wipe is `clearChatHistory`, which is reached
        // only from explicit user Start Over / destroy actions. The old
        // unconditional `assistView.prompts = []; dataBind()` was wiping
        // the chat exactly when Issue 3 required preservation.
        if (showMessage) {
            this.showStatus(this.resolveCaption('aiAssistRequestCleared'));
        }
    }

    /**
     * Issue 3 sanctioned wipe. Clears the visible AI Assist message
     * history — fully destroying the Syncfusion `prompts` collection —
     * in addition to the lightweight state reset. Reachable only from
     * explicit user actions (Start Over buttons on the question card and
     * the error fallback), per Issue 3's "Only an explicit Start Over or
     * clear-chat action may clear the history" rule.
     *
     * @param {boolean} showMessage - When true, append the "cleared" status to the empty chat.
     * @returns {void}
     */
    private clearChatHistory(showMessage: boolean): void {
        this.resetConversation(showMessage);
        // After the lightweight state reset we wipe the Syncfusion
        // `prompts` collection and re-bind so the message stream returns
        // to its empty-state layout. This branch intentionally only runs
        // when the user explicitly chose Start Over — there are no other
        // callers.
        const assistView: AIAssistView | null = this.assistView;
        if (!assistView) {
            return;
        }
        try {
            // `prompts` is a public collection on `AIAssistViewModel`;
            // clearing it and calling `dataBind()` is the supported way to
            // re-render the AI Assist message stream empty.
            assistView.prompts = [];
            assistView.dataBind();
        } catch {
            // dataBind is unavailable in some older builds; skip silently
            // — the controller-level state was already reset above, so
            // any subsequent render paths still behave correctly even if
            // Syncfusion refuses to re-render.
        }
        // Start Over is an explicit return to the empty state. Restore both
        // visibility mechanisms because the cleared-status message is a
        // non-final response and Issue 2 intentionally hides suggestions
        // for non-final responses.
        const suggestions: HTMLElement | null = this.view
            ? this.view.querySelector('.e-suggestions') as HTMLElement | null
            : null;
        if (suggestions) {
            suggestions.hidden = false;
            suggestions.style.display = '';
        }
    }

    private cancelActiveRequest(): void {
        if (this.activeController) {
            this.activeController.abort();
            this.activeController = null;
        }
    }

    private renderThinking(label: string): void {
        const host: HTMLElement | null = this.ensureQuestionHost();
        if (host) {
            host.textContent = '';
        }
        if (!this.assistView) {
            return;
        }
        const html: string = '<span class="e-wf-ai-thinking">' + label +
            '<span class="e-wf-ai-thinking-dots"><i></i><i></i><i></i></span></span>';
        // Thinking / loading status is a transient in-progress reply, not a
        // final assistant response. Pass `false` so Syncfusion suppresses the
        // per-response Copy / Like / Dislike toolbar until the assistant
        // actually completes a response.
        this.safeAddPromptResponse(html, false);
    }

    private showStatus(message: string, isFinalUpdate: boolean = false): void {
        this.safeAddPromptResponse(message, isFinalUpdate);
    }

    private createButton(container: HTMLElement, text: string, className: string, action: () => void): void {
        const host: HTMLButtonElement = document.createElement('button');
        host.className = className;
        // Attached before instantiation: an EJ2 component initialised while
        // detached measures zero.
        container.appendChild(host);
        new Button({
            cssClass: className + ' e-flat',
            content: text
        }).appendTo(host);
        host.addEventListener('click', action);
    }

    private asRecord(value: unknown): Record<string, unknown> {
        return value !== null && typeof value === 'object' && !Array.isArray(value)
            ? value as Record<string, unknown> : {};
    }

    /**
     * Turns an unknown rejection into display text. Walks Error.message,
     * aiError envelopes, nested `{ error: { message } }` provider bodies, and
     * validation-message arrays so the UI never shows "[object Object]".
     *
     * @param {unknown} error - The thrown value.
     * @returns {string} A non-empty human-readable message.
     */
    private describeError(error: unknown): string {
        const text: string = this.errorText(error, 0);
        return text && text !== '[object Object]' ? text : 'Unknown error';
    }

    private errorText(error: unknown, depth: number): string {
        if (depth > 4 || error === undefined || error === null) {
            return '';
        }
        if (typeof error === 'string' || typeof error === 'number' || typeof error === 'boolean') {
            return String(error);
        }
        if (error instanceof Error && error.message && error.message !== '[object Object]') {
            return error.message;
        }
        if (Array.isArray(error)) {
            return error
                .map((item: unknown) => this.errorText(item, depth + 1))
                .filter((item: string) => !!item)
                .join(' ');
        }
        if (typeof error !== 'object') {
            return '';
        }
        const record: Record<string, unknown> = error as Record<string, unknown>;
        const direct: string = this.scalarText(record.message);
        if (direct) {
            return direct;
        }
        const nested: string = this.errorText(record.error, depth + 1)
            || this.errorText(record.details, depth + 1)
            || this.errorText(record.cause, depth + 1)
            || this.errorText(record.messages, depth + 1);
        if (nested) {
            return nested;
        }
        try {
            const json: string = JSON.stringify(error);
            return json && json !== '{}' ? json : '';
        } catch {
            return '';
        }
    }

    private scalarText(value: unknown): string {
        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
            const text: string = String(value);
            return text && text !== '[object Object]' ? text : '';
        }
        return '';
    }

    private toggleView(container: HTMLElement): void {
        if (!this.assistView) {
            this.openView(container);
            return;
        }
        const root: HTMLElement = this.assistView.getRootElement();
        root.style.display = root.style.display === 'none' ? '' : 'none';
        if (root.style.display === 'none' && this.floatingButton) {
            this.floatingButton.element.focus();
        } else {
            root.focus();
        }
    }

    private defaultPromptSuggestions(): string[] {
        return [
            'Create an approval workflow',
            'Build a notification workflow for new requests',
            'Set up a scheduled daily summary'
        ];
    }
}
