import { Internationalization, createElement, remove, extend, EventHandler, Ajax, loadCldr } from '@syncfusion/ej2-base';
import { Dialog, Popup, Tooltip } from '@syncfusion/ej2-popups';
import { ResourceDetails, TreeViewArgs, Schedule, ScheduleModel, EJ2Instance, ActionEventArgs } from '../../src/schedule/index';
import { cloneDataSource } from './base/datasource.spec';
import * as cls from '../../src/schedule/base/css-constant';
import { RecurrenceEditor, RecurrenceEditorModel } from '../../src/recurrence-editor/index';
import { DataManager } from '@syncfusion/ej2-data';

/**
 * schedule spec utils
 */
let instance: Internationalization = new Internationalization();

(window as TemplateFunction).getTimeIn12 = (value: Date) => {
    return instance.formatDate(value, { skeleton: 'hm' });
};
(window as TemplateFunction).getTimeIn24 = (value: Date) => {
    return instance.formatDate(value, { skeleton: 'Hm' });
};
(window as TemplateFunction).getDateHeaderText = (value: Date) => {
    return instance.formatDate(value, { skeleton: 'MEd' });
};
(window as TemplateFunction).getShortDateTime = (value: Date) => {
    return instance.formatDate(value, { type: 'dateTime', skeleton: 'short' });
};
(window as TemplateFunction).getResourceName = (value: ResourceDetails | TreeViewArgs) => {
    return ((value as ResourceDetails).resourceData) ?
        (value as ResourceDetails).resourceData[(value as ResourceDetails).resource.textField]
        : (value as TreeViewArgs).resourceName;
};

export interface TemplateFunction extends Window {
    getTimeIn12?: Function;
    getTimeIn24?: Function;
    getDateHeaderText?: Function;
    getShortDateTime?: Function;
    getResourceName?: Function;
}

export function createSchedule(options: ScheduleModel, data: Object[] | DataManager, done?: Function, element?: HTMLElement): Schedule {
    element = element || createElement('div', { id: 'Schedule' });
    document.body.appendChild(element);
    let defaultOptions: ScheduleModel = {
        height: 580,
        eventSettings: { dataSource: data instanceof DataManager ? data : cloneDataSource(data) },
        // tslint:disable-next-line:no-console
        actionFailure: (args: ActionEventArgs) => console.log(args)
    };
    if (done) {
        defaultOptions.dataBound = () => {
            disableScheduleAnimation(scheduleObj);
            done();
        };
    }
    let model: ScheduleModel = extend({}, defaultOptions, options, true);
    let scheduleObj: Schedule = new Schedule(model, element);
    return scheduleObj;
}

export function createRecurrenceEditor(model?: RecurrenceEditorModel, element?: HTMLElement): RecurrenceEditor {
    element = element || createElement('div', { id: 'RecurrenceEditor' });
    document.body.appendChild(element);
    let recurrenceObj: RecurrenceEditor = model ? new RecurrenceEditor(model) : new RecurrenceEditor();
    recurrenceObj.appendTo(element);
    return recurrenceObj;
}

export function createGroupSchedule(groupCount: number, options: ScheduleModel, dataSource: Object[], done: Function): Schedule {
    if (groupCount === 1) {
        let groupOptions: ScheduleModel = {
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
        let groupOptions: ScheduleModel = {
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

export function destroy(instance: Schedule | RecurrenceEditor): void {
    if (instance) {
        instance.destroy();
        remove(document.getElementById(instance.element.id));
    }
}

/*tslint:disable */
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
/*tslint:enable */
let node: Element;
let startMouseEventArs: CommonArgs = {
    clientX: 200, clientY: 200, target: node, type: 'touchstart',
    preventDefault: (): void => { /** Do Nothing */ },
    stopPropagation: (): void => { /** Do Nothing */ }
};
let moveMouseEventArs: CommonArgs = {
    clientX: 500, clientY: 200, target: node, type: 'touchmove',
    preventDefault: (): void => { /** Do Nothing */ },
    stopPropagation: (): void => { /** Do Nothing */ }
};
let endMouseEventArs: CommonArgs = {
    clientX: 200, clientY: 200, target: node, type: 'touchend',
    preventDefault: (): void => { /** Do Nothing */ },
    stopPropagation: (): void => { /** Do Nothing */ }
};

export function triggerSwipeEvent(target: Element, x?: number, y?: number): void {
    node = target;
    startMouseEventArs.target = node;
    moveMouseEventArs.target = node;
    endMouseEventArs.target = node;
    // tslint:disable-next-line:no-any
    touchTestObj = ((node as EJ2Instance).ej2_instances[0] as any);
    let movedEnd: CommonArgs = moveMouseEventArs;
    movedEnd.type = 'touchend';
    if (x) { movedEnd.clientX = x; }
    if (y) { movedEnd.clientY = y; }
    touchTestObj.startEvent(startMouseEventArs);
    touchTestObj.moveEvent(moveMouseEventArs);
    touchTestObj.endEvent(movedEnd);
    EventHandler.trigger(<HTMLElement>node, 'transitionend');
}

export function triggerMouseEvent(
    node: HTMLElement, eventType: string, x: number = 0, y: number = 0, isShiftKey?: boolean, isCtrlKey?: boolean): void {
    let mouseEve: MouseEvent = new MouseEvent(eventType);
    mouseEve.initMouseEvent(eventType, true, true, window, 0, 0, 0, x, y, isCtrlKey, false, isShiftKey, false, 0, null);
    node.dispatchEvent(mouseEve);
}

export function getInstance(className: string): Object {
    return (document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS + ' .' + className) as EJ2Instance).ej2_instances[0];
}

export function triggerScrollEvent(target: HTMLElement, scrollTop: number): void {
    target.scrollTop = scrollTop;
    let e: UIEvent = document.createEvent('UIEvents');
    e.initUIEvent('scroll', true, true, window, 1);
    target.dispatchEvent(e);
}

export function disableScheduleAnimation(schObj: Schedule): void {
    disablePopupAnimation(schObj.quickPopup.quickPopup);
    disablePopupAnimation(schObj.quickPopup.morePopup);
    disableDialogAnimation(schObj.quickPopup.quickDialog);
    disableDialogAnimation(schObj.eventWindow.dialogObject);
    let resTree: Element = schObj.element.querySelector('.e-resource-tree-popup');
    if (resTree) {
        let resTreePopup: Popup = (resTree as EJ2Instance).ej2_instances[0] as Popup;
        disablePopupAnimation(resTreePopup);
    }
}

export function disablePopupAnimation(popupObj: Popup): void {
    popupObj.showAnimation = null;
    popupObj.hideAnimation = null;
    popupObj.dataBind();
}

export function disableDialogAnimation(dialogObject: Dialog): void {
    dialogObject.animationSettings = { effect: 'None' };
    dialogObject.dataBind();
    dialogObject.hide();
}

export function disableTooltipAnimation(tooltipObj: Tooltip): void {
    tooltipObj.animation = { open: { effect: 'None' }, close: { effect: 'None' } };
    tooltipObj.dataBind();
}

export function loadCultureFiles(name: string, base?: boolean): void {
    let files: string[] = base ? ['numberingSystems.json'] : ['ca-gregorian.json', 'numbers.json', 'timeZoneNames.json', 'currencies.json'];
    for (let prop of files) {
        let ajax: Ajax;
        if (base) {
            ajax = new Ajax('base/spec/cldr-data/supplemental/' + prop, 'GET', false);
        } else {
            ajax = new Ajax('base/spec/cldr-data/main/' + name + '/' + prop, 'GET', false);
        }
        ajax.onSuccess = (value: Object) => loadCldr(JSON.parse(<string>value));
        ajax.send();
    }
}
