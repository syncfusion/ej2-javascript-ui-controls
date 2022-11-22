import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { ChildArrangement, ConnectionPointOrigin, DiagramTools, NodeConstraints, ConnectorConstraints, PortVisibility, PortConstraints  } from '../../../src/diagram/enum/enum';
import { ConnectorModel } from '../../../src/diagram/objects/connector-model';
import { BasicShapeModel, BpmnShapeModel, NativeModel, NodeModel } from '../../../src/diagram/objects/node-model';
import { BpmnDiagrams } from '../../../src/diagram/objects/bpmn';
import { DiagramScroller } from '../../../src/diagram/interaction/scroller';
import { LayerModel, Rect, UndoRedo, PointModel, LineDistribution, ComplexHierarchicalTree, DataBinding, Node, ConnectorEditing, Canvas } from '../../../src/index';
import { MouseEvents } from '../../../spec/diagram/interaction/mouseevents.spec';
import { IClickEventArgs, IPropertyChangeEventArgs } from '../../../src/diagram/objects/interface/IElement';
import { Matrix, transformPointByMatrix, identityMatrix, rotateMatrix } from '../../../src/diagram/primitives/matrix';
import { profile, inMB, getMemoryProfile } from '../../../spec/common.spec';
import { DataManager, Query } from '@syncfusion/ej2-data';
Diagram.Inject(BpmnDiagrams, UndoRedo, LineDistribution, ComplexHierarchicalTree, DataBinding, ConnectorEditing);
/**
 * PageSettings Spec
 */
describe('PageSettings', () => {

    describe('Exception occurs when try to draw SVG node issue', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll(() => {
            ele = createElement('div', { id: 'diagramorder' });
            document.body.appendChild(ele);
            diagram = new Diagram({
                width: '1000px', height: '500px',
                tool: DiagramTools.ContinuousDraw
    
            });
            diagram.appendTo('#diagramorder');
        });
        afterAll(() => {
            diagram.destroy();
            ele.remove();
        });
        it('Draw Normal node and check nodes collection', function (done) {
            let shape: BasicShapeModel = { type: 'Basic', shape: 'Ellipse'};
            diagram.drawingObject = {
            shape: shape
                }
            diagram.dataBind();    
            let mouseevents: MouseEvents = new MouseEvents();
            let diagramCanvas: Element = document.getElementById('diagramcontent');
            mouseevents.mouseDownEvent(diagramCanvas, 200, 250);
            mouseevents.mouseMoveEvent(diagramCanvas, 250, 350);
            mouseevents.mouseUpEvent(diagramCanvas, 250, 350);
            expect(diagram.nodes.length === 1).toBe(true);
            done();
        });
        it('Draw SVG node and check nodes collection', function (done) {
            let str: string = '<svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="350.000000pt" ' +
            'height="229.000000pt" viewBox="0 0 350.000000 229.000000" ' +
            'preserveAspectRatio="xMidYMid meet"> <metadata>' +
            ' Created by potrace 1.11, written by Peter Selinger 2001-2013' +
            ' </metadata> <g transform="translate(0.000000,229.000000) scale(0.100000,-0.100000)"' +
            ' fill="#de6ca9" stroke="none"><path d="M0 1145 l0 -1145 1750 0 1750 0 0 1145 0 1145' +
            ' -1750 0 -1750 0 0 -1145z m1434 186 c19 -8 26 -18 26 -37 0 -24 -3 -26' +
            ' -27 -19 -16 3 -58 9 -94 12 -63 5 -67 4 -88 -23 -23 -29 -21 -60 6 -81 8' +
            ' -6 47 -19 86 -29 55 -13 80 -25 106 -51 31 -31 33 -37 29 -88 -8 -94 -69' +
            ' -133 -193 -122 -90 7 -115 20 -115 58 0 26 3 30 18 24 91 -38 168 -41 204' +
            ' -8 23 21 23 75 1 96 -10 8 -49 23 -88 33 -88 22 -135 63 -135 118 0 92 67 140' +
            ' 181 131 31 -2 68 -9 83 -14z m854 -6 c38 -15 42 -21 42 -51 l0 -33 -47 25' +
            ' c-41 22 -58 25 -115 22 -58 -3 -72 -8 -97 -32 -79 -75 -59 -259 32 -297 35' +
            ' -15 106 -18 150 -6 26 7 27 10 27 67 l0 60 -50 0 c-47 0 -50 2 -50 25 0 25' +
            ' 1 25 80 25 l81 0 -3 -97 -3 -98 -40 -20 c-22 -10 -65 -21 -95 -23 -153 -11' +
            ' -242 74 -243 230 0 145 93 235 233 224 30 -2 74 -12 98 -21z m-638 -169 l67' +
            ' -178 40 103 c22 57 53 139 69 182 28 75 29 77 62 77 19 0 32 -4 30 -9 -1 -5' +
            ' -39 -104 -83 -220 l-80 -211 -37 0 c-35 0 -37 2 -56 53 -11 28 -48 124 -81 ' +
            '211 -34 87 -61 163 -61 168 0 5 14 8 32 6 31 -3 32 -5 98 -182z" />' +
            '</g> </svg>';
            let shape2: NativeModel = { type: 'Native', content: str};
            diagram.drawingObject = {
            shape: shape2
            };
            diagram.dataBind();  
            let mouseevents: MouseEvents = new MouseEvents();
            let diagramCanvas: Element = document.getElementById('diagramcontent');
            mouseevents.mouseDownEvent(diagramCanvas, 400, 100);
            mouseevents.mouseMoveEvent(diagramCanvas, 500, 200);
            mouseevents.mouseUpEvent(diagramCanvas, 500, 200);
            expect(diagram.nodes.length === 2 && diagram.nodes[1].shape.type === 'Native').toBe(true);
            done();
        });
    });
    describe('Bezier connector not rendered properly issue', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll(() => {
            ele = createElement('div', { id: 'diagramorder' });
            document.body.appendChild(ele);
            let node: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100, annotations: [ { content: 'Node1'}],
                ports: [
                    {
                        id: 'port1', offset: { x: 1, y: 0.5}
                    }
                ]
            };
            let node2: NodeModel = {
                id: 'node2', width: 100, height: 100, offsetX: 100, offsetY: 350, annotations: [ { content: 'Node2'}],
                ports: [
                    {
                        id: 'port2', offset: { x: 1, y: 0.5}
                    }
                ]
            };
            diagram = new Diagram({
                width: 1500, height: 1000,  nodes: [node, node2],
                getConnectorDefaults: getConnectorDefaults,
    
    
            });
            diagram.appendTo('#diagramorder');
            function getConnectorDefaults(obj: ConnectorModel) {
                obj.constraints = ConnectorConstraints.Default | ConnectorConstraints.DragSegmentThumb;
            }
        });
        afterAll(() => {
            diagram.destroy();
            ele.remove();
        });
        it('Draw Bezier connector and check segment collection', function (done) {
            diagram.tool = DiagramTools.DrawOnce;
            let shape2: ConnectorModel = { type: 'Bezier'};
            diagram.drawingObject = shape2;
            diagram.dataBind();  
            let mouseevents: MouseEvents = new MouseEvents();
            let diagramCanvas: Element = document.getElementById('diagramcontent');
            mouseevents.mouseDownEvent(diagramCanvas, 400, 100);
            mouseevents.mouseMoveEvent(diagramCanvas, 600, 250);
            mouseevents.mouseUpEvent(diagramCanvas, 600, 250);
            var connector = diagram.connectors[0];
            connector.sourceID = "node1";
            connector.targetID = "node2";
            connector.sourcePortID = "port1";
            connector.targetPortID = "port2";
            diagram.dataBind();
            expect(diagram.connectors.length === 1 && diagram.connectors[0].segments.length === 2).toBe(true);
            done();
        });
    });
    describe('Page Settings', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let scroller: DiagramScroller;

        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                this.skip(); //Skips test (in Chai)
                return;
            }
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
    describe('BPMN Sequence connector', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        let mouseEvents: MouseEvents = new MouseEvents();

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagrambpmn' });
            document.body.appendChild(ele);
            let connector: ConnectorModel[] = [{
                id: 'Connector1',
                sourcePoint: { x: 700, y: 100 },
                targetPoint: { x: 800, y: 200 },
                type: 'Straight',
                shape: {
                    type: 'Bpmn',
                    flow: 'Sequence',
                    sequence: 'Default'
                },
                cornerRadius: 10
            },
            {
                id: 'Connector2',
                sourceID: 'node0',
                targetID: 'node1',
                shape: {
                    type: 'Bpmn',
                    flow: 'Sequence',
                    sequence: 'Default'
                },
                style: {
                    strokeColor: '#888888',
                    fill: '#555555',
                    strokeWidth: 1
                },
                targetDecorator: {
                    style: {
                        fill: '#555555',
                        strokeColor: '#888888'
                    }
                },
                type: 'Orthogonal',
                cornerRadius: 10
            },
            {
                id: 'Connector3',
                sourcePoint: { x: 600, y: 100 },
                targetPoint: { x: 700, y: 200 },
                shape: {
                    type: 'Bpmn',
                    flow: 'Sequence',
                    sequence: 'Default'
                },
                style: {
                    strokeColor: '#888888',
                    fill: '#555555',
                    strokeWidth: 1
                },
                targetDecorator: {
                    style: {
                        fill: '#555555',
                        strokeColor: '#888888'
                    }
                },
                type: 'Orthogonal',
                cornerRadius: 10
            },
            ];
            let nodes: NodeModel[] = [
                {
                    id: 'node0',
                    offsetX: 100,
                    offsetY: 100,
                    width: 30,
                    height: 30,
                    annotations: [{
                        content: 'Start',
                        margin: { bottom: -30 }
                    }],
                    shape: {
                        type: 'Bpmn',
                        shape: 'Event',
                        event: {
                            event: 'Start',
                            trigger: 'None'
                        }
                    },
                    style: {
                        strokeColor: '#62A716',
                        strokeWidth: 1
                    }
                },
                {
                    id: 'node1',
                    offsetX: 250,
                    offsetY: 250,
                    width: 90,
                    height: 60,
                    annotations: [
                        {
                            content: 'Activity 1'
                        }
                    ],
                    /*borderColor: '#78BE83',*/
                    borderWidth: 4,
                    shape: {
                        type: 'Bpmn',
                        shape: 'Activity',
                        activity: {
                            activity: 'Task',
                            task: {
                                type: 'Service'
                            }
                        }
                    },
                    style: {
                        fill: '#d8ecdc',
                        strokeColor: '#78BE83',
                        strokeWidth: 3,
                        gradient: {
                            // Start point of linear gradient
                            x1: 0,
                            y1: 0,
                            // End point of linear gradient
                            x2: 1,
                            y2: 1,
                            // Sets an array of stop objects
                            stops: [
                                {
                                    color: 'white',
                                    offset: 30,
                                    opacity: 0.1
                                },
                                {
                                    color: '#d8ecdc',
                                    offset: 100,
                                    opacity: 0.1
                                }
                            ],
                            type: 'Linear'
                        }
                    }
                },
                {
                    id: 'node2',
                    offsetX: 250,
                    offsetY: 400,
                    width: 90,
                    height: 60,
                    /*borderColor: '#78BE83',*/
                    borderWidth: 4,
                    shape: {
                        type: 'Flow',
                        shape: 'Annotation',
                    },
                    annotations: [
                        {
                            content: `Sample Text`,
                            style: {
                                textOverflow: 'Clip',
                                textWrapping: 'WrapWithOverflow',
                                textAlign: 'Left'
                            },
                            height: 50,
                            width: 80,
                            margin: { left: 0, top: 0, right: 0, bottom: 0 }
                        }
                    ],
                    style: {
                        strokeColor: '#778899',
                        strokeWidth: 3
                    }
                },
                {
                    id: 'node3', height: 100, width: 100, offsetX: 500, offsetY: 100
                },
            ];
            diagram = new Diagram({
                width: '1000px', height: '1000px', nodes: nodes,
                connectors: connector
            });
            diagram.appendTo('#diagrambpmn');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('BPMN Sequence default Rendering', (done: Function) => {

            let pathElement: HTMLElement = document.getElementById('Connector1_Default');
            expect(pathElement.getAttribute('transform') === "rotate(45,721.71,121.71)translate(713.2249841308594,113.22499938964843)").toBe(true);
            done();
        });

        it('BPMN Sequence connector Dragging', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            diagram.select([diagram.connectors[0]]);
            mouseEvents.mouseMoveEvent(diagramCanvas, 746, 140);
            mouseEvents.mouseDownEvent(diagramCanvas, 746, 140);
            mouseEvents.mouseMoveEvent(diagramCanvas, 756, 160);
            mouseEvents.mouseUpEvent(diagramCanvas, 756, 160);
            let pathElement: HTMLElement = document.getElementById('Connector1_Default');
            expect(pathElement.getAttribute('transform') === "rotate(45,731.71,141.71)translate(723.2249841308594,133.22499938964845)" ||
                pathElement.getAttribute('transform') === 'rotate(45,741.71,136.71)translate(733.2249841308594,128.22499938964845)').toBe(true);
            done();
        });
        it('BPMN Sequence connector Dragging with node move', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.mouseMoveEvent(diagramCanvas, 250, 340);
            mouseEvents.mouseDownEvent(diagramCanvas, 250, 340);
            mouseEvents.mouseMoveEvent(diagramCanvas, 350, 400);
            mouseEvents.mouseUpEvent(diagramCanvas, 350, 400);
            let pathElement: HTMLElement = document.getElementById('Connector2_Default');
            expect(pathElement.getAttribute('transform') === "rotate(45,250.5,165.5)translate(250.5,153.5)").toBe(true);
            done();
        });
        it('BPMN Sequence connector rotating with node move', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            diagram.select([diagram.nodes[3], diagram.connectors[2]]);
            mouseEvents.mouseMoveEvent(diagramCanvas, 575, 22);
            mouseEvents.mouseDownEvent(diagramCanvas, 575, 22);
            mouseEvents.mouseMoveEvent(diagramCanvas, 600, 50);
            mouseEvents.mouseUpEvent(diagramCanvas, 600, 50);
            let pathElement: HTMLElement = document.getElementById('Connector2_Default');
            console.log(pathElement.getAttribute('transform'));
            expect(pathElement.getAttribute('transform') === "rotate(45,250.5,165.5)translate(250.5,153.5)").toBe(true);
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
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }

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
            // expect(diagram.selectedItems.nodes[0].wrapper.bounds.right != 615
            //     || diagram.selectedItems.nodes[0].wrapper.bounds.right !== 620).toBe(true);
            done();
            mouseEvents.dragAndDropEvent(diagramCanvas, 620, 50, 700, 100);
            // expect(diagram.selectedItems.nodes[0].wrapper.bounds.right != 615
            //     || diagram.selectedItems.nodes[0].wrapper.bounds.right !== 620).toBe(true);
            done();
        });
        it('boundary constraints for rotate', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            diagram.pageSettings.boundaryConstraints = 'Page';
            mouseEvents.dragAndDropEvent(diagramCanvas, 500, 100, 515, 100);
            mouseEvents.dragAndDropEvent(diagramCanvas, 520, 100, 590, 20);
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
            expect((diagram.connectors[2].targetPoint.y === 392) || diagram.connectors[2].targetPoint.y === 400).toBe(true);
            done();
        });
        it('branch coverage for drag', (done: Function) => {
            diagram.pageSettings.boundaryConstraints = 'Page';
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.dragAndDropEvent(diagramCanvas, 200, 200, 300, 200);
            expect(diagram.nodes[2].offsetX === 300).toBe(true);
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

    describe('Checking Page Break', () => {
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

            ele = createElement('div', { id: 'diagramconstraints' });
            document.body.appendChild(ele);
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
                width: '850px', height: '700px', nodes: [node, node2, node3],
                pageSettings: {
                    orientation: 'Landscape',
                    width: 500, height: 500, showPageBreaks: true, multiplePage: false
                }
            });
            diagram.appendTo('#diagramconstraints');

        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('By moving node into negative axis', (done: Function) => {
            let pageArea: any = document.getElementById("diagramconstraints_backgroundLayerrect");
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 100, 100);
            mouseEvents.dragAndDropEvent(diagramCanvas, 100, 100, -400, -400);
            expect(pageArea.width.baseVal.value === 500).toBe(true);
            done();
        });

    });

    describe('Boundary Constraints rotate angle issue', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let node: NodeModel = {
                id: "node1",
                offsetX: 875,
                offsetY: 100,
                width: 44,
                height: 140,
                pivot: { x: 0.5, y: 0.5 },
                shape: {
                    type: 'Native',
                    content: '<svg width="22" height="70" xmlns="http://www.w3.org/2000/svg"><ellipse fill="none" stroke-width="1.5" cx="11.00001" cy="27.206965" id="svg_3" rx="10.187688" ry="10.187688" stroke="#0f0f00"/><ellipse fill="none" stroke-width="1.5" cx="11.00001" cy="40.902413" id="svg_1" rx="10.187688" ry="10.187688" stroke="#0f0f00"/><line stroke="#0f0f00" fill="none" stroke-width="1.5" fill-opacity="null" x1="11.15" y1="0" x2="11.15" y2="16.764379" id="svg_10" stroke-linejoin="null" stroke-linecap="null"/><line stroke="#0f0f00" fill="none" stroke-width="1.5" fill-opacity="null" x1="11.15" y1="51" x2="11.15" y2="70" id="svg_6" stroke-linejoin="null" stroke-linecap="null"/></svg>'
                },

                constraints: NodeConstraints.Default | NodeConstraints.AspectRatio
            };
            diagram = new Diagram({
                width: '900', height: '900', nodes: [node], //connectors: connectors,

                pageSettings: {
                    background: {
                        color: "gray",
                    },
                    width: 900,
                    height: 900,
                    // Sets the BoundaryConstraints to page
                    boundaryConstraints: 'Diagram',

                }
            });
            diagram.appendTo('#diagram');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Boundary Constraints rotate angle issue', (done: Function) => {

            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let mouseEvents: MouseEvents = new MouseEvents();
            mouseEvents.clickEvent(diagramCanvas, 875, 100);
            mouseEvents.mouseDownEvent(diagramCanvas, 875, 100);
            mouseEvents.mouseMoveEvent(diagramCanvas, 875 + 10, 100);
            mouseEvents.mouseLeaveEvent(diagramCanvas);
            var node = diagram.nodes[0];
            node.rotateAngle = 90;
            diagram.dataBind();
            expect(node.rotateAngle === 0).toBe(true)
            done()

        });

    });

    describe('Diagram Get Custom Cursor - Blazor Support', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let node: NodeModel = {
                id: "node1",
                offsetX: 300,
                offsetY: 200,
                width: 100,
                height: 100,
            };
            diagram = new Diagram({
                width: '900', height: '900', nodes: [node],
                customCursor: [{
                    action: "Select", cursor: "crosshair"
                }],
            });
            diagram.appendTo('#diagram');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking Diagram Cursor', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let mouseEvents: MouseEvents = new MouseEvents();
            mouseEvents.mouseMoveEvent(diagramCanvas, 300, 200);
            expect(diagramCanvas.style.cursor === 'crosshair').toBe(true);
            done();
        });

    });

    describe('Diagram - Zoom pan enabled', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let node: NodeModel = {
                id: 'node1', width: 150, height: 100, offsetX: 100, offsetY: 100, annotations: [{ content: 'Node1' }]
            };
            let node2: NodeModel = {
                id: 'node2', width: 80, height: 130, offsetX: 200, offsetY: 200, annotations: [{ content: 'Node2' }]
            };
            let node3: NodeModel = {
                id: 'node3', width: 100, height: 75, offsetX: 300, offsetY: 350, annotations: [{ content: 'Node3' }]
            };
            diagram = new Diagram({
                width: '900', height: '900', nodes: [node, node2, node3],
                tool: DiagramTools.ZoomPan

            });
            diagram.appendTo('#diagram');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking Diagram Selected Items', (done: Function) => {
            let mouseevents: MouseEvents = new MouseEvents();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseevents.keyDownEvent(diagramCanvas, 'A', true);
            expect(diagram.selectedItems.nodes.length === 0).toBe(true);
            done();
        });

    });

});
describe('Page Settings with orientation', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let scroller: DiagramScroller;
    let mouseEvents: MouseEvents = new MouseEvents();
    beforeAll((): void => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }

        ele = createElement('div', { id: 'diagramconstraints' });
        document.body.appendChild(ele);
        let node: NodeModel = {
            id: 'node1', width: 150, height: 100, offsetX: 100, offsetY: 100,
        };
        diagram = new Diagram({
            width: 800, height: 800, nodes: [node],
            pageSettings: {
                orientation: 'Landscape',
                width: 600, height: 500,
                multiplePage: true, showPageBreaks: true,
                margin: { left: 10, top: 10, bottom: 10 },
            }
        });
        diagram.appendTo('#diagramconstraints');

    });
    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });
    it('boundary constraints for drag and drop', (done: Function) => {
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        diagram.pageSettings.boundaryConstraints = 'Diagram';
        mouseEvents.dragAndDropEvent(diagramCanvas, diagram.nodes[0].offsetX, diagram.nodes[0].offsetY, 600, 600);
        console.log(diagram.nodes[0].offsetX);
        expect(diagram.nodes[0].offsetX === 595).toBe(true);
        done();
    });
})

describe('BPMN Shape Style Change', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let scroller: DiagramScroller;
    let mouseEvents: MouseEvents = new MouseEvents();
    beforeAll((): void => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }

        ele = createElement('div', { id: 'diagram' });
        document.body.appendChild(ele);
        let node: NodeModel = {
            id: 'node12', width: 100, height: 100, offsetX: 1100, offsetY: 100,
            shape: {
                type: 'Bpmn', shape: 'Event',
                event: { event: 'End', trigger: 'None' }
            },
        };
        diagram = new Diagram({
            width: 800, height: 800, nodes: [node],
        });
        diagram.appendTo('#diagram');

    });
    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });
    it('Check BPMN Node color after save and load', (done: Function) => {
        diagram.nodes[0].style.fill = "red";
        let save: string = diagram.saveDiagram();
        diagram.loadDiagram(save);
        expect(diagram.nodes[0].style.fill === "red").toBe(true);
        done();
    });
})

describe('Node undo-redo style change', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let scroller: DiagramScroller;
    let mouseEvents: MouseEvents = new MouseEvents();
    beforeAll((): void => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }

        ele = createElement('div', { id: 'diagram' });
        document.body.appendChild(ele);
        let node: NodeModel = {
            id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100,
        };
        diagram = new Diagram({
            width: 800, height: 800, nodes: [node],
        });
        diagram.appendTo('#diagram');

    });
    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });
    it('Check node color after undo and redo', (done: Function) => {
        diagram.nodes[0].style = {
            fill: '#d8ecdc',
            strokeColor: '#78BE83',
            strokeWidth: 3,
            gradient: {
                // Start point of linear gradient
                x1: 0,
                y1: 0,
                // End point of linear gradient
                x2: 100,
                y2: 100,
                // Sets an array of stop objects
                stops: [
                    {
                        color: 'white',
                        offset: 30,
                        opacity: 0.1
                    },
                    {
                        color: '#d8ecdc',
                        offset: 100,
                        opacity: 0.1
                    }
                ],
                type: 'Linear'
            }
        };
        diagram.dataBind();
        diagram.undo();
        expect(diagram.nodes[0].style.fill === "white").toBe(true);
        diagram.redo();
        expect(diagram.nodes[0].style.fill === "#d8ecdc").toBe(true);
        done();
    });
    it('Add layer', (done: Function) => {
        var newNode = {
            id: 'new', offsetX: 300, offsetY: 300, height: 50, width: 50
        }
        diagram.addLayer({ objects: [], visible: true }, [newNode]);
        expect(diagram.layers.length === 2).toBe(true);
        done();
    });
    it('Remove layer', (done: Function) => {
        diagram.removeLayer(diagram.layers[1].id);
        expect(diagram.layers.length === 1).toBe(true);
        done();
    });
})
describe('Swimlane child disappears', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let scroller: DiagramScroller;
    let mouseEvents: MouseEvents = new MouseEvents();
    beforeAll((): void => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }

        ele = createElement('div', { id: 'diagramlane' });
        document.body.appendChild(ele);
        let nodes: NodeModel[] = [
            {
                id: 'swimlane',
                shape: {
                    type: 'SwimLane',
                    orientation: 'Horizontal',
                    header: {
                        annotation: { content: 'ONLINE PURCHASE STATUS', style: { fill: '#111111' } },
                        height: 50, style: { fontSize: 11 },
                    },
                    lanes: [
                        {
                            id: 'stackCanvas1',
                            header: {
                                annotation: { content: 'CUSTOMER' }, width: 50,
                                style: { fontSize: 11 }
                            },
                            height: 100,
                            children: [
                                {
                                    id: 'Order',
                                    annotations: [
                                        {
                                            content: 'ORDER',
                                            style: { fontSize: 11 }
                                        }
                                    ],
                                    margin: { left: 60, top: 20 },
                                    height: 40, width: 100
                                },
                                {
                                    id: 'selectItemaddcart',
                                    annotations: [{ content: 'Select item\nAdd cart' }],
                                    margin: { left: 190, top: 20 },
                                    height: 40, width: 100
                                },
                            ],
                        },

                    ],

                },
                offsetX: 420, offsetY: 270,
                height: 100,
                width: 650
            },
        ];
        let connectors: ConnectorModel[] = [
            {
                id: 'connector1', sourceID: 'Order',
                targetID: 'selectItemaddcart'
            },

        ];
        diagram = new Diagram({
            width: 800, height: 800, nodes: nodes,
            connectors: connectors
        });
        diagram.appendTo('#diagramlane');

    });
    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });
    it('Send swimlane child back and Check lane selection', (done: Function) => {
        diagram.select([diagram.getObject('Order')]);
        diagram.sendToBack();
        diagram.clearSelection();
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.clickEvent(diagramCanvas, 200, 300);
        expect(diagram.selectedItems.nodes[0].id === "swimlanestackCanvas10").toBe(true);
        done();
    });
})
describe('Swimlane send to back', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let scroller: DiagramScroller;
    let mouseEvents: MouseEvents = new MouseEvents();
    beforeAll((): void => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }

        ele = createElement('div', { id: 'diagramlane' });
        document.body.appendChild(ele);
        let nodes: NodeModel[] = [
            {
                id: 'swimlane',
                shape: {
                    type: 'SwimLane',
                    orientation: 'Horizontal',
                    header: {
                        annotation: { content: 'ONLINE PURCHASE STATUS', style: { fill: '#111111' } },
                        height: 50, style: { fontSize: 11 },
                    },
                    lanes: [
                        {
                            id: 'stackCanvas1',
                            header: {
                                annotation: { content: 'CUSTOMER' }, width: 50,
                                style: { fontSize: 11 }
                            },
                            height: 100,
                            children: [
                                {
                                    id: 'Order',
                                    annotations: [
                                        {
                                            content: 'ORDER',
                                            style: { fontSize: 11 }
                                        }
                                    ],
                                    margin: { left: 60, top: 20 },
                                    height: 40, width: 100
                                },
                                {
                                    id: 'selectItemaddcart',
                                    annotations: [{ content: 'Select item\nAdd cart' }],
                                    margin: { left: 190, top: 20 },
                                    height: 40, width: 100
                                },
                            ],
                        },

                    ],

                },
                offsetX: 420, offsetY: 270,
                height: 100,
                width: 650
            },
        ];
        let connectors: ConnectorModel[] = [
            {
                id: 'connector1', sourceID: 'Order',
                targetID: 'selectItemaddcart'
            },

        ];
        diagram = new Diagram({
            width: 800, height: 800, nodes: nodes,
            connectors: connectors
        });
        diagram.appendTo('#diagramlane');

    });
    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });
    it('Send swimlane back and check 1st index swimlane got selected', (done: Function) => {
        diagram.select([diagram.getObject('swimlane')]);
        diagram.copy();
        diagram.paste();
        diagram.sendToBack();
        diagram.clearSelection();
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.clickEvent(diagramCanvas, 550, 300);
        expect(diagram.selectedItems.nodes[0].id === "swimlanestackCanvas10").toBe(true);
        done();
    });
})
describe('Swimlane Resize functionality', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let scroller: DiagramScroller;
    let mouseEvents: MouseEvents = new MouseEvents();
    beforeAll((): void => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }

        ele = createElement('div', { id: 'diagramlane' });
        document.body.appendChild(ele);
        let nodes: NodeModel[] = [
            {
                id: 'swimlane',
                shape: {
                    type: 'SwimLane',
                    orientation: 'Horizontal',
                    header: {
                        annotation: { content: 'ONLINE PURCHASE STATUS', style: { fill: '#111111' } },
                        height: 50, style: { fontSize: 11 },
                    },
                    lanes: [
                        {
                            id: 'stackCanvas1',
                            header: {
                                annotation: { content: 'CUSTOMER' }, width: 50,
                                style: { fontSize: 11 }
                            },
                            height: 100,
                            canMove: false,
                            children: [
                                {
                                    id: 'Order',
                                    annotations: [
                                        {
                                            content: 'ORDER',
                                            style: { fontSize: 11 }
                                        }
                                    ],
                                    margin: { left: 60, top: 20 },
                                    height: 40, width: 100
                                },
                                {
                                    id: 'selectItemaddcart',
                                    annotations: [{ content: 'Select item\nAdd cart' }],
                                    margin: { left: 190, top: 20 },
                                    height: 40, width: 100
                                },
                            ],
                        },
                        {
                            id: 'stackCanvas2',
                            header: {
                                annotation: { content: 'CUSTOMER-2' }, width: 50,
                                style: { fontSize: 11 }
                            },
                            height: 100,
                            children: [
                                {
                                    id: 'node1',
                                    annotations: [
                                        {
                                            content: 'Node',
                                            style: { fontSize: 11 }
                                        }
                                    ],
                                    margin: { left: 60, top: 20 },
                                    height: 40, width: 100
                                },

                            ],
                        },

                    ],

                },
                offsetX: 420, offsetY: 270,
                height: 100,
                width: 650
            },
        ];
        let connectors: ConnectorModel[] = [
            {
                id: 'connector1', sourceID: 'Order',
                targetID: 'selectItemaddcart'
            },

        ];
        diagram = new Diagram({
            width: 800, height: 800, nodes: nodes,
            connectors: connectors
        });
        diagram.appendTo('#diagramlane');

    });
    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });
    it('Check whether swimlane is resized properly or not ', (done: Function) => {
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.clickEvent(diagramCanvas, 200 + diagram.element.offsetLeft, 300 + diagram.element.offsetTop);
        let x = diagram.selectedItems.wrapper.bounds.x + diagram.selectedItems.wrapper.bounds.width / 2 + diagram.element.offsetLeft;
        let y = diagram.selectedItems.wrapper.bounds.y + diagram.selectedItems.wrapper.bounds.height + diagram.element.offsetTop;
        mouseEvents.mouseMoveEvent(diagramCanvas, x, y);
        mouseEvents.mouseDownEvent(diagramCanvas, 200 + diagram.element.offsetLeft, y);
        mouseEvents.mouseMoveEvent(diagramCanvas, 200 + diagram.element.offsetLeft, y + 50);
        mouseEvents.mouseUpEvent(diagramCanvas, 200 + diagram.element.offsetLeft, y + 50);
        console.log(diagram.selectedItems.nodes[0].wrapper.height);
        expect(diagram.selectedItems.nodes[0].wrapper.height != 100).toBe(true);
        done();
    });
})

describe('Node Selection Functionality', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let scroller: DiagramScroller;
    let mouseEvents: MouseEvents = new MouseEvents();
    beforeAll((): void => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }

        ele = createElement('div', { id: 'diagramlane' });
        document.body.appendChild(ele);
        let nodes: NodeModel[] = [
            {
                id: 'node1', height: 75, width: 75, offsetX: 200, offsetY: 100,
            },
            {
                id: 'node2', height: 75, width: 75, offsetX: 350, offsetY: 100,
            },
            {
                id: 'swimlane',
                shape: {
                    type: 'SwimLane',
                    orientation: 'Horizontal',
                    header: {
                        annotation: { content: 'ONLINE PURCHASE STATUS' },
                        height: 50, style: { fontSize: 11 },
                    },
                    lanes: [
                        {
                            id: 'stackCanvas1',
                            header: {
                                annotation: { content: 'CUSTOMER' }, width: 50,
                                style: { fontSize: 11 }
                            },
                            height: 100
                        },
                    ],
                },
                offsetX: 420, offsetY: 270,
                height: 100,
                width: 650
            },
        ];
        diagram = new Diagram({
            width: 1000, height: 800, nodes: nodes
        });
        diagram.appendTo('#diagramlane');

    });
    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });
    it('Check whether node is select properly or not', (done: Function) => {
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.clickEvent(diagramCanvas, 200, 100);
        mouseEvents.mouseDownEvent(diagramCanvas, 200, 100);
        mouseEvents.mouseMoveEvent(diagramCanvas, 300, 300);
        mouseEvents.mouseUpEvent(diagramCanvas, 300, 300);
        mouseEvents.mouseUpEvent(diagramCanvas, 300, 300);
        mouseEvents.dragAndDropEvent(diagramCanvas, 350, 100, 350, 200);
        diagram.clearSelection();
        mouseEvents.clickEvent(diagramCanvas, 350, 200);
        expect(diagram.selectedItems.nodes[0].id === 'node2').toBe(true);
        done();
    });
})

describe('Swimlane child disappears', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let scroller: DiagramScroller;
    let mouseEvents: MouseEvents = new MouseEvents();
    beforeAll((): void => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }

        ele = createElement('div', { id: 'diagramlane' });
        document.body.appendChild(ele);
        let nodes: NodeModel[] = [
            {
                id: 'nodes', height: 100, width: 100, offsetX: 200, offsetY: 200
            },
            {
                id: 'swimlane',
                shape: {
                    type: 'SwimLane',
                    orientation: 'Horizontal',
                    header: {
                        annotation: { content: 'ONLINE PURCHASE STATUS' },
                        height: 50, style: { fontSize: 11 },
                    },
                    lanes: [
                        {
                            id: 'stackCanvas1',
                            header: {
                                annotation: { content: 'CUSTOMER' }, width: 50,
                                style: { fontSize: 11 }
                            },
                            height: 100
                        },

                    ],

                },
                offsetX: 420, offsetY: 270,
                height: 100,
                width: 650
            },
        ];
        diagram = new Diagram({
            width: 800, height: 800, nodes: nodes
        });
        diagram.appendTo('#diagramlane');

    });
    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });
    it('Send swimlane back and check z index', (done: Function) => {
        diagram.select([diagram.nodes[1]]);
        let zIndex: number = diagram.nodes[1].zIndex;
        diagram.sendToBack();
        diagram.clearSelection();
        expect(diagram.nodes[1].zIndex !== zIndex).toBe(true);
        done();
    });
    it('Send swimlane front and check z index', (done: Function) => {
        diagram.select([diagram.nodes[1]]);
        let zIndex: number = diagram.nodes[1].zIndex;
        diagram.bringToFront();
        diagram.clearSelection();
        expect(diagram.nodes[1].zIndex !== zIndex).toBe(true);
        done();
    });
})

describe('Group Node - SendToBack & BringToFront', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let scroller: DiagramScroller;
    let mouseEvents: MouseEvents = new MouseEvents();
    beforeAll((): void => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }

        ele = createElement('div', { id: 'diagramlane' });
        document.body.appendChild(ele);
        let nodes: NodeModel[] = [
            {
                id: 'node2', width: 200, height: 50, offsetX: 300, offsetY: 100, style: { fill: 'red' },
                annotations: [{ content: 'node2' }],
            },
            {
                id: 'node3', width: 250, height: 150, offsetX: 300, offsetY: 200, style: { fill: 'blue' },
                annotations: [{ content: 'node3' }]
            },
            { id: 'group1', children: ['node2', 'node3'], },
            {
                id: 'node1', width: 100, height: 100, offsetX: 300, offsetY: 200, style: { fill: 'yellow' },
                annotations: [{ content: 'node1' }],
            }
        ];
        diagram = new Diagram({
            width: 800, height: 800, nodes: nodes
        });
        diagram.appendTo('#diagramlane');
    });
    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });
    it('Send group node front and check z index', (done: Function) => {
        diagram.select([diagram.getObject('group1')]);
        diagram.bringToFront();
        expect(diagram.selectedItems.nodes[0].zIndex === 3).toBe(true);
        done();
    });
    it('Send group back and check z index', (done: Function) => {
        diagram.select([diagram.getObject('group1')]);
        diagram.sendToBack();
        expect(diagram.selectedItems.nodes[0].zIndex === 0).toBe(true);
        done();
    });
})

describe('Child Node - Backward & Forward', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let scroller: DiagramScroller;
    let mouseEvents: MouseEvents = new MouseEvents();
    beforeAll((): void => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }

        ele = createElement('div', { id: 'diagramlane' });
        document.body.appendChild(ele);
        let nodes: NodeModel[] = [
            {
                id: 'node2', width: 200, height: 50, offsetX: 300, offsetY: 100, style: { fill: 'red' },
                annotations: [{ content: 'node2' }],
            },
            {
                id: 'node3', width: 250, height: 150, offsetX: 300, offsetY: 200, style: { fill: 'blue' },
                annotations: [{ content: 'node3' }]
            },
            { id: 'group1', children: ['node2', 'node3'], },
            {
                id: 'node1', width: 100, height: 100, offsetX: 300, offsetY: 200, style: { fill: 'yellow' },
                annotations: [{ content: 'node1' }],
            }
        ];
        diagram = new Diagram({
            width: 800, height: 800, nodes: nodes
        });
        diagram.appendTo('#diagramlane');
    });
    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });
    it('Send group node front and check z index', (done: Function) => {
        diagram.select([diagram.getObject('node1')]);
        diagram.sendBackward();
        expect(diagram.selectedItems.nodes[0].zIndex === 2).toBe(true);
        done();
    });
    it('Send group back and check z index', (done: Function) => {
        diagram.select([diagram.getObject('node1')]);
        diagram.moveForward();
        expect(diagram.selectedItems.nodes[0].zIndex === 3).toBe(true);
        done();
    });
})

describe('Swimlane - Z order commands', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let scroller: DiagramScroller;
    let mouseEvents: MouseEvents = new MouseEvents();
    beforeAll((): void => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }

        ele = createElement('div', { id: 'diagramlane' });
        document.body.appendChild(ele);
        let nodes: NodeModel[] = [
            {
                id: 'node1', height: 100, width: 100, offsetX: 200, offsetY: 200,
            },
            {
                id: 'node2', height: 100, width: 100, offsetX: 350, offsetY: 200,
            },
            {
                id: 'swimlane',
                shape: {
                    type: 'SwimLane',
                    orientation: 'Horizontal',
                    header: {
                        annotation: { content: 'ONLINE PURCHASE STATUS' },
                        height: 50, style: { fontSize: 11 },
                    },
                    lanes: [
                        {
                            id: 'stackCanvas1',
                            header: {
                                annotation: { content: 'CUSTOMER' }, width: 50,
                                style: { fontSize: 11 }
                            },
                            height: 100
                        },

                    ],

                },
                offsetX: 420, offsetY: 270,
                height: 100,
                width: 650
            },


        ];
        diagram = new Diagram({
            width: 800, height: 800, nodes: nodes
        });
        diagram.appendTo('#diagramlane');

    });
    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });
    it('Send Swimlane backward - Send to back command', (done: Function) => {
        let node: NodeModel = diagram.getObject('swimlane');
        diagram.select([node]);
        diagram.sendToBack();
        diagram.clearSelection();
        expect(node.zIndex === 3).toBe(true);
        done();
    });
    it('Bring Swimlane to front - Bring to front Command', (done: Function) => {
        let node: NodeModel = diagram.getObject('swimlane');
        diagram.select([node]);
        diagram.bringToFront();
        diagram.clearSelection();
        expect(node.zIndex === 5).toBe(true);
        done();
    });
})

describe('Swimlane & Child - Send to back command', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let scroller: DiagramScroller;
    let mouseEvents: MouseEvents = new MouseEvents();
    beforeAll((): void => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }

        ele = createElement('div', { id: 'diagramorder' });
        document.body.appendChild(ele);
        let nodes: NodeModel[] = [
            {
                id: 'node1', height: 100, width: 100, offsetX: 200, offsetY: 200,
            },
            {
                id: 'node2', height: 100, width: 100, offsetX: 350, offsetY: 200,
            },
            {
                id: 'swimlane',
                shape: {
                    type: 'SwimLane',
                    orientation: 'Horizontal',
                    header: {
                        annotation: { content: 'ONLINE PURCHASE STATUS' },
                        height: 50, style: { fontSize: 11 },
                    },
                    lanes: [
                        {
                            id: 'stackCanvas1',
                            header: {
                                annotation: { content: 'CUSTOMER' }, width: 50,
                                style: { fontSize: 11 }
                            },
                            height: 100
                        },

                    ],

                },
                offsetX: 420, offsetY: 270,
                height: 100,
                width: 650
            },


        ];
        diagram = new Diagram({
            width: 800, height: 800, nodes: nodes
        });
        diagram.appendTo('#diagramorder');

    });
    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });
    it('Send child backward to swimlane', (done: Function) => {
        let node: NodeModel = diagram.getObject('swimlane');
        diagram.select([node]);
        diagram.sendToBack();
        diagram.clearSelection();
        let node2: NodeModel = diagram.getObject('node1');
        diagram.select([node2]);
        diagram.sendToBack();
        diagram.clearSelection();
        expect(node.zIndex === 4).toBe(true);
        done();
    });
    it('Send Swimlane backward to all child', (done: Function) => {
        let node: NodeModel = diagram.getObject('swimlane');
        diagram.select([node]);
        diagram.sendToBack();
        diagram.clearSelection();
        expect(node.zIndex === 3).toBe(true);
        done();
    });
})

describe('Swimlane & Child - Bring to Front command', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let scroller: DiagramScroller;
    let mouseEvents: MouseEvents = new MouseEvents();
    beforeAll((): void => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }

        ele = createElement('div', { id: 'diagramorder2' });
        document.body.appendChild(ele);
        let nodes: NodeModel[] = [
            {
                id: 'swimlane',
                shape: {
                    type: 'SwimLane',
                    orientation: 'Horizontal',
                    header: {
                        annotation: { content: 'ONLINE PURCHASE STATUS' },
                        height: 50, style: { fontSize: 11 },
                    },
                    lanes: [
                        {
                            id: 'stackCanvas1',
                            header: {
                                annotation: { content: 'CUSTOMER' }, width: 50,
                                style: { fontSize: 11 }
                            },
                            height: 100
                        },

                    ],

                },
                offsetX: 420, offsetY: 270,
                height: 100,
                width: 650
            },


        ];
        diagram = new Diagram({
            width: 800, height: 800, nodes: nodes
        });
        diagram.appendTo('#diagramorder2');

    });
    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });
    it('Bring child Front to swimlane', (done: Function) => {
        let newnode: NodeModel = {
            id: 'node1', height: 100, width: 100, offsetX: 200, offsetY: 200,
        };
        diagram.add(newnode);
        let newNode2: NodeModel = {
            id: 'node2', height: 100, width: 100, offsetX: 350, offsetY: 200,
        };
        diagram.add(newNode2);
        let node: NodeModel = diagram.getObject('swimlane');
        diagram.select([node]);
        diagram.bringToFront();
        diagram.clearSelection();
        let node2: NodeModel = diagram.getObject('node1');
        diagram.select([node2]);
        diagram.bringToFront();
        diagram.clearSelection();
        expect(node.zIndex === 4).toBe(true);
        done();
    });
    it('Bring Swimlane Front to all child', (done: Function) => {
        let node: NodeModel = diagram.getObject('swimlane');
        diagram.select([node]);
        diagram.bringToFront();
        diagram.clearSelection();
        expect(node.zIndex === 5).toBe(true);
        done();
    });
})

describe('Swimlane Order commands - Undo & Redo', () => {
    let diagram: Diagram;
    let zIndex: number = 0;
    let ele: HTMLElement;
    let scroller: DiagramScroller;
    let mouseEvents: MouseEvents = new MouseEvents();
    beforeAll((): void => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }

        ele = createElement('div', { id: 'diagramorder2' });
        document.body.appendChild(ele);
        let nodes: NodeModel[] = [
            {
                id: 'node1', height: 100, width: 100, offsetX: 200, offsetY: 200,
            },
            {
                id: 'node2', height: 100, width: 100, offsetX: 350, offsetY: 200,
            },
            {
                id: 'swimlane',
                shape: {
                    type: 'SwimLane',
                    orientation: 'Horizontal',
                    header: {
                        annotation: { content: 'ONLINE PURCHASE STATUS' },
                        height: 50, style: { fontSize: 11 },
                    },
                    lanes: [
                        {
                            id: 'stackCanvas1',
                            header: {
                                annotation: { content: 'Lane 1' }, width: 50,
                                style: { fontSize: 11 }
                            },
                            height: 150
                        },
                        {
                            id: 'stackCanvas2',
                            header: {
                                annotation: { content: 'Lane 2' }, width: 50,
                                style: { fontSize: 11 }
                            },
                            height: 150
                        },

                    ],

                },
                offsetX: 420, offsetY: 270,
                height: 100,
                width: 650
            },


        ];
        diagram = new Diagram({
            width: 800, height: 800, nodes: nodes
        });
        diagram.appendTo('#diagramorder2');

    });
    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });
    it('Diagram Save and load operaion', (done: Function) => {
        let node: NodeModel = diagram.getObject('swimlane');
        diagram.select([node]);
        diagram.sendToBack();
        zIndex = node.zIndex;
        let save: string = diagram.saveDiagram();
        diagram.loadDiagram(save);
        expect(node.zIndex === zIndex).toBe(true);
        done();
    });
    it('Diagram order commands after save and load', (done: Function) => {
        let node: NodeModel = diagram.getObject('swimlane');
        diagram.select([node]);
        zIndex = node.zIndex;
        diagram.bringToFront();
        expect(node.zIndex !== zIndex).toBe(true);
        done();
    });
})

describe('Swimlane Order commands - Undo & Redo', () => {
    let diagram: Diagram;
    let zIndex: number = 0;
    let ele: HTMLElement;
    let scroller: DiagramScroller;
    let mouseEvents: MouseEvents = new MouseEvents();
    beforeAll((): void => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }

        ele = createElement('div', { id: 'diagramorder2' });
        document.body.appendChild(ele);
        let nodes: NodeModel[] = [
            {
                id: 'node1', height: 100, width: 100, offsetX: 200, offsetY: 200,
            },
            {
                id: 'node2', height: 100, width: 100, offsetX: 350, offsetY: 200,
            },
            {
                id: 'swimlane',
                shape: {
                    type: 'SwimLane',
                    orientation: 'Horizontal',
                    header: {
                        annotation: { content: 'ONLINE PURCHASE STATUS' },
                        height: 50, style: { fontSize: 11 },
                    },
                    lanes: [
                        {
                            id: 'stackCanvas1',
                            header: {
                                annotation: { content: 'Lane 1' }, width: 50,
                                style: { fontSize: 11 }
                            },
                            height: 150
                        },
                        {
                            id: 'stackCanvas2',
                            header: {
                                annotation: { content: 'Lane 2' }, width: 50,
                                style: { fontSize: 11 }
                            },
                            height: 150
                        },

                    ],

                },
                offsetX: 420, offsetY: 270,
                height: 100,
                width: 650
            },


        ];
        diagram = new Diagram({
            width: 800, height: 800, nodes: nodes
        });
        diagram.appendTo('#diagramorder2');

    });
    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });
    it('Diagram Undo operation for Send to back order command', (done: Function) => {
        let node: NodeModel = diagram.getObject('swimlane');
        diagram.select([node]);
        diagram.sendToBack();
        zIndex = node.zIndex;
        diagram.undo();
        expect(node.zIndex !== zIndex).toBe(true);
        done();
    });
    it('Diagram Redo operation for Send to back order command', (done: Function) => {
        let node: NodeModel = diagram.getObject('swimlane');
        diagram.redo();
        expect(node.zIndex === zIndex).toBe(true);
        done();
    });
})

describe('Swimlane & Child - Bring to Front command - undo', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let zIndex: number = 0;
    let scroller: DiagramScroller;
    let mouseEvents: MouseEvents = new MouseEvents();
    beforeAll((): void => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }

        ele = createElement('div', { id: 'diagramorder2' });
        document.body.appendChild(ele);
        let nodes: NodeModel[] = [
            {
                id: 'swimlane',
                shape: {
                    type: 'SwimLane',
                    orientation: 'Horizontal',
                    header: {
                        annotation: { content: 'ONLINE PURCHASE STATUS' },
                        height: 50, style: { fontSize: 11 },
                    },
                    lanes: [
                        {
                            id: 'stackCanvas1',
                            header: {
                                annotation: { content: 'CUSTOMER' }, width: 50,
                                style: { fontSize: 11 }
                            },
                            height: 100
                        },

                    ],

                },
                offsetX: 420, offsetY: 270,
                height: 100,
                width: 650
            },


        ];
        diagram = new Diagram({
            width: 800, height: 800, nodes: nodes
        });
        diagram.appendTo('#diagramorder2');

    });
    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });
    it('Bring child Front to swimlane', (done: Function) => {
        let newnode: NodeModel = {
            id: 'node1', height: 100, width: 100, offsetX: 200, offsetY: 200,
        };
        diagram.add(newnode);
        let newNode2: NodeModel = {
            id: 'node2', height: 100, width: 100, offsetX: 350, offsetY: 200,
        };
        diagram.add(newNode2);
        let node: NodeModel = diagram.getObject('swimlane');
        diagram.select([node]);
        diagram.bringToFront();
        zIndex = node.zIndex;
        diagram.clearSelection();
        diagram.undo();
        expect(node.zIndex !== zIndex).toBe(true);
        done();
    });
    it('Bring Swimlane Front to all child', (done: Function) => {
        let node: NodeModel = diagram.getObject('swimlane');
        diagram.redo();
        expect(node.zIndex === zIndex).toBe(true);
        done();
    });
})

describe('Connector Segment -Rotate', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let zIndex: number = 0;
    let scroller: DiagramScroller;
    let mouseEvents: MouseEvents = new MouseEvents();
    beforeAll((): void => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }

        ele = createElement('div', { id: 'diagramorder2' });
        document.body.appendChild(ele);
        let connectors: ConnectorModel[] = [
            {
                id: 'connector1',
                type: 'Orthogonal',
                sourcePoint: { x: 300, y: 100 },
                targetPoint: { x: 400, y: 200 },
            },
            {
                id: 'connector10', sourcePoint: { x: 400, y: 100 },
                targetPoint: { x: 500, y: 200 }, type: 'Orthogonal',
                segments: [{ type: 'Orthogonal', length: 100, direction: 'Right' }, { type: 'Orthogonal', length: 100, direction: 'Top' }]
            },
        ];
        diagram = new Diagram({
            width: '1000px',
            height: '800px',
            connectors: connectors,
        });
        diagram.appendTo('#diagramorder2');

    });
    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });
    it('Rotate the connectors and check rotate angle', (done: Function) => {
        diagram.selectAll();
        diagram.rotate(diagram.selectedItems, 300);
        expect(diagram.selectedItems.rotateAngle === 300).toBe(true);
        done();
    });
    it('Rotate the connector with segment and check points', (done: Function) => {
        diagram.selectAll();
        diagram.rotate(diagram.selectedItems, 300);
        expect(diagram.connectors[1].sourcePoint.x > 355 && diagram.connectors[1].sourcePoint.y > 174 &&
            diagram.connectors[1].targetPoint.x > 392 && diagram.connectors[1].targetPoint.y > 37).toBe(true);
        done();
    });
})

describe('Multiple Connector Rotate Issue', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let zIndex: number = 0;
    let scroller: DiagramScroller;
    let mouseEvents: MouseEvents = new MouseEvents();
    beforeAll((): void => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }

        ele = createElement('div', { id: 'diagramorder2' });
        document.body.appendChild(ele);
        let connectors: ConnectorModel[] = [
            {
                id: 'connector1',
                type: 'Straight',
                sourcePoint: { x: 250, y: 150 },
                targetPoint: { x: 150, y: 200 },
            },
            {
                id: 'connector10', sourcePoint: { x: 200, y: 100 },
                targetPoint: { x: 400, y: 200 },
                segments: [{ type: 'Straight' }]
            },
        ];
        diagram = new Diagram({
            width: '750px',
            height: '800px',
            connectors: connectors,
        });
        diagram.appendTo('#diagramorder2');

    });
    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });
    it('Rotate the multiple connectors and check rotate angle', (done: Function) => {
        diagram.selectAll();
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        let bounds: Rect = diagram.selectedItems.wrapper.bounds;
        let rotator: PointModel = { x: bounds.center.x, y: bounds.y - 30 };
        let matrix: Matrix = identityMatrix();
        rotateMatrix(matrix, 320, bounds.center.x, bounds.center.y);
        let endPoint: PointModel = transformPointByMatrix(matrix, rotator);
        mouseEvents.dragAndDropEvent(diagramCanvas, rotator.x + 8, rotator.y + 8, endPoint.x + 8, endPoint.y + 8);
        console.log("Rotate Angle: " + diagram.selectedItems.rotateAngle);
        expect(Math.floor(diagram.selectedItems.rotateAngle) === 316 || Math.floor(diagram.selectedItems.rotateAngle) === 320 || Math.floor(diagram.selectedItems.rotateAngle) === 315).toBe(true);
        done();
    });
    it('Scale the connector and check selector offset', (done: Function) => {
        diagram.scale(diagram.selectedItems, 1.2, 1, { x: 0.5, y: 0.5 });
        expect(diagram.selectedItems.offsetX === 275 && diagram.selectedItems.offsetY === 150).toBe(true);
        done();
    });
})

describe('Connector Annotation Displacement issue', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let zIndex: number = 0;
    let scroller: DiagramScroller;
    let mouseEvents: MouseEvents = new MouseEvents();
    beforeAll((): void => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }

        ele = createElement('div', { id: 'diagramorder2' });
        document.body.appendChild(ele);
        let connector: ConnectorModel = {
            id: 'connector1', sourcePoint: { x: 300, y: 400 }, targetPoint: { x: 500, y: 500 },
            annotations: [{ content: 'Connector', horizontalAlignment: 'Left', displacement: { x: 10, y: 10 } }]
        };
        diagram = new Diagram({
            width: '750px',
            height: '800px',
            connectors: [connector],
        });
        diagram.appendTo('#diagramorder2');

    });
    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });
    it('Change the connector displacement to 50', (done: Function) => {
        diagram.connectors[0].annotations[0].displacement = { x: 50, y: 20 };
        diagram.dataBind();
        expect(diagram.connectors[0].annotations[0].displacement.x === 50).toBe(true);
        done();
    });

})

describe('Multiple Select Tool Issue', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let zIndex: number = 0;
    let scroller: DiagramScroller;
    let mouseEvents: MouseEvents = new MouseEvents();
    beforeAll((): void => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }

        ele = createElement('div', { id: 'diagramorder2' });
        document.body.appendChild(ele);
        let nodes: NodeModel[] = [
            { id: 'node', offsetX: 100, offsetY: 100, height: 100, width: 100, },
            { id: 'node2', offsetX: 400, offsetY: 100, height: 100, width: 100 }
        ];
        diagram = new Diagram({
            width: '750px',
            height: '800px',
            nodes: nodes,
            tool: DiagramTools.MultipleSelect | DiagramTools.ZoomPan
        });
        diagram.appendTo('#diagramorder2');

    });
    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });
    it('Single select the node and check selected items length', (done: Function) => {
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.clickEvent(diagramCanvas, 100, 100);
        expect(diagram.selectedItems.nodes.length === 1).toBe(true);
        done();
    });
    it('Multiselect the node and check selected items length', (done: Function) => {
        diagram.clearSelection();
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.clickEvent(diagramCanvas, 100, 100);
        mouseEvents.clickEvent(diagramCanvas, 400, 100, true);
        expect(diagram.selectedItems.nodes.length === 2).toBe(true);
        done();
    });
})

describe('Bezier annotation bounds Issue', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let zIndex: number = 0;
    let scroller: DiagramScroller;
    let mouseEvents: MouseEvents = new MouseEvents();
    beforeAll((): void => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }

        ele = createElement('div', { id: 'diagramorder2' });
        document.body.appendChild(ele);
        let nodes: NodeModel[] = [
            {
                id: 'node1', width: 100, height: 100, offsetX: 500, offsetY: 200, annotations: [{ content: 'Node1' }]
            },
            {
                id: 'node2', width: 100, height: 100, offsetX: 300, offsetY: 500, annotations: [{ content: 'Node1' }]
            }
        ];
        let connectors: ConnectorModel[] = [

            {
                id: 'connector1', type: 'Bezier',
                segments: [{
                    type: 'Bezier',
                    vector1: { angle: 180, distance: 350 },
                    vector2: { angle: 180, distance: 300 },
                },],
                sourceID: 'node1',
                targetID: 'node2',
                annotations: [{ content: 'Segment' }]

            },

        ];
        diagram = new Diagram({
            width: '750px',
            height: '800px',
            nodes: nodes,
            connectors: connectors
        });
        diagram.appendTo('#diagramorder2');

    });
    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });
    it('Check the annotation bounds', (done: Function) => {
        expect(Math.floor(diagram.connectors[0].wrapper.children[3].bounds.x) === 102 && Math.floor(diagram.connectors[0].wrapper.children[3].bounds.y) === 345).toBe(true);
        done();
    });
    it('Drag the node and check the bounds', (done: Function) => {
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.clickEvent(diagramCanvas, 500, 200);
        mouseEvents.dragAndDropEvent(diagramCanvas, 500, 200, 650, 250);
        mouseEvents.clickEvent(diagramCanvas, 300, 500);
        mouseEvents.dragAndDropEvent(diagramCanvas, 300, 500, 400, 600);
        expect(Math.floor(diagram.connectors[0].wrapper.children[3].bounds.x) === 232 || Math.floor(diagram.connectors[0].wrapper.children[3].bounds.x) === 227).toBe(true);
        expect(Math.floor(diagram.connectors[0].wrapper.children[3].bounds.y) === 420 || Math.floor(diagram.connectors[0].wrapper.children[3].bounds.y) === 425).toBe(true);
        done();
    });
})

describe('Multi-Connector drawing issue', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let zIndex: number = 0;
    let scroller: DiagramScroller;
    let mouseEvents: MouseEvents = new MouseEvents();
    beforeAll((): void => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }

        ele = createElement('div', { id: 'diagramorder2' });
        document.body.appendChild(ele);

        diagram = new Diagram({
            width: '1000px', height: '500px',
        });
        diagram.appendTo('#diagramorder2');

    });
    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });

    it('Draw the connector and click right click event', (done: Function) => {
        let drawingshape: NodeModel | ConnectorModel;
        drawingshape = {
            type: 'Straight'
        }
        diagram.drawingObject = drawingshape;
        diagram.tool |= DiagramTools.ContinuousDraw;
        let mouseEvents: MouseEvents = new MouseEvents();
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.mouseDownEvent(diagramCanvas, 150, 150);
        mouseEvents.mouseMoveEvent(diagramCanvas, 250, 400);
        mouseEvents.rightClickEvent(diagramCanvas, 250, 400);
        expect(Object.keys(diagram.nameTable).length).toBe(1);
        done();
    });
})

describe('Selection not update properly for group issue', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let zIndex: number = 0;
    let scroller: DiagramScroller;
    let mouseEvents: MouseEvents = new MouseEvents();
    beforeAll((): void => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }

        ele = createElement('div', { id: 'diagramorder2' });
        document.body.appendChild(ele);

        let nodes: NodeModel[] = [
            {
                id: 'node1', width: 100, height: 100, offsetX: 100,
                offsetY: 100,
            }, {
                id: 'node2', width: 100, height: 100, offsetX: 300,
                offsetY: 300
            },

            { id: 'group', children: ['node1', 'node2'] },

        ];
        diagram = new Diagram({
            width: '1000px', height: '500px', nodes: nodes

        });
        diagram.appendTo('#diagramorder2');

    });
    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });

    it('Drag the group node to negative axis and check selection', (done: Function) => {
        let mouseEvents: MouseEvents = new MouseEvents();
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.mouseDownEvent(diagramCanvas, 200, 200);
        mouseEvents.mouseMoveEvent(diagramCanvas, -300, -300);
        mouseEvents.mouseUpEvent(diagramCanvas, -300, -300);
        mouseEvents.clickEvent(diagramCanvas, -100, -100);
        mouseEvents.clickEvent(diagramCanvas, -300, -300);
        expect(diagram.selectedItems.nodes.length).toBe(1);
        done();
    });
})

describe('Property Change Event Args - Issue', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let zIndex: number = 0;
    let scroller: DiagramScroller;
    let mouseEvents: MouseEvents = new MouseEvents();
    beforeAll((): void => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }

        ele = createElement('div', { id: 'diagramorder2' });
        document.body.appendChild(ele);

        let connector: ConnectorModel = {
            id: 'connector1', sourcePoint: { x: 100, y: 100 }, targetPoint: { x: 300, y: 300 }, annotations: [{ content: 'Connector' }]
        };
        diagram = new Diagram({
            width: '1000px', height: '500px', connectors: [connector]

        });
        diagram.appendTo('#diagramorder2');

    });
    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });

    it('Drag the connector target end and check event argument', (done: Function) => {
        let mouseEvents: MouseEvents = new MouseEvents();
        diagram.propertyChange = (args: IPropertyChangeEventArgs) => {
            let newValue = args.newValue as ConnectorModel;
            let oldValue = args.oldValue as ConnectorModel;
            if (oldValue.targetPoint) {
                expect(oldValue.targetPoint.x).toBe(300);
                expect(oldValue.targetPoint.y).toBe(300);
                expect(newValue.targetPoint.x).toBe(300);
                expect(newValue.targetPoint.y === 320 || newValue.targetPoint.y === 330 ).toBe(true);
                done();
            }
        };
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        diagram.select([diagram.connectors[0]]);
        let resizeOptions: HTMLElement = document.getElementById('connectorTargetThumb');
        let bounds: any = resizeOptions.getBoundingClientRect();
        let x: number = bounds.x;
        let y: number = bounds.y;
        mouseEvents.mouseDownEvent(diagramCanvas, x, y);
        mouseEvents.mouseMoveEvent(diagramCanvas, x, y + 30);
        mouseEvents.mouseUpEvent(diagramCanvas, x, y + 30);

    });
})

describe('Bezier connector annotation does not render properly in canvas issue', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let zIndex: number = 0;
    let scroller: DiagramScroller;
    let mouseEvents: MouseEvents = new MouseEvents();
    beforeAll((): void => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }

        ele = createElement('div', { id: 'diagramorder2' });
        document.body.appendChild(ele);

        let connector: ConnectorModel = {
            id: 'connector1', sourcePoint: { x: 100, y: 100 }, targetPoint: { x: 300, y: 300 }, annotations: [{ content: 'Connector' }]
        };
        diagram = new Diagram({
            width: '1000px', height: '500px', connectors: [connector]

        });
        diagram.appendTo('#diagramorder2');

    });
    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });

    it('Load the customer JSON and check whether connector get exported properly', (done: Function) => {
          var data: any = { "enableRtl": false, "locale": "lang", "animationComplete": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "__isAsync": false }, "click": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "__isAsync": false }, "collectionChange": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "__isAsync": false }, "commandExecute": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "__isAsync": false }, "connectionChange": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "__isAsync": false }, "contextMenuBeforeItemRender": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "__isAsync": false }, "contextMenuClick": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "__isAsync": false }, "contextMenuOpen": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "__isAsync": false }, "created": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "__isAsync": false }, "dataLoaded": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "__isAsync": false }, "doubleClick": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "__isAsync": false }, "dragEnter": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "__isAsync": false }, "dragLeave": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "__isAsync": false }, "dragOver": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "__isAsync": false }, "drop": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "__isAsync": false }, "expandStateChange": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "__isAsync": false }, "fixedUserHandleClick": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "__isAsync": false }, "historyChange": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "__isAsync": false }, "historyStateChange": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "__isAsync": false }, "keyDown": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "__isAsync": false }, "keyUp": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "__isAsync": false }, "mouseEnter": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "__isAsync": false }, "mouseLeave": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "__isAsync": false }, "mouseOver": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "__isAsync": false }, "onImageLoad": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "__isAsync": false }, "onUserHandleMouseDown": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "__isAsync": false }, "onUserHandleMouseEnter": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "__isAsync": false }, "onUserHandleMouseLeave": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "__isAsync": false }, "onUserHandleMouseUp": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "__isAsync": false }, "positionChange": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "__isAsync": false }, "propertyChange": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "__isAsync": false }, "rotateChange": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "__isAsync": false }, "scrollChange": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "__isAsync": false }, "segmentCollectionChange": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "__isAsync": false }, "selectionChange": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "__isAsync": false }, "sizeChange": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "__isAsync": false }, "sourcePointChange": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "__isAsync": false }, "targetPointChange": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "__isAsync": false }, "textEdit": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "__isAsync": false }, "contextMenuSettings": { "show": true, "items": [{ "text": "Duplicar", "id": "duplicate" }] }, "pageSettings": { "orientation": "Landscape", "width": 1122, "height": 793, "showPageBreaks": true, "background": { "source": "", "color": "rgba(255,255,255,1)" }, "fitOptions": { "canFit": false }, "boundaryConstraints": "Infinity", "multiplePage": true, "margin": { "left": 0, "right": 0, "top": 0, "bottom": 0 } }, "selectedItems": { "nodes": [], "connectors": [], "wrapper": null, "constraints": 16382, "userHandles": [], "rotateAngle": 0, "pivot": { "x": 0.5, "y": 0.5 }, "width": 140, "height": 75, "offsetX": 871.24, "offsetY": 322.5, "rubberBandSelectionMode": "CompleteIntersect" }, "enablePersistence": false, "scrollSettings": { "viewPortWidth": 2049.666748046875, "viewPortHeight": 860, "currentZoom": 1.2959999999999998, "horizontalOffset": 0.9119999999998072, "verticalOffset": -143.2, "padding": { "left": 50, "right": 50, "top": 50, "bottom": 50 }, "scrollLimit": "Infinity", "canAutoScroll": false, "minZoom": 0.2, "maxZoom": 30 }, "rulerSettings": { "showRulers": false, "horizontalRuler": { "orientation": "Horizontal", "arrangeTick": null }, "verticalRuler": { "orientation": "Vertical", "arrangeTick": null } }, "width": "100%", "height": "100%", "backgroundColor": "transparent", "constraints": 500, "layout": { "type": "None", "enableAnimation": true, "connectionPointOrigin": "SamePoint", "arrangement": "Nonlinear", "enableRouting": false }, "snapSettings": { "constraints": 31, "gridType": "Lines", "verticalGridlines": { "lineIntervals": [1.25, 18.75, 0.25, 19.75, 0.25, 19.75, 0.25, 19.75, 0.25, 19.75], "snapIntervals": [20], "lineDashArray": "", "lineColor": "lightgray" }, "horizontalGridlines": { "lineIntervals": [1.25, 18.75, 0.25, 19.75, 0.25, 19.75, 0.25, 19.75, 0.25, 19.75], "snapIntervals": [20], "lineDashArray": "", "lineColor": "lightgray" }, "snapObjectDistance": 5, "snapAngle": 5 }, "dataSourceSettings": { "dataManager": null, "dataSource": null, "crudAction": { "read": "" }, "connectionDataSource": { "crudAction": { "read": "" } } }, "mode": "Canvas", "layers": [{ "objects": ["ComeçarP71cf", "TarefagGcIx", "DecisãoIbNTy", "TarefaEr0ya", "TarefaAc54U", "FimyMVro", "connectorML4F7", "connectorv65n9", "FunçãoOnphi", "TarefaEr0yamBTRc", "TarefagGcIxTTQBT", "connectorML4F7o1wM2", "Términof7h5v", "Tarefanpywr", "connectorqH7yM", "connectorEFqns", "connectornFfFU", "connectorJDXCK", "connectort3VCU", "connectorlT5vP", "connectorVy5Tw"], "id": "default_layer", "visible": true, "lock": false, "zIndex": 0, "objectZIndex": 68 }], "nodes": [{ "shape": { "type": "Bpmn", "shape": "Event", "event": { "event": "Start", "trigger": "None" }, "annotations": [], "activity": { "subProcess": {} } }, "ports": [{ "inEdges": [], "outEdges": [], "offset": { "x": 0, "y": 0.5 }, "visibility": 12, "constraints": 28, "id": "Bqnax", "height": 12, "width": 12, "shape": "Square", "margin": { "left": 0, "top": 0, "right": 0, "bottom": 0 }, "style": { "fill": "white", "strokeColor": "black", "opacity": 1, "strokeDashArray": "", "strokeWidth": 1 }, "horizontalAlignment": "Center", "verticalAlignment": "Center" }, { "inEdges": [], "outEdges": ["connectorML4F7"], "offset": { "x": 1, "y": 0.5 }, "visibility": 12, "constraints": 28, "id": "lH7Mv", "height": 12, "width": 12, "shape": "Square", "margin": { "left": 0, "top": 0, "right": 0, "bottom": 0 }, "style": { "fill": "white", "strokeColor": "black", "opacity": 1, "strokeDashArray": "", "strokeWidth": 1 }, "horizontalAlignment": "Center", "verticalAlignment": "Center" }, { "inEdges": [], "outEdges": [], "offset": { "x": 0.25, "y": 0 }, "visibility": 12, "constraints": 28, "id": "f8IDR", "height": 12, "width": 12, "shape": "Square", "margin": { "left": 0, "top": 0, "right": 0, "bottom": 0 }, "style": { "fill": "white", "strokeColor": "black", "opacity": 1, "strokeDashArray": "", "strokeWidth": 1 }, "horizontalAlignment": "Center", "verticalAlignment": "Center" }, { "inEdges": [], "outEdges": [], "offset": { "x": 0.75, "y": 0 }, "visibility": 12, "constraints": 28, "id": "MAAFW", "height": 12, "width": 12, "shape": "Square", "margin": { "left": 0, "top": 0, "right": 0, "bottom": 0 }, "style": { "fill": "white", "strokeColor": "black", "opacity": 1, "strokeDashArray": "", "strokeWidth": 1 }, "horizontalAlignment": "Center", "verticalAlignment": "Center" }, { "inEdges": [], "outEdges": [], "offset": { "x": 0.25, "y": 1 }, "visibility": 12, "constraints": 28, "id": "sUOXx", "height": 12, "width": 12, "shape": "Square", "margin": { "left": 0, "top": 0, "right": 0, "bottom": 0 }, "style": { "fill": "white", "strokeColor": "black", "opacity": 1, "strokeDashArray": "", "strokeWidth": 1 }, "horizontalAlignment": "Center", "verticalAlignment": "Center" }, { "inEdges": [], "outEdges": [], "offset": { "x": 0.75, "y": 1 }, "visibility": 12, "constraints": 28, "id": "y6pQn", "height": 12, "width": 12, "shape": "Square", "margin": { "left": 0, "top": 0, "right": 0, "bottom": 0 }, "style": { "fill": "white", "strokeColor": "black", "opacity": 1, "strokeDashArray": "", "strokeWidth": 1 }, "horizontalAlignment": "Center", "verticalAlignment": "Center" }], "id": "ComeçarP71cf", "width": 60, "height": 55, "style": { "fill": "white", "strokeWidth": 2, "strokeColor": "#3A3A3A", "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None", "stops": [] } }, "container": null, "offsetX": 110, "offsetY": 322.5, "visible": true, "horizontalAlignment": "Left", "verticalAlignment": "Top", "backgroundColor": "transparent", "borderColor": "none", "borderWidth": 0, "rotateAngle": 0, "pivot": { "x": 0.5, "y": 0.5 }, "margin": { "top": 0, "left": 0 }, "flip": "None", "wrapper": { "actualSize": { "width": 60, "height": 55 }, "offsetX": 110, "offsetY": 322.5 }, "constraints": 5240814, "previewSize": {}, "dragSize": {}, "zIndex": 17, "annotations": [{ "id": "oh9EQ", "content": "Inicio", "annotationType": "String", "style": { "strokeWidth": 0, "strokeColor": "transparent", "fill": "transparent", "bold": true, "textWrapping": "WrapWithOverflow", "color": "black", "whiteSpace": "CollapseSpace", "fontFamily": "Arial", "fontSize": 12, "italic": false, "opacity": 1, "strokeDashArray": "", "textAlign": "Center", "textOverflow": "Wrap", "textDecoration": "None" }, "hyperlink": { "link": "", "content": "", "textDecoration": "None" }, "constraints": 4, "visibility": true, "rotateAngle": 0, "margin": { "left": 0, "top": 0, "right": 0, "bottom": 0 }, "horizontalAlignment": "Center", "verticalAlignment": "Center", "offset": { "x": 0.5, "y": 0.5 } }], "isExpanded": true, "expandIcon": { "shape": "None" }, "fixedUserHandles": [], "tooltip": { "openOn": "Auto" }, "inEdges": [], "outEdges": ["connectorML4F7"], "parentId": "", "processId": "", "umlIndex": -1, "isPhase": false, "isLane": false }, { "shape": { "type": "Bpmn", "shape": "Activity", "activity": { "activity": "Task", "subProcess": { "type": "None", "collapsed": true }, "task": { "call": false, "compensation": false, "loop": "None", "type": "None" } }, "annotations": [] }, "ports": [{ "inEdges": ["connectorML4F7o1wM2"], "outEdges": [], "offset": { "x": 0, "y": 0.5 }, "visibility": 12, "constraints": 28, "id": "cTNMI", "height": 12, "width": 12, "shape": "Square", "margin": { "left": 0, "top": 0, "right": 0, "bottom": 0 }, "style": { "fill": "white", "strokeColor": "black", "opacity": 1, "strokeDashArray": "", "strokeWidth": 1 }, "horizontalAlignment": "Center", "verticalAlignment": "Center" }, { "inEdges": [], "outEdges": ["connectort3VCU"], "offset": { "x": 1, "y": 0.5 }, "visibility": 12, "constraints": 28, "id": "KcurV", "height": 12, "width": 12, "shape": "Square", "margin": { "left": 0, "top": 0, "right": 0, "bottom": 0 }, "style": { "fill": "white", "strokeColor": "black", "opacity": 1, "strokeDashArray": "", "strokeWidth": 1 }, "horizontalAlignment": "Center", "verticalAlignment": "Center" }, { "inEdges": [], "outEdges": [], "offset": { "x": 0.25, "y": 0 }, "visibility": 12, "constraints": 28, "id": "f5Mra", "height": 12, "width": 12, "shape": "Square", "margin": { "left": 0, "top": 0, "right": 0, "bottom": 0 }, "style": { "fill": "white", "strokeColor": "black", "opacity": 1, "strokeDashArray": "", "strokeWidth": 1 }, "horizontalAlignment": "Center", "verticalAlignment": "Center" }, { "inEdges": [], "outEdges": [], "offset": { "x": 0.75, "y": 0 }, "visibility": 12, "constraints": 28, "id": "xxNvk", "height": 12, "width": 12, "shape": "Square", "margin": { "left": 0, "top": 0, "right": 0, "bottom": 0 }, "style": { "fill": "white", "strokeColor": "black", "opacity": 1, "strokeDashArray": "", "strokeWidth": 1 }, "horizontalAlignment": "Center", "verticalAlignment": "Center" }, { "inEdges": [], "outEdges": [], "offset": { "x": 0.25, "y": 1 }, "visibility": 12, "constraints": 28, "id": "AdCf4", "height": 12, "width": 12, "shape": "Square", "margin": { "left": 0, "top": 0, "right": 0, "bottom": 0 }, "style": { "fill": "white", "strokeColor": "black", "opacity": 1, "strokeDashArray": "", "strokeWidth": 1 }, "horizontalAlignment": "Center", "verticalAlignment": "Center" }, { "inEdges": [], "outEdges": [], "offset": { "x": 0.75, "y": 1 }, "visibility": 12, "constraints": 28, "id": "rTIyB", "height": 12, "width": 12, "shape": "Square", "margin": { "left": 0, "top": 0, "right": 0, "bottom": 0 }, "style": { "fill": "white", "strokeColor": "black", "opacity": 1, "strokeDashArray": "", "strokeWidth": 1 }, "horizontalAlignment": "Center", "verticalAlignment": "Center" }], "id": "TarefagGcIx", "width": 130, "height": 75, "style": { "fill": "white", "strokeWidth": 2, "strokeColor": "#4db6acff", "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None", "stops": [] } }, "container": null, "offsetX": 433.76, "offsetY": 322.5, "visible": true, "horizontalAlignment": "Left", "verticalAlignment": "Top", "backgroundColor": "transparent", "borderColor": "none", "borderWidth": 0, "rotateAngle": 0, "pivot": { "x": 0.5, "y": 0.5 }, "margin": { "top": 0, "left": 0 }, "flip": "None", "wrapper": { "actualSize": { "width": 130, "height": 75 }, "offsetX": 433.76, "offsetY": 322.5 }, "constraints": 5240814, "previewSize": {}, "dragSize": {}, "zIndex": 18, "annotations": [{ "id": "wEBVv", "content": "Verificação e conferência pela equipe, líder/coordenador", "annotationType": "String", "style": { "strokeWidth": 0, "strokeColor": "transparent", "fill": "transparent", "bold": false, "textWrapping": "WrapWithOverflow", "color": "black", "whiteSpace": "CollapseSpace", "fontFamily": "Arial", "fontSize": 14, "italic": false, "opacity": 1, "strokeDashArray": "", "textAlign": "Center", "textOverflow": "Wrap", "textDecoration": "None" }, "hyperlink": { "link": "", "content": "", "textDecoration": "None" }, "constraints": 4, "visibility": true, "rotateAngle": 0, "margin": { "left": 0, "top": 0, "right": 0, "bottom": 0 }, "horizontalAlignment": "Center", "verticalAlignment": "Center", "offset": { "x": 0.5, "y": 0.5 }, "height": 49.03, "width": 126.66666412353516 }], "isExpanded": true, "expandIcon": { "shape": "None" }, "fixedUserHandles": [], "tooltip": { "openOn": "Auto" }, "inEdges": ["connectorML4F7o1wM2"], "outEdges": ["connectort3VCU"], "parentId": "", "processId": "", "umlIndex": -1, "isPhase": false, "isLane": false }, { "shape": { "type": "Flow", "shape": "Decision" }, "ports": [{ "inEdges": [], "outEdges": [], "offset": { "x": 0, "y": 0.5 }, "visibility": 12, "constraints": 28, "id": "R11ix", "height": 12, "width": 12, "shape": "Square", "margin": { "left": 0, "top": 0, "right": 0, "bottom": 0 }, "style": { "fill": "white", "strokeColor": "black", "opacity": 1, "strokeDashArray": "", "strokeWidth": 1 }, "horizontalAlignment": "Center", "verticalAlignment": "Center" }, { "inEdges": [], "outEdges": [], "offset": { "x": 1, "y": 0.5 }, "visibility": 12, "constraints": 28, "id": "veJ1T", "height": 12, "width": 12, "shape": "Square", "margin": { "left": 0, "top": 0, "right": 0, "bottom": 0 }, "style": { "fill": "white", "strokeColor": "black", "opacity": 1, "strokeDashArray": "", "strokeWidth": 1 }, "horizontalAlignment": "Center", "verticalAlignment": "Center" }, { "inEdges": [], "outEdges": [], "offset": { "x": 0.25, "y": 0 }, "visibility": 12, "constraints": 28, "id": "QOKke", "height": 12, "width": 12, "shape": "Square", "margin": { "left": 0, "top": 0, "right": 0, "bottom": 0 }, "style": { "fill": "white", "strokeColor": "black", "opacity": 1, "strokeDashArray": "", "strokeWidth": 1 }, "horizontalAlignment": "Center", "verticalAlignment": "Center" }, { "inEdges": [], "outEdges": [], "offset": { "x": 0.75, "y": 0 }, "visibility": 12, "constraints": 28, "id": "JA1DT", "height": 12, "width": 12, "shape": "Square", "margin": { "left": 0, "top": 0, "right": 0, "bottom": 0 }, "style": { "fill": "white", "strokeColor": "black", "opacity": 1, "strokeDashArray": "", "strokeWidth": 1 }, "horizontalAlignment": "Center", "verticalAlignment": "Center" }, { "inEdges": [], "outEdges": [], "offset": { "x": 0.25, "y": 1 }, "visibility": 12, "constraints": 28, "id": "BFHq3", "height": 12, "width": 12, "shape": "Square", "margin": { "left": 0, "top": 0, "right": 0, "bottom": 0 }, "style": { "fill": "white", "strokeColor": "black", "opacity": 1, "strokeDashArray": "", "strokeWidth": 1 }, "horizontalAlignment": "Center", "verticalAlignment": "Center" }, { "inEdges": [], "outEdges": [], "offset": { "x": 0.75, "y": 1 }, "visibility": 12, "constraints": 28, "id": "aq0nd", "height": 12, "width": 12, "shape": "Square", "margin": { "left": 0, "top": 0, "right": 0, "bottom": 0 }, "style": { "fill": "white", "strokeColor": "black", "opacity": 1, "strokeDashArray": "", "strokeWidth": 1 }, "horizontalAlignment": "Center", "verticalAlignment": "Center" }], "id": "DecisãoIbNTy", "width": 59.99999999999998, "height": 60, "style": { "fill": "#13615A", "strokeWidth": 2, "strokeColor": "#13615A", "gradient": { "type": "None", "stops": [] }, "strokeDashArray": "", "opacity": 1 }, "container": null, "offsetX": 850, "offsetY": 480, "visible": true, "horizontalAlignment": "Left", "verticalAlignment": "Top", "backgroundColor": "transparent", "borderColor": "none", "borderWidth": 0, "rotateAngle": 0, "pivot": { "x": 0.5, "y": 0.5 }, "margin": { "top": 0, "left": 0 }, "flip": "None", "wrapper": { "actualSize": { "width": 59.99999999999998, "height": 60 }, "offsetX": 850, "offsetY": 480 }, "constraints": 5240814, "previewSize": {}, "dragSize": {}, "zIndex": 19, "annotations": [{ "id": "D0SSB", "content": "Aprovada?", "annotationType": "String", "style": { "strokeWidth": 0, "strokeColor": "transparent", "fill": "transparent", "bold": false, "textWrapping": "WrapWithOverflow", "color": "#000000ff", "whiteSpace": "CollapseSpace", "fontFamily": "Arial", "fontSize": 24, "italic": false, "opacity": 1, "strokeDashArray": "", "textAlign": "Center", "textOverflow": "Wrap", "textDecoration": "None" }, "hyperlink": { "link": "", "content": "", "textDecoration": "None" }, "constraints": 4, "visibility": true, "rotateAngle": 0, "margin": { "left": 0, "top": 0, "right": 0, "bottom": 0 }, "horizontalAlignment": "Center", "verticalAlignment": "Center", "offset": { "x": 0.5, "y": 0.5 }, "height": 27, "width": 61.57000000000001 }], "isExpanded": true, "expandIcon": { "shape": "None" }, "fixedUserHandles": [], "tooltip": { "openOn": "Auto" }, "inEdges": ["connectorJDXCK"], "outEdges": ["connectorEFqns"], "parentId": "", "processId": "", "umlIndex": -1, "isPhase": false, "isLane": false }, { "shape": { "type": "Bpmn", "shape": "Activity", "activity": { "activity": "Task", "subProcess": { "type": "None", "collapsed": true }, "task": { "call": false, "compensation": false, "loop": "None", "type": "None" } }, "annotations": [] }, "ports": [{ "inEdges": [], "outEdges": [], "offset": { "x": 0, "y": 0.5 }, "visibility": 12, "constraints": 28, "id": "k9f01", "height": 12, "width": 12, "shape": "Square", "margin": { "left": 0, "top": 0, "right": 0, "bottom": 0 }, "style": { "fill": "white", "strokeColor": "black", "opacity": 1, "strokeDashArray": "", "strokeWidth": 1 }, "horizontalAlignment": "Center", "verticalAlignment": "Center" }, { "inEdges": [], "outEdges": ["connectorv65n9"], "offset": { "x": 1, "y": 0.5 }, "visibility": 12, "constraints": 28, "id": "ZR9bH", "height": 12, "width": 12, "shape": "Square", "margin": { "left": 0, "top": 0, "right": 0, "bottom": 0 }, "style": { "fill": "white", "strokeColor": "black", "opacity": 1, "strokeDashArray": "", "strokeWidth": 1 }, "horizontalAlignment": "Center", "verticalAlignment": "Center" }, { "inEdges": [], "outEdges": [], "offset": { "x": 0.25, "y": 0 }, "visibility": 12, "constraints": 28, "id": "yVCFn", "height": 12, "width": 12, "shape": "Square", "margin": { "left": 0, "top": 0, "right": 0, "bottom": 0 }, "style": { "fill": "white", "strokeColor": "black", "opacity": 1, "strokeDashArray": "", "strokeWidth": 1 }, "horizontalAlignment": "Center", "verticalAlignment": "Center" }, { "inEdges": [], "outEdges": [], "offset": { "x": 0.75, "y": 0 }, "visibility": 12, "constraints": 28, "id": "ttnOo", "height": 12, "width": 12, "shape": "Square", "margin": { "left": 0, "top": 0, "right": 0, "bottom": 0 }, "style": { "fill": "white", "strokeColor": "black", "opacity": 1, "strokeDashArray": "", "strokeWidth": 1 }, "horizontalAlignment": "Center", "verticalAlignment": "Center" }, { "inEdges": [], "outEdges": [], "offset": { "x": 0.25, "y": 1 }, "visibility": 12, "constraints": 28, "id": "uaBre", "height": 12, "width": 12, "shape": "Square", "margin": { "left": 0, "top": 0, "right": 0, "bottom": 0 }, "style": { "fill": "white", "strokeColor": "black", "opacity": 1, "strokeDashArray": "", "strokeWidth": 1 }, "horizontalAlignment": "Center", "verticalAlignment": "Center" }, { "inEdges": [], "outEdges": [], "offset": { "x": 0.75, "y": 1 }, "visibility": 12, "constraints": 28, "id": "fCRlT", "height": 12, "width": 12, "shape": "Square", "margin": { "left": 0, "top": 0, "right": 0, "bottom": 0 }, "style": { "fill": "white", "strokeColor": "black", "opacity": 1, "strokeDashArray": "", "strokeWidth": 1 }, "horizontalAlignment": "Center", "verticalAlignment": "Center" }], "id": "TarefaEr0ya", "width": 159.99999999999986, "height": 75, "style": { "fill": "white", "strokeWidth": 2, "strokeColor": "#4db6acff", "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None", "stops": [] } }, "container": null, "offsetX": 650, "offsetY": 322.5, "visible": true, "horizontalAlignment": "Left", "verticalAlignment": "Top", "backgroundColor": "transparent", "borderColor": "none", "borderWidth": 0, "rotateAngle": 0, "pivot": { "x": 0.5, "y": 0.5 }, "margin": { "top": 0, "left": 0 }, "flip": "None", "wrapper": { "actualSize": { "width": 159.99999999999986, "height": 75 }, "offsetX": 650, "offsetY": 322.5 }, "constraints": 5240814, "previewSize": {}, "dragSize": {}, "zIndex": 20, "annotations": [{ "id": "BgNrQ", "content": "Revisão pelo setor de Qualidade: formatação, escopo e padronização do documento\n\n", "annotationType": "String", "style": { "strokeWidth": 0, "strokeColor": "transparent", "fill": "transparent", "bold": false, "textWrapping": "WrapWithOverflow", "color": "black", "whiteSpace": "CollapseSpace", "fontFamily": "Arial", "fontSize": 14, "italic": false, "opacity": 1, "strokeDashArray": "", "textAlign": "Center", "textOverflow": "Wrap", "textDecoration": "None" }, "hyperlink": { "link": "", "content": "", "textDecoration": "None" }, "constraints": 4, "visibility": true, "rotateAngle": 0, "margin": { "left": 0, "top": 0, "right": 0, "bottom": 0 }, "horizontalAlignment": "Center", "verticalAlignment": "Center", "offset": { "x": 0.4479374999999999, "y": 0.6851999999999999 }, "height": 60.93000000000001, "width": 141.33999999999997 }], "isExpanded": true, "expandIcon": { "shape": "None" }, "fixedUserHandles": [], "tooltip": { "openOn": "Auto" }, "inEdges": ["connectort3VCU"], "outEdges": ["connectorv65n9"], "parentId": "", "processId": "", "umlIndex": -1, "isPhase": false, "isLane": false }, { "shape": { "type": "Bpmn", "shape": "Activity", "activity": { "activity": "Task", "subProcess": { "type": "None", "collapsed": true }, "task": { "call": false, "compensation": false, "loop": "None", "type": "None" } }, "annotations": [] }, "ports": [{ "inEdges": [], "outEdges": [], "offset": { "x": 0, "y": 0.5 }, "visibility": 12, "constraints": 28, "id": "a8NA4", "height": 12, "width": 12, "shape": "Square", "margin": { "left": 0, "top": 0, "right": 0, "bottom": 0 }, "style": { "fill": "white", "strokeColor": "black", "opacity": 1, "strokeDashArray": "", "strokeWidth": 1 }, "horizontalAlignment": "Center", "verticalAlignment": "Center" }, { "inEdges": [], "outEdges": [], "offset": { "x": 1, "y": 0.5 }, "visibility": 12, "constraints": 28, "id": "Q9Gv3", "height": 12, "width": 12, "shape": "Square", "margin": { "left": 0, "top": 0, "right": 0, "bottom": 0 }, "style": { "fill": "white", "strokeColor": "black", "opacity": 1, "strokeDashArray": "", "strokeWidth": 1 }, "horizontalAlignment": "Center", "verticalAlignment": "Center" }, { "inEdges": [], "outEdges": [], "offset": { "x": 0.25, "y": 0 }, "visibility": 12, "constraints": 28, "id": "NSESZ", "height": 12, "width": 12, "shape": "Square", "margin": { "left": 0, "top": 0, "right": 0, "bottom": 0 }, "style": { "fill": "white", "strokeColor": "black", "opacity": 1, "strokeDashArray": "", "strokeWidth": 1 }, "horizontalAlignment": "Center", "verticalAlignment": "Center" }, { "inEdges": [], "outEdges": [], "offset": { "x": 0.75, "y": 0 }, "visibility": 12, "constraints": 28, "id": "F8kNq", "height": 12, "width": 12, "shape": "Square", "margin": { "left": 0, "top": 0, "right": 0, "bottom": 0 }, "style": { "fill": "white", "strokeColor": "black", "opacity": 1, "strokeDashArray": "", "strokeWidth": 1 }, "horizontalAlignment": "Center", "verticalAlignment": "Center" }, { "inEdges": [], "outEdges": [], "offset": { "x": 0.25, "y": 1 }, "visibility": 12, "constraints": 28, "id": "bOnuT", "height": 12, "width": 12, "shape": "Square", "margin": { "left": 0, "top": 0, "right": 0, "bottom": 0 }, "style": { "fill": "white", "strokeColor": "black", "opacity": 1, "strokeDashArray": "", "strokeWidth": 1 }, "horizontalAlignment": "Center", "verticalAlignment": "Center" }, { "inEdges": [], "outEdges": [], "offset": { "x": 0.75, "y": 1 }, "visibility": 12, "constraints": 28, "id": "PL5Dm", "height": 12, "width": 12, "shape": "Square", "margin": { "left": 0, "top": 0, "right": 0, "bottom": 0 }, "style": { "fill": "white", "strokeColor": "black", "opacity": 1, "strokeDashArray": "", "strokeWidth": 1 }, "horizontalAlignment": "Center", "verticalAlignment": "Center" }], "id": "TarefaAc54U", "width": 149.9999999999999, "height": 80, "style": { "fill": "white", "strokeWidth": 2, "strokeColor": "#4db6acff", "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None", "stops": [] } }, "container": null, "offsetX": 254.38, "offsetY": 480, "visible": true, "horizontalAlignment": "Left", "verticalAlignment": "Top", "backgroundColor": "transparent", "borderColor": "none", "borderWidth": 0, "rotateAngle": 0, "pivot": { "x": 0.5, "y": 0.5 }, "margin": { "top": 0, "left": 0 }, "flip": "None", "wrapper": { "actualSize": { "width": 149.9999999999999, "height": 80 }, "offsetX": 254.38, "offsetY": 480 }, "constraints": 5240814, "previewSize": {}, "dragSize": {}, "zIndex": 22, "annotations": [{ "id": "LUn21", "content": "Revisão do documento pelo setor responsável e reinicia o processo", "annotationType": "String", "style": { "strokeWidth": 0, "strokeColor": "transparent", "fill": "transparent", "bold": false, "textWrapping": "WrapWithOverflow", "color": "black", "whiteSpace": "CollapseSpace", "fontFamily": "Arial", "fontSize": 14, "italic": false, "opacity": 1, "strokeDashArray": "", "textAlign": "Center", "textOverflow": "Wrap", "textDecoration": "None" }, "hyperlink": { "link": "", "content": "", "textDecoration": "None" }, "constraints": 4, "visibility": true, "rotateAngle": 0, "margin": { "left": 0, "top": 0, "right": 0, "bottom": 0 }, "horizontalAlignment": "Center", "verticalAlignment": "Center", "offset": { "x": 0.4642666666666666, "y": 0.488875 }, "height": 53.97, "width": 128.3333282470703 }], "isExpanded": true, "expandIcon": { "shape": "None" }, "fixedUserHandles": [], "tooltip": { "openOn": "Auto" }, "inEdges": ["connectorlT5vP"], "outEdges": ["connectorVy5Tw"], "parentId": "", "processId": "", "umlIndex": -1, "isPhase": false, "isLane": false }, { "shape": { "type": "Bpmn", "shape": "Event", "event": { "event": "End", "trigger": "None" }, "annotations": [], "activity": { "subProcess": {} } }, "ports": [{ "inEdges": [], "outEdges": [], "offset": { "x": 0, "y": 0.5 }, "visibility": 12, "constraints": 28, "id": "UImWW", "height": 12, "width": 12, "shape": "Square", "margin": { "left": 0, "top": 0, "right": 0, "bottom": 0 }, "style": { "fill": "white", "strokeColor": "black", "opacity": 1, "strokeDashArray": "", "strokeWidth": 1 }, "horizontalAlignment": "Center", "verticalAlignment": "Center" }, { "inEdges": [], "outEdges": [], "offset": { "x": 1, "y": 0.5 }, "visibility": 12, "constraints": 28, "id": "Hmt5K", "height": 12, "width": 12, "shape": "Square", "margin": { "left": 0, "top": 0, "right": 0, "bottom": 0 }, "style": { "fill": "white", "strokeColor": "black", "opacity": 1, "strokeDashArray": "", "strokeWidth": 1 }, "horizontalAlignment": "Center", "verticalAlignment": "Center" }, { "inEdges": [], "outEdges": [], "offset": { "x": 0.25, "y": 0 }, "visibility": 12, "constraints": 28, "id": "GfIWs", "height": 12, "width": 12, "shape": "Square", "margin": { "left": 0, "top": 0, "right": 0, "bottom": 0 }, "style": { "fill": "white", "strokeColor": "black", "opacity": 1, "strokeDashArray": "", "strokeWidth": 1 }, "horizontalAlignment": "Center", "verticalAlignment": "Center" }, { "inEdges": [], "outEdges": [], "offset": { "x": 0.75, "y": 0 }, "visibility": 12, "constraints": 28, "id": "HEVb6", "height": 12, "width": 12, "shape": "Square", "margin": { "left": 0, "top": 0, "right": 0, "bottom": 0 }, "style": { "fill": "white", "strokeColor": "black", "opacity": 1, "strokeDashArray": "", "strokeWidth": 1 }, "horizontalAlignment": "Center", "verticalAlignment": "Center" }, { "inEdges": [], "outEdges": [], "offset": { "x": 0.25, "y": 1 }, "visibility": 12, "constraints": 28, "id": "A8pGH", "height": 12, "width": 12, "shape": "Square", "margin": { "left": 0, "top": 0, "right": 0, "bottom": 0 }, "style": { "fill": "white", "strokeColor": "black", "opacity": 1, "strokeDashArray": "", "strokeWidth": 1 }, "horizontalAlignment": "Center", "verticalAlignment": "Center" }, { "inEdges": [], "outEdges": [], "offset": { "x": 0.75, "y": 1 }, "visibility": 12, "constraints": 28, "id": "SqmgH", "height": 12, "width": 12, "shape": "Square", "margin": { "left": 0, "top": 0, "right": 0, "bottom": 0 }, "style": { "fill": "white", "strokeColor": "black", "opacity": 1, "strokeDashArray": "", "strokeWidth": 1 }, "horizontalAlignment": "Center", "verticalAlignment": "Center" }], "id": "FimyMVro", "width": 60, "height": 55, "style": { "fill": "white", "strokeWidth": 2, "strokeColor": "#3A3A3A", "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None", "stops": [] } }, "container": null, "offsetX": 1030, "offsetY": 617.5, "visible": true, "horizontalAlignment": "Left", "verticalAlignment": "Top", "backgroundColor": "transparent", "borderColor": "none", "borderWidth": 0, "rotateAngle": 0, "pivot": { "x": 0.5, "y": 0.5 }, "margin": { "top": 0, "left": 0 }, "flip": "None", "wrapper": { "actualSize": { "width": 60, "height": 55 }, "offsetX": 1030, "offsetY": 617.5 }, "constraints": 5240814, "previewSize": {}, "dragSize": {}, "zIndex": 23, "annotations": [{ "id": "T4fkZ", "content": "Fim", "annotationType": "String", "style": { "strokeWidth": 0, "strokeColor": "transparent", "fill": "transparent", "bold": true, "textWrapping": "WrapWithOverflow", "color": "black", "whiteSpace": "CollapseSpace", "fontFamily": "Arial", "fontSize": 12, "italic": false, "opacity": 1, "strokeDashArray": "", "textAlign": "Center", "textOverflow": "Wrap", "textDecoration": "None" }, "hyperlink": { "link": "", "content": "", "textDecoration": "None" }, "constraints": 4, "visibility": true, "rotateAngle": 0, "margin": { "left": 0, "top": 0, "right": 0, "bottom": 0 }, "horizontalAlignment": "Center", "verticalAlignment": "Center", "offset": { "x": 0.5, "y": 0.5 } }], "isExpanded": true, "expandIcon": { "shape": "None" }, "fixedUserHandles": [], "tooltip": { "openOn": "Auto" }, "inEdges": ["connectornFfFU"], "outEdges": [], "parentId": "", "processId": "", "umlIndex": -1, "isPhase": false, "isLane": false }, { "shape": { "type": "Flow", "shape": "Process" }, "ports": [], "id": "FunçãoOnphi", "width": 1359.9999999999998, "height": 622.5000000000001, "style": { "fill": "rgba(255,255,255,1)", "strokeWidth": 2, "gradient": { "type": "None", "stops": [] }, "strokeColor": "#49C7BC", "strokeDashArray": "", "opacity": 1 }, "horizontalAlignment": "Left", "annotations": [{ "id": "hkleb", "content": "Fluxo Aprovação e publicação de Políticas", "annotationType": "String", "rotateAngle": 270, "offset": { "x": 0, "y": 0.5 }, "horizontalAlignment": "Center", "margin": { "left": 20, "top": 0, "right": 0, "bottom": 0 }, "style": { "strokeWidth": 0, "strokeColor": "transparent", "fill": "transparent", "bold": true, "textWrapping": "WrapWithOverflow", "color": "#000000", "whiteSpace": "CollapseSpace", "fontFamily": "Arial", "fontSize": 20, "italic": false, "opacity": 1, "strokeDashArray": "", "textAlign": "Center", "textOverflow": "Wrap", "textDecoration": "None" }, "hyperlink": { "link": "", "content": "", "textDecoration": "None" }, "constraints": 4, "visibility": true, "verticalAlignment": "Center" }], "constraints": 5240430, "container": null, "offsetX": 650, "offsetY": 448.7499999999999, "visible": true, "verticalAlignment": "Top", "backgroundColor": "transparent", "borderColor": "none", "borderWidth": 0, "rotateAngle": 0, "pivot": { "x": 0.5, "y": 0.5 }, "margin": { "top": 0, "left": 0 }, "flip": "None", "wrapper": { "actualSize": { "width": 1359.9999999999998, "height": 622.5000000000001 }, "offsetX": 650, "offsetY": 448.7499999999999 }, "previewSize": {}, "dragSize": {}, "zIndex": 0, "isExpanded": true, "expandIcon": { "shape": "None" }, "fixedUserHandles": [], "tooltip": { "openOn": "Auto" }, "inEdges": [], "outEdges": [], "parentId": "", "processId": "", "umlIndex": -1, "isPhase": false, "isLane": false }, { "shape": { "type": "Bpmn", "shape": "Activity", "activity": { "activity": "Task", "subProcess": { "type": "None", "collapsed": true }, "task": { "call": false, "compensation": false, "loop": "None", "type": "None" } }, "annotations": [] }, "ports": [{ "inEdges": ["connectorv65n9"], "outEdges": [], "offset": { "x": 0, "y": 0.5 }, "visibility": 12, "constraints": 28, "id": "k9f01", "height": 12, "width": 12, "shape": "Square", "margin": { "left": 0, "top": 0, "right": 0, "bottom": 0 }, "style": { "fill": "white", "strokeColor": "black", "opacity": 1, "strokeDashArray": "", "strokeWidth": 1 }, "horizontalAlignment": "Center", "verticalAlignment": "Center" }, { "inEdges": [], "outEdges": [], "offset": { "x": 1, "y": 0.5 }, "visibility": 12, "constraints": 28, "id": "ZR9bH", "height": 12, "width": 12, "shape": "Square", "margin": { "left": 0, "top": 0, "right": 0, "bottom": 0 }, "style": { "fill": "white", "strokeColor": "black", "opacity": 1, "strokeDashArray": "", "strokeWidth": 1 }, "horizontalAlignment": "Center", "verticalAlignment": "Center" }, { "inEdges": [], "outEdges": [], "offset": { "x": 0.25, "y": 0 }, "visibility": 12, "constraints": 28, "id": "yVCFn", "height": 12, "width": 12, "shape": "Square", "margin": { "left": 0, "top": 0, "right": 0, "bottom": 0 }, "style": { "fill": "white", "strokeColor": "black", "opacity": 1, "strokeDashArray": "", "strokeWidth": 1 }, "horizontalAlignment": "Center", "verticalAlignment": "Center" }, { "inEdges": [], "outEdges": [], "offset": { "x": 0.75, "y": 0 }, "visibility": 12, "constraints": 28, "id": "ttnOo", "height": 12, "width": 12, "shape": "Square", "margin": { "left": 0, "top": 0, "right": 0, "bottom": 0 }, "style": { "fill": "white", "strokeColor": "black", "opacity": 1, "strokeDashArray": "", "strokeWidth": 1 }, "horizontalAlignment": "Center", "verticalAlignment": "Center" }, { "inEdges": [], "outEdges": [], "offset": { "x": 0.25, "y": 1 }, "visibility": 12, "constraints": 28, "id": "uaBre", "height": 12, "width": 12, "shape": "Square", "margin": { "left": 0, "top": 0, "right": 0, "bottom": 0 }, "style": { "fill": "white", "strokeColor": "black", "opacity": 1, "strokeDashArray": "", "strokeWidth": 1 }, "horizontalAlignment": "Center", "verticalAlignment": "Center" }, { "inEdges": [], "outEdges": [], "offset": { "x": 0.75, "y": 1 }, "visibility": 12, "constraints": 28, "id": "fCRlT", "height": 12, "width": 12, "shape": "Square", "margin": { "left": 0, "top": 0, "right": 0, "bottom": 0 }, "style": { "fill": "white", "strokeColor": "black", "opacity": 1, "strokeDashArray": "", "strokeWidth": 1 }, "horizontalAlignment": "Center", "verticalAlignment": "Center" }], "id": "TarefaEr0yamBTRc", "width": 140, "height": 74.99999999999997, "style": { "fill": "white", "strokeWidth": 2, "strokeColor": "#4db6acff", "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None", "stops": [] } }, "container": null, "offsetX": 871.24, "offsetY": 322.5, "visible": true, "horizontalAlignment": "Left", "verticalAlignment": "Top", "backgroundColor": "transparent", "borderColor": "none", "borderWidth": 0, "rotateAngle": 0, "pivot": { "x": 0.5, "y": 0.5 }, "margin": { "top": 0, "left": 0 }, "flip": "None", "wrapper": { "actualSize": { "width": 140, "height": 74.99999999999997 }, "offsetX": 871.24, "offsetY": 322.5 }, "constraints": 5240814, "previewSize": {}, "dragSize": {}, "zIndex": 42, "annotations": [{ "id": "BgNrQ", "content": "Setor apresenta ao Conselho em reunião através de projeção pelo Qualiex", "annotationType": "String", "style": { "strokeWidth": 0, "strokeColor": "transparent", "fill": "transparent", "bold": false, "textWrapping": "WrapWithOverflow", "color": "black", "whiteSpace": "CollapseSpace", "fontFamily": "Arial", "fontSize": 14, "italic": false, "opacity": 1, "strokeDashArray": "", "textAlign": "Center", "textOverflow": "Wrap", "textDecoration": "None" }, "hyperlink": { "link": "", "content": "", "textDecoration": "None" }, "constraints": 4, "visibility": true, "rotateAngle": 0, "margin": { "left": 0, "top": 0, "right": 0, "bottom": 0 }, "horizontalAlignment": "Center", "verticalAlignment": "Center", "offset": { "x": 0.5, "y": 0.5 } }], "isExpanded": true, "expandIcon": { "shape": "None" }, "fixedUserHandles": [], "tooltip": { "openOn": "Auto" }, "inEdges": ["connectorv65n9"], "outEdges": [], "parentId": "", "processId": "", "umlIndex": -1, "isPhase": false, "isLane": false }, { "shape": { "type": "Bpmn", "shape": "Activity", "activity": { "activity": "Task", "subProcess": { "type": "None", "collapsed": true }, "task": { "call": false, "compensation": false, "loop": "None", "type": "None" } }, "annotations": [] }, "ports": [{ "inEdges": ["connectorML4F7"], "outEdges": [], "offset": { "x": 0, "y": 0.5 }, "visibility": 12, "constraints": 28, "id": "cTNMI", "height": 12, "width": 12, "shape": "Square", "margin": { "left": 0, "top": 0, "right": 0, "bottom": 0 }, "style": { "fill": "white", "strokeColor": "black", "opacity": 1, "strokeDashArray": "", "strokeWidth": 1 }, "horizontalAlignment": "Center", "verticalAlignment": "Center" }, { "inEdges": [], "outEdges": ["connectorML4F7o1wM2"], "offset": { "x": 1, "y": 0.5 }, "visibility": 12, "constraints": 28, "id": "KcurV", "height": 12, "width": 12, "shape": "Square", "margin": { "left": 0, "top": 0, "right": 0, "bottom": 0 }, "style": { "fill": "white", "strokeColor": "black", "opacity": 1, "strokeDashArray": "", "strokeWidth": 1 }, "horizontalAlignment": "Center", "verticalAlignment": "Center" }, { "inEdges": [], "outEdges": [], "offset": { "x": 0.25, "y": 0 }, "visibility": 12, "constraints": 28, "id": "f5Mra", "height": 12, "width": 12, "shape": "Square", "margin": { "left": 0, "top": 0, "right": 0, "bottom": 0 }, "style": { "fill": "white", "strokeColor": "black", "opacity": 1, "strokeDashArray": "", "strokeWidth": 1 }, "horizontalAlignment": "Center", "verticalAlignment": "Center" }, { "inEdges": [], "outEdges": [], "offset": { "x": 0.75, "y": 0 }, "visibility": 12, "constraints": 28, "id": "xxNvk", "height": 12, "width": 12, "shape": "Square", "margin": { "left": 0, "top": 0, "right": 0, "bottom": 0 }, "style": { "fill": "white", "strokeColor": "black", "opacity": 1, "strokeDashArray": "", "strokeWidth": 1 }, "horizontalAlignment": "Center", "verticalAlignment": "Center" }, { "inEdges": [], "outEdges": [], "offset": { "x": 0.25, "y": 1 }, "visibility": 12, "constraints": 28, "id": "AdCf4", "height": 12, "width": 12, "shape": "Square", "margin": { "left": 0, "top": 0, "right": 0, "bottom": 0 }, "style": { "fill": "white", "strokeColor": "black", "opacity": 1, "strokeDashArray": "", "strokeWidth": 1 }, "horizontalAlignment": "Center", "verticalAlignment": "Center" }, { "inEdges": [], "outEdges": [], "offset": { "x": 0.75, "y": 1 }, "visibility": 12, "constraints": 28, "id": "rTIyB", "height": 12, "width": 12, "shape": "Square", "margin": { "left": 0, "top": 0, "right": 0, "bottom": 0 }, "style": { "fill": "white", "strokeColor": "black", "opacity": 1, "strokeDashArray": "", "strokeWidth": 1 }, "horizontalAlignment": "Center", "verticalAlignment": "Center" }], "id": "TarefagGcIxTTQBT", "width": 130, "height": 75.00000000000001, "style": { "fill": "white", "strokeWidth": 2, "strokeColor": "#4db6acff", "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None", "stops": [] } }, "container": null, "offsetX": 254.38, "offsetY": 322.5, "visible": true, "horizontalAlignment": "Left", "verticalAlignment": "Top", "backgroundColor": "transparent", "borderColor": "none", "borderWidth": 0, "rotateAngle": 0, "pivot": { "x": 0.5, "y": 0.5 }, "margin": { "top": 0, "left": 0 }, "flip": "None", "wrapper": { "actualSize": { "width": 130, "height": 75.00000000000001 }, "offsetX": 254.38, "offsetY": 322.5 }, "constraints": 5240814, "previewSize": {}, "dragSize": {}, "zIndex": 46, "annotations": [{ "id": "wEBVv", "content": "Elaboração da Política e postagem no Qualiex", "annotationType": "String", "style": { "strokeWidth": 0, "strokeColor": "transparent", "fill": "transparent", "bold": false, "textWrapping": "WrapWithOverflow", "color": "black", "whiteSpace": "CollapseSpace", "fontFamily": "Arial", "fontSize": 14, "italic": false, "opacity": 1, "strokeDashArray": "", "textAlign": "Center", "textOverflow": "Wrap", "textDecoration": "None" }, "hyperlink": { "link": "", "content": "", "textDecoration": "None" }, "constraints": 4, "visibility": true, "rotateAngle": 0, "margin": { "left": 0, "top": 0, "right": 0, "bottom": 0 }, "horizontalAlignment": "Center", "verticalAlignment": "Center", "offset": { "x": 0.5, "y": 0.5 }, "height": 51.35000000000001, "width": 126.66666412353516 }], "isExpanded": true, "expandIcon": { "shape": "None" }, "fixedUserHandles": [], "tooltip": { "openOn": "Auto" }, "inEdges": ["connectorML4F7", "connectorVy5Tw"], "outEdges": ["connectorML4F7o1wM2"], "parentId": "", "processId": "", "umlIndex": -1, "isPhase": false, "isLane": false }, { "shape": { "type": "Flow", "shape": "Terminator" }, "ports": [{ "inEdges": [], "outEdges": [], "offset": { "x": 0, "y": 0.5 }, "visibility": 12, "constraints": 28, "id": "CLnTA", "height": 12, "width": 12, "shape": "Square", "margin": { "left": 0, "top": 0, "right": 0, "bottom": 0 }, "style": { "fill": "white", "strokeColor": "black", "opacity": 1, "strokeDashArray": "", "strokeWidth": 1 }, "horizontalAlignment": "Center", "verticalAlignment": "Center" }, { "inEdges": [], "outEdges": ["connectornFfFU"], "offset": { "x": 1, "y": 0.5 }, "visibility": 12, "constraints": 28, "id": "P7EEa", "height": 12, "width": 12, "shape": "Square", "margin": { "left": 0, "top": 0, "right": 0, "bottom": 0 }, "style": { "fill": "white", "strokeColor": "black", "opacity": 1, "strokeDashArray": "", "strokeWidth": 1 }, "horizontalAlignment": "Center", "verticalAlignment": "Center" }, { "inEdges": [], "outEdges": [], "offset": { "x": 0.25, "y": 0 }, "visibility": 12, "constraints": 28, "id": "CObBB", "height": 12, "width": 12, "shape": "Square", "margin": { "left": 0, "top": 0, "right": 0, "bottom": 0 }, "style": { "fill": "white", "strokeColor": "black", "opacity": 1, "strokeDashArray": "", "strokeWidth": 1 }, "horizontalAlignment": "Center", "verticalAlignment": "Center" }, { "inEdges": [], "outEdges": [], "offset": { "x": 0.75, "y": 0 }, "visibility": 12, "constraints": 28, "id": "HUobO", "height": 12, "width": 12, "shape": "Square", "margin": { "left": 0, "top": 0, "right": 0, "bottom": 0 }, "style": { "fill": "white", "strokeColor": "black", "opacity": 1, "strokeDashArray": "", "strokeWidth": 1 }, "horizontalAlignment": "Center", "verticalAlignment": "Center" }, { "inEdges": [], "outEdges": [], "offset": { "x": 0.25, "y": 1 }, "visibility": 12, "constraints": 28, "id": "WGsnJ", "height": 12, "width": 12, "shape": "Square", "margin": { "left": 0, "top": 0, "right": 0, "bottom": 0 }, "style": { "fill": "white", "strokeColor": "black", "opacity": 1, "strokeDashArray": "", "strokeWidth": 1 }, "horizontalAlignment": "Center", "verticalAlignment": "Center" }, { "inEdges": [], "outEdges": [], "offset": { "x": 0.75, "y": 1 }, "visibility": 12, "constraints": 28, "id": "K6I3h", "height": 12, "width": 12, "shape": "Square", "margin": { "left": 0, "top": 0, "right": 0, "bottom": 0 }, "style": { "fill": "white", "strokeColor": "black", "opacity": 1, "strokeDashArray": "", "strokeWidth": 1 }, "horizontalAlignment": "Center", "verticalAlignment": "Center" }], "id": "Términof7h5v", "width": 129.99999999999994, "height": 75.00000000000006, "style": { "fill": "rgba(255,255,255,1)", "strokeWidth": 2, "strokeColor": "#50BFB5", "gradient": { "type": "None" }, "strokeDashArray": "", "opacity": 1 }, "container": null, "offsetX": 850, "offsetY": 617.5, "visible": true, "horizontalAlignment": "Left", "verticalAlignment": "Top", "backgroundColor": "transparent", "borderColor": "none", "borderWidth": 0, "rotateAngle": 0, "pivot": { "x": 0.5, "y": 0.5 }, "margin": { "top": 0, "left": 0 }, "flip": "None", "wrapper": { "actualSize": { "width": 129.99999999999994, "height": 75.00000000000006 }, "offsetX": 850, "offsetY": 617.5 }, "constraints": 5240814, "previewSize": {}, "dragSize": {}, "zIndex": 59, "annotations": [{ "id": "vO56r", "content": "Secretaria de Governança realiza publicação do documento direto no Qualiex", "annotationType": "String", "style": { "strokeWidth": 0, "strokeColor": "transparent", "fill": "transparent", "bold": false, "textWrapping": "WrapWithOverflow", "color": "#000000ff", "whiteSpace": "CollapseSpace", "fontFamily": "Arial", "fontSize": 12, "italic": false, "opacity": 1, "strokeDashArray": "", "textAlign": "Center", "textOverflow": "Wrap", "textDecoration": "None" }, "hyperlink": { "link": "", "content": "", "textDecoration": "None" }, "constraints": 4, "visibility": true, "rotateAngle": 0, "margin": { "left": 0, "top": 0, "right": 0, "bottom": 0 }, "horizontalAlignment": "Center", "verticalAlignment": "Center", "offset": { "x": 0.5, "y": 0.5 } }], "isExpanded": true, "expandIcon": { "shape": "None" }, "fixedUserHandles": [], "tooltip": { "openOn": "Auto" }, "inEdges": ["connectorEFqns"], "outEdges": ["connectornFfFU"], "parentId": "", "processId": "", "umlIndex": -1, "isPhase": false, "isLane": false }, { "shape": { "type": "Bpmn", "shape": "Activity", "activity": { "activity": "Task", "subProcess": { "type": "None", "collapsed": true }, "task": { "call": false, "compensation": false, "loop": "None", "type": "None" } }, "annotations": [] }, "ports": [{ "inEdges": [], "outEdges": ["connectorlT5vP"], "offset": { "x": 0, "y": 0.5 }, "visibility": 12, "constraints": 28, "id": "ZGcvm", "height": 12, "width": 12, "shape": "Square", "margin": { "left": 0, "top": 0, "right": 0, "bottom": 0 }, "style": { "fill": "white", "strokeColor": "black", "opacity": 1, "strokeDashArray": "", "strokeWidth": 1 }, "horizontalAlignment": "Center", "verticalAlignment": "Center" }, { "inEdges": [], "outEdges": [], "offset": { "x": 1, "y": 0.5 }, "visibility": 12, "constraints": 28, "id": "LMVby", "height": 12, "width": 12, "shape": "Square", "margin": { "left": 0, "top": 0, "right": 0, "bottom": 0 }, "style": { "fill": "white", "strokeColor": "black", "opacity": 1, "strokeDashArray": "", "strokeWidth": 1 }, "horizontalAlignment": "Center", "verticalAlignment": "Center" }, { "inEdges": [], "outEdges": [], "offset": { "x": 0.25, "y": 0 }, "visibility": 12, "constraints": 28, "id": "dZRrd", "height": 12, "width": 12, "shape": "Square", "margin": { "left": 0, "top": 0, "right": 0, "bottom": 0 }, "style": { "fill": "white", "strokeColor": "black", "opacity": 1, "strokeDashArray": "", "strokeWidth": 1 }, "horizontalAlignment": "Center", "verticalAlignment": "Center" }, { "inEdges": [], "outEdges": [], "offset": { "x": 0.75, "y": 0 }, "visibility": 12, "constraints": 28, "id": "Uf2sw", "height": 12, "width": 12, "shape": "Square", "margin": { "left": 0, "top": 0, "right": 0, "bottom": 0 }, "style": { "fill": "white", "strokeColor": "black", "opacity": 1, "strokeDashArray": "", "strokeWidth": 1 }, "horizontalAlignment": "Center", "verticalAlignment": "Center" }, { "inEdges": [], "outEdges": [], "offset": { "x": 0.25, "y": 1 }, "visibility": 12, "constraints": 28, "id": "QxfVb", "height": 12, "width": 12, "shape": "Square", "margin": { "left": 0, "top": 0, "right": 0, "bottom": 0 }, "style": { "fill": "white", "strokeColor": "black", "opacity": 1, "strokeDashArray": "", "strokeWidth": 1 }, "horizontalAlignment": "Center", "verticalAlignment": "Center" }, { "inEdges": [], "outEdges": [], "offset": { "x": 0.75, "y": 1 }, "visibility": 12, "constraints": 28, "id": "MaGBf", "height": 12, "width": 12, "shape": "Square", "margin": { "left": 0, "top": 0, "right": 0, "bottom": 0 }, "style": { "fill": "white", "strokeColor": "black", "opacity": 1, "strokeDashArray": "", "strokeWidth": 1 }, "horizontalAlignment": "Center", "verticalAlignment": "Center" }], "id": "Tarefanpywr", "width": 168.75999999999996, "height": 74.99999999999999, "style": { "fill": "white", "strokeWidth": 2, "strokeColor": "#4db6acff", "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } }, "container": null, "offsetX": 569.69, "offsetY": 480, "visible": true, "horizontalAlignment": "Left", "verticalAlignment": "Top", "backgroundColor": "transparent", "borderColor": "none", "borderWidth": 0, "rotateAngle": 0, "pivot": { "x": 0.5, "y": 0.5 }, "margin": { "top": 0, "left": 0 }, "flip": "None", "wrapper": { "actualSize": { "width": 168.75999999999996, "height": 74.99999999999999 }, "offsetX": 569.69, "offsetY": 480 }, "constraints": 5240814, "previewSize": {}, "dragSize": {}, "zIndex": 60, "annotations": [{ "id": "MPf5H", "content": "Secretaria de Governança realiza consideração do Conselho de Administração no documento direto no Qualiex", "annotationType": "String", "style": { "strokeWidth": 0, "strokeColor": "transparent", "fill": "transparent", "bold": false, "textWrapping": "WrapWithOverflow", "color": "black", "whiteSpace": "CollapseSpace", "fontFamily": "Arial", "fontSize": 12, "italic": false, "opacity": 1, "strokeDashArray": "", "textAlign": "Center", "textOverflow": "Wrap", "textDecoration": "None" }, "hyperlink": { "link": "", "content": "", "textDecoration": "None" }, "constraints": 4, "visibility": true, "rotateAngle": 0, "margin": { "left": 0, "top": 0, "right": 0, "bottom": 0 }, "horizontalAlignment": "Center", "verticalAlignment": "Center", "offset": { "x": 0.5, "y": 0.5 } }], "isExpanded": true, "expandIcon": { "shape": "None" }, "fixedUserHandles": [], "tooltip": { "openOn": "Auto" }, "inEdges": [], "outEdges": ["connectorlT5vP"], "parentId": "", "processId": "", "umlIndex": -1, "isPhase": false, "isLane": false }], "connectors": [{ "shape": { "type": "None" }, "type": "Bezier", "sourcePortID": "lH7Mv", "sourcePoint": { "x": 140, "y": 322.5 }, "targetPoint": { "x": 189.38, "y": 322.5 }, "id": "connectorML4F7", "sourceID": "ComeçarP71cf", "zIndex": 26, "targetID": "TarefagGcIxTTQBT", "targetPortID": "cTNMI", "flip": "None", "segments": [{ "type": "Bezier", "point1": { "x": 0, "y": 0 }, "vector1": { "angle": 0, "distance": 0 }, "point2": { "x": 0, "y": 0 }, "vector2": { "angle": 0, "distance": 0 }, "point": { "x": 0, "y": 0 } }], "sourceDecorator": { "shape": "None", "width": 10, "height": 10, "pivot": { "x": 0, "y": 0.5 }, "style": { "fill": "#13615A", "strokeColor": "#13615A", "strokeWidth": 1, "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } } }, "targetDecorator": { "shape": "Arrow", "width": 10, "height": 10, "pivot": { "x": 0, "y": 0.5 }, "style": { "fill": "#13615A", "strokeColor": "#13615A", "strokeWidth": 1, "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } } }, "cornerRadius": 0, "wrapper": { "actualSize": { "width": 54.50508088930201, "height": 0.2176508581054577 }, "offsetX": 167.252540444651, "offsetY": 322.60882542905273 }, "style": { "strokeWidth": 1, "strokeColor": "#13615A", "fill": "transparent", "strokeDashArray": "None", "opacity": 1, "gradient": { "type": "None" } }, "annotations": [], "fixedUserHandles": [], "visible": true, "constraints": 470590, "sourcePadding": 0, "targetPadding": 0, "tooltip": { "openOn": "Auto" }, "connectionPadding": 0, "bridgeSpace": 10, "hitPadding": 10, "parentId": "" }, { "shape": { "type": "None" }, "type": "Bezier", "sourcePortID": "ZR9bH", "sourcePoint": { "x": 730, "y": 322.5 }, "targetPoint": { "x": 801.24, "y": 322.5 }, "id": "connectorv65n9", "sourceID": "TarefaEr0ya", "zIndex": 30, "targetID": "TarefaEr0yamBTRc", "targetPortID": "k9f01", "flip": "None", "segments": [{ "type": "Bezier", "point1": { "x": 0, "y": 0 }, "vector1": { "angle": 0, "distance": 0 }, "point2": { "x": 0, "y": 0 }, "vector2": { "angle": 0, "distance": 0 }, "point": { "x": 0, "y": 0 } }], "sourceDecorator": { "shape": "None", "width": 10, "height": 10, "pivot": { "x": 0, "y": 0.5 }, "style": { "fill": "#13615A", "strokeColor": "#13615A", "strokeWidth": 1, "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } } }, "targetDecorator": { "shape": "Arrow", "width": 10, "height": 10, "pivot": { "x": 0, "y": 0.5 }, "style": { "fill": "#13615A", "strokeColor": "#13615A", "strokeWidth": 1, "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } } }, "cornerRadius": 0, "wrapper": { "actualSize": { "width": 78.92507852593644, "height": 0.2221015683040264 }, "offsetX": 769.4625392629682, "offsetY": 322.611050784152 }, "style": { "strokeWidth": 1, "strokeColor": "#13615A", "fill": "transparent", "strokeDashArray": "None", "opacity": 1, "gradient": { "type": "None" } }, "annotations": [], "fixedUserHandles": [], "visible": true, "constraints": 470590, "sourcePadding": 0, "targetPadding": 0, "tooltip": { "openOn": "Auto" }, "connectionPadding": 0, "bridgeSpace": 10, "hitPadding": 10, "parentId": "" }, { "shape": { "type": "None" }, "type": "Bezier", "sourcePortID": "KcurV", "sourcePoint": { "x": 319.38, "y": 322.5 }, "targetPoint": { "x": 368.76, "y": 322.5 }, "id": "connectorML4F7o1wM2", "sourceID": "TarefagGcIxTTQBT", "zIndex": 47, "targetID": "TarefagGcIx", "targetPortID": "cTNMI", "flip": "None", "segments": [{ "type": "Bezier", "point1": { "x": 0, "y": 0 }, "vector1": { "angle": 0, "distance": 0 }, "point2": { "x": 0, "y": 0 }, "vector2": { "angle": 0, "distance": 0 }, "point": { "x": 0, "y": 0 } }], "sourceDecorator": { "shape": "None", "width": 10, "height": 10, "pivot": { "x": 0, "y": 0.5 }, "style": { "fill": "#13615A", "strokeColor": "#13615A", "strokeWidth": 1, "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } } }, "targetDecorator": { "shape": "Arrow", "width": 10, "height": 10, "pivot": { "x": 0, "y": 0.5 }, "style": { "fill": "#13615A", "strokeColor": "#13615A", "strokeWidth": 1, "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } } }, "cornerRadius": 0, "wrapper": { "actualSize": { "width": 47.438568884547806, "height": 0.21777562293658548 }, "offsetX": 343.09928444227387, "offsetY": 322.6088878114683 }, "style": { "strokeWidth": 1, "strokeColor": "#13615A", "fill": "transparent", "strokeDashArray": "None", "opacity": 1, "gradient": { "type": "None" } }, "annotations": [], "fixedUserHandles": [], "visible": true, "constraints": 470590, "sourcePadding": 0, "targetPadding": 0, "tooltip": { "openOn": "Auto" }, "connectionPadding": 0, "bridgeSpace": 10, "hitPadding": 10, "parentId": "" }, { "shape": { "type": "None" }, "type": "Bezier", "sourcePortID": "", "sourcePoint": { "x": 820, "y": 480 }, "targetPoint": { "x": 654.07, "y": 480 }, "id": "connectorqH7yM", "sourceID": "", "zIndex": 61, "targetID": "", "targetPortID": "", "flip": "None", "segments": [{ "type": "Bezier", "vector2": { "angle": 0, "distance": 0 }, "point1": { "x": 0, "y": 0 }, "vector1": { "angle": 0, "distance": 0 }, "point2": { "x": 0, "y": 0 }, "point": { "x": 0, "y": 0 } }], "sourceDecorator": { "shape": "None", "width": 10, "height": 10, "pivot": { "x": 0, "y": 0.5 }, "style": { "fill": "#13615A", "strokeColor": "#13615A", "strokeWidth": 1, "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } } }, "targetDecorator": { "shape": "Arrow", "width": 10, "height": 10, "pivot": { "x": 0, "y": 0.5 }, "style": { "fill": "#13615A", "strokeColor": "#13615A", "strokeWidth": 1, "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } } }, "cornerRadius": 0, "wrapper": { "actualSize": { "width": 164.91531251345793, "height": 2.2737367544323206e-13 }, "offsetX": 737.542343743271, "offsetY": 480 }, "style": { "strokeWidth": 1, "strokeColor": "#13615A", "fill": "transparent", "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } }, "annotations": [{ "id": "G69Gh", "content": "NÃO", "annotationType": "String", "constraints": 4, "visibility": true, "rotateAngle": 0, "horizontalAlignment": "Center", "verticalAlignment": "Center", "width": 66.89333206176758, "height": 0.9399999999999976, "margin": { "left": 0.00040194798793891096, "right": 0, "top": 27.322746761723124, "bottom": 0 }, "style": { "strokeWidth": 0, "strokeColor": "transparent", "fill": "transparent", "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" }, "fontSize": 12, "fontFamily": "Arial", "textOverflow": "Wrap", "textDecoration": "None", "whiteSpace": "CollapseSpace", "textWrapping": "WrapWithOverflow", "textAlign": "Center", "color": "black", "italic": false, "bold": false }, "offset": 0.80973904658591, "alignment": "Center", "segmentAngle": false, "dragLimit": { "top": 0, "bottom": 0, "left": 0, "right": 0 } }], "fixedUserHandles": [], "visible": true, "constraints": 470590, "sourcePadding": 0, "targetPadding": 0, "tooltip": { "openOn": "Auto" }, "connectionPadding": 0, "bridgeSpace": 10, "hitPadding": 10, "parentId": "" }, { "shape": { "type": "None" }, "type": "Bezier", "sourcePortID": "", "sourcePoint": { "x": 850, "y": 507.4 }, "targetPoint": { "x": 850, "y": 580 }, "id": "connectorEFqns", "sourceID": "DecisãoIbNTy", "zIndex": 62, "targetID": "Términof7h5v", "targetPortID": "", "flip": "None", "segments": [{ "type": "Bezier", "point": { "x": 0, "y": 0 }, "vector1": { "angle": 0, "distance": 0 }, "vector2": { "angle": 0, "distance": 0 }, "point1": { "x": 0, "y": 0 }, "point2": { "x": 0, "y": 0 } }], "sourceDecorator": { "shape": "None", "width": 10, "height": 10, "pivot": { "x": 0, "y": 0.5 }, "style": { "fill": "#13615A", "strokeColor": "#13615A", "strokeWidth": 1, "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } } }, "targetDecorator": { "shape": "Arrow", "width": 10, "height": 10, "pivot": { "x": 0, "y": 0.5 }, "style": { "fill": "#13615A", "strokeColor": "#13615A", "strokeWidth": 1, "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } } }, "cornerRadius": 0, "wrapper": { "actualSize": { "width": 5.684341886080801e-13, "height": 71.76817123429555 }, "offsetX": 850, "offsetY": 543.2840856171478 }, "style": { "strokeWidth": 1, "strokeColor": "#13615A", "fill": "transparent", "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } }, "annotations": [{ "id": "wdh5J", "content": "SIM", "annotationType": "String", "constraints": 4, "visibility": true, "rotateAngle": 0, "horizontalAlignment": "Center", "verticalAlignment": "Center", "width": 37.56000000000001, "height": 14.399999999999999, "margin": { "left": 15.759999999999991, "right": 0, "top": 0, "bottom": 0 }, "style": { "strokeWidth": 0, "strokeColor": "transparent", "fill": "transparent", "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" }, "fontSize": 12, "fontFamily": "Arial", "textOverflow": "Wrap", "textDecoration": "None", "whiteSpace": "CollapseSpace", "textWrapping": "WrapWithOverflow", "textAlign": "Center", "color": "black", "italic": false, "bold": false }, "offset": 0.5705234159779623, "alignment": "Center", "segmentAngle": false, "dragLimit": { "top": 0, "bottom": 0, "left": 0, "right": 0 } }], "fixedUserHandles": [], "visible": true, "constraints": 470590, "sourcePadding": 0, "targetPadding": 0, "tooltip": { "openOn": "Auto" }, "connectionPadding": 0, "bridgeSpace": 10, "hitPadding": 10, "parentId": "" }, { "shape": { "type": "None" }, "type": "Bezier", "sourcePortID": "P7EEa", "sourcePoint": { "x": 915, "y": 617.5 }, "targetPoint": { "x": 1000.49, "y": 617.5 }, "id": "connectornFfFU", "sourceID": "Términof7h5v", "zIndex": 63, "targetID": "FimyMVro", "targetPortID": "", "flip": "None", "segments": [{ "type": "Bezier", "vector2": { "angle": 0, "distance": 0 }, "point1": { "x": 0, "y": 0 }, "vector1": { "angle": 0, "distance": 0 }, "point2": { "x": 0, "y": 0 }, "point": { "x": 0, "y": 0 } }], "sourceDecorator": { "shape": "None", "width": 10, "height": 10, "pivot": { "x": 0, "y": 0.5 }, "style": { "fill": "#13615A", "strokeColor": "#13615A", "strokeWidth": 1, "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } } }, "targetDecorator": { "shape": "Arrow", "width": 10, "height": 10, "pivot": { "x": 0, "y": 0.5 }, "style": { "fill": "#13615A", "strokeColor": "#13615A", "strokeWidth": 1, "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } } }, "cornerRadius": 0, "wrapper": { "actualSize": { "width": 83.41198356409109, "height": 0.2177777727991952 }, "offsetX": 956.7059917820455, "offsetY": 617.6088888863997 }, "style": { "strokeWidth": 1, "strokeColor": "#13615A", "fill": "transparent", "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } }, "annotations": [], "fixedUserHandles": [], "visible": true, "constraints": 470590, "sourcePadding": 0, "targetPadding": 0, "tooltip": { "openOn": "Auto" }, "connectionPadding": 0, "bridgeSpace": 10, "hitPadding": 10, "parentId": "" }, { "shape": { "type": "None" }, "type": "Bezier", "sourcePortID": "", "sourcePoint": { "x": 850, "y": 360 }, "targetPoint": { "x": 850, "y": 452.8 }, "id": "connectorJDXCK", "sourceID": "", "zIndex": 64, "targetID": "DecisãoIbNTy", "targetPortID": "", "flip": "None", "segments": [{ "type": "Bezier", "point1": { "x": 0, "y": 0 }, "vector1": { "angle": 0, "distance": 0 }, "point2": { "x": 0, "y": 0 }, "vector2": { "angle": 0, "distance": 0 }, "point": { "x": 0, "y": 0 } }], "sourceDecorator": { "shape": "None", "width": 10, "height": 10, "pivot": { "x": 0, "y": 0.5 }, "style": { "fill": "#13615A", "strokeColor": "#13615A", "strokeWidth": 1, "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } } }, "targetDecorator": { "shape": "Arrow", "width": 10, "height": 10, "pivot": { "x": 0, "y": 0.5 }, "style": { "fill": "#13615A", "strokeColor": "#13615A", "strokeWidth": 1, "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } } }, "cornerRadius": 0, "wrapper": { "actualSize": { "width": 4.547473508864641e-13, "height": 89.02049107531826 }, "offsetX": 850, "offsetY": 404.5102455376591 }, "style": { "strokeWidth": 1, "strokeColor": "#13615A", "fill": "transparent", "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } }, "annotations": [], "fixedUserHandles": [], "visible": true, "constraints": 470590, "sourcePadding": 0, "targetPadding": 0, "tooltip": { "openOn": "Auto" }, "connectionPadding": 0, "bridgeSpace": 10, "hitPadding": 10, "parentId": "" }, { "shape": { "type": "None" }, "type": "Bezier", "sourcePortID": "KcurV", "sourcePoint": { "x": 498.76, "y": 322.5 }, "targetPoint": { "x": 570, "y": 322.5 }, "id": "connectort3VCU", "sourceID": "TarefagGcIx", "zIndex": 65, "targetID": "TarefaEr0ya", "targetPortID": "", "flip": "None", "segments": [{ "type": "Bezier", "vector2": { "angle": 0, "distance": 0 }, "point1": { "x": 0, "y": 0 }, "vector1": { "angle": 0, "distance": 0 }, "point2": { "x": 0, "y": 0 }, "point": { "x": 0, "y": 0 } }], "sourceDecorator": { "shape": "None", "width": 10, "height": 10, "pivot": { "x": 0, "y": 0.5 }, "style": { "fill": "#13615A", "strokeColor": "#13615A", "strokeWidth": 1, "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } } }, "targetDecorator": { "shape": "Arrow", "width": 10, "height": 10, "pivot": { "x": 0, "y": 0.5 }, "style": { "fill": "#13615A", "strokeColor": "#13615A", "strokeWidth": 1, "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } } }, "cornerRadius": 0, "wrapper": { "actualSize": { "width": 68.16154356487618, "height": 0.2177070178795475 }, "offsetX": 532.8407717824381, "offsetY": 322.6088535089398 }, "style": { "strokeWidth": 1, "strokeColor": "#13615A", "fill": "transparent", "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } }, "annotations": [], "fixedUserHandles": [], "visible": true, "constraints": 470590, "sourcePadding": 0, "targetPadding": 0, "tooltip": { "openOn": "Auto" }, "connectionPadding": 0, "bridgeSpace": 10, "hitPadding": 10, "parentId": "" }, { "shape": { "type": "None" }, "type": "Bezier", "sourcePortID": "ZGcvm", "sourcePoint": { "x": 485.31, "y": 480 }, "targetPoint": { "x": 329.38, "y": 480 }, "id": "connectorlT5vP", "sourceID": "Tarefanpywr", "zIndex": 66, "targetID": "TarefaAc54U", "targetPortID": "", "flip": "None", "segments": [{ "type": "Bezier", "vector2": { "angle": 0, "distance": 0 }, "point1": { "x": 0, "y": 0 }, "vector1": { "angle": 0, "distance": 0 }, "point2": { "x": 0, "y": 0 }, "point": { "x": 0, "y": 0 } }], "sourceDecorator": { "shape": "None", "width": 10, "height": 10, "pivot": { "x": 0, "y": 0.5 }, "style": { "fill": "#13615A", "strokeColor": "#13615A", "strokeWidth": 1, "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } } }, "targetDecorator": { "shape": "Arrow", "width": 10, "height": 10, "pivot": { "x": 0, "y": 0.5 }, "style": { "fill": "#13615A", "strokeColor": "#13615A", "strokeWidth": 1, "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } } }, "cornerRadius": 0, "wrapper": { "actualSize": { "width": 152.48496772496236, "height": 2.8421709430404007e-13 }, "offsetX": 409.06751613751885, "offsetY": 480 }, "style": { "strokeWidth": 1, "strokeColor": "#13615A", "fill": "transparent", "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } }, "annotations": [], "fixedUserHandles": [], "visible": true, "constraints": 470590, "sourcePadding": 0, "targetPadding": 0, "tooltip": { "openOn": "Auto" }, "connectionPadding": 0, "bridgeSpace": 10, "hitPadding": 10, "parentId": "" }, { "shape": { "type": "None" }, "type": "Bezier", "sourcePortID": "", "sourcePoint": { "x": 254.38, "y": 440 }, "targetPoint": { "x": 254.38, "y": 360 }, "id": "connectorVy5Tw", "sourceID": "TarefaAc54U", "zIndex": 67, "targetID": "TarefagGcIxTTQBT", "targetPortID": "", "flip": "None", "segments": [{ "type": "Bezier", "point": { "x": 0, "y": 0 }, "vector1": { "angle": 0, "distance": 0 }, "vector2": { "angle": 0, "distance": 0 }, "point1": { "x": 0, "y": 0 }, "point2": { "x": 0, "y": 0 } }], "sourceDecorator": { "shape": "None", "width": 10, "height": 10, "pivot": { "x": 0, "y": 0.5 }, "style": { "fill": "#13615A", "strokeColor": "#13615A", "strokeWidth": 1, "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } } }, "targetDecorator": { "shape": "Arrow", "width": 10, "height": 10, "pivot": { "x": 0, "y": 0.5 }, "style": { "fill": "#13615A", "strokeColor": "#13615A", "strokeWidth": 1, "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } } }, "cornerRadius": 0, "wrapper": { "actualSize": { "width": 0.16881086927128308, "height": 77.25695366553668 }, "offsetX": 254.29559456536435, "offsetY": 401.37152316723166 }, "style": { "strokeWidth": 1, "strokeColor": "#13615A", "fill": "transparent", "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } }, "annotations": [], "fixedUserHandles": [], "visible": true, "constraints": 470590, "sourcePadding": 0, "targetPadding": 0, "tooltip": { "openOn": "Auto" }, "connectionPadding": 0, "bridgeSpace": 10, "hitPadding": 10, "parentId": "" }], "basicElements": [], "tooltip": { "content": "", "relativeMode": "Mouse" }, "commandManager": { "commands": [] }, "tool": 3, "bridgeDirection": "Top", "drawingObject": { "type": "Orthogonal", "sourcePortID": "P7EEa" }, "diagramSettings": { "inversedAlignment": true }, "customCursor": [], "version": 17.1 };
          diagram.loadDiagram(JSON.stringify(data));
          let connector: ConnectorModel = diagram.getObject('connectorqH7yM');
          expect(Math.floor(connector.wrapper.children[3].bounds.x) === 1868 && Math.floor(connector.wrapper.children[3].bounds.y) === 553).toBe(true);
          done();
    });
})

describe('Distribute command not working properly issue', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let zIndex: number = 0;
    let scroller: DiagramScroller;
    let mouseEvents: MouseEvents = new MouseEvents();
    beforeAll((): void => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }

        ele = createElement('div', { id: 'diagramorder2' });
        document.body.appendChild(ele);

        let nodes: NodeModel[] = [
            {
              id: 'node1',
              width: 50,
              height: 50,
              offsetX: 50,
              offsetY: 100,
              style: { fill: '#ff0000' },
            },
            {
              id: 'node2',
              width: 50,
              height: 50,
              offsetX: 150,
              offsetY: 150,
              style: { fill: '#ffff00' },
            },
            {
              id: 'node3',
              width: 50,
              height: 50,
              offsetX: 320,
              offsetY: 250,
              style: { fill: '#ff00ff' },
            },
            {
              id: 'node4',
              width: 50,
              height: 50,
              offsetX: 340,
              offsetY: 180,
              style: { fill: '#00ff00' },
            },
            {
              id: 'node5',
              width: 50,
              height: 50,
              offsetX: 450,
              offsetY: 200,
              style: { fill: '#00ffff' },
            },
          ];
        diagram = new Diagram({
            width: '1000px', height: '500px', nodes: nodes
        });
        diagram.appendTo('#diagramorder2');

    });
    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });

    it('Check node does not get changed position while use distribute command again', (done: Function) => {
        diagram.distribute('RightToLeft', diagram.nodes);
        expect(diagram.nodes[1].offsetX === 150 && diagram.nodes[1].offsetY === 150 && diagram.nodes[2].offsetX === 250 && diagram.nodes[2].offsetY === 250).toBe(true);
        diagram.distribute('RightToLeft', diagram.nodes);
        expect(diagram.nodes[1].offsetX === 150 && diagram.nodes[1].offsetY === 150 && diagram.nodes[2].offsetX === 250 && diagram.nodes[2].offsetY === 250).toBe(true);
        done();
    });
})

describe('Connector gets crossed each other issue', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    
    beforeAll(() => {

        ele = createElement('div', { id: 'diagramlayout' });
        document.body.appendChild(ele);

        let Data: any = [
            { Name: 'node11', fillColor: '#e7704c', border: '#c15433' },
            {
                Name: 'node12',
                ReportingPerson: ['node11'],
                fillColor: '#efd46e',
                border: '#d6b123',
            },
            {
                Name: 'node13',
                ReportingPerson: ['node12'],
                fillColor: '#efd46e',
                border: '#d6b123',
            },
            {
                Name: 'node14',
                ReportingPerson: ['node13'],
                fillColor: '#efd46e',
                border: '#d6b123',
            },
            {
                Name: 'node15',
                ReportingPerson: ['node13'],
                fillColor: '#efd46e',
                border: '#d6b123',
            },
            {
                Name: 'node16',
                ReportingPerson: ['node15'],
                fillColor: '#efd46e',
                border: '#d6b123',
            },
        ];

        let items: DataManager = new DataManager(Data as JSON[], new Query().take(7));

         diagram = new Diagram({
            width: 1500, height: 2500,
            layout: {
                type: 'ComplexHierarchicalTree',
                connectionPointOrigin: ConnectionPointOrigin.DifferentPoint,
                horizontalSpacing: 40,
                verticalSpacing: 40,
                orientation: 'LeftToRight',
                margin: { left: 10, right: 0, top: 100, bottom: 0 },
                verticalAlignment: 'Top',
                horizontalAlignment: 'Center'
            },
            dataSourceSettings: {
                id: 'Name', parentId: 'ReportingPerson', dataSource: items,
                doBinding: (nodeModel: NodeModel, data: object, diagram: Diagram) => {
                    nodeModel.id = (data as any).Name;
                    nodeModel.style = { fill: (data as any).fillColor };
                    nodeModel.annotations = [
                        {
                            content: (data as any).Name
                        }
                    ];
                }
            },
            getNodeDefaults: (obj: Node, diagram: Diagram) => {
                obj.width = 50;
                obj.height = 50;
                //Initialize shape
                obj.shape = { type: 'Basic', shape: 'Rectangle', cornerRadius: 7 };
                return obj;
            }, getConnectorDefaults: (connector: ConnectorModel, diagram: Diagram) => {
                connector.type = 'Orthogonal';
                connector.cornerRadius = 7;
                connector.targetDecorator.height = 7;
                connector.targetDecorator.width = 7;
                connector.style.strokeColor = '#6d6d6d';
            }
        });
        diagram.appendTo('#diagramlayout');

    });
    afterAll(() => {
        diagram.destroy();
        ele.remove();
    });
    it('Check whether connector are arranged properly in layout', function (done) {
        let connector: ConnectorModel = {
            id: 'node14_node16',
            sourceID: "node14",
            targetID: "node16",
            cornerRadius: 10,
            type: 'Orthogonal',
    
        };
        diagram.add(connector);
        diagram.layout.arrangement = ChildArrangement.Linear;
        diagram.layout.connectionPointOrigin =
                ConnectionPointOrigin.DifferentPoint;
        diagram.doLayout();
        let node: NodeModel = diagram.getObject('node16');
        let connector1: ConnectorModel = diagram.getObject((node as Node).inEdges[0]);
        let connector2: ConnectorModel = diagram.getObject((node as Node).inEdges[1]);
        expect(connector1.targetPoint.y < connector2.targetPoint.y).toBe(true);
        done();
    });

});

describe('Property Change event Order commands issue', () => {
    let diagram: Diagram;
    let ele: HTMLElement;

    beforeAll(() => {

        ele = createElement('div', { id: 'diagramorder' });
        document.body.appendChild(ele);

        let node: NodeModel = {
            id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100, annotations: [ { content: 'Node1'}],
            style: { fill: 'red'}
        };
        let node2: NodeModel = {
            id: 'node2', width: 100, height: 100, offsetX: 125, offsetY: 125, annotations: [ { content: 'Node2'}],
            style: { fill: 'blue'}
        };
        let node3: NodeModel = {
            id: 'node3', width: 100, height: 100, offsetX: 150, offsetY: 150, annotations: [ { content: 'Node3'}],
            style: { fill: 'green'}
        };
        let node4: NodeModel = {
            id: 'node4', width: 100, height: 100, offsetX: 175, offsetY: 175, annotations: [ { content: 'Node4'}],
            style: { fill: 'yellow'}
        };
        let node5: NodeModel = {
            id: 'node5', width: 100, height: 100, offsetX: 200, offsetY: 200, annotations: [ { content: 'Node5'}],
            style: { fill: 'magenta'}
        };
        diagram = new Diagram({
            width: '1000px', height: '800px', nodes: [node, node2, node3, node4, node5],

        });


        diagram.appendTo('#diagramorder');

    });
    afterAll(() => {
        diagram.destroy();
        ele.remove();
    });
    it('Check whether Only ZIndex values updated in propertyChange event newValue argument - bringToFront', function (done) {
        diagram.select([diagram.nodes[0]]);
        diagram.propertyChange = (args: IPropertyChangeEventArgs) => {
            if(args.newValue && (args.newValue as any).zIndex !== undefined ) {
                expect((args.newValue as any).zIndex === 4).toBe(true);
                expect((args.oldValue as any).zIndex === 0).toBe(true);
            }
        }
        diagram.bringToFront();
        done();
    });

});

describe('Property Change event Order commands issue', () => {
    let diagram: Diagram;
    let ele: HTMLElement;

    beforeAll(() => {

        ele = createElement('div', { id: 'diagramorder' });
        document.body.appendChild(ele);

        let node: NodeModel = {
            id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100, annotations: [ { content: 'Node1'}],
            style: { fill: 'red'}
        };
        let node2: NodeModel = {
            id: 'node2', width: 100, height: 100, offsetX: 125, offsetY: 125, annotations: [ { content: 'Node2'}],
            style: { fill: 'blue'}
        };
        let node3: NodeModel = {
            id: 'node3', width: 100, height: 100, offsetX: 150, offsetY: 150, annotations: [ { content: 'Node3'}],
            style: { fill: 'green'}
        };
        let node4: NodeModel = {
            id: 'node4', width: 100, height: 100, offsetX: 175, offsetY: 175, annotations: [ { content: 'Node4'}],
            style: { fill: 'yellow'}
        };
        let node5: NodeModel = {
            id: 'node5', width: 100, height: 100, offsetX: 200, offsetY: 200, annotations: [ { content: 'Node5'}],
            style: { fill: 'magenta'}
        };
        diagram = new Diagram({
            width: '1000px', height: '800px', nodes: [node, node2, node3, node4, node5],

        });


        diagram.appendTo('#diagramorder');

    });
    afterAll(() => {
        diagram.destroy();
        ele.remove();
    });
    it('Check whether Only ZIndex values updated in propertyChange event newValue argument - SendToBack', function (done) {
        diagram.select([diagram.nodes[4]]);
        diagram.propertyChange = (args: IPropertyChangeEventArgs) => {
            if(args.newValue && (args.newValue as any).zIndex !== undefined ) {
                expect((args.newValue as any).zIndex === 0).toBe(true);
                expect((args.oldValue as any).zIndex === 4).toBe(true);
            }
        }
        diagram.sendToBack();
        done();
    });

}); 

describe('BPMN text annotation not dragged properly issue', () => {
    let diagram: Diagram;
    let ele: HTMLElement;

    beforeAll(() => {

        ele = createElement('div', { id: 'diagramorder' });
        document.body.appendChild(ele);

        let nodes: NodeModel[] = [
            {
                id: 'bpmn', width: 100, height: 100, offsetX: 100, offsetY: 100,
                shape: {
                    type: 'Bpmn', shape: 'Event',
                    dataObject: { collection: false, type: 'Input' },
                    annotations: [
                        { id: 'bottom', angle: 120, length: 150, text: 'Bottom' }
                    ]
                } as BpmnShapeModel,
            },
            {
                id: 'swimlane',
                shape: {
                    orientation: 'Horizontal',
                    type: 'SwimLane',
                    header: {
                        annotation: { content: 'Header' },
                        height: 50, style: { fill: "red", fontSize: 11 },
                    },
                    lanes: [
                        {
                            id: 'stackCanvas1',
                            header: {
                                annotation: { content: 'CUSTOMER' }, height: 50,
                                style: { fill: "red", fontSize: 11 }
                            },
                            style: { fill: "blue" },
                            width: 140,
                            children: [
                                {
                                    id: 'bpmntext', width: 100, height: 100, margin: { left: 100, top: 20},
                                    shape: {
                                        type: 'Bpmn', shape: 'Event',
                                        dataObject: { collection: false, type: 'Input' },
                                        annotations: [
                                            { id: 'bottom', angle: 120, length: 150, text: 'Bottom' }
                                        ]
                                    } as BpmnShapeModel,
                                },
                            ]
                        },
                    ],
                    phases: [
                        {
                            id: 'phase1', offset: 200,
                            style: { strokeWidth: 1, strokeDashArray: '3,3', strokeColor: '#606060' },
                            header: { annotation: { content: 'Phase' } }
                        },
                    ],
                    phaseSize: 20,
                },
                offsetX: 500, offsetY: 300,
                height: 250, width: 650
            },
        ];
        diagram = new Diagram({
            width: '100%', height: 1300, nodes: nodes
        });


        diagram.appendTo('#diagramorder');

    });
    afterAll(() => {
        diagram.destroy();
        ele.remove();
    });
    it('Check whether BPMN text node update properly while drag the swimlane', function (done) {
        let mouseEvents: MouseEvents = new MouseEvents();
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        diagram.select([diagram.nodes[0]]);
        mouseEvents.mouseDownEvent(diagramCanvas, 500, 220);
        mouseEvents.mouseMoveEvent(diagramCanvas, 500 + 15, 220);
        mouseEvents.mouseUpEvent(diagramCanvas, 500 + 15, 220);
        let node: NodeModel = diagram.getObject('bpmntext');
        expect(Math.ceil((node.wrapper.children[0] as Canvas).children[4].offsetX) === 231).toBe(true);
        expect(Math.ceil((node.wrapper.children[0] as Canvas).children[4].offsetY) === 438).toBe(true);
        done();
    });

});

describe('Click event not triggered properly in scrollbar position issue', () => {
    let diagram: Diagram;
    let ele: HTMLElement;

    beforeAll(() => {

        ele = createElement('div', { id: 'diagramorder' });
        document.body.appendChild(ele);

        let node: NodeModel = {
            id: 'node1', width: 150, height: 100, offsetX: 100, offsetY: 100, annotations: [{ content: 'Node1' }],
            flipMode: 'None', flip: 'Horizontal'
        };
        let node2: NodeModel = {
            id: 'node2', width: 80, height: 130, offsetX: 200, offsetY: 200, annotations: [{ content: 'Node2' }]
        };
        let node3: NodeModel = {
            id: 'node3', width: 100, height: 100, offsetX: 500, offsetY: 500, annotations: [{ content: 'Node3' }]
        };
        diagram = new Diagram({
            width: '500px', height: '500px', nodes: [node, node2, node3],
            scrollSettings: { horizontalOffset: -66, verticalOffset: -66 },
        });


        diagram.appendTo('#diagramorder');

    });
    afterAll(() => {
        diagram.destroy();
        ele.remove();
    });
    it('Check whether click event triggered properly or not', function (done) {
        let mouseEvents: MouseEvents = new MouseEvents();
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        diagram.click = (args: IClickEventArgs) => {
            if(args.element) {
                expect(args.element!== null).toBe(true);
            }
        }
        mouseEvents.clickEvent(diagramCanvas, 492, 442);
        done();
    });

});

describe('Prevent segment thumb rendering while render orthogonal connector as straight segment line', () => {
    let diagram: Diagram;
    let ele: HTMLElement;

    beforeAll(() => {

        ele = createElement('div', { id: 'diagramsegment' });
        document.body.appendChild(ele);

        let nodes: NodeModel[] = [
            {
                id: 'node1', height: 50, width: 100, offsetX: 200, offsetY: 100, annotations: [{ content: 'Node1' }],
                ports: [
                    { id: 'left', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Visible, constraints: PortConstraints.Default },
                    { id: 'top', offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Visible, constraints: PortConstraints.Default  },
                    { id: 'right', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Visible, constraints: PortConstraints.Default  },
                    { id: 'bottom', offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Visible, constraints: PortConstraints.Default }
                ]
            },
            {
                id: 'node2', height: 50, width: 100, offsetX: 500, offsetY: 100, annotations: [{ content: 'Node2' }],
                ports: [
                    { id: 'left', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Visible, constraints: PortConstraints.Default },
                    { id: 'top', offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Visible, constraints: PortConstraints.Default },
                    { id: 'right', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Visible, constraints: PortConstraints.Default },
                    { id: 'bottom', offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Visible, constraints: PortConstraints.Default }
                ]
            },
        ];
        
        let connectors: ConnectorModel[] = [
            {
                id: 'connector1', sourceID: 'node1', targetID: 'node2', sourcePortID: 'right', targetPortID: 'left'
            }
        ];
        diagram = new Diagram({
            width: '900px', height: '500px', nodes: nodes, connectors: connectors,
            getConnectorDefaults: function (connector: ConnectorModel) {
                connector.type = 'Orthogonal';
                connector.constraints = ConnectorConstraints.Default | ConnectorConstraints.DragSegmentThumb;
                connector.maxSegmentThumb = 3;
                connector.allowNodeOverlap = true;
            }
        });
        diagram.appendTo('#diagramsegment');

    });
    afterAll(() => {
        diagram.destroy();
        ele.remove();
    });
    it('Render connector as straight line segment and check whether segment rendered or not', function (done) {
        diagram.select([diagram.connectors[0]]);
        let element: HTMLElement = document.getElementById('orthoThumb_1_2');
        expect(element === null).toBe(true);
        done();
    });

});

describe('Check whether connector segment overlap node-Right-Left', () => {
    let diagram: Diagram;
    let ele: HTMLElement;

    beforeAll(() => {

        ele = createElement('div', { id: 'diagramsegment' });
        document.body.appendChild(ele);

        let nodes: NodeModel[] = [
            {
                id: 'node1', height: 50, width: 100, offsetX: 200, offsetY: 100, annotations: [{ content: 'Node1' }],
                ports: [
                    { id: 'left', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Visible, constraints: PortConstraints.Default },
                    { id: 'top', offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Visible, constraints: PortConstraints.Default  },
                    { id: 'right', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Visible, constraints: PortConstraints.Default  },
                    { id: 'bottom', offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Visible, constraints: PortConstraints.Default }
                ]
            },
            {
                id: 'node2', height: 50, width: 100, offsetX: 500, offsetY: 250, annotations: [{ content: 'Node2' }],
                ports: [
                    { id: 'left', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Visible, constraints: PortConstraints.Default },
                    { id: 'top', offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Visible, constraints: PortConstraints.Default },
                    { id: 'right', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Visible, constraints: PortConstraints.Default },
                    { id: 'bottom', offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Visible, constraints: PortConstraints.Default }
                ]
            },
        ];
        
        let connectors: ConnectorModel[] = [
            {
                id: 'connector1', sourceID: 'node1', targetID: 'node2', sourcePortID: 'right', targetPortID: 'left'
            }
        ];
        diagram = new Diagram({
            width: '900px', height: '500px', nodes: nodes, connectors: connectors,
            getConnectorDefaults: function (connector: ConnectorModel) {
                connector.type = 'Orthogonal';
                connector.constraints = ConnectorConstraints.Default | ConnectorConstraints.DragSegmentThumb;
                connector.maxSegmentThumb = 3;
                connector.allowNodeOverlap = true;
            }
        });
        diagram.appendTo('#diagramsegment');

    });
    afterAll(() => {
        diagram.destroy();
        ele.remove();
    });
    it('Move First segment towards source node and check whether connector does not get intersect', function (done) {
        let mouseEvents: MouseEvents = new MouseEvents();
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        diagram.select([diagram.connectors[0]]);
        let element: HTMLElement = document.getElementById('orthoThumb_1_2');
        let bounds: any = element.getBoundingClientRect();
        mouseEvents.mouseDownEvent(diagramCanvas, bounds.x, bounds.y);
        mouseEvents.mouseMoveEvent(diagramCanvas, bounds.x - 50, bounds.y);
        mouseEvents.mouseUpEvent(diagramCanvas, bounds.x - 50, bounds.y );
        let connector: ConnectorModel = diagram.connectors[0];
        expect(connector.segments.length === 3).toBe(true);
        done();
    });
    it('Move First segment towards target node and check whether connector does not get intersect', function (done) {
        let mouseEvents: MouseEvents = new MouseEvents();
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        let element: HTMLElement = document.getElementById('orthoThumb_2_1');
        let bounds: any = element.getBoundingClientRect();
        mouseEvents.mouseDownEvent(diagramCanvas, bounds.x, bounds.y);
        mouseEvents.mouseMoveEvent(diagramCanvas, bounds.x + 350, bounds.y);
        mouseEvents.mouseUpEvent(diagramCanvas, bounds.x + 350, bounds.y );
        let connector: ConnectorModel = diagram.connectors[0];
        expect(connector.segments.length === 3).toBe(true);
        done();
    });

});

describe('Check whether connector segment overlap node-Left-Right - 1', () => {
    let diagram: Diagram;
    let ele: HTMLElement;

    beforeAll(() => {

        ele = createElement('div', { id: 'diagramsegment' });
        document.body.appendChild(ele);

        let nodes: NodeModel[] = [
            {
                id: 'node1', height: 50, width: 100, offsetX: 200, offsetY: 100, annotations: [{ content: 'Node1' }],
                ports: [
                    { id: 'left', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Visible, constraints: PortConstraints.Default },
                    { id: 'top', offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Visible, constraints: PortConstraints.Default  },
                    { id: 'right', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Visible, constraints: PortConstraints.Default  },
                    { id: 'bottom', offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Visible, constraints: PortConstraints.Default }
                ]
            },
            {
                id: 'node2', height: 50, width: 100, offsetX: 500, offsetY: 250, annotations: [{ content: 'Node2' }],
                ports: [
                    { id: 'left', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Visible, constraints: PortConstraints.Default },
                    { id: 'top', offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Visible, constraints: PortConstraints.Default },
                    { id: 'right', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Visible, constraints: PortConstraints.Default },
                    { id: 'bottom', offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Visible, constraints: PortConstraints.Default }
                ]
            },
        ];
        
        let connectors: ConnectorModel[] = [
            {
                id: 'connector1', sourceID: 'node1', targetID: 'node2', sourcePortID: 'left', targetPortID: 'right'
            }
        ];
        diagram = new Diagram({
            width: '900px', height: '500px', nodes: nodes, connectors: connectors,
            getConnectorDefaults: function (connector: ConnectorModel) {
                connector.type = 'Orthogonal';
                connector.constraints = ConnectorConstraints.Default | ConnectorConstraints.DragSegmentThumb;
                connector.maxSegmentThumb = 3;
                connector.allowNodeOverlap = true;
            }
        });
        diagram.appendTo('#diagramsegment');

    });
    afterAll(() => {
        diagram.destroy();
        ele.remove();
    });
    it('Move Middle segment towards target node', function (done) {
        let mouseEvents: MouseEvents = new MouseEvents();
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        diagram.select([diagram.connectors[0]]);
        let element: HTMLElement = document.getElementById('orthoThumb_1_3');
        let bounds: any = element.getBoundingClientRect();
        mouseEvents.mouseDownEvent(diagramCanvas, bounds.x, bounds.y);
        mouseEvents.mouseMoveEvent(diagramCanvas, bounds.x, bounds.y + 50);
        mouseEvents.mouseUpEvent(diagramCanvas, bounds.x, bounds.y + 50);
        let connector: ConnectorModel = diagram.connectors[0];
        expect(connector.segments.length === 5).toBe(true);
        done();
    });
    it('Move First segment towards source node and check whether connector does not get intersect', function (done) {
        let mouseEvents: MouseEvents = new MouseEvents();
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        let element: HTMLElement = document.getElementById('orthoThumb_2_1');
        let bounds: any = element.getBoundingClientRect();
        mouseEvents.mouseDownEvent(diagramCanvas, bounds.x, bounds.y);
        mouseEvents.mouseMoveEvent(diagramCanvas, bounds.x + 100, bounds.y);
        mouseEvents.mouseUpEvent(diagramCanvas, bounds.x + 100, bounds.y );
        let connector: ConnectorModel = diagram.connectors[0];
        expect(connector.segments.length === 5).toBe(true);
        done();
    });

});

describe('Check whether connector segment overlap node-Left-Right - 2', () => {
    let diagram: Diagram;
    let ele: HTMLElement;

    beforeAll(() => {

        ele = createElement('div', { id: 'diagramsegment' });
        document.body.appendChild(ele);

        let nodes: NodeModel[] = [
            {
                id: 'node1', height: 50, width: 100, offsetX: 200, offsetY: 100, annotations: [{ content: 'Node1' }],
                ports: [
                    { id: 'left', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Visible, constraints: PortConstraints.Default },
                    { id: 'top', offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Visible, constraints: PortConstraints.Default  },
                    { id: 'right', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Visible, constraints: PortConstraints.Default  },
                    { id: 'bottom', offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Visible, constraints: PortConstraints.Default }
                ]
            },
            {
                id: 'node2', height: 50, width: 100, offsetX: 500, offsetY: 250, annotations: [{ content: 'Node2' }],
                ports: [
                    { id: 'left', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Visible, constraints: PortConstraints.Default },
                    { id: 'top', offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Visible, constraints: PortConstraints.Default },
                    { id: 'right', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Visible, constraints: PortConstraints.Default },
                    { id: 'bottom', offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Visible, constraints: PortConstraints.Default }
                ]
            },
        ];
        
        let connectors: ConnectorModel[] = [
            {
                id: 'connector1', sourceID: 'node1', targetID: 'node2', sourcePortID: 'left', targetPortID: 'right'
            }
        ];
        diagram = new Diagram({
            width: '900px', height: '500px', nodes: nodes, connectors: connectors,
            getConnectorDefaults: function (connector: ConnectorModel) {
                connector.type = 'Orthogonal';
                connector.constraints = ConnectorConstraints.Default | ConnectorConstraints.DragSegmentThumb;
                connector.maxSegmentThumb = 3;
                connector.allowNodeOverlap = true;
            }
        });
        diagram.appendTo('#diagramsegment');

    });
    afterAll(() => {
        diagram.destroy();
        ele.remove();
    });
    it('Move Middle segment towards target node', function (done) {
        let mouseEvents: MouseEvents = new MouseEvents();
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        diagram.select([diagram.connectors[0]]);
        let element: HTMLElement = document.getElementById('orthoThumb_1_3');
        let bounds: any = element.getBoundingClientRect();
        mouseEvents.mouseDownEvent(diagramCanvas, bounds.x, bounds.y);
        mouseEvents.mouseMoveEvent(diagramCanvas, bounds.x, bounds.y + 50);
        mouseEvents.mouseUpEvent(diagramCanvas, bounds.x, bounds.y + 50);
        let connector: ConnectorModel = diagram.connectors[0];
        expect(connector.segments.length === 5).toBe(true);
        done();
    });
    it('Move last segment towards target node and check whether connector does not get intersect', function (done) {
        let mouseEvents: MouseEvents = new MouseEvents();
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        let element: HTMLElement = document.getElementById('orthoThumb_4_1');
        let bounds: any = element.getBoundingClientRect();
        mouseEvents.mouseDownEvent(diagramCanvas, bounds.x, bounds.y);
        mouseEvents.mouseMoveEvent(diagramCanvas, bounds.x - 100, bounds.y);
        mouseEvents.mouseUpEvent(diagramCanvas, bounds.x - 100, bounds.y );
        let connector: ConnectorModel = diagram.connectors[0];
        expect(connector.segments.length === 5).toBe(true);
        done();
    });
    it('Move Middle segment towards source node', function (done) {
        let mouseEvents: MouseEvents = new MouseEvents();
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        diagram.select([diagram.connectors[0]]);
        let element: HTMLElement = document.getElementById('orthoThumb_3_1');
        let bounds: any = element.getBoundingClientRect();
        mouseEvents.mouseDownEvent(diagramCanvas, bounds.x, bounds.y);
        mouseEvents.mouseMoveEvent(diagramCanvas, bounds.x, bounds.y - 50);
        mouseEvents.mouseUpEvent(diagramCanvas, bounds.x, bounds.y - 50);
        let connector: ConnectorModel = diagram.connectors[0];
        expect(connector.segments.length === 5).toBe(true);
        done();
    });

});

describe('Resize handle not rendered properly issue', () => {
    let diagram: Diagram;
    let ele: HTMLElement;

    beforeAll(() => {

        ele = createElement('div', { id: 'diagrampivot' });
        document.body.appendChild(ele);

        let nodes: NodeModel[] = [
            {
                id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100, annotations: [{ content: 'Node1' }],
                pivot: { x: 0, y: 0 }
            },
            {
                id: 'node2', height: 100, width: 100, offsetX: 300, offsetY: 100, annotations: [{ content: 'Node2' }],
                pivot: { x: 0.5, y: 0.5 }
            },
            {
                id: 'node3', height: 100, width: 100, offsetX: 300, offsetY: 200, annotations: [{ content: 'Node2' }],
                pivot: { x: 1, y: 1 }
            }
        ];
        diagram = new Diagram({
            width: '900px', height: '500px', nodes: nodes,
        });
        diagram.appendTo('#diagrampivot');

    });
    afterAll(() => {
        diagram.destroy();
        ele.remove();
    });
    it('Check whether resize handle renders properly for node pivot - 0, 0', function (done) {
        diagram.select([diagram.nodes[0]]);
        let northWestelement: HTMLElement = document.getElementById('resizeNorthWest');
        let northEastelement: HTMLElement = document.getElementById('resizeNorthEast');
        let southWestelement: HTMLElement = document.getElementById('resizeSouthWest');
        let southEastelement: HTMLElement = document.getElementById('resizeSouthEast');
        expect(northWestelement.getAttribute('x') === '93' && northWestelement.getAttribute('y') === '93').toBe(true);
        expect(northEastelement.getAttribute('x') === '193' && northEastelement.getAttribute('y') === '93').toBe(true);
        expect(southWestelement.getAttribute('x') === '93' && southWestelement.getAttribute('y') === '193').toBe(true);
        expect(southEastelement.getAttribute('x') === '193' && southEastelement.getAttribute('y') === '193').toBe(true);
        done();
    });

    it('Check whether resize handle renders properly for node pivot - 1, 1', function (done) {
        diagram.select([diagram.nodes[2]]);
        let northWestelement: HTMLElement = document.getElementById('resizeNorthWest');
        let northEastelement: HTMLElement = document.getElementById('resizeNorthEast');
        let southWestelement: HTMLElement = document.getElementById('resizeSouthWest');
        let southEastelement: HTMLElement = document.getElementById('resizeSouthEast');
        expect(northWestelement.getAttribute('x') === '393' && northWestelement.getAttribute('y') === '193').toBe(true);
        expect(northEastelement.getAttribute('x') === '493' && northEastelement.getAttribute('y') === '193').toBe(true);
        expect(southWestelement.getAttribute('x') === '393' && southWestelement.getAttribute('y') === '293').toBe(true);
        expect(southEastelement.getAttribute('x') === '493' && southEastelement.getAttribute('y') === '293').toBe(true);
        done();
    });

    it('Check whether resize handle renders properly after rotate the node', function (done) {
        diagram.clearSelection();
        diagram.select([diagram.nodes[0]]);
        diagram.nodes[0].rotateAngle = 90;
        diagram.dataBind();
        let northWestelement: HTMLElement = document.getElementById('resizeNorthWest');
        let northEastelement: HTMLElement = document.getElementById('resizeNorthEast');
        let southWestelement: HTMLElement = document.getElementById('resizeSouthWest');
        let southEastelement: HTMLElement = document.getElementById('resizeSouthEast');
        expect(northWestelement.getAttribute('x') === '93' && northWestelement.getAttribute('y') === '93').toBe(true);
        expect(northEastelement.getAttribute('x') === '93' && northEastelement.getAttribute('y') === '193').toBe(true);
        expect(southWestelement.getAttribute('x') === '-7' && southWestelement.getAttribute('y') === '93').toBe(true);
        expect(southEastelement.getAttribute('x') === '-7' && southEastelement.getAttribute('y') === '193').toBe(true);
        done();
    });

});