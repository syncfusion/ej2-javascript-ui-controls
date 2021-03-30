import { closest, Browser } from '@syncfusion/ej2-base';
import { ClickEventArgs } from '@syncfusion/ej2-navigations';
import { Spreadsheet } from '../base/spreadsheet';
import { ribbonClick, inView, setMaxHgt, getMaxHgt, WRAPTEXT, setRowEleHeight, rowHeightChanged, beginAction } from '../common/index';
import { completeAction, BeforeWrapEventArgs, getTextHeight, getLines, getBorderHeight, getExcludedColumnWidth } from '../common/index';
import { SheetModel, getCell, CellModel, CellStyleModel, wrap as wrapText, wrapEvent, getRow } from '../../workbook/index';
import { getRowHeight, getAddressFromSelectedRange } from '../../workbook/index';


/**
 * Represents Wrap Text support for Spreadsheet.
 */
export class WrapText {
    private parent: Spreadsheet;

    /**
     * Constructor for the Spreadsheet Wrap Text module.
     *
     * @param {Spreadsheet} parent - Specifies the Spreadsheet.
     * @private
     */
    constructor(parent: Spreadsheet) {
        this.parent = parent;
        this.addEventListener();
    }

    private addEventListener(): void {
        this.parent.on(ribbonClick, this.ribbonClickHandler, this);
        this.parent.on(wrapEvent, this.wrapTextHandler, this);
        this.parent.on(rowHeightChanged, this.rowHeightChangedHandler, this);
    }

    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(ribbonClick, this.ribbonClickHandler);
            this.parent.off(wrapEvent, this.wrapTextHandler);
            this.parent.off(rowHeightChanged, this.rowHeightChangedHandler);
        }
    }

    private wrapTextHandler(
        args: {
            range: number[], wrap: boolean, sheet: SheetModel, initial: boolean, td: Element, row: HTMLElement,
            hRow: HTMLElement
        }): void {
        if (inView(this.parent, args.range, true)) {
            let ele: Element;
            let cell: CellModel;
            let colwidth: number;
            let isCustomHgt: boolean;
            let maxHgt: number;
            let hgt: number;
            for (let i: number = args.range[0]; i <= args.range[2]; i++) {
                maxHgt = 0;
                isCustomHgt = getRow(args.sheet, i).customHeight;
                for (let j: number = args.range[1]; j <= args.range[3]; j++) {
                    ele = args.initial ? args.td : this.parent.getCell(i, j);
                    if (ele) {
                        args.wrap ? ele.classList.add(WRAPTEXT) : ele.classList.remove(WRAPTEXT);
                        if (isCustomHgt) {
                            if (ele.children.length === 0 || !ele.querySelector('.e-wrap-content')) {
                                ele.innerHTML
                                    = this.parent.createElement('span', {
                                        className: 'e-wrap-content',
                                        innerHTML: ele.innerHTML
                                    }).outerHTML;
                            }
                        }
                    }
                    if (Browser.isIE) {
                        ele.classList.add('e-ie-wrap');
                    }
                    if (!isCustomHgt) {
                        cell = getCell(i, j, args.sheet);
                        colwidth = getExcludedColumnWidth(args.sheet, i, j, cell.colSpan > 1 ? j + cell.colSpan - 1 : j);
                        let displayText: string = this.parent.getDisplayText(cell);
                        if (displayText.indexOf('\n') < 0) {
                            const editElem: HTMLElement = this.parent.element.querySelector('.e-spreadsheet-edit');
                            if (editElem) {
                                if (editElem.textContent.indexOf('\n') > -1) {
                                    displayText = editElem.textContent;
                                }
                            }
                        }
                        if (displayText) {
                            if (args.wrap) {
                                if (ele && ele.classList.contains('e-alt-unwrap')) {
                                    ele.classList.remove('e-alt-unwrap');
                                }
                                let lines: number; let n: number = 0; let p: number;
                                if (displayText.indexOf('\n') > -1) {
                                    const splitVal: string[] = displayText.split('\n'); const valLength: number = splitVal.length;
                                    for (p = 0; p < valLength; p++) {
                                        lines = getLines(splitVal[p], colwidth, cell.style, this.parent.cellStyle);
                                        if (lines === 0) {
                                            lines = 1; // for empty new line
                                        }
                                        n = n + lines;
                                    }
                                    lines = n;
                                } else {
                                    lines = getLines(displayText, colwidth, cell.style, this.parent.cellStyle);
                                }
                                hgt = getTextHeight(this.parent, cell.style || this.parent.cellStyle, lines) + 1 +
                                    getBorderHeight(i, j, args.sheet);
                                maxHgt = Math.max(maxHgt, hgt);
                                setMaxHgt(args.sheet, i, j, hgt);
                            } else {
                                if (displayText.indexOf('\n') > -1) {
                                    ele.classList.add('e-alt-unwrap');
                                }
                                hgt = getTextHeight(this.parent, cell.style || this.parent.cellStyle, 1);
                                setMaxHgt(args.sheet, i, j, hgt);
                                maxHgt = Math.max(getMaxHgt(args.sheet, i), 20);
                            }
                        } else if (!args.wrap) {
                            setMaxHgt(args.sheet, i, j, 20);
                            maxHgt = 20;
                        }
                        if (j === args.range[3] && ((args.wrap && maxHgt > 20 && getMaxHgt(args.sheet, i) <= maxHgt) || (!args.wrap
                            && getMaxHgt(args.sheet, i) < getRowHeight(args.sheet, i) && getRowHeight(args.sheet, i) > 20))) {
                            setRowEleHeight(this.parent, args.sheet, maxHgt, i, args.row, args.hRow);
                        }
                    }
                }
            }
        }
    }
    private ribbonClickHandler(args: ClickEventArgs): void {
        const target: Element = closest(args.originalEvent.target as Element, '.e-btn');
        if (target && target.id === this.parent.element.id + '_wrap') {
            const wrap: boolean = target.classList.contains('e-active');
            const address: string = getAddressFromSelectedRange(this.parent.getActiveSheet());
            const eventArgs: BeforeWrapEventArgs = { address: address, wrap: wrap, cancel: false };
            this.parent.notify(beginAction, { action: 'beforeWrap', eventArgs: eventArgs });
            if (!eventArgs.cancel) {
                wrapText(this.parent.getActiveSheet().selectedRange, wrap, this.parent);
                this.parent.notify(completeAction, { action: 'wrap', eventArgs: { address: address, wrap: wrap } });
            }
        }
    }

    private rowHeightChangedHandler(args: { rowIdx: number, isCustomHgt: boolean }): void {
        if (args.isCustomHgt) {
            const sheet: SheetModel = this.parent.getActiveSheet();
            const leftIdx: number = this.parent.viewport.leftIndex;
            const rightIdx: number = leftIdx + this.parent.viewport.colCount + this.parent.getThreshold('col') * 2;
            for (let i: number = leftIdx; i < rightIdx; i++) {
                const cell: CellModel = getCell(args.rowIdx, i, sheet);
                if (cell && cell.wrap) {
                    const ele: Element = this.parent.getCell(args.rowIdx, i);
                    if (ele.children.length === 0 || !ele.querySelector('.e-wrap-content')) {
                        ele.innerHTML = this.parent.createElement('span', {
                            className: 'e-wrap-content',
                            innerHTML: ele.innerHTML
                        }).outerHTML;
                    }
                }
            }
        }
    }
    /**
     * For internal use only - Get the module name.
     *
     * @returns {string} - Get the module name.
     * @private
     */
    protected getModuleName(): string {
        return 'wrapText';
    }

    public destroy(): void {
        this.removeEventListener();
        this.parent = null;
    }
}
