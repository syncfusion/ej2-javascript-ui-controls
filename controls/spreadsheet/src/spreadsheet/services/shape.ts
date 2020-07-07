import { Spreadsheet } from '../base';
import { getCellPosition } from '../common/index';
import { getRangeIndexes, SheetModel } from '../../workbook/index';
import { EventHandler } from '@syncfusion/ej2-base';

/**
 * Specifes to create or modify overlay.
 * @hidden
 */
export class Overlay {
    private parent: Spreadsheet;
    private minHeight: string = '300px';
    private minWidth: string = '400px';
    private sheetTop: number;
    private sheetLeft: number;
    private isOverlayClicked: boolean = false;
    private isResizerClicked: boolean = false;
    private originalMouseX: number;
    private originalMouseY: number;
    private originalWidth: number;
    private originalHeight: number;
    private originalResizeLeft: number;
    private originalResizeTop: number;
    private originalReorderLeft: number;
    private originalReorderTop: number;
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
    public insertOverlayElement(): void {
        let sheet: SheetModel = this.parent.getActiveSheet();
        let div: HTMLElement = this.parent.createElement('div', {
            id: this.parent.element.id + '_overlay',
            attrs: { 'class': 'e-ss-overlay' },
            styles: 'width: ' + this.minWidth + ';  height: ' + this.minHeight
        });
        let indexes: number[] = getRangeIndexes(sheet.activeCell);
        let pos: { top: number, left: number } = getCellPosition(sheet, indexes);
        div.style.top = pos.top + 'px';
        div.style.left = pos.left + 'px';
        this.parent.getMainContent().appendChild(div);
        this.renderResizeHandles();
        this.addEventListener();
        this.sheetTop = this.parent.getMainContent().getClientRects()[0].top;
        this.sheetLeft = this.parent.getMainContent().getClientRects()[0].left;
    }

    private addEventListener(): void {
        let overlayElem: Element = document.getElementById(this.parent.element.id + '_overlay');
        EventHandler.add(overlayElem, 'mousedown', this.overlayClickHandler, this);
        EventHandler.add(overlayElem, 'mousemove', this.overlayMouseMoveHandler, this);
        EventHandler.add(this.parent.getMainContent(), 'mousemove', this.overlayMouseMoveHandler, this);
        EventHandler.add(document, 'mouseup', this.overlayMouseUpHandler, this);
    }

    private overlayMouseMoveHandler(e: MouseEvent): void {
        let overlayElem: HTMLElement = document.getElementById(this.parent.element.id + '_overlay');
        if (this.isOverlayClicked && this.isResizerClicked) {
            switch (this.resizer) {
                case 'e-ss-overlay-t':
                    const height1: number = Math.max(this.originalMouseY - e.clientY + this.originalHeight, 20);
                    let top: number = e.clientY - ((this.originalMouseY - this.originalResizeTop) + this.sheetTop);
                    if (height1 > 180 && top > -1) {
                        overlayElem.style.height = height1 + 'px';
                        overlayElem.style.top = top + 'px';
                    }
                    break;
                case 'e-ss-overlay-r':
                    const width1: number = this.originalWidth + (e.pageX - this.originalMouseX);
                    if (width1 > 180) {
                        overlayElem.style.width = width1 + 'px';
                    }
                    break;
                case 'e-ss-overlay-b':
                    const height2: number = this.originalHeight + (e.pageY - this.originalMouseY);
                    if (height2 > 180) {
                        overlayElem.style.height = height2 + 'px';
                    }
                    break;
                case 'e-ss-overlay-l':
                    const width2: number = Math.max(this.originalMouseX - e.clientX + this.originalWidth, 20);
                    let left: number = e.clientX - ((this.originalMouseX - this.originalResizeLeft) + this.sheetLeft);
                    if (width2 > 180 && left > -1) {
                        overlayElem.style.width = width2 + 'px';
                        overlayElem.style.left = left + 'px';
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
        }
    }

    private overlayMouseUpHandler(e: MouseEvent): void {
        this.isOverlayClicked = false;
        this.isResizerClicked = false;
    }

    private overlayClickHandler(e: MouseEvent): void {
        this.isOverlayClicked = true;
        let target: HTMLElement = e.target as HTMLElement;
        let overlayElem: HTMLElement = e.target as HTMLElement;
        if (!target.classList.contains('e-ss-overlay')) {
            overlayElem = target.parentElement;
        }
        this.originalReorderLeft = parseInt(overlayElem.style.left, 10); //divLeft
        this.originalReorderTop = parseInt(overlayElem.style.top, 10); // divTop
        this.originalResizeTop = overlayElem.getClientRects()[0].top;
        this.originalResizeLeft = overlayElem.getClientRects()[0].left;
        this.originalMouseX = e.clientX; // posX
        this.originalMouseY = e.clientY; // posY
        this.diffX = this.originalMouseX - this.originalReorderLeft;
        this.diffY = this.originalMouseY - this.originalReorderTop;
        document.getElementById(this.parent.element.id + '_overlay').classList.add('e-ss-overlay-active');
        if (target.classList.contains('e-ss-resizer')) {
            this.resizer = target.classList[0];
            this.originalWidth = parseFloat(getComputedStyle(overlayElem, null).getPropertyValue('width').replace('px', ''));
            this.originalHeight = parseFloat(getComputedStyle(overlayElem, null).getPropertyValue('height').replace('px', ''));
            this.isResizerClicked = true;
        }
    }

    private renderResizeHandles(): void {
        let handles: string[] = ['e-ss-overlay-t', 'e-ss-overlay-r', 'e-ss-overlay-b', 'e-ss-overlay-l'];
        let i: number = 0;
        let handleElem: HTMLElement;
        let overlay: Element = document.getElementById(this.parent.element.id + '_overlay');
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