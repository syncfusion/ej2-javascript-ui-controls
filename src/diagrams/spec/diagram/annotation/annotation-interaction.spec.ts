/**
 * Annotation interaction - Test Cases
 */
import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { NodeModel, PathModel, } from '../../../src/diagram/objects/node-model';
import { Node } from '../../../src/diagram/objects/node';
import { ConnectorModel } from '../../../src/diagram/objects/connector-model';
import { MouseEvents } from '../interaction/mouseevents.spec';
import { AnnotationConstraints } from '../../../src/diagram/enum/enum';
import { Selector, } from '../../../src/diagram/interaction/selector';
import { DiagramElement } from '../../../src/diagram/core/elements/diagram-element';
import { PointModel } from '../../../src/diagram/primitives/point-model';
import { identityMatrix, rotateMatrix, transformPointByMatrix, Matrix } from '../../../src/diagram/primitives/matrix';
import { Container } from '../../../src/diagram/core/containers/container';
import { UndoRedo } from '../../../src/diagram/objects/undo-redo';
Diagram.Inject(UndoRedo);

function getOutput(label: DiagramElement) {
    var output: string = 'expect(label.offsetX ==' + label.offsetX + '&& label.offsetY ==' + label.offsetY + '&& label.width ==' + label.width + '&& label.height ==' + label.height + '&& label.rotateAngle ==' + label.rotateAngle + ').toBe(true);';
    console.log(output);
}

function drag(diagram: Diagram) {
    let diagramCanvas: HTMLElement; let left: number; let top: number;
    diagramCanvas = document.getElementById(diagram.element.id + 'content');
    left = diagram.element.offsetLeft; top = diagram.element.offsetTop;
    let mouseEvents: MouseEvents = new MouseEvents();
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

function resize(diagram: Diagram, direction: string): void {
    if ((diagram.selectedItems as Selector).annotation) {
        let diagramCanvas: HTMLElement; let left: number; let top: number;
        diagramCanvas = document.getElementById(diagram.element.id + 'content');
        left = diagram.element.offsetLeft; top = diagram.element.offsetTop;
        let element: HTMLElement = document.getElementById(direction);
        let mouseEvents: MouseEvents = new MouseEvents();
        let x: number = Number(element.getAttribute('cx'));
        let y: number = Number(element.getAttribute('cy'));
        mouseEvents.mouseDownEvent(diagramCanvas, x + diagram.element.offsetLeft, y + diagram.element.offsetTop);
        mouseEvents.mouseMoveEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop);
        mouseEvents.mouseMoveEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop + 20);
        mouseEvents.mouseUpEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop + 20);
    }
}


function rotate(diagram: Diagram) {
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
        let x: number = element.offsetX - element.pivot.x * element.actualSize.width;
        let y: number = element.offsetY - element.pivot.y * element.actualSize.height;
        let rotateThumb: PointModel = { x: x + element.actualSize.width / 2, y: y - 30 / diagram.scroller.currentZoom };
        rotateThumb = transformPointByMatrix(matrix, rotateThumb);
        mouseEvents.mouseDownEvent(diagramCanvas, rotateThumb.x + diagram.element.offsetLeft, rotateThumb.y + diagram.element.offsetTop);
        mouseEvents.mouseMoveEvent(diagramCanvas, rotateThumb.x + diagram.element.offsetLeft + 20, rotateThumb.y + diagram.element.offsetTop);
        mouseEvents.mouseMoveEvent(diagramCanvas, rotateThumb.x + diagram.element.offsetLeft + 20, rotateThumb.y + diagram.element.offsetTop + 20);
        mouseEvents.mouseUpEvent(diagramCanvas, rotateThumb.x + diagram.element.offsetLeft + 20, rotateThumb.y + diagram.element.offsetTop + 20);
    }
}

describe('Diagram Control', () => {
    describe('Nodes - Annotation Interaction', () => {
        describe('Having width and height', () => {
            let diagram: Diagram;
            let ele: HTMLElement;
            let mouseEvents: MouseEvents = new MouseEvents();
            let diagramCanvas: HTMLElement; let left: number; let top: number;
            beforeAll((): void => {
                ele = createElement('div', { id: 'NodesAnnotationInteraction' });
                document.body.appendChild(ele);
                let nodes: NodeModel[] = [{
                    id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100,
                    annotations: [{ offset: { x: 2, y: 1.5 }, content: 'Path Element', constraints: AnnotationConstraints.Interaction, width: 100, height: 100 }]
                }];
                diagram = new Diagram({
                    width: 800, height: 500, nodes: nodes,
                });
                diagram.appendTo('#NodesAnnotationInteraction');
                diagramCanvas = document.getElementById(diagram.element.id + 'content');
                mouseEvents.clickEvent(diagramCanvas, 1, 1);
                left = diagram.element.offsetLeft; top = diagram.element.offsetTop;
            });

            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });

            it('Select', (done: Function) => {
                let node: NodeModel = (diagram.nodes[0] as NodeModel);
                let annotation: DiagramElement = node.wrapper.children[1];
                mouseEvents.clickEvent(diagramCanvas, annotation.offsetX + left, annotation.offsetY + top);
                expect((diagram.selectedItems as Selector).annotation !== undefined).toBe(true);
                done();
            });
            it('Drag', (done: Function) => {
                drag(diagram);
                drag(diagram);
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 290 && label.offsetY == 240 && label.width == 100 && label.height == 100).toBe(true);
                done();
            });
            it('Resize North', (done: Function) => {
                resize(diagram, 'resizeNorth');
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 290 && label.offsetY == 250 && label.width == 100 && label.height == 80 && label.rotateAngle == 0).toBe(true);
                done();
            });
            it('Resize South', (done: Function) => {
                resize(diagram, 'resizeSouth');
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 290 && label.offsetY == 260 && label.width == 100 && label.height == 100 && label.rotateAngle == 0).toBe(true);
                done();
            });
            it('Resize East', (done: Function) => {
                resize(diagram, 'resizeEast');
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 300 && label.offsetY == 260 && label.width == 120 && label.height == 100 && label.rotateAngle == 0).toBe(true);
                done();
            });
            it('Resize West', (done: Function) => {
                resize(diagram, 'resizeWest');
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 309.99999999999994 && label.offsetY == 260 && label.width == 100 && label.height == 100 && label.rotateAngle == 0).toBe(true);
                done();
            });
            it('Resize NorthEast', (done: Function) => {
                resize(diagram, 'resizeNorthEast');
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 320 && label.offsetY == 270 && label.width == 120 && label.height == 80 && label.rotateAngle == 0).toBe(true);
                done();
            });
            it('Resize NorthWest', (done: Function) => {
                resize(diagram, 'resizeNorthWest');
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 330 && label.offsetY == 280 && label.width == 100 && label.height == 60 && label.rotateAngle == 0).toBe(true);
                done();
            });
            it('Resize SouthEast', (done: Function) => {
                resize(diagram, 'resizeSouthEast');
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 340 && label.offsetY == 290 && label.width == 120 && label.height == 80 && label.rotateAngle == 0).toBe(true);
                done();
            });
            it('Resize SouthWest', (done: Function) => {
                resize(diagram, 'resizeSouthWest');
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 350 && label.offsetY == 300 && label.width == 100 && label.height == 100 && label.rotateAngle == 0).toBe(true);
                done();
            });
            it('Rotate', (done: Function) => {
                rotate(diagram);
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 350 && label.offsetY == 300 && label.width == 100 && label.height == 100 && label.rotateAngle == 20).toBe(true);
                done();
            });
            it('Resize North after annotation rotation', (done: Function) => {
                resize(diagram, 'resizeNorth');
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 347.96 && label.offsetY == 305.62 && label.width == 100 && label.height == 88.05 && label.rotateAngle == 20).toBe(true);
                done();
            });
            it('Resize South after annotation rotation', (done: Function) => {
                resize(diagram, 'resizeSouth');
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 345.92 && label.offsetY == 311.24 && label.width == 100 && label.height == 99.99999999999999 && label.rotateAngle == 20).toBe(true);
                done();
            });
            it('Resize East after annotation rotation', (done: Function) => {
                resize(diagram, 'resizeEast');
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 357.96 && label.offsetY == 315.62 && label.width == 125.63000000000001 && label.height == 99.99999999999999 && label.rotateAngle == 20).toBe(true);
                done();
            });
            it('Resize West after annotation rotation', (done: Function) => {
                resize(diagram, 'resizeWest');
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 370 && label.offsetY == 320 && label.width == 100.00000000000001 && label.height == 99.99999999999999 && label.rotateAngle == 20).toBe(true);
                done();
            });
            it('Resize NorthEast after annotation rotation', (done: Function) => {
                resize(diagram, 'resizeNorthEast');
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 380 && label.offsetY == 330 && label.width == 125.63 && label.height == 88.04999999999998 && label.rotateAngle == 20).toBe(true);
                done();
            });
            it('Resize NorthWest after annotation rotation', (done: Function) => {
                resize(diagram, 'resizeNorthWest');
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 390 && label.offsetY == 340 && label.width == 100 && label.height == 76.09999999999998 && label.rotateAngle == 20).toBe(true);
                done();
            });
            it('Resize SouthEast after annotation rotation', (done: Function) => {
                resize(diagram, 'resizeSouthEast');
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 400 && label.offsetY == 350 && label.width == 125.63000000000001 && label.height == 88.04999999999998 && label.rotateAngle == 20).toBe(true);
                done();
            });
            it('Resize SouthWest after annotation rotation', (done: Function) => {
                resize(diagram, 'resizeSouthWest');
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 410 && label.offsetY == 360 && label.width == 100.00000000000001 && label.height == 99.99999999999999 && label.rotateAngle == 20).toBe(true);
                done();
            });
            it('Select and drag after rotation', (done: Function) => {
                mouseEvents.clickEvent(diagramCanvas, 1, 1);
                let node: NodeModel = (diagram.nodes[0] as NodeModel);
                let annotation: DiagramElement = node.wrapper.children[1];
                mouseEvents.clickEvent(diagramCanvas, annotation.offsetX + left, annotation.offsetY + top);
                expect((diagram.selectedItems as Selector).annotation !== undefined).toBe(true);
                drag(diagram);
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 430 && label.offsetY == 380 && label.width == 100.00000000000001 && label.height == 99.99999999999999 && label.rotateAngle == 20).toBe(true);
                done();
            });
            it('Change node rotation and drag the annotation', (done: Function) => {
                mouseEvents.clickEvent(diagramCanvas, 1, 1);
                diagram.nodes[0].rotateAngle = 10;
                diagram.nodes[0].annotations[0].offset = { x: 1, y: 0.5 };
                diagram.nodes[0].annotations[0].rotateAngle = 10;
                diagram.dataBind();
                let node: NodeModel = (diagram.nodes[0] as NodeModel);
                let annotation: DiagramElement = node.wrapper.children[1];
                mouseEvents.clickEvent(diagramCanvas, annotation.offsetX + left, annotation.offsetY + top);
                expect((diagram.selectedItems as Selector).annotation !== undefined).toBe(true);
                drag(diagram);
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 169.24 && label.offsetY == 128.69 && label.width == 100.00000000000001 && label.height == 99.99999999999999 && label.rotateAngle == 10).toBe(true);
                done();
            });
            it('Rotation after change node rotation', (done: Function) => {
                rotate(diagram);
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 169.24 && label.offsetY == 128.69 && label.width == 100.00000000000001 && label.height == 99.99999999999999 && label.rotateAngle == 30).toBe(true);
                done();
            });
            it('Resize after change node rotation', (done: Function) => {
                resize(diagram, 'resizeSouthEast');
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 179.24 && label.offsetY == 138.7 && label.width == 128.18 && label.height == 102.46999999999998 && label.rotateAngle == 30).toBe(true);
                done();
            });
        });
        describe('Annotation width and height are undefind', () => {
            let diagram: Diagram;
            let ele: HTMLElement;
            let mouseEvents: MouseEvents = new MouseEvents();
            let diagramCanvas: HTMLElement; let left: number; let top: number;
            beforeAll((): void => {
                ele = createElement('div', { id: 'NodesAnnotationInteraction1' });
                document.body.appendChild(ele);
                let nodes: NodeModel[] = [{
                    id: 'node2', width: 100, height: 100, offsetX: 200, offsetY: 100,
                    annotations: [{ offset: { x: 1, y: 0.5 }, content: 'This label is very \n very very large \n text content', constraints: AnnotationConstraints.Interaction, }]
                }];
                diagram = new Diagram({
                    width: 800, height: 500, nodes: nodes,
                });
                diagram.appendTo('#NodesAnnotationInteraction1');
                diagramCanvas = document.getElementById(diagram.element.id + 'content');
                mouseEvents.clickEvent(diagramCanvas, 1, 1);
                left = diagram.element.offsetLeft; top = diagram.element.offsetTop;
            });

            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });

            it('Select', (done: Function) => {
                let node: NodeModel = (diagram.nodes[0] as NodeModel);
                let annotation: DiagramElement = node.wrapper.children[1];
                mouseEvents.clickEvent(diagramCanvas, annotation.offsetX + left, annotation.offsetY + top);
                expect((diagram.selectedItems as Selector).annotation !== undefined).toBe(true);
                done();
            });
            it('Drag', (done: Function) => {
                drag(diagram);
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 270 && label.offsetY == 120 && label.width == 100 && label.height == undefined && label.rotateAngle == 0).toBe(true);
                done();
            });
            it('Resize North', (done: Function) => {
                resize(diagram, 'resizeNorth');
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 270 && label.offsetY == 130 && label.width == 92.6875 && label.height == 16 && label.rotateAngle == 0).toBe(true);
                done();
            });
            it('Resize South', (done: Function) => {
                resize(diagram, 'resizeSouth');
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 270 && label.offsetY == 140 && label.width == 92.6875 && label.height == 36 && label.rotateAngle == 0).toBe(true);
                done();
            });
            it('Resize East', (done: Function) => {
                resize(diagram, 'resizeEast');
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 280 && label.offsetY == 140 && label.width == 112.68750000000001 && label.height == 36 && label.rotateAngle == 0).toBe(true);
                done();
            });
            it('Resize West', (done: Function) => {
                resize(diagram, 'resizeWest');
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 290 && label.offsetY == 140 && label.width == 92.68750000000001 && label.height == 36 && label.rotateAngle == 0).toBe(true);
                done();
            });
            it('Rotate', (done: Function) => {
                rotate(diagram);
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 290 && label.offsetY == 140 && label.width == 92.68750000000001 && label.height == 36 && label.rotateAngle == 35).toBe(true);
                done();
            });
            it('Resize North after annotation rotation', (done: Function) => {
                resize(diagram, 'resizeNorth');
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 288.59 && label.offsetY == 142.01 && label.width == 92.68750000000001 && label.height == 31.09 && label.rotateAngle == 35).toBe(true);
                done();
            });
            it('Resize South after annotation rotation', (done: Function) => {
                resize(diagram, 'resizeSouth');
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 287.18 && label.offsetY == 144.02 && label.width == 92.68750000000001 && label.height == 36 && label.rotateAngle == 35).toBe(true);
                done();
            });
            it('Resize East after annotation rotation', (done: Function) => {
                resize(diagram, 'resizeEast');
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 298.59 && label.offsetY == 152.01 && label.width == 120.53750000000001 && label.height == 36 && label.rotateAngle == 35).toBe(true);
                done();
            });
            it('Resize West after annotation rotation', (done: Function) => {
                resize(diagram, 'resizeWest');
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 310 && label.offsetY == 160 && label.width == 92.6875 && label.height == 36 && label.rotateAngle == 35).toBe(true);
                done();
            });
            it('Select and drag after rotation', (done: Function) => {
                mouseEvents.clickEvent(diagramCanvas, 1, 1);
                let node: NodeModel = (diagram.nodes[0] as NodeModel);
                let annotation: DiagramElement = node.wrapper.children[1];
                mouseEvents.clickEvent(diagramCanvas, annotation.offsetX + left, annotation.offsetY + top);
                expect((diagram.selectedItems as Selector).annotation !== undefined).toBe(true);
                drag(diagram);
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 330 && label.offsetY == 180 && label.width == 92.6875 && label.height == 36 && label.rotateAngle == 35).toBe(true);
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
                drag(diagram);
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 215.72 && label.offsetY == 272.58 && label.width == 92.6875 && label.height == 36 && label.rotateAngle == 35).toBe(true);
                done();
            });
            it('Rotation after change node rotation', (done: Function) => {

                rotate(diagram);
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 215.72 && label.offsetY == 272.58 && label.width == 92.6875 && label.height == 36 && label.rotateAngle == 50).toBe(true);
                done();
            });
            it('Resize after change node rotation', (done: Function) => {
                resize(diagram, 'resizeSouth');
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 227.76 && label.offsetY == 276.95 && label.width == 92.6875 && label.height == 10.370000000000001 && label.rotateAngle == 50).toBe(true);
                done();
            });
        });
        describe('Annotation Constraints, Alignment and Wrapping', () => {
            let diagram: Diagram;
            let ele: HTMLElement;
            let mouseEvents: MouseEvents = new MouseEvents();
            let diagramCanvas: HTMLElement; let left: number; let top: number;
            beforeAll((): void => {
                ele = createElement('div', { id: 'NodesAnnotationInteraction2' });
                document.body.appendChild(ele);
                let nodes: NodeModel[] = [{
                    id: 'node2', width: 100, height: 100, offsetX: 200, offsetY: 100,
                    annotations: [{ offset: { x: 1, y: 0.5 }, width: 100, height: 150, content: 'Text Element' }]
                }];
                diagram = new Diagram({
                    width: 800, height: 500, nodes: nodes,
                });
                diagram.appendTo('#NodesAnnotationInteraction2');
                diagramCanvas = document.getElementById(diagram.element.id + 'content');
                mouseEvents.clickEvent(diagramCanvas, 1, 1);
                left = diagram.element.offsetLeft; top = diagram.element.offsetTop;
            });

            afterAll((): void => {
                diagram.destroy();
                ele.remove();
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
                drag(diagram);
                expect((diagram.selectedItems as Selector).annotation == undefined).toBe(true);
                let node: NodeModel = (diagram.nodes[0] as NodeModel);
                let label: DiagramElement = node.wrapper.children[1];
                diagram.nodes[0].annotations[0].constraints = AnnotationConstraints.Select | AnnotationConstraints.Drag;
                mouseEvents.clickEvent(diagramCanvas, label.offsetX + left, label.offsetY + top);
                drag(diagram);
                expect(label.offsetX == 270 && label.offsetY == 120 && label.width == 100 && label.height == 150 && label.rotateAngle == 0).toBe(true);
                done();
            });
            it('Without and with resize constraints', (done: Function) => {
                resize(diagram, 'resizeNorth');
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.width == 100 && label.height == 150).toBe(true);
                diagram.nodes[0].annotations[0].constraints = AnnotationConstraints.Select | AnnotationConstraints.Resize;
                resize(diagram, 'resizeNorth');
                expect(label.offsetX == 290 && label.offsetY == 150 && label.width == 100 && label.height == 130 && label.rotateAngle == 0).toBe(true);
                done();
            });
            it('Without and with rotate constraints', (done: Function) => {
                rotate(diagram);
                expect(diagram.nodes[0].annotations[0].rotateAngle == 0).toBe(true);
                diagram.nodes[0].annotations[0].constraints = AnnotationConstraints.Select | AnnotationConstraints.Rotate;
                let node: NodeModel = (diagram.nodes[0] as NodeModel);
                let label: DiagramElement = node.wrapper.children[1];
                mouseEvents.clickEvent(diagramCanvas, label.offsetX + left, label.offsetY + top);
                rotate(diagram);
                expect(diagram.nodes[0].annotations[0].rotateAngle != 0).toBe(true);
                done();
            });
            it('Without and with interaction constraints', (done: Function) => {
                diagram.nodes[0].annotations[0].offset = { x: 1, y: 0.5 };
                diagram.nodes[0].annotations[0].width = 100;
                diagram.nodes[0].annotations[0].height = 150;
                diagram.nodes[0].annotations[0].constraints = AnnotationConstraints.ReadOnly;
                let node: NodeModel = (diagram.nodes[0] as NodeModel);
                let label: DiagramElement = node.wrapper.children[1];
                mouseEvents.clickEvent(diagramCanvas, label.offsetX + left, label.offsetY + top);
                resize(diagram, 'resizeNorth'); drag(diagram); rotate(diagram);
                expect((diagram.selectedItems as Selector).annotation == undefined);
                diagram.nodes[0].annotations[0].constraints = AnnotationConstraints.Interaction;
                node = (diagram.nodes[0] as NodeModel);
                label = node.wrapper.children[1];
                mouseEvents.clickEvent(diagramCanvas, label.offsetX + left, label.offsetY + top);
                rotate(diagram); resize(diagram, 'resizeNorth'); drag(diagram);
                expect((diagram.selectedItems as Selector).annotation != undefined);
                done();
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
                resize(diagram, 'resizeNorth');
                drag(diagram);
                expect(label.offsetX == 320 && label.offsetY == 197.93 && label.width == 100 && label.height == 144.14 && label.rotateAngle == 0).toBe(true);
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
                resize(diagram, 'resizeNorth');
                drag(diagram);
                expect(label.offsetX == 220 && label.offsetY == 207.93 && label.width == 100 && label.height == 124.13999999999999 && label.rotateAngle == 0).toBe(true);
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
                resize(diagram, 'resizeNorth');
                drag(diagram);
                expect(label.offsetX == 370 && label.offsetY == 217.93 && label.width == 100 && label.height == 104.13999999999999 && label.rotateAngle == 0).toBe(true);
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
                resize(diagram, 'resizeNorth');
                drag(diagram);
                expect(label.offsetX == 270 && label.offsetY == 227.93 && label.width == 100 && label.height == 84.13999999999999 && label.rotateAngle == 0).toBe(true);
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
                resize(diagram, 'resizeNorth');
                drag(diagram);
                expect(label.offsetX == 270 && label.offsetY == 287.93 && label.width == 100 && label.height == 64.13999999999999 && label.rotateAngle == 0).toBe(true);
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
                resize(diagram, 'resizeNorth');
                drag(diagram);
                expect(label.offsetX == 270 && label.offsetY == 197.93 && label.width == 100 && label.height == 44.139999999999986 && label.rotateAngle == 0).toBe(true);
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
                resize(diagram, 'resizeNorth');
                drag(diagram);
                expect(label.offsetX == 270 && label.offsetY == 320.00000000000006 && label.width == 100 && label.height == 24.139999999999986 && label.rotateAngle == 0).toBe(true);
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
                resize(diagram, 'resizeNorth');
                drag(diagram);
                expect(label.offsetX == 270 && label.offsetY == 230 && label.width == 100 && label.height == 80 && label.rotateAngle == 0).toBe(true);
                done();
            });
        });
    });
    describe('Connectors - Annotation Interaction', () => {
        describe('Annotation width and height are undefind', () => {
            let diagram: Diagram;
            let ele: HTMLElement;
            let mouseEvents: MouseEvents = new MouseEvents();
            let diagramCanvas: HTMLElement; let left: number; let top: number;
            beforeAll((): void => {
                ele = createElement('div', { id: 'ConnectorsAnnotationInteraction' });
                document.body.appendChild(ele);
                let connectors: ConnectorModel[] = [{
                    id: 'connector1', sourcePoint: { x: 300, y: 100 }, targetPoint: { x: 400, y: 200 },
                    annotations: [{ id: 'label1', content: "Connector's Annotation interaction", constraints: AnnotationConstraints.Interaction }]
                }];
                diagram = new Diagram({
                    width: 800, height: 500, connectors: connectors
                });
                diagram.appendTo('#ConnectorsAnnotationInteraction');
                diagramCanvas = document.getElementById(diagram.element.id + 'content');
                mouseEvents.clickEvent(diagramCanvas, 1, 1);
                left = diagram.element.offsetLeft; top = diagram.element.offsetTop;
            });

            afterAll((): void => {
                diagram.destroy();
                ele.remove();
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
                drag(diagram);
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 370 && label.offsetY == 170 && label.width == undefined && label.height == undefined && label.rotateAngle == 0).toBe(true);
                done();
            });
            it('Resize North', (done: Function) => {
                resize(diagram, 'resizeNorth');
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 370 && label.offsetY == 180 && label.width == 63.65625 && label.height == 16 && label.rotateAngle == 0).toBe(true);
                done();
            });
            it('Resize South', (done: Function) => {
                resize(diagram, 'resizeSouth');
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 369.99999999999994 && label.offsetY == 189.99999999999994 && label.width == 63.65625 && label.height == 36 && label.rotateAngle == 0).toBe(true);
                done();
            });
            it('Resize East', (done: Function) => {
                resize(diagram, 'resizeEast');
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 380 && label.offsetY == 190 && label.width == 83.65625 && label.height == 36 && label.rotateAngle == 0).toBe(true);
                done();
            });
            it('Resize West', (done: Function) => {
                resize(diagram, 'resizeWest');
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 390 && label.offsetY == 190 && label.width == 63.65625 && label.height == 36 && label.rotateAngle == 0).toBe(true);
                done();
            });
            it('Rotate', (done: Function) => {
                rotate(diagram);
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 390 && label.offsetY == 190 && label.width == 63.65625 && label.height == 36 && label.rotateAngle == 35).toBe(true);
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
                drag(diagram);
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 390 && label.offsetY == 190 && label.width == 63.65625 && label.height == 60 && label.rotateAngle == 35).toBe(true);
                done();
            });
            it('Resize East after annotation rotation', (done: Function) => {
                resize(diagram, 'resizeEast');
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 401.42 && label.offsetY == 198.01 && label.width == 91.50625 && label.height == 60 && label.rotateAngle == 35).toBe(true);
                done();
            });
            it('Resize West after annotation rotation', (done: Function) => {
                resize(diagram, 'resizeWest');
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 412.85 && label.offsetY == 206.02 && label.width == 63.65624999999999 && label.height == 60 && label.rotateAngle == 35).toBe(true);
                done();
            });
            it('Rotate', (done: Function) => {
                rotate(diagram);
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 412.85 && label.offsetY == 206.02 && label.width == 63.65624999999999 && label.height == 60 && label.rotateAngle == 60).toBe(true);
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
                expect(diagram.connectors.length == 2).toBe(true);
                let connector = diagram.connectors[1];
                let label = connector.wrapper.children[3];
                mouseEvents.mouseDownEvent(diagramCanvas, label.offsetX + left, label.offsetY + top + 1);
                mouseEvents.mouseMoveEvent(diagramCanvas, label.offsetX + left, label.offsetY + top + 2);
                mouseEvents.mouseMoveEvent(diagramCanvas, label.offsetX + left, label.offsetY + top + 2);
                mouseEvents.mouseUpEvent(diagramCanvas, label.offsetX + left, label.offsetY + top + 2);
                expect(label.offsetX == 500 && label.offsetY == 182 && label.width == 50 && label.height == 50 && label.rotateAngle == 0).toBe(true);
                done();
            });
            it('Add connector and drag the label based on connectors segment', (done: Function) => {

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
                let connector = diagram.connectors[2];
                let label = connector.wrapper.children[3];
                mouseEvents.mouseDownEvent(diagramCanvas, label.offsetX + left, label.offsetY + top + 1);
                mouseEvents.mouseMoveEvent(diagramCanvas, label.offsetX + left, label.offsetY + top + 2);
                mouseEvents.mouseMoveEvent(diagramCanvas, label.offsetX + left, label.offsetY + top + 2);
                mouseEvents.mouseUpEvent(diagramCanvas, label.offsetX + left, label.offsetY + top + 2);
                expect(label.offsetX == 149.645 && label.offsetY == 152.005 && label.width == 50 && label.height == 50 && label.rotateAngle == 0).toBe(true);
                done();
            });
        });
        describe('Having width and height', () => {
            let diagram: Diagram;
            let ele: HTMLElement;
            let mouseEvents: MouseEvents = new MouseEvents();
            let diagramCanvas: HTMLElement; let left: number; let top: number;
            beforeAll((): void => {
                ele = createElement('div', { id: 'NodesAnnotationInteraction' });
                document.body.appendChild(ele);
                diagram = new Diagram({
                    width: 800, height: 500, connectors: [{
                        id: 'connector1', sourcePoint: { x: 100, y: 100 }, targetPoint: { x: 200, y: 200 }, type: 'Orthogonal',
                        annotations: [{
                            content: 'Path Element', constraints: AnnotationConstraints.Interaction,
                            width: 50, height: 50
                        }]
                    }],
                });
                diagram.appendTo('#NodesAnnotationInteraction');
                diagramCanvas = document.getElementById(diagram.element.id + 'content');
                mouseEvents.clickEvent(diagramCanvas, 1, 1);
                left = diagram.element.offsetLeft; top = diagram.element.offsetTop;
            });

            afterAll((): void => {
                diagram.destroy();
                ele.remove();
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
                drag(diagram);
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 200 && label.offsetY == 140 && label.width == 50 && label.height == 50 && label.rotateAngle == 0).toBe(true);
                done();
            });
            it('Resize North', (done: Function) => {
                resize(diagram, 'resizeNorth');
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 200 && label.offsetY == 150 && label.width == 50 && label.height == 30 && label.rotateAngle == 0).toBe(true);
                done();
            });
            it('Resize South', (done: Function) => {
                resize(diagram, 'resizeSouth');
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 200 && label.offsetY == 160 && label.width == 50 && label.height == 50 && label.rotateAngle == 0).toBe(true);
                done();
            });
            it('Resize East', (done: Function) => {
                resize(diagram, 'resizeEast');
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 210 && label.offsetY == 160 && label.width == 70 && label.height == 50 && label.rotateAngle == 0).toBe(true);
                done();
            });
            it('Resize West', (done: Function) => {
                resize(diagram, 'resizeWest');
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 220 && label.offsetY == 160 && label.width == 50 && label.height == 50 && label.rotateAngle == 0).toBe(true);
                done();
            });
            it('Rotate', (done: Function) => {
                rotate(diagram);
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 220 && label.offsetY == 160 && label.width == 50 && label.height == 50 && label.rotateAngle == 30).toBe(true);
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
                drag(diagram);
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 240 && label.offsetY == 180 && label.width == 50 && label.height == 60 && label.rotateAngle == 30).toBe(true);
                done();
            });
            it('Resize East after annotation rotation', (done: Function) => {
                resize(diagram, 'resizeEast');
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 251.83 && label.offsetY == 186.83 && label.width == 77.32 && label.height == 60 && label.rotateAngle == 30).toBe(true);
                done();
            });
            it('Resize West after annotation rotation', (done: Function) => {
                resize(diagram, 'resizeWest');
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 263.66 && label.offsetY == 193.66 && label.width == 49.99999999999999 && label.height == 60 && label.rotateAngle == 30).toBe(true);
                done();
            });
            it('Rotate', (done: Function) => {
                rotate(diagram);
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 263.66 && label.offsetY == 193.66 && label.width == 49.99999999999999 && label.height == 60 && label.rotateAngle == 55).toBe(true);
                done();
            });
        });
        describe('Annotation Constraints, Alignment and Wrapping', () => {
            let diagram: Diagram;
            let ele: HTMLElement;
            let mouseEvents: MouseEvents = new MouseEvents();
            let diagramCanvas: HTMLElement; let left: number; let top: number;
            beforeAll((): void => {
                ele = createElement('div', { id: 'NodesAnnotationInteraction' });
                document.body.appendChild(ele);
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
                diagram.appendTo('#NodesAnnotationInteraction');
                diagramCanvas = document.getElementById(diagram.element.id + 'content');
                mouseEvents.clickEvent(diagramCanvas, 1, 1);
                left = diagram.element.offsetLeft; top = diagram.element.offsetTop;
            });

            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });

            it('Select - alignment(Center)', (done: Function) => {
                let connector: ConnectorModel = (diagram.connectors[0] as ConnectorModel);
                let annotation: DiagramElement = connector.wrapper.children[3];
                mouseEvents.clickEvent(diagramCanvas, annotation.offsetX + left, annotation.offsetY + top);
                expect((diagram.selectedItems as Selector).connectors.length == 1 &&
                    (diagram.selectedItems as Selector).annotation !== undefined).toBe(true);
                done();
            });
            it('Drag - alignment(Center)', (done: Function) => {
                drag(diagram);
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 200 && label.offsetY == 140 && label.width == 50 && label.height == 50 && label.rotateAngle == 0).toBe(true);
                done();
            });
            it('Resize North - alignment(Center)', (done: Function) => {
                resize(diagram, 'resizeNorth');
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 200 && label.offsetY == 150 && label.width == 50 && label.height == 30 && label.rotateAngle == 0).toBe(true);
                done();
            });
            it('Resize South - alignment(Center)', (done: Function) => {
                resize(diagram, 'resizeSouth');
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 200 && label.offsetY == 160 && label.width == 50 && label.height == 50 && label.rotateAngle == 0).toBe(true);
                done();
            });
            it('Resize East - alignment(Center)', (done: Function) => {
                resize(diagram, 'resizeEast');
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 210 && label.offsetY == 160 && label.width == 70 && label.height == 50 && label.rotateAngle == 0).toBe(true);
                done();
            });
            it('Resize West - alignment(Center)', (done: Function) => {
                resize(diagram, 'resizeWest');
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 220 && label.offsetY == 160 && label.width == 50 && label.height == 50 && label.rotateAngle == 0).toBe(true);
                done();
            });
            it('Rotate - alignment(Center)', (done: Function) => {
                rotate(diagram);
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 220 && label.offsetY == 160 && label.width == 50 && label.height == 50 && label.rotateAngle == 30).toBe(true);
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
                drag(diagram);
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 240 && label.offsetY == 180 && label.width == 50 && label.height == 60 && label.rotateAngle == 30).toBe(true);
                done();
            });
            it('Resize East after annotation rotation - alignment(Center)', (done: Function) => {
                resize(diagram, 'resizeEast');
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 251.83 && label.offsetY == 186.83 && label.width == 77.32 && label.height == 60 && label.rotateAngle == 30).toBe(true);
                done();
            });
            it('Resize West after annotation rotation - alignment(Center)', (done: Function) => {
                resize(diagram, 'resizeWest');
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 263.66 && label.offsetY == 193.66 && label.width == 49.99999999999999 && label.height == 60 && label.rotateAngle == 30).toBe(true);
                done();
            });
            it('Rotate - alignment(Center)', (done: Function) => {
                rotate(diagram);
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 263.66 && label.offsetY == 193.66 && label.width == 49.99999999999999 && label.height == 60 && label.rotateAngle == 55).toBe(true);
                done();
            });
            it('Select - alignment(Before)', (done: Function) => {
                let connector: ConnectorModel = (diagram.connectors[1] as ConnectorModel);
                let annotation: DiagramElement = connector.wrapper.children[3];
                mouseEvents.clickEvent(diagramCanvas, annotation.offsetX + left, annotation.offsetY + top);
                expect((diagram.selectedItems as Selector).connectors.length == 1 &&
                    (diagram.selectedItems as Selector).annotation !== undefined).toBe(true);
                done();
            });
            it('Drag - alignment(Before)', (done: Function) => {
                drag(diagram);
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 400 && label.offsetY == 115 && label.width == 50 && label.height == 50 && label.rotateAngle == 0).toBe(true);
                done();
            });
            it('Resize North - alignment(Before)', (done: Function) => {
                resize(diagram, 'resizeNorth');
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 400 && label.offsetY == 125 && label.width == 50 && label.height == 30 && label.rotateAngle == 0).toBe(true);
                done();
            });
            it('Resize South - alignment(Before)', (done: Function) => {
                resize(diagram, 'resizeSouth');
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 400 && label.offsetY == 135 && label.width == 50 && label.height == 50 && label.rotateAngle == 0).toBe(true);
                done();
            });
            it('Resize East - alignment(Before)', (done: Function) => {
                resize(diagram, 'resizeEast');
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 410 && label.offsetY == 135 && label.width == 70 && label.height == 50 && label.rotateAngle == 0).toBe(true);
                done();
            });
            it('Resize West - alignment(Before)', (done: Function) => {
                resize(diagram, 'resizeWest');
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 420 && label.offsetY == 135 && label.width == 50 && label.height == 50 && label.rotateAngle == 0).toBe(true);
                done();
            });
            it('Rotate - alignment(Before)', (done: Function) => {
                rotate(diagram);
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 420 && label.offsetY == 135 && label.width == 50 && label.height == 50 && label.rotateAngle == 30).toBe(true);
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
                drag(diagram);
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 440 && label.offsetY == 155 && label.width == 50 && label.height == 60 && label.rotateAngle == 30).toBe(true);
                done();
            });
            it('Resize East after annotation rotation - alignment(Before)', (done: Function) => {
                resize(diagram, 'resizeEast');
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 451.83 && label.offsetY == 161.83 && label.width == 77.32 && label.height == 60 && label.rotateAngle == 30).toBe(true);
                done();
            });
            it('Resize West after annotation rotation - alignment(Before)', (done: Function) => {
                resize(diagram, 'resizeWest');
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 463.66 && label.offsetY == 168.66 && label.width == 49.99999999999999 && label.height == 60 && label.rotateAngle == 30).toBe(true);
                done();
            });
            it('Rotate - alignment(Before)', (done: Function) => {
                rotate(diagram);
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 463.66 && label.offsetY == 168.66 && label.width == 49.99999999999999 && label.height == 60 && label.rotateAngle == 55).toBe(true);
                done();
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
                drag(diagram);
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 600 && label.offsetY == 165 && label.width == 50 && label.height == 50 && label.rotateAngle == 0).toBe(true);
                done();
            });
            it('Resize North - alignment(After)', (done: Function) => {
                resize(diagram, 'resizeNorth');
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 600 && label.offsetY == 175 && label.width == 50 && label.height == 30 && label.rotateAngle == 0).toBe(true);
                done();
            });
            it('Resize South - alignment(After)', (done: Function) => {
                resize(diagram, 'resizeSouth');
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 600 && label.offsetY == 185 && label.width == 50 && label.height == 50 && label.rotateAngle == 0).toBe(true);
                done();
            });
            it('Resize East - alignment(After)', (done: Function) => {
                resize(diagram, 'resizeEast');
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 610 && label.offsetY == 185 && label.width == 70 && label.height == 50 && label.rotateAngle == 0).toBe(true);
                done();
            });
            it('Resize West - alignment(After)', (done: Function) => {
                resize(diagram, 'resizeWest');
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 620 && label.offsetY == 185 && label.width == 50 && label.height == 50 && label.rotateAngle == 0).toBe(true);
                done();
            });
            it('Rotate - alignment(After)', (done: Function) => {
                rotate(diagram);
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 620 && label.offsetY == 185 && label.width == 50 && label.height == 50 && label.rotateAngle == 30).toBe(true);
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
                drag(diagram);
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 640 && label.offsetY == 205 && label.width == 50 && label.height == 60 && label.rotateAngle == 30).toBe(true);
                done();
            });
            it('Resize East after annotation rotation - alignment(After)', (done: Function) => {
                resize(diagram, 'resizeEast');
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 651.83 && label.offsetY == 211.83 && label.width == 77.32 && label.height == 60 && label.rotateAngle == 30).toBe(true);
                done();
            });
            it('Resize West after annotation rotation - alignment(After)', (done: Function) => {
                resize(diagram, 'resizeWest');
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 663.66 && label.offsetY == 218.66 && label.width == 49.99999999999999 && label.height == 60 && label.rotateAngle == 30).toBe(true);
                done();
            });
            it('Rotate - alignment(After)', (done: Function) => {
                rotate(diagram);
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 663.66 && label.offsetY == 218.66 && label.width == 49.99999999999999 && label.height == 60 && label.rotateAngle == 55).toBe(true);
                done();
            });
        });
    });
    describe('Annotation Issues', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();
        let diagramCanvas: HTMLElement; let left: number; let top: number;
        beforeAll((): void => {
            ele = createElement('div', { id: 'NodesAnnotationInteraction' });
            document.body.appendChild(ele);
            diagram = new Diagram({
                width: 800, height: 500, nodes: [{
                    id: 'node', offsetX: 100, offsetY: 100, width: 100, height: 100,
                    annotations: [{ id: 'label1', content: "Annotation", constraints: AnnotationConstraints.Interaction }]
                }]
            });
            diagram.appendTo('#NodesAnnotationInteraction');
            diagramCanvas = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 1, 1);
            left = diagram.element.offsetLeft; top = diagram.element.offsetTop;
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Select - alignment(Center)', (done: Function) => {
            diagram.selectAll(); diagram.copy(); diagram.paste();
            diagram.nodes[1].offsetX = 400;
            diagram.dataBind();
            let node: NodeModel = (diagram.nodes[0] as NodeModel);
            let annotation: DiagramElement = node.wrapper.children[1];
            mouseEvents.clickEvent(diagramCanvas, annotation.offsetX + left, annotation.offsetY + top);
            expect((diagram.selectedItems as Selector).nodes.length == 1 &&
                (diagram.selectedItems as Selector).annotation !== undefined &&
                diagram.selectedItems.wrapper.children[0].id === annotation.id).toBe(true);
            let node2: NodeModel = (diagram.nodes[1] as NodeModel);
            let annotation2: DiagramElement = node2.wrapper.children[1];
            mouseEvents.clickEvent(diagramCanvas, annotation2.offsetX + left, annotation2.offsetY + top);
            expect((diagram.selectedItems as Selector).nodes.length == 1 &&
                (diagram.selectedItems as Selector).annotation !== undefined &&
                diagram.selectedItems.wrapper.children[0].id === annotation2.id).toBe(true);
            done();
        });
    });

    describe('Annotation interaction mouse leave ', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();
        let diagramCanvas: HTMLElement; let left: number; let top: number;
        beforeAll((): void => {
            ele = createElement('div', { id: 'NodesAnnotationInteraction2' });
            document.body.appendChild(ele);
            let nodes: NodeModel[] = [{
                id: 'node2', width: 100, height: 100, offsetX: 200, offsetY: 100,
                annotations: [{ offset: { x: 1, y: 0.5 }, constraints: AnnotationConstraints.Interaction, width: 100, height: 150, content: 'Text Element' }]
            }];
            diagram = new Diagram({
                width: 800, height: 500, nodes: nodes,
            });
            diagram.appendTo('#NodesAnnotationInteraction2');
            diagramCanvas = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 1, 1);
            left = diagram.element.offsetLeft; top = diagram.element.offsetTop;
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
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
        let mouseEvents: MouseEvents = new MouseEvents();
        let diagramCanvas: HTMLElement; let left: number; let top: number;
        beforeAll((): void => {
            ele = createElement('div', { id: 'NodesAnnotationInteraction2' });
            document.body.appendChild(ele);
            let nodes: NodeModel[] = [{
                id: 'node2', width: 100, height: 100, offsetX: 200, offsetY: 100,
                annotations: [{ offset: { x: 1, y: 0.5 }, constraints: AnnotationConstraints.Interaction, width: 100, height: 150, content: 'Text Element' }]
            }];
            diagram = new Diagram({
                width: 800, height: 500, nodes: nodes,
            });
            diagram.appendTo('#NodesAnnotationInteraction2');
            diagramCanvas = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 1, 1);
            left = diagram.element.offsetLeft; top = diagram.element.offsetTop;
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });


        it('mouseleave event on Rotation', (done: Function) => {
            let node: NodeModel = (diagram.nodes[0] as NodeModel);
            let annotation: DiagramElement = node.wrapper.children[1];
            mouseEvents.clickEvent(diagramCanvas,annotation.offsetX + left, annotation.offsetY + top)
            mouseEvents.mouseDownEvent(diagramCanvas, annotation.bounds.topCenter.x + left, annotation.bounds.topCenter.y + top - 25);
            mouseEvents.mouseMoveEvent(diagramCanvas, 800, 100);
            mouseEvents.mouseLeaveEvent(diagramCanvas);
            diagram.undo();
            diagram.redo()
            done();
        });
    })
});