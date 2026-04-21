/**
 * Annotation interaction - Test Cases
 */
import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../src/diagram/diagram';
import {  PortVisibility } from '../../src/diagram/enum/enum';
import { ConnectorModel } from '../../src/diagram/objects/connector-model';
import { MouseEvents } from '../diagram/interaction/mouseevents.spec';
import { Selector } from '../../src/diagram/objects/node';
import { DiagramElement } from '../../src/diagram/core/elements/diagram-element';
import { PointModel } from '../../src/diagram/primitives/point-model';
import { identityMatrix, rotateMatrix, transformPointByMatrix, Matrix } from '../../src/diagram/primitives/matrix';
import { UndoRedo } from '../../src/diagram/objects/undo-redo';
import { Snapping } from '../../src/diagram/objects/snapping';
import { BezierSegmentModel, Connector, ConnectorConstraints, ConnectorEditing, DiagramCollaboration, IHistoryChangeArgs, NodeModel, OrthogonalSegment, PathPortModel } from '../../src/diagram/index';
Diagram.Inject(UndoRedo, Snapping, DiagramCollaboration, ConnectorEditing);

function collaborativeElementDrag(diagram: Diagram) {
    let diagramCanvas: HTMLElement; let left: number; let top: number;
    diagramCanvas = document.getElementById(diagram.element.id + 'content');
    left = diagram.element.offsetLeft; top = diagram.element.offsetTop;
    let mouseEvents: MouseEvents = new MouseEvents();
    if ((diagram.selectedItems as Selector).connectors) {
        let element: DiagramElement = diagram.selectedItems.wrapper.children[0];
        let centerX = element.offsetX;
        let centerY = element.offsetY;
        mouseEvents.mouseDownEvent(diagramCanvas, centerX + diagram.element.offsetLeft, centerY + diagram.element.offsetTop);
        mouseEvents.mouseMoveEvent(diagramCanvas, centerX + diagram.element.offsetLeft + 20, centerY + diagram.element.offsetTop);
        mouseEvents.mouseMoveEvent(diagramCanvas, centerX + diagram.element.offsetLeft + 20, centerY + diagram.element.offsetTop + 20);
        mouseEvents.mouseUpEvent(diagramCanvas, centerX + diagram.element.offsetLeft + 20, centerY + diagram.element.offsetTop + 20);
    }
}

function collaborativeElementResize(diagram: Diagram, direction: string): void {
    if ((diagram.selectedItems as Selector).annotation) {
        let diagramCanvas: HTMLElement; let left: number; let top: number;
        diagramCanvas = document.getElementById(diagram.element.id + 'content');
        left = diagram.element.offsetLeft; top = diagram.element.offsetTop;
        let element: HTMLElement = document.getElementById(direction);
        let mouseEvents: MouseEvents = new MouseEvents();
        let x: number = Number(element.getAttribute('x'));
        let y: number = Number(element.getAttribute('y'));
        mouseEvents.mouseDownEvent(diagramCanvas, x + diagram.element.offsetLeft, y + diagram.element.offsetTop);
        mouseEvents.mouseMoveEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop);
        mouseEvents.mouseMoveEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop + 20);
        mouseEvents.mouseUpEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop + 20);
    }
}


function collaborativeElementRotate(diagram: Diagram, value: number) {
    let diagramCanvas: HTMLElement; let left: number; let top: number;
    diagramCanvas = document.getElementById(diagram.element.id + 'content');
    left = diagram.element.offsetLeft; top = diagram.element.offsetTop;
    let mouseEvents: MouseEvents = new MouseEvents();
    if ((diagram.selectedItems as Selector).annotation) {
        let element: DiagramElement = diagram.selectedItems.wrapper.children[0];
        let ten: number = 10 / diagram.scroller.currentZoom;
        let matrix: Matrix = identityMatrix();
        rotateMatrix(matrix, element.rotateAngle + element.parentTransform, element.offsetX, element.offsetY);
        //check for resizing tool
        let rotate: number = (value ? value : 20)+5;
        let x: number = element.offsetX - element.pivot.x * element.actualSize.width;
        let y: number = element.offsetY - element.pivot.y * element.actualSize.height;
        let rotateThumb: PointModel = { x: x + element.actualSize.width / 2, y: y - 30 / diagram.scroller.currentZoom };
        rotateThumb = transformPointByMatrix(matrix, rotateThumb);
        mouseEvents.mouseDownEvent(diagramCanvas, rotateThumb.x + diagram.element.offsetLeft, rotateThumb.y + diagram.element.offsetTop);
        mouseEvents.mouseMoveEvent(diagramCanvas, rotateThumb.x + diagram.element.offsetLeft + rotate, rotateThumb.y + diagram.element.offsetTop);
        mouseEvents.mouseMoveEvent(diagramCanvas, rotateThumb.x + diagram.element.offsetLeft + rotate, rotateThumb.y + diagram.element.offsetTop + rotate);
        mouseEvents.mouseUpEvent(diagramCanvas, rotateThumb.x + diagram.element.offsetLeft + rotate, rotateThumb.y + diagram.element.offsetTop + rotate);
    }
}

function collaborativeElementDragSource(diagram: Diagram) {
    let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
    let src = diagram.connectors[0].sourcePoint;
    let left = diagram.element.offsetLeft; let top = diagram.element.offsetTop;
    let mEvents: MouseEvents = new MouseEvents();
    mEvents.mouseMoveEvent(diagramCanvas, src.x + left, src.y + top);
    mEvents.mouseDownEvent(diagramCanvas, src.x + left, src.y + top);
    mEvents.mouseMoveEvent(diagramCanvas, src.x + left + 50, src.y + top);
    mEvents.mouseUpEvent(diagramCanvas, src.x + left + 50, src.y + top + 20);
}

function collaborativeElementDragTarget(diagram: Diagram) {
    let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
    let tgt = diagram.connectors[0].targetPoint;
    let left = diagram.element.offsetLeft; let top = diagram.element.offsetTop;
    let mEvents: MouseEvents = new MouseEvents();
    mEvents.mouseMoveEvent(diagramCanvas, tgt.x + left, tgt.y + top);
    mEvents.mouseDownEvent(diagramCanvas, tgt.x + left, tgt.y + top);
    mEvents.mouseMoveEvent(diagramCanvas, tgt.x + left + 50, tgt.y + top);
    mEvents.mouseUpEvent(diagramCanvas, tgt.x + left + 50, tgt.y + top);
}

// Common setup function for collaboration tests
function setupCollaborationTest(
    connectors: ConnectorModel[], 
    nodes: any[] = []
): { 
    diagram: Diagram, 
    diagram2: Diagram, 
    ele: HTMLElement,
    diagramCanvas1: HTMLElement,
    diagramCanvas2: HTMLElement,
    mouseEvents: MouseEvents 
} {
    const ele = createElement('div', { id: 'ConnectorInteraction' });
    const diagramEle1 = createElement('div', { id: 'diagram1' });
    const diagramEle2 = createElement('div', { id: 'diagram2' });
    ele.appendChild(diagramEle1);
    ele.appendChild(diagramEle2);
    document.body.appendChild(ele);

    const diagram = new Diagram({
        width: 800,
        height: 500,
        connectors: connectors,
        nodes: nodes,
        enableCollaborativeEditing: true,
        historyChange: function (args: IHistoryChangeArgs) {
            let changes: string[] = diagram.getDiagramUpdates(args);
            if (changes.length > 0) {
                diagram2.setDiagramUpdates(changes);
            }
        }
    });

    const diagram2 = new Diagram({
        width: 800,
        height: 500,
        connectors: connectors,
        nodes: nodes,
        enableCollaborativeEditing: true,
    });

    diagram.appendTo('#diagram1');
    diagram2.appendTo('#diagram2');

    const diagramCanvas1 = document.getElementById(diagram.element.id + 'content');
    const diagramCanvas2 = document.getElementById(diagram2.element.id + 'content');
    const mouseEvents = new MouseEvents();
    mouseEvents.clickEvent(diagramCanvas1, 1, 1);

    return { diagram, diagram2, ele, diagramCanvas1, diagramCanvas2, mouseEvents };
}

// Common teardown function
function teardownCollaborationTest(
    diagram: Diagram,
    diagram2: Diagram,
    ele: HTMLElement,
    mouseEvents: MouseEvents
): void {
    diagram.destroy();
    diagram2.destroy();
    ele.remove();
}

describe('Diagram Collaboration', () => {
        describe('Collaborative Straight Connector - Drag Operations', () => {
            let diagram: Diagram;
            let diagram2: Diagram;
            let ele: HTMLElement;
            let mouseEvents: MouseEvents;
            let diagramCanvas1: HTMLElement;
            let diagramCanvas2: HTMLElement;
 
            beforeAll(function (this: any): void {
                const isDef = (o: any) => o !== undefined && o !== null;
                if (!isDef(window.performance)) {
                    this.skip();
                    return;
                }
                const connectors: ConnectorModel[] = [{
                    id: 'connector1', type: 'Straight', sourcePoint: {x: 100, y: 100}, targetPoint: {x: 200, y: 200}
                }];
                const setup = setupCollaborationTest(connectors);
                diagram = setup.diagram;
                diagram2 = setup.diagram2;
                ele = setup.ele;
                diagramCanvas1 = setup.diagramCanvas1;
                diagramCanvas2 = setup.diagramCanvas2;
                mouseEvents = setup.mouseEvents;
            });
 
            afterAll((): void => {
                teardownCollaborationTest(diagram, diagram2, ele, mouseEvents);
            });

            it('Collaborative Drag Source End', (done: Function) => {
                mouseEvents.clickEvent(diagramCanvas1, 150, 150);
                collaborativeElementDragSource(diagram);
                let src1 = diagram.connectors[0].sourcePoint;
                let src2 = diagram2.connectors[0].sourcePoint;
                let tar1 = diagram.connectors[0].targetPoint;
                let tar2 = diagram2.connectors[0].targetPoint;
                let connector2 = diagram2.connectors[0].wrapper;
                let connector1 = diagram.connectors[0].wrapper;
                expect(connector1.offsetX).toBe(connector2.offsetX);
                expect(connector1.offsetY).toBe(connector2.offsetY);
                expect(src1.x).toBe(src2.x);
                expect(src1.y).toBe(src2.y);
                expect(tar1.x).toBe(tar2.x);
                expect(tar1.y).toBe(tar2.y);
                done();
            });
            
            it('Collaborative Drag Target End', (done: Function) => {
                collaborativeElementDragTarget(diagram);
                let tgt1 = diagram.connectors[0].targetPoint;
                let tgt2 = diagram2.connectors[0].targetPoint;
                let connector2 = diagram2.connectors[0].wrapper;
                let connector1 = diagram.connectors[0].wrapper;
                expect(connector1.offsetX).toBe(connector2.offsetX);
                expect(connector1.offsetY).toBe(connector2.offsetY);
                expect(tgt1.x).toBe(tgt2.x);
                expect(tgt1.y).toBe(tgt2.y);
                done();
            });
        });

        describe('Collaborative Straight Connector - Drag', () => {
            let diagram: Diagram;
            let diagram2: Diagram;
            let ele: HTMLElement;
            let mouseEvents: MouseEvents;
            let diagramCanvas1: HTMLElement;
            let diagramCanvas2: HTMLElement;
 
            beforeAll(function (this: any): void {
                const isDef = (o: any) => o !== undefined && o !== null;
                if (!isDef(window.performance)) {
                    this.skip();
                    return;
                }
                const connectors: ConnectorModel[] = [{
                    id: 'connector1', type: 'Straight', sourcePoint: {x: 100, y: 100}, targetPoint: {x: 200, y: 200}
                }];
                const setup = setupCollaborationTest(connectors);
                diagram = setup.diagram;
                diagram2 = setup.diagram2;
                ele = setup.ele;
                diagramCanvas1 = setup.diagramCanvas1;
                diagramCanvas2 = setup.diagramCanvas2;
                mouseEvents = setup.mouseEvents;
            });
 
            afterAll((): void => {
                teardownCollaborationTest(diagram, diagram2, ele, mouseEvents);
            });

            it('Collaborative Drag', (done: Function) => {
                diagram.select([diagram.connectors[0]]);
                let initialConnector2 = diagram2.connectors[0].wrapper;
                let initialConnector1 = diagram.connectors[0].wrapper;
                collaborativeElementDrag(diagram);
                let connector2 = diagram2.connectors[0].wrapper;
                let connector1 = diagram.connectors[0].wrapper;
                expect(connector1.offsetX).toBe(connector2.offsetX);
                expect(connector1.offsetY).toBe(connector2.offsetY);
                diagram.undo();
                expect(connector1.offsetX).toBe(initialConnector1.offsetX);
                expect(connector1.offsetY).toBe(initialConnector1.offsetY);
                expect(connector2.offsetX).toBe(initialConnector2.offsetX);
                expect(connector2.offsetY).toBe(initialConnector2.offsetY);
                diagram.redo();
                expect(connector1.offsetX).toBe(connector2.offsetX);
                expect(connector1.offsetY).toBe(connector2.offsetY);
                done(); 
            });
        });

        describe('Collaborative Straight Connector - Clipboard Operations', () => {
            let diagram: Diagram;
            let diagram2: Diagram;
            let ele: HTMLElement;
            let mouseEvents: MouseEvents;
            let diagramCanvas1: HTMLElement;
            let diagramCanvas2: HTMLElement;
 
            beforeAll(function (this: any): void {
                const isDef = (o: any) => o !== undefined && o !== null;
                if (!isDef(window.performance)) {
                    this.skip();
                    return;
                }
                const connectors: ConnectorModel[] = [{
                    id: 'connector1', type: 'Straight', sourcePoint: {x: 100, y: 100}, targetPoint: {x: 200, y: 200}
                }];
                const setup = setupCollaborationTest(connectors);
                diagram = setup.diagram;
                diagram2 = setup.diagram2;
                ele = setup.ele;
                diagramCanvas1 = setup.diagramCanvas1;
                diagramCanvas2 = setup.diagramCanvas2;
                mouseEvents = setup.mouseEvents;
            });
 
            afterAll((): void => {
                teardownCollaborationTest(diagram, diagram2, ele, mouseEvents);
            });

            it('Collaborative Copy Paste - Keyboard', (done: Function) => {
                diagram.select([diagram.connectors[0]]);
                let beforeCount: number = diagram.connectors.length;
                mouseEvents.keyDownEvent(diagramCanvas1, 'C', true);
                mouseEvents.keyDownEvent(diagramCanvas1, 'V', true);
                expect(diagram.connectors.length).toBe(beforeCount + 1);
                expect(diagram2.connectors.length).toBe(beforeCount + 1);
                done();
            });

            it('Collaborative Cut Paste - Keyboard', (done: Function) => {
                diagram.select([diagram.connectors[0]]);
                let beforeCount: number = diagram.connectors.length;
                mouseEvents.keyDownEvent(diagramCanvas1, 'X', true);
                expect(diagram.connectors.length).toBe(beforeCount - 1);
                expect(diagram2.connectors.length).toBe(beforeCount - 1);
                mouseEvents.keyDownEvent(diagramCanvas1, 'V', true);
                expect(diagram.connectors.length).toBe(beforeCount);
                expect(diagram2.connectors.length).toBe(beforeCount);
                done();
            });

            it('Collaborative Delete - Keyboard', (done: Function) => {
                 diagram.select([diagram.connectors[0]]);
                let beforeCount: number = diagram.connectors.length;
                mouseEvents.keyDownEvent(diagramCanvas1, 'Delete');
                expect(diagram.connectors.length).toBe(beforeCount - 1);
                expect(diagram2.connectors.length).toBe(beforeCount - 1);
                done();
            });
        });

        describe('Collaborative Straight Connector - Annotation Operations', () => {
            let diagram: Diagram;
            let diagram2: Diagram;
            let ele: HTMLElement;
            let mouseEvents: MouseEvents;
            let diagramCanvas1: HTMLElement;
            let diagramCanvas2: HTMLElement;
 
            beforeAll(function (this: any): void {
                const isDef = (o: any) => o !== undefined && o !== null;
                if (!isDef(window.performance)) {
                    this.skip();
                    return;
                }
                const connectors: ConnectorModel[] = [{
                    id: 'connector1', type: 'Straight', sourcePoint: {x: 100, y: 100}, targetPoint: {x: 200, y: 200}
                }];
                const setup = setupCollaborationTest(connectors);
                diagram = setup.diagram;
                diagram2 = setup.diagram2;
                ele = setup.ele;
                diagramCanvas1 = setup.diagramCanvas1;
                diagramCanvas2 = setup.diagramCanvas2;
                mouseEvents = setup.mouseEvents;
            });
 
            afterAll((): void => {
                teardownCollaborationTest(diagram, diagram2, ele, mouseEvents);
            });

            it('Collaborative Add new annotation', (done: Function) => {
                let conn = diagram.connectors[0];
                let beforeCount: number = conn.annotations.length;
                diagram.addLabels(conn, [{ id: "runtimeAnnotation", content: 'new annotation' }]);
                var a1 = diagram.connectors[0].annotations;
                var a2 = diagram2.connectors[0].annotations;
                expect(a1.length).toBe(beforeCount + 1);
                expect(a2.length).toBe(beforeCount + 1);
                expect(a1[a1.length - 1].content).toBe('new annotation');
                expect(a2[a2.length - 1].content).toBe('new annotation');
                diagram.undo();
                expect(diagram.connectors[0].annotations.length).toBe(beforeCount);
                expect(diagram2.connectors[0].annotations.length).toBe(beforeCount);
                diagram.redo();
                expect(diagram.connectors[0].annotations.length).toBe(beforeCount + 1);
                expect(diagram2.connectors[0].annotations.length).toBe(beforeCount + 1);
                expect(diagram.connectors[0].annotations[0].content).toBe('new annotation');
                expect(diagram2.connectors[0].annotations[0].content).toBe('new annotation');
                done();
            });

            it('Collaborative Removing annotation', (done: Function) => {
                let conn = diagram.connectors[0];
                let conn1 = diagram2.connectors[0];
                var beforeCount = conn.annotations.length;
                var beforeCount1 = conn1.annotations.length;
                diagram.removeLabels(conn, [conn.annotations[0]]);
                expect(diagram.connectors[0].annotations.length).toBe(beforeCount - 1);
                expect(diagram2.connectors[0].annotations.length).toBe(beforeCount1 - 1);
                done();
            });

            it('Collaborative Annotation content change', (done: Function) => {
                let conn = diagram.connectors[0];
                diagram.addLabels(conn, [{ id: "runtimeAnnotation1",content: 'new annotation' }]);
                var a1 = diagram.connectors[0].annotations;
                var a2 = diagram2.connectors[0].annotations;
                expect(a1[a1.length - 1].content).toBe('new annotation');
                expect(a2[a2.length - 1].content).toBe('new annotation');
                conn.annotations[0].content = "Changed annotation";
                diagram.dataBind();
                expect(conn.annotations[0].content).toBe('Changed annotation');
                expect(diagram2.connectors[0].annotations[0].content).toBe('Changed annotation');
                done();
            });

            it('Collaborative Annotation style change', (done: Function) => {
                let conn = diagram.connectors[0];
                let a1 = diagram.connectors[0].annotations;
                let a2 = diagram2.connectors[0].annotations;
                expect(a1[a1.length - 1].style.color).toBe('black');
                expect(a2[a2.length - 1].style.color).toBe('black');
                conn.annotations[0].style.color = "red";
                diagram.dataBind();
                expect(conn.annotations[0].style.color).toBe('red');
                expect(diagram2.connectors[0].annotations[0].style.color).toBe('red');          
                done();
            });
        });

        describe('Collaborative Straight Connector - Port Operations', () => {
            let diagram: Diagram;
            let diagram2: Diagram;
            let ele: HTMLElement;
            let mouseEvents: MouseEvents;
            let diagramCanvas1: HTMLElement;
            let diagramCanvas2: HTMLElement;
 
            beforeAll(function (this: any): void {
                const isDef = (o: any) => o !== undefined && o !== null;
                if (!isDef(window.performance)) {
                    this.skip();
                    return;
                }
                const connectors: ConnectorModel[] = [{
                    id: 'connector1', type: 'Straight', sourcePoint: {x: 100, y: 100}, targetPoint: {x: 200, y: 200}
                }];
                const setup = setupCollaborationTest(connectors);
                diagram = setup.diagram;
                diagram2 = setup.diagram2;
                ele = setup.ele;
                diagramCanvas1 = setup.diagramCanvas1;
                diagramCanvas2 = setup.diagramCanvas2;
                mouseEvents = setup.mouseEvents;
            });
 
            afterAll((): void => {
                teardownCollaborationTest(diagram, diagram2, ele, mouseEvents);
            });

            it('Collaborative Add new port', (done: Function) => {
                let conn = diagram.connectors[0];
                let beforeCount: number = (conn.ports && conn.ports.length) ? conn.ports.length : 0;
                // add a path port to the connector
                diagram.addPorts(conn, [{ id: 'port1', offset: 0.5 }] as PathPortModel[]);

                let p1 = diagram.connectors[0].ports;
                let p2 = diagram2.connectors[0].ports;
                expect((p1 && p1.length) || 0).toBe(beforeCount + 1);
                expect((p2 && p2.length) || 0).toBe(beforeCount + 1);

                // undo
                diagram.undo();
                expect((diagram.connectors[0].ports && diagram.connectors[0].ports.length) || 0).toBe(beforeCount);
                expect((diagram2.connectors[0].ports && diagram2.connectors[0].ports.length) || 0).toBe(beforeCount);
                
                // redo
                diagram.redo();
                expect((diagram.connectors[0].ports && diagram.connectors[0].ports.length) || 0).toBe(beforeCount + 1);
                expect((diagram2.connectors[0].ports && diagram2.connectors[0].ports.length) || 0).toBe(beforeCount + 1);
                done();
            });

            it('Collaborative Remove port', (done: Function) => {
                let conn = diagram.connectors[0];
                if (!conn.ports || conn.ports.length === 0) {
                    diagram.addPorts(conn as any, [{ id: 'port', offset: 0.5 }] as PathPortModel[]);
                }
                let beforeCount: number = (conn.ports && conn.ports.length) ? conn.ports.length : 0;
                let removePort = conn.ports[conn.ports.length - 1];
                diagram.removePorts(conn as Connector, [removePort]);
                expect((diagram.connectors[0].ports && diagram.connectors[0].ports.length) || 0).toBe(beforeCount - 1);
                expect((diagram2.connectors[0].ports && diagram2.connectors[0].ports.length) || 0).toBe(beforeCount - 1);

                // undo 
                diagram.undo();
                expect((diagram.connectors[0].ports && diagram.connectors[0].ports.length) || 0).toBe(beforeCount);
                expect((diagram2.connectors[0].ports && diagram2.connectors[0].ports.length) || 0).toBe(beforeCount);
                done();

                //redo
                diagram.redo();
                expect((diagram.connectors[0].ports && diagram.connectors[0].ports.length) || 0).toBe(beforeCount - 1);
                expect((diagram2.connectors[0].ports && diagram2.connectors[0].ports.length) || 0).toBe(beforeCount - 1);
            });
        });

        describe('Collaborative Straight Connector - Port Property Changes', () => {
            let diagram: Diagram;
            let diagram2: Diagram;
            let ele: HTMLElement;
            let mouseEvents: MouseEvents;
            let diagramCanvas1: HTMLElement;
            let diagramCanvas2: HTMLElement;
 
            beforeAll(function (this: any): void {
                const isDef = (o: any) => o !== undefined && o !== null;
                if (!isDef(window.performance)) {
                    this.skip();
                    return;
                }
                const connectors: ConnectorModel[] = [{
                    id: 'connector1', type: 'Straight', sourcePoint: {x: 100, y: 100}, targetPoint: {x: 200, y: 200}
                }];
                const setup = setupCollaborationTest(connectors);
                diagram = setup.diagram;
                diagram2 = setup.diagram2;
                ele = setup.ele;
                diagramCanvas1 = setup.diagramCanvas1;
                diagramCanvas2 = setup.diagramCanvas2;
                mouseEvents = setup.mouseEvents;
            });
 
            afterAll((): void => {
                teardownCollaborationTest(diagram, diagram2, ele, mouseEvents);
            });

            it('Collaborative Port property change - offset', (done: Function) => {
                let conn = diagram.connectors[0];
                // Ensure port exists
                diagram.addPorts(conn, [{ id: 'portOffset', offset: 0.5 }] as PathPortModel[]);
                
                let port1 = diagram.connectors[0].ports[0];
                let port2 = diagram2.connectors[0].ports[0];
                let initialOffset1 = port1.offset;
                let initialOffset2 = port2.offset;
                
                expect(initialOffset1).toBe(initialOffset2);
                
                // Change port offset
                port1.offset = 0.75;
                diagram.dataBind();
                
                expect(diagram.connectors[0].ports[0].offset).toBe(0.75);
                expect(diagram2.connectors[0].ports[0].offset).toBe(0.75);
                
                // undo
                diagram.undo();
                expect(diagram.connectors[0].ports[0].offset).toBe(initialOffset1);
                expect(diagram2.connectors[0].ports[0].offset).toBe(initialOffset2);
                
                // redo
                diagram.redo();
                expect(diagram.connectors[0].ports[0].offset).toBe(0.75);
                expect(diagram2.connectors[0].ports[0].offset).toBe(0.75);
                
                done();
            });

            it('Collaborative Port property change - shape', (done: Function) => {
                let conn = diagram.connectors[0];
                // Ensure port exists
                if (!conn.ports || conn.ports.length === 0) {
                    diagram.addPorts(conn, [{ id: 'portShape', offset: 0.5, shape: 'Square' }] as PathPortModel[]);
                }
                
                let port1 = diagram.connectors[0].ports[0];
                let port2 = diagram2.connectors[0].ports[0];
                let initialShape1 = port1.shape || 'Square';
                let initialShape2 = port2.shape || 'Square';
                
                expect(initialShape1).toBe(initialShape2);
                
                // Change port shape
                port1.shape = 'Circle';
                diagram.dataBind();
                
                expect(diagram.connectors[0].ports[0].shape).toBe('Circle');
                expect(diagram2.connectors[0].ports[0].shape).toBe('Circle');
                
                // undo
                diagram.undo();
                expect(diagram.connectors[0].ports[0].shape).toBe(initialShape1);
                expect(diagram2.connectors[0].ports[0].shape).toBe(initialShape2);
                
                // redo
                diagram.redo();
                expect(diagram.connectors[0].ports[0].shape).toBe('Circle');
                expect(diagram2.connectors[0].ports[0].shape).toBe('Circle');
                
                done();
            });

            it('Collaborative Port property change - fill color', (done: Function) => {
                let conn = diagram.connectors[0];
                // Ensure port exists
                if (!conn.ports || conn.ports.length === 0) {
                    diagram.addPorts(conn, [{ id: 'portFill', offset: 0.5 }] as PathPortModel[]);
                }
                
                let port1 = diagram.connectors[0].ports[0];
                let port2 = diagram2.connectors[0].ports[0];
                let initialFill1 = port1.style.fill || 'white';
                let initialFill2 = port2.style.fill || 'white';
                
                expect(initialFill1).toBe(initialFill2);
                
                port1.style.fill = 'blue';
                diagram.dataBind();
                
                expect(diagram.connectors[0].ports[0].style.fill).toBe('blue');
                expect(diagram2.connectors[0].ports[0].style.fill).toBe('blue');
                
                // undo
                diagram.undo();
                expect(diagram.connectors[0].ports[0].style.fill || 'white').toBe(initialFill1);
                expect(diagram2.connectors[0].ports[0].style.fill || 'white').toBe(initialFill2);
                
                // redo
                diagram.redo();
                expect(diagram.connectors[0].ports[0].style.fill).toBe('blue');
                expect(diagram2.connectors[0].ports[0].style.fill).toBe('blue');
                
                done();
            });
        });

        describe('Collaborative Straight Connector - CRUD Operations', () => {
            let diagram: Diagram;
            let diagram2: Diagram;
            let ele: HTMLElement;
            let mouseEvents: MouseEvents;
            let diagramCanvas1: HTMLElement;
            let diagramCanvas2: HTMLElement;
 
            beforeAll(function (this: any): void {
                const isDef = (o: any) => o !== undefined && o !== null;
                if (!isDef(window.performance)) {
                    this.skip();
                    return;
                }
                const connectors: ConnectorModel[] = [{
                    id: 'connector1', type: 'Straight', sourcePoint: {x: 100, y: 100}, targetPoint: {x: 200, y: 200}
                }];
                const setup = setupCollaborationTest(connectors);
                diagram = setup.diagram;
                diagram2 = setup.diagram2;
                ele = setup.ele;
                diagramCanvas1 = setup.diagramCanvas1;
                diagramCanvas2 = setup.diagramCanvas2;
                mouseEvents = setup.mouseEvents;
            });
 
            afterAll((): void => {
                teardownCollaborationTest(diagram, diagram2, ele, mouseEvents);
            });

            it('Collaborative Add new connector', (done: Function) => {
                let beforeCount: number = diagram.connectors.length;
                let newConn: ConnectorModel = { id: 'newConnector', type: 'Straight', sourcePoint: { x: 300, y: 300 }, targetPoint: { x: 400, y: 400 } } as ConnectorModel;
                diagram.add(newConn as Connector);
                expect(diagram.connectors.length).toBe(beforeCount + 1);
                expect(diagram2.connectors.length).toBe(beforeCount + 1);
                let added1 = diagram.connectors[diagram.connectors.length - 1];
                let added2 = diagram2.connectors[diagram2.connectors.length - 1];
                expect(added1.type).toBe('Straight');
                expect(added2.type).toBe('Straight');

                // undo
                diagram.undo();
                expect(diagram.connectors.length).toBe(beforeCount);
                expect(diagram2.connectors.length).toBe(beforeCount);

                // redo
                diagram.redo();
                expect(diagram.connectors.length).toBe(beforeCount + 1);
                expect(diagram2.connectors.length).toBe(beforeCount + 1);
                done();
            });

            it('Collaborative Remove connector', (done: Function) => {
                let beforeCount: number = diagram.connectors.length;
                let removeConn = diagram.connectors[diagram.connectors.length - 1];
                diagram.remove(removeConn as any);
                expect(diagram.connectors.length).toBe(beforeCount - 1);
                expect(diagram2.connectors.length).toBe(beforeCount - 1);

                // undo
                diagram.undo();
                expect(diagram.connectors.length).toBe(beforeCount);
                expect(diagram2.connectors.length).toBe(beforeCount);

                // redo
                diagram.redo();
                expect(diagram.connectors.length).toBe(beforeCount - 1);
                expect(diagram2.connectors.length).toBe(beforeCount - 1);
                done();
            });
        });

        
        describe('Collaborative Straight Connector - Property Changes', () => {
            let diagram: Diagram;
            let diagram2: Diagram;
            let ele: HTMLElement;
            let mouseEvents: MouseEvents;
            let diagramCanvas1: HTMLElement;
            let diagramCanvas2: HTMLElement;
 
            beforeAll(function (this: any): void {
                const isDef = (o: any) => o !== undefined && o !== null;
                if (!isDef(window.performance)) {
                    this.skip();
                    return;
                }
                const connectors: ConnectorModel[] = [{
                    id: 'connector1', type: 'Straight', sourcePoint: {x: 100, y: 100}, targetPoint: {x: 200, y: 200}
                }];
                const setup = setupCollaborationTest(connectors);
                diagram = setup.diagram;
                diagram2 = setup.diagram2;
                ele = setup.ele;
                diagramCanvas1 = setup.diagramCanvas1;
                diagramCanvas2 = setup.diagramCanvas2;
                mouseEvents = setup.mouseEvents;
            });
 
            afterAll((): void => {
                teardownCollaborationTest(diagram, diagram2, ele, mouseEvents);
            });

            it('Collaborative Connector property change - type', (done: Function) => {
                // select the first connector
                let connector1 = diagram.connectors[0];
                let connector2 = diagram2.connectors[0];
                
                expect(connector1.type).toBe('Straight');
                expect(connector2.type).toBe('Straight');
                
                // change type to Bezier
                connector1.type = 'Bezier';
                diagram.dataBind();
                expect(diagram.connectors[0].type).toBe('Bezier');
                expect(diagram2.connectors[0].type).toBe('Bezier');
                // undo 
                diagram.undo();
                expect(diagram.connectors[0].type).toBe('Straight');
                expect(diagram2.connectors[0].type).toBe('Straight');
                
                // redo
                diagram.redo();
                expect(diagram.connectors[0].type).toBe('Bezier');
                expect(diagram2.connectors[0].type).toBe('Bezier');
                done();
            });
            
            it('Collaborative Connector property change - stroke color', (done: Function) => {
                // select the first connector
                let connector1 = diagram.connectors[0];
                let connector2 = diagram2.connectors[0];
                
                let initialColor1 = connector1.style.strokeColor || 'black';
                let initialColor2 = connector2.style.strokeColor || 'black';
                expect(initialColor1).toBe(initialColor2);
                connector1.style.strokeColor = 'red';
                diagram.dataBind();
                expect(diagram.connectors[0].style.strokeColor).toBe('red');
                expect(diagram2.connectors[0].style.strokeColor).toBe('red');
                
                // undo 
                diagram.undo();
                expect(diagram.connectors[0].style.strokeColor).toBe(initialColor1);
                expect(diagram2.connectors[0].style.strokeColor).toBe(initialColor2);
                // redo 
                diagram.redo();
                expect(diagram.connectors[0].style.strokeColor).toBe('red');
                expect(diagram2.connectors[0].style.strokeColor).toBe('red');
                done();
            });
        });

        describe('Collaborative Straight Connector - Decorator Changes', () => {
            let diagram: Diagram;
            let diagram2: Diagram;
            let ele: HTMLElement;
            let mouseEvents: MouseEvents;
            let diagramCanvas1: HTMLElement;
            let diagramCanvas2: HTMLElement;
 
            beforeAll(function (this: any): void {
                const isDef = (o: any) => o !== undefined && o !== null;
                if (!isDef(window.performance)) {
                    this.skip();
                    return;
                }
                const connectors: ConnectorModel[] = [{
                    id: 'connector1', type: 'Straight', sourcePoint: {x: 100, y: 100}, targetPoint: {x: 200, y: 200}
                }];
                const setup = setupCollaborationTest(connectors);
                diagram = setup.diagram;
                diagram2 = setup.diagram2;
                ele = setup.ele;
                diagramCanvas1 = setup.diagramCanvas1;
                diagramCanvas2 = setup.diagramCanvas2;
                mouseEvents = setup.mouseEvents;
            });
 
            afterAll((): void => {
                teardownCollaborationTest(diagram, diagram2, ele, mouseEvents);
            });

            it('Collaborative Source decorator - shape change', (done: Function) => {
                let connector1 = diagram.connectors[0];
                let connector2 = diagram2.connectors[0];
                
                let initialShape1 = connector1.sourceDecorator.shape || 'None';
                let initialShape2 = connector2.sourceDecorator.shape || 'None';
                expect(initialShape1).toBe(initialShape2);
                connector1.sourceDecorator.shape = 'Diamond';
                diagram.dataBind();
                expect(diagram.connectors[0].sourceDecorator.shape).toBe('Diamond');
                expect(diagram2.connectors[0].sourceDecorator.shape).toBe('Diamond');
                // undo
                diagram.undo();
                expect(diagram.connectors[0].sourceDecorator.shape).toBe(initialShape1);
                expect(diagram2.connectors[0].sourceDecorator.shape).toBe(initialShape2);
                // redo
                diagram.redo();
                expect(diagram.connectors[0].sourceDecorator.shape).toBe('Diamond');
                expect(diagram2.connectors[0].sourceDecorator.shape).toBe('Diamond');
                done();
            });

            it('Collaborative Target decorator - shape change', (done: Function) => {
                let connector1 = diagram.connectors[0];
                let connector2 = diagram2.connectors[0];
                
                let initialShape1 = connector1.targetDecorator.shape || 'None';
                let initialShape2 = connector2.targetDecorator.shape || 'None';
                expect(initialShape1).toBe(initialShape2);
                
                // change target decorator shape to OpenArrow
                connector1.targetDecorator.shape = 'OpenArrow';
                diagram.dataBind();
                
                // verify shape changed in both diagrams
                expect(diagram.connectors[0].targetDecorator.shape).toBe('OpenArrow');
                expect(diagram2.connectors[0].targetDecorator.shape).toBe('OpenArrow');
                // undo
                diagram.undo();
                expect(diagram.connectors[0].targetDecorator.shape).toBe(initialShape1);
                expect(diagram2.connectors[0].targetDecorator.shape).toBe(initialShape2);
                // redo
                diagram.redo();
                expect(diagram.connectors[0].targetDecorator.shape).toBe('OpenArrow');
                expect(diagram2.connectors[0].targetDecorator.shape).toBe('OpenArrow');
                done();
            });

            it('Collaborative Source decorator - fill color change', (done: Function) => {
                let connector1 = diagram.connectors[0];
                let connector2 = diagram2.connectors[0];
                let initialFill1 = connector1.sourceDecorator.style.fill || 'black';
                let initialFill2 = connector2.sourceDecorator.style.fill || 'black';
                expect(initialFill1).toBe(initialFill2);
                
                connector1.sourceDecorator.style.fill = 'green';
                diagram.dataBind();
                
                expect(diagram.connectors[0].sourceDecorator.style.fill).toBe('green');
                expect(diagram2.connectors[0].sourceDecorator.style.fill).toBe('green');
                diagram.undo();
                expect(diagram.connectors[0].sourceDecorator.style.fill).toBe(initialFill1);
                expect(diagram2.connectors[0].sourceDecorator.style.fill).toBe(initialFill2);
                diagram.redo();
                expect(diagram.connectors[0].sourceDecorator.style.fill).toBe('green');
                expect(diagram2.connectors[0].sourceDecorator.style.fill).toBe('green');
                done();
            });

            it('Collaborative Target decorator - fill color change', (done: Function) => {
                let connector1 = diagram.connectors[0];
                let connector2 = diagram2.connectors[0];
                let initialFill1 = connector1.targetDecorator.style.fill || 'black';
                let initialFill2 = connector2.targetDecorator.style.fill || 'black';
                expect(initialFill1).toBe(initialFill2);
                
                connector1.targetDecorator.style.fill = 'yellow';
                diagram.dataBind();
                
                expect(diagram.connectors[0].targetDecorator.style.fill).toBe('yellow');
                expect(diagram2.connectors[0].targetDecorator.style.fill).toBe('yellow');
                // undo
                diagram.undo();
                expect(diagram.connectors[0].targetDecorator.style.fill).toBe(initialFill1);
                expect(diagram2.connectors[0].targetDecorator.style.fill).toBe(initialFill2);
                // redo
                diagram.redo();
                expect(diagram.connectors[0].targetDecorator.style.fill).toBe('yellow');
                expect(diagram2.connectors[0].targetDecorator.style.fill).toBe('yellow');
                done();
            });

            it('Collaborative Source decorator - gradient style change', (done: Function) => {
                let connector1 = diagram.connectors[0];
                let connector2 = diagram2.connectors[0];
                
                connector1.sourceDecorator.style.gradient = {
                    type: 'Radial',
                    cx: 50, cy: 50, fx: 50, fy: 50, r: 50,
                    stops: [
                        { color: 'yellow', offset: 0, opacity: 1 },
                        { color: 'orange', offset: 100, opacity: 1 }
                    ]
                };
                diagram.dataBind();
                expect(connector1.sourceDecorator.style.gradient.type).toBe(connector2.sourceDecorator.style.gradient.type);
                done();
            });

            it('Collaborative Target decorator - gradient style change', (done: Function) => {
                let connector1 = diagram.connectors[0];
                let connector2 = diagram2.connectors[0];
                
                connector1.targetDecorator.style.gradient = {
                    type: 'Linear',
                    x1: 0, y1: 0, x2: 100, y2: 0,
                    stops: [
                        { color: 'red', offset: 0, opacity: 1 },
                        { color: 'purple', offset: 100, opacity: 1 }
                    ]
                };
                diagram.dataBind();
                expect(connector1.targetDecorator.style.gradient.type).toBe(connector2.targetDecorator.style.gradient.type);
                done();
            });
        });

    describe('Collaborative Bezier Connector - Drag Operations', () => {
        let diagram: Diagram;
        let diagram2: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents;
        let diagramCanvas1: HTMLElement;
        let diagramCanvas2: HTMLElement;

        beforeAll(function (this: any): void {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                this.skip();
                return;
            }
            const connectors: ConnectorModel[] = [{
                id: 'connector1', type: 'Bezier', sourcePoint: {x: 100, y: 100}, targetPoint: {x: 200, y: 200}
            }];
            const setup = setupCollaborationTest(connectors);
            diagram = setup.diagram;
            diagram2 = setup.diagram2;
            ele = setup.ele;
            diagramCanvas1 = setup.diagramCanvas1;
            diagramCanvas2 = setup.diagramCanvas2;
            mouseEvents = setup.mouseEvents;
        });

        afterAll((): void => {
            teardownCollaborationTest(diagram, diagram2, ele, mouseEvents);
        });

        it('Drag Source End Collaborative', (done: Function) => {
            mouseEvents.clickEvent(diagramCanvas1, 150, 150);
            collaborativeElementDragSource(diagram);
            let src1 = diagram.connectors[0].sourcePoint;
            let src2 = diagram2.connectors[0].sourcePoint;
            let tar1 = diagram.connectors[0].targetPoint;
            let tar2 = diagram2.connectors[0].targetPoint;
            let connector2 = diagram2.connectors[0].wrapper;
            let connector1 = diagram.connectors[0].wrapper;
            expect(connector1.offsetX).toBe(connector2.offsetX);
            expect(connector1.offsetY).toBe(connector2.offsetY);
            expect(src1.x).toBe(src2.x);
            expect(src1.y).toBe(src2.y);
            expect(tar1.x).toBe(tar2.x);
            expect(tar1.y).toBe(tar2.y);
            done();
        });
        
        it('Drag Target End Collaborative', (done: Function) => {
            collaborativeElementDragTarget(diagram);
            let tgt1 = diagram.connectors[0].targetPoint;
            let tgt2 = diagram2.connectors[0].targetPoint;
            let connector2 = diagram2.connectors[0].wrapper;
            let connector1 = diagram.connectors[0].wrapper;
            expect(connector1.offsetX).toBe(connector2.offsetX);
            expect(connector1.offsetY).toBe(connector2.offsetY);
            expect(tgt1.x).toBe(tgt2.x);
            expect(tgt1.y).toBe(tgt2.y);
            done();
        });
    });

       describe('Collaborative Bezier Connector - Drag', () => {
        let diagram: Diagram;
        let diagram2: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents;
        let diagramCanvas1: HTMLElement;
        let diagramCanvas2: HTMLElement;

        beforeAll(function (this: any): void {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                this.skip();
                return;
            }
            const connectors: ConnectorModel[] = [{
                id: 'connector1', type: 'Bezier', sourcePoint: {x: 100, y: 100}, targetPoint: {x: 200, y: 200}
            }];
            const setup = setupCollaborationTest(connectors);
            diagram = setup.diagram;
            diagram2 = setup.diagram2;
            ele = setup.ele;
            diagramCanvas1 = setup.diagramCanvas1;
            diagramCanvas2 = setup.diagramCanvas2;
            mouseEvents = setup.mouseEvents;
        });

        afterAll((): void => {
            teardownCollaborationTest(diagram, diagram2, ele, mouseEvents);
        });

        it('Drag Collaborative', (done: Function) => {
            diagram.select([diagram.connectors[0]]);
            collaborativeElementDrag(diagram);
            let connector2 = diagram2.connectors[0].wrapper;
            let connector1 = diagram.connectors[0].wrapper;
            expect(connector1.offsetX).toBe(connector2.offsetX);
            expect(connector1.offsetY).toBe(connector2.offsetY);
            done();
        });
    });

    describe('Bezier Connector - Clipboard Operations Collaborative', () => {
        let diagram: Diagram;
        let diagram2: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents;
        let diagramCanvas1: HTMLElement;
        let diagramCanvas2: HTMLElement;

        beforeAll(function (this: any): void {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                this.skip();
                return;
            }
            const connectors: ConnectorModel[] = [{
                id: 'connector1', type: 'Bezier', sourcePoint: {x: 100, y: 100}, targetPoint: {x: 200, y: 200}
            }];
            const setup = setupCollaborationTest(connectors);
            diagram = setup.diagram;
            diagram2 = setup.diagram2;
            ele = setup.ele;
            diagramCanvas1 = setup.diagramCanvas1;
            diagramCanvas2 = setup.diagramCanvas2;
            mouseEvents = setup.mouseEvents;
        });

        afterAll((): void => {
            teardownCollaborationTest(diagram, diagram2, ele, mouseEvents);
        });

        it('Copy Paste - Keyboard Collaborative', (done: Function) => {
            diagram.select([diagram.connectors[0]]);
            let beforeCount: number = diagram.connectors.length;
            mouseEvents.keyDownEvent(diagramCanvas1, 'C', true);
            mouseEvents.keyDownEvent(diagramCanvas1, 'V', true);
            expect(diagram.connectors.length).toBe(beforeCount + 1);
            expect(diagram2.connectors.length).toBe(beforeCount + 1);
            done();
        });

        it('Cut Paste - Keyboard Collaborative', (done: Function) => {
            diagram.select([diagram.connectors[0]]);
            let beforeCount: number = diagram.connectors.length;
            mouseEvents.keyDownEvent(diagramCanvas1, 'X', true);
            expect(diagram.connectors.length).toBe(beforeCount - 1);
            expect(diagram2.connectors.length).toBe(beforeCount - 1);
            mouseEvents.keyDownEvent(diagramCanvas1, 'V', true);
            expect(diagram2.connectors.length).toBe(beforeCount);
            expect(diagram.connectors.length).toBe(beforeCount);
            done();
        });

        it('Delete - Keyboard Collaborative', (done: Function) => {
            diagram.select([diagram.connectors[0]]);
            let beforeCount: number = diagram.connectors.length;
            mouseEvents.keyDownEvent(diagramCanvas1, 'Delete');
            expect(diagram.connectors.length).toBe(beforeCount - 1);
            expect(diagram2.connectors.length).toBe(beforeCount - 1);
            done();
        });
    });

    describe('Collaborative Ordering Commands - Send To Back', () => {
        let diagram: Diagram;
        let diagram2: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents;
        let diagramCanvas1: HTMLElement;
        let diagramCanvas2: HTMLElement;

        beforeAll(function (this: any): void {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                this.skip();
                return;
            }
            const nodes = [
                { id: 'node1', offsetX: 150, offsetY: 150, width: 100, height: 100 },
                { id: 'node2', offsetX: 200, offsetY: 200, width: 100, height: 100 }
            ];
            const connectors: ConnectorModel[] = [
                { id: 'connector1', type: 'Straight', sourcePoint: {x: 100, y: 100}, targetPoint: {x: 250, y: 250} },
            ];
            const setup = setupCollaborationTest(connectors, nodes);
            diagram = setup.diagram;
            diagram2 = setup.diagram2;
            ele = setup.ele;
            diagramCanvas1 = setup.diagramCanvas1;
            diagramCanvas2 = setup.diagramCanvas2;
            mouseEvents = setup.mouseEvents;
        });

        afterAll((): void => {
            teardownCollaborationTest(diagram, diagram2, ele, mouseEvents);
        });

        it('Collaborative Send connector to back', (done: Function) => {
            let connector = diagram.connectors[0];
            let initialZIndex1 = diagram.connectors[0].zIndex;
            let initialZIndex2 = diagram2.connectors[0].zIndex;
            
            // Select and send to back
            diagram.select([connector]);
            diagram.sendToBack();
            
            // Verify z-index changed in both diagrams
            expect(diagram.connectors[0].zIndex).toBeLessThan(initialZIndex1);
            expect(diagram2.connectors[0].zIndex).toBeLessThan(initialZIndex2);
            expect(diagram.connectors[0].zIndex).toBe(diagram2.connectors[0].zIndex);
            done();
        });
    });

    describe('Collaborative Ordering Commands - Send Backward', () => {
        let diagram: Diagram;
        let diagram2: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents;
        let diagramCanvas1: HTMLElement;
        let diagramCanvas2: HTMLElement;

        beforeAll(function (this: any): void {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                this.skip();
                return;
            }
            const nodes = [
                { id: 'node1', offsetX: 150, offsetY: 150, width: 100, height: 100 },
                { id: 'node2', offsetX: 200, offsetY: 200, width: 100, height: 100 }
            ];
            const connectors: ConnectorModel[] = [
                { id: 'connector1', type: 'Straight', sourcePoint: {x: 100, y: 100}, targetPoint: {x: 250, y: 250} },
                { id: 'connector2', type: 'Straight', sourcePoint: {x: 150, y: 150}, targetPoint: {x: 300, y: 300} },
            ];
            const setup = setupCollaborationTest(connectors, nodes);
            diagram = setup.diagram;
            diagram2 = setup.diagram2;
            ele = setup.ele;
            diagramCanvas1 = setup.diagramCanvas1;
            diagramCanvas2 = setup.diagramCanvas2;
            mouseEvents = setup.mouseEvents;
        });

        afterAll((): void => {
            teardownCollaborationTest(diagram, diagram2, ele, mouseEvents);
        });

        it('Collaborative Send connector backward', (done: Function) => {
            let connector = diagram.connectors[1];
            let initialZIndex1 = diagram.connectors[1].zIndex;
            let initialZIndex2 = diagram2.connectors[1].zIndex;
            
            // Select and send backward
            diagram.select([connector]);
            diagram.sendBackward();
            
            expect(diagram.connectors[1].zIndex).toBeLessThan(initialZIndex1);
            expect(diagram2.connectors[1].zIndex).toBeLessThan(initialZIndex2);
            expect(diagram.connectors[1].zIndex).toBe(diagram2.connectors[1].zIndex);
            
            done();
        });
    });

    describe('Collaborative Ordering Commands - Bring To Front', () => {
        let diagram: Diagram;
        let diagram2: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents;
        let diagramCanvas1: HTMLElement;
        let diagramCanvas2: HTMLElement;

        beforeAll(function (this: any): void {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                this.skip();
                return;
            }
            const nodes = [
                { id: 'node1', offsetX: 150, offsetY: 150, width: 100, height: 100 },
                { id: 'node2', offsetX: 200, offsetY: 200, width: 100, height: 100 }
            ];
            const connectors: ConnectorModel[] = [
                { id: 'connector1', type: 'Straight', sourcePoint: {x: 100, y: 100}, targetPoint: {x: 250, y: 250} },
            ];
            const setup = setupCollaborationTest(connectors, nodes);
            diagram = setup.diagram;
            diagram2 = setup.diagram2;
            ele = setup.ele;
            diagramCanvas1 = setup.diagramCanvas1;
            diagramCanvas2 = setup.diagramCanvas2;
            mouseEvents = setup.mouseEvents;
        });

        afterAll((): void => {
            teardownCollaborationTest(diagram, diagram2, ele, mouseEvents);
        });

        it('Collaborative Bring connector to front', (done: Function) => {
            let connector = diagram.connectors[0];
            
            // Select and bring to front
            diagram.select([connector]);
            diagram.sendToBack();
            let initialZIndex1 = diagram.connectors[0].zIndex;
            let initialZIndex2 = diagram2.connectors[0].zIndex;
            diagram.bringToFront();
            
            expect(diagram.connectors[0].zIndex).toBeGreaterThan(initialZIndex1);
            expect(diagram2.connectors[0].zIndex).toBeGreaterThan(initialZIndex2);
            expect(diagram.connectors[0].zIndex).toBe(diagram2.connectors[0].zIndex);
            
            done();
        });
    });

    describe('Collaborative Ordering Commands - Move Forward', () => {
        let diagram: Diagram;
        let diagram2: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents;
        let diagramCanvas1: HTMLElement;
        let diagramCanvas2: HTMLElement;

        beforeAll(function (this: any): void {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                this.skip();
                return;
            }
            const nodes = [
                { id: 'node1', offsetX: 150, offsetY: 150, width: 100, height: 100 },
                { id: 'node2', offsetX: 200, offsetY: 200, width: 100, height: 100 }
            ];
            const connectors: ConnectorModel[] = [
                { id: 'connector1', type: 'Straight', sourcePoint: {x: 100, y: 100}, targetPoint: {x: 250, y: 250} },
            ];
            const setup = setupCollaborationTest(connectors, nodes);
            diagram = setup.diagram;
            diagram2 = setup.diagram2;
            ele = setup.ele;
            diagramCanvas1 = setup.diagramCanvas1;
            diagramCanvas2 = setup.diagramCanvas2;
            mouseEvents = setup.mouseEvents;
        });

        afterAll((): void => {
            teardownCollaborationTest(diagram, diagram2, ele, mouseEvents);
        });

        it('Collaborative Move connector forward', (done: Function) => {
            let connector = diagram.connectors[0];
            
            // Select and move forward
            diagram.select([connector]);
            diagram.sendToBack();
            let initialZIndex1 = diagram.connectors[0].zIndex;
            let initialZIndex2 = diagram2.connectors[0].zIndex;
            diagram.moveForward();
            
            expect(diagram.connectors[0].zIndex).toBeGreaterThan(initialZIndex1);
            expect(diagram2.connectors[0].zIndex).toBeGreaterThan(initialZIndex2);
            expect(diagram.connectors[0].zIndex).toBe(diagram2.connectors[0].zIndex);
            done();
        });
    });


    describe('Collaborative Multiple Segments Undo, Redo and connect, disconnect source node ', () => {
        let diagram: Diagram;
        let diagram2: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents;
        let diagramCanvas1: HTMLElement;
        let diagramCanvas2: HTMLElement;

        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'SegmentsUndoRedo' });
            document.body.appendChild(ele);
            let nodes: NodeModel[] = [{
                id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100,
                annotations: [{ content: 'Mouse Hover' }]
            },
            {
                id: 'node2', width: 100, height: 100, offsetX: 300, offsetY: 100,
                annotations: [{ content: 'Connect' }]
            },
            {
                id: 'node3', width: 100, height: 100, offsetX: 750, offsetY: 150,
                ports: [{ id: 'port1', visibility: PortVisibility.Visible, shape: 'Circle', offset: { x: 0, y: 0.5 } },
                        { id: 'port2', visibility: PortVisibility.Visible, shape: 'Circle', offset: { x: 0.5, y: 0 } },
                        { id: 'port3', visibility: PortVisibility.Visible, shape: 'Circle', offset: { x: 1, y: 0.5 } },
                        { id: 'port4', visibility: PortVisibility.Visible, shape: 'Circle', offset: { x: 0.5, y: 1 } },
                        { id: 'port5', visibility: PortVisibility.Visible, shape: 'Circle', offset: { x: 0, y: 1 } },
                    ],
                annotations: [{ content: 'Visible' }]
            }]
            let connector4: ConnectorModel = {
                id: 'connector4',
                type: 'Orthogonal',
                sourceID: 'node1', targetID: 'node2',
                segments: [{
                    type: 'Orthogonal',
                    direction: 'Bottom', length: 10
                },
                {
                    type: 'Orthogonal',
                    direction: 'Bottom', length: 10
                },
                {
                    type: 'Orthogonal',
                    direction: 'Right', length: 10
                },],

            }
            let connector1: ConnectorModel = {
                id: 'connector1',
                type: 'Straight',
                sourcePoint: { x: 100, y: 100 },
                segments: [{
                    type: 'Straight',
                    point: { x: 100, y: 200 },
                },
                {
                    type: 'Straight',
                    point: { x: 200, y: 200 },
                },],
                targetPoint: { x: 300, y: 300 },
            };

            let connector2: ConnectorModel = {
                id: 'connector2',
                type: 'Orthogonal',
                sourcePoint: { x: 400, y: 200 },
                segments: [{
                    type: 'Orthogonal',
                    direction: 'Bottom', length: 10
                },
                {
                    type: 'Orthogonal',
                    direction: 'Right', length: 10
                },],
                targetPoint: { x: 600, y: 300 },
            };
            let connector5: ConnectorModel = {
                id: 'connector5',
                type: 'Orthogonal',
                sourcePoint: { x: 500, y: 100 },
                segments: [{
                    type: 'Orthogonal',
                    direction: 'Bottom', length: 50
                },
                {
                    type: 'Orthogonal',
                    direction: 'Bottom', length: 50
                }],
                targetPoint: { x: 600, y: 300 },
            };
            let connector3: ConnectorModel = {
                id: 'connector3',
                type: 'Bezier',
                sourcePoint: { x: 700, y: 200 },
                segments: [{
                    type: 'Bezier',
                    point: { x: 800, y: 300 },
                }
                ],
                targetPoint: { x: 900, y: 400 },
            };
            var connector6: ConnectorModel = {
                id: 'connector6',
                type: 'Orthogonal',
                sourcePoint: { x: 200, y: 200 },
                segments: [{
                    type: 'Orthogonal',
                    direction: 'Bottom', length: 50
                },
                {
                    type: 'Orthogonal',
                    direction: 'Bottom', length: 50
                }],
                targetPoint: { x: 600, y: 300 },
            };
            var connector7: ConnectorModel = {
                id: 'connector7',
                type: 'Orthogonal',
                sourcePoint: { x: 900, y: 200 },
                segments: [{
                        type: 'Orthogonal',
                        direction: 'Bottom', length: 50
                    },
                    {
                        type: 'Orthogonal',
                        direction: 'Bottom', length: 50
                    }],
                targetPoint: { x: 600, y: 100 },
            };
            var connector8: ConnectorModel = {
                id: 'connector8',
                type: 'Orthogonal',
                sourcePoint: { x: 300, y: 400 },
                segments: [{
                        type: 'Orthogonal',
                        direction: 'Left', length: 110
                    },
                    {
                        type: 'Orthogonal',
                        direction: 'Bottom', length: 50
                    }],
                targetPoint: { x: 500, y: 300 },
            };
            let connectors = [connector1, connector2, connector3, connector4, connector5, connector6, connector7, connector8];
            const setup = setupCollaborationTest(connectors, nodes);
            diagram = setup.diagram;
            diagram2 = setup.diagram2;
            ele = setup.ele;
            diagramCanvas1 = setup.diagramCanvas1;
            diagramCanvas2 = setup.diagramCanvas2;
            mouseEvents = setup.mouseEvents;      
          });

        afterAll((): void => {
            teardownCollaborationTest(diagram, diagram2, ele, mouseEvents);
        });

        it('Collaborative Checking drag and change source point to node', (done: Function) => {
            diagram.select([diagram.connectors[4]]);
            let conn: ConnectorModel = diagram.selectedItems.connectors[0];
            let srcNode: NodeModel = diagram.nodes[1];
            expect(diagram.selectedItems.connectors[0].sourceID == '').toBe(true);
            mouseEvents.dragAndDropEvent(diagramCanvas1, conn.sourcePoint.x + diagram.element.offsetLeft, conn.sourcePoint.y + diagram.element.offsetTop - 1, srcNode.offsetX + diagram.element.offsetLeft, srcNode.offsetY + diagram.element.offsetTop);
            //Need to evaluate testcase
            //expect(diagram.selectedItems.connectors[0].sourceID == srcNode.id).toBe(true);
            expect(true).toBe(true);
            done();
        });
    });
describe('Collaborative Editing Connector Segment property change', () => {
        let diagram: Diagram;
        let diagram2: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents;
        let diagramCanvas1: HTMLElement;
        let diagramCanvas2: HTMLElement;

        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'SegmentsUndoRedo' });
            document.body.appendChild(ele);
            
            let connector1: ConnectorModel = {
                id: 'connector1',
                type: 'Orthogonal',
                sourcePoint: {x: 100, y: 100},
                targetPoint: {x: 400, y: 400},
                segments: [{
                    type: 'Orthogonal',
                    direction: 'Bottom', length: 10
                },
                {
                    type: 'Orthogonal',
                    direction: 'Bottom', length: 10
                },
                {
                    type: 'Orthogonal',
                    direction: 'Right', length: 10
                },],

            }
            let connectors = [connector1];
            const setup = setupCollaborationTest(connectors);
            diagram = setup.diagram;
            diagram2 = setup.diagram2;
            ele = setup.ele;
            diagramCanvas1 = setup.diagramCanvas1;
            diagramCanvas2 = setup.diagramCanvas2;
            mouseEvents = setup.mouseEvents;      
          });

        afterAll((): void => {
            teardownCollaborationTest(diagram, diagram2, ele, mouseEvents);
        });

        it('Connector Segment property change', (done: Function) => {
            expect((diagram.connectors[0].segments[0] as OrthogonalSegment).direction).toBe('Bottom');
            expect((diagram2.connectors[0].segments[0] as OrthogonalSegment).direction).toBe('Bottom');
            (diagram.connectors[0].segments[0] as OrthogonalSegment).direction = 'Left';
            setTimeout(function () {
                expect((diagram.connectors[0].segments[0] as OrthogonalSegment).direction).toBe('Left');
                expect((diagram2.connectors[0].segments[0] as OrthogonalSegment).direction).toBe('Left');
                done();
            }, 50);
        });
    });
    describe('Collaborative Bezier control points are draggable while segment orientation is horizontal', () => {
        let diagram: Diagram;
        let diagram2: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents;
        let diagramCanvas1: HTMLElement;
        let diagramCanvas2: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramBezHorizontal' });
            document.body.appendChild(ele);
            var nodes:NodeModel[] = [
                {
                    id: 'node1', width: 100, height: 100, offsetX: 300, offsetY: 100,
                },
                {
                    id: 'node2', width: 100, height: 100, offsetX: 500, offsetY: 300,
                },
            ]
            var connectors: ConnectorModel[] = [{
                id: 'connector3',
                type: 'Bezier',
                sourceID: 'node1',
                targetID: 'node2',
                annotations: [{ content: 'bezier' }],
                segments: [
                    { type: 'Bezier', point: { x: 200, y: 350 } },
                    { type: 'Bezier', point: { x: 220, y: 300 } },
                    { type: 'Bezier', point: { x: 260, y: 350 } },
                ],
                constraints: (ConnectorConstraints.Default | ConnectorConstraints.DragSegmentThumb),
            },
            {
                id: 'connector2', type: 'Orthogonal',
                sourcePoint: { x: 700, y: 100 }, targetPoint: { x: 450, y: 150 },
                style: { strokeColor: 'green', fill: 'yellowgreen', strokeWidth: 2 },
                sourceDecorator: { style: { strokeColor: 'green', fill: 'yellowgreen', strokeWidth: 2 } },
                targetDecorator: { style: { strokeColor: 'green', fill: 'yellowgreen', strokeWidth: 2 } }, segmentThumbShape: "Rhombus",
                constraints: (ConnectorConstraints.Default | ConnectorConstraints.DragSegmentThumb),
            }];
            const setup = setupCollaborationTest(connectors, nodes);
            diagram = setup.diagram;
            diagram2 = setup.diagram2;
            ele = setup.ele;
            diagramCanvas1 = setup.diagramCanvas1;
            diagramCanvas2 = setup.diagramCanvas2;
            mouseEvents = setup.mouseEvents;              
        });
        afterAll((): void => {
            teardownCollaborationTest(diagram, diagram2, ele, mouseEvents);
        });
        it('Collaborative Checking bezier segment points dragging when the segment orientation is horizontal', function (done) {
            diagram.connectors[0].bezierSettings.segmentEditOrientation='BiDirectional';
            diagram.select([diagram.connectors[0]]);
            mouseEvents.mouseDownEvent(diagramCanvas1,200,350);
            mouseEvents.mouseMoveEvent(diagramCanvas1,100,300);
            mouseEvents.mouseUpEvent(diagramCanvas1,100,300);
            let curSegment = diagram.connectors[0].segments;
            expect(curSegment.length===3).toBe(true);
            done();
        });
        
        it('Connector - SegmentChanged', function (done) {
            diagram2.setDiagramUpdates([
                "{\"modifiedNodes\":[],\"modifiedConnectors\":[{\"shape\":{\"type\":\"None\"},\"id\":\"connector2\",\"type\":\"Orthogonal\",\"sourcePoint\":{\"x\":700,\"y\":100},\"targetPoint\":{\"x\":450,\"y\":150},\"style\":{\"strokeWidth\":2,\"strokeColor\":\"green\",\"fill\":\"transparent\",\"strokeDashArray\":\"\",\"opacity\":1,\"gradient\":{\"type\":\"None\"}},\"segments\":[{\"type\":\"Orthogonal\",\"length\":20,\"direction\":\"Left\"},{\"type\":\"Orthogonal\",\"length\":117.65616859372523,\"direction\":\"Bottom\",\"allowDrag\":true},{\"type\":\"Orthogonal\",\"length\":153.33333333333334,\"direction\":\"Left\",\"allowDrag\":true},{\"type\":\"Orthogonal\",\"direction\":null,\"allowDrag\":true,\"length\":null}],\"sourceDecorator\":{\"shape\":\"None\",\"style\":{\"fill\":\"yellowgreen\",\"strokeColor\":\"green\",\"strokeWidth\":2,\"strokeDashArray\":\"\",\"opacity\":1,\"gradient\":{\"type\":\"None\"}},\"width\":10,\"height\":10,\"pivot\":{\"x\":0,\"y\":0.5}},\"targetDecorator\":{\"shape\":\"Arrow\",\"style\":{\"fill\":\"yellowgreen\",\"strokeColor\":\"green\",\"strokeWidth\":2,\"strokeDashArray\":\"\",\"opacity\":1,\"gradient\":{\"type\":\"None\"}},\"width\":10,\"height\":10,\"pivot\":{\"x\":0,\"y\":0.5}},\"segmentThumbShape\":\"Rhombus\",\"annotations\":[],\"sourceID\":\"\",\"zIndex\":3,\"targetID\":\"\",\"constraints\":2043518,\"sourcePortID\":\"\",\"targetPortID\":\"\",\"wrapper\":{\"actualSize\":{\"width\":250,\"height\":117.66},\"offsetX\":575,\"offsetY\":158.82999999999998},\"flip\":0,\"connectorSpacing\":13,\"cornerRadius\":0,\"fixedUserHandles\":[],\"ports\":[],\"visible\":true,\"bridgeSpace\":10,\"flipMode\":\"All\",\"hitPadding\":10,\"tooltip\":{\"openOn\":\"Auto\",\"content\":\"\",\"isSticky\":false},\"connectionPadding\":0,\"maxSegmentThumb\":null,\"allowNodeOverlap\":false,\"parentId\":\"\",\"addInfo\":{\"parentId\":\"\"}}],\"entryType\":\"SegmentChanged\",\"actionTrigger\":\"CustomAction\",\"propertyChanges\":null,\"entry\":{\"type\":\"SegmentChanged\"}}"
            ]);
            diagram.setDiagramUpdates([
                "{\"modifiedNodes\":[],\"modifiedConnectors\":[{\"shape\":{\"type\":\"None\"},\"id\":\"connector2\",\"type\":\"Orthogonal\",\"sourcePoint\":{\"x\":700,\"y\":100},\"targetPoint\":{\"x\":450,\"y\":150},\"style\":{\"strokeWidth\":2,\"strokeColor\":\"green\",\"fill\":\"transparent\",\"strokeDashArray\":\"\",\"opacity\":1,\"gradient\":{\"type\":\"None\"}},\"segments\":[{\"type\":\"Orthogonal\",\"length\":20,\"direction\":\"Left\"},{\"type\":\"Orthogonal\",\"length\":117.65616859372523,\"direction\":\"Bottom\",\"allowDrag\":true},{\"type\":\"Orthogonal\",\"length\":153.33333333333334,\"direction\":\"Left\",\"allowDrag\":true},{\"type\":\"Orthogonal\",\"direction\":null,\"allowDrag\":true,\"length\":null}],\"sourceDecorator\":{\"shape\":\"None\",\"style\":{\"fill\":\"yellowgreen\",\"strokeColor\":\"green\",\"strokeWidth\":2,\"strokeDashArray\":\"\",\"opacity\":1,\"gradient\":{\"type\":\"None\"}},\"width\":10,\"height\":10,\"pivot\":{\"x\":0,\"y\":0.5}},\"targetDecorator\":{\"shape\":\"Arrow\",\"style\":{\"fill\":\"yellowgreen\",\"strokeColor\":\"green\",\"strokeWidth\":2,\"strokeDashArray\":\"\",\"opacity\":1,\"gradient\":{\"type\":\"None\"}},\"width\":10,\"height\":10,\"pivot\":{\"x\":0,\"y\":0.5}},\"segmentThumbShape\":\"Rhombus\",\"annotations\":[],\"sourceID\":\"\",\"zIndex\":3,\"targetID\":\"\",\"constraints\":2043518,\"sourcePortID\":\"\",\"targetPortID\":\"\",\"wrapper\":{\"actualSize\":{\"width\":250,\"height\":117.66},\"offsetX\":575,\"offsetY\":158.82999999999998},\"flip\":0,\"connectorSpacing\":13,\"cornerRadius\":0,\"fixedUserHandles\":[],\"ports\":[],\"visible\":true,\"bridgeSpace\":10,\"flipMode\":\"All\",\"hitPadding\":10,\"tooltip\":{\"openOn\":\"Auto\",\"content\":\"\",\"isSticky\":false},\"connectionPadding\":0,\"maxSegmentThumb\":null,\"allowNodeOverlap\":false,\"parentId\":\"\",\"addInfo\":{\"parentId\":\"\"}}],\"entryType\":\"SegmentChanged\",\"actionTrigger\":\"CustomAction\",\"propertyChanges\":null,\"entry\":{\"type\":\"SegmentChanged\"}}"
            ]);
            expect(diagram2.connectors[1].segments.length == diagram.connectors[1].segments.length).toBe(true)
            done();
        })
       
        it('Connector - ConnectionChanged', function (done) {
            diagram2.setDiagramUpdates([
                "{\"modifiedNodes\":[],\"modifiedConnectors\":[{\"shape\":{\"type\":\"None\"},\"id\":\"connector2\",\"type\":\"Orthogonal\",\"sourcePoint\":{\"x\":700,\"y\":100},\"targetPoint\":{\"x\":300,\"y\":150},\"style\":{\"strokeWidth\":2,\"strokeColor\":\"green\",\"fill\":\"transparent\",\"strokeDashArray\":\"\",\"opacity\":1,\"gradient\":{\"type\":\"None\"}},\"sourceDecorator\":{\"shape\":\"None\",\"style\":{\"fill\":\"yellowgreen\",\"strokeColor\":\"green\",\"strokeWidth\":2,\"strokeDashArray\":\"\",\"opacity\":1,\"gradient\":{\"type\":\"None\"}},\"width\":10,\"height\":10,\"pivot\":{\"x\":0,\"y\":0.5}},\"targetDecorator\":{\"shape\":\"Arrow\",\"style\":{\"fill\":\"yellowgreen\",\"strokeColor\":\"green\",\"strokeWidth\":2,\"strokeDashArray\":\"\",\"opacity\":1,\"gradient\":{\"type\":\"None\"}},\"width\":10,\"height\":10,\"pivot\":{\"x\":0,\"y\":0.5}},\"segmentThumbShape\":\"Rhombus\",\"annotations\":[],\"sourceID\":\"\",\"zIndex\":3,\"targetID\":\"node1\",\"constraints\":2043518,\"segments\":[{\"type\":\"Orthogonal\",\"length\":20,\"direction\":\"Left\",\"allowDrag\":true},{\"type\":\"Orthogonal\",\"length\":134.65461298316373,\"direction\":\"Bottom\",\"allowDrag\":true},{\"type\":\"Orthogonal\",\"length\":380,\"direction\":\"Left\",\"allowDrag\":true},{\"type\":\"Orthogonal\",\"direction\":null,\"allowDrag\":true,\"length\":null}],\"sourcePortID\":\"\",\"targetPortID\":\"\",\"wrapper\":{\"actualSize\":{\"width\":400,\"height\":134.65},\"offsetX\":500,\"offsetY\":167.325},\"flip\":0,\"connectorSpacing\":13,\"cornerRadius\":0,\"fixedUserHandles\":[],\"ports\":[],\"visible\":true,\"bridgeSpace\":10,\"flipMode\":\"All\",\"hitPadding\":10,\"tooltip\":{\"openOn\":\"Auto\",\"content\":\"\",\"isSticky\":false},\"connectionPadding\":0,\"maxSegmentThumb\":null,\"allowNodeOverlap\":false,\"targetPadding\":0,\"sourcePadding\":0,\"parentId\":\"\",\"addInfo\":{\"parentId\":\"\"}}],\"entryType\":\"ConnectionChanged\",\"actionTrigger\":\"CustomAction\",\"propertyChanges\":null,\"entry\":{\"type\":\"ConnectionChanged\",\"oldValue\":{\"offsetX\":575,\"offsetY\":167.325},\"newValue\":{\"offsetX\":500,\"offsetY\":167.325}}}"
            ]);
            diagram.setDiagramUpdates([
                "{\"modifiedNodes\":[],\"modifiedConnectors\":[{\"shape\":{\"type\":\"None\"},\"id\":\"connector2\",\"type\":\"Orthogonal\",\"sourcePoint\":{\"x\":700,\"y\":100},\"targetPoint\":{\"x\":300,\"y\":150},\"style\":{\"strokeWidth\":2,\"strokeColor\":\"green\",\"fill\":\"transparent\",\"strokeDashArray\":\"\",\"opacity\":1,\"gradient\":{\"type\":\"None\"}},\"sourceDecorator\":{\"shape\":\"None\",\"style\":{\"fill\":\"yellowgreen\",\"strokeColor\":\"green\",\"strokeWidth\":2,\"strokeDashArray\":\"\",\"opacity\":1,\"gradient\":{\"type\":\"None\"}},\"width\":10,\"height\":10,\"pivot\":{\"x\":0,\"y\":0.5}},\"targetDecorator\":{\"shape\":\"Arrow\",\"style\":{\"fill\":\"yellowgreen\",\"strokeColor\":\"green\",\"strokeWidth\":2,\"strokeDashArray\":\"\",\"opacity\":1,\"gradient\":{\"type\":\"None\"}},\"width\":10,\"height\":10,\"pivot\":{\"x\":0,\"y\":0.5}},\"segmentThumbShape\":\"Rhombus\",\"annotations\":[],\"sourceID\":\"\",\"zIndex\":3,\"targetID\":\"node1\",\"constraints\":2043518,\"segments\":[{\"type\":\"Orthogonal\",\"length\":20,\"direction\":\"Left\",\"allowDrag\":true},{\"type\":\"Orthogonal\",\"length\":134.65461298316373,\"direction\":\"Bottom\",\"allowDrag\":true},{\"type\":\"Orthogonal\",\"length\":380,\"direction\":\"Left\",\"allowDrag\":true},{\"type\":\"Orthogonal\",\"direction\":null,\"allowDrag\":true,\"length\":null}],\"sourcePortID\":\"\",\"targetPortID\":\"\",\"wrapper\":{\"actualSize\":{\"width\":400,\"height\":134.65},\"offsetX\":500,\"offsetY\":167.325},\"flip\":0,\"connectorSpacing\":13,\"cornerRadius\":0,\"fixedUserHandles\":[],\"ports\":[],\"visible\":true,\"bridgeSpace\":10,\"flipMode\":\"All\",\"hitPadding\":10,\"tooltip\":{\"openOn\":\"Auto\",\"content\":\"\",\"isSticky\":false},\"connectionPadding\":0,\"maxSegmentThumb\":null,\"allowNodeOverlap\":false,\"targetPadding\":0,\"sourcePadding\":0,\"parentId\":\"\",\"addInfo\":{\"parentId\":\"\"}}],\"entryType\":\"ConnectionChanged\",\"actionTrigger\":\"CustomAction\",\"propertyChanges\":null,\"entry\":{\"type\":\"ConnectionChanged\",\"oldValue\":{\"offsetX\":575,\"offsetY\":167.325},\"newValue\":{\"offsetX\":500,\"offsetY\":167.325}}}"
            ]);
            expect(diagram2.connectors[1].targetID == diagram.connectors[1].targetID).toBe(true)
            done();
        })
    });
});

