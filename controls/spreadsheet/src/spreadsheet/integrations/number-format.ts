import { Spreadsheet } from '../index';
import { refreshCellElement, rowFillHandler, getTextSpace } from '../../workbook/common/event';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { getTextWidth, getExcludedColumnWidth } from '../common/index';
import { CellModel } from '../../workbook/index';
/**
 * Specifies number format.
 */
export class NumberFormat {
    private parent: Spreadsheet;
    constructor(parent: Spreadsheet) {
        this.parent = parent;
        this.addEventListener();
        //Spreadsheet.Inject(WorkbookNumberFormat);
    }

    private refreshCellElement(args: RefreshValueArgs): void {
        const cell: HTMLElement = args.cellEle || this.parent.getCell(args.rowIndex, args.colIndex);
        if (!isNullOrUndefined(cell)) {
            this.parent.refreshNode(cell as Element, args);
        }
    }

    private getTextSpace(args: { [key: string]: number | string | CellModel }): void {
        args.width = getTextWidth(<string>args.char, (args.cell as CellModel).style, this.parent.cellStyle);
    }

    private rowFillHandler(args: { cell: CellModel, cellEle: HTMLElement, rowIdx: number, colIdx: number, beforeFillText: string,
        repeatChar: string, afterFillText: string, formattedText?: string }): void {
        const cellElem: HTMLElement = args.cellEle || this.parent.getCell(args.rowIdx, args.colIdx);
        if (cellElem) {
            const repeatCharWidth: number = getTextWidth(args.repeatChar, args.cell.style, this.parent.cellStyle);
            let cellWidth: number = getExcludedColumnWidth(this.parent.getActiveSheet(), args.rowIdx, args.colIdx);
            if (args.beforeFillText) {
                cellElem.innerHTML = args.beforeFillText;
                cellWidth -= getTextWidth(args.beforeFillText, args.cell.style, this.parent.cellStyle);
            } else {
                cellElem.innerHTML = '';
            }
            const repeatCharSpan: HTMLElement = this.parent.createElement('span', { className: 'e-fill' });
            cellElem.appendChild(repeatCharSpan);
            if (args.afterFillText) {
                const textSpan: HTMLElement = this.parent.createElement('span', { className: 'e-fill-sec', innerHTML: args.afterFillText });
                cellElem.appendChild(textSpan);
                cellWidth -= getTextWidth(args.afterFillText, args.cell.style, this.parent.cellStyle);
            }
            const repeatCount: number = parseInt((cellWidth / repeatCharWidth).toString(), 10);
            args.formattedText = repeatCount > 0 ? args.repeatChar.repeat(repeatCount) : '';
            repeatCharSpan.textContent = args.formattedText;
        }
    }

    /**
     * Adding event listener for number format.
     *
     * @hidden
     * @returns {void} - Adding event listener for number format.
     */
    private addEventListener(): void {
        this.parent.on(refreshCellElement, this.refreshCellElement, this);
        this.parent.on(rowFillHandler, this.rowFillHandler, this);
        this.parent.on(getTextSpace, this.getTextSpace, this);
    }

    /**
     * Removing event listener for number format.
     *
     * @hidden
     * @returns {void} - Removing event listener for number format.
     */
    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(refreshCellElement, this.refreshCellElement);
            this.parent.off(rowFillHandler, this.rowFillHandler);
            this.parent.off(getTextSpace, this.getTextSpace);
        }
    }

    /**
     * To Remove the event listeners.
     *
     * @returns {void} - To Remove the event listeners.
     */
    public destroy(): void {
        this.removeEventListener();
        this.parent = null;
    }

    /**
     * Get the workbook import module name.
     *
     * @returns {string} - Get the workbook import module name.
     */
    public getModuleName(): string {
        return 'numberFormat';
    }
}

/**
 * @hidden
 */
export interface RefreshValueArgs {
    rowIndex?: number;
    colIndex?: number;
    result?: string;
    sheetIndex?: number;
    isRightAlign?: boolean;
    type?: string;
    curSymbol?: string;
    value?: string;
    isRowFill?: boolean;
    cellEle?: HTMLElement;
}
