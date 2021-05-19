/* eslint-disable no-useless-escape */
import { Spreadsheet, locale, dialog, mouseDown, renderFilterCell, initiateFilterUI, FilterInfoArgs, getStartEvent } from '../index';
import { reapplyFilter, filterCellKeyDown, DialogBeforeOpenEventArgs } from '../index';
import { getFilteredColumn, cMenuBeforeOpen, filterByCellValue, clearFilter, getFilterRange, applySort, getCellPosition } from '../index';
import { filterRangeAlert, filterComplete, beforeFilter, clearAllFilter, getFilteredCollection, sortImport } from '../../workbook/common/event';
import { FilterCollectionModel, getRangeIndexes, Workbook, getCellAddress, updateFilter } from '../../workbook/index';
import { getIndexesFromAddress, getSwapRange, SheetModel, getColumnHeaderText, CellModel } from '../../workbook/index';
import { getData, getTypeFromFormat, getCell, getCellIndexes, getRangeAddress, getSheet } from '../../workbook/index';
import { FilterOptions, BeforeFilterEventArgs, FilterEventArgs } from '../../workbook/common/interface';
import { L10n, getComponent, EventHandler } from '@syncfusion/ej2-base';
import { Dialog } from '../services';
import { IFilterArgs, PredicateModel, ExcelFilterBase, beforeFltrcMenuOpen, CheckBoxFilterBase } from '@syncfusion/ej2-grids';
import { beforeCustomFilterOpen, parentsUntil, filterCboxValue } from '@syncfusion/ej2-grids';
import { Button } from '@syncfusion/ej2-buttons';
import { Query, DataManager, Predicate } from '@syncfusion/ej2-data';
import { SortOrder, MenuItemModel } from '@syncfusion/ej2-navigations';
import { BeforeOpenEventArgs } from '@syncfusion/ej2-popups';
import { beginAction, completeAction, contentLoaded } from '../../spreadsheet/index';

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
     *
     * @param {Spreadsheet} parent - Specifies the Spreadsheet.
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
     *
     * @returns {void} - To destroy the filter module.
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
        this.parent.on(getFilteredCollection, this.getFilteredCollection, this);
        this.parent.on(contentLoaded, this.updateFilter, this);
        this.parent.on(updateFilter, this.updateFilter, this);
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
            this.parent.off(getFilteredCollection, this.getFilteredCollection);
            this.parent.off(contentLoaded, this.updateFilter);
            this.parent.off(updateFilter, this.updateFilter);
        }
    }

    /**
     * Gets the module name.
     *
     * @returns {string} - Gets the module name.
     */
    protected getModuleName(): string {
        return 'filter';
    }

    /**
     * Validates the range and returns false when invalid.
     *
     * @param {SheetModel} sheet - Specify the sheet.
     * @param {string} range - Specify the range.
     * @returns {void} - Validates the range and returns false when invalid.
     */
    private isInValidFilterRange(sheet: SheetModel, range?: string): boolean {
        const selectedRange: number[] = range ? getSwapRange(getIndexesFromAddress(range)) :
            getSwapRange(getIndexesFromAddress(sheet.selectedRange));
        return selectedRange[0] > sheet.usedRange.rowIndex || selectedRange[1] > sheet.usedRange.colIndex;
    }

    /**
     * Shows the range error alert dialog.
     *
     * @param {any} args - Specifies the args
     * @param {string} args.error - range error string.
     * @returns {void} - Shows the range error alert dialog.
     */
    private filterRangeAlertHandler(args: { error: string }): void {
        const dialogInst: Dialog = (this.parent.serviceLocator.getService(dialog) as Dialog);
        dialogInst.show({
            content: args.error, isModal: true,
            height: 180, width: 400, showCloseIcon: true,
            beforeOpen: (args: BeforeOpenEventArgs): void => {
                const dlgArgs: DialogBeforeOpenEventArgs = {
                    dialogName: 'FilterRangeDialog',
                    element: args.element, target: args.target, cancel: args.cancel
                };
                this.parent.trigger('dialogBeforeOpen', dlgArgs);
                if (dlgArgs.cancel) {
                    args.cancel = true;
                }
            }
        });
        this.parent.hideSpinner();
    }

    /**
     * Triggers before filter context menu opened and used to add sorting items.
     *
     * @param {any} args - Specifies the args
     * @param {HTMLElement} args.element - Specify the element
     * @returns {void} - Triggers before filter context menu opened and used to add sorting items.
     */
    private beforeFilterMenuOpenHandler(args: { element: HTMLElement }): void {
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        args.element.classList.add('e-spreadsheet-contextmenu'); // to show sort icons
        const ul: Element = args.element.querySelector('ul');
        this.addMenuItem(ul, l10n.getConstant('SortDescending'), 'e-filter-sortdesc', 'e-sort-desc');
        this.addMenuItem(ul, l10n.getConstant('SortAscending'), 'e-filter-sortasc', 'e-sort-asc');
        args.element.appendChild(ul);
    }

    /**
     * Creates new menu item element
     *
     * @param {Element} ul - Specify the element.
     * @param {string} text - Specify the text.
     * @param {string} className - Specify the className
     * @param {string} iconCss - Specify the iconCss
     * @returns {void} - Creates new menu item element
     */
    private addMenuItem(ul: Element, text: string, className?: string, iconCss?: string): void {
        const li: Element = this.parent.createElement('li', { className: className + ' e-menu-item' });
        li.innerHTML = text;
        li.insertBefore(this.parent.createElement('span', { className: 'e-menu-icon e-icons ' + iconCss }), li.firstChild);
        ul.insertBefore(li, ul.firstChild);
    }

    /**
     * Initiates the filter UI for the selected range.
     *
     * @param {any} args - Specifies the args
     * @param {PredicateModel[]} args.predicates - Specify the predicates.
     * @param {number} args.range - Specify the range.
     * @param {number} args.sIdx - Specify the sIdx
     * @param {boolean} args.isCut - Specify the bool value
     * @returns {void} - Initiates the filter UI for the selected range.
     */
    private initiateFilterUIHandler(args: {
        predicates?: PredicateModel[], range?: string,
        sIdx?: number, isCut?: boolean
    }): void {
        const predicates: PredicateModel[] = args ? args.predicates : null;
        let sheetIdx: number = args.sIdx;
        if (!sheetIdx && sheetIdx !== 0) { sheetIdx = this.parent.activeSheetIndex; }
        if (this.filterRange.size > 0 && this.filterRange.has(sheetIdx)) { //disable filter
            this.removeFilter(sheetIdx);
            if (!predicates) { return; }
        }
        const sheet: SheetModel = getSheet(this.parent  as Workbook, sheetIdx);
        if (this.isInValidFilterRange(sheet, args.range)) {
            const l10n: L10n = this.parent.serviceLocator.getService(locale);
            this.filterRangeAlertHandler({ error: l10n.getConstant('FilterOutOfRangeError') });
            return;
        }
        let selectedRange: string = sheet.selectedRange;
        const rangeIdx: number[] = getRangeIndexes(selectedRange);
        if (rangeIdx[0] === rangeIdx[2] && rangeIdx[1] === rangeIdx[3]) {
            rangeIdx[0] = 0; rangeIdx[1] = 0;
            rangeIdx[2] = sheet.usedRange.rowIndex;
            rangeIdx[3] = sheet.usedRange.colIndex;
            selectedRange = getRangeAddress(rangeIdx);
        }
        const eventArgs: BeforeFilterEventArgs = {
            range: args.range ? args.range : selectedRange,
            filterOptions: { predicates: args.predicates as Predicate[] }, cancel: false
        };
        if (!args.isCut) {
            this.parent.notify(beginAction, { action: 'filter', eventArgs: eventArgs });
        }
        this.processRange(sheet, sheetIdx, args ? args.range : null);

        if (predicates) {
            const range: number[] = this.filterRange.get(sheetIdx).slice();
            range[0] = range[0] + 1; // to skip first row.
            range[2] = sheet.usedRange.rowIndex; //filter range should be till used range.
            getData(this.parent as Workbook, `${sheet.name}!${getRangeAddress(range)}`, true, true).then((jsonData: { [key: string]: CellModel }[]) => {
                this.filterSuccessHandler(
                    new DataManager(jsonData), {
                        action: 'filtering',
                        filterCollection: predicates, field:  predicates[0] ? predicates[0].field : null, sIdx: args.sIdx
                    });
                predicates.forEach((predicate: PredicateModel) => {
                    if (this.filterClassList.get(sheetIdx)[predicate.field] &&
                        this.filterClassList.get(sheetIdx)[predicate.field].indexOf(' e-filtered') < 0) {
                        this.filterClassList.get(sheetIdx)[predicate.field] += ' e-filtered';
                    }
                });
                this.refreshFilterRange(null, false, args.sIdx);
            });
        }
        if (!args.isCut) {
            this.parent.notify(completeAction, { action: 'filter', eventArgs: eventArgs });
        }
    }

    /**
     * Processes the range if no filter applied.
     *
     * @param {SheetModel} sheet - Specify the sheet.
     * @param {number} sheetIdx - Specify the sheet index.
     * @param {number} filterRange - Specify the filterRange
     * @returns {void} - Processes the range if no filter applied.
     */
    private processRange(sheet: SheetModel, sheetIdx: number, filterRange?: string): void {
        const range: number[] = getSwapRange(getIndexesFromAddress(filterRange || sheet.selectedRange));
        if (range[0] === range[2] && range[1] === range[3]) { //if selected range is a single cell
            range[0] = 0; range[1] = 0; range[2] = sheet.usedRange.rowIndex; range[3] = sheet.usedRange.colIndex;
        }
        this.filterRange.set(sheetIdx, range);
        this.filterCollection.set(sheetIdx, []);
        this.filterClassList.set(sheetIdx, {});
        this.refreshFilterRange(range, false, sheetIdx);
    }

    /**
     * Removes all the filter related collections for the active sheet.
     *
     * @param {number} sheetIdx - Specify the sheet index.
     * @returns {void} - Removes all the filter related collections for the active sheet.
     */
    private removeFilter(sheetIdx: number): void {
        if (this.filterCollection.get(sheetIdx).length) {
            this.parent.clearFilter();
        }
        const range: number[] = this.filterRange.get(sheetIdx).slice();
        this.filterRange.delete(sheetIdx);
        this.filterCollection.delete(sheetIdx);
        this.filterClassList.delete(sheetIdx);
        this.refreshFilterRange(range, true, sheetIdx);
    }
    /**
     * Handles filtering cell value based on context menu.
     *
     * @returns {void} - Handles filtering cell value based on context menu.
     */
    private filterByCellValueHandler(): void {
        const sheetIdx: number = this.parent.activeSheetIndex;
        const sheet: SheetModel = this.parent.getActiveSheet();
        if (this.isInValidFilterRange(sheet)) {
            const l10n: L10n = this.parent.serviceLocator.getService(locale);
            this.filterRangeAlertHandler({ error: l10n.getConstant('FilterOutOfRangeError') });
            return;
        }
        const cell: number[] = getCellIndexes(sheet.activeCell);
        if (!this.isFilterRange(sheetIdx, cell[0], cell[1])) {
            this.processRange(sheet, sheetIdx);
        }

        const range: number[] = this.filterRange.get(sheetIdx).slice();
        range[0] = range[0] + 1; // to skip first row.
        range[2] = sheet.usedRange.rowIndex; //filter range should be till used range.
        const field: string = getColumnHeaderText(cell[1] + 1);
        const type: string = this.getColumnType(sheet, cell[1] + 1, range);
        const predicates: PredicateModel[] = [{
            field: field,
            operator: type === 'date' || type === 'datetime' || type === 'boolean' ? 'equal' : 'contains',
            value: getCell(cell[0], cell[1], sheet).value, matchCase: false, type: type
        }];
        getData(this.parent as Workbook, `${sheet.name}!${getRangeAddress(range)}`, true, true).then((jsonData: { [key: string]: CellModel }[]) => {
            this.filterSuccessHandler(
                new DataManager(jsonData), { action: 'filtering', filterCollection: predicates, field: field });
        });
    }

    /**
     * Creates filter buttons and renders the filter applied cells.
     *
     * @param { any} args - Specifies the args
     * @param { HTMLElement} args.td - specify the element
     * @param { number} args.rowIndex - specify the rowIndex
     * @param { number} args.colIndex - specify the colIndex
     * @param { number} args.sIdx - specify the sIdx
     * @returns {void} - Creates filter buttons and renders the filter applied cells.
     */
    private renderFilterCellHandler(args: { td: HTMLElement, rowIndex: number, colIndex: number, sIdx?: number }): void {
        let sheetIdx: number = args.sIdx;
        if (!sheetIdx && sheetIdx !== 0) { sheetIdx = this.parent.activeSheetIndex; }
        if (this.filterRange.has(sheetIdx) && this.isFilterCell(sheetIdx, args.rowIndex, args.colIndex)) {
            if (!args.td) { return; }
            const field: string = getColumnHeaderText(args.colIndex + 1);
            if (this.filterClassList.has(sheetIdx) && !this.filterClassList.get(sheetIdx)[field]) {
                this.filterClassList.get(sheetIdx)[field] = '';
            }
            if (args.td.querySelector('.e-filter-btn')) {
                const element: HTMLElement = args.td.querySelector('.e-filter-iconbtn');
                const filterBtnObj: Button = getComponent(element, 'btn');
                filterBtnObj.iconCss = 'e-icons e-filter-icon' + this.filterClassList.get(sheetIdx)[field];
            } else {
                const filterButton: HTMLElement = this.parent.createElement('div', { className: 'e-filter-btn' });
                const filterBtnObj: Button = new Button(
                    { iconCss: 'e-icons e-filter-icon' + this.filterClassList.get(sheetIdx)[field], cssClass: 'e-filter-iconbtn' });
                args.td.insertBefore(filterButton, args.td.firstChild);
                filterBtnObj.createElement = this.parent.createElement;
                filterBtnObj.appendTo(filterButton);
            }
        }
        if (this.parent.sortCollection) {
            this.parent.notify(sortImport, {sheetIdx : sheetIdx});
        }
    }

    /**
     * Refreshes the filter header range.
     *
     * @param {number[]} filterRange - Specify the filterRange.
     * @param {boolean} remove - Specify the bool value
     * @param {number} sIdx - Specify the index.
     * @returns {void} - Refreshes the filter header range.
     */
    private refreshFilterRange(filterRange?: number[], remove?: boolean, sIdx?: number): void {
        let sheetIdx: number = sIdx;
        if (!sheetIdx && sheetIdx !== 0) { sheetIdx = this.parent.activeSheetIndex; }
        const range: number[] = filterRange || this.filterRange.get(sheetIdx).slice();
        for (let index: number = range[1]; index <= range[3]; index++) {
            const cell: HTMLElement = this.parent.getCell(range[0], index);
            if (remove) {
                if (cell && cell.hasChildNodes()) {
                    const element: Element = cell.querySelector('.e-filter-btn');
                    if (element) { cell.removeChild(element); }
                }
            } else {
                this.renderFilterCellHandler({ td: cell, rowIndex: range[0], colIndex: index, sIdx: sheetIdx });
            }
        }
        if (this.parent.sortCollection) {
            this.parent.notify(sortImport, null);
        }
    }

    /**
     * Checks whether the provided cell is a filter cell.
     *
     * @param {number} sheetIdx - Specify the sheet index.
     * @param {number} rowIndex - Specify the row index
     * @param {number} colIndex - Specify the col index.
     * @returns {boolean} - Checks whether the provided cell is a filter cell.
     */
    private isFilterCell(sheetIdx: number, rowIndex: number, colIndex: number): boolean {
        const range: number[] = this.filterRange.get(sheetIdx);
        return (range && range[0] === rowIndex && range[1] <= colIndex && range[3] >= colIndex);
    }

    /**
     * Checks whether the provided cell is in a filter range
     *
     * @param {number} sheetIdx - Specify the sheet index.
     * @param {number} rowIndex - Specify the row index
     * @param {number} colIndex - Specify the col index.
     * @returns {boolean} - Checks whether the provided cell is in a filter range
     */
    private isFilterRange(sheetIdx: number, rowIndex: number, colIndex: number): boolean {
        const range: number[] = this.filterRange.get(sheetIdx);
        return (range && range[0] <= rowIndex && range[2] >= rowIndex && range[1] <= colIndex && range[3] >= colIndex);
    }

    /**
     * Gets the filter information from active cell
     *
     * @param {any} args - Specifies the args
     * @param {string} args.field - Specify the field
     * @param {string} args.clearFilterText - Specify the clearFilterText
     * @param {boolean} args.isFiltered - Specify the isFiltered
     * @param {boolean} args.isClearAll - Specify the isClearAll
     * @returns {void} - Triggers before context menu created to enable or disable items.
     */
    private getFilteredColumnHandler(args: { field?: string, clearFilterText?: string, isFiltered?: boolean, isClearAll?: boolean }): void {
        const sheetIdx: number = this.parent.activeSheetIndex;
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        args.clearFilterText = l10n.getConstant('ClearFilter');
        if (this.filterRange.has(sheetIdx)) {
            const filterCollection: PredicateModel[] = this.filterCollection.get(sheetIdx);
            if (args.isClearAll) {
                args.isFiltered = filterCollection && filterCollection.length > 0;
                return;
            }
            const range: number[] = this.filterRange.get(sheetIdx).slice();
            const sheet: SheetModel = this.parent.getActiveSheet();
            const cell: number[] = getCellIndexes(sheet.activeCell);
            if (this.isFilterRange(sheetIdx, cell[0], cell[1])) {
                args.field = getColumnHeaderText(cell[1] + 1);
                const headerCell: CellModel = getCell(range[0], cell[1], sheet);
                const cellValue: string = this.parent.getDisplayText(headerCell);
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
     *
     * @param {any} e - Specifies the args
     * @param {HTMLElement} e.element - Specify the element
     * @param {MenuItemModel[]} e.items - Specify the items
     * @param {MenuItemModel} e.parentItem - Specify the parentItem
     * @param {string} e.target - Specify the target
     * @returns {void} - Triggers before context menu created to enable or disable items.
     */
    private cMenuBeforeOpenHandler(e: { element: HTMLElement, items: MenuItemModel[], parentItem: MenuItemModel, target: string }): void {
        const id: string = this.parent.element.id + '_cmenu';
        if (e.parentItem && e.parentItem.id === id + '_filter' && e.target === '') {
            const args: { [key: string]: boolean } = { isFiltered: false };
            this.getFilteredColumnHandler(args);
            this.parent.enableContextMenuItems([id + '_clearfilter', id + '_reapplyfilter'], !!args.isFiltered, true);
        }
    }

    /**
     * Closes the filter popup.
     *
     * @returns {void} - Closes the filter popup.
     */
    private closeDialog(): void {
        const filterPopup: HTMLElement = document.querySelector('.e-filter-popup');
        if (filterPopup && filterPopup.id.includes(this.parent.element.id)) {
            const excelFilter: Dialog = getComponent(filterPopup, 'dialog');
            EventHandler.remove(filterPopup, getStartEvent(), this.filterMouseDownHandler);
            if (excelFilter) { excelFilter.hide(); }
        }
    }

    /**
     * Returns true if the filter popup is opened.
     *
     * @returns {boolean} - Returns true if the filter popup is opened.
     */
    private isPopupOpened(): boolean {
        const filterPopup: HTMLElement = document.querySelector('.e-filter-popup');
        return filterPopup && filterPopup.id.includes(this.parent.element.id) && filterPopup.style.display !== 'none';
    }

    private filterCellKeyDownHandler(args: { e: KeyboardEvent, isFilterCell: boolean }): void {
        const sheetIdx: number = this.parent.activeSheetIndex;
        const sheet: SheetModel = this.parent.getActiveSheet();
        const indexes: number[] = getCellIndexes(sheet.activeCell);
        if (this.isFilterCell(sheetIdx, indexes[0], indexes[1])) {
            args.isFilterCell = true;
            const pos: { top: number, left: number } = getCellPosition(sheet, indexes);
            const target: HTMLElement = this.parent.getCell(indexes[0], indexes[1]);
            if (this.isPopupOpened()) {
                this.closeDialog();
            }
            this.openDialog(target, pos.left, pos.top);
        } else { args.isFilterCell = false; }
    }

    /**
     * Opens the filter popup dialog on filter button click.
     *
     * @param {MouseEvent | TouchEvent} e - Specidy the event
     * @returns {void} - Opens the filter popup dialog on filter button click.
     */
    private filterMouseDownHandler(e: MouseEvent & TouchEvent): void {
        const target: HTMLElement = e.target as HTMLElement;
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
     *
     * @param {HTMLElement} target - Specify the target
     * @param {number} xPos - Specify the xPos
     * @param {number} yPos - Specify the yPos
     * @returns {void} - Opens the excel filter dialog based on target.
     */
    private openDialog(target: HTMLElement, xPos: number, yPos: number): void {
        const cell: HTMLElement = parentsUntil(target, 'e-cell') as HTMLElement;
        const colIndex: number = parseInt(cell.getAttribute('aria-colindex'), 10);
        const field: string = getColumnHeaderText(colIndex);
        //Update datasource dynamically
        this.parent.showSpinner();
        const sheetIdx: number = this.parent.activeSheetIndex;
        const range: number[] = this.filterRange.get(sheetIdx).slice();
        const sheet: SheetModel = this.parent.getActiveSheet();
        const filterCell: CellModel = getCell(range[0], colIndex - 1, sheet);
        const displayName: string = this.parent.getDisplayText(filterCell);
        range[0] = range[0] + 1; // to skip first row.
        range[2] = sheet.usedRange.rowIndex; //filter range should be till used range.
        getData(this.parent as Workbook, `${sheet.name}!${getRangeAddress(range)}`, true,
                true, null, true).then((jsonData: { [key: string]: CellModel }[]) => {
            //to avoid undefined array data
            let checkBoxData: DataManager;
            jsonData.some((value: { [key: string]: CellModel }, index: number) => {
                if (value) { checkBoxData = new DataManager(jsonData.slice(index)); }
                return !!value;
            });

            const options: IFilterArgs = {
                type: this.getColumnType(sheet, colIndex, range), field: field, displayName: displayName || 'Column ' + field,
                dataSource: checkBoxData, height: this.parent.element.classList.contains('e-bigger') ? 800 : 500, columns: [],
                hideSearchbox: false, filteredColumns: this.filterCollection.get(sheetIdx), column: { 'field': field, 'filter': {} },
                handler: this.filterSuccessHandler.bind(this, new DataManager(jsonData)), target: target,
                position: { X: xPos, Y: yPos }, localeObj: this.parent.serviceLocator.getService(locale)
            };
            const excelFilter: ExcelFilterBase = new ExcelFilterBase(this.parent, this.getLocalizedCustomOperators());
            excelFilter.openDialog(options);
            const filterPopup: HTMLElement = document.querySelector('.e-filter-popup');
            if (filterPopup && filterPopup.id.includes(this.parent.element.id)) {
                EventHandler.add(filterPopup, getStartEvent(), this.filterMouseDownHandler, this);
            }
            this.parent.hideSpinner();
        });
    }

    /**
     * Formats cell value for listing it in filter popup.
     *
     * @param {any} args - Specifies the args
     * @param {string | number} args.value - Specify the value
     * @param {object} args.column - Specify the column
     * @param {object} args.data - Specify the data
     * @returns {void} - Formats cell value for listing it in filter popup.
     */
    private filterCboxValueHandler(args: { value: string | number, column: object, data: object }): void {
        if (args.column && args.data) {
            const fieldKey: string = 'field';
            const field: string = args.column[fieldKey] as string;
            const dataKey: string = 'dataObj';
            const rowKey: string = '__rowIndex';
            if (args.value) {
                const indexes: number[] = getCellIndexes(field + args.data[dataKey][rowKey]);
                const cell: CellModel = getCell(indexes[0], indexes[1], this.parent.getActiveSheet());
                if (cell && cell.format) {
                    args.value = this.parent.getDisplayText(cell);
                }
            }
        }
    }

    /**
     * Triggers when sorting items are chosen on context menu of filter popup.
     *
     * @param {HTMLElement} target - Specify the element.
     * @returns {void} - Triggers when sorting items are chosen on context menu of filter popup.
     */
    private selectSortItemHandler(target: HTMLElement): void {
        const sortOrder: SortOrder = target.classList.contains('e-filter-sortasc') ? 'Ascending'
            : target.classList.contains('e-filter-sortdesc') ? 'Descending' : null;
        if (!sortOrder) { return; }
        const sheet: SheetModel = this.parent.getActiveSheet();
        const sheetIdx: number = this.parent.activeSheetIndex;
        const range: number[] = this.filterRange.get(sheetIdx).slice();
        range[0] = range[0] + 1; // to skip first row.
        range[2] = sheet.usedRange.rowIndex; //filter range should be till used range.
        this.parent.notify(applySort, { sortOptions: { sortDescriptors: { order: sortOrder } }, range: getRangeAddress(range) });

        const cell: number[] = getIndexesFromAddress(sheet.activeCell);
        const field: string = getColumnHeaderText(cell[1] + 1);
        for (const key of Object.keys(this.filterClassList.get(sheetIdx))) {
            let className: string = this.filterClassList.get(sheetIdx)[key].replace(/\se-sortasc-filter|\se-sortdesc-filter/gi, '');
            if (key === field) {
                className += sortOrder === 'Ascending' ? ' e-sortasc-filter' : ' e-sortdesc-filter';
            }
            this.filterClassList.get(sheetIdx)[key] = className;
        }
        this.refreshFilterRange();
        this.parent.sortCollection = this.parent.sortCollection ? this.parent.sortCollection : [];
        for (let i: number = 0; i < this.parent.sortCollection.length; i++) {
            if (this.parent.sortCollection[i] && this.parent.sortCollection[i].sheetIndex === sheetIdx) {
                this.parent.sortCollection.splice(i, 1);
            }
        }
        this.parent.sortCollection.push({
            sortRange: getRangeAddress(range), columnIndex: cell[1], order: sortOrder,
            sheetIndex: sheetIdx
        });
        this.closeDialog();
    }

    /**
     * Triggers when OK button or clear filter item is selected
     *
     * @param {DataManager} dataSource - Specify the data source
     * @param {Object} args - Specify the data source
     * @param {string} args.action - Specify the action
     * @param {PredicateModel[]} args.filterCollection - Specify the filter collection.
     * @param {string} args.field - Specify the field.
     * @param {number} args.sIdx - Specify the index.
     * @returns {void} - Triggers when OK button or clear filter item is selected
     */
    private filterSuccessHandler(dataSource: DataManager, args: {
        action: string, filterCollection: PredicateModel[], field: string, sIdx?: number
    }): void {
        let sheetIdx: number = args.sIdx;
        if (!sheetIdx && sheetIdx !== 0) { sheetIdx = this.parent.activeSheetIndex; }
        let predicates: PredicateModel[] = this.filterCollection.get(sheetIdx);
        const dataManager: DataManager = new DataManager(predicates as JSON[]);
        const query: Query = new Query();
        const fields: { field: string }[] = dataManager.executeLocal(query.where('field', 'equal', args.field)) as { field: string }[];
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
            if (predicates.length) {
                for (let i: number = 0; i < predicates.length; i++) {
                    args.field = predicates[i].field;
                    if (predicates.length && this.filterClassList.get(sheetIdx)[args.field].indexOf(' e-filtered') < 0) {
                        this.filterClassList.get(sheetIdx)[args.field] += ' e-filtered';
                    }
                }
            }
        } else {
            this.filterClassList.get(sheetIdx)[args.field] = this.filterClassList.get(sheetIdx)[args.field].replace(' e-filtered', '');
        }
        this.filterCollection.set(sheetIdx, predicates);
        const filterOptions: FilterOptions = {
            datasource: dataSource,
            predicates: this.getPredicates(sheetIdx)
        };
        this.filterRange.get(sheetIdx)[2] = getSheet(this.parent as Workbook, sheetIdx).usedRange.rowIndex; //extend the range if filtered
        this.applyFilter(filterOptions, getRangeAddress(this.filterRange.get(sheetIdx)));
    }

    /**
     * Triggers events for filtering and applies filter.
     *
     * @param {FilterOptions} filterOptions - Specify the filteroptions.
     * @param {string} range - Specify the range.
     * @returns {void} - Triggers events for filtering and applies filter.
     */
    private applyFilter(filterOptions: FilterOptions, range: string): void {
        const args: BeforeFilterEventArgs = { range: range, filterOptions: filterOptions, cancel: false };
        this.parent.trigger(beforeFilter, args);
        if (args.cancel) { return; }
        this.parent.showSpinner();
        this.parent.filter(filterOptions, range).then((args: FilterEventArgs) => {
            this.refreshFilterRange();
            this.parent.notify(getFilteredCollection, null);
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
     *
     * @param {number} sheetIdx - Specify the sheetindex
     * @returns {Predicate[]} - Gets the predicates for the sheet
     */
    private getPredicates(sheetIdx: number): Predicate[] {
        const predicateList: Predicate[] = [];
        const excelPredicate: Predicate = CheckBoxFilterBase.getPredicate(this.filterCollection.get(sheetIdx));
        for (const prop of Object.keys(excelPredicate)) {
            predicateList.push(<Predicate>excelPredicate[prop]);
        }
        return predicateList;
    }

    /**
     * Gets the column type to pass it into the excel filter options.
     *
     * @param {SheetModel} sheet - Specify the sheet.
     * @param {number} colIndex - Specify the colindex
     * @param {number[]} range - Specify the range.
     * @returns {string} - Gets the column type to pass it into the excel filter options.
     */
    private getColumnType(sheet: SheetModel, colIndex: number, range: number[]): string {
        let num: number = 0; let str: number = 0; let date: number = 0; const time: number = 0;
        for (let i: number = range[0]; i <= sheet.usedRange.rowIndex; i++) {
            const cell: CellModel = getCell(i, colIndex - 1, sheet);
            if (cell) {
                if (cell.format) {
                    const type: string = getTypeFromFormat(cell.format).toLowerCase();
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
     *
     * @returns {void} - Triggers before the custom filter dialog opened.
     */
    private beforeCustomFilterOpenHandler(): void {
        this.closeDialog();
    }

    /**
     * Clears all the filtered columns in the active sheet.
     *
     * @returns {void} - Clears all the filtered columns in the active sheet.
     */
    private clearAllFilterHandler(): void {
        if (this.filterRange.has(this.parent.activeSheetIndex)) {
            this.filterCollection.set(this.parent.activeSheetIndex, []);
            for (const key of Object.keys(this.filterClassList.get(this.parent.activeSheetIndex))) {
                this.filterClassList.get(this.parent.activeSheetIndex)[key] = '';
            }
            this.refreshFilterRange();
        }
    }

    /**
     * Clear filter from the field.
     *
     * @param {any} args - Specifies the args
     * @param {{ field: string }} args.field - Specify the args
     * @returns {void} - Clear filter from the field.
     */
    private clearFilterHandler(args: { field: string }): void {
        this.filterSuccessHandler(null, { action: 'clear-filter', filterCollection: [], field: args.field });
    }

    /**
     * Reapplies the filter.
     *
     * @returns {void} - Reapplies the filter.
     */
    private reapplyFilterHandler(): void {
        const sheetIdx: number = this.parent.activeSheetIndex;
        if (this.filterRange.has(sheetIdx)) {
            this.applyFilter({ predicates: this.getPredicates(sheetIdx) }, getRangeAddress(this.filterRange.get(sheetIdx)));
        }
    }

    /**
     * Gets the filter information of the sheet.
     *
     * @param {FilterInfoArgs} args - Specify the args
     * @returns {void} - Gets the filter information of the sheet.
     */
    private getFilterRangeHandler(args: FilterInfoArgs): void {
        const sheetIdx: number = args.sheetIdx;
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
     *
     * @returns {Object} - Returns the custom operators for filter items.
     */
    private getLocalizedCustomOperators(): Object {
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        const numOptr: Object[] = [
            { value: 'equal', text: l10n.getConstant('Equal') },
            { value: 'greaterthan', text: l10n.getConstant('GreaterThan') },
            { value: 'greaterthanorequal', text: l10n.getConstant('GreaterThanOrEqual') },
            { value: 'lessthan', text: l10n.getConstant('LessThan') },
            { value: 'lessthanorequal', text: l10n.getConstant('LessThanOrEqual') },
            { value: 'notequal', text: l10n.getConstant('NotEqual') }
        ];
        const customOperators: Object = {
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

    /**
     * To get filtered range and predicates collections
     *
     * @returns {void} - To get filtered range and predicates collections
     */
    private getFilteredCollection(): void {
        const sheetLen: number = this.parent.sheets.length;
        const col: FilterCollectionModel[] = []; let fil: FilterCollectionModel;
        for (let i: number = 0; i < sheetLen; i++) {
            let range: number[]; let hasFilter: boolean;
            const args: FilterInfoArgs = { sheetIdx: i, filterRange: range, hasFilter: hasFilter };
            this.getFilterRangeHandler(args);
            if (args.hasFilter) {
                const colCollection: number[] = []; const condition: string[] = [];
                const value: (string | number | boolean | Date)[] = []; const type: string[] = []; const predi: string[] = [];
                const predicate: PredicateModel[] = this.filterCollection.get(args.sheetIdx);
                for (let i: number = 0; i < predicate.length; i++) {
                    if (predicate[i].field && predicate[i].operator) {
                        const colIdx: number = getCellIndexes(predicate[i].field + '1')[1];
                        colCollection.push(colIdx);
                        condition.push(predicate[i].operator);
                        value.push(predicate[i].value);
                        type.push(predicate[i].type);
                        predi.push(predicate[i].predicate);
                    }
                }
                const address: string  = getRangeAddress(args.filterRange);
                fil = {
                    sheetIndex: args.sheetIdx, filterRange: address, hasFilter: args.hasFilter, column: colCollection,
                    criteria: condition, value: value, dataType: type
                };
                col.push(fil);
            }
        }
        if (fil) {
            this.parent.filterCollection = col;
        }
    }

    private updateFilter(args?: { initLoad: boolean, isOpen: boolean }): void {
        if (this.parent.filterCollection && (args.initLoad || args.isOpen)) {
            for (let i: number = 0; i < this.parent.filterCollection.length; i++) {
                let filterCol: FilterCollectionModel = this.parent.filterCollection[i];
                let sIdx: number = filterCol.sheetIndex;
                if (i === 0) {
                    sIdx = 0;
                }
                let predicates: PredicateModel[] = [];
                if (filterCol.column) {
                    for (let j: number = 0; j < filterCol.column.length; j++) {
                        let predicateCol: PredicateModel = {
                            field: getCellAddress(0, filterCol.column[j]).charAt(0),
                            operator: this.getFilterOperator(filterCol.criteria[j]), value: filterCol.value[j].toString().split('*').join('')
                        };
                        predicates.push(predicateCol);
                    }
                }
                for (let i: number = 0; i < predicates.length - 1; i++) {
                    if (predicates[i].field === predicates[i + 1].field) {
                        if (!predicates[i].predicate) {
                            predicates[i].predicate = 'or';
                        }
                        predicates[i + 1].predicate = 'or';
                    }
                }
                this.parent.notify(initiateFilterUI, { predicates: predicates !== [] ? predicates : null, range: filterCol.filterRange, sIdx: sIdx });
            }
            if (this.parent.sortCollection) {
                this.parent.notify(sortImport, null);
            }
        }
    }

    private getFilterOperator(value: string): string {
        switch (value) {
            case "BeginsWith":
                value = "startswith";
                break;
            case "Less":
                value = "lessthan";
                break;
            case "EndsWith":
                value = "endswith";
                break;
            case "Equal":
                value = "equal";
                break;
            case "Notequal":
                value = "notEqual";
                break;
            case "Greater":
                value = "greaterthan";
                break;
            case "Contains":
                value = "contains";
                break;
            case "LessOrEqual":
                value = "lessthanorequal";
                break;
            case "GreaterOrEqual":
                value = "greaterthanorequal";
                break;
        }
        return value;
    }
}
