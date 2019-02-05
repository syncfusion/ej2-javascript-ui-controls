import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../src/diagram/diagram';
import { ConnectorModel } from '../../src/diagram/objects/connector-model';
import { NodeModel } from '../../src/diagram/objects/node-model';
import { DiagramScroller } from '../../src/diagram/interaction/scroller';
import { MouseEvents } from '../../spec/diagram/interaction/mouseevents.spec';
import { Overview } from '../../src/overview/overview';
import { OverviewModel } from '../../src/overview/overview-model';

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

    });
});