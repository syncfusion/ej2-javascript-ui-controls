import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../src/diagram/diagram';
import { ConnectorModel } from '../../src/diagram/objects/connector-model';
import { NodeModel } from '../../src/diagram/objects/node-model';
import { DiagramScroller } from '../../src/diagram/interaction/scroller';
import { MouseEvents } from '../../spec/diagram/interaction/mouseevents.spec';
import { Overview } from '../../src/overview/overview';
import { OverviewModel } from '../../src/overview/overview-model';
import { profile, inMB, getMemoryProfile } from '../common.spec';
import { DataManager, Query } from '@syncfusion/ej2-data';
import {
    RadialTree, DataBinding
} from '../../src/diagram/index';
Diagram.Inject(RadialTree, DataBinding);

/**
 * Overview Spec
 */
describe('Overview', () => {

    describe('Overview Tests', () => {
        let diagram: Diagram;
        let overview: Overview;
        let ele: HTMLElement;
        let ove: HTMLElement;
        let scroller: DiagramScroller;
        let mouseEvents: MouseEvents = new MouseEvents();

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            ove = createElement('div', { id: 'overview' });
            document.body.appendChild(ove);
            let connector: ConnectorModel = {
                id: 'connector1', sourcePoint: { x: 200, y: 100 }, targetPoint: { x: 400, y: 100 }
            };
            let node: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100,
                annotations: [{ content: 'Node1', height: 50, width: 50 }]
            };
            let node2: NodeModel = {
                id: 'node2', width: 100, height: 100, offsetX: 250, offsetY: 200,
                annotations: [{ content: 'Node2', height: 50, width: 50 }]
            };
            let node3: NodeModel = {
                id: 'node3', width: 100, height: 100, offsetX: 100, offsetY: 300,
                annotations: [{ content: 'Node3', height: 50, width: 50 }]
            };
            let node4: NodeModel = {
                id: 'node4', width: 100, height: 100, offsetX: 500, offsetY: 100,
                annotations: [{ content: 'Node4', height: 50, width: 50 }]
            };
            let node5: NodeModel = {
                id: 'node5', width: 80, height: 100, offsetX: 800, offsetY: 100,
                annotations: [{ content: 'Node5', height: 50, width: 50 }]
            };
            let node6: NodeModel = {
                id: 'node6', width: 100, height: 100, offsetX: 400, offsetY: 600,
                annotations: [{ content: 'Node6', height: 50, width: 50 }]
            };
            diagram = new Diagram({
                width: '600px', height: '500px', nodes: [node, node2, node3, node4, node5, node6], connectors: [connector],
                scrollSettings: { scrollLimit: 'Infinity' }
            });
            diagram.appendTo('#diagram');
            let options: OverviewModel = {};
            options.height = '500px';
            options.width = '250px';
            options.sourceID = 'diagram';
            overview = new Overview(options);
            overview.appendTo('#overview');

        });

        afterAll((): void => {
            overview.destroy();
            diagram.destroy();
            ele.remove();
            ove.remove();
        });
        it('Click on the overview rect', (done: Function) => {
            let overviewelement: HTMLElement = document.getElementById(overview.element.id);
            let target: HTMLElement = document.getElementById('overview_canvas_overviewsvg');
            let mouseDown: string = 'mouseDown';
            let mouseup: string = 'mouseUp';
            overview[mouseDown]({ target: target, type: mouseDown });
            mouseEvents.mouseDownEvent(overviewelement, 1122, 200);
            overview[mouseup]({ target: target, type: mouseDown });
            overview.getPersistData();
            expect((diagram.scroller.currentZoom === 1)).toBe(true);
            expect((diagram.scroller.horizontalOffset === 0) && (diagram.scroller.verticalOffset === 0)).toBe(true);
            done();
        });
        it('Click on the overview rect - Pan with focused area', (done: Function) => {
            let overviewelement: HTMLElement = document.getElementById(overview.element.id);
            let target: HTMLElement = document.getElementById('overview_canvasoverviewrect');
            let mouseDown: string = 'mouseDown';
            let mouseup: string = 'mouseUp';
            let mouseMove: string = 'mouseMove';
            overview[mouseDown]({ target: target, type: mouseDown });
            mouseEvents.mouseDownEvent(overviewelement, 1094, 82);
            mouseEvents.mouseMoveEvent(overviewelement, 1144, 92);
            overview[mouseup]({ target: target, type: mouseDown });
            overview[mouseDown]({ target: target, type: mouseDown });
            mouseEvents.mouseDownEvent(overviewelement, 1094, 82);
            mouseEvents.mouseUpEvent(target, 1094, 82);
            expect((diagram.scroller.currentZoom === 1)).toBe(true);
            expect((diagram.scroller.horizontalOffset === -168) && (diagram.scroller.verticalOffset === -33.6)).toBe(true);
            done();
        });
        it('Click on the overview rect - Scale with resizer bottom right', (done: Function) => {
            let overviewelement: HTMLElement = document.getElementById(overview.element.id);
            let target: HTMLElement = document.getElementById('overview_canvasbottomright');
            let mouseDown: string = 'mouseDown';
            let mouseup: string = 'mouseUp';
            let mouseMove: string = 'mouseMove';
            overview[mouseDown]({ target: target, type: mouseDown });
            mouseEvents.mouseDownEvent(overviewelement, 1236, 170);
            mouseEvents.mouseMoveEvent(overviewelement, 1186, 160);
            overview[mouseup]({ target: target, type: mouseDown });
            expect((diagram.scroller.currentZoom.toFixed(4) === '1.3889')).toBe(true);
            expect((Math.round(diagram.scroller.horizontalOffset) === -233) && (
                (Math.round(diagram.scroller.verticalOffset) <= -45) ||
                (Math.round(diagram.scroller.verticalOffset) >= -47))).toBe(true);
            done();
        });
        it('Click on the overview rect - Scale with resizer bottom right with y greater than X', (done: Function) => {
            let overviewelement: HTMLElement = document.getElementById(overview.element.id);
            let target: HTMLElement = document.getElementById('overview_canvasbottomright');
            let mouseDown: string = 'mouseDown';
            let mouseup: string = 'mouseUp';
            let mouseMove: string = 'mouseMove';
            overview[mouseDown]({ target: target, type: mouseDown });
            mouseEvents.mouseDownEvent(overviewelement, 1236, 170);
            mouseEvents.mouseMoveEvent(overviewelement, 1226, 150);
            overview[mouseup]({ target: target, type: mouseDown });
            expect((diagram.scroller.currentZoom.toFixed(4) === '1.7077')).toBe(true);
            expect((Math.round(diagram.scroller.horizontalOffset) >= -287 && Math.round(diagram.scroller.horizontalOffset) <= -286) &&
                (Math.round(diagram.scroller.verticalOffset) >= -57 && Math.round(diagram.scroller.verticalOffset) <= -55
                )).toBe(true);
            done();
        });
        it('Click on the overview rect - Scale with resizer bottom', (done: Function) => {
            let overviewelement: HTMLElement = document.getElementById(overview.element.id);
            let target: HTMLElement = document.getElementById('overview_canvasbottom');
            let mouseDown: string = 'mouseDown';
            let mouseup: string = 'mouseUp';
            let mouseMove: string = 'mouseMove';
            overview[mouseDown]({ target: target, type: mouseDown });
            mouseEvents.mouseDownEvent(overviewelement, 1186, 160);
            mouseEvents.mouseMoveEvent(overviewelement, 1236, 170);
            overview[mouseup]({ target: target, type: mouseDown });
            expect((diagram.scroller.currentZoom.toFixed(4) === '1.5319')).toBe(true);
            expect((Math.round(diagram.scroller.horizontalOffset) >= -226 && Math.round(diagram.scroller.horizontalOffset) <= -225) &&
                (Math.round(diagram.scroller.verticalOffset) <= -49
                    && Math.round(diagram.scroller.verticalOffset) >= -51)).toBe(true);
            done();
        });
        it('Click on the overview rect - Scale with resizer bottom Left', (done: Function) => {
            let overviewelement: HTMLElement = document.getElementById(overview.element.id);
            let target: HTMLElement = document.getElementById('overview_canvasbottomleft');
            let mouseDown: string = 'mouseDown';
            let mouseup: string = 'mouseUp';
            let mouseMove: string = 'mouseMove';
            overview[mouseDown]({ target: target, type: mouseDown });
            mouseEvents.mouseDownEvent(overviewelement, 1006, 170);
            mouseEvents.mouseMoveEvent(overviewelement, 1056, 160);
            overview[mouseup]({ target: target, type: mouseDown });


            expect((diagram.scroller.currentZoom.toFixed(4) === '2.6824')).toBe(true);
            expect((Math.round(diagram.scroller.horizontalOffset) <= -845 &&
                Math.round(diagram.scroller.horizontalOffset) >= -847) && (Math.round(diagram.scroller.verticalOffset) <= -86 &&
                    Math.round(diagram.scroller.verticalOffset) >= -90)).toBe(true);
            done();
        });
        it('Click on the overview rect - Scale with resizer bottom Left with y greater than X', (done: Function) => {
            let overviewelement: HTMLElement = document.getElementById(overview.element.id);
            let target: HTMLElement = document.getElementById('overview_canvasbottomleft');
            let mouseDown: string = 'mouseDown';
            let mouseup: string = 'mouseUp';
            let mouseMove: string = 'mouseMove';
            overview[mouseDown]({ target: target, type: mouseDown });
            mouseEvents.mouseDownEvent(overviewelement, 1006, 170);
            mouseEvents.mouseMoveEvent(overviewelement, 1016, 150);
            overview[mouseup]({ target: target, type: mouseDown });
            expect((diagram.scroller.currentZoom.toFixed(4) === '4.1946')).toBe(true);
            expect((Math.round(diagram.scroller.horizontalOffset) >= -1662 && Math.round(diagram.scroller.horizontalOffset) <= -1658) &&
                (Math.round(diagram.scroller.verticalOffset) >= -141 && Math.round(diagram.scroller.verticalOffset) <= -133)).toBe(true);
            done();
        });
        it('Click on the overview rect - Scale with resizer Left', (done: Function) => {
            let overviewelement: HTMLElement = document.getElementById(overview.element.id);
            let target: HTMLElement = document.getElementById('overview_canvasleft');
            let mouseDown: string = 'mouseDown';
            let mouseup: string = 'mouseUp';
            let mouseMove: string = 'mouseMove';
            overview[mouseDown]({ target: target, type: mouseDown });
            mouseEvents.mouseDownEvent(overviewelement, 1056, 160);
            mouseEvents.mouseMoveEvent(overviewelement, 1106, 170);
            overview[mouseup]({ target: target, type: mouseDown }); expect((diagram.scroller.currentZoom.toFixed(4) === '4.1946')).toBe(true);
            expect((Math.round(diagram.scroller.horizontalOffset) >= -1662 && Math.round(diagram.scroller.horizontalOffset) <= -1658) &&
                (Math.round(diagram.scroller.verticalOffset) >= -139 && Math.round(diagram.scroller.verticalOffset) <= -132)).toBe(true);
            done();
        });
        it('Click on the overview rect - Scale with resizer Top left', (done: Function) => {
            let overviewelement: HTMLElement = document.getElementById(overview.element.id);
            let target: HTMLElement = document.getElementById('overview_canvastopleft');
            let mouseDown: string = 'mouseDown';
            let mouseup: string = 'mouseUp';
            let mouseMove: string = 'mouseMove';
            overview[mouseDown]({ target: target, type: mouseDown });
            mouseEvents.mouseDownEvent(overviewelement, 1106, 170);
            mouseEvents.mouseMoveEvent(overviewelement, 1056, 160);
            overview[mouseup]({ target: target, type: mouseDown }); expect((diagram.scroller.currentZoom.toFixed(3) === '1.929')).toBe(true);
            expect((Math.round(diagram.scroller.horizontalOffset) >= -440 && Math.round(diagram.scroller.horizontalOffset) <= -438) &&
                (Math.round(diagram.scroller.verticalOffset) >= 205) && Math.round(diagram.scroller.verticalOffset) <= 209).toBe(true);
            done();
        });
        it('Click on the overview rect - Scale with resizer Top left Y greater than x', (done: Function) => {
            let overviewelement: HTMLElement = document.getElementById(overview.element.id);
            let target: HTMLElement = document.getElementById('overview_canvastopleft');
            let mouseDown: string = 'mouseDown';
            let mouseup: string = 'mouseUp';
            let mouseMove: string = 'mouseMove';
            overview[mouseDown]({ target: target, type: mouseDown });
            mouseEvents.mouseDownEvent(overviewelement, 1106, 170);
            mouseEvents.mouseMoveEvent(overviewelement, 1096, 140);
            overview[mouseup]({ target: target, type: mouseDown }); expect(diagram.scroller.currentZoom.toFixed(3) == '1.389').toBe(true);
            expect((Math.round(diagram.scroller.horizontalOffset) <= -147 && Math.round(diagram.scroller.horizontalOffset) >= -149) &&
                (Math.round(diagram.scroller.verticalOffset) >= 288) && (Math.round(diagram.scroller.verticalOffset) <= 291)).toBe(true);
            done();
        });
        it('Click on the overview rect - Scale with resizer Top', (done: Function) => {
            let overviewelement: HTMLElement = document.getElementById(overview.element.id);
            let target: HTMLElement = document.getElementById('overview_canvastop');
            let mouseDown: string = 'mouseDown';
            let mouseup: string = 'mouseUp';
            let mouseMove: string = 'mouseMove';
            overview[mouseDown]({ target: target, type: mouseDown });
            mouseEvents.mouseDownEvent(overviewelement, 1056, 170);
            mouseEvents.mouseMoveEvent(overviewelement, 1156, 190);
            overview[mouseup]({ target: target, type: mouseDown }); expect((diagram.scroller.currentZoom.toFixed(4) == '1.7077')).toBe(true);
            expect((Math.round(diagram.scroller.horizontalOffset) >= -252 && Math.round(diagram.scroller.horizontalOffset) <= -250) &&
                (Math.round(diagram.scroller.verticalOffset) >= 239 && Math.round(diagram.scroller.verticalOffset) <= 243)).toBe(true);
            done();
        });
        it('Click on the overview rect - Scale with resizer Top right', (done: Function) => {
            let overviewelement: HTMLElement = document.getElementById(overview.element.id);
            let target: HTMLElement = document.getElementById('overview_canvastopright');
            let mouseDown: string = 'mouseDown';
            let mouseup: string = 'mouseUp';
            let mouseMove: string = 'mouseMove';
            overview[mouseDown]({ target: target, type: mouseDown });
            mouseEvents.mouseDownEvent(overviewelement, 1156, 190);
            mouseEvents.mouseMoveEvent(overviewelement, 1176, 170);
            overview[mouseup]({ target: target, type: mouseDown }); expect((diagram.scroller.currentZoom.toFixed(4) === '1.4335')).toBe(true);
            expect((Math.round(diagram.scroller.horizontalOffset) >= -211 && Math.round(diagram.scroller.horizontalOffset) <= -209) &&
                (Math.round(diagram.scroller.verticalOffset) >= 281 && Math.round(diagram.scroller.verticalOffset) <= 284)).toBe(true); done();
        });
        it('Click on the overview rect - Scale with resizer Top right with Y greater than X', (done: Function) => {
            let overviewelement: HTMLElement = document.getElementById(overview.element.id);
            let target: HTMLElement = document.getElementById('overview_canvastopright');
            let mouseDown: string = 'mouseDown';
            let mouseup: string = 'mouseUp';
            let mouseMove: string = 'mouseMove';
            overview[mouseDown]({ target: target, type: mouseDown });
            mouseEvents.mouseDownEvent(overviewelement, 1156, 190);
            mouseEvents.mouseMoveEvent(overviewelement, 1166, 170);
            overview[mouseup]({ target: target, type: mouseDown }); expect(diagram.scroller.currentZoom.toFixed(4) === '1.2019').toBe(true);
            expect((Math.round(diagram.scroller.horizontalOffset) >= -177 && Math.round(diagram.scroller.horizontalOffset) <= -175) &&
                (Math.round(diagram.scroller.verticalOffset) >= 316 && Math.round(diagram.scroller.verticalOffset) <= 319)).toBe(true);
            done();
        });
        it('Click on the overview rect - Scale with resizer  Right', (done: Function) => {
            let overviewelement: HTMLElement = document.getElementById(overview.element.id);
            let target: HTMLElement = document.getElementById('overview_canvasright');
            let mouseDown: string = 'mouseDown';
            let mouseup: string = 'mouseUp';
            let mouseMove: string = 'mouseMove';
            overview[mouseDown]({ target: target, type: mouseDown });
            mouseEvents.mouseDownEvent(overviewelement, 1176, 170);
            mouseEvents.mouseMoveEvent(overviewelement, 1226, 160);
            mouseEvents.mouseUpEvent(overviewelement, 1226, 160);
            overview[mouseup]({ target: target, type: mouseDown }); expect((diagram.scroller.currentZoom === 0.8992806545147269)).toBe(true);
            expect((Math.round(diagram.scroller.horizontalOffset) >= -132 && Math.round(diagram.scroller.horizontalOffset) <= -131) &&
                (Math.round(diagram.scroller.verticalOffset) >= 300 && Math.round(diagram.scroller.verticalOffset) <= 302)).toBe(true);
            done();
        });
        it('Click on the overview rect - Pan', (done: Function) => {
            let overviewelement: HTMLElement = document.getElementById(overview.element.id);
            let target: HTMLElement = document.getElementById('overview_canvas_overviewsvg');
            let mouseDown: string = 'mouseDown';
            let mouseup: string = 'mouseUp';
            overview[mouseDown]({ target: target, type: mouseDown });
            mouseEvents.mouseDownEvent(overviewelement, 100, 650);
            overview[mouseup]({ target: target, type: mouseDown });
            overview[mouseDown]({ target: target, type: mouseDown });
            mouseEvents.mouseDownEvent(overviewelement, 100, 650);
            mouseEvents.mouseUpEvent(target, 100, 650); expect((diagram.scroller.currentZoom === 0.8992806545147269)).toBe(true);
            expect((Math.round(diagram.scroller.horizontalOffset) === 22) &&
                (Math.round(diagram.scroller.verticalOffset) === -179)).toBe(true);
            done();
        });
        it('Click on the overview rect - Draw', (done: Function) => {
            let overviewelement: HTMLElement = document.getElementById(overview.element.id);
            let target: HTMLElement = document.getElementById('overview_canvas_overviewsvg');
            let mouseDown: string = 'mouseDown';
            let mouseup: string = 'mouseUp';
            let mouseMove: string = 'mouseMove';
            overview[mouseDown]({ target: target, type: mouseDown });
            mouseEvents.mouseDownEvent(overviewelement, 100, 500);
            mouseEvents.mouseMoveEvent(overviewelement, 100, 550);
            mouseEvents.mouseUpEvent(target, 100, 550);
            overview[mouseup]({ target: target, type: mouseDown });
            expect((diagram.scroller.currentZoom.toFixed(3) === '2.927')).toBe(true);
            expect((Math.round(diagram.scroller.horizontalOffset) === -905) && (Math.round(diagram.scroller.verticalOffset) === 79)).toBe(true);
            done();
        });
        it('Click on the overview rect - Draw with current point lesser than start point', (done: Function) => {
            let overviewelement: HTMLElement = document.getElementById(overview.element.id);
            let target: HTMLElement = document.getElementById('overview_canvas_overviewsvg');
            let mouseDown: string = 'mouseDown';
            let mouseup: string = 'mouseUp';
            let mouseMove: string = 'mouseMove';
            overview[mouseDown]({ target: target, type: mouseDown });
            mouseEvents.mouseDownEvent(overviewelement, 150, 600);
            mouseEvents.mouseMoveEvent(overviewelement, 100, 550);
            mouseEvents.mouseUpEvent(target, 100, 550);
            overview[mouseup]({ target: target, type: mouseDown }); expect((diagram.scroller.currentZoom.toFixed(3) === '3.501')).toBe(true);
            expect((Math.round(diagram.scroller.horizontalOffset) == -1082)
                && (Math.round(diagram.scroller.verticalOffset) == -592)).toBe(true);
            done();
        });
        it('Overview - Scrolled Event', (done: Function) => {
            let scroller: HTMLElement = document.getElementById(diagram.element.id + 'content');
            scroller.scrollTop = 10;
            scroller.scrollLeft = 20;
            diagram.updateScrollOffset();
            diagram.scroller.setScrollOffset(20, 10);
            overview['scrolled']({} as PointerEvent); expect((diagram.scroller.currentZoom.toFixed(3) === '3.501')).toBe(true);
            expect((Math.round(diagram.scroller.horizontalOffset) === -20) &&
                (Math.round(diagram.scroller.verticalOffset) === -10)).toBe(true);
            done();
        });
        it('Click on the Resizer bottom right', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById('overview_canvasbottomright');
            mouseEvents.mouseDownEvent(diagramCanvas, 178.57142857142858, 148.80952380952382);
            mouseEvents.mouseMoveEvent(diagramCanvas, 178.57142857142858 + 10, 148.80952380952382 + 10);
            mouseEvents.mouseUpEvent(diagramCanvas, 178.57142857142858 + 10, 148.80952380952382 + 10); expect((diagram.scroller.currentZoom.toFixed(3) === '3.501')).toBe(true);
            expect((Math.round(diagram.scroller.horizontalOffset) === -20) &&
                (Math.round(diagram.scroller.verticalOffset) === -10)).toBe(true);
            done();
        });
        it('Click on the Resizer bottom left', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById('overview_canvasbottomleft');
            mouseEvents.mouseDownEvent(diagramCanvas, 178.57142857142858, 148.80952380952382);
            mouseEvents.mouseMoveEvent(diagramCanvas, 178.57142857142858 + 10, 148.80952380952382 + 10);
            mouseEvents.mouseUpEvent(diagramCanvas, 178.57142857142858 + 10, 148.80952380952382 + 10); expect((diagram.scroller.currentZoom.toFixed(3) === '3.501')).toBe(true);
            expect((Math.round(diagram.scroller.horizontalOffset) === -20) &&
                (Math.round(diagram.scroller.verticalOffset) === -10)).toBe(true);
            done();
        });
        it('Click on the Resizer top left', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById('overview_canvastopleft');
            mouseEvents.mouseDownEvent(diagramCanvas, 178.57142857142858, 148.80952380952382);
            mouseEvents.mouseMoveEvent(diagramCanvas, 178.57142857142858 + 10, 148.80952380952382 + 10);
            mouseEvents.mouseUpEvent(diagramCanvas, 178.57142857142858 + 10, 148.80952380952382 + 10); expect((diagram.scroller.currentZoom.toFixed(3) === '3.501')).toBe(true);
            expect((Math.round(diagram.scroller.horizontalOffset) === -20) &&
                (Math.round(diagram.scroller.verticalOffset) === -10)).toBe(true);
            done();
        });
        it('Click on the Resizer top right', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById('overview_canvastopright');
            mouseEvents.mouseDownEvent(diagramCanvas, 178.57142857142858, 148.80952380952382);
            mouseEvents.mouseMoveEvent(diagramCanvas, 178.57142857142858 + 10, 148.80952380952382 + 10);
            mouseEvents.mouseUpEvent(diagramCanvas, 178.57142857142858 + 10, 148.80952380952382 + 10); expect((diagram.scroller.currentZoom.toFixed(3) === '3.501')).toBe(true);
            expect((Math.round(diagram.scroller.horizontalOffset) === -20) &&
                (Math.round(diagram.scroller.verticalOffset) === -10)).toBe(true);
            done();
        });
        it('Click on the Resizer bottom', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById('overview_canvasbottom');
            mouseEvents.mouseDownEvent(diagramCanvas, 178.57142857142858, 148.80952380952382);
            mouseEvents.mouseMoveEvent(diagramCanvas, 178.57142857142858 + 10, 148.80952380952382 + 10);
            mouseEvents.mouseUpEvent(diagramCanvas, 178.57142857142858 + 10, 148.80952380952382 + 10); expect((diagram.scroller.currentZoom.toFixed(3) === '3.501')).toBe(true);
            expect((Math.round(diagram.scroller.horizontalOffset) === -20) &&
                (Math.round(diagram.scroller.verticalOffset) === -10)).toBe(true);
            done();
        });
        it('Click on the Resizer left', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById('overview_canvasleft');
            mouseEvents.mouseDownEvent(diagramCanvas, 178.57142857142858, 148.80952380952382);
            mouseEvents.mouseMoveEvent(diagramCanvas, 178.57142857142858 + 10, 148.80952380952382 + 10);
            mouseEvents.mouseUpEvent(diagramCanvas, 178.57142857142858 + 10, 148.80952380952382 + 10); expect((diagram.scroller.currentZoom.toFixed(3) === '3.501')).toBe(true);
            expect((Math.round(diagram.scroller.horizontalOffset) === -20) &&
                (Math.round(diagram.scroller.verticalOffset) === -10)).toBe(true);
            done();
        });
        it('Click on the Resizer top', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById('overview_canvastop');
            mouseEvents.mouseDownEvent(diagramCanvas, 178.57142857142858, 148.80952380952382);
            mouseEvents.mouseMoveEvent(diagramCanvas, 178.57142857142858 + 10, 148.80952380952382 + 10);
            mouseEvents.mouseUpEvent(diagramCanvas, 178.57142857142858 + 10, 148.80952380952382 + 10); expect((diagram.scroller.currentZoom.toFixed(3) === '3.501')).toBe(true);
            expect((Math.round(diagram.scroller.horizontalOffset) === -20) &&
                (Math.round(diagram.scroller.verticalOffset) === -10)).toBe(true);
            done();
        });
        it('Click on the Resizer right', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById('overview_canvasright');
            mouseEvents.mouseDownEvent(diagramCanvas, 178.57142857142858, 148.80952380952382);
            mouseEvents.mouseMoveEvent(diagramCanvas, 178.57142857142858 + 10, 148.80952380952382 + 10);
            mouseEvents.mouseUpEvent(diagramCanvas, 178.57142857142858 + 10, 148.80952380952382 + 10); expect((diagram.scroller.currentZoom.toFixed(3) === '3.501')).toBe(true);
            expect((Math.round(diagram.scroller.horizontalOffset) === -20) &&
                (Math.round(diagram.scroller.verticalOffset) === -10)).toBe(true);
            done();
        });
        it('Overview - Mouse wheel event', (done: Function) => {
            let scroller: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.mouseWheelEvent(scroller, 250, 500, true); expect((diagram.scroller.currentZoom.toFixed(4) === '2.9178')).toBe(true);
            expect((Math.round(diagram.scroller.horizontalOffset) == 24) && //(Math.round(diagram.scroller.verticalOffset) == 293
                //|| 
                Math.round(diagram.scroller.verticalOffset) == 74).toBe(true);
            done();
        });
        it('Overview - Document mouseup', (done: Function) => {
            let overviewelement: HTMLElement = document.getElementById(overview.element.id);
            let target: HTMLElement = document.getElementById('overview_canvas_overviewsvg');
            let mouseUp: string = 'documentMouseUp';
            let mouseup: string = 'mouseUp';
            overview[mouseUp]({ target: target, type: mouseUp });
            expect((diagram.scroller.currentZoom.toFixed(4) === '2.9178')).toBe(true);
            expect((Math.round(diagram.scroller.horizontalOffset) === 24) && (Math.round(diagram.scroller.verticalOffset) === 74)).toBe(true);
            done();
        });
        it('Overview - Pan with focused area with current and start x points are same', (done: Function) => {
            let overviewelement: HTMLElement = document.getElementById(overview.element.id);
            let target: HTMLElement = document.getElementById('overview_canvasoverviewrect');
            let mouseDown: string = 'mouseDown';
            let mouseup: string = 'mouseUp';
            let mouseMove: string = 'mouseMove';
            overview[mouseDown]({ target: target, type: mouseDown });
            mouseEvents.mouseDownEvent(overviewelement, 1094, 82);
            mouseEvents.mouseMoveEvent(overviewelement, 1094, 92);
            overview[mouseup]({ target: target, type: mouseDown });
            overview[mouseDown]({ target: target, type: mouseDown });
            mouseEvents.mouseDownEvent(overviewelement, 1094, 82);
            mouseEvents.mouseUpEvent(target, 1094, 82);
            expect((diagram.scroller.currentZoom.toFixed(4) === '2.9178')).toBe(true);
            expect((Math.round(diagram.scroller.horizontalOffset) === 24) && (Math.round(diagram.scroller.verticalOffset) === 74)).toBe(true);
            done();
        });

        it('Overview - Document mouseup with helper', (done: Function) => {
            let overviewelement: HTMLElement = document.getElementById(overview.element.id);
            let target: HTMLElement = document.getElementById('overview_canvas_overviewsvg');
            let mouseDown: string = 'mouseDown';
            let mouseup: string = 'mouseUp';
            let mouseMove: string = 'mouseMove';
            let documentMouseUp: string = 'documentMouseUp';
            overview[mouseDown]({ target: target, type: mouseDown });
            mouseEvents.mouseDownEvent(overviewelement, 1000, 50);
            mouseEvents.mouseMoveEvent(overviewelement, 1100, 150);
            overview[documentMouseUp]({ target: target, type: mouseDown });
            expect((diagram.scroller.currentZoom.toFixed(4) === '2.9178')).toBe(true);
            expect((Math.round(diagram.scroller.horizontalOffset) === 24) && (Math.round(diagram.scroller.verticalOffset) === 74)).toBe(true);
            done();
        });
        it('Overview - with height and width change', (done: Function) => {
            overview.width = 300;
            overview.height = 450;
            overview.dataBind();
            expect((diagram.scroller.currentZoom.toFixed(4) === '2.9178')).toBe(true);
            expect((Math.round(diagram.scroller.horizontalOffset) === 24) && (Math.round(diagram.scroller.verticalOffset) === 74)).toBe(true);
            done();
        });
        it('Overview - Mouse wheel event', (done: Function) => {
            let scroller: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.mouseWheelEvent(scroller, 250, 500, false);
            expect((diagram.scroller.currentZoom.toFixed(4) === '2.9178')).toBe(true);
            expect((Math.round(diagram.scroller.horizontalOffset) === 24) && (Math.round(diagram.scroller.verticalOffset) === 54)).toBe(true);
            done();
        });

        it('Changing the diagram size', (done: Function) => {
            let scroller: HTMLElement = document.getElementById(diagram.element.id + 'content');
            diagram.pageSettings = { width: 500, height: 500, showPageBreaks: true, multiplePage: true };
            diagram.dataBind();
            expect(overview.contentWidth === 1000 && overview.contentHeight === 2000).toBe(true);
            done();
        });
    });

    describe('Overview Tests with multiple overview', () => {
        let diagram: Diagram;
        let diagram2: Diagram;
        let overview: Overview;
        let ele: HTMLElement;
        let diagramElement: HTMLElement;
        let ove: HTMLElement;
        let scroller: DiagramScroller;
        let mouseEvents: MouseEvents = new MouseEvents();

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            diagramElement = createElement('div', { id: 'diagram2' });
            document.body.appendChild(diagramElement);
            ove = createElement('div', { id: 'overview', styles: 'display:none' });
            document.body.appendChild(ove);
            let connector: ConnectorModel = {
                id: 'connector1', sourcePoint: { x: 200, y: 100 }, targetPoint: { x: 400, y: 100 }
            };
            let node: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100,
                annotations: [{ content: 'Node1', height: 50, width: 50 }]
            };
            let node2: NodeModel = {
                id: 'node2', width: 100, height: 100, offsetX: 250, offsetY: 200,
                annotations: [{ content: 'Node2', height: 50, width: 50 }]
            };
            let node3: NodeModel = {
                id: 'node3', width: 100, height: 100, offsetX: 100, offsetY: 300,
                annotations: [{ content: 'Node3', height: 50, width: 50 }]
            };
            let node4: NodeModel = {
                id: 'node4', width: 100, height: 100, offsetX: 500, offsetY: 100,
                annotations: [{ content: 'Node4', height: 50, width: 50 }]
            };
            let node5: NodeModel = {
                id: 'node5', width: 80, height: 100, offsetX: 800, offsetY: 100,
                annotations: [{ content: 'Node5', height: 50, width: 50 }]
            };
            let node6: NodeModel = {
                id: 'node6', width: 100, height: 100, offsetX: 400, offsetY: 600,
                annotations: [{ content: 'Node6', height: 50, width: 50 }]
            };
            diagram = new Diagram({
                width: '600px', height: '500px', nodes: [node, node2, node3, node4, node5, node6], connectors: [connector],
                scrollSettings: { scrollLimit: 'Infinity' }
            });
            diagram2 = new Diagram({
                width: '600px', height: '500px', nodes: [node, node2, node3, node4, node5, node6], connectors: [connector],
                scrollSettings: { scrollLimit: 'Infinity' }
            });
            diagram.appendTo('#diagram');
            diagram2.appendTo('#diagram2');
            let options: OverviewModel = {};
            options.height = '500';
            options.width = '250';
            options.sourceID = 'diagram';
            overview = new Overview(options);
            overview.appendTo('#overview');

        });

        afterAll((): void => {
            overview.destroy();
            diagram.destroy();
            diagram2.destroy();
            ele.remove();
            diagramElement.remove();
            ove.remove();
        });
        it('Multiple overview rect - Pan with focused area', (done: Function) => {
            overview.element.style.display = 'block';
            let overviewelement: HTMLElement = document.getElementById(overview.element.id);
            let target: HTMLElement = document.getElementById('overview_canvasoverviewrect');
            let mouseDown: string = 'mouseDown';
            let mouseup: string = 'mouseUp';
            let mouseMove: string = 'mouseMove';
            overview[mouseDown]({ target: target, type: mouseDown });
            mouseEvents.mouseDownEvent(overviewelement, 1094, 82);
            mouseEvents.mouseMoveEvent(overviewelement, 1144, 92);
            overview[mouseup]({ target: target, type: mouseDown });
            overview[mouseDown]({ target: target, type: mouseDown });
            mouseEvents.mouseDownEvent(overviewelement, 1094, 82);
            mouseEvents.mouseUpEvent(target, 1094, 82);
            expect((diagram.scroller.currentZoom === 1)).toBe(true);
            expect((Math.round(diagram.scroller.horizontalOffset) >= -58 && Math.round(diagram.scroller.horizontalOffset) <= -52)
                && (Math.round(diagram.scroller.verticalOffset) >= -12 &&
                    Math.round(diagram.scroller.verticalOffset) <= -10)).toBe(true);
            done();
        });
        it('Overview - Scale with in action as true', (done: Function) => {
            let overviewelement: HTMLElement = document.getElementById(overview.element.id);
            let target: HTMLElement = document.getElementById('overview_canvasbottomright');
            let mouseDown: string = 'mouseDown';
            let mouseup: string = 'mouseUp';
            let mouseMove: string = 'mouseMove';
            overview[mouseDown]({ target: target, type: mouseDown });
            mouseEvents.mouseDownEvent(overviewelement, 1236, 170);
            mouseEvents.mouseMoveEvent(overviewelement, 1186, 160);
            overview[mouseDown]({ target: target, type: mouseDown });
            mouseEvents.mouseDownEvent(overviewelement, 1236, 170);
            mouseEvents.mouseMoveEvent(overviewelement, 1286, 180);
            overview[mouseup]({ target: target, type: mouseDown });
            expect(Math.round(diagram.scroller.currentZoom) == 1).toBe(true);
            expect((Math.round(diagram.scroller.horizontalOffset) >= -58 && Math.round(diagram.scroller.horizontalOffset) <= -52)
                && (Math.round(diagram.scroller.verticalOffset) >= -12 &&
                    Math.round(diagram.scroller.verticalOffset) <= -10)).toBe(true);
            done();
        });
        it('Overview - with two diagram', (done: Function) => {
            overview.sourceID = 'diagram2';
            overview.dataBind();
            expect(Math.round(diagram.scroller.currentZoom) == 1).toBe(true);
            expect((Math.round(diagram.scroller.horizontalOffset) >= -58 && Math.round(diagram.scroller.horizontalOffset) <= -52)
                && (Math.round(diagram.scroller.verticalOffset) >= -12 &&
                    Math.round(diagram.scroller.verticalOffset) <= -10)).toBe(true);
            done();
        });
    });

    describe('Overview Tests with multiple overview', () => {
        let diagram: Diagram;
        let diagram2: Diagram;
        let overview: Overview;
        let ele: HTMLElement;
        let diagramElement: HTMLElement;
        let ove: HTMLElement;
        let scroller: DiagramScroller;
        let mouseEvents: MouseEvents = new MouseEvents();

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            ove = createElement('div', { id: 'overview' });
            document.body.appendChild(ove);
            let connector: ConnectorModel = {
                id: 'connector1', sourcePoint: { x: 200, y: 100 }, targetPoint: { x: 400, y: 100 }
            };
            let node: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100,
                annotations: [{ content: 'Node1', height: 50, width: 50 }]
            };
            let node2: NodeModel = {
                id: 'node2', width: 100, height: 100, offsetX: 250, offsetY: 200,
                annotations: [{ content: 'Node2', height: 50, width: 50 }]
            };
            let node3: NodeModel = {
                id: 'node3', width: 100, height: 100, offsetX: 100, offsetY: 300,
                annotations: [{ content: 'Node3', height: 50, width: 50 }]
            };
            let node4: NodeModel = {
                id: 'node4', width: 100, height: 100, offsetX: 500, offsetY: 100,
                annotations: [{ content: 'Node4', height: 50, width: 50 }]
            };
            let node5: NodeModel = {
                id: 'node5', width: 80, height: 100, offsetX: 800, offsetY: 100,
                annotations: [{ content: 'Node5', height: 50, width: 50 }]
            };
            let node6: NodeModel = {
                id: 'node6', width: 100, height: 100, offsetX: 400, offsetY: 600,
                annotations: [{ content: 'Node6', height: 50, width: 50 }]
            };
            diagram = new Diagram({
                width: '600px', height: '500px', nodes: [node, node2, node3, node4, node5, node6], connectors: [connector],
            });

            diagram.appendTo('#diagram');

            let options: OverviewModel = {};
            options.height = '500';
            options.width = '250';
            options.sourceID = 'diagram';
            overview = new Overview(options);
            overview.appendTo('#overview');

        });

        afterAll((): void => {
            overview.destroy();
            diagram.destroy();
            ele.remove();
            ove.remove();
        });
        it('Overview - For window resize', (done: Function) => {
            diagram.width = '900px';
            diagram.height = '500px';
            diagram.dataBind();
            let overviewelement: HTMLElement = document.getElementById(overview.element.id);
            let resize = 'windowResize';
            overview[resize](<Event>{});
            setTimeout(() => {
                let bounds: ClientRect = overviewelement.getBoundingClientRect();
                expect(bounds.width == 732);
                expect(bounds.height == 500);
                done();
            }, 450);

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


    describe('Overview Tests', () => {
        let newdiagram: Diagram;
        let overview: Overview;
        let Diagramelement: HTMLElement;
        let parentelement: HTMLElement;
        let parentelement1: HTMLElement;
        let overViewElement: HTMLElement;
        let scroller: DiagramScroller;
        let mouseEvents: MouseEvents = new MouseEvents();
        let data: object[] = [
            {
                "Id": "parent", "Name": "Maria Anders", "Designation": "Managing Director"
            },
            {
                "Id": 1, "Name": "Ana Trujillo", "Designation": "Project Manager",
                "ReportingPerson": "parent"
            },
            {
                "Id": 2, "Name": "Lino Rodri", "Designation": "Project Manager",
                "ReportingPerson": "parent"
            },
            {
                "Id": 3, "Name": "Philip Cramer", "Designation": "Project Manager",
                "ReportingPerson": "parent"
            },
            {
                "Id": 4, "Name": "Pedro Afonso", "Designation": "Project Manager",
                "ReportingPerson": "parent"
            },
            {
                "Id": 5, "Name": "Anto Moreno", "Designation": "Project Lead",
                "ReportingPerson": 1
            },
            {
                "Id": 6, "Name": "Elizabeth Roel", "Designation": "Project Lead",
                "ReportingPerson": 1
            },
            {
                "Id": 7, "Name": "Aria Cruz", "Designation": "Project Lead",
                "ReportingPerson": 1
            },
            {
                "Id": 8, "Name": "Eduardo Roel", "Designation": "Project Lead",
                "ReportingPerson": 1
            },
            {
                "Id": 9, "Name": "Howard Snyd", "Designation": "Project Lead",
                "ReportingPerson": 2
            },
            {
                "Id": 10, "Name": "Daniel Tonini", "Designation": "Project Lead",
                "ReportingPerson": 2
            },
            {
                "Id": 11, "Name": "Nardo Batista", "Designation": "Project Lead",
                "ReportingPerson": 89
            },
            {
                "Id": 12, "Name": "Michael Holz", "Designation": "Project Lead",
                "ReportingPerson": 89
            },
            {
                "Id": 13, "Name": "Kloss Perrier", "Designation": "Project Lead",
                "ReportingPerson": 90
            },
            {
                "Id": 14, "Name": "Liz Nixon", "Designation": "Project Lead",
                "ReportingPerson": 3
            },
            {
                "Id": 15, "Name": "Paul Henriot", "Designation": "Project Lead",
                "ReportingPerson": 3
            },
            {
                "Id": 16, "Name": "Paula Parente", "Designation": "Project Lead",
                "ReportingPerson": 90
            },
            {
                "Id": 17, "Name": "Matti Kenna", "Designation": "Project Lead",
                "ReportingPerson": 4
            },
            {
                "Id": 18, "Name": "Laura Callahan", "Designation": "Project Lead",
                "ReportingPerson": 4
            },
            {
                "Id": 19, "Name": "Simon Roel", "Designation": "Project Lead",
                "ReportingPerson": 4
            },
            {
                "Id": 20, "Name": "Thomas Hardy", "Designation": "Senior S/w Engg",
                "ReportingPerson": 12
            },
            {
                "Id": 21, "Name": "Martín Kloss", "Designation": "Senior S/w Engg",
                "ReportingPerson": 5
            },
            {
                "Id": 23, "Name": "Diego Roel", "Designation": "Senior S/w Engg",
                "ReportingPerson": 7
            },
            {
                "Id": 24, "Name": "José Pedro ", "Designation": "Senior S/w Engg",
                "ReportingPerson": 8
            },
            {
                "Id": 25, "Name": "Manu Pereira", "Designation": "Senior S/w Engg",
                "ReportingPerson": 8
            },
            {
                "Id": 26, "Name": "Annette Roel", "Designation": "Senior S/w Engg",
                "ReportingPerson": 25
            },
            {
                "Id": 27, "Name": "Catherine Kaff", "Designation": "Senior S/w Engg",
                "ReportingPerson": 8
            },
            {
                "Id": 28, "Name": "Lúcia Carvalho", "Designation": "Senior S/w Engg",
                "ReportingPerson": 12
            },
            {
                "Id": 29, "Name": "Alej Camino", "Designation": "Senior S/w Engg",
                "ReportingPerson": 13
            },
            {
                "Id": 30, "Name": "Liu Wong", "Designation": "Senior S/w Engg",
                "ReportingPerson": 14
            },
            {
                "Id": 31, "Name": "Karin Josephs", "Designation": "Senior S/w Engg",
                "ReportingPerson": 14
            },
            {
                "Id": 33, "Name": "Pirkko King", "Designation": "Senior S/w Engg",
                "ReportingPerson": 17
            },

            {
                "Id": 34, "Name": "Karl Jablonski", "Designation": "Senior S/w Engg",
                "ReportingPerson": 18
            },

            {
                "Id": 35, "Name": "Zbyszek Yang", "Designation": "Senior S/w Engg",
                "ReportingPerson": 19
            },
            {
                "Id": 36, "Name": "Nancy", "Designation": "Senior S/w Engg",
                "ReportingPerson": 5
            },
            {
                "Id": 37, "Name": "Anne", "Designation": "Senior S/w Engg",
                "ReportingPerson": 6
            },
            {
                "Id": 38, "Name": "Isabel Castro", "Designation": "Senior S/w Engg",
                "ReportingPerson": 7
            },
            {
                "Id": 39, "Name": "Nardo Batista", "Designation": "Senior S/w Engg",
                "ReportingPerson": 9
            },
            {
                "Id": 40, "Name": "Rene Phillips", "Designation": "Senior S/w Engg",
                "ReportingPerson": 16
            },
            {
                "Id": 41, "Name": "Rita Pfalzheim", "Designation": "Senior S/w Engg",
                "ReportingPerson": 9
            },
            {
                "Id": 42, "Name": "Janete Limeira", "Designation": "Senior S/w Engg",
                "ReportingPerson": 11
            },
            {
                "Id": 43, "Name": "Christina kaff", "Designation": "S/w Engg",
                "ReportingPerson": 20
            },
            {
                "Id": 44, "Name": "Peter Franken", "Designation": "S/w Engg",
                "ReportingPerson": 21
            },
            {
                "Id": 45, "Name": "Carlos Schmitt", "Designation": "S/w Engg",
                "ReportingPerson": 23
            },
            {
                "Id": 46, "Name": "Yoshi Wilson", "Designation": "S/w Engg",
                "ReportingPerson": 23
            },
            {
                "Id": 47, "Name": "Jean Fresnière", "Designation": "S/w Engg",
                "ReportingPerson": 24
            },
            {
                "Id": 48, "Name": "Simon Roel", "Designation": "S/w Engg",
                "ReportingPerson": 25
            },
            {
                "Id": 52, "Name": "Palle Ibsen", "Designation": "S/w Engg",
                "ReportingPerson": 29
            },
            {
                "Id": 53, "Name": "Lúcia Carvalho", "Designation": "S/w Engg",
                "ReportingPerson": 30
            },
            {
                "Id": 54, "Name": "Hanna Moos", "Designation": "Project Trainee",
                "ReportingPerson": 30
            },
            {
                "Id": 55, "Name": "Peter Citeaux", "Designation": "Project Trainee",
                "ReportingPerson": 33
            },
            {
                "Id": 56, "Name": "Elizabeth Mary", "Designation": "Project Trainee",
                "ReportingPerson": 33
            },
            {
                "Id": 57, "Name": "Victoria Ash", "Designation": "Project Trainee",
                "ReportingPerson": 34
            },
            {
                "Id": 58, "Name": "Janine Labrune", "Designation": "Project Trainee",
                "ReportingPerson": 35
            },
            {
                "Id": 60, "Name": "Carine Schmitt", "Designation": "Project Trainee",
                "ReportingPerson": 11
            },
            {
                "Id": 61, "Name": "Paolo Accorti", "Designation": "Project Trainee",
                "ReportingPerson": 38
            },
            {
                "Id": 62, "Name": "André Fonseca", "Designation": "Project Trainee",
                "ReportingPerson": 41
            },
            {
                "Id": 63, "Name": "Mario Pontes", "Designation": "Project Trainee",
                "ReportingPerson": 6
            },
            {
                "Id": 64, "Name": "John Steel", "Designation": "Project Trainee",
                "ReportingPerson": 7
            },
            {
                "Id": 65, "Name": "Renate Jose", "Designation": "Project Trainee",
                "ReportingPerson": 42
            },
            {
                "Id": 66, "Name": "Jaime Yorres", "Designation": "Project Trainee",
                "ReportingPerson": 20
            },
            {
                "Id": 67, "Name": "Alex Feuer", "Designation": "Project Trainee",
                "ReportingPerson": 21
            },
            {
                "Id": 70, "Name": "Helen Marie", "Designation": "Project Trainee",
                "ReportingPerson": 24
            },
            {
                "Id": 73, "Name": "Sergio roel", "Designation": "Project Trainee",
                "ReportingPerson": 37
            },
            {
                "Id": 75, "Name": "Janete Limeira", "Designation": "Project Trainee",
                "ReportingPerson": 29
            },
            {
                "Id": 76, "Name": "Jonas Bergsen", "Designation": "Project Trainee",
                "ReportingPerson": 18
            },
            {
                "Id": 77, "Name": "Miguel Angel", "Designation": "Project Trainee",
                "ReportingPerson": 18
            },
            {
                "Id": 80, "Name": "Helvetis Nagy", "Designation": "Project Trainee",
                "ReportingPerson": 34
            },
            {
                "Id": 81, "Name": "Rita Müller", "Designation": "Project Trainee",
                "ReportingPerson": 35
            },
            {
                "Id": 82, "Name": "Georg Pipps", "Designation": "Project Trainee",
                "ReportingPerson": 36
            },
            {
                "Id": 83, "Name": "Horst Kloss", "Designation": "Project Trainee",
                "ReportingPerson": 37
            },
            {
                "Id": 84, "Name": "Paula Wilson", "Designation": "Project Trainee",
                "ReportingPerson": 38
            },
            {
                "Id": 85, "Name": " Jose Michael", "Designation": "Project Trainee",
                "ReportingPerson": 37
            },
            {
                "Id": 86, "Name": "Mauri Moroni", "Designation": "Project Trainee",
                "ReportingPerson": 40
            },
            {
                "Id": 87, "Name": "Michael Holz", "Designation": "Project Trainee",
                "ReportingPerson": 41
            },
            {
                "Id": 88, "Name": "Alej Camino", "Designation": "Project Trainee",
                "ReportingPerson": 42
            },
            {
                "Id": 89, "Name": "Jytte Petersen", "Designation": "Project Manager",
                "ReportingPerson": "parent"
            },
            {
                "Id": 90, "Name": "Mary Saveley", "Designation": "Project Manager",
                "ReportingPerson": "parent"
            },
            {
                "Id": 91, "Name": "Robert King", "Designation": "Project Manager",
                "ReportingPerson": "parent"
            },
            {
                "Id": 95, "Name": "Roland Mendel", "Designation": "CSR",
                "ReportingPerson": 19
            },
            {
                "Id": 98, "Name": "Helen Bennett", "Designation": "SR",
                "ReportingPerson": 42
            },
            {
                "Id": 99, "Name": "Carlos Nagy", "Designation": "SR",
                "ReportingPerson": 42
            },
            {
                "Id": 100, "Name": "Felipe Kloss", "Designation": "SR",
                "ReportingPerson": 77
            }
        ];


        beforeAll((): void => {
            parentelement = createElement('div', { id: 'overviewdiagram', styles: "width: 100%;height: 500px;" });
            document.body.appendChild(parentelement)
            parentelement1 = createElement('div', { id: 'parentelement1', styles: "width:74%;height: 500px; float:left;" });
            parentelement.appendChild(parentelement1);
            Diagramelement = createElement('div', { id: 'diagram' });
            parentelement1.appendChild(Diagramelement);
            overViewElement = createElement('div', { id: 'overview', styles: "width:25%;height:200px;float:left; border-color:lightgray;border-style:solid;" });
            parentelement.appendChild(overViewElement);
            newdiagram = new Diagram({
                width: '100%', height: '600px',
                //configures data source settings
                rulerSettings: { showRulers: true },
                dataSourceSettings: {
                    //sets the fields to bind
                    id: 'Id', parentId: 'ReportingPerson',
                    dataSource: new DataManager((data as any)),
                    //binds the data with the nodes
                    doBinding: (nodeModel: NodeModel, diagram: Diagram) => {
                        nodeModel.width = 100
                        nodeModel.shape = {
                            type: 'HTML',
                            content: '<div><img src="https://www.w3schools.com/tags/smiley.gif" alt="Smiley face" width="42" height="42"></div>'
                        }
                        nodeModel.annotations = [
                            {
                                content: 'GetReadyFolks'
                            }
                        ]
                    }
                },
                layout: {
                    type: 'RadialTree', verticalSpacing: 30, horizontalSpacing: 20,
                    root: 'Category',
                }
            });
            newdiagram.appendTo('#diagram');
            newdiagram.fitToPage()
            let options: OverviewModel = {};
            options.height = '150px';
            options.width = '100%';
            options.sourceID = 'diagram';
            overview = new Overview(options);
            overview.appendTo('#overview');

        });

        afterAll((): void => {
            overview.destroy();
            newdiagram.destroy();
            Diagramelement.remove();
            overViewElement.remove();
            parentelement1.remove();
            parentelement.remove();
        });

        it('Overview - For window resize', (done: Function) => {
            let htmlOverView = document.getElementById('overview_htmlLayer');
            expect(htmlOverView.style.transform === "scale(0.0821449) translate(731.609px, 790.805px)").toBe(true);
            done();
        });




    });
});