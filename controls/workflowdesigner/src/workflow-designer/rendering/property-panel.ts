import { L10n } from '@syncfusion/ej2-base';
import { TextBox, NumericTextBox, ChangedEventArgs as NumericChangedEventArgs } from '@syncfusion/ej2-inputs';
import { DropDownList, ChangeEventArgs as DropDownChangeEventArgs } from '@syncfusion/ej2-dropdowns';
import { Button, CheckBox, ChangeEventArgs as CheckBoxChangeEventArgs } from '@syncfusion/ej2-buttons';
import { DateTimePicker } from '@syncfusion/ej2-calendars';
import { Dialog, Tooltip } from '@syncfusion/ej2-popups';
import { WorkflowConnection } from '../models/workflow-connection';
import { WorkflowPropertyPanelSettingsModel } from '../models/workflow-property-panel-settings-model';
import { WorkflowStep } from '../models/workflow-step';
import { WorkflowStickyNote } from '../models/workflow-sticky-note';
import { StepEditorRegistry, EditorField } from './editors/step-editor-registry';
import { FormFieldsEditor } from './editors/form-fields-editor';
import { ConditionRulesEditor } from './editors/condition-rules-editor';
import { SwitchBranchesEditor } from './editors/switch-branches-editor';
import { VariablesEditor } from './editors/variables-editor';
import { ReviewersEditor, RequestFieldsEditor } from './editors/approval-editors';
import { FormInputDialog } from './editors/form-input-dialog';
import { ApprovalDialog } from './editors/approval-dialog';
import { ResponseFieldsEditor, AiResponseFieldModel } from './editors/response-fields-editor';
import { QueryParametersEditor } from './editors/query-parameters-editor';
import { CustomStepEditor } from './editors/custom-step-editor';
import { CustomStepResolver } from './custom-step-resolver';
import { WorkflowStepCollectionSettingsModel } from '../models/workflow-node-collection-settings-model';
import { WorkflowCustomStepDefinitionModel } from '../models/workflow-custom-step-model';
import { EditorComponents } from './editors/editor-components';
import { ServiceLocator } from './service';
import { ApprovalRequestField, ReviewerRef } from '../models/workflow-step-props';
import { SuggestionBuilder, WorkflowSuggestionGroup } from '../simulation/suggestion-builder';
import { ExpressionEvaluator } from '../simulation/expression-evaluator';
import { VariablePickerPopup } from './variable-picker-popup';
import { WorkflowRuntimeContext } from '../models/workflow-runtime-context';
import { WorkflowInputFieldModel, ConditionRule } from '../models/workflow-shared-types';
import { KeyValue } from '../models/workflow-shared-types';
import { BranchRule, WorkflowVariableAssignment } from '../models/workflow-step-props';
import { LocaleContext } from '../localization/locale-context';
import { AIMemoryIntegration } from '../ai/ai-memory-integration';
import { normalizeWebhookPath } from '../runtime/webhook-utils';
import { renderHelpContent } from './help-content';
import { ScheduleEvaluator } from '../simulation/schedule-evaluator';


function inheritTooltipContentColor(content: HTMLElement): void {
    content.style.color = 'inherit';
    content.querySelectorAll<HTMLElement>('*').forEach((element: HTMLElement) => {
        element.style.color = 'inherit';
    });
}

/**
 * Property Selection.
 *
 * @private
 */
export type PropertySelection = WorkflowStep | WorkflowConnection | WorkflowStickyNote | null;

/**
 * A field the runtime-context picker can write an expression into.
 *
 * The union is deliberately wide: structured list editors that still render
 * native `<input>` / `<textarea>` elements keep working unchanged, while
 * migrated callers may pass the EJ2 `TextBox` instance instead. All reads and
 * writes go through `ExpressionTargets` so both forms behave identically.
 *
 * @private
 */
export type ExpressionTarget = HTMLInputElement | HTMLTextAreaElement | TextBox;

/** Anything the property panel owns and must dispose before re-rendering. */
interface Disposable {
    destroy(): void;
}

/**
 * Normalizes reads / writes across native inputs and EJ2 `TextBox` instances
 * so the expression picker has a single code path.
 *
 * @internal
 */
class ExpressionTargets {
    /**
     * Returns the editable DOM element backing an expression target.
     *
     * @param {ExpressionTarget} target The expression target.
     * @returns {HTMLInputElement|HTMLTextAreaElement|null} The backing element.
     * @private
     */
    public static element(target: ExpressionTarget): HTMLInputElement | HTMLTextAreaElement | null {
        if (!target) {
            return null;
        }
        if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
            return target;
        }
        const element: unknown = (target as TextBox).element;
        if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
            return element;
        }
        return null;
    }

    /**
     * Returns the current text of an expression target.
     *
     * @param {ExpressionTarget} target The expression target.
     * @returns {string} The current value.
     * @private
     */
    public static value(target: ExpressionTarget): string {
        const element: HTMLInputElement | HTMLTextAreaElement | null = ExpressionTargets.element(target);
        return element ? (element.value || '') : '';
    }

    /**
     * Writes text to an expression target. For an EJ2 `TextBox` the component
     * property is updated as well, so the instance does not go stale behind
     * the rendered input.
     *
     * @param {ExpressionTarget} target The expression target.
     * @param {string} value The value to write.
     * @returns {void}
     * @private
     */
    public static setValue(target: ExpressionTarget, value: string): void {
        const element: HTMLInputElement | HTMLTextAreaElement | null = ExpressionTargets.element(target);
        if (element) {
            element.value = value;
        }
        if (target && !(target instanceof HTMLInputElement) && !(target instanceof HTMLTextAreaElement)) {
            const textBox: TextBox = target as TextBox;
            textBox.value = value;
            textBox.dataBind();
        }
    }
}

/**
 * Right-side property section for workflow behavior and execution configuration.
 * Runtime context is a field-level popup (spec 10.1), not a permanent panel section.
 *
 * @private
 */
export class PropertyPanel {
    private readonly host: HTMLElement;
    private readonly settings: WorkflowPropertyPanelSettingsModel;
    private readonly onChange: (id: string, changes: Record<string, unknown>) => void;
    private readonly onCommit?: (stepId: string) => void;
    /** Step whose live edits have not been committed yet (an edit in progress when the panel closes). */
    private pendingCommitId: string = '';
    /**
     * Localization instance resolved from the Workflow Designer
     * `serviceLocator` so every visible caption (`Properties`,
     * `STEP NAME`, `SCHEDULE TYPE`, ...) reads through
     * `l10n.getConstant(key)` at render time. Re-broadcast on
     * `WorkflowDesigner.onPropertyChanged({locale})` via
     * `PropertyPanel.setLocale(this.l10n)`. The match-key pattern means
     * aria-only metadata flows from the same resolved value (shared-key
     * rule).
     *
     * @private
     */
    private l10n: L10n | undefined;
    /**
     * Shared service locator forwarded by the Workflow Designer so the
     * structured editors (FormFields / Reviewers / RequestFields /
     * ConditionRules / SwitchBranches) can resolve the live L10n through
     * `ServiceLocator.getService('localization')` on every `t()` call.
     * Falls back to the static `l10n` mirror when absent so the panel still
     * works in unit tests / custom hosts.
     *
     * @private
     */
    private serviceLocator: ServiceLocator | undefined;
    private root: HTMLDivElement | null = null;
    private body: HTMLDivElement | null = null;
    private expandButton: HTMLButtonElement | null = null;
    private expandButtonComponent: Button | null = null;
    private open: boolean = false;
    private current: PropertySelection = null;
    private activeInput: ExpressionTarget | null = null;
    private contextPopup: HTMLDivElement | null = null;
    private variablePicker: VariablePickerPopup | null = null;
    private contextOutsideHandler: ((event: MouseEvent) => void) | null = null;
    private contextKeyHandler: ((event: KeyboardEvent) => void) | null = null;
    /**
     * Every EJ2 component created for the current field set. The panel wipes
     * `body.innerHTML` on each render, so instances must be destroyed first
     * or their popups, document listeners and internal state leak.
     */
    private fieldInstances: Disposable[] = [];
    /** Single hover tooltip shared by every `?` / `i` help trigger. */
    private helpTooltip: Tooltip | null = null;
    /** Pending deferred re-render token; see `scheduleRerender`. */
    private rerenderTimer: number | null = null;
    private lastSteps: WorkflowStep[] = [];
    private lastConnections: WorkflowConnection[] = [];
    private lastContext: WorkflowRuntimeContext | null = null;
    /** Container for memory section grouping */
    private memorySectionWrapper: HTMLDivElement | null = null;
    private customSettings: WorkflowStepCollectionSettingsModel | undefined;

    /**
     * The designer's credential mode (`Reference` unless the host chose `Inline`).
     *
     * @returns {'Reference' | 'Inline'} The mode.
     */
    private credentialMode(): 'Reference' | 'Inline' {
        try {
            const provider: (() => 'Reference' | 'Inline') | undefined = this.serviceLocator
                ? this.serviceLocator.getService<() => 'Reference' | 'Inline'>('credentialMode')
                : undefined;
            return typeof provider === 'function' && provider() === 'Inline' ? 'Inline' : 'Reference';
        } catch {
            return 'Reference';
        }
    }

    /**
     * Resolves a caption in the current locale with an English fallback.
     *
     * @param {string} key - The locale key.
     * @param {string} fallback - Text used when the key isn't localized.
     * @returns {string} The caption.
     */
    private caption(key: string, fallback: string): string {
        const value: string = this.l10n ? this.l10n.getConstant(key) : '';
        return value || LocaleContext.text(key, fallback);
    }

    /**
     * Returns the AI memory scope registered by the designer.
     *
     * @returns {string} The scope, or '' when none is registered.
     */
    private memoryScope(): string {
        try {
            const provider: (() => string) | undefined = this.serviceLocator
                ? this.serviceLocator.getService<() => string>('workflowScope')
                : undefined;
            return typeof provider === 'function' ? provider() : '';
        } catch {
            return '';
        }
    }

    /**
     * Creates the instance.
     *
     * @param {HTMLElement} host The host.
     * @param {WorkflowPropertyPanelSettingsModel} settings The settings.
     * @param {Function} onChange The on change.
     * @param {Function} onCommit The on commit.
     * @param {L10n} [l10n] - Optional localization instance for caption
     *   resolution. When provided, every visible field caption (and the
     *   matching `aria-label`) reads through `l10n.getConstant(key)`.
     *   Optional for legacy / unit-test call sites.
     * @param {ServiceLocator} [serviceLocator] - Optional shared service
     *   locator forwarded to the structured editors so they can resolve
     *   the live L10n through `getService('localization')` on every `t()`
     *   call. Optional for legacy / unit-test call sites.
     * @returns {void} Nothing.
     * @private
     */
    public constructor(
        host: HTMLElement,
        settings: WorkflowPropertyPanelSettingsModel,
        onChange: (id: string, changes: Record<string, unknown>) => void,
        onCommit?: (stepId: string) => void,
        l10n?: L10n,
        serviceLocator?: ServiceLocator
    ) {
        this.host = host;
        this.settings = settings;
        this.onChange = (id: string, changes: Record<string, unknown>): void => {
            this.pendingCommitId = id;
            onChange(id, changes);
        };
        this.onCommit = onCommit ? (stepId: string): void => {
            this.pendingCommitId = '';
            onCommit(stepId);
        } : undefined;
        this.l10n = l10n;
        this.serviceLocator = serviceLocator;
        // Each structured editor now resolves its L10n through the shared
        // ServiceLocator on every `t()` lookup, so the host only needs to
        // push the locator once. The L10n argument is kept as a defensive
        // fallback for callers that render the editors without a locator.
        const locator: ServiceLocator | undefined = this.serviceLocator;
        StepEditorRegistry.setLocale(l10n);
        FormFieldsEditor.setLocale(l10n, locator);
        ReviewersEditor.setLocale(l10n, locator);
        RequestFieldsEditor.setLocale(l10n, locator);
        ConditionRulesEditor.setLocale(l10n, locator);
        SwitchBranchesEditor.setLocale(l10n, locator);
        VariablesEditor.setLocale(l10n, locator);
        // Simulation dialogs resolve their chrome through the same
        // ServiceLocator, so the host pushes the mirror once at construction
        // and `setLocale()` flips every live instance on the next show.
        FormInputDialog.setLocale(l10n, locator);
        ApprovalDialog.setLocale(l10n, locator);
    }

    /**
     * Sets the step collection settings that supply the custom step definitions.
     *
     * @param {WorkflowStepCollectionSettingsModel} settings The step collection settings.
     * @returns {void} Nothing.
     * @private
     */
    public setCustomStepSettings(settings?: WorkflowStepCollectionSettingsModel): void {
        this.customSettings = settings;
    }

    /**
     * Updates the shared localization instance for caption resolution, the
     * workspace title (`Properties`), the empty-state hint, the expand / collapse
     * button titles, and every step-type field caption currently in view.
     * `EmptyCanvasAdd`, `TopToolbar`, `SimulationLog`, etc. all have their
     * own `setLocale(l10n)` mirrors.
     *
     * @param {L10n} l10n - The shared localization instance.
     * @returns {void} Nothing.
     * @private
     */
    public setLocale(l10n: L10n): void {
        this.l10n = l10n;
        // Each editor reads the live L10n from the shared ServiceLocator on
        // every `t()` call, so a single re-registration here flips every
        // currently-mounted editor without per-editor rewiring.
        const locator: ServiceLocator | undefined = this.serviceLocator;
        StepEditorRegistry.setLocale(l10n);
        FormFieldsEditor.setLocale(l10n, locator);
        ReviewersEditor.setLocale(l10n, locator);
        RequestFieldsEditor.setLocale(l10n, locator);
        ConditionRulesEditor.setLocale(l10n, locator);
        SwitchBranchesEditor.setLocale(l10n, locator);
        VariablesEditor.setLocale(l10n, locator);
        FormInputDialog.setLocale(l10n, locator);
        ApprovalDialog.setLocale(l10n, locator);
        if (!this.root || !this.current || !this.isStep(this.current) || !this.current.id) {
            return;
        }
        // Re-render the open step so every visible caption picks up the new
        // translation. `render()` walks the full field list and rebuilds
        // structured-editor sub-trees with the resolved labels.
        this.render(this.current, this.lastSteps, this.lastConnections, this.lastContext);
    }

    /**
     * Create.
     *
     * @param {HTMLElement} workspaceRoot The workspace root.
     * @returns {void} Nothing.
     * @private
     */
    public create(workspaceRoot: HTMLElement): void {
        this.root = document.createElement('div');
        this.root.id = (workspaceRoot.id || 'e-workflow-designer') + '_property_section';
        this.root.className = 'e-wf-property-section';
        this.root.setAttribute('role', 'region');
        this.root.setAttribute('aria-label', this.caption('propPropertiesTitle', 'Properties'));
        const header: HTMLDivElement = document.createElement('div');
        header.className = 'e-wf-property-section-header';
        const titleWrap: HTMLSpanElement = document.createElement('span');
        titleWrap.className = 'e-wf-property-section-title';
        const titleText: HTMLSpanElement = document.createElement('span');
        titleText.textContent = this.l10n ? (this.l10n.getConstant('propPropertiesTitle') || 'Properties') : 'Properties';
        titleWrap.appendChild(titleText);
        header.appendChild(titleWrap);
        this.body = document.createElement('div');
        this.body.className = 'e-wf-property-section-body';
        this.root.appendChild(header);
        this.root.appendChild(this.body);
        // Property Section width is responsive — sized by the host layout,
        // not from settings.width (removed).
        this.host.appendChild(this.root);
        this.expandButton = document.createElement('button');
        this.expandButton.setAttribute('aria-controls', this.root.id);
        this.expandButton.setAttribute('aria-expanded', 'false');

        this.host.appendChild(this.expandButton);

        // Instantiated after the element is attached: an EJ2 component
        // initialised while detached measures zero and renders without
        // layout-dependent chrome.
        this.expandButtonComponent = new Button({
            cssClass: 'e-wf-property-section-expand e-flat',
            iconCss: 'e-icons e-chevron-left'
        });
        this.expandButtonComponent.appendTo(this.expandButton);
        this.expandButton.addEventListener('click', () => this.toggle());

        // One tooltip serves every help trigger in the panel. Per-trigger
        // instances would mean up to a dozen components rebuilt on every
        // selection change; a target-scoped tooltip is created once and
        // re-scanned after each render.
        this.helpTooltip = new Tooltip({
            target: '.e-wf-property-help-target',
            opensOn: 'Hover Focus',
            openDelay: 120,
            closeDelay: 120,
            position: 'BottomLeft',
            windowCollision: true,
            showTipPointer: false,
            beforeRender: (args: { target?: HTMLElement }) => {
                const target: (HTMLElement & { wfHelpContent?: HTMLDivElement }) | undefined =
                    args && args.target
                        ? args.target as HTMLElement & { wfHelpContent?: HTMLDivElement }
                        : undefined;
                if (this.helpTooltip && target && target.wfHelpContent) {
                    this.helpTooltip.content = target.wfHelpContent;
                    this.helpTooltip.dataBind();
                }
            }
        });
        this.helpTooltip.appendTo(this.root);

        this.hide();
    }

    /**
     * Bind.
     *
     * @param {PropertySelection} item The item.
     * @param {WorkflowStep} steps The steps.
     * @param {WorkflowConnection} connections The connections.
     * @param {WorkflowRuntimeContext} context The context.
     * @param {boolean} openPanel The open panel.
     * @returns {void} Nothing.
     * @private
     */
    public bind(
        item: PropertySelection,
        steps: WorkflowStep[],
        connections: WorkflowConnection[],
        context: WorkflowRuntimeContext,
        openPanel: boolean = true
    ): void {
        this.current = item;
        this.lastSteps = steps || [];
        this.lastConnections = connections || [];
        this.lastContext = context;
        this.closeContextPopup();
        this.closeHelpPopup();
        if (!item || this.isSticky(item)) {
            this.hide();
            return;
        }
        if (openPanel && (this.isStep(item) || this.isConnection(item))) {
            this.show();
        }
        if (this.open) {
            this.render(item, steps, connections, context);
        }
    }

    /**
     * Show.
     *
     * @returns {void} Nothing.
     * @private
     */
    public show(): void {
        if (this.settings.visible === false) {
            return;
        }

        this.open = true;

        if (this.root) {
            this.root.style.display = '';
        }

        this.host.removeAttribute('aria-hidden');
        this.host.classList.add('e-wf-property-panel-open');

        this.updateToggleButton();
    }

    /**
     * Hide.
     *
     * @returns {void} Nothing.
     * @private
     */
    public hide(): void {
        this.open = false;
        this.closeContextPopup();
        this.closeHelpPopup();
        // Close the variable picker too, so it does not float over the canvas.
        if (this.variablePicker && this.variablePicker.isOpen()) {
            this.variablePicker.close();
        }
        // Finish an edit in progress: closing the panel does not always blur the field, so commit it
        // here or the host would never get workflowChanged for it.
        if (this.pendingCommitId && this.onCommit) {
            this.onCommit(this.pendingCommitId);
        }

        if (this.root) {
            this.root.style.display = 'none';
        }

        this.host.setAttribute('aria-hidden', 'true');
        this.host.classList.remove('e-wf-property-panel-open');

        this.updateToggleButton();
    }

    /**
     * The id of the currently bound step (or empty string when binding is to a connection/note).
     *
     * @returns {string} The current step id, or '' when no step is bound.
     */
    private currentStepId(): string {
        if (this.current && this.isStep(this.current)) {
            return (this.current as WorkflowStep).id || '';
        }
        return '';
    }

    /**
     * Disables the property-section expand control while the canvas is locked.
     *
     * @param {boolean} readOnly Whether the canvas is locked.
     * @returns {void}
     * @private
     */
    public setReadOnly(readOnly: boolean): void {
        if (this.expandButtonComponent) {
            this.expandButtonComponent.disabled = readOnly;
            this.expandButtonComponent.dataBind();
        }
        if (this.expandButton) {
            this.expandButton.setAttribute('aria-disabled', String(readOnly));
        }
    }

    private toggle(): void {
        if (this.open) {
            this.hide();
            return;
        }

        this.show();

        if (!this.current || this.isSticky(this.current)) {
            this.renderEmpty();
            return;
        }

        this.render(
            this.current,
            this.lastSteps,
            this.lastConnections,
            this.lastContext || {
                input: {
                    response: {}
                },
                nodes: {},
                variables: {}
            }
        );
    }

    private updateToggleButton(): void {
        if (
            !this.expandButton ||
            !this.expandButtonComponent
        ) {
            return;
        }

        // The panel can never open while `visible` is false, so its expand button is hidden too.
        this.expandButton.style.display = this.settings.visible === false ? 'none' : '';

        const iconClass: string = this.open
            ? 'e-chevron-right'
            : 'e-chevron-left';

        this.expandButtonComponent.iconCss =
            'e-icons ' + iconClass;
        this.expandButtonComponent.dataBind();

        const actionKey: string = this.open
            ? 'propCollapseTitle'
            : 'propExpandTitle';
        const action: string = this.l10n
            ? (this.l10n.getConstant(actionKey) || (this.open ? 'Collapse properties' : 'Expand properties'))
            : (this.open ? 'Collapse properties' : 'Expand properties');
        this.expandButtonComponent.content = this.open
            ? ''
            : (this.l10n ? (this.l10n.getConstant('propExpandLabel') || 'Expand') : 'Expand');
        this.expandButtonComponent.dataBind();
        // The pure form `Expand property section` / `Collapse property section`
        // previously used for `aria-label` is dropped per the shared-key rule:
        // its only purpose was the assistive label, with no visible counterpart.
        // We instead reuse the visible `title` as the `aria-label`.
        this.expandButton.setAttribute(
            'aria-label',
            action
        );

        this.expandButton.setAttribute(
            'aria-expanded',
            String(this.open)
        );

        this.expandButton.setAttribute(
            'title',
            action
        );

        this.expandButton.classList.toggle(
            'e-wf-property-section-expand-open',
            this.open
        );
    }
    /**
     * Destroy.
     *
     * @returns {void} Nothing.
     * @private
     */
    public destroy(): void {
        this.cancelRerender();
        this.closeContextPopup();
        this.closeHelpPopup();
        this.destroyFieldInstances();
        if (this.helpTooltip) {
            this.helpTooltip.destroy();
            this.helpTooltip = null;
        }
        if (this.expandButtonComponent) {
            this.expandButtonComponent.destroy();
            this.expandButtonComponent = null;
        }
        if (this.variablePicker) {
            this.variablePicker.close();
            this.variablePicker = null;
        }

        if (this.onCommit && this.current && this.isStep(this.current)) {
            // Emit a final commit so the host sees the latest applied state
            // before tear-down. Connections and sticky notes do not raise
            // property-change events.
            this.onCommit((this.current as WorkflowStep).id);
        }

        if (this.root) {
            this.root.remove();
        }

        if (this.expandButton) {
            this.expandButton.remove();
        }

        this.root = null;
        this.body = null;
        this.expandButton = null;
    }

    /**
     * Registers an EJ2 component for disposal on the next render.
     *
     * @param {Object} instance The component to track.
     * @returns {Object} The same instance, for call-site chaining.
     * @typeparam T The component type.
     */
    private track<T extends Disposable>(instance: T): T {
        this.fieldInstances.push(instance);
        return instance;
    }

    /**
     * Destroys every EJ2 component created for the current field set.
     *
     * Must run before `body.innerHTML` is cleared: removing the DOM without
     * destroying the components would orphan their popups and their
     * document-level listeners.
     *
     * @returns {void}
     */
    private destroyFieldInstances(): void {
        const instances: Disposable[] = this.fieldInstances;
        this.fieldInstances = [];
        instances.forEach((instance: Disposable) => {
            try {
                instance.destroy();
            } catch (error) {
                // A component whose host element was already removed throws
                // on destroy; the instance is discarded either way.
            }
        });
        // Structured list editors mount their own components inside the
        // panel body and have no registry of their own. Sweep the subtree
        // so those are disposed too before `innerHTML` is cleared.
        EditorComponents.destroyWithin(this.body);
        this.activeInput = null;
    }

    /**
     * Queues a full re-render outside the current event.
     *
     * A dropdown change re-renders the whole panel, which destroys the very
     * component whose handler is still on the stack. Deferring by one task
     * lets that handler unwind before its component is disposed.
     *
     * @param {WorkflowStep} item The step to re-render.
     * @param {WorkflowRuntimeContext} context The runtime context to render with.
     * @returns {void}
     */
    private scheduleRerender(item: WorkflowStep, context: WorkflowRuntimeContext): void {
        this.cancelRerender();
        this.rerenderTimer = window.setTimeout(() => {
            this.rerenderTimer = null;
            if (this.current && this.isStep(this.current) && this.current.id === item.id) {
                this.render(this.current, this.lastSteps, this.lastConnections, this.lastContext || context);
            }
        }, 0);
    }

    /**
     * Cancels a queued re-render.
     *
     * @returns {void}
     */
    private cancelRerender(): void {
        if (this.rerenderTimer !== null) {
            window.clearTimeout(this.rerenderTimer);
            this.rerenderTimer = null;
        }
    }

    /**
     * Refreshes the shared help tooltip so triggers created by the current
     * render are picked up by its target selector.
     *
     * @returns {void}
     */
    private refreshHelpTargets(): void {
        if (this.helpTooltip) {
            this.helpTooltip.refresh();
        }
    }

    private render(
        item: WorkflowStep | WorkflowConnection,
        steps: WorkflowStep[],
        connections: WorkflowConnection[],
        context: WorkflowRuntimeContext
    ): void {
        if (!this.body) {
            return;
        }
        this.cancelRerender();
        this.closeHelpPopup();
        this.destroyFieldInstances();
        this.body.innerHTML = '';
        this.memorySectionWrapper = null;
        if (this.isConnection(item)) {
            this.renderConnection(item);
            this.refreshHelpTargets();
            return;
        }
        const stepType: string = String(item.stepType || '');
        this.renderStepType(stepType);
        this.addText(StepEditorRegistry.resolveCaption('propStepName'), String(item.name || ''), (value: string) => {
            this.onChange(item.id || '', { name: value });
            if (this.onCommit) {
                this.onCommit(item.id || '');
            }
        }, false);
        const rawProps: Record<string, unknown> = (item.props && typeof item.props === 'object')
            ? item.props as Record<string, unknown>
            : {};
        if (item.stepType === 'Custom') {
            this.renderCustomStep(item, rawProps);
            this.refreshHelpTargets();
            return;
        }
        // Hydrate missing dropdown/default keys so older empty steps and new types bind in the UI.
        const hydrated: { props: Record<string, unknown>; changed: boolean } =
            StepEditorRegistry.applyMissingDefaults(item.stepType, rawProps);
        const props: Record<string, unknown> = hydrated.props;
        if (hydrated.changed) {
            this.onChange(item.id || '', { props: props });
            if (this.current && this.isStep(this.current) && this.current.id === item.id) {
                this.current = Object.assign({}, this.current, { props: props });
            }
        }
        // Filter fields by current prop values (e.g. scheduleType Once hides cron/interval).
        StepEditorRegistry.get(item.stepType, props).fields.filter(
            (field: EditorField) => !field.credentialMode || field.credentialMode === this.credentialMode()
        ).forEach((field: EditorField) => {
            this.addField(field, props[field.key], (value: unknown) => {
                const next: Record<string, unknown> = {};
                Object.keys(props).forEach((key: string) => { next[`${key}`] = props[`${key}`]; });

                // Normalize webhook path for WebhookTrigger steps
                if (item.stepType === 'WebhookTrigger' && field.key === 'path' && typeof value === 'string') {
                    next[`${field.key}`] = normalizeWebhookPath(value);
                } else {
                    next[`${field.key}`] = value;
                }

                // When a parent select changes, fill newly visible dependent defaults (first option, etc.).
                const filled: { props: Record<string, unknown>; changed: boolean } =
                    StepEditorRegistry.applyMissingDefaults(item.stepType, next);
                const boundProps: Record<string, unknown> = filled.props;
                // Keep local props bag in sync so subsequent field edits see latest values
                // without forcing a full panel rebuild (which steals textbox focus).
                Object.keys(boundProps).forEach((key: string) => { props[`${key}`] = boundProps[`${key}`]; });
                Object.keys(props).forEach((key: string) => {
                    if (!Object.prototype.hasOwnProperty.call(boundProps, key)) {
                        delete props[`${key}`];
                    }
                });
                this.onChange(item.id || '', { props: boundProps });
                if (this.current && this.isStep(this.current) && this.current.id === item.id) {
                    this.current = Object.assign({}, this.current, { props: boundProps });
                }
                // Fire the commit synchronously so the host sees one
                // workflowChanged event per completed field edit
                // (textbox blur / dropdown change / picker close).
                if (this.onCommit) {
                    this.onCommit(item.id || '');
                }
                // Only re-render when visibility/defaults of other fields may change.
                // Structured list editors (form fields, conditions, switch) manage their
                // own DOM — rebuilding the whole panel on each keystroke loses focus.
                const skipFullRerender: boolean =
                    field.type === 'formFields'
                    || field.type === 'conditionRules'
                    || field.type === 'switchBranches'
                    || field.type === 'setVariables'
                    || field.type === 'reviewers'
                    || field.type === 'requestFields'
                    || field.type === 'responseFields'
                    || field.type === 'queryParameters'
                    || field.type === 'textarea'
                    || field.type === 'json'
                    || field.type === 'text'
                    || field.type === 'datetime'
                    || field.type === 'number'
                    || field.type === 'checkbox'
                    || field.type === 'credentialReference'
                    || field.type === 'credentialLink';
                // A new time zone changes how the date fields read, so rebuild them (the edit is already committed).
                if ((!skipFullRerender || field.key === 'timeZone') && this.current && this.isStep(this.current) && this.current.id === item.id) {
                    // Deferred by one task so a select's DropDownList isn't destroyed
                    // while its own change handler is still running.
                    this.scheduleRerender(item, context);
                }
            });
        });
        this.refreshHelpTargets();
    }

    /**
     * Renders a Custom step: the fields of its definition, or a read-only view when the definition
     * is unavailable (including steps saved before custom definitions existed).
     *
     * @param {WorkflowStep} item The selected step.
     * @param {Record<string, unknown>} rawProps The step values.
     * @returns {void}
     */
    private renderCustomStep(item: WorkflowStep, rawProps: Record<string, unknown>): void {
        if (!this.body) {
            return;
        }
        const definition: WorkflowCustomStepDefinitionModel | undefined =
            CustomStepResolver.find(this.customSettings, item.customStepId);
        if (!definition) {
            const message: string = this.l10n ? this.l10n.getConstant('customStepUnavailable') : '';
            CustomStepEditor.renderUnavailable(this.body, message, rawProps);
            return;
        }
        // Only missing values come from the definition; values saved on the step are never replaced.
        const values: Record<string, unknown> = CustomStepResolver.resolveValues(definition, rawProps);
        CustomStepEditor.render(
            this.body, CustomStepResolver.getFields(definition), values,
            <T extends Disposable>(instance: T): T => this.track(instance),
            (key: string, value: unknown) => {
                const next: Record<string, unknown> = Object.assign({}, values);
                if (value === undefined) {
                    delete next[`${key}`];
                } else {
                    next[`${key}`] = value;
                }
                values[`${key}`] = value;
                this.onChange(item.id || '', { props: next });
                if (this.current && this.isStep(this.current) && this.current.id === item.id) {
                    this.current = Object.assign({}, this.current, { props: next });
                }
                if (this.onCommit) {
                    this.onCommit(item.id || '');
                }
            }
        );
    }

    private renderConnection(item: WorkflowConnection): void {
        // Connection captions (`Label`, `Type`) flow through L10n via the
        // shared registry helper. The connection-type option values
        // (`Straight` / `Orthogonal` / `Bezier`) remain English by design
        // — they are persisted into the exported workflow JSON and
        // matched verbatim by the dispatcher.
        this.addText(StepEditorRegistry.resolveCaption('propConnectionLabel'), String(item.label || ''), (value: string) => {
            this.onChange(item.id || '', { label: value });
            if (this.onCommit) {
                this.onCommit(item.id || '');
            }
        }, false);
        this.addSelect(
            StepEditorRegistry.resolveCaption('propConnectionType'),
            String(item.type || 'Orthogonal'),
            ['Straight', 'Orthogonal', 'Bezier'],
            (value: string) => {
                this.onChange(item.id || '', { type: value });
                if (this.onCommit) {
                    this.onCommit(item.id || '');
                }
            }
        );
    }

    private openContextPopup(anchor: HTMLElement, itemField: boolean = false): void {
        this.closeHelpPopup();
        this.closeContextPopup();
        // enableDefaultBinding removed: default two-way binding for ${...} expressions
        // is always off in this iteration. Hosts that want expression support
        // wire the same call-sites themselves.
        if (!this.isStep(this.current)) {
            return;
        }
        const context: WorkflowRuntimeContext = this.lastContext || { input: { response: {} }, nodes: {}, variables: {} };
        const groups: WorkflowSuggestionGroup[] = itemField
            ? SuggestionBuilder.buildItemFieldSuggestions(
                this.current.props && typeof this.current.props === 'object'
                    ? String((this.current.props as Record<string, unknown>).itemsPath || '')
                    : '',
                context
            )
            : SuggestionBuilder.build(this.current, this.lastSteps, this.lastConnections, context);
        // Use the revamped tree-based popup. The popup is a self-contained
        // singleton; we re-open it for every click so the latest context is
        // shown without leaking listeners.
        if (!this.variablePicker) {
            this.variablePicker = new VariablePickerPopup();
        }
        this.variablePicker.open({
            anchor: anchor,
            groups: groups,
            onPick: (expression: string, _label: string) => {
                this.insertExpression(expression);
            },
            title: itemField
                ? this.localize('pickArrayItemField', 'Pick array item field')
                : this.localize('insertVariable', 'Insert variable')
        });
        // Track the popup root so legacy `contextPopup` consumers keep
        // working and so `closeContextPopup` can null it out cleanly.
        this.contextPopup = this.variablePicker.getRoot();
    }

    private closeContextPopup(): void {
        if (this.contextOutsideHandler) {
            document.removeEventListener('mousedown', this.contextOutsideHandler);
            this.contextOutsideHandler = null;
        }
        if (this.contextKeyHandler) {
            document.removeEventListener('keydown', this.contextKeyHandler);
            this.contextKeyHandler = null;
        }
        if (this.variablePicker) {
            this.variablePicker.close();
        }
        if (this.contextPopup) {
            this.contextPopup = null;
        }
    }

    /**
     * Builds the tooltip body for a help trigger from text nodes (see `renderHelpContent`).
     *
     * @param {string} text The help body: a locale key or text in help markup.
     * @param {string} title The help heading.
     * @returns {HTMLDivElement} The tooltip content element.
     */
    private buildHelpContent(text: string, title: string): HTMLDivElement {
        // `text` is a locale key (or literal text). A key may have a matching `<key>Title` heading.
        const headingKey: string = text + 'Title';
        const heading: string = StepEditorRegistry.resolveCaption(headingKey);
        const content: HTMLDivElement = renderHelpContent(
            heading !== headingKey ? heading : StepEditorRegistry.resolveCaption(title),
            StepEditorRegistry.resolveCaption(text)
        );
        inheritTooltipContentColor(content);
        return content;
    }

    /**
     * Marks an element as a help trigger for the shared tooltip and stores
     * its content. Escape-to-dismiss, the hover grace period and viewport
     * collision handling are all provided by the Tooltip component.
     *
     * @param {HTMLElement} trigger The trigger element.
     * @param {string} text The help body text.
     * @param {string} title The help heading.
     * @returns {void}
     */
    private bindHelpTarget(trigger: HTMLElement, text: string, title: string): void {
        trigger.classList.add('e-wf-property-help-target');
        const label: string = StepEditorRegistry.resolveCaption(title);
        trigger.setAttribute('aria-label', label);
        // Tooltip reads `data-content` / `title` from the target; the rich
        // body is supplied through `beforeRender` on the shared instance.
        trigger.setAttribute('data-wf-help-title', label);
        (trigger as HTMLElement & { wfHelpContent?: HTMLDivElement }).wfHelpContent =
            this.buildHelpContent(text, title);
    }



    private closeHelpPopup(): void {
        if (this.helpTooltip) {
            this.helpTooltip.close();
        }
    }

    private createHelpButton(helpText: string, helpTitle: string = 'Field help'): HTMLButtonElement {
        const button: HTMLButtonElement = document.createElement('button');
        button.className = 'e-wf-property-help-trigger';
        button.addEventListener('mousedown', (event: MouseEvent) => {
            event.preventDefault();
        });
        this.track(new Button({
            cssClass: 'e-wf-property-help-trigger e-flat',
            iconCss: 'e-icons e-circle-info'
        })).appendTo(button);
        this.bindHelpTarget(button, helpText, helpTitle);
        return button;
    }

    private insertExpression(expression: string): void {
        if (!this.activeInput) {
            return;
        }
        const target: ExpressionTarget = this.activeInput;
        const el: HTMLInputElement | HTMLTextAreaElement | null = ExpressionTargets.element(target);
        if (!el) {
            return;
        }
        const start: number = typeof el.selectionStart === 'number' ? el.selectionStart : el.value.length;
        const end: number = typeof el.selectionEnd === 'number' ? el.selectionEnd : el.value.length;
        const current: string = el.value || '';
        const insert: string = '{{' + expression + '}}';
        // Written through the helper so a TextBox instance does not go stale
        // behind its own input element.
        ExpressionTargets.setValue(target, current.slice(0, start) + insert + current.slice(end));
        const caret: number = start + insert.length;
        try {
            el.setSelectionRange(caret, caret);
        } catch (error) {
            // Some input types reject selection range.
        }
        el.dispatchEvent(new Event('change'));
        el.focus();
    }

    private addText(
        label: string,
        value: string,
        onChange: (value: string) => void,
        expressionCapable: boolean,
        helpText?: string,
        itemField: boolean = false,
        helpIcon: boolean = false
    ): void {
        const wrap: HTMLLabelElement = this.label(label);
        // When `helpIcon` is true, surface the popup as a `?` button next to
        // the field label instead of an `i` button next to the input row.
        // This is the cleaner affordance used by the cron field and any
        // other long-form help that benefits from a labelled trigger.
        if (helpText && helpIcon) {
            const helpTitle: string = /cron/i.test(label) ? 'Cron expression help' : 'Field help';
            const labelCaption: HTMLElement | null = wrap.querySelector('.e-wf-property-label');
            if (labelCaption) {
                labelCaption.appendChild(this.createQuestionMarkButton(helpText, helpTitle));
            }
        }
        const row: HTMLDivElement = document.createElement('div');
        const hasSideControl: boolean = !!(expressionCapable) || (!!helpText && !helpIcon);
        row.className = hasSideControl ? 'e-wf-property-input-row e-wf-property-input-row-expression' : 'e-wf-property-input-row';
        const input: HTMLInputElement = document.createElement('input');
        input.type = 'text';
        row.appendChild(input);
        wrap.appendChild(row);
        // Attached to the live panel before instantiation: an EJ2 component
        // initialised while detached measures zero.
        this.body!.appendChild(wrap);

        const textBox: TextBox = this.track(new TextBox({
            value: value,
            cssClass: 'e-wf-property-input'
        }));
        textBox.appendTo(input);
        textBox.element.setAttribute('aria-label', label);
        // Native listeners on the inner input preserve caret handling, the
        // change-on-blur contract and the synthetic `change` event that
        // `insertExpression` dispatches.
        textBox.element.addEventListener('focus', () => { this.activeInput = textBox; });
        textBox.element.addEventListener('change', () => onChange(textBox.element.value));

        if (expressionCapable) {
            row.appendChild(this.createContextButton(textBox, itemField));
        }
        if (helpText && !helpIcon) {
            const helpTitle: string = /cron/i.test(label) ? 'Cron expression help' : 'Field help';
            row.appendChild(this.createHelpButton(helpText, helpTitle));
        }
        if (expressionCapable) {
            // Live resolved-value preview: shows what the expression will
            // produce at simulation time, not the raw `{{$.path}}` token.
            wrap.appendChild(this.createExpressionPreview(textBox));
        }
    }

    /**
     * Builds a compact `?` shadow button that reuses the existing
     * field-help popup wiring (hover/focus open, throttle-by-timer,
     * escape-to-dismiss). Keeps the trigger visually closer to the
     * label than the input row.
     *
     * @param {string} helpText The help body text shown in the popup.
     * @param {string} helpTitle The help popup heading (used as aria-label).
     * @returns {HTMLButtonElement} The configured trigger button.
     */
    private createQuestionMarkButton(helpText: string, helpTitle: string): HTMLButtonElement {
        const button: HTMLButtonElement = document.createElement('button');
        // Bare-icon trigger (no 34×34 chrome) sharing the tooltip wiring with
        // the `i` button used inline next to input rows.
        button.className = 'e-wf-property-help-trigger-icon';
        button.addEventListener('mousedown', (event: MouseEvent) => {
            event.preventDefault();
        });
        this.track(new Button({
            // `e-circle-info` is shipped in the EJ2 material icon font we use
            // across the demos; it matches the inline trigger style so the
            // two read consistently.
            cssClass: 'e-wf-property-help-trigger-icon e-flat',
            iconCss: 'e-icons e-circle-info'
        })).appendTo(button);
        this.bindHelpTarget(button, helpText, helpTitle);
        return button;
    }

    /**
     * The time zone of the bound step's dates: its `timeZone` prop, else UTC.
     *
     * @returns {string} The IANA time zone.
     */
    private scheduleTimeZone(): string {
        const props: Record<string, unknown> = this.current && this.isStep(this.current)
            ? ((this.current as WorkflowStep).props || {}) as Record<string, unknown> : {};
        return ScheduleEvaluator.zone({ timeZone: props.timeZone });
    }

    /**
     * Renders a date and time field. The picker shows the wall-clock time in the schedule's time
     * zone, whatever zone the browser is in, and the value is stored without an offset
     * (`YYYY-MM-DDTHH:mm`) so it keeps meaning "this time in the schedule's zone". A stored value
     * with an offset is shown converted to that zone.
     *
     * @param {string} label - The field label.
     * @param {unknown} value - The stored value.
     * @param {Function} onChange - Receives the new value, or undefined when cleared.
     * @param {string} timeZone - The schedule's IANA time zone.
     * @returns {void}
     */
    private addDateTime(
        label: string,
        value: unknown,
        onChange: (value: string | undefined) => void,
        timeZone: string
    ): void {
        const caption: string = label + ' (' + timeZone + ')';
        const wrap: HTMLLabelElement = this.label(caption);
        const input: HTMLInputElement = document.createElement('input');
        wrap.appendChild(input);
        this.body!.appendChild(wrap);

        const wall: string = ScheduleEvaluator.toWallTime(value, timeZone);
        const picker: DateTimePicker = this.track(new DateTimePicker({
            cssClass: 'e-wf-property-input',
            // The picker works in the browser's zone, so the wall-clock fields are carried over as
            // they are: 09:00 in the schedule's zone is shown, and read back, as 09:00.
            value: wall ? PropertyPanel.wallTimeToPickerDate(wall) : null,
            change: () => {
                const current: Date | null = picker.value;
                onChange(current ? PropertyPanel.pickerDateToWallTime(current) : undefined);
            }
        }));
        picker.appendTo(input);
        picker.element.setAttribute('aria-label', caption);
    }

    /**
     * Builds a picker `Date` whose local fields equal a `YYYY-MM-DDTHH:mm` wall-clock time.
     *
     * @param {string} wall - The wall-clock time.
     * @returns {Date} The picker value.
     */
    private static wallTimeToPickerDate(wall: string): Date {
        const parts: number[] = (wall.match(/\d+/g) || []).map(Number);
        return new Date(parts[0], parts[1] - 1, parts[2], parts[3] || 0, parts[4] || 0, 0, 0);
    }

    /**
     * Reads a picker `Date`'s local fields as a `YYYY-MM-DDTHH:mm` wall-clock time.
     *
     * @param {Date} date - The picker value.
     * @returns {string} The wall-clock time.
     */
    private static pickerDateToWallTime(date: Date): string {
        const pad2: (n: number) => string = (n: number): string => (n < 10 ? '0' : '') + String(n);
        return date.getFullYear() + '-' + pad2(date.getMonth() + 1) + '-' + pad2(date.getDate())
            + 'T' + pad2(date.getHours()) + ':' + pad2(date.getMinutes());
    }

    private addSelect(label: string, value: string, options: string[], onChange: (value: string) => void): void {
        const wrap: HTMLLabelElement = this.label(label);
        const input: HTMLInputElement = document.createElement('input');
        input.type = 'text';
        wrap.appendChild(input);
        this.body!.appendChild(wrap);

        const dropDown: DropDownList = this.track(new DropDownList({
            cssClass: 'e-wf-property-input',
            dataSource: options.slice(),
            value: value,
            change: (args: DropDownChangeEventArgs) => {
                // `itemData` is null when the component is cleared
                // programmatically; fall back to the raw value so the
                // previous `select.value` contract ('' when unset) holds.
                const next: unknown = args && args.value !== undefined ? args.value : '';
                onChange(next === null || next === undefined ? '' : String(next));
            }
        }));
        dropDown.appendTo(input);
        dropDown.element.setAttribute('aria-label', label);
    }

    /**
     * Renders the Inline-mode API key field as a link that opens a key entry
     * dialog. The key is stored on the step's `apiKey` property, which is never
     * exported, and is never shown in the DOM.
     *
     * @param {string} label - Field label.
     * @param {string} refValue - Current credential (or empty string).
     * @param {onChange} onChange - Callback receiving the new credential (or '' on clear / overwrite).
     * @param {string | undefined} helpText - Optional help text.
     * @returns {void}
     */
    private addCredentialLink(
        label: string,
        refValue: string,
        onChange: (newCredential: string | null) => void,
        helpText?: string
    ): void {
        const wrap: HTMLLabelElement = this.label(label);
        const row: HTMLDivElement = document.createElement('div');
        const hasSideControl: boolean = !!helpText;
        row.className = hasSideControl
            ? 'e-wf-property-input-row e-wf-property-input-row-expression'
            : 'e-wf-property-input-row';

        const link: HTMLButtonElement = document.createElement('button');
        link.className = 'e-wf-credential-link';
        this.track(new Button({ cssClass: '', isPrimary: true })).appendTo(link);

        // Resolve the live credential from the current step's props;
        // fall back to the snapshot captured at render time so a
        // not-yet-applied edit still renders something.
        const currentCredential: () => string = (): string => {
            return this.isStep(this.current) && this.current.props
                ? String((this.current.props as Record<string, unknown>).apiKey || '').trim()
                : refValue;
        };

        const renderLinkLabel: () => void = (): void => {
            link.textContent = '';
            const labelText: HTMLSpanElement = document.createElement('span');
            labelText.textContent = this.caption('credentialInlineSet', 'Set API key');
            link.appendChild(labelText);
        };
        renderLinkLabel();
        const refreshTitle: () => void = (): void => {
            const credential: string = currentCredential();
            link.title = credential.length === 0
                ? this.caption('credentialInlineStore', 'Click to store an API key for this step.')
                : this.caption('credentialInlineReplace', 'Click to replace the stored API key.');
        };
        refreshTitle();

        const onResolved: (newCredential: string | null) => void = (newCredential: string | null): void => {
            if (newCredential === null) {
                return;
            }
            renderLinkLabel();
            refreshTitle();
            refreshClearButton();
            onChange(newCredential);
        };
        const openDialog: (event: MouseEvent) => void = (event: MouseEvent): void => {
            event.preventDefault();
            event.stopPropagation();
            // The dialog shows whether a key is already stored.
            PropertyPanel.openCredentialDialog(currentCredential().length > 0, onResolved);
        };
        link.addEventListener('click', openDialog);
        row.appendChild(link);

        const clearButton: HTMLButtonElement = document.createElement('button');
        // Compact square icon button matching the Field Help trigger's
        // visual treatment (`.e-wf-property-help-trigger` chrome) so the
        // two side controls read consistently in the input row. The text
        // "Clear" label was replaced by an EJ2 delete glyph to keep the
        // row compact; the click handler still clears the credential.
        clearButton.className = 'e-wf-property-help-trigger e-wf-credential-link-clear';
        clearButton.setAttribute('aria-label', this.caption('credentialInlineClear', 'Clear API key'));
        clearButton.setAttribute('title', this.caption('credentialInlineClear', 'Clear API key'));
        this.track(new Button({
            cssClass: 'e-wf-property-help-trigger e-wf-credential-link-clear e-flat',
            // EJ2 ships the trash-can glyph as `e-trash` (used by the
            // canvas delete handles, simulation-log clear button and the
            // canvas toolbar). `e-delete` does not exist in the icon font
            // and would render as a blank box.
            iconCss: 'e-icons e-trash'
        })).appendTo(clearButton);
        clearButton.addEventListener('mousedown', (event: MouseEvent) => {
            // Prevent the surrounding label/row from swallowing the click.
            event.preventDefault();
        });
        clearButton.addEventListener('click', (event: MouseEvent) => {
            event.preventDefault();
            event.stopPropagation();
            onChange('');
            renderLinkLabel();
            refreshTitle();
            refreshClearButton();
        });
        const refreshClearButton: () => void = (): void => {
            const credential: string = currentCredential();
            clearButton.hidden = credential.length === 0;
        };
        refreshClearButton();
        row.appendChild(clearButton);

        // The Field Help button has been intentionally removed for the
        // Credential row. The "Set credential" dialog already explains the
        // storage model in its hint text, so a separate help icon next to
        // the row would be redundant. Callers that still pass a `helpText`
        // continue to be supported on other field types; here we just
        // skip rendering it.

        wrap.appendChild(row);
        this.body!.appendChild(wrap);
    }

    /**
     * Modal prompt for entering a raw API key. Submits the typed value back to
     * the caller via the `onResolved` callback, which stores it in the step's
     * `apiKey` property.
     *
     * The input is always empty when the dialog opens; we never
     * pre-populate it with raw key material. When the existing step
     * already carries a credential, a masked-dots pill is shown above
     * the input so the user can see that a key is set without exposing
     * the value.
     *
     * @param {boolean} existingSet - Whether the step currently carries a credential.
     * @param {onResolved} onResolved - Callback invoked once with the new credential / null.
     * @returns {void}
     */
    private static openCredentialDialog(
        existingSet: boolean,
        onResolved: (newCredential: string | null) => void
    ): void {
        // Mount the dialog at document.body so it overlays the entire
        // viewport and isn't clipped by the workflow-designer host's
        // overflow ancestors.
        const target: HTMLDivElement = document.createElement('div');
        document.body.appendChild(target);

        const content: HTMLDivElement = document.createElement('div');
        content.className = 'e-wf-credential-dialog-panel';

        const hint: HTMLParagraphElement = document.createElement('p');
        hint.className = 'e-wf-form-input-field-label';
        hint.textContent = LocaleContext.text('credentialInlineWarning');
        content.appendChild(hint);

        // When an entry is already set on the step, surface a masked
        // placeholder so the user can confirm what's stored without
        // making the input pre-populate with raw key material.
        if (existingSet) {
            const existingRow: HTMLDivElement = document.createElement('div');
            existingRow.className = 'e-wf-credential-dialog-current';
            const existingLabel: HTMLSpanElement = document.createElement('span');
            existingLabel.className = 'e-wf-credential-dialog-current-label';
            existingLabel.textContent = LocaleContext.text('credentialInlineCurrent');
            const existingValue: HTMLSpanElement = document.createElement('span');
            existingValue.className = 'e-wf-credential-dialog-current-value';
            existingValue.textContent = '••••••••••••';
            existingRow.appendChild(existingLabel);
            existingRow.appendChild(existingValue);
            content.appendChild(existingRow);
        }

        const inputLabel: HTMLSpanElement = document.createElement('span');
        inputLabel.className = 'e-wf-form-input-field-label';
        inputLabel.textContent = LocaleContext.text('credentialInlinePaste');
        content.appendChild(inputLabel);

        const input: HTMLInputElement = document.createElement('input');
        input.type = 'password';
        content.appendChild(input);

        let textBox: TextBox | null = null;
        let dialog: Dialog | null = null;
        let resolved: boolean = false;

        /**
         * Resolves the dialog exactly once. Escape, the overlay, Cancel and
         * Save all route through here, so `onResolved` can never fire twice.
         *
         * @param {string|null} result The credential, or null when cancelled.
         * @returns {void}
         */
        const finish: (result: string | null) => void = (result: string | null): void => {
            if (resolved) {
                return;
            }
            resolved = true;
            window.removeEventListener('keydown', onKey, true);
            // Deferred: `hide()` is reached from inside Dialog's own button
            // and overlay handlers, and destroying the component on that
            // stack tears down the element the handler is still using.
            window.setTimeout(() => {
                if (textBox) {
                    textBox.destroy();
                    textBox = null;
                }
                if (dialog) {
                    dialog.destroy();
                    dialog = null;
                }
                if (target.parentNode) {
                    target.parentNode.removeChild(target);
                }
            }, 0);
            if (dialog) {
                dialog.hide();
            }
            onResolved(result);
        };

        const submit: () => void = (): void => {
            const raw: string = textBox && textBox.element.value
                ? String(textBox.element.value).trim()
                : '';
            if (!raw) {
                finish(null);
                return;
            }
            // The caller stores the key in the step's `apiKey` property.
            finish(raw);
        };

        const onKey: (event: KeyboardEvent) => void = (event: KeyboardEvent): void => {
            if (event.key === 'Escape') {
                event.preventDefault();
                finish(null);
            } else if (event.key === 'Enter' && textBox && (event.target as HTMLElement) === textBox.element) {
                event.preventDefault();
                submit();
            }
        };

        dialog = new Dialog({
            header: 'Set credential',
            content: content,
            isModal: true,
            showCloseIcon: true,
            closeOnEscape: true,
            width: '420px',
            cssClass: 'e-wf-credential-dialog',
            buttons: [
                {
                    buttonModel: { content: LocaleContext.text('cancel') },
                    click: () => finish(null)
                },
                {
                    buttonModel: { content: LocaleContext.text('save'), isPrimary: true, disabled: true, cssClass: 'e-wf-dialog-primary' },
                    click: () => submit()
                }
            ],
            // Covers the close icon and the overlay, which do not route
            // through `buttons`.
            close: () => finish(null),
            open: () => {
                if (textBox) {
                    textBox.element.focus();
                }
            }
        });
        dialog.appendTo(target);

        textBox = new TextBox({
            cssClass: 'e-wf-dialog-input',
            placeholder: LocaleContext.text('credentialInlinePaste'),
            // Toggle Save disabled until the user actually types something.
            input: () => {
                const empty: boolean = !textBox || String(textBox.element.value || '').trim().length === 0;
                const saveButton: HTMLButtonElement | null = dialog && dialog.element
                    ? dialog.element.querySelector('.e-footer-content .e-primary')
                    : null;
                if (saveButton) {
                    saveButton.disabled = empty;
                }
            }
        });
        textBox.appendTo(input);
        textBox.element.setAttribute('aria-label', LocaleContext.text('credentialInlinePaste'));
        textBox.element.setAttribute('autocomplete', 'off');
        textBox.element.spellcheck = false;

        window.addEventListener('keydown', onKey, true);
    }

    private addField(field: EditorField, value: unknown, onChange: (value: unknown) => void): void {
        // Single resolution point: every render path below reads from the
        // resolved string instead of `field.label` so the visible caption
        // AND the matching `aria-label` (shared-key rule) stay in lockstep.
        const label: string = StepEditorRegistry.resolveLabel(field);
        if (field.type === 'checkbox') {
            // For memory checkbox, create a proper section matching condition-rules style
            if (field.key === 'memoryEnabled') {
                // Create the main field wrapper
                const fieldWrapper: HTMLLabelElement = document.createElement('label');
                fieldWrapper.className = 'e-wf-property-field';

                // Create the label/title INSIDE the wrapper
                const titleCaption: HTMLSpanElement = document.createElement('span');
                titleCaption.className = 'e-wf-property-label';
                titleCaption.textContent = StepEditorRegistry.resolveCaption('Conversation Memory');
                fieldWrapper.appendChild(titleCaption);

                // Create the list-editor (grey box) INSIDE the property-field
                const listEditor: HTMLDivElement = document.createElement('div');
                listEditor.className = 'e-wf-list-editor e-wf-condition-rules-editor';

                const list: HTMLDivElement = document.createElement('div');
                list.className = 'e-wf-list-editor-items';

                // Create the row with body (like condition rows)
                const row: HTMLDivElement = document.createElement('div');
                row.className = 'e-wf-list-editor-row e-wf-condition-rule-row';

                // Create body to hold checkbox and other fields
                const body: HTMLDivElement = document.createElement('div');
                body.className = 'e-wf-condition-rule-body';

                // Create the subfield for checkbox. Apply `flex-direction: row`
                // inline so the checkbox + label sit on a single line in the
                // memory section only. The base `e-wf-list-editor-subfield`
                // class is `flex-direction: column` (used by every other
                // list-editor subfield), so the inline override is the
                // narrowest possible change that does not affect other
                // call-sites or introduce a new CSS rule. The checkbox is
                // appended first, then the label, so the visual order is
                // [ ] Enable memory.
                const labelWrap: HTMLLabelElement = document.createElement('label');
                labelWrap.className = 'e-wf-list-editor-subfield';
                labelWrap.style.flexDirection = 'row';
                labelWrap.style.alignItems = 'center';
                labelWrap.style.gap = '8px';

                const input: HTMLInputElement = document.createElement('input');
                input.type = 'checkbox';

                const labelElem: HTMLSpanElement = document.createElement('span');
                labelElem.className = 'e-wf-list-editor-sublabel';
                labelElem.textContent = this.caption('propEnableMemory', 'Enable memory');

                labelWrap.appendChild(input);
                labelWrap.appendChild(labelElem);
                body.appendChild(labelWrap);
                row.appendChild(body);
                list.appendChild(row);
                listEditor.appendChild(list);
                fieldWrapper.appendChild(listEditor);
                this.body!.appendChild(fieldWrapper);

                const checkBox: CheckBox = this.track(new CheckBox({
                    cssClass: 'e-wf-property-input',
                    checked: Boolean(value),
                    change: (args: CheckBoxChangeEventArgs) => {
                        onChange(Boolean(args.checked));
                        // For memory fields, trigger immediate re-render to show/hide dependent fields
                        if (field.key === 'memoryEnabled' && this.current && this.isStep(this.current)) {
                            this.scheduleRerender(this.current, this.lastContext || {});
                        }
                    }
                }));
                checkBox.appendTo(input);

                // Store reference to body for adding sub-fields
                this.memorySectionWrapper = listEditor;
                (this.memorySectionWrapper as any).bodyElement = body;
            } else {
                // Standard checkbox rendering for other fields
                const wrap: HTMLLabelElement = this.label(label);
                const input: HTMLInputElement = document.createElement('input');
                input.type = 'checkbox';
                wrap.appendChild(input);
                this.body!.appendChild(wrap);
                const checkBox: CheckBox = this.track(new CheckBox({
                    cssClass: 'e-wf-property-input',
                    checked: Boolean(value),
                    change: (args: CheckBoxChangeEventArgs) => onChange(Boolean(args.checked))
                }));
                checkBox.appendTo(input);
            }
            return;
        }
        if (field.type === 'select') {
            this.addSelect(label, value === undefined || value === null ? '' : String(value), field.options || [], onChange);
            return;
        }
        if (field.type === 'credentialReference') {
            if (this.credentialMode() !== 'Reference') {
                return;
            }
            // A reference is a non-secret name, so it is a plain, visible text field.
            this.addText(
                this.caption('credentialReference', 'Credential reference'),
                value === undefined || value === null ? '' : String(value),
                (next: string) => onChange(next.trim()),
                false,
                this.caption('credentialReferenceHelp',
                             'The name of a credential your application resolves through the credentialRequested event. '
                    + 'It is saved with the workflow; the secret itself is not.')
            );
            return;
        }
        if (field.type === 'credentialLink') {
            if (this.credentialMode() !== 'Inline') {
                return;
            }
            const refValue: string = value === undefined || value === null ? '' : String(value);
            this.addCredentialLink(
                label,
                refValue,
                (newRef: string | null) => onChange(newRef === null ? '' : newRef),
                field.helpText
            );
            return;
        }
        if (field.type === 'formFields') {
            // Non-label wrapper: nested Add/Remove/inputs must not activate an outer <label>.
            const wrap: HTMLDivElement = this.fieldGroup(label);
            const host: HTMLDivElement = document.createElement('div');
            host.className = 'e-wf-property-list-host';
            FormFieldsEditor.render(
                host,
                Array.isArray(value) ? value as WorkflowInputFieldModel[] : [],
                (fields: WorkflowInputFieldModel[]) => onChange(fields),
                this.onCommit ? () => this.onCommit!(this.currentStepId()) : undefined
            );
            wrap.appendChild(host);
            this.body!.appendChild(wrap);
            return;
        }
        if (field.type === 'conditionRules') {
            const wrap: HTMLDivElement = this.fieldGroup(label);
            const host: HTMLDivElement = document.createElement('div');
            host.className = 'e-wf-property-list-host';
            ConditionRulesEditor.render(
                host,
                Array.isArray(value) ? value as ConditionRule[] : [],
                (rules: ConditionRule[]) => onChange(rules),
                field.expression ? {
                    attachExpression: (input: ExpressionTarget): void => this.attachExpressionPicker(input),
                    attachFieldExpression: this.current && this.isStep(this.current) && this.current.stepType === 'Filter'
                        ? (input: ExpressionTarget): void => this.attachExpressionPicker(input, true)
                        : undefined
                } : undefined,
                this.onCommit ? () => this.onCommit!(this.currentStepId()) : undefined
            );
            wrap.appendChild(host);
            this.body!.appendChild(wrap);
            return;
        }
        if (field.type === 'switchBranches') {
            const wrap: HTMLDivElement = this.fieldGroup(label);
            const host: HTMLDivElement = document.createElement('div');
            host.className = 'e-wf-property-list-host';
            SwitchBranchesEditor.render(
                host,
                Array.isArray(value) ? value as BranchRule[] : [],
                (branches: BranchRule[]) => onChange(branches),
                field.expression
                    ? {
                        attachExpression: (input: ExpressionTarget): void =>
                            this.attachExpressionPicker(input)
                    }
                    : undefined,
                this.onCommit ? () => this.onCommit!(this.currentStepId()) : undefined
            );
            wrap.appendChild(host);
            this.body!.appendChild(wrap);
            return;
        }
        if (field.type === 'setVariables') {
            const wrap: HTMLDivElement = this.fieldGroup(label, !!field.hideFieldLabel);
            const host: HTMLDivElement = document.createElement('div');
            host.className = 'e-wf-property-list-host';
            VariablesEditor.render(
                host,
                Array.isArray(value) ? value as WorkflowVariableAssignment[] : [],
                (variables: WorkflowVariableAssignment[]) => onChange(variables),
                field.expression
                    ? {
                        attachExpression: (input: ExpressionTarget): void =>
                            this.attachExpressionPicker(input)
                    }
                    : undefined,
                this.onCommit ? () => this.onCommit!(this.currentStepId()) : undefined
            );
            wrap.appendChild(host);
            this.body!.appendChild(wrap);
            return;
        }
        if (field.type === 'reviewers') {
            const wrap: HTMLDivElement = this.fieldGroup(label, !!field.hideFieldLabel);
            const host: HTMLDivElement = document.createElement('div');
            host.className = 'e-wf-property-list-host';
            ReviewersEditor.render(
                host,
                Array.isArray(value) ? value as ReviewerRef[] : [],
                (reviewers: ReviewerRef[]) => onChange(reviewers),
                field.expression
                    ? {
                        attachExpression: (input: ExpressionTarget): void =>
                            this.attachExpressionPicker(input)
                    }
                    : undefined,
                this.onCommit ? () => this.onCommit!(this.currentStepId()) : undefined
            );
            wrap.appendChild(host);
            this.body!.appendChild(wrap);
            return;
        }
        if (field.type === 'requestFields') {
            const wrap: HTMLDivElement = this.fieldGroup(label, !!field.hideFieldLabel);
            const host: HTMLDivElement = document.createElement('div');
            host.className = 'e-wf-property-list-host';
            RequestFieldsEditor.render(
                host,
                Array.isArray(value) ? value as ApprovalRequestField[] : [],
                (fields: ApprovalRequestField[]) => onChange(fields),
                field.expression
                    ? {
                        attachExpression: (input: ExpressionTarget): void =>
                            this.attachExpressionPicker(input)
                    }
                    : undefined,
                this.onCommit ? () => this.onCommit!(this.currentStepId()) : undefined
            );
            wrap.appendChild(host);
            this.body!.appendChild(wrap);
            return;
        }
        if (field.type === 'responseFields') {
            const wrap: HTMLDivElement = this.fieldGroup(label);
            // Mirror Cron's labelled-trigger pattern: surface long-form help
            // as a hover-only `?` icon next to the field label rather than
            // as an inline block under the list. Skips when no helpText
            // is supplied so callers can opt out.
            if (field.helpText && field.helpIcon) {
                const labelCaption: HTMLElement | null = wrap.querySelector('.e-wf-property-label');
                if (labelCaption) {
                    labelCaption.appendChild(this.createQuestionMarkButton(field.helpText, 'Desired response fields help'));
                }
            }
            const host: HTMLDivElement = document.createElement('div');
            host.className = 'e-wf-property-list-host';
            ResponseFieldsEditor.render(
                host,
                Array.isArray(value) ? value as AiResponseFieldModel[] : [],
                (fields: AiResponseFieldModel[]) => onChange(fields),
                this.onCommit ? () => this.onCommit!(this.currentStepId()) : undefined
            );
            wrap.appendChild(host);
            this.body!.appendChild(wrap);
            return;
        }
        if (field.type === 'queryParameters') {
            const wrap: HTMLDivElement = this.fieldGroup(label);
            const host: HTMLDivElement = document.createElement('div');
            host.className = 'e-wf-property-list-host';
            QueryParametersEditor.render(
                host,
                Array.isArray(value) ? value as KeyValue[] : [],
                (parameters: KeyValue[]) => onChange(parameters),
                field.expression ? (input: ExpressionTarget) => this.attachExpressionPicker(input) : undefined,
                this.onCommit ? () => this.onCommit!(this.currentStepId()) : undefined,
                this.l10n
            );
            wrap.appendChild(host);
            this.body!.appendChild(wrap);
            return;
        }
        if (field.type === 'textarea' || field.type === 'json') {
            const wrap: HTMLLabelElement = this.label(label);
            const row: HTMLDivElement = document.createElement('div');
            row.className = field.expression ? 'e-wf-property-input-row e-wf-property-input-row-expression e-wf-property-input-row-area' : 'e-wf-property-input-row e-wf-property-input-row-area';
            const area: HTMLTextAreaElement = document.createElement('textarea');
            row.appendChild(area);
            wrap.appendChild(row);
            this.body!.appendChild(wrap);

            const initial: string = field.type === 'json'
                ? JSON.stringify(value || [], null, 2)
                : (value === undefined || value === null ? '' : String(value));
            const textArea: TextBox = this.track(new TextBox({
                multiline: true,
                value: initial,
                cssClass: 'e-wf-property-input'
            }));
            textArea.appendTo(area);
            textArea.element.setAttribute('aria-label', label);
            textArea.element.addEventListener('focus', () => { this.activeInput = textArea; });
            textArea.element.addEventListener('change', () => {
                const raw: string = textArea.element.value;
                if (field.type === 'json') {
                    try {
                        onChange(JSON.parse(raw || 'null'));
                    } catch {
                        // Malformed JSON is stored verbatim so the author's
                        // in-progress text is never silently discarded.
                        onChange(raw);
                    }
                } else {
                    onChange(raw);
                }
            });

            if (field.expression) {
                row.appendChild(this.createContextButton(textArea));
                wrap.appendChild(this.createExpressionPreview(textArea));
            }
            return;
        }
        if (field.type === 'number') {
            // For memoryHistorySize, add to memory section body with list-editor styles
            let wrap: HTMLElement;
            let input: HTMLInputElement;
            let row: HTMLDivElement | undefined;
            let memorySectionBody: HTMLElement | null = null;
            const isMemoryField: boolean = field.key === 'memoryHistorySize';

            if (field.key === 'memoryHistorySize' && this.memorySectionWrapper) {
                // Create wrapper matching the list-editor subfield structure.
                // Memory History Size subfield: promote the wrapper to
                // `flex-direction: row` inline so the sublabel span and the
                // input sit on the same line (the base class is a column
                // flex). The wrapper is a `<label>` so the help `?` button
                // can be appended inside the same sublabel span — the span
                // is inline, the button is inline-block, so the `Memory
                // History Size  (i)` row reads as a single line of text.
                wrap = document.createElement('label');
                wrap.className = 'e-wf-list-editor-subfield';
                wrap.style.marginTop = '12px';

                const labelText: HTMLSpanElement = document.createElement('span');
                labelText.className = 'e-wf-list-editor-sublabel';
                labelText.textContent = label;
                wrap.appendChild(labelText);

                if (field.helpText && field.helpIcon) {
                    // Use custom title for memory field
                    const helpTitle: string = StepEditorRegistry.resolveCaption('Memory History Size');
                    labelText.appendChild(this.createQuestionMarkButton(field.helpText, helpTitle));
                }

                // Create input element directly (no input-row wrapper for memory field)
                input = document.createElement('input');
                wrap.appendChild(input);
            } else {
                wrap = this.label(label);

                // Add help icon next to label for non-memory fields
                if (field.helpText && field.helpIcon) {
                    const labelCaption: HTMLElement | null = wrap.querySelector('.e-wf-property-label');
                    if (labelCaption) {
                        labelCaption.appendChild(this.createQuestionMarkButton(field.helpText, 'Field help'));
                    }
                }

                row = document.createElement('div');
                const hasSideControl: boolean = !!field.helpText && !field.helpIcon;
                row.className = hasSideControl ? 'e-wf-property-input-row e-wf-property-input-row-expression' : 'e-wf-property-input-row';
                input = document.createElement('input');
                row.appendChild(input);
                wrap.appendChild(row);
            }

            // Append to memory section body if it exists, otherwise to body
            if (isMemoryField && this.memorySectionWrapper) {
                memorySectionBody = (this.memorySectionWrapper as any).bodyElement;
                if (memorySectionBody) {
                    memorySectionBody.appendChild(wrap);
                } else {
                    this.body!.appendChild(wrap);
                }
            } else {
                this.body!.appendChild(wrap);
            }

            // Determine min/max values based on field key
            let minValue: number | undefined;
            let maxValue: number | undefined;

            if (field.key === 'maxOccurrences' || field.key === 'interval' || field.key === 'timeoutSeconds') {
                minValue = 1;
            } else if (field.key === 'memoryHistorySize') {
                minValue = 1;
                maxValue = 50;
            }

            const numeric: NumericTextBox = this.track(new NumericTextBox({
                cssClass: 'e-wf-property-input',
                format: 'n',
                value: value === undefined || value === null || value === '' ? null : Number(value),
                min: minValue,
                max: maxValue,
                step: 1,
                // The native input produced no spin buttons; keep the field
                // visually equivalent.
                showSpinButton: false,
                change: (args: NumericChangedEventArgs) => {
                    // NumericTextBox reports an empty field as `null`; the
                    // stored shape must stay `undefined` so the serialized
                    // workflow JSON is unchanged.
                    const next: number | null = args && args.value !== undefined
                        ? args.value as any
                        : null;
                    onChange(next === null ? undefined : next);
                }
            }));
            numeric.appendTo(input);
            numeric.element.setAttribute('aria-label', label);

            if (isMemoryField && memorySectionBody && this.current && this.isStep(this.current) && this.current.id) {
                const nodeId: string = this.current.id;
                const scope: string = this.memoryScope();
                if (AIMemoryIntegration.hasStoredMemory(scope, nodeId)) {
                    const clearMemoryButton: HTMLButtonElement = document.createElement('button');
                    clearMemoryButton.type = 'button';
                    clearMemoryButton.setAttribute('aria-label', this.caption('clearConversationMemory', 'Clear previous conversation memory'));
                    clearMemoryButton.style.marginTop = '8px';
                    clearMemoryButton.style.width = '100%';
                    clearMemoryButton.addEventListener('click', () => {
                        AIMemoryIntegration.clearAllMemory(scope, nodeId);
                        if (!AIMemoryIntegration.hasStoredMemory(scope, nodeId) && clearMemoryButton.parentNode) {
                            clearMemoryButton.parentNode.removeChild(clearMemoryButton);
                        }
                    });
                    memorySectionBody.appendChild(clearMemoryButton);
                    const button: Button = this.track(new Button());
                    button.appendTo(clearMemoryButton);
                    button.content = 'Clear Previous Memory';
                    button.dataBind();
                }
            }

            // Add help button inline if helpText exists and helpIcon is not true
            if (field.helpText && !field.helpIcon && row) {
                row.appendChild(this.createHelpButton(field.helpText, 'Field help'));
            }

            return;
        }
        if (field.type === 'datetime') {
            this.addDateTime(label, value, onChange, this.scheduleTimeZone());
            return;
        }
        this.addText(
            label,
            value === undefined || value === null ? '' : String(value),
            onChange,
            !!field.expression,
            field.helpText,
            field.key === 'sortBy'
                && this.current !== null
                && this.isStep(this.current)
                && this.current.stepType === 'Sort',
            !!field.helpIcon
        );
    }

    /**
     * Wire runtime-context picker + live resolved-value preview onto a
     * list-builder expression input. The preview shows the actual value the
     * expression will produce at simulation time, so authors can see what
     * will land in the field instead of staring at a raw `{{$.path}}` token.
     *
     * @param {ExpressionTarget} target The expression input or component.
     * @param {boolean} itemField Whether the input is a Filter item field.
     * @returns {void}
     */
    private attachExpressionPicker(target: ExpressionTarget, itemField: boolean = false): void {
        // enableDefaultBinding removed: structurally always on (default binding
        // path is no longer toggled from the host surface).
        if (!this.isStep(this.current)) {
            return;
        }
        // Widened to accept either a native element (structured list editors,
        // not yet migrated) or a `TextBox` instance. Both are normalized here
        // so callers need no change.
        const input: HTMLInputElement | HTMLTextAreaElement | null = ExpressionTargets.element(target);
        if (!input) {
            return;
        }
        input.addEventListener('focus', () => { this.activeInput = target; });
        const preview: HTMLDivElement = this.createExpressionPreview(target);
        const row: HTMLElement | null = input.closest('.e-wf-property-input-row') as HTMLElement | null;
        if (row) {
            row.appendChild(this.createContextButton(target, itemField));
            // Skip adding preview div for query parameter inputs
            const isQueryParameter: boolean = input.closest('.e-wf-query-parameter-row') !== null;
            if (!isQueryParameter) {
                this.insertPreviewAfterRow(row, preview);
            }
            return;
        }
        const fallbackRow: HTMLDivElement = document.createElement('div');
        fallbackRow.className = 'e-wf-property-input-row e-wf-property-input-row-expression';
        if (input.parentElement) {
            input.parentElement.insertBefore(fallbackRow, input);
        }
        fallbackRow.appendChild(input);
        fallbackRow.appendChild(this.createContextButton(target, itemField));
    }

    /**
     * Build the live resolved-value preview element. Renders the input's
     * current text as a single dim line below the input:
     *   - Literal text  → "= Hello world"
     *   - Resolved      → "= 1240.50" (expression still in title)
     *   - Unresolvable  → shows the expression itself so the author can see
     *                     what they configured. This is the same affordance
     *                     the Formatter's `sourcePath` and the condition
     *                     editor use — at design time with no upstream data,
     *                     the stored expression is the most honest preview.
     *
     * @param {ExpressionTarget} target The input or component to preview.
     * @returns {HTMLDivElement} The preview element.
     */
    private createExpressionPreview(target: ExpressionTarget): HTMLDivElement {
        const input: HTMLInputElement | HTMLTextAreaElement | null = ExpressionTargets.element(target);
        const preview: HTMLDivElement = document.createElement('div');
        preview.className = 'e-wf-property-expr-preview';
        // Inline layout defaults so the preview still lands on its own line
        // without requiring a project-level CSS rule. The display: block +
        // clear: both guarantees the preview always lands on its own line
        // even if the host's CSS treats the parent as a flex row.
        //
        // The previous hardcoded `color: #6b7280` was removed: it was
        // unreadable on dark themes. The preview now inherits the themed
        // text colour. The remaining inline values are layout-only and
        // should move to SCSS once the stylesheet is available.
        preview.style.display = 'block';
        preview.style.clear = 'both';
        preview.style.width = '100%';
        preview.style.fontSize = '11px';
        preview.style.lineHeight = '1.4';
        preview.style.opacity = '0.75';
        preview.style.marginTop = '2px';
        preview.style.padding = '0 2px';
        preview.style.whiteSpace = 'nowrap';
        preview.style.overflow = 'hidden';
        preview.style.textOverflow = 'ellipsis';
        preview.style.minHeight = '14px';
        preview.style.boxSizing = 'border-box';
        const update: () => void = (): void => {
            const raw: string = ExpressionTargets.value(target);
            const trimmed: string = raw.trim();
            if (!trimmed) {
                preview.textContent = '';
                preview.title = '';
                preview.classList.add('e-wf-property-expr-preview-empty');
                return;
            }
            preview.classList.remove('e-wf-property-expr-preview-empty');
            const context: WorkflowRuntimeContext = this.resolveContextForPreview(this.lastContext);
            const isTemplate: boolean = trimmed.indexOf('{{') !== -1 || trimmed.charAt(0) === '$';
            if (!isTemplate) {
                // Literal: just echo it back so the author sees what's stored.
                preview.textContent = '= ' + trimmed;
                preview.title = trimmed;
                return;
            }
            const hasUpstream: boolean = this.hasUpstreamRuntimeData(this.lastContext);
            const resolved: unknown = ExpressionEvaluator.resolve(trimmed, context);
            if (resolved === undefined || resolved === null) {
                // No upstream data yet — show the expression itself so the
                // author can confirm what they configured. Matches the
                // Formatter's sourcePath affordance.
                const displayText: string = hasUpstream
                    ? trimmed + '  (no value at this path)'
                    : trimmed + '  (run the workflow to preview)';
                preview.textContent = displayText;
                preview.title = displayText;
                return;
            }
            if (!hasUpstream) {
                // Resolution only worked because of the empty default; be
                // honest that the user has not run the workflow yet.
                const displayText: string = '= ' + this.previewDisplay(resolved) + '  (empty — run to preview)';
                preview.textContent = displayText;
                preview.title = displayText;
                return;
            }
            const displayText: string = '= ' + this.previewDisplay(resolved);
            preview.textContent = displayText;
            preview.title = displayText;
        };
        if (input) {
            input.addEventListener('input', update);
            input.addEventListener('change', update);
        }
        // Initial paint so the preview is correct on first render.
        update();
        return preview;
    }

    /**
     * Format the resolved value for the preview line. Strings/booleans/numbers
     * render as their natural shape; objects/arrays are JSON-stringified and
     * truncated for legibility.
     *
     * @param {WorkflowRuntimeContext|null} context The runtime context.
     * @returns {WorkflowRuntimeContext} A normalized preview context.
     */
    private resolveContextForPreview(context: WorkflowRuntimeContext | null): WorkflowRuntimeContext {
        // Make sure every root branch the editor uses is a defined (possibly
        // empty) object, so `ExpressionEvaluator.readPath` returns the most
        // meaningful answer at design time. The previous `||` short-circuit
        // only fired for `null`, so a snapshot of `{}` (post-reset) would skip
        // the default and every template resolved to undefined.
        const safe: WorkflowRuntimeContext = context && typeof context === 'object' ? context : {};
        return {
            input: safe.input && typeof safe.input === 'object' ? safe.input : { response: {} },
            nodes: safe.nodes && typeof safe.nodes === 'object' ? safe.nodes : {},
            variables: safe.variables && typeof safe.variables === 'object' ? safe.variables : {}
        };
    }

    /**
     * Returns true when the runtime context has at least one populated
     * branch (input.response, nodes, or variables). Used to distinguish
     * "the path is wrong" from "the workflow hasn't run yet" in the preview.
     *
     * @param {WorkflowRuntimeContext|null} context The runtime context.
     * @returns {boolean} Whether upstream runtime data exists.
     */
    private hasUpstreamRuntimeData(context: WorkflowRuntimeContext | null): boolean {
        if (!context || typeof context !== 'object') {
            return false;
        }
        const inputResponse: unknown = context.input && context.input.response;
        if (inputResponse && typeof inputResponse === 'object' && Object.keys(inputResponse).length > 0) {
            return true;
        }
        if (Array.isArray(inputResponse) && inputResponse.length > 0) {
            return true;
        }
        if (inputResponse !== undefined && inputResponse !== null && inputResponse !== '') {
            return true;
        }
        if (context.nodes && Object.keys(context.nodes).length > 0) {
            return true;
        }
        if (context.variables && Object.keys(context.variables).length > 0) {
            return true;
        }
        return false;
    }

    private previewDisplay(resolved: unknown): string {
        if (typeof resolved === 'string') {
            return resolved;
        }
        if (typeof resolved === 'number' || typeof resolved === 'boolean') {
            return String(resolved);
        }
        // Authors want to see the leaf value the expression will produce,
        // not the parent object rendered as `field: value` JSON. For
        // non-array objects, walk into the first leaf; for arrays, walk
        // into the first element. This matches the natural reading of a
        // form field binding where the resolved value is the user's input.
        if (resolved && typeof resolved === 'object' && !Array.isArray(resolved)) {
            const obj: Record<string, unknown> = resolved as Record<string, unknown>;
            for (const key of Object.keys(obj)) {
                const child: unknown = obj[`${key}`];
                if (child === null || typeof child !== 'object') {
                    return String(child);
                }
            }
            const firstKey: string = Object.keys(obj)[0];
            if (firstKey) {
                return this.previewDisplay(obj[`${firstKey}`]);
            }
        }
        if (Array.isArray(resolved) && resolved.length > 0) {
            return this.previewDisplay(resolved[0]);
        }
        let json: string;
        try {
            json = JSON.stringify(resolved);
        } catch (e) {
            json = '[unserializable]';
        }
        if (json && json.length > 80) {
            json = json.substring(0, 77) + '…';
        }
        return json;
    }

    /**
     * Insert the preview as a DOM sibling immediately after the input row.
     * `row.after(preview)` is the only call we need: it puts the preview
     * outside the flex row (so the input + context button stay on their
     * own line) and as a sibling of the row inside whatever wrapping
     * container the list-editor provided. A previous version of this
     * method tried to look up `row.nextElementSibling` and could land in
     * the wrong subfield, which is why the preview was rendering beside
     * the button in some layouts.
     *
     * @param {HTMLElement} row The input row.
     * @param {HTMLDivElement} preview The preview element.
     * @returns {void}
     */
    private insertPreviewAfterRow(row: HTMLElement, preview: HTMLDivElement): void {
        if (typeof row.after === 'function') {
            row.after(preview);
            return;
        }
        // Defensive fallback for very old hosts without `Element.after`.
        const parent: HTMLElement | null = row.parentElement;
        if (parent && row.nextSibling) {
            parent.insertBefore(preview, row.nextSibling);
            return;
        }
        if (parent) {
            parent.appendChild(preview);
        }
    }

    private createContextButton(target: ExpressionTarget, itemField: boolean = false): HTMLButtonElement {
        const button: HTMLButtonElement = document.createElement('button');
        button.type = 'button';
        button.className = 'e-wf-runtime-context-trigger';
        this.track(new Button({
            cssClass: 'e-wf-runtime-context-trigger',
            iconCss: 'e-icons e-code-view'
        })).appendTo(button);
        const title: string = this.localize('insertRuntimeContext', 'Insert runtime context');
        button.setAttribute('aria-label', title);
        button.title = title;
        button.addEventListener('mousedown', (event: MouseEvent) => {
            // Keep focus on the field so insert targets the correct control.
            event.preventDefault();
        });
        button.addEventListener('click', () => {
            this.activeInput = target;
            const element: HTMLInputElement | HTMLTextAreaElement | null = ExpressionTargets.element(target);
            if (element) {
                element.focus();
            }
            this.openContextPopup(button, itemField);
        });
        return button;
    }

    private localize(key: string, fallback: string): string {
        return this.l10n ? (this.l10n.getConstant(key) || fallback) : fallback;
    }

    private label(text: string): HTMLLabelElement {
        const wrap: HTMLLabelElement = document.createElement('label');
        wrap.className = 'e-wf-property-field';
        const caption: HTMLSpanElement = document.createElement('span');
        caption.className = 'e-wf-property-label';
        caption.textContent = text;
        wrap.appendChild(caption);
        return wrap;
    }

    /**
     * Creates a div-based field shell for nested list editors.
     *
     * @param {string} text The field label.
     * @param {boolean} hideLabel When true, suppress the label caption and
     *   emit a `data-wf-field-label` attribute so consumers (e.g. help
     *   trigger) can still find the wrapper. Used by list editors that
     *   render their own heading and would otherwise duplicate the label.
     * @returns {HTMLDivElement} The field wrapper.
     */
    private fieldGroup(text: string, hideLabel: boolean = false): HTMLDivElement {
        const wrap: HTMLDivElement = document.createElement('div');
        wrap.className = 'e-wf-property-field';
        if (hideLabel) {
            // Keep the wrapper discoverable for tests/debugging without
            // rendering a caption that duplicates the editor's title row.
            wrap.setAttribute('data-wf-field-label', text);
            return wrap;
        }
        const caption: HTMLSpanElement = document.createElement('span');
        caption.className = 'e-wf-property-label';
        caption.textContent = text;
        wrap.appendChild(caption);
        return wrap;
    }

    private renderEmpty(): void {
        if (!this.body) {
            return;
        }
        this.cancelRerender();
        this.destroyFieldInstances();
        this.body.innerHTML = '';
        const empty: HTMLDivElement = document.createElement('div');
        empty.className = 'e-wf-property-empty';
        empty.textContent = this.l10n ? (this.l10n.getConstant('propEmptyMessage') || 'Select a workflow step to edit properties.') : 'Select a workflow step to edit properties.';
        this.body.appendChild(empty);
    }

    /**
     * Renders the selected step's type as the first row of the panel body.
     *
     * @param {string} stepType - The step type, such as `SetVariable`.
     * @returns {void}
     */
    private renderStepType(stepType: string): void {
        if (!this.body) {
            return;
        }
        const readable: string = PropertyPanel.splitCamelCase(String(stepType || '').trim());
        if (!readable) {
            return;
        }
        const wrap: HTMLDivElement = this.fieldGroup(readable);
        wrap.classList.add('e-wf-property-step-type');
        const caption: HTMLElement | null = wrap.querySelector('.e-wf-property-label');
        if (caption) {
            caption.classList.add('e-wf-property-step-type-label');
        }
        this.body.appendChild(wrap);
    }

    /**
     * Inserts a single space between the CamelCase word boundaries of a
     * PascalCase / camelCase identifier.
     *
     * Examples:
     *   SetVariable       → Set Variable
     *   ScheduledTrigger  → Scheduled Trigger
     *   ManualTrigger     → Manual Trigger
     *   HTTPRequest       → HTTPRequest  (consecutive caps stay together)
     *
     * The split is purely visual — the underlying `stepType` enum stays
     * the source of truth for serialization and condition matching.
     *
     * @param {string} value The CamelCase identifier.
     * @returns {string} The same identifier with spaces between word boundaries.
     */
    private static splitCamelCase(value: string): string {
        return String(value || '')
            // Lower → Upper boundary: `sV` → `s V`.
            .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
            // Upper → Upper+Lower boundary: `HTTr` → `HT Tr` (only when a
            // lowercase follows a chain of uppercase letters).
            .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2');
    }

    private isStep(item: PropertySelection): item is WorkflowStep {
        return !!item && 'stepType' in item;
    }

    private isConnection(item: PropertySelection): item is WorkflowConnection {
        return !!item && 'sourceStepId' in item;
    }

    private isSticky(item: PropertySelection): item is WorkflowStickyNote {
        return !!item && 'text' in item && !('stepType' in item) && !('sourceStepId' in item);
    }
}

/**
 * Creates help trigger buttons that display simple EJ2 Tooltip content.
 * Provides a consistent interface for adding help affordances to list editors.
 *
 * @private
 */
export class HelpPopup {
    /** Container for tooltip cleanup on destroy. */
    private readonly tooltips: Tooltip[] = [];
    /** Trigger buttons for cleanup on destroy. */
    private readonly glyphs: Button[] = [];
    /** Help content data keyed by button element id. */
    private readonly helpData: Map<string, { title: string; description: string }> =
    new Map<string, { title: string; description: string }>();

    /**
     * Creates a `?` icon button that shows a template-based tooltip on hover/focus.
     * The content is split into title (heading) and description (body).
     *
     * @param {string} title Tooltip heading.
     * @param {string} description Tooltip body text.
     * @returns {HTMLButtonElement} The trigger button.
     * @private
     */
    public createTrigger(title: string, description: string): HTMLButtonElement {
        const button: HTMLButtonElement = document.createElement('button');
        button.className = 'e-wf-property-help-trigger-icon';
        button.setAttribute('aria-label', title);
        const buttonId: string = 'e-wf-help-' + Math.random().toString(36).substr(2, 9);
        button.id = buttonId;
        button.addEventListener('mousedown', (event: MouseEvent) => {
            event.preventDefault();
        });

        // Store help content for beforeRender handler
        this.helpData.set(buttonId, { title, description });

        const glyph: Button = new Button({
            cssClass: 'e-wf-property-help-trigger-icon e-flat',
            iconCss: 'e-icons e-circle-info'
        });
        glyph.appendTo(button);
        this.glyphs.push(glyph);

        return button;
    }

    /**
     * Registers a tooltip with template-based content rendering.
     *
     * @param {Tooltip} tooltip The tooltip instance to track.
     * @returns {void}
     * @private
     */
    public registerTooltip(tooltip: Tooltip): void {
        this.tooltips.push(tooltip);
    }

    /**
     * Retrieves help content for rendering in tooltip beforeRender.
     *
     * @param {HTMLElement} target The target button element.
     * @returns {Object | undefined} The help content, or undefined.
     * @private
     */
    public getHelpContent(target: HTMLElement): { title: string; description: string } | undefined {
        return this.helpData.get(target.id);
    }

    /**
     * No-op for backward compatibility.
     *
     * @param {HTMLElement} anchor The anchor element.
     * @param {string} title The tooltip title.
     * @param {string} body The tooltip body.
     * @returns {void}
     * @private
     */
    public open(anchor: HTMLElement, title: string, body: string): void {
        // Tooltip is managed by EJ2, no manual open needed
    }

    /**
     * Closes any open tooltips.
     *
     * @returns {void}
     * @private
     */
    public close(): void {
        this.tooltips.forEach((tooltip: Tooltip) => {
            try {
                tooltip.close();
            } catch (error) {
                // Already disposed
            }
        });
    }

    /**
     * Tear down all resources.
     *
     * @returns {void}
     * @private
     */
    public destroy(): void {
        this.tooltips.splice(0).forEach((tooltip: Tooltip) => {
            try {
                tooltip.destroy();
            } catch (error) {
                // Already disposed
            }
        });
        this.glyphs.splice(0).forEach((glyph: Button) => {
            try {
                glyph.destroy();
            } catch (error) {
                // Already disposed
            }
        });
        this.helpData.clear();
    }
}

/**
 * Builds a `[ title ] [ ? ]` header row used by list editors that need a
 * hover-only help affordance via simple EJ2 Tooltip.
 *
 * @param {string} title Text shown next to the `?` icon.
 * @param {string} popupTitle Tooltip heading (used as aria-label).
 * @param {string} popupBody Tooltip body (simple text with line breaks).
 * @param {HelpPopup} popup Shared popup controller (maintains trigger references).
 * @returns {HTMLDivElement} Header element ready to insert above the list.
 * @private
 */
export function buildHelpTitle(
    title: string,
    popupTitle: string,
    popupBody: string,
    popup: HelpPopup
): HTMLDivElement {
    const header: HTMLDivElement = document.createElement('div');
    header.className = 'e-wf-list-editor-title-row';
    const text: HTMLSpanElement = document.createElement('span');
    text.className = 'e-wf-list-editor-title-text';
    text.textContent = title;
    header.appendChild(text);

    const helpButton: HTMLButtonElement = popup.createTrigger(popupTitle, popupBody);
    header.appendChild(helpButton);

    // Initialize template-based EJ2 Tooltip with inline sizing
    const tooltip: Tooltip = new Tooltip({
        opensOn: 'Hover Focus',
        position: 'BottomLeft',
        showTipPointer: false,
        windowCollision: true,
        openDelay: 120,
        closeDelay: 120,
        beforeRender: (args: any) => {
            const content: { title: string; description: string } | undefined = popup.getHelpContent(args.target);
            if (content) {
                // Use inline styling for header and description sizing
                const tooltipContent: HTMLDivElement = renderHelpContent(content.title, content.description);
                inheritTooltipContentColor(tooltipContent);
                tooltip.content = tooltipContent;
            }
        }
    });
    tooltip.appendTo(helpButton);
    popup.registerTooltip(tooltip);

    return header;
}
