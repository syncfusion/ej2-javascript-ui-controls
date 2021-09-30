/**
 * Dashboard Layout
 */
import { DashboardLayout } from '../../src/dashboard-layout/dashboard-layout';
import { isNullOrUndefined, EventHandler } from '@syncfusion/ej2-base';

var defaultDashboard = new DashboardLayout({
    allowDragging: false,
    columns: 12,
    cellSpacing: [5, 5],
    panels: [{ "sizeX": 1, "sizeY": 1, "row": 0, "col": 0, content: generateTemplate('0') },
    { "sizeX": 2, "sizeY": 2, "row": 0, "col": 1, content: generateTemplate('2') },
    { "sizeX": 1, "sizeY": 1, "row": 0, "col": 3, content: generateTemplate('5') },
    { "sizeX": 1, "sizeY": 3, "row": 0, "col": 4, content: generateTemplate('7') },
    { "sizeX": 3, "minSizeX": 3, "maxSizeX": 3, "maxSizeY": 1, "minSizeY": 1, "sizeY": 1, "row": 0, "col": 5, content: generateTemplate('8') },
    { "sizeX": 1, "sizeY": 1, "row": 1, "col": 3, content: generateTemplate('6') },
    { "sizeX": 1, "sizeY": 2, "row": 1, "col": 0, content: generateTemplate('1') },
    { "sizeX": 2, "sizeY": 1, "row": 2, "col": 5, content: generateTemplate('9') },
    { "sizeX": 1, "sizeY": 1, "row": 2, "col": 7, content: generateTemplate('12') },
    { "sizeX": 1, "sizeY": 1, "row": 1, "col": 5, content: generateTemplate('10') },
    { "sizeX": 2, "sizeY": 1, "row": 1, "col": 6, content: generateTemplate('11') },
    { "sizeX": 1, "sizeY": 1, "row": 3, "col": 0, content: generateTemplate('3') },
    { "sizeX": 2, "sizeY": 1, "row": 2, "col": 2, content: generateTemplate('4') },
    { "sizeX": 4, "sizeY": 1, "row": 3, "col": 1, content: generateTemplate('12') },
    { "sizeX": 1, "sizeY": 1, "row": 2, "col": 1, content: generateTemplate('13') },
    { "sizeX": 3, "sizeY": 2, "row": 3, "col": 5, content: generateTemplate('14') },
    { "sizeX": 5, "sizeY": 1, "row": 4, "col": 0, content: generateTemplate('15') },
    { "sizeX": 1, "sizeY": 4, "row": 0, "col": 8, content: generateTemplate('16') },
    { "sizeX": 3, "sizeY": 3, "row": 0, "col": 9, content: generateTemplate('17') },
    { "sizeX": 2, "sizeY": 1, "row": 3, "col": 9, content: generateTemplate('18') },
    { "sizeX": 1, "sizeY": 2, "row": 3, "col": 11, content: generateTemplate('19') },
    { "sizeX": 3, "sizeY": 1, "row": 4, "col": 8, content: generateTemplate('20') },
    ]
});
defaultDashboard.appendTo('#dashboard-layout');

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

document.getElementById("0").addEventListener('click', function (args) {
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
});

document.getElementById("16").addEventListener('click', function (args) {
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
});

document.getElementById("5").addEventListener('click', function (args) {
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
});

document.getElementById("2").addEventListener('click', function (args) {
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
});


document.getElementById("19").addEventListener('click', function (args) {
    let movingElemnt: HTMLElement = document.getElementById('layout_20');
    let targetElemnt: HTMLElement = document.getElementById('body');
    let mousedown: any = getEventObject('MouseEvents', 'mousedown', movingElemnt, targetElemnt, 869, 237);
    EventHandler.trigger(<HTMLElement>movingElemnt, 'mousedown', mousedown);
    let mousemove: any = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 900, 237);
    EventHandler.trigger(<any>(document), 'mousemove', mousemove);
    mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
    mousemove = setMouseCordinates(mousemove, 950, 237);
    EventHandler.trigger(<any>(document), 'mousemove', mousemove);
    mousemove = setMouseCordinates(mousemove, 1000, 237);
    EventHandler.trigger(<any>(document), 'mousemove', mousemove);
    mousemove = setMouseCordinates(mousemove, 1010, 237);
    EventHandler.trigger(<any>(document), 'mousemove', mousemove);
    let mouseup: any = getEventObject('MouseEvents', 'mouseup', movingElemnt, targetElemnt);
    mouseup.type = 'mouseup';
    EventHandler.trigger(<any>(document), 'mouseup', mouseup);
});

document.getElementById("3").addEventListener('click', function (args) {
    let movingElemnt: HTMLElement = document.getElementById('layout_11');
    let targetElemnt: HTMLElement = document.getElementById('body');
    let mousedown: any = getEventObject('MouseEvents', 'mousedown', movingElemnt, targetElemnt, 0, 237);
    EventHandler.trigger(<HTMLElement>movingElemnt, 'mousedown', mousedown);
    let mousemove: any = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, -20, 235);
    EventHandler.trigger(<any>(document), 'mousemove', mousemove);
    mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
    mousemove = setMouseCordinates(mousemove, -50, 235);
    EventHandler.trigger(<any>(document), 'mousemove', mousemove);
    mousemove = setMouseCordinates(mousemove, -100, 235);
    EventHandler.trigger(<any>(document), 'mousemove', mousemove);
    let mouseup: any = getEventObject('MouseEvents', 'mouseup', movingElemnt, targetElemnt);
    mouseup.type = 'mouseup';
    EventHandler.trigger(<any>(document), 'mouseup', mouseup);
});

document.getElementById("allowFloating").addEventListener('click', function (args: any) {
    if (!args.target.classList.contains("e-active")) {
        args.target.classList.add("e-active");
        defaultDashboard.allowDragging = true;
    } else {
        args.target.classList.remove("e-active");
        defaultDashboard.allowDragging = false;
    }
});

document.getElementById("1").addEventListener('click', function (args: any) {
    if (!args.target.classList.contains("e-active")) {
        args.target.classList.add("e-active");
        let resizingElement: HTMLElement = document.getElementById('layout_0');
        let movingElemnt: HTMLElement = resizingElement.querySelector('.e-south-east');
        let targetElemnt: HTMLElement = document.getElementById('layout_1');
        let mouseOver: any = getEventObject('MouseEvents', 'mouseover', movingElemnt, targetElemnt, 30, 60);
        mouseOver = setMouseCordinates(mouseOver, 30, 60);
        EventHandler.trigger(<HTMLElement>movingElemnt, 'mouseover', mouseOver);
        let mousedown: any = getEventObject('MouseEvents', 'mousedown', movingElemnt, targetElemnt, 85, 86);
        EventHandler.trigger(<HTMLElement>movingElemnt, 'mousedown', mousedown);
        let mousemove: any = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 110, 120);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
        mousemove = setMouseCordinates(mousemove, 150, 160);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove = setMouseCordinates(mousemove, 197, 198);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        let mouseup: any = getEventObject('MouseEvents', 'mouseup', movingElemnt, targetElemnt);
        mouseup.type = 'mouseup';
        EventHandler.trigger(<any>(document), 'mouseup', mouseup);
    } else {
        args.target.classList.remove("e-active");
        let resizingElement: HTMLElement = document.getElementById('layout_0');
        let movingElemnt: HTMLElement = resizingElement.querySelector('.e-south-east');
        let targetElemnt: HTMLElement = document.getElementById('layout_0');
        let mouseOver: any = getEventObject('MouseEvents', 'mouseover', movingElemnt, targetElemnt, 30, 60);
        mouseOver = setMouseCordinates(mouseOver, 30, 60);
        EventHandler.trigger(<HTMLElement>movingElemnt, 'mouseover', mouseOver);
        let mousedown: any = getEventObject('MouseEvents', 'mousedown', movingElemnt, targetElemnt, 197, 198);
        EventHandler.trigger(<HTMLElement>movingElemnt, 'mousedown', mousedown);
        let mousemove: any = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 150, 160);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
        mousemove = setMouseCordinates(mousemove, 110, 120);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove = setMouseCordinates(mousemove, 70, 80);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        let mouseup: any = getEventObject('MouseEvents', 'mouseup', movingElemnt, targetElemnt);
        mouseup.type = 'mouseup';
        EventHandler.trigger(<any>(document), 'mouseup', mouseup);
    }

});

document.getElementById("6").addEventListener('click', function (args: any) {
    if (!args.target.classList.contains("e-active")) {
        args.target.classList.add("e-active");
        let resizingElement: HTMLElement = document.getElementById('layout_1');
        let movingElemnt: HTMLElement = resizingElement.querySelector('.e-south-east');
        let targetElemnt: HTMLElement = document.getElementById('layout_1');
        let mouseOver: any = getEventObject('MouseEvents', 'mouseover', movingElemnt, targetElemnt, 300, 190);
        mouseOver = setMouseCordinates(mouseOver, 300, 190);
        EventHandler.trigger(<HTMLElement>movingElemnt, 'mouseover', mouseOver);
        let mousedown: any = getEventObject('MouseEvents', 'mousedown', movingElemnt, targetElemnt, 309, 198);
        EventHandler.trigger(<HTMLElement>movingElemnt, 'mousedown', mousedown);
        let mousemove: any = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 280, 150);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
        mousemove = setMouseCordinates(mousemove, 140, 100);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove = setMouseCordinates(mousemove, 190, 80);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        let mouseup: any = getEventObject('MouseEvents', 'mouseup', movingElemnt, targetElemnt);
        mouseup.type = 'mouseup';
        EventHandler.trigger(<any>(document), 'mouseup', mouseup);
    } else {
        args.target.classList.remove("e-active");
        let resizingElement: HTMLElement = document.getElementById('layout_1');
        let movingElemnt: HTMLElement = resizingElement.querySelector('.e-south-east');
        let targetElemnt: HTMLElement = document.getElementById('layout_14');
        let mouseOver: any = getEventObject('MouseEvents', 'mouseover', movingElemnt, targetElemnt, 180, 80);
        mouseOver = setMouseCordinates(mouseOver, 180, 80);
        EventHandler.trigger(<HTMLElement>movingElemnt, 'mouseover', mouseOver);
        let mousedown: any = getEventObject('MouseEvents', 'mousedown', movingElemnt, targetElemnt, 197, 86);
        EventHandler.trigger(<HTMLElement>movingElemnt, 'mousedown', mousedown);
        let mousemove: any = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 230, 120);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
        mousemove = setMouseCordinates(mousemove, 280, 175);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove = setMouseCordinates(mousemove, 300, 200);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        let mouseup: any = getEventObject('MouseEvents', 'mouseup', movingElemnt, targetElemnt);
        mouseup.type = 'mouseup';
        EventHandler.trigger(<any>(document), 'mouseup', mouseup);
    }
});

document.getElementById("11").addEventListener('click', function (args: any) {
    if (!args.target.classList.contains("e-active")) {
        args.target.classList.add("e-active");
        let resizingElement: HTMLElement = document.getElementById('layout_16');
        let movingElemnt: HTMLElement = resizingElement.querySelector('.e-south-east');
        let targetElemnt: HTMLElement = document.getElementById('layout_16');
        let mouseOver: any = getEventObject('MouseEvents', 'mouseover', movingElemnt, targetElemnt, 500, 500);
        mouseOver = setMouseCordinates(mouseOver, 500, 500);
        EventHandler.trigger(<HTMLElement>movingElemnt, 'mouseover', mouseOver);
        let mousedown: any = getEventObject('MouseEvents', 'mousedown', movingElemnt, targetElemnt, 533, 534);
        EventHandler.trigger(<HTMLElement>movingElemnt, 'mousedown', mousedown);
        let mousemove: any = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 480, 580);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
        mousemove = setMouseCordinates(mousemove, 500, 620);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove = setMouseCordinates(mousemove, 500, 646);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        let mouseup: any = getEventObject('MouseEvents', 'mouseup', movingElemnt, targetElemnt);
        mouseup.type = 'mouseup';
        EventHandler.trigger(<any>(document), 'mouseup', mouseup);
    } else {
        args.target.classList.remove("e-active");
        let resizingElement: HTMLElement = document.getElementById('layout_16');
        let movingElemnt: HTMLElement = resizingElement.querySelector('.e-south-east');
        let targetElemnt: HTMLElement = document.getElementById('layout_16');
        let mouseOver: any = getEventObject('MouseEvents', 'mouseover', movingElemnt, targetElemnt, 500, 500);
        mouseOver = setMouseCordinates(mouseOver, 500, 500);
        EventHandler.trigger(<HTMLElement>movingElemnt, 'mouseover', mouseOver);
        let mousedown: any = getEventObject('MouseEvents', 'mousedown', movingElemnt, targetElemnt, 533, 646);
        EventHandler.trigger(<HTMLElement>movingElemnt, 'mousedown', mousedown);
        let mousemove: any = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 450, 600);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
        mousemove = setMouseCordinates(mousemove, 420, 550);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove = setMouseCordinates(mousemove, 400, 534);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        let mouseup: any = getEventObject('MouseEvents', 'mouseup', movingElemnt, targetElemnt);
        mouseup.type = 'mouseup';
        EventHandler.trigger(<any>(document), 'mouseup', mouseup);
    }
});

document.getElementById("12").addEventListener('click', function (args: any) {
    if (!args.target.classList.contains("e-active")) {
        args.target.classList.add("e-active");
        let resizingElement: HTMLElement = document.getElementById('layout_3');
        let movingElemnt: HTMLElement = resizingElement.querySelector('.e-south-east');
        let targetElemnt: HTMLElement = document.getElementById('layout_3');
        let mouseOver: any = getEventObject('MouseEvents', 'mouseover', movingElemnt, targetElemnt, 500, 300);
        mouseOver = setMouseCordinates(mouseOver, 500, 300);
        EventHandler.trigger(<HTMLElement>movingElemnt, 'mouseover', mouseOver);
        let mousedown: any = getEventObject('MouseEvents', 'mousedown', movingElemnt, targetElemnt, 533, 310);
        EventHandler.trigger(<HTMLElement>movingElemnt, 'mousedown', mousedown);
        let mousemove: any = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 520, 200);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
        mousemove = setMouseCordinates(mousemove, 510, 100);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove = setMouseCordinates(mousemove, 500, 80);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        let mouseup: any = getEventObject('MouseEvents', 'mouseup', movingElemnt, targetElemnt);
        mouseup.type = 'mouseup';
        EventHandler.trigger(<any>(document), 'mouseup', mouseup);
    } else {
        args.target.classList.remove("e-active");
        let resizingElement: HTMLElement = document.getElementById('layout_3');
        let movingElemnt: HTMLElement = resizingElement.querySelector('.e-south-east');
        let targetElemnt: HTMLElement = document.getElementById('layout_3');
        let mouseOver: any = getEventObject('MouseEvents', 'mouseover', movingElemnt, targetElemnt, 500, 80);
        mouseOver = setMouseCordinates(mouseOver, 500, 80);
        EventHandler.trigger(<HTMLElement>movingElemnt, 'mouseover', mouseOver);
        let mousedown: any = getEventObject('MouseEvents', 'mousedown', movingElemnt, targetElemnt, 533, 86);
        EventHandler.trigger(<HTMLElement>movingElemnt, 'mousedown', mousedown);
        let mousemove: any = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 510, 150);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
        mousemove = setMouseCordinates(mousemove, 505, 250);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove = setMouseCordinates(mousemove, 500, 300);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        let mouseup: any = getEventObject('MouseEvents', 'mouseup', movingElemnt, targetElemnt);
        mouseup.type = 'mouseup';
        EventHandler.trigger(<any>(document), 'mouseup', mouseup);
    }
});

document.getElementById("allowResizing").addEventListener('click', function (args: any) {
    if (!args.target.classList.contains("e-active")) {
        args.target.classList.add("e-active");
        defaultDashboard.allowResizing = true;
    } else {
        args.target.classList.remove("e-active");
        defaultDashboard.allowResizing = false;
    }
});