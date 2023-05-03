import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { ConnectorModel } from '../../../src/diagram/objects/connector-model';
import { NodeModel, PathModel, FlowShapeModel, TextModel } from '../../../src/diagram/objects/node-model';
import { MouseEvents } from '../interaction/mouseevents.spec';
import { UndoRedo } from '../../../src/diagram/objects/undo-redo';
import { HistoryEntry, History } from '../../../src/diagram/diagram/history';
import { SnapConstraints, PointPortModel, AnnotationModel, PathElement, ConnectorBridging } from '../../../src/diagram/index';
import { PortConstraints, PortVisibility, ConnectorConstraints, NodeConstraints, DecoratorShapes, DiagramConstraints } from '../../../src/diagram/enum/enum';
Diagram.Inject(UndoRedo);
/**
 * Interaction Specification Document
 */
describe('Diagram Control', () => {

    describe('Flip Operation for node', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        let mouseEvents: MouseEvents = new MouseEvents();

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram12' });
            document.body.appendChild(ele);
            let selArray: (NodeModel | ConnectorModel)[] = [];
            let node: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100, shape: { type: 'Basic', shape: 'RightTriangle' },

            };
            diagram = new Diagram({
                width: '600', height: '530px', nodes: [node],
                snapSettings: { constraints: SnapConstraints.ShowLines }
            });

            diagram.appendTo('#diagram12');

        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking flip horizontal to node', (done: Function) => {

            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let element: HTMLElement = document.getElementById(diagram.nodes[0].id + '_' + 'content');
            diagram.nodes[0].flip= "Horizontal";
            expect(diagram.nodes[0].offsetX === 100 && diagram.nodes[0].offsetY === 100).toBe(true);
            done();

        });
        it('Checking flip horizontal after changing node width', (done: Function) => {

            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let element: HTMLElement = document.getElementById(diagram.nodes[0].id + '_' + 'content');
            diagram.nodes[0].width = 400;
            diagram.nodes[0].flip= "Horizontal";
            expect(diagram.nodes[0].offsetX === 100 && diagram.nodes[0].offsetY === 100).toBe(true);
            done();

        });

        it('Checking flip horizontal after changing node height', (done: Function) => {

            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let element: HTMLElement = document.getElementById(diagram.nodes[0].id + '_' + 'content');
            diagram.nodes[0].height = 400;
            diagram.nodes[0].flip= "Horizontal";
            expect(diagram.nodes[0].offsetX === 100 && diagram.nodes[0].offsetY === 100).toBe(true);
            done();

        });
        it('Checking flip horizontal after changing node offsetX', (done: Function) => {

            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let element: HTMLElement = document.getElementById(diagram.nodes[0].id + '_' + 'content');
            diagram.nodes[0].offsetX = 400;
            diagram.nodes[0].flip= "Horizontal";
            expect(diagram.nodes[0].offsetX === 400 && diagram.nodes[0].offsetY === 100).toBe(true);
            done();

        });
        it('Checking flip horizontal after changing node offsetY', (done: Function) => {

            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let element: HTMLElement = document.getElementById(diagram.nodes[0].id + '_' + 'content');
            diagram.nodes[0].offsetY = 400;
            diagram.nodes[0].flip= "Horizontal";
            expect(diagram.nodes[0].offsetX === 400 && diagram.nodes[0].offsetY === 400).toBe(true);
            done();

        });
        it('Checking flip vertical after changing node offsetY', (done: Function) => {

            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let element: HTMLElement = document.getElementById(diagram.nodes[0].id + '_' + 'content');
            diagram.nodes[0].offsetY = 400;
            diagram.nodes[0].flip= "Vertical";
            expect(diagram.nodes[0].offsetX === 400 && diagram.nodes[0].offsetY === 400).toBe(true);
            done();

        });
        it('Checking flip Both after changing node offsetY', (done: Function) => {

            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let element: HTMLElement = document.getElementById(diagram.nodes[0].id + '_' + 'content');
            diagram.nodes[0].offsetY = 400;
            diagram.nodes[0].flip= "Both";
            expect(diagram.nodes[0].offsetX === 400 && diagram.nodes[0].offsetY === 400).toBe(true);
            done();

        });
    });

    describe('Flip Operation for connector', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        let mouseEvents: MouseEvents = new MouseEvents();

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram12' });
            document.body.appendChild(ele);
            let node: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100, shape: { type: 'Basic', shape: 'RightTriangle' },

            };
            let node2: NodeModel = {
                id: 'node2', width: 100, height: 100, offsetX: 400, offsetY: 500, shape: { type: 'Basic', shape: 'RightTriangle' },

            };
            let connector: ConnectorModel = {
                id: 'connector1', sourcePoint: { x: 200, y: 200 },
                targetPoint: { x: 400, y: 400 }, type: 'Orthogonal'
            }
            let connector2: ConnectorModel = {
                id: 'connector2', sourceID: 'node1', targetID: 'node2', type: 'Orthogonal'
            }
            diagram = new Diagram({
                width: '600', height: '530px', nodes: [node, node2],
                connectors: [connector, connector2],
                snapSettings: { constraints: SnapConstraints.ShowLines }
            });

            diagram.appendTo('#diagram12');

        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking flip horizontal to connector', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let element: HTMLElement = document.getElementById(diagram.nodes[0].id + '_' + 'content');
            diagram.connectors[0].flip= "Horizontal";
            done();
        });
        it('Checking flip vertical to connector', (done: Function) => {
            expect(diagram.connectors[0].sourcePoint.x === 400 && diagram.connectors[0].sourcePoint.y === 200 &&
                diagram.connectors[0].targetPoint.x === 200 && diagram.connectors[0].targetPoint.y === 400).toBe(true);
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let element: HTMLElement = document.getElementById(diagram.nodes[0].id + '_' + 'content');
            diagram.connectors[0].flip= "Vertical";
            done();
        });
        it('Checking flip vertical for connector source point change', (done: Function) => {
            expect((diagram.connectors[0].wrapper.children[0] as PathElement).absolutePath ===
            'M 200 200 L 200 180 L 0 180 L 0 0.5').toBe(true);
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let element: HTMLElement = document.getElementById(diagram.nodes[0].id + '_' + 'content');
            diagram.connectors[0].sourcePoint = { x: 100, y: 100 };
            diagram.connectors[0].flip= "Horizontal";
            done();
        });
        it('Checking flip vertical for connector target  point change', (done: Function) => {
            expect((diagram.connectors[0].wrapper.children[0] as PathElement).absolutePath ===
            'M 100 0 L 100 20 L 0 20 L 0 99.5').toBe(true);
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let element: HTMLElement = document.getElementById(diagram.nodes[0].id + '_' + 'content');
            diagram.connectors[0].targetPoint = { x: 300, y: 350 };
            diagram.connectors[0].flip= "Horizontal";
            done();
        });
        it('Checking flip both for connector target  point change', (done: Function) => {
            expect((diagram.connectors[0].wrapper.children[0] as PathElement).absolutePath ===
            'M 0 0 L 0 20 L 100 20 L 100 249.5').toBe(true); 
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let element: HTMLElement = document.getElementById(diagram.nodes[0].id + '_' + 'content');
            diagram.connectors[0].targetPoint = { x: 300, y: 350 };
            diagram.connectors[0].flip= "Both";          
            done();
        });
        it('Checking flip both for connector target  point change', (done: Function) => {
            expect((diagram.connectors[0].wrapper.children[0] as PathElement).absolutePath ===
            'M 100 250 L 100 230 L 0 230 L 0 0.5').toBe(true); 
            done();
        });

    });
    describe('Flip Operation for Ports', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        let mouseEvents: MouseEvents = new MouseEvents();

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram12' });
            document.body.appendChild(ele);
            let node: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100, shape: { type: 'Basic', shape: 'RightTriangle' },
                ports: [{ id: 'port1', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Visible, }]
            };
            let node2: NodeModel = {
                id: 'node2', width: 100, height: 100, offsetX: 400, offsetY: 500, shape: { type: 'Basic', shape: 'RightTriangle' },
                ports: [{ id: 'port2', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Visible, }]
            };
            let connector: ConnectorModel = {
                id: 'connector1', sourcePortID: 'port1', targetPortID: 'port2', sourceID: 'node1', targetID: 'node2', type: 'Orthogonal'
            }
            let connector2: ConnectorModel = {
                id: 'connector2', sourceID: 'node1', targetID: 'node2', type: 'Orthogonal'
            }
            diagram = new Diagram({
                width: '600', height: '530px', nodes: [node, node2],
                connectors: [connector, connector2],
                snapSettings: { constraints: SnapConstraints.ShowLines }
            });

            diagram.appendTo('#diagram12');

        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking without flip', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let element: HTMLElement = document.getElementById(diagram.nodes[0].id + '_' + 'content');
            expect(diagram.nodes[0].offsetX === 100 && diagram.nodes[0].offsetY === 100 &&
                diagram.nodes[0].ports[0].offset.x === 0 && diagram.nodes[0].ports[0].offset.y === 0.5).toBe(true);
            done();
        });
        it('Checking flip horizontal to node ports', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let element: HTMLElement = document.getElementById(diagram.nodes[0].id + '_' + 'content');
            diagram.nodes[0].flip= "Horizontal";
            expect(diagram.nodes[0].offsetX === 100 && diagram.nodes[0].offsetY === 100 &&
                diagram.nodes[0].ports[0].offset.x === 0 && diagram.nodes[0].ports[0].offset.y === 0.5).toBe(true);
            done();
        });
        it('Checking flip Vertical to ports', (done: Function) => {

            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let element: HTMLElement = document.getElementById(diagram.nodes[0].id + '_' + 'content');
            diagram.nodes[0].flip= "Vertical";
            expect(diagram.nodes[0].offsetX === 100 && diagram.nodes[0].offsetY === 100 &&
                diagram.nodes[0].ports[0].offset.x === 0 && diagram.nodes[0].ports[0].offset.y === 0.5).toBe(true);
            done();
        });
        it('Checking flip Both to ports', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let element: HTMLElement = document.getElementById(diagram.nodes[0].id + '_' + 'content');
            diagram.nodes[0].flip= "Both";
            expect(diagram.nodes[0].offsetX === 100 && diagram.nodes[0].offsetY === 100 &&
                diagram.nodes[0].ports[0].offset.x === 0 && diagram.nodes[0].ports[0].offset.y === 0.5).toBe(true);
            done();
        });


    });

    describe('Flip Operation for Bpmn Shapes', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        let mouseEvents: MouseEvents = new MouseEvents();

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram12' });
            document.body.appendChild(ele);
            let node: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100,
                shape: {
                    type: 'Bpmn',
                    shape: 'Event',
                    // Sets event as End and trigger as None
                    event: {
                        event: 'End',
                        trigger: 'Message'
                    }
                }, flip: 'Both',
                ports: [{ id: 'port1', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Visible, }]
            };
            let node2: NodeModel = {
                id: 'node2', width: 100, height: 100, offsetX: 400, offsetY: 100, shape: {
                    type: 'Bpmn',
                    shape: 'Activity',
                    //Sets activity as SubProcess
                    activity: {
                        activity: 'SubProcess',

                        subProcess: {
                            collapsed: true,
                            type: 'Event',
                            events: [{
                                event: 'Intermediate', trigger: 'Timer'
                            }]
                        }
                    }
                }, flip: 'Vertical',
                ports: [{ id: 'port2', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Visible, }]
            };

            let node3: NodeModel = {
                id: 'node3', width: 100, height: 100, offsetX: 100, offsetY: 400, shape: {
                    type: 'Bpmn',
                    shape: 'Activity',
                    //Sets activity as Task
                    activity: {
                        activity: 'Task',
                        //Sets the type of the task as Send
                        task: {
                            type: 'Send'
                        }
                    }
                }, flip: 'Both',
            };
            let connector: ConnectorModel = {
                id: 'connector1', sourcePortID: 'port1', targetPortID: 'port2', sourceID: 'node1', targetID: 'node2', type: 'Orthogonal'
            }
            let connector2: ConnectorModel = {
                id: 'connector2', sourceID: 'node1', targetID: 'node2', type: 'Orthogonal'
            }
            diagram = new Diagram({
                width: '600', height: '530px', nodes: [node, node2],
                connectors: [connector, connector2],
                snapSettings: { constraints: SnapConstraints.ShowLines }, mode: 'Canvas'
            });

            diagram.appendTo('#diagram12');

        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking with bpmn shapes flip', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let element: HTMLElement = document.getElementById(diagram.nodes[0].id + '_' + 'content');
            expect(diagram.nodes[0].offsetX === 100 && diagram.nodes[0].offsetY === 100 &&
                diagram.nodes[0].ports[0].offset.x === 0 && diagram.nodes[0].ports[0].offset.y === 0.5).toBe(true);
            done();
        });
        it('Drag the bpmn shapes with flip', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let element: HTMLElement = document.getElementById(diagram.nodes[0].id + '_' + 'content');
            expect(diagram.nodes[0].offsetX === 100 && diagram.nodes[0].offsetY === 100 &&
                diagram.nodes[0].ports[0].offset.x === 0 && diagram.nodes[0].ports[0].offset.y === 0.5).toBe(true);
            let x: number = diagram.nodes[0].offsetX + diagram.element.offsetLeft;
            let y: number = diagram.nodes[0].offsetY + diagram.element.offsetTop;
            mouseEvents.mouseDownEvent(diagramCanvas, x, y);
            mouseEvents.mouseMoveEvent(diagramCanvas, x + 20, y + 20);
            mouseEvents.mouseMoveEvent(diagramCanvas, x + 30, y + 30);
            mouseEvents.mouseUpEvent(diagramCanvas, x + 30, y + 30);
           
            expect(diagram.nodes[0].offsetX === 130 && diagram.nodes[0].offsetY === 130 &&
                diagram.nodes[0].ports[0].offset.x === 0 && diagram.nodes[0].ports[0].offset.y === 0.5).toBe(true);
            done();
        });

    });

    describe('Flip Operation for Group', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        let mouseEvents: MouseEvents = new MouseEvents();

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram12' });
            document.body.appendChild(ele);
            let node: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100,
                shape: {
                    type: 'Basic', shape: 'RightTriangle'
                },
                ports: [{ id: 'port1', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Visible, }]
            };
            let node2: NodeModel = {
                id: 'node2', width: 100, height: 100, offsetX: 400, offsetY: 500, shape: {
                    type: 'Basic', shape: 'RightTriangle'

                },
                ports: [{ id: 'port2', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Visible, }]
            };
            let group: NodeModel = {
                id: 'group', flip: 'Horizontal',
                children: ['node1', 'node2']
            }
            let connector: ConnectorModel = {
                id: 'connector1', sourcePortID: 'port1', targetPortID: 'port2', sourceID: 'node1', targetID: 'node2', type: 'Orthogonal'
            }
            let connector2: ConnectorModel = {
                id: 'connector2', sourceID: 'node1', targetID: 'node2', type: 'Orthogonal'
            }
            diagram = new Diagram({
                width: '600', height: '530px', nodes: [node, node2, group],
                connectors: [connector, connector2],
                snapSettings: { constraints: SnapConstraints.ShowLines }, mode: 'Canvas'
            });

            diagram.appendTo('#diagram12');

        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking with group flip', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let element: HTMLElement = document.getElementById(diagram.nodes[0].id + '_' + 'content');
            diagram.nodes[2].flip= 'Both';
            expect(diagram.nodes[0].offsetX === 100 && diagram.nodes[0].offsetY === 100 &&
                diagram.nodes[0].ports[0].offset.x === 0 && diagram.nodes[0].ports[0].offset.y === 0.5).toBe(true);
            done();
        });


    })

    describe('Flip Operation for imagein canvas', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        let mouseEvents: MouseEvents = new MouseEvents();

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram12' });
            document.body.appendChild(ele);
            let node: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100,
                shape: {
                    type: 'Image',
                    source: 'http://www.syncfusion.com/content/images/nuget/sync_logo_icon.png'
                }, flip: 'Horizontal',
                ports: [{ id: 'port1', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Visible, }]
            };
            let node2: NodeModel = {
                id: 'node2', width: 100, height: 100, offsetX: 100, offsetY: 300,
                shape: {
                    type: 'Image',
                    source: 'http://www.syncfusion.com/content/images/nuget/sync_logo_icon.png'
                }, flip: 'Both',
                ports: [{ id: 'port1', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Visible, }]
            };
            let node3: NodeModel = {
                id: 'node3', width: 100, height: 100, offsetX: 100, offsetY: 500,
                shape: {
                    type: 'Image',
                    source: 'http://www.syncfusion.com/content/images/nuget/sync_logo_icon.png'
                }, flip: 'Vertical',
                ports: [{ id: 'port1', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Visible, }]
            };

            diagram = new Diagram({
                width: '600', height: '530px', nodes: [node], mode: 'Canvas',
                snapSettings: { constraints: SnapConstraints.ShowLines },
            });

            diagram.appendTo('#diagram12');

        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking with group flip', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let element: HTMLElement = document.getElementById(diagram.nodes[0].id + '_' + 'content');           
            expect(diagram.nodes[0].offsetX === 100 && diagram.nodes[0].offsetY === 100 &&
                diagram.nodes[0].ports[0].offset.x === 0 && diagram.nodes[0].ports[0].offset.y === 0.5).toBe(true);
            done();
        });
        it('Checking with group flip', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let element: HTMLElement = document.getElementById(diagram.nodes[0].id + '_' + 'content');
            diagram.nodes[0].flip=== 'Vertical';
            expect(diagram.nodes[0].offsetX === 100 && diagram.nodes[0].offsetY === 100 &&
                diagram.nodes[0].ports[0].offset.x === 0 && diagram.nodes[0].ports[0].offset.y === 0.5).toBe(true);
            done();
        });
        it('Checking with group flip', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let element: HTMLElement = document.getElementById(diagram.nodes[0].id + '_' + 'content');
            diagram.nodes[0].flip=== 'Both';
            expect(diagram.nodes[0].offsetX === 100 && diagram.nodes[0].offsetY === 100 &&
                diagram.nodes[0].ports[0].offset.x === 0 && diagram.nodes[0].ports[0].offset.y === 0.5).toBe(true);
            done();
        });


    })

    describe('Connectors-Flip change and Testing ', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        Diagram.Inject(ConnectorBridging);
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagramFlipTest' });
            document.body.appendChild(ele);
            diagram = new Diagram({
                width: '1050px', height: '500px',
                connectors: [
                    {
                        id: 'connector1',
                        type: 'Straight',
                        sourcePoint: { x: 100, y: 100 },
                        targetPoint: { x: 200, y: 200 },
                        flip: "None"
                    },
                    {
                        id: 'connector2',
                        type: 'Straight',
                        sourcePoint: { x: 200, y: 100 },
                        targetPoint: { x: 100, y: 200 },
                        flip: "None"
                    },
                    {
                        id: 'connector3',
                        type: 'Straight',
                        sourcePoint: { x: 400, y: 100 },
                        targetPoint: { x: 500, y: 200 },
                        flip: "None"
                    },
                    {
                        id: 'connector4',
                        type: 'Straight',
                        sourcePoint: { x: 400, y: 200 },
                        targetPoint: { x: 500, y: 300 },
                        flip: "None"
                    },
                ],
                constraints: DiagramConstraints.Default | DiagramConstraints.Bridging
            });
            diagram.appendTo('#diagramFlipTest');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Changing the flip and checking functionality', function (done) {
            expect((diagram.connectors[0].wrapper.children[0] as any).pathData === 'M100 100 L146.46446609406726 146.46446609406726A 5 5 -135 , 1 1 153.53553390593274,153.53553390593274 L199.65 199.65');
            expect((diagram.connectors[1].wrapper.children[0] as any).pathData === 'M200 100 L153.53553390593274 146.46446609406726A 5 5 -45 , 1 0 146.46446609406726,153.53553390593274 L100.35 199.65');
            expect((diagram.connectors[2].wrapper.children[0] as any).pathData === 'M400 100 L499.65 199.65');
            expect((diagram.connectors[3].wrapper.children[0] as any).pathData === 'M400 200 L499.65 299.65');
            diagram.connectors[0].flip = 'Both';
            diagram.connectors[1].flip = 'Both';
            diagram.connectors[2].flip = 'Horizontal';
            diagram.connectors[3].flip = 'Horizontal';
            done();
        });
        it('After changing flip in runtime and checking functionality', function (done) {
            expect((diagram.connectors[0].wrapper.children[0] as any).pathData === 'M200 200 L153.5355339059327 153.53553390593274A 5 5 45 , 1 0 146.46446609406723,146.46446609406726 L100.35 100.35');
            expect((diagram.connectors[1].wrapper.children[0] as any).pathData === 'M100 200 L146.46446609406726 153.5355339059327A 5 5 135 , 1 1 153.5355339059327,146.46446609406723 L199.65 100.35');
            expect((diagram.connectors[2].wrapper.children[0] as any).pathData === 'M500 100 L400.35 199.65');
            expect((diagram.connectors[3].wrapper.children[0] as any).pathData === 'M500 200 L400.35 299.65');
            done();
        });
    });
    describe('FlipMode Operation for node', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        let mouseEvents: MouseEvents = new MouseEvents();

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram12' });
            document.body.appendChild(ele);
            let node: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100, shape: { type: 'Basic', shape: 'RightTriangle' },
                ports: [{ id: 'port1', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Visible, }]
            };
            let node2: NodeModel = {
                id: 'node2', width: 100, height: 100, offsetX: 400, offsetY: 500, shape: { type: 'Basic', shape: 'RightTriangle' },
                ports: [{ id: 'port2', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Visible, }]
            };
            let connector: ConnectorModel = {
                id: 'connector1', sourcePortID: 'port1', targetPortID: 'port2', sourceID: 'node1', targetID: 'node2', type: 'Orthogonal'
            }
            let connector2: ConnectorModel = {
                id: 'connector2', sourceID: 'node1', targetID: 'node2', type: 'Orthogonal'
            }
            diagram = new Diagram({
                width: '600', height: '530px', nodes: [node, node2],
                connectors: [connector, connector2],
                snapSettings: { constraints: SnapConstraints.ShowLines }
            });

            diagram.appendTo('#diagram12');

        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking without flip', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let element: HTMLElement = document.getElementById(diagram.nodes[0].id + '_' + 'content');
            expect(diagram.nodes[0].offsetX === 100 && diagram.nodes[0].offsetY === 100 &&
                diagram.nodes[0].ports[0].offset.x === 0 && diagram.nodes[0].ports[0].offset.y === 0.5).toBe(true);
            done();
        });
        it('Checking flip horizontal to ports', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let element: HTMLElement = document.getElementById(diagram.nodes[0].id + '_' + 'content');
            diagram.nodes[0].flip= "Horizontal";
            expect(diagram.nodes[0].offsetX === 100 && diagram.nodes[0].offsetY === 100 &&
                diagram.nodes[0].ports[0].offset.x === 0 && diagram.nodes[0].ports[0].offset.y === 0.5).toBe(true);
            done();
        });
        it('Checking flip Vertical to ports', (done: Function) => {

            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let element: HTMLElement = document.getElementById(diagram.nodes[0].id + '_' + 'content');
            diagram.nodes[0].flip= "Vertical";
            expect(diagram.nodes[0].offsetX === 100 && diagram.nodes[0].offsetY === 100 &&
                diagram.nodes[0].ports[0].offset.x === 0 && diagram.nodes[0].ports[0].offset.y === 0.5).toBe(true);
            done();
        });
        it('Checking flip Both to ports', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let element: HTMLElement = document.getElementById(diagram.nodes[0].id + '_' + 'content');
            diagram.nodes[0].flip= "Both";
            expect(diagram.nodes[0].offsetX === 100 && diagram.nodes[0].offsetY === 100 &&
                diagram.nodes[0].ports[0].offset.x === 0 && diagram.nodes[0].ports[0].offset.y === 0.5).toBe(true);
            done();
        });
        it('Checking flip horizontal to Label', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let element: HTMLElement = document.getElementById(diagram.nodes[0].id + '_' + 'content');
            diagram.nodes[0].flip= "Horizontal";
            diagram.nodes[0].flipMode= "Label";
            expect(diagram.nodes[0].offsetX === 100 && diagram.nodes[0].offsetY === 100 &&
                diagram.nodes[0].ports[0].offset.x === 0 && diagram.nodes[0].ports[0].offset.y === 0.5).toBe(true);
            done();
        });
        it('Checking flip Vertical to Label', (done: Function) => {

            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let element: HTMLElement = document.getElementById(diagram.nodes[0].id + '_' + 'content');
            diagram.nodes[0].flip= "Vertical";
            expect(diagram.nodes[0].offsetX === 100 && diagram.nodes[0].offsetY === 100 &&
                diagram.nodes[0].ports[0].offset.x === 0 && diagram.nodes[0].ports[0].offset.y === 0.5).toBe(true);
            done();
        });
        it('Checking flip Both to Label', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let element: HTMLElement = document.getElementById(diagram.nodes[0].id + '_' + 'content');
            diagram.nodes[0].flip= "Both";
            expect(diagram.nodes[0].offsetX === 100 && diagram.nodes[0].offsetY === 100 &&
                diagram.nodes[0].ports[0].offset.x === 0 && diagram.nodes[0].ports[0].offset.y === 0.5).toBe(true);
            done();
        });
        it('Checking flip horizontal to All', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let element: HTMLElement = document.getElementById(diagram.nodes[0].id + '_' + 'content');
            diagram.nodes[0].flip= "Horizontal";
            diagram.nodes[0].flipMode= "All";
            expect(diagram.nodes[0].offsetX === 100 && diagram.nodes[0].offsetY === 100 &&
                diagram.nodes[0].ports[0].offset.x === 0 && diagram.nodes[0].ports[0].offset.y === 0.5).toBe(true);
            done();
        });
        it('Checking flip Vertical to All', (done: Function) => {

            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let element: HTMLElement = document.getElementById(diagram.nodes[0].id + '_' + 'content');
            diagram.nodes[0].flip= "Vertical";
            expect(diagram.nodes[0].offsetX === 100 && diagram.nodes[0].offsetY === 100 &&
                diagram.nodes[0].ports[0].offset.x === 0 && diagram.nodes[0].ports[0].offset.y === 0.5).toBe(true);
            done();
        });
        it('Checking flip Both to All', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let element: HTMLElement = document.getElementById(diagram.nodes[0].id + '_' + 'content');
            diagram.nodes[0].flip= "Both";
            expect(diagram.nodes[0].offsetX === 100 && diagram.nodes[0].offsetY === 100 &&
                diagram.nodes[0].ports[0].offset.x === 0 && diagram.nodes[0].ports[0].offset.y === 0.5).toBe(true);
            done();
        });
    });
});