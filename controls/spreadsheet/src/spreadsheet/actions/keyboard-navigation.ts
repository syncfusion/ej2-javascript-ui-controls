import { Spreadsheet } from '../base/index';
import { keyDown, cellNavigate, renameSheet, filterCellKeyDown } from '../common/index';
import { SheetModel, getCellIndexes, getRangeAddress, getRowHeight, getColumnWidth, CellModel, getCell } from '../../workbook/index';
import { closest } from '@syncfusion/ej2-base';

/**
 * Represents keyboard navigation support for Spreadsheet.
 */
export class KeyboardNavigation {
    private parent: Spreadsheet;

    /**
     * Constructor for the Spreadsheet Keyboard Navigation module.
     * @private
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
            closest(document.activeElement, '.e-sheet'))) {
            let isNavigate: boolean;
            let scrollIdxes: number[];
            let isRtl: boolean = this.parent.enableRtl;
            let sheet: SheetModel = this.parent.getActiveSheet();
            let filterArgs: { [key: string]: KeyboardEvent | boolean } = { e: e, isFilterCell: false };
            let actIdxes: number[] = getCellIndexes(this.parent.getActiveSheet().activeCell);
            if ([9, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
                e.preventDefault();
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
                    let content: Element = this.parent.getMainContent();
                    if (actIdxes[1] === 0 && content.scrollLeft && !isRtl) { content.scrollLeft = 0; }
                }
            } else if ((!filterArgs.isFilterCell && !e.shiftKey && e.keyCode === 38) || (e.shiftKey && e.keyCode === 13)) {    // Up key
                if (actIdxes[0] > 0) {
                    actIdxes[0] -= 1;
                    isNavigate = true;
                } else {
                    let content: Element = this.parent.getMainContent();
                    if (actIdxes[0] === 0 && content.scrollTop) { content.scrollTop = 0; }
                }
            } else if ((!e.shiftKey && ((!isRtl && e.keyCode === 39) || (isRtl && e.keyCode === 37))) || e.keyCode === 9) { // Right key
                let cell: CellModel = getCell(actIdxes[0], actIdxes[1], sheet);
                if (cell && cell.colSpan > 1) { actIdxes[1] += (cell.colSpan - 1); }
                if (actIdxes[1] < sheet.colCount - 1) {
                    actIdxes[1] += 1;
                    isNavigate = true;
                }
            } else if ((!filterArgs.isFilterCell && !e.shiftKey && e.keyCode === 40) || e.keyCode === 13) {      // Down Key
                let cell: CellModel = getCell(actIdxes[0], actIdxes[1], sheet);
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
                this.scrollNavigation(scrollIdxes || actIdxes, scrollIdxes ? true : false);
                this.parent.setSheetPropertyOnMute(sheet, 'activeCell', getRangeAddress(actIdxes));
                this.parent.notify(cellNavigate, { range: actIdxes });
            }
        }
        let target: HTMLInputElement = e.target as HTMLInputElement;
        if (target.classList.contains('e-sheet-rename')) {
            if (e.keyCode === 32) {
                e.stopPropagation();
            } else if (e.keyCode === 13 || e.keyCode === 27) {
                this.parent.notify(renameSheet, e);
            }
        }
    }

    private scrollNavigation(actIdxes: number[], isScroll: boolean): void {
        let x: number = this.parent.enableRtl ? -1 : 1;
        let cont: Element = this.parent.getMainContent();
        let sheet: SheetModel = this.parent.getActiveSheet();
        let prevActIdxes: number[] = getCellIndexes(sheet.activeCell);
        let topLeftIdxes: number[] = getCellIndexes(sheet.topLeftCell);
        if (this.getBottomIdx(topLeftIdxes) <= actIdxes[0] || isScroll) {
            cont.scrollTop += getRowHeight(sheet, actIdxes[0]);
        } else if (topLeftIdxes[0] > actIdxes[0]) {
            cont.scrollTop -= getRowHeight(sheet, actIdxes[0]);
        }
        if (this.getRightIdx(topLeftIdxes) <= actIdxes[1] || isScroll) {
            cont.scrollLeft += getColumnWidth(sheet, actIdxes[1]) * x;
        } else if (topLeftIdxes[1] > actIdxes[1]) {
            cont.scrollLeft -= getColumnWidth(sheet, actIdxes[1]) * x;
        }
    }

    private getBottomIdx(topLeftIdxes: number[]): number {
        let hgt: number = 0;
        let sheet: SheetModel = this.parent.getActiveSheet();
        for (let i: number = topLeftIdxes[0]; ; i++) {
            hgt += getRowHeight(sheet, i);
            if (hgt >= this.parent.viewport.height - 17) {
                return i;
            }
        }
    }

    private getRightIdx(topLeftIdxes: number[]): number {
        let width: number = 0;
        let sheet: SheetModel = this.parent.getActiveSheet();
        let contWidth: number = (this.parent.getMainContent() as HTMLElement).offsetWidth;
        for (let i: number = topLeftIdxes[1]; ; i++) {
            width += getColumnWidth(sheet, i);
            if (width >= contWidth - 17) {
                return i;
            }
        }
    }

    /**
     * For internal use only - Get the module name.
     * @private
     */
    protected getModuleName(): string {
        return 'keyboardNavigation';
    }

    public destroy(): void {
        this.removeEventListener();
        this.parent = null;
    }
}