/**
 * Annotation interaction - Test Cases
 */
import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../src/diagram/diagram';
import { HtmlModel, ImageModel, NodeModel, PathModel } from '../../src/diagram/objects/node-model';
import { BasicShape, Node } from '../../src/diagram/objects/node';
import { ConnectorModel } from '../../src/diagram/objects/connector-model';
import { MouseEvents } from '../diagram/interaction/mouseevents.spec';
import { AnnotationConstraints, DiagramConstraints, Shapes } from '../../src/diagram/enum/enum';
import {

    BpmnDiagrams,
    NodeConstraints,
    PhaseModel,
    SwimLaneModel,

} from '../../src/diagram/index';
import { Selector } from '../../src/diagram/objects/node';
import { DiagramElement } from '../../src/diagram/core/elements/diagram-element';
import { PointModel } from '../../src/diagram/primitives/point-model';
import { identityMatrix, rotateMatrix, transformPointByMatrix, Matrix } from '../../src/diagram/primitives/matrix';
import { GroupableView } from '../../src/diagram/core/containers/container';
import { UndoRedo } from '../../src/diagram/objects/undo-redo';
import { profile, inMB, getMemoryProfile } from '../common.spec';
import { Snapping } from '../../src/diagram/objects/snapping';
import { IHistoryChangeArgs, PointPortModel, ShapeAnnotationModel } from '../../src';
import { DiagramCollaboration } from '../../src/diagram/objects/collaboration';
Diagram.Inject(UndoRedo, Snapping, DiagramCollaboration, BpmnDiagrams);

function collaborativeNodeDrag(diagram: Diagram) {
    let diagramCanvas: HTMLElement; let left: number; let top: number;
    diagramCanvas = document.getElementById(diagram.element.id + 'content');
    left = diagram.element.offsetLeft; top = diagram.element.offsetTop;
    let mouseEvents: MouseEvents = new MouseEvents();
    if ((diagram.selectedItems as Selector).nodes) {
        let textElement: DiagramElement = diagram.selectedItems.wrapper.children[0];
        let centerX = textElement.offsetX;
        let centerY = textElement.offsetY;
        mouseEvents.mouseDownEvent(diagramCanvas, centerX + diagram.element.offsetLeft, centerY + diagram.element.offsetTop);
        mouseEvents.mouseMoveEvent(diagramCanvas, centerX + diagram.element.offsetLeft + 20, centerY + diagram.element.offsetTop);
        mouseEvents.mouseMoveEvent(diagramCanvas, centerX + diagram.element.offsetLeft + 20, centerY + diagram.element.offsetTop + 20);
        mouseEvents.mouseUpEvent(diagramCanvas, centerX + diagram.element.offsetLeft + 20, centerY + diagram.element.offsetTop + 20);
    }
}
function collaborativeNodeChangeShape(type: Shapes, val: string) {
    switch (type) {
        case 'Basic':
            // val expected to be the basic shape name, e.g. 'Cylinder', 'Pentagon'
            return { type: 'Basic', shape: val };

        case 'Path':
            // val expected to be SVG path data, e.g. 'M10 10 L50 50 ...'
            return { type: 'Path', data: val };

        case 'Image':
            // val expected to be a URL or base64 data URI for the image source
            return { type: 'Image', source: val };
        case 'HTML':
            return { type: 'HTML', content: val };
        default:
            // Fallback: return generic shape object so callers won't break
            return { type: String(type), value: val };
    }
}
function collaborativeNodeResize(diagram: Diagram, direction: string): void {
    if ((diagram.selectedItems as Selector).nodes) {
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


function collaborativeNodeRotate(diagram: Diagram, value: number) {
    let diagramCanvas: HTMLElement; let left: number; let top: number;
    diagramCanvas = document.getElementById(diagram.element.id + 'content');
    left = diagram.element.offsetLeft; top = diagram.element.offsetTop;
    let mouseEvents: MouseEvents = new MouseEvents();
    if ((diagram.selectedItems as Selector).nodes) {
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

describe('Collaboration interactions', () => {
    describe('Node Interactions', () => {
        describe('Node mouse Interactions', () => {
            let diagram: Diagram;
            let diagram2: Diagram;
            let ele: HTMLElement;
            let diagramEle1: HTMLElement;
            let diagramEle2: HTMLElement;
            let mouseEvents: MouseEvents = new MouseEvents();
            let diagramCanvas1: HTMLElement;
            let diagramCanvas2: HTMLElement;
            let left1: number; let top1: number;
            let left2: number; let top2: number;


            beforeAll((): void => {
                const isDef = (o: any) => o !== undefined && o !== null;
                if (!isDef(window.performance)) {
                    this.skip(); //Skips test (in Chai)
                    return;
                }
                ele = createElement('div', { id: 'NodeInteraction' });
                diagramEle1 = createElement('div', { id: 'diagram1' });
                diagramEle2 = createElement('div', { id: 'diagram2' })
                ele.appendChild(diagramEle1);
                ele.appendChild(diagramEle2);
                document.body.appendChild(ele);
                let nodes: NodeModel[] = [{
                    id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100,

                }];
                diagram = new Diagram({
                    width: 800, height: 500, nodes: nodes,
                    enableCollaborativeEditing: true,
                    historyChange: function (args: IHistoryChangeArgs) {
                        let changes: string[] = diagram.getDiagramUpdates(args);
                        if (changes.length > 0) {
                            diagram2.setDiagramUpdates(changes);
                        }
                    }
                });
                diagram2 = new Diagram({
                    width: 800, height: 500, nodes: nodes,
                    enableCollaborativeEditing: true,
                })
                diagram.appendTo('#diagram1');
                diagram2.appendTo("#diagram2");
                diagramCanvas1 = document.getElementById(diagram.element.id + 'content');
                diagramCanvas2 = document.getElementById(diagram2.element.id + 'content');
                mouseEvents.clickEvent(diagramCanvas1, 1, 1);
                left1 = diagram.element.offsetLeft; top1 = diagram.element.offsetTop;
            });

            afterAll((): void => {
                mouseEvents = null;
                diagram.destroy();
                diagram2.destroy();
                diagramEle1.remove();
                diagramEle2.remove();
                ele.remove();
            });

            it('Resize', (done: Function) => {
                diagram.select([diagram.nodes[0]]);
                collaborativeNodeResize(diagram, "resizeNorth");
                let node2 = diagram2.nodes[0].wrapper.actualSize;
                let node1 = diagram.nodes[0].wrapper.actualSize;
                expect(node2.width == node1.width).toBe(true);
                expect(node2.height == node1.height).toBe(true);
                collaborativeNodeResize(diagram, "resizeSouth");
                expect(node2.width == node1.width).toBe(true);
                expect(node2.height == node1.height).toBe(true);
                done();
            });
            it('Rotate', (done: Function) => {
                diagram.select([diagram.nodes[0]]);
                collaborativeNodeRotate(diagram, 30);
                let node2 = diagram2.nodes[0].wrapper;
                let node1 = diagram.nodes[0].wrapper;
                expect(node2.rotateAngle == node1.rotateAngle).toBe(true);
                diagram.undo();
                expect(node2.rotateAngle == 0).toBe(true);
                done();
            });
            it('Adding nodes', (done: Function) => {
                let addingNodes: NodeModel[] = [{
                    id: 'node2', width: 100, height: 100, offsetX: 300, offsetY: 300,
                    annotations: [{ offset: { x: 2, y: 1.5 }, content: 'Path Element', constraints: AnnotationConstraints.Interaction, width: 100, height: 100 }]
                }];
                diagram.addElements(addingNodes);
                expect(diagram.nodes.length == 2).toBe(true);
                expect(diagram2.nodes.length == 2).toBe(true);
                diagram.undo();
                expect(diagram.nodes.length == 1).toBe(true);
                expect(diagram2.nodes.length == 1).toBe(true);
                diagram.redo();
                expect(diagram.nodes.length == 2).toBe(true);
                expect(diagram2.nodes.length == 2).toBe(true);
                done();
            });
            it('Port adding', (done: Function) => {
                let ports: PointPortModel[] = [{ width: 20, height: 20, offset: { x: 0.5, y: 1 } }]
                diagram.addPorts(diagram.nodes[0], ports);
                expect(diagram.nodes[0].ports.length == 1).toBe(true);
                expect(diagram2.nodes[0].ports.length == 1).toBe(true);
                diagram.undo();
                expect(diagram.nodes[0].ports.length == 0).toBe(true);
                expect(diagram2.nodes[0].ports.length == 0).toBe(true);
                diagram.redo()
                expect(diagram.nodes[0].ports.length == 1).toBe(true);
                expect(diagram2.nodes[0].ports.length == 1).toBe(true);
                done();
            });
            it('label add and editing', (done: Function) => {
                let annotations: ShapeAnnotationModel[] = [{ content: 'newAnnotation', visibility: true }];

                diagram.addLabels(diagram.nodes[0], annotations);
                expect(diagram.nodes[0].annotations[0].content == "newAnnotation").toBe(true);
                expect(diagram2.nodes[0].annotations[0].content == "newAnnotation").toBe(true);
                done();
            });
        })

        describe('Node mouse Drag', () => {
            let diagram: Diagram;
            let diagram2: Diagram;
            let ele: HTMLElement;
            let diagramEle1: HTMLElement;
            let diagramEle2: HTMLElement;
            let mouseEvents: MouseEvents = new MouseEvents();
            let diagramCanvas1: HTMLElement;
            let diagramCanvas2: HTMLElement;
            let left1: number; let top1: number;
            let left2: number; let top2: number;


            beforeAll((): void => {
                const isDef = (o: any) => o !== undefined && o !== null;
                if (!isDef(window.performance)) {
                    this.skip(); //Skips test (in Chai)
                    return;
                }
                ele = createElement('div', { id: 'NodeInteraction' });
                diagramEle1 = createElement('div', { id: 'diagram1' });
                diagramEle2 = createElement('div', { id: 'diagram2' })
                ele.appendChild(diagramEle1);
                ele.appendChild(diagramEle2);
                document.body.appendChild(ele);
                let nodes: NodeModel[] = [{
                    id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100,

                }];
                diagram = new Diagram({
                    width: 800, height: 500, nodes: nodes,
                    enableCollaborativeEditing: true,
                    historyChange: function (args: IHistoryChangeArgs) {
                        let changes: string[] = diagram.getDiagramUpdates(args);
                        if (changes.length > 0) {
                            diagram2.setDiagramUpdates(changes);
                        }
                    }
                });
                diagram2 = new Diagram({
                    width: 800, height: 500, nodes: nodes,
                    enableCollaborativeEditing: true,
                })
                diagram.appendTo('#diagram1');
                diagram2.appendTo("#diagram2");
                diagramCanvas1 = document.getElementById(diagram.element.id + 'content');
                diagramCanvas2 = document.getElementById(diagram2.element.id + 'content');
                mouseEvents.clickEvent(diagramCanvas1, 1, 1);
                left1 = diagram.element.offsetLeft; top1 = diagram.element.offsetTop;
            });

            afterAll((): void => {
                mouseEvents = null;
                diagram.destroy();
                diagram2.destroy();
                diagramEle1.remove();
                diagramEle2.remove();
                ele.remove();
            });


            it('Drag', (done: Function) => {
                diagram.select([diagram.nodes[0]]);
                collaborativeNodeDrag(diagram);
                let node2 = diagram2.nodes[0].wrapper;
                let node1 = diagram.nodes[0].wrapper;
                expect(node2.offsetX == node1.offsetX).toBe(true);
                expect(node2.offsetY == node1.offsetY).toBe(true);

                done();
            });
        })

        describe('Node Diagram Commands', () => {
            let diagram: Diagram;
            let diagram2: Diagram;
            let ele: HTMLElement;
            let diagramEle1: HTMLElement;
            let diagramEle2: HTMLElement;
            let mouseEvents: MouseEvents = new MouseEvents();
            let diagramCanvas1: HTMLElement;
            let diagramCanvas2: HTMLElement;
            let left1: number; let top1: number;
            let left2: number; let top2: number;


            beforeAll((): void => {
                const isDef = (o: any) => o !== undefined && o !== null;
                if (!isDef(window.performance)) {
                    this.skip(); //Skips test (in Chai)
                    return;
                }
                ele = createElement('div', { id: 'NodeInteraction' });
                diagramEle1 = createElement('div', { id: 'diagram1' });
                diagramEle2 = createElement('div', { id: 'diagram2' })
                ele.appendChild(diagramEle1);
                ele.appendChild(diagramEle2);
                document.body.appendChild(ele);
                let nodes: NodeModel[] = [{
                    id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100,
                },
                {
                    id: 'node2', width: 100, height: 100, offsetX: 200, offsetY: 200,
                }];
                diagram = new Diagram({
                    width: 800, height: 500, nodes: nodes,
                    enableCollaborativeEditing: true,
                    historyChange: function (args: IHistoryChangeArgs) {
                        let changes: string[] = diagram.getDiagramUpdates(args);
                        if (changes.length > 0) {
                            diagram2.setDiagramUpdates(changes);
                        }
                    }
                });
                diagram2 = new Diagram({
                    width: 800, height: 500, nodes: nodes,
                    enableCollaborativeEditing: true,
                })
                diagram.appendTo('#diagram1');
                diagram2.appendTo("#diagram2");
                diagramCanvas1 = document.getElementById(diagram.element.id + 'content');
                diagramCanvas2 = document.getElementById(diagram2.element.id + 'content');
                mouseEvents.clickEvent(diagramCanvas1, 1, 1);
                left1 = diagram.element.offsetLeft; top1 = diagram.element.offsetTop;
            });

            afterAll((): void => {
                mouseEvents = null;
                diagram.destroy();
                diagram2.destroy();
                diagramEle1.remove();
                diagramEle2.remove();
                ele.remove();
            });

            it('Remove nodes', (done: Function) => {
                diagram.remove(diagram.nodes[1]);
                expect(diagram.nodes.length == 1).toBe(true);
                expect(diagram2.nodes.length == 1).toBe(true);
                done();
            });

            it('Delete commands', (done: Function) => {
                diagram.select([diagram.nodes[0]]);
                mouseEvents.keyDownEvent(diagramCanvas1, 'Delete');
                expect(diagram.nodes.length == 0).toBe(true);
                expect(diagram2.nodes.length == 0).toBe(true);
                done();
            });
        })
        describe('Node Diagram Copy Paste Commands', () => {
            let diagram: Diagram;
            let diagram2: Diagram;
            let ele: HTMLElement;
            let diagramEle1: HTMLElement;
            let diagramEle2: HTMLElement;
            let mouseEvents: MouseEvents = new MouseEvents();
            let diagramCanvas1: HTMLElement;
            let diagramCanvas2: HTMLElement;
            let left1: number; let top1: number;
            let left2: number; let top2: number;


            beforeAll((): void => {
                const isDef = (o: any) => o !== undefined && o !== null;
                if (!isDef(window.performance)) {
                    this.skip(); //Skips test (in Chai)
                    return;
                }
                ele = createElement('div', { id: 'NodeInteraction' });
                diagramEle1 = createElement('div', { id: 'diagram1' });
                diagramEle2 = createElement('div', { id: 'diagram2' })
                ele.appendChild(diagramEle1);
                ele.appendChild(diagramEle2);
                document.body.appendChild(ele);
                let nodes: NodeModel[] = [{
                    id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100,

                }];
                diagram = new Diagram({
                    width: 800, height: 500, nodes: nodes,
                    enableCollaborativeEditing: true,
                    historyChange: function (args: IHistoryChangeArgs) {
                        let changes: string[] = diagram.getDiagramUpdates(args);
                        if (changes.length > 0) {
                            diagram2.setDiagramUpdates(changes);
                        }
                    }
                });
                diagram2 = new Diagram({
                    width: 800, height: 500, nodes: nodes,
                    enableCollaborativeEditing: true,
                })
                diagram.appendTo('#diagram1');
                diagram2.appendTo("#diagram2");
                diagramCanvas1 = document.getElementById(diagram.element.id + 'content');
                diagramCanvas2 = document.getElementById(diagram2.element.id + 'content');
                mouseEvents.clickEvent(diagramCanvas1, 1, 1);
                left1 = diagram.element.offsetLeft; top1 = diagram.element.offsetTop;
            });

            afterAll((): void => {
                diagram.destroy();
                diagram2.destroy();
                diagramEle1.remove();
                diagramEle2.remove();
                ele.remove();
            });

            it('Copy paste commands', (done: Function) => {
                diagram.select([diagram.nodes[0]]);
                mouseEvents.keyDownEvent(diagramCanvas1, 'C', true);
                mouseEvents.keyDownEvent(diagramCanvas1, 'V', true);
                expect(diagram.nodes.length == 2).toBe(true);
                expect(diagram2.nodes.length == 2).toBe(true);
                diagram.undo();
                expect(diagram.nodes.length == 1).toBe(true);
                expect(diagram2.nodes.length == 1).toBe(true);
                diagram.redo();
                expect(diagram.nodes.length == 2).toBe(true);
                expect(diagram2.nodes.length == 2).toBe(true);
                done();
            });
        })

        describe('Node Property Change', () => {
            let diagram: Diagram;
            let diagram2: Diagram;
            let ele: HTMLElement;
            let diagramEle1: HTMLElement;
            let diagramEle2: HTMLElement;
            let mouseEvents: MouseEvents = new MouseEvents();
            let diagramCanvas1: HTMLElement;
            let diagramCanvas2: HTMLElement;
            let left1: number; let top1: number;
            let left2: number; let top2: number;


            beforeAll((): void => {
                const isDef = (o: any) => o !== undefined && o !== null;
                if (!isDef(window.performance)) {
                    this.skip(); //Skips test (in Chai)
                    return;
                }
                ele = createElement('div', { id: 'NodeInteraction' });
                diagramEle1 = createElement('div', { id: 'diagram3' });
                diagramEle2 = createElement('div', { id: 'diagram4' })
                ele.appendChild(diagramEle1);
                ele.appendChild(diagramEle2);
                document.body.appendChild(ele);
                let nodes: NodeModel[] = [{
                    id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100,

                }];
                diagram = new Diagram({
                    width: 800, height: 500, nodes: nodes,
                    enableCollaborativeEditing: true,
                    historyChange: function (args: IHistoryChangeArgs) {
                        let changes: string[] = diagram.getDiagramUpdates(args);
                        if (changes.length > 0) {
                            diagram2.setDiagramUpdates(changes);
                        }
                    }
                });
                diagram2 = new Diagram({
                    width: 800, height: 500, nodes: nodes,
                    enableCollaborativeEditing: true,
                })
                diagram.appendTo('#diagram3');
                diagram2.appendTo("#diagram4");
                diagramCanvas1 = document.getElementById(diagram.element.id + 'content');
                diagramCanvas2 = document.getElementById(diagram2.element.id + 'content');
                mouseEvents.clickEvent(diagramCanvas1, 1, 1);
                left1 = diagram.element.offsetLeft; top1 = diagram.element.offsetTop;
            });

            afterAll((): void => {
                diagram.destroy();
                diagram2.destroy();
                diagramEle1.remove();
                diagramEle2.remove();
                ele.remove();
            });

            it('Node property changes add expandIcon', (done: Function) => {
                diagram.nodes[0].expandIcon = { shape: "Minus", width: 100 };
                diagram.dataBind();
                expect(diagram2.nodes[0].expandIcon.shape == "Minus").toBe(true);
                expect(diagram2.nodes[0].expandIcon.width == 100).toBe(true);
                diagram.nodes[0].expandIcon.fill = "green";
                diagram.nodes[0].expandIcon.offset.x = 0.2;
                diagram.dataBind();
                expect(diagram2.nodes[0].expandIcon.fill == "green").toBe(true);
                expect(diagram2.nodes[0].expandIcon.offset.x == 0.2).toBe(true);

                done();
            });
            it('Node property changes shadow', (done: Function) => {
                diagram.nodes[0].constraints = NodeConstraints.Default | NodeConstraints.Shadow;
                diagram.nodes[0].shadow = { angle: 20, color: 'green', distance: 20, opacity: 0.3 };
                diagram.dataBind();
                expect((diagram2.nodes[0].constraints & NodeConstraints.Shadow) !== 0).toBe(true)
                expect(diagram2.nodes[0].shadow.angle == 20).toBe(true);
                expect(diagram2.nodes[0].shadow.color == "green").toBe(true);
                diagram.nodes[0].shadow.color = "red";
                diagram.dataBind();
                expect(diagram2.nodes[0].shadow.color == "red").toBe(true);

                done();
            });
            it('Node property changes shape', (done: Function) => {
                diagram.nodes[0].shape = { type: 'Basic', shape: "Cylinder" }
                diagram.dataBind();
                let shape: BasicShape = diagram2.nodes[0].shape as BasicShape;
                expect(shape.shape == "Cylinder").toBe(true);
                diagram.nodes[0].shape = { type: 'Basic', shape: "Pentagon" }
                diagram.dataBind();
                expect(shape.shape == "Pentagon").toBe(true);
                done();
            });
            it('Node property changes constraints', (done: Function) => {
                diagram.nodes[0].constraints = NodeConstraints.Default & ~NodeConstraints.Delete;
                diagram.dataBind();
                expect((diagram2.nodes[0].constraints & NodeConstraints.Delete) == 0).toBe(true);
                diagram2.remove(diagram2.nodes[0]);
                expect(diagram2.nodes.length == 1).toBe(true);
                diagram.undo();

                done();
            });

            it('Change Basic shape types sequence (Cylinder -> Pentagon -> Ellipse)', (done: Function) => {
                // Start with Cylinder
                const b1: BasicShape = collaborativeNodeChangeShape('Basic', 'Cylinder') as BasicShape;
                diagram.nodes[0].shape = b1;
                diagram.dataBind();

                const shape2_1 = diagram2.nodes[0].shape as BasicShape;
                expect(shape2_1.type === 'Basic' && shape2_1.shape === 'Cylinder').toBe(true);

                // Change to Pentagon
                const b2: BasicShape = collaborativeNodeChangeShape('Basic', 'Pentagon') as BasicShape;
                diagram.nodes[0].shape = b2;
                diagram.dataBind();

                const shape2_2 = diagram2.nodes[0].shape as BasicShape;
                expect(shape2_2.type === 'Basic' && shape2_2.shape === 'Pentagon').toBe(true);

                // Change to Ellipse
                const b3: BasicShape = collaborativeNodeChangeShape('Basic', 'Ellipse') as BasicShape;
                diagram.nodes[0].shape = b3;
                diagram.dataBind();

                const shape2_3 = diagram2.nodes[0].shape as BasicShape;
                expect(shape2_3.type === 'Basic' && shape2_3.shape === 'Ellipse').toBe(true);

                done();
            });

            it('Change between Basic, Path, Image and back to Basic (typed)', (done: Function) => {
                // Basic -> Rectangle
                const basicRect: BasicShape = collaborativeNodeChangeShape('Basic', 'Rectangle') as BasicShape;
                diagram.nodes[0].shape = basicRect;
                diagram.dataBind();

                let shape2 = diagram2.nodes[0].shape as BasicShape;
                expect(shape2.type === 'Basic' && shape2.shape === 'Rectangle').toBe(true);

                // Path -> simple rectangle path
                const examplePath = 'M10 10 L90 10 L90 90 L10 90 Z';
                const pathShape: PathModel = collaborativeNodeChangeShape('Path', examplePath) as PathModel;
                diagram.nodes[0].shape = pathShape;
                diagram.dataBind();

                const shapePath2 = diagram2.nodes[0].shape as PathModel;
                // If your implementation uses `pathData` instead of `data`, change this check to pathData.
                expect(shapePath2.type === 'Path' && shapePath2.data === examplePath).toBe(true);

                // Back to Basic -> Diamond
                const basicDiamond: BasicShape = collaborativeNodeChangeShape('Basic', 'Diamond') as BasicShape;
                diagram.nodes[0].shape = basicDiamond;
                diagram.dataBind();

                const shape2_final = diagram2.nodes[0].shape as BasicShape;
                expect(shape2_final.type === 'Basic' && shape2_final.shape === 'Diamond').toBe(true);

                done();
            });

            it('Multiple Basic shape changes in sequence propagate to collaborator (typed)', (done: Function) => {
                const basicSequence = ['Triangle', 'Hexagon', 'Star', 'RoundedRectangle'];
                for (const s of basicSequence) {
                    const b: BasicShape = collaborativeNodeChangeShape('Basic', s) as BasicShape;
                    diagram.nodes[0].shape = b;
                    diagram.dataBind();
                    const shape2 = diagram2.nodes[0].shape as BasicShape;
                    expect(shape2.type === 'Basic' && shape2.shape === s).toBe(true);
                }
                done();
            });
        })

        describe('Node Property Changes', () => {
            let diagram: Diagram;
            let diagram2: Diagram;
            let ele: HTMLElement;
            let diagramEle1: HTMLElement;
            let diagramEle2: HTMLElement;
            let mouseEvents: MouseEvents = new MouseEvents();
            let diagramCanvas1: HTMLElement;
            let diagramCanvas2: HTMLElement;
            let left1: number; let top1: number;
            let left2: number; let top2: number;


            beforeAll((): void => {
                const isDef = (o: any) => o !== undefined && o !== null;
                if (!isDef(window.performance)) {
                    this.skip(); //Skips test (in Chai)
                    return;
                }
                ele = createElement('div', { id: 'NodeInteraction' });
                diagramEle1 = createElement('div', { id: 'diagram3' });
                diagramEle2 = createElement('div', { id: 'diagram4' })
                ele.appendChild(diagramEle1);
                ele.appendChild(diagramEle2);
                document.body.appendChild(ele);
                let nodes: NodeModel[] = [{
                    id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100,

                }];
                diagram = new Diagram({
                    width: 800, height: 500, nodes: nodes,
                    enableCollaborativeEditing: true,
                    historyChange: function (args: IHistoryChangeArgs) {
                        let changes: string[] = diagram.getDiagramUpdates(args);
                        if (changes.length > 0) {
                            diagram2.setDiagramUpdates(changes);
                        }
                    }
                });
                diagram2 = new Diagram({
                    width: 800, height: 500, nodes: nodes,
                    enableCollaborativeEditing: true,
                })
                diagram.appendTo('#diagram3');
                diagram2.appendTo("#diagram4");
                diagramCanvas1 = document.getElementById(diagram.element.id + 'content');
                diagramCanvas2 = document.getElementById(diagram2.element.id + 'content');
                mouseEvents.clickEvent(diagramCanvas1, 1, 1);
                left1 = diagram.element.offsetLeft; top1 = diagram.element.offsetTop;
            });

            afterAll((): void => {
                diagram.destroy();
                diagram2.destroy();
                diagramEle1.remove();
                diagramEle2.remove();
                ele.remove();
            });

            it('Node property changes width and height', (done: Function) => {
                diagram.nodes[0].width = 500;
                diagram.nodes[0].height = 500;
                diagram.dataBind();
                expect(diagram2.nodes[0].width == 500).toBe(true);
                expect(diagram.nodes[0].height == 500).toBe(true);
                diagram.undo();
                expect(diagram2.nodes[0].width == 100).toBe(true);
                expect(diagram2.nodes[0].height == 100).toBe(true);
                diagram.redo();
                expect(diagram2.nodes[0].width == 500).toBe(true);
                expect(diagram2.nodes[0].height == 500).toBe(true);
                diagram.undo();
                expect(diagram2.nodes[0].width == 100).toBe(true);
                expect(diagram2.nodes[0].height == 100).toBe(true);
                done();
            });

            it('Node property changes offsetx and offsety', (done: Function) => {
                diagram.nodes[0].offsetX = 500;
                diagram.nodes[0].offsetY = 500;
                diagram.dataBind();
                expect(diagram2.nodes[0].offsetX == 500).toBe(true);
                expect(diagram2.nodes[0].offsetY == 500).toBe(true);
                diagram.undo();
                expect(diagram2.nodes[0].offsetX == 100).toBe(true);
                expect(diagram2.nodes[0].offsetY == 100).toBe(true);
                diagram.redo();
                expect(diagram2.nodes[0].offsetX == 500).toBe(true);
                expect(diagram2.nodes[0].offsetY == 500).toBe(true);
                diagram.undo();
                expect(diagram2.nodes[0].offsetX == 100).toBe(true);
                expect(diagram2.nodes[0].offsetY == 100).toBe(true);
                done();
            });
            it('Node property changes rotateAngle', (done: Function) => {
                diagram.nodes[0].rotateAngle = 30;
                diagram.dataBind();
                expect(diagram2.nodes[0].rotateAngle == 30).toBe(true);
                diagram.nodes[0].rotateAngle = 60;
                diagram.dataBind();
                expect(diagram2.nodes[0].rotateAngle == 60).toBe(true);
                diagram.undo();
                expect(diagram2.nodes[0].rotateAngle == 30).toBe(true);
                diagram.undo();
                expect(diagram2.nodes[0].rotateAngle == 0).toBe(true);
                done();
            });

            it('Node property changes rotateAngle', (done: Function) => {
                diagram.nodes[0].visible = false;
                diagram.dataBind();
                expect(diagram2.nodes[0].visible == false).toBe(true);
                diagram.undo();
                expect(diagram2.nodes[0].visible == true).toBe(true);
                diagram.redo();
                expect(diagram2.nodes[0].visible == false).toBe(true);
                diagram.nodes[0].visible = true;
                diagram.dataBind();
                expect(diagram2.nodes[0].visible == true).toBe(true);
                done();
            });

            it('Node property changes gradient', (done: Function) => {
                diagram.nodes[0].style.gradient = {
                    type: 'Linear',
                    x1: 0,
                    y1: 0,
                    x2: 50,
                    y2: 50,
                    stops: [
                        { color: '#FC01E7', offset: 25 },
                        { color: '#1993D5', offset: 100 }
                    ]
                };
                diagram.dataBind();
                expect(diagram2.nodes[0].style.gradient.type == 'Linear').toBe(true);
                done();
            });
            it('Node property changes style', (done: Function) => {
                diagram.nodes[0].style.fill = "red";
                diagram.dataBind();
                expect(diagram2.nodes[0].style.fill == "red").toBe(true);
                diagram.nodes[0].style.fill = "blue";
                diagram.dataBind();
                expect(diagram2.nodes[0].style.fill == "blue").toBe(true);
                diagram.undo();
                expect(diagram2.nodes[0].style.fill == "red").toBe(true);
                diagram.redo();
                expect(diagram2.nodes[0].style.fill == "blue").toBe(true);
                done();
            });
            it('Node property changes border', (done: Function) => {
                diagram.nodes[0].style.strokeColor = "blue";
                diagram.nodes[0].style.strokeWidth = 10;
                diagram.dataBind();
                expect(diagram2.nodes[0].style.strokeColor == "blue");
                expect(diagram2.nodes[0].style.strokeWidth == 10);
                done();
            });
        })

        describe('Node Port Property Change', () => {
            let diagram: Diagram;
            let diagram2: Diagram;
            let ele: HTMLElement;
            let diagramEle1: HTMLElement;
            let diagramEle2: HTMLElement;
            let mouseEvents: MouseEvents = new MouseEvents();
            let diagramCanvas1: HTMLElement;
            let diagramCanvas2: HTMLElement;
            let left1: number; let top1: number;
            let left2: number; let top2: number;


            beforeAll((): void => {
                const isDef = (o: any) => o !== undefined && o !== null;
                if (!isDef(window.performance)) {
                    this.skip(); //Skips test (in Chai)
                    return;
                }
                ele = createElement('div', { id: 'NodeInteraction' });
                diagramEle1 = createElement('div', { id: 'diagram5' });
                diagramEle2 = createElement('div', { id: 'diagram6' })
                ele.appendChild(diagramEle1);
                ele.appendChild(diagramEle2);
                document.body.appendChild(ele);
                let nodes: NodeModel[] = [{
                    id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100,
                    annotations: [{ id: 'annotation1', content: 'newAnnotation' }],
                    ports: [{ id: 'port1', width: 50, height: 40, offset: { x: 1, y: 1 } }]
                }];
                diagram = new Diagram({
                    width: 800, height: 500, nodes: nodes,
                    enableCollaborativeEditing: true,
                    historyChange: function (args: IHistoryChangeArgs) {
                        let changes: string[] = diagram.getDiagramUpdates(args);
                        if (changes.length > 0) {
                            diagram2.setDiagramUpdates(changes);
                        }
                    }
                });
                diagram2 = new Diagram({
                    width: 800, height: 500, nodes: nodes,
                    enableCollaborativeEditing: true,
                })
                diagram.appendTo('#diagram5');
                diagram2.appendTo("#diagram6");
                diagramCanvas1 = document.getElementById(diagram.element.id + 'content');
                diagramCanvas2 = document.getElementById(diagram2.element.id + 'content');
                mouseEvents.clickEvent(diagramCanvas1, 1, 1);
                left1 = diagram.element.offsetLeft; top1 = diagram.element.offsetTop;
            });

            afterAll((): void => {
                diagram.destroy();
                diagram2.destroy();
                diagramEle1.remove();
                diagramEle2.remove();
                ele.remove();
            });

            it('Node property changes annotation', (done: Function) => {
                let annotation: ShapeAnnotationModel = diagram.nodes[0].annotations[0];
                annotation.offset.x = 1;
                annotation.offset.y = 1;
                diagram.dataBind();
                let annotation2: ShapeAnnotationModel = diagram2.nodes[0].annotations[0];
                expect(annotation2.offset.x == 1).toBe(true);
                expect(annotation2.offset.y == 1).toBe(true);
                annotation.rotationReference = "Page";
                diagram.dataBind();
                expect(annotation2.rotationReference == "Page").toBe(true);
                done();
            });
            it('Node property changes annotation style', (done: Function) => {
                let annotation: ShapeAnnotationModel = diagram.nodes[0].annotations[0];
                annotation.style.color = 'red';
                annotation.style.fill = 'blue';
                diagram.dataBind();
                let annotation2: ShapeAnnotationModel = diagram2.nodes[0].annotations[0];
                expect(annotation2.style.color == 'red').toBe(true);
                expect(annotation2.style.fill == 'blue').toBe(true);
                done();
            });
            it('Node property changes port properties', (done: Function) => {
                let port: PointPortModel = diagram.nodes[0].ports[0];
                port.height = 50;
                port.width = 50;
                diagram.dataBind();
                let port2: PointPortModel = diagram2.nodes[0].ports[0];
                expect(port2.height == 50).toBe(true);
                expect(port2.width == 50).toBe(true);
                port.offset.x = 0;
                port.offset.y = 0;
                diagram.dataBind();
                expect(port2.offset.x == 0).toBe(true);
                expect(port2.offset.y == 0).toBe(true);
                done();
            });
            it('Node property changes port style', (done: Function) => {
                let port: PointPortModel = diagram.nodes[0].ports[0];
                port.style.fill = "red";
                port.style.strokeColor = "blue";
                diagram.dataBind();
                let port2: PointPortModel = diagram2.nodes[0].ports[0];
                expect(port2.style.fill == "red").toBe(true);
                expect(port2.style.strokeColor == "blue").toBe(true);
                done();
            });
            it('Node property changes add port ', (done: Function) => {
                let ports: PointPortModel[] = [{ width: 20, height: 20, offset: { x: 0.5, y: 0.5 } }, { width: 20, height: 20, offset: { x: 1, y: 1 } }]
                diagram.addPorts(diagram.nodes[0], ports);
                expect(diagram2.nodes[0].ports.length == 3);
                done();
            });
        })

        describe('BPMN Node Property Change', () => {
            let diagram: Diagram;
            let diagram2: Diagram;
            let ele: HTMLElement;
            let diagramEle1: HTMLElement;
            let diagramEle2: HTMLElement;
            let mouseEvents: MouseEvents = new MouseEvents();
            let diagramCanvas1: HTMLElement;
            let diagramCanvas2: HTMLElement;
            let left1: number; let top1: number;
            let left2: number; let top2: number;


            beforeAll((): void => {
                const isDef = (o: any) => o !== undefined && o !== null;
                if (!isDef(window.performance)) {
                    this.skip(); //Skips test (in Chai)
                    return;
                }
                ele = createElement('div', { id: 'NodeInteraction' });
                diagramEle1 = createElement('div', { id: 'diagram7' });
                diagramEle2 = createElement('div', { id: 'diagram8' })
                ele.appendChild(diagramEle1);
                ele.appendChild(diagramEle2);
                document.body.appendChild(ele);
                let nodes: NodeModel[] = [{
                    id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100,

                }];
                diagram = new Diagram({
                    width: 800, height: 500, nodes: nodes,
                    enableCollaborativeEditing: true,
                    historyChange: function (args: IHistoryChangeArgs) {
                        let changes: string[] = diagram.getDiagramUpdates(args);
                        if (changes.length > 0) {
                            diagram2.setDiagramUpdates(changes);
                        }
                    }
                });
                diagram2 = new Diagram({
                    width: 800, height: 500, nodes: nodes,
                    enableCollaborativeEditing: true,
                })
                diagram.appendTo('#diagram7');
                diagram2.appendTo("#diagram8");
                diagramCanvas1 = document.getElementById(diagram.element.id + 'content');
                diagramCanvas2 = document.getElementById(diagram2.element.id + 'content');
                mouseEvents.clickEvent(diagramCanvas1, 1, 1);
                left1 = diagram.element.offsetLeft; top1 = diagram.element.offsetTop;
            });

            afterAll((): void => {
                mouseEvents = null;
                diagram.destroy();
                diagram2.destroy();
                diagramEle1.remove();
                diagramEle2.remove();
                ele.remove();
            });

            it('BPMN SubProcess with Event - add process and verify collaborator sync', (done: Function) => {
                // clear diagram before adding BPMN nodes
                diagram.selectAll();
                mouseEvents.keyDownEvent(diagramCanvas1, 'Delete');
                let nodes: NodeModel[] = [
                    {
                        id: 'subProcess',
                        width: 520,
                        height: 250,
                        offsetX: 355,
                        offsetY: 230,
                        constraints: NodeConstraints.Default | NodeConstraints.AllowDrop,
                        shape: {
                            shape: 'Activity',
                            type: 'Bpmn',
                            activity: {
                                activity: 'SubProcess',
                                subProcess: {
                                    collapsed: false,
                                },
                            },
                        },
                    },
                ];
                diagram.addElements(nodes);
                let pro: NodeModel = {
                    id: 'node6', width: 60, height: 60, offsetX: 745, offsetY: 90,
                    shape: {
                        type: 'Bpmn', shape: 'Event',
                    },
                }
                diagram.addElements([pro]);
                expect(diagram.nodes.length === 2).toBe(true);
                expect(diagram2.nodes.length === 2).toBe(true);
                diagram.addProcess(pro, "subProcess")
                expect((diagram2.nodes[1] as Node).processId == "subProcess")
                done();
            });
            it('BPMN Event node - drag interaction and verify collaborator position sync', (done: Function) => {
                mouseEvents.clickEvent(diagramCanvas1, 200, 200);
                collaborativeNodeDrag(diagram);
                collaborativeNodeDrag(diagram);
                collaborativeNodeDrag(diagram);
                expect(diagram.nodes[1].wrapper.offsetX).toBeCloseTo(190);
                expect(diagram.nodes[1].wrapper.offsetY).toBeCloseTo(190);
                expect(diagram2.nodes[1].wrapper.offsetX).toBeCloseTo(190);
                expect(diagram2.nodes[1].wrapper.offsetY).toBeCloseTo(190);

                done();
            });
            it('BPMN Event node - multiple drags and verify final position sync', (done: Function) => {
                mouseEvents.clickEvent(diagramCanvas1, 200, 200);
                collaborativeNodeDrag(diagram);
                collaborativeNodeDrag(diagram);
                expect(diagram.nodes[1].wrapper.offsetY).toBeCloseTo(230);
                expect(diagram2.nodes[1].wrapper.offsetY).toBeCloseTo(230);

                expect(diagram.nodes[1].wrapper.offsetX).toBeCloseTo(230);
                expect(diagram2.nodes[1].wrapper.offsetX).toBeCloseTo(230);
                done();
            });
            it('BPMN nodes - delete command and verify collaborator sync', (done: Function) => {
                diagram.selectAll();
                mouseEvents.keyDownEvent(diagramCanvas1, 'Delete');
                expect(diagram2.nodes.length == 0).toBe(true);
                done();
            });
            it('SwimLane - add and update header annotation at runtime', (done: Function) => {
                let node1: NodeModel = {
                    id: 'swimlane',
                    shape: {
                        type: 'SwimLane',
                        header: {
                            id: 'header1',
                            annotation: {
                                id: 'annotate1', content: 'header1'

                            }
                        },
                        lanes: [
                            {
                                id: 'stackCanvas1',
                                height: 100,
                            },
                        ],
                        phases: [
                            {
                                id: 'phase1',
                                offset: 170,
                                header: { annotation: { content: 'Phase' } },
                            },
                        ],
                        phaseSize: 20,
                    },
                    offsetX: 300,
                    offsetY: 200,
                    height: 200,
                    width: 350,
                };
                diagram.addElements([node1]);
                (diagram.nodes[0].shape as SwimLaneModel).header.annotation.content = "Runtime annotation";
                diagram.dataBind();
                expect((diagram2.nodes[0].shape as SwimLaneModel).header.annotation.content == 'Runtime annotation').toBe(true);
                done();
            });
            it('SwimLane - add new lane and verify collaborator sync', (done: Function) => {

                const lane = [{
                    id: 'stackCanvas330',
                    height: 100,
                    style: { fill: 'lightgrey' },
                    header: {
                        annotation: {
                            content: 'New LANE',
                            style: { fill: 'brown', color: 'white', fontSize: 15 }
                        },
                        style: { fill: 'pink' }
                    }
                }];
                diagram.addLanes(diagram.nodes[0], lane, 1);
                diagram.dataBind();

                const lanes = document.querySelectorAll('[id="swimlanestackCanvas3300_groupElement"]');
                expect(lanes.length == 2).toBe(true);
                done();
            });
            it('SwimLane - add new phase and verify collaborator sync', (done: Function) => {
                diagram2.setDiagramUpdates([
                    "{\"modifiedNodes\":[{\"annotations\":[{\"id\":\"phase154\",\"content\":\"Phase\",\"rotateAngle\":0,\"annotationType\":\"String\",\"style\":{\"strokeWidth\":0,\"strokeColor\":\"transparent\",\"fill\":\"transparent\",\"bold\":false,\"textWrapping\":\"WrapWithOverflow\",\"color\":\"black\",\"whiteSpace\":\"CollapseSpace\",\"fontFamily\":\"Arial\",\"fontSize\":12,\"italic\":false,\"opacity\":1,\"strokeDashArray\":\"\",\"textAlign\":\"Center\",\"textOverflow\":\"Wrap\",\"textDecoration\":\"None\"},\"hyperlink\":{\"link\":\"\",\"hyperlinkOpenState\":\"NewTab\",\"content\":\"\",\"textDecoration\":\"None\"},\"constraints\":4,\"visibility\":true,\"rotationReference\":\"Parent\",\"margin\":{\"right\":0,\"bottom\":0,\"left\":0,\"top\":0},\"horizontalAlignment\":\"Center\",\"verticalAlignment\":\"Center\",\"offset\":{\"x\":0.5,\"y\":0.5}}],\"maxWidth\":200,\"id\":\"swimlanephase154_header\",\"offsetX\":300,\"offsetY\":250,\"style\":{\"fill\":\"#FFFFFF\",\"strokeColor\":\"#606060\",\"strokeWidth\":1,\"strokeDashArray\":\"3,3\",\"gradient\":{\"type\":\"None\"},\"opacity\":1},\"rowIndex\":1,\"columnIndex\":0,\"pivot\":{\"x\":0.5,\"y\":0.5},\"container\":{\"type\":\"Canvas\",\"orientation\":\"Horizontal\"},\"height\":20,\"shape\":{\"type\":\"Basic\",\"shape\":\"Rectangle\",\"cornerRadius\":0},\"ports\":[],\"constraints\":22017646,\"zIndex\":7,\"visible\":true,\"horizontalAlignment\":\"Left\",\"verticalAlignment\":\"Top\",\"backgroundColor\":\"transparent\",\"borderColor\":\"none\",\"borderWidth\":0,\"rotateAngle\":0,\"margin\":{\"right\":0,\"bottom\":0,\"left\":0,\"top\":0},\"flip\":0,\"flipMode\":\"All\",\"wrapper\":{\"actualSize\":{\"width\":200,\"height\":20},\"offsetX\":225,\"offsetY\":160},\"isExpanded\":true,\"expandIcon\":{\"shape\":\"None\"},\"fixedUserHandles\":[],\"inEdges\":[],\"outEdges\":[],\"parentId\":\"swimlane\",\"processId\":\"\",\"umlIndex\":-1,\"isPhase\":true,\"isLane\":false,\"addInfo\":{\"parentId\":\"swimlane\"}}],\"modifiedConnectors\":[],\"entryType\":\"PhaseCollectionChanged\",\"collectionChangedAction\":\"Insert\",\"actionTrigger\":\"CustomAction\",\"propertyChanges\":{\"newObjectValue\":{\"id\":\"phase154\",\"offset\":200,\"style\":{\"fill\":\"#FFFFFF\",\"strokeColor\":\"#606060\",\"strokeWidth\":1,\"strokeDashArray\":\"3,3\",\"gradient\":{\"type\":\"None\"},\"opacity\":1},\"header\":{\"annotation\":{\"id\":\"phase154\",\"content\":\"Phase\"},\"id\":\"swimlanephase154_header\"}}},\"entry\":{\"type\":\"PhaseCollectionChanged\",\"changeType\":\"Insert\"}}"
                ]);
                diagram.setDiagramUpdates([
                    "{\"modifiedNodes\":[{\"annotations\":[{\"id\":\"phase154\",\"content\":\"Phase\",\"rotateAngle\":0,\"annotationType\":\"String\",\"style\":{\"strokeWidth\":0,\"strokeColor\":\"transparent\",\"fill\":\"transparent\",\"bold\":false,\"textWrapping\":\"WrapWithOverflow\",\"color\":\"black\",\"whiteSpace\":\"CollapseSpace\",\"fontFamily\":\"Arial\",\"fontSize\":12,\"italic\":false,\"opacity\":1,\"strokeDashArray\":\"\",\"textAlign\":\"Center\",\"textOverflow\":\"Wrap\",\"textDecoration\":\"None\"},\"hyperlink\":{\"link\":\"\",\"hyperlinkOpenState\":\"NewTab\",\"content\":\"\",\"textDecoration\":\"None\"},\"constraints\":4,\"visibility\":true,\"rotationReference\":\"Parent\",\"margin\":{\"right\":0,\"bottom\":0,\"left\":0,\"top\":0},\"horizontalAlignment\":\"Center\",\"verticalAlignment\":\"Center\",\"offset\":{\"x\":0.5,\"y\":0.5}}],\"maxWidth\":200,\"id\":\"swimlanephase154_header\",\"offsetX\":300,\"offsetY\":250,\"style\":{\"fill\":\"#FFFFFF\",\"strokeColor\":\"#606060\",\"strokeWidth\":1,\"strokeDashArray\":\"3,3\",\"gradient\":{\"type\":\"None\"},\"opacity\":1},\"rowIndex\":1,\"columnIndex\":0,\"pivot\":{\"x\":0.5,\"y\":0.5},\"container\":{\"type\":\"Canvas\",\"orientation\":\"Horizontal\"},\"height\":20,\"shape\":{\"type\":\"Basic\",\"shape\":\"Rectangle\",\"cornerRadius\":0},\"ports\":[],\"constraints\":22017646,\"zIndex\":7,\"visible\":true,\"horizontalAlignment\":\"Left\",\"verticalAlignment\":\"Top\",\"backgroundColor\":\"transparent\",\"borderColor\":\"none\",\"borderWidth\":0,\"rotateAngle\":0,\"margin\":{\"right\":0,\"bottom\":0,\"left\":0,\"top\":0},\"flip\":0,\"flipMode\":\"All\",\"wrapper\":{\"actualSize\":{\"width\":200,\"height\":20},\"offsetX\":225,\"offsetY\":160},\"isExpanded\":true,\"expandIcon\":{\"shape\":\"None\"},\"fixedUserHandles\":[],\"inEdges\":[],\"outEdges\":[],\"parentId\":\"swimlane\",\"processId\":\"\",\"umlIndex\":-1,\"isPhase\":true,\"isLane\":false,\"addInfo\":{\"parentId\":\"swimlane\"}}],\"modifiedConnectors\":[],\"entryType\":\"PhaseCollectionChanged\",\"collectionChangedAction\":\"Insert\",\"actionTrigger\":\"CustomAction\",\"propertyChanges\":{\"newObjectValue\":{\"id\":\"phase154\",\"offset\":200,\"style\":{\"fill\":\"#FFFFFF\",\"strokeColor\":\"#606060\",\"strokeWidth\":1,\"strokeDashArray\":\"3,3\",\"gradient\":{\"type\":\"None\"},\"opacity\":1},\"header\":{\"annotation\":{\"id\":\"phase154\",\"content\":\"Phase\"},\"id\":\"swimlanephase154_header\"}}},\"entry\":{\"type\":\"PhaseCollectionChanged\",\"changeType\":\"Insert\"}}"
                ]);
    
                expect((diagram.nodes[0].shape as SwimLaneModel).phases.length == (diagram2.nodes[0].shape as SwimLaneModel).phases.length).toBe(true);
                done();
            });
        })

        describe('BPMN Event Property Change', () => {
            let diagram: Diagram;
            let diagram2: Diagram;
            let ele: HTMLElement;
            let diagramEle1: HTMLElement;
            let diagramEle2: HTMLElement;
            let mouseEvents: MouseEvents = new MouseEvents();
            let diagramCanvas1: HTMLElement;
            let diagramCanvas2: HTMLElement;
            let left1: number; let top1: number;
            let left2: number; let top2: number;


            beforeAll((): void => {
                const isDef = (o: any) => o !== undefined && o !== null;
                if (!isDef(window.performance)) {
                    this.skip(); //Skips test (in Chai)
                    return;
                }
                ele = createElement('div', { id: 'NodeInteraction' });
                diagramEle1 = createElement('div', { id: 'diagram7' });
                diagramEle2 = createElement('div', { id: 'diagram8' })
                ele.appendChild(diagramEle1);
                ele.appendChild(diagramEle2);
                document.body.appendChild(ele);
                let nodes: NodeModel[] = [{
                    id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100,

                }];
                diagram = new Diagram({
                    width: 800, height: 500, nodes: nodes,
                    enableCollaborativeEditing: true,
                    historyChange: function (args: IHistoryChangeArgs) {
                        let changes: string[] = diagram.getDiagramUpdates(args);
                        if (changes.length > 0) {
                            diagram2.setDiagramUpdates(changes);
                        }
                    }
                });
                diagram2 = new Diagram({
                    width: 800, height: 500, nodes: nodes,
                    enableCollaborativeEditing: true,
                })
                diagram.appendTo('#diagram7');
                diagram2.appendTo("#diagram8");
                diagramCanvas1 = document.getElementById(diagram.element.id + 'content');
                diagramCanvas2 = document.getElementById(diagram2.element.id + 'content');
                mouseEvents.clickEvent(diagramCanvas1, 1, 1);
                left1 = diagram.element.offsetLeft; top1 = diagram.element.offsetTop;
            });

            afterAll((): void => {
                mouseEvents = null;
                diagram.destroy();
                diagram2.destroy();
                diagramEle1.remove();
                diagramEle2.remove();
                ele.remove();
            });

            it('BPMN Event node - resize interaction and verify collaborator sync', (done: Function) => {
                let nodes: NodeModel[] = [
                    {
                        id: 'subProcess',
                        width: 520,
                        height: 250,
                        offsetX: 355,
                        offsetY: 230,
                        constraints: NodeConstraints.Default | NodeConstraints.AllowDrop,
                        shape: {
                            shape: 'Activity',
                            type: 'Bpmn',
                            activity: {
                                activity: 'SubProcess',
                                subProcess: {
                                    collapsed: false,
                                },
                            },
                        },
                    },
                ];
                diagram.addElements(nodes);
                let pro: NodeModel = {
                    id: 'node6', width: 60, height: 60, offsetX: 745, offsetY: 90,
                    shape: {
                        type: 'Bpmn', shape: 'Event',
                    },
                }
                diagram.addElements([pro]);
                diagram.addProcess(pro, "subProcess")
                mouseEvents.clickEvent(diagramCanvas1, 200, 200);
                collaborativeNodeResize(diagram, "resizeNorthEast");
                collaborativeNodeResize(diagram, "resizeNorthEast");

                expect(diagram2.nodes[1].wrapper.offsetY == diagram.nodes[1].wrapper.offsetY).toBe(true);
                done();
            });
        })

        describe('BPMN Shape Property Change', () => {
            let diagram: Diagram;
            let diagram2: Diagram;
            let ele: HTMLElement;
            let diagramEle1: HTMLElement;
            let diagramEle2: HTMLElement;
            let mouseEvents: MouseEvents = new MouseEvents();
            let diagramCanvas1: HTMLElement;
            let diagramCanvas2: HTMLElement;
            let left1: number; let top1: number;
            let left2: number; let top2: number;


            beforeAll((): void => {
                const isDef = (o: any) => o !== undefined && o !== null;
                if (!isDef(window.performance)) {
                    this.skip(); //Skips test (in Chai)
                    return;
                }
                ele = createElement('div', { id: 'NodeInteraction' });
                diagramEle1 = createElement('div', { id: 'diagram9' });
                diagramEle2 = createElement('div', { id: 'diagram10' })
                ele.appendChild(diagramEle1);
                ele.appendChild(diagramEle2);
                document.body.appendChild(ele);
                let nodes: NodeModel[] = [{
                    id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100,

                }];
                diagram = new Diagram({
                    width: 800, height: 500, nodes: nodes,
                    enableCollaborativeEditing: true,
                    historyChange: function (args: IHistoryChangeArgs) {
                        let changes: string[] = diagram.getDiagramUpdates(args);
                        if (changes.length > 0) {
                            diagram2.setDiagramUpdates(changes);
                        }
                    }
                });
                diagram2 = new Diagram({
                    width: 800, height: 500, nodes: nodes,
                    enableCollaborativeEditing: true,
                })
                diagram.appendTo('#diagram9');
                diagram2.appendTo("#diagram10");
                diagramCanvas1 = document.getElementById(diagram.element.id + 'content');
                diagramCanvas2 = document.getElementById(diagram2.element.id + 'content');
                mouseEvents.clickEvent(diagramCanvas1, 1, 1);
                left1 = diagram.element.offsetLeft; top1 = diagram.element.offsetTop;
            });

            afterAll((): void => {
                diagram.destroy();
                diagram2.destroy();
                diagramEle1.remove();
                diagramEle2.remove();
                ele.remove();
            });
            it('BPMN SubProcess - property change width and height', (done: Function) => {
                diagram.selectAll();
                mouseEvents.keyDownEvent(diagramCanvas1, 'Delete');
                let nodes: NodeModel[] = [
                    {
                        id: 'subProcess',
                        width: 520,
                        height: 250,
                        offsetX: 355,
                        offsetY: 230,
                        constraints: NodeConstraints.Default | NodeConstraints.AllowDrop,
                        shape: {
                            shape: 'Activity',
                            type: 'Bpmn',
                            activity: {
                                activity: 'SubProcess',
                                subProcess: {
                                    collapsed: false,
                                },
                            },
                        },
                    },
                ];
                diagram.addElements(nodes);
                let pro: NodeModel = {
                    id: 'node6', width: 60, height: 60, offsetX: 745, offsetY: 90,
                    shape: {
                        type: 'Bpmn', shape: 'Event',
                    },
                }
                diagram.addElements([pro]);
                diagram.addProcess(pro, "subProcess");

                diagram.nodes[0].width = 520;
                diagram.nodes[0].height = 500;
                diagram.dataBind();
                expect(diagram2.nodes[0].width == 520).toBe(true);
                expect(diagram.nodes[0].height == 500).toBe(true);
                done();
            });
            it('BPMN SubProcess - property change offsetX and offsetY', (done: Function) => {
                diagram.nodes[0].offsetX = 500;
                diagram.nodes[0].offsetY = 500;
                diagram.dataBind();
                expect(diagram2.nodes[0].offsetX == 500).toBe(true);
                expect(diagram2.nodes[0].offsetY == 500).toBe(true);
                done();
            });
            it('BPMN Event task - property change offsetX and offsetY', (done: Function) => {
                diagram.nodes[1].offsetX = 300;
                diagram.nodes[1].offsetY = 300;
                diagram.dataBind();
                expect(diagram2.nodes[1].offsetX == 300).toBe(true);
                expect(diagram2.nodes[1].offsetY == 300).toBe(true);
                done();
            });
            it('BPMN Event task - property change width and height', (done: Function) => {
                diagram.nodes[1].width = 300;
                diagram.nodes[1].height = 300;
                diagram.dataBind();
                expect(diagram2.nodes[1].width == 300).toBe(true);
                expect(diagram2.nodes[1].height == 300).toBe(true);
                done();
            });
            it('BPMN nodes - copy and paste command and undo', (done: Function) => {
                diagram.selectAll();
                mouseEvents.keyDownEvent(diagramCanvas1, 'C', true);
                mouseEvents.keyDownEvent(diagramCanvas1, 'V', true);
                expect(diagram2.nodes.length == 4).toBe(true);
                diagram.undo();
                done();
            });
        })
    })
});

        describe('Swimlane Lane Swapping', () => {
                        let diagram: Diagram;
            let diagram2: Diagram;
            let ele: HTMLElement;
            let diagramEle1: HTMLElement;
            let diagramEle2: HTMLElement;
            let mouseEvents: MouseEvents = new MouseEvents();
            let diagramCanvas1: HTMLElement;
            let diagramCanvas2: HTMLElement;
            let left1: number; let top1: number;
            let left2: number; let top2: number;


            beforeAll((): void => {
                const isDef = (o: any) => o !== undefined && o !== null;
                if (!isDef(window.performance)) {
                    this.skip(); //Skips test (in Chai)
                    return;
                }
                ele = createElement('div', { id: 'NodeInteraction' });
                diagramEle1 = createElement('div', { id: 'diagram9' });
                diagramEle2 = createElement('div', { id: 'diagram10' })
                ele.appendChild(diagramEle1);
                ele.appendChild(diagramEle2);
                document.body.appendChild(ele);
                let pathData = 'M 120 24.9999 C 120 38.8072 109.642 50 96.8653 50 L 23.135' +
                    ' 50 C 10.3578 50 0 38.8072 0 24.9999 L 0 24.9999 C' +
                    '0 11.1928 10.3578 0 23.135 0 L 96.8653 0 C 109.642 0 120 11.1928 120 24.9999 Z';
                let darkColor = '#C7D4DF';
                let lightColor = '#f5f5f5';
                let nodes: NodeModel[] = [
                    {
                        id: 'swimlane',
                        shape: {
                            orientation: 'Vertical',
                            type: 'SwimLane',
                            header: {
                                annotation: { content: 'ONLINE PURCHASE STATUS' },
                                height: 50, style: { fill: darkColor, fontSize: 11 },
                            },
                            lanes: [
                                {
                                    id: 'stackCanvas1',
                                    header: {
                                        annotation: { content: 'CUSTOMER' }, height: 50,
                                        style: { fill: darkColor, fontSize: 11 }
                                    },
                                    style: { fill: lightColor },
                                    width: 140,
                                    children: [
                                        {
                                            id: 'Order',
                                            shape: { type: 'Path', data: pathData },
                                            annotations: [
                                                {
                                                    content: 'ORDER',
                                                    style: { fontSize: 11 }
                                                }
                                            ],
                                            margin: { left: 60, top: 60 },
                                            height: 40, width: 100
                                        }
                                    ],
                                },
                                {
                                    id: 'stackCanvas2',
                                    header: {
                                        annotation: { content: 'ONLINE' }, height: 50,
                                        style: { fill: darkColor, fontSize: 11 }
                                    },
                                    style: { fill: lightColor }, width: 120,
                                    children: [
                                        {
                                            id: 'selectItemaddcart',
                                            annotations: [{ content: 'Select item\nAdd cart' }],
                                            margin: { left: 200, top: 60 },
                                            height: 40, width: 100
                                        },
                                        {
                                            id: 'paymentondebitcreditcard',
                                            annotations: [{ content: 'Payment on\nDebit/Credit Card' }],
                                            margin: { left: 200, top: 250 },
                                            height: 40, width: 100
                                        }
                                    ],
                                },
                            ],
                            phases: [
                                {
                                    id: 'phase1', offset: 200,
                                    style: { strokeWidth: 1, strokeDashArray: '3,3', strokeColor: '#606060' },
                                    header: { content: { content: 'Phase' } }
                                },
                                {
                                    id: 'phase2', offset: 400,
                                    style: { strokeWidth: 1, strokeDashArray: '3,3', strokeColor: '#606060' },
                                    header: { content: { content: 'Phase' } }
                                },
                            ],
                            phaseSize: 20,
                        },
                        offsetX: 350, offsetY: 290,
                        height: 360, width: 400
                    },
                ];
                function getConnectorDefaults(connector: ConnectorModel): ConnectorModel {
                    connector.type = 'Orthogonal'
                    return connector;
                }
                diagram = new Diagram({
                    width: 800, height: 500, nodes: nodes,
                    enableCollaborativeEditing: true,
                    getConnectorDefaults: getConnectorDefaults,
                    historyChange: function (args: IHistoryChangeArgs) {
                        let changes: string[] = diagram.getDiagramUpdates(args);
                        if (changes.length > 0) {
                            diagram2.setDiagramUpdates(changes);
                        }
                    }
                });
                diagram2 = new Diagram({
                    width: 800, height: 500, nodes: nodes,
                    enableCollaborativeEditing: true,
                })
                diagram.appendTo('#diagram9');
                diagram2.appendTo("#diagram10");
                diagramCanvas1 = document.getElementById(diagram.element.id + 'content');
                diagramCanvas2 = document.getElementById(diagram2.element.id + 'content');
                mouseEvents.clickEvent(diagramCanvas1, 1, 1);
                left1 = diagram.element.offsetLeft; top1 = diagram.element.offsetTop;
            });

            afterAll((): void => {
                diagram.destroy();
                diagram2.destroy();
                diagramEle1.remove();
                diagramEle2.remove();
                ele.remove();
            });

            it('Code coverage - Lane interchange', (done: Function) => {
                let node = diagram.nameTable["swimlanestackCanvas11"];
                let target = diagram.nameTable["swimlanestackCanvas21"];
                let colIndex = diagram.nameTable["swimlanestackCanvas11"].columnIndex;
                mouseEvents.clickEvent(diagramCanvas1, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop);
                mouseEvents.mouseDownEvent(diagramCanvas1, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop);
                mouseEvents.mouseMoveEvent(diagramCanvas1, node.wrapper.offsetX + diagram.element.offsetLeft - 40, node.wrapper.offsetY + diagram.element.offsetTop);
                mouseEvents.mouseMoveEvent(diagramCanvas1, target.wrapper.offsetX + diagram.element.offsetLeft, target.wrapper.offsetY + diagram.element.offsetTop);
                mouseEvents.mouseMoveEvent(diagramCanvas1, target.wrapper.offsetX + diagram.element.offsetLeft - 15, target.wrapper.offsetY + diagram.element.offsetTop);
                mouseEvents.mouseUpEvent(diagramCanvas1, target.wrapper.offsetX + diagram.element.offsetLeft - 15, target.wrapper.offsetY + diagram.element.offsetTop);
                expect(diagram.nameTable["swimlanestackCanvas11"].columnIndex == colIndex).toBe(true);
                expect(diagram2.nameTable["swimlanestackCanvas11"].columnIndex == colIndex).toBe(true);
                done();
            });
            it('Remove first lane with children', (done: Function) => {
                let node = diagram.nameTable["swimlanestackCanvas11"];
                let swimlane = diagram.nameTable["swimlane"];
                let swimlane2 = diagram2.nameTable["swimlane"];
                expect(swimlane.shape.lanes.length == 2).toBe(true);
                expect(swimlane2.shape.lanes.length == 2).toBe(true);
                mouseEvents.clickEvent(diagramCanvas1, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop);
                diagram.remove();
                swimlane = diagram.nameTable["swimlane"];
                swimlane2 = diagram2.nameTable["swimlane"];
                expect(swimlane.shape.lanes.length == 1).toBe(true);
                expect(swimlane2.shape.lanes.length == 1).toBe(true);
                done();
            });
            it('Undo, redo action After Remove first lane with children', (done: Function) => {
                let swimlane = diagram.nameTable["swimlane"];
                let swimlane2 = diagram2.nameTable["swimlane"];
                expect(swimlane.shape.lanes.length == 1).toBe(true);
                expect(swimlane2.shape.lanes.length == 1).toBe(true);
                diagram.undo();
                swimlane = diagram.nameTable["swimlane"];
                swimlane2 = diagram2.nameTable["swimlane"];
                expect(swimlane.shape.lanes.length == 2).toBe(true);
                expect(swimlane2.shape.lanes.length == 2).toBe(true);
                diagram.redo();
                swimlane = diagram.nameTable["swimlane"];
                swimlane2 = diagram2.nameTable["swimlane"];
                expect(swimlane.shape.lanes.length == 1).toBe(true);
                expect(swimlane2.shape.lanes.length == 1).toBe(true);
                done();
            });
        });