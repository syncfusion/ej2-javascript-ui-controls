import { DashboardLayout, ResizeArgs, ChangeEventArgs, DragStartArgs, DragStopArgs, DraggedEventArgs } from "../src/dashboard-layout/dashboard-layout";
import { PanelModel } from "../src/dashboard-layout/dashboard-layout-model";
import { setStyleAttribute as setStyle, isNullOrUndefined, createElement, detach, EventHandler } from '@syncfusion/ej2-base';
import { profile, inMB, getMemoryProfile } from './common.spec';
import { Browser } from '@syncfusion/ej2-base';

function copyObject(source: any, destiation: any): Object {
    for (let prop in source) {
        destiation[prop] = source[prop];
    }
    return destiation;
}

function generateTemplate(content: string) {
    if (!document.getElementById('temp')) {
        let tempEle: HTMLElement = document.createElement('DIV');
        tempEle.setAttribute('id', 'temp');
        document.body.appendChild(tempEle);
    }

    return '<div class="tempcontent">' + content + '</div>';
}

function getTouchEventObject(target: HTMLElement, eventName: string, x?: number, y?: number): Object {
    let touchObj = new Touch({
        pageX: x,
        pageY: y, target: target,
        identifier: null,
        clientX: x,
        clientY: y,
        screenX: x,
        screenY: y,
        radiusX: 2.5,
        radiusY: 2.5,
        rotationAngle: 10,
        altitudeAngle: 0,
        azimuthAngle: 0,
        force: 0.5,
        touchType: null
    });

    let touchEvent = new TouchEvent(eventName, {
        cancelable: true,
        bubbles: true,
        touches: [touchObj],
        targetTouches: [],
        changedTouches: [touchObj],
        shiftKey: true,
    });
    let returnObject: any = copyObject(touchEvent, {});
    returnObject.currentTarget = target;
    return returnObject;
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

function setCss(panelElements: HTMLElement[]) {
    for (let j = 0; j < panelElements.length; j++) {
        setStyle(panelElements[j], { "position": "absolute" });
        setStyle(panelElements[j], { "border": "1px solid black" });
    }
}

describe('GridLayout', () => {
    beforeAll(() => {
        let Chromebrowser: string = "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36";
        Browser.userAgent = Chromebrowser;
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            pending(); //Skips test (in Chai)
            return;
        }
    });
    let gridLayOut: any;
    let ele: HTMLElement;
    let parentEle: HTMLElement;
    let panelObject: any = [
        {
            id: "one",
            cssClass: "e-one",

            sizeX: 2,
            sizeY: 1,
            row: 1,
            col: 0,

            body: {
                content: ("#template1")
            }
        },
        {
            id: "two",
            cssClass: "e-two",

            sizeX: 2,
            sizeY: 1,
            row: 0,
            col: 0,
            body: {
                content: "#template2"
            },
        },
        {
            id: "three",
            cssClass: "e-three",

            sizeX: 1,
            sizeY: 1,
            row: 0,
            col: 2,
            body: {
                content: ("#template2")
            }
        },
        {
            id: "four",
            cssClass: "e-four",

            sizeX: 5,
            sizeY: 1,
            row: 2,
            col: 0,
            body: {
                content: ("#template1")
            }
        },
        {
            id: "five",
            cssClass: "e-five",

            sizeX: 3,
            sizeY: 1,
            row: 1,
            col: 2,
            body: {
                content: ("#template1")
            }
        },
        {
            id: "six",
            cssClass: "e-six",

            sizeX: 2,
            sizeY: 1,
            row: 0,
            col: 3,
            body: {
                content: ("#template2")
            }
        }
    ];
    let newPanels: any = [
        {
            id: "one",
            cssClass: "e-one",
            sizeX: 2,
            sizeY: 1,
            row: 0,
            col: 0,

        },
        {
            id: "two",
            cssClass: "e-two",
            sizeX: 2,
            sizeY: 1,
            row: 0,
            col: 0,
        },
        {
            id: "three",
            cssClass: "e-three",
            sizeX: 2,
            sizeY: 2,
            row: 0,
            col: 0,
        },
    ];

    describe('layout testing', () => {
        beforeEach(() => {
            ele = createElement('div', { id: 'gridlayout' });
            let parentEle: HTMLElement = createElement('div', { id: 'container' });
            parentEle.style.width = '1264px';
            parentEle.appendChild(ele);
            document.body.appendChild(parentEle);
            setStyle(ele, { 'position': 'relative' });
            let template1: HTMLElement = createElement('script', { id: 'template1' });
            template1.setAttribute("type", "text/x-template");
            let UL1: HTMLElement = createElement('ul');
            for (let i = 0; i < 3; i++) {
                let LI: HTMLElement = createElement('li');
                LI.innerHTML = i.toString();
                UL1.appendChild(LI)
            }
            template1.appendChild(UL1);
            document.body.appendChild(template1);
            let template2: HTMLElement = createElement('script', { id: 'template2' });
            template2.setAttribute("type", "text/x-template");
            let UL2: HTMLElement = createElement('ul');
            for (let i = 0; i < 3; i++) {
                let LI: HTMLElement = createElement('li');
                LI.innerHTML = i.toString();
                UL2.appendChild(LI)
            }
            template2.appendChild(UL2);
            document.body.appendChild(template2);
            let template3: HTMLElement = createElement('script');
            template3.classList.add("headertemp");
            template2.setAttribute("type", "text/x-template");
            let UL3: HTMLElement = createElement('ul');
            for (let i = 0; i < 3; i++) {
                let LI: HTMLElement = createElement('li');
                LI.innerHTML = i.toString();
                UL3.appendChild(LI)
            }
            template3.appendChild(UL2);
            document.body.appendChild(template3);
            let template: HTMLElement = createElement('div', { id: 'template' });
            document.body.appendChild(template);
        });
        afterEach(() => {
            if (gridLayOut) {
                gridLayOut.destroy();
                detach(ele);
                // detach(parentEle);
            }
        });

        it('Normal case testing for single panel rendering', () => {
            let content = generateTemplate('0');
            gridLayOut = new DashboardLayout({
                cellAspectRatio: 1,
                cellSpacing: [5, 5],
                allowResizing: true,
                panels: [
                    { "id": '0', "sizeX": 20, "sizeY": 1, "row": 0, "col": 0, content: content },
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            expect(gridLayOut.element.childElementCount === 1).toBe(true);
        });
        it('Panel refresh after the resize', () => {
            gridLayOut = new DashboardLayout({
                cellAspectRatio: 1,
                cellSpacing: [5, 5],
                columns: 5,
                panels: [
                    { id: "first", sizeX: 1, sizeY: 1, row: 0, col: 0 },
                    { id: "second", sizeX: 3, sizeY: 2, row: 0, col: 1 },
                    { id: "third", sizeX: 1, sizeY: 3, row: 0, col: 4 },
                    { id: "fourth", sizeX: 1, sizeY: 1, row: 1, col: 0 },
                    { id: "fifth", sizeX: 2, sizeY: 1, row: 2, col: 0 },
                    { id: "sixth", sizeX: 1, sizeY: 1, row: 2, col: 2 },
                    { id: "seventh", sizeX: 1, sizeY: 1, row: 2, col: 3 }
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            expect(document.getElementById('container').style.width).toEqual('1264px');
            expect(gridLayOut.element.querySelector('#first').style.width).toEqual('248.8px');
            expect(gridLayOut.element.querySelector('#second').style.width).toEqual('756.4px');
            expect(gridLayOut.element.querySelector('#fifth').style.width).toEqual('502.6px');
            (document.querySelectorAll('#container')[1] as HTMLElement).style.width = "800px";
            gridLayOut.refresh();
            expect(gridLayOut.element.querySelector('#first').style.width).not.toEqual('248px');
            expect(gridLayOut.element.querySelector('#second').style.width).not.toEqual('754px');
            expect(gridLayOut.element.querySelector('#fifth').style.width).not.toEqual('501px');
        });

        it('Nested panel refresh after the window resize', () => {
            gridLayOut = new DashboardLayout({
                cellSpacing: [10, 10],
                columns: 20,
                allowResizing: true,
                panels: [
                    { id: 'first', sizeX: 20, sizeY: 10, row: 0, col: 0, content: '<div id="nested_dashboard"></div>' },
                    { id: 'second', sizeX: 15, sizeY: 2, row: 0, col: 1 }
                ]
            });
            gridLayOut.appendTo('#gridlayout');

            let NestedDashboard: DashboardLayout = new DashboardLayout({
                cellSpacing: [10, 10],
                columns: 6,
                allowResizing: true,
                panels: [ { id: 'Panel1', sizeX: 4, sizeY: 2, row: 0, col: 0 } ]
            });
            NestedDashboard.appendTo('#nested_dashboard');
            (document.querySelectorAll('#container')[0] as HTMLElement).style.width = '800px';
            window.dispatchEvent(new Event('resize'));
            gridLayOut.refresh();
            expect(document.getElementById('container').style.width).not.toEqual('1264px');
            expect(gridLayOut.element.querySelector('#first').style.width).not.toEqual('248px');
            expect(gridLayOut.element.querySelector('#second').style.width).not.toEqual('1264px');
            document.getElementById('container').style.width = '1264px';
        });

        it('updatePanel public method test case', () => {
            gridLayOut = new DashboardLayout({
                cellAspectRatio: 1,
                columns: 8,
                cellSpacing: [10, 10],
                showGridLines: true,
                panels: [{
                    id: "one", sizeX: 2, sizeY: 1, row: 1, col: 0, header: "<div></div>",cssClass:"test"
                },
                {
                    id: "two", sizeX: 2, sizeY: 1, row: 0, col: 0, content: "<div>2</div>"
                },
                {
                    id: "three", sizeX: 1, sizeY: 1, row: 0, col: 2, content: "<div>3</div>"
                },
                {
                    id: "four", sizeX: 5, sizeY: 1, row: 2, col: 0, content: "<div>4</div>"
                },
                {
                    id: "five", sizeX: 3, sizeY: 1, row: 1, col: 2, content: "<div>5</div>"
                },
                {
                    id: "six", sizeX: 2, sizeY: 1, row: 0, col: 3, content: "<div>6</div>"
                }]
            });
            gridLayOut.appendTo('#gridlayout');
            expect(document.getElementById('container').style.width).toEqual('1264px');
            expect((<any>gridLayOut).getCellInstance('one').row == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('two').sizeX == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('three').sizeY == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('four').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('five').id == "five").toBe(true);
            expect((<any>gridLayOut).getCellInstance('six').content == "<div>6</div>").toBe(true);
            let panel1 = { id: "one", sizeX: 3, sizeY: 3, row: 0, col: 1, header: '<div>Panel 2</div>', content: "<div>Hello World</div>" }
            gridLayOut.updatePanel(panel1);
            expect((<any>gridLayOut).getCellInstance('one').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('one').col == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('one').sizeX == 3).toBe(true);
            expect((<any>gridLayOut).getCellInstance('one').sizeY == 3).toBe(true);
            expect((<any>gridLayOut).getCellInstance('one').id == 'one').toBe(true);
            expect((<any>gridLayOut).getCellInstance('one').header == '<div>Panel 2</div>').toBe(true);
            expect((<any>gridLayOut).getCellInstance('one').content == "<div>Hello World</div>").toBe(true);
            let panel2 = { sizeX: 2, sizeY: 2, row: 2, col: 2, content: "<div>Hello</div>" };
            gridLayOut.updatePanel(panel2);
            expect((<any>gridLayOut).getCellInstance('one').sizeX == 3).toBe(true);
            expect((<any>gridLayOut).getCellInstance('one').sizeY == 3).toBe(true);
            expect((<any>gridLayOut).getCellInstance('two').sizeX == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('three').sizeY == 1).toBe(true);
            let panel3 = { id: "three", sizeX: 1, sizeY: 3, row: 0, col: 0, content: "<div>333</div>" };
            gridLayOut.updatePanel(panel3);
            expect((<any>gridLayOut).getCellInstance('three').sizeX == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('three').sizeY == 3).toBe(true);
            expect((<any>gridLayOut).getCellInstance('three').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('three').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('three').content == "<div>333</div>").toBe(true);
            let panel4: PanelModel = { id: "one", sizeX: 1, sizeY: 1, row: 0, col: 10, content: null, header: null };
            gridLayOut.updatePanel(panel4);
            expect((<any>gridLayOut).getCellInstance('one').sizeX == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('one').sizeY == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('one').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('one').col == 7).toBe(true);
            expect((<any>gridLayOut).getCellInstance('one').content == null).toBe(true);
            expect((<any>gridLayOut).getCellInstance('one').header == null).toBe(true);
            let panel5: PanelModel = {};
            gridLayOut.updatePanel(panel5);
            let panel6: PanelModel = { id: "one" };
            gridLayOut.updatePanel(panel6);
            let panel7: PanelModel = { id: "seven" };
            gridLayOut.updatePanel(panel7);
        });
        it('Panles rendering with empty objects', () => {
            gridLayOut = new DashboardLayout({
                cellAspectRatio: 1,
                cellSpacing: [5, 5],
                allowResizing: true,
                panels: [
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            expect(gridLayOut.element.childElementCount === 0).toBe(true);
            expect(gridLayOut.panels.length).toBe(0);
        });

        it('XSS testing in panel content with enableHtmlSanitizer property as false', () => {
            let count: number = 100;
            let panelData: PanelModel[] = [{
                'id': count.toString() + '_layout', 'sizeX': 1, 'sizeY': 1, 'row': 0, 'col': 0,
                content: '<span id="close" class="e-template-icon e-clear-icon"><style>body{background:rgb(0, 0, 255)}<\/style></span><div class="text-align">' + count.toString() + '</div>'
            }];
            gridLayOut = new DashboardLayout({
                cellSpacing: [10, 10],
                allowResizing: true,
                columns: 5,
                enableHtmlSanitizer: false,
                panels: panelData

            });
            gridLayOut.appendTo('#gridlayout');
            var ele = document.body;
            expect(window.getComputedStyle(ele).backgroundColor).toBe("rgb(0, 0, 255)");
        });
        it('XSS testing in panel content with enableHtmlSanitizer property as true', () => {
            let count: number = 100;
            let panelData: PanelModel[] = [{
                'id': count.toString() + '_layout', 'sizeX': 1, 'sizeY': 1, 'row': 0, 'col': 0,
                content: '<span id="close" class="e-template-icon e-clear-icon"><style>body{background:rgb(0, 0, 255)}<\/style></span><div class="text-align">' + count.toString() + '</div>'
            }];
            gridLayOut = new DashboardLayout({
                cellSpacing: [10, 10],
                allowResizing: true,
                columns: 5,
                enableHtmlSanitizer: true,
                panels: panelData

            });
            gridLayOut.appendTo('#gridlayout');
            var ele = document.body;
            expect(window.getComputedStyle(ele).backgroundColor).not.toBe("rgb(0, 0, 255)");
        });
        it('XSS testing in panel header with enableHtmlSanitizer property as false', () => {
            let count: number = 100;
            let panelData: PanelModel[] = [{
                'id': count.toString() + '_layout', 'sizeX': 1, 'sizeY': 1, 'row': 0, 'col': 0,
                content: '<span id="close" class="e-template-icon e-clear-icon"></span><div class="text-align">' + count.toString() + '</div>',
                header: '<span>header</span><style>body{background:rgb(0, 0, 255)}<\/style>'
            }];
            gridLayOut = new DashboardLayout({
                cellSpacing: [10, 10],
                allowResizing: true,
                columns: 5,
                enableHtmlSanitizer: false,
                panels: panelData

            });
            gridLayOut.appendTo('#gridlayout');
            var ele = document.body;
            expect(window.getComputedStyle(ele).backgroundColor).toBe("rgb(0, 0, 255)");
        });
        it('XSS testing in panel header with enableHtmlSanitizer property as true', () => {
            let count: number = 100;
            let panelData: PanelModel[] = [{
                'id': count.toString() + '_layout', 'sizeX': 1, 'sizeY': 1, 'row': 0, 'col': 0,
                content: '<span id="close" class="e-template-icon e-clear-icon"></span><div class="text-align">' + count.toString() + '</div>',
                header: '<span>header</span><style>body{background:rgb(0, 0, 255)}<\/style>'
            }];
            gridLayOut = new DashboardLayout({
                cellSpacing: [10, 10],
                allowResizing: true,
                columns: 5,
                enableHtmlSanitizer: true,
                panels: panelData

            });
            gridLayOut.appendTo('#gridlayout');
            var ele = document.body;
            expect(window.getComputedStyle(ele).backgroundColor).not.toBe("rgb(0, 0, 255)");
        });

        it('Normal case testing for single panel rendering without body to restrict', () => {
            let content = generateTemplate('0');
            gridLayOut = new DashboardLayout({
                cellAspectRatio: 1,
                columns: 12,
                cellSpacing: [5, 5],
                allowResizing: true,
                panels: [
                    { "id": '0', "sizeX": 2, "sizeY": 1, "row": 0, "col": 0 },
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            // expect(gridLayOut.element.childElementCount === 1).toBe(false);
        });
        it('Z-index test case', () => {
            let content = generateTemplate('0');
            gridLayOut = new DashboardLayout({
                cellAspectRatio: 1,
                columns: 12,
                cellSpacing: [5, 5],
                allowResizing: true,
                panels: [
                    { "id": '0', "sizeX": 2, "sizeY": 1, "row": 0, "col": 0, "zIndex": 100 },
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            expect(gridLayOut.element.children[0].style.zIndex).toBe('100');
        });
        it('addPanel in mobile resolution test case', () => {
            gridLayOut = new DashboardLayout({
                cellAspectRatio: 1,
                columns: 12,
                cellSpacing: [5, 5],
                allowResizing: true,
                panels: [
                    { "id": 'layout_0', "sizeX": 2, "sizeY": 1, "row": 0, "col": 0, "zIndex": 100 },
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            gridLayOut.checkMediaQuerySizing();
            gridLayOut.addPanel({ id: 'first', "sizeX": 1, "sizeY": 1, "row": 0, "col": 0 });
            expect(gridLayOut.element.children[0].getAttribute('id')).toBe('first');
            gridLayOut.destroy();
        });
        it('component destroy  test case', () => {
            gridLayOut = new DashboardLayout({
                cellAspectRatio: 1,
                columns: 12,
                cellSpacing: [5, 5],
                allowResizing: true,
                panels: [
                    { "id": 'layout_0', "sizeX": 2, "sizeY": 1, "row": 0, "col": 0, "zIndex": 100 },
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            gridLayOut.destroy();
            expect(document.getElementById('gridlayout').classList.contains('e-dashboardlayout')).toBe(false)
            expect(document.getElementById('gridlayout').classList.contains('e-lib')).toBe(false)
            expect(document.getElementById('gridlayout').classList.contains('e-control')).toBe(false)
        });

        it('mobile resolution height test case', () => {
            gridLayOut = new DashboardLayout({
                cellAspectRatio: 1,
                columns: 12,
                cellSpacing: [5, 5],
                allowResizing: true,
                panels: [
                    { "id": 'first', "sizeX": 2, "sizeY": 1, "row": 0, "col": 0, "zIndex": 100 },
                    { "id": 'second', "sizeX": 2, "sizeY": 2, "row": 2, "col": 2, "zIndex": 100 },
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            gridLayOut.checkMediaQuerySizing();
            expect(gridLayOut.element.children[0].offsetHeight).toBe(gridLayOut.element.children[0].offsetHeight);
            // expect(gridLayOut.element.children[1].offsetHeight).toBe(gridLayOut.element.children[0].offsetHeight * 2);
        });

        it('mobile resolution height customization', () => {
            gridLayOut = new DashboardLayout({
                cellAspectRatio: 1,
                columns: 12,
                cellSpacing: [5, 5],
                allowResizing: true,            
                panels: [
                    { "id": 'first', "sizeX": 2, "sizeY": 1, "row": 0, "col": 1, "zIndex": 100 },
                    { "id": 'second', "sizeX": 2, "sizeY": 2, "row": 2, "col": 2, "zIndex": 100 },
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            gridLayOut.checkMediaQuerySizing();
            expect(gridLayOut.element.children[0].offsetHeight).toBe(gridLayOut.element.children[0].offsetHeight);
            // expect(gridLayOut.element.children[1].offsetHeight).toBe(gridLayOut.element.children[0].offsetHeight * 2);
        });

        it(' showGridLines test case', () => {
            gridLayOut = new DashboardLayout({
                cellAspectRatio: 1,
                columns: 12,
                cellSpacing: [5, 5],
                allowResizing: true,
                showGridLines: true,
                panels: [
                    { "id": 'first', "sizeX": 2, "sizeY": 1, "row": 0, "col": 0, "zIndex": 100 },
                    { "id": 'second', "sizeX": 2, "sizeY": 2, "row": 2, "col": 2, "zIndex": 100 },
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            expect(document.querySelector('.e-dashboardlayout.e-control table tbody tr td.e-dashboard-gridline').classList.contains('e-dashboard-gridline')).toBe(true);
        });
        it(' showGridLines onproperty test case', () => {
            gridLayOut = new DashboardLayout({
                cellAspectRatio: 1,
                columns: 12,
                cellSpacing: [5, 5],
                allowResizing: true,
                showGridLines: false,
                panels: [
                    { "id": 'first', "sizeX": 2, "sizeY": 1, "row": 0, "col": 0, "zIndex": 100 },
                    { "id": 'second', "sizeX": 2, "sizeY": 2, "row": 2, "col": 2, "zIndex": 100 },
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            expect(document.querySelector('.e-dashboardlayout.e-control table tbody tr td.e-dashboard-gridline')).toBe(null);
            gridLayOut.showGridLines = true;
            gridLayOut.dataBind();
            expect(document.querySelector('.e-dashboardlayout.e-control table tbody tr td.e-dashboard-gridline').classList.contains('e-dashboard-gridline')).toBe(true);
            gridLayOut.showGridLines = false;
            gridLayOut.dataBind();
            expect(gridLayOut.element.querySelector('.e-dashboard-gridline-table')).toBe(null);
        });

        it('Panels properties test case', () => {
            gridLayOut = new DashboardLayout({
                cellAspectRatio: 1,
                columns: 12,
                cellSpacing: [5, 5],
                allowResizing: true,
                panels: [
                    { "id": '0', "sizeX": 2, "sizeY": 1, "row": 0, "col": 0, "zIndex": 100 },
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            gridLayOut.panels = [{ id: 'first', "sizeX": 1, "sizeY": 1, "row": 0, "col": 0 }, { id: 'second', "sizeX": 1, "sizeY": 1, "row": 0, "col": 0 }];
            gridLayOut.dataBind();
            expect(gridLayOut.element.childElementCount).toBe(2);
        });

        it('Panels properties test case with gridLines', () => {
            gridLayOut = new DashboardLayout({
                cellAspectRatio: 1,
                columns: 12,
                cellSpacing: [5, 5],
                showGridLines: true,
                allowResizing: true,
                panels: [
                    { "id": '0', "sizeX": 2, "sizeY": 1, "row": 0, "col": 0, "zIndex": 100 },
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            gridLayOut.panels = [{ id: 'first', "sizeX": 1, "sizeY": 1, "row": 0, "col": 0 }, { id: 'second', "sizeX": 1, "sizeY": 1, "row": 0, "col": 0 }];
            gridLayOut.dataBind();
            expect(gridLayOut.element.childElementCount).toBe(3);
            expect(gridLayOut.element.querySelector('.e-dashboard-gridline-table').classList.contains('e-dashboard-gridline-table')).toBe(true);
        });

        it('mediaQuery true testcase for onproperty change', () => {
            gridLayOut = new DashboardLayout({
                cellAspectRatio: 1,
                columns: 12,
                cellSpacing: [5, 5],
                allowResizing: true,
                panels: [
                    { id: 'first', "sizeX": 1, "sizeY": 1, "row": 0, "col": 0 },
                    { id: 'second', "sizeX": 1, "sizeY": 1, "row": 0, "col": 1 }
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            expect(gridLayOut.element.childElementCount).toBe(2);
            gridLayOut.mediaQuery = 'max-width: 2000px';
            gridLayOut.dataBind();
            expect((<any>gridLayOut).getCellInstance('first').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('second').row == 1).toBe(true);
        });

        it('mediaQuery true testcase for initial testing', () => {
            gridLayOut = new DashboardLayout({
                cellAspectRatio: 1,
                columns: 12,
                mediaQuery: 'max-width: 2000px',
                cellSpacing: [5, 5],
                allowResizing: true,
                panels: [
                    { id: 'first', "sizeX": 1, "sizeY": 1, "row": 0, "col": 0 },
                    { id: 'second', "sizeX": 1, "sizeY": 1, "row": 0, "col": 1 }
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            expect(gridLayOut.element.childElementCount).toBe(2);
            expect((<any>gridLayOut).getCellInstance('first').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('second').row == 1).toBe(true);
        });

        it('Rowheight with root element height test case ', () => {
            let content = generateTemplate('0');
            gridLayOut = new DashboardLayout({
                cellAspectRatio: 100,
                cellSpacing: [5, 5],
                allowResizing: true,
                panels: [
                    { "id": '0', "sizeX": 1, "sizeY": 1, "row": 0, "col": 0, content: content },
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            expect(gridLayOut.element.children[0].offsetHeight).toBe(gridLayOut.element.offsetHeight);
            expect(gridLayOut.element.children[0].offsetWidth).toBe(gridLayOut.element.offsetWidth);
        });

        it('columns with root element height test case ', () => {
            let content = generateTemplate('0');
            gridLayOut = new DashboardLayout({
                columns: 12,
                cellAspectRatio: 1,
                cellSpacing: [5, 5],
                allowResizing: true,
                panels: [
                    { "id": '0', "sizeX": 1, "sizeY": 1, "row": 0, "col": 0, content: content },
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            expect(gridLayOut.element.children[0].offsetHeight).toBe(gridLayOut.element.children[0].offsetWidth);
        });
        it('columns without panels root element height test case ', () => {
            let content = generateTemplate('0');
            gridLayOut = new DashboardLayout({
                cellAspectRatio: 1,
                cellSpacing: [5, 5],
                allowResizing: true,
                panels: [
                    { "id": '0', "sizeX": 1, "sizeY": 1, "row": 0, "col": 0, content: content },
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            expect(gridLayOut.element.children[0].offsetHeight).toBe(1264);
            expect(gridLayOut.element.offsetWidth).toBe(gridLayOut.element.parentElement.offsetWidth);
        });
        it('addpanel with root element height test case ', () => {
            let content = generateTemplate('0');
            gridLayOut = new DashboardLayout({
                columns: 12,
                cellAspectRatio: 1,
                cellSpacing: [5, 5],
                allowResizing: true,
                panels: [
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            gridLayOut.addPanel({ "id": '0', "sizeX": 2, "sizeY": 1, "row": 0, "col": 0, content: content });
            expect(gridLayOut.element.children[0].offsetHeight).toBe(101);
            expect(gridLayOut.element.offsetHeight).toBe(gridLayOut.element.children[0].offsetHeight);
        });
        it('addpanel with root element height with mediaquery null test case ', () => {
            let content = generateTemplate('0');
            gridLayOut = new DashboardLayout({
                columns: 12,
                cellAspectRatio: 1,
                cellSpacing: [5, 5],
                allowResizing: true,
                panels: [
                ], mediaQuery: null
            });
            gridLayOut.appendTo('#gridlayout');
            gridLayOut.addPanel({ "id": '0', "sizeX": 2, "sizeY": 1, "row": 0, "col": 0, content: content });
            expect(gridLayOut.element.children[0].offsetHeight).toBe(101);
            expect(gridLayOut.element.offsetHeight).toBe(gridLayOut.element.children[0].offsetHeight);
        });
        it('root element height with remove panel test case ', () => {
            let content = generateTemplate('0');
            gridLayOut = new DashboardLayout({
                columns: 12,
                cellAspectRatio: 1,
                cellSpacing: [5, 5],
                allowResizing: true,
                panels: [],
                mediaQuery: null
            });
            gridLayOut.appendTo('#gridlayout');
            expect(gridLayOut.element.style.height).toBe('');
            gridLayOut.addPanel({ "id": '0', "sizeX": 2, "sizeY": 1, "row": 0, "col": 0, content: content });
            expect(gridLayOut.element.style.height).toBe(gridLayOut.element.querySelector('.e-panel').style.height);
            gridLayOut.removePanel('0');
            expect(gridLayOut.element.style.height).toBe('');
        });

        it('Columns less than panels value with space available', () => {
            gridLayOut = new DashboardLayout({
                columns: 2,
                cellAspectRatio: 1,
                cellSpacing: [5, 5],
                allowResizing: true,
                panels: [
                    { "id": '0', "sizeX": 1, "sizeY": 1, "row": 0, "col": 1 },
                    { "id": '1', "sizeX": 1, "sizeY": 1, "row": 0, "col": 3 },
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            expect((<any>gridLayOut).getCellInstance('0').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('0').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('1').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('1').col == 1).toBe(true);
        });
        it('Columns not specified case and panels are out of columns', () => {
            gridLayOut = new DashboardLayout({
                cellAspectRatio: 100 / 20,
                cellSpacing: [5, 5],
                panels: [
                    { "sizeX": 1, "sizeY": 1, "row": 0, "col": 0, content: generateTemplate('0') },
                    { "sizeX": 1, "sizeY": 1, "row": 0, "col": 8, content: generateTemplate('16') },
                    { "sizeX": 3, "sizeY": 1, "row": 0, "col": 9, content: generateTemplate('17') },
                    { "sizeX": 2, "sizeY": 2, "row": 0, "col": 1, content: generateTemplate('1') },
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
                    { "sizeX": 3, "sizeY": 2, "row": 5, "col": 5, content: generateTemplate('14') },
                    { "sizeX": 5, "sizeY": 1, "row": 5, "col": 0, content: generateTemplate('15') },
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            expect((<any>gridLayOut).getCellInstance('layout_0').row == 23).toBe(true);
            expect((<any>gridLayOut).getCellInstance('layout_1').row == 22).toBe(true);
            expect((<any>gridLayOut).getCellInstance('layout_2').row == 21).toBe(true);
            expect((<any>gridLayOut).getCellInstance('layout_3').row == 19).toBe(true);
            expect((<any>gridLayOut).getCellInstance('layout_4').row == 18).toBe(true);
            expect((<any>gridLayOut).getCellInstance('layout_5').row == 15).toBe(true);
            expect((<any>gridLayOut).getCellInstance('layout_6').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('layout_7').row == 14).toBe(true);
            expect((<any>gridLayOut).getCellInstance('layout_8').row == 12).toBe(true);
            expect((<any>gridLayOut).getCellInstance('layout_9').row == 10).toBe(true);
            expect((<any>gridLayOut).getCellInstance('layout_10').row == 11).toBe(true);
            expect((<any>gridLayOut).getCellInstance('layout_11').row == 8).toBe(true);
            expect((<any>gridLayOut).getCellInstance('layout_12').row == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('layout_13').row == 9).toBe(true);
            expect((<any>gridLayOut).getCellInstance('layout_14').row == 3).toBe(true);
            expect((<any>gridLayOut).getCellInstance('layout_15').row == 4).toBe(true);
            expect((<any>gridLayOut).getCellInstance('layout_16').row == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('layout_17').row == 6).toBe(true);
            expect((<any>gridLayOut).getCellInstance('layout_18').row == 5).toBe(true);
        });
        it('Columns specified case and dynamically changed as 1', () => {
            gridLayOut = new DashboardLayout({
                cellAspectRatio: 100 / 20,
                cellSpacing: [5, 5],
                columns: 12,
                panels: [
                    { "sizeX": 1, "sizeY": 1, "row": 0, "col": 0, content: generateTemplate('0') },
                    { "sizeX": 2, "sizeY": 2, "row": 0, "col": 1, content: generateTemplate('1') },
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
                    { "sizeX": 3, "sizeY": 2, "row": 5, "col": 5, content: generateTemplate('14') },
                    { "sizeX": 5, "sizeY": 1, "row": 5, "col": 0, content: generateTemplate('15') },
                    { "sizeX": 1, "sizeY": 4, "row": 0, "col": 8, content: generateTemplate('16') },
                    { "sizeX": 3, "sizeY": 3, "row": 0, "col": 9, content: generateTemplate('17') },
                    { "sizeX": 2, "sizeY": 1, "row": 3, "col": 9, content: generateTemplate('18') },
                    { "sizeX": 1, "sizeY": 2, "row": 3, "col": 11, content: generateTemplate('19') },
                    { "sizeX": 3, "sizeY": 1, "row": 4, "col": 8, content: generateTemplate('20') },
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            gridLayOut.columns = 1;
            gridLayOut.dataBind();
            expect((<any>gridLayOut).getCellInstance('layout_0').row == 32).toBe(true);
            expect((<any>gridLayOut).getCellInstance('layout_1').row == 30).toBe(true);
            expect((<any>gridLayOut).getCellInstance('layout_2').row == 29).toBe(true);
            expect((<any>gridLayOut).getCellInstance('layout_3').row == 26).toBe(true);
            expect((<any>gridLayOut).getCellInstance('layout_4').row == 11).toBe(true);
            expect((<any>gridLayOut).getCellInstance('layout_5').row == 25).toBe(true);
            expect((<any>gridLayOut).getCellInstance('layout_6').row == 23).toBe(true);
            expect((<any>gridLayOut).getCellInstance('layout_7').row == 21).toBe(true);
            expect((<any>gridLayOut).getCellInstance('layout_8').row == 22).toBe(true);
            expect((<any>gridLayOut).getCellInstance('layout_9').row == 19).toBe(true);
            expect((<any>gridLayOut).getCellInstance('layout_10').row == 12).toBe(true);
            expect((<any>gridLayOut).getCellInstance('layout_11').row == 20).toBe(true);
            expect((<any>gridLayOut).getCellInstance('layout_12').row == 17).toBe(true);
            expect((<any>gridLayOut).getCellInstance('layout_13').row == 18).toBe(true);
            expect((<any>gridLayOut).getCellInstance('layout_14').row == 13).toBe(true);
            expect((<any>gridLayOut).getCellInstance('layout_15').row == 15).toBe(true);
            expect((<any>gridLayOut).getCellInstance('layout_16').row == 14).toBe(true);
            expect((<any>gridLayOut).getCellInstance('layout_17').row == 7).toBe(true);
            expect((<any>gridLayOut).getCellInstance('layout_18').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('layout_19').row == 6).toBe(true);
            expect((<any>gridLayOut).getCellInstance('layout_20').row == 4).toBe(true);
            expect((<any>gridLayOut).getCellInstance('layout_21').row == 3).toBe(true);
        });
        it('Columns less than panels value with no space available', () => {
            gridLayOut = new DashboardLayout({
                columns: 1,
                cellAspectRatio: 1,
                cellSpacing: [5, 5],
                allowResizing: true,
                panels: [
                    { "id": '0', "sizeX": 1, "sizeY": 1, "row": 0, "col": 1 },
                    { "id": '1', "sizeX": 1, "sizeY": 1, "row": 0, "col": 3 },
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            expect((<any>gridLayOut).getCellInstance('0').row == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('0').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('1').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('1').col == 0).toBe(true);
        });
        it('Columns less than panels value with space available and pushing', () => {
            gridLayOut = new DashboardLayout({
                columns: 2,
                cellAspectRatio: 1,
                cellSpacing: [5, 5],
                allowResizing: true,
                panels: [
                    { "id": '0', "sizeX": 2, "sizeY": 1, "row": 0, "col": 0 },
                    { "id": '1', "sizeX": 1, "sizeY": 1, "row": 0, "col": 3 },
                    { "id": '2', "sizeX": 1, "sizeY": 1, "row": 0, "col": 5 },
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            expect((<any>gridLayOut).getCellInstance('0').row == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('0').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('1').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('1').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('2').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('2').col == 1).toBe(true);
        });
        it('Columns less than panels value with space available and pushing with add panel', () => {
            gridLayOut = new DashboardLayout({
                columns: 2,
                cellAspectRatio: 100 / 20,
                cellSpacing: [5, 5],
                allowResizing: true,
                panels: [
                    { "id": '0', "sizeX": 2, "sizeY": 1, "row": 0, "col": 0, content: "<div>0</div>" },
                    { "id": '1', "sizeX": 1, "sizeY": 1, "row": 0, "col": 3, content: "<div>1</div>" },
                    { "id": '2', "sizeX": 1, "sizeY": 1, "row": 0, "col": 5, content: "<div>2</div>" },
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            expect((<any>gridLayOut).getCellInstance('0').row == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('0').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('1').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('1').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('2').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('2').col == 1).toBe(true);
            gridLayOut.addPanel({ "id": '3', "sizeX": 3, "sizeY": 1, "row": 0, "col": 5, content: "<div>3</div>" });
            expect((<any>gridLayOut).getCellInstance('0').row == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('0').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('1').row == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('1').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('2').row == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('2').col == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('3').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('3').col == 0).toBe(true);
            expect(gridLayOut.element.children[1].querySelectorAll('.e-resize').length).toBe(1);
        });
        it('Columns and panels order updating dynamically', () => {
            gridLayOut = new DashboardLayout({
                columns: 6,
                cellAspectRatio: 1,
                cellSpacing: [5, 5],
                allowResizing: true,
                panels: [
                    { "sizeX": 2, "sizeY": 1, "row": 0, "col": 0 },
                    { "sizeX": 2, "sizeY": 1, "row": 0, "col": 2 },
                    { "sizeX": 2, "sizeY": 1, "row": 0, "col": 4 },
                    { "sizeX": 2, "sizeY": 1, "row": 1, "col": 0 },
                    { "sizeX": 2, "sizeY": 1, "row": 1, "col": 2 },
                    { "sizeX": 2, "sizeY": 1, "row": 1, "col": 4 },
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            gridLayOut.columns = 5;
            gridLayOut.panels = [{ "sizeX": 1, "sizeY": 1, "row": 0, "col": 0 },
            { "sizeX": 2, "sizeY": 1, "row": 0, "col": 1 },
            { "sizeX": 2, "sizeY": 1, "row": 0, "col": 3 },
            { "sizeX": 1, "sizeY": 1, "row": 1, "col": 0 },
            { "sizeX": 2, "sizeY": 1, "row": 1, "col": 1 },
            { "sizeX": 2, "sizeY": 1, "row": 1, "col": 3 }];
            gridLayOut.dataBind();
            expect((<any>gridLayOut).getCellInstance('layout_0').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('layout_0').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('layout_0').sizeX == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('layout_1').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('layout_1').col == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('layout_1').sizeX == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('layout_2').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('layout_2').col == 3).toBe(true);
            expect((<any>gridLayOut).getCellInstance('layout_2').sizeX == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('layout_3').row == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('layout_3').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('layout_3').sizeX == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('layout_4').row == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('layout_4').col == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('layout_4').sizeX == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('layout_5').row == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('layout_5').col == 3).toBe(true);
            expect((<any>gridLayOut).getCellInstance('layout_5').sizeX == 2).toBe(true);
        });
        it('Panels and columns order updating dynamically', () => {
            gridLayOut = new DashboardLayout({
                columns: 6,
                cellAspectRatio: 1,
                cellSpacing: [5, 5],
                allowResizing: true,
                panels: [
                    { "sizeX": 2, "sizeY": 1, "row": 0, "col": 0 },
                    { "sizeX": 2, "sizeY": 1, "row": 0, "col": 2 },
                    { "sizeX": 2, "sizeY": 1, "row": 0, "col": 4 },
                    { "sizeX": 2, "sizeY": 1, "row": 1, "col": 0 },
                    { "sizeX": 2, "sizeY": 1, "row": 1, "col": 2 },
                    { "sizeX": 2, "sizeY": 1, "row": 1, "col": 4 },
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            gridLayOut.panels = [{ "sizeX": 1, "sizeY": 1, "row": 0, "col": 0 },
            { "sizeX": 2, "sizeY": 1, "row": 0, "col": 1 },
            { "sizeX": 2, "sizeY": 1, "row": 0, "col": 3 },
            { "sizeX": 1, "sizeY": 1, "row": 1, "col": 0 },
            { "sizeX": 2, "sizeY": 1, "row": 1, "col": 1 },
            { "sizeX": 2, "sizeY": 1, "row": 1, "col": 3 }];
            gridLayOut.columns = 5;
            gridLayOut.dataBind();
            expect((<any>gridLayOut).getCellInstance('layout_0').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('layout_0').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('layout_0').sizeX == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('layout_1').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('layout_1').col == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('layout_1').sizeX == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('layout_2').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('layout_2').col == 3).toBe(true);
            expect((<any>gridLayOut).getCellInstance('layout_2').sizeX == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('layout_3').row == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('layout_3').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('layout_3').sizeX == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('layout_4').row == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('layout_4').col == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('layout_4').sizeX == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('layout_5').row == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('layout_5').col == 3).toBe(true);
            expect((<any>gridLayOut).getCellInstance('layout_5').sizeX == 2).toBe(true);
        });
        it('Resizing test case in east direction alone', () => {
            gridLayOut = new DashboardLayout({
                cellAspectRatio: 1,
                columns: 12,
                cellSpacing: [5, 5],
                resizableHandles: ['e-east'],
                allowResizing: true,
                panels: [
                    { "id": '0', "sizeX": 1, "sizeY": 1, "row": 0, "col": 0, content: generateTemplate('0') },
                    { "id": '1', "sizeX": 1, "sizeY": 1, "row": 0, "col": 1, content: generateTemplate('1') },
                    { "id": '2', "sizeX": 1, "sizeY": 1, "minSizeX": 1, "minSizeY": 1, "row": 0, "col": 2, content: generateTemplate('2') },
                    { "id": '3', "sizeX": 1, "sizeY": 1, "minSizeX": 1, "maxSizeX": 1, "minSizeY": 1, "maxSizeY": 1, "row": 0, "col": 3, content: generateTemplate('3') },
                    { "id": '4', "sizeX": 1, "sizeY": 2, "minSizeX": 1, "maxSizeX": 3, "minSizeY": 1, "maxSizeY": 3, "row": 0, "col": 4, content: generateTemplate('4') },
                    { "id": '5', "sizeX": 1, "sizeY": 2, "minSizeX": 1, "maxSizeX": 3, "minSizeY": 1, "maxSizeY": 3, "row": 0, "col": 7, content: generateTemplate('5') },
                    { "id": '6', "sizeX": 1, "sizeY": 1, "minSizeX": 1, "minSizeY": 1, "row": 1, "col": 8, content: generateTemplate('6') },
                    { "id": '7', "sizeX": 1, "sizeY": 1, "minSizeX": 1, "minSizeY": 1, "row": 0, "col": 8, content: generateTemplate('7') },
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            let resizingElement: HTMLElement = document.getElementById('0');
            resizingElement.classList.add('e-item-hover');
            let movingElemnt: HTMLElement = resizingElement.querySelector('.e-east');
            let targetElemnt: HTMLElement = document.getElementById('1');
            let mouseOver: any = getEventObject('MouseEvents', 'mouseover', movingElemnt, targetElemnt, 30, 60);
            mouseOver = setMouseCordinates(mouseOver, 30, 60);
            EventHandler.trigger(<HTMLElement>movingElemnt, 'mouseover', mouseOver);
            // (<any>gridLayOut).addHoverClass(mouseOver);
            let mousedown: any = getEventObject('MouseEvents', 'mousedown', movingElemnt, targetElemnt, 103, 58);
            EventHandler.trigger(<HTMLElement>movingElemnt, 'mousedown', mousedown);
            let mousemove: any = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 110, 59);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
            mousemove = setMouseCordinates(mousemove, 150, 60);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = setMouseCordinates(mousemove, 162, 58);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            let mouseup: any = getEventObject('MouseEvents', 'mouseup', movingElemnt, targetElemnt);
            mouseup.type = 'mouseup';
            EventHandler.trigger(<any>(document), 'mouseup', mouseup);
            expect((<any>gridLayOut).getCellInstance('0').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('0').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('1').row == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('1').col == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('2').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('2').col == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('3').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('3').col == 3).toBe(true);
            expect((<any>gridLayOut).getCellInstance('4').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('4').col == 4).toBe(true);
            expect(resizingElement.classList.contains("e-dragging")).toBe(false);
        });

        it('Checking dynamic update of empty panels', () => {
            gridLayOut = new DashboardLayout({
                cellAspectRatio: 1,
                columns: 12,
                cellSpacing: [5, 5],
                resizableHandles: ['e-east'],
                allowResizing: true,
                panels: [
                    { "id": '0', "sizeX": 1, "sizeY": 1, "row": 0, "col": 0, content: generateTemplate('0') },
                    { "id": '1', "sizeX": 1, "sizeY": 1, "row": 0, "col": 1, content: generateTemplate('1') },
                    { "id": '2', "sizeX": 1, "sizeY": 1, "minSizeX": 1, "minSizeY": 1, "row": 0, "col": 2, content: generateTemplate('2') },
                    { "id": '3', "sizeX": 1, "sizeY": 1, "minSizeX": 1, "maxSizeX": 1, "minSizeY": 1, "maxSizeY": 1, "row": 0, "col": 3, content: generateTemplate('3') },
                    { "id": '4', "sizeX": 1, "sizeY": 2, "minSizeX": 1, "maxSizeX": 3, "minSizeY": 1, "maxSizeY": 3, "row": 0, "col": 4, content: generateTemplate('4') },
                    { "id": '5', "sizeX": 1, "sizeY": 2, "minSizeX": 1, "maxSizeX": 3, "minSizeY": 1, "maxSizeY": 3, "row": 0, "col": 7, content: generateTemplate('5') },
                    { "id": '6', "sizeX": 1, "sizeY": 1, "minSizeX": 1, "minSizeY": 1, "row": 1, "col": 8, content: generateTemplate('6') },
                    { "id": '7', "sizeX": 1, "sizeY": 1, "minSizeX": 1, "minSizeY": 1, "row": 0, "col": 8, content: generateTemplate('7') },
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            gridLayOut.panels = [];
            gridLayOut.dataBind();
            let CellElements: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>gridLayOut.element.querySelectorAll('.e-panel');
            expect(CellElements.length).toBe(0);
        });

        it('Resizing test case in east direction alone after refresh', () => {
            gridLayOut = new DashboardLayout({
                cellAspectRatio: 1,
                columns: 12,
                cellSpacing: [5, 5],
                resizableHandles: ['e-east'],
                allowResizing: true,
                panels: [
                    { "id": '0', "sizeX": 1, "sizeY": 1, "row": 0, "col": 0, content: generateTemplate('0') },
                    { "id": '1', "sizeX": 1, "sizeY": 1, "row": 0, "col": 1, content: generateTemplate('1') },
                    { "id": '2', "sizeX": 1, "sizeY": 1, "minSizeX": 1, "minSizeY": 1, "row": 0, "col": 2, content: generateTemplate('2') },
                    { "id": '3', "sizeX": 1, "sizeY": 1, "minSizeX": 1, "maxSizeX": 1, "minSizeY": 1, "maxSizeY": 1, "row": 0, "col": 3, content: generateTemplate('3') },
                    { "id": '4', "sizeX": 1, "sizeY": 2, "minSizeX": 1, "maxSizeX": 3, "minSizeY": 1, "maxSizeY": 3, "row": 0, "col": 4, content: generateTemplate('4') },
                    { "id": '5', "sizeX": 1, "sizeY": 2, "minSizeX": 1, "maxSizeX": 3, "minSizeY": 1, "maxSizeY": 3, "row": 0, "col": 7, content: generateTemplate('5') },
                    { "id": '6', "sizeX": 1, "sizeY": 1, "minSizeX": 1, "minSizeY": 1, "row": 1, "col": 8, content: generateTemplate('6') },
                    { "id": '7', "sizeX": 1, "sizeY": 1, "minSizeX": 1, "minSizeY": 1, "row": 0, "col": 8, content: generateTemplate('7') },
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            gridLayOut.refresh();
            let resizingElement: HTMLElement = document.getElementById('0');
            resizingElement.classList.add('e-item-hover');
            let movingElemnt: HTMLElement = resizingElement.querySelector('.e-east');
            let targetElemnt: HTMLElement = document.getElementById('1');
            let mouseOver: any = getEventObject('MouseEvents', 'mouseover', movingElemnt, targetElemnt, 30, 60);
            mouseOver = setMouseCordinates(mouseOver, 30, 60);
            EventHandler.trigger(<HTMLElement>movingElemnt, 'mouseover', mouseOver);
            // (<any>gridLayOut).addHoverClass(mouseOver);
            let mousedown: any = getEventObject('MouseEvents', 'mousedown', movingElemnt, targetElemnt, 103, 58);
            EventHandler.trigger(<HTMLElement>movingElemnt, 'mousedown', mousedown);
            let mousemove: any = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 110, 59);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
            mousemove = setMouseCordinates(mousemove, 150, 60);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = setMouseCordinates(mousemove, 162, 58);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            let mouseup: any = getEventObject('MouseEvents', 'mouseup', movingElemnt, targetElemnt);
            mouseup.type = 'mouseup';
            EventHandler.trigger(<any>(document), 'mouseup', mouseup);
            expect((<any>gridLayOut).getCellInstance('0').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('0').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('1').row == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('1').col == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('2').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('2').col == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('3').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('3').col == 3).toBe(true);
            expect((<any>gridLayOut).getCellInstance('4').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('4').col == 4).toBe(true);
            expect(resizingElement.classList.contains("e-dragging")).toBe(false);
        });

        it('Resizing test case with more rows(browser scroller enabled) south east', () => {
            gridLayOut = new DashboardLayout({
                columns: 6,
                cellAspectRatio: 6,
                cellSpacing: [5, 5],
                allowResizing: true,
                panels: [
                    { id: "zero", sizeX: 2, sizeY: 2, row: 0, col: 0, content: "<div>1</div>" },
                    { id: "one", sizeX: 2, sizeY: 2, row: 2, col: 0, content: "<div>2</div>" },
                    { id: "two", sizeX: 2, sizeY: 2, row: 4, col: 0, content: "<div>3</div>" },
                    { id: "three", sizeX: 2, sizeY: 2, row: 6, col: 0, content: "<div>4</div>" },
                    { id: "four", sizeX: 2, sizeY: 2, row: 8, col: 0, content: "<div>5</div>" },
                    { id: "five", sizeX: 2, sizeY: 2, row: 10, col: 0, content: "<div>6</div>" },
                    { id: "six", sizeX: 2, sizeY: 2, row: 12, col: 0, content: "<div>7</div>" },
                    { id: "seven", sizeX: 2, sizeY: 2, row: 14, col: 0, content: "<div>8</div>" },
                    { id: "eight", sizeX: 2, sizeY: 2, row: 16, col: 0, content: "<div>9</div>" },
                    { id: "nine", sizeX: 2, sizeY: 2, row: 18, col: 0, content: "<div>10</div>" },
                    { id: "ten", sizeX: 2, sizeY: 2, row: 20, col: 0, content: "<div>11</div>" },
                    { id: "eleven", sizeX: 2, sizeY: 2, row: 22, col: 0, content: "<div>12</div>" },
                    { id: "twelve", sizeX: 2, sizeY: 2, row: 24, col: 0, content: "<div>13</div>" }
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            let CellElements: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>gridLayOut.element.querySelectorAll('.e-panel');
            setCss(CellElements);
            let resizingElement: HTMLElement = document.getElementById('eleven');
            resizingElement.classList.add('e-item-hover');
            let movingElemnt: HTMLElement = resizingElement.querySelector('.e-south-east');
            let targetElemnt: HTMLElement = document.getElementById('eleven');
            movingElemnt.style.display = "block";
            let mousedown: any = getTouchEventObject(movingElemnt, 'touchstart', 412, 905);
            EventHandler.trigger(<HTMLElement>movingElemnt, 'touchstart', mousedown);
            let mousemove: any = getTouchEventObject(movingElemnt, 'touchmove', 350, 900);
            EventHandler.trigger(<any>(document), 'touchmove', mousemove);
            mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
            mousemove = getTouchEventObject(movingElemnt, 'touchmove', 250, 890);
            EventHandler.trigger(<any>(document), 'touchmove', mousemove);
            mousemove = getTouchEventObject(movingElemnt, 'touchmove', 230, 870);
            EventHandler.trigger(<any>(document), 'touchmove', mousemove);
            mousemove = getTouchEventObject(movingElemnt, 'touchmove', 195, 865);
            EventHandler.trigger(<any>(document), 'touchmove', mousemove);
            EventHandler.trigger(<any>(document), 'touchmove', mousemove);
            let mouseup: any = getTouchEventObject(movingElemnt, 'touchend');
            mouseup.type = 'touchend';
            EventHandler.trigger(<any>(document), 'touchend', mouseup);
            expect((<any>gridLayOut).getCellInstance('zero').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('zero').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('one').row == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('one').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('two').row == 4).toBe(true);
            expect((<any>gridLayOut).getCellInstance('two').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('three').row == 6).toBe(true);
            expect((<any>gridLayOut).getCellInstance('three').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('four').row == 8).toBe(true);
            expect((<any>gridLayOut).getCellInstance('four').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('five').row == 10).toBe(true);
            expect((<any>gridLayOut).getCellInstance('five').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('six').row == 12).toBe(true);
            expect((<any>gridLayOut).getCellInstance('six').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('seven').row == 14).toBe(true);
            expect((<any>gridLayOut).getCellInstance('seven').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('eight').row == 16).toBe(true);
            expect((<any>gridLayOut).getCellInstance('eight').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('nine').row == 18).toBe(true);
            expect((<any>gridLayOut).getCellInstance('nine').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('ten').row == 20).toBe(true);
            expect((<any>gridLayOut).getCellInstance('ten').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('eleven').row == 22).toBe(true);
            expect((<any>gridLayOut).getCellInstance('eleven').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('twelve').row == 23).toBe(true);
            expect((<any>gridLayOut).getCellInstance('twelve').col == 0).toBe(true);
            expect(resizingElement.classList.contains("e-dragging")).toBe(false);
        });
        it('Resizing test case in east direction alone touch', () => {
            gridLayOut = new DashboardLayout({
                cellAspectRatio: 1,
                columns: 12,
                cellSpacing: [5, 5],
                resizableHandles: ['e-east'],
                allowResizing: true,
                panels: [
                    { "id": '0', "sizeX": 1, "sizeY": 1, "row": 0, "col": 0, content: generateTemplate('0') },
                    { "id": '1', "sizeX": 1, "sizeY": 1, "row": 0, "col": 1, content: generateTemplate('1') },
                    { "id": '2', "sizeX": 1, "sizeY": 1, "minSizeX": 1, "minSizeY": 1, "row": 0, "col": 2, content: generateTemplate('2') },
                    { "id": '3', "sizeX": 1, "sizeY": 1, "minSizeX": 1, "maxSizeX": 1, "minSizeY": 1, "maxSizeY": 1, "row": 0, "col": 3, content: generateTemplate('3') },
                    { "id": '4', "sizeX": 1, "sizeY": 2, "minSizeX": 1, "maxSizeX": 3, "minSizeY": 1, "maxSizeY": 3, "row": 0, "col": 4, content: generateTemplate('4') },
                    { "id": '5', "sizeX": 1, "sizeY": 2, "minSizeX": 1, "maxSizeX": 3, "minSizeY": 1, "maxSizeY": 3, "row": 0, "col": 7, content: generateTemplate('5') },
                    { "id": '6', "sizeX": 1, "sizeY": 1, "minSizeX": 1, "minSizeY": 1, "row": 1, "col": 8, content: generateTemplate('6') },
                    { "id": '7', "sizeX": 1, "sizeY": 1, "minSizeX": 1, "minSizeY": 1, "row": 0, "col": 8, content: generateTemplate('7') },
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            let CellElements: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>gridLayOut.element.querySelectorAll('.e-panel');
            setCss(CellElements);
            let resizingElement: HTMLElement = document.getElementById('0');
            resizingElement.classList.add('e-item-hover');
            let movingElemnt: HTMLElement = resizingElement.querySelector('.e-east');
            let targetElemnt: HTMLElement = document.getElementById('1');
            movingElemnt.style.display = "block";
            let mousedown: any = getTouchEventObject(movingElemnt, 'touchstart', 103, 58);
            EventHandler.trigger(<HTMLElement>movingElemnt, 'touchstart', mousedown);
            let mousemove: any = getTouchEventObject(movingElemnt, 'touchmove', 110, 59);
            EventHandler.trigger(<any>(document), 'touchmove', mousemove);
            mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
            mousemove = getTouchEventObject(movingElemnt, 'touchmove', 150, 60);
            EventHandler.trigger(<any>(document), 'touchmove', mousemove);
            mousemove = getTouchEventObject(movingElemnt, 'touchmove', 162, 58);
            EventHandler.trigger(<any>(document), 'touchmove', mousemove);
            EventHandler.trigger(<any>(document), 'touchmove', mousemove);
            let mouseup: any = getTouchEventObject(movingElemnt, 'touchend');
            mouseup.type = 'touchend';
            EventHandler.trigger(<any>(document), 'touchend', mouseup);
            expect((<any>gridLayOut).getCellInstance('0').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('0').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('1').row == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('1').col == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('2').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('2').col == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('3').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('3').col == 3).toBe(true);
            expect((<any>gridLayOut).getCellInstance('4').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('4').col == 4).toBe(true);
            expect(resizingElement.classList.contains("e-dragging")).toBe(false);
        });


        it('Resizing test case in east direction alone touch after refresh', () => {
            gridLayOut = new DashboardLayout({
                cellAspectRatio: 1,
                columns: 12,
                cellSpacing: [5, 5],
                resizableHandles: ['e-east'],
                allowResizing: true,
                panels: [
                    { "id": '0', "sizeX": 1, "sizeY": 1, "row": 0, "col": 0, content: generateTemplate('0') },
                    { "id": '1', "sizeX": 1, "sizeY": 1, "row": 0, "col": 1, content: generateTemplate('1') },
                    { "id": '2', "sizeX": 1, "sizeY": 1, "minSizeX": 1, "minSizeY": 1, "row": 0, "col": 2, content: generateTemplate('2') },
                    { "id": '3', "sizeX": 1, "sizeY": 1, "minSizeX": 1, "maxSizeX": 1, "minSizeY": 1, "maxSizeY": 1, "row": 0, "col": 3, content: generateTemplate('3') },
                    { "id": '4', "sizeX": 1, "sizeY": 2, "minSizeX": 1, "maxSizeX": 3, "minSizeY": 1, "maxSizeY": 3, "row": 0, "col": 4, content: generateTemplate('4') },
                    { "id": '5', "sizeX": 1, "sizeY": 2, "minSizeX": 1, "maxSizeX": 3, "minSizeY": 1, "maxSizeY": 3, "row": 0, "col": 7, content: generateTemplate('5') },
                    { "id": '6', "sizeX": 1, "sizeY": 1, "minSizeX": 1, "minSizeY": 1, "row": 1, "col": 8, content: generateTemplate('6') },
                    { "id": '7', "sizeX": 1, "sizeY": 1, "minSizeX": 1, "minSizeY": 1, "row": 0, "col": 8, content: generateTemplate('7') },
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            gridLayOut.refresh();
            let CellElements: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>gridLayOut.element.querySelectorAll('.e-panel');
            setCss(CellElements);
            let resizingElement: HTMLElement = document.getElementById('0');
            resizingElement.classList.add('e-item-hover');
            let movingElemnt: HTMLElement = resizingElement.querySelector('.e-east');
            let targetElemnt: HTMLElement = document.getElementById('1');
            movingElemnt.style.display = "block";
            let mousedown: any = getTouchEventObject(movingElemnt, 'touchstart', 103, 58);
            EventHandler.trigger(<HTMLElement>movingElemnt, 'touchstart', mousedown);
            let mousemove: any = getTouchEventObject(movingElemnt, 'touchmove', 110, 59);
            EventHandler.trigger(<any>(document), 'touchmove', mousemove);
            mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
            mousemove = getTouchEventObject(movingElemnt, 'touchmove', 150, 60);
            EventHandler.trigger(<any>(document), 'touchmove', mousemove);
            mousemove = getTouchEventObject(movingElemnt, 'touchmove', 162, 58);
            EventHandler.trigger(<any>(document), 'touchmove', mousemove);
            EventHandler.trigger(<any>(document), 'touchmove', mousemove);
            let mouseup: any = getTouchEventObject(movingElemnt, 'touchend');
            mouseup.type = 'touchend';
            EventHandler.trigger(<any>(document), 'touchend', mouseup);
            expect((<any>gridLayOut).getCellInstance('0').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('0').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('1').row == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('1').col == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('2').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('2').col == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('3').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('3').col == 3).toBe(true);
            expect((<any>gridLayOut).getCellInstance('4').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('4').col == 4).toBe(true);
            expect(resizingElement.classList.contains("e-dragging")).toBe(false);
        });

        it('intial mediaQuery true case', () => {
            gridLayOut = new DashboardLayout({
                cellAspectRatio: 1,
                columns: 12,
                cellSpacing: [5, 5],
                resizableHandles: ['e-east'],
                allowResizing: true,
                mediaQuery: "max-width: 1920px",
                panels: [
                    { "id": '0', "sizeX": 1, "sizeY": 1, "row": 0, "col": 0, content: generateTemplate('0') },
                    { "id": '1', "sizeX": 1, "sizeY": 1, "row": 0, "col": 1, content: generateTemplate('1') },
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            let CellElements: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>gridLayOut.element.querySelectorAll('.e-panel');
            setCss(CellElements);
            expect((<any>gridLayOut).getCellInstance('0').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('0').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('1').row == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('1').col == 0).toBe(true);
        });

        it('Resizing test case in southEast expand direction alone touch', () => {
            gridLayOut = new DashboardLayout({
                cellAspectRatio: 1,
                columns: 12,
                //     rows: 2,
                cellSpacing: [5, 5],
                allowResizing: true,
                panels: [
                    { "id": '0', "sizeX": 1, "sizeY": 1, "row": 0, "col": 0, content: generateTemplate('0') },
                    { "id": '1', "sizeX": 1, "sizeY": 1, "row": 0, "col": 1, content: generateTemplate('1') },
                    { "id": '2', "sizeX": 1, "sizeY": 1, "row": 0, "col": 2, content: generateTemplate('2') },
                    { "id": '3', "sizeX": 1, "sizeY": 1, "row": 0, "col": 3, content: generateTemplate('3') },
                    { "id": '4', "sizeX": 1, "sizeY": 1, "row": 0, "col": 4, content: generateTemplate('4') },
                    { "id": '5', "sizeX": 1, "sizeY": 1, "row": 1, "col": 4, content: generateTemplate('5') },
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            let CellElements: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>gridLayOut.element.querySelectorAll('.e-panel');
            setCss(CellElements);
            let resizingElement: HTMLElement = document.getElementById('0');
            resizingElement.classList.add('e-item-hover');
            let movingElemnt: HTMLElement = resizingElement.querySelector('.e-south-east');
            let targetElemnt: HTMLElement = document.getElementById('1');
            movingElemnt.style.display = "block";
            let mousedown: any = getTouchEventObject(movingElemnt, 'touchstart', 90, 95);
            EventHandler.trigger(<HTMLElement>movingElemnt, 'touchstart', mousedown);
            let mousemove: any = getTouchEventObject(movingElemnt, 'touchmove', 100, 100);
            EventHandler.trigger(<any>(document), 'touchmove', mousemove);
            mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
            mousemove = getTouchEventObject(movingElemnt, 'touchmove', 200, 130);
            EventHandler.trigger(<any>(document), 'touchmove', mousemove);
            mousemove = getTouchEventObject(movingElemnt, 'touchmove', 210, 160);
            EventHandler.trigger(<any>(document), 'touchmove', mousemove);
            EventHandler.trigger(<any>(document), 'touchmove', mousemove);
            let mouseup: any = getTouchEventObject(movingElemnt, 'touchend');
            mouseup.type = 'touchend';
            EventHandler.trigger(<any>(document), 'touchend', mouseup);
            expect((<any>gridLayOut).getCellInstance('0').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('0').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('1').row == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('1').col == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('2').row == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('2').col == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('3').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('3').col == 3).toBe(true);
            expect((<any>gridLayOut).getCellInstance('4').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('4').col == 4).toBe(true);
            expect((<any>gridLayOut).getCellInstance('5').row == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('5').col == 4).toBe(true);
            expect(resizingElement.classList.contains("e-dragging")).toBe(false);
        });

        it('Resizing test case in southEast expand direction alone touch after refresh', () => {
            gridLayOut = new DashboardLayout({
                cellAspectRatio: 1,
                columns: 12,
                //     rows: 2,
                cellSpacing: [5, 5],
                allowResizing: true,
                panels: [
                    { "id": '0', "sizeX": 1, "sizeY": 1, "row": 0, "col": 0, content: generateTemplate('0') },
                    { "id": '1', "sizeX": 1, "sizeY": 1, "row": 0, "col": 1, content: generateTemplate('1') },
                    { "id": '2', "sizeX": 1, "sizeY": 1, "row": 0, "col": 2, content: generateTemplate('2') },
                    { "id": '3', "sizeX": 1, "sizeY": 1, "row": 0, "col": 3, content: generateTemplate('3') },
                    { "id": '4', "sizeX": 1, "sizeY": 1, "row": 0, "col": 4, content: generateTemplate('4') },
                    { "id": '5', "sizeX": 1, "sizeY": 1, "row": 1, "col": 4, content: generateTemplate('5') },
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            gridLayOut.refresh();
            let CellElements: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>gridLayOut.element.querySelectorAll('.e-panel');
            setCss(CellElements);
            let resizingElement: HTMLElement = document.getElementById('0');
            resizingElement.classList.add('e-item-hover');
            let movingElemnt: HTMLElement = resizingElement.querySelector('.e-south-east');
            let targetElemnt: HTMLElement = document.getElementById('1');
            movingElemnt.style.display = "block";
            let mousedown: any = getTouchEventObject(movingElemnt, 'touchstart', 90, 95);
            EventHandler.trigger(<HTMLElement>movingElemnt, 'touchstart', mousedown);
            let mousemove: any = getTouchEventObject(movingElemnt, 'touchmove', 100, 100);
            EventHandler.trigger(<any>(document), 'touchmove', mousemove);
            mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
            mousemove = getTouchEventObject(movingElemnt, 'touchmove', 200, 130);
            EventHandler.trigger(<any>(document), 'touchmove', mousemove);
            mousemove = getTouchEventObject(movingElemnt, 'touchmove', 210, 160);
            EventHandler.trigger(<any>(document), 'touchmove', mousemove);
            EventHandler.trigger(<any>(document), 'touchmove', mousemove);
            let mouseup: any = getTouchEventObject(movingElemnt, 'touchend');
            mouseup.type = 'touchend';
            EventHandler.trigger(<any>(document), 'touchend', mouseup);
            expect((<any>gridLayOut).getCellInstance('0').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('0').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('1').row == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('1').col == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('2').row == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('2').col == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('3').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('3').col == 3).toBe(true);
            expect((<any>gridLayOut).getCellInstance('4').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('4').col == 4).toBe(true);
            expect((<any>gridLayOut).getCellInstance('5').row == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('5').col == 4).toBe(true);
            expect(resizingElement.classList.contains("e-dragging")).toBe(false);
        });

        it('Resizing test case in east direction alone exceeding max case', () => {
            gridLayOut = new DashboardLayout({
                cellAspectRatio: 1,
                columns: 12,
                cellSpacing: [5, 5],
                resizableHandles: ['e-east'],
                allowResizing: true,
                panels: [
                    { "id": '0', "sizeX": 1, "sizeY": 1, "row": 0, "col": 0, "maxSizeX": 1, "maxSizeY": 1, content: generateTemplate('0') },
                    { "id": '1', "sizeX": 1, "sizeY": 1, "row": 0, "col": 1, content: generateTemplate('1') },
                    { "id": '2', "sizeX": 1, "sizeY": 1, "minSizeX": 1, "minSizeY": 1, "row": 0, "col": 2, content: generateTemplate('2') },
                    { "id": '3', "sizeX": 1, "sizeY": 1, "minSizeX": 1, "maxSizeX": 1, "minSizeY": 1, "maxSizeY": 1, "row": 0, "col": 3, content: generateTemplate('3') },
                    { "id": '4', "sizeX": 1, "sizeY": 2, "minSizeX": 1, "maxSizeX": 3, "minSizeY": 1, "maxSizeY": 3, "row": 0, "col": 4, content: generateTemplate('4') },
                    { "id": '5', "sizeX": 1, "sizeY": 2, "minSizeX": 1, "maxSizeX": 3, "minSizeY": 1, "maxSizeY": 3, "row": 0, "col": 7, content: generateTemplate('5') },
                    { "id": '6', "sizeX": 1, "sizeY": 1, "minSizeX": 1, "minSizeY": 1, "row": 1, "col": 8, content: generateTemplate('6') },
                    { "id": '7', "sizeX": 1, "sizeY": 1, "minSizeX": 1, "minSizeY": 1, "row": 0, "col": 8, content: generateTemplate('7') },
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            let resizingElement: HTMLElement = document.getElementById('0');
            resizingElement.classList.add('e-item-hover');
            let movingElemnt: HTMLElement = resizingElement.querySelector('.e-east');
            let targetElemnt: HTMLElement = document.getElementById('1');
            let mouseOver: any = getEventObject('MouseEvents', 'mouseover', movingElemnt, targetElemnt, 30, 60);
            mouseOver = setMouseCordinates(mouseOver, 30, 60);
            EventHandler.trigger(<HTMLElement>movingElemnt, 'mouseover', mouseOver);
            // (<any>gridLayOut).addHoverClass(mouseOver);
            let mousedown: any = getEventObject('MouseEvents', 'mousedown', movingElemnt, targetElemnt, 103, 58);
            EventHandler.trigger(<HTMLElement>movingElemnt, 'mousedown', mousedown);
            let mousemove: any = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 110, 59);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
            mousemove = setMouseCordinates(mousemove, 150, 60);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = setMouseCordinates(mousemove, 162, 58);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            let mouseup: any = getEventObject('MouseEvents', 'mouseup', movingElemnt, targetElemnt);
            mouseup.type = 'mouseup';
            EventHandler.trigger(<any>(document), 'mouseup', mouseup);
            expect((<any>gridLayOut).getCellInstance('0').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('0').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('1').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('1').col == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('2').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('2').col == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('3').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('3').col == 3).toBe(true);
            expect((<any>gridLayOut).getCellInstance('4').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('4').col == 4).toBe(true);
            expect(resizingElement.classList.contains("e-dragging")).toBe(false);
        });


        it('Resizing test case in east direction alone exceeding max case touch', () => {
            gridLayOut = new DashboardLayout({
                cellAspectRatio: 1,
                columns: 12,
                cellSpacing: [5, 5],
                resizableHandles: ['e-east'],
                allowResizing: true,
                panels: [
                    { "id": '0', "sizeX": 1, "sizeY": 1, "row": 0, "col": 0, "maxSizeX": 1, "maxSizeY": 1, content: generateTemplate('0') },
                    { "id": '1', "sizeX": 1, "sizeY": 1, "row": 0, "col": 1, content: generateTemplate('1') },
                    { "id": '2', "sizeX": 1, "sizeY": 1, "minSizeX": 1, "minSizeY": 1, "row": 0, "col": 2, content: generateTemplate('2') },
                    { "id": '3', "sizeX": 1, "sizeY": 1, "minSizeX": 1, "maxSizeX": 1, "minSizeY": 1, "maxSizeY": 1, "row": 0, "col": 3, content: generateTemplate('3') },
                    { "id": '4', "sizeX": 1, "sizeY": 2, "minSizeX": 1, "maxSizeX": 3, "minSizeY": 1, "maxSizeY": 3, "row": 0, "col": 4, content: generateTemplate('4') },
                    { "id": '5', "sizeX": 1, "sizeY": 2, "minSizeX": 1, "maxSizeX": 3, "minSizeY": 1, "maxSizeY": 3, "row": 0, "col": 7, content: generateTemplate('5') },
                    { "id": '6', "sizeX": 1, "sizeY": 1, "minSizeX": 1, "minSizeY": 1, "row": 1, "col": 8, content: generateTemplate('6') },
                    { "id": '7', "sizeX": 1, "sizeY": 1, "minSizeX": 1, "minSizeY": 1, "row": 0, "col": 8, content: generateTemplate('7') },
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            let CellElements: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>gridLayOut.element.querySelectorAll('.e-panel');
            setCss(CellElements);
            let resizingElement: HTMLElement = document.getElementById('0');
            resizingElement.classList.add('e-item-hover');
            let movingElemnt: HTMLElement = resizingElement.querySelector('.e-east');
            let targetElemnt: HTMLElement = document.getElementById('1');
            movingElemnt.style.display = "block";
            let mousedown: any = getTouchEventObject(movingElemnt, 'touchstart', 103, 58);
            EventHandler.trigger(<HTMLElement>movingElemnt, 'touchstart', mousedown);
            let mousemove: any = getTouchEventObject(movingElemnt, 'touchmove', 110, 59);
            EventHandler.trigger(<any>(document), 'touchmove', mousemove);
            mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
            mousemove = getTouchEventObject(movingElemnt, 'touchmove', 150, 60);
            EventHandler.trigger(<any>(document), 'touchmove', mousemove);
            mousemove = getTouchEventObject(movingElemnt, 'touchmove', 162, 58);
            EventHandler.trigger(<any>(document), 'touchmove', mousemove);
            EventHandler.trigger(<any>(document), 'touchmove', mousemove);
            let mouseup: any = getTouchEventObject(movingElemnt, 'touchend');
            mouseup.type = 'touchend';
            EventHandler.trigger(<any>(document), 'touchend', mouseup);
            expect((<any>gridLayOut).getCellInstance('0').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('0').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('1').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('1').col == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('2').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('2').col == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('3').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('3').col == 3).toBe(true);
            expect((<any>gridLayOut).getCellInstance('4').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('4').col == 4).toBe(true);
            expect(resizingElement.classList.contains("e-dragging")).toBe(false);
        });

        it('Resizing test case in west direction alone touch', () => {
            gridLayOut = new DashboardLayout({
                cellAspectRatio: 1,
                resizableHandles: ['e-west'],
                columns: 12,
                cellSpacing: [5, 5],
                allowResizing: true,
                panels: [
                    { "id": '0', "sizeX": 1, "sizeY": 1, "row": 0, "col": 0, content: generateTemplate('0') },
                    { "id": '1', "sizeX": 1, "sizeY": 1, "row": 0, "col": 1, content: generateTemplate('1') },
                    { "id": '2', "sizeX": 1, "sizeY": 1, "row": 0, "col": 2, content: generateTemplate('2') },
                    { "id": '3', "sizeX": 1, "sizeY": 1, "row": 0, "col": 3, content: generateTemplate('3') },
                    { "sizeX": 1, "sizeY": 1, "row": 0, "col": 4, content: generateTemplate('4') },

                ]
            });
            gridLayOut.appendTo('#gridlayout');
            let CellElements: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>gridLayOut.element.querySelectorAll('.e-panel');
            setCss(CellElements);
            let resizingElement: HTMLElement = document.getElementById('1');
            resizingElement.classList.add('e-item-hover');
            let movingElemnt: HTMLElement = resizingElement.querySelector('.e-west');
            let targetElemnt: HTMLElement = document.getElementById('0');
            movingElemnt.style.display = "block";
            let mousedown: any = getTouchEventObject(movingElemnt, 'touchstart', 110, 58);
            EventHandler.trigger(<HTMLElement>movingElemnt, 'touchstart', mousedown);
            let mousemove: any = getTouchEventObject(movingElemnt, 'touchmove', 105, 59);
            EventHandler.trigger(<any>(document), 'touchmove', mousemove);
            mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
            mousemove = getTouchEventObject(movingElemnt, 'touchmove', 75, 60);
            EventHandler.trigger(<any>(document), 'touchmove', mousemove);
            mousemove = getTouchEventObject(movingElemnt, 'touchmove', 45, 58);
            EventHandler.trigger(<any>(document), 'touchmove', mousemove);
            EventHandler.trigger(<any>(document), 'touchmove', mousemove);
            let mouseup: any = getTouchEventObject(movingElemnt, 'touchend');
            mouseup.type = 'touchend';
            EventHandler.trigger(<any>(document), 'touchend', mouseup);
            expect((<any>gridLayOut).getCellInstance('0').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('1').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('1').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('1').sizeX == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('2').col == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('3').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('3').col == 3).toBe(true);
            expect((<any>gridLayOut).getCellInstance('layout_0').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('layout_0').col == 4).toBe(true);
            expect(resizingElement.classList.contains("e-dragging")).toBe(false);
            gridLayOut.allowResizing = false;
            gridLayOut.dataBind();
            expect((<any>gridLayOut).allowResizing).toBe(false);
        });

        it('Resizing test case in west direction alone touch after refresh', () => {
            gridLayOut = new DashboardLayout({
                cellAspectRatio: 1,
                resizableHandles: ['e-west'],
                columns: 12,
                cellSpacing: [5, 5],
                allowResizing: true,
                panels: [
                    { "id": '0', "sizeX": 1, "sizeY": 1, "row": 0, "col": 0, content: generateTemplate('0') },
                    { "id": '1', "sizeX": 1, "sizeY": 1, "row": 0, "col": 1, content: generateTemplate('1') },
                    { "id": '2', "sizeX": 1, "sizeY": 1, "row": 0, "col": 2, content: generateTemplate('2') },
                    { "id": '3', "sizeX": 1, "sizeY": 1, "row": 0, "col": 3, content: generateTemplate('3') },
                    { "sizeX": 1, "sizeY": 1, "row": 0, "col": 4, content: generateTemplate('4') },

                ]
            });
            gridLayOut.appendTo('#gridlayout');
            gridLayOut.refresh();
            let CellElements: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>gridLayOut.element.querySelectorAll('.e-panel');
            setCss(CellElements);
            let resizingElement: HTMLElement = document.getElementById('1');
            resizingElement.classList.add('e-item-hover');
            let movingElemnt: HTMLElement = resizingElement.querySelector('.e-west');
            let targetElemnt: HTMLElement = document.getElementById('0');
            movingElemnt.style.display = "block";
            let mousedown: any = getTouchEventObject(movingElemnt, 'touchstart', 110, 58);
            EventHandler.trigger(<HTMLElement>movingElemnt, 'touchstart', mousedown);
            let mousemove: any = getTouchEventObject(movingElemnt, 'touchmove', 105, 59);
            EventHandler.trigger(<any>(document), 'touchmove', mousemove);
            mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
            mousemove = getTouchEventObject(movingElemnt, 'touchmove', 75, 60);
            EventHandler.trigger(<any>(document), 'touchmove', mousemove);
            mousemove = getTouchEventObject(movingElemnt, 'touchmove', 45, 58);
            EventHandler.trigger(<any>(document), 'touchmove', mousemove);
            EventHandler.trigger(<any>(document), 'touchmove', mousemove);
            let mouseup: any = getTouchEventObject(movingElemnt, 'touchend');
            mouseup.type = 'touchend';
            EventHandler.trigger(<any>(document), 'touchend', mouseup);
            expect((<any>gridLayOut).getCellInstance('0').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('1').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('1').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('1').sizeX == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('2').col == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('3').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('3').col == 3).toBe(true);
            expect((<any>gridLayOut).getCellInstance('layout_0').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('layout_0').col == 4).toBe(true);
            expect(resizingElement.classList.contains("e-dragging")).toBe(false);
            gridLayOut.allowResizing = false;
            gridLayOut.dataBind();
            expect((<any>gridLayOut).allowResizing).toBe(false);
        });


        it('Resizing test case for false case by dynamically changing touch', () => {
            gridLayOut = new DashboardLayout({
                cellAspectRatio: 1,
                columns: 12,
                cellSpacing: [5, 5],
                allowResizing: true,
                resizableHandles: ['e-west'],
                //     rows: 2,
                panels: [
                    { "id": '0', "sizeX": 1, "sizeY": 1, "row": 0, "col": 0, content: generateTemplate('0') },
                    { "id": '1', "sizeX": 1, "sizeY": 1, "row": 0, "col": 1, content: generateTemplate('1') },
                    { "id": '2', "sizeX": 1, "sizeY": 1, "row": 0, "col": 2, content: generateTemplate('2') },
                    { "id": '3', "sizeX": 1, "sizeY": 1, "row": 0, "col": 3, content: generateTemplate('3') },
                    { "sizeX": 1, "sizeY": 1, "row": 0, "col": 4, content: generateTemplate('4') },

                ]
            });
            gridLayOut.appendTo('#gridlayout');
            let CellElements: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>gridLayOut.element.querySelectorAll('.e-panel');
            setCss(CellElements);
            let resizingElement: HTMLElement = document.getElementById('1');
            resizingElement.classList.add('e-item-hover');
            let movingElemnt: HTMLElement = resizingElement.querySelector('.e-west');
            let targetElemnt: HTMLElement = document.getElementById('0');
            movingElemnt.style.display = "block";
            let mousedown: any = getTouchEventObject(movingElemnt, 'touchstart', 114, 58);
            EventHandler.trigger(<HTMLElement>movingElemnt, 'touchstart', mousedown);
            let mousemove: any = getTouchEventObject(movingElemnt, 'touchmove', 105, 59);
            EventHandler.trigger(<any>(document), 'touchmove', mousemove);
            mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
            mousemove = getTouchEventObject(movingElemnt, 'touchmove', 75, 60);
            EventHandler.trigger(<any>(document), 'touchmove', mousemove);
            mousemove = getTouchEventObject(movingElemnt, 'touchmove', 45, 58);
            EventHandler.trigger(<any>(document), 'touchmove', mousemove);
            EventHandler.trigger(<any>(document), 'touchmove', mousemove);
            let mouseup: any = getTouchEventObject(movingElemnt, 'touchend');
            mouseup.type = 'touchend';
            EventHandler.trigger(<any>(document), 'touchend', mouseup);
            expect((<any>gridLayOut).getCellInstance('0').row == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('0').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('1').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('1').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('1').sizeX == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('2').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('2').col == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('3').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('3').col == 3).toBe(true);
            expect((<any>gridLayOut).getCellInstance('layout_0').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('layout_0').col == 4).toBe(true);
            expect(resizingElement.classList.contains("e-dragging")).toBe(false);
            gridLayOut.allowResizing = false;
            gridLayOut.dataBind();
            expect((<any>gridLayOut).allowResizing).toBe(false);
            gridLayOut.allowResizing = true;
            gridLayOut.dataBind();
            expect((<any>gridLayOut).allowResizing).toBe(true);
        });


        it('Resizing test case in west direction alone', () => {
            gridLayOut = new DashboardLayout({
                cellAspectRatio: 1,
                resizableHandles: ['e-west'],
                columns: 12,
                cellSpacing: [5, 5],
                allowResizing: true,
                panels: [
                    { "id": '0', "sizeX": 1, "sizeY": 1, "row": 0, "col": 0, content: generateTemplate('0') },
                    { "id": '1', "sizeX": 1, "sizeY": 1, "row": 0, "col": 1, content: generateTemplate('1') },
                    { "id": '2', "sizeX": 1, "sizeY": 1, "row": 0, "col": 2, content: generateTemplate('2') },
                    { "id": '3', "sizeX": 1, "sizeY": 1, "row": 0, "col": 3, content: generateTemplate('3') },
                    { "sizeX": 1, "sizeY": 1, "row": 0, "col": 4, content: generateTemplate('4') },

                ]
            });
            gridLayOut.appendTo('#gridlayout');
            let resizingElement: HTMLElement = document.getElementById('1');
            resizingElement.classList.add('e-item-hover');
            let movingElemnt: HTMLElement = resizingElement.querySelector('.e-west');
            let targetElemnt: HTMLElement = document.getElementById('0');
            let mousedown: any = getEventObject('MouseEvents', 'mousedown', movingElemnt, targetElemnt, 110, 58);
            EventHandler.trigger(<HTMLElement>movingElemnt, 'mousedown', mousedown);
            let mousemove: any = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 105, 59);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
            mousemove = setMouseCordinates(mousemove, 75, 60);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = setMouseCordinates(mousemove, 45, 58);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            let mouseup: any = getEventObject('MouseEvents', 'mouseup', movingElemnt, targetElemnt);
            mouseup.type = 'mouseup';
            EventHandler.trigger(<any>(document), 'mouseup', mouseup);
            // expect((<any>gridLayOut).getCellInstance('0').row == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('0').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('1').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('1').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('1').sizeX == 2).toBe(true);
            // expect((<any>gridLayOut).getCellInstance('2').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('2').col == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('3').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('3').col == 3).toBe(true);
            expect((<any>gridLayOut).getCellInstance('layout_0').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('layout_0').col == 4).toBe(true);
            expect(resizingElement.classList.contains("e-dragging")).toBe(false);
            gridLayOut.allowResizing = false;
            gridLayOut.dataBind();
            expect((<any>gridLayOut).allowResizing).toBe(false);
        });

        it('Resizing test case in west direction alone after refreshing', () => {
            gridLayOut = new DashboardLayout({
                cellAspectRatio: 1,
                resizableHandles: ['e-west'],
                columns: 12,
                cellSpacing: [5, 5],
                allowResizing: true,
                panels: [
                    { "id": '0', "sizeX": 1, "sizeY": 1, "row": 0, "col": 0, content: generateTemplate('0') },
                    { "id": '1', "sizeX": 1, "sizeY": 1, "row": 0, "col": 1, content: generateTemplate('1') },
                    { "id": '2', "sizeX": 1, "sizeY": 1, "row": 0, "col": 2, content: generateTemplate('2') },
                    { "id": '3', "sizeX": 1, "sizeY": 1, "row": 0, "col": 3, content: generateTemplate('3') },
                    { "sizeX": 1, "sizeY": 1, "row": 0, "col": 4, content: generateTemplate('4') },

                ]
            });
            gridLayOut.appendTo('#gridlayout');
            gridLayOut.refresh();
            let resizingElement: HTMLElement = document.getElementById('1');
            resizingElement.classList.add('e-item-hover');
            let movingElemnt: HTMLElement = resizingElement.querySelector('.e-west');
            let targetElemnt: HTMLElement = document.getElementById('0');
            let mousedown: any = getEventObject('MouseEvents', 'mousedown', movingElemnt, targetElemnt, 110, 58);
            EventHandler.trigger(<HTMLElement>movingElemnt, 'mousedown', mousedown);
            let mousemove: any = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 105, 59);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
            mousemove = setMouseCordinates(mousemove, 75, 60);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = setMouseCordinates(mousemove, 45, 58);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            let mouseup: any = getEventObject('MouseEvents', 'mouseup', movingElemnt, targetElemnt);
            mouseup.type = 'mouseup';
            EventHandler.trigger(<any>(document), 'mouseup', mouseup);
            // expect((<any>gridLayOut).getCellInstance('0').row == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('0').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('1').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('1').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('1').sizeX == 2).toBe(true);
            // expect((<any>gridLayOut).getCellInstance('2').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('2').col == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('3').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('3').col == 3).toBe(true);
            expect((<any>gridLayOut).getCellInstance('layout_0').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('layout_0').col == 4).toBe(true);
            expect(resizingElement.classList.contains("e-dragging")).toBe(false);
            gridLayOut.allowResizing = false;
            gridLayOut.dataBind();
            expect((<any>gridLayOut).allowResizing).toBe(false);
        });

        it('Resizing test case for false case by dynamically changing', () => {
            gridLayOut = new DashboardLayout({
                cellAspectRatio: 1,
                columns: 12,
                cellSpacing: [5, 5],
                allowResizing: true,
                resizableHandles: ['e-west'],
                //     rows: 2,
                panels: [
                    { "id": '0', "sizeX": 1, "sizeY": 1, "row": 0, "col": 0, content: generateTemplate('0') },
                    { "id": '1', "sizeX": 1, "sizeY": 1, "row": 0, "col": 1, content: generateTemplate('1') },
                    { "id": '2', "sizeX": 1, "sizeY": 1, "row": 0, "col": 2, content: generateTemplate('2') },
                    { "id": '3', "sizeX": 1, "sizeY": 1, "row": 0, "col": 3, content: generateTemplate('3') },
                    { "sizeX": 1, "sizeY": 1, "row": 0, "col": 4, content: generateTemplate('4') },

                ]
            });
            gridLayOut.appendTo('#gridlayout');
            let resizingElement: HTMLElement = document.getElementById('1');
            resizingElement.classList.add('e-item-hover');
            let movingElemnt: HTMLElement = resizingElement.querySelector('.e-west');
            let targetElemnt: HTMLElement = document.getElementById('0');
            let mousedown: any = getEventObject('MouseEvents', 'mousedown', movingElemnt, targetElemnt, 114, 58);
            EventHandler.trigger(<HTMLElement>movingElemnt, 'mousedown', mousedown);
            let mousemove: any = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 105, 59);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
            mousemove = setMouseCordinates(mousemove, 75, 60);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = setMouseCordinates(mousemove, 45, 58);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            let mouseup: any = getEventObject('MouseEvents', 'mouseup', movingElemnt, targetElemnt);
            mouseup.type = 'mouseup';
            EventHandler.trigger(<any>(document), 'mouseup', mouseup);
            expect((<any>gridLayOut).getCellInstance('0').row == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('0').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('1').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('1').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('1').sizeX == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('2').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('2').col == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('3').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('3').col == 3).toBe(true);
            expect((<any>gridLayOut).getCellInstance('layout_0').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('layout_0').col == 4).toBe(true);
            expect(resizingElement.classList.contains("e-dragging")).toBe(false);
            gridLayOut.allowResizing = false;
            gridLayOut.dataBind();
            expect((<any>gridLayOut).allowResizing).toBe(false);
            gridLayOut.allowResizing = true;
            gridLayOut.dataBind();
            expect((<any>gridLayOut).allowResizing).toBe(true);
        });

        it('Resizing test case in south direction alone', () => {
            gridLayOut = new DashboardLayout({
                cellAspectRatio: 1,
                columns: 12,
                cellSpacing: [5, 5],
                resizableHandles: ['e-south'],
                allowResizing: true,
                panels: [
                    { "id": '0', "sizeX": 1, "sizeY": 1, "row": 0, "col": 0, content: generateTemplate('0') },
                    { "id": '1', "sizeX": 1, "sizeY": 1, "row": 0, "col": 1, content: generateTemplate('1') },
                    { "id": '2', "sizeX": 1, "sizeY": 1, "row": 0, "col": 2, content: generateTemplate('2') },
                    { "id": '3', "sizeX": 1, "sizeY": 1, "row": 0, "col": 3, content: generateTemplate('3') },
                    { "id": '4', "sizeX": 1, "sizeY": 1, "row": 0, "col": 4, content: generateTemplate('4') },
                    { "id": '5', "sizeX": 1, "sizeY": 1, "row": 1, "col": 0, content: generateTemplate('5') },
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            let resizingElement: HTMLElement = document.getElementById('1');
            resizingElement.classList.add('e-item-hover');
            let movingElemnt: HTMLElement = resizingElement.querySelector('.e-south');
            let targetElemnt: HTMLElement = document.getElementById('0');
            let mousedown: any = getEventObject('MouseEvents', 'mousedown', movingElemnt, targetElemnt, 163, 103);
            EventHandler.trigger(<HTMLElement>movingElemnt, 'mousedown', mousedown);
            let mousemove: any = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 162, 105);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
            mousemove = setMouseCordinates(mousemove, 161, 110);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = setMouseCordinates(mousemove, 163, 160);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            let mouseup: any = getEventObject('MouseEvents', 'mouseup', movingElemnt, targetElemnt);
            mouseup.type = 'mouseup';
            EventHandler.trigger(<any>(document), 'mouseup', mouseup);
            expect((<any>gridLayOut).getCellInstance('0').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('0').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('1').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('1').col == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('1').sizeY == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('2').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('2').col == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('3').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('3').col == 3).toBe(true);
            expect((<any>gridLayOut).getCellInstance('4').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('4').col == 4).toBe(true);
            expect(resizingElement.classList.contains("e-dragging")).toBe(false);
        });

        it('Resizing test case in south direction alone after refreshing', () => {
            gridLayOut = new DashboardLayout({
                cellAspectRatio: 1,
                columns: 12,
                cellSpacing: [5, 5],
                resizableHandles: ['e-south'],
                allowResizing: true,
                panels: [
                    { "id": '0', "sizeX": 1, "sizeY": 1, "row": 0, "col": 0, content: generateTemplate('0') },
                    { "id": '1', "sizeX": 1, "sizeY": 1, "row": 0, "col": 1, content: generateTemplate('1') },
                    { "id": '2', "sizeX": 1, "sizeY": 1, "row": 0, "col": 2, content: generateTemplate('2') },
                    { "id": '3', "sizeX": 1, "sizeY": 1, "row": 0, "col": 3, content: generateTemplate('3') },
                    { "id": '4', "sizeX": 1, "sizeY": 1, "row": 0, "col": 4, content: generateTemplate('4') },
                    { "id": '5', "sizeX": 1, "sizeY": 1, "row": 1, "col": 0, content: generateTemplate('5') },
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            gridLayOut.refresh();
            let resizingElement: HTMLElement = document.getElementById('1');
            resizingElement.classList.add('e-item-hover');
            let movingElemnt: HTMLElement = resizingElement.querySelector('.e-south');
            let targetElemnt: HTMLElement = document.getElementById('0');
            let mousedown: any = getEventObject('MouseEvents', 'mousedown', movingElemnt, targetElemnt, 163, 103);
            EventHandler.trigger(<HTMLElement>movingElemnt, 'mousedown', mousedown);
            let mousemove: any = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 162, 105);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
            mousemove = setMouseCordinates(mousemove, 161, 110);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = setMouseCordinates(mousemove, 163, 160);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            let mouseup: any = getEventObject('MouseEvents', 'mouseup', movingElemnt, targetElemnt);
            mouseup.type = 'mouseup';
            EventHandler.trigger(<any>(document), 'mouseup', mouseup);
            expect((<any>gridLayOut).getCellInstance('0').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('0').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('1').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('1').col == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('1').sizeY == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('2').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('2').col == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('3').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('3').col == 3).toBe(true);
            expect((<any>gridLayOut).getCellInstance('4').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('4').col == 4).toBe(true);
            expect(resizingElement.classList.contains("e-dragging")).toBe(false);
        });

        it('Resizing events test case', () => {
            gridLayOut = new DashboardLayout({
                cellAspectRatio: 1,
                columns: 12,
                cellSpacing: [5, 5],
                resizableHandles: ['e-south'],
                allowResizing: true,
                panels: [
                    { "id": '0', "sizeX": 1, "sizeY": 1, "row": 0, "col": 0, content: generateTemplate('0') },
                    { "id": '1', "sizeX": 1, "sizeY": 1, "row": 0, "col": 1, content: generateTemplate('1') },
                    { "id": '2', "sizeX": 1, "sizeY": 1, "row": 0, "col": 2, content: generateTemplate('2') },
                    { "id": '3', "sizeX": 1, "sizeY": 1, "row": 0, "col": 3, content: generateTemplate('3') },
                    { "id": '4', "sizeX": 1, "sizeY": 1, "row": 0, "col": 4, content: generateTemplate('4') },
                    { "id": '5', "sizeX": 1, "sizeY": 1, "row": 1, "col": 0, content: generateTemplate('5') },
                ],
                resizeStart: function (args: ResizeArgs) {
                    expect((<any>args).name == 'resizeStart').toBe(true);
                    expect(args.isInteracted).toBe(true);
                    expect((<any>args).event.type == 'mousedown').toBe(true);
                    expect((<any>args).element == resizingElement).toBe(true);
                },
                resizeStop: function (args: ResizeArgs) {
                    expect((<any>args).name == 'resizeStop').toBe(true);
                    expect((<any>args).event.type == 'mouseup').toBe(true);
                    expect((<any>args).element == resizingElement).toBe(true);
                    expect(args.isInteracted).toBe(true);
                },
                resize: function (args: ResizeArgs) {
                    expect((<any>args).name == 'resize').toBe(true);
                    expect((<any>args).event.type == 'mousemove').toBe(true);
                    expect((<any>args).element == resizingElement).toBe(true);
                    expect(args.isInteracted).toBe(true);
                }
            });
            gridLayOut.appendTo('#gridlayout');
            let resizingElement: HTMLElement = document.getElementById('1');
            resizingElement.classList.add('e-item-hover');
            let movingElemnt: HTMLElement = resizingElement.querySelector('.e-south');
            let targetElemnt: HTMLElement = document.getElementById('0');
            let mousedown: any = getEventObject('MouseEvents', 'mousedown', movingElemnt, targetElemnt, 163, 103);
            EventHandler.trigger(<HTMLElement>movingElemnt, 'mousedown', mousedown);
            let mousemove: any = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 162, 105);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
            mousemove = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 161, 110);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 163, 160);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            let mouseup: any = getEventObject('MouseEvents', 'mouseup', movingElemnt, targetElemnt);
            mouseup.type = 'mouseup';
            EventHandler.trigger(<any>(document), 'mouseup', mouseup);
            expect((<any>gridLayOut).getCellInstance('0').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('0').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('1').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('1').col == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('1').sizeY == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('2').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('2').col == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('3').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('3').col == 3).toBe(true);
            expect((<any>gridLayOut).getCellInstance('4').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('4').col == 4).toBe(true);
            expect(resizingElement.classList.contains("e-dragging")).toBe(false);
        });

        it('Resizing test case in south direction alone touch', () => {
            gridLayOut = new DashboardLayout({
                cellAspectRatio: 1,
                columns: 12,
                cellSpacing: [5, 5],
                resizableHandles: ['e-south'],
                allowResizing: true,
                panels: [
                    { "id": '0', "sizeX": 1, "sizeY": 1, "row": 0, "col": 0, content: generateTemplate('0') },
                    { "id": '1', "sizeX": 1, "sizeY": 1, "row": 0, "col": 1, content: generateTemplate('1') },
                    { "id": '2', "sizeX": 1, "sizeY": 1, "row": 0, "col": 2, content: generateTemplate('2') },
                    { "id": '3', "sizeX": 1, "sizeY": 1, "row": 0, "col": 3, content: generateTemplate('3') },
                    { "id": '4', "sizeX": 1, "sizeY": 1, "row": 0, "col": 4, content: generateTemplate('4') },
                    { "id": '5', "sizeX": 1, "sizeY": 1, "row": 1, "col": 0, content: generateTemplate('5') },
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            let resizingElement: HTMLElement = document.getElementById('1');
            resizingElement.classList.add('e-item-hover');
            let movingElemnt: HTMLElement = resizingElement.querySelector('.e-south');
            let targetElemnt: HTMLElement = document.getElementById('0');
            movingElemnt.style.display = "block";
            let mousedown: any = getTouchEventObject(movingElemnt, 'touchstart', 163, 103);
            EventHandler.trigger(<HTMLElement>movingElemnt, 'touchstart', mousedown);
            let mousemove: any = getTouchEventObject(movingElemnt, 'touchmove', 162, 105);
            EventHandler.trigger(<any>(document), 'touchmove', mousemove);
            mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
            mousemove = getTouchEventObject(movingElemnt, 'touchmove', 161, 110);
            EventHandler.trigger(<any>(document), 'touchmove', mousemove);
            mousemove = getTouchEventObject(movingElemnt, 'touchmove', 163, 160);
            EventHandler.trigger(<any>(document), 'touchmove', mousemove);
            EventHandler.trigger(<any>(document), 'touchmove', mousemove);
            let mouseup: any = getTouchEventObject(movingElemnt, 'touchend');
            mouseup.type = 'touchend';
            EventHandler.trigger(<any>(document), 'touchend', mouseup);
            expect((<any>gridLayOut).getCellInstance('0').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('0').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('1').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('1').col == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('1').sizeY == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('2').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('2').col == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('3').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('3').col == 3).toBe(true);
            expect((<any>gridLayOut).getCellInstance('4').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('4').col == 4).toBe(true);
            expect(resizingElement.classList.contains("e-dragging")).toBe(false);
        });

        it('Resizing test case in north direction alone exceeding max range', () => {
            gridLayOut = new DashboardLayout({
                cellAspectRatio: 1,
                columns: 12,
                //     rows: 2,
                cellSpacing: [5, 5],
                resizableHandles: ['e-north'],
                allowResizing: true,
                panels: [
                    { "id": '0', "sizeX": 1, "sizeY": 1, "row": 0, "col": 0, content: generateTemplate('0') },
                    { "id": '1', "sizeX": 1, "sizeY": 1, "row": 0, "col": 1, content: generateTemplate('1') },
                    { "id": '2', "sizeX": 1, "sizeY": 1, "row": 0, "col": 2, content: generateTemplate('2') },
                    { "id": '3', "sizeX": 1, "sizeY": 1, "row": 0, "col": 3, content: generateTemplate('3') },
                    { "id": '4', "sizeX": 1, "sizeY": 1, "row": 0, "col": 4, content: generateTemplate('4') },
                    { "id": '5', "sizeX": 1, "sizeY": 1, "maxSizeY": 2, "row": 1, "col": 0, content: generateTemplate('5') },
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            let resizingElement: HTMLElement = document.getElementById('5');
            resizingElement.classList.add('e-item-hover');
            let movingElemnt: HTMLElement = resizingElement.querySelector('.e-north');
            let targetElemnt: HTMLElement = document.getElementById('0');
            let mousedown: any = getEventObject('MouseEvents', 'mousedown', movingElemnt, targetElemnt, 76, 99);
            EventHandler.trigger(<HTMLElement>movingElemnt, 'mousedown', mousedown);
            let mousemove: any = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 60, 90);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
            mousemove = setMouseCordinates(mousemove, 40, 88);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = setMouseCordinates(mousemove, 40, 50);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = setMouseCordinates(mousemove, 0, 0);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            let mouseup: any = getEventObject('MouseEvents', 'mouseup', movingElemnt, targetElemnt);
            mouseup.type = 'mouseup';
            EventHandler.trigger(<any>(document), 'mouseup', mouseup);
            expect((<any>gridLayOut).getCellInstance('0').row == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('0').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('1').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('1').col == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('2').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('2').col == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('3').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('3').col == 3).toBe(true);
            expect((<any>gridLayOut).getCellInstance('4').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('4').col == 4).toBe(true);
            expect((<any>gridLayOut).getCellInstance('5').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('5').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('5').sizeY == 2).toBe(true);
            expect(resizingElement.classList.contains("e-dragging")).toBe(false);
        });

        it('Resizing test case in north direction alone', () => {
            gridLayOut = new DashboardLayout({
                cellAspectRatio: 1,
                columns: 12,
                cellSpacing: [5, 5],
                resizableHandles: ['e-north'],
                allowResizing: true,
                panels: [
                    { "id": '0', "sizeX": 1, "sizeY": 1, "row": 0, "col": 0, content: generateTemplate('0') },
                    { "id": '1', "sizeX": 1, "sizeY": 1, "row": 0, "col": 1, content: generateTemplate('1') },
                    { "id": '2', "sizeX": 1, "sizeY": 1, "row": 0, "col": 2, content: generateTemplate('2') },
                    { "id": '3', "sizeX": 1, "sizeY": 1, "row": 0, "col": 3, content: generateTemplate('3') },
                    { "id": '4', "sizeX": 1, "sizeY": 1, "row": 0, "col": 4, content: generateTemplate('4') },
                    { "id": '5', "sizeX": 1, "sizeY": 1, "row": 1, "col": 0, content: generateTemplate('5') },
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            let resizingElement: HTMLElement = document.getElementById('5');
            resizingElement.classList.add('e-item-hover');
            let movingElemnt: HTMLElement = resizingElement.querySelector('.e-north');
            let targetElemnt: HTMLElement = document.getElementById('0');
            movingElemnt.style.display = "block";
            let mousedown: any = getEventObject('MouseEvents', 'mousedown', movingElemnt, targetElemnt, 40, 136);
            EventHandler.trigger(<HTMLElement>movingElemnt, 'mousedown', mousedown);
            let mousemove: any = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 41, 80);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
            mousemove = setMouseCordinates(mousemove, 42, 40);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = setMouseCordinates(mousemove, 40, 20);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            let mouseup: any = getEventObject('MouseEvents', 'mouseup', movingElemnt, targetElemnt);
            mouseup.type = 'mouseup';
            EventHandler.trigger(<any>(document), 'mouseup', mouseup);
            expect((<any>gridLayOut).getCellInstance('0').row == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('0').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('1').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('1').col == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('2').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('2').col == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('3').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('3').col == 3).toBe(true);
            expect((<any>gridLayOut).getCellInstance('4').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('4').col == 4).toBe(true);
            expect((<any>gridLayOut).getCellInstance('5').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('5').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('5').sizeY == 2).toBe(true);
            expect(resizingElement.classList.contains("e-dragging")).toBe(false);
        });

        it('Resizing test case in north direction alone touch', () => {
            gridLayOut = new DashboardLayout({
                cellAspectRatio: 1,
                columns: 12,
                cellSpacing: [5, 5],
                resizableHandles: ['e-north'],
                allowResizing: true,
                panels: [
                    { "id": '0', "sizeX": 1, "sizeY": 1, "row": 0, "col": 0, content: generateTemplate('0') },
                    { "id": '1', "sizeX": 1, "sizeY": 1, "row": 0, "col": 1, content: generateTemplate('1') },
                    { "id": '2', "sizeX": 1, "sizeY": 1, "row": 0, "col": 2, content: generateTemplate('2') },
                    { "id": '3', "sizeX": 1, "sizeY": 1, "row": 0, "col": 3, content: generateTemplate('3') },
                    { "id": '4', "sizeX": 1, "sizeY": 1, "row": 0, "col": 4, content: generateTemplate('4') },
                    { "id": '5', "sizeX": 1, "sizeY": 1, "row": 1, "col": 0, content: generateTemplate('5') },
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            let resizingElement: HTMLElement = document.getElementById('5');
            resizingElement.classList.add('e-item-hover');
            let movingElemnt: HTMLElement = resizingElement.querySelector('.e-north');
            let targetElemnt: HTMLElement = document.getElementById('0');
            movingElemnt.style.display = "block";
            let mousedown: any = getTouchEventObject(movingElemnt, 'touchstart', 40, 136);
            EventHandler.trigger(<HTMLElement>movingElemnt, 'touchstart', mousedown);
            let mousemove: any = getTouchEventObject(movingElemnt, 'touchmove', 41, 80);
            EventHandler.trigger(<any>(document), 'touchmove', mousemove);
            mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
            mousemove = getTouchEventObject(movingElemnt, 'touchmove', 42, 40);
            EventHandler.trigger(<any>(document), 'touchmove', mousemove);
            mousemove = getTouchEventObject(movingElemnt, 'touchmove', 40, 20);
            EventHandler.trigger(<any>(document), 'touchmove', mousemove);
            EventHandler.trigger(<any>(document), 'touchmove', mousemove);
            let mouseup: any = getTouchEventObject(movingElemnt, 'touchend');
            mouseup.type = 'touchend';
            EventHandler.trigger(<any>(document), 'touchend', mouseup);
            expect((<any>gridLayOut).getCellInstance('0').row == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('0').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('1').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('1').col == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('2').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('2').col == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('3').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('3').col == 3).toBe(true);
            expect((<any>gridLayOut).getCellInstance('4').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('4').col == 4).toBe(true);
            expect((<any>gridLayOut).getCellInstance('5').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('5').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('5').sizeY == 2).toBe(true);
            expect(resizingElement.classList.contains("e-dragging")).toBe(false);
        });

        // it('Resizing test case in northEast expand direction alone', () => {
        //     gridLayOut = new DashboardLayout({
        //        cellAspectRatio: 1,
        //         columns: 12,
        //         cellSpacing: [5, 5],
        //         //     rows: 2,
        //         allowResizing: true,
        //         panels: [
        //             { "id": '0', "sizeX": 1, "sizeY": 1, "row": 0, "col": 0, content: generateTemplate('0') },
        //             { "id": '1', "sizeX": 1, "sizeY": 1, "row": 0, "col": 1, content: generateTemplate('1') },
        //             { "id": '2', "sizeX": 1, "sizeY": 1, "row": 0, "col": 2, content: generateTemplate('2') },
        //             { "id": '3', "sizeX": 1, "sizeY": 1, "row": 0, "col": 3, content: generateTemplate('3') },
        //             { "id": '4', "sizeX": 1, "sizeY": 1, "row": 0, "col": 4, content: generateTemplate('4') },
        //             { "id": '5', "sizeX": 1, "sizeY": 1, "row": 1, "col": 0, content: generateTemplate('5') },
        //         ]
        //     });
        //     gridLayOut.appendTo('#gridlayout');
        //     let resizingElement: HTMLElement = document.getElementById('5');
        //     resizingElement.classList.add('e-item-hover');
        //     let movingElemnt: HTMLElement = resizingElement.querySelector('.e-north-east-expand');
        //     let targetElemnt: HTMLElement = document.getElementById('0');
        //     let mousedown: any = getEventObject('MouseEvents', 'mousedown', movingElemnt, targetElemnt, 96, 109);
        //     EventHandler.trigger(<HTMLElement>movingElemnt, 'mousedown', mousedown);
        //     let mousemove: any = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 110, 100);
        //     EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        //     mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
        //     mousemove = setMouseCordinates(mousemove, 120, 20);
        //     EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        //     mousemove = setMouseCordinates(mousemove, 120, 20);
        //     EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        //     EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        //     let mouseup: any = getEventObject('MouseEvents', 'mouseup', movingElemnt, targetElemnt);
        //     mouseup.type = 'mouseup';
        //     EventHandler.trigger(<any>(document), 'mouseup', mouseup);
        //     expect((<any>gridLayOut).getCellInstance('0').row == 2).toBe(true);
        //     expect((<any>gridLayOut).getCellInstance('0').col == 0).toBe(true);
        //     expect((<any>gridLayOut).getCellInstance('1').row == 2).toBe(true);
        //     expect((<any>gridLayOut).getCellInstance('1').col == 1).toBe(true);
        //     expect((<any>gridLayOut).getCellInstance('2').row == 0).toBe(true);
        //     expect((<any>gridLayOut).getCellInstance('2').col == 2).toBe(true);
        //     expect((<any>gridLayOut).getCellInstance('3').row == 0).toBe(true);
        //     expect((<any>gridLayOut).getCellInstance('3').col == 3).toBe(true);
        //     expect((<any>gridLayOut).getCellInstance('4').row == 0).toBe(true);
        //     expect((<any>gridLayOut).getCellInstance('4').col == 4).toBe(true);
        //     expect((<any>gridLayOut).getCellInstance('5').row == 0).toBe(true);
        //     expect((<any>gridLayOut).getCellInstance('5').col == 0).toBe(true);
        //     expect((<any>gridLayOut).getCellInstance('5').sizeY == 2).toBe(true);
        //     expect((<any>gridLayOut).getCellInstance('5').sizeX == 2).toBe(true);
        // });

        // it('Resizing test case in northWest expand direction alone', () => {
        //     gridLayOut = new DashboardLayout({
        //        cellAspectRatio: 1,
        //         columns: 12,
        //         cellSpacing: [5, 5],
        //         //     rows: 2,
        //         allowResizing: true,
        //         panels: [
        //             { "id": '0', "sizeX": 1, "sizeY": 1, "row": 0, "col": 0, content: generateTemplate('0') },
        //             { "id": '1', "sizeX": 1, "sizeY": 1, "row": 0, "col": 1, content: generateTemplate('1') },
        //             { "id": '2', "sizeX": 1, "sizeY": 1, "row": 0, "col": 2, content: generateTemplate('2') },
        //             { "id": '3', "sizeX": 1, "sizeY": 1, "row": 0, "col": 3, content: generateTemplate('3') },
        //             { "id": '4', "sizeX": 1, "sizeY": 1, "row": 0, "col": 4, content: generateTemplate('4') },
        //             { "id": '5', "sizeX": 1, "sizeY": 1, "row": 1, "col": 1, content: generateTemplate('5') },
        //         ]
        //     });
        //     gridLayOut.appendTo('#gridlayout');
        //     let resizingElement: HTMLElement = document.getElementById('5');
        //     resizingElement.classList.add('e-item-hover');
        //     let movingElemnt: HTMLElement = resizingElement.querySelector('.e-north-west-expand');
        //     let targetElemnt: HTMLElement = document.getElementById('0');
        //     let mousedown: any = getEventObject('MouseEvents', 'mousedown', movingElemnt, targetElemnt, 109, 109);
        //     EventHandler.trigger(<HTMLElement>movingElemnt, 'mousedown', mousedown);
        //     let mousemove: any = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 100, 100);
        //     EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        //     mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
        //     mousemove = setMouseCordinates(mousemove, 85, 90);
        //     EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        //     mousemove = setMouseCordinates(mousemove, 60, 70);
        //     EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        //     EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        //     let mouseup: any = getEventObject('MouseEvents', 'mouseup', movingElemnt, targetElemnt);
        //     mouseup.type = 'mouseup';
        //     EventHandler.trigger(<any>(document), 'mouseup', mouseup);
        //     expect((<any>gridLayOut).getCellInstance('0').row == 2).toBe(true);
        //     expect((<any>gridLayOut).getCellInstance('0').col == 0).toBe(true);
        //     expect((<any>gridLayOut).getCellInstance('1').row == 2).toBe(true);
        //     expect((<any>gridLayOut).getCellInstance('1').col == 1).toBe(true);
        //     expect((<any>gridLayOut).getCellInstance('2').row == 0).toBe(true);
        //     expect((<any>gridLayOut).getCellInstance('2').col == 2).toBe(true);
        //     expect((<any>gridLayOut).getCellInstance('3').row == 0).toBe(true);
        //     expect((<any>gridLayOut).getCellInstance('3').col == 3).toBe(true);
        //     expect((<any>gridLayOut).getCellInstance('4').row == 0).toBe(true);
        //     expect((<any>gridLayOut).getCellInstance('4').col == 4).toBe(true);
        //     expect((<any>gridLayOut).getCellInstance('5').row == 0).toBe(true);
        //     expect((<any>gridLayOut).getCellInstance('5').col == 0).toBe(true);
        //     expect((<any>gridLayOut).getCellInstance('5').sizeY == 2).toBe(true);
        //     expect((<any>gridLayOut).getCellInstance('5').sizeX == 2).toBe(true);
        // });

        it('Resizing test case in southWest expand direction alone', () => {
            gridLayOut = new DashboardLayout({
                cellAspectRatio: 1,
                columns: 12,
                cellSpacing: [5, 5],
                resizableHandles: ['e-south-west'],
                //     rows: 2,
                allowResizing: true,
                panels: [
                    { "id": '0', "sizeX": 1, "sizeY": 1, "row": 0, "col": 0, content: generateTemplate('0') },
                    { "id": '1', "sizeX": 1, "sizeY": 1, "row": 0, "col": 1, content: generateTemplate('1') },
                    { "id": '2', "sizeX": 1, "sizeY": 1, "row": 0, "col": 2, content: generateTemplate('2') },
                    { "id": '3', "sizeX": 1, "sizeY": 1, "row": 0, "col": 3, content: generateTemplate('3') },
                    { "id": '4', "sizeX": 1, "sizeY": 1, "row": 0, "col": 4, content: generateTemplate('4') },
                    { "id": '5', "sizeX": 1, "sizeY": 1, "row": 1, "col": 4, content: generateTemplate('5') },
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            let resizingElement: HTMLElement = document.getElementById('2');
            resizingElement.classList.add('e-item-hover');
            let movingElemnt: HTMLElement = resizingElement.querySelector('.e-south-west');
            let targetElemnt: HTMLElement = document.getElementById('1');
            let mousedown: any = getEventObject('MouseEvents', 'mousedown', movingElemnt, targetElemnt, 214, 96);
            EventHandler.trigger(<HTMLElement>movingElemnt, 'mousedown', mousedown);
            let mousemove: any = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 210, 100);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
            mousemove = setMouseCordinates(mousemove, 170, 130);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = setMouseCordinates(mousemove, 60, 160);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            let mouseup: any = getEventObject('MouseEvents', 'mouseup', movingElemnt, targetElemnt);
            mouseup.type = 'mouseup';
            EventHandler.trigger(<any>(document), 'mouseup', mouseup);
            expect((<any>gridLayOut).getCellInstance('0').row == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('0').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('1').row == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('1').col == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('2').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('2').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('3').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('3').col == 3).toBe(true);
            expect((<any>gridLayOut).getCellInstance('4').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('4').col == 4).toBe(true);
            expect((<any>gridLayOut).getCellInstance('5').row == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('5').col == 4).toBe(true);
            expect(resizingElement.classList.contains("e-dragging")).toBe(false);
        });

        it('Resizing test case in southWest expand direction exceeding max', () => {
            gridLayOut = new DashboardLayout({
                cellAspectRatio: 1,
                columns: 12,
                cellSpacing: [5, 5],
                resizableHandles: ['e-south-west'],
                //     rows: 2,
                allowResizing: true,
                panels: [
                    { "id": '0', "sizeX": 1, "sizeY": 1, "row": 0, "col": 0, content: generateTemplate('0') },
                    { "id": '1', "sizeX": 1, "sizeY": 1, "row": 0, "col": 1, content: generateTemplate('1') },
                    { "id": '2', "sizeX": 1, "sizeY": 1, "row": 0, "col": 2, "maxSizeX": 2, "maxSizeY": 2, content: generateTemplate('2') },
                    { "id": '3', "sizeX": 1, "sizeY": 1, "row": 0, "col": 3, content: generateTemplate('3') },
                    { "id": '4', "sizeX": 1, "sizeY": 1, "row": 0, "col": 4, content: generateTemplate('4') },
                    { "id": '5', "sizeX": 1, "sizeY": 1, "row": 1, "col": 4, content: generateTemplate('5') },
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            let resizingElement: HTMLElement = document.getElementById('2');
            resizingElement.classList.add('e-item-hover');
            let movingElemnt: HTMLElement = resizingElement.querySelector('.e-south-west');
            let targetElemnt: HTMLElement = document.getElementById('1');
            let mousedown: any = getEventObject('MouseEvents', 'mousedown', movingElemnt, targetElemnt, 214, 96);
            EventHandler.trigger(<HTMLElement>movingElemnt, 'mousedown', mousedown);
            let mousemove: any = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 210, 100);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
            mousemove = setMouseCordinates(mousemove, 170, 130);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = setMouseCordinates(mousemove, 60, 160);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            let mouseup: any = getEventObject('MouseEvents', 'mouseup', movingElemnt, targetElemnt);
            mouseup.type = 'mouseup';
            EventHandler.trigger(<any>(document), 'mouseup', mouseup);
            expect((<any>gridLayOut).getCellInstance('0').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('0').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('1').row == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('1').col == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('2').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('2').col == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('3').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('3').col == 3).toBe(true);
            expect((<any>gridLayOut).getCellInstance('4').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('4').col == 4).toBe(true);
            expect((<any>gridLayOut).getCellInstance('5').row == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('5').col == 4).toBe(true);
            expect(resizingElement.classList.contains("e-dragging")).toBe(false);
        });

        it('Resizing test case in southWest expand direction less than min', () => {
            gridLayOut = new DashboardLayout({
                cellAspectRatio: 1,
                columns: 12,
                cellSpacing: [5, 5],
                resizableHandles: ['e-south-west'],
                //     rows: 2,
                allowResizing: true,
                panels: [
                    { "id": '0', "sizeX": 1, "sizeY": 1, "row": 0, "col": 0, content: generateTemplate('0') },
                    { "id": '1', "sizeX": 1, "sizeY": 1, "row": 2, "col": 1, content: generateTemplate('1') },
                    { "id": '2', "sizeX": 2, "sizeY": 2, "row": 0, "col": 1, "minSizeX": 2, "minSizeY": 2, content: generateTemplate('2') },
                    { "id": '3', "sizeX": 1, "sizeY": 1, "row": 0, "col": 3, content: generateTemplate('3') },
                    { "id": '4', "sizeX": 1, "sizeY": 1, "row": 0, "col": 4, content: generateTemplate('4') },
                    { "id": '5', "sizeX": 1, "sizeY": 1, "row": 1, "col": 4, content: generateTemplate('5') },
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            let resizingElement: HTMLElement = document.getElementById('2');
            resizingElement.classList.add('e-item-hover');
            let movingElemnt: HTMLElement = resizingElement.querySelector('.e-south-west');
            let targetElemnt: HTMLElement = document.getElementById('1');
            let mousedown: any = getEventObject('MouseEvents', 'mousedown', movingElemnt, targetElemnt, 115, 191);
            EventHandler.trigger(<HTMLElement>movingElemnt, 'mousedown', mousedown);
            let mousemove: any = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 160, 160);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
            mousemove = setMouseCordinates(mousemove, 190, 120);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = setMouseCordinates(mousemove, 214, 96);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            let mouseup: any = getEventObject('MouseEvents', 'mouseup', movingElemnt, targetElemnt);
            mouseup.type = 'mouseup';
            EventHandler.trigger(<any>(document), 'mouseup', mouseup);
            expect((<any>gridLayOut).getCellInstance('0').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('0').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('1').row == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('1').col == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('2').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('2').col == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('3').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('3').col == 3).toBe(true);
            expect((<any>gridLayOut).getCellInstance('4').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('4').col == 4).toBe(true);
            expect((<any>gridLayOut).getCellInstance('5').row == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('5').col == 4).toBe(true);
            expect(resizingElement.classList.contains("e-dragging")).toBe(false);
        });


        it('Resizing test case in southEast expand direction alone', () => {
            gridLayOut = new DashboardLayout({
                cellAspectRatio: 1,
                columns: 12,
                //     rows: 2,
                cellSpacing: [5, 5],
                allowResizing: true,
                panels: [
                    { "id": '0', "sizeX": 1, "sizeY": 1, "row": 0, "col": 0, content: generateTemplate('0') },
                    { "id": '1', "sizeX": 1, "sizeY": 1, "row": 0, "col": 1, content: generateTemplate('1') },
                    { "id": '2', "sizeX": 1, "sizeY": 1, "row": 0, "col": 2, content: generateTemplate('2') },
                    { "id": '3', "sizeX": 1, "sizeY": 1, "row": 0, "col": 3, content: generateTemplate('3') },
                    { "id": '4', "sizeX": 1, "sizeY": 1, "row": 0, "col": 4, content: generateTemplate('4') },
                    { "id": '5', "sizeX": 1, "sizeY": 1, "row": 1, "col": 4, content: generateTemplate('5') },
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            let resizingElement: HTMLElement = document.getElementById('0');
            resizingElement.classList.add('e-item-hover');
            let movingElemnt: HTMLElement = resizingElement.querySelector('.e-south-east');
            let targetElemnt: HTMLElement = document.getElementById('1');
            let mousedown: any = getEventObject('MouseEvents', 'mousedown', movingElemnt, targetElemnt, 90, 95);
            EventHandler.trigger(<HTMLElement>movingElemnt, 'mousedown', mousedown);
            let mousemove: any = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 100, 100);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
            mousemove = setMouseCordinates(mousemove, 200, 130);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = setMouseCordinates(mousemove, 230, 160);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            let mouseup: any = getEventObject('MouseEvents', 'mouseup', movingElemnt, targetElemnt);
            mouseup.type = 'mouseup';
            EventHandler.trigger(<any>(document), 'mouseup', mouseup);
            expect((<any>gridLayOut).getCellInstance('0').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('0').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('1').row == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('1').col == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('2').row == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('2').col == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('3').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('3').col == 3).toBe(true);
            expect((<any>gridLayOut).getCellInstance('4').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('4').col == 4).toBe(true);
            expect((<any>gridLayOut).getCellInstance('5').row == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('5').col == 4).toBe(true);
            expect(resizingElement.classList.contains("e-dragging")).toBe(false);
        });

        it('Resizing test case to check resize stop is triggered correctly', () => {
            let height: number = 0;
            let width: number = 0;
            gridLayOut = new DashboardLayout({
                cellAspectRatio: 1,
                columns: 12,
                //     rows: 2,
                cellSpacing: [5, 5],
                allowResizing: true,
                resizeStop: function (args: any) {
                    expect(args.element.offsetHeight === height).toBe(true);
                    expect(args.element.offsetWidth === width).toBe(true);
                },
                panels: [
                    { "id": '0', "sizeX": 1, "sizeY": 1, "row": 0, "col": 0, content: generateTemplate('0') },
                    { "id": '1', "sizeX": 1, "sizeY": 1, "row": 0, "col": 1, content: generateTemplate('1') },
                    { "id": '2', "sizeX": 1, "sizeY": 1, "row": 0, "col": 2, content: generateTemplate('2') },
                    { "id": '3', "sizeX": 1, "sizeY": 1, "row": 0, "col": 3, content: generateTemplate('3') },
                    { "id": '4', "sizeX": 1, "sizeY": 1, "row": 0, "col": 4, content: generateTemplate('4') },
                    { "id": '5', "sizeX": 1, "sizeY": 1, "row": 1, "col": 4, content: generateTemplate('5') },
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            let resizingElement: HTMLElement = document.getElementById('0');
            height = resizingElement.offsetHeight;
            width = resizingElement.offsetWidth;
            resizingElement.classList.add('e-item-hover');
            let movingElemnt: HTMLElement = resizingElement.querySelector('.e-south-east');
            let targetElemnt: HTMLElement = document.getElementById('1');
            let mousedown: any = getEventObject('MouseEvents', 'mousedown', movingElemnt, targetElemnt, 90, 95);
            EventHandler.trigger(<HTMLElement>movingElemnt, 'mousedown', mousedown);
            let mousemove: any = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 91, 96);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            let mouseup: any = getEventObject('MouseEvents', 'mouseup', movingElemnt, targetElemnt);
            mouseup.type = 'mouseup';
            EventHandler.trigger(<any>(document), 'mouseup', mouseup);
            expect((<any>gridLayOut).getCellInstance('0').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('0').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('1').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('1').col == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('2').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('2').col == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('3').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('3').col == 3).toBe(true);
            expect((<any>gridLayOut).getCellInstance('4').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('4').col == 4).toBe(true);
            expect((<any>gridLayOut).getCellInstance('5').row == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('5').col == 4).toBe(true);
            expect(resizingElement.classList.contains("e-dragging")).toBe(false);
        });

        it('Resizing test case in southEast expand direction exceeding max range', () => {
            gridLayOut = new DashboardLayout({
                cellAspectRatio: 1,
                columns: 12,
                //     rows: 2,
                cellSpacing: [5, 5],
                allowResizing: true,
                panels: [
                    { "id": '0', "sizeX": 1, "sizeY": 1, "row": 0, "col": 0, "maxSizeX": 3, "maxSizeY": 2, content: generateTemplate('0') },
                    { "id": '1', "sizeX": 1, "sizeY": 1, "row": 0, "col": 1, content: generateTemplate('1') },
                    { "id": '2', "sizeX": 1, "sizeY": 1, "row": 0, "col": 2, content: generateTemplate('2') },
                    { "id": '3', "sizeX": 1, "sizeY": 1, "row": 0, "col": 3, content: generateTemplate('3') },
                    { "id": '4', "sizeX": 1, "sizeY": 1, "row": 0, "col": 4, content: generateTemplate('4') },
                    { "id": '5', "sizeX": 1, "sizeY": 1, "row": 1, "col": 4, content: generateTemplate('5') },
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            let resizingElement: HTMLElement = document.getElementById('0');
            resizingElement.classList.add('e-item-hover');
            let movingElemnt: HTMLElement = resizingElement.querySelector('.e-south-east');
            let targetElemnt: HTMLElement = document.getElementById('1');
            let mousedown: any = getEventObject('MouseEvents', 'mousedown', movingElemnt, targetElemnt, 90, 95);
            EventHandler.trigger(<HTMLElement>movingElemnt, 'mousedown', mousedown);
            let mousemove: any = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 100, 100);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
            mousemove = setMouseCordinates(mousemove, 200, 130);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = setMouseCordinates(mousemove, 210, 150);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = setMouseCordinates(mousemove, 300, 150);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = setMouseCordinates(mousemove, 320, 160);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            let mouseup: any = getEventObject('MouseEvents', 'mouseup', movingElemnt, targetElemnt);
            mouseup.type = 'mouseup';
            EventHandler.trigger(<any>(document), 'mouseup', mouseup);
            expect((<any>gridLayOut).getCellInstance('0').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('0').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('1').row == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('1').col == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('2').row == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('2').col == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('3').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('3').col == 3).toBe(true);
            expect((<any>gridLayOut).getCellInstance('4').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('4').col == 4).toBe(true);
            expect((<any>gridLayOut).getCellInstance('5').row == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('5').col == 4).toBe(true);
            expect(resizingElement.classList.contains("e-dragging")).toBe(false);
        });

        it('Resizing test case in southEast shrink direction alone', () => {
            gridLayOut = new DashboardLayout({
                cellAspectRatio: 1,
                columns: 12,
                cellSpacing: [5, 5],
                //     rows: 4,
                allowResizing: true,
                resizableHandles: ['e-south-east'],
                panels: [
                    { "id": '0', "sizeX": 1, "sizeY": 1, "row": 0, "col": 2, content: generateTemplate('0') },
                    { "id": '1', "sizeX": 2, "sizeY": 2, "maxSizeX": 2, "maxSizeY": 2, "row": 1, "col": 1, content: generateTemplate('1') },
                    { "id": '2', "sizeX": 1, "sizeY": 1, "row": 3, "col": 2, content: generateTemplate('2') },
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            let resizingElement: HTMLElement = document.getElementById('1');
            resizingElement.classList.add('e-item-hover');
            let movingElemnt: HTMLElement = resizingElement.querySelector('.e-south-east');
            let targetElemnt: HTMLElement = document.getElementById('1');
            let mousedown: any = getEventObject('MouseEvents', 'mousedown', movingElemnt, targetElemnt, 306, 306);
            EventHandler.trigger(<HTMLElement>movingElemnt, 'mousedown', mousedown);
            let mousemove: any = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 255, 255);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
            mousemove = setMouseCordinates(mousemove, 200, 220);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = setMouseCordinates(mousemove, 190, 200);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            let mouseup: any = getEventObject('MouseEvents', 'mouseup', movingElemnt, targetElemnt);
            mouseup.type = 'mouseup';
            EventHandler.trigger(<any>(document), 'mouseup', mouseup);
            expect((<any>gridLayOut).getCellInstance('0').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('0').col == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('1').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('1').col == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('1').sizeX == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('1').sizeY == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('2').row == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('2').col == 2).toBe(true);
            expect(resizingElement.classList.contains("e-dragging")).toBe(false);
        });

        it('Resizing test case in southEast shrink direction less than min case', () => {
            gridLayOut = new DashboardLayout({
                cellAspectRatio: 1,
                columns: 12,
                cellSpacing: [5, 5],
                //     rows: 4,
                allowResizing: true,
                resizableHandles: ['e-south-east'],
                panels: [
                    { "id": '0', "sizeX": 1, "sizeY": 1, "row": 0, "col": 2, content: generateTemplate('0') },
                    { "id": '1', "sizeX": 2, "sizeY": 2, "minSizeX": 2, "minSizeY": 2, "row": 1, "col": 1, content: generateTemplate('1') },
                    { "id": '2', "sizeX": 1, "sizeY": 1, "row": 3, "col": 2, content: generateTemplate('2') },
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            let resizingElement: HTMLElement = document.getElementById('1');
            resizingElement.classList.add('e-item-hover');
            let movingElemnt: HTMLElement = resizingElement.querySelector('.e-south-east');
            let targetElemnt: HTMLElement = document.getElementById('1');
            let mousedown: any = getEventObject('MouseEvents', 'mousedown', movingElemnt, targetElemnt, 306, 306);
            EventHandler.trigger(<HTMLElement>movingElemnt, 'mousedown', mousedown);
            let mousemove: any = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 255, 255);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
            mousemove = setMouseCordinates(mousemove, 200, 220);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = setMouseCordinates(mousemove, 190, 200);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            let mouseup: any = getEventObject('MouseEvents', 'mouseup', movingElemnt, targetElemnt);
            mouseup.type = 'mouseup';
            EventHandler.trigger(<any>(document), 'mouseup', mouseup);
            expect((<any>gridLayOut).getCellInstance('0').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('0').col == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('1').row == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('1').col == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('1').sizeX == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('1').sizeY == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('2').row == 3).toBe(true);
            expect((<any>gridLayOut).getCellInstance('2').col == 2).toBe(true);
            expect(resizingElement.classList.contains("e-dragging")).toBe(false);
        });

        // it('Resizing test case in northEast shrink direction alone', () => {
        //     gridLayOut = new DashboardLayout({
        //        cellAspectRatio: 1,
        //         columns: 12,
        //         cellSpacing: [5, 5],
        //         //     rows: 4,
        //         allowResizing: true,
        //         panels: [
        //             { "id": '0', "sizeX": 1, "sizeY": 1, "row": 0, "col": 2, content: generateTemplate('0') },
        //             { "id": '1', "sizeX": 2, "sizeY": 2, "maxSizeX": 2, "maxSizeY": 2, "row": 1, "col": 1, content: generateTemplate('1') },
        //             { "id": '2', "sizeX": 1, "sizeY": 1, "row": 3, "col": 2, content: generateTemplate('2') },
        //         ]
        //     });
        //     gridLayOut.appendTo('#gridlayout');
        //     let resizingElement: HTMLElement = document.getElementById('1');
        //     resizingElement.classList.add('e-item-hover');
        //     let movingElemnt: HTMLElement = resizingElement.querySelector('.e-south-east-shrink');
        //     let targetElemnt: HTMLElement = document.getElementById('1');
        //     let mousedown: any = getEventObject('MouseEvents', 'mousedown', movingElemnt, targetElemnt, 306, 109);
        //     EventHandler.trigger(<HTMLElement>movingElemnt, 'mousedown', mousedown);
        //     let mousemove: any = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 255, 110);
        //     EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        //     mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
        //     mousemove = setMouseCordinates(mousemove, 200, 120);
        //     EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        //     mousemove = setMouseCordinates(mousemove, 190, 150);
        //     EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        //     EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        //     let mouseup: any = getEventObject('MouseEvents', 'mouseup', movingElemnt, targetElemnt);
        //     mouseup.type = 'mouseup';
        //     EventHandler.trigger(<any>(document), 'mouseup', mouseup);
        //     expect((<any>gridLayOut).getCellInstance('0').row == 0).toBe(true);
        //     expect((<any>gridLayOut).getCellInstance('0').col == 2).toBe(true);
        //     expect((<any>gridLayOut).getCellInstance('1').row == 1).toBe(true);
        //     expect((<any>gridLayOut).getCellInstance('1').col == 1).toBe(true);
        //     expect((<any>gridLayOut).getCellInstance('1').sizeX == 1).toBe(true);
        //     expect((<any>gridLayOut).getCellInstance('1').sizeY == 3).toBe(true);
        //     expect((<any>gridLayOut).getCellInstance('2').row == 1).toBe(true);
        //     expect((<any>gridLayOut).getCellInstance('2').col == 2).toBe(true);
        // });

        // it('Resizing test case in north west shrink direction alone', () => {
        //     gridLayOut = new DashboardLayout({
        //        cellAspectRatio: 1,
        //         columns: 12,
        //         //     rows: 4,
        //         cellSpacing: [5, 5],
        //         allowResizing: true,
        //         panels: [
        //             { "id": '0', "sizeX": 1, "sizeY": 1, "row": 0, "col": 2, content: generateTemplate('0') },
        //             { "id": '1', "sizeX": 2, "sizeY": 2, "maxSizeX": 2, "maxSizeY": 2, "row": 1, "col": 1, content: generateTemplate('1') },
        //             { "id": '2', "sizeX": 1, "sizeY": 1, "row": 3, "col": 2, content: generateTemplate('2') },
        //         ]
        //     });
        //     gridLayOut.appendTo('#gridlayout');
        //     let resizingElement: HTMLElement = document.getElementById('1');
        //     resizingElement.classList.add('e-item-hover');
        //     let movingElemnt: HTMLElement = resizingElement.querySelector('.e-north-west-shrink');
        //     let targetElemnt: HTMLElement = document.getElementById('1');
        //     let mousedown: any = getEventObject('MouseEvents', 'mousedown', movingElemnt, targetElemnt, 109, 109);
        //     EventHandler.trigger(<HTMLElement>movingElemnt, 'mousedown', mousedown);
        //     let mousemove: any = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 170, 160);
        //     EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        //     mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
        //     mousemove = setMouseCordinates(mousemove, 200, 200);
        //     EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        //     mousemove = setMouseCordinates(mousemove, 220, 220);
        //     EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        //     EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        //     let mouseup: any = getEventObject('MouseEvents', 'mouseup', movingElemnt, targetElemnt);
        //     mouseup.type = 'mouseup';
        //     EventHandler.trigger(<any>(document), 'mouseup', mouseup);
        //     expect((<any>gridLayOut).getCellInstance('0').row == 0).toBe(true);
        //     expect((<any>gridLayOut).getCellInstance('0').col == 2).toBe(true);
        //     expect((<any>gridLayOut).getCellInstance('1').row == 2).toBe(true);
        //     expect((<any>gridLayOut).getCellInstance('1').col == 2).toBe(true);
        //     expect((<any>gridLayOut).getCellInstance('1').sizeX == 1).toBe(true);
        //     expect((<any>gridLayOut).getCellInstance('1').sizeY == 1).toBe(true);
        //     expect((<any>gridLayOut).getCellInstance('2').row == 3).toBe(true);
        //     expect((<any>gridLayOut).getCellInstance('2').col == 2).toBe(true);
        // });

        it('Resizing test case in south west shrink direction alone', () => {
            gridLayOut = new DashboardLayout({
                cellAspectRatio: 1,
                columns: 12,
                //     rows: 5,
                cellSpacing: [5, 5],
                allowResizing: true,
                resizableHandles: ['e-south-west'],
                panels: [
                    { "id": '0', "sizeX": 1, "sizeY": 1, "row": 0, "col": 2, content: generateTemplate('0') },
                    { "id": '1', "sizeX": 2, "sizeY": 2, "maxSizeX": 2, "maxSizeY": 2, "row": 1, "col": 1, content: generateTemplate('1') },
                    { "id": '2', "sizeX": 1, "sizeY": 1, "row": 3, "col": 2, content: generateTemplate('2') },
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            let resizingElement: HTMLElement = document.getElementById('1');
            resizingElement.classList.add('e-item-hover');
            let movingElemnt: HTMLElement = resizingElement.querySelector('.e-south-west');
            let targetElemnt: HTMLElement = document.getElementById('1');
            let mousedown: any = getEventObject('MouseEvents', 'mousedown', movingElemnt, targetElemnt, 109, 306);
            EventHandler.trigger(<HTMLElement>movingElemnt, 'mousedown', mousedown);
            let mousemove: any = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 120, 270);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
            mousemove = setMouseCordinates(mousemove, 200, 250);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = setMouseCordinates(mousemove, 220, 120);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            let mouseup: any = getEventObject('MouseEvents', 'mouseup', movingElemnt, targetElemnt);
            mouseup.type = 'mouseup';
            EventHandler.trigger(<any>(document), 'mouseup', mouseup);
            expect((<any>gridLayOut).getCellInstance('0').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('0').col == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('1').row == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('1').col == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('1').sizeX == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('1').sizeY == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('2').row == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('2').col == 2).toBe(true);
            expect(resizingElement.classList.contains("e-dragging")).toBe(false);
        });

        it('cellsize test case', () => {
            gridLayOut = new DashboardLayout({
                cellAspectRatio: 1,
                columns: 6,
                panels: [{
                    id: "one",
                    cssClass: "e-one",

                    sizeX: 2,
                    sizeY: 1,
                    row: 1,
                    col: 0,

                    content: ("#template1")
                },
                {
                    id: "two",
                    cssClass: "e-two",

                    sizeX: 2,
                    sizeY: 1,
                    row: 0,
                    col: 0,
                    content: ("#template2")
                },
                {
                    id: "three",
                    cssClass: "e-three",

                    sizeX: 1,
                    sizeY: 1,
                    row: 0,
                    col: 2,
                    content: ("#template2")
                },
                {
                    id: "four",
                    cssClass: "e-four",

                    sizeX: 5,
                    sizeY: 1,
                    row: 2,
                    col: 0,
                    content: ("#template1")
                },
                {
                    id: "five",
                    cssClass: "e-five",

                    sizeX: 3,
                    sizeY: 1,
                    row: 1,
                    col: 2,
                    content: ("#template1")
                },
                {
                    id: "six",
                    cssClass: "e-six",

                    sizeX: 2,
                    sizeY: 1,
                    row: 0,
                    col: 3,
                    content: ("#template2")
                }
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            let CellElements: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>gridLayOut.element.querySelectorAll('.e-panel');
            setCss(CellElements);
            expect(gridLayOut.element.classList.contains('e-dashboardlayout')).toBe(true);
            expect(gridLayOut.element.childElementCount == 6).toBe(true);
            expect((<HTMLElement>gridLayOut.element.querySelector('#one')).style.width).toBe('418px');
            expect((<HTMLElement>gridLayOut.element.querySelector('#one')).style.height).toBe('206.5px');
        });

        it('cellSpacing test case', () => {
            gridLayOut = new DashboardLayout({
                cellAspectRatio: 1,
                columns: 6,
                cellSpacing: [20, 20],
                panels: [{
                    id: "one",
                    cssClass: "e-one",

                    sizeX: 2,
                    enabled: false,
                    sizeY: 1,
                    row: 1,
                    col: 0,

                    content: ("#template1")
                },
                {
                    id: "two",
                    cssClass: "e-two",

                    sizeX: 2,
                    sizeY: 1,
                    row: 0,
                    col: 0,
                    content: ("#template2")
                },
                {
                    id: "three",
                    cssClass: "e-three",

                    sizeX: 1,
                    sizeY: 1,
                    row: 0,
                    col: 2,
                    content: ("#template2")
                },
                {
                    id: "four",
                    cssClass: "e-four",

                    sizeX: 5,
                    sizeY: 1,
                    row: 2,
                    col: 0,
                    content: ("#template1")
                },
                {
                    id: "five",
                    cssClass: "e-five",

                    sizeX: 3,
                    sizeY: 1,
                    row: 1,
                    col: 2,
                    content: ("#template1")
                },
                {
                    id: "six",
                    cssClass: "e-six",

                    sizeX: 2,
                    sizeY: 1,
                    row: 0,
                    col: 3,
                    content: ("#template2")
                }
                ],
                showGridLines: true
            });
            gridLayOut.appendTo('#gridlayout');
            let CellElements: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>gridLayOut.element.querySelectorAll('.e-panel');
            setCss(CellElements);
            expect(gridLayOut.element.classList.contains('e-dashboardlayout')).toBe(true);
            expect(gridLayOut.element.childElementCount == 7).toBe(true);
            expect((<HTMLElement>gridLayOut.element.querySelector('#two')).style.width).toBe('408px');
            expect((<HTMLElement>gridLayOut.element.querySelector('#two')).style.height).toBe('194px');

            // onProperty test case 
            gridLayOut.cellSpacing = [10, 10];
            gridLayOut.dataBind();
            expect((<HTMLElement>gridLayOut.element.querySelector('#one')).style.width).toBe('414.667px');
            expect((<HTMLElement>gridLayOut.element.querySelector('#one')).style.height).toBe('202.333px');
        });


        it('sizeX and sizeY test case', () => {
            gridLayOut = new DashboardLayout({
                cellAspectRatio: 1,
                columns: 6,
                cellSpacing: [20, 20],
                panels: [{
                    id: "one",
                    cssClass: "e-one",

                    sizeX: 2,
                    minSizeY: 1,
                    row: 1,
                    col: 0,

                    content: ("#template1")
                },
                {
                    id: "two",
                    cssClass: "e-two",

                    sizeX: 2,
                    sizeY: 0,
                    minSizeY: 1,
                    row: 0,
                    col: 0,
                    content: ("#template2")
                },
                {
                    id: "three",
                    cssClass: "e-three",

                    sizeX: 2,
                    maxSizeX: 1,
                    sizeY: 2,
                    maxSizeY: 1,
                    row: 0,
                    col: 2,
                    content: ("#template2")
                },
                {
                    id: "four",
                    cssClass: "e-four",

                    sizeX: 5,
                    minSizeY: 1,
                    row: 2,
                    col: 0,
                    content: ("#template1")
                },
                {
                    id: "five",
                    cssClass: "e-five",

                    sizeX: 2,
                    minSizeX: 3,
                    sizeY: 1,
                    row: 1,
                    col: 2,
                    content: ("#template1")
                },
                {
                    id: "six",
                    cssClass: "e-six",

                    minSizeX: 1,
                    sizeY: 1,
                    row: 0,
                    col: 3,
                    content: ("#template2")
                }
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            let CellElements: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>gridLayOut.element.querySelectorAll('.e-panel');
            setCss(CellElements);
            expect(gridLayOut.element.classList.contains('e-dashboardlayout')).toBe(true);
            expect(gridLayOut.element.childElementCount == 6).toBe(true);
            expect(((<HTMLElement>gridLayOut.element.querySelector('#one')).getAttribute('data-sizeX'))).toBe('2');
            expect(((<HTMLElement>gridLayOut.element.querySelector('#one')).getAttribute('data-sizeY'))).toBe('1');
        });

        it('allowdragging test case', () => {
            gridLayOut = new DashboardLayout({
                cellAspectRatio: 1,
                columns: 6,
                allowDragging: true,
                cellSpacing: [20, 20],
                panels: [{
                    id: "one",
                    cssClass: "e-one",

                    sizeX: 2,
                    sizeY: 1,
                    row: 1,
                    col: 0,

                    content: ("#template1")
                },
                {
                    id: "two",
                    cssClass: "e-two",

                    sizeX: 2,
                    sizeY: 1,
                    row: 0,
                    col: 0,

                    content: "#template2"

                },
                {
                    id: "three",
                    cssClass: "e-three",

                    sizeX: 1,
                    sizeY: 1,
                    row: 0,
                    col: 2,

                    content: ("#template2")

                },
                {
                    id: "four",
                    cssClass: "e-four",

                    sizeX: 5,
                    sizeY: 1,
                    row: 2,
                    col: 0,

                    content: ("#template1")

                },
                {
                    id: "five",
                    cssClass: "e-five",

                    sizeX: 3,
                    sizeY: 1,
                    row: 1,
                    col: 2,
                    content: ("#template1")
                },
                {
                    id: "six",
                    cssClass: "e-six",

                    sizeX: 2,
                    sizeY: 1,
                    row: 0,
                    col: 3,

                    content: ("#template")

                }
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            let CellElements: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>gridLayOut.element.querySelectorAll('.e-panel');
            setCss(CellElements);
            expect(gridLayOut.element.classList.contains('e-dashboardlayout')).toBe(true);
            expect(gridLayOut.element.childElementCount == 6).toBe(true);
            expect((<HTMLElement>gridLayOut.element.querySelector('#one')).classList.contains('e-draggable')).toBe(true);
            // Onproperty test case 
            gridLayOut.allowDragging = false;
            gridLayOut.dataBind();
            expect((<HTMLElement>gridLayOut.element.querySelector('#one')).classList.contains('e-draggable')).toBe(false);
        });
        it('allowdragging test case with prevent default', () => {
            gridLayOut = new DashboardLayout({
                cellAspectRatio: 1,
                columns: 6,
                allowDragging: true,
                cellSpacing: [20, 20],
                panels: [{
                    id: "one",
                    cssClass: "e-one",

                    sizeX: 2,
                    sizeY: 1,
                    row: 1,
                    col: 0,

                    content: ("#template1")
                },
                {
                    id: "two",
                    cssClass: "e-two",

                    sizeX: 2,
                    sizeY: 1,
                    row: 0,
                    col: 0,

                    content: "#template2"

                },
                {
                    id: "three",
                    cssClass: "e-three",

                    sizeX: 1,
                    sizeY: 1,
                    row: 0,
                    col: 2,

                    content: ("#template2")

                },
                {
                    id: "four",
                    cssClass: "e-four",

                    sizeX: 5,
                    sizeY: 1,
                    row: 2,
                    col: 0,

                    content: ("#template1")

                },
                {
                    id: "five",
                    cssClass: "e-five",

                    sizeX: 3,
                    sizeY: 1,
                    row: 1,
                    col: 2,
                    content: ("#template1")
                },
                {
                    id: "six",
                    cssClass: "e-six",

                    sizeX: 2,
                    sizeY: 1,
                    row: 0,
                    col: 3,

                    content: ("#template")

                }
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            expect(gridLayOut.dragobj.preventDefault).toBe(false);
        });
        it('rtl test case', () => {
            gridLayOut = new DashboardLayout({
                cellAspectRatio: 1,
                columns: 6,
                allowDragging: true,
                enableRtl: true,
                cellSpacing: [20, 20],
                panels: [{
                    id: "one",
                    cssClass: "e-one",

                    sizeX: 2,
                    sizeY: 1,
                    row: 1,
                    col: 0,

                    content: ("#template1")
                },
                {
                    id: "two",
                    cssClass: "e-two",

                    sizeX: 2,
                    sizeY: 1,
                    row: 0,
                    col: 0,
                    content: ("#template2")
                },
                {
                    id: "three",
                    cssClass: "e-three",

                    sizeX: 1,
                    sizeY: 1,
                    row: 0,
                    col: 2,
                    content: ("#template2")
                },
                {
                    id: "four",
                    cssClass: "e-four",

                    sizeX: 5,
                    sizeY: 1,
                    row: 2,
                    col: 0,
                    content: ("#template1")
                },
                {
                    id: "five",
                    cssClass: "e-five",

                    sizeX: 3,
                    sizeY: 1,
                    row: 1,
                    col: 2,
                    content: ("#template1")
                },
                {
                    id: "six",
                    cssClass: "e-six",

                    sizeX: 2,
                    sizeY: 1,
                    row: 0,
                    col: 3,
                    content: ("#template2")
                }
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            let CellElements: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>gridLayOut.element.querySelectorAll('.e-panel');
            setCss(CellElements);
            expect(gridLayOut.element.classList.contains('e-dashboardlayout')).toBe(true);
            expect(gridLayOut.element.childElementCount == 6).toBe(true);
            expect((<HTMLElement>gridLayOut.element).classList.contains('e-rtl')).toBe(true);
            // Onproperty test case 
            gridLayOut.enableRtl = false;
            gridLayOut.dataBind();
            expect((<HTMLElement>gridLayOut.element).classList.contains('e-rtl')).toBe(false);
        });
        it('cssClass test case', () => {
            gridLayOut = new DashboardLayout({
                cellAspectRatio: 1,
                columns: 6,
                allowDragging: true,
                enableRtl: true,
                cellSpacing: [20, 20],
                panels: [{
                    id: "one",
                    cssClass: "e-one",

                    sizeX: 2,
                    sizeY: 1,
                    row: 1,
                    col: 0,

                    content: ("#template1")
                },
                {
                    id: "two",
                    cssClass: "e-two",

                    sizeX: 2,
                    sizeY: 1,
                    row: 0,
                    col: 0,
                    content: ("#template2")
                },
                {
                    id: "three",
                    cssClass: "e-three",

                    sizeX: 1,
                    sizeY: 1,
                    row: 0,
                    col: 2,
                    content: ("#template2")
                },
                {
                    id: "four",
                    cssClass: "e-four",

                    sizeX: 5,
                    sizeY: 1,
                    row: 2,
                    col: 0,
                    content: ("#template1")
                },
                {
                    id: "five",
                    cssClass: "e-five",

                    sizeX: 3,
                    sizeY: 1,
                    row: 1,
                    col: 2,
                    content: ("#template1")
                },
                {
                    id: "six",
                    cssClass: "e-six",

                    sizeX: 2,
                    sizeY: 1,
                    row: 0,
                    col: 3,
                    content: ("#template2")
                }
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            let CellElements: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>gridLayOut.element.querySelectorAll('.e-panel');
            setCss(CellElements);
            expect(gridLayOut.element.classList.contains('e-dashboardlayout')).toBe(true);
            expect(gridLayOut.element.childElementCount == 6).toBe(true);
            // expect((<HTMLElement>gridLayOut.element).classList.contains('e-custom')).toBe(true);
            // Onproperty test case 
            gridLayOut.cssClass = 'e-change';
            gridLayOut.dataBind();
            // expect((<HTMLElement>gridLayOut.element).classList.contains('e-change')).toBe(true);
        });

        it('allowPushing test case', () => {
            gridLayOut = new DashboardLayout({
                cellAspectRatio: 1,
                columns: 6,
                allowPushing: false,
                enableRtl: true,
                cellSpacing: [20, 20],
                panels: [{
                    id: "one",
                    cssClass: "e-one",

                    sizeX: 2,
                    sizeY: 1,
                    row: 1,
                    col: 0,

                    content: ("#template1")
                },
                {
                    id: "two",
                    cssClass: "e-two",

                    sizeX: 2,
                    sizeY: 1,
                    row: 0,
                    col: 0,
                    content: ("#template2")
                },
                {
                    id: "three",
                    cssClass: "e-three",

                    sizeX: 1,
                    sizeY: 1,
                    row: 0,
                    col: 2,
                    content: ("#template2")
                },
                {
                    id: "four",
                    cssClass: "e-four",

                    sizeX: 5,
                    sizeY: 1,
                    row: 2,
                    col: 0,
                    content: ("#template1")
                },
                {
                    id: "five",
                    cssClass: "e-five",

                    sizeX: 3,
                    sizeY: 1,
                    row: 1,
                    col: 2,
                    content: ("#template1")
                },
                {
                    id: "six",
                    cssClass: "e-six",

                    sizeX: 2,
                    sizeY: 1,
                    row: 0,
                    col: 3,
                    content: ("#template2")
                }
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            let CellElements: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>gridLayOut.element.querySelectorAll('.e-panel');
            setCss(CellElements);
            expect(gridLayOut.element.classList.contains('e-dashboardlayout')).toBe(true);
            expect(gridLayOut.element.childElementCount == 6).toBe(true);
            expect(gridLayOut.allowPushing).toBe(false);
            // expect((<HTMLElement>gridLayOut.element).classList.contains('e-custom')).toBe(true);
            // Onproperty test case 
            gridLayOut.allowPushing = true;
            gridLayOut.dataBind();
            expect(gridLayOut.allowPushing).toBe(true);
            // expect((<HTMLElement>gridLayOut.element).classList.contains('e-change')).toBe(true);
        });

        it('Simple Panel allowPushing', () => {
            gridLayOut = new DashboardLayout({
                cellAspectRatio: 1,
                columns: 6,
                cellSpacing: [20, 20],
                panels: [{
                    id: "one",

                    sizeX: 2,
                    sizeY: 2,
                    row: 0,
                    col: 0,
                    content: ("#template1")
                },
                {
                    id: "two",
                    cssClass: "e-two",

                    sizeX: 1,
                    sizeY: 2,
                    row: 0,
                    col: 0,
                    content: ("#template2")
                }
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            let CellElements: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>gridLayOut.element.querySelectorAll('.e-panel');
            setCss(CellElements);
            expect(gridLayOut.element.childElementCount == 2).toBe(true);
            expect((<any>gridLayOut.getCellInstance('one').row) === 0).toBe(true);
            expect((<any>gridLayOut.getCellInstance('one').col) === 1).toBe(true);
            expect((<any>gridLayOut.getCellInstance('two').row) === 0).toBe(true);
            expect((<any>gridLayOut.getCellInstance('two').col) === 0).toBe(true);
        });

        it('cell size auto rendering and checking console error', () => {
            gridLayOut = new DashboardLayout({
                cellAspectRatio: 1,
                columns: 6,
                cellSpacing: [20, 20],
                panels: [{
                    id: "one",

                    sizeX: 2,
                    sizeY: 2,
                    row: 0,
                    col: 0,
                    content: ("#template1")
                },
                {
                    id: "two",
                    cssClass: "e-two",

                    sizeX: 1,
                    sizeY: 2,
                    row: 0,
                    col: 0,
                    content: ("#template2")
                }
                ]
            });
            gridLayOut.appendTo('#gridlayout');
        });

        it('Simple Panel allowPushing', () => {
            gridLayOut = new DashboardLayout({
                cellAspectRatio: 1,
                columns: 6,
                cellSpacing: [20, 20],
                panels: [{
                    id: "one",

                    sizeX: 2,
                    sizeY: 2,
                    row: 0,
                    col: 1,
                    content: ("#template1")
                },
                {
                    id: "two",
                    cssClass: "e-two",

                    sizeX: 1,
                    sizeY: 2,
                    row: 0,
                    col: 2,
                    content: ("#template2")
                },
                ],
                mediaQuery: null,
            });
            gridLayOut.appendTo('#gridlayout');
            let CellElements: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>gridLayOut.element.querySelectorAll('.e-panel');
            setCss(CellElements);
            expect(gridLayOut.element.childElementCount == 2).toBe(true);
            expect((<any>gridLayOut.getCellInstance('one').row) === 0).toBe(true);
            expect((<any>gridLayOut.getCellInstance('one').col) === 0).toBe(true);
            expect((<any>gridLayOut.getCellInstance('two').row) === 0).toBe(true);
            expect((<any>gridLayOut.getCellInstance('two').col) === 2).toBe(true);
        });

        it('allowFloating test case', () => {
            gridLayOut = new DashboardLayout({
                cellAspectRatio: 1,
                columns: 6,
                allowFloating: false,
                enableRtl: true,
                cellSpacing: [20, 20],
                panels: [{
                    id: "one",
                    cssClass: "e-one",

                    sizeX: 2,
                    sizeY: 1,
                    row: 1,
                    col: 0,

                    content: ("#template1")
                },
                {
                    id: "two",
                    cssClass: "e-two",

                    sizeX: 2,
                    sizeY: 1,
                    row: 0,
                    col: 0,
                    content: ("#template2")
                },
                {
                    id: "three",
                    cssClass: "e-three",

                    sizeX: 1,
                    sizeY: 1,
                    row: 0,
                    col: 2,
                    content: ("#template2")
                },
                {
                    id: "four",
                    cssClass: "e-four",

                    sizeX: 5,
                    sizeY: 1,
                    row: 2,
                    col: 0,
                    content: ("#template1")
                },
                {
                    id: "five",
                    cssClass: "e-five",

                    sizeX: 3,
                    sizeY: 1,
                    row: 1,
                    col: 2,
                    content: ("#template1")
                },
                {
                    id: "six",
                    cssClass: "e-six",

                    sizeX: 2,
                    sizeY: 1,
                    row: 0,
                    col: 3,
                    content: ("#template2")
                }
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            let CellElements: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>gridLayOut.element.querySelectorAll('.e-panel');
            setCss(CellElements);
            expect(gridLayOut.element.classList.contains('e-dashboardlayout')).toBe(true);
            expect(gridLayOut.element.childElementCount == 6).toBe(true);
            expect(gridLayOut.allowFloating).toBe(false);
            // expect((<HTMLElement>gridLayOut.element).classList.contains('e-custom')).toBe(true);
            // Onproperty test case 
            gridLayOut.allowFloating = true;
            gridLayOut.dataBind();
            expect(gridLayOut.allowFloating).toBe(true);
            // expect((<HTMLElement>gridLayOut.element).classList.contains('e-change')).toBe(true);
        });
        it('mediaquery test case', () => {
            gridLayOut = new DashboardLayout({
                cellAspectRatio: 1,
                columns: 6,
                mediaQuery: 'min-width: 600px',
                cellSpacing: [20, 20],
                panels: [{
                    id: "one",
                    cssClass: "e-one",

                    sizeX: 2,
                    sizeY: 1,
                    row: 1,
                    col: 0,

                    content: ("#template1")
                },
                {
                    id: "two",
                    cssClass: "e-two",

                    sizeX: 2,
                    sizeY: 1,
                    row: 0,
                    col: 0,
                    content: ("#template2")
                },
                {
                    id: "three",
                    cssClass: "e-three",

                    sizeX: 1,
                    sizeY: 1,
                    row: 0,
                    col: 2,
                    content: ("#template2")
                },
                {
                    id: "four",
                    cssClass: "e-four",

                    sizeX: 5,
                    sizeY: 1,
                    row: 2,
                    col: 0,
                    content: ("#template1")
                },
                {
                    id: "five",
                    cssClass: "e-five",

                    sizeX: 3,
                    sizeY: 1,
                    row: 1,
                    col: 2,
                    content: ("#template1")
                },
                {
                    id: "six",
                    cssClass: "e-six",

                    sizeX: 2,
                    sizeY: 1,
                    row: 0,
                    col: 3,
                    content: ("#template2")
                }
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            let CellElements: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>gridLayOut.element.querySelectorAll('.e-panel');
            setCss(CellElements);
            expect(gridLayOut.element.classList.contains('e-dashboardlayout')).toBe(true);
            expect(gridLayOut.element.childElementCount == 6).toBe(true);
            expect(gridLayOut.mediaQuery).toBe('min-width: 600px');

            // Onproperty test case 
            gridLayOut.mediaQuery = 'max-width: 600px';
            gridLayOut.dataBind();
            expect(gridLayOut.mediaQuery).toBe('max-width: 600px');
        });
        it('DraggableHandle panel test case', () => {
            let gridLayOut: any = new DashboardLayout({
                cellAspectRatio: 1,
                columns: 6,
                cellSpacing: [20, 20],
                panels: panelObject,
                draggableHandle: '.e-panel-container'
            });
            gridLayOut.appendTo('#gridlayout');
            let CellElements: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>gridLayOut.element.querySelectorAll('.e-panel');
            setCss(CellElements);
            expect(gridLayOut.element.classList.contains('e-dashboardlayout')).toBe(true);
            expect(gridLayOut.element.childElementCount == 6).toBe(true);
            expect(gridLayOut.draggableHandle).toBe('.e-panel-container');
            expect((<HTMLElement>gridLayOut.element.querySelector('.e-panel-container')).classList.contains('e-drag')).toBe(true);

            // Onproperty test case 
            gridLayOut.draggableHandle = 'e-panel';
            gridLayOut.dataBind();
            expect(gridLayOut.draggableHandle).toBe('e-panel');
            expect((<HTMLElement>gridLayOut.element.querySelector('.e-panel-container')).classList.contains('e-drag')).toBe(false);
            expect((<HTMLElement>gridLayOut.element.querySelector('.e-panel')).classList.contains('e-drag')).toBe(true);
        });

        it('enable Resize  test case', () => {
            let gridLayOut: any = new DashboardLayout({
                cellAspectRatio: 1,
                columns: 6,
                cellSpacing: [20, 20],
                allowResizing: true,
                panels: panelObject,
                draggableHandle: 'e-panel-container'
            });
            gridLayOut.appendTo('#gridlayout');
            let CellElements: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>gridLayOut.element.querySelectorAll('.e-panel');
            setCss(CellElements);
            expect(gridLayOut.element.classList.contains('e-dashboardlayout')).toBe(true);
            expect(gridLayOut.element.childElementCount == 6).toBe(true);
            expect(gridLayOut.allowResizing).toBe(true);
            // Onproperty test case 
            gridLayOut.allowResizing = false;
            gridLayOut.dataBind();
            expect(gridLayOut.allowResizing).toBe(false);
        });

        it('movepanel public method test case', () => {
            gridLayOut = new DashboardLayout({
                cellAspectRatio: 1,
                columns: 6,
                cellSpacing: [20, 20],
                panels: [{
                    id: "one",
                    cssClass: "e-one",

                    sizeX: 2,
                    sizeY: 1,
                    row: 1,
                    col: 0,
                    content: ("#template1")
                },
                {
                    id: "two",
                    cssClass: "e-two",

                    sizeX: 2,
                    sizeY: 1,
                    row: 0,
                    col: 0,
                    content: ("#template2")
                },
                {
                    id: "three",
                    cssClass: "e-three",

                    sizeX: 1,
                    sizeY: 1,
                    row: 0,
                    col: 2,
                    content: ("#template2")
                },
                {
                    id: "four",
                    cssClass: "e-four",

                    sizeX: 5,
                    sizeY: 1,
                    row: 2,
                    col: 0,
                    content: ("#template1")
                },
                {
                    id: "five",
                    cssClass: "e-five",

                    sizeX: 3,
                    sizeY: 1,
                    row: 1,
                    col: 2,
                    content: ("#template1")
                },
                {
                    id: "six",
                    cssClass: "e-six",

                    sizeX: 2,
                    sizeY: 1,
                    row: 0,
                    col: 3,
                    content: ("#template2")
                }
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            let CellElements: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>gridLayOut.element.querySelectorAll('.e-panel');
            setCss(CellElements);
            expect(gridLayOut.element.classList.contains('e-dashboardlayout')).toBe(true);
            expect(gridLayOut.element.childElementCount == 6).toBe(true);
            expect((<HTMLElement>gridLayOut.element.querySelector('#two')).getAttribute('data-row')).toBe('0');
            expect((<HTMLElement>gridLayOut.element.querySelector('#two')).getAttribute('data-col')).toBe('0');
            gridLayOut.movePanel('two', 2, 20);
            gridLayOut.dataBind();
            expect((<HTMLElement>gridLayOut.element.querySelector('#two')).getAttribute('data-row')).toBe('2');
            expect((<HTMLElement>gridLayOut.element.querySelector('#two')).getAttribute('data-col')).toBe('4');
            gridLayOut.movePanel('one', 1, -1);
            gridLayOut.dataBind();
        });

        it('movepanel public method test case with swapping case in beetween rows', () => {
            gridLayOut = new DashboardLayout({
                cellAspectRatio: 1,
                columns: 20,
                cellSpacing: [5, 5],
                panels: [
                    { "sizeX": 1, "sizeY": 1, "row": 0, "col": 0, content: generateTemplate('0') },
                    { "sizeX": 2, "sizeY": 2, "row": 0, "col": 1, content: generateTemplate('1') },
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
                    { "sizeX": 3, "sizeY": 2, "row": 5, "col": 5, content: generateTemplate('14') },
                    { "sizeX": 5, "sizeY": 1, "row": 5, "col": 0, content: generateTemplate('15') },
                    { "sizeX": 1, "sizeY": 4, "row": 0, "col": 8, content: generateTemplate('16') },
                    { "sizeX": 3, "sizeY": 3, "row": 0, "col": 9, content: generateTemplate('17') },
                    { "sizeX": 2, "sizeY": 1, "row": 3, "col": 9, content: generateTemplate('18') },
                    { "sizeX": 1, "sizeY": 2, "row": 3, "col": 11, content: generateTemplate('19') },
                    { "sizeX": 3, "sizeY": 1, "row": 4, "col": 8, content: generateTemplate('20') },
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            let CellElements: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>gridLayOut.element.querySelectorAll('.e-panel');
            setCss(CellElements);
            expect(gridLayOut.element.classList.contains('e-dashboardlayout')).toBe(true);
            expect((<HTMLElement>gridLayOut.element.querySelector('#layout_4')).getAttribute('data-row')).toBe('0');
            expect((<HTMLElement>gridLayOut.element.querySelector('#layout_4')).getAttribute('data-col')).toBe('5');
            gridLayOut.movePanel('layout_4', 2, 5);
            gridLayOut.dataBind();
            expect((<HTMLElement>gridLayOut.element.querySelector('#layout_4')).getAttribute('data-row')).toBe('2');
            expect((<HTMLElement>gridLayOut.element.querySelector('#layout_4')).getAttribute('data-col')).toBe('5');
            expect((<HTMLElement>gridLayOut.element.querySelector('#layout_7')).getAttribute('data-row')).toBe('0');
            expect((<HTMLElement>gridLayOut.element.querySelector('#layout_7')).getAttribute('data-col')).toBe('5');
            expect((<HTMLElement>gridLayOut.element.querySelector('#layout_8')).getAttribute('data-row')).toBe('0');
            expect((<HTMLElement>gridLayOut.element.querySelector('#layout_8')).getAttribute('data-col')).toBe('7');
        });

        it('movepanel public method test case with swapping case to restore same position', () => {
            gridLayOut = new DashboardLayout({
                cellAspectRatio: 1,
                columns: 20,
                cellSpacing: [5, 5],
                panels: [
                    { "sizeX": 1, "sizeY": 1, "row": 0, "col": 0, content: generateTemplate('0') },
                    { "sizeX": 2, "sizeY": 2, "row": 0, "col": 1, content: generateTemplate('1') },
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
                    { "sizeX": 3, "sizeY": 2, "row": 5, "col": 5, content: generateTemplate('14') },
                    { "sizeX": 5, "sizeY": 1, "row": 5, "col": 0, content: generateTemplate('15') },
                    { "sizeX": 1, "sizeY": 4, "row": 0, "col": 8, content: generateTemplate('16') },
                    { "sizeX": 3, "sizeY": 3, "row": 0, "col": 9, content: generateTemplate('17') },
                    { "sizeX": 2, "sizeY": 1, "row": 3, "col": 9, content: generateTemplate('18') },
                    { "sizeX": 1, "sizeY": 2, "row": 3, "col": 11, content: generateTemplate('19') },
                    { "sizeX": 3, "sizeY": 1, "row": 4, "col": 8, content: generateTemplate('20') },
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            let CellElements: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>gridLayOut.element.querySelectorAll('.e-panel');
            setCss(CellElements);
            expect(gridLayOut.element.classList.contains('e-dashboardlayout')).toBe(true);
            expect((<HTMLElement>gridLayOut.element.querySelector('#layout_0')).getAttribute('data-row')).toBe('0');
            expect((<HTMLElement>gridLayOut.element.querySelector('#layout_0')).getAttribute('data-col')).toBe('0');
            gridLayOut.movePanel('layout_0', 1, 0);
            gridLayOut.dataBind();
            expect((<HTMLElement>gridLayOut.element.querySelector('#layout_0')).getAttribute('data-row')).toBe('0');
            expect((<HTMLElement>gridLayOut.element.querySelector('#layout_0')).getAttribute('data-col')).toBe('0');
            expect((<HTMLElement>gridLayOut.element.querySelector('#layout_6')).getAttribute('data-row')).toBe('1');
            expect((<HTMLElement>gridLayOut.element.querySelector('#layout_6')).getAttribute('data-col')).toBe('0');
        });

        it('resizePanel public method test case less than min', () => {
            gridLayOut = new DashboardLayout({
                cellAspectRatio: 1,
                columns: 6,
                cellSpacing: [20, 20],
                panels: [{
                    id: "one",
                    sizeX: 2,
                    sizeY: 1,
                    row: 1,
                    col: 0
                },
                {
                    id: "two",
                    sizeX: 2,
                    sizeY: 1,
                    row: 0,
                    col: 0,
                    minSizeX: 2,
                    maxSizeX: 3,
                    minSizeY: 1,
                    maxSizeY: 2
                },
                {
                    id: "three",
                    sizeX: 1,
                    sizeY: 1,
                    row: 0,
                    col: 2
                },
                {
                    id: "four",
                    sizeX: 5,
                    sizeY: 1,
                    row: 2,
                    col: 0
                },
                {
                    id: "five",
                    sizeX: 3,
                    sizeY: 1,
                    row: 1,
                    col: 2
                },
                {
                    id: "six",
                    sizeX: 2,
                    sizeY: 1,
                    row: 0,
                    col: 3
                }
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            let CellElements: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>gridLayOut.element.querySelectorAll('.e-panel');
            setCss(CellElements);
            expect(gridLayOut.element.classList.contains('e-dashboardlayout')).toBe(true);
            expect(gridLayOut.element.childElementCount == 6).toBe(true);
            expect((<any>gridLayOut).getCellInstance('two').row).toBe(0);
            expect((<any>gridLayOut).getCellInstance('two').col).toBe(0);
            expect((<any>gridLayOut).getCellInstance('two').sizeX).toBe(2);
            expect((<any>gridLayOut).getCellInstance('two').sizeY).toBe(1);
            gridLayOut.resizePanel('two', 1, 0);
            expect((<any>gridLayOut).getCellInstance('two').row).toBe(0);
            expect((<any>gridLayOut).getCellInstance('two').col).toBe(0);
            expect((<any>gridLayOut).getCellInstance('two').sizeX).toBe(2);
            expect((<any>gridLayOut).getCellInstance('two').sizeY).toBe(1);
        });

        it('resizePanel public method test for events', () => {
            gridLayOut = new DashboardLayout({
                cellAspectRatio: 1,
                columns: 6,
                cellSpacing: [20, 20],
                panels: [{
                    id: "one",
                    sizeX: 2,
                    sizeY: 1,
                    row: 1,
                    col: 0
                },
                {
                    id: "two",
                    sizeX: 2,
                    sizeY: 1,
                    row: 0,
                    col: 0,
                    minSizeX: 2,
                    maxSizeX: 3,
                    minSizeY: 1,
                    maxSizeY: 2
                },
                {
                    id: "three",
                    sizeX: 1,
                    sizeY: 1,
                    row: 0,
                    col: 2
                },
                {
                    id: "four",
                    sizeX: 5,
                    sizeY: 1,
                    row: 2,
                    col: 0
                },
                {
                    id: "five",
                    sizeX: 3,
                    sizeY: 1,
                    row: 1,
                    col: 2
                },
                {
                    id: "six",
                    sizeX: 2,
                    sizeY: 1,
                    row: 0,
                    col: 3
                }
                ],
                resizeStart: function (args): void {
                    expect(args.event).toBe(null);
                    expect(args.element.id).toBe("two");
                    expect(args.isInteracted).toBe(false);
                },
                resizeStop: function (args): void {
                    expect(args.event).toBe(null);
                    expect(args.element.id).toBe("two");
                    expect(args.isInteracted).toBe(false);
                },
                change: function (args): void {
                    expect(args.changedPanels.length).toBe(3);
                    expect(args.isInteracted).toBe(false);
                }
            });
            gridLayOut.appendTo('#gridlayout');
            let CellElements: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>gridLayOut.element.querySelectorAll('.e-panel');
            setCss(CellElements);
            expect(gridLayOut.element.classList.contains('e-dashboardlayout')).toBe(true);
            expect(gridLayOut.element.childElementCount == 6).toBe(true);
            expect((<any>gridLayOut).getCellInstance('two').row).toBe(0);
            expect((<any>gridLayOut).getCellInstance('two').col).toBe(0);
            expect((<any>gridLayOut).getCellInstance('two').sizeX).toBe(2);
            expect((<any>gridLayOut).getCellInstance('two').sizeY).toBe(1);
            gridLayOut.resizePanel('two', 1, 0);
            expect((<any>gridLayOut).getCellInstance('two').row).toBe(0);
            expect((<any>gridLayOut).getCellInstance('two').col).toBe(0);
            expect((<any>gridLayOut).getCellInstance('two').sizeX).toBe(2);
            expect((<any>gridLayOut).getCellInstance('two').sizeY).toBe(1);
        });

        it('resizePanel public method test case exceeding max', () => {
            gridLayOut = new DashboardLayout({
                cellAspectRatio: 1,
                columns: 6,
                cellSpacing: [20, 20],
                panels: [{
                    id: "one",
                    sizeX: 2,
                    sizeY: 1,
                    row: 1,
                    col: 0
                },
                {
                    id: "two",
                    sizeX: 2,
                    sizeY: 1,
                    row: 0,
                    col: 0,
                    minSizeX: 2,
                    maxSizeX: 3,
                    minSizeY: 1,
                    maxSizeY: 2
                },
                {
                    id: "three",
                    sizeX: 1,
                    sizeY: 1,
                    row: 0,
                    col: 2
                },
                {
                    id: "four",
                    sizeX: 5,
                    sizeY: 1,
                    row: 2,
                    col: 0
                },
                {
                    id: "five",
                    sizeX: 3,
                    sizeY: 1,
                    row: 1,
                    col: 2
                },
                {
                    id: "six",
                    sizeX: 2,
                    sizeY: 1,
                    row: 0,
                    col: 3
                }
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            let CellElements: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>gridLayOut.element.querySelectorAll('.e-panel');
            setCss(CellElements);
            expect(gridLayOut.element.classList.contains('e-dashboardlayout')).toBe(true);
            expect(gridLayOut.element.childElementCount == 6).toBe(true);
            expect((<any>gridLayOut).getCellInstance('two').row).toBe(0);
            expect((<any>gridLayOut).getCellInstance('two').col).toBe(0);
            expect((<any>gridLayOut).getCellInstance('two').sizeX).toBe(2);
            expect((<any>gridLayOut).getCellInstance('two').sizeY).toBe(1);
            gridLayOut.resizePanel('two', 5, 2);
            expect((<any>gridLayOut).getCellInstance('two').row).toBe(0);
            expect((<any>gridLayOut).getCellInstance('two').row).toBe(0);
            expect((<any>gridLayOut).getCellInstance('two').sizeX).toBe(3);
            expect((<any>gridLayOut).getCellInstance('two').sizeY).toBe(2);
        });

        it('resizePanel public method test case exceeding columns from between', () => {
            gridLayOut = new DashboardLayout({
                cellAspectRatio: 1,
                columns: 6,
                cellSpacing: [20, 20],
                panels: [{
                    id: "one",
                    sizeX: 2,
                    sizeY: 1,
                    row: 1,
                    col: 0
                },
                {
                    id: "two",
                    sizeX: 2,
                    sizeY: 1,
                    row: 0,
                    col: 0,
                    minSizeX: 2,
                    maxSizeX: 3,
                    minSizeY: 1,
                    maxSizeY: 2
                },
                {
                    id: "three",
                    sizeX: 1,
                    sizeY: 1,
                    row: 0,
                    col: 2
                },
                {
                    id: "four",
                    sizeX: 5,
                    sizeY: 1,
                    row: 2,
                    col: 0
                },
                {
                    id: "five",
                    sizeX: 3,
                    sizeY: 1,
                    row: 1,
                    col: 2
                },
                {
                    id: "six",
                    sizeX: 2,
                    sizeY: 1,
                    row: 0,
                    col: 3
                }
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            let CellElements: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>gridLayOut.element.querySelectorAll('.e-panel');
            setCss(CellElements);
            expect(gridLayOut.element.classList.contains('e-dashboardlayout')).toBe(true);
            expect(gridLayOut.element.childElementCount == 6).toBe(true);
            expect((<any>gridLayOut).getCellInstance('five').row).toBe(1);
            expect((<any>gridLayOut).getCellInstance('five').col).toBe(2);
            expect((<any>gridLayOut).getCellInstance('five').sizeX).toBe(3);
            expect((<any>gridLayOut).getCellInstance('five').sizeY).toBe(1);
            gridLayOut.resizePanel('five', 7, 4);
            expect((<any>gridLayOut).getCellInstance('five').row).toBe(1);
            expect((<any>gridLayOut).getCellInstance('five').col).toBe(2);
            expect((<any>gridLayOut).getCellInstance('five').sizeX).toBe(4);
            expect((<any>gridLayOut).getCellInstance('five').sizeY).toBe(4);
        });

        it('Serialize public method test case', () => {
            let panelData: PanelModel[];
            panelData = [{
                id: "one",
                cssClass: "e-one",
                sizeX: 2,
                sizeY: 1,
                row: 1,
                col: 0,
            },
            {
                id: "two",
                cssClass: "e-two",
                sizeX: 2,
                sizeY: 1,
                row: 0,
                col: 0,
            },
            {
                id: "three",
                cssClass: "e-three",
                sizeX: 1,
                sizeY: 1,
                row: 0,
                col: 2,
            },
            {
                id: "four",
                cssClass: "e-four",
                sizeX: 5,
                sizeY: 1,
                row: 2,
                col: 0,
            },
            {
                id: "five",
                cssClass: "e-five",
                sizeX: 3,
                sizeY: 1,
                row: 1,
                col: 2,
            },
            {
                id: "six",
                cssClass: "e-six",
                sizeX: 2,
                sizeY: 1,
                row: 0,
                col: 3,
            }
            ];
            gridLayOut = new DashboardLayout({
                cellAspectRatio: 1,
                columns: 6,
                cellSpacing: [20, 20],
                panels: panelData,
                change: function (args: ChangeEventArgs): void {
                    expect(args.addedPanels == []).toBe(false);
                    expect(args.removedPanels.length).toBe(0);
                    expect(args.isInteracted == null).toBe(false);
                    expect(args.changedPanels.length).toBe(2);
                    expect(args.changedPanels[0].id).toBe("one");
                    expect(args.changedPanels[1].id).toBe("four");
                }
            });
            gridLayOut.appendTo('#gridlayout');
            let CellElements: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>gridLayOut.element.querySelectorAll('.e-panel');
            setCss(CellElements);
            expect(gridLayOut.element.classList.contains('e-dashboardlayout')).toBe(true);
            expect(gridLayOut.element.childElementCount == 6).toBe(true);
            let serializedValue: PanelModel = gridLayOut.serialize();
            expect(JSON.stringify(serializedValue) == '[{"id":"one","row":1,"col":0,"sizeX":2,"sizeY":1,"minSizeX":1,"minSizeY":1,"maxSizeX":null,"maxSizeY":null},{"id":"two","row":0,"col":0,"sizeX":2,"sizeY":1,"minSizeX":1,"minSizeY":1,"maxSizeX":null,"maxSizeY":null},{"id":"three","row":0,"col":2,"sizeX":1,"sizeY":1,"minSizeX":1,"minSizeY":1,"maxSizeX":null,"maxSizeY":null},{"id":"four","row":2,"col":0,"sizeX":5,"sizeY":1,"minSizeX":1,"minSizeY":1,"maxSizeX":null,"maxSizeY":null},{"id":"five","row":1,"col":2,"sizeX":3,"sizeY":1,"minSizeX":1,"minSizeY":1,"maxSizeX":null,"maxSizeY":null},{"id":"six","row":0,"col":3,"sizeX":2,"sizeY":1,"minSizeX":1,"minSizeY":1,"maxSizeX":null,"maxSizeY":null}]').toBe(true);
            let panel: PanelModel = {
                id: 'nine',
                col: 0,
                row: 1,
                sizeX: 1,
                sizeY: 1,

            }
            gridLayOut.addPanel(panel);
            serializedValue = gridLayOut.serialize();
            // expect(JSON.stringify(serializedValue) == '[{ "id": "one", "row": 2, "col": 0, "sizeX": 2, "sizeY": 1, "minSizeX": 1, "minSizeY": 1, "maxSizeX": null, "maxSizeY": null },  { "id": "two", "row": 0, "col": 0, "sizeX": 2, "sizeY": 1, "minSizeX": 1, "minSizeY": 1, "maxSizeX": null, "maxSizeY": null },{ "id": "three", "row": 0, "col": 2, "sizeX": 1, "sizeY": 1, "minSizeX": 1, "minSizeY": 1, "maxSizeX": null, "maxSizeY": null },{ "id": "four", "row": 3, "col": 0, "sizeX": 5, "sizeY": 1, "minSizeX": 1, "minSizeY": 1, "maxSizeX": null, "maxSizeY": null },{ "id": "five", "row": 1, "col": 2, "sizeX": 3, "sizeY": 1, "minSizeX": 1, "minSizeY": 1, "maxSizeX": null, "maxSizeY": null },{ "id": "six", "row": 0, "col": 3, "sizeX": 2, "sizeY": 1, "minSizeX": 1, "minSizeY": 1, "maxSizeX": null, "maxSizeY": null },{ "id": "nine", "row": 1, "col": 0, "sizeX": 1, "sizeY": 1, "minSizeX": 1, "minSizeY": 1 }]').toBe(true);
        });

        it('resizePanel public method test case', () => {
            gridLayOut = new DashboardLayout({
                cellAspectRatio: 1,
                columns: 6,
                cellSpacing: [20, 20],
                panels: panelObject
            });
            gridLayOut.appendTo('#gridlayout');
            let CellElements: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>gridLayOut.element.querySelectorAll('.e-panel');
            setCss(CellElements);
            expect(gridLayOut.element.classList.contains('e-dashboardlayout')).toBe(true);
            expect(gridLayOut.element.childElementCount == 6).toBe(true);
            expect((<HTMLElement>gridLayOut.element.querySelector('#two')).getAttribute('data-row')).toBe('0');
            expect((<HTMLElement>gridLayOut.element.querySelector('#two')).getAttribute('data-col')).toBe('0');
            expect((<HTMLElement>gridLayOut.element.querySelector('#two')).getAttribute('data-sizeX')).toBe('2');
            expect((<HTMLElement>gridLayOut.element.querySelector('#two')).getAttribute('data-sizeY')).toBe('1');
            gridLayOut.resizePanel('two', 4, 4);
            expect((<HTMLElement>gridLayOut.element.querySelector('#two')).getAttribute('data-row')).toBe('0');
            expect((<HTMLElement>gridLayOut.element.querySelector('#two')).getAttribute('data-col')).toBe('0');
            expect((<HTMLElement>gridLayOut.element.querySelector('#two')).getAttribute('data-sizeX')).toBe('4');
            expect((<HTMLElement>gridLayOut.element.querySelector('#two')).getAttribute('data-sizeY')).toBe('4');
        });


        it('removePanel public method test case', () => {
            gridLayOut = new DashboardLayout({
                cellAspectRatio: 1,
                columns: 6,
                cellSpacing: [20, 20],
                panels: [{
                    id: "one",
                    cssClass: "e-one",

                    sizeX: 2,
                    sizeY: 1,
                    row: 1,
                    col: 0,

                    content: ("#template1")
                },
                {
                    id: "two",
                    cssClass: "e-two",

                    sizeX: 2,
                    sizeY: 1,
                    row: 0,
                    col: 0,
                    content: ("#template2")
                },
                {
                    id: "three",
                    cssClass: "e-three",

                    sizeX: 1,
                    sizeY: 1,
                    row: 0,
                    col: 2,
                    content: ("#template2")
                },
                {
                    id: "four",
                    cssClass: "e-four",

                    sizeX: 5,
                    sizeY: 1,
                    row: 2,
                    col: 0,
                    content: ("#template1")
                },
                {
                    id: "five",
                    cssClass: "e-five",

                    sizeX: 3,
                    sizeY: 1,
                    row: 1,
                    col: 2,
                    content: ("#template1")
                },
                {
                    id: "six",
                    cssClass: "e-six",

                    sizeX: 2,
                    sizeY: 1,
                    row: 0,
                    col: 3,
                    content: ("#template2")
                }
                ],
                change: function (args: ChangeEventArgs): void {
                    expect(args.removedPanels[0].id).toBe("two");
                    expect(args.addedPanels.length).toBe(0);
                    expect(args.changedPanels.length).toBe(1);
                    expect(args.changedPanels[0].id).toBe("one");
                }
            });
            gridLayOut.appendTo('#gridlayout');
            let CellElements: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>gridLayOut.element.querySelectorAll('.e-panel');
            setCss(CellElements);
            expect(gridLayOut.element.classList.contains('e-dashboardlayout')).toBe(true);
            expect(gridLayOut.element.childElementCount == 6).toBe(true);
            expect((<HTMLElement>gridLayOut.element.querySelector('#two')).getAttribute('data-sizeX')).toBe('2');
            // expect((<HTMLElement>gridLayOut.element.querySelector('#two')).getAttribute('data-sizeY')).toBe('1');
            gridLayOut.removePanel('two');
            gridLayOut.dataBind();
            expect((<HTMLElement>gridLayOut.element.querySelector('#two'))).toBe(null);
        });
        it('removeAllPanel public method test case', () => {
            gridLayOut = new DashboardLayout({
                cellAspectRatio: 1,
                columns: 6,
                cellSpacing: [20, 20],
                panels: panelObject,
                change: function (args: ChangeEventArgs) {
                    expect(args.isInteracted).toBe(false);
                    expect(args.changedPanels.length === 0).toBe(true);
                    expect(args.addedPanels.length).toBe(0);
                    expect(args.removedPanels.length).toBe(6);
                }
            });
            gridLayOut.appendTo('#gridlayout');
            let CellElements: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>gridLayOut.element.querySelectorAll('.e-panel');
            setCss(CellElements);
            expect(gridLayOut.element.classList.contains('e-dashboardlayout')).toBe(true);
            expect(gridLayOut.element.childElementCount == 6).toBe(true);
            expect((<HTMLElement>gridLayOut.element.querySelector('#two')).getAttribute('data-sizeX')).toBe('2');
            expect((<HTMLElement>gridLayOut.element.querySelector('#two')).getAttribute('data-sizeY')).toBe('1');
            gridLayOut.removeAll();
            expect((<HTMLElement>gridLayOut.element.querySelector('#two'))).toBe(null);
            expect((<HTMLElement>gridLayOut.element.querySelector('#one'))).toBe(null);
            expect((<HTMLElement>gridLayOut.element.querySelector('#five'))).toBe(null);
        });
        it('addPanel public method test case', () => {
            gridLayOut = new DashboardLayout({
                cellAspectRatio: 1,
                columns: 6,
                cellSpacing: [20, 20],
                panels: panelObject
            });
            gridLayOut.appendTo('#gridlayout');
            (<any>gridLayOut.collisionCheck) = [];
            let CellElements: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>gridLayOut.element.querySelectorAll('.e-panel');
            setCss(CellElements);
            expect(gridLayOut.element.classList.contains('e-dashboardlayout')).toBe(true);
            expect(gridLayOut.element.childElementCount == 6).toBe(true);
            expect((<HTMLElement>gridLayOut.element.querySelector('#two')).getAttribute('data-sizeX')).toBe('2');
            expect((<HTMLElement>gridLayOut.element.querySelector('#two')).getAttribute('data-sizeY')).toBe('1');
            gridLayOut.removeAll();
            gridLayOut.dataBind();
            expect((<HTMLElement>gridLayOut.element.querySelector('#two'))).toBe(null);
            expect((<HTMLElement>gridLayOut.element.querySelector('#one'))).toBe(null);
            expect((<HTMLElement>gridLayOut.element.querySelector('#five'))).toBe(null);
        });
        it('adding panels with different height and width using addPanel method test case', () => {
            gridLayOut = new DashboardLayout({
                cellAspectRatio: 1,
                columns: 3,
                panels: newPanels
            });
            gridLayOut.appendTo('#gridlayout');
            (<any>gridLayOut.collisionCheck) = [];
            let CellElements: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>gridLayOut.element.querySelectorAll('.e-panel');
            setCss(CellElements);
            expect(gridLayOut.element.classList.contains('e-dashboardlayout')).toBe(true);
            expect(gridLayOut.element.childElementCount == 3).toBe(true);
            gridLayOut.addPanel(newPanels[0]);
            expect((<HTMLElement>gridLayOut.element.querySelector('#one')).getAttribute('data-row')).toBe('0');
            expect((<HTMLElement>gridLayOut.element.querySelector('#one')).getAttribute('data-col')).toBe('0');
            gridLayOut.addPanel(newPanels[1]);
            expect((<HTMLElement>gridLayOut.element.querySelector('#one')).getAttribute('data-row')).toBe('1');
            expect((<HTMLElement>gridLayOut.element.querySelector('#one')).getAttribute('data-col')).toBe('0');
            expect((<HTMLElement>gridLayOut.element.querySelector('#two')).getAttribute('data-row')).toBe('0');
            expect((<HTMLElement>gridLayOut.element.querySelector('#two')).getAttribute('data-col')).toBe('0');
            gridLayOut.addPanel(newPanels[2]);
            expect((<HTMLElement>gridLayOut.element.querySelector('#three')).getAttribute('data-row')).toBe('0');
            expect((<HTMLElement>gridLayOut.element.querySelector('#three')).getAttribute('data-col')).toBe('0');
            expect((<HTMLElement>gridLayOut.element.querySelector('#two')).getAttribute('data-row')).toBe('2');
            expect((<HTMLElement>gridLayOut.element.querySelector('#two')).getAttribute('data-col')).toBe('0');
            expect((<HTMLElement>gridLayOut.element.querySelector('#one')).getAttribute('data-row')).toBe('3');
            expect((<HTMLElement>gridLayOut.element.querySelector('#one')).getAttribute('data-col')).toBe('0');
        });
        it('Responsive layout test case', () => {
            let gridLayOut: any = new DashboardLayout({
                cellAspectRatio: 1,
                columns: 6,
                cellSpacing: [20, 20],
                panels: panelObject
            });
            gridLayOut.appendTo('#gridlayout');
            let CellElements: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>gridLayOut.element.querySelectorAll('.e-panel');
            setCss(CellElements);
            expect(gridLayOut.element.classList.contains('e-dashboardlayout')).toBe(true);
            expect(gridLayOut.element.childElementCount == 6).toBe(true);
            gridLayOut.refresh();
        });
        it('Responsive layout with px values test case', () => {
            let gridLayOut: any = new DashboardLayout({
                cellAspectRatio: 1,
                columns: 6,
                cellSpacing: [20, 20],
                panels: panelObject
            });
            gridLayOut.appendTo('#gridlayout');
            let CellElements: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>gridLayOut.element.querySelectorAll('.e-panel');
            setCss(CellElements);
            expect(gridLayOut.element.classList.contains('e-dashboardlayout')).toBe(true);
            expect(gridLayOut.element.childElementCount == 6).toBe(true);
            gridLayOut.mediaQuery = "max-width: 1920px";
            gridLayOut.dataBind();
            gridLayOut.refresh();
        });

    });
    describe('layout testing', () => {
        beforeEach(() => {
            ele = createElement('div', { id: 'gridlayout' });
            let parentEle: HTMLElement = createElement('div', { id: 'container' });
            parentEle.style.width = '1264px';
            parentEle.appendChild(ele);
            document.body.appendChild(parentEle);
            setStyle(ele, { 'position': 'relative' });
            let template1: HTMLElement = createElement('script', { id: 'template1' });
            template1.setAttribute("type", "text/x-template");
            let UL1: HTMLElement = createElement('ul');
            for (let i = 0; i < 3; i++) {
                let LI: HTMLElement = createElement('li');
                LI.innerHTML = i.toString();
                UL1.appendChild(LI)
            }
            template1.appendChild(UL1);
            document.body.appendChild(template1);
            let template2: HTMLElement = createElement('script', { id: 'template2' });
            template2.setAttribute("type", "text/x-template");
            let UL2: HTMLElement = createElement('ul');
            for (let i = 0; i < 3; i++) {
                let LI: HTMLElement = createElement('li');
                LI.innerHTML = i.toString();
                UL2.appendChild(LI)
            }
            template2.appendChild(UL2);
            document.body.appendChild(template2);
            let template3: HTMLElement = createElement('script');
            template3.classList.add("headertemp");
            template2.setAttribute("type", "text/x-template");
            let UL3: HTMLElement = createElement('ul');
            for (let i = 0; i < 3; i++) {
                let LI: HTMLElement = createElement('li');
                LI.innerHTML = i.toString();
                UL3.appendChild(LI)
            }
            template3.appendChild(UL2);
            document.body.appendChild(template3);
        });
        afterEach(() => {
            if (gridLayOut) {
                gridLayOut.destroy();
                detach(ele);
                // detach(parentEle);
            }
        });
        it('layout pixel testing', () => {
            let gridLayOut: DashboardLayout = new DashboardLayout({

                columns: 12,
                cellSpacing: [5, 5],
                panels: [{
                    id: "one",
                    cssClass: "e-one",

                    sizeX: 2,
                    sizeY: 1,
                    row: 1,
                    col: 0,

                    content: ("#template1")
                },
                {
                    id: "two",
                    cssClass: "e-two",

                    sizeX: 2,
                    sizeY: 1,
                    row: 0,
                    col: 0,
                    content: ("#template2")
                },
                {
                    id: "three",
                    cssClass: "e-three",

                    sizeX: 1,
                    sizeY: 1,
                    row: 0,
                    col: 2,
                    content: ("#template2")
                },
                {
                    id: "four",
                    cssClass: "e-four",

                    sizeX: 5,
                    sizeY: 1,
                    row: 2,
                    col: 0,
                    content: ("#template1")
                },
                {
                    id: "five",
                    cssClass: "e-five",

                    sizeX: 3,
                    sizeY: 1,
                    row: 1,
                    col: 2,
                    content: ("#template1")
                },
                {
                    id: "six",
                    cssClass: "e-six",

                    sizeX: 2,
                    sizeY: 1,
                    row: 0,
                    col: 3,
                    content: ("#template2")
                }
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            let CellElements: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>gridLayOut.element.querySelectorAll('.e-panel');
            setCss(CellElements);
            expect(gridLayOut.element.classList.contains('e-dashboardlayout')).toBe(true);
            expect(gridLayOut.element.childElementCount == 6).toBe(true);
            expect((<HTMLElement>gridLayOut.element.querySelector('#one')).style.left == "0px").toBe(true);
            expect((<HTMLElement>gridLayOut.element.querySelector('#one')).style.top).toBe('105.75px');
            expect((<HTMLElement>gridLayOut.element.querySelector('#two')).style.left == "0px").toBe(true);
            expect((<HTMLElement>gridLayOut.element.querySelector('#two')).style.top == "0px").toBe(true);
            expect((<HTMLElement>gridLayOut.element.querySelector('#three')).style.left == "211.5px").toBe(true);
            expect((<HTMLElement>gridLayOut.element.querySelector('#three')).style.top == "0px").toBe(true);
            expect((<HTMLElement>gridLayOut.element.querySelector('#four')).style.left == "0px").toBe(true);
            expect((<HTMLElement>gridLayOut.element.querySelector('#four')).style.top).toBe('211.5px');
            expect((<HTMLElement>gridLayOut.element.querySelector('#five')).style.left == "211.5px").toBe(true);
            expect((<HTMLElement>gridLayOut.element.querySelector('#five')).style.top).toBe('105.75px');
            expect((<HTMLElement>gridLayOut.element.querySelector('#six')).style.left == "317.25px").toBe(true);
            expect((<HTMLElement>gridLayOut.element.querySelector('#six')).style.top == "0px").toBe(true);

        });

        it('layout pixel testing with RTL', () => {
            let gridLayOut: DashboardLayout = new DashboardLayout({

                columns: 12,
                cellSpacing: [5, 5],
                enableRtl: true,
                panels: [{
                    id: "one",
                    cssClass: "e-one",

                    sizeX: 2,
                    sizeY: 1,
                    row: 1,
                    col: 0,
                    content: ("#template1")
                },
                {
                    id: "two",
                    cssClass: "e-two",

                    sizeX: 2,
                    sizeY: 1,
                    row: 0,
                    col: 0,
                    content: ("#template2")
                },
                {
                    id: "three",
                    cssClass: "e-three",

                    sizeX: 1,
                    sizeY: 1,
                    row: 0,
                    col: 2,
                    content: ("#template2")
                },
                {
                    id: "four",
                    cssClass: "e-four",

                    sizeX: 5,
                    sizeY: 1,
                    row: 2,
                    col: 0,
                    content: ("#template1")
                },
                {
                    id: "five",
                    cssClass: "e-five",

                    sizeX: 3,
                    sizeY: 1,
                    row: 1,
                    col: 2,
                    content: ("#template1")
                },
                {
                    id: "six",
                    cssClass: "e-six",

                    sizeX: 2,
                    sizeY: 1,
                    row: 0,
                    col: 3,
                    content: ("#template2")
                }
                ]
            });
            gridLayOut.appendTo('#gridlayout');

            let CellElements: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>gridLayOut.element.querySelectorAll('.e-panel');
            setCss(CellElements);
            expect(gridLayOut.element.classList.contains('e-dashboardlayout')).toBe(true);
            expect(gridLayOut.element.childElementCount == 6).toBe(true);
            expect((<HTMLElement>gridLayOut.element.querySelector('#one')).classList.contains('e-rtl')).toBe(true);
            expect((<HTMLElement>gridLayOut.element.querySelector('#one')).style.left == "0px").toBe(true);
            expect((<HTMLElement>gridLayOut.element.querySelector('#one')).style.top).toBe('105.75px');
            expect((<HTMLElement>gridLayOut.element.querySelector('#two')).classList.contains('e-rtl')).toBe(true);
            expect((<HTMLElement>gridLayOut.element.querySelector('#two')).style.left == "0px").toBe(true);
            expect((<HTMLElement>gridLayOut.element.querySelector('#two')).style.top == "0px").toBe(true);
            expect((<HTMLElement>gridLayOut.element.querySelector('#three')).classList.contains('e-rtl')).toBe(true);
            expect((<HTMLElement>gridLayOut.element.querySelector('#three')).style.left == "211.5px").toBe(true);
            expect((<HTMLElement>gridLayOut.element.querySelector('#three')).style.top == "0px").toBe(true);
            expect((<HTMLElement>gridLayOut.element.querySelector('#four')).classList.contains('e-rtl')).toBe(true);
            expect((<HTMLElement>gridLayOut.element.querySelector('#four')).style.left == "0px").toBe(true);
            expect((<HTMLElement>gridLayOut.element.querySelector('#four')).style.top).toBe('211.5px');
            expect((<HTMLElement>gridLayOut.element.querySelector('#five')).classList.contains('e-rtl')).toBe(true);
            expect((<HTMLElement>gridLayOut.element.querySelector('#five')).style.left == "211.5px").toBe(true);
            expect((<HTMLElement>gridLayOut.element.querySelector('#five')).style.top).toBe('105.75px');
            expect((<HTMLElement>gridLayOut.element.querySelector('#six')).classList.contains('e-rtl')).toBe(true);
            expect((<HTMLElement>gridLayOut.element.querySelector('#six')).style.left == "317.25px").toBe(true);
            expect((<HTMLElement>gridLayOut.element.querySelector('#six')).style.top == "0px").toBe(true);
        });

        it('layout body content and header title without header template testing', () => {
            let gridLayOut: DashboardLayout = new DashboardLayout({

                columns: 12,
                cellSpacing: [5, 5],
                panels: [{
                    id: "one",
                    cssClass: "e-one",

                    sizeX: 2,
                    sizeY: 1,
                    row: 2,
                    col: 1,
                    content: ("#template1")
                },
                {
                    id: "two",
                    cssClass: "e-two",

                    sizeX: 2,
                    sizeY: 1,
                    row: 1,
                    col: 1,
                    content: ("#template2")
                },
                {
                    id: "three",
                    cssClass: "e-three",

                    sizeX: 1,
                    sizeY: 1,
                    row: 1,
                    col: 3,
                    content: ("#template2")
                },
                {
                    id: "four",
                    cssClass: "e-four",

                    sizeX: 5,
                    sizeY: 1,
                    row: 3,
                    col: 1,
                    content: ("#template1")
                },
                {
                    id: "five",
                    cssClass: "e-five",

                    sizeX: 3,
                    sizeY: 1,
                    row: 2,
                    col: 3,
                    content: ("#template1")
                },
                {
                    cssClass: "e-six",

                    sizeX: 2,
                    sizeY: 1,
                    row: 1,
                    col: 4,
                    content: ("#template2")
                }
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            // expect(gridLayOut.element.querySelector('#one').querySelector('.e-panel-content').innerHTML == document.getElementById("template1").innerHTML).toBe(true);
            // expect(gridLayOut.element.querySelector('#one').querySelector('.e-panel-header').innerHTML == "Header1").toBe(true);
            // expect(gridLayOut.element.querySelector('#two').querySelector('.e-panel-content').innerHTML == document.getElementById("template2").innerHTML).toBe(true);
            // expect(gridLayOut.element.querySelector('#two').querySelector('.e-panel-header').innerHTML == "Header2").toBe(true);
            // expect(gridLayOut.element.querySelector('#three').querySelector('.e-panel-content').innerHTML == document.getElementById("template2").innerHTML).toBe(true);
            // expect(gridLayOut.element.querySelector('#three').querySelector('.e-panel-header').innerHTML == "Header3").toBe(true);
            // expect(gridLayOut.element.querySelector('#four').querySelector('.e-panel-content').innerHTML == document.getElementById("template1").innerHTML).toBe(true);
            // expect(gridLayOut.element.querySelector('#four').querySelector('.e-panel-header').innerHTML == "Header4").toBe(true);
            // expect(gridLayOut.element.querySelector('#five').querySelector('.e-panel-content').innerHTML == document.getElementById("template1").innerHTML).toBe(true);
            // expect(gridLayOut.element.querySelector('#five').querySelector('.e-panel-header').innerHTML == "Header5").toBe(true);
            // expect(gridLayOut.element.querySelector('.e-six').querySelector('.e-panel-content').innerHTML == document.getElementById("template2").innerHTML).toBe(true);
            // expect(gridLayOut.element.querySelector('.e-six').querySelector('.e-panel-header').innerHTML == "Header6").toBe(true);

        });

        it('layout pixel testing mediaQuery', function () {
            let gridLayOut = new DashboardLayout({
                columns: 12,
                cellSpacing: [5, 5],
                mediaQuery: 'min-width: 600px',
                panels: [{
                    id: "one",
                    cssClass: "e-one",

                    sizeX: 2,
                    sizeY: 1,
                    row: 1,
                    col: 0,


                    content: '#template1'

                },
                {
                    id: "two",
                    cssClass: "e-two",

                    sizeX: 2,
                    sizeY: 1,
                    row: 0,
                    col: 0,
                    content: ("#template2")
                },
                {
                    id: "three",
                    cssClass: "e-three",

                    sizeX: 1,
                    sizeY: 1,
                    row: 0,
                    col: 2,

                    content: '#template2'

                },
                {
                    id: "four",
                    cssClass: "e-four",

                    sizeX: 5,
                    sizeY: 1,
                    row: 2,
                    col: 0,

                    content: '#template1'

                },
                {
                    id: "five",
                    cssClass: "e-five",

                    sizeX: 3,
                    sizeY: 1,
                    row: 1,
                    col: 2,

                    content: '#template1'

                },
                {
                    id: "six",
                    cssClass: "e-six",

                    sizeX: 2,
                    sizeY: 1,
                    row: 0,
                    col: 3,

                    content: '#template1'

                }
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            let CellElements: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>gridLayOut.element.querySelectorAll('.e-panel');
            setCss(CellElements);
            expect(gridLayOut.element.classList.contains('e-dashboardlayout')).toBe(true);
            expect(gridLayOut.element.childElementCount == 6).toBe(true);
            expect((<any>gridLayOut).getCellInstance('two').row).toBe(0);
            expect((<any>gridLayOut).getCellInstance('three').row).toBe(1);
            expect((<any>gridLayOut).getCellInstance('six').row).toBe(2);
            expect((<any>gridLayOut).getCellInstance('one').row).toBe(3);
            expect((<any>gridLayOut).getCellInstance('five').row).toBe(4);
            expect((<any>gridLayOut).getCellInstance('four').row).toBe(5);
        });

        it('layout body content and header title with header template testing', () => {
            let gridLayOut: DashboardLayout = new DashboardLayout({

                columns: 12,
                cellSpacing: [5, 5],
                panels: [{
                    id: "one",
                    cssClass: "e-one",
                    header: '.headertemp',
                    sizeX: 2,
                    sizeY: 1,
                    row: 2,
                    col: 1,
                    content: ("#template1")
                },
                {
                    id: "two",
                    cssClass: "e-two",

                    sizeX: 2,
                    sizeY: 1,
                    row: 1,
                    col: 1,
                    content: ("#template2")
                },
                {
                    id: "three",
                    cssClass: "e-three",

                    sizeX: 1,
                    sizeY: 1,
                    row: 1,
                    col: 3,
                    content: ("#template2")
                },
                {
                    id: "four",
                    cssClass: "e-four",

                    sizeX: 5,
                    sizeY: 1,
                    row: 3,
                    col: 1,
                    content: ("#template1")
                },
                {
                    id: "five",
                    cssClass: "e-five",

                    sizeX: 3,
                    sizeY: 1,
                    row: 2,
                    col: 3,
                    content: ("#template1")
                },
                {
                    id: "six",
                    cssClass: "e-six",
                    header: '.headertemp',
                    sizeX: 2,
                    sizeY: 1,
                    row: 1,
                    col: 4,
                    content: ("#template2")
                }
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            // expect(gridLayOut.element.querySelector('#one').querySelector('.e-panel-content').innerHTML == document.getElementById("template1").innerHTML).toBe(true);
            // expect(gridLayOut.element.querySelector('#one').querySelector('.e-header-text').innerHTML == "Header1").toBe(true);
            // expect(gridLayOut.element.querySelector('#one').querySelector('.e-header-template').innerHTML == document.querySelector('.headertemp').innerHTML).toBe(true);
            // expect(gridLayOut.element.querySelector('#two').querySelector('.e-panel-content').innerHTML == document.getElementById("template2").innerHTML).toBe(true);
            // expect(gridLayOut.element.querySelector('#two').querySelector('.e-panel-header').innerHTML == "Header2").toBe(true);
            // expect(gridLayOut.element.querySelector('#three').querySelector('.e-panel-content').innerHTML == document.getElementById("template2").innerHTML).toBe(true);
            // expect(gridLayOut.element.querySelector('#three').querySelector('.e-panel-header').innerHTML == "Header3").toBe(true);
            // expect(gridLayOut.element.querySelector('#four').querySelector('.e-panel-content').innerHTML == document.getElementById("template1").innerHTML).toBe(true);
            // expect(gridLayOut.element.querySelector('#four').querySelector('.e-panel-header').innerHTML == "Header4").toBe(true);
            // expect(gridLayOut.element.querySelector('#five').querySelector('.e-panel-content').innerHTML == document.getElementById("template1").innerHTML).toBe(true);
            // expect(gridLayOut.element.querySelector('#five').querySelector('.e-panel-header').innerHTML == "Header5").toBe(true);
            // expect(gridLayOut.element.querySelector('#six').querySelector('.e-panel-content').innerHTML == document.getElementById("template2").innerHTML).toBe(true);
            // expect(gridLayOut.element.querySelector('#six').querySelector('.e-header-text').innerHTML == "Header6").toBe(true);
            // expect(gridLayOut.element.querySelector('#six').querySelector('.e-header-template').innerHTML == document.querySelector('.headertemp').innerHTML).toBe(true);
            gridLayOut.getPersistData();

        });

        it('layout testing with cell size as percentage values', () => {
            let gridLayOut: DashboardLayout = new DashboardLayout({

                columns: 12,
                cellSpacing: [5, 5],
                allowDragging: true,
                draggableHandle: 'Header',
                panels: [{
                    id: "one",
                    cssClass: "e-one",
                    header: '.headertemp',
                    sizeX: 2,
                    sizeY: 1,
                    row: 2,
                    col: 1,
                    content: ("#template1")
                },
                {
                    id: "two",
                    cssClass: "e-two",

                    sizeX: 2,
                    sizeY: 1,
                    row: 1,
                    col: 1,
                    content: ("#template2")
                },
                {
                    id: "three",
                    cssClass: "e-three",

                    sizeX: 1,
                    sizeY: 1,
                    row: 1,
                    col: 3,
                    content: ("#template2")
                },
                {
                    id: "four",
                    cssClass: "e-four",

                    sizeX: 5,
                    sizeY: 1,
                    row: 3,
                    col: 1,
                    content: ("#template1")
                },
                {
                    id: "five",
                    cssClass: "e-five",

                    sizeX: 3,
                    sizeY: 1,
                    row: 2,
                    col: 3,
                    content: ("#template1")
                },
                {
                    id: "six",
                    cssClass: "e-six",
                    header: '.headertemp',
                    sizeX: 2,
                    sizeY: 1,
                    row: 1,
                    col: 4,
                    content: ("#template2")
                }
                ]
            });
            gridLayOut.appendTo('#gridlayout');
        });
    });

    describe('Floating panel testing', () => { 
        beforeEach(() => {
            ele = createElement('div', { id: 'gridlayout' });
            let parentEle: HTMLElement = createElement('div', { id: 'container' });
            parentEle.style.width = '1264px';
            parentEle.appendChild(ele);
            document.body.appendChild(parentEle);
            setStyle(ele, { 'position': 'relative' });
           
        });
        afterEach(() => {
            if (gridLayOut) {
                gridLayOut.destroy();
                detach(ele);
            }
        });
        it('when scroll bar is in middle of the page', () => {
            let gridLayOut: DashboardLayout = new DashboardLayout({
                allowFloating: false,
                cellSpacing: [20, 20],
                columns: 12,
                showGridLines: true,
                mediaQuery: "max-width: 767px",
                panels: [
                  {
                      id: "1",
                    sizeX: 2,
                    sizeY: 2,
                    row: 0,
                    col: 0,
                    header: "<div>Panel 1</div>",
                    content: "<div></div>"
                  },
                  {
                    id: "2",
                    sizeX: 2,
                    sizeY: 2,
                    row: 0,
                    col: 2,
                    header: "<div>Panel 2</div>",
                    content: "<div></div>"
                  },
                  {
                    id: "3",
                    sizeX: 2,
                    sizeY: 2,
                    row: 0,
                    col: 4,
                    header: "<div>Panel 3</div>",
                    content: "<div></div>"
                  },
                  {
                    id: "4",
                    sizeX: 4,
                    sizeY: 2,
                    row: 2,
                    col: 0,
                    header: "<div>Panel 4</div>",
                    content: "<div></div>"
                  },
                  {
                    id: "5",
                    sizeX: 2,
                    sizeY: 2,
                    row: 2,
                    col: 4,
                    header: "<div>Panel 5</div>",
                    content: "<div></div>"
                  },
                  {
                    id: "6",
                    sizeX: 2,
                    sizeY: 2,
                    row: 3,
                    col: 4,
                    header: "<div>Panel 5-9</div>",
                    content: "<div></div>"
                  },
                  {
                    id: "7",
                    sizeX: 2,
                    sizeY: 2,
                    row: 5,
                    col: 5,
                    header: "<div>Panel 5-8</div>",
                    content: "<div></div>"
                  },
                  {
                    id: "8",
                    sizeX: 2,
                    sizeY: 2,
                    row: 5,
                    col: 2,
                    header: "<div>Panel 5-7</div>",
                    content: "<div></div>"
                  },
                  {
                    id: "9",
                    sizeX: 2,
                    sizeY: 2,
                    row: 5,
                    col: 1,
                    header: "<div>Panel 5-6</div>",
                    content: "<div></div>"
                  },
                  {
                    id: "10",
                    sizeX: 2,
                    sizeY: 2,
                    row: 5,
                    col: 4,
                    header: "<div>Panel 5-5</div>",
                    content: "<div></div>"
                  },
                  {
                    id: "11",
                    sizeX: 2,
                    sizeY: 2,
                    row: 3,
                    col: 5,
                    header: "<div>Panel 5-4</div>",
                    content: "<div></div>"
                  },
                  {
                    id: "12",
                    sizeX: 2,
                    sizeY: 2,
                    row: 3,
                    col: 1,
                    header: "<div>Panel 5-3</div>",
                    content: "<div></div>"
                  },
                  {
                    id: "13",
                    sizeX: 2,
                    sizeY: 2,
                    row: 4,
                    col: 3,
                    header: "<div>Panel 5-2</div>",
                    content: "<div></div>"
                  },
                  {
                    id: "14",
                    sizeX: 2,
                    sizeY: 2,
                    row: 4,
                    col: 4,
                    header: "<div>Panel 5 - 1</div>",
                    content: "<div></div>"
                  }
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            let movingElemnt: HTMLElement = document.getElementById('7');
            let targetElemnt: HTMLElement = document.getElementById('8');
            expect((<any>gridLayOut).getCellInstance('7').row == 5).toBe(true);
            expect((<any>gridLayOut).getCellInstance('8').row == 10).toBe(true);
            let mousedown: any = getEventObject('MouseEvents', 'mousedown', movingElemnt, targetElemnt, 0, 875);
            EventHandler.trigger(<HTMLElement>movingElemnt, 'mousedown', mousedown);
            let mousemove: any = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 110, 875);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
            mousemove = setMouseCordinates(mousemove, 0, 750);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = setMouseCordinates(mousemove, 0, 750);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            let mouseup: any = getEventObject('MouseEvents', 'mouseup', movingElemnt, targetElemnt);
            mouseup.type = 'mouseup';
            mouseup.currentTarget = document;
            EventHandler.trigger(<any>(document), 'mouseup', mouseup);
            // expect((<any>gridLayOut).getCellInstance('7').row).toBe(10);
        });
    });

    describe('left and right allowPushing of panels testing', () => {
        it('Right side allowPushing of default case of sizeX and sieY values as 1', () => {
            let ele: HTMLElement = createElement('div', { id: 'gridlayout' });
            let parentEle: HTMLElement = createElement('div', { id: 'container' });
            parentEle.style.width = '1264px';
            parentEle.appendChild(ele);
            document.body.appendChild(parentEle);
            let gridLayOut = new DashboardLayout({

                columns: 12,
                cellSpacing: [5, 5],
                panels: [{ id: 'one', sizeX: 1, sizeY: 1, row: 0, col: 0 },
                { id: 'two', sizeX: 1, sizeY: 1, row: 0, col: 0 }
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            let CellElements: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>gridLayOut.element.querySelectorAll('.e-panel');
            setCss(CellElements);
            expect((<any>gridLayOut).getCellInstance('one').col == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('one').col == 0).toBe(false);
            expect((<any>gridLayOut).getCellInstance('one').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('two').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('two').row == 0).toBe(true);
            gridLayOut.destroy();
            detach(ele);
        });

        it('inital stack mode and adding panel', () => {
            let ele: HTMLElement = createElement('div', { id: 'gridlayout' });
            let parentEle: HTMLElement = createElement('div', { id: 'container' });
            parentEle.style.width = '1264px';
            parentEle.appendChild(ele);
            document.body.appendChild(parentEle);
            let gridLayOut = new DashboardLayout({

                columns: 1,
                cellSpacing: [5, 5],
                panels: [{ id: 'one', sizeX: 1, sizeY: 1, row: 0, col: 0 },
                { id: 'two', sizeX: 1, sizeY: 1, row: 0, col: 0 }
                ],
                mediaQuery: "max-width: 2000px"
            });
            gridLayOut.appendTo('#gridlayout');
            let CellElements: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>gridLayOut.element.querySelectorAll('.e-panel');
            setCss(CellElements);
            expect((<any>gridLayOut).getCellInstance('one').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('one').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('two').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('two').row == 1).toBe(true);
            let panel: any = [{ id: 'three', sizeX: 1, sizeY: 1, row: 2, col: 0 }];
            gridLayOut.addPanel(panel[0]);
            gridLayOut.destroy();
            detach(ele);
        });

        it('Right side allowPushing of default case of sizeX and sieY values as 1 with multiple rows', () => {
            let ele: HTMLElement = createElement('div', { id: 'gridlayout' });
            let parentEle: HTMLElement = createElement('div', { id: 'container' });
            parentEle.style.width = '1264px';
            parentEle.appendChild(ele);
            document.body.appendChild(parentEle);
            let gridLayOut = new DashboardLayout({

                columns: 12,
                cellSpacing: [5, 5],
                allowFloating: false,
                panels: [{ id: 'one', sizeX: 1, sizeY: 1, row: 0, col: 0 },
                { id: 'two', sizeX: 1, sizeY: 1, row: 0, col: 0 },
                { id: 'three', sizeX: 1, sizeY: 1, row: 1, col: 2 },
                { id: 'four', sizeX: 1, sizeY: 1, row: 1, col: 2 }
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            let CellElements: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>gridLayOut.element.querySelectorAll('.e-panel');
            setCss(CellElements);
            expect((<any>gridLayOut).getCellInstance('one').col == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('one').col == 0).toBe(false);
            expect((<any>gridLayOut).getCellInstance('one').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('two').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('two').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('three').col == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('three').col == 2).toBe(false);
            expect((<any>gridLayOut).getCellInstance('three').row == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('four').col == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('four').row == 1).toBe(true);
            gridLayOut.mediaQuery = "max-width: 2000px"
            gridLayOut.destroy();
            detach(ele);
        });

        it('Left side allowPushing of default case of sizeX and sieY values as 1', () => {
            let ele: HTMLElement = createElement('div', { id: 'gridlayout' });
            let parentEle: HTMLElement = createElement('div', { id: 'container' });
            parentEle.style.width = '1264px';
            parentEle.appendChild(ele);
            document.body.appendChild(parentEle);
            let gridLayOut = new DashboardLayout({

                columns: 12,
                cellSpacing: [5, 5],
                panels: [{ id: 'one', sizeX: 1, sizeY: 1, row: 0, col: 7 },
                { id: 'two', sizeX: 1, sizeY: 1, row: 0, col: 7 }
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            let CellElements: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>gridLayOut.element.querySelectorAll('.e-panel');
            setCss(CellElements);
            expect((<any>gridLayOut).getCellInstance('one').col == 6).toBe(true);
            expect((<any>gridLayOut).getCellInstance('one').col == 7).toBe(false);
            expect((<any>gridLayOut).getCellInstance('one').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('two').col == 7).toBe(true);
            expect((<any>gridLayOut).getCellInstance('two').row == 0).toBe(true);
            gridLayOut.destroy();
            detach(ele);
        });

        it('Left side allowPushing of default case of sizeX and sieY values as 1 with multiple rows', () => {
            let ele: HTMLElement = createElement('div', { id: 'gridlayout' });
            let parentEle: HTMLElement = createElement('div', { id: 'container' });
            parentEle.style.width = '1264px';
            parentEle.appendChild(ele);
            document.body.appendChild(parentEle);
            let gridLayOut = new DashboardLayout({

                columns: 12,
                cellSpacing: [5, 5],
                allowFloating: false,
                panels: [{ id: 'one', sizeX: 1, sizeY: 1, row: 0, col: 7 },
                { id: 'two', sizeX: 1, sizeY: 1, row: 0, col: 7 },
                { id: 'three', sizeX: 1, sizeY: 1, row: 1, col: 7 },
                { id: 'four', sizeX: 1, sizeY: 1, row: 1, col: 7 }
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            let CellElements: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>gridLayOut.element.querySelectorAll('.e-panel');
            setCss(CellElements);
            expect((<any>gridLayOut).getCellInstance('one').col == 6).toBe(true);
            expect((<any>gridLayOut).getCellInstance('one').col == 7).toBe(false);
            expect((<any>gridLayOut).getCellInstance('one').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('two').col == 7).toBe(true);
            expect((<any>gridLayOut).getCellInstance('two').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('three').col == 6).toBe(true);
            expect((<any>gridLayOut).getCellInstance('three').col == 7).toBe(false);
            expect((<any>gridLayOut).getCellInstance('three').row == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('four').col == 7).toBe(true);
            expect((<any>gridLayOut).getCellInstance('four').row == 1).toBe(true);
            gridLayOut.destroy();
            detach(ele);
        });

        it('Left and right side allowPushing case scenario in same row', () => {
            let ele: HTMLElement = createElement('div', { id: 'gridlayout' });
            let parentEle: HTMLElement = createElement('div', { id: 'container' });
            parentEle.style.width = '1264px';
            parentEle.appendChild(ele);
            document.body.appendChild(parentEle);
            let gridLayOut = new DashboardLayout({

                columns: 12,
                cellSpacing: [5, 5],
                allowFloating: false,
                panels: [{ id: 'one', sizeX: 1, sizeY: 1, row: 0, col: 6 },
                { id: 'two', sizeX: 1, sizeY: 1, row: 0, col: 5 },
                { id: 'three', sizeX: 2, sizeY: 1, row: 0, col: 5 },
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            let CellElements: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>gridLayOut.element.querySelectorAll('.e-panel');
            setCss(CellElements);
            expect((<any>gridLayOut).getCellInstance('one').col == 4).toBe(true);
            expect((<any>gridLayOut).getCellInstance('one').col == 6).toBe(false);
            expect((<any>gridLayOut).getCellInstance('one').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('two').col == 7).toBe(true);
            expect((<any>gridLayOut).getCellInstance('two').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('three').col == 5).toBe(true);
            expect((<any>gridLayOut).getCellInstance('three').row == 0).toBe(true);
            gridLayOut.destroy();
            detach(ele);
        });


        it('Left and right side allowPushing case scenario in multiple row', () => {
            let ele: HTMLElement = createElement('div', { id: 'gridlayout' });
            let parentEle: HTMLElement = createElement('div', { id: 'container' });
            parentEle.style.width = '1264px';
            parentEle.appendChild(ele);
            document.body.appendChild(parentEle);
            let gridLayOut = new DashboardLayout({

                columns: 12,
                cellSpacing: [5, 5],
                allowFloating: false,
                panels: [{ id: 'one', sizeX: 1, sizeY: 1, row: 0, col: 6 },
                { id: 'two', sizeX: 1, sizeY: 1, row: 0, col: 5 },
                { id: 'three', sizeX: 1, sizeY: 1, row: 1, col: 6 },
                { id: 'four', sizeX: 1, sizeY: 1, row: 1, col: 5 },
                { id: 'five', sizeX: 2, sizeY: 2, row: 0, col: 5 },
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            let CellElements: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>gridLayOut.element.querySelectorAll('.e-panel');
            setCss(CellElements);
            expect((<any>gridLayOut).getCellInstance('one').col == 4).toBe(true);
            expect((<any>gridLayOut).getCellInstance('one').col == 6).toBe(false);
            expect((<any>gridLayOut).getCellInstance('one').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('two').col == 7).toBe(true);
            expect((<any>gridLayOut).getCellInstance('two').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('three').col == 4).toBe(true);
            expect((<any>gridLayOut).getCellInstance('three').col == 6).toBe(false);
            expect((<any>gridLayOut).getCellInstance('three').row == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('four').col == 7).toBe(true);
            expect((<any>gridLayOut).getCellInstance('four').row == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('five').col == 5).toBe(true);
            expect((<any>gridLayOut).getCellInstance('five').row == 0).toBe(true);
            gridLayOut.destroy();
            detach(ele);
        });

        it('Pushing of panels with right ad then left side of the panel', () => {
            let ele: HTMLElement = createElement('div', { id: 'gridlayout' });
            let parentEle: HTMLElement = createElement('div', { id: 'container' });
            parentEle.style.width = '1264px';
            parentEle.appendChild(ele);
            document.body.appendChild(parentEle);
            let gridLayOut = new DashboardLayout({

                columns: 12,
                cellSpacing: [5, 5],
                allowFloating: false,
                panels: [{ id: 'one', sizeX: 2, sizeY: 1, row: 0, col: 5 },
                { id: 'two', sizeX: 1, sizeY: 1, row: 0, col: 5 },
                { id: 'three', sizeX: 1, sizeY: 1, row: 0, col: 6 },
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            let CellElements: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>gridLayOut.element.querySelectorAll('.e-panel');
            setCss(CellElements);
            expect((<any>gridLayOut).getCellInstance('one').col == 3).toBe(true);
            expect((<any>gridLayOut).getCellInstance('one').col == 5).toBe(false);
            expect((<any>gridLayOut).getCellInstance('one').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('two').col == 5).toBe(true);
            expect((<any>gridLayOut).getCellInstance('two').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('three').col == 6).toBe(true);
            expect((<any>gridLayOut).getCellInstance('three').row == 0).toBe(true);
            gridLayOut.destroy();
            detach(ele);
        });

        it('Pushing of panels down', () => {
            let ele: HTMLElement = createElement('div', { id: 'gridlayout' });
            let parentEle: HTMLElement = createElement('div', { id: 'container' });
            parentEle.style.width = '1264px';
            parentEle.appendChild(ele);
            document.body.appendChild(parentEle);
            let gridLayOut = new DashboardLayout({

                columns: 12,
                cellSpacing: [5, 5],
                allowFloating: false,
                panels: [{ id: 'one', sizeX: 2, sizeY: 1, row: 0, col: 0 },
                { id: 'two', sizeX: 2, sizeY: 1, row: 0, col: 2 },
                { id: 'three', sizeX: 2, sizeY: 1, row: 0, col: 4 },
                { id: 'four', sizeX: 2, sizeY: 1, row: 0, col: 6 },
                { id: 'five', sizeX: 1, sizeY: 1, row: 0, col: 0 },
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            let CellElements: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>gridLayOut.element.querySelectorAll('.e-panel');
            setCss(CellElements);
            expect((<any>gridLayOut).getCellInstance('one').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('one').row == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('two').col == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('two').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('three').col == 4).toBe(true);
            expect((<any>gridLayOut).getCellInstance('three').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('four').col == 6).toBe(true);
            expect((<any>gridLayOut).getCellInstance('four').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('five').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('five').row == 0).toBe(true);
            gridLayOut.destroy();
            detach(ele);
        });

        it('Pushing of panels down and right movement', () => {
            let ele: HTMLElement = createElement('div', { id: 'gridlayout' });
            let parentEle: HTMLElement = createElement('div', { id: 'container' });
            parentEle.style.width = '1264px';
            parentEle.appendChild(ele);
            document.body.appendChild(parentEle);
            let gridLayOut = new DashboardLayout({

                columns: 12,
                cellSpacing: [5, 5],
                allowFloating: false,
                panels: [{ id: 'one', sizeX: 2, sizeY: 1, row: 0, col: 0 },
                { id: 'two', sizeX: 2, sizeY: 1, row: 0, col: 2 },
                { id: 'three', sizeX: 2, sizeY: 1, row: 0, col: 4 },
                { id: 'four', sizeX: 2, sizeY: 1, row: 0, col: 6 },
                { id: 'five', sizeX: 1, sizeY: 1, row: 0, col: 0 },
                { id: 'six', sizeX: 1, sizeY: 1, row: 1, col: 0 },
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            let CellElements: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>gridLayOut.element.querySelectorAll('.e-panel');
            setCss(CellElements);
            expect((<any>gridLayOut).getCellInstance('one').col == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('one').row == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('two').col == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('two').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('three').col == 4).toBe(true);
            expect((<any>gridLayOut).getCellInstance('three').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('four').col == 6).toBe(true);
            expect((<any>gridLayOut).getCellInstance('four').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('five').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('five').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('six').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('six').row == 1).toBe(true);
            gridLayOut.destroy();
            detach(ele);
        });

        it('Pushing of panels down and right movement with spacing between', () => {
            let ele: HTMLElement = createElement('div', { id: 'gridlayout' });
            let parentEle: HTMLElement = createElement('div', { id: 'container' });
            parentEle.style.width = '1264px';
            parentEle.appendChild(ele);
            document.body.appendChild(parentEle);
            let gridLayOut = new DashboardLayout({

                columns: 12,
                cellSpacing: [5, 5],
                allowFloating: false,
                panels: [{ id: 'one', sizeX: 2, sizeY: 1, row: 0, col: 0 },
                { id: 'two', sizeX: 2, sizeY: 1, row: 0, col: 2 },
                { id: 'three', sizeX: 2, sizeY: 1, row: 0, col: 4 },
                { id: 'four', sizeX: 2, sizeY: 1, row: 0, col: 6 },
                { id: 'five', sizeX: 1, sizeY: 1, row: 0, col: 0 },
                { id: 'six', sizeX: 1, sizeY: 1, row: 1, col: 0 },
                { id: 'seven', sizeX: 1, sizeY: 1, row: 1, col: 2 },
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            let CellElements: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>gridLayOut.element.querySelectorAll('.e-panel');
            setCss(CellElements);
            expect((<any>gridLayOut).getCellInstance('one').col == 3).toBe(true);
            expect((<any>gridLayOut).getCellInstance('one').row == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('two').col == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('two').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('three').col == 4).toBe(true);
            expect((<any>gridLayOut).getCellInstance('three').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('four').col == 6).toBe(true);
            expect((<any>gridLayOut).getCellInstance('four').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('five').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('five').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('six').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('six').row == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('seven').col == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('seven').row == 1).toBe(true);
            gridLayOut.destroy();
            detach(ele);
        });

        it('Left movement of panels in between columns other than ends', () => {
            let ele: HTMLElement = createElement('div', { id: 'gridlayout' });
            let parentEle: HTMLElement = createElement('div', { id: 'container' });
            parentEle.style.width = '1264px';
            parentEle.appendChild(ele);
            document.body.appendChild(parentEle);
            let gridLayOut = new DashboardLayout({

                columns: 12,
                cellSpacing: [5, 5],
                allowFloating: false,
                panels: [{ id: 'one', sizeX: 1, sizeY: 1, row: 0, col: 2 },
                { id: 'two', sizeX: 1, sizeY: 1, row: 0, col: 2 },
                { id: 'three', sizeX: 1, sizeY: 1, row: 0, col: 3 },
                { id: 'four', sizeX: 1, sizeY: 1, row: 0, col: 4 },
                { id: 'five', sizeX: 1, sizeY: 1, row: 0, col: 5 },
                { id: 'six', sizeX: 1, sizeY: 1, row: 0, col: 6 },
                { id: 'seven', sizeX: 1, sizeY: 1, row: 0, col: 7 },
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            let CellElements: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>gridLayOut.element.querySelectorAll('.e-panel');
            setCss(CellElements);
            expect((<any>gridLayOut).getCellInstance('one').col == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('one').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('two').col == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('two').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('three').col == 3).toBe(true);
            expect((<any>gridLayOut).getCellInstance('three').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('four').col == 4).toBe(true);
            expect((<any>gridLayOut).getCellInstance('four').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('five').col == 5).toBe(true);
            expect((<any>gridLayOut).getCellInstance('five').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('six').col == 6).toBe(true);
            expect((<any>gridLayOut).getCellInstance('six').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('seven').col == 7).toBe(true);
            expect((<any>gridLayOut).getCellInstance('seven').row == 0).toBe(true);
            gridLayOut.destroy();
            detach(ele);
        });

        it('Right movement of panels in between columns other than ends', () => {
            let ele: HTMLElement = createElement('div', { id: 'gridlayout' });
            let parentEle: HTMLElement = createElement('div', { id: 'container' });
            parentEle.style.width = '1264px';
            parentEle.appendChild(ele);
            document.body.appendChild(parentEle);
            let gridLayOut = new DashboardLayout({

                columns: 12,
                cellSpacing: [5, 5],
                allowFloating: false,
                panels: [{ id: 'one', sizeX: 1, sizeY: 1, row: 0, col: 1 },
                { id: 'two', sizeX: 1, sizeY: 1, row: 0, col: 1 },
                { id: 'three', sizeX: 1, sizeY: 1, row: 0, col: 3 },
                { id: 'four', sizeX: 1, sizeY: 1, row: 0, col: 4 },
                { id: 'five', sizeX: 1, sizeY: 1, row: 0, col: 5 },
                { id: 'six', sizeX: 1, sizeY: 1, row: 0, col: 6 },
                { id: 'seven', sizeX: 1, sizeY: 1, row: 0, col: 7 },
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            let CellElements: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>gridLayOut.element.querySelectorAll('.e-panel');
            setCss(CellElements);
            expect((<any>gridLayOut).getCellInstance('one').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('one').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('two').col == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('two').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('three').col == 3).toBe(true);
            expect((<any>gridLayOut).getCellInstance('three').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('four').col == 4).toBe(true);
            expect((<any>gridLayOut).getCellInstance('four').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('five').col == 5).toBe(true);
            expect((<any>gridLayOut).getCellInstance('five').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('six').col == 6).toBe(true);
            expect((<any>gridLayOut).getCellInstance('six').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('seven').col == 7).toBe(true);
            expect((<any>gridLayOut).getCellInstance('seven').row == 0).toBe(true);
            gridLayOut.destroy();
            detach(ele);
        });

        it('exact right and left spacing of movement', () => {
            let ele: HTMLElement = createElement('div', { id: 'gridlayout' });
            let parentEle: HTMLElement = createElement('div', { id: 'container' });
            parentEle.style.width = '1264px';
            parentEle.appendChild(ele);
            document.body.appendChild(parentEle);
            let gridLayOut = new DashboardLayout({

                columns: 12,
                cellSpacing: [5, 5],
                allowFloating: false,
                panels: [{ id: 'one', sizeX: 1, sizeY: 1, row: 0, col: 1 },
                { id: 'two', sizeX: 1, sizeY: 1, row: 0, col: 2 },
                { id: 'three', sizeX: 5, sizeY: 1, row: 0, col: 1 }
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            let CellElements: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>gridLayOut.element.querySelectorAll('.e-panel');
            setCss(CellElements);
            expect((<any>gridLayOut).getCellInstance('one').col == 6).toBe(true);
            expect((<any>gridLayOut).getCellInstance('one').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('two').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('two').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('three').col == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('three').row == 0).toBe(true);
            gridLayOut.destroy();
            detach(ele);
        });

        it('allowPushing of ovelapping panels of different size', () => {
            let ele: HTMLElement = createElement('div', { id: 'gridlayout' });
            let parentEle: HTMLElement = createElement('div', { id: 'container' });
            parentEle.style.width = '1264px';
            parentEle.appendChild(ele);
            document.body.appendChild(parentEle);
            let gridLayOut = new DashboardLayout({

                columns: 12,
                cellSpacing: [5, 5],
                allowFloating: false,
                panels: [{ id: 'one', sizeX: 2, sizeY: 1, row: 0, col: 0 },
                { id: 'two', sizeX: 2, sizeY: 1, row: 0, col: 2 },
                { id: 'three', sizeX: 2, sizeY: 1, row: 0, col: 4 },
                { id: 'four', sizeX: 2, sizeY: 1, row: 0, col: 6 },
                { id: 'five', sizeX: 1, sizeY: 1, row: 0, col: 1 },
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            let CellElements: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>gridLayOut.element.querySelectorAll('.e-panel');
            setCss(CellElements);
            expect((<any>gridLayOut).getCellInstance('one').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('one').row == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('two').col == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('two').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('three').col == 4).toBe(true);
            expect((<any>gridLayOut).getCellInstance('three').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('four').col == 6).toBe(true);
            expect((<any>gridLayOut).getCellInstance('four').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('five').col == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('five').row == 0).toBe(true);
            gridLayOut.destroy();
            detach(ele);
        });

        it('allowPushing of panels down with unavailable spacing with sizeX > 1', () => {
            let ele: HTMLElement = createElement('div', { id: 'gridlayout' });
            let parentEle: HTMLElement = createElement('div', { id: 'container' });
            parentEle.style.width = '1264px';
            parentEle.appendChild(ele);
            document.body.appendChild(parentEle);
            let gridLayOut = new DashboardLayout({

                columns: 12,
                cellSpacing: [5, 5],
                allowFloating: false,
                panels: [{ id: 'one', sizeX: 2, sizeY: 1, row: 0, col: 0 },
                { id: 'two', sizeX: 5, sizeY: 1, row: 0, col: 3 },
                { id: 'three', sizeX: 3, sizeY: 1, row: 0, col: 1 },
                ]
            });
            gridLayOut.appendTo('#gridlayout');

            let CellElements: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>gridLayOut.element.querySelectorAll('.e-panel');
            setCss(CellElements);
            expect((<any>gridLayOut).getCellInstance('one').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('one').row == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('two').col == 4).toBe(true);
            expect((<any>gridLayOut).getCellInstance('two').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('three').col == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('three').row == 0).toBe(true);
            gridLayOut.destroy();
            detach(ele);
        });

        it('allowPushing of panels down with unavailable spacing with sizeX > 1 and adding panel', () => {
            let ele: HTMLElement = createElement('div', { id: 'gridlayout' });
            let parentEle: HTMLElement = createElement('div', { id: 'container' });
            parentEle.style.width = '1264px';
            parentEle.appendChild(ele);
            document.body.appendChild(parentEle);
            let gridLayOut = new DashboardLayout({

                columns: 12,
                cellSpacing: [5, 5],
                allowFloating: true,
                allowResizing: true,
                panels: [{ id: 'one', sizeX: 2, sizeY: 1, row: 0, col: 0 },
                { id: 'two', sizeX: 5, sizeY: 1, row: 0, col: 3 },
                { id: 'three', sizeX: 3, sizeY: 1, row: 0, col: 1 },
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            let CellElements: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>gridLayOut.element.querySelectorAll('.e-panel');
            setCss(CellElements);
            expect((<any>gridLayOut).getCellInstance('one').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('one').row == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('two').col == 4).toBe(true);
            expect((<any>gridLayOut).getCellInstance('two').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('three').col == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('three').row == 0).toBe(true);
            let panel: PanelModel = {
                id: 'four',
                col: 0,
                row: 1,
                sizeX: 1,
                sizeY: 1,

            }
            gridLayOut.addPanel(panel);
            expect((<any>gridLayOut).getCellInstance('four').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('four').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('one').col == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('one').row == 1).toBe(true);
            gridLayOut.destroy();
            detach(ele);
        });

        it('Pushing of panels with right with sizeX and sizeY > 1', () => {
            let ele: HTMLElement = createElement('div', { id: 'gridlayout' });
            let parentEle: HTMLElement = createElement('div', { id: 'container' });
            parentEle.style.width = '1264px';
            parentEle.appendChild(ele);
            document.body.appendChild(parentEle);
            let gridLayOut = new DashboardLayout({

                columns: 12,
                cellSpacing: [5, 5],
                allowFloating: false,
                panels: [{ id: 'one', sizeX: 2, sizeY: 2, row: 0, col: 0 },
                { id: 'two', sizeX: 2, sizeY: 2, row: 0, col: 0 }]
            });
            gridLayOut.appendTo('#gridlayout');
            let CellElements: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>gridLayOut.element.querySelectorAll('.e-panel');
            setCss(CellElements);
            expect((<any>gridLayOut).getCellInstance('one').col == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('one').col == 0).toBe(false);
            expect((<any>gridLayOut).getCellInstance('one').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('two').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('two').row == 0).toBe(true);
            gridLayOut.destroy();
            detach(ele);
        });

        it('Pushing of panels with left with sizeX and sizeY > 1', () => {
            let ele: HTMLElement = createElement('div', { id: 'gridlayout' });
            let parentEle: HTMLElement = createElement('div', { id: 'container' });
            parentEle.style.width = '1264px';
            parentEle.appendChild(ele);
            document.body.appendChild(parentEle);
            let gridLayOut = new DashboardLayout({

                columns: 12,
                cellSpacing: [5, 5],
                allowFloating: false,
                panels: [
                    { id: 'three', sizeX: 1, sizeY: 1, row: 0, col: 4 },
                    { id: 'four', sizeX: 1, sizeY: 1, row: 0, col: 5 },
                    { id: 'five', sizeX: 1, sizeY: 1, row: 0, col: 6 },
                    { id: 'six', sizeX: 1, sizeY: 1, row: 0, col: 7 },
                    { id: 'one', sizeX: 2, sizeY: 2, row: 0, col: 2 },
                    { id: 'two', sizeX: 2, sizeY: 2, row: 0, col: 2 }]
            });
            gridLayOut.appendTo('#gridlayout');
            let CellElements: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>gridLayOut.element.querySelectorAll('.e-panel');
            setCss(CellElements);
            expect((<any>gridLayOut).getCellInstance('one').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('one').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('two').col == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('two').row == 0).toBe(true);
            gridLayOut.destroy();
            detach(ele);
        });

        it('Pushing panels down without spacing in sizeX and sizeY > 1', () => {
            let ele: HTMLElement = createElement('div', { id: 'gridlayout' });
            let parentEle: HTMLElement = createElement('div', { id: 'container' });
            parentEle.style.width = '1264px';
            parentEle.appendChild(ele);
            document.body.appendChild(parentEle);
            let gridLayOut = new DashboardLayout({

                columns: 12,
                cellSpacing: [5, 5],
                allowFloating: false,
                panels: [
                    { id: 'three', sizeX: 1, sizeY: 1, row: 0, col: 4 },
                    { id: 'four', sizeX: 1, sizeY: 1, row: 0, col: 5 },
                    { id: 'five', sizeX: 1, sizeY: 1, row: 0, col: 6 },
                    { id: 'six', sizeX: 1, sizeY: 1, row: 0, col: 7 },
                    { id: 'seven', sizeX: 1, sizeY: 1, row: 0, col: 0 },
                    { id: 'one', sizeX: 2, sizeY: 2, row: 0, col: 2 },
                    { id: 'two', sizeX: 2, sizeY: 2, row: 0, col: 2 }]
            });
            gridLayOut.appendTo('#gridlayout');
            let CellElements: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>gridLayOut.element.querySelectorAll('.e-panel');
            setCss(CellElements);
            expect((<any>gridLayOut).getCellInstance('one').col == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('one').col == 0).toBe(false);
            expect((<any>gridLayOut).getCellInstance('one').row == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('two').col == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('two').row == 0).toBe(true);
            gridLayOut.destroy();
            detach(ele);
        });

        it('Pushing panels towards right with sizeX value = 1 and sizeY > 1', () => {
            let ele: HTMLElement = createElement('div', { id: 'gridlayout' });
            let parentEle: HTMLElement = createElement('div', { id: 'container' });
            parentEle.style.width = '1264px';
            parentEle.appendChild(ele);
            document.body.appendChild(parentEle);
            let gridLayOut = new DashboardLayout({

                columns: 12,
                cellSpacing: [5, 5],
                allowFloating: false,
                panels: [
                    { id: 'one', sizeX: 1, sizeY: 2, row: 0, col: 0 },
                    { id: 'two', sizeX: 1, sizeY: 2, row: 0, col: 0 },
                    { id: 'three', sizeX: 1, sizeY: 2, row: 0, col: 0 },
                    { id: 'four', sizeX: 1, sizeY: 2, row: 0, col: 0 },
                    { id: 'five', sizeX: 1, sizeY: 2, row: 0, col: 0 },
                    { id: 'six', sizeX: 1, sizeY: 2, row: 0, col: 0 },
                    { id: 'seven', sizeX: 1, sizeY: 2, row: 0, col: 0 }]
            });
            gridLayOut.appendTo('#gridlayout');
            let CellElements: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>gridLayOut.element.querySelectorAll('.e-panel');
            setCss(CellElements);
            expect((<any>gridLayOut).getCellInstance('seven').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('one').col == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('two').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('three').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('four').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('five').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('six').col == 0).toBe(true);
            gridLayOut.destroy();
            detach(ele);
        });

        it('Pushing panels towards left with sizeX value = 1 and sizeY > 1', () => {
            let ele: HTMLElement = createElement('div', { id: 'gridlayout' });
            let parentEle: HTMLElement = createElement('div', { id: 'container' });
            parentEle.style.width = '1264px';
            parentEle.appendChild(ele);
            document.body.appendChild(parentEle);
            let gridLayOut = new DashboardLayout({

                columns: 12,
                cellSpacing: [5, 5],
                allowFloating: false,
                panels: [
                    { id: 'one', sizeX: 1, sizeY: 2, row: 0, col: 7 },
                    { id: 'two', sizeX: 1, sizeY: 2, row: 0, col: 7 },
                    { id: 'three', sizeX: 1, sizeY: 2, row: 0, col: 7 },
                    { id: 'four', sizeX: 1, sizeY: 2, row: 0, col: 7 },
                    { id: 'five', sizeX: 1, sizeY: 2, row: 0, col: 7 },
                    { id: 'six', sizeX: 1, sizeY: 2, row: 0, col: 7 },
                    { id: 'seven', sizeX: 1, sizeY: 2, row: 0, col: 7 }]
            });
            gridLayOut.appendTo('#gridlayout');
            let CellElements: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>gridLayOut.element.querySelectorAll('.e-panel');
            setCss(CellElements);
            expect((<any>gridLayOut).getCellInstance('seven').col == 7).toBe(true);
            expect((<any>gridLayOut).getCellInstance('one').col == 6).toBe(true);
            expect((<any>gridLayOut).getCellInstance('two').col == 8).toBe(true);
            expect((<any>gridLayOut).getCellInstance('three').col == 7).toBe(true);
            expect((<any>gridLayOut).getCellInstance('four').col == 7).toBe(true);
            expect((<any>gridLayOut).getCellInstance('five').col == 7).toBe(true);
            expect((<any>gridLayOut).getCellInstance('six').col == 7).toBe(true);
            gridLayOut.destroy();
            detach(ele);
        });

        it('Pushing panels with sizeX and sizeY > 1 towards left to push panels right', () => {
            let ele: HTMLElement = createElement('div', { id: 'gridlayout' });
            let parentEle: HTMLElement = createElement('div', { id: 'container' });
            parentEle.style.width = '1264px';
            parentEle.appendChild(ele);
            document.body.appendChild(parentEle);
            let gridLayOut = new DashboardLayout({

                columns: 12,
                cellSpacing: [5, 5],
                allowFloating: false,
                panels: [
                    { id: 'one', sizeX: 1, sizeY: 1, row: 0, col: 0 },
                    { id: 'two', sizeX: 1, sizeY: 1, row: 1, col: 0 },
                    { id: 'three', sizeX: 2, sizeY: 2, row: 0, col: 0 },
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            let CellElements: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>gridLayOut.element.querySelectorAll('.e-panel');
            setCss(CellElements);
            expect((<any>gridLayOut).getCellInstance('one').col == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('one').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('two').col == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('two').row == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('three').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('three').row == 0).toBe(true);
            gridLayOut.destroy();
            detach(ele);
        });

        it('Pushing panels with sizeX and sizeY > 1 towards right to push panels left', () => {
            let ele: HTMLElement = createElement('div', { id: 'gridlayout' });
            let parentEle: HTMLElement = createElement('div', { id: 'container' });
            parentEle.style.width = '1264px';
            parentEle.appendChild(ele);
            document.body.appendChild(parentEle);
            let gridLayOut = new DashboardLayout({

                columns: 12,
                cellSpacing: [5, 5],
                allowFloating: false,
                panels: [
                    { id: 'one', sizeX: 1, sizeY: 1, row: 0, col: 7 },
                    { id: 'two', sizeX: 1, sizeY: 1, row: 0, col: 6 },
                    { id: 'three', sizeX: 2, sizeY: 2, row: 0, col: 6 },
                ]
            });
            gridLayOut.appendTo('#gridlayout');

            let CellElements: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>gridLayOut.element.querySelectorAll('.e-panel');
            setCss(CellElements);
            expect((<any>gridLayOut).getCellInstance('one').col == 5).toBe(true);
            expect((<any>gridLayOut).getCellInstance('one').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('two').col == 8).toBe(true);
            expect((<any>gridLayOut).getCellInstance('two').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('three').col == 6).toBe(true);
            expect((<any>gridLayOut).getCellInstance('three').row == 0).toBe(true);
            gridLayOut.destroy();
            detach(ele);
        });

        it('Pushing panels with sizeX and sizeY = 1 towards right by completely overlapping the elements', () => {
            let ele: HTMLElement = createElement('div', { id: 'gridlayout' });
            let parentEle: HTMLElement = createElement('div', { id: 'container' });
            parentEle.style.width = '1264px';
            parentEle.appendChild(ele);
            document.body.appendChild(parentEle);
            let gridLayOut = new DashboardLayout({

                columns: 8,
                cellSpacing: [5, 5],
                allowFloating: false,
                panels: [
                    { id: 'one', sizeX: 1, sizeY: 1, row: 0, col: 0 },
                    { id: 'two', sizeX: 1, sizeY: 1, row: 0, col: 0 },
                    { id: 'three', sizeX: 1, sizeY: 1, row: 0, col: 0 },
                    { id: 'four', sizeX: 3, sizeY: 1, row: 0, col: 0 },
                ]
            });
            gridLayOut.appendTo('#gridlayout');

            let CellElements: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>gridLayOut.element.querySelectorAll('.e-panel');
            setCss(CellElements);
            expect((<any>gridLayOut).getCellInstance('one').col == 3).toBe(true);
            expect((<any>gridLayOut).getCellInstance('one').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('two').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('two').row == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('three').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('three').row == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('four').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('four').row == 0).toBe(true);
            gridLayOut.destroy();
            detach(ele);
        });

        it('Pushing panels with sizeX and sizeY = 1 towards left by completely overlapping the elements', () => {
            let ele: HTMLElement = createElement('div', { id: 'gridlayout' });
            let parentEle: HTMLElement = createElement('div', { id: 'container' });
            parentEle.style.width = '1264px';
            parentEle.appendChild(ele);
            document.body.appendChild(parentEle);
            let gridLayOut = new DashboardLayout({

                columns: 8,
                cellSpacing: [5, 5],
                allowFloating: false,
                panels: [
                    { id: 'one', sizeX: 1, sizeY: 1, row: 0, col: 7 },
                    { id: 'two', sizeX: 1, sizeY: 1, row: 0, col: 7 },
                    { id: 'three', sizeX: 1, sizeY: 1, row: 0, col: 7 },
                    { id: 'four', sizeX: 3, sizeY: 1, row: 0, col: 5 },
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            let CellElements: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>gridLayOut.element.querySelectorAll('.e-panel');
            setCss(CellElements);
            expect((<any>gridLayOut).getCellInstance('one').col == 6).toBe(true);
            expect((<any>gridLayOut).getCellInstance('one').row == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('two').col == 7).toBe(true);
            expect((<any>gridLayOut).getCellInstance('two').row == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('three').col == 4).toBe(true);
            expect((<any>gridLayOut).getCellInstance('three').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('four').col == 5).toBe(true);
            expect((<any>gridLayOut).getCellInstance('four').row == 0).toBe(true);
            gridLayOut.destroy();
            detach(ele);
        });

        it('overlapping and allowPushing SizeX and sizeY > 1 elements down', () => {
            let ele: HTMLElement = createElement('div', { id: 'gridlayout' });
            let parentEle: HTMLElement = createElement('div', { id: 'container' });
            parentEle.style.width = '1264px';
            parentEle.appendChild(ele);
            document.body.appendChild(parentEle);
            let gridLayOut = new DashboardLayout({

                columns: 8,
                cellSpacing: [5, 5],
                allowFloating: false,
                panels: [
                    { id: 'one', sizeX: 2, sizeY: 1, row: 0, col: 0 },
                    { id: 'two', sizeX: 2, sizeY: 1, row: 0, col: 2 },
                    { id: 'three', sizeX: 2, sizeY: 1, row: 0, col: 4 },
                    { id: 'four', sizeX: 2, sizeY: 1, row: 0, col: 6 },
                    { id: 'five', sizeX: 2, sizeY: 1, row: 0, col: 0 },
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            let CellElements: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>gridLayOut.element.querySelectorAll('.e-panel');
            setCss(CellElements);
            expect((<any>gridLayOut).getCellInstance('one').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('one').row == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('two').col == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('two').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('three').col == 4).toBe(true);
            expect((<any>gridLayOut).getCellInstance('three').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('four').col == 6).toBe(true);
            expect((<any>gridLayOut).getCellInstance('four').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('five').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('five').row == 0).toBe(true);
            gridLayOut.destroy();
            detach(ele);
        });

        it('overlapping and allowPushing SizeX and sizeY = 1  with sizeX > 1elements down', () => {
            let ele: HTMLElement = createElement('div', { id: 'gridlayout' });
            let parentEle: HTMLElement = createElement('div', { id: 'container' });
            parentEle.style.width = '1264px';
            parentEle.appendChild(ele);
            document.body.appendChild(parentEle);
            let gridLayOut = new DashboardLayout({

                columns: 8,
                cellSpacing: [5, 5],
                allowFloating: false,
                panels: [
                    { id: 'one', sizeX: 1, sizeY: 1, row: 0, col: 0 },
                    { id: 'two', sizeX: 1, sizeY: 1, row: 0, col: 1 },
                    { id: 'three', sizeX: 1, sizeY: 1, row: 0, col: 2 },
                    { id: 'four', sizeX: 1, sizeY: 1, row: 0, col: 3 },
                    { id: 'six', sizeX: 4, sizeY: 1, row: 0, col: 4 },
                    { id: 'five', sizeX: 4, sizeY: 1, row: 0, col: 0 },
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            let CellElements: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>gridLayOut.element.querySelectorAll('.e-panel');
            setCss(CellElements);
            expect((<any>gridLayOut).getCellInstance('one').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('one').row == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('two').col == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('two').row == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('three').col == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('three').row == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('four').col == 3).toBe(true);
            expect((<any>gridLayOut).getCellInstance('four').row == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('five').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('five').row == 0).toBe(true);
            gridLayOut.destroy();
            detach(ele);
        });

        it('overlapping and allowPushing SizeX and sizeY = 1  with sizeY > 1elements down', () => {
            let ele: HTMLElement = createElement('div', { id: 'gridlayout' });
            let parentEle: HTMLElement = createElement('div', { id: 'container' });
            parentEle.style.width = '1264px';
            parentEle.appendChild(ele);
            document.body.appendChild(parentEle);
            let gridLayOut = new DashboardLayout({

                columns: 8,
                cellSpacing: [5, 5],
                allowFloating: false,
                panels: [
                    { id: 'one', sizeX: 1, sizeY: 1, row: 0, col: 0 },
                    { id: 'two', sizeX: 1, sizeY: 1, row: 0, col: 1 },
                    { id: 'three', sizeX: 1, sizeY: 1, row: 0, col: 2 },
                    { id: 'four', sizeX: 1, sizeY: 1, row: 0, col: 3 },
                    { id: 'six', sizeX: 4, sizeY: 1, row: 0, col: 4 },
                    { id: 'five', sizeX: 4, sizeY: 3, row: 0, col: 0 },
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            let CellElements: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>gridLayOut.element.querySelectorAll('.e-panel');
            setCss(CellElements);
            expect((<any>gridLayOut).getCellInstance('one').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('one').row == 3).toBe(true);
            expect((<any>gridLayOut).getCellInstance('two').col == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('two').row == 3).toBe(true);
            expect((<any>gridLayOut).getCellInstance('three').col == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('three').row == 3).toBe(true);
            expect((<any>gridLayOut).getCellInstance('four').col == 3).toBe(true);
            expect((<any>gridLayOut).getCellInstance('four').row == 3).toBe(true);
            expect((<any>gridLayOut).getCellInstance('five').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('five').row == 0).toBe(true);
            gridLayOut.destroy();
            detach(ele);
        });

        it('overlapping and allowPushing SizeX and sizeY = 1  with sizeX and sizeY > 1elements left', () => {
            let ele: HTMLElement = createElement('div', { id: 'gridlayout' });
            let parentEle: HTMLElement = createElement('div', { id: 'container' });
            parentEle.style.width = '1264px';
            parentEle.appendChild(ele);
            document.body.appendChild(parentEle);
            let gridLayOut = new DashboardLayout({

                columns: 8,
                cellSpacing: [5, 5],
                allowFloating: false,
                panels: [
                    { id: 'one', sizeX: 2, sizeY: 1, row: 0, col: 0 },
                    { id: 'two', sizeX: 2, sizeY: 1, row: 0, col: 1 },
                    { id: 'three', sizeX: 1, sizeY: 1, row: 0, col: 2 },
                    { id: 'four', sizeX: 3, sizeY: 1, row: 0, col: 4 },
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            let CellElements: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>gridLayOut.element.querySelectorAll('.e-panel');
            setCss(CellElements);
            expect((<any>gridLayOut).getCellInstance('one').col == 3).toBe(true);
            expect((<any>gridLayOut).getCellInstance('one').row == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('two').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('two').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('three').col == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('three').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('four').col == 4).toBe(true);
            expect((<any>gridLayOut).getCellInstance('four').row == 0).toBe(true);
            gridLayOut.destroy();
            detach(ele);
        });

        it('overlapping and allowPushing SizeX and sizeY = 1  with sizeX and sizeY > 1elements right', () => {
            let ele: HTMLElement = createElement('div', { id: 'gridlayout' });
            let parentEle: HTMLElement = createElement('div', { id: 'container' });
            parentEle.style.width = '1264px';
            parentEle.appendChild(ele);
            document.body.appendChild(parentEle);
            let gridLayOut = new DashboardLayout({

                columns: 8,
                cellSpacing: [5, 5],
                allowFloating: false,
                panels: [
                    { sizeX: 2, sizeY: 1, row: 0, col: 0 },
                    { id: 'two', sizeX: 2, sizeY: 1, row: 0, col: 1 },
                    { id: 'three', sizeX: 1, sizeY: 1, row: 0, col: 1 },
                    { id: 'four', sizeX: 3, sizeY: 1, row: 0, col: 4 },
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            let CellElements: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>gridLayOut.element.querySelectorAll('.e-panel');
            setCss(CellElements);
            expect((<any>gridLayOut).getCellInstance('layout_0').col == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('layout_0').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('two').col == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('two').row == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('three').col == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('three').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('four').col == 4).toBe(true);
            expect((<any>gridLayOut).getCellInstance('four').row == 0).toBe(true);
            gridLayOut.destroy();
            detach(ele);
        });

    });

    describe('inline layout testing', () => {
        beforeEach(() => {
            ele = createElement('div', { id: 'gridlayout1' });
            document.body.appendChild(ele);
            let datasizeX: any = ['2', '2', '1', '5', '3', '2', '1'];
            let dataSizeY: any = ['1', '1', '1', '1', '1', '1', '3'];
            let datarow: any = ['1', '0', '0', '2', '1', '0', '0'];
            let datacol: any = ['0', '0', '2', '0', '2', '3', '5'];
            let panelContainer: HTMLElement;
            for (let i: number = 0; i < 7; i++) {
                let panelElement: HTMLElement = createElement('div', { className: 'e-panel' });
                panelElement.setAttribute('data-sizeX', datasizeX[i]);
                panelElement.setAttribute('data-sizeY', dataSizeY[i]);
                panelElement.setAttribute('data-row', datarow[i]);
                panelElement.setAttribute('data-col', datacol[i]);
                if (i === 1) {
                    panelElement.setAttribute('data-minSizeX', "1");
                    panelElement.setAttribute('data-minSizeY', "1");
                    panelElement.setAttribute('data-maxSizeX', "5");
                    panelElement.setAttribute('data-maxSizeY', "5");
                    panelElement.removeAttribute("data-sizeY")
                    panelElement.setAttribute('data-zindex', "120");
                    panelContainer = createElement('div', { className: 'e-panel-container' });
                    panelElement.appendChild(panelContainer);
                }
                if (i !== 6) {
                    let headerElement: HTMLElement = createElement('div', { className: 'e-panel-header' });
                    headerElement.innerHTML = 'Header' + (i).toString();
                    i === 1 ? panelContainer.appendChild(headerElement) : panelElement.appendChild(headerElement);
                    let headerTemplateElement: HTMLElement = createElement('div', { className: 'e-header-template' });
                    headerTemplateElement.innerHTML = 'Header' + (i).toString();
                    i === 1 ? panelContainer.appendChild(headerTemplateElement) : panelElement.appendChild(headerTemplateElement);
                }
                if (i !== 7) {
                    let bodyElement: HTMLElement = createElement('div', { className: 'e-panel-content' });
                    bodyElement.innerHTML = 'Header' + (i).toString();
                    i === 1 ? panelContainer.appendChild(bodyElement) : panelElement.appendChild(bodyElement);
                    ele.appendChild(panelElement)
                }

            }
        });
        afterEach(() => {
            if (gridLayOut) {
                gridLayOut.destroy();
                detach(ele);
                // detach(parentEle);
            }
        })
        it('layout testing inline values', () => {
            let gridLayOut = new DashboardLayout({

                columns: 8,
                cellSpacing: [5, 5],
                allowResizing: true
            });
            gridLayOut.appendTo('#gridlayout1');
            let CellElements: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>gridLayOut.element.querySelectorAll('.e-panel');
            setCss(CellElements);

            expect((<HTMLElement>gridLayOut.element.children[0]).style.left == "0px").toBe(true);
            // expect((<HTMLElement>gridLayOut.element.children[0]).style.top).toBe('95px');
            expect((<HTMLElement>gridLayOut.element.children[1]).style.left == "0px").toBe(true);
            expect((<HTMLElement>gridLayOut.element.children[1]).style.top == "0px").toBe(true);
            // expect((<HTMLElement>gridLayOut.element.children[2]).style.left == "312px").toBe(true);
            expect((<HTMLElement>gridLayOut.element.children[2]).style.top == "0px").toBe(true);
            expect((<HTMLElement>gridLayOut.element.children[3]).style.left == "0px").toBe(true);
            // expect((<HTMLElement>gridLayOut.element.children[4]).style.left == "312px").toBe(true);
            // expect((<HTMLElement>gridLayOut.element.children[5]).style.left == "468px").toBe(true);
            expect((<HTMLElement>gridLayOut.element.children[5]).style.top == "0px").toBe(true);
        });

        it('layout testing inline values without columns', () => {
            document.getElementById('gridlayout1').style.height = "619px";
            document.getElementById('gridlayout1').style.width = "1247.25px";
            let gridLayOut = new DashboardLayout({
                cellSpacing: [5, 5],
                allowResizing: true,
                cellAspectRatio: 100 / 20
            });
            gridLayOut.appendTo('#gridlayout1');
            let CellElements: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>gridLayOut.element.querySelectorAll('.e-panel');
            setCss(CellElements);
            expect(gridLayOut.columns == 1).toBe(true);
            expect(gridLayOut.panels[0].row == 8).toBe(true);
            expect(gridLayOut.panels[1].row == 6).toBe(true);
            expect(gridLayOut.panels[2].row == 4).toBe(true);
            expect(gridLayOut.panels[3].row == 7).toBe(true);
            expect(gridLayOut.panels[4].row == 5).toBe(true);
            expect(gridLayOut.panels[5].row == 3).toBe(true);
            expect(gridLayOut.panels[6].row == 0).toBe(true);
        });

        it('layout testing inline values with mediaQuery initially true case', () => {
            document.getElementById('gridlayout1').style.height = "619px";
            document.getElementById('gridlayout1').style.width = "1247.25px";
            document.getElementById('gridlayout1').innerHTML = '<div id="zero" class="e-panel e-panel-transition" data-col="0" data-row="0" data-sizex="1" data-sizey="1" data-minsizex="1" data-minsizey="1" style="z-index: 1000; height: 1887px; left: 0px; top: 0px; width: 100%;"><div class="e-panel-container" id="0_content"><div class="e-panel-content" id="0_body" style="height: calc(100% - 0px);"><div class="dialogContent"><span class="dialogText">0</span></div></div></div></div><div id="one" class="e-panel e-panel-transition" data-col="1" data-row="0" data-sizex="1" data-sizey="1" data-minsizex="1" data-minsizey="1" style="z-index: 1000; height: 1887px; width: 100%; left: 0px; top: 1892px;"><div class="e-panel-container" id="1_content"><div class="e-panel-content" id="1_body" style="height: calc(100% - 0px);"><div class="dialogContent"><span class="dialogText">1</span></div></div></div></div>'
            let gridLayOut = new DashboardLayout({
                cellSpacing: [5, 5],
                allowResizing: true,
                columns: 12,
                cellAspectRatio: 100 / 20,
                mediaQuery: "max-width: 1920px"
            });
            gridLayOut.appendTo('#gridlayout1');
            let CellElements: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>gridLayOut.element.querySelectorAll('.e-panel');
            setCss(CellElements);
            expect((<any>gridLayOut).getCellInstance('zero').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('one').row == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('zero').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('one').col == 0).toBe(true);
        });


        it('layout testing inline values with RTL', () => {
            let gridLayOut = new DashboardLayout({

                columns: 8,
                cellSpacing: [5, 5],
                enableRtl: true
            });
            gridLayOut.appendTo('#gridlayout1');
            let CellElements: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>gridLayOut.element.querySelectorAll('.e-panel');
            setCss(CellElements);
            expect((<HTMLElement>gridLayOut.element.children[0]).classList.contains('e-rtl')).toBe(true);
            expect((<HTMLElement>gridLayOut.element.children[0]).style.left == "0px").toBe(true);
            // expect((<HTMLElement>gridLayOut.element.children[0]).style.top).toBe('95px');
            expect((<HTMLElement>gridLayOut.element.children[1]).classList.contains('e-rtl')).toBe(true);
            expect((<HTMLElement>gridLayOut.element.children[1]).style.left == "0px").toBe(true);
            expect((<HTMLElement>gridLayOut.element.children[1]).style.top == "0px").toBe(true);
            expect((<HTMLElement>gridLayOut.element.children[2]).classList.contains('e-rtl')).toBe(true);
            // expect((<HTMLElement>gridLayOut.element.children[2]).style.left == "312px").toBe(true);
            expect((<HTMLElement>gridLayOut.element.children[2]).style.top == "0px").toBe(true);
            expect((<HTMLElement>gridLayOut.element.children[3]).classList.contains('e-rtl')).toBe(true);
            expect((<HTMLElement>gridLayOut.element.children[3]).style.left == "0px").toBe(true);
            expect((<HTMLElement>gridLayOut.element.children[4]).classList.contains('e-rtl')).toBe(true);
            // expect((<HTMLElement>gridLayOut.element.children[4]).style.left == "312px").toBe(true);
            expect((<HTMLElement>gridLayOut.element.children[5]).classList.contains('e-rtl')).toBe(true);
            // expect((<HTMLElement>gridLayOut.element.children[5]).style.left == "468px").toBe(true);
            expect((<HTMLElement>gridLayOut.element.children[5]).style.top == "0px").toBe(true);

        });
    });

    describe('Drag and Drop testing', () => {
        let gridLayOut: any;
        beforeEach(() => {
            ele = createElement('div', { id: 'gridlayout' });
            setStyle(ele, { 'position': 'relative' });
            parentEle = createElement('div', { id: 'container' });
            setStyle(parentEle, { 'position': 'relative' });
            parentEle.style.width = '1264px';
            parentEle.appendChild(ele);
            document.body.appendChild(parentEle);
            gridLayOut = new DashboardLayout({
                allowDragging: true,
                allowPushing: true,
                // swapping: false,
                allowFloating: false,

                //     rows: 6,
                columns: 20,
                cellSpacing: [5, 5],
                panels: [{ "id": '0', "sizeX": 1, "sizeY": 1, "row": 0, "col": 0, content: generateTemplate('0') },
                { "id": '2', "sizeX": 2, "sizeY": 2, "row": 0, "col": 1, content: generateTemplate('2') },
                { "id": '5', "sizeX": 1, "sizeY": 1, "row": 0, "col": 3, content: generateTemplate('5') },
                { "id": '7', "sizeX": 1, "sizeY": 3, "row": 0, "col": 4, content: generateTemplate('7') },
                { "id": '8', "sizeX": 3, "sizeY": 1, "row": 0, "col": 5, content: generateTemplate('8') },
                { "id": '6', "sizeX": 1, "sizeY": 1, "row": 1, "col": 3, content: generateTemplate('6') },
                { "id": '1', "sizeX": 1, "sizeY": 2, "row": 1, "col": 0, content: generateTemplate('1') },
                { "id": '9', "sizeX": 2, "sizeY": 1, "row": 2, "col": 5, content: generateTemplate('9') },
                { "id": '12', "sizeX": 1, "sizeY": 1, "row": 2, "col": 7, content: generateTemplate('12') },
                { "id": '10', "sizeX": 1, "sizeY": 1, "row": 1, "col": 5, content: generateTemplate('10') },
                { "id": '11', "sizeX": 2, "sizeY": 1, "row": 1, "col": 6, content: generateTemplate('11') },
                { "id": '3', "sizeX": 1, "sizeY": 1, "row": 2, "col": 1, content: generateTemplate('3') },
                { "id": '4', "sizeX": 2, "sizeY": 1, "row": 2, "col": 2, content: generateTemplate('4') },
                { "id": '13', "sizeX": 4, "sizeY": 1, "row": 3, "col": 1, content: generateTemplate('13') },
                { "id": '14', "sizeX": 1, "sizeY": 1, "row": 3, "col": 0, content: generateTemplate('14') },
                { "id": '15', "sizeX": 3, "sizeY": 2, "row": 3, "col": 5, content: generateTemplate('15') },
                { "id": '16', "sizeX": 5, "sizeY": 1, "row": 4, "col": 0, content: generateTemplate('16') },
                { "id": '17', "sizeX": 1, "sizeY": 4, "row": 0, "col": 8, content: generateTemplate('17') },
                { "id": '18', "sizeX": 3, "sizeY": 3, "row": 0, "col": 9, content: generateTemplate('18') },
                { "id": '19', "sizeX": 2, "sizeY": 1, "row": 3, "col": 9, content: generateTemplate('19') },
                { "id": '20', "sizeX": 1, "sizeY": 2, "row": 3, "col": 11, content: generateTemplate('20') },
                { "id": '21', "sizeX": 3, "sizeY": 1, "row": 4, "col": 8, content: generateTemplate('21') },
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            let CellElements: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>gridLayOut.element.querySelectorAll('.e-panel');
            setCss(CellElements);
        });
        afterEach((): void => {
            if (gridLayOut) {
                gridLayOut.destroy();
                detach(ele);
                detach(parentEle);
            }
        });
        it('Dragging element 0 (1 ,1) over 2 (2,2) and adding panel', () => {
            let movingElemnt: HTMLElement = document.getElementById('0');
            let targetElemnt: HTMLElement = document.getElementById('2');
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
            mouseup.currentTarget = document;
            EventHandler.trigger(<any>(document), 'mouseup', mouseup);
            expect((<any>gridLayOut).getCellInstance('0').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('0').col == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('2').row == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('2').col == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('3').row == 3).toBe(true);
            expect((<any>gridLayOut).getCellInstance('3').col == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('4').row == 3).toBe(true);
            expect((<any>gridLayOut).getCellInstance('4').col == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('13').row == 4).toBe(true);
            expect((<any>gridLayOut).getCellInstance('13').col == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('16').row == 5).toBe(true);
            expect((<any>gridLayOut).getCellInstance('16').col == 0).toBe(true);
            let panel: any = [{ id: "dynamic", row: 0, col: 1, sizeX: 1, sizeY: 1 }];
            gridLayOut.addPanel(panel[0]);
            expect((<any>gridLayOut).getCellInstance('0').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('0').col == 0).toBe(true);
            gridLayOut.addPanel({ row: 0, col: 1, sizeX: 1, sizeY: 1 });
        });
        it('Helper element height and width', () => {
            let movingElemnt: HTMLElement = document.getElementById('7');
            let targetElemnt: HTMLElement = document.getElementById('8');
            let mousedown: any = getEventObject('MouseEvents', 'mousedown', movingElemnt, targetElemnt, 0, 0);
            EventHandler.trigger(<HTMLElement>movingElemnt, 'mousedown', mousedown);
            let mousemove: any = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 110, 0);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            expect(((<HTMLElement>gridLayOut.element.querySelectorAll('.e-holder')[0]).style.width)).toBe('58.45px');
            expect(((<HTMLElement>gridLayOut.element.querySelectorAll('.e-holder')[0]).style.height)).toBe('185.35px');
        });
        it('testing args.cancel in dragStart event', () => {
            gridLayOut.dragStart = function (args: DragStartArgs) {
                args.cancel = true;
            };
            let movingElemnt: HTMLElement = document.getElementById('0');
            let targetElemnt: HTMLElement = document.getElementById('2');
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
            mouseup.currentTarget = document;
            EventHandler.trigger(<any>(document), 'mouseup', mouseup)
        });
        it('testing args.cancel in dragStop event', () => {
            gridLayOut.dragStop = function (args: DragStartArgs) {
                args.cancel = true;
            };
            let movingElemnt: HTMLElement = document.getElementById('0');
            let targetElemnt: HTMLElement = document.getElementById('2');
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
            mouseup.currentTarget = document;
            EventHandler.trigger(<any>(document), 'mouseup', mouseup)
        });
        it('Drag Restrict class testing inline rendering', () => {
            document.getElementById('0').classList.add("e-drag-restrict");
            let movingElemnt: HTMLElement = document.getElementById('0');
            let targetElemnt: HTMLElement = document.getElementById('2');
            let mousedown: any = getEventObject('MouseEvents', 'mousedown', movingElemnt, movingElemnt, 0, 0);
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
            mouseup.currentTarget = document;
            EventHandler.trigger(<any>(document), 'mouseup', mouseup);
            expect((<any>gridLayOut).getCellInstance('0').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('0').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('2').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('2').col == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('3').row == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('3').col == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('4').row == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('4').col == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('13').row == 3).toBe(true);
            expect((<any>gridLayOut).getCellInstance('13').col == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('16').row == 4).toBe(true);
            expect((<any>gridLayOut).getCellInstance('16').col == 0).toBe(true);
        });
        it('change and drag event testing', () => {
            gridLayOut.change = function (args: ChangeEventArgs) {
                expect(args.changedPanels.length > 0).toBe(true);
                expect(args.changedPanels.length === 6).toBe(true);
                expect(args.isInteracted === true).toBe(true);
            }
            gridLayOut.dataBind();
            gridLayOut.dragStart = function (args: DragStartArgs) {
                expect(args.element == movingElemnt).toBe(true);
                expect(args.event.type == "mousemove").toBe(true);
            }
            gridLayOut.dataBind();
            gridLayOut.dragStop = function (args: DragStopArgs) {
                expect(args.element == movingElemnt).toBe(true);
                expect(args.event.type == "mouseup").toBe(true);
            }
            gridLayOut.dataBind();
            gridLayOut.drag = function (args: DraggedEventArgs) {
                expect(args.element == movingElemnt).toBe(true);
                expect(args.event.type == "mousemove").toBe(true);
            }
            gridLayOut.dataBind();
            let movingElemnt: HTMLElement = document.getElementById('0');
            let targetElemnt: HTMLElement = document.getElementById('2');
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
            mouseup.currentTarget = document;
            EventHandler.trigger(<any>(document), 'mouseup', mouseup);
            expect((<any>gridLayOut).getCellInstance('0').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('0').col == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('2').row == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('2').col == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('3').row == 3).toBe(true);
            expect((<any>gridLayOut).getCellInstance('3').col == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('4').row == 3).toBe(true);
            expect((<any>gridLayOut).getCellInstance('4').col == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('13').row == 4).toBe(true);
            expect((<any>gridLayOut).getCellInstance('13').col == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('16').row == 5).toBe(true);
            expect((<any>gridLayOut).getCellInstance('16').col == 0).toBe(true);
        });
        it('change event testing with addPanel', () => {
            let changeEventTriggered = false;
            gridLayOut.change = function (args: ChangeEventArgs) {
                changeEventTriggered = true;
            }
            gridLayOut.addPanel({ "sizeX": 1, "sizeY": 1, "row": 1, "col": 0 })
            gridLayOut.dataBind();
            expect(changeEventTriggered).toBe(true);
        });
        it('change event testing with movePanel', () => {
            gridLayOut.change = function (args: ChangeEventArgs) {
                expect(args.changedPanels.length > 0).toBe(true);
                expect(args.changedPanels.length === 6).toBe(true);
                expect(args.isInteracted === true).toBe(false);
            }
            gridLayOut.dataBind();
            gridLayOut.movePanel("0", 0, 1);
            expect((<any>gridLayOut).getCellInstance('0').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('0').col == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('2').row == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('2').col == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('3').row == 3).toBe(true);
            expect((<any>gridLayOut).getCellInstance('3').col == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('4').row == 3).toBe(true);
            expect((<any>gridLayOut).getCellInstance('4').col == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('13').row == 4).toBe(true);
            expect((<any>gridLayOut).getCellInstance('13').col == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('16').row == 5).toBe(true);
            expect((<any>gridLayOut).getCellInstance('16').col == 0).toBe(true);
        });
        it('Swapping test case with moving panels method', () => {
            gridLayOut.movePanel("15", 1, 5);
            let movingElemnt: HTMLElement = document.getElementById('8');
            let targetElemnt: HTMLElement = document.getElementById('15');
            let mousedown: any = getEventObject('MouseEvents', 'mousedown', movingElemnt, targetElemnt, 320, 0);
            EventHandler.trigger(<HTMLElement>movingElemnt, 'mousedown', mousedown);
            let mousemove: any = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 335, 60);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
            mousemove = setMouseCordinates(mousemove, 330, 65);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = setMouseCordinates(mousemove, 325, 120);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = setMouseCordinates(mousemove, 326, 125);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            let mouseup: any = getEventObject('MouseEvents', 'mouseup', movingElemnt, targetElemnt);
            mouseup.type = 'mouseup';
            mouseup.currentTarget = document;
            EventHandler.trigger(<any>(document), 'mouseup', mouseup);
            expect((<any>gridLayOut).getCellInstance('15').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('15').col == 5).toBe(true);
            expect((<any>gridLayOut).getCellInstance('8').row == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('8').col == 5).toBe(true);
            expect((<any>gridLayOut).getCellInstance('10').row == 3).toBe(true);
            expect((<any>gridLayOut).getCellInstance('10').col == 5).toBe(true);
            expect((<any>gridLayOut).getCellInstance('11').row == 3).toBe(true);
            expect((<any>gridLayOut).getCellInstance('11').col == 6).toBe(true);
            expect((<any>gridLayOut).getCellInstance('12').row == 4).toBe(true);
            expect((<any>gridLayOut).getCellInstance('12').col == 7).toBe(true);
            expect((<any>gridLayOut).getCellInstance('9').row == 4).toBe(true);
            expect((<any>gridLayOut).getCellInstance('9').col == 5).toBe(true);
            let panel: any = [{ id: "dynamic", row: 0, col: 1, sizeX: 1, sizeY: 1 }];
            gridLayOut.addPanel(panel[0]);
            expect((<any>gridLayOut).getCellInstance('0').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('0').col == 0).toBe(true);
        });

        it('Swapping test case with moving panels method reverse direction', () => {
            gridLayOut.movePanel("15", 0, 5);
            let movingElemnt: HTMLElement = document.getElementById('8');
            let targetElemnt: HTMLElement = document.getElementById('15');
            let mousedown: any = getEventObject('MouseEvents', 'mousedown', movingElemnt, targetElemnt, 320, 125);
            EventHandler.trigger(<HTMLElement>movingElemnt, 'mousedown', mousedown);
            let mousemove: any = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 335, 100);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
            mousemove = setMouseCordinates(mousemove, 330, 65);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = setMouseCordinates(mousemove, 325, 60);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = setMouseCordinates(mousemove, 326, 0);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = setMouseCordinates(mousemove, 325, 1);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            let mouseup: any = getEventObject('MouseEvents', 'mouseup', movingElemnt, targetElemnt);
            mouseup.type = 'mouseup';
            mouseup.currentTarget = document;
            EventHandler.trigger(<any>(document), 'mouseup', mouseup);
            expect((<any>gridLayOut).getCellInstance('15').row == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('15').col == 5).toBe(true);
            expect((<any>gridLayOut).getCellInstance('8').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('8').col == 5).toBe(true);
            expect((<any>gridLayOut).getCellInstance('10').row == 3).toBe(true);
            expect((<any>gridLayOut).getCellInstance('10').col == 5).toBe(true);
            expect((<any>gridLayOut).getCellInstance('11').row == 3).toBe(true);
            expect((<any>gridLayOut).getCellInstance('11').col == 6).toBe(true);
            expect((<any>gridLayOut).getCellInstance('12').row == 4).toBe(true);
            expect((<any>gridLayOut).getCellInstance('12').col == 7).toBe(true);
            expect((<any>gridLayOut).getCellInstance('9').row == 4).toBe(true);
            expect((<any>gridLayOut).getCellInstance('9').col == 5).toBe(true);
            let panel: any = [{ id: "dynamic", row: 0, col: 1, sizeX: 1, sizeY: 1 }];
            gridLayOut.addPanel(panel[0]);
            expect((<any>gridLayOut).getCellInstance('0').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('0').col == 0).toBe(true);
        });

        it('Sudden Dragging element 0 (1 ,1) over 2 (2,2)', () => {
            let movingElemnt: HTMLElement = document.getElementById('0');
            let targetElemnt: HTMLElement = document.getElementById('2');
            let mousedown: any = getEventObject('MouseEvents', 'mousedown', movingElemnt, targetElemnt, 0, 0);
            EventHandler.trigger(<HTMLElement>movingElemnt, 'mousedown', mousedown);
            let mousemove: any = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 60, 0);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
            mousemove = setMouseCordinates(mousemove, 62, 0);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            let mouseup: any = getEventObject('MouseEvents', 'mouseup', movingElemnt, targetElemnt);
            mouseup.type = 'mouseup';
            mouseup.currentTarget = document;
            EventHandler.trigger(<any>(document), 'mouseup', mouseup);
            EventHandler.trigger(<any>(document), 'mouseup', mouseup);
            expect((<any>gridLayOut).getCellInstance('0').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('0').col == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('2').row == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('2').col == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('3').row == 3).toBe(true);
            expect((<any>gridLayOut).getCellInstance('3').col == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('4').row == 3).toBe(true);
            expect((<any>gridLayOut).getCellInstance('4').col == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('13').row == 4).toBe(true);
            expect((<any>gridLayOut).getCellInstance('13').col == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('16').row == 5).toBe(true);
            expect((<any>gridLayOut).getCellInstance('16').col == 0).toBe(true);
        });


        it('Pushing false and checking for the changes', () => {
            gridLayOut.allowPushing = false;
            let movingElemnt: HTMLElement = document.getElementById('0');
            let targetElemnt: HTMLElement = document.getElementById('2');
            let mousedown: any = getEventObject('MouseEvents', 'mousedown', movingElemnt, targetElemnt, 0, 0);
            EventHandler.trigger(<HTMLElement>movingElemnt, 'mousedown', mousedown);
            let mousemove: any = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 60, 0);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
            mousemove = setMouseCordinates(mousemove, 62, 0);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            let mouseup: any = getEventObject('MouseEvents', 'mouseup', movingElemnt, targetElemnt);
            mouseup.type = 'mouseup';
            mouseup.currentTarget = document;
            EventHandler.trigger(<any>(document), 'mouseup', mouseup);
            expect((<any>gridLayOut).getCellInstance('0').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('0').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('2').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('2').col == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('3').row == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('3').col == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('4').row == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('4').col == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('13').row == 3).toBe(true);
            expect((<any>gridLayOut).getCellInstance('13').col == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('16').row == 4).toBe(true);
            expect((<any>gridLayOut).getCellInstance('16').col == 0).toBe(true);
        });

        it('Dragging element 1 (2 ,1) over 2 (2,2)', () => {
            let movingElemnt: HTMLElement = document.getElementById('1');
            let targetElemnt: HTMLElement = document.getElementById('2');
            let mousedown: any = getEventObject('MouseEvents', 'mousedown', movingElemnt, targetElemnt, 0, 55);
            EventHandler.trigger(<HTMLElement>movingElemnt, 'mousedown', mousedown);
            let mousemove: any = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 55, 55);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
            mousemove = setMouseCordinates(mousemove, 55, 55);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = setMouseCordinates(mousemove, 55, 57);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            let mouseup: any = getEventObject('MouseEvents', 'mouseup', movingElemnt, targetElemnt);
            mouseup.type = 'mouseup';
            mouseup.currentTarget = document;
            EventHandler.trigger(<any>(document), 'mouseup', mouseup);
            expect((<any>gridLayOut).getCellInstance('1').row == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('1').col == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('2').row == 3).toBe(true);
            expect((<any>gridLayOut).getCellInstance('2').col == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('3').row == 5).toBe(true);
            expect((<any>gridLayOut).getCellInstance('3').col == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('4').row == 5).toBe(true);
            expect((<any>gridLayOut).getCellInstance('4').col == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('13').row == 6).toBe(true);
            expect((<any>gridLayOut).getCellInstance('13').col == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('16').row == 7).toBe(true);
            expect((<any>gridLayOut).getCellInstance('16').col == 0).toBe(true);
        });

        it('Dragging element 14 (1 ,1) over 13 (3,1)', () => {
            let movingElemnt: HTMLElement = document.getElementById('14');
            let targetElemnt: HTMLElement = document.getElementById('13');
            let mousedown: any = getEventObject('MouseEvents', 'mousedown', movingElemnt, targetElemnt, 0, 165);
            EventHandler.trigger(<HTMLElement>movingElemnt, 'mousedown', mousedown);
            let mousemove: any = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 55, 165);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
            mousemove = setMouseCordinates(mousemove, 55, 165);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = setMouseCordinates(mousemove, 57, 165);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            let mouseup: any = getEventObject('MouseEvents', 'mouseup', movingElemnt, targetElemnt);
            mouseup.type = 'mouseup';
            mouseup.currentTarget = document;
            EventHandler.trigger(<any>(document), 'mouseup', mouseup);
            expect((<any>gridLayOut).getCellInstance('14').row == 3).toBe(true);
            expect((<any>gridLayOut).getCellInstance('14').col == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('13').row == 4).toBe(true);
            expect((<any>gridLayOut).getCellInstance('13').col == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('16').row == 5).toBe(true);
            expect((<any>gridLayOut).getCellInstance('16').col == 0).toBe(true);
        });

        it('Dragging element 2 (2 ,2) over 5 and 6 (1,1)', () => {
            let movingElemnt: HTMLElement = document.getElementById('2');
            let targetElemnt: HTMLElement = document.getElementById('5');
            let mousedown: any = getEventObject('MouseEvents', 'mousedown', movingElemnt, targetElemnt, 55, 0);
            EventHandler.trigger(<HTMLElement>movingElemnt, 'mousedown', mousedown);
            let mousemove: any = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 120, 0);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
            mousemove = setMouseCordinates(mousemove, 120, 0);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = setMouseCordinates(mousemove, 122, 0);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            let mouseup: any = getEventObject('MouseEvents', 'mouseup', movingElemnt, targetElemnt);
            mouseup.type = 'mouseup';
            mouseup.currentTarget = document;
            EventHandler.trigger(<any>(document), 'mouseup', mouseup);
            expect((<any>gridLayOut).getCellInstance('2').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('2').col == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('5').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('5').col == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('6').row == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('6').col == 1).toBe(true);
        });

        it('Dragging element 2 (2 ,2) over 0 (1,1)', () => {
            let movingElemnt: HTMLElement = document.getElementById('2');
            let targetElemnt: HTMLElement = document.getElementById('0');
            let mousedown: any = getEventObject('MouseEvents', 'mousedown', movingElemnt, targetElemnt, 55, 0);
            EventHandler.trigger(<HTMLElement>movingElemnt, 'mousedown', mousedown);
            let mousemove: any = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 0, 0);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
            mousemove = setMouseCordinates(mousemove, 0, 0);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = setMouseCordinates(mousemove, 0, 0);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            let mouseup: any = getEventObject('MouseEvents', 'mouseup', movingElemnt, targetElemnt);
            mouseup.type = 'mouseup';
            mouseup.currentTarget = document;
            EventHandler.trigger(<any>(document), 'mouseup', mouseup);
            expect((<any>gridLayOut).getCellInstance('2').row).toBe(0);
            expect((<any>gridLayOut).getCellInstance('2').col).toBe(0);
            expect((<any>gridLayOut).getCellInstance('0').row).toBe(0);
            expect((<any>gridLayOut).getCellInstance('0').col).toBe(2);
            expect((<any>gridLayOut).getCellInstance('1').row).toBe(2);
            expect((<any>gridLayOut).getCellInstance('1').col).toBe(0);
            expect((<any>gridLayOut).getCellInstance('14').row).toBe(4);
            expect((<any>gridLayOut).getCellInstance('14').col).toBe(0);
            expect((<any>gridLayOut).getCellInstance('16').row).toBe(5);
            expect((<any>gridLayOut).getCellInstance('16').col).toBe(0);
        });

        it('Dragging element 7 (1 ,3) over 5 and 6 (1,1)', () => {
            let movingElemnt: HTMLElement = document.getElementById('7');
            let targetElemnt: HTMLElement = document.getElementById('5');
            let mousedown: any = getEventObject('MouseEvents', 'mousedown', movingElemnt, targetElemnt, 220, 0);
            EventHandler.trigger(<HTMLElement>movingElemnt, 'mousedown', mousedown);
            let mousemove: any = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 210, 0);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
            mousemove.element = movingElemnt;
            mousemove = setMouseCordinates(mousemove, 170, 0);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = setMouseCordinates(mousemove, 165, 10);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            let mouseup: any = getEventObject('MouseEvents', 'mouseup', movingElemnt, targetElemnt);
            mouseup.type = 'mouseup';
            mouseup.currentTarget = document;
            EventHandler.trigger(<any>(document), 'mouseup', mouseup);
            expect((<any>gridLayOut).getCellInstance('5').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('5').col == 4).toBe(true);
            expect((<any>gridLayOut).getCellInstance('6').row == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('6').col == 4).toBe(true);
            expect((<any>gridLayOut).getCellInstance('7').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('7').col == 3).toBe(true);
            expect((<any>gridLayOut).getCellInstance('4').col == 2).toBe(true);
            expect((<any>gridLayOut).getCellInstance('4').row == 3).toBe(true);
            expect((<any>gridLayOut).getCellInstance('13').col == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('13').row == 4).toBe(true);
            expect((<any>gridLayOut).getCellInstance('16').col == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('16').row == 5).toBe(true);
        });

        it('Dragging element 7 (1 ,3) over 8 (3,1)', () => {
            let movingElemnt: HTMLElement = document.getElementById('7');
            let targetElemnt: HTMLElement = document.getElementById('8');
            let mousedown: any = getEventObject('MouseEvents', 'mousedown', movingElemnt, targetElemnt, 55, 0);
            EventHandler.trigger(<HTMLElement>movingElemnt, 'mousedown', mousedown);
            let mousemove: any = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 100, 0);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
            mousemove = setMouseCordinates(mousemove, 100, 0);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = setMouseCordinates(mousemove, 102, 0);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            let mouseup: any = getEventObject('MouseEvents', 'mouseup', movingElemnt, targetElemnt);
            mouseup.type = 'mouseup';
            mouseup.currentTarget = document;
            EventHandler.trigger(<any>(document), 'mouseup', mouseup);
            expect((<any>gridLayOut).getCellInstance('8').row == 3).toBe(true);
            expect((<any>gridLayOut).getCellInstance('8').col == 5).toBe(true);
            expect((<any>gridLayOut).getCellInstance('10').row == 4).toBe(true);
            expect((<any>gridLayOut).getCellInstance('10').col == 5).toBe(true);
            expect((<any>gridLayOut).getCellInstance('7').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('7').col == 5).toBe(true);
            expect((<any>gridLayOut).getCellInstance('11').col == 6).toBe(true);
            expect((<any>gridLayOut).getCellInstance('11').row == 4).toBe(true);
            expect((<any>gridLayOut).getCellInstance('9').col == 5).toBe(true);
            expect((<any>gridLayOut).getCellInstance('9').row == 5).toBe(true);
            expect((<any>gridLayOut).getCellInstance('12').col == 7).toBe(true);
            expect((<any>gridLayOut).getCellInstance('12').row == 5).toBe(true);
            expect((<any>gridLayOut).getCellInstance('15').row == 6).toBe(true);
            expect((<any>gridLayOut).getCellInstance('15').col == 5).toBe(true);
        });

        it('Dragging element 8 (3 ,1) over 10 (1,1) and 11 (2,1)', () => {
            let movingElemnt: HTMLElement = document.getElementById('8');
            let targetElemnt: HTMLElement = document.getElementById('10');
            let mousedown: any = getEventObject('MouseEvents', 'mousedown', movingElemnt, targetElemnt, 275, 0);
            EventHandler.trigger(<HTMLElement>movingElemnt, 'mousedown', mousedown);
            let mousemove: any = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 275, 55);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
            mousemove = setMouseCordinates(mousemove, 275, 55);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = setMouseCordinates(mousemove, 275, 55);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            let mouseup: any = getEventObject('MouseEvents', 'mouseup', movingElemnt, targetElemnt);
            mouseup.type = 'mouseup';
            mouseup.currentTarget = document;
            EventHandler.trigger(<any>(document), 'mouseup', mouseup);
            expect((<any>gridLayOut).getCellInstance('8').row == 1).toBe(true);
            expect((<any>gridLayOut).getCellInstance('8').col == 5).toBe(true);
            expect((<any>gridLayOut).getCellInstance('10').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('10').col == 5).toBe(true);
            expect((<any>gridLayOut).getCellInstance('11').row == 0).toBe(true);
            expect((<any>gridLayOut).getCellInstance('11').col == 6).toBe(true);
        });

        it('Dragging element 17 (1 ,4) down over 18 (3,3)', function () {
            let movingElemnt: HTMLElement;
            let targetElemnt: HTMLElement;
            let mousedown: any;
            let mousemove: any;
            let mouseup: any;
            movingElemnt = document.getElementById('17');
            targetElemnt = document.getElementById('18');
            mousedown = getEventObject('MouseEvents', 'mousedown', movingElemnt, targetElemnt, 440, 0);
            EventHandler.trigger(movingElemnt, 'mousedown', mousedown);
            mousemove = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 495, 0);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
            mousemove = setMouseCordinates(mousemove, 495, 0);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = setMouseCordinates(mousemove, 495, 0);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mouseup = getEventObject('MouseEvents', 'mouseup', movingElemnt, targetElemnt);
            mouseup.type = 'mouseup';
            mouseup.currentTarget = document;
            EventHandler.trigger(<any>(document), 'mouseup', mouseup);
            expect((<any>gridLayOut).getCellInstance('17').row).toBe(0);
            expect((<any>gridLayOut).getCellInstance('17').col).toBe(9);
            expect((<any>gridLayOut).getCellInstance('18').row).toBe(0);
            expect((<any>gridLayOut).getCellInstance('18').col).toBe(10);
            expect((<any>gridLayOut).getCellInstance('19').row).toBe(4);
            expect((<any>gridLayOut).getCellInstance('19').col).toBe(9);
            expect((<any>gridLayOut).getCellInstance('21').col).toBe(8);
            expect((<any>gridLayOut).getCellInstance('21').row).toBe(5);
        });

        it('Dragging element 17 (1 ,4) down over 18 (3,3)', function () {
            let movingElemnt: HTMLElement;
            let targetElemnt: HTMLElement;
            let mousedown: any;
            let mousemove: any;
            let mouseup: any;
            movingElemnt = document.getElementById('17');
            targetElemnt = document.getElementById('18');
            mousedown = getEventObject('MouseEvents', 'mousedown', movingElemnt, targetElemnt, 440, 0);
            EventHandler.trigger(movingElemnt, 'mousedown', mousedown);
            mousemove = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 495, 0);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
            mousemove = setMouseCordinates(mousemove, 495, 0);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = setMouseCordinates(mousemove, 495, 0);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mouseup = getEventObject('MouseEvents', 'mouseup', movingElemnt, targetElemnt);
            mouseup.type = 'mouseup';
            mouseup.currentTarget = document;
            EventHandler.trigger(<any>(document), 'mouseup', mouseup);
            expect((<any>gridLayOut).getCellInstance('17').row).toBe(0);
            expect((<any>gridLayOut).getCellInstance('17').col).toBe(9);
            expect((<any>gridLayOut).getCellInstance('18').row).toBe(0);
            expect((<any>gridLayOut).getCellInstance('18').col).toBe(10);
            expect((<any>gridLayOut).getCellInstance('19').row).toBe(4);
            expect((<any>gridLayOut).getCellInstance('19').col).toBe(9);
            expect((<any>gridLayOut).getCellInstance('21').col).toBe(8);
            expect((<any>gridLayOut).getCellInstance('21').row).toBe(5);
        });

        it('Dragging element 2 (2,2) down over 3 (1,1) and 4 (1,2)', function () {
            let movingElemnt: HTMLElement;
            let targetElemnt: HTMLElement;
            let mousedown: any;
            let mousemove: any;
            let mouseup: any;
            movingElemnt = document.getElementById('2');
            targetElemnt = document.getElementById('3');
            mousedown = getEventObject('MouseEvents', 'mousedown', movingElemnt, targetElemnt, 55, 0);
            EventHandler.trigger(movingElemnt, 'mousedown', mousedown);
            mousemove = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 55, 55);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
            mousemove = setMouseCordinates(mousemove, 55, 55);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = setMouseCordinates(mousemove, 55, 57);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = setMouseCordinates(mousemove, 55, 57);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mouseup = getEventObject('MouseEvents', 'mouseup', movingElemnt, targetElemnt);
            mouseup.type = 'mouseup';
            mouseup.currentTarget = document;
            EventHandler.trigger(<any>(document), 'mouseup', mouseup);
            expect((<any>gridLayOut).getCellInstance('2').row).toBe(1);
            expect((<any>gridLayOut).getCellInstance('2').col).toBe(1);
            expect((<any>gridLayOut).getCellInstance('3').row).toBe(0);
            expect((<any>gridLayOut).getCellInstance('3').col).toBe(1);
            expect((<any>gridLayOut).getCellInstance('4').row).toBe(3);
            expect((<any>gridLayOut).getCellInstance('4').col).toBe(2);
            expect((<any>gridLayOut).getCellInstance('13').col).toBe(1);
            expect((<any>gridLayOut).getCellInstance('13').row).toBe(4);
            expect((<any>gridLayOut).getCellInstance('16').row).toBe(5);
            expect((<any>gridLayOut).getCellInstance('16').col).toBe(0);
        });

        it('Dragging element 8 (3,1) down over 10 (1,1) and 11 (1,2)', function () {
            let movingElemnt: HTMLElement;
            let targetElemnt: HTMLElement;
            let mousedown: any;
            let mousemove: any;
            let mouseup: any;
            movingElemnt = document.getElementById('8');
            targetElemnt = document.getElementById('10');
            mousedown = getEventObject('MouseEvents', 'mousedown', movingElemnt, targetElemnt, 280, 0);
            EventHandler.trigger(movingElemnt, 'mousedown', mousedown);
            mousemove = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 280, 55);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
            mousemove = setMouseCordinates(mousemove, 280, 55);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = setMouseCordinates(mousemove, 280, 57);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mouseup = getEventObject('MouseEvents', 'mouseup', movingElemnt, targetElemnt);
            mouseup.type = 'mouseup';
            mouseup.currentTarget = document;
            EventHandler.trigger(<any>(document), 'mouseup', mouseup);
            expect((<any>gridLayOut).getCellInstance('8').row).toBe(1);
            expect((<any>gridLayOut).getCellInstance('8').col).toBe(5);
            expect((<any>gridLayOut).getCellInstance('10').row).toBe(0);
            expect((<any>gridLayOut).getCellInstance('10').col).toBe(5);
            expect((<any>gridLayOut).getCellInstance('11').row).toBe(0);
            expect((<any>gridLayOut).getCellInstance('11').col).toBe(6);
        });

        it('continious Dragging of element 2 (2,2) down over 3 (1,1) and 4 (1,2)', function () {
            let movingElemnt: HTMLElement;
            let targetElemnt: HTMLElement;
            let mousedown: any;
            let mousemove: any;
            let mouseup: any;
            movingElemnt = document.getElementById('2');
            targetElemnt = document.getElementById('3');
            mousedown = getEventObject('MouseEvents', 'mousedown', movingElemnt, targetElemnt, 55, 0);
            EventHandler.trigger(movingElemnt, 'mousedown', mousedown);
            mousemove = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 55, 55);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
            mousemove = setMouseCordinates(mousemove, 55, 55);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = setMouseCordinates(mousemove, 55, 57);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = setMouseCordinates(mousemove, 55, 57);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            expect((<any>gridLayOut).getCellInstance('2').row).toBe(1);
            expect((<any>gridLayOut).getCellInstance('2').col).toBe(1);
            expect((<any>gridLayOut).getCellInstance('3').row).toBe(0);
            expect((<any>gridLayOut).getCellInstance('3').col).toBe(1);
            expect((<any>gridLayOut).getCellInstance('4').row).toBe(3);
            expect((<any>gridLayOut).getCellInstance('4').col).toBe(2);
            expect((<any>gridLayOut).getCellInstance('13').col).toBe(1);
            expect((<any>gridLayOut).getCellInstance('13').row).toBe(4);
            expect((<any>gridLayOut).getCellInstance('16').row).toBe(5);
            expect((<any>gridLayOut).getCellInstance('16').col).toBe(0);
            mousemove = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 55, 110);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
            mousemove = setMouseCordinates(mousemove, 55, 110);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = setMouseCordinates(mousemove, 55, 112);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = setMouseCordinates(mousemove, 55, 112);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            expect((<any>gridLayOut).getCellInstance('2').row).toBe(2);
            expect((<any>gridLayOut).getCellInstance('2').col).toBe(1);
            expect((<any>gridLayOut).getCellInstance('3').row).toBe(1);
            expect((<any>gridLayOut).getCellInstance('3').col).toBe(1);
            expect((<any>gridLayOut).getCellInstance('4').row).toBe(4);
            expect((<any>gridLayOut).getCellInstance('4').col).toBe(2);
            expect((<any>gridLayOut).getCellInstance('13').col).toBe(1);
            expect((<any>gridLayOut).getCellInstance('13').row).toBe(5);
            expect((<any>gridLayOut).getCellInstance('16').row).toBe(6);
            expect((<any>gridLayOut).getCellInstance('16').col).toBe(0);
            mouseup = getEventObject('MouseEvents', 'mouseup', movingElemnt, targetElemnt);
            mouseup.currentTarget = document;
            mouseup.type = 'mouseup';
            EventHandler.trigger(<any>(document), 'mouseup', mouseup);
        });

        it('continuos Dragging element 17 (1 ,4) down over 18 (3,3)', function () {
            let movingElemnt: HTMLElement;
            let targetElemnt: HTMLElement;
            let mousedown: any;
            let mousemove: any;
            let mouseup: any;
            movingElemnt = document.getElementById('17');
            targetElemnt = document.getElementById('18');
            mousedown = getEventObject('MouseEvents', 'mousedown', movingElemnt, targetElemnt, 440, 0);
            EventHandler.trigger(movingElemnt, 'mousedown', mousedown);
            mousemove = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 495, 0);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
            mousemove = setMouseCordinates(mousemove, 495, 0);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = setMouseCordinates(mousemove, 495, 0);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            expect((<any>gridLayOut).getCellInstance('17').row).toBe(0);
            expect((<any>gridLayOut).getCellInstance('17').col).toBe(9);
            expect((<any>gridLayOut).getCellInstance('18').row).toBe(0);
            expect((<any>gridLayOut).getCellInstance('18').col).toBe(10);
            expect((<any>gridLayOut).getCellInstance('19').row).toBe(4);
            expect((<any>gridLayOut).getCellInstance('19').col).toBe(9);
            expect((<any>gridLayOut).getCellInstance('21').col).toBe(8);
            expect((<any>gridLayOut).getCellInstance('21').row).toBe(5);
            mousemove = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 500, 0);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
            mousemove = setMouseCordinates(mousemove, 540, 0);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = setMouseCordinates(mousemove, 545, 0);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            expect((<any>gridLayOut).getCellInstance('17').row).toBe(0);
            expect((<any>gridLayOut).getCellInstance('17').col).toBe(10);
            expect((<any>gridLayOut).getCellInstance('18').row).toBe(0);
            expect((<any>gridLayOut).getCellInstance('18').col).toBe(10);
            expect((<any>gridLayOut).getCellInstance('19').row).toBe(4);
            expect((<any>gridLayOut).getCellInstance('19').col).toBe(9);
            expect((<any>gridLayOut).getCellInstance('21').col).toBe(8);
            expect((<any>gridLayOut).getCellInstance('21').row).toBe(5);
            mouseup = getEventObject('MouseEvents', 'mouseup', movingElemnt, targetElemnt);
            mouseup.type = 'mouseup';
            mouseup.currentTarget = document;
            EventHandler.trigger(<any>(document), 'mouseup', mouseup);
        });

        it('continuos Dragging element 15 (1 ,4) left and up over 2 (2,2)', function () {
            let movingElemnt: HTMLElement;
            let targetElemnt: HTMLElement;
            let mousedown: any;
            let mousemove: any;
            let mouseup: any;
            movingElemnt = document.getElementById('15');
            targetElemnt = document.getElementById('13');
            mousedown = getEventObject('MouseEvents', 'mousedown', movingElemnt, targetElemnt, 280, 170);
            EventHandler.trigger(movingElemnt, 'mousedown', mousedown);
            mousemove = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 255, 170);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
            mousemove = setMouseCordinates(mousemove, 200, 170);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = setMouseCordinates(mousemove, 150, 170);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = setMouseCordinates(mousemove, 60, 170);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = setMouseCordinates(mousemove, 60, 170);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = setMouseCordinates(mousemove, 20, 170);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = setMouseCordinates(mousemove, 20, 170);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            expect((<any>gridLayOut).getCellInstance('15').row).toBe(3);
            expect((<any>gridLayOut).getCellInstance('15').col).toBe(1);
            expect((<any>gridLayOut).getCellInstance('13').row).toBe(5);
            expect((<any>gridLayOut).getCellInstance('13').col).toBe(1);
            expect((<any>gridLayOut).getCellInstance('16').row).toBe(6);
            expect((<any>gridLayOut).getCellInstance('16').col).toBe(0);
            targetElemnt = document.getElementById('3');
            mousemove = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 70, 100);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
            mousemove = setMouseCordinates(mousemove, 30, 100);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = setMouseCordinates(mousemove, 30, 90);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            expect((<any>gridLayOut).getCellInstance('15').row).toBe(2);
            expect((<any>gridLayOut).getCellInstance('15').col).toBe(1);
            expect((<any>gridLayOut).getCellInstance('3').row).toBe(4);
            expect((<any>gridLayOut).getCellInstance('3').col).toBe(1);
            expect((<any>gridLayOut).getCellInstance('4').row).toBe(4);
            expect((<any>gridLayOut).getCellInstance('4').col).toBe(2);
            targetElemnt = document.getElementById('2');
            mousemove = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 65, 75);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
            mousemove = setMouseCordinates(mousemove, 25, 60);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = setMouseCordinates(mousemove, 25, 60);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = setMouseCordinates(mousemove, 20, 0);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = setMouseCordinates(mousemove, 20, 0);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = setMouseCordinates(mousemove, 20, 0);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mouseup = getEventObject('MouseEvents', 'mouseup', movingElemnt, targetElemnt);
            mouseup.type = 'mouseup';
            mouseup.currentTarget = document;
            EventHandler.trigger(<any>(document), 'mouseup', mouseup);
            expect((<any>gridLayOut).getCellInstance('15').row).toBe(0);
            expect((<any>gridLayOut).getCellInstance('15').col).toBe(1);
            expect((<any>gridLayOut).getCellInstance('2').row).toBe(2);
            expect((<any>gridLayOut).getCellInstance('2').col).toBe(1);
            expect((<any>gridLayOut).getCellInstance('5').col).toBe(3);
            expect((<any>gridLayOut).getCellInstance('5').row).toBe(2);
            expect((<any>gridLayOut).getCellInstance('6').col).toBe(3);
            expect((<any>gridLayOut).getCellInstance('6').row).toBe(3);
        });

        it('continuos Dragging element 0 (1 ,1) and coming back to same position', function () {
            gridLayOut.allowFloating = true;
            let movingElemnt: HTMLElement;
            let targetElemnt: HTMLElement;
            let mousedown: any;
            let mousemove: any;
            let mouseup: any;
            movingElemnt = document.getElementById('0');
            targetElemnt = document.getElementById('2');
            mousedown = getEventObject('MouseEvents', 'mousedown', movingElemnt, targetElemnt, 0, 0);
            EventHandler.trigger(movingElemnt, 'mousedown', mousedown);
            mousemove = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 55, 10);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
            mousemove = setMouseCordinates(mousemove, 55, 15);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = setMouseCordinates(mousemove, 55, 15);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            expect((<any>gridLayOut).getCellInstance('0').row).toBe(0);
            expect((<any>gridLayOut).getCellInstance('0').col).toBe(1);
            expect((<any>gridLayOut).getCellInstance('2').row).toBe(1);
            expect((<any>gridLayOut).getCellInstance('2').col).toBe(1);
            expect((<any>gridLayOut).getCellInstance('3').row).toBe(3);
            expect((<any>gridLayOut).getCellInstance('3').col).toBe(1);
            expect((<any>gridLayOut).getCellInstance('4').row).toBe(3);
            expect((<any>gridLayOut).getCellInstance('4').col).toBe(2);
            expect((<any>gridLayOut).getCellInstance('13').row).toBe(4);
            expect((<any>gridLayOut).getCellInstance('13').col).toBe(1);
            expect((<any>gridLayOut).getCellInstance('16').row).toBe(5);
            expect((<any>gridLayOut).getCellInstance('16').col).toBe(0);
            targetElemnt = document.getElementById('5');
            mousemove = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 170, 0);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
            mousemove = setMouseCordinates(mousemove, 165, 0);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = setMouseCordinates(mousemove, 165, 0);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            expect((<any>gridLayOut).getCellInstance('0').row).toBe(0);
            expect((<any>gridLayOut).getCellInstance('0').col).toBe(3);
            expect((<any>gridLayOut).getCellInstance('5').row).toBe(1);
            expect((<any>gridLayOut).getCellInstance('5').col).toBe(3);
            expect((<any>gridLayOut).getCellInstance('6').row).toBe(2);
            expect((<any>gridLayOut).getCellInstance('6').col).toBe(3);
            expect((<any>gridLayOut).getCellInstance('4').row).toBe(3);
            expect((<any>gridLayOut).getCellInstance('4').col).toBe(2);
            expect((<any>gridLayOut).getCellInstance('13').row).toBe(4);
            expect((<any>gridLayOut).getCellInstance('13').col).toBe(1);
            expect((<any>gridLayOut).getCellInstance('16').row).toBe(5);
            expect((<any>gridLayOut).getCellInstance('16').col).toBe(0);
            targetElemnt = document.getElementById('5');
            mousemove = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 120, 0);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
            mousemove = setMouseCordinates(mousemove, 110, 0);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = setMouseCordinates(mousemove, 110, 0);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            expect((<any>gridLayOut).getCellInstance('0').row).toBe(0);
            expect((<any>gridLayOut).getCellInstance('0').col).toBe(2);
            expect((<any>gridLayOut).getCellInstance('5').row).toBe(0);
            expect((<any>gridLayOut).getCellInstance('5').col).toBe(3);
            targetElemnt = document.getElementById('1');
            mousemove = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 20, 0);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
            mousemove = setMouseCordinates(mousemove, 0, 0);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = setMouseCordinates(mousemove, 0, 0);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            expect((<any>gridLayOut).getCellInstance('0').row).toBe(0);
            expect((<any>gridLayOut).getCellInstance('0').col).toBe(0);
            expect((<any>gridLayOut).getCellInstance('2').row).toBe(0);
            expect((<any>gridLayOut).getCellInstance('2').col).toBe(1);
            expect((<any>gridLayOut).getCellInstance('3').row).toBe(2);
            expect((<any>gridLayOut).getCellInstance('3').col).toBe(1);
            expect((<any>gridLayOut).getCellInstance('4').row).toBe(2);
            expect((<any>gridLayOut).getCellInstance('4').col).toBe(2);
            expect((<any>gridLayOut).getCellInstance('13').row).toBe(3);
            expect((<any>gridLayOut).getCellInstance('13').col).toBe(1);
            expect((<any>gridLayOut).getCellInstance('16').row).toBe(4);
            expect((<any>gridLayOut).getCellInstance('16').col).toBe(0);
            mouseup = getEventObject('MouseEvents', 'mouseup', movingElemnt, targetElemnt);
            mouseup.type = 'mouseup';
            mouseup.currentTarget = document;
            EventHandler.trigger(<any>(document), 'mouseup', mouseup);
        });

        it('continuos Dragging element 2 (2 ,2) and checking for allowFloating wihtout allowing allowFloating', function () {
            gridLayOut.allowFloating = true;
            let movingElemnt: HTMLElement;
            let targetElemnt: HTMLElement;
            let mousedown: any;
            let mousemove: any;
            let mouseup: any;
            movingElemnt = document.getElementById('2');
            targetElemnt = document.getElementById('5');
            mousedown = getEventObject('MouseEvents', 'mousedown', movingElemnt, targetElemnt, 55, 0);
            EventHandler.trigger(movingElemnt, 'mousedown', mousedown);
            mousemove = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 110, 0);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
            mousemove = setMouseCordinates(mousemove, 115, 0);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = setMouseCordinates(mousemove, 120, 0);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            expect((<any>gridLayOut).getCellInstance('2').row).toBe(0);
            expect((<any>gridLayOut).getCellInstance('2').col).toBe(2);
            expect((<any>gridLayOut).getCellInstance('5').row).toBe(0);
            expect((<any>gridLayOut).getCellInstance('5').col).toBe(1);
            expect((<any>gridLayOut).getCellInstance('6').row).toBe(1);
            expect((<any>gridLayOut).getCellInstance('6').col).toBe(1);
            targetElemnt = document.getElementById('7');
            mousemove = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 165, 0);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
            mousemove = setMouseCordinates(mousemove, 170, 0);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = setMouseCordinates(mousemove, 170, 0);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            expect((<any>gridLayOut).getCellInstance('2').row).toBe(0);
            expect((<any>gridLayOut).getCellInstance('2').col).toBe(3);
            expect((<any>gridLayOut).getCellInstance('7').row).toBe(2);
            expect((<any>gridLayOut).getCellInstance('7').col).toBe(4);
            expect((<any>gridLayOut).getCellInstance('13').row).toBe(5);
            expect((<any>gridLayOut).getCellInstance('13').col).toBe(1);
            expect((<any>gridLayOut).getCellInstance('16').row).toBe(6);
            expect((<any>gridLayOut).getCellInstance('16').col).toBe(0);
            mouseup = getEventObject('MouseEvents', 'mouseup', movingElemnt, targetElemnt);
            mouseup.type = 'mouseup';
            mouseup.currentTarget = document;
            EventHandler.trigger(<any>(document), 'mouseup', mouseup);
        });
    });
    it('Swapping test cases top to bottom', () => {
        let ele: HTMLElement = createElement('div', { id: 'gridlayout' });
        let parentEle: HTMLElement = createElement('div', { id: 'container' });
        parentEle.style.width = '1264px';
        parentEle.appendChild(ele);
        document.body.appendChild(parentEle);
        let gridLayOut = new DashboardLayout({
            cellAspectRatio: 1,
            columns: 20,
            cellSpacing: [5, 5],
            allowFloating: false,
            panels: [{ id: '1', sizeX: 1, sizeY: 1, row: 1, col: 3 },
            { id: '2', sizeX: 1, sizeY: 1, row: 1, col: 2 },
            { id: '3', sizeX: 2, sizeY: 1, row: 0, col: 2 },
            ]
        });
        gridLayOut.appendTo('#gridlayout');
        let CellElements: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>gridLayOut.element.querySelectorAll('.e-panel');
        setCss(CellElements);
        let movingElemnt: HTMLElement = document.getElementById('3');
        let targetElemnt: HTMLElement = document.getElementById('2');
        let mousedown: any = getEventObject('MouseEvents', 'mousedown', movingElemnt, targetElemnt, 60, 0);
        EventHandler.trigger(<HTMLElement>movingElemnt, 'mousedown', mousedown);
        let mousemove: any = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 55, 0);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
        mousemove = setMouseCordinates(mousemove, 55, 60);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove = setMouseCordinates(mousemove, 55, 60);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove = setMouseCordinates(mousemove, 55, 60);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        let mouseup: any = getEventObject('MouseEvents', 'mouseup', movingElemnt, targetElemnt);
        mouseup.type = 'mouseup'
        EventHandler.trigger(<any>(document), 'mouseup', mouseup);
        expect((<any>gridLayOut).getCellInstance('1').row == 0).toBe(true);
        expect((<any>gridLayOut).getCellInstance('1').col == 3).toBe(true);
        expect((<any>gridLayOut).getCellInstance('2').row == 0).toBe(true);
        expect((<any>gridLayOut).getCellInstance('2').col == 2).toBe(true);
        expect((<any>gridLayOut).getCellInstance('3').row == 1).toBe(true);
        expect((<any>gridLayOut).getCellInstance('3').col == 2).toBe(true);
        gridLayOut.destroy();
        detach(ele);
    });

    it('Pushing the panes with spacing for swapping no available', () => {
        let ele: HTMLElement = createElement('div', { id: 'gridlayout' });
        let parentEle: HTMLElement = createElement('div', { id: 'container' });
        parentEle.style.width = '1264px';
        parentEle.appendChild(ele);
        document.body.appendChild(parentEle);
        let gridLayOut = new DashboardLayout({

            columns: 20,
            cellSpacing: [5, 5],
            allowFloating: false,
            panels: [{ id: '1', sizeX: 1, sizeY: 1, row: 0, col: 3 },
            { id: '2', sizeX: 1, sizeY: 1, row: 0, col: 2 },
            { id: '4', sizeX: 20, sizeY: 1, row: 0, col: 4 },
            { id: '3', sizeX: 3, sizeY: 1, row: 1, col: 2 },
            { id: '5', sizeX: 1, sizeY: 1, row: 1, col: 5 },
            ]
        });
        gridLayOut.appendTo('#gridlayout');
        let CellElements: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>gridLayOut.element.querySelectorAll('.e-panel');
        setCss(CellElements);
        let movingElemnt: HTMLElement = document.getElementById('3');
        let targetElemnt: HTMLElement = document.getElementById('2');
        let mousedown: any = getEventObject('MouseEvents', 'mousedown', movingElemnt, targetElemnt, 60, 60);
        EventHandler.trigger(<HTMLElement>movingElemnt, 'mousedown', mousedown);
        let mousemove: any = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 55, 58);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
        mousemove = setMouseCordinates(mousemove, 55, 0);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove = setMouseCordinates(mousemove, 55, 0);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove = setMouseCordinates(mousemove, 55, 0);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        let mouseup: any = getEventObject('MouseEvents', 'mouseup', movingElemnt, targetElemnt);
        mouseup.type = 'mouseup';
        mouseup.currentTarget = document;
        EventHandler.trigger(<any>(document), 'mouseup', mouseup);
        expect((<any>gridLayOut).getCellInstance('1').row == 2).toBe(true);
        expect((<any>gridLayOut).getCellInstance('1').col == 1).toBe(true);
        expect((<any>gridLayOut).getCellInstance('2').row == 2).toBe(true);
        expect((<any>gridLayOut).getCellInstance('2').col == 6).toBe(true);
        expect((<any>gridLayOut).getCellInstance('3').row == 0).toBe(true);
        expect((<any>gridLayOut).getCellInstance('3').col == 2).toBe(true);
        expect((<any>gridLayOut).getCellInstance('4').row == 1).toBe(true);
        expect((<any>gridLayOut).getCellInstance('4').col == 0).toBe(true);
        gridLayOut.destroy();
        detach(ele);
    });

    it('Pushing the panes with spacing in topAdjustable in allowFlating case', () => {
        let ele: HTMLElement = createElement('div', { id: 'gridlayout' });
        let parentEle: HTMLElement = createElement('div', { id: 'container' });
        parentEle.style.width = '1264px';
        parentEle.appendChild(ele);
        document.body.appendChild(parentEle);
        let gridLayOut = new DashboardLayout({
            allowFloating: false,
            allowResizing: true,
            cellAspectRatio: 100 / 30,
            columns: 6,
            cellSpacing: [5, 5],
            panels: [
                { 'id': "one", 'sizeX': 6, 'sizeY': 2, 'row': 0, 'col': 0 },
                { 'id': "two", 'sizeX': 4, 'sizeY': 3, 'row': 2, 'col': 4 },
                { 'id': "three", 'sizeX': 2, 'sizeY': 3, 'row': 2, 'col': 4 },
                { 'id': "four", 'sizeX': 4, 'sizeY': 3, 'row': 5, 'col': 4 },
                { 'id': "five", 'sizeX': 2, 'sizeY': 3, 'row': 5, 'col': 4 },
            ]
        });
        gridLayOut.appendTo('#gridlayout');
        let CellElements: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>gridLayOut.element.querySelectorAll('.e-panel');
        setCss(CellElements);
        let movingElemnt: HTMLElement = document.getElementById('one');
        let targetElemnt: HTMLElement = document.getElementById('two');
        let mousedown: any = getEventObject('MouseEvents', 'mousedown', movingElemnt, targetElemnt, 20, 100);
        EventHandler.trigger(<HTMLElement>movingElemnt, 'mousedown', mousedown);
        let mousemove: any = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 24, 110);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
        mousemove = setMouseCordinates(mousemove, 20, 150);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove = setMouseCordinates(mousemove, 25, 250);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove = setMouseCordinates(mousemove, 55, 260);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove = setMouseCordinates(mousemove, 50, 300);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove = setMouseCordinates(mousemove, 55, 320);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        let mouseup: any = getEventObject('MouseEvents', 'mouseup', movingElemnt, targetElemnt);
        mouseup.type = 'mouseup';
        mouseup.currentTarget = document;
        EventHandler.trigger(<any>(document), 'mouseup', mouseup);
        expect((<any>gridLayOut).getCellInstance('one').row == 3).toBe(true);
        expect((<any>gridLayOut).getCellInstance('one').col == 0).toBe(true);
        expect((<any>gridLayOut).getCellInstance('two').row == 0).toBe(true);
        expect((<any>gridLayOut).getCellInstance('two').col == 0).toBe(true);
        expect((<any>gridLayOut).getCellInstance('three').row == 0).toBe(true);
        expect((<any>gridLayOut).getCellInstance('three').col == 4).toBe(true);
        expect((<any>gridLayOut).getCellInstance('four').row == 5).toBe(true);
        expect((<any>gridLayOut).getCellInstance('four').col == 0).toBe(true);
        expect((<any>gridLayOut).getCellInstance('five').row == 5).toBe(true);
        expect((<any>gridLayOut).getCellInstance('five').col == 4).toBe(true);
        gridLayOut.destroy();
        detach(ele);
    });

    it('Continious Pushing the panes with spacing in topAdjustable in allowFlating case', () => {
        let ele: HTMLElement = createElement('div', { id: 'gridlayout' });
        let parentEle: HTMLElement = createElement('div', { id: 'container' });
        parentEle.style.width = '1264px';
        parentEle.appendChild(ele);
        document.body.appendChild(parentEle);
        let gridLayOut = new DashboardLayout({
            allowFloating: true,
            allowResizing: true,
            cellAspectRatio: 100 / 30,
            columns: 6,
            cellSpacing: [5, 5],
            panels: [
                { 'id': "one", 'sizeX': 6, 'sizeY': 2, 'row': 0, 'col': 0 },
                { 'id': "two", 'sizeX': 4, 'sizeY': 3, 'row': 2, 'col': 4 },
                { 'id': "three", 'sizeX': 2, 'sizeY': 3, 'row': 2, 'col': 4 },
                { 'id': "four", 'sizeX': 4, 'sizeY': 3, 'row': 5, 'col': 4 },
                { 'id': "five", 'sizeX': 2, 'sizeY': 3, 'row': 5, 'col': 4 },
            ]
        });
        gridLayOut.appendTo('#gridlayout');
        let CellElements: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>gridLayOut.element.querySelectorAll('.e-panel');
        setCss(CellElements);
        let movingElemnt: HTMLElement = document.getElementById('one');
        let targetElemnt: HTMLElement = document.getElementById('two');
        let mousedown: any = getEventObject('MouseEvents', 'mousedown', movingElemnt, targetElemnt, 20, 100);
        EventHandler.trigger(<HTMLElement>movingElemnt, 'mousedown', mousedown);
        let mousemove: any = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 24, 110);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
        mousemove = setMouseCordinates(mousemove, 20, 150);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove = setMouseCordinates(mousemove, 25, 250);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove = setMouseCordinates(mousemove, 55, 260);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove = setMouseCordinates(mousemove, 50, 300);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove = setMouseCordinates(mousemove, 55, 320);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        expect((<any>gridLayOut).getCellInstance('one').row == 3).toBe(true);
        expect((<any>gridLayOut).getCellInstance('one').col == 0).toBe(true);
        expect((<any>gridLayOut).getCellInstance('two').row == 0).toBe(true);
        expect((<any>gridLayOut).getCellInstance('two').col == 0).toBe(true);
        expect((<any>gridLayOut).getCellInstance('three').row == 0).toBe(true);
        expect((<any>gridLayOut).getCellInstance('three').col == 4).toBe(true);
        expect((<any>gridLayOut).getCellInstance('four').row == 5).toBe(true);
        expect((<any>gridLayOut).getCellInstance('four').col == 0).toBe(true);
        expect((<any>gridLayOut).getCellInstance('five').row == 5).toBe(true);
        expect((<any>gridLayOut).getCellInstance('five').col == 4).toBe(true);
        mousemove = setMouseCordinates(mousemove, 50, 350);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove = setMouseCordinates(mousemove, 55, 400);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove = setMouseCordinates(mousemove, 50, 480);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove = setMouseCordinates(mousemove, 54, 450);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        let mouseup: any = getEventObject('MouseEvents', 'mouseup', movingElemnt, targetElemnt);
        mouseup.type = 'mouseup';
        mouseup.currentTarget = document;
        EventHandler.trigger(<any>(document), 'mouseup', mouseup);
        expect((<any>gridLayOut).getCellInstance('one').row == 6).toBe(true);
        expect((<any>gridLayOut).getCellInstance('one').col == 0).toBe(true);
        expect((<any>gridLayOut).getCellInstance('two').row == 0).toBe(true);
        expect((<any>gridLayOut).getCellInstance('two').col == 0).toBe(true);
        expect((<any>gridLayOut).getCellInstance('three').row == 0).toBe(true);
        expect((<any>gridLayOut).getCellInstance('three').col == 4).toBe(true);
        expect((<any>gridLayOut).getCellInstance('four').row == 3).toBe(true);
        expect((<any>gridLayOut).getCellInstance('four').col == 0).toBe(true);
        expect((<any>gridLayOut).getCellInstance('five').row == 3).toBe(true);
        expect((<any>gridLayOut).getCellInstance('five').col == 4).toBe(true);
        gridLayOut.destroy();
        detach(ele);
    });

    it('restricting swapping of panles above due to inbetween blockage and allowPushing', () => {
        let ele: HTMLElement = createElement('div', { id: 'gridlayout' });
        let parentEle: HTMLElement = createElement('div', { id: 'container' });
        parentEle.style.width = '1264px';
        parentEle.appendChild(ele);
        document.body.appendChild(parentEle);
        let gridLayOut = new DashboardLayout({

            columns: 20,
            cellSpacing: [5, 5],
            allowFloating: false,
            panels: [{ id: '1', sizeX: 1, sizeY: 2, row: 0, col: 0 },
            { id: '2', sizeX: 3, sizeY: 1, row: 0, col: 1 },
            { id: '3', sizeX: 2, sizeY: 1, row: 0, col: 4 },
            { id: '4', sizeX: 1, sizeY: 2, row: 1, col: 1 },
            { id: '5', sizeX: 2, sizeY: 2, row: 1, col: 2 },
            ]
        });
        gridLayOut.appendTo('#gridlayout');
        let CellElements: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>gridLayOut.element.querySelectorAll('.e-panel');
        setCss(CellElements);
        let movingElemnt: HTMLElement = document.getElementById('4');
        let targetElemnt: HTMLElement = document.getElementById('2');
        let mousedown: any = getEventObject('MouseEvents', 'mousedown', movingElemnt, targetElemnt, 60, 60);
        EventHandler.trigger(<HTMLElement>movingElemnt, 'mousedown', mousedown);
        let mousemove: any = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 55, 58);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
        mousemove = setMouseCordinates(mousemove, 55, 10);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove = setMouseCordinates(mousemove, 55, 0);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove = setMouseCordinates(mousemove, 55, 0);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        let mouseup: any = getEventObject('MouseEvents', 'mouseup', movingElemnt, targetElemnt);
        mouseup.type = 'mouseup';
        mouseup.currentTarget = document;
        EventHandler.trigger(<any>(document), 'mouseup', mouseup);
        expect((<any>gridLayOut).getCellInstance('1').row == 0).toBe(true);
        expect((<any>gridLayOut).getCellInstance('1').col == 0).toBe(true);
        expect((<any>gridLayOut).getCellInstance('2').row == 2).toBe(true);
        expect((<any>gridLayOut).getCellInstance('2').col == 1).toBe(true);
        expect((<any>gridLayOut).getCellInstance('3').row == 0).toBe(true);
        expect((<any>gridLayOut).getCellInstance('3').col == 4).toBe(true);
        expect((<any>gridLayOut).getCellInstance('4').row == 0).toBe(true);
        expect((<any>gridLayOut).getCellInstance('4').col == 1).toBe(true);
        expect((<any>gridLayOut).getCellInstance('5').row == 3).toBe(true);
        expect((<any>gridLayOut).getCellInstance('5').col == 2).toBe(true);
        gridLayOut.destroy();
        detach(ele);
    });

    it('restricting swapping of panles above due to inbetween blockage and allowPushing right', () => {
        let ele: HTMLElement = createElement('div', { id: 'gridlayout' });
        let parentEle: HTMLElement = createElement('div', { id: 'container' });
        parentEle.style.width = '1264px';
        parentEle.appendChild(ele);
        document.body.appendChild(parentEle);
        let gridLayOut = new DashboardLayout({

            columns: 20,
            cellSpacing: [5, 5],
            allowFloating: false,
            panels: [{ id: '1', sizeX: 1, sizeY: 2, row: 0, col: 0 },
            { id: '2', sizeX: 3, sizeY: 1, row: 0, col: 1 },
            { id: '4', sizeX: 1, sizeY: 2, row: 1, col: 1 },
            { id: '5', sizeX: 2, sizeY: 2, row: 1, col: 2 },
            ]
        });
        gridLayOut.appendTo('#gridlayout');
        let CellElements: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>gridLayOut.element.querySelectorAll('.e-panel');
        setCss(CellElements);
        let movingElemnt: HTMLElement = document.getElementById('4');
        let targetElemnt: HTMLElement = document.getElementById('2');
        let mousedown: any = getEventObject('MouseEvents', 'mousedown', movingElemnt, targetElemnt, 60, 60);
        EventHandler.trigger(<HTMLElement>movingElemnt, 'mousedown', mousedown);
        let mousemove: any = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 55, 58);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
        mousemove = setMouseCordinates(mousemove, 55, 10);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove = setMouseCordinates(mousemove, 55, 0);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove = setMouseCordinates(mousemove, 55, 0);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        let mouseup: any = getEventObject('MouseEvents', 'mouseup', movingElemnt, targetElemnt);
        mouseup.type = 'mouseup';
        mouseup.currentTarget = document;
        EventHandler.trigger(<any>(document), 'mouseup', mouseup);
        expect((<any>gridLayOut).getCellInstance('1').row == 0).toBe(true);
        expect((<any>gridLayOut).getCellInstance('1').col == 0).toBe(true);
        expect((<any>gridLayOut).getCellInstance('2').row == 0).toBe(true);
        expect((<any>gridLayOut).getCellInstance('2').col == 2).toBe(true);
        expect((<any>gridLayOut).getCellInstance('4').row == 0).toBe(true);
        expect((<any>gridLayOut).getCellInstance('4').col == 1).toBe(true);
        expect((<any>gridLayOut).getCellInstance('5').row == 1).toBe(true);
        expect((<any>gridLayOut).getCellInstance('5').col == 2).toBe(true);
        gridLayOut.destroy();
        detach(ele);
    });

    it('restricting swapping of panles above due to inbetween blockage and allowPushing right even with left inadequate spacing', () => {
        let ele: HTMLElement = createElement('div', { id: 'gridlayout' });
        let parentEle: HTMLElement = createElement('div', { id: 'container' });
        parentEle.style.width = '1264px';
        parentEle.appendChild(ele);
        document.body.appendChild(parentEle);
        let gridLayOut = new DashboardLayout({

            columns: 20,
            cellSpacing: [5, 5],
            allowFloating: false,
            panels: [
                { id: '2', sizeX: 3, sizeY: 1, row: 0, col: 1 },
                { id: '4', sizeX: 1, sizeY: 2, row: 1, col: 1 },
                { id: '5', sizeX: 2, sizeY: 2, row: 1, col: 2 },
            ]
        });
        gridLayOut.appendTo('#gridlayout');
        let CellElements: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>gridLayOut.element.querySelectorAll('.e-panel');
        setCss(CellElements);
        let movingElemnt: HTMLElement = document.getElementById('4');
        let targetElemnt: HTMLElement = document.getElementById('2');
        let mousedown: any = getEventObject('MouseEvents', 'mousedown', movingElemnt, targetElemnt, 60, 60);
        EventHandler.trigger(<HTMLElement>movingElemnt, 'mousedown', mousedown);
        let mousemove: any = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 55, 58);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
        mousemove = setMouseCordinates(mousemove, 55, 10);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove = setMouseCordinates(mousemove, 55, 0);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove = setMouseCordinates(mousemove, 55, 0);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        let mouseup: any = getEventObject('MouseEvents', 'mouseup', movingElemnt, targetElemnt);
        mouseup.type = 'mouseup';
        mouseup.currentTarget = document;
        EventHandler.trigger(<any>(document), 'mouseup', mouseup);
        expect((<any>gridLayOut).getCellInstance('2').row == 0).toBe(true);
        expect((<any>gridLayOut).getCellInstance('2').col == 2).toBe(true);
        expect((<any>gridLayOut).getCellInstance('4').row == 0).toBe(true);
        expect((<any>gridLayOut).getCellInstance('4').col == 1).toBe(true);
        expect((<any>gridLayOut).getCellInstance('5').row == 1).toBe(true);
        expect((<any>gridLayOut).getCellInstance('5').col == 2).toBe(true);
        gridLayOut.destroy();
        detach(ele);
    });

    it('Swapping test cases bottom to top', () => {
        let ele: HTMLElement = createElement('div', { id: 'gridlayout' });
        let parentEle: HTMLElement = createElement('div', { id: 'container' });
        parentEle.style.width = '1264px';
        parentEle.appendChild(ele);
        document.body.appendChild(parentEle);
        let gridLayOut = new DashboardLayout({

            columns: 12,
            cellSpacing: [5, 5],
            allowFloating: false,
            panels: [{ id: '1', sizeX: 1, sizeY: 1, row: 0, col: 3 },
            { id: '2', sizeX: 1, sizeY: 1, row: 0, col: 2 },
            { id: '3', sizeX: 2, sizeY: 2, row: 1, col: 2 },
            ]
        });
        gridLayOut.appendTo('#gridlayout');
        let CellElements: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>gridLayOut.element.querySelectorAll('.e-panel');
        setCss(CellElements);
        let movingElemnt: HTMLElement = document.getElementById('3');
        let targetElemnt: HTMLElement = document.getElementById('2');
        let mousedown: any = getEventObject('MouseEvents', 'mousedown', movingElemnt, targetElemnt, 60, 120);
        EventHandler.trigger(<HTMLElement>movingElemnt, 'mousedown', mousedown);
        let mousemove: any = getEventObject('MouseEvents', 'mousemove', movingElemnt, targetElemnt, 55, 120);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove.srcElement = mousemove.target = mousemove.toElement = targetElemnt;
        mousemove = setMouseCordinates(mousemove, 55, 0);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove = setMouseCordinates(mousemove, 55, 0);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove = setMouseCordinates(mousemove, 55, 0);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        let mouseup: any = getEventObject('MouseEvents', 'mouseup', movingElemnt, targetElemnt);
        mouseup.type = 'mouseup';
        mouseup.currentTarget = document;
        EventHandler.trigger(<any>(document), 'mouseup', mouseup);
        expect((<any>gridLayOut).getCellInstance('1').row == 2).toBe(true);
        expect((<any>gridLayOut).getCellInstance('1').col == 3).toBe(true);
        expect((<any>gridLayOut).getCellInstance('2').row == 2).toBe(true);
        expect((<any>gridLayOut).getCellInstance('2').col == 2).toBe(true);
        expect((<any>gridLayOut).getCellInstance('3').row == 0).toBe(true);
        expect((<any>gridLayOut).getCellInstance('3').col == 2).toBe(true);
        gridLayOut.destroy();
        detach(ele);
    });

    it('Testing drag restrict classfor dragging with events', () => {
        let gridLayOut: any;
        let changeTrigger: boolean = false;
        let dragStartTrigger: boolean = false;
        let dragTrigger: boolean = false;
        let dragStopTrigger: boolean = false;
        ele = createElement('div', { id: 'gridlayout' });
        setStyle(ele, { 'position': 'relative' });
        parentEle = createElement('div', { id: 'container' });
        setStyle(parentEle, { 'position': 'relative' });
        parentEle.style.width = '1264px';
        parentEle.appendChild(ele);
        document.body.appendChild(parentEle);
        gridLayOut = new DashboardLayout({
            allowDragging: true,
            columns: 20,
            cellSpacing: [5, 5],
            panels: [{ "id": 'zero', "sizeX": 1, "sizeY": 1, "row": 0, "col": 0, content: generateTemplate('0'), cssClass: 'e-drag-restrict' },
            { "id": 'two', "sizeX": 2, "sizeY": 2, "row": 0, "col": 1, content: generateTemplate('2') },
            { "id": 'five', "sizeX": 1, "sizeY": 1, "row": 0, "col": 3, content: generateTemplate('5') },
            { "id": 'seven', "sizeX": 1, "sizeY": 3, "row": 0, "col": 4, content: generateTemplate('7') },
            { "id": 'eight', "sizeX": 3, "sizeY": 1, "row": 0, "col": 5, content: generateTemplate('8') },
            { "id": 'six', "sizeX": 1, "sizeY": 1, "row": 1, "col": 3, content: generateTemplate('6') },
            { "id": 'one', "sizeX": 1, "sizeY": 2, "row": 1, "col": 0, content: generateTemplate('1') },
            { "id": 'nine', "sizeX": 2, "sizeY": 1, "row": 2, "col": 5, content: generateTemplate('9') },
            { "id": 'twelve', "sizeX": 1, "sizeY": 1, "row": 2, "col": 7, content: generateTemplate('12') },
            { "id": 'ten', "sizeX": 1, "sizeY": 1, "row": 1, "col": 5, content: generateTemplate('10') },
            { "id": 'eleven', "sizeX": 2, "sizeY": 1, "row": 1, "col": 6, content: generateTemplate('11') },
            { "id": 'three', "sizeX": 1, "sizeY": 1, "row": 2, "col": 1, content: generateTemplate('3') },
            { "id": 'four', "sizeX": 2, "sizeY": 1, "row": 2, "col": 2, content: generateTemplate('4') },
            { "id": 'thirteen', "sizeX": 4, "sizeY": 1, "row": 3, "col": 1, content: generateTemplate('13') },
            { "id": 'fourteen', "sizeX": 1, "sizeY": 1, "row": 3, "col": 0, content: generateTemplate('14') },
            { "id": 'fifteen', "sizeX": 3, "sizeY": 2, "row": 3, "col": 5, content: generateTemplate('15') },
            { "id": 'sixteen', "sizeX": 5, "sizeY": 1, "row": 4, "col": 0, content: generateTemplate('16') },
            { "id": 'seventeen', "sizeX": 1, "sizeY": 4, "row": 0, "col": 8, content: generateTemplate('17') },
            { "id": 'eighteen', "sizeX": 3, "sizeY": 3, "row": 0, "col": 9, content: generateTemplate('18') },
            { "id": 'nineteen', "sizeX": 2, "sizeY": 1, "row": 3, "col": 9, content: generateTemplate('19') },
            { "id": 'twenty', "sizeX": 1, "sizeY": 2, "row": 3, "col": 11, content: generateTemplate('20') },
            { "id": 'twentyone', "sizeX": 3, "sizeY": 1, "row": 4, "col": 8, content: generateTemplate('21') },
            ],
            change: function (args: ChangeEventArgs) {
                changeTrigger = true;
            },
            dragStart: function (args: DragStartArgs) {
                dragStartTrigger = true;
            },
            dragStop: function (args: DragStopArgs) {
                dragStopTrigger = true;
            },
            drag: function (args: DraggedEventArgs) {
                dragTrigger = true;
            }
        });
        gridLayOut.appendTo('#gridlayout');
        let CellElements: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>gridLayOut.element.querySelectorAll('.e-panel');
        setCss(CellElements);
        let movingElemnt: HTMLElement = document.getElementById('zero');
        let targetElemnt: HTMLElement = document.getElementById('two');
        let mousedown: any = getEventObject('MouseEvents', 'mousedown', movingElemnt, movingElemnt, 0, 0);
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
        mouseup.currentTarget = document;
        EventHandler.trigger(<any>(document), 'mouseup', mouseup);
        expect((<any>gridLayOut).getCellInstance('zero').row == 0).toBe(true);
        expect((<any>gridLayOut).getCellInstance('zero').col == 0).toBe(true);
        expect((<any>gridLayOut).getCellInstance('two').row == 0).toBe(true);
        expect((<any>gridLayOut).getCellInstance('two').col == 1).toBe(true);
        expect((<any>gridLayOut).getCellInstance('three').row == 2).toBe(true);
        expect((<any>gridLayOut).getCellInstance('three').col == 1).toBe(true);
        expect((<any>gridLayOut).getCellInstance('four').row == 2).toBe(true);
        expect((<any>gridLayOut).getCellInstance('four').col == 2).toBe(true);
        expect((<any>gridLayOut).getCellInstance('thirteen').row == 3).toBe(true);
        expect((<any>gridLayOut).getCellInstance('thirteen').col == 1).toBe(true);
        expect((<any>gridLayOut).getCellInstance('sixteen').row == 4).toBe(true);
        expect((<any>gridLayOut).getCellInstance('sixteen').col == 0).toBe(true);
        expect(changeTrigger).toBe(false);
        expect(dragStartTrigger).toBe(false);
        expect(dragTrigger).toBe(false);
        expect(dragStopTrigger).toBe(false);
        gridLayOut.destroy();
        detach(ele);
    });

    it('memory leak', () => {
        profile.sample();
        let average: any = inMB(profile.averageChange)
        //Check average change in memory samples to not be over 10MB
        expect(average).toBeLessThan(10);
        let memory: any = inMB(getMemoryProfile())
        //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    })
});
//mobile resolution remove panel
 describe('mobile resolution remove panel', () => {
            let gridLayOut: any;
           let ele: HTMLElement;
             let defaultUserAgent= navigator.userAgent;
            beforeEach((done: Function) => {
                Browser.userAgent="Mozilla/5.0 (Linux; Android 8.0; Pixel 2 Build/OPD3.170816.012) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.119 Mobile Safari/537.36";
                done();
                 ele = createElement('div', { id: 'gridlayout', className: 'e-control e-lib e-dashboardlayout' });
        let parentEle: HTMLElement = createElement('div', { id: 'container' });
        parentEle.style.width = '1264px';
        parentEle.appendChild(ele);
        document.body.appendChild(parentEle);
        setStyle(ele, { 'position': 'relative' });
            });
        it('mobile resolution remove panel', () => {
            gridLayOut = new DashboardLayout({
                cellAspectRatio: 1,
                columns: 12,
                cellSpacing: [5, 5],
                allowResizing: true,            
                panels: [
                    { "id": 'first', "sizeX": 2, "sizeY": 1, "row": 0, "col": 1, "zIndex": 100 },
                    { "id": 'second', "sizeX": 2, "sizeY": 2, "row": 2, "col": 2, "zIndex": 100 },
                ]
            });
            gridLayOut.appendTo('#gridlayout');
            gridLayOut.checkMediaQuery = function()
            {
            return true;
            };
            gridLayOut.removePanel('second');
             });
            afterEach(() => {
                Browser.userAgent = defaultUserAgent;
                if (gridLayOut) {
            gridLayOut.destroy();
            detach(ele);
        }
            });
 });

describe('Null or undefined value testing ', () => {
    let dashboardObj: any;
    let ele: HTMLElement;
    beforeEach(() => {
        ele = createElement('div', { id: 'dashboard' });
        let parentEle: HTMLElement = createElement('div', { id: 'container' });
        parentEle.style.width = '1264px';
        parentEle.appendChild(ele);
        document.body.appendChild(parentEle);
    });
    afterEach(() => {
        if (dashboardObj) {
            dashboardObj.destroy();
            detach(ele);
        }
    });

    it('allowDragging', () => {
        dashboardObj = new DashboardLayout({
            panels: [
                { "id": '0', "sizeX": 2, "sizeY": 1, "row": 0, "col": 0, },
            ],
            allowDragging : null
        });
        dashboardObj.appendTo('#dashboard');
        expect(dashboardObj.allowDragging).toBe(null);
        dashboardObj.destroy();
        dashboardObj = new DashboardLayout({
            panels: [{ "id": '0', "sizeX": 2, "sizeY": 1, "row": 0, "col": 0, }],
            allowDragging : undefined
        });
        dashboardObj.appendTo('#dashboard');
        expect(dashboardObj.allowDragging).toBe(true);
        dashboardObj.destroy();
    });
    it('allowResizing', () => {
        dashboardObj = new DashboardLayout({
            panels: [
                { "id": '0', "sizeX": 2, "sizeY": 1, "row": 0, "col": 0, },
            ],
            allowResizing : null
        });
        dashboardObj.appendTo('#dashboard');
        expect(dashboardObj.allowResizing).toBe(null);
        dashboardObj.destroy();
        dashboardObj = new DashboardLayout({
            panels: [{ "id": '0', "sizeX": 2, "sizeY": 1, "row": 0, "col": 0, }],
            allowResizing : undefined
        });
        dashboardObj.appendTo('#dashboard');
        expect(dashboardObj.allowResizing).toBe(false);
        dashboardObj.destroy();
    });

    it('allowPushing', () => {
        dashboardObj = new DashboardLayout({
            panels: [
                { "id": '0', "sizeX": 2, "sizeY": 1, "row": 0, "col": 0, },
            ],
            allowPushing : null
        });
        dashboardObj.appendTo('#dashboard');
        expect(dashboardObj.allowPushing).toBe(null);
        dashboardObj.destroy();
        dashboardObj = new DashboardLayout({
            panels: [{ "id": '0', "sizeX": 2, "sizeY": 1, "row": 0, "col": 0, }],
            allowPushing : undefined
        });
        dashboardObj.appendTo('#dashboard');
        expect(dashboardObj.allowPushing).toBe(true);
        dashboardObj.destroy();
    });

    it('enableHtmlSanitizer', () => {
        dashboardObj = new DashboardLayout({
            panels: [
                { "id": '0', "sizeX": 2, "sizeY": 1, "row": 0, "col": 0, },
            ],
            enableHtmlSanitizer : null
        });
        dashboardObj.appendTo('#dashboard');
        expect(dashboardObj.enableHtmlSanitizer).toBe(null);
        dashboardObj.destroy();
        dashboardObj = new DashboardLayout({
            panels: [{ "id": '0', "sizeX": 2, "sizeY": 1, "row": 0, "col": 0, }],
            enableHtmlSanitizer : undefined
        });
        dashboardObj.appendTo('#dashboard');
        expect(dashboardObj.enableHtmlSanitizer).toBe(true);
        dashboardObj.destroy();
    });
    it('allowFloating', () => {
        dashboardObj = new DashboardLayout({
            panels: [
                { "id": '0', "sizeX": 2, "sizeY": 1, "row": 0, "col": 0, },
            ],
            allowFloating : null
        });
        dashboardObj.appendTo('#dashboard');
        expect(dashboardObj.allowFloating).toBe(null);
        dashboardObj.destroy();
        dashboardObj = new DashboardLayout({
            panels: [{ "id": '0', "sizeX": 2, "sizeY": 1, "row": 0, "col": 0, }],
            allowFloating : undefined
        });
        dashboardObj.appendTo('#dashboard');
        expect(dashboardObj.allowFloating).toBe(true);
        dashboardObj.destroy();
    });
    it('cellAspectRatio', () => {
        dashboardObj = new DashboardLayout({
            panels: [
                { "id": '0', "sizeX": 2, "sizeY": 1, "row": 0, "col": 0, },
            ],
            cellAspectRatio : null
        });
        dashboardObj.appendTo('#dashboard');
        expect(dashboardObj.cellAspectRatio).toBe(null);
        dashboardObj.destroy();
        dashboardObj = new DashboardLayout({
            panels: [{ "id": '0', "sizeX": 2, "sizeY": 1, "row": 0, "col": 0, }],
            cellAspectRatio : undefined
        });
        dashboardObj.appendTo('#dashboard');
        expect(dashboardObj.cellAspectRatio).toBe(1);
        dashboardObj.destroy();
    });
    it('cellSpacing', () => {
        dashboardObj = new DashboardLayout({
            panels: [
                { "id": '0', "sizeX": 2, "sizeY": 1, "row": 0, "col": 0, },
            ],
            cellSpacing : null
        });
        dashboardObj.appendTo('#dashboard');
        expect(dashboardObj.cellSpacing).toBe(null);
        dashboardObj.destroy();
        dashboardObj = new DashboardLayout({
            panels: [{ "id": '0', "sizeX": 2, "sizeY": 1, "row": 0, "col": 0, }],
            cellSpacing : undefined
        });
        dashboardObj.appendTo('#dashboard');
        expect(dashboardObj.cellSpacing).toEqual([5, 5]);
        dashboardObj.destroy();
    });
    it('columns', () => {
        dashboardObj = new DashboardLayout({
            panels: [
                { "id": '0', "sizeX": 2, "sizeY": 1, "row": 0, "col": 0, },
            ],
            columns : null
        });
        dashboardObj.appendTo('#dashboard');
        expect(dashboardObj.columns).toBe(null);
        dashboardObj.destroy();
        dashboardObj = new DashboardLayout({
            panels: [{ "id": '0', "sizeX": 2, "sizeY": 1, "row": 0, "col": 0, }],
            columns : undefined
        });
        dashboardObj.appendTo('#dashboard');
        expect(dashboardObj.columns).toBe(1);
        dashboardObj.destroy();
    });
    it('showGridLines', () => {
        dashboardObj = new DashboardLayout({
            panels: [
                { "id": '0', "sizeX": 2, "sizeY": 1, "row": 0, "col": 0, },
            ],
            showGridLines : null
        });
        dashboardObj.appendTo('#dashboard');
        expect(dashboardObj.showGridLines).toBe(null);
        dashboardObj.destroy();
        dashboardObj = new DashboardLayout({
            panels: [{ "id": '0', "sizeX": 2, "sizeY": 1, "row": 0, "col": 0, }],
            showGridLines : undefined
        });
        dashboardObj.appendTo('#dashboard');
        expect(dashboardObj.showGridLines).toBe(false);
        dashboardObj.destroy();
    });
    it('draggableHandle', () => {
        dashboardObj = new DashboardLayout({
            panels: [
                { "id": '0', "sizeX": 2, "sizeY": 1, "row": 0, "col": 0, },
            ],
            draggableHandle : null
        });
        dashboardObj.appendTo('#dashboard');
        expect(dashboardObj.draggableHandle).toBe(null);
        dashboardObj.destroy();
        dashboardObj = new DashboardLayout({
            panels: [{ "id": '0', "sizeX": 2, "sizeY": 1, "row": 0, "col": 0, }],
            draggableHandle : undefined
        });
        dashboardObj.appendTo('#dashboard');
        expect(dashboardObj.draggableHandle).toBe(null);
        dashboardObj.destroy();
    });
    it('mediaQuery', () => {
        dashboardObj = new DashboardLayout({
            panels: [
                { "id": '0', "sizeX": 2, "sizeY": 1, "row": 0, "col": 0, },
            ],
            mediaQuery : null
        });
        dashboardObj.appendTo('#dashboard');
        expect(dashboardObj.mediaQuery).toBe(null);
        dashboardObj.destroy();
        dashboardObj = new DashboardLayout({
            panels: [{ "id": '0', "sizeX": 2, "sizeY": 1, "row": 0, "col": 0, }],
            mediaQuery : undefined
        });
        dashboardObj.appendTo('#dashboard');
        expect(dashboardObj.mediaQuery).toBe('max-width: 600px');
        dashboardObj.destroy();
    });
    it('panels', () => {
        dashboardObj = new DashboardLayout({
            panels : null
        });
        dashboardObj.appendTo('#dashboard');
        expect(dashboardObj.panels.length).toBe(0);
        dashboardObj.destroy();
        dashboardObj = new DashboardLayout({
            panels : undefined
        });
        dashboardObj.appendTo('#dashboard');
        expect(dashboardObj.panels.length).toBe(0);
        dashboardObj.destroy();
    });
    it('resizableHandles', () => {
        dashboardObj = new DashboardLayout({
            panels: [
                { "id": '0', "sizeX": 2, "sizeY": 1, "row": 0, "col": 0, },
            ],
            resizableHandles : null
        });
        dashboardObj.appendTo('#dashboard');
        expect(dashboardObj.resizableHandles).toBe(null);
        dashboardObj.destroy();
        dashboardObj = new DashboardLayout({
            panels: [{ "id": '0', "sizeX": 2, "sizeY": 1, "row": 0, "col": 0, }],
            resizableHandles : undefined
        });
        dashboardObj.appendTo('#dashboard');
        expect(dashboardObj.resizableHandles[0]).toBe('e-south-east');
        dashboardObj.destroy();
    });
});
