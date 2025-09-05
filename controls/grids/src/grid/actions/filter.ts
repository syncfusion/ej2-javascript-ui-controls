import { EventHandler, L10n, isNullOrUndefined, extend, closest, getValue, KeyboardEventArgs } from '@syncfusion/ej2-base';
import { getActualPropFromColl, isActionPrevent, getColumnByForeignKeyValue } from '../base/util';
import { remove, matches } from '@syncfusion/ej2-base';
import { DataUtil, Predicate, Query, DataManager } from '@syncfusion/ej2-data';
import { FilterSettings } from '../base/grid';
import { IGrid, IAction, NotifyArgs, IFilterOperator, IValueFormatter, FilterUI, EJ2Intance, CustomOperators } from '../base/interface';
import * as events from '../base/constant';
import { CellType, ResponsiveDialogAction } from '../base/enum';
import { PredicateModel } from '../base/grid-model';
import { RowRenderer } from '../renderer/row-renderer';
import { ServiceLocator } from '../services/service-locator';
import { CellRendererFactory } from '../services/cell-render-factory';
import { Column } from '../models/column';
import { Cell } from '../models/cell';
import { Row } from '../models/row';
import { FilterCellRenderer } from '../renderer/filter-cell-renderer';
import { parentsUntil, addFixedColumnBorder, applyStickyLeftRightPosition } from '../base/util';
import { FilterMenuRenderer } from '../renderer/filter-menu-renderer';
import { CheckBoxFilter } from '../actions/checkbox-filter';
import { ExcelFilter } from '../actions/excel-filter';
import { ResponsiveDialogRenderer } from '../renderer/responsive-dialog-renderer';
import * as literals from '../base/string-literals';
import { Input, InputArgs } from '@syncfusion/ej2-inputs';
import { CheckBoxFilterBase } from '../common/checkbox-filter-base';
import { ExcelFilterBase } from '../common/excel-filter-base';

/**
 *
 * The `Filter` module is used to handle filtering action.
 */
export class Filter implements IAction {
    //Internal variables
    private filterSettings: FilterSettings;
    private element: Element;
    private value: string | number | Date | boolean;
    private predicate: string = 'and';
    private operator: string;
    private column: Column;
    private fieldName: string;
    private matchCase: boolean;
    private ignoreAccent: boolean;
    private timer: number;
    private filterStatusMsg: string;
    private currentFilterObject: PredicateModel;
    private isRemove: boolean;
    private contentRefresh: boolean = true;
    private initialLoad: boolean;
    private filterByMethod: boolean = true;
    private refresh: boolean = true;
    private values: Object = {};
    public operators: Object = {};
    private cellText: Object = {};
    private nextFlMenuOpen: string = '';
    private refreshFilterValueFn: () => void;
    private type: Object = { 'Menu': FilterMenuRenderer, 'CheckBox': CheckBoxFilter, 'Excel': ExcelFilter };
    /** @hidden */
    public filterModule: {
        openDialog: Function, closeDialog: Function, destroy: Function
        isresetFocus: boolean, getFilterUIInfo: Function, clearCustomFilter: Function,
        closeResponsiveDialog: Function, applyCustomFilter: Function, renderCheckBoxMenu?: Function,
        afterRenderFilterUI?: Function, checkBoxBase: CheckBoxFilterBase, excelFilterBase: ExcelFilterBase,
        isDialogOpen?: boolean, getOperatorDropdown?: Function
    };
    /** @hidden */
    public filterOperators: IFilterOperator = {
        contains: 'contains', endsWith: 'endswith', equal: 'equal', greaterThan: 'greaterthan', greaterThanOrEqual: 'greaterthanorequal',
        lessThan: 'lessthan', lessThanOrEqual: 'lessthanorequal', notEqual: 'notequal', startsWith: 'startswith', wildCard: 'wildcard',
        isNull: 'isnull', notNull: 'notnull', like: 'like'
    };
    private fltrDlgDetails: { field?: string, isOpen?: boolean } = { field: '', isOpen: false };

    public customOperators: CustomOperators;
    /** @hidden */
    public skipNumberInput: string[] = ['=', ' ', '!'];
    public skipStringInput: string[] = ['>', '<', '='];
    //Module declarations
    /** @hidden */
    public parent: IGrid;
    /** @hidden */
    public serviceLocator: ServiceLocator;
    private l10n: L10n;
    private valueFormatter: IValueFormatter;
    private actualPredicate: { [key: string]: PredicateModel[] } = {};
    public prevFilterObject: PredicateModel;
    public checkboxPrevFilterObject: { field: string; }[];
    public checkboxFilterObject: Object[];
    public actualData: string[];
    public filterObjIndex: number;
    /** @hidden */
    public responsiveDialogRenderer: ResponsiveDialogRenderer;
    public menuOperator: { [key: string]: Object }[];
    private docClickHandler: Function;
    /** @hidden */
    public inputList: InputArgs[] = [];

    /**
     * Constructor for Grid filtering module
     *
     * @param {IGrid} parent - specifies the IGrid
     * @param {FilterSettings} filterSettings - specifies the filterSettings
     * @param {ServiceLocator} serviceLocator - specifes the serviceLocator
     * @hidden
     */
    constructor(parent?: IGrid, filterSettings?: FilterSettings, serviceLocator?: ServiceLocator) {
        this.parent = parent;
        this.filterSettings = filterSettings;
        this.serviceLocator = serviceLocator;
        this.addEventListener();
        this.setFullScreenDialog();
    }

    /**
     * To render filter bar when filtering enabled.
     *
     * @param {NotifyArgs} e - specifies the NotifyArgs
     * @returns {void}
     * @hidden
     */
    public render(e?: NotifyArgs): void {
        if (DataUtil.getObject('args.isFrozen', e)) {
            return;
        }
        const gObj: IGrid = this.parent;
        this.l10n = this.serviceLocator.getService<L10n>('localization');
        this.getLocalizedCustomOperators();
        if (this.parent.filterSettings.type === 'FilterBar') {
            if (gObj.columns.length) {
                const fltrElem: Element = this.parent.element.querySelector('.e-filterbar');
                if (fltrElem) {
                    remove(fltrElem);
                }
                const rowRenderer: RowRenderer<Column> = new RowRenderer<Column>(this.serviceLocator, CellType.Filter, gObj);
                const cellrender: CellRendererFactory = this.serviceLocator.getService<CellRendererFactory>('cellRendererFactory');
                cellrender.addCellRenderer(CellType.Filter, new FilterCellRenderer(this.parent, this.serviceLocator));
                this.valueFormatter = this.serviceLocator.getService<IValueFormatter>('valueFormatter');
                rowRenderer.element = this.parent.createElement('tr', { className: 'e-filterbar', attrs: { role: 'row' } });
                const row: Row<Column> = this.generateRow();
                row.data = this.values;
                this.parent.getHeaderContent().querySelector('thead:not(.e-masked-thead)').appendChild(rowRenderer.element);
                const rowdrag: Element = this.parent.element.querySelector('.e-rowdragheader');
                this.element = rowRenderer.render(row, <Column[]>gObj.getColumns(), null, null, rowRenderer.element);
                if (this.element.querySelectorAll('.e-leftfreeze').length &&
                    (this.element.querySelectorAll('.e-indentcell').length || this.element.querySelectorAll('.e-grouptopleftcell').length)) {
                    const td: NodeListOf<Element> = this.element.querySelectorAll('.e-indentcell, .e-grouptopleftcell');
                    for (let i: number = 0; i < td.length; i++) {
                        td[parseInt(i.toString(), 10)].classList.add('e-leftfreeze');
                        applyStickyLeftRightPosition(td[parseInt(i.toString(), 10)] as HTMLElement, i * 30, this.parent.enableRtl, 'Left');
                    }
                }
                addFixedColumnBorder(this.element);
                const detail: Element = this.element.querySelector('.e-detailheadercell');
                if (detail) {
                    detail.className = 'e-filterbarcell e-mastercell';
                }
                if (rowdrag) {
                    if ( rowdrag.classList.contains('e-leftfreeze')) {
                        rowdrag.className = 'e-dragheadercell e-mastercell e-leftfreeze';
                    } else {
                        rowdrag.className = 'e-filterbarcell e-mastercell';
                    }
                }
                const gCells: Element[] = [].slice.call(this.element.getElementsByClassName('e-grouptopleftcell'));
                if (gCells.length) {
                    gCells[gCells.length - 1].classList.add('e-lastgrouptopleftcell');
                }
                this.wireEvents();
                this.parent.notify(events.freezeRender, { case: 'filter' });
            }
        }
    }

    /**
     * To show the responsive custom filter dialog
     *
     * @param {boolean} enable - specifes dialog open
     * @returns {void}
     * @hidden
     */
    public showCustomFilter(enable: boolean): void {
        this.responsiveDialogRenderer.isCustomDialog = enable;
        this.responsiveDialogRenderer.showResponsiveDialog(this.column);
    }

    private renderResponsiveChangeAction(args: { action?: number }): void {
        this.responsiveDialogRenderer.action = args.action;
    }

    /**
     * To create the filter module.
     *
     * @param {Column} col - specifies the filtering column name
     * @returns {void}
     * @hidden
     */
    public setFilterModel(col: Column): void {
        const type: string = col.filter.type || this.parent.filterSettings.type;
        this.filterModule = new this.type[`${type}`](this.parent, this.parent.filterSettings, this.serviceLocator, this.customOperators, this);
    }

    /**
     * To destroy the filter bar.
     *
     * @returns {void}
     * @hidden
     */
    public destroy(): void {
        const gridElement: Element = this.parent.element;
        if (!gridElement || (!gridElement.querySelector('.' + literals.gridHeader) && !gridElement.querySelector( '.' + literals.gridContent))) { return; }
        if (this.filterModule) {
            this.filterModule.destroy();
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (!(<any>this.parent).refreshing && (this.parent.isDestroyed || !this.parent.allowFiltering)) {
            this.filterSettings.columns = [];
        }
        this.updateFilterMsg();
        this.removeEventListener();
        this.unWireEvents();
        if (this.filterSettings.type === 'FilterBar' && !this.parent.isDestroyed) {
            if (this.filterSettings.showFilterBarOperator) {
                const dropdownlist: NodeListOf<Element> = [].slice.call(this.element.getElementsByClassName('e-filterbaroperator'));
                for (let i: number = 0; i < dropdownlist.length; i++) {
                    if ((<EJ2Intance>dropdownlist[parseInt(i.toString(), 10)]).ej2_instances[0]) {
                        (<EJ2Intance>dropdownlist[parseInt(i.toString(), 10)]).ej2_instances[0].destroy();
                    }
                }
            }
            this.parent.getColumns().map((column: Column) => {
                if (column.filterBarTemplate && !isNullOrUndefined(column.filterBarTemplate.destroy)) {
                    let destroyFn: Function | string = column.filterBarTemplate.destroy;
                    if (typeof destroyFn === 'string') {
                        destroyFn = getValue(destroyFn, window);
                    }
                    (destroyFn as Function)();
                }
            });
        }
        if (this.element) {
            if (this.element.parentElement) {
                for (let i: number = 0; i < this.inputList.length; i++) {
                    Input.destroy(this.inputList[parseInt(i.toString(), 10)],
                                  this.inputList[parseInt(i.toString(), 10)].element.nextElementSibling as HTMLElement);
                    remove(this.inputList[parseInt(i.toString(), 10)].element);
                }
                this.inputList = [];
                remove(this.element);
                this.element = null;
            }
            const filterBarElement: Element = this.parent.getHeaderContent().querySelector('.e-filterbar');
            if (filterBarElement) {
                remove(filterBarElement);
            }
        }
    }

    private setFullScreenDialog(): void {
        if (this.serviceLocator) {
            this.serviceLocator.registerAdaptiveService(this, this.parent.enableAdaptiveUI, ResponsiveDialogAction.isFilter);
        }
    }

    private generateRow(): Row<Column> {
        const options: { [o: string]: Object } = {};
        const row: Row<Column> = new Row<Column>(options);
        row.cells = this.generateCells();
        return row;
    }

    private generateCells(): Cell<Column>[] {
        //TODO: generate dummy column for group, detail, stacked row here for filtering;
        const cells: Cell<Column>[] = [];
        if (this.parent.allowGrouping) {
            for (let c: number = 0, len: number = this.parent.groupSettings.columns.length; c < len; c++) {
                cells.push(this.generateCell({} as Column, CellType.HeaderIndent));
            }
        }
        if (this.parent.detailTemplate || this.parent.childGrid) {
            cells.push(this.generateCell({} as Column, CellType.DetailHeader));
        }
        if (this.parent.isRowDragable() && this.parent.getFrozenMode() !== 'Right') {
            cells.push(this.generateCell({} as Column, CellType.RowDragHIcon));
        }
        for (const dummy of this.parent.getColumns() as Column[]) {
            cells.push(this.generateCell(dummy));
        }
        if (this.parent.isRowDragable() && this.parent.getFrozenMode() === 'Right') {
            cells.push(this.generateCell({} as Column, CellType.RowDragHIcon));
        }
        return cells;
    }

    private generateCell(column: Column, cellType?: CellType): Cell<Column> {
        const opt: { [o: string]: Object } = {
            'visible': column.visible,
            'isDataCell': false,
            'rowId': '',
            'column': column,
            'cellType': cellType ? cellType : CellType.Filter,
            'attributes': { title: this.l10n.getConstant('FilterbarTitle') }
        };
        return new Cell<Column>(opt);
    }

    /**
     * To update filterSettings when applying filter.
     *
     * @returns {void}
     * @hidden
     */
    public updateModel(): void {
        const col: Column = this.column.isForeignColumn() || this.parent.enableColumnVirtualization ?
            this.parent.getColumnByUid(this.column.uid, true) : this.parent.getColumnByField(this.fieldName);
        this.filterObjIndex =  this.getFilteredColsIndexByField(col);
        this.prevFilterObject = this.filterSettings.columns[this.filterObjIndex];
        let arrayVal: (string | number | Date | boolean)[] = Array.isArray(this.value) && this.value.length ? this.value : [this.value];
        const moduleName : string = (this.parent.dataSource as DataManager).adaptor && (<{ getModuleName?: Function }>(
            this.parent.dataSource as DataManager).adaptor).getModuleName ? (<{ getModuleName?: Function }>(
                this.parent.dataSource as DataManager).adaptor).getModuleName() : undefined;
        for (let i: number = 0, len: number = arrayVal.length; i < len; i++) {
            const field: string = col.isForeignColumn() ? col.foreignKeyValue : this.fieldName;
            const isMenuNotEqual: boolean = this.operator === 'notequal';
            if (this.operator === 'in' || this.operator === 'notin') {
                if (this.parent.getDataModule().isRemote() && (col.type === 'date' || col.type === 'dateonly' || col.type === 'datetime')){
                    arrayVal = DataUtil.parse.arrayReplacer(arrayVal);
                }
                this.currentFilterObject = {
                    field: field, uid: col.uid, isForeignKey: col.isForeignColumn(), operator: this.operator,
                    value: arrayVal, predicate: this.predicate,
                    matchCase: this.matchCase, ignoreAccent: this.ignoreAccent, actualFilterValue: {}, actualOperator: {}
                };
                len = 0;
            } else {
                this.currentFilterObject = {
                    field: field, uid: col.uid, isForeignKey: col.isForeignColumn(), operator: this.operator,
                    value: arrayVal[parseInt(i.toString(), 10)], predicate: this.predicate,
                    matchCase: this.matchCase, ignoreAccent: this.ignoreAccent, actualFilterValue: {}, actualOperator: {}
                };
            }
            const index: number = this.getFilteredColsIndexByField(col);
            if (index > -1 && (!Array.isArray(this.value) || (Array.isArray(this.value) && (this.operator === 'in' || this.operator === 'notin')))) {
                this.filterSettings.columns[parseInt(index.toString(), 10)] = this.currentFilterObject;
            } else {
                this.filterSettings.columns.push(this.currentFilterObject);
            }
            if (!this.column.isForeignColumn() && (this.prevFilterObject && (isNullOrUndefined(this.prevFilterObject.value)
                || this.prevFilterObject.value === '') && (this.prevFilterObject.operator === 'equal'
                || this.prevFilterObject.operator === 'notequal')) && (moduleName !== 'ODataAdaptor' && moduleName !== 'ODataV4Adaptor')) {
                this.handleExistingFilterCleanup(field);
            }
            if (!this.column.isForeignColumn() && isNullOrUndefined(this.value) && (this.operator === 'equal' ||
                this.operator === 'notequal') && (moduleName !== 'ODataAdaptor' && moduleName !== 'ODataV4Adaptor')) {
                this.handleExistingFilterCleanup(field);
                if (col.type === 'string') {
                    this.filterSettings.columns.push({
                        field: field, ignoreAccent: this.ignoreAccent, matchCase: this.matchCase,
                        operator: this.operator, predicate: isMenuNotEqual ? 'and' : 'or', value: ''
                    });
                }
                this.filterSettings.columns.push({
                    field: field, ignoreAccent: this.ignoreAccent, matchCase: this.matchCase,
                    operator: this.operator, predicate: isMenuNotEqual ? 'and' : 'or', value: undefined
                });
                this.filterSettings.columns.push({
                    field: field, ignoreAccent: this.ignoreAccent, matchCase: this.matchCase,
                    operator: this.operator, predicate: isMenuNotEqual ? 'and' : 'or', value: null
                });
            }
        }
        // eslint-disable-next-line no-self-assign
        this.filterSettings.columns = this.filterSettings.columns;
        this.parent.dataBind();
    }

    private handleExistingFilterCleanup(field: string): void {
        for (let i: number = 0; i < this.filterSettings.columns.length; i++) {
            if (this.filterSettings.columns[`${i}`].field === field &&
                (this.filterSettings.columns[`${i}`].operator === 'equal' ||
                this.filterSettings.columns[`${i}`].operator === 'notequal') &&
                isNullOrUndefined(this.filterSettings.columns[`${i}`].value)) {
                this.filterSettings.columns.splice(i, 1);
                i = i - 1;
            }
        }
    }

    private getFilteredColsIndexByField(col: Column): number {
        const cols: PredicateModel[] = this.filterSettings.columns;
        for (let i: number = 0, len: number = cols.length; i < len; i++) {
            if (cols[parseInt(i.toString(), 10)].uid === col.uid || (col.isForeignColumn()
                && this.parent.getColumnByUid(col.uid).field === col.foreignKeyValue)) {
                return i;
            }
        }
        return -1;
    }

    /**
     * To trigger action complete event.
     *
     * @param {NotifyArgs} e - specifies the NotifyArgs
     * @returns {void}
     * @hidden
     */
    public onActionComplete(e: NotifyArgs): void {
        const args: Object = !this.isRemove ? {
            currentFilterObject: this.currentFilterObject,
            /* tslint:disable:no-string-literal */
            currentFilteringColumn: !isNullOrUndefined(this.column) ? this.column.field : undefined,
            /* tslint:enable:no-string-literal */
            columns: this.filterSettings.columns, requestType: 'filtering', type: events.actionComplete
        } : {
            requestType: 'filtering', type: events.actionComplete
        };
        this.parent.trigger(events.actionComplete, extend(e, args));
        this.isRemove = false;
    }

    private wireEvents(): void {
        EventHandler.add(this.parent.getHeaderContent(), 'keyup', this.keyUpHandlerImmediate, this);
    }

    private unWireEvents(): void {
        EventHandler.remove(this.parent.getHeaderContent(), 'keyup', this.keyUpHandlerImmediate);
    }


    private enableAfterRender(e: NotifyArgs): void {
        if (e.module === this.getModuleName() && e.enable) {
            this.parent.getHeaderTable().classList.add('e-sortfilter');
            this.render();
        }
    }

    private refreshFilterValue(): void {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (!isNullOrUndefined((this.parent as any).modelObserver.boundedEvents)) {
            this.parent.removeEventListener(events.beforeDataBound, this.refreshFilterValueFn);
        }
        if ((this.filterSettings.type === 'FilterBar' || this.filterSettings.type === 'Excel') && this.filterSettings.columns.length &&
            !this.parent.getCurrentViewRecords().length) {
            this.initialEnd();
        }
    }

    private initialEnd(): void {
        this.parent.off(events.contentReady, this.initialEnd);
        if (this.parent.getColumns().length && this.filterSettings.columns.length) {
            const gObj: IGrid = this.parent;
            this.contentRefresh = false;
            this.initialLoad = true;
            for (const col of gObj.filterSettings.columns) {
                this.filterByColumn(
                    col.field, col.operator, col.value as string, col.predicate, col.matchCase,
                    col.ignoreAccent, col.actualFilterValue, col.actualOperator, col.isForeignKey
                );
            }
            this.initialLoad = false;
            this.updateFilterMsg();
            this.contentRefresh = true;
        }
    }

    /**
     * @returns {void}
     * @hidden
     */
    public addEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.on(events.setFullScreenDialog, this.setFullScreenDialog, this);
        this.parent.on(events.uiUpdate, this.enableAfterRender, this);
        this.parent.on(events.filterComplete, this.onActionComplete, this);
        this.parent.on(events.inBoundModelChanged, this.onPropertyChanged, this);
        this.parent.on(events.keyPressed, this.keyUpHandler, this);
        this.parent.on(events.columnPositionChanged, this.columnPositionChanged, this);
        this.parent.on(events.headerRefreshed, this.render, this);
        this.parent.on(events.contentReady, this.initialEnd, this);
        this.parent.on(events.filterMenuClose, this.filterMenuClose, this);
        this.parent.on(events.renderResponsiveChangeAction, this.renderResponsiveChangeAction, this);
        this.docClickHandler = this.clickHandler.bind(this);
        EventHandler.add(document, 'click', this.docClickHandler, this);
        EventHandler.add(this.parent.element, 'mousedown', this.refreshClearIcon, this);
        this.parent.on(events.filterOpen, this.columnMenuFilter, this);
        this.parent.on(events.click, this.filterIconClickHandler, this);
        this.parent.on('persist-data-changed', this.initialEnd, this);
        this.parent.on(events.closeFilterDialog, this.clickHandler, this);
        this.parent.on(events.destroy, this.destroy, this);
        this.refreshFilterValueFn = this.refreshFilterValue.bind(this);
        this.parent.addEventListener(events.beforeDataBound, this.refreshFilterValueFn);
    }

    /**
     * @returns {void}
     * @hidden
     */
    public removeEventListener(): void {
        EventHandler.remove(document, 'click', this.docClickHandler);
        EventHandler.remove(this.parent.element, 'mousedown', this.refreshClearIcon);
        if (this.parent.isDestroyed) { return; }
        this.parent.off(events.setFullScreenDialog, this.setFullScreenDialog);
        this.parent.off(events.uiUpdate, this.enableAfterRender);
        this.parent.off(events.filterComplete, this.onActionComplete);
        this.parent.off(events.inBoundModelChanged, this.onPropertyChanged);
        this.parent.off(events.keyPressed, this.keyUpHandler);
        this.parent.off(events.columnPositionChanged, this.columnPositionChanged);
        this.parent.off(events.headerRefreshed, this.render);
        this.parent.off(events.filterOpen, this.columnMenuFilter);
        this.parent.off(events.filterMenuClose, this.filterMenuClose);
        this.parent.off(events.renderResponsiveChangeAction, this.renderResponsiveChangeAction);
        this.parent.off(events.click, this.filterIconClickHandler);
        this.parent.off(events.closeFilterDialog, this.clickHandler);
        this.parent.off(events.destroy, this.destroy);
    }

    private refreshClearIcon(e: Event): void {
        if (this.parent.allowFiltering && this.parent.filterSettings.type === 'FilterBar' &&
         (e.target as Element).closest('th') && (e.target as Element).closest('th').classList.contains('e-filterbarcell') &&
         (e.target as Element).classList.contains('e-clear-icon')) {
            const targetText: HTMLInputElement = (e.target as Element).previousElementSibling as  HTMLInputElement;
            Input.setValue(null, targetText as HTMLInputElement | HTMLTextAreaElement, 'Never', true);
            if (this.filterSettings.mode === 'Immediate') {
                this.removeFilteredColsByField(targetText.id.slice(0, -14)); //Length of _filterBarcell = 14
            }
        }
    }

    private filterMenuClose(): void {
        this.fltrDlgDetails.isOpen = false;
    }

    /**
     * Filters the Grid row by fieldName, filterOperator, and filterValue.
     *
     * @param  {string} fieldName - Defines the field name of the filter column.
     * @param  {string} filterOperator - Defines the operator to filter records.
     * @param  {string | number | Date | boolean} filterValue - Defines the value which is used to filter records.
     * @param  {string} predicate - Defines the relationship of one filter query with another by using AND or OR predicate.
     * @param  {boolean} matchCase - If match case is set to true, then the filter records
     * the exact match or <br> filters records that are case insensitive (uppercase and lowercase letters treated the same).
     * @param {boolean} ignoreAccent - If ignoreAccent set to true, then filter ignores the diacritic characters or accents while filtering.
     * @param  {string} actualFilterValue - Defines the actual filter value for the filter column.
     * @param  {string} actualOperator - Defines the actual filter operator for the filter column.
     * @param  {boolean} isForeignColumn - Defines whether it is a foreign key column.
     * @returns {void}
     */
    public filterByColumn(
        fieldName: string, filterOperator: string, filterValue: string | number | Date | boolean| number[]| string[]| Date[]| boolean[],
        predicate?: string, matchCase?: boolean,
        ignoreAccent?: boolean, actualFilterValue?: Object, actualOperator?: Object, isForeignColumn?: boolean): void {
        const gObj: IGrid = this.parent;
        let filterCell: HTMLInputElement;
        if (typeof filterValue === 'string') {
            filterValue = this.parent.sanitize(filterValue as string);
        }
        this.column = gObj.grabColumnByFieldFromAllCols(fieldName, isForeignColumn);
        if (this.filterSettings.type === 'FilterBar' && this.filterSettings.showFilterBarOperator
            && isNullOrUndefined(this.column.filterBarTemplate) && isNullOrUndefined(this.column.filterTemplate)) {
            filterOperator = this.getOperatorName(fieldName);
        }
        if (filterOperator === 'like' && filterValue && (filterValue as string).indexOf('%') === -1) {
            filterValue = '%' + filterValue + '%';
        }
        if (!this.column) {
            return;
        }
        if (this.filterSettings.type === 'FilterBar') {
            filterCell = gObj.getHeaderContent().querySelector('[id=\'' + this.column.field + '_filterBarcell\']') as HTMLInputElement;
        }
        if (!isNullOrUndefined(this.column.allowFiltering) && !this.column.allowFiltering) {
            this.parent.log('action_disabled_column', {moduleName: this.getModuleName(), columnName: this.column.headerText});
            return;
        }
        if (isActionPrevent(gObj)) {
            gObj.notify(events.preventBatch, {
                instance: this, handler: this.filterByColumn, arg1: fieldName, arg2: filterOperator, arg3: filterValue, arg4: predicate,
                arg5: matchCase, arg6: ignoreAccent, arg7: actualFilterValue, arg8: actualOperator
            });
            return;
        }
        this.predicate = predicate ? predicate : Array.isArray(filterValue) ? 'or' : 'and';
        this.value = filterValue as string | number | Date | boolean;
        this.matchCase = matchCase || false;
        this.ignoreAccent = this.ignoreAccent = !isNullOrUndefined(ignoreAccent) ? ignoreAccent : this.parent.filterSettings.ignoreAccent;
        this.fieldName = fieldName;
        this.operator = filterOperator;
        filterValue = !isNullOrUndefined(filterValue) ? filterValue.toString() : filterValue;
        if (filterValue === '') {
            filterValue = null;
        }
        if (this.column.type === 'number' || this.column.type === 'date') {
            this.matchCase = true;
        }
        if (filterCell && this.filterSettings.type === 'FilterBar') {
            if ((filterValue && (filterValue as string).length < 1) || (!this.filterByMethod &&
                this.checkForSkipInput(this.column, (filterValue as string)))) {
                this.filterStatusMsg = (filterValue && (filterValue as string).length < 1) ? '' : this.l10n.getConstant('InvalidFilterMessage');
                this.updateFilterMsg();
                return;
            }
            if (filterCell.value !== filterValue) {
                filterCell.value = (filterValue as string);
            }
        }
        if (!isNullOrUndefined(this.column.format)) {
            this.applyColumnFormat((filterValue as string));
            if (this.initialLoad && this.filterSettings.type === 'FilterBar') {
                filterCell.value = this.values[this.column.field];
            }
        } else {
            this.values[this.column.field] = filterValue; //this line should be above updateModel
        }
        const predObj: PredicateModel = {
            field: this.fieldName,
            predicate: predicate,
            matchCase: matchCase,
            ignoreAccent: ignoreAccent,
            operator: this.operator,
            value: this.value,
            type: this.column.type
        };
        const filterColumn: PredicateModel[] = this.parent.filterSettings.columns.filter((fColumn: PredicateModel) => {
            return (fColumn.field === this.fieldName);
        });
        if (filterColumn.length > 1 && !isNullOrUndefined(this.actualPredicate[this.fieldName])) {
            this.actualPredicate[this.fieldName].push(predObj);
        } else {
            this.actualPredicate[this.fieldName] = [predObj];
        }
        if (this.checkAlreadyColFiltered(this.column.field)) {
            return;
        }
        this.updateModel();
    }

    private applyColumnFormat(filterValue: string | number | Date | boolean): void {
        const getFlvalue: Date | number | string = (this.column.type === 'date' || this.column.type === 'datetime' || this.column.type === 'dateonly') ?
            new Date(filterValue as string) : parseFloat(filterValue as string);
        if ((this.column.type === 'date' || this.column.type === 'datetime' || this.column.type === 'dateonly') && filterValue &&
            Array.isArray(this.value) && (filterValue as string).split(',').length > 1) {
            this.values[this.column.field] = (((filterValue as string)).split(',')).map((val: string) => {
                if (val === '') {
                    val = null;
                }
                return this.setFormatForFlColumn(new Date(val), this.column);
            });
        } else {
            this.values[this.column.field] = this.setFormatForFlColumn(getFlvalue, this.column);
        }
    }

    // To skip the second time request to server while applying initial filtering - EJ2-44361
    private skipUid(col: object[]): boolean {
        let flag: boolean = true;
        const colLen: string[] = Object.keys((col));
        for (let i: number = 0; i < colLen.length ; i++) {
            const key: Object[] = Object.keys(col[colLen[parseInt(i.toString(), 10)]]);
            if (key.length === 1 && key[0] === 'uid') {
                flag = false; } }
        return flag;
    }

    private onPropertyChanged(e: NotifyArgs): void {
        if (e.module !== this.getModuleName()) {
            return;
        }
        for (const prop of Object.keys(e.properties)) {
            switch (prop) {
            case 'columns':
                // eslint-disable-next-line no-case-declarations
                const col: string = 'columns';
                // eslint-disable-next-line no-case-declarations
                const args: Object = {
                    currentFilterObject: this.currentFilterObject, currentFilteringColumn: this.column ?
                        this.column.field : undefined, action: 'filter', columns: this.filterSettings.columns,
                    requestType: 'filtering', type: events.actionBegin, cancel: false
                };
                if (this.contentRefresh && this.skipUid(e.properties[`${col}`])) {
                    this.parent.notify(events.modelChanged, args);
                    if ((<{ cancel?: boolean }>args).cancel) {
                        if ((this.filterSettings.type === 'CheckBox' || this.filterSettings.type === 'Excel')){
                            this.filterSettings.columns = (this.actualData.length <= 1) ? this.checkboxPrevFilterObject :
                                this.checkboxFilterObject;
                            this.actualPredicate[this.column.field] = this.filterSettings.columns;
                            const col: Column = this.parent.getColumnByField(this.column.field);
                            const iconClass: string = this.parent.showColumnMenu && col.showColumnMenu ? '.e-columnmenu' : '.e-icon-filter';
                            const filterIconElement: Element = this.parent.getColumnHeaderByField(this.column.field)
                                .querySelector(iconClass);
                            if (this.checkboxPrevFilterObject.length === 0){
                                filterIconElement.classList.remove('e-filtered');
                            }
                            else {
                                filterIconElement.classList.add('e-filtered');
                            }
                        } else {
                            if (isNullOrUndefined(this.prevFilterObject)) {
                                this.filterSettings.columns.splice(this.filterSettings.columns.length - 1, 1);
                            } else {
                                this.filterSettings.columns[this.filterObjIndex] = this.prevFilterObject;
                            }
                        }
                        return;
                    }
                    this.updateFilterIcon();
                    this.refreshFilterSettings();
                    this.updateFilterMsg();
                    this.updateFilter();
                }
                break;
            case 'showFilterBarStatus':
                if (e.properties[`${prop}`]) {
                    this.updateFilterMsg();
                } else if (this.parent.allowPaging) {
                    this.parent.updateExternalMessage('');
                }
                break;
            case 'showFilterBarOperator':
            case 'type':
                this.parent.refreshHeader();
                this.refreshFilterSettings();
                if (this.parent.height === '100%') {
                    this.parent.scrollModule.refresh();
                }
                break;
            }
        }
    }

    private refreshFilterSettings(): void {
        if (this.filterSettings.type === 'FilterBar') {
            for (let i: number = 0; i < this.filterSettings.columns.length; i++) {
                this.column = this.parent.grabColumnByUidFromAllCols(this.filterSettings.columns[parseInt(i.toString(), 10)].uid);
                let filterValue: string | number | Date | boolean | (string | number | boolean | Date)[] =
                    this.filterSettings.columns[parseInt(i.toString(), 10)].value;
                filterValue = !isNullOrUndefined(filterValue) && filterValue.toString();
                if (!isNullOrUndefined(this.column.format)) {
                    this.applyColumnFormat(filterValue);
                } else {
                    const key: string = this.filterSettings.columns[parseInt(i.toString(), 10)].field;
                    this.values[`${key}`] = this.filterSettings.columns[parseInt(i.toString(), 10)].value;
                }
                const filterElement: HTMLInputElement = this.getFilterBarElement(this.column.field);
                if (filterElement) {
                    if (this.cellText[this.filterSettings.columns[parseInt(i.toString(), 10)].field] !== ''
                        && !isNullOrUndefined(this.cellText[this.filterSettings.columns[parseInt(i.toString(), 10)].field])) {
                        filterElement.value = this.cellText[this.column.field];
                    } else {
                        filterElement.value = this.filterSettings.columns[parseInt(i.toString(), 10)].value as string;
                    }
                }
                const localeText: { [key: string]: string } = { isnull: 'IsNull', isnotnull: 'NotNull', isnotempty: 'IsNotEmpty', isempty: 'IsEmpty'};
                const readOnlyOperators: string[] = ['isnull', 'isnotnull', 'isempty', 'isnotempty'];
                if (filterElement && this.filterSettings.showFilterBarOperator
                    && readOnlyOperators.indexOf(this.filterSettings.columns[parseInt(i.toString(), 10)].operator as string) > -1) {
                    filterElement.value = this.l10n.getConstant(
                        localeText[this.filterSettings.columns[parseInt(i.toString(), 10)].operator as string]
                    );
                }
            }
            if (this.filterSettings.columns.length === 0) {
                const col: Column[] = this.parent.getColumns();
                for (let i: number = 0; i < col.length; i++) {
                    const filterElement: HTMLInputElement = this.getFilterBarElement(col[parseInt(i.toString(), 10)].field);
                    if (filterElement && filterElement.value !== '') {
                        filterElement.value = '';
                        delete this.values[col[parseInt(i.toString(), 10)].field];
                    }
                }
            }
        }
    }

    private updateFilterIcon(): void {
        if (this.filterSettings.columns.length === 0 && this.parent.element.querySelector('.e-filtered')) {
            const fltrIconElement: Element[] = [].slice.call(this.parent.element.getElementsByClassName('e-filtered'));
            for (let i: number = 0, len: number = fltrIconElement.length; i < len; i++) {
                fltrIconElement[parseInt(i.toString(), 10)].classList.remove('e-filtered');
            }
        }
    }

    private getFilterBarElement(col: string): HTMLInputElement {
        const selector: string = '[id=\'' + col + '_filterBarcell\']';
        let filterElement: HTMLInputElement;
        if (selector && !isNullOrUndefined(this.element)) {
            filterElement = (this.element.querySelector(selector) as HTMLInputElement);
        }
        return filterElement;
    }

    /**
     * @private
     * @returns {void}
     */
    public refreshFilter(): void {
        this.refreshFilterSettings();
        this.updateFilterMsg();
    }

    /**
     * Clears all the filtered rows of the Grid.
     *
     * @param {string[]} fields - returns the fields
     * @returns {void}
     */
    public clearFiltering(fields?: string[]): void {
        const cols: PredicateModel[] = getActualPropFromColl(this.filterSettings.columns);
        if (!isNullOrUndefined(fields)) {
            this.refresh = false;
            fields.forEach((field: string) => { this.removeFilteredColsByField(field, false); });
            this.parent.setProperties({ filterSettings: { columns: this.filterSettings.columns } }, true);
            this.parent.renderModule.refresh();
            this.refresh = true;
            return;
        }
        if (isActionPrevent(this.parent)) {
            this.parent.notify(events.preventBatch, { instance: this, handler: this.clearFiltering });
            return;
        }
        for (let i: number = 0; i < cols.length; i++) {
            cols[parseInt(i.toString(), 10)].uid = cols[parseInt(i.toString(), 10)].uid
                || this.parent.getColumnByField(cols[parseInt(i.toString(), 10)].field).uid;
        }
        const colUid: string[] = cols.map((f: Column) => f.uid);
        const filteredcols: string[] = colUid.filter((item: string, pos: number) => colUid.indexOf(item) === pos);
        this.refresh = false;
        for (let i: number = 0, len: number = filteredcols.length; i < len; i++) {
            this.removeFilteredColsByField(this.parent.getColumnByUid(filteredcols[parseInt(i.toString(), 10)]).field, false);
        }
        this.refresh = true;
        if (filteredcols.length) {
            this.parent.renderModule.refresh();
        }
        if (this.parent.filterSettings.columns.length === 0 && this.parent.element.querySelector('.e-filtered')) {
            const fltrElement: Element[] = [].slice.call(this.parent.element.getElementsByClassName('e-filtered'));
            for (let i: number = 0, len: number = fltrElement.length; i < len; i++) {
                fltrElement[0].classList.remove('e-filtered');
            }
        }
        this.isRemove = true;
        this.filterStatusMsg = '';
        this.updateFilterMsg();
    }

    private checkAlreadyColFiltered(field: string): boolean {
        const columns: PredicateModel[] = this.filterSettings.columns;
        for (const col of columns) {
            if (col.field === field && this.parent.filterSettings.type === 'Menu' &&
                (col.type === 'date' || col.type === 'datetime')) {
                return (this.checkDateColumnValue(col.value, this.value) &&
                    col.operator === this.operator && col.predicate === this.predicate);
            } else if (col.field === field && col.value === this.value &&
                col.operator === this.operator && col.predicate === this.predicate) {
                return true;
            }
        }
        return false;
    }

    private checkDateColumnValue(colDate: string | number | boolean | Date | (string | number | boolean | Date)[],
                                 filterDate: string | number | boolean | Date | (string | number | boolean | Date)[]): boolean {
        if (isNullOrUndefined(colDate) && isNullOrUndefined(filterDate)) {
            return true;
        }  else if (colDate instanceof Date && filterDate instanceof Date) {
            return colDate.getTime() === filterDate.getTime();
        }
        return false;
    }

    private columnMenuFilter(args: { col: Column, target: Element, isClose: boolean, id: string }): void {
        this.column = args.col;
        const ele: Element = closest(args.target, '#' + args.id);
        if (args.isClose && !ele) {
            this.filterModule.closeDialog();
        } else if (ele) {
            this.filterDialogOpen(this.column, args.target);
        }
    }

    private filterDialogOpen(col: Column, target: Element, left?: number, top?: number): void {
        if (this.filterModule) {
            this.filterModule.isresetFocus = false;
            this.filterModule.closeDialog();
        }
        this.setFilterModel(col);
        this.filterModule.openDialog(this.createOptions(col, target, left, top));
    }

    /**
     * Create filter dialog options
     *
     * @param  {Column} col - Filtering column detail.
     * @param  {Element} target -  Filter dialog target.
     * @param  {number} left -  Filter dialog left position.
     * @param  {number} top -  Filter dialog top position.
     * @returns {Object} returns the created dialog options
     * @hidden
     */
    public createOptions(col: Column, target: Element, left?: number, top?: number): Object {
        const gObj: IGrid = this.parent;
        const dataSource: Object = col.filter.dataSource || gObj.dataSource && 'result' in gObj.dataSource ? gObj.dataSource :
            gObj.getDataModule().dataManager;
        const type: string = col.filter.type || this.parent.filterSettings.type;
        const options: object = {
            type: col.type, field: col.field, displayName: col.headerText,
            dataSource: dataSource, format: col.format, height: 800, columns: gObj.getColumns(),
            filteredColumns: gObj.filterSettings.columns, target: target, dataManager: gObj.getDataModule().dataManager,
            formatFn: col.getFormatter(), ignoreAccent: gObj.filterSettings.ignoreAccent,
            parserFn: col.getParser(), query: gObj.query, template: col.getFilterItemTemplate(),
            hideSearchbox: isNullOrUndefined(col.filter.hideSearchbox) ? false : col.filter.hideSearchbox,
            handler: this.filterHandler.bind(this), localizedStrings: gObj.getLocaleConstants(),
            position: { X: left, Y: top }, column: col, foreignKeyValue: col.foreignKeyValue,
            actualPredicate: this.actualPredicate, localeObj: gObj.localeObj,
            isRemote: gObj.getDataModule().isRemote(), allowCaseSensitive: this.filterSettings.enableCaseSensitivity,
            isResponsiveFilter: this.parent.enableAdaptiveUI,
            operator: this.actualPredicate[col.field] && type === 'Menu' ? this.actualPredicate[col.field][0].operator : 'equal',
            parentTotalDataCount: gObj.getDataModule().isRemote() && gObj.allowPaging ? gObj.pagerModule.pagerObj.totalRecordsCount :
                gObj.getDataModule().isRemote() ? gObj.totalDataRecordsCount : (gObj.getFilteredRecords() as Object[]).length,
            parentCurrentViewDataCount: gObj.currentViewData.length,
            parentFilteredLocalRecords: !gObj.getDataModule().isRemote() ? (gObj.getFilteredRecords() as Object[]) : []
        };
        return options;
    }


    /**
     * Removes filtered column by field name.
     *
     * @param  {string} field - Defines column field name to remove filter.
     * @param  {boolean} isClearFilterBar - Specifies whether the filter bar value needs to be cleared.
     * @returns {void}
     * @hidden
     */
    public removeFilteredColsByField(field: string, isClearFilterBar?: boolean): void {
        let fCell: HTMLInputElement;
        const cols: PredicateModel[] = this.filterSettings.columns;
        if (isActionPrevent(this.parent)) {
            const args: Object = { instance: this, handler: this.removeFilteredColsByField, arg1: field, arg2: isClearFilterBar };
            this.parent.notify(events.preventBatch, args);
            return;
        }
        const colUid: string[] = cols.map((f: Column) => f.uid);
        const filteredColsUid: string[] = colUid.filter((item: string, pos: number) => colUid.indexOf(item) === pos);
        if (!isNullOrUndefined(this.column)){
            const col: Column = this.column.isForeignColumn() ? this.parent.getColumnByUid(this.column.uid) :
                this.parent.getColumnByField(field);
            this.filterObjIndex =  this.getFilteredColsIndexByField(col);
            this.prevFilterObject = this.filterSettings.columns[this.filterObjIndex];
        }
        for (let i: number = 0, len: number = filteredColsUid.length; i < len; i++) {
            cols[parseInt(i.toString(), 10)].uid = cols[parseInt(i.toString(), 10)].uid
            || this.parent.getColumnByField(cols[parseInt(i.toString(), 10)].field).uid;
            let len: number = cols.length;
            const column: Column = this.parent.grabColumnByUidFromAllCols(filteredColsUid[parseInt(i.toString(), 10)]);
            if (column.field === field || (column.field === column.foreignKeyValue && column.isForeignColumn())) {
                const currentPred: PredicateModel = this.filterSettings.columns.filter((e: PredicateModel) => {
                    return e.uid === column.uid; })[0];
                if (this.filterSettings.type === 'FilterBar' && !isClearFilterBar) {
                    const selector: string = '[id=\'' + column.field + '_filterBarcell\']';
                    fCell = this.parent.getHeaderContent().querySelector(selector) as HTMLInputElement;
                    if (fCell) {
                        fCell.value = '';
                        delete this.values[`${field}`];
                    }
                }
                while (len--) {
                    if (cols[parseInt(len.toString(), 10)].uid === column.uid) {
                        cols.splice(len, 1);
                    }
                }
                const fltrElement: Element = this.parent.getColumnHeaderByField(column.field);
                if (this.filterSettings.type !== 'FilterBar' || this.parent.showColumnMenu) {
                    const iconClass: string = this.parent.showColumnMenu && column.showColumnMenu ? '.e-columnmenu' : '.e-icon-filter';
                    fltrElement.querySelector(iconClass).classList.remove('e-filtered');
                }
                this.isRemove = true;
                if (this.actualPredicate[`${field}`]) {
                    delete this.actualPredicate[`${field}`];
                }
                if (this.values[`${field}`]) {
                    delete this.values[`${field}`];
                }
                if (this.refresh) {
                    this.parent.notify(events.modelChanged, {
                        requestType: 'filtering', type: events.actionBegin, currentFilterObject: currentPred,
                        currentFilterColumn: column, action: 'clearFilter'
                    });
                }
                break;
            }
        }
        this.updateFilterMsg();
    }

    /**
     * For internal use only - Get the module name.
     *
     * @returns {string} returns the module name
     * @private
     */
    protected getModuleName(): string {
        return 'filter';
    }

    private keyUpHandlerImmediate(e: KeyboardEventArgs): void {
        if (e.keyCode !== 13) {
            this.keyUpHandler(e);
        }
    }

    private keyUpHandler(e: KeyboardEventArgs): void {
        const gObj: IGrid = this.parent;
        const target: HTMLInputElement = e.target as HTMLInputElement;

        if (target && matches(target, '.e-filterbar input')) {
            const closeHeaderEle: Element = closest(target, 'th.e-filterbarcell');
            this.column = gObj.getColumnByUid(closeHeaderEle.getAttribute('data-mappinguid'));
            if (!this.column) {
                return;
            }
            if (e.action === 'altDownArrow' && this.parent.filterSettings.showFilterBarOperator) {
                const dropDownListInput: Element = closest(target, 'span').querySelector('.e-filterbaroperator');
                (<EJ2Intance>dropDownListInput).ej2_instances[0].showPopup();
                (dropDownListInput as HTMLElement).focus();
            }
            if ((this.filterSettings.mode === 'Immediate' || (e.keyCode === 13 &&
                !(e.target as HTMLElement).classList.contains('e-filterbaroperator')))
                && e.keyCode !== 9 && !this.column.filterTemplate) {
                this.value = target.value.trim();
                this.processFilter(e);
            }
        }
        if (e.action === 'altDownArrow' && this.filterSettings.type !== 'FilterBar' && !parentsUntil(e.target as Element, 'e-toolbar')
            && isNullOrUndefined(this.parent.element.querySelector('.e-filter-popup')) && !this.parent.enableAdaptiveUI) {
            const element: HTMLElement = gObj.focusModule.currentInfo.element;
            if (element && element.classList.contains('e-headercell') && !element.classList.contains('e-stackedheadercell')) {
                const column: Column = gObj.getColumnByUid(element.firstElementChild.getAttribute('data-mappinguid'));
                this.openMenuByField(column.field);
                this.parent.focusModule.clearIndicator();
            }
        }

        if (e.action === 'escape' && this.filterSettings.type === 'Menu' && this.filterModule) {
            if (this.parent.showColumnMenu && this.filterModule.isDialogOpen) {
                this.parent.isColumnMenuFilterClosing = true;
            }
            this.filterModule.closeDialog();
            gObj.notify(events.restoreFocus, {});
            if (!this.parent.showColumnMenu) {
                gObj.notify(events.restoreFocus, {});
            }
        }
    }

    private updateCrossIcon(element: HTMLInputElement): void {
        if (element.value.length) {
            element.nextElementSibling.classList.remove('e-hide');
        }
    }

    private updateFilterMsg(): void {
        if (this.filterSettings.type === 'FilterBar') {
            const gObj: IGrid = this.parent;
            let getFormatFlValue: string;
            const columns: PredicateModel[] = this.filterSettings.columns;
            let column: Column;

            if (!this.filterSettings.showFilterBarStatus) {
                return;
            }
            if (columns.length > 0 && this.filterStatusMsg !== this.l10n.getConstant('InvalidFilterMessage')) {
                this.filterStatusMsg = '';
                for (let index: number = 0; index < columns.length; index++) {
                    column = gObj.grabColumnByUidFromAllCols(columns[parseInt(index.toString(), 10)].uid)
                    || gObj.grabColumnByFieldFromAllCols(columns[parseInt(index.toString(), 10)]
                        .field, columns[parseInt(index.toString(), 10)].isForeignKey);
                    if (index) {
                        this.filterStatusMsg += ' && ';
                    }
                    if (!isNullOrUndefined(column.format)) {
                        const flValue: Date | number = (column.type === 'date' || column.type === 'datetime' || column.type === 'dateonly') ?
                            this.valueFormatter.fromView(this.values[column.field], column.getParser(), (column.type === 'dateonly' ? 'date' : column.type)) :
                            this.values[column.field];
                        if (!(column.type === 'date' || column.type === 'datetime' || column.type === 'dateonly')) {
                            const formater: IValueFormatter = this.serviceLocator.getService<IValueFormatter>('valueFormatter');
                            getFormatFlValue = formater.toView(flValue, column.getParser()).toString();
                        } else {
                            getFormatFlValue = this.setFormatForFlColumn(flValue, column);
                        }
                        this.filterStatusMsg += column.headerText + ': ' + getFormatFlValue;
                    } else {
                        this.filterStatusMsg += column.headerText + ': ' + this.values[column.field];
                    }
                }
            }
            if (gObj.allowPaging) {
                gObj.updateExternalMessage(this.filterStatusMsg);
                if (this.parent.height === '100%') {
                    this.parent.scrollModule.refresh();
                }
            }

            //TODO: virtual paging
            this.filterStatusMsg = '';
        }
    }

    private setFormatForFlColumn(value: Date | number, column: Column): string {
        const formater: IValueFormatter = this.serviceLocator.getService<IValueFormatter>('valueFormatter');
        const formatValue: string | Object = formater.toView(value, column.getFormatter());
        return isNullOrUndefined(formatValue) ? formatValue as string : formatValue.toString();
    }

    private checkForSkipInput(column: Column, value: string): boolean {
        let isSkip: boolean;
        if (column.type === 'number') {
            if (DataUtil.operatorSymbols[`${value}`] || this.skipNumberInput.indexOf(value) > -1) {
                isSkip = true;
            }
        } else if (column.type === 'string') {
            for (const val of value) {
                if (this.skipStringInput.indexOf(val) > -1) {
                    isSkip = true;
                }
            }
        }
        return isSkip;
    }

    private processFilter(e: KeyboardEvent): void {
        this.stopTimer();
        this.startTimer(e);
    }

    private startTimer(e: KeyboardEvent): void {
        this.timer = window.setInterval(
            () => { this.onTimerTick(); },
            e.keyCode === 13 ? 0 : this.filterSettings.immediateModeDelay);
    }

    private stopTimer(): void {
        window.clearInterval(this.timer);
    }

    private onTimerTick(): void {
        const selector: string = '[id=\'' + this.column.field + '_filterBarcell\']';
        let filterElement: HTMLInputElement = (this.element.querySelector(selector) as HTMLInputElement);
        if (!filterElement) {
            filterElement = (this.parent.getHeaderContent().querySelector(selector) as HTMLInputElement);
        }
        let filterValue: string;
        this.cellText[this.column.field] = filterElement.value;
        this.stopTimer();
        if (!isNullOrUndefined(this.column.filterBarTemplate)) {
            let templateRead: Function = this.column.filterBarTemplate.read as Function;
            if (typeof templateRead === 'string') {
                templateRead = getValue(templateRead, window);
            }
            if (!isNullOrUndefined(templateRead)) {
                this.value = templateRead.call(this, filterElement);
            }
        } else {
            filterValue = JSON.parse(JSON.stringify(filterElement.value));
        }
        if (isNullOrUndefined(this.value) || this.value === '') {
            this.removeFilteredColsByField(this.column.field);
            return;
        }
        this.validateFilterValue(this.value as string);
        this.filterByMethod = false;
        this.filterByColumn(
            this.column.field, this.operator, this.value as string, this.predicate,
            this.filterSettings.enableCaseSensitivity, this.ignoreAccent, this.column.isForeignColumn());
        this.filterByMethod = true;
        filterElement.value = filterValue;
        this.updateFilterMsg();
    }

    private validateFilterValue(value: string): void {
        let skipInput: string[];
        let index: number;
        this.matchCase = this.filterSettings.enableCaseSensitivity;
        switch (this.column.type) {
        case 'number':
            if (this.column.filter.operator) {
                this.operator = this.column.filter.operator as string;
            } else {
                this.operator = this.filterOperators.equal;
            }
            skipInput = ['>', '<', '=', '!'];
            for (let i: number = 0; i < value.length; i++) {
                if (skipInput.indexOf(value[parseInt(i.toString(), 10)]) > -1) {
                    index = i;
                    break;
                }
            }
            this.getOperator(value.substring(index));
            if (index !== 0) {
                this.value = value.substring(0, index);
            }
            if (this.value !== '' && value.length >= 1) {
                this.value = this.valueFormatter.fromView(
                    this.value as string, this.column.getParser(), this.column.type);
            }
            if (isNaN(this.value as number)) {
                this.filterStatusMsg = this.l10n.getConstant('InvalidFilterMessage');
            }
            break;
        case 'date':
        case 'datetime':
            this.operator = this.filterOperators.equal;
            if (this.value !== '' && !(this.value instanceof Date)) {
                this.getOperator(value);
                this.value = this.valueFormatter.fromView(
                    this.value as string, this.column.getParser(), this.column.type);
                if (isNullOrUndefined(this.value)) {
                    this.filterStatusMsg = this.l10n.getConstant('InvalidFilterMessage');
                }
            }
            break;
        case 'string':
            this.matchCase = false;
            if (this.column.filter.operator) {
                this.operator = this.column.filter.operator as string;
            } else {
                if (value.indexOf('*') !== -1 || value.indexOf('?') !== -1 || value.indexOf('%3f') !== -1) {
                    this.operator = this.filterOperators.wildCard;
                }
                else if (value.indexOf('%') !== -1) {
                    this.operator = this.filterOperators.like;
                }
                else {
                    this.operator = this.filterOperators.startsWith;
                }
            }
            break;
        case 'boolean':
            if (value.toLowerCase() === 'true' || value === '1') {
                this.value = true;
            } else if (value.toLowerCase() === 'false' || value === '0') {
                this.value = false;
            } else if (value.length) {
                this.filterStatusMsg = this.l10n.getConstant('InvalidFilterMessage');
            }
            this.operator = this.filterOperators.equal;
            break;
        default:
            if (this.column.filter.operator) {
                this.operator = this.column.filter.operator as string;
            } else {
                this.operator = this.filterOperators.equal;
            }
        }
    }

    private getOperator(value: string): void {
        const singleOp: string = value.charAt(0);
        const multipleOp: string = value.slice(0, 2);
        const operators: Object = extend(
            { '=': this.filterOperators.equal, '!': this.filterOperators.notEqual }, DataUtil.operatorSymbols);
        // eslint-disable-next-line no-prototype-builtins
        if (operators.hasOwnProperty(singleOp) || operators.hasOwnProperty(multipleOp)) {
            this.operator = operators[`${singleOp}`];
            this.value = value.substring(1);
            if (!this.operator) {
                this.operator = operators[`${multipleOp}`];
                this.value = value.substring(2);
            }
        }
        if (this.operator === this.filterOperators.lessThan || this.operator === this.filterOperators.greaterThan) {
            if ((this.value as string).charAt(0) === '=') {
                this.operator = this.operator + 'orequal';
                this.value = (this.value as string).substring(1);
            }
        }
    }

    private columnPositionChanged(): void {
        if (this.parent.filterSettings.type !== 'FilterBar') {
            return;
        }
    }

    private getLocalizedCustomOperators(): void {
        const numOptr: { value: string; text: string }[] = [
            { value: 'equal', text: this.l10n.getConstant('Equal') },
            { value: 'greaterthan', text: this.l10n.getConstant('GreaterThan') },
            { value: 'greaterthanorequal', text: this.l10n.getConstant('GreaterThanOrEqual') },
            { value: 'lessthan', text: this.l10n.getConstant('LessThan') },
            { value: 'lessthanorequal', text: this.l10n.getConstant('LessThanOrEqual') },
            { value: 'notequal', text: this.l10n.getConstant('NotEqual') },
            { value: 'isnull', text: this.l10n.getConstant('IsNull') },
            { value: 'isnotnull', text: this.l10n.getConstant('NotNull') }
        ];
        this.customOperators = {
            stringOperator: [
                { value: 'startswith', text: this.l10n.getConstant('StartsWith') },
                { value: 'endswith', text: this.l10n.getConstant('EndsWith') },
                { value: 'contains', text: this.l10n.getConstant('Contains') },
                { value: 'equal', text: this.l10n.getConstant('Equal') },
                { value: 'isempty', text: this.l10n.getConstant('IsEmpty') },
                { value: 'doesnotstartwith', text: this.l10n.getConstant('NotStartsWith') },
                { value: 'doesnotendwith', text: this.l10n.getConstant('NotEndsWith') },
                { value: 'doesnotcontain', text: this.l10n.getConstant('NotContains') },
                { value: 'notequal', text: this.l10n.getConstant('NotEqual') },
                { value: 'isnotempty', text: this.l10n.getConstant('IsNotEmpty') },
                { value: 'like', text: this.l10n.getConstant('Like') }
            ],

            numberOperator: numOptr,

            dateOperator: [
                { value: 'equal', text: this.l10n.getConstant('Equal') },
                { value: 'greaterthan', text: this.l10n.getConstant('GreaterThan') },
                { value: 'greaterthanorequal', text: this.l10n.getConstant('GreaterThanOrEqual') },
                { value: 'lessthan', text: this.l10n.getConstant('LessThan') },
                { value: 'lessthanorequal', text: this.l10n.getConstant('LessThanOrEqual') },
                { value: 'notequal', text: this.l10n.getConstant('NotEqual') },
                { value: 'isnull', text: this.l10n.getConstant('IsNull') },
                { value: 'isnotnull', text: this.l10n.getConstant('NotNull') }
            ],

            datetimeOperator: [
                { value: 'equal', text: this.l10n.getConstant('Equal') },
                { value: 'greaterthan', text: this.l10n.getConstant('GreaterThan') },
                { value: 'greaterthanorequal', text: this.l10n.getConstant('GreaterThanOrEqual') },
                { value: 'lessthan', text: this.l10n.getConstant('LessThan') },
                { value: 'lessthanorequal', text: this.l10n.getConstant('LessThanOrEqual') },
                { value: 'notequal', text: this.l10n.getConstant('NotEqual') },
                { value: 'isnull', text: this.l10n.getConstant('IsNull') },
                { value: 'isnotnull', text: this.l10n.getConstant('NotNull') }
            ],

            dateonlyOperator: [
                { value: 'equal', text: this.l10n.getConstant('Equal') },
                { value: 'greaterthan', text: this.l10n.getConstant('GreaterThan') },
                { value: 'greaterthanorequal', text: this.l10n.getConstant('GreaterThanOrEqual') },
                { value: 'lessthan', text: this.l10n.getConstant('LessThan') },
                { value: 'lessthanorequal', text: this.l10n.getConstant('LessThanOrEqual') },
                { value: 'notequal', text: this.l10n.getConstant('NotEqual') },
                { value: 'isnull', text: this.l10n.getConstant('IsNull') },
                { value: 'isnotnull', text: this.l10n.getConstant('NotNull') }
            ],

            booleanOperator: [
                { value: 'equal', text: this.l10n.getConstant('Equal') },
                { value: 'notequal', text: this.l10n.getConstant('NotEqual') }
            ]
        };
        if (this.filterSettings.type === 'Menu') {
            this.customOperators.stringOperator.push(
                { value: 'in', text: this.l10n.getConstant('In') },
                { value: 'notin', text: this.l10n.getConstant('NotIn') }
            );
            this.customOperators.booleanOperator.push(
                { value: 'in', text: this.l10n.getConstant('In') },
                { value: 'notin', text: this.l10n.getConstant('NotIn') }
            );
            this.customOperators.numberOperator.push(
                { value: 'in', text: this.l10n.getConstant('In') },
                { value: 'notin', text: this.l10n.getConstant('NotIn') }
            );
        }
    }

    /**
     * @param {string} field - specifies the field name
     * @returns {void}
     * @hidden
     */
    public openMenuByField(field: string): void {
        const gObj: IGrid = this.parent;
        if (gObj.enableAdaptiveUI) {
            this.showCustomFilter(false);
            return;
        }
        const column: Column = gObj.getColumnByField(field);
        const header: Element = gObj.getColumnHeaderByField(field);
        const target: Element = header.querySelector('.e-filtermenudiv');

        if (!target) {
            return;
        }

        const gClient: ClientRect = gObj.element.getBoundingClientRect();
        const fClient: ClientRect = target.getBoundingClientRect();
        this.filterDialogOpen(column, target, fClient.right - gClient.left, fClient.bottom - gClient.top);
    }

    private filterIconClickHandler(e: MouseEvent): void {
        const target: Element = e.target as Element;
        if (target.classList.contains('e-filtermenudiv') && (this.parent.filterSettings.type === 'Menu' ||
            this.parent.filterSettings.type === 'CheckBox' || this.parent.filterSettings.type === 'Excel')) {
            const gObj: IGrid = this.parent;
            const col: Column = gObj.getColumnByUid(
                parentsUntil(target, 'e-headercell').firstElementChild.getAttribute('data-mappinguid'));
            this.column = col;
            if (this.fltrDlgDetails.field === col.field && this.fltrDlgDetails.isOpen) {
                return;
            }
            if (this.filterModule) {
                this.filterModule.closeDialog();
            }
            this.fltrDlgDetails = { field: col.field, isOpen: true };
            this.openMenuByField(col.field);
        }
    }


    private clickHandler(e: MouseEvent): void {
        if (this.filterSettings.type === 'FilterBar' && this.filterSettings.showFilterBarOperator) {
            if (parentsUntil(e.target as HTMLElement, 'e-filterbarcell') &&
                (e.target as HTMLElement).classList.contains('e-input-group-icon')) {
                const filterOperatorElement: HTMLElement = closest(e.target as HTMLElement, 'div').
                    querySelector('.e-filterbaroperator') as HTMLElement;
                if (filterOperatorElement) {
                    filterOperatorElement.focus();
                } else {
                    (e.target as HTMLElement).focus();
                }
            }
            if ((e.target as HTMLElement).classList.contains('e-list-item')) {
                const inputId: string = document.querySelector('.e-popup-open').getAttribute('id').replace('_popup', '');
                if (inputId.indexOf('grid-column') !== -1) {
                    (closest(document.getElementById(inputId), 'div').querySelector('.e-filtertext') as HTMLElement).focus();
                }
            }
        }
        if (this.filterSettings.mode === 'Immediate' || this.parent.filterSettings.type === 'Menu' ||
            this.parent.filterSettings.type === 'CheckBox' || this.parent.filterSettings.type === 'Excel') {
            const target: Element = e.target as Element;
            const datepickerEle: boolean = target.classList.contains('e-day'); // due to datepicker popup cause
            const dialog: Element = parentsUntil(this.parent.element, 'e-dialog');
            let hasDialog: boolean = false;
            const popupEle: Element = parentsUntil(target, 'e-popup');
            const filterPopup: Element = document.getElementById(this.parent.element.id + '_e-popup');
            const hasDialogClosed: Element = this.parent.element.classList.contains('e-device') ?
                document.querySelector('.e-filter-popup') : filterPopup && filterPopup.querySelector('.e-filter-popup') ?
                    filterPopup.querySelector('.e-filter-popup') : this.parent.element.querySelector('.e-filter-popup');
            if (dialog && popupEle) {
                hasDialog = dialog.id === popupEle.id;
            }
            if ((this.filterModule && hasDialogClosed && (parentsUntil(target, 'e-excel-ascending') ||
                parentsUntil(target, 'e-excel-descending')))) {
                this.filterModule.closeDialog(target);
            }
            if (parentsUntil(target, 'e-filter-popup') || target.classList.contains('e-filtermenudiv')) {
                return;
            } else if (this.filterModule && !parentsUntil(target, 'e-date-overflow') && (!parentsUntil(target, 'e-popup-wrapper')
                && (!closest(target, '.e-filter-item.e-menu-item'))) && !datepickerEle
                && !(parentsUntil(target, 'e-search-wrapper') && !hasDialogClosed)) {
                if ((hasDialog && (!parentsUntil(target, 'e-filter-popup'))
                    && (!parentsUntil(target, 'e-popup-flmenu'))) || (!popupEle && hasDialogClosed)) {
                    this.filterModule.isresetFocus = parentsUntil(target, 'e-grid') &&
                    parentsUntil(target, 'e-grid').id === this.parent.element.id && !(parentsUntil(target, 'e-search-wrapper')
                    && hasDialogClosed);
                    this.filterModule.closeDialog(target);
                }
            }
        }
    }


    private filterHandler(args: {
        action: string, filterCollection: PredicateModel[], field: string, ejpredicate: Predicate,
        column: Column, actualPredicate: PredicateModel[], requestType: string
    }): void {
        this.actualPredicate[args.field] = args.actualPredicate;
        this.actualData = Object.keys(this.actualPredicate);
        const dataManager: DataManager = new DataManager(this.filterSettings.columns as JSON[]);
        const query: Query = new Query().where('field', this.filterOperators.equal, args.field);
        this.checkboxFilterObject = dataManager.dataSource.json;
        this.checkboxPrevFilterObject = dataManager.executeLocal(query) as { field: string }[];
        for (let i: number = 0; i < this.checkboxPrevFilterObject.length; i++) {
            let index: number = -1;
            for (let j: number = 0; j < this.filterSettings.columns.length; j++) {
                if (this.checkboxPrevFilterObject[parseInt(i.toString(), 10)].field ===
                    this.filterSettings.columns[parseInt(j.toString(), 10)].field) {
                    index = j;
                    break;
                }
            }
            if (index !== -1) {
                this.filterSettings.columns.splice(index, 1);
            }
        }
        if (this.values[args.field]) {
            delete this.values[args.field];
        }
        const col: Column = this.parent.getColumnByField(args.field);
        const iconClass: string = this.parent.showColumnMenu && col.showColumnMenu ? '.e-columnmenu' : '.e-icon-filter';
        const filterIconElement: Element = this.parent.getColumnHeaderByField(args.field).querySelector(iconClass);
        if (args.action === 'filtering') {
            this.filterSettings.columns = this.filterSettings.columns.concat(args.filterCollection);
            if (this.filterSettings.columns.length && filterIconElement) {
                filterIconElement.classList.add('e-filtered');
            }
        } else {
            if (filterIconElement) {
                filterIconElement.classList.remove('e-filtered');
            }
            args.requestType = 'filtering';
            this.parent.renderModule.refresh(args as object); //hot-fix onpropertychanged not working for object { array }
        }
        this.parent.dataBind();
    }

    private updateFilter(): void {
        const cols: PredicateModel[] = this.filterSettings.columns;
        this.actualPredicate = {};
        for (let i: number = 0; i < cols.length; i++) {
            this.column = this.parent.getColumnByField(cols[parseInt(i.toString(), 10)].field) ||
                getColumnByForeignKeyValue(cols[parseInt(i.toString(), 10)].field, this.parent.getForeignKeyColumns());
            let fieldName: string = cols[parseInt(i.toString(), 10)].field;
            if (!this.parent.getColumnByField(cols[parseInt(i.toString(), 10)].field)) {
                fieldName = getColumnByForeignKeyValue(cols[parseInt(i.toString(), 10)].field, this.parent.getForeignKeyColumns()).field;
            }
            this.refreshFilterIcon(
                fieldName, cols[parseInt(i.toString(), 10)].operator, cols[parseInt(i.toString(), 10)].value,
                cols[parseInt(i.toString(), 10)].type, cols[parseInt(i.toString(), 10)].predicate,
                cols[parseInt(i.toString(), 10)].matchCase, cols[parseInt(i.toString(), 10)].ignoreAccent,
                cols[parseInt(i.toString(), 10)].uid
            );
        }
    }

    private refreshFilterIcon(
        fieldName: string, operator: string, value: string | number | Date | boolean | (string | number | boolean | Date)[],
        type?: string, predicate?: string, matchCase?: boolean, ignoreAccent?: boolean, uid?: string
    ): void {
        const obj: Object = {
            field: fieldName,
            predicate: predicate,
            matchCase: matchCase,
            ignoreAccent: ignoreAccent,
            operator: operator,
            value: value,
            type: type
        };
        if (this.actualPredicate[`${fieldName}`]) {
            this.actualPredicate[`${fieldName}`].push(obj);
        } else {
            this.actualPredicate[`${fieldName}`] = [obj];
        }
        const field: string = uid ? this.parent.grabColumnByUidFromAllCols(uid).field : fieldName;
        this.addFilteredClass(field);
    }

    private addFilteredClass(fieldName: string): void {
        let filterIconElement: Element;
        const col: Column = this.parent.getColumnByField(fieldName);
        if (this.parent.showColumnMenu && col.showColumnMenu) {
            filterIconElement = this.parent.getColumnHeaderByField(fieldName).querySelector('.e-columnmenu');
        } else if (col) {
            filterIconElement = this.parent.getColumnHeaderByField(fieldName).querySelector('.e-icon-filter');
        }
        if (filterIconElement) {
            filterIconElement.classList.add('e-filtered');
        }
    }

    /**
     * @hidden
     * @returns {FilterUI} returns the FilterUI
     */
    public getFilterUIInfo(): FilterUI {
        return this.filterModule ? this.filterModule.getFilterUIInfo() : {};
    }

    /**
     * @param {string} field - specifies the field name
     * @returns {string} returns the operator name
     * @hidden
     */
    private getOperatorName(field: string): string {
        return (<EJ2Intance>document.getElementById(this.parent.getColumnByField(field).uid)).ej2_instances[0].value;
    }

    /**
     * Renders checkbox items in Menu filter dialog.
     *
     * @returns {void}
     */
    public renderCheckboxOnFilterMenu(): HTMLElement {
        return this.filterModule.renderCheckBoxMenu();
    }
}
