import { Spreadsheet, removeDesignChart, clearChartBorder } from '../index';
import { getCellPosition, refreshImgCellObj, BeforeImageRefreshData, refreshChartCellObj, insertDesignChart, refreshOverlayElem } from '../common/index';
import { getRowIdxFromClientY, getColIdxFromClientX, overlayEleSize, getStartEvent, getMoveEvent, selectionStatus } from '../common/index';
import { getEndEvent, getClientX, getClientY, spreadsheetDestroyed, getPageX, getPageY, isTouchMove } from '../common/index';
import { getRangeIndexes, SheetModel, refreshChartSize, focusChartBorder, getRowsHeight, getCellIndexes, addDPRValue } from '../../workbook/index';
import { getColumnsWidth, ChartModel, ExtendedChartModel } from '../../workbook/index';
import { EventHandler, removeClass, closest, isNullOrUndefined, Browser } from '@syncfusion/ej2-base';
import { focus } from '../common/index';

/**
 * Specifes to create or modify overlay.
 *
 * @hidden
 */
export class Overlay {
    private parent: Spreadsheet;
    private minHeight: string = '300px';
    private minWidth: string = '400px';
    private isOverlayClicked: boolean = false;
    private isResizerClicked: boolean = false;
    private originalMouseX: number;
    private originalMouseY: number;
    private originalWidth: number;
    private originalHeight: number;
    private currentWidth: number = 400;
    private currenHeight: number = 300;
    private originalResizeLeft: number;
    private originalResizeTop: number;
    private originalReorderLeft: number;
    private originalReorderTop: number;
    private resizedReorderLeft: number;
    private resizedReorderTop: number;
    private resizer: string;
    private diffX: number;
    private diffY: number;
    private prevX: number;
    private prevY: number;
    private mouseUpHandler: Function;

    /**
     * Constructor for initializing Overlay service.
     *
     *  @param {Spreadsheet} parent - Specifies the Spreadsheet instance.
     */
    constructor(parent: Spreadsheet) {
        this.parent = parent;
        this.parent.on(selectionStatus, this.isOverlaySelected, this);
        this.parent.on(refreshOverlayElem, this.refreshOverlayElem, this);
        this.parent.on(spreadsheetDestroyed, this.destroy, this);
    }

    /**
     * To insert a shape.
     *
     * @param {string} id - Specifies the id.
     * @param {string} range - Specifies the range.
     * @param {number} sheetIndex - Specifies the sheet index.
     * @returns {HTMLElement} - Returns div element
     * @hidden
     */
    public insertOverlayElement(id: string, range: string, sheetIndex: number): { element: HTMLElement, top: number, left: number } {
        const div: HTMLElement = this.parent.createElement('div', {
            id: id,
            attrs: { 'class': 'e-ss-overlay' },
            styles: 'width: ' + this.minWidth + ';  height: ' + this.minHeight
        });
        if (this.parent.allowEditing) {
            const actOverlayElem: HTMLElement = this.parent.element.getElementsByClassName('e-ss-overlay-active')[0] as HTMLElement;
            if (actOverlayElem) {
                removeClass([actOverlayElem], 'e-ss-overlay-active');
                this.parent.notify(removeDesignChart, {});
            }
            div.classList.add('e-ss-overlay-active');
        }
        const indexes: number[] = getRangeIndexes(range);
        const sheet: SheetModel = this.parent.sheets[sheetIndex as number];
        const frozenRow: number = this.parent.frozenRowCount(sheet);
        const frozenCol: number = this.parent.frozenColCount(sheet);
        const pos: { top: number, left: number } = getCellPosition(
            sheet, indexes, frozenRow, frozenCol, this.parent.viewport.beforeFreezeHeight, this.parent.viewport.beforeFreezeWidth,
            this.parent.sheetModule.colGroupWidth, true);
        if (indexes[0] >= frozenRow && indexes[1] < frozenCol) {
            const mainPanel: HTMLElement = this.parent.sheetModule.contentPanel;
            if (mainPanel.scrollTop) {
                pos.top -= mainPanel.scrollTop; pos.top +=
                    this.parent.getColumnHeaderContent().parentElement.getBoundingClientRect().height;
            }
        }
        if (indexes[1] >= frozenCol && indexes[0] < frozenRow) {
            const scrollPanel: HTMLElement = this.parent.getScrollElement();
            if (scrollPanel.scrollLeft) {
                pos.left -= scrollPanel.scrollLeft; pos.left += this.parent.sheetModule.getRowHeaderWidth(sheet);
            }
        }
        let parent: Element;
        if (indexes[0] < frozenRow || indexes[1] < frozenCol) {
            parent = this.parent.element.querySelector('#' + this.parent.element.id + '_sheet');
            if (frozenRow) {
                if (indexes[0] >= frozenRow) {
                    pos.top += (sheet.showHeaders ? 31 : 0) + getRowsHeight(sheet, getCellIndexes(sheet.topLeftCell)[0], frozenRow - 1);
                } else if (!frozenCol) {
                    pos.left += this.parent.sheetModule.getRowHeaderWidth(sheet, true);
                }
            }
            if (frozenCol) {
                if (indexes[1] >= frozenCol) {
                    pos.left += this.parent.sheetModule.getRowHeaderWidth(sheet);
                } else if (!frozenRow) {
                    pos.left += (sheet.showHeaders ? 31 : 0);
                }
            }
        } else {
            parent = this.parent.getMainContent();
        }
        div.style.top = Number(addDPRValue(pos.top).toFixed(2)) + 'px';
        div.style.left = Number(addDPRValue(pos.left).toFixed(2)) + 'px';
        if (sheetIndex === this.parent.activeSheetIndex) {
            parent.appendChild(div);
            this.renderResizeHandler(div);
            this.addEventListener(div);
        } else if (this.parent.isPrintingProcessing) {
            div.style.visibility = 'hidden';
            document.body.append(div);
        }
        this.originalWidth = parseFloat(getComputedStyle(div, null).getPropertyValue('width').replace('px', ''));
        this.originalHeight = parseFloat(getComputedStyle(div, null).getPropertyValue('height').replace('px', ''));
        return { element: div, top: pos.top, left: pos.left };
    }

    /**
     * To adjust the layout inside freeze pane.
     *
     * @hidden
     * @param {ChartModel} model - Specifies the id.
     * @param {HTMLElement} element - Specifies the range.
     * @param {string} range - Specifies the sheet index.
     * @returns {void}
     */
    public adjustFreezePaneSize(model: ChartModel, element: HTMLElement, range: string): void {
        const indexes: number[] = getRangeIndexes(range); const sheet: SheetModel = this.parent.getActiveSheet();
        const frozenRow: number = this.parent.frozenRowCount(sheet); const frozenCol: number = this.parent.frozenColCount(sheet);
        if (indexes[0] < frozenRow || indexes[1] < frozenCol) {
            if (!isNullOrUndefined(model.top)) {
                element.style.top = model.top + (sheet.showHeaders ? 31 : 0) - this.parent.viewport.beforeFreezeHeight + 'px';
            }
            if (!isNullOrUndefined(model.left)) {
                element.style.left = model.left + this.parent.sheetModule.getRowHeaderWidth(sheet, true) -
                    this.parent.viewport.beforeFreezeWidth + 'px';
            }
        } else {
            if (!isNullOrUndefined(model.top)) {
                element.style.top = model.top - this.parent.viewport.beforeFreezeHeight - (frozenRow ? getRowsHeight(
                    sheet, getCellIndexes(sheet.topLeftCell)[0], frozenRow - 1) : 0) + 'px';
            }
            if (!isNullOrUndefined(model.left)) {
                element.style.left = model.left - this.parent.viewport.beforeFreezeWidth - (frozenCol ? getColumnsWidth(
                    sheet, getCellIndexes(sheet.topLeftCell)[1], frozenCol - 1) : 0) + 'px';
            }
        }
        if (isNullOrUndefined(model.top)) {
            const startTop: number = getCellIndexes(sheet.topLeftCell)[0];
            model.top = this.parent.viewport.beforeFreezeHeight + (frozenRow && startTop === indexes[0] ? 0 : getRowsHeight(
                sheet, frozenRow ? startTop : 0, indexes[0] - 1));
        }
        if (isNullOrUndefined(model.left)) {
            const startLeft: number = getCellIndexes(sheet.topLeftCell)[1];
            model.left = this.parent.viewport.beforeFreezeWidth + (frozenCol && startLeft === indexes[1] ? 0 : getColumnsWidth(
                sheet, frozenCol ? startLeft : 0, indexes[1] - 1));
        }
    }

    private addEventListener(div: HTMLElement): void {
        const overlayElem: Element = div;
        EventHandler.add(overlayElem, getStartEvent(), this.overlayClickHandler, this);
        EventHandler.add(overlayElem, getMoveEvent(), this.overlayMouseMoveHandler, this);
        EventHandler.add(
            this.parent.element.querySelector('#' + this.parent.element.id + '_sheet'), getMoveEvent(), this.overlayMouseMoveHandler, this);
        if (!this.mouseUpHandler) {
            this.mouseUpHandler = this.overlayMouseUpHandler;
            EventHandler.add(document, getEndEvent(), this.mouseUpHandler, this);
        }
        this.parent.on(overlayEleSize, this.setOriginalSize, this);
    }

    private setOriginalSize(args: { height: number, width: number }): void {
        this.originalHeight = args.height;
        this.originalWidth = args.width;
    }

    private overlayMouseMoveHandler(e: MouseEvent & TouchEvent): void {
        const target: HTMLElement = e.target as HTMLElement;
        const overlayElem: HTMLElement = document.getElementsByClassName('e-ss-overlay-active')[0] as HTMLElement;
        const sheet: SheetModel = this.parent.getActiveSheet();
        const checkOffset: number[] = sheet.frozenRows || sheet.frozenColumns ? [29, this.parent.sheetModule.getRowHeaderWidth(
            sheet, true)] : [-1, -1];
        let height1: number;
        let top: number;
        let width1: number;
        let height2: number;
        let width2: number;
        let left: number;
        if (this.isOverlayClicked && this.isResizerClicked) {
            if (isTouchMove(e)) {
                e.preventDefault();
            }
            switch (this.resizer) {
            case 'e-ss-overlay-t':
                height1 = Math.max(this.originalMouseY - getClientY(e) + this.originalHeight, 20);
                top = getClientY(e) - (this.originalMouseY - this.originalResizeTop);
                if (height1 > 20 && top > checkOffset[0]) {
                    overlayElem.style.height = height1 + 'px';
                    overlayElem.style.top = top + 'px';
                    this.resizedReorderTop = top; // resized divTop
                    this.currenHeight = height1;
                    this.parent.notify(refreshChartSize, {
                        height: overlayElem.style.height, width: overlayElem.style.width, overlayEle: overlayElem });
                }
                break;
            case 'e-ss-overlay-r':
                width1 = this.originalWidth + (getPageX(e) - this.originalMouseX);
                if (width1 > 20) {
                    overlayElem.style.width = width1 + 'px';
                    this.currentWidth = width1;
                    this.parent.notify(refreshChartSize, {
                        height: overlayElem.style.height, width: overlayElem.style.width, overlayEle: overlayElem });
                }
                break;
            case 'e-ss-overlay-b':
                height2 = this.originalHeight + (getPageY(e) - this.originalMouseY);
                if (height2 > 20) {
                    overlayElem.style.height = height2 + 'px';
                    this.currenHeight = height2;
                    this.parent.notify(refreshChartSize, {
                        height: overlayElem.style.height, width: overlayElem.style.width, overlayEle: overlayElem });
                }
                break;
            case 'e-ss-overlay-l':
                width2 = Math.max(this.originalMouseX - getClientX(e) + this.originalWidth, 20);
                left = getClientX(e) - (this.originalMouseX - this.originalResizeLeft);
                if (width2 > 20 && left > checkOffset[1]) {
                    overlayElem.style.width = width2 + 'px';
                    overlayElem.style.left = left + 'px';
                    this.resizedReorderLeft = left; //resized divLeft
                    this.currentWidth = width2;
                    this.parent.notify(refreshChartSize, {
                        height: overlayElem.style.height, width: overlayElem.style.width, overlayEle: overlayElem });
                }
                break;
            }
        } else if (this.isOverlayClicked) {
            if (isTouchMove(e)) {
                e.preventDefault();
            }
            if ((closest(target, '.e-sheet') && !target.classList.contains('e-sheet-content')) ||
                target.classList.contains('e-cell')) {
                if (!overlayElem) { return; }
                const aX: number = getClientX(e) - this.diffX; const aY: number = getClientY(e) - this.diffY;
                if (aX > checkOffset[1]) {
                    overlayElem.style.left = aX + 'px';
                }
                if (aY > checkOffset[0]) {
                    overlayElem.style.top = aY + 'px';
                }
                this.resizedReorderLeft = aX < 0 ? 0 : aX; //resized divLeft
                this.resizedReorderTop = aY < 0 ? 0 : aY; // resized divTop
            } else {
                this.overlayMouseUpHandler(e, true);
            }
        }
    }
    private overlayMouseUpHandler(e: MouseEvent & TouchEvent, isMouseUp?: boolean): void {
        if (!this.parent || this.parent.getActiveSheet().isProtected || !this.parent.allowEditing) {
            return;
        }
        this.isResizerClicked = false;
        let elem: HTMLElement = (e.target as HTMLElement);
        const overlayElems: HTMLCollectionOf<Element> =
            document.getElementsByClassName('e-datavisualization-chart e-ss-overlay-active');
        if (!elem.classList.contains('e-ss-overlay')) {
            elem = closest(e.target as Element, '.e-datavisualization-chart') ?
                closest(e.target as Element, '.e-datavisualization-chart') as HTMLElement : elem;
        }
        const sheet: SheetModel = this.parent.getActiveSheet();
        const eventArgs: BeforeImageRefreshData = {
            prevTop: sheet.frozenRows || sheet.frozenColumns ? this.prevY : this.originalReorderTop,
            prevLeft: sheet.frozenRows || sheet.frozenColumns ? this.prevX : this.originalReorderLeft,
            currentTop: this.resizedReorderTop >= 0 ? parseInt(this.resizedReorderTop.toString(), 10) : this.originalReorderTop,
            currentLeft: this.resizedReorderLeft >= 0 ? parseInt(this.resizedReorderLeft.toString(), 10) : this.originalReorderLeft,
            id: elem.id, currentHeight: this.currenHeight, currentWidth: this.currentWidth,
            requestType: 'imageRefresh', prevHeight: this.originalHeight, prevWidth: this.originalWidth
        };
        if (this.isOverlayClicked || isMouseUp) {
            let currRowIdx: { clientY: number, isImage?: boolean, target?: Element, size?: number, isOverlay?: boolean };
            let currColIdx: { clientX: number, isImage?: boolean, target?: Element, size?: number };
            const prevRowIdx: { clientY: number, isImage?: boolean, target?: Element, size?: number, isOverlay?: boolean } =
             { clientY: eventArgs.prevTop, isImage: true };
            const prevColIdx: { clientX: number, isImage?: boolean, target?: Element, size?: number } =
             { clientX: eventArgs.prevLeft, isImage: true };
            const overlayEle: HTMLElement = this.parent.element.getElementsByClassName('e-ss-overlay-active')[0] as HTMLElement;
            const isFreezeAvailable: boolean = !!(sheet.frozenRows || sheet.frozenColumns);
            if (isFreezeAvailable) {
                if (!overlayEle) { return; }
                prevRowIdx.isImage = false; prevColIdx.isImage = false;
                prevRowIdx.target = overlayEle; prevColIdx.target = overlayEle;
                if (eventArgs.prevTop < this.parent.getColumnHeaderContent().getBoundingClientRect().bottom) {
                    prevRowIdx.target = this.parent.getColumnHeaderContent();
                    prevRowIdx.isOverlay = true;
                }
                if (eventArgs.prevLeft < this.parent.getRowHeaderContent().getBoundingClientRect().right) {
                    prevColIdx.target = this.parent.getRowHeaderTable();
                }
                const clientRect: ClientRect = overlayEle.getBoundingClientRect();
                currRowIdx = { clientY: clientRect.top }; currColIdx = { clientX: clientRect.left };
                if (clientRect.top < this.parent.getColumnHeaderContent().getBoundingClientRect().bottom) {
                    currRowIdx.target = this.parent.getColumnHeaderContent();
                    currRowIdx.isOverlay = true;
                }
                if (clientRect.left < this.parent.getRowHeaderContent().getBoundingClientRect().right) {
                    currColIdx.target = this.parent.getRowHeaderTable();
                }
            } else {
                currRowIdx = { clientY: eventArgs.currentTop, isImage: true };
                currColIdx = { clientX: eventArgs.currentLeft, isImage: true };
            }
            this.parent.notify(getRowIdxFromClientY, prevRowIdx); this.parent.notify(getRowIdxFromClientY, currRowIdx);
            this.parent.notify(getColIdxFromClientX, prevColIdx); this.parent.notify(getColIdxFromClientX, currColIdx);
            if (currRowIdx.size) { eventArgs.currentTop = currRowIdx.size; }
            if (currColIdx.size) { eventArgs.currentLeft = currColIdx.size; }
            if (isFreezeAvailable) {
                const chartId: string = overlayEle.id.split('_overlay')[0];
                const prevChart: ExtendedChartModel = this.parent.chartColl.find((chartobj: ChartModel) => chartobj.id === chartId);
                if (prevChart && prevChart.address) {
                    eventArgs.prevRowIdx = prevChart.address[0]; eventArgs.prevColIdx = prevChart.address[1];
                    eventArgs.prevTop = prevChart.top; eventArgs.prevLeft = prevChart.left;
                } else {
                    eventArgs.prevRowIdx = prevRowIdx.clientY; eventArgs.prevColIdx = prevColIdx.clientX;
                }
            } else {
                eventArgs.prevRowIdx = prevRowIdx.clientY; eventArgs.prevColIdx = prevColIdx.clientX;
            }
            eventArgs.currentRowIdx = currRowIdx.clientY; eventArgs.currentColIdx = currColIdx.clientX;
            if ((sheet.frozenColumns || sheet.frozenRows) && !closest(overlayEle, '.e-sheet-content')) {
                const frozenCol: number = this.parent.frozenColCount(sheet); const frozenRow: number = this.parent.frozenRowCount(sheet);
                if (eventArgs.currentRowIdx >= frozenRow && eventArgs.currentColIdx >= frozenCol) {
                    let top: number = parseFloat(overlayEle.style.top); let left: number = parseFloat(overlayEle.style.left);
                    const mainPanel: HTMLElement = this.parent.sheetModule.contentPanel;
                    top += mainPanel.scrollTop; top -= this.parent.getColumnHeaderContent().parentElement.getBoundingClientRect().height;
                    const scrollPanel: HTMLElement = this.parent.getScrollElement();
                    left += scrollPanel.scrollLeft; left -= this.parent.sheetModule.getRowHeaderWidth(sheet);
                    overlayEle.style.top = top + 'px'; overlayEle.style.left = left + 'px';
                    this.parent.getMainContent().appendChild(overlayEle);
                    if (overlayEle.classList.contains('e-datavisualization-chart')) {
                        const chartEle: HTMLElement = overlayEle.querySelector('.e-chart');
                        if (chartEle) {
                            focus(chartEle);
                        }
                    }
                }
            }
            if (overlayElems && overlayElems[0]) {
                if (overlayElems[0].querySelector('.e-control')) {
                    eventArgs.id = overlayElems[0].id;
                }
            }
            if (this.originalReorderTop !== this.resizedReorderTop || this.originalReorderLeft !== this.resizedReorderLeft) {
                eventArgs.id = overlayEle.id;
                if (overlayElems && overlayElems[0]) {
                    eventArgs.requestType = 'chartRefresh';
                    this.parent.notify(refreshChartCellObj, eventArgs);
                } else {
                    this.parent.notify(refreshImgCellObj, eventArgs);
                }
                this.resizedReorderTop = this.originalReorderTop;
                this.resizedReorderLeft = this.originalReorderLeft;
            } else if (this.currenHeight !== this.originalHeight || this.originalWidth !== this.currentWidth) {
                eventArgs.id = elem.id.indexOf('overlay') > 0 ? elem.id : elem.parentElement &&
                    elem.parentElement.classList.contains('e-ss-overlay') ? elem.parentElement.id : overlayEle.id;
                if (overlayElems && overlayElems[0]) {
                    eventArgs.requestType = 'chartRefresh';
                    this.parent.notify(refreshChartCellObj, eventArgs);
                } else {
                    this.parent.notify(refreshImgCellObj, eventArgs);
                }
                this.originalHeight = this.currenHeight;
                this.originalWidth = this.currentWidth;
            }
        }
        this.isOverlayClicked = false;
    }

    private isOverlaySelected(args: { isOverlayClicked: boolean }): void {
        args.isOverlayClicked = this.isOverlayClicked;
    }

    private refreshOverlayElem(args: { selector?: string }): void {
        if (args) {
            const selector: string = '.e-ss-overlay-active' + ((args && args.selector) || '');
            const overlayElem: HTMLElement = this.parent.element.querySelector(selector);
            if (overlayElem) {
                removeClass([overlayElem], 'e-ss-overlay-active');
                this.parent.notify(removeDesignChart, {});
            }
        }
        else {
            const selector: string = 'e-ss-overlay-active';
            const overlayElems: HTMLElement[] =
                Array.from(this.parent.element.getElementsByClassName(selector) as HTMLCollectionOf<HTMLElement>);
            for (let i: number = 0; i < overlayElems.length; i++) {
                const element: HTMLElement = overlayElems[i as number];
                if (element) {
                    removeClass([element], 'e-ss-overlay-active');
                    this.parent.notify(removeDesignChart, {});
                }
            }
        }
        this.parent.notify(clearChartBorder, null);
    }

    private overlayClickHandler(e: TouchEvent & MouseEvent): void {
        if (this.parent.getActiveSheet().isProtected || !this.parent.allowEditing) {
            return;
        }
        this.isOverlayClicked = true;
        const target: HTMLElement = e.target as HTMLElement;
        let overlayElem: HTMLElement = e.target as HTMLElement;
        if (!target.classList.contains('e-ss-overlay')) {
            overlayElem = target.parentElement;
            if (closest(e.target as Element, '.e-datavisualization-chart')) {
                overlayElem = closest(e.target as Element, '.e-datavisualization-chart') as HTMLElement;
            }
        }
        const sheet: SheetModel = this.parent.getActiveSheet();
        if ((sheet.frozenColumns || sheet.frozenRows) && closest(overlayElem, '.e-sheet-content')) {
            let top: number = parseInt(overlayElem.style.top, 10); let left: number = parseInt(overlayElem.style.left, 10);
            const mainPanel: HTMLElement = this.parent.sheetModule.contentPanel;
            top -= mainPanel.scrollTop; top += this.parent.getColumnHeaderContent().parentElement.getBoundingClientRect().height;
            const scrollPanel: HTMLElement = this.parent.getScrollElement();
            left -= scrollPanel.scrollLeft; left += this.parent.sheetModule.getRowHeaderWidth(sheet);
            overlayElem.style.top = top + 'px'; overlayElem.style.left = left + 'px';
            this.parent.element.querySelector('#' + this.parent.element.id + '_sheet').appendChild(overlayElem);
        }
        this.originalWidth = this.currentWidth = parseFloat(overlayElem.style.width);
        this.originalHeight = this.currenHeight = parseFloat(overlayElem.style.height);
        this.originalReorderLeft = parseFloat(overlayElem.style.left); //divLeft
        this.originalReorderTop = parseFloat(overlayElem.style.top); // divTop
        this.resizedReorderLeft = parseFloat(overlayElem.style.left); //resized divLeft
        this.resizedReorderTop = parseFloat(overlayElem.style.top); // resized divTop
        this.originalResizeTop = this.originalReorderTop;
        this.originalResizeLeft = this.originalReorderLeft;
        this.originalMouseX = getClientX(e); // posX
        this.originalMouseY = getClientY(e); // posY
        this.diffX = this.originalMouseX - this.originalReorderLeft;
        this.diffY = this.originalMouseY - this.originalReorderTop;
        const actOverlayElem: HTMLElement = document.getElementsByClassName('e-ss-overlay-active')[0] as HTMLElement;
        if (actOverlayElem) {
            removeClass([actOverlayElem], 'e-ss-overlay-active');
        }
        this.parent.element.querySelector('#' + overlayElem.id).classList.add('e-ss-overlay-active');
        if (target.classList.contains('e-ss-resizer')) {
            this.resizer = target.classList[0];
            this.isResizerClicked = true;
        }
        if (overlayElem.classList.contains('e-datavisualization-chart')) {
            this.parent.notify(focusChartBorder, { id: overlayElem.id });
            if (!actOverlayElem) {
                this.parent.notify(insertDesignChart, { id: overlayElem.id });
            } else if (actOverlayElem.id !== overlayElem.id) {
                this.parent.notify(insertDesignChart, { refreshChartTheme: true });
            }
        }
        const clientRect: ClientRect = overlayElem.getBoundingClientRect();
        this.prevX = clientRect.left; this.prevY = clientRect.top;
    }

    private renderResizeHandler(overlay: HTMLElement): void {
        const handles: string[] = ['e-ss-overlay-t', 'e-ss-overlay-r', 'e-ss-overlay-b', 'e-ss-overlay-l'];
        let idx: number = 0;
        let handleElem: HTMLElement;
        while (idx < handles.length) {
            handleElem = this.parent.createElement(
                'div', { className: handles[idx as number] + ' ' + 'e-ss-resizer' + (Browser.isDevice ? ' e-ss-resizer-touch' : ''),
                    styles: 'width: 8px; height: 8px; border-radius: 4px;' });
            overlay.appendChild(handleElem);
            idx++;
        }
    }

    private removeEventListener(): void {
        const overlays: NodeList = this.parent.element.querySelectorAll('.e-ss-overlay');
        if (overlays.length) { // Added this condition temporarly to handle chart destroy from spec file.
            for (let idx: number = 0; idx < overlays.length; idx++) {
                EventHandler.remove(<Element>overlays[idx as number], getStartEvent(), this.overlayClickHandler);
                EventHandler.remove(<Element>overlays[idx as number], getMoveEvent(), this.overlayMouseMoveHandler);
            }
        }
        const ele: Element = this.parent.element.querySelector('#' + this.parent.element.id + '_sheet');
        if (ele) {
            EventHandler.remove(ele, getMoveEvent(), this.overlayMouseMoveHandler);
        }
        if (document && this.mouseUpHandler) {
            EventHandler.remove(document, getEndEvent(), this.mouseUpHandler);
            this.mouseUpHandler = null;
        }
        if (!this.parent.isDestroyed) {
            this.parent.off(overlayEleSize, this.setOriginalSize);
            this.parent.off(selectionStatus, this.isOverlaySelected);
            this.parent.off(refreshOverlayElem, this.refreshOverlayElem);
            this.parent.off(spreadsheetDestroyed, this.destroy);
        }
    }

    /**
     * To clear private variables.
     *
     * @returns {void}
     */
    public destroy(): void {
        this.removeEventListener();
        if (this.currentWidth) { this.currentWidth = null; }
        if (this.currenHeight) { this.currenHeight = null; }
        if (this.minHeight) { this.minHeight = null; }
        if (this.minWidth) { this.minWidth = null; }
        if (this.isOverlayClicked) { this.isOverlayClicked = null; }
        if (this.isResizerClicked) { this.isResizerClicked = null; }
        this.parent = null;
    }
}
