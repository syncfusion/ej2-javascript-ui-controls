import { Spreadsheet } from '../index';
import { refreshCellElement, rowFillHandler, getTextSpace } from '../../workbook/common/event';
import { getTextWidth, getExcludedColumnWidth } from '../common/index';
import { CellModel, MergeArgs, activeCellMergedRange, NumberFormatArgs } from '../../workbook/index';
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

    private refreshCellElement(args: NumberFormatArgs): void {
        this.parent.refreshNode(args.td, args);
    }

    private getTextSpace(args: { [key: string]: number | string | CellModel }): void {
        args.width = getTextWidth(<string>args.char, (args.cell as CellModel).style, this.parent.cellStyle);
    }

    private rowFillHandler(args: { cell: CellModel, cellEle: HTMLElement, rowIdx: number, colIdx: number, beforeFillText?: string,
        repeatChar?: string, afterFillText?: string, formattedText?: string, updateFillSize?: boolean, iconSetSpan?: HTMLElement }): void {
        const cellElem: HTMLElement = args.cellEle;
        if (cellElem) {
            let repeatCharSpan: HTMLElement;
            let endCol: number = args.colIdx;
            if (args.cell.colSpan > 1) {
                const mergeArgs: MergeArgs = { range: [args.rowIdx, args.colIdx, args.rowIdx, args.colIdx] };
                this.parent.notify(activeCellMergedRange, mergeArgs);
                endCol = mergeArgs.range[3] as number;
            }
            let cellWidth: number = getExcludedColumnWidth(this.parent.getActiveSheet(), args.rowIdx, args.colIdx, endCol);
            const iconSetSpan: HTMLElement = args.iconSetSpan || cellElem.querySelector('.e-iconsetspan');
            if (iconSetSpan) {
                cellWidth -= iconSetSpan.getBoundingClientRect().width;
            }
            if (args.updateFillSize) {
                repeatCharSpan = cellElem.querySelector('.e-fill');
                if (!repeatCharSpan || !repeatCharSpan.textContent) {
                    return;
                }
                args.repeatChar = repeatCharSpan.textContent[0];
                const beforeSpan: HTMLElement = cellElem.querySelector('.e-fill-before');
                if (beforeSpan) {
                    cellWidth -= getTextWidth(beforeSpan.textContent, args.cell.style, this.parent.cellStyle);
                }
                const textSpan: HTMLElement = cellElem.querySelector('.e-fill-sec');
                if (textSpan) {
                    cellWidth -= getTextWidth(textSpan.textContent, args.cell.style, this.parent.cellStyle);
                }
            } else {
                const noteIndicator: HTMLElement = cellElem.querySelector('.e-addNoteIndicator');
                cellElem.innerText = '';
                if (args.beforeFillText) {
                    const beforeSpan: HTMLElement = this.parent.createElement(
                        'span', { className: 'e-fill-before', styles: `float: ${this.parent.enableRtl ? 'right' : 'left'}` });
                    beforeSpan.innerText = args.beforeFillText;
                    cellElem.appendChild(beforeSpan);
                    cellWidth -= getTextWidth(args.beforeFillText, args.cell.style, this.parent.cellStyle);
                }
                repeatCharSpan = this.parent.createElement('span', { className: 'e-fill' });
                cellElem.appendChild(repeatCharSpan);
                if (args.afterFillText) {
                    const textSpan: HTMLElement = this.parent.createElement('span', { className: 'e-fill-sec' });
                    textSpan.innerText = args.afterFillText;
                    cellElem.appendChild(textSpan);
                    cellWidth -= getTextWidth(args.afterFillText, args.cell.style, this.parent.cellStyle);
                }
                if (iconSetSpan) {
                    cellElem.insertBefore(iconSetSpan, cellElem.childNodes[0]);
                }
                if (noteIndicator) {
                    cellElem.appendChild(noteIndicator);
                }
            }
            const repeatCharWidth: number = getTextWidth(args.repeatChar, args.cell.style, this.parent.cellStyle);
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
