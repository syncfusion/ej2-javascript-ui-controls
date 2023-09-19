import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../src/diagram/diagram';
import { ConnectorModel } from '../../src/diagram/objects/connector-model';
import { BasicShapeModel, NodeModel } from '../../src/diagram/objects/node-model';
import { DiagramScroller } from '../../src/diagram/interaction/scroller';
import { MouseEvents } from '../../spec/diagram/interaction/mouseevents.spec';
import { Overview } from '../../src/overview/overview';
import { OverviewModel } from '../../src/overview/overview-model';
import { profile, inMB, getMemoryProfile } from '../common.spec';
import { DataManager, Query } from '@syncfusion/ej2-data';
import {
    RadialTree, DataBinding,HierarchicalTree, DiagramTools, StackPanel, Container, TextElement, ZoomOptions, TreeInfo, ILoadEventArgs
} from '../../src/diagram/index';
import { createSpinner, showSpinner, hideSpinner } from '@syncfusion/ej2-popups';
Diagram.Inject(RadialTree, DataBinding,HierarchicalTree);

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
            expect((Math.round(diagram.scroller.horizontalOffset) == -15 || Math.floor(diagram.scroller.horizontalOffset) === 23 ) && (
                Math.round(diagram.scroller.verticalOffset) == -0 || Math.floor(diagram.scroller.verticalOffset) === 73)).toBe(true);
            done();
        });
        it('Overview - Document mouseup', (done: Function) => {
            let overviewelement: HTMLElement = document.getElementById(overview.element.id);
            let target: HTMLElement = document.getElementById('overview_canvas_overviewsvg');
            let mouseUp: string = 'documentMouseUp';
            let mouseup: string = 'mouseUp';
            overview[mouseUp]({ target: target, type: mouseUp });
            expect((diagram.scroller.currentZoom.toFixed(4) === '2.9178')).toBe(true);
            console.log('Overview - Document mouseup');
            console.log('diagram.scroller.currentZoom = '+ diagram.scroller.currentZoom)
            console.log('diagram.scroller.horizontalOffset = '+diagram.scroller.horizontalOffset);
            console.log('diagram.scroller.verticalOffset ='+diagram.scroller.verticalOffset);
            expect((Math.round(diagram.scroller.horizontalOffset) === 23 || Math.round(diagram.scroller.horizontalOffset) === -14 || Math.round(diagram.scroller.horizontalOffset) === -15 || Math.floor(diagram.scroller.horizontalOffset) === 23) 
            && ((Math.round(diagram.scroller.verticalOffset) === -0.16 || Math.round(diagram.scroller.verticalOffset) === 0 || Math.floor(diagram.scroller.verticalOffset) === 73))).toBe(true);
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
            console.log('Overview - Pan with focused area with current and start x points are same');
            console.log('diagram.scroller.currentZoom = '+ diagram.scroller.currentZoom)
            console.log('diagram.scroller.horizontalOffset = '+diagram.scroller.horizontalOffset);
            console.log('diagram.scroller.verticalOffset ='+diagram.scroller.verticalOffset);
            expect((diagram.scroller.currentZoom.toFixed(4) === '2.9178')).toBe(true);
            expect((Math.round(diagram.scroller.horizontalOffset) === -14.86 || Math.round(diagram.scroller.horizontalOffset) === -14 || Math.round(diagram.scroller.horizontalOffset) === -15 || Math.floor(diagram.scroller.horizontalOffset) === 23) 
            && (Math.round(diagram.scroller.verticalOffset) === -0.16 || Math.round(diagram.scroller.verticalOffset) === 0 || Math.floor(diagram.scroller.verticalOffset) === 73)).toBe(true);
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
            console.log('Overview - Document mouseup with helper');
            console.log('diagram.scroller.currentZoom = '+ diagram.scroller.currentZoom)
            console.log('diagram.scroller.horizontalOffset = '+diagram.scroller.horizontalOffset);
            console.log('diagram.scroller.verticalOffset ='+diagram.scroller.verticalOffset);
            expect((diagram.scroller.currentZoom.toFixed(4) === '2.9178')).toBe(true);
            expect((Math.round(diagram.scroller.horizontalOffset) === -14 || Math.floor(diagram.scroller.horizontalOffset) === 23) && (Math.round(diagram.scroller.verticalOffset) === 0 || Math.floor(diagram.scroller.verticalOffset) === 73)).toBe(true);
            done();
        });
        it('Overview - with height and width change', (done: Function) => {
            overview.width = 300;
            overview.height = 450;
            overview.dataBind();
            console.log('Overview - with height and width change');
            console.log('diagram.scroller.currentZoom = '+ diagram.scroller.currentZoom)
            console.log('diagram.scroller.horizontalOffset = '+diagram.scroller.horizontalOffset);
            console.log('diagram.scroller.verticalOffset ='+diagram.scroller.verticalOffset);
            expect((diagram.scroller.currentZoom.toFixed(4) === '2.9178')).toBe(true);
            expect((Math.round(diagram.scroller.horizontalOffset) === -14 || Math.floor(diagram.scroller.horizontalOffset) === 23) && (Math.round(diagram.scroller.verticalOffset) === 0 || Math.floor(diagram.scroller.verticalOffset) === 73)).toBe(true);
            done();
        });
        it('Overview - Mouse wheel event', (done: Function) => {
            let scroller: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.mouseWheelEvent(scroller, 250, 500, false);
            console.log('Overview - Mouse wheel event');
            console.log('diagram.scroller.currentZoom = '+ diagram.scroller.currentZoom)
            console.log('diagram.scroller.horizontalOffset = '+diagram.scroller.horizontalOffset);
            console.log('diagram.scroller.verticalOffset ='+diagram.scroller.verticalOffset);
            expect((diagram.scroller.currentZoom.toFixed(4) === '2.9178')).toBe(true);
            expect((Math.round(diagram.scroller.horizontalOffset) === -14 || Math.floor(diagram.scroller.horizontalOffset) === 23) && (Math.round(diagram.scroller.verticalOffset) === 0 || Math.floor(diagram.scroller.verticalOffset) === 63)).toBe(true);
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
        it('Overview Visibility as Hidden- For window resize', (done: Function) => {
            diagram.width = '900px';
            diagram.height = '500px';
            diagram.dataBind();
            let overviewelement: HTMLElement = document.getElementById(overview.element.id);
            overviewelement.hidden = true;
            let resize = 'windowResize';
            overview[resize](<Event>{});
            setTimeout(() => {
                let bounds: ClientRect = overviewelement.getBoundingClientRect();
                expect(bounds.width == 0);
                expect(bounds.height == 0);
                done();
                overviewelement.hidden = false;
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
            let overviewstyle = document.getElementById("overview_canvas").getAttribute("style")
            console.log(overviewstyle)
            console.log(htmlOverView.style.transform);
            console.log("Overview - For window resize")
            expect(overviewstyle === "position: relative; height: 150px; width: 100%; touch-action: none;").toBe(true);
            expect(htmlOverView.style.transform === "scale(0.0662188) translate(731.609px, 790.805px)" || htmlOverView.style.transform === "scale(0.0821449) translate(734.139px, 797.163px)").toBe(true);
            done();
        });




    });




    describe('Overview Not updated during zoom ', () => {
        let newdiagram: Diagram;
        let overview: Overview;
        let Diagramelement: HTMLElement;
        let parentelement: HTMLElement;
        let parentelement1: HTMLElement;
        let overViewElement: HTMLElement;
        let scroller: DiagramScroller;
        let mouseEvents: MouseEvents = new MouseEvents();



        beforeAll((): void => {
            let shape: BasicShapeModel = { type: 'Basic' };
            let node: NodeModel =
            {
                shape: shape

            };
            parentelement = createElement('div', { id: 'overviewdiagram', styles: "width: 100%;height: 500px;" });
            document.body.appendChild(parentelement)
            parentelement1 = createElement('div', { id: 'parentelement1', styles: "width:74%;height: 500px; float:left;" });
            parentelement.appendChild(parentelement1);
            Diagramelement = createElement('div', { id: 'diagram' });
            parentelement1.appendChild(Diagramelement);
            overViewElement = createElement('div', { id: 'overview', styles: "width:25%;height:200px;float:left; border-color:lightgray;border-style:solid;" });
            parentelement.appendChild(overViewElement);
            newdiagram = new Diagram({
                width: "100%",
                height: "500px",
                scrollSettings: { minZoom: 0.0 },
                drawingObject: node,
                pageSettings: {
                    width: 1024,
                    height: 768,
                    showPageBreaks: true
                    //boundaryConstraints: "Page"
                },
                tool: DiagramTools.DrawOnce,
                rulerSettings: { showRulers: true }

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

        it('Overview Not updated during zoom', (done: Function) => {
            console.log("Overview Not updated during zoom")
            debugger
            newdiagram.pageSettings.width = 5000;
            newdiagram.pageSettings.height = 5000;
            newdiagram.dataBind();
            newdiagram.zoom(0.02788656582264943)
            newdiagram.dataBind();
            newdiagram.zoom(0.02788656582264943)
            newdiagram.dataBind();
            var node: NodeModel = { id: "newnode", width: 100, height: 100, offsetX: 400, offsetY: 400 };
            newdiagram.add(node);
            console.log(overview.contentHeight)
            expect(overview.contentHeight > 5000).toBe(true);

            done();
        });




    });

    describe('Overview Tests with Native node', () => {
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
                id: 'connector1', sourceID: 'node1', targetID: 'node2'
            };
            let node: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100,
                shape: {
                    type: 'Native', content: '<g xmlns="http://www.w3.org/2000/svg">' +
                        '<rect height="256" width="256" fill="#34353F"/>' +
                        '<path id="path1" transform="rotate(0,128,128) translate(59.1078108549118,59) scale(4.3125,4.3125)  " fill="#FFFFFF" d="M12.12701,24.294998C12.75201,24.294998 13.258998,24.803009 13.258998,25.428009 13.258998,26.056 12.75201,26.563004 12.12701,26.563004 11.499019,26.563004 10.993007,26.056 10.993007,25.428009 10.993007,24.803009 11.499019,24.294998 12.12701,24.294998z M7.9750035,24.294998C8.6010101,24.294998 9.1090057,24.803009 9.1090057,25.428009 9.1090057,26.056 8.6010101,26.563004 7.9750035,26.563004 7.3480199,26.563004 6.8399942,26.056 6.8399942,25.428009 6.8399942,24.803009 7.3480199,24.294998 7.9750035,24.294998z M7.9750035,20.286011C8.6010101,20.286011 9.1090057,20.792999 9.1090057,21.419006 9.1090057,22.044006 8.6010101,22.552002 7.9750035,22.552002 7.3500035,22.552002 6.8420084,22.044006 6.8420084,21.419006 6.8420084,20.792999 7.3500035,20.286011 7.9750035,20.286011z M18.499994,19.317001C18.313013,19.317001,18.156,19.472,18.156,19.656006L18.156,27.01001C18.156,27.195007,18.313013,27.350006,18.499994,27.350006L29.521993,27.350006C29.707998,27.350006,29.865988,27.195007,29.865988,27.01001L29.865988,19.656006C29.865988,19.472,29.707998,19.317001,29.521993,19.317001z M17.243006,17.443008L30.778003,17.443008C31.425007,17.445007,31.947986,17.962006,31.950001,18.602997L31.950001,28.542007C31.947986,29.182999,31.425007,29.702011,30.778003,29.703003L25.654012,29.703003C25.511007,29.703003 25.399008,29.824997 25.413992,29.964996 25.430013,30.13501 25.452993,30.360001 25.477011,30.559998 25.506002,30.809998 25.727987,30.980011 25.976003,31.033997L27.756002,31.419006C27.907003,31.452011 28.015005,31.584 28.015005,31.738007 28.015005,31.883011 27.895986,32 27.74999,32L27.571005,32 20.450004,32 20.318016,32C20.171013,32 20.053001,31.883011 20.053001,31.738007 20.053001,31.585007 20.161003,31.452011 20.312004,31.419998L22.115989,31.033005C22.35601,30.98201 22.572014,30.815002 22.596,30.574005 22.616997,30.363007 22.636009,30.130997 22.648002,29.960007 22.658012,29.819 22.542015,29.70401 22.399986,29.70401L17.243006,29.703003C16.596002,29.702011,16.072992,29.182999,16.071008,28.542007L16.071008,18.602997C16.072992,17.962006,16.596002,17.445007,17.243006,17.443008z M7.9750035,16.133011C8.6020172,16.133011 9.1100128,16.641006 9.1100128,17.268005 9.1100128,17.893997 8.6020172,18.402008 7.9750035,18.402008 7.3489964,18.402008 6.8410013,17.893997 6.8410013,17.268005 6.8410013,16.641006 7.3489964,16.133011 7.9750035,16.133011z M24.027,13.762009C24.654014,13.762009 25.16201,14.270004 25.16201,14.895996 25.16201,15.522003 24.654014,16.029999 24.027,16.029999 23.400993,16.029999 22.892998,15.522003 22.892998,14.895996 22.892998,14.270004 23.400993,13.762009 24.027,13.762009z M24.027,9.6110077C24.653007,9.6110077 25.161003,10.119003 25.161003,10.74501 25.161003,11.37001 24.653007,11.878006 24.027,11.878006 23.402,11.878006 22.894005,11.37001 22.894005,10.74501 22.894005,10.119003 23.402,9.6110077 24.027,9.6110077z M24.027,5.6000061C24.654014,5.6000061 25.16201,6.1080017 25.16201,6.7350006 25.16201,7.3610077 24.654014,7.8690033 24.027,7.8690033 23.400993,7.8690033 22.892998,7.3610077 22.892998,6.7350006 22.892998,6.1080017 23.400993,5.6000061 24.027,5.6000061z M19.876001,5.6000061C20.503013,5.6000061 21.011009,6.1080017 21.011009,6.7350006 21.011009,7.3610077 20.503013,7.8690033 19.876001,7.8690033 19.249994,7.8690033 18.743006,7.3610077 18.743006,6.7350006 18.743006,6.1080017 19.249994,5.6000061 19.876001,5.6000061z M2.4290157,1.8740082C2.2420037,1.8740082,2.0850215,2.029007,2.0850215,2.2140045L2.0850215,9.5680084C2.0850215,9.753006,2.2420037,9.9069977,2.4290157,9.9069977L13.451014,9.9069977C13.637995,9.9069977,13.795008,9.753006,13.795008,9.5680084L13.795008,2.2140045C13.795008,2.029007,13.637995,1.8740082,13.451014,1.8740082z M1.1730042,0L14.706996,0C15.353999,0.0019989014,15.877009,0.51899719,15.878993,1.1600037L15.878993,11.100006C15.877009,11.740005,15.353999,12.26001,14.706996,12.26001L9.5830047,12.26001C9.4399994,12.26001 9.3290069,12.382004 9.3420074,12.52301 9.3600128,12.692001 9.3829925,12.917999 9.4060028,13.117004 9.4349945,13.367004 9.6570099,13.53801 9.9049957,13.591003L11.684994,13.975998C11.835994,14.009003 11.945003,14.141998 11.945003,14.294998 11.945003,14.440002 11.826015,14.557007 11.679012,14.557007L11.499996,14.557007 4.3789966,14.557007 4.2470081,14.557007C4.1000049,14.557007 3.9819935,14.440002 3.9819937,14.294998 3.9819935,14.141998 4.0899952,14.009003 4.2409961,13.977005L6.0450113,13.589996C6.2860086,13.539001 6.501005,13.373001 6.5249918,13.130997 6.5460184,12.921005 6.5650003,12.688004 6.5769937,12.516998 6.5870035,12.376999 6.4710062,12.262009 6.3290079,12.262009L1.1730042,12.26001C0.52499391,12.26001,0.0020143806,11.740005,0,11.100006L0,1.1600037C0.0020143806,0.51899719,0.52499391,0.0019989014,1.1730042,0z"/>' +
                        '</g>'
                }
            };
            let node2: NodeModel = {
                id: 'node2', width: 100, height: 100, offsetX: 400, offsetY: 350,
                shape: {
                    type: 'Native', content: '<g xmlns="http://www.w3.org/2000/svg">' +
                        '<rect height="256" width="256" fill="#34353F"/>' +
                        '<path id="path1" transform="rotate(0,128,128) translate(59,61.2230899333954) scale(4.3125,4.3125)  " fill="#FFFFFF" d="M18.88501,23.042998L26.804993,23.042998 26.804993,30.969001 18.88501,30.969001z M9.4360352,23.042998L17.358032,23.042998 17.358032,30.969001 9.4360352,30.969001z M0.014038086,23.042998L7.9360352,23.042998 7.9360352,30.969001 0.014038086,30.969001z M18.871033,13.609001L26.791016,13.609001 26.791016,21.535994 18.871033,21.535994z M9.4219971,13.609001L17.342041,13.609001 17.342041,21.535994 9.4219971,21.535994z M0,13.609001L7.9219971,13.609001 7.9219971,21.535994 0,21.535994z M9.4219971,4.1859968L17.342041,4.1859968 17.342041,12.113998 9.4219971,12.113998z M0,4.1859968L7.9219971,4.1859968 7.9219971,12.113998 0,12.113998z M25.846008,0L32,5.2310026 26.773987,11.382995 20.619019,6.155998z"/>' +
                        '</g>'
                }
            };
            diagram = new Diagram({
                width: '600px', height: '500px', nodes: [node, node2], connectors: [connector],
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
        it('Overview check native element offsetx', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 100, 100);
            mouseEvents.mouseDownEvent(diagramCanvas, 100, 100);
            mouseEvents.mouseMoveEvent(diagramCanvas, 500, -100);
            mouseEvents.mouseUpEvent(diagramCanvas, 500, -100);
            expect(diagram.selectedItems.nodes[0].wrapper.offsetX != 100).toBe(true);
            done();
        });

    });

    describe('Exception occurs while changing Overview id and window resize ', () => {
        let diagram: Diagram;
        let overview: Overview;
        let ele: HTMLElement;
        let ove: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            ove = createElement('div', { id: 'over' });
            document.body.appendChild(ove);

            let nodes: NodeModel[] = [{
                id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100,
                shape: {
                    type: 'HTML',
                    content: '<div style="background:#6BA5D7;height:100%;width:100%;"><button type="button" style="width:100px"> Button</button></div>'
                }
            },{
                id: 'node2', width: 100, height: 100, offsetX: 400, offsetY: 350,
                shape: {
                    type: 'HTML', 
                    content: '<div style="background:#6BA5D7;height:100%;width:100%;"><button type="button" style="width:100px"> Button</button></div>'
                }
            }];
            diagram = new Diagram({
                width: '600px', height: '500px', nodes: nodes,
            });

            diagram.appendTo('#diagram');

            let options: OverviewModel = {};
            options.height = '500';
            options.width = '250';
            options.sourceID = 'diagram';
            overview = new Overview(options);
            overview.appendTo('#over');

        });

        afterAll((): void => {
            overview.destroy();
            diagram.destroy();
            ele.remove();
            ove.remove();
        });
        it('Checking overview html layer rendering with different id', (done: Function) => {
            expect(window['domTable']['overhtml_layer']!==null && window['domTable']['overviewhtml_layer']===undefined).toBe(true);
            done();
        });
    });

    describe('Overview HTML layer not update properly issue', () => {
        let diagram: Diagram;
        let overview: Overview;
        let ele: HTMLElement;
        let ove: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            ove = createElement('div', { id: 'over' });
            document.body.appendChild(ove);

            let nodes: NodeModel[] = [{
                id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100,
                shape: {
                    type: 'HTML',
                    content: '<div style="background:#6BA5D7;height:100%;width:100%;"><button type="button" style="width:100px"> Button</button></div>'
                }
            }, {
                id: 'node2', width: 100, height: 100, offsetX: 400, offsetY: 350,
                shape: {
                    type: 'HTML',
                    content: '<div style="background:#6BA5D7;height:100%;width:100%;"><button type="button" style="width:100px"> Button</button></div>'
                }
            }];

            let connectors: ConnectorModel[] = [
                {
                    id: "connector1",
                    style: {
                        strokeColor: '#6BA5D7',
                        fill: '#6BA5D7',
                        strokeWidth: 2
                    },
                    targetDecorator: {
                        style: {
                            fill: '#6BA5D7',
                            strokeColor: '#6BA5D7'
                        }
                    },

                    sourcePoint: {
                        x: 300,
                        y: 150
                    },
                    targetPoint: {
                        x: 550,
                        y: 150
                    }
                }
            ];
            diagram = new Diagram({
                width: '600px', height: '500px', nodes: nodes, connectors: connectors,
                scrollSettings: {
                    scrollLimit: 'Infinity',
                    canAutoScroll: true,
                    autoScrollBorder: {
                        left: 50,
                        right: 50,
                        top: 50,
                        bottom: 50
                    }
                },
            });

            diagram.appendTo('#diagram');

            let options: OverviewModel = {};
            options.height = '500';
            options.width = '250';
            options.sourceID = 'diagram';
            overview = new Overview(options);
            overview.appendTo('#over');

        });

        afterAll((): void => {
            overview.destroy();
            diagram.destroy();
            ele.remove();
            ove.remove();
        });
        it('Drag the HTML node and check the overview HTML layer', (done: Function) => {
            diagram.select([diagram.nodes[0]]);
            var node_element = document.getElementById('node1_content_html_element');
            var position1 = node_element.style.left;
            diagram.drag(diagram.nodes[0], 150, 0);
            var position2 = node_element.style.left;
            expect(position2 === "200px" ).toBe(true);
            done();
        });
    });

    describe('Overview not updated properly while zoom out', () => {
        let diagram: Diagram;
        let overview: Overview;
        let ele: HTMLElement;
        let ove: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram',styles:"width:74%;height: 500px; float:left" });
            document.body.appendChild(ele);
            ove = createElement('div', { id: 'overview1' ,styles:"width:25%;height:200px;float:left; border-color:lightgray;border-style:solid;"});
            document.body.appendChild(ove);

            let data: object[] =  [
                {
                    'Id': 'parent', 'Name': 'Maria Anders', 'Designation': 'Managing Director',
                     'IsExpand': 'true', 'RatingColor': '#C34444'
                },
                {
                    'Id': 1, 'Name': 'Ana Trujillo', 'Designation': 'Project Manager',
                    'IsExpand': 'false',
                    'RatingColor': '#68C2DE', 'ReportingPerson': 'parent'
                },
                {
                    'Id': 2, 'Name': 'Anto Moreno', 'Designation': 'Project Lead',
                     'IsExpand': 'false',
                    'RatingColor': '#93B85A', 'ReportingPerson': 1
                },
                {
                    'Id': 3, 'Name': 'Thomas Hardy', 'Designation': 'Senior S/w Engg',
                     'IsExpand': 'false',
                    'RatingColor': '#68C2DE', 'ReportingPerson': 2
                },
                {
                    'Id': 4, 'Name': 'Christina kaff', 'Designation': 'S/w Engg',
                    'IsExpand': 'false',
                    'RatingColor': '#93B85A', 'ReportingPerson': 3
                },
                {
                    'Id': 5, 'Name': 'Hanna Moos', 'Designation': 'Project Trainee',
                    'IsExpand': 'true',
                    'RatingColor': '#D46E89', 'ReportingPerson': 4
                },
                {
                    'Id': 6, 'Name': 'Peter Citeaux', 'Designation': 'S/w Engg',
                   'IsExpand': 'true',
                    'RatingColor': '#68C2DE', 'ReportingPerson': 5
                },
                {
                    'Id': 7, 'Name': 'Martín Kloss', 'Designation': 'Project Trainee',
                    'IsExpand': 'false',
                    'RatingColor': '#93B85A', 'ReportingPerson': 6
                },
                {
                    'Id': 8, 'Name': 'Elizabeth Mary', 'Designation': 'Project Trainee',
                     'IsExpand': 'None',
                    'RatingColor': '#93B85A', 'ReportingPerson': 6
                },
                {
                    'Id': 9, 'Name': 'Victoria Ash', 'Designation': 'Senior S/w Engg',
                   'IsExpand': 'None',
                    'RatingColor': '#D46E89', 'ReportingPerson': 5
                },
                {
                    'Id': 10, 'Name': 'Francisco Yang', 'Designation': 'Senior S/w Engg',
                     'IsExpand': 'None',
                    'RatingColor': '#93B85A', 'ReportingPerson': 3
                },
                {
                    'Id': 11, 'Name': 'Yang Wang', 'Designation': 'Project Manager',
                     'IsExpand': 'None',
                    'RatingColor': '#EBB92E', 'ReportingPerson': 'parent'
                },
                {
                    'Id': 12, 'Name': 'Lino Rodri', 'Designation': 'Project Manager',
                    'IsExpand': 'true',
                    'RatingColor': '#68C2DE', 'ReportingPerson': 11
                },
                {
                    'Id': 13, 'Name': 'Philip Cramer', 'Designation': 'Senior S/w Engg',
                    'IsExpand': 'true',
                    'RatingColor': '#68C2DE', 'ReportingPerson': 24
                },
                {
                    'Id': 14, 'Name': 'Pedro Afonso', 'Designation': 'Project Trainee',
                    'IsExpand': 'true',
                    'RatingColor': '#68C2DE', 'ReportingPerson': 15
                },
                {
                    'Id': 15, 'Name': 'Elizabeth Roel', 'Designation': 'S/w Engg',
                     'IsExpand': 'false',
                    'RatingColor': '#93B85A', 'ReportingPerson': 13
                },
                {
                    'Id': 16, 'Name': 'Janine Labrune', 'Designation': 'Project Lead',
                     'IsExpand': 'None',
                    'RatingColor': '#D46E89', 'ReportingPerson': 12
                },
                {
                    'Id': 17, 'Name': 'Ann Devon', 'Designation': 'Project Manager',
                     'IsExpand': 'false',
                    'RatingColor': '#68C2DE', 'ReportingPerson': 25
                },
                {
                    'Id': 18, 'Name': 'Roland Mendel', 'Designation': 'Project Lead',
                    'IsExpand': 'true',
                    'RatingColor': '#68C2DE', 'ReportingPerson': 17
                },
                {
                    'Id': 19, 'Name': 'Aria Cruz', 'Designation': 'Senior S/w Engg',
                     'IsExpand': 'false',
                    'RatingColor': '#93B85A', 'ReportingPerson': 18
                },
                {
                    'Id': 20, 'Name': 'Martine Rancé', 'Designation': 'S/w Engg',
                     'IsExpand': 'None',
                    'RatingColor': '#93B85A', 'ReportingPerson': 18
                },
                {
                    'Id': 21, 'Name': 'Maria Larsson', 'Designation': 'Project Trainee',
                     'IsExpand': 'false',
                    'RatingColor': '#EBB92E', 'ReportingPerson': 19
                },
                {
                    'Id': 22, 'Name': 'Diego Roel', 'Designation': 'Project Trainee',
                   'IsExpand': 'false',
                    'RatingColor': '#D46E89', 'ReportingPerson': 21
                },
                {
                    'Id': 23, 'Name': 'Peter Franken', 'Designation': 'Project Trainee',
                     'IsExpand': 'None',
                    'RatingColor': '#D46E89', 'ReportingPerson': 21
                },
                {
                    'Id': 24, 'Name': 'Howard Snyder', 'Designation': 'Project Lead',
                    'IsExpand': 'None',
                    'RatingColor': '#D46E89', 'ReportingPerson': 16
                },
                {
                    'Id': 25, 'Name': 'Carine Schmitt', 'Designation': 'Project Manager',
                    'IsExpand': 'None',
                    'RatingColor': '#EBB92E', 'ReportingPerson': 'parent'
                },
                {
                    'Id': 26, 'Name': 'Paolo Accorti', 'Designation': 'Project Lead',
                     'IsExpand': 'None',
                    'RatingColor': '#D46E89', 'ReportingPerson': 36
                },
            ];
            let items: DataManager = new DataManager(data as JSON[], new Query().take(7));

            diagram = new Diagram({
                snapSettings: { constraints: 0 },
                layout: {
                    type: 'OrganizationalChart', margin: { top: 100 },
                    getLayoutInfo: (node: Node, tree: TreeInfo) => {
                        if (!tree.hasSubTree) {
                            tree.orientation = 'Vertical';
                            tree.type = 'Alternate';
                        }
                    }
                },
                dataSourceSettings: {
                    id: 'Id', parentId: 'ReportingPerson', dataSource: items
                },

                getNodeDefaults: (obj: NodeModel, diagram: Diagram) => {
                    obj.height = 50;
                    obj.backgroundColor = 'lightgrey';
                    obj.style = { fill: 'transparent', strokeWidth: 2 };
                    return obj;
                }, getConnectorDefaults: (connector: ConnectorModel, diagram: Diagram) => {
                    connector.targetDecorator.shape = 'None';
                    connector.type = 'Orthogonal';
                    return connector;
                },

                setNodeTemplate: (obj: Node, diagram: Diagram): Container => {
                    let content: StackPanel = new StackPanel();
                    content.id = (obj as NodeModel).id + '_outerstack';
                    content.style.strokeColor = 'darkgreen';
                    content.orientation = 'Horizontal';
                    content.padding = { left: 5, right: 10, top: 5, bottom: 5 };
                    let innerStack: StackPanel = new StackPanel();
                    innerStack.style.strokeColor = 'none';
                    innerStack.margin = { left: 5, right: 0, top: 0, bottom: 0 };
                    innerStack.id = (obj as NodeModel).id + '_innerstack';

                    let text: TextElement = new TextElement();
                    text.content = (obj as NodeModel).data['Name'];

                    text.style.color = 'blue';
                    text.style.strokeColor = 'none';
                    text.style.fill = 'none';
                    text.id = (obj as NodeModel).id + '_text1';

                    let desigText: TextElement = new TextElement();
                    desigText.margin = { left: 0, right: 0, top: 5, bottom: 0 };
                    desigText.content = (obj as NodeModel).data['Designation'];
                    desigText.style.color = 'blue';
                    desigText.style.strokeColor = 'none';
                    desigText.style.fill = 'none';
                    desigText.style.textWrapping = 'Wrap';
                    desigText.id = (obj as NodeModel).id + '_desig';
                    innerStack.children = [text, desigText];

                    content.children = [ innerStack];

                    return content;
                }
            });

            diagram.appendTo('#diagram');

            let options: OverviewModel = {};
            options.height = '500';
            options.width = '250';
            options.sourceID = 'diagram';
            overview = new Overview(options);
            overview.appendTo('#over');

        });

        afterAll((): void => {
            overview.destroy();
            diagram.destroy();
            ele.remove();
            ove.remove();
        });
        it('Zoom-out diagram and doing interactions in diagram', (done: Function) => {
            let zoomout: ZoomOptions = { type: "ZoomOut", zoomFactor: 0.2 };
            diagram.zoomTo(zoomout);
            let preZoom = diagram.scroller.currentZoom; 
            diagram.select([diagram.nodes[0]]);
            diagram.drag(diagram.nodes[0], 100, 100);
            var mouseEvents:MouseEvents = new MouseEvents();
            let overviewelement:HTMLElement = document.getElementById(overview.element.id);
            let target:HTMLElement = document.getElementById('overview_canvasbottom');
            let mouseDown:string = 'mouseDown';
            let mouseup:string = 'mouseUp';
            let mouseMove:string = 'mouseMove';
            overview[mouseDown]({ target: target, type: mouseDown });
            mouseEvents.mouseDownEvent(overviewelement, 1186, 160);
            mouseEvents.mouseMoveEvent(overviewelement, 1056, 170);
            overview[mouseup]({ target: target, type: mouseDown });
            let curZoom = diagram.scroller.currentZoom;
            expect(preZoom !==curZoom).toBe(true);
            done();
        });
    });

    describe('HTML node get disappered after save and load the diagram', () => {
        let diagram: Diagram;
        let overview: Overview;
        let ele: HTMLElement;
        let ove: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram', styles: "width:74%;height: 500px; float:left" });
            document.body.appendChild(ele);
            ove = createElement('div', { id: 'overview', styles: "width:25%;height:200px;float:left; border-color:lightgray;border-style:solid;" });
            document.body.appendChild(ove);

            let nodes: NodeModel[] = [
                {
                    id: 'NewIdea',
                    height: 60,
                    width: 100,
                    style: { fill: 'blue' },
                    offsetX: 500,
                    offsetY: 80,
                    shape: {
                        type: 'HTML',
                        content:
                            '<div style="background:#6BA5D7;height:100%;width:100%;"><button type="button" style="width:100px"> Button</button></div>',
                    },
                },
                {
                    id: 'Meeting',
                    height: 60,
                    width: 100,
                    style: { fill: 'blue' },
                    offsetX: 500,
                    offsetY: 160,
                    shape: {
                        type: 'HTML',
                        content:
                            '<div style="background:#6BA5D7;height:100%;width:100%;"><button type="button" style="width:100px"> Button</button></div>',
                    },
                },
            ];
            diagram = new Diagram({
                width: '100%',
                height: '700px',
                nodes: nodes,
            });
            diagram.appendTo('#diagram');

            let overview: Overview = new Overview({
                width: '100%',
                height: '150ppx',
                sourceID: 'diagram',
            });
            overview.appendTo('#overview');


        });

        afterAll((): void => {
            overview.destroy();
            diagram.destroy();
            ele.remove();
            ove.remove();
        });
        it('Zoom-out diagram and doing interactions in diagram', (done: Function) => {
            let savedata: string = diagram.saveDiagram();
            diagram.loadDiagram(savedata);
            let element = document.getElementById("overview_htmlLayer");
            expect(element.childNodes[0].childNodes.length === 2).toBe(true);
            done();
        });
    });

    describe('830544-Support to add event to notify before rendering of diagram', () => {
        let diagram: Diagram;
        let overview: Overview;
        let ele: HTMLElement;
        let ove: HTMLElement;
        let createEvent:boolean;
        let createdEvent:boolean;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram', styles: "width:74%;height: 500px; float:left" });
            document.body.appendChild(ele);
            ove = createElement('div', { id: 'overview', styles: "width:25%;height:200px;float:left; border-color:lightgray;border-style:solid;" });
            document.body.appendChild(ove);

            let nodes: NodeModel[] = [
                {
                    id: 'NewIdea',
                    height: 60,
                    width: 100,
                    style: { fill: 'blue' },
                    offsetX: 500,
                    offsetY: 80,
                    shape: {
                        type: 'HTML',
                        content:
                            '<div style="background:#6BA5D7;height:100%;width:100%;"><button type="button" style="width:100px"> Button</button></div>',
                    },
                },
                {
                    id: 'Meeting',
                    height: 60,
                    width: 100,
                    style: { fill: 'blue' },
                    offsetX: 500,
                    offsetY: 160,
                    shape: {
                        type: 'HTML',
                        content:
                            '<div style="background:#6BA5D7;height:100%;width:100%;"><button type="button" style="width:100px"> Button</button></div>',
                    },
                },
            ];
            diagram = new Diagram({
                width: '100%',
                height: '700px',
                nodes: nodes,
                load:load,
                created:created
            });
            diagram.appendTo('#diagram');

            let overview: Overview = new Overview({
                width: '100%',
                height: '150ppx',
                sourceID: 'diagram',
            });
            overview.appendTo('#overview');


        });

        afterAll((): void => {
            overview.destroy();
            diagram.destroy();
            ele.remove();
            ove.remove();
        });
        it('check whether the load event triggers properly', (done: Function) => {
            expect(createEvent==true).toBe(true);
            expect(createdEvent==true).toBe(true);
            done();
        });
        function load(args: ILoadEventArgs){
            createSpinner({
                // Specify the target for the spinner to show  
                target: document.getElementById('diagram')
            });
            showSpinner(document.getElementById('diagram'));
            createEvent=true
        }
        function created(arg:object){
            hideSpinner(document.getElementById('diagram'));
            createdEvent=true
        }
    });

});