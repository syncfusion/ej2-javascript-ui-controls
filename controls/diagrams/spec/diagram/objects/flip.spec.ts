import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { ConnectorModel } from '../../../src/diagram/objects/connector-model';
import { NodeModel, PathModel, FlowShapeModel, TextModel } from '../../../src/diagram/objects/node-model';
import { MouseEvents } from '../interaction/mouseevents.spec';
import { UndoRedo } from '../../../src/diagram/objects/undo-redo';
import { HistoryEntry, History } from '../../../src/diagram/diagram/history';
import { SnapConstraints, PointPortModel, AnnotationModel, PathElement, ConnectorBridging } from '../../../src/diagram/index';
import { PortConstraints, PortVisibility, ConnectorConstraints, NodeConstraints, DecoratorShapes, DiagramConstraints, FlipDirection, AnnotationConstraints } from '../../../src/diagram/enum/enum';
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
            diagram.nodes[0].flip= FlipDirection.Horizontal;
            expect(diagram.nodes[0].offsetX === 100 && diagram.nodes[0].offsetY === 100).toBe(true);
            done();

        });
        it('Checking flip horizontal after changing node width', (done: Function) => {

            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let element: HTMLElement = document.getElementById(diagram.nodes[0].id + '_' + 'content');
            diagram.nodes[0].width = 400;
            diagram.nodes[0].flip= FlipDirection.Horizontal;
            expect(diagram.nodes[0].offsetX === 100 && diagram.nodes[0].offsetY === 100).toBe(true);
            done();

        });

        it('Checking flip horizontal after changing node height', (done: Function) => {

            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let element: HTMLElement = document.getElementById(diagram.nodes[0].id + '_' + 'content');
            diagram.nodes[0].height = 400;
            diagram.nodes[0].flip= FlipDirection.Horizontal;
            expect(diagram.nodes[0].offsetX === 100 && diagram.nodes[0].offsetY === 100).toBe(true);
            done();

        });
        it('Checking flip horizontal after changing node offsetX', (done: Function) => {

            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let element: HTMLElement = document.getElementById(diagram.nodes[0].id + '_' + 'content');
            diagram.nodes[0].offsetX = 400;
            diagram.nodes[0].flip= FlipDirection.Horizontal;
            expect(diagram.nodes[0].offsetX === 400 && diagram.nodes[0].offsetY === 100).toBe(true);
            done();

        });
        it('Checking flip horizontal after changing node offsetY', (done: Function) => {

            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let element: HTMLElement = document.getElementById(diagram.nodes[0].id + '_' + 'content');
            diagram.nodes[0].offsetY = 400;
            diagram.nodes[0].flip= FlipDirection.Horizontal;
            expect(diagram.nodes[0].offsetX === 400 && diagram.nodes[0].offsetY === 400).toBe(true);
            done();

        });
        it('Checking flip vertical after changing node offsetY', (done: Function) => {

            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let element: HTMLElement = document.getElementById(diagram.nodes[0].id + '_' + 'content');
            diagram.nodes[0].offsetY = 400;
            diagram.nodes[0].flip= FlipDirection.Vertical;
            expect(diagram.nodes[0].offsetX === 400 && diagram.nodes[0].offsetY === 400).toBe(true);
            done();

        });
        it('Checking flip Both after changing node offsetY', (done: Function) => {

            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let element: HTMLElement = document.getElementById(diagram.nodes[0].id + '_' + 'content');
            diagram.nodes[0].offsetY = 400;
            diagram.nodes[0].flip= FlipDirection.Both;
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
            diagram.connectors[0].flip^= FlipDirection.Horizontal;
            done();
        });
        it('Checking flip vertical to connector', (done: Function) => {
            expect(diagram.connectors[0].sourcePoint.x === 400 && diagram.connectors[0].sourcePoint.y === 200 &&
                diagram.connectors[0].targetPoint.x === 200 && diagram.connectors[0].targetPoint.y === 400).toBe(true);
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let element: HTMLElement = document.getElementById(diagram.nodes[0].id + '_' + 'content');
            diagram.connectors[0].flip^= FlipDirection.Vertical;
            done();
        });
        it('Checking flip vertical for connector source point change', (done: Function) => {
            expect((diagram.connectors[0].wrapper.children[0] as PathElement).absolutePath ===
            'M 200 200 L 200 180 L 0 180 L 0 0.5').toBe(true);
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let element: HTMLElement = document.getElementById(diagram.nodes[0].id + '_' + 'content');
            diagram.connectors[0].sourcePoint = { x: 100, y: 100 };
            diagram.connectors[0].flip^= FlipDirection.Horizontal;
            done();
        });
        it('Checking flip vertical for connector target  point change', (done: Function) => {
            expect((diagram.connectors[0].wrapper.children[0] as PathElement).absolutePath ===
            'M 100 0 L 100 20 L 0 20 L 0 99.5').toBe(true);
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let element: HTMLElement = document.getElementById(diagram.nodes[0].id + '_' + 'content');
            diagram.connectors[0].targetPoint = { x: 300, y: 350 };
            diagram.connectors[0].flip^= FlipDirection.Horizontal;
            done();
        });
        it('Checking flip both for connector target  point change', (done: Function) => {
            // expect((diagram.connectors[0].wrapper.children[0] as PathElement).absolutePath ===
            // 'M 0 0 L 0 20 L 100 20 L 100 249.5').toBe(true); 
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let element: HTMLElement = document.getElementById(diagram.nodes[0].id + '_' + 'content');
            diagram.connectors[0].targetPoint = { x: 300, y: 350 };
            diagram.connectors[0].flip= FlipDirection.Both;          
            done();
        });
        it('Checking flip both for connector target  point change', (done: Function) => {
            // expect((diagram.connectors[0].wrapper.children[0] as PathElement).absolutePath ===
            // 'M 100 250 L 100 230 L 0 230 L 0 0.5').toBe(true); 
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
            diagram.nodes[0].flip= FlipDirection.Horizontal;
            expect(diagram.nodes[0].offsetX === 100 && diagram.nodes[0].offsetY === 100 &&
                diagram.nodes[0].ports[0].offset.x === 0 && diagram.nodes[0].ports[0].offset.y === 0.5).toBe(true);
            done();
        });
        it('Checking flip Vertical to ports', (done: Function) => {

            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let element: HTMLElement = document.getElementById(diagram.nodes[0].id + '_' + 'content');
            diagram.nodes[0].flip= FlipDirection.Vertical;
            expect(diagram.nodes[0].offsetX === 100 && diagram.nodes[0].offsetY === 100 &&
                diagram.nodes[0].ports[0].offset.x === 0 && diagram.nodes[0].ports[0].offset.y === 0.5).toBe(true);
            done();
        });
        it('Checking flip Both to ports', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let element: HTMLElement = document.getElementById(diagram.nodes[0].id + '_' + 'content');
            diagram.nodes[0].flip= FlipDirection.Both;
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
                }, flip: FlipDirection.Both,
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
                }, flip: FlipDirection.Vertical,
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
                }, flip: FlipDirection.Both,
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
                id: 'group', flip: FlipDirection.Horizontal,
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
            diagram.nodes[2].flip= FlipDirection.Both;
            diagram.dataBind();
            console.log(diagram.nodes[0].offsetX, diagram.nodes[0].offsetY ,
                diagram.nodes[0].ports[0].offset.x , diagram.nodes[0].ports[0].offset.y );
            expect(diagram.nodes[0].offsetX === 400 && diagram.nodes[0].offsetY === 500 &&
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
                }, flip: FlipDirection.Horizontal,
                ports: [{ id: 'port1', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Visible, }]
            };
            let node2: NodeModel = {
                id: 'node2', width: 100, height: 100, offsetX: 100, offsetY: 300,
                shape: {
                    type: 'Image',
                    source: 'http://www.syncfusion.com/content/images/nuget/sync_logo_icon.png'
                }, flip: FlipDirection.Both,
                ports: [{ id: 'port1', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Visible, }]
            };
            let node3: NodeModel = {
                id: 'node3', width: 100, height: 100, offsetX: 100, offsetY: 500,
                shape: {
                    type: 'Image',
                    source: 'http://www.syncfusion.com/content/images/nuget/sync_logo_icon.png'
                }, flip: FlipDirection.Vertical,
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
            diagram.nodes[0].flip=== FlipDirection.Vertical;
            expect(diagram.nodes[0].offsetX === 100 && diagram.nodes[0].offsetY === 100 &&
                diagram.nodes[0].ports[0].offset.x === 0 && diagram.nodes[0].ports[0].offset.y === 0.5).toBe(true);
            done();
        });
        it('Checking with group flip', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let element: HTMLElement = document.getElementById(diagram.nodes[0].id + '_' + 'content');
            diagram.nodes[0].flip=== FlipDirection.Both;
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
                        flip: FlipDirection.None
                    },
                    {
                        id: 'connector2',
                        type: 'Straight',
                        sourcePoint: { x: 200, y: 100 },
                        targetPoint: { x: 100, y: 200 },
                        flip: FlipDirection.None
                    },
                    {
                        id: 'connector3',
                        type: 'Straight',
                        sourcePoint: { x: 400, y: 100 },
                        targetPoint: { x: 500, y: 200 },
                        flip: FlipDirection.None
                    },
                    {
                        id: 'connector4',
                        type: 'Straight',
                        sourcePoint: { x: 400, y: 200 },
                        targetPoint: { x: 500, y: 300 },
                        flip: FlipDirection.None
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
            diagram.connectors[0].flip = FlipDirection.Both;
            diagram.connectors[1].flip = FlipDirection.Both;
            diagram.connectors[2].flip = FlipDirection.Horizontal;
            diagram.connectors[3].flip = FlipDirection.Horizontal;
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
            diagram.nodes[0].flip= FlipDirection.Horizontal;
            expect(diagram.nodes[0].offsetX === 100 && diagram.nodes[0].offsetY === 100 &&
                diagram.nodes[0].ports[0].offset.x === 0 && diagram.nodes[0].ports[0].offset.y === 0.5).toBe(true);
            done();
        });
        it('Checking flip Vertical to ports', (done: Function) => {

            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let element: HTMLElement = document.getElementById(diagram.nodes[0].id + '_' + 'content');
            diagram.nodes[0].flip= FlipDirection.Vertical;
            expect(diagram.nodes[0].offsetX === 100 && diagram.nodes[0].offsetY === 100 &&
                diagram.nodes[0].ports[0].offset.x === 0 && diagram.nodes[0].ports[0].offset.y === 0.5).toBe(true);
            done();
        });
        it('Checking flip Both to ports', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let element: HTMLElement = document.getElementById(diagram.nodes[0].id + '_' + 'content');
            diagram.nodes[0].flip= FlipDirection.Both;
            expect(diagram.nodes[0].offsetX === 100 && diagram.nodes[0].offsetY === 100 &&
                diagram.nodes[0].ports[0].offset.x === 0 && diagram.nodes[0].ports[0].offset.y === 0.5).toBe(true);
            done();
        });
        it('Checking flip horizontal to Label', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let element: HTMLElement = document.getElementById(diagram.nodes[0].id + '_' + 'content');
            diagram.nodes[0].flip= FlipDirection.Horizontal;
            diagram.nodes[0].flipMode= "Label";
            expect(diagram.nodes[0].offsetX === 100 && diagram.nodes[0].offsetY === 100 &&
                diagram.nodes[0].ports[0].offset.x === 0 && diagram.nodes[0].ports[0].offset.y === 0.5).toBe(true);
            done();
        });
        it('Checking flip Vertical to Label', (done: Function) => {

            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let element: HTMLElement = document.getElementById(diagram.nodes[0].id + '_' + 'content');
            diagram.nodes[0].flip= FlipDirection.Vertical;
            expect(diagram.nodes[0].offsetX === 100 && diagram.nodes[0].offsetY === 100 &&
                diagram.nodes[0].ports[0].offset.x === 0 && diagram.nodes[0].ports[0].offset.y === 0.5).toBe(true);
            done();
        });
        it('Checking flip Both to Label', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let element: HTMLElement = document.getElementById(diagram.nodes[0].id + '_' + 'content');
            diagram.nodes[0].flip= FlipDirection.Both;
            expect(diagram.nodes[0].offsetX === 100 && diagram.nodes[0].offsetY === 100 &&
                diagram.nodes[0].ports[0].offset.x === 0 && diagram.nodes[0].ports[0].offset.y === 0.5).toBe(true);
            done();
        });
        it('Checking flip horizontal to All', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let element: HTMLElement = document.getElementById(diagram.nodes[0].id + '_' + 'content');
            diagram.nodes[0].flip= FlipDirection.Horizontal;
            diagram.nodes[0].flipMode= "All";
            expect(diagram.nodes[0].offsetX === 100 && diagram.nodes[0].offsetY === 100 &&
                diagram.nodes[0].ports[0].offset.x === 0 && diagram.nodes[0].ports[0].offset.y === 0.5).toBe(true);
            done();
        });
        it('Checking flip Vertical to All', (done: Function) => {

            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let element: HTMLElement = document.getElementById(diagram.nodes[0].id + '_' + 'content');
            diagram.nodes[0].flip= FlipDirection.Vertical;
            expect(diagram.nodes[0].offsetX === 100 && diagram.nodes[0].offsetY === 100 &&
                diagram.nodes[0].ports[0].offset.x === 0 && diagram.nodes[0].ports[0].offset.y === 0.5).toBe(true);
            done();
        });
        it('Checking flip Both to All', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let element: HTMLElement = document.getElementById(diagram.nodes[0].id + '_' + 'content');
            diagram.nodes[0].flip= FlipDirection.Both;
            expect(diagram.nodes[0].offsetX === 100 && diagram.nodes[0].offsetY === 100 &&
                diagram.nodes[0].ports[0].offset.x === 0 && diagram.nodes[0].ports[0].offset.y === 0.5).toBe(true);
            done();
        });
    });
    describe('Flip Operation for node', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        let mouseEvents: MouseEvents = new MouseEvents();

        beforeAll((): void => {
            ele = createElement('div', { id: 'flipDiagram' });
            document.body.appendChild(ele);
            let selArray: (NodeModel | ConnectorModel)[] = [];
            let node: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100, shape: { type: 'Basic', shape: 'RightTriangle' },

            };
            diagram = new Diagram({
                width: '600', height: '530px', nodes: [node],
                snapSettings: { constraints: SnapConstraints.ShowLines },
                constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting
            });

            diagram.appendTo('#flipDiagram');

        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('895070-Checking horizontally flipped node is able to move or not', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            diagram.nodes[0].flip= FlipDirection.Horizontal;
            diagram.dataBind();
            mouseEvents.dragAndDropEvent(diagramCanvas, 110, 110, 200, 100);
            expect(diagram.selectedItems.nodes[0].id === 'node1').toBe(true);
            done();
        });
        it('895070-Checking vertically flipped node is able to move or not', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            diagram.nodes[0].flip= FlipDirection.Vertical;
            diagram.dataBind();
            mouseEvents.dragAndDropEvent(diagramCanvas, 210, 110, 300, 100);
            expect(diagram.selectedItems.nodes[0].id === 'node1').toBe(true);
            done();
        });
        it('895070-Checking Both horizontally and vertically flipped node is able to move or not', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            diagram.nodes[0].flip= FlipDirection.Both;
            diagram.dataBind();
            mouseEvents.dragAndDropEvent(diagramCanvas, 310, 110, 100, 100);
            expect(diagram.selectedItems.nodes[0].id === 'node1').toBe(true);
            done();
        });
    });

    describe('927858 - Flip revamp for nodes ', () => {
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
            ele = createElement('div', { id: 'diagramFlipNodes' });
            document.body.appendChild(ele);
            function horizontalPorts() {
                let port: PointPortModel[] = [
                    { id: 'port1', shape: 'Circle', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Visible, width: 22, height: 22 },
                    { id: 'port2', shape: 'Square', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Visible, width: 22, height: 22 },
                ];
                return port;
            }
            function verticalPorts() {
                let port: PointPortModel[] = [
                    { id: 'port1', shape: 'Circle', offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Visible, width: 22, height: 22 },
                    { id: 'port2', shape: 'Square', offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Visible, width: 22, height: 22 },
              
                ];
                return port;
            }
            diagram = new Diagram({
                width: '1050px', height: '800px',
                nodes: [
                    //Group1-Horizontal
                    {id:'node1',offsetX:100,offsetY:100,style:{fill:'red'},flip:FlipDirection.Both,flipMode:'PortAndLabel',annotations:[{content:'Node1',offset:{x:0,y:1}}],ports:horizontalPorts()},
                    {id:'node2',offsetX:150,offsetY:150,annotations:[{content:'Node2-text1',offset:{x:0,y:1}},{content:'Node2-text2',offset:{x:1,y:0}}],ports:horizontalPorts()},
                    {id:'group1',children:['node1','node2'],flip:FlipDirection.Horizontal,flipMode:'Label',annotations:[{content:'Group1',offset:{x:0,y:1}}],padding:{left:30,right:30,top:30,bottom:30},style:{fill:'yellow'},ports:horizontalPorts()},
                    { id: 'node3',height:50,width:50, offsetX: 300, offsetY: 100,flip:FlipDirection.Vertical,flipMode:'PortAndLabel', annotations: [{ content: 'Node3', offset: { x: 1.2, y: 0 } }], ports: verticalPorts(),shape:{type:'HTML',content:'<div style="width:50px;height:50px;background:green"><button>node3</button></div>'} },
                       
                    { id: 'node4',height:50,width:50, offsetX: 350, offsetY: 180,flip:FlipDirection.Both,flipMode:'PortAndLabel', annotations: [{ content: 'Node4', offset: { x: 1, y: 0 } }], ports: horizontalPorts(),shape:{type:'Image',source:'data:image/jpeg;base64,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'} },
                        
                    //NormalNode-Horizpntal
                    {id:'node5',offsetX:500,offsetY:100,flip:FlipDirection.Horizontal,flipMode:'LabelAndLabelText',annotations:[{content:'Node5',offset:{x:0,y:1}},{content:'Node5-text2',offset:{x:1,y:0}}],ports:horizontalPorts()},
                
                    //NormalNode-Vertical
                    {id:'node6',offsetX:600,offsetY:100,flip:FlipDirection.Vertical,flipMode:'PortAndLabel',annotations:[{content:'Node6',offset:{x:1,y:0}}],ports:verticalPorts()},
                
                    //Bpmn-Node
                    {id:'node7',width:100,height:100,offsetX:100,flip:FlipDirection.Horizontal,offsetY:300,shape:{type:'Bpmn',shape:'Activity',activity:{task:{type:'Service'}}},annotations:[{content:'Node7',offset:{x:0,y:1}}],ports:horizontalPorts()},
                
                    //Native-Node
                    {id:'node8',width:100,height:100,offsetX:300,offsetY:300,flip:FlipDirection.Horizontal,flipMode:'Label',shape:{type:'Native',content:'<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><polygon points="10,90 90,90 10,10" fill="blue" stroke="black" stroke-width="2" /></svg>'},
                    annotations:[{content:'Node8',offset:{x:0,y:1}}],ports:horizontalPorts()},
                    { id: 'node9',width:70,height:50, offsetX: 550, offsetY: 200,flip:FlipDirection.Horizontal,flipMode:'LabelText', annotations: [{ content: 'Node9', offset: { x: 0, y: 1 } }], ports: horizontalPorts(),shape:{type:'Text',content:'TextNode'} },
                    {id:'polygon',width:120,height:120,flip:FlipDirection.Horizontal,flipMode:'PortAndLabelText',shape: { type: 'Basic', shape: 'Polygon', points: [{ x: 35, y: 0 }, { x: 65, y: 0 }, { x: 100, y: 35 }, { x: 100, y: 65 }, { x: 65, y: 100 }, { x: 35, y: 100 }, { x: 0, y: 65 }, { x: 0, y: 35 }] },
                    annotations:[{content:'polygon',offset:{x:0.2,y:1}}],ports:horizontalPorts(),offsetX:800,offsetY:100}
                
                ],
            });
            diagram.appendTo('#diagramFlipNodes');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking flip for group and child at initial rendering', function (done) {
            let group = diagram.nameTable['group1'];
            expect(group.wrapper.children[0].children[0].flip === FlipDirection.Vertical).toBe(true);
            expect(group.wrapper.children[2].flip === FlipDirection.Horizontal).toBe(true);
            done();
        });
        it('Changing the flip at runtime for group node', function (done) {
            let group = diagram.nameTable['group1'];
            group.flip^= FlipDirection.Vertical;
            diagram.dataBind();
            expect(group.wrapper.children[0].children[0].flip === FlipDirection.None).toBe(true);
            expect(group.wrapper.children[2].flip === FlipDirection.Both).toBe(true);
            done();
        });
        it('Changing the flip mode at runtime for group node', function (done) {
            let group = diagram.nameTable['group1'];
            group.flipMode = 'PortAndLabel';
            diagram.dataBind();
            expect(group.wrapper.children[0].flipMode === 'PortAndLabel').toBe(true);
            expect(group.wrapper.children[2].flipMode === 'PortAndLabel').toBe(true);
            group.flipMode = 'Port';
            diagram.dataBind();
            expect(group.wrapper.children[0].flipMode === 'Port').toBe(true);
            expect(group.wrapper.children[2].flipMode === 'Port').toBe(true);
            done();
        });
        it('Changing the flip and flip mode for image node', function (done) {
            let imageNode = diagram.nameTable['node4'];
            imageNode.flip = FlipDirection.Vertical;
            imageNode.flipMode = 'Port';
            diagram.dataBind();
            expect(imageNode.wrapper.flipMode === 'Port').toBe(true);
            expect(imageNode.wrapper.flip === FlipDirection.Vertical).toBe(true);
            done();
        });
        it('Changing the flip and flip mode for html node', function (done) {
            let htmlNode = diagram.nameTable['node3'];
            htmlNode.flip ^= FlipDirection.Horizontal;
            htmlNode.flipMode = 'PortAndLabelText';
            diagram.dataBind();
            expect(htmlNode.wrapper.flipMode === 'PortAndLabelText').toBe(true);
            expect(htmlNode.wrapper.flip === FlipDirection.Both).toBe(true);
            done();
        });
        it('Changing the flip and flip mode for text and native node', function (done) {
            let nativeNode = diagram.nameTable['node8'];
            let textNode = diagram.nameTable['node9'];
            nativeNode.flip ^= FlipDirection.Horizontal;
            nativeNode.flipMode = 'None';
            diagram.dataBind();
            expect(nativeNode.wrapper.flipMode === 'None').toBe(true);
            expect(nativeNode.wrapper.flip === FlipDirection.None).toBe(true);
            textNode.flip = FlipDirection.Both;
            textNode.flipMode = 'All';
            diagram.dataBind();
            expect(textNode.wrapper.flipMode === 'All').toBe(true);
            expect(textNode.wrapper.flip === FlipDirection.Both).toBe(true);
            done();
        });
        it('Changing the flip and flip mode for bpmn and basic node', function (done) {
            let basicNode = diagram.nameTable['node5'];
            let bpmnNode = diagram.nameTable['node7'];
            basicNode.flip ^= FlipDirection.Vertical;
            basicNode.flipMode = 'LabelText';
            diagram.dataBind();
            expect(basicNode.wrapper.flipMode === 'LabelText' && basicNode.wrapper.children[1].flipMode === 'LabelText').toBe(true);
            expect(basicNode.wrapper.flip === FlipDirection.Both && basicNode.wrapper.children[1].flip === FlipDirection.Both).toBe(true);
            bpmnNode.flip = FlipDirection.Vertical;
            bpmnNode.flipMode = 'PortAndLabel';
            diagram.dataBind();
            expect(bpmnNode.wrapper.flipMode === 'PortAndLabel').toBe(true);
            expect(bpmnNode.wrapper.flip === FlipDirection.Vertical).toBe(true);
            done();
        });
        it('Changing the port offset at runtime after flip', function (done) {
            let polygon = diagram.nameTable['polygon'];
            polygon.ports[1].offset.x = 0.8;
            diagram.dataBind();
            const roundedNum = Math.round(polygon.wrapper.children[3].position.x * 10) / 10;
            expect(roundedNum === 0.2).toBe(true);
            done();
        });
    });

    describe('957467 - Annotation interaction after flip', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents = new MouseEvents();
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagramLabelInteractionFlip' });
            document.body.appendChild(ele);
            diagram = new Diagram({
                width: '1050px', height: '800px',
                nodes: [
                    {
                        id: 'node1', width: 150, height: 100, offsetX: 300, offsetY: 300,
                        flip: FlipDirection.Horizontal, flipMode: 'Label',
                        annotations: [{
                            content: 'node Annotation', width: 50, offset: { x: 0.2, y: 0.5 },
                            constraints: AnnotationConstraints.Interaction
                        }], style: { fill: 'yellow' }, shape: { type: 'Basic', shape: 'RightTriangle' }
                    }
                ]
            });
            diagram.appendTo('#diagramLabelInteractionFlip');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Select-annotation after flip', function (done) {
            let diagramCanvas = document.getElementById(diagram.element.id + 'content');
            mouseEvents.mouseMoveEvent(diagramCanvas, 345, 300);
            mouseEvents.mouseDownEvent(diagramCanvas, 345, 300);
            mouseEvents.mouseUpEvent(diagramCanvas, 345, 300);
            let selectedAnnotation = (diagram.selectedItems as any).annotation;
            expect(selectedAnnotation !== undefined).toBe(true);
            done();
        });
        it('Resize-annotation after flip', function (done) {
            let diagramCanvas = document.getElementById(diagram.element.id + 'content');
            mouseEvents.mouseMoveEvent(diagramCanvas, 345, 300);
            mouseEvents.mouseDownEvent(diagramCanvas, 345, 300);
            mouseEvents.mouseUpEvent(diagramCanvas, 345, 300);
            let selectedAnnotation;
            let resizeEastThumb = document.getElementById('resizeEast');
            if (resizeEastThumb) {
                let bounds: any = resizeEastThumb.getBoundingClientRect();
                mouseEvents.mouseMoveEvent(diagramCanvas, bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
                mouseEvents.mouseDownEvent(diagramCanvas, bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
                mouseEvents.mouseMoveEvent(diagramCanvas, bounds.x + bounds.width / 2 + 30, bounds.y + bounds.height / 2);
                mouseEvents.mouseUpEvent(diagramCanvas, bounds.x + bounds.width / 2 + 30, bounds.y + bounds.height / 2);
                selectedAnnotation = (diagram.selectedItems as any).annotation;
            }
            expect(selectedAnnotation && selectedAnnotation.width !== 50).toBe(true);
            done();
        });
        it('Rotate-annotation after flip', function (done) {
            let diagramCanvas = document.getElementById(diagram.element.id + 'content');
            let rotateThumb = document.getElementById('rotateThumb');
            let selectedAnnotation;
            if (rotateThumb) {
                let bounds: any = rotateThumb.getBoundingClientRect();
                mouseEvents.mouseMoveEvent(diagramCanvas, bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
                mouseEvents.mouseDownEvent(diagramCanvas, bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
                mouseEvents.mouseMoveEvent(diagramCanvas, bounds.x + bounds.width / 2 + 20, bounds.y + bounds.height / 2 + 20);
                mouseEvents.mouseUpEvent(diagramCanvas, bounds.x + bounds.width / 2 + 20, bounds.y + bounds.height / 2 + 20);
                selectedAnnotation = (diagram.selectedItems as any).annotation;
            }
            expect(selectedAnnotation && selectedAnnotation.rotateAngle !== 0).toBe(true);
            done();
        });
        it('Drag-annotation after flip', function (done) {
            let diagramCanvas = document.getElementById(diagram.element.id + 'content');
            let selector = document.getElementById(diagram.element.id + '_SelectorElement');
            let selectedAnnotation;
            let bounds: any;
            if (selector) {
                bounds = selector.getBoundingClientRect();
                mouseEvents.mouseMoveEvent(diagramCanvas, bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
                mouseEvents.mouseDownEvent(diagramCanvas, bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
                mouseEvents.mouseMoveEvent(diagramCanvas, bounds.x + bounds.width / 2 + 20, bounds.y + bounds.height / 2 + 20);
                mouseEvents.mouseUpEvent(diagramCanvas, bounds.x + bounds.width / 2 + 20, bounds.y + bounds.height / 2 + 20);
                selectedAnnotation = (diagram.selectedItems as any).annotation;
            }
            let curBounds: any = selector.getBoundingClientRect();
            expect(selectedAnnotation && bounds.x < curBounds.x).toBe(true);
            done();
        });
    });

    describe('958329 - Grouping nodes and a connector, then applying a flip, does not work correctly', () => {
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
            ele = createElement('div', { id: 'diagramFlipGroupConnectors' });
            document.body.appendChild(ele);
            diagram = new Diagram({
                width: '1050px', height: '800px',
                nodes: [
                    {
                        id: 'node1',
                        height: 100,
                        width: 100,
                        offsetX: 100,
                        offsetY: 100,
                        annotations: [{ content: 'Node1' }],
                    },
                    {
                        id: 'node2',
                        height: 100,
                        width: 100,
                        offsetX: 200,
                        offsetY: 200,
                        annotations: [{ content: 'Node2' }],
                    },
                    {
                        id: 'node3',
                        height: 100,
                        width: 100,
                        offsetX: 300,
                        offsetY: 300,
                        annotations: [{ content: 'Node3' }],
                    },
                    // {id:'group',children:['node1','node2','node3','connector1','connectors2'],flip:1}
                ],
                connectors: [
                    {
                        id: 'connector1',
                        type: 'Straight',
                        sourceDecorator: { shape: 'Circle' },
                        sourceID: 'node1',
                        targetPoint: { x: 350, y: 70 },
                    },
                    {
                        id: 'connectors2',
                        type: 'Straight',
                        sourceDecorator: { shape: 'IndentedArrow' },
                        targetDecorator: { shape: 'OutdentedArrow' },
                        sourceID: 'node2',
                        targetPoint: { x: 300, y: 200 },
                    },
                ]
            });
            diagram.appendTo('#diagramFlipGroupConnectors');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Flipping Group with connectors Horizontally', function (done) {
            (diagram).selectAll();
            // Groups the selected nodes and connectors in the diagram.
            (diagram).group();
            const groupNode = (diagram).nodes[
                (diagram).nodes.length - 1
            ];
            groupNode.flip = FlipDirection.Horizontal;
            diagram.dataBind();
            let connector: ConnectorModel = diagram.connectors[0];

            expect(connector.sourceID === 'node1' && connector.targetPoint.x === 50).toBe(true);
            done();
        });
        it('Flipping Group with connectors Vertically', function (done) {
            const groupNode = (diagram).nodes[
                (diagram).nodes.length - 1
            ];
            groupNode.flip = FlipDirection.Vertical;
            diagram.dataBind();
            let connector: ConnectorModel = diagram.connectors[0];

            expect(connector.sourceID === 'node1' && connector.targetPoint.x === 350 && connector.targetPoint.y === 330).toBe(true);
            done();
        });
        it('Flipping Group with connectors Both flip', function (done) {
            const groupNode = (diagram).nodes[
                (diagram).nodes.length - 1
            ];
            groupNode.flip = FlipDirection.Both;
            diagram.dataBind();
            let connector: ConnectorModel = diagram.connectors[0];

            expect(connector.sourceID === 'node1' && connector.targetPoint.x === 50 && connector.targetPoint.y === 330).toBe(true);
            done();
        });
    });
});