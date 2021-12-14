import { closest, Browser } from '@syncfusion/ej2-base';
import { ClickEventArgs } from '@syncfusion/ej2-navigations';
import { Spreadsheet } from '../base/spreadsheet';
import { ribbonClick, inView, setMaxHgt, getMaxHgt, WRAPTEXT, setRowEleHeight, rowHeightChanged, beginAction } from '../common/index';
import { completeAction, BeforeWrapEventArgs, getLines, getExcludedColumnWidth, getTextHeightWithBorder } from '../common/index';
import { positionAutoFillElement, colWidthChanged } from '../common/index';
import { SheetModel, getCell, CellModel, wrap as wrapText, wrapEvent, getRow, getRowsHeight, Workbook } from '../../workbook/index';
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
        this.parent.on(colWidthChanged, this.colWidthChanged, this);
    }

    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(ribbonClick, this.ribbonClickHandler);
            this.parent.off(wrapEvent, this.wrapTextHandler);
            this.parent.off(rowHeightChanged, this.rowHeightChangedHandler);
            this.parent.off(colWidthChanged, this.colWidthChanged);
        }
    }

    private wrapTextHandler(
        args: {
            range: number[], wrap: boolean, sheet: SheetModel, initial: boolean, td: Element, row: HTMLElement,
            hRow: HTMLElement, isCustomHgt?: boolean
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
                isCustomHgt = getRow(args.sheet, i).customHeight || args.isCustomHgt;
                for (let j: number = args.range[1]; j <= args.range[3]; j++) {
                    cell = getCell(i, j, args.sheet, null, true);
                    if (cell.rowSpan < 0 || cell.colSpan < 0) { continue; }
                    const isMerge: boolean = (cell.rowSpan > 1 || cell.colSpan > 1);
                    ele = args.initial ? args.td : this.parent.getCell(i, j);
                    if (ele) {
                        if (args.wrap) {
                            ele.classList.add(WRAPTEXT);
                        } else {
                            ele.classList.remove(WRAPTEXT);
                        }
                        if (isCustomHgt || isMerge) {
                            if (ele.children.length === 0 || !ele.querySelector('.e-wrap-content')) {
                                let styleText: string = (ele as HTMLElement).style.cssText;
                                if (styleText) {
                                    styleText = styleText.split(';').filter((text: string) => !text.includes('border')).join(';');
                                }
                                ele.innerHTML
                                    = this.parent.createElement('span', {
                                        className: 'e-wrap-content',
                                        innerHTML: ele.innerHTML,
                                        styles: styleText
                                    }).outerHTML;
                            }
                        }
                    }
                    if (Browser.isIE) {
                        ele.classList.add('e-ie-wrap');
                    }
                    if (!(isCustomHgt || isMerge)) {
                        colwidth = getExcludedColumnWidth(args.sheet, i, j, cell.colSpan > 1 ? j + cell.colSpan - 1 : j);
                        let displayText: string = this.parent.getDisplayText(cell).toString();
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
                                hgt = getTextHeightWithBorder(
                                    this.parent as Workbook, i, j, args.sheet, cell.style || this.parent.cellStyle, lines);
                                maxHgt = Math.max(maxHgt, hgt);
                                if (cell.rowSpan > 1) {
                                    const prevHeight: number = getRowsHeight(args.sheet, i, i + (cell.rowSpan - 1));
                                    if (prevHeight >= maxHgt) { return; }
                                    hgt = maxHgt = getRowHeight(args.sheet, i) + (maxHgt - prevHeight);
                                }
                                setMaxHgt(args.sheet, i, j, hgt);
                            } else {
                                if (displayText.indexOf('\n') > -1) {
                                    ele.classList.add('e-alt-unwrap');
                                }
                                hgt = getTextHeightWithBorder(
                                    this.parent as Workbook, i, j, args.sheet, cell.style || this.parent.cellStyle, 1);
                                setMaxHgt(args.sheet, i, j, hgt);
                                maxHgt = Math.max(getMaxHgt(args.sheet, i), 20);
                            }
                        } else if (!args.wrap || !displayText) {
                            setMaxHgt(args.sheet, i, j, 20);
                            maxHgt = Math.max(getMaxHgt(args.sheet, i), 20);
                        }
                        if (j === args.range[3] && ((args.wrap && maxHgt > 20 && getMaxHgt(args.sheet, i) <= maxHgt) || ((!args.wrap ||
                            !displayText) && getMaxHgt(args.sheet, i) < getRowHeight(args.sheet, i) && getRowHeight(args.sheet, i) > 20))) {
                            setRowEleHeight(this.parent, args.sheet, maxHgt, i, args.row, args.hRow);
                        }
                    }
                    if (isCustomHgt && !isMerge) {
                        const displayText: string = this.parent.getDisplayText(cell);
                        if (args.wrap) {
                            if (ele && ele.classList.contains('e-alt-unwrap')) {
                                ele.classList.remove('e-alt-unwrap');
                            }
                        }
                        else {
                            if (displayText.indexOf('\n') > -1) {
                                ele.classList.add('e-alt-unwrap');
                            }
                        }
                    }
                }
            }
            this.parent.notify(positionAutoFillElement, null);
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
                wrapText(this.parent.getActiveSheet().selectedRange, wrap, this.parent as Workbook);
                this.parent.notify(completeAction, { action: 'wrap', eventArgs: { address: address, wrap: wrap } });
            }
        }
    }

    private rowHeightChangedHandler(args: { rowIdx: number, isCustomHgt: boolean }): void {
        if (args.isCustomHgt) {
            const sheet: SheetModel = this.parent.getActiveSheet();
            for (let i: number = this.parent.viewport.leftIndex, len: number = this.parent.viewport.rightIndex; i <= len; i++) {
                if (getCell(args.rowIdx, i, sheet, false, true).wrap) {
                    this.updateWrapCell(this.parent.getCell(args.rowIdx, i));
                }
            }
        }
    }
    private colWidthChanged(args: { colIdx: number, checkWrapCell: boolean }): void {
        if (args.checkWrapCell) {
            const sheet: SheetModel = this.parent.getActiveSheet();
            for (let i: number = this.parent.viewport.topIndex, len: number = this.parent.viewport.bottomIndex; i <= len; i++) {
                if (getCell(i, args.colIdx, sheet, false, true).wrap) {
                    this.updateWrapCell(this.parent.getCell(i, args.colIdx));
                }
            }
        }
    }
    private updateWrapCell(ele: Element): void {
        if (ele && (ele.children.length === 0 || !ele.querySelector('.e-wrap-content'))) {
            ele.innerHTML = this.parent.createElement(
                'span', { className: 'e-wrap-content', innerHTML: ele.innerHTML, styles: (ele as HTMLElement).style.cssText }).outerHTML;
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
