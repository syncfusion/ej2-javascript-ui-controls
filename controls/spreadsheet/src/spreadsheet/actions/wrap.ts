import { closest, Browser } from '@syncfusion/ej2-base';
import { ClickEventArgs } from '@syncfusion/ej2-navigations';
import { Spreadsheet } from '../base/spreadsheet';
import { ribbonClick, inView, setMaxHgt, getMaxHgt, WRAPTEXT, setRowEleHeight, rowHeightChanged } from '../common/index';
import { completeAction, BeforeWrapEventArgs, getLines, getExcludedColumnWidth, getTextHeightWithBorder } from '../common/index';
import { positionAutoFillElement, colWidthChanged, getLineHeight } from '../common/index';
import { SheetModel, getCell, CellModel, wrap as wrapText, wrapEvent, getRow, getRowsHeight, Workbook, ApplyCFArgs, applyCF } from '../../workbook/index';
import { getRowHeight, getAddressFromSelectedRange, beginAction } from '../../workbook/index';


/**
 * Represents Wrap Text support for Spreadsheet.
 */
export class WrapText {
    private parent: Spreadsheet;
    private wrapCell: HTMLElement;

    /**
     * Constructor for the Spreadsheet Wrap Text module.
     *
     * @param {Spreadsheet} parent - Specifies the Spreadsheet.
     * @private
     */
    constructor(parent: Spreadsheet) {
        this.parent = parent;
        this.wrapCell = this.parent.createElement('span', { className: 'e-wrap-content' });
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
        if (args.initial || inView(this.parent, args.range, true)) {
            let ele: HTMLElement; let cell: CellModel; let colwidth: number; let maxHgt: number; let hgt: number;
            let isCustomHgt: boolean; let rowCustomHeight: boolean; let lineHgt: number;
            for (let i: number = args.range[0]; i <= args.range[2]; i++) {
                maxHgt = 0;
                rowCustomHeight = getRow(args.sheet, i).customHeight;
                isCustomHgt = rowCustomHeight || args.isCustomHgt;
                for (let j: number = args.range[1]; j <= args.range[3]; j++) {
                    cell = getCell(i, j, args.sheet, null, true);
                    if (cell.rowSpan < 0 || cell.colSpan < 0) { continue; }
                    const isMerge: boolean = (cell.rowSpan > 1 || cell.colSpan > 1);
                    ele = (args.initial ? args.td : this.parent.getCell(i, j)) as HTMLElement;
                    if (ele) {
                        if (args.wrap) {
                            lineHgt = getLineHeight(cell.style && cell.style.fontFamily ? cell.style : this.parent.cellStyle);
                            ele.classList.add(WRAPTEXT);
                        } else {
                            ele.classList.remove(WRAPTEXT); lineHgt = null;
                        }
                        if (isCustomHgt || isMerge) { this.updateWrapCell(i, j, args.sheet, ele); }
                    } else {
                        lineHgt = null;
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
                                        lines = getLines(splitVal[p as number], colwidth, cell.style, this.parent.cellStyle);
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
                                    this.parent as Workbook, i, j, args.sheet, cell.style || this.parent.cellStyle, lines, lineHgt);
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
                                    this.parent as Workbook, i, j, args.sheet, cell.style || this.parent.cellStyle, 1, lineHgt);
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
                            if (args.sheet.conditionalFormats && args.sheet.conditionalFormats.length) {
                                this.parent.notify(applyCF, <ApplyCFArgs>{ indexes: [i, j], isAction: true });
                            }
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
                    if (args.wrap && ele) {
                        if (!rowCustomHeight) {
                            ele.style.lineHeight = (parseFloat((cell.style && cell.style.fontSize) || this.parent.cellStyle.fontSize) *
                                lineHgt) + 'pt';
                        } else if (ele.style.lineHeight) {
                            ele.style.lineHeight = '';
                        }
                    } else if (ele) {
                        ele.style.lineHeight = '';
                    }
                }
            }
            if (!args.initial) {
                this.parent.notify(positionAutoFillElement, null);
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
                wrapText(this.parent.getActiveSheet().selectedRange, wrap, this.parent as Workbook);
                this.parent.notify(completeAction, { action: 'wrap', eventArgs: { address: address, wrap: wrap } });
            }
        }
    }

    private rowHeightChangedHandler(args: { rowIdx: number, isCustomHgt: boolean }): void {
        if (args.isCustomHgt) {
            const sheet: SheetModel = this.parent.getActiveSheet(); let ele: HTMLElement;
            for (let i: number = this.parent.viewport.leftIndex, len: number = this.parent.viewport.rightIndex; i <= len; i++) {
                if (getCell(args.rowIdx, i, sheet, false, true).wrap) {
                    ele = this.parent.getCell(args.rowIdx, i);
                    this.updateWrapCell(args.rowIdx, i, sheet, ele);
                    if (ele.style.lineHeight) { ele.style.lineHeight = ''; }
                }
            }
        }
    }
    private colWidthChanged(args: { colIdx: number, checkWrapCell: boolean }): void {
        if (args.checkWrapCell) {
            const sheet: SheetModel = this.parent.getActiveSheet();
            for (let i: number = this.parent.viewport.topIndex, len: number = this.parent.viewport.bottomIndex; i <= len; i++) {
                if (getCell(i, args.colIdx, sheet, false, true).wrap) {
                    this.updateWrapCell(i, args.colIdx, sheet, this.parent.getCell(i, args.colIdx));
                }
            }
        }
    }
    private updateWrapCell(rowIdx: number, colIdx: number, sheet: SheetModel, ele: Element): void {
        if (ele && !ele.querySelector('.e-wrap-content')) {
            const wrapSpan: HTMLElement = this.wrapCell.cloneNode() as HTMLElement;
            const filterBtn: Element = ele.querySelector('.e-filter-btn');
            while (ele.childElementCount) {
                wrapSpan.appendChild(ele.firstElementChild);
            }
            if (filterBtn) {
                if (ele.firstChild) {
                    ele.insertBefore(filterBtn, ele.firstChild);
                } else {
                    ele.appendChild(filterBtn);
                }
            }
            if (!getCell(rowIdx, colIdx, sheet, false, true).hyperlink) {
                const node: Node = ele.lastChild;
                if (node && node.nodeType === 3) {
                    wrapSpan.appendChild(document.createTextNode(node.textContent));
                    node.textContent = '';
                } else {
                    wrapSpan.appendChild(document.createTextNode(ele.textContent));
                    ele.textContent = '';
                }
            }
            ele.appendChild(wrapSpan);
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

    /**
     * Removes the added event handlers and clears the internal properties of WrapText module.
     *
     * @returns {void}
     */
    public destroy(): void {
        this.removeEventListener();
        this.wrapCell = null;
        this.parent = null;
    }
}
