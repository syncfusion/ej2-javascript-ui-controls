import { getDPRValue, hideAutoFillElement, hideAutoFillOptions, positionAutoFillElement, Spreadsheet } from '../index';
import { closest, detach, EventHandler, initializeCSPTemplate, isNullOrUndefined } from '@syncfusion/ej2-base';
import { Tooltip } from '@syncfusion/ej2-popups';
import { colWidthChanged, rowHeightChanged, contentLoaded, getFilterRange, getTextWidth, getExcludedColumnWidth, readonlyAlert, IRenderer } from '../common/index';
import { setResize, autoFit, HideShowEventArgs, completeAction, setAutoFit, refreshFilterCellsOnResize } from '../common/index';
import { setRowHeight, isHiddenRow, SheetModel, getRowHeight, getColumnWidth, setColumn, isHiddenCol, getSheet, ColumnModel, RowModel, getRow } from '../../workbook/base/index';
import { getColumn, setRow, getCell, CellModel } from '../../workbook/base/index';
import { getRangeIndexes, getSwapRange, CellStyleModel, getCellIndexes, setMerge, MergeArgs, isRowSelected, beginAction, isReadOnlyCells } from '../../workbook/common/index';
import { getFormattedCellObject, hideShow, NumberFormatArgs } from '../../workbook/common/index';
import { propertyChange } from '../common/index';

/**
 * The `Resize` module is used to handle the resizing functionalities in Spreadsheet.
 */
export class Resize {
    private parent: Spreadsheet;
    private trgtEle: HTMLElement;
    private event: MouseEvent;
    private isMouseMoved: boolean;

    /**
     * Constructor for resize module in Spreadsheet.
     *
     * @param {Spreadsheet} parent - Constructor for resize module in Spreadsheet.
     * @private
     */
    constructor(parent: Spreadsheet) {
        this.parent = parent;
        this.addEventListener();
    }

    private addEventListener(): void {
        this.parent.on(contentLoaded, this.wireEvents, this);
        this.parent.on(autoFit, this.autoFit, this);
        this.parent.on(setAutoFit, this.setAutoFitHandler, this);
        this.parent.on(propertyChange, this.propertyChange, this);
    }

    private autoFit(args: { isRow: boolean, startIndex: number, endIndex: number }): void {
        const element: Element = args.isRow ? this.parent.getRowHeaderTable() : this.parent.getColHeaderTable().rows[0];
        for (let i: number = args.startIndex; i <= args.endIndex; i++) {
            this.trgtEle = args.isRow ? this.parent.getRow(i, <HTMLTableElement>element) :
                this.parent.getCell(null, i, <HTMLTableRowElement>element);
            this.setAutofit(i, !args.isRow);
        }
    }

    private wireEvents(): void {
        const rowHeader: Element = this.parent.getRowHeaderContent();
        const colHeader: Element = this.parent.element.getElementsByClassName('e-header-panel')[0];
        if (!colHeader) {
            return;
        }
        EventHandler.add(colHeader, 'dblclick', this.dblClickHandler, this);
        EventHandler.add(rowHeader, 'dblclick', this.dblClickHandler, this);
        EventHandler.add(colHeader, 'mousedown', this.mouseDownHandler, this);
        EventHandler.add(rowHeader, 'mousedown', this.mouseDownHandler, this);
        this.wireResizeCursorEvent(rowHeader, colHeader);
    }

    private wireResizeCursorEvent(rowHeader: Element, colHeader: Element): void {
        EventHandler.add(rowHeader, 'mousemove', this.setTarget, this);
        EventHandler.add(colHeader, 'mousemove', this.setTarget, this);
    }

    private unWireResizeCursorEvent(): void {
        EventHandler.remove(this.parent.getRowHeaderContent(), 'mousemove', this.setTarget);
        const headerPanel: Element = this.parent.element.getElementsByClassName('e-header-panel')[0];
        if (headerPanel) {
            EventHandler.remove(headerPanel, 'mousemove', this.setTarget);
        }
    }

    private unwireEvents(): void {
        const rowHeader: Element = this.parent.getRowHeaderContent();
        const colHeader: Element = this.parent.element.getElementsByClassName('e-header-panel')[0];
        if (!colHeader) {
            return;
        }
        EventHandler.remove(colHeader, 'dblclick', this.dblClickHandler);
        EventHandler.remove(rowHeader, 'dblclick', this.dblClickHandler);
        EventHandler.remove(colHeader, 'mousedown', this.mouseDownHandler);
        EventHandler.remove(rowHeader, 'mousedown', this.mouseDownHandler);
        this.unWireResizeCursorEvent();
    }

    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(contentLoaded, this.wireEvents);
            this.parent.off(autoFit, this.autoFit);
            this.parent.off(setAutoFit, this.setAutoFitHandler);
            this.parent.off(propertyChange, this.propertyChange);
        }
    }

    private mouseMoveHandler(e: MouseEvent): void {
        const colResizeHandler: HTMLElement = this.parent.element.getElementsByClassName('e-colresize-handler')[0] as HTMLElement;
        const rowResizeHandler: HTMLElement = this.parent.element.getElementsByClassName('e-rowresize-handler')[0] as HTMLElement;
        this.resizeTooltip(null, true, e);
        if (colResizeHandler || rowResizeHandler) {
            this.isMouseMoved = true;
            const isRtl: boolean = this.parent.enableRtl;
            if (colResizeHandler) {
                if ( isRtl ? (e.x < (this.trgtEle.parentElement.firstChild as HTMLElement).getBoundingClientRect().right) :
                    (e.x > (this.trgtEle.parentElement.firstChild as HTMLElement).getBoundingClientRect().left)) {
                    colResizeHandler.style.left = e.clientX -
                        document.getElementById(this.parent.element.id + '_sheet').getBoundingClientRect().left + 'px';
                }
            } else if (rowResizeHandler) {
                if (e.y >= (this.trgtEle.parentElement.parentElement.firstChild as HTMLElement).getBoundingClientRect().top) {
                    rowResizeHandler.style.top = e.clientY -
                        document.getElementById(this.parent.element.id + '_sheet').getBoundingClientRect().top + 'px';
                }
            }
        }
    }

    private mouseDownHandler(e: MouseEvent & TouchEvent): void {
        if (!closest(e.target as Element, '.e-header-cell') || (e.target as Element).className.includes('e-filter-icon')) {
            return;
        }
        this.event = e;
        this.trgtEle = <HTMLElement>e.target;
        if (this.trgtEle.parentElement.classList.contains('e-hide-end') || this.trgtEle.classList.contains('e-hide-end')) {
            const offsetSize: number = this.trgtEle.offsetHeight;
            const offset: number = e.offsetY;
            if ((offsetSize >= 10 && offset < 5) || (offsetSize - 2 < 8 && offset < Math.ceil((offset - 2) / 2))) {
                this.trgtEle.classList.add('e-skip-resize');
            }
        }
        this.updateTarget(e, this.trgtEle);
        const trgt: HTMLElement = this.trgtEle;
        const className: string = trgt.classList.contains('e-colresize') ? 'e-colresize-handler' :
            trgt.classList.contains('e-rowresize') ? 'e-rowresize-handler' : '';
        this.createResizeHandler(trgt, className);
        this.unWireResizeCursorEvent();
        EventHandler.add(this.parent.element, 'mousemove', this.mouseMoveHandler, this);
        EventHandler.add(document, 'mouseup', this.mouseUpHandler, this);
    }

    private mouseUpHandler(e: MouseEvent & TouchEvent): void {
        const resizeHandler: HTMLElement = this.parent.element.getElementsByClassName('e-resize-handle')[0] as HTMLElement;
        this.resizeOn(e);
        this.isMouseMoved = null;
        const HeaderTooltip: HTMLElement = document.querySelector('.e-header-tooltip');
        if (resizeHandler) {
            detach(resizeHandler);
            this.updateCursor();
        }
        if (HeaderTooltip) {
            HeaderTooltip.remove();
        }
        EventHandler.remove(document, 'mouseup', this.mouseUpHandler);
        EventHandler.remove(this.parent.element, 'mousemove', this.mouseMoveHandler);
        const colHeader: Element = this.parent.element.getElementsByClassName('e-header-panel')[0];
        if (colHeader) {
            this.wireResizeCursorEvent(this.parent.getRowHeaderContent(), colHeader);
        }
        this.parent.notify(positionAutoFillElement, null );
        this.parent.notify(hideAutoFillOptions, null );
    }

    private dblClickHandler(e?: MouseEvent & TouchEvent): void {
        if (!closest(e.target as Element, '.e-header-cell') || (e.target as Element).className.includes('e-filter-icon')) {
            return;
        }
        this.trgtEle = <HTMLElement>e.target;
        const skipUnhideRowCol: boolean = this.updateTarget(e, this.trgtEle);
        if (skipUnhideRowCol) {
            this.parent.notify(readonlyAlert, null);
            return;
        }
        if (this.trgtEle.classList.contains('e-colresize')) {
            const colIndx: number = parseInt(this.trgtEle.getAttribute('aria-colindex'), 10) - 1;
            const prevWidth: string = `${getColumnWidth(this.parent.getActiveSheet(), colIndx)}px`;
            if (this.trgtEle.classList.contains('e-unhide-column')) {
                this.showHiddenColumns(colIndx - 1);
            } else {
                this.setAutofit(colIndx, true, prevWidth, this.trgtEle);
            }
        } else if (this.trgtEle.classList.contains('e-rowresize')) {
            const rowIndx: number = parseInt(this.trgtEle.parentElement.getAttribute('aria-rowindex'), 10) - 1;
            const prevHeight: string = `${getRowHeight(this.parent.getActiveSheet(), rowIndx)}px`;
            this.setAutofit(rowIndx, false, prevHeight);
        }
        this.parent.notify(positionAutoFillElement, null );
    }

    private setTarget(e: MouseEvent): void {
        if (this.parent.isEdit || !closest(e.target as Element, '.e-header-cell') || (e.target as Element).className.includes('e-filter-icon')) {
            return;
        }
        const trgt: HTMLElement = <HTMLElement>e.target;
        const sheet: SheetModel = this.parent.getActiveSheet();
        if (sheet.isProtected && (!sheet.protectSettings.formatColumns || !sheet.protectSettings.formatRows)) {
            if (!sheet.protectSettings.formatRows && !sheet.protectSettings.formatColumns) {
                return;
            }
            if (sheet.protectSettings.formatRows) {
                if (closest(trgt, '.e-colhdr-table')) {
                    return;
                }
            }
            if (sheet.protectSettings.formatColumns ) {
                if (closest(trgt, '.e-rowhdr-table')) {
                    return;
                }
            }
        }
        let newTrgt: HTMLElement; let tOffsetV: number; let eOffsetV: number; let tClass: string;
        if (closest(trgt, '.e-header-row')) {
            tOffsetV = trgt.offsetWidth; tClass = 'e-colresize';
            eOffsetV = this.parent.enableRtl ? (tOffsetV - e.offsetX) : e.offsetX;
            const prevSibling: Element = this.getColPrevSibling(trgt);
            if (prevSibling && !prevSibling.classList.contains('e-select-all-cell')) {
                newTrgt = <HTMLElement>prevSibling;
            } else {
                if (Number(trgt.getAttribute('aria-colindex')) > 1) { newTrgt = trgt; }
            }
        } else if (closest(trgt, '.e-row')) {
            eOffsetV = e.offsetY; tOffsetV = trgt.offsetHeight; tClass = 'e-rowresize';
            const prevSibling: Element = this.getRowPrevSibling(trgt);
            if (prevSibling) {
                newTrgt = <HTMLElement>prevSibling.firstElementChild;
            } else {
                if (Number(trgt.parentElement.getAttribute('aria-rowindex')) > 1) { newTrgt = trgt; }
            }
        }
        if (tOffsetV - 2 < 8 && eOffsetV !== Math.ceil((tOffsetV - 2) / 2)) {
            if (eOffsetV < Math.ceil((tOffsetV - 2) / 2)) {
                trgt.classList.add(tClass);
                if (newTrgt) {
                    newTrgt.classList.add(tClass);
                }
            } else if (eOffsetV > Math.ceil((tOffsetV - 2) / 2)) {
                trgt.classList.add(tClass);
            }
        } else if (tOffsetV - 5 < eOffsetV && eOffsetV <= tOffsetV && tOffsetV >= 10) {
            trgt.classList.add(tClass);
        } else if (eOffsetV < 5 && newTrgt && tOffsetV >= 10) {
            trgt.classList.add(tClass);
            newTrgt.classList.add(tClass);
        } else {
            const resEle: HTMLCollectionOf<Element> = this.parent.element.getElementsByClassName(tClass) as HTMLCollectionOf<Element>;
            for (let index: number = 0; index < resEle.length; index++) {
                resEle[index as number].classList.remove(tClass);
            }
        }
    }

    private getColPrevSibling(trgt: HTMLElement): Element {
        const frozenCol: number = this.parent.frozenColCount(this.parent.getActiveSheet());
        return trgt.previousElementSibling || (frozenCol && closest(trgt, '.e-column-header') ?
            this.parent.getSelectAllContent().querySelector('.e-header-row').lastElementChild : null);
    }

    private getRowPrevSibling(trgt: HTMLElement): Element {
        const frozenRow: number = this.parent.frozenRowCount(this.parent.getActiveSheet());
        return trgt.parentElement.previousElementSibling || (frozenRow && closest(trgt, '.e-row-header') ?
            this.parent.getSelectAllContent().querySelector('tbody').lastElementChild : null);
    }

    private updateTarget(e: MouseEvent, trgt: HTMLElement): boolean {
        if (closest(trgt, '.e-header-row')) {
            const offsetX: number = this.parent.enableRtl ? (trgt.offsetWidth - e.offsetX) : e.offsetX;
            if ((trgt.offsetWidth < 10 && offsetX < Math.ceil((trgt.offsetWidth - 2) / 2)) || (offsetX < 5 &&
                trgt.offsetWidth >= 10) && trgt.classList.contains('e-colresize')) {
                const sheet: SheetModel = this.parent.getActiveSheet();
                const prevIdx: number = Number(this.trgtEle.getAttribute('aria-colindex')) - 2;
                const prevSibling: Element = this.getColPrevSibling(trgt);
                if (prevSibling && !isHiddenCol(sheet, prevIdx)) {
                    this.trgtEle = prevSibling as HTMLElement;
                } else {
                    if (prevIdx > -1) {
                        const colModel: ColumnModel = getColumn(sheet, prevIdx);
                        if (colModel.isReadOnly || isReadOnlyCells(this.parent, [0, prevIdx, sheet.rowCount - 1, prevIdx])) {
                            return true;
                        }
                        this.trgtEle.classList.add('e-unhide-column');
                    }
                }
            }
        } else {
            if ((trgt.offsetHeight < 10 && e.offsetY < Math.ceil((trgt.offsetHeight - 2) / 2)) || (e.offsetY < 5 &&
                trgt.offsetHeight >= 10) && trgt.classList.contains('e-rowresize')) {
                const sheet: SheetModel = this.parent.getActiveSheet();
                const prevIdx: number = Number(trgt.parentElement.getAttribute('aria-rowindex')) - 2;
                const prevSibling: Element = this.getRowPrevSibling(trgt);
                if (prevSibling || isHiddenRow(sheet, prevIdx)) {
                    if (e.type === 'dblclick' && isHiddenRow(sheet, prevIdx)) {
                        const rowModel: RowModel = getRow(sheet, prevIdx);
                        if (rowModel.isReadOnly || isReadOnlyCells(this.parent, [prevIdx, 0, prevIdx, sheet.colCount - 1])) {
                            return true;
                        }
                        const selectRange: number[] = getSwapRange(getRangeIndexes(sheet.selectedRange));
                        let eventArgs: HideShowEventArgs;
                        if (prevIdx <= selectRange[2] && prevIdx > selectRange[0] && isRowSelected(sheet, selectRange)) {
                            eventArgs = { startIndex: selectRange[0], endIndex: selectRange[2], hide: false, autoFit: true };
                        } else {
                            eventArgs = { startIndex: prevIdx, endIndex: prevIdx, hide: false, autoFit: true };
                        }
                        this.parent.notify(hideShow, eventArgs);
                    } else {
                        if (!isHiddenRow(sheet, prevIdx)) {
                            this.trgtEle = prevSibling.getElementsByClassName('e-header-cell')[0] as HTMLElement;
                        }
                    }
                }
            }
        }
        return false;
    }

    private setAutoFitHandler(args: { idx: number, isCol: boolean, sheetIdx?: number }): void {
        if (args.isCol && isHiddenCol(this.parent.getActiveSheet(), args.idx)) {
            this.showHiddenColumns(args.idx);
        } else {
            this.setAutofit(args.idx, args.isCol, null, null, args.sheetIdx);
        }
    }

    private getWrapText(text: string, colwidth: number, style: CellStyleModel): string {
        const textArr: string[] = text.toString().split(' ');
        const spaceWidth: number = getTextWidth(' ', style, this.parent.cellStyle);
        let width: number; let textWidth: number = 0; let prevWidth: number = 0; let displayText: string = text; let val: string = '';
        const setDisplayText: Function = (): void => {
            const curWidth: number = parseInt(prevWidth.toString(), 10);
            if (curWidth > textWidth || (curWidth === textWidth && getTextWidth(val.trim(), style, this.parent.cellStyle) >
                getTextWidth(displayText, style, this.parent.cellStyle))) {
                displayText = val.trim();
                textWidth = curWidth;
            }
        };
        textArr.forEach((txt: string, index: number): void => {
            width = getTextWidth(txt, style, this.parent.cellStyle);
            if ((prevWidth + width) / colwidth > 1) {
                setDisplayText();
                val = '';
                prevWidth = width;
            } else {
                width += ((prevWidth + width + spaceWidth) / colwidth >= 1 ? 0 : spaceWidth);
                prevWidth += width;
            }
            val += txt + ' ';
            if (index === textArr.length - 1) {
                setDisplayText();
            }
        });
        return displayText;
    }

    private setAutofit(
        idx: number,
        isCol: boolean,
        prevData?: string,
        hdrCell?: Element,
        sheetIdx?: number): void {
        const sheet: SheetModel = !isNullOrUndefined(sheetIdx) ? getSheet(this.parent, sheetIdx) : this.parent.getActiveSheet();
        let autoFitWithHeader: boolean;
        const isActiveSheet: boolean = !isNullOrUndefined(sheetIdx) ? sheetIdx === this.parent.activeSheetIndex : true;
        if (hdrCell) {
            const eventArgs: { [key: string]: string | number | boolean } = { cancel: false, index: idx, isCol: isCol,
                sheetIndex: this.parent.activeSheetIndex };
            if (isCol) {
                eventArgs.oldWidth = prevData;
                eventArgs.autoFitWithHeader = false;
            } else {
                eventArgs.oldHeight = prevData;
            }
            this.parent.notify(beginAction, { eventArgs: eventArgs, action: 'resizeToFit' });
            if (eventArgs.cancel) {
                return;
            }
            autoFitWithHeader = <boolean>eventArgs.autoFitWithHeader;
        }
        let oldValue: number; let cell: CellModel = {}; let cellEle: HTMLElement; let colGrp: HTMLElement; let wrapCell: boolean;
        const table: HTMLElement = this.parent.createElement(
            'table', { className: this.parent.getContentTable().className + ' e-resizetable', styles: 'height: auto' });
        const tBody: HTMLElement = this.parent.createElement('tbody');
        const rowEle: HTMLElement = this.parent.createElement('tr', { className: 'e-row' });
        const tdEle: HTMLElement = this.parent.createElement('td', { className: 'e-cell' });
        let tableWidth: number = 0; let colWidth: number = 0;
        if (isCol) {
            let row: HTMLElement;
            table.style.width = 'auto';
            const appendRow: Function = (content: string): void => {
                cellEle = tdEle.cloneNode() as HTMLElement;
                cellEle.textContent = content;
                cellEle.style.fontFamily = (cell.style && cell.style.fontFamily) || this.parent.cellStyle.fontFamily;
                cellEle.style.fontSize = (cell.style && cell.style.fontSize) || this.parent.cellStyle.fontSize;
                cellEle.style.fontWeight = (cell.style && cell.style.fontWeight) || this.parent.cellStyle.fontWeight;
                row = <HTMLElement>rowEle.cloneNode();
                row.appendChild(cellEle);
                tBody.appendChild(row);
            };
            if (autoFitWithHeader) {
                appendRow(hdrCell.textContent);
            }
            for (let rowIdx: number = 0, len: number = sheet.rows.length; rowIdx < len; rowIdx++) {
                cell = getCell(rowIdx, idx, sheet);
                if (cell && cell.value) {
                    if (cell.wrap) {
                        wrapCell = true;
                        appendRow(this.getWrapText(this.parent.getDisplayText(cell), getExcludedColumnWidth(
                            sheet, idx, idx, cell.colSpan > 1 ? idx + cell.colSpan - 1 : idx), cell.style));
                    } else {
                        appendRow(this.parent.getDisplayText(cell));
                    }
                }
            }
            oldValue = getColumnWidth(sheet, idx);
        } else {
            const colLength: number = sheet.rows[idx as number] && sheet.rows[idx as number].cells ?
                sheet.rows[idx as number].cells.length : 0;
            colGrp = this.parent.createElement('colgroup');
            for (let colIdx: number = 0; colIdx < colLength; colIdx++) {
                cell = getCell(idx, colIdx, sheet);
                if (cell) {
                    cellEle = tdEle.cloneNode() as HTMLElement;
                    if (cell.wrap) {
                        cellEle.classList.add('e-wraptext');
                    }
                    cellEle.textContent = this.parent.getDisplayText(cell);
                    cellEle.style.fontFamily = (cell.style && cell.style.fontFamily) || this.parent.cellStyle.fontFamily;
                    cellEle.style.fontSize = (cell.style && cell.style.fontSize) || this.parent.cellStyle.fontSize;
                    rowEle.appendChild(cellEle);
                    colWidth = (cell.colSpan && cell.colSpan >= 1) ? this.getMergedColumnsWidth(cell.colSpan, colIdx, sheet) :
                        (cell.colSpan && cell.colSpan < 1) ? 0 : getColumnWidth(sheet, colIdx, false, true);
                    tableWidth += colWidth;
                    colGrp.appendChild(this.parent.createElement('col', { styles: `width:${colWidth}px` }));
                }
            }
            table.appendChild(colGrp);
            tBody.appendChild(rowEle);
            oldValue = getRowHeight(sheet, idx);
        }
        table.appendChild(tBody);
        if (tableWidth) { table.style.width = tableWidth + 'px'; }
        const wrapper: HTMLElement = this.parent.createElement(
            'div', { className: this.parent.element.className, styles: 'display: block' });
        wrapper.appendChild(table);
        document.body.appendChild(wrapper);
        const offset: ClientRect = table.getBoundingClientRect();
        document.body.removeChild(wrapper);
        const fitSize: number = Math.ceil(isCol ? offset.width : offset.height);
        let autofitValue: number = (isCol ? this.getFloatingElementWidth(fitSize + (wrapCell ? 1 : 0), idx) : fitSize) || oldValue;
        let threshold: number;
        if (isCol) {
            if (autofitValue > 0) {
                threshold = -(oldValue - autofitValue);
            } else {
                threshold = -oldValue;
            }
            const frozenCol: number = this.parent.frozenColCount(sheet);
            if ((frozenCol && idx >= getRangeIndexes(sheet.topLeftCell)[1] && idx < frozenCol) ||
                (idx >= this.parent.viewport.leftIndex + frozenCol && idx <= this.parent.viewport.rightIndex)) {
                getColumn(sheet, idx).width = autofitValue > 0 ? autofitValue : 0;
                if (isActiveSheet) {
                    this.resizeStart(idx, this.parent.getViewportIndex(idx, true), autofitValue + 'px', isCol, true, prevData);
                    this.parent.notify(colWidthChanged, { threshold: threshold, colIdx: idx });
                }
            } else {
                if (isActiveSheet) {
                    this.parent.notify(colWidthChanged, { threshold: threshold, colIdx: idx });
                }
                getColumn(sheet, idx).width = autofitValue > 0 ? autofitValue : 0;
            }
        } else {
            const frozenRow: number = this.parent.frozenRowCount(sheet);
            autofitValue = autofitValue > 20 ? autofitValue : 20;
            threshold = -(oldValue - autofitValue);
            if ((frozenRow && idx >= getRangeIndexes(sheet.topLeftCell)[0] && idx < frozenRow) ||
                (idx >= this.parent.viewport.topIndex + frozenRow && idx <= this.parent.viewport.bottomIndex)) {
                setRowHeight(sheet, idx, autofitValue);
                setRow(sheet, idx, { customHeight: false });
                if (isActiveSheet) {
                    this.resizeStart(idx, this.parent.getViewportIndex(idx), autofitValue + 'px', isCol, true, prevData);
                    this.parent.notify(rowHeightChanged, { threshold: threshold, rowIdx: idx });
                }
            } else {
                if (isActiveSheet) {
                    this.parent.notify(rowHeightChanged, { threshold: threshold, rowIdx: idx });
                }
                setRowHeight(sheet, idx, autofitValue);
            }
        }
        if (isActiveSheet) {
            this.parent.selectRange(sheet.selectedRange);
        }
    }

    private getMergedColumnsWidth(colSpan: number, colIndex: number, sheet: SheetModel): number {
        let columnWidth: number = 0;
        for (let i: number = 0; i < colSpan; i++) {
            columnWidth += getColumnWidth(sheet, colIndex, false, true);
            colIndex++;
        }
        return columnWidth;
    }

    private createResizeHandler(trgt: HTMLElement, className: string): void {
        const editor: HTMLElement = this.parent.createElement('div', { className: className });
        editor.classList.add('e-resize-handle');
        const sheet: HTMLElement = document.getElementById(this.parent.element.id + '_sheet');
        const sheetModel: SheetModel = this.parent.getActiveSheet();
        if (trgt.classList.contains('e-colresize')) {
            editor.style.height = this.parent.getMainContent().parentElement.clientHeight + this.parent.getColumnHeaderContent().offsetHeight + 'px';
            editor.style.left = this.event.clientX - sheet.getBoundingClientRect().left + 'px';
            editor.style.top = '0px';
        } else if (trgt.classList.contains('e-rowresize')) {
            editor.style.width = this.parent.getMainContent().parentElement.clientWidth + 'px';
            editor.style.left = '0px';
            editor.style.top = this.event.clientY - sheet.getBoundingClientRect().top + 'px';
        }
        if ((sheetModel.frozenRows || sheetModel.frozenColumns) && this.hasZIndex()) {
            editor.style.zIndex = '3';
        }
        sheet.appendChild(editor);
        this.resizeTooltip(trgt, false);
        this.updateCursor();
    }

    private resizeTooltip(trgt: HTMLElement, isResize?: boolean, e?: MouseEvent): void {
        const isRtl: boolean = this.parent.enableRtl;
        if (isResize) {
            const HeaderTolltip: HTMLElement = document.querySelector('.e-header-tooltip');
            const colResizeHandler: HTMLElement = this.parent.element.getElementsByClassName('e-colresize-handler')[0] as HTMLElement;
            const rowResizeHandler: HTMLElement = this.parent.element.getElementsByClassName('e-rowresize-handler')[0] as HTMLElement;
            if (colResizeHandler) {
                const trgtWidth: number = isRtl ? (Math.round(this.trgtEle.getBoundingClientRect().right) - (e.clientX)) :
                    ((e.clientX) - Math.round(this.trgtEle.getBoundingClientRect().left));
                if (HeaderTolltip) {
                    HeaderTolltip.firstChild.textContent = trgtWidth > 0 ? ('Width:(' + trgtWidth.toString() + ' pixels)') : ('Width: 0.00');
                }
            } else if (rowResizeHandler) {
                const trgtHeight: number = (e.clientY) - Math.round(this.trgtEle.getBoundingClientRect().top);
                if (HeaderTolltip) {
                    HeaderTolltip.firstChild.textContent = trgtHeight > 0 ? ('Height:(' + trgtHeight.toString() + ' pixels)') : ('Height: 0.00');
                }
            }
        } else {
            const isColResize: boolean = trgt.classList.contains('e-colresize');
            const isRowResize: boolean = trgt.classList.contains('e-rowresize');
            if (isColResize || isRowResize) {
                const className: string = isColResize ? 'e-colresize-handler' : 'e-rowresize-handler';
                const tooltip: Tooltip = new Tooltip({
                    cssClass: 'e-header-tooltip',
                    showTipPointer: false
                });
                if (isColResize) {
                    tooltip.content = initializeCSPTemplate((): string => {
                        return 'Width:(' + Math.round(trgt.getBoundingClientRect().width).toString() + ' pixels)';
                    });
                } else if (isRowResize) {
                    tooltip.content = initializeCSPTemplate((): string => {
                        return 'Height:(' + Math.round(trgt.getBoundingClientRect().height).toString() + ' pixels)';
                    });
                    tooltip.offsetX = (isRtl ? 1 : -1) * ((this.parent.getMainContent().parentElement.clientWidth / 2) -
                        Math.round(trgt.getBoundingClientRect().width));
                }
                tooltip.appendTo('.' + className);
                tooltip.open();
                tooltip.refresh();
            }
        }
    }

    private setColWidth(index: number, viewportIdx: number, width: number, curWidth: number): void {
        const sheet: SheetModel = this.parent.getActiveSheet();
        let threshold: number = getDPRValue(width) - curWidth;
        if (threshold < 0 && curWidth < -(threshold)) {
            threshold = -curWidth;
        }
        if (width > 0) {
            if (this.isMouseMoved && this.trgtEle.classList.contains('e-unhide-column')) {
                this.showHiddenColumns(index, width);
                this.parent.notify(completeAction, {
                    eventArgs: {
                        index: index, width: `${0}px`, isCol: true, sheetIndex: this.parent.activeSheetIndex, oldWidth: `${curWidth}px`,
                        hide: false
                    }, action: 'resize'
                });
                return;
            }
            this.resizeStart(index, viewportIdx, `${width}px`, true, false, `${curWidth}px`);
            setColumn(sheet, index, { width: width, customWidth: true });
            this.parent.notify(colWidthChanged, { threshold, colIdx: index, checkWrapCell: true });
            const frozenCol: number = this.parent.frozenColCount(sheet);
            if (frozenCol && index >= frozenCol && this.hasZIndex()) {
                const selectAllContent: HTMLElement = this.parent.getSelectAllContent();
                const rowHeaderContent: HTMLElement = this.parent.getRowHeaderContent();
                if ((selectAllContent || selectAllContent.querySelectorAll('col.e-empty')[viewportIdx as number]) &&
                    (rowHeaderContent || rowHeaderContent.querySelectorAll('col.e-empty')[viewportIdx as number])) {
                    this.parent.serviceLocator.getService<IRenderer>('sheet').setPanelWidth(
                        sheet, rowHeaderContent);
                }
            }
        } else {
            if (this.isMouseMoved) {
                this.parent.hideColumn(index);
                this.showHideCopyIndicator();
                this.parent.notify(completeAction, {
                    eventArgs: {
                        index: index, width: `${0}px`, isCol: true, sheetIndex: this.parent.activeSheetIndex, oldWidth: `${curWidth}px`,
                        hide: true
                    }, action: 'resize'
                });
            }
        }
    }

    private hasZIndex(): boolean {
        return ['e-row-header', 'e-selectall-container', 'e-column-header'].some((selector: string) => {
            const closestEle: HTMLElement = this.parent.element.getElementsByClassName(selector)[0] as HTMLElement;
            return closestEle && !!closestEle.style.zIndex;
        });
    }

    private showHideCopyIndicator(): void{
        const copyIndicator: HTMLElement = this.parent.element.getElementsByClassName('e-copy-indicator')[0] as HTMLElement;
        let isIndicator: boolean = false;
        if (copyIndicator) {
            detach(copyIndicator);
            this.parent.notify(hideAutoFillElement, null);
            isIndicator = true;
        }
        if (isIndicator) {
            this.parent.notify(contentLoaded, {});
        }
    }
    private showHiddenColumns(index: number, width?: number): void {
        const sheet: SheetModel = this.parent.getActiveSheet();
        const selectedRange: number[] = getRangeIndexes(sheet.selectedRange);
        let startIdx: number; let endIdx: number; let colgroup: Element;
        if (index >= selectedRange[1] && index <= selectedRange[3] && selectedRange[2] === sheet.rowCount - 1 &&
            getCellIndexes(sheet.activeCell)[0] === getCellIndexes(sheet.topLeftCell)[0]) {
            startIdx = selectedRange[1]; endIdx = selectedRange[3];
            colgroup = this.parent.getMainContent().querySelector('colgroup');
        } else {
            startIdx = endIdx = index;
        }
        if (width !== undefined) {
            for (let i: number = startIdx; i <= endIdx; i++) {
                setColumn(sheet, i, { width: width, customWidth: true });
                if (i >= this.parent.viewport.leftIndex && i <= this.parent.viewport.rightIndex && !isHiddenCol(sheet, i)) {
                    (colgroup.children[this.parent.getViewportIndex(i, true)] as HTMLElement).style.width = `${width}px`;
                }
            }
        }
        if (this.trgtEle) {
            this.trgtEle.classList.remove('e-unhide-column');
        }
        const hideEvtArgs: HideShowEventArgs = { startIndex: startIdx, endIndex: endIdx, hide: false, isCol: true, autoFit: true };
        this.parent.notify(hideShow, hideEvtArgs);
        this.showHideCopyIndicator();
        if (width === undefined) {
            if (hideEvtArgs.autoFit) {
                this.autoFit({ isRow: false, startIndex: startIdx, endIndex: endIdx });
            } else {
                const performAutoFit: Function = (): void => {
                    this.parent.off(contentLoaded, performAutoFit);
                    this.autoFit({ isRow: false, startIndex: startIdx, endIndex: endIdx });
                };
                this.parent.on(contentLoaded, performAutoFit, this);
            }
        }
    }

    private setRowHeight(rowIdx: number, viewportIdx: number, height: string, prevData?: string): void {
        const sheet: SheetModel = this.parent.getActiveSheet(); const frozenCol: number = this.parent.frozenColCount(sheet);
        const eleHeight: number = parseInt(this.parent.getRow(rowIdx, null, frozenCol).style.height, 10);
        const rowHeight: string = height;
        let threshold: number = getDPRValue(parseInt(rowHeight, 10)) - eleHeight;
        if (threshold < 0 && eleHeight < -(threshold)) {
            threshold = -eleHeight;
        }
        let customHeight: boolean;
        if (sheet.rows[rowIdx as number] && sheet.rows[rowIdx as number].customHeight) {
            customHeight = true;
        }
        this.resizeStart(rowIdx, viewportIdx, rowHeight, false, false, prevData, customHeight);
        setRow(sheet, rowIdx, { height: parseInt(rowHeight, 10) > 0 ? parseInt(rowHeight, 10) : 0, customHeight: true });
        this.parent.notify(rowHeightChanged, { threshold, rowIdx: rowIdx, isCustomHgt: true });
    }


    private resizeOn(e: MouseEvent): void {
        let idx: number; let actualIdx: number; const sheet: SheetModel = this.parent.getActiveSheet();
        if (this.trgtEle.classList.contains('e-rowresize')) {
            const prevIdx: number = Number(this.trgtEle.parentElement.getAttribute('aria-rowindex')) - 2;
            if (this.isMouseMoved && isHiddenRow(sheet, prevIdx) && this.trgtEle.classList.contains('e-skip-resize') &&
                e.clientY > this.trgtEle.getBoundingClientRect().top) {
                this.trgtEle.classList.remove('e-skip-resize');
                const eventArgs: HideShowEventArgs = { startIndex: prevIdx, endIndex: prevIdx, hide: false, skipAppend: true };
                this.parent.notify(hideShow, eventArgs);
                const rTbody: HTMLElement = this.parent.getRowHeaderTable().tBodies[0];
                const tbody: HTMLElement = this.parent.getContentTable().tBodies[0];
                eventArgs.hdrRow.style.display = 'none'; eventArgs.row.style.display = 'none';
                rTbody.insertBefore(eventArgs.hdrRow, rTbody.children[eventArgs.insertIdx]);
                tbody.insertBefore(eventArgs.row, tbody.children[eventArgs.insertIdx]);
                this.trgtEle = <HTMLElement>eventArgs.hdrRow.firstElementChild;
                eventArgs.hdrRow.nextElementSibling.classList.remove('e-hide-end');
                eventArgs.mergeCollection.forEach((mergeArgs: MergeArgs): void => { this.parent.notify(setMerge, mergeArgs); });
            } else {
                if (this.trgtEle.classList.contains('e-skip-resize')) {
                    this.trgtEle.classList.remove('e-skip-resize');
                    if ((!this.isMouseMoved && isHiddenRow(sheet, prevIdx)) || !this.trgtEle.parentElement.previousElementSibling) {
                        return;
                    }
                    this.trgtEle = this.trgtEle.parentElement.previousElementSibling.getElementsByClassName(
                        'e-header-cell')[0] as HTMLElement;
                }
            }
            actualIdx = idx = parseInt(this.trgtEle.parentElement.getAttribute('aria-rowindex'), 10) - 1;
            idx = this.parent.getViewportIndex(actualIdx);
            const frozenCol: number = this.parent.frozenColCount(sheet);
            let prevData: string = this.parent.getRow(actualIdx, null, frozenCol).style.height;
            let rowHeight: number = e.clientY - this.event.clientY + parseInt(prevData, 10);
            if (rowHeight <= 0) {
                this.parent.hideRow(actualIdx);
                this.showHideCopyIndicator();
                setRow(sheet, actualIdx, { height: 0, customHeight: true });
                this.parent.notify(completeAction, {
                    eventArgs:
                        { index: actualIdx, height: '0px', isCol: false, sheetIndex: this.parent.activeSheetIndex, oldHeight: prevData },
                    action: 'resize'
                });
                return;
            }
            this.setRowHeight(actualIdx, idx, `${rowHeight}px`, prevData);
            this.parent.notify(refreshFilterCellsOnResize, { rowIndex: actualIdx });
            if (this.trgtEle.parentElement.style.display === 'none') {
                const sheet: SheetModel = this.parent.getActiveSheet();
                const selectedRange: number[] = getSwapRange(getRangeIndexes(sheet.selectedRange));
                if (actualIdx <= selectedRange[2] && actualIdx > selectedRange[0]) {
                    rowHeight = getRowHeight(sheet, actualIdx); let count: number;
                    for (let i: number = selectedRange[0]; i <= selectedRange[2]; i++) {
                        if (i === actualIdx) { continue; }
                        prevData = `${getRowHeight(sheet, i)}px`;
                        setRow(sheet, i, { customHeight: true, height: rowHeight });
                        if (isHiddenRow(sheet, i)) {
                            if (!count) { count = i; }
                        } else {
                            this.parent.getRow(i).style.height = `${rowHeight}px`;
                            if (sheet.showHeaders) {
                                this.parent.getRow(i, this.parent.getRowHeaderTable()).style.height = `${rowHeight}px`;
                            }
                        }
                        this.parent.notify(completeAction, {
                            eventArgs:
                            {
                                index: i, height: `${rowHeight}px`, isCol: false,
                                sheetIndex: this.parent.activeSheetIndex, oldHeight: prevData
                            },
                            action: 'resize'
                        });
                    }
                    this.parent.hideRow(selectedRange[0], actualIdx - 1, false);
                    this.showHideCopyIndicator();
                    idx += Math.abs(actualIdx - count);
                } else {
                    if (idx !== 0 && !isHiddenRow(sheet, actualIdx - 1)) {
                        this.trgtEle.parentElement.previousElementSibling.classList.remove('e-hide-start');
                    } else {
                        if (idx !== 0) { this.trgtEle.parentElement.classList.add('e-hide-end'); }
                    }
                    this.parent.selectRange(sheet.selectedRange);
                }
                this.trgtEle.parentElement.style.display = ''; this.parent.getContentTable().rows[idx as number].style.display = '';
            }
        } else if (this.trgtEle.classList.contains('e-colresize')) {
            if (this.isMouseMoved && this.trgtEle.classList.contains('e-unhide-column') &&
                e.clientX < this.trgtEle.getBoundingClientRect().left) {
                this.trgtEle.classList.remove('e-unhide-column');
                if (this.trgtEle.previousElementSibling) { this.trgtEle = <HTMLElement>this.trgtEle.previousElementSibling; }
            }
            idx = parseInt(this.trgtEle.getAttribute('aria-colindex'), 10) - 1;
            let curWidth: number;
            if (this.trgtEle.classList.contains('e-unhide-column')) {
                idx -= 1; curWidth = 0;
            } else {
                curWidth = getColumnWidth(this.parent.getActiveSheet(), idx);
            }
            this.setColWidth(idx, this.parent.getViewportIndex(idx, true), (this.parent.enableRtl ?
                (this.event.clientX - e.clientX) : (e.clientX - this.event.clientX)) + curWidth, curWidth);
            const frozenRowCount: number = this.parent.frozenRowCount(sheet);
            if (frozenRowCount > 0) {
                this.reapplyFormats(sheet, idx, getCellIndexes(sheet.topLeftCell)[0], frozenRowCount - 1);
            }
            this.reapplyFormats(sheet, idx, this.parent.viewport.topIndex + frozenRowCount, this.parent.viewport.bottomIndex);
        }
    }

    private reapplyFormats(sheet: SheetModel, colIdx: number, rowIdx: number, endRowIdx: number): void {
        for (rowIdx; rowIdx <= endRowIdx; rowIdx++) {
            const cell: CellModel = getCell(rowIdx, colIdx, sheet, false, true);
            if (cell.format && cell.format.includes('*')) {
                this.parent.notify(getFormattedCellObject, <NumberFormatArgs>{ value: cell.value, format: cell.format, cell: cell,
                    formattedText: cell.value, rowIndex: rowIdx, colIndex: colIdx
                });
            }
        }
    }

    private resizeStart(
        idx: number, viewportIdx: number, value: string, isCol?: boolean, isFit?: boolean, prevData?: string,
        isCustomHeight?: boolean): void {
        setResize(idx, viewportIdx, value, isCol, this.parent);
        const action: string = isFit ? 'resizeToFit' : 'resize';
        let eventArgs: object;
        let isAction: boolean;
        if (isCol) {
            eventArgs = { index: idx, width: value, isCol: isCol, sheetIndex: this.parent.activeSheetIndex, oldWidth: prevData };
            isAction = prevData !== value;
        } else {
            eventArgs = { index: idx, height: value, isCol: isCol, sheetIndex: this.parent.activeSheetIndex, oldHeight: prevData,
                isPrevCustomHeight: isCustomHeight };
            isAction = prevData !== value;
        }
        if (isAction) {
            this.parent.notify(completeAction, { eventArgs: eventArgs, action: action });
        }
    }

    private updateCursor(): void {
        if (this.parent.element.getElementsByClassName('e-colresize-handler')[0]) {
            this.parent.element.classList.add('e-col-resizing');
        } else if (this.parent.element.classList.contains('e-col-resizing')) {
            this.parent.element.classList.remove('e-col-resizing');
        }
        if (this.parent.element.getElementsByClassName('e-rowresize-handler')[0]) {
            this.parent.element.classList.add('e-row-resizing');
        } else if (this.parent.element.classList.contains('e-row-resizing')) {
            this.parent.element.classList.remove('e-row-resizing');
        }
    }
    // To get the floating element width like filter
    private getFloatingElementWidth(oldWidth: number, colIdx: number): number {
        let floatingWidth: number = oldWidth;
        const eventArgs: { [key: string]: number[] | boolean } = { filterRange: [], hasFilter: false };
        this.parent.notify(getFilterRange, eventArgs);
        if (eventArgs.hasFilter && eventArgs.filterRange) {
            if (eventArgs.filterRange[1] <= colIdx && eventArgs.filterRange[3] >= colIdx) {
                floatingWidth = oldWidth + 22; // default width and padding for button
            }
        }
        return floatingWidth;
    }

    /**
     * To destroy the resize module.
     *
     * @returns {void} - To destroy the resize module.
     */
    public destroy(): void {
        this.unwireEvents();
        this.removeEventListener();
        if (this.trgtEle) { this.trgtEle.remove(); } this.trgtEle = null;
        this.event = null;
        this.parent = null;
    }
    /**
     * Get the module name.
     *
     * @returns {string} - Get the module name.
     */
    protected getModuleName(): string {
        return 'resize';
    }

    private propertyChange(args: { propertyName: string }): void {
        if (args.propertyName === 'allowResizing') {
            this.wireEvents();
        }
    }
}
