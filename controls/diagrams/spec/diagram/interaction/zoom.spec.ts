import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { ConnectorModel } from '../../../src/diagram/objects/connector-model';
import { NodeModel } from '../../../src/diagram/objects/node-model';
import { MouseEvents } from './mouseevents.spec';
import { DiagramTools, Rect } from '../../../src/diagram/index';


/**
 * Zooming spec
 */
describe('Diagram Control', () => {
    describe('Programmatical zooming', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let selArray: (NodeModel | ConnectorModel)[] = [];
            let node: NodeModel = { id: 'node1', width: 100, height: 100, offsetX: 500, offsetY: 400 };
            diagram = new Diagram({
                width: '1000px', height: '500px', nodes: [node],
                pageSettings: { width: 1000, height: 1000 }
            });
            diagram.appendTo('#diagram');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking Single selection for node for pivot 0.5', (done: Function) => {
            diagram.zoom(1.2);
            expect(diagram.scroller.horizontalOffset == -100 && diagram.scroller.verticalOffset == -50).toBe(true);
            diagram.zoom(0.8);
            expect(diagram.scroller.horizontalOffset == 20 && diagram.scroller.verticalOffset == 10).toBe(true);
            done();
        });

        it('Checking interactive zooming', (done: Function) => {
            let events: MouseEvents = new MouseEvents();
            diagram.scrollChange = (args) => {
                done();
            }
            events.mouseWheelEvent(document.getElementById('diagramcontent'), 500, 250, true);
            expect(diagram.scroller.currentZoom).toBe(0.8);
            expect(diagram.scroller.horizontalOffset == 98.67 && diagram.scroller.verticalOffset == 48.67).toBe(true);
            done();
        });

        it('Checking interactive panning', (done: Function) => {
            diagram.tool = DiagramTools.ZoomPan;
            let events: MouseEvents = new MouseEvents();
            events.dragAndDropEvent(document.getElementById('diagramcontent'), 400, 300, 400, 200);
            expect(diagram.scroller.horizontalOffset == 98.67 && diagram.scroller.verticalOffset == -51.33).toBe(true);
            done();
        });

        it('Checking zooming based on zoomTo method', (done: Function) => {
            diagram.zoomTo({ type: 'ZoomIn', zoomFactor: 0.5 });
            expect(Number(diagram.scroller.currentZoom.toFixed(2))).toBe(1.20);
            expect(Math.round(diagram.scroller.horizontalOffset) == -101 &&
                Math.round(diagram.scroller.verticalOffset) == -151).toBe(true);
            done();
        });

        it('Checking pinch zooming', (done: Function) => {
            let content: HTMLElement = document.getElementById('diagramcontent');
            let events: MouseEvents = new MouseEvents();
            let args = events.onTouchStart(content, 408, 189, 304, 289, 304, 289);
            args['preventDefault'] = () => { };
            diagram['eventHandler'].mouseDown(<PointerEvent>args);
            args = events.onTouchMove(content, 528, 389, 254, 289, 254, 189);
            args['preventDefault'] = () => { };
            diagram['eventHandler'].mouseMove(<PointerEvent>args, null);
            args = events.onTouchMove(content, 548, 129, 204, 289, 204, 289);
            args['preventDefault'] = () => { };
            diagram['eventHandler'].mouseMove(<PointerEvent>args, null);
            expect(Math.round(diagram.scroller.currentZoom)).toBe(3);
            expect((Math.round(diagram.scroller.horizontalOffset) == -585 || Math.round(diagram.scroller.horizontalOffset) == -586)
                && Math.round(diagram.scroller.verticalOffset) == -855 || Math.round(diagram.scroller.verticalOffset) == -856).toBe(true)
            diagram.scroller.updateScrollOffsets(0, 0);
            done();
        });


        it('Checking interactive scrolling', (done: Function) => {
            let events: MouseEvents = new MouseEvents();
            diagram.scrollChange = (args) => {
                done();
            };
            diagram.scrollSettings.horizontalOffset = 0;
            diagram.dataBind();
            events.mouseWheelEvent(document.getElementById('diagramcontent'), 500, 250, false, true);
            expect(diagram.scroller.horizontalOffset == -20).toBe(true);
            done();
        });


        it('Checking reset option', (done: Function) => {
            diagram.reset();
            expect(diagram.scroller.horizontalOffset == 0 && diagram.scroller.verticalOffset == 0
                && diagram.scroller.currentZoom == 1).toBe(true);
            done();
        });
    });

    describe('Scroll Limit', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        let node: NodeModel = { id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100 };
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let selArray: (NodeModel | ConnectorModel)[] = [];
            diagram = new Diagram({
                width: '1000px', height: '500px',
                pageSettings: { width: 500, height: 500 }
            });
            diagram.appendTo('#diagram');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking Inifinite scrolling', (done: Function) => {
            expect(diagram.scrollSettings.scrollLimit == 'Diagram').toBe(true);
            diagram.scrollSettings.scrollLimit = 'Infinity';
            let events: MouseEvents = new MouseEvents();
            events.mouseWheelEvent(document.getElementById('diagramcontent'), 500, 250, false);
            expect(diagram.scroller.horizontalOffset == 0 && diagram.scroller.verticalOffset == -20).toBe(true);
            events.mouseWheelEvent(document.getElementById('diagramcontent'), 500, 250, false);
            expect(diagram.scroller.horizontalOffset == 0 && diagram.scroller.verticalOffset == -40).toBe(true);
            events.mouseWheelEvent(document.getElementById('diagramcontent'), 500, 250, false);
            expect(diagram.scroller.horizontalOffset == 0 && diagram.scroller.verticalOffset == -60).toBe(true);
            done();
            //add an empty diagram, scroll it using mouse wheel by more than 2 times
        });

        it('Checking diagram scrolling with empty diagram', (done: Function) => {
            diagram.scrollSettings.scrollLimit = 'Diagram';
            diagram.scrollSettings.verticalOffset = 0;
            diagram.dataBind();
            let events: MouseEvents = new MouseEvents();
            events.mouseWheelEvent(document.getElementById('diagramcontent'), 500, 250, false);
            //add an empty diagram, scroll it using mouse wheel by more than 2 times
            expect(diagram.scroller.horizontalOffset == 0 && diagram.scroller.verticalOffset == 0).toBe(true);
            done();
        });

        it('Checking diagram scrolling with smaller diagram', (done: Function) => {
            diagram.add(node);
            diagram.scrollSettings.horizontalOffset = 500;

            diagram.dataBind();
            expect(diagram.scroller.horizontalOffset == 500).toBe(true);
            diagram.scrollSettings.horizontalOffset = 1500;

            diagram.dataBind();
            expect(diagram.scroller.horizontalOffset == 500).toBe(true);

            done();
        });

        it('Checking diagram scrolling with larger diagram', (done: Function) => {

            diagram.pageSettings.multiplePage = true;
            diagram.scrollSettings.horizontalOffset = 0;
            diagram.dataBind();

            diagram.add({ id: 'node2', offsetX: 1000, offsetY: 1000, width: 100, height: 100 });

            expect(diagram.scroller.horizontalOffset == 0).toBe(true);
            diagram.scrollSettings.horizontalOffset = 500;
            diagram.dataBind();
            expect(diagram.scroller.horizontalOffset == 0).toBe(true);
            diagram.scrollSettings.horizontalOffset = -500;
            diagram.dataBind();
            expect(diagram.scroller.horizontalOffset == -500).toBe(true);
            diagram.scrollSettings.horizontalOffset = -1000;
            diagram.dataBind();
            expect(Math.round(diagram.scroller.horizontalOffset) == -517 || Math.round(diagram.scroller.horizontalOffset) == -515 ||
                Math.round(diagram.scroller.horizontalOffset) == -526).toBe(true);
            diagram.scrollSettings.horizontalOffset = -3000;
            diagram.dataBind();
            expect(Math.round(diagram.scroller.horizontalOffset) == -517 || Math.round(diagram.scroller.horizontalOffset) == -515 ||
                Math.round(diagram.scroller.horizontalOffset) == -526).toBe(true);
            done();
        });

        it('Checking diagram scrolling with negative area', (done: Function) => {
            diagram.scrollSettings.horizontalOffset = 0;
            diagram.dataBind();
            diagram.nodes[0].offsetX = -200;
            diagram.nodes[0].offsetY = 200;
            diagram.scrollSettings.horizontalOffset = 1000;
            diagram.dataBind();
            expect(diagram.scroller.horizontalOffset == 500).toBe(true);

            done();
        });

        it('Checking limited scrolling', (done: Function) => {
            diagram.scrollSettings.horizontalOffset = 0;
            diagram.scrollSettings.scrollLimit = 'Limited';
            diagram.scrollSettings.scrollableArea = new Rect(0, 0, 300, 300);
            diagram.dataBind();
            // expect(diagram.scroller.horizontalOffset == 0).toBe(true);
            // diagram.scrollSettings.horizontalOffset = 500;
            // diagram.dataBind();
            // expect(diagram.scroller.horizontalOffset == 0).toBe(true);
            // diagram.scrollSettings.horizontalOffset = -500;
            // diagram.dataBind();
            // expect(diagram.scroller.horizontalOffset == -300).toBe(true);
            // diagram.scrollSettings.verticalOffset = -500;
            // diagram.dataBind();
            // expect(diagram.scroller.horizontalOffset == -300).toBe(true);

            done();
        });
    });
});