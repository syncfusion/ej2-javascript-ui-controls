import { closest, Browser, isNullOrUndefined } from '@syncfusion/ej2-base';
import { ClickEventArgs } from '@syncfusion/ej2-navigations';
import { Spreadsheet } from '../base/spreadsheet';
import { ribbonClick, inView, setMaxHgt, getMaxHgt, WRAPTEXT, setRowEleHeight, rowHeightChanged, readonlyAlert } from '../common/index';
import { completeAction, BeforeWrapEventArgs, getLines, getExcludedColumnWidth, getTextHeightWithBorder } from '../common/index';
import { positionAutoFillElement, colWidthChanged, getLineHeight, updateWrapCell, ExtendedSpreadsheet } from '../common/index';
import { SheetModel, getCell, CellModel, wrap as wrapText, wrapEvent, getRow, getRowsHeight, Workbook, ApplyCFArgs, applyCF, RowModel, isReadOnlyCells } from '../../workbook/index';
import { getRowHeight, getAddressFromSelectedRange, beginAction, isHiddenRow, isHiddenCol } from '../../workbook/index';


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
        this.parent.on(updateWrapCell, this.updateWrapCell, this);
    }

    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(ribbonClick, this.ribbonClickHandler);
            this.parent.off(wrapEvent, this.wrapTextHandler);
            this.parent.off(rowHeightChanged, this.rowHeightChangedHandler);
            this.parent.off(colWidthChanged, this.colWidthChanged);
            this.parent.off(updateWrapCell, this.updateWrapCell);
        }
    }

    private wrapTextHandler(
        args: {
            range: number[], wrap: boolean, sheet: SheetModel, initial: boolean, td: Element, row: HTMLElement,
            hRow: HTMLElement, isCustomHgt?: boolean, isPublic?: boolean, outsideViewport?: boolean, isOtherAction?: boolean
        }): void {
        if (args.initial || inView(this.parent, args.range, true)) {
            if (args.isPublic && isReadOnlyCells(this.parent, args.range)) { return; }
            if (args.initial && !args.td && !args.outsideViewport && inView(this.parent, args.range, true)) {
                args.initial = false;
            }
            let ele: HTMLElement; let cell: CellModel; let colwidth: number; let maxHgt: number; let hgt: number;
            let isCustomHgt: boolean; let rowCustomHeight: boolean; let lineHgt: number; let row: RowModel; let visibleRow: boolean;
            const frozenRow: number = this.parent.frozenRowCount(args.sheet);
            let isLessStandardHgt: boolean; let filterRange: number[]; let hyperlinkEle: HTMLElement;
            if (!isNullOrUndefined(args.sheet.standardHeight) && args.sheet.standardHeight < 20) {
                isLessStandardHgt = true;
            } else {
                filterRange = this.parent.allowFiltering &&
                    (this.parent as ExtendedSpreadsheet).filterModule.filterRange.has(this.parent.activeSheetIndex) &&
                    (this.parent as ExtendedSpreadsheet).filterModule.filterRange.get(this.parent.activeSheetIndex).range;
            }
            for (let i: number = args.range[0]; i <= args.range[2]; i++) {
                maxHgt = 0;
                row = getRow(args.sheet, i);
                rowCustomHeight = row.customHeight;
                isCustomHgt = rowCustomHeight || args.isCustomHgt;
                visibleRow = !isHiddenRow(args.sheet, i);
                for (let j: number = args.range[1]; j <= args.range[3]; j++) {
                    cell = getCell(i, j, args.sheet, null, true);
                    if (cell.rowSpan < 0 || cell.colSpan < 0) { continue; }
                    const isMerge: boolean = cell.rowSpan > 1 || cell.colSpan > 1;
                    ele = args.initial ? <HTMLElement>args.td : (visibleRow && !isHiddenCol(args.sheet, j) && this.parent.getCell(i, j));
                    if (ele) {
                        if (args.wrap) {
                            lineHgt = getLineHeight(cell.style && cell.style.fontFamily ? cell.style : this.parent.cellStyle);
                            ele.classList.add(WRAPTEXT);
                        } else {
                            ele.classList.remove(WRAPTEXT); lineHgt = null;
                        }
                        if (isCustomHgt || isMerge || row.height < 20 || isLessStandardHgt ||
                            (filterRange && i === filterRange[0] && j >= filterRange[1] && j <= filterRange[3])) {
                            this.updateWrapCell({ rowIdx: i, colIdx: j, sheet: args.sheet, ele: ele });
                        }
                        if (Browser.isIE) {
                            ele.classList.add('e-ie-wrap');
                        }
                    } else {
                        lineHgt = null;
                    }
                    if (!(isCustomHgt || isMerge)) {
                        colwidth = getExcludedColumnWidth(args.sheet, i, j, cell.colSpan > 1 ? j + cell.colSpan - 1 : j);
                        let displayText: string = this.parent.getDisplayText(cell).toString();
                        if (this.parent.isEdit && ele && displayText.indexOf('\n') < 0) {
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
                                    if (displayText.includes('\n')) {
                                        hyperlinkEle = ele.querySelector('.e-hyperlink');
                                        if (hyperlinkEle && !hyperlinkEle.innerText.includes('\n')) {
                                            hyperlinkEle.innerText = displayText;
                                        }
                                    }
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
                                if (ele) {
                                    if (displayText.indexOf('\n') > -1) {
                                        ele.classList.add('e-alt-unwrap');
                                    }
                                    hyperlinkEle = ele.querySelector('.e-hyperlink');
                                    if (hyperlinkEle) {
                                        const hyperlinkText: string = hyperlinkEle.innerText;
                                        if (hyperlinkText.includes('\n')) {
                                            hyperlinkEle.innerText = hyperlinkText.split('\n').join(' ');
                                        }
                                    }
                                }
                                hgt = getTextHeightWithBorder(
                                    this.parent, i, j, args.sheet, cell.style || this.parent.cellStyle, 1, lineHgt);
                                setMaxHgt(args.sheet, i, j, hgt);
                                maxHgt = Math.max(getMaxHgt(args.sheet, i), 20);
                            }
                        } else if (!args.wrap || !displayText) {
                            setMaxHgt(args.sheet, i, j, 20);
                            maxHgt = Math.max(getMaxHgt(args.sheet, i), 20);
                        }
                        if (j === args.range[3]) {
                            const prevHgt: number = getRowHeight(args.sheet, i);
                            if ((args.wrap && (args.isOtherAction ? maxHgt >= 20 : maxHgt > 20) && getMaxHgt(args.sheet, i) <= maxHgt) ||
                                ((!args.wrap || !displayText) && getMaxHgt(args.sheet, i) < prevHgt && prevHgt > 20)) {
                                if (prevHgt !== maxHgt) {
                                    if (ele) {
                                        setRowEleHeight(this.parent, args.sheet, maxHgt, i, args.row, args.hRow, visibleRow);
                                        if (ele && args.sheet.conditionalFormats && args.sheet.conditionalFormats.length) {
                                            this.parent.notify(applyCF, <ApplyCFArgs>{ indexes: [i, j], isAction: true });
                                        }
                                    } else {
                                        setRowEleHeight(
                                            this.parent, args.sheet, maxHgt, i, null, null, visibleRow,
                                            !visibleRow || i > this.parent.viewport.bottomIndex ||
                                            (i >= frozenRow && i < this.parent.viewport.topIndex + frozenRow));
                                    }
                                }
                            }
                        }
                    } else if (isMerge && !args.wrap) {
                        if (cell.value && cell.value.toString().includes('\n')) {
                            ele.classList.add('e-alt-unwrap');
                        } else if (ele.classList.contains('e-alt-unwrap')) {
                            ele.classList.remove('e-alt-unwrap');
                        }
                    }
                    if (ele) {
                        if (isCustomHgt && !isMerge) {
                            const displayText: string = this.parent.getDisplayText(cell);
                            if (args.wrap) {
                                if (ele.classList.contains('e-alt-unwrap')) {
                                    ele.classList.remove('e-alt-unwrap');
                                }
                            }
                            else if (displayText.indexOf('\n') > -1) {
                                ele.classList.add('e-alt-unwrap');
                            }
                        }
                        if (args.wrap) {
                            if (!rowCustomHeight) {
                                ele.style.lineHeight = (parseFloat((cell.style && cell.style.fontSize) || this.parent.cellStyle.fontSize) *
                                    lineHgt) + 'pt';
                            } else if (ele.style.lineHeight) {
                                ele.style.lineHeight = '';
                            }
                        } else {
                            ele.style.lineHeight = '';
                        }
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
            if (isReadOnlyCells(this.parent)) {
                this.parent.notify(readonlyAlert, null);
                return;
            }
            this.parent.notify(beginAction, { action: 'beforeWrap', eventArgs: eventArgs });
            if (!eventArgs.cancel) {
                wrapText(this.parent.getActiveSheet().selectedRange, wrap, this.parent as Workbook);
                this.parent.notify(completeAction, { action: 'wrap', eventArgs: { address: address, wrap: wrap } });
            }
        }
    }

    private rowHeightChangedHandler(
        args: { rowIdx: number, isCustomHgt?: boolean, colIdx?: number, sheet?: SheetModel, ele?: HTMLElement }): void {
        if (args.isCustomHgt) {
            args.sheet = this.parent.getActiveSheet();
            for (let i: number = this.parent.viewport.leftIndex, len: number = this.parent.viewport.rightIndex; i <= len; i++) {
                if (getCell(args.rowIdx, i, args.sheet, false, true).wrap) {
                    args.colIdx = i;
                    args.ele = this.parent.getCell(args.rowIdx, i);
                    this.updateWrapCell(args);
                    if (args.ele.style.lineHeight) {
                        args.ele.style.lineHeight = '';
                    }
                }
            }
        }
    }
    private colWidthChanged(args: { colIdx: number, rowIdx?: number, checkWrapCell?: boolean, sheet?: SheetModel, ele?: Element }): void {
        if (args.checkWrapCell) {
            args.sheet = this.parent.getActiveSheet();
            for (let i: number = this.parent.viewport.topIndex, len: number = this.parent.viewport.bottomIndex; i <= len; i++) {
                if (getCell(i, args.colIdx, args.sheet, false, true).wrap) {
                    args.rowIdx = i;
                    args.ele = this.parent.getCell(i, args.colIdx);
                    this.updateWrapCell(args);
                }
            }
        }
    }
    private updateWrapCell(args: { rowIdx?: number, colIdx?: number, sheet?: SheetModel, ele?: Element }): void {
        if (args.ele && !args.ele.querySelector('.e-wrap-content')) {
            const wrapSpan: HTMLElement = this.wrapCell.cloneNode() as HTMLElement;
            const filterBtn: Element = args.ele.querySelector('.e-filter-btn');
            while (args.ele.childElementCount && !isNullOrUndefined(args.ele.firstElementChild) &&
                args.ele.firstElementChild.className.indexOf('e-addNoteIndicator') === -1) {
                wrapSpan.appendChild(args.ele.firstElementChild);
            }
            let nodeElement: HTMLElement;
            if (!isNullOrUndefined(args.ele.firstElementChild) && args.ele.firstElementChild.className.indexOf('e-addNoteIndicator') > -1) {
                nodeElement = args.ele.firstElementChild as HTMLElement;
            }
            if (filterBtn) {
                if (args.ele.firstChild) {
                    args.ele.insertBefore(filterBtn, args.ele.firstChild);
                } else {
                    args.ele.appendChild(filterBtn);
                }
            }
            if (!getCell(args.rowIdx, args.colIdx, args.sheet, false, true).hyperlink) {
                const node: Node = args.ele.lastChild;
                if (node && node.nodeType === 3) {
                    wrapSpan.appendChild(document.createTextNode(node.textContent));
                    node.textContent = '';
                } else {
                    wrapSpan.appendChild(document.createTextNode(args.ele.textContent));
                    args.ele.textContent = '';
                }
            }
            args.ele.appendChild(wrapSpan);
            if (!isNullOrUndefined(nodeElement)) {
                args.ele.appendChild(nodeElement);
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

    /**
     * Removes the added event handlers and clears the internal properties of WrapText module.
     *
     * @returns {void}
     */
    public destroy(): void {
        this.removeEventListener();
        if (this.wrapCell) { this.wrapCell.remove(); this.wrapCell = null; }
        this.parent = null;
    }
}
