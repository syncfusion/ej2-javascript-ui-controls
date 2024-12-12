import { Spreadsheet, SpreadsheetModel } from '../../../src/spreadsheet/index';
import { TestHelper } from '../../common/helper.spec';
import { createElement, EmitType, EventHandler, getComponent } from '@syncfusion/ej2-base';

/**
 * Represents the class which contains Helper functions to test Spreadsheet component.
 */
export class SpreadsheetHelper extends TestHelper {

    constructor(id: string) {
        super(id);
        if (!document.querySelector('#' + id)) {
            document.body.appendChild(createElement('div', { id: id }));
        }
    }

    public initializeSpreadsheet(model: SpreadsheetModel = {}, done?: Function): Spreadsheet {
        const sampleCreatedHandler: Function = model.created;
        const createdHandler: EmitType<Object> = () => {
            if (sampleCreatedHandler) {
                sampleCreatedHandler();
            }
            setTimeout(() => {
                if (done) { done(); }
            }, 50);
        };
        model.created = createdHandler;
        return new Spreadsheet(model, '#' + this.id);
    }

    /**
     * Used to get root element or passed selector element of the Spreadsheet component.
     */
    public getElementFromSpreadsheet(elemRefr?: string): HTMLElement {
        return elemRefr ? this.getElement().querySelector(elemRefr) : this.getElement();
    }

    public getRibbonElement(): HTMLElement {
        return this.getElement().querySelector('.e-ribbon');
    }

    public getFormulaBarElement(): HTMLElement {
        return this.getElementFromSpreadsheet('.e-formula-bar-panel');
    }

    public getCellEditorElement(): HTMLElement {
        return this.getElementFromSpreadsheet('.e-spreadsheet-edit');
    }

    public getSheetPanelElement(): HTMLElement {
        return this.getElementFromSpreadsheet('.e-sheet-panel');
    }

    public getContentElement(): HTMLElement {
        return this.getElementFromSpreadsheet('.e-sheet-content');
    }

    public getRowHeaderElement(): HTMLElement {
        return this.getElementFromSpreadsheet('.e-row-header');
    }

    public getColHeaderElement(): HTMLElement {
        return this.getElementFromSpreadsheet('.e-column-header');
    }

    public getContentTableElement(): HTMLTableElement {
        return this.getElementFromSpreadsheet().querySelector('.e-content-table');
    }

    public getSpinnerElement(): HTMLElement {
        return this.getElementFromSpreadsheet('.e-spinner-pane');
    }

    public hasClass(refr: string, element: HTMLElement = this.getElement()): boolean {
        return element.classList.contains(refr);
    }

    public triggerKeyNativeEvent(keyCode: number, isCtrl: boolean = false, isShift: boolean = false,
        element?: Element, type: string = 'keydown', isAltKey: boolean = false, target?: Element): void {
            if (!element) {
                element = this.getElement();
            }
            let eventArg: Event = new Event(type);
            eventArg['keyCode'] = keyCode;
            eventArg['which'] = keyCode;
            eventArg['altKey'] = isAltKey;
            eventArg['shiftKey'] = isShift;
            eventArg['ctrlKey'] = isCtrl;
            if (target) {
                Object.defineProperty(eventArg, 'target', { writable: false, value: target });
            }
            element.dispatchEvent(eventArg);
    }

    public triggerKeyEvent(type: string, keyCode: number, element?: HTMLElement,
        isCtrl: boolean = false, isShift: boolean = false, target?: HTMLElement, args: Object = {}, isAlt?: boolean): void {
            if (!element) {
                element = this.getElement();
            }
            if (!target) {
                target = element;
            }
            let eventArg: Object = this.copyObject(this.getEventObject('Event', type), args);
            eventArg['keyCode'] = keyCode;
            eventArg['which'] = keyCode;
            eventArg['altKey'] = false;
            eventArg['shiftKey'] = isShift;
            eventArg['ctrlKey'] = isCtrl;
            eventArg['altKey'] = isAlt;
            eventArg['target'] = target;
            EventHandler.trigger(element, type, eventArg);
    }

    public triggerMouseAction(type: string, coords?: { x: number, y: number, offsetX?: number, offsetY?: number },
        element?: HTMLElement | Document, target?: HTMLElement, isCtrl?: boolean, isDispatch?: boolean): void {
        if (!element) {
            element = this.getElement();
        }
        if (!coords) {
            coords = { x: 0, y: 0 };
        }
        let eventArg: Object = this.copyObject(this.getEventObject('MouseEvents', type, isCtrl, isDispatch, coords.x, coords.y, target), {});
        this.setMouseCoordinates(eventArg, coords.x, coords.y, target, coords.offsetX, coords.offsetY);
        eventArg['view'] = window;
        eventArg['bubbles'] = true;
        eventArg['cancelable'] =  true;
        EventHandler.trigger(element as HTMLElement, type, eventArg);
    }

    public isEditState(): boolean {
        return this.getInstance().isEdit;
    }

    public copyObject(source: any, destination: any): Object {
        for (let prop in source) {
            destination[prop] = source[prop];
        }
        return destination;
    }

    private setMouseCoordinates(eventarg: any, x: number, y: number, target: Element, offsetX?: number, offsetY?: number): Object {
        eventarg.pageX = x;
        eventarg.pageY = y;
        eventarg.clientX = x;
        eventarg.clientY = y;
        if (offsetX) {
            eventarg.offsetX = offsetX;
        }
        if (offsetY) {
            eventarg.offsetY = offsetY;
        }
        eventarg.target = target;
        return eventarg;
    }

    private getEventObject(eventType: string, eventName: string, isCtrl?: boolean, isDispatch?: boolean, x?: number, y?: number, target?: Element): Object {
        let tempEvent: any = document.createEvent(eventType);
        if (eventType === 'MouseEvents') {
            tempEvent.initMouseEvent(eventName, null, null, null, null, x, y, x, y, isCtrl);
            if (isDispatch) {
                document.dispatchEvent(tempEvent);
            }
        } else {
            tempEvent.initEvent(eventName, true, true);
        }
        let returnObject: any = this.copyObject(tempEvent, {});
        returnObject.preventDefault = () => { return true; };
        return returnObject;
    }

    public click(refr: string): void {
        if (refr[0] !== '#' && refr[0] !== '.') {
            refr = '#' + this.id + refr;
            this.getElementFromSpreadsheet(refr).click();
        } else {
            this.getElement(refr).click();
        }
    }

    public edit(address: string, value: string): void {
        const spreadsheet: Spreadsheet = this.getInstance();
        spreadsheet.selectRange(address);
        (spreadsheet as any).editModule.startEdit();
        (spreadsheet as any).editModule.editCellData.value = value;
        spreadsheet.endEdit();
    }

    public editInUI(value: string, address?: string): void {
        let spreadsheet: Spreadsheet = this.getInstance();
        if (address) {
            spreadsheet.selectRange(address);
        }
        spreadsheet.startEdit();
        this.getElementFromSpreadsheet('.e-spreadsheet-edit').textContent = value;
        spreadsheet.endEdit();
    }

    public setAnimationToNone(selector: string, isTab?: boolean): void {
        if (isTab) {
            const tabObj: any = getComponent(this.getElement(selector), 'tab');
            tabObj.animation.next.effect = 'None';
            tabObj.animation.previous.effect = 'None';
            tabObj.dataBind();
        } else {
            (document.querySelector(selector) as any).ej2_instances[0].animationSettings.effect = 'None';
        }
    }

    public openAndClickCMenuItem(rowIdx: number, colIdx: number, children?: number[], isRowHdr?: boolean, isColHdr?: boolean, checkFn?: Function, isSheetTab?: boolean, tabEle?: HTMLElement): void {
        let td: HTMLElement;
        let item: HTMLElement;
        const cMenu: HTMLElement = this.getElement('.e-spreadsheet-contextmenu');
        if (isRowHdr) {
            td = this.invoke('getRowHeaderTable').rows[rowIdx].cells[colIdx];
        } else if(isColHdr) {
            td = this.invoke('getColHeaderTable').rows[rowIdx].cells[colIdx];
        } else if(isSheetTab) {
            td = tabEle;
        } else {
            td = this.invoke('getCell', [rowIdx, colIdx]);
        }
        this.triggerMouseAction('contextmenu', { x: td.getBoundingClientRect().left + 1, y: td.getBoundingClientRect().top + 1 }, null, td);
        children && children.forEach((childIdx: number, idx: number) => {
            if (children.length - 1 === idx) {
                if (checkFn) {
                    checkFn();
                }
                (cMenu.querySelector('ul:nth-child(' + (idx + 1) + ') li:nth-child(' + childIdx + ')') as HTMLElement).click();
            } else {
                item = cMenu.querySelector('ul:nth-child(' + (idx + 1) + ') li:nth-child(' + childIdx + ')');
                this.triggerMouseAction('mouseover', { x: item.getBoundingClientRect().left + 10, y: item.getBoundingClientRect().top + 10 }, cMenu, item);
            }
        });
    }

    public switchRibbonTab(selectedItem: number): void {
        const ribbonTabObj: any = getComponent(this.getElementFromSpreadsheet('.e-tab'), 'tab');
        ribbonTabObj.selectedItem = selectedItem;
        ribbonTabObj.dataBind();
    }
}
