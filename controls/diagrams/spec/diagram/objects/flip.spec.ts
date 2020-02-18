import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { ConnectorModel } from '../../../src/diagram/objects/connector-model';
import { NodeModel, PathModel, FlowShapeModel, TextModel } from '../../../src/diagram/objects/node-model';
import { MouseEvents } from '../interaction/mouseevents.spec';
import { UndoRedo } from '../../../src/diagram/objects/undo-redo';
import { HistoryEntry, History } from '../../../src/diagram/diagram/history';
import { SnapConstraints, PointPortModel, AnnotationModel, PathElement } from '../../../src/diagram/index';
import { PortConstraints, PortVisibility, ConnectorConstraints, NodeConstraints, DecoratorShapes } from '../../../src/diagram/enum/enum';
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
           
            expect(diagram.connectors[0].sourcePoint.x === 200 && diagram.connectors[0].sourcePoint.y === 200 &&
                diagram.connectors[0].targetPoint.x === 400 && diagram.connectors[0].targetPoint.y === 400).toBe(true);
            done();
        });
        it('Checking flip vertical to connector', (done: Function) => {

            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let element: HTMLElement = document.getElementById(diagram.nodes[0].id + '_' + 'content');
            diagram.connectors[0].flip= "Vertical";
           

            expect((diagram.connectors[0].wrapper.children[0] as PathElement).absolutePath ===
            'M 0 0 L 0 20 L 200 20 L 200 199.5').toBe(true);
            done();
        });
        it('Checking flip vertical for connector source point change', (done: Function) => {

            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let element: HTMLElement = document.getElementById(diagram.nodes[0].id + '_' + 'content');
            diagram.connectors[0].sourcePoint = { x: 100, y: 100 };
            diagram.connectors[0].flip= "Horizontal";
           
            expect((diagram.connectors[0].wrapper.children[0] as PathElement).absolutePath ===
            'M 0 0 L 0 20 L 200 20 L 200 199.5').toBe(true);

            done();
        });
        it('Checking flip vertical for connector target  point change', (done: Function) => {

            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let element: HTMLElement = document.getElementById(diagram.nodes[0].id + '_' + 'content');
            diagram.connectors[0].targetPoint = { x: 300, y: 350 };
            diagram.connectors[0].flip= "Horizontal";
           
            expect((diagram.connectors[0].wrapper.children[0] as PathElement).absolutePath ===
            'M 0 0 L 0 20 L 300 20 L 300 299.5').toBe(true); 
            done();
        });
        it('Checking flip both for connector target  point change', (done: Function) => {

            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let element: HTMLElement = document.getElementById(diagram.nodes[0].id + '_' + 'content');
            diagram.connectors[0].targetPoint = { x: 300, y: 350 };
            diagram.connectors[0].flip= "Both";          
           
            expect((diagram.connectors[0].wrapper.children[0] as PathElement).absolutePath ===
            'M 200 0 L 200 20 L 0 20 L 0 249.5').toBe(true); 
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
});