import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { ConnectorModel } from '../../../src/diagram/objects/connector-model';
import { NodeModel, PathModel, FlowShapeModel, TextModel } from '../../../src/diagram/objects/node-model';
import { TextStyle } from '../../../src/diagram/core/appearance';
import { PointModel } from '../../../src/diagram/primitives/point-model';
import { Rect } from '../../../src/diagram/primitives/rect';
import { Matrix, transformPointByMatrix, identityMatrix, rotateMatrix } from '../../../src/diagram/primitives/matrix';
import { rotatePoint, cloneObject } from '../../../src/diagram/utility/base-util';
import { MouseEvents } from '../interaction/mouseevents.spec';
import { Node } from '../../../src/diagram/objects/node';
import { Connector } from '../../../src/diagram/objects/connector';
import { UndoRedo } from '../../../src/diagram/objects/undo-redo';
import { HistoryEntry, History } from '../../../src/diagram/diagram/history';
import { SnapConstraints, PointPortModel } from '../../../src/diagram/index';
import { PortConstraints, PortVisibility, ConnectorConstraints, NodeConstraints, DecoratorShapes } from '../../../src/diagram/enum/enum';
Diagram.Inject(UndoRedo);
/**
 * Interaction Specification Document
 */
describe('Diagram Control', () => {

    describe('Undo Redo for node and connector drag', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        let mouseEvents: MouseEvents = new MouseEvents();

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram12' });
            document.body.appendChild(ele);
            let selArray: (NodeModel | ConnectorModel)[] = [];
            let node: NodeModel = { id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100 };

            let connector: ConnectorModel = { id: 'connector1', sourcePoint: { x: 200, y: 200 }, targetPoint: { x: 300, y: 300 } };

            diagram = new Diagram({
                width: '600', height: '530px', nodes: [node],
                connectors: [connector], snapSettings: { constraints: SnapConstraints.ShowLines }
            });

            diagram.appendTo('#diagram12');

        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });


        it('Checking undo for node and connector  select the rubber band selection', (done: Function) => {

            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.dragAndDropEvent(diagramCanvas, 30, 30, 400, 400);

            expect(diagram.selectedItems.connectors.length === 1 && diagram.selectedItems.connectors[0].id === 'connector1' &&
                diagram.selectedItems.nodes.length === 1 && diagram.selectedItems.nodes[0].id === 'node1').toBe(true);
            mouseEvents.dragAndDropEvent(diagramCanvas, 150, 150, 100, 100);
            diagram.undo();
            expect(diagram.selectedItems.nodes[0].offsetX === 100 && diagram.selectedItems.nodes[0].offsetY === 100 &&
                diagram.selectedItems.connectors[0].wrapper.offsetX === 250 && diagram.selectedItems.connectors[0].wrapper.offsetY === 250).toBe(true);
            done();

        });

        it('Checking redo for node and connector  select the rubber band selection', (done: Function) => {
            diagram.redo();
            expect(diagram.selectedItems.nodes[0].offsetX == 50 && diagram.selectedItems.nodes[0].offsetY == 50 &&
                diagram.selectedItems.connectors[0].wrapper.offsetX === 200 && diagram.selectedItems.connectors[0].wrapper.offsetY === 200).toBe(true);
            done();
        });

        it('Checking undo, after redo function for node and connector  drag', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');

            mouseEvents.dragAndDropEvent(diagramCanvas, 50, 50, 400, 400);
            diagram.undo();
            expect(diagram.selectedItems.nodes[0].offsetX == 50 && diagram.selectedItems.nodes[0].offsetY == 50 &&
                diagram.selectedItems.connectors[0].wrapper.offsetX === 200 && diagram.selectedItems.connectors[0].wrapper.offsetY === 200).toBe(true);
            done();
        });


        it('Checking undo for single node dragging', (done: Function) => {

            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');

            mouseEvents.clickEvent(diagramCanvas, 250, 250, true);

            expect(diagram.selectedItems.connectors.length === 0 &&
                diagram.selectedItems.nodes.length === 1 && diagram.selectedItems.nodes[0].id === 'node1').toBe(true);
            mouseEvents.dragAndDropEvent(diagramCanvas, 50, 50, 400, 400);

            diagram.undo();
            expect(diagram.selectedItems.nodes[0].offsetX === 50 && diagram.selectedItems.nodes[0].offsetY === 50).toBe(true);
            done();

        });
        it('Checking redo for single node dragging', (done: Function) => {
            diagram.redo();
            expect(diagram.selectedItems.nodes[0].offsetX === 400 && diagram.selectedItems.nodes[0].offsetY === 400).toBe(true);
            done();
        });
    });

    describe('Testing Undo Redo for Resizing', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        let mouseEvents: MouseEvents = new MouseEvents();

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram4' });
            document.body.appendChild(ele);
            let selArray: (NodeModel | ConnectorModel)[] = [];
            let redoTopLeft1: PointModel
            let node: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 300, offsetY: 300,
                minWidth: 40, maxWidth: 500, minHeight: 40, maxHeight: 500
            };

            let node2: NodeModel = { id: 'node2', width: 100, height: 100, offsetX: 300, offsetY: 500 };


            diagram = new Diagram({
                width: 600, height: '530px', nodes: [node, node2], snapSettings: { constraints: SnapConstraints.ShowLines }

            });

            diagram.appendTo('#diagram4');
            selArray.push(diagram.nodes[0]);
            diagram.select(selArray);
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking undo after single node resizing', (done: Function) => {

            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');

            let offsetLeft: number = diagram.element.offsetLeft;
            let offsetTop: number = diagram.element.offsetTop;

            //increasing size
            let undoTopLeft1: PointModel = (diagram.nodes[0] as NodeModel).wrapper.bounds.topLeft;
            mouseEvents.clickEvent(diagramCanvas, 300, 300);

            mouseEvents.dragAndDropEvent(diagramCanvas, undoTopLeft1.x, undoTopLeft1.y, undoTopLeft1.x - 10, undoTopLeft1.y - 10);
            let redoTopLeft1: PointModel = (diagram.nodes[0] as NodeModel).wrapper.bounds.topLeft;

            diagram.undo();
            expect((diagram.nodes[0] as NodeModel).wrapper.bounds.topLeft.x === undoTopLeft1.x &&
                (diagram.nodes[0] as NodeModel).wrapper.bounds.topLeft.y === undoTopLeft1.y).toBe(true);
            done();
        });

        it('Checking redo  after undo single node resizing', (done: Function) => {
            diagram.redo();
            expect((diagram.nodes[0] as NodeModel).wrapper.bounds.topLeft.x === 240 &&
                (diagram.nodes[0] as NodeModel).wrapper.bounds.topLeft.y === 240).toBe(true);
            done();
        });
    });

    describe('Testing undo Redo Rotation - Multiple selection', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        let mouseEvents: MouseEvents = new MouseEvents();

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram10' });
            document.body.appendChild(ele);
            let selArray: (NodeModel | ConnectorModel)[] = [];
            let node: NodeModel = { id: 'node1', width: 100, height: 100, offsetX: 300, offsetY: 300 };

            let node2: NodeModel = { id: 'node2', width: 100, height: 100, offsetX: 300, offsetY: 500 };

            let connector: ConnectorModel = { id: 'connector1', sourcePoint: { x: 400, y: 400 }, targetPoint: { x: 500, y: 500 } };


            diagram = new Diagram({
                width: 600, height: '530px', nodes: [node, node2],
                connectors: [connector], snapSettings: { constraints: SnapConstraints.ShowLines }
            });

            diagram.appendTo('#diagram10');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking undo after rotation - multiple selection', (done: Function) => {

            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');

            mouseEvents.clickEvent(diagramCanvas, 300, 300, true);

            mouseEvents.clickEvent(diagramCanvas, 300, 500, true);

            mouseEvents.clickEvent(diagramCanvas, 400 + 8, 400 + 8, true);

            let bounds: Rect = diagram.selectedItems.wrapper.bounds;
            let rotator: PointModel = { x: bounds.center.x, y: bounds.y - 30 };

            let matrix: Matrix = identityMatrix();
            rotateMatrix(matrix, 320, bounds.center.x, bounds.center.y);

            let endPoint: PointModel = transformPointByMatrix(matrix, rotator);

            mouseEvents.dragAndDropEvent(diagramCanvas, rotator.x + 8, rotator.y + 8, endPoint.x + 8, endPoint.y + 8);

            diagram.undo();
            expect(diagram.nodes[0].rotateAngle == 0).toBe(true);
            done();
        });
        it('Checking redo after undo rotation - multiple selection', (done: Function) => {
            diagram.redo();
            expect(Math.round(diagram.nodes[0].rotateAngle) == 320).toBe(true);
            done();
        });
    });

    describe('Testing undo redo after resizing - Multiple selection', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        let mouseEvents: MouseEvents = new MouseEvents();

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram11' });
            document.body.appendChild(ele);
            let selArray: (NodeModel | ConnectorModel)[] = [];
            let node: NodeModel = { id: 'node1', width: 100, height: 100, offsetX: 300, offsetY: 300 };

            let node2: NodeModel = { id: 'node2', width: 100, height: 100, offsetX: 300, offsetY: 500 };


            diagram = new Diagram({
                width: '600px', height: '530px', nodes: [node, node2],
                connectors: [{ id: 'connector1', sourcePoint: { x: 400, y: 400 }, targetPoint: { x: 500, y: 500 } }],
                snapSettings: { constraints: SnapConstraints.ShowLines }
            });

            diagram.appendTo('#diagram11');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking undo after resizing - multiple selection', (done: Function) => {

            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');

            mouseEvents.clickEvent(diagramCanvas, 300, 300);
            mouseEvents.clickEvent(diagramCanvas, 300, 500, true);
            mouseEvents.clickEvent(diagramCanvas, 400 + 8, 400 + 8, true);
            let topLeft: PointModel = diagram.selectedItems.wrapper.bounds.bottomRight;
            let width: number = diagram.selectedItems.width;
            let height: number = diagram.selectedItems.height;
            let offsetX: number = diagram.selectedItems.offsetX;
            let offsetY: number = diagram.selectedItems.offsetY;
            mouseEvents.dragAndDropEvent(diagramCanvas, topLeft.x, topLeft.y, topLeft.x + 20, topLeft.y + 20);
            let topLeft1: PointModel = (diagram.nodes[0] as NodeModel).wrapper.bounds.middleRight;
            diagram.undo();
            expect(diagram.selectedItems.width == width && diagram.selectedItems.height == height &&
                diagram.selectedItems.offsetX == offsetX && diagram.selectedItems.offsetY == offsetY).toBe(true);
            done();
        });
        it('Checking redo after undo resizing - multiple selection', (done: Function) => {

            diagram.redo();
            expect(diagram.selectedItems.width == 270 && (Math.round(diagram.selectedItems.height)) == 320 &&
                diagram.selectedItems.offsetX == 385 && (Math.round(diagram.selectedItems.offsetY)) == 410).toBe(true);
            done();
        });
    });


    describe('Undo Redo for Connector End Dragging - source point', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        let mouseEvents: MouseEvents = new MouseEvents();

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagrambab' });
            document.body.appendChild(ele);
            let selArray: (NodeModel | ConnectorModel)[] = [];

            let connector: ConnectorModel = { id: 'connector1', sourcePoint: { x: 200, y: 200 }, targetPoint: { x: 300, y: 300 } };

            diagram = new Diagram({
                width: '600px', height: '530px',
                connectors: [connector], snapSettings: { constraints: SnapConstraints.ShowLines }
            });

            diagram.appendTo('#diagrambab');
            selArray.push(diagram.connectors[0]);
            diagram.select(selArray);
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking undo after sourcePoint dragging', (done: Function) => {

            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let sPointX = diagram.selectedItems.connectors[0].sourcePoint.x;
            let sPointY = diagram.selectedItems.connectors[0].sourcePoint.y;
            let tPointX = diagram.selectedItems.connectors[0].targetPoint.x;
            let tPointY = diagram.selectedItems.connectors[0].targetPoint.y;
            mouseEvents.dragAndDropEvent(diagramCanvas, 200, 200, 180, 180);
            diagram.undo();
            expect(diagram.selectedItems.connectors.length === 1 && diagram.selectedItems.connectors[0].sourcePoint.x === sPointX &&
                diagram.selectedItems.connectors[0].sourcePoint.y === sPointY && diagram.selectedItems.connectors[0].targetPoint.x === tPointX
                && diagram.selectedItems.connectors[0].targetPoint.y === tPointY).toBe(true);
            done();
        });

        it('Checking redo after undo sourcePoint dragging', (done: Function) => {
            diagram.redo();
            expect(diagram.selectedItems.connectors.length === 1 && diagram.selectedItems.connectors[0].sourcePoint.x === 172 &&
                diagram.selectedItems.connectors[0].sourcePoint.y === 172 && diagram.selectedItems.connectors[0].targetPoint.x === 300
                && diagram.selectedItems.connectors[0].targetPoint.y === 300).toBe(true);
            done();
        });
    });

    describe('Undo Redo for Connector End Dragging - target point', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        let mouseEvents: MouseEvents = new MouseEvents();

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagrambac' });
            document.body.appendChild(ele);
            let selArray: (NodeModel | ConnectorModel)[] = [];

            let connector: ConnectorModel = { id: 'connector1', sourcePoint: { x: 200, y: 200 }, targetPoint: { x: 300, y: 300 } };

            diagram = new Diagram({
                width: '600px', height: '530px',
                connectors: [connector], snapSettings: { constraints: SnapConstraints.ShowLines }
            });

            diagram.appendTo('#diagrambac');
            selArray.push(diagram.connectors[0]);
            diagram.select(selArray);
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking undo after targetPoint dragging', (done: Function) => {

            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let sPointX = diagram.selectedItems.connectors[0].sourcePoint.x;
            let sPointY = diagram.selectedItems.connectors[0].sourcePoint.y;
            let tPointX = diagram.selectedItems.connectors[0].targetPoint.x;
            let tPointY = diagram.selectedItems.connectors[0].targetPoint.y;
            mouseEvents.dragAndDropEvent(diagramCanvas, 300, 300, 320, 320);
            diagram.undo();
            expect(diagram.selectedItems.connectors.length === 1 && diagram.selectedItems.connectors[0].sourcePoint.x === sPointX &&
                diagram.selectedItems.connectors[0].sourcePoint.y === sPointY && diagram.selectedItems.connectors[0].targetPoint.x === tPointX
                && diagram.selectedItems.connectors[0].targetPoint.y === tPointY).toBe(true);
            done();
        });

        it('Checking redo after undo the targetPoint dragging', (done: Function) => {
            diagram.redo();
            expect(diagram.selectedItems.connectors.length === 1 && diagram.selectedItems.connectors[0].sourcePoint.x === 200 &&
                diagram.selectedItems.connectors[0].sourcePoint.y === 200 &&
                diagram.selectedItems.connectors[0].targetPoint.x === 312
                && diagram.selectedItems.connectors[0].targetPoint.y === 312).toBe(true);
            done();
        });
    });

    describe('Undo Redo for node dragging - multiple undo', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        let mouseEvents: MouseEvents = new MouseEvents();

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagrambab' });
            document.body.appendChild(ele);
            let selArray: (NodeModel | ConnectorModel)[] = [];
            let node: NodeModel = { id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100 };

            diagram = new Diagram({
                width: 1500, height: 600, nodes: [node], snapSettings: { constraints: SnapConstraints.ShowLines }
            });
            diagram.appendTo('#diagrambab');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking undo after undo and node dragging', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.dragAndDropEvent(diagramCanvas, 100, 100, 200, 100);
            mouseEvents.dragAndDropEvent(diagramCanvas, 200, 100, 300, 100);
            mouseEvents.dragAndDropEvent(diagramCanvas, 300, 100, 400, 100);
            diagram.undo();
            mouseEvents.dragAndDropEvent(diagramCanvas, 300, 100, 300, 200);
            diagram.undo();
            expect(diagram.selectedItems.nodes[0].offsetX == 300 && diagram.selectedItems.nodes[0].offsetY == 100).toBe(true);
            done();
        });
    });
    describe('Undo Redo - Nodes with alignment left', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let connector: ConnectorModel = {
                id: 'connector1', sourcePoint: { x: 400, y: 500 }, targetPoint: { x: 600, y: 500 }
            };
            let node: NodeModel = {
                id: 'node1', width: 130, height: 100, offsetX: 100, offsetY: 100,
                annotations: [{ content: 'Node1', style: { strokeColor: 'black', opacity: 1 } }]
            };
            let node2: NodeModel = {
                id: 'node2', width: 100, height: 100, offsetX: 300, offsetY: 200,
                annotations: [{ content: 'Node2', style: { strokeColor: 'black', opacity: 1 } }]
            };
            let node3: NodeModel = {
                id: 'node3', width: 80, height: 100, offsetX: 200, offsetY: 450,
                annotations: [{ content: 'Node3', style: { strokeColor: 'black', opacity: 1 } }]
            };
            let node4: NodeModel = {
                id: 'node4', width: 150, height: 70, offsetX: 400, offsetY: 350,
                annotations: [{ content: 'Node4', style: { strokeColor: 'black', opacity: 1 } }]
            };
            diagram = new Diagram({
                width: '1000px', height: '530px', nodes: [node, node2, node3, node4],
                connectors: [connector], snapSettings: { constraints: SnapConstraints.ShowLines }
            });
            diagram.appendTo('#diagram');
            let objects: (NodeModel | ConnectorModel)[] = [];
            objects.push(diagram.nodes[0], diagram.nodes[1], diagram.nodes[2], diagram.nodes[3], diagram.connectors[0]);
            diagram.align('Left', objects);
            diagram.dataBind();
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking Undo - Nodes with alignment left', (done: Function) => {
            diagram.undo();
            expect((diagram.nodes[0].offsetX === 100 && diagram.nodes[0].offsetY === 100) &&
                (diagram.nodes[1].offsetX === 300 && diagram.nodes[1].offsetY === 200) &&
                (diagram.nodes[2].offsetX === 200 && diagram.nodes[2].offsetY === 450) &&
                (diagram.nodes[3].offsetX === 400 && diagram.nodes[3].offsetY === 350) &&
                (diagram.connectors[0].sourcePoint.x === 400 && diagram.connectors[0].sourcePoint.y === 500) &&
                (diagram.connectors[0].targetPoint.x === 600 && diagram.connectors[0].targetPoint.y === 500)).toBe(true);
            done();
        });
        it('Checking Redo - Nodes with alignment left', (done: Function) => {
            diagram.redo();
            expect((diagram.nodes[0].offsetX === 100 && diagram.nodes[0].offsetY === 100) &&
                (diagram.nodes[1].offsetX === 85 && diagram.nodes[1].offsetY === 200) &&
                (diagram.nodes[2].offsetX === 75 && diagram.nodes[2].offsetY === 450) &&
                (diagram.nodes[3].offsetX === 110 && diagram.nodes[3].offsetY === 350) &&
                (diagram.connectors[0].sourcePoint.x === 35 && diagram.connectors[0].sourcePoint.y === 500) &&
                (diagram.connectors[0].targetPoint.x === 235 && diagram.connectors[0].targetPoint.y === 500)).toBe(true);
            done();
        });
    });
    describe('Undo Redo - Nodes with alignment Right', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram1' });
            document.body.appendChild(ele);
            let selArray: (NodeModel | ConnectorModel)[] = [];
            let connector: ConnectorModel = {
                id: 'connector1', sourcePoint: { x: 400, y: 500 }, targetPoint: { x: 600, y: 500 }
            };
            let node: NodeModel = {
                id: 'node1', width: 130, height: 100, offsetX: 100, offsetY: 100,
                annotations: [{ content: 'Node1', style: { strokeColor: 'black', opacity: 1 } }]
            };
            let node2: NodeModel = {
                id: 'node2', width: 100, height: 100, offsetX: 300, offsetY: 200,
                annotations: [{ content: 'Node2', style: { strokeColor: 'black', opacity: 1 } }]
            };
            let node3: NodeModel = {
                id: 'node3', width: 80, height: 100, offsetX: 200, offsetY: 450,
                annotations: [{ content: 'Node3', style: { strokeColor: 'black', opacity: 1 } }]
            };
            let node4: NodeModel = {
                id: 'node4', width: 150, height: 70, offsetX: 400, offsetY: 350,
                annotations: [{ content: 'Node4', style: { strokeColor: 'black', opacity: 1 } }]
            };
            diagram = new Diagram({
                width: '1000px', height: '530px', nodes: [node, node2, node3, node4],
                connectors: [connector], snapSettings: { constraints: SnapConstraints.ShowLines }
            });
            diagram.appendTo('#diagram1');
            let objects: (NodeModel | ConnectorModel)[] = [];
            objects.push(diagram.nodes[0], diagram.nodes[1], diagram.nodes[2], diagram.nodes[3], diagram.connectors[0]);
            diagram.align('Right', objects);
            diagram.dataBind();
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking Undo - Nodes with alignment Right', (done: Function) => {
            diagram.undo();
            expect((diagram.nodes[0].offsetX === 100 && diagram.nodes[0].offsetY === 100) &&
                (diagram.nodes[1].offsetX === 300 && diagram.nodes[1].offsetY === 200) &&
                (diagram.nodes[2].offsetX === 200 && diagram.nodes[2].offsetY === 450) &&
                (diagram.nodes[3].offsetX === 400 && diagram.nodes[3].offsetY === 350)).toBe(true);
            done();
        });
        it('Checking Redo - Nodes with alignment Right', (done: Function) => {
            diagram.redo();
            expect((diagram.nodes[0].offsetX === 100 && diagram.nodes[0].offsetY === 100) &&
                (diagram.nodes[1].offsetX === 115 && diagram.nodes[1].offsetY === 200) &&
                (diagram.nodes[2].offsetX === 125 && diagram.nodes[2].offsetY === 450) &&
                (diagram.nodes[3].offsetX === 90 && diagram.nodes[3].offsetY === 350)).toBe(true);
            done();
        });
    });
    describe('Undo Redo - Nodes with alignment Top', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram3' });
            document.body.appendChild(ele);
            let connector: ConnectorModel = {
                id: 'connector1', sourcePoint: { x: 400, y: 500 }, targetPoint: { x: 600, y: 500 }
            };
            let node: NodeModel = {
                id: 'node1', width: 130, height: 100, offsetX: 100, offsetY: 100,
                annotations: [{ content: 'Node1', style: { strokeColor: 'black', opacity: 1 } }]
            };
            let node2: NodeModel = {
                id: 'node2', width: 100, height: 120, offsetX: 300, offsetY: 200,
                annotations: [{ content: 'Node2', style: { strokeColor: 'black', opacity: 1 } }]
            };
            let node3: NodeModel = {
                id: 'node3', width: 80, height: 100, offsetX: 200, offsetY: 450,
                annotations: [{ content: 'Node3', style: { strokeColor: 'black', opacity: 1 } }]
            };
            let node4: NodeModel = {
                id: 'node4', width: 150, height: 70, offsetX: 400, offsetY: 350,
                annotations: [{ content: 'Node4', style: { strokeColor: 'black', opacity: 1 } }]
            };
            diagram = new Diagram({
                width: '1000px', height: '530px', nodes: [node, node2, node3, node4],
                connectors: [connector], snapSettings: { constraints: SnapConstraints.ShowLines }
            });
            diagram.appendTo('#diagram3');
            let objects: (NodeModel | ConnectorModel)[] = [];
            objects.push(diagram.nodes[0], diagram.nodes[1], diagram.nodes[2], diagram.nodes[3], diagram.connectors[0]);
            diagram.align('Top', objects);
            diagram.dataBind();

        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking Undo Redo - Nodes with alignment Top', (done: Function) => {
            diagram.undo();
            expect((diagram.nodes[0].offsetX === 100 && diagram.nodes[0].offsetY === 100) &&
                (diagram.nodes[1].offsetX === 300 && diagram.nodes[1].offsetY === 200) &&
                (diagram.nodes[2].offsetX === 200 && diagram.nodes[2].offsetY === 450) &&
                (diagram.nodes[3].offsetX === 400 && diagram.nodes[3].offsetY === 350) &&
                (diagram.connectors[0].sourcePoint.x === 400 && diagram.connectors[0].sourcePoint.y === 500) &&
                (diagram.connectors[0].targetPoint.x === 600 && diagram.connectors[0].targetPoint.y === 500)).toBe(true);

            diagram.redo();
            expect((diagram.nodes[0].offsetX === 100 && diagram.nodes[0].offsetY === 100) &&
                (diagram.nodes[1].offsetX === 300 && diagram.nodes[1].offsetY === 110) &&
                (diagram.nodes[2].offsetX === 200 && diagram.nodes[2].offsetY === 100) &&
                (diagram.nodes[3].offsetX === 400 && diagram.nodes[3].offsetY === 85) &&
                (diagram.connectors[0].sourcePoint.x === 400 && diagram.connectors[0].sourcePoint.y === 50) &&
                (diagram.connectors[0].targetPoint.x === 600 && diagram.connectors[0].targetPoint.y === 50)).toBe(true);
            done();
        });
    });
    describe('Undo Redo - Nodes with alignment Bottom', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram4' });
            document.body.appendChild(ele);
            let connector: ConnectorModel = {
                id: 'connector1', sourcePoint: { x: 400, y: 500 }, targetPoint: { x: 600, y: 500 }
            };
            let node: NodeModel = {
                id: 'node1', width: 130, height: 100, offsetX: 100, offsetY: 100,
                annotations: [{ content: 'Node1', style: { strokeColor: 'black', opacity: 1 } }]
            };
            let node2: NodeModel = {
                id: 'node2', width: 100, height: 120, offsetX: 300, offsetY: 200,
                annotations: [{ content: 'Node2', style: { strokeColor: 'black', opacity: 1 } }]
            };
            let node3: NodeModel = {
                id: 'node3', width: 80, height: 100, offsetX: 200, offsetY: 450,
                annotations: [{ content: 'Node3', style: { strokeColor: 'black', opacity: 1 } }]
            };
            let node4: NodeModel = {
                id: 'node4', width: 150, height: 70, offsetX: 400, offsetY: 350,
                annotations: [{ content: 'Node4', style: { strokeColor: 'black', opacity: 1 } }]
            };
            diagram = new Diagram({
                width: '1000px', height: '530px', nodes: [node, node2, node3, node4],
                connectors: [connector], snapSettings: { constraints: SnapConstraints.ShowLines }
            });
            diagram.appendTo('#diagram4');
            let objects: (NodeModel | ConnectorModel)[] = [];
            objects.push(diagram.nodes[0], diagram.nodes[1], diagram.nodes[2], diagram.nodes[3], diagram.connectors[0]);
            diagram.align('Bottom', objects);
            diagram.dataBind();
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking Undo Redo - Nodes with alignment Bottom', (done: Function) => {
            diagram.undo();
            expect((diagram.nodes[0].offsetX === 100 && diagram.nodes[0].offsetY === 100) &&
                (diagram.nodes[1].offsetX === 300 && diagram.nodes[1].offsetY === 200) &&
                (diagram.nodes[2].offsetX === 200 && diagram.nodes[2].offsetY === 450) &&
                (diagram.nodes[3].offsetX === 400 && diagram.nodes[3].offsetY === 350) &&
                (diagram.connectors[0].sourcePoint.x === 400 && diagram.connectors[0].sourcePoint.y === 500) &&
                (diagram.connectors[0].targetPoint.x === 600 && diagram.connectors[0].targetPoint.y === 500)).toBe(true);
            diagram.redo();
            expect((diagram.nodes[0].offsetX === 100 && diagram.nodes[0].offsetY === 100) &&
                (diagram.nodes[1].offsetX === 300 && diagram.nodes[1].offsetY === 90) &&
                (diagram.nodes[2].offsetX === 200 && diagram.nodes[2].offsetY === 100) &&
                (diagram.nodes[3].offsetX === 400 && diagram.nodes[3].offsetY === 115) &&
                (diagram.connectors[0].sourcePoint.x === 400 && diagram.connectors[0].sourcePoint.y === 150) &&
                (diagram.connectors[0].targetPoint.x === 600 && diagram.connectors[0].targetPoint.y === 150)).toBe(true);
            done();
        });
    });
    describe('Undo Redo - Nodes with alignment Center', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram5' });
            document.body.appendChild(ele);
            let connector: ConnectorModel = {
                id: 'connector1', sourcePoint: { x: 400, y: 500 }, targetPoint: { x: 600, y: 500 }
            };
            let node: NodeModel = {
                id: 'node1', width: 130, height: 100, offsetX: 100, offsetY: 100,
                annotations: [{ content: 'Node1', style: { strokeColor: 'black', opacity: 1 } }]
            };
            let node2: NodeModel = {
                id: 'node2', width: 100, height: 100, offsetX: 300, offsetY: 200,
                annotations: [{ content: 'Node2', style: { strokeColor: 'black', opacity: 1 } }]
            };
            let node3: NodeModel = {
                id: 'node3', width: 80, height: 100, offsetX: 200, offsetY: 450,
                annotations: [{ content: 'Node3', style: { strokeColor: 'black', opacity: 1 } }]
            };
            let node4: NodeModel = {
                id: 'node4', width: 150, height: 70, offsetX: 400, offsetY: 350,
                annotations: [{ content: 'Node4', style: { strokeColor: 'black', opacity: 1 } }]
            };
            diagram = new Diagram({
                width: '1000px', height: '530px', nodes: [node, node2, node3, node4],
                connectors: [connector], snapSettings: { constraints: SnapConstraints.ShowLines }
            });
            diagram.appendTo('#diagram5');
            let objects: (NodeModel | ConnectorModel)[] = [];
            objects.push(diagram.nodes[0], diagram.nodes[1], diagram.nodes[2], diagram.nodes[3], diagram.connectors[0]);
            diagram.align('Center', objects);
            diagram.dataBind();
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking Undo Redo - Nodes with alignment Center', (done: Function) => {
            diagram.undo();
            expect((diagram.nodes[0].offsetX === 100 && diagram.nodes[0].offsetY === 100) &&
                (diagram.nodes[1].offsetX === 300 && diagram.nodes[1].offsetY === 200) &&
                (diagram.nodes[2].offsetX === 200 && diagram.nodes[2].offsetY === 450) &&
                (diagram.nodes[3].offsetX === 400 && diagram.nodes[3].offsetY === 350) &&
                (diagram.connectors[0].sourcePoint.x === 400 && diagram.connectors[0].sourcePoint.y === 500) &&
                (diagram.connectors[0].targetPoint.x === 600 && diagram.connectors[0].targetPoint.y === 500)).toBe(true);
            diagram.redo();
            expect((diagram.nodes[0].offsetX === 100 && diagram.nodes[0].offsetY === 100) &&
                (diagram.nodes[1].offsetX === 100 && diagram.nodes[1].offsetY === 200) &&
                (diagram.nodes[2].offsetX === 100 && diagram.nodes[2].offsetY === 450) &&
                (diagram.nodes[3].offsetX === 100 && diagram.nodes[3].offsetY === 350) &&
                (diagram.connectors[0].sourcePoint.x === 0 && diagram.connectors[0].sourcePoint.y === 500) &&
                (diagram.connectors[0].targetPoint.x === 200 && diagram.connectors[0].targetPoint.y === 500)).toBe(true);
            done();
        });
    });
    describe('Undo Redo - Nodes with alignment Middle ', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram6' });
            document.body.appendChild(ele);
            let connector: ConnectorModel = {
                id: 'connector1', sourcePoint: { x: 400, y: 500 }, targetPoint: { x: 600, y: 500 }
            };
            let node: NodeModel = {
                id: 'node1', width: 130, height: 100, offsetX: 100, offsetY: 100,
                annotations: [{ content: 'Node1', style: { strokeColor: 'black', opacity: 1 } }]
            };
            let node2: NodeModel = {
                id: 'node2', width: 100, height: 100, offsetX: 300, offsetY: 200,
                annotations: [{ content: 'Node2', style: { strokeColor: 'black', opacity: 1 } }]
            };
            let node3: NodeModel = {
                id: 'node3', width: 80, height: 100, offsetX: 200, offsetY: 450,
                annotations: [{ content: 'Node3', style: { strokeColor: 'black', opacity: 1 } }]
            };
            let node4: NodeModel = {
                id: 'node4', width: 150, height: 70, offsetX: 400, offsetY: 350,
                annotations: [{ content: 'Node4', style: { strokeColor: 'black', opacity: 1 } }]
            };
            diagram = new Diagram({
                width: '1000px', height: '530px', nodes: [node, node2, node3, node4],
                connectors: [connector], snapSettings: { constraints: SnapConstraints.ShowLines }
            });
            diagram.appendTo('#diagram6');
            let objects: (NodeModel | ConnectorModel)[] = [];
            objects.push(diagram.nodes[0], diagram.nodes[1], diagram.nodes[2], diagram.nodes[3], diagram.connectors[0]);
            diagram.align('Middle', objects);
            diagram.dataBind();
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking Undo Redo - Nodes with alignment Middle', (done: Function) => {
            diagram.undo();
            expect((diagram.nodes[0].offsetX === 100 && diagram.nodes[0].offsetY === 100) &&
                (diagram.nodes[1].offsetX === 300 && diagram.nodes[1].offsetY === 200) &&
                (diagram.nodes[2].offsetX === 200 && diagram.nodes[2].offsetY === 450) &&
                (diagram.nodes[3].offsetX === 400 && diagram.nodes[3].offsetY === 350) &&
                (diagram.connectors[0].sourcePoint.x === 400 && diagram.connectors[0].sourcePoint.y === 500) &&
                (diagram.connectors[0].targetPoint.x === 600 && diagram.connectors[0].targetPoint.y === 500)).toBe(true);
            diagram.redo();
            expect((diagram.nodes[0].offsetX === 100 && diagram.nodes[0].offsetY === 100) &&
                (diagram.nodes[1].offsetX === 300 && diagram.nodes[1].offsetY === 100) &&
                (diagram.nodes[2].offsetX === 200 && diagram.nodes[2].offsetY === 100) &&
                (diagram.nodes[3].offsetX === 400 && diagram.nodes[3].offsetY === 100) &&
                (diagram.connectors[0].sourcePoint.x === 400 && diagram.connectors[0].sourcePoint.y === 100) &&
                (diagram.connectors[0].targetPoint.x === 600 && diagram.connectors[0].targetPoint.y === 100)).toBe(true);
            done();
        });
    });
    describe('Undo Redo - Connectors with alignment Left', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram7' });
            document.body.appendChild(ele);
            let selArray: (NodeModel | ConnectorModel)[] = [];
            let connector: ConnectorModel = {
                id: 'connector1', sourcePoint: { x: 400, y: 500 }, targetPoint: { x: 600, y: 500 }
            };
            let node: NodeModel = {
                id: 'node1', width: 130, height: 100, offsetX: 100, offsetY: 100,
                annotations: [{ content: 'Node1', style: { strokeColor: 'black', opacity: 1 } }]
            };
            diagram = new Diagram({
                width: '1000px', height: '530px', nodes: [node],
                connectors: [connector], snapSettings: { constraints: SnapConstraints.ShowLines }
            });
            diagram.appendTo('#diagram7');
            let objects: (NodeModel | ConnectorModel)[] = [];
            objects.push(diagram.connectors[0], diagram.nodes[0]);
            diagram.align('Left', objects);
            diagram.dataBind();
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking Undo Redo - Connectors with alignment Left', (done: Function) => {
            diagram.undo();
            expect((diagram.nodes[0].offsetX === 100 && diagram.nodes[0].offsetY === 100) &&
                (diagram.connectors[0].sourcePoint.x === 400 && diagram.connectors[0].sourcePoint.y === 500) &&
                (diagram.connectors[0].targetPoint.x === 600 && diagram.connectors[0].targetPoint.y === 500)).toBe(true);
            diagram.redo();
            expect((diagram.nodes[0].offsetX === 465 && diagram.nodes[0].offsetY === 100) &&
                (diagram.connectors[0].sourcePoint.x === 400 && diagram.connectors[0].sourcePoint.y === 500) &&
                (diagram.connectors[0].targetPoint.x === 600 && diagram.connectors[0].targetPoint.y === 500)).toBe(true);
            done();
        });
    });
    describe('Undo Redo - Connectors with alignment Right', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram8' });
            document.body.appendChild(ele);
            let connector: ConnectorModel = {
                id: 'connector1', sourcePoint: { x: 400, y: 500 }, targetPoint: { x: 600, y: 500 }
            };
            let node: NodeModel = {
                id: 'node1', width: 130, height: 100, offsetX: 100, offsetY: 100,
                annotations: [{ content: 'Node1', style: { strokeColor: 'black', opacity: 1 } }]
            };
            diagram = new Diagram({
                width: '1000px', height: '530px', nodes: [node],
                connectors: [connector], snapSettings: { constraints: SnapConstraints.ShowLines }
            });
            diagram.appendTo('#diagram8');
            let objects: (NodeModel | ConnectorModel)[] = [];
            objects.push(diagram.connectors[0], diagram.nodes[0]);
            diagram.align('Right', objects);
            diagram.dataBind();
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking Undo Redo - Connectors with alignment Right', (done: Function) => {
            diagram.undo();
            expect((diagram.nodes[0].offsetX === 100 && diagram.nodes[0].offsetY === 100) &&
                (diagram.connectors[0].sourcePoint.x === 400 && diagram.connectors[0].sourcePoint.y === 500) &&
                (diagram.connectors[0].targetPoint.x === 600 && diagram.connectors[0].targetPoint.y === 500)).toBe(true);
            diagram.redo();
            expect((diagram.nodes[0].offsetX === 535 && diagram.nodes[0].offsetY === 100) &&
                (diagram.connectors[0].sourcePoint.x === 400 && diagram.connectors[0].sourcePoint.y === 500) &&
                (diagram.connectors[0].targetPoint.x === 600 && diagram.connectors[0].targetPoint.y === 500)).toBe(true);
            done();
        });
    });
    describe('Undo Redo - Connectors with alignment Top', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram9' });
            document.body.appendChild(ele);
            let connector: ConnectorModel = {
                id: 'connector1', sourcePoint: { x: 400, y: 500 }, targetPoint: { x: 600, y: 500 }
            };
            let node: NodeModel = {
                id: 'node1', width: 130, height: 100, offsetX: 100, offsetY: 100,
                annotations: [{ content: 'Node1', style: { strokeColor: 'black', opacity: 1 } }]
            };
            diagram = new Diagram({
                width: '1000px', height: '530px', nodes: [node],
                connectors: [connector], snapSettings: { constraints: SnapConstraints.ShowLines }
            });
            diagram.appendTo('#diagram9');
            let objects: (NodeModel | ConnectorModel)[] = [];
            objects.push(diagram.connectors[0], diagram.nodes[0]);
            diagram.align('Top', objects);
            diagram.dataBind();
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking Undo Redo - Connectors with alignment Top', (done: Function) => {
            diagram.undo();
            expect((diagram.nodes[0].offsetX === 100 && diagram.nodes[0].offsetY === 100) &&
                (diagram.connectors[0].sourcePoint.x === 400 && diagram.connectors[0].sourcePoint.y === 500) &&
                (diagram.connectors[0].targetPoint.x === 600 && diagram.connectors[0].targetPoint.y === 500)).toBe(true);
            diagram.redo();
            expect((diagram.nodes[0].offsetX === 100 && diagram.nodes[0].offsetY === 550) &&
                (diagram.connectors[0].sourcePoint.x === 400 && diagram.connectors[0].sourcePoint.y === 500) &&
                (diagram.connectors[0].targetPoint.x === 600 && diagram.connectors[0].targetPoint.y === 500)).toBe(true);
            done();
        });
    });
    describe('Undo Redo - Connectors with alignment Bottom', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram10' });
            document.body.appendChild(ele);
            let connector: ConnectorModel = {
                id: 'connector1', sourcePoint: { x: 400, y: 500 }, targetPoint: { x: 600, y: 500 }
            };
            let node: NodeModel = {
                id: 'node1', width: 130, height: 100, offsetX: 100, offsetY: 100,
                annotations: [{ content: 'Node1', style: { strokeColor: 'black', opacity: 1 } }]
            };
            diagram = new Diagram({
                width: '1000px', height: '530px', nodes: [node],
                connectors: [connector], snapSettings: { constraints: SnapConstraints.ShowLines }
            });
            diagram.appendTo('#diagram10');
            let objects: (NodeModel | ConnectorModel)[] = [];
            objects.push(diagram.connectors[0], diagram.nodes[0]);
            diagram.align('Bottom', objects);
            diagram.dataBind();
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking Undo Redo - Connectors with alignment Bottom', (done: Function) => {
            diagram.undo();
            expect((diagram.nodes[0].offsetX === 100 && diagram.nodes[0].offsetY === 100) &&
                (diagram.connectors[0].sourcePoint.x === 400 && diagram.connectors[0].sourcePoint.y === 500) &&
                (diagram.connectors[0].targetPoint.x === 600 && diagram.connectors[0].targetPoint.y === 500)).toBe(true);
            diagram.redo();
            expect((diagram.nodes[0].offsetX === 100 && diagram.nodes[0].offsetY === 450) &&
                (diagram.connectors[0].sourcePoint.x === 400 && diagram.connectors[0].sourcePoint.y === 500) &&
                (diagram.connectors[0].targetPoint.x === 600 && diagram.connectors[0].targetPoint.y === 500)).toBe(true);
            done();
        });
    });
    describe('Undo Redo - Connectors with alignment Center', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram11' });
            document.body.appendChild(ele);
            let selArray: (NodeModel | ConnectorModel)[] = [];
            let connector: ConnectorModel = {
                id: 'connector1', sourcePoint: { x: 400, y: 500 }, targetPoint: { x: 600, y: 500 }
            };
            let node: NodeModel = {
                id: 'node1', width: 130, height: 100, offsetX: 100, offsetY: 100,
                annotations: [{ content: 'Node1', style: { strokeColor: 'black', opacity: 1 } }]
            };
            diagram = new Diagram({
                width: '1000px', height: '530px',
                nodes: [node], connectors: [connector], snapSettings: { constraints: SnapConstraints.ShowLines }
            });
            diagram.appendTo('#diagram11');
            let objects: (NodeModel | ConnectorModel)[] = [];
            objects.push(diagram.connectors[0], diagram.nodes[0]);
            diagram.align('Center', objects);
            diagram.dataBind();
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking Undo Redo - Connectors with alignment Center', (done: Function) => {
            diagram.undo();
            expect((diagram.nodes[0].offsetX === 100 && diagram.nodes[0].offsetY === 100) &&
                (diagram.connectors[0].sourcePoint.x === 400 && diagram.connectors[0].sourcePoint.y === 500) &&
                (diagram.connectors[0].targetPoint.x === 600 && diagram.connectors[0].targetPoint.y === 500)).toBe(true);
            diagram.redo();
            expect((diagram.nodes[0].offsetX === 500 && diagram.nodes[0].offsetY === 100) &&
                (diagram.connectors[0].sourcePoint.x === 400 && diagram.connectors[0].sourcePoint.y === 500) &&
                (diagram.connectors[0].targetPoint.x === 600 && diagram.connectors[0].targetPoint.y === 500)).toBe(true);
            done();
        });
    });
    describe('Undo Redo - Connectors with alignment Middle', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram12' });
            document.body.appendChild(ele);
            let connector: ConnectorModel = {
                id: 'connector1', sourcePoint: { x: 400, y: 500 }, targetPoint: { x: 600, y: 500 }
            };
            let node: NodeModel = {
                id: 'node1', width: 130, height: 100, offsetX: 100, offsetY: 100,
                annotations: [{ content: 'Node1', style: { strokeColor: 'black', opacity: 1 } }]
            };
            diagram = new Diagram({
                width: '1000px', height: '530px', nodes: [node],
                connectors: [connector], snapSettings: { constraints: SnapConstraints.ShowLines }
            });
            diagram.appendTo('#diagram12');
            let objects: (NodeModel | ConnectorModel)[] = [];
            objects.push(diagram.connectors[0], diagram.nodes[0]);
            diagram.align('Middle', objects);
            diagram.dataBind();
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking Undo Redo - Connectors with alignment Middle', (done: Function) => {
            diagram.undo();
            expect((diagram.nodes[0].offsetX === 100 && diagram.nodes[0].offsetY === 100) &&
                (diagram.connectors[0].sourcePoint.x === 400 && diagram.connectors[0].sourcePoint.y === 500) &&
                (diagram.connectors[0].targetPoint.x === 600 && diagram.connectors[0].targetPoint.y === 500)).toBe(true);
            diagram.redo();
            expect((diagram.nodes[0].offsetX === 100 && diagram.nodes[0].offsetY === 500) &&
                (diagram.connectors[0].sourcePoint.x === 400 && diagram.connectors[0].sourcePoint.y === 500) &&
                (diagram.connectors[0].targetPoint.x === 600 && diagram.connectors[0].targetPoint.y === 500)).toBe(true);
            done();
        });
    });
    describe('Undo Redo - Nodes with SizingOptions Width', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let connector: ConnectorModel = {
                id: 'connector1', sourcePoint: { x: 350, y: 200 }, targetPoint: { x: 450, y: 200 }
            };
            let node: NodeModel = {
                id: 'node1', width: 150, height: 100, offsetX: 200, offsetY: 100,
            };
            let node2: NodeModel = {
                id: 'node2', width: 80, height: 130, offsetX: 200, offsetY: 250,
            };
            let node3: NodeModel = {
                id: 'node3', width: 200, height: 75, offsetX: 200, offsetY: 400,
            };
            diagram = new Diagram({
                width: '1000px', height: '530px', nodes: [node, node2, node3],
                connectors: [connector], snapSettings: { constraints: SnapConstraints.ShowLines }
            });
            diagram.appendTo('#diagram');
            let objects: (NodeModel | ConnectorModel)[] = [];
            objects.push(diagram.nodes[0], diagram.nodes[1], diagram.nodes[2], diagram.connectors[0]);
            diagram.sameSize('Width', objects);

        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking Undo Redo - Nodes with SizingOptions Width', (done: Function) => {
            diagram.undo();
            expect((diagram.nodes[0].width === 150 && diagram.nodes[0].height === 100) &&
                (diagram.nodes[1].width === 80 && diagram.nodes[1].height === 130) &&
                (diagram.nodes[2].width === 200 && diagram.nodes[2].height === 75) &&
                (diagram.connectors[0].wrapper.bounds.width === 100)).toBe(true);
            diagram.redo();
            expect((diagram.nodes[0].width === 150 && diagram.nodes[0].height === 100) &&
                (diagram.nodes[1].width === 150 && diagram.nodes[1].height === 130) &&
                (diagram.nodes[2].width === 150 && diagram.nodes[2].height === 75) &&
                (diagram.connectors[0].wrapper.bounds.width === 150)).toBe(true);
            done();
        });
        it('Checking same width, height, size - code coverage', (done: Function) => {
            let objects: (NodeModel | ConnectorModel)[] = [];
            diagram.sameSize('Width', objects);
            diagram.sameSize('Height', objects);
            diagram.sameSize('Size', objects);
            done();
        });
    });
    describe('Undo Redo - Nodes with SizingOptions Height', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram1' });
            document.body.appendChild(ele);
            let connector: ConnectorModel = {
                id: 'connector1', sourcePoint: { x: 300, y: 400 }, targetPoint: { x: 500, y: 500 }
            };
            let node: NodeModel = {
                id: 'node1', width: 200, height: 150, offsetX: 200, offsetY: 200
            };
            let node2: NodeModel = {
                id: 'node2', width: 150, height: 180, offsetX: 400, offsetY: 200
            };
            let node3: NodeModel = {
                id: 'node3', width: 80, height: 70, offsetX: 600, offsetY: 200
            };
            diagram = new Diagram({
                width: '1000px', height: '530px', nodes: [node, node2, node3],
                connectors: [connector], snapSettings: { constraints: SnapConstraints.ShowLines }
            });
            diagram.appendTo('#diagram1');
            let objects: (NodeModel | ConnectorModel)[] = [];
            objects.push(diagram.nodes[0], diagram.nodes[1], diagram.nodes[2], diagram.connectors[0]);
            diagram.sameSize('Height', objects);

        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking Undo Redo - Nodes with SizingOptions Height', (done: Function) => {
            diagram.undo();
            expect((diagram.nodes[0].width === 200 && diagram.nodes[0].height === 150) &&
                (diagram.nodes[1].width === 150 && diagram.nodes[1].height === 180) &&
                (diagram.nodes[2].width === 80 && diagram.nodes[2].height === 70) &&
                (diagram.connectors[0].wrapper.bounds.height === 100)).toBe(true);
            diagram.redo();
            expect((diagram.nodes[0].width === 200 && diagram.nodes[0].height === 150) &&
                (diagram.nodes[1].width === 150 && diagram.nodes[1].height === 150) &&
                (diagram.nodes[2].width === 80 && diagram.nodes[2].height === 150) &&
                (diagram.connectors[0].wrapper.bounds.height === 150)).toBe(true);
            done();
        });
    });
    describe('Undo Redo - Nodes with SizingOptions size', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram2' });
            document.body.appendChild(ele);
            let connector: ConnectorModel = {
                id: 'connector1', sourcePoint: { x: 400, y: 200 }, targetPoint: { x: 600, y: 300 }
            };
            let node: NodeModel = {
                id: 'node1', width: 150, height: 100, offsetX: 200, offsetY: 200
            };
            let node2: NodeModel = {
                id: 'node2', width: 100, height: 170, offsetX: 200, offsetY: 350
            };
            let node3: NodeModel = {
                id: 'node3', width: 200, height: 80, offsetX: 200, offsetY: 500
            };
            diagram = new Diagram({
                width: '1000px', height: '530px', nodes: [node, node2, node3],
                connectors: [connector], snapSettings: { constraints: SnapConstraints.ShowLines }
            });
            diagram.appendTo('#diagram2');
            let objects: (NodeModel | ConnectorModel)[] = [];
            objects.push(diagram.nodes[0], diagram.nodes[1], diagram.nodes[2], diagram.connectors[0]);
            diagram.sameSize('Size', objects);

        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking Undo Redo - Nodes with SizingOptions size', (done: Function) => {
            diagram.undo();
            expect((diagram.nodes[0].width === 150 && diagram.nodes[0].height === 100) &&
                (diagram.nodes[1].width === 100 && diagram.nodes[1].height === 170) &&
                (diagram.nodes[2].width === 200 && diagram.nodes[2].height === 80) &&
                (diagram.connectors[0].wrapper.bounds.width === 200 && diagram.connectors[0].wrapper.bounds.height === 100)).toBe(true);

            diagram.redo();
            expect((diagram.nodes[0].width === 150 && diagram.nodes[0].height === 100) &&
                (diagram.nodes[1].width === 150 && diagram.nodes[1].height === 100) &&
                (diagram.nodes[2].width === 150 && diagram.nodes[2].height === 100) &&
                (diagram.connectors[0].wrapper.bounds.width === 150 && diagram.connectors[0].wrapper.bounds.height === 100)).toBe(true);
            done();
        });
    });
    describe('Undo Redo - Nodes with SpacingOptions RightToLeft', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let connector: ConnectorModel = {
                id: 'connector1', sourcePoint: { x: 600, y: 100 }, targetPoint: { x: 800, y: 100 }
            };
            let node: NodeModel = {
                id: 'node1', width: 200, height: 100, offsetX: 200, offsetY: 200,
                annotations: [{ content: 'Node1', style: { strokeColor: 'black', opacity: 1 } }]
            };
            let node2: NodeModel = {
                id: 'node2', width: 100, height: 100, offsetX: 100, offsetY: 100,
                annotations: [{ content: 'Node2', style: { strokeColor: 'black', opacity: 1 } }]
            };
            let node3: NodeModel = {
                id: 'node3', width: 100, height: 100, offsetX: 500, offsetY: 100,
                annotations: [{ content: 'Node3', style: { strokeColor: 'black', opacity: 1 } }]
            };
            diagram = new Diagram({
                width: '1000px', height: '530px', nodes: [node, node2, node3],
                connectors: [connector], snapSettings: { constraints: SnapConstraints.ShowLines }
            });
            diagram.appendTo('#diagram');
            let objects: (NodeModel | ConnectorModel)[] = [];
            objects.push(diagram.nodes[0], diagram.nodes[1], diagram.nodes[2], diagram.connectors[0]);
            diagram.distribute('RightToLeft', objects);

        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking Undo Redo - Nodes with SpacingOptions RightToLeft', (done: Function) => {
            diagram.undo();
            expect((diagram.nodes[0].offsetX === 200 && diagram.nodes[0].offsetY === 200) &&
                (diagram.nodes[1].offsetX === 100 && diagram.nodes[1].offsetY === 100) &&
                (diagram.nodes[2].offsetX === 500 && diagram.nodes[2].offsetY === 100) &&
                (diagram.connectors[0].sourcePoint.x === 600 && diagram.connectors[0].sourcePoint.y === 100) &&
                (diagram.connectors[0].targetPoint.x === 800 && diagram.connectors[0].targetPoint.y === 100)).toBe(true);
            diagram.redo();
            expect((diagram.nodes[0].offsetX === 300 && diagram.nodes[0].offsetY === 200) &&
                (diagram.nodes[1].offsetX === 100 && diagram.nodes[1].offsetY === 100) &&
                (diagram.nodes[2].offsetX === 500 && diagram.nodes[2].offsetY === 100) &&
                (diagram.connectors[0].sourcePoint.x === 600 && diagram.connectors[0].sourcePoint.y === 100) &&
                (diagram.connectors[0].targetPoint.x === 800 && diagram.connectors[0].targetPoint.y === 100)).toBe(true);
            done();
        });
    });
    describe('Undo Redo - Nodes with SpacingOptions Right', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram1' });
            document.body.appendChild(ele);
            let node: NodeModel = {
                id: 'node1', width: 200, height: 100, offsetX: 200, offsetY: 200,
                annotations: [{ content: 'Node1', style: { strokeColor: 'black', opacity: 1 } }]
            };
            let node2: NodeModel = {
                id: 'node2', width: 100, height: 100, offsetX: 100, offsetY: 100,
                annotations: [{ content: 'Node2', style: { strokeColor: 'black', opacity: 1 } }]
            };
            let node3: NodeModel = {
                id: 'node3', width: 100, height: 100, offsetX: 500, offsetY: 100,
                annotations: [{ content: 'Node3', style: { strokeColor: 'black', opacity: 1 } }]
            };
            diagram = new Diagram({
                width: '1000px', height: '530px', nodes: [node, node2, node3], snapSettings: { constraints: SnapConstraints.ShowLines }
            });
            diagram.appendTo('#diagram1');
            let objects: (NodeModel | ConnectorModel)[] = [];
            objects.push(diagram.nodes[0], diagram.nodes[1], diagram.nodes[2]);

            diagram.distribute('Right', objects);

        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking Undo Redo - Nodes with SpacingOptions Right', (done: Function) => {
            diagram.undo();
            expect((diagram.nodes[0].offsetX === 200 && diagram.nodes[0].offsetY === 200) &&
                (diagram.nodes[1].offsetX === 100 && diagram.nodes[1].offsetY === 100) &&
                (diagram.nodes[2].offsetX === 500 && diagram.nodes[2].offsetY === 100)).toBe(true);
            diagram.redo();
            expect((diagram.nodes[0].offsetX === 250 && diagram.nodes[0].offsetY === 200) &&
                (diagram.nodes[1].offsetX === 100 && diagram.nodes[1].offsetY === 100) &&
                (diagram.nodes[2].offsetX === 500 && diagram.nodes[2].offsetY === 100)).toBe(true);
            done();
        });
    });
    describe('Undo Redo - Nodes with SpacingOptions Left', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram2' });
            document.body.appendChild(ele);
            let node: NodeModel = {
                id: 'node1', width: 200, height: 100, offsetX: 300, offsetY: 200,
                annotations: [{ content: 'Node1', style: { strokeColor: 'black', opacity: 1 } }]
            };
            let node2: NodeModel = {
                id: 'node2', width: 100, height: 100, offsetX: 100, offsetY: 100,
                annotations: [{ content: 'Node2', style: { strokeColor: 'black', opacity: 1 } }]
            };
            let node3: NodeModel = {
                id: 'node3', width: 100, height: 100, offsetX: 500, offsetY: 100,
                annotations: [{ content: 'Node3', style: { strokeColor: 'black', opacity: 1 } }]
            };
            diagram = new Diagram({
                width: '1000px', height: '530px', nodes: [node, node2, node3], snapSettings: { constraints: SnapConstraints.ShowLines }
            });
            diagram.appendTo('#diagram2');
            let objects: (NodeModel | ConnectorModel)[] = [];
            objects.push(diagram.nodes[0], diagram.nodes[1], diagram.nodes[2]);

            diagram.distribute('Left', objects);

        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking Undo Redo - Nodes with SpacingOptions Left', (done: Function) => {
            diagram.undo();
            expect((diagram.nodes[0].offsetX === 300 && diagram.nodes[0].offsetY === 200) &&
                (diagram.nodes[1].offsetX === 100 && diagram.nodes[1].offsetY === 100) &&
                (diagram.nodes[2].offsetX === 500 && diagram.nodes[2].offsetY === 100)).toBe(true);
            diagram.redo();
            expect((diagram.nodes[0].offsetX === 350 && diagram.nodes[0].offsetY === 200) &&
                (diagram.nodes[1].offsetX === 100 && diagram.nodes[1].offsetY === 100) &&
                (diagram.nodes[2].offsetX === 500 && diagram.nodes[2].offsetY === 100)).toBe(true);
            done();
        });
    });
    describe('Undo Redo - Nodes with SpacingOptions Center', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram3' });
            document.body.appendChild(ele);
            let node: NodeModel = {
                id: 'node1', width: 200, height: 100, offsetX: 200, offsetY: 200,
                annotations: [{ content: 'Node1', style: { strokeColor: 'black', opacity: 1 } }]
            };
            let node2: NodeModel = {
                id: 'node2', width: 100, height: 100, offsetX: 100, offsetY: 100,
                annotations: [{ content: 'Node2', style: { strokeColor: 'black', opacity: 1 } }]
            };
            let node3: NodeModel = {
                id: 'node3', width: 100, height: 100, offsetX: 500, offsetY: 100,
                annotations: [{ content: 'Node3', style: { strokeColor: 'black', opacity: 1 } }]
            };
            diagram = new Diagram({
                width: '1000px', height: '530px', nodes: [node, node2, node3], snapSettings: { constraints: SnapConstraints.ShowLines }
            });
            diagram.appendTo('#diagram3');
            let objects: (NodeModel | ConnectorModel)[] = [];
            objects.push(diagram.nodes[0], diagram.nodes[1], diagram.nodes[2]);

            diagram.distribute('Center', objects);

        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking Undo Redo - Nodes with SpacingOptions Center', (done: Function) => {
            diagram.undo();
            expect((diagram.nodes[0].offsetX === 200 && diagram.nodes[0].offsetY === 200) &&
                (diagram.nodes[1].offsetX === 100 && diagram.nodes[1].offsetY === 100) &&
                (diagram.nodes[2].offsetX === 500 && diagram.nodes[2].offsetY === 100)).toBe(true);
            diagram.redo();
            expect((diagram.nodes[0].offsetX === 300 && diagram.nodes[0].offsetY === 200) &&
                (diagram.nodes[1].offsetX === 100 && diagram.nodes[1].offsetY === 100) &&
                (diagram.nodes[2].offsetX === 500 && diagram.nodes[2].offsetY === 100)).toBe(true);
            done();
        });
    });
    describe('Undo Redo - Nodes with SpacingOptions BottomToTop', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram4' });
            document.body.appendChild(ele);
            let node: NodeModel = {
                id: 'node1', width: 200, height: 100, offsetX: 200, offsetY: 200,
                annotations: [{ content: 'Node1', style: { strokeColor: 'black', opacity: 1 } }]
            };
            let node2: NodeModel = {
                id: 'node2', width: 100, height: 100, offsetX: 100, offsetY: 100,
                annotations: [{ content: 'Node2', style: { strokeColor: 'black', opacity: 1 } }]
            };
            let connector: ConnectorModel = {
                id: 'connector1', sourcePoint: { x: 250, y: 300 }, targetPoint: { x: 400, y: 300 }
            };
            let node3: NodeModel = {
                id: 'node3', width: 100, height: 100, offsetX: 500, offsetY: 500,
                annotations: [{ content: 'Node3', style: { strokeColor: 'black', opacity: 1 } }]
            };
            diagram = new Diagram({
                width: '1000px', height: '530px', nodes: [node, node2, node3], connectors: [connector], snapSettings: { constraints: SnapConstraints.ShowLines }
            });
            diagram.appendTo('#diagram4');
            let objects: (NodeModel | ConnectorModel)[] = [];
            objects.push(diagram.nodes[0], diagram.nodes[1], diagram.nodes[2], diagram.connectors[0]);

            diagram.distribute('Middle', objects);

        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking Undo Redo - Nodes with SpacingOptions BottomToTop', (done: Function) => {
            diagram.undo();
            expect((diagram.nodes[1].offsetX === 100 && diagram.nodes[1].offsetY === 100) &&
                (diagram.nodes[2].offsetX === 500 && diagram.nodes[2].offsetY === 500) &&
                (diagram.nodes[0].offsetX === 200 && diagram.nodes[0].offsetY === 200) &&
                (diagram.connectors[0].sourcePoint.x === 250 && diagram.connectors[0].sourcePoint.y) === 300 &&
                (diagram.connectors[0].targetPoint.x === 400 && diagram.connectors[0].targetPoint.y) === 300).toBe(true);
            diagram.redo();
            expect((diagram.nodes[1].offsetX === 100 && diagram.nodes[1].offsetY === 100) &&
                (diagram.nodes[2].offsetX === 500 && diagram.nodes[2].offsetY === 500) &&
                (Math.round(diagram.nodes[0].offsetX) === 200 && Math.round(diagram.nodes[0].offsetY) === 233) &&
                (diagram.connectors[0].sourcePoint.x === 250 && Math.round(diagram.connectors[0].sourcePoint.y) === 367) &&
                (diagram.connectors[0].targetPoint.x === 400 && Math.round(diagram.connectors[0].targetPoint.y) === 367)).toBe(true);
            done();
        });
    });
    describe('Undo Redo - Nodes with SpacingOptions Top', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram5' });
            document.body.appendChild(ele);
            let node: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100,
                annotations: [{ content: 'Node1', style: { strokeColor: 'black', opacity: 1 } }]
            };
            let connector: ConnectorModel = {
                id: 'connector1', sourcePoint: { x: 100, y: 200 }, targetPoint: { x: 200, y: 300 },
                type: 'Orthogonal'
            };
            let node2: NodeModel = {
                id: 'node2', width: 100, height: 150, offsetX: 300, offsetY: 400,
                annotations: [{ content: 'Node2', style: { strokeColor: 'black', opacity: 1 } }]
            };
            diagram = new Diagram({
                width: '1000px', height: '530px', nodes: [node, node2], connectors: [connector], snapSettings: { constraints: SnapConstraints.ShowLines }
            });
            diagram.appendTo('#diagram5');
            let objects: (NodeModel | ConnectorModel)[] = [];
            objects.push(diagram.nodes[0], diagram.nodes[1], diagram.connectors[0]);
            diagram.distribute('Top', objects);

        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking Undo Redo - Nodes with SpacingOptions Top', (done: Function) => {
            diagram.undo();
            expect((diagram.nodes[0].offsetX === 100 && diagram.nodes[0].offsetY === 100) &&
                (diagram.nodes[1].offsetX === 300 && diagram.nodes[1].offsetY === 400) &&
                (diagram.connectors[0].sourcePoint.x === 100 && diagram.connectors[0].sourcePoint.y === 200) &&
                (diagram.connectors[0].targetPoint.x === 200 && diagram.connectors[0].targetPoint.y === 300)).toBe(true);
            diagram.redo();
            expect((diagram.nodes[0].offsetX === 100 && diagram.nodes[0].offsetY === 100) &&
                (diagram.nodes[1].offsetX === 300 && diagram.nodes[1].offsetY === 400) &&
                (diagram.connectors[0].sourcePoint.x === 100 && diagram.connectors[0].sourcePoint.y === 187.5) &&
                (diagram.connectors[0].targetPoint.x === 200 && diagram.connectors[0].targetPoint.y === 287.5)).toBe(true);
            done();
        });
    });
    describe('Undo Redo - Nodes with SpacingOptions Bottom', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram6' });
            document.body.appendChild(ele);
            let node: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100,
                annotations: [{ content: 'Node1', style: { strokeColor: 'black', opacity: 1 } }]
            };
            let connector: ConnectorModel = {
                id: 'connector1', sourcePoint: { x: 100, y: 200 }, targetPoint: { x: 200, y: 300 },
                type: 'Orthogonal'
            };
            let node2: NodeModel = {
                id: 'node2', width: 100, height: 150, offsetX: 300, offsetY: 400,
                annotations: [{ content: 'Node2', style: { strokeColor: 'black', opacity: 1 } }]
            };
            diagram = new Diagram({
                width: '1000px', height: '530px', nodes: [node, node2], connectors: [connector], snapSettings: { constraints: SnapConstraints.ShowLines }
            });
            diagram.appendTo('#diagram6');
            let objects: (NodeModel | ConnectorModel)[] = [];
            objects.push(diagram.nodes[0], diagram.nodes[1], diagram.connectors[0]);

            diagram.distribute('Bottom', objects);

        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking Undo Redo - Nodes with SpacingOptions Bottom', (done: Function) => {
            diagram.undo();
            expect((diagram.nodes[0].offsetX === 100 && diagram.nodes[0].offsetY === 100) &&
                (diagram.nodes[1].offsetX === 300 && diagram.nodes[1].offsetY === 400) &&
                (diagram.connectors[0].sourcePoint.x === 100 && diagram.connectors[0].sourcePoint.y === 200) &&
                (diagram.connectors[0].targetPoint.x === 200 && diagram.connectors[0].targetPoint.y === 300)).toBe(true);
            diagram.redo();
            expect((diagram.nodes[0].offsetX === 100 && diagram.nodes[0].offsetY === 100) &&
                (diagram.nodes[1].offsetX === 300 && diagram.nodes[1].offsetY === 400) &&
                (diagram.connectors[0].sourcePoint.x === 100 && diagram.connectors[0].sourcePoint.y === 212.5) &&
                (diagram.connectors[0].targetPoint.x === 200 && diagram.connectors[0].targetPoint.y === 312.5)).toBe(true);
            done();
        });
    });
    describe('Undo Redo - Nodes with SpacingOptions BottomToTop', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram6' });
            document.body.appendChild(ele);
            let node: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100,
                annotations: [{ content: 'Node1', style: { strokeColor: 'black', opacity: 1 } }]
            };
            let connector: ConnectorModel = {
                id: 'connector1', sourcePoint: { x: 100, y: 200 }, targetPoint: { x: 200, y: 300 },
                type: 'Orthogonal'
            };
            let node2: NodeModel = {
                id: 'node2', width: 100, height: 150, offsetX: 300, offsetY: 400,
                annotations: [{ content: 'Node2', style: { strokeColor: 'black', opacity: 1 } }]
            };
            diagram = new Diagram({
                width: '1000px', height: '530px', nodes: [node, node2], connectors: [connector], snapSettings: { constraints: SnapConstraints.ShowLines }
            });
            diagram.appendTo('#diagram6');
            let objects: (NodeModel | ConnectorModel)[] = [];
            objects.push(diagram.nodes[0], diagram.nodes[1], diagram.connectors[0]);

            diagram.distribute('BottomToTop', objects);

        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking Undo Redo - Nodes with SpacingOptions BottomToTop', (done: Function) => {
            diagram.undo();
            expect((diagram.nodes[0].offsetX === 100 && diagram.nodes[0].offsetY === 100) &&
                (diagram.nodes[1].offsetX === 300 && diagram.nodes[1].offsetY === 400) &&
                (diagram.connectors[0].sourcePoint.x === 100 && diagram.connectors[0].sourcePoint.y === 200) &&
                (diagram.connectors[0].targetPoint.x === 200 && diagram.connectors[0].targetPoint.y === 300)).toBe(true);
            diagram.redo();
            expect((diagram.nodes[0].offsetX === 100 && diagram.nodes[0].offsetY === 100) &&
                (diagram.nodes[1].offsetX === 300 && diagram.nodes[1].offsetY === 400) &&
                (diagram.connectors[0].sourcePoint.x === 100 && diagram.connectors[0].sourcePoint.y === 187.5) &&
                (diagram.connectors[0].targetPoint.x === 200 && diagram.connectors[0].targetPoint.y === 287.5)).toBe(true);
            done();
        });
    });
    describe('Undo Redo - Group Action', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram6' });
            document.body.appendChild(ele);
            let node: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100,
                annotations: [{ content: 'Node1', style: { strokeColor: 'black', opacity: 1 } }]
            };
            let connector: ConnectorModel = {
                id: 'connector1', sourcePoint: { x: 100, y: 200 }, targetPoint: { x: 200, y: 300 },
                type: 'Orthogonal'
            };
            let node2: NodeModel = {
                id: 'node2', width: 100, height: 150, offsetX: 300, offsetY: 400,
                annotations: [{ content: 'Node2', style: { strokeColor: 'black', opacity: 1 } }]
            };
            diagram = new Diagram({
                width: '1000px', height: '530px', nodes: [node, node2], connectors: [connector], snapSettings: { constraints: SnapConstraints.ShowLines }
            });
            diagram.appendTo('#diagram6');
            let objects: (NodeModel | ConnectorModel)[] = [];
            objects.push(diagram.nodes[0], diagram.nodes[1], diagram.connectors[0]);
            diagram.historyList.startGroupAction();
            diagram.distribute('Top', objects);
            diagram.distribute('Bottom', objects);
            diagram.distribute('BottomToTop', objects);
            diagram.historyList.endGroupAction();

        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking Undo Redo - Group Undo Redo', (done: Function) => {
            diagram.undo();
            expect((diagram.nodes[0].offsetX === 100 && diagram.nodes[0].offsetY === 100) &&
                (diagram.nodes[1].offsetX === 300 && diagram.nodes[1].offsetY === 400) &&
                (diagram.connectors[0].sourcePoint.x === 100 && diagram.connectors[0].sourcePoint.y === 200) &&
                (diagram.connectors[0].targetPoint.x === 200 && diagram.connectors[0].targetPoint.y === 300)).toBe(true);
            diagram.redo();
            expect((diagram.nodes[0].offsetX === 100 && diagram.nodes[0].offsetY === 100) &&
                (diagram.nodes[1].offsetX === 300 && diagram.nodes[1].offsetY === 400) &&
                (diagram.connectors[0].sourcePoint.x === 100 && diagram.connectors[0].sourcePoint.y === 187.5) &&
                (diagram.connectors[0].targetPoint.x === 200 && diagram.connectors[0].targetPoint.y === 287.5)).toBe(true);
            done();
        });
    });
    describe('Undo Redo - Node  property change', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let node: NodeModel = {
                id: 'textelement1', width: 100, height: 100, offsetX: 300, offsetY: 500,
                shape: { type: 'Text', content: 'textelement' } as TextModel,
                style: { color: 'green', fontSize: 12, fontFamily: 'sans-serif' } as TextStyle,
                ports: [{ id: 'port1', offset: { x: 0.5, y: 1 }, shape: 'Square' }]
            };

            let node1: NodeModel = {
                id: 'node', width: 100, height: 100, offsetX: 500, offsetY: 300,
                shape: {
                    type: 'Path', data:
                        'M540.3643,137.9336L546.7973,159.7016L570.3633,159.7296L550.7723,171.9366L558.9053,194.9966L540.3643,179.4996L521.8223,194.9966L529.9553,171.9366L510.3633,159.7296L533.9313,159.7016L540.3643,137.9336z',
                } as PathModel,
                ports: [{ id: 'port1', shape: 'Square', offset: { x: 0.5, y: 1 } }]
            };

            diagram = new Diagram({ width: '600px', height: '530px', nodes: [node1, node], snapSettings: { constraints: SnapConstraints.ShowLines } });
            diagram.appendTo('#diagram');
            diagram.nodes[1].width = 300;
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking undo redo - node width property change', (done: Function) => {
            let width: number = diagram.nodes[1].width;
            diagram.nodes[1].width = 300;
            diagram.dataBind();
            let node: NodeModel = diagram.nodes[1];
            diagram.undo();
            //expect(node.width === width).toBe(true);
            diagram.redo();
            expect(node.width === 300).toBe(true);
            done();
        });

    });
    describe('Custom Undo Redo', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let entry: HistoryEntry;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let node: NodeModel = {
                id: 'textelement1', width: 100, height: 100, offsetX: 300, offsetY: 500,
                shape: { type: 'Text', content: 'textelement' } as TextModel,
                style: { color: 'green', fontSize: 12, fontFamily: 'sans-serif' } as TextStyle,
                ports: [{ id: 'port1', offset: { x: 0.5, y: 1 }, shape: 'Square' }]
            };
            diagram = new Diagram({ width: '600px', height: '530px', nodes: [node], snapSettings: { constraints: SnapConstraints.ShowLines } });
            diagram.appendTo('#diagram');
            let node5: NodeModel = diagram.nodes[0];
            node5['customName'] = 'customNode';
            entry = { undoObject: node5 };
            diagram.historyList.push(entry);
            diagram.historyList.undo = function (args: HistoryEntry) {
                args.redoObject = cloneObject(args.undoObject) as NodeModel;
                args.undoObject['customName'] = 'customNodeChange';
            }
            diagram.historyList.redo = function (args: HistoryEntry) {
                let current: NodeModel = cloneObject(args.undoObject) as NodeModel;
                args.undoObject['customName'] = args.redoObject['customName'];
                args.redoObject = current;
            }
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking custom undo redo', (done: Function) => {
            diagram.undo();
            let node5: NodeModel = diagram.nodes[0];
            expect(node5['customName'] == 'customNodeChange');
            diagram.redo();
            expect(node5['customName'] == 'customNode')
            done();
        });
    });
    describe('Undo Redo - Add and remove node', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let node: NodeModel = {
                id: 'textelement1', width: 100, height: 100, offsetX: 300, offsetY: 500,
                shape: { type: 'Text', content: 'textelement' } as TextModel,
                style: { color: 'green', fontSize: 12, fontFamily: 'sans-serif' } as TextStyle,
                ports: [{ id: 'port1', offset: { x: 0.5, y: 1 }, shape: 'Square' }]
            };

            let node1: NodeModel = {
                id: 'node', width: 100, height: 100, offsetX: 500, offsetY: 300,
                shape: {
                    type: 'Path', data:
                        'M540.3643,137.9336L546.7973,159.7016L570.3633,159.7296L550.7723,171.9366L558.9053,194.9966L540.3643,179.4996L521.8223,194.9966L529.9553,171.9366L510.3633,159.7296L533.9313,159.7016L540.3643,137.9336z',
                } as PathModel,
                ports: [{ id: 'port1', shape: 'Square', offset: { x: 0.5, y: 1 } }]
            };

            diagram = new Diagram({ width: '600px', height: '530px', nodes: [node1, node], snapSettings: { constraints: SnapConstraints.ShowLines } });
            diagram.appendTo('#diagram');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking undo redo - add node', (done: Function) => {
            let pathNode: NodeModel = {
                id: 'node3', width: 100, height: 100, offsetX: 700, offsetY: 100,
                style: { fill: 'green' },
                shape: {
                    type: 'Flow', shape: 'Sort'
                } as FlowShapeModel, ports: [{ id: 'port', shape: 'Square', offset: { x: 0.5, y: 1 } }]
            };
            diagram.add(pathNode);
            diagram.undo();
            expect(diagram.nodes.length == 2).toBe(true);
            diagram.redo();
            expect(diagram.nodes.length == 3).toBe(true);
            done();
        });
        it('Checking undo redo - remove node from collection ', (done: Function) => {
            let pathNode: NodeModel = diagram.nodes[0];
            diagram.remove(pathNode);
            diagram.undo();
            expect(diagram.nodes.length == 3).toBe(true);
            diagram.redo();
            expect(diagram.nodes.length == 2).toBe(true);
            done();
        });
    });
    describe('Undo Redo - Add and remove connector', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let node: NodeModel = {
                id: 'textelement1', width: 100, height: 100, offsetX: 300, offsetY: 500,
                shape: { type: 'Text', content: 'textelement' } as TextModel,
                style: { color: 'green', fontSize: 12, fontFamily: 'sans-serif' } as TextStyle,
                ports: [{ id: 'port1', offset: { x: 0.5, y: 1 }, shape: 'Square' }]
            };

            let node1: NodeModel = {
                id: 'node', width: 100, height: 100, offsetX: 500, offsetY: 300,
                shape: {
                    type: 'Path', data:
                        'M540.3643,137.9336L546.7973,159.7016L570.3633,159.7296L550.7723,171.9366L558.9053,194.9966L540.3643,179.4996L521.8223,194.9966L529.9553,171.9366L510.3633,159.7296L533.9313,159.7016L540.3643,137.9336z',
                } as PathModel,
                ports: [{ id: 'port1', shape: 'Square', offset: { x: 0.5, y: 1 } }]
            };

            diagram = new Diagram({ width: '600px', height: '530px', nodes: [node1, node], snapSettings: { constraints: SnapConstraints.ShowLines } });
            diagram.appendTo('#diagram');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking undo redo - add connector', (done: Function) => {
            let connector: ConnectorModel = { id: 'connector1', sourcePoint: { x: 200, y: 200 }, targetPoint: { x: 300, y: 300 } };
            diagram.add(connector);
            diagram.undo();
            expect(diagram.connectors.length == 0).toBe(true);
            diagram.redo();
            expect(diagram.connectors.length == 1).toBe(true);
            done();
        });
        it('Checking undo redo - remove connector from collection ', (done: Function) => {
            let connector2: ConnectorModel = { id: 'connector2', sourcePoint: { x: 200, y: 200 }, targetPoint: { x: 300, y: 300 } };
            diagram.add(connector2);
            let connector: ConnectorModel = diagram.connectors[0];
            diagram.remove(connector);
            diagram.undo();
            expect(diagram.connectors.length == 2).toBe(true);
            diagram.redo();
            expect(diagram.connectors.length == 1).toBe(true);
            done();
        });
    });
    describe('Undo Redo - canLog function ', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let node: NodeModel = {
                id: 'textelement1', width: 100, height: 100, offsetX: 300, offsetY: 500,
                shape: { type: 'Text', content: 'textelement' } as TextModel,
                style: { color: 'green', fontSize: 12, fontFamily: 'sans-serif' } as TextStyle,
                ports: [{ id: 'port1', offset: { x: 0.5, y: 1 }, shape: 'Square' }]
            };

            let node1: NodeModel = {
                id: 'node', width: 100, height: 100, offsetX: 500, offsetY: 300,
                shape: {
                    type: 'Path', data:
                        'M540.3643,137.9336L546.7973,159.7016L570.3633,159.7296L550.7723,171.9366L558.9053,194.9966L540.3643,179.4996L521.8223,194.9966L529.9553,171.9366L510.3633,159.7296L533.9313,159.7016L540.3643,137.9336z',
                } as PathModel,
                ports: [{ id: 'port1', shape: 'Square', offset: { x: 0.5, y: 1 } }]
            };

            diagram = new Diagram({ width: '600px', height: '530px', nodes: [node1, node], snapSettings: { constraints: SnapConstraints.ShowLines } });
            diagram.appendTo('#diagram');
            diagram.historyList.canLog = function (entry: HistoryEntry) {
                entry.cancel = true;
                return entry;
            }
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking undo redo when entry is empty and canLog function', (done: Function) => {
            diagram.undo();
            diagram.redo();
            let connector: ConnectorModel = { id: 'connector1', sourcePoint: { x: 200, y: 200 }, targetPoint: { x: 300, y: 300 } };
            diagram.add(connector);
            expect(diagram.historyList.currentEntry === null).toBe(true);
            done();
        });
        it('Checking canLog function in undo redo', (done: Function) => {
            diagram.historyList.canLog = function (entry: HistoryEntry) {
                entry.cancel = false;
                return entry;
            }
            let connector: ConnectorModel = { id: 'connector1', sourcePoint: { x: 200, y: 200 }, targetPoint: { x: 300, y: 300 } };
            diagram.add(connector);
            expect(diagram.historyList.currentEntry !== null).toBe(true);
            done();
        });
    });
    describe('Testing Undo redo - copy and paste the two selected nodes with out edges ', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram9' });
            document.body.appendChild(ele);
            let selArray: (NodeModel | ConnectorModel)[] = [];
            let node: NodeModel = {
                id: 'node', width: 100, height: 100, offsetX: 100, offsetY: 100,
                shape: { type: 'Basic', shape: 'Rectangle' },
                annotations: [{
                    style: { strokeColor: 'black', opacity: 0.5 },
                    content: 'center center', height: 50,
                    width: 50, offset: { x: 0.5, y: 0.5 },
                    horizontalAlignment: 'Center',
                    verticalAlignment: 'Center',
                }]
            };
            let node1: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 300, offsetY: 200,
                shape: { type: 'Basic', shape: 'Rectangle' },
                annotations: [{
                    style: { strokeColor: 'black', opacity: 0.5 },
                    content: 'center center',
                    height: 50,
                    width: 50,
                    offset: { x: 0.5, y: 0.5 },
                    horizontalAlignment: 'Center',
                    verticalAlignment: 'Center',
                }]
            };
            let connector1: ConnectorModel = {
                id: 'connector1', type: 'Orthogonal', sourcePoint: { x: 200, y: 200 },
                targetPoint: { x: 300, y: 300 }, sourceID: node.id, targetID: node1.id,
                cornerRadius: 10, style: { strokeColor: 'red', strokeWidth: 3, opacity: 3 }
            };
            diagram = new Diagram({
                width: '500px', height: '500px', nodes: [node, node1],
                connectors: [connector1], snapSettings: { constraints: SnapConstraints.ShowLines }
            });
            diagram.appendTo('#diagram9');
            selArray.push(diagram.nodes[0]);
            selArray.push(diagram.nodes[1]);
            diagram.select(selArray, true);
            let object: object = diagram.copy();
            diagram.paste();
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking  Undo Redo - copy and paste the two selected nodes with out edges', (done: Function) => {
            diagram.undo();
            diagram.redo();
            expect(diagram.connectors[0].sourceID === 'node' && diagram.connectors[0].targetID === 'node1' &&
                diagram.nodes.length === 4 && (diagram.nodes[0] as Node).outEdges[0] === 'connector1' &&
                (diagram.nodes[1] as Node).inEdges[0] === 'connector1' && (diagram.nodes[2] as Node).outEdges.length === 0 &&
                (diagram.nodes[3] as Node).inEdges.length === 0).toBe(true);
            done();
        });
    });

    describe('Testing Undo redo - remove the two nodes with out edges using group action ', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram_remove' });
            document.body.appendChild(ele);
            let node1: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100,
                shape: { type: 'Basic', shape: 'Rectangle' }
            };
            let node2: NodeModel = {
                id: 'node2', width: 100, height: 100, offsetX: 300, offsetY: 200,
                shape: { type: 'Basic', shape: 'Rectangle' }
            };
            let connector1: ConnectorModel = {
                id: 'connector1', sourceID: node1.id, targetID: node2.id
            };
            diagram = new Diagram({
                width: '500px', height: '500px', nodes: [node1, node2],
                connectors: [connector1]
            });
            diagram.appendTo('#diagram_remove');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking  Undo Redo - remove the two nodes with out edges using group action', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            diagram.startGroupAction();
            mouseEvents.clickEvent(diagramCanvas, 100, 100);
            mouseEvents.keyDownEvent(diagramCanvas, 'Delete');
            mouseEvents.clickEvent(diagramCanvas, 300, 200);
            mouseEvents.keyDownEvent(diagramCanvas, 'Delete');
            diagram.endGroupAction();
            expect(diagram.nodes.length).toBe(0);
            expect(diagram.connectors.length).toBe(0);
            diagram.undo();
            expect(diagram.nodes.length).toBe(2);
            expect(diagram.connectors.length).toBe(1);
            diagram.redo();
            expect(diagram.nodes.length).toBe(0);
            expect(diagram.connectors.length).toBe(0);
            done();
        });
    });
    describe('Testing undo redo stack', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram_undoredostack' });
            document.body.appendChild(ele);
            let node1: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100,
                shape: { type: 'Basic', shape: 'Rectangle' }
            };
            let node2: NodeModel = {
                id: 'node2', width: 100, height: 100, offsetX: 300, offsetY: 200,
                shape: { type: 'Basic', shape: 'Rectangle' }
            };
            diagram = new Diagram({
                width: '800px', height: '800px', nodes: [node1, node2],
            });
            diagram.appendTo('#diagram_undoredostack');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking Undo Redo Stack', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.dragAndDropEvent(diagramCanvas, 150, 150, 100, 100);
            mouseEvents.dragAndDropEvent(diagramCanvas, 350, 150, 300, 100);
            expect(diagram.historyList.undoStack.length).toBe(2);
            expect(diagram.historyList.redoStack.length).toBe(0);
            diagram.undo();
            expect(diagram.historyList.undoStack.length).toBe(1);
            expect(diagram.historyList.redoStack.length).toBe(1);
            done();
        });
    });
    describe('Undo Redo - Change port connection in connector', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramUndoRedoConnection' });
            document.body.appendChild(ele);

            let node1: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100,
                ports: [{ id: 'port1', shape: 'Square', offset: { x: 0.5, y: 1 } }]
            };

            let node2: NodeModel = {
                id: 'node2', width: 100, height: 100, offsetX: 300, offsetY: 100,
                ports: [{ id: 'port1', shape: 'Square', offset: { x: 0.5, y: 1 } }]
            };

            let connector1: ConnectorModel = {
                id: 'connector', sourceID: 'node1', sourcePortID: 'port1', targetID: 'node2', targetPortID: 'port1', type: 'Straight'
            }

            diagram = new Diagram({
                width: '600px', height: '530px', nodes: [node1, node2],
                connectors: [connector1], snapSettings: { constraints: SnapConstraints.ShowLines }
            });
            diagram.appendTo('#diagramUndoRedoConnection');
            diagram.nodes[1].width = 300;
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking undo - connector(source port to point)', (done: Function) => {

            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, diagram.connectors[0].sourcePoint.x + diagram.element.offsetLeft, diagram.connectors[0].sourcePoint.y + diagram.element.offsetTop, );
            mouseEvents.dragAndDropEvent(diagramCanvas, diagram.connectors[0].sourcePoint.x + diagram.element.offsetLeft, diagram.connectors[0].sourcePoint.y + diagram.element.offsetTop, diagram.connectors[0].sourcePoint.x + diagram.element.offsetLeft + 200, diagram.connectors[0].sourcePoint.y + diagram.element.offsetTop + 500);
            expect(diagram.connectors[0].sourcePortID === '').toBe(true);
            diagram.undo();
            expect(diagram.connectors[0].sourcePortID === 'port1').toBe(true);
            diagram.redo();
            done();
        });

        it('Checking undo - connector(target port to point)', (done: Function) => {

            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            expect(diagram.connectors[0].targetPortID === 'port1').toBe(true);
            mouseEvents.dragAndDropEvent(diagramCanvas, diagram.connectors[0].targetPoint.x + diagram.element.offsetLeft, diagram.connectors[0].targetPoint.y + diagram.element.offsetTop, diagram.connectors[0].targetPoint.x + diagram.element.offsetLeft + 200, diagram.connectors[0].targetPoint.y + diagram.element.offsetTop + 200);
            expect(diagram.connectors[0].targetPortID === '').toBe(true);
            diagram.undo();
            expect(diagram.connectors[0].targetPortID === 'port1').toBe(true);
            diagram.redo();
            done();
        });

    });

    describe('Undo Redo - add histroy entry without node and connector', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramUndoRedoIssue' });
            document.body.appendChild(ele);

            let node1: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100,
                ports: [{ id: 'port1', offset: { x: 0, y: 0.5 }, constraints: PortConstraints.Draw, visibility: PortVisibility.Visible },
                { id: 'port2', offset: { x: 0.5, y: 0 }, constraints: PortConstraints.Draw, visibility: PortVisibility.Visible },
                { id: 'port3', offset: { x: 1, y: 0.5 }, constraints: PortConstraints.Draw, visibility: PortVisibility.Visible },
                { id: 'port4', offset: { x: 0.5, y: 1 }, constraints: PortConstraints.Draw, visibility: PortVisibility.Visible },]
            };

            diagram = new Diagram({
                width: '600px', height: '530px', nodes: [node1],
                snapSettings: { constraints: SnapConstraints.ShowLines }
            });
            diagram.appendTo('#diagramUndoRedoIssue');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking histroy list when mouse hover and the leave the port', (done: Function) => {

            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.mouseMoveEvent(diagramCanvas, 100 + diagram.element.offsetLeft, 150 + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 200 + diagram.element.offsetLeft, 150 + diagram.element.offsetTop)
            expect(diagram.historyList.currentEntry == null).toBe(true);
            done();
        });
    });


    describe('undo - constraints changes on runtime', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        let mouseEvents: MouseEvents = new MouseEvents();

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagrambab' });
            document.body.appendChild(ele);
            let selArray: (NodeModel | ConnectorModel)[] = [];

            let node: NodeModel = {
                id: 'node1', constraints: NodeConstraints.Default, offsetX: 100, offsetY: 100,
                shape: { type: 'Basic', shape: 'Rectangle' }
            }

            let connector: ConnectorModel = {
                id: 'connector1', sourcePoint: { x: 200, y: 200 },
                targetPoint: { x: 300, y: 300 }
            };

            diagram = new Diagram({
                width: '600px', height: '530px',
                connectors: [connector], nodes: [node],
                snapSettings: { constraints: SnapConstraints.ShowLines }
            });

            diagram.appendTo('#diagrambab');
            selArray.push(diagram.connectors[0]);
            diagram.select(selArray);
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking Sourcepoint Drag on runtime', (done: Function) => {
            let connector1: ConnectorModel = diagram.connectors[0];
            connector1.constraints = ConnectorConstraints.Default & ~ConnectorConstraints.DragSourceEnd;
            diagram.dataBind();
            diagram.undo();
            expect(connector1.constraints === ConnectorConstraints.Default).toBe(true);
            done();
        });

        it('Checking changing source decorator shape and undo in runtime', (done: Function) => {
            let connector1: ConnectorModel = diagram.connectors[0];
            let diamond: string = 'Diamond';
            connector1.sourceDecorator.shape = diamond as DecoratorShapes;
            diagram.dataBind();
            expect(connector1.sourceDecorator.shape === 'Diamond').toBe(true);
            diagram.undo();
            expect(connector1.sourceDecorator.shape === 'None').toBe(true);
            done();
        });

        it('Checking shadow for node Undo  on runtime', (done: Function) => {
            let node1: NodeModel = diagram.nodes[0];
            node1.constraints = NodeConstraints.Default | NodeConstraints.Shadow;
            diagram.dataBind();
            diagram.undo();
            let shadow: HTMLElement = document.getElementById(node1.id + '_content_groupElement_shadow')
            expect(!shadow).toBe(true);
            done();
        });
    });

    describe('Undo Redo - add node and edit label', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();
        beforeAll((): void => {
            ele = createElement('div', { id: 'EditLabelUndoRedoIssue' });
            document.body.appendChild(ele);
            diagram = new Diagram({
                width: '600px', height: '530px',
                snapSettings: { constraints: SnapConstraints.ShowLines }
            });
            diagram.appendTo('#EditLabelUndoRedoIssue');
            let pathNode: NodeModel = {
                id: 'node', width: 100, height: 100, offsetX: 100, offsetY: 100,
                style: { fill: 'green' },
                shape: {
                    type: 'Flow', shape: 'Sort'
                } as FlowShapeModel, ports: [{ id: 'port', shape: 'Square', offset: { x: 0.5, y: 1 } }]
            };
            diagram.add(pathNode);
            diagram.select([diagram.nodes[0]]);
            diagram.startTextEdit();
            let editBox = document.getElementById(diagram.element.id + '_editBox');
            (editBox as HTMLInputElement).value = "Node";
            diagram.endEdit();
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking undo redo - text edit (add node at runtime)', (done: Function) => {
            expect(diagram.nodes.length == 1 && diagram.nodes[0].annotations.length == 1 && diagram.nodes[0].annotations[0].content == 'Node').toBe(true);
            diagram.undo();
            expect(diagram.nodes.length == 1 && diagram.nodes[0].annotations.length == 0).toBe(true);
            diagram.undo();
            expect(diagram.nodes.length == 0).toBe(true);
            diagram.redo();
            expect(diagram.nodes.length == 1 && diagram.nodes[0].annotations.length == 0).toBe(true);
            diagram.redo();
            expect(diagram.nodes.length == 1 && diagram.nodes[0].annotations.length == 1 && diagram.nodes[0].annotations[0].content == 'Node').toBe(true);
            done();
        });
    });
    describe('Undo Redo - add port and remove port', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();
        beforeAll((): void => {
            ele = createElement('div', { id: 'EditLabelUndoRedoIssue' });
            document.body.appendChild(ele);
            diagram = new Diagram({
                width: '600px', height: '530px', nodes: [{
                    id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100,
                }],
                snapSettings: { constraints: SnapConstraints.ShowLines }
            });
            diagram.appendTo('#EditLabelUndoRedoIssue');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking undo redo - add port at runtime', (done: Function) => {
            expect(diagram.nodes.length == 1 && diagram.nodes[0].ports.length == 0).toBe(true);
            let nodes: Node = diagram.nodes[0] as Node;
            let port: PointPortModel[] =
                [{ id: 'port1', visibility: PortVisibility.Visible, shape: 'Circle', offset: { x: 0, y: 0 } },
                { id: 'port2', visibility: PortVisibility.Visible, shape: 'Circle', offset: { x: 1, y: 0 } },
                { id: 'port3', visibility: PortVisibility.Visible, shape: 'Circle', offset: { x: 0, y: 1 } },
                { id: 'port4', visibility: PortVisibility.Visible, shape: 'Circle', offset: { x: 1, y: 1 } }
                ]
            diagram.addPorts(nodes, port);
            expect(diagram.nodes.length == 1 && diagram.nodes[0].ports.length == 4).toBe(true);
            diagram.undo();
            expect(diagram.nodes.length == 1 && diagram.nodes[0].ports.length == 0).toBe(true);
            diagram.redo();
            expect(diagram.nodes.length == 1 && diagram.nodes[0].ports.length == 4).toBe(true);
            done();
        });
        it('Checking undo redo - remove port at runtime', (done: Function) => {
            expect(diagram.nodes.length == 1 && diagram.nodes[0].ports.length == 4).toBe(true);
            let nodes: Node = diagram.nodes[0] as Node
            let port: PointPortModel[] = [
                { id: 'port1', }, { id: 'port2', }, { id: 'port3', }, { id: 'port4', }
            ]
            diagram.removePorts(nodes, port);
            expect(diagram.nodes.length == 1 && diagram.nodes[0].ports.length == 0).toBe(true);
            diagram.undo();
            expect(diagram.nodes.length == 1 && diagram.nodes[0].ports.length == 4).toBe(true);
            diagram.redo();
            expect(diagram.nodes.length == 1 && diagram.nodes[0].ports.length == 0).toBe(true);
            done();
        });
    });
    describe('Straight Segment - drag control points', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents = new MouseEvents();
        beforeAll((): void => {
            ele = createElement('div', { id: 'DragControlPoints' });
            document.body.appendChild(ele);
            diagram = new Diagram({
                width: 1000, height: 1000,
                connectors: [{ id: 'con5', sourcePoint: { x: 100, y: 100 }, targetPoint: { x: 200, y: 200 }, type: 'Straight', segments: [{ type: 'Straight', point: { x: 120, y: 200 } }, { type: 'Straight', point: { x: 110, y: 170 } }] }
                ],
                snapSettings: { constraints: SnapConstraints.ShowLines }
            });
            diagram.appendTo('#DragControlPoints');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking straight segment - drag connector have control points', (done: Function) => {
            diagram.select([diagram.connectors[0]]);
            expect((diagram.connectors[0] as Connector).intermediatePoints[1].x == 120 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 200 &&
                (diagram.connectors[0] as Connector).intermediatePoints[2].x == 110 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 170).toBe(true);
            diagram.nudge('Right');
            expect((diagram.connectors[0] as Connector).intermediatePoints[1].x == 121 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 200 &&
                (diagram.connectors[0] as Connector).intermediatePoints[2].x == 111 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 170).toBe(true);
            done();
        });
    });
    describe('Orthogonal Segment - annotation position(undo)', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents = new MouseEvents();
        beforeAll((): void => {
            ele = createElement('div', { id: 'AnnotationPositionUndo' });
            document.body.appendChild(ele);
            diagram = new Diagram({
                width: 1000, height: 1000,
                connectors: [{
                    id: 'conn1', sourcePoint: { x: 100, y: 100 }, targetPoint: { x: 200, y: 200 }, type: 'Orthogonal',
                    annotations: [{ content: 'Yes' }]
                }],
                snapSettings: { constraints: SnapConstraints.ShowLines }
            });
            diagram.appendTo('#AnnotationPositionUndo');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking annotation position - drag connector and then undo', (done: Function) => {
            diagram.selectAll();
            var mouseEvents = new MouseEvents();
            var diagramCanvas = document.getElementById(diagram.element.id + 'content');
            expect(Math.round(diagram.connectors[0].wrapper.children[3].bounds.x) == 170 &&
                Math.round(diagram.connectors[0].wrapper.children[3].bounds.y) == 114).toBe(true);
            mouseEvents.dragAndDropEvent(diagramCanvas, 100 + diagram.element.offsetLeft, 100 + diagram.element.offsetTop, 400, 100);
            diagram.undo();
            expect(Math.round(diagram.connectors[0].wrapper.children[3].bounds.x) == 170
                && diagram.connectors[0].wrapper.children[3].bounds.y == 114).toBe(true);
            done();
        });
    });
    describe('Aspect Ratio Issue', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents = new MouseEvents();
        beforeAll((): void => {
            ele = createElement('div', { id: 'AspectioRatioIssue' });
            document.body.appendChild(ele);
            let node1: NodeModel = {
                id: 'NewIdea', width: 150, height: 60, offsetX: 300, offsetY: 60,
                shape: { type: 'Flow', shape: 'Terminator' },
                annotations: [{
                    id: 'label1', content: 'New idea identified', offset: { x: 0.5, y: 0.5 }
                }],
                constraints: NodeConstraints.Default | NodeConstraints.AspectRatio
            };

            diagram = new Diagram({
                width: 1000, height: 1000, nodes: [node1],
                snapSettings: {
                    horizontalGridlines: { lineIntervals: [0.95, 9.05, 0.2, 9.75], snapIntervals: [10] },
                    verticalGridlines: { lineIntervals: [0.95, 9.05, 0.2, 9.75], snapIntervals: [10] }
                },
            });
            diagram.appendTo('#AspectioRatioIssue');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking aspect ratio and undo', (done: Function) => {
            var diagramCanvas = document.getElementById(diagram.element.id + 'content');
            diagram.selectAll();
            expect(diagram.nodes[0].width == 150 && diagram.nodes[0].height == 60).toBe(true);
            mouseEvents.dragAndDropEvent(diagramCanvas, Number(document.getElementsByClassName('e-diagram-resize-handle e-south')[0].getAttribute('cx')) + diagram.element.offsetLeft, Number(document.getElementsByClassName('e-diagram-resize-handle e-south')[0].getAttribute('cy')) + diagram.element.offsetTop, 400, 60);
            expect((150 / diagram.nodes[0].width) == (60 / diagram.nodes[0].height)).toBe(true);
            diagram.undo();
            expect(diagram.nodes[0].width == 150 && diagram.nodes[0].height == 60).toBe(true);
            mouseEvents.dragAndDropEvent(diagramCanvas, Number(document.getElementsByClassName('e-diagram-resize-handle e-northeast')[0].getAttribute('cx')) + diagram.element.offsetLeft, Number(document.getElementsByClassName('e-diagram-resize-handle e-northeast')[0].getAttribute('cy')) + diagram.element.offsetTop, 400, 90);
            expect(Math.round(150 / diagram.nodes[0].width) == Math.round(60 / diagram.nodes[0].height)).toBe(true);
            done();
        });
    });
    describe('Undo redo Issue', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents = new MouseEvents();
        beforeAll((): void => {
            ele = createElement('div', { id: 'UndoRedoIssueDiagram' });
            document.body.appendChild(ele);
            diagram = new Diagram({
                width: 500, height: 500, mode: 'SVG'
            });
            diagram.appendTo('#UndoRedoIssueDiagram');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking fill and stroke after redo a node', (done: Function) => {
            diagram.add({ id: 'node2', offsetX: 100, offsetY: 100, width: 100, height: 100 });
            expect(diagram.nodes.length == 1).toBe(true);            
            diagram.nodes[0].style.fill = 'red';
            diagram.nodes[0].style.strokeColor = 'red';
            diagram.dataBind();            
            expect(document.getElementById('node2_content').getAttribute('fill') == 'red' && document.getElementById('node2_content').getAttribute('stroke') == 'red').toBe(true);
            diagram.nodes[0].style.fill = 'green';
            diagram.nodes[0].style.strokeColor = 'green';
            diagram.dataBind();
            expect(document.getElementById('node2_content').getAttribute('fill') == 'green' && document.getElementById('node2_content').getAttribute('stroke') == 'green').toBe(true);
            diagram.undo();
            expect(document.getElementById('node2_content').getAttribute('fill') == 'red' && document.getElementById('node2_content').getAttribute('stroke') == 'red').toBe(true);
            diagram.undo();
            expect(document.getElementById('node2_content').getAttribute('fill') == 'white' && document.getElementById('node2_content').getAttribute('stroke') == 'black').toBe(true);
            diagram.undo();
            expect(diagram.nodes.length == 0).toBe(true);
            diagram.redo();
            expect(diagram.nodes.length == 1).toBe(true);
            diagram.nodes[0].style.fill = 'blue';
            diagram.nodes[0].style.strokeColor = 'blue';
            diagram.dataBind();
            expect(document.getElementById('node2_content').getAttribute('fill')== 'blue' && document.getElementById('node2_content').getAttribute('stroke') == 'blue').toBe(true);
            done();
        });
    });
});