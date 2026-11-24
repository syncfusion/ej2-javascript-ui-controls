import { FlatLayout } from '../actions/flat-layout';
import { FilterSettingsModel, SortSettingsModel, SortDescriptorModel, ColumnMenuClickEventArgs,
    ColumnMenuOpenEventArgs, QueryCellInfoEventArgs, AdvancedFilterSettingsModel, Column, Grid, ColumnModel,
    Selection, Sort, Filter, Page, VirtualScroll, Resize, Reorder, Freeze, ColumnMenu, Aggregate, AdvancedFilter,
    Clipboard, DataStateChangeEventArgs, ActionEventArgs, PredicateModel, AdvancedFilterBeginArgs,
    ColumnMenuItemModel, AggregateColumnModel, AggregateRowModel, Toolbar, ColumnChooser, HeaderCellInfoEventArgs,
    ExcelExport, PdfExport, RowInfo } from '@syncfusion/ej2-grids';
import { RowSelectingEventArgs, RowDeselectingEventArgs, RowSelectEventArgs, RowDeselectEventArgs,
    CellSelectingEventArgs, CellSelectEventArgs, CellDeselectEventArgs, ISelectedCell } from '@syncfusion/ej2-grids';
import { FlatValue, FlatRecord, FlatColumnSelection } from '../../common/base/interface';
import { RuleModel } from '@syncfusion/ej2-querybuilder';
import { getValue, remove } from '@syncfusion/ej2-base';
import { PivotView } from '../base/pivotview';
import { FlatSettingsModel } from '../model/flatsettings-model';
import { cloneFlat, flatPinsFit, isFlatColumnActionEnabled } from '../../common/base/flat-util';
import { DataUtil } from '@syncfusion/ej2-data';
import { FlatRecordStore } from './flat-data';
import { ClickEventArgs } from '@syncfusion/ej2-navigations';

/** Grid owns DOM, paging and virtualization; Flat owns record operations. @hidden */
export class FlatGrid {
    private parent: PivotView;
    private settings: FlatSettingsModel;
    private columns: ColumnModel[];
    private generation: number;
    private pending: boolean = false;
    private total: HTMLElement;
    private pinningSuspended: boolean = false;
    private pinNotice: HTMLElement;
    private observer: { observe: (element: Element) => void; disconnect: () => void };
    private renderedStore: FlatRecordStore;
    private renderedOrdinals: number[] = [];
    private columnSelection: FlatColumnSelection;
    private columnAction: boolean = false;

    constructor(parent: PivotView) { this.parent = parent; }

    /**
     * Whether a native column gesture has already changed the displayed Grid.
     *
     * @returns {boolean} Whether cancellation must restore native columns.
     * @hidden
     */
    public get columnActionPending(): boolean { return this.columnAction; }

    /**
     * Resolves the configured Grid width inside the current container.
     *
     * @returns {number} Available viewport width.
     * @hidden
     */
    public viewportWidth(): number {
        const available: number = this.parent.element.clientWidth;
        const width: string = String(this.parent.width);
        const percentage: boolean = width.endsWith('%');
        const numeric: string = percentage ? width.slice(0, -1) : width.endsWith('px') ? width.slice(0, -2) : width;
        const parts: string[] = numeric.split('.');
        if (parts.length > 2 || parts.some((part: string) => !/^\d+$/.test(part))) { return available; }
        const value: number = parseFloat(numeric);
        return percentage ? available * value / 100 : Math.min(available || Infinity, value);
    }

    private field(encoded: string): string {
        const index: number = /^flat\d+$/.test(encoded || '') ? Number(encoded.slice(4)) : -1;
        if (index < 0 || index >= this.columns.length) { return undefined; }
        const descriptor: PropertyDescriptor = Object.getOwnPropertyDescriptor(this.columns, String(index));
        const column: ColumnModel = descriptor && descriptor.value;
        return column && column.field;
    }

    private encoded(field: string): string { return 'flat' + this.columns.findIndex((column: ColumnModel) => column.field === field); }

    private physicalColumn(column: Column): Column {
        const field: string = this.field(column.field);
        const descriptor: ColumnModel = this.columns.filter((entry: ColumnModel) => entry.field === field)[0];
        return new Column(Object.assign({}, cloneFlat(descriptor), { field: field }));
    }

    private can(field: string, flag: string): boolean {
        const column: ColumnModel = this.columns.filter((entry: ColumnModel) => entry.field === field)[0];
        return isFlatColumnActionEnabled(this.settings, column, flag);
    }

    private frame(skip: number, take: number): object[] {
        const flat: FlatLayout = this.parent.flatLayoutModule;
        return flat.project(skip, take).map((record: FlatRecord, offset: number) => {
            const row: { [key: string]: unknown } = { flatOrdinal: skip + offset };
            this.columns.forEach((column: ColumnModel, index: number) => {
                if (column.visible !== false) { row['flat' + index] = record[column.field]; }
            });
            return row;
        });
    }

    /**
     * Replaces the previous Grid through the parent Render owner.
     *
     * @param {boolean} notify - Whether to publish logical rendering completion.
     * @returns {void}
     * @hidden
     */
    public render(notify: boolean = true): void {
        const parent: PivotView = this.parent;
        const flat: FlatLayout = parent.flatLayoutModule;
        const prior: Grid = parent.grid;
        const pageSettings: FlatSettingsModel['pageSettings'] = parent.flatSettings.pageSettings;
        const fields: (columns: ColumnModel[]) => string = (columns: ColumnModel[]): string =>
            JSON.stringify(columns.map((column: ColumnModel) => [column.field, column.visible !== false])
                .sort((left: (string | boolean)[], right: (string | boolean)[]) => String(left[0]).localeCompare(String(right[0]))));
        const ordinals: IterableIterator<number> = flat.query.ordinals.values();
        const retain: boolean = prior && !prior.isDestroyed && this.renderedStore === flat.store && this.settings &&
            fields(this.settings.columns) === fields(parent.flatSettings.columns) &&
            this.settings.pageSettings.currentPage === pageSettings.currentPage &&
            this.settings.pageSettings.pageSize === pageSettings.pageSize &&
            this.renderedOrdinals.length === flat.query.ordinals.length &&
            this.renderedOrdinals.every((ordinal: number) => ordinal === ordinals.next().value);
        const columnSelection: FlatColumnSelection = retain && this.columnAction ? this.columnSelection : undefined;
        const selected: number[] = columnSelection ? columnSelection.rows : retain ? prior.getSelectedRowIndexes().slice() : [];
        const previousFields: string[] = columnSelection ? columnSelection.fields : retain ?
            prior.getColumns().map((column: Column) => this.field(column.field)) : [];
        const cells: ISelectedCell[] = columnSelection ? columnSelection.cells : retain ? cloneFlat(prior.getSelectedRowCellIndexes()) : [];
        this.columnSelection = undefined; this.columnAction = false;
        const content: HTMLElement = retain ? prior.getContent().querySelector('.e-content') as HTMLElement : undefined;
        const top: number = content ? content.scrollTop : 0;
        const left: number = content ? content.scrollLeft : 0;
        const focused: HTMLElement = parent.element.ownerDocument.activeElement as HTMLElement;
        const focusInfo: RowInfo = retain && prior.element.contains(focused) && focused.closest('.e-rowcell') ?
            prior.getRowInfo(focused) : undefined;
        const focusRow: number = columnSelection && columnSelection.focus ? columnSelection.focus.row :
            focusInfo ? focusInfo.rowIndex : undefined;
        const focusField: string = columnSelection && columnSelection.focus ? columnSelection.focus.field :
            focusInfo ? this.field((focusInfo.column as Column).field) : undefined;
        this.generation = flat.renderGeneration;
        const generation: number = this.generation;
        this.settings = cloneFlat(parent.flatSettings);
        this.columns = cloneFlat(this.settings.columns || []);
        if (this.settings.showColumnChooser) {
            flat.store.fields.forEach((field: string) => {
                if (!this.columns.some((column: ColumnModel) => column.field === field)) {
                    this.columns.push({ field: field, visible: false });
                }
            });
        }
        this.renderedStore = flat.store;
        this.renderedOrdinals = flat.query.ordinals;
        this.pinningSuspended = !flatPinsFit(this.settings, this.viewportWidth());
        this.watchWidth();
        this.pending = false;
        this.removeTotal();
        const previousEmpty: Element = parent.element.querySelector('.e-pivot-flat-empty');
        if (previousEmpty) { remove(previousEmpty); }
        if (parent.grid && !parent.grid.isDestroyed) {
            const previous: HTMLElement = parent.grid.element;
            parent.grid.destroy();
            if (previous.parentElement) { remove(previous); }
        }
        if (!flat.columns.length && !this.settings.showColumnChooser && !(this.settings.toolbar || []).length) {
            parent.grid = undefined;
            const empty: HTMLElement = parent.createElement('div', { className: 'e-pivot-flat-empty', attrs: { role: 'status' } });
            empty.textContent = parent.localeObj.getConstant('flatNoFields');
            parent.element.appendChild(empty);
            flat.dataBound();
            return;
        }
        Grid.Inject(Selection, Sort, Filter, Page, VirtualScroll, Resize, Reorder, Freeze, ColumnMenu,
                    AdvancedFilter, Clipboard, Aggregate, Toolbar, ColumnChooser, ExcelExport, PdfExport);
        const pageSize: number = this.settings.pageSettings && this.settings.pageSettings.pageSize || 12;
        const page: number = this.settings.allowPaging ? Math.min(this.settings.pageSettings.currentPage || 1,
                                                                  Math.max(1, Math.ceil(flat.query.ordinals.length / pageSize))) : 1;
        parent.setProperties({ flatSettings: { pageSettings: { currentPage: page } } }, true);
        const virtual: boolean = this.settings.enableVirtualization && (!this.settings.allowPaging || pageSize > 40);
        const count: number = flat.query.ordinals.length;
        const take: number = this.settings.allowPaging ? pageSize : virtual ? Math.max(40, pageSize) : count;
        const columns: ColumnModel[] = this.columns.map((column: ColumnModel, index: number) => ({
            field: 'flat' + index, headerText: column.headerText || column.field, visible: column.visible,
            width: column.width || 200, type: column.type || (flat.store.types[column.field] === 'mixed' ? undefined :
                flat.store.types[column.field]),
            format: column.format, textAlign: column.textAlign, disableHtmlEncode: true,
            allowSorting: column.allowSorting !== false, allowFiltering: column.allowFiltering !== false,
            allowResizing: column.allowResizing !== false, allowReordering: column.allowReordering !== false,
            allowSearching: column.allowSearching !== false, showColumnMenu: column.showColumnMenu !== false,
            filter: column.filter || {}, freeze: this.pinningSuspended ? 'None' : this.settings.frozenColumns &&
                this.columns.slice(0, index + 1).filter((entry: ColumnModel) => entry.visible !== false).length <=
                this.settings.frozenColumns && column.visible !== false ? 'Left' : column.freeze,
            isFrozen: !this.pinningSuspended && column.isFrozen
        }));
        const filters: FilterSettingsModel = cloneFlat(this.settings.filterSettings || {});
        filters.columns = (filters.columns || []).map((entry: PredicateModel) => {
            const predicate: PredicateModel = Object.assign({}, entry, { field: this.encoded(entry.field) });
            delete predicate.uid;
            return predicate;
        });
        const sort: SortSettingsModel = cloneFlat(this.settings.sortSettings || {});
        sort.columns = (sort.columns || []).map((entry: SortDescriptorModel) =>
            Object.assign({}, entry, { field: this.encoded(entry.field) }));
        let completed: boolean = false;
        const empty: HTMLElement = parent.createElement('div', { className: 'e-pivot-flat-empty', attrs: { role: 'status' } });
        empty.textContent = parent.localeObj.getConstant('flatNoFields');
        parent.grid = new Grid({
            dataSource: { result: flat.columns.length ? this.frame((page - 1) * pageSize, take) : [],
                count: flat.columns.length ? count : 0, aggregates: this.aggregateValues() }, columns: columns,
            emptyRecordTemplate: flat.columns.length ? undefined : empty.outerHTML,
            width: parent.width, height: parent.height === 'auto' ? virtual ? 400 : 'auto' : parent.height,
            locale: parent.locale, enableRtl: parent.enableRtl, cssClass: parent.cssClass,
            enableHtmlSanitizer: parent.enableHtmlSanitizer,
            allowSelection: this.settings.allowSelection, selectionSettings: this.settings.selectionSettings,
            allowSorting: this.settings.allowSorting, allowMultiSorting: this.settings.allowMultiSorting, sortSettings: sort,
            allowFiltering: this.settings.allowFiltering, filterSettings: filters,
            allowAdvancedFiltering: this.settings.allowAdvancedFiltering,
            toolbar: (this.settings.toolbar || []).length ? this.settings.toolbar : undefined,
            showColumnChooser: this.settings.showColumnChooser,
            allowExcelExport: this.settings.allowExcelExport, allowPdfExport: this.settings.allowPdfExport,
            toolbarClick: (args: ClickEventArgs & { cancel: boolean }) => {
                parent.trigger('toolbarClick', args);
                if (args.cancel) { return; }
                const command: string = args.item.id.slice(parent.grid.element.id.length + 1);
                if (['excelexport', 'csvexport', 'pdfexport'].indexOf(command) !== -1) {
                    args.cancel = true;
                    flat.output.export(command === 'pdfexport' ? 'PDF' : command === 'csvexport' ? 'CSV' : 'Excel')
                        .catch(() => undefined);
                }
            },
            columnChooserSettings: this.settings.columnChooserSettings,
            searchSettings: Object.assign({}, this.settings.searchSettings, { fields: [] }),
            advancedFilterSettings: this.mapAdvanced(),
            advancedFilterBegin: (args: AdvancedFilterBeginArgs) => this.advanced(args),
            allowPaging: this.settings.allowPaging, pageSettings: Object.assign(
                {}, this.settings.pageSettings,
                { pageSize: virtual ? Math.max(40, pageSize) : pageSize, currentPage: page }),
            enableVirtualization: virtual, enableColumnVirtualization: this.settings.enableColumnVirtualization,
            frozenColumns: 0, showColumnMenu: this.settings.showColumnMenu,
            columnMenuItems: this.menuItems() as ColumnMenuItemModel[],
            aggregates: this.nativeSummaries(),
            columnMenuClick: (args: ColumnMenuClickEventArgs) => this.menu(args.item.id, this.field(args.column.field)),
            columnMenuOpen: (args: ColumnMenuOpenEventArgs) => {
                const field: string = this.field(args.column.field);
                const available: boolean = this.columns.some((column: ColumnModel) =>
                    column.field === field && column.showColumnMenu !== false);
                if (!available) { args.cancel = true; }
                args.items.forEach((item: ColumnMenuItemModel) => {
                    if (item.id === parent.grid.element.id + '_colmenu_Filter') {
                        item.hide = !this.can(field, 'allowFiltering');
                        const items: (string | ColumnMenuItemModel)[] = this.settings.columnMenuItems || [];
                        const metadata: ColumnMenuItemModel = items.filter(
                            (entry: string | ColumnMenuItemModel) => typeof entry === 'object' && entry.id === 'Filter')[0] as ColumnMenuItemModel;
                        if (metadata) {
                            if (metadata.text) { item.text = metadata.text; }
                            if (metadata.iconCss) { item.iconCss = metadata.iconCss; }
                        }
                    }
                    if (item.id === 'FlatAutoFit') { item.hide = !this.can(field, 'allowResizing'); }
                    if (item.id === 'FlatAutoFitAll') {
                        item.hide = !this.columns.some((column: ColumnModel) => this.can(column.field, 'allowResizing'));
                    }
                });
            },
            allowResizing: this.settings.allowResizing, allowReordering: this.settings.allowReordering,
            allowTextWrap: this.settings.allowTextWrap, textWrapSettings: this.settings.textWrapSettings,
            rowHeight: this.settings.rowHeight, gridLines: this.settings.gridLines, clipMode: this.settings.clipMode,
            dataStateChange: (state: DataStateChangeEventArgs) => this.dataState(state),
            created: () => parent.grid.on('beforeCheckboxRenderer', (args: { executeQuery: boolean }) => {
                args.executeQuery = false;
            }, this),
            actionBegin: (args: ActionEventArgs) => this.action(args),
            resizeStart: () => this.captureColumnSelection(),
            resizeStop: () => this.persistColumns(false),
            columnDragStart: () => this.captureColumnSelection(),
            columnDrop: () => Promise.resolve().then(() => this.persistColumns(true)),
            queryCellInfo: (args: QueryCellInfoEventArgs) => {
                if (generation !== flat.renderGeneration) { return; }
                const index: number = getValue('flatOrdinal', args.data);
                const field: string = this.field(args.column.field);
                if (this.columns.some((column: ColumnModel) => column.field === field && column.visible === false)) { return; }
                try {
                    if (this.settings.queryCellInfo) {
                        const detached: QueryCellInfoEventArgs = Object.assign({}, args, {
                            data: flat.project(index, 1)[0], column: this.physicalColumn(args.column)
                        });
                        this.settings.queryCellInfo.call(parent, detached);
                        if (detached.rowSpan > 1 || detached.colSpan > 1) { throw new Error('Flat layout does not support cell spanning.'); }
                    }
                } catch (error) {
                    flat.failRender(error instanceof Error ? error : new Error('Flat layout settings contain an invalid value.'));
                }
            },
            headerCellInfo: (args: HeaderCellInfoEventArgs) => {
                if (generation !== flat.renderGeneration || !this.settings.headerCellInfo ||
                    !args.cell || !args.cell.column || args.cell.column.visible === false) { return; }
                try {
                    this.settings.headerCellInfo.call(parent, Object.assign({}, args, {
                        cell: Object.assign({}, args.cell, { column: this.physicalColumn(args.cell.column) })
                    }));
                } catch (error) {
                    flat.failRender(error instanceof Error ? error : new Error('Flat header rendering failed.'));
                }
            },
            rowSelecting: (args: RowSelectingEventArgs) => this.selection('rowSelecting', args),
            rowDeselecting: (args: RowDeselectingEventArgs) => this.selection('rowDeselecting', args),
            rowSelected: (args: RowSelectEventArgs) => this.selection('rowSelected', args),
            rowDeselected: (args: RowDeselectEventArgs) => this.selection('rowDeselected', args),
            cellSelecting: (args: CellSelectingEventArgs) => this.selection('cellSelecting', args),
            cellSelected: (args: CellSelectEventArgs) => this.selection('cellSelected', args),
            cellDeselecting: (args: CellDeselectEventArgs) => this.selection('cellDeselecting', args),
            cellDeselected: (args: CellDeselectEventArgs) => this.selection('cellDeselected', args),
            dataBound: () => {
                if (generation !== flat.renderGeneration) { return; }
                parent.grid.element.setAttribute('aria-readonly', 'true');
                this.renderTotal();
                if (!completed) {
                    completed = true;
                    const fitted: string[] = this.columns.filter((column: ColumnModel) =>
                        column.visible !== false && column.autoFit === true).map((column: ColumnModel) => this.encoded(column.field));
                    if (fitted.length) { parent.grid.autoFitColumns(fitted, 1, 200); }
                    if (selected.length) { parent.grid.selectRows(selected); }
                    const nextIndex: (index: number) => number = (index: number): number => {
                        const descriptor: PropertyDescriptor = Object.getOwnPropertyDescriptor(previousFields, String(index));
                        return descriptor ? parent.grid.getColumnIndexByField(this.encoded(descriptor.value)) : -1;
                    };
                    if (cells.length) {
                        const restoredCells: ISelectedCell[] = cells.map((entry: ISelectedCell) => ({ rowIndex: entry.rowIndex,
                            cellIndexes: entry.cellIndexes.map(nextIndex).filter((index: number) => index !== -1)
                                .sort((a: number, b: number) => a - b) })).filter((entry: ISelectedCell) => entry.cellIndexes.length > 0);
                        if (restoredCells.length && parent.grid.selectionSettings.type === 'Single') {
                            parent.grid.selectCell({ rowIndex: restoredCells[0].rowIndex, cellIndex: restoredCells[0].cellIndexes[0] });
                        } else if (restoredCells.length) {
                            parent.grid.selectCells(restoredCells);
                        }
                    }
                    const viewport: HTMLElement = parent.grid.getContent().querySelector('.e-content') as HTMLElement;
                    if (viewport) { viewport.scrollLeft = left; viewport.scrollTop = top; }
                    const focusColumn: number = parent.grid.getColumnIndexByField(this.encoded(focusField));
                    if (focusRow !== undefined && focusColumn !== -1) {
                        const cell: HTMLElement = parent.grid.getCellFromIndex(focusRow, focusColumn) as HTMLElement;
                        if (cell) {
                            cell.focus();
                        }
                    }
                    if (notify) { flat.dataBound(); }
                }
            }
        });
        parent.grid.createElement = parent.createElement;
        parent.grid.print = () => flat.output.print();
        const element: HTMLElement = parent.createElement('div', { id: parent.element.id + '_grid' });
        parent.element.appendChild(element);
        parent.notEmpty = true; parent.isEmptyGrid = false;
        parent.grid.appendTo(element);
    }

    private selection(name: string, args: RowSelectingEventArgs | CellDeselectEventArgs): void {
        const project: (record: object) => FlatRecord = (record: object) =>
            this.parent.flatLayoutModule.project(getValue('flatOrdinal', record), 1)[0];
        const detached: RowSelectingEventArgs | CellDeselectEventArgs = Object.assign({}, args, {
            data: Array.isArray(args.data) ? args.data.map(project) : args.data ? project(args.data) : undefined
        });
        const callback: (args: RowSelectingEventArgs | CellDeselectEventArgs) => void = getValue(name, this.settings);
        if (callback) { callback.call(this.parent, detached); }
        args.cancel = detached.cancel;
    }

    private watchWidth(): void {
        if (!this.observer) {
            const Observer: new (callback: () => void) => { observe: (element: Element) => void; disconnect: () => void } =
                getValue('ResizeObserver', this.parent.element.ownerDocument.defaultView);
            if (Observer) {
                this.observer = new Observer(() => {
                    if (!this.parent.isDestroyed && this.parent.flatLayoutModule.active && this.parent.grid &&
                        this.pinningSuspended === flatPinsFit(this.settings, this.viewportWidth())) {
                        this.render(false);
                    }
                });
                this.observer.observe(this.parent.element);
            }
        }
        if (this.pinNotice && this.pinNotice.parentElement) { remove(this.pinNotice); }
        this.pinNotice = undefined;
        if (this.pinningSuspended) {
            this.pinNotice = this.parent.createElement('div', { className: 'e-pivot-flat-pin-notice', attrs: { role: 'status' } });
            this.pinNotice.textContent = this.parent.localeObj.getConstant('flatPinningSuspended');
            this.parent.element.appendChild(this.pinNotice);
        }
    }

    private schedule(settings: FlatSettingsModel): void {
        if (this.pending) { return; }
        this.pending = true;
        const generation: number = this.generation;
        Promise.resolve().then(() => {
            this.pending = false;
            if (this.parent.isDestroyed || this.parent.flatLayoutModule.renderGeneration !== generation) { return; }
            this.parent.setProperties({ flatSettings: settings }, false);
            this.parent.dataBind();
        });
    }

    private action(args: ActionEventArgs): void {
        if (args.requestType === 'searching') {
            args.cancel = true;
            this.schedule({ searchSettings: Object.assign({}, this.settings.searchSettings,
                                                          { key: this.parent.grid.searchSettings.key }) });
        } else if (args.requestType === 'columnstate') {
            args.cancel = true;
            this.captureColumnSelection();
            const current: Column[] = this.parent.grid.getColumns();
            const columns: ColumnModel[] = this.columns.filter((column: ColumnModel) =>
                current.some((entry: Column) => this.field(entry.field) === column.field && entry.visible !== false) ||
                this.settings.columns.some((entry: ColumnModel) => entry.field === column.field))
                .map((column: ColumnModel) => Object.assign(
                    {}, column, {
                        visible: current.filter((entry: Column) => this.field(entry.field) === column.field)[0].visible !== false
                    }));
            this.columnAction = true;
            this.schedule({ columns: columns, frozenColumns: Math.min(
                this.settings.frozenColumns || 0,
                columns.filter((column: ColumnModel) => column.visible !== false).length) });
        } else if (args.requestType === 'sorting') {
            args.cancel = true;
            const field: string = this.field(args.columnName);
            if (field && !this.can(field, 'allowSorting')) { return; }
            const sort: SortSettingsModel = cloneFlat(this.parent.grid.sortSettings);
            sort.columns = (sort.columns || []).map((entry: SortDescriptorModel) =>
                ({ field: this.field(entry.field), direction: entry.direction }));
            if (!field && (this.settings.sortSettings.columns || []).some((entry: SortDescriptorModel) =>
                !this.can(entry.field, 'allowSorting') && !sort.columns.some((candidate: SortDescriptorModel) =>
                    candidate.field === entry.field && candidate.direction === entry.direction))) { return; }
            this.schedule({ sortSettings: sort });
        } else if (args.requestType === 'filtering') {
            const field: string = this.field(args.currentFilteringColumn);
            if (args.action !== 'clear-filter' && field && !this.can(field, 'allowFiltering')) { args.cancel = true; return; }
            const columns: PredicateModel[] = (args.columns || this.parent.grid.filterSettings.columns || [])
                .map((entry: PredicateModel) => {
                    const predicate: PredicateModel = Object.assign({}, cloneFlat(entry), { field: this.field(entry.field) });
                    delete predicate.uid;
                    return predicate;
                });
            this.schedule({ filterSettings: Object.assign({}, this.settings.filterSettings, { columns: columns }) });
        } else if (args.requestType === 'paging') {
            args.cancel = true;
            this.schedule({ pageSettings: Object.assign({}, this.settings.pageSettings, {
                currentPage: Number(args.currentPage), pageSize: this.parent.grid.pageSettings.pageSize }) });
        } else if (args.requestType === 'refresh' && this.pending) { args.cancel = true; }
    }

    private dataState(state: DataStateChangeEventArgs): void {
        const flat: FlatLayout = this.parent.flatLayoutModule;
        if (this.parent.isDestroyed || this.generation !== flat.renderGeneration) { return; }
        if (state.dataSource) {
            const encoded: string = getValue('action.filterModel.options.field', state);
            const field: string = this.field(encoded);
            if (!field) { state.dataSource([]); return; }
            const search: string = getValue('action.filterModel.sInput.value', state) || '';
            const normalize: (value: string) => string = (value: string) => {
                const text: string = this.settings.filterSettings.ignoreAccent ? DataUtil.ignoreDiacritics(value) as string : value;
                return this.settings.filterSettings.enableCaseSensitivity ? text : text.toLocaleLowerCase.call(text, this.parent.locale);
            };
            const key: string = normalize(search);
            const values: FlatRecord[] = flat.query.facet(field).filter((value: FlatValue) => !key ||
                normalize(value === null ? '' : value instanceof Date ? value.toLocaleDateString(this.parent.locale) : String(value))
                    .indexOf(key) !== -1).map((value: FlatValue) => ({ [encoded]: value }));
            state.dataSource(this.settings.filterSettings.enableInfiniteScrolling ? {
                result: values.slice(state.skip || 0, (state.skip || 0) + (state.take || values.length)), count: values.length
            } : values);
            return;
        }
        if (this.pending) { return; }
        this.parent.grid.dataSource = {
            result: flat.columns.length ? this.frame(state.skip || 0, state.take || flat.query.ordinals.length) : [],
            count: flat.columns.length ? flat.query.ordinals.length : 0, aggregates: this.aggregateValues() };
    }

    private mapAdvanced(): AdvancedFilterSettingsModel {
        const settings: AdvancedFilterSettingsModel = cloneFlat(this.settings.advancedFilterSettings || {});
        const map: (rule: RuleModel) => RuleModel = (rule: RuleModel): RuleModel => {
            if (!rule) { return rule; }
            if (rule.rules) { rule.rules = rule.rules.map(map); }
            else if (rule.field) { rule.field = this.encoded(rule.field); }
            return rule;
        };
        settings.queryBuilderSettings = settings.queryBuilderSettings || {};
        const hasCondition: (rule: RuleModel) => boolean = (rule: RuleModel): boolean =>
            !!rule && (!!rule.not || (rule.rules ? rule.rules.some(hasCondition) : !!rule.field));
        const rule: RuleModel = settings.queryBuilderSettings.rule;
        settings.queryBuilderSettings.rule = hasCondition(rule) ? map(rule) : undefined;
        return settings;
    }

    private advanced(args: AdvancedFilterBeginArgs): void {
        args.cancel = true;
        const rule: RuleModel = cloneFlat(args.rule || { condition: 'and', rules: [] });
        const map: (entry: RuleModel) => void = (entry: RuleModel): void => {
            if (entry.rules) { entry.rules.forEach(map); }
            else if (entry.field) { entry.field = this.field(entry.field); }
        };
        map(rule);
        const previous: RuleModel = this.settings.advancedFilterSettings.queryBuilderSettings.rule;
        const protectedRules: (entry: RuleModel, parents?: string[]) => string[] =
            (entry: RuleModel, parents: string[] = []) => {
                if (!entry) { return []; }
                if (entry.rules) {
                    return entry.rules.reduce((all: string[], child: RuleModel) => all.concat(protectedRules(child,
                                                                                                             parents.concat(String(entry.condition) + ':' + !!entry.not))), []);
                }
                const column: ColumnModel = this.columns.filter((item: ColumnModel) => item.field === entry.field)[0];
                return column && column.allowFiltering === false ? [JSON.stringify([parents, entry])] : [];
            };
        const clearing: boolean = rule.rules && rule.rules.length === 0;
        const permitted: boolean = this.settings.allowAdvancedFiltering && (clearing ||
            JSON.stringify(protectedRules(previous).sort()) === JSON.stringify(protectedRules(rule).sort()));
        if (!permitted) {
            this.pending = true;
            Promise.resolve().then(() => {
                if (this.parent.isDestroyed) { return; }
                this.render(false);
                this.parent.actionFailureMethod(new Error(this.parent.localeObj.getConstant('flatFilteringDisabled')));
            });
            return;
        }
        this.schedule({ advancedFilterSettings: Object.assign(
            {}, this.settings.advancedFilterSettings, {
                queryBuilderSettings: Object.assign(
                    {}, this.settings.advancedFilterSettings.queryBuilderSettings, { rule: rule })
            }) });
    }

    private menuItems(): (string | ColumnMenuItemModel)[] {
        const defaults: string[] = ['SortAscending', 'SortDescending', 'Filter', 'AutoFit', 'AutoFitAll', 'ColumnChooser'];
        const items: (string | ColumnMenuItemModel)[] = this.settings.columnMenuItems || defaults;
        return items.filter((item: string | ColumnMenuItemModel) => {
            const id: string = typeof item === 'string' ? item : item.id;
            return id !== 'ColumnChooser' || this.settings.showColumnChooser;
        }).map((item: string | ColumnMenuItemModel) => {
            const id: string = typeof item === 'string' ? item : item.id;
            if (id === 'ColumnChooser') { return item; }
            const metadata: ColumnMenuItemModel = typeof item === 'object' ? cloneFlat(item) : {};
            if (id === 'Filter') { return 'Filter'; }
            if (['AutoFit', 'AutoFitAll'].indexOf(id) !== -1) {
                return Object.assign(metadata, { id: 'Flat' + id, text: metadata.text ||
                    this.parent.localeObj.getConstant('flat' + id) });
            }
            if (id.indexOf('FlatFreeze') === 0 || id === 'FlatUnfreeze') {
                return Object.assign(metadata, { id: id, text: metadata.text ||
                    this.parent.localeObj.getConstant(id.charAt(0).toLowerCase() + id.slice(1)) });
            }
            return typeof item === 'string' ? item : Object.assign({}, item,
                                                                   { id: this.parent.element.id + '_grid_colmenu_' + id });
        });
    }

    private menu(id: string, field: string): void {
        const descriptor: ColumnModel = this.settings.columns.filter((column: ColumnModel) => column.field === field)[0];
        if (!this.settings.showColumnMenu || !descriptor || descriptor.showColumnMenu === false) { return; }
        if (id === 'FlatAutoFit' || id === 'FlatAutoFitAll') { this.autoFit(id === 'FlatAutoFit' ? field : undefined); return; }
        let direction: ColumnModel['freeze'];
        switch (id) {
        case 'FlatFreezeLeft':
            direction = 'Left';
            break;
        case 'FlatFreezeRight':
            direction = 'Right';
            break;
        case 'FlatFreezeFixed':
            direction = 'Fixed';
            break;
        case 'FlatUnfreeze':
            direction = 'None';
            break;
        }
        if (direction) {
            const columns: ColumnModel[] = cloneFlat(this.settings.columns);
            if (this.settings.frozenColumns) {
                columns.filter((column: ColumnModel) => column.visible !== false).slice(0, this.settings.frozenColumns)
                    .forEach((column: ColumnModel) => { column.freeze = 'Left'; });
            }
            const column: ColumnModel = columns.filter((entry: ColumnModel) => entry.field === field)[0];
            column.freeze = direction;
            column.isFrozen = false;
            this.schedule({ columns: columns, frozenColumns: 0 });
        }
    }

    private autoFit(field?: string): void {
        const grid: Grid = this.parent.grid;
        const fields: string[] = this.columns.filter((column: ColumnModel) => column.visible !== false &&
            (!field || field === column.field) && this.can(column.field, 'allowResizing'))
            .map((column: ColumnModel) => this.encoded(column.field));
        if (!fields.length) { return; }
        this.captureColumnSelection();
        grid.autoFitColumns(fields, 1, 200);
        this.persistColumns(false);
    }

    private persistColumns(reorder: boolean): void {
        const current: Column[] = this.parent.grid.getColumns();
        const selected: ColumnModel[] = this.columns.filter((column: ColumnModel) =>
            this.settings.columns.some((entry: ColumnModel) => entry.field === column.field));
        const columns: ColumnModel[] = reorder ? current.filter((column: Column) => selected.some(
            (entry: ColumnModel) => entry.field === this.field(column.field))).map((column: Column) =>
            cloneFlat(this.columns[Number(column.field.slice(4))])) : cloneFlat(selected);
        columns.forEach((column: ColumnModel) => {
            const native: Column = current.filter((entry: Column) => this.field(entry.field) === column.field)[0];
            if (native && this.can(column.field, 'allowResizing')) {
                column.width = typeof native.width === 'string' && native.width.trim().endsWith('px') ?
                    parseFloat(native.width) : native.width;
            }
        });
        if (JSON.stringify(columns) === JSON.stringify(this.settings.columns)) { this.columnSelection = undefined; return; }
        this.columnAction = true;
        this.schedule({ columns: columns });
    }

    private captureColumnSelection(): void {
        const grid: Grid = this.parent.grid;
        const focused: HTMLElement = this.parent.element.ownerDocument.activeElement as HTMLElement;
        const info: RowInfo = grid.element.contains(focused) && focused.closest('.e-rowcell') ? grid.getRowInfo(focused) : undefined;
        const column: Column = info && info.column as Column;
        this.columnSelection = { rows: grid.allowSelection ? grid.getSelectedRowIndexes().slice() : [],
            cells: grid.allowSelection ? cloneFlat(grid.getSelectedRowCellIndexes()) : [],
            fields: grid.getColumns().map((entry: Column) => this.field(entry.field)),
            focus: column ? { row: info.rowIndex, field: this.field(column.field) } : undefined };
    }

    private nativeSummaries(): AggregateRowModel[] {
        const values: { [field: string]: FlatValue } = this.parent.flatLayoutModule.summaries.values;
        const aggregates: AggregateColumnModel[] = this.settings.aggregates && this.settings.aggregates[0] &&
            this.settings.aggregates[0].columns || [];
        const columns: AggregateColumnModel[] = aggregates.filter((aggregate: AggregateColumnModel) =>
            Object.prototype.hasOwnProperty.call(values, aggregate.field)).map((aggregate: AggregateColumnModel) => ({
            field: this.encoded(aggregate.field), type: aggregate.type, format: aggregate.format,
            customAggregate: aggregate.type === 'Custom' ? () => values[aggregate.field] : undefined,
            footerTemplate: (data: { [key: string]: FlatValue }) => {
                const span: HTMLElement = this.parent.createElement('span');
                const value: FlatValue = data[aggregate.type as string];
                span.textContent = value === undefined || value === null ? '' : String(value);
                return [span];
            }
        }));
        return columns.length ? [{ columns: columns }] : [];
    }

    private aggregateValues(): { [key: string]: FlatValue } {
        const values: { [field: string]: FlatValue } = this.parent.flatLayoutModule.summaries.values;
        const result: { [key: string]: FlatValue } = Object.create(null);
        const row: AggregateRowModel = this.settings.aggregates && this.settings.aggregates[0];
        (row && row.columns || []).forEach((column: AggregateColumnModel) => {
            if (Object.prototype.hasOwnProperty.call(values, column.field)) {
                result[this.encoded(column.field) + ' - ' + (column.type as string).toLowerCase()] = values[column.field];
            }
        });
        return result;
    }

    private renderTotal(): void {
        this.total = this.parent.grid.element.querySelector('.e-gridfooter') as HTMLElement;
        if (!this.total) { return; }
        this.total.classList.add('e-pivot-flat-totals');
        this.total.setAttribute('aria-label', this.parent.localeObj.getConstant('total'));
        if (this.settings.totalsPosition === 'Top') {
            this.parent.grid.element.insertBefore(this.total, this.parent.grid.getContent());
        }
    }

    private removeTotal(): void { this.total = undefined; }

    /**
     * Clears Grid-adapter references; the parent owns Grid destruction.
     *
     * @returns {void}
     * @hidden
     */
    public destroy(): void {
        if (this.observer) { this.observer.disconnect(); this.observer = undefined; }
        if (this.pinNotice && this.pinNotice.parentElement) { remove(this.pinNotice); }
        this.pinNotice = undefined;
        this.renderedStore = undefined; this.renderedOrdinals = [];
        this.columnSelection = undefined; this.columnAction = false;
        this.removeTotal(); this.columns = []; this.settings = undefined;
    }
}
