import { getDPRValue, Spreadsheet } from '../index';
import { closest, EventHandler } from '@syncfusion/ej2-base';
import { colWidthChanged, rowHeightChanged, contentLoaded, hideShow, getFilterRange } from '../common/index';
import { findMaxValue, setResize, autoFit, HideShowEventArgs, completeAction, setAutoFit } from '../common/index';
import { setRowHeight, isHiddenRow, SheetModel, getRowHeight, getColumnWidth, setColumn, isHiddenCol } from '../../workbook/base/index';
import { getColumn, setRow, getCell, CellModel } from '../../workbook/base/index';
import { getRangeIndexes, getSwapRange, CellStyleModel, getCellIndexes, setMerge, MergeArgs } from '../../workbook/common/index';

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
        EventHandler.remove(this.parent.element.getElementsByClassName('e-header-panel')[0], 'mousemove', this.setTarget);
    }

    private unwireEvents(): void {
        EventHandler.remove(this.parent.getColumnHeaderContent(), 'dblclick', this.dblClickHandler);
        EventHandler.remove(this.parent.getRowHeaderContent(), 'dblclick', this.dblClickHandler);
        EventHandler.remove(this.parent.getColumnHeaderContent(), 'mousedown', this.mouseDownHandler);
        EventHandler.remove(this.parent.getRowHeaderContent(), 'mousedown', this.mouseDownHandler);
        this.unWireResizeCursorEvent();
    }

    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(contentLoaded, this.wireEvents);
            this.parent.off(autoFit, this.autoFit);
            this.parent.off(setAutoFit, this.setAutoFitHandler);
        }
    }

    private mouseMoveHandler(e: MouseEvent): void {
        const colResizeHandler: HTMLElement = this.parent.element.getElementsByClassName('e-colresize-handler')[0] as HTMLElement;
        const rowResizeHandler: HTMLElement = this.parent.element.getElementsByClassName('e-rowresize-handler')[0] as HTMLElement;
        if (colResizeHandler || rowResizeHandler) {
            this.isMouseMoved = true;
            if (colResizeHandler) {
                if (e.x > (this.trgtEle.parentElement.firstChild as HTMLElement).getBoundingClientRect().left) {
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
        if (!closest(e.target as Element, '.e-header-cell')) { return; }
        this.event = e;
        this.trgtEle = <HTMLElement>e.target;
        if (this.trgtEle.parentElement.classList.contains('e-hide-end') || this.trgtEle.classList.contains('e-hide-end')) {
            const offsetSize: number = this.trgtEle.offsetHeight; const offset: number = e.offsetY;
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
        const colResizeHandler: HTMLElement = this.parent.element.getElementsByClassName('e-colresize-handler')[0] as HTMLElement;
        const rowResizeHandler: HTMLElement = this.parent.element.getElementsByClassName('e-rowresize-handler')[0] as HTMLElement;
        this.resizeOn(e);
        this.isMouseMoved = null;
        const resizeHandler: HTMLElement = colResizeHandler || rowResizeHandler;
        if (resizeHandler) {
            document.getElementById(this.parent.element.id + '_sheet').removeChild(resizeHandler);
            this.updateCursor(e);
        }
        EventHandler.remove(document, 'mouseup', this.mouseUpHandler);
        EventHandler.remove(this.parent.element, 'mousemove', this.mouseMoveHandler);
        this.wireResizeCursorEvent(this.parent.getRowHeaderContent(), this.parent.element.getElementsByClassName('e-header-panel')[0]);
    }

    private dblClickHandler(e?: MouseEvent & TouchEvent): void {
        if (!closest(e.target as Element, '.e-header-cell')) { return; }
        this.trgtEle = <HTMLElement>e.target;
        this.updateTarget(e, this.trgtEle);
        if (this.trgtEle.classList.contains('e-colresize')) {
            const colIndx: number = parseInt(this.trgtEle.getAttribute('aria-colindex'), 10) - 1;
            const prevWidth: string = `${getColumnWidth(this.parent.getActiveSheet(), colIndx)}px`;
            if (this.trgtEle.classList.contains('e-unhide-column')) {
                this.showHiddenColumns(colIndx - 1);
            } else {
                this.setAutofit(colIndx, true, prevWidth);
            }
        } else if (this.trgtEle.classList.contains('e-rowresize')) {
            const rowIndx: number = parseInt(this.trgtEle.parentElement.getAttribute('aria-rowindex'), 10) - 1;
            const prevHeight: string = `${getRowHeight(this.parent.getActiveSheet(), rowIndx)}px`;
            this.setAutofit(rowIndx, false, prevHeight);
        }
    }

    private setTarget(e: MouseEvent): void {
        if (!closest(e.target as Element, '.e-header-cell')) { return; }
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
            eOffsetV = e.offsetX; tOffsetV = trgt.offsetWidth; tClass = 'e-colresize';
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
                newTrgt.classList.add(tClass);
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
                resEle[index].classList.remove(tClass);
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

    private updateTarget(e: MouseEvent, trgt: HTMLElement): void {
        if (closest(trgt, '.e-header-row')) {
            if ((trgt.offsetWidth < 10 && e.offsetX < Math.ceil((trgt.offsetWidth - 2) / 2)) || (e.offsetX < 5 &&
                trgt.offsetWidth >= 10) && trgt.classList.contains('e-colresize')) {
                const sheet: SheetModel = this.parent.getActiveSheet();
                const prevIdx: number = Number(this.trgtEle.getAttribute('aria-colindex')) - 2;
                const prevSibling: Element = this.getColPrevSibling(trgt);
                if (prevSibling && !isHiddenCol(sheet, prevIdx)) {
                    this.trgtEle = prevSibling as HTMLElement;
                } else {
                    if (prevIdx > -1) { this.trgtEle.classList.add('e-unhide-column'); }
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
                        const selectRange: number[] = getSwapRange(getRangeIndexes(sheet.selectedRange));
                        let eventArgs: HideShowEventArgs;
                        if (prevIdx <= selectRange[2] && prevIdx > selectRange[0]) {
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
    }

    private setAutoFitHandler(args: { idx: number, isCol: boolean }): void {
        this.setAutofit(args.idx, args.isCol);
    }

    private setAutofit(idx: number, isCol?: boolean, prevData?: string): void {
        let index: number = 0;
        const sheet: SheetModel = this.parent.getActiveSheet();
        const mainContent: Element = this.parent.getMainContent();
        const oldValue: string = isCol ? `${getColumnWidth(this.parent.getActiveSheet(), idx)}px` :
            `${getRowHeight(this.parent.getActiveSheet(), idx)}px`;
        const contentClone: HTMLElement[] = [];
        const contentTable: HTMLElement = mainContent.getElementsByClassName('e-content-table')[0] as HTMLElement;
        if (this.parent.getActiveSheet().showHeaders) {
            const headerTable: HTMLElement = isCol ? this.parent.getColHeaderTable() : this.parent.getRowHeaderTable();
            headerTable.getElementsByTagName('tr') as HTMLCollectionOf<HTMLTableRowElement>;
        }
        let isWrap: boolean = false; let wrapCount: number = 0;
        if (isCol) {
            const rowLength: number = sheet.rows.length;
            for (let rowIdx: number = 0; rowIdx < rowLength; rowIdx++) {
                if (sheet.rows[rowIdx] && sheet.rows[rowIdx].cells && sheet.rows[rowIdx].cells[idx]) {
                    if (getCell(rowIdx, idx, sheet).wrap) {
                        isWrap = true;
                        wrapCount++;
                    }
                    const td: HTMLElement = this.parent.createElement('td', { className: 'e-cell' });
                    td.textContent = this.parent.getDisplayText(sheet.rows[rowIdx].cells[idx]);
                    if (sheet.rows[rowIdx].cells[idx].style) {
                        const style: CellStyleModel = sheet.rows[rowIdx].cells[idx].style;
                        if (style.fontFamily) {
                            td.style.fontFamily = style.fontFamily;
                        }
                        if (style.fontSize) {
                            td.style.fontSize = style.fontSize;
                        }
                    }
                    contentClone[index] = td;
                    index++;
                }
            }
        } else {
            const colLength: number = sheet.rows[idx] && sheet.rows[idx].cells ? sheet.rows[idx].cells.length : 0;
            for (let colIdx: number = 0; colIdx < colLength; colIdx++) {
                if (sheet.rows[idx] && sheet.rows[idx].cells[colIdx]) {
                    if (getCell(idx, colIdx, sheet).wrap) {
                        isWrap = true;
                        wrapCount++;
                    }
                    const td: HTMLElement = this.parent.createElement('td');
                    td.textContent = this.parent.getDisplayText(sheet.rows[idx].cells[colIdx]);
                    if (sheet.rows[idx].cells[colIdx].style) {
                        const style: CellStyleModel = sheet.rows[idx].cells[colIdx].style;
                        if (style.fontFamily) {
                            td.style.fontFamily = style.fontFamily;
                        }
                        if (style.fontSize) {
                            td.style.fontSize = style.fontSize;
                        }
                    }
                    contentClone[index] = td;
                    index++;
                }
            }
        }
        if (wrapCount === 0) {
            let contentFit: number = findMaxValue(contentTable, contentClone, isCol, this.parent, prevData, isWrap);
            if (isCol) {
                contentFit = this.getFloatingElementWidth(contentFit, idx);
            }
            let autofitValue: number = contentFit === 0 ? parseInt(oldValue, 10) : contentFit;
            const threshold: number = parseInt(oldValue, 10) > autofitValue ?
                -(parseInt(oldValue, 10) - autofitValue) : autofitValue - parseInt(oldValue, 10);
            if (isCol) {
                if (idx >= this.parent.viewport.leftIndex && idx <= this.parent.viewport.rightIndex) {
                    getColumn(sheet, idx).width = autofitValue > 0 ? autofitValue : 0;
                    this.resizeStart(idx, this.parent.getViewportIndex(idx, true), autofitValue + 'px', isCol, true, prevData);
                    this.parent.notify(colWidthChanged, { threshold: threshold, colIdx: idx });
                } else {
                    const oldWidth: number = getColumnWidth(sheet, idx);
                    let threshold: number;
                    if (autofitValue > 0) {
                        threshold = -(oldWidth - autofitValue);
                    } else {
                        threshold = -oldWidth;
                    }
                    this.parent.notify(colWidthChanged, { threshold, colIdx: idx });
                    getColumn(sheet, idx).width = autofitValue > 0 ? autofitValue : 0;
                }
            } else if (!isCol) {
                if (idx >= this.parent.viewport.topIndex && idx <= this.parent.viewport.bottomIndex) {
                    autofitValue = autofitValue > 20 ? autofitValue : 20;
                    setRowHeight(sheet, idx, autofitValue > 0 ? autofitValue : 0);
                    this.resizeStart(idx, this.parent.getViewportIndex(idx), autofitValue + 'px', isCol, true, prevData);
                    this.parent.notify(rowHeightChanged, { threshold: threshold, rowIdx: idx });
                } else {
                    const oldHeight: number = getRowHeight(sheet, idx);
                    let threshold: number;
                    if (autofitValue > 0) {
                        threshold = -(oldHeight - autofitValue);
                    } else {
                        threshold = -oldHeight;
                    }
                    this.parent.notify(rowHeightChanged, { threshold, rowIdx: idx });
                    setRowHeight(sheet, idx, autofitValue > 0 ? autofitValue : 0);
                }
            }
        }
    }

    private createResizeHandler(trgt: HTMLElement, className: string): void {
        const editor: HTMLElement = this.parent.createElement('div', { className: className });
        const sheet: HTMLElement = document.getElementById(this.parent.element.id + '_sheet');
        if (trgt.classList.contains('e-colresize')) {
            editor.style.height = this.parent.getMainContent().parentElement.clientHeight + this.parent.getColumnHeaderContent().offsetHeight + 'px';
            editor.style.left = this.event.clientX - sheet.getBoundingClientRect().left + 'px';
            editor.style.top = '0px';
        } else if (trgt.classList.contains('e-rowresize')) {
            editor.style.width = this.parent.getMainContent().parentElement.clientWidth + 'px';
            editor.style.left = '0px';
            editor.style.top = this.event.clientY - sheet.getBoundingClientRect().top + 'px';
        }
        sheet.appendChild(editor);
        this.updateCursor(this.event);
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
                        index: index, width: `${0}px`, isCol: true, sheetIdx: this.parent.activeSheetIndex, oldWidth: `${curWidth}px`,
                        hide: false
                    }, action: 'resize'
                });
                return;
            }
            this.resizeStart(index, viewportIdx, `${width}px`, true, false, `${curWidth}px`);
            setColumn(sheet, index, { width: width, customWidth: true });
            this.parent.notify(colWidthChanged, { threshold, colIdx: index });
        } else {
            if (this.isMouseMoved) {
                this.parent.hideColumn(index);
                this.parent.notify(completeAction, {
                    eventArgs: {
                        index: index, width: `${0}px`, isCol: true, sheetIdx: this.parent.activeSheetIndex, oldWidth: `${curWidth}px`,
                        hide: true
                    }, action: 'resize'
                });
            }
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
        this.trgtEle.classList.remove('e-unhide-column');
        this.parent.hideColumn(startIdx, endIdx, false);
        if (width === undefined) { this.autoFit({ isRow: false, startIndex: startIdx, endIndex: endIdx }); }
    }

    private setRowHeight(rowIdx: number, viewportIdx: number, height: string, prevData?: string): void {
        const sheet: SheetModel = this.parent.getActiveSheet(); const frozenCol: number = this.parent.frozenColCount(sheet);
        const eleHeight: number = parseInt(this.parent.getRow(rowIdx, null, frozenCol).style.height, 10);
        const rowHeight: string = height;
        let threshold: number = getDPRValue(parseInt(rowHeight, 10)) - eleHeight;
        if (threshold < 0 && eleHeight < -(threshold)) {
            threshold = -eleHeight;
        }
        this.resizeStart(rowIdx, viewportIdx, rowHeight, false, false, prevData);
        setRow(sheet, rowIdx, { height: parseInt(rowHeight, 10) > 0 ? parseInt(rowHeight, 10) : 0, customHeight: true });
        this.parent.notify(rowHeightChanged, { threshold, rowIdx: rowIdx, isCustomHgt: true });
    }


    private resizeOn(e: MouseEvent): void {
        let idx: number; let actualIdx: number; const sheet: SheetModel = this.parent.getActiveSheet();
        const activeCell: number[] = getRangeIndexes(sheet.activeCell);
        const CellElem: CellModel = getCell(activeCell[0], activeCell[1], sheet);
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
                setRow(sheet, actualIdx, { height: 0, customHeight: true });
                this.parent.notify(completeAction, {
                    eventArgs:
                        { index: actualIdx, height: '0px', isCol: false, sheetIdx: this.parent.activeSheetIndex, oldHeight: prevData },
                    action: 'resize'
                });
                return;
            }
            this.setRowHeight(actualIdx, idx, `${rowHeight}px`, prevData);
            if (CellElem && CellElem.rowSpan) {
                const td: HTMLElement = this.parent.getCell(activeCell[0], activeCell[1]);
                (this.parent.element.querySelector('.e-active-cell') as HTMLElement).style.height = td.offsetHeight + 'px';
            }
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
                                sheetIdx: this.parent.activeSheetIndex, oldHeight: prevData
                            },
                            action: 'resize'
                        });
                    }
                    this.parent.hideRow(selectedRange[0], actualIdx - 1, false);
                    idx += Math.abs(actualIdx - count);
                } else {
                    if (idx !== 0 && !isHiddenRow(sheet, actualIdx - 1)) {
                        this.trgtEle.parentElement.previousElementSibling.classList.remove('e-hide-start');
                    } else {
                        if (idx !== 0) { this.trgtEle.parentElement.classList.add('e-hide-end'); }
                    }
                    this.parent.selectRange(sheet.selectedRange);
                }
                this.trgtEle.parentElement.style.display = ''; this.parent.getContentTable().rows[idx].style.display = '';
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
            this.setColWidth(idx, this.parent.getViewportIndex(idx, true), (e.clientX - this.event.clientX) + curWidth, curWidth);
            if (CellElem && CellElem.colSpan) {
                const td: HTMLElement = this.parent.getCell(activeCell[0], activeCell[1]);
                (this.parent.element.querySelector('.e-active-cell') as HTMLElement).style.width = td.offsetWidth +  'px';
            }
        }
    }

    private resizeStart(idx: number, viewportIdx: number, value: string, isCol?: boolean, isFit?: boolean, prevData?: string): void {
        let sheet: SheetModel = this.parent.getActiveSheet();
        setResize(idx, viewportIdx, value, isCol, this.parent);
        const action: string = isFit ? 'resizeToFit' : 'resize';
        let eventArgs: object;
        let isAction: boolean;
        if (isCol) {
            eventArgs = { index: idx, width: value, isCol: isCol, sheetIdx: this.parent.activeSheetIndex, oldWidth: prevData };
            isAction = prevData !== value;
        } else {
            eventArgs = { index: idx, height: value, isCol: isCol, sheetIdx: this.parent.activeSheetIndex, oldHeight: prevData };
            isAction = prevData !== value;
        }
        if (isAction) {
            this.parent.notify(completeAction, { eventArgs: eventArgs, action: action });
        }
    }

    private updateCursor(e: MouseEvent): void {
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
}
