import { DashboardLayout } from '../../../src/dashboard-layout/dashboard-layout';
import { isNullOrUndefined, EventHandler } from '@syncfusion/ej2-base';
let portlet: DashboardLayout = new DashboardLayout({
    columns: 12,
    allowDragging: true,
    panels: [{ "sizeX": 1, "sizeY": 1, "row": 0, "col": 0 },
    { "sizeX": 3, "sizeY": 2, "row": 0, "col": 1 },
    { "sizeX": 1, "sizeY": 3, "row": 0, "col": 4 },
    { "sizeX": 1, "sizeY": 1, "row": 1, "col": 0 },
    { "sizeX": 2, "sizeY": 1, "row": 2, "col": 0 },
    { "sizeX": 1, "sizeY": 1, "row": 2, "col": 2 },
    { "sizeX": 1, "sizeY": 1, "row": 2, "col": 3 }
    ]
});

portlet.appendTo('#dashboard_layout');


let movingElemnt: HTMLElement = document.getElementById('layout_0_content');
let targetElemnt: HTMLElement = document.getElementById('layout_3_content');
let mousedown: any = getEventObject('MouseEvents', 'mousedown', movingElemnt, targetElemnt, 0, 0);
EventHandler.trigger(<HTMLElement>movingElemnt, 'mousedown', mousedown);
let mousemove: any = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 110, 0);
EventHandler.trigger(<any>(document), 'mousemove', mousemove);
mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
mousemove = setMouseCordinates(mousemove, 60, 0);
EventHandler.trigger(<any>(document), 'mousemove', mousemove);
mousemove = setMouseCordinates(mousemove, 62, 0);
EventHandler.trigger(<any>(document), 'mousemove', mousemove);
let mouseup: any = getEventObject('MouseEvents', 'mouseup', movingElemnt, targetElemnt);
mouseup.type = 'mouseup';
EventHandler.trigger(<any>(document), 'mouseup', mouseup);

function copyObject(source: any, destiation: any): Object {
    for (let prop in source) {
        destiation[prop] = source[prop];
    }
    return destiation;
}
function getEventObject(eventType: string, eventName: string, currentTarget?: Element, target?: Element, x?: number, y?: number, offset?: number): Object {
    let tempEvent: any = document.createEvent(eventType);
    tempEvent.initEvent(eventName, true, true);
    let returnObject: any = copyObject(tempEvent, {});
    returnObject.preventDefault = () => { return true; };

    if (!isNullOrUndefined(x)) {
        returnObject.pageX = x;
        returnObject.clientX = x;
    }
    if (!isNullOrUndefined(y)) {
        returnObject.pageY = y;
        returnObject.clientY = y;
    }
    if (!isNullOrUndefined(currentTarget)) {
        returnObject.currentTarget = currentTarget;
    }
    if (!isNullOrUndefined(target)) {
        returnObject.target = returnObject.srcElement = returnObject.toElement = target;
        if (!isNullOrUndefined(offset)) {
            returnObject.offsetY = offset;
        } else {
            returnObject.offsetY = 7;
        }
    }

    returnObject.element = currentTarget;

    return returnObject;
}

function setMouseCordinates(eventarg: any, x: number, y: number): Object {
    eventarg.pageX = x;
    eventarg.pageY = y;
    eventarg.clientX = x;
    eventarg.clientY = y;
    eventarg.offsetY = 7;
    return eventarg;
}            