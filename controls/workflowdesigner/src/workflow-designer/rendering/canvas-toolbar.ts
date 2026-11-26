import { Toolbar, ItemModel, ClickEventArgs } from '@syncfusion/ej2-navigations';
import { Diagram, DiagramTools } from '@syncfusion/ej2-diagrams';
import { L10n } from '@syncfusion/ej2-base';
import { Tooltip } from '@syncfusion/ej2-popups';
import { WorkflowCanvasToolbarItem } from '../models/workflow-enums';
import { WorkflowCanvasToolbarSettingsModel } from '../models/workflow-toolbar-settings-model';
import { WorkflowStepCollectionSettingsModel } from '../models/workflow-node-collection-settings-model';
import { ServiceLocator } from './service';

interface ToolbarButtonDefinition {
    item: WorkflowCanvasToolbarItem;
    /** Syncfusion e-icons glyph class (e.g. `e-mouse-pointer`). */
    icon: string;
    /** Localization key resolved through `l10n.getConstant`. */
    labelKey: string;
    action: () => void;
    /** Optional visual group key — items in the same group render adjacently. */
    group?: string;
    /** Optional keyboard shortcut to display in tooltip. */
    shortcut?: string;
}

/**
 * Authoritative visual grouping for canvas toolbar items.
 * Items separated by a vertical line belong to different groups:
 *  - authoring  : structural inputs (Add Node, Sticky Note)
 *  - navigation : cursor style (Select, Pan)
 *  - zoom       : viewport (ZoomOut, ZoomIn, Fit, ResetZoom)
 *  - cleanup    : diagram-wide actions (Clear)
 * The host can still pass an `items` list in any order, but missing groups
 * won't render their separator.
 */
const TOOLBAR_GROUPS: { after: WorkflowCanvasToolbarItem; key: string }[] = [
    { after: 'StickyNote', key: 'navigation' },
    { after: 'Pan', key: 'zoom' },
    { after: 'ResetZoom', key: 'cleanup' }
];

/**
 * Provides the foundation canvas controls using a Syncfusion `Toolbar`
 *, so the floating canvas controls inherit the active theme.
 *
 * NOTE: this supersedes the `FR-014a` native-HTML-UI dependency boundary
 * for this file. The boundary remains in force for files not yet migrated.
 *
 * @private
 */
export class CanvasToolbar {
    private readonly host: HTMLElement;
    private readonly diagram: Diagram;
    private settings: WorkflowCanvasToolbarSettingsModel;
    private readonly toggleNodeCollection: (fromUserHandle?: boolean) => void;
    private readonly addStickyNote: () => void;
    private readonly clearWorkflow?: () => void;
    private readonly serviceLocator: ServiceLocator;
    private l10n: L10n;
    private stepCollectionSettings?: WorkflowStepCollectionSettingsModel;
    private element: HTMLDivElement | null = null;
    private toolbar: Toolbar | null = null;
    private toolbarElement: HTMLDivElement | null = null;
    private tooltip: Tooltip | null = null;
    /** Keyboard shortcut shown in each item's tooltip. */
    private readonly itemShortcuts: Map<WorkflowCanvasToolbarItem, string> = new Map<WorkflowCanvasToolbarItem, string>();
    /** Command action per rendered item, routed from one `clicked` handler. */
    private readonly itemActions: Map<WorkflowCanvasToolbarItem, () => void> =
    new Map<WorkflowCanvasToolbarItem, () => void>();
    /**
     * Rendered Toolbar item model per command, for enable/disable.
     *
     * The model object is held directly rather than its index: indexing
     * `toolbar.items` with a variable is a computed member access, which the
     * security lint rules reject.
     */
    private readonly itemModels: Map<WorkflowCanvasToolbarItem, ItemModel> =
    new Map<WorkflowCanvasToolbarItem, ItemModel>();
    /**
     * Most recent accessible-name text rendered per item. Used by
     * `setLocale()` to refresh the DOM after the L10n instance is swapped.
     */
    private readonly renderedLabels: Map<WorkflowCanvasToolbarItem, string> =
    new Map<WorkflowCanvasToolbarItem, string>();

    /**
     * Creates a native canvas toolbar.
     *
     * @param {HTMLElement} host The component host.
     * @param {Diagram} diagram The internal Diagram instance.
     * @param {ServiceLocator} serviceLocator Shared service registry; resolves L10n.
     * @param {WorkflowCanvasToolbarSettingsModel} settings Author canvas toolbar settings.
     * @param {Function} addStickyNote Optional sticky-note callback.
     * @param {Function} toggleNodeCollection Optional node-collection callback; accepts optional boolean to indicate source (true=user handle, false=toolbar).
     * @param {Function} clearWorkflow Optional handler that wipes all steps, connections and sticky notes via `Diagram.clear()`.
     * @param {WorkflowStepCollectionSettingsModel} stepCollectionSettings Optional step collection settings to check if node collection is enabled.
     * @private
     */
    public constructor(
        host: HTMLElement,
        diagram: Diagram,
        serviceLocator: ServiceLocator,
        settings?: WorkflowCanvasToolbarSettingsModel,
        addStickyNote?: () => void,
        toggleNodeCollection?: (fromUserHandle?: boolean) => void,
        clearWorkflow?: () => void,
        stepCollectionSettings?: WorkflowStepCollectionSettingsModel
    ) {
        this.host = host;
        this.diagram = diagram;
        this.serviceLocator = serviceLocator;
        this.l10n = serviceLocator.getService<L10n>('localization');
        this.settings = settings || {};
        this.addStickyNote = addStickyNote || (() => undefined);
        this.toggleNodeCollection = toggleNodeCollection || (() => undefined);
        this.clearWorkflow = clearWorkflow;
        this.stepCollectionSettings = stepCollectionSettings;
    }

    /**
     * Creates and appends the toolbar.
     *
     * @returns {void}
     * @private
     */
    public create(): void {
        this.destroy();
        if (this.settings.visible === false) {
            return;
        }
        this.element = document.createElement('div');
        this.element.className = 'e-wf-canvas-toolbar';
        // The canvas toolbar is a floating overlay of icon buttons. It has
        // no visible text — its identity is conveyed by the EJ2 Toolbar's
        // own accessible-name per button — so no aria-label is set on the
        // region. Per the localization rule, aria-only metadata is
        // excluded.
        this.toolbarElement = document.createElement('div');
        this.element.appendChild(this.toolbarElement);
        // Appended before the Toolbar is instantiated: a component
        // initialised while detached measures zero and renders without
        // overflow data.
        this.host.appendChild(this.element);
        const definitions: ToolbarButtonDefinition[] = this.definitions();
        const visible: WorkflowCanvasToolbarItem[] = this.settings.items && this.settings.items.length
            ? this.settings.items
            : ['Add', 'StickyNote', 'Select', 'Pan', 'ZoomOut', 'ZoomIn', 'Fit', 'ResetZoom', 'Clear'];
        const definitionByItem: Map<WorkflowCanvasToolbarItem, ToolbarButtonDefinition> =
            new Map<WorkflowCanvasToolbarItem, ToolbarButtonDefinition>();
        definitions.forEach((definition: ToolbarButtonDefinition) => {
            definitionByItem.set(definition.item, definition);
        });
        // Render in `visible` order so host-defined reordering is honored.
        // Insert a vertical separator between groups whenever the previous
        // item is the listed "group boundary" before a new group's first item.
        const separatorGroupKeys: Map<WorkflowCanvasToolbarItem, string> =
            new Map<WorkflowCanvasToolbarItem, string>();
        TOOLBAR_GROUPS.forEach((boundary: { after: WorkflowCanvasToolbarItem; key: string }) => {
            separatorGroupKeys.set(boundary.after, boundary.key);
        });
        const items: ItemModel[] = [];
        let lastRendered: WorkflowCanvasToolbarItem | null = null;
        visible.forEach((item: WorkflowCanvasToolbarItem) => {
            const definition: ToolbarButtonDefinition | undefined = definitionByItem.get(item);
            if (!definition) {
                return;
            }
            const separatorGroupKey: string | undefined = lastRendered
                ? separatorGroupKeys.get(lastRendered)
                : undefined;
            if (separatorGroupKey) {
                items.push(this.createSeparator(separatorGroupKey));
            }
            this.itemActions.set(definition.item, definition.action);
            const model: ItemModel = this.createItem(definition);
            this.itemModels.set(definition.item, model);
            items.push(model);
            lastRendered = item;
        });

        this.toolbar = new Toolbar({
            // `auto` keeps the Toolbar sized to its items so the existing
            // floating `e-wf-canvas-toolbar` overlay positioning is
            // preserved rather than stretching across the canvas.
            width: 'auto',
            items: items,
            clicked: (args: ClickEventArgs) => this.onClick(args)
        });
        this.toolbar.appendTo(this.toolbarElement);
        this.applyAccessibleNames();
        this.initializeTooltip();
    }

    /**
     * Routes a Toolbar click to the command registered for the item.
     *
     * @param {ClickEventArgs} args The Toolbar click arguments.
     * @returns {void}
     */
    private onClick(args: ClickEventArgs): void {
        const id: string = args && args.item ? String(args.item.id || '') : '';
        if (!id) {
            return;
        }
        let matched: (() => void) | null = null;
        this.itemActions.forEach((action: () => void, item: WorkflowCanvasToolbarItem) => {
            if (this.itemId(item) === id) {
                matched = action;
            }
        });
        if (matched) {
            (matched as () => void)();
        }
    }

    /**
     * Returns the stable DOM id used for a Toolbar item.
     *
     * @param {WorkflowCanvasToolbarItem} item The command item.
     * @returns {string} The item id.
     */
    private itemId(item: WorkflowCanvasToolbarItem): string {
        return `e-wf-canvas-toolbar-item-${item.toLowerCase()}`;
    }

    /**
     * Applies the accessible name and tooltip text to each rendered item.
     *
     * @returns {void}
     */
    private applyAccessibleNames(): void {
        this.renderedLabels.forEach((label: string, item: WorkflowCanvasToolbarItem) => {
            this.setItemAccessibleName(item, label);
        });
    }

    /**
     * Returns the rendered `.e-toolbar-item` element for a command.
     *
     * @param {WorkflowCanvasToolbarItem} item The command item.
     * @returns {HTMLElement | null} The item element, or null when not rendered.
     */
    private itemElement(item: WorkflowCanvasToolbarItem): HTMLElement | null {
        if (!this.toolbar || !this.toolbar.element) {
            return null;
        }
        return this.toolbar.element.querySelector(`#${this.itemId(item)}`);
    }

    /**
     * Builds a single Toolbar item model.
     *
     * @param {ToolbarButtonDefinition} definition The button definition.
     * @returns {ItemModel} The item model.
     */
    private createItem(definition: ToolbarButtonDefinition): ItemModel {
        const label: string = this.l10n.getConstant(definition.labelKey);
        this.renderedLabels.set(definition.item, label);
        this.itemShortcuts.set(definition.item, definition.shortcut || '');
        // No `tooltipText`: the Toolbar would render it as a `title` and the browser would show its own
        // tooltip next to ours. The themed tooltip reads `data-wf-tooltip` instead.
        return {
            id: this.itemId(definition.item),
            prefixIcon: `e-icons ${definition.icon} e-wf-toolbar-icon`,
            cssClass:
                `e-wf-toolbar-button e-wf-canvas-toolbar-button e-wf-canvas-toolbar-${definition.item.toLowerCase()}`
        };
    }

    /**
     * Builds a vertical separator between toolbar groups.
     *
     * @param {string} groupKey Logical group name used as a CSS class hook.
     * @returns {ItemModel} The separator item model.
     */
    private createSeparator(groupKey: string): ItemModel {
        return {
            type: 'Separator',
            cssClass: `e-wf-canvas-toolbar-separator e-wf-canvas-toolbar-separator-${groupKey}`
        };
    }

    /**
     * Applies updated canvas toolbar settings without leaking previous buttons.
     *
     * @param {WorkflowCanvasToolbarSettingsModel} settings Updated settings.
     * @returns {void}
     * @private
     */
    public applySettings(settings?: WorkflowCanvasToolbarSettingsModel): void {
        this.settings = settings || {};
        this.create();
    }

    /**
     * Enables or disables editing controls at runtime.
     *
     * @param {boolean} readOnly Whether editing controls are disabled.
     * @returns {void}
     * @private
     */
    public setReadOnly(readOnly: boolean): void {
        const editing: WorkflowCanvasToolbarItem[] = ['Add', 'StickyNote', 'Clear'];
        editing.forEach((item: WorkflowCanvasToolbarItem) => {
            const model: ItemModel | undefined = this.itemModels.get(item);
            if (!model || !this.toolbar) {
                return;
            }
            const itemIndex: number = this.toolbar.items.findIndex(
                (toolbarItem: ItemModel) => toolbarItem.id === model.id
            );
            if (itemIndex >= 0) {
                // Disable by index (not the element) so the EJ2 Toolbar adds
                // `e-overlay` to the `.e-toolbar-item` wrapper. Only then does
                // the Toolbar's own click handler suppress the `clicked` event,
                // keeping locked editing commands non-functional.
                this.toolbar.enableItems(itemIndex, !readOnly);
            }
            const element: HTMLElement | null = this.itemElement(item);
            if (element) {
                const button: HTMLElement | null = element.querySelector('.e-tbar-btn');
                (button || element).setAttribute('aria-disabled', String(readOnly));
            }
            model.disabled = readOnly;
        });
    }

    /**
     * Updates the enabled state of the Add button based on step collection settings.
     *
     * @returns {void}
     * @private
     */
    public updateAddButtonState(): void {
        const isAddButtonDisabled: boolean = this.stepCollectionSettings && this.stepCollectionSettings.visible === false;
        const item: WorkflowCanvasToolbarItem = 'Add';
        const model: ItemModel | undefined = this.itemModels.get(item);
        if (!model || !this.toolbar) {
            return;
        }
        const element: HTMLElement | null = this.itemElement(item);
        if (element) {
            // The rendered element is passed rather than an index so
            // `toolbar.items` is never indexed with a variable.
            this.toolbar.enableItems(element, !isAddButtonDisabled);
            const button: HTMLElement | null = element.querySelector('.e-tbar-btn');
            (button || element).setAttribute('aria-disabled', String(isAddButtonDisabled));
        }
        model.disabled = isAddButtonDisabled;
    }

    /**
     * Removes the toolbar and its event handlers.
     *
     * @returns {void}
     * @private
     */
    public destroy(): void {
        if (this.tooltip) {
            this.tooltip.destroy();
            this.tooltip = null;
        }
        if (this.toolbar) {
            this.toolbar.destroy();
            this.toolbar = null;
        }
        if (this.element) {
            this.element.remove();
            this.element = null;
        }
        this.toolbarElement = null;
        this.itemActions.clear();
        this.itemModels.clear();
        this.renderedLabels.clear();
    }

    /**
     * Refreshes every rendered canvas-toolbar string after the host swaps
     * the L10n instance in the service locator. Updates the region
     * `aria-label`, each item's tooltip text and each rendered
     * `aria-label`.
     *
     * @returns {void}
     * @private
     */
    public setLocale(): void {
        this.l10n = this.serviceLocator.getService<L10n>('localization');
        this.definitions().forEach((definition: ToolbarButtonDefinition) => {
            if (!this.itemModels.has(definition.item)) {
                return;
            }
            const label: string = this.l10n.getConstant(definition.labelKey);
            this.renderedLabels.set(definition.item, label);
            this.setItemAccessibleName(definition.item, label);
        });
    }

    /**
     * Sets the accessible name on a rendered Toolbar item.
     *
     * @param {WorkflowCanvasToolbarItem} item The command item.
     * @param {string} label The accessible name.
     * @returns {void}
     */
    private setItemAccessibleName(item: WorkflowCanvasToolbarItem, label: string): void {
        const element: HTMLElement | null = this.itemElement(item);
        if (!element) {
            return;
        }
        const button: HTMLElement | null = element.querySelector('.e-tbar-btn');
        const target: HTMLElement = button || element;
        target.setAttribute('aria-label', label);
        const shortcut: string = this.itemShortcuts.get(item) || '';
        target.setAttribute('data-wf-tooltip', shortcut ? label + ' (' + shortcut + ')' : label);
        target.removeAttribute('title');
        element.removeAttribute('title');
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
            target: '.e-wf-canvas-toolbar [data-wf-tooltip]',
            position: 'BottomCenter',
            opensOn: 'Hover',
            beforeRender: (args: { target: HTMLElement }) => {
                if (this.tooltip && args && args.target) {
                    this.tooltip.content = args.target.getAttribute('data-wf-tooltip') || '';
                }
            }
        });
        this.tooltip.appendTo(this.element);
    }

    /**
     * Builds the toolbar button definitions.
     *
     * @returns {ToolbarButtonDefinition[]} The toolbar definitions.
     */
    private definitions(): ToolbarButtonDefinition[] {
        return [
            {
                item: 'Add',
                icon: 'e-plus',
                labelKey: 'addNode',
                action: () => {
                    if (this.stepCollectionSettings && this.stepCollectionSettings.visible === false) {
                        return;
                    }
                    this.toggleNodeCollection(false);
                }
            },
            {
                item: 'Select',
                icon: 'e-mouse-pointer',
                labelKey: 'select',
                action: () => this.diagram.tool = DiagramTools.SingleSelect,
                shortcut: 'S'
            },
            {
                item: 'Pan',
                icon: 'e-pan',
                labelKey: 'pan',
                action: () => this.diagram.tool = DiagramTools.ZoomPan,
                shortcut: 'P'
            },
            {
                item: 'StickyNote',
                icon: 'e-add-notes',
                labelKey: 'addStickyNote',
                action: () => this.addStickyNote(),
                shortcut: 'Shift+S'
            },
            {
                item: 'ZoomOut',
                icon: 'e-zoom-out',
                labelKey: 'zoomOut',
                action: () => this.diagram.zoomTo({ type: 'ZoomOut', zoomFactor: 0.2 }),
                shortcut: 'Ctrl+−'
            },
            {
                item: 'ZoomIn',
                icon: 'e-zoom-in',
                labelKey: 'zoomIn',
                action: () => this.diagram.zoomTo({ type: 'ZoomIn', zoomFactor: 0.2 }),
                shortcut: 'Ctrl++'
            },
            {
                item: 'Fit',
                icon: 'e-zoom-to-fit',
                labelKey: 'fit',
                action: () => this.diagram.fitToPage(),
                shortcut: 'Ctrl+1'
            },
            {
                item: 'ResetZoom',
                icon: 'e-reset',
                labelKey: 'resetZoom',
                action: () => this.resetZoom(),
                shortcut: 'Ctrl+0'
            },
            {
                item: 'Clear',
                icon: 'e-trash',
                labelKey: 'clearDiagram',
                action: () => {
                    if (this.clearWorkflow) {
                        this.clearWorkflow();
                    }
                },
                shortcut: 'Ctrl+Backspace'
            }
        ];
    }

    /**
     * Resets the Diagram zoom.
     *
     * @returns {void}
     */
    private resetZoom(): void {
        const currentZoom: number = this.diagram.scrollSettings.currentZoom || 1;
        this.diagram.zoomTo({ zoomFactor: 1 / currentZoom });
        this.diagram.reset();
    }
}
