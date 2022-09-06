import { Spreadsheet } from '../base/index';
import { keyDown, cellNavigate, renameSheet, filterCellKeyDown, getUpdateUsingRaf, isLockedCells, focus, dialog } from '../common/index';
import { SheetModel, getCellIndexes, getRangeAddress, getRowHeight, getColumnWidth, CellModel, getCell, isHiddenCol, getRowsHeight, getColumnsWidth, getColumnHeaderText } from '../../workbook/index';
import { getRangeIndexes, getSwapRange, isHiddenRow, isColumnSelected, isRowSelected, skipHiddenIdx } from '../../workbook/index';
import { Dialog } from '../services/index';
import { closest, isNullOrUndefined, isUndefined } from '@syncfusion/ej2-base';

/**
 * Represents keyboard navigation support for Spreadsheet.
 */
export class KeyboardNavigation {
    private parent: Spreadsheet;

    /**
     * Constructor for the Spreadsheet Keyboard Navigation module.
     *
     * @private
     * @param {Spreadsheet} parent - Specify the spreadsheet
     */
    constructor(parent: Spreadsheet) {
        this.parent = parent;
        this.addEventListener();
        /* code snippet */
    }

    private addEventListener(): void {
        this.parent.on(keyDown, this.keyDownHandler, this);
        /* code snippet */
    }

    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(keyDown, this.keyDownHandler);
        }
        /* code snippet */
    }

    private keyDownHandler(e: KeyboardEvent): void {
        const target: Element = e.target as Element;
        if (this.parent.isEdit || this.parent.serviceLocator.getService<Dialog>(dialog).dialogInstance ||
            target.id === `${this.parent.element.id}_name_box` || target.id === `${this.parent.element.id}_SearchBox` || (target.classList.contains('e-ddl') &&
                target.classList.contains('e-input-focus'))) {
            return;
        }
        if (e.altKey && e.keyCode === 38 && this.parent.element.lastElementChild.classList.contains('e-filter-popup')) {
            this.parent.notify(filterCellKeyDown, { closePopup: true });
            return;
        }
        if (e.altKey && e.keyCode === 40 && (closest(target, '.e-dropdown-btn') || closest(target, '.e-split-btn'))) {
            return;
        }
        if (target.classList.contains('e-sheet-rename')) {
            if (e.keyCode === 32) {
                e.stopPropagation();
            } else if (e.keyCode === 13 || e.keyCode === 27) {
                this.parent.notify(renameSheet, e);
            }
            return;
        }
        else if (target.id === `${this.parent.element.id}_File`) {
            focus(this.parent.element);
        }
        if (this.parent.selectionSettings.mode === 'None') { return; }
        let isNavigate: boolean;
        let scrollIdxes: number[];
        let scrollToCell: boolean;
        const isRtl: boolean = this.parent.enableRtl;
        const sheet: SheetModel = this.parent.getActiveSheet();
        const selectIdx: number[] = getRangeIndexes(sheet.selectedRange);
        let actIdxes: number[] = getCellIndexes(sheet.activeCell);
        const mainPanel: Element = this.parent.element.querySelector('.e-main-panel');
        const hCont: Element = this.parent.getScrollElement();
        if ([9, 37, 38, 39, 40, 33, 34].indexOf(e.keyCode) > -1) {
            e.preventDefault();
        }
        if (e.keyCode === 36) {
            if ((e.ctrlKey || e.metaKey) && e.shiftKey) {   /*ctrl+shift+home*/
                e.preventDefault();
                this.parent.selectRange(getColumnHeaderText(actIdxes[1] + 1) + (actIdxes[0] + 1) + ':A1');
                if (mainPanel.scrollTop) {
                    mainPanel.scrollTop = 0;
                }
                if (hCont.scrollLeft) {
                    hCont.scrollLeft = 0;
                }
            }
            else if (actIdxes[1] >= 0) {
                if (e.ctrlKey) { /*ctrl+home*/
                    actIdxes[0] = 0;
                    actIdxes[1] = 0;
                }
                else { /*home*/
                    e.preventDefault();
                    actIdxes[1] = 0;
                }
                isNavigate = true;
            }
        }
        if ((e.ctrlKey || e.metaKey) && e.keyCode === 35) { /*ctrl + end*/
            e.preventDefault();
            actIdxes[0] = sheet.usedRange.rowIndex;
            actIdxes[1] = sheet.usedRange.colIndex;
            scrollToCell = isNavigate = true;
        }
        if (e.shiftKey && e.keyCode === 32) { /*shift + space*/
            e.preventDefault();
            selectIdx[1] = 0;
            this.parent.selectRange(getRangeAddress([selectIdx[0], selectIdx[1], selectIdx[2], (selectIdx[3] + sheet.colCount)]));
        }
        if ((e.ctrlKey || e.metaKey) && e.keyCode === 32) { /*ctrl+ space*/
            selectIdx[0] = 0;
            this.parent.selectRange(getRangeAddress([selectIdx[0], selectIdx[1], (selectIdx[2] + sheet.rowCount), selectIdx[3]]));
        }

        if ((e.ctrlKey || e.metaKey) && e.shiftKey) {
            const actCell: number[] = getRangeIndexes(sheet.selectedRange);
            if (e.keyCode === 40) {    /*ctrl+shift+down*/
                const nextCell: number[] = this.getNextNonEmptyCell(actCell[2], actCell[3], 'down');
                actCell[2] = nextCell[0];
                actCell[3] = nextCell[1];
                this.parent.selectRange(getRangeAddress(actCell));
                this.scrollNavigation(nextCell, null, true);
            }
            else if (e.keyCode === 39) {  /*ctrl+shift+right*/
                const nextCell: number[] = this.getNextNonEmptyCell(actCell[2], actCell[3], 'right');
                actCell[2] = nextCell[0];
                actCell[3] = nextCell[1];
                this.parent.selectRange(getRangeAddress(actCell));
                this.scrollNavigation(nextCell, null, true);
            }
            else if (e.keyCode === 38) {  /*ctrl+shift+up*/
                const nextCell: number[] = this.getNextNonEmptyCell(actCell[2], actCell[3], 'top');
                actCell[2] = nextCell[0] - 1;
                actCell[3] = nextCell[1];
                if (actCell[2] === -1) {
                    actCell[2] = 0;
                }
                this.parent.selectRange(getRangeAddress(actCell));
                this.scrollNavigation(nextCell, null, true);
            }
            else if (e.keyCode === 37) {  /*ctrl+shift+left*/
                const nextCell: number[] = this.getNextNonEmptyCell(actCell[2], actCell[3], 'left');
                actCell[2] = nextCell[0];
                actCell[3] = nextCell[1] - 1;
                if (actCell[3] === -1) {
                    actCell[3] = 0;
                }
                this.parent.selectRange(getRangeAddress(actCell));
                this.scrollNavigation(nextCell, null, true);
            }
        }

        if ((e.ctrlKey || e.metaKey) && !e.shiftKey) {
            if (e.keyCode === 37) { /*ctrl + left*/
                actIdxes[1] = this.getNextNonEmptyCell(actIdxes[0], actIdxes[1], 'left')[1];
                isNavigate = scrollToCell = true;
            }
            else if (e.keyCode === 38) {  /*ctrl + up*/
                actIdxes[0] = this.getNextNonEmptyCell(actIdxes[0], actIdxes[1], 'top')[0];
                isNavigate = scrollToCell = true;
            }
            else if (e.keyCode === 39) { /*ctrl+ right*/
                actIdxes[1] = this.getNextNonEmptyCell(actIdxes[0], actIdxes[1], 'right')[1];
                isNavigate = scrollToCell = true;
            }
            else if (e.keyCode === 40) { /*ctrl+ down*/
                actIdxes[0] = this.getNextNonEmptyCell(actIdxes[0], actIdxes[1], 'down')[0];
                isNavigate = scrollToCell = true;
            }
        }

        if (e.shiftKey && (e.keyCode === 34 || e.keyCode === 33)) { /* shift Page Up and Page Down*/
            let diff: number = 0;
            if (e.keyCode === 34) {  /* Page Down*/
                diff = mainPanel.getBoundingClientRect().height + mainPanel.scrollTop;
            } else {  /* Page up*/
                diff = mainPanel.scrollTop - mainPanel.getBoundingClientRect().height;
                if (diff < 0) { return; }
            }
            const aRowIdx: number = getRangeIndexes(this.parent.getActiveSheet().selectedRange)[2];
            let topRow: number = getCellIndexes(this.parent.getActiveSheet().paneTopLeftCell)[0];
            const selectDiff: number = aRowIdx - topRow;
            if (this.parent.scrollModule) { this.parent.scrollModule.isKeyScroll = false; }
            mainPanel.scrollTop = diff;
            getUpdateUsingRaf((): void => {
                topRow = getCellIndexes(this.parent.getActiveSheet().paneTopLeftCell)[0];
                const actIdx: Number = topRow + selectDiff;
                this.parent.selectRange(getRangeAddress([actIdxes[0], actIdxes[1], topRow + selectDiff, actIdxes[1]]));
            });
        }
        const filterArgs: { [key: string]: KeyboardEvent | boolean } = { e: e, isFilterCell: false };
        if (e.shiftKey && !e.ctrlKey) {/* shift selection */
            this.shiftSelection(e);
        } else if (e.altKey && e.keyCode === 40) {
            this.parent.notify(filterCellKeyDown, filterArgs);
        }
        if (!e.shiftKey && ((!isRtl && e.keyCode === 37) || (isRtl && e.keyCode === 39)) || (e.shiftKey && e.keyCode === 9)) {
            /*left key*/
            if (actIdxes[1] > 0) {
                if (sheet.isProtected && !sheet.protectSettings.selectUnLockedCells || !sheet.isProtected) {
                    actIdxes[1] -= 1;
                } else {
                    const idx: number[] = this.getNextUnlockedCell(e.keyCode, actIdxes);
                    actIdxes[1] = idx[1];
                    actIdxes[0] = idx[0];
                }
                isNavigate = true;
            } else {
                const content: Element = this.parent.getMainContent();
                if (actIdxes[1] === 0 && content.scrollLeft && !isRtl) { content.scrollLeft = 0; }
            }
        } else if (e.shiftKey && e.keyCode === 13) {
            if (!this.parent.element.querySelector('.e-find-toolbar')) {
                if (actIdxes[0] > 0) {
                    if (sheet.isProtected && !sheet.protectSettings.selectUnLockedCells || !sheet.isProtected) {
                        actIdxes[0] -= 1;
                    } else {
                        const idx: number[] = this.getNextUnlockedCell(e.keyCode, actIdxes);
                        actIdxes[1] = idx[1];
                        actIdxes[0] = idx[0];
                    }
                    isNavigate = true;
                } else {
                    const content: Element = this.parent.getMainContent().parentElement;
                    if (actIdxes[0] === 0 && content.scrollTop) { content.scrollTop = 0; }
                }
            }
        } else if (!filterArgs.isFilterCell && !e.shiftKey && e.keyCode === 38) {  /*Up key*/
            if (actIdxes[0] > 0) {
                if (sheet.isProtected && !sheet.protectSettings.selectUnLockedCells || !sheet.isProtected) {
                    actIdxes[0] -= 1;
                } else {
                    const cellIdx: number[] = this.getNextUnlockedCell(e.keyCode, actIdxes);
                    actIdxes[1] = cellIdx[1];
                    actIdxes[0] = cellIdx[0];
                }
                isNavigate = true;
            } else {
                const contentEle: Element = this.parent.getMainContent().parentElement;
                if (actIdxes[0] === 0 && contentEle.scrollTop) { contentEle.scrollTop = 0; }
            }
        } else if (!e.shiftKey && !e.ctrlKey && ((!isRtl && e.keyCode === 39) || (isRtl && e.keyCode === 37)) || e.keyCode === 9) { /*Right key*/
            const cell: CellModel = getCell(actIdxes[0], actIdxes[1], sheet);
            if (cell && cell.colSpan > 1) { actIdxes[1] += (cell.colSpan - 1); }
            if (actIdxes[1] < sheet.colCount - 1) {
                if (sheet.isProtected && !sheet.protectSettings.selectUnLockedCells || !sheet.isProtected) {
                    actIdxes[1] += 1;
                } else {
                    const idx: number[] = this.getNextUnlockedCell(e.keyCode, actIdxes);
                    actIdxes[1] = idx[1];
                    actIdxes[0] = idx[0];
                }
                isNavigate = true;
            }
        } else if ((!filterArgs.isFilterCell && !e.shiftKey && !e.ctrlKey && e.keyCode === 40) || e.keyCode === 13) { /*Down Key*/
            const cell: CellModel = getCell(actIdxes[0], actIdxes[1], sheet);
            if (cell && cell.rowSpan > 1) { actIdxes[0] += (cell.rowSpan - 1); }
            if (actIdxes[0] < sheet.rowCount - 1) {
                if (sheet.isProtected && !sheet.protectSettings.selectUnLockedCells || !sheet.isProtected) {
                    actIdxes[0] += 1;
                } else {
                    const idx: number[] = this.getNextUnlockedCell(e.keyCode, actIdxes);
                    actIdxes[1] = idx[1];
                    actIdxes[0] = idx[0];
                }
                isNavigate = true;
            }
        } else if (!e.shiftKey && (e.keyCode === 34 || e.keyCode === 33) && (!this.parent.scrollModule ||
            this.parent.scrollModule.isKeyScroll)) { /*Page Up and Page Down*/
            const mainPanel: Element = this.parent.element.querySelector('.e-main-panel');
            let diff: number = 0;
            if (e.keyCode === 34) { /*Page Down*/
                diff = mainPanel.getBoundingClientRect().height + mainPanel.scrollTop;
            } else { /*Page Up*/
                diff = mainPanel.scrollTop - mainPanel.getBoundingClientRect().height;
                if (diff < 0) { return; }
            }
            const aRowIdx: number = getCellIndexes(this.parent.getActiveSheet().activeCell)[0];
            let topRow: number = getCellIndexes(this.parent.getActiveSheet().paneTopLeftCell)[0];
            const selectDiff: number = aRowIdx - topRow;
            if (this.parent.scrollModule) { this.parent.scrollModule.isKeyScroll = false; }
            mainPanel.scrollTop = diff;
            getUpdateUsingRaf((): void => {
                topRow = getCellIndexes(this.parent.getActiveSheet().paneTopLeftCell)[0];
                this.parent.notify(cellNavigate, { range: [topRow + selectDiff, actIdxes[1]], preventAnimation: true });
            });
        }
        if ((isNavigate && (!this.parent.scrollModule || this.parent.scrollModule.isKeyScroll)) && !closest(document.activeElement, '.e-ribbon')) {
            if (e.keyCode === 40 || e.keyCode === 38 || e.keyCode === 13) { /* down || up */
                while (isHiddenRow(sheet, actIdxes[0])) {
                    if (e.keyCode === 40 || (!e.shiftKey && e.keyCode === 13)) { actIdxes[0] = actIdxes[0] + 1; }
                    if (e.keyCode === 38 || (e.shiftKey && e.keyCode === 13)) {
                        actIdxes[0] = actIdxes[0] - 1;
                        if (actIdxes[0] < 0) { return; }
                    }
                }
            }
            if (e.keyCode === 37 || e.keyCode === 39 || e.keyCode === 9) {  /* left || right || tab */
                while (isHiddenCol(sheet, actIdxes[1])) {
                    if (e.keyCode === 39 || (!e.shiftKey && e.keyCode === 9)) { actIdxes[1] = actIdxes[1] + 1; }
                    if (e.keyCode === 37 || (e.shiftKey && e.keyCode === 9)) {
                        actIdxes[1] = actIdxes[1] - 1;
                        if (actIdxes[1] < 0) { return; }
                    }
                }
            }
            this.scrollNavigation(scrollIdxes || actIdxes, scrollIdxes ? true : false, scrollToCell);
            const range: string = getRangeAddress(actIdxes);
            const navigateFn: Function = (preventAnimation?: boolean) => {
                if (range === sheet.selectedRange) { return; }
                this.parent.setSheetPropertyOnMute(sheet, 'activeCell', range);
                this.parent.notify(cellNavigate, { range: actIdxes, preventAnimation: preventAnimation });
                const cell: HTMLElement = this.parent.getCell(actIdxes[0], actIdxes[1]);
                if (cell) {
                    focus(cell);
                }
            };
            if (this.parent.scrollModule && this.parent.scrollModule.isKeyScroll) {
                if (range === sheet.selectedRange) { return; }
                getUpdateUsingRaf(navigateFn.bind(this, true));
            } else {
                navigateFn();
            }
        }
    }

    private getNextNonEmptyCell(rowIdx: number, colIdx: number, position: string): number[] {
        let indexes: number[] = [rowIdx, colIdx];
        const sheet: SheetModel = this.parent.getActiveSheet();
        let checkForEmptyCell: boolean;
        if (position === "down") {
            checkForEmptyCell = !isUndefined(getCell(rowIdx, colIdx, sheet, null, true).value) && !isUndefined(getCell(rowIdx + 1, colIdx, sheet, null, true).value);
            for (let i: number = rowIdx; i < sheet.rowCount; i++) {
                if (checkForEmptyCell) {
                    if (isUndefined(getCell(i, colIdx, sheet, null, true).value)) {
                        return [i - 1, colIdx];
                    }
                }
                else {
                    if (!isUndefined(getCell(i + 1, colIdx, sheet, null, true).value)) { return [i + 1, colIdx]; }
                }
                if (i === sheet.rowCount - 1) { return [i, colIdx]; }
            }
        }
        if (position === "top") {
            checkForEmptyCell = !isUndefined(getCell(rowIdx, colIdx, sheet, null, true).value) && !isUndefined(getCell(rowIdx - 1, colIdx, sheet, null, true).value);
            for (let i: number = rowIdx; i >= 0; i--) {
                if (checkForEmptyCell) {
                    if (isUndefined(getCell(i, colIdx, sheet, null, true).value)) {
                        return [i - 1, colIdx];
                    }
                }
                else {
                    if (!isUndefined(getCell(i - 1, colIdx, sheet, null, true).value)) { return [i, colIdx]; }
                }
                if (i === 0) { return [i, colIdx]; }
            }
        }
        if (position === "right") {
            checkForEmptyCell = !isUndefined(getCell(rowIdx, colIdx, sheet, null, true).value) && !isUndefined(getCell(rowIdx, colIdx + 1, sheet, null, true).value);
            for (let i: number = colIdx; i < sheet.colCount; i++) {
                if (checkForEmptyCell) {
                    if (isUndefined(getCell(rowIdx, i, sheet, null, true).value)) {
                        return [rowIdx, i - 1];
                    }
                }
                else {
                    if (!isUndefined(getCell(rowIdx, i + 1, sheet, null, true).value)) { return [rowIdx, i + 1]; }
                }
                if (i === sheet.colCount - 1) { return [rowIdx, i]; }
            }
        }
        if (position === "left") {
            checkForEmptyCell = !isUndefined(getCell(rowIdx, colIdx, sheet, null, true).value) && !isUndefined(getCell(rowIdx, colIdx - 1, sheet, null, true).value);
            for (let i: number = colIdx; i >= 0; i--) {
                if (checkForEmptyCell) {
                    if (isUndefined(getCell(rowIdx, i, sheet, null, true).value)) {
                        return [rowIdx, i - 1];
                    }
                }
                else {
                    if (!isUndefined(getCell(rowIdx, i - 1, sheet, null, true).value)) { return [rowIdx, i]; }
                }
                if (i === 0) { return [rowIdx, i]; }
            }
        }
        return indexes;
    }

    private getNextUnlockedCell(keycode: number, actCellIdx: number[]): number[] {
        const sheet: SheetModel = this.parent.getActiveSheet();
        let index: number[];
        if (keycode === 39) {
            let colIdx: number = actCellIdx[1] + 1;
            let rowIdx: number = actCellIdx[0];
            if (actCellIdx[1] === sheet.usedRange.colIndex) {
                colIdx = 0; rowIdx = rowIdx + 1;
                if (actCellIdx[0] === sheet.usedRange.rowIndex) {
                    rowIdx = 0;
                }
            }
            if (actCellIdx[1] === sheet.usedRange.colIndex && actCellIdx[0] === sheet.usedRange.rowIndex) {
                rowIdx = colIdx = 0;
            }
            for (let i: number = rowIdx; i <= sheet.usedRange.rowIndex + 1; i++) {
                if (i > sheet.usedRange.rowIndex) { i = 0; }
                for (let j: number = colIdx; j <= sheet.usedRange.colIndex; j++) {
                    if (!isLockedCells(this.parent, [i, j, i, j])) {
                        index = [i, j];
                        return index;
                    }
                    colIdx = j;
                }
                rowIdx = i;
                if (colIdx === sheet.usedRange.colIndex) {
                    colIdx = 0;
                    if (rowIdx === sheet.usedRange.rowIndex) {
                        rowIdx = 0;
                    } else {
                        rowIdx++;
                    }
                }
            }
        }

        if (keycode === 37) { /*Right Key*/
            let colIdx: number = actCellIdx[1] - 1;
            let rowIdx: number = actCellIdx[0];
            if (actCellIdx[1] === 0) {
                colIdx = sheet.usedRange.colIndex;
                rowIdx = rowIdx - 1;
                if (actCellIdx[0] === 0) {
                    rowIdx = sheet.usedRange.rowIndex;
                }
            }
            for (let i: number = rowIdx; i >= -1; i--) {
                if (i < 0) {
                    i = sheet.usedRange.rowIndex;
                }
                for (let j: number = colIdx; j >= 0; j--) {
                    if (!isLockedCells(this.parent, [i, j, i, j])) {
                        index = [i, j];
                        return index;
                    }
                    colIdx = j;
                }
                rowIdx = i;
                if (colIdx === 0) {
                    colIdx = sheet.usedRange.colIndex;
                    if (rowIdx === 0) {
                        rowIdx = sheet.usedRange.rowIndex;
                    } else {
                        rowIdx--;
                    }
                }
            }
        }
        if (keycode === 40) { /*Down Key*/
            let colIdx: number = actCellIdx[1];
            let rowIdx: number = actCellIdx[0] + 1;
            if (actCellIdx[0] === sheet.usedRange.rowIndex) {
                colIdx = colIdx + 1; rowIdx = 0;
                if (actCellIdx[1] === sheet.usedRange.colIndex) {
                    rowIdx = 0;
                }
            }
            if (actCellIdx[1] === sheet.usedRange.colIndex && actCellIdx[0] === sheet.usedRange.rowIndex) {
                rowIdx = colIdx = 0;
            }
            for (let i: number = colIdx; i <= sheet.usedRange.colIndex + 1; i++) {
                if (i > sheet.usedRange.colIndex) { i = 0; }
                for (let j: number = rowIdx; j <= sheet.usedRange.rowIndex; j++) {
                    if (!isLockedCells(this.parent, [j, i, j, i])) {
                        index = [j, i];
                        return index;
                    }
                    rowIdx = j;
                }
                colIdx = i;
                if (rowIdx === sheet.usedRange.rowIndex) {
                    colIdx++;
                    if (colIdx === sheet.usedRange.colIndex) {
                        rowIdx = 0;
                    } else {
                        rowIdx = 0;
                    }
                }
            }
        }
        if (keycode === 38) { /*Up Key*/
            let colIdx: number = actCellIdx[1];
            let rowIdx: number = actCellIdx[0] - 1;
            if (actCellIdx[0] === 0) {
                colIdx = colIdx - 1;
                rowIdx = sheet.usedRange.rowIndex;
                if (actCellIdx[1] === 0) {
                    colIdx = sheet.usedRange.colIndex;
                }
            }
            for (let i: number = colIdx; i >= -1; i--) {
                if (i < 0) {
                    i = sheet.usedRange.colIndex;
                }
                for (let j: number = rowIdx; j >= 0; j--) {
                    if (!isLockedCells(this.parent, [j, i, j, i])) {
                        index = [j, i];
                        return index;
                    }
                    rowIdx = j;
                }
                colIdx = i;
                if (rowIdx === 0) {
                    rowIdx = sheet.usedRange.rowIndex;
                    if (colIdx === 0) {
                        colIdx = sheet.usedRange.colIndex;
                    } else {
                        colIdx--;
                    }
                }
            }
        }
        return index;
    }

    private shiftSelection(e: KeyboardEvent): void {
        const sheet: SheetModel = this.parent.getActiveSheet();
        const selectedRange: number[] = getRangeIndexes(sheet.selectedRange);
        const swapRange: number[] = getSwapRange(selectedRange);
        let noHidden: boolean = true;
        if (e.keyCode === 38) { /*shift + up arrow*/
            for (let i: number = swapRange[1]; i <= swapRange[3]; i++) {
                const cell: CellModel = getCell(selectedRange[2], i, this.parent.getActiveSheet());
                if (!isNullOrUndefined(cell) && cell.rowSpan && cell.rowSpan < 0) {
                    selectedRange[2] = selectedRange[2] - (Math.abs(cell.rowSpan) + 1);
                    noHidden = false;
                    break;
                }
            }
            if (noHidden) {
                selectedRange[2] = selectedRange[2] - 1;
            }
            if (selectedRange[2] < 0) {
                selectedRange[2] = 0;
            }
        }
        if (e.keyCode === 40) { /*shift + down arrow*/
            for (let i: number = swapRange[1]; i <= swapRange[3]; i++) {
                const cell: CellModel = getCell(selectedRange[2], i, this.parent.getActiveSheet());
                if (!isNullOrUndefined(cell) && cell.rowSpan && cell.rowSpan > 0) {
                    selectedRange[2] = selectedRange[2] + Math.abs(cell.rowSpan);
                    noHidden = false;
                    break;
                }
            }
            if (noHidden) {
                selectedRange[2] = selectedRange[2] + 1;
            }
            if (sheet.rowCount <= selectedRange[2]) {
                selectedRange[2] = sheet.rowCount - 1;
            }
        }
        if (e.keyCode === 39) { /*shift + right arrow*/
            for (let i: number = swapRange[0]; i <= swapRange[2]; i++) {
                const cell: CellModel = getCell(i, selectedRange[3], this.parent.getActiveSheet());
                if (!isNullOrUndefined(cell) && cell.colSpan && cell.colSpan > 0) {
                    selectedRange[3] = selectedRange[3] + Math.abs(cell.colSpan);
                    noHidden = false;
                    break;
                }
            }
            if (noHidden) {
                selectedRange[3] = selectedRange[3] + 1;
            }
            if (sheet.colCount <= selectedRange[3]) {
                selectedRange[3] = sheet.colCount - 1;
            }
        }
        if (e.keyCode === 37) { /*shift + left arrow*/
            for (let i: number = swapRange[0]; i <= swapRange[2]; i++) {
                const cell: CellModel = getCell(i, selectedRange[3], this.parent.getActiveSheet());
                if (!isNullOrUndefined(cell) && cell.colSpan && cell.colSpan < 0) {
                    selectedRange[3] = selectedRange[3] - (Math.abs(cell.colSpan) + 1);
                    noHidden = false;
                    break;
                }
            }
            if (noHidden) {
                selectedRange[3] = selectedRange[3] - 1;
            }
            if (selectedRange[3] < 0) {
                selectedRange[3] = 0;
            }
        }
        if (e.shiftKey && e.ctrlKey && !this.parent.scrollSettings.enableVirtualization) { /*ctrl + shift selection*/
            const usedRange: number[] = [sheet.usedRange.rowIndex, sheet.usedRange.colIndex];
            if (e.keyCode === 37) {
                if (selectedRange[3] <= usedRange[1]) {
                    selectedRange[3] = 0;
                } else {
                    selectedRange[3] = usedRange[1];
                }
            }
            if (e.keyCode === 38) {
                if (selectedRange[2] <= usedRange[0]) {
                    selectedRange[2] = 0;
                } else {
                    selectedRange[2] = usedRange[0];
                }
            }
            if (e.keyCode === 39) {
                if (selectedRange[3] <= usedRange[1]) {
                    selectedRange[3] = usedRange[1];
                } else {
                    selectedRange[3] = this.parent.getActiveSheet().colCount;
                }
            }
            if (e.keyCode === 40) {
                if (selectedRange[2] <= usedRange[0]) {
                    selectedRange[2] = usedRange[0];
                } else {
                    selectedRange[2] = this.parent.getActiveSheet().rowCount;
                }
            }
        }
        if (e.keyCode === 37 || e.keyCode === 39 || e.keyCode === 38 || e.keyCode === 40) { /*left,right,up,down*/
            const activeIdxes: number[] = getCellIndexes(sheet.activeCell);
            while (isHiddenRow(this.parent.getActiveSheet(), selectedRange[2])) {
                if (e.keyCode === 40) {
                    selectedRange[2] = selectedRange[2] + 1;
                }
                if (e.keyCode === 38) {
                    selectedRange[2] = selectedRange[2] - 1;
                }
            }
            this.parent.selectRange(getRangeAddress(selectedRange));
            this.scrollNavigation([isColumnSelected(sheet, selectedRange) ? activeIdxes[0] : selectedRange[2],
            isRowSelected(sheet, selectedRange) ? activeIdxes[1] : selectedRange[3]], false);
        }
    }

    private scrollNavigation(actIdxes: number[], isScroll: boolean, scrollToCell?: boolean): void {
        if (!this.parent.allowScrolling) {
            return;
        }
        const x: number = this.parent.enableRtl ? -1 : 1;
        const cont: Element = this.parent.getMainContent().parentElement;
        const hCont: Element = this.parent.getScrollElement();
        const sheet: SheetModel = this.parent.getActiveSheet();
        const selectedRange: number[] = getSwapRange(getRangeIndexes(sheet.selectedRange));
        const topLeftIdxes: number[] = getCellIndexes(sheet.topLeftCell);
        const frozenRow: number = this.parent.frozenRowCount(sheet); const frozenCol: number = this.parent.frozenColCount(sheet);
        const paneTopLeftIdxes: number[] = getCellIndexes(sheet.paneTopLeftCell);
        const topIdx: number = skipHiddenIdx(sheet, actIdxes[0] < frozenRow ? topLeftIdxes[0] : paneTopLeftIdxes[0], true);
        const leftIdx: number = actIdxes[1] < frozenCol ? topLeftIdxes[1] : paneTopLeftIdxes[1];
        const offsetTopSize: number = this.parent.scrollModule.offset.top.size;
        if (cont.scrollTop) {
            if (frozenRow && actIdxes[0] !== selectedRange[2]) {
                if (actIdxes[0] === frozenRow) {
                    cont.scrollTop = 0; return;
                }
                if (actIdxes[0] === frozenRow - 1) { cont.scrollTop = 0; }
            } else if (actIdxes[0] === skipHiddenIdx(sheet, 0, true)) {
                cont.scrollTop = 0; return;
            }
        }
        if (hCont && hCont.scrollLeft) {
            if (frozenCol && actIdxes[1] !== selectedRange[3]) {
                if (actIdxes[1] === frozenCol) {
                    hCont.scrollLeft = 0; return;
                }
                if (actIdxes[1] === frozenCol - 1) { hCont.scrollLeft = 0; }
            } else if (actIdxes[1] === skipHiddenIdx(sheet, 0, true, 'columns')) {
                hCont.scrollLeft = 0; return;
            }
        }
        if ((this.getBottomIdx(topIdx) <= actIdxes[0] || isScroll)) {
            if (scrollToCell) {
                cont.scrollTop = offsetTopSize + getRowsHeight(sheet, paneTopLeftIdxes[0], actIdxes[0], true) - cont.getBoundingClientRect().height;
            } else {
                cont.scrollTop = offsetTopSize + getRowHeight(sheet, skipHiddenIdx(sheet, paneTopLeftIdxes[0], true), true);
            }
        } else if (topIdx > actIdxes[0]) {
            if (scrollToCell) {
                cont.scrollTop = offsetTopSize - Math.ceil(getRowsHeight(sheet, paneTopLeftIdxes[0], actIdxes[0], true) + cont.getBoundingClientRect().height);
            } else {
                cont.scrollTop = offsetTopSize - Math.ceil(getRowHeight(sheet, actIdxes[0], true));
                this.parent.scrollModule.isKeyScroll = false;
            }
        }
        const scrollLeftIdx: number = this.getRightIdx(leftIdx);
        if ((scrollLeftIdx <= actIdxes[1] || isScroll) && hCont) {
            if (scrollToCell) {
                hCont.scrollLeft += getColumnsWidth(sheet, paneTopLeftIdxes[1], actIdxes[1], true) + hCont.getBoundingClientRect().width;
            } else {
                hCont.scrollLeft += getColumnWidth(sheet, scrollLeftIdx, null, true) * x;
            }
        } else if (leftIdx > actIdxes[1] && hCont) {
            if (scrollToCell) {
                hCont.scrollLeft -= getColumnsWidth(sheet, paneTopLeftIdxes[1], actIdxes[1], true) + hCont.getBoundingClientRect().width;
            } else {
                hCont.scrollLeft -= getColumnWidth(sheet, actIdxes[1], null, true) * x;
                this.parent.scrollModule.isKeyScroll = false;
            }
        }
    }

    private getBottomIdx(top: number): number {
        let hgt: number = 0;
        const sheet: SheetModel = this.parent.getActiveSheet();
        const viewPortHeight: number = (sheet.frozenRows ? this.parent.viewport.height - this.parent.sheetModule.getColHeaderHeight(
            sheet, true) : this.parent.viewport.height) - 17 || 20;
        for (let i: number = top; ; i++) {
            hgt += getRowHeight(sheet, i, true);
            if (hgt >= viewPortHeight) { return i; }
        }
    }

    private getRightIdx(left: number): number {
        let width: number = 0;
        const sheet: SheetModel = this.parent.getActiveSheet();
        const contWidth: number = (this.parent.getMainContent() as HTMLElement).parentElement.offsetWidth -
            this.parent.sheetModule.getRowHeaderWidth(sheet) - this.parent.sheetModule.getScrollSize();
        for (let i: number = left; ; i++) {
            width += getColumnWidth(sheet, i, null, true);
            if (width >= contWidth) {
                return i;
            }
        }
    }

    /**
     * For internal use only - Get the module name.
     *
     * @private
     * @returns {string} - Get the module name.
     */
    protected getModuleName(): string {
        return 'keyboardNavigation';
    }

    public destroy(): void {
        this.removeEventListener();
        this.parent = null;
    }
}
