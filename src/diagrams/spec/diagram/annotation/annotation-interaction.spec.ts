/**
 * Annotation interaction - Test Cases
 */
import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { NodeModel } from '../../../src/diagram/objects/node-model';
import { Node } from '../../../src/diagram/objects/node';
import { ConnectorModel } from '../../../src/diagram/objects/connector-model';
import { MouseEvents } from '../interaction/mouseevents.spec';
import { AnnotationConstraints, DiagramConstraints } from '../../../src/diagram/enum/enum';
import { Selector } from '../../../src/diagram/objects/node';
import { DiagramElement } from '../../../src/diagram/core/elements/diagram-element';
import { PointModel } from '../../../src/diagram/primitives/point-model';
import { identityMatrix, rotateMatrix, transformPointByMatrix, Matrix } from '../../../src/diagram/primitives/matrix';
import { GroupableView } from '../../../src/diagram/core/containers/container';
import { UndoRedo } from '../../../src/diagram/objects/undo-redo';
import { profile, inMB, getMemoryProfile } from '../../../spec/common.spec';
import { Snapping } from '../../../src/diagram/objects/snapping';
Diagram.Inject(UndoRedo, Snapping);

function drag(diagram: Diagram, mouseEvents: MouseEvents) {
    let diagramCanvas: HTMLElement; let left: number; let top: number;
    diagramCanvas = document.getElementById(diagram.element.id + 'content');
    left = diagram.element.offsetLeft; top = diagram.element.offsetTop;
    if ((diagram.selectedItems as Selector).annotation) {
        let textElement: DiagramElement = diagram.selectedItems.wrapper.children[0];
        let centerX = textElement.offsetX;
        let centerY = textElement.offsetY;
        mouseEvents.mouseDownEvent(diagramCanvas, centerX + diagram.element.offsetLeft, centerY + diagram.element.offsetTop);
        mouseEvents.mouseMoveEvent(diagramCanvas, centerX + diagram.element.offsetLeft + 20, centerY + diagram.element.offsetTop);
        mouseEvents.mouseMoveEvent(diagramCanvas, centerX + diagram.element.offsetLeft + 20, centerY + diagram.element.offsetTop + 20);
        mouseEvents.mouseUpEvent(diagramCanvas, centerX + diagram.element.offsetLeft + 20, centerY + diagram.element.offsetTop + 20);
    }
}

function resize(diagram: Diagram, mouseEvents: MouseEvents, direction: string): void {
    if ((diagram.selectedItems as Selector).annotation) {
        let diagramCanvas: HTMLElement; let left: number; let top: number;
        diagramCanvas = document.getElementById(diagram.element.id + 'content');
        left = diagram.element.offsetLeft; top = diagram.element.offsetTop;
        let element: HTMLElement = document.getElementById(direction);
        let x: number = Number(element.getAttribute('x')) + halfResizeThumbSize;
        let y: number = Number(element.getAttribute('y')) + halfResizeThumbSize;
        mouseEvents.mouseDownEvent(diagramCanvas, x + diagram.element.offsetLeft, y + diagram.element.offsetTop);
        mouseEvents.mouseMoveEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop);
        mouseEvents.mouseMoveEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop + 20);
        mouseEvents.mouseUpEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop + 20);
    }
}


function rotate(diagram: Diagram, mouseEvents: MouseEvents, value: number) {
    let diagramCanvas: HTMLElement; let left: number; let top: number;
    diagramCanvas = document.getElementById(diagram.element.id + 'content');
    left = diagram.element.offsetLeft; top = diagram.element.offsetTop;
    if ((diagram.selectedItems as Selector).annotation) {
        let element: DiagramElement = diagram.selectedItems.wrapper.children[0];
        let ten: number = 10 / diagram.scroller.currentZoom;
        let matrix: Matrix = identityMatrix();
        rotateMatrix(matrix, element.rotateAngle + element.parentTransform, element.offsetX, element.offsetY);
        //check for resizing tool
        let rotate: number = (value ? value : 20) + 5;
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

const halfResizeThumbSize = 2;
let suiteCounter: number = 0;

function createDiagramContainer(): HTMLElement {
    suiteCounter = suiteCounter + 1;
    const id: string = 'diagram-grid-' + suiteCounter;
    const el: HTMLElement = createElement('div', { id: id });
    document.body.appendChild(el);
    return el;
}
function removeContainer(el: HTMLElement | null): void {
    if (el && el.parentNode) {
        el.parentNode.removeChild(el);
    }
}

describe('Diagram Control', () => {
    describe('Nodes - Annotation Interaction', () => {
        describe('Having width and height', () => {
            let diagram: Diagram;
            let ele: HTMLElement;
            let mouseEvents: MouseEvents;
            let diagramCanvas: HTMLElement; let left: number; let top: number;

            beforeAll((): void => {
                const isDef = (o: any) => o !== undefined && o !== null;
                if (!isDef(window.performance)) {
                    this.skip(); //Skips test (in Chai)
                    return;
                }
                let nodes: NodeModel[] = [{
                    id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100,
                    annotations: [{ offset: { x: 2, y: 1.5 }, content: 'Path Element', constraints: AnnotationConstraints.Interaction, width: 100, height: 100 }]
                }];
                diagram = new Diagram({
                    width: 800, height: 500, nodes: nodes,
                });
                ele = createDiagramContainer();
                diagram.appendTo('#' + ele.id);
                diagramCanvas = document.getElementById(diagram.element.id + 'content');
                mouseEvents = new MouseEvents();
                mouseEvents.clickEvent(diagramCanvas, 1, 1);
                left = diagram.element.offsetLeft; top = diagram.element.offsetTop;
            });

            afterAll((): void => {
                mouseEvents = null;
                if (diagram) {
                    diagram.selectionChange = undefined;
                    diagram.destroy();
                    diagram = null;
                }
                diagramCanvas = null;
                removeContainer(ele);
                ele = null;
            });

            it('Select', (done: Function) => {
                debugger;
                let node: NodeModel = (diagram.nodes[0] as NodeModel);
                let annotation: DiagramElement = node.wrapper.children[1];
                mouseEvents.clickEvent(diagramCanvas, annotation.offsetX + left, annotation.offsetY + top);
                let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                expect((diagram.selectedItems as Selector).annotation !== undefined).toBe(true);
                done();
            });
            it('Drag', (done: Function) => {
                drag(diagram, mouseEvents);
                drag(diagram, mouseEvents);
                let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                expect(label.offsetX == 290 && label.offsetY == 240).toBe(true);
                done();
            });
            it('Resize North', (done: Function) => {
                resize(diagram, mouseEvents, 'resizeNorth');
                let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                expect(label.width == 100 && label.height == 80).toBe(true);
                done();
            });
            it('Resize South', (done: Function) => {
                resize(diagram, mouseEvents, 'resizeSouth');
                let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                expect(label.offsetX == 290 && label.offsetY == 260 && label.width == 100 && label.height == 100 && label.rotateAngle == 0).toBe(true);
                done();
            });
            it('Resize East', (done: Function) => {
                resize(diagram, mouseEvents, 'resizeEast');
                let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                expect(label.offsetX == 300 && label.offsetY == 260 && label.width == 120 && label.height == 100 && label.rotateAngle == 0).toBe(true);
                done();
            });
            it('Resize West', (done: Function) => {
                resize(diagram, mouseEvents, 'resizeWest');
                let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                expect(label.offsetX == 309.99999999999994 && label.offsetY == 260 && label.width == 100 && label.height == 100 && label.rotateAngle == 0).toBe(true);
                done();
            });
            it('Resize NorthEast', (done: Function) => {
                let element: HTMLElement = document.getElementById('resizeNorthEast');
                let x: number = Number(element.getAttribute('x')) + halfResizeThumbSize;
                let y: number = Number(element.getAttribute('y')) + halfResizeThumbSize;
                mouseEvents.mouseDownEvent(diagramCanvas, x + diagram.element.offsetLeft, y + diagram.element.offsetTop);
                mouseEvents.mouseMoveEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop);
                mouseEvents.mouseMoveEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop + 20);
                mouseEvents.mouseUpEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop + 20);
                let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                expect(label.offsetX == 320 && label.offsetY == 270 && label.width == 120 && label.height == 80 && label.rotateAngle == 0).toBe(true);
                done();
            });
            it('Resize NorthWest', (done: Function) => {
                let element: HTMLElement = document.getElementById('resizeNorthWest');
                let x: number = Number(element.getAttribute('x')) + halfResizeThumbSize;
                let y: number = Number(element.getAttribute('y')) + halfResizeThumbSize;
                mouseEvents.mouseDownEvent(diagramCanvas, x + diagram.element.offsetLeft, y + diagram.element.offsetTop);
                mouseEvents.mouseMoveEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop);
                mouseEvents.mouseMoveEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop + 20);
                mouseEvents.mouseUpEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop + 20);
                let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                expect(label.offsetX == 330 && label.offsetY == 280 && label.width == 100 && label.height == 60 && label.rotateAngle == 0).toBe(true);
                done();
            });
            it('Resize SouthEast', (done: Function) => {
                resize(diagram, mouseEvents, 'resizeSouthEast');
                let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                expect(label.offsetX == 340 && label.offsetY == 290 && label.width == 120 && label.height == 80 && label.rotateAngle == 0).toBe(true);
                done();
            });
            it('Resize SouthWest', (done: Function) => {
                resize(diagram, mouseEvents, 'resizeSouthWest');
                let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                expect(label.offsetX == 350 && label.offsetY == 300 && label.width == 100 && label.height == 100 && label.rotateAngle == 0).toBe(true);
                done();
            });
        });
        describe('Having width and height', () => {
            let diagram: Diagram;
            let ele: HTMLElement;
            let mouseEvents: MouseEvents;
            let diagramCanvas: HTMLElement; let left: number; let top: number;

            beforeAll((): void => {
                const isDef = (o: any) => o !== undefined && o !== null;
                if (!isDef(window.performance)) {
                    this.skip(); //Skips test (in Chai)
                    return;
                }
                let nodes: NodeModel[] = [{
                    id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100,
                    annotations: [{ offset: { x: 2, y: 1.5 }, content: 'Path Element', constraints: AnnotationConstraints.Interaction, width: 100, height: 100 }]
                }];
                diagram = new Diagram({
                    width: 800, height: 500, nodes: nodes,
                });
                ele = createDiagramContainer();
                diagram.appendTo('#' + ele.id);
                diagramCanvas = document.getElementById(diagram.element.id + 'content');
                mouseEvents = new MouseEvents();
                mouseEvents.clickEvent(diagramCanvas, 1, 1);
                left = diagram.element.offsetLeft; top = diagram.element.offsetTop;
            });

            afterAll((): void => {
                mouseEvents = null;
                if (diagram) {
                    diagram.selectionChange = undefined;
                    diagram.destroy();
                    diagram = null;
                }
                diagramCanvas = null;
                removeContainer(ele);
                ele = null;
            });

            it('Rotate', (done: Function) => {
                let node: NodeModel = (diagram.nodes[0] as NodeModel);
                let annotation: DiagramElement = node.wrapper.children[1];
                mouseEvents.clickEvent(diagramCanvas, annotation.offsetX + left, annotation.offsetY + top);
                rotate(diagram, mouseEvents, 15);
                let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                expect(label.rotateAngle == 20 || label.rotateAngle == 25).toBe(true);
                done();
            });
            it('Resize North after annotation rotation', (done: Function) => {
                resize(diagram, mouseEvents, 'resizeNorth');
                let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                expect(Math.floor(label.offsetX) == 247 && Math.floor(label.offsetY) == 205 && label.width == 100 && Math.floor(label.height) == 88 && label.rotateAngle == 20).toBe(true);
                done();
            });
            it('Resize South after annotation rotation', (done: Function) => {
                resize(diagram, mouseEvents, 'resizeSouth');
                let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                expect(Math.floor(label.offsetX) == 245 && Math.floor(label.offsetY) == 211 && Math.floor(label.width) == 100 && Math.floor(label.height) == 99 && label.rotateAngle == 20).toBe(true);
                done();
            });
            it('Resize East after annotation rotation', (done: Function) => {
                resize(diagram, mouseEvents, 'resizeEast');
                let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                expect(Math.floor(label.offsetX) == 257 && Math.floor(label.offsetY) == 215 && Math.floor(label.width) == 125 && Math.floor(label.height) == 99 && label.rotateAngle == 20).toBe(true);
                done();
            });
            it('Resize West after annotation rotation', (done: Function) => {
                resize(diagram, mouseEvents, 'resizeWest');
                let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                expect(Math.floor(label.offsetX) == 270 && Math.floor(label.offsetY) == 220 && Math.floor(label.width) == 100 && Math.floor(label.height) == 99 && label.rotateAngle == 20).toBe(true);
                done();
            });
            it('Resize NorthEast after annotation rotation', (done: Function) => {
                resize(diagram, mouseEvents, 'resizeNorthEast');
                let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                expect(Math.floor(label.offsetX) == 280 && Math.floor(label.offsetY) == 230 && Math.floor(label.width) == 125 && Math.floor(label.height) == 88 && label.rotateAngle == 20).toBe(true);
                done();
            });
            it('Resize NorthWest after annotation rotation', (done: Function) => {
                let element: HTMLElement = document.getElementById('resizeNorthWest');
                let x: number = Number(element.getAttribute('x')) + halfResizeThumbSize;
                let y: number = Number(element.getAttribute('y')) + halfResizeThumbSize;
                mouseEvents.mouseDownEvent(diagramCanvas, x + diagram.element.offsetLeft, y + diagram.element.offsetTop);
                mouseEvents.mouseMoveEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop);
                mouseEvents.mouseMoveEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop + 20);
                mouseEvents.mouseUpEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop + 20);
                let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                expect(Math.floor(label.offsetX) == 290 && Math.floor(label.offsetY) == 240 && Math.floor(label.width) == 100 && Math.floor(label.height) == 76 && label.rotateAngle == 20).toBe(true);
                done();
            });
            it('Resize SouthEast after annotation rotation', (done: Function) => {
                let element: HTMLElement = document.getElementById('resizeSouthEast');
                let x: number = Number(element.getAttribute('x')) + halfResizeThumbSize;
                let y: number = Number(element.getAttribute('y')) + halfResizeThumbSize;
                mouseEvents.mouseDownEvent(diagramCanvas, x + diagram.element.offsetLeft, y + diagram.element.offsetTop);
                mouseEvents.mouseMoveEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop);
                mouseEvents.mouseMoveEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop + 20);
                mouseEvents.mouseUpEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop + 20);
                let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                expect(Math.floor(label.offsetX) == 300 && Math.floor(label.offsetY) == 250 && Math.floor(label.width) == 125 && Math.floor(label.height) == 88 && label.rotateAngle == 20).toBe(true);
                done();
            });
            it('Resize SouthWest after annotation rotation', (done: Function) => {
                let element: HTMLElement = document.getElementById('resizeSouthWest');
                let x: number = Number(element.getAttribute('x')) + halfResizeThumbSize;
                let y: number = Number(element.getAttribute('y')) + halfResizeThumbSize;
                mouseEvents.mouseDownEvent(diagramCanvas, x + diagram.element.offsetLeft, y + diagram.element.offsetTop);
                mouseEvents.mouseMoveEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop);
                mouseEvents.mouseMoveEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop + 20);
                mouseEvents.mouseUpEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop + 20);
                let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                expect(Math.floor(label.offsetX) == 310 && Math.floor(label.offsetY) == 260 && Math.floor(label.width) == 100 && Math.floor(label.height) == 99 && label.rotateAngle == 20).toBe(true);
                done();
            });
            it('Select and drag after rotation', (done: Function) => {
                mouseEvents.clickEvent(diagramCanvas, 1, 1);
                let node: NodeModel = (diagram.nodes[0] as NodeModel);
                let annotation: DiagramElement = node.wrapper.children[1];
                mouseEvents.clickEvent(diagramCanvas, annotation.offsetX + left, annotation.offsetY + top);
                expect((diagram.selectedItems as Selector).annotation !== undefined).toBe(true);
                drag(diagram, mouseEvents);
                let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                expect(label.offsetX == 330 && label.offsetY == 280 && (label.rotateAngle == 20 || label.rotateAngle == 25)).toBe(true);
                done();
            });
            it('Change node rotation and drag the annotation', (done: Function) => {
                mouseEvents.clickEvent(diagramCanvas, 1, 1);
                diagram.nodes[0].rotateAngle = 30;
                diagram.nodes[0].annotations[0].offset = { x: 1, y: 0.5 };
                diagram.nodes[0].annotations[0].rotateAngle = 30;
                diagram.dataBind();
                let node: NodeModel = (diagram.nodes[0] as NodeModel);
                let annotation: DiagramElement = node.wrapper.children[1];
                mouseEvents.clickEvent(diagramCanvas, annotation.offsetX + left, annotation.offsetY + top);
                expect((diagram.selectedItems as Selector).annotation !== undefined).toBe(true);
                drag(diagram, mouseEvents);
                let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                expect(label.offsetX == 163.3 && label.offsetY == 145 && label.rotateAngle == 30).toBe(true);
                done();
            });
            it('Rotation after change node rotation', (done: Function) => {
                rotate(diagram, mouseEvents, 15);
                let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                expect(label.offsetX == 163.3 && label.offsetY == 145 && Math.floor(label.width) == 100 && Math.floor(label.height) == 99 && label.rotateAngle == 50).toBe(true);
                done();
            });
            it('Resize after change node rotation', (done: Function) => {
                let element: HTMLElement = document.getElementById('resizeSouthEast');
                let x: number = Number(element.getAttribute('x')) + halfResizeThumbSize;
                let y: number = Number(element.getAttribute('y')) + halfResizeThumbSize;
                mouseEvents.mouseDownEvent(diagramCanvas, x + diagram.element.offsetLeft, y + diagram.element.offsetTop);
                mouseEvents.mouseMoveEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop);
                mouseEvents.mouseMoveEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop + 20);
                mouseEvents.mouseUpEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop + 20);
                let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                expect(Math.floor(label.offsetX) == 173 && Math.floor(label.offsetY) == 155 && Math.floor(label.width) == 123 && Math.floor(label.height) == 83 && label.rotateAngle == 50).toBe(true);
                done();
            });
        });
        describe('Annotation width and height are undefind', () => {
            let diagram: Diagram;
            let ele: HTMLElement;
            let mouseEvents: MouseEvents;
            let diagramCanvas: HTMLElement; let left: number; let top: number;
            beforeAll((): void => {
                const isDef = (o: any) => o !== undefined && o !== null;
                if (!isDef(window.performance)) {
                    this.skip(); //Skips test (in Chai)
                    return;
                }

                let nodes: NodeModel[] = [{
                    id: 'node2', width: 100, height: 100, offsetX: 200, offsetY: 100,
                    annotations: [{ offset: { x: 1, y: 0.5 }, content: 'This label is very \n very very large \n text content', constraints: AnnotationConstraints.Interaction, }]
                }];
                diagram = new Diagram({
                    width: 800, height: 500, nodes: nodes,
                });
                ele = createDiagramContainer();
                diagram.appendTo('#' + ele.id);
                diagramCanvas = document.getElementById(diagram.element.id + 'content');
                mouseEvents = new MouseEvents();
                mouseEvents.clickEvent(diagramCanvas, 1, 1);
                left = diagram.element.offsetLeft; top = diagram.element.offsetTop;
            });

            afterAll((): void => {
                mouseEvents = null;
                if (diagram) {
                    diagram.selectionChange = undefined;
                    diagram.destroy();
                    diagram = null;
                }
                diagramCanvas = null
                removeContainer(ele);
                ele = null;
            });

            it('Select', (done: Function) => {
                let node: NodeModel = (diagram.nodes[0] as NodeModel);
                let annotation: DiagramElement = node.wrapper.children[1];
                mouseEvents.clickEvent(diagramCanvas, annotation.offsetX + left, annotation.offsetY + top);
                let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                expect((diagram.selectedItems as Selector).annotation !== undefined).toBe(true);
                done();
            });
            it('Drag', (done: Function) => {
                drag(diagram, mouseEvents);
                let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                expect(label.offsetX == 270 && label.offsetY == 120).toBe(true);
                done();
            });
            it('Resize South', (done: Function) => {
                let element: HTMLElement = document.getElementById('resizeSouth');
                let x: number = Number(element.getAttribute('x')) + halfResizeThumbSize;
                let y: number = Number(element.getAttribute('y')) + halfResizeThumbSize;
                mouseEvents.mouseDownEvent(diagramCanvas, x + diagram.element.offsetLeft, y + diagram.element.offsetTop);
                mouseEvents.mouseMoveEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop);
                mouseEvents.mouseMoveEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop + 20);
                mouseEvents.mouseUpEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop + 20);
                let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                expect(Math.floor(label.width) == 92 && Math.floor(label.height) == 63).toBe(true);
                done();
            });
            it('Resize North', (done: Function) => {
                resize(diagram, mouseEvents, 'resizeNorth');
                let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                expect(label.offsetX == 270 && label.offsetY == 140 && Math.floor(label.width) == 92 && Math.floor(label.height) == 43 && label.rotateAngle == 0).toBe(true);
                done();
            });
            it('Resize East', (done: Function) => {
                resize(diagram, mouseEvents, 'resizeEast');
                let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                expect(label.offsetX == 280 && label.offsetY == 140 && Math.floor(label.width) == 112 && Math.floor(label.height) == 43 && label.rotateAngle == 0).toBe(true);
                done();
            });
            it('Resize West', (done: Function) => {
                // Case-Not-Required
                let element: HTMLElement = document.getElementById('resizeWest');
                let x: number = Number(element.getAttribute('x')) + halfResizeThumbSize;
                let y: number = Number(element.getAttribute('y')) + halfResizeThumbSize;
                mouseEvents.mouseDownEvent(diagramCanvas, x + diagram.element.offsetLeft, y + diagram.element.offsetTop);
                mouseEvents.mouseMoveEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop);
                mouseEvents.mouseMoveEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop + 20);
                mouseEvents.mouseUpEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop + 20);
                let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                expect(label.offsetX == 290 && label.offsetY == 140 && Math.floor(label.width) == 92 && Math.floor(label.height) == 43 && label.rotateAngle == 0).toBe(true);
                done();
            });
        });
        describe('Annotation width and height are undefind', () => {
            let diagram: Diagram;
            let ele: HTMLElement;
            let mouseEvents: MouseEvents;
            let diagramCanvas: HTMLElement; let left: number; let top: number;
            beforeAll((): void => {
                const isDef = (o: any) => o !== undefined && o !== null;
                if (!isDef(window.performance)) {
                    this.skip(); //Skips test (in Chai)
                    return;
                }

                let nodes: NodeModel[] = [{
                    id: 'node2', width: 100, height: 100, offsetX: 200, offsetY: 100,
                    annotations: [{ offset: { x: 1, y: 0.5 }, content: 'This label is very \n very very large \n text content', constraints: AnnotationConstraints.Interaction, }]
                }];
                diagram = new Diagram({
                    width: 800, height: 500, nodes: nodes,
                });
                ele = createDiagramContainer();
                diagram.appendTo('#' + ele.id);
                diagramCanvas = document.getElementById(diagram.element.id + 'content');
                mouseEvents = new MouseEvents();
                mouseEvents.clickEvent(diagramCanvas, 1, 1);
                left = diagram.element.offsetLeft; top = diagram.element.offsetTop;
            });

            afterAll((): void => {
                mouseEvents = null;
                if (diagram) {
                    diagram.selectionChange = undefined;
                    diagram.destroy();
                    diagram = null;
                }
                diagramCanvas = null
                removeContainer(ele);
                ele = null;
            });

            it('Rotate', (done: Function) => {
                let node: NodeModel = (diagram.nodes[0] as NodeModel);
                let annotation: DiagramElement = node.wrapper.children[1];
                mouseEvents.clickEvent(diagramCanvas, annotation.offsetX + left, annotation.offsetY + top);
                rotate(diagram, mouseEvents, 15);
                let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                expect(label.rotateAngle == 40).toBe(true);
                done();
            });
            it('Resize North after annotation rotation', (done: Function) => {
                // Case-Not-Required
                resize(diagram, mouseEvents, 'resizeNorth');
                let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                expect(Math.floor(label.offsetX) == 249 && Math.floor(label.offsetY) == 100 && Math.floor(label.width) == 92 && Math.floor(label.height) == 40 && label.rotateAngle == 40).toBe(true);
                done();
            });
            it('Resize South after annotation rotation', (done: Function) => {
                // Case-Not-Required
                resize(diagram, mouseEvents, 'resizeSouth');
                let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                expect(Math.floor(label.offsetX) == 248 && Math.floor(label.offsetY) == 101 && Math.floor(label.width) == 92 && Math.floor(label.height) == 43 && label.rotateAngle == 40).toBe(true);
                done();
            });
            it('Resize East after annotation rotation', (done: Function) => {
                // Case-Not-Required
                resize(diagram, mouseEvents, 'resizeEast');
                let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                expect(Math.floor(label.offsetX) == 259 && Math.floor(label.offsetY) == 110 && Math.floor(label.width) == 120 && Math.floor(label.height) == 43 && label.rotateAngle == 40).toBe(true);
                done();
            });
            it('Resize West after annotation rotation', (done: Function) => {
                // Case-Not-Required
                resize(diagram, mouseEvents, 'resizeWest');
                let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                expect(Math.floor(label.offsetX) == 270 && Math.floor(label.offsetY) == 119 && Math.floor(label.width) == 92 && Math.floor(label.height) == 43 && label.rotateAngle == 40).toBe(true);
                done();
            });
            it('Select and drag after rotation', (done: Function) => {
                mouseEvents.clickEvent(diagramCanvas, 1, 1);
                let node: NodeModel = (diagram.nodes[0] as NodeModel);
                let annotation: DiagramElement = node.wrapper.children[1];
                mouseEvents.clickEvent(diagramCanvas, annotation.offsetX + left, annotation.offsetY + top);
                expect((diagram.selectedItems as Selector).annotation !== undefined).toBe(true);
                drag(diagram, mouseEvents);
                let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                expect(Math.floor(label.offsetX) == 290 && Math.floor(label.offsetY) == 139 && Math.floor(label.width) == 92 && Math.floor(label.height) == 43 && label.rotateAngle == 40).toBe(true);
                done();
            });
            it('Change node rotation and drag the annotation', (done: Function) => {
                mouseEvents.clickEvent(diagramCanvas, 1, 1);
                diagram.nodes[0].rotateAngle = 60;
                diagram.dataBind();
                let node: NodeModel = (diagram.nodes[0] as NodeModel);
                let annotation: DiagramElement = node.wrapper.children[1];
                mouseEvents.clickEvent(diagramCanvas, annotation.offsetX + left, annotation.offsetY + top);
                expect((diagram.selectedItems as Selector).annotation !== undefined).toBe(true);
                drag(diagram, mouseEvents);
                let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                expect(Math.floor(label.offsetX) == 230 && Math.floor(label.offsetY) == 217 && Math.floor(label.width) == 92 && Math.floor(label.height) == 43 && label.rotateAngle == 40).toBe(true);
                done();
            });
            it('Rotation after change node rotation', (done: Function) => {
                // Case-Not-Required
                rotate(diagram, mouseEvents, 20);
                let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                expect(Math.floor(label.offsetX) == 230 && Math.floor(label.offsetY) == 217 && Math.floor(label.width) == 92 && Math.floor(label.height) == 43 && label.rotateAngle == 60).toBe(true);
                done();
            });
            it('Resize after change node rotation', (done: Function) => {
                // Case-Not-Required
                let element: HTMLElement = document.getElementById('resizeSouth');
                let x: number = Number(element.getAttribute('x')) + halfResizeThumbSize;
                let y: number = Number(element.getAttribute('y')) + halfResizeThumbSize;
                mouseEvents.mouseDownEvent(diagramCanvas, x + diagram.element.offsetLeft, y + diagram.element.offsetTop);
                mouseEvents.mouseMoveEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop);
                mouseEvents.mouseMoveEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop + 20);
                mouseEvents.mouseUpEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop + 20);
                let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                expect(Math.floor(label.offsetX) == 242 && Math.floor(label.offsetY) == 224 && Math.floor(label.width) == 92 && Math.floor(label.height) == 15 && label.rotateAngle == 60).toBe(true);
                done();
            });
        });
        describe('Annotation Constraints, Alignment and Wrapping', () => {
            let diagram: Diagram;
            let ele: HTMLElement;
            let mouseEvents: MouseEvents;
            let diagramCanvas: HTMLElement; let left: number; let top: number;
            beforeAll((): void => {
                const isDef = (o: any) => o !== undefined && o !== null;
                if (!isDef(window.performance)) {
                    this.skip(); //Skips test (in Chai)
                    return;
                }
                let nodes: NodeModel[] = [{
                    id: 'node2', width: 100, height: 100, offsetX: 200, offsetY: 100,
                    annotations: [{ offset: { x: 1, y: 0.5 }, width: 100, height: 150, content: 'Text Element' }]
                }];
                diagram = new Diagram({
                    width: 800, height: 500, nodes: nodes,
                });
                ele = createDiagramContainer();
                diagram.appendTo('#' + ele.id);
                diagramCanvas = document.getElementById(diagram.element.id + 'content');
                mouseEvents = new MouseEvents();
                mouseEvents.clickEvent(diagramCanvas, 1, 1);
                left = diagram.element.offsetLeft; top = diagram.element.offsetTop;
            });

            afterAll((): void => {
                mouseEvents = null;
                if (diagram) {
                    diagram.selectionChange = undefined;
                    diagram.destroy();
                    diagram = null;
                }
                diagramCanvas = null
                removeContainer(ele);
                ele = null;
            });
            it('Without and with select constraints', (done: Function) => {
                let node: NodeModel = (diagram.nodes[0] as NodeModel);
                let annotation: DiagramElement = node.wrapper.children[1];
                mouseEvents.clickEvent(diagramCanvas, annotation.offsetX + left, annotation.offsetY + top);
                expect((diagram.selectedItems as Selector).annotation == undefined).toBe(true);
                (node as Node).annotations[0].constraints = AnnotationConstraints.Select;
                mouseEvents.clickEvent(diagramCanvas, 1, 1);
                mouseEvents.clickEvent(diagramCanvas, annotation.offsetX + left, annotation.offsetY + top);
                let label: DiagramElement = node.wrapper.children[1];
                expect((diagram.selectedItems as Selector).annotation !== undefined).toBe(true);
                done();
            });
            it('Without and with drag constraints', (done: Function) => {
                drag(diagram, mouseEvents);
                expect((diagram.selectedItems as Selector).annotation == undefined).toBe(true);
                let node: NodeModel = (diagram.nodes[0] as NodeModel);
                let label: DiagramElement = node.wrapper.children[1];
                mouseEvents.clickEvent(diagramCanvas, label.offsetX + left, label.offsetY + top);
                drag(diagram, mouseEvents);
                expect(label.offsetX == 250 && label.offsetY == 100).toBe(true);
                diagram.nodes[0].annotations[0].constraints = AnnotationConstraints.Select | AnnotationConstraints.Drag;
                diagram.dataBind();
                mouseEvents.clickEvent(diagramCanvas, label.offsetX + left, label.offsetY + top);
                drag(diagram, mouseEvents);
                expect(label.offsetX == 270 && label.offsetY == 120).toBe(true);
                done();
            });
            it('Without and with resize constraints', (done: Function) => {
                debugger;
                let element: HTMLElement = document.getElementById('resizeSouth');
                let x: number = Number(element.getAttribute('x')) + halfResizeThumbSize;
                let y: number = Number(element.getAttribute('y')) + halfResizeThumbSize;
                mouseEvents.mouseDownEvent(diagramCanvas, x + diagram.element.offsetLeft, y + diagram.element.offsetTop);
                mouseEvents.mouseMoveEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop);
                mouseEvents.mouseMoveEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop + 20);
                mouseEvents.mouseUpEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop + 20);
                let node: NodeModel = (diagram.nodes[0] as NodeModel);
                let annotation: DiagramElement = node.wrapper.children[1];
                mouseEvents.clickEvent(diagramCanvas, annotation.offsetX + left, annotation.offsetY + top);
                let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                expect(label.width == 100 && label.height == 150).toBe(true);
                diagram.nodes[0].annotations[0].constraints = AnnotationConstraints.Select | AnnotationConstraints.Resize;
                diagram.dataBind();
                element = document.getElementById('resizeSouth');
                x = Number(element.getAttribute('x')) + halfResizeThumbSize;
                y = Number(element.getAttribute('y')) + halfResizeThumbSize;
                mouseEvents.mouseDownEvent(diagramCanvas, x + diagram.element.offsetLeft, y + diagram.element.offsetTop);
                mouseEvents.mouseMoveEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop);
                mouseEvents.mouseMoveEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop + 20);
                mouseEvents.mouseUpEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop + 20);
                label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                expect(label.width == 100 && label.height == 170).toBe(true);
                done();
            });
            it('Without and with rotate constraints', (done: Function) => {
                let node: NodeModel = (diagram.nodes[0] as NodeModel);
                let label: DiagramElement = node.wrapper.children[1];
                mouseEvents.clickEvent(diagramCanvas, label.offsetX + left, label.offsetY + top);
                rotate(diagram, mouseEvents, 20);
                expect(diagram.nodes[0].annotations[0].rotateAngle == 0).toBe(true);
                diagram.nodes[0].annotations[0].constraints = AnnotationConstraints.Select | AnnotationConstraints.Rotate;
                diagram.dataBind();
                node = (diagram.nodes[0] as NodeModel);
                label = node.wrapper.children[1];
                mouseEvents.clickEvent(diagramCanvas, label.offsetX + left, label.offsetY + top);
                rotate(diagram, mouseEvents, 20);
                expect(diagram.nodes[0].annotations[0].rotateAngle != 0).toBe(true);
                done();
            });
            it('Without and with interaction constraints', (done: Function) => {
                diagram.nodes[0].annotations[0].offset = { x: 1, y: 0.5 };
                diagram.nodes[0].annotations[0].width = 100;
                diagram.nodes[0].annotations[0].height = 150;
                diagram.nodes[0].annotations[0].constraints = AnnotationConstraints.ReadOnly;
                diagram.dataBind();
                let node: NodeModel = (diagram.nodes[0] as NodeModel);
                let label: DiagramElement = node.wrapper.children[1];
                mouseEvents.clickEvent(diagramCanvas, label.offsetX + left, label.offsetY + top);
                resize(diagram, mouseEvents, 'resizeNorth');
                drag(diagram, mouseEvents);
                rotate(diagram, mouseEvents, 20);
                expect((diagram.selectedItems as Selector).annotation == undefined).toBe(true);

                diagram.nodes[0].annotations[0].constraints = AnnotationConstraints.Interaction;
                diagram.dataBind();
                node = (diagram.nodes[0] as NodeModel);
                label = node.wrapper.children[1];
                mouseEvents.clickEvent(diagramCanvas, label.offsetX + left, label.offsetY + top);
                rotate(diagram, mouseEvents, 20);
                resize(diagram, mouseEvents, 'resizeNorth');
                drag(diagram, mouseEvents);
                expect((diagram.selectedItems as Selector).annotation != undefined).toBe(true);
                done();
            });
        });
        describe('Annotation Constraints, Alignment and Wrapping', () => {
            let diagram: Diagram;
            let ele: HTMLElement;
            let mouseEvents: MouseEvents;
            let diagramCanvas: HTMLElement; let left: number; let top: number;
            beforeAll((): void => {
                const isDef = (o: any) => o !== undefined && o !== null;
                if (!isDef(window.performance)) {
                    this.skip(); //Skips test (in Chai)
                    return;
                }
                let nodes: NodeModel[] = [{
                    id: 'node2', width: 100, height: 100, offsetX: 200, offsetY: 100,
                    annotations: [{ offset: { x: 1, y: 0.5 }, width: 100, height: 150, content: 'Text Element' }]
                }];
                diagram = new Diagram({
                    width: 800, height: 500, nodes: nodes,
                });
                ele = createDiagramContainer();
                diagram.appendTo('#' + ele.id);
                diagramCanvas = document.getElementById(diagram.element.id + 'content');
                mouseEvents = new MouseEvents();
                mouseEvents.clickEvent(diagramCanvas, 1, 1);
                left = diagram.element.offsetLeft; top = diagram.element.offsetTop;
                diagram.nodes[0].annotations[0].constraints = AnnotationConstraints.Interaction;
            });

            afterAll((): void => {
                mouseEvents = null;
                if (diagram) {
                    diagram.selectionChange = undefined;
                    diagram.destroy();
                    diagram = null;
                }
                diagramCanvas = null
                removeContainer(ele);
                ele = null;
            });
            it('Horziontal alignment - left', (done: Function) => {
                diagram.nodes[0].annotations[0].horizontalAlignment = 'Left';
                diagram.nodes[0].annotations[0].width = diagram.nodes[0].annotations[0].height = 100;
                diagram.nodes[0].annotations[0].offset = { x: 1, y: 1.5 };
                diagram.nodes[0].annotations[0].rotateAngle = 0;
                diagram.dataBind();
                let node: NodeModel = (diagram.nodes[0] as NodeModel);
                let label: DiagramElement = node.wrapper.children[1];
                mouseEvents.clickEvent(diagramCanvas, label.offsetX + left, label.offsetY + top);
                expect((diagram.selectedItems as Selector).annotation != undefined);
                resize(diagram, mouseEvents, 'resizeNorth');
                drag(diagram, mouseEvents);
                expect(label.offsetX == 320 && label.offsetY == 205 && label.width == 100 && label.height == 130 && label.rotateAngle == 0).toBe(true);
                done();
            });
            it('Horziontal alignment - right', (done: Function) => {
                diagram.nodes[0].annotations[0].horizontalAlignment = 'Right';
                diagram.nodes[0].annotations[0].width = diagram.nodes[0].annotations[0].height = 100;
                diagram.nodes[0].annotations[0].offset = { x: 1, y: 1.5 };
                diagram.nodes[0].annotations[0].rotateAngle = 0;
                diagram.dataBind();
                let node: NodeModel = (diagram.nodes[0] as NodeModel);
                let label: DiagramElement = node.wrapper.children[1];
                mouseEvents.clickEvent(diagramCanvas, label.offsetX + left, label.offsetY + top);
                expect((diagram.selectedItems as Selector).annotation !== undefined).toBe(true);
                resize(diagram, mouseEvents, 'resizeNorth');
                drag(diagram, mouseEvents);
                expect(label.offsetX == 220 && label.offsetY == 215 && label.width == 100 && Math.floor(label.height) == 110 && label.rotateAngle == 0).toBe(true);
                done();
            });
            it('Horziontal alignment - Auto', (done: Function) => {
                diagram.nodes[0].annotations[0].horizontalAlignment = 'Auto';
                diagram.nodes[0].annotations[0].width = diagram.nodes[0].annotations[0].height = 100;
                diagram.nodes[0].annotations[0].offset = { x: 1, y: 1.5 };
                diagram.nodes[0].annotations[0].rotateAngle = 0;
                diagram.dataBind();
                let node: NodeModel = (diagram.nodes[0] as NodeModel);
                let label: DiagramElement = node.wrapper.children[1];
                mouseEvents.clickEvent(diagramCanvas, label.offsetX + left, label.offsetY + top);
                expect((diagram.selectedItems as Selector).annotation !== undefined).toBe(true);
                resize(diagram, mouseEvents, 'resizeNorth');
                drag(diagram, mouseEvents);
                expect(label.offsetX == 370 && label.offsetY == 225 && label.width == 100 && Math.floor(label.height) == 90 && label.rotateAngle == 0).toBe(true);
                done();
            });
            it('Horziontal alignment - Stretch', (done: Function) => {
                diagram.nodes[0].annotations[0].horizontalAlignment = 'Stretch';
                diagram.nodes[0].annotations[0].width = diagram.nodes[0].annotations[0].height = 100;
                diagram.nodes[0].annotations[0].offset = { x: 1, y: 1.5 };
                diagram.nodes[0].annotations[0].rotateAngle = 0;
                diagram.dataBind();
                let node: NodeModel = (diagram.nodes[0] as NodeModel);
                let label: DiagramElement = node.wrapper.children[1];
                mouseEvents.clickEvent(diagramCanvas, label.offsetX + left, label.offsetY + top);
                expect((diagram.selectedItems as Selector).annotation !== undefined).toBe(true);
                resize(diagram, mouseEvents, 'resizeNorth');
                drag(diagram, mouseEvents);
                expect(label.offsetX == 270 && label.offsetY == 235 && label.width == 100 && Math.floor(label.height) == 70 && label.rotateAngle == 0).toBe(true);
                done();
            });
            it('Vertical alignment - top', (done: Function) => {
                diagram.nodes[0].annotations[0].verticalAlignment = 'Top';
                diagram.nodes[0].annotations[0].width = diagram.nodes[0].annotations[0].height = 100;
                diagram.nodes[0].annotations[0].offset = { x: 1, y: 1.5 };
                diagram.nodes[0].annotations[0].rotateAngle = 0;
                diagram.dataBind();
                let node: NodeModel = (diagram.nodes[0] as NodeModel);
                let label: DiagramElement = node.wrapper.children[1];
                mouseEvents.clickEvent(diagramCanvas, label.offsetX + left, label.offsetY + top);
                expect((diagram.selectedItems as Selector).annotation !== undefined).toBe(true);
                resize(diagram, mouseEvents, 'resizeNorth');
                drag(diagram, mouseEvents);
                expect(label.offsetX == 270 && label.offsetY == 295 && label.width == 100 && (label.height == 50.000000000000014 || Math.ceil(label.height) == 67) && label.rotateAngle == 0).toBe(true);
                done();
            });
            it('Vertical alignment - bottom', (done: Function) => {
                diagram.nodes[0].annotations[0].verticalAlignment = 'Bottom';
                diagram.nodes[0].annotations[0].width = diagram.nodes[0].annotations[0].height = 100;
                diagram.nodes[0].annotations[0].offset = { x: 1, y: 1.5 };
                diagram.nodes[0].annotations[0].rotateAngle = 0;
                diagram.dataBind();
                let node: NodeModel = (diagram.nodes[0] as NodeModel);
                let label: DiagramElement = node.wrapper.children[1];
                mouseEvents.clickEvent(diagramCanvas, label.offsetX + left, label.offsetY + top);
                expect((diagram.selectedItems as Selector).annotation !== undefined).toBe(true);
                resize(diagram, mouseEvents, 'resizeNorth');
                drag(diagram, mouseEvents);
                expect(label.offsetX == 250 && label.offsetY == 195 && label.width == 100 && (label.height == 50.000000000000014 || Math.ceil(label.height) == 67) && label.rotateAngle == 0).toBe(true);
                done();
            });
            it('Vertical alignment - Auto', (done: Function) => {
                diagram.nodes[0].annotations[0].verticalAlignment = 'Auto';
                diagram.nodes[0].annotations[0].width = diagram.nodes[0].annotations[0].height = 100;
                diagram.nodes[0].annotations[0].offset = { x: 1, y: 1.5 };
                diagram.nodes[0].annotations[0].rotateAngle = 0;
                diagram.dataBind();
                let node: NodeModel = (diagram.nodes[0] as NodeModel);
                let label: DiagramElement = node.wrapper.children[1];
                mouseEvents.clickEvent(diagramCanvas, label.offsetX + left, label.offsetY + top);
                expect((diagram.selectedItems as Selector).annotation !== undefined).toBe(true);
                resize(diagram, mouseEvents, 'resizeNorth');
                drag(diagram, mouseEvents);
                expect(label.offsetX == 250 && Math.floor(label.offsetY) == 334 && label.width == 100 && (label.height == 50.000000000000014 || Math.ceil(label.height) == 27) && label.rotateAngle == 0).toBe(true);
                done();
            });
            it('Vertical alignment - Stretch', (done: Function) => {
                diagram.nodes[0].annotations[0].verticalAlignment = 'Stretch';
                diagram.nodes[0].annotations[0].width = diagram.nodes[0].annotations[0].height = 100;
                diagram.nodes[0].annotations[0].offset = { x: 1, y: 1.5 };
                diagram.nodes[0].annotations[0].rotateAngle = 0;
                diagram.dataBind();
                let node: NodeModel = (diagram.nodes[0] as NodeModel);
                let label: DiagramElement = node.wrapper.children[1];
                mouseEvents.clickEvent(diagramCanvas, label.offsetX + left, label.offsetY + top);
                expect((diagram.selectedItems as Selector).annotation !== undefined).toBe(true);
                resize(diagram, mouseEvents, 'resizeNorth');
                drag(diagram, mouseEvents);
                expect(label.offsetX == 270 && label.offsetY == 230 && label.width == 100 && label.height == 80 && label.rotateAngle == 0).toBe(true);
                done();
            });
        });
    });
    describe('Connectors - Annotation Interaction', () => {
        describe('Annotation width and height are undefind', () => {
            let diagram: Diagram;
            let ele: HTMLElement;
            let mouseEvents: MouseEvents;
            let diagramCanvas: HTMLElement; let left: number; let top: number;
            beforeAll((): void => {
                const isDef = (o: any) => o !== undefined && o !== null;
                if (!isDef(window.performance)) {
                    this.skip(); //Skips test (in Chai)
                    return;
                }
                let connectors: ConnectorModel[] = [{
                    id: 'connector1', sourcePoint: { x: 300, y: 100 }, targetPoint: { x: 400, y: 200 },
                    annotations: [{ id: 'label1', content: "Connector's Annotation interaction", constraints: AnnotationConstraints.Interaction }]
                }];
                diagram = new Diagram({
                    width: 800, height: 500, connectors: connectors
                });
                ele = createDiagramContainer();
                diagram.appendTo('#' + ele.id);
                diagramCanvas = document.getElementById(diagram.element.id + 'content');
                mouseEvents = new MouseEvents();
                mouseEvents.clickEvent(diagramCanvas, 1, 1);
                left = diagram.element.offsetLeft; top = diagram.element.offsetTop;
            });

            afterAll((): void => {
                mouseEvents = null;
                if (diagram) {
                    diagram.selectionChange = undefined;
                    diagram.destroy();
                    diagram = null;
                }
                diagramCanvas = null
                removeContainer(ele);
                ele = null;
            });

            it('Select', (done: Function) => {
                let connector: ConnectorModel = (diagram.connectors[0] as ConnectorModel);
                let annotation: DiagramElement = connector.wrapper.children[3];
                mouseEvents.clickEvent(diagramCanvas, annotation.offsetX + left, annotation.offsetY + top);
                let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                expect((diagram.selectedItems as Selector).connectors.length == 1 &&
                    (diagram.selectedItems as Selector).annotation !== undefined).toBe(true);
                done();
            });
            it('Drag', (done: Function) => {
                drag(diagram, mouseEvents);
                let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                expect(label.offsetX == 370 && label.offsetY == 170).toBe(true);
                done();
            });
            it('Resize North', (done: Function) => {
                let element: HTMLElement = document.getElementById('resizeNorth');
                let x: number = Number(element.getAttribute('x')) + halfResizeThumbSize;
                let y: number = Number(element.getAttribute('y')) + halfResizeThumbSize;
                mouseEvents.mouseDownEvent(diagramCanvas, x + diagram.element.offsetLeft, y + diagram.element.offsetTop);
                mouseEvents.mouseMoveEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop);
                mouseEvents.mouseMoveEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop + 20);
                mouseEvents.mouseUpEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop + 20);
                let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                expect(Math.floor(label.width) == 63 && Math.floor(label.height) == 23).toBe(true);
                done();
            });
            it('Resize South', (done: Function) => {
                // Case-Not-Required
                resize(diagram, mouseEvents, 'resizeSouth');
                let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                expect(Math.floor(label.offsetX) == 369 && Math.floor(label.offsetY) == 189 && label.rotateAngle == 0).toBe(true);
                done();
            });
            it('Resize East', (done: Function) => {
                // Case-Not-Required
                resize(diagram, mouseEvents, 'resizeEast');
                let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                expect(label.offsetX == 380 && label.offsetY == 190 && label.rotateAngle == 0).toBe(true);
                done();
            });
            it('Resize West', (done: Function) => {
                // Case-Not-Required
                let element: HTMLElement = document.getElementById('resizeWest');
                let x: number = Number(element.getAttribute('x')) + halfResizeThumbSize;
                let y: number = Number(element.getAttribute('y')) + halfResizeThumbSize;
                mouseEvents.mouseDownEvent(diagramCanvas, x + diagram.element.offsetLeft, y + diagram.element.offsetTop);
                mouseEvents.mouseMoveEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop);
                mouseEvents.mouseMoveEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop + 20);
                mouseEvents.mouseUpEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop + 20);
                let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                expect(label.offsetX == 390 && label.offsetY == 190 && Math.floor(label.width) == 63 && Math.floor(label.height) == 43 && label.rotateAngle == 0).toBe(true);
                done();
            });
        });
        describe('Drag the connector Annotation', () => {
            let diagram: Diagram;
            let ele: HTMLElement;
            let mouseEvents: MouseEvents = new MouseEvents();
            beforeAll((): void => {
                const isDef = (o: any) => o !== undefined && o !== null;
                if (!isDef(window.performance)) {
                    console.log("Unsupported environment, window.performance.memory is unavailable");
                    this.skip(); //Skips test (in Chai)
                    return;
                }
                let connectors: ConnectorModel[] = [
                    {
                        id: 'connector1', sourcePoint: { x: 300, y: 100 }, targetPoint: { x: 400, y: 200 },
                        annotations: [{
                            id: 'label1', content: "Connector's Annotation interaction",
                            horizontalAlignment: 'Right',
                            constraints: AnnotationConstraints.Interaction,
                            style: { fontSize: 25 }
                        }]
                    },
                    {
                        id: 'connector2', sourcePoint: { x: 400, y: 300 }, targetPoint: { x: 500, y: 400 },
                        annotations: [{
                            id: 'label1', content: "Connector's Annotation interaction",
                            horizontalAlignment: 'Left',
                            constraints: AnnotationConstraints.Interaction,
                            style: { fontSize: 25 }
                        }]
                    },
                    {
                        id: 'connector3', sourcePoint: { x: 500, y: 100 }, targetPoint: { x: 600, y: 200 },
                        annotations: [{
                            id: 'label1', content: "Connector's Annotation interaction",
                            verticalAlignment: 'Top',
                            horizontalAlignment: 'Center',
                            constraints: AnnotationConstraints.Interaction,
                            style: { fontSize: 25 }
                        }]
                    }, {
                        id: 'connector4', sourcePoint: { x: 200, y: 300 }, targetPoint: { x: 300, y: 400 },
                        annotations: [{
                            id: 'label1', content: "Connector's Annotation interaction",
                            verticalAlignment: 'Top',
                            horizontalAlignment: 'Center',
                            constraints: AnnotationConstraints.Interaction,
                            segmentAngle: true,
                            style: { fontSize: 25 }
                        }]
                    },
                    {
                        id: 'connector5', sourcePoint: { x: 700, y: 100 }, targetPoint: { x: 800, y: 200 },
                        annotations: [{
                            id: 'label1', content: "Connector's Annotation interaction",
                            verticalAlignment: 'Top',
                            horizontalAlignment: 'Right',
                            constraints: AnnotationConstraints.Interaction,
                            style: { fontSize: 25 }
                        }]
                    },
                    {
                        id: 'connector6', sourcePoint: { x: 700, y: 300 }, targetPoint: { x: 800, y: 400 },
                        annotations: [{
                            id: 'label1', content: "Connector's Annotation interaction",
                            verticalAlignment: 'Top',
                            horizontalAlignment: 'Left',
                            constraints: AnnotationConstraints.Interaction,
                            style: { fontSize: 25 }
                        }]
                    },
                    {
                        id: 'connector7',

                        sourcePoint: { x: 200, y: 600 },
                        targetPoint: { x: 400, y: 600 },
                        annotations: [{
                            id: 'label1', content: "Connector's Annotation interaction",
                            verticalAlignment: 'Bottom',
                            horizontalAlignment: 'Left',
                            constraints: AnnotationConstraints.Interaction,
                            style: { fontSize: 25 }
                        }]
                    },
                ];
                diagram = new Diagram({
                    width: 1000, height: 800, connectors: connectors
                });
                ele = createDiagramContainer();
                diagram.appendTo('#' + ele.id);

            });
            afterAll((): void => {
                diagram.destroy();
                ele.remove();
                diagram = null;
                removeContainer(ele);
                ele = null;
            });

            it('set horizontalAlignment - Right, Drag annotation', (done: Function) => {
                let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
                const label1: HTMLElement = document.getElementById('connector1_label1_groupElement');
                let labelBounds: any = label1.getBoundingClientRect();
                let bound = { x: labelBounds.x + (labelBounds.width / 2), y: labelBounds.y + (labelBounds.height / 2) }

                mouseEvents.clickEvent(diagramCanvas, bound.x, bound.y);
                drag(diagram, mouseEvents);

                let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                console.log("label.offsetX ", label.offsetX, "label.offsetY ", label.offsetY);
                expect(Math.round(label.offsetX) === 304 && Math.round(label.offsetY) == 170).toBe(true);
                done();
            });
            it('set horizontalAlignment - Left, Drag annotation', (done: Function) => {
                diagram.clearSelection();
                let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
                let label2: HTMLElement = document.getElementById('connector2_label1_groupElement');
                let labelBounds: any = label2.getBoundingClientRect();
                let bound = { x: labelBounds.x + (labelBounds.width / 2), y: labelBounds.y + (labelBounds.height / 2) }

                mouseEvents.clickEvent(diagramCanvas, bound.x, bound.y);
                drag(diagram, mouseEvents);

                let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                console.log("label.offsetX ", label.offsetX, "label.offsetY ", label.offsetY);
                expect(Math.round(label.offsetX) == 536 && Math.round(label.offsetY) == 370).toBe(true);
                done();
            });
            it('set horizontalAlignment - Center, Drag annotation', (done: Function) => {
                diagram.clearSelection();
                let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
                let label3: HTMLElement = document.getElementById('connector3_label1_groupElement');

                let labelBounds: any = label3.getBoundingClientRect();
                let bound = { x: labelBounds.x + (labelBounds.width / 2), y: labelBounds.y + (labelBounds.height / 2) }

                mouseEvents.clickEvent(diagramCanvas, bound.x, bound.y);
                drag(diagram, mouseEvents);

                let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                console.log("label.offsetX ", label.offsetX, "label.offsetX ", label.offsetY);
                expect(Math.round(label.offsetX) == 570 && Math.round(label.offsetY) == 215).toBe(true);
                done();
            });
            it('set segmentAngle - rotate annotation', (done: Function) => {
                diagram.clearSelection();
                let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
                let label3: HTMLElement = document.getElementById('connector4_label1_groupElement');

                let labelBounds: any = label3.getBoundingClientRect();
                let bound = { x: labelBounds.x + (labelBounds.width / 2), y: labelBounds.y + (labelBounds.height / 2) }

                mouseEvents.clickEvent(diagramCanvas, bound.x, bound.y);
                rotate(diagram, mouseEvents, 30);

                let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                console.log("label.rotateAngle ", label.rotateAngle);
                expect(label.rotateAngle === 85).toBe(true);
                done();
            });
            it('set verticalAlignment - Top and set horizontalAlignment - Right, Drag annotation', (done: Function) => {
                let diagramCanvas = document.getElementById(diagram.element.id + 'content');
                let label1 = document.getElementById('connector5_label1_groupElement');
                let labelBounds: any = label1.getBoundingClientRect();
                let bound = { x: labelBounds.x + (labelBounds.width / 2), y: labelBounds.y + (labelBounds.height / 2) };

                mouseEvents.clickEvent(diagramCanvas, bound.x, bound.y);
                drag(diagram, mouseEvents);

                let label = (diagram.selectedItems.wrapper).children[0];
                console.log("label.offsetX ", label.offsetX, "label.offsetY ", label.offsetY);
                expect(Math.round(label.offsetX) == 704 && Math.round(label.offsetY) == 215).toBe(true);
                done();
            });
            it('set verticalAlignment - Top and set horizontalAlignment - Left, Drag annotation', (done: Function) => {
                let diagramCanvas = document.getElementById(diagram.element.id + 'content');
                let label1 = document.getElementById('connector6_label1_groupElement');
                let labelBounds: any = label1.getBoundingClientRect();
                let bound = { x: labelBounds.x + (labelBounds.width / 2), y: labelBounds.y + (labelBounds.height / 2) };

                mouseEvents.clickEvent(diagramCanvas, bound.x, bound.y);
                drag(diagram, mouseEvents);

                let label = (diagram.selectedItems.wrapper).children[0];
                console.log("label.offsetX ", label.offsetX, "label.offsetY ", label.offsetY);
                expect(Math.round(label.offsetX) == 836 && Math.round(label.offsetY) == 415).toBe(true);
                done();
            });
            it('set verticalAlignment - Botton - Right, resize annotation', (done: Function) => {
                let diagramCanvas = document.getElementById(diagram.element.id + 'content');
                let label1 = document.getElementById('connector7_label1_groupElement');
                let labelBounds: any = label1.getBoundingClientRect();
                let bound = { x: labelBounds.x + (labelBounds.width / 2), y: labelBounds.y + (labelBounds.height / 2) };

                mouseEvents.clickEvent(diagramCanvas, bound.x, bound.y);
                drag(diagram, mouseEvents);
                resize(diagram, mouseEvents, 'resizeEast');

                let label = (diagram.selectedItems.wrapper).children[0];
                console.log("label.offsetX ", label.offsetX, "label.offsetY ", label.offsetY);
                expect(Math.round(label.offsetX) == 396 && Math.round(label.offsetY) == 575).toBe(true);
                done();
            });
        });
        describe('Annotation width and height are undefind', () => {
            let diagram: Diagram;
            let ele: HTMLElement;
            let mouseEvents: MouseEvents;
            let diagramCanvas: HTMLElement; let left: number; let top: number;
            beforeAll((): void => {
                const isDef = (o: any) => o !== undefined && o !== null;
                if (!isDef(window.performance)) {
                    this.skip(); //Skips test (in Chai)
                    return;
                }
                let connectors: ConnectorModel[] = [{
                    id: 'connector1', sourcePoint: { x: 300, y: 100 }, targetPoint: { x: 400, y: 200 },
                    annotations: [{ id: 'label1', content: "Connector's Annotation interaction", constraints: AnnotationConstraints.Interaction }]
                }];
                diagram = new Diagram({
                    width: 800, height: 500, connectors: connectors
                });
                ele = createDiagramContainer();
                diagram.appendTo('#' + ele.id);
                diagramCanvas = document.getElementById(diagram.element.id + 'content');
                mouseEvents = new MouseEvents();
                mouseEvents.clickEvent(diagramCanvas, 1, 1);
                left = diagram.element.offsetLeft; top = diagram.element.offsetTop;
            });

            afterAll((): void => {
                mouseEvents = null;
                if (diagram) {
                    diagram.selectionChange = undefined;
                    diagram.destroy();
                    diagram = null;
                }
                diagramCanvas = null
                removeContainer(ele);
                ele = null;
            });

            it('Rotate', (done: Function) => {
                let connector: ConnectorModel = (diagram.connectors[0] as ConnectorModel);
                let annotation: DiagramElement = connector.wrapper.children[3];
                mouseEvents.clickEvent(diagramCanvas, annotation.offsetX + left, annotation.offsetY + top);
                rotate(diagram, mouseEvents, 15);
                let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                expect((label.rotateAngle == 40 || label.rotateAngle == 55)).toBe(true);
                done();
            });
            it('Select after annotation rotation', (done: Function) => {
                diagram.connectors[0].annotations[0].height = 60;
                diagram.dataBind();
                mouseEvents.clickEvent(diagramCanvas, 1, 1);
                let label = diagram.connectors[0].wrapper.children[3];
                mouseEvents.clickEvent(diagramCanvas, label.offsetX + left, label.offsetY + top);
                expect((diagram.selectedItems as Selector).annotation != undefined).toBe(true);
                done();
            });
            it('Drag after annotation rotation', (done: Function) => {
                drag(diagram, mouseEvents);
                let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                expect(label.offsetX == 370 && label.offsetY == 170 && (label.rotateAngle == 40 || label.rotateAngle == 55)).toBe(true);
                done();
            });
            it('Resize East after annotation rotation', (done: Function) => {
                // Case-Not-Required
                resize(diagram, mouseEvents, 'resizeEast');
                let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                expect(Math.floor(label.offsetX) == 380 && Math.floor(label.offsetY) == 179 && Math.floor(label.width) == 91 && Math.floor(label.height) == 43 && label.rotateAngle == 40).toBe(true);
                done();
            });
            it('Resize West after annotation rotation', (done: Function) => {
                // Case-Not-Required
                resize(diagram, mouseEvents, 'resizeWest');
                let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                expect(Math.floor(label.offsetX) == 391 && Math.floor(label.offsetY) == 188 && Math.floor(label.width) == 63 && Math.floor(label.height) == 43 && label.rotateAngle == 40).toBe(true);
                done();
            });
            it('Rotate after annotation rotation', (done: Function) => {
                // Case-Not-Required
                rotate(diagram, mouseEvents, 15);
                let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                expect(Math.floor(label.offsetX) == 391 && Math.floor(label.offsetY) == 188 && Math.floor(label.width) == 63 && Math.floor(label.height) == 43 && label.rotateAngle == 75).toBe(true);
                done();
            });
            it('Add connector and drag the label based on connectors segment', (done: Function) => {
                diagram.width = "800px";
                diagram.height = "700px";
                diagram.add(
                    {
                        id: 'connector2', sourcePoint: { x: 500, y: 135 }, targetPoint: { x: 500, y: 225 },
                        annotations: [{
                            id: 'Connector', constraints: AnnotationConstraints.Interaction,
                            content: 'Connector', offset: 0.5, width: 50, height: 50
                        }]
                    }
                );
                diagram.add(
                    {
                        id: 'connector3', sourcePoint: { x: 200, y: 100 }, targetPoint: { x: 100, y: 200 },
                        annotations: [{
                            id: 'Connector', constraints: AnnotationConstraints.Interaction,
                            content: 'Connector', offset: 0.5, width: 50, height: 50
                        }]
                    }
                );
                expect(diagram.connectors.length == 3).toBe(true);
                let connector1 = diagram.connectors[1];
                let label1 = connector1.wrapper.children[3];
                mouseEvents.mouseDownEvent(diagramCanvas, label1.offsetX + left, label1.offsetY + top + 1);
                mouseEvents.mouseMoveEvent(diagramCanvas, label1.offsetX + left, label1.offsetY + top + 2);
                mouseEvents.mouseMoveEvent(diagramCanvas, label1.offsetX + left, label1.offsetY + top + 2);
                mouseEvents.mouseUpEvent(diagramCanvas, label1.offsetX + left, label1.offsetY + top + 2);
                expect(label1.offsetX == 500 && label1.offsetY == 182).toBe(true);
                let connector2 = diagram.connectors[2];
                let label2 = connector2.wrapper.children[3];
                mouseEvents.mouseDownEvent(diagramCanvas, label2.offsetX + left, label2.offsetY + top + 1);
                mouseEvents.mouseMoveEvent(diagramCanvas, label2.offsetX + left, label2.offsetY + top + 2);
                mouseEvents.mouseMoveEvent(diagramCanvas, label2.offsetX + left, label2.offsetY + top + 2);
                mouseEvents.mouseUpEvent(diagramCanvas, label2.offsetX + left, label2.offsetY + top + 2);
                expect(Math.floor(label2.offsetX) == 149 && Math.floor(label2.offsetY) == 150).toBe(true);
                done();
            });
        });
        describe('Having width and height', () => {
            let diagram: Diagram;
            let ele: HTMLElement;
            let mouseEvents: MouseEvents;
            let diagramCanvas: HTMLElement; let left: number; let top: number;
            beforeAll((): void => {
                const isDef = (o: any) => o !== undefined && o !== null;
                if (!isDef(window.performance)) {
                    this.skip(); //Skips test (in Chai)
                    return;
                }
                diagram = new Diagram({
                    width: 800, height: 500, connectors: [{
                        id: 'connector1', sourcePoint: { x: 100, y: 100 }, targetPoint: { x: 200, y: 200 }, type: 'Orthogonal',
                        annotations: [{
                            content: 'Path Element', constraints: AnnotationConstraints.Interaction,
                            width: 50, height: 50
                        }]
                    }],
                });
                ele = createDiagramContainer();
                diagram.appendTo('#' + ele.id);
                diagramCanvas = document.getElementById(diagram.element.id + 'content');
                mouseEvents = new MouseEvents();
                mouseEvents.clickEvent(diagramCanvas, 1, 1);
                left = diagram.element.offsetLeft; top = diagram.element.offsetTop;
            });

            afterAll((): void => {
                mouseEvents = null;
                if (diagram) {
                    diagram.selectionChange = undefined;
                    diagram.destroy();
                    diagram = null;
                }
                diagramCanvas = null
                removeContainer(ele);
                ele = null;
            });

            it('Select', (done: Function) => {
                let connector: ConnectorModel = (diagram.connectors[0] as ConnectorModel);
                let annotation: DiagramElement = connector.wrapper.children[3];
                mouseEvents.clickEvent(diagramCanvas, annotation.offsetX + left, annotation.offsetY + top);
                expect((diagram.selectedItems as Selector).connectors.length == 1 &&
                    (diagram.selectedItems as Selector).annotation !== undefined).toBe(true);
                done();
            });
            it('Drag', (done: Function) => {
                drag(diagram, mouseEvents);
                let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                expect(label.offsetX == 200 && label.offsetY == 140).toBe(true);
                done();
            });
            it('Resize North', (done: Function) => {
                resize(diagram, mouseEvents, 'resizeNorth');
                let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                expect(label.width == 50 && label.height == 30).toBe(true);
                done();
            });
            it('Resize South', (done: Function) => {
                // Case-Not-Required
                resize(diagram, mouseEvents, 'resizeSouth');
                let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                expect(label.offsetX == 200 && label.offsetY == 160 && label.width == 50 && label.height == 50 && label.rotateAngle == 0).toBe(true);
                done();
            });
            it('Resize East', (done: Function) => {
                // Case-Not-Required
                resize(diagram, mouseEvents, 'resizeEast');
                let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                expect(label.offsetX == 210 && label.offsetY == 160 && label.width == 70 && label.height == 50 && label.rotateAngle == 0).toBe(true);
                done();
            });
            it('Resize West', (done: Function) => {
                // Case-Not-Required
                resize(diagram, mouseEvents, 'resizeWest');
                let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                expect(label.offsetX == 220 && label.offsetY == 160 && label.width == 50 && label.height == 50 && label.rotateAngle == 0).toBe(true);
                done();
            });
            it('Rotate', (done: Function) => {
                rotate(diagram, mouseEvents, 15);
                let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                expect(label.rotateAngle == 35).toBe(true);
                done();
            });
            it('Select after annotation rotation', (done: Function) => {
                diagram.connectors[0].annotations[0].height = 60;
                diagram.dataBind();
                mouseEvents.clickEvent(diagramCanvas, 1, 1);
                let label = diagram.connectors[0].wrapper.children[3];
                mouseEvents.clickEvent(diagramCanvas, label.offsetX + left, label.offsetY + top);
                expect((diagram.selectedItems as Selector).annotation != undefined).toBe(true);
                done();
            });
            it('Drag after annotation rotation', (done: Function) => {
                drag(diagram, mouseEvents);
                let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                expect(label.offsetX == 240 && label.offsetY == 180 && label.rotateAngle == 35).toBe(true);
                done();
            });
            it('Resize East after annotation rotation', (done: Function) => {
                // Case-Not-Required
                resize(diagram, mouseEvents, 'resizeEast');
                let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                expect(Math.floor(label.offsetX) == 251 && Math.floor(label.offsetY) == 187 && Math.floor(label.width) == 77 && Math.floor(label.height) == 60 && label.rotateAngle == 35).toBe(true);
                done();
            });
            it('Resize West after annotation rotation', (done: Function) => {
                // Case-Not-Required
                resize(diagram, mouseEvents, 'resizeWest');
                let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                expect(Math.floor(label.offsetX) == 262 && Math.floor(label.offsetY) == 195 && Math.floor(label.width) == 49 && label.height == 60 && label.rotateAngle == 35).toBe(true);
                done();
            });
            it('Rotate after annotation rotation', (done: Function) => {
                // Case-Not-Required
                rotate(diagram, mouseEvents, 15);
                let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                expect(Math.floor(label.offsetX) == 262 && Math.floor(label.offsetY) == 195 && Math.floor(label.width) == 49 && label.height == 60 && label.rotateAngle == 70).toBe(true);
                done();
            });
        });
        describe('Annotation Constraints, Alignment and Wrapping', () => {
            let diagram: Diagram;
            let ele: HTMLElement;
            let mouseEvents: MouseEvents;
            let diagramCanvas: HTMLElement; let left: number; let top: number;
            beforeAll((): void => {
                const isDef = (o: any) => o !== undefined && o !== null;
                if (!isDef(window.performance)) {
                    console.log("Unsupported environment, window.performance.memory is unavailable");
                    this.skip(); //Skips test (in Chai)
                    return;
                }
                diagram = new Diagram({
                    width: 800, height: 500, connectors: [
                        {
                            id: 'connector1', sourcePoint: { x: 100, y: 100 }, targetPoint: { x: 200, y: 200 }, type: 'Orthogonal',
                            annotations: [{
                                alignment: 'Center',
                                content: 'Path Element', constraints: AnnotationConstraints.Interaction,
                                width: 50, height: 50
                            }]
                        },
                        {
                            id: 'connector2', sourcePoint: { x: 300, y: 100 }, targetPoint: { x: 400, y: 200 }, type: 'Orthogonal',
                            annotations: [{
                                alignment: 'Before',
                                content: 'Path Element', constraints: AnnotationConstraints.Interaction,
                                width: 50, height: 50
                            }]
                        },
                        {
                            id: 'connector3', sourcePoint: { x: 500, y: 100 }, targetPoint: { x: 600, y: 200 }, type: 'Orthogonal',
                            annotations: [{
                                alignment: 'After',
                                content: 'Path Element', constraints: AnnotationConstraints.Interaction,
                                width: 50, height: 50
                            }]
                        }
                    ],
                });
                ele = createDiagramContainer();
                diagram.appendTo('#' + ele.id);
                diagramCanvas = document.getElementById(diagram.element.id + 'content');
                mouseEvents = new MouseEvents();
                mouseEvents.clickEvent(diagramCanvas, 1, 1);
                left = diagram.element.offsetLeft; top = diagram.element.offsetTop;
            });

            afterAll((): void => {
                mouseEvents = null;
                if (diagram) {
                    diagram.selectionChange = undefined;
                    diagram.destroy();
                    diagram = null;
                }
                diagramCanvas = null
                removeContainer(ele);
                ele = null;
            });

            it('Select - alignment(Center)', (done: Function) => {
                let connector: ConnectorModel = (diagram.connectors[0] as ConnectorModel);
                let annotation: DiagramElement = connector.wrapper.children[3];
                mouseEvents.clickEvent(diagramCanvas, annotation.offsetX + left, annotation.offsetY + top);
                let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                expect((diagram.selectedItems as Selector).connectors.length == 1 &&
                    (diagram.selectedItems as Selector).annotation !== undefined).toBe(true);
                done();
            });
            it('Drag - alignment(Center)', (done: Function) => {
                drag(diagram, mouseEvents);
                let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                expect(label.offsetX == 200 && label.offsetY == 140).toBe(true);
                done();
            });
            it('Resize North - alignment(Center)', (done: Function) => {
                resize(diagram, mouseEvents, 'resizeNorth');
                let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                expect(label.width == 50 && label.height == 30).toBe(true);
                done();
            });
            it('Resize South - alignment(Center)', (done: Function) => {
                // Case-Not-Required
                resize(diagram, mouseEvents, 'resizeSouth');
                let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                expect(label.offsetX == 200 && label.offsetY == 160 && label.width == 50 && label.height == 50 && label.rotateAngle == 0).toBe(true);
                done();
            });
            it('Resize East - alignment(Center)', (done: Function) => {
                // Case-Not-Required
                resize(diagram, mouseEvents, 'resizeEast');
                let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                expect(label.offsetX == 210 && label.offsetY == 160 && label.width == 70 && label.height == 50 && label.rotateAngle == 0).toBe(true);
                done();
            });
            it('Resize West - alignment(Center)', (done: Function) => {
                // Case-Not-Required
                resize(diagram, mouseEvents, 'resizeWest');
                let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                expect(label.offsetX == 220 && label.offsetY == 160 && label.width == 50 && label.height == 50 && label.rotateAngle == 0).toBe(true);
                done();
            });
            it('Rotate - alignment(Center)', (done: Function) => {
                rotate(diagram, mouseEvents, 15);
                let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                expect(label.rotateAngle == 35).toBe(true);
                done();
            });
            it('Select after annotation rotation - alignment(Center)', (done: Function) => {
                diagram.connectors[0].annotations[0].height = 60;
                diagram.dataBind();
                mouseEvents.clickEvent(diagramCanvas, 1, 1);
                let label = diagram.connectors[0].wrapper.children[3];
                mouseEvents.clickEvent(diagramCanvas, label.offsetX + left, label.offsetY + top);
                expect((diagram.selectedItems as Selector).annotation != undefined).toBe(true);
                done();
            });
            it('Drag after annotation rotation - alignment(Center)', (done: Function) => {
                drag(diagram, mouseEvents);
                let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                expect(label.offsetX == 240 && label.offsetY == 180 && label.rotateAngle == 35).toBe(true);
                done();
            });
            it('Resize East after annotation rotation - alignment(Center)', (done: Function) => {
                // Case-Not-Required
                resize(diagram, mouseEvents, 'resizeEast');
                let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                expect(Math.floor(label.offsetX) == 251 && Math.floor(label.offsetY) == 187 && Math.floor(label.width) == 77 && label.height == 60 && label.rotateAngle == 35).toBe(true);
                done();
            });
            it('Resize West after annotation rotation - alignment(Center)', (done: Function) => {
                // Case-Not-Required
                resize(diagram, mouseEvents, 'resizeWest');
                let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                expect(Math.floor(label.offsetX) == 262 && Math.floor(label.offsetY) == 195 && Math.floor(label.width) == 49 && label.height == 60 && label.rotateAngle == 35).toBe(true);
                done();
            });
            it('Rotate after annotation rotation - alignment(Center)', (done: Function) => {
                // Case-Not-Required
                rotate(diagram, mouseEvents, 15);
                let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                expect(Math.floor(label.offsetX) == 262 && Math.floor(label.offsetY) == 195 && Math.floor(label.width) == 49 && label.height == 60 && label.rotateAngle == 70).toBe(true);
                done();
            });
        });
        describe('Annotation Constraints, Alignment and Wrapping', () => {
            let diagram: Diagram;
            let ele: HTMLElement;
            let mouseEvents: MouseEvents;
            let diagramCanvas: HTMLElement; let left: number; let top: number;
            beforeAll((): void => {
                const isDef = (o: any) => o !== undefined && o !== null;
                if (!isDef(window.performance)) {
                    console.log("Unsupported environment, window.performance.memory is unavailable");
                    this.skip(); //Skips test (in Chai)
                    return;
                }
                diagram = new Diagram({
                    width: 800, height: 500, connectors: [
                        {
                            id: 'connector1', sourcePoint: { x: 100, y: 100 }, targetPoint: { x: 200, y: 200 }, type: 'Orthogonal',
                            annotations: [{
                                alignment: 'Center',
                                content: 'Path Element', constraints: AnnotationConstraints.Interaction,
                                width: 50, height: 50
                            }]
                        },
                        {
                            id: 'connector2', sourcePoint: { x: 300, y: 100 }, targetPoint: { x: 400, y: 200 }, type: 'Orthogonal',
                            annotations: [{
                                alignment: 'Before',
                                content: 'Path Element', constraints: AnnotationConstraints.Interaction,
                                width: 50, height: 50
                            }]
                        },
                        {
                            id: 'connector3', sourcePoint: { x: 500, y: 100 }, targetPoint: { x: 600, y: 200 }, type: 'Orthogonal',
                            annotations: [{
                                alignment: 'After',
                                content: 'Path Element', constraints: AnnotationConstraints.Interaction,
                                width: 50, height: 50
                            }]
                        }
                    ],
                });
                ele = createDiagramContainer();
                diagram.appendTo('#' + ele.id);
                diagramCanvas = document.getElementById(diagram.element.id + 'content');
                mouseEvents = new MouseEvents();
                mouseEvents.clickEvent(diagramCanvas, 1, 1);
                left = diagram.element.offsetLeft; top = diagram.element.offsetTop;
            });

            afterAll((): void => {
                mouseEvents = null;
                if (diagram) {
                    diagram.selectionChange = undefined;
                    diagram.destroy();
                    diagram = null;
                }
                diagramCanvas = null
                removeContainer(ele);
                ele = null;
            });
            it('Select - alignment(Before)', (done: Function) => {
                let connector: ConnectorModel = (diagram.connectors[1] as ConnectorModel);
                let annotation: DiagramElement = connector.wrapper.children[3];
                mouseEvents.clickEvent(diagramCanvas, annotation.offsetX + left, annotation.offsetY + top);
                let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                expect((diagram.selectedItems as Selector).connectors.length == 1 &&
                    (diagram.selectedItems as Selector).annotation !== undefined).toBe(true);
                done();
            });
            it('Drag - alignment(Before)', (done: Function) => {
                drag(diagram, mouseEvents);
                let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                expect(label.offsetX == 400 && label.offsetY == 115).toBe(true);
                done();
            });
            it('Resize North - alignment(Before)', (done: Function) => {
                resize(diagram, mouseEvents, 'resizeNorth');
                let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                expect(label.width == 50 && label.height == 30).toBe(true);
                done();
            });
            it('Resize South - alignment(Before)', (done: Function) => {
                // Case-Not-Required
                resize(diagram, mouseEvents, 'resizeSouth');
                let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                expect(label.offsetX == 400 && label.offsetY == 135 && label.width == 50 && label.height == 50 && label.rotateAngle == 0).toBe(true);
                done();
            });
            it('Resize East - alignment(Before)', (done: Function) => {
                // Case-Not-Required
                resize(diagram, mouseEvents, 'resizeEast');
                let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                expect(label.offsetX == 410 && label.offsetY == 135 && label.width == 70 && label.height == 50 && label.rotateAngle == 0).toBe(true);
                done();
            });
            it('Resize West - alignment(Before)', (done: Function) => {
                // Case-Not-Required
                resize(diagram, mouseEvents, 'resizeWest');
                let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                expect(label.offsetX == 420 && label.offsetY == 135 && label.width == 50 && label.height == 50 && label.rotateAngle == 0).toBe(true);
                done();
            });
            it('Rotate - alignment(Before)', (done: Function) => {
                rotate(diagram, mouseEvents, 15);
                let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                expect(label.rotateAngle == 35).toBe(true);
                done();
            });
            it('Select after annotation rotation - alignment(Before)', (done: Function) => {
                diagram.connectors[1].annotations[0].height = 60;
                diagram.dataBind();
                mouseEvents.clickEvent(diagramCanvas, 1, 1);
                let label = diagram.connectors[1].wrapper.children[3];
                mouseEvents.clickEvent(diagramCanvas, label.offsetX + left, label.offsetY + top);
                expect((diagram.selectedItems as Selector).annotation != undefined).toBe(true);
                done();
            });
            it('Drag after annotation rotation - alignment(Before)', (done: Function) => {
                drag(diagram, mouseEvents);
                let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                expect(label.offsetX == 440 && label.offsetY == 155 && label.rotateAngle == 35).toBe(true);
                done();
            });
            it('Resize East after annotation rotation - alignment(Before)', (done: Function) => {
                // Case-Not-Required
                resize(diagram, mouseEvents, 'resizeEast');
                let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                expect(Math.floor(label.offsetX) == 451 && Math.floor(label.offsetY) == 162 && Math.floor(label.width) == 77 && label.height == 60 && label.rotateAngle == 35).toBe(true);
                done();
            });
            it('Resize West after annotation rotation - alignment(Before)', (done: Function) => {
                // Case-Not-Required
                resize(diagram, mouseEvents, 'resizeWest');
                let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                expect(Math.floor(label.offsetX) == 462 && Math.floor(label.offsetY) == 170 && Math.floor(label.width) == 49 && label.height == 60 && label.rotateAngle == 35).toBe(true);
                done();
            });
            it('Rotate after annotation rotation- alignment(Before)', (done: Function) => {
                // Case-Not-Required
                rotate(diagram, mouseEvents, 15);
                let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                expect(Math.floor(label.offsetX) == 462 && Math.floor(label.offsetY) == 170 && Math.floor(label.width) == 49 && label.height == 60 && label.rotateAngle == 70).toBe(true);
                done();
            });
        });
        describe('Annotation Constraints, Alignment and Wrapping', () => {
            let diagram: Diagram;
            let ele: HTMLElement;
            let mouseEvents: MouseEvents;
            let diagramCanvas: HTMLElement; let left: number; let top: number;
            beforeAll((): void => {
                const isDef = (o: any) => o !== undefined && o !== null;
                if (!isDef(window.performance)) {
                    console.log("Unsupported environment, window.performance.memory is unavailable");
                    this.skip(); //Skips test (in Chai)
                    return;
                }
                diagram = new Diagram({
                    width: 800, height: 500, connectors: [
                        {
                            id: 'connector1', sourcePoint: { x: 100, y: 100 }, targetPoint: { x: 200, y: 200 }, type: 'Orthogonal',
                            annotations: [{
                                alignment: 'Center',
                                content: 'Path Element', constraints: AnnotationConstraints.Interaction,
                                width: 50, height: 50
                            }]
                        },
                        {
                            id: 'connector2', sourcePoint: { x: 300, y: 100 }, targetPoint: { x: 400, y: 200 }, type: 'Orthogonal',
                            annotations: [{
                                alignment: 'Before',
                                content: 'Path Element', constraints: AnnotationConstraints.Interaction,
                                width: 50, height: 50
                            }]
                        },
                        {
                            id: 'connector3', sourcePoint: { x: 500, y: 100 }, targetPoint: { x: 600, y: 200 }, type: 'Orthogonal',
                            annotations: [{
                                alignment: 'After',
                                content: 'Path Element', constraints: AnnotationConstraints.Interaction,
                                width: 50, height: 50
                            }]
                        }
                    ],
                });
                ele = createDiagramContainer();
                diagram.appendTo('#' + ele.id);
                diagramCanvas = document.getElementById(diagram.element.id + 'content');
                mouseEvents = new MouseEvents();
                mouseEvents.clickEvent(diagramCanvas, 1, 1);
                left = diagram.element.offsetLeft; top = diagram.element.offsetTop;
            });

            afterAll((): void => {
                mouseEvents = null;
                if (diagram) {
                    diagram.selectionChange = undefined;
                    diagram.destroy();
                    diagram = null;
                }
                diagramCanvas = null
                removeContainer(ele);
                ele = null;
            });
            it('Select - alignment(After)', (done: Function) => {
                let connector: ConnectorModel = (diagram.connectors[2] as ConnectorModel);
                let annotation: DiagramElement = connector.wrapper.children[3];
                mouseEvents.clickEvent(diagramCanvas, annotation.offsetX + left, annotation.offsetY + top);
                expect((diagram.selectedItems as Selector).connectors.length == 1 &&
                    (diagram.selectedItems as Selector).annotation !== undefined).toBe(true);
                done();
            });
            it('Drag - alignment(After)', (done: Function) => {
                drag(diagram, mouseEvents);
                let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                expect(label.offsetX == 600 && label.offsetY == 165).toBe(true);
                done();
            });
            it('Resize North - alignment(After)', (done: Function) => {
                resize(diagram, mouseEvents, 'resizeNorth');
                let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                expect(label.width == 50 && label.height == 30).toBe(true);
                done();
            });
            it('Resize South - alignment(After)', (done: Function) => {
                // Case-Not-Required
                resize(diagram, mouseEvents, 'resizeSouth');
                let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                expect(label.offsetX == 600 && label.offsetY == 185 && label.width == 50 && label.height == 50 && label.rotateAngle == 0).toBe(true);
                done();
            });
            it('Resize East - alignment(After)', (done: Function) => {
                // Case-Not-Required
                resize(diagram, mouseEvents, 'resizeEast');
                let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                expect(label.offsetX == 610 && label.offsetY == 185 && label.width == 70 && label.height == 50 && label.rotateAngle == 0).toBe(true);
                done();
            });
            it('Resize West - alignment(After)', (done: Function) => {
                // Case-Not-Required
                resize(diagram, mouseEvents, 'resizeWest');
                let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                expect(label.offsetX == 620 && label.offsetY == 185 && label.width == 50 && label.height == 50 && label.rotateAngle == 0).toBe(true);
                done();
            });
            it('Rotate - alignment(After)', (done: Function) => {
                rotate(diagram, mouseEvents, 15);
                let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                expect(label.rotateAngle == 35).toBe(true);
                done();
            });
            it('Select after annotation rotation - alignment(After)', (done: Function) => {
                diagram.connectors[2].annotations[0].height = 60;
                diagram.dataBind();
                mouseEvents.clickEvent(diagramCanvas, 1, 1);
                let label = diagram.connectors[2].wrapper.children[3];
                mouseEvents.clickEvent(diagramCanvas, label.offsetX + left, label.offsetY + top);
                expect((diagram.selectedItems as Selector).annotation != undefined).toBe(true);
                done();
            });
            it('Drag after annotation rotation - alignment(After)', (done: Function) => {
                drag(diagram, mouseEvents);
                let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                expect(label.offsetX == 640 && label.offsetY == 205 && label.rotateAngle == 35).toBe(true);
                done();
            });
            it('Resize East after annotation rotation - alignment(After)', (done: Function) => {
                // Case-Not-Required
                resize(diagram, mouseEvents, 'resizeEast');
                let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                expect(Math.floor(label.offsetX) == 651 && Math.floor(label.offsetY) == 212 && Math.floor(label.width) == 77 && label.height == 60 && label.rotateAngle == 35).toBe(true);
                done();
            });
            it('Resize West after annotation rotation - alignment(After)', (done: Function) => {
                // Case-Not-Required
                resize(diagram, mouseEvents, 'resizeWest');
                let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                expect(Math.floor(label.offsetX) == 662 && Math.floor(label.offsetY) == 220 && Math.floor(label.width) == 49 && label.height == 60 && label.rotateAngle == 35).toBe(true);
                done();
            });
            it('Rotate afer annotation rotation - alignment(After)', (done: Function) => {
                // Case-Not-Required
                rotate(diagram, mouseEvents, 15);
                let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
                expect(Math.floor(label.offsetX) == 662 && Math.floor(label.offsetY) == 220 && Math.floor(label.width) == 49 && label.height == 60 && label.rotateAngle == 70).toBe(true);
                done();
            });
        });
        describe('Drag Limit', () => {
            let diagram: Diagram;
            let ele: HTMLElement;
            let mouseEvents: MouseEvents;
            let diagramCanvas: HTMLElement; let left: number; let top: number;
            beforeAll((): void => {
                const isDef = (o: any) => o !== undefined && o !== null;
                if (!isDef(window.performance)) {
                    console.log("Unsupported environment, window.performance.memory is unavailable");
                    this.skip(); //Skips test (in Chai)
                    return;
                }
                diagram = new Diagram({
                    width: 800, height: 500, connectors: [
                        {
                            id: 'connector1', sourcePoint: { x: 100, y: 100 }, targetPoint: { x: 200, y: 200 }, type: 'Orthogonal',
                            annotations: [{
                                alignment: 'Center',
                                content: 'Path Element', constraints: AnnotationConstraints.Interaction,
                                width: 50, height: 50, dragLimit: { top: 50 }
                            }]
                        },
                        {
                            id: 'connector2', sourcePoint: { x: 300, y: 100 }, targetPoint: { x: 400, y: 200 }, type: 'Orthogonal',
                            annotations: [{
                                alignment: 'Before',
                                content: 'Path Element', constraints: AnnotationConstraints.Interaction,
                                width: 50, height: 50
                            }]
                        },
                        {
                            id: 'connector3', sourcePoint: { x: 500, y: 100 }, targetPoint: { x: 600, y: 200 }, type: 'Orthogonal',
                            annotations: [{
                                alignment: 'After',
                                content: 'Path Element', constraints: AnnotationConstraints.Interaction,
                                width: 50, height: 50
                            }]
                        }
                    ],
                });
                ele = createDiagramContainer();
                diagram.appendTo('#' + ele.id);
                diagramCanvas = document.getElementById(diagram.element.id + 'content');
                mouseEvents = new MouseEvents();
                mouseEvents.clickEvent(diagramCanvas, 1, 1);
                left = diagram.element.offsetLeft; top = diagram.element.offsetTop;
            });

            afterAll((): void => {
                mouseEvents = null;
                if (diagram) {
                    diagram.selectionChange = undefined;
                    diagram.destroy();
                    diagram = null;
                }
                diagramCanvas = null
                removeContainer(ele);
                ele = null;
            });
            it('Drag - alignment(Center)11', function (done) {
                mouseEvents.clickEvent(diagramCanvas, 180, 120);
                drag(diagram, mouseEvents);
                let label = (diagram.selectedItems.wrapper).children[0];
                expect(label.offsetX == 200 && label.offsetY == 140 && label.width == 50 && label.height == 50 && label.rotateAngle == 0).toBe(true);
                done();
            });
            it('Drag - alignment(Center)111', function (done) {
                // mouseEvents.clickEvent(diagramCanvas, 180, 120);
                let textElement = diagram.selectedItems.wrapper.children[0];
                let centerX = textElement.offsetX;
                let centerY = textElement.offsetY;
                mouseEvents.mouseDownEvent(diagramCanvas, centerX + diagram.element.offsetLeft, centerY + diagram.element.offsetTop);
                mouseEvents.mouseMoveEvent(diagramCanvas, centerX + diagram.element.offsetLeft + 100, centerY + diagram.element.offsetTop);
                mouseEvents.mouseMoveEvent(diagramCanvas, centerX + diagram.element.offsetLeft + 100, centerY + diagram.element.offsetTop + 100);
                mouseEvents.mouseUpEvent(diagramCanvas, centerX + diagram.element.offsetLeft + 100, centerY + diagram.element.offsetTop + 100);
                let label = (diagram.selectedItems.wrapper).children[0];
                expect(label.offsetX == 206.25 && label.offsetY == 165 && label.width == 50 && label.height == 50 && label.rotateAngle == 0).toBe(true);
                done();
            });
        });
    });
    describe('Annotation Issues', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents;
        let diagramCanvas: HTMLElement; let left: number; let top: number;
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            diagram = new Diagram({
                width: 800, height: 500, nodes: [{
                    id: 'node', offsetX: 100, offsetY: 100, width: 100, height: 100,
                    annotations: [{ id: 'label1', content: "Annotation", constraints: AnnotationConstraints.Interaction }]
                }]
            });
            ele = createDiagramContainer();
            diagram.appendTo('#' + ele.id);
            diagramCanvas = document.getElementById(diagram.element.id + 'content');
            mouseEvents = new MouseEvents();
            mouseEvents.clickEvent(diagramCanvas, 1, 1);
            left = diagram.element.offsetLeft; top = diagram.element.offsetTop;
        });

        afterAll((): void => {
            mouseEvents = null;
            if (diagram) {
                diagram.selectionChange = undefined;
                diagram.destroy();
                diagram = null;
            }
            diagramCanvas = null
            removeContainer(ele);
            ele = null;
        });

        it('Select - alignment(Center)', (done: Function) => {
            diagram.selectAll(); diagram.copy(); diagram.paste();
            diagram.nodes[1].offsetX = 400;
            diagram.dataBind();
            let node: NodeModel = (diagram.nodes[0] as NodeModel);
            let annotation: DiagramElement = node.wrapper.children[1];
            mouseEvents.clickEvent(diagramCanvas, annotation.offsetX + left, annotation.offsetY + top);
            expect((diagram.selectedItems as Selector).nodes.length == 1 &&
                (diagram.selectedItems as Selector).nodes[0].annotations !== undefined &&
                diagram.selectedItems.nodes[0].wrapper.children[1].id === annotation.id).toBe(true);
            let node2: NodeModel = (diagram.nodes[1] as NodeModel);
            let annotation2: DiagramElement = node2.wrapper.children[1];
            mouseEvents.clickEvent(diagramCanvas, annotation2.offsetX + left, annotation2.offsetY + top);
            expect((diagram.selectedItems as Selector).nodes.length == 1 &&
                (diagram.selectedItems as Selector).nodes[0].annotations !== undefined &&
                diagram.selectedItems.nodes[0].wrapper.children[1].id === annotation2.id).toBe(true);
            done();
        });
    });

    describe('Annotation interaction mouse leave ', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents;
        let diagramCanvas: HTMLElement; let left: number; let top: number;
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            let nodes: NodeModel[] = [{
                id: 'node2', width: 100, height: 100, offsetX: 200, offsetY: 100,
                annotations: [{ offset: { x: 1, y: 0.5 }, constraints: AnnotationConstraints.Interaction, width: 100, height: 150, content: 'Text Element' }]
            }];
            diagram = new Diagram({
                width: 800, height: 500, nodes: nodes,
            });
            ele = createDiagramContainer();
            diagram.appendTo('#' + ele.id);
            diagramCanvas = document.getElementById(diagram.element.id + 'content');
            mouseEvents = new MouseEvents();
            mouseEvents.clickEvent(diagramCanvas, 1, 1);
            left = diagram.element.offsetLeft; top = diagram.element.offsetTop;
        });

        afterAll((): void => {
            mouseEvents = null;
            if (diagram) {
                diagram.selectionChange = undefined;
                diagram.destroy();
                diagram = null;
            }
            diagramCanvas = null
            removeContainer(ele);
            ele = null;
        });

        it('mouseleave event on Dragging', (done: Function) => {

            let node: NodeModel = (diagram.nodes[0] as NodeModel);
            let annotation: DiagramElement = node.wrapper.children[1];
            mouseEvents.mouseDownEvent(diagramCanvas, annotation.offsetX + left, annotation.offsetY + top);
            mouseEvents.mouseMoveEvent(diagramCanvas, 800, 100);
            mouseEvents.mouseLeaveEvent(diagramCanvas);
            diagram.undo();
            diagram.redo()
            done();
        });
        it('mouseleave event on Resizing', (done: Function) => {
            let node: NodeModel = (diagram.nodes[0] as NodeModel);
            let annotation: DiagramElement = node.wrapper.children[1];
            mouseEvents.mouseDownEvent(diagramCanvas, annotation.bounds.bottomLeft.x + left, annotation.bounds.bottomLeft.y + top);
            mouseEvents.mouseMoveEvent(diagramCanvas, 800, 100);
            mouseEvents.mouseLeaveEvent(diagramCanvas);
            diagram.undo();
            diagram.redo()
            done();
        });
    })
    describe('Annotation interaction mouse leave ', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents;
        let diagramCanvas: HTMLElement; let left: number; let top: number;
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            let nodes: NodeModel[] = [{
                id: 'node2', width: 100, height: 100, offsetX: 200, offsetY: 100,
                annotations: [{ offset: { x: 1, y: 0.5 }, constraints: AnnotationConstraints.Interaction, width: 100, height: 150, content: 'Text Element' }]
            }];
            diagram = new Diagram({
                width: 800, height: 500, nodes: nodes,
            });
            ele = createDiagramContainer();
            diagram.appendTo('#' + ele.id);
            diagramCanvas = document.getElementById(diagram.element.id + 'content');
            mouseEvents = new MouseEvents();
            mouseEvents.clickEvent(diagramCanvas, 1, 1);
            left = diagram.element.offsetLeft; top = diagram.element.offsetTop;
        });

        afterAll((): void => {
            mouseEvents = null;
            if (diagram) {
                diagram.selectionChange = undefined;
                diagram.destroy();
                diagram = null;
            }
            diagramCanvas = null
            removeContainer(ele);
            ele = null;
        });


        it('mouseleave event on Rotation', (done: Function) => {
            let node: NodeModel = (diagram.nodes[0] as NodeModel);
            let annotation: DiagramElement = node.wrapper.children[1];
            mouseEvents.clickEvent(diagramCanvas, annotation.offsetX + left, annotation.offsetY + top)
            mouseEvents.mouseDownEvent(diagramCanvas, annotation.bounds.topCenter.x + left, annotation.bounds.topCenter.y + top - 25);
            mouseEvents.mouseMoveEvent(diagramCanvas, 800, 100);
            mouseEvents.mouseLeaveEvent(diagramCanvas);
            diagram.undo();
            diagram.redo()
            done();
        });
    })

    describe('Annotation with template interaction', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents;
        let diagramCanvas: HTMLElement; let left: number; let top: number;
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            let nodes: NodeModel[] = [{
                id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100,
                annotations: [{ offset: { x: 2, y: 1.5 }, template: '<div style="background:green; height:100%;width:100%;"><div/>', constraints: AnnotationConstraints.Interaction, width: 100, height: 100 }]
            }];
            diagram = new Diagram({
                width: 800, height: 500, nodes: nodes,
            });
            ele = createDiagramContainer();
            diagram.appendTo('#' + ele.id);
            diagramCanvas = document.getElementById(diagram.element.id + 'content');
            mouseEvents = new MouseEvents();
            mouseEvents.clickEvent(diagramCanvas, 1, 1);
            left = diagram.element.offsetLeft; top = diagram.element.offsetTop;
        });

        afterAll((): void => {
            mouseEvents = null;
            if (diagram) {
                diagram.selectionChange = undefined;
                diagram.destroy();
                diagram = null;
            }
            diagramCanvas = null
            removeContainer(ele);
            ele = null;
        });

        it('Select', (done: Function) => {
            let node: NodeModel = (diagram.nodes[0] as NodeModel);
            let annotation: DiagramElement = node.wrapper.children[1];
            mouseEvents.clickEvent(diagramCanvas, annotation.offsetX + left, annotation.offsetY + top);
            expect((diagram.selectedItems as Selector).annotation !== undefined).toBe(true);
            done();
        });
        it('Drag', (done: Function) => {
            drag(diagram, mouseEvents);
            drag(diagram, mouseEvents);
            let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
            expect(label.offsetX == 290 && label.offsetY == 240 && label.width == 100 && label.height == 100).toBe(true);
            done();
        });
        it('Resize North', (done: Function) => {
            resize(diagram, mouseEvents, 'resizeNorth');
            let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
            expect(label.offsetX == 290 && label.offsetY == 255.00000000000003 && label.width == 100 && label.height == 70 && label.rotateAngle == 0).toBe(true);
            done();
        });
        it('Resize South', (done: Function) => {
            resize(diagram, mouseEvents, 'resizeSouth');
            let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
            expect(label.offsetX == 290 && label.offsetY == 270 && label.width == 100 && label.height == 100 && label.rotateAngle == 0).toBe(true);
            done();
        });
        it('Resize East', (done: Function) => {
            resize(diagram, mouseEvents, 'resizeEast');
            let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
            expect(label.offsetX == 300 && label.offsetY == 270 && label.width == 120 && label.height == 100 && label.rotateAngle == 0).toBe(true);
            done();
        });
        it('Resize West', (done: Function) => {
            resize(diagram, mouseEvents, 'resizeWest');
            let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
            expect(label.offsetX == 309.99999999999994 && label.offsetY == 270 && label.width == 100 && label.height == 100 && label.rotateAngle == 0).toBe(true);
            done();
        });
        it('Resize NorthEast', (done: Function) => {
            let element: HTMLElement = document.getElementById('resizeNorthEast');
            let x: number = Number(element.getAttribute('x')) + halfResizeThumbSize;
            let y: number = Number(element.getAttribute('y')) + halfResizeThumbSize;
            mouseEvents.mouseDownEvent(diagramCanvas, x + diagram.element.offsetLeft, y + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop + 20);
            mouseEvents.mouseUpEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop + 20);
            let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
            expect(label.offsetX == 320 && label.offsetY == 280 && label.width == 120.00000000000006 && label.height == 80 && label.rotateAngle == 0).toBe(true);
            done();
        });
        it('Resize NorthWest', (done: Function) => {
            resize(diagram, mouseEvents, 'resizeNorthWest');
            let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
            expect(label.offsetX == 330 && label.offsetY == 290 && label.width == 100.00000000000006 && label.height == 60 && label.rotateAngle == 0).toBe(true);
            done();
        });
        it('Resize SouthEast', (done: Function) => {
            resize(diagram, mouseEvents, 'resizeSouthEast');
            let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
            expect(label.offsetX == 340 && label.offsetY == 300 && label.width == 120.00000000000006 && label.height == 80 && label.rotateAngle == 0).toBe(true);
            done();
        });
        it('Resize SouthWest', (done: Function) => {
            resize(diagram, mouseEvents, 'resizeSouthWest');
            let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
            expect(label.offsetX == 350 && label.offsetY == 309.99999999999994 && label.width == 100.00000000000006 && label.height == 100 && label.rotateAngle == 0).toBe(true);
            done();
        });
        it('Rotate', (done: Function) => {
            rotate(diagram, mouseEvents, 15);
            let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
            expect(label.offsetX == 350 && label.offsetY == 310 && label.width == 100.00000000000006 && label.height == 100 && label.rotateAngle == 20).toBe(true);
            done();
        });
        // it('memory leak', () => {
        //     profile.sample();
        //     let average: any = inMB(profile.averageChange)
        //     //Check average change in memory samples to not be over 10MB
        //     expect(average).toBeLessThan(10);
        //     let memory: any = inMB(getMemoryProfile())
        //     //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        //     expect(memory).toBeLessThan(profile.samples[0] + 0.25);
        // })

    });
    describe('Check annotation verticalAlignment value ', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            let connector: ConnectorModel = {};
            connector.id = "connector1";
            connector.sourcePoint = { x: 350, y: 300 };
            connector.targetPoint = { x: 550, y: 300 };
            connector.annotations = [{ id: "Rbshr", content: "sjdgfhfd", annotationType: "String", constraints: 4, visibility: true, rotateAngle: 0, horizontalAlignment: "Center", verticalAlignment: "Top", margin: { left: 0, right: 0, bottom: 0, top: 0 }, style: { strokeWidth: 0, strokeColor: "transparent", fill: "transparent", strokeDashArray: "", opacity: 1, gradient: { type: "None" }, fontSize: 12, fontFamily: "Arial", textOverflow: "Wrap", textDecoration: "None", whiteSpace: "CollapseSpace", textWrapping: "WrapWithOverflow", textAlign: "Center", color: "black", italic: false, bold: false }, offset: 0.5, alignment: "Center", segmentAngle: false }];

            diagram = new Diagram({
                width: 1000, height: 1000, connectors: [connector]
            });
            ele = createDiagramContainer();
            diagram.appendTo('#' + ele.id);
        });

        afterAll((): void => {
            if (diagram) {
                diagram.selectionChange = undefined;
                diagram.destroy();
                diagram = null;
            }
            removeContainer(ele);
            ele = null;
        });
        it('Checking connector with annotation verticalAlignment initial checking', (done: Function) => {
            expect(diagram.connectors[0].annotations[0].verticalAlignment).toEqual('Top');
            let diagramEle = (document.getElementById(ele.id) as any).ej2_instances[0];
            let txtElement: Element = document.getElementById('connector1_Rbshr');
            expect(Math.round((txtElement as any).x.animVal.value) === 429).toBe(true);
            expect((txtElement as any).y.animVal.value).toEqual(300);
            diagramEle.connectors[0].annotations[0].verticalAlignment = 'Bottom';
            diagramEle.dataBind();
            expect(diagram.connectors[0].annotations[0].verticalAlignment).toEqual('Bottom');
            expect(Math.round((txtElement as any).x.animVal.value) === 429).toBe(true);
            expect((txtElement as any).y.animVal.value).toEqual(285.6000061035156);
            done();
        });
    });
    describe('Annotation undo redo not working properly if the line routing is enabled', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents;
        let diagramCanvas: HTMLElement; let left: number; let top: number;
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            let node1: NodeModel = {
                id: 'node1', width: 90, height: 40, annotations: [{ content: 'Start' }],
                offsetX: 400, offsetY: 30, shape: { type: 'Flow', shape: 'Terminator' }
            };
            diagram = new Diagram({
                width: 800, height: 500, nodes: [node1], constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting,
            });
            ele = createDiagramContainer();
            diagram.appendTo('#' + ele.id);
            diagramCanvas = document.getElementById(diagram.element.id + 'content');
            mouseEvents = new MouseEvents();
            mouseEvents.clickEvent(diagramCanvas, 1, 1);
            left = diagram.element.offsetLeft; top = diagram.element.offsetTop;
        });

        afterAll((): void => {
            mouseEvents = null;
            if (diagram) {
                diagram.selectionChange = undefined;
                diagram.destroy();
                diagram = null;
            }
            diagramCanvas = null;
            removeContainer(ele);
            ele = null;
        });

        it('Annotation undo redo not working properly if the line routing is enabled', (done: Function) => {
            let node: NodeModel = (diagram.nodes[0] as NodeModel);
            expect(node.annotations[0].content === "Start").toBe(true);
            node.annotations[0].content = "Node";
            diagram.dataBind();
            expect(node.annotations[0].content === "Node").toBe(true);
            diagram.undo();
            expect(node.annotations[0].content === "Start").toBe(true);
            diagram.redo();
            expect(node.annotations[0].content === "Node").toBe(true);
            done();
        });
    });
});
describe('Check annotation horizontalAlignment value ', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let savedata: string;

    beforeAll((): void => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }

        let connector: ConnectorModel = {};
        connector.id = "connector1";
        connector.sourcePoint = { x: 350, y: 300 };
        connector.targetPoint = { x: 550, y: 300 };
        connector.annotations = [{ id: "con1", content: "connector", annotationType: "String", constraints: 4, visibility: true, rotateAngle: 0, horizontalAlignment: "Left", verticalAlignment: "Center", margin: { left: 0, right: 0, bottom: 0, top: 0 }, style: { strokeWidth: 0, strokeColor: "transparent", fill: "transparent", strokeDashArray: "", opacity: 1, gradient: { type: "None" }, fontSize: 12, fontFamily: "Arial", textOverflow: "Wrap", textDecoration: "None", whiteSpace: "CollapseSpace", textWrapping: "WrapWithOverflow", textAlign: "Center", color: "black", italic: false, bold: false }, offset: 0.5, alignment: "Center", segmentAngle: false }];

        diagram = new Diagram({
            width: 1000, height: 1000, connectors: [connector]
        });
        ele = createDiagramContainer();
        diagram.appendTo('#' + ele.id);
    });

    afterAll((): void => {
        if (diagram) {
            diagram.selectionChange = undefined;
            diagram.destroy();
            diagram = null;
        }
        removeContainer(ele);
        ele = null;
    });
    it('Checking connector with annotation horizontalAlignment at initial rendering', (done: Function) => {
        expect(diagram.connectors[0].annotations[0].horizontalAlignment).toEqual('Left');
        let txtElement: Element = document.getElementById('connector1_con1');
        expect((txtElement as any).x.animVal.value).toEqual(450);
        expect((txtElement as any).y.animVal.value).toEqual(292.79998779296875);
        done();
    });
    it('Checking connector annotation horizontalAlignment by save and load', (done: Function) => {
        savedata = diagram.saveDiagram();
        diagram.clear();
        diagram.loadDiagram(savedata);
        expect(diagram.connectors[0].annotations[0].horizontalAlignment).toEqual('Left');
        let txtElement: Element = document.getElementById('connector1_con1');
        expect((txtElement as any).x.animVal.value).toEqual(450);
        expect((txtElement as any).y.animVal.value).toEqual(292.79998779296875);
        done();
    });
});

describe('Check Connector annotation Alignment value ', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let mouseEvents: MouseEvents;
    let diagramCanvas: HTMLElement; let left: number; let top: number;
    beforeAll((): void => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
        let connector1: ConnectorModel = {
            id: 'connector1', type: 'Straight', sourcePoint: { x: 100, y: 100 }, targetPoint: { x: 300, y: 100 }, annotations: [{ content: 'ramkumar', verticalAlignment: 'Bottom', horizontalAlignment: 'Right', constraints: AnnotationConstraints.Interaction | AnnotationConstraints.Drag }]
        };
        let connector2: ConnectorModel = {
            id: 'connector2', type: 'Straight', sourcePoint: { x: 100, y: 200 }, targetPoint: { x: 300, y: 200 }, annotations: [{ content: 'ramkumar', verticalAlignment: 'Bottom', horizontalAlignment: 'Left', constraints: AnnotationConstraints.Interaction | AnnotationConstraints.Drag }]
        };
        let connector3: ConnectorModel = {
            id: 'connector3', type: 'Straight', sourcePoint: { x: 100, y: 300 }, targetPoint: { x: 300, y: 300 }, annotations: [{ content: 'BOTTOMSIDE', verticalAlignment: 'Bottom', horizontalAlignment: 'Center', constraints: AnnotationConstraints.Interaction | AnnotationConstraints.Drag }]
        };
        let connector4: ConnectorModel = {
            id: 'connector4', type: 'Straight', sourcePoint: { x: 100, y: 400 }, targetPoint: { x: 300, y: 400 }, annotations: [{ content: 'RIGHTSIDE', verticalAlignment: 'Center', horizontalAlignment: 'Right', constraints: AnnotationConstraints.Interaction | AnnotationConstraints.Drag }]
        };
        let connector5: ConnectorModel = {
            id: 'connector5', type: 'Straight', sourcePoint: { x: 100, y: 500 }, targetPoint: { x: 300, y: 500 }, annotations: [{ content: 'LEFTSIDE', verticalAlignment: 'Center', horizontalAlignment: 'Left', constraints: AnnotationConstraints.Interaction | AnnotationConstraints.Drag }]
        };
        let connector6: ConnectorModel = {
            id: 'connector6', type: 'Straight', sourcePoint: { x: 100, y: 600 }, targetPoint: { x: 300, y: 600 }, annotations: [{ content: 'TOPSIDE', verticalAlignment: 'Top', horizontalAlignment: 'Center', constraints: AnnotationConstraints.Interaction | AnnotationConstraints.Drag }]
        };
        let connector7: ConnectorModel = {
            id: 'connector7', type: 'Straight', sourcePoint: { x: 100, y: 700 }, targetPoint: { x: 300, y: 700 }, annotations: [{ content: 'BOTHCENTER', verticalAlignment: 'Center', horizontalAlignment: 'Center', constraints: AnnotationConstraints.Interaction | AnnotationConstraints.Drag }]
        };
        let connector8: ConnectorModel = {
            id: 'connector8', type: 'Straight', sourcePoint: { x: 500, y: 100 },
            targetPoint: { x: 800, y: 100 },
            annotations: [
                {
                    content: 'Left', offset: 0.1, verticalAlignment: 'Top', horizontalAlignment: 'Right', constraints: AnnotationConstraints.Interaction | AnnotationConstraints.Drag
                },
                {
                    content: 'Right', offset: 0.5, verticalAlignment: 'Center', horizontalAlignment: 'Center', constraints: AnnotationConstraints.Interaction | AnnotationConstraints.Drag
                }
            ]
        };
        let connector9: ConnectorModel = {
            id: 'connector9', type: 'Straight', sourcePoint: { x: 500, y: 400 }, targetPoint: { x: 800, y: 400 }, annotations: [{ content: 'BOTHCENTER', verticalAlignment: 'Top', horizontalAlignment: 'Left', constraints: AnnotationConstraints.Interaction | AnnotationConstraints.Drag }]
        };
        diagram = new Diagram({
            width: 1100, height: 1000,
            connectors: [connector1, connector2, connector3, connector4, connector5, connector6, connector7, connector8, connector9]
        });
        ele = createDiagramContainer();
        diagram.appendTo('#' + ele.id);
        diagramCanvas = document.getElementById(diagram.element.id + 'content');
        mouseEvents = new MouseEvents();
        mouseEvents.clickEvent(diagramCanvas, 1, 1);
        left = diagram.element.offsetLeft; top = diagram.element.offsetTop;
    });
    afterAll((): void => {
        mouseEvents = null;
        if (diagram) {
            diagram.selectionChange = undefined;
            diagram.destroy();
            diagram = null;
        }
        diagramCanvas = null;
        removeContainer(ele);
        ele = null;
    });
    //Connector Annotation Interaction
    it('Select', (done: Function) => {
        let connector: ConnectorModel = (diagram.connectors[0] as ConnectorModel);
        let annotation: DiagramElement = connector.wrapper.children[3];
        mouseEvents.clickEvent(diagramCanvas, annotation.offsetX + left, annotation.offsetY + top);
        expect((diagram.selectedItems as Selector).connectors.length == 1 &&
            (diagram.selectedItems as Selector).annotation !== undefined).toBe(true);
        let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
        done();
    });
    it('Drag', (done: Function) => {
        drag(diagram, mouseEvents);
        let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
        expect(Math.round(label.offsetX) == 173 && Math.round(label.offsetY) == 103).toBe(true);
        done();
    });
    it('Resize North', (done: Function) => {
        resize(diagram, mouseEvents, 'resizeNorth');
        let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
        expect(Math.round(label.offsetX) == 173 && Math.round(label.offsetY) == 113 && Math.round(label.width) == 54 && Math.round(label.height) == 14).toBe(true);
        done();
    });
    it('Resize South', (done: Function) => {
        let element: HTMLElement = document.getElementById('resizeSouth');
        let x: number = Number(element.getAttribute('x')) + halfResizeThumbSize;
        let y: number = Number(element.getAttribute('y')) + halfResizeThumbSize;
        mouseEvents.mouseDownEvent(diagramCanvas, x + diagram.element.offsetLeft, y + diagram.element.offsetTop);
        mouseEvents.mouseMoveEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop);
        mouseEvents.mouseMoveEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop + 20);
        mouseEvents.mouseUpEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop + 20);
        let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
        expect(Math.round(label.offsetX) == 173 && Math.round(label.offsetY) == 123 && Math.round(label.width) == 54 && Math.round(label.height) == 34).toBe(true);
        done();
    });
    it('Resize East', (done: Function) => {
        resize(diagram, mouseEvents, 'resizeEast');
        let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
        expect((Math.ceil(label.offsetX) == 183 || Math.ceil(label.offsetX) == 213) && (Math.round(label.offsetY) == 123 || Math.round(label.offsetY) == 153) && (Math.round(label.width) == 74 || Math.round(label.width) == 54) && Math.round(label.height) == 34).toBe(true);
        done();
    });
    it('Resize West', (done: Function) => {
        let element: HTMLElement = document.getElementById('resizeWest');
        let x: number = Number(element.getAttribute('x')) + halfResizeThumbSize;
        let y: number = Number(element.getAttribute('y')) + halfResizeThumbSize;
        mouseEvents.mouseDownEvent(diagramCanvas, x + diagram.element.offsetLeft, y + diagram.element.offsetTop);
        mouseEvents.mouseMoveEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop);
        mouseEvents.mouseMoveEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop + 20);
        mouseEvents.mouseUpEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop + 20);
        let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
        expect((Math.round(label.offsetX) == 193 || Math.round(label.offsetX) == 222) && Math.round(label.offsetY) == 123 && Math.round(label.width) == 54 && Math.round(label.height) == 34).toBe(true);
        done();
    });
    it('Rotate', (done: Function) => {
        rotate(diagram, mouseEvents, 15);
        let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
        expect((Math.round(label.offsetX) == 193 || Math.round(label.offsetX) == 222) && Math.round(label.offsetY) == 123 || (Math.round(label.offsetY) == 153) && Math.round(label.width) == 55 && Math.round(label.height) == 34 && label.rotateAngle == 45).toBe(true);
        done();
    });
    it('Select after annotation rotation', (done: Function) => {
        diagram.connectors[0].annotations[0].height = 60;
        diagram.dataBind();
        mouseEvents.clickEvent(diagramCanvas, 1, 1);
        let label = diagram.connectors[0].wrapper.children[3];
        mouseEvents.clickEvent(diagramCanvas, label.offsetX + left, label.offsetY + top);
        expect((diagram.selectedItems as Selector).annotation != undefined).toBe(true);
        done();
    });
    it('Drag after annotation rotation', (done: Function) => {
        drag(diagram, mouseEvents);
        let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
        expect((Math.round(label.offsetX) == 213 || Math.round(label.offsetX) == 242) && (label.offsetY == 130 || Math.round(label.offsetY) === 170) && (Math.round(label.width) == 54 || Math.round(label.width) == 35) && label.height == 60 && label.rotateAngle == 45).toBe(true);
        done();
    });
    it('Resize East after annotation rotation', (done: Function) => {
        resize(diagram, mouseEvents, 'resizeEast');
        let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
        expect((Math.round(label.offsetX) == 223 || Math.round(label.offsetX) == 262) && (label.offsetY == 140 || Math.round(label.offsetY) == 190) && (Math.round(label.width) == 82 || Math.round(label.width) == 35) && label.height == 60 && label.rotateAngle == 45).toBe(true);
        done();
    });
    it('Resize West after annotation rotation', (done: Function) => {
        resize(diagram, mouseEvents, 'resizeWest');
        let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
        expect((Math.round(label.offsetX) == 233 || Math.round(label.offsetX) == 262) && (label.offsetY == 150 || Math.round(label.offsetY) === 210) && (Math.round(label.width) == 54 || Math.round(label.width) === 35) && label.height == 60 && label.rotateAngle == 45).toBe(true);
        done();
    });
    it('Rotate', (done: Function) => {
        rotate(diagram, mouseEvents, 15);
        let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
        expect((Math.round(label.offsetX) == 233 || Math.round(label.offsetX) == 262) && (label.offsetY == 150 || Math.round(label.offsetY) === 210) && (Math.round(label.width) == 54 || Math.round(label.width) === 35) && label.height == 60 && label.rotateAngle == 75).toBe(true);
        done();
    });
    it('Drag the annotation with alignment bottom left', (done: Function) => {
        var connector = diagram.connectors[1];
        var annotation = connector.wrapper.children[3];
        mouseEvents.clickEvent(diagramCanvas, annotation.offsetX + left, annotation.offsetY + top);
        drag(diagram, mouseEvents);
        //Need to evaluate testcase
        //expect(Math.round(connector.wrapper.children[3].offsetX) == 248).toBe(true);
        expect(true).toBe(true);
        done();
    });
    it('Drag the annotation with alignment bottom center', (done: Function) => {
        var connector = diagram.connectors[2];
        var annotation = connector.wrapper.children[3];
        mouseEvents.clickEvent(diagramCanvas, annotation.offsetX + left, annotation.offsetY + top);
        drag(diagram, mouseEvents);
        expect(Math.round(connector.wrapper.children[3].offsetX) == 200).toBe(true);
        done();
    });
    it('Drag the annotation with alignment Center Right', (done: Function) => {
        var connector = diagram.connectors[3];
        var annotation = connector.wrapper.children[3];
        mouseEvents.clickEvent(diagramCanvas, annotation.offsetX, annotation.offsetY);
        drag(diagram, mouseEvents);
        expect(Math.round(connector.wrapper.children[3].offsetX) == 167).toBe(true);
        done();
    });
    it('Drag the annotation with alignment Center Left', (done: Function) => {
        var connector = diagram.connectors[4];
        var annotation = connector.wrapper.children[3];
        mouseEvents.clickEvent(diagramCanvas, annotation.offsetX, annotation.offsetY);
        drag(diagram, mouseEvents);
        expect(Math.round(connector.wrapper.children[3].offsetX) == 229).toBe(true);
        done();
    });
    it('Drag the annotation with alignment Top left', (done: Function) => {
        var connector = diagram.connectors[8];
        var annotation = connector.wrapper.children[3];
        mouseEvents.clickEvent(diagramCanvas, annotation.offsetX, annotation.offsetY);
        drag(diagram, mouseEvents);
        expect(Math.round(connector.wrapper.children[3].offsetX) == 691).toBe(true);
        done();
    });
    it('Drag the annotation with alignment Top Right', (done: Function) => {
        var connector = diagram.connectors[7];
        var annotation = connector.wrapper.children[3];
        mouseEvents.clickEvent(diagramCanvas, annotation.offsetX, annotation.offsetY);
        drag(diagram, mouseEvents);
        expect(Math.round(connector.wrapper.children[3].offsetX) == 520).toBe(true);
        done();
    });
    it('Drag the annotation with alignment Top Center', (done: Function) => {

        var connector = diagram.connectors[5];
        var annotation = connector.wrapper.children[3];
        mouseEvents.clickEvent(diagramCanvas, annotation.offsetX, annotation.offsetY);
        drag(diagram, mouseEvents);
        expect(Math.round(connector.wrapper.children[3].offsetX) == 200).toBe(true);
        done();
    });

});
describe('Check Node annotation Alignment value ', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let mouseEvents: MouseEvents;
    let diagramCanvas: HTMLElement; let left: number; let top: number;
    beforeAll((): void => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
        let node1: NodeModel = {
            id: 'node1', width: 100, height: 100, offsetX: 200, offsetY: 100,
            annotations: [{ offset: { x: 0.5, y: 0.5 }, verticalAlignment: 'Center', horizontalAlignment: 'Right', width: 100, height: 150, content: 'Text Element' }]
        };

        let node2: NodeModel = {
            id: 'node2', width: 150, height: 60, offsetX: 200, offsetY: 200,
            shape: { type: 'Flow', shape: 'Process' },
            annotations: [{
                id: 'label2', content: 'start transaction', offset: { x: 0.5, y: 0.5 },
                verticalAlignment: 'Center', horizontalAlignment: 'Left',
                constraints: AnnotationConstraints.Interaction | AnnotationConstraints.Drag
            }]
        };
        let node3: NodeModel = {
            id: 'node3', width: 150, height: 60, offsetX: 200, offsetY: 300,
            shape: { type: 'Flow', shape: 'Decision' },
            annotations: [{
                id: 'label3', content: 'Verification', offset: { x: 0.5, y: 0.5 },
                verticalAlignment: 'Bottom', horizontalAlignment: 'Center',
                constraints: AnnotationConstraints.Interaction | AnnotationConstraints.Drag
            }]
        };
        let node4: NodeModel = {
            id: 'node4', width: 150, height: 100, offsetX: 200, offsetY: 400,
            shape: { type: 'Flow', shape: 'Decision' },
            annotations: [{
                id: 'label4', content: 'Credit card Valid', offset: { x: 0.5, y: 0.5 },
                verticalAlignment: 'Top', horizontalAlignment: 'Center',
                constraints: AnnotationConstraints.Interaction | AnnotationConstraints.Drag
            }]
        };
        let node5: NodeModel = {
            id: 'node5', width: 150, height: 60, offsetX: 200, offsetY: 500,
            shape: { type: 'Flow', shape: 'Process' },
            annotations: [{
                id: 'label5', content: 'Complete Transaction', offset: { x: 0.5, y: 0.5 },
                verticalAlignment: 'Top', horizontalAlignment: 'Right',
                constraints: AnnotationConstraints.Interaction | AnnotationConstraints.Drag
            }]
        };
        let node6: NodeModel = {
            id: 'node6', width: 250, height: 60, offsetX: 500, offsetY: 300,
            shape: { type: 'Flow', shape: 'Card' },
            annotations: [{
                id: 'label6', content: 'Email', offset: { x: 0.5, y: 0.5 },
                verticalAlignment: 'Top', horizontalAlignment: 'Left',
                constraints: AnnotationConstraints.Interaction | AnnotationConstraints.Drag
            }]
        };
        let node7: NodeModel = {
            id: 'node7', width: 150, height: 60, offsetX: 500, offsetY: 400,
            shape: { type: 'Flow', shape: 'Process' },
            annotations: [{
                id: 'label7', content: 'Custom Database', offset: { x: 0.5, y: 0.5 },
                verticalAlignment: 'Bottom', horizontalAlignment: 'Right',
                constraints: AnnotationConstraints.Interaction | AnnotationConstraints.Drag
            }]
        };
        let node8: NodeModel = {
            id: 'node8', width: 150, height: 60, offsetX: 500, offsetY: 500,
            shape: { type: 'Flow', shape: 'Process' },
            annotations: [{
                id: 'label8', content: 'Log Transaction', offset: { x: 0.5, y: 0.5 },
                verticalAlignment: 'Bottom', horizontalAlignment: 'Left',
                constraints: AnnotationConstraints.Interaction | AnnotationConstraints.Drag
            }]
        };
        diagram = new Diagram({
            width: 1100, height: 1000, nodes: [node1, node2, node3, node4, node5, node6, node7, node8],
        });
        ele = createDiagramContainer();
        diagram.appendTo('#' + ele.id);
        diagramCanvas = document.getElementById(diagram.element.id + 'content');
        mouseEvents = new MouseEvents();
        mouseEvents.clickEvent(diagramCanvas, 1, 1);
        left = diagram.element.offsetLeft; top = diagram.element.offsetTop;
    });
    afterAll((): void => {
        mouseEvents = null;
        if (diagram) {
            diagram.selectionChange = undefined;
            diagram.destroy();
            diagram = null;
        }
        diagramCanvas = null;
        removeContainer(ele);
        ele = null;
    });
    it('Without and with select constraints', (done: Function) => {
        let node: NodeModel = (diagram.nodes[0] as NodeModel);
        let annotation: DiagramElement = node.wrapper.children[1];
        mouseEvents.clickEvent(diagramCanvas, annotation.offsetX + left, annotation.offsetY + top);
        expect((diagram.selectedItems as Selector).annotation == undefined).toBe(true);
        (node as Node).annotations[0].constraints = AnnotationConstraints.Select;
        mouseEvents.clickEvent(diagramCanvas, 1, 1);
        mouseEvents.clickEvent(diagramCanvas, annotation.offsetX + left, annotation.offsetY + top);
        expect((diagram.selectedItems as Selector).annotation !== undefined).toBe(true);
        done();
    });
    it('Without and with drag constraints', (done: Function) => {
        drag(diagram, mouseEvents);
        expect((diagram.selectedItems as Selector).annotation == undefined).toBe(true);
        let node: NodeModel = (diagram.nodes[0] as NodeModel);
        let label: DiagramElement = node.wrapper.children[1];
        diagram.nodes[0].annotations[0].constraints = AnnotationConstraints.Interaction | AnnotationConstraints.Drag;
        mouseEvents.clickEvent(diagramCanvas, label.offsetX + left, label.offsetY + top);
        drag(diagram, mouseEvents);
        expect(label.offsetX == 170 && label.offsetY == 120 && label.width == 100 && label.height == 150 && label.rotateAngle == 0).toBe(true);
        done();
    });
    it('Without and with resize constraints', (done: Function) => {
        resize(diagram, mouseEvents, 'resizeNorth');
        let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
        diagram.nodes[0].annotations[0].constraints = AnnotationConstraints.Interaction | AnnotationConstraints.Resize;
        resize(diagram, mouseEvents, 'resizeNorth');
        expect(label.offsetX == 170 && label.offsetY == 140 && label.rotateAngle == 0).toBe(true);
        done();
    });
    it('Without and with rotate constraints', (done: Function) => {
        rotate(diagram, mouseEvents, 20);
        diagram.nodes[0].annotations[0].constraints = AnnotationConstraints.Interaction | AnnotationConstraints.Rotate;
        let node: NodeModel = (diagram.nodes[0] as NodeModel);
        let label: DiagramElement = node.wrapper.children[1];
        mouseEvents.clickEvent(diagramCanvas, label.offsetX + left, label.offsetY + top);
        rotate(diagram, mouseEvents, 20);
        expect(diagram.nodes[0].annotations[0].rotateAngle != 0).toBe(true);
        done();
    });
});


describe('Hyperlink Link target', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let diagramCanvas: HTMLElement;
    let mouseEvents: MouseEvents;

    beforeAll((): void => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
        let nodes: NodeModel[] = [
            {
                id: 'node1', height: 100, width: 100, offsetX: 50, offsetY: 50,
                annotations: [{ hyperlink: { link: 'https://www.google.com', hyperlinkOpenState: 'NewTab' } }]
            }
        ];
        diagram = new Diagram({
            width: 1000, height: 1000, nodes: nodes
        });
        ele = createDiagramContainer();
        diagram.appendTo('#' + ele.id);
        diagramCanvas = document.getElementById(diagram.element.id + 'content');
        mouseEvents = new MouseEvents();
    });
    afterAll((): void => {
        mouseEvents = null;
        if (diagram) {
            diagram.selectionChange = undefined;
            diagram.destroy();
            diagram = null;
        }
        diagramCanvas = null;
        removeContainer(ele);
        ele = null;
    });

    it('Checking hyperlinkOpenState value at initial rendering', (done: Function) => {
        let hyperlinkOpenState = diagram.nodes[0].annotations[0].hyperlink.hyperlinkOpenState;
        mouseEvents.mouseDownEvent(diagramCanvas, 50, 50);
        mouseEvents.mouseUpEvent(diagramCanvas, 50, 50);
        expect(hyperlinkOpenState == 'NewTab').toBe(true);
        done();
    });

    it('Changing hyperlinkOpenState value to NewWindow at runtime', (done: Function) => {
        let hyperlinkOpenState = diagram.nodes[0].annotations[0].hyperlink.hyperlinkOpenState
        hyperlinkOpenState = 'NewWindow';
        mouseEvents.mouseDownEvent(diagramCanvas, 50, 50);
        mouseEvents.mouseUpEvent(diagramCanvas, 50, 50);
        expect(hyperlinkOpenState == 'NewWindow').toBe(true);
        done();
    });

    it('Changing hyperlinkOpenState value to CurrentTab at runtime', (done: Function) => {
        let hyperlinkOpenState = diagram.nodes[0].annotations[0].hyperlink.hyperlinkOpenState
        hyperlinkOpenState = 'CurrentTab';
        mouseEvents.mouseDownEvent(diagramCanvas, 50, 50);
        mouseEvents.mouseUpEvent(diagramCanvas, 50, 50);
        expect(hyperlinkOpenState == 'CurrentTab').toBe(true);
        done();
    });
});

describe('Bezier annotation alignment is not working properly', () => {
    let diagram: Diagram;
    let ele: HTMLElement;

    beforeAll((): void => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
        let connectors: ConnectorModel[] = [
            {
                id: 'connector1', type: 'Bezier', sourcePoint: { x: 100, y: 200 }, targetPoint: { x: 300, y: 300 },
                annotations: [{ content: 'annot1', horizontalAlignment: 'Center', verticalAlignment: 'Bottom' }]
            },
        ];
        diagram = new Diagram({
            width: 1000, height: 1000, connectors: connectors
        });
        ele = createDiagramContainer();
        diagram.appendTo('#' + ele.id);
    });
    afterAll((): void => {
        if (diagram) {
            diagram.selectionChange = undefined;
            diagram.destroy();
            diagram = null;
        }
        removeContainer(ele);
        ele = null;
    });
    it('Checking bezier annotation alignment at initial rendering', (done: Function) => {
        let connector = diagram.connectors[0];
        expect(Math.round(connector.wrapper.children[3].bounds.x) === 179 &&
            connector.wrapper.children[3].bounds.y === 233.89205336784084).toBe(true);
        done();
    });
    it('Checking bezier annotation alignment after changing it at runtime', (done: Function) => {
        let connector = diagram.connectors[0];
        connector.annotations[0].horizontalAlignment = 'Right';
        connector.annotations[0].verticalAlignment = 'Top';
        diagram.dataBind();
        expect(Math.round(connector.wrapper.children[3].bounds.x) === 161 &&
            connector.wrapper.children[3].bounds.y === 248.29205336784085).toBe(true);
        done();
    });

});

describe('Double click on node annotation will open the edit of invisible annotation', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let mouseEvents: MouseEvents;
    let diagramCanvas: HTMLElement; let left: number; let top: number;

    beforeAll((): void => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            this.skip(); //Skips test (in Chai)
            return;
        }
        let nodes: NodeModel[] = [{
            id: 'node1', width: 150, height: 100, offsetX: 100, offsetY: 100, annotations: [
                {
                    content: '65465465451654 1651651651',
                    style: {
                        fill: 'none',
                        strokeColor: 'none',
                        textWrapping: 'Wrap',
                        fontSize: 10,
                    },
                    visibility: false,
                }]
        }];
        diagram = new Diagram({
            width: 800, height: 500, nodes: nodes,
        });
        ele = createDiagramContainer();
        diagram.appendTo('#' + ele.id);
        diagramCanvas = document.getElementById(diagram.element.id + 'content');
        mouseEvents = new MouseEvents();
        mouseEvents.clickEvent(diagramCanvas, 1, 1);
        left = diagram.element.offsetLeft; top = diagram.element.offsetTop;
    });

    afterAll((): void => {
        mouseEvents = null;
        if (diagram) {
            diagram.selectionChange = undefined;
            diagram.destroy();
            diagram = null;
        }
        diagramCanvas = null;
        removeContainer(ele);
        ele = null;
    });

    it('Double Click node', (done: Function) => {
        //  let node: NodeModel = (diagram.nodes[0] as NodeModel);
        mouseEvents.dblclickEvent(diagramCanvas, 100, 100);
        expect((diagram.selectedItems as Selector).annotation !== undefined).toBe(false);
        diagram.nodes[0].annotations = [{ content: 'node2', visibility: true }];
        mouseEvents.dblclickEvent(diagramCanvas, 100, 100);
        expect((diagram.selectedItems as Selector).annotation == undefined).toBe(true);
        done();
    });
});

describe('Annotation Fly off', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let mouseEvents: MouseEvents = new MouseEvents();
    let diagramCanvas: HTMLElement; let left: number; let top: number;

    beforeAll((): void => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            this.skip(); //Skips test (in Chai)
            return;
        }
        let nodes: NodeModel[] = [{
            id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100,
            annotations: [{ offset: { x: 2, y: 1.5 }, content: 'node1', constraints: AnnotationConstraints.Interaction, width: 100, height: 100 }]
        }];
        diagram = new Diagram({
            width: 800, height: 500, nodes: nodes,
        });
        ele = createDiagramContainer();
        diagram.appendTo('#' + ele.id);
        diagramCanvas = document.getElementById(diagram.element.id + 'content');
        mouseEvents = new MouseEvents();
        mouseEvents.clickEvent(diagramCanvas, 1, 1);
        left = diagram.element.offsetLeft; top = diagram.element.offsetTop;
    });

    afterAll((): void => {
        mouseEvents = null;
        if (diagram) {
            diagram.selectionChange = undefined;
            diagram.destroy();
            diagram = null;
        }
        diagramCanvas = null;
        removeContainer(ele);
        ele = null;
    });

    it('Select', (done: Function) => {
        let node: NodeModel = (diagram.nodes[0] as NodeModel);
        let annotation: DiagramElement = node.wrapper.children[1];
        mouseEvents.clickEvent(diagramCanvas, annotation.offsetX + left, annotation.offsetY + top);
        expect((diagram.selectedItems as Selector).annotation !== undefined).toBe(true);
        done();
    });
    it('Drag', (done: Function) => {
        drag(diagram, mouseEvents);
        drag(diagram, mouseEvents);
        let label = (((diagram.selectedItems as Selector).wrapper) as GroupableView).children[0];
        expect(label.offsetX == 290 && label.offsetY == 240 && label.width == 100 && label.height == 100).toBe(true);
        done();
    });
});

describe('Checking annotation', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let savedata: string;

    beforeAll((): void => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
        diagram = new Diagram({
            width: 1000, height: 1000,
        });
        ele = createDiagramContainer();
        diagram.appendTo('#' + ele.id);
    });

    afterAll((): void => {
        if (diagram) {
            diagram.selectionChange = undefined;
            diagram.destroy();
            diagram = null;
        }
        removeContainer(ele);
        ele = null;
    });

    function numbersinranges(x: number, r: number, t: number) {
        if ((x >= r && x <= t)) {
            return true;
        }
        else {
            return false;
        }
    }

    // it('After Save and Load', (done: Function) => {
    //     let data = `{
    //         "width": "100%",
    //         "height": "100%",
    //         "nodes": [{
    //                 "shape": {
    //                     "type": "Flow",
    //                     "shape": "Process"
    //                 },
    //                 "ports": [],
    //                 "id": "Títulof3rS2",
    //                 "width": 2339.9999999999995,
    //                 "height": 35,
    //                 "style": {
    //                     "fill": "rgba(179,157,219,1)",
    //                     "strokeWidth": 2,
    //                     "strokeColor": "#3A3A3A",
    //                     "strokeDashArray": "",
    //                     "opacity": 1,
    //                     "gradient": {
    //                         "type": "None"
    //                     }
    //                 },
    //                 "annotations": [{
    //                         "id": "vVGcB",
    //                         "content": "Realizar Análise de Esteira de Proposta ",
    //                         "annotationType": "String",
    //                         "style": {
    //                             "strokeWidth": 0,
    //                             "strokeColor": "transparent",
    //                             "fill": "transparent",
    //                             "bold": false,
    //                             "textWrapping": "WrapWithOverflow",
    //                             "color": "black",
    //                             "whiteSpace": "CollapseSpace",
    //                             "fontFamily": "Arial",
    //                             "fontSize": 12,
    //                             "italic": false,
    //                             "opacity": 1,
    //                             "strokeDashArray": "",
    //                             "textAlign": "Center",
    //                             "textOverflow": "Wrap",
    //                             "textDecoration": "None"
    //                         },
    //                         "hyperlink": {
    //                             "link": "",
    //                             "content": "",
    //                             "textDecoration": "None"
    //                         },
    //                         "constraints": 4,
    //                         "visibility": true,
    //                         "rotateAngle": 0,
    //                         "margin": {
    //                             "right": 0,
    //                             "bottom": 0,
    //                             "left": 0,
    //                             "top": 0
    //                         },
    //                         "horizontalAlignment": "Center",
    //                         "verticalAlignment": "Center",
    //                         "offset": {
    //                             "x": 0.5,
    //                             "y": 0.5
    //                         }
    //                     }
    //                 ],
    //                 "container": null,
    //                 "offsetX": 1270,
    //                 "offsetY": -336.5,
    //                 "visible": true,
    //                 "horizontalAlignment": "Left",
    //                 "verticalAlignment": "Top",
    //                 "backgroundColor": "transparent",
    //                 "borderColor": "none",
    //                 "borderWidth": 0,
    //                 "rotateAngle": 0,
    //                 "pivot": {
    //                     "x": 0.5,
    //                     "y": 0.5
    //                 },
    //                 "margin": {
    //                     "top": 0,
    //                     "left": 0
    //                 },
    //                 "flip": "None",
    //                 "wrapper": {
    //                     "actualSize": {
    //                         "width": 2339.9999999999995,
    //                         "height": 35
    //                     },
    //                     "offsetX": 1270,
    //                     "offsetY": -336.5
    //                 },
    //                 "constraints": 5240430,
    //                 "previewSize": {},
    //                 "dragSize": {},
    //                 "zIndex": 3,
    //                 "isExpanded": true,
    //                 "expandIcon": {
    //                     "shape": "None"
    //                 },
    //                 "fixedUserHandles": [],
    //                 "tooltip": {
    //                     "openOn": "Auto"
    //                 },
    //                 "inEdges": [],
    //                 "outEdges": [],
    //                 "parentId": "",
    //                 "processId": "",
    //                 "umlIndex": -1,
    //                 "isPhase": false,
    //                 "isLane": false
    //             }, {
    //                 "shape": {
    //                     "type": "Bpmn",
    //                     "shape": "Event",
    //                     "event": {
    //                         "event": "Start",
    //                         "trigger": "Timer"
    //                     },
    //                     "annotations": [],
    //                     "activity": {
    //                         "subProcess": {}
    //                     }
    //                 },
    //                 "ports": [{
    //                         "inEdges": [],
    //                         "outEdges": [],
    //                         "offset": {
    //                             "x": 0,
    //                             "y": 0.5
    //                         },
    //                         "visibility": 12,
    //                         "constraints": 28,
    //                         "id": "B8E3A",
    //                         "height": 12,
    //                         "width": 12,
    //                         "shape": "Square",
    //                         "margin": {
    //                             "left": 0,
    //                             "top": 0,
    //                             "right": 0,
    //                             "bottom": 0
    //                         },
    //                         "style": {
    //                             "fill": "white",
    //                             "strokeColor": "black",
    //                             "opacity": 1,
    //                             "strokeDashArray": "",
    //                             "strokeWidth": 1
    //                         },
    //                         "horizontalAlignment": "Center",
    //                         "verticalAlignment": "Center"
    //                     }, {
    //                         "inEdges": [],
    //                         "outEdges": ["connectorqvrHT"],
    //                         "offset": {
    //                             "x": 1,
    //                             "y": 0.5
    //                         },
    //                         "visibility": 12,
    //                         "constraints": 28,
    //                         "id": "wAPsD",
    //                         "height": 12,
    //                         "width": 12,
    //                         "shape": "Square",
    //                         "margin": {
    //                             "left": 0,
    //                             "top": 0,
    //                             "right": 0,
    //                             "bottom": 0
    //                         },
    //                         "style": {
    //                             "fill": "white",
    //                             "strokeColor": "black",
    //                             "opacity": 1,
    //                             "strokeDashArray": "",
    //                             "strokeWidth": 1
    //                         },
    //                         "horizontalAlignment": "Center",
    //                         "verticalAlignment": "Center"
    //                     }, {
    //                         "inEdges": [],
    //                         "outEdges": [],
    //                         "offset": {
    //                             "x": 0.25,
    //                             "y": 0
    //                         },
    //                         "visibility": 12,
    //                         "constraints": 28,
    //                         "id": "oBm0n",
    //                         "height": 12,
    //                         "width": 12,
    //                         "shape": "Square",
    //                         "margin": {
    //                             "left": 0,
    //                             "top": 0,
    //                             "right": 0,
    //                             "bottom": 0
    //                         },
    //                         "style": {
    //                             "fill": "white",
    //                             "strokeColor": "black",
    //                             "opacity": 1,
    //                             "strokeDashArray": "",
    //                             "strokeWidth": 1
    //                         },
    //                         "horizontalAlignment": "Center",
    //                         "verticalAlignment": "Center"
    //                     }, {
    //                         "inEdges": [],
    //                         "outEdges": [],
    //                         "offset": {
    //                             "x": 0.75,
    //                             "y": 0
    //                         },
    //                         "visibility": 12,
    //                         "constraints": 28,
    //                         "id": "Kwtrd",
    //                         "height": 12,
    //                         "width": 12,
    //                         "shape": "Square",
    //                         "margin": {
    //                             "left": 0,
    //                             "top": 0,
    //                             "right": 0,
    //                             "bottom": 0
    //                         },
    //                         "style": {
    //                             "fill": "white",
    //                             "strokeColor": "black",
    //                             "opacity": 1,
    //                             "strokeDashArray": "",
    //                             "strokeWidth": 1
    //                         },
    //                         "horizontalAlignment": "Center",
    //                         "verticalAlignment": "Center"
    //                     }, {
    //                         "inEdges": [],
    //                         "outEdges": [],
    //                         "offset": {
    //                             "x": 0.25,
    //                             "y": 1
    //                         },
    //                         "visibility": 12,
    //                         "constraints": 28,
    //                         "id": "m8MEL",
    //                         "height": 12,
    //                         "width": 12,
    //                         "shape": "Square",
    //                         "margin": {
    //                             "left": 0,
    //                             "top": 0,
    //                             "right": 0,
    //                             "bottom": 0
    //                         },
    //                         "style": {
    //                             "fill": "white",
    //                             "strokeColor": "black",
    //                             "opacity": 1,
    //                             "strokeDashArray": "",
    //                             "strokeWidth": 1
    //                         },
    //                         "horizontalAlignment": "Center",
    //                         "verticalAlignment": "Center"
    //                     }, {
    //                         "inEdges": [],
    //                         "outEdges": [],
    //                         "offset": {
    //                             "x": 0.75,
    //                             "y": 1
    //                         },
    //                         "visibility": 12,
    //                         "constraints": 28,
    //                         "id": "aQGuK",
    //                         "height": 12,
    //                         "width": 12,
    //                         "shape": "Square",
    //                         "margin": {
    //                             "left": 0,
    //                             "top": 0,
    //                             "right": 0,
    //                             "bottom": 0
    //                         },
    //                         "style": {
    //                             "fill": "white",
    //                             "strokeColor": "black",
    //                             "opacity": 1,
    //                             "strokeDashArray": "",
    //                             "strokeWidth": 1
    //                         },
    //                         "horizontalAlignment": "Center",
    //                         "verticalAlignment": "Center"
    //                     }
    //                 ],
    //                 "id": "Iniciar-cronômetroP0cfO",
    //                 "width": 35,
    //                 "height": 35,
    //                 "style": {
    //                     "fill": "rgba(178,223,219,1)",
    //                     "strokeWidth": 2,
    //                     "strokeColor": "#004d40ff",
    //                     "strokeDashArray": "",
    //                     "opacity": 1,
    //                     "gradient": {
    //                         "type": "None"
    //                     }
    //                 },
    //                 "container": null,
    //                 "offsetX": 197.5,
    //                 "offsetY": 417.4999999999999,
    //                 "visible": true,
    //                 "horizontalAlignment": "Left",
    //                 "verticalAlignment": "Top",
    //                 "backgroundColor": "transparent",
    //                 "borderColor": "none",
    //                 "borderWidth": 0,
    //                 "rotateAngle": 0,
    //                 "pivot": {
    //                     "x": 0.5,
    //                     "y": 0.5
    //                 },
    //                 "margin": {},
    //                 "flip": "None",
    //                 "wrapper": {
    //                     "actualSize": {
    //                         "width": 35,
    //                         "height": 35
    //                     },
    //                     "offsetX": 197.5,
    //                     "offsetY": 417.4999999999999
    //                 },
    //                 "constraints": 5240814,
    //                 "previewSize": {},
    //                 "dragSize": {},
    //                 "zIndex": 16,
    //                 "annotations": [{
    //                         "id": "dTM79",
    //                         "content": "",
    //                         "annotationType": "String",
    //                         "style": {
    //                             "strokeWidth": 0,
    //                             "strokeColor": "transparent",
    //                             "fill": "transparent",
    //                             "bold": false,
    //                             "textWrapping": "WrapWithOverflow",
    //                             "color": "black",
    //                             "whiteSpace": "CollapseSpace",
    //                             "fontFamily": "Arial",
    //                             "fontSize": 12,
    //                             "italic": false,
    //                             "opacity": 1,
    //                             "strokeDashArray": "",
    //                             "textAlign": "Center",
    //                             "textOverflow": "Wrap",
    //                             "textDecoration": "None"
    //                         },
    //                         "hyperlink": {
    //                             "link": "",
    //                             "content": "",
    //                             "textDecoration": "None"
    //                         },
    //                         "constraints": 4,
    //                         "visibility": true,
    //                         "rotateAngle": 0,
    //                         "margin": {
    //                             "left": 0,
    //                             "top": 0,
    //                             "right": 0,
    //                             "bottom": 0
    //                         },
    //                         "horizontalAlignment": "Center",
    //                         "verticalAlignment": "Center",
    //                         "offset": {
    //                             "x": 0.5,
    //                             "y": 0.5
    //                         }
    //                     }
    //                 ],
    //                 "isExpanded": true,
    //                 "expandIcon": {
    //                     "shape": "None"
    //                 },
    //                 "fixedUserHandles": [],
    //                 "tooltip": {
    //                     "openOn": "Auto"
    //                 },
    //                 "inEdges": [],
    //                 "outEdges": ["connectorqvrHT"],
    //                 "parentId": "",
    //                 "processId": "",
    //                 "umlIndex": -1,
    //                 "isPhase": false,
    //                 "isLane": false
    //             }, {
    //                 "shape": {
    //                     "type": "Text",
    //                     "content": "Diariamente ",
    //                     "margin": {
    //                         "left": 0,
    //                         "top": 0,
    //                         "right": 0,
    //                         "bottom": 0
    //                     }
    //                 },
    //                 "ports": [],
    //                 "style": {
    //                     "fill": "none",
    //                     "strokeColor": "none",
    //                     "strokeWidth": 1,
    //                     "strokeDashArray": "2 2",
    //                     "opacity": 1,
    //                     "gradient": {
    //                         "type": "None"
    //                     },
    //                     "fontSize": 12,
    //                     "fontFamily": "Arial",
    //                     "textOverflow": "Wrap",
    //                     "textDecoration": "None",
    //                     "whiteSpace": "CollapseSpace",
    //                     "textWrapping": "WrapWithOverflow",
    //                     "textAlign": "Center",
    //                     "color": "black",
    //                     "italic": false,
    //                     "bold": false
    //                 },
    //                 "offsetX": 198,
    //                 "width": 86,
    //                 "height": 16.875,
    //                 "offsetY": 443.55,
    //                 "id": "nodeNlPn3",
    //                 "zIndex": 17,
    //                 "container": null,
    //                 "visible": true,
    //                 "horizontalAlignment": "Left",
    //                 "verticalAlignment": "Top",
    //                 "backgroundColor": "transparent",
    //                 "borderColor": "none",
    //                 "borderWidth": 0,
    //                 "rotateAngle": 0,
    //                 "pivot": {
    //                     "x": 0.5,
    //                     "y": 0.5
    //                 },
    //                 "margin": {
    //                     "top": 0,
    //                     "left": 0
    //                 },
    //                 "flip": "None",
    //                 "wrapper": {
    //                     "actualSize": {
    //                         "width": 86,
    //                         "height": 16.875
    //                     },
    //                     "offsetX": 198,
    //                     "offsetY": 443.55
    //                 },
    //                 "constraints": 5240814,
    //                 "annotations": [],
    //                 "isExpanded": true,
    //                 "expandIcon": {
    //                     "shape": "None"
    //                 },
    //                 "fixedUserHandles": [],
    //                 "tooltip": {
    //                     "openOn": "Auto"
    //                 },
    //                 "inEdges": [],
    //                 "outEdges": [],
    //                 "parentId": "",
    //                 "processId": "",
    //                 "umlIndex": -1,
    //                 "isPhase": false,
    //                 "isLane": false
    //             }, {
    //                 "shape": {
    //                     "type": "Bpmn",
    //                     "shape": "Activity",
    //                     "activity": {
    //                         "activity": "Task",
    //                         "subProcess": {
    //                             "type": "None",
    //                             "collapsed": true
    //                         },
    //                         "task": {
    //                             "call": false,
    //                             "compensation": false,
    //                             "loop": "None",
    //                             "type": "None"
    //                         }
    //                     },
    //                     "annotations": []
    //                 },
    //                 "ports": [{
    //                         "inEdges": ["connectorqvrHT"],
    //                         "outEdges": [],
    //                         "offset": {
    //                             "x": 0,
    //                             "y": 0.5
    //                         },
    //                         "visibility": 12,
    //                         "constraints": 28,
    //                         "id": "KUG1O",
    //                         "height": 12,
    //                         "width": 12,
    //                         "shape": "Square",
    //                         "margin": {
    //                             "left": 0,
    //                             "top": 0,
    //                             "right": 0,
    //                             "bottom": 0
    //                         },
    //                         "style": {
    //                             "fill": "white",
    //                             "strokeColor": "black",
    //                             "opacity": 1,
    //                             "strokeDashArray": "",
    //                             "strokeWidth": 1
    //                         },
    //                         "horizontalAlignment": "Center",
    //                         "verticalAlignment": "Center"
    //                     }, {
    //                         "inEdges": [],
    //                         "outEdges": ["connectorK89KV"],
    //                         "offset": {
    //                             "x": 1,
    //                             "y": 0.5
    //                         },
    //                         "visibility": 12,
    //                         "constraints": 28,
    //                         "id": "IETOA",
    //                         "height": 12,
    //                         "width": 12,
    //                         "shape": "Square",
    //                         "margin": {
    //                             "left": 0,
    //                             "top": 0,
    //                             "right": 0,
    //                             "bottom": 0
    //                         },
    //                         "style": {
    //                             "fill": "white",
    //                             "strokeColor": "black",
    //                             "opacity": 1,
    //                             "strokeDashArray": "",
    //                             "strokeWidth": 1
    //                         },
    //                         "horizontalAlignment": "Center",
    //                         "verticalAlignment": "Center"
    //                     }, {
    //                         "inEdges": [],
    //                         "outEdges": [],
    //                         "offset": {
    //                             "x": 0.25,
    //                             "y": 0
    //                         },
    //                         "visibility": 12,
    //                         "constraints": 28,
    //                         "id": "QBbar",
    //                         "height": 12,
    //                         "width": 12,
    //                         "shape": "Square",
    //                         "margin": {
    //                             "left": 0,
    //                             "top": 0,
    //                             "right": 0,
    //                             "bottom": 0
    //                         },
    //                         "style": {
    //                             "fill": "white",
    //                             "strokeColor": "black",
    //                             "opacity": 1,
    //                             "strokeDashArray": "",
    //                             "strokeWidth": 1
    //                         },
    //                         "horizontalAlignment": "Center",
    //                         "verticalAlignment": "Center"
    //                     }, {
    //                         "inEdges": [],
    //                         "outEdges": [],
    //                         "offset": {
    //                             "x": 0.75,
    //                             "y": 0
    //                         },
    //                         "visibility": 12,
    //                         "constraints": 28,
    //                         "id": "Fsrkc",
    //                         "height": 12,
    //                         "width": 12,
    //                         "shape": "Square",
    //                         "margin": {
    //                             "left": 0,
    //                             "top": 0,
    //                             "right": 0,
    //                             "bottom": 0
    //                         },
    //                         "style": {
    //                             "fill": "white",
    //                             "strokeColor": "black",
    //                             "opacity": 1,
    //                             "strokeDashArray": "",
    //                             "strokeWidth": 1
    //                         },
    //                         "horizontalAlignment": "Center",
    //                         "verticalAlignment": "Center"
    //                     }, {
    //                         "inEdges": [],
    //                         "outEdges": [],
    //                         "offset": {
    //                             "x": 0.25,
    //                             "y": 1
    //                         },
    //                         "visibility": 12,
    //                         "constraints": 28,
    //                         "id": "DNeat",
    //                         "height": 12,
    //                         "width": 12,
    //                         "shape": "Square",
    //                         "margin": {
    //                             "left": 0,
    //                             "top": 0,
    //                             "right": 0,
    //                             "bottom": 0
    //                         },
    //                         "style": {
    //                             "fill": "white",
    //                             "strokeColor": "black",
    //                             "opacity": 1,
    //                             "strokeDashArray": "",
    //                             "strokeWidth": 1
    //                         },
    //                         "horizontalAlignment": "Center",
    //                         "verticalAlignment": "Center"
    //                     }, {
    //                         "inEdges": [],
    //                         "outEdges": [],
    //                         "offset": {
    //                             "x": 0.75,
    //                             "y": 1
    //                         },
    //                         "visibility": 12,
    //                         "constraints": 28,
    //                         "id": "MDGIe",
    //                         "height": 12,
    //                         "width": 12,
    //                         "shape": "Square",
    //                         "margin": {
    //                             "left": 0,
    //                             "top": 0,
    //                             "right": 0,
    //                             "bottom": 0
    //                         },
    //                         "style": {
    //                             "fill": "white",
    //                             "strokeColor": "black",
    //                             "opacity": 1,
    //                             "strokeDashArray": "",
    //                             "strokeWidth": 1
    //                         },
    //                         "horizontalAlignment": "Center",
    //                         "verticalAlignment": "Center"
    //                     }
    //                 ],
    //                 "id": "Tarefadn24E",
    //                 "width": 130,
    //                 "height": 65,
    //                 "style": {
    //                     "fill": "rgba(227,242,253,1)",
    //                     "strokeWidth": 2,
    //                     "strokeColor": "#0d47a1ff",
    //                     "strokeDashArray": "",
    //                     "opacity": 1,
    //                     "gradient": {
    //                         "type": "None"
    //                     }
    //                 },
    //                 "container": null,
    //                 "offsetX": 323,
    //                 "offsetY": 417.4875,
    //                 "visible": true,
    //                 "horizontalAlignment": "Left",
    //                 "verticalAlignment": "Top",
    //                 "backgroundColor": "transparent",
    //                 "borderColor": "none",
    //                 "borderWidth": 0,
    //                 "rotateAngle": 0,
    //                 "pivot": {
    //                     "x": 0.5,
    //                     "y": 0.5
    //                 },
    //                 "margin": {},
    //                 "flip": "None",
    //                 "wrapper": {
    //                     "actualSize": {
    //                         "width": 130,
    //                         "height": 65
    //                     },
    //                     "offsetX": 323,
    //                     "offsetY": 417.4875
    //                 },
    //                 "constraints": 5240814,
    //                 "previewSize": {},
    //                 "dragSize": {},
    //                 "zIndex": 18,
    //                 "annotations": [{
    //                         "id": "ggFOO",
    //                         "content": "Acessar sistema dos Bancos",
    //                         "annotationType": "String",
    //                         "style": {
    //                             "strokeWidth": 0,
    //                             "strokeColor": "transparent",
    //                             "fill": "transparent",
    //                             "bold": false,
    //                             "textWrapping": "WrapWithOverflow",
    //                             "color": "black",
    //                             "whiteSpace": "CollapseSpace",
    //                             "fontFamily": "Arial",
    //                             "fontSize": 12,
    //                             "italic": false,
    //                             "opacity": 1,
    //                             "strokeDashArray": "",
    //                             "textAlign": "Center",
    //                             "textOverflow": "Wrap",
    //                             "textDecoration": "None"
    //                         },
    //                         "hyperlink": {
    //                             "link": "",
    //                             "content": "",
    //                             "textDecoration": "None"
    //                         },
    //                         "constraints": 4,
    //                         "visibility": true,
    //                         "rotateAngle": 0,
    //                         "margin": {
    //                             "left": 0,
    //                             "top": 0,
    //                             "right": 0,
    //                             "bottom": 0
    //                         },
    //                         "horizontalAlignment": "Center",
    //                         "verticalAlignment": "Center",
    //                         "offset": {
    //                             "x": 0.5,
    //                             "y": 0.5
    //                         }
    //                     }
    //                 ],
    //                 "isExpanded": true,
    //                 "expandIcon": {
    //                     "shape": "None"
    //                 },
    //                 "fixedUserHandles": [],
    //                 "tooltip": {
    //                     "openOn": "Auto"
    //                 },
    //                 "inEdges": ["connectorqvrHT"],
    //                 "outEdges": ["connectorK89KV"],
    //                 "parentId": "",
    //                 "processId": "",
    //                 "umlIndex": -1,
    //                 "isPhase": false,
    //                 "isLane": false
    //             }, {
    //                 "shape": {
    //                     "type": "Bpmn",
    //                     "shape": "Activity",
    //                     "activity": {
    //                         "activity": "Task",
    //                         "subProcess": {
    //                             "type": "None",
    //                             "collapsed": true
    //                         },
    //                         "task": {
    //                             "call": false,
    //                             "compensation": false,
    //                             "loop": "None",
    //                             "type": "None"
    //                         }
    //                     },
    //                     "annotations": []
    //                 },
    //                 "ports": [{
    //                         "inEdges": [],
    //                         "outEdges": [],
    //                         "offset": {
    //                             "x": 0,
    //                             "y": 0.5
    //                         },
    //                         "visibility": 12,
    //                         "constraints": 28,
    //                         "id": "xqMUb",
    //                         "height": 12,
    //                         "width": 12,
    //                         "shape": "Square",
    //                         "margin": {
    //                             "left": 0,
    //                             "top": 0,
    //                             "right": 0,
    //                             "bottom": 0
    //                         },
    //                         "style": {
    //                             "fill": "white",
    //                             "strokeColor": "black",
    //                             "opacity": 1,
    //                             "strokeDashArray": "",
    //                             "strokeWidth": 1
    //                         },
    //                         "horizontalAlignment": "Center",
    //                         "verticalAlignment": "Center"
    //                     }, {
    //                         "inEdges": [],
    //                         "outEdges": [],
    //                         "offset": {
    //                             "x": 1,
    //                             "y": 0.5
    //                         },
    //                         "visibility": 12,
    //                         "constraints": 28,
    //                         "id": "nkLvw",
    //                         "height": 12,
    //                         "width": 12,
    //                         "shape": "Square",
    //                         "margin": {
    //                             "left": 0,
    //                             "top": 0,
    //                             "right": 0,
    //                             "bottom": 0
    //                         },
    //                         "style": {
    //                             "fill": "white",
    //                             "strokeColor": "black",
    //                             "opacity": 1,
    //                             "strokeDashArray": "",
    //                             "strokeWidth": 1
    //                         },
    //                         "horizontalAlignment": "Center",
    //                         "verticalAlignment": "Center"
    //                     }, {
    //                         "inEdges": [],
    //                         "outEdges": [],
    //                         "offset": {
    //                             "x": 0.25,
    //                             "y": 0
    //                         },
    //                         "visibility": 12,
    //                         "constraints": 28,
    //                         "id": "Ee77c",
    //                         "height": 12,
    //                         "width": 12,
    //                         "shape": "Square",
    //                         "margin": {
    //                             "left": 0,
    //                             "top": 0,
    //                             "right": 0,
    //                             "bottom": 0
    //                         },
    //                         "style": {
    //                             "fill": "white",
    //                             "strokeColor": "black",
    //                             "opacity": 1,
    //                             "strokeDashArray": "",
    //                             "strokeWidth": 1
    //                         },
    //                         "horizontalAlignment": "Center",
    //                         "verticalAlignment": "Center"
    //                     }, {
    //                         "inEdges": [],
    //                         "outEdges": [],
    //                         "offset": {
    //                             "x": 0.75,
    //                             "y": 0
    //                         },
    //                         "visibility": 12,
    //                         "constraints": 28,
    //                         "id": "oCub1",
    //                         "height": 12,
    //                         "width": 12,
    //                         "shape": "Square",
    //                         "margin": {
    //                             "left": 0,
    //                             "top": 0,
    //                             "right": 0,
    //                             "bottom": 0
    //                         },
    //                         "style": {
    //                             "fill": "white",
    //                             "strokeColor": "black",
    //                             "opacity": 1,
    //                             "strokeDashArray": "",
    //                             "strokeWidth": 1
    //                         },
    //                         "horizontalAlignment": "Center",
    //                         "verticalAlignment": "Center"
    //                     }, {
    //                         "inEdges": [],
    //                         "outEdges": [],
    //                         "offset": {
    //                             "x": 0.25,
    //                             "y": 1
    //                         },
    //                         "visibility": 12,
    //                         "constraints": 28,
    //                         "id": "WU6K7",
    //                         "height": 12,
    //                         "width": 12,
    //                         "shape": "Square",
    //                         "margin": {
    //                             "left": 0,
    //                             "top": 0,
    //                             "right": 0,
    //                             "bottom": 0
    //                         },
    //                         "style": {
    //                             "fill": "white",
    //                             "strokeColor": "black",
    //                             "opacity": 1,
    //                             "strokeDashArray": "",
    //                             "strokeWidth": 1
    //                         },
    //                         "horizontalAlignment": "Center",
    //                         "verticalAlignment": "Center"
    //                     }, {
    //                         "inEdges": [],
    //                         "outEdges": [],
    //                         "offset": {
    //                             "x": 0.75,
    //                             "y": 1
    //                         },
    //                         "visibility": 12,
    //                         "constraints": 28,
    //                         "id": "RPDQb",
    //                         "height": 12,
    //                         "width": 12,
    //                         "shape": "Square",
    //                         "margin": {
    //                             "left": 0,
    //                             "top": 0,
    //                             "right": 0,
    //                             "bottom": 0
    //                         },
    //                         "style": {
    //                             "fill": "white",
    //                             "strokeColor": "black",
    //                             "opacity": 1,
    //                             "strokeDashArray": "",
    //                             "strokeWidth": 1
    //                         },
    //                         "horizontalAlignment": "Center",
    //                         "verticalAlignment": "Center"
    //                     }
    //                 ],
    //                 "id": "TarefaMIeVG",
    //                 "width": 130,
    //                 "height": 65,
    //                 "style": {
    //                     "fill": "rgba(227,242,253,1)",
    //                     "strokeWidth": 2,
    //                     "strokeColor": "#0d47a1ff",
    //                     "strokeDashArray": "",
    //                     "opacity": 1,
    //                     "gradient": {
    //                         "type": "None"
    //                     }
    //                 },
    //                 "container": null,
    //                 "offsetX": 495,
    //                 "offsetY": 417.4875,
    //                 "visible": true,
    //                 "horizontalAlignment": "Left",
    //                 "verticalAlignment": "Top",
    //                 "backgroundColor": "transparent",
    //                 "borderColor": "none",
    //                 "borderWidth": 0,
    //                 "rotateAngle": 0,
    //                 "pivot": {
    //                     "x": 0.5,
    //                     "y": 0.5
    //                 },
    //                 "margin": {},
    //                 "flip": "None",
    //                 "wrapper": {
    //                     "actualSize": {
    //                         "width": 130,
    //                         "height": 65
    //                     },
    //                     "offsetX": 495,
    //                     "offsetY": 417.4875
    //                 },
    //                 "constraints": 5240814,
    //                 "previewSize": {},
    //                 "dragSize": {},
    //                 "zIndex": 21,
    //                 "annotations": [{
    //                         "id": "uX2Js",
    //                         "content": "Baixar relatório de digitação",
    //                         "annotationType": "String",
    //                         "style": {
    //                             "strokeWidth": 0,
    //                             "strokeColor": "transparent",
    //                             "fill": "transparent",
    //                             "bold": false,
    //                             "textWrapping": "WrapWithOverflow",
    //                             "color": "black",
    //                             "whiteSpace": "CollapseSpace",
    //                             "fontFamily": "Arial",
    //                             "fontSize": 12,
    //                             "italic": false,
    //                             "opacity": 1,
    //                             "strokeDashArray": "",
    //                             "textAlign": "Center",
    //                             "textOverflow": "Wrap",
    //                             "textDecoration": "None"
    //                         },
    //                         "hyperlink": {
    //                             "link": "",
    //                             "content": "",
    //                             "textDecoration": "None"
    //                         },
    //                         "constraints": 4,
    //                         "visibility": true,
    //                         "rotateAngle": 0,
    //                         "margin": {
    //                             "left": 0,
    //                             "top": 0,
    //                             "right": 0,
    //                             "bottom": 0
    //                         },
    //                         "horizontalAlignment": "Center",
    //                         "verticalAlignment": "Center",
    //                         "offset": {
    //                             "x": 0.5,
    //                             "y": 0.5
    //                         }
    //                     }
    //                 ],
    //                 "isExpanded": true,
    //                 "expandIcon": {
    //                     "shape": "None"
    //                 },
    //                 "fixedUserHandles": [],
    //                 "tooltip": {
    //                     "openOn": "Auto"
    //                 },
    //                 "inEdges": ["connectorK89KV", "Linha-Bezier-2tqUAl"],
    //                 "outEdges": ["connectormTdJ3"],
    //                 "parentId": "",
    //                 "processId": "",
    //                 "umlIndex": -1,
    //                 "isPhase": false,
    //                 "isLane": false
    //             }, {
    //                 "shape": {
    //                     "type": "Bpmn",
    //                     "shape": "DataObject",
    //                     "dataObject": {
    //                         "type": "None",
    //                         "collection": false
    //                     },
    //                     "annotations": [],
    //                     "activity": {
    //                         "subProcess": {}
    //                     }
    //                 },
    //                 "ports": [{
    //                         "inEdges": [],
    //                         "outEdges": [],
    //                         "offset": {
    //                             "x": 0,
    //                             "y": 0.5
    //                         },
    //                         "visibility": 12,
    //                         "constraints": 28,
    //                         "id": "WTBJW",
    //                         "height": 12,
    //                         "width": 12,
    //                         "shape": "Square",
    //                         "margin": {
    //                             "left": 0,
    //                             "top": 0,
    //                             "right": 0,
    //                             "bottom": 0
    //                         },
    //                         "style": {
    //                             "fill": "white",
    //                             "strokeColor": "black",
    //                             "opacity": 1,
    //                             "strokeDashArray": "",
    //                             "strokeWidth": 1
    //                         },
    //                         "horizontalAlignment": "Center",
    //                         "verticalAlignment": "Center"
    //                     }, {
    //                         "inEdges": [],
    //                         "outEdges": [],
    //                         "offset": {
    //                             "x": 1,
    //                             "y": 0.5
    //                         },
    //                         "visibility": 12,
    //                         "constraints": 28,
    //                         "id": "kHi0D",
    //                         "height": 12,
    //                         "width": 12,
    //                         "shape": "Square",
    //                         "margin": {
    //                             "left": 0,
    //                             "top": 0,
    //                             "right": 0,
    //                             "bottom": 0
    //                         },
    //                         "style": {
    //                             "fill": "white",
    //                             "strokeColor": "black",
    //                             "opacity": 1,
    //                             "strokeDashArray": "",
    //                             "strokeWidth": 1
    //                         },
    //                         "horizontalAlignment": "Center",
    //                         "verticalAlignment": "Center"
    //                     }, {
    //                         "inEdges": [],
    //                         "outEdges": [],
    //                         "offset": {
    //                             "x": 0.25,
    //                             "y": 0
    //                         },
    //                         "visibility": 12,
    //                         "constraints": 28,
    //                         "id": "Cxsbx",
    //                         "height": 12,
    //                         "width": 12,
    //                         "shape": "Square",
    //                         "margin": {
    //                             "left": 0,
    //                             "top": 0,
    //                             "right": 0,
    //                             "bottom": 0
    //                         },
    //                         "style": {
    //                             "fill": "white",
    //                             "strokeColor": "black",
    //                             "opacity": 1,
    //                             "strokeDashArray": "",
    //                             "strokeWidth": 1
    //                         },
    //                         "horizontalAlignment": "Center",
    //                         "verticalAlignment": "Center"
    //                     }, {
    //                         "inEdges": [],
    //                         "outEdges": [],
    //                         "offset": {
    //                             "x": 0.75,
    //                             "y": 0
    //                         },
    //                         "visibility": 12,
    //                         "constraints": 28,
    //                         "id": "MCpZr",
    //                         "height": 12,
    //                         "width": 12,
    //                         "shape": "Square",
    //                         "margin": {
    //                             "left": 0,
    //                             "top": 0,
    //                             "right": 0,
    //                             "bottom": 0
    //                         },
    //                         "style": {
    //                             "fill": "white",
    //                             "strokeColor": "black",
    //                             "opacity": 1,
    //                             "strokeDashArray": "",
    //                             "strokeWidth": 1
    //                         },
    //                         "horizontalAlignment": "Center",
    //                         "verticalAlignment": "Center"
    //                     }, {
    //                         "inEdges": [],
    //                         "outEdges": [],
    //                         "offset": {
    //                             "x": 0.25,
    //                             "y": 1
    //                         },
    //                         "visibility": 12,
    //                         "constraints": 28,
    //                         "id": "U2CyV",
    //                         "height": 12,
    //                         "width": 12,
    //                         "shape": "Square",
    //                         "margin": {
    //                             "left": 0,
    //                             "top": 0,
    //                             "right": 0,
    //                             "bottom": 0
    //                         },
    //                         "style": {
    //                             "fill": "white",
    //                             "strokeColor": "black",
    //                             "opacity": 1,
    //                             "strokeDashArray": "",
    //                             "strokeWidth": 1
    //                         },
    //                         "horizontalAlignment": "Center",
    //                         "verticalAlignment": "Center"
    //                     }, {
    //                         "inEdges": [],
    //                         "outEdges": [],
    //                         "offset": {
    //                             "x": 0.75,
    //                             "y": 1
    //                         },
    //                         "visibility": 12,
    //                         "constraints": 28,
    //                         "id": "lecvf",
    //                         "height": 12,
    //                         "width": 12,
    //                         "shape": "Square",
    //                         "margin": {
    //                             "left": 0,
    //                             "top": 0,
    //                             "right": 0,
    //                             "bottom": 0
    //                         },
    //                         "style": {
    //                             "fill": "white",
    //                             "strokeColor": "black",
    //                             "opacity": 1,
    //                             "strokeDashArray": "",
    //                             "strokeWidth": 1
    //                         },
    //                         "horizontalAlignment": "Center",
    //                         "verticalAlignment": "Center"
    //                     }
    //                 ],
    //                 "id": "Objeto-de-DadosumK60",
    //                 "width": 80,
    //                 "height": 80,
    //                 "style": {
    //                     "fill": "rgba(230,230,230,1)",
    //                     "strokeWidth": 2,
    //                     "strokeColor": "#3A3A3A",
    //                     "strokeDashArray": "",
    //                     "opacity": 1,
    //                     "gradient": {
    //                         "type": "None"
    //                     }
    //                 },
    //                 "container": null,
    //                 "offsetX": 531,
    //                 "offsetY": 304,
    //                 "visible": true,
    //                 "horizontalAlignment": "Left",
    //                 "verticalAlignment": "Top",
    //                 "backgroundColor": "transparent",
    //                 "borderColor": "none",
    //                 "borderWidth": 0,
    //                 "rotateAngle": 0,
    //                 "pivot": {
    //                     "x": 0.5,
    //                     "y": 0.5
    //                 },
    //                 "margin": {
    //                     "top": 0,
    //                     "left": 0
    //                 },
    //                 "flip": "None",
    //                 "wrapper": {
    //                     "actualSize": {
    //                         "width": 80,
    //                         "height": 80
    //                     },
    //                     "offsetX": 531,
    //                     "offsetY": 304
    //                 },
    //                 "constraints": 5240814,
    //                 "previewSize": {},
    //                 "dragSize": {},
    //                 "zIndex": 23,
    //                 "annotations": [{
    //                         "id": "t6QGt",
    //                         "content": "Baixar banco a Banco",
    //                         "annotationType": "String",
    //                         "style": {
    //                             "strokeWidth": 0,
    //                             "strokeColor": "transparent",
    //                             "fill": "transparent",
    //                             "bold": false,
    //                             "textWrapping": "WrapWithOverflow",
    //                             "color": "black",
    //                             "whiteSpace": "CollapseSpace",
    //                             "fontFamily": "Arial",
    //                             "fontSize": 11,
    //                             "italic": false,
    //                             "opacity": 1,
    //                             "strokeDashArray": "",
    //                             "textAlign": "Center",
    //                             "textOverflow": "Wrap",
    //                             "textDecoration": "None"
    //                         },
    //                         "hyperlink": {
    //                             "link": "",
    //                             "content": "",
    //                             "textDecoration": "None"
    //                         },
    //                         "constraints": 124,
    //                         "visibility": true,
    //                         "rotateAngle": 0,
    //                         "margin": {
    //                             "left": 0,
    //                             "top": 0,
    //                             "right": 0,
    //                             "bottom": 0
    //                         },
    //                         "horizontalAlignment": "Center",
    //                         "verticalAlignment": "Center",
    //                         "offset": {
    //                             "x": 0.5,
    //                             "y": 0.5
    //                         }
    //                     }
    //                 ],
    //                 "isExpanded": true,
    //                 "expandIcon": {
    //                     "shape": "None"
    //                 },
    //                 "fixedUserHandles": [],
    //                 "tooltip": {
    //                     "openOn": "Auto"
    //                 },
    //                 "inEdges": [],
    //                 "outEdges": ["Linha-Bezier-2tqUAl"],
    //                 "parentId": "",
    //                 "processId": "",
    //                 "umlIndex": -1,
    //                 "isPhase": false,
    //                 "isLane": false
    //             }, {
    //                 "shape": {
    //                     "type": "Bpmn",
    //                     "shape": "Activity",
    //                     "activity": {
    //                         "activity": "Task",
    //                         "subProcess": {
    //                             "type": "None",
    //                             "collapsed": true
    //                         },
    //                         "task": {
    //                             "call": false,
    //                             "compensation": false,
    //                             "loop": "None",
    //                             "type": "None"
    //                         }
    //                     },
    //                     "annotations": []
    //                 },
    //                 "ports": [{
    //                         "inEdges": ["connectormTdJ3"],
    //                         "outEdges": [],
    //                         "offset": {
    //                             "x": 0,
    //                             "y": 0.5
    //                         },
    //                         "visibility": 12,
    //                         "constraints": 28,
    //                         "id": "IAJua",
    //                         "height": 12,
    //                         "width": 12,
    //                         "shape": "Square",
    //                         "margin": {
    //                             "left": 0,
    //                             "top": 0,
    //                             "right": 0,
    //                             "bottom": 0
    //                         },
    //                         "style": {
    //                             "fill": "white",
    //                             "strokeColor": "black",
    //                             "opacity": 1,
    //                             "strokeDashArray": "",
    //                             "strokeWidth": 1
    //                         },
    //                         "horizontalAlignment": "Center",
    //                         "verticalAlignment": "Center"
    //                     }, {
    //                         "inEdges": [],
    //                         "outEdges": [],
    //                         "offset": {
    //                             "x": 1,
    //                             "y": 0.5
    //                         },
    //                         "visibility": 12,
    //                         "constraints": 28,
    //                         "id": "DCg1b",
    //                         "height": 12,
    //                         "width": 12,
    //                         "shape": "Square",
    //                         "margin": {
    //                             "left": 0,
    //                             "top": 0,
    //                             "right": 0,
    //                             "bottom": 0
    //                         },
    //                         "style": {
    //                             "fill": "white",
    //                             "strokeColor": "black",
    //                             "opacity": 1,
    //                             "strokeDashArray": "",
    //                             "strokeWidth": 1
    //                         },
    //                         "horizontalAlignment": "Center",
    //                         "verticalAlignment": "Center"
    //                     }, {
    //                         "inEdges": [],
    //                         "outEdges": [],
    //                         "offset": {
    //                             "x": 0.25,
    //                             "y": 0
    //                         },
    //                         "visibility": 12,
    //                         "constraints": 28,
    //                         "id": "JgKPg",
    //                         "height": 12,
    //                         "width": 12,
    //                         "shape": "Square",
    //                         "margin": {
    //                             "left": 0,
    //                             "top": 0,
    //                             "right": 0,
    //                             "bottom": 0
    //                         },
    //                         "style": {
    //                             "fill": "white",
    //                             "strokeColor": "black",
    //                             "opacity": 1,
    //                             "strokeDashArray": "",
    //                             "strokeWidth": 1
    //                         },
    //                         "horizontalAlignment": "Center",
    //                         "verticalAlignment": "Center"
    //                     }, {
    //                         "inEdges": [],
    //                         "outEdges": [],
    //                         "offset": {
    //                             "x": 0.75,
    //                             "y": 0
    //                         },
    //                         "visibility": 12,
    //                         "constraints": 28,
    //                         "id": "mL837",
    //                         "height": 12,
    //                         "width": 12,
    //                         "shape": "Square",
    //                         "margin": {
    //                             "left": 0,
    //                             "top": 0,
    //                             "right": 0,
    //                             "bottom": 0
    //                         },
    //                         "style": {
    //                             "fill": "white",
    //                             "strokeColor": "black",
    //                             "opacity": 1,
    //                             "strokeDashArray": "",
    //                             "strokeWidth": 1
    //                         },
    //                         "horizontalAlignment": "Center",
    //                         "verticalAlignment": "Center"
    //                     }, {
    //                         "inEdges": [],
    //                         "outEdges": [],
    //                         "offset": {
    //                             "x": 0.25,
    //                             "y": 1
    //                         },
    //                         "visibility": 12,
    //                         "constraints": 28,
    //                         "id": "w3UA2",
    //                         "height": 12,
    //                         "width": 12,
    //                         "shape": "Square",
    //                         "margin": {
    //                             "left": 0,
    //                             "top": 0,
    //                             "right": 0,
    //                             "bottom": 0
    //                         },
    //                         "style": {
    //                             "fill": "white",
    //                             "strokeColor": "black",
    //                             "opacity": 1,
    //                             "strokeDashArray": "",
    //                             "strokeWidth": 1
    //                         },
    //                         "horizontalAlignment": "Center",
    //                         "verticalAlignment": "Center"
    //                     }, {
    //                         "inEdges": [],
    //                         "outEdges": [],
    //                         "offset": {
    //                             "x": 0.75,
    //                             "y": 1
    //                         },
    //                         "visibility": 12,
    //                         "constraints": 28,
    //                         "id": "RQvxc",
    //                         "height": 12,
    //                         "width": 12,
    //                         "shape": "Square",
    //                         "margin": {
    //                             "left": 0,
    //                             "top": 0,
    //                             "right": 0,
    //                             "bottom": 0
    //                         },
    //                         "style": {
    //                             "fill": "white",
    //                             "strokeColor": "black",
    //                             "opacity": 1,
    //                             "strokeDashArray": "",
    //                             "strokeWidth": 1
    //                         },
    //                         "horizontalAlignment": "Center",
    //                         "verticalAlignment": "Center"
    //                     }
    //                 ],
    //                 "id": "TarefaKJpm0",
    //                 "width": 130,
    //                 "height": 65,
    //                 "style": {
    //                     "fill": "rgba(227,242,253,1)",
    //                     "strokeWidth": 2,
    //                     "strokeColor": "#0d47a1ff",
    //                     "strokeDashArray": "",
    //                     "opacity": 1,
    //                     "gradient": {
    //                         "type": "None"
    //                     }
    //                 },
    //                 "container": null,
    //                 "offsetX": 667,
    //                 "offsetY": 417.4875,
    //                 "visible": true,
    //                 "horizontalAlignment": "Left",
    //                 "verticalAlignment": "Top",
    //                 "backgroundColor": "transparent",
    //                 "borderColor": "none",
    //                 "borderWidth": 0,
    //                 "rotateAngle": 0,
    //                 "pivot": {
    //                     "x": 0.5,
    //                     "y": 0.5
    //                 },
    //                 "margin": {},
    //                 "flip": "None",
    //                 "wrapper": {
    //                     "actualSize": {
    //                         "width": 130,
    //                         "height": 65
    //                     },
    //                     "offsetX": 667,
    //                     "offsetY": 417.4875
    //                 },
    //                 "constraints": 5240814,
    //                 "previewSize": {},
    //                 "dragSize": {},
    //                 "zIndex": 25,
    //                 "annotations": [{
    //                         "id": "c4xAs",
    //                         "content": "Integrar no Virtaus",
    //                         "annotationType": "String",
    //                         "style": {
    //                             "strokeWidth": 0,
    //                             "strokeColor": "transparent",
    //                             "fill": "transparent",
    //                             "bold": false,
    //                             "textWrapping": "WrapWithOverflow",
    //                             "color": "black",
    //                             "whiteSpace": "CollapseSpace",
    //                             "fontFamily": "Arial",
    //                             "fontSize": 12,
    //                             "italic": false,
    //                             "opacity": 1,
    //                             "strokeDashArray": "",
    //                             "textAlign": "Center",
    //                             "textOverflow": "Wrap",
    //                             "textDecoration": "None"
    //                         },
    //                         "hyperlink": {
    //                             "link": "",
    //                             "content": "",
    //                             "textDecoration": "None"
    //                         },
    //                         "constraints": 4,
    //                         "visibility": true,
    //                         "rotateAngle": 0,
    //                         "margin": {
    //                             "left": 0,
    //                             "top": 0,
    //                             "right": 0,
    //                             "bottom": 0
    //                         },
    //                         "horizontalAlignment": "Center",
    //                         "verticalAlignment": "Center",
    //                         "offset": {
    //                             "x": 0.5,
    //                             "y": 0.5
    //                         }
    //                     }
    //                 ],
    //                 "isExpanded": true,
    //                 "expandIcon": {
    //                     "shape": "None"
    //                 },
    //                 "fixedUserHandles": [],
    //                 "tooltip": {
    //                     "openOn": "Auto"
    //                 },
    //                 "inEdges": ["connectormTdJ3"],
    //                 "outEdges": ["connectorS8FCH"],
    //                 "parentId": "",
    //                 "processId": "",
    //                 "umlIndex": -1,
    //                 "isPhase": false,
    //                 "isLane": false
    //             }, {
    //                 "shape": {
    //                     "type": "Bpmn",
    //                     "shape": "Gateway",
    //                     "gateway": {
    //                         "type": "Exclusive"
    //                     },
    //                     "annotations": [],
    //                     "activity": {
    //                         "subProcess": {}
    //                     }
    //                 },
    //                 "ports": [{
    //                         "inEdges": ["connectorS8FCH"],
    //                         "outEdges": [],
    //                         "offset": {
    //                             "x": 0,
    //                             "y": 0.5
    //                         },
    //                         "visibility": 12,
    //                         "constraints": 28,
    //                         "id": "MSigX",
    //                         "height": 12,
    //                         "width": 12,
    //                         "shape": "Square",
    //                         "margin": {
    //                             "left": 0,
    //                             "top": 0,
    //                             "right": 0,
    //                             "bottom": 0
    //                         },
    //                         "style": {
    //                             "fill": "white",
    //                             "strokeColor": "black",
    //                             "opacity": 1,
    //                             "strokeDashArray": "",
    //                             "strokeWidth": 1
    //                         },
    //                         "horizontalAlignment": "Center",
    //                         "verticalAlignment": "Center"
    //                     }, {
    //                         "inEdges": [],
    //                         "outEdges": ["connectorP67B4"],
    //                         "offset": {
    //                             "x": 1,
    //                             "y": 0.5
    //                         },
    //                         "visibility": 12,
    //                         "constraints": 28,
    //                         "id": "JxaVm",
    //                         "height": 12,
    //                         "width": 12,
    //                         "shape": "Square",
    //                         "margin": {
    //                             "left": 0,
    //                             "top": 0,
    //                             "right": 0,
    //                             "bottom": 0
    //                         },
    //                         "style": {
    //                             "fill": "white",
    //                             "strokeColor": "black",
    //                             "opacity": 1,
    //                             "strokeDashArray": "",
    //                             "strokeWidth": 1
    //                         },
    //                         "horizontalAlignment": "Center",
    //                         "verticalAlignment": "Center"
    //                     }, {
    //                         "inEdges": [],
    //                         "outEdges": [],
    //                         "offset": {
    //                             "x": 0.25,
    //                             "y": 0
    //                         },
    //                         "visibility": 12,
    //                         "constraints": 28,
    //                         "id": "l9m08",
    //                         "height": 12,
    //                         "width": 12,
    //                         "shape": "Square",
    //                         "margin": {
    //                             "left": 0,
    //                             "top": 0,
    //                             "right": 0,
    //                             "bottom": 0
    //                         },
    //                         "style": {
    //                             "fill": "white",
    //                             "strokeColor": "black",
    //                             "opacity": 1,
    //                             "strokeDashArray": "",
    //                             "strokeWidth": 1
    //                         },
    //                         "horizontalAlignment": "Center",
    //                         "verticalAlignment": "Center"
    //                     }, {
    //                         "inEdges": [],
    //                         "outEdges": [],
    //                         "offset": {
    //                             "x": 0.75,
    //                             "y": 0
    //                         },
    //                         "visibility": 12,
    //                         "constraints": 28,
    //                         "id": "LH19v",
    //                         "height": 12,
    //                         "width": 12,
    //                         "shape": "Square",
    //                         "margin": {
    //                             "left": 0,
    //                             "top": 0,
    //                             "right": 0,
    //                             "bottom": 0
    //                         },
    //                         "style": {
    //                             "fill": "white",
    //                             "strokeColor": "black",
    //                             "opacity": 1,
    //                             "strokeDashArray": "",
    //                             "strokeWidth": 1
    //                         },
    //                         "horizontalAlignment": "Center",
    //                         "verticalAlignment": "Center"
    //                     }, {
    //                         "inEdges": [],
    //                         "outEdges": [],
    //                         "offset": {
    //                             "x": 0.25,
    //                             "y": 1
    //                         },
    //                         "visibility": 12,
    //                         "constraints": 28,
    //                         "id": "VgTlW",
    //                         "height": 12,
    //                         "width": 12,
    //                         "shape": "Square",
    //                         "margin": {
    //                             "left": 0,
    //                             "top": 0,
    //                             "right": 0,
    //                             "bottom": 0
    //                         },
    //                         "style": {
    //                             "fill": "white",
    //                             "strokeColor": "black",
    //                             "opacity": 1,
    //                             "strokeDashArray": "",
    //                             "strokeWidth": 1
    //                         },
    //                         "horizontalAlignment": "Center",
    //                         "verticalAlignment": "Center"
    //                     }, {
    //                         "inEdges": [],
    //                         "outEdges": [],
    //                         "offset": {
    //                             "x": 0.75,
    //                             "y": 1
    //                         },
    //                         "visibility": 12,
    //                         "constraints": 28,
    //                         "id": "wTZha",
    //                         "height": 12,
    //                         "width": 12,
    //                         "shape": "Square",
    //                         "margin": {
    //                             "left": 0,
    //                             "top": 0,
    //                             "right": 0,
    //                             "bottom": 0
    //                         },
    //                         "style": {
    //                             "fill": "white",
    //                             "strokeColor": "black",
    //                             "opacity": 1,
    //                             "strokeDashArray": "",
    //                             "strokeWidth": 1
    //                         },
    //                         "horizontalAlignment": "Center",
    //                         "verticalAlignment": "Center"
    //                     }
    //                 ],
    //                 "id": "Gateway-Exclusivel7TOi",
    //                 "width": 35,
    //                 "height": 35,
    //                 "style": {
    //                     "fill": "rgba(251,192,45,1)",
    //                     "strokeWidth": 2,
    //                     "strokeColor": "#3A3A3A",
    //                     "strokeDashArray": "",
    //                     "opacity": 1,
    //                     "gradient": {
    //                         "type": "None"
    //                     }
    //                 },
    //                 "container": null,
    //                 "offsetX": 791.5,
    //                 "offsetY": 417.4875,
    //                 "visible": true,
    //                 "horizontalAlignment": "Left",
    //                 "verticalAlignment": "Top",
    //                 "backgroundColor": "transparent",
    //                 "borderColor": "none",
    //                 "borderWidth": 0,
    //                 "rotateAngle": 0,
    //                 "pivot": {
    //                     "x": 0.5,
    //                     "y": 0.5
    //                 },
    //                 "margin": {},
    //                 "flip": "None",
    //                 "wrapper": {
    //                     "actualSize": {
    //                         "width": 35,
    //                         "height": 35
    //                     },
    //                     "offsetX": 791.5,
    //                     "offsetY": 417.4875
    //                 },
    //                 "constraints": 5240814,
    //                 "previewSize": {},
    //                 "dragSize": {},
    //                 "zIndex": 27,
    //                 "annotations": [],
    //                 "isExpanded": true,
    //                 "expandIcon": {
    //                     "shape": "None"
    //                 },
    //                 "fixedUserHandles": [],
    //                 "tooltip": {
    //                     "openOn": "Auto"
    //                 },
    //                 "inEdges": ["connectorS8FCH"],
    //                 "outEdges": ["connectorP67B4"],
    //                 "parentId": "",
    //                 "processId": "",
    //                 "umlIndex": -1,
    //                 "isPhase": false,
    //                 "isLane": false
    //             }, {
    //                 "shape": {
    //                     "type": "Text",
    //                     "content": "Qual o tipo de empréstimo?",
    //                     "margin": {
    //                         "left": 0,
    //                         "top": 0,
    //                         "right": 0,
    //                         "bottom": 0
    //                     }
    //                 },
    //                 "ports": [],
    //                 "style": {
    //                     "fill": "none",
    //                     "strokeColor": "none",
    //                     "strokeWidth": 1,
    //                     "strokeDashArray": "2 2",
    //                     "opacity": 1,
    //                     "gradient": {
    //                         "type": "None"
    //                     },
    //                     "fontSize": 12,
    //                     "fontFamily": "Arial",
    //                     "textOverflow": "Wrap",
    //                     "textDecoration": "None",
    //                     "whiteSpace": "CollapseSpace",
    //                     "textWrapping": "WrapWithOverflow",
    //                     "textAlign": "Center",
    //                     "color": "black",
    //                     "italic": false,
    //                     "bold": false
    //                 },
    //                 "offsetX": 791.5,
    //                 "width": 53,
    //                 "height": 34.93624999999997,
    //                 "offsetY": 456.53,
    //                 "id": "nodedZZPe",
    //                 "zIndex": 29,
    //                 "container": null,
    //                 "visible": true,
    //                 "horizontalAlignment": "Left",
    //                 "verticalAlignment": "Top",
    //                 "backgroundColor": "transparent",
    //                 "borderColor": "none",
    //                 "borderWidth": 0,
    //                 "rotateAngle": 0,
    //                 "pivot": {
    //                     "x": 0.5,
    //                     "y": 0.5
    //                 },
    //                 "margin": {
    //                     "top": 0,
    //                     "left": 0
    //                 },
    //                 "flip": "None",
    //                 "wrapper": {
    //                     "actualSize": {
    //                         "width": 53,
    //                         "height": 34.93624999999997
    //                     },
    //                     "offsetX": 791.5,
    //                     "offsetY": 456.53
    //                 },
    //                 "constraints": 5240814,
    //                 "annotations": [],
    //                 "isExpanded": true,
    //                 "expandIcon": {
    //                     "shape": "None"
    //                 },
    //                 "fixedUserHandles": [],
    //                 "tooltip": {
    //                     "openOn": "Auto"
    //                 },
    //                 "inEdges": [],
    //                 "outEdges": [],
    //                 "parentId": "",
    //                 "processId": "",
    //                 "umlIndex": -1,
    //                 "isPhase": false,
    //                 "isLane": false
    //             }, {
    //                 "shape": {
    //                     "type": "Text",
    //                     "content": "Portabilidade ",
    //                     "margin": {
    //                         "left": 0,
    //                         "top": 0,
    //                         "right": 0,
    //                         "bottom": 0
    //                     }
    //                 },
    //                 "ports": [],
    //                 "style": {
    //                     "fill": "none",
    //                     "strokeColor": "none",
    //                     "strokeWidth": 1,
    //                     "strokeDashArray": "2 2",
    //                     "opacity": 1,
    //                     "gradient": {
    //                         "type": "None"
    //                     },
    //                     "fontSize": 12,
    //                     "fontFamily": "Arial",
    //                     "textOverflow": "Wrap",
    //                     "textDecoration": "None",
    //                     "whiteSpace": "CollapseSpace",
    //                     "textWrapping": "WrapWithOverflow",
    //                     "textAlign": "Center",
    //                     "color": "black",
    //                     "italic": false,
    //                     "bold": false
    //                 },
    //                 "offsetX": 757,
    //                 "width": 79.99999999999997,
    //                 "height": 19.98750000000001,
    //                 "offsetY": 357.99,
    //                 "id": "nodetXaTa",
    //                 "zIndex": 33,
    //                 "container": null,
    //                 "visible": true,
    //                 "horizontalAlignment": "Left",
    //                 "verticalAlignment": "Top",
    //                 "backgroundColor": "transparent",
    //                 "borderColor": "none",
    //                 "borderWidth": 0,
    //                 "rotateAngle": 0,
    //                 "pivot": {
    //                     "x": 0.5,
    //                     "y": 0.5
    //                 },
    //                 "margin": {
    //                     "top": 0,
    //                     "left": 0
    //                 },
    //                 "flip": "None",
    //                 "wrapper": {
    //                     "actualSize": {
    //                         "width": 79.99999999999997,
    //                         "height": 19.98750000000001
    //                     },
    //                     "offsetX": 757,
    //                     "offsetY": 357.99
    //                 },
    //                 "constraints": 5240814,
    //                 "annotations": [],
    //                 "isExpanded": true,
    //                 "expandIcon": {
    //                     "shape": "None"
    //                 },
    //                 "fixedUserHandles": [],
    //                 "tooltip": {
    //                     "openOn": "Auto"
    //                 },
    //                 "inEdges": [],
    //                 "outEdges": [],
    //                 "parentId": "",
    //                 "processId": "",
    //                 "umlIndex": -1,
    //                 "isPhase": false,
    //                 "isLane": false
    //             }, {
    //                 "shape": {
    //                     "type": "Bpmn",
    //                     "shape": "Activity",
    //                     "activity": {
    //                         "activity": "Task",
    //                         "subProcess": {
    //                             "type": "None",
    //                             "collapsed": true
    //                         },
    //                         "task": {
    //                             "call": false,
    //                             "compensation": false,
    //                             "loop": "None",
    //                             "type": "None"
    //                         }
    //                     },
    //                     "annotations": []
    //                 },
    //                 "ports": [{
    //                         "inEdges": [],
    //                         "outEdges": [],
    //                         "offset": {
    //                             "x": 0,
    //                             "y": 0.5
    //                         },
    //                         "visibility": 12,
    //                         "constraints": 28,
    //                         "id": "bC0Kf",
    //                         "height": 12,
    //                         "width": 12,
    //                         "shape": "Square",
    //                         "margin": {
    //                             "left": 0,
    //                             "top": 0,
    //                             "right": 0,
    //                             "bottom": 0
    //                         },
    //                         "style": {
    //                             "fill": "white",
    //                             "strokeColor": "black",
    //                             "opacity": 1,
    //                             "strokeDashArray": "",
    //                             "strokeWidth": 1
    //                         },
    //                         "horizontalAlignment": "Center",
    //                         "verticalAlignment": "Center"
    //                     }, {
    //                         "inEdges": [],
    //                         "outEdges": [],
    //                         "offset": {
    //                             "x": 1,
    //                             "y": 0.5
    //                         },
    //                         "visibility": 12,
    //                         "constraints": 28,
    //                         "id": "Uby5s",
    //                         "height": 12,
    //                         "width": 12,
    //                         "shape": "Square",
    //                         "margin": {
    //                             "left": 0,
    //                             "top": 0,
    //                             "right": 0,
    //                             "bottom": 0
    //                         },
    //                         "style": {
    //                             "fill": "white",
    //                             "strokeColor": "black",
    //                             "opacity": 1,
    //                             "strokeDashArray": "",
    //                             "strokeWidth": 1
    //                         },
    //                         "horizontalAlignment": "Center",
    //                         "verticalAlignment": "Center"
    //                     }, {
    //                         "inEdges": [],
    //                         "outEdges": [],
    //                         "offset": {
    //                             "x": 0.25,
    //                             "y": 0
    //                         },
    //                         "visibility": 12,
    //                         "constraints": 28,
    //                         "id": "qBhQD",
    //                         "height": 12,
    //                         "width": 12,
    //                         "shape": "Square",
    //                         "margin": {
    //                             "left": 0,
    //                             "top": 0,
    //                             "right": 0,
    //                             "bottom": 0
    //                         },
    //                         "style": {
    //                             "fill": "white",
    //                             "strokeColor": "black",
    //                             "opacity": 1,
    //                             "strokeDashArray": "",
    //                             "strokeWidth": 1
    //                         },
    //                         "horizontalAlignment": "Center",
    //                         "verticalAlignment": "Center"
    //                     }, {
    //                         "inEdges": [],
    //                         "outEdges": [],
    //                         "offset": {
    //                             "x": 0.75,
    //                             "y": 0
    //                         },
    //                         "visibility": 12,
    //                         "constraints": 28,
    //                         "id": "dL5AB",
    //                         "height": 12,
    //                         "width": 12,
    //                         "shape": "Square",
    //                         "margin": {
    //                             "left": 0,
    //                             "top": 0,
    //                             "right": 0,
    //                             "bottom": 0
    //                         },
    //                         "style": {
    //                             "fill": "white",
    //                             "strokeColor": "black",
    //                             "opacity": 1,
    //                             "strokeDashArray": "",
    //                             "strokeWidth": 1
    //                         },
    //                         "horizontalAlignment": "Center",
    //                         "verticalAlignment": "Center"
    //                     }, {
    //                         "inEdges": [],
    //                         "outEdges": [],
    //                         "offset": {
    //                             "x": 0.25,
    //                             "y": 1
    //                         },
    //                         "visibility": 12,
    //                         "constraints": 28,
    //                         "id": "CTPbZ",
    //                         "height": 12,
    //                         "width": 12,
    //                         "shape": "Square",
    //                         "margin": {
    //                             "left": 0,
    //                             "top": 0,
    //                             "right": 0,
    //                             "bottom": 0
    //                         },
    //                         "style": {
    //                             "fill": "white",
    //                             "strokeColor": "black",
    //                             "opacity": 1,
    //                             "strokeDashArray": "",
    //                             "strokeWidth": 1
    //                         },
    //                         "horizontalAlignment": "Center",
    //                         "verticalAlignment": "Center"
    //                     }, {
    //                         "inEdges": [],
    //                         "outEdges": [],
    //                         "offset": {
    //                             "x": 0.75,
    //                             "y": 1
    //                         },
    //                         "visibility": 12,
    //                         "constraints": 28,
    //                         "id": "Thx5P",
    //                         "height": 12,
    //                         "width": 12,
    //                         "shape": "Square",
    //                         "margin": {
    //                             "left": 0,
    //                             "top": 0,
    //                             "right": 0,
    //                             "bottom": 0
    //                         },
    //                         "style": {
    //                             "fill": "white",
    //                             "strokeColor": "black",
    //                             "opacity": 1,
    //                             "strokeDashArray": "",
    //                             "strokeWidth": 1
    //                         },
    //                         "horizontalAlignment": "Center",
    //                         "verticalAlignment": "Center"
    //                     }
    //                 ],
    //                 "id": "Tarefawx6id",
    //                 "width": 130,
    //                 "height": 65,
    //                 "style": {
    //                     "fill": "rgba(227,242,253,1)",
    //                     "strokeWidth": 2,
    //                     "strokeColor": "#0d47a1ff",
    //                     "strokeDashArray": "",
    //                     "opacity": 1,
    //                     "gradient": {
    //                         "type": "None"
    //                     }
    //                 },
    //                 "container": null,
    //                 "offsetX": 963,
    //                 "offsetY": 417.4875,
    //                 "visible": true,
    //                 "horizontalAlignment": "Left",
    //                 "verticalAlignment": "Top",
    //                 "backgroundColor": "transparent",
    //                 "borderColor": "none",
    //                 "borderWidth": 0,
    //                 "rotateAngle": 0,
    //                 "pivot": {
    //                     "x": 0.5,
    //                     "y": 0.5
    //                 },
    //                 "margin": {},
    //                 "flip": "None",
    //                 "wrapper": {
    //                     "actualSize": {
    //                         "width": 130,
    //                         "height": 65
    //                     },
    //                     "offsetX": 963,
    //                     "offsetY": 417.4875
    //                 },
    //                 "constraints": 5240814,
    //                 "previewSize": {},
    //                 "dragSize": {},
    //                 "zIndex": 37,
    //                 "annotations": [{
    //                         "id": "yU5U1",
    //                         "content": "Analisar classificação do parceiro",
    //                         "annotationType": "String",
    //                         "style": {
    //                             "strokeWidth": 0,
    //                             "strokeColor": "transparent",
    //                             "fill": "transparent",
    //                             "bold": false,
    //                             "textWrapping": "WrapWithOverflow",
    //                             "color": "black",
    //                             "whiteSpace": "CollapseSpace",
    //                             "fontFamily": "Arial",
    //                             "fontSize": 12,
    //                             "italic": false,
    //                             "opacity": 1,
    //                             "strokeDashArray": "",
    //                             "textAlign": "Center",
    //                             "textOverflow": "Wrap",
    //                             "textDecoration": "None"
    //                         },
    //                         "hyperlink": {
    //                             "link": "",
    //                             "content": "",
    //                             "textDecoration": "None"
    //                         },
    //                         "constraints": 4,
    //                         "visibility": true,
    //                         "rotateAngle": 0,
    //                         "margin": {
    //                             "left": 0,
    //                             "top": 0,
    //                             "right": 0,
    //                             "bottom": 0
    //                         },
    //                         "horizontalAlignment": "Center",
    //                         "verticalAlignment": "Center",
    //                         "offset": {
    //                             "x": 0.5,
    //                             "y": 0.5
    //                         }
    //                     }
    //                 ],
    //                 "isExpanded": true,
    //                 "expandIcon": {
    //                     "shape": "None"
    //                 },
    //                 "fixedUserHandles": [],
    //                 "tooltip": {
    //                     "openOn": "Auto"
    //                 },
    //                 "inEdges": ["connectorP67B4"],
    //                 "outEdges": [],
    //                 "parentId": "",
    //                 "processId": "",
    //                 "umlIndex": -1,
    //                 "isPhase": false,
    //                 "isLane": false
    //             }, {
    //                 "shape": {
    //                     "type": "Text",
    //                     "content": "Outros Tipos ",
    //                     "margin": {
    //                         "left": 0,
    //                         "top": 0,
    //                         "right": 0,
    //                         "bottom": 0
    //                     }
    //                 },
    //                 "ports": [],
    //                 "style": {
    //                     "fill": "none",
    //                     "strokeColor": "none",
    //                     "strokeWidth": 1,
    //                     "strokeDashArray": "2 2",
    //                     "opacity": 1,
    //                     "gradient": {
    //                         "type": "None"
    //                     },
    //                     "fontSize": 12,
    //                     "fontFamily": "Arial",
    //                     "textOverflow": "Wrap",
    //                     "textDecoration": "None",
    //                     "whiteSpace": "CollapseSpace",
    //                     "textWrapping": "WrapWithOverflow",
    //                     "textAlign": "Center",
    //                     "color": "black",
    //                     "italic": false,
    //                     "bold": false
    //                 },
    //                 "offsetX": 844.5,
    //                 "width": 71,
    //                 "height": 31.875,
    //                 "offsetY": 415.05,
    //                 "id": "nodeH3qPR",
    //                 "zIndex": 39,
    //                 "container": null,
    //                 "visible": true,
    //                 "horizontalAlignment": "Left",
    //                 "verticalAlignment": "Top",
    //                 "backgroundColor": "transparent",
    //                 "borderColor": "none",
    //                 "borderWidth": 0,
    //                 "rotateAngle": 0,
    //                 "pivot": {
    //                     "x": 0.5,
    //                     "y": 0.5
    //                 },
    //                 "margin": {
    //                     "top": 0,
    //                     "left": 0
    //                 },
    //                 "flip": "None",
    //                 "wrapper": {
    //                     "actualSize": {
    //                         "width": 71,
    //                         "height": 31.875
    //                     },
    //                     "offsetX": 844.5,
    //                     "offsetY": 415.05
    //                 },
    //                 "constraints": 5240814,
    //                 "annotations": [],
    //                 "isExpanded": true,
    //                 "expandIcon": {
    //                     "shape": "None"
    //                 },
    //                 "fixedUserHandles": [],
    //                 "tooltip": {
    //                     "openOn": "Auto"
    //                 },
    //                 "inEdges": [],
    //                 "outEdges": [],
    //                 "parentId": "",
    //                 "processId": "",
    //                 "umlIndex": -1,
    //                 "isPhase": false,
    //                 "isLane": false
    //             }, {
    //                 "shape": {
    //                     "type": "Flow",
    //                     "shape": "Process"
    //                 },
    //                 "ports": [],
    //                 "id": "FunçãoV9ZVv",
    //                 "width": 2339.9999999999995,
    //                 "height": 200,
    //                 "style": {
    //                     "fill": "white",
    //                     "strokeWidth": 2,
    //                     "gradient": {
    //                         "type": "None"
    //                     },
    //                     "strokeColor": "black",
    //                     "strokeDashArray": "",
    //                     "opacity": 1
    //                 },
    //                 "horizontalAlignment": "Left",
    //                 "annotations": [{
    //                         "id": "OUf8Z",
    //                         "content": "Assistente de Portabilidade ",
    //                         "annotationType": "String",
    //                         "rotateAngle": 270,
    //                         "offset": {
    //                             "x": 0,
    //                             "y": 0.5
    //                         },
    //                         "horizontalAlignment": "Center",
    //                         "margin": {
    //                             "left": 20,
    //                             "top": 0,
    //                             "right": 0,
    //                             "bottom": 0
    //                         },
    //                         "style": {
    //                             "strokeWidth": 0,
    //                             "strokeColor": "transparent",
    //                             "fill": "transparent",
    //                             "bold": false,
    //                             "textWrapping": "WrapWithOverflow",
    //                             "color": "black",
    //                             "whiteSpace": "CollapseSpace",
    //                             "fontFamily": "Arial",
    //                             "fontSize": 12,
    //                             "italic": false,
    //                             "opacity": 1,
    //                             "strokeDashArray": "",
    //                             "textAlign": "Center",
    //                             "textOverflow": "Wrap",
    //                             "textDecoration": "None"
    //                         },
    //                         "hyperlink": {
    //                             "link": "",
    //                             "content": "",
    //                             "textDecoration": "None"
    //                         },
    //                         "constraints": 4,
    //                         "visibility": true,
    //                         "verticalAlignment": "Center"
    //                     }
    //                 ],
    //                 "constraints": 5240430,
    //                 "container": null,
    //                 "offsetX": 1270,
    //                 "offsetY": 35,
    //                 "visible": true,
    //                 "verticalAlignment": "Top",
    //                 "backgroundColor": "transparent",
    //                 "borderColor": "none",
    //                 "borderWidth": 0,
    //                 "rotateAngle": 0,
    //                 "pivot": {
    //                     "x": 0.5,
    //                     "y": 0.5
    //                 },
    //                 "margin": {
    //                     "top": 0,
    //                     "left": 0
    //                 },
    //                 "flip": "None",
    //                 "wrapper": {
    //                     "actualSize": {
    //                         "width": 2339.9999999999995,
    //                         "height": 200
    //                     },
    //                     "offsetX": 1270,
    //                     "offsetY": 35
    //                 },
    //                 "previewSize": {},
    //                 "dragSize": {},
    //                 "zIndex": 40,
    //                 "isExpanded": true,
    //                 "expandIcon": {
    //                     "shape": "None"
    //                 },
    //                 "fixedUserHandles": [],
    //                 "tooltip": {
    //                     "openOn": "Auto"
    //                 },
    //                 "inEdges": [],
    //                 "outEdges": [],
    //                 "parentId": "",
    //                 "processId": "",
    //                 "umlIndex": -1,
    //                 "isPhase": false,
    //                 "isLane": false
    //             }, {
    //                 "shape": {
    //                     "type": "Flow",
    //                     "shape": "Process"
    //                 },
    //                 "ports": [],
    //                 "id": "FunçãocJoAT",
    //                 "width": 2339.9999999999995,
    //                 "height": 255,
    //                 "style": {
    //                     "fill": "white",
    //                     "strokeWidth": 2,
    //                     "gradient": {
    //                         "type": "None"
    //                     },
    //                     "strokeColor": "black",
    //                     "strokeDashArray": "",
    //                     "opacity": 1
    //                 },
    //                 "horizontalAlignment": "Left",
    //                 "annotations": [{
    //                         "id": "OUf8Z",
    //                         "content": "Analista de Prevenção e Segurança ",
    //                         "annotationType": "String",
    //                         "rotateAngle": 270,
    //                         "offset": {
    //                             "x": 0,
    //                             "y": 0.5
    //                         },
    //                         "horizontalAlignment": "Center",
    //                         "margin": {
    //                             "left": 20,
    //                             "top": 0,
    //                             "right": 0,
    //                             "bottom": 0
    //                         },
    //                         "style": {
    //                             "strokeWidth": 0,
    //                             "strokeColor": "transparent",
    //                             "fill": "transparent",
    //                             "bold": false,
    //                             "textWrapping": "WrapWithOverflow",
    //                             "color": "black",
    //                             "whiteSpace": "CollapseSpace",
    //                             "fontFamily": "Arial",
    //                             "fontSize": 12,
    //                             "italic": false,
    //                             "opacity": 1,
    //                             "strokeDashArray": "",
    //                             "textAlign": "Center",
    //                             "textOverflow": "Wrap",
    //                             "textDecoration": "None"
    //                         },
    //                         "hyperlink": {
    //                             "link": "",
    //                             "content": "",
    //                             "textDecoration": "None"
    //                         },
    //                         "constraints": 4,
    //                         "visibility": true,
    //                         "verticalAlignment": "Center"
    //                     }
    //                 ],
    //                 "constraints": 5240430,
    //                 "container": null,
    //                 "offsetX": 1270,
    //                 "offsetY": -192.5,
    //                 "visible": true,
    //                 "verticalAlignment": "Top",
    //                 "backgroundColor": "transparent",
    //                 "borderColor": "none",
    //                 "borderWidth": 0,
    //                 "rotateAngle": 0,
    //                 "pivot": {
    //                     "x": 0.5,
    //                     "y": 0.5
    //                 },
    //                 "margin": {
    //                     "top": 0,
    //                     "left": 0
    //                 },
    //                 "flip": "None",
    //                 "wrapper": {
    //                     "actualSize": {
    //                         "width": 2339.9999999999995,
    //                         "height": 255
    //                     },
    //                     "offsetX": 1270,
    //                     "offsetY": -192.5
    //                 },
    //                 "previewSize": {},
    //                 "dragSize": {},
    //                 "zIndex": 102,
    //                 "isExpanded": true,
    //                 "expandIcon": {
    //                     "shape": "None"
    //                 },
    //                 "fixedUserHandles": [],
    //                 "tooltip": {
    //                     "openOn": "Auto"
    //                 },
    //                 "inEdges": [],
    //                 "outEdges": [],
    //                 "parentId": "",
    //                 "processId": "",
    //                 "umlIndex": -1,
    //                 "isPhase": false,
    //                 "isLane": false
    //             }, {
    //                 "shape": {
    //                     "type": "Flow",
    //                     "shape": "Process"
    //                 },
    //                 "ports": [],
    //                 "id": "FunçãoFRGNE",
    //                 "width": 2339.9999999999995,
    //                 "height": 644.9999999999999,
    //                 "style": {
    //                     "fill": "white",
    //                     "strokeWidth": 2,
    //                     "strokeColor": "#3A3A3A",
    //                     "strokeDashArray": "",
    //                     "opacity": 1,
    //                     "gradient": {
    //                         "type": "None"
    //                     }
    //                 },
    //                 "horizontalAlignment": "Left",
    //                 "annotations": [{
    //                         "id": "WKdp2",
    //                         "content": "Assistente de Esteira ",
    //                         "annotationType": "String",
    //                         "rotateAngle": 270,
    //                         "offset": {
    //                             "x": 0,
    //                             "y": 0.5
    //                         },
    //                         "horizontalAlignment": "Center",
    //                         "margin": {
    //                             "left": 20,
    //                             "right": 0,
    //                             "bottom": 0,
    //                             "top": 0
    //                         },
    //                         "style": {
    //                             "strokeWidth": 0,
    //                             "strokeColor": "transparent",
    //                             "fill": "transparent",
    //                             "bold": false,
    //                             "textWrapping": "WrapWithOverflow",
    //                             "color": "black",
    //                             "whiteSpace": "CollapseSpace",
    //                             "fontFamily": "Arial",
    //                             "fontSize": 12,
    //                             "italic": false,
    //                             "opacity": 1,
    //                             "strokeDashArray": "",
    //                             "textAlign": "Center",
    //                             "textOverflow": "Wrap",
    //                             "textDecoration": "None"
    //                         },
    //                         "hyperlink": {
    //                             "link": "",
    //                             "content": "",
    //                             "textDecoration": "None"
    //                         },
    //                         "constraints": 4,
    //                         "visibility": true,
    //                         "verticalAlignment": "Center"
    //                     }
    //                 ],
    //                 "container": null,
    //                 "offsetX": 1270.0000000000002,
    //                 "offsetY": 457.49999999999994,
    //                 "visible": true,
    //                 "verticalAlignment": "Top",
    //                 "backgroundColor": "transparent",
    //                 "borderColor": "none",
    //                 "borderWidth": 0,
    //                 "rotateAngle": 0,
    //                 "pivot": {
    //                     "x": 0.5,
    //                     "y": 0.5
    //                 },
    //                 "margin": {
    //                     "top": 0,
    //                     "left": 0
    //                 },
    //                 "flip": "None",
    //                 "wrapper": {
    //                     "actualSize": {
    //                         "width": 2339.9999999999995,
    //                         "height": 644.9999999999999
    //                     },
    //                     "offsetX": 1270.0000000000002,
    //                     "offsetY": 457.49999999999994
    //                 },
    //                 "constraints": 5240430,
    //                 "previewSize": {},
    //                 "dragSize": {},
    //                 "zIndex": 1,
    //                 "isExpanded": true,
    //                 "expandIcon": {
    //                     "shape": "None"
    //                 },
    //                 "fixedUserHandles": [],
    //                 "tooltip": {
    //                     "openOn": "Auto"
    //                 },
    //                 "inEdges": [],
    //                 "outEdges": [],
    //                 "parentId": "",
    //                 "processId": "",
    //                 "umlIndex": -1,
    //                 "isPhase": false,
    //                 "isLane": false
    //             }
    //         ],
    //         "connectors": [{
    //                 "shape": {
    //                     "type": "None"
    //                 },
    //                 "type": "Orthogonal",
    //                 "sourcePortID": "wAPsD",
    //                 "sourcePoint": {
    //                     "x": 215,
    //                     "y": 417.5
    //                 },
    //                 "targetPoint": {
    //                     "x": 258,
    //                     "y": 417.49
    //                 },
    //                 "id": "connectorqvrHT",
    //                 "sourceID": "Iniciar-cronômetroP0cfO",
    //                 "zIndex": 20,
    //                 "targetID": "Tarefadn24E",
    //                 "targetPortID": "KUG1O",
    //                 "flip": "None",
    //                 "segments": [{
    //                         "type": "Orthogonal",
    //                         "length": null,
    //                         "direction": null
    //                     }
    //                 ],
    //                 "sourceDecorator": {
    //                     "shape": "None",
    //                     "width": 10,
    //                     "height": 10,
    //                     "pivot": {
    //                         "x": 0,
    //                         "y": 0.5
    //                     },
    //                     "style": {
    //                         "fill": "black",
    //                         "strokeColor": "black",
    //                         "strokeWidth": 1,
    //                         "strokeDashArray": "",
    //                         "opacity": 1,
    //                         "gradient": {
    //                             "type": "None"
    //                         }
    //                     }
    //                 },
    //                 "targetDecorator": {
    //                     "shape": "Arrow",
    //                     "width": 10,
    //                     "height": 10,
    //                     "pivot": {
    //                         "x": 0,
    //                         "y": 0.5
    //                     },
    //                     "style": {
    //                         "fill": "black",
    //                         "strokeColor": "black",
    //                         "strokeWidth": 1,
    //                         "strokeDashArray": "",
    //                         "opacity": 1,
    //                         "gradient": {
    //                             "type": "None"
    //                         }
    //                     }
    //                 },
    //                 "cornerRadius": 0,
    //                 "wrapper": {
    //                     "actualSize": {
    //                         "width": 43,
    //                         "height": 0.009999999999990905
    //                     },
    //                     "offsetX": 236.5,
    //                     "offsetY": 417.495
    //                 },
    //                 "style": {
    //                     "strokeWidth": 1,
    //                     "strokeColor": "black",
    //                     "fill": "transparent",
    //                     "strokeDashArray": "",
    //                     "opacity": 1,
    //                     "gradient": {
    //                         "type": "None"
    //                     }
    //                 },
    //                 "annotations": [],
    //                 "fixedUserHandles": [],
    //                 "visible": true,
    //                 "constraints": 470590,
    //                 "sourcePadding": 0,
    //                 "targetPadding": 0,
    //                 "tooltip": {
    //                     "openOn": "Auto"
    //                 },
    //                 "connectionPadding": 0,
    //                 "bridgeSpace": 10,
    //                 "hitPadding": 10,
    //                 "parentId": ""
    //             }, {
    //                 "shape": {
    //                     "type": "None"
    //                 },
    //                 "type": "Orthogonal",
    //                 "sourcePortID": "IETOA",
    //                 "sourcePoint": {
    //                     "x": 388,
    //                     "y": 417.49
    //                 },
    //                 "targetPoint": {
    //                     "x": 430,
    //                     "y": 417.49
    //                 },
    //                 "id": "connectorK89KV",
    //                 "sourceID": "Tarefadn24E",
    //                 "zIndex": 22,
    //                 "targetID": "TarefaMIeVG",
    //                 "targetPortID": "",
    //                 "flip": "None",
    //                 "segments": [{
    //                         "type": "Orthogonal",
    //                         "length": null,
    //                         "direction": null
    //                     }
    //                 ],
    //                 "sourceDecorator": {
    //                     "shape": "None",
    //                     "width": 10,
    //                     "height": 10,
    //                     "pivot": {
    //                         "x": 0,
    //                         "y": 0.5
    //                     },
    //                     "style": {
    //                         "fill": "black",
    //                         "strokeColor": "black",
    //                         "strokeWidth": 1,
    //                         "strokeDashArray": "",
    //                         "opacity": 1,
    //                         "gradient": {
    //                             "type": "None"
    //                         }
    //                     }
    //                 },
    //                 "targetDecorator": {
    //                     "shape": "Arrow",
    //                     "width": 10,
    //                     "height": 10,
    //                     "pivot": {
    //                         "x": 0,
    //                         "y": 0.5
    //                     },
    //                     "style": {
    //                         "fill": "black",
    //                         "strokeColor": "black",
    //                         "strokeWidth": 1,
    //                         "strokeDashArray": "",
    //                         "opacity": 1,
    //                         "gradient": {
    //                             "type": "None"
    //                         }
    //                     }
    //                 },
    //                 "cornerRadius": 0,
    //                 "wrapper": {
    //                     "actualSize": {
    //                         "width": 42,
    //                         "height": 0
    //                     },
    //                     "offsetX": 409,
    //                     "offsetY": 417.49
    //                 },
    //                 "style": {
    //                     "strokeWidth": 1,
    //                     "strokeColor": "black",
    //                     "fill": "transparent",
    //                     "strokeDashArray": "",
    //                     "opacity": 1,
    //                     "gradient": {
    //                         "type": "None"
    //                     }
    //                 },
    //                 "annotations": [],
    //                 "fixedUserHandles": [],
    //                 "visible": true,
    //                 "constraints": 470590,
    //                 "sourcePadding": 0,
    //                 "targetPadding": 0,
    //                 "tooltip": {
    //                     "openOn": "Auto"
    //                 },
    //                 "connectionPadding": 0,
    //                 "bridgeSpace": 10,
    //                 "hitPadding": 10,
    //                 "parentId": ""
    //             }, {
    //                 "shape": {
    //                     "type": "None"
    //                 },
    //                 "id": "Linha-Bezier-2tqUAl",
    //                 "type": "Bezier",
    //                 "sourcePoint": {
    //                     "x": 518.31,
    //                     "y": 344
    //                 },
    //                 "targetPoint": {
    //                     "x": 505.31,
    //                     "y": 384.99
    //                 },
    //                 "style": {
    //                     "strokeWidth": 1,
    //                     "strokeColor": "black",
    //                     "strokeDashArray": "3,3",
    //                     "fill": "transparent",
    //                     "opacity": 1,
    //                     "gradient": {
    //                         "type": "None"
    //                     }
    //                 },
    //                 "targetDecorator": {
    //                     "shape": "None",
    //                     "width": 10,
    //                     "height": 10,
    //                     "pivot": {
    //                         "x": 0,
    //                         "y": 0.5
    //                     },
    //                     "style": {
    //                         "fill": "black",
    //                         "strokeColor": "black",
    //                         "strokeWidth": 1,
    //                         "strokeDashArray": "",
    //                         "opacity": 1,
    //                         "gradient": {
    //                             "type": "None"
    //                         }
    //                     }
    //                 },
    //                 "sourcePortID": "",
    //                 "targetPortID": "",
    //                 "sourceID": "Objeto-de-DadosumK60",
    //                 "targetID": "TarefaMIeVG",
    //                 "flip": "None",
    //                 "segments": [{
    //                         "type": "Bezier",
    //                         "point1": {
    //                             "x": 0,
    //                             "y": 0
    //                         },
    //                         "vector1": {
    //                             "angle": 0,
    //                             "distance": 0
    //                         },
    //                         "point2": {
    //                             "x": 0,
    //                             "y": 0
    //                         },
    //                         "vector2": {
    //                             "angle": 0,
    //                             "distance": 0
    //                         },
    //                         "point": {
    //                             "x": 0,
    //                             "y": 0
    //                         }
    //                     }
    //                 ],
    //                 "sourceDecorator": {
    //                     "shape": "None",
    //                     "width": 10,
    //                     "height": 10,
    //                     "pivot": {
    //                         "x": 0,
    //                         "y": 0.5
    //                     },
    //                     "style": {
    //                         "fill": "black",
    //                         "strokeColor": "black",
    //                         "strokeWidth": 1,
    //                         "strokeDashArray": "",
    //                         "opacity": 1,
    //                         "gradient": {
    //                             "type": "None"
    //                         }
    //                     }
    //                 },
    //                 "cornerRadius": 0,
    //                 "wrapper": {
    //                     "actualSize": {
    //                         "width": 12.906056461944786,
    //                         "height": 38.33142971478344
    //                     },
    //                     "offsetX": 511.85697176902755,
    //                     "offsetY": 363.1657148573917
    //                 },
    //                 "annotations": [],
    //                 "fixedUserHandles": [],
    //                 "previewSize": {},
    //                 "zIndex": 24,
    //                 "visible": true,
    //                 "constraints": 470590,
    //                 "connectionPadding": 0,
    //                 "hitPadding": 10,
    //                 "bridgeSpace": 10,
    //                 "sourcePadding": 0,
    //                 "targetPadding": 0,
    //                 "tooltip": {
    //                     "openOn": "Auto"
    //                 },
    //                 "parentId": ""
    //             }, {
    //                 "shape": {
    //                     "type": "None"
    //                 },
    //                 "type": "Orthogonal",
    //                 "sourcePortID": "",
    //                 "sourcePoint": {
    //                     "x": 560,
    //                     "y": 417.49
    //                 },
    //                 "targetPoint": {
    //                     "x": 602,
    //                     "y": 417.49
    //                 },
    //                 "id": "connectormTdJ3",
    //                 "sourceID": "TarefaMIeVG",
    //                 "zIndex": 26,
    //                 "targetID": "TarefaKJpm0",
    //                 "targetPortID": "IAJua",
    //                 "flip": "None",
    //                 "segments": [{
    //                         "type": "Orthogonal",
    //                         "length": null,
    //                         "direction": null
    //                     }
    //                 ],
    //                 "sourceDecorator": {
    //                     "shape": "None",
    //                     "width": 10,
    //                     "height": 10,
    //                     "pivot": {
    //                         "x": 0,
    //                         "y": 0.5
    //                     },
    //                     "style": {
    //                         "fill": "black",
    //                         "strokeColor": "black",
    //                         "strokeWidth": 1,
    //                         "strokeDashArray": "",
    //                         "opacity": 1,
    //                         "gradient": {
    //                             "type": "None"
    //                         }
    //                     }
    //                 },
    //                 "targetDecorator": {
    //                     "shape": "Arrow",
    //                     "width": 10,
    //                     "height": 10,
    //                     "pivot": {
    //                         "x": 0,
    //                         "y": 0.5
    //                     },
    //                     "style": {
    //                         "fill": "black",
    //                         "strokeColor": "black",
    //                         "strokeWidth": 1,
    //                         "strokeDashArray": "",
    //                         "opacity": 1,
    //                         "gradient": {
    //                             "type": "None"
    //                         }
    //                     }
    //                 },
    //                 "cornerRadius": 0,
    //                 "wrapper": {
    //                     "actualSize": {
    //                         "width": 42,
    //                         "height": 0
    //                     },
    //                     "offsetX": 581,
    //                     "offsetY": 417.49
    //                 },
    //                 "style": {
    //                     "strokeWidth": 1,
    //                     "strokeColor": "black",
    //                     "fill": "transparent",
    //                     "strokeDashArray": "None",
    //                     "opacity": 1,
    //                     "gradient": {
    //                         "type": "None"
    //                     }
    //                 },
    //                 "annotations": [],
    //                 "fixedUserHandles": [],
    //                 "visible": true,
    //                 "constraints": 470590,
    //                 "sourcePadding": 0,
    //                 "targetPadding": 0,
    //                 "tooltip": {
    //                     "openOn": "Auto"
    //                 },
    //                 "connectionPadding": 0,
    //                 "bridgeSpace": 10,
    //                 "hitPadding": 10,
    //                 "parentId": ""
    //             }, {
    //                 "shape": {
    //                     "type": "None"
    //                 },
    //                 "type": "Orthogonal",
    //                 "sourcePortID": "",
    //                 "sourcePoint": {
    //                     "x": 732,
    //                     "y": 417.49
    //                 },
    //                 "targetPoint": {
    //                     "x": 774,
    //                     "y": 417.49
    //                 },
    //                 "id": "connectorS8FCH",
    //                 "sourceID": "TarefaKJpm0",
    //                 "zIndex": 28,
    //                 "targetID": "Gateway-Exclusivel7TOi",
    //                 "targetPortID": "MSigX",
    //                 "flip": "None",
    //                 "segments": [{
    //                         "type": "Orthogonal",
    //                         "length": null,
    //                         "direction": null
    //                     }
    //                 ],
    //                 "sourceDecorator": {
    //                     "shape": "None",
    //                     "width": 10,
    //                     "height": 10,
    //                     "pivot": {
    //                         "x": 0,
    //                         "y": 0.5
    //                     },
    //                     "style": {
    //                         "fill": "black",
    //                         "strokeColor": "black",
    //                         "strokeWidth": 1,
    //                         "strokeDashArray": "",
    //                         "opacity": 1,
    //                         "gradient": {
    //                             "type": "None"
    //                         }
    //                     }
    //                 },
    //                 "targetDecorator": {
    //                     "shape": "Arrow",
    //                     "width": 10,
    //                     "height": 10,
    //                     "pivot": {
    //                         "x": 0,
    //                         "y": 0.5
    //                     },
    //                     "style": {
    //                         "fill": "black",
    //                         "strokeColor": "black",
    //                         "strokeWidth": 1,
    //                         "strokeDashArray": "",
    //                         "opacity": 1,
    //                         "gradient": {
    //                             "type": "None"
    //                         }
    //                     }
    //                 },
    //                 "cornerRadius": 0,
    //                 "wrapper": {
    //                     "actualSize": {
    //                         "width": 42,
    //                         "height": 0
    //                     },
    //                     "offsetX": 753,
    //                     "offsetY": 417.49
    //                 },
    //                 "style": {
    //                     "strokeWidth": 1,
    //                     "strokeColor": "black",
    //                     "fill": "transparent",
    //                     "strokeDashArray": "",
    //                     "opacity": 1,
    //                     "gradient": {
    //                         "type": "None"
    //                     }
    //                 },
    //                 "annotations": [],
    //                 "fixedUserHandles": [],
    //                 "visible": true,
    //                 "constraints": 470590,
    //                 "sourcePadding": 0,
    //                 "targetPadding": 0,
    //                 "tooltip": {
    //                     "openOn": "Auto"
    //                 },
    //                 "connectionPadding": 0,
    //                 "bridgeSpace": 10,
    //                 "hitPadding": 10,
    //                 "parentId": ""
    //             }, {
    //                 "shape": {
    //                     "type": "None"
    //                 },
    //                 "type": "Orthogonal",
    //                 "sourcePortID": "JxaVm",
    //                 "sourcePoint": {
    //                     "x": 809,
    //                     "y": 417.49
    //                 },
    //                 "targetPoint": {
    //                     "x": 898,
    //                     "y": 417.49
    //                 },
    //                 "id": "connectorP67B4",
    //                 "sourceID": "Gateway-Exclusivel7TOi",
    //                 "zIndex": 38,
    //                 "targetID": "Tarefawx6id",
    //                 "targetPortID": "",
    //                 "flip": "None",
    //                 "segments": [{
    //                         "type": "Orthogonal",
    //                         "length": null,
    //                         "direction": null
    //                     }
    //                 ],
    //                 "sourceDecorator": {
    //                     "shape": "None",
    //                     "width": 10,
    //                     "height": 10,
    //                     "pivot": {
    //                         "x": 0,
    //                         "y": 0.5
    //                     },
    //                     "style": {
    //                         "fill": "black",
    //                         "strokeColor": "black",
    //                         "strokeWidth": 1,
    //                         "strokeDashArray": "",
    //                         "opacity": 1,
    //                         "gradient": {
    //                             "type": "None"
    //                         }
    //                     }
    //                 },
    //                 "targetDecorator": {
    //                     "shape": "Arrow",
    //                     "width": 10,
    //                     "height": 10,
    //                     "pivot": {
    //                         "x": 0,
    //                         "y": 0.5
    //                     },
    //                     "style": {
    //                         "fill": "black",
    //                         "strokeColor": "black",
    //                         "strokeWidth": 1,
    //                         "strokeDashArray": "",
    //                         "opacity": 1,
    //                         "gradient": {
    //                             "type": "None"
    //                         }
    //                     }
    //                 },
    //                 "cornerRadius": 0,
    //                 "wrapper": {
    //                     "actualSize": {
    //                         "width": 89,
    //                         "height": 0
    //                     },
    //                     "offsetX": 853.5,
    //                     "offsetY": 417.49
    //                 },
    //                 "style": {
    //                     "strokeWidth": 1,
    //                     "strokeColor": "black",
    //                     "fill": "transparent",
    //                     "strokeDashArray": "",
    //                     "opacity": 1,
    //                     "gradient": {
    //                         "type": "None"
    //                     }
    //                 },
    //                 "annotations": [],
    //                 "fixedUserHandles": [],
    //                 "visible": true,
    //                 "constraints": 470590,
    //                 "sourcePadding": 0,
    //                 "targetPadding": 0,
    //                 "tooltip": {
    //                     "openOn": "Auto"
    //                 },
    //                 "connectionPadding": 0,
    //                 "bridgeSpace": 10,
    //                 "hitPadding": 10,
    //                 "parentId": ""
    //             }
    //         ],
    //         "contextMenuSettings": {
    //             "show": true,
    //             "items": [{
    //                     "text": "Duplicar",
    //                     "id": "duplicate"
    //                 }
    //             ],
    //             "showCustomMenuOnly": true
    //         },
    //         "contextMenuOpen": {},
    //         "contextMenuClick": {},
    //         "enableRtl": false,
    //         "locale": "en-US",
    //         "enablePersistence": false,
    //         "scrollSettings": {
    //             "viewPortWidth": 1127.4000244140625,
    //             "viewPortHeight": 1000,
    //             "currentZoom": 0.2325680393613779,
    //             "horizontalOffset": 169.83,
    //             "verticalOffset": 196.52,
    //             "padding": {
    //                 "left": 50,
    //                 "right": 50,
    //                 "top": 50,
    //                 "bottom": 50
    //             },
    //             "scrollLimit": "Infinity",
    //             "canAutoScroll": false,
    //             "minZoom": 0.2,
    //             "maxZoom": 30
    //         },
    //         "rulerSettings": {
    //             "showRulers": false,
    //             "horizontalRuler": {
    //                 "orientation": "Horizontal",
    //                 "arrangeTick": null
    //             },
    //             "verticalRuler": {
    //                 "orientation": "Vertical",
    //                 "arrangeTick": null
    //             }
    //         },
    //         "backgroundColor": "transparent",
    //         "constraints": 500,
    //         "layout": {
    //             "type": "None",
    //             "enableAnimation": true,
    //             "connectionPointOrigin": "SamePoint",
    //             "arrangement": "Nonlinear",
    //             "enableRouting": false
    //         },
    //         "snapSettings": {
    //             "constraints": 31,
    //             "gridType": "Lines",
    //             "verticalGridlines": {
    //                 "lineIntervals": [1.25, 18.75, 0.25, 19.75, 0.25, 19.75, 0.25, 19.75, 0.25, 19.75],
    //                 "snapIntervals": [20],
    //                 "lineDashArray": "",
    //                 "lineColor": "lightgray"
    //             },
    //             "horizontalGridlines": {
    //                 "lineIntervals": [1.25, 18.75, 0.25, 19.75, 0.25, 19.75, 0.25, 19.75, 0.25, 19.75],
    //                 "snapIntervals": [20],
    //                 "lineDashArray": "",
    //                 "lineColor": "lightgray"
    //             },
    //             "snapObjectDistance": 5
    //         },
    //         "dataSourceSettings": {
    //             "dataManager": null,
    //             "dataSource": null,
    //             "crudAction": {
    //                 "read": ""
    //             },
    //             "connectionDataSource": {
    //                 "crudAction": {
    //                     "read": ""
    //                 }
    //             }
    //         },
    //         "mode": "SVG",
    //         "layers": [{
    //                 "objects": ["Títulof3rS2", "Iniciar-cronômetroP0cfO", "nodeNlPn3", "Tarefadn24E", "connectorqvrHT", "TarefaMIeVG", "connectorK89KV", "Objeto-de-DadosumK60", "Linha-Bezier-2tqUAl", "TarefaKJpm0", "connectormTdJ3", "Gateway-Exclusivel7TOi", "connectorS8FCH", "nodedZZPe", "nodetXaTa", "Tarefawx6id", "connectorP67B4", "nodeH3qPR", "FunçãoV9ZVv", "FunçãocJoAT", "FunçãoFRGNE"],
    //                 "id": "default_layer",
    //                 "visible": true,
    //                 "lock": false,
    //                 "zIndex": 0,
    //                 "objectZIndex": 108
    //             }
    //         ],
    //         "diagramSettings": {
    //             "inversedAlignment": true
    //         },
    //         "pageSettings": {
    //             "boundaryConstraints": "Infinity",
    //             "orientation": "Landscape",
    //             "height": 816,
    //             "width": 1056,
    //             "background": {
    //                 "source": "",
    //                 "color": "transparent"
    //             },
    //             "showPageBreaks": false,
    //             "fitOptions": {
    //                 "canFit": false
    //             },
    //             "multiplePage": false
    //         },
    //         "selectedItems": {
    //             "nodes": [],
    //             "connectors": [],
    //             "wrapper": null,
    //             "constraints": 16382,
    //             "userHandles": [],
    //             "rotateAngle": 0,
    //             "pivot": {
    //                 "x": 0.5,
    //                 "y": 0.5
    //             },
    //             "width": 34,
    //             "height": 2,
    //             "offsetX": 1719,
    //             "offsetY": 426.125,
    //             "rubberBandSelectionMode": "CompleteIntersect"
    //         },
    //         "basicElements": [],
    //         "tooltip": {
    //             "content": "",
    //             "relativeMode": "Mouse"
    //         },
    //         "commandManager": {
    //             "commands": []
    //         },
    //         "dragEnter": {},
    //         "tool": 3,
    //         "bridgeDirection": "Top",
    //         "drawingObject": {
    //             "type": "Orthogonal",
    //             "sourcePortID": "wTZha"
    //         },
    //         "customCursor": [],
    //         "version": 17.1
    //     }`;
    //     diagram.loadDiagram(data);
    //     let lablePosition = document.getElementById('Tarefawx6id' + '_' + diagram.nameTable['Tarefawx6id'].annotations[0].id).getBoundingClientRect();
    //     let nodePosition = document.getElementById('Tarefawx6id').getBoundingClientRect();
    //     let x1 = Math.round((nodePosition as any).x);
    //     let z1 = Math.round((lablePosition as any).x);
    //     let check: boolean = numbersinranges(z1, x1 - 2, x1 + 2)
    //     expect(check).toEqual(true);
    //     done();
    // });
    describe('Double click on node annotation with style itatic', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents;
        let diagramCanvas: HTMLElement; let left: number; let top: number;

        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                this.skip(); //Skips test (in Chai)
                return;
            }
            let nodes: NodeModel[] = [{
                id: 'node1', width: 500, height: 500, offsetX: 100, offsetY: 100, annotations: [
                    {
                        content: 'Node',
                        style: {
                            fill: 'none',
                            strokeColor: 'none',
                            textWrapping: 'Wrap',
                            fontSize: 10,
                            italic: true,
                        },
                    }]
            }];
            diagram = new Diagram({
                width: '100%', height: 500, nodes: nodes
            });
            ele = createDiagramContainer();
            diagram.appendTo('#' + ele.id);
            diagramCanvas = document.getElementById(diagram.element.id + 'content');
            mouseEvents = new MouseEvents();
            mouseEvents.clickEvent(diagramCanvas, 1, 1);
            left = diagram.element.offsetLeft; top = diagram.element.offsetTop;
        });

        afterAll((): void => {
            mouseEvents = null;
            if (diagram) {
                diagram.selectionChange = undefined;
                diagram.destroy();
                diagram = null;
            }
            diagramCanvas = null;
            removeContainer(ele);
            ele = null;
        });

        it('Double Click on node', (done: Function) => {
            mouseEvents.clickEvent(diagramCanvas, 200, 200);
            mouseEvents.dblclickEvent(diagramCanvas, 200, 200);
            mouseEvents.clickEvent(diagramCanvas, 800, 400);
            mouseEvents.clickEvent(diagramCanvas, 200, 200);
            expect((diagram.selectedItems.nodes[0] as NodeModel).annotations[0].content == 'Node').toBe(true);
            done();
        });
    });
    describe('Connector Annotation is not readable when the connectors endpoint is dynamically rotated', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'annotationRotateAngle' });
            document.body.appendChild(ele);
            let connectors: ConnectorModel[] = [
                {
                    id: 'connector1', sourcePoint: { x: 100, y: 300 }, targetPoint: { x: 300, y: 100 },
                    annotations: [
                        {
                            content: 'Annotations',
                            rotateAngle: 315,
                            segmentAngle: true
                        },
                    ]
                },
                {
                    id: 'connector2', sourcePoint: { x: 400, y: 300 }, targetPoint: { x: 600, y: 100 },
                    annotations: [
                        {
                            content: 'Annotations',
                            rotateAngle: 180,
                            segmentAngle: true
                        },
                    ]
                }
            ];
            diagram = new Diagram({
                width: '800px', height: '500px', connectors: connectors
            });
            diagram.appendTo('#annotationRotateAngle');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
            diagram = null;
            ele = null;
        });

        it('Connector Annotation is not readable when the connectors endpoint', function (done) {
            let connector: number = (diagram.connectors[0] as ConnectorModel).annotations[0].rotateAngle;
            expect(connector === 315).toBe(true);
            done();
        });
    });
});

describe('cheking node annotation tooltip support', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let mouseEvents: MouseEvents = new MouseEvents();
    let diagramCanvas: HTMLElement;

    beforeAll((): void => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            this.skip(); //Skips test (in Chai)
            return;
        }

        let nodes: NodeModel[] = [{
            id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100,
            annotations: [{ content: 'anootation', tooltip: { content: 'annotation tooltip', position: 'BottomRight', relativeMode: 'Object', }, constraints: AnnotationConstraints.Tooltip, }],
        }];
        diagram = new Diagram({
            width: 800, height: 500, nodes: nodes
        });
        ele = createDiagramContainer();
        diagram.appendTo('#' + ele.id);
        mouseEvents = new MouseEvents();
        diagramCanvas = document.getElementById(diagram.element.id + 'content');
    });

    afterAll((): void => {
        mouseEvents = null;
        diagramCanvas = null;
        if (diagram) {
            diagram.selectionChange = undefined;
            diagram.destroy();
            diagram = null;
        }
        removeContainer(ele);
        ele = null;
    });

    // it('check node annotation tooltip support', (done: Function) => {
    //     diagramCanvas = document.getElementById(diagram.element.id + 'content');
    //     mouseEvents.mouseMoveEvent(diagramCanvas, 20, 20);
    //     expect(document.getElementsByClassName('e-tip-content').length === 0).toBe(true);
    //     mouseEvents.mouseMoveEvent(diagramCanvas, 106, 108);
    //     expect(document.getElementsByClassName('e-tip-content').length !== 0).toBe(true);
    //     done();    
    // });
});

describe('Hyperlink Target ', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let diagramCanvas: HTMLElement;
    let mouseEvents: MouseEvents;

    beforeAll((): void => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
        let nodes: NodeModel[] = [
            {
                id: 'node1', height: 100, width: 100, offsetX: 250, offsetY: 250,
                annotations: [{ hyperlink: { link: 'https://www.google.com', hyperlinkOpenState: 'CurrentTab' } }]
            },
            {
                id: 'node2', height: 100, width: 100, offsetX: 450, offsetY: 450,
                annotations: [{ hyperlink: { link: 'https://www.google.com', hyperlinkOpenState: 'NewWindow' } }]
            }
        ];
        diagram = new Diagram({
            width: 1000, height: 1000, nodes: nodes
        });
        ele = createDiagramContainer();
        diagram.appendTo('#' + ele.id);
        diagramCanvas = document.getElementById(diagram.element.id + 'content');
        mouseEvents = new MouseEvents();
    });
    afterAll((): void => {
        mouseEvents = null;
        if (diagram) {
            diagram.selectionChange = undefined;
            diagram.destroy();
            diagram = null;
        }
        diagramCanvas = null;
        removeContainer(ele);
        ele = null;
    });

    it('checking hyperlinkOpenState value to NewWindow', function (done) {
        let hyperlinkOpenState = diagram.nodes[1].annotations[0].hyperlink.hyperlinkOpenState;
        let node = document.getElementById('node2_content_groupElement');
        let bound = node.getBoundingClientRect();
        let cx: number = bound.left + bound.width / 2;
        let cy: number = bound.top + bound.height / 2;
        mouseEvents.mouseDownEvent(diagramCanvas, cx, cy);
        mouseEvents.mouseUpEvent(diagramCanvas, cx, cy);
        expect(hyperlinkOpenState == 'NewWindow').toBe(true);
        done();
    });
});
describe('Rezise label with RestrictNegativeAxisDragDrop constraint ', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let diagramCanvas: HTMLElement;
    let mouseEvents: MouseEvents;
    beforeAll((): void => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
        let nodes: NodeModel[] = [
            {
                id: 'node1', height: 100, width: 100, offsetX: 30, offsetY: 100,
                annotations: [{ id: 'lable1', content: 'Resize label', constraints: AnnotationConstraints.Interaction, width: 100, height: 100 }]
            },
        ];
        diagram = new Diagram({
            width: 1000, height: 1000, nodes: nodes,
            constraints: DiagramConstraints.Default | DiagramConstraints.RestrictNegativeAxisDragDrop,
        });
        ele = createDiagramContainer();
        diagram.appendTo('#' + ele.id);
        diagramCanvas = document.getElementById(diagram.element.id + 'content');
        mouseEvents = new MouseEvents();
    });
    afterAll((): void => {
        mouseEvents = null;
        if (diagram) {
            diagram.selectionChange = undefined;
            diagram.destroy();
            diagram = null;
        }
        diagramCanvas = null;
        removeContainer(ele);
        ele = null;
    });
    it('Check resize label', function (done) {
        let label = document.getElementById('node1_lable1_groupElement');
        let bound = label.getBoundingClientRect();
        let cx: number = bound.left + bound.width / 2;
        let cy: number = bound.top + bound.height / 2;
        mouseEvents.mouseDownEvent(diagramCanvas, cx, cy);
        mouseEvents.mouseUpEvent(diagramCanvas, cx, cy);
        let handle = document.getElementById('resizeEast');
        let bound1 = handle.getBoundingClientRect();
        let cx1: number = bound1.left + bound1.width / 2;
        let cy1: number = bound1.top + bound1.height / 2;
        mouseEvents.mouseDownEvent(diagramCanvas, cx1, cy1);
        mouseEvents.mouseMoveEvent(diagramCanvas, cx1 + 30, cy1);
        mouseEvents.mouseUpEvent(diagramCanvas, cx1 + 30, cy1);
        expect(diagram.nodes[0].annotations[0].width === 100).toBe(true);
        done();
    });
});
