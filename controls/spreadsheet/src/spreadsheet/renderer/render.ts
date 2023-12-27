import { ribbon, formulaBar, IRenderer, beforeVirtualContentLoaded, setAriaOptions, JsonData } from '../common/index';
import { SheetRender, RowRenderer, CellRenderer } from './index';
import { Spreadsheet } from '../base/index';
import { extend, remove } from '@syncfusion/ej2-base';
import { CellModel, SheetModel, getSheetName, getRowsHeight, getColumnsWidth, getData, Workbook } from '../../workbook/index';
import { getCellAddress, getCellIndexes, workbookFormulaOperation, moveOrDuplicateSheet, skipHiddenIdx } from '../../workbook/index';
import { RefreshArgs, sheetTabs, onContentScroll, deInitProperties, beforeDataBound, updateTranslate, OpenArgs } from '../common/index';
import { spreadsheetDestroyed, isFormulaBarEdit, editOperation, FormulaBarEdit } from '../common/index';
import { getSiblingsHeight, refreshSheetTabs, ScrollEventArgs, focus, getUpdatedScrollPosition } from '../common/index';

/**
 * Render module is used to render the spreadsheet
 *
 * @hidden
 */
export class Render {
    private parent: Spreadsheet;
    private colMinWidth: number;
    constructor(parent: Spreadsheet) {
        this.parent = parent;
        this.addEventListener();
        this.instantiateRenderer();
    }

    public render(): void {
        this.parent.setProperties({ activeSheetIndex: this.parent.skipHiddenSheets(this.parent.activeSheetIndex) }, true);
        if (!this.parent.isMobileView()) {
            this.parent.notify(ribbon, null);
            this.parent.notify(formulaBar, null);
        }
        const sheetPanel: HTMLElement = this.parent.createElement('div', {
            id: this.parent.element.id + '_sheet_panel', className: 'e-sheet-panel'
        });
        if (this.parent.enableRtl) { sheetPanel.classList.add('e-rtl'); }
        this.parent.element.appendChild(sheetPanel);
        if (this.parent.showSheetTabs) {
            this.parent.notify(sheetTabs, null);
        } else { // for formula calculation
            this.parent.notify(workbookFormulaOperation, { action: 'initSheetInfo' });
            this.parent.notify(workbookFormulaOperation, { action: 'initiateDefinedNames' });
        }
        if (this.parent.isMobileView()) {
            this.parent.notify(formulaBar, null);
            this.parent.notify(ribbon, null);
        }
        if (this.parent.password.length > 0 || this.parent.isProtected) {
            this.parent.isProtected = true;
            if (this.parent.showSheetTabs) {
                this.parent.element.querySelector('.e-add-sheet-tab').setAttribute('disabled', 'true');
                this.parent.element.querySelector('.e-add-sheet-tab').classList.add('e-disabled');
            }
        }
        if (this.parent.selectionSettings.mode === 'None') {
            this.parent.allowAutoFill = false;
        }
        this.setSheetPanelSize();
        this.renderSheet(sheetPanel);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.checkTopLeftCell(!(this.parent as any).refreshing);
    }

    private checkTopLeftCell(
        initLoad?: boolean, isRefreshing?: boolean, scrollTop?: number, scrollLeft?: number, preventModelCheck?: boolean,
        openOptions?: JsonData): void {
        const sheet: SheetModel = this.parent.getActiveSheet();
        this.parent.showSpinner();
        let isTopLeftCell: boolean = sheet.topLeftCell === 'A1';
        const indexes: number[] = getCellIndexes(sheet.topLeftCell); let isFreezeScrolled: boolean;
        if (sheet.topLeftCell !== sheet.paneTopLeftCell && (sheet.frozenRows || sheet.frozenColumns)) {
            const paneIndexes: number[] = getCellIndexes(sheet.paneTopLeftCell);
            isFreezeScrolled = this.parent.scrollSettings.enableVirtualization;
            isTopLeftCell = sheet.frozenRows && sheet.frozenColumns ? indexes[0] + sheet.frozenRows === paneIndexes[0] &&
                indexes[1] + sheet.frozenColumns === paneIndexes[1] : (sheet.frozenRows ? indexes[0] + sheet.frozenRows === paneIndexes[0]
                && indexes[1] === 0 : indexes[1] + sheet.frozenColumns === paneIndexes[1] && indexes[0] === 0);
            if (indexes[0] && paneIndexes[0] > indexes[0]) {
                this.parent.viewport.beforeFreezeHeight = getRowsHeight(sheet, 0, indexes[0] - 1, true);
            } else {
                this.parent.viewport.beforeFreezeHeight = 0;
            }
            if (indexes[1] && paneIndexes[1] > indexes[1]) {
                this.parent.viewport.beforeFreezeWidth = getColumnsWidth(sheet, 0, indexes[1] - 1, true);
            } else {
                this.parent.viewport.beforeFreezeWidth = 0;
            }
        } else {
            this.parent.viewport.beforeFreezeHeight = this.parent.viewport.beforeFreezeWidth = 0;
        }
        const frozenRow: number = this.parent.frozenRowCount(sheet);
        const frozenCol: number = this.parent.frozenColCount(sheet);
        if (!this.parent.scrollSettings.enableVirtualization || isTopLeftCell) {
            this.refreshUI(
                { rowIndex: indexes[0], colIndex: indexes[1], refresh: 'All' }, null, initLoad, isRefreshing, preventModelCheck,
                openOptions);
            if (isFreezeScrolled) {
                this.parent.viewport.topIndex = skipHiddenIdx(sheet, frozenRow, true) - frozenRow;
                this.parent.viewport.leftIndex = skipHiddenIdx(sheet, frozenCol, true, 'columns') - frozenCol;
            }
        } else {
            const pIndexes: number[] = sheet.paneTopLeftCell === sheet.topLeftCell ? indexes : getCellIndexes(sheet.paneTopLeftCell);
            const eventArgs: ScrollEventArgs = { preventScroll: true };
            eventArgs.scrollTop = scrollTop || (pIndexes[0] > frozenRow ? getRowsHeight(sheet, frozenRow, pIndexes[0] - 1, true) : 0);
            eventArgs.scrollLeft = scrollLeft || (pIndexes[1] > frozenCol ? getColumnsWidth(sheet, frozenCol, pIndexes[1] - 1, true) : 0);
            this.parent.notify(onContentScroll, eventArgs);
            let threshold: number = this.parent.getThreshold('row');
            const rowIndex: number = sheet.frozenRows ? indexes[0] : (indexes[0] > threshold ?
                skipHiddenIdx(sheet, indexes[0] - threshold, true) : 0);
            const frozenIndexes: number[] = [];
            if (sheet.frozenRows) {
                frozenIndexes.push(pIndexes[0] - threshold > frozenRow ? pIndexes[0] - threshold : frozenRow);
            }
            threshold = this.parent.getThreshold('col');
            const colIndex: number = sheet.frozenColumns ? indexes[1] :
                (indexes[1] > threshold ? skipHiddenIdx(sheet, indexes[1] - threshold, true, 'columns') : 0);
            if (sheet.frozenColumns) {
                if (!frozenIndexes.length) {
                    frozenIndexes.push(frozenRow);
                }
                frozenIndexes.push(pIndexes[1] - threshold > frozenCol ? pIndexes[1] - threshold : frozenCol);
            } else if (frozenIndexes.length) {
                frozenIndexes.push(frozenCol);
            }
            this.refreshUI(
                { rowIndex: rowIndex, colIndex: colIndex, refresh: 'All', top: eventArgs.scrollTop, left: eventArgs.scrollLeft,
                    frozenIndexes: frozenIndexes }, null, initLoad, isRefreshing, preventModelCheck, openOptions);
            if (isFreezeScrolled) {
                if (frozenRow && frozenIndexes[0] >= frozenRow) {
                    this.parent.viewport.topIndex = skipHiddenIdx(sheet, frozenIndexes[0], true) - frozenRow;
                }
                if (frozenCol && frozenIndexes[1] >= frozenCol) {
                    this.parent.viewport.leftIndex = skipHiddenIdx(sheet, frozenIndexes[1], true, 'columns') - frozenCol;
                }
            }
        }
    }

    private renderSheet(panel: HTMLElement = document.getElementById(this.parent.element.id + '_sheet_panel')): void {
        panel.appendChild(this.parent.createElement('div', { className: 'e-sheet', id: this.parent.element.id + '_sheet', styles:
            'background-color: #fff' }));
        (this.parent.serviceLocator.getService('sheet') as IRenderer).renderPanel();
    }

    /**
     * @hidden
     * @param {RefreshArgs} args - Specifies the RefreshArgs.
     * @param {string} address - Specifies the address.
     * @param {boolean} initLoad - Specifies the initLoad.
     * @param {boolean} isRefreshing - Specifies the isRefreshing.
     * @param {boolean} preventModelCheck - Specifies the preventModelCheck.
     * @param {boolean} openOptions - Specifies the open response options.
     * @returns {void}
     */
    // tslint:disable-next-line:max-func-body-length
    public refreshUI(
        args: RefreshArgs, address?: string, initLoad?: boolean, isRefreshing?: boolean, preventModelCheck?: boolean,
        openOptions?: JsonData): void {
        if (args.refresh !== 'All') { this.parent.showSpinner(); }
        const sheetModule: IRenderer = <IRenderer>this.parent.serviceLocator.getService('sheet');
        const sheet: SheetModel = this.parent.getActiveSheet(); const sheetName: string = getSheetName(this.parent as Workbook);
        const prevRowColCnt: SheetModel = { rowCount: sheet.rowCount, colCount: sheet.colCount };
        args.frozenIndexes = args.frozenIndexes ? args.frozenIndexes : [];
        if (!address) {
            if (this.parent.scrollSettings.enableVirtualization) {
                let lastRow: number = args.rowIndex + this.parent.viewport.rowCount + (this.parent.getThreshold('row') * 2);
                let lastCol: number = args.colIndex + this.parent.viewport.colCount + (this.parent.getThreshold('col') * 2);
                const frozenRow: number = this.parent.frozenRowCount(sheet); const frozenCol: number = this.parent.frozenColCount(sheet);
                if (args.frozenIndexes.length) {
                    lastRow += (args.frozenIndexes[0] - frozenRow);
                    lastCol += (args.frozenIndexes[1] - frozenCol);
                }
                if (args.refresh === 'Row') {
                    lastRow += frozenRow;
                } else {
                    lastRow += sheet.frozenRows;
                }
                if (args.refresh === 'Column') {
                    lastCol += frozenCol;
                } else {
                    lastCol += sheet.frozenColumns;
                }
                const rowIdx: number = args.frozenIndexes[0] > frozenRow ? args.frozenIndexes[0] : args.rowIndex + (args.refresh === 'Row' ?
                    frozenRow : sheet.frozenRows);
                let indexes: number[] = this.parent.skipHidden(rowIdx, lastRow, 'rows', false);
                lastRow = indexes[1];
                if (rowIdx !== indexes[0]) {
                    const topLeftCell: number[] = getCellIndexes(sheet.paneTopLeftCell);
                    if (topLeftCell[0] === rowIdx) {
                        this.parent.updateTopLeftCell(indexes[0] - frozenRow, topLeftCell[1], 'col');
                    }
                }
                indexes[0] -= frozenRow;
                let count: number = sheet.rowCount - 1;
                let diff: number = 0;
                let startRow: number = args.rowIndex;
                if (this.parent.scrollSettings.isFinite && lastRow > count) {
                    diff = lastRow - count;
                    lastRow = skipHiddenIdx(sheet, count, false);
                    if (indexes[0] + frozenRow > skipHiddenIdx(sheet, frozenRow, true)) {
                        let startIdx: number = args.rowIndex - diff;
                        startIdx = startIdx < 0 ? 0 : startIdx;
                        startIdx = this.decreaseHidden(startIdx, args.rowIndex - 1, frozenRow);
                        if (args.top && startIdx < args.rowIndex) {
                            this.parent.notify(
                                updateTranslate, { height: getRowsHeight(sheet, startIdx + frozenRow, args.rowIndex - 1 + frozenRow, true),
                                    isRender: true });
                        }
                        this.parent.viewport.topIndex = indexes[0] = startIdx;
                        startRow = args.refresh === 'Row' ? startIdx : startRow;
                    }
                }
                if (args.refresh === 'Row') {
                    args.rowIndex = skipHiddenIdx(sheet, startRow + frozenRow, true) - frozenRow;
                } else {
                    startRow = args.rowIndex = frozenRow ? skipHiddenIdx(sheet, startRow, true) : indexes[0];
                }
                const colIdx: number = args.frozenIndexes[1] > frozenCol ? args.frozenIndexes[1] : args.colIndex + (args.refresh ===
                    'Column' ? frozenCol : sheet.frozenColumns);
                indexes = this.parent.skipHidden(colIdx, lastCol, 'columns', false);
                lastCol = indexes[1];
                if (colIdx !== indexes[0]) {
                    const topLeftCell: number[] = getCellIndexes(sheet.paneTopLeftCell);
                    if (topLeftCell[1] === colIdx) {
                        this.parent.updateTopLeftCell(topLeftCell[0], indexes[0] - frozenCol, 'row');
                    }
                }
                indexes[0] -= frozenCol;
                count = sheet.colCount - 1;
                diff = 0;
                let startCol: number = args.colIndex;
                if (this.parent.scrollSettings.isFinite && lastCol > count) {
                    diff = lastCol - count;
                    lastCol = skipHiddenIdx(sheet, count, false, 'columns');
                    if (indexes[0] + frozenCol > skipHiddenIdx(sheet, frozenCol, true, 'columns')) {
                        let startIdx: number = args.colIndex - diff;
                        startIdx = startIdx > -1 ? startIdx : 0;
                        startIdx = this.decreaseHidden(startIdx, args.colIndex - 1, frozenCol, 'columns');
                        if (args.left && startIdx < args.colIndex) {
                            this.parent.notify(
                                updateTranslate, { width: getColumnsWidth(sheet, startIdx + frozenCol, args.colIndex - 1 + frozenCol, true),
                                    isRender: true });
                        }
                        this.parent.viewport.leftIndex = indexes[0] = startIdx;
                        startCol = args.refresh === 'Column' ? startIdx : startCol;
                    }
                }
                if (args.refresh === 'Column') {
                    args.colIndex = skipHiddenIdx(sheet, startCol + frozenCol, true, 'columns') - frozenCol;
                } else {
                    startCol = args.colIndex = frozenCol ? skipHiddenIdx(sheet, startCol, true, 'columns') : indexes[0];
                }
                if (args.refresh === 'Row') {
                    startRow += frozenRow;
                    if (frozenRow) {
                        lastRow += getCellIndexes(sheet.topLeftCell)[0];
                    }
                    lastCol = this.parent.viewport.rightIndex;
                }
                if (args.refresh === 'Column') {
                    startCol += frozenCol;
                    if (frozenCol) {
                        lastCol += getCellIndexes(sheet.topLeftCell)[1];
                    }
                    lastRow = this.parent.viewport.bottomIndex;
                }
                this.parent.viewport.topIndex = args.rowIndex; this.parent.viewport.bottomIndex = lastRow;
                this.parent.viewport.leftIndex = args.colIndex; this.parent.viewport.rightIndex = lastCol;
                address = `${getCellAddress(startRow, startCol)}:${getCellAddress(lastRow, lastCol)}`;
            } else {
                if (args.refresh === 'All') {
                    this.updateTopLeftScrollPosition(extend(args, { sheet: sheet }));
                }
                this.parent.viewport.bottomIndex = sheet.rowCount - 1; this.parent.viewport.rightIndex = sheet.colCount - 1;
                address = `${getCellAddress(args.rowIndex, args.colIndex)}:${getCellAddress(
                    this.parent.viewport.bottomIndex, this.parent.viewport.rightIndex)}`;
            }
        }
        if (args.refresh === 'All') {
            this.parent.trigger(beforeDataBound, {});
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const isOpen: boolean = this.parent.isOpen || (this.parent as any).refreshing;
        setAriaOptions(this.parent.getMainContent() as HTMLElement, { busy: true });
        const sheetsLen: number = this.parent.sheets.length;
        getData(this.parent as Workbook, `${sheetName}!${address}`, null, null, args.frozenIndexes).then((values: Map<string, CellModel>): void => {
            if (!this.parent || sheetsLen < this.parent.sheets.length) { return; }
            const sheetIdx: number = this.parent.sheets.indexOf(sheet);
            if ( !preventModelCheck && (sheetIdx === -1 || sheetIdx !== this.parent.activeSheetIndex)) {
                if (sheetIdx > -1) { this.checkTopLeftCell(); }
                return;
            }
            const indexes: number[] = [args.rowIndex, args.colIndex, ...getCellIndexes(address.split(':')[1])];
            let isEdit: boolean;
            let arg: FormulaBarEdit;
            switch (args.refresh) {
            case 'All':
                sheetModule.renderTable(
                    { cells: values, indexes: indexes, top: args.top, left: args.left, initLoad: initLoad, isRefreshing:
                        isRefreshing, isOpen: isOpen, openOptions: openOptions });
                break;
            case 'Row':
                sheetModule.refreshRowContent(
                    { cells: values, indexes: indexes, skipUpdateOnFirst: args.skipUpdateOnFirst, prevRowColCnt: prevRowColCnt });
                isEdit = false;
                arg = { isEdit: isEdit };
                this.parent.notify(isFormulaBarEdit, arg);
                if (arg.isEdit) {
                    this.parent.notify(editOperation, { action: 'startEdit', refreshCurPos: false });
                }
                break;
            case 'Column':
                sheetModule.refreshColumnContent({
                    cells: values, indexes: indexes, skipUpdateOnFirst: args.skipUpdateOnFirst,
                    prevRowColCnt: prevRowColCnt, insertDelete: args.insertDelete
                });
                break;
            case 'RowPart':
                sheetModule.updateRowContent({
                    cells: values, indexes: indexes, direction: args.direction, skipUpdateOnFirst: args.skipUpdateOnFirst,
                    prevRowColCnt: prevRowColCnt
                });
                break;
            case 'ColumnPart':
                sheetModule.updateColContent({
                    cells: values, indexes: indexes, direction: args.direction, skipUpdateOnFirst: args.skipUpdateOnFirst,
                    prevRowColCnt: prevRowColCnt
                });
                break;
            }
            if (this.parent && (this.parent as { isReact?: boolean }).isReact) {
                this.parent['renderReactTemplates']();
            }
        });
        this.parent.notify(beforeVirtualContentLoaded, { refresh: args.refresh, skipTranslate: args.skipTranslate });
    }

    private updateTopLeftScrollPosition(
        args: { top?: number, left?: number, rowIndex?: number, colIndex?: number, sheet?: SheetModel }): void {
        const topLeftCell: number[] = getCellIndexes(args.sheet.topLeftCell);
        const paneTopLeftCell: number[] = getCellIndexes(args.sheet.paneTopLeftCell);
        if (args.sheet.frozenRows) {
            const frozenRow: number = this.parent.frozenRowCount(args.sheet);
            if (paneTopLeftCell[0] > frozenRow) { args.top = getRowsHeight(args.sheet, frozenRow, paneTopLeftCell[0] - 1, true); }
        } else {
            args.rowIndex && (args.rowIndex = 0);
            if (topLeftCell[0] !== 0) { args.top = getRowsHeight(args.sheet, 0, topLeftCell[0] - 1, true); }
        }
        if (args.sheet.frozenColumns) {
            const frozenCol: number = this.parent.frozenColCount(args.sheet);
            if (paneTopLeftCell[1] > frozenCol) { args.left = getColumnsWidth(args.sheet, frozenCol, paneTopLeftCell[1] - 1, true); }
        } else {
            args.colIndex && (args.colIndex = 0);
            if (topLeftCell[1] !== 0) { args.left = getColumnsWidth(args.sheet, 0, topLeftCell[1] - 1, true); }
        }
    }

    private removeSheet(): void {
        remove(document.getElementById(this.parent.element.id + '_sheet'));
    }

    /**
     * Refresh the active sheet.
     *
     * @param {boolean} isOpen - Specifies the isOpen.
     * @param {boolean} resize - Set `true` to refresh the sheet with exiting scroll top and left.
     * @param {boolean} focusEle - Specify the focusEle.
     * @param {boolean} preventModelCheck - Specifies the preventModelCheck.
     * @param {boolean} openOptions - Specifies the open response options.
     * @returns {void}
     */
    public refreshSheet(isOpen?: boolean, resize?: boolean, focusEle?: boolean, preventModelCheck?: boolean, openOptions?: JsonData): void {
        let scrollTop: number = 0; let scrollLeft: number = 0;
        if (resize) {
            const mainPanel: Element = this.parent.element.getElementsByClassName('e-main-panel')[0];
            if (mainPanel) {
                scrollTop = mainPanel.scrollTop;
            }
            const sheetContent: Element = this.parent.getMainContent();
            if (sheetContent) {
                scrollLeft = sheetContent.scrollLeft;
            }
        }
        this.removeSheet();
        this.renderSheet();
        this.parent.notify(deInitProperties, {});
        this.checkTopLeftCell(false, isOpen, scrollTop, scrollLeft, preventModelCheck, openOptions);
        if (focusEle) {
            focus(this.parent.element);
        }
    }

    /**
     * Used to set sheet panel size.
     *
     * @returns {void}
     */
    public setSheetPanelSize(colMinWidth?: number): void {
        const panel: HTMLElement = document.getElementById(this.parent.element.id + '_sheet_panel');
        const offset: ClientRect = this.parent.element.getBoundingClientRect();
        let height: number;
        if (this.parent.height === 'auto') {
            panel.style.height = '260px';
            height = 230;
        } else {
            height = offset.height - getSiblingsHeight(panel);
            panel.style.height = `${height}px`;
            height -= 32;
        }
        if (colMinWidth !== undefined) {
            this.colMinWidth = colMinWidth;
        }
        this.parent.viewport.height = height;
        this.parent.viewport.width = offset.width - 32;
        this.parent.viewport.rowCount = this.roundValue(height, 20);
        this.parent.viewport.colCount = this.roundValue(offset.width, this.colMinWidth || 64);
    }

    private roundValue(size: number, threshold: number): number {
        const value: number = size / threshold; const roundedValue: number = Math.round(value);
        return Math.abs(value - roundedValue) < 0.5 ? roundedValue : roundedValue - 1;
    }

    private moveOrDuplicateSheetHandler(args: { refresh: boolean, isDuplicate: boolean }): void {
        this.parent.notify(refreshSheetTabs, null);
        if (args.refresh) {
            this.refreshSheet(args.isDuplicate);
        }
    }

    public decreaseHidden(startIdx: number, endIdx: number, freezeCount: number, layout: string = 'rows'): number {
        startIdx += freezeCount;
        endIdx += freezeCount;
        const sheet: SheetModel = this.parent.getActiveSheet();
        for (let i: number = endIdx; i >= startIdx; i--) {
            if ((sheet[`${layout}`])[i as number] && (sheet[`${layout}`])[i as number].hidden) {
                startIdx--;
                if (startIdx < freezeCount) { startIdx = skipHiddenIdx(sheet, freezeCount, true, layout); break; }
            }
        }
        return startIdx - freezeCount;
    }

    /**
     * Registing the renderer related services.
     *
     * @returns {void}
     */
    private instantiateRenderer(): void {
        this.parent.serviceLocator.register('cell', new CellRenderer(this.parent));
        this.parent.serviceLocator.register('row', new RowRenderer(this.parent));
        this.parent.serviceLocator.register('sheet', new SheetRender(this.parent));
    }

    /**
     * Destroy the Render module.
     *
     * @returns {void}
     */
    public destroy(): void {
        this.removeEventListener();
        this.parent.serviceLocator.getService<RowRenderer>('row').destroy();
        this.parent.serviceLocator.getService<CellRenderer>('cell').destroy();
        this.parent = null;
        this.colMinWidth = null;
    }

    private addEventListener(): void {
        this.parent.on(spreadsheetDestroyed, this.destroy, this);
        this.parent.on(moveOrDuplicateSheet, this.moveOrDuplicateSheetHandler, this);
        this.parent.on(getUpdatedScrollPosition, this.updateTopLeftScrollPosition, this);
    }

    private removeEventListener(): void {
        this.parent.off(spreadsheetDestroyed, this.destroy);
        this.parent.off(moveOrDuplicateSheet, this.moveOrDuplicateSheetHandler);
        this.parent.off(getUpdatedScrollPosition, this.updateTopLeftScrollPosition);
    }
}
