/**
 * Annotation interaction - Test Cases
 */
import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { NodeModel, PathModel, } from '../../../src/diagram/objects/node-model';
import { Node } from '../../../src/diagram/objects/node';
import { ConnectorModel } from '../../../src/diagram/objects/connector-model';
import { MouseEvents } from '../interaction/mouseevents.spec';
import { AnnotationConstraints, DiagramConstraints } from '../../../src/diagram/enum/enum';
import { Selector } from '../../../src/diagram/objects/node';
import { DiagramElement } from '../../../src/diagram/core/elements/diagram-element';
import { PointModel } from '../../../src/diagram/primitives/point-model';
import { identityMatrix, rotateMatrix, transformPointByMatrix, Matrix } from '../../../src/diagram/primitives/matrix';
import { Container } from '../../../src/diagram/core/containers/container';
import { UndoRedo } from '../../../src/diagram/objects/undo-redo';
import { profile, inMB, getMemoryProfile } from '../../../spec/common.spec';
import { Snapping } from '../../../src/diagram/objects/snapping';
Diagram.Inject(UndoRedo, Snapping);

function getOutput(label: DiagramElement) {
    var output: string = 'expect(label.offsetX ==' + label.offsetX + '&& label.offsetY ==' + label.offsetY + '&& label.width ==' + label.width + '&& label.height ==' + label.height + '&& label.rotateAngle ==' + label.rotateAngle + ').toBe(true);';
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
        let x: number = Number(element.getAttribute('x'));
        let y: number = Number(element.getAttribute('y'));
        mouseEvents.mouseDownEvent(diagramCanvas, x + diagram.element.offsetLeft, y + diagram.element.offsetTop);
        mouseEvents.mouseMoveEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop);
        mouseEvents.mouseMoveEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop + 20);
        mouseEvents.mouseUpEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop + 20);
    }
}


function rotate(diagram: Diagram, value: number, value2: number) {
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

describe('Diagram Control', () => {
    describe('Nodes - Annotation Interaction', () => {
        describe('Having width and height', () => {
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
                rotate(diagram, 15, undefined);
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 350 && label.offsetY == 300 && label.width == 100 && label.height == 100 && (label.rotateAngle == 20||label.rotateAngle == 15)).toBe(true);
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
                rotate(diagram, 15, undefined);
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
                const isDef = (o: any) => o !== undefined && o !== null;
                if (!isDef(window.performance)) {
                    this.skip(); //Skips test (in Chai)
                    return;
                }
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

                expect(label.offsetX == 270 && label.offsetY == 130 && (Math.floor(label.width) == 92 || Math.ceil(label.width) == 93 || (Math.floor(label.width) >= 95 || Math.floor(label.width) <= 97)) && label.height == 23.199999999999996 && label.rotateAngle == 0).toBe(true);
                done();
            });
            it('Resize South', (done: Function) => {
                resize(diagram, 'resizeSouth');
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];

                expect(label.offsetX == 270 && label.offsetY == 140 && (Math.floor(label.width) == 92 || Math.ceil(label.width) == 93 || (Math.floor(label.width) >= 95 || Math.floor(label.width) <= 97)) && label.height == 43.199999999999996 && label.rotateAngle == 0).toBe(true);
                done();
            });
            it('Resize East', (done: Function) => {
                resize(diagram, 'resizeEast');
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];

                expect(label.offsetX == 280 && label.offsetY == 140 && (Math.floor(label.width) == 112 || Math.ceil(label.width) == 113 || (Math.floor(label.width) >= 114 || Math.floor(label.width) <= 117)) && label.height == 43.199999999999996 && label.rotateAngle == 0).toBe(true);
                done();
            });
            it('Resize West', (done: Function) => {
                resize(diagram, 'resizeWest');
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];

                expect(label.offsetX == 290 && label.offsetY == 140 && (Math.floor(label.width) == 92 || Math.ceil(label.width) == 93 || (Math.floor(label.width) >= 95 || Math.floor(label.width) <= 97)) && label.height == 43.199999999999996 && label.rotateAngle == 0).toBe(true);
                done();
            });
            it('Rotate', (done: Function) => {
                rotate(diagram, 15, undefined);
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 290 && label.offsetY == 140 && (Math.floor(label.width) == 92 || Math.ceil(label.width) == 93 || (Math.floor(label.width) >= 95 || Math.floor(label.width) <= 97)) && label.height == 43.199999999999996 && label.rotateAngle == 30).toBe(true);
                done();
            });
            it('Resize North after annotation rotation', (done: Function) => {
                resize(diagram, 'resizeNorth');
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 288.17 && label.offsetY == 143.17 && (Math.floor(label.width) == 92 || Math.ceil(label.width) == 93 || (Math.floor(label.width) >= 95 || Math.floor(label.width) <= 97)) && label.height == 35.879999999999995 && label.rotateAngle == 30).toBe(true);
                done();
            });
            it('Resize South after annotation rotation', (done: Function) => {
                resize(diagram, 'resizeSouth');
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 286.34 && label.offsetY == 146.34 && (Math.floor(label.width) == 92 || Math.ceil(label.width) == 93 || (Math.floor(label.width) >= 95 || Math.floor(label.width) <= 97)) && label.height == 43.199999999999996 && label.rotateAngle == 30).toBe(true);
                done();
            });
            it('Resize East after annotation rotation', (done: Function) => {
                resize(diagram, 'resizeEast');
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 298.17 && label.offsetY == 153.17 && (Math.floor(label.width) == 120 || Math.ceil(label.width) == 121 || (Math.floor(label.width) >= 122 || Math.floor(label.width) <= 124)) && label.height == 43.199999999999996 && label.rotateAngle == 30).toBe(true);
                done();
            });
            it('Resize West after annotation rotation', (done: Function) => {
                resize(diagram, 'resizeWest');
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 310 && label.offsetY == 160 && (Math.floor(label.width) == 92 || Math.ceil(label.width) == 93 || (Math.floor(label.width) >= 95 || Math.floor(label.width) <= 97)) && label.height == 43.199999999999996 && label.rotateAngle == 30).toBe(true);
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
                expect(label.offsetX == 330 && label.offsetY == 180 && (Math.floor(label.width) == 92 || Math.ceil(label.width) == 93 || (Math.floor(label.width) >= 95 || Math.floor(label.width) <= 97)) && label.height == 43.199999999999996 && label.rotateAngle == 30).toBe(true);
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
                expect(label.offsetX == 215.72 && label.offsetY == 272.58 && (Math.floor(label.width) == 92 || Math.ceil(label.width) == 93 || (Math.floor(label.width) >= 95 || Math.floor(label.width) <= 97)) && label.height == 43.199999999999996 && label.rotateAngle == 30).toBe(true);
                done();
            });
            it('Rotation after change node rotation', (done: Function) => {

                rotate(diagram, 20, undefined);
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 215.72 && label.offsetY == 272.58 && (Math.floor(label.width) == 92 || Math.ceil(label.width) == 93 || (Math.floor(label.width) >= 95 || Math.floor(label.width) <= 97)) && label.height == 43.199999999999996 && label.rotateAngle == 50).toBe(true);
                done();
            });
            it('Resize after change node rotation', (done: Function) => {
                resize(diagram, 'resizeSouth');
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect((label.offsetX == 227.55||label.offsetX == 227.76) && (label.offsetY == 275.75 || label.offsetY == 276.95 )&& (Math.floor(label.width) == 92 || Math.ceil(label.width) == 93 || (Math.floor(label.width) >= 95 || Math.floor(label.width) <= 97)) &&( label.height == 18.709999999999997 || label.height == 17.569999999999997)&& label.rotateAngle == 50).toBe(true);
                done();
            });
        });
        describe('Annotation Constraints, Alignment and Wrapping', () => {
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
                ele = createElement('div', { id: 'NodesAnnotationInteraction2' });
                document.body.appendChild(ele);
                let nodes: NodeModel[] = [{
                    id: 'node2', width: 100, height: 100, offsetX: 200, offsetY: 100,
                    annotations: [{ offset: { x: 1, y: 0.5 }, width: 100, height: 150, content: 'Text Element'}]
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
                rotate(diagram, 20, undefined);
                expect(diagram.nodes[0].annotations[0].rotateAngle == 0).toBe(true);
                diagram.nodes[0].annotations[0].constraints = AnnotationConstraints.Select | AnnotationConstraints.Rotate;
                let node: NodeModel = (diagram.nodes[0] as NodeModel);
                let label: DiagramElement = node.wrapper.children[1];
                mouseEvents.clickEvent(diagramCanvas, label.offsetX + left, label.offsetY + top);
                rotate(diagram, 20, undefined);
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
                resize(diagram, 'resizeNorth'); drag(diagram); rotate(diagram, 20, undefined);;
                expect((diagram.selectedItems as Selector).annotation == undefined);
                diagram.nodes[0].annotations[0].constraints = AnnotationConstraints.Interaction;
                node = (diagram.nodes[0] as NodeModel);
                label = node.wrapper.children[1];
                mouseEvents.clickEvent(diagramCanvas, label.offsetX + left, label.offsetY + top);
                rotate(diagram, 20, undefined); resize(diagram, 'resizeNorth'); drag(diagram);
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
                expect(label.offsetX == 320 && (label.offsetY == 197.93 || Math.ceil(label.offsetY) === 197) && label.width == 100 && (label.height == 144.14 || Math.ceil(label.height) == 147) && label.rotateAngle == 0).toBe(true);
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
                expect(label.offsetX == 220 && (label.offsetY == 207.93 || Math.ceil(label.offsetY) === 207) && label.width == 100 && (label.height == 124.13999999999999 || Math.ceil(label.height) == 127) && label.rotateAngle == 0).toBe(true);
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
                expect(label.offsetX == 370 && (label.offsetY == 217.93 || Math.ceil(label.offsetY) == 217) && label.width == 100 && (label.height == 104.13999999999999 || Math.ceil(label.height) == 107) && label.rotateAngle == 0).toBe(true);
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
                expect(label.offsetX == 270 && (label.offsetY == 227.93 || Math.ceil(label.offsetY) == 227) && label.width == 100 && (label.height == 84.13999999999999 || Math.ceil(label.height) == 87) && label.rotateAngle == 0).toBe(true);
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
                expect(label.offsetX == 270 && (label.offsetY == 287.93 || Math.ceil(label.offsetY) == 287) && label.width == 100 && (label.height == 64.13999999999999 || Math.ceil(label.height) == 67) && label.rotateAngle == 0).toBe(true);
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
                expect(label.offsetX == 270 && (label.offsetY == 197.93 || Math.ceil(label.offsetY) == 197) && label.width == 100 && (label.height == 44.139999999999986 || Math.ceil(label.height) == 47) && label.rotateAngle == 0).toBe(true);
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
                expect(label.offsetX == 270 && (label.offsetY == 320.00000000000006 || Math.ceil(label.offsetY) == 321) && label.width == 100 && (label.height == 24.139999999999986 || Math.ceil(label.height) == 27) && label.rotateAngle == 0).toBe(true);
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
                const isDef = (o: any) => o !== undefined && o !== null;
                if (!isDef(window.performance)) {
                    this.skip(); //Skips test (in Chai)
                    return;
                }
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
                expect(label.offsetX == 370 && label.offsetY == 180 && label.width == 63.65625 && label.height == 23.199999999999996 && label.rotateAngle == 0).toBe(true);
                done();
            });
            it('Resize South', (done: Function) => {
                resize(diagram, 'resizeSouth');
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 369.99999999999994 && label.offsetY == 189.99999999999994 && label.width == 63.65625 && label.height == 43.199999999999996 && label.rotateAngle == 0).toBe(true);
                done();
            });
            it('Resize East', (done: Function) => {
                resize(diagram, 'resizeEast');
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 380 && label.offsetY == 190 && label.width == 83.65625 && label.height == 43.199999999999996 && label.rotateAngle == 0).toBe(true);
                done();
            });
            it('Resize West', (done: Function) => {
                resize(diagram, 'resizeWest');
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 390 && label.offsetY == 190 && label.width == 63.65625 && label.height == 43.199999999999996 && label.rotateAngle == 0).toBe(true);
                done();
            });
            it('Rotate', (done: Function) => {
                rotate(diagram, 15, undefined);
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 390 && label.offsetY == 190 && label.width == 63.65625 && label.height == 43.199999999999996 && label.rotateAngle == 30).toBe(true);
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
                expect(label.offsetX == 390 && label.offsetY == 190 && label.width == 63.65625 && label.height == 60 && label.rotateAngle == 30).toBe(true);
                done();
            });
            it('Resize East after annotation rotation', (done: Function) => {
                resize(diagram, 'resizeEast');
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 401.84 && label.offsetY == 196.83 && label.width == 90.97625 && label.height == 60 && label.rotateAngle == 30).toBe(true);
                done();
            });
            it('Resize West after annotation rotation', (done: Function) => {
                resize(diagram, 'resizeWest');
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 413.67 && label.offsetY == 203.66 && label.width == 63.65624999999999 && label.height == 60 && label.rotateAngle == 30).toBe(true);
                done();
            });
            it('Rotate', (done: Function) => {
                rotate(diagram, 15, undefined);
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 413.67 && label.offsetY == 203.66 && label.width == 63.65624999999999 && label.height == 60 && label.rotateAngle == 55).toBe(true);
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
                const isDef = (o: any) => o !== undefined && o !== null;
                if (!isDef(window.performance)) {
                    this.skip(); //Skips test (in Chai)
                    return;
                }
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
                rotate(diagram, 15, undefined);
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
                rotate(diagram, 15, undefined);
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
                const isDef = (o: any) => o !== undefined && o !== null;
                if (!isDef(window.performance)) {
                    console.log("Unsupported environment, window.performance.memory is unavailable");
                    this.skip(); //Skips test (in Chai)
                    return;
                }
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
                rotate(diagram, 15, undefined);
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
                rotate(diagram, 15, undefined);
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
                rotate(diagram, 15, undefined);
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
                rotate(diagram, 15, undefined);
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
                rotate(diagram, 15, undefined);
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
                rotate(diagram, 15, undefined);
                let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
                expect(label.offsetX == 663.66 && label.offsetY == 218.66 && label.width == 49.99999999999999 && label.height == 60 && label.rotateAngle == 55).toBe(true);
                done();
            });
        });
        describe('Drag Limit', () => {
            let diagram: Diagram;
            let ele: HTMLElement;
            let mouseEvents: MouseEvents = new MouseEvents();
            let diagramCanvas: HTMLElement; let left: number; let top: number;
            beforeAll((): void => {
                const isDef = (o: any) => o !== undefined && o !== null;
                if (!isDef(window.performance)) {
                    console.log("Unsupported environment, window.performance.memory is unavailable");
                    this.skip(); //Skips test (in Chai)
                    return;
                }
                ele = createElement('div', { id: 'NodesAnnotationInteraction' });
                document.body.appendChild(ele);
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
                diagram.appendTo('#NodesAnnotationInteraction');
                diagramCanvas = document.getElementById(diagram.element.id + 'content');
                mouseEvents.clickEvent(diagramCanvas, 1, 1);
                left = diagram.element.offsetLeft; top = diagram.element.offsetTop;
            });

            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });
            it('Drag - alignment(Center)11', function (done) {
                diagramCanvas = document.getElementById(diagram.element.id + 'content');
                mouseEvents.clickEvent(diagramCanvas, 180, 120);
                drag(diagram);
                let label = (diagram.selectedItems.wrapper).children[0];
                expect(label.offsetX == 200 && label.offsetY == 140 && label.width == 50 && label.height == 50 && label.rotateAngle == 0).toBe(true);
                done();
            });
            it('Drag - alignment(Center)111', function (done) {
                // diagramCanvas = document.getElementById(diagram.element.id + 'content');
                // mouseEvents.clickEvent(diagramCanvas, 180, 120);
                diagramCanvas = document.getElementById(diagram.element.id + 'content');
                left = diagram.element.offsetLeft;
                top = diagram.element.offsetTop;
                let mouseEvents = new MouseEvents();
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
        let mouseEvents: MouseEvents = new MouseEvents();
        let diagramCanvas: HTMLElement; let left: number; let top: number;
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
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
    describe('Annotation Issues', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();
        let diagramCanvas: HTMLElement; let left: number; let top: number;
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
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
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
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
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
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
        let mouseEvents: MouseEvents = new MouseEvents();
        let diagramCanvas: HTMLElement; let left: number; let top: number;
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'templateAnnotationInteraction' });
            document.body.appendChild(ele);
            let nodes: NodeModel[] = [{
                id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100,
                annotations: [{ offset: { x: 2, y: 1.5 }, template: '<div style="background:green; height:100%;width:100%;"><div/>', constraints: AnnotationConstraints.Interaction, width: 100, height: 100 }]
            }];
            diagram = new Diagram({
                width: 800, height: 500, nodes: nodes,
            });
            diagram.appendTo('#templateAnnotationInteraction');
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
            expect(label.offsetX == 290 && label.offsetY == 255.00000000000003 && label.width == 100 && label.height == 70 && label.rotateAngle == 0).toBe(true);
            done();
        });
        it('Resize South', (done: Function) => {
            resize(diagram, 'resizeSouth');
            let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
            expect(label.offsetX == 290 && label.offsetY == 270 && label.width == 100 && label.height == 100 && label.rotateAngle == 0).toBe(true);
            done();
        });
        it('Resize East', (done: Function) => {
            resize(diagram, 'resizeEast');
            let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
            expect(label.offsetX == 300 && label.offsetY == 270 && label.width == 120 && label.height == 100 && label.rotateAngle == 0).toBe(true);
            done();
        });
        it('Resize West', (done: Function) => {
            resize(diagram, 'resizeWest');
            let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
            expect(label.offsetX == 309.99999999999994 && label.offsetY == 270 && label.width == 100 && label.height == 100 && label.rotateAngle == 0).toBe(true);
            done();
        });
        it('Resize NorthEast', (done: Function) => {
            resize(diagram, 'resizeNorthEast');
            let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
            expect(label.offsetX == 320 && label.offsetY == 280 && label.width == 120.00000000000006 && label.height == 80 && label.rotateAngle == 0).toBe(true);
            done();
        });
        it('Resize NorthWest', (done: Function) => {
            resize(diagram, 'resizeNorthWest');
            let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
            expect(label.offsetX == 330 && label.offsetY == 290 && label.width == 100.00000000000006 && label.height == 60 && label.rotateAngle == 0).toBe(true);
            done();
        });
        it('Resize SouthEast', (done: Function) => {
            resize(diagram, 'resizeSouthEast');
            let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
            expect(label.offsetX == 340 && label.offsetY == 300 && label.width == 120.00000000000006 && label.height == 80 && label.rotateAngle == 0).toBe(true);
            done();
        });
        it('Resize SouthWest', (done: Function) => {
            resize(diagram, 'resizeSouthWest');
            let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
            expect(label.offsetX == 350 && label.offsetY == 309.99999999999994 && label.width == 100.00000000000006 && label.height == 100 && label.rotateAngle == 0).toBe(true);
            done();
        });
        it('Rotate', (done: Function) => {
            rotate(diagram, 15, undefined);
            let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
            expect(label.offsetX == 350 && label.offsetY == 310 && label.width == 100.00000000000006 && label.height == 100 && label.rotateAngle == 20).toBe(true);
            done();
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
            ele = createElement('div', { id: 'CheckVerticalAlignment' });
            document.body.appendChild(ele);

            let connector: ConnectorModel = {};
            connector.id = "connector1";
            connector.sourcePoint = { x: 350, y: 300 };
            connector.targetPoint = { x: 550, y: 300 };
            connector.annotations = [{ id: "Rbshr", content: "sjdgfhfd", annotationType: "String", constraints: 4, visibility: true, rotateAngle: 0, horizontalAlignment: "Center", verticalAlignment: "Top", margin: { left: 0, right: 0, bottom: 0, top: 0 }, style: { strokeWidth: 0, strokeColor: "transparent", fill: "transparent", strokeDashArray: "", opacity: 1, gradient: { type: "None" }, fontSize: 12, fontFamily: "Arial", textOverflow: "Wrap", textDecoration: "None", whiteSpace: "CollapseSpace", textWrapping: "WrapWithOverflow", textAlign: "Center", color: "black", italic: false, bold: false }, offset: 0.5, alignment: "Center", segmentAngle: false }];

            diagram = new Diagram({
                width: 1000, height: 1000, connectors: [connector]
            });
            diagram.appendTo('#CheckVerticalAlignment');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking connector with annotation verticalAlignment initial checking', () => {
            expect(diagram.connectors[0].annotations[0].verticalAlignment).toEqual('Top');
            let diagramEle = (document.getElementById('CheckVerticalAlignment') as any).ej2_instances[0];
            let txtElement: Element = document.getElementById('connector1_Rbshr');
            expect((txtElement as any).x.animVal.value).toEqual(427.8125);
            expect((txtElement as any).y.animVal.value).toEqual(300.5);
            diagramEle.connectors[0].annotations[0].verticalAlignment = 'Bottom';
            diagramEle.dataBind();
            expect(diagram.connectors[0].annotations[0].verticalAlignment).toEqual('Bottom');
            expect((txtElement as any).x.animVal.value).toEqual(427.8125);
            expect((txtElement as any).y.animVal.value).toEqual(286.1000061035156);
        });
    });
    describe('Annotation undo redo not working properly if the line routing is enabled', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();
        let diagramCanvas: HTMLElement; let left: number; let top: number;
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'templateAnnotationInteraction' });
            document.body.appendChild(ele);
            let node1: NodeModel = {
                id: 'node1', width: 90, height: 40, annotations: [{ content: 'Start' }],
                offsetX: 400, offsetY: 30, shape: { type: 'Flow', shape: 'Terminator' }
            };
            diagram = new Diagram({
                width: 800, height: 500, nodes: [node1],constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting,
            });
            diagram.appendTo('#templateAnnotationInteraction');
            diagramCanvas = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 1, 1);
            left = diagram.element.offsetLeft; top = diagram.element.offsetTop;
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
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
        ele = createElement('div', { id: 'CheckhorizontalAlignment' });
        document.body.appendChild(ele);

        let connector: ConnectorModel = {};
        connector.id = "connector1";
        connector.sourcePoint = { x: 350, y: 300 };
        connector.targetPoint = { x: 550, y: 300 };
        connector.annotations = [{ id: "con1", content: "connector", annotationType: "String", constraints: 4, visibility: true, rotateAngle: 0, horizontalAlignment: "Left", verticalAlignment: "Center", margin: { left: 0, right: 0, bottom: 0, top: 0 }, style: { strokeWidth: 0, strokeColor: "transparent", fill: "transparent", strokeDashArray: "", opacity: 1, gradient: { type: "None" }, fontSize: 12, fontFamily: "Arial", textOverflow: "Wrap", textDecoration: "None", whiteSpace: "CollapseSpace", textWrapping: "WrapWithOverflow", textAlign: "Center", color: "black", italic: false, bold: false }, offset: 0.5, alignment: "Center", segmentAngle: false }];

        diagram = new Diagram({
            width: 1000, height: 1000, connectors: [connector]
        });
        diagram.appendTo('#CheckhorizontalAlignment');
    });

    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });
    it('Checking connector with annotation horizontalAlignment at initial rendering', (done: Function) => {
        expect(diagram.connectors[0].annotations[0].horizontalAlignment).toEqual('Left');
        let diagramEle = (document.getElementById('CheckhorizontalAlignment') as any).ej2_instances[0];
        let txtElement: Element = document.getElementById('connector1_con1');
        expect((txtElement as any).x.animVal.value).toEqual(450.5);
        expect((txtElement as any).y.animVal.value).toEqual(293.29998779296875);
        done();
    });
    it('Checking connector annotation horizontalAlignment by save and load', (done: Function) => {
        savedata = diagram.saveDiagram();
        diagram.clear();
        diagram.loadDiagram(savedata);
        expect(diagram.connectors[0].annotations[0].horizontalAlignment).toEqual('Left');
        let diagramEle = (document.getElementById('CheckhorizontalAlignment') as any).ej2_instances[0];
        let txtElement: Element = document.getElementById('connector1_con1');
        expect((txtElement as any).x.animVal.value).toEqual(450.5);
        expect((txtElement as any).y.animVal.value).toEqual(293.29998779296875);
        done();
    });
});

describe('Check Connector annotation Alignment value ', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let mouseEvents: MouseEvents = new MouseEvents();
    let diagramCanvas: HTMLElement; let left: number; let top: number;
    beforeAll((): void => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
        ele = createElement('div', { id: 'CheckingConnectorAnnotationAlignment' });
        document.body.appendChild(ele);
        let connector1:ConnectorModel = {
            id: 'connector1', type: 'Straight', sourcePoint: { x: 100, y: 100 }, targetPoint: { x: 300, y: 100 }, annotations: [{ content: 'ramkumar', verticalAlignment: 'Bottom', horizontalAlignment: 'Right', constraints:AnnotationConstraints.Interaction | AnnotationConstraints.Drag }]
        };
        let connector2:ConnectorModel = {
            id: 'connector2', type: 'Straight', sourcePoint: { x: 100, y: 200 }, targetPoint: { x: 300, y: 200 }, annotations: [{ content: 'ramkumar', verticalAlignment: 'Bottom', horizontalAlignment: 'Left', constraints: AnnotationConstraints.Interaction |AnnotationConstraints.Drag }]
        };
        let  connector3:ConnectorModel = {
            id: 'connector3', type: 'Straight', sourcePoint: { x: 100, y: 300 }, targetPoint: { x: 300, y: 300 }, annotations: [{ content: 'BOTTOMSIDE', verticalAlignment: 'Bottom', horizontalAlignment: 'Center', constraints:AnnotationConstraints.Interaction | AnnotationConstraints.Drag }]
        };
        let  connector4:ConnectorModel = {
            id: 'connector4', type: 'Straight',sourcePoint: { x: 100, y: 400 }, targetPoint: { x: 300, y: 400 },annotations: [{ content: 'RIGHTSIDE', verticalAlignment: 'Center', horizontalAlignment: 'Right', constraints: AnnotationConstraints.Interaction | AnnotationConstraints.Drag }]
        };
        let connector5:ConnectorModel = {
            id: 'connector5', type: 'Straight',sourcePoint: { x: 100, y: 500 }, targetPoint: { x: 300, y: 500 }, annotations: [{ content: 'LEFTSIDE', verticalAlignment: 'Center', horizontalAlignment: 'Left', constraints: AnnotationConstraints.Interaction | AnnotationConstraints.Drag }]
        };
        let  connector6:ConnectorModel = {
            id: 'connector6', type: 'Straight',sourcePoint: { x: 100, y: 600 }, targetPoint: { x: 300, y: 600 }, annotations: [{ content: 'TOPSIDE', verticalAlignment: 'Top', horizontalAlignment: 'Center', constraints: AnnotationConstraints.Interaction | AnnotationConstraints.Drag }]
        };
        let  connector7:ConnectorModel = {
            id: 'connector7', type: 'Straight', sourcePoint: { x: 100, y: 700 }, targetPoint: { x: 300, y: 700 },annotations: [{ content: 'BOTHCENTER', verticalAlignment: 'Center', horizontalAlignment: 'Center', constraints: AnnotationConstraints.Interaction | AnnotationConstraints.Drag }]
        };
        let  connector8:ConnectorModel = {
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
        diagram = new Diagram({
            width: 1100, height: 1000,
            connectors: [connector1, connector2, connector3, connector4, connector5, connector6,connector7,connector8]
        });
        diagram.appendTo('#CheckingConnectorAnnotationAlignment');
        diagramCanvas = document.getElementById(diagram.element.id + 'content');
        mouseEvents.clickEvent(diagramCanvas, 1, 1);
        left = diagram.element.offsetLeft; top = diagram.element.offsetTop;
    });
    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });
    //Connector Annotation Interaction
    it('Select', (done: Function) => {
        let connector: ConnectorModel = (diagram.connectors[0] as ConnectorModel);
        let annotation: DiagramElement = connector.wrapper.children[3];
        mouseEvents.clickEvent(diagramCanvas,annotation.offsetX + left,annotation.offsetY + top);
        expect((diagram.selectedItems as Selector).connectors.length == 1 &&
            (diagram.selectedItems as Selector).annotation !== undefined).toBe(true);
        done();
    });
    it('Drag', (done: Function) => {
        drag(diagram);
        let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
        expect(Math.round(label.offsetX) == 171 && Math.round(label.offsetY) == 103 ).toBe(true);
        done();
    });
    it('Resize North', (done: Function) => {
        resize(diagram, 'resizeNorth');
        let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
        expect(Math.round(label.offsetX) == 171 && Math.round(label.offsetY) == 113 &&  Math.round(label.width) == 57 &&  Math.round(label.height) == 14 ).toBe(true);
        done();
    });
    it('Resize South', (done: Function) => {
        resize(diagram, 'resizeSouth');
        let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
        expect(Math.round(label.offsetX) == 171 && Math.round(label.offsetY) == 123 &&  Math.round(label.width) ==57 &&  Math.round(label.height) == 34 ).toBe(true);
        done();
    });
    it('Resize East', (done: Function) => {
        resize(diagram, 'resizeEast');
        let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
        expect(Math.round(label.offsetX) == 181 && Math.round(label.offsetY) == 123 &&  Math.round(label.width) == 77 &&  Math.round(label.height) == 34 ).toBe(true);
        done();
    });
    it('Resize West', (done: Function) => {
        resize(diagram, 'resizeWest');
        let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
        expect(Math.round(label.offsetX) == 191 && Math.round(label.offsetY) == 123 &&  Math.round(label.width) == 57 &&  Math.round(label.height) == 34).toBe(true);
        done();
    });
    it('Rotate', (done: Function) => {
        rotate(diagram, 15, undefined);
        let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
        expect(Math.round(label.offsetX) == 191 && Math.round(label.offsetY) == 123 &&  Math.round(label.width) ==57 &&  Math.round(label.height) == 34 && label.rotateAngle == 45).toBe(true);
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
        expect(Math.round(label.offsetX) == 211 && Math.round(label.offsetY) == 130 &&  Math.round(label.width) == 57 &&  Math.round(label.height) == 60 && label.rotateAngle == 45).toBe(true);
        done();
    });
    it('Resize East after annotation rotation', (done: Function) => {
        resize(diagram, 'resizeEast');
        let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
        expect(Math.round(label.offsetX) == 221 && Math.round(label.offsetY) == 140 &&  Math.round(label.width) == 86 &&  Math.round(label.height) == 60 && label.rotateAngle == 45).toBe(true);
        done();
    });
    it('Resize West after annotation rotation', (done: Function) => {
        resize(diagram, 'resizeWest');
        let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
        expect(Math.round(label.offsetX) == 231 && Math.round(label.offsetY) == 150 &&  Math.round(label.width) == 57 &&  Math.round(label.height) == 60 && label.rotateAngle == 45).toBe(true);
        done();
    });
    it('Rotate', (done: Function) => {
        rotate(diagram, 15, undefined);
        let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
        expect(Math.round(label.offsetX) == 231 && Math.round(label.offsetY) == 150 &&  Math.round(label.width) ==57 &&  Math.round(label.height) == 60 && label.rotateAngle == 75).toBe(true);
        done();
    });

});
describe('Check Node annotation Alignment value ', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let mouseEvents: MouseEvents = new MouseEvents();
    let diagramCanvas: HTMLElement; let left: number; let top: number;
    beforeAll((): void => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
        ele = createElement('div', { id: 'CheckingNodeAnnotationAlignment' });
        document.body.appendChild(ele);
        
        let node1:NodeModel = {
            id: 'node1', width: 100, height: 100, offsetX: 200, offsetY: 100,
            annotations: [{ offset: { x: 0.5, y: 0.5 },verticalAlignment:'Center',horizontalAlignment:'Right',width: 100, height: 150,content: 'Text Element' }]
        };
       
        let node2:NodeModel  = {
            id: 'node2', width: 150, height: 60, offsetX: 200, offsetY: 200,
            shape: { type: 'Flow', shape: 'Process' },
            annotations: [{
                    id: 'label2', content: 'start transaction', offset: { x: 0.5, y: 0.5 },
                    verticalAlignment: 'Center', horizontalAlignment: 'Left',
                    constraints:AnnotationConstraints.Interaction | AnnotationConstraints.Drag
                }]
        };
        let node3:NodeModel  = {
            id: 'node3', width: 150, height: 60, offsetX: 200, offsetY: 300,
            shape: { type: 'Flow', shape: 'Decision' },
            annotations: [{
                    id: 'label3', content: 'Verification', offset: { x: 0.5, y: 0.5 },
                    verticalAlignment: 'Bottom', horizontalAlignment: 'Center',
                    constraints: AnnotationConstraints.Interaction | AnnotationConstraints.Drag
                }]
        };
        let node4:NodeModel  = {
            id: 'node4', width: 150, height: 100, offsetX: 200, offsetY: 400,
            shape: { type: 'Flow', shape: 'Decision' },
            annotations: [{
                    id: 'label4', content: 'Credit card Valid', offset: { x: 0.5, y: 0.5 },
                    verticalAlignment: 'Top', horizontalAlignment: 'Center',
                    constraints: AnnotationConstraints.Interaction | AnnotationConstraints.Drag
                }]
        };
        let node5:NodeModel  = {
            id: 'node5', width: 150, height: 60, offsetX: 200, offsetY: 500,
            shape: { type: 'Flow', shape: 'Process' },
            annotations: [{
                    id: 'label5', content: 'Complete Transaction', offset: { x: 0.5, y: 0.5 },
                    verticalAlignment: 'Top', horizontalAlignment: 'Right',
                    constraints: AnnotationConstraints.Interaction | AnnotationConstraints.Drag
                }]
        };
        let node6:NodeModel  = {
            id: 'node6', width: 250, height: 60, offsetX: 500, offsetY: 300,
            shape: { type: 'Flow', shape: 'Card' },
            annotations: [{
                    id: 'label6', content: 'Email', offset: { x: 0.5, y: 0.5 },
                    verticalAlignment: 'Top', horizontalAlignment: 'Left',
                    constraints: AnnotationConstraints.Interaction | AnnotationConstraints.Drag
                }]
        };
        let node7:NodeModel  = {
            id: 'node7', width: 150, height: 60, offsetX: 500, offsetY: 400,
            shape: { type: 'Flow', shape: 'Process' },
            annotations: [{
                    id: 'label7', content: 'Custom Database', offset: { x: 0.5, y: 0.5 },
                    verticalAlignment: 'Bottom', horizontalAlignment: 'Right',
                    constraints: AnnotationConstraints.Interaction | AnnotationConstraints.Drag
                }]
        };
        let node8:NodeModel  = {
            id: 'node8', width: 150, height: 60, offsetX: 500, offsetY: 500,
            shape: { type: 'Flow', shape: 'Process' },
            annotations: [{
                    id: 'label8', content: 'Log Transaction', offset: { x: 0.5, y: 0.5 },
                    verticalAlignment: 'Bottom', horizontalAlignment: 'Left',
                    constraints: AnnotationConstraints.Interaction |AnnotationConstraints.Drag
                }]
        };
        diagram = new Diagram({
            width: 1100, height: 1000, nodes: [node1, node2, node3, node4, node5, node6, node7, node8],
        });
        diagram.appendTo('#CheckingNodeAnnotationAlignment');
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
        diagram.nodes[0].annotations[0].constraints =  AnnotationConstraints.Interaction  | AnnotationConstraints.Drag;
        mouseEvents.clickEvent(diagramCanvas, label.offsetX + left, label.offsetY + top);
        drag(diagram);
        expect(label.offsetX == 170 && label.offsetY == 120 && label.width == 100 && label.height == 150 && label.rotateAngle == 0).toBe(true);
        done();
    });
    it('Without and with resize constraints', (done: Function) => {
        resize(diagram, 'resizeNorth');
        let label = (((diagram.selectedItems as Selector).wrapper) as Container).children[0];
        diagram.nodes[0].annotations[0].constraints =  AnnotationConstraints.Interaction  | AnnotationConstraints.Resize;
        resize(diagram, 'resizeNorth');
        expect(label.offsetX == 170 && label.offsetY == 140  && label.rotateAngle == 0).toBe(true);
        done();
    });
    it('Without and with rotate constraints', (done: Function) => {
        rotate(diagram, 20, undefined);
        diagram.nodes[0].annotations[0].constraints = AnnotationConstraints.Interaction  | AnnotationConstraints.Rotate;
        let node: NodeModel = (diagram.nodes[0] as NodeModel);
        let label: DiagramElement = node.wrapper.children[1];
        mouseEvents.clickEvent(diagramCanvas, label.offsetX + left, label.offsetY + top);
        rotate(diagram, 20, undefined);
        expect(diagram.nodes[0].annotations[0].rotateAngle != 0).toBe(true);
        done();
    });
});


describe('Hyperlink Link target',()=>{
    let diagram: Diagram;
    let ele: HTMLElement;
    let diagramCanvas: HTMLElement;
    let savedata: string;
    let mouseEvents: MouseEvents = new MouseEvents();

    beforeAll((): void => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
        ele = createElement('div', { id: 'Hyperlink' });
        document.body.appendChild(ele);
        let nodes:NodeModel[] = [
            {
                id:'node1',height:100,width:100,offsetX:50,offsetY:50,
                annotations:[{hyperlink:{link:'https://www.google.com',hyperlinkOpenState:'NewTab'}}]
            }
        ];
        diagram = new Diagram({
            width:1000,height:1000,nodes:nodes
        });
        diagram.appendTo('#Hyperlink');
    });
    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });

    it('Checking hyperlinkOpenState value at initial rendering',(done:Function)=>{
        let hyperlinkOpenState = diagram.nodes[0].annotations[0].hyperlink.hyperlinkOpenState;
        diagramCanvas = document.getElementById(diagram.element.id + 'content');
        mouseEvents.mouseDownEvent(diagramCanvas,50,50);
        mouseEvents.mouseUpEvent(diagramCanvas,50,50);
        expect(hyperlinkOpenState=='NewTab').toBe(true);
        console.log('Hyperlink value at initial rendering is '+hyperlinkOpenState)
        done();
    });

    it('Changing hyperlinkOpenState value to NewWindow at runtime',(done:Function)=>{
        let hyperlinkOpenState = diagram.nodes[0].annotations[0].hyperlink.hyperlinkOpenState
        hyperlinkOpenState = 'NewWindow';
        diagramCanvas = document.getElementById(diagram.element.id + 'content');
        mouseEvents.mouseDownEvent(diagramCanvas,50,50);
        mouseEvents.mouseUpEvent(diagramCanvas,50,50);
        expect(hyperlinkOpenState=='NewWindow').toBe(true);
        console.log('Hyperlink value changed to '+hyperlinkOpenState+' at runtime');
        done();
    });

    it('Changing hyperlinkOpenState value to CurrentTab at runtime',(done:Function)=>{
        let hyperlinkOpenState = diagram.nodes[0].annotations[0].hyperlink.hyperlinkOpenState
        hyperlinkOpenState ='CurrentTab';
        diagramCanvas = document.getElementById(diagram.element.id + 'content');
        mouseEvents.mouseDownEvent(diagramCanvas,50,50);
        mouseEvents.mouseUpEvent(diagramCanvas,50,50);
        expect(hyperlinkOpenState=='CurrentTab').toBe(true);
        console.log('Hyperlink value changed to '+hyperlinkOpenState+' at runtime');
        done();
    });
});

describe('Bezier annotation alignment is not working properly',()=>{
    let diagram: Diagram;
    let ele: HTMLElement;

    beforeAll((): void => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
        ele = createElement('div', { id: 'BezAnnotationAlignment' });
        document.body.appendChild(ele);
        let connectors:ConnectorModel[] = [
            {
                id: 'connector1',type:'Bezier', sourcePoint: { x: 100, y: 200 }, targetPoint: { x: 300, y: 300 },
                 annotations: [ {content: 'annot1',horizontalAlignment:'Center',verticalAlignment:'Bottom'}]
            },
        ];
        diagram = new Diagram({
            width:1000,height:1000,connectors:connectors
        });
        diagram.appendTo('#BezAnnotationAlignment');
    });
    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });
    it('Checking bezier annotation alignment at initial rendering',(done:Function)=>{
        let connector = diagram.connectors[0];
        expect(Math.round(connector.wrapper.children[3].bounds.x) === 175 && 
        Math.round(connector.wrapper.children[3].bounds.y) === 231).toBe(true);
        done();
    });
    it('Checking bezier annotation alignment after changing it at runtime',(done:Function)=>{
        let connector = diagram.connectors[0];
        connector.annotations[0].horizontalAlignment = 'Right';
        connector.annotations[0].verticalAlignment = 'Top';
        diagram.dataBind();
        expect(Math.round(connector.wrapper.children[3].bounds.x) === 155 && 
        Math.round(connector.wrapper.children[3].bounds.y) === 246).toBe(true);
        done();
    });

});

describe('Double click on node annotation will open the edit of invisible annotation', () => {
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
        ele = createElement('div', { id: 'DoubleClick' });
        document.body.appendChild(ele);
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
        diagram.appendTo('#DoubleClick');
        diagramCanvas = document.getElementById(diagram.element.id + 'content');
        mouseEvents.clickEvent(diagramCanvas, 1, 1);
        left = diagram.element.offsetLeft; top = diagram.element.offsetTop;
    });

    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });

    it('Double Click node', (done: Function) => {
      //  let node: NodeModel = (diagram.nodes[0] as NodeModel);
        mouseEvents.dblclickEvent(diagramCanvas, 100, 100);
        expect((diagram.selectedItems as Selector).annotation !== undefined).toBe(false);
        diagram.nodes[0].annotations = [{content : 'node2', visibility : true}];
        mouseEvents.dblclickEvent(diagramCanvas, 100, 100);
        expect((diagram.selectedItems as Selector).annotation !== undefined).toBe(true);
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
            ele = createElement('div', { id: 'NodesAnnotationInteraction' });
            document.body.appendChild(ele);
            let nodes: NodeModel[] = [{
                id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100,
                annotations: [{ offset: { x: 2, y: 1.5 }, content: 'node1', constraints: AnnotationConstraints.Interaction, width: 100, height: 100 }]
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
        ele = createElement('div', { id: 'CheckhorizontalAlignment' });
        document.body.appendChild(ele);
        diagram = new Diagram({
            width: 1000, height: 1000,
        });
        diagram.appendTo('#CheckhorizontalAlignment');
    });

    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });

    function numbersinranges(x: number, r: number, t: number) {
        if ((x >= r && x <= t)) {
            return true;
        }
        else {
            return false;
        }
    }

    it('After Save and Load', (done: Function) => {
        let data = `{
            "width": "100%",
            "height": "100%",
            "nodes": [{
                    "shape": {
                        "type": "Flow",
                        "shape": "Process"
                    },
                    "ports": [],
                    "id": "Títulof3rS2",
                    "width": 2339.9999999999995,
                    "height": 35,
                    "style": {
                        "fill": "rgba(179,157,219,1)",
                        "strokeWidth": 2,
                        "strokeColor": "#3A3A3A",
                        "strokeDashArray": "",
                        "opacity": 1,
                        "gradient": {
                            "type": "None"
                        }
                    },
                    "annotations": [{
                            "id": "vVGcB",
                            "content": "Realizar Análise de Esteira de Proposta ",
                            "annotationType": "String",
                            "style": {
                                "strokeWidth": 0,
                                "strokeColor": "transparent",
                                "fill": "transparent",
                                "bold": false,
                                "textWrapping": "WrapWithOverflow",
                                "color": "black",
                                "whiteSpace": "CollapseSpace",
                                "fontFamily": "Arial",
                                "fontSize": 12,
                                "italic": false,
                                "opacity": 1,
                                "strokeDashArray": "",
                                "textAlign": "Center",
                                "textOverflow": "Wrap",
                                "textDecoration": "None"
                            },
                            "hyperlink": {
                                "link": "",
                                "content": "",
                                "textDecoration": "None"
                            },
                            "constraints": 4,
                            "visibility": true,
                            "rotateAngle": 0,
                            "margin": {
                                "right": 0,
                                "bottom": 0,
                                "left": 0,
                                "top": 0
                            },
                            "horizontalAlignment": "Center",
                            "verticalAlignment": "Center",
                            "offset": {
                                "x": 0.5,
                                "y": 0.5
                            }
                        }
                    ],
                    "container": null,
                    "offsetX": 1270,
                    "offsetY": -336.5,
                    "visible": true,
                    "horizontalAlignment": "Left",
                    "verticalAlignment": "Top",
                    "backgroundColor": "transparent",
                    "borderColor": "none",
                    "borderWidth": 0,
                    "rotateAngle": 0,
                    "pivot": {
                        "x": 0.5,
                        "y": 0.5
                    },
                    "margin": {
                        "top": 0,
                        "left": 0
                    },
                    "flip": "None",
                    "wrapper": {
                        "actualSize": {
                            "width": 2339.9999999999995,
                            "height": 35
                        },
                        "offsetX": 1270,
                        "offsetY": -336.5
                    },
                    "constraints": 5240430,
                    "previewSize": {},
                    "dragSize": {},
                    "zIndex": 3,
                    "isExpanded": true,
                    "expandIcon": {
                        "shape": "None"
                    },
                    "fixedUserHandles": [],
                    "tooltip": {
                        "openOn": "Auto"
                    },
                    "inEdges": [],
                    "outEdges": [],
                    "parentId": "",
                    "processId": "",
                    "umlIndex": -1,
                    "isPhase": false,
                    "isLane": false
                }, {
                    "shape": {
                        "type": "Bpmn",
                        "shape": "Event",
                        "event": {
                            "event": "Start",
                            "trigger": "Timer"
                        },
                        "annotations": [],
                        "activity": {
                            "subProcess": {}
                        }
                    },
                    "ports": [{
                            "inEdges": [],
                            "outEdges": [],
                            "offset": {
                                "x": 0,
                                "y": 0.5
                            },
                            "visibility": 12,
                            "constraints": 28,
                            "id": "B8E3A",
                            "height": 12,
                            "width": 12,
                            "shape": "Square",
                            "margin": {
                                "left": 0,
                                "top": 0,
                                "right": 0,
                                "bottom": 0
                            },
                            "style": {
                                "fill": "white",
                                "strokeColor": "black",
                                "opacity": 1,
                                "strokeDashArray": "",
                                "strokeWidth": 1
                            },
                            "horizontalAlignment": "Center",
                            "verticalAlignment": "Center"
                        }, {
                            "inEdges": [],
                            "outEdges": ["connectorqvrHT"],
                            "offset": {
                                "x": 1,
                                "y": 0.5
                            },
                            "visibility": 12,
                            "constraints": 28,
                            "id": "wAPsD",
                            "height": 12,
                            "width": 12,
                            "shape": "Square",
                            "margin": {
                                "left": 0,
                                "top": 0,
                                "right": 0,
                                "bottom": 0
                            },
                            "style": {
                                "fill": "white",
                                "strokeColor": "black",
                                "opacity": 1,
                                "strokeDashArray": "",
                                "strokeWidth": 1
                            },
                            "horizontalAlignment": "Center",
                            "verticalAlignment": "Center"
                        }, {
                            "inEdges": [],
                            "outEdges": [],
                            "offset": {
                                "x": 0.25,
                                "y": 0
                            },
                            "visibility": 12,
                            "constraints": 28,
                            "id": "oBm0n",
                            "height": 12,
                            "width": 12,
                            "shape": "Square",
                            "margin": {
                                "left": 0,
                                "top": 0,
                                "right": 0,
                                "bottom": 0
                            },
                            "style": {
                                "fill": "white",
                                "strokeColor": "black",
                                "opacity": 1,
                                "strokeDashArray": "",
                                "strokeWidth": 1
                            },
                            "horizontalAlignment": "Center",
                            "verticalAlignment": "Center"
                        }, {
                            "inEdges": [],
                            "outEdges": [],
                            "offset": {
                                "x": 0.75,
                                "y": 0
                            },
                            "visibility": 12,
                            "constraints": 28,
                            "id": "Kwtrd",
                            "height": 12,
                            "width": 12,
                            "shape": "Square",
                            "margin": {
                                "left": 0,
                                "top": 0,
                                "right": 0,
                                "bottom": 0
                            },
                            "style": {
                                "fill": "white",
                                "strokeColor": "black",
                                "opacity": 1,
                                "strokeDashArray": "",
                                "strokeWidth": 1
                            },
                            "horizontalAlignment": "Center",
                            "verticalAlignment": "Center"
                        }, {
                            "inEdges": [],
                            "outEdges": [],
                            "offset": {
                                "x": 0.25,
                                "y": 1
                            },
                            "visibility": 12,
                            "constraints": 28,
                            "id": "m8MEL",
                            "height": 12,
                            "width": 12,
                            "shape": "Square",
                            "margin": {
                                "left": 0,
                                "top": 0,
                                "right": 0,
                                "bottom": 0
                            },
                            "style": {
                                "fill": "white",
                                "strokeColor": "black",
                                "opacity": 1,
                                "strokeDashArray": "",
                                "strokeWidth": 1
                            },
                            "horizontalAlignment": "Center",
                            "verticalAlignment": "Center"
                        }, {
                            "inEdges": [],
                            "outEdges": [],
                            "offset": {
                                "x": 0.75,
                                "y": 1
                            },
                            "visibility": 12,
                            "constraints": 28,
                            "id": "aQGuK",
                            "height": 12,
                            "width": 12,
                            "shape": "Square",
                            "margin": {
                                "left": 0,
                                "top": 0,
                                "right": 0,
                                "bottom": 0
                            },
                            "style": {
                                "fill": "white",
                                "strokeColor": "black",
                                "opacity": 1,
                                "strokeDashArray": "",
                                "strokeWidth": 1
                            },
                            "horizontalAlignment": "Center",
                            "verticalAlignment": "Center"
                        }
                    ],
                    "id": "Iniciar-cronômetroP0cfO",
                    "width": 35,
                    "height": 35,
                    "style": {
                        "fill": "rgba(178,223,219,1)",
                        "strokeWidth": 2,
                        "strokeColor": "#004d40ff",
                        "strokeDashArray": "",
                        "opacity": 1,
                        "gradient": {
                            "type": "None"
                        }
                    },
                    "container": null,
                    "offsetX": 197.5,
                    "offsetY": 417.4999999999999,
                    "visible": true,
                    "horizontalAlignment": "Left",
                    "verticalAlignment": "Top",
                    "backgroundColor": "transparent",
                    "borderColor": "none",
                    "borderWidth": 0,
                    "rotateAngle": 0,
                    "pivot": {
                        "x": 0.5,
                        "y": 0.5
                    },
                    "margin": {},
                    "flip": "None",
                    "wrapper": {
                        "actualSize": {
                            "width": 35,
                            "height": 35
                        },
                        "offsetX": 197.5,
                        "offsetY": 417.4999999999999
                    },
                    "constraints": 5240814,
                    "previewSize": {},
                    "dragSize": {},
                    "zIndex": 16,
                    "annotations": [{
                            "id": "dTM79",
                            "content": "",
                            "annotationType": "String",
                            "style": {
                                "strokeWidth": 0,
                                "strokeColor": "transparent",
                                "fill": "transparent",
                                "bold": false,
                                "textWrapping": "WrapWithOverflow",
                                "color": "black",
                                "whiteSpace": "CollapseSpace",
                                "fontFamily": "Arial",
                                "fontSize": 12,
                                "italic": false,
                                "opacity": 1,
                                "strokeDashArray": "",
                                "textAlign": "Center",
                                "textOverflow": "Wrap",
                                "textDecoration": "None"
                            },
                            "hyperlink": {
                                "link": "",
                                "content": "",
                                "textDecoration": "None"
                            },
                            "constraints": 4,
                            "visibility": true,
                            "rotateAngle": 0,
                            "margin": {
                                "left": 0,
                                "top": 0,
                                "right": 0,
                                "bottom": 0
                            },
                            "horizontalAlignment": "Center",
                            "verticalAlignment": "Center",
                            "offset": {
                                "x": 0.5,
                                "y": 0.5
                            }
                        }
                    ],
                    "isExpanded": true,
                    "expandIcon": {
                        "shape": "None"
                    },
                    "fixedUserHandles": [],
                    "tooltip": {
                        "openOn": "Auto"
                    },
                    "inEdges": [],
                    "outEdges": ["connectorqvrHT"],
                    "parentId": "",
                    "processId": "",
                    "umlIndex": -1,
                    "isPhase": false,
                    "isLane": false
                }, {
                    "shape": {
                        "type": "Text",
                        "content": "Diariamente ",
                        "margin": {
                            "left": 0,
                            "top": 0,
                            "right": 0,
                            "bottom": 0
                        }
                    },
                    "ports": [],
                    "style": {
                        "fill": "none",
                        "strokeColor": "none",
                        "strokeWidth": 1,
                        "strokeDashArray": "2 2",
                        "opacity": 1,
                        "gradient": {
                            "type": "None"
                        },
                        "fontSize": 12,
                        "fontFamily": "Arial",
                        "textOverflow": "Wrap",
                        "textDecoration": "None",
                        "whiteSpace": "CollapseSpace",
                        "textWrapping": "WrapWithOverflow",
                        "textAlign": "Center",
                        "color": "black",
                        "italic": false,
                        "bold": false
                    },
                    "offsetX": 198,
                    "width": 86,
                    "height": 16.875,
                    "offsetY": 443.55,
                    "id": "nodeNlPn3",
                    "zIndex": 17,
                    "container": null,
                    "visible": true,
                    "horizontalAlignment": "Left",
                    "verticalAlignment": "Top",
                    "backgroundColor": "transparent",
                    "borderColor": "none",
                    "borderWidth": 0,
                    "rotateAngle": 0,
                    "pivot": {
                        "x": 0.5,
                        "y": 0.5
                    },
                    "margin": {
                        "top": 0,
                        "left": 0
                    },
                    "flip": "None",
                    "wrapper": {
                        "actualSize": {
                            "width": 86,
                            "height": 16.875
                        },
                        "offsetX": 198,
                        "offsetY": 443.55
                    },
                    "constraints": 5240814,
                    "annotations": [],
                    "isExpanded": true,
                    "expandIcon": {
                        "shape": "None"
                    },
                    "fixedUserHandles": [],
                    "tooltip": {
                        "openOn": "Auto"
                    },
                    "inEdges": [],
                    "outEdges": [],
                    "parentId": "",
                    "processId": "",
                    "umlIndex": -1,
                    "isPhase": false,
                    "isLane": false
                }, {
                    "shape": {
                        "type": "Bpmn",
                        "shape": "Activity",
                        "activity": {
                            "activity": "Task",
                            "subProcess": {
                                "type": "None",
                                "collapsed": true
                            },
                            "task": {
                                "call": false,
                                "compensation": false,
                                "loop": "None",
                                "type": "None"
                            }
                        },
                        "annotations": []
                    },
                    "ports": [{
                            "inEdges": ["connectorqvrHT"],
                            "outEdges": [],
                            "offset": {
                                "x": 0,
                                "y": 0.5
                            },
                            "visibility": 12,
                            "constraints": 28,
                            "id": "KUG1O",
                            "height": 12,
                            "width": 12,
                            "shape": "Square",
                            "margin": {
                                "left": 0,
                                "top": 0,
                                "right": 0,
                                "bottom": 0
                            },
                            "style": {
                                "fill": "white",
                                "strokeColor": "black",
                                "opacity": 1,
                                "strokeDashArray": "",
                                "strokeWidth": 1
                            },
                            "horizontalAlignment": "Center",
                            "verticalAlignment": "Center"
                        }, {
                            "inEdges": [],
                            "outEdges": ["connectorK89KV"],
                            "offset": {
                                "x": 1,
                                "y": 0.5
                            },
                            "visibility": 12,
                            "constraints": 28,
                            "id": "IETOA",
                            "height": 12,
                            "width": 12,
                            "shape": "Square",
                            "margin": {
                                "left": 0,
                                "top": 0,
                                "right": 0,
                                "bottom": 0
                            },
                            "style": {
                                "fill": "white",
                                "strokeColor": "black",
                                "opacity": 1,
                                "strokeDashArray": "",
                                "strokeWidth": 1
                            },
                            "horizontalAlignment": "Center",
                            "verticalAlignment": "Center"
                        }, {
                            "inEdges": [],
                            "outEdges": [],
                            "offset": {
                                "x": 0.25,
                                "y": 0
                            },
                            "visibility": 12,
                            "constraints": 28,
                            "id": "QBbar",
                            "height": 12,
                            "width": 12,
                            "shape": "Square",
                            "margin": {
                                "left": 0,
                                "top": 0,
                                "right": 0,
                                "bottom": 0
                            },
                            "style": {
                                "fill": "white",
                                "strokeColor": "black",
                                "opacity": 1,
                                "strokeDashArray": "",
                                "strokeWidth": 1
                            },
                            "horizontalAlignment": "Center",
                            "verticalAlignment": "Center"
                        }, {
                            "inEdges": [],
                            "outEdges": [],
                            "offset": {
                                "x": 0.75,
                                "y": 0
                            },
                            "visibility": 12,
                            "constraints": 28,
                            "id": "Fsrkc",
                            "height": 12,
                            "width": 12,
                            "shape": "Square",
                            "margin": {
                                "left": 0,
                                "top": 0,
                                "right": 0,
                                "bottom": 0
                            },
                            "style": {
                                "fill": "white",
                                "strokeColor": "black",
                                "opacity": 1,
                                "strokeDashArray": "",
                                "strokeWidth": 1
                            },
                            "horizontalAlignment": "Center",
                            "verticalAlignment": "Center"
                        }, {
                            "inEdges": [],
                            "outEdges": [],
                            "offset": {
                                "x": 0.25,
                                "y": 1
                            },
                            "visibility": 12,
                            "constraints": 28,
                            "id": "DNeat",
                            "height": 12,
                            "width": 12,
                            "shape": "Square",
                            "margin": {
                                "left": 0,
                                "top": 0,
                                "right": 0,
                                "bottom": 0
                            },
                            "style": {
                                "fill": "white",
                                "strokeColor": "black",
                                "opacity": 1,
                                "strokeDashArray": "",
                                "strokeWidth": 1
                            },
                            "horizontalAlignment": "Center",
                            "verticalAlignment": "Center"
                        }, {
                            "inEdges": [],
                            "outEdges": [],
                            "offset": {
                                "x": 0.75,
                                "y": 1
                            },
                            "visibility": 12,
                            "constraints": 28,
                            "id": "MDGIe",
                            "height": 12,
                            "width": 12,
                            "shape": "Square",
                            "margin": {
                                "left": 0,
                                "top": 0,
                                "right": 0,
                                "bottom": 0
                            },
                            "style": {
                                "fill": "white",
                                "strokeColor": "black",
                                "opacity": 1,
                                "strokeDashArray": "",
                                "strokeWidth": 1
                            },
                            "horizontalAlignment": "Center",
                            "verticalAlignment": "Center"
                        }
                    ],
                    "id": "Tarefadn24E",
                    "width": 130,
                    "height": 65,
                    "style": {
                        "fill": "rgba(227,242,253,1)",
                        "strokeWidth": 2,
                        "strokeColor": "#0d47a1ff",
                        "strokeDashArray": "",
                        "opacity": 1,
                        "gradient": {
                            "type": "None"
                        }
                    },
                    "container": null,
                    "offsetX": 323,
                    "offsetY": 417.4875,
                    "visible": true,
                    "horizontalAlignment": "Left",
                    "verticalAlignment": "Top",
                    "backgroundColor": "transparent",
                    "borderColor": "none",
                    "borderWidth": 0,
                    "rotateAngle": 0,
                    "pivot": {
                        "x": 0.5,
                        "y": 0.5
                    },
                    "margin": {},
                    "flip": "None",
                    "wrapper": {
                        "actualSize": {
                            "width": 130,
                            "height": 65
                        },
                        "offsetX": 323,
                        "offsetY": 417.4875
                    },
                    "constraints": 5240814,
                    "previewSize": {},
                    "dragSize": {},
                    "zIndex": 18,
                    "annotations": [{
                            "id": "ggFOO",
                            "content": "Acessar sistema dos Bancos",
                            "annotationType": "String",
                            "style": {
                                "strokeWidth": 0,
                                "strokeColor": "transparent",
                                "fill": "transparent",
                                "bold": false,
                                "textWrapping": "WrapWithOverflow",
                                "color": "black",
                                "whiteSpace": "CollapseSpace",
                                "fontFamily": "Arial",
                                "fontSize": 12,
                                "italic": false,
                                "opacity": 1,
                                "strokeDashArray": "",
                                "textAlign": "Center",
                                "textOverflow": "Wrap",
                                "textDecoration": "None"
                            },
                            "hyperlink": {
                                "link": "",
                                "content": "",
                                "textDecoration": "None"
                            },
                            "constraints": 4,
                            "visibility": true,
                            "rotateAngle": 0,
                            "margin": {
                                "left": 0,
                                "top": 0,
                                "right": 0,
                                "bottom": 0
                            },
                            "horizontalAlignment": "Center",
                            "verticalAlignment": "Center",
                            "offset": {
                                "x": 0.5,
                                "y": 0.5
                            }
                        }
                    ],
                    "isExpanded": true,
                    "expandIcon": {
                        "shape": "None"
                    },
                    "fixedUserHandles": [],
                    "tooltip": {
                        "openOn": "Auto"
                    },
                    "inEdges": ["connectorqvrHT"],
                    "outEdges": ["connectorK89KV"],
                    "parentId": "",
                    "processId": "",
                    "umlIndex": -1,
                    "isPhase": false,
                    "isLane": false
                }, {
                    "shape": {
                        "type": "Bpmn",
                        "shape": "Activity",
                        "activity": {
                            "activity": "Task",
                            "subProcess": {
                                "type": "None",
                                "collapsed": true
                            },
                            "task": {
                                "call": false,
                                "compensation": false,
                                "loop": "None",
                                "type": "None"
                            }
                        },
                        "annotations": []
                    },
                    "ports": [{
                            "inEdges": [],
                            "outEdges": [],
                            "offset": {
                                "x": 0,
                                "y": 0.5
                            },
                            "visibility": 12,
                            "constraints": 28,
                            "id": "xqMUb",
                            "height": 12,
                            "width": 12,
                            "shape": "Square",
                            "margin": {
                                "left": 0,
                                "top": 0,
                                "right": 0,
                                "bottom": 0
                            },
                            "style": {
                                "fill": "white",
                                "strokeColor": "black",
                                "opacity": 1,
                                "strokeDashArray": "",
                                "strokeWidth": 1
                            },
                            "horizontalAlignment": "Center",
                            "verticalAlignment": "Center"
                        }, {
                            "inEdges": [],
                            "outEdges": [],
                            "offset": {
                                "x": 1,
                                "y": 0.5
                            },
                            "visibility": 12,
                            "constraints": 28,
                            "id": "nkLvw",
                            "height": 12,
                            "width": 12,
                            "shape": "Square",
                            "margin": {
                                "left": 0,
                                "top": 0,
                                "right": 0,
                                "bottom": 0
                            },
                            "style": {
                                "fill": "white",
                                "strokeColor": "black",
                                "opacity": 1,
                                "strokeDashArray": "",
                                "strokeWidth": 1
                            },
                            "horizontalAlignment": "Center",
                            "verticalAlignment": "Center"
                        }, {
                            "inEdges": [],
                            "outEdges": [],
                            "offset": {
                                "x": 0.25,
                                "y": 0
                            },
                            "visibility": 12,
                            "constraints": 28,
                            "id": "Ee77c",
                            "height": 12,
                            "width": 12,
                            "shape": "Square",
                            "margin": {
                                "left": 0,
                                "top": 0,
                                "right": 0,
                                "bottom": 0
                            },
                            "style": {
                                "fill": "white",
                                "strokeColor": "black",
                                "opacity": 1,
                                "strokeDashArray": "",
                                "strokeWidth": 1
                            },
                            "horizontalAlignment": "Center",
                            "verticalAlignment": "Center"
                        }, {
                            "inEdges": [],
                            "outEdges": [],
                            "offset": {
                                "x": 0.75,
                                "y": 0
                            },
                            "visibility": 12,
                            "constraints": 28,
                            "id": "oCub1",
                            "height": 12,
                            "width": 12,
                            "shape": "Square",
                            "margin": {
                                "left": 0,
                                "top": 0,
                                "right": 0,
                                "bottom": 0
                            },
                            "style": {
                                "fill": "white",
                                "strokeColor": "black",
                                "opacity": 1,
                                "strokeDashArray": "",
                                "strokeWidth": 1
                            },
                            "horizontalAlignment": "Center",
                            "verticalAlignment": "Center"
                        }, {
                            "inEdges": [],
                            "outEdges": [],
                            "offset": {
                                "x": 0.25,
                                "y": 1
                            },
                            "visibility": 12,
                            "constraints": 28,
                            "id": "WU6K7",
                            "height": 12,
                            "width": 12,
                            "shape": "Square",
                            "margin": {
                                "left": 0,
                                "top": 0,
                                "right": 0,
                                "bottom": 0
                            },
                            "style": {
                                "fill": "white",
                                "strokeColor": "black",
                                "opacity": 1,
                                "strokeDashArray": "",
                                "strokeWidth": 1
                            },
                            "horizontalAlignment": "Center",
                            "verticalAlignment": "Center"
                        }, {
                            "inEdges": [],
                            "outEdges": [],
                            "offset": {
                                "x": 0.75,
                                "y": 1
                            },
                            "visibility": 12,
                            "constraints": 28,
                            "id": "RPDQb",
                            "height": 12,
                            "width": 12,
                            "shape": "Square",
                            "margin": {
                                "left": 0,
                                "top": 0,
                                "right": 0,
                                "bottom": 0
                            },
                            "style": {
                                "fill": "white",
                                "strokeColor": "black",
                                "opacity": 1,
                                "strokeDashArray": "",
                                "strokeWidth": 1
                            },
                            "horizontalAlignment": "Center",
                            "verticalAlignment": "Center"
                        }
                    ],
                    "id": "TarefaMIeVG",
                    "width": 130,
                    "height": 65,
                    "style": {
                        "fill": "rgba(227,242,253,1)",
                        "strokeWidth": 2,
                        "strokeColor": "#0d47a1ff",
                        "strokeDashArray": "",
                        "opacity": 1,
                        "gradient": {
                            "type": "None"
                        }
                    },
                    "container": null,
                    "offsetX": 495,
                    "offsetY": 417.4875,
                    "visible": true,
                    "horizontalAlignment": "Left",
                    "verticalAlignment": "Top",
                    "backgroundColor": "transparent",
                    "borderColor": "none",
                    "borderWidth": 0,
                    "rotateAngle": 0,
                    "pivot": {
                        "x": 0.5,
                        "y": 0.5
                    },
                    "margin": {},
                    "flip": "None",
                    "wrapper": {
                        "actualSize": {
                            "width": 130,
                            "height": 65
                        },
                        "offsetX": 495,
                        "offsetY": 417.4875
                    },
                    "constraints": 5240814,
                    "previewSize": {},
                    "dragSize": {},
                    "zIndex": 21,
                    "annotations": [{
                            "id": "uX2Js",
                            "content": "Baixar relatório de digitação",
                            "annotationType": "String",
                            "style": {
                                "strokeWidth": 0,
                                "strokeColor": "transparent",
                                "fill": "transparent",
                                "bold": false,
                                "textWrapping": "WrapWithOverflow",
                                "color": "black",
                                "whiteSpace": "CollapseSpace",
                                "fontFamily": "Arial",
                                "fontSize": 12,
                                "italic": false,
                                "opacity": 1,
                                "strokeDashArray": "",
                                "textAlign": "Center",
                                "textOverflow": "Wrap",
                                "textDecoration": "None"
                            },
                            "hyperlink": {
                                "link": "",
                                "content": "",
                                "textDecoration": "None"
                            },
                            "constraints": 4,
                            "visibility": true,
                            "rotateAngle": 0,
                            "margin": {
                                "left": 0,
                                "top": 0,
                                "right": 0,
                                "bottom": 0
                            },
                            "horizontalAlignment": "Center",
                            "verticalAlignment": "Center",
                            "offset": {
                                "x": 0.5,
                                "y": 0.5
                            }
                        }
                    ],
                    "isExpanded": true,
                    "expandIcon": {
                        "shape": "None"
                    },
                    "fixedUserHandles": [],
                    "tooltip": {
                        "openOn": "Auto"
                    },
                    "inEdges": ["connectorK89KV", "Linha-Bezier-2tqUAl"],
                    "outEdges": ["connectormTdJ3"],
                    "parentId": "",
                    "processId": "",
                    "umlIndex": -1,
                    "isPhase": false,
                    "isLane": false
                }, {
                    "shape": {
                        "type": "Bpmn",
                        "shape": "DataObject",
                        "dataObject": {
                            "type": "None",
                            "collection": false
                        },
                        "annotations": [],
                        "activity": {
                            "subProcess": {}
                        }
                    },
                    "ports": [{
                            "inEdges": [],
                            "outEdges": [],
                            "offset": {
                                "x": 0,
                                "y": 0.5
                            },
                            "visibility": 12,
                            "constraints": 28,
                            "id": "WTBJW",
                            "height": 12,
                            "width": 12,
                            "shape": "Square",
                            "margin": {
                                "left": 0,
                                "top": 0,
                                "right": 0,
                                "bottom": 0
                            },
                            "style": {
                                "fill": "white",
                                "strokeColor": "black",
                                "opacity": 1,
                                "strokeDashArray": "",
                                "strokeWidth": 1
                            },
                            "horizontalAlignment": "Center",
                            "verticalAlignment": "Center"
                        }, {
                            "inEdges": [],
                            "outEdges": [],
                            "offset": {
                                "x": 1,
                                "y": 0.5
                            },
                            "visibility": 12,
                            "constraints": 28,
                            "id": "kHi0D",
                            "height": 12,
                            "width": 12,
                            "shape": "Square",
                            "margin": {
                                "left": 0,
                                "top": 0,
                                "right": 0,
                                "bottom": 0
                            },
                            "style": {
                                "fill": "white",
                                "strokeColor": "black",
                                "opacity": 1,
                                "strokeDashArray": "",
                                "strokeWidth": 1
                            },
                            "horizontalAlignment": "Center",
                            "verticalAlignment": "Center"
                        }, {
                            "inEdges": [],
                            "outEdges": [],
                            "offset": {
                                "x": 0.25,
                                "y": 0
                            },
                            "visibility": 12,
                            "constraints": 28,
                            "id": "Cxsbx",
                            "height": 12,
                            "width": 12,
                            "shape": "Square",
                            "margin": {
                                "left": 0,
                                "top": 0,
                                "right": 0,
                                "bottom": 0
                            },
                            "style": {
                                "fill": "white",
                                "strokeColor": "black",
                                "opacity": 1,
                                "strokeDashArray": "",
                                "strokeWidth": 1
                            },
                            "horizontalAlignment": "Center",
                            "verticalAlignment": "Center"
                        }, {
                            "inEdges": [],
                            "outEdges": [],
                            "offset": {
                                "x": 0.75,
                                "y": 0
                            },
                            "visibility": 12,
                            "constraints": 28,
                            "id": "MCpZr",
                            "height": 12,
                            "width": 12,
                            "shape": "Square",
                            "margin": {
                                "left": 0,
                                "top": 0,
                                "right": 0,
                                "bottom": 0
                            },
                            "style": {
                                "fill": "white",
                                "strokeColor": "black",
                                "opacity": 1,
                                "strokeDashArray": "",
                                "strokeWidth": 1
                            },
                            "horizontalAlignment": "Center",
                            "verticalAlignment": "Center"
                        }, {
                            "inEdges": [],
                            "outEdges": [],
                            "offset": {
                                "x": 0.25,
                                "y": 1
                            },
                            "visibility": 12,
                            "constraints": 28,
                            "id": "U2CyV",
                            "height": 12,
                            "width": 12,
                            "shape": "Square",
                            "margin": {
                                "left": 0,
                                "top": 0,
                                "right": 0,
                                "bottom": 0
                            },
                            "style": {
                                "fill": "white",
                                "strokeColor": "black",
                                "opacity": 1,
                                "strokeDashArray": "",
                                "strokeWidth": 1
                            },
                            "horizontalAlignment": "Center",
                            "verticalAlignment": "Center"
                        }, {
                            "inEdges": [],
                            "outEdges": [],
                            "offset": {
                                "x": 0.75,
                                "y": 1
                            },
                            "visibility": 12,
                            "constraints": 28,
                            "id": "lecvf",
                            "height": 12,
                            "width": 12,
                            "shape": "Square",
                            "margin": {
                                "left": 0,
                                "top": 0,
                                "right": 0,
                                "bottom": 0
                            },
                            "style": {
                                "fill": "white",
                                "strokeColor": "black",
                                "opacity": 1,
                                "strokeDashArray": "",
                                "strokeWidth": 1
                            },
                            "horizontalAlignment": "Center",
                            "verticalAlignment": "Center"
                        }
                    ],
                    "id": "Objeto-de-DadosumK60",
                    "width": 80,
                    "height": 80,
                    "style": {
                        "fill": "rgba(230,230,230,1)",
                        "strokeWidth": 2,
                        "strokeColor": "#3A3A3A",
                        "strokeDashArray": "",
                        "opacity": 1,
                        "gradient": {
                            "type": "None"
                        }
                    },
                    "container": null,
                    "offsetX": 531,
                    "offsetY": 304,
                    "visible": true,
                    "horizontalAlignment": "Left",
                    "verticalAlignment": "Top",
                    "backgroundColor": "transparent",
                    "borderColor": "none",
                    "borderWidth": 0,
                    "rotateAngle": 0,
                    "pivot": {
                        "x": 0.5,
                        "y": 0.5
                    },
                    "margin": {
                        "top": 0,
                        "left": 0
                    },
                    "flip": "None",
                    "wrapper": {
                        "actualSize": {
                            "width": 80,
                            "height": 80
                        },
                        "offsetX": 531,
                        "offsetY": 304
                    },
                    "constraints": 5240814,
                    "previewSize": {},
                    "dragSize": {},
                    "zIndex": 23,
                    "annotations": [{
                            "id": "t6QGt",
                            "content": "Baixar banco a Banco",
                            "annotationType": "String",
                            "style": {
                                "strokeWidth": 0,
                                "strokeColor": "transparent",
                                "fill": "transparent",
                                "bold": false,
                                "textWrapping": "WrapWithOverflow",
                                "color": "black",
                                "whiteSpace": "CollapseSpace",
                                "fontFamily": "Arial",
                                "fontSize": 11,
                                "italic": false,
                                "opacity": 1,
                                "strokeDashArray": "",
                                "textAlign": "Center",
                                "textOverflow": "Wrap",
                                "textDecoration": "None"
                            },
                            "hyperlink": {
                                "link": "",
                                "content": "",
                                "textDecoration": "None"
                            },
                            "constraints": 124,
                            "visibility": true,
                            "rotateAngle": 0,
                            "margin": {
                                "left": 0,
                                "top": 0,
                                "right": 0,
                                "bottom": 0
                            },
                            "horizontalAlignment": "Center",
                            "verticalAlignment": "Center",
                            "offset": {
                                "x": 0.5,
                                "y": 0.5
                            }
                        }
                    ],
                    "isExpanded": true,
                    "expandIcon": {
                        "shape": "None"
                    },
                    "fixedUserHandles": [],
                    "tooltip": {
                        "openOn": "Auto"
                    },
                    "inEdges": [],
                    "outEdges": ["Linha-Bezier-2tqUAl"],
                    "parentId": "",
                    "processId": "",
                    "umlIndex": -1,
                    "isPhase": false,
                    "isLane": false
                }, {
                    "shape": {
                        "type": "Bpmn",
                        "shape": "Activity",
                        "activity": {
                            "activity": "Task",
                            "subProcess": {
                                "type": "None",
                                "collapsed": true
                            },
                            "task": {
                                "call": false,
                                "compensation": false,
                                "loop": "None",
                                "type": "None"
                            }
                        },
                        "annotations": []
                    },
                    "ports": [{
                            "inEdges": ["connectormTdJ3"],
                            "outEdges": [],
                            "offset": {
                                "x": 0,
                                "y": 0.5
                            },
                            "visibility": 12,
                            "constraints": 28,
                            "id": "IAJua",
                            "height": 12,
                            "width": 12,
                            "shape": "Square",
                            "margin": {
                                "left": 0,
                                "top": 0,
                                "right": 0,
                                "bottom": 0
                            },
                            "style": {
                                "fill": "white",
                                "strokeColor": "black",
                                "opacity": 1,
                                "strokeDashArray": "",
                                "strokeWidth": 1
                            },
                            "horizontalAlignment": "Center",
                            "verticalAlignment": "Center"
                        }, {
                            "inEdges": [],
                            "outEdges": [],
                            "offset": {
                                "x": 1,
                                "y": 0.5
                            },
                            "visibility": 12,
                            "constraints": 28,
                            "id": "DCg1b",
                            "height": 12,
                            "width": 12,
                            "shape": "Square",
                            "margin": {
                                "left": 0,
                                "top": 0,
                                "right": 0,
                                "bottom": 0
                            },
                            "style": {
                                "fill": "white",
                                "strokeColor": "black",
                                "opacity": 1,
                                "strokeDashArray": "",
                                "strokeWidth": 1
                            },
                            "horizontalAlignment": "Center",
                            "verticalAlignment": "Center"
                        }, {
                            "inEdges": [],
                            "outEdges": [],
                            "offset": {
                                "x": 0.25,
                                "y": 0
                            },
                            "visibility": 12,
                            "constraints": 28,
                            "id": "JgKPg",
                            "height": 12,
                            "width": 12,
                            "shape": "Square",
                            "margin": {
                                "left": 0,
                                "top": 0,
                                "right": 0,
                                "bottom": 0
                            },
                            "style": {
                                "fill": "white",
                                "strokeColor": "black",
                                "opacity": 1,
                                "strokeDashArray": "",
                                "strokeWidth": 1
                            },
                            "horizontalAlignment": "Center",
                            "verticalAlignment": "Center"
                        }, {
                            "inEdges": [],
                            "outEdges": [],
                            "offset": {
                                "x": 0.75,
                                "y": 0
                            },
                            "visibility": 12,
                            "constraints": 28,
                            "id": "mL837",
                            "height": 12,
                            "width": 12,
                            "shape": "Square",
                            "margin": {
                                "left": 0,
                                "top": 0,
                                "right": 0,
                                "bottom": 0
                            },
                            "style": {
                                "fill": "white",
                                "strokeColor": "black",
                                "opacity": 1,
                                "strokeDashArray": "",
                                "strokeWidth": 1
                            },
                            "horizontalAlignment": "Center",
                            "verticalAlignment": "Center"
                        }, {
                            "inEdges": [],
                            "outEdges": [],
                            "offset": {
                                "x": 0.25,
                                "y": 1
                            },
                            "visibility": 12,
                            "constraints": 28,
                            "id": "w3UA2",
                            "height": 12,
                            "width": 12,
                            "shape": "Square",
                            "margin": {
                                "left": 0,
                                "top": 0,
                                "right": 0,
                                "bottom": 0
                            },
                            "style": {
                                "fill": "white",
                                "strokeColor": "black",
                                "opacity": 1,
                                "strokeDashArray": "",
                                "strokeWidth": 1
                            },
                            "horizontalAlignment": "Center",
                            "verticalAlignment": "Center"
                        }, {
                            "inEdges": [],
                            "outEdges": [],
                            "offset": {
                                "x": 0.75,
                                "y": 1
                            },
                            "visibility": 12,
                            "constraints": 28,
                            "id": "RQvxc",
                            "height": 12,
                            "width": 12,
                            "shape": "Square",
                            "margin": {
                                "left": 0,
                                "top": 0,
                                "right": 0,
                                "bottom": 0
                            },
                            "style": {
                                "fill": "white",
                                "strokeColor": "black",
                                "opacity": 1,
                                "strokeDashArray": "",
                                "strokeWidth": 1
                            },
                            "horizontalAlignment": "Center",
                            "verticalAlignment": "Center"
                        }
                    ],
                    "id": "TarefaKJpm0",
                    "width": 130,
                    "height": 65,
                    "style": {
                        "fill": "rgba(227,242,253,1)",
                        "strokeWidth": 2,
                        "strokeColor": "#0d47a1ff",
                        "strokeDashArray": "",
                        "opacity": 1,
                        "gradient": {
                            "type": "None"
                        }
                    },
                    "container": null,
                    "offsetX": 667,
                    "offsetY": 417.4875,
                    "visible": true,
                    "horizontalAlignment": "Left",
                    "verticalAlignment": "Top",
                    "backgroundColor": "transparent",
                    "borderColor": "none",
                    "borderWidth": 0,
                    "rotateAngle": 0,
                    "pivot": {
                        "x": 0.5,
                        "y": 0.5
                    },
                    "margin": {},
                    "flip": "None",
                    "wrapper": {
                        "actualSize": {
                            "width": 130,
                            "height": 65
                        },
                        "offsetX": 667,
                        "offsetY": 417.4875
                    },
                    "constraints": 5240814,
                    "previewSize": {},
                    "dragSize": {},
                    "zIndex": 25,
                    "annotations": [{
                            "id": "c4xAs",
                            "content": "Integrar no Virtaus",
                            "annotationType": "String",
                            "style": {
                                "strokeWidth": 0,
                                "strokeColor": "transparent",
                                "fill": "transparent",
                                "bold": false,
                                "textWrapping": "WrapWithOverflow",
                                "color": "black",
                                "whiteSpace": "CollapseSpace",
                                "fontFamily": "Arial",
                                "fontSize": 12,
                                "italic": false,
                                "opacity": 1,
                                "strokeDashArray": "",
                                "textAlign": "Center",
                                "textOverflow": "Wrap",
                                "textDecoration": "None"
                            },
                            "hyperlink": {
                                "link": "",
                                "content": "",
                                "textDecoration": "None"
                            },
                            "constraints": 4,
                            "visibility": true,
                            "rotateAngle": 0,
                            "margin": {
                                "left": 0,
                                "top": 0,
                                "right": 0,
                                "bottom": 0
                            },
                            "horizontalAlignment": "Center",
                            "verticalAlignment": "Center",
                            "offset": {
                                "x": 0.5,
                                "y": 0.5
                            }
                        }
                    ],
                    "isExpanded": true,
                    "expandIcon": {
                        "shape": "None"
                    },
                    "fixedUserHandles": [],
                    "tooltip": {
                        "openOn": "Auto"
                    },
                    "inEdges": ["connectormTdJ3"],
                    "outEdges": ["connectorS8FCH"],
                    "parentId": "",
                    "processId": "",
                    "umlIndex": -1,
                    "isPhase": false,
                    "isLane": false
                }, {
                    "shape": {
                        "type": "Bpmn",
                        "shape": "Gateway",
                        "gateway": {
                            "type": "Exclusive"
                        },
                        "annotations": [],
                        "activity": {
                            "subProcess": {}
                        }
                    },
                    "ports": [{
                            "inEdges": ["connectorS8FCH"],
                            "outEdges": [],
                            "offset": {
                                "x": 0,
                                "y": 0.5
                            },
                            "visibility": 12,
                            "constraints": 28,
                            "id": "MSigX",
                            "height": 12,
                            "width": 12,
                            "shape": "Square",
                            "margin": {
                                "left": 0,
                                "top": 0,
                                "right": 0,
                                "bottom": 0
                            },
                            "style": {
                                "fill": "white",
                                "strokeColor": "black",
                                "opacity": 1,
                                "strokeDashArray": "",
                                "strokeWidth": 1
                            },
                            "horizontalAlignment": "Center",
                            "verticalAlignment": "Center"
                        }, {
                            "inEdges": [],
                            "outEdges": ["connectorP67B4"],
                            "offset": {
                                "x": 1,
                                "y": 0.5
                            },
                            "visibility": 12,
                            "constraints": 28,
                            "id": "JxaVm",
                            "height": 12,
                            "width": 12,
                            "shape": "Square",
                            "margin": {
                                "left": 0,
                                "top": 0,
                                "right": 0,
                                "bottom": 0
                            },
                            "style": {
                                "fill": "white",
                                "strokeColor": "black",
                                "opacity": 1,
                                "strokeDashArray": "",
                                "strokeWidth": 1
                            },
                            "horizontalAlignment": "Center",
                            "verticalAlignment": "Center"
                        }, {
                            "inEdges": [],
                            "outEdges": [],
                            "offset": {
                                "x": 0.25,
                                "y": 0
                            },
                            "visibility": 12,
                            "constraints": 28,
                            "id": "l9m08",
                            "height": 12,
                            "width": 12,
                            "shape": "Square",
                            "margin": {
                                "left": 0,
                                "top": 0,
                                "right": 0,
                                "bottom": 0
                            },
                            "style": {
                                "fill": "white",
                                "strokeColor": "black",
                                "opacity": 1,
                                "strokeDashArray": "",
                                "strokeWidth": 1
                            },
                            "horizontalAlignment": "Center",
                            "verticalAlignment": "Center"
                        }, {
                            "inEdges": [],
                            "outEdges": [],
                            "offset": {
                                "x": 0.75,
                                "y": 0
                            },
                            "visibility": 12,
                            "constraints": 28,
                            "id": "LH19v",
                            "height": 12,
                            "width": 12,
                            "shape": "Square",
                            "margin": {
                                "left": 0,
                                "top": 0,
                                "right": 0,
                                "bottom": 0
                            },
                            "style": {
                                "fill": "white",
                                "strokeColor": "black",
                                "opacity": 1,
                                "strokeDashArray": "",
                                "strokeWidth": 1
                            },
                            "horizontalAlignment": "Center",
                            "verticalAlignment": "Center"
                        }, {
                            "inEdges": [],
                            "outEdges": [],
                            "offset": {
                                "x": 0.25,
                                "y": 1
                            },
                            "visibility": 12,
                            "constraints": 28,
                            "id": "VgTlW",
                            "height": 12,
                            "width": 12,
                            "shape": "Square",
                            "margin": {
                                "left": 0,
                                "top": 0,
                                "right": 0,
                                "bottom": 0
                            },
                            "style": {
                                "fill": "white",
                                "strokeColor": "black",
                                "opacity": 1,
                                "strokeDashArray": "",
                                "strokeWidth": 1
                            },
                            "horizontalAlignment": "Center",
                            "verticalAlignment": "Center"
                        }, {
                            "inEdges": [],
                            "outEdges": [],
                            "offset": {
                                "x": 0.75,
                                "y": 1
                            },
                            "visibility": 12,
                            "constraints": 28,
                            "id": "wTZha",
                            "height": 12,
                            "width": 12,
                            "shape": "Square",
                            "margin": {
                                "left": 0,
                                "top": 0,
                                "right": 0,
                                "bottom": 0
                            },
                            "style": {
                                "fill": "white",
                                "strokeColor": "black",
                                "opacity": 1,
                                "strokeDashArray": "",
                                "strokeWidth": 1
                            },
                            "horizontalAlignment": "Center",
                            "verticalAlignment": "Center"
                        }
                    ],
                    "id": "Gateway-Exclusivel7TOi",
                    "width": 35,
                    "height": 35,
                    "style": {
                        "fill": "rgba(251,192,45,1)",
                        "strokeWidth": 2,
                        "strokeColor": "#3A3A3A",
                        "strokeDashArray": "",
                        "opacity": 1,
                        "gradient": {
                            "type": "None"
                        }
                    },
                    "container": null,
                    "offsetX": 791.5,
                    "offsetY": 417.4875,
                    "visible": true,
                    "horizontalAlignment": "Left",
                    "verticalAlignment": "Top",
                    "backgroundColor": "transparent",
                    "borderColor": "none",
                    "borderWidth": 0,
                    "rotateAngle": 0,
                    "pivot": {
                        "x": 0.5,
                        "y": 0.5
                    },
                    "margin": {},
                    "flip": "None",
                    "wrapper": {
                        "actualSize": {
                            "width": 35,
                            "height": 35
                        },
                        "offsetX": 791.5,
                        "offsetY": 417.4875
                    },
                    "constraints": 5240814,
                    "previewSize": {},
                    "dragSize": {},
                    "zIndex": 27,
                    "annotations": [],
                    "isExpanded": true,
                    "expandIcon": {
                        "shape": "None"
                    },
                    "fixedUserHandles": [],
                    "tooltip": {
                        "openOn": "Auto"
                    },
                    "inEdges": ["connectorS8FCH"],
                    "outEdges": ["connectorP67B4"],
                    "parentId": "",
                    "processId": "",
                    "umlIndex": -1,
                    "isPhase": false,
                    "isLane": false
                }, {
                    "shape": {
                        "type": "Text",
                        "content": "Qual o tipo de empréstimo?",
                        "margin": {
                            "left": 0,
                            "top": 0,
                            "right": 0,
                            "bottom": 0
                        }
                    },
                    "ports": [],
                    "style": {
                        "fill": "none",
                        "strokeColor": "none",
                        "strokeWidth": 1,
                        "strokeDashArray": "2 2",
                        "opacity": 1,
                        "gradient": {
                            "type": "None"
                        },
                        "fontSize": 12,
                        "fontFamily": "Arial",
                        "textOverflow": "Wrap",
                        "textDecoration": "None",
                        "whiteSpace": "CollapseSpace",
                        "textWrapping": "WrapWithOverflow",
                        "textAlign": "Center",
                        "color": "black",
                        "italic": false,
                        "bold": false
                    },
                    "offsetX": 791.5,
                    "width": 53,
                    "height": 34.93624999999997,
                    "offsetY": 456.53,
                    "id": "nodedZZPe",
                    "zIndex": 29,
                    "container": null,
                    "visible": true,
                    "horizontalAlignment": "Left",
                    "verticalAlignment": "Top",
                    "backgroundColor": "transparent",
                    "borderColor": "none",
                    "borderWidth": 0,
                    "rotateAngle": 0,
                    "pivot": {
                        "x": 0.5,
                        "y": 0.5
                    },
                    "margin": {
                        "top": 0,
                        "left": 0
                    },
                    "flip": "None",
                    "wrapper": {
                        "actualSize": {
                            "width": 53,
                            "height": 34.93624999999997
                        },
                        "offsetX": 791.5,
                        "offsetY": 456.53
                    },
                    "constraints": 5240814,
                    "annotations": [],
                    "isExpanded": true,
                    "expandIcon": {
                        "shape": "None"
                    },
                    "fixedUserHandles": [],
                    "tooltip": {
                        "openOn": "Auto"
                    },
                    "inEdges": [],
                    "outEdges": [],
                    "parentId": "",
                    "processId": "",
                    "umlIndex": -1,
                    "isPhase": false,
                    "isLane": false
                }, {
                    "shape": {
                        "type": "Text",
                        "content": "Portabilidade ",
                        "margin": {
                            "left": 0,
                            "top": 0,
                            "right": 0,
                            "bottom": 0
                        }
                    },
                    "ports": [],
                    "style": {
                        "fill": "none",
                        "strokeColor": "none",
                        "strokeWidth": 1,
                        "strokeDashArray": "2 2",
                        "opacity": 1,
                        "gradient": {
                            "type": "None"
                        },
                        "fontSize": 12,
                        "fontFamily": "Arial",
                        "textOverflow": "Wrap",
                        "textDecoration": "None",
                        "whiteSpace": "CollapseSpace",
                        "textWrapping": "WrapWithOverflow",
                        "textAlign": "Center",
                        "color": "black",
                        "italic": false,
                        "bold": false
                    },
                    "offsetX": 757,
                    "width": 79.99999999999997,
                    "height": 19.98750000000001,
                    "offsetY": 357.99,
                    "id": "nodetXaTa",
                    "zIndex": 33,
                    "container": null,
                    "visible": true,
                    "horizontalAlignment": "Left",
                    "verticalAlignment": "Top",
                    "backgroundColor": "transparent",
                    "borderColor": "none",
                    "borderWidth": 0,
                    "rotateAngle": 0,
                    "pivot": {
                        "x": 0.5,
                        "y": 0.5
                    },
                    "margin": {
                        "top": 0,
                        "left": 0
                    },
                    "flip": "None",
                    "wrapper": {
                        "actualSize": {
                            "width": 79.99999999999997,
                            "height": 19.98750000000001
                        },
                        "offsetX": 757,
                        "offsetY": 357.99
                    },
                    "constraints": 5240814,
                    "annotations": [],
                    "isExpanded": true,
                    "expandIcon": {
                        "shape": "None"
                    },
                    "fixedUserHandles": [],
                    "tooltip": {
                        "openOn": "Auto"
                    },
                    "inEdges": [],
                    "outEdges": [],
                    "parentId": "",
                    "processId": "",
                    "umlIndex": -1,
                    "isPhase": false,
                    "isLane": false
                }, {
                    "shape": {
                        "type": "Bpmn",
                        "shape": "Activity",
                        "activity": {
                            "activity": "Task",
                            "subProcess": {
                                "type": "None",
                                "collapsed": true
                            },
                            "task": {
                                "call": false,
                                "compensation": false,
                                "loop": "None",
                                "type": "None"
                            }
                        },
                        "annotations": []
                    },
                    "ports": [{
                            "inEdges": [],
                            "outEdges": [],
                            "offset": {
                                "x": 0,
                                "y": 0.5
                            },
                            "visibility": 12,
                            "constraints": 28,
                            "id": "bC0Kf",
                            "height": 12,
                            "width": 12,
                            "shape": "Square",
                            "margin": {
                                "left": 0,
                                "top": 0,
                                "right": 0,
                                "bottom": 0
                            },
                            "style": {
                                "fill": "white",
                                "strokeColor": "black",
                                "opacity": 1,
                                "strokeDashArray": "",
                                "strokeWidth": 1
                            },
                            "horizontalAlignment": "Center",
                            "verticalAlignment": "Center"
                        }, {
                            "inEdges": [],
                            "outEdges": [],
                            "offset": {
                                "x": 1,
                                "y": 0.5
                            },
                            "visibility": 12,
                            "constraints": 28,
                            "id": "Uby5s",
                            "height": 12,
                            "width": 12,
                            "shape": "Square",
                            "margin": {
                                "left": 0,
                                "top": 0,
                                "right": 0,
                                "bottom": 0
                            },
                            "style": {
                                "fill": "white",
                                "strokeColor": "black",
                                "opacity": 1,
                                "strokeDashArray": "",
                                "strokeWidth": 1
                            },
                            "horizontalAlignment": "Center",
                            "verticalAlignment": "Center"
                        }, {
                            "inEdges": [],
                            "outEdges": [],
                            "offset": {
                                "x": 0.25,
                                "y": 0
                            },
                            "visibility": 12,
                            "constraints": 28,
                            "id": "qBhQD",
                            "height": 12,
                            "width": 12,
                            "shape": "Square",
                            "margin": {
                                "left": 0,
                                "top": 0,
                                "right": 0,
                                "bottom": 0
                            },
                            "style": {
                                "fill": "white",
                                "strokeColor": "black",
                                "opacity": 1,
                                "strokeDashArray": "",
                                "strokeWidth": 1
                            },
                            "horizontalAlignment": "Center",
                            "verticalAlignment": "Center"
                        }, {
                            "inEdges": [],
                            "outEdges": [],
                            "offset": {
                                "x": 0.75,
                                "y": 0
                            },
                            "visibility": 12,
                            "constraints": 28,
                            "id": "dL5AB",
                            "height": 12,
                            "width": 12,
                            "shape": "Square",
                            "margin": {
                                "left": 0,
                                "top": 0,
                                "right": 0,
                                "bottom": 0
                            },
                            "style": {
                                "fill": "white",
                                "strokeColor": "black",
                                "opacity": 1,
                                "strokeDashArray": "",
                                "strokeWidth": 1
                            },
                            "horizontalAlignment": "Center",
                            "verticalAlignment": "Center"
                        }, {
                            "inEdges": [],
                            "outEdges": [],
                            "offset": {
                                "x": 0.25,
                                "y": 1
                            },
                            "visibility": 12,
                            "constraints": 28,
                            "id": "CTPbZ",
                            "height": 12,
                            "width": 12,
                            "shape": "Square",
                            "margin": {
                                "left": 0,
                                "top": 0,
                                "right": 0,
                                "bottom": 0
                            },
                            "style": {
                                "fill": "white",
                                "strokeColor": "black",
                                "opacity": 1,
                                "strokeDashArray": "",
                                "strokeWidth": 1
                            },
                            "horizontalAlignment": "Center",
                            "verticalAlignment": "Center"
                        }, {
                            "inEdges": [],
                            "outEdges": [],
                            "offset": {
                                "x": 0.75,
                                "y": 1
                            },
                            "visibility": 12,
                            "constraints": 28,
                            "id": "Thx5P",
                            "height": 12,
                            "width": 12,
                            "shape": "Square",
                            "margin": {
                                "left": 0,
                                "top": 0,
                                "right": 0,
                                "bottom": 0
                            },
                            "style": {
                                "fill": "white",
                                "strokeColor": "black",
                                "opacity": 1,
                                "strokeDashArray": "",
                                "strokeWidth": 1
                            },
                            "horizontalAlignment": "Center",
                            "verticalAlignment": "Center"
                        }
                    ],
                    "id": "Tarefawx6id",
                    "width": 130,
                    "height": 65,
                    "style": {
                        "fill": "rgba(227,242,253,1)",
                        "strokeWidth": 2,
                        "strokeColor": "#0d47a1ff",
                        "strokeDashArray": "",
                        "opacity": 1,
                        "gradient": {
                            "type": "None"
                        }
                    },
                    "container": null,
                    "offsetX": 963,
                    "offsetY": 417.4875,
                    "visible": true,
                    "horizontalAlignment": "Left",
                    "verticalAlignment": "Top",
                    "backgroundColor": "transparent",
                    "borderColor": "none",
                    "borderWidth": 0,
                    "rotateAngle": 0,
                    "pivot": {
                        "x": 0.5,
                        "y": 0.5
                    },
                    "margin": {},
                    "flip": "None",
                    "wrapper": {
                        "actualSize": {
                            "width": 130,
                            "height": 65
                        },
                        "offsetX": 963,
                        "offsetY": 417.4875
                    },
                    "constraints": 5240814,
                    "previewSize": {},
                    "dragSize": {},
                    "zIndex": 37,
                    "annotations": [{
                            "id": "yU5U1",
                            "content": "Analisar classificação do parceiro",
                            "annotationType": "String",
                            "style": {
                                "strokeWidth": 0,
                                "strokeColor": "transparent",
                                "fill": "transparent",
                                "bold": false,
                                "textWrapping": "WrapWithOverflow",
                                "color": "black",
                                "whiteSpace": "CollapseSpace",
                                "fontFamily": "Arial",
                                "fontSize": 12,
                                "italic": false,
                                "opacity": 1,
                                "strokeDashArray": "",
                                "textAlign": "Center",
                                "textOverflow": "Wrap",
                                "textDecoration": "None"
                            },
                            "hyperlink": {
                                "link": "",
                                "content": "",
                                "textDecoration": "None"
                            },
                            "constraints": 4,
                            "visibility": true,
                            "rotateAngle": 0,
                            "margin": {
                                "left": 0,
                                "top": 0,
                                "right": 0,
                                "bottom": 0
                            },
                            "horizontalAlignment": "Center",
                            "verticalAlignment": "Center",
                            "offset": {
                                "x": 0.5,
                                "y": 0.5
                            }
                        }
                    ],
                    "isExpanded": true,
                    "expandIcon": {
                        "shape": "None"
                    },
                    "fixedUserHandles": [],
                    "tooltip": {
                        "openOn": "Auto"
                    },
                    "inEdges": ["connectorP67B4"],
                    "outEdges": [],
                    "parentId": "",
                    "processId": "",
                    "umlIndex": -1,
                    "isPhase": false,
                    "isLane": false
                }, {
                    "shape": {
                        "type": "Text",
                        "content": "Outros Tipos ",
                        "margin": {
                            "left": 0,
                            "top": 0,
                            "right": 0,
                            "bottom": 0
                        }
                    },
                    "ports": [],
                    "style": {
                        "fill": "none",
                        "strokeColor": "none",
                        "strokeWidth": 1,
                        "strokeDashArray": "2 2",
                        "opacity": 1,
                        "gradient": {
                            "type": "None"
                        },
                        "fontSize": 12,
                        "fontFamily": "Arial",
                        "textOverflow": "Wrap",
                        "textDecoration": "None",
                        "whiteSpace": "CollapseSpace",
                        "textWrapping": "WrapWithOverflow",
                        "textAlign": "Center",
                        "color": "black",
                        "italic": false,
                        "bold": false
                    },
                    "offsetX": 844.5,
                    "width": 71,
                    "height": 31.875,
                    "offsetY": 415.05,
                    "id": "nodeH3qPR",
                    "zIndex": 39,
                    "container": null,
                    "visible": true,
                    "horizontalAlignment": "Left",
                    "verticalAlignment": "Top",
                    "backgroundColor": "transparent",
                    "borderColor": "none",
                    "borderWidth": 0,
                    "rotateAngle": 0,
                    "pivot": {
                        "x": 0.5,
                        "y": 0.5
                    },
                    "margin": {
                        "top": 0,
                        "left": 0
                    },
                    "flip": "None",
                    "wrapper": {
                        "actualSize": {
                            "width": 71,
                            "height": 31.875
                        },
                        "offsetX": 844.5,
                        "offsetY": 415.05
                    },
                    "constraints": 5240814,
                    "annotations": [],
                    "isExpanded": true,
                    "expandIcon": {
                        "shape": "None"
                    },
                    "fixedUserHandles": [],
                    "tooltip": {
                        "openOn": "Auto"
                    },
                    "inEdges": [],
                    "outEdges": [],
                    "parentId": "",
                    "processId": "",
                    "umlIndex": -1,
                    "isPhase": false,
                    "isLane": false
                }, {
                    "shape": {
                        "type": "Flow",
                        "shape": "Process"
                    },
                    "ports": [],
                    "id": "FunçãoV9ZVv",
                    "width": 2339.9999999999995,
                    "height": 200,
                    "style": {
                        "fill": "white",
                        "strokeWidth": 2,
                        "gradient": {
                            "type": "None"
                        },
                        "strokeColor": "black",
                        "strokeDashArray": "",
                        "opacity": 1
                    },
                    "horizontalAlignment": "Left",
                    "annotations": [{
                            "id": "OUf8Z",
                            "content": "Assistente de Portabilidade ",
                            "annotationType": "String",
                            "rotateAngle": 270,
                            "offset": {
                                "x": 0,
                                "y": 0.5
                            },
                            "horizontalAlignment": "Center",
                            "margin": {
                                "left": 20,
                                "top": 0,
                                "right": 0,
                                "bottom": 0
                            },
                            "style": {
                                "strokeWidth": 0,
                                "strokeColor": "transparent",
                                "fill": "transparent",
                                "bold": false,
                                "textWrapping": "WrapWithOverflow",
                                "color": "black",
                                "whiteSpace": "CollapseSpace",
                                "fontFamily": "Arial",
                                "fontSize": 12,
                                "italic": false,
                                "opacity": 1,
                                "strokeDashArray": "",
                                "textAlign": "Center",
                                "textOverflow": "Wrap",
                                "textDecoration": "None"
                            },
                            "hyperlink": {
                                "link": "",
                                "content": "",
                                "textDecoration": "None"
                            },
                            "constraints": 4,
                            "visibility": true,
                            "verticalAlignment": "Center"
                        }
                    ],
                    "constraints": 5240430,
                    "container": null,
                    "offsetX": 1270,
                    "offsetY": 35,
                    "visible": true,
                    "verticalAlignment": "Top",
                    "backgroundColor": "transparent",
                    "borderColor": "none",
                    "borderWidth": 0,
                    "rotateAngle": 0,
                    "pivot": {
                        "x": 0.5,
                        "y": 0.5
                    },
                    "margin": {
                        "top": 0,
                        "left": 0
                    },
                    "flip": "None",
                    "wrapper": {
                        "actualSize": {
                            "width": 2339.9999999999995,
                            "height": 200
                        },
                        "offsetX": 1270,
                        "offsetY": 35
                    },
                    "previewSize": {},
                    "dragSize": {},
                    "zIndex": 40,
                    "isExpanded": true,
                    "expandIcon": {
                        "shape": "None"
                    },
                    "fixedUserHandles": [],
                    "tooltip": {
                        "openOn": "Auto"
                    },
                    "inEdges": [],
                    "outEdges": [],
                    "parentId": "",
                    "processId": "",
                    "umlIndex": -1,
                    "isPhase": false,
                    "isLane": false
                }, {
                    "shape": {
                        "type": "Flow",
                        "shape": "Process"
                    },
                    "ports": [],
                    "id": "FunçãocJoAT",
                    "width": 2339.9999999999995,
                    "height": 255,
                    "style": {
                        "fill": "white",
                        "strokeWidth": 2,
                        "gradient": {
                            "type": "None"
                        },
                        "strokeColor": "black",
                        "strokeDashArray": "",
                        "opacity": 1
                    },
                    "horizontalAlignment": "Left",
                    "annotations": [{
                            "id": "OUf8Z",
                            "content": "Analista de Prevenção e Segurança ",
                            "annotationType": "String",
                            "rotateAngle": 270,
                            "offset": {
                                "x": 0,
                                "y": 0.5
                            },
                            "horizontalAlignment": "Center",
                            "margin": {
                                "left": 20,
                                "top": 0,
                                "right": 0,
                                "bottom": 0
                            },
                            "style": {
                                "strokeWidth": 0,
                                "strokeColor": "transparent",
                                "fill": "transparent",
                                "bold": false,
                                "textWrapping": "WrapWithOverflow",
                                "color": "black",
                                "whiteSpace": "CollapseSpace",
                                "fontFamily": "Arial",
                                "fontSize": 12,
                                "italic": false,
                                "opacity": 1,
                                "strokeDashArray": "",
                                "textAlign": "Center",
                                "textOverflow": "Wrap",
                                "textDecoration": "None"
                            },
                            "hyperlink": {
                                "link": "",
                                "content": "",
                                "textDecoration": "None"
                            },
                            "constraints": 4,
                            "visibility": true,
                            "verticalAlignment": "Center"
                        }
                    ],
                    "constraints": 5240430,
                    "container": null,
                    "offsetX": 1270,
                    "offsetY": -192.5,
                    "visible": true,
                    "verticalAlignment": "Top",
                    "backgroundColor": "transparent",
                    "borderColor": "none",
                    "borderWidth": 0,
                    "rotateAngle": 0,
                    "pivot": {
                        "x": 0.5,
                        "y": 0.5
                    },
                    "margin": {
                        "top": 0,
                        "left": 0
                    },
                    "flip": "None",
                    "wrapper": {
                        "actualSize": {
                            "width": 2339.9999999999995,
                            "height": 255
                        },
                        "offsetX": 1270,
                        "offsetY": -192.5
                    },
                    "previewSize": {},
                    "dragSize": {},
                    "zIndex": 102,
                    "isExpanded": true,
                    "expandIcon": {
                        "shape": "None"
                    },
                    "fixedUserHandles": [],
                    "tooltip": {
                        "openOn": "Auto"
                    },
                    "inEdges": [],
                    "outEdges": [],
                    "parentId": "",
                    "processId": "",
                    "umlIndex": -1,
                    "isPhase": false,
                    "isLane": false
                }, {
                    "shape": {
                        "type": "Flow",
                        "shape": "Process"
                    },
                    "ports": [],
                    "id": "FunçãoFRGNE",
                    "width": 2339.9999999999995,
                    "height": 644.9999999999999,
                    "style": {
                        "fill": "white",
                        "strokeWidth": 2,
                        "strokeColor": "#3A3A3A",
                        "strokeDashArray": "",
                        "opacity": 1,
                        "gradient": {
                            "type": "None"
                        }
                    },
                    "horizontalAlignment": "Left",
                    "annotations": [{
                            "id": "WKdp2",
                            "content": "Assistente de Esteira ",
                            "annotationType": "String",
                            "rotateAngle": 270,
                            "offset": {
                                "x": 0,
                                "y": 0.5
                            },
                            "horizontalAlignment": "Center",
                            "margin": {
                                "left": 20,
                                "right": 0,
                                "bottom": 0,
                                "top": 0
                            },
                            "style": {
                                "strokeWidth": 0,
                                "strokeColor": "transparent",
                                "fill": "transparent",
                                "bold": false,
                                "textWrapping": "WrapWithOverflow",
                                "color": "black",
                                "whiteSpace": "CollapseSpace",
                                "fontFamily": "Arial",
                                "fontSize": 12,
                                "italic": false,
                                "opacity": 1,
                                "strokeDashArray": "",
                                "textAlign": "Center",
                                "textOverflow": "Wrap",
                                "textDecoration": "None"
                            },
                            "hyperlink": {
                                "link": "",
                                "content": "",
                                "textDecoration": "None"
                            },
                            "constraints": 4,
                            "visibility": true,
                            "verticalAlignment": "Center"
                        }
                    ],
                    "container": null,
                    "offsetX": 1270.0000000000002,
                    "offsetY": 457.49999999999994,
                    "visible": true,
                    "verticalAlignment": "Top",
                    "backgroundColor": "transparent",
                    "borderColor": "none",
                    "borderWidth": 0,
                    "rotateAngle": 0,
                    "pivot": {
                        "x": 0.5,
                        "y": 0.5
                    },
                    "margin": {
                        "top": 0,
                        "left": 0
                    },
                    "flip": "None",
                    "wrapper": {
                        "actualSize": {
                            "width": 2339.9999999999995,
                            "height": 644.9999999999999
                        },
                        "offsetX": 1270.0000000000002,
                        "offsetY": 457.49999999999994
                    },
                    "constraints": 5240430,
                    "previewSize": {},
                    "dragSize": {},
                    "zIndex": 1,
                    "isExpanded": true,
                    "expandIcon": {
                        "shape": "None"
                    },
                    "fixedUserHandles": [],
                    "tooltip": {
                        "openOn": "Auto"
                    },
                    "inEdges": [],
                    "outEdges": [],
                    "parentId": "",
                    "processId": "",
                    "umlIndex": -1,
                    "isPhase": false,
                    "isLane": false
                }
            ],
            "connectors": [{
                    "shape": {
                        "type": "None"
                    },
                    "type": "Orthogonal",
                    "sourcePortID": "wAPsD",
                    "sourcePoint": {
                        "x": 215,
                        "y": 417.5
                    },
                    "targetPoint": {
                        "x": 258,
                        "y": 417.49
                    },
                    "id": "connectorqvrHT",
                    "sourceID": "Iniciar-cronômetroP0cfO",
                    "zIndex": 20,
                    "targetID": "Tarefadn24E",
                    "targetPortID": "KUG1O",
                    "flip": "None",
                    "segments": [{
                            "type": "Orthogonal",
                            "length": null,
                            "direction": null
                        }
                    ],
                    "sourceDecorator": {
                        "shape": "None",
                        "width": 10,
                        "height": 10,
                        "pivot": {
                            "x": 0,
                            "y": 0.5
                        },
                        "style": {
                            "fill": "black",
                            "strokeColor": "black",
                            "strokeWidth": 1,
                            "strokeDashArray": "",
                            "opacity": 1,
                            "gradient": {
                                "type": "None"
                            }
                        }
                    },
                    "targetDecorator": {
                        "shape": "Arrow",
                        "width": 10,
                        "height": 10,
                        "pivot": {
                            "x": 0,
                            "y": 0.5
                        },
                        "style": {
                            "fill": "black",
                            "strokeColor": "black",
                            "strokeWidth": 1,
                            "strokeDashArray": "",
                            "opacity": 1,
                            "gradient": {
                                "type": "None"
                            }
                        }
                    },
                    "cornerRadius": 0,
                    "wrapper": {
                        "actualSize": {
                            "width": 43,
                            "height": 0.009999999999990905
                        },
                        "offsetX": 236.5,
                        "offsetY": 417.495
                    },
                    "style": {
                        "strokeWidth": 1,
                        "strokeColor": "black",
                        "fill": "transparent",
                        "strokeDashArray": "",
                        "opacity": 1,
                        "gradient": {
                            "type": "None"
                        }
                    },
                    "annotations": [],
                    "fixedUserHandles": [],
                    "visible": true,
                    "constraints": 470590,
                    "sourcePadding": 0,
                    "targetPadding": 0,
                    "tooltip": {
                        "openOn": "Auto"
                    },
                    "connectionPadding": 0,
                    "bridgeSpace": 10,
                    "hitPadding": 10,
                    "parentId": ""
                }, {
                    "shape": {
                        "type": "None"
                    },
                    "type": "Orthogonal",
                    "sourcePortID": "IETOA",
                    "sourcePoint": {
                        "x": 388,
                        "y": 417.49
                    },
                    "targetPoint": {
                        "x": 430,
                        "y": 417.49
                    },
                    "id": "connectorK89KV",
                    "sourceID": "Tarefadn24E",
                    "zIndex": 22,
                    "targetID": "TarefaMIeVG",
                    "targetPortID": "",
                    "flip": "None",
                    "segments": [{
                            "type": "Orthogonal",
                            "length": null,
                            "direction": null
                        }
                    ],
                    "sourceDecorator": {
                        "shape": "None",
                        "width": 10,
                        "height": 10,
                        "pivot": {
                            "x": 0,
                            "y": 0.5
                        },
                        "style": {
                            "fill": "black",
                            "strokeColor": "black",
                            "strokeWidth": 1,
                            "strokeDashArray": "",
                            "opacity": 1,
                            "gradient": {
                                "type": "None"
                            }
                        }
                    },
                    "targetDecorator": {
                        "shape": "Arrow",
                        "width": 10,
                        "height": 10,
                        "pivot": {
                            "x": 0,
                            "y": 0.5
                        },
                        "style": {
                            "fill": "black",
                            "strokeColor": "black",
                            "strokeWidth": 1,
                            "strokeDashArray": "",
                            "opacity": 1,
                            "gradient": {
                                "type": "None"
                            }
                        }
                    },
                    "cornerRadius": 0,
                    "wrapper": {
                        "actualSize": {
                            "width": 42,
                            "height": 0
                        },
                        "offsetX": 409,
                        "offsetY": 417.49
                    },
                    "style": {
                        "strokeWidth": 1,
                        "strokeColor": "black",
                        "fill": "transparent",
                        "strokeDashArray": "",
                        "opacity": 1,
                        "gradient": {
                            "type": "None"
                        }
                    },
                    "annotations": [],
                    "fixedUserHandles": [],
                    "visible": true,
                    "constraints": 470590,
                    "sourcePadding": 0,
                    "targetPadding": 0,
                    "tooltip": {
                        "openOn": "Auto"
                    },
                    "connectionPadding": 0,
                    "bridgeSpace": 10,
                    "hitPadding": 10,
                    "parentId": ""
                }, {
                    "shape": {
                        "type": "None"
                    },
                    "id": "Linha-Bezier-2tqUAl",
                    "type": "Bezier",
                    "sourcePoint": {
                        "x": 518.31,
                        "y": 344
                    },
                    "targetPoint": {
                        "x": 505.31,
                        "y": 384.99
                    },
                    "style": {
                        "strokeWidth": 1,
                        "strokeColor": "black",
                        "strokeDashArray": "3,3",
                        "fill": "transparent",
                        "opacity": 1,
                        "gradient": {
                            "type": "None"
                        }
                    },
                    "targetDecorator": {
                        "shape": "None",
                        "width": 10,
                        "height": 10,
                        "pivot": {
                            "x": 0,
                            "y": 0.5
                        },
                        "style": {
                            "fill": "black",
                            "strokeColor": "black",
                            "strokeWidth": 1,
                            "strokeDashArray": "",
                            "opacity": 1,
                            "gradient": {
                                "type": "None"
                            }
                        }
                    },
                    "sourcePortID": "",
                    "targetPortID": "",
                    "sourceID": "Objeto-de-DadosumK60",
                    "targetID": "TarefaMIeVG",
                    "flip": "None",
                    "segments": [{
                            "type": "Bezier",
                            "point1": {
                                "x": 0,
                                "y": 0
                            },
                            "vector1": {
                                "angle": 0,
                                "distance": 0
                            },
                            "point2": {
                                "x": 0,
                                "y": 0
                            },
                            "vector2": {
                                "angle": 0,
                                "distance": 0
                            },
                            "point": {
                                "x": 0,
                                "y": 0
                            }
                        }
                    ],
                    "sourceDecorator": {
                        "shape": "None",
                        "width": 10,
                        "height": 10,
                        "pivot": {
                            "x": 0,
                            "y": 0.5
                        },
                        "style": {
                            "fill": "black",
                            "strokeColor": "black",
                            "strokeWidth": 1,
                            "strokeDashArray": "",
                            "opacity": 1,
                            "gradient": {
                                "type": "None"
                            }
                        }
                    },
                    "cornerRadius": 0,
                    "wrapper": {
                        "actualSize": {
                            "width": 12.906056461944786,
                            "height": 38.33142971478344
                        },
                        "offsetX": 511.85697176902755,
                        "offsetY": 363.1657148573917
                    },
                    "annotations": [],
                    "fixedUserHandles": [],
                    "previewSize": {},
                    "zIndex": 24,
                    "visible": true,
                    "constraints": 470590,
                    "connectionPadding": 0,
                    "hitPadding": 10,
                    "bridgeSpace": 10,
                    "sourcePadding": 0,
                    "targetPadding": 0,
                    "tooltip": {
                        "openOn": "Auto"
                    },
                    "parentId": ""
                }, {
                    "shape": {
                        "type": "None"
                    },
                    "type": "Orthogonal",
                    "sourcePortID": "",
                    "sourcePoint": {
                        "x": 560,
                        "y": 417.49
                    },
                    "targetPoint": {
                        "x": 602,
                        "y": 417.49
                    },
                    "id": "connectormTdJ3",
                    "sourceID": "TarefaMIeVG",
                    "zIndex": 26,
                    "targetID": "TarefaKJpm0",
                    "targetPortID": "IAJua",
                    "flip": "None",
                    "segments": [{
                            "type": "Orthogonal",
                            "length": null,
                            "direction": null
                        }
                    ],
                    "sourceDecorator": {
                        "shape": "None",
                        "width": 10,
                        "height": 10,
                        "pivot": {
                            "x": 0,
                            "y": 0.5
                        },
                        "style": {
                            "fill": "black",
                            "strokeColor": "black",
                            "strokeWidth": 1,
                            "strokeDashArray": "",
                            "opacity": 1,
                            "gradient": {
                                "type": "None"
                            }
                        }
                    },
                    "targetDecorator": {
                        "shape": "Arrow",
                        "width": 10,
                        "height": 10,
                        "pivot": {
                            "x": 0,
                            "y": 0.5
                        },
                        "style": {
                            "fill": "black",
                            "strokeColor": "black",
                            "strokeWidth": 1,
                            "strokeDashArray": "",
                            "opacity": 1,
                            "gradient": {
                                "type": "None"
                            }
                        }
                    },
                    "cornerRadius": 0,
                    "wrapper": {
                        "actualSize": {
                            "width": 42,
                            "height": 0
                        },
                        "offsetX": 581,
                        "offsetY": 417.49
                    },
                    "style": {
                        "strokeWidth": 1,
                        "strokeColor": "black",
                        "fill": "transparent",
                        "strokeDashArray": "None",
                        "opacity": 1,
                        "gradient": {
                            "type": "None"
                        }
                    },
                    "annotations": [],
                    "fixedUserHandles": [],
                    "visible": true,
                    "constraints": 470590,
                    "sourcePadding": 0,
                    "targetPadding": 0,
                    "tooltip": {
                        "openOn": "Auto"
                    },
                    "connectionPadding": 0,
                    "bridgeSpace": 10,
                    "hitPadding": 10,
                    "parentId": ""
                }, {
                    "shape": {
                        "type": "None"
                    },
                    "type": "Orthogonal",
                    "sourcePortID": "",
                    "sourcePoint": {
                        "x": 732,
                        "y": 417.49
                    },
                    "targetPoint": {
                        "x": 774,
                        "y": 417.49
                    },
                    "id": "connectorS8FCH",
                    "sourceID": "TarefaKJpm0",
                    "zIndex": 28,
                    "targetID": "Gateway-Exclusivel7TOi",
                    "targetPortID": "MSigX",
                    "flip": "None",
                    "segments": [{
                            "type": "Orthogonal",
                            "length": null,
                            "direction": null
                        }
                    ],
                    "sourceDecorator": {
                        "shape": "None",
                        "width": 10,
                        "height": 10,
                        "pivot": {
                            "x": 0,
                            "y": 0.5
                        },
                        "style": {
                            "fill": "black",
                            "strokeColor": "black",
                            "strokeWidth": 1,
                            "strokeDashArray": "",
                            "opacity": 1,
                            "gradient": {
                                "type": "None"
                            }
                        }
                    },
                    "targetDecorator": {
                        "shape": "Arrow",
                        "width": 10,
                        "height": 10,
                        "pivot": {
                            "x": 0,
                            "y": 0.5
                        },
                        "style": {
                            "fill": "black",
                            "strokeColor": "black",
                            "strokeWidth": 1,
                            "strokeDashArray": "",
                            "opacity": 1,
                            "gradient": {
                                "type": "None"
                            }
                        }
                    },
                    "cornerRadius": 0,
                    "wrapper": {
                        "actualSize": {
                            "width": 42,
                            "height": 0
                        },
                        "offsetX": 753,
                        "offsetY": 417.49
                    },
                    "style": {
                        "strokeWidth": 1,
                        "strokeColor": "black",
                        "fill": "transparent",
                        "strokeDashArray": "",
                        "opacity": 1,
                        "gradient": {
                            "type": "None"
                        }
                    },
                    "annotations": [],
                    "fixedUserHandles": [],
                    "visible": true,
                    "constraints": 470590,
                    "sourcePadding": 0,
                    "targetPadding": 0,
                    "tooltip": {
                        "openOn": "Auto"
                    },
                    "connectionPadding": 0,
                    "bridgeSpace": 10,
                    "hitPadding": 10,
                    "parentId": ""
                }, {
                    "shape": {
                        "type": "None"
                    },
                    "type": "Orthogonal",
                    "sourcePortID": "JxaVm",
                    "sourcePoint": {
                        "x": 809,
                        "y": 417.49
                    },
                    "targetPoint": {
                        "x": 898,
                        "y": 417.49
                    },
                    "id": "connectorP67B4",
                    "sourceID": "Gateway-Exclusivel7TOi",
                    "zIndex": 38,
                    "targetID": "Tarefawx6id",
                    "targetPortID": "",
                    "flip": "None",
                    "segments": [{
                            "type": "Orthogonal",
                            "length": null,
                            "direction": null
                        }
                    ],
                    "sourceDecorator": {
                        "shape": "None",
                        "width": 10,
                        "height": 10,
                        "pivot": {
                            "x": 0,
                            "y": 0.5
                        },
                        "style": {
                            "fill": "black",
                            "strokeColor": "black",
                            "strokeWidth": 1,
                            "strokeDashArray": "",
                            "opacity": 1,
                            "gradient": {
                                "type": "None"
                            }
                        }
                    },
                    "targetDecorator": {
                        "shape": "Arrow",
                        "width": 10,
                        "height": 10,
                        "pivot": {
                            "x": 0,
                            "y": 0.5
                        },
                        "style": {
                            "fill": "black",
                            "strokeColor": "black",
                            "strokeWidth": 1,
                            "strokeDashArray": "",
                            "opacity": 1,
                            "gradient": {
                                "type": "None"
                            }
                        }
                    },
                    "cornerRadius": 0,
                    "wrapper": {
                        "actualSize": {
                            "width": 89,
                            "height": 0
                        },
                        "offsetX": 853.5,
                        "offsetY": 417.49
                    },
                    "style": {
                        "strokeWidth": 1,
                        "strokeColor": "black",
                        "fill": "transparent",
                        "strokeDashArray": "",
                        "opacity": 1,
                        "gradient": {
                            "type": "None"
                        }
                    },
                    "annotations": [],
                    "fixedUserHandles": [],
                    "visible": true,
                    "constraints": 470590,
                    "sourcePadding": 0,
                    "targetPadding": 0,
                    "tooltip": {
                        "openOn": "Auto"
                    },
                    "connectionPadding": 0,
                    "bridgeSpace": 10,
                    "hitPadding": 10,
                    "parentId": ""
                }
            ],
            "contextMenuSettings": {
                "show": true,
                "items": [{
                        "text": "Duplicar",
                        "id": "duplicate"
                    }
                ],
                "showCustomMenuOnly": true
            },
            "contextMenuOpen": {},
            "contextMenuClick": {},
            "enableRtl": false,
            "locale": "en-US",
            "enablePersistence": false,
            "scrollSettings": {
                "viewPortWidth": 1127.4000244140625,
                "viewPortHeight": 1000,
                "currentZoom": 0.2325680393613779,
                "horizontalOffset": 169.83,
                "verticalOffset": 196.52,
                "padding": {
                    "left": 50,
                    "right": 50,
                    "top": 50,
                    "bottom": 50
                },
                "scrollLimit": "Infinity",
                "canAutoScroll": false,
                "minZoom": 0.2,
                "maxZoom": 30
            },
            "rulerSettings": {
                "showRulers": false,
                "horizontalRuler": {
                    "orientation": "Horizontal",
                    "arrangeTick": null
                },
                "verticalRuler": {
                    "orientation": "Vertical",
                    "arrangeTick": null
                }
            },
            "backgroundColor": "transparent",
            "constraints": 500,
            "layout": {
                "type": "None",
                "enableAnimation": true,
                "connectionPointOrigin": "SamePoint",
                "arrangement": "Nonlinear",
                "enableRouting": false
            },
            "snapSettings": {
                "constraints": 31,
                "gridType": "Lines",
                "verticalGridlines": {
                    "lineIntervals": [1.25, 18.75, 0.25, 19.75, 0.25, 19.75, 0.25, 19.75, 0.25, 19.75],
                    "snapIntervals": [20],
                    "lineDashArray": "",
                    "lineColor": "lightgray"
                },
                "horizontalGridlines": {
                    "lineIntervals": [1.25, 18.75, 0.25, 19.75, 0.25, 19.75, 0.25, 19.75, 0.25, 19.75],
                    "snapIntervals": [20],
                    "lineDashArray": "",
                    "lineColor": "lightgray"
                },
                "snapObjectDistance": 5
            },
            "dataSourceSettings": {
                "dataManager": null,
                "dataSource": null,
                "crudAction": {
                    "read": ""
                },
                "connectionDataSource": {
                    "crudAction": {
                        "read": ""
                    }
                }
            },
            "mode": "SVG",
            "layers": [{
                    "objects": ["Títulof3rS2", "Iniciar-cronômetroP0cfO", "nodeNlPn3", "Tarefadn24E", "connectorqvrHT", "TarefaMIeVG", "connectorK89KV", "Objeto-de-DadosumK60", "Linha-Bezier-2tqUAl", "TarefaKJpm0", "connectormTdJ3", "Gateway-Exclusivel7TOi", "connectorS8FCH", "nodedZZPe", "nodetXaTa", "Tarefawx6id", "connectorP67B4", "nodeH3qPR", "FunçãoV9ZVv", "FunçãocJoAT", "FunçãoFRGNE"],
                    "id": "default_layer",
                    "visible": true,
                    "lock": false,
                    "zIndex": 0,
                    "objectZIndex": 108
                }
            ],
            "diagramSettings": {
                "inversedAlignment": true
            },
            "pageSettings": {
                "boundaryConstraints": "Infinity",
                "orientation": "Landscape",
                "height": 816,
                "width": 1056,
                "background": {
                    "source": "",
                    "color": "transparent"
                },
                "showPageBreaks": false,
                "fitOptions": {
                    "canFit": false
                },
                "multiplePage": false
            },
            "selectedItems": {
                "nodes": [],
                "connectors": [],
                "wrapper": null,
                "constraints": 16382,
                "userHandles": [],
                "rotateAngle": 0,
                "pivot": {
                    "x": 0.5,
                    "y": 0.5
                },
                "width": 34,
                "height": 2,
                "offsetX": 1719,
                "offsetY": 426.125,
                "rubberBandSelectionMode": "CompleteIntersect"
            },
            "basicElements": [],
            "tooltip": {
                "content": "",
                "relativeMode": "Mouse"
            },
            "commandManager": {
                "commands": []
            },
            "dragEnter": {},
            "tool": 3,
            "bridgeDirection": "Top",
            "drawingObject": {
                "type": "Orthogonal",
                "sourcePortID": "wTZha"
            },
            "customCursor": [],
            "version": 17.1
        }`;
        diagram.loadDiagram(data);
        let lablePosition = document.getElementById('Tarefawx6id' + '_' + diagram.nameTable['Tarefawx6id'].annotations[0].id).getBoundingClientRect();
        let nodePosition = document.getElementById('Tarefawx6id').getBoundingClientRect();
        let x1 = Math.round((nodePosition as any).x);
        let z1 = Math.round((lablePosition as any).x);
        let check: boolean = numbersinranges(z1, x1 - 2, x1 + 2)
        expect(check).toEqual(true);
        done();
    });
});

