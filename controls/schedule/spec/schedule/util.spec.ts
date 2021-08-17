/* eslint-disable @typescript-eslint/no-explicit-any */
import { Internationalization, createElement, remove, extend, EventHandler, Ajax, loadCldr } from '@syncfusion/ej2-base';
import { Dialog, Popup, Tooltip } from '@syncfusion/ej2-popups';
import { ResourceDetails, Schedule, ScheduleModel, EJ2Instance, ActionEventArgs, CallbackFunction } from '../../src/schedule/index';
import { cloneDataSource } from './base/datasource.spec';
import * as cls from '../../src/schedule/base/css-constant';
import { RecurrenceEditor, RecurrenceEditorModel } from '../../src/recurrence-editor/index';
import { DataManager } from '@syncfusion/ej2-data';

/**
 * schedule spec utils
 */
const instance: Internationalization = new Internationalization();

(window as TemplateFunction).getTimeIn12 = (value: Date) => instance.formatDate(value, { skeleton: 'hm' });
(window as TemplateFunction).getTimeIn24 = (value: Date) => instance.formatDate(value, { skeleton: 'Hm' });
(window as TemplateFunction).getDateHeaderText = (value: Date) => instance.formatDate(value, { skeleton: 'MEd' });
(window as TemplateFunction).getShortDateTime = (value: Date) => instance.formatDate(value, { type: 'dateTime', skeleton: 'short' });
(window as TemplateFunction).getResourceName = (value: ResourceDetails) => ((value as ResourceDetails).resourceData) ?
    (value as ResourceDetails).resourceData[(value as ResourceDetails).resource.textField] : (value as ResourceDetails).resourceName;

export interface TemplateFunction extends Window {
    getTimeIn12?: CallbackFunction;
    getTimeIn24?: CallbackFunction;
    getDateHeaderText?: CallbackFunction;
    getShortDateTime?: CallbackFunction;
    getResourceName?: CallbackFunction;
}

/**
 * Method to create schedule component
 *
 * @param {ScheduleModel} options Accepts the schedule options
 * @param {Object[] | DataManager} data Accepts the datasource
 * @param {CallbackFunction} done Accepts the callback function
 * @param {HTMLElement} element Accepts the DOM element reference
 * @returns {Schedule} Returns the schedule instance
 * @private
 */
// eslint-disable-next-line max-len
export function createSchedule(options: ScheduleModel, data: Record<string, any>[] | DataManager, done?: CallbackFunction, element?: HTMLElement): Schedule {
    element = element || createElement('div', { id: 'Schedule' });
    document.body.appendChild(element);
    const defaultOptions: ScheduleModel = {
        height: 580,
        eventSettings: { dataSource: data instanceof DataManager ? data : cloneDataSource(data) },
        // eslint-disable-next-line no-console
        actionFailure: (args: ActionEventArgs) => console.log(JSON.stringify(args))
    };
    if (done) {
        defaultOptions.dataBound = () => {
            disableScheduleAnimation(scheduleObj);
            done();
        };
    }
    const model: ScheduleModel = extend({}, defaultOptions, options, true);
    const scheduleObj: Schedule = new Schedule(model, element);
    return scheduleObj;
}

/**
 * Method to create recurrence editor component
 *
 * @param {RecurrenceEditorModel} model Accepts the recurrence editor options
 * @param {HTMLElement} element Accepts the DOM element reference
 * @returns {RecurrenceEditor} Returns the recurrence ediotr instance
 * @private
 */
export function createRecurrenceEditor(model?: RecurrenceEditorModel, element?: HTMLElement): RecurrenceEditor {
    element = element || createElement('div', { id: 'RecurrenceEditor' });
    document.body.appendChild(element);
    const recurrenceObj: RecurrenceEditor = model ? new RecurrenceEditor(model) : new RecurrenceEditor();
    recurrenceObj.appendTo(element);
    return recurrenceObj;
}

/**
 * Method to create group scheduler
 *
 * @param {number} groupCount Accepts the group count
 * @param {ScheduleModel} options Accepts the schedule model
 * @param {Object[]} dataSource Accepts the datasource
 * @param {CallbackFunction} done Accepts the callback function
 * @returns {Schedule} Returns the schedule instance
 */
// eslint-disable-next-line max-len
export function createGroupSchedule(groupCount: number, options: ScheduleModel, dataSource: Record<string, any>[], done: CallbackFunction): Schedule {
    if (groupCount === 1) {
        const groupOptions: ScheduleModel = {
            group: { resources: ['Owners'] },
            resources: [
                {
                    field: 'OwnerId', title: 'Owner', name: 'Owners', allowMultiple: true,
                    dataSource: [
                        { OwnerText: 'Nancy', Id: 1, OwnerColor: '#ffaa00' },
                        { OwnerText: 'Steven', Id: 2, OwnerColor: '#f8a398' },
                        { OwnerText: 'Michael', Id: 3, OwnerColor: '#7499e1' },
                        { OwnerText: 'Oliver', Id: 4, OwnerColor: '#ffaa00' },
                        { OwnerText: 'John', Id: 5, OwnerColor: '#f8a398' },
                        { OwnerText: 'Barry', Id: 6, OwnerColor: '#7499e1' },
                        { OwnerText: 'Felicity', Id: 7, OwnerColor: '#ffaa00' },
                        { OwnerText: 'Cisco', Id: 8, OwnerColor: '#f8a398' },
                        { OwnerText: 'Sara', Id: 9, OwnerColor: '#7499e1' },
                        { OwnerText: 'Malcolm', Id: 10, OwnerColor: '#ffaa00' }
                    ],
                    textField: 'OwnerText', idField: 'Id', colorField: 'OwnerColor'
                }
            ]
        };
        options = extend(groupOptions, options);
    }
    if (groupCount === 2) {
        const groupOptions: ScheduleModel = {
            group: {
                allowGroupEdit: true,
                resources: ['Rooms', 'Owners']
            },
            resources: [
                {
                    field: 'RoomId', title: 'Room', name: 'Rooms', allowMultiple: true,
                    dataSource: [
                        { RoomText: 'ROOM 1', Id: 1, RoomColor: '#cb6bb2' },
                        { RoomText: 'ROOM 2', Id: 2, RoomColor: '#56ca85' }
                    ],
                    textField: 'RoomText', idField: 'Id', colorField: 'RoomColor'
                }, {
                    field: 'OwnerId', title: 'Owner', name: 'Owners', allowMultiple: true,
                    dataSource: [
                        { OwnerText: 'Nancy', Id: 1, OwnerGroupId: 1, OwnerColor: '#ffaa00' },
                        { OwnerText: 'Steven', Id: 2, OwnerGroupId: 2, OwnerColor: '#f8a398' },
                        { OwnerText: 'Michael', Id: 3, OwnerGroupId: 1, OwnerColor: '#7499e1' }
                    ],
                    textField: 'OwnerText', idField: 'Id', groupIDField: 'OwnerGroupId', colorField: 'OwnerColor'
                }
            ]
        };
        options = extend(groupOptions, options);
    }
    return createSchedule(options, dataSource, done);
}

/**
 * Method to destroy component
 *
 * @param {Schedule | RecurrenceEditor} instance Accepts the component instance
 * @returns {void}
 * @private
 */
export function destroy(instance: Schedule | RecurrenceEditor): void {
    if (instance) {
        instance.destroy();
        remove(document.getElementById(instance.element.id));
    }
}

let touchTestObj: any;
export interface CommonArgs {
    changedTouches?: any[];
    clientX?: number;
    clientY?: number;
    target?: Element | HTMLElement;
    type?: string;
    preventDefault(): void;
    stopPropagation(): void;
}

let node: Element;
const startMouseEventArs: CommonArgs = {
    clientX: 200, clientY: 200, target: node, type: 'touchstart',
    preventDefault: (): void => { /** Do Nothing */ },
    stopPropagation: (): void => { /** Do Nothing */ }
};
const moveMouseEventArs: CommonArgs = {
    clientX: 500, clientY: 200, target: node, type: 'touchmove',
    preventDefault: (): void => { /** Do Nothing */ },
    stopPropagation: (): void => { /** Do Nothing */ }
};
const endMouseEventArs: CommonArgs = {
    clientX: 200, clientY: 200, target: node, type: 'touchend',
    preventDefault: (): void => { /** Do Nothing */ },
    stopPropagation: (): void => { /** Do Nothing */ }
};

/**
 * Method to trigger swipe event
 *
 * @param {Element} target Accepts the DOM element
 * @param {number} x Accepts the X value
 * @param {number} y Accepts the Y value
 * @returns {void}
 * @private
 */
export function triggerSwipeEvent(target: Element, x?: number, y?: number): void {
    node = target;
    startMouseEventArs.target = node;
    moveMouseEventArs.target = node;
    endMouseEventArs.target = node;
    touchTestObj = ((node as EJ2Instance).ej2_instances[0] as any);
    const movedEnd: CommonArgs = moveMouseEventArs;
    movedEnd.type = 'touchend';
    if (x) { movedEnd.clientX = x; }
    if (y) { movedEnd.clientY = y; }
    touchTestObj.startEvent(startMouseEventArs);
    touchTestObj.moveEvent(moveMouseEventArs);
    touchTestObj.endEvent(movedEnd);
    EventHandler.trigger(<HTMLElement>node, 'transitionend');
}

/**
 * Method to trigger mouse event
 *
 * @param {HTMLElement} node Accepts the DOM element
 * @param {string} eventType Accepts the event type
 * @param {number} x Accepts the X value
 * @param {number} y Accepts the Y value
 * @param {boolean} isShiftKey Accepts the shift key allowed or not
 * @param {boolean} isCtrlKey Accepts the ctrl key allowed or not
 * @returns {void}
 * @private
 */
// eslint-disable-next-line max-len
export function triggerMouseEvent(node: HTMLElement, eventType: string, x: number = 0, y: number = 0, isShiftKey?: boolean, isCtrlKey?: boolean): void {
    const mouseEve: MouseEvent = new MouseEvent(eventType);
    mouseEve.initMouseEvent(eventType, true, true, window, 0, 0, 0, x, y, isCtrlKey, false, isShiftKey, false, 0, null);
    node.dispatchEvent(mouseEve);
}

/**
 * Method to get the instance
 *
 * @param {string} className Accepts the element class name
 * @returns {Object[]} Returns the component instance
 * @private
 */
export function getInstance(className: string): Record<string, any> {
    return (document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS + ' .' + className) as EJ2Instance).ej2_instances[0];
}

/**
 * Method to trigger scroll event
 *
 * @param {HTMLElement} target Accepts the DOM element
 * @param {number} scrollTop Accepts the scroll top value
 * @param {number} scrollLeft Accepts the scroll left value
 * @returns {void}
 * @private
 */
export function triggerScrollEvent(target: HTMLElement, scrollTop: number, scrollLeft?: number): void {
    target.scrollTop = scrollTop;
    if (scrollLeft) {
        target.scrollLeft = scrollLeft;
    }
    const e: any = document.createEvent('UIEvents');
    e.initUIEvent('scroll', true, true, window, 1);
    target.dispatchEvent(e);
}

/**
 * Method to trigger keydown event
 *
 * @param {HTMLElement} target Accepts the DOM element
 * @param {string} keyName Accepts the key value
 * @param {number} keyCode Accepts the keyCode value
 * @returns {void}
 * @private
 */
export function triggerKeyDownEvent(target: HTMLElement, keyName: string, KeyCode: number): void {
    let event: { [key: string]: string } = {};
    Object.defineProperties(event, {
        code: { value: keyName },
        key: { value: keyName },
        keyCode: { value: KeyCode },
        view: { value: window },
        bubbles: { value: true },
    });
    const keyboardEvent: KeyboardEvent = new KeyboardEvent('keydown', event);
    target.dispatchEvent(keyboardEvent);
}

/**
 * Method to disable animation
 *
 * @param {Schedule} schObj Accepts the schedule instance
 * @returns {void}
 * @private
 */
export function disableScheduleAnimation(schObj: Schedule): void {
    disablePopupAnimation(schObj.quickPopup.quickPopup);
    disablePopupAnimation(schObj.quickPopup.morePopup);
    disableDialogAnimation(schObj.quickPopup.quickDialog);
    disableDialogAnimation(schObj.eventWindow.dialogObject);
    const resTree: Element = schObj.element.querySelector('.e-resource-tree-popup');
    if (resTree) {
        const resTreePopup: Popup = (resTree as EJ2Instance).ej2_instances[0] as Popup;
        disablePopupAnimation(resTreePopup);
    }
}

/**
 * Method to disable animation
 *
 * @param {Popup} popupObj Accepts the popup instance
 * @returns {void}
 * @private
 */
export function disablePopupAnimation(popupObj: Popup): void {
    popupObj.showAnimation = null;
    popupObj.hideAnimation = null;
    popupObj.dataBind();
}

/**
 * Method to disable animation
 *
 * @param {Dialog} dialogObject Accepts the dialog instance
 * @returns {void}
 * @private
 */
export function disableDialogAnimation(dialogObject: Dialog): void {
    dialogObject.animationSettings = { effect: 'None' };
    dialogObject.dataBind();
    dialogObject.hide();
}

/**
 * Method to disable animation
 *
 * @param {Tooltip} tooltipObj Accepts the tooltip instance
 * @returns {void}
 * @private
 */
export function disableTooltipAnimation(tooltipObj: Tooltip): void {
    tooltipObj.animation = { open: { effect: 'None' }, close: { effect: 'None' } };
    tooltipObj.dataBind();
}

/**
 * Method to load culture files
 *
 * @param {string} name Accepts the culture name
 * @param {boolean} base Accepts the base value
 * @returns {void}
 * @private
 */
export function loadCultureFiles(name: string, base?: boolean): void {
    const files: string[] = base ? ['numberingSystems.json'] : ['ca-gregorian.json', 'numbers.json', 'timeZoneNames.json', 'currencies.json'];
    for (const prop of files) {
        let ajax: Ajax;
        if (base) {
            ajax = new Ajax('base/spec/cldr-data/supplemental/' + prop, 'GET', false);
        } else {
            ajax = new Ajax('base/spec/cldr-data/main/' + name + '/' + prop, 'GET', false);
        }
        ajax.onSuccess = (value: string) => loadCldr(JSON.parse(value));
        ajax.send();
    }
}
