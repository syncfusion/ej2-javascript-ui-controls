import { AggregateRowModel, ColumnModel, AggregateColumnModel, SortDescriptorModel, PredicateModel } from '@syncfusion/ej2-grids';
import { RuleModel } from '@syncfusion/ej2-querybuilder';
import { ChangeEventArgs, CheckBox, Button } from '@syncfusion/ej2-buttons';
import { Dialog } from '@syncfusion/ej2-popups';
import { TextBox, InputEventArgs } from '@syncfusion/ej2-inputs';
import { TreeView, ContextMenu, DrawNodeEventArgs, DragAndDropEventArgs,
    BeforeOpenCloseMenuEventArgs, MenuEventArgs, NodeSelectEventArgs, NodeClickEventArgs,
    NodeKeyPressEventArgs, NodeCheckEventArgs } from '@syncfusion/ej2-navigations';
import { DropDownButton, ItemModel, MenuEventArgs as AggregateMenuEventArgs } from '@syncfusion/ej2-splitbuttons';
import { remove, closest, EventHandler, getUniqueID } from '@syncfusion/ej2-base';
import { PivotView } from '../base/pivotview';
import { FlatSettingsModel } from '../model/flatsettings-model';
import { cloneFlat, resolveFlatCustomAggregate } from '../../common/base/flat-util';
import { FlatFieldNode } from '../../common/base/interface';

/** One staged native TreeView chooser for physical fields, order and aggregation. @hidden */
export class FlatFields {
    private parent: PivotView;
    private dialog: Dialog;
    private tree: TreeView;
    private allTree: TreeView;
    private search: TextBox;
    private sortButtons: Button[] = [];
    private sortOrder: string;
    private appliedSortOrder: string;
    private appliedOrder: string[];
    private appliedColumns: string;
    private selectAll: CheckBox;
    private context: ContextMenu;
    private buttons: Button[] = [];
    private menus: Map<string, DropDownButton> = new Map<string, DropDownButton>();
    private actions: Map<string, HTMLElement> = new Map<string, HTMLElement>();
    private element: HTMLElement;
    private invoker: HTMLElement;
    private draft: FlatSettingsModel;
    private names: string[] = [];
    private order: string[] = [];
    private visible: string[] = [];
    private searchKey: string = '';
    private contextField: string;
    private selected: Map<string, boolean> = new Map<string, boolean>();
    private aggregates: Map<string, AggregateColumnModel> = new Map<string, AggregateColumnModel>();
    private checkingAction: boolean = false;
    /**
     * Identifies action controls before native checkbox checking without stopping drag gestures.
     *
     * @param {Event} event - Native pointer or keyboard gesture.
     * @returns {void}
     */
    private checkActionTarget: (event: Event) => void = (event: Event): void => {
        this.checkingAction = !!closest(event.target as Element, 'button');
    };

    constructor(parent: PivotView) { this.parent = parent; }

    /**
     * Discards an open draft when its physical schema is replaced.
     *
     * @returns {void}
     * @hidden
     */
    public sourceChanged(): void {
        if (!this.dialog) { return; }
        this.destroy();
        this.parent.actionFailureMethod(new Error(this.parent.localeObj.getConstant('flatFieldsSourceChanged')));
    }

    private text(key: string): string { return this.parent.localeObj.getConstant(key); }
    private id(field: string): string { return 'flatField' + this.names.indexOf(field); }
    private field(id: string): string {
        const index: number = /^flatField\d+$/.test(id) ? Number(id.slice(9)) : -1;
        if (index < 0 || index >= this.names.length) { return undefined; }
        const descriptor: PropertyDescriptor = Object.getOwnPropertyDescriptor(this.names, String(index));
        return descriptor && descriptor.value;
    }
    private caption(field: string): string {
        const column: ColumnModel = this.draft.columns.filter((entry: ColumnModel) => entry.field === field)[0];
        return column && column.headerText || field;
    }

    /**
     * Opens an independent draft with native checkbox, search, drag and menu controls.
     *
     * @returns {void}
     * @hidden
     */
    public open(): void {
        this.destroy();
        this.invoker = this.parent.element.ownerDocument.activeElement as HTMLElement;
        this.draft = cloneFlat(this.parent.flatSettings);
        this.selected.clear(); this.aggregates.clear(); this.searchKey = '';
        this.names = this.parent.flatLayoutModule.store.fields.slice();
        this.draft.columns.forEach((column: ColumnModel) => { this.selected.set(column.field, column.visible !== false); });
        const columns: string = JSON.stringify(this.draft.columns.map((column: ColumnModel) => [column.field, column.visible !== false]));
        if (this.appliedColumns && this.appliedColumns !== columns) {
            this.appliedOrder = this.draft.columns.map((column: ColumnModel) => column.field);
            this.appliedSortOrder = undefined;
        }
        this.order = this.appliedOrder ? this.appliedOrder.filter((field: string) => this.names.indexOf(field) !== -1) : [];
        this.names.forEach((field: string) => { if (this.order.indexOf(field) === -1) { this.order.push(field); } });
        (this.draft.aggregates || []).forEach((row: AggregateRowModel) => (row.columns || []).forEach((column: AggregateColumnModel) => {
            this.aggregates.set(column.field, column);
        }));
        this.sortOrder = this.appliedOrder ? this.appliedSortOrder : 'Source';
        const content: HTMLElement = this.parent.createElement('div', { className: 'e-pivot-flat-fields' });
        const fieldList: HTMLElement = this.parent.createElement('div', { className: 'e-pivot-flat-field-list' });
        content.appendChild(fieldList);
        const searchContainer: HTMLElement = this.parent.createElement('div', { className: 'e-pivot-flat-search' });
        fieldList.appendChild(searchContainer);
        const search: HTMLElement = this.parent.createElement('input', {
            attrs: { 'aria-label': this.text('flatFindFields') }
        });
        searchContainer.appendChild(search);
        this.search = new TextBox({ placeholder: this.text('flatFindFields'), width: '100%', showClearButton: true,
            locale: this.parent.locale, enableRtl: this.parent.enableRtl,
            input: (args: InputEventArgs) => { this.searchKey = (args.value || '').toLowerCase(); this.refreshTree(); } });
        this.search.appendTo(search);
        this.search.addIcon('append', 'e-icons e-search');
        const allRow: HTMLElement = this.parent.createElement('div', { className: 'e-pivot-flat-select-header' });
        fieldList.appendChild(allRow);
        const allHost: HTMLElement = this.parent.createElement('div');
        allRow.appendChild(allHost);
        this.allTree = new TreeView({ fields: { dataSource: [{ id: 'all', text: this.text('flatSelectAll') }] },
            fullRowSelect: false, cssClass: 'e-pivot-flat-select-all', enableRtl: this.parent.enableRtl,
            locale: this.parent.locale,
            nodeSelecting: (args: NodeSelectEventArgs) => { args.cancel = true; },
            nodeClicked: (args: NodeClickEventArgs) => {
                if (!closest(args.event.target as HTMLElement, '.e-checkbox-wrapper') && !this.selectAll.disabled) {
                    this.selectAll.click();
                }
            },
            keyPress: (args: NodeKeyPressEventArgs) => {
                if (args.event.action === 'space' && !this.selectAll.disabled) { args.cancel = true; this.selectAll.click(); }
            },
            drawNode: (args: DrawNodeEventArgs) => {
                const label: HTMLElement = args.node.querySelector('.e-list-text') as HTMLElement;
                const all: HTMLElement = this.parent.createElement('input', {
                    attrs: { type: 'checkbox', 'aria-label': this.text('flatSelectAll') }
                });
                label.parentElement.insertBefore(all, label);
                this.selectAll = new CheckBox({ enableRtl: this.parent.enableRtl,
                    change: (event: ChangeEventArgs) => {
                        const ids: string[] = this.visible.map((field: string) => this.id(field));
                        if (event.checked) { this.tree.checkAll(ids); } else { this.tree.uncheckAll(ids); }
                        this.checked();
                    } });
                this.selectAll.appendTo(all);
                EventHandler.add(all, 'keydown', this.selectAllKeydown, this);
            }
        });
        this.allTree.appendTo(allHost);
        fieldList.insertBefore(allRow, searchContainer);
        const sort: HTMLElement = this.parent.createElement('span', { className: 'e-pivot-flat-sort',
            attrs: { role: 'group', 'aria-label': this.text('flatSortFields') } });
        allRow.appendChild(sort);
        ['Source', 'Ascending', 'Descending'].forEach((direction: string) => {
            const key: string = direction === 'Source' ? 'flatSourceOrder' :
                direction === 'Ascending' ? 'flatSortAscending' : 'flatSortDescending';
            const element: HTMLElement = this.parent.createElement('button', {
                attrs: { type: 'button', 'aria-label': this.text(key), title: this.text(key), 'data-sort': direction }
            });
            sort.appendChild(element);
            const button: Button = new Button({ cssClass: 'e-flat',
                iconCss: 'e-icons ' + (direction === 'Source' ? 'e-sorting-1' :
                    direction === 'Ascending' ? 'e-arrow-up' : 'e-arrow-down'), enableRtl: this.parent.enableRtl });
            button.appendTo(element); this.sortButtons.push(button);
            element.addEventListener('click', () => {
                this.syncOrder();
                if (direction === 'Source') { this.order = this.names.slice(); }
                else {
                    const collator: Intl.Collator = new Intl.Collator(this.parent.locale);
                    const factor: number = direction === 'Descending' ? -1 : 1;
                    this.order.sort((left: string, right: string) =>
                        factor * collator.compare(this.caption(left), this.caption(right)) ||
                        this.names.indexOf(left) - this.names.indexOf(right));
                }
                this.sortOrder = direction;
                this.updateSortButtons();
                this.refreshTree();
            });
        });
        this.updateSortButtons();
        const list: HTMLElement = this.parent.createElement('div', { id: getUniqueID('pivot-flat-fields') });
        fieldList.appendChild(list);
        this.visible = this.order.slice();
        this.tree = new TreeView({
            fields: { dataSource: this.data(), id: 'id', text: 'text', isChecked: 'isChecked' },
            showCheckBox: true, checkOnClick: true, allowDragAndDrop: true,
            fullRowSelect: true, sortOrder: 'None', height: '100%',
            cssClass: 'e-pivot-flat-field-tree',
            enableRtl: this.parent.enableRtl, locale: this.parent.locale, enableHtmlSanitizer: true,
            drawNode: (args: DrawNodeEventArgs) => this.row(args),
            nodeChecking: (args: NodeCheckEventArgs) => { args.cancel = args.isInteracted && this.checkingAction; },
            nodeChecked: () => this.checked(),
            nodeDragStart: (args: DragAndDropEventArgs) => {
                args.cancel = !this.canReorder(this.field(args.draggedNode.getAttribute('data-uid')));
            },
            nodeDragging: (args: DragAndDropEventArgs) => {
                if (args.position === 'Inside') { args.dropIndicator = 'e-no-drop'; }
            },
            nodeDragStop: (args: DragAndDropEventArgs) => {
                if (args.position === 'Inside' || !args.droppedNode || !list.contains(args.droppedNode)) { args.cancel = true; }
            },
            nodeDropped: () => this.syncOrder()
        });
        this.tree.appendTo(list);
        ['mousedown', 'touchstart', 'keydown'].forEach((name: string) => list.addEventListener(name, this.checkActionTarget, true));
        EventHandler.add(list, 'keydown', this.keydown, this);
        const menu: HTMLElement = this.parent.createElement('ul', { id: this.parent.element.id + '_flat_field_menu' });
        content.appendChild(menu);
        this.context = new ContextMenu({ target: '#' + list.id, filter: '.e-list-item',
            locale: this.parent.locale, enableRtl: this.parent.enableRtl,
            items: [{ id: 'MoveUp', text: this.text('flatMoveUp') }, { id: 'MoveDown', text: this.text('flatMoveDown') }],
            beforeOpen: (args: BeforeOpenCloseMenuEventArgs) => {
                if (args.event) {
                    const node: HTMLElement = closest(args.event.target as Element, '.e-list-item') as HTMLElement;
                    if (!node || !list.contains(node)) { args.cancel = true; return; }
                    this.contextField = this.field(node.getAttribute('data-uid'));
                }
                if (!this.canReorder(this.contextField) || this.visible.length < 2) { args.cancel = true; return; }
                this.updateContext();
            },
            select: (args: MenuEventArgs) => this.move(this.contextField, args.item.id === 'MoveUp' ? -1 : 1),
            onOpen: () => this.context.element.focus(),
            onClose: () => this.focusField(this.contextField)
        });
        this.element = this.parent.createElement('div');
        this.parent.element.appendChild(this.element);
        this.dialog = new Dialog({
            header: this.text('flatFieldList'), content: content, isModal: true, visible: true,
            width: closest(this.parent.element, '.e-bigger') ? '490px' : '444px',
            height: closest(this.parent.element, '.e-bigger') ? '546px' : '490px',
            target: this.parent.element, showCloseIcon: false, closeOnEscape: true, enableRtl: this.parent.enableRtl,
            locale: this.parent.locale, cssClass: ((this.parent.cssClass || '') + ' e-pivot-flat-fields-dialog').trim(), animationSettings: { effect: 'None' },
            buttons: [
                { buttonModel: { content: this.text('cancel') }, click: () => this.destroy() },
                { buttonModel: { content: this.text('apply'), isPrimary: true }, click: () => this.apply() }
            ],
            close: () => this.destroy()
        });
        this.dialog.createElement = this.parent.createElement;
        this.dialog.appendTo(this.element);
        this.context.appendTo(menu);
        this.syncSelectAll();
    }

    private data(): FlatFieldNode[] {
        return this.visible.map((field: string) => {
            // Native TreeView accepts HTML text; encode captions before its renderer sees them.
            const label: HTMLElement = this.parent.createElement('span');
            label.textContent = this.caption(field);
            return { id: this.id(field), text: label.innerHTML, isChecked: !!this.selected.get(field) };
        });
    }

    private row(args: DrawNodeEventArgs): void {
        const field: string = this.field(String(args.nodeData.id));
        args.node.classList.add('e-pivot-flat-field');
        args.node.setAttribute('aria-label', this.caption(field));
        const label: HTMLElement = args.node.querySelector('.e-list-text') as HTMLElement;
        label.textContent = this.caption(field);
        const actions: HTMLElement = this.parent.createElement('span', { className: 'e-pivot-flat-field-actions' });
        label.parentElement.appendChild(actions); this.actions.set(field, actions);
        this.renderAggregate(field);
        const grip: HTMLElement = this.parent.createElement('button', {
            className: 'e-pivot-flat-drag',
            attrs: { type: 'button', 'aria-label': this.caption(field) + ' ' + this.text('flatFieldActions'),
                title: this.text('drag') + ' / ' + this.text('flatFieldActions') }
        });
        label.parentElement.insertBefore(grip, label.parentElement.firstChild);
        const button: Button = new Button({ iconCss: 'e-icons e-drag-and-drop', cssClass: 'e-flat', disabled: !this.canReorder(field),
            enableRtl: this.parent.enableRtl });
        button.appendTo(grip); this.buttons.push(button);
        grip.addEventListener('click', (event: MouseEvent) => { event.stopPropagation(); this.openContext(args.node); });
    }

    private configuredAggregate(field: string): AggregateColumnModel {
        const columns: AggregateColumnModel[] = this.draft.aggregates && this.draft.aggregates[0] && this.draft.aggregates[0].columns || [];
        const column: ColumnModel = this.draft.columns.filter((entry: ColumnModel) => entry.field === field)[0];
        return this.aggregates.get(field) || columns.filter((column: AggregateColumnModel) => column.field === field)[0] ||
            { field: field, format: column && this.columnType(field) === 'number' ? column.format : undefined };
    }

    private columnType(field: string): string {
        const column: ColumnModel = this.draft.columns.filter((entry: ColumnModel) => entry.field === field)[0];
        const inferred: PropertyDescriptor = Object.getOwnPropertyDescriptor(this.parent.flatLayoutModule.store.types, field);
        return column && column.type || inferred && inferred.value;
    }

    private aggregateItems(field: string): ItemModel[] {
        const type: string = this.columnType(field);
        const types: string[] = ['None', 'Count'];
        if (type === 'number') { types.push('Sum', 'Average', 'Min', 'Max'); }
        if (type === 'boolean') { types.push('TrueCount', 'FalseCount'); }
        const aggregate: AggregateColumnModel = this.configuredAggregate(field);
        if (aggregate && resolveFlatCustomAggregate(aggregate.customAggregate, this.parent.element.ownerDocument.defaultView)) {
            types.push('Custom');
        }
        const current: string = this.aggregates.get(field) && this.aggregates.get(field).type as string || 'None';
        return types.map((value: string) => ({
            id: value,
            iconCss: value === current ? 'e-icons e-check' : '',
            text: this.text('flatAggregate' + value)
        }));
    }

    private renderAggregate(field: string): void {
        const previous: DropDownButton = this.menus.get(field);
        // Retain configured fields while None is staged, including after a search refresh.
        const configured: boolean = (this.draft.aggregates || []).some((row: AggregateRowModel) =>
            (row.columns || []).some((column: AggregateColumnModel) => column.field === field));
        const valueField: boolean = this.parent.dataSourceSettings.values.some((value: { name: string }) => value.name === field);
        if (this.columnType(field) !== 'number' && !configured && !valueField) {
            if (previous) { const element: HTMLElement = previous.element; previous.destroy(); remove(element); this.menus.delete(field); }
            return;
        }
        if (previous) { return; }
        const element: HTMLElement = this.parent.createElement('button', {
            attrs: { type: 'button', 'aria-label': this.caption(field) + ' ' + this.text('flatAggregation') }
        });
        const actions: HTMLElement = this.actions.get(field);
        actions.insertBefore(element, actions.firstChild);
        const menu: DropDownButton = new DropDownButton({
            cssClass: 'e-flat e-pivot-flat-aggregate' +
            (closest(this.parent.element, '.e-bigger') ? ' e-bigger' : ''),
            beforeOpen: () => { this.tree.selectedNodes = [this.id(field)]; this.tree.dataBind(); },
            items: this.aggregateItems(field), locale: this.parent.locale, enableRtl: this.parent.enableRtl,
            select: (args: AggregateMenuEventArgs) => {
                if (args.item.disabled) { return; }
                if (args.item.id === 'None') { this.aggregates.delete(field); }
                else {
                    this.aggregates.set(field, Object.assign({}, this.configuredAggregate(field), { field: field, type: args.item.id }));
                }
                Promise.resolve().then(() => {
                    if (this.menus.get(field) !== menu || menu.isDestroyed) { return; }
                    menu.items = this.aggregateItems(field); menu.dataBind(); this.aggregateLabel(field);
                });
            }
        });
        this.menus.set(field, menu); menu.appendTo(element); this.aggregateLabel(field);
        element.addEventListener('click', (event: MouseEvent) => event.stopPropagation());
    }

    private aggregateLabel(field: string): void {
        const type: string = this.aggregates.get(field) && this.aggregates.get(field).type as string || 'None';
        const label: string = this.caption(field) + ' ' + this.text('flatAggregation') + ': ' +
            this.text('flatAggregate' + type);
        this.menus.get(field).element.setAttribute('aria-label', label);
        this.menus.get(field).element.title = label;
    }

    private checked(): void {
        if (!this.tree) { return; }
        this.visible.forEach((field: string) => {
            this.selected.set(field, this.tree.checkedNodes.indexOf(this.id(field)) !== -1);
            if (this.actions.get(field)) { this.renderAggregate(field); }
        });
        this.syncSelectAll();
    }

    private syncSelectAll(): void {
        const count: number = this.visible.filter((field: string) => this.selected.get(field)).length;
        // Native CheckBox resolves an indeterminate click to its checked value.
        this.selectAll.checked = count > 0;
        this.selectAll.indeterminate = count > 0 && count < this.visible.length;
        this.selectAll.disabled = !this.visible.length;
        this.selectAll.dataBind();
    }

    private updateSortButtons(): void {
        this.sortButtons.forEach((button: Button) => {
            const selected: boolean = button.element.getAttribute('data-sort') === this.sortOrder;
            button.element.setAttribute('aria-pressed', String(selected));
            const icon: Element = button.element.querySelector('.e-btn-icon');
            if (icon) { icon.classList.toggle('e-selected', selected); }
        });
    }

    private syncOrder(): void {
        if (!this.tree) { return; }
        const visible: string[] = this.tree.getTreeData().map((node: { [key: string]: object }) => this.field(String(node.id)));
        if (JSON.stringify(visible) !== JSON.stringify(this.visible)) {
            this.sortOrder = undefined;
            this.updateSortButtons();
        }
        const visibleFields: IterableIterator<string> = visible.values();
        const visibleSet: Set<string> = new Set<string>(visible);
        this.order = this.order.map((field: string) => visibleSet.has(field) ? visibleFields.next().value : field);
        this.visible = visible;
    }

    private refreshTree(): void {
        this.clearRows();
        this.visible = this.order.filter((field: string) => field.toLowerCase().indexOf(this.searchKey) !== -1);
        this.tree.fields.dataSource = this.data(); this.tree.dataBind(); this.syncSelectAll();
    }

    private selectAllKeydown(event: KeyboardEvent): void {
        // The native checkbox owns Space when focused; the TreeView owns it on its row.
        if (event.key === ' ' || event.key === 'Spacebar') { event.stopPropagation(); }
    }

    private openContext(node: HTMLElement): void {
        this.contextField = this.field(node.getAttribute('data-uid'));
        this.updateContext();
        const bounds: ClientRect = node.getBoundingClientRect();
        this.context.open(bounds.bottom, bounds.left, node);
    }

    private updateContext(): void {
        const index: number = this.visible.indexOf(this.contextField);
        const permitted: boolean = this.canReorder(this.contextField);
        this.context.enableItems(['MoveUp'], permitted && index > 0, true);
        this.context.enableItems(['MoveDown'], permitted && index >= 0 && index < this.visible.length - 1, true);
    }

    private canReorder(field: string): boolean {
        const column: ColumnModel = this.draft.columns.filter((entry: ColumnModel) => entry.field === field)[0] || { field: field };
        return column.allowReordering !== false;
    }

    private keydown(event: KeyboardEvent): void {
        if (event.key !== 'ContextMenu' && !(event.shiftKey && event.key === 'F10')) { return; }
        const node: HTMLElement = closest(event.target as Element, '.e-list-item') as HTMLElement;
        if (node) { event.preventDefault(); event.stopPropagation(); this.openContext(node); }
    }

    private move(field: string, direction: number): void {
        if (!this.canReorder(field)) { return; }
        const index: number = this.visible.indexOf(field);
        const target: number = index + direction;
        if (index < 0 || target < 0 || target >= this.visible.length) { return; }
        const descriptor: PropertyDescriptor = Object.getOwnPropertyDescriptor(this.visible, String(target));
        const sibling: string = descriptor && descriptor.value;
        if (!sibling) { return; }
        const left: number = this.order.indexOf(field); const right: number = this.order.indexOf(sibling);
        if (left < 0 || right < 0) { return; }
        this.order.splice(left, 1, sibling); this.order.splice(right, 1, field);
        this.sortOrder = undefined; this.updateSortButtons(); this.refreshTree();
        Promise.resolve().then(() => this.focusField(field));
    }

    private focusField(field: string): void {
        if (!this.tree) { return; }
        const node: HTMLElement = this.tree.element.querySelector('[data-uid="' + this.id(field) + '"]') as HTMLElement;
        if (node) { node.focus(); }
    }

    private queryFields(): Set<string> {
        const settings: FlatSettingsModel = this.draft;
        const fields: Set<string> = new Set<string>();
        (settings.sortSettings && settings.sortSettings.columns || []).forEach((sort: SortDescriptorModel) => fields.add(sort.field));
        (settings.filterSettings && settings.filterSettings.columns || []).forEach((filter: PredicateModel) => fields.add(filter.field));
        (settings.searchSettings && settings.searchSettings.fields || []).forEach((field: string) => fields.add(field));
        const visit: (rule: RuleModel) => void = (rule: RuleModel): void => {
            if (!rule) { return; }
            if (rule.rules) { rule.rules.forEach(visit); }
            else if (typeof rule.field === 'string') { fields.add(rule.field); }
        };
        visit(settings.advancedFilterSettings && settings.advancedFilterSettings.queryBuilderSettings &&
            settings.advancedFilterSettings.queryBuilderSettings.rule);
        return fields;
    }

    private apply(): void {
        this.syncOrder();
        const required: Set<string> = this.queryFields();
        const fields: string[] = this.order.filter((field: string) => this.selected.get(field) || required.has(field));
        const columns: ColumnModel[] = fields.map((field: string) => {
            const column: ColumnModel = this.draft.columns.filter((entry: ColumnModel) => entry.field === field)[0] || { field: field };
            if (!this.selected.get(field)) { return Object.assign({}, column, { visible: false }); }
            return column.visible === false ? Object.assign({}, column, { visible: true }) : column;
        });
        const aggregates: AggregateColumnModel[] = this.order.filter((field: string) => this.aggregates.get(field))
            .map((field: string) => this.aggregates.get(field));
        const settings: FlatSettingsModel = {};
        const order: string[] = this.order.slice();
        const sortOrder: string = this.sortOrder;
        if (JSON.stringify(columns) !== JSON.stringify(this.parent.flatSettings.columns)) {
            settings.columns = columns;
            settings.frozenColumns = Math.min(this.parent.flatSettings.frozenColumns || 0,
                                              columns.filter((column: ColumnModel) => column.visible !== false).length);
        }
        const rows: AggregateRowModel[] = aggregates.length ? [{ columns: aggregates }] : [];
        if (JSON.stringify(rows) !== JSON.stringify(this.draft.aggregates)) { settings.aggregates = rows; }
        this.destroy();
        if (!Object.keys(settings).length) {
            this.appliedOrder = order;
            this.appliedSortOrder = sortOrder;
            this.appliedColumns = JSON.stringify(columns.map((column: ColumnModel) => [column.field, column.visible !== false]));
            return;
        }
        this.parent.setProperties({ flatSettings: settings }, false); this.parent.dataBind();
        if (JSON.stringify(this.parent.flatSettings.columns) === JSON.stringify(columns)) {
            this.appliedOrder = order;
            this.appliedSortOrder = sortOrder;
            this.appliedColumns = JSON.stringify(columns.map((column: ColumnModel) => [column.field, column.visible !== false]));
        }
    }

    private clearRows(): void {
        this.menus.forEach((menu: DropDownButton) => menu.destroy());
        this.menus.clear();
        this.buttons.forEach((button: Button) => button.destroy()); this.buttons = [];
        this.actions.clear();
    }

    /**
     * Releases native controls and draft state and restores the invoker.
     *
     * @returns {void}
     * @hidden
     */
    public destroy(): void {
        const dialog: Dialog = this.dialog; this.dialog = undefined;
        if (this.context) { this.context.destroy(); this.context = undefined; }
        this.clearRows();
        if (this.tree) {
            ['mousedown', 'touchstart', 'keydown'].forEach((name: string) =>
                this.tree.element.removeEventListener(name, this.checkActionTarget, true));
            EventHandler.remove(this.tree.element, 'keydown', this.keydown);
            this.tree.destroy(); this.tree = undefined;
        }
        if (this.search) { this.search.destroy(); this.search = undefined; }
        this.sortButtons.forEach((button: Button) => button.destroy()); this.sortButtons = [];
        if (this.selectAll) {
            EventHandler.remove(this.selectAll.element, 'keydown', this.selectAllKeydown);
            this.selectAll.destroy(); this.selectAll = undefined;
        }
        if (this.allTree) { this.allTree.destroy(); this.allTree = undefined; }
        if (dialog && !dialog.isDestroyed) { dialog.destroy(); }
        if (this.element && this.element.parentElement) { remove(this.element); }
        this.element = undefined;
        if (this.invoker && this.invoker.isConnected) { this.invoker.focus(); }
        this.invoker = undefined;
        this.checkingAction = false;
    }
}
