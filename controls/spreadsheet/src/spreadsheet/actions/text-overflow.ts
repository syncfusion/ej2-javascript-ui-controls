import { Spreadsheet } from '../index';
import { isNullOrUndefined, detach } from '@syncfusion/ej2-base';
import { textOverflow, getBorderWidth, CellRenderArgs, WRAPTEXT, getTextWidth, restoreOverflowGrid, refreshOverflowCell, colWidthChanged } from '../common/index';
import { CellModel, SheetModel, getCell } from '../../workbook/base/index';
import { isHiddenCol, getColumnWidth, FontWeight, FontStyle, skipDefaultValue } from '../../workbook/index';
import { CellStyleModel, VerticalAlign, FontFamily, CellStyleExtendedModel } from '../../workbook/common/index';

/**
 * Represents Text Overflow support for Spreadsheet.
 */
export class TextOverflow {
    private parent: Spreadsheet;

    /**
     * Constructor for the Spreadsheet Text Overflow module.
     *
     * @param {Spreadsheet} parent - Specifies the Spreadsheet.
     * @private
     */
    constructor(parent: Spreadsheet) {
        this.parent = parent;
        this.addEventListener();
    }

    private addEventListener(): void {
        this.parent.on(textOverflow, this.handleTextOverflow, this);
        this.parent.on(restoreOverflowGrid, this.restoreOverflowGridLines, this);
        this.parent.on(refreshOverflowCell, this.colWidthChanged, this);
        this.parent.on(colWidthChanged, this.colWidthChanged, this);
    }

    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(textOverflow, this.handleTextOverflow);
            this.parent.off(restoreOverflowGrid, this.restoreOverflowGridLines);
            this.parent.off(refreshOverflowCell, this.colWidthChanged);
            this.parent.off(colWidthChanged, this.colWidthChanged);
        }
    }

    private handleTextOverflow(args: { sheet: SheetModel, cellArgs: CellRenderArgs, isRefresh: boolean, oldValue?: string }): void {
        const sheet: SheetModel = args.sheet;
        const cellArgs: CellRenderArgs = args.cellArgs;
        const isRefresh: boolean = args.isRefresh;
        const td: HTMLTableCellElement = cellArgs.td;
        if (!td || !cellArgs.cell) { return; }
        if (cellArgs.cell.wrap || cellArgs.cell.chart || cellArgs.cell.image ||
            td.classList.contains('e-cell-template') || td.classList.contains('e-wraptext') ||
            td.classList.contains('e-right-align') || td.classList.contains('e-center-align')) {
            this.removeTextOverflowCls(td);
            if (isRefresh) {
                this.updateOverflowCells(sheet, cellArgs.rowIdx, cellArgs.colIdx, isRefresh);
            }
            return;
        }
        const text: string = this.getOverflowText(cellArgs.cell, td);
        const style: CellStyleModel = this.getOverflowStyle(cellArgs.cell);
        const cellWidth: number = getColumnWidth(sheet, cellArgs.colIdx, true);
        if (args.oldValue) {
            this.restoreOverflowGridLines({ sheet: sheet, rowIdx: cellArgs.rowIdx, colIdx: cellArgs.colIdx,
                oldValue: args.oldValue, style: style
            });
        }
        if (!text || text.includes('\n')) {
            this.removeTextOverflowCls(td);
            if (isRefresh) {
                this.updateOverflowCells(sheet, cellArgs.rowIdx, cellArgs.colIdx, isRefresh);
            }
            return;
        }
        let textWidth: number;
        if (cellArgs.cell.richText && cellArgs.cell.richText.length) {
            const richTextContainer: HTMLElement = (td.querySelector('.e-overflow-content') as HTMLElement) ||
            (td.querySelector('.e-hyperlink') as HTMLElement) ||
            (td.querySelector('.e-wrap-content') as HTMLElement) || td;
            textWidth = this.getRichTextWidth(richTextContainer, style);
        } else {
            textWidth = getTextWidth(text, style, this.parent.cellStyle);
        }
        if (textWidth <= cellWidth) {
            this.removeTextOverflowCls(td);
            if (isRefresh) {
                this.updateOverflowCells(sheet, cellArgs.rowIdx, cellArgs.colIdx, isRefresh);
            }
            return;
        }
        this.updateOverflowCells(sheet, cellArgs.rowIdx, cellArgs.colIdx, isRefresh);
        this.applyTextOverflowCalc(sheet, cellArgs, textWidth, cellWidth, isRefresh);
    }

    private updateOverflowCells(sheet: SheetModel, rowIdx: number, colIdx: number, isRefresh: boolean): void {
        for (let i: number = colIdx - 1; i >= 0; i--) {
            const prevCellTd: HTMLElement = this.parent.getCell(rowIdx, i);
            if (prevCellTd && prevCellTd.classList.contains('e-overflow-txt')) {
                const prevCell: CellModel = getCell(rowIdx, i, sheet);
                if (!prevCell) {
                    continue;
                }
                const text: string = this.getOverflowText(prevCell, prevCellTd as HTMLTableCellElement);
                if (!text || text.includes('\n')) {
                    continue;
                }
                const style: CellStyleModel = this.getOverflowStyle(prevCell);
                const prevCellWidth: number = getColumnWidth(sheet, i, true);
                let textWidth: number;
                if (prevCell.richText && prevCell.richText.length) {
                    const textContainer: HTMLElement = (prevCellTd.querySelector('.e-overflow-content') as HTMLElement) ||
                    (prevCellTd.querySelector('.e-hyperlink') as HTMLElement) ||
                    (prevCellTd.querySelector('.e-wrap-content') as HTMLElement) || prevCellTd;
                    textWidth = this.getRichTextWidth(textContainer, style);
                } else {
                    textWidth = getTextWidth(text, style, this.parent.cellStyle);
                }
                if (textWidth > prevCellWidth) {
                    this.applyTextOverflowCalc(sheet, { rowIdx, colIdx: i,
                        td: prevCellTd as HTMLTableCellElement, cell: prevCell }, textWidth, prevCellWidth, isRefresh);
                    break;
                }
            }
        }
    }

    private restoreOverflowGridLines(args: { sheet: SheetModel; rowIdx: number; colIdx: number;
        oldValue: string; style: CellStyleModel; }): void {
        let style: CellStyleModel = args.style;
        if (!style) {
            const cell: CellModel = getCell(args.rowIdx, args.colIdx, args.sheet);
            style = this.getOverflowStyle(cell);
        }
        const cellWidth: number = getColumnWidth(args.sheet, args.colIdx, true);
        const oldTextWidth: number = getTextWidth(args.oldValue, style, this.parent.cellStyle);
        if (oldTextWidth <= cellWidth) {
            return;
        }
        let oldWidth: number = cellWidth;
        for (let i: number = args.colIdx; i < args.sheet.colCount; i++) {
            if (i > args.colIdx) {
                const cell: CellModel = getCell(args.rowIdx, i, args.sheet);
                if (cell && ((!isNullOrUndefined(cell.value) && cell.value !== '') ||
                    (!isNullOrUndefined(cell.formula) && cell.formula !== ''))) {
                    break;
                }
                oldWidth += getColumnWidth(args.sheet, i, true);
            }
            const td: HTMLElement = this.parent.getCell(args.rowIdx, i);
            if (td) {
                td.classList.remove('e-overflow-gridline');
            }
            if (oldTextWidth <= oldWidth) {
                break;
            }
        }
    }

    private removeTextOverflowCls(td: HTMLTableCellElement): void {
        td.classList.remove('e-overflow-txt');
        const span: HTMLElement = td.querySelector('.e-overflow-content') as HTMLElement;
        if (span) {
            while (span.firstChild) {
                (span.parentElement as HTMLElement).insertBefore(span.firstChild, span);
            }
            detach(span);
        }
    }

    private getOverflowText(cell: CellModel, td: HTMLTableCellElement): string {
        if (!isNullOrUndefined(cell.formattedText) && cell.formattedText !== '') {
            return cell.formattedText.toString();
        }
        if (!isNullOrUndefined(cell.value)) {
            return cell.value.toString();
        }
        return td.textContent || '';
    }

    private getOverflowStyle(cell: CellModel): CellStyleModel {
        if (!cell) {
            return <CellStyleModel>{};
        }
        if (cell && cell.style && (cell.style as CellStyleExtendedModel).properties) {
            return skipDefaultValue(cell.style, true);
        }
        return cell.style || <CellStyleModel>{};
    }

    private colWidthChanged(args: { colIdx: number, checkOverflowCell?: boolean }): void {
        if (args.checkOverflowCell) {
            const sheet: SheetModel = this.parent.getActiveSheet();
            for (let rowIdx: number = this.parent.viewport.topIndex; rowIdx <= this.parent.viewport.bottomIndex; rowIdx++) {
                for (let colIdx: number = args.colIdx; colIdx >= 0; colIdx--) {
                    const td: HTMLElement = this.parent.getCell(rowIdx, colIdx);
                    if (!td) { continue; }
                    if (td.classList.contains('e-overflow-gridline')) {
                        td.classList.remove('e-overflow-gridline');
                    }
                    const cell: CellModel = getCell(rowIdx, colIdx, sheet);
                    if (td.classList.contains('e-overflow-txt')) {
                        for (let k: number = args.colIdx + 1; k <= this.parent.viewport.rightIndex; k++) {
                            const nextCell: CellModel = getCell(rowIdx, k, sheet);
                            const nextTd: HTMLElement = this.parent.getCell(rowIdx, k);
                            if (nextCell && ((!isNullOrUndefined(nextCell.value) && nextCell.value !== '') ||
                                (!isNullOrUndefined(nextCell.formula) && nextCell.formula !== ''))) {
                                break;
                            }
                            if (nextTd && nextTd.classList.contains('e-overflow-gridline')) {
                                nextTd.classList.remove('e-overflow-gridline');
                                continue;
                            }
                            break;
                        }
                        if (cell) {
                            const cellArgs: CellRenderArgs = { rowIdx, colIdx, td: td as HTMLTableCellElement, cell };
                            this.handleTextOverflow({ sheet, cellArgs: cellArgs, isRefresh: true });
                        }
                        break;
                    }
                    if (cell && ((!isNullOrUndefined(cell.value) && cell.value !== '') ||
                        (!isNullOrUndefined(cell.formula) && cell.formula !== ''))) {
                        break;
                    }
                }
            }
        }
    }

    private applyTextOverflowCalc(sheet: SheetModel, args: CellRenderArgs, textWidth: number, cellWidth: number, isRefresh: boolean): void {
        const td: HTMLTableCellElement = args.td;
        const colIdx: number = args.colIdx;
        let availableWidth: number = cellWidth;
        let hasBoundary: boolean = false;
        let boundaryColIdx: number = -1;
        let lastOverflowColIdx: number = colIdx;
        let textEndColIdx: number = colIdx;
        let textEndWidth: number = cellWidth;
        const isMergedCell: boolean = !!(args.cell && args.cell.colSpan > 1);
        if (isMergedCell) {
            for (let i: number = colIdx + 1; i < colIdx + args.cell.colSpan; i++) {
                availableWidth += getColumnWidth(sheet, i, true);
            }
            hasBoundary = true;
            boundaryColIdx = colIdx + args.cell.colSpan;
        } else {
            for (let i: number = colIdx + 1; i < sheet.colCount; i++) {
                textEndWidth += getColumnWidth(sheet, i, true);
                textEndColIdx = i;
                if (textWidth <= textEndWidth) {
                    break;
                }
            }
            for (let i: number = colIdx + 1; i < sheet.colCount; i++) {
                if (isHiddenCol(sheet, i)) {
                    continue;
                }
                const cell: CellModel = getCell(args.rowIdx, i, sheet);
                if (cell && ((!isNullOrUndefined(cell.value) && cell.value !== '') ||
                    (!isNullOrUndefined(cell.formula) && cell.formula !== ''))) {
                    hasBoundary = true;
                    boundaryColIdx = i;
                    break;
                }
                if (cell && ((!isNullOrUndefined(cell.colSpan) && cell.colSpan !== 1) ||
                    (!isNullOrUndefined(cell.rowSpan) && cell.rowSpan !== 1))) {
                    hasBoundary = true;
                    boundaryColIdx = i;
                    break;
                }
                const frozenColCount: number = this.parent.frozenColCount(sheet);
                if (frozenColCount && ((colIdx < frozenColCount && i >= frozenColCount) ||
                    (colIdx >= frozenColCount && i < frozenColCount))) {
                    hasBoundary = true;
                    boundaryColIdx = i;
                    break;
                }
                availableWidth += getColumnWidth(sheet, i, true);
                lastOverflowColIdx = i;
                if (textWidth <= availableWidth) {
                    break;
                }
            }
        }
        if (hasBoundary) {
            let skipRestoreUntilColIdx: number = -1;
            const boundaryTd: HTMLElement = this.parent.getCell(args.rowIdx, boundaryColIdx);
            if (boundaryTd && boundaryTd.classList.contains('e-overflow-txt')) {
                const boundaryCell: CellModel = getCell(args.rowIdx, boundaryColIdx, sheet);
                if (boundaryCell) {
                    const boundaryText: string = this.getOverflowText(boundaryCell, boundaryTd as HTMLTableCellElement);
                    const boundaryStyle: CellStyleModel = this.getOverflowStyle(boundaryCell);
                    const boundaryTextWidth: number = getTextWidth(boundaryText, boundaryStyle, this.parent.cellStyle);
                    let boundaryAvailableWidth: number = getColumnWidth(sheet, boundaryColIdx, true);
                    skipRestoreUntilColIdx = boundaryColIdx;
                    for (let j: number = boundaryColIdx + 1; j < sheet.colCount; j++) {
                        boundaryAvailableWidth += getColumnWidth(sheet, j, true);
                        skipRestoreUntilColIdx = j;
                        if (boundaryTextWidth <= boundaryAvailableWidth) {
                            break;
                        }
                    }
                }
            }
            const restoreStartIdx: number = Math.max(colIdx, boundaryColIdx - 1);
            for (let i: number = restoreStartIdx; i <= textEndColIdx; i++) {
                if (i >= boundaryColIdx && i <= skipRestoreUntilColIdx) {
                    continue;
                }
                const restoreTd: HTMLElement = this.parent.getCell(args.rowIdx, i);
                if (restoreTd) {
                    restoreTd.classList.remove('e-overflow-gridline');
                }
            }
        }
        if (!isMergedCell) {
            const lastVisibleColIdx: number = hasBoundary ? boundaryColIdx - 1 : lastOverflowColIdx;
            for (let i: number = colIdx; i < lastVisibleColIdx; i++) {
                if (!isRefresh) {
                    setTimeout((): void => {
                        if (!this.parent || this.parent.isDestroyed) { return; }
                        const overflowTd: HTMLElement = this.parent.getCell(args.rowIdx, i);
                        if (overflowTd) {
                            overflowTd.classList.add('e-overflow-gridline');
                        }
                    }, 0);
                } else {
                    const overflowTd: HTMLElement = this.parent.getCell(args.rowIdx, i);
                    if (overflowTd) {
                        overflowTd.classList.add('e-overflow-gridline');
                    }
                }
            }
        }
        td.classList.remove('e-overflow-txt');
        if (td.classList.contains(WRAPTEXT)) {
            td.classList.remove(WRAPTEXT);
        }
        td.classList.add('e-overflow-txt');
        if (hasBoundary) {
            let visibleWidth: number = availableWidth;
            visibleWidth -= 4;
            const lastVisibleColIdx: number = boundaryColIdx - 1;
            if (lastVisibleColIdx >= colIdx) {
                visibleWidth -= getBorderWidth(args.rowIdx, lastVisibleColIdx, sheet);
            }
            const hiddenWidth: number = Math.max(0, textWidth - visibleWidth);
            let span: HTMLElement = td.querySelector('.e-overflow-content') as HTMLElement;
            if (!span) {
                span = document.createElement('span');
                span.className = 'e-overflow-content';
                const contentRoot: HTMLElement = (td.querySelector('.e-overflow-content') as HTMLElement) ||
                    (td.querySelector('.e-hyperlink') as HTMLElement) ||
                    (td.querySelector('.e-wrap-content') as HTMLElement) || td;
                const hasRichTextNodes: boolean = Array.from(contentRoot.childNodes).some((ch: Node) =>
                    ch.nodeType === Node.ELEMENT_NODE &&
                        (ch as HTMLElement).tagName === 'SPAN' &&
                        (!(ch as HTMLElement).className ||
                            (ch as HTMLElement).classList.contains('e-vert-sub') ||
                            (ch as HTMLElement).classList.contains('e-vert-super'))
                );
                if (hasRichTextNodes) {
                    const filterBtn: Element = td.querySelector('.e-filter-btn');
                    const children: Node[] = Array.prototype.slice.call(contentRoot.childNodes);
                    for (const ch of children) {
                        if (ch === filterBtn) { continue; }
                        if (ch.nodeType === 1 && !isNullOrUndefined((ch as HTMLElement).className) &&
                            ((ch as HTMLElement).className.indexOf('e-addNoteIndicator') > -1 ||
                                (ch as HTMLElement).className.indexOf('e-comment-indicator') > -1)) { continue; }
                        span.appendChild(ch);
                    }
                } else {
                    span.textContent = td.querySelector('.e-validation-list') ?
                        (contentRoot.innerText || '') : (contentRoot.textContent || '');
                    contentRoot.textContent = '';
                }
                contentRoot.appendChild(span);
                const filterBtn: Element = td.querySelector('.e-filter-btn');
                if (filterBtn) { td.appendChild(filterBtn); }
                const noteEl: Element = td.querySelector('.e-addNoteIndicator');
                if (noteEl) { td.appendChild(noteEl); }
                const commentEl: Element = td.querySelector('.e-comment-indicator');
                if (commentEl) { td.appendChild(commentEl); }
            }
            if (this.parent.enableRtl) {
                span.style.clipPath = `inset(0 0 0 ${hiddenWidth}px)`;
            } else {
                span.style.clipPath = `inset(0 ${hiddenWidth}px 0 0)`;
            }
        } else {
            const span: HTMLElement = td.querySelector('.e-overflow-content') as HTMLElement;
            if (span) {
                while (span.firstChild) {
                    (span.parentElement as HTMLElement).insertBefore(span.firstChild, span);
                }
                detach(span);
            }
        }
    }

    private getRichTextWidth(container: HTMLElement, defaultStyle: CellStyleModel): number {
        let totalWidth: number = 0;
        for (const node of Array.from(container.childNodes)) {
            if (node.nodeType === Node.TEXT_NODE) {
                const text: string = node.textContent || '';
                if (text) {
                    totalWidth += getTextWidth(text, defaultStyle, this.parent.cellStyle);
                }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                const element: HTMLElement = node as HTMLElement;
                const computedStyle: CSSStyleDeclaration = window.getComputedStyle(element);
                const style: CellStyleModel = {
                    fontFamily: computedStyle.fontFamily as FontFamily,
                    fontSize: computedStyle.fontSize,
                    fontWeight: computedStyle.fontWeight as FontWeight,
                    fontStyle: computedStyle.fontStyle as FontStyle,
                    verticalAlign: computedStyle.verticalAlign as VerticalAlign
                };
                totalWidth += getTextWidth(element.textContent || '', style, this.parent.cellStyle);
            }
        }
        return totalWidth;
    }

    /**
     * For internal use only - Get the module name.
     *
     * @returns {string} - Get the module name.
     * @private
     */
    protected getModuleName(): string {
        return 'textOverflow';
    }

    /**
     * Removes the added event handlers and clears the internal properties of Text Overflow module.
     *
     * @returns {void}
     */
    public destroy(): void {
        this.removeEventListener();
        this.parent = null;
    }
}
