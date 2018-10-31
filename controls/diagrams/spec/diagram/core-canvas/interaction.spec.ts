import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { ConnectorModel } from '../../../src/diagram/objects/connector-model';
import { NodeModel } from '../../../src/diagram/objects/node-model';
import { BpmnDiagrams } from '../../../src/diagram/objects/bpmn';
import { PointModel } from '../../../src/diagram/primitives/point-model';
import { Rect } from '../../../src/diagram/primitives/rect';
import { Matrix, transformPointByMatrix, identityMatrix, rotateMatrix } from '../../../src/diagram/primitives/matrix';
import { rotatePoint } from '../../../src/diagram/utility/base-util';
// import { MouseEvents } from './mouseevents.spec';
import { MouseEvents } from './../interaction/mouseevents.spec'
import { SnapConstraints, SelectorConstraints } from '../../../src/diagram/index';
Diagram.Inject(BpmnDiagrams);
/**
 * Interaction Specification Document
 */
describe('Diagram Control', () => {

    let resize50: object = {
        topLeft: { offsetX: 302.5, offsetY: 295, width: 104.36956304369565, height: 110.2889711028897 },
        topCenter: { offsetX: 313.23, offsetY: 285.86, width: 104.36956304369565, height: 138.4787081179451 },
        topRight: { offsetX: 323.23, offsetY: 275.86, width: 102.1197880211979, height: 166.66844513300052 },
        middleLeft: { offsetX: 314.09, offsetY: 265.13, width: 130.3069693030697, height: 166.66844513300052 },
        middleRight: { offsetX: 323.23, offsetY: 275.86, width: 158.49631367152597, height: 166.66844513300052 },
        bottomLeft: { offsetX: 313.23, offsetY: 275.86, width: 171.46601202054612, height: 181.88830314538586 },
        bottomCenter: { offsetX: 302.5, offsetY: 285, width: 171.46601202054612, height: 210.07804016044125 },
        bottomRight: { offsetX: 302.5, offsetY: 295, width: 186.68565803998223, height: 223.0479191631113 }
    };

    let resize130: object = {
        topLeft: { offsetX: 305, offsetY: 290, width: 197.5659877993298, height: 220.4579433252612 },
        topCenter: { offsetX: 305.96, offsetY: 290.8, width: 197.5659877993298, height: 222.95792000272263 },
        topRight: { offsetX: 315.96, offsetY: 280.8, width: 169.39798559107427, height: 225.4578966801841 },
        middleLeft: { offsetX: 316.76, offsetY: 279.84, width: 171.8979558624892, height: 225.4578966801841 },
        middleRight: { offsetX: 315.96, offsetY: 280.8, width: 174.39792613390412, height: 225.4578966801841 },
        bottomLeft: { offsetX: 305.96, offsetY: 280.8, width: 161.55807881991714, height: 240.7977535730876 },
        bottomCenter: { offsetX: 305, offsetY: 280, width: 161.55807881991714, height: 243.29773025054908 },
        bottomRight: { offsetX: 305, offsetY: 290, width: 176.89789640531902, height: 230.45785003510701 }
    };

    let resize260: object = {
        topLeft: { offsetX: 307.5, offsetY: 285, width: 167.89851215542998, height: 223.8179119797694 },
        topCenter: { offsetX: 318.89, offsetY: 283.02, width: 167.89851215542998, height: 200.688127759896 },
        topRight: { offsetX: 328.89, offsetY: 273.02, width: 184.17739833189594, height: 177.5594959956389 },
        middleLeft: { offsetX: 326.91, offsetY: 261.63, width: 161.0489808096811, height: 177.5594959956389 },
        middleRight: { offsetX: 328.89, offsetY: 273.02, width: 137.91912718578837, height: 177.5594959956389 },
        bottomLeft: { offsetX: 318.89, offsetY: 273.02, width: 135, height: 157.85066192415135 },
        bottomCenter: { offsetX: 307.49, offsetY: 275, width: 135, height: 134.72203015989427 },
        bottomRight: { offsetX: 307.49, offsetY: 285, width: 114.79095048886033, height: 131.30223246712475 }
    };


    let TopLeft: string = 'topLeft';
    let TopRight: string = 'topRight';
    let MiddleLeft: string = 'middleLeft';
    let MiddleRight: string = 'middleRight';
    let TopCenter: string = 'topCenter';
    let BottomLeft: string = 'bottomLeft';
    let BottomCenter: string = 'bottomCenter';
    let BottomRight: string = 'bottomRight';

    describe('Testing Selection', () => {
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
                mode: 'Canvas',
                width: 550, height: 550, nodes: [node],
                connectors: [connector],
                snapSettings: { constraints: SnapConstraints.ShowLines },
                selectedItems: { constraints: SelectorConstraints.All & ~SelectorConstraints.ToolTip }
            });

            diagram.appendTo('#diagram12');

        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking node selection in SVG rendering Mode', (done: Function) => {

            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 150, 150);

            expect(diagram.selectedItems.nodes.length == 1 && diagram.selectedItems.nodes[0].id == 'node1').toBe(true);
            done();
        });

        it('Checking connector selection in SVG rendering Mode', (done: Function) => {

            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 253 + diagram.element.offsetLeft, 250 + diagram.element.offsetTop);
            expect(diagram.selectedItems.connectors.length == 1 && diagram.selectedItems.connectors[0].id == 'connector1').toBe(true);
            done();
        });


        it('Checking rubber band selection in SVG rendering Mode', (done: Function) => {

            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.dragAndDropEvent(diagramCanvas, 30, 30, 400, 400);

            expect(diagram.selectedItems.connectors.length == 1 && diagram.selectedItems.connectors[0].id == 'connector1' &&
                diagram.selectedItems.nodes.length == 1 && diagram.selectedItems.nodes[0].id == 'node1').toBe(true);
            done();
        });

        it('Checking rubber band selection - complete intersect in SVG rendering Mode', (done: Function) => {

            diagram.selectedItems.rubberBandSelectionMode = 'CompleteIntersect';
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.dragAndDropEvent(diagramCanvas, 30, 30, 250, 250);

            expect(diagram.selectedItems.connectors.length == 0 &&
                diagram.selectedItems.nodes.length == 1 && diagram.selectedItems.nodes[0].id == 'node1').toBe(true);
            done();
        });

        it('Checking rubber band selection - partial intersect in SVG rendering Mode', (done: Function) => {

            diagram.selectedItems.rubberBandSelectionMode = 'PartialIntersect';
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.dragAndDropEvent(diagramCanvas, 30, 30, 250, 250);

            expect(diagram.selectedItems.connectors.length == 1 && diagram.selectedItems.connectors[0].id == 'connector1' &&
                diagram.selectedItems.nodes.length == 1 && diagram.selectedItems.nodes[0].id == 'node1').toBe(true);
            done();
        });

        it('Checking ctrl + click - add Selection in SVG rendering Mode', (done: Function) => {

            diagram.clearSelection();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');

            mouseEvents.clickEvent(diagramCanvas, 150, 150, true);

            mouseEvents.clickEvent(diagramCanvas, 250, 250, true);

            expect(diagram.selectedItems.connectors.length == 1 && diagram.selectedItems.connectors[0].id == 'connector1' &&
                diagram.selectedItems.nodes.length == 1 && diagram.selectedItems.nodes[0].id == 'node1').toBe(true);
            done();

        });


        it('Checking ctrl + click - remove Selection in SVG rendering Mode', (done: Function) => {


            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');

            mouseEvents.clickEvent(diagramCanvas, 250, 250, true);

            expect(diagram.selectedItems.connectors.length == 0 &&
                diagram.selectedItems.nodes.length == 1 && diagram.selectedItems.nodes[0].id == 'node1').toBe(true);
            done();

        });


        it('Checking shift + click - add Selection in SVG rendering Mode', (done: Function) => {


            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');

            mouseEvents.clickEvent(diagramCanvas, 250, 250, false, true);

            expect(diagram.selectedItems.connectors.length == 1 &&
                diagram.selectedItems.nodes.length == 1 && diagram.selectedItems.nodes[0].id == 'node1').toBe(true);
            done();

        });

        it('Checking clear selection in SVG rendering Mode', (done: Function) => {

            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 500, 100);

            expect(diagram.selectedItems.connectors.length == 0 &&
                diagram.selectedItems.nodes.length == 0).toBe(true);
            done();
        });
    });

    describe('Diagram Control', () => {
        describe('Testing z-order based Selection', () => {
            let diagram: Diagram;
            let ele: HTMLElement;

            let mouseEvents: MouseEvents = new MouseEvents();
            beforeAll((): void => {
                ele = createElement('div', { id: 'diagram2' });
                document.body.appendChild(ele);
                let selArray: (NodeModel | ConnectorModel)[] = [];
                let node: NodeModel = { id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100 };
                let node1: NodeModel = { id: 'node2', width: 100, height: 100, offsetX: 150, offsetY: 150 };

                let connector: ConnectorModel = { id: 'connector1', sourcePoint: { x: 200, y: 200 }, targetPoint: { x: 300, y: 300 } };
                let connector1: ConnectorModel = { id: 'connector2', sourcePoint: { x: 300, y: 300 }, targetPoint: { x: 200, y: 200 } };

                diagram = new Diagram({
                    mode: 'Canvas',
                    width: 550, height: 550, nodes: [node, node1],
                    connectors: [connector, connector1],
                    snapSettings: { constraints: SnapConstraints.ShowLines }
                });

                diagram.appendTo('#diagram2');
            });

            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });

            it('Checking z-order based node selection in SVG rendering Mode', (done: Function) => {

                let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
                mouseEvents.clickEvent(diagramCanvas, 150 + diagram.element.offsetLeft, 150 + diagram.element.offsetTop);

                expect(diagram.selectedItems.nodes.length == 1 && diagram.selectedItems.nodes[0].id == 'node2').toBe(true);
                done();
            });

            it('Checking z-order based connector selection in SVG rendering Mode', (done: Function) => {
                let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
                mouseEvents.clickEvent(diagramCanvas, 250 + diagram.element.offsetLeft, 250 + diagram.element.offsetTop);
                expect(diagram.selectedItems.connectors.length == 1 && diagram.selectedItems.connectors[0].id == 'connector2').toBe(true);
                done();
            });
        });
    });
    describe('Testing Dragging', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        let mouseEvents: MouseEvents = new MouseEvents();

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram3' });
            document.body.appendChild(ele);
            let selArray: (NodeModel | ConnectorModel)[] = [];
            let node: NodeModel = { id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100 };

            let bpmn: NodeModel = {
                id: 'bpmnshape', width: 100, height: 100, offsetX: 100, offsetY: 500,
                shape: { type: 'Bpmn' }
            };

            let connector: ConnectorModel = { id: 'connector1', sourcePoint: { x: 200, y: 200 }, targetPoint: { x: 300, y: 300 } };


            diagram = new Diagram({
                mode: 'Canvas',
                width: 550, height: 550, nodes: [node, bpmn],
                connectors: [connector], snapSettings: { constraints: SnapConstraints.ShowLines }
            });

            diagram.appendTo('#diagram3');
            selArray.push(diagram.nodes[0]);
            diagram.select(selArray);
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking selected node(single) dragging in SVG rendering Mode', (done: Function) => {

            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 150, 150);

            mouseEvents.dragAndDropEvent(diagramCanvas, 100, 100, 600, 600);

            expect(diagram.selectedItems.nodes.length == 1 && diagram.selectedItems.nodes[0].offsetX == 600 &&
                diagram.selectedItems.nodes[0].offsetY == 600).toBe(true);
            done();
        });

        it('Checking selected connector(Single) dragging in SVG rendering Mode', (done: Function) => {

            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 250, 250);

            mouseEvents.dragAndDropEvent(diagramCanvas, 250, 250, 400, 400);

            expect(diagram.selectedItems.connectors.length == 1 && diagram.selectedItems.connectors[0].id == 'connector1' &&
                diagram.selectedItems.connectors[0].wrapper.offsetX == 400
                && diagram.selectedItems.connectors[0].wrapper.offsetY == 400).toBe(true);
            done();
        });

        it('Checking selected complex node dragging in SVG rendering Mode', (done: Function) => {

            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 100, 500);

            mouseEvents.dragAndDropEvent(diagramCanvas, 100, 500, 100, 400);

            expect(diagram.selectedItems.nodes.length == 1 && diagram.selectedItems.nodes[0].id == 'bpmnshape' &&
                diagram.selectedItems.nodes[0].wrapper.offsetX == 100
                && diagram.selectedItems.nodes[0].wrapper.offsetY == 400).toBe(true);
            done();
        });

        it('Checking ctrl + dragging node dragging in SVG rendering Mode', (done: Function) => {

            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');

            mouseEvents.dragAndDropEvent(diagramCanvas, 400 + diagram.element.offsetLeft, 400 + diagram.element.offsetTop, 400 + diagram.element.offsetLeft, 300 + diagram.element.offsetTop, true);

            expect(diagram.selectedItems.nodes.length == 1 && diagram.selectedItems.nodes[0].id == 'bpmnshape' &&
                diagram.selectedItems.connectors.length == 1 && diagram.selectedItems.connectors[0].id == 'connector1' &&
                diagram.selectedItems.connectors[0].wrapper.offsetX == 400
                && diagram.selectedItems.connectors[0].wrapper.offsetY == 300).toBe(true);
            done();
        });

        it('Checking rubber band selection && dragging in SVG rendering Mode', (done: Function) => {

            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.dragAndDropEvent(diagramCanvas, 200, 200, 700, 700);

            let offsetX: number = diagram.selectedItems.offsetX;
            let offsetY: number = diagram.selectedItems.offsetY;

            mouseEvents.dragAndDropEvent(diagramCanvas, 400 + diagram.element.offsetLeft, 300 + diagram.element.offsetTop, offsetX - 200 + diagram.element.offsetLeft, offsetY - 200 + diagram.element.offsetTop);

            expect(diagram.selectedItems.connectors.length == 1 && diagram.selectedItems.connectors[0].id == 'connector1' &&
                diagram.selectedItems.nodes.length == 1 && diagram.selectedItems.nodes[0].id == 'node1' &&
                diagram.selectedItems.offsetX - offsetX == 400 - offsetX && diagram.selectedItems.offsetY - offsetY == 400 - offsetY).toBe(true);
            done();
        });

        it('Checking unselected node dragging in SVG rendering Mode', (done: Function) => {

            diagram.clearSelection();

            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let offsetX: number = diagram.nodes[0].offsetX;
            let offsetY: number = diagram.nodes[0].offsetY;

            //just for coverage
            mouseEvents.mouseMoveEvent(diagramCanvas, offsetX, offsetY, true);
            mouseEvents.dragAndDropEvent(diagramCanvas, offsetX, offsetY, offsetX, offsetY);
            mouseEvents.mouseMoveEvent(diagramCanvas, 800, 100);
            mouseEvents.mouseLeaveEvent(diagramCanvas);

            //drag node
            mouseEvents.dragAndDropEvent(diagramCanvas, offsetX, offsetY, offsetX - 200, offsetY - 200);


            expect(diagram.selectedItems.nodes.length == 1 && offsetX - diagram.selectedItems.nodes[0].offsetX == 200 &&
                offsetY - diagram.selectedItems.nodes[0].offsetY == 200).toBe(true);
            done();
        });

        it('Checking unselected connector dragging in SVG rendering Mode', (done: Function) => {

            diagram.clearSelection();

            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let offsetX: number = diagram.connectors[0].wrapper.offsetX;
            let offsetY: number = diagram.connectors[0].wrapper.offsetY;

            mouseEvents.dragAndDropEvent(diagramCanvas, offsetX, offsetY, offsetX - 200, offsetY - 200);
            expect(diagram.selectedItems.connectors.length == 1 && diagram.selectedItems.connectors[0].id == 'connector1' &&
                offsetX - diagram.selectedItems.connectors[0].wrapper.offsetX == 200
                && offsetY - diagram.selectedItems.connectors[0].wrapper.offsetY == 200).toBe(true);
            done();
        });
    });


    describe('Testing Rotation (50) Resizing', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        let mouseEvents: MouseEvents = new MouseEvents();

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram5' });
            document.body.appendChild(ele);

            let node: NodeModel = { id: 'node1', width: 100, height: 100, offsetX: 300, offsetY: 300 };

            diagram = new Diagram({
                mode: 'Canvas',
                width: 550, height: 550, nodes: [node], snapSettings: { constraints: SnapConstraints.ShowLines }
            });

            diagram.appendTo('#diagram5');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking single node rotation (50) && resizing in SVG rendering Mode', (done: Function) => {

            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let output: string = '';
            //select
            mouseEvents.clickEvent(diagramCanvas, 300, 300);
            // rotate node
            let bounds: Rect = (diagram.nodes[0] as NodeModel).wrapper.bounds;
            let rotator: PointModel = { x: bounds.center.x, y: bounds.y - 30 };
            let matrix: Matrix = identityMatrix();
            rotateMatrix(matrix, 50, bounds.center.x, bounds.center.y);
            let endPoint: PointModel = transformPointByMatrix(matrix, rotator);
            mouseEvents.dragAndDropEvent(diagramCanvas, rotator.x + diagram.element.offsetLeft, rotator.y + diagram.element.offsetTop, endPoint.x + diagram.element.offsetLeft, endPoint.y + diagram.element.offsetTop);
            diagram.nodes[0].rotateAngle = Math.round(diagram.nodes[0].rotateAngle);
            expect(diagram.nodes[0].rotateAngle % 360 == 50).toBe(true);
            //resize at top left
            let refPoint: PointModel = transformPointByMatrix(matrix, bounds.topLeft); refPoint.x += 8; refPoint.y += 8;
            mouseEvents.dragAndDropEvent(diagramCanvas, refPoint.x, refPoint.y, refPoint.x + 5, refPoint.y - 10);
            let corner: string = TopLeft;
            expect(diagram.nodes[0].offsetX == resize50[corner].offsetX && diagram.nodes[0].offsetY == resize50[corner].offsetY &&
                Math.round(diagram.nodes[0].width) == Math.round(resize50[corner].width) &&
                Math.round(diagram.nodes[0].height) == Math.round(resize50[corner].height)).toBe(true);
            let node: NodeModel = diagram.nodes[0] as NodeModel;

            //top center
            let topCenter: PointModel = { x: node.offsetX, y: node.offsetY - node.height / 2 };
            refPoint = rotatePoint(node.rotateAngle, node.offsetX, node.offsetY, topCenter);
            refPoint.x += 8; refPoint.y += 8;
            mouseEvents.dragAndDropEvent(diagramCanvas, refPoint.x, refPoint.y, refPoint.x + 20, refPoint.y - 20);
            corner = TopCenter;
            expect(diagram.nodes[0].offsetX == resize50[corner].offsetX && diagram.nodes[0].offsetY == resize50[corner].offsetY &&
                Math.round(diagram.nodes[0].width) == Math.round(resize50[corner].width) &&
                Math.round(diagram.nodes[0].height) == Math.round(resize50[corner].height)).toBe(true);

            //top right
            let topRight: PointModel = { x: node.offsetX + node.width / 2, y: node.offsetY - node.height / 2 };
            refPoint = rotatePoint(node.rotateAngle, node.offsetX, node.offsetY, topRight);
            refPoint.x += 8; refPoint.y += 8;
            mouseEvents.dragAndDropEvent(diagramCanvas, refPoint.x, refPoint.y, refPoint.x + 20, refPoint.y - 20);
            corner = TopRight;
            expect(diagram.nodes[0].offsetX == resize50[corner].offsetX && diagram.nodes[0].offsetY == resize50[corner].offsetY &&
                Math.round(diagram.nodes[0].width) == Math.round(resize50[corner].width) &&
                Math.round(diagram.nodes[0].height) == Math.round(resize50[corner].height)).toBe(true);

            //middle left
            let middleLeft: PointModel = { x: node.offsetX - node.width / 2, y: node.offsetY };
            refPoint = rotatePoint(node.rotateAngle, node.offsetX, node.offsetY, middleLeft);
            refPoint.x += 8; refPoint.y += 8;
            mouseEvents.dragAndDropEvent(diagramCanvas, refPoint.x, refPoint.y, refPoint.x - 20, refPoint.y - 20);
            corner = MiddleLeft;
            expect(diagram.nodes[0].offsetX == resize50[corner].offsetX && diagram.nodes[0].offsetY == resize50[corner].offsetY &&
                Math.round(diagram.nodes[0].width) == Math.round(resize50[corner].width) &&
                Math.round(diagram.nodes[0].height) == Math.round(resize50[corner].height)).toBe(true);

            //middle right
            let middleRight: PointModel = { x: node.offsetX + node.width / 2, y: node.offsetY };
            refPoint = rotatePoint(node.rotateAngle, node.offsetX, node.offsetY, middleRight);
            refPoint.x += 8; refPoint.y += 8;
            mouseEvents.dragAndDropEvent(diagramCanvas, refPoint.x, refPoint.y, refPoint.x + 20, refPoint.y + 20);
            corner = MiddleRight;
            expect(diagram.nodes[0].offsetX == resize50[corner].offsetX && diagram.nodes[0].offsetY == resize50[corner].offsetY &&
                Math.round(diagram.nodes[0].width) !== Math.round(resize50[corner].width) &&
                Math.round(diagram.nodes[0].height) == Math.round(resize50[corner].height)).toBe(true);

            //bottom left
            let bottomLeft: PointModel = { x: node.offsetX - node.width / 2, y: node.offsetY + node.height / 2 };
            refPoint = rotatePoint(node.rotateAngle, node.offsetX, node.offsetY, bottomLeft);
            refPoint.x += 8; refPoint.y += 8;
            mouseEvents.dragAndDropEvent(diagramCanvas, refPoint.x, refPoint.y, refPoint.x - 20, refPoint.y - 0);
            corner = BottomLeft;
            expect(diagram.nodes[0].offsetX == resize50[corner].offsetX && diagram.nodes[0].offsetY == resize50[corner].offsetY &&
                Math.round(diagram.nodes[0].width) == Math.round(resize50[corner].width) &&
                Math.round(diagram.nodes[0].height) == Math.round(resize50[corner].height)).toBe(true);

            //bottom center
            let bottomCenter: PointModel = { x: node.offsetX, y: node.offsetY + node.height / 2 };
            refPoint = rotatePoint(node.rotateAngle, node.offsetX, node.offsetY, bottomCenter);
            refPoint.x += 8; refPoint.y += 8;
            mouseEvents.dragAndDropEvent(diagramCanvas, refPoint.x, refPoint.y, refPoint.x - 20, refPoint.y + 20);
            corner = BottomCenter;
            expect(diagram.nodes[0].offsetX == resize50[corner].offsetX && diagram.nodes[0].offsetY == resize50[corner].offsetY &&
                Math.round(diagram.nodes[0].width) == Math.round(resize50[corner].width) &&
                Math.round(diagram.nodes[0].height) == Math.round(resize50[corner].height)).toBe(true);

            //bottom right
            let bottomRight: PointModel = { x: node.offsetX + node.width / 2, y: node.offsetY + node.height / 2 };
            refPoint = rotatePoint(node.rotateAngle, node.offsetX, node.offsetY, bottomRight);
            refPoint.x += 8; refPoint.y += 8;
            mouseEvents.dragAndDropEvent(diagramCanvas, refPoint.x, refPoint.y, refPoint.x + 0, refPoint.y + 20);
            corner = BottomRight;
            expect(diagram.nodes[0].offsetX == resize50[corner].offsetX && diagram.nodes[0].offsetY == resize50[corner].offsetY &&
                Math.round(diagram.nodes[0].width) == Math.round(resize50[corner].width) &&
                Math.round(diagram.nodes[0].height) == Math.round(resize50[corner].height)).toBe(true);
            done();
        });

        it('Checking single node rotation (130) && resizing in SVG', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let output: string = '';
            diagram.nodes[0].rotateAngle = 0;
            diagram.dataBind();
            diagram.clearSelection();
            //select
            mouseEvents.clickEvent(diagramCanvas, 300, 300);
            // rotate node
            let bounds: Rect = (diagram.nodes[0] as NodeModel).wrapper.bounds;
            let rotator: PointModel = { x: bounds.center.x, y: bounds.y - 30 };
            let matrix: Matrix = identityMatrix();
            rotateMatrix(matrix, 130, bounds.center.x, bounds.center.y);
            let endPoint: PointModel = transformPointByMatrix(matrix, rotator);
            mouseEvents.dragAndDropEvent(diagramCanvas, rotator.x + diagram.element.offsetLeft, rotator.y + diagram.element.offsetTop, endPoint.x + diagram.element.offsetLeft, endPoint.y + diagram.element.offsetTop);
            diagram.nodes[0].rotateAngle = Math.round(diagram.nodes[0].rotateAngle);
            expect(diagram.nodes[0].rotateAngle % 360 == 130).toBe(true);
            //resize at top left
            let refPoint: PointModel = transformPointByMatrix(matrix, bounds.topLeft); refPoint.x += 8; refPoint.y += 8;
            mouseEvents.dragAndDropEvent(diagramCanvas, refPoint.x, refPoint.y, refPoint.x + 5, refPoint.y - 10);
            let corner: string = TopLeft;
            output += 'topLeft :{offsetX:' + diagram.nodes[0].offsetX + ',offsetY:' + diagram.nodes[0].offsetY +
                ', width: ' + diagram.nodes[0].width + ', height: ' + diagram.nodes[0].height + ' } ';
            expect(diagram.nodes[0].offsetX == resize130[corner].offsetX && diagram.nodes[0].offsetY == resize130[corner].offsetY &&
                Math.round(diagram.nodes[0].width) == Math.round(resize130[corner].width) &&
                Math.round(diagram.nodes[0].height) == Math.round(resize130[corner].height)).toBe(true);
            let node: NodeModel = diagram.nodes[0] as NodeModel;

            //top center
            let topCenter: PointModel = { x: node.offsetX, y: node.offsetY - node.height / 2 };
            refPoint = rotatePoint(node.rotateAngle, node.offsetX, node.offsetY, topCenter);
            refPoint.x += 8; refPoint.y += 8;
            mouseEvents.dragAndDropEvent(diagramCanvas, refPoint.x, refPoint.y, refPoint.x + 20, refPoint.y - 20);
            corner = TopCenter;
            output += 'topCenter :{offsetX:' + diagram.nodes[0].offsetX + ',offsetY:' + diagram.nodes[0].offsetY +
                ', width: ' + diagram.nodes[0].width + ', height: ' + diagram.nodes[0].height + ' } ';
            expect(diagram.nodes[0].offsetX == resize130[corner].offsetX && diagram.nodes[0].offsetY == resize130[corner].offsetY &&
                Math.round(diagram.nodes[0].width) == Math.round(resize130[corner].width) &&
                Math.round(diagram.nodes[0].height) == Math.round(resize130[corner].height)).toBe(true);

            //top right
            let topRight: PointModel = { x: node.offsetX + node.width / 2, y: node.offsetY - node.height / 2 };
            refPoint = rotatePoint(node.rotateAngle, node.offsetX, node.offsetY, topRight);
            refPoint.x += 8; refPoint.y += 8;
            mouseEvents.dragAndDropEvent(diagramCanvas, refPoint.x, refPoint.y, refPoint.x + 20, refPoint.y - 20);
            corner = TopRight;
            output += 'topRight :{offsetX:' + diagram.nodes[0].offsetX + ',offsetY:' + diagram.nodes[0].offsetY +
                ', width: ' + diagram.nodes[0].width + ', height: ' + diagram.nodes[0].height + ' } ';
            expect(diagram.nodes[0].offsetX == resize130[corner].offsetX &&
                Math.round(diagram.nodes[0].offsetY) == Math.round(resize130[corner].offsetY) &&
                Math.round(diagram.nodes[0].width) == Math.round(resize130[corner].width) &&
                Math.round(diagram.nodes[0].height) == Math.round(resize130[corner].height)).toBe(true);

            //middle left
            let middleLeft: PointModel = { x: node.offsetX - node.width / 2, y: node.offsetY };
            refPoint = rotatePoint(node.rotateAngle, node.offsetX, node.offsetY, middleLeft);
            refPoint.x += 8; refPoint.y += 8;
            mouseEvents.dragAndDropEvent(diagramCanvas, refPoint.x, refPoint.y, refPoint.x - 20, refPoint.y - 20);
            corner = MiddleLeft;
            output += 'middleLeft :{offsetX:' + diagram.nodes[0].offsetX + ',offsetY:' + diagram.nodes[0].offsetY +
                ', width: ' + diagram.nodes[0].width + ', height: ' + diagram.nodes[0].height + ' } ';
            expect(diagram.nodes[0].offsetX == resize130[corner].offsetX &&
                Math.round(diagram.nodes[0].offsetY) == Math.round(resize130[corner].offsetY) &&
                Math.round(diagram.nodes[0].width) == Math.round(resize130[corner].width) &&
                Math.round(diagram.nodes[0].height) == Math.round(resize130[corner].height)).toBe(true);

            //middle right
            let middleRight: PointModel = { x: node.offsetX + node.width / 2, y: node.offsetY };
            refPoint = rotatePoint(node.rotateAngle, node.offsetX, node.offsetY, middleRight);
            refPoint.x += 8; refPoint.y += 8;
            mouseEvents.dragAndDropEvent(diagramCanvas, refPoint.x, refPoint.y, refPoint.x + 20, refPoint.y + 20);
            corner = MiddleRight;
            output += 'middleRight :{offsetX:' + diagram.nodes[0].offsetX + ',offsetY:' + diagram.nodes[0].offsetY +
                ', width: ' + diagram.nodes[0].width + ', height: ' + diagram.nodes[0].height + ' } ';
            expect(diagram.nodes[0].offsetX == resize130[corner].offsetX &&
                Math.round(diagram.nodes[0].offsetY) == Math.round(resize130[corner].offsetY) &&
                Math.round(diagram.nodes[0].width) == Math.round(resize130[corner].width) &&
                Math.round(diagram.nodes[0].height) == Math.round(resize130[corner].height)).toBe(true);

            //bottom left
            let bottomLeft: PointModel = { x: node.offsetX - node.width / 2, y: node.offsetY + node.height / 2 };
            refPoint = rotatePoint(node.rotateAngle, node.offsetX, node.offsetY, bottomLeft);
            refPoint.x += 8; refPoint.y += 8;
            mouseEvents.dragAndDropEvent(diagramCanvas, refPoint.x, refPoint.y, refPoint.x - 20, refPoint.y - 0);
            corner = BottomLeft;
            output += 'bottomLeft :{offsetX:' + diagram.nodes[0].offsetX + ',offsetY:' + diagram.nodes[0].offsetY +
                ', width: ' + diagram.nodes[0].width + ', height: ' + diagram.nodes[0].height + ' } ';
            expect(diagram.nodes[0].offsetX == resize130[corner].offsetX &&
                Math.round(diagram.nodes[0].offsetY) == Math.round(resize130[corner].offsetY) &&
                Math.round(diagram.nodes[0].width) == Math.round(resize130[corner].width) &&
                Math.round(diagram.nodes[0].height) == Math.round(resize130[corner].height)).toBe(true);

            //bottom center
            let bottomCenter: PointModel = { x: node.offsetX, y: node.offsetY + node.height / 2 };
            refPoint = rotatePoint(node.rotateAngle, node.offsetX, node.offsetY, bottomCenter);
            refPoint.x += 8; refPoint.y += 8;
            mouseEvents.dragAndDropEvent(diagramCanvas, refPoint.x, refPoint.y, refPoint.x - 20, refPoint.y + 20);
            corner = BottomCenter;
            output += 'bottomCenter :{offsetX:' + diagram.nodes[0].offsetX + ',offsetY:' + diagram.nodes[0].offsetY +
                ', width: ' + diagram.nodes[0].width + ', height: ' + diagram.nodes[0].height + ' } ';
            expect(diagram.nodes[0].offsetX == resize130[corner].offsetX &&
                Math.round(diagram.nodes[0].offsetY) == Math.round(resize130[corner].offsetY) &&
                Math.round(diagram.nodes[0].width) == Math.round(resize130[corner].width) &&
                Math.round(diagram.nodes[0].height) == Math.round(resize130[corner].height)).toBe(true);

            //bottom right
            let bottomRight: PointModel = { x: node.offsetX + node.width / 2, y: node.offsetY + node.height / 2 };
            refPoint = rotatePoint(node.rotateAngle, node.offsetX, node.offsetY, bottomRight);
            refPoint.x += 8; refPoint.y += 8;
            mouseEvents.dragAndDropEvent(diagramCanvas, refPoint.x, refPoint.y, refPoint.x + 0, refPoint.y + 20);
            corner = BottomRight;
            output += 'bottomRight :{offsetX:' + diagram.nodes[0].offsetX + ',offsetY:' + diagram.nodes[0].offsetY +
                ', width: ' + diagram.nodes[0].width + ', height: ' + diagram.nodes[0].height + ' } ';
            expect(diagram.nodes[0].offsetX == resize130[corner].offsetX &&
                Math.round(diagram.nodes[0].offsetY) == Math.round(resize130[corner].offsetY) &&
                Math.round(diagram.nodes[0].width) == Math.round(resize130[corner].width) &&
                Math.round(diagram.nodes[0].height) == Math.round(resize130[corner].height)).toBe(true);
            done();
        });

        it('Checking single node rotation (260) && resizing in SVG', (done: Function) => {

            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let output: string = '';
            diagram.nodes[0].rotateAngle = 0;
            diagram.dataBind();
            diagram.clearSelection();
            //select
            mouseEvents.clickEvent(diagramCanvas, 300, 300);
            // rotate node
            let bounds: Rect = (diagram.nodes[0] as NodeModel).wrapper.bounds;
            let rotator: PointModel = { x: bounds.center.x, y: bounds.y - 30 };
            let matrix: Matrix = identityMatrix();
            rotateMatrix(matrix, 260, bounds.center.x, bounds.center.y);
            let endPoint: PointModel = transformPointByMatrix(matrix, rotator);
            mouseEvents.dragAndDropEvent(diagramCanvas, rotator.x + diagram.element.offsetLeft, rotator.y + diagram.element.offsetTop, endPoint.x + diagram.element.offsetLeft, endPoint.y + diagram.element.offsetTop);
            diagram.nodes[0].rotateAngle = Math.round(diagram.nodes[0].rotateAngle);
            expect(diagram.nodes[0].rotateAngle % 360 == 260).toBe(true);
            //resize at top left
            let refPoint: PointModel = transformPointByMatrix(matrix, bounds.topLeft); refPoint.x += 8; refPoint.y += 8;
            mouseEvents.dragAndDropEvent(diagramCanvas, refPoint.x, refPoint.y, refPoint.x + 5, refPoint.y - 10);
            let corner: string = TopLeft;
            output += 'topLeft :{offsetX:' + diagram.nodes[0].offsetX + ',offsetY:' + diagram.nodes[0].offsetY +
                ', width: ' + diagram.nodes[0].width + ', height: ' + diagram.nodes[0].height + ' } ';
            expect(diagram.nodes[0].offsetX == resize260[corner].offsetX &&
                Math.round(diagram.nodes[0].offsetY) == Math.round(resize260[corner].offsetY) &&
                Math.round(diagram.nodes[0].width) == Math.round(resize260[corner].width) &&
                Math.round(diagram.nodes[0].height) == Math.round(resize260[corner].height)).toBe(true);
            let node: NodeModel = diagram.nodes[0] as NodeModel;

            //top center
            let topCenter: PointModel = { x: node.offsetX, y: node.offsetY - node.height / 2 };
            refPoint = rotatePoint(node.rotateAngle, node.offsetX, node.offsetY, topCenter);
            refPoint.x += 8; refPoint.y += 8;
            mouseEvents.dragAndDropEvent(diagramCanvas, refPoint.x, refPoint.y, refPoint.x + 20, refPoint.y - 20);
            corner = TopCenter;
            output += 'topCenter :{offsetX:' + diagram.nodes[0].offsetX + ',offsetY:' + diagram.nodes[0].offsetY +
                ', width: ' + diagram.nodes[0].width + ', height: ' + diagram.nodes[0].height + ' } ';
            expect(diagram.nodes[0].offsetX == resize260[corner].offsetX &&
                Math.round(diagram.nodes[0].offsetY) == Math.round(resize260[corner].offsetY) &&
                Math.round(diagram.nodes[0].width) == Math.round(resize260[corner].width) &&
                Math.round(diagram.nodes[0].height) == Math.round(resize260[corner].height)).toBe(true);

            //top right
            let topRight: PointModel = { x: node.offsetX + node.width / 2, y: node.offsetY - node.height / 2 };
            refPoint = rotatePoint(node.rotateAngle, node.offsetX, node.offsetY, topRight);
            refPoint.x += 8; refPoint.y += 8;
            mouseEvents.dragAndDropEvent(diagramCanvas, refPoint.x, refPoint.y, refPoint.x + 20, refPoint.y - 20);
            corner = TopRight;
            output += 'topRight :{offsetX:' + diagram.nodes[0].offsetX + ',offsetY:' + diagram.nodes[0].offsetY +
                ', width: ' + diagram.nodes[0].width + ', height: ' + diagram.nodes[0].height + ' } ';
            expect(diagram.nodes[0].offsetX == resize260[corner].offsetX &&
                Math.round(diagram.nodes[0].offsetY) == Math.round(resize260[corner].offsetY) &&
                Math.round(diagram.nodes[0].width) == Math.round(resize260[corner].width) &&
                Math.round(diagram.nodes[0].height) == Math.round(resize260[corner].height)).toBe(true);

            //middle left
            let middleLeft: PointModel = { x: node.offsetX - node.width / 2, y: node.offsetY };
            refPoint = rotatePoint(node.rotateAngle, node.offsetX, node.offsetY, middleLeft);
            refPoint.x += 8; refPoint.y += 8;
            mouseEvents.dragAndDropEvent(diagramCanvas, refPoint.x, refPoint.y, refPoint.x - 20, refPoint.y - 20);
            corner = MiddleLeft;
            output += 'middleLeft :{offsetX:' + diagram.nodes[0].offsetX + ',offsetY:' + diagram.nodes[0].offsetY +
                ', width: ' + diagram.nodes[0].width + ', height: ' + diagram.nodes[0].height + ' } ';
            expect(diagram.nodes[0].offsetX == resize260[corner].offsetX &&
                Math.round(diagram.nodes[0].offsetY) == Math.round(resize260[corner].offsetY) &&
                Math.round(diagram.nodes[0].width) == Math.round(resize260[corner].width) &&
                Math.round(diagram.nodes[0].height) == Math.round(resize260[corner].height)).toBe(true);

            //middle right
            let middleRight: PointModel = { x: node.offsetX + node.width / 2, y: node.offsetY };
            refPoint = rotatePoint(node.rotateAngle, node.offsetX, node.offsetY, middleRight);
            refPoint.x += 8; refPoint.y += 8;
            mouseEvents.dragAndDropEvent(diagramCanvas, refPoint.x, refPoint.y, refPoint.x + 20, refPoint.y + 20);
            corner = MiddleRight;
            output += 'middleRight :{offsetX:' + diagram.nodes[0].offsetX + ',offsetY:' + diagram.nodes[0].offsetY +
                ', width: ' + diagram.nodes[0].width + ', height: ' + diagram.nodes[0].height + ' } ';
            expect(diagram.nodes[0].offsetX == resize260[corner].offsetX &&
                Math.round(diagram.nodes[0].offsetY) == Math.round(resize260[corner].offsetY) &&
                Math.round(diagram.nodes[0].width) == Math.round(resize260[corner].width) &&
                Math.round(diagram.nodes[0].height) == Math.round(resize260[corner].height)).toBe(true);

            //bottom left
            let bottomLeft: PointModel = { x: node.offsetX - node.width / 2, y: node.offsetY + node.height / 2 };
            refPoint = rotatePoint(node.rotateAngle, node.offsetX, node.offsetY, bottomLeft);
            refPoint.x += 8; refPoint.y += 8;
            mouseEvents.dragAndDropEvent(diagramCanvas, refPoint.x, refPoint.y, refPoint.x - 20, refPoint.y - 0);
            corner = BottomLeft;
            output += 'bottomLeft :{offsetX:' + diagram.nodes[0].offsetX + ',offsetY:' + diagram.nodes[0].offsetY +
                ', width: ' + diagram.nodes[0].width + ', height: ' + diagram.nodes[0].height + ' } ';
            expect(diagram.nodes[0].offsetX == resize260[corner].offsetX &&
                Math.round(diagram.nodes[0].offsetY) == Math.round(resize260[corner].offsetY) &&
                Math.round(diagram.nodes[0].width) == Math.round(resize260[corner].width) &&
                Math.round(diagram.nodes[0].height) == Math.round(resize260[corner].height)).toBe(true);

            //bottom center
            let bottomCenter: PointModel = { x: node.offsetX, y: node.offsetY + node.height / 2 };
            refPoint = rotatePoint(node.rotateAngle, node.offsetX, node.offsetY, bottomCenter);
            refPoint.x += 8; refPoint.y += 8;
            mouseEvents.dragAndDropEvent(diagramCanvas, refPoint.x, refPoint.y, refPoint.x - 20, refPoint.y + 20);
            corner = BottomCenter;
            output += 'bottomCenter :{offsetX:' + diagram.nodes[0].offsetX + ',offsetY:' + diagram.nodes[0].offsetY +
                ', width: ' + diagram.nodes[0].width + ', height: ' + diagram.nodes[0].height + ' } ';
            expect(diagram.nodes[0].offsetX == resize260[corner].offsetX &&
                Math.round(diagram.nodes[0].offsetY) == Math.round(resize260[corner].offsetY) &&
                Math.round(diagram.nodes[0].width) == Math.round(resize260[corner].width) &&
                Math.round(diagram.nodes[0].height) == Math.round(resize260[corner].height)).toBe(true);

            //bottom right
            let bottomRight: PointModel = { x: node.offsetX + node.width / 2, y: node.offsetY + node.height / 2 };
            refPoint = rotatePoint(node.rotateAngle, node.offsetX, node.offsetY, bottomRight);
            refPoint.x += 8; refPoint.y += 8;
            mouseEvents.dragAndDropEvent(diagramCanvas, refPoint.x, refPoint.y, refPoint.x + 0, refPoint.y + 20);
            corner = BottomRight;
            output += 'bottomRight :{offsetX:' + diagram.nodes[0].offsetX + ',offsetY:' + diagram.nodes[0].offsetY +
                ', width: ' + diagram.nodes[0].width + ', height: ' + diagram.nodes[0].height + ' } ';
            expect(diagram.nodes[0].offsetX == resize260[corner].offsetX &&
                Math.round(diagram.nodes[0].offsetY) == Math.round(resize260[corner].offsetY) &&
                Math.round(diagram.nodes[0].width) == Math.round(resize260[corner].width) &&
                Math.round(diagram.nodes[0].height) == Math.round(resize260[corner].height)).toBe(true);
            done();
        });
    });

    describe('Testing Resizing', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        let mouseEvents: MouseEvents = new MouseEvents();

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram4' });
            document.body.appendChild(ele);
            let selArray: (NodeModel | ConnectorModel)[] = [];
            let node: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 300, offsetY: 300,
                minWidth: 40, maxWidth: 500, minHeight: 40, maxHeight: 500
            };

            let node2: NodeModel = { id: 'node2', width: 100, height: 100, offsetX: 300, offsetY: 500 };


            diagram = new Diagram({
                mode: 'Canvas',
                width: 550, height: 550, nodes: [node, node2], snapSettings: { constraints: SnapConstraints.ShowLines }
            });

            diagram.appendTo('#diagram4');
            selArray.push(diagram.nodes[0]);
            diagram.select(selArray);
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking single node resizing - top left in SVG rendering Mode', (done: Function) => {

            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');

            let offsetLeft: number = diagram.element.offsetLeft;
            let offsetTop: number = diagram.element.offsetTop;

            //increasing size
            let topLeft1: PointModel = (diagram.nodes[0] as NodeModel).wrapper.bounds.topLeft;

            mouseEvents.clickEvent(diagramCanvas, 300, 300);

            mouseEvents.dragAndDropEvent(diagramCanvas, topLeft1.x, topLeft1.y, topLeft1.x - 10, topLeft1.y - 10);

            //reducing size
            let topLeft2: PointModel = (diagram.nodes[1] as NodeModel).wrapper.bounds.topLeft;

            mouseEvents.clickEvent(diagramCanvas, 300, 500);

            mouseEvents.dragAndDropEvent(diagramCanvas, topLeft2.x, topLeft2.y, topLeft2.x + 10, topLeft2.y + 10);

            expect(diagram.nodes[0].offsetX == 295 && diagram.nodes[0].offsetY == 295 &&
                Math.round(diagram.nodes[0].width) == 110 && Math.round(diagram.nodes[0].height) == 110 &&
                diagram.nodes[1].offsetX == 305 && diagram.nodes[1].offsetY == 505 &&
                Math.round(diagram.nodes[1].width) == 90 && Math.round(diagram.nodes[1].height) == 90
            ).toBe(true);
            done();
        });

        it('Checking single node resizing - top right in SVG rendering Mode', (done: Function) => {

            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');

            let offsetLeft: number = diagram.element.offsetLeft;
            let offsetTop: number = diagram.element.offsetTop;

            //reducing size
            let topLeft1: PointModel = (diagram.nodes[0] as NodeModel).wrapper.bounds.topRight;

            mouseEvents.clickEvent(diagramCanvas, 295, 295);

            mouseEvents.dragAndDropEvent(diagramCanvas, topLeft1.x, topLeft1.y, topLeft1.x - 10, topLeft1.y + 10);

            //increasing size
            let topLeft2: PointModel = (diagram.nodes[1] as NodeModel).wrapper.bounds.topRight;

            mouseEvents.clickEvent(diagramCanvas, 305, 505);

            mouseEvents.dragAndDropEvent(diagramCanvas, topLeft2.x, topLeft2.y, topLeft2.x + 10, topLeft2.y - 10);

            expect(diagram.nodes[0].offsetX == 290 && diagram.nodes[0].offsetY == 300 &&
                Math.round(diagram.nodes[0].width) == 100 && Math.round(diagram.nodes[0].height) == 100 &&
                diagram.nodes[1].offsetX == 310 && diagram.nodes[1].offsetY == 500 &&
                Math.round(diagram.nodes[1].width) == 100 && Math.round(diagram.nodes[1].height) == 100
            ).toBe(true);
            done();
        });


        it('Checking single node resizing - bottom left in SVG rendering Mode', (done: Function) => {

            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');

            let offsetLeft: number = diagram.element.offsetLeft;
            let offsetTop: number = diagram.element.offsetTop;

            //increasing size
            let topLeft1: PointModel = (diagram.nodes[0] as NodeModel).wrapper.bounds.bottomLeft;

            mouseEvents.clickEvent(diagramCanvas, 290, 300);

            mouseEvents.dragAndDropEvent(diagramCanvas, topLeft1.x, topLeft1.y, topLeft1.x - 10, topLeft1.y + 10);

            //reducing size
            let topLeft2: PointModel = (diagram.nodes[1] as NodeModel).wrapper.bounds.bottomLeft;

            mouseEvents.clickEvent(diagramCanvas, 310, 500);

            mouseEvents.dragAndDropEvent(diagramCanvas, topLeft2.x, topLeft2.y, topLeft2.x + 10, topLeft2.y - 10);

            expect(diagram.nodes[0].offsetX == 285 && diagram.nodes[0].offsetY == 305 &&
                Math.round(diagram.nodes[0].width) == 110 && Math.round(diagram.nodes[0].height) == 110 &&
                diagram.nodes[1].offsetX == 315 && diagram.nodes[1].offsetY == 495 &&
                Math.round(diagram.nodes[1].width) == 90 && Math.round(diagram.nodes[1].height) == 90
            ).toBe(true);
            done();
        });

        it('Checking single node resizing - bottom right in SVG rendering Mode', (done: Function) => {

            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');

            let offsetLeft: number = diagram.element.offsetLeft;
            let offsetTop: number = diagram.element.offsetTop;

            //reducing size
            let topLeft1: PointModel = (diagram.nodes[0] as NodeModel).wrapper.bounds.bottomRight;

            mouseEvents.clickEvent(diagramCanvas, 285, 305);

            mouseEvents.dragAndDropEvent(diagramCanvas, topLeft1.x, topLeft1.y, topLeft1.x - 10, topLeft1.y - 10);

            //increasing size
            let topLeft2: PointModel = (diagram.nodes[1] as NodeModel).wrapper.bounds.bottomRight;

            mouseEvents.clickEvent(diagramCanvas, 315, 495);

            mouseEvents.dragAndDropEvent(diagramCanvas, topLeft2.x, topLeft2.y, topLeft2.x + 10, topLeft2.y + 10);

            expect(diagram.nodes[0].offsetX == 280 && diagram.nodes[0].offsetY == 300 &&
                Math.round(diagram.nodes[0].width) == 100 && Math.round(diagram.nodes[0].height) == 100 &&
                diagram.nodes[1].offsetX == 320 && diagram.nodes[1].offsetY == 500 &&
                Math.round(diagram.nodes[1].width) == 100 && Math.round(diagram.nodes[1].height) == 100
            ).toBe(true);
            done();
        });

        it('Checking single node resizing - top in SVG rendering Mode', (done: Function) => {

            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');

            let offsetLeft: number = diagram.element.offsetLeft;
            let offsetTop: number = diagram.element.offsetTop;

            //reducing size

            //offset - 280, 300
            mouseEvents.clickEvent(diagramCanvas, 280, 300);
            let topLeft1: PointModel = (diagram.nodes[0] as NodeModel).wrapper.bounds.topCenter;

            //increase size at top 240, 360
            mouseEvents.dragAndDropEvent(diagramCanvas, topLeft1.x, topLeft1.y, topLeft1.x - 10, topLeft1.y - 20);

            //size should be increased by 20, offset should be decreased by 10
            expect(diagram.nodes[0].offsetX == 280 && diagram.nodes[0].offsetY == 290 &&
                Math.round(diagram.nodes[0].width) == 100 && Math.round(diagram.nodes[0].height) == 120).toBe(true);
            topLeft1 = (diagram.nodes[0] as NodeModel).wrapper.bounds.topCenter;
            //reduce size at top
            mouseEvents.dragAndDropEvent(diagramCanvas, topLeft1.x, topLeft1.y, topLeft1.x - 10, topLeft1.y + 10);

            //size should be decreased by 10, offset should be increased by 5
            expect(diagram.nodes[0].offsetX == 280 && diagram.nodes[0].offsetY == 295 &&
                Math.round(diagram.nodes[0].width) == 100 && Math.round(diagram.nodes[0].height) == 110).toBe(true);
            done();
        });

        it('Checking single node resizing - bottom in SVG rendering Mode', (done: Function) => {

            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');

            let offsetLeft: number = diagram.element.offsetLeft;
            let offsetTop: number = diagram.element.offsetTop;

            //reducing size

            //offset - 280, 300
            mouseEvents.clickEvent(diagramCanvas, 280, 295);
            let topLeft1: PointModel = (diagram.nodes[0] as NodeModel).wrapper.bounds.bottomCenter;

            //increase size at top 240, 360
            mouseEvents.dragAndDropEvent(diagramCanvas, topLeft1.x, topLeft1.y, topLeft1.x - 10, topLeft1.y + 20);

            //size should be increased by 20, offset should be inceased by 10
            expect(diagram.nodes[0].offsetX == 280 && diagram.nodes[0].offsetY == 305 &&
                Math.round(diagram.nodes[0].width) == 100 && Math.round(diagram.nodes[0].height) == 130).toBe(true);
            topLeft1 = (diagram.nodes[0] as NodeModel).wrapper.bounds.bottomCenter;
            //reduce size at top
            mouseEvents.dragAndDropEvent(diagramCanvas, topLeft1.x, topLeft1.y, topLeft1.x - 10, topLeft1.y - 10);

            //size should be decreased by 10, offset should be increased by 5
            expect(diagram.nodes[0].offsetX == 280 && diagram.nodes[0].offsetY == 300 &&
                Math.round(diagram.nodes[0].width) == 100 && Math.round(diagram.nodes[0].height) == 120).toBe(true);
            done();
        });


        it('Checking single node resizing - left in SVG rendering Mode', (done: Function) => {

            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');

            let offsetLeft: number = diagram.element.offsetLeft;
            let offsetTop: number = diagram.element.offsetTop;

            //reducing size

            //offset - 280, 300
            mouseEvents.clickEvent(diagramCanvas, 280, 300);
            let topLeft1: PointModel = (diagram.nodes[0] as NodeModel).wrapper.bounds.middleLeft;

            //increase size at top 240, 360
            mouseEvents.dragAndDropEvent(diagramCanvas, topLeft1.x, topLeft1.y, topLeft1.x - 20, topLeft1.y + 20);

            //size should be increased by 20, offset should be inceased by 10
            expect(diagram.nodes[0].offsetX == 270 && diagram.nodes[0].offsetY == 300 &&
                Math.round(diagram.nodes[0].width) == 120 && Math.round(diagram.nodes[0].height) == 120).toBe(true);
            topLeft1 = (diagram.nodes[0] as NodeModel).wrapper.bounds.middleLeft;
            //reduce size at top
            mouseEvents.dragAndDropEvent(diagramCanvas, topLeft1.x, topLeft1.y, topLeft1.x + 10, topLeft1.y - 10);

            //size should be decreased by 10, offset should be increased by 5
            expect(diagram.nodes[0].offsetX == 275 && diagram.nodes[0].offsetY == 300 &&
                Math.round(diagram.nodes[0].width) == 110 && Math.round(diagram.nodes[0].height) == 120).toBe(true);
            done();
        });

        it('Checking single node resizing - right in SVG rendering Mode', (done: Function) => {

            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');

            let offsetLeft: number = diagram.element.offsetLeft;
            let offsetTop: number = diagram.element.offsetTop;

            //reducing size

            //offset - 280, 300
            mouseEvents.clickEvent(diagramCanvas, 280, 300);
            let topLeft1: PointModel = (diagram.nodes[0] as NodeModel).wrapper.bounds.middleRight;

            //increase size at top 240, 360
            mouseEvents.dragAndDropEvent(diagramCanvas, topLeft1.x, topLeft1.y, topLeft1.x + 20, topLeft1.y + 20);

            //size should be increased by 20, offset should be inceased by 10
            expect(diagram.nodes[0].offsetX == 285 && diagram.nodes[0].offsetY == 300 &&
                Math.round(diagram.nodes[0].width) == 130 && Math.round(diagram.nodes[0].height) == 120).toBe(true);
            topLeft1 = (diagram.nodes[0] as NodeModel).wrapper.bounds.middleRight;
            //reduce size at top
            mouseEvents.dragAndDropEvent(diagramCanvas, topLeft1.x, topLeft1.y, topLeft1.x - 10, topLeft1.y - 10);

            //size should be decreased by 10, offset should be increased by 5
            expect(diagram.nodes[0].offsetX == 280 && diagram.nodes[0].offsetY == 300 &&
                Math.round(diagram.nodes[0].width) == 120 && Math.round(diagram.nodes[0].height) == 120).toBe(true);
            done();
        });

    });

    describe('Testing Rotation - Multiple selection', () => {
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
                mode: 'Canvas',
                width: 550, height: 550, nodes: [node, node2],
                connectors: [connector], snapSettings: { constraints: SnapConstraints.ShowLines }
            });

            diagram.appendTo('#diagram10');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking rotation - multiple selection in SVG rendering Mode', (done: Function) => {

            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');

            mouseEvents.clickEvent(diagramCanvas, 300, 300, true);

            mouseEvents.clickEvent(diagramCanvas, 300, 500, true);

            mouseEvents.clickEvent(diagramCanvas, 400 + diagram.element.offsetLeft, 400 + diagram.element.offsetLeft, true);

            let bounds: Rect = diagram.selectedItems.wrapper.bounds;
            let rotator: PointModel = { x: bounds.center.x, y: bounds.y - 30 };

            let matrix: Matrix = identityMatrix();
            rotateMatrix(matrix, 320, bounds.center.x, bounds.center.y);

            let endPoint: PointModel = transformPointByMatrix(matrix, rotator);

            mouseEvents.dragAndDropEvent(diagramCanvas, rotator.x + diagram.element.offsetLeft, rotator.y + diagram.element.offsetTop, endPoint.x + diagram.element.offsetLeft, endPoint.y + diagram.element.offsetTop);

            expect(Math.round(diagram.nodes[0].rotateAngle) == 320).toBe(true);
            done();
        });
    });

    describe('Testing Resizing - Multiple selection', () => {
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
                mode: 'Canvas',
                width: 550, height: 550, nodes: [node, node2], snapSettings: { constraints: SnapConstraints.ShowLines },
                connectors: [{ id: 'connector1', sourcePoint: { x: 400, y: 400 }, targetPoint: { x: 500, y: 500 } }]
            });

            diagram.appendTo('#diagram11');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking resizing - multiple selection in SVG rendering Mode', (done: Function) => {

            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');

            mouseEvents.clickEvent(diagramCanvas, 300, 300);
            mouseEvents.clickEvent(diagramCanvas, 300, 500, true);
            mouseEvents.clickEvent(diagramCanvas, 400 + diagram.element.offsetLeft, 400 + diagram.element.offsetTop, true);

            let width: number = diagram.selectedItems.width;
            let height: number = diagram.selectedItems.height;
            let offsetX: number = diagram.selectedItems.offsetX;
            let offsetY: number = diagram.selectedItems.offsetY;
            let topLeft: PointModel = diagram.selectedItems.wrapper.bounds.bottomRight;

            //increase size at top
            mouseEvents.dragAndDropEvent(diagramCanvas, topLeft.x, topLeft.y, topLeft.x + 20, topLeft.y + 20);
            let topLeft1: PointModel = (diagram.nodes[0] as NodeModel).wrapper.bounds.middleRight;

            expect(Math.round(diagram.selectedItems.width) == width + 20 &&
                Math.round(diagram.selectedItems.height) == height + 20 &&
                diagram.selectedItems.offsetX == offsetX + 10 &&
                Math.round(diagram.selectedItems.offsetY) == offsetY + 10).toBe(true);
            done();

        });
    });

    describe('Connector End Dragging', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        let mouseEvents: MouseEvents = new MouseEvents();

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagrambab' });
            document.body.appendChild(ele);
            let selArray: (NodeModel | ConnectorModel)[] = [];

            let connector: ConnectorModel = { id: 'connector1', sourcePoint: { x: 200, y: 200 }, targetPoint: { x: 300, y: 300 } };

            diagram = new Diagram({
                mode: 'Canvas',
                width: 550, height: 550,
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

        it('Checking sourcePoint dragging in SVG rendering Mode', (done: Function) => {

            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.dragAndDropEvent(diagramCanvas, 200, 200, 180, 180);
            expect(diagram.selectedItems.connectors.length == 1 && diagram.selectedItems.connectors[0].sourcePoint.x == 172 &&
                diagram.selectedItems.connectors[0].sourcePoint.y == 172 && diagram.selectedItems.connectors[0].targetPoint.x == 300
                && diagram.selectedItems.connectors[0].targetPoint.y == 300).toBe(true);
            done();
        });
    });

    describe('Connector End Dragging', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        let mouseEvents: MouseEvents = new MouseEvents();

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagrambac' });
            document.body.appendChild(ele);
            let selArray: (NodeModel | ConnectorModel)[] = [];

            let connector: ConnectorModel = { id: 'connector1', sourcePoint: { x: 200, y: 200 }, targetPoint: { x: 300, y: 300 } };

            diagram = new Diagram({
                mode: 'Canvas',
                width: 550, height: 550,
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

        it('Checking targetPoint dragging in SVG rendering Mode', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.dragAndDropEvent(diagramCanvas, 300, 300, 320, 320);
            expect(diagram.selectedItems.connectors.length == 1 && diagram.selectedItems.connectors[0].sourcePoint.x == 200 &&
                diagram.selectedItems.connectors[0].sourcePoint.y == 200 &&
                diagram.selectedItems.connectors[0].targetPoint.x == 312
                && diagram.selectedItems.connectors[0].targetPoint.y == 312).toBe(true);
            done();

        });
    });

    describe('Aborting Interaction', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        let mouseEvents: MouseEvents = new MouseEvents();

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram3' });
            document.body.appendChild(ele);
            let selArray: (NodeModel | ConnectorModel)[] = [];
            let node: NodeModel = { id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100 };

            let bpmn: NodeModel = {
                id: 'bpmnshape', width: 100, height: 100, offsetX: 100, offsetY: 500,
                shape: { type: 'Bpmn' }
            };

            let connector: ConnectorModel = { id: 'connector1', sourcePoint: { x: 200, y: 200 }, targetPoint: { x: 300, y: 300 } };


            diagram = new Diagram({
                mode: 'Canvas',
                width: '800px', height: '500px', nodes: [node, bpmn],
                connectors: [connector], snapSettings: { constraints: SnapConstraints.ShowLines }
            });

            diagram.appendTo('#diagram3');
            selArray.push(diagram.nodes[0]);
            diagram.select(selArray);
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Aborting dragging in SVG rendering Mode', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 150, 150);

            mouseEvents.mouseDownEvent(diagramCanvas, 100, 100);
            mouseEvents.mouseMoveEvent(diagramCanvas, 300, 300);
            mouseEvents.mouseLeaveEvent(diagramCanvas);

            expect(diagram.selectedItems.nodes.length == 1 && diagram.selectedItems.nodes[0].offsetX == 100 &&
                diagram.selectedItems.nodes[0].offsetY == 100).toBe(false);
            done();
        });

        it('Aborting scaling in SVG rendering Mode', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            //increasing size
            let topLeft1: PointModel = (diagram.nodes[0] as NodeModel).wrapper.bounds.topLeft;

            mouseEvents.clickEvent(diagramCanvas, 100, 100);

            // mouseEvents.mouseDownEvent(diagramCanvas, topLeft1.x, topLeft1.y);
            // mouseEvents.mouseMoveEvent(diagramCanvas, topLeft1.x - 10, topLeft1.y - 10);
            mouseEvents.mouseMoveEvent(diagramCanvas, 150, 100);
            mouseEvents.mouseDownEvent(diagramCanvas, 150, 100);
            mouseEvents.mouseMoveEvent(diagramCanvas, 155, 100);
            mouseEvents.mouseLeaveEvent(diagramCanvas);
            expect(diagram.selectedItems.nodes.length == 1).toBe(false);
            done();
        });

        it('Aborting resizing in SVG rendering Mode', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let bounds: Rect = (diagram.nodes[0] as NodeModel).wrapper.bounds;
            let rotator: PointModel = { x: bounds.middleRight.x, y: bounds.middleRight.y };
            mouseEvents.clickEvent(diagramCanvas, 300, 280);
            mouseEvents.mouseDownEvent(diagramCanvas, rotator.x, rotator.y);
            mouseEvents.mouseMoveEvent(diagramCanvas, 700, 700);
            mouseEvents.mouseLeaveEvent(diagramCanvas);
            expect(diagram.selectedItems.nodes.length == 1 && diagram.nodes[0].rotateAngle == 0).toBe(true); done();
        });

        it('Aborting rotation in SVG rendering Mode', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let bounds: Rect = (diagram.nodes[0] as NodeModel).wrapper.bounds;
            let rotator: PointModel = { x: bounds.center.x, y: bounds.y - 30 };
            let matrix: Matrix = identityMatrix();
            rotateMatrix(matrix, 50, bounds.center.x, bounds.center.y);
            mouseEvents.clickEvent(diagramCanvas, 300, 280);
            let endPoint: PointModel = transformPointByMatrix(matrix, rotator);
            mouseEvents.mouseDownEvent(diagramCanvas, rotator.x + diagram.element.offsetLeft, rotator.y + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, endPoint.x + diagram.element.offsetLeft, endPoint.y + diagram.element.offsetTop);
            mouseEvents.mouseLeaveEvent(diagramCanvas);
            expect(diagram.selectedItems.nodes.length == 1 && diagram.nodes[0].rotateAngle == 0).toBe(false); done();
        });

        it('Aborting Connector Dragging in SVG rendering Mode', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 250, 250);

            mouseEvents.mouseDownEvent(diagramCanvas, 300 + diagram.element.offsetLeft, 300 + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 400 + diagram.element.offsetLeft, 400 + diagram.element.offsetTop);

            mouseEvents.mouseLeaveEvent(diagramCanvas);
            expect(diagram.selectedItems.connectors.length == 1).toBe(true);
            done();
        });
    });
    describe('Remove Node', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        let mouseEvents: MouseEvents = new MouseEvents();

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramremoveElement' });
            document.body.appendChild(ele);
            let selArray: (NodeModel | ConnectorModel)[] = [];

            let node: NodeModel = {
                id: "node1", width: 90, height: 40, annotations: [{ content: 'Label' }, { id: 'text1', offset: { x: 0.7, y: 1 }, content: 'Label2' }],
                offsetX: 100, offsetY: 100, shape: { type: 'Flow', shape: 'Process' }
            };

            diagram = new Diagram({
                mode: 'Canvas',
                width: 550, height: 550,
                nodes: [node]
            });

            diagram.appendTo('#diagramremoveElement');
            selArray.push(diagram.nodes[0]);
            diagram.select(selArray);
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking remove node in SVG mode', (done: Function) => {

            expect(diagram.nodes.length == 1).toBe(true);
            diagram.remove();
            expect(diagram.nodes.length == 0).toBe(true);
            done();
        });
    });
});