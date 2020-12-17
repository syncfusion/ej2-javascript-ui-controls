import { Spreadsheet } from '../index';
import { closest, EventHandler } from '@syncfusion/ej2-base';
import { colWidthChanged, rowHeightChanged, beforeHeaderLoaded, contentLoaded, hideShow, getFilterRange } from '../common/index';
import { findMaxValue, setResize, autoFit, HideShowEventArgs, completeAction, setAutoFit } from '../common/index';
import { setRowHeight, isHiddenRow, SheetModel, getRowHeight, getColumnWidth, setColumn, isHiddenCol } from '../../workbook/base/index';
import { getColumn, setRow, getCell } from '../../workbook/base/index';
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
     * @private
     */
    constructor(parent: Spreadsheet) {
        this.parent = parent;
        this.addEventListener();
    }

    private addEventListener(): void {
        this.parent.on(contentLoaded, this.wireEvents, this);
        this.parent.on(beforeHeaderLoaded, this.wireEvents, this);
        this.parent.on(autoFit, this.autoFit, this);
        this.parent.on(setAutoFit, this.setAutoFitHandler, this);
    }

    private autoFit(args: { isRow: boolean, startIndex: number, endIndex: number }): void {
        let element: Element = args.isRow ? this.parent.getRowHeaderTable() : this.parent.getColHeaderTable().rows[0];
        for (let i: number = args.startIndex; i <= args.endIndex; i++) {
            this.trgtEle = args.isRow ? this.parent.getRow(i, <HTMLTableElement>element) :
                this.parent.getCell(null, i, <HTMLTableRowElement>element);
            this.setAutofit(i, !args.isRow);
        }
    }

    private wireEvents(args: { element: Element }): void {
        if (this.parent.getActiveSheet().showHeaders) {
            let rowHeader: Element = args ? args.element : this.parent.getRowHeaderContent();
            let colHeader: Element = this.parent.getColumnHeaderContent();
            EventHandler.add(colHeader, 'dblclick', this.dblClickHandler, this);
            EventHandler.add(rowHeader, 'dblclick', this.dblClickHandler, this);
            EventHandler.add(colHeader, 'mousedown', this.mouseDownHandler, this);
            EventHandler.add(rowHeader, 'mousedown', this.mouseDownHandler, this);
            this.wireResizeCursorEvent(rowHeader, colHeader);
        }
    }

    private wireResizeCursorEvent(rowHeader: Element, colHeader: Element): void {
        EventHandler.add(rowHeader, 'mousemove', this.setTarget, this);
        EventHandler.add(colHeader, 'mousemove', this.setTarget, this);
    }

    private unWireResizeCursorEvent(): void {
        EventHandler.remove(this.parent.getRowHeaderContent(), 'mousemove', this.setTarget);
        EventHandler.remove(this.parent.getColumnHeaderContent(), 'mousemove', this.setTarget);
    }

    private unwireEvents(): void {
        if (this.parent.getActiveSheet().showHeaders) {
            EventHandler.remove(this.parent.getColumnHeaderContent(), 'dblclick', this.dblClickHandler);
            EventHandler.remove(this.parent.getRowHeaderContent(), 'dblclick', this.dblClickHandler);
            EventHandler.remove(this.parent.getColumnHeaderContent(), 'mousedown', this.mouseDownHandler);
            EventHandler.remove(this.parent.getRowHeaderContent(), 'mousedown', this.mouseDownHandler);
            this.unWireResizeCursorEvent();
        }
    }

    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(contentLoaded, this.wireEvents);
            this.parent.off(beforeHeaderLoaded, this.wireEvents);
            this.parent.off(autoFit, this.autoFit);
            this.parent.off(setAutoFit, this.setAutoFitHandler);
        }
    }

    private mouseMoveHandler(e: MouseEvent): void {
        let sheetPanel: Element = this.parent.element.getElementsByClassName('e-sheet-panel')[0];
        let colResizeHandler: HTMLElement = this.parent.element.getElementsByClassName('e-colresize-handler')[0] as HTMLElement;
        let rowResizeHandler: HTMLElement = this.parent.element.getElementsByClassName('e-rowresize-handler')[0] as HTMLElement;
        if (colResizeHandler || rowResizeHandler) {
            this.isMouseMoved = true;
            if (colResizeHandler) {
                if (e.x > (this.trgtEle.parentElement.firstChild as HTMLElement).getBoundingClientRect().left) {
                    colResizeHandler.style.left = e.clientX - this.parent.element.getBoundingClientRect().left + 'px';
                }
            } else if (rowResizeHandler) {
                if (e.y >= (this.trgtEle.parentElement.parentElement.firstChild as HTMLElement).getBoundingClientRect().top) {
                    rowResizeHandler.style.top = e.clientY - sheetPanel.getBoundingClientRect().top + 'px';
                }
            }
        }
    }

    private mouseDownHandler(e: MouseEvent & TouchEvent): void {
        this.event = e;
        this.trgtEle = <HTMLElement>e.target;
        if (this.trgtEle.parentElement.classList.contains('e-hide-end') || this.trgtEle.classList.contains('e-hide-end')) {
            let offsetSize: number = this.trgtEle.offsetHeight; let offset: number = e.offsetY;
            if ((offsetSize >= 10 && offset < 5) || (offsetSize - 2 < 8 && offset < Math.ceil((offset - 2) / 2))) {
                this.trgtEle.classList.add('e-skip-resize');
            }
        }
        this.updateTarget(e, this.trgtEle);
        let trgt: HTMLElement = this.trgtEle;
        let className: string = trgt.classList.contains('e-colresize') ? 'e-colresize-handler' :
            trgt.classList.contains('e-rowresize') ? 'e-rowresize-handler' : '';
        this.createResizeHandler(trgt, className);
        this.unWireResizeCursorEvent();
        EventHandler.add(this.parent.element, 'mousemove', this.mouseMoveHandler, this);
        EventHandler.add(document, 'mouseup', this.mouseUpHandler, this);
    }

    private mouseUpHandler(e: MouseEvent & TouchEvent): void {
        let colResizeHandler: HTMLElement = this.parent.element.getElementsByClassName('e-colresize-handler')[0] as HTMLElement;
        let rowResizeHandler: HTMLElement = this.parent.element.getElementsByClassName('e-rowresize-handler')[0] as HTMLElement;
        this.resizeOn(e);
        this.isMouseMoved = null;
        let resizeHandler: HTMLElement = colResizeHandler ? colResizeHandler : rowResizeHandler;
        if (resizeHandler) {
            this.parent.element.getElementsByClassName('e-sheet-panel')[0].removeChild(resizeHandler);
            this.updateCursor(e);
        }
        EventHandler.remove(document, 'mouseup', this.mouseUpHandler);
        EventHandler.remove(this.parent.element, 'mousemove', this.mouseMoveHandler);
        this.wireResizeCursorEvent(this.parent.getRowHeaderContent(), this.parent.getColumnHeaderContent());
    }

    private dblClickHandler(e?: MouseEvent & TouchEvent): void {
        this.trgtEle = <HTMLElement>e.target;
        this.updateTarget(e, this.trgtEle);
        if (this.trgtEle.classList.contains('e-colresize')) {
            let colIndx: number = parseInt(this.trgtEle.getAttribute('aria-colindex'), 10) - 1;
            let prevWidth: string = `${getColumnWidth(this.parent.getActiveSheet(), colIndx)}px`;
            if (this.trgtEle.classList.contains('e-unhide-column')) {
                this.showHiddenColumns(colIndx - 1);
            } else {
                this.setAutofit(colIndx, true, prevWidth);
            }
        } else if (this.trgtEle.classList.contains('e-rowresize')) {
            let rowIndx: number = parseInt(this.trgtEle.parentElement.getAttribute('aria-rowindex'), 10) - 1;
            let prevHeight: string = `${getRowHeight(this.parent.getActiveSheet(), rowIndx)}px`;
            this.setAutofit(rowIndx, false, prevHeight);
        }
    }

    private setTarget(e: MouseEvent): void {
        let trgt: HTMLElement = <HTMLElement>e.target;
        let sheet: SheetModel = this.parent.getActiveSheet();
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
            if (trgt.previousElementSibling) {
                newTrgt = <HTMLElement>trgt.previousElementSibling;
            } else {
                if (Number(trgt.getAttribute('aria-colindex')) > 1) { newTrgt = trgt; }
            }
        } else if (closest(trgt, '.e-row')) {
            eOffsetV = e.offsetY; tOffsetV = trgt.offsetHeight; tClass = 'e-rowresize';
            if (trgt.parentElement.previousElementSibling) {
                newTrgt = <HTMLElement>trgt.parentElement.previousElementSibling.firstElementChild;
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
            let resEle: HTMLCollectionOf<Element> = (tClass === 'e-colresize' ? trgt.parentElement.getElementsByClassName(tClass)
                : this.parent.getRowHeaderTable().getElementsByClassName(tClass)) as HTMLCollectionOf<Element>;
            for (let index: number = 0; index < resEle.length; index++) {
                resEle[index].classList.remove(tClass);
            }
        }
    }

    private updateTarget(e: MouseEvent, trgt: HTMLElement): void {
        if (closest(trgt, '.e-header-row')) {
            if ((trgt.offsetWidth < 10 && e.offsetX < Math.ceil((trgt.offsetWidth - 2) / 2)) || (e.offsetX < 5 &&
                trgt.offsetWidth >= 10) && trgt.classList.contains('e-colresize')) {
                let sheet: SheetModel = this.parent.getActiveSheet();
                let prevIdx: number = Number(this.trgtEle.getAttribute('aria-colindex')) - 2;
                if (trgt.previousElementSibling && !isHiddenCol(sheet, prevIdx)) {
                    this.trgtEle = trgt.previousElementSibling as HTMLElement;
                } else {
                    if (prevIdx > -1) { this.trgtEle.classList.add('e-unhide-column'); }
                }
            }
        } else {
            if ((trgt.offsetHeight < 10 && e.offsetY < Math.ceil((trgt.offsetHeight - 2) / 2)) || (e.offsetY < 5 &&
                trgt.offsetHeight >= 10) && trgt.classList.contains('e-rowresize')) {
                let sheet: SheetModel = this.parent.getActiveSheet();
                let prevIdx: number = Number(trgt.parentElement.getAttribute('aria-rowindex')) - 2;
                if (trgt.parentElement.previousElementSibling || isHiddenRow(sheet, prevIdx)) {
                    if (e.type === 'dblclick' && isHiddenRow(sheet, prevIdx)) {
                        let selectRange: number[] = getSwapRange(getRangeIndexes(this.parent.getActiveSheet().selectedRange));
                        let eventArgs: HideShowEventArgs;
                        if (prevIdx <= selectRange[2] && prevIdx > selectRange[0]) {
                            eventArgs = { startIndex: selectRange[0], endIndex: selectRange[2], hide: false, autoFit: true };
                        } else {
                            eventArgs = { startIndex: prevIdx, endIndex: prevIdx, hide: false, autoFit: true };
                        }
                        this.parent.notify(hideShow, eventArgs);
                    } else {
                        if (!isHiddenRow(sheet, prevIdx)) {
                            this.trgtEle = trgt.parentElement.previousElementSibling.getElementsByClassName(
                                'e-header-cell')[0] as HTMLElement;
                        }
                    }
                }
            }
        }
    }

    private setAutoFitHandler(args: { idx: number, isCol: boolean }): void {
        this.setAutofit(args.idx, args.isCol);
    }

    // tslint:disable-next-line:max-func-body-length
    private setAutofit(idx: number, isCol?: boolean, prevData?: string): void {
        let index: number = 0;
        let sheet: SheetModel = this.parent.getActiveSheet();
        let mainContent: Element = this.parent.getMainContent();
        let oldValue: string = isCol ? `${getColumnWidth(this.parent.getActiveSheet(), idx)}px` :
            `${getRowHeight(this.parent.getActiveSheet(), idx)}px`;
        let contentClone: HTMLElement[] = [];
        let contentTable: HTMLElement = mainContent.getElementsByClassName('e-content-table')[0] as HTMLElement;
        if (this.parent.getActiveSheet().showHeaders) {
        let headerTable: HTMLElement = isCol ? this.parent.getColHeaderTable() : this.parent.getRowHeaderTable();
        let headerRow: HTMLCollectionOf<HTMLTableRowElement> =
            headerTable.getElementsByTagName('tr') as HTMLCollectionOf<HTMLTableRowElement>;
        }
        let headerText: HTMLElement; let isWrap: boolean = false;
        if (isCol) {
            let rowLength: number = sheet.rows.length;
            for (let rowIdx: number = 0; rowIdx < rowLength; rowIdx++) {
                if (sheet.rows[rowIdx] && sheet.rows[rowIdx].cells && sheet.rows[rowIdx].cells[idx]) {
                        if (getCell(rowIdx, idx, sheet).wrap) {
                            isWrap = true;
                        }
                        let td: HTMLElement = this.parent.createElement('td', { className: 'e-cell' });
                        td.textContent = this.parent.getDisplayText(sheet.rows[rowIdx].cells[idx]);
                        if (sheet.rows[rowIdx].cells[idx].style) {
                            let style: CellStyleModel = sheet.rows[rowIdx].cells[idx].style;
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
            let colLength: number = sheet.rows[idx] && sheet.rows[idx].cells ? sheet.rows[idx].cells.length : 0;
            for (let colIdx: number = 0; colIdx < colLength; colIdx++) {
                if (sheet.rows[idx] && sheet.rows[idx].cells[colIdx]) {
                    if (getCell(idx, colIdx, sheet).wrap) {
                        isWrap = true;
                    }
                    let style: CellStyleModel = sheet.rows[idx].cells[colIdx].style;
                    let td: HTMLElement = this.parent.createElement('td');
                    td.textContent = this.parent.getDisplayText(sheet.rows[idx].cells[colIdx]);
                    if (sheet.rows[idx].cells[colIdx].style) {
                        let style: CellStyleModel = sheet.rows[idx].cells[colIdx].style;
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
        let contentFit: number = findMaxValue(contentTable, contentClone, isCol, this.parent, prevData, isWrap);
        if (isCol) {
            contentFit = this.getFloatingElementWidth(contentFit, idx);
        }
        let autofitValue: number = contentFit === 0 ? parseInt(oldValue, 10) : contentFit;
        let threshold: number = parseInt(oldValue, 10) > autofitValue ?
            -(parseInt(oldValue, 10) - autofitValue) : autofitValue - parseInt(oldValue, 10);
        if (isCol) {
            if (idx >= this.parent.viewport.leftIndex && idx <= this.parent.viewport.rightIndex) {
                getColumn(sheet, idx).width = autofitValue > 0 ? autofitValue : 0;
                this.parent.notify(colWidthChanged, { threshold, colIdx: idx });
                this.resizeStart(idx, this.parent.getViewportIndex(idx, true), autofitValue + 'px', isCol, true, prevData);
            } else {
                let oldWidth: number = getColumnWidth(sheet, idx);
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
                this.parent.notify(rowHeightChanged, { threshold: threshold, rowIdx: idx });
                this.resizeStart(idx, this.parent.getViewportIndex(idx), autofitValue + 'px', isCol, true, prevData);
            } else {
                let oldHeight: number = getRowHeight(sheet, idx);
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

    private createResizeHandler(trgt: HTMLElement, className: string): void {
        let editor: HTMLElement = this.parent.createElement('div', { className: className });
        if (trgt.classList.contains('e-colresize')) {
            editor.style.height = this.parent.getMainContent().clientHeight + trgt.offsetHeight + 'px';
            editor.style.left = this.event.clientX - this.parent.element.getBoundingClientRect().left + 'px';
            editor.style.top = '0px';
        } else if (trgt.classList.contains('e-rowresize')) {
            editor.style.width = this.parent.getMainContent().clientWidth + trgt.offsetWidth + 'px';
            editor.style.left = '0px';
            editor.style.top = this.event.clientY
                - this.parent.element.getElementsByClassName('e-sheet-panel')[0].getBoundingClientRect().top + 'px';
        }
        this.parent.element.getElementsByClassName('e-sheet-panel')[0].appendChild(editor);
        this.updateCursor(this.event);
    }

    private setColWidth(index: number, viewportIdx: number, width: number, curWidth: number): void {
        let sheet: SheetModel = this.parent.getActiveSheet();
        let threshold: number = width - curWidth;
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
            this.parent.notify(colWidthChanged, { threshold, colIdx: index });
            this.resizeStart(index, viewportIdx, `${width}px`, true, false, `${curWidth}px`);
            setColumn(sheet, index, { width: width, customWidth: true });
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
        let sheet: SheetModel = this.parent.getActiveSheet();
        let selectedRange: number[] = getRangeIndexes(sheet.selectedRange);
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
        let sheet: SheetModel = this.parent.getActiveSheet();
        let eleHeight: number = parseInt(this.parent.getMainContent().getElementsByTagName('tr')[viewportIdx].style.height, 10);
        let rowHeight: string = height;
        let threshold: number = parseInt(rowHeight, 10) - eleHeight;
        if (threshold < 0 && eleHeight < -(threshold)) {
            threshold = -eleHeight;
        }
        this.parent.notify(rowHeightChanged, { threshold, rowIdx: rowIdx, isCustomHgt: true });
        this.resizeStart(rowIdx, viewportIdx, rowHeight, false, false, prevData);
        setRow(sheet, rowIdx, { height: parseInt(rowHeight, 10) > 0 ? parseInt(rowHeight, 10) : 0, customHeight: true });
    }


    private resizeOn(e: MouseEvent): void {
        let idx: number; let actualIdx: number;
        if (this.trgtEle.classList.contains('e-rowresize')) {
            let sheet: SheetModel = this.parent.getActiveSheet();
            let prevIdx: number = Number(this.trgtEle.parentElement.getAttribute('aria-rowindex')) - 2;
            if (this.isMouseMoved && isHiddenRow(sheet, prevIdx) && this.trgtEle.classList.contains('e-skip-resize') &&
                e.clientY > this.trgtEle.getBoundingClientRect().top) {
                this.trgtEle.classList.remove('e-skip-resize');
                let eventArgs: HideShowEventArgs = { startIndex: prevIdx, endIndex: prevIdx, hide: false, skipAppend: true };
                this.parent.notify(hideShow, eventArgs);
                let rTbody: HTMLElement = this.parent.getRowHeaderTable().tBodies[0];
                let tbody: HTMLElement = this.parent.getContentTable().tBodies[0];
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
            let prevData: string = (this.parent.getMainContent().getElementsByClassName('e-row')[idx] as HTMLElement).style.height;
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
            if (this.trgtEle.parentElement.style.display === 'none') {
                let sheet: SheetModel = this.parent.getActiveSheet();
                let selectedRange: number[] = getSwapRange(getRangeIndexes(sheet.selectedRange));
                if (actualIdx <= selectedRange[2] && actualIdx > selectedRange[0]) {
                    rowHeight = sheet.rows[actualIdx].height; let count: number;
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
        }
    }

    private setWidthAndHeight(trgt: HTMLElement, value: number, isCol: boolean): void {
        if (isCol) {
            trgt.style.width = parseInt(trgt.style.width, 10) + value + 'px';
        } else {
            trgt.style.height = parseInt(trgt.style.height, 10) + value + 'px';
        }
    }

    private resizeStart(idx: number, viewportIdx: number, value: string, isCol?: boolean, isFit?: boolean, prevData?: string): void {
        if (this.parent.getActiveSheet().showHeaders) {
            setResize(viewportIdx, value, isCol, this.parent);
        } else {
            if (isCol) {
                let curEle: HTMLElement =
                 this.parent.element.getElementsByClassName('e-sheet-content')[0].getElementsByTagName('col')[viewportIdx];
                curEle.style.width = value;
            } else {
                let curEle: HTMLElement =
                 this.parent.element.getElementsByClassName('e-sheet-content')[0].getElementsByTagName('tr')[viewportIdx];
                curEle.style.height = value;
            }

        }
        let action: string = isFit ? 'resizeToFit' : 'resize';
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
        let eventArgs: { [key: string]: number[] | boolean } = { filterRange: [], hasFilter: false };
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
     * @return {void}
     */
    public destroy(): void {
        this.unwireEvents();
        this.removeEventListener();
        this.parent = null;
    }
    /**
     * Get the module name.
     * @returns string
     */
    protected getModuleName(): string {
        return 'resize';
    }
}