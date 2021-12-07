import { Spreadsheet } from '../base/index';
import { keyDown, cellNavigate, renameSheet, filterCellKeyDown } from '../common/index';
import { SheetModel, getCellIndexes, getRangeAddress, getRowHeight, getColumnWidth, CellModel, getCell } from '../../workbook/index';
import { getRangeIndexes, getSwapRange, isHiddenRow } from '../../workbook/index';
import { closest, isNullOrUndefined } from '@syncfusion/ej2-base';

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
        if (!this.parent.isEdit && (document.activeElement.classList.contains('e-spreadsheet') ||
            closest(document.activeElement, '.e-sheet')) && !closest(e.target as Element, '.e-name-box')) {
            let isNavigate: boolean;
            let scrollIdxes: number[];
            const isRtl: boolean = this.parent.enableRtl;
            const sheet: SheetModel = this.parent.getActiveSheet();
            const filterArgs: { [key: string]: KeyboardEvent | boolean } = { e: e, isFilterCell: false };
            const actIdxes: number[] = getCellIndexes(sheet.activeCell);
            if ([9, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
                e.preventDefault();
            }
            if (e.shiftKey) {// shift selection
                this.shiftSelection(e);
            }
            if (!e.shiftKey && e.altKey && (e.keyCode === 38 || e.keyCode === 40)) {
                this.parent.notify(filterCellKeyDown, filterArgs);
            }
            if ((!e.shiftKey && ((!isRtl && e.keyCode === 37) || (isRtl && e.keyCode === 39)))
                || (e.shiftKey && e.keyCode === 9)) { //left key
                if (actIdxes[1] > 0) {
                    actIdxes[1] -= 1;
                    isNavigate = true;
                } else {
                    const content: Element = this.parent.getMainContent();
                    if (actIdxes[1] === 0 && content.scrollLeft && !isRtl) { content.scrollLeft = 0; }
                }
            } else if (e.shiftKey && e.keyCode === 13) {    // Up key
                if (!this.parent.element.querySelector('.e-find-toolbar')) {
                    if (actIdxes[0] > 0) {
                        actIdxes[0] -= 1;
                        isNavigate = true;
                    } else {
                        const content: Element = this.parent.getMainContent().parentElement;
                        if (actIdxes[0] === 0 && content.scrollTop) { content.scrollTop = 0; }
                    }
                }
            } else if (!filterArgs.isFilterCell && !e.shiftKey && e.keyCode === 38) {    // Up key
                if (actIdxes[0] > 0) {
                    actIdxes[0] -= 1;
                    isNavigate = true;
                } else {
                    const content: Element = this.parent.getMainContent().parentElement;
                    if (actIdxes[0] === 0 && content.scrollTop) { content.scrollTop = 0; }
                }
            } else if ((!e.shiftKey && ((!isRtl && e.keyCode === 39) || (isRtl && e.keyCode === 37))) || e.keyCode === 9) { // Right key
                const cell: CellModel = getCell(actIdxes[0], actIdxes[1], sheet);
                if (cell && cell.colSpan > 1) { actIdxes[1] += (cell.colSpan - 1); }
                if (actIdxes[1] < sheet.colCount - 1) {
                    actIdxes[1] += 1;
                    isNavigate = true;
                }
            } else if ((!filterArgs.isFilterCell && !e.shiftKey && e.keyCode === 40) || e.keyCode === 13) {      // Down Key
                const cell: CellModel = getCell(actIdxes[0], actIdxes[1], sheet);
                if (cell && cell.rowSpan > 1) { actIdxes[0] += (cell.rowSpan - 1); }
                if (actIdxes[0] < sheet.rowCount - 1) {
                    actIdxes[0] += 1;
                    isNavigate = true;
                }
            }
            /* else if (e.keyCode === 36) {
                actIdxes[1] = 0;
                if (e.ctrlKey) {
                    actIdxes[0] = 0;
                }
                isNavigate = true;
                e.preventDefault();
            } else if (e.keyCode === 35 && e.ctrlKey) {
                actIdxes = [sheet.usedRange.rowIndex, sheet.usedRange.colIndex];
                scrollIdxes = [sheet.usedRange.rowIndex - this.parent.viewport.rowCount,
                    sheet.usedRange.colIndex - this.parent.viewport.colCount];
                isNavigate = true;
                e.preventDefault();
            } */
            if (isNavigate) {
                const isScroll: boolean = this.parent.scrollModule ? this.parent.scrollModule.isKeyScroll : true;
                if (isScroll) {
                    if (e.keyCode === 40 || e.keyCode === 38) {
                        while (isHiddenRow(sheet, actIdxes[0])) {
                            if (e.keyCode === 40) {
                                actIdxes[0] = actIdxes[0] + 1;
                            }
                            if (e.keyCode === 38) {
                                actIdxes[0] = actIdxes[0] - 1;
                            }
                        }
                    }
                    this.scrollNavigation(scrollIdxes || actIdxes, scrollIdxes ? true : false);
                    this.parent.setSheetPropertyOnMute(sheet, 'activeCell', getRangeAddress(actIdxes));
                    this.parent.notify(cellNavigate, { range: actIdxes });
                }
            }
        }
        const target: HTMLInputElement = e.target as HTMLInputElement;
        if (target.classList.contains('e-sheet-rename')) {
            if (e.keyCode === 32) {
                e.stopPropagation();
            } else if (e.keyCode === 13 || e.keyCode === 27) {
                this.parent.notify(renameSheet, e);
            }
        }
    }

    private shiftSelection(e: KeyboardEvent): void {
        const sheet: SheetModel = this.parent.getActiveSheet();
        const selectedRange: number[] = getRangeIndexes(sheet.selectedRange);
        const swapRange: number[] = getSwapRange(selectedRange); let noHidden: boolean = true;
        if (e.keyCode === 38) { // shift + up arrow
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
        if (e.keyCode === 40) { // shift + down arrow
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
        }
        if (e.keyCode === 39) { // shift + right arrow
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
        }
        if (e.keyCode === 37) { // shift + left arrow
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
        if (e.shiftKey && e.ctrlKey && !this.parent.scrollSettings.enableVirtualization) { // ctrl + shift selection
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
        if (e.keyCode === 37 || e.keyCode === 39 || e.keyCode === 38 || e.keyCode === 40) {
            while (isHiddenRow(this.parent.getActiveSheet(), selectedRange[2])) {
                if (e.keyCode === 40) {
                    selectedRange[2] = selectedRange[2] + 1;
                }
                if (e.keyCode === 38) {
                    selectedRange[2] = selectedRange[2] - 1;
                }
            }
            this.parent.selectRange(getRangeAddress(selectedRange));
            this.scrollNavigation([selectedRange[2], selectedRange[3]], false);
        }
    }

    private scrollNavigation(actIdxes: number[], isScroll: boolean): void {
        if (!this.parent.allowScrolling) {
            return;
        }
        const x: number = this.parent.enableRtl ? -1 : 1;
        const cont: Element = this.parent.getMainContent().parentElement;
        const hCont: Element = this.parent.getScrollElement();
        const sheet: SheetModel = this.parent.getActiveSheet();
        const selectedRange: number[] =  getSwapRange(getRangeIndexes(sheet.selectedRange));
        const topLeftIdxes: number[] = getCellIndexes(sheet.topLeftCell);
        const frozenRow: number = this.parent.frozenRowCount(sheet); const frozenCol: number = this.parent.frozenColCount(sheet);
        const paneTopLeftIdxes: number[] = getCellIndexes(sheet.paneTopLeftCell);
        const topIdx: number = actIdxes[0] < frozenRow ? topLeftIdxes[0] : paneTopLeftIdxes[0];
        const leftIdx: number = actIdxes[1] < frozenCol ? topLeftIdxes[1] : paneTopLeftIdxes[1];
        const offsetTopSize: number = this.parent.scrollModule.offset.top.size;
        if (cont.scrollTop) {
            if (frozenRow && actIdxes[0] !== selectedRange[2]) {
                if (actIdxes[0] === frozenRow) {
                    cont.scrollTop = 0; return;
                }
                if (actIdxes[0] === frozenRow - 1) { cont.scrollTop = 0; }
            } else if (actIdxes[0] === this.parent.renderModule.skipHiddenIdx(0, true)) {
                cont.scrollTop = 0; return;
            }
        }
        if (hCont.scrollLeft) {
            if (frozenCol && actIdxes[1] !== selectedRange[3]) {
                if (actIdxes[1] === frozenCol) {
                    hCont.scrollLeft = 0; return;
                }
                if (actIdxes[1] === frozenCol - 1) { hCont.scrollLeft = 0; }
            } else if (actIdxes[1] === this.parent.renderModule.skipHiddenIdx(0, true, 'columns')) {
                hCont.scrollLeft = 0; return;
            }
        }
        if (this.getBottomIdx(topIdx) <= actIdxes[0] || isScroll) {
            cont.scrollTop = offsetTopSize + getRowHeight(sheet, paneTopLeftIdxes[0], true);
            this.parent.scrollModule.isKeyScroll = false;
        } else if (topIdx > actIdxes[0]) {
            cont.scrollTop = offsetTopSize - Math.ceil(getRowHeight(sheet, actIdxes[0], true));
        }
        const scrollLeftIdx: number = this.getRightIdx(leftIdx);
        if (scrollLeftIdx <= actIdxes[1] || isScroll) {
            hCont.scrollLeft += getColumnWidth(sheet, scrollLeftIdx, null, true) * x;
            this.parent.scrollModule.isKeyScroll = false;
        } else if (leftIdx > actIdxes[1]) {
            hCont.scrollLeft -= getColumnWidth(sheet, actIdxes[1], null, true) * x;
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
