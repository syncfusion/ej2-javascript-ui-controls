import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { DiagramTools } from '../../../src/diagram/enum/enum';
import { ConnectorModel } from '../../../src/diagram/objects/connector-model';
import { NodeModel } from '../../../src/diagram/objects/node-model';
import { DiagramScroller } from '../../../src/diagram/interaction/scroller';
import { Rect } from '../../../src/index';
import { MouseEvents } from '../../../spec/diagram/interaction/mouseevents.spec';
/**
 * PageSettings Spec
 */
describe('PageSettings', () => {

    describe('Page Settings', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let scroller: DiagramScroller;

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let connector: ConnectorModel = {
                id: 'connector1', sourcePoint: { x: 300, y: 400 }, targetPoint: { x: 500, y: 500 }
            };
            let node: NodeModel = {
                id: 'node1', width: 150, height: 100, offsetX: 100, offsetY: 100,
            };
            let node2: NodeModel = {
                id: 'node2', width: 80, height: 130, offsetX: 200, offsetY: 200,
            };
            let node3: NodeModel = {
                id: 'node3', width: 100, height: 75, offsetX: 300, offsetY: 350,
            };
            diagram = new Diagram({
                width: '1200px', height: '1600px', nodes: [node, node2, node3], connectors: [connector],
                pageSettings: {
                    orientation: 'Landscape',
                    background: { color: 'blue' }
                }
            });
            diagram.appendTo('#diagram');

        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Page Settings with orientation Horizontal', (done: Function) => {
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.left === 25 && bounds.right === 502 && bounds.top === 50 && bounds.bottom === 504).toBe(true);
            done();
        });
        it('Page Settings with height and width', (done: Function) => {
            diagram.pageSettings.height = 300;
            diagram.pageSettings.width = 500;
            diagram.pageSettings.background.color = 'red';
            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.left === 25 && bounds.right === 502 && bounds.top === 50 && bounds.bottom === 504).toBe(true);
            done();
        });

        it('Page Settings with orientation Portrait', (done: Function) => {
            diagram.pageSettings.orientation = 'Portrait';
            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.left === 25 && bounds.right === 502 && bounds.top === 50 && bounds.bottom === 504).toBe(true);
            done();
        });

        it('Page Settings with Pagebreaks', (done: Function) => {
            diagram.pageSettings.showPageBreaks = true;
            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.left === 25 && bounds.right === 502 && bounds.top === 50 && bounds.bottom === 504).toBe(true);
            done();
        });
        it('Page Settings with Multiple Page', (done: Function) => {
            diagram.pageSettings.multiplePage = true;
            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.left === 25 && bounds.right === 502 && bounds.top === 50 && bounds.bottom === 504).toBe(true);
            done();
        });
        it('Page Settings with height and width with Horizontal', (done: Function) => {
            diagram.pageSettings.height = 500;
            diagram.pageSettings.width = 300;
            diagram.pageSettings.orientation = 'Landscape';
            diagram.nodes[0].offsetX = -100; diagram.nodes[0].offsetY = -100;
            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.left === -175 && bounds.right === 502 && bounds.top === -150 && bounds.bottom === 504).toBe(true);
            done();
        });
        it('Checking swapping based on orientation', (done: Function) => {
            diagram.pageSettings.multiplePage = false;
            diagram.pageSettings.width = 300;
            diagram.pageSettings.height = 600;
            diagram.pageSettings.orientation = 'Landscape';
            diagram.dataBind();
            expect(diagram.pageSettings.width === 600 && diagram.pageSettings.height == 300).toBe(true);
            done();
        });
    });
});

describe('PageSettings boundary constraints', () => {

    describe('Page Settings with orientation', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let scroller: DiagramScroller;
        let mouseEvents: MouseEvents = new MouseEvents();
        beforeAll((): void => {

            ele = createElement('div', { id: 'diagramconstraints' });
            document.body.appendChild(ele);
            let connector: ConnectorModel = {
                id: 'connector1', sourcePoint: { x: 300, y: 400 }, targetPoint: { x: 500, y: 500 }
            };
            let node: NodeModel = {
                id: 'node1', width: 150, height: 100, offsetX: 100, offsetY: 100,
            };
            let node2: NodeModel = {
                id: 'node2', width: 80, height: 130, offsetX: 200, offsetY: 200,
            };
            let node3: NodeModel = {
                id: 'node3', width: 100, height: 75, offsetX: 300, offsetY: 350,
            };
            let node4: NodeModel = {
                id: 'node4', width: 100, height: 75, offsetX: 700, offsetY: 750,
            };
            diagram = new Diagram({
                width: 800, height: 800, nodes: [node, node2, node3], connectors: [connector],
                pageSettings: {
                    orientation: 'Landscape',
                    width: 600, height: 500,
                }
            });
            diagram.appendTo('#diagramconstraints');

        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('changing nodes properties   at runtime', (done: Function) => {
            diagram.pageSettings.boundaryConstraints = 'Page';
            diagram.nodes[0].offsetX = 800;
            diagram.nodes[0].offsetY = 800;
            diagram.nodes[0].width = 600;
            diagram.nodes[0].height = 600;
            diagram.nodes[0].rotateAngle = 90;
            diagram.dataBind();
            expect(diagram.nodes[0].offsetX == 100 && diagram.nodes[0].offsetY == 100
                && diagram.nodes[0].width == 150).toBe(true)
            done();
        });
        it('changing connector properties  at runtime', (done: Function) => {
            diagram.pageSettings.boundaryConstraints = 'Page';
            diagram.connectors[0].targetPoint = { x: 601, y: 100 };
            diagram.connectors[0].sourcePoint = { x: 601, y: 100 };
            diagram.dataBind();
            expect(diagram.connectors[0].sourcePoint.x == 300 && diagram.connectors[0].sourcePoint.y == 400).toBe(true)
            done();
        });
        it('addnode  at runtime', (done: Function) => {
            diagram.pageSettings.boundaryConstraints = 'Page';
            let pathNode: NodeModel = {
                id: 'node11', width: 100, height: 100, offsetX: 700, offsetY: 700,
                style: { fill: 'green' },
                shape: {
                    type: 'Basic', shape: 'Rectangle',
                }, ports: [{ id: 'port', shape: 'Square', offset: { x: 0.5, y: 1 } }]
            };
            diagram.add(pathNode);
            diagram.dataBind();
            expect(diagram.nodes.length === 3).toBe(true)
            done();
        });

        it('boundary constraints for drag ', (done: Function) => {
            diagram.pageSettings.boundaryConstraints = 'Infinity';
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 100, 100);
            mouseEvents.dragAndDropEvent(diagramCanvas, 100, 100, 600, 100);
            expect(diagram.nodes[0].offsetX === 600 || diagram.nodes[0].offsetX === 595).toBe(true);
            mouseEvents.clickEvent(diagramCanvas, 600, 100);
            mouseEvents.dragAndDropEvent(diagramCanvas, 600, 100, 100, 100);
            diagram.pageSettings.boundaryConstraints = 'Page'
            mouseEvents.dragAndDropEvent(diagramCanvas, 100, 100, 600, 100);
            expect(diagram.nodes[0].offsetX != 600).toBe(true);
            diagram.pageSettings.boundaryConstraints = 'Diagram'
            mouseEvents.dragAndDropEvent(diagramCanvas, 100, 100, 800, 100);
            expect(diagram.nodes[0].offsetX != 800).toBe(true);
            done();
        });
        it('boundary constraints for resize', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            diagram.pageSettings.boundaryConstraints = 'Page';
            mouseEvents.dragAndDropEvent(diagramCanvas, 100, 100, 500, 100);
            mouseEvents.dragAndDropEvent(diagramCanvas, 580, 100, 620, 100);
            expect(diagram.selectedItems.nodes[0].wrapper.bounds.right != 615
                || diagram.selectedItems.nodes[0].wrapper.bounds.right != 620).toBe(true);
            done();
        });
        it('boundary constraints for rotate', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            diagram.pageSettings.boundaryConstraints = 'Page';
            mouseEvents.dragAndDropEvent(diagramCanvas, 500, 100, 515, 100);
            mouseEvents.dragAndDropEvent(diagramCanvas, 520, 20, 590, 20);
            expect(diagram.selectedItems.nodes[0].rotateAngle === 0).toBe(true);
            done();
        });

        it('boundary constraints for connector dragging target end ', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            diagram.pageSettings.boundaryConstraints = 'Infinity';
            mouseEvents.clickEvent(diagramCanvas, 400, 450);
            mouseEvents.dragAndDropEvent(diagramCanvas, 500, 500, 600, 600);
            expect(diagram.connectors[0].targetPoint.x === 592 || diagram.connectors[0].targetPoint.x === 600).toBe(true);
            mouseEvents.dragAndDropEvent(diagramCanvas, 600, 600, 500, 500);
            diagram.pageSettings.boundaryConstraints = 'Page';
            mouseEvents.dragAndDropEvent(diagramCanvas, 500, 500, 600, 600);
            expect(diagram.connectors[0].targetPoint.x !== 592).toBe(true);
            done();
        });
        it('boundary constraints for connector dragging source end ', (done: Function) => {
            var diagramCanvas = document.getElementById(diagram.element.id + 'content');
            diagram.pageSettings.boundaryConstraints = 'Infinity';
            mouseEvents.dragAndDropEvent(diagramCanvas, 300, 400, 320, 520);
            expect(diagram.connectors[0].sourcePoint.y === 520).toBe(true);
            mouseEvents.dragAndDropEvent(diagramCanvas, 320, 520, 320, 400);
            diagram.pageSettings.boundaryConstraints = 'Page';
            mouseEvents.dragAndDropEvent(diagramCanvas, 320, 400, 320, 520);
            expect(diagram.connectors[0].targetPoint.x != 522).toBe(true);
            done();
        });

        it('Draw Simple Shape for ', (done: Function) => {
            diagram.tool = DiagramTools.ContinuousDraw
            diagram.pageSettings.boundaryConstraints = 'Infinity';
            diagram.drawingObject = { id: 'node11', shape: { type: 'Basic', shape: 'Rectangle' } };
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.dragAndDropEvent(diagramCanvas, 500, 200, 610, 300);
            let drawElement: HTMLElement = document.getElementById('node11');
            expect(diagram.nodes[3].width === 110).toBe(true);
            diagram.pageSettings.boundaryConstraints = 'Page';
            diagram.drawingObject = { id: 'node12', shape: { type: 'Basic', shape: 'Rectangle' } };
            mouseEvents.dragAndDropEvent(diagramCanvas, 100, 400, 200, 520);
            expect(diagram.nodes.length === 4).toBe(true);
            diagram.pageSettings.boundaryConstraints = 'Infinity';
            diagram.drawingObject = { id: 'node13', shape: { type: 'Basic', shape: 'Rectangle' } };
            mouseEvents.mouseDownEvent(diagramCanvas, 700, 200);
            mouseEvents.mouseUpEvent(diagramCanvas, 700, 200);
            expect(diagram.nodes.length === 4).toBe(true);
            done();
        });

        it('Draw Straight Connector Reverse', (done: Function) => {
            diagram.tool = DiagramTools.ContinuousDraw
            diagram.pageSettings.boundaryConstraints = 'Infinity';
            diagram.drawingObject = { id: 'connector11', type: 'Straight' };
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.dragAndDropEvent(diagramCanvas, 200, 400, 200, 520);
            let drawElement: HTMLElement = document.getElementById('connector1');
            expect(diagram.connectors[1].targetPoint.y === 520).toBe(true);
            diagram.pageSettings.boundaryConstraints = 'Page';
            diagram.drawingObject = { id: 'connector11', type: 'Straight' };
            mouseEvents.dragAndDropEvent(diagramCanvas, 250, 400, 250, 520);
            expect(diagram.connectors[2].targetPoint.y === 400).toBe(true);
            done();
        });
        it('branch coverage for drag', (done: Function) => {
            diagram.pageSettings.boundaryConstraints = 'Page';
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.dragAndDropEvent(diagramCanvas, 200, 200, 300, 200);
            expect(diagram.nodes[2].offsetX === 300).toBe(true);
            done();
        });
    });
});