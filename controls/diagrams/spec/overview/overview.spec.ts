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
            expect(htmlOverView.style.transform === "scale(0.0821449) translate(641px, 580px)").toBe(true);
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
            expect(overview.contentHeight >= 5000).toBe(true);

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

        let newdiagram: Diagram;
        let newoverview: Overview;
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


            newdiagram = new Diagram({
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
            newdiagram.appendTo('#diagram');
            newdiagram.fitToPage()
            let options: OverviewModel = {};
            options.height = '250px';
            options.width = '70%';
            options.sourceID = 'diagram';
            newoverview = new Overview(options);
            newoverview.appendTo('#overview');

        });

        afterAll((): void => {
            newoverview.destroy();
            newdiagram.destroy();
            Diagramelement.remove();
            overViewElement.remove();
            parentelement1.remove();
            parentelement.remove();
        });

        it('Zoom-out diagram and doing interactions in diagram', (done: Function) => {
            let zoomout: ZoomOptions = { type: "ZoomOut", zoomFactor: 0.2 };
            newdiagram.zoomTo(zoomout);
            let preZoom = newdiagram.scroller.currentZoom; 
            newdiagram.select([newdiagram.nodes[0]]);
            newdiagram.drag(newdiagram.nodes[0], 100, 100);
            var mouseEvents:MouseEvents = new MouseEvents();
            let overviewelement:HTMLElement = document.getElementById(newoverview.element.id);
            let target:HTMLElement = document.getElementById('overview_canvasbottom');
            let mouseDown:string = 'mouseDown';
            let mouseup:string = 'mouseUp';
            let mouseMove:string = 'mouseMove';
            newoverview[mouseDown]({ target: target, type: mouseDown });
            mouseEvents.mouseDownEvent(overviewelement, 1186, 160);
            mouseEvents.mouseMoveEvent(overviewelement, 1056, 170);
            newoverview[mouseup]({ target: target, type: mouseDown });
            let curZoom = newdiagram.scroller.currentZoom;
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

    describe('849892-Overview not updated properly when we load the diagram', () => {
        let diagram: Diagram;
        let overview: Overview;
        let ele: HTMLElement;
        let ove: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramLoad', styles: "width:74%;height: 500px; float:left" });
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
            diagram.appendTo('#diagramLoad');

            let overview: Overview = new Overview({
                width: '100%',
                height: '150ppx',
                sourceID: 'diagramLoad',
            });
            overview.appendTo('#overview');


        });

        afterAll((): void => {
            overview.destroy();
            diagram.destroy();
            ele.remove();
            ove.remove();
        });
        it('Load customer JSON and check if the overview is updated properly', (done: Function) => {
            let savedata: any = {"enableRtl":false,"locale":"en-US","animationComplete":{"closed":false,"currentObservers":null,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"click":{"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"collectionChange":{"closed":false,"currentObservers":null,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"commandExecute":{"closed":false,"currentObservers":null,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"connectionChange":{"closed":false,"currentObservers":null,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"contextMenuBeforeItemRender":{"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"contextMenuClick":{"closed":false,"currentObservers":null,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"contextMenuOpen":{"closed":false,"currentObservers":null,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"created":{"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"dataLoaded":{"closed":false,"currentObservers":null,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"doubleClick":{"closed":false,"currentObservers":null,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"dragEnter":{"closed":false,"currentObservers":null,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"dragLeave":{"closed":false,"currentObservers":null,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"dragOver":{"closed":false,"currentObservers":null,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"drop":{"closed":false,"currentObservers":null,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"expandStateChange":{"closed":false,"currentObservers":null,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"fixedUserHandleClick":{"closed":false,"currentObservers":null,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"historyChange":{"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"historyStateChange":{"closed":false,"currentObservers":null,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"keyDown":{"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"keyUp":{"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"load":{"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"mouseEnter":{"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"mouseLeave":{"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"mouseOver":{"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"mouseWheel":{"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"onImageLoad":{"closed":false,"currentObservers":null,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"onUserHandleMouseDown":{"closed":false,"currentObservers":null,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"onUserHandleMouseEnter":{"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"onUserHandleMouseLeave":{"closed":false,"currentObservers":null,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"onUserHandleMouseUp":{"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"positionChange":{"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"propertyChange":{"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"rotateChange":{"closed":false,"currentObservers":null,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"scrollChange":{"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"segmentChange":{"closed":false,"currentObservers":null,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"segmentCollectionChange":{"closed":false,"currentObservers":null,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"selectionChange":{"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"sizeChange":{"closed":false,"currentObservers":null,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"sourcePointChange":{"closed":false,"currentObservers":null,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"targetPointChange":{"closed":false,"currentObservers":null,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"textEdit":{"closed":false,"currentObservers":null,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"elementDraw":{"closed":false,"currentObservers":null,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"width":"100%","height":"100%","getConnectorDefaults":{},"getNodeDefaults":{},"rulerSettings":{"showRulers":true,"horizontalRuler":{"orientation":"Horizontal","thickness":25,"segmentWidth":100,"interval":5,"tickAlignment":"RightOrBottom","arrangeTick":null,"markerColor":"red"},"verticalRuler":{"orientation":"Vertical","thickness":25,"segmentWidth":100,"interval":5,"tickAlignment":"RightOrBottom","arrangeTick":null,"markerColor":"red"},"dynamicGrid":true},"pageSettings":{"background":{"color":"rgba(255,255,255,1)","source":""},"width":1500,"multiplePage":false,"height":600,"margin":{"left":5,"top":5},"orientation":"Landscape","showPageBreaks":false,"fitOptions":{"canFit":false},"boundaryConstraints":"Infinity"},"scrollSettings":{"scrollLimit":"Infinity","canAutoScroll":true,"autoScrollBorder":{"left":15,"right":15,"top":15,"bottom":15},"minZoom":0.25,"maxZoom":30,"currentZoom":0.4276620370370373,"viewPortWidth":1440,"viewPortHeight":854,"horizontalOffset":-19.93,"verticalOffset":-250.67,"padding":{"left":0,"right":0,"top":0,"bottom":0},"zoomFactor":0.2},"snapSettings":{"horizontalGridlines":{"lineColor":"#e0e0e0","lineIntervals":[1,9,0.25,9.75,0.25,9.75,0.25,9.75,0.25,9.75,0.25,9.75,0.25,9.75,0.25,9.75,0.25,9.75,0.25,9.75],"lineDashArray":""},"verticalGridlines":{"lineColor":"#e0e0e0","lineIntervals":[1,9,0.25,9.75,0.25,9.75,0.25,9.75,0.25,9.75,0.25,9.75,0.25,9.75,0.25,9.75,0.25,9.75,0.25,9.75],"lineDashArray":""},"constraints":31,"gridType":"Lines","snapObjectDistance":5,"snapLineColor":"#07EDE1"},"contextMenuSettings":{"show":true,"items":[{"text":"Copy","id":"Copy","target":".e-diagramcontent","iconCss":"sf-icon-copy"},{"text":"Cut","id":"Cut","target":".e-diagramcontent","iconCss":"sf-icon-cut"},{"text":"Paste","id":"Paste","target":".e-diagramcontent","iconCss":"sf-icon-paste"},{"text":"Delete","id":"Delete","target":".e-diagramcontent","iconCss":"sf-icon-delete"},{"text":"Select All","id":"SelectAll","target":".e-diagramcontent","iconCss":"e-menu-icon"},{"text":"Association","id":"Association","iconCss":"e-bpmn-icons"},{"text":"Sequence","id":"Sequence","iconCss":"e-bpmn-icons"},{"text":"Message Flow","id":"MessageFlow","iconCss":"e-bpmn-icons"},{"text":"Condition type","id":"Condition type","items":[{"text":"Default","id":"None","iconCss":"e-bpmn-icons"},{"text":"Conditional","id":"Conditional Flow","iconCss":"e-bpmn-icons"},{"text":"Normal","id":"Normal Flow","iconCss":"e-bpmn-icons"}]},{"text":"Direction","id":"Direction","items":[{"text":"Default","id":"None","iconCss":"e-bpmn-icons"},{"text":"Directional","id":"Directional","iconCss":"e-bpmn-icons"},{"text":"Bi-Directional","id":"BiDirectional","iconCss":"e-bpmn-icons"}]},{"text":"Ad-Hoc","id":"Adhoc","iconCss":"e-adhocs e-bpmn-icons e-adhoc"},{"text":"Loop","id":"Loop","items":[{"text":"None","iconCss":"e-loop e-bpmn-icons e-None","id":"LoopNone"},{"text":"Standard","iconCss":"e-loop e-bpmn-icons e-Loop","id":"Standard"},{"text":"Parallel Multi-Instance","iconCss":"e-loop e-bpmn-icons e-ParallelMI","id":"ParallelMultiInstance"},{"text":"Sequence Multi-Instance","iconCss":"e-loop e-bpmn-icons e-SequentialMI","id":"SequenceMultiInstance"}]},{"text":"Compensation","id":"taskCompensation","iconCss":"e-compensation e-bpmn-icons e-Compensation"},{"text":"Activity-Type","id":"Activity-Type","items":[{"iconCss":"e-bpmn-icons e-Task","text":"Task","id":"Task"},{"text":"Collapsed sub-process","iconCss":"e-bpmn-icons e-SubProcess","id":"SubProcess"}]},{"text":"Boundary","id":"Boundary","items":[{"text":"Default","iconCss":"e-boundry e-bpmn-icons e-Default","id":"Default"},{"text":"Call","iconCss":"e-boundry e-bpmn-icons e-Call","id":"BoundryCall"},{"text":"Event","iconCss":"e-boundry e-bpmn-icons e-Event","id":"BoundryEvent"}]},{"text":"Data Object","id":"DataObject","items":[{"text":"None","iconCss":"e-data e-bpmn-icons e-None","id":"DataObjectNone"},{"text":"Input","iconCss":"e-data e-bpmn-icons e-DataInput","id":"Input"},{"text":"Output","iconCss":"e-data e-bpmn-icons e-DataOutput","id":"Output"}]},{"text":"Collection","id":"collection","iconCss":"e-collection e-bpmn-icons e-ParallelMI"},{"text":"Task Call","id":"DeftCall","iconCss":"e-call e-bpmn-icons e-CallActivity"},{"text":"Trigger Result","id":"TriggerResult","items":[{"text":"None","id":"TriggerNone","iconCss":"e-trigger e-bpmn-icons e-None"},{"text":"Message","id":"Message","iconCss":"e-trigger e-bpmn-icons e-InMessage"},{"text":"Multiple","id":"Multiple","iconCss":"e-trigger e-bpmn-icons e-InMultiple"},{"text":"Parallel","id":"Parallel","iconCss":"e-trigger e-bpmn-icons e-InParallelMultiple"},{"text":"Signal","id":"Signal","iconCss":"e-trigger e-bpmn-icons e-InSignal"},{"text":"Timer","id":"Timer","iconCss":"e-trigger e-bpmn-icons e-InTimer"},{"text":"Cancel","id":"Cancel","iconCss":"e-trigger e-bpmn-icons e-CancelEnd"},{"text":"Escalation","id":"Escalation","iconCss":"e-trigger e-bpmn-icons e-InEscalation"},{"text":"Error","id":"Error","iconCss":"e-trigger e-bpmn-icons e-InError"},{"text":"Compensation","id":"triggerCompensation","iconCss":"e-trigger e-bpmn-icons e-InCompensation"},{"text":"Terminate","id":"Terminate","iconCss":"e-trigger e-bpmn-icons e-TerminateEnd"},{"text":"Conditional","id":"Conditional","iconCss":"e-trigger e-bpmn-icons e-InConditional"},{"text":"Link","id":"Link","iconCss":"e-trigger e-bpmn-icons e-ThrowLinkin"}]},{"text":"Event Type","id":"EventType","items":[{"text":"Start","id":"Start","iconCss":"e-event e-bpmn-icons e-NoneStart"},{"text":"Intermediate","id":"Intermediate","iconCss":"e-event e-bpmn-icons e-InterruptingNone"},{"text":"Non-Interrupting Start","id":"NonInterruptingStart","iconCss":"e-event e-bpmn-icons e-Noninterruptingstart"},{"text":"Throwing Intermediate","id":"ThrowingIntermediate","iconCss":"e-event e-bpmn-icons e-InterruptingNone"},{"text":"Non-Interrupting Intermediate","id":"NonInterruptingIntermediate","iconCss":"e-event e-bpmn-icons e-NoninterruptingIntermediate"},{"text":"End","id":"End","iconCss":"e-event e-bpmn-icons e-NoneEnd"}]},{"text":"Task Type","id":"TaskType","items":[{"text":"None","id":"TaskNone","iconCss":"e-task e-bpmn-icons e-None"},{"text":"Service","id":"Service","iconCss":"e-task e-bpmn-icons e-ServiceTask"},{"text":"Business Rule","id":"BusinessRule","iconCss":"e-task e-bpmn-icons e-BusinessRule"},{"text":"Instantiating Receive","id":"InstantiatingReceive","iconCss":"e-task e-bpmn-icons e-InstantiatingReceive"},{"text":"Manual","id":"Manual","iconCss":"e-task e-bpmn-icons e-ManualCall"},{"text":"Receive","id":"Receive","iconCss":"e-task e-bpmn-icons e-InMessage"},{"text":"Script","id":"Script","iconCss":"e-task e-bpmn-icons e-ScriptCall"},{"text":"Send","id":"Send","iconCss":"e-task e-bpmn-icons e-InMessage"},{"text":"User","id":"User","iconCss":"e-task e-bpmn-icons e-UserCall"}]},{"text":"GateWay","id":"GateWay","iconCss":"e-bpmn-icons e-Gateway","items":[{"text":"None","id":"GatewayNone","iconCss":"e-gate e-bpmn-icons e-None sf-icon-check-tick"},{"text":"Exclusive","iconCss":"e-gate e-bpmn-icons e-ExclusiveGatewayWithMarker","id":"Exclusive"},{"text":"Inclusive","iconCss":"e-gate e-bpmn-icons e-InclusiveGateway","id":"Inclusive"},{"text":"Parallel","iconCss":"e-gate e-bpmn-icons e-ParallelGateway","id":"GatewayParallel"},{"text":"Complex","iconCss":"e-gate e-bpmn-icons e-ComplexGateway","id":"Complex"},{"text":"Event Based","iconCss":"e-gate e-bpmn-icons e-EventBasedGateway","id":"EventBased"},{"text":"Exclusive Event Based","iconCss":"e-gate e-bpmn-icons e-ExclusiveEventBased","id":"ExclusiveEventBased"},{"text":"Parallel Event Based","iconCss":"e-gate e-bpmn-icons e-ParallelEventBasedGatewaytostart","id":"ParallelEventBased"}]},{"text":"Message Type","id":"MessageType","items":[{"text":"Default","id":"None","iconCss":"e-bpmn-icons"},{"text":"Initiating Message","id":"InitiatingMessage","iconCss":"e-bpmn-icons"},{"text":"Non-Initiating Message","id":"NonInitiatingMessage","iconCss":"e-bpmn-icons"}]},{"text":"Add Text Annotation","id":"TextAnnotation","iconCss":"e-bpmn-icons e-TextAnnotation"}],"showCustomMenuOnly":true},"commandManager":{"commands":[{"name":"New","canExecute":{},"execute":{},"gesture":{"key":78,"keyModifiers":4},"parameter":""},{"name":"Save","canExecute":{},"execute":{},"gesture":{"key":83,"keyModifiers":1},"parameter":""},{"name":"Open","canExecute":{},"execute":{},"gesture":{"key":79,"keyModifiers":1},"parameter":""},{"name":"Rotate Right 90","canExecute":{},"execute":{},"gesture":{"key":82,"keyModifiers":1},"parameter":""},{"name":"Rotate Left 90","canExecute":{},"execute":{},"gesture":{"key":76,"keyModifiers":1},"parameter":""},{"name":"Flip Horizontal","canExecute":{},"execute":{},"gesture":{"key":72,"keyModifiers":1},"parameter":""},{"name":"Flip Vertical","canExecute":{},"execute":{},"gesture":{"key":74,"keyModifiers":1},"parameter":""}]},"selectedItems":{"nodes":[],"connectors":[],"constraints":12286,"selectedObjects":[],"userHandles":[{"name":"Clone","pathData":"M0,2.4879999 L0.986,2.4879999 0.986,9.0139999 6.9950027,9.0139999 6.9950027,10 0.986,10 C0.70400238,10 0.47000122,9.9060001 0.28100207,9.7180004 0.09400177,9.5300007 0,9.2959995 0,9.0139999 z M3.0050011,0 L9.0140038,0 C9.2960014,0 9.5300026,0.093999863 9.7190018,0.28199956 9.906002,0.47000027 10,0.70399952 10,0.986 L10,6.9949989 C10,7.2770004 9.906002,7.5160007 9.7190018,7.7110004 9.5300026,7.9069996 9.2960014,8.0049992 9.0140038,8.0049992 L3.0050011,8.0049992 C2.7070007,8.0049992 2.4650002,7.9069996 2.2770004,7.7110004 2.0890007,7.5160007 1.9950027,7.2770004 1.9950027,6.9949989 L1.9950027,0.986 C1.9950027,0.70399952 2.0890007,0.47000027 2.2770004,0.28199956 2.4650002,0.093999863 2.7070007,0 3.0050011,0 z","visible":true,"offset":1,"side":"Bottom","margin":{"top":0,"bottom":0,"left":0,"right":0},"disableConnectors":false,"disableNodes":false,"size":25,"horizontalAlignment":"Center","verticalAlignment":"Center","backgroundColor":"#000000","borderColor":"","borderWidth":0.5,"pathColor":"white"},{"name":"Delete","pathData":"M0.54700077,2.2130003 L7.2129992,2.2130003 7.2129992,8.8800011 C7.2129992,9.1920013 7.1049975,9.4570007 6.8879985,9.6739998 6.6709994,9.8910007 6.406,10 6.0939997,10 L1.6659999,10 C1.3539997,10 1.0890004,9.8910007 0.87200136,9.6739998 0.65500242,9.4570007 0.54700071,9.1920013 0.54700077,8.8800011 z M2.4999992,0 L5.2600006,0 5.8329986,0.54600048 7.7599996,0.54600048 7.7599996,1.6660004 0,1.6660004 0,0.54600048 1.9270014,0.54600048 z","visible":true,"offset":0,"side":"Bottom","margin":{"top":0,"bottom":0,"left":0,"right":0},"disableConnectors":false,"disableNodes":false,"size":25,"horizontalAlignment":"Center","verticalAlignment":"Center","backgroundColor":"#000000","borderColor":"","borderWidth":0.5,"pathColor":"white"},{"name":"Draw","pathData":"M3.9730001,0 L8.9730001,5.0000007 3.9730001,10.000001 3.9730001,7.0090005 0,7.0090005 0,2.9910006 3.9730001,2.9910006 z","visible":true,"offset":0.5,"side":"Right","margin":{"top":0,"bottom":0,"left":0,"right":0},"disableConnectors":false,"disableNodes":false,"size":25,"horizontalAlignment":"Center","verticalAlignment":"Center","backgroundColor":"#000000","borderColor":"","borderWidth":0.5,"pathColor":"white"}],"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"width":0,"height":0,"offsetX":0,"offsetY":0,"handleSize":14,"rubberBandSelectionMode":"CompleteIntersect","wrapper":null},"enablePersistence":false,"backgroundColor":"transparent","constraints":500,"layout":{"type":"None","enableAnimation":true,"connectionPointOrigin":"SamePoint","arrangement":"Nonlinear","enableRouting":false},"dataSourceSettings":{"dataManager":null,"dataSource":null,"crudAction":{"read":""},"connectionDataSource":{"crudAction":{"read":""}}},"mode":"SVG","layers":[{"objects":["Start_Eventp3v58","Taskn4NDV","Gatewayo4Msl","TaskP0QPy","TaskeW8VJ","Data_ObjectGtkuS","Data_ObjectqGT5F","Data_Objectb7Wo2","Data_ObjectqIZuM","Tasku4sokLHKk2HrSrL","Data_ObjectcZ5fTGKCXTa652oiybxn","End_EventS9ib1QEEfC","Data_ObjectZDkTR","Intermediate_EventFkC0k","Gatewayi1iQr","Data_ObjectcZ5fTKOX8B","TaskqKla4","Data_ObjectcZ5fT","TaskqKla4TfIVX","TaskqKla4TfIVXw1p5k","Data_ObjectcZ5fTKk3hQ","Tasku4sokLHKk2HrSrLSvLov","connectorss71m","connectory739V","connectorf9nfT","connectorQJUgB","connectornBcq8","connectorfuEWe","connectorm3QrF","connectorunMD0","connectorNgT5p","connectorH70v1","connectorDJWT5","connectoraasqK","connectorK0AHO","connectorHxn1I","connectorZNFg8","connectorJdaD6","connectorxyoW9","connectorlBFvm","connectorm58Hf","connectorkpMtb","connectorhsOpM","connectorkB4mc","connectorReDDb","connectoriTJsS","connectoryEKZw"],"id":"default_layer","visible":true,"lock":false,"zIndex":0,"objectZIndex":82}],"nodes":[{"shape":{"type":"Bpmn","shape":"Event","event":{"event":"Start","trigger":"None"},"annotations":[],"activity":{"subProcess":{},"activity":"Task"}},"ports":[{"inEdges":[],"outEdges":[],"id":"left","shape":"Circle","offset":{"x":0,"y":0.5},"height":12,"width":12,"margin":{"left":0,"top":0,"right":0,"bottom":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8,"constraints":24},{"inEdges":[],"outEdges":[],"id":"bottom","shape":"Circle","offset":{"x":0.5,"y":1},"height":12,"width":12,"margin":{"left":0,"top":0,"right":0,"bottom":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8,"constraints":24},{"inEdges":[],"outEdges":[],"id":"right","shape":"Circle","offset":{"x":1,"y":0.5},"height":12,"width":12,"margin":{"left":0,"top":0,"right":0,"bottom":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8,"constraints":24},{"inEdges":[],"outEdges":[],"id":"top","shape":"Circle","offset":{"x":0.5,"y":0},"height":12,"width":12,"margin":{"left":0,"top":0,"right":0,"bottom":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8,"constraints":24}],"id":"Start_Eventp3v58","width":50,"height":50,"constraints":5242862,"container":null,"offsetX":125,"offsetY":501,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{},"flip":"None","wrapper":{"actualSize":{"width":50,"height":50},"offsetX":125,"offsetY":501},"style":{"fill":"white","strokeColor":"#000000","strokeWidth":2,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"tooltip":{"content":"Start Event","showTipPointer":true,"width":"auto","height":"auto","relativeMode":"Object","openOn":"Auto"},"symbolInfo":{"height":40,"width":40},"previewSize":{},"dragSize":{},"zIndex":0,"annotations":[{"id":"FTVvJ","content":"Request for Liquefaction Impact Assessment to Cable Burial Received","annotationType":"String","style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","bold":false,"textWrapping":"WrapWithOverflow","color":"black","whiteSpace":"CollapseSpace","fontFamily":"Arial","fontSize":12,"italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textOverflow":"Wrap","textDecoration":"None"},"hyperlink":{"link":"","hyperlinkOpenState":"NewTab","content":"","textDecoration":"None"},"constraints":4,"visibility":true,"rotateAngle":0,"margin":{"left":0,"top":0,"right":0,"bottom":0},"horizontalAlignment":"Center","verticalAlignment":"Top","offset":{"x":0,"y":1}}],"flipMode":"All","isExpanded":true,"expandIcon":{"shape":"None"},"fixedUserHandles":[],"inEdges":[],"outEdges":["connectorss71m"],"parentId":"","processId":"","umlIndex":-1,"isPhase":false,"isLane":false},{"shape":{"type":"Bpmn","shape":"Activity","activity":{"activity":"Task","subProcess":{"type":"None","collapsed":true},"task":{"call":false,"compensation":false,"loop":"None","type":"BusinessRule"}},"annotations":[]},"ports":[{"inEdges":[],"outEdges":[],"id":"left","shape":"Circle","offset":{"x":0,"y":0.5},"height":12,"width":12,"margin":{"left":0,"top":0,"right":0,"bottom":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8,"constraints":24},{"inEdges":[],"outEdges":[],"id":"bottom","shape":"Circle","offset":{"x":0.5,"y":1},"height":12,"width":12,"margin":{"left":0,"top":0,"right":0,"bottom":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8,"constraints":24},{"inEdges":[],"outEdges":[],"id":"right","shape":"Circle","offset":{"x":1,"y":0.5},"height":12,"width":12,"margin":{"left":0,"top":0,"right":0,"bottom":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8,"constraints":24},{"inEdges":[],"outEdges":[],"id":"top","shape":"Circle","offset":{"x":0.5,"y":0},"height":12,"width":12,"margin":{"left":0,"top":0,"right":0,"bottom":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8,"constraints":24}],"id":"Taskn4NDV","width":140,"height":100,"container":null,"offsetX":350,"offsetY":501,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{},"flip":"None","wrapper":{"actualSize":{"width":140,"height":100},"offsetX":350,"offsetY":501},"style":{"fill":"white","strokeColor":"#000000","strokeWidth":2,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"constraints":5242862,"tooltip":{"content":"Task","showTipPointer":true,"width":"auto","height":"auto","relativeMode":"Object","openOn":"Auto"},"symbolInfo":{"height":50,"width":70},"previewSize":{},"dragSize":{},"addInfo":{"tooltip":"Process","type":"Process","status":"new","unconnected_name":"Evaluate if Soil Conditions are subject to liquefaction","ctx_id":null,"eicore_id":null,"guid":"5648144a-aa56-4c1e-aa17-90905347399e","userhandle_conceptual_isvalid":false,"userhandle_logical_isvalid":false},"fixedUserHandles":[{"pathData":"M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z","visibility":false,"iconStrokeColor":"green","margin":{"right":-5,"top":-15,"left":0,"bottom":0},"width":16,"height":16,"id":"FDcxD","handleStrokeColor":"transparent","fill":"transparent","handleStrokeWidth":1,"cornerRadius":0,"offset":{"x":0,"y":0},"padding":{"left":0,"right":0,"top":0,"bottom":0},"iconStrokeWidth":0},{"pathData":"M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z","visibility":false,"iconStrokeColor":"green","margin":{"right":-25,"top":-15,"left":0,"bottom":0},"width":16,"height":16,"id":"heueG","handleStrokeColor":"transparent","fill":"transparent","handleStrokeWidth":1,"cornerRadius":0,"offset":{"x":0,"y":0},"padding":{"left":0,"right":0,"top":0,"bottom":0},"iconStrokeWidth":0}],"zIndex":1,"annotations":[{"id":"h3TGo","content":"Evaluate if Soil Conditions are subject to liquefaction","annotationType":"String","style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","bold":false,"textWrapping":"WrapWithOverflow","color":"black","whiteSpace":"CollapseSpace","fontFamily":"Arial","fontSize":12,"italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textOverflow":"Wrap","textDecoration":"None"},"hyperlink":{"link":"","hyperlinkOpenState":"NewTab","content":"","textDecoration":"None"},"constraints":4,"visibility":true,"rotateAngle":0,"margin":{"left":0,"top":0,"right":0,"bottom":0},"horizontalAlignment":"Center","verticalAlignment":"Center","offset":{"x":0.5,"y":0.5}}],"flipMode":"All","isExpanded":true,"expandIcon":{"shape":"None"},"inEdges":["connectorss71m","connectorH70v1"],"outEdges":["connectory739V"],"parentId":"","processId":"","umlIndex":-1,"isPhase":false,"isLane":false},{"shape":{"type":"Bpmn","shape":"Gateway","gateway":{"type":"Exclusive"},"annotations":[],"activity":{"subProcess":{"collapsed":true}}},"ports":[{"inEdges":[],"outEdges":[],"id":"left","shape":"Circle","offset":{"x":0,"y":0.5},"height":12,"width":12,"margin":{"left":0,"top":0,"right":0,"bottom":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8,"constraints":24},{"inEdges":[],"outEdges":[],"id":"bottom","shape":"Circle","offset":{"x":0.5,"y":1},"height":12,"width":12,"margin":{"left":0,"top":0,"right":0,"bottom":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8,"constraints":24},{"inEdges":[],"outEdges":[],"id":"right","shape":"Circle","offset":{"x":1,"y":0.5},"height":12,"width":12,"margin":{"left":0,"top":0,"right":0,"bottom":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8,"constraints":24},{"inEdges":[],"outEdges":[],"id":"top","shape":"Circle","offset":{"x":0.5,"y":0},"height":12,"width":12,"margin":{"left":0,"top":0,"right":0,"bottom":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8,"constraints":24}],"id":"Gatewayo4Msl","width":60,"height":60,"container":null,"offsetX":630,"offsetY":501,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{},"flip":"None","wrapper":{"actualSize":{"width":60,"height":60},"offsetX":630,"offsetY":501},"style":{"fill":"white","strokeColor":"#000000","strokeWidth":2,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"constraints":5242862,"tooltip":{"content":"Gateway","showTipPointer":true,"width":"auto","height":"auto","relativeMode":"Object","openOn":"Auto"},"symbolInfo":{"height":50,"width":50},"previewSize":{},"dragSize":{},"zIndex":3,"annotations":[{"id":"chTnX","content":"Are Soil Conditions Liquefable?","annotationType":"String","style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","bold":false,"textWrapping":"WrapWithOverflow","color":"black","whiteSpace":"CollapseSpace","fontFamily":"Arial","fontSize":12,"italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textOverflow":"Wrap","textDecoration":"None"},"hyperlink":{"link":"","hyperlinkOpenState":"NewTab","content":"","textDecoration":"None"},"constraints":4,"visibility":true,"rotateAngle":0,"margin":{"left":0,"top":0,"right":0,"bottom":0},"horizontalAlignment":"Center","verticalAlignment":"Top","offset":{"x":0,"y":1}}],"flipMode":"All","isExpanded":true,"expandIcon":{"shape":"None"},"fixedUserHandles":[],"inEdges":["connectory739V"],"outEdges":["connectorf9nfT","connectorQJUgB"],"parentId":"","processId":"","umlIndex":-1,"isPhase":false,"isLane":false},{"shape":{"type":"Bpmn","shape":"Activity","activity":{"activity":"Task","subProcess":{"type":"None","collapsed":true},"task":{"call":false,"compensation":false,"loop":"None","type":"Send"}},"annotations":[]},"ports":[{"inEdges":[],"outEdges":[],"id":"left","shape":"Circle","offset":{"x":0,"y":0.5},"height":12,"width":12,"margin":{"left":0,"top":0,"right":0,"bottom":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8,"constraints":24},{"inEdges":[],"outEdges":[],"id":"bottom","shape":"Circle","offset":{"x":0.5,"y":1},"height":12,"width":12,"margin":{"left":0,"top":0,"right":0,"bottom":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8,"constraints":24},{"inEdges":[],"outEdges":[],"id":"right","shape":"Circle","offset":{"x":1,"y":0.5},"height":12,"width":12,"margin":{"left":0,"top":0,"right":0,"bottom":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8,"constraints":24},{"inEdges":[],"outEdges":[],"id":"top","shape":"Circle","offset":{"x":0.5,"y":0},"height":12,"width":12,"margin":{"left":0,"top":0,"right":0,"bottom":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8,"constraints":24}],"id":"TaskP0QPy","width":140,"height":100,"container":null,"offsetX":961,"offsetY":640,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{},"flip":"None","wrapper":{"actualSize":{"width":140,"height":100},"offsetX":961,"offsetY":640},"style":{"fill":"white","strokeColor":"#000000","strokeWidth":2,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"constraints":5242862,"tooltip":{"content":"Task","showTipPointer":true,"width":"auto","height":"auto","relativeMode":"Object","openOn":"Auto"},"symbolInfo":{"height":50,"width":70},"previewSize":{},"dragSize":{},"addInfo":{"tooltip":"Process","type":"Process","status":"new","unconnected_name":"Inform SI PM Liquefaction Impact Assessment to Cable Burial is not required","ctx_id":null,"eicore_id":null,"guid":"870c0a90-4633-4072-950e-fd3fe2bbb56b","userhandle_conceptual_isvalid":false,"userhandle_logical_isvalid":false},"fixedUserHandles":[{"pathData":"M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z","visibility":false,"iconStrokeColor":"green","margin":{"right":-5,"top":-15,"left":0,"bottom":0},"width":16,"height":16,"id":"qZSJP","handleStrokeColor":"transparent","fill":"transparent","handleStrokeWidth":1,"cornerRadius":0,"offset":{"x":0,"y":0},"padding":{"left":0,"right":0,"top":0,"bottom":0},"iconStrokeWidth":0},{"pathData":"M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z","visibility":false,"iconStrokeColor":"green","margin":{"right":-25,"top":-15,"left":0,"bottom":0},"width":16,"height":16,"id":"khrDc","handleStrokeColor":"transparent","fill":"transparent","handleStrokeWidth":1,"cornerRadius":0,"offset":{"x":0,"y":0},"padding":{"left":0,"right":0,"top":0,"bottom":0},"iconStrokeWidth":0}],"zIndex":5,"annotations":[{"id":"PZRbB","content":"Inform SI PM Liquefaction Impact Assessment to Cable Burial is not required","annotationType":"String","style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","bold":false,"textWrapping":"WrapWithOverflow","color":"black","whiteSpace":"CollapseSpace","fontFamily":"Arial","fontSize":12,"italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textOverflow":"Wrap","textDecoration":"None"},"hyperlink":{"link":"","hyperlinkOpenState":"NewTab","content":"","textDecoration":"None"},"constraints":4,"visibility":true,"rotateAngle":0,"margin":{"left":0,"top":0,"right":0,"bottom":0},"horizontalAlignment":"Center","verticalAlignment":"Center","offset":{"x":0.5,"y":0.5}}],"flipMode":"All","isExpanded":true,"expandIcon":{"shape":"None"},"inEdges":["connectorf9nfT"],"outEdges":["connectorDJWT5"],"parentId":"","processId":"","umlIndex":-1,"isPhase":false,"isLane":false},{"shape":{"type":"Bpmn","shape":"Activity","activity":{"activity":"Task","subProcess":{"type":"None","collapsed":true},"task":{"call":false,"compensation":false,"loop":"None","type":"Manual"}},"annotations":[]},"ports":[{"inEdges":[],"outEdges":[],"id":"left","shape":"Circle","offset":{"x":0,"y":0.5},"height":12,"width":12,"margin":{"left":0,"top":0,"right":0,"bottom":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8,"constraints":24},{"inEdges":[],"outEdges":[],"id":"bottom","shape":"Circle","offset":{"x":0.5,"y":1},"height":12,"width":12,"margin":{"left":0,"top":0,"right":0,"bottom":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8,"constraints":24},{"inEdges":[],"outEdges":[],"id":"right","shape":"Circle","offset":{"x":1,"y":0.5},"height":12,"width":12,"margin":{"left":0,"top":0,"right":0,"bottom":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8,"constraints":24},{"inEdges":[],"outEdges":[],"id":"top","shape":"Circle","offset":{"x":0.5,"y":0},"height":12,"width":12,"margin":{"left":0,"top":0,"right":0,"bottom":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8,"constraints":24}],"id":"TaskeW8VJ","width":140,"height":90.00000000000001,"container":null,"offsetX":960,"offsetY":355,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{"top":0,"left":0},"flip":"None","wrapper":{"actualSize":{"width":140,"height":90.00000000000001},"offsetX":960,"offsetY":355},"style":{"fill":"white","strokeColor":"#000000","strokeWidth":2,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"constraints":5242862,"tooltip":{"content":"Task","showTipPointer":true,"width":"auto","height":"auto","relativeMode":"Object","openOn":"Auto"},"symbolInfo":{"height":50,"width":70},"previewSize":{},"dragSize":{},"addInfo":{"tooltip":"Process","type":"Process","status":"new","unconnected_name":"Prepare Liquefaction Impact Assessment to Cable Burial SoW","ctx_id":null,"eicore_id":null,"guid":"c92ec40c-b412-44f8-8353-dd5fa1233281","userhandle_conceptual_isvalid":false,"userhandle_logical_isvalid":false},"fixedUserHandles":[{"pathData":"M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z","visibility":false,"iconStrokeColor":"green","margin":{"right":-5,"top":-15,"left":0,"bottom":0},"width":16,"height":16,"id":"dI1vB","handleStrokeColor":"transparent","fill":"transparent","handleStrokeWidth":1,"cornerRadius":0,"offset":{"x":0,"y":0},"padding":{"left":0,"right":0,"top":0,"bottom":0},"iconStrokeWidth":0},{"pathData":"M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z","visibility":false,"iconStrokeColor":"green","margin":{"right":-25,"top":-15,"left":0,"bottom":0},"width":16,"height":16,"id":"TE6vr","handleStrokeColor":"transparent","fill":"transparent","handleStrokeWidth":1,"cornerRadius":0,"offset":{"x":0,"y":0},"padding":{"left":0,"right":0,"top":0,"bottom":0},"iconStrokeWidth":0}],"zIndex":9,"annotations":[{"id":"T1VBw","content":"Prepare Liquefaction Impact Assessment to Cable Burial SoW","annotationType":"String","style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","bold":false,"textWrapping":"WrapWithOverflow","color":"black","whiteSpace":"CollapseSpace","fontFamily":"Arial","fontSize":12,"italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textOverflow":"Wrap","textDecoration":"None"},"hyperlink":{"link":"","hyperlinkOpenState":"NewTab","content":"","textDecoration":"None"},"constraints":4,"visibility":true,"rotateAngle":0,"margin":{"left":0,"top":0,"right":0,"bottom":0},"horizontalAlignment":"Center","verticalAlignment":"Center","offset":{"x":0.5,"y":0.5}}],"flipMode":"All","isExpanded":true,"expandIcon":{"shape":"None"},"inEdges":["connectornBcq8","connectorfuEWe","connectorm3QrF","connectorunMD0","connectorK0AHO","connectorQJUgB"],"outEdges":["connectorHxn1I","connectorJdaD6"],"parentId":"","processId":"","umlIndex":-1,"isPhase":false,"isLane":false},{"shape":{"type":"Bpmn","shape":"DataObject","dataObject":{"collection":false,"type":"None"},"annotations":[],"activity":{"subProcess":{"collapsed":true},"activity":"Task"}},"ports":[{"inEdges":[],"outEdges":[],"id":"left","shape":"Circle","offset":{"x":0,"y":0.5},"height":12,"width":12,"margin":{"left":0,"top":0,"right":0,"bottom":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8,"constraints":24},{"inEdges":[],"outEdges":[],"id":"bottom","shape":"Circle","offset":{"x":0.5,"y":1},"height":12,"width":12,"margin":{"left":0,"top":0,"right":0,"bottom":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8,"constraints":24},{"inEdges":[],"outEdges":[],"id":"right","shape":"Circle","offset":{"x":1,"y":0.5},"height":12,"width":12,"margin":{"left":0,"top":0,"right":0,"bottom":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8,"constraints":24},{"inEdges":[],"outEdges":[],"id":"top","shape":"Circle","offset":{"x":0.5,"y":0},"height":12,"width":12,"margin":{"left":0,"top":0,"right":0,"bottom":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8,"constraints":24}],"id":"Data_ObjectGtkuS","width":100,"height":120,"constraints":5242862,"container":null,"offsetX":310,"offsetY":140,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{},"flip":"None","wrapper":{"actualSize":{"width":100,"height":120},"offsetX":310,"offsetY":140},"style":{"fill":"white","strokeColor":"#000000","strokeWidth":2,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"tooltip":{"content":"Data Object","showTipPointer":true,"width":"auto","height":"auto","relativeMode":"Object","openOn":"Auto"},"symbolInfo":{"height":60,"width":50},"previewSize":{},"dragSize":{},"addInfo":{"tooltip":"Information","type":"Information","status":"new","unconnected_name":"Geophysical Surfaces","ctx_id":null,"eicore_id":null,"guid":"1e5cfc98-8766-434e-95dc-fc591266d258","userhandle_conceptual_isvalid":false,"userhandle_logical_isvalid":false},"fixedUserHandles":[{"pathData":"M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z","visibility":false,"iconStrokeColor":"green","margin":{"right":-5,"top":-15,"left":0,"bottom":0},"width":16,"height":16,"id":"RIGaT","handleStrokeColor":"transparent","fill":"transparent","handleStrokeWidth":1,"cornerRadius":0,"offset":{"x":0,"y":0},"padding":{"left":0,"right":0,"top":0,"bottom":0},"iconStrokeWidth":0},{"pathData":"M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z","visibility":false,"iconStrokeColor":"green","margin":{"right":-25,"top":-15,"left":0,"bottom":0},"width":16,"height":16,"id":"QGRVb","handleStrokeColor":"transparent","fill":"transparent","handleStrokeWidth":1,"cornerRadius":0,"offset":{"x":0,"y":0},"padding":{"left":0,"right":0,"top":0,"bottom":0},"iconStrokeWidth":0}],"zIndex":11,"annotations":[{"id":"UuUTO","content":"Geophysical Surfaces","annotationType":"String","style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","bold":false,"textWrapping":"WrapWithOverflow","color":"black","whiteSpace":"CollapseSpace","fontFamily":"Arial","fontSize":12,"italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textOverflow":"Wrap","textDecoration":"None"},"hyperlink":{"link":"","hyperlinkOpenState":"NewTab","content":"","textDecoration":"None"},"constraints":4,"visibility":true,"rotateAngle":0,"margin":{"left":0,"top":0,"right":0,"bottom":0},"horizontalAlignment":"Center","verticalAlignment":"Center","offset":{"x":0.5,"y":0.5}}],"flipMode":"All","isExpanded":true,"expandIcon":{"shape":"None"},"inEdges":[],"outEdges":["connectornBcq8"],"parentId":"","processId":"","umlIndex":-1,"isPhase":false,"isLane":false},{"shape":{"type":"Bpmn","shape":"DataObject","dataObject":{"collection":false,"type":"None"},"annotations":[],"activity":{"subProcess":{"collapsed":true},"activity":"Task"}},"ports":[{"inEdges":[],"outEdges":[],"id":"left","shape":"Circle","offset":{"x":0,"y":0.5},"height":12,"width":12,"margin":{"left":0,"top":0,"right":0,"bottom":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8,"constraints":24},{"inEdges":[],"outEdges":[],"id":"bottom","shape":"Circle","offset":{"x":0.5,"y":1},"height":12,"width":12,"margin":{"left":0,"top":0,"right":0,"bottom":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8,"constraints":24},{"inEdges":[],"outEdges":[],"id":"right","shape":"Circle","offset":{"x":1,"y":0.5},"height":12,"width":12,"margin":{"left":0,"top":0,"right":0,"bottom":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8,"constraints":24},{"inEdges":[],"outEdges":[],"id":"top","shape":"Circle","offset":{"x":0.5,"y":0},"height":12,"width":12,"margin":{"left":0,"top":0,"right":0,"bottom":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8,"constraints":24}],"id":"Data_ObjectqGT5F","width":100,"height":120,"constraints":5242862,"container":null,"offsetX":470,"offsetY":140,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{},"flip":"None","wrapper":{"actualSize":{"width":100,"height":120},"offsetX":470,"offsetY":140},"style":{"fill":"white","strokeColor":"#000000","strokeWidth":2,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"tooltip":{"content":"Data Object","showTipPointer":true,"width":"auto","height":"auto","relativeMode":"Object","openOn":"Auto"},"symbolInfo":{"height":60,"width":50},"previewSize":{},"dragSize":{},"addInfo":{"tooltip":"Information","type":"Information","status":"new","unconnected_name":"Soil Properties","ctx_id":null,"eicore_id":null,"guid":"84358d82-f251-4250-a79b-1867dbcfbad9","userhandle_conceptual_isvalid":false,"userhandle_logical_isvalid":false},"fixedUserHandles":[{"pathData":"M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z","visibility":false,"iconStrokeColor":"green","margin":{"right":-5,"top":-15,"left":0,"bottom":0},"width":16,"height":16,"id":"uiIPf","handleStrokeColor":"transparent","fill":"transparent","handleStrokeWidth":1,"cornerRadius":0,"offset":{"x":0,"y":0},"padding":{"left":0,"right":0,"top":0,"bottom":0},"iconStrokeWidth":0},{"pathData":"M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z","visibility":false,"iconStrokeColor":"green","margin":{"right":-25,"top":-15,"left":0,"bottom":0},"width":16,"height":16,"id":"wP8k3","handleStrokeColor":"transparent","fill":"transparent","handleStrokeWidth":1,"cornerRadius":0,"offset":{"x":0,"y":0},"padding":{"left":0,"right":0,"top":0,"bottom":0},"iconStrokeWidth":0}],"zIndex":12,"annotations":[{"id":"a8bbF","content":"Soil Properties","annotationType":"String","style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","bold":false,"textWrapping":"WrapWithOverflow","color":"black","whiteSpace":"CollapseSpace","fontFamily":"Arial","fontSize":12,"italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textOverflow":"Wrap","textDecoration":"None"},"hyperlink":{"link":"","hyperlinkOpenState":"NewTab","content":"","textDecoration":"None"},"constraints":4,"visibility":true,"rotateAngle":0,"margin":{"left":0,"top":0,"right":0,"bottom":0},"horizontalAlignment":"Center","verticalAlignment":"Center","offset":{"x":0.5,"y":0.5}}],"flipMode":"All","isExpanded":true,"expandIcon":{"shape":"None"},"inEdges":[],"outEdges":["connectorfuEWe"],"parentId":"","processId":"","umlIndex":-1,"isPhase":false,"isLane":false},{"shape":{"type":"Bpmn","shape":"DataObject","dataObject":{"collection":false,"type":"None"},"annotations":[],"activity":{"subProcess":{"collapsed":true},"activity":"Task"}},"ports":[{"inEdges":[],"outEdges":[],"id":"left","shape":"Circle","offset":{"x":0,"y":0.5},"height":12,"width":12,"margin":{"left":0,"top":0,"right":0,"bottom":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8,"constraints":24},{"inEdges":[],"outEdges":[],"id":"bottom","shape":"Circle","offset":{"x":0.5,"y":1},"height":12,"width":12,"margin":{"left":0,"top":0,"right":0,"bottom":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8,"constraints":24},{"inEdges":[],"outEdges":[],"id":"right","shape":"Circle","offset":{"x":1,"y":0.5},"height":12,"width":12,"margin":{"left":0,"top":0,"right":0,"bottom":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8,"constraints":24},{"inEdges":[],"outEdges":[],"id":"top","shape":"Circle","offset":{"x":0.5,"y":0},"height":12,"width":12,"margin":{"left":0,"top":0,"right":0,"bottom":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8,"constraints":24}],"id":"Data_Objectb7Wo2","width":100,"height":120,"constraints":5242862,"container":null,"offsetX":630,"offsetY":140,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{},"flip":"None","wrapper":{"actualSize":{"width":100,"height":120},"offsetX":630,"offsetY":140},"style":{"fill":"white","strokeColor":"#000000","strokeWidth":2,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"tooltip":{"content":"Data Object","showTipPointer":true,"width":"auto","height":"auto","relativeMode":"Object","openOn":"Auto"},"symbolInfo":{"height":60,"width":50},"previewSize":{},"dragSize":{},"addInfo":{"tooltip":"Information","type":"Information","status":"new","unconnected_name":"Seabed Mobility","ctx_id":null,"eicore_id":null,"guid":"3d9ba18d-a3d2-42ad-a143-19e8af6851ce","userhandle_conceptual_isvalid":false,"userhandle_logical_isvalid":false},"fixedUserHandles":[{"pathData":"M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z","visibility":false,"iconStrokeColor":"green","margin":{"right":-5,"top":-15,"left":0,"bottom":0},"width":16,"height":16,"id":"mpx9P","handleStrokeColor":"transparent","fill":"transparent","handleStrokeWidth":1,"cornerRadius":0,"offset":{"x":0,"y":0},"padding":{"left":0,"right":0,"top":0,"bottom":0},"iconStrokeWidth":0},{"pathData":"M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z","visibility":false,"iconStrokeColor":"green","margin":{"right":-25,"top":-15,"left":0,"bottom":0},"width":16,"height":16,"id":"ZDtoa","handleStrokeColor":"transparent","fill":"transparent","handleStrokeWidth":1,"cornerRadius":0,"offset":{"x":0,"y":0},"padding":{"left":0,"right":0,"top":0,"bottom":0},"iconStrokeWidth":0}],"zIndex":13,"annotations":[{"id":"nryDo","content":"Seabed Mobility","annotationType":"String","style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","bold":false,"textWrapping":"WrapWithOverflow","color":"black","whiteSpace":"CollapseSpace","fontFamily":"Arial","fontSize":12,"italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textOverflow":"Wrap","textDecoration":"None"},"hyperlink":{"link":"","hyperlinkOpenState":"NewTab","content":"","textDecoration":"None"},"constraints":4,"visibility":true,"rotateAngle":0,"margin":{"left":0,"top":0,"right":0,"bottom":0},"horizontalAlignment":"Center","verticalAlignment":"Center","offset":{"x":0.5,"y":0.5}}],"flipMode":"All","isExpanded":true,"expandIcon":{"shape":"None"},"inEdges":[],"outEdges":["connectorm3QrF"],"parentId":"","processId":"","umlIndex":-1,"isPhase":false,"isLane":false},{"shape":{"type":"Bpmn","shape":"DataObject","dataObject":{"collection":false,"type":"None"},"annotations":[],"activity":{"subProcess":{"collapsed":true},"activity":"Task"}},"ports":[{"inEdges":[],"outEdges":[],"id":"left","shape":"Circle","offset":{"x":0,"y":0.5},"height":12,"width":12,"margin":{"left":0,"top":0,"right":0,"bottom":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8,"constraints":24},{"inEdges":[],"outEdges":[],"id":"bottom","shape":"Circle","offset":{"x":0.5,"y":1},"height":12,"width":12,"margin":{"left":0,"top":0,"right":0,"bottom":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8,"constraints":24},{"inEdges":[],"outEdges":[],"id":"right","shape":"Circle","offset":{"x":1,"y":0.5},"height":12,"width":12,"margin":{"left":0,"top":0,"right":0,"bottom":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8,"constraints":24},{"inEdges":[],"outEdges":[],"id":"top","shape":"Circle","offset":{"x":0.5,"y":0},"height":12,"width":12,"margin":{"left":0,"top":0,"right":0,"bottom":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8,"constraints":24}],"id":"Data_ObjectqIZuM","width":100,"height":120,"constraints":5242862,"container":null,"offsetX":790,"offsetY":140,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{},"flip":"None","wrapper":{"actualSize":{"width":100,"height":120},"offsetX":790,"offsetY":140},"style":{"fill":"white","strokeColor":"#000000","strokeWidth":2,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"tooltip":{"content":"Data Object","showTipPointer":true,"width":"auto","height":"auto","relativeMode":"Object","openOn":"Auto"},"symbolInfo":{"height":60,"width":50},"previewSize":{},"dragSize":{},"addInfo":{"tooltip":"Information","type":"Information","status":"new","unconnected_name":"Cable Properties","ctx_id":null,"eicore_id":null,"guid":"9dbf7535-ae80-4ebf-b708-6c2c8b69431c","userhandle_conceptual_isvalid":false,"userhandle_logical_isvalid":false},"fixedUserHandles":[{"pathData":"M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z","visibility":false,"iconStrokeColor":"green","margin":{"right":-5,"top":-15,"left":0,"bottom":0},"width":16,"height":16,"id":"uipsp","handleStrokeColor":"transparent","fill":"transparent","handleStrokeWidth":1,"cornerRadius":0,"offset":{"x":0,"y":0},"padding":{"left":0,"right":0,"top":0,"bottom":0},"iconStrokeWidth":0},{"pathData":"M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z","visibility":false,"iconStrokeColor":"green","margin":{"right":-25,"top":-15,"left":0,"bottom":0},"width":16,"height":16,"id":"BZ74L","handleStrokeColor":"transparent","fill":"transparent","handleStrokeWidth":1,"cornerRadius":0,"offset":{"x":0,"y":0},"padding":{"left":0,"right":0,"top":0,"bottom":0},"iconStrokeWidth":0}],"zIndex":14,"annotations":[{"id":"hrR9d","content":"Cable Properties","annotationType":"String","style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","bold":false,"textWrapping":"WrapWithOverflow","color":"black","whiteSpace":"CollapseSpace","fontFamily":"Arial","fontSize":12,"italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textOverflow":"Wrap","textDecoration":"None"},"hyperlink":{"link":"","hyperlinkOpenState":"NewTab","content":"","textDecoration":"None"},"constraints":4,"visibility":true,"rotateAngle":0,"margin":{"left":0,"top":0,"right":0,"bottom":0},"horizontalAlignment":"Center","verticalAlignment":"Center","offset":{"x":0.5,"y":0.5}}],"flipMode":"All","isExpanded":true,"expandIcon":{"shape":"None"},"inEdges":[],"outEdges":["connectorunMD0"],"parentId":"","processId":"","umlIndex":-1,"isPhase":false,"isLane":false},{"shape":{"type":"Bpmn","shape":"Activity","activity":{"activity":"Task","subProcess":{"type":"None","collapsed":true},"task":{"call":false,"compensation":false,"loop":"None","type":"Manual"}},"annotations":[]},"ports":[{"inEdges":[],"outEdges":[],"id":"left","shape":"Circle","offset":{"x":0,"y":0.5},"height":12,"width":12,"margin":{"left":0,"top":0,"right":0,"bottom":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8,"constraints":24},{"inEdges":[],"outEdges":[],"id":"bottom","shape":"Circle","offset":{"x":0.5,"y":1},"height":12,"width":12,"margin":{"left":0,"top":0,"right":0,"bottom":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8,"constraints":24},{"inEdges":[],"outEdges":[],"id":"right","shape":"Circle","offset":{"x":1,"y":0.5},"height":12,"width":12,"margin":{"left":0,"top":0,"right":0,"bottom":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8,"constraints":24},{"inEdges":[],"outEdges":[],"id":"top","shape":"Circle","offset":{"x":0.5,"y":0},"height":12,"width":12,"margin":{"left":0,"top":0,"right":0,"bottom":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8,"constraints":24}],"id":"Tasku4sokLHKk2HrSrL","width":140,"height":100,"container":null,"offsetX":2430,"offsetY":355,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{},"flip":"None","wrapper":{"actualSize":{"width":140,"height":100},"offsetX":2430,"offsetY":355},"style":{"fill":"white","strokeColor":"#000000","strokeWidth":2,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"constraints":5242862,"tooltip":{"content":"Task","showTipPointer":true,"width":"auto","height":"auto","relativeMode":"Object","openOn":"Auto"},"symbolInfo":{"height":50,"width":70},"previewSize":{},"dragSize":{},"addInfo":{"tooltip":"Process","type":"Process","status":"new","unconnected_name":"Prepare Results for Stakeholders","ctx_id":null,"eicore_id":null,"guid":"108f3e3a-0eb1-4ea6-ab20-a8dca93ce73f","userhandle_conceptual_isvalid":false,"userhandle_logical_isvalid":false},"fixedUserHandles":[{"pathData":"M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z","visibility":false,"iconStrokeColor":"green","margin":{"right":-5,"top":-15,"left":0,"bottom":0},"width":16,"height":16,"id":"NM0pE","handleStrokeColor":"transparent","fill":"transparent","handleStrokeWidth":1,"cornerRadius":0,"offset":{"x":0,"y":0},"padding":{"left":0,"right":0,"top":0,"bottom":0},"iconStrokeWidth":0},{"pathData":"M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z","visibility":false,"iconStrokeColor":"green","margin":{"right":-25,"top":-15,"left":0,"bottom":0},"width":16,"height":16,"id":"LcnDF","handleStrokeColor":"transparent","fill":"transparent","handleStrokeWidth":1,"cornerRadius":0,"offset":{"x":0,"y":0},"padding":{"left":0,"right":0,"top":0,"bottom":0},"iconStrokeWidth":0}],"zIndex":29,"annotations":[{"id":"hxUwv","content":"Prepare Results for Stakeholders","annotationType":"String","style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","bold":false,"textWrapping":"WrapWithOverflow","color":"black","whiteSpace":"CollapseSpace","fontFamily":"Arial","fontSize":12,"italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textOverflow":"Wrap","textDecoration":"None"},"hyperlink":{"link":"","hyperlinkOpenState":"NewTab","content":"","textDecoration":"None"},"constraints":4,"visibility":true,"rotateAngle":0,"margin":{"left":0,"top":0,"right":0,"bottom":0},"horizontalAlignment":"Center","verticalAlignment":"Center","offset":{"x":0.5,"y":0.5}}],"flipMode":"All","isExpanded":true,"expandIcon":{"shape":"None"},"inEdges":["connectorkB4mc"],"outEdges":["connectorNgT5p","connectorReDDb"],"parentId":"","processId":"","umlIndex":-1,"isPhase":false,"isLane":false},{"shape":{"type":"Bpmn","shape":"DataObject","dataObject":{"collection":false,"type":"None"},"annotations":[],"activity":{"subProcess":{"collapsed":true},"activity":"Task"}},"ports":[{"inEdges":[],"outEdges":[],"id":"left","shape":"Circle","offset":{"x":0,"y":0.5},"height":12,"width":12,"margin":{"left":0,"top":0,"right":0,"bottom":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8,"constraints":24},{"inEdges":[],"outEdges":[],"id":"bottom","shape":"Circle","offset":{"x":0.5,"y":1},"height":12,"width":12,"margin":{"left":0,"top":0,"right":0,"bottom":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8,"constraints":24},{"inEdges":[],"outEdges":[],"id":"right","shape":"Circle","offset":{"x":1,"y":0.5},"height":12,"width":12,"margin":{"left":0,"top":0,"right":0,"bottom":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8,"constraints":24},{"inEdges":[],"outEdges":[],"id":"top","shape":"Circle","offset":{"x":0.5,"y":0},"height":12,"width":12,"margin":{"left":0,"top":0,"right":0,"bottom":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8,"constraints":24}],"id":"Data_ObjectcZ5fTGKCXTa652oiybxn","width":100,"height":120,"constraints":5242862,"container":null,"offsetX":2550,"offsetY":140,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{},"flip":"None","wrapper":{"actualSize":{"width":100,"height":120},"offsetX":2550,"offsetY":140},"style":{"fill":"white","strokeColor":"#000000","strokeWidth":2,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"tooltip":{"content":"Data Object","showTipPointer":true,"width":"auto","height":"auto","relativeMode":"Object","openOn":"Auto"},"symbolInfo":{"height":60,"width":50},"previewSize":{},"dragSize":{},"addInfo":{"tooltip":"Information","type":"Information","status":"new","unconnected_name":"Liquefaction Summary Report","ctx_id":null,"eicore_id":null,"guid":"0c1c094e-28dd-4e44-8367-8a57d374ab0e","userhandle_conceptual_isvalid":false,"userhandle_logical_isvalid":false},"fixedUserHandles":[{"pathData":"M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z","visibility":false,"iconStrokeColor":"green","margin":{"right":-5,"top":-15,"left":0,"bottom":0},"width":16,"height":16,"id":"Ucp13","handleStrokeColor":"transparent","fill":"transparent","handleStrokeWidth":1,"cornerRadius":0,"offset":{"x":0,"y":0},"padding":{"left":0,"right":0,"top":0,"bottom":0},"iconStrokeWidth":0},{"pathData":"M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z","visibility":false,"iconStrokeColor":"green","margin":{"right":-25,"top":-15,"left":0,"bottom":0},"width":16,"height":16,"id":"HCVlL","handleStrokeColor":"transparent","fill":"transparent","handleStrokeWidth":1,"cornerRadius":0,"offset":{"x":0,"y":0},"padding":{"left":0,"right":0,"top":0,"bottom":0},"iconStrokeWidth":0}],"zIndex":35,"annotations":[{"id":"hUZxy","content":"Liquefaction Summary Report","annotationType":"String","style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","bold":false,"textWrapping":"WrapWithOverflow","color":"black","whiteSpace":"CollapseSpace","fontFamily":"Arial","fontSize":12,"italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textOverflow":"Wrap","textDecoration":"None"},"hyperlink":{"link":"","hyperlinkOpenState":"NewTab","content":"","textDecoration":"None"},"constraints":4,"visibility":true,"rotateAngle":0,"margin":{"left":0,"top":0,"right":0,"bottom":0},"horizontalAlignment":"Center","verticalAlignment":"Center","offset":{"x":0.5,"y":0.5}}],"flipMode":"All","isExpanded":true,"expandIcon":{"shape":"None"},"inEdges":["connectorNgT5p"],"outEdges":["connectoriTJsS"],"parentId":"","processId":"","umlIndex":-1,"isPhase":false,"isLane":false},{"shape":{"type":"Bpmn","shape":"Event","event":{"event":"End","trigger":"None"},"annotations":[],"activity":{"subProcess":{}}},"ports":[{"inEdges":[],"outEdges":[],"id":"left","shape":"Circle","offset":{"x":0,"y":0.5},"height":12,"width":12,"margin":{"left":0,"top":0,"right":0,"bottom":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8,"constraints":24},{"inEdges":[],"outEdges":[],"id":"bottom","shape":"Circle","offset":{"x":0.5,"y":1},"height":12,"width":12,"margin":{"left":0,"top":0,"right":0,"bottom":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8,"constraints":24},{"inEdges":[],"outEdges":[],"id":"right","shape":"Circle","offset":{"x":1,"y":0.5},"height":12,"width":12,"margin":{"left":0,"top":0,"right":0,"bottom":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8,"constraints":24},{"inEdges":[],"outEdges":[],"id":"top","shape":"Circle","offset":{"x":0.5,"y":0},"height":12,"width":12,"margin":{"left":0,"top":0,"right":0,"bottom":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8,"constraints":24}],"id":"End_EventS9ib1QEEfC","width":50,"height":50,"constraints":5242862,"container":null,"offsetX":3035,"offsetY":480,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{},"flip":"None","wrapper":{"actualSize":{"width":50,"height":50},"offsetX":3035,"offsetY":480},"style":{"fill":"white","strokeColor":"#000000","strokeWidth":2,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"tooltip":{"content":"End Event","showTipPointer":true,"width":"auto","height":"auto","relativeMode":"Object","openOn":"Auto"},"symbolInfo":{"height":40,"width":40},"previewSize":{},"dragSize":{},"zIndex":41,"annotations":[{"id":"WZwNT","content":"Liquefaction Impact Assessment Report Request Managed","annotationType":"String","style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","bold":false,"textWrapping":"WrapWithOverflow","color":"black","whiteSpace":"CollapseSpace","fontFamily":"Arial","fontSize":12,"italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textOverflow":"Wrap","textDecoration":"None"},"hyperlink":{"link":"","hyperlinkOpenState":"NewTab","content":"","textDecoration":"None"},"constraints":4,"visibility":true,"rotateAngle":0,"margin":{"left":0,"top":0,"right":0,"bottom":0},"horizontalAlignment":"Center","verticalAlignment":"Top","offset":{"x":1,"y":1}}],"flipMode":"All","isExpanded":true,"expandIcon":{"shape":"None"},"fixedUserHandles":[],"inEdges":["connectoraasqK"],"outEdges":[],"parentId":"","processId":"","umlIndex":-1,"isPhase":false,"isLane":false},{"shape":{"type":"Bpmn","shape":"DataObject","dataObject":{"collection":false,"type":"None"},"annotations":[],"activity":{"subProcess":{},"activity":"Task"}},"ports":[{"inEdges":[],"outEdges":[],"id":"left","shape":"Circle","offset":{"x":0,"y":0.5},"height":12,"width":12,"margin":{"left":0,"top":0,"right":0,"bottom":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8,"constraints":24},{"inEdges":[],"outEdges":[],"id":"bottom","shape":"Circle","offset":{"x":0.5,"y":1},"height":12,"width":12,"margin":{"left":0,"top":0,"right":0,"bottom":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8,"constraints":24},{"inEdges":[],"outEdges":[],"id":"right","shape":"Circle","offset":{"x":1,"y":0.5},"height":12,"width":12,"margin":{"left":0,"top":0,"right":0,"bottom":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8,"constraints":24},{"inEdges":[],"outEdges":[],"id":"top","shape":"Circle","offset":{"x":0.5,"y":0},"height":12,"width":12,"margin":{"left":0,"top":0,"right":0,"bottom":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8,"constraints":24}],"id":"Data_ObjectZDkTR","width":100,"height":120,"constraints":5242862,"container":null,"offsetX":210,"offsetY":340,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{"top":0,"left":0},"flip":"None","wrapper":{"actualSize":{"width":100,"height":120},"offsetX":210,"offsetY":340},"style":{"fill":"white","strokeColor":"#000000","strokeWidth":2,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"tooltip":{"content":"Data Object","showTipPointer":true,"width":"auto","height":"auto","relativeMode":"Object","openOn":"Auto"},"symbolInfo":{"height":60,"width":50},"previewSize":{},"dragSize":{},"addInfo":{"tooltip":"Information","type":"Information","status":"new","unconnected_name":"GA Deliverable - Confirm Name","ctx_id":null,"eicore_id":null,"guid":"3c3a6b8e-8eff-4789-94c6-680926fb4d4e","userhandle_conceptual_isvalid":false,"userhandle_logical_isvalid":false},"fixedUserHandles":[{"pathData":"M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z","visibility":false,"iconStrokeColor":"green","margin":{"right":-5,"top":-15,"left":0,"bottom":0},"width":16,"height":16,"id":"qAT2I","handleStrokeColor":"transparent","fill":"transparent","handleStrokeWidth":1,"cornerRadius":0,"offset":{"x":0,"y":0},"padding":{"left":0,"right":0,"top":0,"bottom":0},"iconStrokeWidth":0},{"pathData":"M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z","visibility":false,"iconStrokeColor":"green","margin":{"right":-25,"top":-15,"left":0,"bottom":0},"width":16,"height":16,"id":"aGETG","handleStrokeColor":"transparent","fill":"transparent","handleStrokeWidth":1,"cornerRadius":0,"offset":{"x":0,"y":0},"padding":{"left":0,"right":0,"top":0,"bottom":0},"iconStrokeWidth":0}],"zIndex":44,"annotations":[{"id":"aTyXv","content":"GA Deliverable - Confirm Name","annotationType":"String","style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","bold":false,"textWrapping":"WrapWithOverflow","color":"black","whiteSpace":"CollapseSpace","fontFamily":"Arial","fontSize":12,"italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textOverflow":"Wrap","textDecoration":"None"},"hyperlink":{"link":"","hyperlinkOpenState":"NewTab","content":"","textDecoration":"None"},"constraints":4,"visibility":true,"rotateAngle":0,"margin":{"left":0,"top":0,"right":0,"bottom":0},"horizontalAlignment":"Center","verticalAlignment":"Center","offset":{"x":0.5,"y":0.5}}],"flipMode":"All","isExpanded":true,"expandIcon":{"shape":"None"},"inEdges":[],"outEdges":["connectorH70v1"],"parentId":"","processId":"","umlIndex":-1,"isPhase":false,"isLane":false},{"shape":{"type":"Bpmn","shape":"Event","event":{"event":"Intermediate","trigger":"Message"},"annotations":[],"activity":{"subProcess":{},"activity":"Task"}},"ports":[{"inEdges":[],"outEdges":[],"id":"left","shape":"Circle","offset":{"x":0,"y":0.5},"height":12,"width":12,"margin":{"left":0,"top":0,"right":0,"bottom":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8,"constraints":24},{"inEdges":[],"outEdges":[],"id":"bottom","shape":"Circle","offset":{"x":0.5,"y":1},"height":12,"width":12,"margin":{"left":0,"top":0,"right":0,"bottom":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8,"constraints":24},{"inEdges":[],"outEdges":[],"id":"right","shape":"Circle","offset":{"x":1,"y":0.5},"height":12,"width":12,"margin":{"left":0,"top":0,"right":0,"bottom":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8,"constraints":24},{"inEdges":[],"outEdges":[],"id":"top","shape":"Circle","offset":{"x":0.5,"y":0},"height":12,"width":12,"margin":{"left":0,"top":0,"right":0,"bottom":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8,"constraints":24}],"id":"Intermediate_EventFkC0k","width":50,"height":50,"constraints":5242862,"container":null,"offsetX":1785,"offsetY":355,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{},"flip":"None","wrapper":{"actualSize":{"width":50,"height":50},"offsetX":1785,"offsetY":355},"style":{"fill":"white","strokeColor":"#000000","strokeWidth":2,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"tooltip":{"content":"Intermediate Event","showTipPointer":true,"width":"auto","height":"auto","relativeMode":"Object","openOn":"Auto"},"symbolInfo":{"height":40,"width":40},"previewSize":{},"dragSize":{},"zIndex":48,"annotations":[{"id":"DQSOS","content":"Liquefaction Impact Assessment to Cable Burial Report Received","annotationType":"String","style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","bold":false,"textWrapping":"WrapWithOverflow","color":"black","whiteSpace":"CollapseSpace","fontFamily":"Arial","fontSize":12,"italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textOverflow":"Wrap","textDecoration":"None"},"hyperlink":{"link":"","hyperlinkOpenState":"NewTab","content":"","textDecoration":"None"},"constraints":4,"visibility":true,"rotateAngle":0,"margin":{"left":0,"top":0,"right":0,"bottom":0},"horizontalAlignment":"Center","verticalAlignment":"Top","offset":{"x":0,"y":1}}],"flipMode":"All","isExpanded":true,"expandIcon":{"shape":"None"},"fixedUserHandles":[],"inEdges":["connectorlBFvm"],"outEdges":["connectorm58Hf","connectorkpMtb"],"parentId":"","processId":"","umlIndex":-1,"isPhase":false,"isLane":false},{"shape":{"type":"Bpmn","shape":"Gateway","gateway":{"type":"Exclusive"},"annotations":[],"activity":{"subProcess":{}}},"ports":[{"inEdges":[],"outEdges":[],"id":"left","shape":"Circle","offset":{"x":0,"y":0.5},"height":12,"width":12,"margin":{"left":0,"top":0,"right":0,"bottom":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8,"constraints":24},{"inEdges":[],"outEdges":[],"id":"bottom","shape":"Circle","offset":{"x":0.5,"y":1},"height":12,"width":12,"margin":{"left":0,"top":0,"right":0,"bottom":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8,"constraints":24},{"inEdges":[],"outEdges":[],"id":"right","shape":"Circle","offset":{"x":1,"y":0.5},"height":12,"width":12,"margin":{"left":0,"top":0,"right":0,"bottom":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8,"constraints":24},{"inEdges":[],"outEdges":[],"id":"top","shape":"Circle","offset":{"x":0.5,"y":0},"height":12,"width":12,"margin":{"left":0,"top":0,"right":0,"bottom":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8,"constraints":24}],"id":"Gatewayi1iQr","width":60,"height":60,"container":null,"offsetX":2870,"offsetY":480,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{},"flip":"None","wrapper":{"actualSize":{"width":60,"height":60},"offsetX":2870,"offsetY":480},"style":{"fill":"white","strokeColor":"#000000","strokeWidth":2,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"constraints":5242862,"tooltip":{"content":"Gateway","showTipPointer":true,"width":"auto","height":"auto","relativeMode":"Object","openOn":"Auto"},"symbolInfo":{"height":50,"width":50},"previewSize":{},"dragSize":{},"zIndex":52,"annotations":[],"flipMode":"All","isExpanded":true,"expandIcon":{"shape":"None"},"fixedUserHandles":[],"inEdges":["connectoryEKZw","connectorDJWT5"],"outEdges":["connectoraasqK"],"parentId":"","processId":"","umlIndex":-1,"isPhase":false,"isLane":false},{"shape":{"type":"Bpmn","shape":"DataObject","dataObject":{"collection":false,"type":"None"},"annotations":[],"activity":{"subProcess":{"collapsed":true},"activity":"Task"}},"ports":[{"inEdges":[],"outEdges":[],"id":"left","shape":"Circle","offset":{"x":0,"y":0.5},"height":12,"width":12,"margin":{"left":0,"top":0,"right":0,"bottom":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8,"constraints":24},{"inEdges":[],"outEdges":[],"id":"bottom","shape":"Circle","offset":{"x":0.5,"y":1},"height":12,"width":12,"margin":{"left":0,"top":0,"right":0,"bottom":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8,"constraints":24},{"inEdges":[],"outEdges":[],"id":"right","shape":"Circle","offset":{"x":1,"y":0.5},"height":12,"width":12,"margin":{"left":0,"top":0,"right":0,"bottom":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8,"constraints":24},{"inEdges":[],"outEdges":[],"id":"top","shape":"Circle","offset":{"x":0.5,"y":0},"height":12,"width":12,"margin":{"left":0,"top":0,"right":0,"bottom":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8,"constraints":24}],"id":"Data_ObjectcZ5fTKOX8B","width":100,"height":120,"constraints":5242862,"container":null,"offsetX":960,"offsetY":140,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{},"flip":"None","wrapper":{"actualSize":{"width":100,"height":120},"offsetX":960,"offsetY":140},"style":{"fill":"#fff9c4ff","strokeColor":"#000000","strokeWidth":2,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"tooltip":{"content":"Data Object","showTipPointer":true,"width":"auto","height":"auto","relativeMode":"Object","openOn":"Auto"},"symbolInfo":{"height":60,"width":50},"previewSize":{},"dragSize":{},"addInfo":{"tooltip":"Information","type":"Information","status":"new","unconnected_name":"Liquefaction Impact Assessment to Cable Burial SoW Template","ctx_id":null,"eicore_id":null,"guid":"0c1c094e-28dd-4e44-8367-8a57d374ab0e","userhandle_conceptual_isvalid":false,"userhandle_logical_isvalid":false},"fixedUserHandles":[{"pathData":"M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z","visibility":false,"iconStrokeColor":"green","margin":{"right":-5,"top":-15,"left":0,"bottom":0},"width":16,"height":16,"id":"Ucp13","handleStrokeColor":"transparent","fill":"transparent","handleStrokeWidth":1,"cornerRadius":0,"offset":{"x":0,"y":0},"padding":{"left":0,"right":0,"top":0,"bottom":0},"iconStrokeWidth":0},{"pathData":"M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z","visibility":false,"iconStrokeColor":"green","margin":{"right":-25,"top":-15,"left":0,"bottom":0},"width":16,"height":16,"id":"HCVlL","handleStrokeColor":"transparent","fill":"transparent","handleStrokeWidth":1,"cornerRadius":0,"offset":{"x":0,"y":0},"padding":{"left":0,"right":0,"top":0,"bottom":0},"iconStrokeWidth":0}],"zIndex":56,"annotations":[{"id":"hUZxy","content":"Liquefaction Impact Assessment to Cable Burial SoW Template","annotationType":"String","style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","bold":false,"textWrapping":"WrapWithOverflow","color":"black","whiteSpace":"CollapseSpace","fontFamily":"Arial","fontSize":12,"italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textOverflow":"Wrap","textDecoration":"None"},"hyperlink":{"link":"","hyperlinkOpenState":"NewTab","content":"","textDecoration":"None"},"constraints":4,"visibility":true,"rotateAngle":0,"margin":{"left":0,"top":0,"right":0,"bottom":0},"horizontalAlignment":"Center","verticalAlignment":"Center","offset":{"x":0.5,"y":0.5}}],"flipMode":"All","isExpanded":true,"expandIcon":{"shape":"None"},"inEdges":[],"outEdges":["connectorK0AHO"],"parentId":"","processId":"","umlIndex":-1,"isPhase":false,"isLane":false},{"shape":{"type":"Bpmn","shape":"Activity","activity":{"activity":"Task","subProcess":{"type":"None","collapsed":true},"task":{"call":false,"compensation":false,"loop":"None","type":"None"}},"annotations":[]},"ports":[{"inEdges":[],"outEdges":[],"id":"left","shape":"Circle","offset":{"x":0,"y":0.5},"height":12,"width":12,"margin":{"left":0,"top":0,"right":0,"bottom":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8,"constraints":24},{"inEdges":[],"outEdges":[],"id":"bottom","shape":"Circle","offset":{"x":0.5,"y":1},"height":12,"width":12,"margin":{"left":0,"top":0,"right":0,"bottom":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8,"constraints":24},{"inEdges":[],"outEdges":[],"id":"right","shape":"Circle","offset":{"x":1,"y":0.5},"height":12,"width":12,"margin":{"left":0,"top":0,"right":0,"bottom":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8,"constraints":24},{"inEdges":[],"outEdges":[],"id":"top","shape":"Circle","offset":{"x":0.5,"y":0},"height":12,"width":12,"margin":{"left":0,"top":0,"right":0,"bottom":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8,"constraints":24}],"id":"TaskqKla4","width":140,"height":100,"container":null,"offsetX":1310,"offsetY":355,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{},"flip":"None","wrapper":{"actualSize":{"width":140,"height":100},"offsetX":1310,"offsetY":355},"style":{"fill":"white","strokeColor":"#000000","strokeWidth":2,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"constraints":5242862,"tooltip":{"content":"Task","showTipPointer":true,"width":"auto","height":"auto","relativeMode":"Object","openOn":"Auto"},"symbolInfo":{"height":50,"width":70},"previewSize":{},"dragSize":{},"addInfo":{"tooltip":"Process","type":"Process","status":"new","unconnected_name":"Procure Liquefaction Impact Assessment to Cable Burial SoW","ctx_id":null,"eicore_id":null,"guid":"a13db966-ef24-4098-9f6a-dfd9e867a360","userhandle_conceptual_isvalid":false,"userhandle_logical_isvalid":false},"fixedUserHandles":[{"pathData":"M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z","visibility":false,"iconStrokeColor":"green","margin":{"right":-5,"top":-15,"left":0,"bottom":0},"width":16,"height":16,"id":"S464V","handleStrokeColor":"transparent","fill":"transparent","handleStrokeWidth":1,"cornerRadius":0,"offset":{"x":0,"y":0},"padding":{"left":0,"right":0,"top":0,"bottom":0},"iconStrokeWidth":0},{"pathData":"M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z","visibility":false,"iconStrokeColor":"green","margin":{"right":-25,"top":-15,"left":0,"bottom":0},"width":16,"height":16,"id":"vDAoH","handleStrokeColor":"transparent","fill":"transparent","handleStrokeWidth":1,"cornerRadius":0,"offset":{"x":0,"y":0},"padding":{"left":0,"right":0,"top":0,"bottom":0},"iconStrokeWidth":0}],"zIndex":62,"annotations":[{"id":"ieV4H","content":"Procure Liquefaction Impact Assessment to Cable Burial SoW","annotationType":"String","style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","bold":false,"textWrapping":"WrapWithOverflow","color":"black","whiteSpace":"CollapseSpace","fontFamily":"Arial","fontSize":12,"italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textOverflow":"Wrap","textDecoration":"None"},"hyperlink":{"link":"","hyperlinkOpenState":"NewTab","content":"","textDecoration":"None"},"constraints":4,"visibility":true,"rotateAngle":0,"margin":{"left":0,"top":0,"right":0,"bottom":0},"horizontalAlignment":"Center","verticalAlignment":"Center","offset":{"x":0.5,"y":0.5}}],"flipMode":"All","isExpanded":true,"expandIcon":{"shape":"None"},"inEdges":["connectorHxn1I","connectorZNFg8"],"outEdges":["connectorxyoW9"],"parentId":"","processId":"","umlIndex":-1,"isPhase":false,"isLane":false},{"shape":{"type":"Bpmn","shape":"DataObject","dataObject":{"collection":false,"type":"None"},"annotations":[],"activity":{"subProcess":{"collapsed":true},"activity":"Task"}},"ports":[{"inEdges":[],"outEdges":[],"id":"left","shape":"Circle","offset":{"x":0,"y":0.5},"height":12,"width":12,"margin":{"left":0,"top":0,"right":0,"bottom":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8,"constraints":24},{"inEdges":[],"outEdges":[],"id":"bottom","shape":"Circle","offset":{"x":0.5,"y":1},"height":12,"width":12,"margin":{"left":0,"top":0,"right":0,"bottom":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8,"constraints":24},{"inEdges":[],"outEdges":[],"id":"right","shape":"Circle","offset":{"x":1,"y":0.5},"height":12,"width":12,"margin":{"left":0,"top":0,"right":0,"bottom":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8,"constraints":24},{"inEdges":[],"outEdges":[],"id":"top","shape":"Circle","offset":{"x":0.5,"y":0},"height":12,"width":12,"margin":{"left":0,"top":0,"right":0,"bottom":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8,"constraints":24}],"id":"Data_ObjectcZ5fT","width":100,"height":120,"constraints":5242862,"container":null,"offsetX":1130,"offsetY":140,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{},"flip":"None","wrapper":{"actualSize":{"width":100,"height":120},"offsetX":1130,"offsetY":140},"style":{"fill":"white","strokeColor":"#000000","strokeWidth":2,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"tooltip":{"content":"Data Object","showTipPointer":true,"width":"auto","height":"auto","relativeMode":"Object","openOn":"Auto"},"symbolInfo":{"height":60,"width":50},"previewSize":{},"dragSize":{},"addInfo":{"tooltip":"Information","type":"Information","status":"new","unconnected_name":"Liquefaction Impact Assessment to Cable Burial SoW","ctx_id":null,"eicore_id":null,"guid":"0c1c094e-28dd-4e44-8367-8a57d374ab0e","userhandle_conceptual_isvalid":false,"userhandle_logical_isvalid":false},"fixedUserHandles":[{"pathData":"M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z","visibility":false,"iconStrokeColor":"green","margin":{"right":-5,"top":-15,"left":0,"bottom":0},"width":16,"height":16,"id":"Ucp13","handleStrokeColor":"transparent","fill":"transparent","handleStrokeWidth":1,"cornerRadius":0,"offset":{"x":0,"y":0},"padding":{"left":0,"right":0,"top":0,"bottom":0},"iconStrokeWidth":0},{"pathData":"M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z","visibility":false,"iconStrokeColor":"green","margin":{"right":-25,"top":-15,"left":0,"bottom":0},"width":16,"height":16,"id":"HCVlL","handleStrokeColor":"transparent","fill":"transparent","handleStrokeWidth":1,"cornerRadius":0,"offset":{"x":0,"y":0},"padding":{"left":0,"right":0,"top":0,"bottom":0},"iconStrokeWidth":0}],"zIndex":21,"annotations":[{"id":"hUZxy","content":"Liquefaction Impact Assessment to Cable Burial SoW","annotationType":"String","style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","bold":false,"textWrapping":"WrapWithOverflow","color":"black","whiteSpace":"CollapseSpace","fontFamily":"Arial","fontSize":12,"italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textOverflow":"Wrap","textDecoration":"None"},"hyperlink":{"link":"","hyperlinkOpenState":"NewTab","content":"","textDecoration":"None"},"constraints":4,"visibility":true,"rotateAngle":0,"margin":{"left":0,"top":0,"right":0,"bottom":0},"horizontalAlignment":"Center","verticalAlignment":"Center","offset":{"x":0.5,"y":0.5}}],"flipMode":"All","isExpanded":true,"expandIcon":{"shape":"None"},"inEdges":["connectorJdaD6"],"outEdges":["connectorZNFg8"],"parentId":"","processId":"","umlIndex":-1,"isPhase":false,"isLane":false},{"shape":{"type":"Bpmn","shape":"Activity","activity":{"activity":"Task","subProcess":{"type":"None","collapsed":true},"task":{"call":false,"compensation":false,"loop":"None","type":"None"}},"annotations":[]},"ports":[{"inEdges":[],"outEdges":[],"id":"left","shape":"Circle","offset":{"x":0,"y":0.5},"height":12,"width":12,"margin":{"left":0,"top":0,"right":0,"bottom":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8,"constraints":24},{"inEdges":[],"outEdges":[],"id":"bottom","shape":"Circle","offset":{"x":0.5,"y":1},"height":12,"width":12,"margin":{"left":0,"top":0,"right":0,"bottom":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8,"constraints":24},{"inEdges":[],"outEdges":[],"id":"right","shape":"Circle","offset":{"x":1,"y":0.5},"height":12,"width":12,"margin":{"left":0,"top":0,"right":0,"bottom":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8,"constraints":24},{"inEdges":[],"outEdges":[],"id":"top","shape":"Circle","offset":{"x":0.5,"y":0},"height":12,"width":12,"margin":{"left":0,"top":0,"right":0,"bottom":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8,"constraints":24}],"id":"TaskqKla4TfIVX","width":140,"height":100,"container":null,"offsetX":1510,"offsetY":355,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{},"flip":"None","wrapper":{"actualSize":{"width":140,"height":100},"offsetX":1510,"offsetY":355},"style":{"fill":"white","strokeColor":"#000000","strokeWidth":2,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"constraints":5242862,"tooltip":{"content":"Task","showTipPointer":true,"width":"auto","height":"auto","relativeMode":"Object","openOn":"Auto"},"symbolInfo":{"height":50,"width":70},"previewSize":{},"dragSize":{},"addInfo":{"tooltip":"Process","type":"Process","status":"new","unconnected_name":"Execution Liquefaction Impact Assessment to Cable Burial","ctx_id":null,"eicore_id":null,"guid":"a13db966-ef24-4098-9f6a-dfd9e867a360","userhandle_conceptual_isvalid":false,"userhandle_logical_isvalid":false},"fixedUserHandles":[{"pathData":"M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z","visibility":false,"iconStrokeColor":"green","margin":{"right":-5,"top":-15,"left":0,"bottom":0},"width":16,"height":16,"id":"S464V","handleStrokeColor":"transparent","fill":"transparent","handleStrokeWidth":1,"cornerRadius":0,"offset":{"x":0,"y":0},"padding":{"left":0,"right":0,"top":0,"bottom":0},"iconStrokeWidth":0},{"pathData":"M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z","visibility":false,"iconStrokeColor":"green","margin":{"right":-25,"top":-15,"left":0,"bottom":0},"width":16,"height":16,"id":"vDAoH","handleStrokeColor":"transparent","fill":"transparent","handleStrokeWidth":1,"cornerRadius":0,"offset":{"x":0,"y":0},"padding":{"left":0,"right":0,"top":0,"bottom":0},"iconStrokeWidth":0}],"zIndex":66,"annotations":[{"id":"ieV4H","content":"Execution Liquefaction Impact Assessment to Cable Burial","annotationType":"String","style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","bold":false,"textWrapping":"WrapWithOverflow","color":"black","whiteSpace":"CollapseSpace","fontFamily":"Arial","fontSize":12,"italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textOverflow":"Wrap","textDecoration":"None"},"hyperlink":{"link":"","hyperlinkOpenState":"NewTab","content":"","textDecoration":"None"},"constraints":4,"visibility":true,"rotateAngle":0,"margin":{"left":0,"top":0,"right":0,"bottom":0},"horizontalAlignment":"Center","verticalAlignment":"Center","offset":{"x":0.5,"y":0.5}}],"flipMode":"All","isExpanded":true,"expandIcon":{"shape":"None"},"inEdges":["connectorxyoW9"],"outEdges":["connectorlBFvm"],"parentId":"","processId":"","umlIndex":-1,"isPhase":false,"isLane":false},{"shape":{"type":"Bpmn","shape":"Activity","activity":{"activity":"Task","subProcess":{"type":"None","collapsed":true},"task":{"call":false,"compensation":false,"loop":"None","type":"None"}},"annotations":[]},"ports":[{"inEdges":[],"outEdges":[],"id":"left","shape":"Circle","offset":{"x":0,"y":0.5},"height":12,"width":12,"margin":{"left":0,"top":0,"right":0,"bottom":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8,"constraints":24},{"inEdges":[],"outEdges":[],"id":"bottom","shape":"Circle","offset":{"x":0.5,"y":1},"height":12,"width":12,"margin":{"left":0,"top":0,"right":0,"bottom":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8,"constraints":24},{"inEdges":[],"outEdges":[],"id":"right","shape":"Circle","offset":{"x":1,"y":0.5},"height":12,"width":12,"margin":{"left":0,"top":0,"right":0,"bottom":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8,"constraints":24},{"inEdges":[],"outEdges":[],"id":"top","shape":"Circle","offset":{"x":0.5,"y":0},"height":12,"width":12,"margin":{"left":0,"top":0,"right":0,"bottom":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8,"constraints":24}],"id":"TaskqKla4TfIVXw1p5k","width":140,"height":100,"container":null,"offsetX":2090,"offsetY":355,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{},"flip":"None","wrapper":{"actualSize":{"width":140,"height":100},"offsetX":2090,"offsetY":355},"style":{"fill":"white","strokeColor":"#000000","strokeWidth":2,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"constraints":5242862,"tooltip":{"content":"Task","showTipPointer":true,"width":"auto","height":"auto","relativeMode":"Object","openOn":"Auto"},"symbolInfo":{"height":50,"width":70},"previewSize":{},"dragSize":{},"addInfo":{"tooltip":"Process","type":"Process","status":"new","unconnected_name":"Review and Approve Liquefaction Impact Assessment to Cable Burial Deliverable","ctx_id":null,"eicore_id":null,"guid":"a13db966-ef24-4098-9f6a-dfd9e867a360","userhandle_conceptual_isvalid":false,"userhandle_logical_isvalid":false},"fixedUserHandles":[{"pathData":"M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z","visibility":false,"iconStrokeColor":"green","margin":{"right":-5,"top":-15,"left":0,"bottom":0},"width":16,"height":16,"id":"S464V","handleStrokeColor":"transparent","fill":"transparent","handleStrokeWidth":1,"cornerRadius":0,"offset":{"x":0,"y":0},"padding":{"left":0,"right":0,"top":0,"bottom":0},"iconStrokeWidth":0},{"pathData":"M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z","visibility":false,"iconStrokeColor":"green","margin":{"right":-25,"top":-15,"left":0,"bottom":0},"width":16,"height":16,"id":"vDAoH","handleStrokeColor":"transparent","fill":"transparent","handleStrokeWidth":1,"cornerRadius":0,"offset":{"x":0,"y":0},"padding":{"left":0,"right":0,"top":0,"bottom":0},"iconStrokeWidth":0}],"zIndex":67,"annotations":[{"id":"ieV4H","content":"Review and Approve Liquefaction Impact Assessment to Cable Burial Deliverable","annotationType":"String","style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","bold":false,"textWrapping":"WrapWithOverflow","color":"black","whiteSpace":"CollapseSpace","fontFamily":"Arial","fontSize":12,"italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textOverflow":"Wrap","textDecoration":"None"},"hyperlink":{"link":"","hyperlinkOpenState":"NewTab","content":"","textDecoration":"None"},"constraints":4,"visibility":true,"rotateAngle":0,"margin":{"left":0,"top":0,"right":0,"bottom":0},"horizontalAlignment":"Center","verticalAlignment":"Center","offset":{"x":0.5,"y":0.5}}],"flipMode":"All","isExpanded":true,"expandIcon":{"shape":"None"},"inEdges":["connectorm58Hf","connectorhsOpM"],"outEdges":["connectorkB4mc"],"parentId":"","processId":"","umlIndex":-1,"isPhase":false,"isLane":false},{"shape":{"type":"Bpmn","shape":"DataObject","dataObject":{"collection":false,"type":"None"},"annotations":[],"activity":{"subProcess":{"collapsed":true},"activity":"Task"}},"ports":[{"inEdges":[],"outEdges":[],"id":"left","shape":"Circle","offset":{"x":0,"y":0.5},"height":12,"width":12,"margin":{"left":0,"top":0,"right":0,"bottom":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8,"constraints":24},{"inEdges":[],"outEdges":[],"id":"bottom","shape":"Circle","offset":{"x":0.5,"y":1},"height":12,"width":12,"margin":{"left":0,"top":0,"right":0,"bottom":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8,"constraints":24},{"inEdges":[],"outEdges":[],"id":"right","shape":"Circle","offset":{"x":1,"y":0.5},"height":12,"width":12,"margin":{"left":0,"top":0,"right":0,"bottom":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8,"constraints":24},{"inEdges":[],"outEdges":[],"id":"top","shape":"Circle","offset":{"x":0.5,"y":0},"height":12,"width":12,"margin":{"left":0,"top":0,"right":0,"bottom":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8,"constraints":24}],"id":"Data_ObjectcZ5fTKk3hQ","width":100,"height":120,"constraints":5242862,"container":null,"offsetX":1950,"offsetY":140,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{},"flip":"None","wrapper":{"actualSize":{"width":100,"height":120},"offsetX":1950,"offsetY":140},"style":{"fill":"white","strokeColor":"#000000","strokeWidth":2,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"tooltip":{"content":"Data Object","showTipPointer":true,"width":"auto","height":"auto","relativeMode":"Object","openOn":"Auto"},"symbolInfo":{"height":60,"width":50},"previewSize":{},"dragSize":{},"addInfo":{"tooltip":"Information","type":"Information","status":"new","unconnected_name":"Liquefaction Impact Assessment to Cable Burial Report","ctx_id":null,"eicore_id":null,"guid":"0c1c094e-28dd-4e44-8367-8a57d374ab0e","userhandle_conceptual_isvalid":false,"userhandle_logical_isvalid":false},"fixedUserHandles":[{"pathData":"M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z","visibility":false,"iconStrokeColor":"green","margin":{"right":-5,"top":-15,"left":0,"bottom":0},"width":16,"height":16,"id":"Ucp13","handleStrokeColor":"transparent","fill":"transparent","handleStrokeWidth":1,"cornerRadius":0,"offset":{"x":0,"y":0},"padding":{"left":0,"right":0,"top":0,"bottom":0},"iconStrokeWidth":0},{"pathData":"M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z","visibility":false,"iconStrokeColor":"green","margin":{"right":-25,"top":-15,"left":0,"bottom":0},"width":16,"height":16,"id":"HCVlL","handleStrokeColor":"transparent","fill":"transparent","handleStrokeWidth":1,"cornerRadius":0,"offset":{"x":0,"y":0},"padding":{"left":0,"right":0,"top":0,"bottom":0},"iconStrokeWidth":0}],"zIndex":73,"annotations":[{"id":"hUZxy","content":"Liquefaction Impact Assessment to Cable Burial Report","annotationType":"String","style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","bold":false,"textWrapping":"WrapWithOverflow","color":"black","whiteSpace":"CollapseSpace","fontFamily":"Arial","fontSize":12,"italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textOverflow":"Wrap","textDecoration":"None"},"hyperlink":{"link":"","hyperlinkOpenState":"NewTab","content":"","textDecoration":"None"},"constraints":4,"visibility":true,"rotateAngle":0,"margin":{"left":0,"top":0,"right":0,"bottom":0},"horizontalAlignment":"Center","verticalAlignment":"Center","offset":{"x":0.5,"y":0.5}}],"flipMode":"All","isExpanded":true,"expandIcon":{"shape":"None"},"inEdges":["connectorkpMtb"],"outEdges":["connectorhsOpM"],"parentId":"","processId":"","umlIndex":-1,"isPhase":false,"isLane":false},{"shape":{"type":"Bpmn","shape":"Activity","activity":{"activity":"Task","subProcess":{"type":"None","collapsed":true},"task":{"call":false,"compensation":false,"loop":"None","type":"Manual"}},"annotations":[]},"ports":[{"inEdges":[],"outEdges":[],"id":"left","shape":"Circle","offset":{"x":0,"y":0.5},"height":12,"width":12,"margin":{"left":0,"top":0,"right":0,"bottom":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8,"constraints":24},{"inEdges":[],"outEdges":[],"id":"bottom","shape":"Circle","offset":{"x":0.5,"y":1},"height":12,"width":12,"margin":{"left":0,"top":0,"right":0,"bottom":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8,"constraints":24},{"inEdges":[],"outEdges":[],"id":"right","shape":"Circle","offset":{"x":1,"y":0.5},"height":12,"width":12,"margin":{"left":0,"top":0,"right":0,"bottom":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8,"constraints":24},{"inEdges":[],"outEdges":[],"id":"top","shape":"Circle","offset":{"x":0.5,"y":0},"height":12,"width":12,"margin":{"left":0,"top":0,"right":0,"bottom":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8,"constraints":24}],"id":"Tasku4sokLHKk2HrSrLSvLov","width":140,"height":100,"container":null,"offsetX":2670,"offsetY":355,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{},"flip":"None","wrapper":{"actualSize":{"width":140,"height":100},"offsetX":2670,"offsetY":355},"style":{"fill":"white","strokeColor":"#000000","strokeWidth":2,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"constraints":5242862,"tooltip":{"content":"Task","showTipPointer":true,"width":"auto","height":"auto","relativeMode":"Object","openOn":"Auto"},"symbolInfo":{"height":50,"width":70},"previewSize":{},"dragSize":{},"addInfo":{"tooltip":"Process","type":"Process","status":"new","unconnected_name":"Upload Liquefaction Summary Report to DORECO and inform Stakeholders","ctx_id":null,"eicore_id":null,"guid":"108f3e3a-0eb1-4ea6-ab20-a8dca93ce73f","userhandle_conceptual_isvalid":false,"userhandle_logical_isvalid":false},"fixedUserHandles":[{"pathData":"M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z","visibility":false,"iconStrokeColor":"green","margin":{"right":-5,"top":-15,"left":0,"bottom":0},"width":16,"height":16,"id":"NM0pE","handleStrokeColor":"transparent","fill":"transparent","handleStrokeWidth":1,"cornerRadius":0,"offset":{"x":0,"y":0},"padding":{"left":0,"right":0,"top":0,"bottom":0},"iconStrokeWidth":0},{"pathData":"M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z","visibility":false,"iconStrokeColor":"green","margin":{"right":-25,"top":-15,"left":0,"bottom":0},"width":16,"height":16,"id":"LcnDF","handleStrokeColor":"transparent","fill":"transparent","handleStrokeWidth":1,"cornerRadius":0,"offset":{"x":0,"y":0},"padding":{"left":0,"right":0,"top":0,"bottom":0},"iconStrokeWidth":0}],"zIndex":78,"annotations":[{"id":"hxUwv","content":"Upload Liquefaction Summary Report to DORECO and inform Stakeholders","annotationType":"String","style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","bold":false,"textWrapping":"WrapWithOverflow","color":"black","whiteSpace":"CollapseSpace","fontFamily":"Arial","fontSize":12,"italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textOverflow":"Wrap","textDecoration":"None"},"hyperlink":{"link":"","hyperlinkOpenState":"NewTab","content":"","textDecoration":"None"},"constraints":4,"visibility":true,"rotateAngle":0,"margin":{"left":0,"top":0,"right":0,"bottom":0},"horizontalAlignment":"Center","verticalAlignment":"Center","offset":{"x":0.5,"y":0.5}}],"flipMode":"All","isExpanded":true,"expandIcon":{"shape":"None"},"inEdges":["connectorReDDb","connectoriTJsS"],"outEdges":["connectoryEKZw"],"parentId":"","processId":"","umlIndex":-1,"isPhase":false,"isLane":false}],"connectors":[{"shape":{"type":"Bpmn","sequence":"Normal","flow":"Sequence"},"type":"Orthogonal","sourceID":"Start_Eventp3v58","sourcePoint":{"x":149.66,"y":501},"targetPoint":{"x":280,"y":501},"id":"connectorss71m","targetID":"Taskn4NDV","zIndex":2,"style":{"strokeWidth":2,"strokeColor":"#000000","fill":"transparent","strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"annotations":[],"constraints":470910,"segments":[{"type":"Orthogonal","direction":null,"length":null,"allowDrag":true}],"sourcePortID":"","targetPortID":"","connectorSpacing":13,"sourcePadding":0,"targetPadding":0,"sourceDecorator":{"shape":"None","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"targetDecorator":{"shape":"Arrow","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"#000000","strokeWidth":2,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"cornerRadius":0,"wrapper":{"actualSize":{"width":130.34,"height":0},"offsetX":214.82999999999998,"offsetY":501},"fixedUserHandles":[],"visible":true,"flipMode":"All","tooltip":{"openOn":"Auto","content":""},"connectionPadding":0,"bridgeSpace":10,"maxSegmentThumb":null,"hitPadding":10,"parentId":""},{"shape":{"type":"Bpmn","sequence":"Normal","flow":"Sequence"},"type":"Orthogonal","sourceID":"Taskn4NDV","sourcePoint":{"x":420,"y":501},"targetPoint":{"x":603.53,"y":501},"id":"connectory739V","targetID":"Gatewayo4Msl","zIndex":4,"style":{"strokeWidth":2,"strokeColor":"#000000","fill":"transparent","strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"annotations":[],"constraints":470910,"segments":[{"type":"Orthogonal","direction":null,"length":null,"allowDrag":true}],"sourcePortID":"","targetPortID":"","connectorSpacing":13,"sourcePadding":0,"targetPadding":0,"sourceDecorator":{"shape":"None","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"targetDecorator":{"shape":"Arrow","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"#000000","strokeWidth":2,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"cornerRadius":0,"wrapper":{"actualSize":{"width":183.52999999999997,"height":0},"offsetX":511.765,"offsetY":501},"fixedUserHandles":[],"visible":true,"flipMode":"All","tooltip":{"openOn":"Auto","content":""},"connectionPadding":0,"bridgeSpace":10,"maxSegmentThumb":null,"hitPadding":10,"parentId":""},{"shape":{"type":"Bpmn","sequence":"Normal","flow":"Sequence"},"type":"Orthogonal","sourceID":"Gatewayo4Msl","sourcePoint":{"x":630,"y":528.4},"targetPoint":{"x":891,"y":640},"id":"connectorf9nfT","targetID":"TaskP0QPy","zIndex":8,"style":{"strokeWidth":2,"strokeColor":"#000000","fill":"transparent","strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"annotations":[{"id":"PL18h","content":"No","annotationType":"String","constraints":4,"visibility":true,"rotateAngle":0,"horizontalAlignment":"Center","verticalAlignment":"Top","margin":{"left":0,"right":0,"top":0,"bottom":0},"style":{"strokeWidth":0,"strokeColor":"transparent","fill":"White","strokeDashArray":"","opacity":1,"gradient":{"type":"None"},"fontSize":12,"fontFamily":"Arial","textOverflow":"Wrap","textDecoration":"None","whiteSpace":"CollapseSpace","textWrapping":"WrapWithOverflow","textAlign":"Center","color":"black","italic":false,"bold":false},"offset":0.5,"alignment":"Center","segmentAngle":false,"displacement":{"x":0,"y":0}}],"constraints":470910,"segments":[{"type":"Orthogonal","length":111.59884630545139,"direction":"Bottom","allowDrag":true},{"type":"Orthogonal","length":null,"direction":null,"allowDrag":true}],"sourcePortID":"","targetPortID":"","connectorSpacing":13,"sourcePadding":0,"targetPadding":0,"sourceDecorator":{"shape":"None","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"targetDecorator":{"shape":"Arrow","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"#000000","strokeWidth":2,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"cornerRadius":0,"wrapper":{"actualSize":{"width":261,"height":111.60000000000002},"offsetX":760.5,"offsetY":584.2},"fixedUserHandles":[],"visible":true,"flipMode":"All","tooltip":{"openOn":"Auto","content":""},"connectionPadding":0,"bridgeSpace":10,"maxSegmentThumb":null,"hitPadding":10,"allowNodeOverlap":false,"parentId":""},{"shape":{"type":"Bpmn","sequence":"Normal","flow":"Sequence"},"type":"Orthogonal","sourceID":"Gatewayo4Msl","sourcePoint":{"x":630,"y":473.8},"targetPoint":{"x":890,"y":355},"id":"connectorQJUgB","targetID":"TaskeW8VJ","zIndex":10,"style":{"strokeWidth":2,"strokeColor":"#000000","fill":"transparent","strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"annotations":[{"id":"UQlI3","content":"Yes","annotationType":"String","constraints":4,"visibility":true,"rotateAngle":0,"horizontalAlignment":"Center","verticalAlignment":"Bottom","margin":{"left":0,"right":0,"top":0,"bottom":0},"style":{"strokeWidth":0,"strokeColor":"transparent","fill":"White","strokeDashArray":"","opacity":1,"gradient":{"type":"None"},"fontSize":12,"fontFamily":"Arial","textOverflow":"Wrap","textDecoration":"None","whiteSpace":"CollapseSpace","textWrapping":"WrapWithOverflow","textAlign":"Center","color":"black","italic":false,"bold":false},"offset":0.5,"alignment":"Center","segmentAngle":false,"displacement":{"x":0,"y":0}}],"constraints":470910,"segments":[{"type":"Orthogonal","length":118.80087163187517,"direction":"Top","allowDrag":true},{"type":"Orthogonal","length":null,"direction":null,"allowDrag":true}],"sourcePortID":"","targetPortID":"","connectorSpacing":13,"sourcePadding":0,"targetPadding":0,"sourceDecorator":{"shape":"None","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"targetDecorator":{"shape":"Arrow","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"#000000","strokeWidth":2,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"cornerRadius":0,"wrapper":{"actualSize":{"width":260,"height":118.80000000000001},"offsetX":760,"offsetY":414.4},"fixedUserHandles":[],"visible":true,"flipMode":"All","tooltip":{"openOn":"Auto","content":""},"connectionPadding":0,"bridgeSpace":10,"maxSegmentThumb":null,"hitPadding":10,"allowNodeOverlap":false,"parentId":""},{"shape":{"type":"Bpmn","sequence":"Normal","flow":"Association","association":"Directional"},"type":"Orthogonal","sourceID":"Data_ObjectGtkuS","sourcePoint":{"x":310,"y":200},"targetPoint":{"x":960,"y":310},"id":"connectornBcq8","targetID":"TaskeW8VJ","zIndex":15,"style":{"strokeWidth":2,"strokeColor":"#000000","fill":"transparent","strokeDashArray":"2 2","opacity":1,"gradient":{"type":"None"}},"annotations":[],"constraints":470910,"segments":[{"type":"Orthogonal","length":60,"direction":"Bottom","allowDrag":true},{"type":"Orthogonal","direction":null,"allowDrag":true,"length":null}],"sourcePortID":"","targetPortID":"","connectorSpacing":13,"sourcePadding":0,"targetPadding":0,"sourceDecorator":{"shape":"None","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"targetDecorator":{"shape":"OpenArrow","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"#000000","strokeWidth":2,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"cornerRadius":0,"wrapper":{"actualSize":{"width":650,"height":110},"offsetX":635,"offsetY":255},"fixedUserHandles":[],"visible":true,"flipMode":"All","tooltip":{"openOn":"Auto","content":""},"connectionPadding":0,"bridgeSpace":10,"maxSegmentThumb":null,"hitPadding":10,"allowNodeOverlap":false,"parentId":""},{"shape":{"type":"Bpmn","sequence":"Normal","flow":"Association","association":"Directional"},"type":"Orthogonal","sourceID":"Data_ObjectqGT5F","sourcePoint":{"x":470,"y":200},"targetPoint":{"x":960,"y":310},"id":"connectorfuEWe","targetID":"TaskeW8VJ","zIndex":16,"style":{"strokeWidth":2,"strokeColor":"#000000","fill":"transparent","strokeDashArray":"2 2","opacity":1,"gradient":{"type":"None"}},"annotations":[],"constraints":470910,"segments":[{"type":"Orthogonal","length":60,"direction":"Bottom","allowDrag":true},{"type":"Orthogonal","direction":null,"allowDrag":true,"length":null}],"sourcePortID":"","targetPortID":"","connectorSpacing":13,"sourcePadding":0,"targetPadding":0,"sourceDecorator":{"shape":"None","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"targetDecorator":{"shape":"OpenArrow","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"#000000","strokeWidth":2,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"cornerRadius":0,"wrapper":{"actualSize":{"width":490,"height":110},"offsetX":715,"offsetY":255},"fixedUserHandles":[],"visible":true,"flipMode":"All","tooltip":{"openOn":"Auto","content":""},"connectionPadding":0,"bridgeSpace":10,"maxSegmentThumb":null,"hitPadding":10,"allowNodeOverlap":false,"parentId":""},{"shape":{"type":"Bpmn","sequence":"Normal","flow":"Association","association":"Directional"},"type":"Orthogonal","sourceID":"Data_Objectb7Wo2","sourcePoint":{"x":630,"y":200},"targetPoint":{"x":960,"y":310},"id":"connectorm3QrF","targetID":"TaskeW8VJ","zIndex":17,"style":{"strokeWidth":2,"strokeColor":"#000000","fill":"transparent","strokeDashArray":"2 2","opacity":1,"gradient":{"type":"None"}},"annotations":[],"constraints":470910,"segments":[{"type":"Orthogonal","length":60,"direction":"Bottom","allowDrag":true},{"type":"Orthogonal","direction":null,"allowDrag":true,"length":null}],"sourcePortID":"","targetPortID":"","connectorSpacing":13,"sourcePadding":0,"targetPadding":0,"sourceDecorator":{"shape":"None","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"targetDecorator":{"shape":"OpenArrow","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"#000000","strokeWidth":2,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"cornerRadius":0,"wrapper":{"actualSize":{"width":330,"height":110},"offsetX":795,"offsetY":255},"fixedUserHandles":[],"visible":true,"flipMode":"All","tooltip":{"openOn":"Auto","content":""},"connectionPadding":0,"bridgeSpace":10,"maxSegmentThumb":null,"hitPadding":10,"allowNodeOverlap":false,"parentId":""},{"shape":{"type":"Bpmn","sequence":"Normal","flow":"Association","association":"Directional"},"type":"Orthogonal","sourceID":"Data_ObjectqIZuM","sourcePoint":{"x":790,"y":200},"targetPoint":{"x":960,"y":310},"id":"connectorunMD0","targetID":"TaskeW8VJ","zIndex":18,"style":{"strokeWidth":2,"strokeColor":"#000000","fill":"transparent","strokeDashArray":"2 2","opacity":1,"gradient":{"type":"None"}},"annotations":[],"constraints":470910,"segments":[{"type":"Orthogonal","length":60,"direction":"Bottom","allowDrag":true},{"type":"Orthogonal","direction":null,"allowDrag":true,"length":null}],"sourcePortID":"","targetPortID":"","connectorSpacing":13,"sourcePadding":0,"targetPadding":0,"sourceDecorator":{"shape":"None","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"targetDecorator":{"shape":"OpenArrow","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"#000000","strokeWidth":2,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"cornerRadius":0,"wrapper":{"actualSize":{"width":170,"height":110},"offsetX":875,"offsetY":255},"fixedUserHandles":[],"visible":true,"flipMode":"All","tooltip":{"openOn":"Auto","content":""},"connectionPadding":0,"bridgeSpace":10,"maxSegmentThumb":null,"hitPadding":10,"allowNodeOverlap":false,"parentId":""},{"shape":{"type":"Bpmn","sequence":"Normal","flow":"Association","association":"Directional"},"type":"Orthogonal","sourceID":"Tasku4sokLHKk2HrSrL","sourcePoint":{"x":2430,"y":305},"targetPoint":{"x":2550,"y":200},"id":"connectorNgT5p","targetID":"Data_ObjectcZ5fTGKCXTa652oiybxn","zIndex":36,"style":{"strokeWidth":2,"strokeColor":"#000000","fill":"transparent","strokeDashArray":"2 2","opacity":1,"gradient":{"type":"None"}},"annotations":[],"constraints":470910,"segments":[{"type":"Orthogonal","length":45,"direction":"Top","allowDrag":true},{"type":"Orthogonal","direction":null,"allowDrag":true,"length":null}],"sourcePortID":"","targetPortID":"","connectorSpacing":13,"sourcePadding":0,"targetPadding":0,"sourceDecorator":{"shape":"None","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"targetDecorator":{"shape":"OpenArrow","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"#000000","strokeWidth":2,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"cornerRadius":0,"wrapper":{"actualSize":{"width":120,"height":105},"offsetX":2490,"offsetY":252.5},"fixedUserHandles":[],"visible":true,"flipMode":"All","tooltip":{"openOn":"Auto","content":""},"connectionPadding":0,"bridgeSpace":10,"maxSegmentThumb":null,"hitPadding":10,"allowNodeOverlap":false,"parentId":""},{"shape":{"type":"Bpmn","sequence":"Normal","flow":"Association","association":"Directional"},"type":"Orthogonal","sourceID":"Data_ObjectZDkTR","sourcePoint":{"x":210,"y":400},"targetPoint":{"x":350,"y":451},"id":"connectorH70v1","targetID":"Taskn4NDV","zIndex":45,"style":{"strokeWidth":2,"strokeColor":"#000000","fill":"transparent","strokeDashArray":"2 2","opacity":1,"gradient":{"type":"None"}},"annotations":[],"constraints":470910,"segments":[{"type":"Orthogonal","direction":null,"length":null,"allowDrag":true}],"sourcePortID":"","targetPortID":"","connectorSpacing":13,"sourcePadding":0,"targetPadding":0,"sourceDecorator":{"shape":"None","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"targetDecorator":{"shape":"OpenArrow","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"#000000","strokeWidth":2,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"cornerRadius":0,"wrapper":{"actualSize":{"width":140,"height":51},"offsetX":280,"offsetY":425.5},"fixedUserHandles":[],"visible":true,"flipMode":"All","tooltip":{"openOn":"Auto","content":""},"connectionPadding":0,"bridgeSpace":10,"maxSegmentThumb":null,"hitPadding":10,"parentId":""},{"shape":{"type":"Bpmn","sequence":"Normal","flow":"Sequence"},"type":"Orthogonal","sourceID":"TaskP0QPy","sourcePoint":{"x":1031,"y":640},"targetPoint":{"x":2870,"y":507.4},"id":"connectorDJWT5","targetID":"Gatewayi1iQr","zIndex":54,"style":{"strokeWidth":2,"strokeColor":"#000000","fill":"transparent","strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"annotations":[{"id":"OdQEc","content":"","annotationType":"String","constraints":4,"visibility":true,"rotateAngle":0,"horizontalAlignment":"Center","verticalAlignment":"Center","margin":{"left":0,"right":0,"top":0,"bottom":0},"style":{"strokeWidth":0,"strokeColor":"transparent","fill":"White","strokeDashArray":"","opacity":1,"gradient":{"type":"None"},"fontSize":12,"fontFamily":"Arial","textOverflow":"Wrap","textDecoration":"None","whiteSpace":"CollapseSpace","textWrapping":"WrapWithOverflow","textAlign":"Center","color":"black","italic":false,"bold":false},"offset":0.5,"alignment":"Center","segmentAngle":false}],"constraints":470910,"segments":[{"type":"Orthogonal","direction":"Right","length":1839,"allowDrag":true},{"type":"Orthogonal","direction":null,"allowDrag":true,"length":null}],"sourcePortID":"","targetPortID":"","connectorSpacing":13,"sourcePadding":0,"targetPadding":0,"sourceDecorator":{"shape":"None","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"targetDecorator":{"shape":"Arrow","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"#000000","strokeWidth":2,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"cornerRadius":0,"wrapper":{"actualSize":{"width":1839,"height":132.60000000000002},"offsetX":1950.5,"offsetY":573.7},"fixedUserHandles":[],"visible":true,"flipMode":"All","tooltip":{"openOn":"Auto","content":""},"connectionPadding":0,"bridgeSpace":10,"maxSegmentThumb":null,"hitPadding":10,"allowNodeOverlap":false,"parentId":""},{"shape":{"type":"Bpmn","sequence":"Normal","flow":"Sequence"},"type":"Orthogonal","sourceID":"Gatewayi1iQr","sourcePoint":{"x":2900,"y":480},"targetPoint":{"x":3010.14,"y":480},"id":"connectoraasqK","targetID":"End_EventS9ib1QEEfC","zIndex":55,"style":{"strokeWidth":2,"strokeColor":"#000000","fill":"transparent","strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"annotations":[],"constraints":470910,"segments":[{"type":"Orthogonal","direction":null,"length":null,"allowDrag":true}],"sourcePortID":"","targetPortID":"","connectorSpacing":13,"sourcePadding":0,"targetPadding":0,"sourceDecorator":{"shape":"None","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"targetDecorator":{"shape":"Arrow","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"#000000","strokeWidth":2,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"cornerRadius":0,"wrapper":{"actualSize":{"width":110.13999999999987,"height":0},"offsetX":2955.0699999999997,"offsetY":480},"fixedUserHandles":[],"visible":true,"flipMode":"All","tooltip":{"openOn":"Auto","content":""},"connectionPadding":0,"bridgeSpace":10,"maxSegmentThumb":null,"hitPadding":10,"parentId":""},{"shape":{"type":"Bpmn","sequence":"Normal","flow":"Association","association":"Default"},"type":"Orthogonal","sourceID":"Data_ObjectcZ5fTKOX8B","sourcePoint":{"x":960,"y":200},"targetPoint":{"x":960,"y":310},"id":"connectorK0AHO","targetID":"TaskeW8VJ","zIndex":60,"style":{"strokeWidth":2,"strokeColor":"#000000","fill":"transparent","strokeDashArray":"2 2","opacity":1,"gradient":{"type":"None"}},"annotations":[],"constraints":470910,"segments":[{"type":"Orthogonal","direction":null,"length":null,"allowDrag":true}],"sourcePortID":"","targetPortID":"","connectorSpacing":13,"sourcePadding":0,"targetPadding":0,"sourceDecorator":{"shape":"None","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"targetDecorator":{"shape":"None","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"#000000","strokeWidth":2,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"cornerRadius":0,"wrapper":{"actualSize":{"width":0,"height":110},"offsetX":960,"offsetY":255},"fixedUserHandles":[],"visible":true,"flipMode":"All","tooltip":{"openOn":"Auto","content":""},"connectionPadding":0,"bridgeSpace":10,"maxSegmentThumb":null,"hitPadding":10,"parentId":""},{"shape":{"type":"Bpmn","sequence":"Normal","flow":"Sequence"},"type":"Orthogonal","sourceID":"TaskeW8VJ","sourcePoint":{"x":1030,"y":355},"targetPoint":{"x":1240,"y":355},"id":"connectorHxn1I","targetID":"TaskqKla4","zIndex":63,"style":{"strokeWidth":2,"strokeColor":"#000000","fill":"transparent","strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"annotations":[],"constraints":470910,"segments":[{"type":"Orthogonal","direction":null,"length":null,"allowDrag":true}],"sourcePortID":"","targetPortID":"","connectorSpacing":13,"sourcePadding":0,"targetPadding":0,"sourceDecorator":{"shape":"None","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"targetDecorator":{"shape":"Arrow","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"#000000","strokeWidth":2,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"cornerRadius":0,"wrapper":{"actualSize":{"width":210,"height":0},"offsetX":1135,"offsetY":355},"fixedUserHandles":[],"visible":true,"flipMode":"All","tooltip":{"openOn":"Auto","content":""},"connectionPadding":0,"bridgeSpace":10,"maxSegmentThumb":null,"hitPadding":10,"parentId":""},{"shape":{"type":"Bpmn","sequence":"Normal","flow":"Association","association":"Directional"},"type":"Orthogonal","sourceID":"Data_ObjectcZ5fT","sourcePoint":{"x":1130,"y":200},"targetPoint":{"x":1310,"y":305},"id":"connectorZNFg8","targetID":"TaskqKla4","zIndex":65,"style":{"strokeWidth":2,"strokeColor":"#000000","fill":"transparent","strokeDashArray":"2 2","opacity":1,"gradient":{"type":"None"}},"annotations":[],"constraints":470910,"segments":[{"type":"Orthogonal","length":60,"direction":"Bottom","allowDrag":true},{"type":"Orthogonal","direction":null,"allowDrag":true,"length":null}],"sourcePortID":"","targetPortID":"","connectorSpacing":13,"sourcePadding":0,"targetPadding":0,"sourceDecorator":{"shape":"None","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"targetDecorator":{"shape":"OpenArrow","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"#000000","strokeWidth":2,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"cornerRadius":0,"wrapper":{"actualSize":{"width":180,"height":105},"offsetX":1220,"offsetY":252.5},"fixedUserHandles":[],"visible":true,"flipMode":"All","tooltip":{"openOn":"Auto","content":""},"connectionPadding":0,"bridgeSpace":10,"maxSegmentThumb":null,"hitPadding":10,"allowNodeOverlap":false,"parentId":""},{"shape":{"type":"Bpmn","sequence":"Normal","flow":"Association","association":"Directional"},"type":"Orthogonal","sourceID":"TaskeW8VJ","sourcePoint":{"x":960,"y":310},"targetPoint":{"x":1130,"y":200},"id":"connectorJdaD6","targetID":"Data_ObjectcZ5fT","zIndex":22,"style":{"strokeWidth":2,"strokeColor":"#000000","fill":"transparent","strokeDashArray":"2 2","opacity":1,"gradient":{"type":"None"}},"annotations":[],"constraints":470910,"segments":[{"type":"Orthogonal","length":50,"direction":"Top","allowDrag":true},{"type":"Orthogonal","direction":null,"allowDrag":true,"length":null}],"sourcePortID":"","targetPortID":"","connectorSpacing":13,"sourcePadding":0,"targetPadding":0,"sourceDecorator":{"shape":"None","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"targetDecorator":{"shape":"OpenArrow","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"#000000","strokeWidth":2,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"cornerRadius":0,"wrapper":{"actualSize":{"width":170,"height":110},"offsetX":1045,"offsetY":255},"fixedUserHandles":[],"visible":true,"flipMode":"All","tooltip":{"openOn":"Auto","content":""},"connectionPadding":0,"bridgeSpace":10,"maxSegmentThumb":null,"hitPadding":10,"allowNodeOverlap":false,"parentId":""},{"shape":{"type":"Bpmn","sequence":"Normal","flow":"Sequence"},"type":"Orthogonal","sourceID":"TaskqKla4","sourcePoint":{"x":1380,"y":355},"targetPoint":{"x":1440,"y":355},"id":"connectorxyoW9","targetID":"TaskqKla4TfIVX","zIndex":69,"style":{"strokeWidth":2,"strokeColor":"#000000","fill":"transparent","strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"annotations":[],"constraints":470910,"segments":[{"type":"Orthogonal","direction":null,"length":null,"allowDrag":true}],"sourcePortID":"","targetPortID":"","connectorSpacing":13,"sourcePadding":0,"targetPadding":0,"sourceDecorator":{"shape":"None","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"targetDecorator":{"shape":"Arrow","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"#000000","strokeWidth":2,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"cornerRadius":0,"wrapper":{"actualSize":{"width":60,"height":0},"offsetX":1410,"offsetY":355},"fixedUserHandles":[],"visible":true,"flipMode":"All","tooltip":{"openOn":"Auto","content":""},"connectionPadding":0,"bridgeSpace":10,"maxSegmentThumb":null,"hitPadding":10,"parentId":""},{"shape":{"type":"Bpmn","sequence":"Normal","flow":"Sequence"},"type":"Orthogonal","sourceID":"TaskqKla4TfIVX","sourcePoint":{"x":1580,"y":355},"targetPoint":{"x":1760.14,"y":355},"id":"connectorlBFvm","targetID":"Intermediate_EventFkC0k","zIndex":71,"style":{"strokeWidth":2,"strokeColor":"#000000","fill":"transparent","strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"annotations":[],"constraints":470910,"segments":[{"type":"Orthogonal","direction":null,"length":null,"allowDrag":true}],"sourcePortID":"","targetPortID":"","connectorSpacing":13,"sourcePadding":0,"targetPadding":0,"sourceDecorator":{"shape":"None","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"targetDecorator":{"shape":"Arrow","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"#000000","strokeWidth":2,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"cornerRadius":0,"wrapper":{"actualSize":{"width":180.1400000000001,"height":0},"offsetX":1670.0700000000002,"offsetY":355},"fixedUserHandles":[],"visible":true,"flipMode":"All","tooltip":{"openOn":"Auto","content":""},"connectionPadding":0,"bridgeSpace":10,"maxSegmentThumb":null,"hitPadding":10,"parentId":""},{"shape":{"type":"Bpmn","sequence":"Normal","flow":"Sequence"},"type":"Orthogonal","sourceID":"Intermediate_EventFkC0k","sourcePoint":{"x":1809.66,"y":355},"targetPoint":{"x":2020,"y":355},"id":"connectorm58Hf","targetID":"TaskqKla4TfIVXw1p5k","zIndex":72,"style":{"strokeWidth":2,"strokeColor":"#000000","fill":"transparent","strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"annotations":[],"constraints":470910,"segments":[{"type":"Orthogonal","direction":null,"length":null,"allowDrag":true}],"sourcePortID":"","targetPortID":"","connectorSpacing":13,"sourcePadding":0,"targetPadding":0,"sourceDecorator":{"shape":"None","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"targetDecorator":{"shape":"Arrow","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"#000000","strokeWidth":2,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"cornerRadius":0,"wrapper":{"actualSize":{"width":210.33999999999992,"height":0},"offsetX":1914.83,"offsetY":355},"fixedUserHandles":[],"visible":true,"flipMode":"All","tooltip":{"openOn":"Auto","content":""},"connectionPadding":0,"bridgeSpace":10,"maxSegmentThumb":null,"hitPadding":10,"parentId":""},{"shape":{"type":"Bpmn","sequence":"Normal","flow":"Association","association":"Directional"},"type":"Orthogonal","sourceID":"Intermediate_EventFkC0k","sourcePoint":{"x":1785,"y":330.25},"targetPoint":{"x":1950,"y":200},"id":"connectorkpMtb","targetID":"Data_ObjectcZ5fTKk3hQ","zIndex":75,"style":{"strokeWidth":2,"strokeColor":"#000000","fill":"transparent","strokeDashArray":"2 2","opacity":1,"gradient":{"type":"None"}},"annotations":[],"constraints":470910,"segments":[{"type":"Orthogonal","length":70.25,"direction":"Top","allowDrag":true},{"type":"Orthogonal","direction":null,"allowDrag":true,"length":null}],"sourcePortID":"","targetPortID":"","connectorSpacing":13,"sourcePadding":0,"targetPadding":0,"sourceDecorator":{"shape":"None","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"targetDecorator":{"shape":"OpenArrow","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"#000000","strokeWidth":2,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"cornerRadius":0,"wrapper":{"actualSize":{"width":165,"height":130.25},"offsetX":1867.5,"offsetY":265.125},"fixedUserHandles":[],"visible":true,"flipMode":"All","tooltip":{"openOn":"Auto","content":""},"connectionPadding":0,"bridgeSpace":10,"maxSegmentThumb":null,"hitPadding":10,"allowNodeOverlap":false,"parentId":""},{"shape":{"type":"Bpmn","sequence":"Normal","flow":"Association","association":"Directional"},"type":"Orthogonal","sourceID":"Data_ObjectcZ5fTKk3hQ","sourcePoint":{"x":1950,"y":200},"targetPoint":{"x":2090,"y":305},"id":"connectorhsOpM","targetID":"TaskqKla4TfIVXw1p5k","zIndex":76,"style":{"strokeWidth":2,"strokeColor":"#000000","fill":"transparent","strokeDashArray":"2 2","opacity":1,"gradient":{"type":"None"}},"annotations":[],"constraints":470910,"segments":[{"type":"Orthogonal","length":60,"direction":"Bottom","allowDrag":true},{"type":"Orthogonal","direction":null,"allowDrag":true,"length":null}],"sourcePortID":"","targetPortID":"","connectorSpacing":13,"sourcePadding":0,"targetPadding":0,"sourceDecorator":{"shape":"None","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"targetDecorator":{"shape":"OpenArrow","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"#000000","strokeWidth":2,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"cornerRadius":0,"wrapper":{"actualSize":{"width":140,"height":105},"offsetX":2020,"offsetY":252.5},"fixedUserHandles":[],"visible":true,"flipMode":"All","tooltip":{"openOn":"Auto","content":""},"connectionPadding":0,"bridgeSpace":10,"maxSegmentThumb":null,"hitPadding":10,"allowNodeOverlap":false,"parentId":""},{"shape":{"type":"Bpmn","sequence":"Normal","flow":"Sequence"},"type":"Orthogonal","sourceID":"TaskqKla4TfIVXw1p5k","sourcePoint":{"x":2160,"y":355},"targetPoint":{"x":2360,"y":355},"id":"connectorkB4mc","targetID":"Tasku4sokLHKk2HrSrL","zIndex":77,"style":{"strokeWidth":2,"strokeColor":"#000000","fill":"transparent","strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"annotations":[],"constraints":470910,"segments":[{"type":"Orthogonal","direction":null,"length":null,"allowDrag":true}],"sourcePortID":"","targetPortID":"","connectorSpacing":13,"sourcePadding":0,"targetPadding":0,"sourceDecorator":{"shape":"None","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"targetDecorator":{"shape":"Arrow","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"#000000","strokeWidth":2,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"cornerRadius":0,"wrapper":{"actualSize":{"width":200,"height":0},"offsetX":2260,"offsetY":355},"fixedUserHandles":[],"visible":true,"flipMode":"All","tooltip":{"openOn":"Auto","content":""},"connectionPadding":0,"bridgeSpace":10,"maxSegmentThumb":null,"hitPadding":10,"parentId":""},{"shape":{"type":"Bpmn","sequence":"Normal","flow":"Sequence"},"type":"Orthogonal","sourceID":"Tasku4sokLHKk2HrSrL","sourcePoint":{"x":2500,"y":355},"targetPoint":{"x":2600,"y":355},"id":"connectorReDDb","targetID":"Tasku4sokLHKk2HrSrLSvLov","zIndex":79,"style":{"strokeWidth":2,"strokeColor":"#000000","fill":"transparent","strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"annotations":[],"constraints":470910,"segments":[{"type":"Orthogonal","direction":null,"length":null,"allowDrag":true}],"sourcePortID":"","targetPortID":"","connectorSpacing":13,"sourcePadding":0,"targetPadding":0,"sourceDecorator":{"shape":"None","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"targetDecorator":{"shape":"Arrow","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"#000000","strokeWidth":2,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"cornerRadius":0,"wrapper":{"actualSize":{"width":100,"height":0},"offsetX":2550,"offsetY":355},"fixedUserHandles":[],"visible":true,"flipMode":"All","tooltip":{"openOn":"Auto","content":""},"connectionPadding":0,"bridgeSpace":10,"maxSegmentThumb":null,"hitPadding":10,"parentId":""},{"shape":{"type":"Bpmn","sequence":"Normal","flow":"Association","association":"Directional"},"type":"Orthogonal","sourceID":"Data_ObjectcZ5fTGKCXTa652oiybxn","sourcePoint":{"x":2550,"y":200},"targetPoint":{"x":2670,"y":305},"id":"connectoriTJsS","targetID":"Tasku4sokLHKk2HrSrLSvLov","zIndex":80,"style":{"strokeWidth":2,"strokeColor":"#000000","fill":"transparent","strokeDashArray":"2 2","opacity":1,"gradient":{"type":"None"}},"annotations":[],"constraints":470910,"segments":[{"type":"Orthogonal","length":60,"direction":"Bottom","allowDrag":true},{"type":"Orthogonal","direction":null,"length":null,"allowDrag":true}],"sourcePortID":"","targetPortID":"","connectorSpacing":13,"sourcePadding":0,"targetPadding":0,"sourceDecorator":{"shape":"None","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"targetDecorator":{"shape":"OpenArrow","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"#000000","strokeWidth":2,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"cornerRadius":0,"wrapper":{"actualSize":{"width":120,"height":105},"offsetX":2610,"offsetY":252.5},"fixedUserHandles":[],"visible":true,"flipMode":"All","tooltip":{"openOn":"Auto","content":""},"connectionPadding":0,"bridgeSpace":10,"maxSegmentThumb":null,"hitPadding":10,"allowNodeOverlap":false,"parentId":""},{"shape":{"type":"Bpmn","sequence":"Normal","flow":"Sequence"},"type":"Orthogonal","sourceID":"Tasku4sokLHKk2HrSrLSvLov","sourcePoint":{"x":2740,"y":355},"targetPoint":{"x":2870,"y":452.8},"id":"connectoryEKZw","targetID":"Gatewayi1iQr","zIndex":82,"style":{"strokeWidth":2,"strokeColor":"#000000","fill":"transparent","strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"annotations":[],"constraints":470910,"segments":[{"type":"Orthogonal","direction":"Right","length":130,"allowDrag":true},{"type":"Orthogonal","direction":null,"length":null,"allowDrag":true}],"sourcePortID":"","targetPortID":"","connectorSpacing":13,"sourcePadding":0,"targetPadding":0,"sourceDecorator":{"shape":"None","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"targetDecorator":{"shape":"Arrow","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"#000000","strokeWidth":2,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"cornerRadius":0,"wrapper":{"actualSize":{"width":130,"height":97.80000000000001},"offsetX":2805,"offsetY":403.9},"fixedUserHandles":[],"visible":true,"flipMode":"All","tooltip":{"openOn":"Auto","content":""},"connectionPadding":0,"bridgeSpace":10,"maxSegmentThumb":null,"hitPadding":10,"allowNodeOverlap":false,"parentId":""}],"basicElements":[],"tooltip":{"content":""},"tool":3,"customCursor":[],"bridgeDirection":"Top","diagramSettings":{"inversedAlignment":true},"version":17.1};
            diagram.loadDiagram(savedata);
            let element = document.getElementById("overview_canvasvisibleleft");
            let x = element.getAttribute("x");
            let y = element.getAttribute("y");
            console.log(x);
            console.log(y);
            expect(element && Number(x) === 10.915472182485976  || Number(y) === 173.44462679296336 ).toBe(true);
            done();
        });
    });
});