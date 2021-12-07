import { DashboardLayout } from '../../src/dashboard-layout/dashboard-layout';
import { isNullOrUndefined, EventHandler } from '@syncfusion/ej2-base';

let ele: any;
var portlet = new DashboardLayout({
    allowPushing: true,
    allowFloating: true,
    allowResizing: true,
    columns: 12,    
    cellSpacing: [5, 5],
    panels: [{ "sizeX": 1, "sizeY": 1, "row": 0, "col": 0,  content: generateTemplate('0')},
    { "sizeX": 2, "sizeY": 2, "row": 0, "col": 1,content: generateTemplate('1')},
        { "sizeX": 1, "sizeY": 1, "row": 0, "col": 3,  content: generateTemplate('5') },
        { "sizeX": 1, "sizeY": 3, "row": 0, "col": 4,  content: generateTemplate('7') },
        { "sizeX": 3, "minSizeX": 3, "maxSizeX": 3, "maxSizeY": 1, "minSizeY": 1, "sizeY": 1, "row": 0, "col": 5,  content: generateTemplate('8') },
        { "sizeX": 1, "sizeY": 1, "row": 1, "col": 3,  content: generateTemplate('6') },
        { "sizeX": 1, "sizeY": 2, "row": 1, "col": 0,  content: generateTemplate('1') },
        { "sizeX": 2, "sizeY": 1, "row": 2, "col": 5,  content: generateTemplate('9') },
        { "sizeX": 1, "sizeY": 1, "row": 2, "col": 7,  content: generateTemplate('12') },
        { "sizeX": 1, "sizeY": 1, "row": 1, "col": 5,  content: generateTemplate('10') },
        { "sizeX": 2, "sizeY": 1, "row": 1, "col": 6,  content: generateTemplate('11') },
        { "sizeX": 1, "sizeY": 1, "row": 3, "col": 0,  content: generateTemplate('3') },
        { "sizeX": 2, "sizeY": 1, "row": 2, "col": 2,  content: generateTemplate('4') },
        { "sizeX": 4, "sizeY": 1, "row": 3, "col": 1,  content: generateTemplate('12') },
        { "sizeX": 1, "sizeY": 1, "row": 2, "col": 1,  content: generateTemplate('13') },
        { "sizeX": 3, "sizeY": 2, "row": 5, "col": 5,  content: generateTemplate('14') },
        { "sizeX": 5, "sizeY": 1, "row": 5, "col": 0,  content: generateTemplate('15') },
        { "sizeX": 1, "sizeY": 4, "row": 0, "col": 8,  content: generateTemplate('16') },
        { "sizeX": 3, "sizeY": 3, "row": 0, "col": 9,  content: generateTemplate('17') },
        { "sizeX": 2, "sizeY": 1, "row": 3, "col": 9,  content: generateTemplate('18') },
        { "sizeX": 1, "sizeY": 2, "row": 3, "col": 11,  content: generateTemplate('19') },
        { "sizeX": 3, "sizeY": 1, "row": 4, "col": 8,  content: generateTemplate('20') },
    ]
});
portlet.appendTo('#portlet_default');

function generateTemplate(content: string): string {
    return '<div class="dialogContent"><span class="dialogText">' + content + '</span></div>';
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

function copyObject(source: any, destiation: any): Object {
    for (let prop in source) {
        destiation[prop] = source[prop];
    }
    return destiation;
}

document.getElementById("0").addEventListener('click', function (args: any) {
    if (!args.target.classList.contains("e-active")) {
        args.target.classList.add("e-active");
        let movingElemnt: HTMLElement = document.getElementById('layout_0');
        let targetElemnt: HTMLElement = document.getElementById('layout_1');
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
    } else {
        args.target.classList.remove("e-active");
        let movingElemnt: HTMLElement = document.getElementById('layout_0');
        let targetElemnt: HTMLElement = document.getElementById('layout_1');
        let mousedown: any = getEventObject('MouseEvents', 'mousedown', movingElemnt, targetElemnt, 112, 0);
        EventHandler.trigger(<HTMLElement>movingElemnt, 'mousedown', mousedown);
        let mousemove: any = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 60, 0);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
        mousemove = setMouseCordinates(mousemove, 30, 0);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove = setMouseCordinates(mousemove, 0, 0);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        let mouseup: any = getEventObject('MouseEvents', 'mouseup', movingElemnt, targetElemnt);
        mouseup.type = 'mouseup';
        EventHandler.trigger(<any>(document), 'mouseup', mouseup);
    }
});

document.getElementById("16").addEventListener('click', function (args: any) {
    if (!args.target.classList.contains("e-active")) {
        args.target.classList.add("e-active");
        let movingElemnt: HTMLElement = document.getElementById('layout_17');
        let targetElemnt: HTMLElement = document.getElementById('layout_4');
        let mousedown: any = getEventObject('MouseEvents', 'mousedown', movingElemnt, targetElemnt, 640, 0);
        EventHandler.trigger(<HTMLElement>movingElemnt, 'mousedown', mousedown);
        let mousemove: any = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 600, 0);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
        mousemove = setMouseCordinates(mousemove, 560, 0);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove = setMouseCordinates(mousemove, 563, 0);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        let mouseup: any = getEventObject('MouseEvents', 'mouseup', movingElemnt, targetElemnt);
        mouseup.type = 'mouseup';
        EventHandler.trigger(<any>(document), 'mouseup', mouseup);
    } else {
        args.target.classList.remove("e-active");
        let movingElemnt: HTMLElement = document.getElementById('layout_17');
        let targetElemnt: HTMLElement = document.getElementById('layout_4');
        let mousedown: any = getEventObject('MouseEvents', 'mousedown', movingElemnt, targetElemnt, 784, 0);
        EventHandler.trigger(<HTMLElement>movingElemnt, 'mousedown', mousedown);
        let mousemove: any = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 800, 0);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
        mousemove = setMouseCordinates(mousemove, 850, 0);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove = setMouseCordinates(mousemove, 900, 0);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        let mouseup: any = getEventObject('MouseEvents', 'mouseup', movingElemnt, targetElemnt);
        mouseup.type = 'mouseup';
        EventHandler.trigger(<any>(document), 'mouseup', mouseup);
    }
});

document.getElementById("8").addEventListener('click', function (args: any) {
    if (!args.target.classList.contains("e-active")) {
        args.target.classList.add("e-active");
        let movingElemnt: HTMLElement = document.getElementById('layout_4');
        let targetElemnt: HTMLElement = document.getElementById('layout_9');
        let mousedown: any = getEventObject('MouseEvents', 'mousedown', movingElemnt, targetElemnt, 400, 0);
        EventHandler.trigger(<HTMLElement>movingElemnt, 'mousedown', mousedown);
        let mousemove: any = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 400, 20);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
        mousemove = setMouseCordinates(mousemove, 400, 60);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove = setMouseCordinates(mousemove, 400, 80);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        let mouseup: any = getEventObject('MouseEvents', 'mouseup', movingElemnt, targetElemnt);
        mouseup.type = 'mouseup';
        EventHandler.trigger(<any>(document), 'mouseup', mouseup);
    } else {
        args.target.classList.remove("e-active");
        let movingElemnt: HTMLElement = document.getElementById('layout_4');
        let targetElemnt: HTMLElement = document.getElementById('layout_9');
        let mousedown: any = getEventObject('MouseEvents', 'mousedown', movingElemnt, targetElemnt, 400, 80);
        EventHandler.trigger(<HTMLElement>movingElemnt, 'mousedown', mousedown);
        let mousemove: any = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 400, 60);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
        mousemove = setMouseCordinates(mousemove, 400, 20);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove = setMouseCordinates(mousemove, 400, 0);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        let mouseup: any = getEventObject('MouseEvents', 'mouseup', movingElemnt, targetElemnt);
        mouseup.type = 'mouseup';
        EventHandler.trigger(<any>(document), 'mouseup', mouseup);
    }
});

document.getElementById("14").addEventListener('click', function (args: any) {
    if (!args.target.classList.contains("e-active")) {
        args.target.classList.add("e-active");
        let movingElemnt: HTMLElement = document.getElementById('layout_15');
        let targetElemnt: HTMLElement = document.getElementById('layout_7');
        let mousedown: any = getEventObject('MouseEvents', 'mousedown', movingElemnt, targetElemnt, 400, 237);
        EventHandler.trigger(<HTMLElement>movingElemnt, 'mousedown', mousedown);
        let mousemove: any = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 400, 200);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
        mousemove = setMouseCordinates(mousemove, 400, 160);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove = setMouseCordinates(mousemove, 402, 163);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        let mouseup: any = getEventObject('MouseEvents', 'mouseup', movingElemnt, targetElemnt);
        mouseup.type = 'mouseup';
        EventHandler.trigger(<any>(document), 'mouseup', mouseup);
    } else {
        args.target.classList.remove("e-active");
        let movingElemnt: HTMLElement = document.getElementById('layout_15');
        let targetElemnt: HTMLElement = document.getElementById('layout_7');
        let mousedown: any = getEventObject('MouseEvents', 'mousedown', movingElemnt, targetElemnt, 560, 224);
        EventHandler.trigger(<HTMLElement>movingElemnt, 'mousedown', mousedown);
        let mousemove: any = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 560, 280);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
        mousemove = setMouseCordinates(mousemove, 560, 400);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove = setMouseCordinates(mousemove, 560, 448);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        let mouseup: any = getEventObject('MouseEvents', 'mouseup', movingElemnt, targetElemnt);
        mouseup.type = 'mouseup';
        EventHandler.trigger(<any>(document), 'mouseup', mouseup);
    }
});

document.getElementById("15").addEventListener('click', function (args: any) {
    if (!args.target.classList.contains("e-active")) {
        args.target.classList.add("e-active");
        let movingElemnt: HTMLElement = document.getElementById('layout_16');
        let targetElemnt: HTMLElement = document.getElementById('layout_11');
        let mousedown: any = getEventObject('MouseEvents', 'mousedown', movingElemnt, targetElemnt, 0, 280);
        EventHandler.trigger(<HTMLElement>movingElemnt, 'mousedown', mousedown);
        let mousemove: any = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 0, 270);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
        mousemove = setMouseCordinates(mousemove, 5, 230);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove = setMouseCordinates(mousemove, 10, 200);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        let mouseup: any = getEventObject('MouseEvents', 'mouseup', movingElemnt, targetElemnt);
        mouseup.type = 'mouseup';
        EventHandler.trigger(<any>(document), 'mouseup', mouseup);
    } else {
        args.target.classList.remove("e-active");
        let movingElemnt: HTMLElement = document.getElementById('layout_16');
        let targetElemnt: HTMLElement = document.getElementById('layout_11');
        let mousedown: any = getEventObject('MouseEvents', 'mousedown', movingElemnt, targetElemnt, 10, 200);
        EventHandler.trigger(<HTMLElement>movingElemnt, 'mousedown', mousedown);
        let mousemove: any = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 5, 230);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
        mousemove = setMouseCordinates(mousemove, 0, 270);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove = setMouseCordinates(mousemove, 0, 280);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        let mouseup: any = getEventObject('MouseEvents', 'mouseup', movingElemnt, targetElemnt);
        mouseup.type = 'mouseup';
        EventHandler.trigger(<any>(document), 'mouseup', mouseup);
    }
});

document.getElementById("18").addEventListener('click', function (args: any) {
    if (!args.target.classList.contains("e-active")) {
        args.target.classList.add("e-active");
        let movingElemnt: HTMLElement = document.getElementById('layout_19');
        let targetElemnt: HTMLElement = document.getElementById('layout_20');
        let mousedown: any = getEventObject('MouseEvents', 'mousedown', movingElemnt, targetElemnt, 720, 237);
        EventHandler.trigger(<HTMLElement>movingElemnt, 'mousedown', mousedown);
        let mousemove: any = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 800, 237);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
        mousemove = setMouseCordinates(mousemove, 850, 238);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove = setMouseCordinates(mousemove, 870, 240);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        let mouseup: any = getEventObject('MouseEvents', 'mouseup', movingElemnt, targetElemnt);
        mouseup.type = 'mouseup';
        EventHandler.trigger(<any>(document), 'mouseup', mouseup);
    } else {
        args.target.classList.remove("e-active");
        let movingElemnt: HTMLElement = document.getElementById('layout_19');
        let targetElemnt: HTMLElement = document.getElementById('layout_20');
        let mousedown: any = getEventObject('MouseEvents', 'mousedown', movingElemnt, targetElemnt, 870, 240);
        EventHandler.trigger(<HTMLElement>movingElemnt, 'mousedown', mousedown);
        let mousemove: any = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 850, 238);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
        mousemove = setMouseCordinates(mousemove, 800, 237);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove = setMouseCordinates(mousemove, 720, 237);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        let mouseup: any = getEventObject('MouseEvents', 'mouseup', movingElemnt, targetElemnt);
        mouseup.type = 'mouseup';
        EventHandler.trigger(<any>(document), 'mouseup', mouseup);
    }
});

document.getElementById("5").addEventListener('click', function (args: any) {
    if (!args.target.classList.contains("e-active")) {
        args.target.classList.add("e-active");
        let movingElemnt: HTMLElement = document.getElementById('layout_2');
        let targetElemnt: HTMLElement = document.getElementById('layout_5');
        let mousedown: any = getEventObject('MouseEvents', 'mousedown', movingElemnt, targetElemnt, 237, 0);
        EventHandler.trigger(<HTMLElement>movingElemnt, 'mousedown', mousedown);
        let mousemove: any = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 237, 50);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
        mousemove = setMouseCordinates(mousemove, 239, 70);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove = setMouseCordinates(mousemove, 240, 85);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        let mouseup: any = getEventObject('MouseEvents', 'mouseup', movingElemnt, targetElemnt);
        mouseup.type = 'mouseup';
        EventHandler.trigger(<any>(document), 'mouseup', mouseup);
    } else {
        args.target.classList.remove("e-active");
        let movingElemnt: HTMLElement = document.getElementById('layout_2');
        let targetElemnt: HTMLElement = document.getElementById('layout_5');
        let mousedown: any = getEventObject('MouseEvents', 'mousedown', movingElemnt, targetElemnt, 336, 112);
        EventHandler.trigger(<HTMLElement>movingElemnt, 'mousedown', mousedown);
        let mousemove: any = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 336, 70);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
        mousemove = setMouseCordinates(mousemove, 336, 50);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove = setMouseCordinates(mousemove, 336, 0);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        let mouseup: any = getEventObject('MouseEvents', 'mouseup', movingElemnt, targetElemnt);
        mouseup.type = 'mouseup';
        EventHandler.trigger(<any>(document), 'mouseup', mouseup);
    }
});

document.getElementById("2").addEventListener('click', function (args: any) {
    if (!args.target.classList.contains("e-active")) {
        args.target.classList.add("e-active");
        let movingElemnt: HTMLElement = document.getElementById('layout_1');
        let targetElemnt: HTMLElement = document.getElementById('layout_2');
        let mousedown: any = getEventObject('MouseEvents', 'mousedown', movingElemnt, targetElemnt, 79, 0);
        EventHandler.trigger(<HTMLElement>movingElemnt, 'mousedown', mousedown);
        let mousemove: any = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 100, 0);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
        mousemove = setMouseCordinates(mousemove, 150, 5);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove = setMouseCordinates(mousemove, 160, 10);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        let mouseup: any = getEventObject('MouseEvents', 'mouseup', movingElemnt, targetElemnt);
        mouseup.type = 'mouseup';
        EventHandler.trigger(<any>(document), 'mouseup', mouseup);
    } else {
        args.target.classList.remove("e-active");
        let movingElemnt: HTMLElement = document.getElementById('layout_1');
        let targetElemnt: HTMLElement = document.getElementById('layout_2');
        let mousedown: any = getEventObject('MouseEvents', 'mousedown', movingElemnt, targetElemnt, 160, 10);
        EventHandler.trigger(<HTMLElement>movingElemnt, 'mousedown', mousedown);
        let mousemove: any = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 150, 5);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
        mousemove = setMouseCordinates(mousemove, 100, 0);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove = setMouseCordinates(mousemove, 79, 0);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        let mouseup: any = getEventObject('MouseEvents', 'mouseup', movingElemnt, targetElemnt);
        mouseup.type = 'mouseup';
        EventHandler.trigger(<any>(document), 'mouseup', mouseup);
    }
});

document.getElementById("01").addEventListener('click', function (args: any) {
    if (!args.target.classList.contains("e-active")) {
        args.target.classList.add("e-active");
        let movingElemnt: HTMLElement = document.getElementById('layout_0');
        let targetElemnt: HTMLElement = document.getElementById('layout_6');
        let mousedown: any = getEventObject('MouseEvents', 'mousedown', movingElemnt, targetElemnt, 0, 0);
        EventHandler.trigger(<HTMLElement>movingElemnt, 'mousedown', mousedown);
        let mousemove: any = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 0, 20);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
        mousemove = setMouseCordinates(mousemove, 0, 100);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove = setMouseCordinates(mousemove, 0, 160);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove = setMouseCordinates(mousemove, 0, 160);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        let mouseup: any = getEventObject('MouseEvents', 'mouseup', movingElemnt, targetElemnt);
        mouseup.type = 'mouseup';
        EventHandler.trigger(<any>(document), 'mouseup', mouseup);
    } else {
        args.target.classList.remove("e-active");
        let movingElemnt: HTMLElement = document.getElementById('layout_0');
        let targetElemnt: HTMLElement = document.getElementById('layout_6');
        let mousedown: any = getEventObject('MouseEvents', 'mousedown', movingElemnt, targetElemnt, 0, 160);
        EventHandler.trigger(<HTMLElement>movingElemnt, 'mousedown', mousedown);
        let mousemove: any = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 0, 159);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
        mousemove = setMouseCordinates(mousemove, 0, 100);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove = setMouseCordinates(mousemove, 0, 20);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove = setMouseCordinates(mousemove, 0, 0);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        let mouseup: any = getEventObject('MouseEvents', 'mouseup', movingElemnt, targetElemnt);
        mouseup.type = 'mouseup';
        EventHandler.trigger(<any>(document), 'mouseup', mouseup);
    }
});

document.getElementById("1").addEventListener('click', function (args: any) {
    if (!args.target.classList.contains("e-active")) {
        args.target.classList.add("e-active");
        let movingElemnt: HTMLElement = document.getElementById('layout_6');
        let targetElemnt: HTMLElement = document.getElementById('layout_1');
        let mousedown: any = getEventObject('MouseEvents', 'mousedown', movingElemnt, targetElemnt, 0, 79);
        EventHandler.trigger(<HTMLElement>movingElemnt, 'mousedown', mousedown);
        let mousemove: any = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 20, 79);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
        mousemove = setMouseCordinates(mousemove, 50, 80);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove = setMouseCordinates(mousemove, 79, 82);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        let mouseup: any = getEventObject('MouseEvents', 'mouseup', movingElemnt, targetElemnt);
        mouseup.type = 'mouseup';
        EventHandler.trigger(<any>(document), 'mouseup', mouseup);
    } else {
        args.target.classList.remove("e-active");
        let movingElemnt: HTMLElement = document.getElementById('layout_6');
        let targetElemnt: HTMLElement = document.getElementById('layout_1');
        let mousedown: any = getEventObject('MouseEvents', 'mousedown', movingElemnt, targetElemnt, 112, 0);
        EventHandler.trigger(<HTMLElement>movingElemnt, 'mousedown', mousedown);
        let mousemove: any = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 50, 10);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
        mousemove = setMouseCordinates(mousemove, 0, 50);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove = setMouseCordinates(mousemove, 0, 115);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        let mouseup: any = getEventObject('MouseEvents', 'mouseup', movingElemnt, targetElemnt);
        mouseup.type = 'mouseup';
        EventHandler.trigger(<any>(document), 'mouseup', mouseup);
    }
});

document.getElementById("4").addEventListener('click', function (args: any) {
    if (!args.target.classList.contains("e-active")) {
        args.target.classList.add("e-active");
        let movingElemnt: HTMLElement = document.getElementById('layout_12');
        let targetElemnt: HTMLElement = document.getElementById('layout_11');
        let mousedown: any = getEventObject('MouseEvents', 'mousedown', movingElemnt, targetElemnt, 158, 158);
        EventHandler.trigger(<HTMLElement>movingElemnt, 'mousedown', mousedown);
        let mousemove: any = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 150, 150);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
        mousemove = setMouseCordinates(mousemove, 120, 158);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove = setMouseCordinates(mousemove, 80, 155);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove = setMouseCordinates(mousemove, 70, 155);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        let mouseup: any = getEventObject('MouseEvents', 'mouseup', movingElemnt, targetElemnt);
        mouseup.type = 'mouseup';
        EventHandler.trigger(<any>(document), 'mouseup', mouseup);
    } else {
        args.target.classList.remove("e-active");
        let movingElemnt: HTMLElement = document.getElementById('layout_12');
        let targetElemnt: HTMLElement = document.getElementById('layout_11');
        let mousedown: any = getEventObject('MouseEvents', 'mousedown', movingElemnt, targetElemnt, 70, 155);
        EventHandler.trigger(<HTMLElement>movingElemnt, 'mousedown', mousedown);
        let mousemove: any = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 80, 155);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
        mousemove = setMouseCordinates(mousemove, 120, 158);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove = setMouseCordinates(mousemove, 150, 150);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove = setMouseCordinates(mousemove, 158, 158);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        let mouseup: any = getEventObject('MouseEvents', 'mouseup', movingElemnt, targetElemnt);
        mouseup.type = 'mouseup';
        EventHandler.trigger(<any>(document), 'mouseup', mouseup);
    }
});

document.getElementById("17").addEventListener('click', function (args: any) {
    if (!args.target.classList.contains("e-active")) {
        args.target.classList.add("e-active");
        let movingElemnt: HTMLElement = document.getElementById('layout_18');
        let targetElemnt: HTMLElement = document.getElementById('layout_0');
        let mousedown: any = getEventObject('MouseEvents', 'mousedown', movingElemnt, targetElemnt, 999, 0);
        EventHandler.trigger(<HTMLElement>movingElemnt, 'mousedown', mousedown);
        let mousemove: any = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 500, 0);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
        mousemove = setMouseCordinates(mousemove, 300, 0);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove = setMouseCordinates(mousemove, 250, 0);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove = setMouseCordinates(mousemove, 200, 0);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove = setMouseCordinates(mousemove, 150, 0);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove = setMouseCordinates(mousemove, 120, 0);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove = setMouseCordinates(mousemove, 100, 0);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove = setMouseCordinates(mousemove, 70, 0);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove = setMouseCordinates(mousemove, 50, 5);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove = setMouseCordinates(mousemove, 0, 10);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove = setMouseCordinates(mousemove, 0, 10);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        let mouseup: any = getEventObject('MouseEvents', 'mouseup', movingElemnt, targetElemnt);
        mouseup.type = 'mouseup';
        EventHandler.trigger(<any>(document), 'mouseup', mouseup);
    } else {
        args.target.classList.remove("e-active");
        let movingElemnt: HTMLElement = document.getElementById('layout_18');
        let targetElemnt: HTMLElement = document.getElementById('layout_0');
        let mousedown: any = getEventObject('MouseEvents', 'mousedown', movingElemnt, targetElemnt, 0, 10);
        EventHandler.trigger(<HTMLElement>movingElemnt, 'mousedown', mousedown);
        let mousemove: any = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 0, 10);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
        mousemove = setMouseCordinates(mousemove, 50, 5);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove = setMouseCordinates(mousemove, 70, 0);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove = setMouseCordinates(mousemove, 100, 0);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove = setMouseCordinates(mousemove, 120, 0);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove = setMouseCordinates(mousemove, 150, 0);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove = setMouseCordinates(mousemove, 200, 0);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove = setMouseCordinates(mousemove, 300, 0);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove = setMouseCordinates(mousemove, 500, 5);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove = setMouseCordinates(mousemove, 999, 0);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove = setMouseCordinates(mousemove, 999, 0);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        let mouseup: any = getEventObject('MouseEvents', 'mouseup', movingElemnt, targetElemnt);
        mouseup.type = 'mouseup';
        EventHandler.trigger(<any>(document), 'mouseup', mouseup);
    }
});

document.getElementById("001").addEventListener('click', function (args: any) {
    if (!args.target.classList.contains("e-active")) {
        args.target.classList.add("e-active");
        portlet.resizePanel("layout_0", 2, 2);
    } else {
        args.target.classList.remove("e-active");
        portlet.resizePanel("layout_0", 1, 1);
    }
});

document.getElementById("02").addEventListener('click', function (args: any) {
    if (!args.target.classList.contains("e-active")) {
        args.target.classList.add("e-active");
        portlet.resizePanel("layout_4", 3, 2);
    } else {
        args.target.classList.remove("e-active");
        portlet.resizePanel("layout_4", 3, 1);
    }
});

document.getElementById("03").addEventListener('click', function (args: any) {
    if (!args.target.classList.contains("e-active")) {
        args.target.classList.add("e-active");
        portlet.resizePanel("layout_2", 1, 2);
    } else {
        args.target.classList.remove("e-active");
        portlet.resizePanel("layout_2", 1, 1);
    }
});

document.getElementById("04").addEventListener('click', function (args: any) {
    if (!args.target.classList.contains("e-active")) {
        args.target.classList.add("e-active");
        portlet.resizePanel("layout_15", 3, 4);
    } else {
        args.target.classList.remove("e-active");
        portlet.resizePanel("layout_15", 3, 2);
    }
});

document.getElementById("05").addEventListener('click', function (args: any) {
    if (!args.target.classList.contains("e-active")) {
        args.target.classList.add("e-active");
        portlet.resizePanel("layout_18", 1, 1);
    } else {
        args.target.classList.remove("e-active");
        portlet.resizePanel("layout_18", 2, 3);
    }
});

document.getElementById("06").addEventListener('click', function (args: any) {
    if (!args.target.classList.contains("e-active")) {
        args.target.classList.add("e-active");
        portlet.resizePanel("layout_1", 1, 1);
    } else {
        args.target.classList.remove("e-active");
        portlet.resizePanel("layout_1", 2, 2);
    }
});

// document.getElementById("07").addEventListener('click', function (args: any) {
//     if (!args.target.classList.contains("e-active")) {
//         args.target.classList.add("e-active");
//         portlet.resizePanel("layout_18", 10, 3);
//     } else {
//         args.target.classList.remove("e-active");
//         portlet.resizePanel("layout_18", 3, 3);
//     }
// });

// document.getElementById("08").addEventListener('click', function (args: any) {
//     if (!args.target.classList.contains("e-active")) {
//         args.target.classList.add("e-active");
//         portlet.resizePanel("layout_10", 0, 0);
//     } else {
//         args.target.classList.remove("e-active");
//         portlet.resizePanel("layout_10", 2, 1);
//     }
// });

document.getElementById("011").addEventListener('click', function (args: any) {
    if (!args.target.classList.contains("e-active")) {
        args.target.classList.add("e-active");
        portlet.resizePanel("layout_16", 5, 2);
    } else {
        args.target.classList.remove("e-active");
        portlet.resizePanel("layout_16", 4, 1);
    }
});

document.getElementById("012").addEventListener('click', function (args: any) {
    if (!args.target.classList.contains("e-active")) {
        args.target.classList.add("e-active");
        portlet.resizePanel("layout_3", 1, 1);
    } else {
        args.target.classList.remove("e-active");
        portlet.resizePanel("layout_3", 1, 3);
    }
});

document.getElementById("013").addEventListener('click', function (args: any) {
    if (!args.target.classList.contains("e-active")) {
        args.target.classList.add("e-active");
        portlet.resizePanel("layout_18", 3, 1);
    } else {
        args.target.classList.remove("e-active");
        portlet.resizePanel("layout_18", 3, 3);
    }
});


document.getElementById("rtl").addEventListener('click', function (args: any) {
    if (!args.target.classList.contains("e-active")) {
        args.target.classList.add("e-active");
        portlet.enableRtl = true;
    } else {
        args.target.classList.remove("e-active");
        portlet.enableRtl = false;
    }
});

// document.getElementById("panels").addEventListener('click', function (args: any) {
//     if (!args.target.classList.contains("e-active")) {
//         args.target.classList.add("e-active");
//         portlet.panels = [];
//     } else {
//         args.target.classList.remove("e-active");
//         portlet.panels = [ { "sizeX": 1, "sizeY": 1, "row": 0, "col": 3, content: generateTemplate('5') },
//         { "sizeX": 1, "sizeY": 3, "row": 0, "col": 4, content: generateTemplate('7') },
//         { "sizeX": 3, "minSizeX": 3, "maxSizeX": 3, "maxSizeY": 1, "minSizeY": 1, "sizeY": 1, "row": 0, "col": 5, content: generateTemplate('8') },
//         { "sizeX": 1, "sizeY": 1, "row": 1, "col": 3, content: generateTemplate('6') },
//         { "sizeX": 1, "sizeY": 2, "row": 0, "col": 0, content: generateTemplate('1') },
//         { "sizeX": 2, "sizeY": 1, "row": 2, "col": 5, content: generateTemplate('9') },
//         { "sizeX": 1, "sizeY": 1, "row": 2, "col": 7, content: generateTemplate('12') },
//         { "sizeX": 1, "sizeY": 1, "row": 1, "col": 5, content: generateTemplate('10') },
//         { "sizeX": 2, "sizeY": 1, "row": 1, "col": 6, content: generateTemplate('11') },
//         { "sizeX": 1, "sizeY": 1, "row": 2, "col": 0, content: generateTemplate('3') },
//         { "sizeX": 2, "sizeY": 1, "row": 2, "col": 2, content: generateTemplate('4') },
//         { "sizeX": 4, "sizeY": 1, "row": 3, "col": 1, content: generateTemplate('12') },
//         { "sizeX": 1, "sizeY": 1, "row": 2, "col": 1, content: generateTemplate('13') },
//         { "sizeX": 3, "sizeY": 2, "row": 3, "col": 5, "minSizeY": 2, "maxSizeY": 3, "minSizeX": 2, "maxSizeX": 3, content: generateTemplate('14') },
//         { "sizeX": 5, "sizeY": 1, "row": 4, "col": 0, content: generateTemplate('15') },
//         { "sizeX": 1, "sizeY": 4, "row": 0, "col": 8, content: generateTemplate('16') },
//         { "sizeX": 3, "sizeY": 3, "row": 0, "col": 9, content: generateTemplate('17') },
//         { "sizeX": 2, "sizeY": 1, "row": 3, "col": 9, content: generateTemplate('18') },
//         { "sizeX": 1, "sizeY": 2, "row": 3, "col": 11, content: generateTemplate('19') },
//         { "sizeX": 3, "sizeY": 1, "row": 4, "col": 8, content: generateTemplate('20') },
//         { "sizeX": 2, "sizeY": 2, "row": 0, "col": 1, content: generateTemplate('2') },
//         { "sizeX": 1, "sizeY": 1, "row": 0, "col": 1, content: generateTemplate('0') }
//         ];
//     }
// });


document.getElementById("cellSpacing").addEventListener('click', function (args: any) {
    if (!args.target.classList.contains("e-active")) {
        args.target.classList.add("e-active");
        portlet.cellSpacing = [0, 0];
    } else {
        args.target.classList.remove("e-active");
        portlet.cellSpacing = [5, 5];
    }
});

document.getElementById("columns").addEventListener('click', function (args: any) {
    if (!args.target.classList.contains("e-active")) {
        args.target.classList.add("e-active");
        portlet.columns = 11;
    } else {
        args.target.classList.remove("e-active");
        portlet.columns = 12;
    }
});

document.getElementById("showGridLines").addEventListener('click', function (args: any) {
    if (!args.target.classList.contains("e-active")) {
        args.target.classList.add("e-active");
        portlet.showGridLines = true;
    } else {
        args.target.classList.remove("e-active");
        portlet.showGridLines = false;
    }
});
