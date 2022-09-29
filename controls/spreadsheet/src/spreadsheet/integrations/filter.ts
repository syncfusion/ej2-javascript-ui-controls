/* eslint-disable no-useless-escape */
import { Spreadsheet, locale, dialog, mouseDown, renderFilterCell, initiateFilterUI, FilterInfoArgs, getStartEvent, duplicateSheetOption } from '../index';
import { reapplyFilter, filterCellKeyDown, DialogBeforeOpenEventArgs } from '../index';
import { getFilteredColumn, cMenuBeforeOpen, filterByCellValue, clearFilter, getFilterRange, applySort } from '../index';
import { filterRangeAlert, getFilteredCollection, beforeDelete, sheetsDestroyed, initiateFilter, duplicateSheetFilterHandler } from '../../workbook/common/event';
import { FilterCollectionModel, getRangeIndexes, getCellAddress, updateFilter, ColumnModel, beforeInsert } from '../../workbook/index';
import { getIndexesFromAddress, getSwapRange, getColumnHeaderText, CellModel, getDataRange, isCustomDateTime } from '../../workbook/index';
import { getData, Workbook, getTypeFromFormat, getCell, getCellIndexes, getRangeAddress, getSheet, inRange } from '../../workbook/index';
import { SheetModel, sortImport, clear, getColIndex, SortCollectionModel, setRow, ExtendedRowModel, hideShow } from '../../workbook/index';
import { beginAction, FilterOptions, BeforeFilterEventArgs, FilterEventArgs, ClearOptions, getValueFromFormat } from '../../workbook/index';
import { isFilterHidden, isNumber } from '../../workbook/index';
import { getComponent, EventHandler, isUndefined, isNullOrUndefined, Browser, KeyboardEventArgs, removeClass, detach } from '@syncfusion/ej2-base';
import { L10n } from '@syncfusion/ej2-base';
import { Dialog } from '../services';
import { IFilterArgs, PredicateModel, ExcelFilterBase, beforeFltrcMenuOpen, CheckBoxFilterBase, getUid } from '@syncfusion/ej2-grids';
import { filterCmenuSelect, filterCboxValue, filterDialogCreated, filterDialogClose, createCboxWithWrap } from '@syncfusion/ej2-grids';
import { parentsUntil } from '@syncfusion/ej2-grids';
import { Query, DataManager, Predicate, Deferred } from '@syncfusion/ej2-data';
import { SortOrder, MenuItemModel, NodeKeyPressEventArgs, NodeClickEventArgs, NodeCheckEventArgs } from '@syncfusion/ej2-navigations';
import { TreeView } from '@syncfusion/ej2-navigations';
import { BeforeOpenEventArgs } from '@syncfusion/ej2-popups';
import { completeAction, contentLoaded, beforeCheckboxRender, FilterCheckboxArgs, refreshCheckbox } from '../../spreadsheet/index';

/**
 * `Filter` module is used to handle the filter action in Spreadsheet.
 */
export class Filter {
    private parent: Spreadsheet;
    private filterRange: Map<number, { useFilterRange: boolean, range: number[] }>;
    private filterCollection: Map<number, PredicateModel[]>;
    private filterBtn: HTMLElement;

    /**
     * Constructor for filter module.
     *
     * @param {Spreadsheet} parent - Specifies the Spreadsheet.
     */
    constructor(parent: Spreadsheet) {
        this.parent = parent;
        this.filterCollection = new Map();
        this.filterRange = new Map();
        this.filterBtn = parent.createElement('div', { className: 'e-filter-btn e-control e-btn e-lib e-filter-iconbtn e-icon-btn' });
        this.filterBtn.appendChild(parent.createElement('span', { className: 'e-btn-icon e-icons e-filter-icon' }));
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
        this.filterBtn = null;
        this.parent = null;
    }

    private addEventListener(): void {
        this.parent.on(filterRangeAlert, this.filterRangeAlertHandler, this);
        this.parent.on(initiateFilterUI, this.initiateFilterUIHandler, this);
        this.parent.on(mouseDown, this.filterMouseDownHandler, this);
        this.parent.on(renderFilterCell, this.renderFilterCellHandler, this);
        this.parent.on(beforeFltrcMenuOpen, this.beforeFilterMenuOpenHandler, this);
        this.parent.on(filterCmenuSelect, this.closeDialog, this);
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
        this.parent.on(beforeInsert, this.beforeInsertHandler, this);
        this.parent.on(beforeDelete, this.beforeDeleteHandler, this);
        this.parent.on(sheetsDestroyed, this.deleteSheetHandler, this);
        this.parent.on(clear, this.clearHandler, this);
        this.parent.on(filterDialogCreated, this.filterDialogCreatedHandler, this);
        this.parent.on(filterDialogClose, this.removeFilterClass, this);
        this.parent.on(duplicateSheetFilterHandler, this.duplicateSheetFilterHandler, this);
    }

    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(filterRangeAlert, this.filterRangeAlertHandler);
            this.parent.off(initiateFilterUI, this.initiateFilterUIHandler);
            this.parent.off(mouseDown, this.filterMouseDownHandler);
            this.parent.off(renderFilterCell, this.renderFilterCellHandler);
            this.parent.off(beforeFltrcMenuOpen, this.beforeFilterMenuOpenHandler);
            this.parent.off(filterCmenuSelect, this.closeDialog);
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
            this.parent.off(beforeInsert, this.beforeInsertHandler);
            this.parent.off(beforeDelete, this.beforeDeleteHandler);
            this.parent.off(sheetsDestroyed, this.deleteSheetHandler);
            this.parent.off(clear, this.clearHandler);
            this.parent.off(filterDialogCreated, this.filterDialogCreatedHandler);
            this.parent.off(filterDialogClose, this.removeFilterClass);
            this.parent.off(duplicateSheetFilterHandler, this.duplicateSheetFilterHandler);
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
     * @param {Promise<FilterEventArgs>} args.promise - Spefify the promise.
     * @param {number} args.sIdx - Specify the sIdx
     * @param {boolean} args.isCut - Specify the bool value
     * @param {boolean} args.isUndoRedo - Specify the bool value
     * @param {boolean} args.isInternal - Spefify the isInternal.
     * @returns {void} - Initiates the filter UI for the selected range.
     */
    private initiateFilterUIHandler(
        args: { predicates?: PredicateModel[], range?: string, promise?: Promise<FilterEventArgs>, sIdx?: number, isCut?: boolean,
            isInternal?: boolean, useFilterRange?: boolean }): void {
        const predicates: PredicateModel[] = args ? args.predicates : null;
        let sheetIdx: number = args.sIdx;
        if (!sheetIdx && sheetIdx !== 0) { sheetIdx = this.parent.activeSheetIndex; }
        let deferred: Deferred;
        if (args.promise) {
            deferred = new Deferred(); args.promise = deferred.promise;
        }
        const resolveFn: Function = (): void => {
            if (deferred) {
                deferred.resolve();
            }
        };
        const isInternal: boolean = args.isInternal || args.isCut;
        if (this.filterRange.size > 0 && this.filterRange.has(sheetIdx) && !this.parent.isOpen && !predicates) { //disable filter
            this.removeFilter(sheetIdx, isInternal, false);
            resolveFn();
            return;
        }
        const sheet: SheetModel = getSheet(this.parent  as Workbook, sheetIdx);
        if (this.isInValidFilterRange(sheet, args.range)) {
            const l10n: L10n = this.parent.serviceLocator.getService(locale);
            this.filterRangeAlertHandler({ error: l10n.getConstant('FilterOutOfRangeError') });
            resolveFn();
            return;
        }
        let selectedRange: string = args.range || sheet.selectedRange;
        let eventArgs: { range: string, filterOptions?: FilterOptions, predicates?: PredicateModel[], previousPredicates?: PredicateModel[],
            cancel: boolean, useFilterRange?: boolean, sheetIndex: number };
        let actionArgs: { [key: string]: Object };
        if (!isInternal) {
            eventArgs = { range: selectedRange, sheetIndex: sheetIdx, cancel: false };
            if (args.predicates) {
                eventArgs.predicates = args.predicates;
                eventArgs.previousPredicates = this.filterCollection.get(sheetIdx) && [].slice.call(this.filterCollection.get(sheetIdx));
            } else {
                eventArgs.filterOptions = { predicates: args.predicates as Predicate[] };
            }
            eventArgs.useFilterRange = false;
            actionArgs = { action: 'filter', eventArgs: eventArgs };
            this.parent.notify(beginAction, actionArgs);
            if (eventArgs.cancel) {
                resolveFn();
                return;
            }
            delete eventArgs.cancel;
            args.useFilterRange = eventArgs.useFilterRange;
        }
        if (!args.range && (isInternal || selectedRange === eventArgs.range)) {
            let rangeIdx: number[] = getRangeIndexes(selectedRange);
            if (rangeIdx[0] === rangeIdx[2] && rangeIdx[1] === rangeIdx[3]) {
                rangeIdx = getDataRange(rangeIdx[0], rangeIdx[1], sheet);
                selectedRange = getRangeAddress(rangeIdx);
                if (!isInternal) {
                    eventArgs.range = selectedRange;
                }
            }
        } else if (!isInternal) {
            selectedRange = eventArgs.range;
        }
        if (predicates) {
            if (predicates.length) {
                const filterRange: { useFilterRange: boolean, range: number[] } = this.filterRange.get(sheetIdx);
                if (filterRange) {
                    args.useFilterRange = filterRange.useFilterRange;
                }
                this.processRange(sheet, sheetIdx, selectedRange, true, args.useFilterRange);
                const range: number[] = this.filterRange.get(sheetIdx).range.slice();
                range[0] = range[0] + 1; // to skip first row.
                if (!args.useFilterRange) {
                    range[2] = sheet.usedRange.rowIndex; //filter range should be till used range.
                }
                range[1] = range[3] = getColIndex(predicates[0].field);
                const addr: string = `${sheet.name}!${this.getPredicateRange(range, predicates.slice(1, predicates.length))}`;
                const fullAddr: string = getRangeAddress(range);
                getData(
                    this.parent, addr, true, true, null, true, null, null, false, fullAddr).then(
                    (jsonData: { [key: string]: CellModel }[]) => {
                        this.filterSuccessHandler(
                            new DataManager(jsonData),
                            { action: 'filtering', filterCollection: predicates, field: predicates[0].field, sIdx: args.sIdx,
                            isInternal: isInternal, prevPredicates: eventArgs && eventArgs.previousPredicates });
                        resolveFn();
                    });
                return;
            } else {
                this.clearFilterHandler({ sheetIndex: sheetIdx });
                resolveFn();
            }
        } else {
            this.processRange(sheet, sheetIdx, selectedRange, false, args.useFilterRange);
            resolveFn();
        }
        if (!isInternal) {
            this.parent.notify(completeAction, actionArgs);
        }
    }

    /**
     * Processes the range if no filter applied.
     *
     * @param {SheetModel} sheet - Specify the sheet.
     * @param {number} sheetIdx - Specify the sheet index.
     * @param {string} filterRange - Specify the filterRange.
     * @param {boolean} preventRefresh - To prevent refreshing the filter buttons.
     * @param {boolean} useFilterRange - Specifies whether to consider filtering range or used range during filering.
     * @returns {void} - Processes the range if no filter applied.
     */
    private processRange(
        sheet: SheetModel, sheetIdx: number, filterRange?: string, preventRefresh?: boolean, useFilterRange?: boolean): void {
        const range: number[] = getSwapRange(getIndexesFromAddress(filterRange || sheet.selectedRange));
        if (range[0] === range[2] && range[1] === range[3]) { //if selected range is a single cell
            range[0] = 0; range[1] = 0; range[2] = sheet.usedRange.rowIndex; range[3] = sheet.usedRange.colIndex;
        } else if (range[3] > sheet.usedRange.colIndex) {
            range[3] = sheet.usedRange.colIndex;
        }
        this.filterRange.set(sheetIdx, { useFilterRange: useFilterRange, range: range });
        this.filterCollection.set(sheetIdx, []);
        if (!preventRefresh) { this.refreshFilterRange(range, false, sheetIdx); }
    }

    /**
     * Removes all the filter related collections for the active sheet.
     *
     * @param {number} sheetIdx - Specify the sheet index.
     * @param {boolean} isCut - Specify the bool value.
     * @param {boolean} preventRefresh - Specify the preventRefresh.
     * @param {boolean} isUndoRedo - Specify the isUndoRedo.
     * @returns {void} - Removes all the filter related collections for the active sheet.
     */
    private removeFilter(sheetIdx: number, isCut?: boolean, preventRefresh?: boolean): void {
        const range: number[] = this.filterRange.get(sheetIdx).range.slice();
        const rangeAddr: string = getRangeAddress(range);
        let args: { [key: string]: Object };
        if (!isCut) {
            args = { action: 'filter', eventArgs: { range: rangeAddr, sheetIndex: sheetIdx, cancel: false } };
            this.parent.notify(beginAction, args);
            if ((args.eventArgs as { cancel: boolean }).cancel) {
                return;
            }
            delete (args.eventArgs as { cancel: boolean }).cancel;
        }
        if (this.filterCollection.get(sheetIdx).length || preventRefresh) {
            this.clearFilterHandler({ preventRefresh: preventRefresh, sheetIndex: sheetIdx });
        }
        this.filterRange.delete(sheetIdx);
        this.filterCollection.delete(sheetIdx);
        this.refreshFilterRange(range, true, sheetIdx);
        if (this.parent.filterCollection) {
            let count: number = 0; let filterColl: FilterCollectionModel;
            for (let i: number = 0, len: number = this.parent.filterCollection.length; i < len; i++) {
                filterColl = this.parent.filterCollection[count];
                if (filterColl.sheetIndex === sheetIdx && filterColl.filterRange === rangeAddr) {
                    this.parent.filterCollection.splice(count, 1);
                } else {
                    count++;
                }
            }
        }
        if (!isCut) {
            this.parent.notify(completeAction, args);
        }
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
        const cell: number[] = getRangeIndexes(sheet.activeCell);
        if (!this.isFilterRange(sheetIdx, cell[0], cell[1])) {
            this.processRange(sheet, sheetIdx);
        }
        const range: number[] = this.filterRange.get(sheetIdx).range.slice();
        range[0] = range[0] + 1; // to skip first row.
        range[2] = sheet.usedRange.rowIndex; //filter range should be till used range.
        range[1] = range[3] = cell[1];
        const field: string = getColumnHeaderText(cell[1] + 1);
        const selectedCell: CellModel = getCell(cell[0], cell[1], sheet);
        let cellVal: string | number | Date = getValueFromFormat(this.parent, selectedCell);
        if (isNumber(<string>cellVal) && !(selectedCell.format && selectedCell.format === '@')) {
            cellVal = parseFloat(<string>cellVal);
        }
        const predicates: PredicateModel[] = [{ field: field, operator: 'equal', type: this.getColumnType(sheet, cell[1], cell).type,
            matchCase: false, value: cellVal }];
        const addr: string = `${sheet.name}!${this.getPredicateRange(range, this.filterCollection.get(sheetIdx))}`;
        const fullAddr: string = getRangeAddress(range);
        getData(this.parent, addr, true, true, null, true, null, null, false, fullAddr).then((jsonData: { [key: string]: CellModel }[]) => {
            this.filterSuccessHandler(
                new DataManager(jsonData), { action: 'filtering', filterCollection: predicates, field: field, isFilterByValue: true });
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
        const sheetIdx: number = !isNullOrUndefined(args.sIdx) ? args.sIdx : this.parent.activeSheetIndex;
        if (sheetIdx === this.parent.activeSheetIndex && this.isFilterCell(sheetIdx, args.rowIndex, args.colIndex)) {
            if (!args.td) { return; }
            let filterButton: HTMLElement = args.td.querySelector('.e-filter-icon');
            if (filterButton) {
                filterButton.className = 'e-btn-icon e-icons e-filter-icon' + this.getFilterSortClassName(args.colIndex, sheetIdx);
            } else {
                filterButton = this.filterBtn.cloneNode(true) as HTMLElement;
                filterButton.firstElementChild.className += this.getFilterSortClassName(args.colIndex, sheetIdx);
                args.td.insertBefore(filterButton, args.td.firstChild);
            }
        }
    }

    private getFilterSortClassName(colIdx: number, sheetIdx: number): string {
        const field: string = getColumnHeaderText(colIdx + 1);
        let className: string = '';
        const predicates: PredicateModel[] = this.filterCollection.get(sheetIdx);
        const sortCollection: SortCollectionModel[] = this.parent.sortCollection;
        for (let i: number = 0; i < predicates.length; i++) {
            if (predicates[i].field === field) {
                className = ' e-filtered';
                break;
            }
        }
        if (sortCollection) {
            for (let i: number = 0; i < sortCollection.length; i++) {
                if (sortCollection[i].sheetIndex === sheetIdx && sortCollection[i].columnIndex === colIdx) {
                    className += sortCollection[i].order === 'Ascending' ? ' e-sortasc-filter' : ' e-sortdesc-filter';
                    break;
                }
            }
        }
        return className;
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
        if (!filterRange && !this.filterRange.get(sheetIdx)) {
            filterRange = [0, 0, 0, 0];
        }
        const range: number[] = filterRange || this.filterRange.get(sheetIdx).range.slice();
        for (let index: number = range[1]; index <= range[3]; index++) {
            const cell: HTMLElement = this.parent.getCell(range[0], index);
            if (remove) {
                if (cell && cell.hasChildNodes()) {
                    const element: Element = cell.querySelector('.e-filter-btn');
                    if (element) { element.parentElement.removeChild(element); }
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
        const range: number[] = this.filterRange.get(sheetIdx) && this.filterRange.get(sheetIdx).range;
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
        const range: number[] = this.filterRange.get(sheetIdx) && this.filterRange.get(sheetIdx).range;
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
    private getFilteredColumnHandler(args: { field?: string, clearFilterText?: string, isFiltered?: boolean, isClearAll?: boolean, sheetIndex?: number }): void {
        const sheetIdx: number = isUndefined(args.sheetIndex) ? this.parent.activeSheetIndex : args.sheetIndex;
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        args.clearFilterText = l10n.getConstant('ClearFilter');
        if (this.filterRange.has(sheetIdx)) {
            const filterCollection: PredicateModel[] = this.filterCollection.get(sheetIdx);
            if (args.isClearAll) {
                args.isFiltered = filterCollection && filterCollection.length > 0;
                return;
            }
            const range: number[] = this.filterRange.get(sheetIdx).range.slice();
            const sheet: SheetModel = getSheet(this.parent, sheetIdx);
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
            if (excelFilter) {
                excelFilter.hide();
            }
            this.parent.notify(filterDialogClose, null);
        }
    }

    private removeFilterClass(): void {
        if (this.parent.element.style.position === 'relative') {
            this.parent.element.style.position = '';
        }
        if (this.parent.element.classList.contains('e-filter-open')) {
            this.parent.element.classList.remove('e-filter-open');
        }
    }

    /**
     * Returns true if the filter popup is opened.
     *
     * @returns {boolean} - Returns true if the filter popup is opened.
     */
    private isPopupOpened(): boolean {
        const filterPopup: HTMLElement = document.getElementsByClassName('e-filter-popup')[0] as HTMLElement;
        return filterPopup && filterPopup.id.includes(this.parent.element.id) && filterPopup.style.display !== 'none';
    }

    private filterCellKeyDownHandler(args: { isFilterCell: boolean, closePopup?: boolean }): void {
        const sheet: SheetModel = this.parent.getActiveSheet();
        const indexes: number[] = getCellIndexes(sheet.activeCell);
        if (this.isFilterCell(this.parent.activeSheetIndex, indexes[0], indexes[1])) {
            if (args.closePopup) {
                this.closeDialog();
            } else {
                args.isFilterCell = true;
                if (!this.isPopupOpened()) {
                    const target: HTMLElement = this.parent.getCell(indexes[0], indexes[1]);
                    if (target) {
                        this.openDialog(target);
                    }
                }
            }
        }
    }

    private filterMouseDownHandler(e: MouseEvent & TouchEvent): void {
        if ((Browser.isDevice && e.type === 'mousedown') || this.parent.getActiveSheet().isProtected) {
            return;
        }
        const target: HTMLElement = e.target as HTMLElement;
        if (target.classList.contains('e-filter-icon') || target.classList.contains('e-filter-btn')) {
            if (this.isPopupOpened()) {
                this.closeDialog();
            }
            this.openDialog(parentsUntil(target, 'e-cell') as HTMLElement);
        } else if (this.isPopupOpened()) {
            const offsetEle: Element = target.offsetParent;
            if (!target.classList.contains('e-searchinput') && !target.classList.contains('e-searchclear') && (offsetEle &&
                !offsetEle.classList.contains('e-filter-popup') && !offsetEle.classList.contains('e-text-content') &&
                !offsetEle.classList.contains('e-checkboxtree') && !offsetEle.classList.contains('e-checkbox-wrapper'))) {
                this.closeDialog();
            } else {
                this.selectSortItemHandler(target);
            }
        }
    }

    private initTreeView(args: FilterCheckboxArgs, excelFilter: ExcelFilterBase): void {
        let checkedNodes: string[] = [];
        const allNodes: string[] = [];
        const idColl: { [key: string]: boolean } = {};
        let groupedYears: { [key: string]: Object }[] = [];
        let groupedMonths: { [key: string]: Object }[] = [];
        let groupedData: { [key: string]: Object }[] = [];
        let otherData: { [key: string]: Object }[] = [];
        let value: string; let month: string; let day: number; let date: Date; let mId: string; let dId: string; let monthNum: number;
        const months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October',
            'November', 'December'];
        let grpObj: { [key: string]: Object };
        let indeterminate: boolean =  false;
        const sheet: SheetModel = this.parent.getActiveSheet();
        const addNodes: (data: { [key: string]: Object }) => void = (data: { [key: string]: Object }): void => {
            idColl[dId] = true;
            if (isFilterHidden(sheet, Number(data['__rowIndex']) - 1)) {
                indeterminate = true;
            } else {
                checkedNodes.push(dId);
            }
            allNodes.push(dId);
        };
        args.dataSource.forEach((data: { [key: string]: Object }): void => {
            date = data[args.column.field] as Date;
            if (typeof date === 'object' && !!Date.parse(date.toString())) {
                value = date.getFullYear().toString();
                if (!idColl[value]) {
                    grpObj = { __rowIndex: value, hasChild: true };
                    grpObj[args.column.field] = value;
                    groupedYears.push(grpObj);
                    idColl[value] = true;
                }
                monthNum = date.getMonth();
                month = months[monthNum];
                mId = value + ' ' + month;
                if (!idColl[mId]) {
                    grpObj = { __rowIndex: mId, pId: value, hasChild: true, month: monthNum };
                    grpObj[args.column.field] = month;
                    groupedMonths.push(grpObj);
                    idColl[mId] = true;
                }
                day = date.getDate();
                dId = mId + ' ' + day.toString();
                if (!idColl[dId]) {
                    grpObj = { __rowIndex: dId, pId: mId };
                    grpObj[args.column.field] = day;
                    groupedData.push(grpObj);
                    addNodes(data);
                }
            } else {
                if (!data[args.column.field] && data[args.column.field] !== 0) {
                    dId = 'blanks';
                    value = this.parent.serviceLocator.getService<L10n>(locale).getConstant('Blanks');
                } else {
                    dId = 'text ' + data[args.column.field].toString().toLowerCase();
                    value = <string>data[args.column.field];
                }
                if (!idColl[dId]) {
                    grpObj = { __rowIndex: dId };
                    grpObj[args.column.field] = value;
                    otherData.push(grpObj);
                    addNodes(data);
                }
            }
        });
        groupedYears = new DataManager(
            groupedYears).executeLocal(new Query().sortBy(args.column.field, 'decending')) as { [key: string]: Object }[];
        groupedMonths = new DataManager(
            groupedMonths).executeLocal(new Query().sortBy('month', 'ascending')) as { [key: string]: Object }[];
        groupedData = new DataManager(
            groupedData).executeLocal(new Query().sortBy(args.column.field, 'ascending')) as { [key: string]: Object }[];
        groupedData = groupedYears.concat(groupedMonths.concat(groupedData));
        if (otherData.length) {
            otherData = new DataManager(
                otherData).executeLocal(new Query().sortBy(args.column.field, 'ascending')) as { [key: string]: Object }[];
            groupedData = groupedData.concat(otherData);
        }
        const nodeClick: Function = (args: NodeKeyPressEventArgs | NodeClickEventArgs ): void => {
            let checkedNode: HTMLLIElement[] = [args.node];
            if ((args.event.target as Element).classList.contains('e-fullrow') || (args.event as KeyboardEventArgs).key == 'Enter') {
               let getNodeDetails: { [key: string]: Object } = treeViewObj.getNode(args.node);
                if (getNodeDetails.isChecked == 'true') {
                    treeViewObj.uncheckAll(checkedNode);
                } else {
                    treeViewObj.checkAll(checkedNode);
                }
            }
        }
        const selectAllClick: Function = (): void => {
            cBox.indeterminate = false;
            if (cBoxFrame.classList.contains('e-check')) {
                treeViewObj.uncheckAll();
                cBoxFrame.classList.add('e-uncheck');
                cBox.checked = false;
            } else {
                treeViewObj.checkAll();
                cBoxFrame.classList.add('e-check');
                cBox.checked = true;
            }
        };
        const updateState: Function = (): void => {
            removeClass([cBoxFrame], ['e-check', 'e-stop', 'e-uncheck']);
            if ((args.btnObj.element as HTMLButtonElement).disabled) {
                (args.btnObj.element as HTMLButtonElement).disabled = false;
            }
            if (indeterminate) {
                if (treeViewObj.checkedNodes.length) {
                    cBoxFrame.classList.add('e-stop');
                } else {
                    cBoxFrame.classList.add('e-uncheck');
                    (args.btnObj.element as HTMLButtonElement).disabled = true;
                }
            } else {
                cBoxFrame.classList.add('e-check');
            }
            cBox.indeterminate = indeterminate;
            cBox.checked = !indeterminate;
        }
        const selectAllObj: { [key: string]: Object } = {};
        selectAllObj[args.column.field] = this.parent.serviceLocator.getService<L10n>(locale).getConstant('SelectAll');
        const selectAll: Element = createCboxWithWrap(
            getUid('cbox'), (excelFilter as any).createCheckbox(selectAllObj[args.column.field], false, selectAllObj), 'e-ftrchk');
        selectAll.classList.add('e-spreadsheet-ftrchk')
        const cBoxFrame: Element = selectAll.querySelector('.e-frame');
        cBoxFrame.classList.add('e-selectall');
        selectAll.addEventListener('click', selectAllClick.bind(this));
        args.element.appendChild(selectAll);
        const cBox: HTMLInputElement = selectAll.querySelector('.e-chk-hidden') as HTMLInputElement;
        const treeViewEle = this.parent.createElement('div');
        const treeViewObj: TreeView = new TreeView({
            fields: { dataSource: groupedData, id: '__rowIndex', parentID: 'pId', text: args.column.field, hasChildren: 'hasChild' },
            enableRtl: this.parent.enableRtl, showCheckBox: true, cssClass: 'e-checkboxtree', checkedNodes: checkedNodes,
            nodeClicked: nodeClick.bind(this),
            keyPress: nodeClick.bind(this),
            nodeChecked: (args: NodeCheckEventArgs): void => {
                if (args.action !== 'indeterminate') {
                    indeterminate = treeViewObj.checkedNodes.length !== (treeViewObj.fields.dataSource as Object[]).length;
                    updateState();
                }
            }
        });
        treeViewObj.createElement = this.parent.createElement;
        treeViewObj.appendTo(treeViewEle);
        args.element.appendChild(treeViewEle);
        checkedNodes = treeViewObj.checkedNodes;
        updateState();
        const applyBtnClickHandler: Function = (): void => {
            if (treeViewObj.checkedNodes.length === groupedData.length) {
                this.filterSuccessHandler(new DataManager(args.dataSource), { action: 'clear-filter', field: args.column.field });
            } else {
                this.generatePredicate(
                    treeViewObj.checkedNodes, otherData.length ? 'string' : args.type, args.column.field, excelFilter, allNodes,
                    treeViewObj.checkedNodes.length > groupedData.length / 2);
            }
        };
        args.btnObj.element.addEventListener('click', applyBtnClickHandler.bind(this));
        const refreshCheckboxes: Function = this.refreshCheckbox.bind(this, groupedData, treeViewObj, checkedNodes);
        const filterDlgCloseHandler: Function = (): void => {
            this.parent.off(refreshCheckbox, refreshCheckboxes);
            this.parent.off(filterDialogClose, filterDlgCloseHandler);
        };
        this.parent.on(filterDialogClose, filterDlgCloseHandler, this);
        this.parent.on(refreshCheckbox, refreshCheckboxes, this);
    }

    private generatePredicate(
        checkedNodes: string[], type: string, field: string, excelFilter: ExcelFilterBase, allNodes: string[], isNotEqual: boolean): void {
        const predicates: PredicateModel[] = [];
        let predicate: PredicateModel;
        const months: { [key: string]: number } = { 'January': 0, 'February': 1, 'March': 2, 'April': 3, 'May': 4, 'June': 5, 'July': 6,
            'August': 7, 'September': 8, 'October': 9, 'November': 10, 'December': 11 };
        let valArr: string[]; let date: Date; let val: string | number; let otherType: string;
        const updateOtherPredicate: Function = (): void => {
            if (valArr[0] === 'blanks') {
                predicates.push(Object.assign({ value: '', type: type }, predicate));
            } else if (valArr[0] === 'text') {
                valArr.splice(0, 1)
                val = valArr.join(' ');
                if (isNaN(Number(val))) {
                    otherType = 'string';
                } else {
                    val = Number(val);
                    otherType = 'number';
                }
                predicates.push(Object.assign({ value: val, type: otherType }, predicate));
            }
        };
        const setDate: () => void = (): void => {
            date = new Date(Number(valArr[0]), months[valArr[1]], Number(valArr[2]));
            if (date.getDate()) {
                predicates.push(Object.assign({ value: date, type: type }, predicate));
            } else {
                updateOtherPredicate();
            }
        };
        if (isNotEqual) {
            predicate = { field: field, ignoreAccent: false, matchCase: false, predicate: 'and', operator: 'notequal' };
            for (let i: number = 0, len: number = allNodes.length; i < len; i++) {
                if (checkedNodes.indexOf(allNodes[i]) === -1) {
                    valArr = allNodes[i].split(' ');
                    setDate();
                }
            }
        } else {
            predicate = { field: field, ignoreAccent: false, matchCase: false, predicate: 'or', operator: 'equal' };
            for (let i: number = 0, len: number = checkedNodes.length; i < len; i++) {
                valArr = checkedNodes[i].split(' ');
                if (valArr.length === 3) {
                    setDate();
                } else {
                    updateOtherPredicate();
                }
            }
        }
        excelFilter.initiateFilter(predicates);
    }

    private refreshCheckbox(
        groupedData: { [key: string]: Object }[], treeViewObj: TreeView, checkedNodes: string[], args: { event: KeyboardEvent }): void {
        let searchValue: string;
        if (args.event.type === 'keyup') {
            searchValue = (args.event.target as HTMLInputElement).value;
        } else if ((args.event.target as Element).classList.contains('e-search-icon')) {
            return;
        }
        let filteredList: Object[];
        const changeData: Function = (): void => {
            if (filteredList.length && !(treeViewObj.fields.dataSource as Object[]).length) {
                const wrapper: Element = treeViewObj.element.parentElement;
                wrapper.getElementsByClassName('e-spreadsheet-ftrchk')[0].classList.remove('e-hide');
                detach(wrapper.getElementsByClassName('e-checkfltrnmdiv')[0]);
            }
            treeViewObj.fields.dataSource = <{ [key: string]: Object }[]>filteredList;
            treeViewObj.dataBind();
        };
        if (searchValue) {
            filteredList = new DataManager(groupedData).executeLocal(new Query().where(
                new Predicate(treeViewObj.fields.text, 'contains', searchValue, true)));
            const filterId: { [key: string]: boolean } = {}; const predicates = []; let key: string; let initList: Object[];
            const strFilter: boolean = isNaN(Number(searchValue));
            let expandId: string[]; let level: number;
            if (strFilter) {
                for (let i: number = 0; i < filteredList.length; i++) {
                    if (!filteredList[i]['hasChild']) {
                        continue;
                    }
                    predicates.push(new Predicate('pId', 'equal', filteredList[i]['__rowIndex'], false));
                    key = filteredList[i]['pId'];
                    if (!filterId[key]) {
                        predicates.push(new Predicate('__rowIndex', 'equal', key, false));
                        filterId[key] = true;
                    }
                }
                initList = filteredList;
                level = 1;
            } else {
                let year: string; const filterParentId: { [key: string]: boolean } = {}; expandId = [];
                for (let i: number = 0; i < filteredList.length; i++) {
                    key = filteredList[i]['pId'];
                    if (key) {
                        year = key.split(' ')[0];
                        if (!filterId[key]) {
                            predicates.push(new Predicate('__rowIndex', 'equal', key, false));
                            filterId[key] = true;
                            expandId.push(year);
                            expandId.push(key);
                        }
                        if (!filterParentId[year]) {
                            if (!filterId[year]) {
                                predicates.push(new Predicate('__rowIndex', 'equal', year, false));
                                filterId[year] = true;
                            }
                            predicates.push(new Predicate('__rowIndex', 'equal', filteredList[i]['__rowIndex'], false));
                        }
                    } else {
                        key = filteredList[i]['__rowIndex'];
                        if (!filterParentId[key]) {
                            predicates.push(new Predicate('__rowIndex', 'contains', key, false));
                            filterParentId[key] = true;
                        }
                    }
                }
                initList = [];
            }
            if (filteredList.length) {
                if (predicates.length) {
                    filteredList = initList.concat(new DataManager(groupedData).executeLocal(new Query().where(Predicate.or(predicates))));             
                }
                changeData();
                treeViewObj.checkAll();
                const duration: number = treeViewObj.animation.expand.duration;
                treeViewObj.animation.expand.duration = 0;
                treeViewObj.expandAll(expandId, level);
                treeViewObj.animation.expand.duration = duration;
            } else if ((treeViewObj.fields.dataSource as Object[]).length) {
                changeData();
                const wrapper: Element = treeViewObj.element.parentElement;
                wrapper.getElementsByClassName('e-spreadsheet-ftrchk')[0].classList.add('e-hide');
                const noRecordEle: Element = this.parent.createElement('div', { className: 'e-checkfltrnmdiv' });
                noRecordEle.appendChild(this.parent.createElement(
                    'span', { innerHTML: this.parent.serviceLocator.getService<L10n>(locale).getConstant('NoResult') }));
                wrapper.appendChild(noRecordEle);
            }
        } else {
            filteredList = groupedData;
            changeData();
            treeViewObj.checkedNodes = checkedNodes;
            treeViewObj.dataBind();
        }
    }

    private openDialog(cell: HTMLElement): void {
        const colIndex: number = parseInt(cell.getAttribute('aria-colindex'), 10);
        const field: string = getColumnHeaderText(colIndex);
        this.parent.showSpinner();
        const sheetIdx: number = this.parent.activeSheetIndex;
        const filterRange: { useFilterRange: boolean, range: number[] } = this.filterRange.get(sheetIdx);
        const range: number[] = filterRange.range.slice();
        const sheet: SheetModel = this.parent.getActiveSheet();
        const filterCell: CellModel = getCell(range[0], colIndex - 1, sheet);
        const displayName: string = this.parent.getDisplayText(filterCell);
        range[0] = range[0] + 1; // to skip first row.
        if (!filterRange.useFilterRange) {
            range[2] = sheet.usedRange.rowIndex; //filter range should be till used range.
        }
        const fullRange: number[] = [range[0], colIndex - 1, range[2], colIndex - 1];
        const totalRange: { address: string, filteredCol: boolean, otherColPredicate: PredicateModel[] } = this.getPredicateRange(
            fullRange, this.filterCollection.get(sheetIdx), colIndex - 1) as { address: string, filteredCol: boolean,
                otherColPredicate: PredicateModel[] };
        const otherColPredicate: PredicateModel[] = totalRange.otherColPredicate;
        const addr: string = `${sheet.name}!${totalRange.address}`;
        const fullAddr: string = getRangeAddress(fullRange);
        const col: { type: string, isDateAvail: boolean } = this.getColumnType(sheet, colIndex - 1, range);
        const type: string = col.type;
        let dateColData: { [key: string]: Object }[];
        const isDateCol: boolean = type.includes('date') || col.isDateAvail;
        if (isDateCol && !totalRange.filteredCol) {
            dateColData = [];
        }
        getData(this.parent, addr, true, true, null, true, null, null, false, fullAddr, null, dateColData).then((jsonData:
            { [key: string]: CellModel }[]) => {
            let checkBoxData: DataManager;
            this.parent.element.style.position = 'relative';
            this.parent.element.classList.add('e-filter-open');
            if (isDateCol) {
                if (dateColData || !otherColPredicate.length) {
                    checkBoxData = new DataManager(dateColData || jsonData);
                } else {
                    const data: Object[] = new DataManager(jsonData).executeLocal(new Query().where(Predicate.and(this.getPredicates(otherColPredicate))));
                    checkBoxData = new DataManager(data);
                }
                const beforeCboxRender: Function = (args: FilterCheckboxArgs): void => {
                    this.parent.off(beforeCheckboxRender, beforeCboxRender);
                    args.isCheckboxFilterTemplate = true;
                    this.initTreeView(args, excelFilter);
                };
                this.parent.on(beforeCheckboxRender, beforeCboxRender, this);
            } else {
                //to avoid undefined array data
                jsonData.some((value: { [key: string]: CellModel }, index: number) => {
                    if (value) { checkBoxData = new DataManager(jsonData.slice(index)); }
                    return !!value;
                });
            }
            const target: HTMLElement = cell.querySelector('.e-filter-btn');
            const options: IFilterArgs = {
                type: type, field: field, format: (type === 'date' ? this.getDateFormatFromColumn(sheet, colIndex, range) : null), displayName: displayName || 'Column ' + field,
                dataSource: checkBoxData, height: this.parent.element.classList.contains('e-bigger') ? 800 : 500, columns: [],
                hideSearchbox: false, filteredColumns: this.filterCollection.get(sheetIdx), column: { 'field': field, 'filter': {} },
                handler: this.filterSuccessHandler.bind(this, new DataManager(jsonData)), target: target,
                position: { X: 0, Y: 0 }, localeObj: this.parent.serviceLocator.getService(locale)
            };
            const excelFilter: ExcelFilterBase = new ExcelFilterBase(this.parent, this.getLocalizedCustomOperators());
            excelFilter.openDialog(options);
            const filterPopup: HTMLElement = document.querySelector('.e-filter-popup');
            if (filterPopup && filterPopup.id.includes(this.parent.element.id)) {
                EventHandler.add(filterPopup, getStartEvent(), this.filterMouseDownHandler, this);
                const parentOff: DOMRect = this.parent.element.getBoundingClientRect() as DOMRect;
                const cellOff: DOMRect = target.getBoundingClientRect() as DOMRect;
                const popupOff: DOMRect = filterPopup.getBoundingClientRect() as DOMRect;
                let left: number = (cellOff.right - parentOff.left) - popupOff.width;
                if (left < 0) { // Left collision wrt spreadsheet left
                    left = cellOff.left - parentOff.left;
                }
                filterPopup.style.left = `${left}px`;
                filterPopup.style.top = '0px';
                filterPopup.style.visibility = 'hidden';
                if (filterPopup.classList.contains('e-hide')) {
                    filterPopup.classList.remove('e-hide');
                }
                let top: number = cellOff.bottom - parentOff.top;
                if (popupOff.height - (parentOff.bottom - cellOff.bottom) > 0) { // Bottom collision wrt spreadsheet bottom
                    top -= popupOff.height - (parentOff.bottom - cellOff.bottom);
                    if (top < 0) {
                        top = 0;
                    }
                }
                filterPopup.style.top = `${top}px`;
                filterPopup.style.visibility = '';
            }
            this.parent.hideSpinner();
        });
    }

    private getPredicateRange(
        range: number[], predicates: PredicateModel[], col?: number):
        string | { address: string, filteredCol: boolean, otherColPredicate: PredicateModel[] } {
        let addr: string = getRangeAddress(range);
        let filteredCol: boolean;
        const otherColPredicate: PredicateModel[] = [];
        if (predicates && predicates.length) {
            let predicateRange: string; let colIdx: number;
            predicates.forEach((predicate: PredicateModel): void => {
                if (predicate.field) {
                    predicateRange = `${predicate.field}${range[0] + 1}:${predicate.field}${range[2] + 1}`;
                    colIdx = getColIndex(predicate.field);
                    if (!addr.includes(predicateRange)) {
                        addr += `,${predicateRange}`;
                        if (colIdx < range[1]) { range[1] = colIdx; }
                        if (colIdx > range[3]) { range[3] = colIdx; }
                    }
                    if (col !== undefined) {
                        if (colIdx === col) {
                            filteredCol = true;
                        } else {
                            otherColPredicate.push(predicate);
                        }
                    }
                }
            });
        } else {
            filteredCol = true;
        }
        return col === undefined ? addr : { address: addr, filteredCol: filteredCol, otherColPredicate: otherColPredicate };
    }

    private filterDialogCreatedHandler(): void {
        const filterPopup: HTMLElement = document.querySelector('.e-filter-popup');
        if (filterPopup && filterPopup.id.includes(this.parent.element.id) && filterPopup.classList.contains('e-popup-close')) {
            filterPopup.classList.add('e-hide');
        }
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
        const l10n: L10n = this.parent.serviceLocator.getService(locale); 
        const sortOrder: SortOrder = target.classList.contains('e-filter-sortasc') ? 'Ascending'
            : target.classList.contains('e-filter-sortdesc') ? 'Descending' : null;
        if(sortOrder === "Ascending"){
            target.setAttribute('aria-label', l10n.getConstant('SortAscending'));
        }
        else{
            target.setAttribute('aria-label', l10n.getConstant('SortDescending'));
        }
        if (!sortOrder) { return; }
        const sheet: SheetModel = this.parent.getActiveSheet();
        const sheetIdx: number = this.parent.activeSheetIndex;
        const filterRange: { useFilterRange: boolean, range: number[] } = this.filterRange.get(sheetIdx);
        const range: number[] = filterRange.range.slice();
        range[0] = range[0] + 1; // to skip first row.
        if (!filterRange.useFilterRange) {
            range[2] = sheet.usedRange.rowIndex; //filter range should be till used range.
        }
        this.parent.sortCollection = this.parent.sortCollection ? this.parent.sortCollection : [];
        let prevSort: SortCollectionModel;
        for (let i: number = 0; i < this.parent.sortCollection.length; i++) {
            if (this.parent.sortCollection[i] && this.parent.sortCollection[i].sheetIndex === sheetIdx) {
                prevSort = this.parent.sortCollection[i];
                this.parent.sortCollection.splice(i, 1);
            }
        }
        this.parent.sortCollection.push(
            { sortRange: getRangeAddress(range), columnIndex: getIndexesFromAddress(sheet.activeCell)[1], order: sortOrder,
                sheetIndex: sheetIdx });
        if (!prevSort) { prevSort = { order: '' }; }
        this.parent.notify(
            applySort, { sortOptions: { sortDescriptors: { order: sortOrder }, containsHeader: false }, previousSort: prevSort, range:
            getRangeAddress(range) });
        this.refreshFilterRange();
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
     * @param {boolean} args.isUndoRedo - Specify the bool.
     * @param {boolean} args.isInternal - Specify the isInternal.
     * @param {boolean} args.isFilterByValue - Specify the isFilterByValue.
     * @param {PredicateModel[]} args.prevPredicates - Specify the prevPredicates.
     * @returns {void} - Triggers when OK button or clear filter item is selected
     */
    private filterSuccessHandler(
        dataSource: DataManager, args: { action: string, filterCollection?: PredicateModel[], field: string, sIdx?: number,
            isInternal?: boolean, isFilterByValue?: boolean, prevPredicates?: PredicateModel[] }): void {
        let sheetIdx: number = args.sIdx;
        if (!sheetIdx && sheetIdx !== 0) { sheetIdx = this.parent.activeSheetIndex; }
        let prevPredicates: PredicateModel[] = args.prevPredicates || [].slice.call(this.filterCollection.get(sheetIdx));
        if (args.isFilterByValue && !prevPredicates.length) { prevPredicates = undefined; }
        let predicates: PredicateModel[] = this.filterCollection.get(sheetIdx);
        this.updatePredicate(predicates, args.field);
        if (args.action === 'clear-filter' && predicates.length === prevPredicates.length) {
            return;
        }
        if (args.action === 'filtering') {
            predicates = predicates.concat(args.filterCollection);
            if (predicates.length) {
                for (let i: number = 0; i < predicates.length; i++) {
                    args.field = predicates[i].field;
                }
            }
        }
        this.filterCollection.set(sheetIdx, predicates);
        const filterOptions: FilterOptions = {
            datasource: dataSource,
            predicates: this.getPredicates(this.filterCollection.get(sheetIdx))
        };
        const filterRange: { useFilterRange: boolean, range: number[] } = this.filterRange.get(sheetIdx);
        if (!filterRange.useFilterRange) {
            filterRange.range[2] = getSheet(this.parent as Workbook, sheetIdx).usedRange.rowIndex; //extend the range if filtered
        }
        this.applyFilter(
            filterOptions, getRangeAddress(filterRange.range), sheetIdx, prevPredicates, false, args.isInternal);
    }

    private updatePredicate(predicates: PredicateModel[], field: string): void {
        const dataManager: DataManager = new DataManager(predicates as JSON[]);
        const query: Query = new Query();
        const fields: { field: string }[] = dataManager.executeLocal(query.where('field', 'equal', field)) as { field: string }[];
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
    }

    /**
     * Triggers events for filtering and applies filter.
     *
     * @param {FilterOptions} filterOptions - Specify the filteroptions.
     * @param {string} range - Specify the range.
     * @param {number} sheetIdx - Specify the sheet index.
     * @param {PredicateModel[]} prevPredicates - Specify the predicates.
     * @param {boolean} isUndoRedo - Specify the undo redo.
     * @param {boolean} refresh - Spefify the refresh.
     * @param {boolean} isInternal - Specify the isInternal.
     * @returns {void} - Triggers events for filtering and applies filter.
     */
    private applyFilter(
        filterOptions: FilterOptions, range: string, sheetIdx: number, prevPredicates?: PredicateModel[], refresh?: boolean,
        isInternal?: boolean): void {
        const eventArgs: { range: string, predicates: PredicateModel[], previousPredicates: PredicateModel[], sheetIndex: number, cancel: boolean } = { range:
            range, predicates: [].slice.call(this.filterCollection.get(sheetIdx)), previousPredicates: prevPredicates, sheetIndex: sheetIdx, cancel: false };
        if (!isInternal) {
            this.parent.notify(beginAction, { action: 'filter', eventArgs: eventArgs });
            if (eventArgs.cancel) {
                return;
            }
        }
        if (range.indexOf('!') < 0) {
            range = this.parent.sheets[sheetIdx].name + '!' + range;
        }
        this.parent.showSpinner();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const promise: Promise<FilterEventArgs> = new Promise((resolve: Function, reject: Function) => { resolve((() => { /** */ })()); });
        const filterArgs: { [key: string]: BeforeFilterEventArgs | Promise<FilterEventArgs> | boolean } = { args: { range: range,
            filterOptions: filterOptions }, promise: promise, refresh: refresh };
        this.parent.notify(initiateFilter, filterArgs);
        (filterArgs.promise as Promise<FilterEventArgs>).then((args: FilterEventArgs) => {
            this.refreshFilterRange();
            this.parent.notify(getFilteredCollection, null);
            this.parent.hideSpinner();
            if (!isInternal) {
                delete eventArgs.cancel;
                this.parent.notify(completeAction, { action: 'filter', eventArgs: eventArgs });
            }
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
    private getPredicates(predicateModel: PredicateModel[]): Predicate[] {
        const predicateList: Predicate[] = [];
        const excelPredicate: Predicate = CheckBoxFilterBase.getPredicate(predicateModel);
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
    private getColumnType(sheet: SheetModel, colIndex: number, range: number[]): { type: string, isDateAvail: boolean } {
        let num: number = 0; let str: number = 0; let date: number = 0; const time: number = 0;
        for (let i: number = range[0]; i <= range[2]; i++) {
            const cell: CellModel = getCell(i, colIndex, sheet);
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
                        if (isCustomDateTime(cell)) {
                            date++;
                        } else if (isNumber(cell.value)) {
                            num++;
                        } else {
                            str++;
                        }
                        break;
                    }
                } else {
                    if (typeof cell.value === 'string' || cell.value === undefined || cell.value === null) {
                        str++;
                    } else { num++; }
                }
            } else {
                str++;
            }
        }
        return { type: (num > str && num > date && num > time) ? 'number' : (str >= num && str >= date && str >= time) ? 'string'
            : (date > num && date > str && date > time) ? 'date' : 'datetime', isDateAvail: !!date };
    }

    private getDateFormatFromColumn(sheet: SheetModel, colIndex: number, range: number[]): string {
        let format: string;
        for (let i: number = range[0]; i <= range[2]; i++) {
            const cell: CellModel = getCell(i, colIndex - 1, sheet);
            if (cell && cell.format) {
                format = cell.format;
                break;
            }
        }
        return format;
    }

    /**
     * Clear filter from the field.
     *
     * @param {any} args - Specifies the args
     * @param {{ field: string }} args.field - Specify the args
     * @param {boolean} args.isAction - Specify the isAction.
     * @param {boolean} args.preventRefresh - Specify the preventRefresh.
     * @returns {void} - Clear filter from the field.
     */
    private clearFilterHandler(args?: { field?: string, isAction?: boolean, preventRefresh?: boolean, sheetIndex?: number }): void {
        const sheetIndex: number = args && args.sheetIndex !== undefined ? args.sheetIndex : this.parent.activeSheetIndex;
        if (args && args.field) {
            let predicates: PredicateModel[] = [].slice.call(this.filterCollection.get(sheetIndex));
            if (predicates && predicates.length) {
                this.updatePredicate(predicates, args.field);
                this.initiateFilterUIHandler(
                    { predicates: predicates, range: getRangeAddress(this.filterRange.get(sheetIndex).range), sIdx: sheetIndex });
            }
        } else {
            const isAction: boolean = args && args.isAction;
            const filterArgs: { [key: string]: boolean | number } = { isFiltered: false, isClearAll: true, sheetIndex: sheetIndex };
            this.getFilteredColumnHandler(filterArgs);
            if (filterArgs.isFiltered || (args && args.preventRefresh)) {
                let eventArgs: { range: string, predicates: PredicateModel[], previousPredicates: PredicateModel[], sheetIndex: number, cancel: boolean };
                const sheet: SheetModel = getSheet(this.parent, sheetIndex);
                const filterRange: { useFilterRange: boolean, range: number[] } = this.filterRange.get(sheetIndex);
                const range: number[] = filterRange.range;
                if (isAction) {
                    eventArgs = { range: getRangeAddress(range), predicates: [], previousPredicates:
                        this.filterCollection.get(sheetIndex), sheetIndex: sheetIndex, cancel: false };
                    this.parent.notify(beginAction, { action: 'filter', eventArgs: eventArgs });
                    if (eventArgs.cancel) {
                        return;
                    }
                }
                this.filterCollection.set(sheetIndex, []);
                const filterColl: FilterCollectionModel[] = this.parent.filterCollection;
                for (let i: number = 0, len: number = filterColl && filterColl.length; i < len; i++) {
                    if (filterColl[i].sheetIndex === sheetIndex) {
                        filterColl.splice(i, 1);
                        break;
                    }
                }
                const len: number = filterRange.useFilterRange ? range[2] : sheet.usedRange.rowIndex;
                if (this.parent.scrollSettings.enableVirtualization && ((len - range[0]) + 1 > (this.parent.viewport.rowCount +
                    (this.parent.getThreshold('row') * 2)))) {
                    for (let i: number = 0; i <= len; i++) {
                        setRow(sheet, i, <ExtendedRowModel>{ hidden: false, isFiltered: false });
                    }
                    if (!args || !args.preventRefresh) {
                        this.parent.renderModule.refreshSheet(false, false, true);
                    }
                } else {
                    this.refreshFilterRange(null, null, sheetIndex);
                    const evtArgs: { [key: string]: number | boolean } = { startIndex: range[0], hide: false, isFiltering: true, refreshUI:
                        false, endIndex: filterRange.useFilterRange ? range[2] : sheet.usedRange.rowIndex, sheetIndex: sheetIndex };
                    this.parent.notify(hideShow, evtArgs);
                    if (evtArgs.refreshUI && (!args || !args.preventRefresh)) {
                        this.parent.renderModule.refreshSheet(false, false, true);
                    }
                }
                if (isAction) {
                    delete eventArgs.cancel;
                    this.parent.notify(completeAction, { action: 'filter', eventArgs: eventArgs });
                }
            }
        }
    }

    /**
     * Reapplies the filter.
     *
     * @param {boolean} isInternal - Specifies the isInternal.
     * @param {boolean} refresh - Specifies the refresh.
     * @returns {void} - Reapplies the filter.
     */
    private reapplyFilterHandler(isInternal?: boolean, refresh?: boolean): void {
        const sheetIdx: number = this.parent.activeSheetIndex;
        if (this.filterRange.has(sheetIdx)) {
            const predicates: PredicateModel[] = this.filterCollection.get(sheetIdx);
            if (predicates && predicates.length) {
                const sheet: SheetModel = getSheet(this.parent, sheetIdx);
                const filterRange: { useFilterRange: boolean, range: number[] } = this.filterRange.get(this.parent.activeSheetIndex);
                const range: number[] = filterRange.range.slice();
                range[0] = range[0] + 1;
                if (!filterRange.useFilterRange) {
                    range[2] = sheet.usedRange.rowIndex;
                }
                range[1] = range[3] = getColIndex(predicates[0].field);
                const addr: string = `${sheet.name}!${this.getPredicateRange(range, predicates.slice(1, predicates.length))}`;
                getData(
                    this.parent, addr, true, true, null, true, null, null, false, getRangeAddress(range)).then(
                    (jsonData: { [key: string]: CellModel }[]) => {
                        const predicate: Predicate[] = this.getPredicates(this.filterCollection.get(sheetIdx));
                        this.applyFilter(
                            { predicates: predicate, datasource: new DataManager(jsonData) },
                            getRangeAddress(filterRange.range), sheetIdx, [].slice.call(predicates), refresh, isInternal);
                    });
            }
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
            args.filterRange = this.filterRange.get(sheetIdx).range;
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
                        value.push(isNullOrUndefined(predicate[i].value) ? '' : predicate[i].value);
                        type.push(predicate[i].type);
                        predi.push(predicate[i].predicate);
                    }
                }
                const address: string  = getRangeAddress(args.filterRange);
                fil = {
                    sheetIndex: args.sheetIdx, filterRange: address, hasFilter: args.hasFilter, column: colCollection,
                    criteria: condition, value: value, dataType: type, predicates: predi
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
                const filterCol: FilterCollectionModel = this.parent.filterCollection[i];
                let sIdx: number = filterCol.sheetIndex;
                if (i === 0 && !this.parent.isOpen && !args.isOpen) {
                    sIdx = 0;
                }
                const predicates: PredicateModel[] = [];
                if (filterCol.column) {
                    for (let j: number = 0; j < filterCol.column.length; j++) {
                        const predicateCol: PredicateModel = {
                            field: getCellAddress(0, filterCol.column[j]).charAt(0),
                            operator: this.getFilterOperator(filterCol.criteria[j]), value: typeof filterCol.value[j] === 'string' ?
                            (<string>filterCol.value[j]).split('*').join('') : filterCol.value[j],
                            predicate: filterCol.predicates && filterCol.predicates[j],
                            type: filterCol.dataType && filterCol.dataType[j]
                        };
                        predicates.push(predicateCol);
                    }
                }
                for (let i: number = 0; i < predicates.length - 1; i++) {
                    if (predicates[i].field === predicates[i + 1].field) {
                        if (!predicates[i].predicate) {
                            predicates[i].predicate = 'or';
                        }
                        if (!predicates[i + 1].predicate) {
                            predicates[i + 1].predicate = 'or';
                        }
                    }
                }
                this.parent.notify(initiateFilterUI, { predicates: predicates.length ? predicates : undefined, range:
                    filterCol.filterRange, sIdx: sIdx, isInternal: true });
            }
            if (this.parent.sortCollection) {
                this.parent.notify(sortImport, null);
            }
        }
    }

    private getFilterOperator(value: string): string {
        switch (value) {
        case 'BeginsWith':
            value = 'startswith';
            break;
        case 'Less':
            value = 'lessthan';
            break;
        case 'EndsWith':
            value = 'endswith';
            break;
        case 'Equal':
            value = 'equal';
            break;
        case 'Notequal':
            value = 'notEqual';
            break;
        case 'Greater':
            value = 'greaterthan';
            break;
        case 'Contains':
            value = 'contains';
            break;
        case 'LessOrEqual':
            value = 'lessthanorequal';
            break;
        case 'GreaterOrEqual':
            value = 'greaterthanorequal';
            break;
        }
        return value;
    }

    private beforeInsertHandler(args: { index: number, model: ColumnModel[], activeSheetIndex: number, modelType: string }): void {
        if (args.modelType === 'Column') {
            const sheetIdx: number = isUndefined(args.activeSheetIndex) ? this.parent.activeSheetIndex : args.activeSheetIndex;
            if (this.filterRange.size && this.filterRange.has(sheetIdx)) {
                const range: number[] = this.filterRange.get(sheetIdx).range;
                if (this.isFilterCell(sheetIdx, range[0], args.index) || args.index < range[1]) {
                    range[3] += args.model.length;
                    if (args.index <= range[1]) {
                        range[1] += args.model.length;
                    }
                    this.filterCollection.get(sheetIdx).forEach((predicate: PredicateModel) => {
                        const colIdx: number = getColIndex(predicate.field);
                        if (args.index <= colIdx) {
                            predicate.field = getColumnHeaderText(colIdx + args.model.length + 1);
                        }
                    });
                    if (this.parent.sortCollection) {
                        this.parent.sortCollection.forEach((sortCollection: SortCollectionModel) => {
                            if (sortCollection.sheetIndex === sheetIdx && args.index <= sortCollection.columnIndex) {
                                sortCollection.columnIndex += args.model.length;
                            }
                        });
                    }
                    this.getFilteredCollection();
                }
            }
        } else if (args.modelType === 'Sheet') {
            let isChanged: boolean = false;
            for (const key of Array.from(this.filterRange.keys()).sort().reverse()) {
                if (args.index <= key) {
                    isChanged = true;
                    this.filterRange.set(key + args.model.length, this.filterRange.get(key));
                    this.filterRange.delete(key);
                    this.filterCollection.set(key + args.model.length, this.filterCollection.get(key));
                    this.filterCollection.delete(key);
                }
            }
            if (this.parent.sortCollection) {
                this.parent.sortCollection.forEach((sortCollection: SortCollectionModel) => {
                    if (args.index <= sortCollection.sheetIndex) {
                        sortCollection.sheetIndex += args.model.length;
                    }
                });
            }
            if (isChanged) {
                this.getFilteredCollection();
            }
        }
    }

    private beforeDeleteHandler(args: { start: number, end: number, modelType: string, refreshSheet?: boolean }): void {
        if (args.modelType === 'Column') {
            const sheetIdx: number = this.parent.activeSheetIndex;
            if (this.filterRange.size && this.filterRange.has(sheetIdx)) {
                let isChanged: boolean = true;
                const range: number[] = this.filterRange.get(sheetIdx).range;
                if (args.start >= range[1] && args.end <= range[3]) { // in between
                    range[3] -= args.end - args.start + 1;
                }
                else if (args.start < range[1] && args.end < range[1]) { // before
                    range[1] -= args.end - args.start + 1;
                    range[3] -= args.end - args.start + 1;
                } else if (args.start < range[1] && args.end > range[1] && args.end < range[3]) { // from before to inbetween
                    range[1] = args.start;
                    range[3] -= args.end - args.start + 1;
                } else {
                    isChanged = false;
                }
                if (isChanged) {
                    const filterCollection: PredicateModel[] = this.filterCollection.get(sheetIdx);
                    let isPredicateRemoved: boolean;
                    for (let i: number = filterCollection.length - 1; i >= 0; i--) {
                        const colIdx: number = getColIndex(filterCollection[i].field);
                        if (args.end < colIdx) {
                            filterCollection[i].field = getColumnHeaderText(colIdx - (args.end - args.start + 1) + 1);
                        }
                        else if (args.start <= colIdx && args.end >= colIdx) {
                            isPredicateRemoved = true;
                            filterCollection.splice(i, 1);
                        }
                    }
                    const sortColl: SortCollectionModel[] = this.parent.sortCollection;
                    if (sortColl) {
                        for (let i: number = 0; i < sortColl.length; i++) {
                            if (sortColl[i].sheetIndex === sheetIdx) {
                                if (args.end < sortColl[i].columnIndex) {
                                    sortColl[i].columnIndex = sortColl[i].columnIndex - (args.end - args.start + 1);
                                    break;
                                }
                                else if (args.start <= sortColl[i].columnIndex && args.end >= sortColl[i].columnIndex) {
                                    sortColl.splice(i, 1);
                                    break;
                                }
                            }
                        }
                    }
                    if (range.some((value: number) => value < 0)) {
                        this.removeFilter(sheetIdx, true, true);
                        args.refreshSheet = true;
                    } else if (isPredicateRemoved) {
                        if (filterCollection && filterCollection.length) {
                            this.reapplyFilterHandler(true, true);
                            args.refreshSheet = false;
                        } else {
                            this.clearFilterHandler({ preventRefresh: true });
                            args.refreshSheet = true;
                        }
                    }
                    this.getFilteredCollection();
                }
            }
        }
    }

    private deleteSheetHandler(args: { sheetIndex: number }): void {
        if (!isUndefined(args.sheetIndex)) {
            let isChanged: boolean;
            for (const key of Array.from(this.filterRange.keys()).sort().reverse()) {
                isChanged = true;
                if (args.sheetIndex === key) {
                    this.filterRange.delete(key);
                    this.filterCollection.delete(key);
                } else if (args.sheetIndex < key) {
                    this.filterRange.set(key - 1, this.filterRange.get(key));
                    this.filterRange.delete(key);
                    this.filterCollection.set(key - 1, this.filterCollection.get(key));
                    this.filterCollection.delete(key);
                } else {
                    isChanged = false;
                }
            }
            const sortColl: SortCollectionModel[] = this.parent.sortCollection;
            if (sortColl) {
                for (let i: number = sortColl.length - 1; i >= 0; i--) {
                    if (args.sheetIndex === sortColl[i].sheetIndex) {
                        sortColl.splice(i, 1);
                    } else if (args.sheetIndex < sortColl[i].sheetIndex) {
                        sortColl[i].sheetIndex -= 1;
                    }
                }
            }
            if (isChanged) {
                this.getFilteredCollection();
            }
        } else if (this.filterRange.get(this.parent.activeSheetIndex)) {
            this.filterRange.delete(this.parent.activeSheetIndex);
            this.filterCollection.delete(this.parent.activeSheetIndex);
        }
    }

    private clearHandler(args: ClearOptions): void {
        const info: { sheetIndex: number, indices: number[] } = this.parent.getAddressInfo(args.range);
        if (this.filterRange.has(info.sheetIndex)) {
            const indexes: number[] = this.filterRange.get(info.sheetIndex).range.slice();
            if (inRange(info.indices, indexes[0], indexes[1]) && inRange(info.indices, indexes[0], indexes[3])) {
                this.removeFilter(info.sheetIndex);
            }
        }
    }

    private duplicateSheetFilterHandler(args: duplicateSheetOption): void {
        if (this.filterCollection.has(args.sheetIndex)) {
            this.filterCollection.set(args.newSheetIndex, this.filterCollection.get(args.sheetIndex));
        }
        if (this.filterRange.has(args.sheetIndex)) {
            this.filterRange.set(args.newSheetIndex, this.filterRange.get(args.sheetIndex));
        }
    }
}
