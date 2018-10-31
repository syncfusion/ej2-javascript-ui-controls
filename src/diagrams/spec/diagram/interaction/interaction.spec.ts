import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { PointPortModel } from '../../../src/diagram/objects/port-model';
import { Connector } from '../../../src/diagram/objects/connector';
import { Node } from '../../../src/diagram/objects/node';
import { ConnectorModel, BpmnFlowModel, StraightSegmentModel } from '../../../src/diagram/objects/connector-model';
import { NodeModel, BasicShapeModel } from '../../../src/diagram/objects/node-model';
import { TextStyleModel } from '../../../src/diagram/core/appearance-model';
import { BpmnDiagrams } from '../../../src/diagram/objects/bpmn';
import { PointModel } from '../../../src/diagram/primitives/point-model';
import { ContextMenuItemModel } from '../../../src/diagram/objects/interface/interfaces';
import { DiagramContextMenu } from '../../../src/diagram/objects/context-menu';
import { Rect } from '../../../src/diagram/primitives/rect';
import { Matrix, transformPointByMatrix, identityMatrix, rotateMatrix } from '../../../src/diagram/primitives/matrix';
import { rotatePoint } from '../../../src/diagram/utility/base-util';
import { MouseEvents } from './mouseevents.spec';
import { UndoRedo } from '../../../src/diagram/objects/undo-redo';
import { SnapConstraints } from '../../../src/diagram/index';
import { DiagramTools, DiagramConstraints } from '../../../src/diagram/enum/enum';
import { MenuItemModel } from '@syncfusion/ej2-navigations';
Diagram.Inject(BpmnDiagrams, DiagramContextMenu, UndoRedo);
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
                width: 550, height: 550, nodes: [node],
                connectors: [connector], snapSettings: { constraints: SnapConstraints.ShowLines }
            });

            diagram.appendTo('#diagram12');

        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking node selection', (done: Function) => {

            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 150, 150);

            expect(diagram.selectedItems.nodes.length == 1 && diagram.selectedItems.nodes[0].id == 'node1').toBe(true);
            done();
        });

        it('TestCases for pivot line rendering', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 150, 150);
            expect(diagram.selectedItems.nodes.length == 1 && diagram.selectedItems.nodes[0].id == 'node1').toBe(true);
            mouseEvents.mouseMoveEvent(diagramCanvas, 800, 100);
            mouseEvents.mouseLeaveEvent(diagramCanvas);
            let pivotelem = document.querySelector('.e-diagram-pivot-line');
            let pivotelemstyle = getComputedStyle(pivotelem);
            expect(pivotelemstyle.stroke === 'rgb(227, 22, 91)').toBe(true);
            done();
        });

        it('Checking connector selection', (done: Function) => {

            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 253 + diagram.element.offsetLeft, 250 + diagram.element.offsetTop);
            expect(diagram.selectedItems.connectors.length == 1 && diagram.selectedItems.connectors[0].id == 'connector1').toBe(true);
            done();
        });


        it('Checking rubber band selection', (done: Function) => {

            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.dragAndDropEvent(diagramCanvas, 30, 30, 400, 400);

            expect(diagram.selectedItems.connectors.length == 1 && diagram.selectedItems.connectors[0].id == 'connector1' &&
                diagram.selectedItems.nodes.length == 1 && diagram.selectedItems.nodes[0].id == 'node1').toBe(true); done();
        });

        it('Checking rubber band selection on mouse leave', (done: Function) => {

            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.dragAndDropEvent(diagramCanvas, 30, 30, 400, 400);
            mouseEvents.mouseLeaveEvent(diagramCanvas);

            expect(diagram.selectedItems.connectors.length == 1 && diagram.selectedItems.connectors[0].id == 'connector1' &&
                diagram.selectedItems.nodes.length == 1 && diagram.selectedItems.nodes[0].id == 'node1').toBe(true); done();
        });

        it('Checking rubber band selection - complete intersect', (done: Function) => {

            diagram.selectedItems.rubberBandSelectionMode = 'CompleteIntersect';
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.dragAndDropEvent(diagramCanvas, 30, 30, 250, 250);

            expect(diagram.selectedItems.connectors.length == 0 &&
                diagram.selectedItems.nodes.length == 1 && diagram.selectedItems.nodes[0].id == 'node1').toBe(true); done();
        });

        it('Checking rubber band selection - partial intersect', (done: Function) => {

            diagram.selectedItems.rubberBandSelectionMode = 'PartialIntersect';
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.dragAndDropEvent(diagramCanvas, 30, 30, 250, 250);

            expect(diagram.selectedItems.connectors.length == 1 && diagram.selectedItems.connectors[0].id == 'connector1' &&
                diagram.selectedItems.nodes.length == 1 && diagram.selectedItems.nodes[0].id == 'node1').toBe(true); done();
        });

        it('Checking ctrl + click - add Selection', (done: Function) => {

            diagram.clearSelection();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');

            mouseEvents.clickEvent(diagramCanvas, 150, 150, true);

            mouseEvents.clickEvent(diagramCanvas, 250, 250, true);

            expect(diagram.selectedItems.connectors.length == 1 && diagram.selectedItems.connectors[0].id == 'connector1' &&
                diagram.selectedItems.nodes.length == 1 && diagram.selectedItems.nodes[0].id == 'node1').toBe(true); done();

        });


        it('Checking ctrl + click - remove Selection', (done: Function) => {


            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');

            mouseEvents.clickEvent(diagramCanvas, 250, 250, true);

            expect(diagram.selectedItems.connectors.length == 0 &&
                diagram.selectedItems.nodes.length == 1 && diagram.selectedItems.nodes[0].id == 'node1').toBe(true); done();

        });


        it('Checking shift + click - add Selection', (done: Function) => {


            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');

            mouseEvents.clickEvent(diagramCanvas, 250, 250, false, true);

            expect(diagram.selectedItems.connectors.length == 1 &&
                diagram.selectedItems.nodes.length == 1 && diagram.selectedItems.nodes[0].id == 'node1').toBe(true); done();

        });

        it('Checking clear selection', (done: Function) => {

            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 500, 100);

            expect(diagram.selectedItems.connectors.length == 0 &&
                diagram.selectedItems.nodes.length == 0).toBe(true); done();
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
                    width: 550, height: 550, nodes: [node, node1],
                    connectors: [connector, connector1], snapSettings: { constraints: SnapConstraints.ShowLines }
                });

                diagram.appendTo('#diagram2');
            });

            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });

            it('Checking z-order based node selection', (done: Function) => {

                let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
                mouseEvents.clickEvent(diagramCanvas, 150 + diagram.element.offsetLeft, 150 + diagram.element.offsetTop);

                expect(diagram.selectedItems.nodes.length == 1 && diagram.selectedItems.nodes[0].id == 'node2').toBe(true);
                done();
            });

            it('Checking z-order based connector selection', (done: Function) => {
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

        it('Checking selected node(single) dragging', (done: Function) => {

            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 150, 150);

            mouseEvents.dragAndDropEvent(diagramCanvas, 100, 100, 600, 600);

            expect(diagram.selectedItems.nodes.length == 1 && diagram.selectedItems.nodes[0].offsetX == 600 &&
                diagram.selectedItems.nodes[0].offsetY == 600).toBe(true);
            done();
        });

        it('Checking selected connector(Single) dragging', (done: Function) => {

            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 250, 250);

            mouseEvents.dragAndDropEvent(diagramCanvas, 250, 250, 400, 400);

            expect(diagram.selectedItems.connectors.length == 1 && diagram.selectedItems.connectors[0].id == 'connector1' &&
                diagram.selectedItems.connectors[0].wrapper.offsetX == 400
                && diagram.selectedItems.connectors[0].wrapper.offsetY == 400).toBe(true);
            done();
        });

        it('Checking selected complex node dragging', (done: Function) => {

            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 100, 500);

            mouseEvents.dragAndDropEvent(diagramCanvas, 100, 500, 100, 400);

            expect(diagram.selectedItems.nodes.length == 1 && diagram.selectedItems.nodes[0].id == 'bpmnshape' &&
                diagram.selectedItems.nodes[0].wrapper.offsetX == 100
                && diagram.selectedItems.nodes[0].wrapper.offsetY == 400).toBe(true);
            done();
        });

        it('Checking ctrl + dragging node dragging', (done: Function) => {

            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');

            mouseEvents.dragAndDropEvent(diagramCanvas, 400 + diagram.element.offsetLeft, 400 + diagram.element.offsetTop, 400 + diagram.element.offsetLeft, 300 + diagram.element.offsetTop, true);

            expect(diagram.selectedItems.nodes.length == 1 && diagram.selectedItems.nodes[0].id == 'bpmnshape' &&
                diagram.selectedItems.connectors.length == 1 && diagram.selectedItems.connectors[0].id == 'connector1' &&
                diagram.selectedItems.connectors[0].wrapper.offsetX == 400
                && diagram.selectedItems.connectors[0].wrapper.offsetY == 300).toBe(true);
            done();
        });

        it('Checking rubber band selection && dragging', (done: Function) => {

            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.dragAndDropEvent(diagramCanvas, 200, 200, 700, 700);

            let offsetX: number = diagram.selectedItems.offsetX;
            let offsetY: number = diagram.selectedItems.offsetY;

            mouseEvents.dragAndDropEvent(diagramCanvas, 400 + diagram.element.offsetLeft, 300 + diagram.element.offsetTop, offsetX - 200 + diagram.element.offsetTop, offsetY - 200 + diagram.element.offsetTop);

            expect(diagram.selectedItems.connectors.length == 1 && diagram.selectedItems.connectors[0].id == 'connector1' &&
                diagram.selectedItems.nodes.length == 1 && diagram.selectedItems.nodes[0].id == 'node1' &&
                diagram.selectedItems.offsetX - offsetX == 400 - offsetX && diagram.selectedItems.offsetY - offsetY == 400 - offsetY).toBe(true); done();
        });

        it('Checking unselected node dragging', (done: Function) => {

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

        it('Checking unselected connector dragging', (done: Function) => {

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

    describe('Connection between nodes and port objects ', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramconnectnodport' });
            document.body.appendChild(ele);

            let nodeport: PointPortModel = { offset: {}, margin: {}, style: {} };
            nodeport.shape = 'Square';
            nodeport.id = 'nodport1';
            nodeport.offset = {
                x: 1, y: 0.5
            };

            let nodeport2: PointPortModel = { offset: {}, margin: {}, style: {} };
            nodeport2.shape = 'Circle';
            nodeport2.id = 'nodport2';
            nodeport2.offset = {
                x: 1, y: 0.5
            };

            let nodeport3: PointPortModel = { offset: {}, margin: {}, style: {} };
            nodeport3.shape = 'Circle';
            nodeport3.id = 'nodport3';
            nodeport3.offset = {
                x: 1, y: 0.5
            };

            let nodes: NodeModel[] = [
                {
                    id: 'node1', width: 100, height: 100, offsetX: 500, offsetY: 100, ports: [nodeport]
                },
                {
                    id: 'node2', width: 100, height: 100, offsetX: 700, offsetY: 300, ports: [nodeport2]
                },
                {
                    id: 'node3', width: 100, height: 100, offsetX: 900, offsetY: 250, ports: [nodeport3]
                }
            ];

            let connectors: ConnectorModel[] = [{
                id: 'connector1',
                type: 'Orthogonal',
                sourcePoint: { x: 100, y: 100 },
                targetPoint: { x: 200, y: 200 },
            },
            {
                id: 'connector2',
                type: 'Orthogonal',
                sourcePoint: { x: 300, y: 300 },
                targetPoint: { x: 400, y: 400 },
            },
            {
                id: 'connector3',
                type: 'Orthogonal',
                sourcePoint: { x: 500, y: 500 },
                targetPoint: { x: 600, y: 600 },
            },
            ];

            diagram = new Diagram({
                width: 1000, height: 550, nodes: nodes, connectors: connectors, snapSettings: { constraints: SnapConstraints.ShowLines }
            });

            diagram.appendTo('#diagramconnectnodport');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });


        it('Checking source end connector to  source node connection', (done: Function) => {

            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 108, 108);

            mouseEvents.dragAndDropEvent(diagramCanvas, 108, 108, 458, 108);
            diagram.clearSelectorLayer();
            expect(diagram.connectors[0].sourceID === 'node1').toBe(true);
            done();

        });

        it('Checking target end connector to target node connection', (done: Function) => {


            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 408, 408);

            mouseEvents.dragAndDropEvent(diagramCanvas, 408, 408, 658, 308);
            diagram.clearSelectorLayer();
            expect(diagram.connectors[1].targetID === 'node2').toBe(true);
            done();

        });

        it('Checking source end connector to source port connection and to source node connection', (done: Function) => {

            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 308, 308);

            let diagramBounds = diagramCanvas.getBoundingClientRect();
            let targetNode = (diagram.nodes[0] as NodeModel);
            let targetPortContainer = diagram.getWrapper(targetNode.wrapper, targetNode.ports[0].id);
            let targetPortBounds = targetPortContainer.bounds.center;
            mouseEvents.dragAndDropEvent(diagramCanvas, 308, 308, (targetPortBounds.x + diagramBounds.left), (targetPortBounds.y + diagramBounds.top));
            diagram.clearSelectorLayer();
            expect(diagram.connectors[1].sourcePortID === 'nodport1').toBe(true);
            mouseEvents.dragAndDropEvent(diagramCanvas, (targetPortBounds.x + diagramBounds.left), (targetPortBounds.y + diagramBounds.top), 475, 150);
            expect(diagram.connectors[1].sourceID === 'node1').toBe(true);
            done();

        });

        it('Checking target end connector to target port connection', (done: Function) => {

            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 208, 208);

            let diagramBounds = diagramCanvas.getBoundingClientRect();
            let targetNode = (diagram.nodes[1] as NodeModel);
            let targetPortContainer = diagram.getWrapper(targetNode.wrapper, targetNode.ports[0].id);
            let targetPortBounds = targetPortContainer.bounds.center;
            mouseEvents.dragAndDropEvent(diagramCanvas, 208, 208, (targetPortBounds.x + diagramBounds.left), (targetPortBounds.y + diagramBounds.top));
            diagram.clearSelectorLayer();
            expect(diagram.connectors[0].targetPortID === 'nodport2').toBe(true);
            done();

        });

        it('Checking removing source end connector to  source node connection', (done: Function) => {

            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 508, 158);

            mouseEvents.dragAndDropEvent(diagramCanvas, 508, 158, 300, 200);
            diagram.clearSelectorLayer();
            expect(diagram.connectors[0].sourceID === '').toBe(true);
            done();

        });


        it('Checking removing target end connector to target node connection', (done: Function) => {


            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 708, 258);

            mouseEvents.dragAndDropEvent(diagramCanvas, 708, 258, 400, 400);
            diagram.clearSelectorLayer();
            expect(diagram.connectors[1].targetID === '').toBe(true);
            done();

        });

        it('Checking removing source end connector to source port connection', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 558, 108);

            mouseEvents.dragAndDropEvent(diagramCanvas, 558, 108, 308, 208);
            diagram.clearSelectorLayer();
            expect(diagram.connectors[1].sourcePortID === '').toBe(true);
            done();

        });

        it('Checking removing target end connector to target port connection', (done: Function) => {

            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 608, 608);

            mouseEvents.dragAndDropEvent(diagramCanvas, 608, 608, 958, 258);
            mouseEvents.dragAndDropEvent(diagramCanvas, 958, 258, 1008, 308);
            diagram.clearSelectorLayer();
            expect(diagram.connectors[2].targetPortID === '').toBe(true);
            done();

        });



    })

    describe('Testing Rotation (50) Resizing', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        let mouseEvents: MouseEvents = new MouseEvents();

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram5' });
            document.body.appendChild(ele);

            let node: NodeModel = { id: 'node1', width: 100, height: 100, offsetX: 300, offsetY: 300 };

            diagram = new Diagram({
                width: 550, height: 550, nodes: [node], snapSettings: { constraints: SnapConstraints.ShowLines }
            });

            diagram.appendTo('#diagram5');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking single node rotation (50) && resizing', (done: Function) => {
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
            expect(diagram.nodes[0].rotateAngle % 360 == 50 || diagram.nodes[0].rotateAngle % 360 == 54).toBe(true);
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

        it('Checking single node rotation (130) && resizing', (done: Function) => {
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

        it('Checking single node rotation (260) && resizing', (done: Function) => {

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

        it('Checking single node resizing - top left', (done: Function) => {

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
            ).toBe(true); done();
        });

        it('Checking single node resizing - top right', (done: Function) => {

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
            ).toBe(true); done();
        });


        it('Checking single node resizing - bottom left', (done: Function) => {

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

        it('Checking single node resizing - bottom right', (done: Function) => {

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

        it('Checking single node resizing - top', (done: Function) => {

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

        it('Checking single node resizing - bottom', (done: Function) => {

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


        it('Checking single node resizing - left', (done: Function) => {

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

        it('Checking single node resizing - right', (done: Function) => {

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
                width: 550, height: 550, nodes: [node, node2],
                connectors: [connector], snapSettings: { constraints: SnapConstraints.ShowLines }
            });

            diagram.appendTo('#diagram10');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking rotation - multiple selection', (done: Function) => {

            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');

            mouseEvents.clickEvent(diagramCanvas, 300, 300, true);

            mouseEvents.clickEvent(diagramCanvas, 300, 500, true);

            mouseEvents.clickEvent(diagramCanvas, 400 + diagram.element.offsetLeft, 400 + diagram.element.offsetTop, true);

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
                width: 550, height: 550, nodes: [node, node2],
                connectors: [{ id: 'connector1', sourcePoint: { x: 400, y: 400 }, targetPoint: { x: 500, y: 500 } }],
                snapSettings: { constraints: SnapConstraints.ShowLines }
            });

            diagram.appendTo('#diagram11');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking resizing - multiple selection', (done: Function) => {

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
            mouseEvents.clickEvent(diagramCanvas, 300, 300);
            expect(diagram.selectedItems.nodes.length === 1).toBe(true);
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

        it('Checking sourcePoint dragging', (done: Function) => {
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
                width: 1000, height: 600,
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

        it('Checking targetPoint dragging', (done: Function) => {
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
                width: '500px', height: '600px', nodes: [node, bpmn],
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

        it('Aborting dragging', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 150, 150);

            mouseEvents.mouseDownEvent(diagramCanvas, 100, 100);
            mouseEvents.mouseMoveEvent(diagramCanvas, 300, 300);
            mouseEvents.mouseLeaveEvent(diagramCanvas);

            expect(diagram.selectedItems.nodes.length == 1 && diagram.selectedItems.nodes[0].offsetX == 100 &&
                diagram.selectedItems.nodes[0].offsetY == 100).toBe(false); done();
        });

        it('Aborting scaling', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            //increasing size
            let topLeft1: PointModel = (diagram.nodes[0] as NodeModel).wrapper.bounds.topLeft;

            mouseEvents.clickEvent(diagramCanvas, 100, 100);

            mouseEvents.mouseDownEvent(diagramCanvas, topLeft1.x, topLeft1.y);
            mouseEvents.mouseMoveEvent(diagramCanvas, topLeft1.x - 10, topLeft1.y - 10);
            mouseEvents.mouseLeaveEvent(diagramCanvas);
            expect(diagram.selectedItems.nodes.length == 1).toBe(false); done();
        });

        it('Aborting rotation', (done: Function) => {
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

        it('Aborting Connector Dragging', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 250, 250);

            mouseEvents.mouseDownEvent(diagramCanvas, 300 + diagram.element.offsetLeft, 300 + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 400 + diagram.element.offsetLeft, 400 + diagram.element.offsetTop);

            mouseEvents.mouseLeaveEvent(diagramCanvas);
            expect(diagram.selectedItems.connectors.length == 1).toBe(false); done();
        });
    });
    describe('Drawing Tools Nodes', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        let mouseEvents: MouseEvents = new MouseEvents();

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramdraw' });
            document.body.appendChild(ele);
            diagram = new Diagram({
                width: '1000px', height: '1000px', snapSettings: { constraints: SnapConstraints.ShowLines }
            });
            diagram.appendTo('#diagramdraw');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Draw basic shape on mouse leave', (done: Function) => {
            diagram.tool = DiagramTools.DrawOnce;
            diagram.drawingObject = { id: 'nodefro', shape: { type: 'Basic', shape: 'Rectangle' } };
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.mouseDownEvent(diagramCanvas, 200, 200);
            mouseEvents.mouseMoveEvent(diagramCanvas, 300, 300);
            mouseEvents.mouseLeaveEvent(diagramCanvas);
            expect(diagram.selectedItems.nodes.length && diagram.selectedItems.nodes[0].id.indexOf('nodefro'));
            expect(diagram.selectedItems.nodes[0].width === 100 && diagram.selectedItems.nodes[0].height === 100).toBe(true);
            mouseEvents.dragAndDropEvent(diagramCanvas, 250, 250, 350, 350, true);
            mouseEvents.dragAndDropEvent(diagramCanvas, 350, 350, 450, 450, true);
            expect(diagram.selectedItems.nodes[0].offsetX === 442 && (Math.round(diagram.selectedItems.nodes[0].offsetY) === 450 || Math.round(diagram.selectedItems.nodes[0].offsetY) === 442)).toBe(true);
            done();
        });

        it('Draw Simple Shape Reverse', (done: Function) => {
            diagram.tool = DiagramTools.DrawOnce
            diagram.drawingObject = { id: 'node1', shape: { type: 'Basic', shape: 'Rectangle' } };
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.dragAndDropEvent(diagramCanvas, 150, 150, 100, 100);
            expect(diagram.selectedItems.nodes.length && diagram.selectedItems.nodes[0].id.indexOf('node1'));
            expect(diagram.selectedItems.nodes[0].width === 50 && diagram.selectedItems.nodes[0].height === 50).toBe(true);
            done();
        });

        it('Draw Basic Shapes - Rectangle', (done: Function) => {
            diagram.tool = DiagramTools.DrawOnce
            diagram.drawingObject = { id: 'node2', shape: { type: 'Basic', shape: 'Rectangle' } };
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.dragAndDropEvent(diagramCanvas, 200, 200, 250, 250);
            expect(diagram.selectedItems.nodes.length && diagram.selectedItems.nodes[0].id.indexOf('node2'));
            expect(diagram.selectedItems.nodes[0].width === 50 && diagram.selectedItems.nodes[0].height === 50).toBe(true);
            done();
        });
        it('Draw Basic Shape - Ellipse', (done: Function) => {
            diagram.tool = DiagramTools.DrawOnce
            diagram.drawingObject = { id: 'node3', shape: { type: 'Basic', shape: 'Ellipse' } };
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.dragAndDropEvent(diagramCanvas, 300, 300, 350, 350);
            expect(diagram.selectedItems.nodes.length && diagram.selectedItems.nodes[0].id.indexOf('node3'));
            expect(diagram.selectedItems.nodes[0].width === 50 && diagram.selectedItems.nodes[0].height === 50).toBe(true);
            done();
        });

        it('Draw Flow Shape - Decision', (done: Function) => {
            diagram.tool = DiagramTools.DrawOnce
            diagram.drawingObject = { id: 'node4', shape: { type: 'Flow', shape: 'Decision' } };
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.dragAndDropEvent(diagramCanvas, 400, 400, 450, 450);
            expect(diagram.selectedItems.nodes.length && diagram.selectedItems.nodes[0].id.indexOf('node4'));
            expect(diagram.selectedItems.nodes[0].width === 50 && diagram.selectedItems.nodes[0].height === 50).toBe(true);
            done();
        });
        it('Draw Flow Shape - Terminator', (done: Function) => {
            diagram.tool = DiagramTools.DrawOnce
            diagram.drawingObject = { id: 'node5', shape: { type: 'Flow', shape: 'Terminator' } };
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.dragAndDropEvent(diagramCanvas, 500, 500, 550, 550);
            expect(diagram.selectedItems.nodes.length && diagram.selectedItems.nodes[0].id.indexOf('node5'));
            expect(diagram.selectedItems.nodes[0].width === 50 && diagram.selectedItems.nodes[0].height === 50).toBe(true);
            done();
        });

        it('Draw Basic Shape - Polygon', (done: Function) => {
            diagram.tool = DiagramTools.DrawOnce
            diagram.drawingObject = { id: 'node2a', shape: { type: 'Basic', shape: 'Polygon' } };
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.mouseDownEvent(diagramCanvas, 150, 150);
            mouseEvents.mouseMoveEvent(diagramCanvas, 250, 400);
            mouseEvents.mouseDownEvent(diagramCanvas, 250, 500);
            mouseEvents.mouseMoveEvent(diagramCanvas, 500, 100);
            mouseEvents.mouseDownEvent(diagramCanvas, 500, 100);
            mouseEvents.dblclickEvent(diagramCanvas, 500, 100);
            let targetNode = (diagram.nodes[3] as NodeModel);
            expect(diagram.selectedItems.nodes.length && diagram.selectedItems.nodes[0].id.indexOf('node2a'));
            expect(diagram.selectedItems.nodes[0].width === 350 &&
                (diagram.selectedItems.nodes[0].shape as BasicShapeModel).points[0].x === 142 &&
                (diagram.selectedItems.nodes[0].shape as BasicShapeModel).points[0].y === 150 &&
                diagram.selectedItems.nodes[0].height === 300).toBe(true);
            diagram.drawingObject = null;
            done();
        });
        it('Draw Basic Shapes - Polygon with points', (done: Function) => {
            diagram.tool = DiagramTools.DrawOnce;
            diagram.drawingObject = {
                id: 'node2b', shape: {
                    type: 'Basic',
                    shape: 'Polygon',
                    points: [{ x: 35, y: 0 }, { x: 65, y: 0 }, { x: 100, y: 35 },
                    { x: 100, y: 65 }, { x: 65, y: 100 }, { x: 35, y: 100 }, { x: 0, y: 65 }, { x: 0, y: 35 }]
                }
            };
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.dragAndDropEvent(diagramCanvas, 200, 200, 250, 250);
            mouseEvents.dblclickEvent(diagramCanvas, 250, 250);
            expect(diagram.selectedItems.nodes.length && diagram.selectedItems.nodes[0].id.indexOf('node2b'));
            expect(diagram.selectedItems.nodes[0].width === 50 && diagram.selectedItems.nodes[0].height === 50).toBe(true);
            diagram.drawingObject = null;
            done();
        });

        it('Draw Basic Shapes - Polygon and scrolling', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            diagram.tool = DiagramTools.DrawOnce;
            diagram.drawingObject = { id: 'node2c', shape: { type: 'Basic', shape: 'Polygon' } };
            mouseEvents.mouseDownEvent(diagramCanvas, 150, 150);
            mouseEvents.mouseMoveEvent(diagramCanvas, 250, 400);
            mouseEvents.mouseDownEvent(diagramCanvas, 250, 500);
            mouseEvents.mouseMoveEvent(diagramCanvas, 500, 100);
            mouseEvents.mouseWheelEvent(diagramCanvas, 500, 850, false);
            mouseEvents.dblclickEvent(diagramCanvas, 500, 850);
            expect(diagram.scroller.horizontalOffset === 0 && diagram.scroller.verticalOffset === -20).toBe(true);
            done();
        });
        it('Draw polygon with mouseleave', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            diagram.tool = DiagramTools.DrawOnce
            diagram.drawingObject = { id: 'node2c2', shape: { type: 'Basic', shape: 'Polygon' } };
            mouseEvents.mouseDownEvent(diagramCanvas, 800, 100);
            mouseEvents.mouseMoveEvent(diagramCanvas, 1000, 100);
            mouseEvents.mouseLeaveEvent(diagramCanvas);
            expect(diagram.selectedItems.width === 200).toBe(true);
            done();
        });
        it('Draw Basic Shapes - Polygon and scrolling', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            diagram.tool = DiagramTools.DrawOnce;
            diagram.drawingObject = { id: 'node2c', shape: { type: 'Basic', shape: 'Polygon' } };
            mouseEvents.mouseDownEvent(diagramCanvas, 150, 150);
            mouseEvents.mouseWheelEvent(diagramCanvas, 150, 850, false);
            mouseEvents.dblclickEvent(diagramCanvas, 500, 850);
            expect(diagram.scroller.horizontalOffset === 0).toBe(true);
            done();
        });

    });
    describe('Drawing Tools Connectors', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        let mouseEvents: MouseEvents = new MouseEvents();

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramdraw' });
            document.body.appendChild(ele);
            let nodeport1: PointPortModel = { offset: { x: 1, y: 0.5 } };
            let nodeport2: PointPortModel = { offset: { x: 0, y: 0.5 } };
            let shape: BasicShapeModel = { type: 'Basic', shape: 'Rectangle' };
            let node1: NodeModel = { id: 'node', offsetX: 100, offsetY: 100, width: 50, height: 50, shape: shape, ports: [nodeport1] };
            let shape2: BasicShapeModel = { type: 'Basic', shape: 'Rectangle' };
            let node2: NodeModel = { id: 'node2', offsetX: 200, offsetY: 100, width: 50, height: 50, shape: shape2, ports: [nodeport2] };
            let node3: NodeModel = { id: 'node3', offsetX: 300, offsetY: 100, width: 50, height: 50, shape: shape2, ports: [nodeport1] };
            let node4: NodeModel = { id: 'node4', offsetX: 400, offsetY: 200, width: 50, height: 50, shape: shape2, ports: [nodeport1] };
            let node5: NodeModel = { id: 'node5', offsetX: 500, offsetY: 200, width: 50, height: 50, shape: shape2 };
            let node6: NodeModel = { id: 'node6', offsetX: 600, offsetY: 300, width: 50, height: 50, shape: shape2 };
            let node7: NodeModel = { id: 'node7', offsetX: 700, offsetY: 300, width: 50, height: 50, shape: shape2, ports: [nodeport2] };
            diagram = new Diagram({
                width: '1000px', height: '1000px', nodes: [node1, node2, node3, node4, node5, node6, node7]
                , snapSettings: { constraints: SnapConstraints.ShowLines }
            });
            diagram.appendTo('#diagramdraw');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Draw Straight Connector on mouseleave', (done: Function) => {
            diagram.tool = DiagramTools.DrawOnce
            diagram.drawingObject = { id: 'connectorleave', type: 'Straight' };
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.mouseDownEvent(diagramCanvas, 200, 200);
            mouseEvents.mouseMoveEvent(diagramCanvas, 300, 300);
            mouseEvents.mouseLeaveEvent(diagramCanvas);
            expect(diagram.selectedItems.connectors.length && diagram.selectedItems.connectors[0].id.indexOf('connectorleave'));
            expect(diagram.selectedItems.connectors[0].wrapper.width === 100 && diagram.selectedItems.connectors[0].wrapper.height === 100).toBe(true);
            done();
        });
        it('Draw Polyline connector', (done: Function) => {
            diagram.tool = DiagramTools.DrawOnce;
            let connectors: ConnectorModel = {
                id: 'connector1', type: 'Polyline',
            };
            diagram.drawingObject = connectors;
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.mouseDownEvent(diagramCanvas, 150, 150);
            mouseEvents.mouseMoveEvent(diagramCanvas, 250, 400);
            mouseEvents.mouseDownEvent(diagramCanvas, 250, 500);
            mouseEvents.mouseMoveEvent(diagramCanvas, 500, 100);
            mouseEvents.mouseDownEvent(diagramCanvas, 500, 100);
            mouseEvents.dblclickEvent(diagramCanvas, 500, 100);
            expect((diagram.selectedItems.connectors as ConnectorModel)[0].segments &&
                (diagram.selectedItems.connectors as ConnectorModel)[0].segments.length !== 0).toBe(true);
            diagram.drawingObject = null;
            done();
        });
        it('Draw Polyline connector on mouseleave', (done: Function) => {
            diagram.tool = DiagramTools.DrawOnce;
            let connectors: ConnectorModel = {
                id: 'connector1', type: 'Polyline',
            };
            diagram.drawingObject = connectors;
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.mouseDownEvent(diagramCanvas, 150, 150);
            mouseEvents.mouseMoveEvent(diagramCanvas, 250, 400);
            mouseEvents.mouseDownEvent(diagramCanvas, 250, 500);
            mouseEvents.mouseMoveEvent(diagramCanvas, 500, 100);
            mouseEvents.mouseDownEvent(diagramCanvas, 500, 100);
            mouseEvents.mouseLeaveEvent(diagramCanvas);
            expect((diagram.selectedItems.connectors as ConnectorModel)[0].segments &&
                (diagram.selectedItems.connectors as ConnectorModel)[0].segments.length !== 0).toBe(true);
            diagram.drawingObject = null;
            done();
        });

        it('Draw Straight Connector Reverse', (done: Function) => {
            diagram.tool = DiagramTools.DrawOnce
            diagram.drawingObject = { id: 'connector1', type: 'Straight' };
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.dragAndDropEvent(diagramCanvas, 350, 350, 250, 250);
            expect(diagram.selectedItems.connectors.length && diagram.selectedItems.connectors[0].id.indexOf('connector1'));
            expect(diagram.selectedItems.connectors[0].wrapper.width === 100 && diagram.selectedItems.connectors[0].wrapper.height === 100).toBe(true);
            done();
        });
        it('Draw Orthogonal Connector Reverse', (done: Function) => {
            diagram.tool = DiagramTools.DrawOnce
            diagram.drawingObject = { id: 'connector2', type: 'Orthogonal' };
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.dragAndDropEvent(diagramCanvas, 500, 500, 400, 400);
            expect(diagram.selectedItems.connectors.length && diagram.selectedItems.connectors[0].id.indexOf('connector2'));
            expect(diagram.selectedItems.connectors[0].wrapper.width === 100 && diagram.selectedItems.connectors[0].wrapper.height === 100).toBe(true);
            done();
        });
        it('Draw Straight Connector', (done: Function) => {
            diagram.tool = DiagramTools.DrawOnce
            diagram.drawingObject = { id: 'connector3', type: 'Straight' };
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.dragAndDropEvent(diagramCanvas, 150, 150, 180, 180);
            expect(diagram.selectedItems.connectors.length && diagram.selectedItems.connectors[0].id.indexOf('connector3'));
            expect(diagram.selectedItems.connectors[0].wrapper.width === 30 && diagram.selectedItems.connectors[0].wrapper.height === 30).toBe(true);
            done();
        });
        it('Draw Orthogonal Connector', (done: Function) => {
            diagram.tool = DiagramTools.DrawOnce
            diagram.drawingObject = { id: 'connector4', type: 'Orthogonal' };
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.dragAndDropEvent(diagramCanvas, 420, 420, 470, 470);
            expect(diagram.selectedItems.connectors.length && diagram.selectedItems.connectors[0].id.indexOf('connector4'));
            expect(diagram.selectedItems.connectors[0].wrapper.width === 50 && diagram.selectedItems.connectors[0].wrapper.height === 50).toBe(true);
            done();
        });
        it('Draw Bezier Connector', (done: Function) => {
            diagram.tool = DiagramTools.DrawOnce
            diagram.drawingObject = { id: 'con5', type: 'Bezier' };
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.dragAndDropEvent(diagramCanvas, 470, 470, 520, 520);
            expect(diagram.selectedItems.connectors.length && diagram.selectedItems.connectors[0].id.indexOf('con5'));
            expect(Math.round(diagram.selectedItems.connectors[0].wrapper.width) === 50 && Math.round(diagram.selectedItems.connectors[0].wrapper.height) === 49).toBe(true);
            done();
        });
        it('Draw node Highlighter', (done: Function) => {
            diagram.tool = DiagramTools.DrawOnce
            diagram.drawingObject = { type: 'Orthogonal' };
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.mouseMoveEvent(diagramCanvas, 100, 100);
            let drawElement: HTMLElement = document.getElementById('diagramdraw_diagramAdorner_svg_highlighter');
            expect(drawElement && drawElement.id === 'diagramdraw_diagramAdorner_svg_highlighter').toBe(true);
            done();
        });
        it('Draw port Highlighter', (done: Function) => {
            diagram.tool = DiagramTools.DrawOnce
            diagram.drawingObject = { type: 'Orthogonal' };
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.mouseMoveEvent(diagramCanvas, 133, 108);
            let drawElement: HTMLElement = document.getElementById('diagramdraw_diagramAdorner_svg_highlighter');
            expect(drawElement && drawElement.id === 'diagramdraw_diagramAdorner_svg_highlighter').toBe(true);
            done();
        });
        it('Connect node as same source and target', (done: Function) => {
            diagram.tool = DiagramTools.DrawOnce
            diagram.drawingObject = { id: 'connect1', type: 'Orthogonal' };
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.dragAndDropEvent(diagramCanvas, 100, 100, 120, 120);
            let connector: ConnectorModel = diagram.selectedItems.connectors[0];
            expect(connector && (connector as Connector).sourceID !== undefined
                && (connector as Connector).targetID !== undefined &&
                (connector as Connector).sourceID !== '' &&
                (connector as Connector).targetID !== '').toBe(true);
            expect(diagram.selectedItems.connectors.length && diagram.selectedItems.connectors[0].id.indexOf('connect1'));
            expect(diagram.selectedItems.connectors[0].wrapper.width === 45 && diagram.selectedItems.connectors[0].wrapper.height === 90).toBe(true);
            done();
        });
        it('Connect port as same source and target', (done: Function) => {
            diagram.tool = DiagramTools.DrawOnce
            diagram.drawingObject = { id: 'connect2', type: 'Orthogonal' };
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let diagramBounds = diagramCanvas.getBoundingClientRect();
            let targetNode: NodeModel = (diagram.nodes[2] as NodeModel);
            let targetPortContainer = diagram.getWrapper(targetNode.wrapper, targetNode.ports[0].id);
            let port = targetPortContainer.bounds;
            mouseEvents.dragAndDropEvent(diagramCanvas, (port.center.x + diagramBounds.left), (port.center.y + diagramBounds.left), (port.center.x + diagramBounds.left + 2), (port.center.y + diagramBounds.left - 2));
            let connector: ConnectorModel = diagram.selectedItems.connectors[0];
            expect(connector && (connector as Connector).sourcePortID !== undefined &&
                (connector as Connector).targetPortID !== undefined &&
                (connector as Connector).sourcePortID !== '' &&
                (connector as Connector).targetPortID !== '').toBe(true);
            expect(diagram.selectedItems.connectors.length && diagram.selectedItems.connectors[0].id.indexOf('connect2'));
            expect(diagram.selectedItems.connectors[0].wrapper.width === 0 && diagram.selectedItems.connectors[0].wrapper.height === 0).toBe(true);
            done();
        });
        it('Connect node to node', (done: Function) => {
            diagram.tool = DiagramTools.DrawOnce
            diagram.drawingObject = { id: 'connect3', type: 'Orthogonal' };
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');

            let diagramBounds = diagramCanvas.getBoundingClientRect();
            let node1 = (diagram.nodes[1] as NodeModel).wrapper.children[0].bounds;
            let node2 = (diagram.nodes[2] as NodeModel).wrapper.children[0].bounds;
            mouseEvents.mouseDownEvent(diagramCanvas, (node1.topCenter.x + diagramBounds.left), (node1.topCenter.y + diagramBounds.top));
            mouseEvents.mouseMoveEvent(diagramCanvas, (node1.topCenter.x + 20 + diagramBounds.left), (node1.topCenter.y + 20 + diagramBounds.top));
            mouseEvents.mouseMoveEvent(diagramCanvas, (node2.center.x + diagramBounds.left), (node1.center.y + diagramBounds.top));
            mouseEvents.mouseUpEvent(diagramCanvas, (node2.center.x + diagramBounds.left), (node1.center.y + diagramBounds.top));
            let connector: ConnectorModel = diagram.selectedItems.connectors[0];
            expect(connector && (connector as Connector).sourceID !== undefined &&
                (connector as Connector).targetID !== undefined &&
                (connector as Connector).sourceID !== '' &&
                (connector as Connector).targetID !== '').toBe(true);
            expect(diagram.selectedItems.connectors.length && diagram.selectedItems.connectors[0].id.indexOf('connect3'));
            expect(diagram.selectedItems.connectors[0].wrapper.width === 50 && diagram.selectedItems.connectors[0].wrapper.height === 0).toBe(true);
            done();
        });

        it('Connect port to port', (done: Function) => {
            diagram.tool = DiagramTools.DrawOnce
            diagram.drawingObject = { id: 'connect4', type: 'Orthogonal' };
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');

            let diagramBounds = diagramCanvas.getBoundingClientRect();
            let targetNode1: NodeModel = (diagram.nodes[0] as NodeModel);
            let targetNode2: NodeModel = (diagram.nodes[1] as NodeModel);
            let targetPortContainer1 = diagram.getWrapper(targetNode1.wrapper, targetNode1.ports[0].id);
            let targetPortContainer2 = diagram.getWrapper(targetNode2.wrapper, targetNode2.ports[0].id);
            let port1Bounds = targetPortContainer1.bounds;
            let port2Bounds = targetPortContainer2.bounds;
            mouseEvents.mouseDownEvent(diagramCanvas, (diagramBounds.left + port1Bounds.center.x), (port1Bounds.center.y - diagramBounds.top));
            mouseEvents.mouseMoveEvent(diagramCanvas, (diagramBounds.left + port1Bounds.center.x + 2), (port1Bounds.center.y - diagramBounds.top) + 2);
            mouseEvents.mouseMoveEvent(diagramCanvas, (port2Bounds.center.x + diagramBounds.left + 2), (port1Bounds.center.y - diagramBounds.top) + 2);
            mouseEvents.mouseUpEvent(diagramCanvas, (port2Bounds.center.x + diagramBounds.left + 2), (port1Bounds.center.y - diagramBounds.top) + 2);
            let connector: ConnectorModel = diagram.selectedItems.connectors[0];
            expect(connector && (connector as Connector).sourcePortID !== undefined &&
                (connector as Connector).targetPortID !== undefined &&
                (connector as Connector).sourcePortID !== '' &&
                (connector as Connector).targetPortID !== '').toBe(true);
            expect(diagram.selectedItems.connectors.length && diagram.selectedItems.connectors[0].id.indexOf('connect4'));
            expect(diagram.selectedItems.connectors[0].wrapper.width === 50 && diagram.selectedItems.connectors[0].wrapper.height === 0).toBe(true);
            done();
        });

        it('Connect port to node', (done: Function) => {
            diagram.tool = DiagramTools.DrawOnce
            diagram.drawingObject = { id: 'connect5', type: 'Orthogonal' };
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');

            let diagramBounds = diagramCanvas.getBoundingClientRect();
            let targetNode = (diagram.nodes[3] as NodeModel);
            let targetPortContainer = diagram.getWrapper(targetNode.wrapper, targetNode.ports[0].id);
            let portBounds = targetPortContainer.bounds.center;
            let nodeBounds = (diagram.nodes[4] as NodeModel).wrapper.children[0].bounds.center;
            mouseEvents.mouseDownEvent(diagramCanvas, (portBounds.x + diagramBounds.left), (portBounds.y + diagramBounds.top));
            mouseEvents.mouseMoveEvent(diagramCanvas, (portBounds.x + diagramBounds.left + 2), (portBounds.y + diagramBounds.top + 2));
            mouseEvents.mouseMoveEvent(diagramCanvas, (portBounds.x + diagramBounds.left + 22), (portBounds.y + diagramBounds.top + 20));
            mouseEvents.mouseMoveEvent(diagramCanvas, (nodeBounds.x + diagramBounds.left), (nodeBounds.y + diagramBounds.top));
            mouseEvents.mouseUpEvent(diagramCanvas, (nodeBounds.x + diagramBounds.left), (nodeBounds.y + diagramBounds.top));
            let connector: ConnectorModel = diagram.selectedItems.connectors[0];
            expect(connector && (connector as Connector).sourcePortID !== undefined &&
                (connector as Connector).targetID !== undefined &&
                (connector as Connector).sourcePortID !== '' &&
                (connector as Connector).targetID !== '').toBe(true);
            expect(diagram.selectedItems.connectors.length && diagram.selectedItems.connectors[0].id.indexOf('connect5'));
            expect(diagram.selectedItems.connectors[0].wrapper.width === 50 && diagram.selectedItems.connectors[0].wrapper.height === 0).toBe(true);
            done();
        });

        it('Connect node to port', (done: Function) => {
            diagram.tool = DiagramTools.DrawOnce
            diagram.drawingObject = { id: 'connect6', type: 'Orthogonal' };
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');

            let diagramBounds = diagramCanvas.getBoundingClientRect();
            let node = (diagram.nodes[5] as NodeModel).wrapper.children[0].bounds.center;
            let node2 = (diagram.nodes[6] as NodeModel);
            let targetPortContainer = diagram.getWrapper(node2.wrapper, node2.ports[0].id);
            let port = targetPortContainer.bounds.center;
            mouseEvents.mouseDownEvent(diagramCanvas, (node.x + diagramBounds.left), (node.y + diagramBounds.top));
            mouseEvents.mouseMoveEvent(diagramCanvas, (node.x + diagramBounds.left + 20), (node.y + diagramBounds.top + 20));
            mouseEvents.mouseMoveEvent(diagramCanvas, (node.x + diagramBounds.left + 50), (node.y + diagramBounds.top));
            mouseEvents.mouseMoveEvent(diagramCanvas, (port.x + diagramBounds.left + 2), (port.y + diagramBounds.top));
            mouseEvents.mouseUpEvent(diagramCanvas, (port.x + diagramBounds.left + 2), (port.y + diagramBounds.top));
            let connector: ConnectorModel = diagram.selectedItems.connectors[0];
            expect(connector && (connector as Connector).sourceID !== undefined &&
                (connector as Connector).targetPortID !== undefined &&
                (connector as Connector).sourceID !== '' &&
                (connector as Connector).targetPortID !== '').toBe(true);
            expect(diagram.selectedItems.connectors.length && diagram.selectedItems.connectors[0].id.indexOf('connect6'));
            expect(diagram.selectedItems.connectors[0].wrapper.width === 50 && diagram.selectedItems.connectors[0].wrapper.height === 0).toBe(true);
            done();
        });

        it('Draw Basic Shapes - Polygon and scrolling', (done: Function) => {
            diagram.tool = DiagramTools.DrawOnce;
            let connectors: ConnectorModel = {
                id: 'connector1', type: 'Polyline',
            };
            diagram.drawingObject = connectors;
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.mouseDownEvent(diagramCanvas, 150, 150);
            mouseEvents.mouseMoveEvent(diagramCanvas, 250, 400);
            mouseEvents.mouseDownEvent(diagramCanvas, 250, 500);
            mouseEvents.mouseMoveEvent(diagramCanvas, 500, 100);
            mouseEvents.mouseWheelEvent(diagramCanvas, 500, 850, false);
            mouseEvents.dblclickEvent(diagramCanvas, 500, 850);
            expect(diagram.scroller.horizontalOffset === 0 && diagram.scroller.verticalOffset === -20).toBe(true);
            done();
        });

    });
    describe('CodeCoverage Drawing Tool', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        let mouseEvents: MouseEvents = new MouseEvents();

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramdraw' });
            document.body.appendChild(ele);
            diagram = new Diagram({
                width: '1000px', height: '1000px', snapSettings: { constraints: SnapConstraints.ShowLines }
            });
            diagram.appendTo('#diagramdraw');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Draw Simple  Node', (done: Function) => {
            diagram.tool = DiagramTools.DrawOnce
            diagram.drawingObject = { style: { fill: 'blue' }, shape: { type: 'Basic', shape: 'Rectangle' } };
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.dragAndDropEvent(diagramCanvas, 100, 100, 150, 150);
            done();
        });

        it('Draw Simple Connector', (done: Function) => {
            diagram.tool = DiagramTools.DrawOnce
            diagram.drawingObject = { style: { fill: 'red' }, type: 'Straight' };
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.dragAndDropEvent(diagramCanvas, 250, 250, 350, 350);
            done();
        });
    });

    describe('Text Drawing Tool', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        let mouseEvents: MouseEvents = new MouseEvents();

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramTextDrawingTool' });
            document.body.appendChild(ele);
            diagram = new Diagram({
                width: '1000px', height: '1000px', snapSettings: { constraints: SnapConstraints.ShowLines }
            });
            diagram.appendTo('#diagramTextDrawingTool');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Draw Simple Text', (done: Function) => {

            diagram.tool = DiagramTools.DrawOnce
            expect(diagram.nodes.length == 0).toBe(true);
            let node: NodeModel = {
                shape: { type: 'Text' }, style: { strokeColor: 'none', fill: 'none', color: 'blue' }
            };
            diagram.drawingObject = node;
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.dragAndDropEvent(diagramCanvas, 100, 100, 150, 150);
            (document.getElementById(diagram.element.id + '_editBox') as HTMLTextAreaElement).value = 'editText1';
            mouseEvents.keyDownEvent(diagramCanvas, 'Escape');
            expect(diagram.nodes.length == 1).toBe(true);
            done();
        });


        it('Draw Simple Text without text content', (done: Function) => {

            diagram.tool = DiagramTools.DrawOnce
            expect(diagram.nodes.length == 1).toBe(true);
            let node: NodeModel = {
                shape: { type: 'Text' }, style: { strokeColor: 'none', fill: 'none', color: 'blue' }
            };
            diagram.drawingObject = node;
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.dragAndDropEvent(diagramCanvas, 100, 100, 150, 150);
            // (document.getElementById(diagram.element.id + '_editBox') as HTMLTextAreaElement).value = 'editText1';
            mouseEvents.keyDownEvent(diagramCanvas, 'Escape');
            expect(diagram.nodes.length == 1).toBe(true);
            done();
        });

        it('Draw Simple Text - change the textcontent in the existing node', (done: Function) => {

            let nodeNew: NodeModel = {
                id: 'node4', width: 90, height: 90, offsetX: 100, offsetY: 300,
                shape: { type: 'Basic', shape: 'Rectangle', cornerRadius: 10 },
                annotations: [{ id: 'text1', content: 'Click', offset: { x: 0.1, y: 0.1 } }, { id: 'text2', content: 'outside', offset: { x: 0.5, y: 0.5 } }, { id: 'text3', content: 'the node', offset: { x: 0.8, y: 0.9 } }],
            };
            diagram.add(nodeNew);
            diagram.tool = DiagramTools.DrawOnce
            expect(diagram.nodes.length == 2).toBe(true);
            let node: NodeModel = {
                shape: { type: 'Text' }
            };
            diagram.drawingObject = node;
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 100, 300);

            expect((document.getElementById(diagram.element.id + '_editBox') as HTMLTextAreaElement).value == 'outside').toBe(true);
            (document.getElementById(diagram.element.id + '_editBox') as HTMLTextAreaElement).value = 'NewNodeText';
            mouseEvents.keyDownEvent(diagramCanvas, 'Escape');
            expect(diagram.nodes.length == 2 && (diagram.nodes[1] as NodeModel).annotations[1].content == 'NewNodeText').toBe(true);
            done();
        });
        it('Draw Simple Text - change the textcontent', (done: Function) => {

            diagram.tool = DiagramTools.DrawOnce
            expect(diagram.nodes.length == 2).toBe(true);
            let node: NodeModel = {
                shape: { type: 'Text' }, style: { strokeColor: 'none', fill: 'none', color: 'blue' }
            };
            diagram.drawingObject = node;
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.dragAndDropEvent(diagramCanvas, 200, 200, 250, 250);
            let textBox = document.getElementById(diagram.element.id + '_editBox')
            mouseEvents.inputEvent(textBox);
            mouseEvents.keyDownEvent(textBox, 'l');
            mouseEvents.keyDownEvent(textBox, 'a');
            mouseEvents.keyDownEvent(textBox, 'b');
            mouseEvents.keyDownEvent(textBox, 'e');
            mouseEvents.keyDownEvent(textBox, 'l');
            (document.getElementById(diagram.element.id + '_editBox') as HTMLTextAreaElement).value = 'label';
            mouseEvents.keyDownEvent(diagramCanvas, 'Escape');
            expect(diagram.nodes.length == 3).toBe(true);
            done();
        });
        it('Draw Simple Text on Mouse Leave', (done: Function) => {
            diagram.tool = DiagramTools.DrawOnce
            expect(diagram.nodes.length == 3).toBe(true);
            let node: NodeModel = {
                shape: { type: 'Text' }, style: { strokeColor: 'none', fill: 'none', color: 'blue' }
            };
            diagram.drawingObject = node;
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.dragAndDropEvent(diagramCanvas, 300, 300, 350, 350);
            let text: HTMLTextAreaElement = document.getElementById(diagram.element.id + '_editBox') as HTMLTextAreaElement;
            text.value = 'kkk';
            mouseEvents.mouseLeaveEvent(diagramCanvas);
            mouseEvents.focusOutEdit(text);
            expect(diagram.nodes.length == 4).toBe(true);
            done();
        });

    });

    describe('Nudge testing and Shapes on the BPMN connector', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        let mouseEvents: MouseEvents = new MouseEvents();

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramnudge' });
            document.body.appendChild(ele);
            let selArray: (NodeModel | ConnectorModel)[] = [];
            let node: NodeModel = { id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100 };
            let node2: NodeModel = {
                id: 'node5', width: 75, height: 70, offsetX: 630, offsetY: 90,
                shape: { type: 'Bpmn', shape: 'Gateway', gateway: { type: 'None' } }, annotations: [{
                    id: 'label5', content: 'Validate',
                    style: { strokeColor: 'transparent' }
                }]
            };
            let node3: NodeModel = {
                id: 'node6', width: 60, height: 60, offsetX: 745, offsetY: 90,
                shape: {
                    type: 'Bpmn', shape: 'Event',
                    event: { event: 'End', trigger: 'Message' }
                },
            };
            let connector: ConnectorModel = {
                id: 'connector5', type: 'Straight', sourceID: 'node5', targetID: 'node6',
                annotations: [{
                    id: 'label7', content: 'Invalid', offset: 0.5, alignment: 'After', margin: { top: 5 },
                    style: { strokeColor: 'transparent' }
                }],
                shape: { type: 'Bpmn', flow: 'Message', message: 'InitiatingMessage' } as BpmnFlowModel
            };


            diagram = new Diagram({
                width: '1000', height: '1000', nodes: [node, node2, node3], connectors: [connector],
                snapSettings: { constraints: SnapConstraints.ShowLines }
            });

            diagram.appendTo('#diagramnudge');

        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Nudge', (done: Function) => {
            expect(diagram.connectors[0].sourceDecorator.style.fill === 'black' &&
                diagram.connectors[0].targetDecorator.style.fill === 'black').toBe(true);
            done();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 150, 150);
            diagram.nudge('Right');
            expect(diagram.selectedItems.nodes[0].offsetX === 101).toBe(true);
            diagram.nudge('Down');
            expect(diagram.selectedItems.nodes[0].offsetY === 101).toBe(true);
            diagram.nudge('Up');
            expect(diagram.selectedItems.nodes[0].offsetY === 100).toBe(true);
            diagram.nudge('Left');
            expect(diagram.selectedItems.nodes[0].offsetX === 100).toBe(true);
            done();
        });
        it('Checking Shapes on the BPMN connector', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let bpmnshape = diagram.connectors[0].wrapper.children[3];
            expect(bpmnshape.offsetX == 691.42 && bpmnshape.offsetY == 90).toBe(true);
            mouseEvents.dragAndDropEvent(diagramCanvas, 745, 90, 800, 150);
            bpmnshape = diagram.connectors[0].wrapper.children[3];
            expect((bpmnshape.offsetX == 714.62 || bpmnshape.offsetX == 714.5) && (bpmnshape.offsetY == 119.87 || bpmnshape.offsetY == 120)).toBe(true);
            done();
        });
    });


    describe('Nudge with values testing', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        let mouseEvents: MouseEvents = new MouseEvents();

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramnudge' });
            document.body.appendChild(ele);
            let selArray: (NodeModel | ConnectorModel)[] = [];
            let node: NodeModel = { id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100 };



            diagram = new Diagram({
                width: 550, height: 550, nodes: [node], snapSettings: { constraints: SnapConstraints.ShowLines }

            });

            diagram.appendTo('#diagramnudge');

        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Nudge', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 150, 150);
            diagram.nudge('Right', 5, 5);
            expect(diagram.selectedItems.nodes[0].offsetX === 105).toBe(true);
            diagram.nudge('Down', 5, 5);
            expect(diagram.selectedItems.nodes[0].offsetY === 105).toBe(true);
            diagram.nudge('Up', 5, 5);
            expect(diagram.selectedItems.nodes[0].offsetY === 100).toBe(true);
            diagram.nudge('Left', 5, 5);
            expect(diagram.selectedItems.nodes[0].offsetX === 100).toBe(true);
            done();
        })
    });
    describe('ContextMenu', () => {
        let node1: NodeModel = {
            id: 'NewIdea', width: 100, height: 100, offsetX: 300, offsetY: 60,
            shape: { type: 'Flow', shape: 'Terminator' },
            annotations: [{
                id: 'label1', content: 'New idea identified', offset: { x: 0.5, y: 0.5 }
            }]
        };

        let node2: NodeModel = {
            id: 'Meeting', width: 150, height: 60, offsetX: 300, offsetY: 155,
            shape: { type: 'Flow', shape: 'Process' },
            annotations: [{
                id: 'label2', content: 'Meeting with board', offset: { x: 0.5, y: 0.5 }

            }]
        };
        let node3: NodeModel = {
            id: 'BoardDecision', width: 150, height: 110, offsetX: 300, offsetY: 280,
            shape: { type: 'Flow', shape: 'Decision' },
            annotations: [{
                id: 'label3', content: 'Board decides whether to proceed', offset: { x: 0.5, y: 0.5 },
                margin: { left: 25, right: 25 },
                style: { whiteSpace: 'PreserveAll' }
            }]
        };
        let node4: NodeModel = {
            id: 'Project', width: 150, height: 100, offsetX: 300, offsetY: 430,
            shape: { type: 'Flow', shape: 'Decision' },
            annotations: [{
                id: 'label4', content: 'Find Project manager', offset: { x: 0.5, y: 0.5 },

            }]
        };
        let node5: NodeModel = {
            id: 'End', width: 150, height: 60, offsetX: 300, offsetY: 555,
            shape: { type: 'Flow', shape: 'Process' },
            annotations: [{
                id: 'label5', content: 'Implement and Deliver', offset: { x: 0.5, y: 0.5 },

            }]
        };
        let node6: NodeModel = {
            id: 'Decision', width: 250, height: 60, offsetX: 550, offsetY: 60,
            shape: { type: 'Flow', shape: 'Card' },
            annotations: [{
                id: 'label6', content: 'Decision Process for new software ideas', offset: { x: 0.5, y: 0.5 },
                style: { whiteSpace: 'PreserveAll' } as TextStyleModel
            }]
        };
        let node7: NodeModel = {
            id: 'Reject', width: 150, height: 60, offsetX: 550, offsetY: 280,
            shape: { type: 'Flow', shape: 'Process' },
            annotations: [{
                id: 'label7', content: 'Reject and write report', offset: { x: 0.5, y: 0.5 },

            }]
        };
        let node8: NodeModel = {
            id: 'Resources', width: 150, height: 60, offsetX: 550, offsetY: 430,
            shape: { type: 'Flow', shape: 'Process' },
            annotations: [{
                id: 'label8', content: 'Hire new resources', offset: { x: 0.5, y: 0.5 },

            }]
        };

        let connector1: ConnectorModel = {
            id: 'connector1', type: 'Straight', sourceID: 'NewIdea', targetID: 'Meeting'
        };
        let connector2: ConnectorModel = {
            id: 'connector2', type: 'Straight', sourceID: 'Meeting', targetID: 'BoardDecision'
        };
        let connector3: ConnectorModel = {
            id: 'connector3', type: 'Straight', sourceID: 'BoardDecision', targetID: 'Project'
        };
        let connector4: ConnectorModel = {
            id: 'connector4', type: 'Straight', sourceID: 'Project', targetID: 'End'
        };
        let connector5: ConnectorModel = {
            id: 'connector5', type: 'Straight', sourceID: 'BoardDecision', targetID: 'Reject'
        };
        let connector6: ConnectorModel = {
            id: 'connector6', type: 'Straight', sourceID: 'Project', targetID: 'Resources'
        };

        describe('context menu', () => {
            let diagram: Diagram;
            let ele: HTMLElement;

            let mouseEvents: MouseEvents = new MouseEvents();

            beforeAll((): void => {
                ele = createElement('div', { id: 'diagramdraw' });
                document.body.appendChild(ele);
                diagram = new Diagram({
                    width: '1000px', height: '1000px',
                    nodes: [node1, node2, node3, node4, node5, node6, node7, node8],
                    connectors: [connector1, connector2, connector3, connector4, connector5, connector6],
                    contextMenuSettings: { show: true }, snapSettings: { constraints: SnapConstraints.ShowLines }
                });
                diagram.appendTo('#diagramdraw');
            });

            it('Render Context Menu', (done: Function) => {
                expect((diagram.contextMenuModule as any).element).not.toBe(null);
                expect((diagram.contextMenuModule as any).element.id).toBe(diagram.element.id + '_contextMenu');
                expect(diagram.contextMenuModule.contextMenu.enableRtl).toBe(diagram.enableRtl);
                expect(diagram.contextMenuModule.contextMenu.locale).toBe(diagram.locale);
                expect(diagram.contextMenuModule.contextMenu.enablePersistence).toBe(diagram.enablePersistence);
                expect(diagram.contextMenuModule.contextMenu.target).toBe('#' + diagram.element.id);
                expect(diagram.contextMenuModule.contextMenu.cssClass).toBe('e-diagram-menu');
                expect(diagram.contextMenuModule.contextMenu.items.length).toBe(8);
                expect((diagram.contextMenuModule as any).getModuleName()).toBe('contextMenu');
                done();
            });

            it('Context menu Before Open,Open,and Close', (done: Function) => {
                let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
                mouseEvents.clickEvent(diagramCanvas, 350, 110);
                (diagram.contextMenuModule as any).eventArgs = { target: document.getElementById('NewIdea') };
                let e = {
                    event: (diagram.contextMenuModule as any).eventArgs,
                    items: diagram.contextMenuModule.contextMenu.items,
                };
                (diagram.contextMenuModule as any).contextMenuBeforeOpen(e);
                expect((diagram.contextMenuModule as any).getModuleName()).toBe('contextMenu');
                expect((diagram.contextMenuModule as any).hiddenItems.length).toBe(6);
                (diagram.contextMenuModule as any).contextMenuOpen();
                (diagram.contextMenuModule as any).contextMenuOnClose(e);
                diagram.clearSelection();
                done();
            });

            it('Context menu Item Click - Cut and Paste', (done: Function) => {
                let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
                mouseEvents.clickEvent(diagramCanvas, 350, 110);
                (diagram.contextMenuModule as any).eventArgs = { target: document.getElementById('diagramdraw_diagramAdorner_svg') };
                let e = {
                    event: (diagram.contextMenuModule as any).eventArgs,
                    items: diagram.contextMenuModule.contextMenu.items as MenuItemModel[],
                };
                for (let i of e.items) {
                    if (i.id ===
                        diagram.contextMenuModule.contextMenu.element.id + '_' + 'cut') {
                        (diagram.contextMenuModule as any).contextMenuBeforeOpen(e);
                        (diagram.contextMenuModule as any).contextMenuOpen();
                        (diagram.contextMenuModule as any).contextMenuItemClick({ item: i });
                        (diagram.contextMenuModule as any).contextMenuOnClose(e);
                        break;
                    }
                }
                expect(diagram.selectedItems.nodes.length == 0).toBe(true);
                for (let i of e.items) {
                    if (i.id ===
                        diagram.contextMenuModule.contextMenu.element.id + '_' + 'paste') {
                        (diagram.contextMenuModule as any).contextMenuBeforeOpen(e);
                        (diagram.contextMenuModule as any).contextMenuOpen();
                        (diagram.contextMenuModule as any).contextMenuItemClick({ item: i });
                        (diagram.contextMenuModule as any).contextMenuOnClose(e);
                        break;
                    }
                }
                expect(diagram.selectedItems.nodes.length == 1).toBe(true);
                diagram.clearSelection();
                done();
            });

            it('Context menu Item Click - Copy and Paste', (done: Function) => {
                let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
                mouseEvents.clickEvent(diagramCanvas, 350, 110);
                (diagram.contextMenuModule as any).eventArgs = { target: document.getElementById('diagramdraw_diagramAdorner_svg') };
                let e = {
                    event: (diagram.contextMenuModule as any).eventArgs,
                    items: diagram.contextMenuModule.contextMenu.items as MenuItemModel[],
                };
                for (let i of e.items) {
                    if (i.id ===
                        diagram.contextMenuModule.contextMenu.element.id + '_' + 'copy') {
                        (diagram.contextMenuModule as any).contextMenuBeforeOpen(e);
                        (diagram.contextMenuModule as any).contextMenuOpen();
                        (diagram.contextMenuModule as any).contextMenuItemClick({ item: i });
                        (diagram.contextMenuModule as any).contextMenuOnClose(e);
                        break;
                    }
                }
                expect(diagram.nodes.length == 8).toBe(true);
                for (let i of e.items) {
                    if (i.id ===
                        diagram.contextMenuModule.contextMenu.element.id + '_' + 'paste') {
                        (diagram.contextMenuModule as any).contextMenuBeforeOpen(e);
                        (diagram.contextMenuModule as any).contextMenuOpen();
                        (diagram.contextMenuModule as any).contextMenuItemClick({ item: i });
                        (diagram.contextMenuModule as any).contextMenuOnClose(e);
                        break;
                    }
                }
                expect(diagram.nodes.length == 9).toBe(true);
                done();
            });

            it('Context menu Item Click - Undo and Redo and selectAll', (done: Function) => {
                (diagram.contextMenuModule as any).eventArgs = { target: document.getElementById('diagramdraw_diagramAdorner_svg') };
                let e = {
                    event: (diagram.contextMenuModule as any).eventArgs,
                    items: diagram.contextMenuModule.contextMenu.items as MenuItemModel[],
                };

                for (let i of e.items) {
                    if (i.id ===
                        diagram.contextMenuModule.contextMenu.element.id + '_' + 'undo') {
                        (diagram.contextMenuModule as any).contextMenuBeforeOpen(e);
                        (diagram.contextMenuModule as any).contextMenuOpen();
                        (diagram.contextMenuModule as any).contextMenuItemClick({ item: i });
                        (diagram.contextMenuModule as any).contextMenuOnClose(e);
                        break;
                    }
                }
                expect(diagram.nodes.length == 8).toBe(true);
                for (let i of e.items) {
                    if (i.id ===
                        diagram.contextMenuModule.contextMenu.element.id + '_' + 'redo') {
                        (diagram.contextMenuModule as any).contextMenuBeforeOpen(e);
                        (diagram.contextMenuModule as any).contextMenuOpen();
                        (diagram.contextMenuModule as any).contextMenuItemClick({ item: i });
                        (diagram.contextMenuModule as any).contextMenuOnClose(e);
                        break;
                    }
                }
                expect(diagram.nodes.length == 9).toBe(true);
                diagram.clearSelection();
                for (let i of e.items) {
                    if (i.id ===
                        diagram.contextMenuModule.contextMenu.element.id + '_' + 'selectAll') {
                        (diagram.contextMenuModule as any).contextMenuBeforeOpen(e);
                        (diagram.contextMenuModule as any).contextMenuOpen();
                        (diagram.contextMenuModule as any).contextMenuItemClick({ item: i });
                        (diagram.contextMenuModule as any).contextMenuOnClose(e);
                        break;
                    }
                }
                expect(diagram.selectedItems.nodes.length + diagram.selectedItems.connectors.length === 14).toBe(true);
                let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
                mouseEvents.keyDownEvent(diagramCanvas, 'Delete');
                expect(diagram.selectedItems.nodes.length + diagram.selectedItems.connectors.length === 0).toBe(true);
                diagram.undo();
                done();
            });


            it('Context menu - order commands', (done: Function) => {
                (diagram.contextMenuModule as any).eventArgs = { target: document.getElementById('diagramdraw_diagramAdorner_svg') };
                let e = {
                    event: (diagram.contextMenuModule as any).eventArgs,
                    items: (diagram.contextMenuModule.contextMenu.items[7] as MenuItemModel).items,
                };
                diagram.select([diagram.nodes[0]]);
                for (let i of e.items) {
                    if (i.id ===
                        diagram.contextMenuModule.contextMenu.element.id + '_' + 'moveForwardOrder') {
                        (diagram.contextMenuModule as any).contextMenuBeforeOpen(e);
                        (diagram.contextMenuModule as any).contextMenuOpen();
                        (diagram.contextMenuModule as any).contextMenuItemClick({ item: i });
                        (diagram.contextMenuModule as any).contextMenuOnClose(e);
                        break;
                    }
                }

                for (let i of e.items) {
                    if (i.id ===
                        diagram.contextMenuModule.contextMenu.element.id + '_' + 'bringToFrontOrder') {
                        (diagram.contextMenuModule as any).contextMenuBeforeOpen(e);
                        (diagram.contextMenuModule as any).contextMenuOpen();
                        (diagram.contextMenuModule as any).contextMenuItemClick({ item: i });
                        (diagram.contextMenuModule as any).contextMenuOnClose(e);
                        break;
                    }
                }

                for (let i of e.items) {
                    if (i.id ===
                        diagram.contextMenuModule.contextMenu.element.id + '_' + 'sendBackwardOrder') {
                        (diagram.contextMenuModule as any).contextMenuBeforeOpen(e);
                        (diagram.contextMenuModule as any).contextMenuOpen();
                        (diagram.contextMenuModule as any).contextMenuItemClick({ item: i });
                        (diagram.contextMenuModule as any).contextMenuOnClose(e);
                        break;
                    }
                }

                for (let i of e.items) {
                    if (i.id ===
                        diagram.contextMenuModule.contextMenu.element.id + '_' + 'sendToBackOrder') {
                        (diagram.contextMenuModule as any).contextMenuBeforeOpen(e);
                        (diagram.contextMenuModule as any).contextMenuOpen();
                        (diagram.contextMenuModule as any).contextMenuItemClick({ item: i });
                        (diagram.contextMenuModule as any).contextMenuOnClose(e);
                        break;
                    }
                }
                done();
            });

            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });
        });
        describe('custom context menu and default menu', () => {
            let diagram: Diagram;
            let ele: HTMLElement;

            let mouseEvents: MouseEvents = new MouseEvents();

            beforeAll((): void => {
                ele = createElement('div', { id: 'diagramdraw' });
                document.body.appendChild(ele);
                diagram = new Diagram({
                    width: '1000px', height: '1000px',
                    nodes: [node1, node2, node3, node4, node5, node6, node7, node8],
                    connectors: [connector1, connector2, connector3, connector4, connector5, connector6],
                    contextMenuSettings: {
                        show: true, items: [{ text: 'Copy with headers', target: '.e-content', id: 'copywithheader' }],

                    }
                });
                diagram.appendTo('#diagramdraw');
            });

            it('Render Context Menu', (done: Function) => {
                expect((diagram.contextMenuModule as any).element).not.toBe(null);
                expect((diagram.contextMenuModule as any).element.id).toBe(diagram.element.id + '_contextMenu');
                expect(diagram.contextMenuModule.contextMenu.enableRtl).toBe(diagram.enableRtl);
                expect(diagram.contextMenuModule.contextMenu.locale).toBe(diagram.locale);
                expect(diagram.contextMenuModule.contextMenu.enablePersistence).toBe(diagram.enablePersistence);
                expect(diagram.contextMenuModule.contextMenu.target).toBe('#' + diagram.element.id);
                expect(diagram.contextMenuModule.contextMenu.cssClass).toBe('e-diagram-menu');
                expect(diagram.contextMenuModule.contextMenu.items.length).toBe(9);
                expect((diagram.contextMenuModule as any).getModuleName()).toBe('contextMenu');
                done();
            });

            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });
        });
        describe('custom context menu only', () => {
            let diagram: Diagram;
            let ele: HTMLElement;

            let mouseEvents: MouseEvents = new MouseEvents();

            beforeAll((): void => {
                ele = createElement('div', { id: 'diagramdraw' });
                document.body.appendChild(ele);
                diagram = new Diagram({
                    width: '1000px', height: '1000px',
                    nodes: [node1, node2, node3, node4, node5, node6, node7, node8],
                    connectors: [connector1, connector2, connector3, connector4, connector5, connector6],

                    contextMenuSettings: {
                        show: true, items: [{ text: 'Copy with headers', target: '.e-content', id: 'copywithheader' },
                        ], showCustomMenuOnly: true
                    }
                });
                diagram.appendTo('#diagramdraw');
            });

            it('Render custom Context Menu only', (done: Function) => {
                expect((diagram.contextMenuModule as any).element).not.toBe(null);
                expect((diagram.contextMenuModule as any).element.id).toBe(diagram.element.id + '_contextMenu');
                expect(diagram.contextMenuModule.contextMenu.enableRtl).toBe(diagram.enableRtl);
                expect(diagram.contextMenuModule.contextMenu.locale).toBe(diagram.locale);
                expect(diagram.contextMenuModule.contextMenu.enablePersistence).toBe(diagram.enablePersistence);
                expect(diagram.contextMenuModule.contextMenu.target).toBe('#' + diagram.element.id);
                expect(diagram.contextMenuModule.contextMenu.cssClass).toBe('e-diagram-menu');
                expect(diagram.contextMenuModule.contextMenu.items.length).toBe(1);
                expect((diagram.contextMenuModule as any).getModuleName()).toBe('contextMenu');
                done();
            });

            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });
        });

        describe('custom context menu with 0 items', () => {
            let diagram: Diagram;
            let ele: HTMLElement;

            let mouseEvents: MouseEvents = new MouseEvents();

            beforeAll((): void => {
                ele = createElement('div', { id: 'diagramdraw' });
                document.body.appendChild(ele);
                diagram = new Diagram({
                    width: '1000px', height: '1000px',
                    nodes: [node1, node2, node3, node4, node5, node6, node7, node8],
                    connectors: [connector1, connector2, connector3, connector4, connector5, connector6],
                    contextMenuSettings: { show: true, showCustomMenuOnly: true },
                });
                diagram.appendTo('#diagramdraw');
            });

            it('Render custom Context Menu only', (done: Function) => {
                expect((diagram.contextMenuModule as any).element).not.toBe(null);
                expect((diagram.contextMenuModule as any).element.id).toBe(diagram.element.id + '_contextMenu');
                expect(diagram.contextMenuModule.contextMenu.enableRtl).toBe(diagram.enableRtl);
                expect(diagram.contextMenuModule.contextMenu.locale).toBe(diagram.locale);
                expect(diagram.contextMenuModule.contextMenu.enablePersistence).toBe(diagram.enablePersistence);
                expect(diagram.contextMenuModule.contextMenu.target).toBe('#' + diagram.element.id);
                expect(diagram.contextMenuModule.contextMenu.cssClass).toBe('e-diagram-menu');
                expect(diagram.contextMenuModule.contextMenu.items.length).toBe(0);
                expect((diagram.contextMenuModule as any).getModuleName()).toBe('contextMenu');
                done();
            });

            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });
        });

        describe('contextmenu ensure target coverage', () => {
            let diagram: Diagram;
            let ele: HTMLElement;

            let mouseEvents: MouseEvents = new MouseEvents();

            beforeAll((): void => {
                ele = createElement('div', { id: 'diagramdraw' });
                document.body.appendChild(ele);
                diagram = new Diagram({
                    width: '1000px', height: '1000px',
                    nodes: [node1, node2, node3, node4, node5, node6, node7, node8],
                    connectors: [connector1, connector2, connector3, connector4, connector5, connector6],
                    contextMenuSettings: { show: true }
                });
                diagram.appendTo('#diagramdraw');
            });

            it('Ensure Target', (done: Function) => {
                (diagram.contextMenuModule as any).eventArgs = { target: document.getElementById('diagramdraw_diagramAdorner_svg') };
                let e = {
                    event: (diagram.contextMenuModule as any).eventArgs,
                    items: diagram.contextMenuModule.contextMenu.items,
                };
                (diagram.contextMenuModule as any).contextMenuBeforeOpen(e);
                expect((diagram.contextMenuModule as any).getModuleName()).toBe('contextMenu');
                expect((diagram.contextMenuModule as any).hiddenItems.length).toBe(13);
                (diagram.contextMenuModule as any).contextMenuOpen();
                (diagram.contextMenuModule as any).contextMenuOnClose(e);
                done();
            });

            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });
        });
    });

    describe('Testing Tooltip Interaction', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        let mouseEvents: MouseEvents = new MouseEvents();

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram5' });
            document.body.appendChild(ele);
            let selArray: (NodeModel | ConnectorModel)[] = [];
            let node: NodeModel = { id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100 };
            let firstNode: NodeModel = { id: 'node2', width: 100, height: 100, offsetX: 300, offsetY: 300 };

            let bpmn: NodeModel = {
                id: 'bpmnshape', width: 100, height: 100, offsetX: 100, offsetY: 500,
                shape: { type: 'Bpmn' }
            };

            let connector: ConnectorModel = { id: 'connector1', sourcePoint: { x: 200, y: 200 }, targetPoint: { x: 300, y: 300 } };


            diagram = new Diagram({
                width: 550, height: 550, nodes: [node, bpmn, firstNode],
                connectors: [connector], snapSettings: { constraints: SnapConstraints.ShowLines }
            });

            diagram.appendTo('#diagram5');
            selArray.push(diagram.nodes[0]);
            diagram.select(selArray);
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking tooltip node(single) dragging', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 150, 150);
            mouseEvents.dragEvent(diagramCanvas, 100, 100, 200, 100);
            mouseEvents.mouseMoveEvent(diagramCanvas, 150, 50);
            mouseEvents.mouseMoveEvent(diagramCanvas, 200, 100);
            mouseEvents.mouseMoveEvent(diagramCanvas, 300, 100);
            mouseEvents.dragEvent(diagramCanvas, 300, 100, 100, 100);
            setTimeout(() => {
                let tooltipElement = document.getElementsByClassName('e-tooltip-wrap')[0];
                expect(tooltipElement.firstElementChild.textContent == 'X:50 Y:50').toBe(true);
                done();
            }, 10);
        });

        it('Checking tooltip connector end points dragging', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 350, 350);
            mouseEvents.dragEvent(diagramCanvas, 300, 300, 370, 300);
            setTimeout(() => {
                mouseEvents.dragEvent(diagramCanvas, 370, 300, 400, 400);
            }, 5);
            setTimeout(() => {
                let tooltipElement = document.getElementsByClassName('e-tooltip-wrap')[0];
                expect(tooltipElement.firstElementChild.textContent == 'X:392 Y:392').toBe(true);
                done();
            }, 10);
        });

        it('checking tooltip resizing an element', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let offsetLeft: number = diagram.element.offsetLeft;
            let offsetTop: number = diagram.element.offsetTop;
            //increasing size
            let topLeft1: PointModel = (diagram.nodes[0] as NodeModel).wrapper.bounds.topLeft;
            mouseEvents.clickEvent(diagramCanvas, 150, 150);
            mouseEvents.dragEvent(diagramCanvas, topLeft1.x, topLeft1.y, topLeft1.x - 10, topLeft1.y - 10);
            setTimeout(() => {
                let tooltipElement = document.getElementsByClassName('e-tooltip-wrap')[0];
                expect(tooltipElement.firstElementChild.textContent == 'W:110 H:110').toBe(true);
                done();
            }, 10);
        });

        it('checking tooltip rotating an element', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let output: string = '';
            //select
            mouseEvents.clickEvent(diagramCanvas, 150, 150);
            // rotate node
            let bounds: Rect = (diagram.nodes[0] as NodeModel).wrapper.bounds;
            let rotator: PointModel = { x: bounds.center.x, y: bounds.y - 30 };
            let matrix: Matrix = identityMatrix();
            rotateMatrix(matrix, 50, bounds.center.x, bounds.center.y);
            let endPoint: PointModel = transformPointByMatrix(matrix, rotator);
            mouseEvents.dragEvent(
                diagramCanvas, rotator.x + diagram.element.offsetLeft,
                rotator.y + diagram.element.offsetTop, endPoint.x + diagram.element.offsetLeft,
                endPoint.y + diagram.element.offsetTop);
            diagram.nodes[0].rotateAngle = Math.round(diagram.nodes[0].rotateAngle);
            setTimeout(() => {
                let tooltipElement = document.getElementsByClassName('e-tooltip-wrap')[0];
                expect(tooltipElement.firstElementChild.textContent.length > 0).toBe(true);
                done();
            }, 10);
        });
    });
});
let shape: BasicShapeModel = { type: 'Basic', shape: 'Ellipse' };
let node11: NodeModel = {
    id: 'node', offsetX: 200, offsetY: 100, shape: shape,

};
let shape2: BasicShapeModel = { type: 'Basic', shape: 'Ellipse' };
let node12: NodeModel = {
    id: 'node2', offsetX: 500, offsetY: 100, shape: shape2,

};
let shape21: BasicShapeModel = { type: 'Basic', shape: 'Rectangle' };
let node121: NodeModel = {
    id: 'node121', offsetX: 300, offsetY: 400, width: 100, height: 100,
    shape: shape21,

};


let connectors: ConnectorModel[] = [{
    id: 'connector11',
    type: 'Straight',
    sourcePoint: { x: 100, y: 100 },
    targetPoint: { x: 200, y: 200 },
},
{
    id: 'connector22',
    type: 'Orthogonal',
    sourcePoint: { x: 300, y: 100 },
    targetPoint: { x: 400, y: 200 },
}];
describe('Tool constraints TestCases', () => {
    let diagram: Diagram;
    let ele: HTMLElement;

    let mouseEvents: MouseEvents = new MouseEvents();

    beforeAll((): void => {
        ele = createElement('div', { id: 'diagramTool' });
        document.body.appendChild(ele);
        diagram = new Diagram({
            width: '1000px', height: '1000px', mode: 'SVG',
            nodes: [node11, node12, node121],
            //width: '1000px', height: '1000px',
            //nodes: [node11, node12],
            connectors: connectors,
            contextMenuSettings: { show: true },
            scrollSettings: { scrollLimit: 'Infinity' }
        });
        diagram.appendTo('#diagramTool');
    });

    it('single Select', (done: Function) => {

        diagram.tool = DiagramTools.SingleSelect;
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.clickEvent(diagramCanvas, 200, 100, true);
        mouseEvents.clickEvent(diagramCanvas, 500, 100, true);
        expect(diagram.selectedItems.nodes.length === 1).toBe(true)

        done();

    });
    it('Rotate Api Resize issue', (done: Function) => {
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.clickEvent(diagramCanvas, 300, 400);
        var nodes = diagram.nodes[2];
        diagram.rotate(nodes, 45);
        diagram.dataBind();
        mouseEvents.mouseMoveEvent(diagramCanvas, 335 + 8, 374);
        let element = document.getElementById(diagram.element.id + 'content');
        expect(element.style.cursor === 'ne-resize').toBe(true);
        done();
    })
    it('single Select Coverage Node', (done: Function) => {
        diagram.clearSelection();
        diagram.tool = DiagramTools.SingleSelect;
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.clickEvent(diagramCanvas, 200, 100, true);
        mouseEvents.mouseMoveEvent(diagramCanvas, 500, 100)
        mouseEvents.dragAndDropEvent(diagramCanvas, 500, 100, 510, 110, true);
        expect(diagram.selectedItems.nodes.length === 1).toBe(true)

        done();
    });
    it('single Select Coverage Connector', (done: Function) => {
        diagram.clearSelection();
        diagram.tool = DiagramTools.SingleSelect;
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.clickEvent(diagramCanvas, 198, 198, true);
        mouseEvents.mouseMoveEvent(diagramCanvas, 400, 199);
        mouseEvents.dragAndDropEvent(diagramCanvas, 400, 199, 600, 300, true);
        expect(diagram.selectedItems.connectors.length === 1).toBe(true)

        done();
    });
    it('single Select Coverage Node', (done: Function) => {
        diagram.clearSelection();
        diagram.tool = DiagramTools.SingleSelect;
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.clickEvent(diagramCanvas, 200, 100, true);
        mouseEvents.mouseMoveEvent(diagramCanvas, 500, 100)
        mouseEvents.dragAndDropEvent(diagramCanvas, 500, 100, 510, 110, true);
        expect(diagram.selectedItems.nodes.length === 1).toBe(true)

        done();
    });
    it('single Select rubberband selection', (done: Function) => {
        diagram.clearSelection();
        diagram.tool = DiagramTools.SingleSelect;
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.dragAndDropEvent(diagramCanvas, 50, 50, 600, 600, true);
        expect(diagram.selectedItems.nodes.length === 0).toBe(true)

        done();
    });

    it('Multiples Select', (done: Function) => {
        diagram.clearSelection();
        diagram.tool = DiagramTools.MultipleSelect;
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.clickEvent(diagramCanvas, 200, 100, true);
        expect(diagram.selectedItems.nodes.length === 0).toBe(true)
        mouseEvents.dragAndDropEvent(diagramCanvas, 30, 30, 600, 300);
        expect(diagram.selectedItems.nodes.length === 2 && diagram.selectedItems.connectors.length === 1).toBe(true);

        done();
    });
    it('single Select && multiple select', (done: Function) => {
        diagram.clearSelection();
        diagram.tool = DiagramTools.MultipleSelect | DiagramTools.SingleSelect;
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.clickEvent(diagramCanvas, 200, 100, true);
        expect(diagram.selectedItems.nodes.length === 1).toBe(true)
        mouseEvents.dragAndDropEvent(diagramCanvas, 30, 30, 600, 300);
        expect(diagram.selectedItems.nodes.length === 2 && diagram.selectedItems.connectors.length === 1).toBe(true);

        done();
    });
    it('ZoomPan and single select', (done: Function) => {
        diagram.clearSelection();
        diagram.tool = DiagramTools.ZoomPan | DiagramTools.SingleSelect;
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.clickEvent(diagramCanvas, 200, 100, true);
        mouseEvents.dblclickEvent(diagramCanvas, 200, 100, true);
        let textElement = document.getElementById('diagramTool_editTextBoxDiv');
        expect(textElement && diagram.selectedItems.nodes.length === 1).toBe(true)
        let events: MouseEvents = new MouseEvents();
        events.dragAndDropEvent(document.getElementById('diagramToolcontent'), 400, 300, 400, 200);
        expect(diagram.scroller.verticalOffset == -100).toBe(true);

        done();
    });
    it('drawonce connector and zoompan', (done: Function) => {
        diagram.tool = DiagramTools.DrawOnce | DiagramTools.ZoomPan;
        diagram.drawingObject = { id: 'connector113', type: 'Straight' };
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.dragAndDropEvent(diagramCanvas, 300, 100, 400, 100);
        let events: MouseEvents = new MouseEvents();
        events.dragAndDropEvent(document.getElementById('diagramToolcontent'), 400, 300, 400, 200);
        expect(diagram.selectedItems.connectors.length && diagram.selectedItems.connectors[0].id.indexOf('connector113'));
        done();
    });
    it('ZoomPan ', (done: Function) => {
        diagram.clearSelection();
        diagram.tool = DiagramTools.ZoomPan
        let events: MouseEvents = new MouseEvents();
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        events.dragAndDropEvent(document.getElementById('diagramToolcontent'), 400, 300, 400, 200);
        mouseEvents.clickEvent(diagramCanvas, 200, 100, true);
        mouseEvents.dblclickEvent(diagramCanvas, 200, 100, true);
        let textElement = document.getElementById('diagramTool_editTextBoxDiv');
        expect(!textElement && diagram.selectedItems.nodes.length === 0).toBe(true)
        done();
    });
    it('ContinousDraw Node', (done: Function) => {
        diagram.tool = DiagramTools.ContinuousDraw;
        diagram.drawingObject = { id: 'node112', shape: { type: 'Basic', shape: 'Rectangle' } };
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.dragAndDropEvent(diagramCanvas, 250, 250, 150, 150);
        expect(diagram.selectedItems.nodes.length && diagram.selectedItems.nodes[0].id.indexOf('node112'));
        expect(diagram.selectedItems.nodes[0].width === 100 && diagram.selectedItems.nodes[0].height === 100).toBe(true);

        diagram.drawingObject = { id: 'node113', shape: { type: 'Basic', shape: 'Rectangle' } };
        mouseEvents.dragAndDropEvent(diagramCanvas, 350, 350, 450, 450);
        expect(diagram.selectedItems.nodes.length && diagram.selectedItems.nodes[0].id.indexOf('node113'));
        expect(diagram.selectedItems.nodes[0].width === 100 && diagram.selectedItems.nodes[0].height === 100).toBe(true);
        done();
    });

    it('ContinousDraw connector', (done: Function) => {
        diagram.tool = DiagramTools.ContinuousDraw;
        diagram.drawingObject = { id: 'connector111', type: 'Straight' };
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.dragAndDropEvent(diagramCanvas, 450, 450, 350, 350);
        expect(diagram.selectedItems.connectors.length && diagram.selectedItems.connectors[0].id.indexOf('connector111'));
        expect((diagram.selectedItems.connectors[0].wrapper.width === 100 || diagram.selectedItems.connectors[0].wrapper.width === 102) &&
            (diagram.selectedItems.connectors[0].wrapper.height === 100 || diagram.selectedItems.connectors[0].wrapper.height === 90)).toBe(true);

        diagram.drawingObject = { id: 'connector112', type: 'Straight' };
        mouseEvents.dragAndDropEvent(diagramCanvas, 550, 550, 450, 450);
        expect(diagram.selectedItems.connectors.length && diagram.selectedItems.connectors[0].id.indexOf('connector112'));
        expect((diagram.selectedItems.connectors[0].wrapper.width === 100 || diagram.selectedItems.connectors[0].wrapper.width === 102) &&
            (diagram.selectedItems.connectors[0].wrapper.height === 100 || diagram.selectedItems.connectors[0].wrapper.height === 90)).toBe(true);
        done();
    });
    it('ContinousDraw Node and delete', (done: Function) => {
        diagram.tool = DiagramTools.ContinuousDraw;
        diagram.drawingObject = { id: 'node1122', shape: { type: 'Basic', shape: 'Rectangle' } };
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.dragAndDropEvent(diagramCanvas, 100, 400, 200, 500);
        expect(diagram.selectedItems.nodes.length && diagram.selectedItems.nodes[0].id.indexOf('node1122'));
        mouseEvents.keyDownEvent(diagramCanvas, 'Delete');
        expect(diagram.selectedItems.nodes.length === 0).toBe(true);
        done();
    });
    it('ContinousDraw connector and delete', (done: Function) => {
        diagram.tool = DiagramTools.ContinuousDraw;
        diagram.drawingObject = { id: 'connector1111', type: 'Straight' };
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.dragAndDropEvent(diagramCanvas, 100, 30, 200, 300);
        expect(diagram.selectedItems.connectors.length && diagram.selectedItems.connectors[0].id.indexOf('connector1111'));
        mouseEvents.keyDownEvent(diagramCanvas, 'Delete');
        expect(diagram.selectedItems.connectors.length === 0).toBe(true);
        done();
    });

    it('drawonce connector', (done: Function) => {
        diagram.tool = DiagramTools.DrawOnce
        diagram.drawingObject = { id: 'connector113', type: 'Straight' };
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.dragAndDropEvent(diagramCanvas, 150, 150, 100, 100);
        expect(diagram.selectedItems.connectors.length && diagram.selectedItems.connectors[0].id.indexOf('connector113'));
        expect((diagram.selectedItems.connectors[0].wrapper.width === 50 ||
            diagram.selectedItems.connectors[0].wrapper.width === 42) && (diagram.selectedItems.connectors[0].wrapper.height === 50)).toBe(true);
        done();
    });


    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });
});

describe('Responsiveness for percentage', () => {
    let diagram: Diagram;
    let ele: HTMLElement;

    let mouseEvents: MouseEvents = new MouseEvents();

    beforeAll((): void => {
        ele = createElement('div', { id: 'diagramTool1' });
        document.body.appendChild(ele);
        diagram = new Diagram({
            width: '75%', height: '600px', nodes: [node11, node12],
        });
        diagram.appendTo('#diagramTool1');
    });

    it('Responsiveness on model size change by percentage', (done: Function) => {
        diagram.width = '50%';
        diagram.dataBind();
        let container: HTMLElement = document.getElementById(diagram.element.id);
        let bounds: ClientRect = container.getBoundingClientRect();
        expect(Math.round(bounds.width) === 624 || Math.round(bounds.width) === 366);
        expect(bounds.height === 600);
        done();
    });

    it('Responsiveness on window resize by percentage', (done: Function) => {
        diagram.width = '75%';
        diagram.dataBind();
        let container: HTMLElement = document.getElementById(diagram.element.id);
        let bounds: ClientRect = container.getBoundingClientRect();
        diagram['eventHandler'].windowResize(<Event>{});
        setTimeout(function () {
            expect(Math.round(bounds.width) === 935.5 || Math.round(bounds.width) === 549);
            expect(bounds.height === 600);
            done();
        }, 305);
    });

    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });
});


describe('updateViewPort', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let ele1: HTMLElement;
    beforeAll((): void => {
        ele = createElement('div', { id: 'diagramparent' });
        ele.style.height = '500px'
        ele.style.width = '400px'
        document.body.appendChild(ele);
        ele1 = createElement('div', { id: 'diagramupdateViewPort' });
        ele.appendChild(ele1);
        diagram = new Diagram({
            width: '100%', height: '100%',
        });
        diagram.appendTo('#diagramupdateViewPort');
    });

    it('updateViewPort coverage', (done: Function) => {
        ele.style.width = '700px'
        ele.style.height = '700px'
        diagram.updateViewPort();
        let value: HTMLElement = document.getElementById('diagramupdateViewPort_diagramLayer_div')
        expect(value.style.width === '700px' && value.style.height == '700px').toBe(true);
        done();
    })

    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });
});
describe('Responsiveness for pixels', () => {
    let diagram: Diagram;
    let ele: HTMLElement;

    let mouseEvents: MouseEvents = new MouseEvents();

    beforeAll((): void => {
        ele = createElement('div', { id: 'diagramTool1' });
        document.body.appendChild(ele);
        diagram = new Diagram({
            width: '700px', height: '600px', nodes: [node11, node12],
        });
        diagram.appendTo('#diagramTool1');
    });


    it('Responsiveness on window resize by pixels', (done: Function) => {
        diagram.width = '700px';
        diagram.dataBind();
        let container: HTMLElement = document.getElementById(diagram.element.id);
        let bounds: ClientRect = container.getBoundingClientRect();
        diagram['eventHandler'].windowResize(<Event>{});
        setTimeout(function () {
            expect(bounds.width === 700);
            expect(bounds.height === 600);
        }, 505);
        done();
    });

    it('Responsiveness on model size change by pixels', (done: Function) => {
        diagram.width = '900px';
        diagram.height = '500px';
        diagram.dataBind();
        let container: HTMLElement = document.getElementById(diagram.element.id);
        let bounds: ClientRect = container.getBoundingClientRect();
        expect(bounds.width === 900);
        expect(bounds.height === 500);
        done();
    });


    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });
});
let shapeconstraints: BasicShapeModel = { type: 'Basic', shape: 'Ellipse' };
let node11constraints: NodeModel = {
    id: 'nodeconstraints', offsetX: 200, offsetY: 100, shape: shapeconstraints,

};
let shape2constraints: BasicShapeModel = { type: 'Basic', shape: 'Ellipse' };
let node12constraints: NodeModel = {
    id: 'node2constraints', offsetX: 500, offsetY: 100, shape: shape2constraints,

};


let connectorsconstraints: ConnectorModel[] = [{
    id: 'connector11constraints',
    type: 'Straight',
    sourcePoint: { x: 100, y: 100 },
    targetPoint: { x: 200, y: 200 },
},
{
    id: 'connector22constraints',
    type: 'Orthogonal',
    sourcePoint: { x: 300, y: 100 },
    targetPoint: { x: 400, y: 200 },
}];




describe('Diagram constraints TestCases', () => {
    let diagram: Diagram;
    let ele: HTMLElement;

    let mouseEvents: MouseEvents = new MouseEvents();

    beforeAll((): void => {
        ele = createElement('div', { id: 'diagramconstraints' });
        document.body.appendChild(ele);
        diagram = new Diagram({
            width: '1000px', height: '1000px',
            nodes: [node11, node12],
            connectors: connectorsconstraints,
            contextMenuSettings: { show: true },
            scrollSettings: { scrollLimit: 'Infinity' }
        });
        diagram.appendTo('#diagramconstraints');
    });

    it('diagram user interaction constraints', (done: Function) => {
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        diagram.constraints = DiagramConstraints.Default & ~DiagramConstraints.UserInteraction;
        mouseEvents.mouseMoveEvent(diagramCanvas, 200, 100);
        mouseEvents.clickEvent(diagramCanvas, 200, 100);
        mouseEvents.dragAndDropEvent(diagramCanvas, 200, 100, 250, 100);
        expect(diagram.selectedItems.nodes.length === 0).toBe(true)
        diagram.constraints = DiagramConstraints.Default
        mouseEvents.clickEvent(diagramCanvas, 200, 100, true);
        mouseEvents.mouseLeaveEvent(diagramCanvas);
        expect(diagram.selectedItems.nodes.length === 1).toBe(true)

        done();
    });
    it('diagram user APIUpdate node drag constraints', (done: Function) => {
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        let obj: NodeModel = diagram.nodes[0];
        diagram.drag(obj, 50, 50);
        expect(diagram.nodes[0].offsetX === 250 && diagram.nodes[0].offsetY === 150).toBe(true)
        diagram.constraints = DiagramConstraints.Default & ~DiagramConstraints.ApiUpdate;
        diagram.drag(obj, 50, 50);
        expect(diagram.nodes[0].offsetX === 250 && diagram.nodes[0].offsetY === 150).toBe(true)
        done();
    });
    it('diagram user APIUpdate node rotate constraints', (done: Function) => {
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        let obj: NodeModel = diagram.nodes[0];
        diagram.constraints = DiagramConstraints.Default
        diagram.rotate(obj, 10);
        expect(diagram.selectedItems.nodes[0].wrapper.bounds.right === 291.48).toBe(true);
        diagram.constraints = DiagramConstraints.Default & ~DiagramConstraints.ApiUpdate;
        diagram.rotate(obj, 10);
        expect(diagram.selectedItems.nodes[0].wrapper.bounds.right === 291.48).toBe(true);
        done();
    });
    it('diagram user APIUpdate node scale constraints', (done: Function) => {
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        let obj: NodeModel = diagram.nodes[0];
        diagram.constraints = DiagramConstraints.Default
        diagram.scale(obj, 1.2, 1.2, { x: 0, y: 0.5 });
        expect(diagram.selectedItems.nodes[0].wrapper.bounds.right === 307.65).toBe(true);
        diagram.constraints = DiagramConstraints.Default & ~DiagramConstraints.ApiUpdate;
        diagram.scale(obj, 1.2, 1.2, { x: 0, y: 0.5 });
        expect(diagram.selectedItems.nodes[0].wrapper.bounds.right === 307.65).toBe(true);
        done();
    });
    it('diagram user APIUpdate connector sourceend drag  constraints', (done: Function) => {
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        let obj: ConnectorModel = diagram.connectors[0];
        diagram.constraints = DiagramConstraints.Default
        diagram.clearSelection();
        mouseEvents.clickEvent(diagramCanvas, 198, 198, true);
        diagram.dragSourceEnd(obj, 50, 50)
        expect(diagram.selectedItems.connectors[0].sourcePoint.x === 150).toBe(true);
        diagram.constraints = DiagramConstraints.Default & ~DiagramConstraints.ApiUpdate;
        diagram.dragSourceEnd(obj, 50, 50)
        expect(diagram.selectedItems.connectors[0].sourcePoint.x === 150).toBe(true);
        done();
    });
    it('diagram user APIUpdate connector targetend drag  constraints', (done: Function) => {
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        let obj: ConnectorModel = diagram.connectors[0];
        diagram.constraints = DiagramConstraints.Default
        diagram.dragTargetEnd(obj, 50, 50)
        expect(diagram.selectedItems.connectors[0].targetPoint.x === 250).toBe(true);
        diagram.constraints = DiagramConstraints.Default & ~DiagramConstraints.ApiUpdate;
        diagram.dragTargetEnd(obj, 50, 50)
        expect(diagram.selectedItems.connectors[0].targetPoint.x === 250).toBe(true);
        done();
    });
    it('Checking interactive zooming', (done: Function) => {
        let events: MouseEvents = new MouseEvents();
        diagram.constraints = DiagramConstraints.Default & ~DiagramConstraints.Zoom;
        events.mouseWheelEvent(document.getElementById('diagramconstraints'), 500, 250, true);
        diagram.tool = DiagramTools.ZoomPan
        events.dragAndDropEvent(document.getElementById('diagramconstraintscontent'), 400, 300, 400, 200);
        expect(diagram.scroller.horizontalOffset !== 82 && diagram.scroller.verticalOffset !== 41.67).toBe(true);
        done();
    });
    it('Checking interactive panningY', (done: Function) => {
        diagram.clearSelection();
        diagram.tool = DiagramTools.ZoomPan
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        diagram.constraints = DiagramConstraints.Default & ~DiagramConstraints.PanY;
        let events: MouseEvents = new MouseEvents();
        events.dragAndDropEvent(document.getElementById('diagramconstraintscontent'), 400, 300, 400, 200);
        expect(diagram.scroller.verticalOffset === -100).toBe(true);
        done();
    });
    it('Checking interactive panningX', (done: Function) => {
        diagram.clearSelection();
        diagram.tool = DiagramTools.ZoomPan
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        diagram.constraints = DiagramConstraints.Default & ~DiagramConstraints.PanY;
        let events: MouseEvents = new MouseEvents();
        events.dragAndDropEvent(document.getElementById('diagramconstraintscontent'), 400, 300, 400, 200);
        expect(diagram.scroller.horizontalOffset === 0).toBe(true);
        diagram.addConstraints(DiagramConstraints.Default, DiagramConstraints.PanY)
        done();
    });

    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });

    describe('Drawing Tool - Connector Issue', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        let mouseEvents: MouseEvents = new MouseEvents();

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramdrawConnectorIssue' });
            document.body.appendChild(ele);
            diagram = new Diagram({
                width: '1000px', height: '1000px', connectors: [{
                    id: 'connector2',
                    type: 'Orthogonal',
                    sourcePoint: { x: 300, y: 100 },
                    targetPoint: { x: 400, y: 200 },
                }], snapSettings: { constraints: SnapConstraints.ShowLines }
            });
            diagram.appendTo('#diagramdrawConnectorIssue');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Draw connector issue - check source id', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 10, 10);
            diagram.tool = DiagramTools.DrawOnce
            diagram.drawingObject = {
                type: 'Straight',
            }
            mouseEvents.dragAndDropEvent(diagramCanvas, diagram.connectors[0].targetPoint.x + diagram.element.offsetLeft, diagram.connectors[0].targetPoint.y, 150, 150);
            expect(diagram.connectors.length == 2 && diagram.connectors[0].sourceID == '' && diagram.connectors[0].targetID == '' &&
                diagram.connectors[1].sourceID == '' && diagram.connectors[1].targetID == '').toBe(true);
            done();
        });
    });
});