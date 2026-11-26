import { isNullOrUndefined, L10n, EventHandler, remove, KeyboardEventArgs, extend } from '@syncfusion/ej2-base';
import { IGrid, IAction, ToolPanelModel, ToolPanelEventArgs, EJ2Intance, ToolPanelColumnDropEventArgs } from '../base/interface';
import { ServiceLocator } from '../services/service-locator';
import { ToolPanelPosition, ToolPanelType } from '../base/enum';
import { Column } from '../models/column';
import { ToolpanelSettingsModel } from '../models/models';
import { ShowHide } from './show-hide';
import { Grid } from '../base/grid';
import { CheckBox, ChipList, ChipModel, ClickEventArgs, DeleteEventArgs } from '@syncfusion/ej2-buttons';
import { FormValidator } from '@syncfusion/ej2-inputs';
import { DataUtil } from '@syncfusion/ej2-data';
import { Sidebar, Accordion, ExpandEventArgs, ContextMenu, MenuEventArgs } from '@syncfusion/ej2-navigations';
import { Filter } from './filter';
import { getComplexFieldID, getParsedFieldID } from '../base/util';
import * as events from '../base/constant';

const DEFAULT_AGG_TYPES: string[] = ['Sum', 'Average', 'Min', 'Max', 'Count', 'TrueCount', 'FalseCount'];

interface BuiltInPanel { id: string; type: ToolPanelType; text: string; icon: string }

const BUILT_IN: { [key: string]: BuiltInPanel } = {
    Columns: { id: 'columns', type: 'Columns', text: 'ToolPanelColumns', icon: 'e-columnchooser-btn' },
    Filters: { id: 'filters', type: 'Filters', text: 'ToolPanelFilters', icon: 'e-icon-filter' },
    Edit: { id: 'edit', type: 'Edit', text: 'ToolPanelEdit', icon: 'e-edit' }
};

/**
 * The `SideBar` module renders a docked, collapsible side bar with a vertical button strip and tool panels.
 */
export class SideBar implements IAction {
    private parent: IGrid;
    private serviceLocator: ServiceLocator;
    private l10n: L10n;
    private root: HTMLElement;
    private strip: HTMLElement;
    private panelHost: HTMLElement;
    private panelContent: HTMLElement;
    private sidebarObj: Sidebar;
    private panelWrap: HTMLElement;
    private panels: ToolPanelModel[] = [];
    private rendered: { [id: string]: HTMLElement } = {};
    private openedId: string = null;
    private isSidebarVisible: boolean = true;
    private lastFocus: HTMLElement = null;
    private accordions: Accordion[] = [];
    private filterAccordion: Accordion;
    private filterFields: string[] = [];
    private filterCols: Column[] = [];
    private filterItems: { [index: number]: { instance: { closeDialog: Function }, closing: boolean } } = {};
    private editForms: HTMLElement[] = [];
    private editValidators: FormValidator[] = [];
    private editTimer: number;
    private editApplying: boolean = false;
    private editRestoreTimer: number;
    private editRestore: () => void;
    private selectionHandler: () => void = this.onSelectionChanged.bind(this);
    private editKey: string;
    private editBody: HTMLElement;
    private zoneChipLists: { [zone: string]: ChipList } = {};
    private zoneElements: { [zone: string]: HTMLElement } = {};
    private aggregateTypeMenu: ContextMenu;
    private managedAggregateTypes: { [field: string]: string } = {};
    private managedAggregateRowIndex: number = -1;
    private zoneDataBoundHandler: () => void = this.onGroupOrAggregateChanged.bind(this, { requestType: 'grouping' });
    private zoneActionHandler: (e: { requestType?: string }) => void = this.onGroupOrAggregateChanged.bind(this);

    /**
     * Constructor for the Grid SideBar module.
     *
     * @param {IGrid} parent - specifies the IGrid
     * @param {ServiceLocator} serviceLocator - specifies the serviceLocator
     * @hidden
     */
    constructor(parent?: IGrid, serviceLocator?: ServiceLocator) {
        this.parent = parent;
        this.serviceLocator = serviceLocator;
        this.addEventListener();
    }

    /**
     * @returns {void}
     * @hidden
     */
    public addEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.on(events.initialEnd, this.render, this);
        this.parent.on(events.destroy, this.destroy, this);
        this.parent.on(events.toolPanelPropertyChanged, this.onPropertyChanged, this);
        this.parent.on(events.columnVisibilityChanged, this.refreshColumns, this);
        this.parent.on(events.rtlUpdated, this.updateLayout, this);
        this.parent.on(events.toolPanelFilterDialogOpen, this.onFilterDialogOpen, this);
        this.parent.addEventListener(events.rowSelected, this.selectionHandler);
        this.parent.addEventListener(events.rowDeselected, this.selectionHandler);
        this.parent.on(events.contentReady, this.onContentReady, this);
    }

    /**
     * @returns {void}
     * @hidden
     */
    public removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off(events.initialEnd, this.render);
        this.parent.off(events.destroy, this.destroy);
        this.parent.off(events.toolPanelPropertyChanged, this.onPropertyChanged);
        this.parent.off(events.columnVisibilityChanged, this.refreshColumns);
        this.parent.off(events.rtlUpdated, this.updateLayout);
        this.parent.off(events.toolPanelFilterDialogOpen, this.onFilterDialogOpen);
        this.parent.removeEventListener(events.rowSelected, this.selectionHandler);
        this.parent.removeEventListener(events.rowDeselected, this.selectionHandler);
        this.parent.off(events.contentReady, this.onContentReady);
    }

    private getModuleName(): string {
        return 'sideBar';
    }

    private text(key: string, fallback: string): string {
        const value: string = this.l10n ? this.l10n.getConstant(key) : '';
        return value || fallback;
    }

    private resolvePanels(): ToolPanelModel[] {
        const result: ToolPanelModel[] = [];
        const ids: string[] = [];
        const list: (string | ToolPanelModel)[] = this.parent.toolPanelSettings.toolPanels || [];
        for (const item of list) {
            let model: ToolPanelModel;
            if (typeof item === 'string') {
                const built: BuiltInPanel = BUILT_IN[`${item}`];
                if (!built) { continue; }
                model = { id: built.id, type: built.type, headerText: this.text(built.text, built.text.replace('ToolPanel', '')), iconCss: built.icon };
            } else {
                model = { ...item };
                const built: BuiltInPanel = BUILT_IN[model.type as string];
                if (built) {
                    model.headerText = model.headerText || this.text(built.text, built.text.replace('ToolPanel', ''));
                    model.iconCss = model.iconCss || built.icon;
                    model.id = model.id || built.id;
                } else {
                    model.type = 'Custom';
                }
            }
            if (ids.indexOf(model.id) !== -1) {
                this.parent.log('sidebar_duplicate_panel', { id: model.id });
                continue;
            }
            if (model.visible === false) { continue; }
            if (model.type === 'Edit' && !this.isEditAllowed()) { continue; }
            ids.push(model.id);
            result.push(model);
        }
        return result;
    }

    private render(): void {
        if (!this.parent.enableToolPanel || this.root) { return; }
        this.l10n = this.serviceLocator.getService<L10n>('localization');
        this.panels = this.resolvePanels();
        this.root = this.parent.createElement('div', { className: 'e-toolpanel' });
        this.strip = this.parent.createElement('div', {
            className: 'e-toolpanel-strip',
            attrs: { role: 'tablist', 'aria-orientation': 'vertical', 'aria-label': this.text('SideBarLabel', 'Grid tool panels') }
        });
        this.panelWrap = this.parent.createElement('div', { className: 'e-toolpanel-wrap' });
        this.panelHost = this.parent.createElement('aside', {
            id: this.parent.element.id + '_toolpanel_sidebar', className: 'e-toolpanel-content'
        });
        this.panelContent = this.parent.createElement('div', { className: 'e-toolpanel-tabpanel', attrs: { role: 'tabpanel' } });
        this.panelHost.appendChild(this.panelContent);
        this.panelWrap.appendChild(this.panelHost);
        this.root.appendChild(this.panelWrap);
        this.root.appendChild(this.strip);
        this.parent.element.appendChild(this.root);
        this.parent.element.classList.add('e-toolpanel-enabled');
        this.restoreManagedAggregates();
        const cfg: ToolpanelSettingsModel = this.parent.toolPanelSettings;
        // The EJ2 Sidebar slides inside the wrap (its target), which sits directly beside the strip, so there is no gap.
        this.sidebarObj = new Sidebar({
            target: this.panelWrap,
            type: 'Over',
            position: this.isDockedLeft() ? 'Left' : 'Right',
            width: cfg.width,
            isOpen: false,
            animate: false,
            enableGestures: false,
            closeOnDocumentClick: false,
            showBackdrop: false
        });
        this.sidebarObj.appendTo(document.getElementById(this.panelHost.id) ? '#' + this.panelHost.id : this.panelHost);
        this.panelHost.setAttribute('aria-hidden', 'true');
        this.panels.forEach((panel: ToolPanelModel) => this.strip.appendChild(this.createButton(panel)));
        EventHandler.add(this.strip, 'click', this.stripClick, this);
        EventHandler.add(this.root, 'keydown', this.keyDown, this);
        this.isSidebarVisible = !this.parent.toolPanelSettings.hiddenByDefault;
        this.applyVisibility();
        const def: string = this.parent.toolPanelSettings.defaultToolPanel;
        if (def && this.isSidebarVisible) { this.openToolPanel(def); }
    }

    private createButton(panel: ToolPanelModel): HTMLElement {
        const btn: HTMLElement = this.parent.createElement('button', {
            className: 'e-toolpanel-btn',
            attrs: {
                type: 'button', role: 'tab', 'data-panel': panel.id, 'aria-selected': 'false',
                'aria-controls': this.parent.element.id + '_toolpanel_' + panel.id,
                title: panel.tooltip || panel.headerText
            }
        });
        if (panel.iconCss) {
            btn.appendChild(this.parent.createElement('span', { className: 'e-toolpanel-icon e-icons ' + panel.iconCss }));
        }
        const label: HTMLElement = this.parent.createElement('span', { className: 'e-toolpanel-text' });
        label.textContent = panel.headerText;
        btn.appendChild(label);
        return btn;
    }

    private getPanel(id: string): ToolPanelModel {
        return this.panels.filter((p: ToolPanelModel) => p.id === id)[0];
    }

    private stripClick(e: MouseEvent): void {
        const btn: HTMLElement = (e.target as HTMLElement).closest('.e-toolpanel-btn') as HTMLElement;
        if (!btn) { return; }
        const id: string = btn.getAttribute('data-panel');
        this.lastFocus = btn;
        if (this.openedId === id) { this.closeToolPanel(); } else { this.openToolPanel(id); }
    }

    private keyDown(e: KeyboardEventArgs): void {
        if (e.key === 'Escape' && this.openedId) {
            e.preventDefault();
            this.closeToolPanel();
        }
    }

    private args(panel: ToolPanelModel, previousId?: string): ToolPanelEventArgs {
        return { id: panel.id, type: panel.type, element: this.panelHost, cancel: false, previousId: previousId || undefined };
    }

    /**
     * Opens the tool panel with the given id.
     *
     * @param {string} id - panel id
     * @returns {void}
     * @hidden
     */
    public openToolPanel(id: string): void {
        if (!this.root || this.parent.isDestroyed || !this.isSidebarVisible) { return; }
        const panel: ToolPanelModel = this.getPanel(id);
        if (!panel) {
            this.parent.log('sidebar_panel_not_found', { id });
            return;
        }
        if (this.openedId === id) { return; }
        const previous: string = this.openedId;
        const args: ToolPanelEventArgs = this.args(panel, previous);
        this.parent.trigger('toolPanelOpen', args);
        if (args.cancel) { return; }
        this.openedId = id;
        if (id === 'columns' && this.parent.columnChooserModule) {
            this.parent.columnChooserModule.closeDialogIfOpen();
        }
        // The panel is shown first so the edit editors, which check their cell width, are written into a visible element.
        this.sidebarObj.show();
        this.panelHost.setAttribute('aria-hidden', 'false');
        this.showBody(panel);
        this.updateButtons();
        this.updateLayout();
        const first: HTMLElement = this.panelHost.querySelector('input, button, [tabindex]') as HTMLElement;
        if (first) { first.focus(); }
        this.parent.trigger('toolPanelOpened', this.args(panel, previous));
    }

    /**
     * Closes the opened tool panel.
     *
     * @returns {void}
     * @hidden
     */
    public closeToolPanel(): void {
        if (!this.root || !this.openedId) { return; }
        const panel: ToolPanelModel = this.getPanel(this.openedId);
        const args: ToolPanelEventArgs = this.args(panel);
        this.parent.trigger('toolPanelClose', args);
        if (args.cancel) { return; }
        this.openedId = null;
        if (panel.id === 'columns' && this.rendered['columns'] && this.rendered['columns'].classList.contains('e-toolpanel-chooser')) {
            this.parent.columnChooserModule.releaseToolPanelChooser();
            this.releaseZones();
            delete this.rendered['columns'];
        }
        this.sidebarObj.hide();
        this.panelHost.setAttribute('aria-hidden', 'true');
        this.updateButtons();
        this.updateLayout();
        if (this.lastFocus) { this.lastFocus.focus(); }
        this.parent.trigger('toolPanelClosed', this.args(panel));
    }

    /**
     * Shows or hides the whole side bar.
     *
     * @param {boolean} show - show or hide
     * @returns {void}
     * @hidden
     */
    public toggleSideBar(show?: boolean): void {
        if (!this.root) { return; }
        this.isSidebarVisible = isNullOrUndefined(show) ? !this.isSidebarVisible : show;
        if (!this.isSidebarVisible && this.openedId) { this.closeToolPanel(); }
        this.applyVisibility();
    }

    /**
     * @returns {string | null} - opened panel id
     * @hidden
     */
    public getOpenedToolPanel(): string | null {
        return this.openedId;
    }

    /**
     * @returns {boolean} - whether a panel is open
     * @hidden
     */
    public isToolPanelShowing(): boolean {
        return !!this.openedId;
    }

    /**
     * Re-renders the panel body.
     *
     * @param {string} id - panel id
     * @returns {void}
     * @hidden
     */
    public refreshToolPanel(id?: string): void {
        const target: string = id || this.openedId;
        if (!this.root || !target) { return; }
        delete this.rendered[`${target}`];
        this.destroyAccordions();
        if (target === this.openedId) { this.showBody(this.getPanel(target)); }
    }

    /**
     * @param {ToolPanelPosition} position - dock edge
     * @returns {void}
     * @hidden
     */
    public setSideBarPosition(position: ToolPanelPosition): void {
        if (position !== 'Left' && position !== 'Right') {
            this.parent.log('sidebar_invalid_position', { position });
            return;
        }
        this.parent.toolPanelSettings.position = position;
        this.onPropertyChanged();
    }

    private showBody(panel: ToolPanelModel): void {
        this.panelContent.setAttribute('id', this.parent.element.id + '_toolpanel_' + panel.id);
        this.panelContent.setAttribute('aria-label', panel.headerText);
        while (this.panelContent.firstChild) { this.panelContent.removeChild(this.panelContent.firstChild); }
        let body: HTMLElement = this.rendered[panel.id];
        const created: boolean = !body;
        if (created) {
            body = this.parent.createElement('div', { className: 'e-toolpanel-body e-toolpanel-' + panel.type.toLowerCase() });
            this.rendered[panel.id] = body;
        }
        // The body is attached before it is rendered: the edit editors disable themselves when their cell has no width.
        this.panelContent.appendChild(body);
        if (created) {
            this.renderBody(panel, body);
            this.parent.trigger('toolPanelCreated', { id: panel.id, element: body });
        } else if (panel.type === 'Edit') {
            this.refreshEdit();
        }
    }

    private renderBody(panel: ToolPanelModel, body: HTMLElement): void {
        if (panel.type === 'Columns') {
            this.renderColumns(body);
        } else if (panel.type === 'Filters') {
            this.renderFilters(body);
        } else if (panel.type === 'Edit') {
            this.renderEdit(body);
        } else if (panel.type === 'Custom' && panel.template) {
            if (typeof panel.template === 'function') {
                const out: string | HTMLElement = (panel.template as Function)({ grid: this.parent, panel: panel });
                if (typeof out === 'string') { body.innerHTML = out; } else if (out) { body.appendChild(out); }
            } else {
                body.innerHTML = panel.template;
            }
        }
    }

    private isChooserPanel(): boolean {
        const cc: { isToolPanelChooserEnabled?: () => boolean } = this.parent.columnChooserModule;
        return !!cc && !!cc.isToolPanelChooserEnabled && cc.isToolPanelChooserEnabled();
    }

    private renderChooserPanel(body: HTMLElement): void {
        body.classList.add('e-toolpanel-chooser');
        const host: HTMLElement = this.parent.createElement('div', { className: 'e-toolpanel-cc-region' });
        body.appendChild(host);
        this.parent.columnChooserModule.renderToolPanelColumnChooser(host);
        const showGroup: boolean = this.isZoneAvailable('Group');
        const showAgg: boolean = this.isZoneAvailable('Aggregate');
        if (!showGroup && !showAgg) {
            host.classList.add('e-toolpanel-cc-full');
            return;
        }
        const zones: HTMLElement = this.parent.createElement('div', { className: 'e-toolpanel-zones' });
        body.appendChild(zones);
        if (showGroup) { this.renderZone(zones, 'Group'); }
        if (showAgg) { this.renderZone(zones, 'Aggregate'); }
        this.parent.addEventListener(events.actionComplete, this.zoneActionHandler);
        this.parent.addEventListener(events.dataBound, this.zoneDataBoundHandler);
    }

    private columnsPanel(): ToolPanelModel {
        return this.getPanel('columns') || this.panels.filter((p: ToolPanelModel) => p.type === 'Columns')[0] || { id: 'columns' };
    }

    private getAggregateTypes(): string[] {
        const types: string[] = this.columnsPanel().aggregateTypes;
        return types ? types.filter((t: string) => t !== 'Custom') : DEFAULT_AGG_TYPES;
    }

    private isZoneAvailable(zone: string): boolean {
        const columnsPanelModel: ToolPanelModel = this.columnsPanel();
        if (zone === 'Group') {
            const hasGroupModule: boolean = !!(this.parent as unknown as { groupModule?: unknown }).groupModule;
            return columnsPanelModel.showGroupDropArea !== false && !!this.parent.allowGrouping && hasGroupModule;
        }
        const isAggregateInjected: boolean = this.parent.getInjectedModules().some(
            (injectedModule: Function) => injectedModule.prototype.getModuleName() === 'aggregate');
        if (columnsPanelModel.showAggregateDropArea === false || !isAggregateInjected) { return false; }
        return true;
    }

    private getValidAggregateTypes(column: Column): string[] {
        const aggregateTypesByColumnType: { [type: string]: string[] } = {
            number: ['Sum', 'Average', 'Min', 'Max', 'Count'],
            boolean: ['TrueCount', 'FalseCount', 'Count'],
            date: ['Min', 'Max', 'Count'],
            datetime: ['Min', 'Max', 'Count']
        };
        const validTypesForColumn: string[] = aggregateTypesByColumnType[column.type as string] || ['Count'];
        const allowedTypes: string[] = this.getAggregateTypes();
        return validTypesForColumn.filter((aggregateType: string) => allowedTypes.indexOf(aggregateType) > -1);
    }

    private renderZone(zonesContainer: HTMLElement, zone: string): void {
        const zoneElement: HTMLElement = this.parent.createElement('div', {
            className: 'e-toolpanel-zone e-toolpanel-zone-' + zone.toLowerCase(), attrs: { 'data-zone': zone }
        });
        const titleElement: HTMLElement = this.parent.createElement('div', { className: 'e-toolpanel-zone-title' });
        titleElement.appendChild(this.parent.createElement('span', {
            className: 'e-icons e-toolpanel-zone-icon ' + (zone === 'Group' ? 'e-icon-group' : 'e-icon-aggregate'), attrs: { 'aria-hidden': 'true' }
        }));
        titleElement.appendChild(this.parent.createElement('span', {
            className: 'e-toolpanel-zone-text',
            innerHTML: ''
        }));
        (titleElement.lastChild as HTMLElement).textContent = zone === 'Group' ? this.text('ToolPanelRowGroups', 'Row Groups') :
            this.text('ToolPanelValues', 'Values');
        zoneElement.appendChild(titleElement);
        const dropBox: HTMLElement = this.parent.createElement('div', { className: 'e-toolpanel-zone-box' });
        dropBox.appendChild(this.parent.createElement('span', { className: 'e-toolpanel-zone-placeholder' }));
        (dropBox.firstChild as HTMLElement).textContent = zone === 'Group' ? this.text('ToolPanelGroupDropArea', 'Drag here to group its column') :
            this.text('ToolPanelAggregateDropArea', 'Drag here to aggregate its column');
        zoneElement.appendChild(dropBox);
        zonesContainer.appendChild(zoneElement);
        this.zoneElements[`${zone}`] = zoneElement;
        this.renderChips(zone);
    }

    private renderChips(zone: string): void {
        const zoneElement: HTMLElement = this.zoneElements[`${zone}`];
        if (!zoneElement) { return; }
        const previousChipList: ChipList = this.zoneChipLists[`${zone}`];
        if (previousChipList && !previousChipList.isDestroyed) { previousChipList.destroy(); }
        const dropBox: HTMLElement = zoneElement.querySelector('.e-toolpanel-zone-box') as HTMLElement;
        [].slice.call(dropBox.querySelectorAll('.e-toolpanel-chips')).forEach((chipHostElement: Element) => remove(chipHostElement));
        const chipItems: ChipModel[] = [];
        const readOnlyChipItems: ChipModel[] = [];
        if (zone === 'Group') {
            this.parent.groupSettings.columns.forEach((field: string) => {
                const column: Column = this.parent.getColumnByField(field) as Column;
                chipItems.push({ text: column ? (column.headerText || column.field) : field, value: field });
            });
        } else {
            this.syncManagedFromGrid();
            Object.keys(this.managedAggregateTypes).forEach((field: string) => {
                const column: Column = this.parent.getColumnByField(field) as Column;
                if (!column) { return; }
                const columnText: string = column.headerText || column.field;
                chipItems.push({
                    text: columnText, value: field,
                    htmlAttributes: {
                        title: this.managedAggregateTypes[`${field}`],
                        'aria-label': columnText + ': ' + this.managedAggregateTypes[`${field}`]
                    }
                });
            });
            this.parent.aggregates.forEach(
                (aggregateRow: { columns?: { field?: string, type?: string | string[] }[] }, rowIndex: number) => {
                    if (rowIndex === this.managedAggregateRowIndex) { return; }
                    (aggregateRow.columns || []).forEach((aggregateColumn: { field?: string, type?: string | string[] }) => {
                        const column: Column = this.parent.getColumnByField(aggregateColumn.field) as Column;
                        const aggregateTypeDescription: string = [].concat(aggregateColumn.type as string[]).join(', ');
                        readOnlyChipItems.push({
                            text: (column ? (column.headerText || column.field) : aggregateColumn.field),
                            value: aggregateColumn.field,
                            htmlAttributes: { 'aria-disabled': 'true', title: aggregateTypeDescription }
                        });
                    });
                });
        }
        dropBox.classList.toggle('e-toolpanel-zone-filled', !!(chipItems.length || readOnlyChipItems.length));
        if (chipItems.length) {
            const chipsHost: HTMLElement = this.parent.createElement('div', { className: 'e-toolpanel-chips' });
            dropBox.appendChild(chipsHost);
            const chipList: ChipList = new ChipList({
                chips: chipItems, enableDelete: true, enableRtl: this.parent.enableRtl,
                click: (args: ClickEventArgs) => { if (zone === 'Aggregate') { this.openAggregateTypeMenu(args); } },
                delete: (args: DeleteEventArgs) => {
                    args.cancel = true;
                    this.removeFromZone(zone, (args.data as ChipModel).value as string);
                }
            }, chipsHost);
            this.zoneChipLists[`${zone}`] = chipList;
        }
        if (readOnlyChipItems.length) {
            const readOnlyChipsHost: HTMLElement = this.parent.createElement('div', { className: 'e-toolpanel-chips e-toolpanel-chips-readonly' });
            dropBox.appendChild(readOnlyChipsHost);
            new ChipList({ chips: readOnlyChipItems, enableRtl: this.parent.enableRtl, cssClass: 'e-toolpanel-chip-readonly' }, readOnlyChipsHost);
        }
    }

    /**
     * Returns the aggregates managed by the Columns tool panel, for persistence.
     *
     * @returns {Object[]} one `{ field, type }` entry per column
     * @hidden
     */
    public getManagedAggregates(): { field: string, type: string }[] {
        this.syncManagedFromGrid();
        return Object.keys(this.managedAggregateTypes).map((field: string) => ({ field: field, type: this.managedAggregateTypes[`${field}`] }));
    }

    private restoreManagedAggregates(): void {
        const storedAggregates: { field: string, type: string }[] = this.parent.toolPanelAggregates;
        this.parent.toolPanelAggregates = undefined;
        if (!this.parent.enablePersistence || !Array.isArray(storedAggregates) || !storedAggregates.length ||
            !this.isZoneAvailable('Aggregate')) { return; }
        storedAggregates.forEach((entry: { field: string, type: string }) => {
            const column: Column = entry && this.parent.getColumnByField(entry.field) as Column;
            if (column && this.getValidAggregateTypes(column).indexOf(entry.type) > -1) {
                this.managedAggregateTypes[entry.field] = entry.type;
            }
        });
        if (Object.keys(this.managedAggregateTypes).length) { this.applyAggregates(); }
    }

    private syncManagedFromGrid(): void {
        const aggregateRows: { columns?: { field?: string, type?: string | string[] }[] }[] = this.parent.aggregates as never;
        if (this.managedAggregateRowIndex > -1 && aggregateRows[this.managedAggregateRowIndex]) {
            const aggregateTypeByField: { [field: string]: string } = {};
            (aggregateRows[this.managedAggregateRowIndex].columns || []).forEach(
                (aggregateColumn: { field?: string, type?: string | string[] }) => {
                    aggregateTypeByField[aggregateColumn.field] = [].concat(aggregateColumn.type as string[])[0];
                });
            this.managedAggregateTypes = aggregateTypeByField;
        }
    }

    private applyAggregates(): void {
        const aggregateRows: unknown[] = (this.parent.aggregates as unknown[]).filter(
            (aggregateRow: unknown, rowIndex: number) => rowIndex !== this.managedAggregateRowIndex);
        const fields: string[] = Object.keys(this.managedAggregateTypes);
        if (fields.length) {
            aggregateRows.push({
                columns: fields.map((field: string) => {
                    const column: Column = this.parent.getColumnByField(field) as Column;
                    const aggregateType: string = this.managedAggregateTypes[`${field}`];
                    const aggregateLabel: string = this.text('ToolPanelAgg' + aggregateType, aggregateType);
                    const summaryTemplate: string = aggregateLabel + ': ${' + aggregateType + '}';
                    return {
                        field: field, type: aggregateType, format: column ? column.format : undefined,
                        footerTemplate: summaryTemplate, groupFooterTemplate: summaryTemplate, groupCaptionTemplate: summaryTemplate
                    };
                })
            });
            this.managedAggregateRowIndex = aggregateRows.length - 1;
        } else {
            this.managedAggregateRowIndex = -1;
        }
        this.parent.aggregates = aggregateRows as never;
    }

    private fireDrop(eventName: string, dropArgs: ToolPanelColumnDropEventArgs): ToolPanelColumnDropEventArgs {
        this.parent.trigger(eventName, dropArgs);
        return dropArgs;
    }

    private blockedByEdit(): boolean {
        if ((this.parent as unknown as { isEdit?: boolean }).isEdit) {
            this.parent.log('toolpanel_columns_zone', { reason: 'the drop was ignored because a row is being edited.' });
            return true;
        }
        return false;
    }

    /**
     * Whether a column can be dropped on a Columns tool panel zone.
     *
     * @param {string} zone - zone name
     * @param {Column} column - dragged column
     * @returns {boolean} - true when the drop is allowed
     * @hidden
     */
    public canDropOnZone(zone: string, column: Column): boolean {
        if (!column || !column.field) { return false; }
        if (zone === 'Group') { return column.allowGrouping !== false && !!this.zoneElements['Group']; }
        return !!this.zoneElements['Aggregate'] && this.getValidAggregateTypes(column).length > 0;
    }

    /**
     * Applies a column drop on a Columns tool panel zone.
     *
     * @param {string} zone - zone name
     * @param {Column} column - dragged column
     * @returns {void}
     * @hidden
     */
    public dropOnZone(zone: string, column: Column): void {
        if (!this.canDropOnZone(zone, column) || this.blockedByEdit()) { return; }
        if (zone === 'Group') {
            if (this.parent.groupSettings.columns.indexOf(column.field) > -1) { return; }
            const groupDropArgs: ToolPanelColumnDropEventArgs = this.fireDrop(
                'toolPanelColumnDrop', { zone: 'Group', action: 'Group', column: column, cancel: false });
            if (groupDropArgs.cancel) { return; }
            this.parent.groupColumn(column.field);
            this.fireDrop('toolPanelColumnDropped', { zone: 'Group', action: 'Group', column: column });
            return;
        }
        if (this.managedAggregateTypes[column.field]) { this.focusChip('Aggregate', column.field); return; }
        const preferredType: string = column.type === 'number' ? 'Sum' : 'Count';
        const validTypes: string[] = this.getValidAggregateTypes(column);
        const defaultType: string = validTypes.indexOf(preferredType) > -1 ? preferredType : validTypes[0];
        const aggregateDropArgs: ToolPanelColumnDropEventArgs = this.fireDrop(
            'toolPanelColumnDrop',
            { zone: 'Aggregate', action: 'AddAggregate', column: column, aggregateType: defaultType, cancel: false });
        if (aggregateDropArgs.cancel) { return; }
        const chosenType: string = validTypes.indexOf(aggregateDropArgs.aggregateType) > -1 ?
            aggregateDropArgs.aggregateType : defaultType;
        this.managedAggregateTypes[column.field] = chosenType;
        this.applyAggregates();
        this.renderChips('Aggregate');
        this.fireDrop('toolPanelColumnDropped', {
            zone: 'Aggregate', action: 'AddAggregate', column: column, aggregateType: this.managedAggregateTypes[column.field]
        });
    }

    private removeFromZone(zone: string, field: string): void {
        const column: Column = this.parent.getColumnByField(field) as Column;
        if (!column || this.blockedByEdit()) { return; }
        const action: 'Ungroup' | 'RemoveAggregate' = zone === 'Group' ? 'Ungroup' : 'RemoveAggregate';
        const dropArgs: ToolPanelColumnDropEventArgs = this.fireDrop(
            'toolPanelColumnDrop', { zone: zone as 'Group' | 'Aggregate', action: action, column: column, cancel: false });
        if (dropArgs.cancel) { return; }
        if (zone === 'Group') {
            this.parent.ungroupColumn(field);
        } else {
            delete this.managedAggregateTypes[`${field}`];
            this.applyAggregates();
            this.renderChips('Aggregate');
        }
        this.fireDrop('toolPanelColumnDropped', { zone: zone as 'Group' | 'Aggregate', action: action, column: column });
    }

    private focusChip(zone: string, field: string): void {
        const zoneElement: HTMLElement = this.zoneElements[`${zone}`];
        const chipElements: HTMLElement[] = zoneElement ? [].slice.call(zoneElement.querySelectorAll('.e-chip')) : [];
        const targetChip: HTMLElement = chipElements.filter(
            (chipElement: HTMLElement) => chipElement.getAttribute('data-value') === field)[0] || chipElements[0];
        if (targetChip) { targetChip.focus(); }
    }

    private openAggregateTypeMenu(args: ClickEventArgs): void {
        const field: string = (args.data as ChipModel).value as string;
        const column: Column = this.parent.getColumnByField(field) as Column;
        if (!column || !this.managedAggregateTypes[`${field}`]) { return; }
        this.closeAggregateTypeMenu();
        const menuContainer: HTMLUListElement = document.createElement('ul');
        document.body.appendChild(menuContainer);
        const chipRect: ClientRect = args.element.getBoundingClientRect();
        this.aggregateTypeMenu = new ContextMenu({
            cssClass: 'e-toolpanel-aggmenu',
            enableRtl: this.parent.enableRtl,
            items: this.getValidAggregateTypes(column).map((aggregateType: string) => ({
                text: this.text('ToolPanelAgg' + aggregateType, aggregateType), id: aggregateType,
                iconCss: aggregateType === this.managedAggregateTypes[`${field}`] ? 'e-icons e-icon-check' : ''
            })),
            select: (menuArgs: MenuEventArgs) => this.changeAggregate(column, menuArgs.item.id),
            onClose: () => { this.closeAggregateTypeMenu(); }
        }, menuContainer);
        this.aggregateTypeMenu.open(chipRect.bottom, this.parent.enableRtl ? chipRect.right : chipRect.left);
    }

    private closeAggregateTypeMenu(): void {
        if (!this.aggregateTypeMenu) { return; }
        const menuElement: HTMLElement = this.aggregateTypeMenu.element;
        if (!this.aggregateTypeMenu.isDestroyed) { this.aggregateTypeMenu.destroy(); }
        this.aggregateTypeMenu = null;
        if (menuElement && menuElement.parentElement) { remove(menuElement); }
    }

    private changeAggregate(column: Column, aggregateType: string): void {
        if (this.managedAggregateTypes[column.field] === aggregateType || this.blockedByEdit()) { return; }
        const dropArgs: ToolPanelColumnDropEventArgs = this.fireDrop('toolPanelColumnDrop',
                                                                     { zone: 'Aggregate', action: 'ChangeAggregate', column: column, aggregateType: aggregateType, cancel: false });
        if (dropArgs.cancel) { return; }
        this.managedAggregateTypes[column.field] = aggregateType;
        this.applyAggregates();
        this.renderChips('Aggregate');
        this.fireDrop('toolPanelColumnDropped', { zone: 'Aggregate', action: 'ChangeAggregate', column: column, aggregateType: aggregateType });
    }

    private onGroupOrAggregateChanged(actionArgs: { requestType?: string }): void {
        if (actionArgs && (actionArgs.requestType === 'grouping' || actionArgs.requestType === 'ungrouping')) {
            if (this.parent.isDestroyed || !this.zoneElements['Group'] && !this.zoneElements['Aggregate']) { return; }
            this.renderChips('Group');
            this.renderChips('Aggregate');
        }
    }

    private releaseZones(): void {
        this.closeAggregateTypeMenu();
        Object.keys(this.zoneChipLists).forEach((zoneName: string) => {
            if (this.zoneChipLists[`${zoneName}`] && !this.zoneChipLists[`${zoneName}`].isDestroyed) { this.zoneChipLists[`${zoneName}`].destroy(); }
        });
        this.zoneChipLists = {};
        this.zoneElements = {};
        if (!this.parent.isDestroyed) {
            this.parent.removeEventListener(events.actionComplete, this.zoneActionHandler);
            this.parent.removeEventListener(events.dataBound, this.zoneDataBoundHandler);
        }
    }

    private renderColumns(body: HTMLElement): void {
        if (this.isChooserPanel()) {
            this.renderChooserPanel(body);
            return;
        }
        const search: HTMLInputElement = this.parent.createElement('input', {
            className: 'e-toolpanel-search e-input',
            attrs: { type: 'text', placeholder: this.text('Search', 'Search'), 'aria-label': this.text('Search', 'Search') }
        }) as HTMLInputElement;
        const list: HTMLElement = this.parent.createElement('ul', { className: 'e-toolpanel-columns', attrs: { role: 'group' } });
        if (this.parent.columnChooserSettings.enableSearching !== false) { body.appendChild(search); }
        body.appendChild(list);
        const fill: () => void = (): void => {
            const term: string = search.value.toLowerCase();
            while (list.firstChild) { list.removeChild(list.firstChild); }
            (this.parent.getColumns() as Column[]).forEach((col: Column) => {
                if (!col.showInColumnChooser || col.type === 'checkbox') { return; }
                const text: string = col.headerText || col.field || '';
                if (term && text.toLowerCase().indexOf(term) === -1) { return; }
                const li: HTMLElement = this.parent.createElement('li', { className: 'e-toolpanel-column' });
                const input: HTMLInputElement = this.parent.createElement('input', { attrs: { type: 'checkbox' } }) as HTMLInputElement;
                input.setAttribute('data-uid', col.uid);
                li.appendChild(input);
                list.appendChild(li);
                new CheckBox({ label: text, checked: col.visible, enableRtl: this.parent.enableRtl }).appendTo(input);
            });
        };
        fill();
        (body as HTMLElement & { fill?: () => void }).fill = fill;
        EventHandler.add(search, 'input', fill, this);
        EventHandler.add(list, 'change', (e: Event) => {
            const input: HTMLInputElement = e.target as HTMLInputElement;
            const col: Column = this.parent.getColumnByUid(input.getAttribute('data-uid')) as Column;
            if (!col) { return; }
            const showHider: ShowHide = (this.parent as Grid).showHider;
            if (input.checked) { showHider.show(col.uid, 'uid'); } else { showHider.hide(col.uid, 'uid'); }
        }, this);
    }

    private refreshColumns(args?: { source?: string }): void {
        const body: HTMLElement & { fill?: () => void } = this.rendered['columns'];
        if (body && body.fill) { body.fill(); }
        if (body && body.classList.contains('e-toolpanel-chooser') && this.parent.columnChooserModule &&
            !(args && args.source === 'column-chooser')) {
            this.parent.columnChooserModule.refreshToolPanelChooser();
        }
    }

    private updateButtons(): void {
        [].slice.call(this.strip.querySelectorAll('.e-toolpanel-btn')).forEach((btn: HTMLElement) => {
            const active: boolean = btn.getAttribute('data-panel') === this.openedId;
            btn.classList.toggle('e-active', active);
            btn.setAttribute('aria-selected', active ? 'true' : 'false');
        });
    }

    private applyVisibility(): void {
        this.root.classList.toggle('e-toolpanel-hidden', !this.isSidebarVisible);
        this.updateLayout();
    }

    private isDockedLeft(): boolean {
        return (this.parent.toolPanelSettings.position === 'Left') !== this.parent.enableRtl;
    }

    private updateLayout(): void {
        if (!this.root) { return; }
        const cfg: ToolpanelSettingsModel = this.parent.toolPanelSettings;
        const left: boolean = this.isDockedLeft();
        this.root.classList.toggle('e-toolpanel-left', left);
        this.root.classList.toggle('e-toolpanel-right', !left);
        this.root.classList.toggle('e-toolpanel-over', cfg.type === 'Over');
        this.root.classList.toggle('e-toolpanel-opened', !!this.openedId);
        const stripW: number = this.isSidebarVisible ? this.strip.offsetWidth : 0;
        const panelW: number = this.openedId ? this.panelWidth() : 0;
        const el: HTMLElement = this.parent.element;
        el.classList.toggle('e-toolpanel-dock-left', left);
        el.classList.toggle('e-toolpanel-dock-right', !left);
        el.style.setProperty('--e-toolpanel-size', (cfg.type === 'Over' ? stripW : stripW + panelW) + 'px');
        this.root.style.setProperty('--e-toolpanel-panel', panelW + 'px');
    }

    private panelWidth(): number {
        const w: string | number = this.parent.toolPanelSettings.width;
        if (typeof w === 'number') { return w; }
        const probe: number = parseFloat(w);
        return isNaN(probe) ? this.sidebarObj.element.offsetWidth : (/%/.test(w) ? this.parent.element.offsetWidth * probe / 100 : probe);
    }

    private onPropertyChanged(): void {
        this.teardown();
        this.openedId = null;
        this.rendered = {};
        this.render();
    }

    private teardown(): void {
        if (!this.root) { return; }
        this.destroyAccordions();
        if (this.rendered['columns'] && this.rendered['columns'].classList.contains('e-toolpanel-chooser') && this.parent.columnChooserModule) {
            this.parent.columnChooserModule.releaseToolPanelChooser();
            this.releaseZones();
        }
        if (this.sidebarObj && !this.sidebarObj.isDestroyed) { this.sidebarObj.destroy(); }
        this.sidebarObj = null;
        EventHandler.remove(this.strip, 'click', this.stripClick);
        EventHandler.remove(this.root, 'keydown', this.keyDown);
        remove(this.root);
        this.root = null;
        this.parent.element.classList.remove('e-toolpanel-enabled');
        this.parent.element.classList.remove('e-toolpanel-dock-left', 'e-toolpanel-dock-right');
        this.parent.element.style.removeProperty('--e-toolpanel-size');
    }

    private destroy(): void {
        this.removeEventListener();
        this.teardown();
        this.rendered = {};
    }

    private destroyAccordions(): void {
        this.destroyEditContent();
        Object.keys(this.filterItems).forEach((idx: string) => this.closeFilterItem(parseInt(idx, 10)));
        this.accordions.forEach((a: Accordion) => { if (a && !a.isDestroyed) { a.destroy(); } });
        this.accordions = [];
        this.filterAccordion = null;
        this.editBody = null;
    }

    private onContentReady(): void {
        if (this.openedId === 'filters') { this.updateFilterIndicators(); }
    }

    // ---------------- Filters panel ----------------

    private renderFilters(body: HTMLElement): void {
        const cols: Column[] = (this.parent.getColumns() as Column[]).filter((c: Column) => c.allowFiltering && c.field && c.type !== 'checkbox');
        this.filterFields = cols.map((c: Column) => c.field);
        this.filterCols = cols;
        const host: HTMLElement = this.parent.createElement('div');
        body.appendChild(host);
        this.filterAccordion = new Accordion({
            expandMode: 'Multiple',
            animation: { expand: { effect: 'None' }, collapse: { effect: 'None' } },
            enableRtl: this.parent.enableRtl,
            items: cols.map((c: Column) => ({ header: c.headerText || c.field, content: '<div class="e-toolpanel-filteritem-host"></div>' })),
            expanding: (e: ExpandEventArgs) => {
                const idx: number = e.index;
                if (!e.isExpanded) {
                    this.closeFilterItem(idx);
                    return;
                }
                (this.parent.filterModule as Filter).closeFilterDialogByField(this.filterFields[parseInt(idx.toString(), 10)]);
                this.openFilterItem(idx, e.element.querySelector('.e-toolpanel-filteritem-host') as HTMLElement);
            }
        });
        this.filterAccordion.appendTo(host);
        this.accordions.push(this.filterAccordion);
        this.updateFilterIndicators();
    }

    private openFilterItem(idx: number, host: HTMLElement): void {
        if (this.filterItems[parseInt(idx.toString(), 10)]) { return; }
        const item: { instance: { closeDialog: Function }, closing: boolean } = { instance: null, closing: false };
        this.filterItems[parseInt(idx.toString(), 10)] = item;
        item.instance = (this.parent.filterModule as Filter)
            .renderToolPanelFilter(this.filterCols[parseInt(idx.toString(), 10)], host, () => {
                if (item.closing) { return; }
                // The filter UI closes itself after apply or clear; render it again so it reflects the new filter state.
                delete this.filterItems[parseInt(idx.toString(), 10)];
                setTimeout(() => this.reopenFilterItem(idx, host), 0);
            });
    }

    private reopenFilterItem(idx: number, host: HTMLElement): void {
        this.updateFilterIndicators();
        if (this.parent.isDestroyed || !this.filterAccordion || this.filterAccordion.isDestroyed ||
            !document.body.contains(host)) { return; }
        const el: Element = this.filterAccordion.element.querySelectorAll(':scope > .e-acrdn-item')[parseInt(idx.toString(), 10)];
        if (el && el.classList.contains('e-expand-state')) { this.openFilterItem(idx, host); }
    }

    private closeFilterItem(idx: number): void {
        const item: { instance: { closeDialog: Function }, closing: boolean } = this.filterItems[parseInt(idx.toString(), 10)];
        if (!item) { return; }
        item.closing = true;
        delete this.filterItems[parseInt(idx.toString(), 10)];
        if (item.instance) { item.instance.closeDialog(); }
    }

    private isColumnFiltered(field: string): boolean {
        return this.parent.filterSettings.columns.some((p: { field: string }) => p.field === field);
    }

    private updateFilterIndicators(): void {
        if (!this.filterAccordion || this.filterAccordion.isDestroyed) { return; }
        const items: HTMLElement[] = [].slice.call(this.filterAccordion.element.querySelectorAll(':scope > .e-acrdn-item'));
        items.forEach((item: HTMLElement, i: number) => {
            const filtered: boolean = this.isColumnFiltered(this.filterFields[parseInt(i.toString(), 10)]);
            item.classList.toggle('e-toolpanel-filtered', filtered);
            const hdr: Element = item.querySelector(':scope > .e-acrdn-header .e-acrdn-header-content');
            if (!hdr) { return; }
            let mark: Element = hdr.querySelector('.e-toolpanel-filter-mark');
            if (filtered && !mark) {
                mark = this.parent.createElement('span', { className: 'e-toolpanel-filter-mark e-icons e-icon-filter e-filtered', attrs: { 'aria-label': 'filtered' } });
                hdr.appendChild(mark);
            } else if (filtered) {
                // Filter module strips 'e-filtered' from every such element when filters are cleared.
                mark.classList.add('e-filtered');
            } else if (mark) { remove(mark); }
        });
    }

    private onFilterDialogOpen(e: { field: string }): void {
        if (!this.filterAccordion || this.filterAccordion.isDestroyed) { return; }
        const idx: number = this.filterFields.indexOf(e.field);
        if (idx === -1) { return; }
        const item: Element = this.filterAccordion.element.querySelectorAll(':scope > .e-acrdn-item')[parseInt(idx.toString(), 10)];
        if (item && item.classList.contains('e-expand-state')) { this.filterAccordion.expandItem(false, idx); }
    }

    // ---------------- Edit panel ----------------

    private isEditAllowed(): boolean {
        return !!this.parent.editSettings.allowEditing && !!this.parent.editModule;
    }

    private renderEdit(body: HTMLElement): void {
        this.editBody = body;
        this.buildEdit();
    }

    private onSelectionChanged(): void {
        if (!this.editBody || !this.rendered['edit'] || this.editApplying) { return; }
        window.clearTimeout(this.editTimer);
        this.editTimer = window.setTimeout(() => this.refreshEdit(), 0);
    }

    private refreshEdit(): void {
        if (!this.editBody || !this.rendered['edit'] || this.parent.isDestroyed) { return; }
        if (this.openedId !== 'edit') {
            this.editKey = null;
            return;
        }
        if (this.getSelectionKey() !== this.editKey) { this.buildEdit(); }
    }

    private getSelectionKey(): string {
        const primaryKey: string = this.parent.getPrimaryKeyFieldNames()[0];
        const records: Object[] = this.parent.getSelectedRecords();
        return this.parent.getSelectedRowIndexes().map((index: number, i: number) =>
            index + ':' + (primaryKey && records[parseInt(i.toString(), 10)] ?
                (records[parseInt(i.toString(), 10)] as { [key: string]: Object })[`${primaryKey}`] : '')).join(',');
    }

    private destroyEditContent(): void {
        window.clearTimeout(this.editTimer);
        window.clearTimeout(this.editRestoreTimer);
        if (this.editRestore) {
            this.parent.removeEventListener(events.dataBound, this.editRestore);
            this.editRestore = null;
            this.editApplying = false;
        }
        this.editValidators.forEach((validator: FormValidator) => { if (!validator.isDestroyed) { validator.destroy(); } });
        this.editValidators = [];
        const forms: HTMLElement[] = this.editForms;
        this.editForms = [];
        forms.forEach((form: HTMLElement) => {
            [].slice.call(form.querySelectorAll('.e-control')).forEach((element: HTMLElement) => {
                const instances: { isDestroyed?: boolean, destroy: Function }[] = (element as EJ2Intance).ej2_instances as [];
                (instances || []).forEach((instance: { isDestroyed?: boolean, destroy: Function }) => {
                    if (!instance.isDestroyed) { instance.destroy(); }
                });
            });
        });
        this.accordions = this.accordions.filter((a: Accordion) => {
            if (a === this.filterAccordion) { return true; }
            if (!a.isDestroyed) { a.destroy(); }
            return false;
        });
    }

    private buildEdit(): void {
        const body: HTMLElement = this.editBody;
        this.destroyEditContent();
        while (body.firstChild) { body.removeChild(body.firstChild); }
        this.editKey = this.getSelectionKey();
        const selected: number[] = this.parent.getSelectedRowIndexes();
        const status: HTMLElement = this.parent.createElement('div', { className: 'e-toolpanel-editstatus', attrs: { role: 'status' } });
        body.appendChild(status);
        if (!selected.length) {
            status.classList.add('e-toolpanel-editempty');
            status.appendChild(this.parent.createElement('span', { className: 'e-toolpanel-editempty-icon e-icons e-edit' }));
            const label: HTMLElement = this.parent.createElement('span', { className: 'e-toolpanel-editempty-text' });
            label.textContent = this.text('NoRowSelected', 'Select rows to edit');
            status.appendChild(label);
            return;
        }
        if (this.parent.editSettings.template) { return; }
        const multi: boolean = selected.length > 1;
        const record: Object = multi ? {} : this.parent.getCurrentViewRecords()[selected[0]];
        if (multi) { status.textContent = this.text('MultiRowPlaceholder', 'Multiple values - enter to update all'); }
        this.buildEditFields(body, record, multi ? undefined : this.getForeignKeyData(selected[0]));
    }

    private getForeignKeyData(index: number): Object {
        const row: Element = this.parent.getRowByIndex(index);
        const rowObj: { foreignKeyData?: Object } = row ? this.parent.getRowObjectFromUID(row.getAttribute('data-uid')) : null;
        return rowObj ? rowObj.foreignKeyData : undefined;
    }

    // A stacked header becomes one accordion item holding only its own fields; columns without a stacked header share one item.
    private getEditGroups(): { header: string, cols: Column[] }[] {
        const groups: { header: string, cols: Column[] }[] = [];
        const isEditable: (c: Column) => boolean = (c: Column): boolean => !!c.field && c.visible !== false && !c.commands &&
            !c.commandsTemplate && c.type !== 'checkbox' && c.type !== 'rownumber' && !this.parent.editModule.checkColumnIsGrouped(c);
        const leaves: (c: Column) => Column[] = (c: Column): Column[] => {
            if (!c.columns || !(c.columns as Column[]).length) { return isEditable(c) ? [c] : []; }
            return (c.columns as Column[]).reduce((all: Column[], child: Column) => all.concat(leaves(child)), []);
        };
        let plain: { header: string, cols: Column[] };
        const stacked: boolean = (this.parent.columns as Column[]).some((c: Column) => !!c.columns && !!(c.columns as Column[]).length);
        (this.parent.columns as Column[]).forEach((c: Column) => {
            if (c.columns && (c.columns as Column[]).length) {
                const cols: Column[] = leaves(c);
                if (cols.length) { groups.push({ header: c.headerText, cols: cols }); }
                plain = null;
            } else if (isEditable(c)) {
                if (!plain) {
                    // With stacked headers the item is named after its first column, like the stacked items are named after their header.
                    plain = { header: stacked ? c.headerText || c.field : this.text('EditRecordDetails', 'Edit Record Details'), cols: [] };
                    groups.push(plain);
                }
                plain.cols.push(c);
            }
        });
        return groups;
    }

    private buildEditFields(body: HTMLElement, record: Object, foreignKeyData: Object): void {
        const groups: { header: string, cols: Column[] }[] = this.getEditGroups();
        if (!groups.length) { return; }
        const host: HTMLElement = this.parent.createElement('div');
        body.appendChild(host);
        const acc: Accordion = new Accordion({
            expandMode: 'Multiple', enableRtl: this.parent.enableRtl,
            animation: { expand: { effect: 'None' }, collapse: { effect: 'None' } },
            items: groups.map((group: { header: string, cols: Column[] }) => ({
                header: group.header, content: '<div class="e-toolpanel-edititem-host"></div>', expanded: true
            }))
        });
        acc.appendTo(host);
        this.accordions.push(acc);
        const hosts: Element[] = [].slice.call(acc.element.querySelectorAll('.e-toolpanel-edititem-host'));
        groups.forEach((group: { header: string, cols: Column[] }, i: number) => {
            const formId: string = this.parent.element.id + '_toolpanel_editform' + i;
            const row: HTMLElement = this.parent.editModule.renderToolPanelForm(
                group.cols, extend({}, record, {}, true), formId, hosts[parseInt(i.toString(), 10)] as HTMLElement, foreignKeyData);
            const form: HTMLElement = row.querySelector('form');
            this.editForms.push(form);
            this.bindEditForm(form, group.cols);
        });
    }

    private bindEditForm(form: HTMLElement, cols: Column[]): void {
        const rules: { [name: string]: { [rule: string]: Object } } = {};
        cols.forEach((col: Column) => {
            if (col.validationRules) { rules[getComplexFieldID(col.field)] = col.validationRules as { [rule: string]: Object }; }
            const cell: Element = form.querySelector('[data-mappinguid=' + getParsedFieldID(col.uid) + ']');
            if (!cell) { return; }
            const instances: { addEventListener?: Function }[] = (cell as EJ2Intance).ej2_instances as [];
            const onChange: () => void = (): void => this.applyFieldChange(form, col);
            if (instances && instances[0] && instances[0].addEventListener) {
                instances[0].addEventListener('change', onChange);
            } else {
                EventHandler.add(cell, 'change', onChange, this);
            }
            // Widgets raise change on focus out only, so typed text is applied while typing.
            EventHandler.add(cell, 'input', (): void => this.onFieldInput(form, col, cell as HTMLInputElement, instances), this);
        });
        if (Object.keys(rules).length) {
            this.editValidators.push(new FormValidator(form as HTMLFormElement, { rules: rules, locale: this.parent.locale }));
        }
    }

    private onFieldInput(form: HTMLElement, col: Column, input: HTMLInputElement, instances: Object[]): void {
        const editType: string = col.editType;
        const numeric: boolean = editType === 'numericedit' || (!editType && col.type === 'number');
        const text: boolean = (!editType || editType === 'stringedit') && (!col.type || col.type === 'string');
        if (!instances || !instances[0]) {
            this.applyFieldChange(form, col);
        } else if (numeric && (/^-?\d+$/.test(input.value) || /^-?\d+\.\d+$/.test(input.value))) {
            // The NumericTextBox value is committed on focus out, so the typed number is passed directly.
            this.applyFieldChange(form, col, Number(input.value));
        } else if (text) {
            this.applyFieldChange(form, col, input.value);
        }
    }

    private applyFieldChange(form: HTMLElement, col: Column, typed?: Object): void {
        if (this.editForms.indexOf(form) === -1) { return; }
        const validator: FormValidator = col.validationRules ?
            this.editValidators.filter((v: FormValidator) => v.element === form)[0] : null;
        if (validator && !validator.validate(getComplexFieldID(col.field))) { return; }
        const value: Object = typed !== undefined ? typed :
            DataUtil.getObject(col.field, this.parent.editModule.getCurrentEditedData(form, {}));
        const selected: number[] = this.parent.getSelectedRowIndexes().slice();
        const batch: boolean = this.parent.editSettings.mode === 'Batch';
        const cellwise: boolean = batch || this.parent.editSettings.mode === 'Cell';
        const changed: number[] = selected.filter((index: number) => {
            const record: Object = this.parent.getCurrentViewRecords()[parseInt(index.toString(), 10)];
            return !!record && !this.isSameValue(DataUtil.getObject(col.field, record), value);
        });
        if (!changed.length) { return; }
        this.holdSelection(selected);
        changed.forEach((index: number) => {
            if (cellwise) {
                (this.parent as Grid).updateCell(index, col.field, value as string);
            } else {
                const data: Object = extend({}, this.parent.getCurrentViewRecords()[parseInt(index.toString(), 10)], {}, true);
                DataUtil.setValue(col.field, value, data);
                (this.parent as Grid).updateRow(index, data);
            }
        });
        if (batch) { this.parent.editModule.batchSave(); }
    }

    // updateRow refreshes the Grid, which clears the selection; it is restored once the refresh ends without rebuilding the form.
    private holdSelection(selected: number[]): void {
        if (this.editApplying) { return; }
        this.editApplying = true;
        const active: HTMLElement = document.activeElement as HTMLElement;
        const refocus: HTMLElement = this.editBody && active && this.editBody.contains(active) ? active : null;
        const restore: () => void = (): void => {
            window.clearTimeout(this.editRestoreTimer);
            this.parent.removeEventListener(events.dataBound, restore);
            this.editRestore = null;
            this.editApplying = false;
            if (this.parent.isDestroyed) { return; }
            if (selected.length === 1) { this.parent.selectRow(selected[0]); } else { this.parent.selectRows(selected); }
            if (refocus) { this.keepFocus(refocus); }
        };
        this.editRestore = restore;
        this.parent.addEventListener(events.dataBound, restore);
        this.editRestoreTimer = window.setTimeout(restore, 3000);
    }

    // The Grid focuses the selected cell on a timer after the selection; the focus is handed back in the same task so no typed key is lost.
    private keepFocus(field: HTMLElement): void {
        const pending: { timer?: number } = {};
        const stop: () => void = (): void => {
            window.clearTimeout(pending.timer);
            document.removeEventListener('focusin', reclaim, true);
        };
        const reclaim: (e: FocusEvent) => void = (e: FocusEvent): void => {
            if (this.parent.isDestroyed || !this.parent.getContent().contains(e.target as Node)) { return; }
            stop();
            if (document.body.contains(field)) { field.focus(); }
        };
        document.addEventListener('focusin', reclaim, true);
        pending.timer = window.setTimeout(stop, 300);
    }

    private isSameValue(current: Object, value: Object): boolean {
        if (current instanceof Date && value instanceof Date) { return current.getTime() === value.getTime(); }
        return current === value || (isNullOrUndefined(current) && isNullOrUndefined(value));
    }
}
