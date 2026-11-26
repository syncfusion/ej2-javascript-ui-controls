import { Toolbar, ItemModel, ClickEventArgs } from '@syncfusion/ej2-navigations';
import { TextBox } from '@syncfusion/ej2-inputs';
import { DropDownList, ChangeEventArgs as DropDownChangeEventArgs } from '@syncfusion/ej2-dropdowns';
import { Tooltip } from '@syncfusion/ej2-popups';
import { L10n } from '@syncfusion/ej2-base';
import { WorkflowToolbarItem } from '../models/workflow-enums';
import { ServiceLocator } from './service';

/**
 * Callbacks the top toolbar invokes for each authoritative command.
 *
 * @private
 */
export interface TopToolbarHandlers {
    undo: () => void;
    redo: () => void;
    layout: () => void;
    /** Starts full workflow simulation through `runSimulation()`. */
    executeRun: (selectedTriggerId?: string) => void;
    /** Stops an active simulation. */
    stop: () => void;
    /** Resets runtime state and logs. */
    reset: () => void;
    /** Toggles read-only lock state. */
    lock: () => void;
    exportWorkflow: () => void;
    importWorkflow: () => void;
    /** Commits a renamed project/workflow display name. */
    projectNameChanged?: (name: string) => void;
    /** Returns trigger nodes available for a manual run. */
    getTriggerOptions?: () => Array<{ id?: string; name?: string; stepType?: string }>;
}

/**
 * Whether a command is implemented (route to a real method) or awaited.
 *
 * @private
 */
export type TopToolbarCommandState = 'implemented' | 'awaited';

interface TopToolbarButtonDefinition {
    item: WorkflowToolbarItem;
    icon: string;
    /** Localization key resolved through `l10n.getConstant`. */
    labelKey: string;
    state: TopToolbarCommandState;
    action: () => void;
    /** Optional keyboard shortcut to display in tooltip. */
    shortcut?: string;
}

/**
 * Default project title shown until the author renames the workflow.
 *
 * @private
 */
export const DEFAULT_PROJECT_NAME: string = 'Workflow Designer';

/**
 * TopToolbar — Syncfusion EJ2 top toolbar for the Workflow Designer
 *.
 *
 * Built from the Syncfusion `Toolbar`, `TextBox` and `DropDownList`
 * components so the top section inherits the active Syncfusion theme
 * (Material / Fluent / Bootstrap / Tailwind / High Contrast and their dark
 * variants) without component-owned theme CSS.
 *
 * NOTE: this supersedes the previous native-HTML implementation and the
 * `FR-014a` native-HTML-UI dependency boundary for this file. The boundary
 * remains in force for files not yet migrated.
 *
 * Layout:
 *   - left: editable project-name tile (default "Workflow Designer")
 *   - right: authoritative EJ2 Toolbar command items
 *
 * Each command renders as an EJ2 Toolbar item with:
 *   - a Syncfusion e-icons glyph as its `prefixIcon`
 *   - an accessible name (`aria-label` on the rendered item button)
 *   - a themed tooltip (from `data-wf-tooltip`, never a browser `title`)
 *   - keyboard focus support (Toolbar's own roving focus)
 *   - an enabled/disabled state driven through `Toolbar.enableItems`
 *   - a unique component-owned `e-wf-*` item `cssClass`
 *
 * Only authoritative configured commands in `toolbarSettings.items` render.
 * Commands are routed to the same `TopToolbarHandlers` methods as before.
 *
 * The top-toolbar Execute/Run command starts full simulation through
 * `runSimulation()` and is distinct from the node Execute handle, which
 * executes only the selected node.
 *
 * @internal
 * @private
 */
export class TopToolbar {
    private readonly host: HTMLElement;
    private readonly handlers: TopToolbarHandlers;
    private readonly isLocked: () => boolean;
    /**
     * Service locator passed in at construction time. Held so `setLocale()`
     * can re-resolve the active L10n instance after the host swaps it.
     */
    private readonly serviceLocator: ServiceLocator;
    /** Resolved on construction; refreshable via `setLocale()`. */
    private l10n: L10n;
    private element: HTMLDivElement | null = null;
    private actionsElement: HTMLDivElement | null = null;
    private toolbar: Toolbar | null = null;
    private toolbarElement: HTMLDivElement | null = null;
    private tooltip: Tooltip | null = null;
    /** Keyboard shortcut shown in each item's tooltip. */
    private readonly itemShortcuts: Map<WorkflowToolbarItem, string> = new Map<WorkflowToolbarItem, string>();
    private static readonly defaultShortcuts: { [item: string]: string } = { Execute: 'Ctrl+Enter', Lock: 'Ctrl+L' };
    private projectNameHost: HTMLDivElement | null = null;
    private projectTile: HTMLButtonElement | null = null;
    private projectTextBox: TextBox | null = null;
    private projectName: string = DEFAULT_PROJECT_NAME;
    private editingName: boolean = false;
    private isSimulationRunning: boolean = false;
    /**
     * Rendered Toolbar item model for each authoritative command.
     *
     * The model object is held directly rather than its index: indexing
     * `toolbar.items` with a variable is a computed member access, which the
     * security lint rules reject, and the reference is what every caller
     * actually wants.
     */
    private readonly itemModels: Map<WorkflowToolbarItem, ItemModel> =
    new Map<WorkflowToolbarItem, ItemModel>();
    /** Command action routed from the single `Toolbar.clicked` handler. */
    private readonly itemActions: Map<WorkflowToolbarItem, () => void> =
    new Map<WorkflowToolbarItem, () => void>();
    /**
     * Most recent tooltip/accessible-name text rendered per item. Used by
     * `setLocale()` to refresh the DOM after the L10n instance is swapped.
     */
    private readonly renderedLabels: Map<WorkflowToolbarItem, string> =
    new Map<WorkflowToolbarItem, string>();
    private spinnerElement: HTMLSpanElement | null = null;
    private executeButtonInStopState: boolean = false;
    private triggerSelector: DropDownList | null = null;
    private triggerSelectorElement: HTMLInputElement | null = null;
    private triggerSelectorTimer: number | null = null;
    private projectNameKeydownHandler: ((event: KeyboardEvent) => void) | null = null;
    private projectNameBlurHandler: (() => void) | null = null;
    /** Last reported undo / redo availability, used to keep the items
     *  disabled until the Diagram fires its first `historyChange` event. */
    private lastCanUndo: boolean = false;
    private lastCanRedo: boolean = false;

    /**
     * Creates an EJ2 top toolbar.
     *
     * @param {HTMLElement} host The workspace shell top toolbar region element.
     * @param {TopToolbarHandlers} handlers Command handlers routed to existing public methods.
     * @param {Function} isLocked Returns the current read-only lock state.
     * @param {ServiceLocator} serviceLocator Shared service registry; resolves L10n.
     * @private
     */
    public constructor(
        host: HTMLElement,
        handlers: TopToolbarHandlers,
        isLocked: () => boolean,
        serviceLocator: ServiceLocator
    ) {
        this.host = host;
        this.handlers = handlers;
        this.isLocked = isLocked;
        this.serviceLocator = serviceLocator;
        this.l10n = serviceLocator.getService<L10n>('localization');
    }

    /**
     * Creates and appends the toolbar for the given configuration.
     *
     * @param {boolean} enabled Whether the toolbar is displayed (`toolbarSettings.visible`); a hidden toolbar also has its commands disabled.
     * @param {WorkflowToolbarItem[]} items Authorized command items to render (`toolbarSettings.items`).
     * @param {string} projectName Optional initial project/workflow display name.
     * @returns {void}
     * @private
     */
    public create(enabled: boolean, items: WorkflowToolbarItem[], projectName?: string): void {
        this.projectName = this.normalizeProjectName(projectName);
        this.element = document.createElement('div');
        this.element.className = 'e-wf-toolbar';

        this.element.appendChild(this.createProjectNameControl());

        this.actionsElement = document.createElement('div');
        this.actionsElement.className = 'e-wf-toolbar-actions';
        this.toolbarElement = document.createElement('div');
        this.actionsElement.appendChild(this.toolbarElement);
        this.element.appendChild(this.actionsElement);
        // Append before instantiating the Toolbar: EJ2 components sized while
        // detached compute zero dimensions and render without overflow data.
        this.host.appendChild(this.element);

        const definitions: TopToolbarButtonDefinition[] = this.buildDefinitions();
        const visibleItems: WorkflowToolbarItem[] = items && items.length
            ? items
            : ['Undo', 'Redo', 'Layout', 'Execute', 'Lock', 'Export', 'Import'];

        const toolbarItems: ItemModel[] = [];
        definitions.forEach((definition: TopToolbarButtonDefinition) => {
            if (visibleItems.indexOf(definition.item) === -1) {
                return;
            }

            this.itemActions.set(
                definition.item,
                definition.item === 'Execute'
                    ? () => this.onExecuteButtonClick()
                    : definition.action
            );
            const label: string = this.l10n.getConstant(definition.labelKey);
            this.renderedLabels.set(definition.item, label);
            this.itemShortcuts.set(definition.item, definition.shortcut || '');
            // No `tooltipText`: the Toolbar would render it as a `title`, which shows the browser's own
            // tooltip next to ours. The themed tooltip reads `data-wf-tooltip` instead.
            const model: ItemModel = {
                id: this.itemId(definition.item),
                prefixIcon: this.iconClass(definition.icon),
                cssClass: `e-wf-toolbar-button e-wf-toolbar-${definition.item.toLowerCase()}`,
                disabled: definition.state === 'awaited'
                    || definition.item === 'Undo'
                    || definition.item === 'Redo'
            };
            this.itemModels.set(definition.item, model);
            toolbarItems.push(model);
            // Visual group separators: after Lock and after Redo.
            if (definition.item === 'Lock' || definition.item === 'Redo') {
                toolbarItems.push({
                    type: 'Separator',
                    cssClass: `e-wf-toolbar-separator e-wf-toolbar-separator-after-${definition.item.toLowerCase()}`
                });
            }
        });

        // A separator never ends the toolbar, whatever subset of items is shown.
        if (toolbarItems.length && toolbarItems[toolbarItems.length - 1].type === 'Separator') {
            toolbarItems.pop();
        }

        this.toolbar = new Toolbar({
            // `auto` keeps the Toolbar sized to its items so the existing
            // `e-wf-toolbar-actions` right-aligned flex slot is preserved.
            width: 'auto',
            items: toolbarItems,
            clicked: (args: ClickEventArgs) => this.onToolbarClick(args)
        });
        this.toolbar.appendTo(this.toolbarElement);
        this.applyAccessibleNames();
        this.applyEnabled(enabled);
        this.initializeTooltip();
    }

    /**
     * Returns the current project/workflow display name used for export.
     *
     * @returns {string} The project name.
     * @private
     */
    public getProjectName(): string {
        return this.projectName;
    }

    /**
     * Updates the project name tile without entering edit mode.
     * Empty or whitespace values fall back to the default title.
     *
     * @param {string} name The project name.
     * @returns {void}
     * @private
     */
    public setProjectName(name: string): void {
        this.projectName = this.normalizeProjectName(name);
        if (this.projectTile && !this.editingName) {
            this.projectTile.textContent = this.projectName;
            this.projectTile.title = this.projectName;
        }
        if (this.projectTextBox) {
            this.projectTextBox.value = this.projectName;
            this.projectTextBox.dataBind();
        }
    }

    /**
     * Updates the toolbar enabled/disabled state without rebuilding the
     * Toolbar. Rebuilding would discard the Execute/Stop visual state and
     * the in-flight icon transition.
     *
     * @param {boolean} enabled Whether the toolbar is enabled.
     * @returns {void}
     * @private
     */
    public applyEnabled(enabled: boolean): void {
        if (this.element) {
            this.element.style.display = enabled ? '' : 'none';
        }
        // Keys only: the model is reached through `setItemEnabled`, so no
        // unused callback parameter is introduced here.
        this.itemModels.forEach((model: ItemModel, item: WorkflowToolbarItem) => {
            const implemented: boolean = this.getCommandState(item) === 'implemented';
            const lockBlocks: boolean = this.lockBlocksCommand(item);
            const itemEnabled: boolean = enabled && implemented && !lockBlocks;
            this.setItemEnabled(item, itemEnabled);
        });
        // Re-apply the latest Undo / Redo availability so a `false` state
        // survives a fresh `applyEnabled(true)` call (e.g. when the canvas
        // history manager is rebuilt). Until the Diagram fires its first
        // `historyChange`, both flags stay `false` and the items remain
        // disabled.
        this.applyUndoRedoAvailability(this.lastCanUndo, this.lastCanRedo);
        this.updateLockButton();
        if (this.projectTile) {
            this.projectTile.disabled = !enabled || this.isLocked();
        }
        if (this.projectTextBox) {
            this.projectTextBox.enabled = !(!enabled || this.isLocked());
            this.projectTextBox.dataBind();
        }
        if (this.projectTextBox && (!enabled || this.isLocked()) && this.editingName) {
            this.commitProjectName(true);
        }
    }

    /**
     * Refreshes every rendered toolbar string after the host swaps the L10n
     * instance in the service locator. Updates tooltip text, accessible
     * names, the project-name chrome and the Lock/Execute state labels.
     *
     * @returns {void}
     * @private
     */
    public setLocale(): void {
        this.l10n = this.serviceLocator.getService<L10n>('localization');
        // Static-command items: re-read their label key and update both the
        // item model tooltip text and the rendered accessible name.
        this.buildDefinitions().forEach((definition: TopToolbarButtonDefinition) => {
            const item: WorkflowToolbarItem = definition.item;
            if (!this.itemModels.has(item)) {
                return;
            }
            // Execute/Stop swap is driven by `executeButtonInStopState`,
            // Lock is driven by `updateLockButton`, and the project-name
            // placeholder is handled below. Skip those here.
            if (item === 'Execute' || item === 'Lock') {
                return;
            }
            const label: string = this.l10n.getConstant(definition.labelKey);
            this.renderedLabels.set(item, label);
            this.setItemAccessibleName(item, label);
        });
        // Lock button label flips with the current lock state.
        this.updateLockButton();
        // Execute button reflects simulation state (play vs stop).
        if (this.executeButtonInStopState) {
            const stopLabel: string = this.l10n.getConstant('stopSimulation');
            this.renderedLabels.set('Execute', stopLabel);
            this.setItemAccessibleName('Execute', stopLabel);
        } else {
            const runLabel: string = this.l10n.getConstant('runSimulation');
            this.renderedLabels.set('Execute', runLabel);
            this.setItemAccessibleName('Execute', runLabel);
        }
        // Project-name placeholder: visible only when the TextBox is empty.
        if (this.projectTextBox) {
            this.projectTextBox.placeholder = this.l10n.getConstant('defaultProjectName');
            this.projectTextBox.dataBind();
        }
        // Active trigger selector: refresh the placeholder and the
        // aria-label so an open selector picks up the new strings.
        if (this.triggerSelector) {
            const selectTriggerLabel: string = this.l10n.getConstant('selectTrigger');
            this.triggerSelector.placeholder = selectTriggerLabel;
            this.triggerSelector.element.setAttribute('aria-label', selectTriggerLabel);
            this.triggerSelector.dataBind();
        }
    }

    /**
     * Toggles the Undo / Redo toolbar items based on the Diagram history
     * stack lengths reported by the host (mirrors the host sample attached in
     * this iteration). Combined with `applyEnabled` so a locked workflow keeps
     * both commands disabled even when history is non-empty.
     *
     * @param {boolean} canUndo Whether undo is available.
     * @param {boolean} canRedo Whether redo is available.
     * @returns {void} Nothing.
     * @private
     */
    public applyUndoRedoAvailability(canUndo: boolean, canRedo: boolean): void {
        this.lastCanUndo = canUndo;
        this.lastCanRedo = canRedo;
        const setItem: (item: WorkflowToolbarItem, enabled: boolean) => void =
            (item: WorkflowToolbarItem, enabled: boolean) => {
                if (!this.itemModels.has(item)) {
                    return;
                }
                this.setItemEnabled(item, enabled && !this.lockBlocksCommand(item));
            };
        setItem('Undo', canUndo);
        setItem('Redo', canRedo);
    }

    /**
     * Initializes the Tooltip component for toolbar items.
     *
     * @returns {void}
     */
    private initializeTooltip(): void {
        if (!this.element) {
            return;
        }
        this.tooltip = new Tooltip({
            target: '.e-wf-toolbar-actions [data-wf-tooltip]',
            position: 'TopCenter',
            opensOn: 'Hover',
            // Read the text when the tooltip opens, so it always matches the button's current state
            // (for example Run and Stop on the Execute button).
            beforeRender: (args: { target: HTMLElement }) => {
                if (this.tooltip && args && args.target) {
                    this.tooltip.content = args.target.getAttribute('data-wf-tooltip') || '';
                }
            }
        });
        this.tooltip.appendTo(this.element);
    }

    /**
     * Updates the Lock item glyph and accessible text for the current state.
     *
     * @returns {void}
     */
    private updateLockButton(): void {
        const model: ItemModel | undefined = this.itemModels.get('Lock');
        if (!model || !this.toolbar) {
            return;
        }
        const locked: boolean = this.isLocked();
        const icon: HTMLElement | null = this.itemIcon('Lock');
        if (icon) {
            icon.classList.toggle('e-lock', !locked);
            icon.classList.toggle('e-unlock', locked);
        }
        const label: string = this.l10n.getConstant(locked ? 'unlockWorkflow' : 'lockWorkflow');
        // Keep the item model in sync with the rendered glyph and label so a
        // later Toolbar refresh does not revert to the initial state. The
        // model is updated without `dataBind()` on purpose: re-binding
        // re-creates the item element and would discard the class toggle
        // above (and, for Execute, an in-flight fade transition).
        model.prefixIcon = this.iconClass(locked ? 'e-unlock' : 'e-lock');
        this.renderedLabels.set('Lock', label);
        this.setItemAccessibleName('Lock', label);
    }

    /**
     * Routes a Toolbar click to the command action registered for the item.
     *
     * @param {ClickEventArgs} args The Toolbar click event arguments.
     * @returns {void}
     */
    private onToolbarClick(args: ClickEventArgs): void {
        const id: string = args && args.item ? String(args.item.id || '') : '';
        if (!id) {
            return;
        }
        let matched: (() => void) | null = null;
        this.itemActions.forEach((action: () => void, item: WorkflowToolbarItem) => {
            if (this.itemId(item) === id) {
                matched = action;
            }
        });
        if (matched) {
            (matched as () => void)();
        }
    }

    /**
     * Unified click handler for the Execute item.
     * Routes to either executeRun (play state) or stop (stop state).
     * Includes validation before starting execution.
     *
     * @returns {void}
     */
    private onExecuteButtonClick(): void {
        // If already in stop state, call stop handler
        if (this.executeButtonInStopState) {
            this.handlers.stop();
            // Stop is synchronous at the controller boundary. Restore the toolbar
            // immediately instead of leaving the spinner/running state visible
            // until a later render cycle.
            this.hideStopButton();
            return;
        }

        const triggers: Array<{ id?: string; name?: string; stepType?: string }> =
            this.handlers.getTriggerOptions ? this.handlers.getTriggerOptions() : [];
        if (triggers.length > 1) {
            this.showTriggerSelector(triggers);
            return;
        }

        // Pass a single trigger explicitly so execution remains deterministic
        // even when a workflow later gains another trigger.
        this.handlers.executeRun(triggers.length === 1 ? triggers[0].id : undefined);
    }

    private showTriggerSelector(
        triggers: Array<{ id?: string; name?: string; stepType?: string }>
    ): void {
        if (this.triggerSelector || !this.actionsElement) {
            return;
        }
        const host: HTMLInputElement = document.createElement('input');
        host.type = 'text';
        this.triggerSelectorElement = host;
        // Use the same slot occupied by the running-state spinner so the
        // toolbar does not grow or shift when trigger selection opens.
        this.actionsElement.insertBefore(host, this.toolbarElement);

        const dataSource: Array<{ text: string; value: string }> = triggers.map(
            (trigger: { id?: string; name?: string; stepType?: string }) => ({
                text: trigger.name || trigger.stepType || trigger.id || this.l10n.getConstant('trigger'),
                value: trigger.id || ''
            })
        );

        this.triggerSelector = new DropDownList({
            cssClass: 'e-wf-toolbar-trigger-selector',
            dataSource: dataSource,
            fields: { text: 'text', value: 'value' },
            placeholder: this.l10n.getConstant('selectTrigger'),
            change: (args: DropDownChangeEventArgs) => this.onTriggerSelected(args),
            blur: () => this.scheduleTriggerSelectorRemoval()
        });
        this.triggerSelector.appendTo(host);
        // Drive both the visible placeholder and the aria-label from the
        // same key — accessibility metadata is shared with the visible
        // string when they refer to the same concept.
        this.triggerSelector.element.setAttribute('aria-label', this.l10n.getConstant('selectTrigger'));
        this.triggerSelector.focusIn();
    }

    /**
     * Commits a trigger selection. The DropDownList is disposed on a deferred
     * task so the component is not destroyed from inside its own `change`
     * handler; `executeRun` still fires synchronously, matching the previous
     * native `<select>` behaviour.
     *
     * @param {DropDownChangeEventArgs} args The DropDownList change arguments.
     * @returns {void}
     */
    private onTriggerSelected(args: DropDownChangeEventArgs): void {
        const selectedId: string = args && args.value !== null && args.value !== undefined
            ? String(args.value)
            : '';
        if (!selectedId) {
            return;
        }
        this.scheduleTriggerSelectorRemoval();
        this.handlers.executeRun(selectedId);
    }

    /**
     * Queues disposal of the trigger selector outside the current event.
     *
     * @returns {void}
     */
    private scheduleTriggerSelectorRemoval(): void {
        if (this.triggerSelectorTimer !== null) {
            return;
        }
        this.triggerSelectorTimer = window.setTimeout(() => {
            this.triggerSelectorTimer = null;
            this.removeTriggerSelector();
        }, 0);
    }

    private removeTriggerSelector(): void {
        if (this.triggerSelectorTimer !== null) {
            window.clearTimeout(this.triggerSelectorTimer);
            this.triggerSelectorTimer = null;
        }
        if (this.triggerSelector) {
            const selector: DropDownList = this.triggerSelector;
            this.triggerSelector = null;
            selector.destroy();
        }
        if (this.triggerSelectorElement) {
            const element: HTMLInputElement = this.triggerSelectorElement;
            this.triggerSelectorElement = null;
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
        }
    }

    /**
     * Transforms the Execute item to Stop state and shows the spinner.
     * Uses a single unified item that changes icon, styling, and state flag.
     * Spinner is fixed-position to avoid layout jerk.
     * Called when simulation starts (after validation has passed).
     *
     * @returns {void}
     * @private
     */
    public showStopButton(): void {
        const itemElement: HTMLElement | null = this.itemElement('Execute');
        if (!itemElement || this.isSimulationRunning) {
            return;
        }
        this.isSimulationRunning = true;
        this.executeButtonInStopState = true;

        // Add stop state class to transform the item styling and hover color
        itemElement.classList.add('e-wf-toolbar-in-stop-state');

        // Fade out current icon
        const icon: HTMLElement | null = this.itemIcon('Execute');
        if (icon) {
            icon.classList.add('e-wf-toolbar-icon-fade-out');

            // After fade-out, replace icon and fade in
            setTimeout(() => {
                icon.classList.remove('e-play');
                icon.classList.add('e-stop-rectangle');
                icon.classList.remove('e-wf-toolbar-icon-fade-out');
                icon.classList.add('e-wf-toolbar-icon-fade-in');
            }, 150);
        }

        // Update accessible label and tooltip
        const stopLabel: string = this.l10n.getConstant('stopSimulation');
        this.renderedLabels.set('Execute', stopLabel);
        this.setItemAccessibleName('Execute', stopLabel);
        this.setItemModelIcon('Execute', 'e-stop-rectangle', stopLabel);

        // Create and show fixed-position spinner before the toolbar
        // (spinner only shows if we reach this point, meaning validation passed)
        if (!this.spinnerElement && this.actionsElement) {
            this.spinnerElement = document.createElement('span');
            this.spinnerElement.className = 'e-wf-toolbar-spinner';
            this.spinnerElement.setAttribute('aria-hidden', 'true');

            const spinnerSvg: SVGSVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            spinnerSvg.setAttribute('viewBox', '0 0 24 24');
            spinnerSvg.setAttribute('width', '18');
            spinnerSvg.setAttribute('height', '18');
            spinnerSvg.innerHTML = '<circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2" opacity="0.25"/><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="15.7" stroke-dashoffset="0"/>';

            this.spinnerElement.appendChild(spinnerSvg);
            // Insert spinner before the Toolbar (fixed position won't affect layout)
            this.actionsElement.insertBefore(this.spinnerElement, this.toolbarElement);
        }

        // Show spinner with fade-in animation
        if (this.spinnerElement) {
            this.spinnerElement.classList.add('e-wf-toolbar-spinner-fade-in');
            this.spinnerElement.classList.remove('e-wf-toolbar-spinner-fade-out');
        }
    }

    /**
     * Transforms the item back to Execute state and hides the spinner.
     * Reverts item icon, styling, and state flag.
     * Called when simulation stops.
     *
     * @returns {void}
     * @private
     */
    public hideStopButton(): void {
        this.isSimulationRunning = false;
        this.executeButtonInStopState = false;

        // Hide spinner with fade-out animation
        if (this.spinnerElement) {
            this.spinnerElement.classList.add('e-wf-toolbar-spinner-fade-out');
            this.spinnerElement.classList.remove('e-wf-toolbar-spinner-fade-in');
            setTimeout(() => {
                if (this.spinnerElement && this.spinnerElement.parentNode) {
                    this.spinnerElement.remove();
                    this.spinnerElement = null;
                }
            }, 200);
        }

        const itemElement: HTMLElement | null = this.itemElement('Execute');
        if (!itemElement) {
            return;
        }

        // Remove stop state class to revert item styling
        itemElement.classList.remove('e-wf-toolbar-in-stop-state');

        // Fade out current icon
        const icon: HTMLElement | null = this.itemIcon('Execute');
        if (icon) {
            icon.classList.add('e-wf-toolbar-icon-fade-out');

            // After fade-out, replace icon and fade in
            setTimeout(() => {
                icon.classList.remove('e-stop-rectangle');
                icon.classList.add('e-play');
                icon.classList.remove('e-wf-toolbar-icon-fade-out');
                icon.classList.add('e-wf-toolbar-icon-fade-in');
            }, 150);
        }

        // Restore accessible label and tooltip
        const runLabel: string = this.l10n.getConstant('runSimulation');
        this.renderedLabels.set('Execute', runLabel);
        this.setItemAccessibleName('Execute', runLabel);
        this.setItemModelIcon('Execute', 'e-play', runLabel);
    }

    /**
     * Removes the toolbar, owned EJ2 components and all native event listeners.
     *
     * @returns {void}
     * @private
     */
    public destroy(): void {
        this.removeTriggerSelector();
        if (this.tooltip) {
            this.tooltip.destroy();
            this.tooltip = null;
        }
        if (this.projectTextBox) {
            if (this.projectNameKeydownHandler && this.projectTextBox.element) {
                this.projectTextBox.element.removeEventListener('keydown', this.projectNameKeydownHandler);
            }
            if (this.projectNameBlurHandler && this.projectTextBox.element) {
                this.projectTextBox.element.removeEventListener('blur', this.projectNameBlurHandler);
            }
            this.projectTextBox.destroy();
            this.projectTextBox = null;
        }
        this.projectNameKeydownHandler = null;
        this.projectNameBlurHandler = null;
        if (this.toolbar) {
            this.toolbar.destroy();
            this.toolbar = null;
        }
        if (this.element) {
            this.element.remove();
        }
        this.itemModels.clear();
        this.itemActions.clear();
        this.renderedLabels.clear();
        this.element = null;
        this.actionsElement = null;
        this.toolbarElement = null;
        this.projectNameHost = null;
        this.projectTile = null;
        this.spinnerElement = null;
        this.editingName = false;
        this.isSimulationRunning = false;
        this.executeButtonInStopState = false;
    }

    private createProjectNameControl(): HTMLDivElement {
        const wrap: HTMLDivElement = document.createElement('div');
        wrap.className = 'e-wf-project-name';
        this.projectNameHost = wrap;

        const tile: HTMLButtonElement = document.createElement('button');
        tile.type = 'button';
        tile.className = 'e-wf-project-name-tile';
        // The tile shows the project name as `textContent`; the title is the
        // hover tooltip. No aria-label is set so the accessible name falls
        // back to the visible text — exactly the project name the user
        // typed. (Per the localization rule: aria-only metadata is
        // excluded.)
        tile.title = this.projectName;
        tile.textContent = this.projectName;
        tile.addEventListener('click', () => this.enterProjectNameEdit());
        this.projectTile = tile;

        const input: HTMLInputElement = document.createElement('input');
        input.type = 'text';

        wrap.appendChild(tile);
        wrap.appendChild(input);

        this.projectTextBox = new TextBox({
            value: this.projectName,
            cssClass: 'e-wf-project-name-input',
            // `change` is intentionally not wired: commit is driven by the
            // same Enter / Escape / blur contract the native input used, and
            // wiring `change` as well would double-commit on blur.
            placeholder: this.l10n.getConstant('defaultProjectName')
        });
        this.projectTextBox.appendTo(input);
        this.projectTextBox.element.maxLength = 120;

        // Listeners are attached to the inner input element rather than the
        // component's event properties so caret/selection handling and the
        // existing Enter / Escape / blur contract behave identically to the
        // native implementation.
        this.projectNameKeydownHandler = (event: KeyboardEvent) => this.onProjectNameKeydown(event);
        this.projectNameBlurHandler = () => this.commitProjectName(true);
        this.projectTextBox.element.addEventListener('keydown', this.projectNameKeydownHandler);
        this.projectTextBox.element.addEventListener('blur', this.projectNameBlurHandler);

        return wrap;
    }

    private enterProjectNameEdit(): void {
        if (!this.projectNameHost || !this.projectTile || !this.projectTextBox || this.editingName) {
            return;
        }
        if (this.projectTile.disabled) {
            return;
        }
        this.editingName = true;
        this.projectTextBox.value = this.projectName;
        this.projectTextBox.dataBind();
        // Match editor width to the current tile so the field sits over the
        // name. The width is applied to the TextBox input-group wrapper, not
        // the inner input, because the wrapper owns the rendered box.
        const tileWidth: number = this.projectTile.getBoundingClientRect().width;
        const wrapper: HTMLElement | null = this.projectTextBoxWrapper();
        if (tileWidth > 0 && wrapper) {
            wrapper.style.width = Math.max(tileWidth, 160) + 'px';
            this.projectNameHost.style.minWidth = Math.max(tileWidth, 160) + 'px';
        }
        this.projectNameHost.classList.add('e-wf-project-name-editing');
        this.projectTextBox.element.focus();
        this.projectTextBox.element.select();
    }

    private onProjectNameKeydown(event: KeyboardEvent): void {
        if (event.key === 'Enter') {
            event.preventDefault();
            this.commitProjectName(true);
            return;
        }
        if (event.key === 'Escape') {
            event.preventDefault();
            this.commitProjectName(false);
        }
    }

    private commitProjectName(save: boolean): void {
        if (!this.projectNameHost || !this.projectTile || !this.projectTextBox || !this.editingName) {
            return;
        }
        if (save) {
            const next: string = this.normalizeProjectName(this.projectTextBox.element.value);
            const changed: boolean = next !== this.projectName;
            this.projectName = next;
            if (changed && this.handlers.projectNameChanged) {
                this.handlers.projectNameChanged(this.projectName);
            }
        }
        this.projectTile.textContent = this.projectName;
        this.projectTile.title = this.projectName;
        this.projectTextBox.value = this.projectName;
        this.projectTextBox.dataBind();
        const wrapper: HTMLElement | null = this.projectTextBoxWrapper();
        if (wrapper) {
            wrapper.style.width = '';
        }
        this.projectNameHost.style.minWidth = '';
        this.projectNameHost.classList.remove('e-wf-project-name-editing');
        this.editingName = false;
    }

    /**
     * Returns the TextBox input-group wrapper that owns the rendered box.
     *
     * @returns {HTMLElement | null} The wrapper element, or `null` when unavailable.
     */
    private projectTextBoxWrapper(): HTMLElement | null {
        if (!this.projectTextBox || !this.projectTextBox.element) {
            return null;
        }
        return this.projectTextBox.element.parentElement;
    }

    private normalizeProjectName(name?: string): string {
        if (typeof name !== 'string') {
            return DEFAULT_PROJECT_NAME;
        }
        const trimmed: string = name.replace(/\s+/g, ' ').trim();
        return trimmed || DEFAULT_PROJECT_NAME;
    }

    private buildDefinitions(): TopToolbarButtonDefinition[] {
        const h: TopToolbarHandlers = this.handlers;
        return [
            { item: 'Execute', icon: 'e-play', labelKey: 'runSimulation', state: 'implemented', action: () => h.executeRun(), shortcut: 'Ctrl+Enter' },
            { item: 'Layout', icon: 'e-grid-view', labelKey: 'autoArrange', state: 'implemented', action: () => h.layout(), shortcut: 'Shift+A' },
            { item: 'Lock', icon: 'e-lock', labelKey: 'toggleReadOnlyLock', state: 'implemented', action: () => h.lock(), shortcut: 'Ctrl+L' },
            { item: 'Undo', icon: 'e-undo', labelKey: 'undo', state: 'implemented', action: () => h.undo(), shortcut: 'Ctrl+Z' },
            { item: 'Redo', icon: 'e-redo', labelKey: 'redo', state: 'implemented', action: () => h.redo(), shortcut: 'Ctrl+Y' },
            { item: 'Import', icon: 'e-import', labelKey: 'importWorkflow', state: 'implemented', action: () => h.importWorkflow(), shortcut: 'Ctrl+O' },
            { item: 'Export', icon: 'e-export', labelKey: 'exportWorkflow', state: 'implemented', action: () => h.exportWorkflow(), shortcut: 'Ctrl+S' }
        ];
    }

    private getCommandState(_item: WorkflowToolbarItem): TopToolbarCommandState {
        return 'implemented';
    }

    private lockBlocksCommand(item: WorkflowToolbarItem): boolean {
        if (!this.isLocked()) {
            return false;
        }
        switch (item) {
        case 'Undo':
        case 'Redo':
        case 'Layout':
        case 'Import':
            return true;
        default:
            return false;
        }
    }

    /**
     * Returns the stable DOM id used for a Toolbar item.
     *
     * @param {WorkflowToolbarItem} item The command item.
     * @returns {string} The item id.
     */
    private itemId(item: WorkflowToolbarItem): string {
        return `e-wf-toolbar-item-${item.toLowerCase()}`;
    }

    /**
     * Composes the Syncfusion e-icons glyph classes for a Toolbar
     * `prefixIcon` (e.g. `e-undo`). Host pages must load
     * `@syncfusion/ej2-icons` styles.
     *
     * @param {string} iconClass The glyph class.
     * @returns {string} The composed prefix icon class list.
     */
    private iconClass(iconClass: string): string {
        return `e-icons ${iconClass} e-wf-toolbar-icon`;
    }

    /**
     * Returns the rendered `.e-toolbar-item` element for a command.
     *
     * @param {WorkflowToolbarItem} item The command item.
     * @returns {HTMLElement | null} The item element, or `null` if not rendered.
     */
    private itemElement(item: WorkflowToolbarItem): HTMLElement | null {
        if (!this.toolbar || !this.toolbar.element) {
            return null;
        }
        return this.toolbar.element.querySelector(`#${this.itemId(item)}`);
    }

    /**
     * Returns the rendered glyph span for a command's Toolbar item.
     *
     * @param {WorkflowToolbarItem} item The command item.
     * @returns {HTMLElement | null} The glyph element, or `null` if not rendered.
     */
    private itemIcon(item: WorkflowToolbarItem): HTMLElement | null {
        const element: HTMLElement | null = this.itemElement(item);
        return element ? element.querySelector('.e-wf-toolbar-icon') : null;
    }

    /**
     * Enables or disables a Toolbar item.
     *
     * The rendered element is passed to `enableItems` rather than an index,
     * so neither this method nor its callers index `toolbar.items`.
     *
     * @param {WorkflowToolbarItem} item The command item.
     * @param {boolean} enabled Whether the item is enabled.
     * @returns {void}
     */
    private setItemEnabled(item: WorkflowToolbarItem, enabled: boolean): void {
        const model: ItemModel | undefined = this.itemModels.get(item);
        if (!model || !this.toolbar) {
            return;
        }
        const itemIndex: number = this.toolbar.items.findIndex(
            (toolbarItem: ItemModel) => toolbarItem.id === model.id
        );
        if (itemIndex >= 0) {
            this.toolbar.enableItems(itemIndex, enabled);
        }
        model.disabled = !enabled;
    }

    /**
     * Applies the accessible name to every rendered Toolbar item. EJ2 renders
     * `tooltipText` as a `title`; the explicit `aria-label` preserves the
     * accessible names the native implementation exposed.
     *
     * @returns {void}
     */
    private applyAccessibleNames(): void {
        this.itemModels.forEach((model: ItemModel, item: WorkflowToolbarItem) => {
            const label: string | undefined = this.renderedLabels.get(item);
            if (label) {
                this.setItemAccessibleName(item, label);
            }
        });
    }

    /**
     * Sets the accessible name and tooltip text on a rendered Toolbar item.
     *
     * @param {WorkflowToolbarItem} item The command item.
     * @param {string} label The accessible name.
     * @returns {void}
     */
    private setItemAccessibleName(item: WorkflowToolbarItem, label: string): void {
        const element: HTMLElement | null = this.itemElement(item);
        if (!element) {
            return;
        }
        const button: HTMLElement | null = element.querySelector('.e-tbar-btn');
        const target: HTMLElement = button || element;
        target.setAttribute('aria-label', label);
        // The themed tooltip shows the label with its shortcut; no `title`, so the browser shows no
        // tooltip of its own.
        const shortcut: string = this.itemShortcuts.get(item) || TopToolbar.defaultShortcuts[`${item}`] || '';
        target.setAttribute('data-wf-tooltip', shortcut ? label + ' (' + shortcut + ')' : label);
        target.removeAttribute('title');
        element.removeAttribute('title');
    }

    /**
     * Keeps a Toolbar item model in sync with a glyph swap applied directly to
     * the rendered element. `dataBind()` is deliberately not called: re-binding
     * re-creates the item and would discard an in-flight fade transition.
     *
     * @param {WorkflowToolbarItem} item The command item.
     * @param {string} iconClass The glyph class now rendered.
     * @param {string} label The tooltip text now rendered.
     * @returns {void}
     */
    private setItemModelIcon(item: WorkflowToolbarItem, iconClass: string, label: string): void {
        const model: ItemModel | undefined = this.itemModels.get(item);
        if (!model || !this.toolbar) {
            return;
        }
        model.prefixIcon = this.iconClass(iconClass);
        void label;
    }
}
