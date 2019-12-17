import { Spreadsheet } from '../index';
import { closest, EventHandler, isNullOrUndefined } from '@syncfusion/ej2-base';
import { colWidthChanged, rowHeightChanged, beforeHeaderLoaded, contentLoaded, hideShowRow } from '../common/index';
import { findMaxValue, setResize, autoFit, HideShowEventArgs, completeAction } from '../common/index';
import { setRowHeight, isHiddenRow, SheetModel, getColumn, setRow, getRowHeight } from '../../workbook/base/index';
import { getRangeIndexes, getSwapRange } from '../../workbook/common/index';

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
    }

    private autoFit(args: { isRow: boolean, startIndex: number, endIndex: number }): void {
        args.isRow = args.isRow ? false : true; let rowHdrTable: HTMLTableElement = this.parent.getRowHeaderTable();
        for (let i: number = args.startIndex; i <= args.endIndex; i++) {
            this.trgtEle = this.parent.getRow(i, rowHdrTable);
            this.setAutofit(i, args.isRow);
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
        if (this.trgtEle.parentElement.classList.contains('e-hide-end')) {
            let offset: number = this.trgtEle.offsetHeight; let offsetY: number = e.offsetY;
            if ((offset >= 10 && offsetY < 5) || (offset - 2 < 8 && offsetY < Math.ceil((offset - 2) / 2))) {
                this.trgtEle.parentElement.classList.add('e-skip-resize');
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
        let trgt: HTMLElement = this.trgtEle;
        if (trgt.classList.contains('e-colresize') || trgt.classList.contains('e-rowresize')) {
            let colIndx: number = parseInt(trgt.getAttribute('aria-colindex'), 10) - 1;
            let rowIndx: number = parseInt(this.trgtEle.parentElement.getAttribute('aria-rowindex'), 10) - 1;
            if (trgt.classList.contains('e-colresize')) {
                let prevWdt: string = this.parent.getMainContent().getElementsByTagName('col')[colIndx].style.width;
                this.setAutofit(colIndx, true, prevWdt);
            } else if (trgt.classList.contains('e-rowresize')) {
                let prevHgt: string = `${getRowHeight(this.parent.getActiveSheet(), rowIndx)}px`;
                this.setAutofit(rowIndx, false, prevHgt);
            }
        }
    }

    private setTarget(e: MouseEvent): void {
        let trgt: HTMLElement = <HTMLElement>e.target;
        let newTrgt: HTMLElement; let tOffsetV: number; let eOffsetV: number; let tClass: string;
        if (closest(trgt, '.e-header-row')) {
            eOffsetV = e.offsetX; tOffsetV = trgt.offsetWidth; tClass = 'e-colresize';
            if (!isNullOrUndefined(trgt.previousElementSibling)) { newTrgt = <HTMLElement>trgt.previousElementSibling; }
        } else if (closest(trgt, '.e-row')) {
            eOffsetV = e.offsetY; tOffsetV = trgt.offsetHeight; tClass = 'e-rowresize';
            if (isNullOrUndefined(trgt.parentElement.previousElementSibling)) {
                let idx: number = Number(trgt.parentElement.getAttribute('aria-rowindex'));
                if (idx > 1) { newTrgt = trgt; }
            } else {
                newTrgt =
                    <HTMLElement>trgt.parentElement.previousElementSibling.firstElementChild;
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
                trgt.offsetWidth >= 10) && trgt.classList.contains('e-colresize') && trgt.previousElementSibling) {
                this.trgtEle = trgt.previousElementSibling as HTMLElement;
            }
        } else {
            if ((trgt.offsetHeight < 10 && e.offsetY < Math.ceil((trgt.offsetHeight - 2) / 2)) || (e.offsetY < 5 &&
                trgt.offsetHeight >= 10) && trgt.classList.contains('e-rowresize')) {
                let sheet: SheetModel = this.parent.getActiveSheet();
                let prevIdx: number = Number(trgt.parentElement.getAttribute('aria-rowindex')) - 2;
                if (trgt.parentElement.previousElementSibling || isHiddenRow(sheet, prevIdx)) {
                    if (e.type === 'dblclick' && isHiddenRow(sheet, prevIdx) && trgt.parentElement.classList.contains('e-skip-resize')) {
                        let selectRange: number[] = getSwapRange(getRangeIndexes(this.parent.getActiveSheet().selectedRange));
                        let eventArgs: HideShowEventArgs;
                        if (prevIdx <= selectRange[2] && prevIdx > selectRange[0]) {
                            eventArgs = { startRow: selectRange[0], endRow: selectRange[2], hide: false, autoFit: true };
                        } else {
                            eventArgs = { startRow: prevIdx, endRow: prevIdx, hide: false, autoFit: true };
                        }
                        this.parent.notify(hideShowRow, eventArgs);
                        trgt.parentElement.classList.remove('e-skip-resize');
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

    private setAutofit(idx: number, isCol?: boolean, prevData?: string): void {
        let index: number;
        let oldIdx: number = idx;
        if (this.parent.scrollSettings.enableVirtualization) {
            idx = isCol ? idx - this.parent.viewport.leftIndex :
            idx - this.parent.hiddenRowsCount(this.parent.viewport.topIndex, idx) - this.parent.viewport.topIndex;
        }
        let sheet: SheetModel = this.parent.getActiveSheet();
        let mainContent: Element = this.parent.getMainContent();
        let oldValue: string = isCol ?
            mainContent.getElementsByTagName('col')[idx].style.width : mainContent.getElementsByTagName('tr')[idx].style.height;
        let headerTable: HTMLElement = isCol ? this.parent.getColHeaderTable() : this.parent.getRowHeaderTable();
        let contentRow: HTMLCollectionOf<HTMLTableRowElement> =
            mainContent.getElementsByClassName('e-row') as HTMLCollectionOf<HTMLTableRowElement>;
        let contentClone: HTMLElement[] = [];
        let contentTable: HTMLElement =
            mainContent.getElementsByClassName('e-content-table')[0] as HTMLElement;
        let headerRow: HTMLCollectionOf<HTMLTableRowElement> =
            headerTable.getElementsByTagName('tr') as HTMLCollectionOf<HTMLTableRowElement>;
        let headerText: HTMLElement;
        if (isCol) {
            headerText = (<HTMLElement>headerRow[0].getElementsByClassName('e-header-cell')[idx].cloneNode(true));
            for (index = 0; index < contentRow.length; index++) {
                contentClone[index] = contentRow[index].getElementsByTagName('td')[idx].cloneNode(true) as HTMLElement;
            }
        } else {
            headerText = (<HTMLElement>headerRow[idx].getElementsByClassName('e-header-cell')[0].cloneNode(true));
            for (index = 0; index < contentRow[idx].getElementsByTagName('td').length; index++) {
                contentClone[index] = contentRow[idx].getElementsByTagName('td')[index].cloneNode(true) as HTMLElement;
            }
        }
        let headerFit: number = findMaxValue(headerTable, [headerText], isCol, this.parent);
        let contentFit: number = findMaxValue(contentTable, contentClone, isCol, this.parent);
        let autofitValue: number = headerFit < contentFit ? contentFit : headerFit;
        let threshold: number = parseInt(oldValue, 10) > autofitValue ?
            -(parseInt(oldValue, 10) - autofitValue) : autofitValue - parseInt(oldValue, 10);
        if (isCol) {
            getColumn(sheet, oldIdx).width = autofitValue > 0 ? autofitValue : 0;
            this.parent.notify(colWidthChanged, { threshold, colIdx: oldIdx });
        } else {
            setRowHeight(sheet, oldIdx, autofitValue > 0 ? autofitValue : 0);
            this.parent.notify(rowHeightChanged, { threshold: threshold, rowIdx: oldIdx });
        }
        this.resizeStart(oldIdx, idx, autofitValue + 'px', isCol, true, prevData);
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

    private setColWidth(index: number, width: string, prevData?: string): void {
        let sheet: SheetModel = this.parent.getActiveSheet();
        let mIndex: number = index;
        if (this.parent.scrollSettings.enableVirtualization) { mIndex = mIndex + this.parent.viewport.leftIndex; }
        let eleWidth: number = parseInt(this.parent.getMainContent().getElementsByTagName('col')[index].style.width, 10);
        let colWidth: string = width;
        let threshold: number = parseInt(colWidth, 10) - eleWidth;
        if (threshold < 0 && eleWidth < -(threshold)) {
            threshold = -eleWidth;
        }
        let oldIdx: number = parseInt(this.trgtEle.getAttribute('aria-colindex'), 10) - 1;
        this.parent.notify(colWidthChanged, { threshold, colIdx: oldIdx });
        this.resizeStart(index, index, colWidth, true, false, prevData);
        getColumn(sheet, mIndex).width = parseInt(colWidth, 10) > 0 ? parseInt(colWidth, 10) : 0;
        sheet.columns[mIndex].customWidth = true;
        this.parent.setProperties({ sheets: this.parent.sheets }, true);
    }

    private setRowHeight(rowIdx: number, viewportIdx: number, height: string, prevData?: string): void {
        let sheet: SheetModel = this.parent.getActiveSheet();
        let eleHeight: number = parseInt(this.parent.getMainContent().getElementsByTagName('tr')[viewportIdx].style.height, 10);
        let rowHeight: string = height;
        let threshold: number = parseInt(rowHeight, 10) - eleHeight;
        if (threshold < 0 && eleHeight < -(threshold)) {
            threshold = -eleHeight;
        }
        this.parent.notify(rowHeightChanged, { threshold, rowIdx: rowIdx });
        this.resizeStart(rowIdx, viewportIdx, rowHeight, false, false, prevData);
        setRow(sheet, rowIdx, { height: parseInt(rowHeight, 10) > 0 ? parseInt(rowHeight, 10) : 0, customHeight: true });
        this.parent.setProperties({ sheets: this.parent.sheets }, true);
    }


    private resizeOn(e: MouseEvent): void {
        let idx: number; let actualIdx: number;
        if (this.trgtEle.classList.contains('e-rowresize')) {
            let sheet: SheetModel = this.parent.getActiveSheet();
            let prevIdx: number = Number(this.trgtEle.parentElement.getAttribute('aria-rowindex')) - 2;
            if (this.isMouseMoved && isHiddenRow(sheet, prevIdx) && this.trgtEle.parentElement.classList.contains('e-skip-resize') &&
                e.clientY > this.trgtEle.getBoundingClientRect().top) {
                this.trgtEle.parentElement.classList.remove('e-skip-resize');
                let eventArgs: HideShowEventArgs = { startRow: prevIdx, endRow: prevIdx, hide: false, skipAppend: true };
                this.parent.notify(hideShowRow, eventArgs);
                let rTbody: HTMLElement = this.parent.getRowHeaderTable().tBodies[0];
                let tbody: HTMLElement = this.parent.getContentTable().tBodies[0];
                eventArgs.hdrRow.style.display = 'none'; eventArgs.row.style.display = 'none';
                rTbody.insertBefore(eventArgs.hdrRow, rTbody.children[eventArgs.insertIdx]);
                tbody.insertBefore(eventArgs.row, tbody.children[eventArgs.insertIdx]);
                this.trgtEle = <HTMLElement>eventArgs.hdrRow.firstElementChild;
                eventArgs.hdrRow.nextElementSibling.classList.remove('e-hide-end');
            } else {
                if (this.trgtEle.parentElement.classList.contains('e-skip-resize')) {
                    this.trgtEle.parentElement.classList.remove('e-skip-resize');
                    return;
                }
            }
            actualIdx = idx = parseInt(this.trgtEle.parentElement.getAttribute('aria-rowindex'), 10) - 1;
            if (this.parent.scrollSettings.enableVirtualization) {
                idx = idx - this.parent.hiddenRowsCount(this.parent.viewport.topIndex, idx) - this.parent.viewport.topIndex;
            }
            let prevData: string = (this.parent.getMainContent().getElementsByClassName('e-row')[idx] as HTMLElement).style.height;
            let rowHeight: number = e.clientY - this.event.clientY + parseInt(prevData, 10);
            if (rowHeight <= 0) {
                this.parent.showHideRow(true, actualIdx);
                setRow(sheet, actualIdx, { height: 0, customHeight: true });
                this.parent.setProperties({ sheets: this.parent.sheets }, true);
                this.parent.notify(completeAction, { eventArgs:
                    { index: actualIdx, height: '0px', isCol: false, sheetIdx: this.parent.activeSheetTab, oldHeight: prevData },
                    action: 'resize' });
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
                        this.parent.notify(completeAction, { eventArgs:
                            { index: i, height: `${rowHeight}px`, isCol: false, sheetIdx: this.parent.activeSheetTab, oldHeight: prevData },
                            action: 'resize' });
                    }
                    this.parent.setProperties({ sheets: this.parent.sheets }, true);
                    this.parent.showHideRow(false, selectedRange[0], actualIdx - 1);
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
            let mIndex: number = parseInt(this.trgtEle.getAttribute('aria-colindex'), 10) - 1;
            idx = mIndex;
            if (this.parent.scrollSettings.enableVirtualization) { idx = idx - this.parent.viewport.leftIndex; }
            let colWidth: string =
                e.clientX - this.event.clientX +
                parseInt(this.parent.getMainContent().getElementsByTagName('col')[idx].style.width, 10) + 'px';
            this.setColWidth(idx, colWidth, this.parent.getMainContent().getElementsByTagName('col')[idx].style.width);
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
        setResize(viewportIdx, value, isCol, this.parent);
        let action: string = isFit ? 'resizeToFit' : 'resize';
        let eventArgs: object;
        let isAction: boolean;
        if (isCol) {
            eventArgs = { index: idx, width: value, isCol: isCol, sheetIdx: this.parent.activeSheetTab, oldWidth: prevData };
            isAction = prevData !== value;
        } else {
            eventArgs = { index: idx, height: value, isCol: isCol, sheetIdx: this.parent.activeSheetTab, oldHeight: prevData };
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