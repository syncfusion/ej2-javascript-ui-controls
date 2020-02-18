import { Spreadsheet, locale, dialog, mouseDown, renderFilterCell, initiateFilterUI, reapplyFilter, filterCellKeyDown } from '../index';
import { getFilteredColumn, cMenuBeforeOpen, filterByCellValue, clearFilter, getFilterRange, applySort } from '../index';
import { filterRangeAlert, filterComplete, beforeFilter, clearAllFilter } from '../../workbook/common/event';
import { getIndexesFromAddress, getSwapRange, SheetModel, getColumnHeaderText, CellModel, getCellPosition } from '../../workbook/index';
import { getData, getTypeFromFormat, getCell, getCellIndexes, getRangeAddress, getSheet } from '../../workbook/index';
import { FilterOptions, BeforeFilterEventArgs, FilterEventArgs } from '../../workbook/common/interface';
import { L10n, getComponent } from '@syncfusion/ej2-base';
import { Dialog } from '../services';
import { IFilterArgs, PredicateModel, ExcelFilterBase, beforeFltrcMenuOpen, CheckBoxFilterBase } from '@syncfusion/ej2-grids';
import { beforeCustomFilterOpen, parentsUntil, filterCboxValue } from '@syncfusion/ej2-grids';
import { Button } from '@syncfusion/ej2-buttons';
import { Query, DataManager, Predicate } from '@syncfusion/ej2-data';
import { SortOrder, MenuItemModel } from '@syncfusion/ej2-navigations';

/**
 * `Filter` module is used to handle the filter action in Spreadsheet.
 */
export class Filter {
    private parent: Spreadsheet;
    private filterRange: Map<number, number[]>;
    private filterCollection: Map<number, PredicateModel[]>;
    private filterClassList: Map<number, { [key: string]: string }>;

    /**
     * Constructor for filter module.
     */
    constructor(parent: Spreadsheet) {
        this.parent = parent;
        this.filterCollection = new Map();
        this.filterClassList = new Map();
        this.filterRange = new Map();
        this.addEventListener();
    }

    /**
     * To destroy the filter module.
     * @return {void}
     */
    protected destroy(): void {
        this.removeEventListener();
        this.filterRange = null;
        this.filterCollection = null;
        this.filterClassList = null;
        this.parent = null;
    }

    private addEventListener(): void {
        this.parent.on(filterRangeAlert, this.filterRangeAlertHandler, this);
        this.parent.on(initiateFilterUI, this.initiateFilterUIHandler, this);
        this.parent.on(mouseDown, this.filterMouseDownHandler, this);
        this.parent.on(renderFilterCell, this.renderFilterCellHandler, this);
        this.parent.on(clearAllFilter, this.clearAllFilterHandler, this);
        this.parent.on(beforeFltrcMenuOpen, this.beforeFilterMenuOpenHandler, this);
        this.parent.on(beforeCustomFilterOpen, this.beforeCustomFilterOpenHandler, this);
        this.parent.on(reapplyFilter, this.reapplyFilterHandler, this);
        this.parent.on(filterByCellValue, this.filterByCellValueHandler, this);
        this.parent.on(clearFilter, this.clearFilterHandler, this);
        this.parent.on(getFilteredColumn, this.getFilteredColumnHandler, this);
        this.parent.on(cMenuBeforeOpen, this.cMenuBeforeOpenHandler, this);
        this.parent.on(filterCboxValue, this.filterCboxValueHandler, this);
        this.parent.on(getFilterRange, this.getFilterRangeHandler, this);
        this.parent.on(filterCellKeyDown, this.filterCellKeyDownHandler, this);
    }

    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(filterRangeAlert, this.filterRangeAlertHandler);
            this.parent.off(initiateFilterUI, this.initiateFilterUIHandler);
            this.parent.off(mouseDown, this.filterMouseDownHandler);
            this.parent.off(renderFilterCell, this.renderFilterCellHandler);
            this.parent.off(clearAllFilter, this.clearAllFilterHandler);
            this.parent.off(beforeFltrcMenuOpen, this.beforeFilterMenuOpenHandler);
            this.parent.off(beforeCustomFilterOpen, this.beforeCustomFilterOpenHandler);
            this.parent.off(reapplyFilter, this.reapplyFilterHandler);
            this.parent.off(filterByCellValue, this.filterByCellValueHandler);
            this.parent.off(clearFilter, this.clearFilterHandler);
            this.parent.off(getFilteredColumn, this.getFilteredColumnHandler);
            this.parent.off(cMenuBeforeOpen, this.cMenuBeforeOpenHandler);
            this.parent.on(filterCboxValue, this.filterCboxValueHandler);
            this.parent.off(getFilterRange, this.getFilterRangeHandler);
            this.parent.off(filterCellKeyDown, this.filterCellKeyDownHandler);
        }
    }

    /**
     * Gets the module name.
     * @returns string
     */
    protected getModuleName(): string {
        return 'filter';
    }

    /**
     * Validates the range and returns false when invalid.
     */
    private isInValidFilterRange(sheet: SheetModel): boolean {
        let selectedRange: number[] = getSwapRange(getIndexesFromAddress(sheet.selectedRange));
        return selectedRange[0] > sheet.usedRange.rowIndex - 1 || selectedRange[1] > sheet.usedRange.colIndex;
    }

    /**
     * Shows the range error alert dialog.
     * @param error - range error string.
     */
    private filterRangeAlertHandler(args: { error: string }): void {
        let dialogInst: Dialog = (this.parent.serviceLocator.getService(dialog) as Dialog);
        dialogInst.show({
            content: args.error, isModal: true,
            height: 180, width: 400, showCloseIcon: true,
        });
        this.parent.hideSpinner();
    }

    /**
     * Triggers before filter context menu opened and used to add sorting items.
     */
    private beforeFilterMenuOpenHandler(args: { element: HTMLElement }): void {
        let l10n: L10n = this.parent.serviceLocator.getService(locale);
        args.element.classList.add('e-spreadsheet-contextmenu'); // to show sort icons
        let ul: Element = args.element.querySelector('ul');
        this.addMenuItem(ul, l10n.getConstant('SortDescending'), 'e-filter-sortdesc', 'e-sort-desc');
        this.addMenuItem(ul, l10n.getConstant('SortAscending'), 'e-filter-sortasc', 'e-sort-asc');
        args.element.appendChild(ul);
    }

    /**
     * Creates new menu item element
     */
    private addMenuItem(ul: Element, text: string, className?: string, iconCss?: string): void {
        let li: Element = this.parent.createElement('li', { className: className + ' e-menu-item' });
        li.innerHTML = text;
        li.insertBefore(this.parent.createElement('span', { className: 'e-menu-icon e-icons ' + iconCss }), li.firstChild);
        ul.insertBefore(li, ul.firstChild);
    }

    /**
     * Initiates the filter UI for the selected range.
     */
    private initiateFilterUIHandler(args: { predicates?: PredicateModel[], range?: string }): void {
        let predicates: PredicateModel[] = args ? args.predicates : null;
        let sheetIdx: number = this.parent.activeSheetTab - 1;
        if (this.filterRange.size > 0 && this.filterRange.has(sheetIdx)) { //disable filter
            this.removeFilter(sheetIdx);
            if (!predicates) { return; }
        }
        let sheet: SheetModel = getSheet(this.parent, sheetIdx);
        if (this.isInValidFilterRange(sheet)) {
            let l10n: L10n = this.parent.serviceLocator.getService(locale);
            this.filterRangeAlertHandler({ error: l10n.getConstant('FilterOutOfRangeError') });
            return;
        }
        this.processRange(sheet, sheetIdx, args ? args.range : null);

        if (predicates) {
            let range: number[] = this.filterRange.get(sheetIdx).slice();
            range[0] = range[0] + 1; // to skip first row.
            range[2] = sheet.usedRange.rowIndex - 1; //filter range should be till used range.
            getData(this.parent, `${sheet.name}!${getRangeAddress(range)}`, true, true).then((jsonData: { [key: string]: CellModel }[]) => {
                this.filterSuccessHandler(
                    new DataManager(jsonData), { action: 'filtering', filterCollection: predicates, field: predicates[0].field });
                predicates.forEach((predicate: PredicateModel) => {
                    if (this.filterClassList.get(sheetIdx)[predicate.field].indexOf(' e-filtered') < 0) {
                        this.filterClassList.get(sheetIdx)[predicate.field] += ' e-filtered';
                    }
                });
                this.refreshFilterRange();
            });
        }
    }

    /**
     * Processes the range if no filter applied.
     */
    private processRange(sheet: SheetModel, sheetIdx: number, filterRange?: string): void {
        let range: number[] = getSwapRange(getIndexesFromAddress(filterRange || sheet.selectedRange));
        if (range[0] === range[2] && (range[2] - range[0]) === 0) { //if selected range is a single cell 
            range[0] = 0; range[1] = 0; range[2] = sheet.usedRange.rowIndex - 1; range[3] = sheet.usedRange.colIndex;
        }
        this.filterRange.set(sheetIdx, range);
        this.filterCollection.set(sheetIdx, []);
        this.filterClassList.set(sheetIdx, {});
        this.refreshFilterRange(range);
    }

    /**
     * Removes all the filter related collections for the active sheet.
     */
    private removeFilter(sheetIdx: number): void {
        if (this.filterCollection.get(sheetIdx).length) {
            this.parent.clearFilter();
        }
        let range: number[] = this.filterRange.get(sheetIdx).slice();
        this.filterRange.delete(sheetIdx);
        this.filterCollection.delete(sheetIdx);
        this.filterClassList.delete(sheetIdx);
        this.refreshFilterRange(range, true);
    }
    /**
     * Handles filtering cell value based on context menu.
     */
    private filterByCellValueHandler(): void {
        let sheetIdx: number = this.parent.activeSheetTab - 1;
        let sheet: SheetModel = this.parent.getActiveSheet();
        if (this.isInValidFilterRange(sheet)) {
            let l10n: L10n = this.parent.serviceLocator.getService(locale);
            this.filterRangeAlertHandler({ error: l10n.getConstant('FilterOutOfRangeError') });
            return;
        }
        let cell: number[] = getCellIndexes(sheet.activeCell);
        if (!this.isFilterRange(sheetIdx, cell[0], cell[1])) {
            this.processRange(sheet, sheetIdx);
        }

        let range: number[] = this.filterRange.get(sheetIdx).slice();
        range[0] = range[0] + 1; // to skip first row.
        range[2] = sheet.usedRange.rowIndex - 1; //filter range should be till used range.
        let field: string = getColumnHeaderText(cell[1] + 1);
        let type: string = this.getColumnType(sheet, cell[1] + 1, range);
        let predicates: PredicateModel[] = [{
            field: field,
            operator: type === 'date' || type === 'datetime' || type === 'boolean' ? 'equal' : 'contains',
            value: getCell(cell[0], cell[1], sheet).value, matchCase: false, type: type
        }];
        getData(this.parent, `${sheet.name}!${getRangeAddress(range)}`, true, true).then((jsonData: { [key: string]: CellModel }[]) => {
            this.filterSuccessHandler(
                new DataManager(jsonData), { action: 'filtering', filterCollection: predicates, field: field });
        });
    }

    /**
     * Creates filter buttons and renders the filter applied cells.
     */
    private renderFilterCellHandler(args: { td: HTMLElement, rowIndex: number, colIndex: number }): void {
        let sheetIdx: number = this.parent.activeSheetTab - 1;
        if (this.filterRange.has(sheetIdx) && this.isFilterCell(sheetIdx, args.rowIndex, args.colIndex)) {
            if (!args.td) { return; }
            let field: string = getColumnHeaderText(args.colIndex + 1);
            if (this.filterClassList.has(sheetIdx) && !this.filterClassList.get(sheetIdx)[field]) {
                this.filterClassList.get(sheetIdx)[field] = '';
            }
            if (args.td.querySelector('.e-filter-btn')) {
                let element: HTMLElement = args.td.querySelector('.e-filter-iconbtn');
                let filterBtnObj: Button = getComponent(element, 'btn');
                filterBtnObj.iconCss = 'e-icons e-filter-icon' + this.filterClassList.get(sheetIdx)[field];
            } else {
                let filterButton: HTMLElement = this.parent.createElement('div', { className: 'e-filter-btn' });
                let filterBtnObj: Button = new Button(
                    { iconCss: 'e-icons e-filter-icon' + this.filterClassList.get(sheetIdx)[field], cssClass: 'e-filter-iconbtn' });
                args.td.insertBefore(filterButton, args.td.firstChild);
                filterBtnObj.createElement = this.parent.createElement;
                filterBtnObj.appendTo(filterButton);
            }
        }
    }

    /**
     * Refreshes the filter header range.
     */
    private refreshFilterRange(filterRange?: number[], remove?: boolean): void {
        let range: number[] = filterRange || this.filterRange.get(this.parent.activeSheetTab - 1).slice();
        for (let index: number = range[1]; index <= range[3]; index++) {
            let cell: HTMLElement = this.parent.getCell(range[0], index);
            if (remove) {
                if (cell.hasChildNodes()) {
                    let element: Element = cell.querySelector('.e-filter-btn');
                    cell.removeChild(element);
                }
            } else {
                this.renderFilterCellHandler({ td: cell, rowIndex: range[0], colIndex: index });
            }
        }
    }

    /**
     * Checks whether the provided cell is a filter cell.
     */
    private isFilterCell(sheetIdx: number, rowIndex: number, colIndex: number): boolean {
        let range: number[] = this.filterRange.get(sheetIdx);
        return (range && range[0] === rowIndex && range[1] <= colIndex && range[3] >= colIndex);
    }

    /**
     * Checks whether the provided cell is in a filter range
     */
    private isFilterRange(sheetIdx: number, rowIndex: number, colIndex: number): boolean {
        let range: number[] = this.filterRange.get(sheetIdx);
        return (range && range[0] <= rowIndex && range[2] >= rowIndex && range[1] <= colIndex && range[3] >= colIndex);
    }

    /**
     * Gets the filter information from active cell
     */
    private getFilteredColumnHandler(args: { field?: string, clearFilterText?: string, isFiltered?: boolean, isClearAll?: boolean }): void {
        let sheetIdx: number = this.parent.activeSheetTab - 1;
        let l10n: L10n = this.parent.serviceLocator.getService(locale);
        args.clearFilterText = l10n.getConstant('ClearFilter');
        if (this.filterRange.has(sheetIdx)) {
            let filterCollection: PredicateModel[] = this.filterCollection.get(sheetIdx);
            if (args.isClearAll) {
                args.isFiltered = filterCollection && filterCollection.length > 0;
                return;
            }
            let range: number[] = this.filterRange.get(sheetIdx).slice();
            let sheet: SheetModel = this.parent.getActiveSheet();
            let cell: number[] = getCellIndexes(sheet.activeCell);
            if (this.isFilterRange(sheetIdx, cell[0], cell[1])) {
                args.field = getColumnHeaderText(cell[1] + 1);
                let headerCell: CellModel = getCell(range[0], cell[1], sheet);
                let cellValue: string = this.parent.getDisplayText(headerCell);
                args.clearFilterText = l10n.getConstant('ClearFilterFrom') + '\"'
                    + (cellValue ? cellValue.toString() : 'Column ' + args.field) + '\"';
                filterCollection.some((value: PredicateModel) => {
                    args.isFiltered = value.field === args.field;
                    return args.isFiltered;
                });
            }
        }
    }

    /**
     * Triggers before context menu created to enable or disable items.
     */
    private cMenuBeforeOpenHandler(e: { element: HTMLElement, items: MenuItemModel[], parentItem: MenuItemModel, target: string }): void {
        let id: string = this.parent.element.id + '_cmenu';
        if (e.parentItem && e.parentItem.id === id + '_filter' && e.target === '') {
            let args: { [key: string]: boolean } = { isFiltered: false };
            this.getFilteredColumnHandler(args);
            this.parent.enableContextMenuItems([id + '_clearfilter', id + '_reapplyfilter'], !!args.isFiltered, true);
        }
    }

    /**
     * Closes the filter popup.
     */
    private closeDialog(): void {
        let filterPopup: HTMLElement = this.parent.element.querySelector('.e-filter-popup');
        let excelFilter: Dialog = getComponent(filterPopup, 'dialog');
        if (excelFilter) { excelFilter.hide(); }
    }

    /**
     * Returns true if the filter popup is opened.
     */
    private isPopupOpened(): boolean {
        let filterPopup: HTMLElement = this.parent.element.querySelector('.e-filter-popup');
        return filterPopup && filterPopup.style.display !== 'none';
    }

    private filterCellKeyDownHandler(args: { e: KeyboardEvent, isFilterCell: boolean }): void {
        let sheetIdx: number = this.parent.activeSheetTab - 1;
        let sheet: SheetModel = this.parent.getActiveSheet();
        let indexes: number[] = getCellIndexes(sheet.activeCell);
        if (this.isFilterCell(sheetIdx, indexes[0], indexes[1])) {
            args.isFilterCell = true;
            let pos: { top: number, left: number } = getCellPosition(sheet, indexes);
            let target: HTMLElement = this.parent.getCell(indexes[0], indexes[1]);
            if (this.isPopupOpened()) {
                this.closeDialog();
            }
            this.openDialog(target, pos.left, pos.top);
        } else { args.isFilterCell = false; }
    }

    /**
     * Opens the filter popup dialog on filter button click.
     */
    private filterMouseDownHandler(e: MouseEvent & TouchEvent): void {
        let target: HTMLElement = e.target as HTMLElement;
        if (target.classList.contains('e-filter-icon')) {
            if (this.isPopupOpened()) {
                this.closeDialog();
                return;
            }
            this.openDialog(target, e.x, e.y);
        } else if (this.isPopupOpened()) {
            if (!target.classList.contains('e-searchinput') && !target.classList.contains('e-searchclear')
                && (target.offsetParent && !target.offsetParent.classList.contains('e-filter-popup'))) {
                this.closeDialog();
            } else {
                this.selectSortItemHandler(target);
            }
        }
    }

    /**
     * Opens the excel filter dialog based on target.
     */
    private openDialog(target: HTMLElement, xPos: number, yPos: number): void {
        let cell: HTMLElement = parentsUntil(target, 'e-cell') as HTMLElement;
        let colIndex: number = parseInt(cell.getAttribute('aria-colindex'), 10);
        let field: string = getColumnHeaderText(colIndex);
        //Update datasource dynamically
        this.parent.showSpinner();
        let sheetIdx: number = this.parent.activeSheetTab - 1;
        let range: number[] = this.filterRange.get(sheetIdx).slice();
        let sheet: SheetModel = this.parent.getActiveSheet();
        let filterCell: CellModel = getCell(range[0], colIndex - 1, sheet);
        let displayName: string = this.parent.getDisplayText(filterCell);
        range[0] = range[0] + 1; // to skip first row.
        range[2] = sheet.usedRange.rowIndex - 1; //filter range should be till used range.
        getData(this.parent, `${sheet.name}!${getRangeAddress(range)}`, true, true).then((jsonData: { [key: string]: CellModel }[]) => {
            //to avoid undefined array data
            let checkBoxData: DataManager;
            jsonData.some((value: { [key: string]: CellModel }, index: number) => {
                if (value) { checkBoxData = new DataManager(jsonData.slice(index)); }
                return !!value;
            });

            let options: IFilterArgs = {
                type: this.getColumnType(sheet, colIndex, range), field: field, displayName: displayName || 'Column ' + field,
                dataSource: checkBoxData, height: this.parent.element.classList.contains('e-bigger') ? 800 : 500, columns: [],
                hideSearchbox: false, filteredColumns: this.filterCollection.get(sheetIdx), column: { 'field': field, 'filter': {} },
                handler: this.filterSuccessHandler.bind(this, new DataManager(jsonData)), target: target,
                position: { X: xPos, Y: yPos }, localeObj: this.parent.serviceLocator.getService(locale)
            };
            let excelFilter: ExcelFilterBase = new ExcelFilterBase(this.parent, this.getLocalizedCustomOperators());
            excelFilter.openDialog(options);
            this.parent.hideSpinner();
        });
    }

    /**
     * Formats cell value for listing it in filter popup.
     */
    private filterCboxValueHandler(args: { value: string | number, column: object, data: object }): void {
        if (args.column && args.data) {
            let fieldKey: string = 'field';
            let field: string = args.column[fieldKey] as string;
            let dataKey: string = 'dataObj';
            let rowKey: string = '__rowIndex';
            let indexes: number[] = getCellIndexes(field + args.data[dataKey][rowKey]);
            let cell: CellModel = getCell(indexes[0], indexes[1], this.parent.getActiveSheet());
            if (cell && cell.format) {
                args.value = this.parent.getDisplayText(cell);
            }
        }
    }

    /**
     * Triggers when sorting items are chosen on context menu of filter popup.
     */
    private selectSortItemHandler(target: HTMLElement): void {
        let sheetIdx: number = this.parent.activeSheetTab - 1;
        let sortOrder: SortOrder = target.classList.contains('e-filter-sortasc') ? 'Ascending'
            : target.classList.contains('e-filter-sortdesc') ? 'Descending' : null;
        if (!sortOrder) { return; }
        let sheet: SheetModel = this.parent.getActiveSheet();
        let range: number[] = this.filterRange.get(sheetIdx).slice();
        range[0] = range[0] + 1; // to skip first row.
        range[2] = sheet.usedRange.rowIndex - 1; //filter range should be till used range.
        this.parent.notify(applySort, { sortOptions: { sortDescriptors: { order: sortOrder } }, range: getRangeAddress(range) });

        let cell: number[] = getIndexesFromAddress(sheet.activeCell);
        let field: string = getColumnHeaderText(cell[1] + 1);
        for (let key of Object.keys(this.filterClassList.get(sheetIdx))) {
            let className: string = this.filterClassList.get(sheetIdx)[key].replace(/\se-sortasc-filter|\se-sortdesc-filter/gi, '');
            if (key === field) {
                className += sortOrder === 'Ascending' ? ' e-sortasc-filter' : ' e-sortdesc-filter';
            }
            this.filterClassList.get(sheetIdx)[key] = className;
        }
        this.refreshFilterRange();

        this.closeDialog();
    }

    /**
     * Triggers when OK button or clear filter item is selected
     */
    private filterSuccessHandler(dataSource: DataManager, args: {
        action: string, filterCollection: PredicateModel[], field: string
    }): void {
        let sheetIdx: number = this.parent.activeSheetTab - 1;
        let predicates: PredicateModel[] = this.filterCollection.get(sheetIdx);
        let dataManager: DataManager = new DataManager(predicates as JSON[]);
        let query: Query = new Query();
        let fields: { field: string }[] = dataManager.executeLocal(query.where('field', 'equal', args.field)) as { field: string }[];
        for (let index: number = 0; index < fields.length; index++) {
            let sameIndex: number = -1;
            for (let filterIndex: number = 0; filterIndex < predicates.length; filterIndex++) {
                if (predicates[filterIndex].field === fields[index].field) {
                    sameIndex = filterIndex;
                    break;
                }
            }
            if (sameIndex !== -1) {
                predicates.splice(sameIndex, 1);
            }
        }
        if (args.action === 'filtering') {
            predicates = predicates.concat(args.filterCollection);
            if (predicates.length && this.filterClassList.get(sheetIdx)[args.field].indexOf(' e-filtered') < 0) {
                this.filterClassList.get(sheetIdx)[args.field] += ' e-filtered';
            }
        } else {
            this.filterClassList.get(sheetIdx)[args.field] = this.filterClassList.get(sheetIdx)[args.field].replace(' e-filtered', '');
        }
        this.filterCollection.set(sheetIdx, predicates);
        let filterOptions: FilterOptions = {
            datasource: dataSource,
            predicates: this.getPredicates(sheetIdx),
        };
        this.filterRange.get(sheetIdx)[2] = getSheet(this.parent, sheetIdx).usedRange.rowIndex - 1; //extend the range if filtered
        this.applyFilter(filterOptions, getRangeAddress(this.filterRange.get(sheetIdx)));
    }

    /**
     * Triggers events for filtering and applies filter.
     */
    private applyFilter(filterOptions: FilterOptions, range: string): void {
        let args: BeforeFilterEventArgs = { range: range, filterOptions: filterOptions, cancel: false };
        this.parent.trigger(beforeFilter, args);
        if (args.cancel) { return; }
        this.parent.showSpinner();
        this.parent.filter(filterOptions, range).then((args: FilterEventArgs) => {
            this.refreshFilterRange();
            this.parent.hideSpinner();
            this.parent.trigger(filterComplete, args);
            return Promise.resolve(args);
        }).catch((error: string) => {
            this.filterRangeAlertHandler({ error: error });
            return Promise.reject(error);
        });
    }

    /**
     * Gets the predicates for the sheet
     */
    private getPredicates(sheetIdx: number): Predicate[] {
        let predicateList: Predicate[] = [];
        let excelPredicate: Predicate = CheckBoxFilterBase.getPredicate(this.filterCollection.get(sheetIdx));
        for (let prop of Object.keys(excelPredicate)) {
            predicateList.push(<Predicate>excelPredicate[prop]);
        }
        return predicateList;
    }

    /**
     * Gets the column type to pass it into the excel filter options.
     */
    private getColumnType(sheet: SheetModel, colIndex: number, range: number[]): string {
        let num: number = 0; let str: number = 0; let date: number = 0; let time: number = 0;
        for (let i: number = range[0]; i <= sheet.usedRange.rowIndex - 1; i++) {
            let cell: CellModel = getCell(i, colIndex - 1, sheet);
            if (cell) {
                if (cell.format) {
                    let type: string = getTypeFromFormat(cell.format).toLowerCase();
                    switch (type) {
                        case 'number':
                        case 'currency':
                        case 'accounting':
                        case 'percentage':
                            num++;
                            break;
                        case 'shortdate':
                        case 'longdate':
                            date++;
                            break;
                        case 'time':
                            num++;
                            break;
                        default:
                            str++;
                            break;
                    }
                } else {
                    if (typeof cell.value === 'string') {
                        str++;
                    } else { num++; }
                }
            } else {
                str++;
            }
        }
        return (num > str && num > date && num > time) ? 'number' : (str > num && str > date && str > time) ? 'string'
            : (date > num && date > str && date > time) ? 'date' : 'datetime';
    }

    /**
     * Triggers before the custom filter dialog opened.
     */
    private beforeCustomFilterOpenHandler(): void {
        this.closeDialog();
    }

    /**
     * Clears all the filtered columns in the active sheet.
     */
    private clearAllFilterHandler(): void {
        let sheetIdx: number = this.parent.activeSheetTab - 1;
        if (this.filterRange.has(sheetIdx)) {
            this.filterCollection.set(sheetIdx, []);
            for (let key of Object.keys(this.filterClassList.get(sheetIdx))) {
                this.filterClassList.get(sheetIdx)[key] = '';
            }
            this.refreshFilterRange();
        }
    }

    /**
     * Clear filter from the field.
     */
    private clearFilterHandler(args: { field: string }): void {
        this.filterSuccessHandler(null, { action: 'clear-filter', filterCollection: [], field: args.field });
    }

    /**
     * Reapplies the filter.
     */
    private reapplyFilterHandler(): void {
        let sheetIdx: number = this.parent.activeSheetTab - 1;
        if (this.filterRange.has(sheetIdx)) {
            this.applyFilter({ predicates: this.getPredicates(sheetIdx) }, getRangeAddress(this.filterRange.get(sheetIdx)));
        }
    }

    /**
     * Gets the filter information of the sheet.
     */
    private getFilterRangeHandler(args: { sheetIdx?: number, filterRange?: number[], hasFilter?: boolean }): void {
        let sheetIdx: number = args.sheetIdx || this.parent.activeSheetTab - 1;
        if (this.filterRange && this.filterRange.has(sheetIdx)) {
            args.hasFilter = true;
            args.filterRange = this.filterRange.get(sheetIdx);
        } else {
            args.hasFilter = false;
            args.filterRange = null;
        }
    }

    /**
     * Returns the custom operators for filter items.
     */
    private getLocalizedCustomOperators(): Object {
        let l10n: L10n = this.parent.serviceLocator.getService(locale);
        let numOptr: Object[] = [
            { value: 'equal', text: l10n.getConstant('Equal') },
            { value: 'greaterthan', text: l10n.getConstant('GreaterThan') },
            { value: 'greaterthanorequal', text: l10n.getConstant('GreaterThanOrEqual') },
            { value: 'lessthan', text: l10n.getConstant('LessThan') },
            { value: 'lessthanorequal', text: l10n.getConstant('LessThanOrEqual') },
            { value: 'notequal', text: l10n.getConstant('NotEqual') }
        ];
        let customOperators: Object = {
            stringOperator: [
                { value: 'startswith', text: l10n.getConstant('StartsWith') },
                { value: 'endswith', text: l10n.getConstant('EndsWith') },
                { value: 'contains', text: l10n.getConstant('Contains') },
                { value: 'equal', text: l10n.getConstant('Equal') },
                { value: 'notequal', text: l10n.getConstant('NotEqual') }],
            numberOperator: numOptr,
            dateOperator: numOptr,
            datetimeOperator: numOptr,
            booleanOperator: [
                { value: 'equal', text: l10n.getConstant('Equal') },
                { value: 'notequal', text: l10n.getConstant('NotEqual') }
            ]
        };
        return customOperators;
    }
}