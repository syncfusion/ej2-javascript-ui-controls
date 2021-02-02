import { Spreadsheet } from '../base';
import { getCellPosition, refreshImgCellObj, BeforeImageRefreshData, refreshChartCellObj } from '../common/index';
import { getRangeIndexes, SheetModel, refreshChartSize, focusChartBorder } from '../../workbook/index';
import { EventHandler, removeClass, closest } from '@syncfusion/ej2-base';

/**
 * Specifes to create or modify overlay.
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

    /**
     * Constructor for initializing Overlay service.
     */
    constructor(parent: Spreadsheet) {
        this.parent = parent;
    }

    /**
     * To insert a shape.
     * @hidden
     */
    public insertOverlayElement(id: string, range: string, sheetIndex: number): HTMLElement {
        let div: HTMLElement = this.parent.createElement('div', {
            id: id,
            attrs: { 'class': 'e-ss-overlay' },
            styles: 'width: ' + this.minWidth + ';  height: ' + this.minHeight
        });
        let indexes: number[] = getRangeIndexes(range);
        let sheet: SheetModel = this.parent.sheets[sheetIndex];
        let pos: { top: number, left: number } = getCellPosition(sheet, indexes);
        div.style.top = pos.top + 'px';
        div.style.left = pos.left + 'px';
        this.parent.getMainContent().appendChild(div);
        this.renderResizeHandles(div);
        this.addEventListener(div);
        this.originalWidth = parseFloat(getComputedStyle(div, null).getPropertyValue('width').replace('px', ''));
        this.originalHeight = parseFloat(getComputedStyle(div, null).getPropertyValue('height').replace('px', ''));
        return div;
    }

    private addEventListener(div: HTMLElement): void {
        let overlayElem: Element = div;
        EventHandler.add(overlayElem, 'mousedown', this.overlayClickHandler, this);
        EventHandler.add(overlayElem, 'mousemove', this.overlayMouseMoveHandler, this);
        EventHandler.add(this.parent.getMainContent(), 'mousemove', this.overlayMouseMoveHandler, this);
        EventHandler.add(document, 'mouseup', this.overlayMouseUpHandler, this);
    }

    private overlayMouseMoveHandler(e: MouseEvent): void {
        let target: HTMLElement = e.target as HTMLElement;
        let overlayElem: HTMLElement = document.getElementsByClassName('e-ss-overlay-active')[0] as HTMLElement;
        if (this.isOverlayClicked && this.isResizerClicked) {
            switch (this.resizer) {
                case 'e-ss-overlay-t':
                    const height1: number = Math.max(this.originalMouseY - e.clientY + this.originalHeight, 20);
                    let top: number = e.clientY - (this.originalMouseY - this.originalResizeTop);
                    if (height1 > 180 && top > -1) {
                        overlayElem.style.height = height1 + 'px';
                        overlayElem.style.top = top + 'px';
                        this.resizedReorderTop = top; // resized divTop
                        this.currenHeight = height1;
                        this.parent.notify(refreshChartSize, {
                            height: overlayElem.style.height, width: overlayElem.style.width, overlayEle: overlayElem });
                    }
                    break;
                case 'e-ss-overlay-r':
                    const width1: number = this.originalWidth + (e.pageX - this.originalMouseX);
                    if (width1 > 180) {
                        overlayElem.style.width = width1 + 'px';
                        this.currentWidth = width1;
                        this.parent.notify(refreshChartSize, {
                            height: overlayElem.style.height, width: overlayElem.style.width, overlayEle: overlayElem });
                    }
                    break;
                case 'e-ss-overlay-b':
                    const height2: number = this.originalHeight + (e.pageY - this.originalMouseY);
                    if (height2 > 180) {
                        overlayElem.style.height = height2 + 'px';
                        this.currenHeight = height2;
                        this.parent.notify(refreshChartSize, {
                            height: overlayElem.style.height, width: overlayElem.style.width, overlayEle: overlayElem });
                    }
                    break;
                case 'e-ss-overlay-l':
                    const width2: number = Math.max(this.originalMouseX - e.clientX + this.originalWidth, 20);
                    let left: number = e.clientX - (this.originalMouseX - this.originalResizeLeft);
                    if (width2 > 180 && left > -1) {
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
            let posX: number = e.clientX;
            let posY: number = e.clientY;
            let aX: number = posX - this.diffX;
            let aY: number = posY - this.diffY;
            if (aX > -1) {
                overlayElem.style.left = aX + 'px';
            }
            if (aY > -1) {
                overlayElem.style.top = aY + 'px';
            }
            this.resizedReorderLeft = aX; //resized divLeft
            this.resizedReorderTop = aY; // resized divTop
        }
    }
    private overlayMouseUpHandler(e: MouseEvent): void {
        if (this.parent.getActiveSheet().isProtected) {
            return;
        }
        this.isOverlayClicked = false;
        this.isResizerClicked = false;
        let elem: HTMLElement = (e.target as HTMLElement);
        if (!elem.classList.contains('e-ss-overlay')) {
            elem = closest(e.target as Element, '.e-datavisualization-chart') ?
             closest(e.target as Element, '.e-datavisualization-chart') as HTMLElement : elem;
        }
        let eventArgs: BeforeImageRefreshData = {
            prevTop: this.originalReorderTop, prevLeft: this.originalReorderLeft,
            currentTop: this.resizedReorderTop ? this.resizedReorderTop : this.originalReorderTop, currentLeft: this.resizedReorderLeft ?
                this.resizedReorderLeft : this.originalReorderLeft, id: elem.id, currentHeight: this.currenHeight,
                 currentWidth: this.currentWidth, requestType: 'imageRefresh',
            prevHeight: this.originalHeight, prevWidth: this.originalWidth
        };
        if (elem.id.indexOf('overlay') > 0 || elem.classList.contains('e-ss-resizer')) {
            if (this.originalReorderTop !== this.resizedReorderTop || this.originalReorderLeft !== this.resizedReorderLeft) {
                eventArgs.id = elem.id;
                if (elem.classList.contains('e-datavisualization-chart')) {
                    eventArgs.requestType = 'chartRefresh';
                    this.parent.notify(refreshChartCellObj, eventArgs);
                }
                this.parent.notify(refreshImgCellObj, eventArgs);
                this.resizedReorderTop = this.originalReorderTop;
                this.resizedReorderLeft = this.originalReorderLeft;
            } else if (this.currenHeight !== this.originalHeight || this.originalWidth !== this.currentWidth) {
                eventArgs.id = elem.id.indexOf('overlay') > 0 ? elem.id : elem.parentElement.id;
                if (elem.classList.contains('e-datavisualization-chart')) {
                    eventArgs.requestType = 'chartRefresh';
                    this.parent.notify(refreshChartCellObj, eventArgs);
                }
                this.parent.notify(refreshImgCellObj, eventArgs);
                this.originalHeight = this.currenHeight;
                this.originalWidth = this.currentWidth;
            }
        }
    }

    private overlayClickHandler(e: MouseEvent): void {
        if (this.parent.getActiveSheet().isProtected) {
            return;
        }
        this.isOverlayClicked = true;
        let target: HTMLElement = e.target as HTMLElement;
        let overlayElem: HTMLElement = e.target as HTMLElement;
        if (!target.classList.contains('e-ss-overlay')) {
            overlayElem = target.parentElement;
            if (closest(e.target as Element, '.e-datavisualization-chart')) {
                overlayElem = closest(e.target as Element, '.e-datavisualization-chart') as HTMLElement;
                this.currentWidth = parseFloat(getComputedStyle(overlayElem, null).getPropertyValue('width').replace('px', ''));
                this.currenHeight = parseFloat(getComputedStyle(overlayElem, null).getPropertyValue('height').replace('px', ''));
            }
        }
        this.originalReorderLeft = parseInt(overlayElem.style.left, 10); //divLeft
        this.originalReorderTop = parseInt(overlayElem.style.top, 10); // divTop
        this.resizedReorderLeft = parseInt(overlayElem.style.left, 10); //resized divLeft
        this.resizedReorderTop = parseInt(overlayElem.style.top, 10); // resized divTop
        this.originalResizeTop = this.originalReorderTop;
        this.originalResizeLeft = this.originalReorderLeft;
        this.originalMouseX = e.clientX; // posX
        this.originalMouseY = e.clientY; // posY
        this.diffX = this.originalMouseX - this.originalReorderLeft;
        this.diffY = this.originalMouseY - this.originalReorderTop;
        let actOverlayElem: HTMLElement = document.getElementsByClassName('e-ss-overlay-active')[0] as HTMLElement;
        if (actOverlayElem) {
            removeClass([actOverlayElem], 'e-ss-overlay-active');
        }
        document.getElementById(overlayElem.id).classList.add('e-ss-overlay-active');
        if (target.classList.contains('e-ss-resizer')) {
            this.resizer = target.classList[0];
            this.originalWidth = parseFloat(getComputedStyle(overlayElem, null).getPropertyValue('width').replace('px', ''));
            this.originalHeight = parseFloat(getComputedStyle(overlayElem, null).getPropertyValue('height').replace('px', ''));
            this.isResizerClicked = true;
        }
        if (overlayElem.classList.contains('e-datavisualization-chart')) {
           this.parent.notify(focusChartBorder, { id : overlayElem.id});
        }
    }

    private renderResizeHandles(div: HTMLElement): void {
        let handles: string[] = ['e-ss-overlay-t', 'e-ss-overlay-r', 'e-ss-overlay-b', 'e-ss-overlay-l'];
        let i: number = 0;
        let handleElem: HTMLElement;
        let overlay: Element = div;
        while (handles.length > i) {
            handleElem = this.parent.createElement('div', {
                attrs: { 'class': handles[i] + ' ' + 'e-ss-resizer' },
                styles: 'width: 8px; height: 8px; border-radius: 4px;'
            });
            overlay.appendChild(handleElem);
            i++;
        }
    }

    private removeEventListener(): void {
        let overlayElem: Element = document.getElementById(this.parent.element.id + '_overlay');
        EventHandler.remove(overlayElem, 'mousedown', this.overlayClickHandler);
        EventHandler.remove(overlayElem, 'mousemove', this.overlayMouseMoveHandler);
        EventHandler.remove(this.parent.getMainContent(), 'mousemove', this.overlayMouseMoveHandler);
        EventHandler.remove(document, 'mouseup', this.overlayMouseUpHandler);
    }

    /**
     * To clear private variables.
     */
    public destroy(): void {
        this.removeEventListener();
        this.parent = null;
    }
}