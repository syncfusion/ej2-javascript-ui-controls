import { Spreadsheet, SpreadsheetModel } from '../../../src/spreadsheet/index';
import { TestHelper } from '../../common/helper.spec';
import { createElement, EmitType, EventHandler } from '@syncfusion/ej2-base';

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

    initializeSpreadsheet(model: SpreadsheetModel = {}, done?: Function): void {
        let dataBound: EmitType<Object> = () => {
            setTimeout(() => {
                if (done) { done(); }
            }, 500);
        };
        let options: SpreadsheetModel = {
            dataBound: dataBound,
            ...model
        };
        new Spreadsheet(options, '#' + this.id);
    }

    /**
     * Used to get root element or passed selector element of the Spreadsheet component.
     */
    getElementFromSpreadsheet(elemRefr?: string): HTMLElement {
        return elemRefr ? this.getElement().querySelector(elemRefr) : this.getElement();
    }

    getRibbonElement(): HTMLElement {
        return this.getElement().querySelector('.e-ribbon');
    }

    getFormulaBarElement(): HTMLElement {
        return this.getElementFromSpreadsheet('.e-formula-bar-panel');
    }

    getCellEditorElement(): HTMLElement {
        return this.getElementFromSpreadsheet('.e-spreadsheet-edit');
    }

    getSheetPanelElement(): HTMLElement {
        return this.getElementFromSpreadsheet('.e-sheet-panel');
    }

    getContentElement(): HTMLElement {
        return this.getElementFromSpreadsheet('.e-main-content');
    }

    getRowHeaderElement(): HTMLElement {
        return this.getElementFromSpreadsheet('.e-row-header');
    }

    getColHeaderElement(): HTMLElement {
        return this.getElementFromSpreadsheet('.e-column-header');
    }

    getContentTableElement(): HTMLTableElement {
        return this.getElementFromSpreadsheet().querySelector('.e-content-table');
    }

    getSpinnerElement(): HTMLElement {
        return this.getElementFromSpreadsheet('.e-spinner-pane');
    }

    hasClass(refr: string, element: HTMLElement = this.getElement()): boolean {
        return element.classList.contains(refr);
    }

    triggerKeyNativeEvent(keyCode: number, isCtrl: boolean = false, isShift: boolean = false,
        element?: HTMLElement, type: string = 'keydown'): void {
            if (!element) {
                element = this.getElement();
            }
            let eventArg: Event = new Event(type);
            eventArg['keyCode'] = keyCode;
            eventArg['which'] = keyCode;
            eventArg['altKey'] = false;
            eventArg['shiftKey'] = isShift;
            eventArg['ctrlKey'] = isCtrl;
            element.dispatchEvent(eventArg);
    }

    triggerKeyEvent(type: string, keyCode: number, element?: HTMLElement,
        isCtrl: boolean = false, isShift: boolean = false, target?: HTMLElement, args: Object = {}): void {
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
            eventArg['target'] = target;
            EventHandler.trigger(element, type, eventArg);
    }

    triggerMouseAction(type: string, coords?: { x: number, y: number },
        element?: HTMLElement | Document, target?: HTMLElement): void {
        if (!element) {
            element = this.getElement();
        }
        let eventArg: Object = this.copyObject(this.getEventObject('MouseEvents', type), {});
        if (!coords) {
            coords = { x: 0, y: 0 };
        }
        this.setMouseCoordinates(eventArg, coords.x, coords.y, target);
        eventArg['view'] = window;
        eventArg['bubbles'] = true;
        eventArg['cancelable'] =  true;
        EventHandler.trigger(element as HTMLElement, type, eventArg);
    }

    isEditState(): boolean {
        return this.getInstance().isEdit;
    }

    copyObject(source: any, destination: any): Object {
        for (let prop in source) {
            destination[prop] = source[prop];
        }
        return destination;
    }
    
    private setMouseCoordinates(eventarg: any, x: number, y: number, target: Element): Object {
        eventarg.pageX = x;
        eventarg.pageY = y;
        eventarg.clientX = x;
        eventarg.clientY = y;
        eventarg.target = target;
        return eventarg;
    }

    private getEventObject(eventType: string, eventName: string): Object {
        let tempEvent: any = document.createEvent(eventType);
        tempEvent.initEvent(eventName, true, true);
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
}
